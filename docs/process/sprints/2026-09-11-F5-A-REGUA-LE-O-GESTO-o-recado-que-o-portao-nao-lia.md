---
sprint: F5-A-REGUA-LE-O-GESTO
estado: feita
onda: A-FILA-DE-0911
posse:
  ESCREVE:
    - scripts/check_a_tela_nao_confessa.py
    - tests/unit/test_a_tela_nao_confessa_divida_nossa.py
    - tests/unit/test_a_palavra_mesa_nao_chega_a_tela.py
    - src/hefesto_dualsense4unix/interface/frases_que_ela_baniu.py
    - docs/A-LINGUA-DESTA-CASA-o-glossario-que-a-tela-e-o-codigo-falam.md
    - assets/hefesto-steam-input-guard.service
    - assets/systemd/hefesto-hidraw-broker.service
    - docs/process/sprints/2026-09-11-F5-A-REGUA-LE-O-GESTO-o-recado-que-o-portao-nao-lia.md
cria: []
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/interface/aba01.py
  - src/hefesto_dualsense4unix/interface/aba06.py
  - src/hefesto_dualsense4unix/interface/aba07.py
  - src/hefesto_dualsense4unix/interface/aba09.py
  - src/hefesto_dualsense4unix/interface/pacotes/
---

# F5 — A RÉGUA LÊ O GESTO: o recado que o portão não lia

**11/09/2026.** O §3 da
[FILA QUE A ONDA ABRIU](2026-09-11-A-FILA-QUE-A-ONDA-ABRIU-INDICE.md), que ela
enfileirou com um *"ok"*.

## §0 — O NÚMERO, antes e depois

| | antes | depois |
| --- | --- | --- |
| recados de gesto lidos | **0** | **195** |
| montados por inteiro | — | 82 |
| montados com buraco (um valor de execução no meio) | — | 95 |
| sem uma letra de prosa, **declarados com o dono** | — | 18 |
| confissões achadas no canal novo | — | **28 recados · 32 trechos** |
| palavras que o produto recusa na tela | **3** | **13** |
| portões | 58 verdes | 58 verdes |

## §1 — O DEFEITO, e por que três agentes o acharam sozinhos

`scripts/check_a_tela_nao_confessa.py` garante a decisão dela de 07/09 — *a tela
nunca confessa dívida nossa*. Ele lia **as páginas** (`mockup/` e
`interface/paginas/`) e **toda `Fala(texto=…)`** de `src/`.

O recado que POUSA no cartão dela chega por um terceiro caminho, e ele não é
nenhum dos dois: **`raise RuntimeError` dentro do gesto**. O contrato do piloto
é explícito — `hefesto_vivo._recusou_dizendo` faz `str(erro)` e deposita a
frase na coluna em que ela clicou, laranja, por 30 segundos. A string nasce
montada em execução: f-string, soma, uma constante do módulo vizinho.

**LINGUA-A2, A4 e A5 acharam isto separados, cada um na sua aba, sem se
falarem.** A mordida de quem achou foi chamar o casador do portão com as frases
dos gestos: elas CASAM. *Ele não falhava em reconhecer — ele não olhava ali.*

## §2 — O QUE O PORTÃO PASSOU A FAZER

**1. Ele monta a frase do fonte.** Reconstrução estática por AST — importar o
pacote pediria GTK, daemon e perfil da casa. Ela segue constante de módulo,
f-string, soma, `or`, ternário, `str(x)`, import relativo e import feito DENTRO
da função; e **pergunta ao dono**: `raise RuntimeError(sem_resposta_do_daemon())`
não é frase ilegível, é frase que mora uma porta adiante, e a régua entra na
função e lê os `return` dela.

**2. Onde um pedaço só existe rodando, fica um buraco — e ele não é enfeite.**
`VALOR_DE_EXECUCAO` (`‹…›`) tem letras que não casam com `\s+`, então a peneira
**não consegue atravessar**: `f"ainda {quantos} não chegaram"` não vira
confissão por acidente. Uma régua que inventa acusação esvazia a tabela tão
depressa quanto uma que cala. Há mordida para isso.

**3. O que ele não alcança, ele DIZ.** A terceira tabela, `SEM_LETRA`, tem 18
linhas — cada uma é `arquivo.py:gesto ← expressão` com **o dono da frase
escrito**. Quatorze são a resposta do daemon repassada tal como veio; três moram
em `app/actions/*`; uma sai de um dicionário pela chave do clique. **A chave não
leva número de linha de propósito:** uma declaração presa a uma linha envelhece
na primeira edição acima dela. A checagem vale **nos dois sentidos**, como as
outras duas tabelas.

## §3 — AS 32 CONFISSÕES, classificadas uma a uma

**FATOS ganhou 15 chaves** (25 no total). A pergunta é a mesma de sempre — *de
quem é o sujeito?* — e a maioria é **estado do ato que acabou de acontecer**
(*o Hefesto não respondeu — o teclado ficou como estava*), **limite da
instalação** (*o Hefesto instalado é mais velho que esta janela*) ou **limite do
aparelho** (*este controle não tem endereço fixo*).

**A_DIVIDA voltou a ter linha, e nenhuma delas é dívida nova.** As quatro estão
na tela desde antes de hoje; o que mudou é que a régua passou a ler o canal por
onde chegam. Os quatro arquivos são de outras frentes agora (as 352 mudanças de
texto dela), e reescrever a frase de quem está com o arquivo na mão é como se
perde trabalho de duas pessoas.

| onde | a confissão |
| --- | --- |
| `pacotes/a01_jogar.py` | *«X» está desenhado na tela e o Hefesto não sabe montar essa máscara* — a tela OFERECE o que o produto não constrói |
| `pacotes/a06_navegacao.py` | *«Só dentro do jogo» ainda não tem dono … e ele ainda não existe* — a lista oferece uma opção que o perfil não sustenta |
| `pacotes/a07_lancadores.py` | *Ainda não sei abrir o X. O Hefesto só sabe abrir a Steam por enquanto* — o «por enquanto» é a promessa que a ordem dela proíbe |
| `pacotes/a04_iluminacao.py` | *(o desenho foi para N controles e a frase do produto não disse isso)* — um laudo NOSSO pousando no cartão dela |

## §4 — AS ONZE DO GLOSSÁRIO, e o dono da lista

`PALAVRAS_BANIDAS` tinha **três** palavras enquanto o glossário proibia **onze**,
e só a de língua (*mesa*) tinha régua. Foi por essa fresta que `uinput` chegou à
dica da Navegação e ficou.

**Agora o DONO é o glossário.** A linha `**Proibido em texto de tela:**` de
`docs/A-LINGUA-DESTA-CASA…` é lida, e
`tests/unit/test_a_palavra_mesa_nao_chega_a_tela.py` mede as duas listas **nos
dois sentidos**: palavra no glossário e ausente da tupla reprova; palavra na
tupla que o glossário não nomeia reprova também — porque quem for reescrever o
texto precisa achar o porquê onde a casa combinou escrever.

A tupla do módulo continua existindo, e a razão é o produto instalado: **o pacote
não leva `docs/` junto**, e um módulo que lesse o arquivo em execução quebraria
na máquina dela. Ela é cópia com régua, não segunda fonte.

`reconciliad` e `compactada` (decisão dela, 09/09, JOGAR-02 §5) subiram para o
glossário, que passou a ser a lista inteira: **treze**.

## §5 — O QUE A LISTA NOVA ACENDEU

**DOIS DEFEITOS VIVOS, curados aqui** — e os dois em `assets/`, que é texto que
QUALQUER pessoa lê num `systemctl --user status`:

| arquivo | dizia | diz |
| --- | --- | --- |
| `assets/hefesto-steam-input-guard.service` | *desfaz o que a Steam reescreve no localconfig.vdf (Steam Input OFF, e o wrapper hefesto-launch)* | *devolve a configuração que a Steam reescreve (Steam Input desligado, e o atalho de inicialização de volta)* |
| `assets/systemd/hefesto-hidraw-broker.service` | *broker root que esconde o hidraw do DualSense físico do jogo (BROKER-01)* | *esconde o DualSense físico do jogo, que passa a ver só o controle entregue pelo Hefesto* |

Ela, hoje:

> *"a ideia é que todas as features mesmo do app funcionem nao so pra mim mas pra qualquer outro user"*  <!-- noqa-acento: citação literal dela -->

A descrição de uma unit é exatamente isso: a primeira frase que a próxima pessoa
lê do produto, e ela estava em língua de dentro.

**SEIS OCORRÊNCIAS FICARAM, e a razão é de processo, não de mérito.** Todas
moram em arquivos que seis outras frentes estão editando NESTE momento (as 352
mudanças de texto dela), e a ordem de quem coordena é não tocá-los. Elas estão
em §6, com endereço e cura.

## §6 — O QUE FICA PARA A COSTURA

Três testes de `tests/unit/test_a_palavra_mesa_nao_chega_a_tela.py` reprovam
**só** por causa destes seis. Nenhum portão do `portoes.sh` reprova — os 58
fecham verdes.

**As duas que a JANELA MOSTRA** (a cura é reescrever o texto):

| gerador | a frase |
| --- | --- |
| `interface/aba06.py:2659` | a dica do Modo: *"Precisa de **uinput** e de uma regra **udev**"* — **é o caso que o §3 da FILA nomeia** |
| `interface/aba09.py:1307` | o registro de exemplo: *"daemon pronto · N controles · N gamepads virtuais · uinput ok"* |

**As três da `.nota`** (bilhete de projeto; o produto o esconde, a bancada não).
**A cura é de uma tecla:** o termo dentro de `<code>…</code>`, que a régua já
isenta como identificador — é o que o glossário manda, e é o que impede a
armadilha de sempre, *o texto que explica a palavra proibida virar a primeira
ocorrência dela*:

| gerador | o termo |
| --- | --- |
| `interface/aba01.py:1976` | `MAC` — *"o registro por MAC e a herança existem"* |
| `interface/aba07.py:560` | `uinput` — *"A antiga era «Emulação» de gamepad (uinput)"* |
| `interface/aba07.py:568` | `MAC` — *"nenhuma função … recebe controle, MAC, device ou transporte"* |
| `interface/aba09.py:1384` | `uinput` — *"(Gamepad virtual (uinput), Nó do gamepad virtual, …)"* |

**E UMA QUE É PROSA MORTA:** `pacotes/a01_jogar.py:2050`,
`_MASCARA_SAIU_DOS_SEM_DONO` — uma constante de string **que ninguém chama**
(`grep` em `src/` e `tests/`: uma ocorrência, a própria atribuição). Ela é um
relato de 04/09 guardado como literal, e por ser literal a régua dos pacotes a
lê como texto de tela. A cura é apagá-la ou virá-la comentário.

## §7 — AS MORDIDAS, e a que reprovou a primeira escrita delas

Cinco, todas conferidas arrancando a cura e vendo a régua reprovar:

1. o `main` deixa de ler os recados → reprova;
2. o buraco vira espaço em branco → a peneira atravessa e inventa confissão → reprova;
3. a régua para de seguir a constante do módulo → a frase vira buraco → reprova;
4. o `main` deixa de cobrar `SEM_LETRA` e as mudas → reprova;
5. `SEM_LETRA` declarando um recado que o fonte não tem → reprova.

**A ARMADILHA DESTE DIA, e ela é de mordida:** a primeira escrita das três
mordidas do `main` cobrava `rc=1` sem calar as outras duas fontes — e **as três
passavam com a cura ARRANCADA**. Ao trocar `_recados` por um dublê, as quinze
linhas de `FATOS` que só existem no canal do recado viravam órfãs, e o `rc=1`
vinha dessa outra peneira. *Três mordidas verdes sobre um portão desligado.*

A cura é a fixture `so_o_terceiro_canal`, que cala `_paginas`, `_falas` e as
três tabelas antes de medir — e cada mordida agora prova as duas metades: o
verde sem o dublê e o vermelho com ele.

**A regra que sobra:** *uma mordida que não isola a peneira que diz medir pode
estar medindo a vizinha.* É a mesma família de
[trava medida contra a própria saída](2026-09-11-A-FILA-QUE-A-ONDA-ABRIU-INDICE.md),
de ontem.
