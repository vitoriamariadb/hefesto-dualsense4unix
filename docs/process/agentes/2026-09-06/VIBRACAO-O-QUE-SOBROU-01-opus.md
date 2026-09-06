# VIBRAÇÃO · O QUE SOBROU — a frase que mandava num botão que não existe, e o "Aplicar" que não retrava

**Sprint:** `VIBRACAO-O-QUE-SOBROU-01` (lote LOTE-2, onda G) · **agente:** opus ·
**árvore:** `hefesto-voo/VIBRACAO-O-QUE-SOBROU-01-opus`, branch
`voo/VIBRACAO-O-QUE-SOBROU-01-opus`, nascida de `onda/atual-0609` em `c15d2e3e`
(conferido: `git log -1` e `git rev-parse --short onda/atual-0609` batem).

**As duas linhas do CSV que a sprint mandava fechar tiveram destinos opostos, e
os dois por MEDIÇÃO:** a linha 177 era MAIOR do que o enunciado dizia — eram
oito frases, não cinco, e a que ninguém tinha nomeado era a única que chega à
tela dela hoje. A linha 182 **CAIU**: a premissa dela não se sustenta em nenhum
dos três degraus do caminho, e os três estão medidos abaixo.

---

## O que mudou

### 1. A LINHA 177 — o dono apontava para um botão que ninguém pode clicar

`rumble_actions.BTN_GIVE_BACK_TO_GAME` valia `"Deixar o jogo controlar a
vibração"`, que era o rótulo do botão do `gui/main.glade`. **O glade não está
mais no disco** (a `GTK-3` o apagou em 06/09, `D-0609-GTK-LEVA-INTEIRA`) e a
interface nova **nunca teve** esse botão: na aba Vibração são dois por coluna,
"Testar" e "Parar", e o `parar` faz os DOIS atos num clique
(`a05_vibracao.parar`: `rumble_stop_checked()` e em seguida
`rumble_passthrough(True)`) exatamente porque o de devolver não existe.

**A medição que decide, e ela é do dono e não da lembrança:** varri o texto
visível de todo `<button>`, `<label>`, `<option>` e `<a>` das **dez páginas
publicadas** — 87 rótulos clicáveis. `"Parar"` está lá. `"Deixar o jogo
controlar a vibração"`, em nenhuma.

O valor virou `"Parar"`, e nasceu a frase pronta do dono:

```python
BTN_GIVE_BACK_TO_GAME = "Parar"
COMO_DEVOLVER_AO_JOGO = f"clique “{BTN_GIVE_BACK_TO_GAME}” na aba Vibração"
```

**O NOME da constante ficou de propósito.** Três arquivos a citam pelo nome em
prosa (`interface/aba05.py:272`, `app/telas/vibracao.py:140`,
`tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py`); renomear quebraria
citações sem curar defeito nenhum. O que estava errado era o VALOR — um rótulo
é a promessa de um botão.

**O rótulo sozinho não bastava**, e por isso a frase pronta diz a aba: "Parar" é
palavra curta que aparece em mais de uma tela, e uma frase que só a cita manda
procurar.

### 2. ERAM OITO FRASES, e o enunciado citava cinco

A varredura da régua nova achou **mais três da mesma família**, no mesmo par de
arquivos que a sprint me deu em posse:

| onde | o que mandava procurar | chega à tela dela hoje? |
| --- | --- | --- |
| `rumble_actions.on_rumble_apply` | "Deixar o jogo controlar a vibração" | não (lápide da janela) |
| `rumble_actions.on_rumble_stop` | idem | não (lápide da janela) |
| `rumble_actions._update_rumble_state_label` (×2) | idem | não (lápide da janela) |
| `status_actions._update_rumble_badge` | "aba Rumble → Deixar o jogo…" | não (lápide da janela) |
| **`rumble_actions.texto_do_alcance_da_intensidade`** | **"Ligue “Jogar pelo Hefesto” na aba Início"** | **SIM** |
| `status_actions._check_initial_poll_fallback` | `clique em "Ligar o Hefesto"` | não (lápide da janela) |
| `status_actions._render_offline` | idem | não (lápide da janela) |

**A SEXTA É A QUE IMPORTA, e ela mandava procurar DUAS coisas inexistentes.** O
aviso de alcance sai em `app/telas/vibracao.textos_do_estado` →
`a05_vibracao.pacote` → o bloco `#vib-estado` da aba Vibração publicada. Ele
dizia *"Ligue “Jogar pelo Hefesto” na aba Início"*, e medido:

* **não há aba "Início"** — são Jogar · Controles · Gatilhos · Iluminação ·
  Vibração · Navegação · Lançadores · Conexões · Sistema · Perfis;
* **"Jogar pelo Hefesto" não é rótulo de nada que se clique.** O que existe é a
  linha `Status` da aba Jogar, com as posições `Ligado` / `Desligado`
  (`01-jogar.html:1752`, `data-gesto="hefesto"`, `data-modo="gamepad"` no
  `Ligado`) — e é o `gamepad` que cria o gamepad virtual cuja falta esta frase
  denuncia. O glossário escreve o mesmo par: *"Status: Ligado / Desligado"*.

A frase passou a ser *"…Ponha o Status em “Ligado” na aba Jogar…"* — 161
caracteres contra os 162 da anterior, porque essa frase já custou uma aba
rolando e quem mede de verdade é
`tests/unit/test_o_aviso_da_vibracao_cabe_na_aba.py`, no navegador.

**O QUE ADIOU ESTA CURA CADUCOU, e está escrito no próprio código.** O
comentário de 03/09 acima da frase já NOMEAVA o defeito e explicava por que não
o consertou: *"a frase está CERTA na janela GTK, que tem a aba Início — é UMA
string com DUAS telas"*. A segunda tela saiu do disco três dias depois, e o que
sobrou foi só a metade errada.

`"Ligar o Hefesto"` — nos dois pontos do `status_actions` — virou `"Reiniciar o
serviço"`, que é botão de verdade da aba Sistema (`09-sistema.html:1244`). **Os
dois juntos, de propósito:** curar um deixaria as duas versões vivas.

### 3. OS ARQUIVOS

| arquivo | o que mudou |
| --- | --- |
| `app/actions/rumble_actions.py` | o valor do dono, a frase pronta `COMO_DEVOLVER_AO_JOGO`, as quatro frases que a usam, o aviso de alcance, e a lápide datada de cada um |
| `app/actions/status_actions.py` | a dica do aviso de vibração travada e os dois banners do serviço fora do ar |
| `interface/pacotes/a05_vibracao.py` | **seis `arquivo:linha`** que apontavam para o dono e envelheceram com a minha edição (o portão `test_portao_o_par_com_metade_ligada` os pegou); um sétimo (`:1111`) apontava para o toast em vez do método que devolve a vibração ao jogo, e foi reapontado (sem escrever o nome do método — ver os portões abaixo) |
| `tests/unit/test_politica_de_vibracao_o_alcance_na_tela.py` | exigia a frase impossível — passou a medir o REQUISITO (*a frase diz onde e qual é o gesto*) em vez de digitar o rótulo |
| `tests/unit/test_status_actions_reconnect.py` | idem, com `"Ligar o Hefesto"` |
| `tests/unit/test_a_vibracao_nao_manda_num_botao_que_nao_existe.py` | **novo** — a régua |

**DUAS RÉGUAS EXIGIAM A FRASE IMPOSSÍVEL.** As duas digitavam o rótulo que
sumiu, e as duas teriam reprovado a cura. É a assinatura que esta casa persegue:
*a régua media o mundo de ontem*. As duas passaram a perguntar ao dono, ou a
medir o requisito em vez do texto.

### 4. A LINHA 182 CAIU — e a queda está medida

O enunciado: *"se o perfil no disco tiver `rumble.weak/strong` não-zero, um
«Aplicar» do rodapé re-manda esses valores e re-trava a vibração que o «Parar»
acabou de soltar"*. **Nenhum dos três degraus do caminho sustenta isso**, e a
medição (`/tmp` não sobrevive, então ela está no docstring da régua e aqui):

1. **o perfil no disco não pode ter esses campos.** `profiles.schema.RumbleConfig`
   tem `extra="forbid"` e TRÊS campos — `passthrough`, `policy`, `custom_mult`.
   `RumbleConfig.model_validate({"weak": 160, "strong": 220})` sai com
   *"2 validation errors … Extra inputs are not permitted"*;
2. **o draft do "Aplicar" nasce zerado, e não do disco.**
   `DraftConfig.from_profile` constrói `RumbleDraft()` sem tocar em
   `weak`/`strong` — o comentário dele já dizia *"weak/strong não persistem no
   perfil (teste de motores)"*. E o `rodape.aplicar` da interface nova chama
   `_draft_do_ativo(nome)` **sem** o `ctx`, então nem o estado vivo entra.
   Medido com um perfil de `passthrough=False, policy="max"`:
   `to_ipc_dict()["rumble"]` → `{'weak': 0, 'strong': 0}`;
3. **e `{0, 0}` no "Aplicar" é o OPOSTO de travar.** É a
   `BUG-RUMBLE-APPLY-KILLS-GAME-01`, escrita no próprio
   `ipc_draft_applier._apply_rumble`: com o par zerado ele faz
   `rumble_active = None` (passthrough) e manda `set_rumble(0, 0)` uma vez, para
   SOLTAR um rumble contínuo anterior. Medido com `rumble_active = (160, 220)`
   — a vibração travada em valor não-zero, o pior caso do enunciado:

   ```
   ANTES:  rumble_active = (160, 220)
   DEPOIS: rumble_active = None | set_rumble = [(0, 0)]
   ```

4. **a quarta perna, que o enunciado nem cita**, responde igual:
   `passthrough=False` no disco também não re-trava, porque
   `Daemon.apply_profile_rumble_passthrough` abre com `if not passthrough: return`.

**A cura da ABAS-04 não precisa de irmã no HTML porque o HTML não tem rascunho a
zerar** — o dele nasce do disco a cada "Aplicar", e o disco não guarda o par.
Onde a GTK precisava de escrita compensatória, a interface nova é imune por
construção. O que fiz foi transformar os três degraus em régua, para que
nenhum deles se desfaça em silêncio.

---

## Qual mordida prova

`tests/unit/test_a_vibracao_nao_manda_num_botao_que_nao_existe.py` — 8 casos,
`8 passed in 0.79s`. Ele lê os rótulos das **dez páginas publicadas** (o dono) e
mede em DUAS leituras independentes: o PRODUTO (chamando
`_update_rumble_state_label`, `_update_rumble_badge` e
`texto_do_alcance_da_intensidade`) e o FONTE (varredura `ast` dos dois arquivos
com as constantes de módulo resolvidas, que alcança as frases que hoje nenhuma
superfície renderiza — e são justamente as que apodrecem).

**MORDIDA 1 — devolver o rótulo da janela aposentada ao dono**
(`BTN_GIVE_BACK_TO_GAME = "Deixar o jogo controlar a vibração"`):

```
5 failed, 3 passed in 0.71s
E  AssertionError: o rótulo de estado da vibração (silêncio) manda procurar
E  “Deixar o jogo controlar a vibração”, e nenhuma das dez páginas publicadas
E  tem esse rótulo clicável.
E    a frase: 'Estado da vibração: <span …>travada em silêncio (clique “Deixar o
E              jogo controlar a vibração” na aba Vibração)</span>'
E    o que fazer: nomeie um rótulo que exista (o dono é `interface/paginas/`),
E                 ou tire a ordem de clique da frase.
```

Reprovaram as duas leituras — o produto e o fonte — e mais a régua que nomeia o
caso pelo nome (`test_o_rotulo_da_janela_aposentada_nao_volta`).

**MORDIDA 2 e 3 — devolver as duas outras frases impossíveis:**

```
3 failed, 5 passed in 0.63s
E  o aviso de alcance da intensidade (aba Vibração) manda procurar
E  “Jogar pelo Hefesto”, e nenhuma das dez páginas publicadas tem esse rótulo…
E  src/hefesto_dualsense4unix/app/actions/rumble_actions.py:416 manda procurar
E  “Jogar pelo Hefesto” …
E  src/hefesto_dualsense4unix/app/actions/status_actions.py:2632 manda procurar
E  “Ligar o Hefesto” …
```

A acusação nomeia **arquivo e linha**, que é o que faz a régua servir a quem a
recebe vermelha.

**MORDIDA 4 — arrancar a cura da linha 182**, trocando a solta pelo travamento
em `ipc_draft_applier._apply_rumble` (`rumble_active = None` → `(0, 0)`):

```
1 failed, 7 passed in 0.73s
E  AssertionError: o «Aplicar» re-travou a vibração — é o sintoma que a linha
E  182 descrevia, e ele voltou.
E  assert (0, 0) is None
```

As quatro curas foram devolvidas e o arquivo voltou verde (`8 passed`). O
`ipc_draft_applier.py` não aparece no meu diff — a mordida foi arrancada e
restaurada.

**E HÁ RÉGUA DA RÉGUA.** `test_a_varredura_do_fonte_realmente_ve_alguma_ordem_de_clique`
exige que a varredura ache pelo menos cinco ordens de clique nos dois arquivos
(hoje são oito). É a armadilha do *instrumento de terceiro sem validar*: uma
varredura que parou de ver o que media dá verde sobre qualquer coisa.

---

## Os portões, e os DOIS que a minha própria cura acendeu

`bash scripts/portoes.sh` → **TODOS VERDES — 45 portões**
(`/tmp/portoes-VIBRACAO-O-QUE-SOBROU-01.txt`).

**Não foi de primeira, e os dois vermelhos ensinam:**

1. **`paridade-gtk-html` VERMELHO** — eu tinha escrito `rumble_actions.on_rumble_passthrough`
   em PROSA, num docstring de `a05_vibracao.py`, para tornar uma citação de
   linha mais precisa. `on_rumble_passthrough` é o `sinal` da linha 177 do CSV,
   declarado AUSENTE do lado HTML — e a régua varre `interface/` pelo símbolo.
   *"o sinal APARECEU … a dívida fechou"*, disse ela, por causa de um
   comentário. Tirei o nome e deixei a razão escrita no lugar dele, porque a
   próxima pessoa vai querer pôr o nome de volta.
2. **`test_portao_o_par_com_metade_ligada` VERMELHO** — as minhas 41 linhas de
   nota datada no dono empurraram os métodos dele para baixo, e SEIS
   `arquivo:linha` de `a05_vibracao.py` passaram a apontar para outro lugar. O
   portão nomeou os dois números de cada um. **Um sétimo já estava errado antes
   de mim** (`rumble_actions.py:1111` apontava para um toast, não para
   `on_rumble_passthrough`) e a régua não o via porque a citação não trazia o
   símbolo ao lado; reapontei-o para a linha certa.

E `acentuacao` pediu marcador em três lugares onde *"a régua **media** o mundo
de ontem"* é o imperfeito do verbo medir, não a "média" — a frase da casa, que
a régua de acentuação não conhece.

## O que NÃO verifiquei

* **NÃO HOUVE PROVA DE APARELHO, e não houve espera.** `bancada.sh status` diz
  LIVRE, mas **nenhum passo desta sprint toca o aparelho**: as duas linhas são
  de TEXTO DE TELA e de payload IPC, e o único trecho que fala com o daemon
  (`_apply_rumble`) foi exercitado com dublê fiel — um controle que registra as
  escritas e um `config` com os campos reais. Não reservei a bancada porque não
  havia o que medir nela. **Nenhuma célula do mapa de canais foi exercitada.**
* **NÃO FOTOGRAFEI A TELA, e digo por quê em vez de fingir.** As sete frases que
  mudei são de widgets GTK da janela aposentada (lápides declaradas no
  `portao_a_casa_sabe_e_o_produto_nao_faz`) — nenhuma delas pinta um pixel. A
  OITAVA, o aviso de alcance, **chega à tela**, mas só no quadrante `vpads == 0
  e não-Nativo`, que exige o daemon vivo sem gamepad virtual; num `--oculta` sem
  daemon a linha não nasce, e uma foto de "antes e depois" idênticos seria
  teatro. O que sobra no lugar da foto é mais forte e está na régua: o rótulo
  que a frase nomeia foi **lido das páginas publicadas**, não decorado. **Uma
  foto da aba Vibração com esse quadrante vivo continua devendo, e é da
  MESA-DE-QUATRO-01.**
* **NÃO CLIQUEI pela ponte JS.** Não acrescentei botão nem gesto; os gestos
  `testar`/`parar` de `a05_vibracao` não foram tocados (a linha 182 caiu antes
  de pedir código).
* **NÃO RODEI a suíte inteira** — é de quem coordena, e em oito lotes.
* **`app/telas/vibracao.py` e `interface/aba05.py` não são minha posse** e não
  os toquei; os dois citam `BTN_GIVE_BACK_TO_GAME` **em comentário**, e o nome
  não mudou, então as citações continuam válidas.

### VINTE E UM VERMELHOS QUE JÁ ESTAVAM AQUI, e não são meus

Rodei os 94 arquivos de teste que citam os dois módulos que mexi:
`23 failed, 1629 passed, 1 skipped`. Repeti a medição **com as minhas mudanças
guardadas no `git stash`**: `21 failed`. A diferença — os DOIS que eram meus —
está curada e nomeada logo acima (as duas réguas que digitavam o rótulo, mais os
seis endereços de linha).

Os 21 restantes vieram de `c15d2e3e` e são de outras posses (`test_a_foto_monta_como_o_produto_monta`
3 · `test_a_mesa_cheia_na_foto` 13 · `test_mesa_cheia_09_toasts_honestos` 2 ·
`test_o_motivo_da_fita_apagada_chega_no_hover` 1 · `test_player01_um_numero_de_jogador` 2).
**Não os investiguei** — medir árvore alheia em movimento é a armadilha de
23/08. Ficam relatados para quem costura.

---

## O que sobrou para o próximo

1. **DUAS FRASES DA MESMA FAMÍLIA, FORA DA MINHA POSSE.** As duas mandam clicar
   em `"Ligar o Hefesto"`, que não existe em página nenhuma:
   * `app/actions/perfis_web.py:329` — *"Hefesto desligado — abra a aba Sistema
     e clique em “Ligar o Hefesto”."*
   * `app/actions/home_actions.py:3369` — *"para ligar de novo, clique em
     "Ligar o Hefesto" aqui mesmo"*.

   O `home_actions` é o pior dos dois: o *"aqui mesmo"* é a aba **Jogar**, onde
   o gesto se chama `Status: Ligado`. **A cura é de uma linha em cada** — trocar
   pelo rótulo que existe —, e a régua que já está no disco as pega assim que
   alguém acrescentar os dois caminhos a `FONTES` em
   `test_a_vibracao_nao_manda_num_botao_que_nao_existe.py`. Não os editei porque
   não são minha posse; **não os pus na régua** porque uma régua que nasce
   vermelha sobre arquivo alheio vira ruído, e ruído é como um portão morre.

2. **A LINHA DO CSV DA PARIDADE, pronta para a `PARIDADE-REMEDIR-02`** (o CSV
   não é minha posse, então entrego o texto):

   **Linha 177** — *Deixar o jogo controlar a vibração (o botão de devolver, sozinho)*
   * `veredito`: `DIFERENTE` (era `FALTA_NO_HTML`)
   * `sinal`: `COMO_DEVOLVER_AO_JOGO`
   * `html_onde`: `src/hefesto_dualsense4unix/app/actions/rumble_actions.py:136 · src/hefesto_dualsense4unix/interface/pacotes/a05_vibracao.py:1783`
   * `html_faz`: *"Não há botão de devolver, e não vai haver: o `parar` da
     coluna faz os dois atos num clique. O que fechou é a FRASE — nenhum texto
     do produto manda mais clicar no botão que saiu com a janela, e
     `test_a_vibracao_nao_manda_num_botao_que_nao_existe` lê os rótulos das dez
     páginas publicadas para reprovar quem o trouxer de volta."*

   **Linha 182** — *Zerar weak/strong (e o passthrough) no rascunho ao parar ou devolver*
   * `veredito`: `IGUAL_POR_OUTRO_CAMINHO` (era `FALTA_NO_HTML`)
   * `sinal`: `test_o_aplicar_do_rodape_nao_retrava_a_vibracao`
   * `html_faz`: *"O HTML não tem rascunho a zerar: o draft do «Aplicar» nasce
     do disco a cada clique (`rodape._draft_do_ativo`) e `RumbleConfig` não
     guarda `weak`/`strong` (`extra=forbid`). A seção que viaja é sempre `{0,
     0}`, e `{0,0}` no «Aplicar» é passthrough, não silêncio fixo
     (BUG-RUMBLE-APPLY-KILLS-GAME-01). Os três degraus estão sob régua."*

3. **UMA DECISÃO DE PRODUTO, tomada por delegação, que NÃO consegui registrar
   onde a sprint manda.** A regra 5 manda escrever em `docs/data/decisoes-dela.csv`
   com `quem_decidiu=delegacao`; o frontmatter da sprint tem `docs/data/` inteiro
   em `nao_toca`. **Obedeci o frontmatter e registro aqui**, para quem tiver a
   posse copiar:

   > **D-0609-A-FRASE-NOMEIA-O-BOTAO-QUE-EXISTE** · `quem_decidiu=delegacao` ·
   > Toda frase do produto que mande clicar nomeia um rótulo que existe nas dez
   > páginas publicadas. Onde o botão da janela GTK sumiu, a frase passa a
   > nomear o gesto equivalente da interface nova: *"Deixar o jogo controlar a
   > vibração"* → *"Parar", na aba Vibração*; *"Ligar o Hefesto"* → *"Reiniciar
   > o serviço"*, na aba Sistema; *"Jogar pelo Hefesto" na aba Início* → *o
   > Status em "Ligado", na aba Jogar*.
   > **REVERSÍVEL NUMA FRASE:** mude o valor de
   > `rumble_actions.BTN_GIVE_BACK_TO_GAME` e as três frases de
   > `status_actions`/`texto_do_alcance_da_intensidade`, e a régua dirá quais.

4. **UM DOCSTRING QUE FALA DA JANELA NO PRESENTE**, em `a05_vibracao.parar`:
   *"Na janela estável são DOIS botões"*. A janela não é mais estável nem
   existe. É prosa de posse minha e eu a deixei de propósito — a sprint não
   pediu, e reescrever tempo verbal de docstring alheio ao assunto é exatamente
   o escopo que cresce sozinho. Fica nomeado.

5. **O AVISO DE ALCANCE MERECE UMA FOTO com o quadrante vivo** (`vpads == 0`,
   não-Nativo, daemon de pé): é a única das oito frases que ela pode ver, e eu a
   mudei sem tê-la visto na tela. É o item mais barato desta lista para a
   MESA-DE-QUATRO-01.
