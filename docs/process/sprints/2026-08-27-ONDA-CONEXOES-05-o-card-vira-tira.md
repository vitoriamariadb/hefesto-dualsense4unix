---
sprint: ONDA-CONEXOES-05
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
---

# ONDA CONEXÕES · 05 — o card vira tira

**O defeito, numa frase:** o card desta aba tem três linhas, oferece a **escolha
do jogador** que já é da Iluminação, e gasta altura repetindo o que a aba
Controles diz melhor.

Fonte: `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 8, *"O card de
controle encolhe para o que é declaração e rádio"*;
`novo-layout/_ferramentas/aba08.py:272-298`. Decisões:
`D-A-ESCOLHA-DO-PLAYER-MORA-NA-LIGHTBAR`, `D-AS-ABAS-CONVERSAM`,
`D-A-FITA-E-O-UNICO-ALVO`.

## O que entrega

Uma **tira** por controle, de **uma linha de nome e uma de campos**:

```
[SVG]  Sony · Player 1 · Cosmic Red · USB
       [◼ Cosmic Red  corrigir]   [microfone pelo cabo]
```

**Fica** (é o que esta aba responde — declaração e rádio):

* **a cor do plástico**, com as duas formas que o mockup distingue **pela
  forma, não por texto**: cor **lida** do aparelho aparece como valor com
  `corrigir`; cor **declarada** por ela aparece como seletor com as 21 cores de
  fábrica mais `Outra — eu digito…`. As 21 são as mesmas de
  `integrations/cor_do_plastico.NOMES_DE_FABRICA` — **lidas, nunca redigitadas**
  (`aba08.py:5-13` diz de onde saem);
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
**não nasce aqui**. `assets/control-svg/dualsense.svg` traz as colorways por
`data-colorway` e está no repositório desde 11/08, e **nenhuma linha da janela
nunca o abriu**: os únicos usos vivos estão em `scripts/gerar-mapa.py` e
`scripts/migrar-mapa-v2.py`. Quem o abre primeiro é a **ONDA-VIBRACAO-01**, que
o parte ao meio para acender cada lado com o seu motor
(`D-O-SVG-VIBRA-POR-LADO`) e cria `app/widgets/desenho_do_controle.py`.

**Esta sprint é o segundo consumidor, não o primeiro** — e é por isso que ela
vem `depois_de: [ONDA-VIBRACAO-01]`. Dois módulos abrindo o mesmo SVG seriam
duas verdades sobre a cor de cada peça no dia em que uma colorway mudasse.

## Como se prova — o teste que morde

`tests/unit/test_conexoes_o_card_vira_tira.py`:

* a tira **não publica botão nenhum de escolher jogador** — nem cinco, nem um.
  O número aparece só como texto no cabeçalho;
* **a altura**: uma tira monta em **duas linhas de texto**, e quatro tiras cabem
  no orçamento vertical da seção. Medida com `Gtk.OffscreenWindow`;
* **as duas formas da cor**: com `cor_id` lido do aparelho o widget é rótulo +
  `corrigir`; sem ele, é seletor com **21 + 1** opções, e a lista bate com
  `cor_do_plastico.NOMES_DE_FABRICA` — comparada contra o módulo, nunca contra
  literal no teste;
* **as colunas alinham**: a cor cai sempre na primeira e o microfone sempre na
  segunda, esteja a cor num valor lido ou num seletor. É o que o mockup fixa
  (`aba08.py`, "As colunas de campo das duas tiras são as mesmas");
* a tira monta com o desenho do controle presente **e** com ele ausente (o
  widget da ONDA-VIBRACAO-01 indisponível) — sem levantar, e sem buraco no
  alinhamento das colunas.

**A mordida:** devolva os cinco botões de jogador e veja a primeira e a segunda
asserção reprovarem. Depois troque a lista de cores por uma cópia digitada e veja
a terceira reprovar — é ela que impede a segunda verdade sobre as 21 cores. Cole
as duas saídas.

## O que é dela decidir

1. **Dois controles do mesmo plástico ficam com a borda idêntica.** A regra
   "duas peças nunca com a mesma cor" é da lightbar; a cor do plástico é física
   e não pode deslocar. Continua sem resposta (`aba08.py`, "Ainda aberto",
   item 2).
2. **Prova de tela.** Ela gosta do desenho original das tiras e pediu refinamento
   aba a aba: *"Faça todos os ajustes. Aba a aba valida com calma."*
   (`CORRECOES-DELA.md`).
