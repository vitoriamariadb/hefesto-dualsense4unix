# ESCONDE-SÓ-O-HIDRAW-01 — o jogo continua vendo o físico pelo evdev

**23/08/2026.** Nasceu de uma pergunta errada. A investigação da madrugada
mediu que os quatro DualSense **por rádio** têm nó `crw------- root root`, sem
ACL, enquanto um teclado USB na mesma máquina tem `crw-rw----+` — e concluiu que
o `uaccess` não concede em aparelho sem assento, e que *"o produto só funciona
por rádio por causa do broker privilegiado"*.

**A conclusão está errada, e o que está por baixo dela é pior.**

## 1. A hipótese caiu — quatro medições, cada uma bastando

| o que a hipótese previa | o que eu medi |
|---|---|
| o nó do rádio não recebe a etiqueta `uaccess` | `udevadm info -q property -n /dev/hidraw8` → **`TAGS=:uaccess:seat:`**. A etiqueta está lá |
| a regra da casa não casa | `udevadm test` → `/etc/udev/rules.d/70-ps5-controller.rules:10 MODE 0660` e `/usr/lib/udev/rules.d/73-seat-late.rules:16 RUN 'uaccess'`. Casa e roda |
| a regra chegou depois do nó | regra de **19/08 12:54**, nós de **22/08 19:51 e 20:21**. A regra é três dias mais velha |
| `/devices/virtual/misc/uhid/` não ganha ACL | os **vpads** vivem no mesmo `/devices/virtual/misc/uhid/` e são `crw-rw----+` com `user:vitoriamaria:rw-`. O caminho não é o discriminante |

## 2. A causa é o próprio produto, e isso é de propósito

`src/hefesto_dualsense4unix/broker/hidraw_broker.py:416`:

```python
def hide(self, node: str, base: str) -> None:
    """`setfacl -b` + `chmod 0600` → só root abre. Fd já aberto sobrevive."""
```

`0600`, dono `root`, ACL removida — **byte a byte o estado que eu encontrei nos
quatro nós**. E o diário confirma quem o produziu: nas últimas 12 horas,
**14 ocorrências de `steam_input_fisico_escondido` e zero devoluções**.

Não é defeito de permissão. É a cura do Steam Input funcionando: esconder o
hidraw físico para o jogo enxergar só o vpad.

## 3. O defeito de verdade: a cura pega METADE do caminho

O broker só conhece `hidraw` — `grep -n "evdev\|joydev\|/dev/input"` nele devolve
nada. Mas o mesmo controle aparece em **três** subsistemas, e medido agora, com
os quatro nós hidraw escondidos:

| superfície | permissão real | quem entra |
|---|---|---|
| `/dev/hidraw6,7,8,9` | `crw------- root root` | **só root** — escondido |
| `/dev/input/event257,258,262,264` | `crw-rw----+` com ACL dela | **qualquer processo dela** |
| `/dev/input/js1,2,4,6` | `crw-rw-r--+` | **qualquer processo dela, e mais o resto do mundo pelo bit `r` de `other`** |

O `chmod 0600` fecha a porta da frente e deixa as duas dos fundos abertas. Um
jogo — ou a Steam — que enumere por evdev/joydev **continua achando os quatro
controles físicos**, exatamente como antes da cura.

**A contagem, sem Steam aberta e sem jogo:** `ls /dev/input/js*` devolve
**16 nós** para 4 controles — 4 físicos, 4 vpads, e 8 de *Motion Sensors*.

**GRAU: MEDIDO** para tudo acima. **GRAU: RELATO** para a observação que abriu a
investigação — com o Sackboy aberto, o kernel tinha `Microsoft X-Box 360 pad 0`
a `7`: **oito** espelhos para quatro controles, que é 4 vpads + 4 físicos, os
mesmos físicos que o daemon registrou ter escondido (`appid=1599660`). Não
reproduzi com o jogo aberto; a permissão que torna isso possível eu reproduzi.

## 4. E o produto afirma o contrário, em verde

`scripts/doctor.sh:3715`:

```
pass "broker escondendo ${hidden_count} nó(s) físico(s) — o jogo só vê o vpad
      (giroscópio sobrevive via fd-injection)"
```

É `pass`, não `warn`. O exame oficial da casa afirma para ela, em verde, uma
coisa que as permissões do lado de fora do hidraw contradizem. É a família
`O-PORTAO-QUE-NAO-MEDE-O-QUE-PROMETE`, e é o pior lugar para ela estar: quem
for investigar "por que o Steam mostra controle dobrado" começa lendo um verde.

## 5. Por que importa, e o que o silêncio custa

O terceiro controle que ela vê no Steam **já é memória da casa**
(`O-TERCEIRO-CONTROLE-ERA-O-ESPELHO-DO-STEAM`, que ela pediu para eu não
esquecer). O que faltava era saber **por que a cura não o mata**: porque a cura
mora numa superfície e o espelho nasce de outra.

Enquanto isso não fechar:

* o dedup continua entregando o dobro de aparelhos ao jogo, e a cura por
  variável de ambiente (`SDL_GAMECONTROLLER_IGNORE_DEVICES`,
  `PROTON_DISABLE_HIDRAW`) fica sendo a **única** coisa que separa os dois;
* o `doctor` segue dizendo verde sobre isso;
* e o `hidden_count` continua sendo contagem de nós, não resposta à pergunta
  *"o jogo está vendo o físico?"*, que é a que ela faz.

## Entregas

### E1 — o `doctor` para de afirmar o que não mediu

`scripts/doctor.sh:3715` não pode dizer *"o jogo só vê o vpad"* olhando só o
`hidden_count` do broker. A régua honesta é a que olha as três superfícies do
mesmo controle e responde por transporte: hidraw escondido **e** evdev/joydev
alcançáveis = *"o físico continua visível por evdev"*.

**Como morde:** esconder os quatro hidraw e deixar o evdev aberto — o estado de
agora — tem de sair de `pass` para `warn` com o motivo. Hoje sai `pass`.

### E2 — decidir o que fazer com evdev e joydev — **É DELA**

Três caminhos, e o preço de cada um na mesa (esta sprint **não** escolhe):

1. **`EVIOCGRAB` no evdev do físico** — o produto já faz grab noutro lugar
   (`scripts/doctor.sh` cita "o daemon graba"). Grab é exclusivo: mata o
   espelho. **Preço:** grab exclusivo é o gesto que mais briga com outros
   leitores, e esta casa já pagou por isso;
2. **estender o `hide` a evdev/joydev** — mesmo `chmod`/ACL, mais duas
   superfícies. **Preço:** `js*` está `crw-rw-r--+` (legível por *other*);
   mexer nele sai do território "ACL da sessão dela" e vira política de sistema;
3. **não esconder, e resolver só por variável de ambiente** — que é o que
   funciona hoje. **Preço:** depende de o jogo enumerar por SDL; quem
   enumerar `/dev/input` na mão não lê hint nenhum.

> **CORREÇÃO DATADA — 23/08/2026, e ela é minha.** As duas linhas acima diziam
> que a cura por variável de ambiente *"tem uma dúvida aberta própria"* e
> *"depende inteiramente de o ambiente atravessar o `pressure-vessel`"*. Isso
> generaliza uma medição de UMA variável para TODAS, e **duas medições já
> escritas nesta árvore derrubam a generalização**:
>
> 1. **`docs/process/estudos/2026-08-16-O-RADIO-MEIO-MUDO-o-que-atravessa-e-o-que-nao.md`,
>    §"Os erros de instrumento do dia", item 1** — o `quem_o_jogo_abre.py`
>    dizia *"o WRAPPER rodou? NÃO"* para dois jogos porque lia o `environ` do
>    **primeiro** processo da árvore, o `reaper` da Steam, que roda *antes* do
>    wrapper. Textual: *"o `/proc` do processo do jogo tinha a variável"*. A
>    régua certa é o processo **mais fundo** que casa com o padrão, e ela virou
>    código em `scripts/ensaios/quem_o_jogo_abre.py::processo_do_jogo`;
> 2. **`integrations/sentinela_do_wrapper.py:26-33`** — a cadeia do estrago do
>    Pragmata foi medida *no `/proc` do jogo rodando*, e o
>    `SDL_GAMECONTROLLER_IGNORE_DEVICES` que **chegou ao jogo** era a lista da
>    própria Steam. Uma variável desse nome, posta fora do contêiner, atravessa.
>
> E o mecanismo do produto não é `export`: o `assets/hefesto-launch.sh` termina
> em `exec env "$@"`, com uma allowlist **por nome de variável** (`:85-91`) que
> nomeia exatamente `SDL_GAMECONTROLLER_IGNORE_DEVICES`, `SDL_JOYSTICK_HIDAPI`,
> `SDL_GAMECONTROLLER_USE_BUTTON_LABELS` e `PROTON_DISABLE_HIDRAW`.
>
> **O que a medição do `MANGOHUD=1` sustenta:** que *aquela* variável não
> chegou. **O que ela não sustenta:** que nenhuma chega. O `pressure-vessel`
> filtra por nome, e os nomes `SDL_*`/`PROTON_*` são justamente os que a pilha
> Steam propaga. **Fica aberto** só o caso específico do MangoHud — e a
> primeira coisa a refazer nele é a leitura com o `quem_o_jogo_abre.py`, não
> com um `grep` no primeiro `/proc` da árvore, que é a armadilha nº 1 desta
> casa em traje novo.

### E2b — medir se a cura por ambiente ATRAVESSA o `pressure-vessel`

**Isto é urgente por causa do caminho 3 da E2, e ninguém mediu.**

A madrugada de 23/08 mediu que o `pressure-vessel` **filtra o ambiente**:
`MANGOHUD=1` exportado pelo `hefesto-launch` **não** apareceu no `environ` do
processo do jogo, e só funcionou quando a Steam inteira nasceu com a variável.
Isso está escrito na ENGASGO-VULKAN-01 e em `assets/hefesto-launch.sh:308`, e é
a razão de a cura do engasgo agir no **prefixo** e não por variável.

**A generalização é que preocupa.** *"Cura por env não serve"* foi concluído de
**uma** variável, a `MANGOHUD` — que é justamente a que o runtime da Steam trata
de forma especial. Mas a cura central deste produto viaja **exatamente por esse
caminho**: `daemon/launch_env.py` injeta `SDL_GAMECONTROLLER_IGNORE_DEVICES`,
`PROTON_DISABLE_HIDRAW`, `SDL_JOYSTICK_HIDAPI` e
`SDL_GAMECONTROLLER_USE_BUTTON_LABELS` pelo `exec env "$@"` do wrapper. Se o
filtro pegar essas quatro, o dedup inteiro é decorativo.

**E o produto já sabe que não sabe.** `assets/hefesto-launch.sh:66` diz, com
todas as letras: *"o `dedup_ok` sozinho é falso-tranquilizante: nunca checa se o
jogo herdou a env"*. A pergunta está escrita no código há tempo e nunca foi
medida.

**Como medir, e é barato:** com o jogo aberto, achar o processo mais fundo que
casa com o padrão do executável (**nunca** o `reaper`, que roda ANTES do wrapper
— foi esse erro que fez o instrumento acusar a própria cura de não existir em
16/08, e está na tabela de armadilhas do ONDE-PARAMOS daquele dia) e ler
`/proc/<pid>/environ`. As quatro variáveis estão lá ou não estão.

**Enquanto não se mede, a E2 não pode escolher o caminho 3** — ele pode ser um
caminho que não existe.

### E3 — o `hidden_count` responde à pergunta dela

Trocar a contagem de nós por um veredito por controle: *este controle está
escondido do jogo?* — que exige as três superfícies. É o mesmo pedido do item
3.1 do `O-QUE-FICOU-ABERTO-01` (*"`hidden_count` por conjunto"*), aberto desde
16/08 e sem uma linha mudada.

## O que esta página NÃO afirma

* **Não afirma que a Steam enumera por evdev.** Afirma que ela **pode** — a
  permissão está aberta, e a contagem de oito espelhos com quatro hidraw
  escondidos é consistente com isso. Fechar exige o jogo aberto e a captura de
  qual `open()` a Steam faz;
* **não afirma que o `hide` está errado.** Ele faz exatamente o que promete no
  docstring. O que está errado é o produto **concluir** dele que o jogo só vê o
  vpad;
* **não afirma nada sobre o Modo Nativo**, onde o físico deve mesmo estar
  exposto e o `doctor` já trata o caso à parte (`:3712`).

## Como reproduzir, em quatro linhas

```bash
ls -la /dev/hidraw*                      # os 0600 sem ACL são os físicos escondidos
udevadm info -q property -n /dev/hidraw8 # TAGS=:uaccess:seat: — a regra CASOU
ls -la /dev/input/js1 /dev/input/event257 # a mesma unidade, aberta
journalctl --user -u hefesto-dualsense4unix.service -o cat | grep -c escondido
```
