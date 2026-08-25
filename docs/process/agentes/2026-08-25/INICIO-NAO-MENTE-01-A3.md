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
