---
sprint: MIGRA-NAVEGACAO-INDICE
onda: MIGRA-NAVEGACAO
posse:
  COORDENA:
    - docs/process/sprints/2026-08-29-MIGRA-NAVEGACAO-INDICE.md
cria: []
bancada: false
depois_de: []
nao_toca:
  - src/
  - tests/
  - novo-layout/
  - assets/
  - scripts/
---

# MIGRA NAVEGAÇÃO — o índice

**29/08/2026.** A aba **06 — Navegação** sai do `Gtk.Notebook` do Glade e passa
a ser a página `06-navegacao.html` dentro de um `WebKit2.WebView`
(`D-A-INTERFACE-NOVA-E-O-MOCKUP-DENTRO-DE-UMA-JANELA-GTK`).

**Dezesseis sprints**, e o censo desta aba havia dito catorze. As duas que
entraram, com o motivo:

- **a 12 (as três regiões do touchpad voltam)** — era pergunta aberta no censo e
  virou **decisão dela no mesmo dia** (`D-AS-TRES-REGIOES-DO-TOUCHPAD-VOLTAM`,
  *"eu mudei de ideia"*). Voltar é reverter a regra udev, o gate do daemon, o
  padrão de fábrica e o perfil embarcado — trabalho que sprint nenhuma tinha;
- **a 08 (os gestos ficam trocáveis)** separou-se da **07 (os gestos chegam à
  tela)** porque a leitura executa **agora** e a escrita **espera a palavra
  dela** (pergunta 4 do contrato). Juntas, a resposta dela travaria as duas.

E duas famílias **não** viraram sprint própria, por escolha: os 60 `<select>`
e os 12 filtros mortos entraram na **02** (são o mesmo arquivo e a mesma
régua), e a assimetria do rádio entrou na **04** (as duas linhas do mapa são
exatamente as duas velocidades de analógico que a tela mostra).

> **A EXECUÇÃO ESPERA O OK DELA SOBRE O PILOTO.** A aba **Controles** está sendo
> feita viva agora, como piloto do transplante. Palavra dela: *"Preciso avaliar
> como ela se comporta. Depois dou o ok pra seguirmos materializando a ordem pra
> fazermos todas as abas funcionarem no novo motor."* **As dezesseis desta onda
> se ESCREVEM; nenhuma executa antes desse ok.**

**Contrato:** `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md` §6
(linhas 443-517) — toda linha do "Nada se perdeu" é requisito.
**Especificação visual:** `novo-layout/06-navegacao.html` e o gerador
`novo-layout/_ferramentas/aba06.py`. **Correções literais dela:**
`novo-layout/_ferramentas/CORRECOES-DELA.md`.

---

## Por que esta aba é a mais cara das dez

**O mockup mostra 90 valores e oferece 90 gestos; o produto lê 36 deles (40%).**
E **cinco famílias inteiras não têm uma linha de código em lugar nenhum**:

| família | o que existe hoje |
|---|---|
| remapeamento botão→botão (21 linhas) | `grep -n remap profiles/schema.py` → **0** |
| Modo Steam (3 degraus) | `grep -rln "steam_deck\|big_picture\|modo_steam\|gamepadui" src/` → **vazio** |
| Navegação Interna | trava medida: o `BUTTON_DOWN` não carrega `uniq` |
| as duas metades novas das velocidades (touch e dois dedos) | `ProfileMouseConfig` tem **um** `speed` e **um** `scroll_speed` |
| Point-and-click como **estilo** | existe como **perfil** de fábrica, com match no Grim Fandango |

O que **barateia**: a mesa já tem dono único na janela (`app/mesa.py:30`), os
blocos `mouse_emulation` (`daemon/ipc_handlers.py:2157`) e `keyboard_emulation`
(`:2025`) já existem **completos, com o motivo do bloqueio**, e a cor do
plástico já é lida pela janela.

---

## As dezesseis, em duas metades

### A migração — o que já existe muda de motor (01 a 11)

| # | sprint | camada | bancada | trava |
|---|---|---|---|---|
| 01 | [a página entra no lugar da aba](2026-08-29-MIGRA-NAVEGACAO-01-a-pagina-entra-no-lugar-da-aba.md) | Glade + janela | **sim** | o piloto |
| 02 | [o gerador dá endereço a cada valor](2026-08-29-MIGRA-NAVEGACAO-02-o-gerador-da-endereco-a-cada-valor.md) | mockup | não | — |
| 03 | [o cartão nasce da mesa real](2026-08-29-MIGRA-NAVEGACAO-03-o-cartao-nasce-da-mesa-real.md) | janela | não | — |
| 04 | [o mouse emulado, e o que o rádio não entrega](2026-08-29-MIGRA-NAVEGACAO-04-o-mouse-emulado-e-o-que-o-radio-nao-entrega.md) | janela | não | — |
| 05 | [o teclado emulado passa a morar no perfil](2026-08-29-MIGRA-NAVEGACAO-05-o-teclado-emulado-passa-a-morar-no-perfil.md) | janela | não | — |
| 06 | [as quatro frases de diagnóstico vivo](2026-08-29-MIGRA-NAVEGACAO-06-as-quatro-frases-de-diagnostico-vivo.md) | ambas | não | **palavra dela** |
| 07 | [os cinco gestos chegam à tela e acendem](2026-08-29-MIGRA-NAVEGACAO-07-os-cinco-gestos-chegam-a-tela-e-acendem.md) | ambas | não | — |
| 08 | [os cinco gestos ficam trocáveis](2026-08-29-MIGRA-NAVEGACAO-08-os-cinco-gestos-ficam-trocaveis.md) | janela | não | **palavra dela** |
| 09 | [a roda de pontes tem uma escada só](2026-08-29-MIGRA-NAVEGACAO-09-a-roda-de-pontes-tem-uma-escada-so.md) | backend | não | — |
| 10 | [o PS solo ganha quem escreva a ação](2026-08-29-MIGRA-NAVEGACAO-10-o-ps-solo-ganha-quem-escreva-a-acao.md) | backend | não | — |
| 11 | [as 21 linhas do que cada botão faz](2026-08-29-MIGRA-NAVEGACAO-11-as-vinte-e-uma-linhas-do-que-cada-botao-faz.md) | ambas | não | — |

### O que não existe em lugar nenhum (12 a 16)

| # | sprint | camada | bancada | trava |
|---|---|---|---|---|
| 12 | [as três regiões do touchpad voltam](2026-08-29-MIGRA-NAVEGACAO-12-as-tres-regioes-do-touchpad-voltam.md) | backend + udev | **sim** | decidida em 29/08 |
| 13 | [o remapeamento botão a botão nasce](2026-08-29-MIGRA-NAVEGACAO-13-o-remapeamento-botao-a-botao-nasce.md) | backend | **sim** | decidida em 29/08 |
| 14 | [o Point-and-click ganha quatro velocidades](2026-08-29-MIGRA-NAVEGACAO-14-o-estilo-point-and-click-ganha-quatro-velocidades.md) | ambas | não | **palavra dela** |
| 15 | [o Modo Steam nasce sem medição](2026-08-29-MIGRA-NAVEGACAO-15-o-modo-steam-nasce-sem-medicao.md) | ambas | **sim** | decidida em 29/08, **risco dela** |
| 16 | [a Navegação Interna e o toque sem remetente](2026-08-29-MIGRA-NAVEGACAO-16-a-navegacao-interna-e-o-toque-sem-remetente.md) | barramento | **sim** | — |

---

## A ordem, e a razão de cada posição

```
01 ─┐   (Glade, BANCADA — uma sprint por vez em toda a leva)
02 ─┴─► 03 ──► 04 ──► 05 ──► 06        (04→05→06 dividem emulacao.py/aba06.py)
        │
        ├────► 07 ──► 08               (07 lê, 08 escreve; 08 espera ela)
        │       └───► 09 ──► 10
        │
        └────► 11 ──► 12 ──► 13        (11→13 dividem botoes.py)
                       └────► 14
                07,10 ──► 15
        03,07,10 ──────► 16

de fora da onda:  ONDA-NAVEGACAO-01 ──► 04, 05, 11, 13
                  ONDA-NAVEGACAO-02 ──► 09
                  ONDA-NAVEGACAO-03 ──► 07, 08, 09
                  ONDA-NAVEGACAO-04 ──► 11, 13
                  ONDA-NAVEGACAO-05 ──► 14
                  MIGRA-CONTROLES-01 (o piloto) ──► 01
```

* **01 e 02 podem correr juntas** — a 01 é Glade e janela, a 02 é o mockup.
  Nenhuma outra depende de outra coisa antes das duas.
* **02 antes de tudo** que pinta: sem `data-valor`, `run_javascript` não alcança
  nada. É a sprint que destrava as catorze.
* **04 → 05 → 06 em série** por R5: as três dividem
  `app/telas/navegacao/emulacao.py` e/ou a bancada do mockup.  <!-- ref-externa: nasce em a onda do desenho, ainda não executada -->
* **07 antes de 08** de propósito: a leitura executa sem a palavra dela; a
  escrita não. Juntas, a pergunta 4 do contrato travaria as duas.
* **09 depois de 07** porque é a tela dos gestos que publica o degrau; e depois
  de `ONDA-NAVEGACAO-02`, que é quem põe o `KIND_DESKTOP` na escada.
* **11 → 13 em série**: as duas pop-ups dividem `botoes.py`, e a segunda depende  <!-- ref-externa: nasce em a onda do desenho, ainda não executada -->
  da lista de botões que a primeira acerta.
* **12 antes de 14** — as três regiões do touchpad são três das sete linhas do
  Point-and-click, e o `point_and_click.json` de fábrica ainda guarda o
  `KEY_E` delas.
* **16 é a mais barata em linhas e a mais cara em consequência**, e quem
  coordena pode preferir tirá-la desta onda: o campo `uniq` no `BUTTON_DOWN`
  destrava também o mudo de microfone por jogador e a máscara por controle.

**As duas bancadas desta onda**, e as duas são recurso de acesso único:
`src/hefesto_dualsense4unix/gui/main.glade` (só a **01** o abre) e
`novo-layout/_ferramentas/aba06.py` (a **02** dá a forma, a **06** entra depois).

---

## O que é dela — e nada disso se decide em silêncio

### As que travam uma sprint com nome

| a pergunta | trava | por quê |
|---|---|---|
| **Onde moram as quatro frases de diagnóstico vivo** | **06 inteira** | o mockup apagou as quatro, e o contrato manda as quatro ficarem (P3: *"Diagnóstico não some sob o ponteiro"*). Pior: o "?" do quadro diz *"se a linha de estado abaixo estiver vermelha"* e **não há linha de estado abaixo** |
| **Quais gestos ela pode reconfigurar** | **08 inteira** | o mockup abre dropdown nas cinco linhas e a dica do mesmo quadro diz que PS+R3 e PS+Options são as saídas de emergência. A tela oferece e a dica desaconselha |
| **Que campos o Point-and-click expõe** | metade da **14** | pergunta 6 do contrato, aberta desde 26/08 |

### As que já foram decididas, e não se reabrem

| decisão | quando | o que muda |
|---|---|---|
| `D-AS-TRES-REGIOES-DO-TOUCHPAD-VOLTAM` | **29/08** | a **12** existe; a decisão de 09/08 ganha nota datada |
| `D-O-REMAPEAMENTO-BOTAO-A-BOTAO-ENTRA` | **29/08** | a **13** existe, como sprint própria |
| `D-O-MODO-STEAM-ENTRA-E-VIRA-SPRINT` | **29/08** | a **15** existe, **com o risco registrado como dela**: ninguém mediu se o Modo Jogo da Steam aceita o nosso vpad |
| `D-O-DESPAUSAR-CHAMA-SE-RETOMAR-E-MORA-NA-SISTEMA` | **29/08** | a pergunta 3 do contrato da §6 **fecha**: o despausar **não** é desta aba |
| `D-A-MASCARA-GANHA-O-AUTOMATICO` (caducada) | 29/08 | não toca esta aba, mas o homônimo sim: o "Automático" do **Modo de conexão** é outra coisa e **fica** |

### As que continuam abertas e nenhuma sprint fecha sozinha

* **A mesa desta aba é a DELA — dois controles, não os quatro do desenho.** Já é
  palavra dela de hoje e vale aqui igual (sprint 03). O que falta é o cartão de
  **um controle só**: o bloco encolhe ou some?
* **O analógico e os gatilhos não movem o cursor no rádio** — medição dela de
  11/08, no `mapa-controles.csv`. A tela mostra `Analógico 6` igual nos dois
  transportes. Marcar, esmaecer, ou avisar? (sprint 04)
* **Os doze filtros mortos** desta aba (`url(&quot;#outline-filter-…&quot;)`) —
  a cura muda **1,09%** do desenho que ela aprovou e faz o contorno do touchpad
  aparecer pela primeira vez. É decisão da moldura das dez, e trava cinco abas
  (sprint 02).
* **Onde a escolha dos gestos grava** — perfil ou máquina (sprints 08 e 10). O
  gesto de *trocar de perfil* configurado dentro de um perfil é argumento forte
  para a máquina.
* **O PS ganha linha nas 21 da pop-up?** (sprint 11)
* **A Navegação Interna nasce ligada?** — pergunta 5 do contrato (sprint 16).

---

## O que acontece com a onda NAVEGAÇÃO de 27/08

As nove sprints `ONDA-NAVEGACAO-*` continuam no disco, e **cinco delas
continuam valendo inteiras**:

| a de 27/08 | o que acontece |
|---|---|
| `ONDA-NAVEGACAO-01` a ativação mora no perfil | **VALE** — backend, independe de motor. É dependência das MIGRA 04, 05, 11, 13 |
| `ONDA-NAVEGACAO-02` o quinto degrau da roda | **VALE** — é dependência da MIGRA-09 |
| `ONDA-NAVEGACAO-03` os gestos são reconfiguráveis | **VALE** — é dependência das MIGRA 07, 08, 09 |
| `ONDA-NAVEGACAO-04` o mapa do mouse sai do código | **VALE** — é dependência das MIGRA 11 e 13 |
| `ONDA-NAVEGACAO-05` o estilo Point-and-click | **VALE** — é dependência da MIGRA-14 |
| `ONDA-NAVEGACAO-06` a aba renasce em duas colunas | **SUBSTITUÍDA** pela MIGRA-01 e 03 |
| `ONDA-NAVEGACAO-07` as três tabelas viram dropdown | **SUBSTITUÍDA** pela MIGRA-02 e 11 |
| `ONDA-NAVEGACAO-08` a área que ensina acende | **SUBSTITUÍDA** pela MIGRA-07 |
| `ONDA-NAVEGACAO-09` o que a tela promete | **SUBSTITUÍDA** pela MIGRA-06 e 09 |

**As quatro substituídas se APAGAM** — regra dela, 27/08: *sprint velha se
apaga, o git guarda*, com o manifesto dizendo qual sprint nova tomou o lugar.
**Esta onda não as apagou**: quem escreve sprint não commita, e apagar sprint de
outra onda é gesto de quem rege a leva. A tabela acima é o manifesto pronto.

**O `depois_de` das quatro está declarado na MIGRA-01** para que
`check_colisao_de_sprints.py` não acuse a disputa do Glade enquanto elas
existirem.

---

## Os riscos desta onda, todos medidos

1. **O MOCKUP APAGOU QUATRO DIAGNÓSTICOS QUE O PRODUTO JÁ PINTA.** É a forma de
   defeito mais cara desta casa **ao contrário** — cura ligada e desligada pelo
   redesenho. As quatro leem do daemon hoje, e a quinta é o portão **HARM-05**
   (`mouse_actions.py:285`), que impede o clique que derrubava o vpad e os
   jogadores do co-op **sem aviso no meio do jogo**. Migrar sem elas é regressão
   medida. → sprint 06.
2. **APAGAR WIDGET DO GLADE NÃO DÁ ERRO.** `_get` é
   `builder.get_object(id)` e devolve `None`; todo chamador guarda com
   `if is not None`. `footer_actions._freeze_ui` chega a dizer na docstring:
   *"Widgets ausentes no builder são ignorados silenciosamente."* Quinze
   caminhos viram no-op mudo. → sprint 01, régua 2.
3. **O ID DA PÁGINA É O QUE SEGURA QUATRO MÁQUINAS.** `tab_navegacao_dsx`
   participa de `_REFRESH_POR_ABA` (`app.py:1141`), `_ALVO_POR_ABA` (`:1236`),
   `_PAGINAS_COM_TETO_ELASTICO` (`:1366`) e do `id_da_pagina`. E medido em
   21/08: sem id, o GtkBuilder **inventa um pela posição** — a página muda de
   identidade em silêncio no dia em que alguém inserir um objeto antes dela.
4. **O INSTRUMENTO FICA CEGO, E FALHA MACIO.**
   `retratar_abas.py:1965` monta esta aba por `builder.get_object` e devolve
   *"aba Navegação não montada"* dentro de dois `except Exception`. **E ninguém
   mediu se um `WebKit2.WebView` pinta dentro de um `Gtk.OffscreenWindow`** — o
   script é offscreen por construção. Sem isso, a PROVA-DE-TELA-01 desta aba
   não existe.
5. **ESTA ABA TEM 60 DOS 117 `<select>` DAS DEZ** — 51% da dívida de estilo do
   WebKit. A cura `select{appearance:none}` existe e mora **no `ver.py`**, não  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->
   na página. E ela nunca foi exercitada nesta densidade: as duas pop-ups têm 21
   selects cada, num corpo com rolagem interna e teto de altura. **A lista aberta
   de um `<select>` é popup do SISTEMA e não respeita o teto da caixa.**
6. **AS DUAS ESCADAS DE PONTE DIVERGEM.** `CICLO_DE_PONTES` tem **3** degraus
   (`hotkey.py:104`), a `ESCADA` tem **4** (`ponte_escada.py:294`), e o contrato
   promete **5** na tela. E a docstring do próprio callback diz que o gesto
   **NÃO** liga Steam Input (`:485`) e **NÃO** entra nem sai do Modo Nativo
   (`:490`). Duas verdades vivas é o defeito que a regra do fato-errado existe
   para matar — a tela seria a terceira. → sprint 09.
7. **O CONTRATO CARREGA UM FATO ERRADO SOBRE O PS SEGURADO.** A §6 diz
   *"segurar mais de 0,7 s é outro gesto (religar o controle)"*. Medido: os
   700 ms são o **teto do toque curto** (`hotkey_daemon.py:91`) e acima dele
   **nada dispara** — o número existe porque segurar o PS por 5 s para religar
   um controle no rádio **abria a Steam duas vezes em 45 s** na sessão dela.
   Propagar isso para a tela seria o produto prometendo um gesto que não tem.
   → sprint 07, régua 5.
8. **O DESENHO PROMETE 21 BOTÕES E O PRODUTO CONHECE 17 — E NÃO SÃO OS MESMOS.**
   A interseção é **16**. O mockup lista dois **eixos** e as três regiões do
   touchpad e **não** lista o PS; o `CANONICAL_BUTTONS` lista o PS e não lista os
   eixos. Quem escrever a ponte sem notar pinta cinco linhas com o valor de
   outra. → sprint 11, régua 2.
9. **A ABA MOSTRA COMO ATIVO O QUE O RÁDIO NÃO ENTREGA.** As duas linhas do
   mapa (`entrada.emulacao_mouse.analogico` e `.gatilhos`) têm `cabo_aciona` e
   `radio_aciona` **vazios**: o mapa registrou a assimetria e nunca a fechou.
   `check_paridade_transporte.py` reprova quem afirmar sem teste. → sprint 04.
10. **DOZE REFERÊNCIAS DE FILTRO MORTAS**, nos quatro desenhos da mesa —
    `monta.py:437` prefixa os ids e não reescreve o `url()` com aspas escapadas.
    O Chrome ignora e desenha; o WebKit obedece e **não desenha**. O contorno do
    touchpad nunca apareceu, em motor nenhum. → sprint 02.
11. **`novo-layout/` É `.gitignore:108`** — não viaja em worktree nem no pacote,
    e o `install.sh` não o copia. **A rota inteira depende de um arquivo que o
    repositório não tem.** Quem despachar agente para esta onda copia o mockup e
    o `CLAUDE.md` à mão. Já custou uma leva de oito agentes em 25/08.
12. **O ENXERTO SUBSTITUTIVO NUNCA FOI MEDIDO.** O provado em 29/08 foi
    **aditivo** — o webview como 12ª página, 376 objetos em 56 ms, 62 → 285 MiB
    PSS. **Trocar** uma página é outra coisa, e é onde as 60.862 linhas que hoje
    chegam aos widgets por `builder.get_object()` reaparecem. Se o piloto medir
    caro, o tamanho desta onda muda antes de ela começar.
13. **A SUÍTE CRIA NÓS uinput DE VERDADE** — 1289 num dia derrubaram a sessão
    gráfica dela. Esta aba mexe no mouse e no teclado emulados, que são
    exatamente os caminhos que criam esses nós. A suíte roda no **fim**, em
    **oito lotes**, com a máquina livre, e é de quem coordena.
14. **A RÉGUA QUE DIGITA EM VEZ DE LER.** Em 26/08, **onze** réguas reprovaram a
    melhora em vez do defeito, todas pela mesma forma. Em 29/08 foram **seis
    instrumentos falsos em quinze horas**. Toda régua desta onda que compare
    texto **importa a constante; não a copia** — e os fixtures usam valores que
    não são default de nada (o `11` da sprint 04, o `KEY_C` da 11).

---

## Coordenação com as outras ondas

| o que | quem entrega | quem recebe |
|---|---|---|
| o enxerto substitutivo medido | **o piloto** (aba Controles) | MIGRA-NAVEGACAO-01 |
| onde o HTML passa a morar no pacote | a moldura das dez | 01 (declara, não decide) |
| a decisão dos 12 filtros mortos | a moldura das dez | 02, e mais quatro abas |
| `resolver_teclado_emulado` ligado ao carregador | **ONDA-NAVEGACAO-01** | 05 fecha a lápide |
| `KIND_DESKTOP` na `ESCADA` | **ONDA-NAVEGACAO-02** | 09 |
| `core/gestos_do_controle.py` (o catálogo) | **ONDA-NAVEGACAO-03** | 07, 08 |  <!-- ref-externa: nasce em ONDA-NAVEGACAO-03, ainda não executada -->
| `core/disputa_de_botao.py` | **ONDA-NAVEGACAO-04** | 11, 13 |  <!-- ref-externa: nasce em ONDA-NAVEGACAO-04, ainda não executada -->
| `core/estilo_point_and_click.py` | **ONDA-NAVEGACAO-05** | 14 |  <!-- ref-externa: nasce em ONDA-NAVEGACAO-05, ainda não executada -->
| o `uniq` no `BUTTON_DOWN` | **16 entrega** | o mic por jogador e a máscara por controle |
| o botão **Retomar** | **onda Sistema** | esta aba **não** o recebe (`D-O-DESPAUSAR-…`) |

### As colisões que ficam

`check_colisao_de_sprints.py` acusa disputa desta onda com as outras nove ondas
MIGRA (o `main.glade` e o `app/app.py`), com as ondas de 27/08 (o
`ipc_handlers.py`, o `subsystems/hotkey.py`, o `coop.py`) e com sprints de levas
anteriores. **Nenhuma se resolve dentro desta onda** — as dezesseis estão
serializadas entre si, e o resto é decisão de quem rege a leva. O `depois_de` de
cada sprint traz a fila que quem coordena tem de conferir **no dia do despacho**:
endereço de código envelhece calado, e três citações da onda de 27/08 já
apontavam para linhas que morreram.

---

## Antes de fechar a onda

```bash
scripts/gui-captura/retratar_abas.py   # a foto de hoje é o ANTES
git add -A                             # os portões são cegos a arquivo novo
bash scripts/portoes.sh                # a lista tem um dono só, e é este script
python3 scripts/check_colisao_de_sprints.py
```

E a suíte em **oito lotes**, no fim, com a máquina livre — nunca num processo
só, que morre no meio sem traceback e sem sumário.

**A palavra final é dela, com a foto na mesa** (`PROVA-DE-TELA-01`). Aprovar o
mockup não é aprovar a tela — e nesta aba isso pesa mais que nas outras, porque
o mockup **apagou quatro coisas que o produto já fazia**.
