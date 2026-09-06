---
sprint: ONDA-CONEXOES-05
estado: absorvida
posse:
  A5:
    - src/hefesto_dualsense4unix/app/actions/config/secao_controles.py
    - src/hefesto_dualsense4unix/app/widgets/external_card.py
cria:
  - tests/unit/test_conexoes_o_card_vira_tira.py
bancada: false
depois_de:
  - ONDA-VIBRACAO-01
  - LEVA-4  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/app/widgets/desenho_do_controle.py
  - src/hefesto_dualsense4unix/app/widgets/controller_card.py
  - src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
  - src/hefesto_dualsense4unix/app/actions/status_actions.py
  - src/hefesto_dualsense4unix/integrations/cor_do_plastico.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_mesa.py
  # As duas de 27/08: quem liga a leitura por rádio é a ONDA-CONEXOES-11, e o
  # par dica-de-tela × linha do mapa se move junto ou não se move.
  - docs/data/mapa-controles.csv
  - docs/data/cores-do-dualsense.csv
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 08). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA CONEXÕES · 05 — o card vira tira

**O defeito, numa frase:** o card desta aba tem três linhas, oferece a **escolha
do jogador** que já é da Iluminação, e gasta altura repetindo o que a aba
Controles diz melhor.

Fonte: `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 8, *"O card de
controle encolhe para o que é declaração e rádio"*;
`src/hefesto_dualsense4unix/interface/aba08.py:409-435` (as duas tiras). Decisões:
`D-A-ESCOLHA-DO-PLAYER-MORA-NA-LIGHTBAR`, `D-AS-ABAS-CONVERSAM`,
`D-A-FITA-E-O-UNICO-ALVO`.

## O que entrega

Uma **tira** por controle, de **uma linha de nome e uma de campos**:

```
[SVG]  Sony · Player 1 · Cosmic Red · USB
       [◼ Cosmic Red  corrigir]   [microfone pelo cabo]
```

**Fica** (é o que esta aba responde — declaração e rádio):

* **a cor do plástico** — e a hierarquia entre as duas formas mudou.

  **FATO ERRADO, SUBSTITUÍDO (27/08/2026).** Este item dizia que as duas formas
  são **pares simétricos**: *"cor **lida** do aparelho aparece como valor com
  `corrigir`; cor **declarada** por ela aparece como seletor"* — e "declarada"
  era o caso comum de **todo controle no rádio**. **Não era o aparelho que
  recusava a leitura por rádio: era a semente do CRC da nossa escrita** — `0x53`
  (`SET_REPORT|FEATURE`, o feature que SAI), e não `0xA3` (`DATA|FEATURE`, o que
  chega). Nesta bancada **um** controle respondeu pelo rádio
  (`hidraw8`, Cosmic Red `02`) e outro pelo cabo (`hidraw7`, Starlight Blue `05`)
  (`docs/protocol/dualsense-referencia-canonica.md:1574-1663`).

  Com a cor legível nos **dois** transportes, **a forma lida é o caminho
  principal e a única que a tira mostra de saída**: amostra, nome e `corrigir`.
  A forma declarada **não some** — vira o **estado de exceção atrás do
  `corrigir`**, em três casos e só neles:

  1. **código desconhecido** — `cor_do_codigo` em
     `integrations/cor_do_plastico.py:204` devolve `None` de propósito: a Sony
     fabrica edição nova sem avisar, e inventar nome poria na tela cor que
     ninguém mediu;
  2. **controle externo** (8BitDo, Pro Controller) — não tem serial de fábrica
     Sony, e o filtro de VID:PID de `integrations/cor_do_plastico.py:419-420`
     continua barrando o pedido, porque mandar comando de família de fábrica da
     Sony a aparelho de outro fabricante é escrever às cegas. Com todo DualSense
     ganhando cor real, **ele é o único aparelho que segue sem cor lida por
     construção**: para ele o campo **não é correção, é o único caminho**, e
     nasce aberto;
  3. **ela discorda** do que o aparelho respondeu — a declaração vence a
     leitura. Decisão dela em `docs/data/cores-do-plastico.md:15-17`, que já
     autorizava o rádio: *"pelo cabo hoje, pelo rádio quando a ponte existir"*.
     A ponte existe desde 27/08, e a decisão não se reabre.

  **O que isso muda no desenho da tira:** o card do rádio **deixa de nascer no
  seletor**. Ele era a razão de existirem dois desenhos de altura diferente na
  mesma fileira — o defeito que a LEX-5 mediu (`external_card.py:318-325`).
  Agora um DualSense no rádio monta igual a um no cabo, e **a forma passa a
  depender só de "há cor lida?", nunca do transporte**.

  As opções atrás do `corrigir` são **as cores de fábrica que o módulo
  conhece**, mais `Outra — eu digito…`. Saem de
  `integrations/cor_do_plastico.NOMES_DE_FABRICA` — **lidas, nunca
  redigitadas** (`aba08.py:8-11` diz de onde vêm). **O número não se escreve
  aqui**, e isso é a disciplina que salva a sprint:
  `docs/data/cores-do-dualsense.csv` já traz **sete modelos que o módulo ainda
  não tem** — `13` HyperPop Techno Red, `14` HyperPop Remix Green, `15` HyperPop
  Rhythm Blue, `ZC` Ghost of Yōtei, `ZD` Marathon, `ZE` Genshin Impact e `ZF`
  007 First Light. No dia em que o módulo os absorver, a tela e o teste
  acompanham sozinhos;
* **o selo de procedência** sai da tela como texto e vira a **dica do
  `corrigir`** — regra dela do valor ao lado do botão;
* **a borda da tira com o tom do plástico**, que já funciona
  (`secao_controles.py:954`, `tom_para_a_borda`);
* **o microfone pelo rádio**, opt-in por controle, com o preço ao lado —
  as quatro regras dela de 22/08 continuam inteiras
  (`secao_controles.py:427-443`): por controle, nasce desligado, sempre visível
  e só acionável no rádio, capacidade e nunca advertência;
* **"A luz não acende"** e o **"Cancelar"** que é o mesmo botão no estado
  seguinte (`:161`, `:175`);
* **"Modo:"** do controle externo, **só leitura** — a troca é física, no
  aparelho;
* **"Botões: Xbox / Nintendo / Não sei"**;
* **o anel de selecionado**, vindo da fita. A fita não ajusta nada aqui, mas
  marca de quem é a tira — e continua sendo o único lugar onde se escolhe o
  alvo (`D-A-FITA-E-O-UNICO-ALVO`).

**Sai:**

* **a escolha do jogador.** Hoje é `"Jogador:"` mais cinco botões
  (`external_card.py:503`, `:638`); passa a ser **leitura**, no cabeçalho da
  tira. Quem escolhe é a Iluminação, que ganha a seção fixa dos jogadores. Não
  se duplica escolha;
* **bateria, entradas ao vivo e glifos** — vão para a aba Controles. O mesmo
  card existe hoje em três abas, e esta é a que menos precisa dele.

**O DualSense na cor do plástico, dentro da tira** — e o widget que o desenha
**não nasce aqui**. `assets/control-svg/dualsense.svg` traz o `data-colorway` e,
desde 27/08, uma folha própria que pinta **28 modelos por zona**, gerada de
`docs/data/cores-do-dualsense.csv` por `scripts/gerar_cores_do_dualsense.py` e
medida por `scripts/check_cores_do_dualsense.py`. Não é mais "a cor do
controle": são dez zonas por modelo — casca esquerda, casca direita, painel,
touch, botões da face, símbolos, dpad, analógicos, gatilhos e detalhe —, e em
Spider-Man 2 e God of War 20th **as duas cascas são cores diferentes**. Trinta e
uma linhas são **SEM-HEX** (iridescente, camuflado, metálico e arte não cabem
num `fill`): nelas a tira mostra a hachura do gerador, e **inventar hex é
proibido**.

**Nenhuma linha da janela nunca o abriu**: os usos vivos estão todos em
`scripts/` — `gerar-mapa.py`, `migrar-mapa-v2.py` e os dois de 27/08. Quem o
abre primeiro é a **ONDA-VIBRACAO-01**, que o parte ao meio para acender cada
lado com o seu motor (`D-O-SVG-VIBRA-POR-LADO`) e cria
`app/widgets/desenho_do_controle.py`.  <!-- ref-externa: nasce na ONDA-VIBRACAO-01, ainda não executada -->

**Esta sprint é o segundo consumidor, não o primeiro** — e é por isso que ela
vem `depois_de: [ONDA-VIBRACAO-01]`. Dois módulos abrindo o mesmo SVG seriam
duas verdades sobre a cor de cada peça no dia em que uma colorway mudasse.

## Como se prova — o teste que morde

`tests/unit/test_conexoes_o_card_vira_tira.py`:

* a tira **não publica botão nenhum de escolher jogador** — nem cinco, nem um.
  O número aparece só como texto no cabeçalho;
* **a altura**: uma tira monta em **duas linhas de texto**, e quatro tiras cabem
  no orçamento vertical da seção. Medida com `Gtk.OffscreenWindow`;
* **as formas da cor, e são TRÊS asserções, não duas**:
  1. com cor lida e o controle **no cabo**, o widget é rótulo + `corrigir`;
  2. com cor lida e o controle **no RÁDIO**, o widget é **o mesmo** rótulo +
     `corrigir`. Esta asserção **não existe hoje**, e é ela que reprova quem
     deixar um filtro de transporte no caminho da forma. O teste não precisa de
     bancada: `cor_lida` entra por argumento, como o resto de `DadosDoControle`;
  3. **sem** cor lida, é o seletor, e a lista bate com
     `cor_do_plastico.NOMES_DE_FABRICA` mais a opção de campo livre — **contada
     a partir do módulo**, nunca contra literal no teste. É isso que mantém o
     teste vivo quando o módulo passar das cores que conhece hoje para as 28 de
     `docs/data/cores-do-dualsense.csv`;
* **as colunas alinham**: a cor cai sempre na primeira e o microfone sempre na
  segunda, esteja a cor num valor lido ou num seletor. É o que o mockup fixa
  (`aba08.py`, "As colunas de campo das duas tiras são as mesmas");
* a tira monta com o desenho do controle presente **e** com ele ausente (o
  widget da ONDA-VIBRACAO-01 indisponível) — sem levantar, e sem buraco no
  alinhamento das colunas.

**A mordida:** devolva os cinco botões de jogador e veja a primeira e a segunda
asserção reprovarem. Ponha de volta um `if transporte != "usb"` na escolha da
forma e veja **só** a asserção do rádio reprovar. Depois troque a lista de cores
por uma cópia digitada e veja a do seletor reprovar — é ela que impede a segunda
verdade sobre quantas cores existem. Cole as três saídas.

## O que fica combinado com quem coordena

**Esta sprint desenha a forma; quem LIGA a leitura por rádio é a
ONDA-CONEXOES-11**, que vem depois (ela lista esta em `depois_de`). As duas
dividem `external_card.py` e `secao_controles.py`, logo correm **em série**
(R5). A consequência prática: quando esta fechar, o rádio ainda devolve `None`
e a **asserção do rádio** roda com `cor_lida` injetada. **É de propósito** — a
tira tem de nascer cega ao transporte, para que a 11 seja só ligar a leitura, e
não redesenhar a tela.

**O que esta sprint NÃO toca, e é da 11:** a dica
`DICA_DA_COR_NO_RADIO` (`external_card.py:97-103`, *"No rádio o controle recusa
o pedido da cor"*) e a linha de `docs/data/mapa-controles.csv` que a sustenta —
o par se move junto ou não se move, e é o
`scripts/check_paridade_transporte.py` que cobra. Quem executar esta sprint
**deixa a dica onde está**, mesmo sabendo que ela já é falsa.

**O que esta sprint TOCA e é dela:** `external_card.py:327-332` ainda ensina
*"Por que o cabo responde e o rádio não"*, com `radio_aciona=não`. Esta sprint
reescreve `_linha_da_cor` inteiro, e a lápide **sai junto** — não fica anotada
ao lado.

O mockup (`src/hefesto_dualsense4unix/interface/aba08.py`) e o contrato
(`docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`) ainda descrevem o mundo
de antes. **Os dois estão em revisão com ela, e não se tocam sem a palavra
dela.**

## O que é dela decidir

1. **Dois controles do mesmo plástico ficam com a borda idêntica.** A regra
   "duas peças nunca com a mesma cor" é da lightbar; a cor do plástico é física
   e não pode deslocar. Continua sem resposta (`aba08.py`, "Ainda aberto",
   item 2). A medição de 27/08 não muda a pergunta, muda a probabilidade: com a
   cor lida também no rádio, a colisão vira regra em vez de azar — o cálculo
   está na ONDA-CONEXOES-08, e é a mesma pergunta.
2. **Prova de tela.** Ela gosta do desenho original das tiras e pediu refinamento
   aba a aba: *"Faça todos os ajustes. Aba a aba valida com calma."*
   (`CORRECOES-DELA.md`).
