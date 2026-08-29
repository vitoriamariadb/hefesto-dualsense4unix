---
sprint: MIGRA-NAVEGACAO-11
onda: MIGRA-NAVEGACAO
posse:
  NAV6-BOTOES:
    - src/hefesto_dualsense4unix/app/telas/navegacao/botoes.py
    - src/hefesto_dualsense4unix/app/actions/input_actions.py
cria:
  - src/hefesto_dualsense4unix/app/telas/navegacao/botoes.py
  - tests/unit/test_migra_navegacao_11_vinte_e_uma_linhas_um_dono.py
bancada: false
depois_de:
  - MIGRA-NAVEGACAO-01
  - MIGRA-NAVEGACAO-02
  - MIGRA-NAVEGACAO-06  # ela é dona das frases que viram o rodapé desta tabela
  - ONDA-NAVEGACAO-01
  - ONDA-NAVEGACAO-04   # ela tira o mapa do mouse do código e cria `core/disputa_de_botao.py`  <!-- ref-externa: nasce em ONDA-NAVEGACAO-04, ainda não executada -->
  # A FILA QUE JÁ RECLAMAVA ESTES ARQUIVOS, medida com
  # `scripts/check_colisao_de_sprints.py` em 29/08/2026. Não é escolha de
  # coordenação: quem divide arquivo executa EM SÉRIE (R5). Reconferir no dia
  # do despacho — a fila anda, e endereço de código envelhece calado.
  - ONDA-NAVEGACAO-07
  - ONDA-NAVEGACAO-09
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/app.py
  - src/hefesto_dualsense4unix/integrations/uinput_mouse.py
  - src/hefesto_dualsense4unix/core/keyboard_mappings.py
  - src/hefesto_dualsense4unix/daemon/
  - novo-layout/
---

# MIGRA NAVEGAÇÃO · 11 — As vinte e uma linhas de "o que cada botão faz", com um dono só

## O defeito

**A pop-up promete 21 botões, o produto conhece 17, e não são os mesmos 17.**
Medido, lado a lado:

| | quantos | o que tem que o outro não tem |
|---|---|---|
| `BOTOES` do mockup (`aba06.py`) | **21** | `L3 direção` e `R3 direção` (que são **eixos**, não botões) e as **três regiões do touchpad** |
| `CANONICAL_BUTTONS` (`app/actions/input_actions.py:83`) | **17** | o **PS** |

A interseção é **16**. Quem escrever a ponte de leitura sem notar isso vai
pintar cinco linhas com o valor de outra.

**Segundo defeito: a segunda coluna tem duas fontes e nenhuma delas é o
perfil.** As 21 linhas da pop-up misturam:

- a metade "tecla", que vem de `Profile.key_bindings` (`profiles/schema.py:965`)
  mesclado com `DEFAULT_BUTTON_BINDINGS` (`core/keyboard_mappings.py:41` — e de
  fábrica são **seis**: options, create, l1, r1, l3, r3), resolvido por
  `_resolve_effective_bindings` (`input_actions.py:466`);
- a metade "Mouse", que é **constante no código, não dado**:
  `integrations/uinput_mouse.py:93` (`BUTTON_TO_UINPUT`: cross→BTN_LEFT,
  triangle→BTN_RIGHT, r3→BTN_MIDDLE), `:99` (`DPAD_TO_KEY`, as quatro setas) e
  `:109` (`EDGE_KEY_MAP`: circle→Enter, square→Esc). Na tela de hoje isso é
  **texto fixo**: `gui/main.glade:3856` (`mouse_mapping_grid`), 8 pares
  escritos à mão. **Nenhum caminho lê isso do perfil, e nenhum o escreve.**

**Terceiro defeito, e é o que a §6 chama de "deixa de mentir":** dar uma tecla ao
X faz o botão fazer **as duas coisas ao mesmo tempo**, cada uma pelo seu
dispositivo virtual — e a tabela de hoje oferece os vinte botões sem dizer isso.
A frase existe (`frase_dos_botoes_sem_tecla`, `input_actions.py:222`, o *"10
deles já são do mouse"*), mas ela é um rodapé, não uma linha da tabela.

**Quarto: só existem DOIS tokens virtuais.** `__OPEN_OSK__` e `__CLOSE_OSK__`
(`core/keyboard_mappings.py:38-39`). O grupo *Executar Comando* do mockup
oferece **cinco** ações: abrir o teclado na tela, fechar, **abrir a Steam**,
**sair do modo jogo** e **escolher um programa…**. Três delas não têm token.

## O que entrega

1. **Uma lista de botões, e ela é do mapa.** As linhas saem de
   `docs/data/pecas-do-dualsense.csv` — que é o pedido dela de 27/08 (*"cada vez
   que o svg ou do controle ou de um glifo aparecerem tem que considerar os do
   nosso mapa"*) e é o que o gerador já faz. `CANONICAL_BUTTONS` passa a ser
   **derivado** do mapa, e as divergências ficam explícitas em vez de tácitas:
   - os dois **eixos** (`L3 direção`, `R3 direção`) são linhas de outra
     natureza — o mapa já diz, na coluna `tipo`, que *"Clique e direção são duas
     entradas na mesma peça"*;
   - as **três regiões do touchpad** voltam pela sprint 12, que é quem paga o
     preço (a regra udev);
   - o **PS** entra ou sai por decisão dela (ver abaixo).
2. **A segunda coluna passa a ter um dono só.** O que o botão faz é resolvido
   **uma vez**, somando a tecla do perfil com o mapa de mouse, e a **disputa**
   é nomeada — quem entrega o resolvedor é a `ONDA-NAVEGACAO-04`
   (`core/disputa_de_botao.py`). Esta sprint **consome**; se aquela não tiver  <!-- ref-externa: nasce em ONDA-NAVEGACAO-04, ainda não executada -->
   corrido, esta para e diz por quê.
3. **A linha mostra a disputa, não só o rodapé.** Um botão que já é do mouse e
   ganhou tecla aparece com as **duas** coisas, na mesma linha. A frase do
   rodapé (`frase_dos_botoes_sem_tecla`) continua, porque ela responde outra
   pergunta ("quais não digitam nada") — as duas não se substituem.
4. **As ações sem token ficam DESLIGADAS com o motivo.** *"Abrir a Steam"* e
   *"Sair do modo jogo"* não existem como valor de botão hoje; enquanto não
   existirem, a opção aparece inerte com a razão. Oferecer o que não dispara é a
   janela mentindo — é a mesma medida que tirou as três regiões do touchpad em
   09/08.
5. **"Voltar ao padrão" pergunta antes, e diz o que apaga.** É item do "Nada se
   perdeu" (*"o «Voltar ao padrão» ganha confirmação"*), e o mockup já escreveu
   as duas frases certas: o desta tela devolve as 21 linhas de **o que cada
   botão faz** e diz que *"O Remapeamento dos botões não é tocado"*.
6. **O `mouse_mapping_grid` morre como texto.** Ele sai do Glade na sprint 01;
   aqui ele **renasce como dado**, e a tabela passa a saber da tabela ao lado —
   que é o item do contrato *"e deixa de mentir"*.

## Como se prova (a mordida)

`tests/unit/test_migra_navegacao_11_vinte_e_uma_linhas_um_dono.py`:

1. **A lista da tela é a do mapa.** Toda linha cita um `id` de
   `docs/data/pecas-do-dualsense.csv`; nenhum id inventado. **Morde:** acrescente
   uma linha digitada e reprova; `scripts/check_pecas_do_dualsense.py` reprova
   junto.
2. **As duas listas não divergem em silêncio.** O teste compara a lista da tela
   com `CANONICAL_BUTTONS` e **exige que toda diferença esteja declarada** com o
   motivo — eixo, região do touchpad, ou decisão dela sobre o PS. **Morde:** tire
   a declaração de uma delas e reprova nomeando a peça. É o molde do
   `test_portao_a_lista_de_portoes_e_uma_so.py`, que compara nos dois sentidos.
3. **A segunda coluna vem do perfil, não do mockup.** Perfil com
   `key_bindings: {"triangle": ["KEY_C"]}` pinta `C` no triângulo, e os outros
   seguem o de fábrica. **Morde:** compare com uma string digitada no teste e
   ele passa com a cura arrancada — por isso o fixture usa `KEY_C`, que não é
   default de nada.
4. **A disputa aparece na linha.** X com tecla → a linha diz **mouse e tecla**.
   **Morde:** mostre só a tecla e reprova. É o defeito nomeado no contrato:
   *"hoje dar uma tecla ao X faz o botão fazer as duas coisas em silêncio"*.
5. **Ação sem token é inerte.** *"Abrir a Steam"* e *"Sair do modo jogo"* nascem
   `disabled` enquanto `is_virtual_token` não as reconhecer. **Morde:** deixe-as
   selecionáveis e reprova — e o teste cita `core/keyboard_mappings.py:38-39`,
   onde estão os **dois** tokens que existem.
6. **`{}` não é defeito.** `key_bindings == {}` é escolha legítima ("teclado
   silencioso") e a tela diz o que é e como sair. **Morde:** faça a lista vazia
   parecer erro e reprova — é a distinção que `frase_dos_botoes_sem_tecla` já
   sabe fazer e que a tabela nova poderia perder.

## O que é dela decidir

- **O PS ganha linha nas 21?** Ele está em `CANONICAL_BUTTONS` e **não** está no
  mockup. Dar tecla ao PS colide com os cinco gestos — todos começam nele.
  `PROVISÓRIO — decisão dela`: a proposta é **não dar linha**, e dizer no rodapé
  que o PS é dos gestos, que é o que a aba já ensina logo acima.
- **Os dois eixos (`L3 direção`, `R3 direção`) são linha de tabela ou ajuste de
  velocidade?** Hoje eles são as duas velocidades do bloco de ativação, e no
  mockup aparecem **nos dois lugares**. Um valor com dois donos na mesma aba é
  o P5 do redesenho.
- **A lista de teclas é fechada?** Pergunta 9 do índice de 27/08, e continua
  aberta: fechar mata o erro de digitação e mata `Ctrl + Alt + F2` junto.
