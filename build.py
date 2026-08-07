#!/usr/bin/env python3
"""
build.py — pipeline completo do dashboard ISM-IPCA.

    python build.py            # baixa tudo, recalcula e gera docs/index.html
    python build.py --cache    # reusa o painel salvo, so recalcula (mais rapido)

Saidas em docs/:
    index.html            dashboard (arquivo unico, dados embutidos)
    ism_ipca.csv          serie completa, todas as combinacoes
    painel_subitens.parquet

Roda em ~6 min do zero. Falha ruidosamente se a validacao contra o IPCA
oficial divergir, o que protege contra mudanca silenciosa na fonte.
"""
import argparse
import json
import pathlib
import sys

import pandas as pd

sys.path.insert(0, str(pathlib.Path(__file__).parent))
import ism_ipca as ism

RAIZ = pathlib.Path(__file__).parent
DOCS = RAIZ / "docs"
TEMPLATE = RAIZ / "template"
TOLERANCIA_PP = 0.02  # erro medio maximo aceitavel na reconstrucao do IPCA


def main(cache: bool = False) -> None:
    DOCS.mkdir(exist_ok=True)
    pq = DOCS / "painel_subitens.parquet"

    if cache and pq.exists():
        print("→ reusando painel em cache")
        painel = pd.read_parquet(pq)
    else:
        print("→ baixando SIDRA (agosto/1999 em diante)")
        painel = ism.construir_painel(desde=199908, verbose=True)
        painel.to_parquet(pq, index=False)

    print("\n→ validando contra o IPCA oficial")
    cmp = ism.validar(painel)
    erro = cmp.erro_abs.mean()
    if erro > TOLERANCIA_PP:
        raise SystemExit(
            f"ABORTADO: erro medio de reconstrucao {erro:.4f} pp acima da "
            f"tolerancia de {TOLERANCIA_PP} pp. A fonte pode ter mudado."
        )

    print("\n→ calculando as 36 combinacoes")
    d = ism.gerar_dataset_dashboard(painel)
    d.to_csv(DOCS / "ism_ipca.csv", index=False)

    print("\n→ montando payload")
    ip = ism.serie_ipca_12m(painel)
    d["data"] = pd.to_datetime(d.data)
    ip.index = pd.to_datetime(ip.index)
    datas = sorted(d.data.unique())
    pay = {
        "datas": [pd.Timestamp(x).strftime("%Y-%m") for x in datas],
        "ipca": [None if pd.isna(v) else round(float(v), 3) for v in ip.reindex(datas)],
        "series": {},
    }
    for (rec, ar, k), g in d.groupby(["recorte", "ar", "k"]):
        g = g.set_index("data").reindex(datas)
        pay["series"][f"{rec}|{ar}|{k}"] = {
            dest: [None if pd.isna(v) else round(float(v), 4) for v in g[src]]
            for src, dest in [("ISM", "ism"), ("S_mais", "sp"), ("S_menos", "sm")]
        }
    data_json = json.dumps(pay, separators=(",", ":"))

    print("→ gerando docs/index.html")
    html = (
        (TEMPLATE / "head.html").read_text(encoding="utf-8")
        + (TEMPLATE / "body.html").read_text(encoding="utf-8")
        + "<script>const D=" + data_json + ";\n"
        + (TEMPLATE / "script.js").read_text(encoding="utf-8")
        + "</script>\n</body>\n</html>"
    )
    (DOCS / "index.html").write_text(html, encoding="utf-8")

    ultimo = pay["datas"][-1]
    ism_atual = pay["series"]["cheio|1|3"]["ism"][-1]
    print(f"\nOK · ate {ultimo} · indice {ism_atual:+.3f} · "
          f"{len(html)/1024:.0f} KB · erro de validacao {erro:.4f} pp")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--cache", action="store_true", help="reusa o painel salvo")
    main(**vars(ap.parse_args()))
