## CENSO DAS SPRINTS ABERTAS CONTRA OS DESENHOS DE 26/08

**Universo medido:** 289 arquivos em `docs/process/sprints/`. A fila autoritativa é `docs/process/SPRINT_ORDER.md` §3 — **140 abertas/parciais**, mais as **10 sprints-donas de aba** de 24/08 (§0.3; a de Configurações fechou em `cf78346`) e as **8 frentes Z0–Z7** da Onda 0 = **158 documentos vivos**. Destes, **85 têm dono numa das oito abas que ela desenhou** (§0.4).

Confirmei no disco que os alvos dos desenhos existem hoje: `src/hefesto_dualsense4unix/gui/main.glade:539` ("Ouvir no controle"), `:1409` ("Desenho das 5 luzes"), `:1580` ("Aplicar o desenho"), `:1354` ("Voltar todos ao automático"), `:2275` ("Modo avançado"), `:2469` ("Esconder os controles físicos neste jogo"), `:3445` (o parágrafo de nove linhas da máscara). Nenhum item dela está pré-feito.

---

### A. SUBSTITUÍDAS pelo desenho — 12 (saem da §3)

O que restava em cada uma é exatamente a pergunta que o desenho responde, e responde mais simples.

| Sprint | Por quê |
|---|---|
| `sprints/2026-08-16-TRES-MODOS-DO-SOM-01-o-que-sai-onde-e-quem-escolhe.md` | O que restava eram as cinco decisões P-1 a P-5 ("o que sai onde e quem escolhe"). O texto dela decide as cinco: mic ATIVO no máximo, alto-falante 100% em "Sons do jogo", e o gesto dela na Status prevalece (STATUS-1/2/3). A medição por rádio já tem dono na trilha BT. |
| `sprints/2026-08-13-MESA-CHEIA-01-a-fita-do-alvo-ganha-a-cor-de-cada-um.md` | Pedia a linguagem de cor nos chips das ONZE abas. GATILHOS-3 pede a mesma coisa numa aba só, com borda na cor do plástico real — mesma entrega, um décimo do escopo. |
| `sprints/2026-08-13-MESA-CHEIA-02-a-marca-de-quem-escolheu-na-aba-gatilhos.md` | Era ela que "dá o formato da marca". GATILHOS-3 dá o formato: borda na cor do plástico, chips clicáveis. |
| `sprints/2026-08-13-MESA-CHEIA-03-a-mesma-marca-na-aba-lightbar.md` | Pedia a marca "nos seis presets" da Lightbar. LIGHTBAR-1 apaga os seis presets. O alvo deixa de existir. |
| `sprints/2026-08-13-MESA-CHEIA-04-a-marca-vira-gesto.md` | "A marca vira gesto" = clicar o chip escolhe o alvo. GATILHOS-3 diz literalmente "e continuam clicáveis". |
| `sprints/2026-07-27-LIGHTBAR-JOGADOR-01-a-cor-e-consequencia-do-jogador.md` | ABERTA há 25 dias, E0 a E4: fazer a cor ser consequência do número do jogador. LIGHTBAR-1+2 entregam isso apagando o painel e pondo o seletor de número no lugar — o `player_led_pattern(slot)` já faz sozinho. |
| `sprints/2026-08-15-ONDE-A-COR-MORA-01-a-borda-diz-quem-e-e-o-anel-diz-o-que-esta-escolhido.md` | É uma **proposta para o olho dela** (~190 linhas de borda+anel). O desenho é a resposta: ela quer o SVG do DualSense pintado (LIGHTBAR-6), não a metáfora de borda e anel. |
| `sprints/2026-07-29-LARGURA-01-a-mesma-largura-em-todas-as-abas.md` | O que restava (E5–E8) é o `_WRAP_COLUNAS` fixo quebrando parágrafos longos. Vinte e poucos parágrafos saem da tela pelos itens de tooltip. O defeito perde o corpo. |
| `sprints/2026-07-25-LEGIBILIDADE-01-texto-legivel-alvo-clicavel.md` | Idem: "o lugar dos analógicos e a largura a 1180x830" tem de ser **remedido depois** das remoções — medir agora é medir uma tela que vai deixar de existir. |
| `sprints/2026-07-29-PERFIL-SALVA-TUDO-01-salvei-todas-as-abas-e-so-parte-ficou.md` | E5/E6, "salvei todas as abas e só parte ficou". PERFIS-2/3 + RUMBLE-9 + STATUS-2 dão o desenho final e mais simples: Aplicar e Salvar viram um gesto só, no perfil ativo, honrando a fita. |
| `sprints/2026-07-31-CARD-OCUPA-01-o-desenho-ocupa-o-vao-que-o-teto-devolveu.md` | Só faltava a **E4, que É a palavra dela**: a aba Estado maximizada e ela dizer se os elementos ocuparam os vãos. As duas fotos de 26/08 são a aba Estado maximizada — e ela não pediu nada dos vãos; pediu a remoção de "Ouvir no controle". |
| `sprints/2026-08-01-JANELA-QUE-RESPIRA-01-os-consertos-de-largura-que-a-casa-ja-tinha-decidido.md` | ENTREGUE, faltava "o aceite dela na janela real". NAVEG-1 é o aceite, com a correção junto: as barras esticam até a largura do cartão em vez de parar em 400px. |

---

### B. JÁ FECHOU — 9 (o disco desmente o cabeçalho; nenhuma está na §3)

Todas dizem "ENTREGUE EM CÓDIGO — AGUARDANDO A PALAVRA DELA" (ou "CONCLUÍDA" acima de um `Status: ABERTA` preservado). **Os desenhos são essa palavra** — ela fotografou a tela entregue e não reclamou do que a sprint entregou. Não saem da fila (já não estão nela): ganham nota datada e param de parecer abertas.

| Sprint | Estado real |
|---|---|
| `sprints/2026-07-26-STATUS-SIMETRIA-01-a-aba-que-era-pra-mexer.md` | ENTREGUE em `e96dea8`/`b3e8b7f`. As duas fotos dela mostram a faixa do card e ela não a marcou. |
| `sprints/2026-07-27-STATUS-SIMETRIA-02-distanciar-nao-e-organizar.md` | ENTREGUE em `8d7fd45`, com `VAO_MAXIMO_ENTRE_BLOCOS = 200` mordido em teste. |
| `sprints/2026-08-01-ALINHA-DUAS-LINHAS-01-a-aba-status-que-ela-chamou-de-feia.md` | ENTREGUE 01/08 com prova de tela; faltava o olho dela sobre a mesma aba que ela acabou de fotografar. |
| `sprints/2026-08-01-PAINEL-DA-VERDADE-01-a-aba-status-diz-o-que-chega-ao-jogo.md` | ENTREGUE 01/08 (E1, E2 e a base de E3/E4/E5). |
| `sprints/2026-08-01-CARD-UNICO-01-o-estado-entra-no-card-e-o-l3-vira-marca-dagua.md` | ENTREGUE 01/08, três entregas na tela. |
| `sprints/2026-07-27-VAO-01-a-tela-sobra-e-o-conteudo-aperta.md` | ENTREGUE 27/07 (E1 a E4); E5 fora por decisão. |
| `sprints/2026-07-27-EMPATE-01-tres-perfis-empatados-e-quem-ganha-e-o-alfabeto.md` | CONCLUÍDA (`profiles_actions.py:240`/`:245`, `manager.py:1055`). **Atenção:** PERFIS-4 REABRE o tema com pedido novo — escala 0–100 e empate IMPEDIDO, não desempatado. É trabalho novo, não esta sprint. |
| `sprints/2026-08-10-PERFIL-ATUAL-01-a-linha-dela-tem-cor-e-o-primeiro-lugar.md` | CONCLUÍDA, mordida em `test_perfil_atual_01...py:293`, commit `90d77d2`; o `Status:` abaixo pedia o olho dela. |
| `sprints/2026-07-25-PLAYER-01-um-numero-de-jogador.md` | ENTREGUE desde `14cd31b`. LIGHTBAR-2/11 são a palavra dela sobre esse seletor: ele funciona, e ela quer o MESMO gesto replicado dentro da Lightbar. |

---

### C. SOBREVIVEM REDUZIDAS — as 8 donas de aba (nenhuma sai)

O desenho apaga uma parte de cada uma e deixa o mecanismo de pé. Estas viram o plano de execução dos itens dela.

| Sprint | O que o desenho tira / o que fica |
|---|---|
| `sprints/2026-08-24-STATUS-DIZ-O-QUE-VE-01-o-hertz-que-sumiu-e-os-cards-fora-de-ordem.md` | STATUS-1/2/3 decidem o bloco de som (default e persistência). **Fica:** o hertz do giroscópio e a ordem dos cards. |
| `sprints/2026-08-24-PERFIS-ABRE-O-QUE-GUARDA-01-...md` | PERFIS-7 tira o carimbo da ponte da tela → tooltip. **Fica:** o perfil removido que ressuscita. |
| `sprints/2026-08-24-LIGHTBAR-COR-DE-CADA-UM-01-a-aba-mais-vazia-e-o-aceso-agora-que-nao-volta.md` | LIGHTBAR-1..11 redesenham a aba inteira. **Fica:** "o aceso agora que não volta" e o `_edit_uniq`. |
| `sprints/2026-08-24-GATILHOS-APLICADO-COM-PROVA-01-...md` | GATILHOS-2 é o mesmo pedido, dito por ela. **Fica inteira** — é o mecanismo que GATILHOS-2 exige. |
| `sprints/2026-08-24-RUMBLE-POR-JOGADOR-01-grava-na-peca-e-manda-na-mesa.md` | RUMBLE-9 é o título da sprint. **Fica inteira, e CRESCE:** RUMBLE-4/5/6/7 são pedidos novos. |
| `sprints/2026-08-24-INICIO-NAO-MENTE-01-a-ponte-que-nao-acende-e-a-escolha-que-ela-nao-fez.md` | INICIO-2 tira a linha da ponte da tela; INICIO-4 apaga o frame Sessão. **Fica:** a ponte que não acende (agora no tooltip) e INICIO-5/7 (trazer os botões do Sistema). |
| `sprints/2026-08-24-EMULACAO-UM-DONO-SO-01-a-mascara-com-cinco-donos-e-o-verde-que-nao-tem-alvo.md` | EMU-5 tira o parágrafo de nove linhas (`main.glade:3445`); EMU-6 tira a linha do Steam Input. **Fica:** o dono único da máscara e o verde sem alvo. |
| `sprints/2026-08-24-NAVEGACAO-UM-CONTROLE-SO-01-...md` | NAVEG-2/3/4/5 esvaziam a aba; NAVEG-6 reordena. **Fica:** os atalhos que somem, e **NAVEG-7 (tabela configurável) é entrega NOVA e GRANDE**. |

---

### D. SOBREVIVEM INTEIRAS — 56 nas oito abas + 73 fora delas

Sobrevivem porque medem mecanismo, aparelho ou rádio, e o desenho é sobre a tela. As que ela mandou preservar ("RESTANDO SPECS E AFINS") estão todas aqui.

**Mecanismo que os desenhos dela EXIGEM** (não substituem — *dependem*):
- `sprints/2026-08-22-QUATRO-MICROFONES-01-...md` — o interruptor que `bt_mic_enabled` nunca teve. Sem ele, STATUS-1 não existe.
- `sprints/2026-08-15-SOM-DE-CADA-JOGADOR-01-...md` — a E2 nunca ligada no botão. É o que STATUS-2/3 precisam para gravar por controle.
- `sprints/2026-08-15-UNIDADE-COR-01-o-controle-sabe-de-que-cor-ele-e.md` — a cor do plástico chegar ao produto fora da aba Configurações. É pré-requisito de LIGHTBAR-5 e LIGHTBAR-6.
- `sprints/2026-08-13-MESA-CHEIA-05-o-rumble-por-mac-...md` — `rumble_active` virar mapa por uniq. É pré-requisito de RUMBLE-9.
- `sprints/2026-08-24-ONDA0-Z4-O-PERFIL-GUARDA-TUDO-01-...md` — reforçada por STATUS-2, PERFIS-2/3 e RUMBLE-9 ao mesmo tempo.
- `sprints/2026-08-24-ONDA0-Z2-O-ALVO-GANHA-DONO-01-...md` — GATILHOS-2 e STATUS-3 são casos dela.
- `sprints/2026-08-16-ESCRITOR-CRU-01-a-steam-apaga-a-barra-...md` — LIGHTBAR-10 pede o **desligamento por controle** da reafirmação de cor (GATILHO-DA-COR-01, 12/08). A sprint não sai; ganha requisito.
- `sprints/2026-08-23-ESCONDE-SO-O-HIDRAW-01-...md` — PERFIS-6 tira a caixinha da tela, o que **decide a D-D**; o mecanismo continua com a Onda 12.

**Preservadas por ordem dela (specs e bancada) — nenhuma tocada:** `docs/data/mapa-controles.csv` + `specs.html`, `docs/protocol/*`, e as 35 da Faixa 5 + as 12 da Faixa 6, incluindo PROVA-NO-PLASTICO-01, O-QUE-PRECISA-DE-VOCE, A-CADEIA-DE-BLOCOS-01, O-ALTO-FALANTE-POR-RADIO-01, ESCADA-QUE-RESPONDE-01, A-PONTE-UNIVERSAL-01, CANETA-NA-MAO-01, MAPA-QUE-VIRA-PORTAO-02, CR-03/04/06, CHECKLIST-validacao-em-hardware, e todo o balde de BT da Onda 12.

**PROVA-DE-TELA-01 sobrevive sempre** (`sprints/2026-07-27-PROVA-DE-TELA-01-...md`): é o processo pelo qual estes desenhos existem.

---

### A CONTA

| | |
|---|---|
| Documentos vivos medidos | **158** (140 na §3 + 10 donas de aba + 8 frentes Z) |
| Com dono numa das oito abas desenhadas | **85** |
| **SAEM — substituídas pelo desenho** | **12** (da §3: 140 → **128**) |
| **SAEM — já fechadas, o cabeçalho é que mente** | **9** (já fora da §3; ganham nota datada) |
| **FICAM reduzidas** (as 8 donas de aba) | **8** |
| **FICAM inteiras** | **129** |
| **Total que some da mesa** | **21 de 158 — 13%** |

**A leitura honesta: os desenhos dela não eliminam "boa parte" das sprints.** Eliminam 21, e quase todas de uma família só — a das sprints de LAYOUT e de TEXTO DE TELA, que é exatamente onde o desenho substitui a discussão. As 129 que ficam não são fila de tela: são mecanismo, aparelho e rádio. **Se o alvo é "boa parte mesmo", o corte tem de vir de outra régua** — e a candidata medida é a §0.6 (Onda 12, nove baldes) mais as 35 da Faixa 5 que só destrancam com o controle na mão dela e com a bancada montada, que ela mesma mandou preservar.

---

### AMBÍGUO — não decido sem ela

1. **As 9 do bloco B contam como "palavra dela"?** Todas dizem "AGUARDANDO A PALAVRA DELA". Ela fotografou essas telas e não as marcou. **A pergunta exata:** *"nas duas fotos da aba Status e nas de Perfis, o que você NÃO marcou está aceito, ou você só não chegou lá?"* Se a resposta for "aceito", as 9 fecham hoje. Se for "não cheguei lá", nenhuma fecha e o bloco B some deste relatório.
2. **LEGIBILIDADE-01 e LARGURA-01 — substituídas ou adiadas?** Marquei substituídas porque medem parágrafos que vão sair. **A pergunta:** *"depois que os ~20 parágrafos virarem tooltip, você quer que a gente remeça a largura e o tamanho de fonte, ou aquilo já está resolvido para você?"*
3. **ONDE-A-COR-MORA-01** — é uma proposta com desenho pronto (borda + anel). LIGHTBAR-6 pede SVG. **A pergunta:** *"o SVG do controle SUBSTITUI a borda colorida e o anel de escolha, ou os três convivem?"* Se convivem, a sprint sobrevive e eu contei errado.
4. **PERFIS-4 vs. EMPATE-01** — a EMPATE-01 está concluída e resolveu o empate pela coluna "Quando usar" e pelo incumbente. PERFIS-4 pede que o empate seja **impossível**. **A pergunta:** *"a regra de desempate que existe hoje sai, ou fica como rede caso a proibição falhe?"*
