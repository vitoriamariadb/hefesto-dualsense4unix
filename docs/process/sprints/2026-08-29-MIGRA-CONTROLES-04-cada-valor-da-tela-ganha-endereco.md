---
sprint: MIGRA-CONTROLES-04
onda: MIGRA-CONTROLES
posse:
  MC4:
    - scripts/telas/aba02.py
    - src/hefesto_dualsense4unix/gui/telas/02-controles.html
cria:
  - tests/unit/test_migra_controles_04_todo_valor_tem_endereco.py
bancada: false
depois_de:
  # SÉRIE: a 02 é quem cria o gerador e a página no lugar novo.
  - MIGRA-CONTROLES-02
nao_toca:
  - scripts/telas/monta.py
  - src/hefesto_dualsense4unix/app/
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/gui/main.glade
  - novo-layout/
---

# MIGRA CONTROLES · 04 — Cada valor da tela ganha endereço

## O defeito

**A página inteira tem oito endereços, e nenhum deles é de um valor.** Medido em
29/08 sobre `layout/02-controles.html` (1.804 linhas):

| o que existe | quantos | quais |
|---|---|---|
| `id=` | **8** | `ring`, `flameOut`, `flameIn` (definições do SVG do logo) e `c-p1`, `c-p2`, `c-p3`, `c-p4`, `c-todos` (os rádios do acordeão) |
| `data-*` | **0** | — |

Os cinco rádios existem porque o acordeão é CSS puro (decisão dela, 28/08:
*"CSS puro, sem JavaScript"*); os três do SVG são do desenho. **Nenhuma bateria,
nenhum analógico, nenhum eixo de giroscópio, nenhum dos 64 glifos e nenhum dos
21 botões tem por onde ser alcançado.**

Sem endereço, a ponte da
[MIGRA-CONTROLES-03](2026-08-29-MIGRA-CONTROLES-03-as-duas-pontes-nascem-aqui.md)
tem o canal e não tem o destinatário.

## O que entrega

1. **Duas famílias de atributo, e só duas.**
   - no cartão: `data-ctl="<uniq>"` — a peça a que tudo dentro pertence;
   - no valor: `data-campo="<família>.<nome>"` — por exemplo `bateria.pct`,
     `analogico.esq.x`, `giro.z`, `gatilho.l2`, `mic.nivel`, `luz.hex`,
     `mascara.rotulo`.

   O Python endereça `[data-ctl="X"] [data-campo="Y"]` e não precisa saber mais
   nada da página. **Um `id` por valor não serve**: com quatro controles na mesa
   os ids se repetiriam, e id repetido é HTML inválido que o navegador resolve
   silenciosamente pelo primeiro.

2. **A lista dos valores vira DADO no gerador**, não texto espalhado pelo HTML.
   Uma tabela única — nome do campo, a que família pertence, se é leitura ou
   gesto — e o gerador escreve o atributo a partir dela. É a mesma disciplina
   que fez a cor do plástico sair do CSS escrito à mão: **quem digita duas
   vezes, diverge.**

3. **Os gestos ganham endereço no mesmo passe**: os 21 `<button>` e os cinco
   rádios recebem `data-gesto="<nome>"`. A conta da mesa cheia, do censo de
   29/08, é de **42 gestos** — quem ligar a
   [MIGRA-CONTROLES-08](2026-08-29-MIGRA-CONTROLES-08-os-gestos-voltam-e-a-regua-que-clica.md)
   confere contra a página do dia, não contra este número.

4. **Nada muda de pixel.** Atributo não pinta. Mas **é mudança no gerador da
   especificação que ela aprovou**, e por isso está declarada aqui em vez de
   entrar de carona em outra sprint.

## Como se prova (a mordida)

`tests/unit/test_migra_controles_04_todo_valor_tem_endereco.py`:

- **a régua LÊ a lista, nunca a digita.** Ela importa a tabela do gerador e
  afirma que **cada entrada** tem um `data-campo` correspondente na página
  gerada. **Acrescente um valor à tabela sem escrever o atributo e veja
  reprovar.** Uma régua que carregue a lista dos campos escrita à mão repete
  exatamente o defeito das **onze réguas de 26/08**, que *digitavam o que
  deviam LER* — e reprovavam a melhora em vez do defeito;
- **e a recíproca**: nenhum `data-campo` na página fora da tabela. As duas
  direções, senão a régua só pega metade;
- **nenhum endereço se repete dentro do mesmo cartão**, e todo `data-campo`
  está dentro de algum `data-ctl`. Tire um valor para fora do cartão e veja
  reprovar;
- **os cinco rádios do acordeão continuam com o `id` que o CSS usa.** O
  acordeão é `:has(> input:checked)` e `<label for>`: trocar `id` por
  `data-` **apaga o acordeão inteiro, sem erro nenhum**. Arranque um `id` e
  veja o teste reprovar antes de alguém descobrir clicando;
- **o desenho não mudou**: foto da página antes e depois, comparada ao pixel.
  **Ela tem de sair idêntica.** Se sair diferente, a sprint mudou o que ela
  aprovou e vira pergunta dela, não achado do executor;
- **a fita continua clicável**: `fita_clicavel` (hoje em
  `layout/_ferramentas/aba02.py:942`) já para com `SystemExit` se a forma
  do chip mudar — foi assim que a fita viva morreu sem sintoma em 27/08. O
  atributo novo não pode fazer o casamento dela falhar: rode o gerador e afirme
  que os cinco chips viraram `<label for>`.

## O que é dela decidir

Nada. Atributo não é tela. **Se alguma coisa mudar de pixel, a sprint parou de
ser esta** — relate em vez de escolher.
