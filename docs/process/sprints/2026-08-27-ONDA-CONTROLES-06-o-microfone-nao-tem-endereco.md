---
sprint: ONDA-CONTROLES-06
# onda: CONTROLES (ver a nota de frontmatter da ONDA-CONTROLES-01)
posse:
  CTRL06:
    - src/hefesto_dualsense4unix/app/draft_config.py
    - src/hefesto_dualsense4unix/profiles/schema.py
    - src/hefesto_dualsense4unix/app/widgets/controller_card.py
cria:
  - tests/unit/test_controles_o_mic_grava_na_peca.py
bancada: false
depois_de:
  - EMULACAO-UM-DONO-SO-01
  - LEVA-3
  - ONDA-CONTROLES-01
  - ONDA-CONTROLES-03
  - ONDA-CONTROLES-04
  - ONDA-CONTROLES-05
  - ONDA-GATILHOS-04
  - ONDA-NAVEGACAO-01
  - ONDA-NAVEGACAO-04
  - ONDA-NAVEGACAO-05
  - ONDA-PERFIS-09
  - ONDA-VIBRACAO-03
  - ONDA-VIBRACAO-04
  - ONDA-VIBRACAO-05
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/profile_writer.py
  - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
  - src/hefesto_dualsense4unix/profiles/manager.py
  - src/hefesto_dualsense4unix/app/mic_monitor.py
---

# ONDA CONTROLES · 06 — o microfone não tem endereço

**O defeito, numa frase:** ela cala o microfone **do Controle 2** e o perfil
grava *"o microfone está mudo"* — para os dois, para os quatro, para a mesa
inteira; o daemon já sabe falar com uma peça, e o **perfil não tem onde
anotar** de quem era o gesto.

## O que está medido

- `app/draft_config.py:1823`, `janela.draft = draft.with_mic(...)` — **sempre
  global**. Não há parâmetro de peça, nem caminho que leia o alvo da fita.
- `profiles/schema.py:830`, `ControllerOverrides` — o perfil **tem** override por
  controle, e os campos são `leds`, `triggers`, `rumble`, `speaker`
  (`:900-903`). **`mic` não está lá.**
- `daemon/ipc_handlers.py:4676`, `_handle_mic_set`, e `:4757`,
  `_handle_mic_volume_set` — **os dois já aceitam `uniq`** (`:4733`, e a mesma
  validação no volume). O caminho até o aparelho está pronto e é o de baixo que
  está inteiro; o que falta é o de cima.
- `app/alvo_de_edicao.py:145`, `alvo_de_edicao(host)` — quem sabe para onde vai
  o gesto, com os três estados, e que já manda em lightbar, gatilhos e rumble.

É a forma exata do defeito mais caro desta casa: **a casa sabe e o produto não
faz.** O daemon endereça; a tela não tem como dizer o endereço.

### A armadilha do item 3, medida em 27/08

O caminho de baixo está pronto **desde que o endereço chegue**. Quando ele
**não** chega, o daemon não cai em broadcast: ele cai no **PRIMÁRIO**.
`set_microphone_mute(uniq=None)` → `_handle_for(None)`
(`core/backend_pydualsense.py:4318-4330`) → `self._primary_key`. Ela clica no
bloco do Controle 3 e quem emudece é o Controle 1 — e o retorno é `True`, então
nada avisa.

Isso vale para a **família inteira de áudio**, que compartilha o mesmo
`_handle_for`: `speaker_state_for` (`:3963`), `set_speaker_volume` (`:4021`),
`release_speaker_volume` (`:4151`), `set_microphone_mute` (`:4264`),
`microphone_mute_for` (`:4304`) e `_audio_status_byte` (`:4312`). É a razão de
existir da `GUARDA-SEM-ENDEREÇO-01` (`app/widgets/controller_card.py:2140-2156`),
que desliga o bloco de som do card sem MAC — a guarda cobre o card sem
endereço, **não** cobre a fita apontando para uma peça e o gesto saindo sem
`uniq`. Ao mover o clique do card para a fita (item 3), o `uniq` do alvo tem de
viajar SEMPRE; alvo `DESCONHECIDO` recusa (item 2) em vez de mandar sem
endereço.

**Duas correções de fato, para não caçar o que não existe:**

- **`set_microphone_led` não existe no backend.** O que existe é
  `_PinnedPyDualSense.set_microphone_led` (`:1036-1056`), no handle. O método
  público é `set_mic_led` (`:3824-3852`), e ele **já respeita a fita**
  (`_for_each`, com `record={"mic_led": …}`) — `mic_led` é campo de
  `_DesiredOutput` (`:436`) e sobrevive a hotplug.
- **O mudo NÃO tem onde ser lembrado no backend.** `_DesiredOutput` tem
  `mic_led` e **não** tem `mic_mute`; o único estado é
  `handle._mic_mute_desejado` (`:1033`), que morre com o handle e não é
  re-aplicado por `_write_partial_output`. Ou seja: mesmo depois desta sprint
  gravar "Controle 2 mudo" no perfil, **um replug perde o mudo** até alguém
  re-aplicar o perfil. Isso é de outra frente; fica escrito para não ser
  descoberto na tela.

## A decisão que manda

`D-A-FITA-E-O-UNICO-ALVO` traz a consequência escrita no próprio contrato do
redesenho: *"o microfone precisa de override por controle — hoje `draft.with_mic`
é sempre global e a fita não tem onde gravar 'Controle 2 mudo'"*.

E ela disse o que espera, com o caso na mão (26/08):
> *"se eu for na aba status, alterar o meu controle pra colocar o som silenciado
> ou todo o som do PC ativo. **Isso deveria ser respeitado.**"*

## O que esta sprint entrega

1. **`ControllerOverrides.mic: ProfileMicConfig | None`** — aditivo, mesmo
   contrato do `speaker` que já está lá (`schema.py:903`), **sem bump de
   versão**. Perfil antigo continua abrindo; `None` continua sendo "esta peça
   não tem opinião" e cai no valor global do perfil.
2. **`draft_config` passa a endereçar.** `with_mic` ganha o alvo:
   - alvo `CONTROLE` → grava em `controllers[uniq].mic`;
   - alvo `TODOS` → grava em `mic`, como hoje;
   - alvo `DESCONHECIDO` → **recusa com motivo** (`AlvoDeEdicao.recusa()`,
     `alvo_de_edicao.py:127`) e **não grava nada**. Escrever em silêncio no
     global é o que produz *"a config que eu deixo nunca é respeitada"*.
3. **O ícone e o slicer do microfone do card mandam pelo alvo da fita**, nunca
   pelo card em que foram clicados — `D-A-FITA-E-O-UNICO-ALVO`. O card mostra o
   estado **da peça dele**; o clique vai para onde a fita aponta.
4. **`to_profile` reconstrói o `ControllerOverrides` com a seção nova**, no
   molde do `speaker`, e `_overrides_vazio` (`draft_config.py:377`) passa a
   contar o `mic` — sem isso, uma peça com **só** microfone anotado seria
   descartada como vazia na gravação. O funil de disco
   (`profile_writer.py`) não muda: ele grava o `Profile` que receber.

## Como se prova (o teste que morde)

`tests/unit/test_controles_o_mic_grava_na_peca.py`:

1. **O gesto tem endereço.** Fita em `Controle 2`, ícone de mudo clicado: o
   rascunho tem `controllers["<uniq2>"].mic.muted is True` e o `mic` global
   **intocado**. Arranque a cura (devolva o `with_mic` global) e veja o global
   sujo — que é o defeito, escrito.
2. **"Todos" continua global.** Fita em `Todos`: grava no `mic` do perfil e em
   nenhum `controllers`.
3. **Sem alvo, não grava.** Alvo `DESCONHECIDO`: nada muda no rascunho **e** a
   recusa tem frase. Régua que só sabe passar não é régua — este é o caminho de
   erro, e ele é exercido.
4. **O perfil antigo abre.** Um `Profile` v1 sem `mic` em `controllers` carrega,
   e a peça sem opinião herda o global. É a mordida contra o `extra="forbid"`
   quebrar perfil dela no disco.
5. **Ida e volta.** Grava, lê do disco, e o `muted` da peça volta igual.

## O que é dela decidir

1. **`button_toggles_system` — a pergunta 2 do contrato da aba.** O campo existe
   e o daemon o aplica (`schema.py:451`), **sem nenhuma tela que o escreva**.
   Pergunta dela, literal, no redesenho: *o botão de microfone do controle deve
   mudar o mudo do computador inteiro ou só o do controle — entra como caixa no
   bloco Microfone deste card, ou fica fora do produto?* **Esta sprint não o
   liga**: o mockup aprovado não desenha a caixa, e inventar tela é o que ela
   proibiu.
2. **O microfone nasce ligado e no máximo** (`D-AUDIO-E-GIRO-NASCEM-LIGADOS`, e
   a fala dela de 26/08). O default vale por **perfil** ou por **peça**? Com
   override por controle a pergunta passa a existir. **PROVISÓRIO — decisão
   dela:** por perfil, e a peça só ganha linha quando ela mexe naquela peça.
