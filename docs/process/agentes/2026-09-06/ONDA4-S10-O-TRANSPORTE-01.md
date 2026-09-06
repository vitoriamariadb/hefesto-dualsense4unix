# ONDA4-S10 · O TRANSPORTE — laudo do agente

**06/09/2026.** Sprint
`docs/process/sprints/2026-09-05-ONDA4-S10-O-TRANSPORTE-01-cabo-e-radio-pela-funcao-que-ja-tem-dono.md`.
Decisão dela (D-05), verbatim: *"cabo / rádio, pela função que já existe."*

---

## O QUE SE MEDIU

**A mesa da bancada no momento da medição:** **UM** DualSense no cabo, cor do
plástico lida. O despacho falava de dois; o daemon publicava um. Isso importa
para uma coisa só, e está dito: uma mesa de um controle **não distingue as duas
palavras na tela**. A régua nova cobre os dois transportes com estado montado
pelo dono da mesa, e a foto cobre o cabo.

### 1. Duas das seis cópias que a sprint listou já não existiam

A §2 dizia que `interface/mesa_viva.py:343` era `"USB" if transporte == "usb"
else "BT"`. **Não é mais**: em 05/09 a linha virou `_via_do_transporte(...)`,
que lê `pacotes.VIA_DO_TRANSPORTE`. O P2 caducou antes da execução.

Sobravam duas cópias de verdade, e as duas morreram:

| onde | o que era | dialeto |
| --- | --- | --- |
| `interface/pacotes/a01_jogar.py:358` | `(c.get("transport") or "").upper()` | o cru, em maiúsculas |
| `interface/pacotes/a09_sistema.py:558` | `"cabo" if transport == "usb" else "rádio"` | a palavra dela, redigitada |

### 2. A §3 viu quatro comparadores. São NOVE, e cinco não são desta posse

Esta é a medição que mudou o desenho da cura.

**Os quatro da posse** (curados ou mantidos com razão):

| onde | o que faz | o que aconteceu |
| --- | --- | --- |
| `mesa_viva.py:399` | a contagem do cabeçalho | **passou a somar `transporte`** |
| `a07_lancadores.py:994` | a contagem do "?" | **passou a somar `transporte`** |
| `a03_gatilhos.py:1811` | não escrever `P2 · BT · BT` | **fica comparando a palavra** — é a regra dele, e a §6 pede que fique |
| `a09_sistema.py:489` | o mesmo descarte, por conjunto | **virou pergunta ao dono** (ver 4) |

**Os cinco que a §3 não viu, e nenhum é desta posse:**

    interface/monta.py:877                    `nome in (c["via"], TRAVESSAO)`
    interface/pacotes/a08_conexoes.py:2498    `c["via"] == "BT"`
    interface/pacotes/a08_conexoes.py:2499    `c["via"] != "BT"`
    interface/pacotes/a08_conexoes.py:2505    `m.get("via") == "BT"`
    interface/pacotes/a08_conexoes.py:2513    `c["via"] != "BT"`

`monta.py` está em `nao_toca:`. `a08_conexoes.py` tem **cinco sprints abertas**
com posse dele (`CONEXOES-LIGAR-TUDO-01`, `ONDA5-01-01`, `ONDA5-08-01`,
`ONDA5-08-02`, `EXTERNOS-01`).

**A consequência, e é o que decidiu a execução:** trocar a palavra que a chave
`via` carrega faria `no_radio` da aba Conexões voltar **lista vazia** com os
controles no rádio — a tela mostrando zero no rádio, sem erro, sem log e sem
régua vermelha. É exatamente a família de defeito que a §3 existe para impedir,
só que noutro arquivo. Então a `via` ficou sendo a **sigla de máquina** e a
palavra da tela passou a sair da dona em cada superfície desta posse.

### 3. A régua da paridade ficou vermelha sobre a decisão dela

`docs/data/paridade-gtk-html.csv:18` — *"O marcador 'primário' no card do
controle principal"* — tinha como `sinal` o **nome da função dona da palavra do
transporte**, com `sinal_espera=AUSENTE`. É um símbolo de OUTRA feature,
emprestado só porque estava ausente do lado HTML.

Ele disparou **duas vezes sobre trabalho legítimo**: em 05/09 sobre um
comentário que o soletrava (curado citando o endereço), e hoje sobre a própria
D-05, que manda a interface nova CHAMAR essa função. A dívida que fechou foi a
do transporte; a do marcador 'primário' continua aberta, e a régua não sabia
distinguir uma da outra.

**Curado:** o sinal virou o **endereço de tela** que a página vai escrever
quando esta dívida fechar de verdade. Nenhuma outra frente pode acendê-lo.

### 4. A fita da aba Sistema está morta na tela — e não é a cura que falhou

A §5 pede a fita e a linha de identidade da 09 **na mesma foto**, em uma língua
só. A foto depois mostra a linha em `cabo` e a fita em `USB`.

**Medido, não suposto**, com o daemon vivo, duas execuções (com cor lida e com
`--sem-cor`): quem pinta a `.fita` das dez abas é `hefesto_vivo._fita` →
`monta.fita`, que troca o bloco **inteiro** antes de a pintura visitar campo
nenhum. O `data-campo="fita-chips"` que `a09_sistema` emite deixa de existir no
DOM. A fita da 09 nunca é a da 09.

A aba 07 escapa porque emite a fita por `blocos[".fita"]` — e é por isso que a
fita dela **mudou** na foto.

---

## O QUE MUDOU

| arquivo | o quê |
| --- | --- |
| `interface/mesa_viva.py` | a contagem do cabeçalho soma `transporte`; `_via_do_transporte` foi demovido a **sigla de máquina**, com a dívida escrita |
| `interface/pacotes/__init__.py` | `VIA_DO_TRANSPORTE` ganhou lápide: é a sigla, não a palavra, e a razão de continuar viva está nos cinco endereços |
| `interface/pacotes/a01_jogar.py` | **P4** — o cartão da Jogar diz `Cosmic Red · cabo` |
| `interface/pacotes/a07_lancadores.py` | **P1** na contagem do "?"; o chip da fita diz `cabo` |
| `interface/pacotes/a09_sistema.py` | **P5** na linha de identidade; o chip da fita idem; o descarte pergunta ao dono em vez do conjunto congelado |
| `docs/data/paridade-gtk-html.csv` | linha 18 remedida (o sinal era de outra feature) |
| `tests/unit/test_a_palavra_do_transporte_tem_um_dono_so.py` | **novo** — 13 casos, seis mordidas |
| três réguas que mediam o mundo de ontem | ver abaixo |

**As três réguas que reprovaram a melhora em vez do defeito** — a forma que
esta casa já pegou onze vezes, *a régua DIGITAVA o que devia LER*:

* `test_a_aba_07_usa_o_controle_da_fita.py` — exigia `"USB"`/`"BT"` no chip;
* `test_a_aba_lancadores_diz_a_verdade.py` — a mesa de mentira só tinha `via`,
  a palavra da tela, e a conta somava por ela;
* `test_aba09_a_fita_vem_de_cima.py` — contava `"BT"` para provar que o
  transporte não sai duas vezes; com a fita em `rádio` a contagem virou zero e
  a régua leu isso como *"o transporte sumiu do chip"*.

As três passaram a **perguntar à dona**.

---

## A MORDIDA

Seis, uma por cura, cada uma arrancada e devolvida. Saída colada.

```
===== MORDIDA: P1 — a contagem do cabeçalho volta a somar a PALAVRA =====
E       AssertionError: a contagem do cabeçalho seguiu a PALAVRA da tela.
E       assert ('● 2 control...0 USB · 2 BT') == ('● 2 control...2 USB · 0 BT')
E         At index 1 diff: '0 USB · 2 BT' != '2 USB · 0 BT'
FAILED ...::test_a_contagem_do_cabecalho_nao_se_mexe_quando_a_palavra_muda
1 failed, 12 passed in 0.51s

===== MORDIDA: P1 — o "?" da Lançadores volta a somar a PALAVRA =====
E       AssertionError: o '?' da Lançadores contou pela palavra da tela:
E       'os <b>2</b> (0 no cabo, 2 no rádio)'. O cabeçalho, no mesmo quadro,
E       continuaria dizendo '1 USB · 1 BT'
FAILED ...::test_o_quantos_da_lancadores_nao_se_mexe_quando_a_palavra_muda
1 failed, 12 passed in 0.52s

===== MORDIDA: P4 — o terceiro dialeto volta ao cartão da Jogar =====
E       AssertionError: Não sei · THUNDERBOLT
E       assert 'thunderbolt' in 'Não sei · THUNDERBOLT'
FAILED ...::test_as_quatro_superficies_seguem_a_dona
FAILED ...::test_as_quatro_superficies_dizem_a_palavra_dela_hoje
FAILED ...::test_o_transporte_ausente_diz_que_nao_se_sabe
FAILED ...::test_um_transporte_que_o_mapa_nao_conhece_aparece_cru
4 failed, 9 passed in 0.58s

===== MORDIDA: P5 — a quarta cópia volta à linha de identidade da Sistema =====
E         a09_sistema.py:586: via = "cabo" if str(c.get("transport") or "") == "usb" else "rádio"
E       A palavra vem da dona e de mais lugar nenhum
FAILED ...::test_as_quatro_superficies_seguem_a_dona
FAILED ...::test_o_transporte_ausente_diz_que_nao_se_sabe
FAILED ...::test_nenhuma_aba_desta_posse_escreve_a_traducao[...a09_sistema.py]
3 failed, 10 passed in 0.63s

===== MORDIDA: a FITA da 09 volta à sigla =====
E       AssertionError: chip da Sistema não diz a palavra dela:
E       '...P1 <span class="pt">•</span> USB</label>'
FAILED ...::test_as_quatro_superficies_seguem_a_dona
FAILED ...::test_as_quatro_superficies_dizem_a_palavra_dela_hoje
2 failed, 11 passed in 0.57s

===== MORDIDA: o DESCARTE da 09 volta ao conjunto congelado =====
E       AssertionError: o último degrau de `identidade_de` mudou de língua e o
E       descarte ficou com a palavra de ontem
E       assert 'por um fio' == ''
FAILED ...::test_o_descarte_da_09_segue_o_ultimo_degrau_de_identidade
1 failed, 12 passed in 0.52s
```

Com as seis curas no lugar: `13 passed in 0.51s`.

### A prova de tela

Janela `--oculta` (`Gtk.OffscreenWindow`) as cinco vezes, com o daemon dela no
ar. Nada nasceu na tela dela.

| | antes | depois |
| --- | --- | --- |
| cartão da Jogar | `Cosmic Red · USB` | **`Cosmic Red · cabo`** |
| chip da fita, Lançadores | `P1 · Cosmic Red · USB` | **`P1 · Cosmic Red · cabo`** |
| contagem do topo | `1 controle: 1 USB · 0 BT` | `1 controle: 1 USB · 0 BT` (**não muda**, decisão dela) |
| linha de identidade, Sistema | `P1 · Cosmic Red · cabo · <serial>` | igual — era a cópia, e agora é a dona |
| chip da fita, Sistema | `P1 · Cosmic Red · USB` | igual — `monta.fita` vence; ver o achado 4 |

A leitura é do DOM renderizado. O gesto não é clicável: a palavra do transporte
é campo de leitura, e a régua nova mede as quatro superfícies em função.

### Os portões

**41 de 43 verdes.** Os dois vermelhos são **herdados**, e a prova está no
próprio git: nenhum dos arquivos que eles acusam está no meu diff.

| portão | o que acusa | de quem |
| --- | --- | --- |
| `acentuacao` | 7 violações, todas em `docs/data/decisoes-dela.csv:200` | entrou em `ec6811aa`, o commit imediatamente anterior a esta branch |
| `referencias-docs` | 7 referências mortas a `scripts/migrar-mapa-v2.py`, em 7 documentos | o arquivo não existe nesta árvore; as citações são de 11 a 27/08 |

**A suíte do escopo:** os 159 arquivos de teste que importam `interface/`, mais
a régua nova, em quatro lotes — **2.438 casos, zero vermelho** (605 · 563 · 619
com 4 `xfail` · 651 com 8 `skip`). A suíte inteira é de quem coordena.

**Uma das oito violações de acentuação ERA minha e caiu:** o sinal novo da linha
18 nasceu `data-campo="primario"`, e o portão pediu o acento. Endereço de tela é
slug, e slug não leva acento — o sinal virou `data-campo="marcador-principal"`,
que diz a mesma coisa sem a dívida. Depois disso o portão acusa 7, não 8.

---

## O QUE FICOU PARA OUTRA POSSE

1. **`interface/pacotes/a08_conexoes.py:2498`, `:2499`, `:2505`, `:2513`** — o
   agrupamento por adaptador de rádio compara `via == "BT"`, a palavra da tela.
   Troque por `transporte == "bt"`; a chave crua já está no item da mesa. Sem
   isso a `via` não pode mudar de palavra. Cinco sprints abertas têm posse.
2. **`interface/monta.py:877`** — `nome in (c["via"], TRAVESSAO)` é o descarte
   que evita `P2 • BT • BT` na fita das dez abas. Mesma troca. `nao_toca:` aqui.
3. **`interface/monta.py:1578-1579`** — a contagem da BANCADA, sobre
   `CONECTADOS` (a cena do desenho). Já estava relatada na §8.
4. **`interface/hefesto_vivo.py:1338` + `monta.fita`** — a fita das dez abas é
   pintada por eles, e o bloco inteiro é trocado antes de a pintura visitar
   campo nenhum: `a09_sistema._html_da_fita` e `a06_navegacao.chips_da_fita`
   emitem `fita-chips` para um nó que já não existe. **Medido hoje**, com e sem
   cor lida. Enquanto isso não mudar, a fita fala a língua de `monta.fita`.
5. **`interface/pacotes/a04_iluminacao.py:1487`, `a06_navegacao.py:953`/`:983`/
   `:1399`, `a10_perfis.py:772`** — só EXIBEM a `via`. No dia em que a `via`
   virar a palavra, eles acompanham de graça; hoje mostram a sigla.
6. **`interface/pacotes/a08_conexoes.py:2937`** — `(c.get("transport") or
   "").upper()` é um sétimo dialeto, do lado das colunas.
7. **`interface/aba08.py:2396` e `:2408`** — retraduzem `via` para
   `cabo`/`rádio` na cena da bancada. Já estava relatado na §8.
8. **`docs/data/paridade-gtk-html.csv:21`** — *"A palavra do transporte no
   cartão"*. É do coordenador, por decisão dele no despacho. **O `html_faz`
   dela agora está errado**: diz `'USB' e 'BT'`, e a aba 01 diz `cabo`/`rádio`.
   O veredito honesto hoje é `IGUAL` no cartão da Jogar, com a ressalva de que
   a contagem do topo fica em sigla por gramática.
9. **`interface/pacotes/a03_gatilhos.py`** — não tinha cópia a matar: lê a `via`
   da mesa com queda para `VIA_DO_TRANSPORTE`, que é o dono da sigla. Ela só
   passa a dizer `cabo` quando a `via` mudar (item 1 e 2). O mesmo vale para
   `a02_controles.py:1797`.
10. **A mesa da bancada tinha UM controle**, não dois. A prova de tela com um no
    cabo e um no rádio — que é a única que distingue as duas palavras na foto —
    continua devendo.
