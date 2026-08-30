# A TRAVA QUE NINGUÉM SOLTA · 01 — o teto de ociosidade, e a pergunta do número

**Executada em 29/08/2026.** Irmã da
[A-TRAVA-DO-LED-NÃO-SOLTA-01](2026-08-29-A-TRAVA-DO-LED-NAO-SOLTA-01-arma-em-dois-lugares-e-nao-solta-em-nenhum.md),
que diagnosticou a metade `led`, e da
[ÁUDIO-QUE-TRANCA-01](2026-08-03-AUDIO-QUE-TRANCA-01-um-toque-no-volume-congela-a-troca-de-perfil.md),
dona declarada da metade `audio` desde 03/08. Esta aqui não executa nenhuma das
duas: instala a **rede** que faltava embaixo das duas, e escreve a pergunta.

## O defeito, e o tamanho certo dele

Medido contra o disco, com
`grep -rn 'mark_manual_trigger_active\|clear_manual_trigger_active' src/`:

| categoria | arma em | solta em |
|---|---|---|
| `trigger` | `ipc_handlers.py:1240` (`trigger.set`) | `:1298` (`trigger.reset`) |
| `rumble` | `:4222` e `:4329` | `:4302` e `:4370` |
| **`led`** | **`:1369` (`led.set`), `:1425` (`led.player_set`)** | **nenhum** |
| **`audio`** | **`:4674` (`_marcar_audio_manual`)** | **nenhum** |

Enquanto QUALQUER categoria está armada, o `AutoSwitcher` não reaplica perfil por
mudança de janela (`profiles/autoswitch.py:904`). Duas das quatro entravam e não
saíam.

**O tamanho, e ele não é "trava o produto todo":** 4 episódios de
`autoswitch_suppressed_by_manual_override` em 7 dias no journal dela, e a exceção
do perfil de jogo — a única saída automática que existia — nunca precisou agir
(zero vezes). É **armar sem soltar**, e a única saída é ela trocar de perfil na
mão sem ter como saber que precisa.

## O par certo de cada uma — e por que ele não pôde ser instalado hoje

**`led`.** O par honesto é o gesto **"Voltar ao automático"** da aba Iluminação.
Ele existe na tela e **não fala com o daemon**:
`app/actions/lightbar_actions.py:1141` (`on_lightbar_auto_reset_target`) e `:1175`
(`on_lightbar_auto_reset_all`) só editam o rascunho (`with_controller_fields_cleared`)
e mostram um toast.

**Pendurar o `clear("led")` ali seria pior que o defeito.** O botão mexe no
RASCUNHO; a cor manual continua no hardware até o "Aplicar" seguinte. Soltar a
trava naquele instante entrega ao autoswitch uma janela para reescrever a cor que
a aba acabou de aplicar — **o defeito exato que o ABAS-05 curou**. E o "Aplicar"
que viria depois **rearma** a categoria (`daemon/ipc_draft_applier.py:67-79`,
seção `leds` → `{"led"}`), então o clear seria, na melhor hipótese, inócuo.

**`audio`.** Não existe gesto nenhum. O mais próximo é `speaker.set {release:true}`
(`ipc_handlers.py:4626`, `_speaker_release`), que hoje **arma** em vez de soltar — e a razão está
escrita em `_marcar_audio_manual` (`:4659-4674`): *"parar de mandar é uma decisão
dela tanto quanto mandar, e um perfil reaplicado logo depois retomaria a posse que
ela acabou de soltar"*. O argumento é real e **não foi revogado aqui**.

**`lightbar.reset` não serve** (`ipc_handlers.py:4075`): apesar do nome, é
INSTRUMENTO de medição do 0x08 (LIGHTBAR-MEDIR-O-0X08-01), não gesto de produto.

## O que foi aplicado

Um **teto de OCIOSIDADE** na trava manual — irmão do `MANUAL_PROFILE_LOCK_SEC`
(`state_store.py:31`), que esta casa já usa há meses no lock do `profile.switch`,
e cuja docstring diz: *"Após o instante de expiração, o autoswitch volta a operar
normalmente sem precisar de reset."*

- `src/hefesto_dualsense4unix/daemon/state_store.py:62-107` —
  `MANUAL_OVERRIDE_STALE_AFTER_SEC`, hoje **6 h**, com a razão inteira;
- `:149-156` — `_manual_override_categories` deixa de ser `set[str]` e vira
  `dict[str, float]` (categoria → instante da última afirmação). As três leituras
  já viam as chaves, então **nenhum chamador precisou mudar**;
- `:370-389` — `mark_manual_trigger_active` **renova** o carimbo a cada chamada;
- `:391-417` — `clear_manual_trigger_active`, inalterado no contrato;
- `:419-440` — `_purgar_overrides_vencidos()`, o teto propriamente dito;
- `:664-673`, `:688-696` e `:848-853` — as **três** leituras da trava
  (`manual_trigger_active`, `manual_override_categories`, `snapshot`) purgam antes
  de responder, para não haver dois "armadas" diferentes na casa.

**É ociosidade, não idade — e é isso que o torna seguro.** Enquanto ela mexe na
cor, o teto anda para a frente sozinho; ele só vence depois de horas em que ela
não disse mais nada sobre aquela categoria. Um teto por IDADE venceria no meio de
uma sessão em que ela ainda está ajustando — e aí seria o ABAS-05 de volta.

**O teto não escreve byte nenhum.** Vencer só devolve ao `AutoSwitcher` o direito
de decidir; quem escreve continua sendo a ativação de perfil, com as regras de
sempre. E o **gesto continua vencendo o relógio**: `trigger.reset` e
`rumble.passthrough` soltam na hora, como sempre.

## A mordida — os números

`tests/unit/test_a_trava_que_ninguem_solta_01.py`, 13 testes. Cada um percorre uma
**trajetória** de instantes e afirma a curva inteira: uma régua que lê a trava uma
vez mede um instante, não um comportamento — e o comportamento aqui É o tempo.

Três arrancadas, cada uma cortando uma coisa diferente:

| arrancada | o que foi cortado | resultado |
|---|---|---|
| **1** | as 3 chamadas de `_purgar_overrides_vencidos()` | **8 reprovaram**, 5 passaram |
| **2** | `mark` deixa de renovar (`=` → `setdefault`) | **1 reprovou** (`..._e_de_ociosidade_e_nao_de_idade`), 12 passaram |
| **3** | purga vira global (vencer uma apaga as quatro) | **1 reprovou** (`..._cada_categoria_vence_no_seu_tempo`), 12 passaram |

Com a cura devolvida (md5 conferido contra a cópia de antes): **13 passaram**.

**A arrancada 3 é a que mais importa:** sob ela, o
`test_onda_u_trava_por_categoria.py` da casa ficou **verde** (20 passaram). A
suíte que existe para guardar a granularidade por categoria **não alcança** o
vencimento — é o buraco que esta régua fecha.

Os 5 que ficam verdes na arrancada 1 são os que medem outra coisa (o gesto, a
meta-régua, a store vazia, a categoria inválida, o censo por AST) — e é assim que
tem de ser.

**Regressão:** 717 testes verdes em dois lotes sobre tudo que toca a trava, o
store, o autoswitch, o `ProfileManager`, o applier de rascunho, a hotkey e o
áudio. `ruff check src/ tests/`, `mypy src/hefesto_dualsense4unix` e
`validar-acentuacao.py --all` limpos.

## O que ficou para ela decidir

### 1. O número do teto — hoje 6 h

O valor saiu do que o **próprio produto já tinha escrito**:
`autoswitch.py:889-896` descreve o dano da trava eterna como *"um `led.set` de
manhã bloqueava o perfil do jogo à noite, sem indicador"*. Seis horas é o maior
número que ainda separa "de manhã" de "à noite". **Mas o número é dela**, e mudar
a linha não mexe na mecânica:

| | o que ela ganha | o que ela paga |
|---|---|---|
| **1 h** | a troca automática volta quase sempre | uma sessão longa com a mesma cor pode ver o perfil repintar no meio |
| **6 h (hoje)** | nunca vence dentro de uma sessão; cobre o caso "de manhã / à noite" | uma cor posta de manhã ainda bloqueia a tarde |
| **24 h** | uma cor deliberada sobrevive ao dia inteiro | volta a ser quase-eterno: com 4 episódios em 7 dias, quase nada muda |
| **sem teto** | exatamente o comportamento de hoje | é o defeito |

### 2. O gesto — a pergunta de verdade

O teto é **rede**, não porta. A porta é a pergunta:

**(a) O "Voltar ao automático" da aba Iluminação deve falar com o daemon?** Se
sim, ele **não pode** soltar a trava no clique (a cor ainda está no hardware): o
lugar honesto é o **"Aplicar" seguinte**, que já sabe que a seção `leds` voltou ao
automático. Isso é trabalho da ONDA-ILUMINACAO-06 + do `ipc_draft_applier`, e a
sprint irmã já o reserva.

**(b) `speaker.set {release:true}` deve soltar a trava de `audio` em vez de
armá-la?** Hoje arma, com razão escrita. O preço de inverter: um perfil reaplicado
logo depois **retoma a posse do alto-falante que ela acabou de soltar**. O preço
de manter: o gesto que significa *"não tenho mais opinião sobre o áudio"* continua
sendo o que tranca. **Não invertemos**, porque é decisão medida de outra sprint.

**(c) O "Aplicar" deveria armar `audio`?** `ipc_draft_applier.py:67-74` mapeia
`leds`/`triggers`/`rumble`/`controllers` e **não mapeia `speaker`** — mesmo depois
de a seção `speaker` ter entrado no Aplicar (O-VERDE-NÃO-LEVAVA-O-SOM-01, 10/08).
Assimetria medida hoje, **não tocada**: mexer nela é armar mais, e o assunto desta
sprint era soltar.
