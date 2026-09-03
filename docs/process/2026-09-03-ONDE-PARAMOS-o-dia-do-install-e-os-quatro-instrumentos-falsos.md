# 03/09/2026 — o dia do install, e os quatro instrumentos que mentiam

**Leia a §1 antes de rodar qualquer comando.** Ela tem as três armadilhas que
comeram trabalho hoje, e a primeira come trabalho que está no *stage*.

**O que este dia entregou, em uma linha:** o produto foi INSTALADO de verdade
(`rc=0`, três módulos DKMS, daemon reiniciado), a suíte fechou VERDE nos oito
lotes (16.447 testes), e **quatro instrumentos que davam verde sobre nada**
foram achados e curados — um deles por ELA, lendo a saída do install.

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

**O caso mais caro foi o inverso:** a régua da aba 05 media o DADO (`-crua`, o
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

A senha vale trocar. O serial é identidade de aparelho, como o MAC — e a régua
`test_docs_mac_anonimato.py` **não o cobre**, porque a lista dela é de OUIs.
Fica como pergunta aberta: vale um portão para número de série?
