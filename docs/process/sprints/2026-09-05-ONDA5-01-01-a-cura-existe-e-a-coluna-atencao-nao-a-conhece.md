---
sprint: ONDA5-01-01
estado: aberta
posse:
  01-Q1:
    - src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py
    - tests/unit/test_a01_a_coluna_atencao_acende_o_mais_grave.py
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/home_actions.py
  - src/hefesto_dualsense4unix/app/actions/jogar/painel.py
  - src/hefesto_dualsense4unix/interface/frases_que_ela_baniu.py
  - src/hefesto_dualsense4unix/interface/aba01.py
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/integrations/storm_doctor.py
  - src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py
  - src/hefesto_dualsense4unix/interface/pacotes/a09_sistema.py
  - tests/unit/test_a_aba_01_jogar_fecha_as_linhas.py
depois_de: [ONDA2-01-JOGAR-01, ONDA4-S10-O-TRANSPORTE-01]
---

# 01-Q1 · DEFEITO — a cura existe, o produto sabe se ela caiu, e a coluna Atenção não a conhece

> **A palavra dela, 05/09/2026, sobre o aviso do Modo Nativo:**
>
> *"Não me lembro disso acontecer. E não deveria. Mas caso ocorra na coluna
> atenção"*

Três frases, três ordens, e a medição diz que ela tem razão nas três.

**"Não me lembro disso acontecer"** — porque o Hefesto **conserta** isso desde a
SPRINT-GAME-RUMBLE-01. **"E não deveria"** — não deve mesmo: a causa tem cura, e
o `install.sh` a instala. **"Mas caso ocorra na coluna atenção"** — e é aqui que
está o defeito: a cura pode estar AUSENTE na máquina dela, o produto **mede**
isso e já escreve a frase certa, e a aba que fica aberta enquanto o jogo roda
não diz uma palavra.

---

## 1. O QUE O PRODUTO JÁ MEDE — a frase existe, e é melhor que a profecia

A causa do controle cair no meio da partida foi medida e nomeada: é o mixer UAC
do DualSense martelando o EP0. A cura de raiz é um `quirk_flags` do
`snd_usb_audio`:

```python
_SND_QUIRK_RE = re.compile(r"054c:0ce6:.*ignore_ctl_error")
```
— `src/hefesto_dualsense4unix/integrations/storm_doctor.py:241`

`check_snd_quirk` (`storm_doctor.py:560`) devolve **três estados**, lendo dois
arquivos de verdade — `/sys/module/snd_usb_audio/parameters/quirk_flags` (a
sessão) e `/etc/modprobe.d/hefesto-dualsense-storm.conf` (o persistente),
`storm_doctor.py:569-581`:

| estado | selo | o que a frase diz |
| --- | --- | --- |
| quirk no sysfs | `[ OK ]` | *"cura do travamento do USB ATIVA (mic e fone do controle preservados)"* — `storm_doctor.py:583` |
| só no `modprobe.d` | `[INFO]` | *"a cura do travamento está agendada. O que fazer: desconecte e reconecte os controles para ela valer agora."* — `:585-592` |
| em lugar nenhum | `[WARN]` | **a frase abaixo** |

```
cura do travamento do USB AUSENTE — sem ela os controles podem desconectar no
meio do jogo. O que fazer: <gesto de atualizar> e reconecte os controles (o
botão 'Consertar problemas conhecidos' não instala esta cura).
```
— `storm_doctor.py:610-616`

**Essa frase é o mesmo fato que a profecia da janela antiga anunciava** — *"alguns
jogos derrubam o controle no meio da partida"*
(`src/hefesto_dualsense4unix/app/actions/home_actions.py:196`) — com as duas
coisas que faltavam à profecia: uma **condição medida** e um **gesto que
resolve**. Quem instala a cura é o `scripts/install_snd_quirk.sh`, e ela pega no
próximo replug do controle (`storm_doctor.py:599-602`).

**É por isso que ela não se lembra: na máquina dela a cura está de pé.** O dia em
que ela vai precisar da linha é o dia em que a cura cair — um kernel novo, um
`/etc/modprobe.d` limpo, uma instalação ainda sem replug.

---

## 2. O DEFEITO — a linha medida não chega à aba onde ela joga

A coluna Atenção da aba Jogar tem **oito fontes** hoje — o número é do próprio
`_avisos` (`a01_jogar.py:588`) —, e `check_snd_quirk` não é nenhuma delas.

| fontes | onde entram | chegam à aba 01? |
| --- | --- | --- |
| as seis de `painel.AVISOS_DA_TELA` (`app/actions/jogar/painel.py:645-652`) | `a01_jogar.py:618` | sim |
| o opt-out antigo (`home_actions.aviso_de_opt_out_antigo`) | `a01_jogar.py:620-634` | sim |
| a ponte com o jogo (`a01_jogar._aviso_da_ponte`, `:651`) | `a01_jogar.py:636-638` | sim |
| os graves do exame da mesa (`a08_conexoes._exame`, via `_do_exame`, `:551`) | `a01_jogar.py:640-647` | sim |
| **a cura do travamento** (`storm_doctor.check_snd_quirk`, `:560`) | — | **não** |

Onde ela chega hoje: **na aba Sistema**, por `storm_report`
(`src/hefesto_dualsense4unix/interface/pacotes/a09_sistema.py:354`), que empacota
`check_snd_quirk` com outros cinco (`storm_doctor.py:781-788`).

**As duas telas discordam sobre a mesma máquina.** A aba Sistema sabe que os
controles podem cair no meio do jogo; a aba Jogar — aberta enquanto o jogo roda —
mostra "nenhum aviso".

**A regra desta casa que decide:** *o Hefesto não explica a própria falha — ele a
conserta.* Ele já consertou. O que falta é ele **dizer, na tela do jogo, quando o
conserto não está de pé**.

---

## 3. O TRABALHO — a fonte que falta, no arquivo que já tem a forma

`_aviso_da_ponte` (`a01_jogar.py:651-701`) é o precedente exato: um aviso que
**não** cabe em `AVISOS_DA_TELA` porque não é função pura de `state`, mora neste
arquivo, e entra na lista pelo mesmo caminho. A cura do travamento é a mesma
classe — ela lê o disco, não o `state_full`.

### Passo 1 — medir o custo ANTES de ligar

A aba 09 fez exatamente isto e escreveu os números no docstring
(`a09_sistema.py:340-344`): *"`medir_guarda_do_steam_input()` — 2,8 ms, entra
aqui; `medir_prontuario_dos_jogos()` — 7,1 s, e por isso NÃO entra"*.

**O tique desta janela é de 100 ms** (`src/hefesto_dualsense4unix/interface/hefesto_vivo.py:114`,
`TIQUE_MS = 100`) — dez pinturas por segundo. `check_snd_quirk` abre dois
arquivos por chamada (`storm_doctor.py:569-581`). Meça o custo de uma chamada e
escreva o número no docstring, como a 09 escreveu os dois dela.

**Chame `check_snd_quirk` sozinho, nunca `storm_report`**: o pacote da 09 roda os
seis, e quatro deles não têm nada a ver com esta coluna. **Se o número não couber
em 100 ms com folga, a resposta é cachear nesta função — não deixar a linha de
fora.** O que ela lê muda no replug e no boot, nunca entre dois tiques.

- **A MORDIDA:** apague o número do docstring.
  `test_a01_a_coluna_atencao_acende_o_mais_grave::test_o_custo_da_cura_esta_medido_no_docstring`
  reprova — o docstring desta função tem de declarar quanto custa por tique, pela
  mesma razão que o da 09 declara.

### Passo 2 — a fonte nova, em `_avisos`

Em `a01_jogar._avisos` (`:585`), depois do bloco da ponte (`:636-638`) e antes do
exame da mesa (`:640-647`), **sob `try` próprio** — a política deste arquivo é
que uma fonte que levanta não derruba a coluna: ela vira selo `ERRO`
(`a01_jogar.py:631-634` e `:644-647`, o mesmo desenho de
`painel.avisos_do_estado`).

**Só o `[WARN]` e o `[INFO]` entram.** O `[ OK ]` é boa notícia e a coluna
chama-se Atenção — a mesma disciplina que já deixa os `certo` do exame de fora
(`a01_jogar.py:563-571`) e que fez `_aviso_da_ponte` recusar os dois desfechos
bons (`:668-669`). O `[INFO]` não é exceção: *"a cura está agendada, desconecte e
reconecte"* é trabalho pendente dela, não um estado bom.

**A frase não se digita aqui.** Ela vem inteira de `check_snd_quirk`, com o
`O que fazer:` que o `PREFIXO_DA_CURA` (`storm_doctor.py:41`) já põe. Reescrevê-la
neste arquivo seria a segunda cópia de uma palavra que tem dono — o defeito que
`_do_exame` já custou a esta aba, quando digitou "RÁDIO" e "AVISO" por cima de um
selo que o produto já emitia (`a01_jogar.py:554-567`).

- **A MORDIDA:** arranque o filtro do `[ OK ]`.
  `test_a_cura_ativa_nao_vira_alarme` (no mesmo arquivo) reprova: com o quirk no
  sysfs, esta fonte tem de contribuir com zero linhas. Depois arranque a chamada
  inteira, e `test_a_cura_ausente_chega_a_coluna` reprova: com `quirk_flags` vazio e sem o
  drop-in, a coluna tem de trazer a frase do `[WARN]`, palavra por palavra.

### Passo 3 — o selo, e o lugar dele na escada

O selo é **`CONTROLE`**. Os sete que existem estão em `ORDEM_DA_GRAVIDADE`
(`a01_jogar.py:147-149`) e nenhum descreve *o cabo USB do aparelho*. O `RÁDIO`
seria mentira: esta cura é do **cabo**, e o `texto_do_radio_fragil` que já ocupa
esse selo (`painel.py:648`) fala de Bluetooth.

**O selo novo entra na escada, senão ele cai no fim.** `_coluna_de_avisos`
(`a01_jogar.py:726-728`) ordena por `ORDEM_DA_GRAVIDADE` e manda **para depois de
tudo** o que não está na tupla — que é o desenho certo para os achados do exame
(eles já vêm ordenados pelo dono, `:143-146`) e o errado para um selo nomeado
aqui. **Com a coluna mostrando três de cada vez (`AVISOS_NA_COLUNA = 3`,
`:124`), um selo fora da escada é um selo que a máquina cheia esconde atrás do
`+N`.**

O critério da escada é *"o que invalida o quê"* (`:129`), e por ele `CONTROLE`
entra **entre `JOGO` e `RÁDIO`**: a queda leva o controle inteiro, e o rádio
frágil só impede o jogo de enxergá-lo.

**A palavra `CONTROLE` é texto de tela, logo é decisão dela.** Leve o selo ao olho
dela junto com a foto da coluna, e não publique antes.

- **A MORDIDA:** tire `"CONTROLE"` de `ORDEM_DA_GRAVIDADE` e deixe a fonte no
  lugar. `test_o_selo_novo_esta_na_escada` reprova com quatro avisos na mesa: a
  linha da cura tem de aparecer entre as três mostradas, e não sumir no `+N`.
  E troque o selo para `RÁDIO`: `test_o_selo_nao_e_o_do_radio` reprova — dois
  avisos com o mesmo selo, um do cabo e outro do rádio, é a coluna mandando ela
  procurar no lugar errado.

### Passo 4 — a foto, o clique e a mordida de tela

Regra da casa: quem mexeu na tela abre a tela, **sempre `--oculta`** — ela tem uma
tela só.

Fotografe a coluna com a cura de pé e com ela arrancada. No segundo estado a
coluna tem de ter uma linha a mais **e a conta ao lado tem de subir um**
(`data-campo="atencao-conta"`, `src/hefesto_dualsense4unix/interface/aba01.py:1386`):
ela conta os AVISOS, não as linhas mostradas (`a01_jogar.py:721-724`).

---

## 4. O QUE ESTA SPRINT NÃO FAZ, e a razão é a palavra dela

**Não nasce detector de queda.** Ela disse *"não me lembro disso acontecer"* —
construir um vigia para um evento que ela nunca viu é inventar trabalho, e o
produto já mede a **causa**, com cura. Se um dia alguém medir a queda em si, ela
entra como mais uma fonte de `_avisos` e **nada mais nesta aba precisa mudar**:
é essa a forma que este passo deixa pronta.

**Não nasce linha fixa embaixo de Modo.** A opção estava na pergunta e ela não a
escolheu: a linha aparece *"caso ocorra"* e some sozinha quando a cura volta. É o
que a coluna Atenção já faz por desenho — `.col-atencao .aviso-item:not(.mostra)`
é `display:none` (`aba01.py:743`).

**Não se mexe na frase da janela antiga.** Ela é da ONDA5-01-02, e este arquivo
declara `home_actions.py` no `nao_toca` por isso.

---

## 5. NADA SE PERDEU

O que existe hoje nesta aba e tem de continuar existindo depois:

1. **As oito fontes, na ordem em que estão** (`_avisos`, `a01_jogar.py:618-648`).
   A nova entra ao lado, nunca no lugar de nenhuma.
2. **A política do `except` largo:** fonte que levanta vira selo `ERRO` e a coluna
   sobrevive (`:631-634`, `:644-647`). A nova nasce com o `try` dela.
3. **A D-09 dela, inteira:** *"Até três linhas, o mais grave em cima"*, *"com `+N`
   se passar de três"* (`_coluna_de_avisos`, `:704-736`). A fonte nova **não
   aumenta o teto** — ela concorre pelas três, e o `+N` conta a sobra.
4. **Os seis lugares que a página publica** (`AVISOS_VIVOS = 6`, `:112`, lido pelo
   gerador em `aba01.py:78`) e as seis saídas sempre preenchidas, com `""` no que
   não tem aviso (`:755-756`). Essa linha é cura medida em 04/09: sem ela a frase
   do mockup ficava na tela ao lado de *"nenhum aviso"*.
5. **A conta que diz o TOTAL**, não as linhas (`:721-724`).
6. **Zero alarme sem medição.** A frase que entra é lida de `check_snd_quirk`,
   nunca digitada, e só acende com o arquivo do sistema conferido.
7. **O `[ OK ]` fora da coluna.** Boa notícia não é Atenção — a lição do `CERTO`
   fotografado sob o cabeçalho laranja em 02/09 (`:563-567`).
