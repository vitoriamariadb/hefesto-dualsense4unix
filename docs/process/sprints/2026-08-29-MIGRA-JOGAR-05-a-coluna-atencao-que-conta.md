---
sprint: MIGRA-JOGAR-05
estado: absorvida
onda: MIGRA-JOGAR
posse:
  J5:
    - src/hefesto_dualsense4unix/app/actions/jogar/avisos.py
cria:
  - src/hefesto_dualsense4unix/app/actions/jogar/avisos.py
  - tests/unit/test_migra_jogar_05_a_coluna_atencao.py
bancada: false
depois_de:
  - MIGRA-JOGAR-03   # sem `#jg-atencao-lista` e o `<template>` não há onde pintar
  - MIGRA-JOGAR-04   # as duas nascem sob `app/actions/jogar/`; a 04 cria o pacote
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/home_actions.py
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/gui/main.glade
  - novo-layout/
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 01). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA JOGAR · 05 — a coluna Atenção que conta

**O defeito:** a janela de hoje tem **doze produtores de aviso** e nenhum lugar
que os junte. Três banners disputavam a mesma linha e o primeiro escondia os
outros — é a razão pela qual o desenho reservou espaço e pôs um contador
(`layout/01-jogar.html:2264`, *"1 aviso"*).

**Nenhum dos doze precisa ser reescrito.** Todos já existem, todos já devolvem
texto pronto, e a coluna só precisa **colhê-los e contá-los**:

| Produtor | Onde |
|---|---|
| `texto_da_pausa` | `app/actions/home_actions.py:216` |
| `autoswitch_lock_text` | `:259` |
| `texto_do_cadeado_cego` | `:310` |
| `texto_coop_degradado` | `:476` |
| `texto_native_bt_fragil` | `:539` |
| `wrapper_banner_text` | `:565` |
| `texto_do_radio_fragil` | `:589` |
| `vpad_degradation_text` | `:613` |
| `texto_do_desktop_sem_emulacao` | `:762` |
| `texto_da_divergencia` | `:1016` |
| `aviso_de_grab` | `:1394` |
| `state_full.controles_sem_driver` | `daemon/ipc_handlers.py:2562` |

A conta *"N avisos"* é aritmética sobre isso. **Não existe hoje**, em lugar
nenhum.

## O que entrega

1. **Um colhedor**, em `app/actions/jogar/avisos.py`: recebe o `state_full`,
   chama os doze, descarta os que devolvem `None` ou vazio, e devolve uma lista
   ordenada de `(selo, texto)`. **Ele não escreve frase nenhuma** — a frase é de
   quem já a escreve, e reescrevê-la aqui criaria a segunda versão de doze textos
   de uma vez.
2. **A coluna pinta a lista** em `#jg-atencao-lista`, clonando
   `#jg-modelo-aviso`, e `#jg-atencao-conta` diz o número. Zero avisos é o estado
   `.avisos.vazio` que o desenho já prevê (`01-jogar.html:228`).
3. **O espaço é reservado, e continua sendo.** A coluna tem largura de dono único
   (`--col-avisos:245px`, `:344`) e a barra vertical vai até embaixo
   (`.col-atencao{align-self:stretch}`, `:365`). O espaço abaixo do primeiro
   aviso é onde o segundo e o terceiro entram **sem empurrar a tela** — se a
   pintura crescer a caixa, o `Reconectar Controles` da faixa de baixo sai da
   tela, que é o defeito que aquele desenho existe para impedir.
4. **O teto, e o que acontece acima dele.** Com doze produtores, a mesa cheia
   pode acender mais avisos do que a coluna mostra. O que fazer aí é dela
   (abaixo); o que esta sprint entrega é que **a conta nunca minta**: a conta é do
   total, mesmo quando a lista mostra menos.

## Como se prova (a mordida)

`tests/unit/test_migra_jogar_05_a_coluna_atencao.py`:

- **a conta é a conta.** Dublê de `state_full` que acende exatamente três dos
  doze; `#jg-atencao-conta` tem de **ler** "3 avisos" e a lista tem de trazer os
  três textos, iguais aos que os produtores devolvem. **A mordida:** apague um
  produtor da lista do colhedor — o teste reprova com "2". Hoje, sem este teste,
  um produtor esquecido some da tela sem barulho;
- **a régua LÊ, não digita.** Os textos esperados vêm de **chamar** os produtores
  no próprio teste, nunca de constantes copiadas. Em 26/08 **onze** réguas desta
  casa reprovaram a melhora em vez do defeito, todas porque digitavam o que
  deviam ler;
- **zero avisos é estado, não branco.** Sem nada aceso, a caixa fica no
  `.avisos.vazio` e a conta diz zero. **A mordida:** faça a coluna sumir quando a
  lista está vazia — o teste reprova, e a tela volta a pular quando o primeiro
  aviso chega;
- **a caixa não cresce.** Com três avisos, meça a altura do quadro *"Conectado
  agora"*: ela não pode passar do que o desenho reserva, e o
  `#jg-reconectar` tem de continuar **inteiro** dentro da janela de 757 px.
  **A mordida:** ponha cinco avisos sem teto — o teste reprova mostrando os
  pixels que saíram. **Cuidado:** o `scrollIntoViewIfNeeded` do Playwright rola
  antes de medir e falsifica exatamente este tipo de medida;
- **a conta não mente acima do teto.** Sete avisos, teto de três: a lista mostra
  três e a conta diz **sete**.

## O que é dela decidir

- **O teto de itens visíveis, e o que o resto vira.** Uma linha *"e mais 4"*? Um
  rolar dentro da coluna? A coluna cresce e o quadro rola? As três mudam a tela.
- **A redação dos selos.** O desenho tem um: `RÁDIO` (`01-jogar.html:2267`). Os
  outros onze produtores não têm selo — dar nome a cada um é escrever onze textos
  de tela, e **texto novo passa por ela antes** (carimbo D3, `ESTRUTURAL`).
- **A ordem.** Doze avisos não têm prioridade escrita em lugar nenhum. Se o teto
  cortar, o que sobrevive é escolha, não detalhe.
