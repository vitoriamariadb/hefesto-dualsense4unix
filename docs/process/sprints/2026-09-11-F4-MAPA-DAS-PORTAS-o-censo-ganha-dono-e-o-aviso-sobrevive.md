---
sprint: F4-MAPA-DAS-PORTAS
estado: feita
onda: A-FILA-DE-0911
posse:
  ESCREVE:
    - src/hefesto_dualsense4unix/interface/pagina_do_mapa.py
    - src/hefesto_dualsense4unix/interface/arranjo_desta_maquina.py
    - src/hefesto_dualsense4unix/interface/paginas/mapa-das-portas.html
    - mockup/mapa-das-portas.html
    - src/hefesto_dualsense4unix/interface/olhar.py
    - tests/unit/test_o_mapa_das_portas_mostra_o_gabinete_de_quem_abre.py
    - tests/unit/test_arranjo_invariantes.py
    - docs/process/sprints/2026-09-11-F4-MAPA-DAS-PORTAS-o-censo-ganha-dono-e-o-aviso-sobrevive.md
  TOCA:
    - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
cria:
  - src/hefesto_dualsense4unix/interface/pagina_do_mapa.py
  - src/hefesto_dualsense4unix/interface/arranjo_desta_maquina.py
  - tests/unit/test_o_mapa_das_portas_mostra_o_gabinete_de_quem_abre.py
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/interface/aba06.py
  - src/hefesto_dualsense4unix/interface/aba10.py
  - src/hefesto_dualsense4unix/interface/calibrar.py
  - src/hefesto_dualsense4unix/interface/pacotes/
  - src/hefesto_dualsense4unix/app/widgets/calibrar_entradas.py
  - docs/process/sprints/2026-08-24-ABA-CONEXOES/
---

# F4 — O MAPA DAS PORTAS: o censo ganha dono e o aviso sobrevive à folha

**11/09/2026.** O §2 da
[FILA QUE A ONDA ABRIU](2026-09-11-A-FILA-QUE-A-ONDA-ABRIU-INDICE.md), que ela
enfileirou com um *"Ok isso tambem. mas precisa ta na linha"*.  <!-- noqa-acento: citação literal dela -->

## §0 — O defeito, em uma linha

`mapa-das-portas.html` dizia **"o arranjo de agora"** sobre um censo de
**24/08/2026 cravado em JavaScript** — oito aparelhos, três faces, um mapa e
duas leituras digitados dentro do HTML, todos de UM gabinete. A única defesa da
página era `<p class="nota">mockup · 24/08/2026</p>`, e a primeira regra de
`folha_da_casa.FOLHA_DA_CASA` é `.nota{display:none !important}`: **no Chrome o
aviso aparecia; na tela dela, não.**

A ordem dela que decide tudo aqui é de 11/09:

> *"a ideia é que todas as features mesmo do app funcionem nao so pra mim mas  <!-- noqa-acento: citação literal dela -->
> pra qualquer outro user"*

## §1 — O que a página mostra agora

| antes | agora |
| --- | --- |
| um gabinete digitado no HTML, apresentado como o de quem abre | o gabinete de **quem abriu**, quando há o que desenhar; o exemplo quando não há |
| `<p class="nota">` — apagada pelo produto | `<p class="quando" id="de-quando">` — a folha do produto não esconde, **conferido na tela renderizada** |
| HTML escrito à mão, já divergido treze vezes da origem congelada | gerado por `interface/pagina_do_mapa.py` |
| o rodapé listava `3-1.2`, `4-1`, `1-3` como "medido nesta máquina" | o rodapé explica o que se mede e o que se declara, sem número de gabinete nenhum |

**AS TRÊS PEÇAS:**

* **`interface/pagina_do_mapa.py`** — o gerador. Ele **lê a origem congelada** e
  aplica **27 `EDICOES`**, cada uma com data e motivo. O censo de exemplo sai do
  JavaScript e vira `CENSO_DE_EXEMPLO`, com dono único; `CORES_POR_CLASSE` é
  DERIVADA dele, nunca uma segunda tabela;
* **`interface/arranjo_desta_maquina.py`** — o produtor. Junta o que a pessoa
  declarou (`utils/maquina.MapaDaMesa`) ao que o kernel leu
  (`censo_do_barramento`) por `mapa_das_portas.mesa_do_motor`, e traduz para os
  nomes que o JavaScript lê;
* **`window.hefestoArranjo(dado)`** — a porta. O piloto a chama em
  `_instalado`, quando a página à vista é esta.

## §2 — Por que o gerador NASCE da origem congelada

A origem (`docs/process/sprints/2026-08-24-ABA-CONEXOES/mockup/mapa-das-portas.html`)
não é rascunho: o `fumaca.js` **extrai o `<script>` dela**, roda 120 cenários em
`node`, e o JSON que sai é o ouro contra o qual o porte em Python é medido.
Reescrevê-la reescreveria a prova de equivalência.

Derivar dali torna a equivalência do motor **estrutural em vez de declarada**: o
que o produto renderiza É o motor da origem mais um conjunto de mudanças
nomeadas. Não há como as duas casas divergirem em silêncio, porque só existe
uma — a outra é calculada.

## §3 — O vermelho, e por que a escolha foi esta

`test_as_duas_casas_versionadas_do_mockup_nao_andam_sozinhas` chegou VERMELHO
nesta árvore. Ele exigia igualdade byte a byte entre a origem e o produto,
descontando uma lista de divergências declaradas — e a lista tinha **um teto
estrutural: quem escrevia na página tinha de escrever na lista também, e as duas
escritas moram em arquivos diferentes.** A onda da língua reescreveu nove frases
da página por aprovação dela, e o arquivo ficou vermelho sozinho: **treze pedaços
divergindo, e uma lista que falava de outros onze.**

**A SAÍDA ESCOLHIDA foi a segunda das três que a casa reconhece: a página do
produto passou a NASCER de um gerador.** A régua não guarda mais lista própria —
ela **roda `pagina_do_mapa.pagina()` e compara**. As outras duas saídas foram
recusadas com razão:

* *declarar cada divergência com data e motivo* — é o que já existia, e é o que
  acabou de falhar. Declarar as treze de hoje deixaria a décima quarta para a
  próxima pessoa esquecer;
* *afrouxar a régua para medir só o motor* — a comparação de texto tem valor: ela
  é o que impede uma edição de mexer na prosa e na regra ao mesmo tempo. O que
  faltava não era menos medição, era um dono para a escrita.

**O QUE NÃO SE PERDEU, e é o ponto:** a promessa antiga — *"fora do que está
declarado, as duas casas são idênticas"* — continua valendo palavra por palavra.
Agora ela é CONSTRUÍDA em vez de conferida.

**As quatro réguas que ficam no lugar de uma:**

| régua | o que ela mede |
| --- | --- |
| `test_as_duas_casas_versionadas_do_mockup_nao_andam_sozinhas` | as duas casas são o que o gerador escreve — byte a byte |
| `test_toda_edicao_do_gerador_acha_o_seu_alvo_uma_vez` | cada `antes` uma vez na origem, cada `depois` uma vez no produto, e cada `porque` com DATA |
| `test_nenhuma_edicao_mexe_nos_pesos_do_motor` | os pesos das regras são os mesmos nos dois — uma edição pode trocar uma frase sem mexer em nada e trocar um `n: 100` por `n: 10` sem mudar uma palavra da tela |
| `test_a_palavra_que_ela_baniu_nao_esta_na_tela_do_mapa` | a palavra saiu da TELA, medida no texto visível pelo dono da folha |

A quarta substitui `test_nenhuma_troca_de_palavra_e_porta_dos_fundos`, que
conferia uma LISTA DE PARES e morreu quando as frases inteiras foram reescritas:
os pares passaram a descrever texto que não existia mais. **Medir o RESULTADO não
envelhece.**

## §4 — A mordida, conferida

| o que se arrancou | quem reprovou |
| --- | --- |
| uma letra a mais no HTML, à mão | igualdade + `toda_edicao...` |
| `{ n: 100 }` → `{ n: 10 }` no produto | igualdade + `nenhuma_edicao_mexe_nos_pesos` |
| a palavra banida de volta no `<h1>` | igualdade + `toda_edicao...` + `a_palavra_que_ela_baniu...` |
| **a data de volta em `class="nota"`** — o defeito original | `o_cabecalho_diz_de_quando...`, que PERGUNTA ao dono da folha o que o produto esconde |
| um campo do produtor renomeado (`faces` → `caras`) | `o_arranjo_traz_tudo_o_que_a_pagina_le_e_nada_alem` |
| a entrada esticada sem `cabo` | `a_entrada_esticada_leva_o_cabo_que_o_desenho_escreve` — sem ele o desenho escreve `undefined` |
| cada uma das 27 edições, arrancada em laço | `a_regua_da_igualdade_sabe_recusar` — edição que não muda nada é perdão morto |
| uma edição cujo `antes` não está na origem | `SystemExit` do próprio gerador, nomeando qual |

## §5 — O que foi MEDIDO sobre o censo vivo, e o que ele faz hoje

**`arranjo()` devolve `None` na máquina dela agora**, e o número é medido: o
`maquina.json` tem **0 faces e 0 entradas declaradas**. O produto tem os seis
gestos que as declaram (a aba `08`, `LogicaDoMapa`), e enquanto ninguém declarar
não há gabinete a desenhar — o número da entrada no metal não sai de leitura
nenhuma. **A página então mostra o exemplo e o cabeçalho diz que é exemplo, com
a data.** É a saída honesta, não um contorno.

**A cadeia inteira foi exercitada com o barramento REAL desta máquina**: um mapa
de faces montado para a prova mais `ler_o_barramento()` produziram um arranjo com
**11 aparelhos**, seus caminhos de barramento e o juízo do motor (*"7 coisas para
mudar de lugar"*, com o teclado num hub marcado `mudar daqui`). O PNG está na §7.

**O que o censo vivo NÃO traz, de propósito:** a fileira de controles. Ela é
SIMULADOR — os botões `1 2 3 4` ao lado dela são a pergunta *"e se fossem
quatro?"* —, e o `controlesSobre` a espalha pelos adaptadores que a máquina de
quem abre tiver.

## §6 — Duas coisas que esta frente achou de lado

**1. O RETRATISTA DA CASA NÃO ENXERGAVA ESTA PÁGINA.** `olhar.py` nomeia as três
avulsas no próprio comentário (`mapa-do-controle`, `calibrar-sensores`,
`mapa-das-portas`) e conhecia **duas molduras**: `.janela` e `.cx`. Esta mora
numa `.pagina`, e `olhar.py mapa-das-portas.html --publicado` recusava com *"nem
.janela nem .cx nesta página"*. O comentário afirmava que as avulsas eram duas —
fato errado, substituído.

**2. UMA LINHA NO BLOCO DE IMPORTS DO PILOTO DERRUBOU SETE ENDEREÇOS.** A
primeira escrita importava `arranjo_desta_maquina` no topo de `hefesto_vivo.py`.
Uma linha a mais lá empurra as 3.500 abaixo, e o portão `citacoes-no-codigo`
acusou **7 endereços envelhecidos** — quatro deles em arquivos que esta frente
**não pode tocar** (`aba06.py`, `a06_navegacao.py`, `a10_perfis.py`,
`rodape.py`). A cura não foi reapontar citação de outra posse: foi **não mover
linha nenhuma** — o import desceu para dentro do método, com a razão escrita ao
lado. É a mesma decisão que o `SEGUNDOS_ENTRE_LEITURAS_DOS_EXTERNOS` já
registrava no mesmo arquivo.

## §7 — A prova

* **58 portões verdes** (`git add -A && bash scripts/portoes.sh`);
* **382 testes** nos lotes desta posse, verdes;
* fotos, com a folha do produto aplicada (`seletores_escondidos()`, o dono):
  * `01-ANTES-produto.png` — a página antes desta frente;
  * `04-DEPOIS-produto-exemplo.png` — o exemplo, com o aviso VISÍVEL;
  * `05-DEPOIS-produto-censo-real.png` — **o barramento real desta máquina
    desenhado pela página**, cabeçalho dizendo *"leitura deste computador ·
    11/09/2026 22h43"*;
  * `06-retratista-da-casa.png` — `olhar.py mapa-das-portas.html --publicado`,
    que passou a funcionar nesta sprint.

## §8 — O que fica para depois, e é dela

O gabinete só se desenha depois de a pessoa declarar as faces. Hoje isso se faz
na aba `08`, gesto a gesto. **Quantas faces e entradas o produto deve sugerir
sozinho — e se deve — é decisão dela**, e esta frente não a tomou: sugerir uma
traseira de seis entradas para quem tem outra placa seria exatamente o gabinete
inventado que esta sprint tirou do caminho.
