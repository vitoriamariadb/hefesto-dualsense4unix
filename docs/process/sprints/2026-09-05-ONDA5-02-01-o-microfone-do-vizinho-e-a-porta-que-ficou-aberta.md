---
sprint: ONDA5-02-01
estado: aberta
posse:
  02-Q8:
    - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
    - src/hefesto_dualsense4unix/integrations/audio_control.py
    - src/hefesto_dualsense4unix/interface/pacotes/a02_controles.py
cria:
  - tests/unit/test_o_volume_do_mic_nao_cai_no_vizinho.py
nao_toca:
  - src/hefesto_dualsense4unix/interface/aba02.py
  - src/hefesto_dualsense4unix/interface/paginas/02-controles.html
  - mockup/02-controles.html
  - src/hefesto_dualsense4unix/daemon/lifecycle.py
  - src/hefesto_dualsense4unix/integrations/fontes_de_captura.py
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
depois_de: [A-TRAVA-DO-LED-NAO-SOLTA-01, LEVA-DE-BACKGROUND-01, MIGRA-CONTROLES-09, MIGRA-ILUMINACAO-11, MIGRA-JOGAR-10, MIGRA-NAVEGACAO-07, MIGRA-SISTEMA-09, MIGRA-VIBRACAO-04, MIGRA-VIBRACAO-05, MIGRA-VIBRACAO-06, ONDA-CONTROLES-07, ONDA-CONTROLES-08, ONDA-JOGAR-05, ONDA-LANCADORES-06, ONDA-PERFIS-03, ONDA-VIBRACAO-04, ONDA-VIBRACAO-05, ONDA-VIBRACAO-06, ONDA1-D1-O-SOM-01, ONDA2-02-CONTROLES-01, ONDA4-S10-O-TRANSPORTE-01, TROCA-DE-PLAYER-01]
---

# DEFEITO · ONDA5-02-01 — o microfone do vizinho, e a regra que já estava escrita um arquivo ao lado

## 1. A DECISÃO DELA, VERBATIM

Perguntei se a tela devia confessar quando o gesto do microfone de um cartão cai
na rota da mesa, e ofereci três opções: *não confessa* · *aviso de trinta
segundos* · *aviso fixo no cartão*. Ela não marcou nenhuma. Escreveu:

> *"Esse erro não deveria acontecer. Deveria ser só pro controle em questao. <!-- noqa-acento: citação literal dela -->
> Parece um bug"* <!-- noqa-acento: citação literal dela -->
> — 02-Q8, 05/09/2026

**As três opções guardavam o defeito e discutiam a redação do bilhete.** É a
segunda vez em dois dias que ela recusa a lista inteira, e a regra que a
primeira deixou vale aqui sem uma vírgula de ajuste: quando ela recusa TODAS as
opções, a hipótese certa não é que falta uma quarta — é que a pergunta está
errada.

**O que esta sprint escreve na parede: o Hefesto não explica a própria falha —
ele a conserta.**

---

## 2. O QUE SE MEDIU — a causa tem cinco linhas, e a cura já existe no produto

### 2.1 A porta, por extenso

```python
        fonte = fonte_de_captura_do_uniq(uniq) if uniq else None
        por_uniq = fonte is not None
        if fonte is None:
            fonte = fonte_de_captura_do_controle()
```
— `src/hefesto_dualsense4unix/daemon/ipc_handlers.py:5982-5985`

`fonte_de_captura_do_controle()` devolve a **primeira** source de DualSense da
lista (`src/hefesto_dualsense4unix/integrations/audio_control.py:216`). Com
dois controles na mesa, a primeira é a de quem calhou de aparecer primeiro no
`pactl` — e é isso, e nada mais, que faz o deslizante do card dela mexer no
microfone de outra pessoa.

O `por_uniq` que sai na resposta (`ipc_handlers.py:6004`) é o campo que a tela
lê para confessar. **Ele descreve a queda; não a impede.**

### 2.2 A regra que ela pede JÁ ESTÁ ESCRITA — um arquivo ao lado

O aplicador de perfil faz a mesma pergunta e responde o contrário:

```python
                # NÃO HÁ QUEDA PARA A ROTA GLOBAL quando o `uniq` não resolve, e
                # isso é a metade que importa: cair para a primeira fonte da
                # lista seria escrever no controle errado — exatamente o
                # estrago que esta linha existe para impedir. Sem fonte daquele
                # controle, ninguém escreve e ninguém diz "aplicado".
                fonte = (fonte_de_captura_do_uniq(uniq) if uniq
                         else fonte_de_captura_do_controle())
```
— `src/hefesto_dualsense4unix/daemon/lifecycle.py:3400-3406`

**Duas réguas sobre a mesma pergunta, dois vereditos** — e a porta que ficou
aberta é justamente a que ela CLICA. A palavra dela não inaugura nada: ela
manda o handler obedecer à regra que esta casa já escolheu quando ninguém
estava clicando.

### 2.3 O 🎙 não tem este buraco, e a diferença está escrita

`mic.canal.set` — o método que o botão do microfone chama desde a ONDA1-D1 —
**recusa quando não há endereço** em vez de pegar o primeiro:

```python
        alvo = uniq or self._uniq_do_primario()
        if not alvo:
            return {
                "status": "sem_controle",
                …
                    "não há controle na mesa para ligar o microfone — o ato "
                    "precisa de um endereço, e cair no primeiro da lista é o "
                    "que faria a mesa cheia eleger sempre o mesmo"
```
— `ipc_handlers.py:5799-5810`

**Logo o defeito dela é o do VOLUME, não o do mudo.** A pergunta 02-Q8 falava do
clique no microfone; a medição diz que o botão está são e o deslizante não. Fica
escrito porque a diferença muda o passo 1: não há nada a consertar no `mudo`.

### 2.4 Por que a fonte não resolve — a regra 4 desligada

`fonte_de_captura_do_uniq` chama o dono da pergunta com a mesa VAZIA:

```python
    return escolher_fonte(fontes, uniq, [], usb)
```
— `audio_control.py:368`, com a razão declarada em `:325-333`:
*"Aqui só se conhece UM `uniq`, e o um-para-um precisa saber que ele é o único
candidato da mesa para valer."*

A regra 4 do dono (`integrations/fontes_de_captura.py:195-199`) resolve
exatamente o caso barato — **uma source, um controle**
(`fontes_de_captura.py:223`) — e é o caso em que o `if fonte is None` do handler
estava certo por acaso.

**E `audio_control.py:368` é o ÚNICO chamador cego de `escolher_fonte`.** Os
outros cinco entregam a mesa:

| chamador | o que passa |
| --- | --- |
| `integrations/quem_ouve_o_microfone.py:480` | `uniqs` |
| `integrations/eleicao_de_microfone.py:397` | `uniqs_com_audio` |
| `integrations/eleicao_de_microfone.py:596` | `conectados` |
| `daemon/subsystems/luz_do_mic.py:447` | `mesa` |
| `app/mic_monitor.py:387` | `list(controles)` |
| **`integrations/audio_control.py:368`** | **`[]`** |

O medidor de cada card, a luz do microfone e a eleição enxergam a mesa. Só o
caminho do deslizante não — e é o único que ESCREVE.

### 2.5 As duas portas dormentes, medidas

```python
    alvo = fonte if fonte is not None else fonte_de_captura_do_controle()
```
— a mesma linha nas duas funções: `audio_control.py:371-386`
(`definir_volume_da_captura`) e `audio_control.py:413-419`
(`volume_da_captura`)

**Nenhum chamador em `src/` usa esse padrão** — os quatro passam `fonte=`
(`ipc_handlers.py:5988` e `:5999`, `lifecycle.py:3411`,
`daemon/subsystems/hotkey.py:936`, `interface/controles_vivos.py:1493`). São
portas fechadas com a chave na fechadura: quem chamar sem `fonte` amanhã cai no
mesmo lugar, sem uma linha de aviso.

### 2.6 A frase da recusa não contém o caso que vai acontecer

```python
        if corpo is None or corpo.get("status") != "ok":
            raise RuntimeError(
                "o daemon não confirmou o volume do microfone — ou o Hefesto "
                "está parado, ou este controle saiu da mesa")
```
— `src/hefesto_dualsense4unix/interface/pacotes/a02_controles.py:3094-3098`

`sem_fonte` já é resposta possível hoje (`ipc_handlers.py:5986-5987`) e vira
frequente com a cura: o controle no rádio SEM a ponte de áudio não tem fonte
nenhuma. Nesse caso o Hefesto não está parado e o controle não saiu da mesa — a
frase manda procurar o defeito nos dois lugares errados. **É o mesmo defeito que
este arquivo já nomeou uma vez**, três blocos acima, quando a frase do 🎙 listava
duas causas e nenhuma era a verdadeira (`a02_controles.py:2734-2738`).

---

## 3. O TRABALHO, EM CINCO PASSOS

### Passo 1 — com endereço, não há rota global

`ipc_handlers.py:5982-5985`. Quando `uniq` veio e a fonte não resolveu, a
resposta é `sem_fonte` com o motivo — nunca a primeira da lista. Sem `uniq`
(quem tem um controle só e não manda endereço) a rota global continua valendo,
que é o que ela sempre foi: a conveniência de uma mesa de um.

O `por_uniq` **fica** na resposta, e passa a ser sempre `True` quando há
`status: "ok"` com endereço. Ele não é o remendo — é a leitura que prova que a
cura está de pé, e é o que um daemon velho ainda usa para confessar (§5).

**A MORDIDA:** devolva as duas linhas do `if fonte is None` e
`test_o_deslizante_do_p2_nao_cai_na_placa_do_p1` (novo, §4) reprova nomeando a
source do P1 na chamada a `definir_volume_da_captura`.

### Passo 2 — a mesa entra na conta, e a máscara não custa feature

`audio_control.py:368` deixa de mandar `[]`. `fonte_de_captura_do_uniq` ganha um
parâmetro opcional com os `uniq` da mesa; com ele, a regra 4 do
`escolher_fonte` volta a valer e o `CasamentoUSB` deixa de ser montado só para
um controle (`audio_control.py:360-368` monta `usb_pai_por_uniq([uniq])`; com a
mesa, mapeia todos, e é o que dá ao `veta` o que vetar).

Quem sabe a mesa é o daemon, e o dono da pergunta é um só:
`daemon/subsystems/recado_do_microfone.mesa_de_agora(daemon)`
(`recado_do_microfone.py:177`) — **a única leitura de "tem card na tela"**, e
pública exatamente por isto. `None` (backend que não sabe listar) é "não
perguntei", e mantém o comportamento de hoje; lista vazia não inventa dono.

**Sem este passo o passo 1 é uma regressão**: hoje a mesa de UM controle com
`pactl list sources` longo ilegível resolve pela rota global, e passaria a
responder `sem_fonte`. **Com ele, resolve pelo um-para-um — sem queda nenhuma.**
É a regra dela de 10-Q6 aplicada aqui: o Hefesto não descreve a limitação, ele
constrói o mecanismo que a remove.

**A MORDIDA:** devolva o `[]` em `audio_control.py:368` e
`test_um_controle_e_uma_source_resolvem_sem_rota_global` reprova com `None` onde
a mesa de um tem resposta certa.

### Passo 3 — as duas portas dormentes fecham

`audio_control.py:386` e `audio_control.py:419`: `fonte` deixa de ter padrão.
Quem chama declara, como o `muted` do `mic.set` já obriga a declarar
(`ipc_handlers.py:5710-5714`). Os cinco chamadores medidos na §2.5 já passam —
é mudança de assinatura sem mudança de comportamento.

**A MORDIDA:** devolva o `= None` e
`test_ninguem_escreve_volume_sem_dizer_em_qual_fonte` reprova com `TypeError`
nomeando a função.

### Passo 4 — a frase de recusa aprende o caso que acontece

`a02_controles.py:3094-3098`. `sem_fonte` ganha frase própria, e ela diz a
verdade medida: não há fonte de captura para ESTE controle — no rádio, é a ponte
de microfone que não está de pé (`mic bt`); no cabo, é a placa que o sistema não
publicou. **Nenhuma frase nova nasce sobre o que o daemon não disse**: os outros
`status` continuam com a frase de hoje.

E ela vai pelo canal da RECUSA, não do sucesso: nada chegou ao aparelho.

**A MORDIDA:** devolva o ramo único e
`test_sem_fonte_nao_diz_que_o_hefesto_esta_parado` reprova comparando a frase
depositada no cartão com as duas causas falsas.

### Passo 5 — a linha do L3 para de pedir a palavra dela (02-Q10)

`a02_controles.py:772-776` ainda diz:

> *"O QUE FALTA AGORA NÃO É O ALVO, É A PALAVRA DELA: trocar `[L3]` por uma
> mudança de cor é mudar o que a tela DIZ."*

**A palavra veio, e é para não mexer:** 02-Q10, *"Continua com colchetes"*. O
`[L3]`/`[R3]` já está de pé e publicado (`a02_controles.py:776` e `:1956-1963`,
`interface/paginas/02-controles.html:1965` e `:1972`). **Zero linha de código
muda** — o que muda é o comentário, que passa a registrar a decisão datada em
vez de uma pergunta encerrada. Uma pergunta viva num arquivo é como a próxima
pessoa refaz um trabalho que ninguém pediu.

**A MORDIDA:** não há régua para prosa, e dizer que há seria fabricar mais um
instrumento falso — esta casa já derrubou oito. **A conferência é humana**, e o
critério é único: `grep -n "PALAVRA DELA" src/hefesto_dualsense4unix/interface/pacotes/a02_controles.py`
não devolve nada.

---

## 4. A RÉGUA NOVA, e ela mede o APARELHO, não o texto

`tests/unit/test_o_volume_do_mic_nao_cai_no_vizinho.py`, no molde do que já
existe: `tests/unit/test_mic_da_mesa_cheia_01.py` monta a mesa de dois e a mesa
de cabo-e-rádio com sondas de `pactl` e de sysfs, e mede a FUNÇÃO
(`tests/unit/test_mic_da_mesa_cheia_01.py:170-186` e
`tests/unit/test_mic_da_mesa_cheia_01.py:216-226`). O que falta lá é o degrau
de cima: **o handler**.

Os quatro casos:

| cena | hoje | depois |
| --- | --- | --- |
| dois no cabo, `uniq` do P2 | resolve (curado em 20/08) | igual |
| dois no cabo, `uniq` do P2, sysfs ilegível | **placa do P1** | `sem_fonte` |
| um no rádio sem ponte, um no cabo | **placa do cabo** | `sem_fonte` |
| um controle só, uma source, `pactl` longo ilegível | rota global (certa por acaso) | um-para-um (certa por regra) |

**A régua chama `_handle_mic_volume_set` e olha o que chegou a
`definir_volume_da_captura`** — a source, por nome. Medir `fonte_de_captura_do_uniq`
sozinha é medir a função que já estava certa: foi o handler que caiu.

**E o dublê é ESTRITO.** Duas vezes em 04/09 um gesto passou verde sem gravar um
byte porque o dublê era mais frouxo que a ponte real; `PonteEstrita`
(`tests/unit/test_a_aba_02_controles_fecha_as_linhas.py:551-562`) é o molde.

---

## 5. NADA SE PERDEU

1. **A confissão da tela FICA** — `a02_controles.py:3109`, com
   `app/ipc_bridge.py:1098` (`alvo_honrado`) e `app/widgets/controller_card.py:2191`
   (`frase_do_alvo_do_mic`). Ela deixa de poder
   disparar contra ESTE daemon e continua sendo a última trava contra um daemon
   INSTALADO mais velho que esta janela — o caso que aconteceu de verdade em
   04/09 com o `mic.canal.set`, medido na máquina dela. Régua que a cobre:
   `test_o_volume_do_microfone_confessa_quando_cai_na_rota_global`
   (`test_a_aba_02_controles_fecha_as_linhas.py:517-535`), e ela continua verde.
2. **A rota global continua existindo** para quem não manda `uniq`. Ela nunca
   foi o defeito; o defeito é ela ser o CONSOLO de um endereço que não resolveu.
3. **As três regras de identidade de `escolher_fonte`** (MAC inteiro no nome,
   rabo do MAC da ponte BT, mesmo dispositivo USB) ficam intactas — o passo 2 só
   destrava a quarta.
4. **`sem_fonte` continua não sendo falha**, e é o que deixa o deslizante
   insensível com a dica explicando (`ipc_handlers.py:5939-5944`).
5. **A trava manual de áudio** (`_marcar_audio_manual`,
   `ipc_handlers.py:5989-5993`) continua armando no `ok`: um gesto dela não pode
   ser pisado pelo perfil reaplicado.
6. **O `[L3]`/`[R3]`** continua na tela, palavra por palavra.

---

## 6. O QUE ESTA SPRINT RELATA E NÃO FAZ

* **`daemon/lifecycle.py:3405` também pode receber a mesa.** Ele já não cai na
  rota global — a cura dele é de 03/09 e está inteira. O que ganharia com o
  passo 2 é a regra 4 valendo na aplicação de perfil da mesa de um. **Não é
  desta frente** (o arquivo é `nao_toca`); fica declarado para quem o abrir.
* **A janela GTK chama o mesmo `mic.volume.set`**
  (`app/widgets/controller_card.py:4443`) e herda a cura sem uma linha: ela lê
  `por_uniq` pela mesma ponte. Nada a fazer lá, e é o oposto de sorte — é o que
  "a cura cobre todos os chamadores" quer dizer quando a cura mora no daemon.

---

## 7. A PROVA

`bash scripts/portoes.sh` (os 43, sem argumento) com o `git add -A` antes — os
portões são cegos a arquivo novo. Os lotes que tocam este escopo:
`test_mic_da_mesa_cheia_01.py`, `test_a_aba_02_controles_fecha_as_linhas.py`,
`test_a02_som_e_sensor_falam_quando_recusam.py`,
`test_som_02_o_volume_dela_chega_ao_perfil.py` e a régua nova.

**Nenhuma janela nasce na tela dela.** Esta frente não abre tela: o que ela
muda é daemon e pacote. Se precisar olhar o cartão, é `--oculta`.
