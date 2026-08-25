# INÍCIO NÃO MENTE-01 — A3

**25/08/2026, madrugada.** Árvore `hefesto-voo/INICIO-NAO-MENTE-A3`, branch
`voo/INICIO-NAO-MENTE-01-A3`. A sprint inteira, sozinho: onze das treze tarefas
fecharam, uma é bancada dela e uma está bloqueada pelo §6.

## O que mudou

### I10 — a foto passa a alcançar os cinco estados que ninguém viu

`scripts/gui-captura/retratar_abas.py` ganhou um modo novo,
`--estados-do-inicio`, e o dublê da aba Início passou a aceitar **estados
nomeados** e um **rascunho de perfil** (`draft`), que é o que faltava para a
linha de divergência ser alcançável por foto.

Sete estados, um PNG cada, em `docs/process/estudos/assets/estados-do-inicio/`:
`caminho_feliz` (a régua), `em_pausa`, `grab_falhou`, `externo_na_mesa`,
`steam_input`, `mascara_divergente` e `mesa_vazia` (o payload MEDIDO de 23/08).
O externo sai do `tests/fixtures/inventario_externos.json`, versionado e já
anonimizado pelos portões de `tests/` — nenhum endereço foi digitado no script.
A promessa de privacidade do cabeçalho continua literal: **nada aqui fala com o
daemon**.

### I7 — a rede de mordida das três réguas

`tests/unit/test_home_rede_de_mordida.py`, mais o fixture
`tests/fixtures/state_full_mesa_vazia_medida.json` (o payload do §2.1).

- **(a) coerência das três réguas** — topo do `state_full`, lista dele e
  `controller.list` têm de concordar sobre haver controle. Contra o payload
  medido isso **reprova**, e é da Z5, não desta aba: está `xfail(strict=True)`,
  então no dia em que a Z5 fechar o teste passa, o strict reprova e quem
  integrar é obrigado a apagar o xfail;
- **(b) chamador de PRODUÇÃO** — `desfecho_da_troca`,
  `toast_da_troca_de_mascara` e a escrita com valor de `_home_flavor_pedido`.
  **Reprovava antes da I1/I2** (saída colada abaixo) e passa depois.

### I8 — o "desligar de verdade" ganha a primeira mordida da vida dele

`tests/unit/test_home_desligar_de_verdade.py`. O método
`_on_home_shutdown_clicked` **nunca havia sido executado por teste nenhum**.
Cinco testes: a pergunta sai antes de qualquer coisa; resposta NÃO não faz nada;
`rc == 0` arma `_user_stopped_daemon` e diz "desligado"; `rc != 0` **desarma** o
flag e não diz "desligado"; e o texto de falha ("tente pela aba Sistema") fica
MEDIDO, não abençoado — a **D-F** é dela.

### I12 — o contrato MARCAR e APLICAR ganha dono e portão

Módulo novo `src/hefesto_dualsense4unix/app/actions/contrato_da_mascara.py` —
**só dado, nenhuma função**: um contrato que executa é um segundo caminho de
execução. Ele declara quem marca, quem aplica, o mecanismo, e o registro datado
`EXCECOES_QUE_APLICAM_HOJE` (a aba Emulação aplica no clique).

Portão em `tests/unit/test_home_contrato_marcar_e_aplicar.py`. Ele mede
`apply_mode`, e **não** a string `gamepad.emulation.set`: a HARM-01 já tirou a
string crua da Emulação sem tirar o gesto, e uma régua por string daria a aba por
curada. O contrato SEM exceção nenhuma está `xfail(strict=True)`.

`app/widgets/painel_no_jogo.py` deixou de importar `_MODE_ITEMS`,
`_FLAVOR_ITEMS` e `RECONCILIAR_LABEL` por nome privado: importa os aliases
públicos do contrato, que são o **mesmo objeto** (nunca cópia).

### I1 e I2 — a recusa do daemon chega à tela, e a escolha dela sobrevive

`footer_actions._transicao_de_modo`: `ao_aplicar` passou de `Callable[[], None]`
para `Callable[[Any], None]`, e os **dois** chamadores repassam o resultado.
`desfecho_da_troca` e `toast_da_troca_de_mascara` ganharam o primeiro chamador
de produção da vida deles.

A frase do desfecho entra pelo `_recado_da_maquina`, que é quem precede o toast
final do "Aplicar" — escrever um toast ali seria apagado pelo `_apply_draft_agora`
no mesmo tique.

I2: escritor único novo em `home_actions.lembrar_mascara_recusada`, chamado pelo
rodapé **só** em `bloqueado_por_jogo` e `falhou`. `incerto` não grava: ali não se
sabe se aplicou, e guardar pedido sobre o que não se sabe acenderia a divergência
sem base.

As duas entradas correspondentes saíram de `_SEM_CAMINHO_HOJE` no
`portao_a_casa_sabe_e_o_produto_nao_faz.py`, com lápide no lugar.

### I4 — a pausa chega à primeira aba

`texto_da_pausa` (pura, só o `True` literal acende) e o terceiro estado no
`_render_home`: em pausa, a promessa do modo **sai** da tela e a frase da pausa
entra no lugar dela. Não é banner ao lado — deixar as duas faria a aba dizer
duas coisas no mesmo instante, que é o defeito da onda.

### I6 — a ponte não acende sobre mesa vazia

Quarto veredito em `texto_da_ponte`, com `controles_na_mesa` (função pura, com o
MESMO filtro por `connected` que o frame usa). A ordem das cinco perguntas não
mudou: a bifurcação mora dentro da quarta.

### I11 — o cadeado diz quando o mecanismo que ele governa está cego

`texto_do_cadeado_cego` (pura; ausência da chave é "não sei", nunca "está
cego"). A linha do cadeado passou a ter duas metades. **Função nova, e não uma
linha dentro de `autoswitch_lock_text`**, porque aquele retorno tem dois
consumidores: a linha da aba e — por BORDA — o toast do rodapé. Enfiar a
cegueira ali faria o rodapé anunciá-la a cada piscada. Há teste que trava isso.

### I3 — "você escolheu" para de acusar sobre gesto que ela não deu

`FONTE_GESTO_DELA` / `FONTE_PERFIL`, `_mascara_escolhida_com_fonte`, e o leitor
que faltava: `mascara_divergente_do_daemon`. Com o alarme do daemon populado, a
frase nomeia o **perfil do jogo em cena**; vindo do rascunho, diz "o perfil
ativo pede"; só gesto dela mantém "você escolheu".

### I5 — a conta da mesa conta quem está na mesa

`externos_na_mesa`, `_format_players_hint(controllers, externos)`,
`_format_external_title`/`_format_external_subtitle`, e o
`_maybe_fetch_externos` no tique lento (teto de 4 s, `timeout_s=3.0` — o mesmo
par e a mesma razão da aba Status).

**Hipótese 3 do §2.5 RESOLVIDA por leitura de código:** o `daemon.state_full`
**não publica** `external`. Ele publica `coop.externals`, que é uma contagem e
não diz quem. O `external=null` medido na bancada não distinguia "não há" de
"não publica" porque a chave nunca existiu ali. Há teste que trava o achado
(`test_o_state_full_de_hoje_nao_publica_external`): se alguma onda passar a
publicá-la, ele reprova e o IPC extra pode sair.

A frase NÃO promete que o externo é um jogador — o §6/pergunta 4 proíbe, e o
mapa diz `plataforma.vpad@sn30 = existe: desconhecido`.

**Desvio declarado do texto da sprint:** o card do externo é montado na MESMA
gramática do card de DualSense deste frame, e **não** com o `ExternalCard` da
aba Configurações. Duas razões: aquele widget tem seletor de jogador e de modo
que ESCREVEM (traria edição para a primeira tela — decisão de produto, e dela), e
a fileira passaria a ter duas gramáticas de card lado a lado. O que NÃO se
copiou foi o vocabulário: marca, slot e transporte saem das funções donas.

### I9 (metade de transporte) — o card fala a língua do mapa

`palavra_do_transporte`: `usb`→**cabo**, `bt`→**rádio**, valor desconhecido volta
CRU (para aparecer, não para sumir), ausência vira "não sei por onde" — o `"?"`
saiu. As outras três superfícies são de outros donos nesta leva; a régua que as
cobra está `xfail(strict=True)`.

**O texto do aviso de grab NÃO mudou**, e é decisão: ele depende do que a
`ESCONDE-SO-O-HIDRAW-01` (aberta) concluir. Trocar antes seria trocar um jargão
certo por uma promessa não apurada.

## Qual mordida prova

Cada uma foi arrancada, vista reprovar, devolvida e vista passar.

**I7(b) — antes da I1/I2** (o "antes" que a sprint pede colado):

```
FAILED test_home_rede_de_mordida.py::test_as_duas_funcoes_do_desfecho_tem_chamador_de_producao
E   AssertionError: sem chamador de produção: ['desfecho_da_troca', 'toast_da_troca_de_mascara']
FAILED test_home_rede_de_mordida.py::test_a_escolha_recusada_dela_tem_quem_a_grave
E   AssertionError: ninguém grava `_home_flavor_pedido` com valor em `src/`
2 failed, 4 passed, 1 xfailed
```

depois: `6 passed, 1 xfailed`.

**I10 — antes da I4/I5** (o instrumento acusando o produto):

```
FAILED test_home_foto_dos_estados.py::test_cada_estado_produz_uma_foto_diferente_do_caminho_feliz
E   AssertionError: estes estados da aba Início saíram byte a byte IGUAIS ao
    caminho feliz: ['em_pausa', 'externo_na_mesa']
1 failed, 4 passed
```

depois: `5 passed`. E o instrumento foi validado contra respostas conhecidas
(A5): `grab_falhou`, `steam_input`, `mascara_divergente` e `mesa_vazia` já saíam
diferentes ANTES de qualquer mudança de produto — a régua não é cega por
construção; e `test_a_regua_sabe_dizer_que_dois_estados_sao_iguais` prova que
ela sabe achar igualdade.

**I8** — arrancada a linha `self._user_stopped_daemon = False` do ramo de falha:

```
E   AssertionError: o flag foi armado antes de o worker sair (é o desenho) e
    tinha de ser DESARMADO quando o `systemctl` falhou.
E   assert [True] == [True, False]
1 failed, 4 passed
```

depois: `5 passed`.

**I12** — apagado `EXCECOES_QUE_APLICAM_HOJE`:

```
E   AssertionError: estas superfícies aplicam modo/máscara sem serem o rodapé:
    ['app/actions/emulation_actions.py']
1 failed, 5 passed, 1 xfailed
```

depois: `6 passed, 1 xfailed`.

**I1** — arrancada a chamada a `desfecho_da_troca`:

```
E   AssertionError: a recusa não foi dita: 'Perfil aplicado.'
E   assert 'Ainda não' in 'Perfil aplicado.'
4 failed, 8 passed, 1 xfailed
```

**I2** — arrancada a chamada a `lembrar_mascara_recusada`:

```
E   AssertionError: o rodapé recebeu a recusa e não guardou o que ela pediu
E   assert None == 'xbox'
1 failed, 11 passed, 1 xfailed
```

depois das duas devolvidas: `12 passed, 1 xfailed`.

**I4, I6, I11, I3** — cada cura arrancada, uma por vez, sobre
`test_home_para_de_afirmar_o_que_nao_sabe.py` (19 testes):

| cura arrancada | o que reprovou |
|---|---|
| I4 (`aviso_pausa or ...`) | `test_em_pausa_a_descricao_nao_promete_luz_nem_vibracao` |
| I6 (o ramo da mesa vazia) | `test_o_payload_medido_nao_produz_verde` |
| I11 (`window_detect_seeing`) | `test_a_funcao_pura_cala_sem_a_chave`, `test_o_payload_medido_faz_a_linha_falar` |
| I3 (`return valor, FONTE_PERFIL`) | `test_mascara_vinda_do_perfil_nao_diz_voce_escolheu` |

devolvidas: `19 passed`.

**I5 e I9** — sobre `test_home_a_mesa_inteira_e_a_lingua_do_mapa.py` (13 + 1 xfail):

| cura arrancada | o que reprovou |
|---|---|
| I5 (a conta) | `test_dois_dualsense_e_um_externo_nao_dizem_dois_controles`, `test_a_frase_nao_promete_que_o_externo_e_um_jogador` |
| I5 (a leitura de `external`) | 4 testes, entre eles `test_o_frame_desenha_tres_cards` |
| I9 (`palavra_do_transporte`) | `test_o_card_do_adotado_e_o_do_externo_falam_igual` |

devolvidas: `13 passed, 1 xfailed`.

## O que NÃO verifiquei

1. **A prova de tela (D3).** Nenhuma das nove frases novas ou reescritas foi
   vista por ela. Todas estão marcadas `PROVISÓRIO — decisão dela` no código.
   As sete fotos de estado existem e estão commitadas; o olho dela, não.
2. **A largura da fileira com quatro cards e a linha da Ponte de pé.** Continua
   não verificada — e agora a fileira pode ter cards de externo junto, o que
   ESTREITA cada card num `homogeneous`. Não medi.
3. **A suíte inteira.** Rodei o subconjunto do meu escopo (3.015 testes,
   `-k "home or footer or ponte or ... or layout"`). A regra do meu prompt é
   explícita: *"a suíte completa é minha, uma vez, na integração"* — e ela cria
   1.289 nós uinput. **Quem integra roda.**
4. **`scripts/check_endereco_de_radio.py` não existe nesta árvore.** O
   `CLAUDE.md` manda rodá-lo e ele não veio no branch — dois testes do
   `test_portoes_da_casa_estao_ligados_no_ci.py` reprovam por isso, **antes** do
   meu trabalho (conferido com `git stash`).
5. **Se o daemon publica `external` quando há externo na mesa** — respondido
   por leitura de código (não publica), **não** por bancada com o 8BitDo ligado.
6. **Se o gate R-04 devolve mesmo a máscara antiga na máquina dela.** A cura da
   I1 é apoiada nessa leitura do handler (`flavor: config.gamepad_flavor`,
   gravado só depois de o vpad nascer) e no payload de 18→19/08. Não reproduzi
   com jogo aberto — é bancada.

## O que sobrou para o próximo

**Vermelhos HERDADOS, não meus** (todos conferidos com `git stash` na árvore
limpa, mesmo resultado antes e depois):

- `portao_a_casa_sabe_e_o_produto_nao_faz.py` — 2 falhas:
  `app/fala_do_mapa.py::Numero`, `::formata_pt_br`,
  `app/textos_de_aplicacao.py::frase_do_desfecho` e
  `profiles/schema.py::resolver_teclado_emulado` sem chamador e sem declaração;
  e `utils/maquina.py::gravar_maquina` com lápide que sobreviveu à própria cura.
  Não toquei: os quatro símbolos são de outros donos, e declarar por eles seria
  escolher em silêncio;
- `test_portoes_da_casa_estao_ligados_no_ci.py` — 2 falhas, pelo
  `check_endereco_de_radio.py` ausente (item 4 acima);
- `validar-caducos.py` — `docs/protocol/paridade-bluetooth-versus-cabo.md:276`
  publica o literal caduco "40% do sinal";
- `test_layout_orcamento_altura.py` (6), `test_status_faixa_blocos.py` (1) e
  `test_status_som_04_som_de_confirmacao.py` (1) reprovam em execução por
  subconjunto, na árvore limpa também.

**Achados que RELATO e não consertei** (arquivo alheio nesta leva):

- **`test_nenhuma_lapide_sobreviveu_a_propria_cura` esconde metade do que
  vê.** Ele varre `_NAO_E_PROMESSA` e `_SEM_CAMINHO_HOJE` num laço com `assert`
  DENTRO — a primeira falha corta o laço, e o segundo registro nunca é
  conferido. Foi por isso que as duas entradas da PONTE-NA-TELA-01 não
  apareceram como curadas depois da I1: o teste parou antes de chegar nelas.
  Cura: acumular os dois e afirmar uma vez só;
- **um teste de FOTO quebrava um teste de LARGURA dois arquivos adiante.**
  `app.theme.apply_theme` não é idempotente e escreve `gtk-font-name` no
  `Gtk.Settings`, que é da TELA. Uma aplicação a mais no processo e
  `test_largura_a_mesma_em_todas_as_abas[tab_home_box]` passa a reprovar com
  **1400 px contra 1646**. Curei no MEU arquivo
  (`_nao_inflar_a_fonte_da_sessao`), mas os outros arquivos de foto da suíte
  aplicam o tema do mesmo jeito e a armadilha continua armada para o próximo.

**O que a próxima frente herda:**

- **I13 — BANCADA, e é dela.** Não fiz. A frase do modo qualificar o transporte
  depende das perguntas 1 e 2 do §6. O comando que ELA roda, com o controle no
  rádio e um jogo aberto:
  `hefesto-dualsense4unix test rumble --transport bt` (a vibração do JOGO por
  rádio) e a contagem de jogadores com dois DualSense por rádio no mesmo
  adaptador. Enquanto não houver resposta, a tela não pode afirmar;
- **I6 ramo 2 (`vpad_suspenso`)** continua preso atrás da
  `VPAD-SUSPENSO-MORTO-01` — o flag só anda para `false`, então a frase do Steam
  Input é inalcançável em produção. **Não reescrevi o ramo**, como a sprint
  manda. A foto `inicio_steam_input.png` mostra o que ele DIRIA;
- **I9, as outras três superfícies** — `external_controllers.transport_label`,
  `config/secao_mesa.py` e a Status. O `xfail(strict=True)` em
  `test_as_quatro_superficies_dizem_as_mesmas_palavras` é o gatilho;
- **I12 — a onda da Emulação** apaga a linha de `EXCECOES_QUE_APLICAM_HOJE` e o
  `xfail` do contrato sem exceção, no mesmo gesto;
- **I5 — o `ExternalCard` na primeira tela** é decisão de produto (traz edição
  para a Início) e continua com um cliente só;
- **a redação de nove frases** é dela: a da pausa, a do quarto veredito da
  ponte, a do detector cego, as duas da divergência por perfil, as três do
  desfecho da máscara e a da conta da mesa mista.

---

# SEGUNDA RODADA — 25/08/2026, manhã

Despachado por quem coordena com um destravamento e um endereço exato: a
`VPAD-SUSPENSO-MORTO-01` fechou e o **I6, ramo 2** deixou de estar bloqueado; a
`ESCONDE-SÓ-O-HIDRAW-01` fechou e o **texto do aviso de grab (I9)** deixou de
depender de medição que não existia. As duas fecharam nesta rodada.

**Commits:** `30bfa22`, `f341133`, `b136aab`, na branch `voo/INICIO-NAO-MENTE-A3`.
**Portões:** `bash scripts/portoes.sh` → **TODOS VERDES — 24 portões**.

## O que mudou

### I6, ramo 2 — e por que NÃO fechei pela saída recomendada

A D2 deixou o endereço (`home_actions.py:1112-1116`) e duas saídas: **A**
apagar o ramo, **B** (recomendada para o par) trocar a condição por
`excecao_ativa` sozinho, *"sem inventar texto novo"*.

**Fechei pela A, e a razão é medição.** A frase do ramo dizia *"pelo Steam
Input — neste jogo a Steam entrega os botões"*. Ela é do mundo de **06/08**, em
que a exceção suspendia o vpad. Esse mundo acabou em **09/08**, por decisão
dela (`ESCONDER-EM-VEZ-DE-SAIR-01`: *a allowlist do Steam Input NÃO tira o
Hefesto da frente*): a exceção passou a **esconder o físico** e a **manter o
vpad de pé**. E há medição EM JOGO, não só leitura de código —
[pilha-steam-input-xpad-sdl.md](../../../protocol/pilha-steam-input-xpad-sdl.md),
§2.4-bis, **11/08**, com um appid da allowlist DELA em sessão: **zero
espelhos** da Steam no sistema, os dois vpads do Hefesto de pé, quatro
controles com jogador e vibração, e o aceite dela.

Ou seja: a Saída B publicaria na **primeira tela** uma frase que a medição
derruba — que é o defeito que esta sprint inteira existe para fechar. Com a
exceção ativa, a resposta verdadeira é a que a aba já dá ("pelo Hefesto"), e
quem tem a fita da exceção é a aba Emulação.

**A ordem das perguntas caiu de cinco para quatro.** A bifurcação da mesa vazia
continua DENTRO da pergunta do gamepad.

**Duas réguas, porque são dois modos de a frase voltar:** o TEXTO (três testes
de render) e a FORMA — `test_a_aba_nao_le_uma_flag_que_so_anda_para_um_lado`,
que pergunta ao **AST** se a aba voltou a ler `vpad_suspenso`. A régua por AST
não é preciosismo: a primeira versão dela, por linha de texto, acusou a própria
lápide que explica o defeito.

**A foto acompanha.** O estado `steam_input` do instrumento trazia
`vpad_suspenso: True` e `gamepad_emulation.enabled: False` — um payload que o
daemon de hoje **não produz**. Passou a trazer o de hoje, e com isso a foto sai
**igual** à do caminho feliz. Em vez de tirá-lo da régua da I10, ele entrou em
`ESTADOS_SEM_EFEITO_NA_ABA` (no próprio instrumento, com razão datada) e ganhou
a **régua contrária**: se a aba um dia distinguir a exceção, o teste reprova e
manda devolver o nome à régua da diferença. Sem essa segunda régua, a
declaração seria a porta por onde a foto volta a não provar nada.

### I9, segunda metade — o aviso de duplicação fala com ela

*"Grab falhou — input pode dobrar no jogo"* contava o que aconteceu com o
KERNEL. A troca estava presa porque a consequência não estava medida. Agora
está, nos dois pedaços de que a frase precisa:

- **o que acontece** — `ESCONDE-SÓ-O-HIDRAW-01`, medido em 25/08: o `hide` age
  em UMA superfície (`/dev/hidraw*`) e o mesmo controle mora em TRÊS; `event*`
  e `js*` seguem alcançáveis. O `EVIOCGRAB` é o que impede o físico de produzir
  entrada nessas duas — com ele recusado, a duplicação não é hipótese;
- **o que fazer** — `GRAB-DOBRADO-01`, medido em 15/08: as quatro recusas do
  journal são `Errno 16` (outro leitor já tem o dispositivo), o daemon retoma
  sozinho a cada 2 s (`GRAB_RECONCILE_SEC`, `daemon/lifecycle.py:84`), e o que
  curou naquele dia foi reiniciar o Hefesto.

Linha: **"O jogo pode receber cada botão duas vezes"**. O porquê vai no
**hover** — mesmo desenho da fita apagada do cabeçalho (`f475b2a`, do mesmo
dia), e pela mesma razão: a fileira tem até quatro cards e o aviso mora DENTRO
de um deles.

**A frase NÃO acusa a Steam.** A `GRAB-DOBRADO-01` registra por escrito que
**quem** segura o dispositivo não está provado — a Steam é candidata sem prova.
Mandar ela fechar o programa por onde joga seria pior que calar. Há teste que
trava isso.

A condição (`is_primary and gamepad_on and grab_state == "failed"`) saiu do
montador de widgets para `aviso_de_grab`, função pura: ela já estava certa, e
fora do GTK é testável.

### A premissa de 06/08 que sobrevivia ao mecanismo de 09/08

Dois comentários do meu próprio arquivo ainda contavam o mundo anterior — *"com
a exceção ativa o vpad é suspenso, a emulação cai para False, o modo vira
Controlar o PC"*. Foi essa premissa velha que quase me fez fechar a I6 pela
saída errada. Substituída, com a medição de 06/08 citada com a data (ela
descreve o mecanismo DAQUELE dia, e é o que explica a frase banida).

**Nada muda no código:** o gate da divergência sempre foi `mode_of_state`.

## Qual mordida prova

**I6 — a mordida é a SAÍDA RECOMENDADA reposta** (é ela que os testes
precisam distinguir da certa):

```
# CURA ARRANCADA (a Saída B literal: condição `excecao_ativa` sozinha)
E   assert 'pelo Hefesto' in 'Ponte com o jogo: <span foreground="#50fa7b">pelo
    Steam Input</span> — neste jogo a Steam entrega os botões, ...'
E   AssertionError: assert 'entrega os botões' not in ...
E   assert '#50fa7b' not in ...
FAILED ...::test_com_a_excecao_ativa_a_ponte_continua_sendo_o_hefesto
FAILED ...::test_a_aba_nao_diz_que_a_steam_entrega_os_botoes
FAILED ...::test_com_a_excecao_ativa_e_a_mesa_vazia_a_ponte_nao_acende
3 failed, 20 passed
```

E a **segunda direção** — o ramo ORIGINAL de volta (`excecao_ativa AND
vpad_suspenso`), que é a "saída zero" de não fazer nada:

```
E   AssertionError: a aba Início voltou a LER `vpad_suspenso`, e ela só anda
    para False desde 09/08/2026 (VPAD-SUSPENSO-MORTO-01/E1):
    ["linha 1169: literal 'vpad_suspenso'"]
FAILED ...::test_a_aba_nao_le_uma_flag_que_so_anda_para_um_lado
FAILED ...::test_a_aba_nao_diz_que_a_steam_entrega_os_botoes
2 failed, 21 passed
```

devolvida: `23 passed`.

**I10/foto — a régua contrária mordeu**, com a aba voltando a distinguir a
exceção:

```
E   AssertionError: estes estados foram DECLARADOS sem efeito na aba e a foto
    mostra outra coisa: ['steam_input']. A aba passou a distingui-los — mova o
    nome para `_ESTADOS_QUE_TEM_DE_DIFERIR` e apague a declaração
FAILED ...::test_os_estados_declarados_iguais_saem_iguais
1 failed, 5 passed
```

devolvida: `6 passed`.

**I9 — duas arrancadas, uma por metade da frase.** O jargão de volta:

```
E   AssertionError: a linha do card voltou a dizer 'grab'. É o nome da peça do
    sistema que falhou — e o card é a primeira tela de quem quer jogar:
    'Grab falhou — input pode dobrar no jogo'
FAILED ...::test_a_linha_nao_fala_a_lingua_do_kernel
1 failed, 16 passed, 1 xfailed
```

e o hover fora (`warn.set_tooltip_text(porque)` arrancado):

```
E   AssertionError: o card mostra a linha e não carrega o porquê. Sem o hover,
    a frase diz o que aconteceu e não diz o que fazer.
E   assert None == 'Outro programa pegou este controle antes e não solta, ...'
FAILED ...::test_o_card_leva_a_linha_e_o_porque_no_hover
1 failed, 16 passed, 1 xfailed
```

devolvidas: `17 passed, 1 xfailed`. O `__pycache__` foi apagado entre arrancar e
devolver em todas.

## O que NÃO verifiquei

1. **A prova de tela (D3).** Nem a linha nova do aviso de grab, nem o hover, nem
   o silêncio da ponte sob a exceção foram vistos por ela. Tudo marcado
   `PROVISÓRIO — decisão dela` no código.
2. **A exceção de Steam Input EM JOGO, hoje.** A conclusão de que a aba não deve
   dizer nada é leitura de código + a medição de 11/08 de outra pessoa. Não
   abri um jogo da allowlist para ver a tela nesse estado — é bancada, e o
   daemon vivo é dela.
3. **Se o hover é legível na tela dela.** `set_tooltip_text` num `Gtk.Label`
   dentro de um card: medi que o produto o entrega, não que ele apareça bem.
4. **Nada de rádio.** `/sys/class/bluetooth/` continua vazio.

## O que sobrou para o próximo

### Um vermelho que EU criei, e ele é o D3 desta noite

`tests/unit/test_as_fotos_acompanham_a_versao.py::test_as_fotos_nao_ficam_atras_do_codigo_da_tela`
**estava verde e ficou vermelho no meu primeiro commit**: mudei código de tela e
as fotos de `docs/usage/assets` são de `f475b2a`. A cura é rodar o
`retratar_abas.py` — proibido nesta madrugada, e **com razão**, porque medi o
que aconteceria:

- rodei o script para um destino temporário e comparei: **as 14 fotos do
  `docs/usage/assets` saem DIFERENTES das versionadas**, inclusive as de abas
  que ninguém tocou;
- duas execuções seguidas, mesmo ambiente: **idênticas** — não é ruído de
  execução;
- e achei um motivo estrutural: o script aplica o tema com a **escala de fonte
  DELA, lida do disco vivo** (`~/.config/hefesto-dualsense4unix/gui_preferences.json`,
  `escala_fonte: 6`). Rodando com um `HOME` limpo o log diz `escala=3` e as
  fotos mudam de novo. **A foto do repositório depende de uma preferência viva
  da máquina de quem roda** — então "se saírem iguais, ótimo, custou dez
  segundos" não vale entre ambientes.

Com o `HOME` limpo elas TAMBÉM diferem das versionadas, então a escala não
explica tudo: sobra que o conjunto versionado foi feito num ambiente que esta
árvore não reproduz. **Quem for rodar o lote da Rodada 3 precisa saber disso
antes**, ou vai commitar 14 PNGs achando que documentou uma mudança de duas
telas.

### A premissa de 06/08 vive em mais QUATRO lugares, e são de outras frentes

Mesmo fato errado do meu terceiro commit — *"na exceção o Hefesto solta o grab
e derruba o vpad"* —, que a `ESCONDER-EM-VEZ-DE-SAIR-01` substituiu em 09/08.
Não toquei: são de outras frentes nesta leva, e meia correção deixa as duas
versões vivas, que é o defeito que a regra existe para matar.

| Endereço | O que diz de errado |
|---|---|
| `tests/unit/test_a_frase_refutada_da_allowlist.py:9-11` | é a **premissa do portão**: *"o Hefesto entrega a ENTRADA — solta o grab, desfaz o esconde-esconde do hidraw e recolhe o gamepad virtual"*. O portão continua CERTO (a frase "sai da frente" segue banida); o mecanismo descrito é que caducou |
| `app/actions/daemon_actions.py:859` | docstring do toast "Este jogo não funciona": *"solta o grab e derruba o gamepad virtual"* |
| `app/actions/profiles_actions.py:957` | docstring do toast da caixinha do Steam Input, o mesmo texto |
| `daemon/lifecycle.py:2217` e `:4703` | *"a exceção do Steam Input derruba o vpad DE PROPÓSITO"* |

**Os toasts que essas docstrings governam já dizem a coisa CERTA** (o de
`profiles_actions` diz *"o controle físico fica escondido e ele passa a ver só o
controle do Hefesto"*). O estrago é na razão de registro: foi ela que quase me
fez fechar a I6 pela saída errada.

### O que continua aberto, e de quem é

- **I13 — BANCADA, dela.** Sem adaptador de rádio nesta casa desde 02:36;
- **A frase da Emulação** (`emulation_actions.py:408`) — a gêmea da minha, e a
  D2 aponta o mesmo endereço. **Cuidado:** aquela frase diz *"o controle
  virtual foi recolhido"*, que é exatamente a metade que a 09/08 derrubou.
  Fechá-la pela Saída B, sem trocar o texto, publica um fato errado — a mesma
  conta que fiz aqui;
- **I9, as outras três superfícies** (`external_controllers.transport_label`,
  `config/secao_mesa.py`, a Status) — o `xfail(strict=True)` é o gatilho, e a
  aba Configurações tem sprint própria de léxico nesta leva;
- **A palavra "primário"** no subtítulo do card — o outro jargão que a I9
  nomeia. **Não troquei, e é decisão dela:** o card já mostra o número do
  jogador, então qualquer substituto ou repete o que está ali ou inventa um
  conceito novo na primeira tela;
- **Se a Início deve NOMEAR a exceção de Steam Input** (algo como "…e a Steam
  está no meio neste jogo"). É texto novo na primeira tela — palavra dela.
