# 03/09/2026 — o dia do install, e os quatro instrumentos que mentiam

**Leia a §1 antes de rodar qualquer comando.** Ela tem as três armadilhas que
comeram trabalho hoje, e a primeira come trabalho que está no *stage*.

**O que este dia entregou, em uma linha:** o produto foi INSTALADO de verdade
(`rc=0`, três módulos DKMS, daemon reiniciado), a suíte fechou VERDE nos oito
lotes (16.447 testes), **quatro instrumentos que davam verde sobre nada** foram
achados e curados — um deles por ELA, lendo a saída do install —, e **nove
agentes clicaram nove abas no produto instalado** (§10), achando uma `quebra`
que apagava dado dela e oito telas que afirmavam o que não existia.

**E o serial de aparelho ganhou portão** (§9), a pedido dela — descobrindo no
caminho que a régua já existia desde 15/08 e o que faltava era a CAMADA.

**À TARDE, a paridade com a janela antiga foi de 14% a 25%** (§11) com dez
frentes em paralelo e quatro conferentes adversários — um deles derrubou uma
entrega inteira, provando com `git log -S` que as "oito features" de uma aba já
funcionavam. A **máscara por controle fechou** (§13), e os trinta pontos que as
frentes não podiam decidir viraram dez perguntas em arquivo (§14).

**A forma que este dia repetiu SEIS vezes tem nome** (§12): *a régua DIGITA em
vez de perguntar* — e três delas reprovaram melhoras feitas no mesmo dia.

---

## §1 — AS TRÊS ARMADILHAS DO DIA

### 1.1 Um agente resetou a ÁRVORE PRINCIPAL

O `reflog` registra, no meio da sessão:

```
90fce1a1 HEAD@{3}: reset: moving to dev
```

**Ninguém desta conversa rodou isso.** Veio de um agente de workflow, e a origem
é a instrução que TODO workflow desta casa carrega no bloco `CASA`:

> *"Você trabalha na SUA worktree. Primeiro comando: `git reset --hard dev`."*

Quando a resolução de diretório do agente falha, o alvo é **a mesa dela**.

**O que se perdeu, medido:** a limpeza de 94 células do `mapa-controles.csv` e o
`specs.html` regerado, ambos com `git add -A` e sem commit. O sintoma engana:
dois portões que eu tinha ACABADO de ver verdes voltaram a vermelho sem nada os
ter tocado.

> **A REGRA: commite antes de lançar workflow, e commite de novo assim que uma
> cura fechar.** Enquanto houver agente em voo, o *stage* não é lugar seguro.

Proibir o `reset` na instrução não resolve — o agente precisa partir de base
limpa. O que protege é o commit deste lado. **O bloco `CASA` dos workflows
passou a mandar conferir `pwd` antes**, e a parar se não estiver na worktree.

### 1.2 O `sudo` desta máquina expira em 60 segundos

`timestamp_timeout=60`, e `timestamp_type=global`. Uma credencial obtida num
terminal vale para os outros, mas por um minuto só — e o install leva vários
minutos chamando `sudo` em dezenas de passos.

**O install já resolve isso sozinho:** `acquire_sudo` + `_start_sudo_keepalive`
pegam a credencial UMA vez e a renovam a cada 50 s enquanto ele vive. O que
falta é a PRIMEIRA autenticação, que precisa de um terminal.

### 1.3 `montar()` grava na bancada ANTES de `_conferir` reprovar

Achado pela frente da aba 01. O gerador recusa com `rc=1` e uma mensagem
correta, **e mesmo assim deixa o `mockup/NN-*.html` quebrado no disco** — só o
`git status` denuncia. Para morder um gerador sem tocar a bancada, use o
`HEFESTO_BANCADA` (o desvio de escrita do `onde.py`).

---

## §2 — OS QUATRO INSTRUMENTOS FALSOS, e três têm a mesma causa

**A causa comum: as pastas mudaram de nome e as réguas não foram junto.**
`layout/` e `novo-layout/` **não existem** nesta árvore — as páginas publicadas
moraram para `src/hefesto_dualsense4unix/interface/paginas/` e a bancada para
`mockup/`.

| instrumento | o que ele fazia |
| --- | --- |
| `scripts/check_regua_de_tela.py` | **CALADO** para toda mudança em página publicada — o portão que existe para INDUZIR régua de tela não cobria as páginas |
| `tests/unit/test_arranjo_invariantes.py` | dizia *"o arquivo versionado não está aqui"*, que se lê como "apagaram o produto" |
| `scripts/regua_de_tela.py` | **achava ZERO abas.** É a biblioteca com que se ESCREVE régua nesta casa: toda régua nova sobre ela passaria por VACUIDADE |

**E a cura do terceiro abriu um perigo maior**, também curado: ao voltar a achar
arquivo, ele escolhia a cópia **mais nova entre todas as worktrees** — inclusive
as de agente em `/tmp`. Uma régua leria a árvore de OUTRO agente e relataria
sobre esta. É a armadilha nº 1 do `COMO-OLHAR-A-TELA.md`. Agora a raiz local
vence o relógio, e o relógio só desempata dentro dela.

### 2.4 — O QUARTO FOI ELA QUEM ACHOU, e nenhum dos 40 agentes viu

Lendo a saída do install:

> *"nem o 8bitdo tá conectado nem o usb pareceu ter dado pau. acho que essas 4
> mensagens tão erradas não?"*

**Estavam.** O `doctor.sh` fazia `grep -c "[JOYCON]"` sobre o log INTEIRO — que
começa em 20/07 — e escrevia o número no PRESENTE:

```
[WARN] o kernel deu rate-limit no controle Nintendo/8BitDo 9 vez(es)
```

Os nove eventos eram de **11/08 (três) e 26/08 (seis)**, e o 8BitDo estava
desligado havia semanas. O mesmo com *"storm USB registrado 113 vezes"*, cujo
último foi em 30/08.

**O DEFEITO NÃO É O NÚMERO — É O TEMPO VERBAL.** Um aviso que afirma com
confiança um estado que não é o de agora manda procurar defeito onde não há. E
para quem lê tela é o pior arranjo que existe: **ele parece medição**.

A cura tem duas metades: só é AVISO o que aconteceu dentro da janela
(`HEFESTO_DOCTOR_JANELA_DIAS`, 7 por padrão), e todo número vem com a DATA do
último evento. Fora da janela vira `info`, dito como histórico. Vale para os
QUATRO contadores, e não só para o que ela notou.

---

## §3 — OS DOIS DEFEITOS DE PERDA DE DADO

### 3.1 Desligar a barra e salvar apagava a cor dela

Levantado do meio da lista por um dos três juízes, e posto no topo:

> **"Desligar" a barra de luz e depois "Salvar Perfil" apaga a cor escolhida
> por ela, para sempre, em silêncio.**

`rodape._draft_do_ativo` lia `lightbar_rgb` cru e o gravava como override. Com a
barra apagada esse campo é `(0,0,0)` — e o `LedsDraft` **não tem campo de
aceso/apagado**, só a cor. Gravar o preto não guarda "estava apagada": guarda
PRETO por cima da escolha dela.

A cura é REUSO: `controller_card.rotulo_lightbar` já é o dono desta leitura, e
devolve a cor base como `None` nos dois estados sem cor a afirmar.

### 3.2 A prova automática gravava no perfil dela, dez vezes por volta

**Medido:** dez gravações em `meu_perfil.json` entre **07:14 e 07:47**, uma por
aba provada. Nada se perdeu — as dez foram re-salvamentos do mesmo conteúdo,
conferidos campo a campo contra o backup —, mas o caminho para perder é o 3.1.

A causa era de FORMA: o rodapé registra `@gesto("*", "salvar")`, um gesto só
vivo nas dez páginas, e `PERIGOSOS` só sabia casar `(página, gesto)`.
`_alvos_a_clicar` passou a casar também `("*", nome)`.

---

## §4 — A COR DO PLÁSTICO CHEGOU A ZERO NA BANCADA

**503 → 0.** As dez abas vestem os 28 modelos dela. O publicado ainda marca 358
porque **ela decidiu publicar por último**.

E os dois auditores acharam o que o portão **não contava**: os **8 modelos sem
hexa amostrado** (Grey Camouflage, os três Chroma, Ghost of Yōtei, Marathon,
Genshin Impact, 007 First Light — **29% do mapa dela**) recebiam
`url(#hachura-sem-hex)` num campo de COR CSS. O navegador recusa em silêncio, e
o **Cosmic Red do mockup ficava na tela** sob um desenho que dizia outro modelo.

> É a queixa dela literal, com os donos trocados. E é pior que não pintar: não
> pintar é uma lacuna; pintar OUTRO MODELO é uma afirmação falsa.

A cura separou duas perguntas que eram uma só — `monta.cor_de_css` (*"que cor um
campo de COR aceita?"*) e `monta.o_desenho_conhece` (*"a folha publica regra
para este modelo?"*). **Nenhuma lista de oito é digitada:** o critério é a FORMA
do valor, então continua certo no dia em que ela amostrar o vigésimo nono.

---

## §5 — O INSTALL RODOU

`./install.sh --yes` → **`rc=0`**, 238 linhas, **nenhuma falha**.

| | |
| --- | --- |
| daemon | `active` e `enabled` — reiniciou e voltou |
| DKMS | `hid-nintendo`, `hid-playstation`, `rtw88-usb` nos dois kernels |
| bluetooth | `active` — o backport subiu |
| cmdline do kernel | **não tocado** — já garantido, dono `terceiro` |
| Steam | **nada a fazer** — as 12 linhas de `UseSteamControllerConfig` já em `"0"` |
| doctor | nenhuma FALHA |

**O que ele NÃO desfaz** está em
`2026-09-03-O-INSTALL-REVISADO-o-que-ele-faz-e-o-que-nao-se-desfaz.md`. O único
passo verdadeiramente irreversível é o **3f**: o backport do BlueZ reinicia o
`bluetoothd` e a migração **descarta os pareamentos**. Ela autorizou com todas
as letras: *"é pra rodar tudo não tenho controle bugado nesse sentido"*.

---

## §6 — OS NÚMEROS QUE ANDARAM

| medida | manhã | fim do dia |
| --- | --- | --- |
| células `aciona` mudas no mapa | 208 | **47** |
| cor do plástico cravada (bancada) | 503 | **0** |
| identidade de marca congelada | 134 | **0** |
| testes vermelhos na suíte | 73 | **0** |
| resíduo de fusão fora de `nota` | 94 células | **0** |
| notas infladas por duplicata | 53 | **0** |
| endereços de rádio REAIS versionados | 37 | **0** |
| testes na suíte | — | **16.447**, todos verdes |
| portões | — | **34 de 35** |
| commits | — | **215** |

**O único portão vermelho é `cor-vem-do-aparelho`, e é por decisão dela.** A
razão está escrita ao lado da linha dele no `portoes.sh`: ele mede a página
PUBLICADA, a bancada está em zero, e publicar é ato dela — *"deixa para o fim,
depois do install"*.

---

## §7 — O PADRÃO QUE ATRAVESSA O DIA INTEIRO

Cinco workflows, **49 agentes, zero erros**. E um padrão em quase toda cura:

> **Quando um valor tem dono, a régua PERGUNTA ao dono. Digitá-lo faz a régua
> envelhecer no dia em que o dono mudar — e envelhecer calada, dando verde, ou
> barulhenta, reprovando quem acertou.**

Quatro réguas caíram nisso hoje, e duas foram derrubadas pela minha própria
cura do rodapé. Agora perguntam a `pacotes.topo()`, a `endereco_do_anel(n)`, a
`ALVO_DO_PLASTICO`, a `gerar_cores_do_dualsense.legivel`.

**O caso mais caro foi o inverso:** a régua da aba 05 aferia o DADO (`-crua`, o
CSV intocado) e nunca a TINTA (a variável que chega ao pixel). Um auditor trocou
as nove variáveis que pintam do Nova Pink por verde-limão e ela deu **13
verdes**, com o controle inteiro verde fluorescente na tela.

---

## §8 — O QUE FALTA, E O QUE ESPERA A PALAVRA DELA

**A fila imediata:**

1. **Clicar as nove abas restantes como usuária**, no produto instalado — em
   curso. A aba 01 já acusou **5 gestos que dizem "aplicado" e não mudam nada**
   e 2 sem dono.
2. **Publicar as dez** — o último gesto, por decisão dela. Fecha 183 endereços e
   os 358 pontos de cor cravada de uma vez.

**O que espera a palavra dela:**

1. **A numeração "N/11"** num install de quarenta passos. Renumerar toca dezenas
   de réguas que ancoram nesses rótulos.
2. **`--no-udev` deveria gatear também o `--with-usb-quirk`?** Os dois escrevem
   o mesmo token no bootloader, e só um obedece à flag.
3. **Os dois portões que pedem o Google Chrome** — cair para `chromium`.
4. **`entrada.stick.calibracao@dualsense`:** ler o finetune de fábrica é inócuo;
   ESCREVER é da mesma família `0x80` em que `(1,1)` reseta o controle e
   `(12,1)` grava na NVS. **Decisão dela, não de agente.**
5. **`luz.recursos_proprios@dualsense`:** partir a linha em duas chaves.
6. **A dica da aba Vibração** — frase honesta, ou implementação por controle?
7. **`ControllerMicOverride.volume`:** a costura do applier foi feita hoje;
   abrir o campo muda o que o perfil dela aceita no disco, e há teste que
   reprova no dia em que alguém o abrir, para que esse dia seja deliberado.

**Dívida técnica nomeada e não paga:** o mecanismo das 28 cores tem **cinco
cópias** (`aba01`, `aba04`, `aba05`, `aba06`, `aba08`), com cinco expressões
regulares diferentes para a MESMA âncora e semânticas divergentes. O agente que
a achou foi autorizado a criar o dono em `monta.py` e **não o fez**, com razão:
migrar só a dele deixaria quatro cópias vivas e poria `monta.py` em rota de
conflito com quatro frentes em voo. Pede leva própria.

---

## §9 — DUAS COISAS QUE FICARAM SÓ NESTA CONVERSA

Nenhuma delas está em arquivo versionado — conferido com `git grep`. Mas as duas
estão no registro do dia, e a próxima pessoa deve saber:

* **a senha de root dela**, que ela colou para eu poder instalar de longe;
* **o número de série do DualSense**, que apareceu numa leitura de
  `daemon.state_full`.

A senha vale trocar. O serial é identidade de aparelho, como o MAC.

**ELA RESPONDEU — *"sim, faz o portão pro número de série"* — E A RESPOSTA
DERRUBOU A PERGUNTA.** Esta seção dizia que `test_docs_mac_anonimato.py` *"não o
cobre, porque a lista dela é de OUIs"*. **Está errado, e o erro foi medido ao
escrever o portão novo:** o mesmo arquivo traz
`test_nenhum_serial_de_fabrica_real_no_repo` desde 15/08/2026, e ele acusou o
valor forjado que o portão novo tinha acabado de criar. Ele é o AUTORITATIVO —
mede a forma exata de um DualSense em texto, em hexdump com o serial
atravessando a quebra de linha, e em corrida hexadecimal colada.

**O QUE FALTAVA NÃO ERA A RÉGUA, ERA A CAMADA.** Aquele teste é da SUÍTE, e a
suíte roda no FIM — a mesma forma que deixou os 37 endereços de rádio crus
passarem esta manhã. Então nasceu `scripts/check_numero_de_serie.py`:

| | forma | alcance | custo | quando roda |
| --- | --- | --- | --- | --- |
| autoritativo (`mac-por-oui`) | exata do DualSense | texto · hexdump · hex colado | ~12 s | fim da suíte |
| novo (`serial-de-aparelho`) | 15 a 20 caracteres | texto | 1,2 s | **antes do commit** |

A largura também importa: 15 a 20 alcança serial de 8BitDo e de Pro Controller,
que a forma de dezessete não vê. Mede por FORMA e nunca por lista — listar os
seriais reais seria o vazamento que ele existe para impedir. Isenta-se com
`serial-de-mentira` na MESMA linha, com a razão.

---

## §10 — A LEVA DAS NOVE ABAS, e a única `quebra` do dia

Nove agentes clicaram nove abas no produto INSTALADO, com o daemon dela vivo e
um DualSense White no cabo. Zero conflito de código entre as nove; um só conflito
de merge, e ele foi **as duas frentes acrescentando entradas diferentes à mesma
lista `PERIGOSOS`** — resolvido mantendo as duas.

**A ÚNICA QUEBRA, e ela apagava dado dela:**

O cartão de um controle que CHEGA nunca reabria. O piloto tinha o passo que
FECHA o cartão de um lugar sem dono e **não tinha o simétrico** — no fonte
inteiro, `classList.add('off')` uma vez, `remove` zero. Bastava um controle sair
e voltar, ou ligar o segundo com a aba já aberta: o cabeçalho passava a contar
`2 controles`, o pacote mandava a coluna inteira com bateria, cor e luz, e o
cartão ficava em **24 px contra os 34 de um cartão aberto**. Só recarregar a
página desfazia. O P3 e o P4 escapavam porque nascem com a marca cravada no HTML
(decisão dela de 31/08): o defeito só alcança quem esvazia em execução.

A régua nova **roda o JS no `node`** contra um DOM de mentira, em vez de ler o
texto do piloto — pela razão da §7: um `grep` por `remove('off')` daria verde no
dia em que alguém escrevesse a linha dentro de um `if` que nunca corre. E
`scripts/ensaios/o_cartao_reabre_no_webkit.py` prova no `WebKit2.WebView` que ela
usa, com a folha real: `34 -> 24 -> 34`.

**AS OITO QUE ENGANAM,** uma por aba:

| aba | o que a tela afirmava |
| --- | --- |
| 02 Controles | assento VAZIO com barra de bateria pintada a **64%** e os chips Giroscópio/Acelerômetro no verde de conectado |
| 03 Gatilhos | "Guardar esse efeito" **reacendia a barra de luz que ela apagou** — o gesto reaplicava o perfil INTEIRO |
| 04 Iluminação | três botões prometiam "Player 3 — livre" num número que o produto RECUSA; e a coluna que esvazia ficava meio acesa, com dez cliques que engoliam o toque |
| 05 Vibração | **138.804 px²** — perto de um quarto do miolo — em quatro alvos cujo clique não respondia a ninguém |
| 06 Navegação | o lugar VAZIO era o mais colorido da fileira: Starlight Blue do mockup e lightbar `#ff0000` |
| 07 Lançadores | o "?" contava **2 controles** a dois centímetros de um cabeçalho que dizia **1** — o número vinha da mesa do DESENHO |
| 08 Conexões | a régua da casa **dispensava uma ordem de serviço dela a cada volta**, e o Check-up perdia uma das duas linhas que acusam nesta máquina |
| 09 Sistema | cinco das seis linhas do exame cortadas em reticências, e a metade escondida era a resposta: *"…estão liberados. O que fazer: nada"* virava *"o mic e o fone do controle…"* ao lado de um selo NOTA |
| 10 Perfis | o `<select>` de Estilo de Jogo — o campo mais aceso do painel — aceitava a escolha e **não gravava nada**; e nove recusas desta aba saíam no terminal, nunca na tela |

**O PADRÃO DAS NOVE É UM SÓ, e é o da §7 com outro nome:** *a tela afirma o que
o desenho trouxe, e o produto não tem por onde desdizer*. Seis das nove são o
MOCKUP vazando para dentro do produto — o número, a cor, a barra, o chip.

**DOIS ACHADOS SOBRE AS PRÓPRIAS RÉGUAS,** e valem mais que as curas:

* a régua da aba 07 passou **verde sobre uma página envenenada**: o `re.search`
  casava o PRIMEIRO `<span class="ajuda">` do arquivo, que é o do topo. *Seletor
  que casa o elemento errado dá não-achado convincente.*
* `test_a_dica_nao_nomeia_controle_que_nao_esta_na_mesa` **exigia** `count("—
  livre.") == 3` com um controle na mesa: era a régua que SUSTENTAVA o defeito.

---

## §11 — A TARDE: A PARIDADE COM A JANELA ANTIGA, DE 14% A 25%

Dez frentes em paralelo, uma por aba, **arquivos exclusivos e zero respingo** —
a fusão conferiu linha a linha que nenhuma escreveu na aba de outra. Mais quatro
CONFERENTES ADVERSÁRIOS nas quatro piores abas.

| aba | antes | depois | | aba | antes | depois |
| --- | ---: | ---: | --- | --- | ---: | ---: |
| 03-gatilhos | 32% | **48%** | | 05-vibracao | 19% | **32%** |
| 06-navegacao | 8% | **30%** | | 07-lancadores | 13% | **27%** |
| 09-sistema | 8% | **26%** | | 10-perfis | 16% | **26%** |
| 02-controles | 8% | **22%** | | 04-iluminacao | 14% | **20%** |
| 01-jogar | 12% | **17%** | | 08-conexoes | 12% | 14% |

**TODAS: 54 → 100 features IGUAL de 396.**

### O CSV É FUNDIDO POR `(aba, feature)`, NÃO POR LINHA

`git merge` conflita porque dez frentes tocam o mesmo arquivo; o DADO não tem
conflito nenhum quando cada uma mexe só na sua aba. E a tabela do documento é
**regerada da contagem**, nunca digitada — o portão `numero-publicado` reprova
quem esquecer.

### OS CONFERENTES PAGARAM POR SI, e um derrubou uma entrega

**A 09-sistema não fechou oito features.** O conferente provou com `git log -S`
que as cinco emissões que as sustentam nasceram em `d7955862`, de OUTRA frente,
já ancestral do pai. O que ela entregou foi uma AUDITORIA — legítima e
necessária —, mas somá-la ao relatório daquele commit contaria as mesmas oito
duas vezes. Três células dela foram corrigidas:

1. **uma afirmação que a régua não sustenta** — o CSV dizia *"a régua prova que
   a pergunta de 7 s NUNCA roda dentro do tique"*; ele trocou a thread por
   chamada direta e **19 testes ficaram verdes**. Nenhum mede o relógio;
2. **"Estado do serviço" rebaixado de IGUAL para DIFERENTE** — a classe é órfã
   e a DICA vem cravada do desenho (`title="Ligado"`), e ela não é detalhe: o
   valor sai TRUNCADO na tela, então a dica é a única maneira de ler a frase;
3. **uma contradição dentro de uma célula só** — o `html_faz` dizia *"não há
   primitiva de confirmação"* e o `porque` da MESMA linha provava o contrário.

---

## §12 — A FORMA QUE ESTE DIA REPETIU SEIS VEZES: *a régua DIGITA*

É o padrão da §7 com outro nome, e ele apareceu em toda parte:

| onde | o que digitava | contra o quê reprovou |
| --- | --- | --- |
| `test_o_piloto_ainda_chama_a_conta_do_despachante` | a assinatura inteira | a cura QUEM-TEM-DONO-01, do mesmo dia |
| a guarda de vacuidade do travessão | `04-iluminacao·troca.item` | o endereço que GANHOU outro alvo |
| `DO_CABECALHO` da 03 | quatro nomes | `rodape.salvar` e `rodape.exportar` |
| a régua do dublê da 06 | `== 38`, `== 38`, `== 14` | a página que CRESCEU |
| a âncora do `<svg data-colorway=` | a POSIÇÃO do atributo | outra frente que inseriu três antes |
| `test_o_override_e_subconjunto_estrito` | `== {"muted"}` | o `volume` que ELA mandou abrir |

**Todas viraram leitura:** `topo()`, `monta.fita()`, `PACOTES` e `mascaras_validas()`
perguntados; comparação de CONJUNTOS em vez de contagem; PISO em vez de
igualdade; `ast` em vez de literal; âncora sem posição.

**A regra que sobra:** *um número, uma lista ou uma assinatura digitados sobre
algo que outra pessoa gera é uma segunda verdade — e ela sempre perde. Pergunte
ao dono.*

---

## §13 — A MÁSCARA POR CONTROLE FECHOU, e faltavam DOIS degraus, não quatro

Eu estimei quatro camadas novas. Errado: `external_mask` guarda a escolha por
APARELHO desde **15/08/2026** (decisão dela, MÁSCARA-POR-JOGADOR-01), e
`mascara_efetiva` já era consultada na criação de todo vpad — os três degraus do
daemon fecharam em 29/08. Faltavam a **escrita** (`set_mask` existia sem UM
chamador; nasceu `gamepad.mask.set`) e a **tela** (`mesa_viva` lia o flavor da
SESSÃO e repetia nos quatro cartões).

    sem escolha           A -> xbox        B -> xbox
    A escolhe DualSense   A -> dualsense   B -> xbox
    a sessão vira DS      A -> dualsense   B -> dualsense
    A limpa               A -> xbox

E os chips chegaram aos quatro cartões: **6 → 12**, publicados por
`--publicar-enderecos`, que RECUSOU três das quatro páginas — só passa o que não
muda um pixel.

---

## §14 — A LISTA DELA

Os trinta pontos que as dez frentes não podiam decidir viraram DEZ perguntas
fechadas em
**[2026-09-03-A-LISTA-DELA-o-que-espera-a-palavra-dela.md](2026-09-03-A-LISTA-DELA-o-que-espera-a-palavra-dela.md)**.
A regra que criou o arquivo é dela: *"fila combinada com ela vira arquivo no
mesmo dia"*.

A primeira destrava mais que as outras: **o trilho de brilho** é desenhado como
slider, tem um knob de 12px e **não faz nada** — e a pergunta é se mexer nele
grava o perfil na hora ou espera o Salvar, porque a interface nova não tem
rascunho (decisão dela de 01/09).
