---
sprint: ONDA-JOGAR-05
estado: absorvida
posse:
  J5:
    - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
    - src/hefesto_dualsense4unix/daemon/ipc_server.py
cria:
  - tests/unit/test_a_escolha_dela_carimba_a_ponte.py
bancada: false
depois_de:
  - ONDA-JOGAR-03
  # SÉRIE, por R5: esta sprint divide src/hefesto_dualsense4unix/daemon/ipc_handlers.py
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-VIBRACAO-04
  - ONDA-VIBRACAO-05
  - ONDA-VIBRACAO-06
  - LEVA-DE-BACKGROUND-01  # fechou no merge 27e6c4a6 (as sete frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/profiles/manager.py
  - src/hefesto_dualsense4unix/profiles/schema.py
  - src/hefesto_dualsense4unix/daemon/launch_env.py
  - src/hefesto_dualsense4unix/app/
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 01). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA JOGAR · 05 — o degrau escolhido vai para o perfil

**Onda:** JOGAR (aba 1). **É uma sprint de LIGAR: a cura está escrita e nunca
foi chamada.**

## O defeito, em uma frase

O esquema tem um valor chamado **`escolha_dela`**, o gravador que o aceita está
pronto, o comentário do código diz em letra que ele existe para *"ela já sabe e
escolhe direto"* — e **nada no produto inteiro o escreve nunca.**

## A casa sabe

| Peça | Onde | Quem chama |
|---|---|---|
| `CONFIRMADA_POR_ESCOLHA = "escolha_dela"` | `profiles/schema.py:628` | **ninguém** |
| `Profile.ponte: PonteConfirmada \| None` | `profiles/schema.py:1014` | grava e preserva |
| `ProfileManager.confirmar_ponte(..., por=...)` | `profiles/manager.py:1230` | **um só chamador**: `daemon/launch_env.py:1008`, sempre com `POR_SILENCIO` |
| `ponte_escada.POR_ESCOLHA_DELA` | `integrations/ponte_escada.py:174` | **ninguém** |

E o comentário do esquema, literal (`schema.py:606-609`):

> *"São os caminhos que ela fixou em 19/08/2026: o produto tenta em ordem e ela
> confirma UMA vez, com um gesto no controle, qual pegou (`gesto`); **ou ela já
> sabe e escolhe direto na aba de perfil (`escolha_dela`)**."*

A metade do atalho nunca foi ligada. O produto só aprende **por silêncio**.

## O que esta sprint entrega

1. **Um verbo de IPC que carimba a escolha dela** — `ponte.escolher`, ao lado
   dos vizinhos em `daemon/ipc_server.py:120-121`. Ele recebe o degrau
   (`kind`, `gamepad_flavor`, `steam_input`) e chama o
   `ProfileManager.confirmar_ponte` que já existe, com
   `por=CONFIRMADA_POR_ESCOLHA`. **Nenhuma gaveta nova** — é o contrato que
   `ponte_tentativa.py:89` escreve: *"Uma só gaveta, um só carimbo."*

2. **E o verbo que APAGA o carimbo** — o `Automático` da escada. Escolher
   Automático não é escolher um degrau: é **devolver a decisão à escada**, e
   isso é `Profile.ponte = None`. Sem esta metade, quem clicar em Automático
   depois de fixar um degrau fica preso naquele degrau para sempre, que é o
   pior estado possível.

3. **A recusa honesta quando o jogo não tem perfil.** `confirmar_ponte`
   devolve `None` sem escrever *"inventar um perfil aqui seria criar arquivo
   nas costas dela"* (`manager.py:1247`). O verbo devolve esse `None` como
   motivo nomeado, para a tela dizer o que houve — nunca um sucesso mudo.

## Como se prova — o teste que MORDE

`tests/unit/test_a_escolha_dela_carimba_a_ponte.py`

1. **Escolher o degrau 3 num perfil de disco grava
   `ponte.confirmada_por == "escolha_dela"`** — e o teste lê o **JSON gravado**,
   não o objeto em memória. É a mordida: um handler que só devolve `{"ok":
   true}` sem escrever passa em qualquer teste de retorno e reprova neste.
2. **O carimbo escrito bate campo a campo com o degrau pedido** — `kind`,
   `gamepad_flavor`, `steam_input`. Troque o degrau 4 (Steam Input) pelo 1 e o
   `steam_input: true` some do arquivo: reprova.
3. **Automático apaga.** Fixar o degrau 2, depois escolher Automático, e o
   arquivo sai **sem a chave `ponte`** — não com `"ponte": null`. O
   serializador `_sem_ponte_a_chave_nem_aparece` (`schema.py:1016`) já garante
   a forma; este caso garante que alguém a exercita.
4. **Jogo sem perfil não cria arquivo.** O teste conta os arquivos da pasta de
   perfis antes e depois: mesmo número, e o verbo devolveu o motivo. Arranque
   a guarda e o produto passa a criar perfil nas costas dela.
5. **O carimbo escrito por aqui é lido pelo mesmo leitor de sempre** —
   `pontes_confirmadas` (`daemon/ipc_handlers.py:1999`) o publica no tique
   seguinte, sem caminho especial.

## O que é dela decidir

1. **Escolher um degrau vale AGORA ou no próximo jogo?** Três dos cinco
   degraus não alcançam processo vivo (`exige_reabrir_jogo`,
   `ponte_escada.py:241`). A proposta é: **carimba agora, vale na próxima
   abertura**, e a tela diz isso — é o mesmo tempo do modo e da máscara
   (D-APLICAR-NAO-SALVA).
2. **A escolha entra pelo `Aplicar` do rodapé ou vale no clique?** Se entra
   pelo Aplicar, ela ganha a linha `● vai mudar para:` da ONDA-JOGAR-08, e
   isso é coerente com os dois outros seletores desta aba.
3. **Escolher um degrau escreve também o `mode` do perfil?** O degrau
   (`kind`+máscara) e o `Profile.mode` (`schema.py:993`) descrevem o mesmo
   fato por duas gavetas. Se ficarem livres para divergir, esta casa ganha o
   nono par. **Recomendação: o degrau escolhido escreve os dois, no mesmo
   save.**

## Fontes

- `src/hefesto_dualsense4unix/profiles/schema.py:604-628` e `:1014`.
- `src/hefesto_dualsense4unix/profiles/manager.py:1230-1260`.
- `src/hefesto_dualsense4unix/daemon/launch_env.py:1008` — o único chamador.
- Decisão dela de 19/08: *"o produto CONSTRÓI a ponte, não só preserva"*.
