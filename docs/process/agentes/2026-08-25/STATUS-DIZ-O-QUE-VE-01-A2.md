# STATUS-DIZ-O-QUE-VÊ-01 · agente A2

Árvore `hefesto-voo/STATUS-DIZ-O-QUE-VE-A2`, branch `voo/STATUS-DIZ-O-QUE-VE-A2`,
base `1835f3b`. Madrugada de 25/08/2026.

**Fechadas:** T1, T2 (provisória), T3, T4 (a metade que faltava), T5 (metade de
produção), T8, T11, T12.
**Recusada com motivo medido:** T9 — a premissa dela é falsa.
**Não executadas:** T6, T7, T10, T13, T14, T15, e os sete arquivos da T5.

---

## O que mudou

### T1 — a caixa vazia de 910px morre

`app/widgets/controller_card.py`, `_montar_ui`. O `slot_motion` — um `Gtk.Box`
**sem nenhum filho**, com `expand=True, fill=True` — sai da faixa da bateria do
card único. Medido nesta bancada, numa janela de 1870px: **963px de alocação**
pagos a um widget sem conteúdo (a foto dela, de 1920, mediu 910).

O único serviço que ele prestava — impedir a bateria de saltar para a esquerda
quando a linha ao lado se cala — passa a ser prestado por `pack_end` +
`halign=END`, que ancora a bateria na direita nos dois estados e não cobra
largura por isso.

### T2 — o hertz volta à tela · **PROVISÓRIO, aguarda o olho dela**

O `_motion_label` (GYRO-03) passa a ser empacotado nos **dois** modos. Ele já
era alimentado a cada tique e nunca chegava à tela fora do card compacto, que
produção nenhuma constrói desde a EMPILHA-02.

De **17/08 a 25/08 o hertz do giroscópio não apareceu em configuração nenhuma
da janela**: a SEM-BARRA-DA-VERDADE-01 desempacotou a linha da verdade a pedido
dela e ninguém notou que ela era a única portadora do número.

A sprint dá duas saídas e a escolha é dela. **Entreguei a (a)** — a linha do
giroscópio ao lado da bateria — marcada `PROVISÓRIO — decisão dela` no código,
com a (b) descrita ao lado. Razão da escolha: (a) cumpre o pedido literal dela
de 01/08 (*"a bateria fica ao lado do hertz do giroscópio até o final"*) **sem**
devolver a guia que ela mandou remover em 17/08 — o `_motion_label` é uma linha
só, do giroscópio, e não a barra da verdade. A linha da verdade continua criada,
alimentada e fora da tela: aquilo é decisão medida e não se apaga.

### T3 — três comentários que a leva seguinte tornou falsos

Eram **três**, não dois (a sprint listou dois). O terceiro estava em
`_montar_estado_global` e nomeava um empacotador para a linha da verdade que não
existe desde 17/08. O do `_update_motion` era o pior: servia de **justificativa
para não pintar**.

Substituídos pelo fato, com a data em que deixaram de valer. **Não reproduzi as
frases falsas ao lado das certas** — a regra da casa é que fato errado sai de
todos os lugares, e manter as duas versões vivas é o defeito que ela existe para
matar.

### T4 — cada card volta a receber o registro do PRÓPRIO controle

**Isto é achado desta noite, e é a metade que a Z2-7 (`b036dca`, ontem) deixou
aberta.** O coordenador mandou "confira e não refaça"; conferi.

A Z2-7 pôs `_status_card_keys_for` a percorrer `_por_numero_de_identidade`, e as
**duas** grades que consomem as chaves continuaram casando `keys` com a lista
**crua** do daemon, posição a posição. Medido sobre
`tests/fixtures/state_full_quatro_controles.json` (a mesa está fora de ordem de
propósito: `player_slot` 4, 1, 3, 2): **três das quatro posições** recebiam o
registro de outro aparelho — bateria, analógicos, luz e microfone do vizinho,
debaixo do título certo.

É a família do defeito que `_por_numero_de_identidade` documenta e evita desde a
PLAYER-01, **agravada**: lá a pessoa clicava no controle errado; aqui ela **lê**
o errado, e nada na tela denuncia.

A cura é uma função só, `_conectados_na_ordem_dos_cards`, chamada pelas três
pontas (chaves, cards, painéis do "No jogo"). Enquanto houver dois lugares
ordenando, a divergência volta.

### T5 — a metade de produção

A docstring de `ControllerCard` ensinava `ControllerCard(compact=True)  #
compact = 2+ cards`. **Falso desde a EMPILHA-02 (02/08/2026)** — 23 dias —, e é
a fonte dos sete arquivos de teste que medem e travam um desenho que nenhuma
janela monta. Substituída pelo que produção faz.

Junto, o portão que faz a pergunta que nenhum portão desta casa fazia: **existe
chamador de produção?** Escopo desta aba, um alvo só.

### T8 — minimizar mata a captura de microfone

`app/app.py`. A docstring de `set_status_tab_visivel` prometia, desde o primeiro
dia, que a captura morre *"com a janela em outra aba — ou minimizada"*, e o
`interface.md` repetia a promessa. Havia **dois** gatilhos, e nenhum é a
minimização. Com a aba Status à vista e a janela minimizada, o `parec` de cada
controle continuava capturando o microfone dela.

Gancho `window-state-event` com o bit `ICONIFIED`, simétrico ao `delete-event`,
com o mesmo `getattr` defensivo. **Restaurar devolve a captura** — sem essa
metade, minimizar uma vez deixaria o medidor morto até a próxima troca de aba.
Quem decide na volta é a mesma pergunta do `switch-page`, por
`id_da_pagina_corrente` (nunca a posição da página — EST-10).

### T11 — a documentação para de descrever a linha que sumiu

`docs/usage/interface.md`: o parágrafo que descrevia a linha "No jogo agora: …"
na aba Status sai. No lugar, o que a tela mostra hoje — o giroscópio à esquerda,
a bateria ancorada à direita, e os cartões na mesma ordem da fita. A promessa das
threads passa a citar a minimização **porque agora o gancho existe**.

### T12 — a bateria cala com a mesa vazia

A decisão sai do `_render_slow_state` e passa a morar em `_bateria_da_mesa`,
pura e testável, que olha **o topo E a lista**. Ela consome a régua da Z5
(`app/mesa.py` é o dono único de quem está na mesa) e não a duplica.

O que ela **não** faz: recusar o número quando o daemon não publica
`controllers`. Ausência de lista não é evidência de mesa vazia — daemon antigo
ou payload parcial voltaria a ter uma aba muda, e seria trocar um erro por
outro. Há teste para esse caso.

### T9 — **recusada**, e o motivo é medido

Executei a T9 como escrita: dei corpo ao `_speaker_rota_slot`. Um teste
existente reprovou na hora —
`test_o_botao_da_rota_nao_migra_mais_para_o_card`, cuja mordida declarada é,
literalmente, *"devolver o `_speaker_rota_slot` ao card"*.

O `None` é **decisão dela**, de 02/08/2026 (SOM-CANAL-01/E3): *"ele deixa de
existir como botão isolado. Vira o estado 'Todo o som do PC' do seletor"*.

**A §2.10 da sprint está errada sobre o fato:** o comando ESTÁ na tela com um
controle na mesa. O teste do hertz desta leva lista os textos visíveis do card e
lá estão `'Sons do jogo'`, `'Todo o som do PC'`, `'Silenciar'`. O que não está é
o botão avulso do Glade — e é assim porque ela pediu. Dar corpo ao slot
devolveria a ROTA-ÓRFÃ-01, paga em 01/08: plugar um segundo controle recria os
cards, o `child.destroy()` deixa o botão órfão, e ela perde o desfazer da rota
exatamente no co-op.

O que a §2.10 pegou de verdade — e é achado bom — foi a **docstring** de
`_alojar_botao_da_rota`, que prometia entregar a SOM-ROTA-NO-CARD-01 três
semanas depois de o reparenteamento parar de acontecer. **Foi essa frase que fez
uma sprint inteira ler o código como defeito e propor desfazer uma decisão
dela.** Substituída, com a data e o ponteiro para a decisão que a aposentou.

---

## Qual mordida prova

Todas vistas **reprovando** com a cura arrancada, e a saída está colada abaixo.

### T1 · `test_status_faixa_gyro_bateria`

```
SEM A CURA
E  AssertionError: a faixa da bateria (largura 1374px) paga largura a widget
   SEM NENHUM CONTEÚDO: {'Box': 963}. O teto é 4px — o que expande tem de ter
   o que mostrar
COM A CURA
4 passed in 0.52s
```

### T1 · `test_a_bateria_fica_ancorada_na_direita_com_a_linha_calada`

```
`pack_end` TROCADO POR `pack_start`
E  AssertionError: a bateria mudou de lugar entre o giroscópio fluindo
   (direita em x=906) e o giroscópio calado (x=647)
DEVOLVIDO
4 passed in 0.49s
```

### T2 · `test_o_hertz_chega_a_tela`

Reprova contra a árvore de 24/08 **sem cura arrancada nenhuma** — é essa
reprovação, registrada antes do conserto, que a valida:

```
SEM A CURA
E  AssertionError: o hertz do giroscópio não chega à tela do card único:
   nenhum dos 28 textos visíveis contém 'Hz'. Árvore: ['Perfil ativo:',
   'Nenhum', 'Hefesto:', 'Consultando...', 'Bateria:', '80 %', '80 %',
   'Giroscópio (graus/s)', '40 / 255', 'R2', '200 / 255', 'L2', '1 toque',
   'Touchpad', '#ff79c6', 'Lightbar', 'Analógico\nesquerdo', 'X: 60\nY:200',
   'Analógico\ndireito', 'X:180\nY: 90', ' ATIVO ', 'Silenciar', 'Microfone',
   'Sons do jogo', 'Todo o som do PC', 'Silenciar', 'Alto-falante',
   'Controle 1 — USB']
COM A CURA
5 passed in 0.53s
```

Ele varre `get_text()` da árvore e não o `_motion_label` pelo atributo **de
propósito**: o defeito de 17/08 foi exatamente um rótulo alimentado e não
empacotado — ler o widget pelo atributo teria passado o tempo todo.

### T3 · `test_nenhum_comentario_promete_a_linha_da_verdade_na_tela`

**Mordida escrita por mim — a sprint não declarou nenhuma para T3** ("o portão é
a revisão de A-1", que não sobrevive a um `/clear`).

```
SEM A CURA (os três comentários de volta)
E  AssertionError: o código volta a afirmar que a linha da VERDADE diz o
   giroscópio na tela do card único — falso desde 17/08/2026: [
   'controller_card:4553: o giroscópio é dito pela linha da verdade',
   'controller_card:2650: quem a empacota é o bloco do motion',
   'controller_card:2649: o lugar dela é a faixa da linha 2']
COM A CURA
5 passed in 0.53s
```

O portão **achata o módulo inteiro numa linha só** antes de procurar. Uma
varredura por linha seria burlada pela quebra de linha do próprio comentário — e
foi partida em duas linhas que a afirmação do `_update_motion` sobreviveu. A
primeira versão desta régua não a via.

### T4 · `test_cada_card_recebe_o_registro_do_proprio_controle`

```
SEM A CURA
E  AssertionError: card alimentado com o registro de OUTRO controle — a chave
   diz um aparelho e o dado é de outro: [
   {'posição': 0, 'uniq na chave': 'aabbcc000003',
    'uniq no registro': 'aabbcc0000d8', 'player_slot que a tela vai imprimir': 4},
   {'posição': 1, 'uniq na chave': 'aabbcc0000ab',
    'uniq no registro': 'aabbcc000003', 'player_slot que a tela vai imprimir': 1},
   {'posição': 3, 'uniq na chave': 'aabbcc0000d8',
    'uniq no registro': 'aabbcc0000ab', 'player_slot que a tela vai imprimir': 2}]
COM A CURA
4 passed in 0.33s
```

### T4 · `test_nenhuma_grade_da_aba_casa_as_chaves_com_a_lista_crua`

```
SEM A CURA
E  AssertionError: uma grade da aba Status volta a casar as chaves ORDENADAS
   com a lista CRUA do daemon: ['status_actions.py:802: zip(keys, conectados)',
   'status_actions.py:1267: zip(keys, conectados)']
COM A CURA
4 passed in 0.35s
```

**Por AST e não por `grep`:** um `grep` acharia também as citações da mesma
forma dentro de comentário e docstring, e um portão que obriga a documentação a
evitar a palavra que ele proíbe vira ruído, não régua. Aconteceu comigo na
primeira versão — o portão pegou o próprio comentário que explicava o defeito.

### T5 · `test_o_modo_compacto_tem_dono` e a docstring

```
SEM A CURA (compact=True devolvido em produção)
E  AssertionError: código de produção voltou a construir o card COMPACTO:
   ['src/hefesto_dualsense4unix/app/actions/status_actions.py:1314']
E  AssertionError: a docstring de `ControllerCard` volta a ensinar
   `compact=True` como o uso normal
COM A CURA
2 passed in 0.90s
```

### T8 · três mordidas

```
CORPO DO HANDLER ARRANCADO
E  AssertionError: minimizar a janela com a aba Status à vista não desligou a
   captura: o dublê recebeu [True]. O `parec` de cada controle continua
   capturando o microfone dela sem ninguém olhando o medidor

`janela.connect` ARRANCADO
E  AssertionError: o `window-state-event` não foi conectado na janela: o
   handler existe e ninguém o chama. Conectados: []

TUDO DEVOLVIDO
5 passed in 0.36s
```

**O dublê herda os três métodos da `HefestoApp`, sem cópia.** O produto envolve
a chamada num `contextlib.suppress(Exception)`, e um método que faltasse no
dublê viraria silêncio — a régua que só sabe passar. Foi medido: **a primeira
versão deste teste passava com o gancho arrancado.**

### T11 · `test_a_promessa_nao_e_maior_do_que_o_gancho`

**Mordida escrita por mim — a sprint não declarou nenhuma para T11** ("o que
falta é a foto"). Foto não é régua: prova o pixel de um dia, não impede a frase
de voltar a mentir no dia seguinte. É de mão dupla:

```
GANCHO ARRANCADO, DOC PROMETENDO
E  AssertionError: o `interface.md` promete que a leitura morre ao minimizar e
   o `app.py` não conecta `window-state-event` em lugar nenhum

DOC CADUCO DE VOLTA, GANCHO NO LUGAR
E  AssertionError: o `interface.md` volta a descrever a linha 'No jogo agora: …'
   como estando na aba Status. Ela não está lá desde 17/08/2026

TUDO CURADO
5 passed in 0.37s
```

O portão do documento usa AST pelo mesmo motivo do de T4: a docstring do gancho
**cita** o nome do sinal, e o `grep` dava o portão por satisfeito com o
`connect` arrancado. Peguei isso rodando, não pensando.

### T12 · três mordidas

```
GUARDA DA LISTA ARRANCADA
E  AssertionError: a barra escreveu '75 %' com ZERO controles na lista do
   daemon. O payload medido: {'connected': True, 'transport': 'bt',
   'battery_pct': 75, 'controllers': [{'index': 0, 'connected': False, ...}]}

`battery_pct` LIDO DE NOVO NO `_render_slow_state`
E  AssertionError: o `_render_slow_state` voltou a ler `battery_pct` do topo do
   payload por conta própria: ['status_actions.py:2831']

TUDO CURADO
4 passed in 0.34s
```

A **contraprova** é obrigatória e está no arquivo: com um controle conectado a
barra continua dizendo "75 %". "Não mostrar nunca" passaria no teste de cima e
seria defeito pior.

### T9 · `test_o_alojar_da_rota_nao_promete_o_que_ela_aposentou`

```
PROMESSA DE VOLTA NA DOCSTRING
E  AssertionError: a docstring de `_alojar_botao_da_rota` volta a afirmar que
   entrega a SOM-ROTA-NO-CARD-01 sem dizer que aquilo caducou em 02/08/2026.
   Foi essa frase que fez uma sprint inteira propor desfazer uma decisão dela
COM A CURA
3 passed in 0.97s
```

Junto com `test_o_botao_da_rota_nao_migra_mais_para_o_card`, que trava o
comportamento, as duas fecham o cerco pelos dois lados.

---

## O que NÃO verifiquei

* **Que o `parec` sobreviva à minimização na sessão COSMIC dela.** Continua
  `NÃO VERIFICADO`, como a §3 da sprint declarou. O que está medido é a
  ausência de gancho e, agora, a presença dele — o processo vivo não foi
  observado. Bancada é dela.
* **Pixel nenhum.** Não rodei `retratar_abas.py` e não gravei foto oficial —
  ordem do coordenador. Toda medida de geometria aqui é `Gtk.OffscreenWindow`.
  **T2 e T12 mudam o que se vê e aguardam o olho dela** (D3 suspensa nesta
  madrugada, não dispensada).
* **A ordem dos cards na tela com quatro controles.** Medi a fixture e o
  pareamento, não o pixel. Não há quatro controles nesta bancada.
* **Se a linha do giroscópio cabe na faixa dela com a fonte em +3.** O card
  não ficou mais largo (prova abaixo), mas a linha só aparece com espelho de
  motion ativo, e nunca a vi renderizada numa janela real.

---

## O que sobrou para o próximo

### O achado que muda a leitura de duas tarefas

**A §2.5 da sprint está errada sobre uma célula do mapa, e isso muda a T6.** A
tabela diz que `audio.alto_falante.rota` é `radio_aciona=não`. O CSV diz `sim`,
nos dois lados. Quem vale `não` é a chave-guarda-chuva `audio.alto_falante`, e o
significado está na ressalva de `audio.alto_falante.volume`:

> *"Mexer no volume por BT é mexer no volume de algo que NINGUÉM está tocando,
> porque não há caminho de dados de áudio de saída por BT."*

A leitura certa não é *"o gesto não funciona"* — é *"o gesto é aceito pelo
firmware e não sai som, porque não há caminho de dados por rádio"*. São frases
de tela diferentes.

**E há uma segunda trava, que é do próprio vocabulário da casa:**
`audio.alto_falante@dualsense` tem `radio_aciona='não'` com
`radio_por_que_nao_aciona` **vazio**. O `fala_do_mapa.Fala` só licencia
`AFIRMA_NAO_ACIONA` quando a causa é `nada-a-acionar` ou `o-aparelho-recusa`
(`CAUSA_DE_FORA`). Com a célula vazia, a única `Fala` legal é `AFIRMA_NADA` com
`porque=` explícito. **A T6 não pode ser escrita antes de alguém preencher essa
célula** — ou de decidir, com ela, qual é a frase.

Não executei T6 por isso somado a três coisas: ela deixa quatro peças de som
insensíveis no transporte que ela mais usa; a frase é texto novo na tela e ela
não está; e eu já tinha encontrado uma premissa falsa nesta mesma sprint (T9).
Ligar isso em provisório na tela dela seria decidir em silêncio.

### Aberto, por tarefa

| tarefa | por que não fechou | o que ela roda, se for dela |
|---|---|---|
| **T6** | premissa da §2.5 errada + `radio_por_que_nao_aciona` vazio trava a `Fala`. Ver acima | preencher `radio_por_que_nao_aciona` de `audio.alto_falante@dualsense` no `docs/data/mapa-controles.csv` e rodar `python3 scripts/gerar-fatos-de-tela.py` |
| **T7** | não cheguei. As três `_detalhado` continuam sem chamador de produção | — |
| **T10** | é proposta de texto e para — precisa do olho dela | — |
| **T13** | idem T10 | — |
| **T14** | o portão só fica verde **depois** de T7 e T9. Como a T9 foi recusada e a T7 não entrou, ele nasceria vermelho e alguém o ligaria no CI | — |
| **T15** | os quinze atributos mudos. `_speaker_rota_slot` **não** é peso morto: é contrato vivo com `status_actions.py:1421`, e o `None` é decisão dela | — |
| **T5** (os sete arquivos) | pede motivo escrito **por arquivo**, e cada um trava uma medição que eu não sei re-derivar. Ver o parágrafo abaixo | — |

### Os nove vermelhos que já estavam lá

A árvore chegou a mim com **nove testes vermelhos**, e eles **não são meus**.
Provei rodando a base `1835f3b` numa worktree separada: as mensagens saem
**idênticas, número por número** — 1076px, 1330px, 624px, 806px, 1289px,
1307px, 1309px, 472px, 548px. Nenhuma mudança minha custou um pixel.

Seis deles saem dos arquivos da T5, e a causa provável está escrita neles:
medem **dois cards LADO A LADO**, que a EMPILHA-02 desfez em 02/08. Quem for
fazer a T5 deve começar por aí — é possível que a faxina da T5 pague os seis de
uma vez.

### Para a Onda 4 (mesmo arquivo, mesmo dono)

* **Encostei em `_sync_paineis_no_jogo`** (não em `install_no_jogo_tab`): o
  `zip` dele agora casa as chaves com a lista **ordenada**, pela mesma função
  dos cards. É correção de defeito, não desenho novo.
* **O padrão desta aba é chamar as estáticas de ordenação pela CLASSE, não por
  `self`.** Chamei por `self` primeiro e derrubei seis testes do "No jogo": o
  host `_Janela` monta a mixin método a método, e um `self._` novo quebra a
  bancada de quem não sabia que ele nasceu. Está no commit `4f4fb99`.
* O portão de T4 (`test_nenhuma_grade_da_aba_casa_as_chaves_com_a_lista_crua`)
  vale para a grade que a Onda 4 ainda vai escrever.

### O que o coordenador precisa saber para integrar

* **A árvore andou debaixo de mim.** A baseline que medi às 03h era de
  `f475b2a`; quando meu primeiro commit entrou, a branch já estava em
  `1835f3b` (mais `fa14386` e o portão do endereço de rádio). Refiz a baseline
  contra `1835f3b` numa worktree isolada — é a que está neste relatório.
* **`scripts/check_endereco_de_radio.py` não existia** na minha primeira
  rodada de portões e existe agora, pelo mesmo motivo. Passa.
* **Colisão de arquivo:** sou dono único de `status_actions.py`, `app.py` e
  `ipc_handlers.py` — não toquei em `ipc_handlers.py` nem em `state_store.py`.
  Em `controller_card.py` (dono compartilhado) toquei em `_montar_ui`,
  `_montar_estado_global`, `_update_motion`, a docstring da classe e o
  comentário do `_speaker_rota_slot`.
* **Duas tarefas aguardam o olho dela:** T2 (texto novo na tela, e a escolha
  entre (a) e (b) é dela) e T12 (a barra passa a poder dizer "— %").
