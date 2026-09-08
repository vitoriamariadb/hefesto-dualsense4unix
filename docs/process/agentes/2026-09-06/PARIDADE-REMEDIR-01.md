# PARIDADE-REMEDIR-01 — dezoito linhas descreviam ontem, e a §2.4 da sprint apontava para outro lugar

**06/09/2026 · agente `F-PARIDADE-REMEDIR-01` · árvore
`hefesto-voo/hefesto-voo/PARIDADE-REMEDIR-01-F-PARIDADE-REMEDIR-01` · branch
`voo/PARIDADE-REMEDIR-01-F-PARIDADE-REMEDIR-01`, nascida de `onda/atual-0609`
(`72690101`, conferido no `git log -1` antes da primeira linha) e
**adiantada para `ae9a8f71` no fim**, por recado do coordenador — ver a §2.4.**

Posse tocada: `docs/data/paridade-gtk-html.csv` (a declarada) mais os dois
arquivos que a régua obriga a andar junto — a tabela publicada em
`docs/process/2026-09-03-O-TERCEIRO-NUMERO-…md` (regra 8, `numero-publicado`) e
o `estado:` da própria sprint (decisão de coordenação 8 de 06/09). **Zero linha
de `src/`, `tests/`, `scripts/` ou `mockup/`** — o `nao_toca` foi respeitado, e
o `git diff --stat` prova.

Bancada: **não reservada, e não precisou** — nenhum caminho parou o daemon,
chamou `systemctl` ou escreveu no aparelho. Tela: **não aberta** — esta sprint
não move um pixel; ela lê fonte.

---

## 0. O ESTADO, EM UMA LINHA

**As 57 linhas `FALTA_NO_HTML` foram relidas uma a uma contra o fonte de hoje:
18 mudaram de veredito com o endereço lido no código, 21 ficaram com a segunda
metade `||` datada dizendo o que a medição achou, e 18 não tinham nada de novo.
Mais a **linha 30** (o cadeado), que chegou depois por recado do coordenador e
tinha as duas metades abertas MORTAS. O número foi de `137 · 139 · 57 · 35 %`
para `144 · 150 · 39 · 36 %`, os 45 portões estão VERDES, e as 19 linhas
mexidas com `sinal` novo foram MORDIDAS uma a uma — arranquei o sinal de cada
uma e a régua reprovou nomeando, **19 de 19**.**

---

## 1. OS NÚMEROS, ANTES E DEPOIS

```
ANTES   396 feats · 137 IGUAL · 139 DIFERENTE · 57 FALTA · 59 SO_HTML · 4 ? · 35%
DEPOIS  396 feats · 144 IGUAL · 150 DIFERENTE · 39 FALTA · 59 SO_HTML · 4 ? · 36%
```

| aba | feats | IGUAL | DIFER | FALTA | SO_HTML | ? | paridade |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 01-jogar | 42 | 13 | 15 → **16** | 9 → **8** | 4 | 1 | 31% |
| 02-controles | 50 | 12 → **16** | 18 → **23** | 16 → **7** | 4 | 0 | 24% → **32%** |
| 03-gatilhos | 31 | 15 | 9 | 1 | 5 | 1 | 48% |
| 04-iluminacao | 35 | 11 | 14 → **15** | 2 → **1** | 7 | 1 | 31% |
| 05-vibracao | 31 | 14 | 8 → **9** | 6 → **5** | 3 | 0 | 45% |
| 06-navegacao | 40 | 14 → **15** | 16 | 1 → **0** | 9 | 0 | 35% → **38%** |
| 07-lancadores | 30 | 14 → **15** | 5 | 1 → **0** | 9 | 1 | 47% → **50%** |
| 08-conexoes | 49 | 19 → **20** | 21 → **22** | 7 → **5** | 2 | 0 | 39% → **41%** |
| 09-sistema | 38 | 11 | 13 → **15** | 7 → **5** | 7 | 0 | 29% |
| 10-perfis | 50 | 14 | 20 | 7 | 9 | 0 | 28% |
| **TODAS** | **396** | **137 → 144** | **139 → 150** | **57 → 39** | 59 | 4 | **35% → 36%** |

**A meta `FALTA ≤ 60` já estava batida na chegada (57).** O que esta leva fez
foi a outra metade do enunciado: *"o alvo agora é a VERDADE, não o número"*.
**DUAS abas zeraram os `FALTA`** — a `06-navegacao` e a `07-lancadores` —, e a
`02-controles` sozinha responde por **nove** das dezoito.

---

## 2. AS DEZOITO QUE MUDARAM, uma a uma, com o endereço lido no código

Ordem do CSV. Todo endereço abaixo foi **aberto e lido** nesta árvore em
06/09/2026; nenhum veio de relatório sem conferência.

### 2.1 As SETE que viraram `IGUAL`

| linha | feature | o endereço que fecha | por que `IGUAL` |
| --- | --- | --- | --- |
| **55** `[02]` | Giroscópio espelhado — "fluindo para o jogo (~N Hz)" | `interface/pacotes/a02_controles.py:2207` (`"giro-no-jogo": texto_motion(…)`) · `interface/aba02.py:1469` | O dono é o MESMO dos dois lados (`controller_card.texto_motion`), com as duas exceções (Nativo, máscara Xbox) e o silêncio quando não há espelho vivo. O que a tela mostrava era o número de CATÁLOGO da dica ("No cabo são 250,0 Hz exatos") |
| **77** `[02]` | Deslizante de volume do microfone | `interface/aba02.py:2054` · `interface/paginas/02-controles.html:2115` · `a02_controles.py:3117` (gesto `volume`) | O `<input type="range">` existe na bancada **e no publicado**, e manda o mesmo `mic.volume.set` na mesma escala 0-100, com `uniq` obrigatório |
| **81** `[02]` | Alto-falante — o número e a barra | `a02_controles.py:2057` · `aba02.py:2095` e `:2097` · `paginas/02-controles.html:2156` | `alto-num` e `alto-barra` são pintados pela curva medida no aparelho (`core/speaker_scale`), a mesma do dono; ausência é travessão, não zero |
| **82** `[02]` | Deslizante de volume do alto-falante | `aba02.py:2096` · `paginas/02-controles.html:2157` · `a02_controles.py:3213` | Mesmo IPC (`speaker.set {volume}`), mesma curva 0-100 ↔ 0-255. **Ele é o escritor que faltava**: o primeiro arrasto é o que faz o daemon publicar a chave `speaker` e destrava o [nota] |
| **214** `[06]` | O botão PS na tabela de atalhos | `interface/aba06.py:1578` (`(gl("ps"), "ps")`, a 19ª das 22 linhas) · `a06_navegacao.py:1516` e `:1522` · `core/acoes_de_botao.py:62` | Os dois lados oferecem o `ps` na lista e os dois resolvem pelo mesmo dono (`acoes_de_botao.acao_do_ps`). **A própria célula mandava fechar aqui**, "medindo as duas metades" — o desenho e o motor |
| **231** `[07]` | Repor o atalho de inicialização DE CARONA | `interface/pacotes/perfil.py:306` (`com_a_carona`) · `rodape.py:356` e `:384` · `a10_perfis.py:277` | O «Aplicar» e o «Salvar» do rodapé chamam `carona_do_wrapper.passada(completa=True)` atrás do `carona.ligada()`. O desenho dela — *"nem precisa ter um botão na gui, mas ele se auto corrigir ao clicarmos em aplicar ou salvar"* — está honrado nos dois |
| **264** `[08]` | A QUARTA cor do selo | `a08_conexoes.py:833` (`"problema": "selo-estado"`) · `aba08.py:802` e `:810` (`.selo.grave{background:var(--red)}`) | Medido na página publicada: **6** `data-hef-quando="problema"` e **6** `data-hef-quando="atencao"`, e a regra `.selo.grave` é o VERMELHO, separado do laranja |

### 2.2 As ONZE que viraram `DIFERENTE`

| linha | feature | o endereço | a diferença que impede o `IGUAL` |
| --- | --- | --- | --- |
| **11** `[01]` | A frase da PAUSA | `a01_jogar.py:817` — `fora += list(painel.avisos_do_estado(ctx.state))` | A GTK **troca** a promessa do modo pela frase da pausa; o HTML a **acrescenta** na coluna Atenção. Mesmo fato, lugares diferentes |
| **44** `[02]` | Título do card | `aba02.py:1402`/`:1403` (`data-campo="peca"`, `data-campo="via"`) · `paginas/02-controles.html:1861` | Lá: "Controle N — USB · Jogador X". Aqui: "P1 • Cosmic Red • cabo" — o número do jogador saiu do título **por pedido dela**, e a peça entrou |
| **54** `[02]` | Badge de degradação do vpad | `a02_controles.py:2183` · `aba02.py:1440` | Decisão `02[07]`: tarja escrita lá, **marca na palavra + motivo no hover** aqui |
| **58** `[02]` | Confissão "o microfone que mexi não é o deste card" | `a02_controles.py:3200` (`frase_do_alvo_do_mic(alvo_honrado(corpo))`) · `pacotes/ponte.py:99` | Dois motivos medidos: o canal é outro (tarja lá, recado da recusa aqui — decisão `[08]`) e a cobertura é **parcial**: só o volume confessa; o botão de mudo ainda não lê `alvo_honrado` |
| **64** `[02]` | Barra de luz — o rótulo das quatro situações | `a02_controles.py:932` (`luz_palavra`), `:1917`, `:2220` · `aba02.py:1968` | Decisão `02[02]` executada: as quatro palavras curtas dela (`Jogo` · `Steam` · `Não sei` · `Apagada`) na tela e a frase inteira no `title`. Lá a frase é visível |
| **91** `[02]` | Anotar no perfil o que o gesto de som fez | `a02_controles.py:2554` (`_lembrar_do_som`), chamado em `:2818`, `:2870`, `:2964`, `:3209` e `:3221` | O destino é outro: rascunho em memória lá, **perfil ativo direto** aqui (ação imediata, decisão dela de 01/09). *"Nenhum dos três gestos anota nada"* caiu — são **cinco**, e todos anotam |
| **150** `[04]` | Prévia honesta com o automático ligado | `a04_iluminacao.py:386` (`ENDERECO_DO_AUTOMATICO`), `:1979`, `:2847` (gesto `auto-cores`) | Lá a prévia é CORRIGIDA por slot; aqui não há prévia velha (a cor é o `lightbar_rgb` resolvido) e quem responde "esta cor é da paleta" é o interruptor no topo — D-13 dela |
| **180** `[05]` | Gravar a força no perfil | `rodape.py:269`/`:289` (`_o_que_e_da_mesa_inteira` lê `rumble_policy`, `rumble_passthrough`, `custom_mult`) · `a05_vibracao.py:1447`/`:1546` | Não há rascunho em memória: a força já está no disco quando ela chega ao rodapé, e o rodapé garante que o Salvar não a atropele |
| **271** `[08]` | Reabrir uma ordem ignorada | `a08_conexoes.py:4624` (gesto `ignorar`), `:4693` (`_ordem_calada`) | Decisão **08-Q5** dela: lá um `[Ver quais]` no topo REVELA os cards; aqui a linha nunca sai da lista — fica apagada e o **mesmo ⊘ desfaz** |
| **337** `[09]` | Steam — "Este jogo não funciona" | `a07_lancadores.py:2161` (gesto) e `:2193` (`add_appid_to_steam_input_allowlist`) | O ato existe, **noutra aba**, por `D-0609-STEAM-DIVIDIDO`. É a mesma forma das linhas 336 e 339, que já eram `DIFERENTE` por isso |
| **342** `[09]` | Camadas Vulkan — "Tirar a sobreposição" | `a09_sistema.py:2635`/`:2636` (`procurar_camadas`, `grava="curar_todos"`) | *"Botão presente, sem dono. Clique morto"* caiu. Lá o diálogo tem **dois botões nomeados** (Tirar e Devolver, cada um só quando cabe); aqui há **um**, e o segundo clique decide a direção pelo censo |

### 2.3 A REGRA DE `DIFERENTE` QUE ESTA LEVA FIRMOU

Ela vinha sendo aplicada de dois jeitos no mesmo arquivo, e isso é o que fazia a
§2.4 da sprint parecer razoável. Escrita, agora, e é a do documento que publica
o número (*"`DIFERENTE` — os dois fazem, e não a mesma coisa"*):

> **`DIFERENTE` exige que o lado HTML entregue a MESMA RESPOSTA por outro
> caminho, com endereço lido no código. Se a resposta não chega à tela, é
> `FALTA_NO_HTML` — mesmo quando a ausência é escolha dela.**

É por ela que as linhas 106 e 108 (o `↻`) são `DIFERENTE` — *a rota do efeito
continua paga pelos dois lados* — e as 165 e 170 da aba 05 continuam `FALTA` com
a decisão dela escrita no `porque`. **As duas formas já estavam no CSV; o que
faltava era o critério.**

### 2.4 A LINHA 30 — o cadeado, que chegou depois e já era `IGUAL`

Recado do coordenador no meio do trabalho: a `ONDA5-01-03` fechou
(`b4f1a0e8`, costurada em `ae9a8f71`) com o CSV no `nao_toca` dela, e a linha
30 ficou com **as duas metades abertas mortas**.

**A PRIMEIRA COISA QUE FIZ FOI ADIANTAR A BRANCH, e ela era necessária.** O
código que o recado citava (`a01_jogar.py:2094`, a guarda do `None`) **não
existia nesta árvore**: `git merge-base --is-ancestor b4f1a0e8 HEAD` dizia NÃO.
Colar o texto pronto teria posto no CSV um endereço que a régua daqui não abre —
e a régua teria reprovado no meu próprio commit. `72690101` é ancestral de
`ae9a8f71` e a costura **não toca a minha posse** (conferido com
`git diff --name-only`), então o `git rebase ae9a8f71` foi limpo e a branch
continua com **um commit só**, para o `cherry-pick` do coordenador.

**As três afirmações, conferidas no código depois de adiantar:**

| a metade | o que medi |
| --- | --- |
| *"a caixa só existe na bancada"* | **MORTA**: ela está em `interface/paginas/01-jogar.html:1841`, com `data-gesto="cadeado"` e `data-campo="cadeado"` |
| *"`hefesto_vivo.PERIGOSOS` precisa de (`01-jogar.html`, `cadeado`)"* | **MORTA**: `PERIGOSOS = pacotes.perigosos()` desde a `ONDA3-GESTO-DECLARA-01`. **Medido em execução nesta árvore**, com a venv e o `PYTHONPATH` daqui: 67 pares, e o `('01-jogar.html', 'cadeado')` está lá, derivado de `grava="autoswitch_lock_set"` (`a01_jogar.py:1999`) |
| o fato novo — *"o verde virou recibo do serviço"* | **VIVO**: `a01_jogar.py:2094` faz `if p.autoswitch_lock_set(locked=pedido) is None: raise RuntimeError(CADEADO_RECUSA)`, e a frase (`:363`) é palavra por palavra a que `home_actions` já põe na tela dela |

**O veredito `IGUAL` não mudou** — ele já estava certo. O que mudou foi o
`sinal`, e a troca vale a linha: ele era **a frase da tela** (*"Não trocar de
perfil sozinho ao abrir um jogo"*), que a `palavra-de-tela` já vigia, e passou a
ser **a guarda** `raise RuntimeError(CADEADO_RECUSA)`. É ela que separa
*"guardei"* de *"pisquei"* — antes desta leva o gesto jogava fora a resposta da
ponte e, com o serviço parado, a caixa piscava **verde sobre escrita que não
aconteceu**, desmarcando 100 ms depois pelo tique. Arrancar a guarda agora
reprova (§5).

**E o `html_onde` estava morto de outra forma, que ninguém tinha visto:** ele
citava `a01_jogar.py:248` e `:1587`, e os dois números apontam hoje para código
de outro assunto (a linha do `+N` e o plano do modo). O `endereco-morto` não
pega isso — ele só confere que o arquivo abre e que a linha existe. Trocados
pelos quatro endereços que respondem: o decorador (`:1999`), a guarda (`:2094`),
a pintura do estado (`:642`) e a caixa publicada.

---

---

## 3. AS VINTE E UMA QUE FICARAM `FALTA`, e o que a medição acrescentou

Nenhuma delas mudou de veredito, e **todas ganharam a segunda metade `||`
datada** — porque uma célula que não registra a releitura obriga a próxima
pessoa a refazê-la.

| linha | o que a medição de hoje diz |
| --- | --- |
| **9** `[01]` custo da máscara Xbox | O lado HTML não está calado: **ele PROÍBE a frase, em código** — `interface/aba01.py:1723` recusa a geração se voltar "sem giroscópio", "só chegam ao jogo por aqui/pelo" ou "sem touchpad para o jogo" |
| **16** `[01]` cards dos externos | `external` continua sem leitor em `interface/`. `D-0609-EXTERNOS-DEPOIS`: a `EXTERNOS-01` está escrita e fica **fora** das 24 h. Adiada, não cancelada |
| **12, 17, 25, 26, 28, 35** `[01]` | Conferidas por `grep` no lado HTML: `texto_do_desktop_sem_emulacao`, `aviso_de_grab`, `resultado_renumber`, `RECONCILIAR_JOGO_ABERTO_TEXT`, `mascara_divergente`, `native_mode_origin` — **zero ocorrência**, e a `JOGAR-O-QUE-FALTA-01` as relata na §5.4 com o mesmo resultado. Sem nota nova: a célula já estava certa |
| **45** `[02]` dica do vpad | `vpad_uniq` continua sem endereço em página nenhuma |
| **56** `[02]` linha da verdade | **CONFIRMADO**: `controller_card.py:2916` diz que ela é criada, alimentada e nunca empacotada desde 17/08; `:2770` diz que é decisão dela e não se apaga. Há régua contra a volta |
| **57** `[02]` guarda "sem endereço" | A metade VISÍVEL continua faltando |
| **73** `[02]` medidor de onda | `MicMonitor` só aparece em `interface/controles_vivos.py:1127`, que é bancada |
| **88** `[02]` som de confirmação | **O custo dela SUBIU nesta leva**: o deslizante do alto-falante nasceu (linha 82), então agora ela arrasta um número que o aparelho não devolve — e o som era o único jeito de saber que valeu |
| **89, 90** `[02]` | `saida_muda` e `definir_estado_do_canal`: zero ocorrência no lado HTML |
| **110** `[03]` editar em "Todos" | Toda escrita da aba continua levando `uniq`; a seção global `triggers` nunca é escrita |
| **158** `[04]` mesmo desenho nos N | Continua sem escopo "Todos". Dívida **condicional**, e o sinal (o texto do aviso) é o certo para morder no dia em que o escopo nascer |
| **165, 170, 176, 177** `[05]` | Sem nota nova: as células já traziam a decisão dela de 05/09 com a medição que a sustenta |
| **182** `[05]` zerar weak/strong | **Metade fechou**: `rodape.py:290` sobrepõe `rumble_passthrough` do estado vivo. O par `weak`/`strong` continua sem escritor, e é ele que carrega o sintoma |
| **269** `[08]` "Já movi — reexaminar" | A `CONEXOES-LIGAR-TUDO-01` mediu os dezesseis itens da 08 e este não fechou |
| **272** `[08]` ambiguidade fina | **A premissa caiu**, por duas vias medidas: o cartão nomeia o alvo por `ordem.alvo.caminho` (endereço de barramento, único por construção) e `ambigua` tem **um** consumidor em toda a árvore — a resposta do "Já movi", que ela mandou tirar. Dívida condicional |
| **288** `[08]` Mapear Entrada a Entrada | Contei os `data-gesto` das três telas na página publicada: **zero**, e zero `data-hef` |
| **296** `[08]` "A luz não acende" | `a08_conexoes.py:4874` derruba e volta; sem contagem, sem Cancelar, sem recado |
| **305** `[08]` externos na lista | `D-0609-EXTERNOS-DEPOIS`, como a 16 |
| **315** `[09]` migrar para systemd | Li os onze `@gesto("09-sistema.html", …)` um a um; nenhum é este |
| **330** `[09]` conta de slots | **Agora é dívida DECIDIDA**: `D-0609-MESA-E-PALAVRA-NAO-FEATURE`, palavra dela, manda a tabela e a conta de slots ENTRAREM. A `SISTEMA-STEAM-01` entregou as duas linhas de estado (linha 329); a conta não nasceu |
| **340** `[09]` "Aplicar aos jogos" | Sem botão e sem gesto — e agora com **endereço decidido**: `D-0609-STEAM-DIVIDIDO` a põe nesta aba |
| **343** `[09]` "Restaurar de fábrica" | É o **único** nome que sobra em `a09_sistema.SEM_MOTOR` (eram três até hoje), e a razão escrita lá não é mais o motor — é a rede de segurança: um gesto que chame `save_profile` restaura o `meu_perfil` DELA quando a régua de clique o acionar |
| **368, 370, 381, 382** `[10]` | `368`: não há gesto de salvar o perfil DO EDITOR. `370`: **a metade que ela cobra encolheu** — o rodapé passou a trazer do vivo a vibração, o `passthrough`, o teto e o mouse; falta `speaker`, `audio.mic_mudo` e `sensores` por controle. `381`/`382`: os três campos crus só aparecem em PROSA no lado HTML |
| **385, 386** `[10]` as duas frases do modo | Mantidas — ver a §4. E com a mesma forma da linha 9: **o lado HTML proíbe as frases em código**, `interface/aba10.py:1964` |
| **387** `[10]` caixinha do Steam Input | **A pergunta que a célula deixava está respondida**: o "Este jogo não funciona" existe, e na aba 07. Mas fechou só o MARCAR; a caixinha ligada ao jogo DESTE perfil e a lista dos outros com o "Tirar" por linha não existem. A assimetria de antes de 22/08 encolheu; não morreu |

---

## 4. O QUE EU RECUSEI, e a fonte da recusa

### 4.1 A §2.4 DA SPRINT — e ela contradiz o documento de onde tirou a lista

A sprint manda, com todas as letras:

> *"**2.4 As que as decisões de 06/09 tiraram de cena:** Editor avançado de
> regra (10-Q2), "Mapear Entrada a Entrada" (08), o custo da máscara antes do
> clique (10-Q6), Liberar/Devolver do som (02-Q6), controles externos.
> **Nenhuma delas é FALTA**: são **decisão**, e o campo `porque` diz qual, com a
> data."*

**Fui atrás da fonte antes de aplicar, e ela diz o contrário.** A lista sai da
§10 da 24 HORAS, cujo título é **"O QUE NÃO ENTRA NAS 24 HORAS — e onde cada um
espera"**, e cujo último marcador é:

> *"**O resto dos 89 FALTA** que não é de jogar — **fica na régua, que é onde
> fila mora**."*

E a entrada dos externos, na mesma seção: *"**EXTERNOS-01 está escrita e espera
a bancada dos quatro** [ela, 06/09]"*. Nenhuma dessas é remoção de escopo —
**são de PRAZO**.

**A hipótese que explica o que já funcionava** — que é o teste desta casa —
fecha do mesmo lado: o CSV **já tinha** as duas formas, e o critério que as
separa está no §2.3 acima. As linhas 165 e 170 da aba 05 são o precedente
escrito: *"o que saiu foi a OFERTA nesta tela, e **por isso a linha é
FALTA_NO_HTML e não uma dívida a pagar**"*. Aplicar a §2.4 literalmente teria
apagado esse precedente e **esvaziado a fila sobre trabalho que ninguém fez** —
que é o que a §5 da própria sprint proíbe: *"um FALTA que virou IGUAL sem
endereço lido é pior que um FALTA que ficou"*.

**O que fiz no lugar:** a instrução operativa da §2.4 — *"o campo `porque` diz
qual [decisão], com a data"* — foi cumprida em todas elas, e a §2.3 desta
entrega (as linhas 106 e 108, `DIFERENTE` decidido) **já estava aplicada** pela
costura da ONDA A: as duas chegaram `DIFERENTE` e não foram tocadas, como o
despacho mandava.

### 4.2 As promoções que eu poderia ter feito e não fiz

| linha | o que me tentou | por que recusei |
| --- | --- | --- |
| **385, 386** `[10]` | O lado HTML tem uma GUARDA em código (`aba10.py:1964`) que proíbe as duas frases — daria um `sinal` `PRESENTE` legítimo, e `DIFERENTE` passaria na régua | A guarda não é a resposta chegando à tela: é a resposta sendo **impedida**. A própria célula diz que a dívida trocou de natureza (de TEXTO para MECANISMO), não que deixou de existir |
| **9** `[01]` | Idem, com a guarda em `aba01.py:1723` | Mesma razão |
| **56** `[02]` | A régua `test_a_linha_da_verdade_continua_fora_do_cartao` protege a decisão dela | `tests/` não é o lado HTML para a régua, e um teste não é a tela fazendo |
| **150** `[04]` | Chegou a parecer `IGUAL`: o interruptor existe e o estado é lido do perfil | A GTK **corrige a prévia**; o HTML **não tem prévia**. São dois caminhos para a mesma resposta, e isso é `DIFERENTE`, não `IGUAL` |
| **54, 64** `[02]` | A costura pôs a irmã da 54 na aba 01 (linha 32) como `IGUAL`, com o mesmo `degradacao_de` | Aqui a FORMA foi decidida por ela (`02[07]` e `02[02]`) e é outra — marca + hover contra tarja escrita. Um `IGUAL` apagaria a decisão dela do registro |
| **387** `[10]` | O "Este jogo não funciona" fechou na 07 | Fechou **metade** da linha. A caixinha por perfil e a lista dos outros marcados não existem em lugar nenhum |
| **342** `[09]` | A `SISTEMA-STEAM-01` deu `IGUAL` a um irmão (linha 338, "Refazer os consertos") com dois cliques também | Lá a diferença é só o canal do recibo. Aqui a GTK oferece **dois botões nomeados** e o HTML **um**, com a direção inferida do censo |

---

## 5. A MORDIDA — arrancada dezenove vezes, e ela mordeu dezenove

**Uma promoção sem endereço passaria despercebida?** Não. Para cada uma das 18
linhas promovidas **mais a 30** (cujo `sinal` trocou), troquei o `sinal` por um
que não existe em lugar nenhum e rodei a régua:

```
  11  arrancado -> rc=1  REPROVOU nomeando      150  arrancado -> rc=1  REPROVOU nomeando
  30  arrancado -> rc=1  REPROVOU nomeando      180  arrancado -> rc=1  REPROVOU nomeando
  44  arrancado -> rc=1  REPROVOU nomeando      214  arrancado -> rc=1  REPROVOU nomeando
  54  arrancado -> rc=1  REPROVOU nomeando      231  arrancado -> rc=1  REPROVOU nomeando
  55  arrancado -> rc=1  REPROVOU nomeando      264  arrancado -> rc=1  REPROVOU nomeando
  58  arrancado -> rc=1  REPROVOU nomeando      271  arrancado -> rc=1  REPROVOU nomeando
  64  arrancado -> rc=1  REPROVOU nomeando      337  arrancado -> rc=1  REPROVOU nomeando
  77  arrancado -> rc=1  REPROVOU nomeando      342  arrancado -> rc=1  REPROVOU nomeando
  81  arrancado -> rc=1  REPROVOU nomeando
  82  arrancado -> rc=1  REPROVOU nomeando
  91  arrancado -> rc=1  REPROVOU nomeando

devolvido -> rc=0 · mordidas que morderam: 19/19
```

E mais duas, nas outras duas regras que esta entrega toca:

```
MORDIDA B — html_onde vazio na 214 (IGUAL)
  sem-endereco: paridade-gtk-html.csv:214  [06-navegacao] O botão PS na tabela de atalhos
      o veredito IGUAL afirma que o lado HTML TEM isto, e `html_onde` está vazio.

MORDIDA C — a tabela publicada volta ao número de ontem
  numero-publicado: …-O-TERCEIRO-NUMERO-….md, linha 'TODAS':
      publicado: (396, 137, 139, 57, 59, 4, 35)
      no CSV:    (396, 144, 150, 39, 59, 4, 36)
```

O CSV e o documento foram devolvidos byte a byte (`diff -q` limpo) antes de
seguir. O script da mordida está em
`<scratchpad>/50-mordida.txt` e `<scratchpad>/51-mordida-bc.txt`.

**O que a mordida NÃO alcança, e está dito na cara:** um `sinal` que exista só
em PROSA passa. É a cegueira que a `D-0609-O-SINAL-DA-PARIDADE-NAO-E-PROSA`
nomeia e que a `STEAM-INPUT-01` mediu ("a régua só o achou porque eu o nomeei
num comentário"). Por isso os 18 sinais desta entrega foram escolhidos **em
código executável** — chamada, chave de dicionário, atributo de tela ou regra de
estilo —, nunca em docstring. Os quatro que são `data-…="…"` ou `.selo.grave`
estão em atributo/CSS do gerador e da página; os quinze restantes são nome de
função, chave emitida, chamada ou — no caso da 30 — a linha inteira da guarda.

---

## 6. OS PORTÕES

```
git add -A && bash scripts/portoes.sh
  → TODOS VERDES — 45 portões
```

**E um deles reprovou na primeira volta, por uma palavra que a própria sprint
usa no título.** O `acentuacao` pegou `docs/data/paridade-gtk-html.csv:11:media
-> sugestão média`: eu tinha escrito *"o `html_faz` **media** o mundo de
ontem"* — o pretérito de *medir*, que é a frase do enunciado desta sprint —, e
a régua não distingue o verbo do substantivo. Trocado por *"descrevia"* nas
duas ocorrências (a célula e o título deste laudo). **Não afrouxei a régua nem
declarei isenção:** um `noqa-acento` aqui protegeria a palavra e deixaria a
próxima passar batida, e o custo de reescrever era uma palavra.

A saída inteira está em `<scratchpad>/60-portoes.txt`, e a tabela da paridade em
`<scratchpad>/40-tabela-depois.txt`.

```
OK: 396 features conferidas contra o código — 144 IGUAL · 150 DIFERENTE ·
    39 FALTA_NO_HTML · 59 SO_NO_HTML · 4 NAO_DA_PARA_SABER (36% de paridade).
```

**O CSV saiu com `\n`, não `\r\n`** — `csv.writer` escreve CRLF por padrão, e o
`lineterminator="\n"` está no script que o regravou. Conferido: `file` diz
`CSV Unicode text, UTF-8 text`, sem `with CRLF line terminators`.

---

## 7. O QUE EU **NÃO** VERIFIQUEI

* **A tela.** Esta sprint não move um pixel: ela lê fonte e escreve um CSV.
  Nenhuma janela foi aberta, nem oculta. O que eu afirmo sobre a página
  publicada foi medido **lendo o HTML no disco** (contagens de `data-campo`,
  `data-hef-quando` e `type="range"`), não clicando.
* **Se as features FUNCIONAM.** É o que a régua declara não medir, e vale para
  cada uma das 18 promoções: um botão que existe nos dois lados e está quebrado
  nos dois passa aqui sorrindo. Quem morde isso é a ponte JS do piloto.
* **A suíte inteira.** É de quem coordena e roda no fim. Rodei os 45 portões,
  que incluem `casa-sabe`, `acentuacao`, `mypy`, `shellcheck`, `anonimato` e
  `referencias-docs`.
* **A bancada** (`scripts/bancada.sh`): **não reservada, e não precisou** —
  nenhum caminho meu parou o daemon, chamou `systemctl` ou escreveu no aparelho.

---

## 8. O QUE ACHEI E NÃO É DA MINHA POSSE

Cinco coisas, nenhuma tocada. As três primeiras são fila; as duas últimas são
processo.

1. **A linha 88 `[02]` — o som de confirmação — ficou MAIS cara nesta leva, e
   ninguém decidiu isso.** O deslizante do alto-falante nasceu (linha 82) e o
   registrador de volume do DualSense **não tem leitura**: o número que a tela
   mostra é o que nós mandamos. A GTK escreve a razão no fonte, e é ideia dela:
   *"ao clicar em cada botão ele emite o som (…) tem que ajudar a entender o
   conceito"*. **Hoje ela arrasta e não tem como saber se pegou.** Vale sprint,
   e o dono é `interface/pacotes/a02_controles.py`.

2. **A linha 58 fechou pela METADE e a assimetria é invisível.** O deslizante do
   microfone confessa quando o pedido caiu na rota global
   (`frase_do_alvo_do_mic`); o **botão de mudo não**. Na mesa cheia, um mudo que
   calou o microfone de outra pessoa aparece como sucesso — que é exatamente o
   defeito que a decisão `[08]` mandou fechar. Uma linha no gesto `mudo`
   (`a02_controles.py:2707`, no ramo do microfone que hoje só lê
   `frase_do_ato_do_microfone`), e ela usa a função que já está importada.

3. **A 370 mudou de tamanho e o docstring do `_draft_do_ativo` já sabe disso.**
   A fila que sobra está escrita lá com endereço (`speaker`, `audio.mic_mudo` e
   `sensores` por controle), e `DraftConfig` precisa de `with_controller_mic` e
   `with_controller_sensores` antes. Quem for fechar não precisa remedir.

4. **A `SISTEMA-STEAM-01` relatou uma quarta linha para remedir — a 253 `[07]`,
   Vulkan — e ela JÁ estava remedida** quando cheguei: a costura da ONDA A
   aplicou os diffs das §7.2 e §10 daquele laudo (linhas 329, 333, 338) e a 253
   junto. Conferi as quatro no CSV antes de escrever qualquer coisa. **O
   despacho me mandou "começar por esses" e o certo era conferir primeiro que
   ainda faltavam** — colar um diff já aplicado teria duplicado a segunda
   metade `||` de três células.

5. **A régua NÃO vê endereço que aponta para o assunto errado.** O `html_onde`
   da linha 30 citava `a01_jogar.py:248` e `:1587`; os dois números abrem, e o
   `endereco-morto` só confere que o arquivo existe e que a linha cabe no
   arquivo. Hoje eles apontam para a linha do `+N` e para o plano do modo — o
   arquivo cresceu por baixo deles. **É uma família de defeito que esta régua
   não alcança**, e a única defesa é o que esta sprint faz: reler. Não sugiro
   ampliar a regra (um endereço com âncora textual seria um segundo dono do
   nome da função); sugiro que a remedição seja periódica.

6. **A `CONEXOES-LIGAR-TUDO-01` e a `CONTROLES-VERDADE-01` também tiveram os
   diffs aplicados pela costura** (as linhas 275, 276, 290, 306 e 307 da aba 08
   chegaram todas aplicadas). **Da `CONTROLES-VERDADE-01` sobrou tudo:** a 55, a
   56, a 44, a 54 e a 64 chegaram como estavam, e o laudo dela dizia com todas
   as letras que as três últimas *"já estão fechadas no código e o veredito
   envelheceu"*. O padrão que isso deixa, e ele é de coordenação: **quando a costura
   aplica parte dos relatos, o agente da remedição precisa medir o CSV, não ler
   o laudo.** Foi o que fiz, e é por isso que a §2 acima cita endereço de fonte
   em toda linha, inclusive nas que um laudo já trazia prontas.
