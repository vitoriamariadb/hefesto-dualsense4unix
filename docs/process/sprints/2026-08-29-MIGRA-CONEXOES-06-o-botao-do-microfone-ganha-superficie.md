---
sprint: MIGRA-CONEXOES-06
onda: MIGRA-CONEXOES
posse:
  M6:
    - src/hefesto_dualsense4unix/app/draft_config.py
    - src/hefesto_dualsense4unix/app/actions/config/secao_controles.py
cria:
  - tests/unit/test_migra_conexoes_o_botao_do_mic_tem_superficie.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-01
  - MIGRA-CONEXOES-01
  - MIGRA-CONEXOES-04
  # SÉRIE por arquivo: a 05 escreve o `dados()` desta seção.
  - MIGRA-CONEXOES-05
  # SÉRIE por arquivo (R5): as seis abaixo também possuem `app/draft_config.py`.
  - ONDA-VIBRACAO-04
  - ONDA-VIBRACAO-05
  - ONDA-CONTROLES-06
  - ONDA-CONTROLES-07
  - ONDA-GATILHOS-04
  - ONDA-NAVEGACAO-01
  # SÉRIE por arquivo (R5): as cinco abaixo possuem `secao_controles.py`.
  - ONDA-CONEXOES-05
  - ONDA-CONEXOES-06
  - ONDA-CONEXOES-09
  - ONDA-CONEXOES-11
  - ONDA-JOGAR-07
  - LEVA-3
  - LEVA-4
  # A borda com o tom do plástico é da onda Controles, e ela abre a mesma
  # seção: quem dá o contrato vem antes de quem o consome.
  - MIGRA-CONTROLES-12
nao_toca:
  - src/hefesto_dualsense4unix/daemon/ipc_draft_applier.py
  - src/hefesto_dualsense4unix/daemon/lifecycle.py
  - src/hefesto_dualsense4unix/profiles/schema.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - scripts/telas/aba08.py
---

# MIGRA CONEXÕES · 06 — o botão do microfone ganha superfície

**O defeito é "a casa sabe e o produto não faz", na forma mais barata que ele
tem nesta casa: o caminho inteiro está escrito e nenhuma tela o aciona.**

| peça | onde |
|---|---|
| o campo do perfil | `profiles/schema.py:451` — `button_toggles_system: bool` |
| o campo do rascunho | `app/draft_config.py:222` — `button_toggles_system: bool \| None = None` |
| quem aplica no daemon | `daemon/ipc_draft_applier.py:562-593` (`_apply_mic`) |
| quem consulta | o `mic_button_loop`, a cada evento — *"a mudança vale já no próximo toque do botão, sem restart"* |

E o próprio rascunho diz, em `draft_config.py:220-222`: *"`None` = sem opinião (o
default): ninguém escolheu (…). **Quem lhe der superfície escreve `True`/`False`
aqui e o gate abre sozinho.**"*

O mockup dá a superfície — o segundo `<select>` do bloco "Microfone e botões",
com **Só este controle** / **O computador inteiro**
(`08-conexoes.html:1536` e as irmãs por controle).

## A contradição que a superfície revela, e ela é de escopo

O mockup põe o campo **por controle**, quatro vezes. O produto guarda **um** por
máquina: `_apply_mic` escreve `self.daemon.config.mic_button_toggles_system` —
uma propriedade do daemon, sem `uniq` nenhum. Ligar os quatro `<select>` ao mesmo
campo dá uma tela em que mexer no P1 muda o P2 sozinho, e ninguém entende por
quê. **São três saídas, e a escolha muda o tamanho do trabalho:**

1. **Um campo por máquina, um campo na tela.** Sai dos quatro controles e vira
   linha única do quadro. Barato, e contradiz o desenho aprovado.
2. **Quatro na tela, um por baixo, com a tela dizendo isso.** O `?` explica que a
   escolha vale para a mesa. Mentira mansa; a casa não gosta.
3. **O flag passa a ser por `uniq`, como o gate do microfone já é.**
   `daemon/subsystems/bt_mic.py` já trocou um `bool` por um **conjunto de
   `uniq`** exatamente por esta razão, e o precedente é a regra dela de 22/08:
   *"por controle"*. É o caminho certo e é trabalho de daemon — **fora da posse
   desta sprint**, que só o declara.

**Esta sprint entrega a saída 1 ou a 2, e nunca a 3 sozinha.** A 3 é sprint de
daemon, e ela nasce aqui como pedido.

## O que entrega

1. **O `<select>` escreve o rascunho.** O gesto `data-g="mic.botao"` (endereço da
   `MIGRA-CONEXOES-03`) chega ao `pagina.ao_gesto` e grava
   `MicDraft.button_toggles_system` — `True` para "O computador inteiro",
   `False` para "Só este controle". `None` continua significando **sem opinião**,
   e some da tela como "ainda não escolhido" — não como "Só este controle".
2. **O gate por campo continua fechado até alguém escolher.** O
   `draft_config.py:203-215` conta a história: quando o gate era por **seção**,
   qualquer gesto de microfone fazia o "Aplicar" levar junto o default de
   fábrica — *"uma opinião que ninguém deu"* — e isso **derrubava calado um
   `False` escolhido no `DaemonConfig`**. Escrever `None` no lugar de um valor de
   fábrica é entrega desta sprint, não detalhe.
3. **A tela diz o que o produto faz com isso.** Ativar perfil **não** restaura
   este campo (`profiles/manager.py::apply_mic` aplica volume e mudo, e nada
   mais), e o valor **volta no restart do daemon**. Ou o `?` diz isso, ou a
   escolha vira promessa que o produto não cumpre — que é o padrão
   `O-PRODUTO-RESPONDE-PELO-TRANSPORTE-E-NAO-PELO-EFEITO`.
4. **Nenhuma linha do daemon.** `ipc_draft_applier.py` e `lifecycle.py` estão em
   `nao_toca`: o caminho já existe e funciona; o que falta é a ponta de cá.

## Como se prova (a mordida)

`tests/unit/test_migra_conexoes_o_botao_do_mic_tem_superficie.py`:

* **a lápide fecha.** O registro
  `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py` deixa de listar
  `button_toggles_system` como sem chamador — e o portão fica **verde por
  entrega**, não por remoção da linha. **Mordida:** desligue o handler do gesto e
  o portão volta a acusar.
* **o gesto vira valor, e o valor vira IPC.** Dublê que captura o rascunho:
  escolher "O computador inteiro" põe `True`; escolher "Só este controle" põe
  `False`; **não tocar em nada deixa `None` e a chave não viaja**.
  **Mordida:** troque o `None` inicial por `False` e veja o teste reprovar com a
  frase de `draft_config.py` — opinião que ninguém deu.
* **um campo, um efeito.** Se a saída escolhida for a 1 ou a 2, mexer no
  controle A e ler o controle B tem de devolver **o mesmo valor**, e a tela tem
  de dizê-lo. **Mordida:** faça a tela mostrar valores diferentes por controle
  sobre um campo único e o teste reprova — é a tela afirmando um escopo que o
  produto não tem.
* **o texto não promete o que não há.** O `?` cita que o campo não sobrevive à
  ativação de perfil nem ao restart do daemon. **Mordida:** apague a frase e o
  teste reprova. (É `scripts/validar-fala-de-tela.py` território: frase de
  diagnóstico diz o quê, por quê e o que fazer.)

## O que é dela decidir

* **Qual das três saídas.** A 3 (por `uniq`, como o gate do mic já é) é a que
  casa com a regra dela de 22/08 — *"por controle"* — e é a única que sustenta o
  desenho aprovado. Ela custa daemon, e por isso não corre dentro desta onda.
* **O rótulo.** "Só este controle" / "O computador inteiro" vêm do mockup
  aprovado; sob a saída 1 o campo muda de casa e o rótulo tem de mudar com ele.
