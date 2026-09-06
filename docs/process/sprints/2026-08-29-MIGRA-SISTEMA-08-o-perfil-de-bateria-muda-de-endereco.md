---
sprint: MIGRA-SISTEMA-08
estado: absorvida
# onda: MIGRA-SISTEMA (a aba 09, no motor novo)
posse:
  M8:
    - src/hefesto_dualsense4unix/app/actions/config/secao_orcamento.py
    - src/hefesto_dualsense4unix/app/actions/daemon_actions.py
cria:
  - tests/unit/test_migra_sistema_08_o_perfil_da_mesa_muda_de_aba.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-PILOTO
  - MIGRA-MOLDURA-01
  - MIGRA-SISTEMA-01
  - MIGRA-SISTEMA-02
  - MIGRA-SISTEMA-03
  - MIGRA-SISTEMA-04
  # SÉRIE, por R5: as cinco reivindicam `secao_orcamento.py`. Primeiro o dono
  # antigo dá à seção a forma final; só então ela muda de aba.
  - ONDA-CONEXOES-01
  - ONDA-CONEXOES-02
  - ONDA-CONEXOES-03
  - ONDA-CONEXOES-07
  - ONDA-CONEXOES-09
  # SÉRIE, por R5: dividem `daemon_actions.py` com esta.
  - ONDA-SISTEMA-01
  - ONDA-SISTEMA-02
  - ONDA-SISTEMA-04
  - ONDA-SISTEMA-05
  - ONDA-SISTEMA-06
  - ONDA-SISTEMA-07
  - MIGRA-SISTEMA-05
  - MIGRA-SISTEMA-06
  - MIGRA-SISTEMA-07
  # SÉRIE: também reivindicam `secao_orcamento.py` ou `daemon_actions.py`.
  - LEVA-1
  - LEVA-4
  - MOTOR-DO-ARRANJO-01
nao_toca:
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/core/rumble.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - novo-layout/
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 09). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA SISTEMA · 08 — O perfil de bateria muda de endereço

**Isto não é trabalho novo. É mudança de endereço** — e é por isso que esta
sprint é pequena e a nota é importante: quem a ler pensando em "construir o
perfil de bateria" vai reescrever o que já existe.

**O que já está pronto, em `app/actions/config/secao_orcamento.py`:**

| peça | linha |
|---|---|
| os três perfis | `PERFIS:118` |
| os rótulos | `ROTULOS_DOS_PERFIS:125` |
| a tradução perfil → disco | `TETO_POR_PERFIL:137` |
| o que o teto alcança e o que não alcança | `LINHAS_DO_TETO:206` |
| a frase do alcance | `alcance_de_hoje():267` |
| o que está na tela × o que está em vigor | `orcamento_na_tela():326`, `orcamento_em_vigor():298` |
| o gesto | `_ao_escolher():468` — acumula em `host._maquina_pendente`, **não grava** |
| o degrau do teto | `daemon/subsystems/rumble.py` → `RUMBLE_POLICY_MULT`; `core/rumble.py` → `_ORCAMENTO_COM_TETO` |

**O mockup já lê tudo isso por AST** (`aba09.py:117-140`), justamente para não
digitar. **O que muda é a FORMA e o LUGAR:**

- **forma:** o `SegmentedSelector` deitado (`_fileira_dos_perfis:422`) vira um
  `<select>`;
- **lugar:** a seção sai da aba **Conexões** e vira a faixa **Perfil de Bateria**
  da aba Sistema — decisão dela, 28/08
  (`D-O-GAMEPAD-VIRTUAL-SAI-DA-INTERFACE`): *"colocar Teto da Vibração (que na
  verdade é Perfil de Bateria) e colocar em sistema no lugar do Gamepad
  virtual."*

## O defeito

Com a MIGRA-SISTEMA-03 e a 04 fechadas, a faixa Perfil de Bateria da aba
Sistema está desenhada, endereçada e **sem dono**: o seletor mostra o perfil que
o gerador escolheu (`PERFIL_DA_MESA = PERFIS[0]`, `aba09.py:136`) e o gesto cai
numa tabela que não tem para onde despachar — o `_ao_escolher` de hoje precisa
de um `SegmentedSelector` vivo (`seletor.get_active_id()`), que a página não
tem.

**E há um defeito de motor à espreita:** medido em 29/08 no `ver.py`, o  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->
**WebKitGTK relata as cores do autor e desenha o `<select>` com o tema do
SISTEMA** — sai caixa **branca** com texto quase invisível. A cura é uma folha
de usuário com `appearance:none`, e ela **vive hoje no instrumento**
(`ver.py:76-91`), **não no produto**. Esta aba tem **um** `<select>`  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->
(`09-sistema.html:702`) — o único da tela. Se a folha não viajar, ele nasce
ilegível.

## O que entrega

1. **O gesto passa a aceitar o valor da página.** `_ao_escolher` deixa de exigir
   um widget e passa a receber a **escolha** (`str`). O `SegmentedSelector`
   continua existindo enquanto a aba Conexões ainda o usar; **o cálculo é um
   só**, e é o que já está lá.
2. **O contrato de gravação não muda.** A escolha **acumula** em
   `host._maquina_pendente` e grava no `machine.declare` do Aplicar do rodapé —
   a seção **não grava**, e está escrito no próprio `_ao_escolher:468`. Quem
   cobre isso hoje é `tests/unit/test_a_marca_acende_no_clique.py` (o clique
   acumula e acende a marca do rodapé). **Não o mude aqui.** Se a decisão for
   gravar na hora, é decisão dela e é outra sprint.

   *(FATO CONFERIDO: o censo desta onda citava um
   `test_o_clique_nao_grava_nada` — **esse arquivo não existe**. O contrato
   existe; o nome do portão, não. Conferido em 29/08.)*
3. **A folha do `<select>` viaja para o produto.** As duas linhas
   (`select{appearance:none;-webkit-appearance:none}`) e o `.nota{display:none}`
   são preço conhecido da rota — **e o dono delas é a moldura**, não esta aba.
   Esta sprint **para** se a folha não estiver no produto, e a mordida abaixo é
   o que a obriga a parar.
4. **A frase do teto continua derivada.** Ela sai de `LINHAS_DO_TETO` e
   `alcance_de_hoje()`, nunca escrita. **O gerador já reprova em voz alta**
   quando um perfil a mais passa a pôr teto (`aba09.py:167`) — a ponte tem de
   fazer o mesmo, e não escolher em silêncio.
5. **A dica não repete o número errado.** Em 28/08 a dica da Conexões afirmava
   que "Bateria longa" corta a força em **60%**, e o produto corta em **30%**
   (`RUMBLE_POLICY_MULT["economia"] = 0.3`). **O dobro do limite real, e nenhuma
   régua podia vê-lo, porque era literal.** Nenhum número desta faixa se digita.

## Como se prova (a mordida)

`tests/unit/test_migra_sistema_08_o_perfil_da_mesa_muda_de_aba.py`:

- **o `<select>` é legível.** Levante o `WebView` com a folha do produto e
  meça a cor computada do `<select>` contra o fundo. **Arranque a folha e veja
  reprovar.** Sem esta mordida, o único seletor desta aba nasce branco e ninguém
  descobre por foto — o defeito parece do desenho dela;
- **a escolha da página chega ao `_maquina_pendente`.** Injete o gesto
  `perfil-da-mesa` com cada um dos três perfis e prove que `_maquina_pendente`
  ficou com o `teto` certo, lido de `TETO_POR_PERFIL`. **Arranque a tradução e
  veja reprovar**;
- **e NÃO chega ao disco.** Depois do gesto, nada foi gravado e nenhum IPC
  saiu, e a marca "há escolhas por aplicar" do rodapé acendeu. Faça-o gravar e
  veja reprovar;
- **as três linhas da faixa são derivadas.** Troque `RUMBLE_POLICY_MULT` no
  dublê e prove que "O que ele impõe" e a frase do teto mudaram junto. **Digite
  `30%` e veja reprovar**;
- **`Vale para` conta a mesa real.** Zero, um e quatro controles: três frases
  diferentes, e a de zero não é um branco;
- **um dono só.** Depois desta sprint, `secao_orcamento` é lido pela aba
  Sistema; a aba Conexões não pode continuar desenhando o mesmo seletor. Conte
  os montadores: **um**. Dois seletores para a mesma escolha é a contradição que
  ela já derrubou uma vez (`D-O-SEM-TETO-SAI-DOS-DOIS-LUGARES`).

## O que é dela decidir

- **O que sobra na aba Conexões no lugar da seção.** O mockup da Conexões foi
  desenhado **sem** ela; esta sprint tira o seletor de lá. Se ficar um vão, a
  cura é na altura, não no `space-between` — a régua dela de 27/08.
- **AINDA ABERTA, e o mockup a repete:** o interruptor *"avisar quando a bateria
  estiver acabando"* mora nesta faixa? As duas funções estão escritas, testadas
  e **sem chamador** (`integrations/desktop_notifications.py`, registradas em
  `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py:1371` e `:1382`). Com
  quatro controles são quatro baterias a acabar em horários diferentes.
  **Opções do mockup:** (a) na faixa **Perfil de Bateria**, que é onde a palavra
  "bateria" agora mora; (b) na faixa **O Hefesto**; (c) na aba **Controles**,
  junto da bateria de cada um. **Nenhuma sprint nasce sem essa resposta** — a
  regra é não inventar feature.
