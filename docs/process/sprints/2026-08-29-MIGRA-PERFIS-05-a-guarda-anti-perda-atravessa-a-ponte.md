---
sprint: MIGRA-PERFIS-05
onda: PERFIS
posse:
  MP5:
    - src/hefesto_dualsense4unix/app/actions/perfis_web.py
    - src/hefesto_dualsense4unix/app/actions/profiles_actions.py
cria:
  - tests/unit/test_migra_perfis_05_a_guarda_atravessa_a_ponte.py
bancada: false
depois_de:
  - MIGRA-PERFIS-01
  - MIGRA-PERFIS-02
  - MIGRA-PERFIS-03
  - MIGRA-PERFIS-04   # a válvula do perfil que a tela não mostra vem antes do Salvar
  # A ONDA PERFIS de 27/08: oito das nove reivindicam `profiles_actions.py`, e
  # quem divide arquivo corre EM SÉRIE (R5). O índice desta onda diz o que
  # sobra de cada uma depois da decisão do WebKit.
  - ONDA-PERFIS-01
  - ONDA-PERFIS-02
  - ONDA-PERFIS-03
  - ONDA-PERFIS-04
  - ONDA-PERFIS-05
  - ONDA-PERFIS-06
  - ONDA-PERFIS-08
  - ONDA-PERFIS-09
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/profiles/loader.py
  - src/hefesto_dualsense4unix/app/actions/footer_actions.py
  - novo-layout/
---

# MIGRA PERFIS · 05 — a guarda anti-perda atravessa a ponte

**O defeito:** esta é a aba com a maquinaria anti-perda mais densa da janela —
`NUNCA-TROCA-O-ALVO-01`, `SALVAR-NAO-REBAIXA-01/02`, `PERFIL-SALVA-TUDO-01` — e
**três dos cinco termos dessa guarda são exatamente os widgets que o mockup
apaga**. Com o agravante que a torna invisível: a função é **declaradamente
tolerante a widget ausente**, ou seja, **ela desliga em SILÊNCIO**.

```
_assinatura_da_regra_no_editor   profiles_actions.py:4050-4079
    fotografa CINCO widgets:
      _selected_simple_choice()        ← fica (vira o <select> do ambiente)
      profile_simple_custom_name       ← fica (vira o campo do jogo)
      profile_window_class_entry       ← MORRE com a página avançada
      profile_title_regex_entry        ← MORRE
      profile_process_name_entry       ← MORRE
```

E o docstring dela diz, textualmente: *"Tolerante a widget ausente (dublê de
teste, glade antigo): campo que não dá para ler entra vazio, **do mesmo jeito nas
duas fotos**"*. Sem os três, a assinatura vira `(ambiente, nome do jogo)` para
**todo** perfil — e a `SALVAR-NAO-REBAIXA-01` passa a aprovar como *"ela não
mexeu na regra"* edições que mexeram. **Nenhum teste fica vermelho. A janela não
diz nada. O perfil dela é que muda.**

O estrago que essa guarda existe para impedir já aconteceu:
`profiles/loader.py:1229-1237` — *"os perfis dela foram corrompidos por dentro da
janela — perderam o `match` (virou `{"type": "any"}`) e as prioridades escalaram
até 191"*.

## Os treze gestos, e o motor de cada um

| Gesto | Motor hoje | O que esta sprint faz |
|---|---|---|
| clique numa linha da lista | `on_profile_selection_changed` → `_ha_trabalho_no_editor:1909` → `_populate_editor:3952` | **liga** |
| Ativar | existe | **liga** |
| Novo | existe (`_aplicar_nascimento_com_jogo:3088`) | **liga** |
| Remover | existe — **pergunta antes**, e a caixa é GTK | **liga** |
| Duplicar | existe | **liga** |
| Recarregar | `_reload_profiles_store:3772` | **liga** |
| Nome (campo) | existe | **liga** |
| Prioridade | `profile_priority_scale` + `_on_prioridade_tocada:4081` | **espera a palavra dela** — o mockup desenha um trilho INERTE (ver `MIGRA-PERFIS-02`) |
| Funciona em | `_select_radio:3749` | **liga** |
| Nome do jogo | existe | **liga** |
| Salvar (o do rodapé) | `footer_actions` + `on_profile_save` | **liga, e fecha a divergência** (abaixo) |
| Detectar | **não existe**: o daemon lê (`daemon/state_store.py:714`) e o IPC não publica (`daemon/ipc_handlers.py:2237-2285`) | **nasce desligado, com o motivo** — motor é a `ONDA-PERFIS-03` |
| Voltar à de ontem | **existe e nunca teve tela**: `profiles/loader.py:1269` e `:1509`, com `HISTORICO_MAX_VERSOES = 10`; chamadores só na CLI (`cli/cmd_profile.py:243` e `:282`) | **nasce desligado** — quem lhe dá tela é a `ONDA-PERFIS-05`, e esta sprint não a invade |
| Estilo de Jogo | não existe | **nasce desligado** (`MIGRA-PERFIS-04`) |

**Botão que aceita clique e não faz nada é pior que botão ausente** — ele
consome a confiança de quem clicou. Os três sem motor nascem visivelmente
desligados, com a frase do que falta, no padrão da casa: *o quê, por quê, e o
que fazer*.

## Os dois Salvar, e por que a fusão é obrigatória agora

"Salvar este perfil" **sai da tela por ordem dela**
(`src/hefesto_dualsense4unix/interface/CORRECOES-DELA.md`, aba Perfis) enquanto o contrato o
lista como *"fica"*. No motor novo a ordem dela vence por construção: o desenho
não o tem, logo o produto não o tem, e **o rodapé passa a ser o único Salvar**.

**Isso não é remover um botão — é fundir dois alvos que já divergiram.** O do
editor grava `_alvo_do_salvar` (o perfil que `_populate_editor` memorizou); o do
rodapé grava o **perfil ativo**. Os dois já miraram arquivos diferentes no mesmo
instante. Fundir sem fechar a divergência é o caminho mais curto para gravar por
cima do perfil errado — e é justamente o dano que a `NUNCA-TROCA-O-ALVO-01`
existe para impedir.

A fusão é o assunto da `ONDA-PERFIS-08`, que também toca
`app/actions/footer_actions.py`. **Esta sprint não abre aquele arquivo**
(`nao_toca`): ela liga o gesto do rodapé ao alvo memorizado e **exige** que a
`ONDA-PERFIS-08` tenha fechado a regra de qual alvo manda. Se ela não fechou,
esta sprint para aqui e diz por quê.

## As caixas GTK continuam GTK — e alguém tem de decidir quem bloqueia quem

Três gestos abrem diálogo, e nenhum deles vira HTML: Remover pergunta antes;
Salvar pode abrir `_prompt_rename_or_copy` (`profiles_actions.py:3603`) e
`dialogo_renomear_ou_copiar` (`:1198`); e a troca de seleção passa por
`_ha_trabalho_no_editor`.

**Enquanto a caixa modal está aberta, a página continua viva atrás dela.** No
GTK, a modal congelava a aba porque a aba era widget. Aqui, a aba é um `WebView`:
um clique que chegue à página durante a caixa produz um segundo gesto na fila,
e o segundo pode ser justamente o que troca o alvo. **Quem escrever a ponte tem
de bloquear a página enquanto a caixa está aberta** — e provar que bloqueou.

## Como se prova (a mordida)

`tests/unit/test_migra_perfis_05_a_guarda_atravessa_a_ponte.py`:

- **A MORDIDA QUE FECHA A SPRINT — a assinatura não pode encolher em silêncio.**
  Dois perfis com **a mesma** dupla `(ambiente, nome do jogo)` e regras
  **diferentes** por baixo. Abra um, mexa na regra, salve: a guarda tem de dizer
  *"ela mexeu"*. Depois arranque da assinatura o termo que substituiu os três
  widgets mortos: o teste **passa a ver "ela não mexeu"** sobre uma edição que
  mexeu — e é isso que ele reprova. Uma régua que só conte termos da tupla não
  pega isto: **ela tem de comparar duas regras que a tela não distingue.**
- **`_ha_trabalho_no_editor` continua sendo o portão**: com `_new_profile`
  armado, um `active_profile` novo chegando do daemon **não** repinta o editor.
  Arranque a chamada e o campo Nome troca sozinho — que é a queixa literal dela:
  *"clico em salvar e ele salva com um nome aleatório ou de outro perfil"*.
- **os cinco marcadores de gesto chegam pela ponte**: `_regra_tocada`,
  `_prioridade_tocada` e `_modo_tocado` armam a partir da mensagem do JavaScript,
  e **não** armam quando quem mexeu foi a pintura (a repintura do editor não é
  gesto dela). Arranque a distinção e todo `_populate_editor` passa a contar
  como edição — o que trava o Salvar em falso.
- **a caixa bloqueia a página**: com a modal aberta, uma mensagem de gesto que
  chegue pela ponte é **descartada ou enfileirada**, nunca executada. Arranque o
  bloqueio, mande "clique em outra linha" durante a caixa, e veja o alvo trocar
  por baixo do Salvar.
- **os três desligados estão desligados**: Detectar, Estilo de Jogo e "Voltar à
  de ontem" não têm gesto registrado na ponte, e a página os mostra desabilitados
  com texto. Registre o gesto sem motor e o teste reprova.
- **um Salvar só**: contar os gestos de gravação registrados na ponte → **1**.

## O que é dela decidir

- **A prioridade volta a ser arrastável?** Ver `MIGRA-PERFIS-02`: o mockup
  desenha um trilho que não é controle, e ela pediu *"prioridade é slicer"*.
  Sem a decisão, esta sprint entrega doze gestos e declara o décimo terceiro.
- **"Remover" pergunta antes — em caixa GTK ou dentro da página?** A caixa GTK
  herda o tema do sistema e vai parecer de outro programa em cima de uma tela
  que ela desenhou inteira. Fazer a caixa em HTML é desenho novo, e desenho novo
  é dela. **Enquanto ela não disser, fica a caixa GTK** — é o que existe e é o
  que já foi testado.
