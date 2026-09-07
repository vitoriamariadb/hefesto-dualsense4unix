# SPECS-A-PROCEDENCIA-01 — de onde se sabe cada linha, e o ponteiro que se segue

**Árvore:** `hefesto-voo/SPECS-A-PROCEDENCIA-01-opus` · branch
`voo/SPECS-A-PROCEDENCIA-01-opus`, nascida de `onda/atual-0609` em `52b81893`
(conferido: `git log -1` == `git rev-parse onda/atual-0609`).
**Bancada:** não exigida — nenhum caminho desta sprint para o daemon, escreveu
no aparelho ou chamou `systemctl`. Nenhum controle foi tocado.
**Janela:** nenhuma. Esta sprint não abre tela.

---

## O que mudou

### 1. O PISO DA PROCEDÊNCIA É ZERO — 30 células fechadas

O enunciado de 26/08 contava **62 afirmações sem procedência**. Medido hoje, com
o mapa em **308 linhas e 616 células**, o número que sobrava era outro:

| medido em 06/09/2026 | antes | depois |
| --- | ---: | ---: |
| células que declaram `de_onde_sei` e não apontam prova nenhuma | **30** | **0** |
| `radio_codigo_ref` dizendo `idem` no lugar do endereço | **7** | **0** |
| células com `de_onde_sei = medido` e nenhum ponteiro | 0 | 0 |
| células que AFIRMAM (`sim`/`parcial`) com `de_onde_sei` vazio | 0 | 0 |

**O achado que dá nome à leva: `idem` é pior que vazio.** Sete células de
`radio_codigo_ref` diziam `idem` — a palavra ocupa a coluna do ponteiro e não
aponta. Ela é legível por gente que abre as duas metades da linha lado a lado, e
ilegível por todo o resto: o `validar-citacoes-de-linha.py` não a confere, a
`mesa_de_medicao` a publica como se fosse endereço, e quem abre só a metade do
rádio não tem para onde ir. As sete ganharam o endereço que a palavra escondia.

As outras **23** ganharam o `grep` ou o `arquivo:linha` que as sustenta, **cada
um conferido rodando o comando** — não copiado de prosa. Exemplos, com o que a
varredura devolveu:

| célula | o que passou a apontar |
| --- | --- |
| `plataforma.nfc@dualsense` (os dois lados) | `grep -ni 'nfc'` no `hid-playstation.c` → ZERO; em `src/` só o dump gerado `app/fatos_do_mapa.py` |
| `luz.led_home@dualsense` (os dois lados) | `hid-playstation.c:278`, `:1019`, `:1988` — é tudo o que o caminho DualSense registra; o LED HOME é do Pro, `hid-nintendo.c:143` |
| `energia.bateria.percentual@pro` [rádio] | `hid-nintendo.c:2654` (`joycon_battery_props`), `:2672-2674` — ÚNICA para o driver inteiro, sem variante por bus |
| `gatilho.modos_firmware@pro` (os dois) | `hid-nintendo.c:131` (`JC_SUBCMD_TRIGGERS_ELAPSED`), a única constante de gatilho do driver — e ela não é modo de firmware |
| `luz.lightbar.aviso_de_modo@pro` e `@sn30` | `grep -niE 'lightbar|rgb'` no `hid-nintendo.c` → ZERO |
| `energia.desligar@dualsense` (os dois) | `core/ds_output_report.py:196` — o único byte de energia que este projeto toca |

### 2. A RÉGUA — `tests/unit/test_a_procedencia_da_linha_nao_e_vazia.py`

Cinco nós, **quatro duros e um de forma**, e nenhum deles é teto de
conveniência: os quatro duros nascem com zero legado.

1. `test_a_celula_que_afirma_diz_de_onde_sabe` — a frase 1 da sprint. A regra 19
   do `check_paridade_transporte.py` já cobre a célula com CONTEÚDO escrito;
   esta cobre **o `sim` pelado**, que passava.
2. `test_a_celula_medida_aponta_a_prova` — `de_onde_sei = medido` sem UM
   ponteiro. É a mais dura de propósito: `medido` é a palavra mais forte deste
   mapa, e dizer "eu medi" sem dizer onde está a medição é a forma exata do
   instrumento que dá verde sobre nada.
3. `test_o_ponteiro_da_procedencia_se_pode_seguir` — a família `idem`. `—` e
   `não-localizado` **não** caem aqui: as duas dizem *"não há endereço"*, que é
   resposta; `idem` diz *"o endereço está noutro lugar"* sem dizer onde.
4. `test_toda_procedencia_declarada_aponta_a_prova` — o piso ZERO.
5. `test_a_mesa_e_a_procedencia_leem_as_mesmas_colunas` — a guarda contra a
   divergência com a mesa (§4 abaixo).

### 3. A PERGUNTA GANHOU DONO — `procedencia_da_celula()`

`scripts/check_paridade_transporte.py` (na `posse:`) passou a ser o dono da
pergunta *de onde se sabe esta célula*. `procedencia_da_celula(linha, lado,
ensaios)` devolve os **ponteiros que se pode seguir**: o carimbo (`provado_em` +
`provado_por`), a mordida (`teste_que_morde`), o endereço (`*_codigo_ref`), a
fonte de fora (`fonte_externa`), a evidência com endereço e o ensaio do caderno.
A régua **importa** o dono em vez de reimplementar — a alternativa era a segunda
leitura das mesmas colunas, que envelhece calada.

Ele mora ali, e não num módulo novo, porque aquele arquivo já tem
`DOMINIO_POR_SUFIXO`, `SUFIXOS_DE_CONTEUDO` e o casamento com o caderno. Um
módulo à parte seria a segunda cópia das mesmas constantes.

### 4. A MESA E A PROCEDÊNCIA — a régua existe, a costura fica RELATADA

`scripts/mesa_de_medicao.py` **não está na minha `posse:`**, então não a editei.
Ela monta o COMO de cada célula em `_como_da_celula` (`scripts/mesa_de_medicao.py:329-345`)
lendo seis colunas do CSV por conta própria, e **duas delas são as mesmas** que a
procedência lê: `*_codigo_ref` e `teste_que_morde`.

O nó 5 da régua compara os dois, célula por célula, e reprova a divergência.
**O melhor desfecho continua sendo a mesa PERGUNTAR ao dono**, e o endereço é
uma linha só:

```python
# scripts/mesa_de_medicao.py, dentro de _como_da_celula
from check_paridade_transporte import procedencia_da_celula
# o par ("código", …) e o par ("teste que morde", …) passam a sair de
# procedencia_da_celula(r, lado).ponteiros, em vez de r[f"{lado}_codigo_ref"]
# e r["teste_que_morde"] lidos aqui.
```

Enquanto isso não acontece, o nó 5 é a rede — e ele **mordeu**: trocando a
coluna que a mesa lê, a régua reprovou nomeando 20 células.

### 5. AS CINCO PEQUENAS DA `A-RECUSA-QUE-CITOU-O-MAPA-01` §4

| item | o que era | o que ficou |
| --- | --- | --- |
| **(a)** | `audio.microfone.volume@dualsense` dizia `divida` nos dois lados, com a decisão DATADA no código (SOM-SEMPRE-01 / AUDIO-OWNER-01) | os dois lados passaram a `decisao-tomada`, com a razão escrita na `ressalva` — `divida` chama alguém para trabalhar, `decisao-tomada` não |
| **(b)** | as duas linhas de emulação de mouse citavam `core/mouse_emulation.py`, **que não existe nesta árvore**, e apontavam a régua em `:144` (a linha do `raise`) | os donos reais (`daemon/subsystems/mouse.py`, `integrations/uinput_mouse.py`) e a régua pelo **node id**, não pela linha. O mesmo endereço morto saiu do docstring de `test_o_mouse_emulado_nao_pergunta_o_fio.py` — e lá havia um TERCEIRO: `test_o_caminho_do_mouse_nao_le_transporte`, um teste que não existe naquele arquivo |
| **(c)** | nenhuma régua avisava quando `aciona != não` e a causa está preenchida | **regra 20, `causa-sem-negativa`**, AVISO. Ver §6 — ela achou o dobro do que a §4.5 previa |
| **(d)** | `check_a_tela_nao_promete_o_que_o_mapa_nega.py` não existe | **não foi criado**, como a rota mandou. A régua desta casa é a `Fala` de `app/fala_do_mapa.py`, e o `fatos_do_mapa.py` regenerado é o que a tela lê |
| **(e)** | posse de DIRETÓRIO faz o `colisao-de-sprints` nascer vermelho | esta sprint declara ARQUIVOS no frontmatter, e o portão nasceu verde |

### 6. A LEVA DE HOJE ENTROU NO MAPA — 11 células

A `ROTA CORRIGIDA` manda transcrever o que os agentes de hoje devolveram em
`mediu: [{chave, transporte, ate_onde_foi, viu}]`. Cruzei `_lotes/LOTE-1` e
`LOTE-2` (`saida.json`) com o mapa: **onze células tinham `ate_onde_foi` VAZIO e
um agente declarou `MONTOU` nelas.** As onze receberam `MONTOU` e uma linha de
evidência datada com a sprint, o commit e o relatório:

`luz.lightbar.release_leds@dualsense` (2) · `energia.bateria.leitura_hefesto@dualsense` (2) ·
`audio.alto_falante@dualsense` [rádio] · `audio.saida_dedicada@dualsense` [cabo] ·
`audio.microfone.mudo@dualsense` [rádio] · `combinacao.slot_jogador.estabilidade@dualsense` (2) ·
`plataforma.slot_jogador@dualsense` (2).

**`MONTOU` é o degrau que a suíte sustenta sozinha** — nenhuma das onze exigiu
ensaio no caderno, e nenhum aparelho foi tocado por esta escrita.

### 7. As saídas geradas

`html/specs.html` (308 linhas) e `src/hefesto_dualsense4unix/app/fatos_do_mapa.py`
(308 chaves) regenerados pelos donos (`gerar-mapa.py`, `gerar-fatos-de-tela.py`).
`docs/data/ensaios.csv` **não ganhou linha nenhuma** — ensaio só entra com ensaio
feito, e as linhas da bancada de hoje são da MESA-DE-QUATRO-01.

---

## Qual mordida prova

Cinco mordidas, uma de cada vez, com a cura devolvida num `finally` — a árvore
de trabalho voltou intacta em todas (`git status --short` conferido depois de
cada uma).

**Intacto:** `5 passed in 0.32s`.

| # | o que arranquei | o nó | resultado |
| --- | --- | --- | --- |
| 1 | `cabo_de_onde_sei` de `entrada.botoes@dualsense`, que afirma | `test_a_celula_que_afirma_diz_de_onde_sabe` | `1 failed` |
| 2 | TODO ponteiro de `audio.microfone.mudo@dualsense` [rádio] (`provado_*`, `teste_que_morde`, `fonte_externa`, `radio_codigo_ref`, `radio_evidencia`) | `test_a_celula_medida_aponta_a_prova` | `1 failed`, nomeando a célula |
| 3 | devolvi `idem` a `plataforma.vpad@sn30` [`radio_codigo_ref`] | `test_o_ponteiro_da_procedencia_se_pode_seguir` | `1 failed` |
| 4 | esvaziei `cabo_codigo_ref` de `luz.lightbar.aviso_de_modo@pro` | `test_toda_procedencia_declarada_aponta_a_prova` | `1 failed` |
| 5 | fiz a mesa ler `*_evidencia` no lugar de `*_codigo_ref` | `test_a_mesa_e_a_procedencia_leem_as_mesmas_colunas` | `1 failed`, nomeando 20 células divergentes |

**A mordida 2 falhou na primeira tentativa, e isso é achado, não acidente.** Eu
mirei `entrada.botoes@dualsense` e o teste PASSOU com a cura arrancada: aquela
célula tem ensaio no caderno, e o ensaio é ponteiro. A régua estava certa e a
minha mordida é que era fraca — refiz contra uma célula cujos ponteiros são
todos removíveis, e ela reprovou. *Régua que passa com a cura arrancada não mede
nada; mordida que não arranca tudo não é mordida.*

**Os portões:** `git add -A && bash scripts/portoes.sh` — a saída inteira está em
`/tmp/portoes-SPECS-A-PROCEDENCIA-01.txt`, e a camada rápida fechou
**TODOS VERDES — 28 portões** antes da completa.

---

## O que NÃO verifiquei

- **Nada foi medido em aparelho.** Nenhum DualSense, nenhum Pro, nenhum 8BitDo
  foi tocado. Todo grau que este trabalho escreveu é `MONTOU`, que é o degrau
  que a suíte sustenta sozinha, e nenhuma célula foi promovida a `medido`.
- **A régua cobra que o ponteiro EXISTA e se possa SEGUIR, nunca que ele diga a
  verdade.** Que o byte seja 11 e não 47 continua sendo bancada. É o mesmo
  limite honesto que a docstring do `check_paridade_transporte.py` já declara
  para a regra 19, e esta régua fica do mesmo lado dele.
- **Os 23 endereços novos foram conferidos rodando o `grep`/abrindo o arquivo,
  não lendo prosa** — mas eu não reli o argumento de cada célula. Confirmei que
  o endereço existe e que ele sustenta a frase; não reabri a inferência que
  produziu o veredito da célula em 03/09.
- **Não rodei a suíte inteira** (regra da casa: ela é de quem coordena, no fim,
  em oito lotes). Rodei o meu escopo e a lista de portões.
- **As cinco chaves da fila do F-MAPA** (`A-TELA-NOVA-ENTRA-NA-REGUA-DO-MAPA-01`
  §3.1) **não foram remedidas** — ver abaixo, e o porquê está lá.
- **`_lotes/LOTE-3` e `LOTE-4` não têm `saida.json`** no disco no momento em que
  li. O que a leva de hoje declarou por `chave` entrou pelos LOTE-1 e 2; o que
  os outros dois declararem fica para quem costurar.

---

## O que sobrou para o próximo

1. **A COSTURA COM A MESA, e ela é UMA LINHA.** `scripts/mesa_de_medicao.py`
   está fora da minha `posse:`, então o nó 5 da régua é a rede e não a cura. O
   endereço exato está na §4 acima. **Quem tiver a mesa na posse, faça-a
   importar `procedencia_da_celula` e o nó 5 vira tautologia** — que é o
   desfecho certo.

2. **A §4.5 da `A-RECUSA` contou UMA e a régua achou QUATRO — e a diferença é a
   palavra `parcial`.** O relatório dizia que `movimento.acelerometro@dualsense`
   é a *única* linha com causa preenchida ao lado de um `aciona` que não é `não`.
   A regra 20, rodando, devolve **quatro células**:

   | célula | hoje |
   | --- | --- |
   | `movimento.acelerometro@dualsense` [cabo] e [rádio] | `sim` + `so-ela-decide` — legítimo, a ressalva diz que é de propósito |
   | `audio.microfone@dualsense` [rádio] | **`parcial` + `divida`** |
   | `audio.microfone.mudo@dualsense` [rádio] | **`parcial` + `divida`** |

   A leitura de 06/09 procurou `aciona = sim` e deixou `parcial` de fora. **As
   duas que faltavam são o microfone por rádio — exatamente a chave que a fila
   do F-MAPA (§3.1) manda remedir**, e cujo `radio_detalhe` já diz
   `IMPLEMENTADO POR INTEIRO` desde a CANAL-POR-CONTROLE-01. *O veredito da
   célula ficou atrás do detalhe dela mesma, e agora há régua nomeando isso a
   cada execução do portão.* **Quem medir o microfone por rádio na
   MESA-DE-QUATRO-01 fecha as duas.**

3. **A fila do F-MAPA (cinco chaves) continua aberta, e a razão é de DONO.** As
   cinco (`identidade.cor_do_aparelho`, `identidade.cracha_nos_dois_transportes`,
   `audio.microfone`, `luz.lightbar.release_leds`, `plataforma.taxa_relatorios`)
   pedem **remedição**, não procedência: em quatro delas a tela afirma uma coisa
   e a célula outra, e resolver isso é decidir qual das duas está velha — o que
   pede o aparelho (P2, dela) ou uma decisão de produto. A única que **não pede
   aparelho** é `plataforma.taxa_relatorios@dualsense`: os dois números já foram
   medidos (250,0 Hz exatos no cabo com três fontes; 38 a 392 Hz por rádio, e os
   1000 Hz do SDL desmentidos) e o que falta é **escrevê-los de volta na célula**,
   com o caminho pronto — `NUMEROS_MEDIDOS_NO_MAPA` em
   `integrations/radio_da_mesa.py`, que a régua Z6-08 já cobra. **É a mais barata
   das cinco e não estava na minha posse (`src/`).**

4. **`plataforma.adocao@dualsense` foi exercitada pela `BORDA-DE-QUEDA-01` com
   `SAIU NO FIO`, e eu NÃO escrevi o degrau.** O agente foi explícito: *"nenhum
   DualSense foi tocado"* — o `fio` dele é o socket unix do broker, não o cabo
   do controle. `SAIU NO FIO` é grau forte e **exige ensaio no caderno** (regra
   6); escrevê-lo sem ensaio é exatamente o buraco de 12/08/2026 que aquela
   regra existe para fechar. **A célula continua com os dois lados vazios, e a
   decisão de promovê-la é de quem tiver o caderno na posse.**

5. **Quatro chaves que os agentes de hoje relataram e que NÃO EXISTEM no mapa:**
   `gatilho.adaptativo.set`, `gatilho.adaptativo.reset`, `perfil.triggers.global`
   e `interface.03-gatilhos.em-todos` (todas da `GATILHOS-EM-TODOS-01`), mais
   `led.auto_release` (da `A-TRAVA-DO-LED-NAO-SOLTA-01`, que já declarou não
   precisar de célula). As quatro primeiras não são canal de aparelho — são
   perfil e tela —, então provavelmente o mapa não é a casa delas. **Vale
   decidir se `perfil.*` e `interface.*` entram no `mapa-controles.csv` ou se o
   vocabulário de `chave` da devolução dos agentes precisa dizer quando a chave
   é de outro dono** — hoje um agente pode relatar por uma `chave` que não casa
   com nada e ninguém percebe.

6. **`ponte_de_onde_sei` continua vazia em 298 de 308 linhas**, e isso **não** é
   dívida desta régua: a coluna responde *por qual PONTE a feature chega ao
   jogo*, e a regra 15 do portão já cobra o caso que importa (afirmação forte
   por `uhid` sem `ponte_alcanca` — hoje ZERO). Não a cobrei de propósito:
   reprovar 298 linhas por uma coluna que a regra 15 já protege no ponto certo
   seria portão desligado na primeira semana. **Fica dito para não ser
   redescoberto como buraco.**
