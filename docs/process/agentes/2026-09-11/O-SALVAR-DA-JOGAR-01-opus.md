# O-SALVAR-DA-JOGAR-01 — o modo e a máscara, medidos no disco

Sprint: `docs/process/sprints/2026-09-11-O-SALVAR-DA-JOGAR-01-o-modo-e-a-mascara-sobrevivem.md`
Árvore: `/mnt/Apate/Desenvolvimento/hefesto-voo/O-SALVAR-DA-JOGAR-01-opus` · branch `voo/O-SALVAR-DA-JOGAR-01-opus`
Nasceu de `onda/0911b` (`77305491`), conferido.

## O que mudou

**Nenhuma linha de produto.** `src/` está em `nao_toca` e continua intocado. O
que nasceu é o laudo:

* `docs/process/2026-09-11-O-SALVAR-DA-JOGAR-o-modo-e-a-mascara-medidos-no-disco.md`

**A resposta dela, em uma frase — CORRIGIDA pela conferência de 11/09:** num
perfil de jogo, a aba Jogar **guarda o modo no clique, sempre**; guarda a
**máscara só se o daemon souber qual perfil está ativo**; e o «Salvar Perfil»
**não destrói nenhum dos dois** — o que ele faz, com o daemon calado, é
**RECUSAR**.

> **O QUE ESTA FRASE DIZIA E A MEDIÇÃO NÃO SUSTENTAVA:** ela afirmava a máscara
> sem condição e, no mesmo fôlego, invocava `active_profile: null` para
> explicar a recusa do Salvar. **Os dois não cabem juntos.** Sob `null` o
> `_mascara_no_perfil` (`daemon/ipc_handlers.py:6506`) devolve
> `{'gravado': False, 'motivo': 'sem_perfil'}` e o JSON fica byte-idêntico —
> medido na conferência, com o modo gravando na MESMA corrida. A pergunta 2
> tinha sido medida numa perna só (`Store.active_profile` fixado). **São
> QUATRO os chamadores com o defeito, não três** — o quarto é o do daemon, e é
> o único calado. A cura é `A-PERNA-QUE-FALTA-01`.

As quatro perguntas da §2 da sprint, respondidas no disco:

| # | veredito | onde grava |
| --- | --- | --- |
| 1 — o clique na fileira «Modo» | **sobrevive** | `mode.kind` + `mode.gamepad_flavor` |
| 2 — os três «O Controle é visto como» | **sobrevive COM CONDIÇÃO** — só com o daemon sabendo o ativo; com `active_profile: null` **não grava**, calado | `controllers.<uniq>.mascara`, **só ali** |
| 3 — o «Salvar Perfil» preserva? | **sobrevive** (com o ativo resolvido); **recusa** com o daemon calado | — |
| 4 — perfil não ativo | grava no **ATIVO**, nunca no selecionado | `mode` do perfil ativo |

**Os três achados que a medição trouxe de graça:**

1. **O rodapé pergunta o perfil ativo ao lugar errado, nos três gestos.**
   `rodape.py:372` (`salvar`), `:349` (`aplicar`) e `:402` (`exportar`) leem
   `ctx.state.get("active_profile")` CRU — a perna do daemon sozinha. Com o
   daemon respondendo `null`, o «Salvar Perfil» levanta *"não há perfil ativo.
   Escolha um na aba Perfis."* enquanto `perfil.nome_do_ativo({})` responde
   `'Mortal Kombat'` na mesma corrida. **E a dica do mesmo botão**
   (`pacotes/__init__.py:917`) já pergunta ao dono certo: a tela nomeia o perfil
   e o clique diz que não há.
2. **O quarto chip da fileira «Modo» não grava nada, e é declarado.**
   `gesto_da_pagina("01-jogar.html", "modo-steam")` → `None`;
   `a01_jogar.BOTOES_SEM_DONO` → `['modo-steam']`. A linha do enunciado que o
   lista entre os que gravam **cai**.
3. **Sem perfil ativo nenhum, o clique some calado.**
   `gravar_o_modo_no_ativo` devolve `""`, o gesto não levanta (por desenho), e a
   tela não tem como dizer que a escolha não foi guardada.

## Qual mordida prova

Arranquei as duas preservações do `DraftConfig.to_profile` e o mesmo
instrumento — `json.load` do arquivo, antes e depois — reprovou nas duas:

| cura arrancada | o que o arquivo perdeu |
| --- | --- |
| `source_mode` não é reemitido | `"mode": {"kind":"gamepad","gamepad_flavor":"xbox"}` → **ausente** |
| `source_controllers` não é reemitido | `"controllers": {…"mascara"…}` → **ausente** |

Com as duas no lugar, o mesmo Salvar mexe em **um campo só** no arquivo inteiro:
a cor por controle, que é o que ele existe para gravar.

E a terceira mordida é a que 05/09 mandou não confundir: no caso do daemon
calado o arquivo fica **byte-idêntico e o gesto LEVANTA** — "não grava" e "grava
e o Salvar destrói" saem diferentes do instrumento.

O instrumento também se recusa a rodar fora do lar de mentira: ele aborta se
`HOME` não for o lar ou se `profiles_dir()` cair fora dele.

## O que NÃO verifiquei

1. **O fio.** Nenhum aparelho, nenhum socket. O gesto da máscara foi medido com
   dublê de ponte até a chamada (`gamepad.mask.set {uniq, flavor}`), e o handler
   do daemon foi chamado **em processo**. O degrau *SAIU NO FIO* fica para a
   MESA-DE-QUATRO-01. **`bancada: false`** — não pedi a bancada e não esperei
   por ela: o que decide esta sprint é o byte no arquivo.
2. **Se o daemon DELA responde `active_profile: null` agora.** A recusa do §2.3
   depende disso e eu **não perguntei ao daemon dela** — o processo está vivo há
   ~13 h (PID 1562) e falar com ele é tocar a máquina que ela está usando. Medi
   as duas pernas e relatei os dois desfechos.
3. **Nenhuma célula de `docs/data/mapa-controles.csv`.** Esta sprint lê o `.json`
   do perfil; não toca canal, report id nem peça do controle. Não há célula a
   marcar, e não editei o mapa (ele está em `nao_toca`).
4. **A aba Perfis pela tela.** O §2.4 mediu ativo × não-ativo pelo disco; não
   cliquei na aba 10 para selecionar o perfil pela interface.
5. **Nenhuma janela abriu** — logo nenhum `--oculta` a declarar, e a tela dela
   não recebeu nada.

**E a trava que mais importava: o `~/.config` real dela não recebeu um byte.**

```
ANTES   2026-09-11 00:04:06.174814903  ~/.config/hefesto-dualsense4unix/profiles
DEPOIS  2026-09-11 00:04:06.174814903  ~/.config/hefesto-dualsense4unix/profiles
```

A árvore inteira (`find -maxdepth 2`) foi fotografada antes e depois: **nenhum
`.json`, nenhuma pasta e nenhum arquivo que não seja `.lock` mudou**. Os 27
`.lock` ganharam `mtime` novo às 12:58:25 — obra do daemon DELA (PID 1562, vivo
há 47.914 s, muito antes desta sessão); a medição rodou às 12:54:31 sob `env -i`
com `HOME` e os cinco `XDG_*` desviados para `…/scratchpad/lar/`.

## O que sobrou para o próximo

1. **A cura do rodapé, e ela é de três linhas.** Trocar
   `ctx.state.get("active_profile")` por `perfil.nome_do_ativo(ctx.state)` em
   `rodape.py:349`, `:372` e `:402`. **Cobrir os três**, que é a regra de 05/09:
   cobrir um deixa a próxima pessoa remedindo o mesmo defeito. Esta página é a
   prova; `src/` estava em `nao_toca` aqui.
2. **A frase que falta quando não há perfil ativo.** O clique aplica o modo e não
   o guarda, calado. Uma linha de ressalva (o canal já existe — `mascara-ressalva`
   na mesma aba) diria o que hoje ninguém diz. É desenho: passa por ela.
3. **A prova de aparelho da máscara** — o `gamepad.mask.set` atravessando o
   socket com os quatro na mesa: MESA-DE-QUATRO-01.
4. **A desconfiança que abriu a sprint FECHA.** O quadro «Modo» que saiu da aba
   Perfis em 11/09 não tirou capacidade nenhuma. Se ela quiser reabrir o
   assunto, é decisão dela — §5 da sprint.
