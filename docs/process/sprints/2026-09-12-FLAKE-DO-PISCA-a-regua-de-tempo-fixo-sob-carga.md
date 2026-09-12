---
sprint: FLAKE-DO-PISCA
estado: aberta
onda: A-FILA-DE-0911
posse:
  EDITA:
    - tests/unit/test_o_recado_de_sucesso_pousa_no_cartao.py
cria: []
bancada: false
depois_de: []
nao_toca:
  - src/
---

# O pisca reprova sob carga — e a medição diz que não é regressão

**12/09/2026, 01h.** A suíte da leva fechou com **2 vermelhos de 20.199**, os
dois em `test_o_recado_de_sucesso_pousa_no_cartao.py`. Medidos antes de
qualquer cura, porque a pergunta que importa era *isto é regressão da leva?*

## §1 — O NÚMERO, e ele responde a pergunta

| condição | base (`b794eb1b`, antes da leva) | leva (`d110deea`) |
| --- | ---: | ---: |
| **12 voltas alternadas**, mesma carga | **0 reprovas** | **0 reprovas** |
| voltas com Chrome + playwright de outra árvore no ar | — | **1 em 5** |

As duas árvores foram rodadas **intercaladas**, uma volta cada, justamente
porque a primeira tentativa mediu a base com a máquina mais folgada — e uma
comparação assim não vale nada. Sob a mesma carga, as duas se comportam igual.

**Então não é regressão.** É uma régua de tempo que não sobrevive a carga
concorrente.

## §2 — A CAUSA, e ela está escrita na própria falha

```
AssertionError: o gesto deu certo e o campo não piscou
  {'classes': 'mudo-i hef-em-voo', 'em_voo': True, 'deu_certo': False, …}
```

**`em_voo: True`** — o gesto ainda estava voando quando a régua foi medir. Ela
não mediu o defeito que descreve; mediu cedo demais. O arquivo marca os
instantes com `GLib.timeout_add` de tempo FIXO (700 ms, 2200 ms, `VENCE_EM_S +
400`), e sob contenção de CPU o produto atravessa essas janelas mais devagar
que o relógio.

## §3 — POR QUE NÃO FOI CURADO NO MESMO GESTO

Curar é trocar tempo fixo por **espera por condição** em todos os marcos do
arquivo — reescrita de uma régua que está verde em doze de doze voltas quando a
máquina não está disputada. Fazer isso no fecho de uma leva, de madrugada, com
outra árvore ocupando a CPU, arrisca trocar um vermelho intermitente por um
verde que não mede nada. **A leva foi para o install com o achado escrito, que é
o contrato desta casa.**

## §4 — O QUE A CURA PRECISA FAZER

1. Cada `GLib.timeout_add` de marco vira uma espera **pela condição** (o campo
   sair de `hef-em-voo`), com teto generoso e falha que diz *o que* não chegou.
2. O teto continua sendo régua: um gesto que nunca pousa tem de reprovar.
3. **A mordida:** com a cura dentro, rodar o arquivo com carga artificial e ver
   verde; arrancar a espera por condição e ver reprovar sob a mesma carga.

## §5 — A REGRA QUE ISSO DEIXA

*Um vermelho intermitente se mede contra a base ANTES de se curar, e as duas
medições se alternam sob a mesma carga.* A primeira leitura desta noite — base
5/5 verde, leva 4/5 — parecia regressão e não era: a carga tinha caído entre
uma medição e outra.
