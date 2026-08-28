# ONDA 0 · Z0-01 — a régua e a foto

**24/08/2026.** Frente **Z0** da **Onda 0** — as invariantes que valem para as
onze abas ([SPRINT_ORDER §0.2](../SPRINT_ORDER.md)). Não é aba: é o
**instrumento pelo qual toda aba é vista**, e por isso começa no dia 1, em
paralelo com a Z6.

| | |
|---|---|
| **Grau** | **MEDIDO** em todo o §2.1 e §2.2 — cada linha traz o comando ou o `arquivo:linha`, conferidos contra a árvore de HOJE, e **duas foram provadas por mordida**. **DESENHO** na coreografia, nas tarefas e no custo. |
| **Fecha** | O portão de frescor passa a enxergar o instrumento que faz a foto; a `MIXINS_DE_ABA` deixa de declarar 3 de 11; o `main` do retrato passa a ser cobrado nas ONZE, não em cinco; o `emulation_vidpid_label` — a metade do aceite desta frente — ganha régua; o recibo passa a declarar **com que bancada** cada foto foi montada; a **mesa vazia** e o **Modo avançado do editor de Perfis** ganham foto pela primeira vez; e os fatos caducos do `interface.md` saem. |
| **NÃO faz** | **Não muda uma linha da tela do produto.** Não toca `src/hefesto_dualsense4unix/app/` nem `gui/main.glade` (exceção única e cirúrgica: nenhuma — as tarefas de tela são das ondas de aba). Não mede rádio (§6). Não redesenha aba nenhuma. Não roda a suíte inteira (R2 do [COMO-REGER-AGENTES](../COMO-REGER-AGENTES.md)). |
| **Cura o defeito de forma** | **F14 — a foto mente para a documentação** ([ONDE-PARAMOS 23/08 §F14](../2026-08-23-ONDE-PARAMOS-os-defeitos-de-forma-e-a-regencia.md)), e a metade dele que sobrou depois de 23/08: **o instrumento foi curado e a régua que o vigia não foi.** De carona, dá à **F7** o único ângulo que ela ainda não tem — uma foto do estado VAZIO. |
| **Depende de** | **Nada.** É a única frente da Onda 0 sem pré-requisito, e a única que roda enquanto ela mede Bluetooth (§6). |
| **Origem** | Medição própria de 24/08, na árvore em `dev`, com o daemon vivo e nenhum byte escrito no aparelho. |

---

## 1. O defeito, em uma frase

**A foto é a primeira coisa que esta casa manda olhar, e não existe régua que
saiba dizer quando ela envelheceu** — o portão de frescor vigia o código das
abas e é **cego ao próprio programa que tira a foto**, então a cura de 23/08
entrou no repositório por disciplina de quem a escreveu, não porque alguma
coisa a tenha cobrado.

---

## 2. O que está medido, e o que é hipótese

### 2.1 A bancada, agora (24/08, daemon vivo, nada parado, nada clicado)

```
$ .venv/bin/python -c "from hefesto_dualsense4unix.app import ipc_bridge as b; \
    print(b.daemon_state_full())"
topo:        connected=True   transport=bt
controllers: 1 registro — uniq=None, connected=False, transport=None, player=None
window_detect_backend=xlib   window_detect_healthy=True
window_detect_seeing=False   window_detect_reason=sem_conexao_x

$ for h in /sys/class/hidraw/hidraw*; do grep -h HID_NAME $h/device/uevent; done
Compx 2.4G Wireless Receiver          (x2)
BY Tech Gaming Keyboard               (x2)
DualSense Wireless Controller (Hefesto P1)     <- o NOSSO vpad
$ ls /sys/class/bluetooth/          -> hci0 hci1 hci2
```

**Três leituras, e as três mandam nesta frente:**

1. **ZERO DualSense físico na mesa.** O único nó com VID/PID de DualSense é o
   vpad que o produto cria. **Correção ao briefing desta leva**, que diz "2
   DualSense no rádio": não hoje. Os três adaptadores existem.
2. **F6 está viva neste instante:** o topo do `state_full` diz `connected=True,
   bt` e o registro de controle, **no mesmo payload**, diz `connected=False`.
3. **F8 está viva neste instante:** `seeing=False`, `reason=sem_conexao_x` — e
   `healthy=True` ao lado. **É por isso que a foto da aba Sistema importa
   tanto** (§2.2/M5): ela publica exatamente o contrário disto.

### 2.2 Por leitura de código e de imagem, com endereço

**M1 — O portão de frescor é CEGO ao instrumento que faz a foto. Provado por
mordida.**

`tests/unit/test_as_fotos_acompanham_a_versao.py:72-75`:

```python
CODIGO_DA_TELA = (
    "src/hefesto_dualsense4unix/app",
    "src/hefesto_dualsense4unix/gui",
)
```

O `scripts/gui-captura/retratar_abas.py` **não está aí** — e ele é o único
arquivo que decide o que a foto mostra. Mudança de +645 linhas nele (o commit
`3de95ff`, os cinco hosts) não torna foto nenhuma suspeita.

A mordida, num repositório sintético com dois commits — primeiro a foto, depois
só o retrato:

```
régua de HOJE (app + gui)          -> None    (vira pytest.skip: VERDE)
régua COM scripts/gui-captura      -> False   (REPROVA)
```

**Este é o buraco exato do F14.** Em 23/08 a foto foi refeita no mesmo commit
dos hosts porque quem escreveu se lembrou. Da próxima vez, se ninguém se
lembrar, nada acusa.

**M2 — A `MIXINS_DE_ABA` declara 3 abas e o retrato usa 10.**

`tests/unit/test_a_foto_monta_como_o_produto_monta.py:45-50` traz três entradas:
`TriggersActionsMixin`, `ProfilesActionsMixin`, `ConfigActionsMixin`. Medido no
retrato, os `install_*_tab` de produção efetivamente chamados são **dez**
(`retratar_abas.py:492, 636, 825, 1296, 1457, 1524, 1643, 1732, 1786, 1843`) —
e o produto chama nove diretos em `app/app.py:1387-1396`, mais o
`install_no_jogo_tab` a partir de `status_actions.py:551` e o
`install_mouse_tab` a partir de `input_actions.py:272`.

**Quem fica sem régua nenhuma: Início, Status e No jogo.** Nenhuma das três tem
linha em `MIXINS_DE_ABA`, nenhuma está na tabela do portão F14, e nenhuma está
na lista de AST que cobra o `main`. A segunda régua do arquivo
(`test_o_retrato_nao_monta_widget_de_aba_a_mao`) só procura a construção do nome
`SegmentedSelector` — um widget, não uma família.

> **O número "3 de 11" do aceite da §0.2 continua CERTO, e a leitura dele
> mudou.** Ele não descreve mais um script sem hosts: descreve uma **lista de
> declaração** que ficou para trás de um instrumento que já monta dez.

**M3 — O `main` do retrato é cobrado em cinco abas, não em onze.**

`tests/unit/test_p10_a_foto_nao_publica_o_glade_cru.py:316-321` fixa
`esperadas` em cinco montadores (`_montar_aba_lightbar`, `_rumble`, `_sistema`,
`_emulacao`, `_navegacao`). O `main` chama **nove** (`retratar_abas.py:2203-2215`).
Tirar `_montar_aba_inicio` da linha `:2203` não reprova este teste.

**M4 — A metade do aceite desta frente não tem régua: o `emulation_vidpid_label`.**

O aceite da §0.2 pede que *"a da Emulação deixe de conter `045E:028E (Xbox 360)`
com máscara DualSense"*. Essa frase mora em `gui/main.glade:3074-3077`, no
rótulo `emulation_vidpid_label`. A tabela `_ROTULOS_QUE_O_CODIGO_REESCREVE`
(`test_p10_...:80-140`) cobre o **irmão** dele — `emulation_device_name_label`
(`:3061-3064`, o *"Microsoft X-Box 360 pad"*) — **e não cobre o VID:PID.**
A foto de hoje está certa por conta do host, não por causa de portão.

**M5 — As fotos são bonitas agora, e nenhuma delas declara de que bancada saiu.**

`docs/usage/assets/PROVA-DA-FOTO.txt` registra `ensaio: 2026-08-23 21:12`,
`abas: 14` e o sha256 de cada PNG. **Não registra uma linha sobre o estado
injetado.** Lidas as imagens uma a uma:

| foto | o que ela afirma hoje | o que a máquina diz (§2.1) |
|---|---|---|
| `readme_sistema.png` | "O Hefesto está: **Funcionando**", três `[OK]`, e **"Trocar de perfil ao abrir o jogo: funcionando (na frente agora: pragmata.exe)"** | `seeing=False`, `reason=sem_conexao_x` — a troca por jogo está **cega** |
| `readme_sistema.png` | `controle_conectado transporte=bt jogador=2` | zero DualSense físico |
| `readme_configuracoes.png` | quatro cards, dois "Sony · Bluetooth" | idem |
| `readme_emulacao.png` | "Microfone do DualSense: **Ligado**", em verde | fonte de captura de mic por rádio: **medido como NÃO** (§0.7) |

**Nenhuma dessas linhas é mentira do instrumento** — são dublês, e o dublê é o
que protege a privacidade dela (travado por
`test_retrato_das_abas_nao_vaza_dado_real.py`). **O defeito é que a foto não diz
que é dublê.** Antes de 23/08 a foto publicava o XML cru e mentia para um lado;
hoje publica o caminho feliz sintético e mente para o outro. Quem lê — pessoa ou
agente — não tem como separar o que foi medido do que foi encenado, e foi
exatamente esse erro que custou dez briefings errados em 23/08.

**M6 — A mesa VAZIA nunca foi fotografada.**

O retrato tem três bancadas: o padrão (dois dublês), `--mesa-cheia` (quatro,
`tests/fixtures/state_full_quatro_controles.json`) e `--cinco`
(`retratar_abas.py:2295-2303`). **Não há `--mesa-vazia`.** É o estado que a
**F7** nomeia — *"o estado vazio é indistinguível do estado bom"* — e é o estado
em que a bancada está AGORA. As seis abas que a F7 acusa nunca foram vistas
nesse estado por olho nenhum.

**M7 — A metade principal do editor de Perfis continua sem foto, e a causa
mudou.**

A `readme_perfis.png` de hoje **não** mostra um editor vazio: mostra o editor
montado pelo método de produção, com "Aplica a", "Nome do jogo", a lista do
Steam Input e a seção "Modo". O que ela não mostra é que o interruptor **"Modo
avançado" está DESLIGADO** — e é sob ele que mora a metade da aba. **O aceite
da §0.2 diz "editor VAZIO"; a árvore de hoje diz "editor básico".** O buraco de
cobertura é o mesmo; a causa não é mais a ausência de host.

**M8 — Dois fatos caducos publicados na documentação, com endereço.**

`docs/usage/interface.md:11-21` diz que as capturas *"foram conferidas pela
última vez em 22/08/2026"* e traz um parágrafo inteiro afirmando que **"A foto
da Configurações está atrás da árvore"**, que *"a imagem é das 18h15"* e que
*"na foto ele ainda diz 'Folgada 0/1600', em verde"*. As três afirmações
caducaram em `3de95ff` (23/08, 21h12): lida a imagem de hoje, a aba
Configurações mostra a seção "Está tudo certo?", os botões "Não sei" e os quatro
cards — **não há "Folgada 0/1600" em lugar nenhum dela.**

E `docs/usage/assets/CONFERIDO-EM.md` termina em 22/08: **o ensaio de 23/08 não
foi registrado**, embora sete PNGs tenham mudado no commit.

### 2.3 O que esta sprint SUBSTITUI

Regra da casa: *fato errado se substitui em todos os lugares; decisão medida
ganha nota datada*. Os três abaixo são fato errado — a medição os derrubou — e
saem inteiros.

| onde está escrito | o que dizia | o que a medição de 24/08 diz |
|---|---|---|
| briefing desta frente, e [ONDE-PARAMOS §F14](../2026-08-23-ONDE-PARAMOS-os-defeitos-de-forma-e-a-regencia.md) | *"os cinco hosts nunca rodaram; o script tem mtime posterior às fotos"* | **rodaram.** `PROVA-DA-FOTO.txt` diz `ensaio: 2026-08-23 21:12`, e `git show --stat 3de95ff` traz **sete PNGs** junto dos hosts. A diferença de mtime (21:12 nas fotos, 21:14 no script) é edição de comentário depois do ensaio |
| aceite da §0.2 | *"Lightbar: prévia sem cor, 'Aceso agora: consultando…'"* | a foto de hoje traz a prévia laranja e *"Aceso agora: o desenho do co-op…"* |
| aceite da §0.2 | *"Emulação: VID:PID de Xbox contra a máscara viva"* | a foto de hoje traz `054C:0DF2 (DualSense)` |
| aceite da §0.2 | *"Navegação: lista vazia, interruptor LIGADO"* | a foto de hoje traz as duas colunas e seis atalhos, com os dois interruptores DESLIGADOS |
| aceite da §0.2 | *"Sistema: o produto aparece DESLIGADO"* | a foto de hoje traz *"Funcionando (liga sozinho com o computador)"* |
| aceite da §0.2 | *"Perfis: editor VAZIO"* | editor montado, em **Modo avançado desligado** — ver M7 |

**O que NÃO sai, e ganha data:** o custo já pago. *Dos dez batedores da noite de
23/08, cinco leram uma tela que não existe, e quem coordenou passou a ordem das
abas errada a treze agentes.* Isso é decisão medida — é a prova de por que esta
frente vem primeiro — e fica escrito, com a data.

### 2.4 O que continua HIPÓTESE

- **Que uma foto nova mude o plano de alguma onda de aba.** As onze fotos
  atuais ainda não passaram pelo olho dela depois de `3de95ff`. Provável, não
  medido.
- **Que a foto da mesa vazia (Z0-5) revele defeito novo.** A F7 diz que sim em
  seis abas; ninguém olhou.
- **Que o vão vertical visível em Lightbar (~600 px), Emulação (~350 px) e
  Navegação (~450 px) seja do produto e não do instrumento.** Foi do instrumento
  uma vez, em 22/08 (o `expand=True` da aba Gatilhos). **Ninguém afirma vão sem
  remedir depois do Z0-10.**

---

## 3. Por que esta frente vem antes das abas

A Onda 0 existe porque as invariantes **mudam o que cada aba tem de fazer**. A
Z0 é a mais barata das oito e a única que muda o que cada aba tem de **ver**:

| onda de aba | o que muda por causa da Z0 |
|---|---|
| **1 · Configurações** | é o molde a copiar, e o molde é lido na foto. Sem o recibo do Z0-4 ninguém sabe que os quatro cards da foto vêm de um fixture de quatro |
| **3 · Status** e **4 · No jogo** | as duas abas **sem régua nenhuma** no retrato (M2), e as duas moram no mesmo arquivo. Qualquer uma pode perder o host sem que nada acuse |
| **6 · Perfis** | planejar a metade avançada do editor sem nunca tê-la visto é planejar de cabeça (M7) |
| **7 · Lightbar** | a sprint dela mede um vão de ~600 px **na foto**. Se o vão for do instrumento, a tarefa L8 é retrabalho |
| **11 · Sistema** | a foto dela publica o caminho feliz enquanto a máquina está com a troca por jogo cega (M5). É a aba onde a distância entre foto e máquina é maior |
| **todas** | R4: `retratar_abas.py` reescreve as onze de uma vez. **A foto sai em série com todas as ondas, nunca em paralelo** — quem não souber disso grava por cima do vizinho |

E o argumento que não é de aba nenhuma: **esta frente é o antídoto da armadilha
A1** ([COMO-REGER-AGENTES](../COMO-REGER-AGENTES.md)) — *o briefing errado se
propaga multiplicado por N*. A causa raiz da A1 foi uma foto que mentia. A cura
da A1 não é escrever hosts; é ter **quem cobre** que a foto acompanhe o
instrumento.

---

## 4. A coreografia dos agentes

**Três agentes** — o número da linha desta frente na §0.2, respeitado. **Três
rodadas**, porque o instrumento tem de parar de mudar antes de a régua o medir.

### Rodada 1 — dois em paralelo, arquivos disjuntos

| agente | tarefas | POSSE DE ARQUIVO (exclusiva) |
|---|---|---|
| **A1 — o dono do instrumento** | Z0-5, Z0-6, Z0-7, Z0-8 | `scripts/gui-captura/retratar_abas.py`; `tests/fixtures/state_full_mesa_vazia.json` (novo) |
| **A3 — o dono da prosa** | Z0-9, Z0-10 | `docs/usage/interface.md`; `docs/usage/assets/CONFERIDO-EM.md`; `README.md` |

**A2 fica fora da rodada 1 de propósito:** a régua não pode ser escrita contra
um script que está mudando debaixo dela. É o erro R2 na escala pequena — medir
árvore em movimento não mede nada.

### Rodada 2 — o dono das réguas, sozinho

| agente | tarefas | POSSE DE ARQUIVO (exclusiva) |
|---|---|---|
| **A2 — o dono das réguas** | Z0-1, Z0-2, Z0-3, Z0-4 | `tests/unit/test_as_fotos_acompanham_a_versao.py`; `tests/unit/test_a_foto_monta_como_o_produto_monta.py`; `tests/unit/test_p10_a_foto_nao_publica_o_glade_cru.py` |

A2 **lê** o retrato e **não o edita**. Se uma régua exigir mudança no script,
A2 **relata** e a mudança volta para A1 (regra R1).

### Rodada 3 — o lote, e o olho dela

| agente | tarefa |
|---|---|
| **A3** | Z0-11 — roda `retratar_abas.py` **uma vez, com a leva inteira parada**, nos quatro modos, e leva as fotos ao olho dela em lote |

### O que quebra se alguém mexer sozinho

| gancho | quem depende | o que acontece se ignorar |
|---|---|---|
| `retratar_abas.py` é **um arquivo só** e reescreve **as onze fotos de uma vez** | as onze ondas | dois agentes gravam por cima um do outro e o `git status` fica ilegível (R4) |
| `MIXINS_DE_ABA` e a tabela do F14 nomeiam widgets do `main.glade` | toda onda que renomeie widget | a régua aponta para o nada; o primeiro teste do F14 existe para pegar isso e reprova nomeando o widget |
| o recibo do Z0-4 declara fixture | Configurações, Status, Lightbar | uma onda que troque o fixture sem atualizar o recibo publica proveniência errada — pior que não publicar |
| `--mesa-vazia` (Z0-6) cria fotos novas | a documentação | nome de arquivo novo **fora** de `NOMES` e sem legenda no `interface.md` é foto órfã |

---

## 5. As tarefas

**Onze.** Nenhuma toca a tela do produto — ver o carimbo de cada uma.

---

### Z0-1 — O portão de frescor passa a ver o instrumento *(A2)*

**Arquivo:** `tests/unit/test_as_fotos_acompanham_a_versao.py:72-75`.

**O conserto:** `CODIGO_DA_TELA` ganha `scripts/gui-captura` como terceira
entrada. Quem faz a foto passa a ser código da tela para efeito de frescor —
porque é ele quem decide o que a foto mostra.

**A mordida:** o arquivo já tem o molde pronto (`_repo_de_mentira`,
`:178-227`). Acrescente um terceiro caso: repositório com a foto no primeiro
commit e **só** `scripts/gui-captura/retratar_abas.py` no segundo. Com a régua
de hoje o comparador devolve `None` (vira `skip`, verde); com a cura, `False`
(reprova). **Já reproduzido em 24/08, e é o resultado literal do §2.2/M1.**
Arranque a entrada nova e o teste volta a `None`.

**Custo:** ~35 linhas, 1 h. **Carimbo:** **não toca a tela.**

---

### Z0-2 — A `MIXINS_DE_ABA` passa a declarar as onze *(A2)*

**Arquivo:** `tests/unit/test_a_foto_monta_como_o_produto_monta.py:45-50`.

**O conserto:** a lista deixa de ser "as três abas que já deram problema" e
passa a ser **uma linha por nome de `NOMES`** (`retratar_abas.py:261-273`), com
o mixin de produção que a monta e o que a foto perderia sem ele. As oito que
faltam, com os endereços conferidos hoje: `HomeActionsMixin`
(`home_actions.py:1401`), `StatusActionsMixin` (`status_actions.py:569`, e é ela
que monta **Status e No jogo**), `LightbarActionsMixin`
(`lightbar_actions.py:498`), `RumbleActionsMixin` (`rumble_actions.py:422`),
`DaemonActionsMixin` (`daemon_actions.py:777`), `EmulationActionsMixin`
(`emulation_actions.py:743`), `InputActionsMixin` (`input_actions.py:270`).

E o portão novo que o aceite pede: **nome em `NOMES` sem linha em
`MIXINS_DE_ABA` reprova, nomeando a aba.**

**A mordida — e ela é dupla, porque uma sozinha não morde:**
1. tire `HomeActionsMixin` da lista → o portão novo reprova dizendo `readme_inicio`;
2. tire o `from ... import HomeActionsMixin` do retrato (numa cópia em memória,
   não no arquivo de A1) → `test_o_retrato_chama_o_mixin_de_cada_aba_montada_em_codigo`
   reprova dizendo o que a foto perde.

Sem a segunda, a lista poderia crescer com nomes que ninguém confere — e o
`test_a_regua_deste_portao_nao_confere_a_si_mesma` (`:129`) já existe para
travar exatamente isso: **estenda-o para os onze**, ou ele passa a conferir três
de onze e a jurar que conferiu tudo.

**Custo:** ~70 linhas, 2 h. **Carimbo:** **não toca a tela.**

---

### Z0-3 — O `main` do retrato é cobrado nas onze *(A2)*

**Arquivo:** `tests/unit/test_p10_a_foto_nao_publica_o_glade_cru.py:316-321`.

**O conserto:** o dicionário `esperadas` para de ser uma lista literal de cinco
e passa a ser **derivado de `MIXINS_DE_ABA`** — uma fonte só, que é a regra que
o próprio arquivo cita no §2.2 dele. O AST do `main` (`retratar_abas.py:2198-2215`)
tem de mostrar chamada para o montador de cada aba declarada.

**O cuidado que separa isto de um estorvo:** Status e No jogo **não têm**
`_montar_aba_*` próprio — Status vem de `_injetar_card` (`:2198`) e Gatilhos de
`_injetar_modos_de_gatilho` (`:2202`). A declaração é `aba → nome da função que
a hospeda`, seja `_montar_` ou `_injetar_`. Régua que exige um prefixo reprova
quem fez a coisa certa, e esta casa já pagou isso em 13/08.

**A mordida:** apague a linha `:2203` (`_montar_aba_inicio`). Hoje: **verde**.
Depois: reprova nomeando "Início". Devolva.

**Custo:** ~40 linhas, 1 h 30. **Carimbo:** **não toca a tela.**

---

### Z0-4 — O `emulation_vidpid_label` entra na tabela do F14 *(A2)*

**Arquivos:** `tests/unit/test_p10_a_foto_nao_publica_o_glade_cru.py:80-140` (a
tabela); o alvo é `gui/main.glade:3074-3077`, **só leitura**.

**O conserto:** uma linha nova em `_ROTULOS_QUE_O_CODIGO_REESCREVE`:
`("Emulação", "emulation_box", "emulation_vidpid_label", "o VID:PID do aparelho
que a máscara ATIVA cria — o XML publica `045E:028E (Xbox 360)`")`.

**Por que é tarefa e não detalhe:** esta é a **metade literal do aceite desta
frente** (§0.2), e ela não tem régua. A foto de hoje traz `054C:0DF2
(DualSense)` porque o host escreve, não porque algo cobre.

**A mordida:** arranque do `_montar_aba_emulacao` (`retratar_abas.py:1656`) a
escrita do VID:PID. Hoje: **verde**, e a foto volta a publicar Xbox. Depois:
reprova nomeando a aba, o widget e a frase que voltou.

**Custo:** ~15 linhas, 30 min. **Carimbo:** **não toca a tela.**

---

### Z0-5 — O recibo declara a bancada de cada foto *(A1)*

**Arquivos:** `scripts/gui-captura/retratar_abas.py` (o escritor do recibo);
saída em `docs/usage/assets/PROVA-DA-FOTO.txt`.

**O conserto:** o recibo passa a trazer, além do `ensaio` e dos sha256, **um
bloco de proveniência**: qual modo rodou (`padrão` / `--mesa-cheia` / `--cinco`
/ `--mesa-vazia`), qual arquivo de fixture alimentou cada aba, e a frase que
mata a confusão: *"toda linha destas imagens é dublê — nenhuma delas é medição
desta ou de qualquer máquina."*

**O que ele NÃO faz:** não escreve nada dentro do PNG e não mexe na tela. É
texto ao lado da foto, no arquivo que já existe para isso.

**A mordida:** o retrato roda com `--mesa-cheia` e o recibo tem de nomear
`state_full_quatro_controles.json`. Arranque a linha de proveniência: um teste
novo em `tests/unit/` reprova dizendo que o recibo não sabe dizer de onde a foto
veio. **O dublê do teste tem de saber recusar** (A2 do COMO-REGER-AGENTES):
exercite os dois modos, não só o feliz.

**Custo:** ~90 linhas (40 no script, 50 de teste), 2 h 30. **Carimbo:** **não
toca a tela** — o recibo é arquivo de texto.

---

### Z0-6 — A mesa VAZIA ganha foto, pela primeira vez *(A1)*

**Arquivos:** `scripts/gui-captura/retratar_abas.py:2295-2303` (o uso) e
`:2354-2370` (o leitor de argumentos); fixture novo
`tests/fixtures/state_full_mesa_vazia.json`.

**O conserto:** um quarto modo, `--mesa-vazia`, com prefixo próprio
(`mesa_vazia_`) pela mesma razão dos outros dois — nenhuma medição pode
sobrescrever outra. O fixture é o estado que a F7 nomeia: `controllers: []`,
`coop.mesa: []`, e o topo do `state_full` **em desacordo com eles**, porque é
assim que o daemon está agora (§2.1/item 2). Fotografa fora de
`docs/usage/assets`, como o `--mesa-cheia` já faz.

**Por que é da Z0 e não de cada aba:** seis abas têm o mesmo buraco (F7). Se
cada onda fizer o seu, saem seis bancadas vazias diferentes e nenhuma
comparável.

**A mordida:** o modo roda e as onze fotos saem. Um teste cobra que o fixture
tenha `controllers` vazio E o topo divergente — arranque a divergência e ele
reprova, porque um fixture "vazio e coerente" **não reproduz o estado da
máquina** e daria falsa tranquilidade.

**Custo:** ~180 linhas (fixture incluso), 3 h 30. **Carimbo:** o modo **não
toca a tela**; a legenda que o `interface.md` ganhar é do Z0-8 e é
**ESTRUTURAL**.

---

### Z0-7 — O editor de Perfis fotografa o Modo avançado *(A1)*

**Arquivo:** `scripts/gui-captura/retratar_abas.py:696-825` (`_montar_aba_perfis`).

**O conserto:** o retrato grava **duas** fotos da aba Perfis — a de hoje, com o
Modo avançado desligado, e uma segunda com ele **ligado**. É o mesmo padrão que
a Configurações já usa (`ABAS_ESTICADAS`, `:2039`), e pela mesma razão: a aba
tem mais conteúdo do que a janela mostra, e a parte escondida nunca passou pelo
olho dela.

**O que NÃO muda:** o host continua sendo `install_profiles_tab`, o método de
produção. Ligar o interruptor é **injetar estado**, que é o trabalho deste
script; construir widget continua proibido
(`test_o_retrato_nao_monta_widget_de_aba_a_mao`).

**A mordida:** a segunda imagem tem de conter texto que a primeira não contém.
Compare o conjunto de rótulos visíveis das duas árvores montadas: se forem
iguais, o interruptor não pegou e o teste reprova. Arranque o gesto que liga o
modo avançado e veja reprovar.

**Custo:** ~70 linhas, 2 h. **Carimbo:** **não toca a tela**; a legenda no
`interface.md` é do Z0-8.

---

### Z0-8 — O trinco: duas fotos ao mesmo tempo, nunca *(A1)*

**Arquivo:** `scripts/gui-captura/retratar_abas.py` (o `main`).

**O conserto:** o retrato pega um trinco de arquivo antes de escrever o primeiro
PNG e recusa, **com motivo na saída**, se outro ensaio estiver em curso. É a R4
do COMO-REGER-AGENTES virada em código: hoje a regra existe só na cabeça de quem
coordena, e um `/clear` a apaga.

**A mordida:** dois processos, o segundo recusa e **não grava byte nenhum**.
Arranque o trinco: os dois gravam, e o teste vê o sha256 de uma foto mudar duas
vezes no mesmo ensaio. O dublê do trinco tem de saber recusar.

**Custo:** ~60 linhas, 1 h 30. **Carimbo:** **não toca a tela.**

---

### Z0-9 — Os fatos caducos saem da documentação *(A3)*

**Arquivos:** `docs/usage/interface.md:8-21`; `docs/usage/assets/CONFERIDO-EM.md`.

**O conserto:**
1. `interface.md:11` — *"conferidas pela última vez em 22/08/2026"* passa a
   dizer a data do ensaio que o `PROVA-DA-FOTO.txt` registrar.
2. `interface.md:16-21` — o parágrafo *"A foto da Configurações está atrás da
   árvore… ainda diz 'Folgada 0/1600'"* **sai inteiro**. É fato errado: a
   medição de 24/08 (§2.2/M8) leu a imagem e a frase não está lá. Manter o
   parágrafo ao lado da foto certa obriga a próxima pessoa a escolher entre
   duas afirmações — que é o defeito que a regra existe para matar.
3. `CONFERIDO-EM.md` ganha a linha de 23/08 que faltou (commit `3de95ff`, sete
   PNGs), e a linha do ensaio do Z0-10.
4. A caixa "Sobre as capturas" ganha, em **uma frase**, o que o recibo do Z0-5
   passa a declarar: **estas imagens são dublê, não medição.**

**A mordida:** `python3 scripts/validar-referencias-docs.py --all` e o portão de
frescor do Z0-1. Além deles, uma busca que tem de voltar **vazia**:
`grep -rn "Folgada 0/1600" docs/ README.md`. Se voltar com resultado, a
substituição foi pela metade — que é o defeito nomeado no `CLAUDE.md`.

**Custo:** ~40 linhas de prosa (a maioria **removida**), 1 h. **Carimbo:**
documentação, não tela do produto. **A substituição de fato caduco não espera
palavra dela** — é regra da casa.

---

### Z0-10 — As fotos novas entram na documentação *(A3)*

**Arquivos:** `docs/usage/interface.md`; `README.md`; `docs/usage/assets/`.

**O conserto:** o modo `--mesa-vazia` e a segunda foto de Perfis ganham lugar e
legenda. A legenda diz **o que a foto é** e **o que ela não é** — "mesa vazia"
nunca vira "sem rádio" nem "no rádio" (§6).

**A mordida:** o `test_as_fotos_acompanham_a_versao.py` já cobra que toda foto
citada exista; some a isso a busca por PNG novo em `docs/usage/assets/` **sem**
citação no `interface.md`, que hoje ninguém faz. Arranque a citação de uma foto
e veja reprovar.

**Custo:** ~60 linhas, 1 h 30. **Carimbo:** texto novo na documentação →
**ESTRUTURAL** no sentido da D3: **vai para o olho dela junto com o lote do
fechamento**, não depois.

---

### Z0-11 — O lote: uma execução, a leva parada, e o olho dela *(A3, rodada 3)*

**Arquivo:** nenhum de código. É o gesto que fecha a frente.

**O roteiro:**

```sh
export GDK_PIXBUF_MODULE_FILE=/usr/lib/x86_64-linux-gnu/gdk-pixbuf-2.0/2.10.0/loaders.cache
scripts/gui-captura/retratar_abas.py                 # o lote da documentação
scripts/gui-captura/retratar_abas.py --mesa-cheia
scripts/gui-captura/retratar_abas.py --cinco
scripts/gui-captura/retratar_abas.py --mesa-vazia    # novo, Z0-6
git status --porcelain docs/usage/assets/
```

**A condição, e ela não é negociável:** **nenhum agente mexendo na árvore.** O
retrato monta a interface a partir de `app/` e `gui/`; rodá-lo enquanto outra
onda edita esses arquivos produz uma foto de um produto que nunca existiu — é o
erro R2 aplicado à imagem.

**A mordida:** o trinco do Z0-8, mais o portão de frescor do Z0-1, mais o
`PROVA-DA-FOTO.txt` que tem de mudar (o recibo existe justamente porque uma
mudança que não move pixel deixaria o portão vermelho para sempre).

**Custo:** 30 min de execução + o tempo do olho dela. **Carimbo:** **COSMÉTICA
se nenhum pixel do produto mudou** (pré-aprovada, foto DEPOIS em lote); se
alguma foto mudar de desenho, **para tudo** — mudança de desenho é palavra dela
([PROVA-DE-TELA-01](2026-07-27-PROVA-DE-TELA-01-dez-minutos-de-olho-antes-de-qualquer-leva.md)),
não de quem tirou a foto.

---

## 6. O que o Bluetooth bloqueia

A trilha de Bluetooth é **dela com o assistente**, na mesa do specs (D2,
[SPRINT_ORDER §0.7](../SPRINT_ORDER.md)). Esta frente não mede rádio, e a
restrição que ela carrega é diferente da das abas — é sobre **o que a foto pode
ser usada para provar**:

- **Uma foto NUNCA é medição de transporte.** A `readme_sistema.png` imprime
  `controle_conectado transporte=bt jogador=2` e a `readme_configuracoes.png`
  pinta dois cards "Sony · Bluetooth": os dois vêm de fixture. Nenhuma sprint,
  de nenhuma onda, pode citar uma foto como evidência de que algo funciona no
  rádio. **O recibo do Z0-5 existe para tornar isso impossível de confundir.**
- **A foto da mesa vazia (Z0-6) não recebe adjetivo de transporte.** Ela é
  "mesa vazia", nunca "sem rádio" — o estado da §2.1 é *zero DualSense físico
  com três adaptadores presentes*, e traduzir isso para transporte é inventar.
- **Nenhuma legenda nova (Z0-10) afirma o que o mapa não sustenta.** Quem
  responde por transporte é o `mapa-controles.csv` e o portão da **Z6**; a Z0 só
  publica imagem.

**E a contrapartida, que vale a favor dela:** o retrato **nunca fala com o
daemon** — monta a própria interface e a alimenta com dublês, travado por
`tests/unit/test_retrato_das_abas_nao_vaza_dado_real.py`. Nenhuma tarefa desta
frente para o daemon nem escreve no aparelho. **A Z0 é a única frente da Onda 0
que roda a plena velocidade enquanto ela mede Bluetooth** (R3).

---

## 7. As dependências

**Do que a Z0 depende: nada.** É a única frente da Onda 0 sem pré-requisito, e é
de propósito — se a foto esperasse a régua da mesa (Z5) ou o dono do alvo (Z2),
as onze abas continuariam sendo planejadas contra uma imagem de proveniência
desconhecida. Começa no **dia 1**, ao lado da Z6 (§0.2).

**Quem depende da Z0** — copiado da §0.3 e conferido linha a linha:

| onda | como a §0.3 a declara |
|---|---|
| **1 · Configurações** | `Z1, Z5, Z0` |
| **3 · Status** | `Z0, Z2, Z1, Z5, Z6, Z4` |
| **6 · Perfis** | `Z4 (dura), Z7, Z5, Z1, Z0` — *"a foto oficial mostra o editor VAZIO"* (corrigido em §2.3/M7) |
| **7 · Lightbar** | `Z2 (dura), Z3, Z5, Z0, Z6` — *"a foto publicada desta aba é o XML cru"* (caducou em `3de95ff`) |
| **11 · Sistema** | `Z1, Z5, Z6, Z7, Z0` |

**E as outras seis, por R4:** Início, No jogo, Gatilhos, Rumble, Emulação e
Navegação não nomeiam a Z0 na §0.3, mas todas passam pelo mesmo `retratar_abas.py`.
**A foto sai em série com todas.** O trinco do Z0-8 é o que torna essa
dependência visível em vez de folclórica.

---

## 8. O aceite

**O piso é o da tabela §0.2, palavra por palavra.** Abaixo, cada linha dele com
o estado medido em 24/08 e o comando que a fecha.

| a linha do aceite (§0.2) | estado em 24/08 | o que ainda falta |
|---|---|---|
| *"arrancar o host de QUALQUER uma das cinco faz o portão REPROVAR nomeando a aba"* | **FEITO** para as cinco (`test_p10_...`, 4 verdes em 0,93 s) | estender às **onze** — Z0-3 |
| *"a foto da Lightbar deixa de conter 'consultando…'"* | **FEITO** — a imagem traz *"Aceso agora: o desenho do co-op…"* e a prévia com cor | nada |
| *"a da Emulação deixa de conter '045E:028E (Xbox 360)' com máscara DualSense"* | **FEITO na foto** (`054C:0DF2 (DualSense)`), **sem régua** | Z0-4 |
| *"portão novo reprova nome em `NOMES` sem mixin em `MIXINS_DE_ABA` (hoje 3 de 11)"* | **NÃO EXISTE.** A lista tem 3 entradas e o retrato usa 10 mixins | Z0-2 |

**O teto — o que esta sprint acrescenta ao piso:**

```sh
# 1. as réguas mordem (rodada 2 de A2). SÓ o próprio escopo — nunca a suíte inteira (R2)
GDK_PIXBUF_MODULE_FILE=/usr/lib/x86_64-linux-gnu/gdk-pixbuf-2.0/2.10.0/loaders.cache \
xvfb-run -a ./.venv/bin/python -m pytest \
  tests/unit/test_p10_a_foto_nao_publica_o_glade_cru.py \
  tests/unit/test_a_foto_monta_como_o_produto_monta.py \
  tests/unit/test_as_fotos_acompanham_a_versao.py \
  tests/unit/test_retrato_das_abas_nao_vaza_dado_real.py \
  tests/unit/test_a_aba_perfis_na_foto.py \
  tests/unit/test_a_mesa_cheia_na_foto.py \
  tests/unit/test_a_bancada_da_foto_exercita_os_dois_graus.py -q
# hoje, antes da leva: 4 verdes só no F14 (medido em 24/08)

# 2. a substituição foi INTEIRA, não pela metade
grep -rn "Folgada 0/1600" docs/ README.md          # tem de voltar VAZIO
python3 scripts/validar-referencias-docs.py --all
python3 scripts/validar-acentuacao.py --all

# 3. o recibo sabe dizer de onde a foto veio
grep -n "bancada\|fixture\|dublê" docs/usage/assets/PROVA-DA-FOTO.txt

# 4. o lote, com a leva PARADA
scripts/gui-captura/retratar_abas.py && git status --porcelain docs/usage/assets/
```

**As quatro mordidas nomeadas, e nenhuma tarefa fecha sem a sua:**

1. **Z0-1** — repositório com só o retrato mexido depois da foto: régua de hoje
   `None`/verde, régua nova `False`/reprova. *(Já reproduzido em 24/08.)*
2. **Z0-2/Z0-3** — apagar `_montar_aba_inicio` da linha `:2203` do retrato:
   hoje verde, depois reprova **nomeando "Início"**.
3. **Z0-4** — arrancar a escrita do VID:PID de `_montar_aba_emulacao`: hoje
   verde e a foto volta a publicar Xbox; depois reprova nomeando o widget.
4. **Z0-8** — dois ensaios ao mesmo tempo: o segundo recusa **sem gravar byte**;
   sem o trinco, o sha256 de uma foto muda duas vezes no mesmo ensaio.

**E o aceite de olho, que é o único que ela dá:** as onze fotos do lote, mais a
segunda de Perfis e as da mesa vazia, num pedido só, com a pergunta explícita —
*alguma delas mostra uma tela diferente da que você conhece?*

---

## 9. O que fica aberto, e de quem é

1. **O vão vertical das três abas é do produto ou do instrumento?** Medido só na
   imagem: Lightbar ~600 px, Navegação ~450 px, Emulação ~350 px. Em 22/08 um
   vão assim era do instrumento
   — a história inteira está no cabeçalho de
   `tests/unit/test_a_foto_monta_como_o_produto_monta.py`. **Dono: a onda
   da aba**, depois do Z0-11 — e nenhuma delas pode afirmar vão antes disso.
2. **A contradição visível na foto da Navegação:** o interruptor "Emular mouse"
   está DESLIGADO e o rótulo abaixo diz *"Pronto para usar como mouse"*, em
   verde. É F7 puro, achado ao ler a imagem em 24/08. **Dono: Onda 10 ·
   Navegação.** Não é da Z0 — a Z0 só provou que dava para ver.
3. **A foto da aba Sistema publica um caminho feliz que a máquina dela não
   vive** (§2.2/M5). O recibo do Z0-5 conserta a **proveniência**; se a bancada
   sintética deve ou não passar a espelhar o mau caminho é **decisão de produto,
   dela** — hoje a foto ensina o leitor a esperar "funcionando".
4. **O `--mesa-vazia` vai revelar defeito em quantas abas?** A F7 aposta em
   seis. **Ninguém olhou.** A resposta sai no Z0-11 e volta para as ondas de
   aba como achado, não como conserto desta frente.
5. **A ordem das abas.** Conferida hoje contra os `<child type="tab">` do
   `main.glade` e contra as onze fotos: **Início · Status · No jogo · Gatilhos ·
   Lightbar · Rumble · Perfis · Sistema · Emulação · Navegação ·
   Configurações**. Bate com a §0.2. Fica escrito aqui porque foi este fato,
   errado, que custou treze briefings em 23/08 — e a régua barata é a foto, que
   agora existe.

---

## Ver também

- [SPRINT_ORDER §0.1 e §0.2](../SPRINT_ORDER.md) — os defeitos de forma e as oito frentes da Onda 0.
- [ONDE-PARAMOS de 23/08](../2026-08-23-ONDE-PARAMOS-os-defeitos-de-forma-e-a-regencia.md) — o diagnóstico, e o F14 que esta frente termina.
- [COMO-REGER-AGENTES](../COMO-REGER-AGENTES.md) — R1 a R4 e as armadilhas A1 a A6; esta sprint é a cura da A1.
- [COMO-OLHAR-A-TELA](../COMO-OLHAR-A-TELA.md) — como fotografar e medir sem sofrer.
- [COMO-EXECUTAR da aba Configurações](2026-08-21-ABA-CONFIGURACOES/COMO-EXECUTAR.md) — o molde de receita desta casa.
- [LIGHTBAR-COR-DE-CADA-UM-01](2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md), [SISTEMA-O-VIGIA-VIVO-01](2026-08-24-SISTEMA-O-VIGIA-VIVO-01-a-rede-de-seguranca-parada-e-o-conserto-que-nao-conserta.md), [PERFIS-ABRE-O-QUE-GUARDA-01](2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md) — três das cinco ondas que declaram depender desta frente.
