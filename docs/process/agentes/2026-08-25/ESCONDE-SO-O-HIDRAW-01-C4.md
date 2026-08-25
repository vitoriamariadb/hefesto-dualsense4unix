# ESCONDE-SÓ-O-HIDRAW-01 — C4 — a régua parou de mentir sobre a própria cura, e ainda mente sobre duas coisas

> **ESTE RELATÓRIO É DA CONFERÊNCIA, NÃO DO EXECUTOR.** Escrito em 25/08/2026,
> depois do merge, a partir do **diff** (`eb2711c`) e da **mordida refeita na
> minha árvore** — nunca da memória de quem escreveu o código. A frente entregou
> em `dev` sem relatório; esta é a segunda leitura. Onde eu não consegui
> conferir uma alegação da frente, ela está no terceiro cabeçalho, não sumiu.
>
> Árvore: `/mnt/Apate/Desenvolvimento/hefesto-voo/conferencia-C4-hidraw`
> (HEAD `1dbe2ca`). Commit conferido: `eb2711c`, dois arquivos, +601/−12.

---

## O que mudou

**Um defeito de instrumento, e ele estava no pior lugar.** O
`check_hidraw_broker` do `scripts/doctor.sh` afirmava **em verde** *"o jogo só vê
o vpad"* olhando só o `hidden_count` do broker. O `hide` age numa superfície —
`hidraw` — e o mesmo controle mora em três. Quem fosse investigar *"por que o
Steam mostra controle dobrado"* — o terceiro controle dela — começava lendo um
`pass`.

| arquivo | o que mudou |
|---|---|
| `scripts/doctor.sh` | +164/−12: quatro funções novas, e o veredito sai de dentro da função de 220 linhas |
| `tests/unit/test_esconde_so_o_hidraw_veredito_das_tres_superficies.py` | +449, novo: 22 testes contra um `/dev` e um `/sys` de mentira |

As quatro funções, na ordem em que uma chama a outra:

| função | o que faz |
|---|---|
| `_nos_de_entrada_do_hidraw` | do nó hidraw ao pai HID no sysfs, e dele aos `event*`/`js*` do MESMO device |
| `_entrada_alcancavel_pelo_jogo` | as **três** formas de o nó estar aberto: bit `r` de `other`, ACL nomeada do `uaccess`, e grupo do nó com a sessão dentro |
| `_tres_superficies_medir` | o veredito **por controle**, em cinco globais (`TRES_SUP_*`) |
| `_veredito_do_hide` | decide `info`/`fail`/`warn`/`pass` — e é o que ficou testável sem systemd, socket ou aparelho |

Mais a **fiação dos nomes**: o bloco python que fala com o broker passou a
imprimir `hidden_nodes=`, porque a contagem não dá ao sysfs por onde achar as
outras duas superfícies.

**Exercícios da sprint
`docs/process/sprints/2026-08-23-ESCONDE-SO-O-HIDRAW-01-*.md`:**

| exercício | estado, conferido |
|---|---|
| **E1** — o `doctor` para de afirmar o que não mediu | **FECHOU**, com a ressalva do ACHADO 1 |
| **E2** — o que fazer com evdev/joydev | **NÃO TOCADO, e é DELA** — nenhuma das funções escreve permissão, e há teste que cobra isso (`TestOInstrumentoNaoCura`) |
| **E2b** — a env atravessa o `pressure-vessel`? | **NÃO MEDIDO.** O diff não encosta nisso |
| **E3** — o `hidden_count` responde à pergunta dela | **FECHOU PELA METADE** — ver ACHADO 2 |

---

## Qual mordida prova

**Verde de partida**, na minha árvore, com `source .envrc-voo` antes:

```bash
cd /mnt/Apate/Desenvolvimento/hefesto-voo/conferencia-C4-hidraw && source .envrc-voo
/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix/.venv/bin/python -m pytest \
  tests/unit/test_esconde_so_o_hidraw_veredito_das_tres_superficies.py -q
# 22 passed in 0.42s
```

**Nove curas arrancadas no fonte do produto**, uma de cada vez, cada uma
devolvida antes da seguinte (o roteiro tem `finally` que restaura, e o `md5sum`
da árvore bate com o de antes: `655b973d0da788c81559c45ea3cb907b`):

| cura arrancada de `scripts/doctor.sh` | vermelho |
|---|---|
| 1. `_tres_superficies_medir "$@"` — o veredito volta a ser contagem de hidraw | **10 failed, 12 passed** |
| 2. o ramo da **ACL nomeada** em `_entrada_alcancavel_pelo_jogo` | **2 failed, 20 passed** |
| 3. o ramo do **bit `r` de `other`** | **1 failed, 21 passed** |
| 4. o ramo do **grupo do nó** | **1 failed, 21 passed** |
| 5. o **sem-mapa vira crédito** (`SEM_MAPA++` → `ESCONDIDOS++`) | **2 failed, 20 passed** |
| 6. `print("hidden_nodes=" + …)` do bloco do broker | **1 failed, 21 passed** |
| 7. `${hidden_nodes}` da chamada de `_veredito_do_hide` | **1 failed, 21 passed** |
| 8. o `pass` volta ao texto antigo, sem "TRÊS superfícies" | **2 failed, 20 passed** |
| 9. `(${TRES_SUP_ABERTOS})` vira `()` — o aviso deixa de nomear | **5 failed, 17 passed** |
| **cura devolvida** | **22 passed** |

**MORDE.** E a mensagem é específica, não genérica — a asserção imprime a saída
inteira do veredito:

```
E  AssertionError: [PASS] broker escondendo 1 nó(s) hidraw físico(s) (giroscópio sobrevive via fd-injection)
E    [INFO] as superfícies evdev/joydev desses nós não estão legíveis no sysfs agora — este check NÃO afirma que o jogo só vê o vpad
E  assert '[WARN]' in '[PASS] broker escondendo 1 nó(s) …'
```

**Portões**, rodados na árvore limpa: `bash scripts/portoes.sh --rapido` →
`TODOS VERDES — 18 portões`; `shellcheck -S error scripts/*.sh scripts/ci/*.sh
install.sh uninstall.sh` → sem saída; `scripts/validar-acentuacao.py --all` →
RC=0; `bash -n scripts/doctor.sh` → OK.

---

### ACHADO 1 (ALTA) — o `pass` afirma *"o jogo só vê o vpad"* sobre controles que ele mesmo acabou de declarar fora do veredito

`scripts/doctor.sh:3777`:

```bash
pass "broker escondendo ${hidden_count} nó(s) físico(s), e as TRÊS superfícies
      dos ${TRES_SUP_CONTROLES} controle(s) fechadas … — o jogo só vê o vpad"
```

`TRES_SUP_CONTROLES` é incrementado **antes** do `continue` que manda o nó
sem-mapa embora (`:3727` conta, `:3730-3731` manda embora), então ele conta também os que ninguém olhou.
Cena montada com os próprios ajudantes do arquivo de teste — um controle
mapeado e fechado, dois sem mapa no sysfs:

```
[INFO] 2 nó(s) escondido(s) sem mapa no sysfs — ficaram fora do veredito abaixo
[PASS] broker escondendo 3 nó(s) físico(s), e as TRÊS superfícies dos 3
       controle(s) fechadas (hidraw + evdev + joydev) — o jogo só vê o vpad
```

Duas linhas coladas, uma contradizendo a outra: **1** controle foi medido, o
verde diz **3**, e a frase que mentia volta a ser afirmada sobre os outros dois.
É a família `O-PORTAO-QUE-NAO-MEDE-O-QUE-PROMETE` **dentro do conserto que
existe para matá-la**.

O `TestAusenciaDeDadoNaoEProvaDeCura` foi escrito exatamente para isto e não
pega: ele só monta *todos sem mapa* e *um aberto + um sem mapa* — nunca
**fechado + sem mapa**, que é a única combinação que produz o `pass`. E o portão
de fonte `TestAFraseQueMentia` passa porque cobra a presença do literal
`"TRÊS superfícies"` na linha, não a honestidade do número.

**Conserto de uma palavra:** naquele ponto `TRES_SUP_ABERTOS` está vazio, logo
`TRES_SUP_ESCONDIDOS == TRES_SUP_CONTROLES − TRES_SUP_SEM_MAPA`. Trocar
`${TRES_SUP_CONTROLES}` por `${TRES_SUP_ESCONDIDOS}` no `pass` — e o teste que
falta é a cena acima.

### ACHADO 2 (ALTA) — o item 3.1 do `O-QUE-FICOU-ABERTO-01` **não fechou**, e três lugares dizem que sim

O comentário em `scripts/doctor.sh:3711` e a mensagem do `eb2711c` dizem, com
todas as letras: *"o item 3.1 do O-QUE-FICOU-ABERTO-01, aberto desde 16/08"*.

Mas `docs/process/sprints/2026-08-16-O-QUE-FICOU-ABERTO-01-e-como-cada-um-fecha.md:288-291`
define o item 3.1 assim, e a linha 698 repete como mordida:

> **A cura:** … o veredito por **comparação com o censo de físicos** … O `pass`
> só é honesto quando `escondidos == físicos`.
> **Como o portão morde:** dois físicos na fixture, um escondido.

O veredito novo **não tem censo**. Ele recebe a lista dos nós que o broker
escondeu e pergunta, sobre cada um, se as três superfícies estão fechadas. Um
DualSense físico que o broker **nunca escondeu** não entra na conta — ele é
invisível para a função. A cena exata de 16/08 (dois DualSense, o broker
escondendo um) continua saindo verde:

```
[PASS] broker escondendo 1 nó(s) físico(s), e as TRÊS superfícies dos 1
       controle(s) fechadas … — o jogo só vê o vpad
```

…enquanto o segundo DualSense está inteiramente exposto ao jogo. É o sintoma
que a casa mais pagou — o controle dobrado — com o portão que o resolveria em um
segundo dizendo que está tudo bem.

**E o dado do censo já está coletado, dez linhas abaixo, e é jogado fora.** O
mesmo bloco python monta `candidatos` varrendo
`/sys/class/hidraw/hidraw*/device/uevent` e filtrando `054C` (`:3848-3859`) — o
censo de Sony físicos, por nome — e só o usa para o teste do `cmd open`. Um
`print("fisicos=" + " ".join(...))` e uma comparação de conjuntos fecham o 3.1
de verdade.

O que a frente entregou é **metade da E3**: o veredito é por controle, mas o
denominador continua sendo "o que o broker escondeu", não "o que está na mesa".

### ACHADO 3 (MEDIA) — a casa continua publicando o fato que esta frente derrubou

`docs/process/SPRINT_ORDER.md:780` ainda descreve o estado de hoje assim:

> …e o `doctor.sh:3715` afirma **em verde** que "o jogo só vê o vpad"

Falso desde `eb2711c`, e é a regra dela (*"provou que uma info tá errada,
substituímos ela pela certa em todos os lugares"*). A citação de linha também
caducou: `scripts/doctor.sh:3715` hoje é um comentário sobre
`TRES_SUP_ESCONDIDOS`. O mesmo vale para a linha *"Hoje sai `pass`"* na E1 da
sprint. O portão `citacoes-de-linha` passa verde sobre isso — não alcança esta
forma de citação.

### ACHADO 4 (BAIXA) — a prosa do teste descreve uma mordida diferente da que acontece

O docstring do módulo e o da `TestAMordidaDaCuraArrancada` dizem que, com
`_tres_superficies_medir` arrancado, *"a cena de hoje volta a sair `pass` com a
frase antiga"*. Medido: sai o `pass` **estreitado** (`"broker escondendo 1 nó(s)
hidraw físico(s)"`) mais o `info` da ressalva — **sem** a frase antiga. A
asserção do teste está certa (só cobra `[PASS]` e ausência de `[WARN]`); a prosa
não. Fato errado se substitui.

### ACHADO 5 (BAIXA) — o ramo da ACL casa nome de qualquer usuário, não só o dela

`_entrada_alcancavel_pelo_jogo` promete no comentário *"rc=0 se um processo DELA
consegue `open(2)` o nó"*. A régua é
`getfacl -p "${no}" | grep -Eq '^user:[^:]+:r'`, que casa `user:root:r--`,
`user:gdm:r--` — e ignora `mask::---` / `#effective:---`, que anulam a entrada.
Reproduzido com um `getfacl` de mentira que só emite `user:root:r--`, sobre um nó
`0600` dela:

```
nó: 0600 vitoriamaria:vitoriamaria  ACL: só user:root:r--
VEREDITO: ALCANCAVEL PELO JOGO
```

O erro é **conservador** (falso alarme, nunca falso verde), e na prática o
`uaccess` só nomeia a sessão — por isso BAIXA. Mas o comentário promete mais do
que a régua entrega.

### ACHADO 6 (BAIXA) — o comentário lista quatro globais; são cinco

`scripts/doctor.sh:3714-3717` documenta `TRES_SUP_CONTROLES`,
`TRES_SUP_ESCONDIDOS`, `TRES_SUP_ABERTOS` e `TRES_SUP_SEM_MAPA`.
`TRES_SUP_N_ABERTOS` existe, é escrito e sai na tela, e não está na lista.

---

## O que NÃO verifiquei

- **Não há DualSense na bancada agora.** `ls /sys/class/hidraw/` devolve
  `hidraw0..3`, e os quatro são receptores de teclado/mouse
  (`CX 2.4G Wireless Receiver`, `Compx 2.4G Wireless Receiver`). Logo **nada
  neste relatório roda o `check_hidraw_broker` de verdade contra um controle
  físico** — tudo o que mordi foi contra o `/dev` e o `/sys` de mentira em
  `tmp_path`, que é a mesma cena que o executor montou. Duas réguas
  independentes seria uma execução do `doctor.sh` com um DualSense no cabo e o
  broker escondendo; **isso não foi feito, e é o furo mais largo deste
  relatório.**
- **A medição da bancada citada no comentário e no commit** (`/dev/hidraw4`,
  `event21`, `js0`, com as permissões de cada um) **não pôde ser refeita**. O que
  consegui foi corroboração indireta, e ela sustenta o executor:
  `journalctl -u hefesto-hidraw-broker.service --since "2026-08-25 00:00"` mostra
  `node_hidden node=/dev/hidraw4`, e o journal do daemon mostra
  `evdev_started name='Sony … DualSense Wireless Controller' path=/dev/input/event21`.
  As **permissões** daqueles nós naquele momento eu não tenho como recuperar.
- **O `js*` com `other::r--` eu confirmei no VPAD, não no físico.**
  `getfacl -p /dev/input/js0` → `other::r--` mais `user:<ela>:rw-`, e
  `/dev/input/js0` agora pertence ao pad virtual
  (`/sys/devices/virtual/input/input21/js0`, nome
  `Microsoft X-Box 360 pad (Hefesto - Dualsense4Unix virtual)`). A **forma** que
  a sprint atribui ao `js` está confirmada; que o `js` do **físico** esteja assim
  hoje, não.
- **A varredura do sysfs eu confirmei por derivação, não medindo um DualSense.**
  Os quatro devices HID desta máquina põem os nós de entrada em
  `<hid>/input/inputN/eventM` — e o nível `input/` **não é universal** (9 de 26
  input devices desta máquina ficam direto sob o pai, ex.
  `sound/card0/input12`). O nível existe quando o pai **não é** um class device,
  que é o caso de todo `hid_device`; `hid_playstation` registra os input devices
  com `parent = &hdev->dev`, igual ao `hidinput`. E o `js` mora ao lado do
  `event` dentro do mesmo `inputN` (medido em `input21`). Conclusão: o glob está
  certo. **Grau: inferido, com quatro medições de apoio — não medido num
  DualSense.** Se estiver errado, o sintoma é silencioso: todo controle cai em
  "sem mapa" e o check sai `pass` com a ressalva, e a suíte segue verde.
- **Não rodei a suíte inteira** (regra da casa: ela cria nós uinput de verdade).
  Só o arquivo desta frente. Não sei se algum outro teste toca o
  `check_hidraw_broker`.
- **Não conferi a E2b** (a env atravessando o `pressure-vessel`). O diff não
  encosta nela; continua sem medição, e a E2 não pode escolher o caminho 3 sem
  ela.
- **Não conferi o `hide` do broker em si** — só o instrumento que fala dele.

---

## O que sobrou para o próximo

1. **ACHADO 1** — trocar `${TRES_SUP_CONTROLES}` por `${TRES_SUP_ESCONDIDOS}` no
   `pass` de `scripts/doctor.sh:3777`, e acrescentar a cena **fechado +
   sem-mapa** ao `TestAusenciaDeDadoNaoEProvaDeCura`. É uma palavra e um teste.
2. **ACHADO 2 — o maior.** Publicar o censo de físicos que o bloco python já
   monta (`candidatos`, filtro `054C`) e fazer o veredito comparar conjuntos:
   `escondidos == físicos`. Enquanto isso não existir, **o item 3.1 continua
   aberto**, e a sprint de 16/08 recomenda fazê-lo *antes* de investigar
   qualquer suspeita de controle dobrado. Até lá, retirar dos três lugares a
   afirmação de que 3.1 foi endereçado — ou marcá-la como metade.
3. **ACHADO 3** — corrigir `SPRINT_ORDER.md:780` e a E1 da sprint, que ainda
   descrevem o verde mentiroso como estado de hoje, e a citação `doctor.sh:3715`,
   que caducou.
4. **Um preço para a E2 que a sprint não lista, e é medido.** O daemon abre os
   **três** evdev do DualSense físico **direto**, sem passar pelo broker — hoje
   `event21` (gamepad), `event22` (Motion Sensors) e `event23` (Touchpad),
   segundo `evdev_started` / `motion_sensors_started` / `touchpad_reader_started`
   no journal do usuário. O **caminho 2** da E2 (estender o `hide` a
   evdev/joydev, com `chmod 0600` + `setfacl -b`) **mataria os leitores do
   próprio produto** — giroscópio e touchpad incluídos — a menos que ganhem
   fd-injection pelo broker, como o hidraw já tem. A lista de preços da E2 hoje
   só menciona o custo de política de sistema do `js*`. Isto tem de estar na mesa
   antes de ela escolher.
5. **ACHADOS 4, 5 e 6** — prosa do teste, o `grep` da ACL que não filtra o nome
   do usuário (nem o `mask`), e a global que ficou fora do comentário.
6. **A prova que falta:** rodar `scripts/doctor.sh` com um DualSense no cabo e o
   broker escondendo, e colar a saída. É a única medição que fecha a distância
   entre "o sysfs de mentira concorda" e "a régua funciona na máquina dela".
