# ONDE PARAMOS — 09/09/2026, à noite: a bancada dela na tela INSTALADA, e as duas folhas que esperam

**Ela desligou o computador aqui**, depois de abrir o produto instalado com os
quatro DualSense na mesa e listar seis pontos. Este arquivo é o que sobra da
sessão: o que fechou, o que ela decidiu, o que caiu, e o comando exato do
próximo passo.

## §0 — O estado em uma linha

`dev` = `origin/dev` · árvore limpa · **13 sprints abertas de 648** · portões
**56** (38 no `--rapido`), um vermelho que é `reb/` — cópia velha fora do git,
decisão dela · o produto **instalado** (`rc=0`, doctor «tudo OK, 4 avisos»,
daemon reiniciado 21:56) · **nenhuma decisão dela pendente**.

## §1 — O dia, em três blocos

**1. O lote das seis sprints** (`1a1409b2`) — despachado em worktrees, costurado
em árvore de integração, merge em `dev`: ROLAGEM-01, LANCADORES-ZERO-01,
VIBRACAO-BARRA, MICROFONE-QUATRO-NÓS, MASCARA-NO-PERFIL, e o portão da quinta
pergunta (`97a184af`, `f7616031`).

**2. SOM-POR-CONTROLE-01** (`2628c4aa`) — o nó por controle ganhou rota, o nome
dela e a fonte `mix`/`sfx` no perfil. A conferência achou a **terceira conta do
«Controle N»**, que virou a sprint TRES-CONTAS-PARA-UM-NUMERO-01.

**3. A instalação e a bancada dela** — `install.sh --yes` sem `sudo`, 79
alterações / 26 de root, sem nenhuma FALHA. Ela abriu a interface e mediu.

## §2 — Os seis pontos dela, e o que cada um virou

| # | o que ela viu | virou |
| --- | --- | --- |
| 1 | *"com o mouse parado na frente da cor ele fica piscando e tirando o aviso e voltando"* <!-- noqa-acento: citação literal dela --> | **DICA-DA-COR-01** — o aviso sai da janelinha nativa do GTK e o X ganha pixel. Decisão dela: *"As dez abas de uma vez"* |
| 2 | *"maximizando a tela ela vai pra fora do limite, mas ponto 2 aprovado"* <!-- noqa-acento: citação literal dela --> | **ALTURA-DA-VISTA-01** — a janela mede 777 numa vista de 840. Decisão dela: *"1 + rodapé"* |
| 3 | *"não faz sentido... Ou no Máximo Localizar o lançador"* <!-- noqa-acento: citação literal dela --> | **LANCADOR-LOCALIZAR-01** — o «Consertar» sai do cartão já localizado. Decisão dela: campo + botão que abre o seletor |
| 3b | *"cada um dos lançadores passarem a ter os jogos com perfis dentro da aba perfis"* <!-- noqa-acento: citação literal dela --> | **JOGOS-DOS-LANCADORES-01** — remedir a biblioteca do Heroic quando o jogo dela terminar de baixar |
| 4 · 6 | Sistema **aprovado**; Vibração **aprovada** («se funcionar dentro do jogo é perfeito») | nada a fazer — a vibração dentro do jogo é a SENSORES-NO-JOGO-01 pela porta ao lado |
| 5 | *"mic tá igual e o de som também"* <!-- noqa-acento: citação literal dela --> | **MIC-SEM-FONTE-01** e as duas folhas da §3 |

## §3 — AS DUAS FOLHAS ESTÃO PRONTAS E NÃO FORAM RODADAS — é o próximo passo

`67142fbe`. Ela pediu com estas palavras: *"materializa o teste pensando em dois
controles. um com cabo e o da direita via bt. (…) Finalizado eu ja testo
contigo"* <!-- noqa-acento: citação literal dela --> — e depois *"com os
controles pra eu poder ver e tal"*. <!-- noqa-acento: citação literal dela -->

```bash
cd /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix
.venv/bin/python scripts/ensaios/a_folha_do_som_por_controle.py --listar
.venv/bin/python scripts/ensaios/a_folha_do_microfone_por_controle.py --listar
```

O `--listar` só lê `/sys`. Sem ele, a folha abre na tela dela, com os
deslizantes e os botões — como a folha de dez bytes da manhã.

**A folha do som** tem 10 linhas × 2 colunas (cabo × rádio). A ordem importa:

1. **o tom pelo CABO** é o controle positivo. Se ela não ouvir, a sessão para
   aí — não adianta medir o rádio contra um instrumento mudo;
2. **a luz pelos dois envelopes** — se acender por `SET_REPORT`, aquele
   envelope CHEGA ao firmware, e o silêncio do som é de outra camada;
3. **os seis cruzamentos** (3 arranjos × 2 envelopes), cada um com o gêmeo
   `CRC errado`. O sexto é o que esta casa nunca tentou.

**A folha do microfone** tem 6 linhas: o nó existe (relê a cada 2 s), o botão
«Pedir o canal», o pico ao vivo, o `common[6]`, o campo da tela e o corpo cru
do daemon.

Se o ensaio 13 der som por qualquer envelope, **a ponte do alto-falante
nasce** — e as três linhas de registro do daemon (`subsystems/__init__.py`,
`lifecycle.py`, `connection.py`) destravam para os quatro controles.

## §4 — O que CAIU nesta sessão

* **«A tarja mente» era MINHA afirmação, e era falsa.** Medido no daemon vivo:
  `ok` para os dois do cabo, `sem_fonte` só para os dois do rádio. A causa real
  é melhor: **a tela pergunta ESCREVENDO** — o `canal_fonte` já viaja no
  `state_full` a cada tique, e o deslizante nunca o lê. É a MIC-SEM-FONTE-01.
* **A ponte do microfone não está quebrada.** `BtMicSubsystem.alvos()` devolve
  `[]` até alguém PEDIR o canal: o nó sobe sob demanda, e por isso só 1 de 4
  existia.
* **A piscada do X não é do DOM.** `MutationObserver` em `document.body`, 9 s,
  72 amostras, **zero mutações**. É a janelinha nativa do GTK (medida depois
  como janela X11 498x47+0+488).
* **O X tinha ZERO px de largura** na janela pequena (botão de 10,94 px). A
  conferência anterior mediu a COR do X e nunca a LARGURA dele.
* **A passada seca com MAC MASCARADO mede errado** — `rota_do_no` devolveu
  `tem_rota=False` para os quatro. Refeita com os `uniq` reais lidos do
  `coop status --json`, imprimindo só mascarado: 2 do cabo TRUE, 2 do rádio
  FALSE.

## §5 — As armadilhas deste dia

1. **`--rapido` NÃO é o portão.** Fechei duas frentes com 36 verdes e deixei
   **20 violações de acentuação** vivas. O portão é `bash scripts/portoes.sh`
   **sem argumento**.
2. **`grava=` omitido não tem portão.** Três gestos da 04 aprenderam a
   escrever no perfil e não declararam — a prova de clique gravava no perfil
   REAL dela a cada volta. Dois agentes acharam; régua nenhuma acha.
3. **Mexer numa linha desloca as citações de outros arquivos.** O acordeão
   moveu `aba03.py:878` para linha em branco e quebrou quatro citantes. Sempre
   `grep -n` depois.
4. **O vigia de memória do harness mata tarefa de FUNDO.** Matou o
   `portoes.sh` da árvore de integração. Refazer em PRIMEIRO PLANO, em pedaços.
5. **Prevenir e avisar não se somam.** A §3.2 da COR-X-01 pedia «o clique não
   muda e a tela diz de quem é» quando a decisão de origem dela é **impeça**.

## §6 — A fila ao voltar

**Primeiro as duas folhas da §3, com ela** — é o que ela pediu por último.

Depois, as seis sprints da bancada, nesta ordem (as duas primeiras são as que
ela vê a cada segundo):

1. **ALTURA-DA-VISTA-01** — altura fluida + cabeçalho + rodapé
2. **DICA-DA-COR-01** — as dez abas de uma vez, em etapas, com foto
3. **LANCADOR-LOCALIZAR-01** — campo + seletor
4. **MIC-SEM-FONTE-01** — a tela LÊ o `canal_fonte` em vez de escrever
5. **TRES-CONTAS-PARA-UM-NUMERO-01** — e leia a **§6**, que é dela
6. **JOGOS-DOS-LANCADORES-01** — depois que o jogo dela baixar

As sete que precisam das mãos dela na bancada estão na §2 do
[handoff da madrugada](2026-09-09-ONDE-PARAMOS-os-instrumentos-prontos-e-a-bancada-que-ela-faz-ao-voltar.md):
A-BANCADA-QUE-O-RADIO-PEDE-INDICE, FONE-01, LUZ-NO-RADIO-01, MESA-DE-QUATRO-01,
MIC-VOLUME-02, SENSORES-NO-JOGO-01, INDICE-0908-NOITE.

## §7 — A palavra dela que muda o desenho da cura

Ao ouvir que o censo do som atribui o microfone virtual ao controle errado:

> *"aí é foda pq a ideia não é termos nada focado pro meu caso apenas, mas como
> produto que possa funcionar com outra pessoa."* <!-- noqa-acento: citação literal dela -->

Isso está registrado na §6 da TRES-CONTAS-PARA-UM-NUMERO-01, e o que ela decide
é concreto: **casar nó com controle pelo TEXTO do rótulo é a cura errada**,
mesmo funcionando aqui. O rótulo é prosa em português, muda com o assento, some
com uma renomeação. A âncora tem de ser propriedade do nó — identidade estável
do aparelho —, e o rótulo continua sendo só o que a pessoa lê.

## §8 — O próximo comando

```bash
cd /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix
git log --since=midnight --format='%h %s'     # o que esta casa fechou hoje
.venv/bin/python scripts/ensaios/a_folha_do_som_por_controle.py --listar
```
