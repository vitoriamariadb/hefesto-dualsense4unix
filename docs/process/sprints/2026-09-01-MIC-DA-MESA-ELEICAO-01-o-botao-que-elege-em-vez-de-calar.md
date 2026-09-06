---
sprint: MIC-DA-MESA-ELEICAO-01
estado: absorvida
---

# MIC-DA-MESA-ELEICAO-01 — o botão que ELEGE em vez de calar

> **ESTADO 06/09/2026: absorvida** — o que ficou pela metade (o rádio) é a ONDA5-MIC-VIRTUAL-01 e a MIC-VIRTUAL-02 do plano das 24 horas. Não se despacha pelo id.

**01/09/2026.** Decisão dela, com as palavras dela:

> *"Se eu apertar o botão físico mic do controle e ele acender, significa que eu
> quero que o canal de áudio do microfone seja o controle. O botão de silenciar
> é confuso e mexendo com ambos os canais de áudio é péssimo. Aí apertando o
> botão independente de ser o controle sendo lido como dualsense ou como
> microfone virtual ele funciona pra mim."*

> *"Conseguimos inverter isso e fazer minha ideia funcionar. As pessoas precisam
> ter um aviso visual que o mic tá funcionando. já fizemos isso antes. com 4
> pessoas com controle na mão localmente isso é necessário."*

---

## O que isto entrega, e o que **não** entrega

| pedido dela | estado |
| --- | --- |
| o botão ELEGE o canal daquele controle | **feito** — `integrations/eleicao_de_microfone.py`, por `uniq` |
| o LED inverte: aceso = mic VIVO | **feito** — a inversão é do CHAMADOR; o byte não mudou de contrato |
| cada controle tem canal próprio | **já existia** — placa ALSA por dispositivo USB no cabo, uma source PipeWire por ponte no rádio |
| cada um vê no PRÓPRIO controle | **feito no backend** — `set_mic_led(..., uniq=)`; a TELA é da lista dela |
| vale nos dois modos | **pela metade, e a metade é medida** — ver abaixo |
| o caminho de volta | **feito** — e nesta bancada ele responde VAZIO |

---

## A chave que fez o plano caber: **não se escreve uma linha no `common[9]`**

O `hid-playstation` **consome** o botão do microfone. A borda não vira evento
evdev: o driver detecta a borda, alterna `ds->mic_muted` e escreve o LED junto,
tudo dentro do mesmo `if (ds->update_mic_mute)`
(`assets/dkms/hid-playstation/hid-playstation.c:1538-1553`).

Isso parece um obstáculo e é o contrário: **o botão físico, com o kernel dono,
JÁ É o interruptor por controle que ela quer.** O que falta não é posse — é
fiação. E do nosso lado mudo e LED já estavam desacoplados por construção
(`common[9]` com o `POWER_SAVE_CONTROL_ENABLE`, `common[8]` com o
`MIC_MUTE_LED_CONTROL_ENABLE`), então **a única coisa que precisava inverter era
a LUZ**.

Consequência: as três recusas medidas — **BT-E-VPAD-01** (01/08),
**MIC-BT-DONO-01** (03/08), **MIC-DOIS-DONOS-01** (19/08) — continuam inteiras,
porque as três são sobre o `common[9]`, e a muralha *"NÃO REPROPOR sem derrubar
as três"* está na linha `audio.microfone.mudo` do mapa
(`docs/data/mapa-controles.csv:26`), não na do LED (`:151`).

E há um custo NOVO em tomar aquela posse, que não existia antes — mas ele **não
é uma lei do aparelho, e a versão anterior desta linha dizia que era**. FATO
SUBSTITUÍDO em 02/09/2026, contra o fonte C desta árvore: o kernel **continua**
alternando `ds->mic_muted` na borda do botão, sempre, porque a condição dele é o
BIT DO BOTÃO no report de ENTRADA (`assets/dkms/hid-playstation/hid-playstation.c:1630-1640`,
`ds_report->buttons[2] & DS_BUTTONS2_MIC_MUTE`) e não consulta nada que o
userspace escreva.

O que de fato se perderia é a **LEGIBILIDADE** da borda, e isso é consequência de
uma ESCOLHA desta casa: o detector novo não lê o botão — lê o mudo do FIRMWARE,
`status[1]` BIT(2) (`core/physical_report_reader.py:186` `JACK_STATUS_OFFSET`,
`STATUS_MIC_MUDO`), que é a CONSEQUÊNCIA do aperto. Afirmar o `common[9]`
congelaria esse bit e cegaria **o nosso leitor**, não o kernel. E nem a cegueira
seria total: o keepalive é LIMITADO à janela de confirmação de 2 s
(`core/backend_pydualsense.py:874-879`), então passados 2 s paramos de reescrever
e o valor que o kernel programou na borda volta a valer.

**A recusa continua de pé pelas três medições de 01/08, 03/08 e 19/08** — o que
cai é a palavra "impossibilidade": é recusa medida com custo conhecido, não lei.

---

## Os três fios

### 1. Quem apertou — `daemon/subsystems/mic_da_mesa.py`

Não existia. `EventTopic.BUTTON_DOWN` não carrega `uniq` (contrato de perfil e
de plugin) e `read_state()` só enxerga o primário. O que existe é a
CONSEQUÊNCIA do aperto — o bit `STATUS_MIC_MUDO` de `status[1]` — chegando por
um fd que é só daquele controle: **a identidade vem do fd, não do report**.

`backend.bordas_do_mic()` devolve `{uniq: (seq, mudo, quando)}`, e `seq` é
CONTADOR, não leitura de estado: um toque duplo entre duas amostragens devolve o
mesmo estado, e a segunda eleição sumiria.

O laço reusa as duas guardas que já existem por defeito medido — o sossego
(`hotkey.MIC_SOSSEGO_S`) e a carência pós-conexão (`lifecycle.INPUT_GRACE_SEC`,
que cita o **micBtn fantasma** pelo nome). O sossego passou a ser **por
controle**: uma janela global faria dois jogadores que apertam junto virarem um
gesto só, e o do segundo sumiria calado.

**O sossego mudou de casa e ganhou endereço.** Ele vivia no `mic_button_loop`,
que consumia `BUTTON_DOWN` e alternava o mudo do sistema. A análise inteira que
o justificava — os três motivos pelos quais o debounce de 200 ms do
`AudioControl` é inútil aqui — desceu junto, palavra por palavra, para o
cabeçalho de `mic_da_mesa.py`: ela continua valendo, e o que mudou foi só o laço
onde a guarda mora. O que mudou NA guarda é que ela passou a ser **por
controle**: era um relógio só porque o gesto era um só.

### 2. Eleger — `integrations/eleicao_de_microfone.py`

Não havia UMA linha de Python que elegesse fonte de captura. O único `set-default-*`
do pacote era de SAÍDA.

Seis passos, e cada um já falhou de um jeito diferente nesta casa:

1. **guarda o anterior** (uma vez por sessão) — eleger PERSISTE e empurra a
   preferência dela pilha abaixo;
2. resolve `uniq → nome` por `escolher_fonte`, que **desceu de camada** para
   `integrations/fontes_de_captura.py` (o daemon não importa nada de `app/`);
3. pergunta ao DONO do critério se o alvo **se sustenta**, antes de escrever;
4. escreve `pactl set-default-source`;
5. espera o grafo assentar e **RELÊ o ATIVO**;
6. só devolve sucesso se o ativo relido for o alvo.

O passo 6 é o que impede o LED de virar mentira de segunda geração: o
WirePlumber **não honra nó eleito que não se sustenta** — ele reelege sozinho, e
a preferência que você acabou de gravar vira lixo.

### 3. O LED por `uniq` — `core/backend_pydualsense.py`

`set_mic_led` não aceitava alvo. Caía no `_for_each` sem `broadcast`, e — pior —
com `target_key=None` o `_record_desired_locked` **zera o campo `mic_led` de
todos os overrides por-uniq**. Numa mesa de quatro, a borda do Jogador 2
acenderia os quatro LEDs e apagaria o estado por-controle dos outros três.

E o LED só é aceso **depois da releitura** da eleição — nunca do eco da escrita.

---

## O que se mediu no caminho, e não estava no plano

### O critério de "fonte que se sustenta", medido ao vivo (01/09, bancada dela)

| pergunta | resposta |
| --- | --- |
| a fonte ativa agora | `alsa_input.…DualSense…iec958-stereo` |
| o mic do DualSense se sustenta? | **sim** (porta usável) |
| a entrada analógica da placa-mãe se sustenta? | **não** (três portas `not available`) |
| a melhor fonte elegível que NÃO é o controle | **VAZIA** |

Ou seja: **hoje, nesta máquina, não há para onde voltar.** O caminho de volta
está construído e responde a verdade: não elege nada e diz por quê. Cair no
`.monitor` do sink seria MONITOR-QUE-VENCE-01 — o sistema gravando o som que SAI
em vez da voz dela.

### UMA ELEIÇÃO PODIA VIRAR UMA INSTALAÇÃO

Arrancando a flag do shell para ver a régua reprovar, o que se mediu foi pior do
que a reprovação esperada. O `for arg in "$@"` do
`fix_wireplumber_default_source.sh` termina em
`*) printf 'aviso: argumento desconhecido'` — e o `MODE` **continua sendo o
default, que é `install`**. Chamar o script com uma flag que ele não conhece não
devolve erro: ele **roda o instalador**, escreve drop-in e reinicia o
WirePlumber da sessão dela. Aconteceu: a fonte padrão passou por
`auto_null.monitor` antes de reassentar no DualSense.

E o caso é real, não hipotético: o script instalado em `~/.local/bin` é **um por
máquina** e pode ser mais velho que este pacote.

**Cura:** `_script_conhece()` lê o arquivo e pergunta *"você conhece esta
palavra?"* antes de invocar. `False` faz a eleição RECUSAR. Régua em
`test_flag_que_o_script_do_disco_nao_conhece_nao_e_chamada`.

### O byte que a eleição ia pendurar era lido SEM disciplina

`_captura_status_audio` lia `self.states[54]` — o report já digerido pela
pydualsense 0.7.5, que não confere CRC, nem report id, nem o `INPUT_FLAG_AUDIO`.
Com a ponte de mic por BT de pé, o Opus ocupa `raw[3:74]` e aquele byte cai
DENTRO da janela. É o **PS-PRESO-01** inteiro — foi assim que os botões MIC e PS
ficaram presos e ela desligou o controle.

Enquanto o byte só pintava um selo, o estrago era cosmético. A partir da
eleição, **um pacote corrompido de rádio elege microfone sozinho.** Agora quem
lê é `extract_jack_status`, que já era o dono; o índice 54 saiu do
`backend_pydualsense.py` em vez de ficar como segunda verdade.

### O LED do PERFIL não acendia um único byte

`apply_output_defaults` chamava `h.audio.setMicrophoneLED(flag)` CRU, que só
mexe no espelho da pydualsense. `_mic_led_desejado` continuava `None`, e com
`None` o `_build_common` apaga o bit `0x01` e deixa `common[8]` inerte. O MESMO
campo pelo `apply_output_for` acendia: dois caminhos do mesmo campo, um deles
mudo. Se a inversão nascesse em cima disso, o perfil aplicado apagaria o aviso
de vida sem que nada aparecesse no log.

### A tela anunciava que o controle caído estava no ar

`_audio_status` é atributo de INSTÂNCIA do handle. No hotplug-out o handle
morre, o novo nasce sem leitura, `audio_status_for` devolve `None` e a chave
`audio` **some inteira** do `state_full`. A tela fazia
`bool(audio.get("mic_mudo"))` → `False` → selo **ATIVO**.

Num contrato em que aceso = está no ar, o controle que acabou de cair anuncia
que está no ar. E o portão não mordia porque o dublê (`interface/casamento.py`)
trazia o mesmo default falso — nasceu `FALSO_SEM_AUDIO` para que a ausência
pudesse ser exercitada.

---

## O que NÃO dá, e a medição de cada um

**O LED não acende em Modo Nativo.** `core/backend_pydualsense.py` fecha TODA
escrita de output com `if not self._output_muted:` quando o Modo Nativo está
ligado — ali o dono do LED é o jogo. O requisito 4 dela se parte ao meio, e o
corte é medido: a LEITURA acontece ANTES do gate, então **a ELEIÇÃO funciona nos
dois modos e nos dois transportes**; o AVISO DE VIDA no plástico, não. Nesse
modo o aviso existe só na tela.

**Quatro microfones PADRÃO ao mesmo tempo não existe.** `pactl
get-default-source` devolve UM nome. Quatro CANAIS vivos e independentes, sim —
já existem. Quatro PADRÕES, não. O que sobra é: quatro LEDs podendo estar acesos
e um vencedor do padrão do sistema por vez. **É a primeira pergunta para ela.**

**A colisão do nome curto na ponte BT continua aberta.** `nome_curto` usa só os
seis últimos dígitos hex do MAC: dois controles com os três últimos octetos
iguais geram o MESMO `source_name` e o MESMO fifo, e `iniciar()` faz `os.unlink`
incondicional. O docstring promete o contrário. Régua registrada como
`xfail(strict=True)` em
`tests/unit/test_mic_da_mesa_dois_controles_nao_partilham_o_canal.py` — **ela
nasce vermelha de propósito**, e o `strict` cobra que este arquivo seja
atualizado no dia em que a cura chegar.

---

## O que ficou de fora desta leva, e por quê

**O ensaio de bancada do `common[9]` viajando zerado.** Ele precisa de UM toque
dela: com a posse só do LED, ela aperta o botão uma vez, nós escrevemos o LED e
lemos `daemon_state_full()`. Se `mic_mudo` voltar a `false`, o byte mandou.
Existe porque a premissa *"bit apagado = firmware ignora o byte"* **já caiu uma
vez, no MESMO report**: RUMBLE-SEM-DONO-01 mediu que, com os bits de vibração
DESLIGADOS, um report pedindo `common[2]=200`/`common[3]=0` fez o tremor trocar
de lado na mão dela. Se o `power_save_control` se comportar igual, **acender o
LED DESMUTA o controle**, e nenhuma régua de código pega isso. `docs/data/ensaios.csv`
tem HOJE zero ensaios para `led_microfone`, e a linha `luz.led_microfone` do
mapa continua `inferido-do-codigo` até ele acontecer.

**A aba 08 e as lápides do `mic-escopo`.** A interface está sob a lista dela
(`mockup/TODO-DELA.md`), com três regras que vêm dela e valem acima de tudo
neste trabalho: *um ponto por vez*, ***SEM AGENTES***, *com o navegador*, e o
próximo só depois do OK dela. Este trabalho foi despachado a um agente — logo o
passo da tela **não é dele**. Nada foi escrito em `mockup/` nem publicado.

**A prova de tela de ≥ 200 s.** Mesma razão: ela é da lista dela e do navegador.
O TEMPO entrou como régua onde ele cabe sem tela — a borda contada ao longo de
6.200 reports (~200 s a 31 Hz) em
`test_o_contador_sobrevive_a_uma_sessao_inteira`.

---

## As perguntas para ela

1. **Quatro acesos, ou um aceso?** As duas frases dela pedem coisas diferentes e
   as duas cabem, mas não ao mesmo tempo. Proposta: o LED de cada controle diz
   *"meu canal está capturando"* (pode haver quatro acesos), e o **padrão do
   sistema** é de quem apertou por último, com a tela mostrando qual dos quatro
   está com o padrão.
2. **No arranque, o controle nasce no ar ou fora?** Ligado, o DualSense nasce
   NÃO-mudo — com a inversão, isso é quatro LEDs acesos assim que conectam.
   (a) nasce aceso, honesto; (b) nasce apagado e só acende no primeiro toque, o
   que faz a luz mentir por omissão enquanto o mic está aberto.
3. **Plugar a webcam pode desfazer a sua escolha?** Com o drop-in 51 a entrada
   do controle fica em `priority.session = 1500`, abaixo de qualquer captura
   real (2009). Fazer a escolha sobreviver exige apagar o 51 — mudança global e
   persistente da máquina (hoje só o `hefesto mic promote` faz isso).
4. **Quando não houver para onde voltar, o que o produto faz?** Hoje é o caso:
   `fontes_elegiveis` devolve VAZIO. Construído: **não elege nada e diz na
   tela**. A opção que não vou construir sem ela mandar é cair no `.monitor`.

---

## Superfície nova

| onde | o quê |
| --- | --- |
| IPC | `mic.led.set {aceso: bool\|null, uniq?}` — `null` DEVOLVE a posse ao kernel |
| CLI | `hefesto mic led-on \| led-off \| led-release [--uniq]` |
| shell | `--fonte-se-sustenta <nome>` e `--melhor-fonte-elegivel` (consulta pura) |
| tópico | `EventTopic.MIC_DA_MESA` — `{uniq, mudo, seq}` |

A devolução de posse do LED **já existia e não tinha um único chamador de
produção**: tomada a posse numa sessão, ela só caía quando o handle morresse.
Ela é a porta de emergência da inversão, e por isso foi fiada ANTES da primeira
escrita nova.
