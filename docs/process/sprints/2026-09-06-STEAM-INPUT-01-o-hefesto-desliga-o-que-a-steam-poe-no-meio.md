---
sprint: STEAM-INPUT-01
estado: aberta
decisoes: [D-0609-STEAM-DIVIDIDO, D-0609-PRIORIDADE-TODAS-AS-ABAS]
posse:
  07B:
    - src/hefesto_dualsense4unix/interface/pacotes/a07_lancadores.py
    - src/hefesto_dualsense4unix/interface/aba07.py
    - src/hefesto_dualsense4unix/interface/desenho_dos_lancadores.py
    - mockup/07-lancadores.html
    - tests/unit/test_a_aba_07_lancadores_fecha_as_linhas.py
depois_de: [ONDA5-07-01, ONDA4-S10-O-TRANSPORTE-01]
nao_toca:
  - src/hefesto_dualsense4unix/interface/paginas/07-lancadores.html
  - src/hefesto_dualsense4unix/app/actions/daemon_actions.py
  - src/hefesto_dualsense4unix/app/actions/emulation_actions.py
  - src/hefesto_dualsense4unix/interface/pacotes/a09_sistema.py
  - src/hefesto_dualsense4unix/interface/aba09.py
  - src/hefesto_dualsense4unix/daemon/
  - docs/data/paridade-gtk-html.csv
---

# STEAM-INPUT-01 · PARIDADE — o Hefesto desliga o que a Steam põe no meio

> **A decisão dela, 06/09/2026** (`D-0609-STEAM-DIVIDIDO`): **Steam Input e a
> allowlist ficam na aba 07 (Lançadores); "Consertar", "Restaurar de fábrica" e
> "Aplicar aos jogos" ficam na 09 (Sistema).** A parte da 09 é a
> `SISTEMA-STEAM-01`.
>
> **E a ordem de despacho, dela:** *"todas as abas, menos Lançadores"* — a 07 é
> a **última** a ser despachada na onda C. Não porque valha menos: porque tudo
> que ela toca fica mais barato depois que o resto assentar.

**Steam Input é o que a Steam põe entre o controle e o jogo.** Quando ele está
ligado, o jogo vê o gamepad da Steam e não o do Hefesto — e a pessoa vê um
controle que "não funciona" sem nada na tela explicando por quê.

---

## 1. O QUE SE MEDIU — quatro linhas `FALTA_NO_HTML`, e a razão de cada uma

| linha do CSV | o dono no motor | o que o HTML faz hoje |
| --- | --- | --- |
| **Steam Input: conferir se está ligado, e desligar** | `app/actions/emulation_actions.py:1905`, `:1909` | **NADA, e está declarado**: `modo-steam` é `SEM_DONO` na aba Jogar, com a razão medida |
| **"Este jogo não funciona" (allowlist)** | `app/actions/daemon_actions.py:1717`, `:1770` | **NADA**: `grep -rn steam_input_allowlist src/hefesto_dualsense4unix/interface/` devolve **ZERO** |
| **"Deixar tudo pronto" — Steam Input + wrapper, UM consentimento** | `daemon_actions.py:1586`, `:1596` | **NADA, em aba nenhuma**; nenhum gesto registrado o cobre |
| **Lembrete "este jogo ainda não abre pelo launcher do Hefesto"** | `app/actions/launch_wrapper_dialog.py:345`, `:106` | **NADA**: não há tique nem gatilho equivalente; para saber, ela tem de abrir a 07 e clicar em "Detectar o jogo que está aberto" |

**O que o motor já resolveu, e você REUSA em vez de reescrever:**

* **`check` lê o estado inteiro** — inclusive os appids ligados e a exceção.
* **`disable` desliga pedindo consentimento para fechar a Steam por ~20 s.** O
  consentimento é do desenho, não do acaso: fechar a Steam sem avisar é perder
  o que a pessoa estava fazendo.
* **A allowlist tem uma escada de três evidências** para achar o appid
  (`daemon_actions.py:1717`), e recarrega o `launch_env` para a marca **valer
  agora**, sem reiniciar nada.
* **"Deixar tudo pronto" encadeia os dois dentro de UMA janela de
  `with_steam_closed`** e mede os jogos com Steam Input **antes** de mexer.
  Um consentimento, não dois — é a razão de ele existir como botão próprio.

**A armadilha de quem for reescrever:** "com jogo aberto" muda o comportamento
dos dois botões no motor. Leia `emulation_actions.py:1905-1930` antes de supor
que é só chamar.

---

## 2. O TRABALHO, EM QUATRO PASSOS

### Passo 1 — conferir e desligar o Steam Input

Dois gestos na 07 que chamam o dono no motor. **Nada de IPC novo**: o
`modo-steam` da aba Jogar está `SEM_DONO` justamente porque não há IPC de
Steam Input — o caminho é o mesmo do motor, e é por isso que a linha do CSV
diz *"`UseSteamControllerConfig` só sobrevive…"*. Leia a razão inteira lá
antes de inventar um caminho novo.

**A frase do consentimento vem do motor, não da sua redação.** Fechar a Steam
por ~20 s é um custo real, e a pessoa tem de saber antes de clicar.

**A MORDIDA:** um dublê que diga "ligado" e um que diga "desligado" — a tela
tem de dizer coisas diferentes. Arranque a leitura e veja a régua reprovar o
verde sobre nada.

### Passo 2 — "Este jogo não funciona"

Marca o jogo na allowlist do Steam Input. **É reversível e não fecha nada** —
por isso o motor não pede diálogo, e a sua tela também não pede. O recibo diz o
appid e o resultado.

**A MORDIDA:** marque um jogo com dublê, prove que o appid chegou à allowlist,
e que o `launch_env` foi recarregado. Arranque a recarga e o teste tem de
reprovar — sem ela a marca não vale agora, que é a metade que importa.

### Passo 3 — "Deixar tudo pronto", com UM consentimento

Um botão, um consentimento, os dois trabalhos. **Não faça dois diálogos** — a
razão está no motor: os dois cabem numa janela de `with_steam_closed`, e pedir
duas vezes é fazer a pessoa pagar duas vezes pelo mesmo fechamento da Steam.

**A MORDIDA:** prove que o consentimento é UM e que os dois trabalhos rodaram
dentro dele.

### Passo 4 — o lembrete do jogo que não abre pelo launcher

O motor decide por **função pura** (`launch_wrapper_dialog.py:106`): janela em
foco é jogo Steam **e** emulação ativa **e** não dispensado **e** o vdf diz que
falta. **Importe a função; não reescreva a condição** — quatro condições
redigitadas é a segunda verdade que esta casa persegue.

Na interface nova ele **não é um diálogo**: é o **recado** do glossário §3 —
laranja 30 s quando é recusa, verde 6 s quando é notícia. A infraestrutura de
recado é da `ONDA5-P-01`, que fecha na onda A. **Se ela não estiver no lugar,
RELATE e não invente uma segunda.**

**E "dispensado" tem de continuar significando dispensado.** Um lembrete que
volta depois de a pessoa o ter fechado é pior que lembrete nenhum.

**A MORDIDA:** as quatro condições, uma a uma: com cada uma falsa, o lembrete
não nasce.

---

## 3. O QUE ESTA SPRINT NÃO CONSTRÓI

* **O que a `ONDA5-07-01` já cobre.** Ela fecha antes; leia o que ela entregou
  antes de escrever uma linha, e não duplique a carona do wrapper.
* **"Consertar problemas conhecidos", "Restaurar de fábrica", "Aplicar aos
  jogos da Steam".** Decisão dela: são da **aba 09**, na `SISTEMA-STEAM-01`.
  Os arquivos da 09 estão no `nao_toca`.
* **O CSV da paridade.** É da `PARIDADE-REMEDIR-01`. Você RELATA.

## 4. NADA SE PERDEU

* **A linha intocável e o "aplicada em vez de explicada"** da `ONDA5-07-01`
  continuam inteiras.
* **"Detectar o jogo que está aberto"** continua onde está — o lembrete do
  Passo 4 **acrescenta** um caminho, não substitui o botão.
* **A palavra da tela vem do glossário.** "Steam Input" está lá; `vdf`,
  `env`, `appid` e "linha de comando" são **proibidos em texto de tela**.
  E **"mesa" não entra**.

## A PROVA DE TELA — obrigatória

1. **A FOTO** antes e depois, `--oculta`.
2. **O CLIQUE**: os quatro caminhos acionados, com a resposta na tela.
3. **A MORDIDA** colada, uma por passo.
4. **NO TEMPO**: a régua de mutações da `A-TELA-SAMBA-01` — com a mesa parada,
   o que você acrescentar não muta o DOM tique a tique.
