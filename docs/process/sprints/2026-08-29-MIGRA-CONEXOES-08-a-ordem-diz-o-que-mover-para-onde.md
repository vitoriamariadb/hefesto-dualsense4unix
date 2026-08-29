---
sprint: MIGRA-CONEXOES-08
onda: MIGRA-CONEXOES
posse:
  M8:
    - src/hefesto_dualsense4unix/app/actions/config/secao_exame.py
    - tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py
cria:
  - tests/unit/test_migra_conexoes_a_receita_chega_a_tela.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-01
  - MIGRA-CONEXOES-01
  - MIGRA-CONEXOES-03
  - MIGRA-CONEXOES-04
  # SÉRIE por arquivo: a 07 dá a forma do quadro; esta põe a receita dentro.
  - MIGRA-CONEXOES-07
  # SÉRIE por arquivo (R5): também possuem `secao_exame.py`.
  - ONDA-CONEXOES-03
  - ONDA-CONEXOES-04
  - ONDA-CONEXOES-09
  - ORDEM-DE-SERVICO-01
  - LEVA-2
  - LEVA-4
  # O REGISTRO DE LÁPIDES É LEVA-WIDE: toda sprint que fecha uma lápide o edita.
  # As entradas são independentes e os merges são locais à linha, mas o portão
  # não sabe disso. Quem coordena serializa; as que já o reivindicam:
  - ONDA-CONEXOES-10
  - ONDA-GATILHOS-05
  - ONDA-SISTEMA-06
  - ONDA-SISTEMA-07
  - LIGAR-OS-MODULOS-A-TELA
nao_toca:
  - src/hefesto_dualsense4unix/integrations/arranjo_da_mesa.py
  - src/hefesto_dualsense4unix/integrations/plano_de_radio.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_orcamento.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - scripts/telas/aba08.py
---

# MIGRA CONEXÕES · 08 — a ordem diz o que mover para onde

**O defeito:** a ordem de serviço mostra **juízo sem receita**. Ela diz que algo
está errado e não diz o que mover para onde — e o código que diria está escrito
há quatro dias, sem um único chamador.

| peça | estado |
|---|---|
| `integrations/ordens_da_mesa` (`ordens_novas`, `ordens_caladas`, `cabecalho`, `resposta_ao_ja_movi`, `identidades`) | **vivo**, consumido em `app/actions/config/secao_exame.py:120-125` |
| `integrations/arranjo_da_mesa.receita` | **lápide** — `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py:1001` |
| `integrations/arranjo_da_mesa.consequencias` | **lápide** — `:944` |

E as duas lápides dizem, com todas as letras, por que estão vivas e o que as
fecha: *"a `D-QUAL-REGUA-MANDA-NO-ARRANJO` diz que a escolha entre as duas
réguas do arranjo é palavra DELA (…) e ela ainda não escolheu. O QUE O FECHA: a
**ordem de serviço da aba Conexões**, depois da palavra dela sobre qual régua
vence."*

**Esta sprint é essa.**

O mockup já a desenha inteira (`08-conexoes.html`, quadro "Está tudo certo?",
coluna da direita): o **imperativo** ("Mova o adaptador Bluetooth da Entrada 3
para a Entrada 9"), a **receita** em duas caixas com a seta, e o **ganho
esperado**.

## A trava, e ela não é desta sprint resolver

Duas réguas respondem "qual controle/adaptador move para qual entrada", e **uma
delas já está na tela**:

* `integrations/plano_de_radio.ordem_de_redistribuicao` — já publica, pela
  seção de Desempenho;
* `integrations/arranjo_da_mesa.plano_dos_controles` / `.receita` — responde o
  mesmo com outra régua, e não tem tela.

`docs/data/decisoes-dela.csv:40` fixou o caminho: **medir as duas antes de
escolher**, e a medição que ela pediu **existe** —
`tests/unit/test_as_duas_reguas_do_arranjo_divergem_onde.py`. O que falta é a
frase dela. **Escolher sem a frase põe duas respostas para a mesma pergunta na
mesma seção**, que é o defeito que o motor do arranjo existia para matar.

## O que entrega

1. **A ordem chega inteira à página**, em três endereços:
   `data-v="ordem.imperativo"`, `data-v="ordem.receita.origem"` /
   `…destino`, `data-v="ordem.ganho"`. A **origem** e o **destino** saem de
   `receita`; o **ganho**, de `consequencias`. Nada é frase montada na página.
2. **Zero ordens é estado, e ele tem desenho.** Quando `ordens_novas` volta
   vazia, a coluna da direita mostra o vazio — não some, porque sumir faria o
   quadro mudar de altura a cada exame e a aba já não cabe.
3. **Os dois gestos que existem hoje continuam:** `Ignorar` (cala aquele conselho
   **naquele arranjo de cabos**) e `Ver as ordens ignoradas`, com
   `ordens_caladas` do outro lado. E o `Já movi — reexaminar` usa
   `resposta_ao_ja_movi`, que é quem compara o antes com o depois.
4. **As duas lápides fecham no registro**, com a razão trocada por "fechada em
   29/08 pela MIGRA-CONEXOES-08" — e não apagadas: o registro é memória.
5. **A tensão que o mockup já confessou fica escrita, não curada.** O exame desta
   aba afirma que a Entrada 3 é **USB 3.0** e a 9 é **2.0**; a janela do desenho
   trata **toda** entrada como `usb=2`, porque a velocidade vem de nós declarados
   e quem os escreve é a **outra** janela. As duas telas são honestas cada uma no
   seu canto, e o produto ainda não junta o que já sabe. Curar isso é sprint de
   `mapa_das_portas`, fora desta.

## Como se prova (a mordida)

`tests/unit/test_migra_conexoes_a_receita_chega_a_tela.py`:

* **origem e destino vêm da `receita`, e o teste os LÊ dos dois lados.** Dublê de
  mesa com uma divergência conhecida; o que a página mostra tem de ser
  exatamente o par que `receita` devolve. **Mordida:** troque o destino por um
  literal e o teste reprova comparando com a função.
* **o ganho vem de `consequencias`.** **Mordida:** escreva a frase do ganho na
  página e veja reprovar.
* **a lápide fecha por ENTREGA.** O portão
  `portao_a_casa_sabe_e_o_produto_nao_faz` deixa de acusar `receita` e
  `consequencias` **porque existe chamador**, não porque alguém apagou a linha.
  **Mordida:** arranque o chamador e o portão volta a acusar — se ele não voltar,
  a régua é falsa.
* **zero ordens não quebra nem some.** Lista vazia → o vazio aparece, a altura do
  quadro não muda. **Mordida:** faça a coluna sumir e meça a altura do quadro
  antes e depois.
* **uma régua só na tela.** O teste conta quantas funções distintas alimentam
  origem/destino nesta aba → **1**. **Mordida:** ligue `plano_de_radio` também e
  veja reprovar com as duas respostas lado a lado. Esta é a régua que impede a
  decisão dela de ser contornada por descuido.

## O que é dela decidir

* **QUAL RÉGUA MANDA NO ARRANJO** (`D-QUAL-REGUA-MANDA-NO-ARRANJO`). **Trava esta
  sprint inteira.** A medição que ela pediu já existe —
  `tests/unit/test_as_duas_reguas_do_arranjo_divergem_onde.py` —, e enquanto não
  houver resposta a `receita` e a `consequencias` continuam lápides e o card
  mostra juízo sem receita.
* **A palavra do imperativo.** "Mova o adaptador Bluetooth da Entrada 3 para a
  Entrada 9" é do mockup; se o juízo por entrada vencer a receita, o texto do
  imperativo muda com a régua.
