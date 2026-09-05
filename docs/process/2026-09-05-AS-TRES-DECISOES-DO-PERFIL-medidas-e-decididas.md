# As três decisões do perfil — 05/09/2026

Ela pediu, com estas palavras:

> *"ao pular e sair configurando de aba em aba o perfil vai se lembrando de
> cada config de cada aba pra cada controle. aí aplicar aplica todas as configs
> naquele perfil e salvar se lembra disso quando eu for jogar o jogo e no dia
> seguinte e por diante. pra cada perfil e dentro dele cada config pra cada
> comtrole"*

O ciclo foi medido de ponta a ponta, em `HOME` de mentira, sem tocar
`~/.config/hefesto-dualsense4unix`: perfil no disco → ela configura nas abas
02, 04, 05 e 06 → volta e clica **Salvar** no rodapé.

```
SOBREVIVEM 5 de 11
```

**E três dos seis perdidos não se perdiam por esquecimento: o Salvar os
DESTRUÍA** — o produto já tinha gravado o valor certo no disco e o rodapé o
desfazia. Esses três fecharam no mesmo dia (`93c26262`), e o desbloqueador das
duas seções que o rascunho não sabia escrever também (`f699aef8`).

O que sobra são três decisões de produto. **Estão decididas aqui**, porque ela
delega decisão de produto e a exceção é a validação de tela.

---

## D1 — O que um perfil GUARDA: só o que ela tocou, ou tudo?

Três frases da casa não cabiam juntas, e a contradição está registrada em
`profiles/schema.py` sob o título *"A CONTRADIÇÃO ABERTA"*:

| frase | de onde vem |
| --- | --- |
| campo `None` = **sem opinião**; perfil que não pediu nada não impõe nada | contrato do `ControllerOverrides` |
| *"o perfil tem de guardar tudo"* | ela, 18/08/2026 |
| áudio e giroscópio nascem **ligados** em todo jogo | `D-AUDIO-E-GIRO-NASCEM-LIGADOS`, 25/08/2026 |

**DECIDIDO: (c) — grava tudo o que ela tocou, com carimbo de origem por campo.**

A peça já existe e já está testada: os flags `dirty` do `DraftConfig`
(`MouseDraft.dirty`, `MicDraft.dirty`, `SpeakerDraft.dirty`,
`mode_dirty`/`suppress_dirty`) são exatamente esse carimbo — o crachá de *"ela
mexeu NESTA sessão"*, que é a distinção que o `None` sozinho não sabe dizer.

Por que não as outras duas: **(a)** *só o que ela tocou, `None` continua
silêncio* contradiz o *"guardar tudo"* dela; **(b)** *o estado inteiro, sempre*
faz todo perfil impor áudio e giro a todo jogo, e ela pediu o contrário em
25/08. Só (c) satisfaz as três frases ao mesmo tempo.

E a fala dela desta madrugada fecha por cima: *"o perfil vai se lembrando de
cada config"* — **de cada config que ela fez**, não do estado do mundo.

---

## D2 — Rascunho de verdade, ou persistência no clique?

Hoje o produto faz **as duas coisas ao mesmo tempo**, e foi daí que vieram os
três campos destruídos: cinco caminhos gravam no clique e o rodapé regravava
por cima com o disco velho.

**DECIDIDO: (b) — persistência no clique em toda parte, com o rodapé como rede
de segurança.**

Ela já decidiu ação imediata em 01/09, e cinco lugares do produto já tomaram
esse caminho sozinhos (aba 04 brilho e auto-cores, aba 05 força e intensidade,
aba 06 guardar-definições, e o daemon em `sensor.set` e `rumble.motores.set`).
O requisito dela é **durabilidade** — *"salvar se lembra disso quando eu for
jogar o jogo e no dia seguinte"* —, não o gesto de salvar; e (b) é o único que
sobrevive a fechar a janela sem clicar em nada.

**O que "Aplicar" e "Salvar" passam a significar**, e nenhum dos dois some:

| botão | o que faz |
| --- | --- |
| **Aplicar** | manda o perfil inteiro aos controles agora — é o que ela chamou de *"aplicar aplica todas as configs naquele perfil"* |
| **Salvar** | grava o perfil no disco, e continua sendo o caminho do "Salvar como" com nome novo |

Por que não **(a) rascunho universal**: contradiz a ação imediata de 01/09 e
reintroduz o estado que se perde se a janela fechar. Por que não **(c) os dois**:
é o que existe hoje, e é o que produziu o defeito.

---

## D3 — Os cinco globais: esperar o caminho por unidade, ou aceitá-los globais?

`mouse`, `key_bindings`, `button_actions`, `teclado_emulado` e
`suppress_desktop_emulation` só viram por-controle depois de um caminho de
**entrada** por unidade. Hoje o `Daemon` tem UM `_mouse_device` e UM
`_keyboard_device`, alimentados por um `read_state()` por tique, e *"INPUT vem
SEMPRE do controle PRIMÁRIO"*. Guardar por controle é trivial; **fazer valer**
exige ler cada peça e despachar para o device dela.

**DECIDIDO: (b) — aceitá-los globais por enquanto, e DIZÊ-LO na tela.**

**(c) — guardar por controle agora e ligar depois — está proibido pela regra da
própria casa**, com régua exaustiva nos dois sentidos
(`tests/unit/test_perfil_por_controle_o_campo_espera_o_caminho.py`):

> *"Campo que grava e ninguém lê é pior que campo nenhum — ele faz a tela
> prometer."*

**(a)** — construir o caminho de entrada agora — é uma frente inteira e não deve
bloquear os catorze campos que já têm caminho. Ela fica na fila, com dono e
endereço (`daemon/lifecycle.py` + `PyDualSenseController.read_state`), e
destrava os cinco de uma vez quando chegar a vez dela.

**O que a tela passa a dizer:** onde a aba oferece um destes cinco, a linha de
ressalva diz que o ajuste vale para a mesa inteira, não só para o controle
selecionado. Sem isso a tela promete por-controle e entrega global — que é o
mesmo defeito por outro caminho.

---

## O que estas três decisões destravam

**Fase 1 — o Salvar passa a ler o vivo** (`draft_config.py` já pronto em
`f699aef8`; falta `rodape._draft_do_ativo` ler `speaker`, `audio.mic_mudo` e
`sensores` por controle, e `rumble_policy`/`passthrough` e `mouse_emulation`
globais).

**Fase 2 — as abas que ainda não gravam**, uma por arquivo, todas em paralelo:

| aba | arquivo | o que passa a persistir |
| --- | --- | --- |
| 02 | `pacotes/a02_controles.py` | `mic.muted`, `speaker.volume/.muted/.rota` por controle |
| 03 | `pacotes/a03_gatilhos.py` | os gatilhos do `_RASCUNHO` |
| 06 | `pacotes/a06_navegacao.py` | `mouse.*` e `teclado_emulado` no perfil, e a ressalva de D3 na tela |

**Fase 3 — o caminho de entrada por unidade.** Frente própria, não bloqueia
nada acima, e a ordem que não se inverte é a da casa: primeiro o caminho por
unidade existir, depois o campo entrar no esquema.
