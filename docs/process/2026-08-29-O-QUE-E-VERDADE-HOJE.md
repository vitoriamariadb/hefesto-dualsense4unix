# O QUE É VERDADE HOJE — 29/08/2026

**Cinco minutos: leia §1 e §3** — são as duas que mudam o que você faria amanhã.
**Oito minutos para o arquivo inteiro** (1.885 palavras, contadas; o número é
medido em vez de redondo porque este documento existe justamente para não
propagar número redondo). Pedido dela: *"auxiliando os agentes do futuro a
gastarem menos tokens de leitura sabendo o certo."*

Agente chegando agora: isto poupa os seis retratos de dia. Leia antes de abrir
outra coisa.

**Tudo medido contra o disco em 29/08/2026, com endereço.** Onde contradiz outro
documento, **quem erra é o outro documento**; §3 diz o que já foi corrigido.

Não é a fila ([SPRINT_ORDER](SPRINT_ORDER.md)), nem o contrato de tela
([O REDESENHO](2026-08-26-O-REDESENHO-as-dez-abas.md)), nem o retrato do dia
([ONDE PARAMOS](2026-08-29-ONDE-PARAMOS-a-tecnologia-decidida-e-a-cura-que-a-tela-desfazia.md)).

---

## 1. O QUE MUDA O QUE VOCÊ FARIA AMANHÃ

**1.1 — A mesa desta casa não prova nada.** `D-A-REGUA-E-QUALQUER-MESA-NAO-A-DELA`.
O app é GPL3 e pensado como acessibilidade; cinco controles com MAC de 12 hex é a
**amostra mais favorável que existe**. O que prova é o MECANISMO. Exemplo vivo:
`daemon/subsystems/identity.py:113-125` — controle sem serial de 12 hex ganha slot
**volátil**, e para esse usuário a memória por identidade **não funciona nunca**,
em silêncio. Nenhum controle daqui revela isso.

**1.2 — `radio_aciona=não` é ESTADO, nunca veredicto.**
`D-O-RADIO-NAO-E-VEREDICTO-E-ESTADO`. No PS5 tudo isto funciona nativamente nos
quatro controles por Bluetooth; o que anda no cabo é possível no rádio, e o que
anda para um andará para quatro. A célula diz *"não conseguimos ainda, por esta
pilha"*. **Nunca escreva — em código, tela ou documento — que o aparelho não faz.**

**1.3 — Confira COMO a foto foi tirada antes de acreditar nela.** Hoje o produto
foi declarado lendo a cor do plástico com base numa foto de `--cor-duble`, um
dublê que não manda byte nenhum (`src/hefesto_dualsense4unix/interface/controles_vivos.py`).  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->
No instante da foto, `ler_pelo_cabo` devolvia `None`.

**1.4 — Dois fatos desta conversa caducaram no mesmo dia** (§2.2 e §2.4), curados
por outro agente entre a medição e a escrita. Se o seu enunciado cita um deles
como defeito aberto, **meça antes de executar**.

---

## 2. OS ONZE FATOS

**2.1 O acelerômetro funciona; o produto o joga fora.** O nó "Motion Sensors"
publica `ABS_X/Y/Z` a `resolution=8192` (acelerômetro) **e** `ABS_RX/RY/RZ` a
`1024` (giro), no MESMO nó; medido `|v|` = 0,9971 g e 0,9928 g. O descarte está
em `core/evdev_reader.py:2092-2094`, `:2146`, `:2165`; `daemon/sensor_hub.py:119`
monta só `"gyro"`. Ela mandou consertar: `D-O-ACELEROMETRO-VOLTA-E-FUNCIONA` —
*"não era pra ele sair, era pra ele funcionar."* Dono: `ONDA-CONTROLES-04`.
**Armadilha:** a causa no mapa segue `so-ela-decide` de propósito — é a única
linha com esse valor, e trocá-la sozinha faz
`test_cada_valor_do_dominio_e_usado_ou_explicado[so-ela-decide]` reprovar. Causa
e vocabulário no MESMO commit.

**2.2 A cor do plástico: curada no cabo hoje, sem foto que a prove.** A causa era
permissão — os hidraw dos DualSense são `0600 root:root` (broker BROKER-01) e o
produto abria `/dev/hidraw` direto. Cura em `cor_do_plastico.py:513`
(`abrir_hidraw`, porta do broker com `SCM_RIGHTS`, queda para `open()` sem
broker). **Pelo rádio segue `não`, causa `divida`.** A cor lida **não vai ao
disco por decisão**: `utils/maquina.py:562` guarda a DECLARAÇÃO dela.

**2.3 Duas listas de cor, sete de divergência.** `docs/data/cores-do-dualsense.csv`
(cabeçalho na linha 70) tem **28** modelos; `NOMES_DE_FABRICA`
(`integrations/cor_do_plastico.py:96`) tem **21**. Faltam `13`, `14`, `15`
(HyperPop), `ZC`, `ZD`, `ZE`, `ZF`. Quem comprou um desses lê **"Não sei"**.
Três nomes divergem (`Z1`, `Z2`, `ZB`) e o desempate **precisa de fonte**. Dono:
`ONDA-CONEXOES-12`, com irmã `UMA-LISTA-DE-COR-SO-01` para a mesma cura.

**2.4 A máscara por controle: curada hoje.** `make_virtual_pad` ganhou `identity`
(`integrations/virtual_pad.py:153`) e resolve `mascara_efetiva` **antes** de
escolher o backend; passam o MAC `daemon/subsystems/gamepad.py:2108` e
`daemon/subsystems/coop.py:990`. Régua com 13 testes em
`tests/unit/test_mascara_por_controle_manda_no_vpad.py`. **Sobra o vpad não ser
RECRIADO ao aplicar.**

**2.5 O áudio arma sem soltar, e o LED também.**
`mark_manual_trigger_active("audio")` em `daemon/ipc_handlers.py:4729`, e **zero
`clear` para `"audio"`** em `src/`. `"led"`: **2 marks** (`:1369`, `:1425`), **0
clears**. As irmãs têm par: `"trigger"` (`:1240`/`:1298`), `"rumble"`
(`:4277`,`:4384`/`:4357`,`:4425`). **Não trava o produto todo** — arma sem soltar,
com saída só por troca manual de perfil: 4
`autoswitch_suppressed_by_manual_override` em 7 dias no journal dela.

**2.6 O perfil guarda quatro features por controle; a tela oferece nove.**
`ControllerOverrides` (`profiles/schema.py:930-933`): `leds`, `triggers`,
`rumble`, `speaker`. O mapa é `controllers` (`:1038`) e a chave **já é o MAC
normalizado** (`:1142`) — o caminho está pronto. Faltam **microfone** (só global,
`:1012`), **máscara** (global, `controller_masks.json`), **giroscópio**,
**acelerômetro**, **touchpad**. Dono: `QUEM-E-QUEM-01` a `04`.

**2.7 A ordem do jogador é a da CHEGADA, e está CERTA.**
`daemon/subsystems/identity.py:71-95`: a fila do momento ordena pela onda de
chegada; o `rank` gravado é **desempate**. Razão dela: com o número colado à
identidade, o controle branco era sempre o player 3 mesmo sozinho na mesa, e jogo
de um jogador não entendia. **Nenhum documento deve propor inverter isso.** A
escolha MANUAL do número é outra coisa e existe
(`D-A-TROCA-DE-PLAYER-SO-OFERECE-OS-NUMEROS-DA-MESA`).

**2.8 O rádio é estado, não veredicto** — §1.2. O mapa já escreve, na linha da
cor: *"EIO NÃO É PROVA DE IMPOSSIBILIDADE DO APARELHO"*.

**2.9 A régua é qualquer mesa** — §1.1. A linha
`identidade.cracha_nos_dois_transportes` já diz: *"4-de-4 numa mesa de quatro
placas diferentes NÃO prova universalidade — o que prova é o MECANISMO"*. Sprint:
`sprints/2026-08-29-O-CONTROLE-SEM-MAC-01-*`.

**2.10 O áudio virtual: metade já é produto.** Alto-falante e microfone virtuais
ao estilo do gamepad virtual (ideia do Fable, trazida por ela). **O microfone JÁ
EXISTE:** `BtMicSubsystem` (`daemon/subsystems/bt_mic.py:155`), em produção, com
prova de 16/08 e o olho dela — apesar de o DualSense **não** anunciar perfil de
áudio BT (CoD `0x002508`). **A saída tem zero linha**, com o canal medido: por
rádio os OUTPUT formam escada de +64 B (`0x31`=77 B a `0x39`=546 B) e o firmware
EXECUTA os degraus. Falta o **conteúdo do pacote**. Dono: `SOM-QUE-SAI-01`.

**2.11 O que quem coordenou errou** — escrito porque o processo é a entrega:
vendeu *"o produto lembra os cinco controles dela"* como conquista (a amostra que
§1.1 condena); propôs inverter a numeração sem ler a razão da regra (§2.7); disse
que a cor funcionava com base na foto de dublê (§1.3); leu `mapa-controles.csv`
quando ela pediu `mapa-do-controle.html`; e não tinha lido o `specs.html`.

---

## 3. O QUE ESTAVA ERRADO NO REPOSITÓRIO E JÁ FOI CORRIGIDO

**Não reabra nada disto.** Substituído em TODOS os lugares, em 29/08/2026.

| Dizia | É |
|---|---|
| Cor: rádio com causa `o-aparelho-recusa` | `divida`, `radio_aceita=sim`. A captura `btmon` de 23/08 fica **com data**; o **veredicto** saiu |
| Tela: `AFIRMA_NAO_ACIONA` (*"o aparelho não o entrega"*) | `AFIRMA_NADA` + `porque=` — a tela deixou de acusar o aparelho |
| *"os quatro responderam pelo rádio"* (cor) | **uma** unidade — e isso estava no **enunciado do trabalho** |
| *"os seis nomes de fábrica"* (`maquina.py`) | **21** — e o CSV tem 28 (§2.3) |
| `SPRINT_ORDER.md:530`: *"`make_virtual_pad` não tem `identity`"* | Tem (§2.4). O mesmo arquivo dizia "falta decidir" **e** "falta código" |
| `mapa-controles.csv`, coluna `fonte_externa` | **19 células esvaziadas**: casavam a substring "pydualsense" dentro de `core/backend_pydualsense.py` — caminho NOSSO. A pior veio de uma frase que existe para **negar** |
| `core/evdev_reader.py:1781-1783` | Apodreceu — caía num docstring de touchpad. É `:2092-2094`, `:2146`, `:2165` |
| `schema.py`: sensores fora "por decisão" | Fora **por ausência** — nunca houve decisão de excluí-los |
| `README.md:220` ("fora de escopo"), `paridade-bluetooth` (dívida paga há 5 dias), canônica (21 códigos contra 28 no dado) | Substituídos |
| `TODO-INTEGRACAO`: item "FECHADO" sobre premissa falsa | **REABERTO** |
| `cores-do-dualsense.csv:116` | Linha malformada, 10 campos para 9 — `csv.DictReader` engolia em silêncio |
| `portoes.sh`: *"5,3 s com quinze portões"* | O tempo é de 25/08 e fica; a **contagem** virou 21 rápidos + 7 completos |

**Três contagens caíram contra o próprio enunciado das frentes** — desconfie de
número repassado: eram **19** células `fonte_externa`, não 16; divergem **21 de
21** hexas, não 17 de 21; e a troca da causa do acelerômetro foi feita, **reprovou
no portão e foi revertida** (§2.1).

**Uma régua falsa nasceu e morreu no mesmo dia:** um detector AST perguntava só
pelo *alvo* da chamada; com a cura na forma desta casa
(`porta = abrir if abrir is not None else abrir_hidraw`) o alvo virava `porta` e a
régua dizia "não curado" com a cura no disco.

---

## 4. AS ARMADILHAS QUE CUSTAM TOKEN

**Leia a fatia, nunca o todo.** Tamanhos medidos em 29/08/2026.

| Arquivo | Tamanho | Como ler |
|---|---|---|
| `html/specs.html` | **1,4 MB** | **Nunca inteiro.** É GERADO do CSV. Ela já disse que importa — importa **para ela ver**, não para você ler |
| `docs/data/mapa-controles.csv` | **697 KB**, 308 linhas × 50 colunas | Uma linha chega a **20.897 caracteres**. Receita abaixo |
| `app/fatos_do_mapa.py` | 161 KB | **GERADO — não edite.** Só `FATOS[id]["existe"]` e `FATOS[id][lado][sufixo]`; `id` é `chave@controle` |
| `app/widgets/controller_card.py` · `daemon/ipc_handlers.py` · `core/backend_pydualsense.py` | 292 / 277 / 273 KB | `grep -n "^class \|^    def "` primeiro, leia só o método. **O nome do terceiro casa a substring "pydualsense" e já produziu 19 falsos** (§3) |
| `ensaios.csv` (147 KB) · `decisoes-dela.csv` (142 KB) | 179 / 125 linhas | `csv.DictReader` filtrando por `id`, nunca `cat` |

**Receita para o mapa — e por que `grep`/`cut` NÃO servem:** **1494 células contêm
vírgula** (medido). `cut -d,` e `awk -F,` cortam no lugar errado e devolvem dado
falso com cara de certo.

```bash
python3 -c "
import csv
r = next(x for x in csv.DictReader(open('docs/data/mapa-controles.csv'))
         if x['id'] == 'movimento.acelerometro@dualsense')
print({k: v for k, v in r.items() if k.startswith(('cabo_','radio_')) and v})
"
```

**A leitura mais cara não é tamanho, é redundância:** o `CLAUDE.md` aponta para
seis retratos de dia, que apontam para sprints, que apontam para o mapa. **Este
arquivo corta esse caminho.** E uma armadilha de medição:
`scrollIntoViewIfNeeded` do Playwright rola a página antes de medir e **cega toda
medição de layout feita depois**.

---

## 5. O QUE NÃO FOI MEDIDO

- **Se a leitura da cor por rádio vale além de uma unidade.** Para saber: repetir
  o SET_FEATURE `0x80` pelo rádio nos quatro controles, daemon rodando.
- **`ZB`: "Limited" ou "Special" Edition.** As duas listas divergem e nenhuma tem
  URL de fonte por linha.
- **A cor lida ao vivo na tela.** Para saber: refotografar a aba Controles **sem**
  `--cor-duble`.
- **O piloto da aba Controles com 0, 1, 3 e 5 controles, e com um controle sem MAC
  de 12 hex** — que é exatamente o que §1.1 exige.

---

## 6. OS COMANDOS QUE NÃO ENVELHECEM

```bash
git log --since=midnight --format='%h %s'   # o que esta casa fechou HOJE
                                            # nenhum documento sabe isto, só o git

git add -A                                  # os portões são CEGOS a arquivo novo
bash scripts/portoes.sh                     # 21 rápidos + 7 completos = 28
                                            # (contados na tabela do script, 29/08)
                                            # `--rapido` NÃO é o portão: ficam de
                                            # fora casa-sabe, portao-tem-chamador,
                                            # shellcheck, referencias-docs,
                                            # anonimato, acentuacao e mypy

scripts/gui-captura/retratar_abas.py        # um PNG por aba em docs/usage/assets/
                                            # antes E depois de tocar a tela
```

A suíte inteira é de quem coordena, roda **no fim**, com a máquina livre, e **em
oito lotes** — num processo só ela morre no meio, sem traceback e sem sumário, e
o `rc=1` que devolve não é teste reprovando:

```bash
ls tests/unit/test_*.py | sort > /tmp/todos.txt
split -n l/8 -d /tmp/todos.txt /tmp/lote-
for f in /tmp/lote-*; do .venv/bin/python -m pytest $(tr '\n' ' ' < "$f") -q; done
```
