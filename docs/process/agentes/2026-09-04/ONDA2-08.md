# ONDA2-08 · A aba Conexões — quatro decisões do PO, e o campo que prometia e perdia

**04/09/2026.** Frente A8 da ONDA 2, na árvore `hefesto-voo/ONDA2-08-CONEXOES-A8`,
branch `voo/ONDA2-08-CONEXOES-A8`.

**A aba tinha 34 linhas abertas — 21 `DIFERENTE` e 13 `FALTA_NO_HTML`, a maior
dívida da onda.** Esta frente fechou **três decisões do PO inteiras** ([03],
[04], [08]), **uma pela metade** ([07], só a lista das ordens), **o fato errado
de dentro de uma quinta** ([05]) e **metade do defeito da §3** (o motor do
apelido, sem o evento que o aciona).

**O que NÃO couber está declarado abaixo com a razão medida**, e a razão é a
mesma em quase todos: pedem endereço que a página publicada não tem, e a metade
de produto sozinha faria a tela mentir. Uma frente que entrega metade bem medida
vale mais que uma que entrega tudo sem mordida.

---

## O que mudou

### O que já vale na tela DELA, sem publicar nada

A coluna da direita do Check-up é **UM endereço com alvo `html`**
(`data-campo="ordem"`), e quem a desenha é o pacote — não o mockup. Três das
quatro decisões couberam por esse canal, e **estão na tela viva desde já**,
fotografadas com o daemon rodando e os dois controles na mesa
(`ONDA2-08-produto.png`).

| decisão | o que entrou | onde |
| --- | --- | --- |
| **[03]** cartão de cura na coluna da direita | `a08_conexoes._card_da_cura` — um card por conferência que tem cura, sem ordem e com estado diferente de `certo`. **A regra dos três filtros é do dono** (`secao_exame._desenhar_o_que_fazer`), lida linha a linha. | produto |
| **[04]** selo de procedência só nas frases não medidas aqui | `a08_conexoes._marca_da_procedencia` — `[derivado da conta]` no `?` do card e na linha do ganho. `medido aqui` fica implícito e não escreve nada. **A palavra é de `ordens_da_mesa.TEXTO_DO_SELO`.** | produto |
| **[07]** o `+N` no fim da lista | `a08_conexoes._sobraram` — *"+1 recomendação não coube aqui"*. **A segunda ordem de serviço desta bancada parou de sumir.** | produto |
| **defeito da §3** — o nome do adaptador promete e não guarda | gesto `renomear-adaptador` + `data-hef-gesto`/`data-caminho` na célula. | produto (com uma ressalva, abaixo) |

### O que ficou na BANCADA, e para ali

| decisão | o que entrou |
| --- | --- |
| **[08]** a frase do rodapé do Mapa | `aba08.MAPA_JA_GRAVOU` — *"Cada mudança aqui já foi gravada, no clique. Não há nada a aplicar depois."* A de antes mandava apertar um `Aplicar` que faz outra coisa, sobre um desenho que o clique dela já gravou. |
| **[05]**, a metade do FATO ERRADO | o `?` da quinta linha e a dica do ⊘ pararam de mandar procurar **"Ver as ordens ignoradas"** — botão que ela apagou em 31/08. As duas passam a dizer o que o produto FAZ: *"volta sozinha se o arranjo dos cabos mudar"*. |

**Zero pixel de janela mudou.** Medido nas duas fotos (`olhar.py`, Chrome,
1920×1080): `.janela` em **1180×777**, `passa_da_dobra: 0`, sem rolagem lateral,
antes e depois. O card de cura coube na folga que a coluna já tinha.

### As duas decisões que já estavam de pé

**[01]** o veredito do Check-up e **[02]** publicar os treze endereços: as duas
JÁ ESTAVAM FECHADAS quando esta frente abriu — `aba08.veredito_do_checkup` e
`a08_conexoes._veredito_do_exame` existem e a linha aparece na foto (*"1 mudança
recomendada"*). Nada foi refeito.

---

## Como provei (a mordida colada)

**Nove mordidas, e as nove reprovaram.** A sequência foi sempre a mesma:
arrancar a cura, ver reprovar, devolver, ver passar.

```
===== MORDIDA 1 — [04] a marca sai SEMPRE (o selo deixa de calar no medido aqui)
FAILED ...::test_a_marca_de_procedencia_cala_no_medido_aqui
FAILED ...::test_a_dica_da_ordem_marca_so_a_frase_derivada
2 failed, 14 passed

===== MORDIDA 2 — [03] a coluna volta a ser só o card da ordem
FAILED ...::test_a_coluna_desenha_um_cartao_por_cura_de_conferencia
1 failed, 15 passed

===== MORDIDA 3 — [07] o +N cala sempre
FAILED ...::test_o_mais_n_conta_a_ordem_que_nao_coube
FAILED ...::test_o_mais_n_concorda_em_numero
2 failed, 14 passed

===== MORDIDA 4 — o gesto do apelido perde o endereço no HTML
FAILED ...::test_o_campo_do_nome_do_adaptador_tem_gesto
1 failed, 15 passed

===== MORDIDA 5 — o renomear volta a escrever com o nome igual
FAILED ...::test_renomear_nao_escreve_quando_o_nome_nao_mudou
1 failed, 15 passed

===== MORDIDA 6 — [08] o rodapé do Mapa volta a mandar apertar o Aplicar
FAILED ...::test_o_rodape_do_mapa_nao_manda_apertar_o_aplicar
FAILED ...::test_o_rodape_do_mapa_diz_que_o_clique_ja_gravou
2 failed, 14 passed

===== MORDIDA 7 — a quinta linha volta a mandar procurar o botão morto
FAILED ...::test_o_exame_nao_manda_procurar_um_botao_que_nao_existe
1 failed, 15 passed

===== MORDIDA 9 — o escritor deixa de passar a leitura de mão
FAILED ...::test_o_escritor_do_apelido_chama_o_dono_com_a_assinatura_dele
1 failed, 16 passed

===== CURA DEVOLVIDA
17 passed in 0.60s
```

**A MORDIDA 8 foi na TELA VIVA**, e é a que prova o botão em vez do teste.
Arranquei o `data-hef-gesto` da célula do nome e rodei o clique sintético no
WebKitGTK, com o daemon vivo:

```
===== MORDIDA 8 — a célula perde o endereço do gesto
(nada. nenhuma linha `[gesto]`, nenhum sumário `gestos:`)

===== CURA DEVOLVIDA
[gesto] 08-conexoes.html · renomear-adaptador → aplicado
gestos: 1 · aplicados: 1 · sem dono: 0
```

**A prova de tela**, com a janela desviada para o Xvfb (`--oculta`, e a tela
dela não recebeu nada):

| foto | o quê |
| --- | --- |
| `ONDA2-08-antes.png` | a bancada no `HEAD` desta branch |
| `ONDA2-08-depois.png` | a bancada com as quatro decisões |
| `ONDA2-08-produto.png` | **a tela viva**, com o daemon rodando: o `+N`, o card de cura e o `[derivado da conta]` na máquina dela |

`hefesto_vivo.py --oculta --abre 08-conexoes.html`: **121 tiques · 121 pinturas ·
70 valores**, mediana de 4,0 ms por tique.

**A bancada foi RESERVADA** (`scripts/bancada.sh reservar "ONDA2-08 · prova de
tela da aba Conexões" --horas 1`) antes de qualquer coisa que pudesse alcançar o
barramento, e liberada no fim.

---

## O que medi e derrubou uma suposição

**1. `gui.aba_conexoes.sobraram` NÃO é a frase do `+N` — é um `int` de outra
lista.** Quatro lugares desta árvore apontam para ele como se fosse o dono da
frase que faltava (*"fica escrito para quem desenhar o `+N` desta coluna"*).
Medido: `sobraram(controles)` conta quantos controles passam de
`FATIAS_DO_ACORDEAO` e devolve um número. Chamá-lo teria posto na tela a conta
de **outra** lista — a armadilha que esta casa chama de *perguntar no lugar
errado*. O `+N` desta aba não tinha dono; agora tem, e é `a08_conexoes._MAIS_N`.

**2. `.mais` JÁ EXISTE, e é do glossário das dez páginas.** `monta.py:732`
define `.gls .mais`. Um `.mais` solto nesta folha é o vizinho de nome igual que
esta aba já pagou três vezes (`peca`, `tira`, `mesa`). O seletor virou
`.col-ordem .mais`.

**3. `.ordem .faca` é `display:flex` com `gap:8px` — cada filho inline vira um
ITEM.** Fotografado antes de virar cura: o `<b>Rádio e adaptadores</b>` no meio
da frase do card abria oito pixels de vão de cada lado dele, e o ponto final
saía sozinho, separado. O texto passou a viver dentro de um `<span>`.

**4. O `contenteditable` não tem como avisar que ela terminou de digitar.** O
ouvinte do piloto escuta `click` e `change`; um `contenteditable` não dispara
nenhum dos dois ao PERDER O FOCO. O gesto está de pé e o endereço está no HTML —
o que falta é uma linha em `hefesto_vivo.py`, que é do `nao_toca`. Ver abaixo.

**5. `atencao` é chave de máquina, e o portão de acentuação não perdoa nem em
teste.** A primeira volta dos portões reprovou em quatro linhas — três na cena
do teste e uma numa docstring. **A cura não foi o `noqa`:** as três do teste
passaram a LER `exame_da_mesa.ESTADO_ATENCAO`/`ESTADO_CERTO`/`ESTADO_NAO_SEI`,
que é o dono das chaves, e a docstring parou de citar a chave. Uma cena que
digita a chave continua verde no dia em que ela mudar de grafia.

**6. O rodapé do Mapa não podia ser curado no dono.** `ESPERA_O_APLICAR` mora em
`app/widgets/mapa_da_mesa.py` e é lido por DUAS telas: esta e o `Gtk.Label` da
janela estável (`mapa_da_mesa.py:559`). **Lá a frase continua verdadeira** — o
widget GTK é uma janela que espera o Aplicar. Trocar a constante do dono poria a
mentira na janela dela.

---

## O que NÃO verifiquei

* **A escrita real do alias no BlueZ.** Provei a assinatura da chamada
  (`renomear_o_dongle(endereco, nome, dongles=…)`) com dublê, e provei que o
  gesto **não** escreve quando o nome não mudou. **Não renomeei um adaptador
  dela para ver o BlueZ responder** — os três desta bancada têm nome dado por
  ela, e a régua de clique manda o texto que a tela mostra, que é o nome de
  agora.
* **O `+N` do exame e o dos rádios vizinhos.** Só o das ORDENS entrou. Os outros
  dois precisam de endereço novo na página; ver abaixo.
* **A aba inteira em 24 h.** A régua de tela desta frente mede um INSTANTE de 12
  s, não um comportamento — a regressão de 29/08 só apareceu aos 181 segundos.

---

## O que sobrou para o próximo

### A LINHA QUE FALTA EM `hefesto_vivo.py` — e ela é de outra posse

**Duas, e as duas no mesmo arquivo:**

1. **O ouvinte do `contenteditable`.** Hoje o piloto tem:

   ```js
   document.addEventListener('change', function(ev){ manda_do_alvo(ev); }, true);
   document.addEventListener('click',  function(ev){ manda_do_alvo(ev); }, true);
   ```

   Falta a terceira, e é o que fecha o defeito da §3 desta aba:

   ```js
   document.addEventListener('blur', function(ev){
     if(ev.target && ev.target.isContentEditable) manda_do_alvo(ev);
   }, true);
   ```

   `blur` não borbulha — o `true` (fase de captura) é o que faz o ouvinte único
   do documento alcançá-lo. Sem esta linha, a célula do nome tem gesto e
   endereço e **continua sem como avisar que ela terminou de digitar**.

2. **A linha em `PERIGOSOS`:**

   ```python
   ("08-conexoes.html", "renomear-adaptador"),
   ```

   **Por que ela é necessária mesmo com o gesto sendo idempotente hoje:** a
   régua de clique manda o `textContent` da célula, que é o nome de agora, e o
   gesto recusa escrever nome igual — logo, hoje, o clique da régua não alcança
   o barramento. **Isso é uma propriedade do gesto, não da lista**, e a lição
   do `autoswitch_lock_set` (04/09) é exatamente esta: uma régua que só protege
   o que alguém lembrou chama isso de cobertura. No dia em que o ouvinte de
   `blur` existir, um clique sintético com texto forçado renomeia o adaptador
   DELA para provar que sabe clicar.

   **`test_todo_gesto_que_grava_esta_protegido` NÃO acusa este gesto**, e o
   motivo é o mesmo: a porta que ele usa (`renomear_o_dongle`, um `busctl
   set-property` no `org.bluez`) não está em `ESCREVEM` nem em
   `METODOS_QUE_ESCREVEM`. **Acrescentar `"renomear_o_dongle"` a `ESCREVEM` é
   parte do conserto** — sem isso, a régua continua cega para toda escrita que
   passe pelo BlueZ.

### O QUE `mapa_da_mesa.py` PRECISA — e é de outra posse

`ESPERA_O_APLICAR` precisa de uma **irmã**, para a tela que grava no clique. A
frase que esta aba usa hoje mora em `aba08.MAPA_JA_GRAVOU`; ela deveria descer
para o dono, ao lado da outra, com a nota de qual tela lê qual. Enquanto isso
são duas grafias — declarado, e com data de morte.

### AS LINHAS DESTA ABA QUE NÃO COUBERAM, com a razão

| linha | por que não |
| --- | --- |
| **[05]** a metade grande — *"a linha fica na lista, apagada, e o mesmo ⊘ desfaz"* | precisa de um `data-campo` novo por linha do exame (a classe `apagada`), e **a metade de produto é perigosa sem ele**: `_itens_da_tela` passaria a devolver o item dispensado, e sem a classe a linha voltaria à tela **parecendo normal** — que é o *"botão que grava e não cala"* que o próprio código nomeia. As duas metades andam juntas ou nenhuma anda. |
| **[06]** o botão travado apaga e o motivo vira um `?` | o `monta.botao_cinza` põe o `?` ao lado do botão, e o `?` é **elemento novo** na página. O "A luz não acende" já apaga pelo `<i class="ltrava">` e já recebe a razão do produto pelo `title` — o que falta é só a troca do hover pelo `?`, e ela não vale meia entrega. |
| **[07]** o `+N` do exame e o dos rádios vizinhos | mesma razão: as duas listas precisam de um elemento novo no fim, e a página publicada não o tem. O das ORDENS coube porque a coluna inteira é um endereço `html`. |
| **as 16 do balde `LIGAR`** | nenhuma foi tocada. Elas pedem endereço novo (a cerimônia "Mapear Entrada a Entrada", o hub em comum, as contagens do gabinete, os controles externos, os dois avisos) ou dado que o `state_full` não publica. **É trabalho de uma leva inteira, não do que sobra de uma.** |
| **T-10 / IPC** — o `state_full` publicando o que falta | o daemon não é desta posse. Nada foi relatado como pendente aqui porque nada desta frente esbarrou nele. |

### AS LINHAS DO CSV QUE ESTA FRENTE FECHOU — E O VERMELHO QUE ELAS DEIXAM

**Não toquei em `docs/data/paridade-gtk-html.csv`** — ele tem um dono nesta
leva (ONDA1-X).

**O PORTÃO `paridade-gtk-html` ESTÁ VERMELHO NESTA ÁRVORE, e o vermelho é a
notícia**, não um defeito:

```
paridade-gtk-html      VERMELHO rc=1
    divida-fechada: paridade-gtk-html.csv:274  [08-conexoes] Dar nome a um adaptador (o alias do BlueZ)
      o sinal 'renomear_o_dongle' APARECEU em src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py.
      O CSV diz FALTA_NO_HTML e o lado HTML passou a ter o símbolo.
```

**A linha 274 está CERTA sobre o passado e velha sobre o presente.** Ela diz,
por escrito: *"O sinal agora é `renomear_o_dongle`, que é a função que GRAVA, e
ela não existe no lado HTML: o `contenteditable` da célula não tem gesto."* Ela
passou a existir. **Quem reescrever a linha 274 tem de saber que a dívida fechou
PELA METADE** — ver a ressalva do `blur`, acima: o motor grava, e ainda não há
evento que o acione quando ela sai do campo.

**Os outros 40 dos 41 portões estão VERDES**, e o `paridade-gtk-html` é o único
vermelho — o do CSV que não é meu.

Estas são as linhas da aba `08-conexoes` que o trabalho desta frente fecha, com
o endereço novo lido no código:

| feature (coluna `feature`) | veredito hoje | o que passou a existir |
| --- | --- | --- |
| `Card de ORDEM DE SERVIÇO (o imperativo e as três linhas com selo de procedência)` | `DIFERENTE` | `src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py` · `_marca_da_procedencia` e `_card_da_ordem` — o selo entra no `?` e na linha do ganho, só nas frases não medidas aqui |
| `O ? de cada linha (por que importa + o que fazer)` | `DIFERENTE` | `a08_conexoes._card_da_cura` — a cura sai do `?` e vira card visível na coluna da direita |
| `Onde a declaração da mesa é gravada — o "Aplicar" do rodapé` | `DIFERENTE` | `src/hefesto_dualsense4unix/interface/aba08.py` · `MAPA_JA_GRAVOU` — a frase deixa de mandar apertar o `Aplicar`. **Só na bancada.** |
| `Dar nome a um adaptador (o alias do BlueZ)` | `FALTA_NO_HTML` | `a08_conexoes.renomear_adaptador` + `GESTO_DO_APELIDO` — **fecha PELA METADE**: o motor está de pé e endereçado, e falta a linha de `blur` em `hefesto_vivo.py`. Não a lance como fechada. |
| `Reabrir uma ordem ignorada ("Ver as ordens ignoradas")` | `FALTA_NO_HTML` | **NÃO fechou.** O que fechou é o fato errado dentro dela: a tela parou de nomear um botão que não existe. |

---

## Os arquivos

| arquivo | o que |
| --- | --- |
| `src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py` | as três decisões de produto + o gesto do apelido |
| `src/hefesto_dualsense4unix/interface/aba08.py` | a folha das peças novas, o rodapé do Mapa, as duas frases que mentiam |
| `mockup/08-conexoes.html` | regerado |
| `mockup/DIVERGENCIAS.md` | a seção `08-conexoes.html` desta leva |
| `tests/unit/test_a_aba_08_conexoes_fecha_as_linhas.py` | **17 testes**, e nove mordidas |
