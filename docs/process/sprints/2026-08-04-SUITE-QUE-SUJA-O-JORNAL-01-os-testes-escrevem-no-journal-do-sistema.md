# SUITE-QUE-SUJA-O-JORNAL-01 — os testes escrevem no journal do sistema

- **Descoberta:** 04/08/2026, por acidente, investigando outra coisa
- **Gravidade:** alta — **ataca o instrumento de diagnóstico da casa**
- **Estado (22/08/2026):** ENTREGUE EM CÓDIGO — AGUARDANDO A PALAVRA DELA.
  As quatro entregas estão de pé e três dos quatro aceites foram MEDIDOS no
  journal dela. O que sobrou está listado abaixo. *(O cabeçalho dizia "aberta"
  até 22/08, sobre uma sprint que já estava quase toda paga desde 20/08.)*

---

## Onde isto está, medido em 22/08/2026

| entrega | estado | onde, e a prova |
|---|---|---|
| **E1** nome que se declara teste | dispensada por E2 | com o dublê, **nenhum** teste cria nó — não há nome a declarar. Sobrou um só nó por execução, o do portão, e ele nasce `Hefesto MORDIDA de teste (VIGIA-DE-APARELHO-01)` |
| **E2** dublê em vez de uinput real | ENTREGUE (20/08, ampliada 22/08) | `_nenhum_uinput_de_verdade` em `tests/conftest.py` cobre o python-uinput; a VIGIA-DE-APARELHO-01 (22/08) fecha as outras duas portas |
| **E3** script sob teste não escreve no journal | ENTREGUE (15/08) | `HEFESTO_BT_LOG_DEST` na `_hefesto_fake_env` desvia os seis `bt_*.sh` para um arquivo por teste (DIÁRIO-QUE-NAO-MENTE-01) |
| **E4** o portão | ENTREGUE (22/08) | `tests/unit/test_a_suite_nao_cria_aparelho_no_kernel.py` + `_vigia_no_fim_da_sessao` no conftest |

**Os aceites, medidos no journal dela em 22/08:**

| aceite | medição |
|---|---|
| 1. sem `pytest-of-` no journal | 226 linhas em 15/08 → **0** em 18, 20 e 22/08 ● |
| 2. sem `Hefesto - Dualsense4Unix Virtual Keyboard` no `journalctl -k` | **0** em 19, 20, 21 e 22/08, e 0 desde o boot ● |
| 3. os testes de borda com o kernel continuam mordendo | ○ **este é o resto** — ver abaixo |
| 4. `acpid` e `systemd-logind` param de reagir | `acpid`: **0** em 24 h ●. `systemd-logind`: 4 linhas em 24 h, em dois pares isolados (02:50 e 03:02), sem a assinatura de rajada de dezessete — cara de controle dela desconectando, não de suíte |

### O que sobrou (22/08)

- **Aceite 3, e ele mudou de forma.** Não há mais teste que exercite a borda com
  o kernel: a cura foi dublar tudo, e é isso que protege a máquina dela. O único
  nó de verdade que a suíte cria hoje é o do teste da mordida do portão — um por
  execução, com nome de teste, vivo por microssegundos. Se um dia alguém quiser
  a borda de volta, é decisão dela: o preço é nó real na máquina em que ela joga.
- **A pergunta 4 da lista "o que ainda NÃO está medido"** (o `hefesto-bt-rebind`
  em `--dry-run` pode deixar de ser dry-run em algum caminho?) continua **sem
  medição**.
- **Fora do território desta frente:** os índices de sprint e o
  `docs/process/SPRINT_ORDER.md` ainda listam esta sprint pelo rótulo antigo.

### Duas perguntas da lista de 04/08 que a medição respondeu

- *"quais testes criam uinput real"* — em 22/08, **nenhum**. Com a porta
  instrumentada, 1120 testes dos 55 arquivos mais suspeitos (todos os que
  mencionam `UInput`, `uhid` ou os teclados/mouses uinput) e a coleta inteira
  (10853 testes) não bateram uma vez em `uinput.Device`, `evdev.UInput` ou
  `os.open` de `/dev/uinput` / `/dev/uhid`.
- *"se algum deles pode capturar tecla de verdade enquanto existe"* — a pergunta
  estava mal feita, e a resposta veio por outro caminho em 20/08: nó uinput
  **injeta**, não captura. O dano medido foi outro e pior — cada add/remove
  re-assenta o seat do compositor, e **a tela cheia dela caiu no meio de um
  jogo**, com 1289 nós num dia. O número de 04/08 (17 por execução) é o da
  medição daquele dia; o de 20/08 é o que vale.

## O sintoma que me enganou

Investigando quedas de Bluetooth, encontrei no journal do **sistema**:

    kernel: input: Hefesto - Dualsense4Unix Virtual Keyboard as .../input258
    acpid:  input device has been disconnected, fd 28
    kernel: input: Hefesto - Dualsense4Unix Virtual Keyboard as .../input259
    ...
    systemd-logind: Failed to open /dev/input/event264: No such file or directory

**Dezessete teclados virtuais em rajada**, e as rajadas se repetindo. Cheguei a
escrever que o produto tinha um laço de recriação, e ia abrir sprint para isso.

Não tinha. As rajadas batiam com **as minhas execuções de `pytest`** — e a
prova estava a três linhas de distância, no mesmo segundo:

    hefesto-bt-rebind[464386]: [dry-run] faria: echo '0005:054C:0CE6.000F' >
      /tmp/pytest-of-vitoriamaria/pytest-25/test_cura_orfao_bluetooth_sony0/...
    hefesto-bt-bonds[464534]: snapshot de bonds gravado em
      /tmp/pytest-of-vitoriamaria/pytest-25/test_cache_de_device_com_bond_0/...

O caminho `pytest-of-vitoriamaria` no meio de uma linha que, fora isso, é
**idêntica** a um evento de produção.

---

## Por que isto é grave nesta casa em particular

O método desta casa é **medir pelo journal**. Está escrito em toda parte:

- o `0x08` da lightbar foi achado cruzando sete eventos do journal;
- o `close()` sem teto foi achado por três linhas de journal e um silêncio;
- a `CLAUDE.md` manda ler o journal da sessão dela antes de fazer `grep` no
  código.

**Um instrumento que escreve no lugar onde se mede não é ruído — é
contaminação.** E ela é pior que ruído aleatório porque é *plausível*: as linhas
têm o formato certo, o nome de serviço certo e a semântica certa. A única
diferença é um caminho de `/tmp` no meio.

A casa já tem esta armadilha catalogada em outra forma — *"o instrumento pode
estar brigando com o produto"* (`test trigger --raw` disputando o hidraw com o
daemon e imprimindo "aplicado" sem ter aplicado). Esta é a mesma família, virada
para o diagnóstico em vez de para o hardware.

---

## O que está medido

| fato | valor |
|---|---|
| teclados virtuais uinput por execução da suíte | **17** |
| rajadas em 3 h (03→04/08) | 6 — 22:29, 23:34, 23:39, 00:17, 00:41, 00:55 |
| serviços que escrevem no journal do sistema durante a suíte | `hefesto-bt-rebind`, `hefesto-bt-bonds`, e o `kernel` via uinput |
| reação de terceiros | `acpid` (`input device has been disconnected`), `systemd-logind` (`Failed to open /dev/input/eventNNN`) |
| reinícios de DAEMON no mesmo período que **não** geraram rajada | 00:21, 00:27 — confirma que não é o produto |

**O que ainda NÃO está medido, e a sprint precisa medir antes de curar:**

1. **quais testes** criam uinput real (a suíte tem dublês — por que estes não?);
2. se os 17 são **um por teste** ou um laço dentro de um teste;
3. se algum deles pode **capturar tecla de verdade** enquanto existe — um
   teclado uinput vivo é um teclado do sistema, e ela pode estar digitando;
4. se o `hefesto-bt-rebind` em `--dry-run` sob teste pode, em algum caminho,
   **deixar de ser dry-run**.

O item 3 é o que decide a gravidade real: se a resposta for "pode", isto sobe
de "suja o diagnóstico" para "toca no teclado dela durante a suíte".

---

## Duas coisas medidas em 04/08, que mudam o desenho da cura

### 1. NÃO sobra resíduo — um script de limpeza no fim seria placebo

Pergunta dela, direta: *"pq ao final da suíte não temos um script pra remover
todas elas?"*

**Porque não há o que remover.** Medido depois de três execuções seguidas:

```bash
for e in /dev/input/event*; do cat /sys/class/input/$(basename $e)/device/name; done \
  | grep -c 'Hefesto - Dualsense4Unix Virtual Keyboard'    # -> 0
```

Dispositivo `uinput` morre quando o descritor que o criou fecha, e isso
acontece quando o processo do `pytest` sai. O estrago é **durante** a execução,
não depois: as linhas escritas no journal, e o dispositivo sendo **real**
enquanto existe.

Isto está registrado aqui para que ninguém gaste tempo escrevendo o limpador —
que é a primeira ideia que ocorre, e a errada.

### 2. O `input-remapper` AMPLIFICA cada dispositivo que criamos

Cada teclado nosso dispara um `udev` que roda
`input-remapper-control --command autoload`, e o serviço responde **enumerando
todos os dispositivos de entrada da máquina** — inclusive os controles no
Bluetooth:

    00:18:29 input-remapper-service: Request to autoload for "Hefesto - ... Virtual Keyboard"
    00:18:29 input-remapper-service: Found "Pro Controller", "DualSense ... (Hefesto P2)",
                                     "Sony Interactive Entertainment DualSense ...", ...

**Dezessete teclados por execução = dezessete varreduras de todos os controles
dela.** E há uma correlação temporal com a tempestade de frames L2CAP de 04/08
que **ainda não está resolvida** — ver a seção "A pista de 00:18" da
[RADIO-BOMBARDEADO-01](2026-08-04-RADIO-BOMBARDEADO-01-quarenta-mil-frames-corrompidos-em-meia-hora.md).

Se essa correlação se confirmar, esta sprint deixa de ser "suja o diagnóstico"
e passa a ser **"a suíte derruba os controles dela"** — e sobe para o topo
absoluto da fila. O experimento que decide está escrito lá, e custa dez
minutos.

**A consequência para a cura abaixo:** o critério de E2 fica mais duro. Não
basta o dublê ser mais barato — **criar dispositivo de entrada real na máquina
dela tem custo de sistema que não é nosso e que não controlamos.**

---

## A cura, e por que ela não é "silenciar o log"

Silenciar seria a gambiarra: o problema não é o log ser visível, é o teste
**tocar o sistema real**.

**E1. Os testes que precisam de uinput usam um nome que se declara teste.**
Não `Hefesto - Dualsense4Unix Virtual Keyboard`, e sim algo que carregue o
sufixo de teste no próprio `DEVICE_NAME`. Isto sozinho já cura a contaminação
do diagnóstico: quem lê o journal distingue de olho.

Cuidado que a sprint deve honrar: **há testes que travam o nome do dispositivo**
(a casa tem ~240 asserts que travam texto do código). O nome de produção tem de
continuar sendo o de produção; o que muda é o nome sob teste.

**E2. Os que não precisam de uinput real passam a usar dublê.** Criar um
dispositivo de entrada no kernel para verificar mapeamento de teclas é caro e
desnecessário. O critério: um teste só merece uinput real se o que ele verifica
é **a borda com o kernel** — e esse conjunto deve caber numa mão.

**E3. Os scripts de shell sob teste não escrevem no journal do sistema.**
`hefesto-bt-rebind` e `hefesto-bt-bonds` usam `logger`/`systemd-cat`; sob teste
a saída tem de ir para o `stdout` que o pytest captura. A variável que decide
isso é do teste, nunca do script — script que se comporta diferente por
adivinhar que "está sendo testado" é script que não se testou.

**E4. Um portão.** Depois da cura, um teste que rode a suíte e afirme que ela
não deixou rastro no journal do sistema. Sem ele, o próximo teste com uinput
real reabre isto e ninguém nota por semanas — que é exatamente o que aconteceu.

**Feito em 22/08, e a régua NÃO é o journal.** A VIGIA-DE-APARELHO-01 fica na
**porta**: `uinput.Device`, `evdev.UInput` e `os.open` de `/dev/uinput` /
`/dev/uhid`. Ela registra o nodeid de quem passa e recusa com `OSError` — o
mesmo erro que o produto já sabe tratar numa máquina sem permissão. As outras
três réguas foram medidas antes de descartadas, e duas caíram por medição:

- contar `/dev/input/event*` é **cego** ao nó que morre dentro do teste;
- o maior `inputN` do sysfs **também é** — `/sys/class/input` só lista o que
  está vivo, e o máximo volta ao valor de antes assim que o nó morre (o nó da
  mordida saiu `input198` com o máximo em 196, e o máximo voltou a 196);
- o journal do kernel é a única que sobrevive ao nó, mas não existe no CI e não
  diz de QUEM é o nó — ficou como **aviso** no fim da sessão, que é onde ela
  vale: é o único instrumento que enxerga nó criado por processo FILHO, o cego
  declarado da porta.

O portão cobre a sessão inteira pelo `sessionfinish` (que reprova com
`exitstatus = 1` nomeando o teste ofensor) e o arquivo de teste garante o que o
`sessionfinish` não garante sozinho: que a vigia está **armada** e que a régua
**morde**, contra um nó uinput de verdade criado e morto dentro do próprio teste.

---

## Aceite

1. rodar a suíte inteira e **não** encontrar `pytest-of-` no
   `journalctl --since` daquela janela;
2. rodar a suíte inteira e **não** ver `Hefesto - Dualsense4Unix Virtual
   Keyboard` nascer no `journalctl -k` (o nome de produção fica reservado à
   produção);
3. os testes que exercitam a borda com o kernel continuam existindo e
   **continuam mordendo** — a cura não pode virar "removi os testes difíceis";
4. `acpid` e `systemd-logind` param de reagir durante a suíte.

---

## Relacionado

- [A noite em que o som do controle voltou](../estudos/2026-08-04-a-noite-em-que-o-som-do-controle-voltou.md) — onde isto foi achado
- [COMO-OLHAR-A-TELA](../COMO-OLHAR-A-TELA.md) — a armadilha "o instrumento
  briga com o produto", da qual esta é uma variante
