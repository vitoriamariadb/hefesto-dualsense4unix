# UMA FAIXA NÃO É UM FABRICANTE-01 · D3 — a E1 fechada nos quatro caminhos que faltavam

25/08/2026, retomada. Árvore `hefesto-voo/UMA-FAIXA-NAO-E-UM-FABRICANTE-D3`,
branch `voo/UMA-FAIXA-NAO-E-UM-FABRICANTE-D3`. Três commits.

**O que eu encontrei ao chegar:** `scripts/bt_nosniff_now.sh` modificado e **não
commitado** — o agente anterior tinha escrito a decisão por negativa e um
comentário que citava um portão, `tests/unit/test_o_no_sniff_alcanca_todo_pro.py`,
que **não existia**. Commitar aquilo como estava seria publicar um comentário que
mente sobre a própria rede. Escrevi o portão, achei três buracos no que estava
lá, e só então commitei.

**O que a base já tinha fechado, e eu NÃO refiz:** o commit `e5376a0` (22/08)
levou a E1 ao daemon (`external_identity.py`), à tela (`ver_botao.py`), à metade
do prefixo do `bt_active_mode.sh`, e fechou a **E2** (a regra 84 aprendeu a dizer
`nintendo-pro-desconhecido`), a **E3** (a raiz do `retrato_offscreen.py` saiu do
`$HOME` dela) e a **E4** (o parêntese errado do `mesa_de_radio.py`). Conferi as
três, uma a uma, antes de escrever uma linha.

**Sem aparelho.** `/sys/class/bluetooth/` está vazio desde 02:36 — nenhuma
medição de rádio foi feita, nem podia. Tudo aqui é código e régua, com `hcitool`
e `busctl` dublês.

## O que mudou

### 1. `scripts/bt_nosniff_now.sh` + `assets/82-nintendo-pro-nosniff.rules` — a BORDA do connect

O helper decidia com `[[ "${MAC^^}" != "E0:F6:B5"* ]] && exit 0`. Agora vai por
negativa, em quatro degraus, e **cada recusa é uma palavra diferente**
(`D-O-QUE-O-PRODUTO-DIZ-SEM-SABER`, o defeito de forma F7):

| situação | o que o journal passa a dizer |
|---|---|
| faixa do clone 8BitDo | *"para ele o no-sniff é veneno — a probe morre em `ret=-110`. Recusar aqui É a cura"* |
| faixa já vista num aparelho | aplica, **sem consultar nome nenhum** |
| nome com cara de Pro | aplica — é por aqui que o Pro de outra safra entra |
| faixa desconhecida, **sem nome** | *"o CHAMADOR NÃO DECLAROU o nome"* — ausência de **declaração** |
| faixa desconhecida, nome que não é de Pro | *"o nome declarado ('…') não é de um Pro"* — ausência de **casamento** |

Antes, as cinco linhas eram o mesmo `exit 0` mudo.

**Três buracos que achei no trabalho em voo e fechei:**

1. o comentário citava uma função `_recusar_sem_saber` que não existe (é
   `_recusar`);
2. **a cura era inteiramente INERTE em produção.** A regra 82 só chamava o
   helper para a faixa desta bancada — ele aprendeu a decidir sobre um Pro de
   qualquer safra e nunca era chamado para um. É *"a casa sabe e o produto não
   faz"*, na mesma leva em que a cura foi escrita;
3. pelo **cabo** o `HID_UNIQ` do Pro é o serial `000000000001`, e o clone mente o
   mesmo serial. Casar por nome sem guarda levaria o Pro no cabo ao `hcitool lp`
   contra um "endereço" que não é endereço, três vezes, e o journal registraria
   uma falha que não é falha.

**A regra 82 tem uma TERCEIRA saída, e não é nenhuma das duas que a sprint pôs
para ela decidir.** A sprint escreveu: *"ou 82 linhas geradas, ou tirar o filtro
da regra"* (§E1, e a decisão dela nº 1). Casar por `ENV{HID_NAME}` custa **uma
linha**: o conjunto "device HID que se chama Pro Controller" tem exatamente dois
membros no mundo — o genuíno e o clone, que mente o mesmo nome. Não há lista para
envelhecer, e não há `RUN+=` em todo device HID por Bluetooth.

```
ACTION!="add",   GOTO="hefesto_nosniff_fim"
SUBSYSTEM!="hid", GOTO="hefesto_nosniff_fim"
ENV{HID_UNIQ}=="e0:f6:b5:*", GOTO="hefesto_nosniff_aplica"   # rota 1: faixa já vista
ENV{HID_UNIQ}=="E0:F6:B5:*", GOTO="hefesto_nosniff_aplica"
ENV{HID_UNIQ}!="??:??:??:??:??:??", GOTO="hefesto_nosniff_fim"  # rota 2: só por rádio
ENV{HID_NAME}!="*[Pp]ro [Cc]ontroller*", GOTO="hefesto_nosniff_fim"
LABEL="hefesto_nosniff_aplica"
TEST=="…/bt_nosniff_now.sh", RUN+="…/bt_nosniff_now.sh $env{HID_UNIQ}"
LABEL="hefesto_nosniff_fim"
```

Três coisas que o desenho paga:

- **as duas linhas de faixa continuam, e continuam ANTES** — quem já recebia a
  cura não passa a depender de um dado novo;
- **o `GOTO` impede o Pro desta bancada de casar as duas rotas** e chamar o
  helper duas vezes por connect;
- **o nome vai pelo AMBIENTE, não no `RUN+=`.** O udev exporta as propriedades do
  device para o programa do `RUN+=`; pôr `$env{HID_NAME}` na linha de comando
  quebraria "Nintendo Co., Ltd. Pro Controller" em cinco argumentos, porque o
  udev separa o argv por espaço **depois** de substituir. O helper lê
  `NOME="${2:-${HID_NAME:-}}"`.

**FATO ERRADO, SUBSTITUÍDO:** o comentário do helper dizia ser a *"mesma fonte da
verdade"* do `NINTENDO_REAL_OUI` do `external_identity.py`. Aquele módulo parou de
decidir por ela em 22/08 — a frase descrevia uma comunhão que não existia mais.

### 2. `scripts/bt_active_mode.sh` — a VIGIA de 2 minutos

O caminho **sustentado**: a borda cobre o instante do connect, mas quem mantém o
Pro fora do sniff pela sessão inteira é este laço. Ele decidia pela mesma faixa
única. Agora: `_e_pro_genuino "$MAC" "$(_nome_do_controle "$MAC")"`, com o nome
saindo do D-Bus e, na falta dele, da árvore de bonds em disco — o mesmo lugar de
onde `_hci_com_nintendo` já o lê quando o bluetoothd ainda está povoando.

**Duas perguntas, duas listas, no mesmo arquivo e de propósito**, porque
misturá-las troca o tratamento dos dois controles:

- *"é da linhagem?"* → genuíno **e** clone respondem sim. Decide o **prefixo** do
  adaptador (o A/B de 23/07 mediu que o nome não atrapalha o clone);
- *"é um Pro genuíno?"* → só o genuíno. Decide o **no-sniff**, que para o clone é
  veneno.

`OUIS_LINHAGEM` é a união das outras duas, e há portão que reprova se elas se
separarem — aqui dentro **ou** do dono em `core/linhagem_nintendo.py`.

**O laço é silencioso quando recusa, e isso é decisão medida:** ele roda a cada 2
minutos, e uma linha de journal por recusa seriam ~720 por dia por controle. Quem
diz o motivo, **uma vez por connect**, é o helper da borda — o lugar onde a
informação é nova.

### 3. `scripts/doctor.sh` — o falso verde, reproduzido antes de consertado

Esta é a linha `scripts/doctor.sh:3078` da tabela A1 da sprint, e eu a **vi
acontecer** numa bancada de mentira antes de tocar no código:

```
$ # um Pro de outra safra conectado e COM sniff — a cura FURADA
$ bash -c 'source doctor.sh; check_bt_resilience'
[ OK ] modo ativo p/ Nintendo (nome 'Nintendo Mesa' + SNIFF no adaptador p/ o
       8BitDo probar + no-sniff só no Pro genuíno — BT-SNIFF-PER-OUI-01)
```

O `grep -oiE 'E0:F6:B5(:[0-9A-F]{2}){3}'` não achava o controle, `_pro_lp` ficava
`"ausente"`, e o exame aprovava a cura **sem ter olhado controle nenhum**. Depois:

```
[WARN] modo ativo p/ Nintendo: alias e SNIFF do adaptador OK, mas o Pro genuíno
       conectado está COM sniff (deveria ser sem). Reaplique: sudo …
```

E a outra ponta continua quieta: o **clone** com sniff não vira reclamação,
porque é o estado certo dele. Barulho em exame é o que ensina a ignorar exame.

**COMENTÁRIO QUE PROMETIA UM PORTÃO INEXISTENTE, substituído.**
`doctor.sh:2688` afirmava: *"a régua de 'é da linhagem' é do produto (…) e há
portão de paridade entre os dois"*. **Medido: portão nenhum lia aquelas listas** —
nenhum teste da árvore menciona `_bt_hospeda_linhagem` —, **e elas já tinham
derivado**: havia ali um `98:B6:E9` escrito à mão que não existe em lugar nenhum
do produto. Um comentário que afirma um portão que não existe é pior que nenhum:
ele desencoraja a conferência que teria achado a divergência. A faixa saiu (um
Pro dela entra pelo **nome**, como qualquer Pro de safra que esta bancada nunca
viu), as listas viraram cópia pinada, e agora o portão existe e está nomeado.

### 4. Três testes antigos que guardavam o fato derrubado

- `tests/unit/test_a_oui_separa_o_clone_do_genuino.py` — a doutrina dele era *"as
  três réguas apontam para a mesma OUI do genuíno"*. Passa a cobrar o que
  continua verdade (**a faixa do CLONE**, que é lista fechada e completa) e ganha
  uma **lápide** que reprova se `OUI_NINTENDO_REAL` voltar;
- `tests/unit/test_migracao_bluez_depreciados.py` — lia a OUI da constante morta;
  passa a lê-la do dono;
- ambos continuam verdes junto com os 197 testes vizinhos das regras 82/83, do
  empacotamento e do uninstall.

## Qual mordida prova

Nove. Cada uma: arranquei a cura, vi reprovar, devolvi, vi passar — com
`find . -name __pycache__ -exec rm -rf` entre o arrancar e o devolver.

| # | o que arranquei | o que reprovou |
|---|---|---|
| 1 | o gate de UMA faixa de volta ao `bt_nosniff_now.sh` | **6 testes**: o Pro de outra safra, o clone sem motivo escrito, o nome pelo ambiente, e as três recusas de F7 |
| 2 | a rota por nome da regra 82 | `test_a_regra_casa_por_nome_e_nao_so_por_faixa`, `test_a_rota_por_nome_exige_forma_de_endereco` |
| 3 | `NOME="${2:-${HID_NAME:-}}"` → `NOME="${2:-}"` | `test_o_nome_pode_vir_do_ambiente_como_o_udev_o_entrega` — e com ele a cura inteira, porque em produção quem chama é o udev |
| 4 | a guarda de forma de endereço | `test_o_serial_do_cabo_nao_vira_endereco` |
| 5 | uma faixa a mais na cópia em shell | `test_a_faixa_do_clone_e_a_mesma_dos_dois_lados` |
| 6 | o gate de UMA faixa de volta à vigia | `test_o_pro_de_outra_safra_e_tirado_do_sniff_a_cada_tique` |
| 6-bis | idem, **com a constante indentada** | ver abaixo — a mordida achou um furo no meu próprio portão |
| 7 | `_nome_do_controle` deixando de ser chamado | `test_o_pro_de_outra_safra_e_tirado_do_sniff_a_cada_tique` (prova que o caminho do nome é mesmo exercitado) |
| 8 | o `grep` de UMA faixa de volta ao `doctor.sh` | `test_o_pro_de_outra_safra_com_sniff_faz_o_exame_reclamar` |
| 9 | uma faixa a mais na lista do exame | `test_as_listas_do_exame_nao_se_separam_do_dono` |

**A mordida 6-bis merece ser lida.** Na 6 eu devolvi a constante **indentada**,
dentro do laço — que é exatamente onde ela viveria. A lápide que eu tinha escrito
usava `^OUI_NINTENDO_REAL=`, e passou verde: o portão que eu acabara de escrever
para impedir o fato de voltar **não teria impedido o fato de voltar**. Âncora
corrigida para `^[ \t]*OUI_NINTENDO_REAL=`, e a mordida refeita reprova os dois.
É a cicatriz *"o portão pode olhar para o lugar errado"* aplicada a mim.

**Pelo mesmo motivo a faixa não se escreve mais em comentário nenhum desses
scripts.** No primeiro corte, o meu comentário explicativo citava
`OUI_NINTENDO_REAL="E0:F6:B5"` por inteiro — e o portão vizinho **passou verde
lendo o comentário**. Um portão por regex não distingue código de prosa.

**A régua do `udevadm verify` foi conferida contra si mesma:**
`test_o_udev_aprova_a_sintaxe_e_a_regua_nao_e_no_op` aprova a regra de verdade
**e** exige que uma chave inventada seja recusada. Se o `verify` aprovasse
qualquer coisa, aprovar a nossa não significaria nada.

**Portões:** `bash scripts/portoes.sh` → **TODOS VERDES — 23 portões**, com
`git add -A` antes. Os 28 testes do arquivo novo + 197 vizinhos + 278 do doctor.

## O que NÃO verifiquei

- **Nada com aparelho.** `/sys/class/bluetooth/` está vazio (hub dela fora do
  barramento desde 02:36). Não há como confirmar que o `HID_NAME` de um Pro **por
  rádio** contém "Pro Controller" nesta pilha — a evidência é a M2 da própria
  sprint (o Alias do BlueZ é `Pro Controller`) e o `hid-nintendo` lido no fonte.
  **Se o nome por rádio vier diferente, a rota 2 da regra 82 não casa** — e a
  rota 1 continua cobrindo o Pro desta casa, então o pior caso é ficar como
  estava. Degradação, não perda;
- **`udevadm test` com um device de mentira.** Não existe device HID falso para o
  udev; o que dá para medir é a sintaxe (`udevadm verify`) e a estrutura das
  linhas, e é o que o teste faz. Que a regra CASA o que promete só um aparelho
  prova;
- **a decisão nº 3 dela** (`bcdDevice >= 0210`) exige um segundo Pro genuíno;
- **a A5** (a conf de WiFi com escopo `type:wifi`) segue como a sprint a deixou:
  opt-in, sem cura, decisão dela nº 4.

## O que sobrou para o próximo

1. **A rota por nome da regra 82 é uma resposta à decisão dela nº 1, não a
   decisão.** Ela pediu para escolher entre 82 linhas e zero filtro; eu entreguei
   a terceira, que custa uma linha e nenhuma lista. **Reverter é apagar duas
   linhas** — a rota 1 sozinha devolve o comportamento de antes. Vale o olho
   dela.
2. **DÍVIDA DATADA (25/08/2026) — o ponteiro do mapa de canais.** O nó
   `test_as_tres_reguas_da_casa_apontam_para_a_mesma_oui_do_genuino` sobrevive só
   como **ponteiro**: `docs/data/mapa-controles.csv`, linha
   `plataforma.distinguir_clone@pro`, cita esse id na célula `teste_que_morde`, e
   o `check_paridade_transporte.py` reprova quando ele some. **O mapa é
   território da frente B5 e eu não escrevo nele.** Quem fechar: renomeie para
   `test_os_dois_scripts_de_no_sniff_concordam_sobre_quem_e_o_clone` e mude a
   célula **no mesmo commit**.
3. **A E2 da sprint irmã (N-IGUAL-A-UM-01) está destravada.** Ela dependia do
   predicado do A1 — *"quem responde 'hospeda Nintendo?'"* —, e o predicado agora
   está generalizado nos quatro caminhos. A pergunta que sobra é dela: **todos os
   adaptadores viram "Nintendo", ou só os que hospedam um?**
4. **Existe uma QUARTA cópia da regra em shell**, agora — `bt_nosniff_now.sh`,
   `bt_active_mode.sh` e `doctor.sh`, cada uma pinada por portão contra
   `core/linhagem_nintendo.py`. Está certo pelo motivo escrito (os três rodam
   fora do venv, e o doctor roda **justamente** quando algo não está de pé), mas
   é o tipo de coisa que vira cinco sem ninguém decidir. Se aparecer a quinta,
   o desenho a considerar é um arquivo `.sh` de listas que os três leiam.
5. **Um vermelho que não é meu:**
   `test_doctor_cobra_as_duas_obrigatorias.py::TestOhDoctorCobraOLoaderSVG::test_com_o_loader_passa`
   reprova **também com a minha árvore em `git stash`** — conferido. É ambiente,
   não regressão desta frente.
