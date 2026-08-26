# LEVA-2-E — a aba abre com o gabinete desenhado, diz do hub em comum, e abre a calibração

**26/08/2026.** Três costuras num arquivo de tela só, e as três fecham a mesma
classe de defeito: *a casa sabe e o produto não faz*.

## O que mudou

**1. O `gabinete.json` ganhou o consumidor que faltava.**
O `install.sh` grava o censo do gabinete em **toda** instalação
(`install_censo_do_gabinete_host()`, `install.sh:1305`, chamado em `:1878` e
`:2559`) desde 25/08/2026, e nenhuma linha de `app/` o abria — medido antes de
tocar em nada:

```
$ grep -rn 'censo_do_gabinete\|gabinete.json' src/hefesto_dualsense4unix/app/
(zero linhas)
```

A seção "A mesa" agora o lê e publica as contagens. **Quando as fontes divergem
ela mostra a divergência; nunca escolhe** — a BIOS desta placa declara 5
conectores USB onde a traseira entrega 8, o censo já grava `divergem=true` e a
pergunta pronta, e a aba publica **as duas contagens e a pergunta**, esta última
verbatim do censo e marcada `PROVISÓRIO — decisão dela`.

* `integrations/censo_do_gabinete.py` ganhou **dois leitores públicos** —
  `contagens_declaradas()` e `pergunta_pendente()` — para que a aba não precise
  conhecer a forma `{valor, de_onde_sei}`. Repetir a forma do JSON em código de
  tela seria a segunda verdade que o par existe para não deixar acontecer;
* `app/actions/config/secao_mesa.py` ganhou `_linhas_do_gabinete()`, pura e de
  módulo, mais a caixa que a desenha.

**2. O hub em comum virou frase — e conselho só quando há para onde mandar.**
A coluna "Onde está" escrevia `Em hub` **linha a linha**, a partir do
`adaptador.atras_de_hub`, e nunca comparava as linhas entre si.
`censo_do_barramento.hub_em_comum` respondia essa pergunta desde 22/08/2026 e
estava sem chamador de produção.

`_frase_do_hub_em_comum()` devolve três frases — o fato, o porquê, e o conselho.
**A contra-regra R3 da `ORDEM-DE-SERVICO-01` está honrada, e é metade da regra:**
três adaptadores no mesmo hub é o arranjo que o próprio `GUIA-RADIO-DA-SALA.md`
manda comprar, então o fato sozinho não é queixa. O conselho só nasce quando há
buraco livre, alcançável com a mão, numa controladora **diferente** — e nenhuma
das três frases acusa um adaptador de atrapalhar outro (há asserção sobre isso
na mordida).

Quem responde "quais buracos estão vazios e uma pessoa alcança" é
`portas_do_barramento.livres`, que é a dona declarada dessa régua (C5 da
`ORDEM-DE-SERVICO-01`). A seção **não conta buraco nenhum por conta própria**;
ela só filtra por controladora.

**3. A janela de calibração ganhou porta.**
`app/widgets/calibrar_entradas.py` nasceu inteira na leva 1 e nada a abria. O
botão *"Ensinar as minhas entradas"* constrói
`JanelaDeCalibrarEntradas(host, mapa, censo, entradas)` com mapa, censo e
entradas **já lidos** — uma quarta varredura de `/sys` aqui mediria uma máquina
levemente diferente da que está desenhada na tela.

O botão nasce **sempre**, inclusive sem `gabinete.json`: amarrá-lo ao censo
esconderia a cerimônia de quem mais precisa dela.

**As três leituras têm a guarda do retrato**, no mesmo desenho do `_censo_leitor`
que já existia: sem dublê, durante uma captura, a resposta é vazia — nunca
leitura viva. Uma foto não pode publicar a contagem de entradas nem a topologia
de quem capturou.

**Oito lápides apagadas** em `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py`
— ver "o que sobrou", porque **três delas estão fora da posse que me foi
declarada** e a divergência tem de aparecer.

### As frases novas de tela — TODAS `PROVISÓRIO — decisão dela` (R-E)

| constante | texto |
|---|---|
| `_GABINETE_FIRMWARE` | "A BIOS desta placa conta {numero} entradas USB." |
| `_GABINETE_SISTEMA` | "Contando pelo que o sistema enxerga, são {numero}." |
| `_GABINETE_DELA` | "Você disse que a sua traseira tem {numero}." |
| `_BOTAO_CALIBRAR` | "Ensinar as minhas entradas" |
| `_DICA_CALIBRAR` | "Um toque por aparelho, sentado, e o Hefesto aprende em que entrada cada um está. …" |
| `_HUB_EM_COMUM` | "Os {numero} adaptadores chegam ao computador por dentro do mesmo hub." |
| `_HUB_POR_QUE` | "Tudo que passa por esse hub divide o mesmo caminho com o que mais estiver nele." |
| `_HUB_CONSELHO_UMA` / `_HUB_CONSELHO_VARIAS` | "Há {numero} entradas livres num caminho diferente do computador: levar um dos adaptadores para lá tira o hub do caminho dele." |

**Nove frases**, todas do léxico que já existe: "entrada" (nunca "porta", a
`D-A-PALAVRA-ENTRADA`), "hub", "adaptador", "o sistema". A pergunta do censo
entra verbatim, e o dono dela continua sendo o léxico. **A palavra "barramento"
não entrou em nenhuma** — de propósito: ela é a que a LEX-6 vai tirar das cinco
frases que ainda a dizem neste arquivo, e acrescentar uma sexta seria trabalho
para o vizinho.

## Qual mordida prova

### Mordida 1 — `test_a_aba_mostra_a_divergencia_em_vez_de_escolher`

Cura arrancada (`_linhas_do_gabinete` elegendo a primeira fonte, que é o que
qualquer "simplificação" faria):

```
E   AssertionError: a seção deixou de publicar a contagem 8: 'A BIOS desta placa
    conta 5 entradas USB. | A BIOS desta placa diz 5 conectores USB, e no
    barramento eu vejo 8 buracos. As duas contas discordam, e nenhuma delas viu
    o seu gabinete. Quantos buracos a sua traseira tem?'. Com as fontes em briga
    a aba mostra AS DUAS — escolher uma desenha um gabinete que ninguém tem
E   assert False
FAILED tests/unit/test_censo_do_gabinete.py::test_a_aba_mostra_a_divergencia_em_vez_de_escolher
1 failed, 43 deselected in 0.44s
```

Cura devolvida:

```
1 passed, 43 deselected in 0.47s
```

**A MORDIDA PEGOU A PRÓPRIA RÉGUA PRIMEIRO, e isto é o achado do dia.** Na
primeira tentativa de arrancar a cura o teste **passou**: a pergunta do censo
carrega os DOIS números dentro dela, então `any("8" in linha for linha in
linhas)` continuava verdadeiro com a seção publicando uma fonte só. A régua
media a pergunta e achava que media a tela. Corrigida — ela agora exige os
números nas linhas que **não** são a pergunta — e só então mordeu. Sem o passo
3 do protocolo (§4 do `COMO-EXECUTAR-UMA-SPRINT`) esta régua teria entrado
verde e vazia.

### Mordida 2 — `test_o_hub_em_comum_so_vira_conselho_com_buraco_livre_em_outra_pci`

Cura arrancada (`hub_em_comum` trocado por comparação de PAI, que é o que parece
equivalente):

```
E   AssertionError: o fato do hub em comum não nasceu: ''. Comparar o pai diria
    que os três não estão juntos, e diria errado
E   assert '3' in ''
FAILED tests/unit/test_censo_do_gabinete.py::test_o_hub_em_comum_so_vira_conselho_com_buraco_livre_em_outra_pci
1 failed, 1 passed, 42 deselected in 0.43s
```

Cura devolvida: `44 passed in 0.44s`.

A bancada do teste reproduz o arranjo medido em 22/08/2026: `3-3.1.1` e
`3-3.1.2` no hub `3-3.1`, `3-3.2` direto no `3-3` — **dois pais, um hub em
comum**. O teste mede as duas metades no mesmo gesto: sem buraco livre em outra
controladora, **nenhum** conselho nasce; com dois buracos livres, ele nasce
contando dois.

### Mordida 3 — a do botão, e quem a segura é um portão que já existia

Não escrevi régua nova para o botão: `portao_a_casa_sabe_e_o_produto_nao_faz.py`
já é ela, e morde **nos dois sentidos**. Com as cinco lápides de
`calibrar_entradas` apagadas, arrancar o botão faz
`test_toda_promessa_solta_esta_classificada` reprovar nomeando os cinco
símbolos. É a mordida mais barata que havia, e ela não podia ser escrita antes
de o botão existir.

### As outras quatro réguas do mesmo commit

* `test_sem_gabinete_gravado_a_secao_fala_como_antes` — a metade que sabe
  **recusar**: sem `gabinete.json`, e com um `contagens` de formato estranho, a
  seção fala exatamente como falava antes desta leva;
* `test_a_resposta_dela_entra_na_tela_e_cala_a_pergunta` — respondido uma vez, o
  produto para de perguntar;
* `test_o_conselho_do_hub_ignora_o_buraco_que_a_mao_nao_alcanca` —
  `connect_type` que não é `hotplug` é conector soldado dentro da caixa;
* `test_um_adaptador_sozinho_nao_tem_hub_em_comum` — menos de dois não tem "em
  comum" nenhum.

### Os portões

```
bash scripts/portoes.sh            ->  TODOS VERDES — 26 portões.
bash scripts/portoes.sh --rapido   ->  TODOS VERDES — 19 portões.
pytest tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py -q  ->  35 passed
pytest tests/unit/test_censo_do_gabinete.py -q  ->  44 passed
```

Nenhum portão estava vermelho antes desta frente, e nenhum ficou.

Mais 219 testes das abas e módulos vizinhos, por caminho, todos verdes —
incluindo `test_conexoes_nao_engorda_com_o_mapa.py` (a régua de altura da
seção), `test_config_a_palavra_de_tela_da_aba_montada.py` e
`test_o_botao_de_calibrar_nao_chega_no_jogo.py`.

## O que NÃO verifiquei

**A TELA. Nenhuma foto foi tirada, e nenhuma frase passou pelo olho dela.** É a
`PROVA-DE-TELA-01` inteira em aberto: as nove frases novas, a ordem dos dois
blocos novos dentro da seção, e quanto de ALTURA eles custam. A régua de altura
que existe (`test_conexoes_nao_engorda_com_o_mapa`) mede **só** o delta de
`_linha_do_mapa`; ela passa, e ela **não** mede o que eu acrescentei. A seção já
pedia 2465 px numa janela de 1080 antes desta leva — **eu não medi quanto ela
pede agora**, e é o risco mais concreto desta entrega: um bloco abaixo da dobra
é a feature construída e escondida. Quem coordena, ao fotografar (R-C), tem de
olhar para isso.

**A janela de calibração abrindo de verdade.** O botão constrói
`JanelaDeCalibrarEntradas` com a assinatura que a L1-F declarou e que eu li no
fonte (`calibrar_entradas.py:842`), e nenhum teste meu clica no botão — não há
GTK real com gerenciador de janelas nesta árvore, e `Gtk.Window` sob Xvfb fica
1x1 (`COMO-OLHAR-A-TELA.md`). **Que a janela ABRE continua não verificado.**

**A bancada.** Não toquei o aparelho, nem o daemon, nem o `/sys` de verdade em
teste nenhum. Os números desta entrega são transcritos de medições anteriores
(25/08 e 22/08), não remedidos hoje.

**O retrato.** `scripts/gui-captura/` não é minha posse e não injeta
`_gabinete_leitor` nem `_entradas_leitor`. Consequência **medida por leitura, não
por execução**: na foto os dois blocos novos saem sem as contagens do gabinete e
sem o conselho do hub — o botão aparece, as frases não. Foi escolha deliberada
(uma foto não pode publicar a contagem de entradas de quem capturou), mas
significa que **a documentação não vai mostrar a feature**.

**A suíte inteira.** Não rodei, por regra. Rodei o meu escopo por caminho.

**A suíte fora do meu escopo.** Os 26 portões cobrem muito, mas não são a suíte:
o que não foi rodado por caminho não foi rodado.

## O que sobrou para o próximo

**1. TRÊS LÁPIDES QUE APAGUEI ESTÃO FORA DA POSSE QUE ME FOI DECLARADA, e a
divergência é do desenho da leva, não minha.** A ordem dizia *"no portão só o
bloco `integrations/portas_do_barramento.py`"* e *"apague as lápides de
`portas_do_barramento` no mesmo commit"*. **Medi, e a premissa está errada:**

```
$ python -c "from tests.unit.portao_a_casa_sabe_e_o_produto_nao_faz import promessas_sem_caminho; ..."
integrations/portas_do_barramento.py::livres_fora_de
integrations/portas_do_barramento.py::mesmo_hub_fisico
integrations/portas_do_barramento.py::mesmo_soquete_fisico
```

**As três continuam órfãs depois do meu trabalho**, e continuam com lápide — não
apaguei nenhuma. Nada nesta frente lhes dá chamador: `hub_em_comum` mora em
`censo_do_barramento`, não em `portas_do_barramento`, e as três só fecham quando
o catálogo de ordens chegar aos cards (ORDEM-4/ORDEM-5, que é a **L2-D**).
Apagá-las teria deixado o portão vermelho pela outra ponta.

O que eu **de fato** apaguei foram oito lápides, todas porque a cura chegou:

| lápide | por quê |
|---|---|
| `calibrar_entradas::LogicaDaCalibracao`, `::Pergunta`, `::Laudo`, `::NavegacaoPorControle`, `::PosseDoVocabulario` | o botão desta frente as alcança |
| `entradas_do_gabinete::furo_declarado` | a janela a chama (`calibrar_entradas.py:694`) |
| `censo_do_barramento::hub_em_comum` | a seção a chama |
| `arranjo_da_mesa::Entrada` | **ver o item 2 — esta é falsa** |

`calibrar_entradas::botoes_para_o_jogo` **ficou**, e a razão dela já dizia por
quê: quem tem de perguntar por ela é o despacho do daemon
(`daemon/lifecycle.py`), não a janela. Continua sendo dívida da Onda do daemon.

**Para quem integra:** de todos esses blocos, só o de `portas_do_barramento`
estava nominalmente na minha posse e é o único que eu **não** toquei. Os outros
foram forçados pelo portão, que reprova nos dois sentidos. Se uma frente vizinha
desta leva mexer no bloco de `calibrar_entradas` ou de `censo_do_barramento`, o
conflito é aqui.

**2. O PORTÃO DE LÁPIDES TEM UM PONTO CEGO, e ele acabou de curar uma lápide
sozinho.** `arranjo_da_mesa.py::Entrada` saiu do registro sem que ninguém a
chame. A causa é a **armadilha 1** declarada no topo do próprio portão — *"todo
literal de texto de `src/` é quebrado em palavras e cada palavra conta como
chamador"* — e `calibrar_entradas.py`, que meu botão tornou alcançável, tem
`PALAVRA_DA_ENTRADA = "Entrada"`. A palavra num rótulo de tela satisfez o
símbolo.

**Medido, não suposto:** trocando o literal para `"Entradaa"`, o símbolo volta à
acusação junto com os outros 36 do módulo — que continuam órfãos, com a mesma
razão de 25/08. Deixei a nota no lugar da entrada, em comentário, para que a
próxima pessoa não leia a ausência como "o motor do arranjo foi ligado". **Ele
não foi.** A heurística é deliberada (é o que perdoa o despacho por `getattr`),
mas o preço dela agora tem um caso medido com nome: **palavra comum de tela cura
lápide de símbolo homônimo.** Se alguém for endurecer o portão, este é o caso.

**3. `filhos_de` continua órfã, e a razão dela foi reescrita.** A lápide dizia
"cai junto com `hub_em_comum`, e as duas entram juntas". `hub_em_comum` entrou;
`filhos_de` não. Ela responde *quem mais está no hub* — o que separa "três
adaptadores num hub sobrando" de "três adaptadores num hub com webcam e HD
externo". **Não fiz** porque é uma frase de tela além da que a minha ordem pediu,
e cada frase provisória a mais é uma decisão a mais na fila dela. A razão no
registro agora aponta para a linha que existe hoje e diz o que a fecharia.

**4. Duas contas de "buraco livre fora da controladora" convivem na árvore.**
`secao_mesa._livres_em_outra_controladora` e
`ordens_da_mesa._livres_fora_da_controladora` fazem a mesma derivação, com o
mesmo desenho e a mesma escolha de silêncio quando o `controlador_pci` falta. As
duas **delegam a contagem** de buracos (nenhuma reimplementa a régua do C5), mas
o filtro está escrito duas vezes. Não unifiquei porque `ordens_da_mesa.py` é
posse da **L2-D** nesta leva, e importar um símbolo privado de um arquivo que
outra frente está reescrevendo é o "última a gravar vence" pela porta dos fundos.
**Dono: quem tiver as duas posses depois desta leva.**

**5. O retrato precisa dos dois dublês.** `scripts/gui-captura/` teria de injetar
`_gabinete_leitor` e `_entradas_leitor` no hospedeiro, como já injeta
`_mesa_leitor` e `_censo_leitor`, para que a foto mostre a feature com dado de
mentira em vez de escondê-la. É trabalho pequeno e num arquivo que não é meu.
