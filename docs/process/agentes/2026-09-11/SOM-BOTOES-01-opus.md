# SOM-BOTOES-01 — os botões do som fazem o que dizem?

> *"tipo sobre o som ta funcionando como deveria mas não sei se os botões*  <!-- noqa-acento: citação literal dela -->
> *funcionam lá como deveriam. eu não sei explicar funciona mas sinto que tem*  <!-- noqa-acento: citação literal dela -->
> *algo errado."*  <!-- noqa-acento: citação literal dela -->

**Ela estava certa, e os dois defeitos moram no mesmo lugar: a fileira de três
botões do alto-falante.** O primeiro é o que ela sentiu sem saber nomear — o
botão do meio **nunca acendia**, em nenhuma circunstância, na página que já o
publica quatro vezes.

---

## O que mudou

### 1. «Ouvir junto» nunca acendia — e a régua que existia mediu o dublê

`a02_controles.A_FILEIRA_TEM_TRES` valia `False` com a página publicada
trazendo o botão. A mesma função, duas respostas — medido:

```
A_FILEIRA_TEM_TRES (o valor do import)  : False
_a_pagina_tem_o_ouvir_junto() agora     : True
a página PUBLICADA tem o «junto»?       : True
```

**São três defeitos empilhados na mesma linha**, e cada um sozinho já bastava:

| # | o defeito | o que ele fazia |
| --- | --- | --- |
| 1 | a atribuição rodava **antes** de `PAGINA` existir — ela estava na linha 1513, a constante na 1923 | `NameError` no import |
| 2 | `except Exception` engolia esse `NameError` | erro de programação devolvido como *"a página não tem o botão"* |
| 3 | lia a **BANCADA** (`onde.pagina(PAGINA)`, cujo padrão é `mockup/`) | perguntava ao arquivo que o produto não renderiza |

O 3 era LATENTE (hoje as duas páginas concordam) — mas é o mesmo *"régua que
pergunta no lugar errado"* que o `_enderecos_da_pagina` **desta mesma aba** já
tinha resolvido com `publicado=True`, com a razão escrita ao lado: *"o piloto
abre SEMPRE o publicado"*.

**O que ela via:** clicava «Ouvir junto», o gesto gravava `fonte: mix` no perfil
daquele controle — e a fileira continuava acesa no botão de antes.

```
rota=2 fonte='mix' -> aceso_da_fileira = 'jogo'      ← antes
rota=2 fonte='mix' -> aceso_da_fileira = 'junto'     ← depois
```

**E NENHUMA RÉGUA VIA, porque a que existia mediu o próprio dublê.** As quatro
de leitura de `test_a02_a_fonte_do_som_ganha_gesto.py` passam por uma fixture
que faz `monkeypatch.setattr(a02, "A_FILEIRA_TEM_TRES", True)`. Ela nasceu em
10/09, quando a página ainda não tinha o botão e o `False` era a verdade; o
`--publicar 02` de `5fdbf090` mudou o mundo e a fixture continuou afirmando o
mundo de ontem. **Medido: com os três defeitos de volta no lugar, aquela régua
fecha 12/12 verde.**

A cura: a atribuição desceu para depois de `PAGINA`, a leitura passou a
`publicado=True`, e o `except` estreitou para `(OSError, UnicodeDecodeError)` —
as duas maneiras de um ARQUIVO faltar. Qualquer outra exceção sobe, no import,
onde ninguém consegue não ver. **É o `except` estreito que impede a linha de
voltar para cima em silêncio.**

### 2. Sair de «Todo o som do PC» para «Ouvir junto» deixava o firmware lá

O ramo do «junto» devolvia a saída padrão do sistema (camada 1) e **não tocava
no byte da rota** (camada 2). Vindo de «Todo o som do PC», isso deixa o firmware
em `SAIDA_SO_NO_ALTO_FALANTE` com a camada 1 de volta na televisão — o
desacordo exato que `audio_saida.recado_da_rota` existe para denunciar:

```
byte ANTES  (3): 'o alto-falante deste controle está roteado para receber todo
                  o som, mas a saída padrão do sistema não é ele (…) Clique em
                  "Todo o som do PC" para mandá-lo para cá.'
byte DEPOIS (2): ''
```

O cartão acendia «Ouvir junto» e publicava, na mesma coluna, a frase mandando
ela clicar no botão que acabara de largar. **A tela mandando desfazer o clique
que ela deu.**

A cura é **condicional de propósito**: só quando o byte publicado é exatamente
o de «Todo o som do PC». Vindo de «Sons do jogo» ele já é o certo, e reenviá-lo
escreveria no aparelho uma escolha que ela não fez — que é o contrato do
`test_o_junto_nao_manda_byte_de_rota_ao_daemon` da régua irmã, preservado. E
`None` (o daemon nunca publicou `speaker`) não é «todo o som do PC»: sem bloco,
o gesto continua calado.

### A tabela dos botões — §4.1, medida com dublê

`A_FILEIRA_TEM_TRES = True`. Mesa de dois (P1 alvo, P2 vizinho):

| botão | chama quem | perfil do dono | vizinho | estado é LIDO? |
| --- | --- | --- | --- | --- |
| [mic] Microfone | `mic_canal_set_detalhado(True, uniq=P1)` | `mic {muted: False}` | INTACTO | sim — `audio.luz_do_mic` do daemon |
| deslizante do Microfone | `mic_volume_set_detalhado(42, uniq=P1)` | `mic {volume: 42}` | INTACTO | sim — não há campo de leitura; é escrita |
| Virtual / Nativo | `machine_declare({controles:{aabbcc000001:{microfone:True}}})` | (não é perfil: é `maquina.json`) | INTACTO | do DISCO, em cache invalidado pelo próprio gesto |
| [nota] Alto-falante | `speaker_set(muted=True, uniq=P1, volume=100)` | `speaker {volume:100, muted:True}` | INTACTO | sim — `speaker_do_entry`, três estados |
| deslizante do Alto-falante | `speaker_set(volume=65, uniq=P1)` | `speaker {volume:65}` | INTACTO | sim — mesma curva que pinta o número |
| Sons do jogo | `speaker_set(rota=2, uniq=P1, volume=100)` + camada 1 devolver | `{rota:2, fonte:'sfx'}` | INTACTO | sim — as duas camadas |
| Ouvir junto (de «jogo») | — (só camada 1 devolver) | `{fonte:'mix'}` | INTACTO | sim |
| **Ouvir junto (de «pc»)** | **`speaker_set(rota=2, uniq=P1, volume=100)`** + camada 1 | **`{rota:2, fonte:'mix'}`** | INTACTO | sim |
| Todo o som do PC | `speaker_set(rota=3, uniq=P1, volume=100)` + camada 1 mandar | `{rota:3}` | INTACTO | sim |

**Pergunta 1 (chama alguém?):** os quatro gestos de som (`mudo`, `volume`,
`rota`, `mic-modo`) têm dono no registro. Há régua nova cobrando isso contra a
página publicada.

**Pergunta 3 (vale só para o dono?):** **sim, e está medido botão a botão** —
toda chamada leva `uniq=`, e o perfil do vizinho ficou intacto nos nove casos. A
única coisa global é a **camada 1** (a saída padrão do PipeWire), e ela é global
por natureza, já declarada como tal em `profiles/schema.py:523`.

**Pergunta 4 (lido ou lembrado?):** tudo lido. O único cache é o
`_DECLARADOS` do `mic-modo` — e ele se invalida no próprio gesto.

### Na tela, no WebKit de verdade (`--oculta`)

Página publicada dirigida por `scripts/regua_de_tela.py` (`Gtk.OffscreenWindow`,
desviada para o Xvfb `:80` — nada chegou à tela dela):

```
[data-gesto="mudo"][data-mudo="microfone"]        -> 4
[data-gesto="mudo"][data-mudo="alto-falante"]     -> 4
[data-gesto="volume"][data-volume="microfone"]    -> 4
[data-gesto="volume"][data-volume="alto-falante"] -> 4
[data-gesto="mic-modo"]                           -> 8
[data-gesto="rota"]                               -> 12
[data-gesto="escolher-na-fita"]                   -> 3

o pacote emite 'jogo'  -> acende 4: ['Sons do jogo']
o pacote emite 'junto' -> acende 4: ['Ouvir junto']
o pacote emite 'pc'    -> acende 4: ['Todo o som do PC']
o pacote emite ''      -> acende 0: NENHUM (a fileira apaga inteira)
```

**A armadilha do dia, e ela é a de sempre:** as três primeiras tentativas
mediram `0` para tudo. A página tem 1.793 nós e `_esperar_a_pagina` volta antes
de o DOM assentar — *uma régua que pergunta no primeiro instante mede nada e
chama isso de resposta*. Um `avancar(1.0)` resolveu, e a diferença entre `0` e
`12` era só o relógio.

### Medi e NÃO achei — §4.3, para ela não remedir

Três desconfianças que **não** viraram defeito. A razão de cada uma fica escrita
porque o silêncio aqui faz alguém pagar a medição de novo.

1. **«Sons do jogo» perderia o caminho de volta do som.** A hipótese era que
   `devolver_o_som_do_pc()` cria uma `RotaDeSaida` NOVA a cada chamada, logo a
   memória de *"de onde o som veio"* morreria com a instância que a gravou — e
   «Todo o som do PC» ficaria sem desfazer. **Caiu na leitura do dono:** a
   memória não é da instância, é do disco (`_ler_anterior`/`_gravar_anterior`,
   em `gui_preferences.json`), e `voltar_ao_anterior` ainda confere o sink
   guardado contra a lista viva antes de usá-lo. Uma instância nova lê a mesma
   memória. *A hipótese não explicava o que já funcionava.*
2. **Um botão de som mexeria no microfone pelo bit 0 dos `enables` do `0x35`**
   (a pista da §3, e o defeito real de 10/09). **Não acontece por esta tela:**
   nenhum dos cinco gestos do alto-falante chama outra coisa que `speaker_set`,
   e o `mic_canal_set_detalhado` só sai do [mic]. O fio do `0x35` fica onde estava
   — é do daemon, e o `nao_toca:` desta sprint o protege.
3. **O estado dos botões seria LEMBRADO em vez de lido** (§2, pergunta 4).
   **Não:** os nove campos da coluna saem do `state_full` a cada tique. O único
   cache é o `_DECLARADOS` do `mic-modo`, que guarda o `maquina.json` — e ele se
   invalida no próprio gesto (`_controles_declarados(recarregar=True)`), que é a
   única porta que o muda hoje, com a janela GTK fora do disco desde 06/09.

---

## Qual mordida prova

Régua nova: `tests/unit/test_a02_os_botoes_do_som_fazem_o_que_dizem.py`,
**19 testes**. Ela **não monkeypatcha `A_FILEIRA_TEM_TRES` em teste nenhum** —
é a diferença inteira entre ela e a de 10/09.

**MORDIDA 1 — os três defeitos do guarda, devolvidos ao lugar** (atribuição
acima de `PAGINA`, leitura na bancada, `except Exception`):

```
A_FILEIRA_TEM_TRES = False
aceso_da_fileira(mix) = jogo
...
FAILED ::TestOGuardaDaFileira::test_o_valor_do_import_bate_com_a_pagina_publicada
FAILED ::TestOGuardaDaFileira::test_ele_pergunta_ao_publicado_e_nao_a_bancada
FAILED ::TestOGuardaDaFileira::test_um_erro_de_programacao_nao_vira_fato_sobre_o_desenho
FAILED ::TestOQueATelaAcende::test_com_mix_a_fileira_acende_o_ouvir_junto
E       AssertionError: assert 'jogo' == 'junto'
4 failed, 15 passed
```

**E A CONTRAPROVA, que é o achado de processo deste dia** — com o defeito
INTEIRO de volta, a régua de 10/09 continua verde:

```
$ pytest tests/unit/test_a02_a_fonte_do_som_ganha_gesto.py -q
12 passed in 0.63s
```

**MORDIDA 2 — o ramo que devolve o byte da rota, arrancado:**

```
FAILED ::TestSairDoTodoOSomDoPC::test_o_junto_vindo_do_pc_devolve_o_byte_da_rota
FAILED ::TestSairDoTodoOSomDoPC::test_o_cartao_para_de_mandar_desfazer_o_clique_dela
FAILED ::TestSairDoTodoOSomDoPC::test_o_perfil_lembra_as_duas_metades_e_so_do_dono
FAILED ::TestSairDoTodoOSomDoPC::test_um_daemon_que_recusa_nao_deixa_o_perfil_a_meio_caminho
4 failed, 15 passed
```

**Com as duas curas devolvidas**, a régua nova mais as seis vizinhas do som:

```
104 passed in 4.21s
```

Cada teste carrega a sua mordida na docstring, inclusive as que provam o
**contrário**: `test_arquivo_que_nao_abre_continua_sendo_um_nao` (tirar o
`except` inteiro derrubaria o import da aba por causa de um botão) e
`test_vindo_de_sons_do_jogo_ele_continua_calado` (a cura alargada escreveria no
aparelho uma escolha que ela não fez).

---

## O que NÃO verifiquei

* **A ORELHA DELA — e é a §5 da sprint.** Nenhuma linha deste trabalho tocou o
  aparelho. A ponte é de papel, a camada 1 é dublê, o tocador é dublê e o `HOME`
  vai para um diretório temporário.
* **NÃO reservei a bancada, e ela estava LIVRE.** A decisão é declarada: o
  `abrir_interface.py` **dela estava de pé** (PID 28670) no momento da medição, e
  os gestos de som da coluna escrevem no aparelho (`speaker.set`,
  `mic.canal.set`) e **mexem na saída padrão do sistema** (`pactl
  set-default-sink`). Clicá-los ao vivo teria movido o som da máquina que ela
  está usando. `bancada: false` na sprint, e o preâmbulo é explícito: sem
  `exigir` com rc=0 se constrói com dublê e a linha de prova fica para a
  MESA-DE-QUATRO-01.
* **O clique ao vivo na fileira**, portanto, não foi feito. O que se prova aqui
  é a cadeia inteira menos o último palmo: o gesto chama o método certo com o
  `uniq` certo (dublê), o pacote emite `"junto"` (produto), e a página publicada
  tem quatro botões que acendem com esse valor (WebKit). **Falta ouvir.**
* **A ressalva do cartão `alto-ressalva` eu medi pela função dona**
  (`audio_saida.recado_da_rota`), não lendo o DOM vivo com o daemon: reproduzir
  o desacordo na tela exigiria pôr o byte em 3 no aparelho dela.
* **`aceso_da_fileira` com a camada 1 lida:** medi com `_CAMADA_1` vazio (o
  caminho que cai em `rota_na_tela`). O ramo com `pactl` de verdade não foi
  exercitado — ele roda subprocesso na máquina dela.
* **Se o `--publicar 02` é necessário: NÃO, e é medido.** A cura é do PACOTE
  (Python), não do HTML. A página publicada já traz os três botões desde
  `5fdbf090`; o que faltava era o pacote emitir o terceiro valor. Não toquei
  `mockup/02-controles.html` nem `aba02.py`, e a tela dela muda na próxima vez
  que ela abrir o produto.

---

## O que sobrou para o próximo

1. **`escolher-na-fita` é `data-gesto` SEM DONO** — três `<label>` na página
   publicada, e `pacotes.gesto_da_pagina("02-controles.html",
   "escolher-na-fita")` devolve `None`. Não é defeito visível: o chip é um
   `<label for=…>` e quem abre o card é o CSS. Mas cada clique dela produz um
   `[gesto sem dono]` no piloto. **Não curei: é a FITA, não a coluna de som** —
   §1 da sprint escopa o trabalho à coluna de som, e tirar o atributo é mudança
   de desenho. Para quem possuir `aba02.py`.
2. **Uma citação do mapa já estava podre ANTES desta leva, e o portão é cego a
   ela.** `docs/data/mapa-controles.csv:23` diz *"o docstring de
   `a02_controles.py:3921` usa esse mesmo `title` como PROVA"*. Em `HEAD` aquele
   parágrafo estava na linha **4040** (hoje 4115) e a 3921 caía no meio do gesto
   `volume`. O `citacoes-de-linha` passa porque procura outra palavra na faixa.
   Para a SPECS-A-PROCEDENCIA-01, que é dona do mapa: o símbolo é
   `mic_modo`, parágrafo *"A FRASE DA TELA VIROU O ARGUMENTO"*.
3. **«Todo o som do PC» sai cortado do card** na página publicada, à largura de
   1180 px — visível na foto. Não medi o vão; é a família da GATILHOS-VAO-01.
4. **A prova de aparelho da fileira**, com ela ouvindo: clicar «Ouvir junto» com
   o som do PC na televisão e confirmar que ele passa a sair **também** no
   plástico, sem sair da TV; e depois clicar saindo de «Todo o som do PC» e
   confirmar que a TV volta e a ressalva não aparece. **~2 min por controle.**

---

## Fora da posse — declarado

Dois arquivos que **não** estão na `posse:` desta sprint foram tocados, e os
dois pela mesma razão: **conserto do estrago que a minha própria edição fez.**

| arquivo | o que mudou | por quê |
| --- | --- | --- |
| `docs/data/mapa-controles.csv` | UMA citação de linha: `a02_controles.py:3986` → `:4061` | a minha edição moveu `def mic_modo`; o portão `citacoes-de-linha` acusou. **Reapontado por SÍMBOLO** (`def mic_modo`), nunca por aritmética. A afirmação do mapa não mudou — só o endereço |
| `html/specs.html` | 3 linhas, geradas | consequência obrigatória da linha acima: `scripts/gerar-mapa.py`, que é o dono declarado, e o portão `mapa-de-canais` reprova sem ele |

Nenhuma célula, nenhum `aciona`, nenhum grau de escada foi tocado.

---

## Linhas da sprint que caíram

* **A nota «ROTA CORRIGIDA» que o prompt manda ler no topo da sprint NÃO
  EXISTE.** O arquivo da minha árvore é byte-idêntico ao do `_integra-0911`
  (`diff` limpo) e nenhum dos dois tem a nota. Segui o corpo.
* **§2, pergunta 2 — *"o que ele diz que fez bate com o que fez?"*** A sprint
  supunha o risco no *"pisca verde sem mudar nada"*. O que se mediu foi o
  contrário: o gesto **fazia** (gravava `fonte: mix` no perfil certo, do
  controle certo) e a **tela é que não dizia**. O botão não mentia sobre o ato;
  a fileira mentia sobre o estado.
* **§3 — *"o `mix`/`sfx` (a fonte) NÃO tem gesto na tela"*.** Caducou em 10/09:
  o gesto existe (`rota` · `junto`, `5fdbf090`) e o que faltava era acender.
  Não criei gesto nenhum, como a sprint manda.
