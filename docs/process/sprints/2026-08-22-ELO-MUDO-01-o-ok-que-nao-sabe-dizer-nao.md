# ELO-MUDO-01 — o "ok" que não sabe dizer não

**22/08/2026.** Nasceu de duas queixas dela sobre o **Sackboy** — o engasgo com o
controle parado, e *"o perfil do sackboy não tá aplicando as features das abas
que eu seto e clico em salvar"*. A régua da entrega é a última frase dela:

> *"se eu que to fazendo parte do desenvolvimento to apanhando, um user simples
> então vai apanhar mais."*

**Estado:** ABERTA

---

## O padrão, em uma linha

**O produto responde pelo TRANSPORTE, nunca pelo EFEITO.** Ele diz "a mensagem
chegou"; nunca diz "o valor virou hardware". Por isso um gesto que morreu no
meio do caminho é indistinguível de um gesto que funcionou — e a pessoa
conclui, corretamente, que "nada aplica".

Três medições do MESMO padrão, no mesmo dia, no mesmo jogo:

| Onde | O que o produto respondeu | O que era verdade |
|---|---|---|
| `profile.apply_draft` (o botão verde) | `"status": "ok"` | uma das duas seções morreu com exceção dentro |
| `profile.switch` (o Salvar do perfil ativo) | `secoes` com 4 nomes | gatilhos e luz **não aparecem no relatório nem quando dão certo** |
| lançamento do jogo | `supressao=aplicado` | **duas seções de oito** foram aplicadas |

O defeito B é este padrão. O defeito A não teve causa medida, e a razão de não
ter tido é o mesmo padrão do outro lado: **não existe tela que diga o que está
valendo agora**, então nem ela nem eu conseguimos separar "o produto trocou algo"
de "o jogo é assim".

---

## Defeito B — o perfil não aplica. Elo por elo, com medição

O perfil dela: `~/.config/hefesto-dualsense4unix/profiles/sackboy.json`,
937 bytes, gravado em 22/08 15:31:14.

### Elo 1 — a tela grava? ● SIM

O arquivo no disco tem o que ela pôs nas abas:

```json
"triggers": {"left": {"mode": "Feedback", "params": [5, 4]},
             "right": {"mode": "Feedback", "params": [5, 4]}},
"rumble":   {"passthrough": true, "policy": "max", "custom_mult": null}
```

E o Salvar reaplica quando o perfil salvo é o ativo — `on_profile_save` chama
`profile_switch` (`app/actions/profiles_actions.py`). Este elo está são.

### Elo 2 — o perfil casa com o jogo? ● SIM, quando a janela tem foco X

Era o meu suspeito nº 1 e **está errado**. Com o jogo aberto, o daemon devolveu:

```
window_detect_backend      = "xlib"
window_detect_last_class   = "steam_app_1599660"
```

O `match` do perfil (`window_class: ["steam_app_1599660"]`) é exatamente essa
string. O casamento funciona.

**Mas o detector fica cego a maior parte do tempo.** No mesmo `state_full`:

```
window_detect_current_class = "unknown"
window_detect_reason        = "sem_foco_x"
window_detect_useful_age_sec = 1276.1
```

**21 minutos sem uma leitura útil.** No Wayland/COSMIC só janela Xwayland dá foco
X; a janela do Hefesto, o terminal e o painel dão `sem_foco_x`. O journal do dia
mostra o mesmo em regime: `x11_focus_gate_no_x_focus focus=0` e
`autoswitch_window_info_unavailable ... wm_class=unknown`.

Isso é a [FOCO-ERRANTE-01](2026-08-18-FOCO-ERRANTE-01-o-x-aponta-para-a-steam-e-leva-o-perfil-junto.md),
e não é a causa desta sprint — é o que torna a causa fatal.

### Elo 3 — a ativação aplica as seções? ● SIM. E é justamente a ativação que não acontece

`profiles/manager.py` leva gatilho, luz, rumble, alto-falante, mic e modo. Nada
falta lá. O problema é **quem chama**.

### Elo 4 — o lançamento aplica DUAS seções de oito. Esta é a causa

Journal do lançamento medido às 15:56 de hoje:

```
15:56:39 launch_arm_pulado_allowlist_steam_input appid=1599660 profile=Sackboy supressao=aplicado
15:56:39 steam_input_excecao_ativada    appid=1599660
15:56:40 steam_input_fisico_escondido   appid=1599660
15:56:40 aviso_de_modo_trocado          cor=(139, 233, 253) de=dualsense para=steam_input
```

Leia a primeira linha devagar: **o daemon tem o `appid` e tem o `profile` na
mão.** Ele resolveu o perfil do jogo por appid (`_steam_profiles`), sem depender
de janela nenhuma. E então, em `daemon/launch_env.py:1001-1029`:

- aplica `suppress_desktop_emulation`;
- para appid **na allowlist do Steam Input** (o caso do Sackboy), `return` —
  nada mais;
- para appid fora dela, arma a seção `mode` — e só.

**Gatilhos, luz, política e passthrough de rumble, alto-falante e mic nunca são
aplicados no lançamento.** Eles esperam a ativação de perfil, que só nasce do
autoswitch, que só nasce de `wm_class`, que no desktop dela responde `unknown`.

**A hipótese explica o que JÁ funciona.** Um jogo em que "aplica" é um jogo em que
ela abriu a janela do Hefesto e trocou de perfil na mão (`origin=manual`, que é
exatamente o que o journal registra às 15:30:39), ou em que o autoswitch pegou
uma janela Xwayland em foco no instante certo. Não é sorte de jogo: é sorte de
gesto. E o Sackboy está na allowlist, que é o ramo que sai mais cedo de todos.

### Elo 5 — qual aparelho o jogo lê? ● o vpad. O desenho funciona

Medido com `lsof`, com o jogo rodando:

| Nó | Quem tem aberto |
|---|---|
| `/dev/hidraw6`, `/dev/hidraw7` (vpads do Hefesto) | `steam` **e** `winedevice` (o Proton do Sackboy) |
| `/dev/hidraw4`, `/dev/hidraw5` (DualSense físicos) | **só** o daemon |
| `event26`, `event30` (evdev dos físicos) | daemon e `steam` |

E no ambiente do processo do jogo: `PROTON_DISABLE_HIDRAW=0x054C/0x0CE6` e
`SDL_GAMECONTROLLER_IGNORE_DEVICES=0x054c/0x0ce6,0x28de/0x11ff`. O jogo enxerga o
vpad e só ele. **O caminho de entrada está certo**, e o wrapper rodou
(`wrapper_used: true`).

O que não está dito em tela nenhuma: **o Hefesto escreve o gatilho do perfil no
DualSense FÍSICO, e o jogo conversa com o VPAD.** Os dois caminhos existem e o
`passthrough` os liga. Nenhuma tela diz isso, e é por isso que "não aplicou" e
"aplicou no outro lado" são a mesma experiência.

### Elo 6 — o Modo Nativo ● não é o caso

`native_mode: false`, `mode_from_profile: "gamepad"`. A recusa de 22/07 não está
em jogo aqui.

### E a resposta do produto, medida três vezes

**(a) `status: ok` com seção morta dentro.** O gesto dela — Aplicar com a seção
de gatilhos — pelo IPC de produção, com o jogo rodando:

```
$ .venv/bin/python /tmp/ipc.py profile.apply_draft \
    '{"triggers":{"left":{"mode":"Rigid","params":[8]}, ...},"rumble":{...}}'
{"result": {"status": "ok",
            "applied": ["rumble"],
            "failed": {"triggers": "rigid() missing 1 required positional argument: 'force'"}}}
```

O `status` é fixo em `"ok"` (`daemon/ipc_draft_applier.py`). Quem lê o status —
e a janela lê — vê sucesso.

**(b) o relatório do Salvar não fala de gatilho nem de luz.** `profile.switch`
com o perfil dela:

```
{"active_profile": "Sackboy", "mode_aplicado": true,
 "secoes": {"suppression": "aplicado", "mode": "aplicado",
            "rumble_policy": "aplicado", "speaker": "aplicado"}}
```

`triggers` e `leds` **não aparecem**. Eles só entram no dicionário quando são
IGNORADOS pela trava manual (`IGNORADO_TRAVA_MANUAL`, `profiles/manager.py:388`).
Ou seja: **a ausência de notícia não distingue "aplicou" de "nem tentei"** — e
essas duas são as duas abas de que ela reclamou.

**(c) o diagnóstico que existe fica calado.** Com o jogo rodando e seis seções
não aplicadas, `perfil_do_jogo_que_nao_entrou = []`.

---

## Defeito A — o engasgo. NÃO tem causa medida, e a lista do que caiu

**Eu não reproduzi o engasgo, e não invento causa.** O que a medição derrubou,
com o comando ao lado:

| Hipótese | Régua | Resultado |
|---|---|---|
| Sniff mode / link policy do BT | `exame_da_mesa` | **Não se aplica.** Zero controles pareados por rádio; os dois DualSense estão no **CABO** (`usb3/3-3.1.1` e `3-3.1.3`) |
| Autosuspend USB | `power/control` de toda a cadeia dos dois controles | `on` em todos os nós; `autosuspend_delay_ms=-1000` |
| Exame da mesa | `.venv/bin/python -m hefesto_dualsense4unix.integrations.exame_da_mesa` | 4 `[OK]`; 1 `[WARN]` — vizinhança das portas (rádio ao lado de rádio) |
| Storm USB `-71` | `~/.local/state/hefesto-dualsense4unix/kernel.log` | Última ocorrência 15:12, **antes** do jogo. Nenhuma durante |
| Perfil de energia | `system76-power profile` / `scaling_governor` | `Performance` / `performance` |
| Ociosidade do COSMIC apagando a tela | `CosmicIdle/v1/screen_off_time` | `None` — desligado |
| VIGIA-DO-MUDO: reabrir o evdev depois de ~4 s parado | grep no journal de 13 h de sessão | **0 ocorrências** de `evdev_mudo_reabrindo` |
| Silêncio do leitor de hidraw | idem | **0 ocorrências** de `motion_reader_silencio_reabrindo` |
| **O canal do controle degrada com a ociosidade** | 60 s de controle imóvel, contando relatórios nos 4 nós hidraw | **250,0 Hz constantes nos quatro, zero quedas em 60 de 60 segundos** |

A última linha é a que mais importa: **com o controle parado por um minuto
inteiro, nada no caminho do controle piora.** A família inteira "economia de
energia / keepalive / o controle dorme" está descartada **para o cabo**. Para o
rádio ela segue sem medição, porque não há nada pareado nesta máquina.

### O que ficou sem medir, e por quê

**O frametime dentro do jogo.** A máquina tem **um monitor só**, e a regra desta
casa é que nenhuma janela minha nasça na frente dela. Abri o Sackboy com
MangoHud gravando; enquanto a janela esteve visível, o jogo estava na abertura e
na compilação de shader (mediana 21,3 ms, dois quadros de 48,5 s que são carga de
disco) — nada que sustente conclusão. Ao parquear a janela no workspace `OS`,
como manda a regra, o compositor parou de apresentá-la e o jogo caiu para
**1,00 fps** (frametime 999,5 ms constante). Medição impossível nesse estado.

**Isto é DELA:** o engasgo do Sackboy só se mede com a janela na tela dela. O
roteiro está na E6.

### A pergunta dela sobre o Proton, respondida com fato

O Sackboy está em **GE-Proton10-34** (`config.vdf`, `CompatToolMapping`,
prioridade 250). Instalados nesta máquina: `GE-Proton10-34`, `GE-Proton11-1`,
`GE-Proton11-3`, `Proton 10.0`, `Proton 11.0`, `Proton Experimental`,
`Proton Hotfix`. Ela também já tem `VKD3D_CONFIG=no_upload_hvv` valendo para
este appid — conferido no `/proc/<pid>/environ` do jogo vivo, junto com o
`hefesto-launch`: os dois convivem, nenhum come o outro.

**E o produto tem opinião sobre isso — sem dizer.**
`integrations/proton_pin.py` trava **todos** os jogos numa única versão
(`assets/proton-pin.conf` → `GE-Proton10-34`), e o registro do que ele mexeu
está em `~/.local/state/hefesto-dualsense4unix/proton-pin-lock.json`: **19 jogos
dela**, 16 `added` e 3 `preservado`, em 19/08. O Sackboy **não** está nessa lista
— a versão dele não foi escolha nossa. Mas o único gesto que a janela oferece é
`on_proton_lock`, que é *travar TODOS*. **Não existe superfície para escolher
Proton por jogo, nem para ver em qual versão um jogo está.** É o mesmo padrão: o
produto age e a tela cala.

---

## O que NÃO é

- **Não é a trava manual por categoria.** Ela existe (`manual_override_categories`)
  e o `apply_draft` a arma, mas a ativação por `profile.switch` e pelo autoswitch
  a limpa. Conferido no código e no relatório: nenhuma seção voltou
  `ignorado_trava_manual` nos testes de hoje.
- **Não é o wrapper comido pela Steam.** O `last_run` marcou o lançamento
  (`appid=1599660`, `pid=586342`) e o `state_full` devolveu `wrapper_used: true`.
- **Não é `custom_mult`.** `rumble_mult_applied: 0.66` com `policy=max` é o
  multiplicador automático, não o do perfil (MISC-08, 18/07).
- **Não é regressão de hoje.** O `return` antecipado da allowlist é da
  ALLOWLIST-SUPRESSAO-01 (24/07), e a ausência das outras seções no arming nunca
  foi discutida — o arming nasceu para armar `mode`, e ninguém perguntou pelo
  resto.

---

## Entregas

### ~~E1~~ **FEITA em 22/08/2026** (`62d092a`) — o lançamento ATIVA o perfil

> **FEITA. Prova ao vivo, no daemon dela, três vezes.** Escrevi o marker do
> Sackboy à mão e li o journal:
>
> ```
> profile_activated  name=Sackboy origin=launch priority=97
> launch_perfil_ativado  appid=1599660 profile=Sackboy secoes={'led': 'aplicado',
>   'trigger': 'aplicado', 'keyboard': 'ignorado_sem_device',
>   'suppression': 'aplicado', 'rumble_policy': 'aplicado', 'speaker': 'aplicado'}
> ```
>
> **NOTA DATADA — 23/08/2026 ([GATILHO-NÃO-PERDIDO-01](2026-08-23-GATILHO-NAO-PERDIDO-01-a-regua-perguntou-pelo-campo-errado.md)).**
> O `'trigger': 'aplicado'` e o `'led': 'aplicado'` desta captura eram palavra
> FIXA: o `apply` escrevia `relatorio.setdefault(categoria, "aplicado")` sem
> perguntar se algum byte saiu, e com a mesa vazia o relatório dizia o mesmo com
> zero escrita. A cura desta entrega hospedava, para duas seções, exatamente o
> defeito que ela nomeia. Curado: as duas palavras passam a vir do
> `ResultadoDeSaida` que o `apply_output_defaults` devolve, e mesa vazia agora
> diz `adiado_sem_controle`.
>
> **E o journal pegou o que o teste não pegou.** A primeira versão trouxe
> `'mode': 'aplicado'` na allowlist — a allowlist sendo pulada e cumprida na
> mesma linha. São DOIS caminhos até o mesmo applier: o `return` do ramo pula o
> `apply_profile_mode` que o arming chama direto, e a ativação tem o seu dentro
> do `apply_emulation`. Curado com `mode_applier=None` na fábrica desse ramo, e
> a régua do teste passou a ser a CONSTRUÇÃO do gerente.
>
> **O gerente passou a vir de uma FÁBRICA** (`profiles.manager.gerente_do_daemon`).
> Quatro rotas montavam o próprio, cada uma com a sua lista, e uma derivou —
> `PERFIL-REESCRITO-NA-PARTIDA-01` item 6. Applier ausente não levanta: a seção é
> ignorada em silêncio. As outras três rotas **continuam com lista própria**, e
> unificá-las é trabalho de outra leva.


**Custo do silêncio: diário, e é a queixa dela inteira.** Hoje o produto sabe o
nome do jogo, resolve o perfil por appid, e aplica dois campos.

`daemon/launch_env.py`, `_reconciliar_launch`: depois de resolver `profile` por
appid, chamar a ATIVAÇÃO de perfil (a mesma rota do autoswitch, `origin="launch"`),
não só `apply_profile_suppression` e o arming de `mode`.

Duas guardas que não podem cair:

- **a allowlist continua pulando só o que ela decidiu que pula.** A decisão dela
  é *"a allowlist NÃO tira o Hefesto da frente"*; o `return` de hoje tira. A
  allowlist pula a disputa pelo controle — máscara, grab, vpad — e não a cor, o
  gatilho, o volume nem a política de vibração;
- **o lock manual de 30 s continua valendo** (R-03): gesto dela nos últimos 30 s
  é mais novo que o perfil.

**Prova:** com o jogo aberto pela Steam e a janela do Hefesto FECHADA, o journal
mostra `profile_activated name=<perfil> origin=launch` e o relatório traz todas
as seções. Teste que morde: arrancar a chamada faz o teste reprovar nomeando as
seções que sumiram.

### E2 — **METADE FEITA em 22/08/2026** (`b68223e`) — a resposta é por EFEITO

> **METADE FEITA.** O item 2 saiu: gatilho, luz e teclado passam a ser nomeados
> no relatório da ativação — antes gatilho e luz só apareciam quando a trava
> manual os silenciava, e o teclado nunca. O teclado ganhou os três estados
> (`aplicado`, `ignorado_sem_device`, `falhou`).
>
> **O item 1 NÃO sai como escrito, e a razão é medida.** `status` fixo em
> `"ok"` é decisão registrada em `app/ipc_bridge.py::aplicacao_confirmada`: a
> janela de hoje traduz `status != "ok"` como *"daemon offline?"*, e essa
> mensagem mandaria ela caçar o problema no lugar errado. A honestidade já
> viaja por `applied`/`failed`, e o rodapé os lê
> (`footer_actions.py`). Trocar o status exige mudar a JANELA antes — nesta
> ordem, ou a cura vira defeito.
>
> **Falta ainda:** `mic` e `mouse` continuam ausentes do relatório quando o
> perfil não tem a seção, e o item 3 (a frase do toast) não foi feito.


**Custo do silêncio: é o que transforma um defeito em "nada funciona".**

1. `profile.apply_draft` deixa de devolver `status` fixo. `"ok"` só quando
   `failed` está vazio; caso contrário `"parcial"` com a lista.
2. O relatório da ativação (`profile.switch`) passa a nomear **todas** as seções
   do `Profile`, cada uma com um de três estados: `aplicado`,
   `ignorado_<motivo>`, `falhou_<motivo>`. Hoje só quatro aparecem, e gatilho e
   luz **nunca** aparecem quando dão certo.
3. A janela mostra a diferença. O toast do Salvar/Aplicar diz o que ficou de
   fora e por quê — a fiação já existe (`footer_apply_draft_resultado` carrega
   `aceita`), falta a frase.

**Prova:** um teste que aplica uma seção que sabidamente falha e exige que o
`status` NÃO seja `"ok"`; outro que ativa um perfil e exige as oito seções no
relatório.

### E3 — a tela que diz o que está VALENDO agora

**Custo do silêncio: é por isso que o defeito A não tem causa.** Sem essa tela,
nem ela nem um agente conseguem separar "o produto mexeu" de "o jogo é assim".

Seção nova na aba **Configurações**, que nasceu em 22/08 e tem o molde pronto
(um card por assunto, dica que descreve o que a seção DESENHA). Conteúdo, tudo
já publicado no `state_full`:

| Linha | Campo vivo |
|---|---|
| Perfil valendo, e por qual gesto entrou | `active_profile` + a origem da ativação |
| O que o perfil aplicou, seção por seção | o relatório da E2 |
| Que aparelho o jogo está lendo | `rumble_ff.per_vpad[].game_open` + `hidraw` |
| Se a exceção do Steam Input está de pé | `steam_input.excecao_ativa` |
| Se o detector de janela está enxergando | `window_detect_seeing`, `window_detect_reason`, `window_detect_useful_age_sec` |

**Prova:** com o detector cego (`sem_foco_x` por mais de um minuto), a seção diz
isso em português, e não em silêncio.

### E4 — o appid do wrapper vira fonte de primeira classe do match

**Custo do silêncio: o casamento por `window_class` é o único caminho hoje, e
ele responde `unknown` a maior parte do tempo no desktop dela.**

O `last_run` do wrapper já traz `appid` e `pid`, e o daemon já os lê
(`jogo_steam: {"lido": true, "appid": 1599660}`). O match por appid tem de valer
sozinho, sem depender de janela — o autoswitch continua existindo para quem não
passou pelo wrapper.

**Cuidado medido:** o disco dela tem appid coberto por dois perfis (`pragmata` e
`pragmata2`); a desempate é por prioridade, e a escolha vai no relatório.

### E5 — o Proton por jogo ganha rosto

**Custo do silêncio: ela perguntou "qual a melhor versão do Proton pro jogo" e o
produto não tem onde responder.**

- a aba Sistema mostra, por jogo, em que Proton ele está e se **nós** o pusemos
  lá (o `proton-pin-lock.json` já guarda `previous_name` e `action`);
- o botão de travar diz que trava **TODOS** antes de travar;
- trocar a versão de UM jogo é um gesto que existe.

Sem isso, "trocar de Proton para testar" é uma edição manual no `config.vdf`
com a Steam fechada — o que nenhum usuário simples vai fazer.

### E6 — o roteiro do engasgo, para a mão dela

**DELA, por construção.** Dez minutos, com o jogo na tela dela:

1. `MANGOHUD=1` nas Opções de Inicialização do Sackboy, com
   `autostart_log=1`, `log_interval=0`, `output_folder` num diretório vazio;
2. abrir o jogo, chegar a um ponto de jogo (não menu);
3. **90 segundos sem tocar no controle**, cronometrados;
4. mexer nos analógicos por 30 segundos;
5. repetir 3 e 4 uma vez.

O CSV responde a pergunta sozinho: se os quadros longos se concentram nos blocos
parados e somem nos blocos com movimento, o engasgo é real e é correlacionado
com a ociosidade — e aí a lista de hipóteses derrubadas acima diz onde NÃO
procurar. Se não se concentram, a hipótese dela cai e sobra shader/Proton, que é
a E5.

### E7 — o portão da família

O padrão desta sprint é **resposta que não sabe dizer não**. O portão:

> toda rota IPC que devolve um campo de status literal (`"ok"`, `True`,
> `"aplicado"`) sem derivá-lo do resultado das sub-operações reprova, nomeando a
> rota e o literal.

Irmão do `portao_a_casa_sabe_e_o_produto_nao_faz.py`. **Não** medir por nome de
símbolo: medir pelo literal na expressão de retorno, senão perdoa quem renomear.

---

## O que é decisão DELA

1. **A allowlist do Steam Input aplica ou não aplica o resto do perfil?** A
   decisão registrada é *"a allowlist NÃO tira o Hefesto da frente"*, e o código
   de hoje a contraria (`return` antes de tudo, e `aviso_de_modo_trocado
   de=dualsense para=steam_input`). A E1 assume que a decisão vale. Se ela quis
   dizer outra coisa, a E1 muda.
2. **O Sackboy deve continuar na allowlist?** Ele entrou por "marcado no editor
   de perfil". Com Steam Input ligado, quem manda na vibração e no gatilho é a
   Steam, e o perfil do Hefesto passa a ser conselho, não ordem. Tirar da
   allowlist é um experimento de dois minutos que ela pode fazer.
3. **A ordem das entregas.** A E2 é a mais barata e a que mais devolve confiança
   (ela para de adivinhar). A E1 é a que conserta o Sackboy. A E3 é a que impede
   a próxima sessão de gastar quatro horas para descobrir o óbvio.

---

## O que eu mexi nesta máquina, e desfiz

- **`~/.local/share/hefesto-dualsense4unix/bin/hefesto-launch`**: duas linhas de
  `export MANGOHUD` para conseguir o log de frametime. **Restaurado** do backup
  (`diff` limpo, `grep -c MANGOHUD` = 0).
- **Sackboy aberto e fechado** duas vezes; a janela foi parqueada no workspace
  `OS`, nunca ficou na frente dela.
- **`profile.apply_draft` com gatilho `Rigid`** e depois `profile.switch` para
  devolver o perfil `Sackboy` ao controle. Estado final conferido:
  `active_profile: "Sackboy"`.
- **A Steam foi reiniciada** (`-silent`, sem janela) — eu a derrubei ao encerrar
  o jogo.
- Nada no repositório além deste arquivo.
