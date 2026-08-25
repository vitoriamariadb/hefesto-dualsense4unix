# EMULACAO-UM-DONO-SO-01 · agente E1

| | |
|---|---|
| **Árvore** | `hefesto-voo/EMULACAO-UM-DONO-SO-E1`, branch `voo/EMULACAO-UM-DONO-SO-E1` |
| **Base** | `9cfd638` (merge de `dev` em `onda/atual`) |
| **Fechou** | **E8**, **E9**, **E3** (metade 1), **E4** (metade de tela), **E11**, **E13**, **E15** |
| **Fechou por MEDIÇÃO, sem código** | **E7** — não há buraco, e a metade que a sprint pedia já foi curada por outra frente |
| **Não fez** | **E2** (arquivo de outra frente), **E1**, **E5**, **E6**, **E10**, **E12**, **E14**, **E16** |
| **Recusou como escrito** | a metade 2 do **E3** (o preço na frase do "Ligar") e a redação literal do **E11** — as duas por medição, abaixo |
| **Commits** | `f8e72bc`, `66d45f9`, `e93abbc`, `ffd9afc`, `eb9871b` |
| **Portões** | `bash scripts/portoes.sh` → **TODOS VERDES — 24 portões** |
| **Fora da posse** | nenhum arquivo de `src/` fora dela. Toquei `po/en.po`, `locale/` e três arquivos de `tests/` — todos por consequência direta, e cada um explicado abaixo |

---

## 1. O que mudou, por tarefa

### E8 — as quatro frases de vibração qualificam o transporte

**E a conta era maior do que a sprint mediu.** Ela propunha a frase *"a vibração
está provada no cabo; no rádio o caminho existe e ainda não foi medido"*. O mapa
não sustenta nem o cabo: `vibracao.rumble.passthrough@dualsense` tem
`de_onde_sei = inferido-do-codigo` nos **DOIS** lados. O do cabo foi rebaixado
de `medido` em **15/08/2026 (D-14)**, porque a evidência da célula descrevia
leitura de fonte e não medição no aparelho, e a coluna `mordida` diz o mesmo por
outro caminho: *"não desce até o envelope do físico, então nem o cabo nem o
rádio são provados de ponta a ponta"*. A frase da sprint teria posto **uma
afirmação nova e falsa** na tela.

A ressalva na tela é UMA, verbatim nas três frases que afirmam a vibração:
*"A vibração ainda não foi conferida no aparelho — nem no cabo, nem no rádio: o
caminho está montado, e se ela não vier não é erro seu."*

**Segunda correção de fato, na direção oposta.** A sprint diz *"das três, só a
lightbar tem lastro medido nos dois transportes"*. O giroscópio **também tem**:
`movimento.giroscopio.jogo@dualsense` é `de_onde_sei = medido` e `aciona = sim`
nos dois lados, com evidência de rádio por duas réguas independentes (16/08:
7.231 eventos no vpad). O `BT-FURO-FINO-01` é ressalva, não ausência de
medição — e tirar da tela uma medição que existe é a mesma família de defeito na
direção contrária. Por isso a frase nova **afirma** giroscópio e lightbar, e
nomeia os dois transportes.

Quarta frase (`emulation_hint`): saiu só o "e vibra". Sem afirmação, sem
ressalva a carregar — e o parágrafo e o tooltip carregam o detalhe.

### E9 — a dica manda para a aba certa, com o nome de HOJE

A dica dizia *"use a exceção por jogo em «Steam Input» na aba Emulação"*. Nesta
aba há só "Verificar" e "Desligar Steam Input", que **leem** a allowlist. Quem
escreve é a caixinha da aba **Perfis** — e **o rótulo dela também mudou**: a
sprint ainda a chama de *"Este jogo não funciona"*, e desde a
**ESCONDER-EM-VEZ-DE-SAIR-01** (09/08/2026, decisão dela) o rótulo é **"Esconder
os controles físicos neste jogo"** (`gui/main.glade:2469`).

Saiu junto a outra frase que a mesma decisão derrubou e que a sprint não notou:
*"o jogo precisa enxergar os controles físicos"*. A marca **inverteu de lado** em
09/08 — hoje ela os **esconde**. A frase nova nomeia o gesto e onde ele mora, e
**não afirma mecanismo**: eu não tenho medição do porquê, e inventá-la seria
trocar um fato errado por outro.

### E3 — o microfone não pinta verde sem alvo

`_mic_state` decidia entre três estados olhando **só** três arquivos em
`~/.config/wireplumber/wireplumber.conf.d/`. Sem placa de áudio do controle no
sistema o ramo era o mesmo, e a tela escrevia **Ligado** em `#50fa7b`. O caso
mais comum disso não é exótico — **é o controle no rádio**, onde não existe
placa ALSA nenhuma.

**A régua do alvo, declarada como a sprint exige:** placa ALSA de DualSense em
`/proc/asound/cards`, contada pela função pura **já existente**
`storm_doctor.contar_placas_dualsense` (reusar em vez de reimplementar; o
cabeçalho dela registra por que contar a palavra dá o dobro).

**O que ela prova e o que NÃO prova.** O mapa escreve com todas as letras
(`audio.microfone@dualsense`, `assimetria_declarada`, 15/08): ausência de placa
prova que **a ROTA ALSA não existe**, **não** que o aparelho não capte por
rádio. A frase da tela fala de *"placa de áudio neste computador"*, nomeia o
rádio como o caso normal, e um caso do portão guarda a formulação — proibindo as
conclusões sobre o aparelho.

**O alvo fecha só o ramo verde**, e a razão está escrita no código: os dois
estados laranja descrevem a NOSSA configuração (um drop-in que escrevemos está
lá, ou o promotor está faltando) e são verdade com placa ou sem placa. Trocar
"suprimido" por "sem alvo" esconderia uma escolha dela atrás de uma ausência de
hardware.

### E4 (metade de tela) — "microfone" ganha sobrenome

Toda dica desta linha passa a dizer de qual microfone se trata: *"Isto vale para
o computador inteiro, não para este jogo: não entra no perfil e não mexe na
ponte de microfone por Bluetooth (aba Configurações)."* Nos **quatro** estados,
não só no novo — frase que só aparece num ramo é frase que a maioria das visitas
não lê. **A decisão de entrar no perfil continua dela** e este texto não a
antecipa: ele diz o que o botão faz hoje, que é fato medido.

Feito **sem tocar o `main.glade`**, por instrução de quem coordena: o texto sai
do Python que já escreve nessa linha.

### E11 — a segunda regra da contagem volta a existir

A constante dizia `"Hefesto Virtual"`, com docstring afirmando ser *"o nome que
o vpad uhid publica no evdev"*. O vpad publica
`DualSense Wireless Controller (Hefesto P{n})` desde a **BT-E-VPAD-01** (furo 1).
Num nó sem `uniq` legível — que é o caso para o qual a segunda regra existe — o
produto acusaria o **próprio vpad** de ser de outro programa, e a suíte
continuaria verde, porque o teste alimentava o dublê com o nome antigo.

O portão amarra **três** pontas: o nome que o `uhid_gamepad` realmente publica
(lido por AST — instanciar abriria `/dev/uhid`), a régua da aba, e a
`VPAD_MARCA_NO_NOME` de `scripts/identidade_do_vpad.py`, a régua única desta
casa, **cujo cabeçalho já registrava em 12/08 que "há código nesta casa que
ainda procura o nome velho"**. Era este.

### E13 — a rede que faltava

Quatro caminhos sem um teste que os nomeasse. Três agora têm, e **as três
mutações que a sprint exige foram executadas** (§2). O quarto não entrou, e é
medição: *"entrar em `emulation_box` chama o refresher"* **já tem rede que
morde** — apagada a linha de `app/app.py:1114`, `test_notebook_switch_page.py`
reprova em dois casos e um deles nomeia a aba. Um terceiro seria a terceira
régua da mesma pergunta.

### E15 — a frase de um estado que o produto nunca alcança

Destravada esta madrugada pela `VPAD-SUSPENSO-MORTO-01`, e reconferida aqui.

**Marquei, não apaguei — e é escolha declarada, não omissão.** Apagar decidiria
por ela: a sprint irmã está ABERTA e a pergunta que ela deixou (*"o par
(exceção ativa, vpad suspenso) vira um estado só?"*) é da mantenedora. Se a
resposta reviver a suspensão, a frase volta a valer inteira, com a nota datada
de 07/08 que ela já custou. **Marcar custa um comentário; apagar custa a frase e
a medição junto.** Na dúvida entre guardar e cortar, guarde.

**O portão é de classe, não de instância.** Ele pergunta, para CADA chave do
dicionário, se existe caminho de produção que ponha aquele valor em `bloqueio`.
O que não tem caminho fica declarado com razão datada. A próxima frase escrita
para um estado morto — ou o próximo estado que morre debaixo de uma frase viva —
reprova sozinha. E a outra metade **avisa se alguma frente religar a suspensão**.

---

## 2. As mordidas — todas executadas, arrancadas por LINHA, com `__pycache__` limpo entre arrancar e devolver

### E8 · mordida 1 — a frase do Xbox volta ao texto de 24/08 (linha 3402 do glade)

```
E   AssertionError: a aba Emulação promete transporte que o mapa não mede:
E     emulation_gamepad_xbox_button: afirma vibracao.rumble.passthrough@dualsense
E       (cabo de_onde_sei='inferido-do-codigo', rádio='inferido-do-codigo') e o
E       texto não carrega a ressalva 'vibração ainda não foi conferida no
E       aparelho — nem no cabo, nem no rádio'
FAILED ...::test_promessa_sem_lastro_nos_dois_transportes_carrega_a_ressalva
1 failed, 6 passed
# CURA DEVOLVIDA → 7 passed
```

### E8/E9 · mordida 2 — a dica da máscara volta ao texto de 24/08 (linha 3411)

```
E   AssertionError: a aba Emulação promete transporte que o mapa não mede:
E     emulation_gamepad_hint_label: afirma vibracao.rumble.passthrough@dualsense …
E   AssertionError: a frase da exceção por jogo não cita nenhum controle que
E     existe na janela: '… use a exceção por jogo em "Steam Input" na aba
E     Emulação.'. Rótulos citados que não existem: ['Steam Input']
2 failed, 5 passed
# CURA DEVOLVIDA → 7 passed
```

### E3 · mordida A — arrancado o ramo do alvo (linhas 1169-1170)

```
E   AssertionError: a aba concluiu 'Ligado' sem ter olhado se existe microfone a ligar
E   assert 'ligado' == 'sem-alvo'
E   AssertionError: a dica parou de dizer o que a régua realmente olhou: …
E   AssertionError: os quatro estados não foram exercidos: {'suprimido', 'ligado'}
# CURA DEVOLVIDA → 9 passed
```

### E3/E4 · mordida B — o escopo sai da dica (linha 1279)

```
E   AssertionError: estado 'ligado' sem o escopo na dica: 'O microfone do
E     controle está livre e com prioridade acima do eco da saída.'
FAILED ...::test_toda_dica_do_microfone_diz_de_qual_microfone_se_trata
1 failed, 8 passed
# CURA DEVOLVIDA → 9 passed
```

### E3 · mordida C — a frase conclui sobre o APARELHO

Trocada a dica por *"O microfone deste controle não funciona."*:

```
E   AssertionError: a dica parou de dizer o que a régua realmente olhou: 'O
E     microfone deste controle não funciona. …'
FAILED ...::test_a_frase_nao_conclui_que_o_aparelho_esta_mudo
# CURA DEVOLVIDA → 9 passed
```

### E11 · mordida 1 — a constante volta ao nome de 01/08

```
E   AssertionError: a aba procura 'Hefesto Virtual' e o vpad publica
E     'DualSense Wireless Controller (Hefesto P1)' — a segunda regra da contagem
E     não casa com nada
E   AssertionError: assert 'Hefesto Virtual' == '(Hefesto P'
E   AssertionError: sem `uniq` legível, o produto deixou de reconhecer o próprio vpad
E     assert (1, 0, 0) == (0, 1, 0)
E   AssertionError: o nome que a BT-E-VPAD-01 aposentou ainda é régua viva nesta aba:
E     linha 124: ['_VPAD_MARCA_NO_NOME'] = 'Hefesto Virtual'
# CURA DEVOLVIDA → 29 passed
```

### E11 · mordida 2 — a cura AO PÉ DA LETRA da sprint

`_VPAD_MARCA_NO_NOME = "DualSense Wireless Controller"`:

```
E   AssertionError: a marca do vpad casa com 'Sony Interactive Entertainment
E     DualSense Wireless Controller', que é nome de aparelho
E   assert (0, 1, 0) == (1, 0, 0)      ← o DualSense FÍSICO dela virou "nosso"
# CURA DEVOLVIDA → 29 passed
```

### E15 · mordida 1 — a declaração de morte sai

```
E   AssertionError: frase de tela para um estado que nenhum caminho de produção
E     alcança, e sem declaração em BLOQUEIO_SEM_CAMINHO_DE_PRODUCAO:
E       'vpad_suspenso_pelo_steam_input'
E     (alcançáveis hoje: ['desligada', 'modo_jogo', 'sem_device'])
1 failed, 5 passed
# CURA DEVOLVIDA → 6 passed
```

### E15 · mordida 2 — a suspensão RELIGADA na borda da exceção

Reposta em `gamepad.py:518` a linha que o `d8022ea` tirou:

```
E   AssertionError: declaração obsoleta em BLOQUEIO_SEM_CAMINHO_DE_PRODUCAO:
E     ['vpad_suspenso_pelo_steam_input']. O estado voltou a ser alcançável —
E     APAGUE a entrada, e confira se a frase da tela ainda descreve o que
E     acontece hoje (EMULACAO-UM-DONO-SO-01/E15).
1 failed, 5 passed
# CURA DEVOLVIDA (git diff de daemon/ vazio) → 6 passed
```

### E13 · mutação 1 — tirado o ramo do `"(padrão)"`

```
E   AssertionError: assert '150' == '150 (padrão)'
E   AssertionError: assert '(padrão)' in '150'
```

### E13 · mutação 2 — devolvida a constante de Xbox ao `_sync_uinput_card`

```
E   AssertionError: 045E:028E (Xbox 360)
E   assert False +  where False = '045E:028E (Xbox 360)'.startswith('054C:0DF2')
```

### E13 · mutação 3 — o botão "Testar" para de recusar sem uinput

```
E   AssertionError: criou nó mesmo sem uinput: ['instanciou']
```

**Esta terceira só passou a provar alguma coisa depois de o dublê ficar
COMPLETO.** Com um dublê pobre o vermelho era `AttributeError: '_Espia' object
has no attribute 'start'` — que prova que o dublê é pobre e mais nada. A razão
está escrita no dublê.

---

## 3. O que eu recusei executar, e a medição que derruba

### E3, metade 2 — o preço medido na frase do "Ligar". **RECUSADO.**

A sprint manda a frase do "Ligar" dizer o preço com o número do CSV: *mic
desligado 260,4 Hz de input; ligado 170,5 Hz + 106,2 Hz de áudio*.

**Esses números são do RÁDIO, e este botão não alcança o rádio.** A própria
§2.4 da sprint marca a pergunta como NÃO VERIFICADA. Medi hoje, e a resposta é
não: `grep -n "hidraw\|0x32\|bt_mic\|GerenciadorMicBluetooth"` em
`scripts/fix_wireplumber_default_source.sh` (783 linhas, o script que
`_run_mic` executa) devolve **zero** — o botão escreve drop-ins do WirePlumber,
que é rota de sessão de áudio. Os números vêm da célula `radio_ressalva`, e
quem os produz é a ponte por HID (`GerenciadorMicBluetooth`), outro objeto.

Pôr um preço de rádio num botão de rota ALSA seria **uma afirmação nova e
falsa** — exatamente o defeito que esta sprint existe para matar. E não há preço
medido para o que este botão faz: a célula do cabo não tem número de taxa.

**O que entrou no lugar, e é honesto:** a dica diz o ESCOPO — que isto vale para
o computador, não para o jogo, e que **não mexe na ponte de microfone por
Bluetooth**. É o mesmo fato, dito na direção que a medição sustenta.

### E11, a redação literal — **RECUSADA**, e a mordida 2 mostra o estrago

A sprint manda *"o prefixo vira o nome de hoje"*. O nome de hoje **começa** por
`DualSense Wireless Controller`, que é o começo do nome que um aparelho de
verdade publica. Com o prefixo literal, `classificar_joysticks` devolve
`(0, 1, 0)` para um **DualSense FÍSICO** — a aba contaria o controle dela como
nosso. Troquei uma regra morta por `(Hefesto P`, que é o que só este produto
escreve, e é a redação que a régua única da casa já usava.

### E7 — **NÃO HÁ BURACO**, e a outra metade já foi curada

A sprint suspeitava que a rede não segurasse a cura da Steam para esta aba.
**Medido: segura, nas duas funções.**

- Devolvido o `glob` cravado em `~/.steam/steam/…` a `_steam_input_is_on`:
  `test_ambiente_presumido_01_a_steam_dos_quatro_layouts.py::test_o_cartao_da_aba_acha_o_steam_input_ligado`
  reprova nos **quatro** layouts (`nativa`, `nativa-antiga`, `flatpak`, `snap`).
- O mesmo em `_steam_input_appids_ligados`: reprovam
  `test_o_cartao_nomeia_o_jogo_em_qualquer_layout` (três layouts) e
  `test_duas_steams_no_mesmo_home_nao_viram_uma`.

E a frase caduca que a sprint aponta em `daemon/launch_env.py:606` **já foi
substituída** por outra frente hoje (T-15, 25/08): `:609-618` traz a nota datada
*"Substitui o que estava escrito aqui"*. **A E7 fecha sem código.**

---

## 4. O que fica aberto, e de quem é

### Para quem coordena — **DEFEITO NO PORTÃO DA D2, com reprodução**

`tests/unit/test_portao_o_par_com_metade_ligada.py` **pode ser silenciado por
prosa**, e eu o silenciei sem querer. Reprodução exata:

1. escrevi, num valor de dicionário de `app/actions/emulation_actions.py`, a
   frase *"o armador `suspend_vpads_for_steam_input` tem zero chamadores"*;
2. `_indexar` colhe **toda string constante que não seja docstring** para a
   lista `palavras` (é a cura deliberada dele para enxergar
   `getattr(x, "nome")` — o comentário diz que ignorar isso pegou o portão
   irmão cinco vezes numa medição só);
3. `_tem_chamador("suspend_vpads_for_steam_input", indice)` passou a devolver
   **`True`**, o par deixou de ser acusado, e **as três reprovações do portão
   viraram verde**: `test_nenhuma_declaracao_ficou_obsoleta`,
   `test_a_regua_ve_o_par_de_hoje` e `test_a_lista_de_leituras_atravessa_o_acessor`
   (esta com `KeyError`).

**Não alterei o portão** — é peça da D2, medida com cuidado, e uma correção
apressada pode cegá-lo. Contornei do meu lado (os valores do meu dicionário
citam `arquivo:linha`, não nome de função, e o porquê está escrito lá).

**A cura que eu proporia**, para quem for costurar: contar como despacho só a
string cujo conteúdo INTEIRO é um identificador (`re.fullmatch(r"[A-Za-z_]\w*",
s)`), ou só as strings que são argumento de `getattr`/`setattr`. Isso mantém o
caso que motivou a heurística e derruba a prosa. **Enquanto não houver cura,
qualquer frente que escrever o nome de uma função de `daemon/` dentro de uma
string de `src/` desliga esse portão em silêncio.**

### Para quem coordena — dois achados menores, fora da minha posse

- **`daemon/ipc_handlers.py:2013`** — a docstring de `_keyboard_emulation_payload`
  ainda lista `"vpad_suspenso_pelo_steam_input"` entre os valores que `bloqueio`
  pode ter, *"(o jogo assumiu a ENTRADA)"*. É o enquadramento que a medição de
  06/08 corrigiu e o valor que hoje é inalcançável. É `daemon/`, e a E15 do meu
  lado já está gatilhada; a linha lá continua ensinando o contrário.
- **`_mic_is_on` (`emulation_actions.py:1173`) tem ZERO chamadores de produção**
  — só testes o exercem. Não o removi porque ele é a régua com que os testes da
  `LIGAR-QUE-APAGAVA-A-CURA-01` medem a máquina de estados. É a forma exata da
  `A-CASA-SABE-E-O-PRODUTO-NAO-FAZ`, e cabe ao portão irmão decidir.
- **`"Hefesto Virtual"` sobrevive fora desta aba**, e o censo é maior que a
  minha posse: `core/evdev_reader.py:1726`, as regras udev
  (`test_udev_kernel07_path06.py:88`, glob `Hefesto Virtual DualSense P*`),
  `test_touchpad_ponteiro_do_sistema.py:159` (marcado "legado"),
  `test_virtual_pad_factory.py:71`, `test_doctor_vpad_motion.py`,
  `test_lugar_a_mesa_e2_descoberta_unificada.py:333`. Alguns podem ser legítimos
  (o fallback uinput, compatibilidade de regra udev antiga); outros são a mesma
  régua morta. **Precisa de um censo com dono.**

### Dela — e nada aqui anda sem a palavra

1. **As frases novas (E8, E9, E3, E4).** Classe de tela **ESTRUTURAL**: muda o
   que ela lê ao abrir a aba. **AGUARDA O OLHO DELA**, foto antes/depois.
2. **E15 — apagar ou reviver a frase do vpad suspenso.** Marquei; a decisão é a
   mesma pergunta que a `VPAD-SUSPENSO-MORTO-01` deixou.
3. **E3, os botões insensíveis.** A sprint pedia "botões insensíveis" no estado
   sem alvo, e eu **não** os desabilitei: com o controle desconectado, clicar
   "Ligar" ainda é gesto útil (prepara os drop-ins para quando ele chegar).
   Desabilitar removeria um gesto que funciona. **Escolha dela.**
4. **E4, o que é do PERFIL e o que é da MÁQUINA.** A frase de escopo diz o que
   o botão faz hoje; ela não decide o que deveria entrar no perfil.

### Não fiz, e por quê

| Tarefa | Por quê |
|---|---|
| **E2** | `app/app.py:1134` está no `nao_toca:` da minha sprint. A linha que ela precisaria: `inativar(nome == ABA_CONFIG)` passa a ser `inativar(nome in (ABA_CONFIG, ABA_EMULACAO))`, com o motivo em texto ao lado. |
| **E1** | Precisa do contrato de MARCAR da Onda 2 confirmado no disco, e a sprint manda **parar e avisar** se ele não estiver. Não confirmei — e o modelo de interação (marcar vs. aplicar) é decisão **dela**, item 1 do §9. |
| **E5** | Depende do E12 (o pintor puro), que não fiz. |
| **E6** | Precisa de `_perguntar_antes_de_relancar` e de decisão sobre quantos jogadores caem junto — que é a pergunta de BT nº 4, e não há adaptador na máquina. |
| **E10** | Precisa do `state_full` com `backend`/`degraded`, e do guard do E6. Fica encadeada. |
| **E12** | Precisa de `scripts/gui-captura/retratar_abas.py`, que não é da minha posse, e a foto não fecha nesta madrugada. |
| **E14, E16** | Decisão dela (persistência do teclado; ordem das seções e molduras). |

---

## 5. O que eu toquei fora da posse, e por que cada um era consequência direta

| Arquivo | Por quê |
|---|---|
| `po/en.po`, `locale/**`, `src/**/locale/**` | Trocar msgid do glade derruba a **catraca de cobertura de inglês** (medido: 107 → 106, e 107 é o piso do `test_mesa_cheia_11`). Traduzi as quatro entradas e recompilei; a cobertura subiu para **109**. |
| `tests/unit/test_mesa_cheia_11_a_janela_conta_quatro.py` | O bloco `SETE` guarda um trecho literal do tooltip que eu mudei. Atualizado com nota datada — o que ele guarda é o INGLÊS, não a frase. |
| `tests/unit/test_ligar_que_apagava_a_cura_01.py` | **Vício de bancada que eu criei, e curei.** O quarto estado fez `test_ligado_de_verdade_continua_verde` depender de haver um DualSense no cabo. Medido apontando `_PLACAS_ALSA` para um caminho inexistente: reprovava em `_mic_is_on() is True`, e só passava porque há um controle no cabo desta máquina. O `_tela()` daquele arquivo passa a **declarar** o alvo. |
| `tests/unit/test_contagem_emulacao_conta_aparelho.py` | É a metade da E11 que a sprint pede: *"o teste passa a usar o nome que o produto publica"*. Era ele que escondia o defeito. |

---

## 6. Os portões

```
bash scripts/portoes.sh   →   TODOS VERDES — 24 portões
.venv/bin/mypy src/hefesto_dualsense4unix  →  Success: no issues found in 221 source files
```

Escopo de pytest rodado (nunca a suíte inteira — ela cria nós uinput de
verdade): os cinco arquivos novos/alterados, mais
`-k "emula or emulation or teclado or vpad or microfone or mic or mascara or transporte or portao_o_par"`
(**1590 passed**) e `-k "ambiente or steam"` (**762 passed**) para as medições
da E7.
