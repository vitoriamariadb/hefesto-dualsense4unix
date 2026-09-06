# COOP-QUE-NÃO-DESMONTA-01 — E3, o número do jogador para de trocar de dono

**Agente:** opus · **Data:** 06/09/2026 · **Branch:** `voo/COOP-QUE-NAO-DESMONTA-01-opus`
**Base:** `c15d2e3e` (= `onda/atual-0609`, conferido)

A **ROTA CORRIGIDA** no topo da sprint vence o corpo dela: E1, E2(a) e E4
fecharam em `8d84f495` (25/08, BG-01). **Só a E3 estava aberta**, e é só ela que
esta entrega toca.

## O que mudou

**O MAC do vpad deixou de sair do número do jogador e passou a sair do
controle físico.**

O defeito, por extenso: `_next_player_index` devolve o menor índice livre ≥ 2 e
o teardown devolve o índice ao poço — o reuso é DE PROPÓSITO, porque o jogo quer
P1..PN contíguos. Com o MAC do vpad saindo desse número
(`f"02:fe:00:00:00:{player:02x}"`), uma queda no meio da mesa fazia **o MAC do
Jogador 2 passar a pertencer a outra pessoa**, e um jogo que salve por slot de
dispositivo trocava os perfis de dono sem uma linha de log.

Três arquivos:

1. **`src/hefesto_dualsense4unix/integrations/uhid_gamepad.py`** (a posse)
   - nasce `vpad_mac(identity, player)`: quando `identity` é um endereço de
     aparelho (12 dígitos hex, com ou sem `:`), o MAC vira
     `02:fe` + quatro octetos de `blake2b(identity)`; qualquer outra coisa cai
     em `player_mac(player)`;
   - `UhidDualSense` ganha o campo `identity`, e a propriedade `mac` passa a ser
     `vpad_mac(self.identity, self.player)`;
   - `for_flavor` repassa a `identity` que já recebia desde a
     MÁSCARA-POR-JOGADOR-01 (15/08) e usava só para escolher a máscara;
   - `player_mac` **fica intacta, com a forma exata de sempre** — três módulos
     espelham o prefixo `02fe` por peso de import e o portão
     `tests/unit/test_a_bateria_nao_le_o_no_do_vpad.py` os confronta com ela.
2. **`src/hefesto_dualsense4unix/integrations/virtual_pad.py`** (fora da posse
   declarada — ver "o que sobrou"): `_try_uhid` ganha `identity` e a atribui ao
   vpad **antes do `start()`**. Sem este degrau a cura parava na factory e não
   chegava ao produto: `coop._promote_player` e `gamepad` já passavam
   `identity` para `make_virtual_pad`, e era o `_try_uhid` que a descartava.
3. **`tests/unit/test_coop_numeracao_sem_colisao.py`** (a posse): oito réguas
   novas em duas classes.

### As três decisões de desenho, e a razão medida de cada uma

- **`hashlib`, nunca `hash()`.** O `hash()` de `str` é salgado por processo
  (`PYTHONHASHSEED`): o MAC do vpad mudaria a cada reinício do daemon, e o
  sintoma seria **idêntico ao defeito curado** — o jogo vendo um controle novo
  onde está o mesmo plástico. Há régua com subprocesso e três sementes.
- **O bit `0x80` reservado no terceiro octeto.** Os dois espaços ficam disjuntos
  por CONSTRUÇÃO: derivado `02:fe:80..ff:xx:xx:xx`, fallback
  `02:fe:00:00:00:0N`. Sem a reserva, um hash azarado daria dois vpads com o
  mesmo MAC e o segundo probe morreria com `-EEXIST` — o defeito ressuscitado
  pela própria cura.
- **Identidade INSTÁVEL recua para o número, e o recuo é deliberado.** O espaço
  de identidade desta casa tem três formas disjuntas por prefixo
  (`core/evdev_reader._external_dedup_key`): o MAC do aparelho; `dev:<instância
  HID>`, a chave dos clones sem endereço próprio; e `path:<node>`. As duas
  últimas **mudam a cada replug** — o node é renumerado pelo kernel, e é isso
  que o journal de 02/08 mostra. Derivar delas seria trocar um MAC instável por
  outro, com a agravante de PARECER curado. O filtro **descarta**, não peneira:
  um caractere fora de `[0-9a-f:]` invalida o valor inteiro, senão os dígitos
  hex de dentro de um caminho de sysfs (`d`, `e`, `a`, `c`…) poderiam somar doze
  por acidente.

### O que NÃO mudou, e é metade da entrega

- `UhidDualSense(player=N).mac` continua `02:fe:00:00:00:0N`. O teste-muralha
  `test_lugar_a_mesa_numero_de_jogador_nao_se_repete.py:442` passa sem tocar;
- o NÚMERO do jogador continua contíguo e reusável — a sprint avisa que "não
  reusar o índice" é a correção intuitiva e errada;
- `_features_com_mac_proprio` não mudou uma linha: ele sempre leu `self.mac`, e
  o que mudou foi de onde `self.mac` sai. Nenhum consumidor digitava a
  derivação — `coop.py:156`, `ipc_handlers` e `controller_card` leem
  `getattr(vpad, "mac")`;
- o gate de máscara continua decidido pela máscara EFETIVA que a factory
  resolveu. A identidade entra **depois** do `for_flavor`, de propósito:
  `for_flavor(identity=...)` faz uma SEGUNDA leitura do registro de máscaras, e
  a armadilha descrita em `external_mask.py:59-68` é exatamente a janela em que
  as duas leituras podem discordar. O MAC não precisa do veredito da máscara —
  precisa da âncora, que é o mesmo dado nas duas leituras.

## Qual mordida prova

Cinco arrancadas, uma por vez, cada uma com a cura devolvida em seguida. Todas
com `python -m pytest tests/unit/test_coop_numeracao_sem_colisao.py -q`.

**Com a cura (o estado entregue):** `14 passed in 0.77s`

**MORDIDA 1 — `mac` volta a ser `player_mac(self.player)`:**
```
E       assert '02:fe:00:00:00:02' == '02:fe:89:b1:c3:0d'
FAILED ...::TestOMacDoVpadSegueOAparelho::test_a_noite_dela_o_controle_cai_volta_e_o_jogo_ve_o_mesmo_device
FAILED ...::TestACuraChegaAoProduto::test_o_vpad_que_a_factory_entrega_traz_o_mac_do_aparelho
2 failed, 12 passed
```

**MORDIDA 2 — `vpad_mac` devolve sempre o número (`if True:`):**
```
E   AssertionError: assert '02:fe:00:00:00:02' not in {'02:fe:00:00:00:01', ...}
FAILED ...::test_o_mesmo_controle_mantem_o_mac_em_qualquer_numero
FAILED ...::test_a_noite_dela_o_controle_cai_volta_e_o_jogo_ve_o_mesmo_device
FAILED ...::test_o_mac_derivado_e_o_do_numero_nunca_se_cruzam
3 failed, 11 passed
```

**MORDIDA 3 — o bit reservado `0x80` apagado:**
```
FAILED ...::test_o_mac_derivado_e_o_do_numero_nunca_se_cruzam
1 failed, 13 passed
```

**MORDIDA 4 — `hash()` no lugar do `blake2b`:**
```
E        +  where 3 = len({'02:fe:8f:36:3f:ec', '02:fe:be:14:fc:13', '02:fe:df:b0:27:db'})
FAILED ...::test_a_derivacao_sobrevive_a_um_daemon_novo
1 failed, 13 passed
```
(as três respostas são três sementes de `PYTHONHASHSEED` — é o daemon reiniciado
três vezes, dando três MACs para o mesmo plástico.)

**MORDIDA 5 — `virtual_pad._try_uhid` volta a descartar a identidade (o estado
de ontem):**
```
[info] vpad_uhid_ativo   mac=02:fe:00:00:00:02  name='... (Hefesto P2)' player=2
FAILED ...::TestACuraChegaAoProduto::test_o_vpad_que_a_factory_entrega_traz_o_mac_do_aparelho
1 failed, 13 passed
```
Esta é a que importa mais: com a função certa e o repasse faltando, **as sete
outras réguas continuam verdes** e o produto continua doente. É o formato de
instrumento falso que esta casa já pagou várias vezes.

**A vizinhança, com a cura devolvida** — os 26 arquivos de teste de
`uhid`/`vpad`/`coop` mais `virtual_pad_factory`, `mascara_por_jogador_01`,
`mascara_por_controle_manda_no_vpad`, `lugar_a_mesa*`,
`a_bateria_nao_le_o_no_do_vpad`, `subsystem_gamepad` e `evdev_reader`:
```
737 passed, 2 xfailed in 20.66s
```

## O que NÃO verifiquei

- **NADA NO APARELHO.** Não reservei a bancada e não toquei em controle nenhum:
  a ROTA CORRIGIDA diz com todas as letras que *"a prova de bancada (dois
  controles, o primário cai e volta) é da MESA-DE-QUATRO-01; aqui a régua usa
  dublê"*. A bancada estava **LIVRE** (`scripts/bancada.sh status`) — não é que
  faltou, é que não é minha. Consequência honesta: **nenhum vpad desta entrega
  passou por `/dev/uhid`**; `start()` e `wait_for_bind` estão monkeypatchados na
  régua da factory. O degrau da escada que eu alcancei no aparelho é **nenhum**.
- **O `-EEXIST` do probe com dois MACs derivados iguais nunca foi exercido.** A
  disjunção com o espaço do fallback é estrutural e está medida; a colisão
  ENTRE dois derivados é probabilística (31 bits úteis, ~2,8e-9 para os quatro
  controles do alvo) e não tem régua — não sei como forjá-la sem plantar um
  hash falso, que mediria o dublê e não o produto.
- **O caminho do co-op inteiro não rodou.** Medi `vpad_mac`, o objeto
  `UhidDualSense` e a factory. Não rodei `CoopManager._promote_player`, nem o
  `sync`, nem o `reconnect_loop` — a bancada de relógio virtual da E4 já existe
  desde `8d84f495` e não foi reexecutada por mim.
- **Não medi o que o JOGO faz com o MAC novo.** A hipótese "jogo que salva por
  slot de dispositivo passa a reconhecer o mesmo controle" é a razão da sprint,
  não uma medição desta entrega. Nenhum jogo foi aberto.
- **Não rodei a suíte inteira** (regra da casa: é de quem coordena, no fim, em
  lotes).
- **Não olhei tela nenhuma.** A entrega não toca a interface; o
  `controller_card` exibe o `vpad_uniq` que o daemon manda e continua exibindo o
  que receber. **O texto que aparece para ela muda** — o campo passa a mostrar
  um endereço derivado em vez de `02:fe:00:00:00:02`. É mudança de conteúdo, não
  de texto de tela, mas ninguém a viu com o olho.

## O que sobrou para o próximo

1. **`integrations/virtual_pad.py` está FORA da `posse:` declarada desta
   sprint** — e eu o editei, com 20 linhas (um parâmetro, uma atribuição, e a
   prosa que explica as duas). O critério: nenhuma outra sprint do LOTE-2 o
   declara (conferi as quinze), e sem esse degrau a cura não chega ao produto —
   a regra da casa é que *quando a cura conhece a causa, ela cobre TODOS os
   chamadores*. **Se a costura der conflito ali, o conflito é meu.**
2. **A prosa de OUTROS módulos ainda diz `02:fe:00:00:00:0N` como se fosse a
   única forma**, e agora é a forma do fallback. Não editei porque dois deles
   estão em `nao_toca:` e o terceiro não é meu:
   - `daemon/subsystems/coop.py:142`, `:454` e o comentário de
     `_promote_player` (~:975) — **`nao_toca:`**;
   - `core/backend_pydualsense.py:152` — **`nao_toca:`**;
   - `integrations/no_do_vpad.py:44` e `:255`;
   - `integrations/uhid_blueprint.py:37` e `:116`.
   Nenhum deles digita a derivação em CÓDIGO — todos casam por prefixo `02fe`
   ou leem `vpad.mac`. É dívida de texto, não de comportamento.
3. **EU TOQUEI O `docs/data/mapa-controles.csv`, e ele NÃO é minha posse.**
   Toquei só os NÚMEROS DE LINHA de dois `codigo_ref` que a minha própria
   edição quebrou, e a decisão está aqui inteira porque ela merece conferência.

   Acrescentar ~140 linhas ao meio de `uhid_gamepad.py` empurra tudo que vem
   depois, e o portão `citacoes-de-linha` (VERDE na base desta árvore, medido
   com `git stash`) reprovou **5 citações podres**, todas para este arquivo:

   | onde | citava | passou a citar | símbolo prometido |
   | --- | --- | --- | --- |
   | `docs/protocol/dualsense-referencia-canonica.md:1299` | `:1774` / `:536` | `:1913` / `:539` | `forward_jack` |
   | `docs/protocol/pilha-steam-input-xpad-sdl.md:935` | `:736-765` | `:857-886` | `_fala_de_vibracao` |
   | `mapa-controles.csv:172` (`luz.replica_output_jogo@dualsense`, cabo e rádio) | `:2256` | `:2395` | `_replicate_from_output` |
   | `mapa-controles.csv:305` (`vibracao.rumble.passthrough@dualsense`, cabo e rádio) | `:2026` | `:2165` | `_handle_output` |

   **Nenhuma AFIRMAÇÃO do mapa mudou** — nem uma célula de veredito, de canal,
   de grau ou de ressalva. Só o endereço, e para onde a coisa está hoje: é o que
   o próprio portão manda fazer (*"Reaponte-o para onde a coisa está hoje; não
   apague a afirmação"*). Não havia saída: qualquer linha de código nova neste
   arquivo empurra os endereços, e deixar o portão vermelho não é opção.

   **E isso obrigou a regenerar `html/specs.html`** — `mapa-de-canais` ficou
   vermelho porque a página publicada sai do CSV. Rodei
   `scripts/gerar-mapa.py` (a §5 do COMO-EXECUTAR avisa contra regenerar
   artefato compartilhado; o portão pedia isto pelo nome). **Conferi o
   resultado:** as quatro ocorrências dos dois endereços velhos sumiram e as
   quatro novas apareceram, e mais nada — só o carimbo de data/branch, que este
   gerador sempre reescreve.

   **Se a costura der conflito no CSV ou no `specs.html`, o conflito é meu**, e
   a resolução certa é ficar com a afirmação do vizinho e o endereço novo.
   A linha `plataforma.vpad@dualsense` também cita `uhid_gamepad.py:123` e
   `:670`, que andaram — o portão não as acusa porque elas não prometem
   símbolo, e eu não as toquei. Quem escreve o mapa é a SPECS-A-PROCEDENCIA-01.
4. **A prova de aparelho continua devendo, e é da MESA-DE-QUATRO-01**: derrubar
   o primário por Bluetooth com um segundo controle ativo e ler o `HID_UNIQ` dos
   dois vpads no `uevent`, antes e depois. O que ela tem de ver: o vpad de cada
   plástico com o MESMO `02:fe:8…` do começo ao fim, e o número do jogador
   trocando à vontade por baixo. A linha do journal que serve de prova já sai
   sozinha: `vpad_uhid_ativo mac=… player=…`.
5. **Uma pergunta de produto, pequena e dela:** o `controller_card` mostra o
   `vpad_uniq` para ela. Ele passa a exibir um endereço derivado
   (`02:fe:89:b1:c3:0d`) no lugar de um legível (`02:fe:00:00:00:02`). Não
   mexi na tela; se o endereço tem de continuar legível ali, a resposta é a
   tela mostrar o NÚMERO do jogador (que continua contíguo) e não o `uniq`.

6. **Dois vermelhos que vieram DA BASE e não são meus, achados de passagem.**
   `tests/unit/test_saida_de_agente_sanitizada.py` reprova em
   `docs/process/agentes/2026-09-06/A-CONFISSAO-NO-BOTAO-01.md` e
   `PARIDADE-REMEDIR-01.md`, os dois por **glifo proibido** (um `♪` que devia
   ser `[nota]`) — nada de MAC nem de segredo. Os dois arquivos entraram em
   `cce9b47f`, antes desta árvore nascer, e as minhas três entradas passam.
   **Este teste NÃO está no `scripts/portoes.sh`**, então os 45 portões ficam
   verdes com ele vermelho: quem roda a suíte no fim vai encontrá-lo.
