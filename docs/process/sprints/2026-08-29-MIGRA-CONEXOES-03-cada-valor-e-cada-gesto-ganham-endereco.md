---
sprint: MIGRA-CONEXOES-03
estado: absorvida
onda: MIGRA-CONEXOES
posse:
  M3:
    - scripts/telas/aba08.py
    - src/hefesto_dualsense4unix/gui/telas/08-conexoes.html
cria:
  - tests/unit/test_migra_conexoes_todo_valor_tem_endereco.py
bancada: false
depois_de:
  # A moldura das dez (`MIGRA-MOLDURA-01` no vocabulário das outras ondas) é a
  # MIGRA-CONTROLES-02, dona de `gui/telas/` e `scripts/telas/` como pastas.
  - MIGRA-CONTROLES-02
  - MIGRA-CONTROLES-01
  # SÉRIE por arquivo: a 02 é quem TRAZ estes dois arquivos para o repositório.
  - MIGRA-CONEXOES-02
nao_toca:
  - src/hefesto_dualsense4unix/app/
  - src/hefesto_dualsense4unix/daemon/
  - scripts/telas/monta.py
  - install.sh
  - pyproject.toml
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 08). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA CONEXÕES · 03 — cada valor e cada gesto ganham endereço

**O defeito, medido agora:** o Python só alcança o que tem nome, e **nada nesta
página tem nome**. No miolo do `08-conexoes.html`, descontados os treze `<svg>`:

```
ids: 5   ·   data-*: 0
```

E os cinco ids são `gc-todos`, `gc-p1`, `gc-p2`, `gc-p3`, `gc-p4` — os
`<input type=radio>` escondidos do acordeão. **Nenhum deles é um valor.** Dos
**50** valores que a aba mostra, zero tem endereço; e dos **32** elementos que
recebem gesto — **16** `<select>`, **12** `<button>`, **2** `<a class="btn">` e
**2** `<span class="acao">` (os dois "Renomear") — zero tem endereço.

**Os números acima são de tags, não de ocorrências da palavra.** Um
`grep -c '<select'` devolve **19** e um `grep -c '<button'` devolve **14**:
a diferença são cinco ocorrências dentro de comentários de CSS e de HTML.
Contar a palavra em vez da coisa é o defeito das onze réguas de 26/08 — e por
isso a régua desta sprint tira os comentários antes de contar.

Sem esta sprint, as dez seguintes não têm onde escrever.

## O que entrega

1. **Um endereço por valor**, emitido pelo gerador, nunca escrito à mão no HTML.
   O gerador já constrói cada linha em função (`linha_do_controle`,
   `pista`, `exame`, `viz_bloco` — as linhas 1082, 1140, 984 e 996 do gerador de
   29/08, a reconferir no dia da execução: a 02 move o arquivo) — o endereço nasce na mesma
   f-string em que o valor nasce, e por isso não pode divergir dele.
2. **Uma gramática só**, e ela precisa ser decidida **antes** da primeira linha,
   porque as dez abas vão herdá-la. A proposta desta sprint, para a moldura
   aceitar ou trocar:
   * `data-v="<família>.<campo>"` para o que o Python **pinta**
     (`data-v="controle.p1.bateria"`, `data-v="exame.pareamentos.selo"`,
     `data-v="radio.hci0.usado"`);
   * `data-g="<gesto>"` para o que o Python **recebe**
     (`data-g="mic.botao"`, `data-g="ordem.ignorar"`, `data-g="adaptador.renomear"`);
   * a chave do controle é o `uniq`, **nunca** o `p1`/`p2` do mockup — o
     `p1..p4` é posição na `MESA` de exemplo, e a `MIGRA-CONEXOES-03` mata a
     `MESA` fixa. Um endereço por posição volta a ser o "jogador 3 fantasma".
3. **Mudar atributo não muda pixel — e mesmo assim é mudança no desenho dela.**
   `data-*` não tem efeito de layout; a foto antes e depois tem de sair
   **idêntica**. Isso é entrega desta sprint, não consequência esperada.
4. **A conta dos 84 filtros mortos NÃO entra aqui.** O `monta.py` (o esqueleto comum das dez) prefixa os ids
   do SVG e não reescreve o `url()` porque o desenho usa aspas escapadas — o
   contorno do touchpad nunca apareceu, em motor nenhum. A cura está pronta e
   **não foi aplicada**: ela muda **1,09%** do desenho que ela aprovou, e por
   isso é dela. Esta sprint declara o buraco e passa ao largo (`nao_toca`).

## Como se prova (a mordida)

`tests/unit/test_migra_conexoes_todo_valor_tem_endereco.py` — o teste **LÊ** o
HTML gerado e **conta**; nenhum número escrito à mão. É a régua que as onze
réguas de 26/08 não foram: elas *digitavam o que deviam LER*.

* **inventário fechado.** Uma lista canônica dos valores da aba mora no teste
  como **conjunto de nomes** (não de números); para cada nome tem de existir
  exatamente **um** `data-v` no miolo. Nome sem elemento reprova; elemento com
  `data-v` fora da lista reprova também — endereço órfão é endereço que ninguém
  pinta. **Mordida:** apague o `data-v` da bateria de um controle e veja
  reprovar.
* **um gesto, um `data-g`.** Todo `<select>`, `<button>`, `<a class="btn">` e
  `<span class="acao">` do miolo — **fora de comentário** — tem `data-g`. **Mordida:** tire o do
  "Ignorar" e o teste reprova dizendo qual elemento ficou mudo.
* **nenhum endereço por posição.** Nenhum `data-v` nem `data-g` casa com
  `^p[0-9]` ou contém `.p1.`/`.p2.`/… **Mordida:** troque uma chave de `uniq`
  por `p1` e veja reprovar. Esta é a régua que impede o jogador fantasma de
  voltar pela porta dos atributos.
* **o pixel não andou.** A foto do miolo antes e depois desta sprint, pelo
  caminho de `docs/process/COMO-OLHAR-A-TELA.md`, tem de bater. E a medição roda
  **sem** `scrollIntoViewIfNeeded`: ele **rola antes de medir** e cega toda
  medição de layout feita depois — foi assim que um portão deu verde sobre uma
  linha fora da caixa (27/08).
* **os 84 filtros continuam mortos, e o teste diz isso em voz alta.** Um
  `xfail`/`skip` com motivo escrito, apontando a cura pronta e não aplicada.
  Verde mudo sobre defeito conhecido é o que esta casa chama de régua falsa.

## O que é dela decidir

* **A gramática dos endereços vale para as dez abas.** Se a moldura do piloto já
  tiver escolhido outra, esta sprint adota a dela sem discussão — duas gramáticas
  de endereço é a segunda verdade que a regra do fato errado existe para matar.
* **Os 84 filtros mortos do SVG.** A cura existe, muda 1,09% do desenho
  aprovado, e não corre sem a palavra dela.
