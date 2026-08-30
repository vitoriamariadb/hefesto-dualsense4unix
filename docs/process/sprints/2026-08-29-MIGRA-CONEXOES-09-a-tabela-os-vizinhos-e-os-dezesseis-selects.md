---
sprint: MIGRA-CONEXOES-09
onda: MIGRA-CONEXOES
posse:
  M9:
    - src/hefesto_dualsense4unix/app/actions/config/secao_mesa.py
cria:
  - tests/unit/test_migra_conexoes_a_mesa_de_radio_chega_a_pagina.py
bancada: false
depois_de:
  # A MEDIÇÃO DO POPUP vem antes, e ela é de outra onda de propósito: uma
  # bancada só responde por 117 campos das dez abas. Se o popup do `<select>`
  # não sobreviver ao cosmic-comp, esta sprint muda de forma antes de começar.
  - MIGRA-GATILHOS-01
  - MIGRA-CONTROLES-01
  - MIGRA-CONEXOES-01
  - MIGRA-CONEXOES-03
  - MIGRA-CONEXOES-04
  # SÉRIE por arquivo (R5): as cinco abaixo também possuem `secao_mesa.py`.
  - ONDA-CONEXOES-02
  - ONDA-CONEXOES-09
  - MOTOR-DO-ARRANJO-01
  - LEVA-2
  - LEVA-4
nao_toca:
  - src/hefesto_dualsense4unix/integrations/mesa_de_radio.py
  - src/hefesto_dualsense4unix/integrations/apelido_do_dongle.py
  - src/hefesto_dualsense4unix/integrations/censo_do_barramento.py
  - src/hefesto_dualsense4unix/integrations/mapa_das_portas.py
  - src/hefesto_dualsense4unix/app/widgets/mapa_da_mesa.py
  - src/hefesto_dualsense4unix/app/widgets/calibrar_entradas.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - scripts/telas/aba08.py
---

# MIGRA CONEXÕES · 09 — a tabela, os vizinhos, e os dezesseis `<select>`

**O defeito:** o inventário físico da mesa é a parte da aba com **mais dado
pronto e menos risco de fonte** — e é onde a rota WebKit tem o seu ponto frágil
concentrado.

Tudo o que o quadro "Rádio e adaptadores" mostra **já é lido hoje**, sem root e
sem IPC:

| o que | quem lê |
|---|---|
| adaptadores Bluetooth (nome, modelo, onde está) | `integrations/mesa_de_radio.ler_a_mesa` (sysfs) |
| o apelido de cada adaptador | `integrations/apelido_do_dongle.ler_os_dongles` / `.renomear_o_dongle` (Alias do BlueZ) |
| quem divide controlador com quem | `integrations/censo_do_barramento.ler_o_barramento` / `.hub_em_comum` |
| o número da entrada, quando ela já foi ensinada | `integrations/mapa_das_portas.porta_de` / `.resumo_do_mapa` |
| as entradas do gabinete | `integrations/entradas_do_gabinete.listar_entradas`, `integrations/censo_do_gabinete` |

E quem monta hoje: `app/actions/config/secao_mesa.py:398` (`montar`), com
`:1004` (`_desenhar_adaptadores`), `:1110` (`_desenhar_radios`) e `:1168` (a
coluna "O que é"). São **44** chamadas a `Gtk.` — a maior concentração da aba.

## O ponto frágil da rota mora aqui, e ele não é hipótese

`GtkComboBox` está **proibido** nesta casa, e a razão está escrita no widget que
o substituiu (`app/widgets/segmented_selector.py:3-6`): o cosmic-comp *"rouba o
foco no clique e FECHA o popup do combo na hora"* (cosmic-epoch#2497 /
pop#3660). O `gui/main.glade:2636` repete a proibição em comentário.

Sob WebKit, o `<select>` nativo abre um popup do **WebKitGTK** — outra
biblioteca, **mesma família de janela filha**. Ninguém mediu se ele sobrevive ao
cosmic-comp. E esta é **a aba com mais `<select>` das dez**: medido em 29/08, **16** no miolo
— **12** nas linhas dos controles e **4** nos rádios vizinhos.

**O número foi medido duas vezes, e a primeira estava errada.** Um
`grep -c '<select'` devolve **19**, porque conta três ocorrências dentro de
comentários. A régua desta sprint conta **tags**, nunca a palavra — é o mesmo
defeito que reprovou onze réguas desta casa em 26/08.

Sinal de que a família já dói: o `ver.py` já precisou de  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->
`select{appearance:none}` porque o WebKitGTK pintava caixa branca com texto quase
invisível.

**Por isso esta sprint corre atrás da `MIGRA-GATILHOS-01`**, que é bancada pura e
responde a pergunta para as dez abas de uma vez. Se a resposta for "não
sobrevive", esta sprint troca os 19 `<select>` por um padrão sem popup — o
equivalente HTML do `SegmentedSelector` —, e isso muda o desenho aprovado, logo
**passa por ela**.

## O que entrega

1. **A tabela dos adaptadores** — Nome · Adaptador · Onde está · Renomear —
   pintada do payload, uma linha por adaptador **real**. Zero adaptadores é
   estado legítimo e tem de aparecer como tal.
2. **Os vizinhos de 2,4 GHz**, com a coluna "O que é" e os sete valores na ordem
   do produto (`secao_mesa.py:198`), mais o selo dos três degraus de quem
   respondeu (`:221`). O "Outro" **volta a abrir campo de texto** — ele foi
   cortado por falta de altura e o contrato o devolve.
3. **As duas semânticas de gravação continuam distintas, e a tela diz qual é
   qual.** Está declarado no cabeçalho de `secao_mesa.py`: o **nome do
   adaptador** grava **na hora** (é Alias do BlueZ, e o BlueZ grava na hora), o
   resto espera o rodapé. A `D-A-CONEXOES-GRAVA-NA-HORA-E-LEMBRA`
   (`docs/data/decisoes-dela.csv:87`) resolve o rumo — *"aplicar e salvar, além
   de gravar na hora e lembrar se não salvar"* — e o mecanismo existe:
   `RECIBO_GUARDADO` (`app/actions/config/moldura.py:94`). **O mockup não desenha
   recibo nenhum**, e a legenda dele confessa: *"a tela ainda não mostra o recibo
   disso"*.
4. **`montar()` sai, `dados(host, estado)` entra**, e os gestos sobem:
   `data-g="adaptador.renomear"`, `data-g="vizinho.oquee"`,
   `data-g="vizinho.corrigir"`.
5. **As duas perguntas da sala NÃO estão aqui.** Elas moram hoje em
   `secao_mesa.py:583` (`_declaracoes`, com `_PERGUNTA_DA_ALTURA:335` e
   `_PERGUNTA_DA_VISADA:344`) e mudaram-se, em 28/08, para a janela "Mapear
   Entradas". Quem as move é a `MIGRA-CONEXOES-12`. **Entre a saída daqui e a
   chegada lá elas não estão em tela nenhuma: buraco declarado, não descuido.**

## Como se prova (a mordida)

`tests/unit/test_migra_conexoes_a_mesa_de_radio_chega_a_pagina.py`:

* **uma linha por adaptador real.** Payloads com 0, 1 e 3 adaptadores → 0, 1 e 3
  linhas. **Mordida:** crave duas linhas no gerador e veja reprovar em dois dos
  três casos.
* **o renomear grava na hora, e o recibo aparece.** Gesto → `renomear_o_dongle`
  chamado uma vez, e o recibo pintado. **Mordida:** faça o renomear esperar o
  "Aplicar" e o teste reprova: é a `D-A-CONEXOES-GRAVA-NA-HORA-E-LEMBRA` sendo
  desfeita.
* **as duas semânticas não se confundem.** O que grava na hora mostra recibo; o
  que espera o rodapé **não** mostra. **Mordida:** ponha recibo nos dois e o
  teste reprova — recibo em tudo é recibo em nada.
* **a coluna "O que é" tem os sete valores do produto, LIDOS.** O teste colhe a
  lista de `secao_mesa.py:198` e compara com as `<option>` do HTML.
  **Mordida:** acrescente um oitavo no produto e veja o teste apontar a página
  desatualizada.
* **nenhum MAC real.** `hci0`, o Alias e o endereço do adaptador passam pelos
  **dois** portões de anonimato — o autoritativo por OUI
  (`tests/unit/test_docs_mac_anonimato.py`) e o por forma
  (`scripts/check_endereco_de_radio.py`). Eles são diferentes de propósito, e o
  segundo alcança o que o primeiro estruturalmente não alcança.
* **o `<select>` obedece à medição da `MIGRA-GATILHOS-01`.** O teste lê o
  veredito daquela medição (o arquivo em `docs/process/medicoes/`) e exige que a
  forma dos 16 campos case com ele. **Mordida:** deixe um `<select>` nativo
  depois de a medição ter reprovado o popup e o teste diz qual.

## O que é dela decidir

* **A REDAÇÃO DO RECIBO.** A decisão já é dela e o mecanismo existe; o que falta
  é o texto. Não trava a execução — trava o fechamento.
* **O "corrigir" dos vizinhos volta como botão?** O mockup o eliminou, e ela já
  foi avisada de que ele volta se ela quiser (aberto desde 27/08).
* **"Adaptadores Bluetooth" é título novo na tela.** Ele existe só para a coluna
  da esquerda ser irmã da direita. É palavra nova, e a palavra é dela.
