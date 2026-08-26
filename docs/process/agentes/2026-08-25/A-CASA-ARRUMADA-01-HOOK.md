# A-CASA-ARRUMADA-01 / HOOK — o gancho passa a CURAR

Pedido dela: *"todos precisam ser auto atualizados via hooks"*.

## O que mudou

**`scripts/hooks/pre-commit`** — os quatro instrumentos HTML saem em dia no
MESMO commit que mexeu no dado deles. Antes, só o painel era curado; o
`specs.html` e o `frases-de-tela.html` tinham `--check`, que ACUSAVA a
divergência e devolvia um vermelho em vez de uma página em dia.

**A régua de quando regerar não é uma lista de caminhos — é o próprio
`--check`.** Li os quatro geradores e levantei as fontes de cada um (elas estão
no fim deste documento). Uma lista dessas dentro do gancho apodreceria calada no
dia em que um gerador ganhasse fonte nova — que é o defeito do `--check` por
MTIME que a MAPA-CONTEUDO-01 já matou. O `--check` de cada gerador regera a
página em memória e compara CONTEÚDO, ignorando o carimbo: ele responde a mesma
pergunta e não pode apodrecer.

O medo declarado na tarefa era o relógio; **o custo real é o repositório.** Os
quatro geradores somados custam menos de 1 s. Mas cada geração troca a linha do
carimbo, e uma linha trocada num arquivo de 1,3 MB é um objeto novo de **351 KB**
no `.git` (medido: `zlib.compress` do `html/specs.html`). Regerar sempre custaria
70 MB a cada 200 commits. Com o `--check` como gatilho, o commit que não mexeu no
dado não escreve **byte nenhum**.

Duas exceções, as duas por medição:

- o **painel** é regerado sempre, sem conferir antes. Uma das fontes dele é o
  estado do `git` (`estado_do_git()`: HEAD, branch, assunto, sujos), que mudou em
  **100%** dos commits — conferir primeiro pagaria 0,35 s para descobrir o que já
  se sabe. É o que este gancho já fazia.
- o **índice** roda por último e sempre que alguma página foi reescrita. Ele
  mostra o carimbo das outras três; rodar antes publica um índice que descreve o
  estado anterior.

**O gancho DIZ o que incluiu.** Quando o `specs.html` ou o `frases-de-tela.html`
mudam de conteúdo, sai uma linha nomeando a página e o tamanho da mudança
(`+3/-3 linhas. Olhe antes de empurrar.`), medido pelo `git diff --cached
--numstat`, que é o que o commit vai carregar de verdade. O painel e o índice são
silenciosos de propósito: mudam em todo commit, e um aviso em 100% deles
ensinaria a ignorar os outros dois.

**O gancho não trava por falta de dado.** Gerador que reprova vira aviso com a
saída dele, e o commit segue. `git commit --no-verify` continua passando.

Três defeitos achados de carona, os três medidos nesta bancada:

1. **O caminho.** Os três HTML mudaram para `html/` hoje. O gancho lê a pasta de
   `carimbo_da_casa.PASTA` — o dono único — e cai na raiz quando o módulo não
   existe. **Testado nos DOIS layouts:** funciona no `dev` de hoje e no `dev`
   depois do merge da frente HTML.
2. **`git commit -- caminho` levava a página para TRÁS no commit seguinte.** Com
   pathspec o git monta um índice temporário, commita por ele e no fim RESTAURA o
   índice de verdade — por definição, commit com pathspec não mexe no índice.
   A página entrava certa no commit e o índice ficava com a versão anterior
   staged; o commit normal seguinte a publicaria de volta. Curado por uma última
   passada de `git add` nas quatro páginas, que custa abaixo da resolução de
   10 ms do `time`. (Tentei antes curar com `env -u GIT_INDEX_FILE git add`
   durante o gancho — **não funciona**, o git sobrescreve o índice no fim.)
3. **A página é incluída mesmo quando o gerador reprova.** O `gerar-mapa.py`
   escreve o `specs.html` e SÓ ENTÃO devolve 1 quando o CSV tem peça órfã. A
   página escrita está certa para o dado que existe — o errado é o dado. Deixá-la
   de fora deixaria a árvore permanentemente suja.

**`.pre-commit-config.yaml`** — entram `frases-de-tela-publicado` e
`indice-html-publicado`. Os dois declaravam `--check` no próprio cabeçalho e
nenhum workflow, hook ou teste os chamava: a família da PORTÃO-VIVO-01. Aqui eles
continuam `--check`, e a assimetria com o gancho local está escrita no arquivo: o
CI não pode ESCREVER na árvore — página regerada dentro do runner passaria verde
sem entrar em commit nenhum, e a divergência voltaria no push seguinte.

**`scripts/instalar-hooks.sh`** — sem mudança. Ele já liga tudo que estiver em
`scripts/hooks/`.

## Qual mordida prova

Bancada em `/tmp/.../scratchpad/bancada`, cópia da árvore da frente HTML (layout
`html/`) com repositório git próprio e o gancho ligado por
`scripts/instalar-hooks.sh`. A segunda bancada (`bancada2`) é cópia desta frente,
com o layout antigo.

| # | o que se fez | o que aconteceu |
|---|---|---|
| A | commit que mexe só no `README.md` | 0,86 s. Entram só `painel.html` e `index.html`. **`specs.html` e `frases-de-tela.html` ficam de fora** |
| B | muda o `rotulo` no `mapa-controles.csv` | 1,30 s. `html/specs.html` **entra no MESMO commit, em dia**, e o gancho diz `+3/-3 linhas` |
| **C** | **a cura arrancada:** mesma mudança, `--no-verify` | o commit sai com **`specs.html` VELHO**, e o `--check` acusa `DESATUALIZADO` |
| D | muda um campo do JSON que a página NÃO renderiza | nada é regerado — e está certo: o conteúdo não mudou. Uma régua por caminho teria regerado à toa |
| D2 | muda um campo que a página RENDERIZA | `frases-de-tela.html` entra em dia, com aviso. `specs.html` fica de fora |
| E | o JSON do gerador SOME do disco | o commit **PASSA**, com o erro do gerador citado |
| F | `html/specs.html` apagado do disco | volta, em dia, no commit |
| G | tudo isso no layout ANTIGO (HTML na raiz, sem `carimbo_da_casa.py`) | funciona igual; `index.html` é pulado porque o gerador não existe lá |
| H | `git commit -- caminho`, e um commit normal depois | a página **não volta para trás**, e a árvore fecha limpa |

Portões da casa nos meus arquivos: acentuação, glifos e anonimato verdes;
`shellcheck -S warning` e `bash -n` limpos. Os 32 testes que leem o
`.pre-commit-config.yaml`, o `portoes.sh` e o `ci.yml` passam
(`test_portao_do_mapa_esta_ligado`, `test_portao_todo_portao_tem_chamador`,
`test_portoes_da_casa_estao_ligados_no_ci`,
`test_portao_a_lista_de_portoes_e_uma_so`).

## O que NÃO verifiquei

- **A suíte inteira e o `retratar_abas.py`** — proibidos nesta frente.
- **`pre-commit run --all-files`** — a ferramenta `pre-commit` não está instalada
  nesta máquina (o próprio `.pre-commit-config.yaml` registra isso desde a
  PORTÃO-VIVO-01). Validei o YAML e os quatro `--check` à mão; o job do CI é que
  vai exercer o arquivo.
- **O gancho GLOBAL dela encadeando este** — testei o gancho direto em
  `.git/hooks/pre-commit`, não a cadeia a partir de `~/.config/git/hooks`.
- **Merge e rebase.** `git merge` roda `pre-commit` só quando há conflito
  resolvido à mão; `git rebase` não o roda. Não exercitei nenhum dos dois.
- **A frente HTML não estava commitada** quando medi. Peguei a árvore de trabalho
  dela às 23h20; se ela mudar um `SAIDA` ou o nome de `PASTA`, meus números de
  caminho mudam junto (o gancho não, porque lê do dono).
- **Escrevi um objeto solto no `.git` dela** ao medir o tamanho do blob
  (`git hash-object -w html/specs.html`). É um blob órfão de 351 KB, idêntico ao
  que a frente HTML vai commitar de qualquer jeito, e o `git gc` o recolhe. Nada
  foi apagado nem alterado.

## O que sobrou para o próximo

### 1. O carimbo e o índice discordam por construção — e é a colisão desta leva

A frente HTML fez o `index.html` comparar o **commit do carimbo** das três
páginas e pintar um bloco laranja *"Os instrumentos discordam"* quando eles
divergem. Com um gancho que só regera o que mudou, **eles divergem em quase todo
commit** — o painel anda todo dia, o `specs.html` não. Medido na bancada: o bloco
laranja apareceu já no primeiro commit trivial.

> `As páginas abaixo não nasceram do mesmo commit (0e09b5b, 872818f).`

Isso não é defeito do gancho nem da página: as duas coisas são incompatíveis por
estrutura. O carimbo só fica em sincronia se as quatro páginas forem regeradas
juntas em todo commit — que é a conta de 70 MB por 200 commits.

**A proposta, e ela é do `gerar-indice-html.py` (não é meu arquivo):** o
`_concordancia()` deveria perguntar *"cada página está em dia com a fonte dela?"*
— o `--check` de cada gerador, 0,42 s somados — em vez de *"nasceram do mesmo
commit?"*. Duas páginas geradas de commits diferentes estão as duas certas se
cada uma bate com o que a alimenta; o que importa é a **validade**, não a
simultaneidade. Enquanto isso não for decidido, o bloco laranja vai aparecer
sempre — e portão que reprova sempre é desligado na semana seguinte.

### 2. O `head` que o painel publica está SEMPRE errado por um

`estado_do_git()` grava `rev-parse --short HEAD`. No pré-commit, HEAD ainda é o
commit ANTERIOR — então o `painel.html` que entra no commit N sempre diz N-1.
Não é novo, e não é meu arquivo. É também a razão de o painel gastar ~20 KB de
objeto novo em 100% dos commits. Se o `head` sair do corpo da página (o carimbo
já traz commit e branch), o painel passa a mudar só quando o projeto muda: pelo
meu censo, **26 dos últimos 200 commits** mexeram nas fontes próprias dele.

### 3. Os dois `--check` novos no `.pre-commit-config.yaml` têm dependência

`indice-html-publicado` chama `scripts/gerar-indice-html.py`, que **nasce na
frente HTML**. Se ela não entrar no merge, essa entrada tem de sair junto, ou o
`pre-commit run --all-files` do CI fica vermelho por arquivo ausente — o defeito
de 25/08 (portão vermelho no `dev` por horas) repetido. Está escrito no próprio
YAML, ao lado da entrada.

### 4. `scripts/portoes.sh` não é meu, e os dois portões novos deveriam estar lá

O `test_portao_a_lista_de_portoes_e_uma_so.py` compara `portoes.sh` com o
`ci.yml`, não com o `.pre-commit-config.yaml` — então nada reprova hoje. Mas a
casa tem UM dono para a lista de portões, e `gerar-frases-de-tela.py --check` e
`gerar-indice-html.py --check` são portões. Quem coordena decide se entram.

### 5. Ninguém chama o `scripts/instalar-hooks.sh`

Ele é o que liga tudo isto, e é manual — quem clonar e não rodar não tem gancho
nenhum, e a casa passa a acreditar que está coberta. O `install.sh` não é meu
arquivo. Vale medir se ele deve chamá-lo.

## As fontes de cada gerador, para quem for mexer

Levantadas lendo os quatro geradores. **Não estão dentro do gancho** de
propósito (ver a régua acima) — estão aqui para quem precisar da lista.

| gerador | o que o alimenta | commits nos últimos 200 |
|---|---|---|
| `gerar-mapa.py` → `specs.html` | `docs/data/mapa-controles.csv`, `docs/data/ensaios.csv`, os três `assets/control-svg/*.svg`, `scripts/{eliminacao,paleta_da_casa,carimbo_da_casa,check_paridade_transporte,validar-fala-de-tela}.py` **e `src/hefesto_dualsense4unix/app/`** (a fila de placeholders sai das falas de tela) | 39 (3 sem o `app/`) |
| `gerar-painel.py` → `painel.html` | `docs/process/sprints/`, `docs/process/SPRINT_ORDER.md`, `docs/data/decisoes-dela.csv`, o CSV do mapa, o cache dos caros, **e o estado do `git`** | 26 pelas fontes próprias, **200 pelo git** |
| `gerar-frases-de-tela.py` → `frases-de-tela.html` | `docs/process/dados/frases-de-tela-25-08.json` | 1 |
| `gerar-indice-html.py` → `index.html` | o carimbo dos três acima, lido do disco | segue os três |

A dependência do `specs.html` em `src/.../app/` é a que mais surpreende, e é
real: `_bloco_fila_no_specs()` importa o `validar-fala-de-tela.py` e varre
`APP_RELATIVO`. É também o melhor argumento contra a régua por caminho — 36 dos
39 disparos viriam daí, e só uma fração deles muda a página de verdade. O
`--check` sabe a diferença; uma lista de caminhos, não.
