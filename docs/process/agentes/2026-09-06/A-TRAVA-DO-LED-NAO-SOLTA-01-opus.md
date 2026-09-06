# A TRAVA DO LED NÃO SOLTA · 01 — o par que faltava, e ele tinha de ser o último

**Agente:** opus · **Branch:** `voo/A-TRAVA-DO-LED-NAO-SOLTA-01-opus` · **Base:**
`39fa440d` (`onda/atual-0609`, conferido) · **Bancada:** LIVRE, e não foi
reservada — `bancada: false`, e nada aqui escreve byte no aparelho.

## O que mudou

**O defeito, e ele estava medido desde 29/08:** `led.set` e `led.player_set`
ARMAVAM a trava manual da categoria `"led"` e **nenhuma linha de `src/` a
soltava**. Enquanto qualquer categoria está armada o `AutoSwitcher` não reaplica
o perfil por troca de janela, então a única saída era ela trocar de perfil na
mão — um gesto que a pessoa não tem como saber que precisa fazer. `trigger`
tinha o `trigger.reset`, `rumble` tinha o `rumble.passthrough`; a luz não tinha
porta de volta, e o botão que significa *"pode voltar a mandar"* estava na tela
o tempo todo sem falar com o daemon.

**1. A rota que solta, e SÓ a luz.** `led.auto_release`
(`daemon/ipc_handlers.py:1534`, `_handle_led_auto_release`), registrada em
`daemon/ipc_server.py`. Ela chama `clear_manual_trigger_active("led")` e mais
nada: soltar as quatro apagaria um gatilho ou uma vibração deliberada de outra
aba, que é a regressão do ABAS-05 e a razão escrita da assinatura por categoria.
Não escreve byte nenhum no controle e **não aceita `uniq`** — a trava mora no
`StateStore` e não tem dono por controle (`_manual_override_categories` é um
dicionário categoria → carimbo, um por daemon); o campo `escopo` da resposta diz
isso em vez de deixar quem chama supor.

**2. O botão passou a chamá-la, e ele é o TERCEIRO passo.**
`interface/pacotes/a04_iluminacao.automatico` faz agora três coisas, nesta
ordem: `lightbar.reset` (larga o claim da barra) → `led.set` (pinta a cor do
slot, para a barra não ficar preta) → `led.auto_release`.

**A ORDEM É O CONSERTO INTEIRO, e é por isso que a rota é própria.** A sprint
oferecia três caminhos (rota nova, parâmetro no `_handle_led_set`, parâmetro no
`_handle_lightbar_reset`) e **os dois últimos não funcionam**: o `led.set` do
passo 2 ARMA a categoria, então qualquer release pendurado nos passos 1 ou 2
sairia desfeito na linha seguinte — a trava voltaria armada e o botão
continuaria mentindo, com a régua verde. Medido: pus o release antes da pintura
de propósito e a régua da ordem reprovou (ver "Qual mordida prova", mordida 4).

**3. O texto novo: nenhum.** O botão, o rótulo ("Automático") e o `title` já
existiam no mockup aprovado — *"Tira a cor escolhida à mão e devolve a
automática"*. O que a sprint fez foi ligar o que ele já prometia por escrito.
Nada nesta entrega é decisão dela.

**4. A régua do par** — `tests/unit/test_toda_categoria_de_trava_tem_par.py`,
criada. Ela percorre `MANUAL_OVERRIDE_CATEGORIES` (a constante, nunca uma lista
à mão) e varre `src/` **por AST**, não por `grep`: a palavra aparece dentro de
três blocos longos de comentário neste código, e um `grep` contaria a menção
como chamada — verde sobre um par que não existe. 17 passam, 1 xfail.

**A LÁPIDE VIVA.** `audio` continua sem par (é a E1 da ÁUDIO-QUE-TRANCA-01) e
entra como `xfail(strict=True)` com o endereço e a razão. No dia em que aquela
E1 fechar, o marcador vira XPASS, a suíte reprova, e alguém vem apagar a linha.

**5. Os fatos que a mudança tornou errados, substituídos onde apareciam:**

| onde | o que dizia | o que diz |
| --- | --- | --- |
| `state_store.py`, tabela do teto | `led` → solta em **nada** | marcada `(†)` com a data do par; a tabela fica, é o censo que motivou o teto |
| `state_store.py`, `MANUAL_OVERRIDE_STALE_AFTER_SEC` | — | nota nova: o parágrafo "por que um teto e não um clear" continua CERTO sobre a JANELA GTK (lá nada mudou); o que mudou é que a interface nova tem um gesto que ESCREVE, e nele não há cor manual pendente |
| `state_store.clear_manual_trigger_active` | "`led` e `audio` NÃO têm chamador" | `led` tem, e é o `led.auto_release`; `audio` continua sem |
| `test_a_trava_que_ninguem_solta_01.py` | `sem_par == {"led","audio"}` | cobra o par das três e mantém `audio` como a dívida — **o armadilha-relógio daquela sprint disparou e foi respondido** (ver abaixo) |
| `test_os_botoes_tem_dono.py` | o "Automático" faz DUAS chamadas | TRÊS, e a posição da terceira é afirmada |
| `docs/protocol/ipc-unix-socket.md` | 44 métodos | 45, bloco **regerado pelo gerador** (nunca à mão) + contrato em prosa do método novo |

**O ARMADILHA-RELÓGIO DA SPRINT IRMÃ DISPAROU, e é o melhor achado do dia.** A
A-TRAVA-QUE-NINGUÉM-SOLTA-01 deixou em
`test_o_par_de_cada_categoria_esta_declarado` uma asserção que dizia, com todas
as letras: *"no dia em que a aba Iluminação ligar o 'Voltar ao automático' ao
daemon, este teste reprova e alguém vem aqui apagar a linha"*. Foi exatamente o
que aconteceu — ele ficou vermelho no primeiro `pytest` depois da cura,
**nomeando `led`**, e a mensagem de erro dele continha a lista de tarefas desta
entrega. *Dívida que não envelhece calada funciona.*

## Qual mordida prova

Quatro mordidas, todas executadas, com a saída copiada.

**Mordida 1 — a cura arrancada (o `clear` some do handler).**
`self.store.clear_manual_trigger_active("led")` → `pass`:

```
FAILED test_toda_categoria_de_trava_tem_par.py::test_toda_categoria_tem_quem_a_solte[led]
FAILED test_toda_categoria_de_trava_tem_par.py::test_o_par_da_luz_esta_no_handler_certo
FAILED test_toda_categoria_de_trava_tem_par.py::test_o_gesto_da_luz_solta_so_a_luz
FAILED test_toda_categoria_de_trava_tem_par.py::test_a_resposta_nao_promete_alcance_por_controle
FAILED test_toda_categoria_de_trava_tem_par.py::test_o_autoswitch_volta_a_agir_depois_do_gesto
5 failed, 12 passed, 1 xfailed

E  AssertionError: a categoria 'led' ARMA e nada em `src/` a solta: nenhuma
   chamada de `clear_manual_trigger_active('led')`. (…) Soltas hoje: ['rumble', 'trigger']

E  AssertionError: depois do 'Automático' a troca de janela seguinte tem de
   reaplicar o perfil. (…)
E  assert [] == ['shooter']
```

Ela reprova **dizendo "led"**, que é o que a sprint pedia. Cura devolvida:
`17 passed, 1 xfailed`.

**Mordida 2 — a régua digita em vez de ler.** Troquei os dois
`sorted(MANUAL_OVERRIDE_CATEGORIES)` do arquivo por `["trigger", "led",
"rumble", "audio"]`:

```
FAILED test_toda_categoria_de_trava_tem_par.py::test_esta_regua_le_as_categorias_em_vez_de_digitar
1 failed, 16 passed, 1 xfailed

E  AssertionError: esta régua digitou a lista das categorias em vez de ler
   `MANUAL_OVERRIDE_CATEGORIES`: [(136, ['trigger','led','rumble','audio']),
   (293, ['trigger','led','rumble','audio'])].
```

Ela acha **as duas**, com o número da linha. *Régua que digita o que devia LER é
a forma exata das onze de 26/08.*

**Mordida 3 — o `clear` sem categoria (a regressão do ABAS-05).**
`clear_manual_trigger_active("led")` → `clear_manual_trigger_active()`:

```
FAILED …::test_toda_categoria_tem_quem_a_solte[led]
FAILED …::test_o_par_da_luz_esta_no_handler_certo
FAILED …::test_o_gesto_da_luz_solta_so_a_luz
FAILED …::test_o_autoswitch_continua_calado_se_outra_categoria_esta_armada
4 failed, 13 passed, 1 xfailed

E  AssertionError: o gesto da luz levou junto o gatilho, a vibração ou o volume
   que ela deixou deliberadamente em outra aba.
E  assert frozenset() == frozenset({'a...', 'trigger'})
```

**Mordida 4 — a ordem (a que prova o desenho).** Movi o
`p.chamar("led.auto_release")` para ANTES da pintura da cor do slot:

```
FAILED test_os_botoes_tem_dono.py::test_o_gesto_chama_a_funcao_certa[a04_iluminacao-auto]
FAILED test_os_botoes_tem_dono.py::test_o_automatico_larga_o_claim_e_deixa_a_cor_padrao
2 failed, 61 passed

E  AssertionError: o 'Automático' fez ['chamar', 'chamar', 'led_set_detalhado'],
   e devia largar o claim, então pintar, e então soltar a trava.
E  At index 1 diff: 'chamar' != 'led_set_detalhado'
```

É a mordida que separa esta entrega de uma que *parece* certa: com o release no
lugar errado o produto continua armando sem soltar, e as réguas 1 e 3 ficariam
todas verdes — o `clear` existe, ele é só desfeito na linha seguinte.

**O clique, e onde ele para.** O gesto foi acionado de verdade, pela função
`@gesto` real com a `PonteDeMentira` (`test_os_botoes_tem_dono`, o instrumento
declarado desta casa para "o gesto chama o daemon"): três chamadas, na ordem,
com os argumentos conferidos. O handler foi acionado por um `IpcServer` **real**
(construtor de verdade, sem socket no ar), não por um dublê de handler — um
dublê seria mais frouxo que o daemon vivo, que é a assinatura dos três
instrumentos falsos de 04/09. E o encontro com o resto do sistema foi medido com
o `AutoSwitcher._activate` de verdade: com só `led` armada ele cala; depois do
gesto, a troca de janela seguinte reaplica o perfil — **em milissegundos, sem
andar o relógio**, de propósito, para provar que quem soltou foi o GESTO e não o
teto de ociosidade de seis horas.

**Portões:** `bash scripts/portoes.sh` → **TODOS VERDES — 45 portões**; saída em
`/tmp/portoes-A-TRAVA-DO-LED-NAO-SOLTA-01.txt`.

**E DOIS PORTÕES REPROVARAM ANTES DISSO, os dois por efeito colateral do meu
próprio diff — vale registrar porque pega todo mundo que acrescenta linhas no
meio de `ipc_handlers.py` ou de `state_store.py`:**

- **`citacoes-no-codigo`** — **onze** endereços `arquivo:linha` espalhados por
  `src/` passaram a apontar para linha em branco, porque o handler novo empurrou
  o arquivo 41 linhas para baixo e os comentários novos do `state_store`, 29. Os
  onze foram **re-medidos e reescritos** (`state_store.py:786→815`;
  `ipc_handlers.py` `2483→2524`, `4299→4340`, `4380→4421`, `4400→4441`,
  `6139→6180`, `6435→6476`), conferindo o TEXTO da linha antiga contra o
  `git show HEAD:` e achando o novo número por igualdade exata — cada âncora
  tem hoje UM destino, nenhum ambíguo. Os arquivos citantes são de outra posse
  (`a01_jogar`, `a05_vibracao`, `a08_conexoes`, `a09_sistema`,
  `app/actions/perfis_web`, `app/actions/profiles_actions`) e a mudança em cada
  um é **um número dentro de um comentário** — a alternativa que a régua
  oferece (`_CITACOES_PENDENTES`) seria empurrar para outro agente uma dívida
  que eu criei e sei consertar. **A régua reprova em DUAS voltas**: ela
  deduplica por chave, então os dois últimos só apareceram depois de os nove
  primeiros ficarem verdes.
- **`acentuacao`** — um comentário meu citava a função `automatico` pelo nome, e
  o portão pediu `automático`. Reescrito para citar o **gesto** (`auto`), que é
  a chave do contrato, em vez do identificador Python. Sem `noqa`: preferi a
  frase que não precisa de isenção.

## O que NÃO verifiquei

- **Não rodei o piloto WebKit, e a razão não é preguiça.** `--prova-clique` do
  `hefesto_vivo.py` manda o clique **ao daemon de verdade**, que é o da árvore
  DELA, e o piloto ainda dispara as migrações one-shot no `~/.config` real. A
  sprint é `bancada: false` e a mudança **não acrescenta um pixel**: o botão, o
  rótulo e o `title` já existiam no mockup aprovado (conferido no
  `mockup/04-iluminacao.html`: dois `<button data-gesto="auto">Automático</button>`,
  com o título *"Tira a cor escolhida à mão e devolve a automática"*). O que
  mudou é invisível — bookkeeping de trava dentro do daemon. **Não tenho foto
  antes/depois porque não há o que fotografar.**
- **Nada foi medido no aparelho.** Nenhum byte sai por este caminho, então não
  há degrau de escada a alcançar além de MONTOU. As células
  `luz.lightbar.release_leds` e `luz.lightbar.cor` (dualsense) são exercitadas
  pelo gesto, mas **pelo dublê**, e nesta entrega elas não avançam.
- **Não medi o efeito no journal dela.** O sintoma original tem tamanho medido
  (4 episódios de `autoswitch_suppressed_by_manual_override` em 7 dias); se esta
  cura o reduz é pergunta para o journal de daqui a uma semana, não para um
  teste.
- **Não confirmei o comportamento com dois ou mais controles na mesa.** A trava
  é global por desenho, e o handler diz isso na resposta; se largar a luz do
  Controle 2 *deveria* soltar a trava que o Controle 1 armou é pergunta de
  produto que ninguém fez ainda — ver abaixo.

## O que sobrou para o próximo

1. **A entrega 3 da sprint NÃO foi feita, e é posse alheia.** *"O motivo da
   trava vai ao log da supressão"* precisa de
   `profiles/autoswitch.py:924-926` (`_log_suppressed_once`, que hoje loga só
   `candidate` e `wm_class`) mais um `**extras` na assinatura dele —
   **`profiles/autoswitch.py` não está no `posse:` desta sprint**, e a ROTA
   CORRIGIDA de 06/09 reescreveu essa lista no mesmo dia sem incluí-lo, o que
   leio como deliberado. O dado já está pronto do outro lado:
   `store.manual_override_categories` é uma leitura pública e já purga as
   vencidas. É uma linha, e sem ela o próximo diagnóstico recomeça do zero.
2. **`audio` continua armando sem soltar** — a E1 da ÁUDIO-QUE-TRANCA-01. O
   `speaker.set` arma inclusive no `release` (`ipc_handlers.py`, o
   `_marcar_audio_manual`), que é a saída que parece a porta e não é. Quando
   fechar: apagar a lápide viva de `test_toda_categoria_de_trava_tem_par.py`,
   soltar a asserção de `test_a_trava_que_ninguem_solta_01.py`, e reescrever o
   texto de `MANUAL_OVERRIDE_STALE_AFTER_SEC` — que a partir daí deixa de ser a
   única porta de qualquer categoria.
3. **A janela GTK não ganhou nada.** `app/actions/lightbar_actions.py:1141`
   (`on_lightbar_auto_reset_target`) e `:1175` (`on_lightbar_auto_reset_all`)
   continuam só editando o rascunho, sem falar com o daemon — e continuam
   CERTOS assim, porque lá a cor manual ainda está no plástico quando o gesto
   roda. **A GTK sai inteira pela `D-0609-GTK-LEVA-INTEIRA`**, então isto
   provavelmente morre sozinho; se não morrer, é dívida real.
4. **PERGUNTA DE PRODUTO, sem dono:** o botão "Automático" é POR COLUNA (por
   controle) e a trava que ele solta é GLOBAL. Hoje isso está declarado
   (`escopo` na resposta) e nunca escondido, mas ninguém decidiu se é o
   desejado. Uma trava por `uniq` seria mudança no `StateStore` e alcança
   `trigger`, `rumble` e `audio` junto — não é conserto de aba.
5. **Fato velho que achei e não é meu:** o docstring de
   `interface/pacotes/daemon.py` diz *"o daemon atende **39 métodos**"*. O censo
   real era **44** antes desta sprint e é **45** depois. O número já estava
   errado quando cheguei; o arquivo não é da minha posse e o `--check` do
   contrato não o alcança (ele só confere o bloco gerado do
   `docs/protocol/ipc-unix-socket.md`).
6. **Efeito colateral declarado do bloco gerado:** ao escrever a prosa do método
   novo eu citei `lightbar.reset` e `rumble.passthrough` entre crases, e a
   coluna "Contrato em prosa" dos dois virou `sim`. A menção é real (os dois são
   descritos no papel que têm nesta rota), mas é **fina** — quem for pagar a
   dívida de contrato daqueles dois métodos não deve confiar no `sim`.
