"""
ism_ipca.py
===========
Replicacao do Inflation Shock Momentum (Lansing & Shapiro, FRBSF WP 2026-10)
para o IPCA brasileiro, no nivel de subitem do SNIPC.

Modulo reutilizavel. Use no Jupyter com:

    import ism_ipca as ism
    painel = ism.construir_painel()
    res    = ism.calcular_ism(painel)

Ou pela linha de comando para gerar os arquivos:

    python ism_ipca.py

--------------------------------------------------------------------------
NOTAS DE DESENHO
--------------------------------------------------------------------------
1. FONTE. API SIDRA (apisidra.ibge.gov.br). O limite de 5.000 celulas e da
   interface web, nao da API. Paginamos por blocos de anos so para evitar
   timeout.

2. CHAVE DE JUNCAO. O prefixo numerico de 7 digitos do campo D4N e o codigo
   do SNIPC e e estavel entre estruturas de POF. O ID do SIDRA (D4C) NAO e:
   muda sempre que o nome do subitem muda. Nunca junte por D4C.

3. ENCADEAMENTO ENTRE POFs. Quando um subitem nao existe na estrutura
   vigente, usamos a variacao do item pai (4 digitos) com peso ZERO; se o
   item pai tambem nao existir, subimos ao subgrupo (2 digitos). Peso zero
   garante que a imputacao nao entra no IPCA nem no S+/S-, mas mantem a
   serie continua para a janela rolante. Precedente: BCB, Estudo Especial
   24/2018, nota de rodape 5.

4. DESSAZONALIZADO. As tabelas 661/662, 2942, 1420 e 7061 sao carregadas,
   mas ATENCAO: o IBGE gera fatores sazonais apenas para subitens do grupo
   Alimentacao e bebidas (Nota metodologica 01/2021). Verificado
   empiricamente: ~20% da cesta por peso. Por isso o default do estimador e
   `sazonalidade="dummies"`, que trata os nove grupos.

5. ESTRUTURA 1999-2006. As tabelas 661 (variacao) e 662 (peso) sao
   separadas, ao contrario das demais que trazem tudo junto. O ingestor ja
   trata isso via o par (tabela_variacao, tabela_peso).
"""

from __future__ import annotations

import gzip
import json
import time
import urllib.request
from dataclasses import dataclass

import numpy as np
import pandas as pd
import datetime
_FIM_ATUAL = datetime.date.today().year * 100 + datetime.date.today().month

# ---------------------------------------------------------------- estruturas

@dataclass(frozen=True)
class Estrutura:
    rotulo: str
    inicio: int
    fim: int
    t_var: int          # tabela da variacao mensal bruta
    t_peso: int         # tabela do peso mensal bruto
    t_var_sa: int       # tabela da variacao mensal dessazonalizada
    t_peso_sa: int      # tabela do peso mensal dessazonalizado


ESTRUTURAS = [
    Estrutura("POF_1996", 199908, 200606,  655,  656,  661,  662),
    Estrutura("POF_2003", 200607, 201112, 2938, 2938, 2942, 2942),
    Estrutura("POF_2009", 201201, 201912, 1419, 1419, 1420, 1420),
    Estrutura("POF_2018", 202001, _FIM_ATUAL, 7060, 7060, 7061, 7061),
]

V_VAR, V_PESO = 63, 66           # bruto
V_VAR_SA, V_PESO_SA = 306, 309   # dessazonalizado

GRUPOS = {
    "1": "Alimentacao e bebidas", "2": "Habitacao",
    "3": "Artigos de residencia", "4": "Vestuario",
    "5": "Transportes", "6": "Saude e cuidados pessoais",
    "7": "Despesas pessoais", "8": "Educacao", "9": "Comunicacao",
}

BLOCO_ANOS = 4

# ------------------------------------------------------------------ download

def _fetch(url: str, tentativas: int = 4):
    for i in range(tentativas):
        try:
            req = urllib.request.Request(url, headers={"Accept-Encoding": "identity"})
            raw = urllib.request.urlopen(req, timeout=300).read()
            if raw[:2] == b"\x1f\x8b":
                raw = gzip.decompress(raw)
            return json.loads(raw.decode("utf-8"))
        except Exception:
            if i == tentativas - 1:
                raise
            time.sleep(3 * (i + 1))


def _num(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return None


def baixar(tabela: int, variavel: int, ini: int, fim: int, verbose=True) -> dict:
    """Retorna {(mes_yyyymm, codigo_snipc): valor}, paginando por blocos de anos."""
    out = {}
    a0, a1 = ini // 100, fim // 100
    for y in range(a0, a1 + 1, BLOCO_ANOS):
        p_ini = max(ini, y * 100 + 1)
        p_fim = min(fim, min(y + BLOCO_ANOS - 1, a1) * 100 + 12)
        url = (f"https://apisidra.ibge.gov.br/values/t/{tabela}/n1/all"
               f"/v/{variavel}/p/{p_ini}-{p_fim}/c315/all")
        dados = _fetch(url)
        for reg in dados[1:]:
            cod = reg["D4N"].split(".")[0]
            if cod.isdigit():
                out[(reg["D3C"], cod)] = _num(reg["V"])
        if verbose:
            print(f"    t{tabela}/v{variavel} {p_ini}-{p_fim}: {len(dados)-1:>6} valores")
    return out


# -------------------------------------------------------------------- painel

def construir_painel(desde: int = 200607, verbose: bool = True) -> pd.DataFrame:
    """
    Painel continuo de subitens com variacao bruta, variacao dessazonalizada
    e peso, encadeado entre as estruturas de POF.

    desde=199908 pega a serie completa (27 anos, quebra pesada de 2006).
    desde=200607 e o default (20 anos, duas quebras leves).
    """
    cache, universo = {}, set()

    for e in ESTRUTURAS:
        if e.fim < desde:
            continue
        ini = max(e.inicio, desde)
        if verbose:
            print(f"\n[{e.rotulo}] {ini}-{e.fim}")
        var = baixar(e.t_var, V_VAR, ini, e.fim, verbose)
        peso = baixar(e.t_peso, V_PESO, ini, e.fim, verbose)
        var_sa = baixar(e.t_var_sa, V_VAR_SA, ini, e.fim, verbose)
        cache[e.rotulo] = (var, peso, var_sa)
        universo |= {c for _, c in var if len(c) == 7}

    universo = sorted(universo)
    if verbose:
        print(f"\nuniverso de subitens: {len(universo)}")

    linhas = []
    for rot, (var, peso, var_sa) in cache.items():
        meses = sorted({m for m, _ in var})
        presentes = {c for _, c in var if len(c) == 7}
        for mes in meses:
            for cod in universo:
                if cod in presentes and (mes, cod) in var:
                    v = var[(mes, cod)]
                    vsa = var_sa.get((mes, cod), v)
                    p, origem = peso.get((mes, cod)), "publicado"
                elif (mes, cod[:4]) in var:                      # fallback item
                    v = var[(mes, cod[:4])]
                    vsa = var_sa.get((mes, cod[:4]), v)
                    p, origem = 0.0, "imputado_item"
                elif (mes, cod[:2]) in var:                      # fallback subgrupo
                    v = var[(mes, cod[:2])]
                    vsa = var_sa.get((mes, cod[:2]), v)
                    p, origem = 0.0, "imputado_subgrupo"
                else:
                    continue
                if v is None:
                    continue
                linhas.append((mes, cod, v, vsa if vsa is not None else v,
                               p, origem, rot))

    df = pd.DataFrame(linhas, columns=["mes", "subitem_code", "var_mensal",
                                       "var_mensal_sa", "peso", "origem",
                                       "estrutura"])
    df["item_code"] = df.subitem_code.str[:4]
    df["subgrupo_code"] = df.subitem_code.str[:2]
    df["grupo_code"] = df.subitem_code.str[:1]
    df["grupo_nome"] = df.grupo_code.map(GRUPOS)
    df["data"] = pd.PeriodIndex(df.mes, freq="M").to_timestamp()
    df["sa_efetivo"] = (df.var_mensal - df.var_mensal_sa).abs() > 1e-9
    return df.sort_values(["subitem_code", "mes"]).reset_index(drop=True)


def validar(df: pd.DataFrame) -> pd.DataFrame:
    """Reconstroi o IPCA cheio a partir dos subitens publicados e compara."""
    pub = df[df.origem == "publicado"]
    rec = (pub.var_mensal * pub.peso / 100).groupby(pub.mes).sum()
    of = {}
    for e in ESTRUTURAS:
        per = f"{max(e.inicio, int(df.mes.min()))}-{min(e.fim, int(df.mes.max()))}"
        if int(per.split("-")[0]) > int(per.split("-")[1]):
            continue
        url = (f"https://apisidra.ibge.gov.br/values/t/{e.t_var}/n1/all"
               f"/v/{V_VAR}/p/{per}/c315/7169")
        try:
            for x in _fetch(url)[1:]:
                of[x["D3C"]] = _num(x["V"])
        except Exception:
            pass
    cmp = pd.DataFrame({"reconstruido": rec, "oficial": pd.Series(of)}).dropna()
    cmp["erro_abs"] = (cmp.reconstruido - cmp.oficial).abs()
    print(f"validacao: {len(cmp)} meses | erro medio {cmp.erro_abs.mean():.4f} pp "
          f"| max {cmp.erro_abs.max():.4f} pp")
    return cmp


# ------------------------------------------------------- estimador de residuo

def _residuos_rolantes(y: np.ndarray, janela: int, lags: int,
                       meses: np.ndarray, dummies: bool) -> np.ndarray:
    """
    Residuo do ULTIMO mes de cada janela rolante de um AR(lags) opcionalmente
    com 11 dummies de mes-calendario. Equivale a equacao (3) do paper.
    Retorna vetor do tamanho de y, com NaN onde nao ha janela suficiente.
    """
    n = len(y)
    out = np.full(n, np.nan)
    if n < janela:
        return out

    # matriz de regressores completa (lags + dummies + constante)
    cols = [np.roll(y, l) for l in range(1, lags + 1)]
    X = np.column_stack(cols) if cols else np.empty((n, 0))
    if dummies:
        D = np.zeros((n, 11))
        for j, m in enumerate(range(2, 13)):
            D[:, j] = (meses == m).astype(float)
        X = np.column_stack([X, D])
    X = np.column_stack([np.ones(n), X])

    for t in range(janela - 1, n):
        ini = t - janela + 1
        sl = slice(max(ini, lags), t + 1)
        Xw, yw = X[sl], y[sl]
        ok = np.isfinite(yw) & np.isfinite(Xw).all(axis=1)
        if ok.sum() <= Xw.shape[1] + 5:
            continue
        Xw, yw = Xw[ok], yw[ok]
        # descarta colunas constantes (dummies vazias na janela)
        keep = np.ones(Xw.shape[1], bool)
        keep[1:] = Xw[:, 1:].std(axis=0) > 1e-12
        try:
            beta, *_ = np.linalg.lstsq(Xw[:, keep], yw, rcond=None)
        except np.linalg.LinAlgError:
            continue
        out[t] = yw[-1] - Xw[-1, keep] @ beta
    return out


def calcular_residuos(df: pd.DataFrame, janela: int = 120, lags: int = 1,
                      sazonalidade: str = "dummies", fonte: str = "bruto",
                      verbose: bool = True) -> pd.DataFrame:
    """
    Residuos rolantes por subitem. Etapa CARA do pipeline.

    Separada de proposito: nem `k` nem os recortes alteram a regressao, so a
    agregacao. Calcule os residuos uma vez por (janela, lags, sazonalidade,
    fonte) e reaproveite em `agregar_ism`.

    Retorna painel long com mes, subitem_code, grupo_code, peso, eps.
    """
    col = "var_mensal" if fonte == "bruto" else "var_mensal_sa"
    usar_dummies = sazonalidade == "dummies"

    d = df.sort_values(["subitem_code", "mes"])
    d = d.assign(_m=pd.PeriodIndex(d.mes, freq="M").month)

    eps = np.full(len(d), np.nan)
    pos = 0
    codigos = d.subitem_code.to_numpy()
    troca = np.flatnonzero(np.r_[True, codigos[1:] != codigos[:-1]])
    limites = np.r_[troca, len(d)]
    y_all = d[col].to_numpy(float)
    m_all = d._m.to_numpy()

    for i in range(len(limites) - 1):
        a, b = limites[i], limites[i + 1]
        eps[a:b] = _residuos_rolantes(y_all[a:b], janela, lags, m_all[a:b],
                                      usar_dummies)
        if verbose and (i + 1) % 150 == 0:
            print(f"    {i+1}/{len(limites)-1} subitens")

    return pd.DataFrame({
        "mes": d.mes.values, "subitem_code": codigos,
        "grupo_code": d.grupo_code.values, "peso": d.peso.values, "eps": eps,
    })


def agregar_ism(resid: pd.DataFrame, k: int = 3, filtro=None) -> pd.DataFrame:
    """
    Agrega residuos no indice ISM. Etapa BARATA: reusa `calcular_residuos`.

    k      : residuos consecutivos de mesmo sinal (paper usa 3; robustez 2 e 4)
    filtro : funcao(resid) -> mascara booleana, ex: lambda d: d.grupo_code != "1"
    """
    r = resid if filtro is None else resid[filtro(resid)]
    r = r.sort_values(["subitem_code", "mes"]).reset_index(drop=True)

    g = r.groupby("subitem_code", sort=False)
    mais = np.ones(len(r), bool)
    menos = np.ones(len(r), bool)
    for j in range(k):
        s = g.eps.shift(j).to_numpy()
        mais &= s > 0
        menos &= s < 0

    r = r.assign(M_mais=mais.astype(float), M_menos=menos.astype(float))
    r = r[np.isfinite(r.eps.to_numpy())]

    # reescala os pesos para somarem 1 dentro do universo efetivo do mes
    tot = r.groupby("mes").peso.transform("sum")
    r = r.assign(w=np.where(tot > 0, r.peso / tot, 0.0))

    out = pd.DataFrame({
        "S_mais": r.eval("w * M_mais").groupby(r.mes).sum(),
        "S_menos": r.eval("w * M_menos").groupby(r.mes).sum(),
        "n_categorias": r[r.peso > 0].groupby("mes").size(),
    })
    out["ISM"] = out.S_mais - out.S_menos
    out.index = pd.PeriodIndex(out.index, freq="M").to_timestamp()
    out.index.name = "data"
    return out


def calcular_ism(df: pd.DataFrame, janela: int = 120, lags: int = 1, k: int = 3,
                 sazonalidade: str = "dummies", fonte: str = "bruto",
                 filtro=None, verbose: bool = True) -> pd.DataFrame:
    """Atalho de uma chamada. Para varias combinacoes, prefira
    calcular_residuos + agregar_ism."""
    resid = calcular_residuos(df, janela, lags, sazonalidade, fonte, verbose)
    return agregar_ism(resid, k, filtro)


# ------------------------------------------------------------- diagnosticos

def diagnostico_sazonal(res: pd.DataFrame) -> pd.DataFrame:
    """
    Se o ajuste sazonal funcionou, a media do ISM por mes-calendario deve ser
    estatisticamente indistinguivel entre os doze meses.
    """
    t = res.copy()
    t["mes_cal"] = t.index.month
    g = t.groupby("mes_cal")[["ISM", "S_mais", "S_menos"]].mean().round(4)
    amp = g.ISM.max() - g.ISM.min()
    print(f"amplitude do ISM medio entre meses-calendario: {amp:.4f} "
          f"({'OK' if amp < 0.05 else 'ATENCAO: possivel sazonalidade residual'})")
    return g


def serie_selic_12m(index=None) -> pd.Series:
    """Selic acumulada em 12 meses (% a.a.), da serie SGS 4390 do BCB.
    Composicao movel de 12 fatores mensais. Fonte oficial, sem credencial."""
    import urllib.request as _u
    url = ("https://api.bcb.gov.br/dados/serie/bcdata.sgs.4390/dados"
           "?formato=json&dataInicial=01/01/2008")
    raw = _u.urlopen(url, timeout=90).read().decode()
    d = json.loads(raw)
    s = {}
    for r in d:
        dd, mm, aa = r["data"].split("/")
        s[f"{aa}-{mm}"] = float(r["valor"])
    s = pd.Series(s).sort_index()
    idx = (1 + s / 100)
    a12 = (idx.rolling(12).apply(lambda x: x.prod(), raw=True) - 1) * 100
    a12.index = pd.PeriodIndex(a12.index, freq="M").to_timestamp()
    a12 = a12.rename("selic_12m")
    return a12.reindex(index) if index is not None else a12


def serie_ipca_12m(df: pd.DataFrame) -> pd.Series:
    """IPCA acumulado em 12 meses reconstruido do painel, para o grafico."""
    pub = df[df.origem == "publicado"]
    m = (pub.var_mensal * pub.peso / 100).groupby(pub.mes).sum().sort_index()
    idx = (1 + m / 100).cumprod()
    y = (idx / idx.shift(12) - 1) * 100
    y.index = pd.PeriodIndex(y.index, freq="M").to_timestamp()
    return y.rename("ipca_12m")


# ------------------------------------------------------------------- pipeline

RECORTES = {
    "cheio": None,
    "sem_alimentacao": lambda d: d.grupo_code != "1",
    "servicos": lambda d: d.grupo_code.isin(["6", "7", "8", "9"]),
    "bens": lambda d: d.grupo_code.isin(["1", "3", "4"]),
}


def gerar_dataset_dashboard(df: pd.DataFrame, janela=120,
                            ks=(2, 3, 4), lags_list=(1, 3, 12)) -> pd.DataFrame:
    """
    Pre-computa todas as combinacoes para servir estatico no dashboard.
    Estima os residuos uma vez por modelo AR e reaproveita em todos os
    recortes e valores de k.
    """
    frames = []
    for lags in lags_list:
        print(f"  residuos AR({lags})...")
        resid = calcular_residuos(df, janela=janela, lags=lags, verbose=False)
        for nome, filt in RECORTES.items():
            for k in ks:
                r = agregar_ism(resid, k=k, filtro=filt)
                frames.append(r.assign(recorte=nome, ar=lags, k=k).reset_index())
        print(f"  AR({lags}) pronto: {len(RECORTES)*len(ks)} combinacoes")
    return pd.concat(frames, ignore_index=True)


if __name__ == "__main__":
    OUT = "/mnt/user-data/outputs"
    painel = construir_painel(desde=200607)
    validar(painel)
    painel.to_parquet(f"{OUT}/ipca_painel_subitens.parquet", index=False)

    res = calcular_ism(painel, janela=120, lags=1, k=3)
    res["ipca_12m"] = serie_ipca_12m(painel).reindex(res.index)
    res.to_csv(f"{OUT}/ism_ipca_baseline.csv")
    print("\n", res.tail(12).round(4).to_string())
    diagnostico_sazonal(res)
