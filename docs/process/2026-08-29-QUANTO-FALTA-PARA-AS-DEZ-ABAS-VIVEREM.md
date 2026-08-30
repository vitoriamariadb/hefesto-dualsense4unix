# QUANTO FALTA PARA AS DEZ ABAS VIVEREM — o placar

**29/08/2026.** Ela disse, ao ver os mockups: *"umas 80% ou mais de tudo ali já
existe e funciona na interface; falta só ligar e conectar as abas"*. Dez censos
mediram as dez páginas contra o daemon vivo e contra o `src/`. Esta página
transforma a frase dela em número.

**A resposta curta: ela está certa sobre os GESTOS e errada sobre os VALORES —
e a diferença tem uma causa só.** Medido em 29/08, com o daemon dela ligado:

| | soma das nove abas medidas | % |
|---|---|---|
| **valores na tela** | **397** | |
| …já no `daemon.state_full` | **137** | **34,5%** |
| **gestos na tela** | **319** | |
| …já com método de IPC | **167** | **52,4%** |

Os 80% aparecem quando a pergunta muda de *"está no `state_full`?"* para
*"o processo da GUI consegue ler isso hoje?"* — e a segunda pergunta é a certa,
porque **o mockup vai rodar DENTRO da GUI**, num `WebView` da mesma janela. Nas
quatro abas em que um censo mediu essa segunda chave, o número dela se sustenta
com folga: Conexões **96%**, Sistema **94%**, Perfis **88%**, Vibração **60%**.

---

## 1. O placar, aba por aba

Contagens dos dez censos de 29/08. Um traço é *"este censo não mediu esta
chave"*, não *"zero"*.

| Aba | Valores | No `state_full` | Com fonte no produto | Gestos | Com IPC | Com caminho no produto |
|---|---:|---:|---:|---:|---:|---:|
| **02 Controles** | **121** medidos ao vivo | **121 · 100%** | — | 38 | 0 escrevem | eco, sem dono declarado |
| 09 Sistema | 18 | 9 · 50% | **17 · 94%** | 16 | 15 · 94% | 13 já com widget |
| 08 Conexões | 26 | 10 · 38% | **25 · 96%** | 36 | 28 · 78% | 28 já desenhados e ligados |
| 10 Perfis | 17 | 10 · 59% | **15 · 88%** (pelo `loader.py`) | 16 | 2 · 12% | **12 · 75%** já funcionam |
| 04 Iluminação | 38 | 26 · 68% | — | 64 | **57 · 89%** | — |
| 03 Gatilhos | 71 | 20 · 28% | 36 · 51% (o daemon sabe) | 24 | 19 · 79% | 11 · 46% onde o produto aceita |
| 01 Jogar | 55 | 27 · 49% | — | 35 | 17 · 49% | — |
| 05 Vibração | 50 | 14 · 28% | 30 · 60% (só global) | 36 | 25 · 69% | **0 com endereço por controle** |
| 06 Navegação | 95 | 20 · 21% | — | 78 | 4 · 5% | 14 · 18% com parciais |
| 07 Lançadores | 27 | 1 · 4% | 3 · 11% | 14 | **0 · 0%** | 5 · 36% sem IPC |

**A 02-Controles é a única viva, e ela é viva pela metade.** Medido agora, com o
piloto oculto: **121 valores por pintura**, dez pinturas por segundo, **1,1% do
orçamento do tique de 100 ms**. Mas o piloto *não escreve nada* — o único método
que ele pronuncia é `daemon.state_full`, e os gestos ecoam de volta sem dono. A
metade que lê está provada; a que escreve não começou.

*(Correção de fato ao enunciado do trabalho: ele diz "125 valores por pintura, a
1,0% do orçamento". Medido em 29/08 às 21:01, com os dois controles dela no
cabo: **121** e **1,1%**. O número depende da mesa — não é constante.)*

---

## 2. A ordem, da mais barata para a mais cara

O custo não é a contagem de itens que faltam: é **que tipo de trabalho** cada
falta é. Três tipos, e o preço deles é muito diferente:

- **LIGAR** — o dado existe, a rota existe, falta o endereço na tela.
- **PUBLICAR** — o daemon sabe e não conta. Uma chave no payload.
- **CONSTRUIR** — não há uma linha de código. É sprint de produto, não de tela.

| # | Aba | O que falta, e de que tipo |
|---|---|---|
| **1** | **Sistema** | **LIGAR.** Duas fiações (`daemon.resume` → botão "Retomar"; `plugin.list` → "Ver os plugins", os dois com IPC pronto e sem botão) e **um** gesto novo, "Restaurar de fábrica" — 0 ocorrências em `src/`. 13 dos 16 gestos já têm widget hoje. |
| **2** | **Conexões** | **LIGAR.** É a aba Configurações de hoje rearranjada: **28 dos 32 gestos já estão desenhados e ligados**. Mais 2 renomeações de botão e 4 seletores novos. Um valor sem rota: o "Vê como" por controle — e ele **tem** rota, ver §4. |
| **3** | **Perfis** | **LIGAR.** A aba já existe inteira em GTK: 41 objetos no Glade, 9 diálogos, 4400 linhas de `profiles_actions.py`. Faltam **4 gestos**, e um deles tem o backend pronto há semanas (`loader.restaurar_do_historico:1509`, vivo só na CLI). O mockup tem *menos* controles que o produto. |
| **4** | **Iluminação** | **LIGAR + PUBLICAR pequeno.** `led.set`, `led.player_set` e `identity.number.set` **já aceitam `uniq`**: passar de uma coluna para N é um laço. Os dois canos novos são pequenos — `lightbar_brightness` (hoje entra pelo `apply_draft` e nunca sai; **0 ocorrências** no `state_full`, medido) e o colorway por controle. |
| **5** | **Gatilhos** | **PUBLICAR.** 79% dos gestos já têm rota (`trigger.set` com `uniq`), e o perfil já tem a casa (`Profile.controllers[uniq].triggers`). O que falta é o payload: `grep trigger` no `state_full` vivo devolve **só `trigger_replicas`**, que é contador de vpad — enquanto o dado está vivo no daemon, em `_desired_by_uniq[uniq].trigger_left/right`. |
| **6** | **Jogar** | **CONSTRUIR duas frentes.** 49%/49%, e o que a derruba são **17 dos 35 gestos concentrados em duas coisas que o código nunca teve**: a máscara por controle (12 gestos — `gamepad.emulation.set` não aceita `uniq`, e "Nintendo Pro" não existe: `mascaras_validas()` = 2) e a escada de pontes (5 degraus, e os 4 reais do `ponte_escada.ESCADA` não são esses). |
| **7** | **Vibração** | **CONSTRUIR + UMA DECISÃO DELA.** 69% dos gestos têm IPC e **nenhum tem endereço**: os cinco handlers de rumble leem cinco chaves e nenhuma é o alvo (`weak`, `strong`, `enabled`, `policy`, `mult`). O produto já confessa isso na tela (`rumble_actions.py:424`). E duas contradições que só ela resolve: "Máximo + 150%" ao mesmo tempo (o esquema recusa o par) e o "Auto" por coluna (o esquema **levanta** com mensagem). |
| **8** | **Navegação** | **CONSTRUIR cinco famílias.** Remapeamento botão→botão (21 linhas, nenhum campo, nenhuma função, nenhum IPC), Modo Steam, Navegação Interna, as duas metades novas de velocidade (touch e dois dedos — o touchpad não tem rolagem, e a velocidade dele não é separável do analógico), e Point-and-click como estilo. Um caso barato no meio: as 4 combinações vivas já estão em `HotkeyConfig` e o `state_full` publica 2 dos 6 campos — **4 linhas de payload tiram 10 valores da cena fixa**. |
| **9** | **Lançadores** | **CONSTRUIR o que não existe.** `retroarch|dolphin|mgba` → **0 ocorrências em `src/`**; `heroic|lutris` → 5, todas em comentário. O produto não sabe que o RetroArch existe. **Mas há um achado que inverte metade da conta:** `levantar_censo()` já roda e devolve 24 jogos com veredito, estorvo e ponte, `Censo.como_dicionario()` já é JSON puro, e tudo isso alimenta hoje **uma linha** do cartão de saúde. É "a casa sabe e o produto não faz" no exemplar mais caro — e é a parte de 07 que realmente é só ligar. |

---

## 3. A primeira a ficar viva depois da Controles

**Pelo que já existe, é a Sistema** — 94% dos gestos com IPC, 94% dos valores
com fonte, 13 dos 16 gestos já desenhados, e o menor HTML das dez (976 linhas).
Duas fiações e um gesto novo.

**E isso discorda da ordem já escrita**, e a discordância vale o registro. A
[`2026-08-29-MIGRA-A-ORDEM-das-dez-abas.md`](sprints/2026-08-29-MIGRA-A-ORDEM-das-dez-abas.md)
põe a **Vibração** na posição 1 e a **Sistema** na 6. As duas ordens medem
coisas diferentes, e as duas estão certas na sua chave:

| | ordena por | Vibração | Sistema |
|---|---|---|---|
| a ordem das sprints | **quanto desenho** há para migrar (8 sprints, e foi nela que a prova da tecnologia rodou) | 1ª | 6ª |
| este placar | **quanto backend** já existe | 7ª | 1ª |

A Vibração é barata para **pintar** e cara para **ligar**: as quatro colunas
mostrando um valor global são fáceis; fazê-las por controle pede `uniq` em cinco
handlers e uma decisão dela. A Sistema é o contrário — quase nada a construir, e
uma aba inteira que só precisa de endereço.

**A recomendação, e ela é uma pergunta para ela:** se o objetivo da posição 1 é
*provar o enxerto substitutivo com o menor risco*, a Vibração continua certa. Se
o objetivo é *ver uma aba inteiramente viva o quanto antes*, é a **Sistema**, e
depois a **Conexões** — que é a que traz o laço por controle, as pop-ups e 96%
dos valores já sourced, ou seja, o padrão inteiro de uma vez.

---

## 4. As correções que esta medição fez nos censos

Medidas em 29/08 contra o daemon vivo. Cada uma substitui a afirmação anterior.

1. **A máscara por controle TEM rota até a tela, e o censo da 08 disse que não.**
   Ele escreveu: *"é o único valor das duas páginas sem rota até a tela"*.
   Medido: `coop.mesa[N].vpad_nome` publica, por controle e por `uniq`, o nome do
   gamepad virtual — `"Microsoft X-Box 360 pad (Hefesto - Dualsense4Unix
   virtual)"` nos dois controles dela agora. O nome sai de `FLAVORS[...]["name"]`
   (`integrations/uinput_gamepad.py:117,122`), e `app/widgets/controller_card.py:1118`
   **já o lê**. A máscara efetiva por controle é derivável do nome hoje; o que
   falta é um campo que a diga por extenso, não uma rota.
2. **`mascara_divergencias` não é por controle.** Ele aparece 40 vezes no payload
   e engana: as 19 entradas são por **appid/perfil**
   (`gamepad_emulation.mascara_divergencias[].{appid, profile, mascara_perfil,
   mascara_viva}`), não por aparelho.
3. **O acelerômetro não está no payload, e a ausência é literal:** `grep accel` no
   `state_full` vivo devolve **0**. Confirma o censo do `mapa-do-controle`.
4. **`lightbar_brightness` e o colorway: 0 ocorrências cada** no payload vivo.
   Confirma os censos da 04, 05, 06, 08 e 10.
5. **Os 121 valores da 02, e não 125** — ver §1.

---

## 5. O que este placar NÃO mede

- **A 02-Controles não tem censo de valores e gestos** como as outras nove: ela
  estava travada por uma leva em voo. Os 121/38 desta tabela são medição minha,
  de fora, e não substituem o censo.
- **A conta dos "gestos" tem duas gramáticas nos censos**, e a divergência é de
  enquadramento, não de erro. Conferido por contagem mecânica do HTML: a 08 tem
  **79** elementos clicáveis contando as quatro pop-ups, contra os **36** que o
  censo dela conta (só o corpo da aba); a 06 tem **96** contra **78** (o censo
  conta um campo de número como um gesto, e o HTML tem dois botões). As outras
  sete batem: 03 = 24, 04 = 64, 05 = 36, 07 = 18, 09 = 15, 10 = 15, 01 = 35 com
  os chips e degraus que não são `<button>`.
- **"Ligar" não é gratuito.** Cada valor ligado é um `id`/`data-*` na página e uma
  linha na ponte; as 109 sprints da migração são o orçamento disso, e este placar
  mede o que está do outro lado da ponte, não a ponte.

---

## 6. As duas páginas que ninguém alcançava, e agora alcança

Fora das dez abas há duas páginas grandes e sem porta — medido: `grep -c` nas dez
abas devolvia **0** para as duas. Ganharam porta em 29/08:

| Página | Porta | Onde |
|---|---|---|
| `mapa-do-controle.html` (1309 linhas, gerador `_ferramentas/mapa.py`, **dois** portões o medem) | *"Banco de provas: o mapa do controle ↗"* | `.quadro-topo` da aba **Navegação** — é de lá que saem as 21 linhas das duas telas de botões dela |
| `mapa-das-portas.html` (1475 linhas, **sem** gerador) | *"Banco de provas: o mapa das portas ↗"* | `.quadro-topo` de "Rádio e adaptadores", na aba **Conexões** |

A porta natural do mapa do controle é também a aba **Controles**, e ela estava
travada; a linha exata para colar está no relatório da leva.

**E a sincronia que a porta obrigou:** `mapa-das-portas.html` existe em **dois
lugares** — `novo-layout/` e `docs/process/sprints/2026-08-24-ABA-CONEXOES/mockup/`
—, e o portão `test_o_mockup_carrega_os_mesmos_numeros_que_o_python` olhava para **uma** só.
Ele estava verde enquanto a cópia do `novo-layout` — a que ela abre com duplo
clique — carregava `CUSTO_SEM_MIC = 260, CUSTO_COM_MIC = 277` e `>277</b>/s`, que
é exatamente o literal que a última linha dele proíbe. As duas cópias foram
igualadas e o portão passou a medir **as duas, e a igualdade entre elas**.
