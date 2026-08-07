# Momentum de choque inflacionário no IPCA

Aplicação ao IPCA do filtro não paramétrico de Lansing e Shapiro (FRBSF WP 2026-10),
no nível de subitem do SNIPC. Painel de agosto de 1999 em diante; o índice começa em
julho de 2009 por conta da janela de estimação de 120 meses.

**Dashboard:** https://SEU-USUARIO.github.io/ism-ipca/

## Uso

```bash
pip install -r requirements.txt
python build.py            # baixa do SIDRA, recalcula e gera docs/index.html
python build.py --cache    # reusa o painel salvo, só recalcula
```

## Estrutura

```
build.py                   pipeline completo
ism_ipca.py                ingestão SIDRA e cálculo do índice
template/                  head.html, body.html, script.js
docs/                      saída publicada (GitHub Pages serve daqui)
.github/workflows/         atualização mensal automática
```

## Atualização

O workflow roda todo dia 15 e só commita se a série mudou. O `build.py` aborta se a
reconstrução do IPCA a partir dos subitens divergir mais de 0,02 pp da série oficial.

## Fonte

IBGE/SIDRA, tabelas 655, 656, 2938, 1419 e 7060.
