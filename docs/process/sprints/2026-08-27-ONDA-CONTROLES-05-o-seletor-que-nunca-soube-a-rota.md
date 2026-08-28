---
sprint: ONDA-CONTROLES-05
# onda: CONTROLES (ver a nota de frontmatter da ONDA-CONTROLES-01)
posse:
  CTRL05:
    - src/hefesto_dualsense4unix/app/widgets/controller_card.py
    - src/hefesto_dualsense4unix/app/widgets/sensor_widgets.py
cria:
  - tests/unit/test_controles_o_som_diz_a_rota.py
bancada: false
depois_de:
  - LEVA-3
  - ONDA-CONTROLES-01
  - ONDA-CONTROLES-03
  - ONDA-CONTROLES-04
nao_toca:
  - src/hefesto_dualsense4unix/app/audio_saida.py
  - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
  - src/hefesto_dualsense4unix/app/actions/status_actions.py
---

# ONDA CONTROLES · 05 — o seletor que nunca soube a rota, e o botão sem pai

**O defeito, numa frase:** o bloco do alto-falante tem **três defeitos de tela
empilhados** — o seletor de canal nasce sem nada marcado e nunca é pintado, ele
só existe no card de **um** controle, e o "Liberar" foi criado e **nunca
empacotado** no card de um controle.

## O que está medido

| defeito | onde |
|---|---|
| `_speaker_canal_pintando` é posto em `False` na construção e **jamais vira `True`** — o único leitor é a guarda de `_on_canal_do_speaker_mudou` | `controller_card.py:2388`, lido em `:4085` |
| o seletor de canal só nasce no ramo **não-compacto** (card de um controle) | `controller_card.py:3774` (`self._speaker_canal = seletor`), dentro do `else` de `:3625` |
| `botao_devolver` ("Liberar") é criado e conectado, e o ramo do card único empacota **só** o `botao_mudo` | criado em `:3577`; empacotado no ramo compacto em `:3668`; ausente do ramo único em `:3776` |
| o alto-falante tem barra de volume, **não** tem medidor de nível | `sensor_widgets.py:503`, `SpeakerBar`, contra `MicMeter` em `:423` |

Nunca virar `True` tem consequência dita: a rota **em vigor** nunca é pintada.
O seletor mostra o que ela clicou na sessão, não o que está valendo — e depois
de reabrir a janela, não mostra nada.

## O que ela pediu

> *"os dois controles deveriam ter os canais do microfone ativos e funcionando.
> Por default, áudio do microfone ativado e no máximo. Áudio do alto-falante dos
> sons do jogo ativado e no máximo. Mas se eu for na aba status, alterar o meu
> controle pra colocar o som silenciado ou todo o som do PC ativo. **Isso deveria
> ser respeitado.**"* (26/08)

> *"Tiramos aquele botão de Silenciar da aba de status (tanto pros sons do PC e
> do Jogo) e aqui se eu isolar o volume no zero entendo que tá desligado o
> output do som."* (26/08) — e `D-O-BOTAO-DO-MIC-MANDA-NA-LUZ` fechou a forma:
> **ícone na ponta do slicer.**

> *"na nova versão Tirou até as ondas sonoras"* (27/08) — as ondas voltam.

## O que esta sprint entrega

1. **O seletor de canal em TODO card**, compacto ou não. Sai do `else` e vira o
   caminho único.
2. **O seletor pinta a rota em vigor.** `definir_estado_do_canal` (`:4414`)
   passa a marcar o item, com `_speaker_canal_pintando` em `True` na volta e
   `False` no `finally` — que é o desenho que o atributo sempre teve e nunca
   ganhou. Sem isso, pintar dispararia o gesto de volta ao daemon.
3. **O "Liberar" do alto-falante ganha pai no card de um controle**, ao lado do
   ícone de mudo. Ele existe desde sempre, e com um controle só na mesa —
   **a tela mais comum** — é inalcançável.
4. **O botão de mudo do alto-falante vira ícone** na ponta do slicer (`(nota musical)` no
   mockup), pela mesma regra do microfone. A ação não muda: manda zero **sem
   perder o volume guardado** (`acao_speaker_mudo`, `:2061`).
5. **A onda do alto-falante**: `MedidorDeSaida` no molde do `MicMeter`
   (`sensor_widgets.py:423`), com as mesmas 14 amostras deslizantes, o mesmo
   piso de 16% (silêncio é uma linha baixa e **visível**, não a ausência do
   desenho) e o mesmo stub sem GTK.

## Como se prova (o teste que morde)

`tests/unit/test_controles_o_som_diz_a_rota.py`:

1. **A rota que volta do daemon acende no seletor.** `definir_estado_do_canal`
   com a rota 3 marca *"Todo o som do PC"*; com a 0, marca *"Sons do jogo"*.
   Arranque a cura (devolva `_speaker_canal_pintando = False` fixo) e veja
   reprovar.
2. **Pintar não dispara gesto.** Um dublê de daemon que **conta chamadas**:
   pintar a rota vinda dele não pode gerar um `speaker.set` de volta. É a
   mordida que separa "marcou" de "marcou e ecoou" — e o eco é rajada de IPC.
3. **Os dois cards têm seletor.** Monte a mesa com um controle e com dois: o
   seletor existe nos dois casos. Hoje o teste passa com um e reprova com dois.
4. **O "Liberar" tem pai nos dois.** `get_parent() is not None` no card único e
   no compacto. Um teste que só verificasse a existência do objeto passaria
   hoje — o objeto existe; o que falta é o pai.
5. **A onda desenha silêncio.** Com nível zero, as 14 barras têm o piso, não
   altura zero; com `limpar()`, a onda zera.

## O que é dela decidir

1. **Os dois "Liberar" não estão no mockup.** O contrato do redesenho os mantém
   ("*devolve ao firmware a posse do volume*", "*devolve ao botão físico do
   controle o comando do mudo*"); o mockup aprovado desenha só slicer + ícone.
   *Eles ficam como um segundo ícone, viram item da dica, ou saem da tela e
   continuam só no `hefesto mic`/`speaker` da linha de comando?*
   **PROVISÓRIO — decisão dela:** ficam, como ícone ao lado do de mudo. Tirar
   uma função sem a palavra dela é o defeito que a regra "nada se perdeu"
   existe para matar.
2. **O ícone do microfone carrega TRÊS ações, não duas.** Hoje é um botão só
   cujo rótulo gira entre `Silenciar`, `Ativar` e `Liberar`
   (`acao_mic`, `:1980-1988`). *O ícone mostra o estado (mudo/ativo) e a
   terceira ação vai para o "Liberar" separado, ou o ícone cicla os três?*
   **PROVISÓRIO — decisão dela:** o ícone faz mudo/ativo, e o `Liberar` é o
   segundo ícone do item 1 — dois significados diferentes não cabem num clique.
