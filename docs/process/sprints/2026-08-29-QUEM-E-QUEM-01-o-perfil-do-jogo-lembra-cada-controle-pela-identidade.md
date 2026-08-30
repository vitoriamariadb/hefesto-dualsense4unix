---
sprint: QUEM-E-QUEM-01
onda: QUEM-E-QUEM
posse:
  Q1:
    - src/hefesto_dualsense4unix/profiles/schema.py
cria:
  - tests/unit/test_quem_e_quem_01_o_perfil_lembra_o_jogador_por_identidade.py
bancada: false
depois_de: [EMULACAO-UM-DONO-SO-01, MIGRA-GATILHOS-09, MIGRA-VIBRACAO-05, MIGRA-VIBRACAO-06, ONDA-CONTROLES-06, ONDA-CONTROLES-07, ONDA-GATILHOS-04, ONDA-NAVEGACAO-01, ONDA-NAVEGACAO-04, ONDA-NAVEGACAO-05, ONDA-PERFIS-09, ONDA-VIBRACAO-03, ONDA-VIBRACAO-05]
nao_toca:
  - novo-layout/
  - src/hefesto_dualsense4unix/gui/main.glade
---

# QUEM É QUEM · 01 — o perfil do jogo lembra cada controle pela identidade

**Requisito dela, 29/08/2026**, e ele tem um caso de uso com nome:

> *"minha ideia é termos os perfis do jogo, dentro de cada perfil de jogo cada
> controle tem que ser lembrado, identidade via usb e via bt. E a memória
> daquele controle dentro do perfil deve ser preservada. Imagina que eu uso o
> branco sempre. Além de mim meu irmão tem autismo também então já dá pra
> imaginar que somos muito metódicos com isso. Ele sempre vai jogar com o
> controle Z, independente do modo de conexão ou se tá via bt ou cabo, o perfil
> do jogo Y deve se lembrar de nós dois. E se eu adicionar o controle W, o mesmo
> segue pra ele."*

**E ela fechou o escopo na mesma frase**, o que muda a régua desta sprint:

> *"E isso como produto final, sem se apegar ou se adaptar aos meus controles
> reais — a ideia é que funcione como acessibilidade pra qualquer usuário
> simples."*

**Ou seja: nada aqui pode depender da mesa dela.** Nem de quatro controles, nem
de DualSense, nem dos MACs que esta casa conhece. A prova tem de passar com uma
mesa de um controle, de cinco, e com um controle que nunca se viu.

---

## 1. O QUE JÁ EXISTE — e é mais da metade

Medido em 29/08, contra o disco e contra o registro dela:

| Peça | Onde | Estado |
|---|---|---|
| **A chave é o MAC normalizado** | `profiles/schema.py:1112` | **pronta** — 12 hex, canoniza `AA:BB:...` |
| **O perfil guarda por controle** | `schema.py:1008` (`controllers: dict[str, ControllerOverrides]`) | **pronto**, com quatro campos |
| **O número do jogador é lembrado por identidade** | `controllers.json`, campo `order`, via `identity.number.set` (`ipc_handlers.py:1590`) | **pronto, mas GLOBAL** |
| **A máscara é lembrada por aparelho** | `controller_masks.json` (`external_mask.py:175`) | **pronta, mas GLOBAL** — e sem quem a ligue (ver `D-A-MASCARA-POR-CONTROLE-VALE-NO-APLICAR`) |

**A IDENTIDADE ATRAVESSA O TRANSPORTE, E ISSO ESTÁ PROVADO** — é a pergunta que
o requisito dela tem no centro, e ela já foi respondida. Na **troca de braços de
15/08/2026**, os quatro controles mudaram de transporte e os quatro MACs
continuaram colados às suas unidades; o que trocou de lado foi a **rota ALSA**,
que é do transporte, não da unidade. O MAC é a chave, e ela vale no cabo e no
rádio.

---

## 2. O QUE FALTA — e são duas coisas, não vinte

### E1 — sete features na tela, quatro no perfil

Medido em 29/08 (`profiles/schema.py` contra `novo-layout/02-controles.html`):

| Feature, por controle | No perfil? | Onde |
|---|---|---|
| Barra de luz | **sim** | `ControllerOverrides.leds` |
| Gatilhos | **sim** | `.triggers` |
| Vibração | **sim** | `.rumble` |
| Alto-falante | **sim** | `.speaker` |
| **Microfone** | **global** | `ProfileConfig.mic` (:982) — na RAIZ, não por controle |
| **Máscara ("vê como")** | **global** | `controller_masks.json`, e nada a liga |
| **Giroscópio** | **não existe** | — |
| **Acelerômetro** | **não existe** | — |
| **Touchpad** | **não existe** | — |

**Quatro de nove prontas.** Duas existem em lugar global e precisam do por-controle;
três não existem em lugar nenhum.

**O acelerômetro tem uma ressalva medida:** o `daemon.state_full` não publica
chave de acelerômetro (as de `inputs` são buttons, gyro, l2_raw, lx, ly, r2_raw,
rx, ry, speaker, touchpad). Guardar a PREFERÊNCIA dele no perfil continua válido
— ligar/desligar é escolha, não leitura —, mas quem for ler o valor não vai
achar. As duas coisas se resolvem separado.

### E2 — o padrão da casa já existe, e é dela

**Não se inventa arquitetura aqui.** Ela já decidiu a forma em 29/08, para o
microfone: **a máquina dá o padrão, o perfil sobrepõe**. Esta sprint aplica a
MESMA forma aos outros campos:

- **global** (`controllers.json`, `controller_masks.json`) = o que vale quando o
  perfil não tem opinião — é a mesa da casa;
- **perfil** (`ControllerOverrides`) = o que vale neste jogo, para este aparelho.

Assim o caso dela funciona sem configurar nada: o irmão pega o controle Z, o
global já sabe que Z é o jogador 2, e o perfil do jogo Y pode dizer outra coisa
se ela quiser — e lembra.

---

## 2b. O QUE A MESA DE MEDIÇÃO JÁ RESPONDEU — e quem coordena não tinha lido

**`html/specs.html` e a linha `identidade.cracha_nos_dois_transportes` do
`mapa-controles.csv` respondem a metade desta sprint, e a resposta é de
15/08/2026.** A linha nasceu de uma pergunta dela, textual: *"nos 4 controles via
cabo e bt vamos ter sempre identificado né?"*

**O que foi medido** (`scripts/ensaios/identidade_nos_dois_transportes.py`,
leitura pura, pela porta do broker com SCM_RIGHTS, daemon rodando): **cinco**
candidatos a crachá — `0x05`, `0x09`, `0x0b`, `0x20`, `0x22` — saíram nos DOIS
transportes, estáveis byte a byte entre leituras com 2 s de distância.
**Cinco, não um.**

**E a própria linha carrega a régua desta sprint**, escrita antes de ela ser
pedida:

> *"Ela também é o lugar onde fica escrito que **4-de-4 numa mesa de quatro
> placas diferentes NÃO prova universalidade** — o que prova é o MECANISMO."*

### O buraco que a mesa dela esconde, e que só o mecanismo revela

`daemon/subsystems/identity.py:104` (D9): **uma key sem MAC de 12 hex — firmware
sem serial — ganha slot VOLÁTIL, que vale na sessão e nunca é persistido**,
porque o fallback é `path:...` e o path muda entre boots.

**Para esse usuário, a memória por identidade não funciona em jogo nenhum,
nunca.** Ele liga o controle, configura, fecha o jogo, e perdeu. E nada na mesa
desta casa mostra isso: os quatro DualSense daqui têm MAC.

**A cura tem endereço, e não é inventar nada:** quando o MAC falta, um dos outros
quatro crachás medidos serve — eles saem nos dois transportes e são estáveis. O
que hoje é desistência (`_volatile`) vira o segundo conduíte.

### A ORDEM POR CHEGADA FICA — e o alerta é dela

Quem coordena leu `identity.py:70-95`, viu que a ordem é da **chegada** e não da
identidade, e propôs a ela três caminhos para inverter isso. **Ela recusou os
três, e a razão é uma cura medida que a inversão desfaria.** Palavra dela,
29/08/2026:

> *"sim, isso tá certo. pq antes o que rolava era uma solução que eu sempre
> conectava o controle branco e mesmo não tendo nenhum outro controle ele era
> sempre o player 3. E o jogo de um player só não entendia. Mas a ideia que falei
> de se lembrar é sobre as features dentro do perfil de tal jogo. **cuidado**"*

**O defeito que a chegada cura:** com o número colado à identidade, um controle
gravado como jogador 3 continua sendo o 3 **mesmo sozinho na mesa** — e o jogo de
um jogador só não o entende. A fila de chegada existe para que a mesa de HOJE
decida quantos jogadores há, em vez de a mesa de ontem.

**O QUE NÃO MUDA É A REGRA AUTOMÁTICA** — quem vira jogador 1 quando os
controles chegam. O `identity.py` está certo nisso.

**MAS A TROCA À MÃO TEM DE FUNCIONAR, E ELA ESTÁ NO DESENHO.** Correção dela,
29/08/2026, sobre uma generalização errada de quem coordena:

> *"o nosso layout é pra permitir a troca do player de cada controle. Medimos
> isso na época do lightbar e mapeamos isso. No novo layout temos uma seção pra
> isso e ela tem que funcionar."*

E está mesmo: a seção **"Selecione o player"** vive na aba **Iluminação**
(`novo-layout/04-iluminacao.html`) — e o desenho já define a semântica, que não é
a de uma fila:

> *"Ele agora **dá o número** — e **dar um número ocupado é uma TROCA, não uma
> fila**."*
> *"a cor da barra segue junto, porque sem escolha à mão ela é a cor do número:
> depois da troca o Starlight Blue acende `#0000FF` e o Cosmic Red acende
> `#FF0000`"* (`core/led_control.py::player_slot_color`).

**E A OFERTA É DO TAMANHO DA MESA** (`D-A-TROCA-DE-PLAYER-SO-OFERECE-OS-NUMEROS-DA-MESA`,
29/08): *"se tem 3 controles posso escolher só entre os 3 qual é o meu player.
Sempre se adaptando nesse sentido."* Três controles, três botões; um controle, um
botão. **Isto resolve por construção o defeito do "branco sempre player 3"** — com
um controle na mesa o único número que existe é 1 — e fecha a semântica da troca:
se todo número ofertado está ocupado, toda escolha é permuta, nunca sobra posto
vago.

**O mecanismo existe no daemon:** `identity.number.set`
(`daemon/ipc_handlers.py:1590`), e o registro grava em `controllers.json` pelo
campo `order`/`rank`.

**As duas coisas convivem, e é por isso que a distinção importa:** a fila de
chegada decide quando ninguém escolheu; a troca à mão sobrepõe quando ela
escolhe. É a mesma forma de `D-O-MICROFONE-A-MAQUINA-DA-O-PADRAO-O-PERFIL-SOBREPOE`.

### O que ela pediu, então, e é outra coisa

**As FEATURES de cada controle, dentro do perfil de cada jogo.** O controle Z
guarda os gatilhos dele, a luz dele, a vibração dele, o som dele — no perfil do
jogo Y —, e os traz de volta na próxima vez, **seja ele o jogador 1, 2 ou 3, no
cabo ou no rádio**.

O número do jogador é do momento; **as features são da identidade**. São
perguntas diferentes, e confundi-las foi o erro que ela pegou.

---


## 3. A MORDIDA, e ela tem de ser universal

Uma régua que use os MACs desta casa não prova o que ela pediu. As três provas:

1. **Um controle que nunca se viu** entra na mesa: o perfil o aceita, guarda por
   identidade, e o traz de volta na próxima abertura. MAC sintético, não os dela.
2. **O mesmo controle troca de transporte** (cabo → rádio): a memória continua.
   Prova sem aparelho: dois `describe_controllers` com o mesmo MAC e `transport`
   diferente têm de cair na MESMA entrada do perfil.
3. **Um controle SEM MAC** (firmware sem serial, key `path:...`): hoje ele cai
   em slot volátil e a memória nunca persiste. A régua tem de cobri-lo — é o
   usuário que a mesa desta casa não tem.
4. **A mordida:** arranque a normalização da chave (`schema.py:1112`) e veja
   `AA:BB:CC:00:00:02` deixar de encontrar `aabbcc000002`. Se passar com a cura
   arrancada, a régua não mede a identidade — mede a string.

**A RÉGUA, com a correção dela de 29/08:**

> *"se a solução X precisa disso, ok, desde que não seja focado na minha máquina,
> não vaze e funcione pra qualquer controle e pra qualquer jogador mundo afora."*

Ou seja: **usar os controles dela é permitido** — é o hardware que esta casa tem,
e medir nele é como tudo aqui foi medido. O que não vale é o RESULTADO depender
deles. As três travas: (a) nada de MAC real em arquivo versionado; (b) o
mecanismo tem de valer para controle que ninguém aqui tem; (c) a prova não pode
ser "rodou aqui e funcionou".

**E a prova que NÃO basta sozinha:** rodar com a mesa dela e ver funcionar. Cinco
controles conhecidos é a amostra mais favorável possível, e foi exatamente assim
que o `hardware_version` pareceu identificar unidades quando só agrupava por
revisão de placa (`mapa-controles.csv`, `identidade.revisao_de_placa`).

---

## 4. O QUE ESTA SPRINT NÃO FAZ

- **Não liga a máscara por controle.** Isso é `D-A-MASCARA-POR-CONTROLE-VALE-NO-APLICAR`
  e tem endereço próprio. **SUBSTITUÍDO em 29/08/2026:** esta linha dizia que
  `make_virtual_pad` não recebe `identity` — ele recebe desde
  `A-MASCARA-POR-CONTROLE-01` (`virtual_pad.py:153`, `coop.py:990`). É trabalho
  vizinho e JÁ FEITO; o que sobra lá é o vpad não ser recriado ao aplicar.
- **Não persiste a cor do plástico.** Mesmo padrão, outro campo.
  **SUBSTITUÍDO em 29/08/2026:** esta linha dizia que a leitura *"ainda vai pelo
  caminho errado (abre `/dev/hidraw` direto)"* — ela passou a entrar pela porta
  do broker em `A-COR-PELA-PORTA-DO-BROKER-01` (`cor_do_plastico.py:513`).
- **Não mexe na tela.** A aba Controles está em transplante; esta sprint é do
  dado.
