# O SALVAR DA JOGAR — o modo e a máscara, medidos no disco

**11/09/2026.** Ela mandou conferir: *"manda um agente ver se salvar na aba*  <!-- noqa-acento: citação literal dela -->
*jogar o perfil do jogo vai salvar o modo e a mascara."*  <!-- noqa-acento: citação literal dela -->

Nada foi lido no código e acreditado. Cada linha abaixo é um `json.load` do
arquivo do perfil **antes** e **depois** do gesto, com os gestos de verdade
chamados como o piloto os chama. O lar foi de mentira — `HOME` e os quatro
`XDG_*` desviados —, e o `~/.config` real dela **não recebeu um byte** (§6).

---

## §0 — A RESPOSTA EM UMA FRASE

**Num perfil de jogo, a aba Jogar guarda o MODO no clique, sempre; guarda a
MÁSCARA no clique SÓ SE o daemon souber dizer qual perfil está ativo; e o
«Salvar Perfil» não destrói nenhum dos dois — o que ele faz, com o daemon
calado, é RECUSAR.** Os três caem no mesmo lugar: **perguntam o perfil ativo a
uma perna só** — a do daemon — quando a casa inteira já pergunta às duas.

**A CONDIÇÃO DA MÁSCARA NÃO É DETALHE, e ela foi medida na segunda perna:** com
o daemon **de pé e respondendo**, mas com `active_profile: null`, e os
marcadores no disco valendo, a mesma corrida dá

```
MODO    → grava:  "mode": {"kind":"gamepad","gamepad_flavor":"xbox"}
MÁSCARA → NÃO grava:  {'perfil': None, 'gravado': False, 'motivo': 'sem_perfil'}
          o .json fica byte-idêntico · "controllers": null
```

**E ela não é avisada.** O daemon devolve o motivo; a ponte o joga fora
(`pacotes/ponte.py:180`, `ok, _ = _safe_call(...)`). O chip acende, a resposta
é `status: ok`, e o perfil não recebeu nada. **É a forma exata que custou 04/09
e 05/09** — a máscara que nunca gravou um byte, e o Salvar que destruía depois
de a aba ter gravado certo.

E há dois buracos ao lado: o quarto chip da fileira (**Steam Input**) não tem
quem o atenda e não grava nada; e **sem perfil ativo nenhum o clique do modo
também não grava em lugar nenhum, calado**.

---

## §1 — A TABELA DAS QUATRO PERGUNTAS

| # | a pergunta | veredito | onde para, no JSON | arquivo lido |
| --- | --- | --- | --- | --- |
| 1 | o clique na fileira «Modo» grava? | **sobrevive** | `mode.kind` + `mode.gamepad_flavor` | `…/profiles/mortal_kombat.json` |
| 2 | o clique nos três «O Controle é visto como» grava a máscara? | **sobrevive COM CONDIÇÃO** — só com o daemon dizendo quem está ativo; com ele respondendo `active_profile: null`, **não grava** (`motivo: sem_perfil`) e a tela não avisa | `controllers.<uniq>.mascara` — **só ali**, nunca em `mode.gamepad_flavor` | `…/profiles/mortal_kombat.json` |
| 3 | o «Salvar Perfil» preserva o que o clique gravou? | **sobrevive** — com o daemon dizendo quem está ativo. Com ele calado, **o Salvar nem acontece**: recusa | — | `…/profiles/mortal_kombat.json` |
| 4 | e se o perfil do jogo não estiver ativo? | **grava no ATIVO, nunca no selecionado** | `mode` do perfil ativo | `…/profiles/personalizado.json` |

O caminho completo do lar de mentira:
`…/scratchpad/lar/.config/hefesto-dualsense4unix/profiles/`.

---

## §2 — O JSON, ANTES E DEPOIS, GESTO A GESTO

### §2.1 — A fileira «Modo» (pergunta 1): **grava**

O perfil de partida não tem seção `mode` — é um perfil de jogo recém-criado.

| gesto clicado | `mode` antes | `mode` depois |
| --- | --- | --- |
| `modo-xbox` («Xbox») | `null` | `{"kind":"gamepad","gamepad_flavor":"xbox"}` |
| `modo-dualsense` («Sony DualSense») | `{"kind":"gamepad","gamepad_flavor":"xbox"}` | `{"kind":"gamepad","gamepad_flavor":"dualsense"}` |
| `modo-navegacao` («Navegação») | `{"kind":"gamepad","gamepad_flavor":"dualsense"}` | `{"kind":"desktop","gamepad_flavor":null}` |
| `hefesto` «Ligado» | `{"kind":"desktop","gamepad_flavor":null}` | `{"kind":"gamepad","gamepad_flavor":null}` |
| `hefesto` «Desligado» | `{"kind":"gamepad","gamepad_flavor":null}` | `{"kind":"native","gamepad_flavor":null}` |

A cadeia que o enunciado supunha é a que o disco confirma:
`a01_jogar._gravar_o_modo_do_chip` → `_gravar_o_modo` →
`pacotes/perfil.gravar_o_modo_no_ativo`. **Não precisa do «Salvar Perfil».**

**O QUARTO CHIP DA FILEIRA NÃO GRAVA NADA, e não é defeito novo — é declarado.**
O enunciado listou «Sony DualSense · Xbox · Steam Input · Navegação». Medido:

```
gesto_da_pagina("01-jogar.html", "modo-steam")  ->  None
a01_jogar.BOTOES_SEM_DONO                       ->  ['modo-steam']
```

O `data-gesto="modo-steam"` sai do gerador **sem** `@gesto`, de propósito, com o
motivo escrito no próprio `BOTOES_SEM_DONO`: não há IPC de Steam Input entre os
métodos que o daemon atende. O piloto recusa dizendo o nome. **A linha do
enunciado que cita o Steam Input cai: ele não é um dos que gravam.**

### §2.2 — Os três «O Controle é visto como» (pergunta 2): **grava — e o escritor é o daemon**

O gesto da interface **não escreve no perfil**. Ele para na ponte:

```
mascara_do_controle(ctx, {"uniq": …, "mascara": "Xbox 360"}, p)
  -> IPC pedido: [('gamepad.mask.set', {'uniq': 'aabbcc000002', 'flavor': 'xbox'})]
  -> o .json do perfil: BYTE-IDÊNTICO (mudou=False)
```

Quem escreve é o outro lado do fio — `ipc_handlers._handle_gamepad_mask_set` →
`_mascara_no_perfil`. Medido chamando o handler de verdade, no mesmo lar:

```
antes   "controllers": ausente
depois  "controllers": {"aabbcc000002": {"mascara": "nintendo"},
                        "aabbcc000001": {"mascara": "dualsense"}}
resposta do daemon: {'status':'ok', 'perfil':'Mortal Kombat', 'gravado': True,
                     'motivo': None}
```

**A RESPOSTA À METADE "E ONDE" DA PERGUNTA 2:** em `controllers.<uniq>.mascara`,
e **em mais lugar nenhum**. O `mode.gamepad_flavor` ficou `"dualsense"` nas duas
medições, com o P2 em `nintendo` e o P1 em `dualsense` — os três botões do
cartão **não tocam** a máscara da sessão. Fora do perfil, o daemon também
atualiza o `controller_masks.json` (que nasceu no lar de mentira), e ele é
**cache**, não dono: quem manda é `controllers.<uniq>.mascara`.

**A CONSEQUÊNCIA QUE ISSO TEM, e ela é o contrário do modo:** o modo entra no
perfil **por dentro da interface**; a máscara entra **por fora, pelo daemon**.
Com o serviço parado, clicar o chip do cartão não grava um byte — e clicar o
chip da fileira grava.

**E HÁ UM CASO PIOR QUE O SERVIÇO PARADO, medido na conferência:** o serviço
**de pé, respondendo**, com `active_profile: null`. Aí não há falha visível
para se agarrar — a chamada volta, o chip acende, a resposta é `status: ok`.

```
_mascara_no_perfil, com store.active_profile = None e os marcadores no disco:
  → {'perfil': None, 'gravado': False, 'motivo': 'sem_perfil'}
  → mortal_kombat.json BYTE-IDÊNTICO · "controllers": null
  → na MESMA corrida, o modo gravou {"kind":"gamepad","gamepad_flavor":"xbox"}
```

A máscara fica só no `controller_masks.json`, que é **cache**: a escolha dela
vale a sessão e **não volta amanhã**.

**O ENDEREÇO É `daemon/ipc_handlers.py:6506`** — `nome = getattr(self.store,
"active_profile", None)`, e `:6508` devolve `sem_perfil`. É a mesma perna só do
rodapé, e é **o único dos quatro cujo silêncio custa dado dela**.

**E O AVISO MORRE NO CAMINHO:** `a01_jogar.py:2400` chama
`p.chamar("gamepad.mask.set", …)`, e `ponte.py:180` faz `ok, _ = _safe_call(...)`
— o `motivo` que o daemon acabou de devolver é **descartado**.

**MAS A FERRAMENTA JÁ EXISTE, e isto encolhe a cura:** `ponte.py:184` tem
`chamar_detalhado(metodo, **params) -> (ok, motivo)`, *"a recusa do daemon
traduzida"*. E a docstring do `chamar`, uma linha acima, **já nomeia esta perda
com todas as letras**: *"perde a tradução da recusa, que é o que faz a tela
dizer por que não deu, em vez de não dizer nada."* O aviso estava escrito ao
lado do defeito, esperando um chamador — é a terceira vez em três dias que esta
casa acha a causa uma linha acima do sintoma.

### §2.3 — O «Salvar Perfil» (pergunta 3): **não destrói. Recusa.**

**COM O DAEMON DIZENDO QUEM ESTÁ ATIVO** (`state["active_profile"]` preenchido),
com modo e as duas máscaras no disco e os dois controles com cor viva — que é o
caminho em que o Salvar ESCREVE override por controle:

```
ANTES   "mode": {"kind":"gamepad","gamepad_flavor":"xbox"},
        "controllers": {"aabbcc000002": {"mascara":"nintendo"},
                        "aabbcc000001": {"mascara":"dualsense"}}

DEPOIS  "mode": {"kind":"gamepad","gamepad_flavor":"xbox"},
        "controllers": {"aabbcc000002": {"leds":{"lightbar":[0,255,128]},
                                         "mascara":"nintendo"},
                        "aabbcc000001": {"leds":{"lightbar":[255,0,255]},
                                         "mascara":"dualsense"}}
```

**A ÚNICA diferença no arquivo inteiro é a cor que o Salvar existe para gravar.**
O `mode` sobreviveu; as duas máscaras sobreviveram **dentro da mesma entrada em
que o Salvar acabou de escrever a cor** — o `_with_override_section` faz
`model_copy` da entrada em vez de trocá-la.

**COM O DAEMON CALADO — e é o estado da máquina dela descrito na casa inteira —
O SALVAR NÃO ACONTECE:**

```
rodape.salvar(ctx, {}, p)
  -> ValueError: salvar: não há perfil ativo. Escolha um na aba Perfis.
  -> o .json: BYTE-IDÊNTICO. IPC pedido: []
```

E o perfil **estava** valendo: `perfil.nome_do_ativo({})` respondeu
`'Mortal Kombat'` na mesma corrida, lendo `session.json` + `active_profile.txt`.

**O ENDEREÇO EXATO, e é uma linha:**

```
src/hefesto_dualsense4unix/interface/pacotes/rodape.py:372   (gesto `salvar`)
    nome = str(ctx.state.get("active_profile") or "")
```

É a perna do daemon SOZINHA — exatamente o que a docstring de
`perfil.gravar_o_modo_no_ativo` proíbe: *"QUEM ESTÁ VALENDO SE PERGUNTA AO DONO
(`nome_do_ativo`), nunca a `state["active_profile"]` cru… Três chamadores já
caíram nessa."* **Os outros dois gestos do rodapé caem igual:** `aplicar`
(`rodape.py:349`) e `exportar` (`rodape.py:402`).

**E A TELA DISCORDA DO BOTÃO, no mesmo rodapé.** A dica do «Salvar Perfil» é
pintada por `pacotes/__init__.py:917`, que já pergunta ao dono certo:

```
topo(ctx) -> "rodape.salvar": "Grava no perfil Mortal Kombat. …"
clique    -> "salvar: não há perfil ativo. Escolha um na aba Perfis."
```

**Isto NÃO é a perda de 05/09.** Não há campo gravado e depois destruído: o que
o clique escreveu continua no disco. O que há é um botão que recusa sobre um
perfil que está valendo, e que a própria tela nomeia uma linha acima.

**A cura é de outra frente** — `src/` está em `nao_toca` nesta sprint —, e ela é
pequena: trocar as três linhas por `perfil.nome_do_ativo(ctx.state)`. Quem a
fizer cobre **os três chamadores**, que é a regra que 05/09 deixou.

### §2.4 — Com o perfil do jogo só selecionado (pergunta 4): **vai para o ATIVO**

«Personalizado» ativo no disco, «Mortal Kombat» só na lista:

```
clique em «Navegação»
  personalizado.json:  "mode": null -> {"kind":"desktop","gamepad_flavor":null}
  mortal_kombat.json:  mudou=False   (byte-idêntico)
```

**Diz o que acontece, não o que deveria:** o clique vai para o perfil que está
VALENDO, e o perfil que ela vê destacado na lista não recebe nada. É o limite de
ALVO que `gravar_o_modo_no_ativo` declara — *"mexer no modo de outro perfil pede
ativá-lo antes"* —, e ele está medido.

**E SEM PERFIL ATIVO NENHUM, O CLIQUE SOME CALADO:**

```
perfil.nome_do_ativo({}) = ''
clique em «Xbox»  ->  mortal_kombat.json: mudou=False
                      personalizado.json: mudou=False
```

`gravar_o_modo_no_ativo` devolve `""` e o gesto **não levanta** — por desenho: a
gravação é efeito colateral de uma troca de modo que já deu certo, e recusar ali
viraria tarja laranja sobre um modo que mudou. O preço é que **a tela não tem
como dizer que a escolha não foi guardada**. O modo foi aplicado; ele não volta
na próxima abertura.

---

## §3 — A MORDIDA

Uma régua que passa com a cura arrancada não mede nada. Arranquei as duas
preservações do `to_profile` e o mesmo instrumento reprovou nas duas:

| cura arrancada | o que o arquivo perdeu |
| --- | --- |
| `source_mode` não é reemitido | `"mode": {"kind":"gamepad","gamepad_flavor":"xbox"}` → **ausente** |
| `source_controllers` não é reemitido | `"controllers": {…"mascara"…}` → **ausente** |

Com as duas no lugar, o mesmo Salvar não mexe em nenhum dos dois campos. E a
terceira mordida é a que separa os dois vereditos que 05/09 mandou não
confundir: no caso do daemon calado o arquivo fica byte-idêntico **e o gesto
levanta** — "não grava" e "grava e o Salvar destrói" saem diferentes do
instrumento, não iguais.

---

## §4 — O QUE EU NÃO MEDI

1. **O fio.** Nenhum aparelho, nenhum daemon vivo, nenhum socket. O gesto da
   máscara foi medido com dublê de ponte até a chamada, e o handler do daemon
   foi chamado **em processo**. O degrau *SAIU NO FIO* (o `gamepad.mask.set`
   atravessando o socket de verdade) fica para a bancada — a sprint é
   `bancada: false` e o que decide está no byte do arquivo.
2. **Se o daemon DELA responde `active_profile: null` agora.** A recusa do §2.3
   depende disso, e eu não perguntei ao daemon dela — perguntar é escrever na
   máquina que ela está usando. O estado está descrito em quatro lugares da casa
   (`profiles_actions.perfil_que_esta_valendo`, `perfil.nome_do_ativo`,
   `pacotes/__init__.topo`, `gravar_o_modo_no_ativo`) como *"o estado da máquina
   dela"*, e as duas pernas medidas aqui cobrem os dois desfechos.
3. **Nenhuma célula de `docs/data/mapa-controles.csv`.** Esta sprint não toca
   canal, report id nem peça do controle — ela lê o `.json` do perfil. Não há
   célula a marcar.
4. **A aba Perfis e a seleção da lista.** O §2.4 mediu o ATIVO e o NÃO-ativo
   pelo disco; não cliquei na aba 10 para selecionar o perfil pela tela.
5. **Nenhuma janela foi aberta.** Nada de `--oculta` porque nada abriu: o que
   esta sprint decide é o byte no arquivo.

---

## §5 — O QUE SOBRA, E É DELA

A desconfiança que abriu a sprint **fecha**: o quadro «Modo» que saiu da aba
Perfis em 11/09 não tirou capacidade nenhuma — a aba Jogar grava o modo e a
máscara, e o Salvar os preserva. **Nada nasce daí.**

O que nasce é de outro lugar, e é o que a medição achou de passagem: **quatro
chamadores perguntam o perfil ativo a uma perna só.**

| onde | o que custa |
| --- | --- |
| `pacotes/rodape.py:372` — `salvar` | o botão RECUSA. Barulhento: ela vê |
| `pacotes/rodape.py:349` — `aplicar` | idem |
| `pacotes/rodape.py:402` — `exportar` | idem |
| **`daemon/ipc_handlers.py:6506` — `_mascara_no_perfil`** | **a máscara não grava, e a tela diz que sim.** Calado |

**ERAM TRÊS NESTA PÁGINA ATÉ A CONFERÊNCIA, e a regra que o próprio laudo
invoca é a que o pegou:** *quando a cura conhece a causa, ela cobre TODOS os
chamadores*. Contar três deixaria a próxima pessoa curando o barulhento e
deixando de pé o calado — que é o único que perde dado dela.

Os três do rodapé são uma linha cada (`perfil.nome_do_ativo(ctx.state)`). **O
quarto é decisão dela**, e está na sprint `A-PERNA-QUE-FALTA-01`: curar no
daemon (as mesmas duas pernas), ou deixar o daemon como está e **fazer a
ressalva chegar à tela** — e para isso a peça já existe, `ponte.chamar_detalhado`,
sem dono neste caminho.

---

## §6 — A TRAVA: o `~/.config` real dela não foi tocado

Medido antes e depois, com a árvore inteira fotografada:

```
ANTES   drwxrwxr-x  …  2026-09-11 00:04:06  ~/.config/hefesto-dualsense4unix/profiles
DEPOIS  (a conferência está na entrega do agente, em docs/process/agentes/)
```

Tudo o que esta medição escreveu caiu em `…/scratchpad/lar/` e
`…/scratchpad/lar2/`, com `HOME`, `XDG_CONFIG_HOME`, `XDG_DATA_HOME`,
`XDG_CACHE_HOME`, `XDG_STATE_HOME` e `XDG_RUNTIME_DIR` desviados e um `env -i`
por baixo. O script recusa rodar se `profiles_dir()` cair fora do lar.

Os endereços de rádio são da faixa sintética da casa (`aabbcc…`, octetos 4 e 5
zerados), a mesma de `tests/unit/test_a_mascara_mora_no_perfil.py`.
