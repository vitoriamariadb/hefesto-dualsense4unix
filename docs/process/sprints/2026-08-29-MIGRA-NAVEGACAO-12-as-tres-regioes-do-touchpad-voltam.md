---
sprint: MIGRA-NAVEGACAO-12
estado: absorvida
onda: MIGRA-NAVEGACAO
posse:
  NAV6-TOUCHPAD:
    - src/hefesto_dualsense4unix/daemon/subsystems/keyboard.py
    - assets/76-dualsense-touchpad-libinput-ignore.rules
cria:
  - tests/unit/test_migra_navegacao_12_as_tres_regioes_voltam.py
bancada: true
depois_de:
  - MIGRA-NAVEGACAO-11  # a tabela é onde as três ganham linha
  - ONDA-NAVEGACAO-01
  - ONDA-NAVEGACAO-04
  # A FILA QUE JÁ RECLAMAVA ESTES ARQUIVOS, medida com
  # `scripts/check_colisao_de_sprints.py` em 29/08/2026. Não é escolha de
  # coordenação: quem divide arquivo executa EM SÉRIE (R5). Reconferir no dia
  # do despacho — a fila anda, e endereço de código envelhece calado.
  - IDENTIDADE-01
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/app.py
  - src/hefesto_dualsense4unix/app/telas/
  - novo-layout/
  - install.sh
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 06). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA NAVEGAÇÃO · 12 — As três regiões do touchpad voltam, e a regra udev volta com elas

**Decisão dela, 29/08/2026** (`D-AS-TRES-REGIOES-DO-TOUCHPAD-VOLTAM`):
*"eu mudei de ideia."* A razão que ela deu: as três regiões servem no uso de
**mouse** — clique esquerdo, meio e direito num touchpad só —, que é outro uso
do que motivou a remoção em 09/08.

## O defeito

Hoje o perfil **guarda** as três e o produto **não as dispara**, e a tela avisa
disso numa frase (`frase_dos_atalhos_fora_da_lista`, `input_actions.py:309`):
*"Guardados, sem linha na lista (…) O touchpad voltou a ser o mouse do
computador, então esta versão não dispara esses atalhos."*

O estado, medido, em quatro lugares:

| onde | o que diz |
|---|---|
| `core/keyboard_mappings.py:41` | as três continuam em `DEFAULT_BUTTON_BINDINGS` — `touchpad_left_press: KEY_BACKSPACE`, `middle: KEY_ENTER`, `right: KEY_DELETE` |
| `app/actions/input_actions.py:83` | **saíram** de `CANONICAL_BUTTONS` em 09/08 (TOUCHPAD-DO-SISTEMA-01), com a razão escrita |
| `daemon/subsystems/keyboard.py` | o gate `_combine_with_touchpad` **se cala** |
| `assets/76-dualsense-touchpad-libinput-ignore.rules` | a regra que devolveu o touchpad ao sistema, com a reversão escrita no cabeçalho |
| `assets/profiles_default/point_and_click.json` | ainda guarda `touchpad_left_press: KEY_E` — o perfil de fábrica nunca foi ajustado |

**Voltar é reverter as quatro coisas juntas.** Uma não vai sem a outra, e é
exatamente o que o comentário de `CANONICAL_BUTTONS` diz: *"PARA VOLTAR: é a
mesma decisão, do outro lado — o touchpad passaria a ser do Hefesto de novo (a
reversão da regra está escrita no cabeçalho de
`assets/76-dualsense-touchpad-libinput-ignore.rules`), e estas três linhas voltam
junto."*

**E o padrão de fábrica de 09/08 era perigoso:** `touchpad_left_press` era
`KEY_BACKSPACE`, ou seja, **um clique apagaria texto sem ela pedir**. Voltar com
o mesmo padrão é reabrir o defeito. O mockup já escolheu outro, e é o certo:
**Botão esquerdo · Botão direito · F11** (`aba06.py`, `BOTOES`).

## O que entrega

1. **A regra udev volta ao que era, e só onde precisa.** O cabeçalho do arquivo
   já traz a reversão escrita; a armadilha medida está lá também: o curinga
   `*DualSense*Touchpad` apagava o touchpad **físico** do libinput em USB, BT,
   Edge **e** vpad, nos três modos — *"o dedo andava e o cursor não"*
   (`docs/data/mapa-controles.csv`, `toque.touchpad.cursor`, `cabo_ressalva`).
   **Só o vpad fica fora do libinput.**
2. **O gate `_combine_with_touchpad` volta a falar**, e o dispatcher volta a
   mesclar `regions_pressed()` ao conjunto de botões — o mecanismo existe
   inteiro e está descrito em `core/keyboard_mappings.py:41`.
3. **O padrão de fábrica das três muda.** Sai `KEY_BACKSPACE`/`KEY_ENTER`/
   `KEY_DELETE`; entra o do mockup — esquerdo, direito e F11. O `KEY_BACKSPACE`
   **não volta**: é fato errado corrigido, não decisão a preservar.
4. **A decisão de 09/08 ganha nota datada**, no comentário de
   `CANONICAL_BUTTONS` e na frase de `frase_dos_atalhos_fora_da_lista`. Não se
   apaga decisão medida — ela caduca com data e com quem a derrubou.
5. **A frase "Guardados, sem linha na lista" some pelo caminho certo:** ela
   devolve `""` quando não há nada fora da lista, e passa a devolver `""` porque
   as três **entraram** na lista. Nenhuma frase é apagada; ela deixa de ter o
   que dizer.
6. **O `point_and_click.json` acompanha.** Ele guarda `touchpad_left_press:
   KEY_E`, que era coerente com um mundo onde a região não disparava. Com ela
   disparando, o perfil de fábrica de um estilo de **apontar e clicar** tem de
   dizer "botão esquerdo".

## Como se prova (a mordida)

`tests/unit/test_migra_navegacao_12_as_tres_regioes_voltam.py`:

1. **As três disparam.** Um clique em cada região produz o evento certo pelo
   dispatcher. **Morde:** cale o `_combine_with_touchpad` e reprova.
2. **O cursor continua andando.** O touchpad **físico** continua sendo ponteiro
   do sistema — a régua confere que a regra udev **não** volta ao curinga que
   apagava os quatro barramentos. **Morde:** devolva o curinga e reprova
   nomeando os três modos. Esta é a régua cara: sem ela, a volta das três
   regiões custa o cursor, que é o defeito que a regra 76 nasceu para curar.
3. **Nenhum padrão de fábrica apaga texto.** `DEFAULT_BUTTON_BINDINGS` não tem
   `KEY_BACKSPACE` em região de touchpad. **Morde:** cole-o de volta e reprova.
4. **A frase muda de razão, não de existência.** `frase_dos_atalhos_fora_da_lista`
   com as três no perfil devolve `""` **porque elas estão em
   `CANONICAL_BUTTONS`**, não porque a função foi capada. **Morde:** faça a
   função devolver `""` sempre e reprova — ela ainda tem de nomear qualquer
   outro atalho fora da lista.
5. **A nota datada existe.** O comentário de `CANONICAL_BUTTONS` cita a data da
   decisão nova. **Morde:** apague a decisão de 09/08 em vez de anotá-la e
   reprova: `scripts/validar-caducos.py` reprova junto.

## O que é dela decidir

- **Nada trava esta sprint** — a decisão é dela e está tomada. O que **é dela
  ver** é a bancada: com o controle na mão, o dedo andando e os três cliques
  fazendo o que a tabela promete, e o touchpad do notebook/PC dela intacto.
  `bancada: true` por isso.
- **O `point_and_click.json` de fábrica muda?** Ele é perfil embarcado; mudar
  perfil de fábrica muda o que nasce na máquina de quem instalar. A proposta é
  **mudar**, porque o `KEY_E` só fazia sentido enquanto a região não disparava.
