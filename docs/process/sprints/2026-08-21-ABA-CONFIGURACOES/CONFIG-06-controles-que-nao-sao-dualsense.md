# CONFIG-06 — controles que não são DualSense

**Depende de:** CONFIG-03.
**É a seção 1 da aba** (o desenho numera de 0 a 4, e a 4 é "A janela").

> **Decisão registrada.** [D-A2](DECISOES-ABERTAS.md) foi respondida em
> 21/08/2026 pela manutenção da seção nesta leva — contra a recomendação, e com
> a decisão devidamente registrada. Esta sprint é escrita para essa escolha sair
> bem, não para revisitá-la.

## O que entrega

Um card por aparelho não-Sony conectado, com as declarações que o produto não
consegue deduzir sozinho:

| Declaração | Por que não dá para medir |
|---|---|
| Modo em que o controle foi ligado (XInput / DInput / Switch / macOS) | O modo é escolhido por chave física ou combo antes de conectar, e não é anunciado de forma confiável |
| Rótulo dos botões (Xbox A/B/X/Y ou Nintendo B/A/Y/X) | É preferência de quem joga, não propriedade do aparelho |
| Tratar aparelho não reconhecido como um modelo conhecido | Escape para clones e modelos fora da lista |
| **Cor do plástico, quando não foi lida** | O firmware entrega o código por cabo e por rádio, mas nem todo modelo responde — e nenhum controle não-Sony tem esse campo |

## A regra que mantém a seção honesta

**Onde a medição está pendente, o campo nasce em "não sei" e a tela diz que não
sabe.** Nada de valor default chutado — um default errado aqui é pior que campo
vazio, porque parece informação.

## As quatro medições — aceite desta sprint

Cada uma cabe em minutos, e nenhuma bloqueia a leva. Sem elas, a seção entrega
menos; com elas, entrega o que promete.

1. **O modelo do 8BitDo desta casa é SN30 Pro ou SN30 Pro+?** Decide qual índice
   de firmware vale e qual PID de X-input por rádio se aplica. Já está eliminado
   que seja um Pro 2 (que troca de modo por combo, não por chave física).
2. **Qual o default da Steam para `SteamController_SwitchSupport` quando a chave
   não existe?** Dela depende saber se a cura de Switch/8BitDo do produto já
   rodou alguma vez.
3. **Em modo D-input, o Hefesto vê o controle?** A previsão diz que não, com grau
   MÉDIO. Se não vir, a seção precisa do estado *"não estou vendo nada e sei por
   quê"* — que é entrega, não falha.
4. **Ao pintar a lightbar do 8BitDo em modo DS4, as quatro luzes do plástico
   acendem ou ignoram?** Cinco segundos de olho. Sem a resposta,
   `write_lightbar_slot` (`external_leds.py:338-361`) pode estar escrevendo num
   lugar que não chega a lugar nenhum.

## Rastro obrigatório

`external_controllers.py:9-13` guarda a fala que limitava o escopo (o
docstring de módulo fecha em `:14`; o endereço `:11-14` que esta página
trazia estava errado e foi conferido em 22/08/2026):

> *"só uma aba pra ver como os controles aparecem, não uma super central"*

Essa linha **não sai**. Ganhou a nota datada logo abaixo, apontando para
[D-A2](DECISOES-ABERTAS.md), registrando que em 21/08/2026 o escopo foi
reaberto e por quem. É o padrão que o projeto já usa para decisão revogada:
NOTA DATADA dentro do próprio docstring, nunca apagar o que estava lá.
**Feito em 22/08/2026**, no molde de `core/external_leds.py:337-361`.

## O que continua fora

`EXTERNAL_PLAYER_LED_ENABLED` **não volta** nesta sprint. A docstring fixa a
condição de retorno (E3 da `LUGAR-À-MESA-01`, autorizada só depois da
`MÁSCARA-01`) e diz explicitamente que não é *"quando alguém achar que já dá"*.
Além disso, o defeito do `:blue:player-5` (LED HOME, escala 0-15) teria de ser
corrigido antes.

## A altura dos cards é invariante

Um 8BitDo pede dois campos que um DualSense não pede (modo e rótulo dos botões).
Isso não pode deixar os cards desencontrados na tela: **todos os cards têm a mesma
largura e a mesma altura**, e o seletor de jogador ancora no rodapé de cada um.

No GTK a receita tem **duas metades**, e as duas foram exercidas em 22/08/2026
contra a mesa de cinco (`tests/unit/test_config_06_cards_tem_a_mesma_altura.py`):

* **`Gtk.Grid` com `row_homogeneous=True`** iguala LINHAS entre si. É o que faz o
  card da segunda fileira casar com o da primeira — sem ele, medido: `[224, 224,
  224, 475, 475]`. Sozinho ele NÃO iguala cards vizinhos;
* **`valign=FILL` mais `vexpand=True` em cada card** é o que iguala dois cards da
  MESMA fileira: é o que faz o card curto ocupar a célula inteira em vez de
  encolher para o próprio conteúdo. Sem ele, medido: `[189, 440]`. O único grid
  de cards de hoje (`status_actions.py:1308`) faz o OPOSTO, com `Align.START` — e
  não é engano lá: naquela aba os cards ficam EMPILHADOS por decisão dela
  (`EMPILHA-01`, 02/08), que continua valendo lá e não vale aqui (decisão T7).

Mais um espaçador expansível antes do último bloco, que ancora "Jogador:" no
rodapé de todos. Não é detalhe estético — uma fileira de cards de alturas
diferentes lê como erro de montagem.

## Prova de trabalho

`pytest tests/unit/ -k ...` **não serve**, e a correção é de 22/08/2026: o `-k`
filtra o que RODA, não o que é COLETADO, e a coleta da pasta inteira sobe nós
`uinput` de verdade no kernel da máquina de quem roda (1289 num único dia, em
20/08). Arquivo a arquivo, sempre:

```bash
.venv/bin/python -m pytest \
  tests/unit/test_config_06_declaracao_nasce_em_nao_sei.py \
  tests/unit/test_external_controllers.py \
  tests/unit/test_external_mask.py tests/unit/test_external_leds.py \
  -q --no-header -p no:cacheprovider

xvfb-run -a --server-args="-screen 0 1920x1080x24" .venv/bin/python -m pytest \
  tests/unit/test_config_06_cards_tem_a_mesma_altura.py \
  tests/unit/test_config_01_a_aba_nasce_vazia.py \
  tests/unit/test_config_a_palavra_de_tela_da_aba_montada.py \
  -q --no-header -p no:cacheprovider
```

Geometria roda SEMPRE sob `xvfb-run`: sem gerenciador de janelas uma
`Gtk.Window` fica 1x1 para sempre, e contra o `DISPLAY` da sessão dela duas
sprints desta leva mediram core dump.

**Aceite:** com nenhum controle externo conectado, a seção mostra estado vazio
explicativo em vez de sumir. Com um conectado e modelo desconhecido, aparece o
card genérico. As quatro medições estão respondidas ou registradas como
pendentes **na própria tela**, não só no documento.

---

## Como ficou — 22/08/2026

A seção foi executada com as decisões **T1 a T7** de
[`DECISOES-DA-EXECUCAO.md`](DECISOES-DA-EXECUCAO.md). O que segue é o que ficou
no código, com o preço de cada escolha do lado.

### As quatro perguntas que o PASSO 0 tinha de responder

**1. O modo é derivado ou declarado? DERIVADO (T1).** A dedução ganhou nome
próprio — `external_controllers.modo_deduzido` —, e ela devolve os QUATRO modos
da canônica (`externos-firmware-e-modos.md:145-149`) ou `""` para "não sei".
Chutar um modo aqui seria pior que campo vazio, e declarar seria pior ainda: o
MAC do 8BitDo MUDA com o modo (`docs/usage/troubleshooting-8bitdo.md:130-143`),
então uma declaração gravada por identidade nasce órfã no instante em que a
pessoa troca o modo que a declaração descrevia.

**2. Qual seletor de modo sobrevive? UM SÓ, e ele é read-only (T2).** O do card
é insensível e carrega a MESMA dica da ficha do controle — `MODE_SELECTOR_TOOLTIP`,
importada e não copiada. O `input_mode` da ficha virou PROJEÇÃO de dois estados
do `modo_deduzido`: uma função decide o modo, duas telas o mostram, e nenhuma
pode divergir da outra porque não há uma segunda decisão para divergir.

> **O que ficou aberto, e é honesto dizer:** a ficha do controle continua com
> DOIS botões enquanto o card tem quatro. Trocar a ficha é trabalho em
> `app/gui_dialogs.py` e nas três asserções de
> `tests/unit/test_external_controllers.py` que congelam a lista de dois — os
> dois arquivos são território de outra frente nesta leva. O teste
> `test_a_ficha_do_controle_continua_dizendo_o_que_dizia` guarda a projeção para
> que as duas telas nunca se contradigam enquanto isso não acontece.

**3. A cor do plástico persiste? SIM, no `maquina.json` (T5).** O veto de 12/08
era contra *arquivo por endereço*; a camada de máquina é um arquivo só. O que vai
para o disco é o NOME oficial de fábrica ("Cosmic Red"), nunca o código — o campo
é texto livre por decisão C2.

**4. "Tratar como modelo conhecido"? FORA desta leva (T4).** É máscara, e a
`ExternalMaskRegistry.set_mask` tem condição de retorno própria na `MÁSCARA-01`.
Nenhum método IPC novo nasceu aqui.

### A leitura da cor entrou no produto (T6)

`src/hefesto_dualsense4unix/integrations/cor_do_plastico.py` é o PORTE da leitura
que vivia em `scripts/ensaios/`. Ele traz as duas travas do ensaio inteiras — o
payload montado por função sem parâmetro e conferido byte a byte antes de sair —
porque a família `SET_FEATURE 0x80` é a mesma em que `[1, 1]` RESETA o controle,
e não há desfazer.

Duas tabelas, duas procedências: `NOMES_DE_FABRICA` (três fontes independentes) e
`TONS` (de `docs/data/cores-do-plastico.md`, onde **vinte das vinte e uma linhas
são aproximadas** — só a `05` foi medida por ela). A cópia do ensaio continua lá,
para o instrumento rodar sem o pacote instalado, e o preço dela é o confronto:
`test_as_duas_copias_da_tabela_concordam` compara as duas por AST.

A leitura roda uma vez por endereço e por sessão, só para DualSense NO CABO, em
thread de trabalho. A falha é guardada como falha: sem isso, cada entrada na aba
mandaria de novo o comando de fábrica para os quatro controles dela.

### Onde as quatro medições do aceite aparecem NA TELA

| Medição | Estado | Onde a tela diz |
|---|---|---|
| 1. SN30 Pro ou Pro+? | **pendente** | Não muda nada do que a seção mostra: o modo sai do VID/driver, não do modelo. Fica no documento. |
| 2. Default do `SwitchSupport` da Steam | **pendente** | Fora do escopo desta seção — é da pilha Steam, não do card. |
| 3. Em D-input o Hefesto vê o controle? | **pendente, previsão NÃO** | `FRASE_SEM_CONTROLE`: *"Um controle ligado em modo D-input pode não aparecer aqui — esse caso ainda não foi medido nesta casa."* É o estado "não estou vendo nada e sei por quê". |
| 4. A lightbar do 8BitDo acende as luzes do plástico? | **pendente, e é escrita no aparelho dela** | A seção NÃO promete que acende: o seletor de jogador não diz uma palavra sobre luz, porque `EXTERNAL_PLAYER_LED_ENABLED` é `False` (`external_identity.py:194`). |

### O que ficou pendurado no hospedeiro

    host._refresh_config_controles: Callable[[], None]
        Relê a mesa e redesenha a grade. PRECISA ser acrescentado à tupla de
        `_REFRESH_POR_ABA["tab_config_box"]` em `app/app.py` — a tupla já tem
        `_reexaminar_a_mesa` e `_refresh_saude_da_mesa`, e `app.py` é território
        de outra frente nesta onda. Sem esse acréscimo a grade é montada uma vez
        e nunca mais relida: um controle plugado depois de a janela abrir não
        aparece até reabrir.

    host._controles_leitor: Callable[[], dict] | None   (LIDO, não escrito)
        Ponto de injeção, irmão do `_mesa_leitor` de CONFIG-02. Devolve o payload
        `{"controllers": [...], "external": [...]}`;
        `tests/fixtures/inventario_externos.json` é o dublê da mesa de CINCO.

    host._cor_do_plastico_leitor: Callable[[str], CorDoPlastico | None] | None
        Ponto de injeção da leitura por cabo. Sem ele, a seção fala com o
        `hidraw`.

    host._maquina_pendente   (ESCRITO)
        A seção acumula `{"controles": {<12 hexa>: {"cor"|"botoes": valor}}}`. Ela
        NÃO grava: quem grava é o "Aplicar" do rodapé (`D-A4`).

**A captura de tela** (`scripts/gui-captura/retratar_abas.py`) ainda não monta
dublê para esta seção. Enquanto não montar, a seção se reconhece como bancada de
retrato pelo `_mesa_leitor` que aquele host já monta, e mostra o estado vazio —
em vez de fotografar a mesa dela e, pior, de mandar o comando de fábrica da cor
para os quatro controles durante uma captura.
