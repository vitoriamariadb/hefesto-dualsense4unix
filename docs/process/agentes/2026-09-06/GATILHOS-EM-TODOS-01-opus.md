# GATILHOS-EM-TODOS-01 — editar em "Todos" escreve a seção global

Árvore `hefesto-voo/GATILHOS-EM-TODOS-01-opus`, branch
`voo/GATILHOS-EM-TODOS-01-opus`, nascida de `onda/atual-0609` (`39fa440d`,
conferido contra `git rev-parse --short onda/atual-0609`).

## O que mudou

**A linha 110 do CSV da paridade fechou do lado do mecanismo, e o botão que a
alcança espera a palavra dela.**

### 1. O defeito, medido antes da cura

**Toda** escrita de gatilho da interface nova era por MAC. Os quatro gestos que
gravam — `modo`, `pronto`, `ajuste` e `guardar` — passam por
`a03_gatilhos._com_os_gatilhos`, que escreve em `controllers[uniq].triggers`.
Não havia, em toda a tela, caminho nenhum para `profile.triggers`. E é essa
seção que um aparelho novo herda: `profiles/manager.py:450` a aplica em
broadcast, e `_controllers_to_specs` só cobre quem tem override.

Consequência com dois controles na mesa: ela põe `Rígido` nos dois, liga um
terceiro — e o terceiro nasce com o gatilho de ontem. **Ela não tem como saber
por quê**, porque os dois primeiros estão certos.

### 2. O gesto `em-todos` — o produto, e está completo

`src/hefesto_dualsense4unix/interface/pacotes/a03_gatilhos.py`

* **`em_todos`** (`@gesto("03-gatilhos.html", GESTO_DE_TODOS,
  grava="_gravar_so_o_gatilho")`) — o par L2+R2 da coluna vai aos controles e ao
  perfil. Copiado campo a campo do gêmeo na GTK,
  `app/actions/triggers_actions._persist_params_to_draft` no ramo
  `alvo_de_edicao(self).uniq is None`.
* **`_com_os_gatilhos_de_todos`** — as duas metades do que a GTK faz:
  1. escreve o lado editado na seção **global** do perfil;
  2. **tira aquele lado dos overrides por controle de todo mundo**, com a regra
     de `app/draft_config.with_override_fields_cleared` (*"uma edição em 'Todos'
     vale para todo mundo"*). Seção que esvazia vira `None`; entrada sem seção
     **some do mapa** — e a regra de quando um override some é importada de lá
     (`_override_vazio`), não reescrita.
* **O envio vai em BROADCAST**, sem `uniq`, que é o que a GTK faz no alvo
  `TODOS` (`_apply_trigger` passa `uniq=None`) e o que
  `ipc_bridge._payload_trigger_set` traduz em *"não põe a chave no pedido"*.
  Isto é o **oposto** do ABAS-06 que o `_uniq` desta aba documenta: lá o alvo era
  um controle e o pedido saía sem endereço; aqui o alvo é a mesa inteira, por um
  botão cujo texto diz isso.
* **`_aplicar` ganhou `lembrar_em`** — com o broadcast o `uniq` do envio não é
  endereço de ninguém, e o rascunho guardado sob `""` seria podado pela varredura
  de mesa no tique seguinte: as quatro colunas voltariam ao valor do disco. O
  choke point do rascunho continua sendo uma função só.
* **`_o_par_da_coluna`** — o miolo do `guardar` virou função, porque o
  `em_todos` precisa do mesmo par. Escrito duas vezes, o segundo é o que esquece
  o `TRAVESSAO`, e `—` gravado seria um `Off` explícito silenciando, no perfil de
  todo mundo, um gatilho que o perfil dava aos quatro.
* `PISO_DA_ABA` 5 → 6, e uma entrada nova em `PROVAS` que **morde o broadcast**:
  ela declara `{"uniq": ""}`, então endereçar o pedido reprova.

### 3. O botão — na bancada, PROVISÓRIO, e declarado

`src/hefesto_dualsense4unix/interface/aba03.py` · `mockup/03-gatilhos.html` ·
`mockup/DIVERGENCIAS.md`

Cada coluna ganhou **"Em todos"** na faixa de ação, e **"Guardar esse efeito"
encurtou para "Guardar"** — porque, medido, os três não cabiam.

**A medição, no Chrome a 1920x1080, com a página parada (`--oculta`, nenhuma
janela na tela dela):**

| arranjo | campo do nome | Guardar | Em todos | sangria |
| --- | --- | --- | --- | --- |
| com o rótulo longo | **16px** | 123px | 66px | **24px** |
| com "Guardar" | 66px | 58px | 66px | **0** |

Faixa de 202px, rolagem lateral zero na página e no quadro. Um campo de 16px é
um campo que não se digita.

**Por que na coluna e não na faixa do título**, que é onde a `a04_iluminacao` pôs
o escopo global dela: a 04 espalha um ESTADO, que não tem origem; esta espalha um
EFEITO, e o efeito é o par de UMA coluna. Um botão na faixa do título teria de
escolher a coluna de origem sozinho, e escolher a do P1 seria a tela afirmando o
que ninguém pediu. A faixa do título ficou **medida e vaga (980px livres)**, para
a próxima pessoa não remedir.

**Por que o encurtamento não é invenção minha:** é o que ela pediu noutro botão
em 31/08 — *"aonde tem Voltar ao automático deixa só Automático"* —, e a frase
inteira virou o `?` do botão, que é onde esta casa põe a explicação.

**NADA FOI PUBLICADO.** `--publicar 03` é ato dela. O produto que ela abre hoje
não ganhou um pixel, e o custo disso está escrito na declaração: o mecanismo
existe e **ninguém o alcança** enquanto a página publicada não tiver o botão.

## Qual mordida prova

`tests/unit/test_editar_em_todos_escreve_a_secao_global.py` — 15 réguas. São
**duas** mordidas, e elas mordem metades diferentes; a segunda foi o que fez
nascer uma régua que a primeira versão não tinha.

**Mordida A** — trocar `_com_os_gatilhos_de_todos(prof, dos_lados)` por
`_com_os_gatilhos(prof, uniq, dos_lados)`, que é o produto de antes desta sprint
escrito de novo:

```
6 failed, 7 passed
FAILED ...::test_o_em_todos_escreve_a_secao_global_do_perfil
FAILED ...::test_o_lado_editado_sai_dos_overrides_por_controle
FAILED ...::test_o_lado_que_ela_nao_tocou_fica_no_override
FAILED ...::test_um_terceiro_controle_herda_o_efeito_no_motor
FAILED ...::test_um_terceiro_controle_herda_o_efeito_na_tela
FAILED ...::test_o_perfil_que_ja_esta_assim_nao_e_regravado

AssertionError: o terceiro controle vai receber 'Off' no L2. Com a escrita por
MAC ele recebe o gatilho de ontem, e ela não tem como saber por quê: os dois
primeiros estão certos.
```

**Mordida B** — apagar só o laço que limpa os overrides, deixando a global
escrita:

```
3 failed, 11 passed
FAILED ...::test_o_lado_editado_sai_dos_overrides_por_controle
FAILED ...::test_quem_ja_estava_na_mesa_passa_a_receber_o_efeito_novo
FAILED ...::test_o_lado_que_ela_nao_tocou_fica_no_override

AssertionError: o controle que já estava na mesa continua com opinião própria no
L2 — o `OutputSpec` dele vence o broadcast da seção global, e o efeito que ela
acabou de pôr 'em todos' não chega justamente a quem ela tem na mão.
```

**O que a mordida B ensinou, e vale registrar:** o caso do TERCEIRO controle fica
**VERDE** com ela — o terceiro nunca teve override e herda a global de qualquer
jeito. Quem paga a mordida B são os aparelhos que **já estavam na mesa**. Se a
régua do "sai dos overrides" não existisse separada da régua do terceiro
controle, a metade mais visível deste gesto — a que ela sente na mão no mesmo
segundo — não teria régua nenhuma. Foi por medir isso que nasceu
`test_quem_ja_estava_na_mesa_passa_a_receber_o_efeito_novo`, que pergunta ao
MOTOR (`profiles/manager._controllers_to_specs`).

**A herança é medida pelos DOIS donos**, de propósito: o motor
(`_controllers_to_specs` + o broadcast de `manager.py:450`) e a escada que a tela
pinta (`a03_gatilhos._modo_de_agora`). Os dois leem o perfil por caminhos
diferentes — pydantic e JSON cru —, e já houve dia nesta casa em que discordaram.

### A prova de tela

* **A FOTO, `--oculta`, nenhuma janela na sessão dela:**
  `GATILHOS-EM-TODOS-01-antes-o-publicado.png` (o que ela abre hoje) e
  `GATILHOS-EM-TODOS-01-depois-a-bancada.png` (o desenho de agora).
* **O CLIQUE**, com o MESMO coletor do piloto (o `closest` + a varredura de
  `[data-linha],[data-campo]` copiados do `hefesto_vivo.BOOTSTRAP`):

```
[data-controle="p1"] [data-gesto="em-todos"] -> {"gesto": "em-todos",
    "achou_coluna": true, "controle": "p1", "modo_e": "Machine",
    "modo_d": "Bow", "campos": 29}
[data-controle="p2"] [data-gesto="em-todos"] -> {"gesto": "em-todos",
    "achou_coluna": true, "controle": "p2", "modo_e": "SemiAutoGun",
    "modo_d": "Rigid", "campos": 26}
```

* **A GEOMETRIA**, no mesmo Chrome: faixa 202px, último elemento terminando
  exatamente na borda (`sobra_px: 0`), `rolagem_x: 0`, `rolagem_quadro: 0`.

### Os portões

`bash scripts/portoes.sh` — ver `/tmp/portoes-GATILHOS-EM-TODOS-01.txt`.

## O que NÃO verifiquei

* **NÃO HOUVE APARELHO.** `bancada: false` no frontmatter, e não pedi a bancada:
  o caminho inteiro deste gesto é dublê de ponte mais perfil no disco. **Nenhum
  byte saiu para um DualSense**, e nada aqui prova que o daemon vivo aceita um
  `trigger.set` sem `uniq` do jeito que a ponte diz que aceita. A leitura é do
  fonte (`ipc_bridge._payload_trigger_set`, `triggers_actions._apply_trigger`),
  não do fio. A prova de aparelho fica para a `MESA-DE-QUATRO-01`.
* **O TERCEIRO CONTROLE É DE PAPEL.** A herança foi medida no perfil e nas duas
  funções que o resolvem — nunca com um terceiro DualSense ligando depois do
  clique. É a mordida que a sprint pede e é a que só a bancada fecha.
* **O CLIQUE NÃO PASSOU PELO WEBKIT.** Ele passou pelo Chrome com o coletor do
  piloto copiado. Não passou pelo `hefesto_vivo` com o daemon vivo, e não podia:
  o piloto abre sempre a página **publicada**, e ela não tem este botão. Enquanto
  ela não publicar, não há como dirigir este botão por dentro do produto.
* **O RECADO DO CARTÃO não foi visto na tela.** `_RECADO_DE_TODOS` é devolvido
  pelo gesto e as réguas o cobram como valor; ninguém o viu pintado, pela mesma
  razão acima.
* **Não medi o `title` do botão renderizado** — só que ele está no HTML. A dica
  aparecendo inteira, sem sangrar pela borda, é medição que a
  `05-vibracao` já pagou uma vez e que aqui ninguém fez.
* **Não rodei a suíte inteira.** Rodei o escopo (412 testes) mais as réguas
  vizinhas de tela (46). A suíte é de quem coordena.

## O que sobrou para o próximo

1. **A PALAVRA DELA, e é o que trava tudo.** O botão e o rótulo encurtado estão
   só na bancada. O fecho é `scripts/check_o_desenho_aprovado.py --publicar 03`,
   depois do OK dela na aba inteira. Enquanto isso, o gesto `em-todos` tem dono e
   ninguém o alcança — pôr o mesmo efeito em dois controles continua criando dois
   ajustes separados, e o terceiro continua não pegando nada.
2. **A LINHA DO CSV DA PARIDADE, pronta para a `PARIDADE-REMEDIR-02` recolher**
   (não editei `docs/data/`, que é `nao_toca` desta sprint):

   * linha **110** · veredito **`TEM_NO_HTML`**
   * `sinal` (código, não prosa):
     `interface/pacotes/a03_gatilhos.py::em_todos` e
     `interface/pacotes/a03_gatilhos.py::_com_os_gatilhos_de_todos`
   * `html_onde`:
     `src/hefesto_dualsense4unix/interface/pacotes/a03_gatilhos.py` ·
     `src/hefesto_dualsense4unix/interface/aba03.py`
   * `html_faz`: *"o botão «Em todos» de cada coluna manda o par L2+R2 aos
     controles em broadcast, escreve o efeito na seção global do perfil e tira
     aquele lado dos overrides por controle — é a regra de
     `draft_config.with_override_fields_cleared`, no `Profile` em vez de no
     rascunho. O botão está na BANCADA e espera o `--publicar 03`."*
3. **A MEDIÇÃO DA 04 E DA 05, que a sprint mandou fazer — e a PREMISSA CAIU nas
   duas.** A sprint diz: *"se o 'Todos' delas também grava por MAC, é o mesmo
   defeito de produto"*. **Não grava, e o motivo é diferente em cada uma.**

   **Aba 04 (Iluminação) — leitura, não posse.** Ela TEM escopo global e ele
   está CERTO: `a04_iluminacao.py:3488`, o gesto `auto-todos`
   (`GESTO_DO_AUTOMATICO_DE_TODOS`), religa `leds.auto_player_colors` na seção
   GLOBAL **e** limpa `lightbar` + `lightbar_brightness` de TODOS os overrides —
   é o gêmeo campo a campo de `lightbar_actions.on_lightbar_auto_reset_all`. É a
   mesma forma de duas metades que esta sprint construiu para o gatilho.

   **O que a 04 não tem, e é outra linha:** o `auto-todos` só DESFAZ. Não há, no
   HTML, caminho para ESCREVER a seção global de luz — `_com_a_cor_gravada`
   (`:2799`), `_com_o_brilho_gravado` (`:2579`) e `_com_o_desenho_gravado`
   (`:3213`) escrevem os três por MAC, sempre. Para a COR isso é a decisão dela
   de 03/09 (*"nenhuma cor dos controles nunca pode ser a mesma"*) e escrever
   global seria contrariá-la. Para o **brilho** não há regra nenhuma que o
   impeça, e o buraco é o mesmo do gatilho: um controle ligado depois herda o
   `lightbar_brightness` global de ontem. **É isso que vai para a
   `ILUMINACAO-O-AVISO-DOS-N-01`** — e a cura já tem forma pronta:
   `_com_os_gatilhos_de_todos` deste commit, trocando `triggers` por `leds` e o
   lado pelo campo.

   **Aba 05 (Vibração) — leitura, não posse. NÃO HÁ "Todos", e quem o tirou foi
   ELA.** `forca` e `intensidade` (`a05_vibracao.py:1535`) gravam por MAC via
   `draft.with_controller_rumble`, e `motor` por `rumble_motores_set`. A linha de
   escopo global existiu e **saiu em 05/09** por decisão dela, citada no próprio
   pacote (`a05_vibracao.py:93`): *"não é pra ter mesa em nada da interface (…)
   segue os três modos sempre"*. **Então a cura da 05 NÃO é um botão "Em
   todos"** — propor um seria repropor o que ela recusou. O buraco medido é o
   mesmo (o HTML nunca escreve `profile.rumble`, e é ele que um controle novo
   herda), e a `VIBRACAO-O-QUE-SOBROU-01` precisa de uma pergunta a ela, não de
   uma cópia deste botão.
4. **UM FATO QUE ENVELHECEU EM ARQUIVO ALHEIO, e eu relato em vez de editar**
   (§2 do protocolo): a docstring de
   `tests/unit/test_o_reenvio_sai_do_pacote_quando_sair_do_produto`
   (`tests/unit/test_a_aba_03_gatilhos_fecha_as_linhas.py:575`) manda *"baixe
   `PISO_DA_ABA` de 5 para 4"* e a mensagem do `assert` diz *"o `PISO_DA_ABA`
   continua cobrando 5 gestos"*. O piso é **6** desde esta sprint; os dois números
   viram **6 para 5** e **6 gestos**. Nada reprova por causa disso — é prosa —,
   mas é a instrução que a próxima pessoa vai seguir no dia do `--publicar 03`.
5. **DOIS ARQUIVOS FORA DA MINHA POSSE FORAM TOCADOS, e declaro os dois:**

   * **`src/hefesto_dualsense4unix/interface/monta.py:291`** — a citação
     `aba03.py:882` estava **já errada em `39fa440d`** (o `c["via"]` estava na
     877), e o meu `+1` de import a fez cair numa **linha em branco**, que é o
     que o portão `citacoes-no-codigo` recusa. Medi com `grep -n` e troquei para
     **878**. É um número, não uma decisão; deixá-lo vermelho seria entregar a
     leva com portão quebrado, e pô-lo em `_CITACOES_PENDENTES` seria afrouxar a
     régua num caso em que a medição é de uma linha.
   * **`mockup/DIVERGENCIAS.md`** — a seção `## 03-gatilhos.html` ganhou a
     declaração do botão. É o livro em que esta casa escreve *"o desenho andou e
     o produto ainda não recebeu"*, e mudar a bancada sem declarar seria a
     escolha em silêncio que o §8 do protocolo proíbe.

6. **A REGRA 5 DA SPRINT E O `nao_toca` DELA SE CONTRADIZEM.** A regra manda
   registrar decisão de PO em `docs/data/decisoes-dela.csv`; o frontmatter põe
   `docs/data/` em `nao_toca`. O frontmatter é o contrato (§2 do protocolo),
   então **as duas decisões de PO desta sprint estão relatadas aqui e não lá** —
   o botão "Em todos" na coluna e o encurtamento de "Guardar esse efeito". As
   duas são **REVERSÍVEIS NUMA FRASE**: *devolva o texto longo ao "Guardar" e
   tire o "Em todos" do `aba03.coluna()`*. Quem tiver a posse de `docs/data/`
   leva as duas para o CSV.

7. **O `guardar` e o `em-todos` gravam por caminhos irmãos e falam por canais
   diferentes**, e isso já era divergência declarada antes de mim: o ramo de
   ABRIR o perfil devolve frase (verde de 6s) e o de GRAVAR levanta
   `RuntimeError` (laranja de 30s), como a `AS-DUAS-ABAS-FALAM-01` §5 mede. O
   `em_todos` seguiu o canal do `RuntimeError` nos dois ramos, porque o efeito
   dele **é** o perfil: sem gravar, o botão não fez o que o nome promete. Se
   alguém alinhar os canais, alinhe os três juntos.
