---
sprint: CONFIGURACOES-O-LEXICO-01
posse:
  LEXICO-01:
    - src/hefesto_dualsense4unix/app/actions/config/moldura.py
    - src/hefesto_dualsense4unix/app/actions/config/secao_janela.py
    - src/hefesto_dualsense4unix/app/widgets/external_card.py
    - src/hefesto_dualsense4unix/app/actions/external_controllers.py
    - src/hefesto_dualsense4unix/app/ipc_bridge.py
    - scripts/validar-palavra-de-tela.py
    - tests/unit/test_a_aba_diz_quando_a_escolha_fica_guardada.py
    - tests/unit/test_config_a_palavra_de_tela_da_aba_montada.py
  # Toca, mas NÃO é dona: A, B e C mandam nestes quatro. Declarados aqui de
  # propósito — sprint que edita um arquivo e não o declara é colisão invisível.
  # O `depois_de` abaixo é o que resolve o par.
  LEXICO-01-cede:
    - src/hefesto_dualsense4unix/app/actions/config/secao_mesa.py       # dona: A
    - src/hefesto_dualsense4unix/app/actions/config/secao_exame.py      # dona: B
    - src/hefesto_dualsense4unix/app/actions/config/secao_orcamento.py  # dona: C
    - src/hefesto_dualsense4unix/app/actions/config/secao_controles.py  # edita: C
cria:
  - src/hefesto_dualsense4unix/app/widgets/campo_de_busca.py
  - tests/unit/test_o_lexico_da_aba_configuracoes.py
bancada: false
depois_de:
  - 2026-08-24-CONEXOES-MAPA-2D-01        # frente A
  - 2026-08-24-ORDEM-DE-SERVICO-01        # frente B
  - 2026-08-24-DESEMPENHO-A-CONTA-DE-SLOTS-01  # frente C
nao_toca:
  - src/hefesto_dualsense4unix/integrations/mesa_de_radio.py
  - src/hefesto_dualsense4unix/integrations/radio_da_mesa.py
  - src/hefesto_dualsense4unix/integrations/exame_da_mesa.py
---

# CONFIGURAÇÕES-O-LÉXICO-01 — a aba que fala barramento com quem vê gabinete

O contrato de posse desta sprint é o **frontmatter no topo deste
arquivo** — é lá que `scripts/check_colisao_de_sprints.py` o lê, e é ele
que o `despachar-agente.sh` exige antes de criar a árvore de qualquer
agente. Ficava aqui embaixo, num bloco de código que a máquina não lia.

**24/08/2026. GRAU: MEDIDO**, exceto onde a linha diz DESENHO ou NÃO VERIFICADO.
Frente D da leva das quatro. Escopo: **só o DualSense** (decisão dela, hoje).

**O que esta sprint fecha**

1. Doze parágrafos de apoio ocupam a página inteira da aba com texto que nunca
   muda — e três deles são **a mesma frase**, palavra por palavra.
2. A tela fala `Barramento 1, porta 2.1`, `0bda:b812` e `vizinho do adaptador 2`
   com quem enxerga um gabinete e um número de entrada.
3. Oito botões de cor por card, em três fileiras, para uma resposta que **o
   controle no cabo já dá sozinho**.
4. A palavra **"Não sei"** aparece em cinco lugares com três donos diferentes —
   inclusive na boca do produto, com as mesmas letras do botão dela.
5. Dois dos três controles de "A janela" não mudam um pixel quando clicados. Não
   é falta de handler: os três têm. É falta de resposta.
6. `"A mesa"` → **"Conexões"**, `"Orçamento"` → **"Desempenho"** — e o rodapé,
   que guarda uma segunda cópia desses títulos, deixa de poder divergir.

**O que ela NÃO faz**

- Não desenha o mapa 2D (frente A), não escreve ordem de serviço (frente B), não
  mexe na conta de slots nem move a caixinha do microfone (frente C).
- **Não mede Bluetooth.** Nenhuma tarefa desta sprint precisa da bancada.
- Não muda a ORDEM das seções: a `FECHA-01` T12 já pôs essa pergunta na mesa
  dela e ela está aberta. Ver §6.
- Não tira "Altura da antena" nem "Linha de visada" — só reescreve as duas.


> **▲ DUAS DECISÕES FECHARAM DEPOIS QUE ESTA SPRINT FOI ESCRITA, e elas mandam
> nela.** Leia antes de executar qualquer tarefa — o corpo abaixo ainda não foi
> reescrito por inteiro, e nos pontos de conflito **a decisão vence o texto**.
>
> 1. **`D-A-PALAVRA-ENTRADA`** (`docs/data/decisoes-dela.csv`): a tela diz
>    **"entrada"**, nunca "porta". Sai da frase dela: *"o número da entrada usb
>    salvaria muito como coluna"*. Vale para **todo texto de tela e toda
>    asserção de teste sobre texto de tela**; identificador de código pode
>    continuar `porta`. A varredura completa é da **CONFIGURACOES-O-LEXICO-01**,
>    que é a dona única do texto desta aba — não a faça aqui, ou duas frentes
>    editam a mesma frase.
> 2. **`D-PERFIL-DE-DESEMPENHO`**: os cinco degraus do "Orçamento" **não viram
>    três botões de teto**. Viram **um perfil** — `Tudo ligado` / `Bateria
>    longa` / `Eu escolho` — e o **microfone sai do perfil**, para linha própria,
>    porque é o único que capta a sala. Migração sem perda: `economia` →
>    Bateria longa; `balanceado`/`max`/`auto`/vazio → Tudo ligado; `custom` →
>    Eu escolho.


---

## 1. O defeito, em uma frase

**A aba sabe o que a pessoa precisa saber e o diz na língua do barramento, em
parágrafos que nunca mudam — então quem vê o gabinete não acha a porta, e quem
lê a página não distingue o que é resposta do que é explicação.**

---

## 2. O que está medido

Régua: a árvore de hoje (`dev`, após `f475b2a`) e a foto de hoje às 12h01,
`docs/usage/assets/readme_configuracoes_inteira.png` (1920×2505, quatro cards,
dois adaptadores).

### 2.1 Doze parágrafos, e três são a mesma frase

`grep -n "rotulo_de_apoio(" src/hefesto_dualsense4unix/app/actions/config/`
devolve 16 sítios; **12 chegam à tela** na foto de hoje:

| # | texto | onde nasce | é estado ou explicação? |
|---|---|---|---|
| 1 | "Este exame olha a mesa: portas, energia e rádio…" | `secao_exame.py:261` (`ESCOPO`, `:70`) | explicação |
| 2 | "Com o microfone ligado, um controle no rádio troca 260,4…" | `secao_controles.py:635` | explicação |
| 3 | "A escolha passa a valer quando você clicar em Aplicar…" | `secao_controles.py:636` | explicação |
| 4 | idem | `secao_mesa.py:438` | explicação |
| 5 | idem | `secao_orcamento.py:224` | explicação |
| 6 | "O nome vai para o Bluetooth do sistema assim que você aperta Enter." | `secao_mesa.py:872` (`_NOME_VALE_JA`, `:228`) | explicação |
| 7 | "▲ Um dos adaptadores guarda a palavra Nintendo…" | `secao_mesa.py:879` | explicação |
| 8 | "Por enquanto o teto alcança a vibração e nada mais…" | `secao_orcamento.py:226` (`ALCANCE_DE_HOJE`, `:133`) | explicação |
| 9 | "O tamanho novo vale na próxima vez que você abrir o Hefesto." | `secao_janela.py:111` | explicação |
| 10 | "Detectado: COSMIC. Corrija se estiver errado." | `secao_janela.py:117` | **estado** |
| 11 | "A escolha fica guardada na hora — não espera o Aplicar." | `secao_janela.py:124` (`VALE_JA`, `moldura.py:69`) | explicação |
| 12 | "A barra do sistema desta sessão recebe o ícone do Hefesto." | `secao_janela.py:126` | **estado** |

Os outros quatro sítios (`secao_controles.py:927`, `:1333`; `secao_mesa.py:821`,
`:924`) só aparecem com a seção VAZIA — são estado, e **ficam**.

A frase 3/4/5 é a mesma constante `moldura.QUANDO_VALE` (`moldura.py:65`) escrita
três vezes na mesma tela. Ela: *"tudo isso em azul deveria ser tooltip, não
deveria poluir a interface"*.

**Custo em altura:** a foto tem 2505 px numa janela de 1080. Os 12 parágrafos
ocupam **16 linhas de texto**; medido a olho no PNG, cada linha vale ~27 px e o
`spacing=8` da moldura (`moldura.py:48`) soma mais 8 por widget →
**≈ 520 px, ou um quinto da página.** GRAU: APROXIMADO — a medição exata é a
mordida da LEX-2.

### 2.2 A afordância já existe. É a página que sobra, não a marca que falta

Isto corrige um enquadramento que ainda circula: o `FECHA-01` §2.5 diz *"duas
afordâncias declaradas, zero implementadas"*. **Não vale mais.** Hoje:

- `moldura.marcar_afordancias` (`moldura.py:133`) varre a subárvore e marca todo
  ponto de dica, inclusive os que nascem depois (`_ligar_o_add`, `:184`);
- o CSS existe e chega ao widget: `theme.css:1367` (sublinhado pontilhado por
  `border-bottom`, porque o GTK 3.24.41 **recusa** `text-decoration-style`) e
  `:1382` (o `?` em círculo), com contraparte HighContrast em `:1395`;
- há portão medindo o efeito, não a chamada:
  `tests/unit/test_afordancia_de_dica_na_aba_configuracoes.py` (6 testes).

Logo, **toda dica que esta sprint criar já nasce anunciada**, desde que pouse
num `Gtk.Label` ou num `Gtk.Button`. As duas recusas de `merece_sublinhado`
(`moldura.py:82`) que importam aqui: rótulo dentro de botão não ganha marca (já
se anuncia) e `Gtk.Entry` não ganha (a moldura do campo já é a marca).

### 2.3 O barramento na tela — cinco frases, todas com âncora

| o que a tela diz | onde | quem lê |
|---|---|---|
| `Barramento 1, porta 2.1 · Não sei · Em hub` | `secao_mesa.py:1440` | coluna "Onde está" dos adaptadores |
| `0bda:b812` | `secao_mesa.py:1255` via `:940` | coluna "Aparelho" dos outros rádios |
| `Nenhum outro rádio encontrado no barramento USB.` | `secao_mesa.py:925` | tabela vazia |
| `O sistema informou o que este aparelho é, pelo próprio barramento USB.` | `secao_mesa.py:185` | dica do selo `(lido)` |
| `Lido do barramento USB: o Hefesto reconhece o hub.` | `secao_mesa.py:1450` | dica de "Em hub" |

E o pior, porque é o produto ACERTANDO e não conseguindo dizer:
`secao_mesa.py:1618` monta `f"vizinho do adaptador {numero}"`, em que `numero` é
o **ordinal da própria lista da aba** (`:1605`, `enumerate(mesa.adaptadores,
start=1)`). Ela: *"vizinhança das portas, qual porta?"*.

`grep -c "arramento" src/hefesto_dualsense4unix/gui/main.glade` = **0** — a
palavra não está em nenhuma das outras dez abas. Ela é exclusiva desta.

**O que o produto PODE dizer sem inventar.** `RadioUsb` e `Adaptador`
(`mesa_de_radio.py:121`, `:145`) carregam `busnum`, `devpath`, `atras_de_hub`.
O `devpath` é a cadeia de números de porta USB: em `3-1.1.4` o **último número é
a porta do hub em que o aparelho está espetado**, e em `3-3` é a porta do próprio
gabinete. Isso é traduzível sem jargão e sem chute:

    hoje:  Barramento 3, porta 1.1.4 · Não sei · Em hub
    vira:  Entrada 4 do hub          (lido)

**E é fallback, não verdade.** A verdade é a declaração dela — o hub UB700 dela
é dual-chip e a numeração interna não casa com a etiqueta. O mapa 2D (frente A)
é quem passa a mandar; esta sprint só abre a fresta por onde ele entra, com o
mesmo selo `(lido)` / `(você disse)` que a coluna "O que é" já usa
(`secao_mesa.py:180-181`).

### 2.4 A cor: oito botões para uma pergunta que o cabo já responde

`cores_do_plastico_items()` (`external_controllers.py:479`) devolve **oito**
itens: seis cores + "Outra" + "Não sei". Eles vão num `SegmentedSelector(wrap=True)`
(`external_card.py:316`), que é grade de **três colunas fixas**
(`_WRAP_COLUNAS`, `segmented_selector.py:33`) → **três fileiras**.

Na foto de hoje isso está medido lado a lado: os cards do Jogador 1 e 4 (cabo)
mostram a cor LIDA numa linha — `Nova Pink ?`, `Cosmic Red ?` — e os do Jogador 2
e 3 (rádio) mostram a grade. A barra "A luz não acende" nasce **≈ 79 px mais
baixa** nos cards da grade. GRAU: APROXIMADO (medido a olho no PNG); a medição
exata é a mordida da LEX-5. Como `grade.set_row_homogeneous(True)`
(`secao_controles.py:945`) iguala as fileiras, **um card com grade encarece a
fileira inteira**.

**Por que o cabo responde e o rádio não** — e isto derruba a versão simples de
"nasce pré-lida": `docs/data/mapa-controles.csv:111`
(`identidade.cor_do_aparelho@dualsense`) mede `cabo_aciona=sim`,
`radio_aciona=não`, motivo `o-aparelho-recusa` — o `SET_FEATURE 0x80` devolve
`EIO` imediato por rádio, duas tentativas, 15/08/2026. Então:

- **cabo** → nasce pré-lida, selo `(lido)`, e a busca só existe para corrigir;
- **rádio** → a busca é o único caminho, e a dica que já diz isso é
  `external_card.DICA_DA_COR_NO_RADIO` (`:96`), ancorada na mesma linha do CSV.

A tabela que a busca precisa **já existe inteira**: `NOMES_DE_FABRICA`
(`integrations/cor_do_plastico.py:96`) e `TONS` (`:122`), 21 linhas, mais
`docs/data/cores-do-plastico.md`. A lista de hoje mostra **seis de vinte e uma**,
por escolha declarada em `external_controllers.py:445-451` — e é justamente essa
escolha que a busca torna desnecessária: ela: *"o user começa a escrever o nome
do controle dele, se é Cosmic Red ou Galactic Purple, aí a lista sugere"*.

**Nada de popup, e a razão é medida.** `Gtk.ComboBox` está proibido nesta casa
(cosmic-epoch#2497, `segmented_selector.py:3`); o contorno é forçar XWayland, e
`app/main.py:58-64` registra que em 24/08 a bancada mediu a janela **não abrir**
sob `GDK_BACKEND=x11` sem XWayland vivo — então o produto passou a subir em
Wayland nativo *com* o bug de popup. `grep -rn "EntryCompletion" src/` = **0
ocorrências**. Um `Gtk.EntryCompletion` é um popup: seria apostar a cura contra
um bug já pago. O desenho é campo + lista filtrada **dentro** do card.

### 2.5 "Não sei" tem cinco lugares e três donos

| onde | quem não sabe | âncora |
|---|---|---|
| botão do Orçamento | **ela** (não declarei teto) | `secao_orcamento.py:88-89` |
| botão da cor | **ela** (não sei a cor) | `external_controllers.py:473` |
| botão de altura/visada | **ela** | `secao_mesa.py:466`, `:481` |
| botão de "O que é" | **ela** | `secao_mesa.py:164` |
| coluna "Onde está" e a palavra do medidor | **o produto** | `secao_mesa.py:259` (`_PAINEL_DESCONHECIDO`), usado em `:1514`, `:1585`, `:1573` |

Na foto: `Barramento 1, porta 2.1 · Não sei · Em hub` e
`Rádio em uso · Extra … Não sei — · o daemon não respondeu`. **São as letras do
botão dela, ditas pelo produto.** A casa já tem a forma certa para esse caso e a
usa a três centímetros dali: `_AVISO_NAO_SABE = "▲ O Hefesto não sabe"`
(`secao_mesa.py:201`).

Ela, sobre o botão do Orçamento: *"O foda ali é só o 'Não sei'. o que isso quer
dizer. É desligado ou automático? confuso."* — e ela tem razão por um motivo
extra: ali, ao lado de "Auto", "Não sei" **não é um fato que ela ignora, é uma
escolha que ela não fez**. A dica que já existe diz exatamente isso e ninguém a
vê no rótulo: *"Apaga o que foi declarado aqui. O Hefesto volta a não saber."*
(`external_controllers.py:476`).

### 2.6 Os botões de "A janela": todos têm handler, dois não respondem

Ela: *"janela ok, muito bom mas os botões não funcionam e não deveriam ter o
botão de abrir aba sistema"*. **Eu não reproduzi na tela** — o que segue é
leitura de código, com âncora, e explica o sintoma sem inventar defeito.

| controle | handler | o que muda na tela ao clicar |
|---|---|---|
| Tamanho do texto | `secao_janela.py:181` → `_ao_trocar_o_tamanho` (`:187`) | **nada.** `set_pref` grava e o tema **não** é reaplicado, por decisão medida (`:13-18`: `apply_theme` COMPÕE — quatro chamadas levaram a fonte de 12,25 a 19 pt) |
| Ambiente | `secao_janela.py:222` → `_ao_corrigir_o_ambiente` (`:228`) | grava e repinta **só** a frase da bandeja. E `ambiente.py:143-144` devolve a **mesma frase para os três ambientes** quando o ícone sobe — que é o caso dela, provado pela própria foto ("A barra do sistema desta sessão recebe o ícone do Hefesto"). **Trocar COSMIC → GNOME → Outro não muda um pixel na máquina dela.** |
| Abrir a aba Sistema | `secao_janela.py:340` → `_abrir_a_aba_sistema` (`:360`) | funciona: `daemon_box` existe (`main.glade:2641`) e a busca é por id, nunca por índice. **E é o que ela mandou tirar.** |
| "Ligado" (espelho) | nenhum, e é o desenho (`:350`) | nada — mas está numa fileira que **parece** um controle, entre um rótulo e um botão |

**Conclusão, e é ela que vira tarefa:** não falta handler em lugar nenhum. Falta
**recibo**. A frase que responderia — `VALE_JA`, *"A escolha fica guardada na
hora"* — está na tela como parágrafo estático desde antes do clique, então não
distingue "cliquei" de "não cliquei". É o mesmo defeito da §2.1 visto do outro
lado: explicação ocupando o lugar de estado.

### 2.7 O título tem uma segunda cópia, e ela é hardcoded

`ipc_bridge.py:799-803` guarda `{"mesa": "A mesa", "controles": "Os controles",
"orcamento": "Orçamento"}` para o rodapé nomear campo descartado — com o
comentário `:791` dizendo *"os rótulos são os TITULO de app/actions/config/"*.
São, mas por cópia. Renomear a seção sem tocar aqui faz o rodapé dizer "A mesa"
sobre uma seção chamada "Conexões". `test_descartados_chegam_ao_rodape.py:233`
prende a cópia velha.

---

## 3. As tarefas

Prefixo `LEX`. Cada uma diz o arquivo, a mordida, e o carimbo D3.

### LEX-1 — "A mesa" vira "Conexões", "Orçamento" vira "Desempenho"

`secao_mesa.py:139` e `secao_orcamento.py:58`, uma palavra cada. Mais:

- `ipc_bridge.py:799-803` deixa de guardar cópia: o dicionário passa a ser
  montado **dentro** de `_rotulos_dos_descartados` (`:806`) com import
  preguiçoso de `config.secoes`. **Preguiçoso é obrigatório:**
  `secao_janela.py:54` importa `ipc_bridge`, então import no topo fecha ciclo.
- `secao_controles.py:462` cita `'está na seção "A mesa"'` dentro da frase do
  microfone — **cede à frente C**, que move essa frase inteira. Se C não fechar,
  aqui vira `"Desempenho"`.
- Nada mais: `mesa_de_radio.py`, `exame_da_mesa.py` e `sensor_widgets.py` usam
  "a mesa" como a metáfora da casa (o conjunto de controles), não como título.

**A mordida:** `test_descartados_chegam_ao_rodape.py:215` (o teste que nomeia a seção)
passa a afirmar `descartados == (secao_mesa.TITULO, secao_orcamento.TITULO)`,
lendo os módulos. Arranque a derivação em `ipc_bridge` e devolva o dicionário
literal com "A mesa": reprova dizendo que o rodapé nomeia uma seção que não
existe na tela. Hoje o teste passa com as duas cópias divergentes — é essa
cegueira que sai.

**Prova de tela:** precisa-do-olho-dela-antes *(muda o que se vê ao abrir)* —
mas os dois nomes **são dela**, então o olho aqui é conferência, não decisão.

### LEX-2 — a regra do léxico: na página o que muda, no hover o que explica

**A regra, e ela é o produto desta tarefa:**

> Fica na página o que **muda** — estado, medição, resposta, seção vazia.
> Vai para o hover o que **explica** — por quê, quando vale, de onde veio.
> Teste: *este parágrafo diria a mesma coisa com a mesa vazia e com a mesa
> cheia?* Se sim, é explicação; cola no widget que ele explica, e o widget já
> ganha a marca por `marcar_afordancias` (§2.2).

Aplicada aos 12 da §2.1:

| # | destino |
|---|---|
| 1 `ESCOPO` | dica do título "Está tudo certo?" (anexa à `DICA`, `secao_exame.py:55`) |
| 2 microfone | **cede à frente C** — sai junto com a caixinha |
| 3,4,5 `QUANDO_VALE` | dica do título da própria seção, nas três |
| 6 `_NOME_VALE_JA` | anexa a `_DICA_DO_NOME` (`secao_mesa.py:211`), que já pousa no `Gtk.Entry` (`:908`) |
| 7 Nintendo | dica do campo de nome do adaptador que hospeda Nintendo; o `▲` fica como marca |
| 8 `ALCANCE_DE_HOJE` | anexa à `DICA` de "Desempenho" |
| 9 tamanho | anexa à dica do rótulo "Tamanho do texto:" (`_fileira` já aceita `dica=`, `secao_janela.py:388`) |
| 10 "Detectado: COSMIC" | **FICA** — é estado |
| 11 `VALE_JA` | vira recibo (LEX-3), não dica |
| 12 bandeja | **FICA** — é estado, e pinta laranja quando falta (`:304`) |

**A armadilha, e ela derruba a suíte se ninguém a vir:**
`test_a_aba_diz_quando_a_escolha_fica_guardada.py` tem cinco testes que exigem
`QUANDO_VALE` e `VALE_JA` na tela, e o coletor `_textos` (`:100-118`) lê **só**
`Gtk.Label.get_text()`. Mover para dica reprova quatro deles. A cura **não** é
apagar teste: `_textos` vira `_falas` e passa a colher rótulo **e**
`get_tooltip_text()` — a semântica migra de "está impresso na página" para "está
ao alcance de quem procura", que é a decisão dela. Os testes
`test_as_duas_frases_nunca_aparecem_na_mesma_secao` e
`test_a_frase_e_a_mesma_constante_nas_tres_secoes` continuam intactos e passam a
valer sobre dicas.

**A mordida:** o portão novo da LEX-10, teste 1. E, dentro deste arquivo:
devolva `caixa.pack_start(rotulo_de_apoio(QUANDO_VALE), …)` a `secao_orcamento` —
o teste 1 reprova nomeando o arquivo e o texto.

**Prova de tela:** precisa-do-olho-dela-antes *(muda o que se vê ao abrir)*.
Leve a foto do antes e do depois com a mesma bancada de quatro cards.

### LEX-3 — o recibo: os botões de "A janela" passam a responder

`secao_janela.py`. A frase `VALE_JA` (`moldura.py:69`) deixa de nascer na página
(`:124`) e passa a ser **escrita ao clicar**, num rótulo que nasce vazio ao lado
da fileira que recebeu o clique — verde (`@green`, `theme.css:26`, a cor de
confirmação desta casa), e some no clique seguinte em outra fileira.

Vale para as duas fileiras que gravam na hora: Tamanho do texto (`:181`) e
Ambiente (`:222`). O texto do recibo é curto e diz o que a `VALE_JA` dizia; a
frase longa vira a dica do rótulo da fileira.

Isto **não** reaplica o tema — a decisão medida de `:13-18` fica de pé, e é
justamente ela que a frase 9 (LEX-2) explica no hover.

**A mordida:** teste que monta a seção, chama o handler de
`_config_escala_seletor` e afirma que o rótulo de recibo saiu de `""` para o
texto de `VALE_JA`; e que trocar o ambiente escreve recibo **mesmo quando
`mensagem_da_bandeja` devolve a mesma frase** (é o caso dela, §2.6). Arranque o
`set_text` do recibo: reprova. Arranque só o repintar da bandeja: **continua
reprovando o recibo**, que é o ponto — as duas coisas deixam de ser a mesma.

**Prova de tela:** precisa-do-olho-dela-antes *(texto novo)*.

### LEX-4 — "Abrir a aba Sistema" sai

`secao_janela.py:339-341` (o `Gtk.Button` e o `connect`) e `:360-380`
(`_abrir_a_aba_sistema`, que perde o único chamador). A fileira fica
`Ligar junto com o computador  ·  Ligado`, e o rótulo de estado ganha a dica que
diz onde se muda — o espelho continua sendo espelho (`:350`).

`from ...home_actions import id_da_pagina` (`:368`) sai junto. Confira que
`id_da_pagina` continua tendo outros chamadores antes de apagar (`grep -rn
"id_da_pagina" src/` — ele é público e a `EST-10` depende dele; **não o apague**).

**A mordida:** `test_config_a_janela_na_tela.py` ganha um teste que anda a
seção montada e afirma que **nenhum** `Gtk.Button` dela tem rótulo contendo
"aba Sistema". Devolva o botão: reprova.

**Prova de tela:** cosmetica-pre-aprovada *(remoção pedida por ela, literal:
"não deveriam ter o botão de abrir aba sistema")*.

### LEX-5 — a cor vira busca, e no cabo nasce lida

Novo `src/hefesto_dualsense4unix/app/widgets/campo_de_busca.py`: `Gtk.Entry` + <!-- ref-externa: nasce nesta sprint, ainda não existe -->
uma lista filtrada **dentro** do card (`Gtk.ListBox` com `no_show_all`, visível
só enquanto há texto e no máximo 6 linhas). Sem popup — §2.4. API espelhando o
`SegmentedSelector` para o call site não mudar de forma: `set_items([(id, nome)])`,
`get_active_id()`, `set_active_id()`, sinal `changed`.

`external_card._linha_da_cor` (`:278`) passa a:

1. **cabo com leitura** → o valor lido + amostra + selo `(lido)` (é o que já faz
   em `:290-311`), **mais** um `Corrigir` que abre a busca — a mesma gramática da
   coluna "O que é" (`secao_mesa.py:1046`), que é o padrão que ela já aprovou em
   22/08: *"classifica sozinho, você só corrige"*;
2. **rádio, ou cabo sem leitura** → a busca, com a dica que já existe
   (`DICA_DA_COR_NO_RADIO`, `:96`) explicando por que não deu para ler.

A busca lê `NOMES_DE_FABRICA` (`cor_do_plastico.py:96`) inteiro — **21 nomes, não
seis**. `_CORES_DA_LISTA` (`external_controllers.py:452`) e
`cores_do_plastico_items()` (`:479`) morrem; `dicas_das_cores()` (`:490`) segue
viva para a dica do resultado. `ID_DE_OUTRA_COR` e `ID_DE_NAO_SEI` continuam:
"Outra" abre o campo livre (decisão C2) e "Não sei" apaga a declaração (D-A1).

A borda do card já acompanha a escolha — `repintar_a_borda(tom_para_a_borda(...))`
(`secao_controles.py:874`, `:1074`). Nada a fazer ali: a busca só troca quem
produz o id.

**A mordida:** teste que monta a seção com o dublê de quatro controles, mede
`get_preferred_height()` do card por `Gtk.OffscreenWindow` (**nunca
`Gtk.Window`** — sob Xvfb ela fica 1×1 para sempre, `COMO-OLHAR-A-TELA.md`) e
afirma que o card do controle no rádio **não é mais alto** que o card do
controle no cabo. Devolva o `SegmentedSelector(wrap=True)` de oito itens:
reprova, e a mensagem imprime os dois números — que é a medição exata que a
§2.4 deixou aproximada.

Segundo dente, contra o popup voltar pela porta dos fundos: teste que reprova
`Gtk.EntryCompletion` e `Gtk.ComboBox` em qualquer arquivo de `app/widgets/` e
`app/actions/config/`, por AST.

**Prova de tela:** precisa-do-olho-dela-antes *(muda o que se vê ao abrir)*.

### LEX-6 — "Outros rádios": os sete botões viram busca, e a tabela ganha a entrada

`secao_mesa._seletor_do_tipo` (`:1058`) troca o `SegmentedSelector` de sete
botões pelo `campo_de_busca` da LEX-5, com os mesmos `_TIPOS_DE_RADIO`
(`secao_mesa.py:157`). Ela: *"ao invés de botões caixa de texto de pesquisa como
o outro"*.

E as colunas de `_desenhar_radios` (`:917`) mudam:

    hoje:  Aparelho        | Onde                          | O que é
           0bda:b812       | Não sei · vizinho do adaptador 2 | [7 botões]

    vira:  Entrada         | Onde está                     | O que é
           Entrada 4 do hub (lido) | Trás · colado no adaptador "Sala" | [busca]

- **Entrada**: do `devpath` (§2.3), por uma função nova nesta seção,
  `entrada_de_tela(no, devpath, atras_de_hub, declaradas)`. `declaradas` é
  `dict[str, str]` e hoje quem chama passa `{}` — **é a fresta da frente A, e a
  chave dela NÃO se inventa aqui.** Com `{}`, o selo é `(lido)`; quando A ligar,
  vira `(você disse)`. **A frente A já publicou o encaixe:**
  `mapa_das_portas.porta_de(mapa, caminho)` e `porta_do_adaptador(...)`
  (`CONEXOES-MAPA-2D-01`, MAPA-3). Se A fechar antes, `entrada_de_tela` não
  nasce: vira uma chamada a `porta_de`, e a tradução do `devpath` fica só como
  fallback de quem não declarou mapa nenhum.
- **o hex sai da tela** e vira dica da linha (`_celula_mono`, `:1255`, deixa de
  ser coluna). Ele continua sendo a chave de gravação (`vid:pid`, `:940`) — só
  não é mais palavra de tela.
- **`vizinho do adaptador {numero}`** (`:1618`) deixa de usar o ordinal: usa o
  **nome do adaptador** quando o BlueZ deu um (`_apelido_por_endereco`, `:1540`,
  junção por `hciN` em `_dongle_por_interface`, `:1519`) e a **entrada** quando
  não deu. Nunca o número da lista.

**Colisão declarada:** a frente B (ordem de serviço) provavelmente reescreve
esse mesmo sufixo — ver §7.

**A mordida:** teste que monta a tabela com uma `Mesa` dublê de dois rádios
colados e afirma (a) que nenhuma célula contém `"adaptador 2"`, (b) que a coluna
0 não casa `^[0-9a-f]{4}:[0-9a-f]{4}$`, (c) que a dica da linha **contém** esse
hex. Devolva o ordinal: reprova em (a).

**Prova de tela:** precisa-do-olho-dela-antes *(texto novo e coluna nova)*.

### LEX-7 — "Rádio em uso" vira coluna de Conexões

Ela: *"radio em uso é ótimo, mas deveria ficar ali no nome, adaptador, onde está,
a barra, folgada — derivado de especificação"*.

Hoje são fileiras soltas entre as duas tabelas (`_caixa_medidores`,
`secao_mesa.py:418`, desenhadas por `_fileira_do_medidor`, `:1148`). Passam a ser
**três colunas novas** da tabela de adaptadores (`_desenhar_adaptadores`, `:811`):

    Nome | Adaptador | Onde está | Rádio em uso | Folga | De onde sei

A junção é possível e **não é chute**: a linha da tabela tem `interface` (`hciN`),
`_dongle_por_interface` (`:1519`) leva de `hciN` a `Dongle`, e o `Dongle` tem
`endereco`, que é a chave de `ocupacao_por_adaptador`. É a mesma ponte que
`_medidores_da_mesa` (`:1453`) já usa para nomear a barra; o que muda é a
direção. **Onde a ponte falha** — BlueZ mudo, adaptador sem controle — a célula
diz o que já dizia: `— · o daemon não respondeu` (`:299`) ou "O Hefesto não
sabe" (LEX-8), nunca zero em verde. A regra de `:1466` *"quem manda é quem sabe"*
fica escrita na função nova.

**A conta continua sendo da frente C.** Esta tarefa move o widget, não o número:
`ocupacao_por_adaptador` e `_selo_da_ocupacao` (`:1545`) não mudam de dono.

**A mordida:** teste que monta a seção com dois adaptadores e ocupação só num
deles, e afirma que a fileira do adaptador **sem** ocupação não mostra "Folgada"
em verde nem `0/1600`. Arranque a chave de ausência (`_daemon_respondeu`,
`:382`) e faça `_ocupacoes` devolver `{}`: reprova. É a regressão de 23/08 já
registrada em `:377-382`, agora vigiada na coluna nova.

**Prova de tela:** precisa-do-olho-dela-antes *(ordem e o que nasce visível)*.

### LEX-8 — o "Não sei" do produto deixa de usar as letras do botão dela

`secao_mesa.py:259`. `_PAINEL_DESCONHECIDO` deixa de ser `"Não sei"`:

- na **palavra do medidor** (`:1514`, `:1573`) e na coluna "Onde está"
  (`:1585`) → `"O Hefesto não sabe"`, convergindo com `_AVISO_NAO_SABE` (`:201`),
  que é a forma que a casa já usa e que ela já viu;
- os **botões dela** ficam como estão. "Não sei" é resposta dela, e continua.

E o quinto caso, o do Orçamento/Desempenho (`secao_orcamento.py:89`): ali não é
fato ignorado, é escolha não feita. **Duas redações para ela escolher** — ver §6.

**A mordida:** teste que monta a aba inteira, coleta todo texto de rótulo e
afirma que `"Não sei"` só aparece **dentro de botão** (`get_ancestor(Gtk.Button)
is not None`). Devolva `_PAINEL_DESCONHECIDO = "Não sei"`: reprova nomeando a
célula. É o mesmo desenho de `merece_sublinhado` (`moldura.py:115`) — pergunta
sobre o ancestral, não lista de widgets a manter.

**Prova de tela:** precisa-do-olho-dela-antes *(texto reescrito)*.

### LEX-9 — "Altura da antena" e "Linha de visada": só a redação

`secao_mesa.py:461-486`. O conteúdo **não sai** — o `GUIA-RADIO-DA-SALA.md` §4.4
mede que subir 40 cm rende mais que aproximar 5 m, e isso é o que as duas
perguntas colhem. Ela: *"Eu não sei o que é altura da antena. nem linha de
visada. sinceramente não faço ideia."*

Proposta, a confirmar (§6):

| hoje | vira | opções |
|---|---|---|
| `Altura da antena:` | `O dongle fica acima da cabeça de quem joga sentado?` | Sim · Não · Não sei |
| `Linha de visada:` | `Tem gente sentada entre o dongle e o sofá?` | Sim · Não · Não sei |

As chaves do esquema (`altura_da_antena`, `linha_de_visada`) e os valores
(`acima`/`abaixo`, `livre`/`com_gente`) **não mudam**: `MesaDeclarada` usa
`Literal` com `extra="forbid"`, e mexer ali faria o pydantic recusar o
**documento inteiro** de quem já declarou — o sintoma seria "não consegui
gravar" (o mesmo mecanismo descrito em `secao_mesa.py:1290-1296`). O que muda é
só o rótulo e a palavra de cada opção. A pergunta com "?" no fim é a gramática
que "Está tudo certo?" já usa.

**A mordida:** teste que afirma que o rótulo da fileira `altura_da_antena`
**não contém** "antena" nem "visada", e que o valor gravado por um clique em
"Sim" continua sendo `"acima"`. Volte o rótulo antigo: reprova. Troque o valor
gravado para `"sim"`: reprova na segunda metade — que é a que impede a
reescrita de redação de virar quebra de esquema.

**Prova de tela:** precisa-do-olho-dela-antes *(texto reescrito, e são as duas
frases que ela citou nominalmente)*.

### LEX-10 — o portão, e ele tem dois dentes

Novo `tests/unit/test_o_lexico_da_aba_configuracoes.py`. Monta a aba de verdade <!-- ref-externa: nasce nesta sprint, ainda não existe -->
pelo molde de `test_config_a_palavra_de_tela_da_aba_montada.py:73` (Glade +
`install_config_tab`), sob `exigir_gi_real`.

**Dente 1 — parágrafo de apoio novo reprova.** Um "parágrafo de apoio" é um
`Gtk.Label` da aba com classe `dim-label`, `get_line_wrap()` verdadeiro e texto
com mais de 60 caracteres. O teste afirma que o conjunto desses textos é
**exatamente** `PARAGRAFOS_QUE_FICAM`, uma lista explícita no próprio arquivo com
o motivo de cada um (os quatro de seção vazia da §2.1 mais os dois de estado).

Duas metades, e a segunda é a que impede o portão vazio: `NUNCA_MENOS_QUE` —
a régua tem de continuar **achando** os parágrafos permitidos. Zero achados é
reprovação, não aprovação. É a armadilha de 19/08 (`o-portao-que-nao-mede-o-que-promete`),
e o `test_afordancia_de_dica_na_aba_configuracoes.py:203` já a paga do mesmo
jeito — copie a forma, não a régua.

**Dente 2 — jargão de barramento não volta.** `JARGAO_BANIDO`
(`validar-palavra-de-tela.py:152`) ganha as entradas:

```python
"barramento": "diga a entrada USB: 'Entrada 4 do hub'",
"devpath":    "diga a entrada USB",
"vid:pid":    "o código do fabricante não é palavra de tela — põe na dica",
```

**Sem dívida, e por medição:** `grep -c "arramento" main.glade` = 0, então a
lista nova **não reprova nenhuma das outras dez abas** e não precisa de entrada
em `DIVIDA_DA_PALAVRA_01` (`:168`). O portão que já existe
(`test_config_a_palavra_de_tela_da_aba_montada.py::test_nenhum_texto_da_aba_carrega_jargao_banido`)
arma sozinho: ele importa a lista, nunca a copia. Hoje ele passaria a acusar as
cinco frases da §2.3 — **é essa a prova de que a lista morde**, e as cinco saem
nas LEX-6 e LEX-2.

**A mordida do próprio portão (rode-a, não a presuma):** ponha
`caixa.pack_start(rotulo_de_apoio("Este texto explica algo e nunca muda, então
não deveria estar aqui na página ocupando espaço."), False, False, 0)` em
`secao_janela.montar` → dente 1 reprova nomeando o texto. Ponha
`TITULO = "Barramento e portas"` em `secao_mesa` → dente 2 reprova. Desfaça as
duas.

**Prova de tela:** cosmetica-pre-aprovada *(não toca a tela)*.

### LEX-11 — as cinco frases de barramento saem

Executada junto com a LEX-6, e listada à parte para não sumir dentro dela.
Redação proposta, a confirmar em bloco com a §6:

| hoje | âncora | vira |
|---|---|---|
| `Barramento 1, porta 2.1 · Não sei · Em hub` | `secao_mesa.py:1440` | `Entrada 4 do hub (lido)` |
| `Nenhum outro rádio encontrado no barramento USB.` | `:925` | `Nenhum outro rádio espetado no computador.` |
| `O sistema informou o que este aparelho é, pelo próprio barramento USB.` | `:185` | `O próprio aparelho informou ao sistema o que ele é.` |
| `Lido do barramento USB: o Hefesto reconhece o hub.` | `:1450` | `Este aparelho está num hub, e o Hefesto sabe disso.` |
| `vizinho do adaptador 2` | `:1618` | `colado no adaptador "Sala"` / `colado na Entrada 4 do hub` |

**A mordida:** o dente 2 da LEX-10, já armado.

**Prova de tela:** precisa-do-olho-dela-antes *(texto reescrito)*.

---

## 4. O carimbo de prova de tela, junto

| tarefa | carimbo |
|---|---|
| LEX-4, LEX-10 | **cosmética, pré-aprovada** — remoção que ela pediu, e portão que não toca a tela |
| LEX-1, LEX-2, LEX-3, LEX-5, LEX-6, LEX-7, LEX-8, LEX-9, LEX-11 | **precisa do olho dela ANTES** |

Nove de onze pedem o olho dela porque **esta sprint é redação**: pela regra D3,
texto novo ou reescrito e ordem do que nasce visível são exatamente o que não
fecha sem ela. O jeito barato de pagar isso é **uma sessão só**: monte tudo,
fotografe a aba inteira com a bancada de quatro cards, e leve as onze mudanças
numa foto lado a lado com a de hoje — não onze idas.

**Não rode `retratar_abas.py` enquanto outra frente estiver montada**: ele
reescreve as onze fotos de uma vez, e duas frentes em paralelo gravam por cima
uma da outra.

---

## 5. Qual pergunta de Bluetooth trava esta sprint

**Nenhuma.** Onze tarefas, zero medições de bancada. Nada aqui para o daemon,
escreve no aparelho, toca em `bluetoothctl`, `btmgmt` ou `rfkill`. Tudo é
redação, widget e portão, sobre dados que o produto já lê.

A bancada dela segue livre a sprint inteira.

---

## 6. As perguntas para ela — nenhuma linha antes da resposta

Cinco, e todas cabem numa foto. Nenhuma pede que ela leia código.

**P1 — o botão "Não sei" do Desempenho.** Ali não é fato ignorado, é escolha não
feita, e o texto que já explica isso vive escondido numa dica
(`external_controllers.py:476`). Caminhos:
`Não declarei` | `Apagar minha escolha` | fica "Não sei" e ganha a marca de dica.

**P2 — a redação das duas perguntas de rádio (LEX-9).**
`O dongle fica acima da cabeça de quem joga sentado?` + `Tem gente sentada entre
o dongle e o sofá?` | as mesmas duas com "adaptador" no lugar de "dongle" |
outra redação dela.

**P3 — o que o produto diz quando é ELE que não sabe (LEX-8).**
`O Hefesto não sabe` (converge com `secao_mesa.py:201`) | `—` com a explicação no
hover | outra.

**P4 — a palavra da coluna nova (LEX-6/LEX-11).**
`Entrada 4 do hub` | `Porta 4 do hub` | `Hub, entrada 4`. A pergunta atrás dela:
quando ela olha o gabinete, ela conta *entradas* ou *portas*?

**P5 — a ordem das seções.** Não é pergunta nova: é a `FECHA-01` T12, ainda
aberta. **Meça depois desta leva antes de perguntar de novo** — esta sprint
devolve ≈520 px (§2.1) mais ≈79 px por fileira de cards (§2.4), e pode ser que a
resposta certa passe a ser "não precisa reordenar nada".

---

## 7. A posse, e as colisões que eu enxergo

O frontmatter está no topo. O que ele **não** diz cabe aqui.

**Esta frente toca redação em toda a aba, e as outras três tocam estrutura.** É
a colisão estrutural da leva, e a saída é a ordem: `depois_de: [A, B, C]`. Rodar
a D antes obriga a refazer a redação de cada seção que A, B ou C reescrever.

| arquivo | com qual frente | resolução sugerida |
|---|---|---|
| `config/secao_mesa.py` | **A** (mapa 2D) — reescreve a seção inteira | D roda depois. A LEX-6 e a LEX-7 mexem em `_desenhar_radios` (`:917`) e `_desenhar_adaptadores` (`:811`), que é onde A vai morar. Se A criar `secao_conexoes.py`, a D segue o arquivo novo — o `TITULO` é que é o contrato, não o nome do módulo. | <!-- ref-externa: nome hipotético da frente A, ainda não existe -->
| `config/secao_mesa.py:1618` (`vizinho do adaptador N`) | **A** (que declarou ficar com a vizinhança e oferece `mapa_das_portas.vizinhas_de_verdade`) e **B** | B provavelmente reescreve o mesmo sufixo para virar ordem. **Quem escreve a frase é B; quem garante que ela não volta a dizer "adaptador 2" é o portão da LEX-10.** D não escreve a frase se B já a escreveu. |
| `config/secao_controles.py:635` + `:462` (frase do microfone) | **C** (conta de slots) | **cede a C** — a frase acompanha a caixinha do microfone para Desempenho. D só declara que ela não pode ficar como parágrafo. |
| `config/secao_orcamento.py` (título e `ALCANCE_DE_HOJE`) | **C** | C põe a conta de slots dentro de Desempenho; D renomeia o título e move a frase para a dica. Duas linhas cada, sem sobreposição de bloco. |
| `config/secao_exame.py:261` (`ESCOPO`) | **B** | B reescreve o corpo do exame; D só move o parágrafo para a dica do título (`:55`). Se B já tiver tirado o parágrafo, a LEX-2 perde uma linha e ganha o dia. |
| `config/secoes.py` | **A** e **B** (se criarem seção) | **D não toca.** A ordem continua tendo um dono, e a decisão dela (§6 P5) é quem a muda. |
| `app/ipc_bridge.py:799-803` | **C** — e ela já declarou a colisão do lado dela | duas linhas vizinhas do MESMO dicionário: C troca `"orcamento"`, D troca `"mesa"`. Proposta de C, e eu concordo: **as duas trocas num commit só, de quem chegar primeiro**. A derivação da LEX-1 torna a discussão sem objeto — depois dela o dicionário não guarda nenhuma das duas palavras. |
| `config/secao_controles.py` | **C**, que move a caixinha do microfone inteira (`:407-429`, `:437`, `:466`, `:499`, `:599`, `:794`) — **e não a declarou no `posse:` dela** | avise C. D só lê `:462` e cede a linha. |
| `app/widgets/external_card.py` | **C** (a caixinha do microfone sai do card) | as duas mexem no mesmo arquivo em blocos diferentes: C em `_linha_dos_botoes`, D em `_linha_da_cor` (`:278`). Cabe em paralelo; se der conflito, D depois. |

**O que D NÃO toca, e está no frontmatter:** `mesa_de_radio.py`,
`radio_da_mesa.py` e `exame_da_mesa.py`. Nenhuma leitura, nenhuma conta e nenhum
critério de exame muda nesta frente — só a palavra que os mostra.

---

## 8. O que sobrou para o próximo

1. **A ordem das seções continua aberta** — é a `FECHA-01` T12, e a pergunta é
   dela. Esta sprint devolve ≈520 px (§2.1) mais ≈79 px por fileira de cards
   (§2.4), o que **muda a aritmética da decisão**: pode ser que, depois desta
   leva, a aba caiba sem reordenar nada. Meça de novo antes de perguntar.
2. **`entrada_de_tela` nasce com `declaradas={}`** (LEX-6). Ligar o mapa 2D é da
   frente A, e a chave do `maquina.json` é dela — não a invente aqui.
3. **`censo_do_barramento` ganha o segundo consumidor** com a coluna "Entrada",
   mas `apelido_do_dongle.Dongle.ligado` (`:217`) continua chegando e morrendo
   sem consumidor nenhum. Não é desta sprint; é dívida com endereço.
4. **O `campo_de_busca` nasce com dois usuários** (cor e tipo de rádio). O
   terceiro candidato é o nome do adaptador, hoje um `Gtk.Entry` livre
   (`secao_mesa.py:902`) — ali a busca não serve, porque o nome é invenção dela e
   não escolha numa lista. Escrito para ninguém tentar.
5. **Pro Controller e 8BitDo** ficam para a 1.0, por decisão dela de hoje. O
   `campo_de_busca` da cor é DualSense-only enquanto isso — `NOMES_DE_FABRICA`
   só tem códigos de DualSense.
