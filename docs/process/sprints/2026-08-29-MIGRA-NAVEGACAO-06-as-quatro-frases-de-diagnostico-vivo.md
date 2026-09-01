---
sprint: MIGRA-NAVEGACAO-06
onda: MIGRA-NAVEGACAO
posse:
  NAV6-DIAGNOSTICO:
    - src/hefesto_dualsense4unix/app/telas/navegacao/diagnostico.py
    - layout/_ferramentas/aba06.py
    - layout/06-navegacao.html
cria:
  - src/hefesto_dualsense4unix/app/telas/navegacao/diagnostico.py
  - tests/unit/test_migra_navegacao_06_o_diagnostico_nao_some.py
bancada: false
depois_de:
  - MIGRA-NAVEGACAO-01
  - MIGRA-NAVEGACAO-02  # mesma bancada do mockup (aba06.py) — série
  - MIGRA-NAVEGACAO-04  # ela é quem traz o bloco `mouse_emulation` à tela
  - MIGRA-NAVEGACAO-05
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/app.py
  - src/hefesto_dualsense4unix/app/actions/mouse_actions.py
  - src/hefesto_dualsense4unix/app/actions/input_actions.py
  - src/hefesto_dualsense4unix/daemon/
---

# MIGRA NAVEGAÇÃO · 06 — As quatro frases de diagnóstico vivo ganham lugar, ou o contrato muda

**Esta é a trava do desenho desta aba.** Ela não executa sem a palavra dela, e
está escrita primeiro no índice por isso.

## O defeito

**O mockup apagou quatro diagnósticos que o produto já sabe e já pinta.** É a
forma de defeito mais cara desta casa **ao contrário**: em vez de cura escrita e
nunca ligada, é cura **ligada** e desligada pelo redesenho.

| a frase | quem a produz | de onde ela lê |
|---|---|---|
| o verde/laranja/vermelho do mouse virtual | `mouse_actions.py:579` (`_refresh_mouse_view`) → `mouse_uinput_status_label` (`glade:3762`) | `mouse_emulation.device_ativo` + `bloqueio` (BG-02, 25/08) |
| *"Neste computador: …"* (teclado na tela) | `input_actions.py:265` (`frase_do_teclado_na_tela`) | `keyboard_emulation.osk_disponivel` (N12) |
| *"Sem tecla (não digitam nada) — 10 deles já são do mouse"* | `input_actions.py:222` (`frase_dos_botoes_sem_tecla`) | os bindings resolvidos |
| *"Guardados, sem linha na lista"* (as três regiões do touchpad) | `input_actions.py:309` (`frase_dos_atalhos_fora_da_lista`) | os bindings do perfil |
| **e a quinta**: a frase do portão HARM-05 | `mouse_actions.py:285` (`_sync_mouse_mode_gate`) → `mouse_mode_hint_label` (`glade:3751`) | o modo vivo |

**As cinco leem do daemon hoje. Nenhuma tem lugar no desenho aprovado.**

E o contrato manda as quatro ficarem. O bloco "Nada se perdeu" da §6 do
redesenho é requisito linha a linha, e a §"Os padrões que valem para as dez",
P3, é explícita:

> *"nem todo texto longo é ajuda: o «Estado da vibração», a linha da ponte da
> Jogar e **três parágrafos da Navegação são diagnóstico vivo, que muda
> sozinho. Diagnóstico não some sob o ponteiro.**"*

**Pior: o próprio mockup aponta para uma delas que não está lá.** A dica do "?"
do quadro Navegação diz, textualmente:

> *"Precisa de **uinput** e de uma regra **udev**; o instalador já deixa os dois
> prontos. **Se a linha de estado abaixo estiver vermelha, é isso que falta.**"*

**Não há linha de estado abaixo.** Ela foi apagada com as outras.

## O que entrega

Duas metades, e só a primeira executa sem a palavra dela.

### A metade que executa: o dado chega, mesmo sem lugar na tela

1. **`diagnostico.py`** — o dono único das cinco frases nesta aba. Ele **não
   reescreve nenhuma**: importa `frase_dos_botoes_sem_tecla`,
   `frase_do_teclado_na_tela` e `frase_dos_atalhos_fora_da_lista` de
   `input_actions.py`, e as duas constantes de gate (`MODE_GATE_HINT`,
   `MODO_DESCONHECIDO_HINT`) de `mouse_actions.py`. As três primeiras são
   **puras de propósito** — é a disciplina que as docstrings delas declaram, e é
   o que permite testá-las sem montar janela.
2. **As cinco chegam à página por endereço** (`data-valor="diag.mouse_virtual"`,
   `diag.osk`, `diag.sem_tecla`, `diag.fora_da_lista`, `diag.modo`), e o valor é
   `""` quando não há o que dizer. Nada a dizer é melhor que uma linha vazia.
3. **A hierarquia do `_refresh_mouse_view` é preservada inteira**, e ela é a
   parte cara: o daemon manda, a sonda local ajuda, e a ordem é
   *device no ar → módulo ausente → nó sem permissão → não está pronto*. A sonda
   local é a única que sabe QUAL é o defeito; o daemon é o único que sabe se o
   device subiu. Perder a ordem devolve os dois erros que a BG-02 fechou: o
   Flatpak gritando "sem permissão" sobre um `/dev/uinput` que o daemon abre, e
   o *"Pronto para usar como mouse"* com o cursor parado.

### A metade que espera ela: onde as cinco moram no desenho

A proposta desta sprint é **uma faixa de estado no rodapé do quadro
Navegação** — uma linha, com o glifo e a cor mudando juntos, que é onde o "?"
do próprio mockup já aponta. Ela ocupa uma linha de altura e não desloca nenhum
dos três blocos.

**Isto é desenho novo numa página que ela aprovou.** Não entra sem a palavra
dela, e não entra por dedução: quem executar sem perguntar está escolhendo em
silêncio, que é o que a regra da casa proíbe.

## Como se prova (a mordida)

`tests/unit/test_migra_navegacao_06_o_diagnostico_nao_some.py`:

1. **As cinco existem, e vêm de um lugar só.** `grep` pelo texto de cada frase
   em `src/` devolve **um** arquivo — o que já a produz. **Morde:** cole a frase
   do mouse virtual dentro de `diagnostico.py` e reprova. Reescrever a frase é
   como duas versões da mesma verdade nascem.
2. **Cada uma muda com o dado, não com o tempo.** Cinco pares
   (estado → texto esperado), com o texto lido **da função**, nunca digitado no
   teste. **Morde:** este é o ponto onde onze réguas reprovaram a melhora em vez
   do defeito, em 26/08, todas pela mesma forma — *digitavam o que deviam LER*.
   O teste importa a constante; não a copia.
3. **A hierarquia do mouse virtual não inverte.** Quatro cenários:
   (a) daemon diz `device_ativo` e a sonda local diz "sem permissão" → **verde**
   (o caso do Flatpak); (b) módulo ausente → a frase do componente;
   (c) nó sem permissão para este processo → a da permissão; (d) daemon diz
   `bloqueio: sem_device` com permissão em ordem → **laranja**, "ainda não está
   pronto". **Morde:** troque a ordem de (a) e (c) e reprova. É a inversão exata
   que a BG-02 pagou para achar.
4. **Nada a dizer é `""`.** Perfil com todos os botões com tecla →
   `frase_dos_botoes_sem_tecla` devolve `""` e a faixa some. **Morde:** faça
   devolver uma frase vazia com marcação e reprova.
5. **O "?" não aponta para o vazio.** O HTML gerado contém a expressão *"a linha
   de estado abaixo"* **se e somente se** existir um elemento com
   `data-valor="diag.mouse_virtual"`. **Morde:** apague a faixa e deixe a dica —
   reprova nomeando a dica. É o defeito que o mockup carrega hoje, e esta é a
   única régua desta casa que o enxerga.

## O que é dela decidir

**A pergunta, inteira:** *o desenho ganha uma faixa de estado no quadro
Navegação, ou o contrato muda e as quatro frases saem?*

- **Se ganha faixa:** uma linha no rodapé do quadro, com as cinco frases
  disputando o mesmo lugar por prioridade (a do modo primeiro — é a que impede
  um clique que derruba o co-op).
- **Se o contrato muda:** o "Nada se perdeu" da §6 ganha nota datada dizendo
  quais frases saíram e por quê, e o "?" do quadro perde a linha que aponta para
  elas. **Não se apaga decisão medida** — mas o P3 do redesenho é decisão dela, e
  ela pode mudá-la; o que não pode é a tela mudar sem que o documento mude.

**O que quem coordena recomenda, e por quê:** ganha faixa. Quatro das cinco
custaram sprint própria para nascer (BG-02, N12, TECLADO-QUE-NAO-DIGITA-01,
ATALHO-FORA-DA-LISTA-01), e a quinta é o portão que impede o clique que derrubava
o vpad e os jogadores do co-op **sem aviso no meio do jogo**. Migrar a aba sem
elas é regressão medida, não simplificação.
