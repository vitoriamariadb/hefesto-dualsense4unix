# Como executar uma sprint

**Você é o agente executor. Este arquivo é o seu protocolo, do começo ao fim.**

Irmão de [COMO-REGER-AGENTES.md](COMO-REGER-AGENTES.md), que ensina **quem
despacha**. Este ensina **quem executa**. Cada linha aqui é um defeito real de
23/08/2026 — três falhas de processo, remendadas à mão por uma pessoa que um
`/clear` apaga. Preferência sem cicatriz não entrou.

**Se um comando desta página não existir na sua árvore**, a peça de infra ainda
não foi costurada: **pare e relate a quem despachou**. Não improvise um caminho
equivalente — é assim que se inventa medição falsa.

---

## 1. Antes de tocar em qualquer coisa

Quem despachou já te imprimiu cinco coisas: **a sua árvore, a linha de
`PYTHONPATH`, o que você possui, o que você NÃO toca, e o estado da bancada.**
Confira as duas primeiras antes de qualquer outra coisa:

```bash
git rev-parse --show-toplevel     # tem de sair ../hefesto-voo/<sprint>-<agente>
source .envrc-voo                 # PYTHONPATH + PYTEST_ADDOPTS
python -c 'import hefesto_dualsense4unix as m; print(m.__file__)'
```

**Se o `__file__` sair na árvore principal, PARE.** O install editable grava um
caminho **absoluto** em `_editable_impl_hefesto_dualsense4unix.pth`: sem
`PYTHONPATH`, você importa o código do vizinho e mede a árvore dele. É a
falha 2 ressuscitada dentro da própria cura, e é o padrão *"o instrumento mente
mais que o produto"*.

Depois, leia **nesta ordem** e pare quando já souber o bastante:

1. **a sua sprint** — o frontmatter `posse:` / `cria:` / `bancada:` /
   `depois_de:` / `nao_toca:` é o contrato; o corpo é o porquê;
2. **o ONDE-PARAMOS mais recente** em `docs/process/` — o que já foi medido, para
   você não remedir;
3. [COMO-OLHAR-A-TELA.md](COMO-OLHAR-A-TELA.md) — **obrigatório se o trabalho
   toca a tela**;
4. a **linha do seu canal** em `docs/data/mapa-controles.csv` — antes de afirmar
   que uma feature funciona num transporte. É portão, não documentação.

---

## 2. A posse

O frontmatter da sprint e o preâmbulo do despachante dizem o que é seu. **Se
divergirem, manda o despachante** — ele leu o disco de hoje.

**Quando o conserto pede arquivo alheio: RELATE, não edite.** Escreva o achado
em *"o que sobrou para o próximo"* (§7) e siga. Foi dessa disciplina que
nasceram as continuações que fecharam em 24/08 — e é ela que impede que a sua
edição e a do vizinho, ambas válidas, virem "a última a gravar vence".

A sua árvore é só sua, então `git add -A` aqui não engole trabalho de ninguém —
mas **ela não apaga a colisão, só a faz gritar**: dois agentes no mesmo arquivo
viram conflito de merge na costura. Barulho é o produto desejado; sobrescrita
silenciosa era o defeito.

**`main.glade` é exceção, e é dura.** XML único, sem seções nomeadas: conflito de
merge nele é irrecuperável na prática. Ele é **recurso de bancada** — uma sprint
por vez — a menos que o seu frontmatter declare faixa de linha. Não declarou?
Não salve o Glade; relate.

---

## 3. A bancada

Daemon vivo, `hidraw`, `btmon`, `systemctl`, o controle na mesa: **recurso
físico único**, e ela mede Bluetooth nele.

```bash
scripts/bancada.sh status      # uma linha
scripts/bancada.sh exigir      # rc=1 com motivo e hora -> você NÃO passa
```

Chame `exigir` **antes** de todo caminho que pare o daemon, escreva no aparelho
ou toque em `systemctl`. **rc=1 significa esperar e DIZER que está esperando**
na entrega — nunca contornar por outro caminho.

Se a bancada estiver livre e você precisar dela, reserve com teto curto
(`--horas 1`) e libere ao terminar. **O teto é a rede, não o `liberar`**: o que
não volta sozinho trava a casa para sempre — é a lição do `btmgmt` sem
adaptador.

---

## 4. A mordida — a parte que mais importa

Um teste que passa com a cura arrancada não testa nada. A sequência é
**cinco passos, e o terceiro é o único que prova alguma coisa**:

1. escreva o teste;
2. **arranque a cura** (comente a linha do produto, nunca o teste);
3. **rode e VEJA REPROVAR** — copie a saída;
4. devolva a cura;
5. rode e veja passar — copie a saída.

```bash
python -m pytest tests/unit/test_do_seu_escopo.py -q
```

**As duas saídas vão coladas na entrega.** Sem a saída da reprovação, ninguém
consegue distinguir a sua régua de uma que só sabe passar — e em 23/08 um
conferente pegou um conserto que **reintroduzia o defeito que curava**, porque o
dublê nunca fracassava e o caminho de erro nunca era exercido.

**Todo dublê tem de saber RECUSAR**, e o teste exercita as duas respostas. Régua
que só sabe passar não é régua.

O molde de portão desta casa está em
`tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py` — leia o cabeçalho dele
antes de escrever um portão novo.

**CPU é compartilhada.** Se o seu escopo passa de um arquivo de teste, rode pela
camada de aceite, que pega a ficha: dois workflows disputando 16 núcleos já
mediram **398 s como piso**.

---

## 5. O que NÃO rodar

- **a suíte inteira.** Cria nós `uinput` de verdade — 1.289 num dia derrubaram o
  fullscreen dela. Rode **o seu escopo**;
- **`scripts/gui-captura/retratar_abas.py`** — reescreve as onze fotos de uma
  vez. Quem fotografa é quem coordena, depois que a leva fecha. Desde
  24/08/2026 há gancho cobrando a foto (`scripts/check_fotos_da_tela.py`), e
  ele **se cala na sua worktree** justamente por isto: você commita `app/` à
  vontade, sem foto, e a cobrança cai na árvore de quem integra;
- **qualquer portão que reescreva artefato compartilhado** (`gerar-mapa.py` sem
  `--check`, o retrato de diálogos). Use a forma `--check`;
- **`python3` pelado** onde o portão importa dependência do projeto:
  `gerar-tabela-de-curvas.py --check` quebra com `ModuleNotFoundError: pydantic`
  no `python3` do sistema e passa em 0,10 s no `.venv`. Vermelho falso de
  instrumento, não de código.

---

## 6. O commit

**Commite à vontade dentro da SUA árvore, `git add -A` incluído. Nunca escreva
em `dev`** — e você fisicamente não consegue: o índice é seu, a branch é
`voo/<sprint>-<agente>`.

A regra é curta porque o isolamento fez o trabalho. Em 23/08 ela não existia, e
um `git add -A` engoliu sete arquivos do vizinho no mesmo commit.

- **português do Brasil com acentuação** — há portão;
- **`git add -A` antes de rodar portão**: portão é cego a arquivo novo;
- o gancho global dela corta linha de co-autoria. **Não readicione.**

Não commitar **não** é a alternativa segura: em 05/08 uma leva ficou horas no
índice e morreu com a sessão.

---

## 7. A entrega

**Relatório que só existe no transcrito morre.** Antes de fechar, escreva:

```
docs/process/agentes/AAAA-MM-DD/SPRINT-AGENTE.md
```

Quatro cabeçalhos, obrigatórios por régua, nesta ordem:

```markdown
## O que mudou
## Qual mordida prova
## O que NÃO verifiquei
## O que sobrou para o próximo
```

*"O que NÃO verifiquei"* é o cabeçalho mais valioso dos quatro: **"NÃO
VERIFICADO" é muito preferível a chute**, e chute com confiança já custou três
achados falsos numa sessão.

Depois, um comando só:

```bash
scripts/costurar.sh
```

Ele exige a entrega, roda a camada de aceite, chama o sanitizador sozinho — você
não precisa saber que ele existe — e funde a sua branch em `onda/atual`, sob
trava. **Conflito sai rc=1 e NÃO se resolve automaticamente:** nomeie os
arquivos em conflito na entrega e pare. Quem decide é quem coordena.

`dev` recebe `onda/atual` num merge só, visível, por decisão dela. **Agente
nenhum toca a árvore dela.**

---

## 8. Quando parar e perguntar

**Não é sua** nenhuma destas: texto novo de tela, vocabulário de produto, ordem
de seção, o que nasce visível, o que nasce ligado. A fonte única do que já foi
decidido é `docs/data/decisoes-dela.csv` — e o que está lá **não se repropõe**.

Quando precisar de uma decisão dela para seguir: **escreva o provisório, MARQUE
como provisório** (`PROVISÓRIO — decisão dela` no código e no documento) e
**relate**. Não escolha em silêncio: escolha em silêncio vira fato consumado que
alguém descobre na tela, e ela decide vendo.

---

## 9. As armadilhas, com a cicatriz de cada uma

- **medir árvore em movimento** — 23/08: um agente reportou 13 vermelhos que não
  eram dele; minutos depois estavam verdes, porque o vizinho estava no meio de
  uma reescrita. Aconteceu duas vezes no mesmo dia, uma delas com quem
  coordenava. **Sua árvore é sua; se algo se mexeu sem você, é o `PYTHONPATH`
  (§1).**
- **o dublê que só sabe passar** — a régua não viu o defeito porque o caminho de
  erro nunca era exercido (§4).
- **o conserto que reintroduz o defeito que cura** — "Aplicar e fechar" ficou
  idêntico a "Fechar sem aplicar" com o daemon desligado: a mesma família do
  defeito que ele existia para curar. Achado pelo conferente, não pelo executor.
- **afirmar sem rodar o comando** — rode e cole a saída, sempre. O que você
  lembra do comportamento é a versão anterior dele.
- **instrumento de terceiro sem validar** — um grafo de 24.684 nós não achou
  **nenhuma** das três funções que já se sabia sem chamador. Valide o
  instrumento contra respostas que você já conhece antes de acreditar no que ele
  diz que você não sabia.
- **dado de teste sequencial** — um MAC sequencial bateu por acaso com um
  literal de segredo e **bloqueou dois commits**. Faixas da casa: `02:fe:00`,
  `aa:bb:cc`, `e8:47:3a`, sem sequência simples. Nada de MAC real em arquivo
  versionado — há portão.
- **corrigir pela metade** — fato errado se substitui **em todos os lugares onde
  aparece**. Deixar as duas versões vivas é o defeito que a regra existe para
  matar. Decisão *medida*, ao contrário, não se apaga: ganha nota datada.

---

## Ver também

- [COMO-REGER-AGENTES.md](COMO-REGER-AGENTES.md) — o lado de quem despacha.
- [COMO-OLHAR-A-TELA.md](COMO-OLHAR-A-TELA.md) — a foto, os instrumentos, e as
  armadilhas de medição já pagas.
- [SPRINT_ORDER.md](SPRINT_ORDER.md) §0 — a fila em ondas e as dependências.
- [agentes/README.md](agentes/README.md) — o que o sanitizador recusa, e por quê.
