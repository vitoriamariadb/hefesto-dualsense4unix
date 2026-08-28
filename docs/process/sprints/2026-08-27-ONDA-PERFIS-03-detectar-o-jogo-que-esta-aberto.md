---
sprint: ONDA-PERFIS-03
# onda: PERFIS
posse:
  P3:
    - src/hefesto_dualsense4unix/app/actions/profiles_actions.py
    - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
cria:
  - docs/process/sprints/2026-08-27-ONDA-PERFIS-03-detectar-o-jogo-que-esta-aberto.md
  - tests/unit/test_detectar_o_jogo_aberto_nao_e_so_steam.py
bancada: true
depois_de:
  - ONDA-PERFIS-01
  - ONDA-PERFIS-02          # o botão preenche o ambiente "Jogo", que nasce lá
  # SÉRIE, por R5: esta sprint divide src/hefesto_dualsense4unix/daemon/ipc_handlers.py
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-VIBRACAO-04
  - ONDA-VIBRACAO-05
  - ONDA-VIBRACAO-06
  - ONDA-JOGAR-05
  - LEVA-DE-BACKGROUND-01  # fechou no merge 27e6c4a6 (as sete frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/profiles/
  - src/hefesto_dualsense4unix/daemon/state_store.py
---

# ONDA PERFIS · 03 — detectar o jogo que está aberto (e não só o da Steam)

**O defeito em uma frase:** o daemon **já lê o nome do executável da janela em
foco** e o IPC não publica esse campo — então o único jogo que a aba consegue
detectar é o que tem número da Steam, e quem joga pelo Heroic, Lutris, Flatpak
ou emulador digita tudo à mão.

## A casa sabe e o produto não faz — medido

`daemon/state_store.py` guarda **quatro** fatos da janela em foco:

```
:690  window_detect_current_class
:702  window_detect_current_name
:714  window_detect_current_exe     <- o basename do executável
:680  window_detect_last_class      (sticky)
```

`daemon/ipc_handlers.py:2237-2285` (`_window_detect_payload`) publica
`backend`, `healthy`, `last_class`, `current_class`, `useful_age_sec`,
`seeing`, `reason` — **e não publica `current_exe` nem `current_name`.**

Do outro lado, `profiles_actions.py:3086-3140` (`_aplicar_nascimento_com_jogo`)
faz o perfil novo nascer com a regra do jogo em foco — e o corpo inteiro só sabe
uma coisa:

```python
appid = extract_steam_appid(result.get("window_detect_last_class"))
if not appid:
    return False
```

**Sem número da Steam, o perfil nasce catch-all e nunca vale no jogo** — que é
exatamente o defeito de 26/07 que aquela função foi escrita para curar, ainda
vivo para metade da biblioteca dela (`Orpheus · mgba`, `Reanimal · reanimal.exe`
e `Mortal Kombat · mk1.exe` no mockup, `10-perfis.html:539-548`).

## O que entrega

1. **O IPC publica os dois campos que já existem.** `_window_detect_payload`
   ganha `window_detect_current_exe` e `window_detect_current_name`. Backend
   inteiro da sprint: dois `getattr` num dicionário que já é montado.
2. **O botão "Detectar", ao lado do campo do jogo** (`10-perfis.html:594-597`),
   com o tooltip do mockup: *"Pega o jogo que está rodando atrás desta janela e
   monta a regra — funciona com jogo de qualquer lugar, não só da Steam."*
3. **A regra que ele monta, na ordem em que o disco sustenta:**
   - `wm_class` no formato `steam_app_<n>` → ambiente **Jogo da Steam**, campo
     com o número (é o que já se faz hoje);
   - senão, `current_exe` não vazio → ambiente **Jogo**, campo com o basename;
   - senão, `current_class` → ambiente **Jogo**, campo com a classe;
   - nada disso → **não mexe em nada** e diz por quê, reusando o motivo que o
     detector já sabe dar (`state_store.window_detect_reason`, publicado desde
     sempre). Nunca preencher no escuro.
4. **`_aplicar_nascimento_com_jogo` passa a usar o mesmo caminho**, e o "Novo"
   deixa de ser só da Steam — é a linha "existe hoje (só sabia da Steam)" da
   tabela do redesenho. As três guardas estreitas que ela já tem (perfil novo,
   ambiente ainda intocado, campo vazio) **ficam**: elas são o que impede a
   resposta atrasada do daemon de atropelar o que ela digitou.
5. **A prioridade continua vindo de `_prioridade_acima_dos_catch_all`**
   (`profiles_actions.py:4170`) — nada de número novo.

## Como se prova (o teste que morde)

`tests/unit/test_detectar_o_jogo_aberto_nao_e_so_steam.py`, com dublê de IPC
(sem daemon):

1. **O payload leva o exe.** Montar `_window_detect_payload` sobre um store
   dublê com `current_exe="mgba"` e exigir a chave no dicionário. Mordida:
   apague a linha nova e veja reprovar.
2. **Jogo fora da Steam vira regra.** Resposta
   `{"window_detect_current_exe": "reanimal.exe", "window_detect_last_class": "reanimal"}`
   → ambiente `game` e campo `reanimal.exe`. Mordida: devolva o `if not appid:
   return False` e veja o teste reprovar dizendo que o editor não foi tocado.
3. **Jogo da Steam continua ganhando o número**, não o basename do wine — é o
   R-12 que existe porque em Proton o executável é o binário do wine
   (`simple_match.py:6-11`).
4. **O dublê sabe RECUSAR**: sem janela útil, o editor fica **intocado** e a
   frase na tela nomeia o motivo. Régua que só sabe passar não é régua.

**Bancada:** a prova final é com o daemon vivo e um jogo não-Steam aberto —
`scripts/bancada.sh exigir` antes, e a foto da aba com o campo preenchido.

## O que é dela decidir

1. **Com dois jogos abertos, qual é "o jogo aberto"?** O detector responde pela
   janela em **foco**, e a janela em foco na hora do clique é a do Hefesto. O
   `last_class` é sticky justamente por isso (`state_store.py:126-136`) — mas
   sticky guarda a última **útil**, que pode ser de dez minutos atrás. Vale
   mostrar o que ele pegou e deixá-la confirmar antes de gravar?
2. **O botão aparece só no ambiente "Jogo"?** No mockup ele está na linha do
   campo do jogo, que também existe no "Estilo de Jogo" (D-ESTILO-DE-JOGO-E-UM-
   PRESET-UNIVERSAL: *"no campo estilo de jogo tem que aparecer o campo pra
   selecionar o jogo"*).
