# ONDA 0 · Z2 — O ALVO GANHA DONO-01 — a fita acesa sobre seis abas que a ignoram

**24/08/2026.** Frente **Z2** da **Onda 0** — as invariantes que valem para as
onze abas. Não é aba: é a regra que decide, para cada aba, **se a feature dela
vale POR CONTROLE ou vale para a mesa inteira**.

| | |
|---|---|
| **Grau** | **MEDIDO** em todo o §2.1 e o §2.2 — cada linha traz o comando ou o `arquivo:linha` ao lado, e dois achados foram reproduzidos com o interpretador. **DESENHO** na coreografia, nas tarefas e no custo. |
| **Fecha** | O alvo de edição passa a ter **uma porta só** (`app/alvo_de_edicao.py`), e os seis leitores que ainda entram pela janela migram; o `DESCONHECIDO` deixa de virar escrita global calada nas quatro abas leitoras; um portão impede a volta do campo velho; a fita do cabeçalho e a grade de cards passam a estar na MESMA ordem; a fita para de estar acesa sobre as seis abas onde nada a obedece; e a máscara por jogador ganha o escritor de produção que a **D-K** pediu. |
| **NÃO faz** | **Não conserta aba nenhuma.** Não edita `home_actions.py`, `profiles_actions.py`, `daemon_actions.py`, `emulation_actions.py`, `mouse_actions.py` nem `painel_no_jogo.py` — esses são das Ondas 1 a 11, e o que Z2 tem a dizer sobre eles vira **contrato**, no §5. Não mede rádio (**D2**: a trilha de Bluetooth é dela, §8). Não decide granularidade de feature por jogador — isso é **D-G** e **D-K**, e só a segunda entra aqui. Não mexe no broadcast do backend, que é da **Z3**. |
| **Depende de** | **Z5** (dura — sem uma régua só para quem está na mesa, o alvo não tem domínio: hoje três réguas do mesmo daemon discordam sobre quem está lá). |
| **Quem depende dela** | **Z3** (dura), **Z4**, e nove das onze ondas de aba — a lista com o que muda em cada uma está no §5. |
| **Defeito de forma que cura** | **F3** — *"o alvo tem um escritor e nove leitores por `getattr(..., None)`"* — e **metade da F2**, pela via da **D-K** (a cura escrita e nunca ligada: `set_mask`/`clear_mask`). |
| **Origem** | O F3 de 23/08 criou o módulo dono e **declarou a migração dos leitores como de outra leva**, porque quatro daquelas abas estavam com outras frentes. É essa migração que esta sprint planeja. |

---

## 1. O defeito, em uma frase

**O cabeçalho anuncia "Ajustes vão para: [1][2][3][4]" sobre as onze abas, e em
seis delas não existe uma linha de código que leia essa escolha** — enquanto,
nas quatro que leem, a janela que não sabe quem é o alvo escreve na mesa
inteira sem dizer que não sabia.

---

## 2. O que está medido, e o que é hipótese

### 2.1 Na bancada, agora (24/08, daemon vivo, nada parado, zero byte escrito)

```
$ ls /sys/class/hidraw/ | while read h; do \
    grep HID_NAME /sys/class/hidraw/$h/device/uevent; done
hidraw0/1: Compx 2.4G Wireless Receiver
hidraw2/3: BY Tech Gaming Keyboard
hidraw4:   DualSense Wireless Controller (Hefesto P1)   <- o NOSSO vpad

$ systemctl --user is-active hefesto-dualsense4unix
active

$ .venv/bin/python -c "from hefesto_dualsense4unix.app import ipc_bridge; \
    print(ipc_bridge.daemon_state_full())"
topo:        connected=True   transport=bt
controllers: 1 registro — index=None, connected=False, uniq=ausente,
             player_slot=None, transport=None
coop:        enabled=True, mesa=[]
output_target_index: None
```

**Três fatos, e os três mandam nesta frente:**

1. **CORREÇÃO AO BRIEFING DESTA LEVA.** Ele diz *"2 DualSense no rádio"*. Não
   há **nenhum**: o único nó de DualSense em `/sys/class/hidraw` é o vpad que o
   próprio produto cria. É a mesma correção que a
   [LIGHTBAR-COR-DE-CADA-UM-01](2026-08-24-LIGHTBAR-COR-DE-CADA-UM-01-a-aba-mais-vazia-e-o-aceso-agora-que-nao-volta.md)
   registrou em 23/08. **Nenhum número desta sprint sobre 2 ou 4 controles é
   medição viva** — o que precisa de mesa cheia está marcado no §8/bloco 3.
2. **A F6/Z5 está viva nesta janela.** O topo do `state_full` diz `connected` e
   o registro do controle diz o contrário, no MESMO payload. **É por isso que
   Z2 depende de Z5 e não o inverso:** o alvo é um endereço dentro de um
   domínio, e quem define o domínio é a régua da mesa.
3. **`output_target_index` é `None`.** Com ele nulo, `_sync_edit_target` nunca é
   chamado (`status_actions.py:2263`, a guarda `if target_index is not None`), e
   o único caminho que ainda escreve o alvo é o `_esquecer_edit_target` do ramo
   de mesa vazia (`:2225`). **Este é exatamente o estado em que a cura do F3
   precisa valer — e em que os seis leitores não migrados continuam cegos a
   ela.**

### 2.2 No código, com endereço — o censo do campo velho

**Régua declarada** (não é o `grep` do briefing, que conta comentário como
leitor):

```bash
grep -rn "_edit_target_uniq" src/ | wc -l                       # 23
grep -rn "_edit_target_uniq" src/ | cut -d: -f1 | sort -u | wc -l  # 9
grep -rn 'getattr(\(self\|host\|janela\|self\._host\), *"_edit_target_uniq"' src/
```

| | |
|---|---|
| ocorrências do campo velho em `src/` | **23**, em **9 arquivos** |
| destas, dentro do dono (`app/alvo_de_edicao.py`) | **4** (linhas 5, 6, 26, 54) |
| **fora do dono** — o que o portão da Z2-6 vê | **19, em 8 arquivos** |
| destas, **código** (não comentário) | **8**: 7 leitores por `getattr` + 1 anotação de classe |
| destas, comentário / docstring | **11** |
| leitores por `getattr`, em arquivos distintos | **7 linhas, 6 arquivos** |
| ocorrências do canônico `alvo_de_edicao(self)` | **5**, todas em `status_actions.py` |

**Os sete leitores, um a um** — é a lista que a Z2-1 a Z2-5 migram:

| # | `arquivo:linha` | Aba | O que ele decide |
|---|---|---|---|
| L1 | `app/actions/lightbar_actions.py:266` | 7 · Lightbar | `_edit_uniq()` — o ramo (a)/(b)/(c) de `_aplicar_cor_no_controle` |
| L2 | `app/actions/triggers_actions.py:171` | 4 · Gatilhos | de qual alvo o combo relê o modo (`effective_triggers_for`) |
| L3 | `app/actions/triggers_actions.py:359` | 4 · Gatilhos | se o preset vira override por MAC ou limpa o lado nos overrides |
| L4 | `app/actions/rumble_actions.py:663` | 9 · Rumble | `_rumble_edit_uniq()` — se a intensidade é da peça ou da casa |
| L5 | `app/actions/config/secao_controles.py:733` | 11 · Configurações | qual card da mesa recebe a marca de alvo |
| L6 | `app/textos_de_aplicacao.py:117` | rodapé (todas) | `alvo_fora_da_mesa()` — se o toast diz "guardado" ou "aplicado" |
| L7 | `app/draft_config.py:1630` | escritor do perfil | se o volume do alto-falante vira override da peça |

**A anotação de classe** `_edit_target_uniq: str | None` (`status_actions.py:448`)
é o oitavo ponto de código. Ela é o espelho legado que `alvo_de_edicao._gravar`
escreve (`:173`); o portão da Z2-6 tem de reconhecê-la como legítima ou ela sai.

**M1 — o `None` de L1..L7 ainda carrega as duas coisas que o F3 separou.**
Todos os sete fazem `getattr(..., None)`. O módulo dono já sabe distinguir
`TODOS` de `DESCONHECIDO` (`alvo_de_edicao.py:65-73`), já tem a frase da recusa
pronta (`:102-114`) e já apaga o atributo legado da instância quando não sabe
(`:168-172`). **A cura está escrita e os sete leitores não a chamam** — é a
família F2 no seu caso mais barato de fechar: não falta mecanismo, falta
chamador.

**M2 — a fita e os cards estão em ordens diferentes. MEDIDO, reproduzido.**

```
$ .venv/bin/python - <<'EOF'
from hefesto_dualsense4unix.app.actions.status_actions import StatusActionsMixin as S
mesa = [
    {"index": 0, "uniq": "aa:bb:cc:00:00:22", "player_slot": 2, "transport": "bt", "connected": True},
    {"index": 1, "uniq": "aa:bb:cc:00:00:11", "player_slot": 1, "transport": "bt", "connected": True},
]
print("fita :", [r[0] for r in S._controller_target_rows(mesa)])
print("cards:", S._status_card_keys_for(mesa))
EOF
fita : ['Todos os controles', 'Controle 1 — BT', 'Controle 2 — BT']
cards: [(0, 'aa:bb:cc:00:00:22'), (1, 'aa:bb:cc:00:00:11')]
```

A fita ordena por número de identidade (`_por_numero_de_identidade`,
`status_actions.py:1449-1479` — foi a entrega da
[UI-SELETOR-01](2026-07-25-UI-SELETOR-01-ordem-dos-controles-no-seletor.md)
absorvida pela PLAYER-01). **A grade de cards não ordena nada**
(`_status_card_keys_for:1162-1192` percorre `_connected_controllers` na ordem
de enumeração). Com os dois ligados fora de ordem — o caso normal — **o primeiro
card é o Controle 2 e o primeiro chip é o Controle 1**. A pessoa olha a grade,
conta a posição e clica no chip errado.

**M3 — a fita fica acesa sobre seis abas que não a leem.** A faixa é pendurada
no `header_bar` (`status_actions.py:1592`), que é global à janela. Uma única aba
a esmaece de propósito — a Configurações, por `set_alvo_inativo`
(`app/actions/config/mixin.py:57-82`, chamada de `app/app.py:1184`), com o
motivo escrito na docstring: *"nesta aba a pergunta não tem sentido"*. Cruzando
o censo de L1..L7 com a tira real de onze abas:

| Aba | arquivo | lê o alvo? |
|---|---|---|
| 1 · Início | `home_actions.py` | **não** — as duas ocorrências de `uniq` (`:2442`, `:2488`) são **docstring**, provado por `grep -n uniq` |
| 2 · Status | `status_actions.py` | é a **escritora** |
| 3 · No jogo | `status_actions.py:548-869` | **não** |
| 4 · Gatilhos | `triggers_actions.py` | sim (L2, L3) |
| 5 · Lightbar | `lightbar_actions.py` | sim (L1) |
| 6 · Rumble | `rumble_actions.py` | sim (L4) |
| 7 · Perfis | `profiles_actions.py` | **não** |
| 8 · Sistema | `daemon_actions.py` | **não** |
| 9 · Emulação | `emulation_actions.py` | **não** |
| 10 · Navegação | `mouse_actions.py`, `input_actions.py` | **não** |
| 11 · Configurações | `config/secao_controles.py` | sim (L5), **e esmaece a fita** |

**Seis abas com a fita acesa e nada obedecendo.** Não é o mesmo defeito nas
seis: em Perfis, Emulação e Navegação a pergunta *tem* sentido e ninguém a faz;
em Sistema e Início ela provavelmente **não** tem, e a resposta certa é a da
Configurações — esmaecer com motivo. **Qual é qual é decisão de cada onda de
aba, não desta frente.** O que Z2 entrega é o contrato e a moldura (§5).

**M4 — a máscara por jogador: dois leitores, zero escritores.** É a **D-K**,
literalmente:

```bash
grep -rn "mascara_efetiva\|registro_de_mascaras\|mask_for(" src/ \
  | grep -v subsystems/external_mask.py
src/hefesto_dualsense4unix/integrations/uhid_gamepad.py:1030
src/hefesto_dualsense4unix/integrations/uinput_gamepad.py:419
grep -rn "set_mask\|clear_mask" src/    # só as DEFINIÇÕES, em external_mask.py
grep -rh "def test_" $(grep -rln "set_mask\|clear_mask" tests/) | wc -l   # 28
```

`set_mask` (`daemon/subsystems/external_mask.py:320`) e `clear_mask` (`:366`)
têm **dois leitores de produção**, **zero chamadores de produção** e **28 testes
verdes em 2 arquivos** (`test_external_mask.py`,
`test_mascara_por_jogador_01.py`). O `controller_masks.json` nunca nasceu no
disco dela. **São os testes verdes que mantêm a cura morta viva**, e é por isso
que a mordida da Z2-13 é o molde de toda a família F2.

> **Correção de fato, e ela sai de todos os lugares.** O briefing desta leva e a
> §0.1/F3 do [SPRINT_ORDER](../SPRINT_ORDER.md) falam em **34** testes verdes;
> medido hoje pelo comando acima, são **28**. E a docstring do próprio módulo
> dono (`alvo_de_edicao.py:6` e `:26`) fala em **"nove pontos"** e **"nove
> leitores"**; medido hoje, são **7 leitores por `getattr` em 6 arquivos**.
> **NÃO VERIFICADO** se algum dos dois números já foi verdade antes do F3 — o
> que se substitui é o número, não a decisão que ele acompanha.

**M5 — a recusa existe e não tem consumidor.** `AlvoDeEdicao.recusa()`
(`alvo_de_edicao.py:102-114`) devolve a frase pronta *"Não dá para saber em qual
controle isto entraria — {motivo}. Nada foi alterado."*, com três motivos
distintos (`:60-62`). **Zero chamadores em `src/`**, provado por
`grep -rn "\.recusa()" src/`. É a mesma forma da F1: a verdade está calculada e
não chega à tela.

### 2.3 NÃO VERIFICADO — e continua não verificado

- **Se o tique de 2 Hz realmente para com popup aberto em qualquer aba.** O
  briefing e a §0.1/F3 afirmam isso. O que eu li é a guarda
  `_popup_is_open()` (`status_actions.py:2659-2668`) barrando
  `_render_live_state` (`:2677`) e `_render_slow_state` (`:2688`) — mas
  `_refresh_controller_target_combo` é chamada de outro ponto, e **não segui o
  fio até o fim**. A Z2-0a mede isso primeiro, e a Z2-8 depende do resultado.
- **Se a mesa cheia reproduz M2 na tela.** M2 está provado nas duas funções
  puras; **não foi visto na janela com quatro controles**, porque não há
  controle nenhum na bancada (§2.1/1).
- **Quantos DualSense por rádio a fita pode prometer.** É pergunta de BT dela
  (§8). A fita desenha até quatro chips hoje sem nenhuma ressalva.

---

## 3. POR QUE ESTA FRENTE VEM ANTES DAS ABAS

É a razão da **D1** dela, no caso mais concreto do plano. Cada aba abaixo tem
uma pergunta que **só Z2 responde**, e responder errado é retrabalho garantido:

| Onda · Aba | O que muda por causa de Z2 |
|---|---|
| **7 · Lightbar** | dependência **dura** declarada na sprint dela: o `_edit_uniq` **sai de lá** e passa a vir do dono. O ramo (b) degradado — o que apaga `auto_player_colors` do perfil inteiro — só deixa de disparar quando o leitor distingue `TODOS` de `DESCONHECIDO` |
| **4 · Gatilhos** | dois leitores (L2, L3). Sem Z2, o preset gravado com a janela sem alvo limpa o lado editado dos overrides por MAC de todo mundo |
| **9 · Rumble** | L4. A **D-G** dela (rótulo honesto agora, granularidade depois) só tem onde pousar se a aba souber a diferença entre "ela escolheu Todos" e "eu não sei" |
| **11 · Configurações** | L5, e é a única que **se desqualifica de propósito** — por isso é o molde da moldura que as outras cinco vão copiar (§5) |
| **1 · Início** | as duas ocorrências de `uniq` são comentário. Se a máscara é por jogador (**D-K**), esta aba precisa de um leitor; se não é, precisa esmaecer a fita com motivo. **A decisão é da D-K, e ela cai nesta frente** |
| **9 · Emulação** | mesmo par: a máscara tem cinco donos e a aba aplica na hora (**D-B**). Sem o contrato de alvo, o quinto dono nasce aqui |
| **6 · Perfis** | o escritor do perfil é L7. **Z4 depende de Z2** por este fio: o applier pula `controllers: None`, e quem decide se há `controllers` é o alvo |
| **3 · No jogo** e **8 · Sistema** | herdam a fita acesa sem leitor; a moldura do §5 diz o que fazer sem tocar no arquivo delas |
| **10 · Navegação** | o "alvo por jogador" está fora da 0.9.5 pela **D-J**. Z2 é quem torna essa exclusão declarável em vez de silenciosa |

E o inverso, que é o custo de **não** rodar Z2 primeiro: seis abas escrevendo
seis versões de `getattr(self, "_edit_target_uniq", None)` — que é exatamente
como o campo velho chegou a 19 ocorrências fora do dono.

---

## 4. A COREOGRAFIA DOS AGENTES

**Seis agentes** — o número da linha Z2 na §0.2 do
[SPRINT_ORDER](../SPRINT_ORDER.md). Regras do
[COMO-REGER-AGENTES](../COMO-REGER-AGENTES.md) valendo inteiras: **R1** (posse
de arquivo), **R2** (a suíte é de quem coordena), **R3** (a bancada é dela
durante a medição), **R4** (foto e portão no fim).

### Rodada 0 — dois batedores em paralelo, NADA de código

| agente | faixa | devolve |
|---|---|---|
| **Z2-A — o dono do módulo e do portão** | `app/alvo_de_edicao.py`, `app/actions/status_actions.py` **só para leitura**, `tests/unit/test_p3_alvo_sem_dono.py` | (1) o fio do tique: `_refresh_controller_target_combo` roda ou não com popup aberto — **com o `arquivo:linha` de cada salto**, porque é a hipótese aberta do §2.3; (2) para cada um dos 11 comentários que citam o campo velho, se ele descreve a árvore de hoje ou caducou; (3) se a anotação de classe `:448` pode sair sem quebrar o espelho de `_gravar` |
| **Z2-F — o dono da máscara e das mordidas** | `daemon/subsystems/external_mask.py`, `daemon/lifecycle.py`, `integrations/uhid_gamepad.py`, `integrations/uinput_gamepad.py`, `tests/unit/test_external_mask.py`, `tests/unit/test_mascara_por_jogador_01.py` | para cada um dos 28 testes: ele **morde** (arrancar a cura reprova) ou é verde decorativo? E o ponto exato onde um escritor de produção entraria — `_gravar_mascara_do_perfil` (`lifecycle.py:2746`) grava a máscara GLOBAL do perfil; a por jogador precisa de um irmão, e o relatório diz onde |

**Portão de replanejamento.** Quem orquestra relê Z2-1..Z2-13 à luz dos dois
relatórios **antes** de disparar a rodada 1. Tarefa derrubada sai com nota
datada; achado novo entra numerado.

### Rodada 1 — quatro agentes em paralelo, faixas disjuntas

| agente | tarefas | posse (exclusiva) |
|---|---|---|
| **Z2-B — o dono das três abas leitoras** | Z2-1, Z2-2 | `app/actions/lightbar_actions.py`, `app/actions/triggers_actions.py`, `app/actions/rumble_actions.py` |
| **Z2-C — o dono do rodapé e do perfil** | Z2-3, Z2-4 | `app/textos_de_aplicacao.py`, `app/draft_config.py` |
| **Z2-D — o dono da Configurações** | Z2-5 | `app/actions/config/secao_controles.py`, `app/actions/config/mixin.py` |
| **Z2-F — o dono da máscara** | Z2-12, Z2-13 | a faixa da rodada 0, mais `tests/unit/` para os arquivos que ele criar |

**Colisão nomeada, e a regra que a resolve.** Z2-B toca `lightbar_actions.py` e
`triggers_actions.py`, que são a faixa das Ondas 7 e 8. **As Ondas 7 e 8 não
podem correr enquanto a rodada 1 estiver aberta** — está declarado nas duas
sprints como dependência dura de Z2. Se alguma delas já estiver em curso, Z2-B
espera e **diz que está esperando** (R3 aplicada a arquivo em vez de bancada).

### Rodada 2 — em SÉRIE, na faixa `status_actions.py`

| agente | tarefas |
|---|---|
| **Z2-E — o dono da Status** | Z2-7, e **depois** Z2-8 |

**Série, e sozinho.** `status_actions.py` tem 2917 linhas e é o arquivo que a
Onda 3 · Status e a Onda 4 · No jogo disputam (F5). Enquanto Z2-E estiver
aberto, **nenhuma das duas roda** — e Z2-E não toca `:548-869`, que é a metade
da aba No jogo.

### Rodada 3 — o portão e o fechamento

| agente | tarefas |
|---|---|
| **Z2-A — o dono do portão** | Z2-6, e **depois** Z2-9, Z2-10, Z2-11 |

O portão vem **por último de propósito**: ele nasce reprovando 8 arquivos
(§2.2), e com as rodadas 1 e 2 fechadas ele nasce reprovando só o que ficou.
Rodá-lo antes produz uma lista de exceções que alguém teria de apagar depois —
que é como uma allowlist vira permanente.

**Quem coordena** roda a suíte inteira uma vez, no fim, com a leva parada (R2), e
`scripts/gui-captura/retratar_abas.py` depois disso (R4). Nenhum agente
fotografa.

---

## 5. O CONTRATO QUE Z2 ENTREGA ÀS ONZE ABAS

**É a entrega mais importante desta frente e não é código de aba nenhuma.** Uma
página curta, escrita por Z2-A na Z2-11, que cada onda de aba consome:

1. **Quem quer saber o alvo chama `alvo_de_edicao(self)`.** Nunca `getattr`.
2. **Três estados, três respostas:** `CONTROLE` → escreve no override por MAC;
   `TODOS` → escreve global, como sempre; `DESCONHECIDO` → **não escreve**, e
   mostra `alvo.recusa()`.
3. **Aba para quem a pergunta não faz sentido chama `set_alvo_inativo(True)`**,
   no molde da Configurações (`config/mixin.py:57`), e **escreve o motivo na
   docstring** — porque foi a docstring que provou, nesta sprint, que aquela aba
   se desqualificou de propósito e não por esquecimento.
4. **Aba que ganha widget de escolha novo declara em qual dos três ele cai.** É o
   mesmo formato da matriz da Z4 para o perfil.

Nenhum dos quatro itens edita arquivo de aba. Os seis arquivos das seis abas que
não obedecem continuam **fechados a Z2** (R1) — quem os abre é a onda dona.

---

## 6. AS TAREFAS

**Treze.** Duas de auditoria, onze de execução.

---

### Z2-0a — O fio do tique, e os onze comentários *(Z2-A)*

**Arquivos:** os da rodada 0. **Nenhuma linha escrita em produto.**
**A mordida:** não se aplica — é medição. O que a substitui: **todo achado vem
com `arquivo:linha` e com o comando que o produziu**; e o fio do tique vem como
sequência de saltos, não como conclusão. Achado sem endereço é descartado na
leitura.
**Custo:** ~1 h 30. **Carimbo:** não toca a tela.

---

### Z2-0b — As 28 provas da máscara: quais mordem *(Z2-F)*

**Arquivos:** os da rodada 0. **Nenhuma linha escrita.**
**A mordida:** não se aplica. O que a substitui: para **cada** um dos 28 testes,
o resultado de arrancar a cura que ele testa. Teste que passa com a cura fora
entra numa lista própria — é ele que mantém a cura morta viva.
**Custo:** ~2 h. **Carimbo:** não toca a tela.

---

### Z2-1 — Lightbar, Gatilhos e Rumble perguntam ao dono *(Z2-B)*

**Arquivos:** `app/actions/lightbar_actions.py:259-266`,
`app/actions/triggers_actions.py:171` e `:359`,
`app/actions/rumble_actions.py:654-663`.

**O conserto:** os quatro leitores L1..L4 passam a chamar `alvo_de_edicao(self)`.
Os três métodos-fachada (`_edit_uniq`, `_rumble_edit_uniq` e o `getattr` inline
do L2) devolvem o `AlvoDeEdicao`, não mais `str | None`. Onde hoje se testa
`if uniq is None`, passa-se a testar `alvo.global_` — e o caso
`alvo.desconhecido` ganha um ramo próprio que **não escreve**.

Isto mata, de uma vez, o ramo (b) degradado da Lightbar
(`lightbar_actions.py:668-693`) que a sprint da Onda 7 descreve como *"um clique
de cor apaga `auto_player_colors` do perfil dela"*: ele deixa de ser alcançável,
porque `DESCONHECIDO` não chega mais lá.

**A mordida:** monte o host das três abas **sem o mixin da Status** — a
`alvo_de_edicao()` devolve `DESCONHECIDO` porque o atributo não existe na
instância (`alvo_de_edicao.py:131-132`, e é para isso que o default de classe
saiu). Dispare o gesto de cada aba (arrastar o brilho, gravar um preset, mudar a
intensidade) e exija **zero escrita no rascunho e zero IPC**. Arranque o ramo de
`desconhecido` de qualquer uma das três: o teste tem de reprovar mostrando que a
escrita **global** aconteceu. Hoje ela acontece e nada reprova.
**Custo:** ~70 linhas em produto, ~120 em teste; 4 h.
**Carimbo:** **cosmética, PRÉ-APROVADA** — nenhum texto novo nasce aqui; a
frase da recusa é da Z2-2.

---

### Z2-2 — A recusa chega à tela nas três abas *(Z2-B)*

**Arquivos:** os mesmos da Z2-1, nos pontos de toast.

**O conserto:** `alvo.recusa()` (`alvo_de_edicao.py:102-114`) ganha os seus
primeiros chamadores. A frase já existe pronta, com três motivos distintos
(`:60-62`) — **nenhum texto novo precisa ser inventado**, o que a torna a
tarefa mais barata desta frente. É a metade F1 dentro da F3: a verdade estava
calculada e morria no `getattr`.

A assimetria que prova que é defeito e não desenho está **dentro da própria
Lightbar**: a metade das 5 luzes já recusa este caso com frase própria
(`lightbar_actions.py:965-967`, `_AVISO_SEM_DESTINATARIO`); a metade da cor
degrada em silêncio.

**A mordida:** o mesmo host sem Status da Z2-1; depois do gesto, exija que o
texto lido do toast contenha o motivo (`MOTIVO_MESA_VAZIA` ou
`MOTIVO_SEM_ESTADO`). Arranque a chamada a `recusa()`: o teste reprova porque a
tela ficou **muda**, que é o estado de hoje. Régua: o texto lido do widget
depois da montagem, no molde do `test_a_mesa_cheia_na_foto.py` — **não** OCR.
**Custo:** ~30 linhas, 1 h 30.
**Carimbo:** **estrutural — espera o olho dela.** O texto já foi escrito no
módulo em 23/08, mas **nunca apareceu numa tela**; vai no lote de redação junto
com a Z2-8.

---

### Z2-3 — O rodapé para de chamar de "guardado" o que não tem alvo *(Z2-C)*

**Arquivos:** `app/textos_de_aplicacao.py:85-127` (`alvo_fora_da_mesa`), e os
quatro consumidores dela (`lightbar_actions.py:717`, `:813`, `:1160`,
`triggers_actions.py:695`) **em leitura apenas** — a assinatura não muda.

**O conserto:** a função troca o `getattr` do `:117` por `alvo_de_edicao(host)`.
Hoje ela devolve `None` — *"Todos: a escrita é global, não há alvo a guardar"* —
tanto para o clique deliberado em "Todos" quanto para a janela que não sabe. São
duas frases diferentes: no primeiro caso o toast está certo; no segundo, ele
afirma sucesso sobre um gesto que não devia ter acontecido.

A própria docstring do `:105-116` documenta em detalhe uma análise que a
existência do módulo dono tornou obsoleta (*"`_edit_target_uniq` só é escrito em
dois lugares"* — hoje quem escreve é `alvo_de_edicao._gravar`). **Fato errado se
substitui:** a docstring é reescrita, não anotada.

**A mordida:** host com `esquecer_alvo(host, MOTIVO_MESA_VAZIA)` aplicado e mapa
de conectados vazio; exija que a função devolva o sinal de "não sei" e **não**
`None`. Arranque a distinção: o teste reprova porque o toast voltou a dizer
"guardado". Cobre os dois lados (A2 do COMO-REGER-AGENTES: o dublê tem de saber
recusar) — o clique legítimo em "Todos" continua devolvendo `None`.
**Custo:** ~35 linhas, 2 h. **Carimbo:** **cosmética, PRÉ-APROVADA** (a frase
nova é a da Z2-2, já no lote dela).

---

### Z2-4 — O escritor do perfil migra *(Z2-C)*

**Arquivos:** `app/draft_config.py:1595-1645`.

**O conserto:** L7 (`:1630`) passa pelo dono. Aqui o `DESCONHECIDO` tem uma
consequência específica e cara: com ele, o código cai no ramo global
(`:1645`, `with_speaker`), que **escreve na seção global do perfil**. É o mesmo
formato do estrago da Lightbar, num campo diferente.

A docstring do `:1601-1602` afirma que Lightbar, Gatilhos e Rumble *"já
obedecem"* ao campo velho — verdade hoje, e **falsa depois da Z2-1**. Ela é
reescrita para citar o dono, não o campo.

**A mordida:** `DraftConfig` limpo, host sem alvo, chamar o registrador de
volume com um `uniq` de card; exija **draft inalterado**. Hoje ele grava na
seção global. Arranque a guarda e o teste reprova ao ver a seção global escrita.
Faixa sintética da casa nos MACs: `aa:bb:cc:00:00:11`.
**Custo:** ~25 linhas, 1 h 30. **Carimbo:** não toca a tela.

---

### Z2-5 — A Configurações migra, e a moldura vira lei *(Z2-D)*

**Arquivos:** `app/actions/config/secao_controles.py:733`,
`app/actions/config/mixin.py:57-82`.

**O conserto:** duas coisas, e a segunda é a que vale para as outras dez abas.
(1) L5 passa pelo dono — com `DESCONHECIDO`, **nenhum card recebe a marca de
alvo**, em vez de todos receberem a marca do `None`. (2) `set_alvo_inativo`
ganha um segundo parâmetro `motivo: str`, guardado (não pintado — a decisão dela
de 23/08 de que *"o cabeçalho não ganha nada"* fica de pé, e está escrita na
própria docstring). O motivo guardado é o que o portão da Z2-9 lê.

**A mordida:** host de Configurações com alvo `DESCONHECIDO` e três cards na
mesa; exija zero marcas de alvo. Arranque e o teste reprova ao ver as três.
Para a moldura: chamar `set_alvo_inativo(True)` sem motivo tem de levantar —
e o teste do `config_01` que já mede *"o cabeçalho não ganha widget"*
(`tests/unit/test_config_01_a_aba_nasce_vazia.py:311`) tem de continuar verde,
provando que o motivo não virou pintura.
**Custo:** ~40 linhas, 2 h. **Carimbo:** **cosmética, PRÉ-APROVADA** — nada
muda no que se vê.

---

### Z2-6 — O portão nasce reprovando *(Z2-A)*

**Arquivos:** `scripts/portao_alvo_tem_dono.py` (novo), mais a linha dele na  <!-- ref-externa: arquivo a CRIAR por esta entrega, ainda não existe -->
lista de portões do `CLAUDE.md` e no CI.

**O conserto:** o portão reprova `_edit_target_uniq` em qualquer arquivo de
`src/` que não seja `app/alvo_de_edicao.py`, **inclusive em comentário** — pela
razão medida no §2.2: 11 das 19 ocorrências fora do dono são comentário, e são
elas que ensinam o próximo agente a escrever o `getattr` de novo.

**Duas exceções declaradas, e nenhuma allowlist além destas:** a anotação de
classe `status_actions.py:448`, se a Z2-0a disser que ela não pode sair; e o
próprio arquivo do portão. Exceção nova exige linha de justificativa no fonte
do portão.

**A mordida:** o portão roda contra a árvore de **hoje** e reprova **8 arquivos
com 19 ocorrências** (o número exato do §2.2, e é o que a Z2-A confere primeiro).
Depois das rodadas 1 e 2 ele fica verde. Então: **devolva o `getattr` do
`lightbar_actions.py:266`** e ele tem de reprovar nomeando arquivo e linha.
Portão que não reprova quando o defeito volta é decorativo, e esta casa já
provou três verdes cegos por mordida (F9).
**Custo:** ~90 linhas, 3 h. **Carimbo:** não toca a tela.

---

### Z2-7 — A fita e os cards na MESMA ordem *(Z2-E)*

**Arquivos:** `app/actions/status_actions.py:1162-1192`
(`_status_card_keys_for`) e `:1449-1479` (`_por_numero_de_identidade`).

**O conserto:** a grade de cards passa a percorrer `_por_numero_de_identidade`,
que já existe, já é estável e já resolve o desempate de quem não tem
`player_slot` (vai para o fim, `sorted` estável). **Nenhuma função nova nasce** —
é a mesma correção que a UI-SELETOR-01 fez no seletor em 25/07, aplicada ao
outro lado da janela. O `index` de enumeração continua viajando dentro de cada
chave, pelo motivo que a docstring do `:1495-1498` já explica: reordenar o
índice junto seria um defeito pior.

**A mordida:** é o teste que a linha Z2 da §0.2 nomeia. Duas entradas com
`player_slot` 2 e 1 nessa ordem de enumeração (o cenário reproduzido em §2.2/M2);
exija que a ordem dos rótulos dos cards seja **igual** à ordem dos rótulos da
fita. **Ele reprova hoje** — está provado acima, com o comando. Arranque a
ordenação e ele volta a reprovar.
**Custo:** ~15 linhas em produto, ~50 em teste; 2 h.
**Carimbo:** **estrutural — espera o olho dela.** Muda a ordem do que ela vê ao
abrir a aba Status. Vai no lote com a Z2-2 e a Z2-8.

---

### Z2-8 — A fita para de mandar em quem não a obedece *(Z2-E)*

**Arquivos:** `app/actions/status_actions.py:1759-1777`
(`_set_target_strip_visible`), `app/app.py:1181-1190` (o laço de troca de aba).

**O conserto:** a mesma mecânica que a Configurações já usa
(`set_alvo_inativo`), generalizada: o laço de troca de aba consulta um mapa
declarado — **qual aba lê o alvo** — e esmaece a fita nas que não leem, com o
motivo guardado (Z2-5). O mapa nasce com as quatro leitoras de hoje; **cada onda
de aba que ligar um leitor acrescenta a sua linha**, e é por isso que este mapa
é o instrumento e não o conserto.

**Esmaecer, nunca esconder** — a razão está medida e escrita na docstring da
Configurações: sumir com a fita faria o cabeçalho pular de altura a cada troca
de aba.

**O que esta tarefa NÃO decide:** se Perfis, Emulação e Navegação **deviam** ler
o alvo. Elas nascem esmaecidas porque hoje não leem; ligar um leitor é da onda
delas, e o §5 diz como.

**A mordida:** monte a janela, troque para a aba Perfis e exija a fita
insensível; troque para a Lightbar e exija sensível. Arranque a consulta ao
mapa: o teste reprova mostrando a fita acesa sobre a Perfis. E: **tirar uma aba
do mapa reprova nomeando a aba** — mesmo formato do `_REFRESH_POR_ABA` da Z5.
**Custo:** ~55 linhas, 3 h.
**Carimbo:** **estrutural — espera o olho dela.** Muda o que ela vê ao abrir
seis abas.

---

### Z2-9 — O portão da moldura: aba nova declara em qual estado cai *(Z2-A)*

**Arquivos:** `scripts/portao_alvo_tem_dono.py` (a segunda régua dentro do  <!-- ref-externa: arquivo a CRIAR por esta entrega, ainda não existe -->
mesmo portão).

**O conserto:** a régua da moldura do §5, item 4. Todo módulo de aba em
`app/actions/` está ou no mapa da Z2-8 (lê o alvo) ou declarado inerte com
motivo. Módulo que não está em lugar nenhum reprova.

**A mordida:** acrescente um módulo de aba de mentira, sem declaração; o portão
reprova nomeando-o. Tire uma das declarações existentes; reprova nomeando a
aba. Régua validada contra respostas conhecidas antes de valer (A5): rode-a
contra as **quatro** abas que hoje leem e as **sete** que não — se ela não
separar as duas listas exatamente assim, é a régua que está errada.
**Custo:** ~50 linhas, 2 h. **Carimbo:** não toca a tela.

---

### Z2-10 — Os onze comentários caducos *(Z2-A)*

**Arquivos:** `integrations/sinal_da_barra.py:208` e `:666`,
`app/textos_de_aplicacao.py:90` e `:105`, `app/draft_config.py:1602`,
`app/actions/lightbar_actions.py:263`, `app/actions/rumble_actions.py:657`,
`app/actions/status_actions.py:433`, `:440`, `:461`, `:2237`.

**O conserto:** cada um cita o campo velho como se ele fosse o dono. Depois das
rodadas 1 e 2 nenhum descreve a árvore. Pela régua da casa: **o que é fato
errado sai; o que é decisão medida fica com data.** A auditoria da Z2-0a diz
qual é qual, um a um — e a maioria é fato, não decisão: o comentário do
`status_actions.py:440` explica por que o `getattr` *"nunca caía"*, que é
história de um campo que deixou de existir.

**Os quatro do `status_actions.py` são de Z2-E, não de Z2-A** (posse de
arquivo). Z2-A **relata** e Z2-E aplica na rodada 2, ou eles ficam para a
rodada 3 com o arquivo já livre.

**A mordida:** o portão da Z2-6, que vê comentário. Com esta tarefa feita, ele
fica verde; sem ela, reprova. **É a mordida da tarefa e a prova de que o portão
não é decorativo — os dois pelo mesmo comando.**
**Custo:** ~40 linhas removidas ou reescritas, 1 h 30.
**Carimbo:** não toca a tela.

---

### Z2-11 — O contrato, e os dois números errados *(Z2-A)*

**Arquivos:** `app/alvo_de_edicao.py` (docstring do módulo, `:1-42`), e a página
de contrato do §5 — que mora **na docstring do módulo**, não num arquivo novo.
Mais a linha de F3 na §0.1 do [SPRINT_ORDER](../SPRINT_ORDER.md).

**O conserto:** (1) o contrato do §5, com os quatro itens; (2) **"nove pontos" e
"nove leitores"** (`:6`, `:26`) saem, substituídos pelo número medido, **com o
comando ao lado**; (3) **"34 testes verdes"** da F3 vira **28**, com o comando —
e sai também de qualquer outro lugar onde apareça, que é o que a regra dela de
21/08 exige. A frase *"migrá-los é de outra leva"* (`:26`) ganha nota datada:
**a leva é esta**.

**A mordida:** um teste que lê o número da docstring e o compara com a contagem
real feita por AST sobre `src/`. Trocar o número por outro faz reprovar.
É o mesmo formato do portão de caducos da Z6, aplicado a um módulo — e o motivo
é o da §0.10: número publicado sem régua ao lado volta errado.
**Custo:** ~60 linhas, 2 h. **Carimbo:** não toca a tela.

---

### Z2-12 — A máscara por jogador ganha escritor de produção *(Z2-F)*

É a **D-K** dela, ramo *"LIGAR"*. **Se ela decidir caducar, esta tarefa e a
Z2-13 saem juntas, por escrito, e os 28 testes vão junto** — o que a D-K proíbe
é o meio-termo.

**Arquivos:** `daemon/lifecycle.py` (o irmão por jogador de
`_gravar_mascara_do_perfil`, `:2746`), `daemon/subsystems/external_mask.py`
apenas se o batedor Z2-0b apontar ajuste.

**O conserto:** o ponto onde o produto já sabe que **um perfil pediu uma
máscara** passa a saber também **para qual controle** — e chama `set_mask` /
`clear_mask`. É a única cadeia por onde touchpad, giroscópio e acelerômetro
chegam ao jogo por jogador (a via da MÁSCARA, **D-A**), e sem ela a D-A não tem
onde pousar.

As três guardas de `_gravar_mascara_do_perfil` continuam valendo literalmente, e
a nota datada da R-07 que a docstring do `:2760-2772` carrega **não se apaga**:
o eixo do liga/desliga fica inteiro na R-07.

**A mordida:** perfil que pede máscara para um `uniq`; depois de aplicar, exija
`registro_de_mascaras().mask_for(uniq)` igual ao pedido, e o
`controller_masks.json` no disco. Arranque a chamada: reprova. **E o inverso, que
é onde o dublê tem de saber recusar (A2):** perfil sem opinião de máscara não
escreve nada — a guarda `if not flavor: return` do `:2785` sobrevive.
**Custo:** ~45 linhas em produto, ~90 em teste; 4 h.
**Carimbo:** não toca a tela nesta frente. O texto que anuncia a máscara por
jogador é da Onda 2 · Início e da Onda 5 · Emulação, e **as duas dependem
disto**.

---

### Z2-13 — O teste que exige chamador de PRODUÇÃO *(Z2-F)*

**A tarefa mais importante desta sprint para além dela mesma.** A linha Z2 da
§0.2 diz: *"é o formato da mordida que falta em toda a família F2"*.

**Arquivos:** `tests/unit/test_a_cura_tem_chamador_de_producao.py` (novo).  <!-- ref-externa: arquivo a CRIAR por esta entrega, ainda não existe -->

**O conserto:** um teste que, por AST sobre `src/`, exige que `set_mask` e
`clear_mask` tenham pelo menos um chamador **fora de `daemon/subsystems/` e fora
de `tests/`**. Nada de `grep` textual: a régua desta casa já mentiu por casar
token em qualquer lugar do texto (§0.10 do SPRINT_ORDER), e o portão do
`code-review-graph` reprovou como instrumento porque **não achou nenhuma das
três funções que se sabia sem chamador** (A5).

**A mordida, e ela é dupla:**
1. **Ele reprova HOJE**, contra a árvore de agora, antes da Z2-12. Se não
   reprovar, é a régua que está errada — valide-a antes contra um conjunto de
   respostas conhecidas: `mascara_efetiva` (tem dois chamadores, tem de passar) e
   `suspend_vpads_for_steam_input` (não tem nenhum, tem de reprovar).
2. Depois da Z2-12 ele fica verde; arranque o chamador novo e ele volta a
   reprovar nomeando a função.

**Custo:** ~110 linhas, 3 h. **Carimbo:** não toca a tela.

---

## 7. O CUSTO, SOMADO

| | |
|---|---|
| auditoria (Z2-0a, Z2-0b) | 3 h 30 |
| execução (Z2-1 a Z2-13) | ~30 h |
| linhas em produto | ~370 |
| linhas em teste e portão | ~520 |
| tarefas com carimbo **estrutural** | **três** — Z2-2, Z2-7 e Z2-8, e as três vão no MESMO lote ao olho dela |
| tarefas **cosméticas, pré-aprovadas** | três — Z2-1, Z2-3, Z2-5 |
| tarefas que não tocam a tela | sete |

---

## 8. O QUE O BLUETOOTH BLOQUEIA

**D2: a trilha de rádio é dela com o assistente, na mesa do specs.** O que esta
frente **não pode afirmar na tela** até a medição dela existir:

| Bloco | O que Z2 não pode afirmar | Onde a pergunta mora |
|---|---|---|
| **1 · a fita promete quatro** | *"Ajustes vão para: [1][2][3][4]"* desenha até quatro chips sem qualificar transporte. **Quantos DualSense por rádio o produto sustenta, e com quantos adaptadores, não foi medido** — `slot_jogador` é `inferido-do-codigo` no mapa. A Z2-8 não acrescenta ressalva; ela apenas para de acender a fita onde ninguém obedece | `QUATRO-NO-RADIO-01`, `DOIS-CAIRAM-DE-UMA-VEZ-01` (§0.7 do SPRINT_ORDER) |
| **2 · a recusa não vira promessa** | a frase da Z2-2 diz *"nada foi alterado"* — o que é verdade sobre o rascunho. **Ela não pode dizer que o efeito chegou ou deixou de chegar ao aparelho**, porque isso é afirmação de transporte, e a Z6 é a dona da régua que a sustentaria | `PAREAMENTO-01` (frente Z6) |
| **3 · a máscara por jogador no rádio** | a Z2-12 liga o escritor. **O que a máscara carrega — touchpad, giroscópio, acelerômetro — está no mapa como `movimento.imu.ligar` e `toque.touchpad.escrita` = `não/não`**, e nenhuma tela pode prometer os três por rádio até que isso mude. É a mesma ressalva que a Onda 5 · Emulação carrega | `BT-E-VPAD-01`, `BT-FURO-FINO-01` |
| **4 · a ordem dos cards com mesa cheia** | a Z2-7 está provada nas funções puras e **não foi vista na janela com quatro controles**, porque a bancada tem zero. A conferência final precisa da mesa dela | é bancada, não protocolo — entra no lote de olho dela |

---

## 9. AS DEPENDÊNCIAS

**Z2 depende de — e não começa sem:**

- **Z5, dura.** O alvo é um endereço dentro de um domínio; quem define o domínio
  é a régua da mesa. Está medido no §2.1/2 que hoje o mesmo payload se
  contradiz. Se a Z2-1 rodar antes da Z5, `DESCONHECIDO` e `TODOS` passam a ser
  distinguidos sobre uma lista de conectados em que três réguas discordam — e o
  ganho vira loteria.

**Depende de Z2 — e não fecha sem ela:**

| Quem | Grau | O fio |
|---|---|---|
| **Z3 — broadcast proibido** | dura | *"Depende de Z2"*, §0.2. O alvo que sai da mesa só deixa de virar broadcast quando existe um estado que diz "não sei" |
| **Z4 — o perfil guarda tudo** | dura | *"Depende de Z2 e Z5"*, §0.2. O applier pula `controllers: None`, e quem decide se há `controllers` é o alvo (L7) |
| **Onda 7 · Lightbar** | dura | *"o `_edit_uniq` sai daqui"* |
| **Onda 8 · Gatilhos** | declarada | L2 e L3 |
| **Onda 9 · Rumble** | declarada | L4, e a D-G pousa aqui |
| **Onda 2 · Início**, **Onda 5 · Emulação** | declarada | as duas dependem da Z2-12 para poder falar de máscara por jogador |
| **Onda 6 · Perfis**, **Onda 10 · Navegação** | declarada | herdam a moldura do §5 |
| **Onda 1 · Configurações** | **NÃO depende** | ela se desqualifica do alvo de propósito, e é por isso que é o molde a copiar — está escrito na §0.3 |

---

## 10. O ACEITE

**O piso é o da linha Z2 na §0.2 do [SPRINT_ORDER](../SPRINT_ORDER.md), e ele
está inteiro aqui.** O que esta sprint acrescenta está marcado com **+**.

| # | O que morde | Onde | Comando |
|---|---|---|---|
| **1** | montar o host **sem o mixin da Status** faz as **quatro abas leitoras REPROVAREM** em vez de virarem globais em silêncio | Z2-1, Z2-5 | `.venv/bin/python -m pytest -q tests/unit/test_p3_alvo_sem_dono.py tests/unit/test_z2_abas_leitoras_recusam.py` |
| **2** | o portão que reprova `_edit_target_uniq` fora de `app/alvo_de_edicao.py` **nasce reprovando 8 arquivos, 19 ocorrências** — e devolver o `getattr` do `lightbar_actions.py:266` o faz reprovar de novo | Z2-6, Z2-10 | `.venv/bin/python scripts/portao_alvo_tem_dono.py` |
| **3** | um teste **trava a ORDEM dos cards contra a ordem da fita**, e **reprova hoje** | Z2-7 | `.venv/bin/python -m pytest -q tests/unit/test_z2_ordem_dos_cards.py` |
| **4** | um teste exige **chamador de PRODUÇÃO** para `set_mask`/`clear_mask`, e **reprova hoje** | Z2-12, Z2-13 | `.venv/bin/python -m pytest -q tests/unit/test_a_cura_tem_chamador_de_producao.py` |
| **+5** | a frase de recusa **aparece numa tela** — hoje ela existe no módulo e tem zero chamadores | Z2-2 | `grep -rn "\.recusa()" src/` deixa de ser vazio; o teste lê o texto do widget |
| **+6** | **tirar uma aba do mapa da fita reprova nomeando a aba** | Z2-8, Z2-9 | `.venv/bin/python -m pytest -q tests/unit/test_z2_fita_declara_quem_obedece.py` |
| **+7** | os dois números errados saíram de **todos** os lugares — e um teste os mantém sob régua | Z2-11 | `grep -rn "nove leitores\|nove pontos\|34 testes" src/ docs/` volta vazio |

**Antes de fechar a leva** (quem coordena, com a árvore parada — R2 e R4):

```bash
git add -A
.venv/bin/python -m pytest -q
.venv/bin/ruff check src/ tests/
python3 scripts/validar-acentuacao.py --all
python3 scripts/validar-glifos.py --all
python3 scripts/validar-referencias-docs.py --all
bash scripts/check_anonymity.sh
.venv/bin/python scripts/check_version_consistency.py
.venv/bin/mypy src/hefesto_dualsense4unix
.venv/bin/python scripts/portao_alvo_tem_dono.py
scripts/gui-captura/retratar_abas.py     # e o lote de fotos vai ao olho dela
```

---

## 11. O QUE FICA ABERTO, E DE QUEM É

### Dela

1. **A D-K, e ela é o portão da Z2-12 e da Z2-13.** *Ligar o escritor da máscara
   por jogador, ou caducar por escrito?* A recomendação da §0.9 é **ligar**; o
   custo do outro lado é apagar 28 provas de um mecanismo que não vai existir.
   **Enquanto ela não responder, as duas tarefas ficam em suspenso** — e o
   meio-termo de hoje é o defeito mais caro desta casa.
   ([DECISOES-ABERTAS](2026-08-21-ABA-CONFIGURACOES/DECISOES-ABERTAS.md) é o
   molde do formato.)
2. **O lote de três telas estruturais** — a frase de recusa (Z2-2), a nova ordem
   dos cards (Z2-7) e a fita esmaecida em seis abas (Z2-8). Vão juntas, com foto
   antes e depois, pela **D3**.
3. **A conferência da Z2-7 com a mesa cheia.** Está provada nas funções puras e
   não na janela, porque a bancada tem zero DualSense (§2.1/1). São dois
   minutos dela: ligar os dois fora de ordem e olhar se o primeiro card e o
   primeiro chip são o mesmo controle.

### Do produto, e não é desta frente

- **Se Perfis, Emulação e Navegação DEVEM ler o alvo.** A Z2-8 as faz nascer
  esmaecidas porque hoje não leem. Ligar um leitor é de cada onda, com o §5 na
  mão.
- **O broadcast do backend** (`core/backend_pydualsense.py`) — é a **Z3**, e a
  [F4](2026-08-24-RUMBLE-POR-JOGADOR-01-grava-na-peca-e-manda-na-mesa.md) já
  tem 14 mordidas prontas sobre ele.
- **A granularidade por peça da vibração** — é a **D-G**, ramo *"depois da
  0.9.5"*.
- **O alvo por jogador na Navegação** — está **fora da 0.9.5** pela **D-J**.

### O que NÃO se deve refazer

- **O módulo dono já existe e está certo.** `app/alvo_de_edicao.py` nasceu em
  23/08 com os três estados, a ponte para o campo legado e a frase da recusa.
  Nenhuma tarefa desta sprint o reescreve — todas o **chamam**. Quem abrir esse
  arquivo para "melhorar o desenho" está refazendo trabalho medido.
- **A saída do default de classe foi deliberada** e está explicada no `:35-38`:
  *"o atributo EXISTIR é o que separa 'escolheu Todos' de 'ninguém escolheu
  nada'"*. Devolver o default apaga a cura inteira em uma linha.
- **A R-16** (`status_actions.py:2232-2252`): o alvo segue o GESTO dela, não a
  contagem de controles. Um controle que cai no meio da edição **não** zera o
  alvo. Já custou uma auditoria em 23/07.
