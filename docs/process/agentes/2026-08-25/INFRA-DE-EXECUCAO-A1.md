# INFRA-DE-EXECUCAO-01 · A1 — os comandos do protocolo passam a existir no disco

**25/08/2026, madrugada.** As dezesseis fichas de execução apontaram a mesma
causa de parada: os comandos do protocolo não existiam. Cinco agentes rodaram
com essa regra suspensa à mão por quem coordena. Esta entrega é o que torna a
suspensão desnecessária.

Branch: `voo/INFRA-DE-EXECUCAO-A1`. Quatro commits, nenhum merge.

---

## O que mudou

### `scripts/portoes.sh` — a lista de portões vira UMA (I14)

A lista vivia em dois lugares — o bloco do `CLAUDE.md` e os jobs do `ci.yml` — e
já tinham divergido. Agora mora em `scripts/portoes.sh`, **versionada**: o
`CLAUDE.md` não podia ser a fonte porque é ignorado pelo git (`.gitignore`:90) e
um worktree de agente nasce sem ele.

Vinte e dois portões, duas camadas, tempos medidos nesta árvore:

| camada | quantos | tempo |
|---|---|---|
| `--rapido` | 17 | **5,3 s** |
| padrão (rápido + completo) | 22 | **1 min 11 s** |

Os dois caros são `validar-acentuacao.py --all` (40 s) e `shellcheck` sobre o
`install.sh` de 219 KB (11 s) — juntos, oito vezes a camada rápida inteira.

Três decisões dentro dele, cada uma por um defeito já pago desta casa:

- **o interpretador se declara** na primeira linha da saída, e um `PYTHONPATH`
  vazio é anunciado como armadilha (é o agente prestes a medir a árvore do
  vizinho);
- **um python só para todo portão de python.** A mistura `python3` pelado /
  `.venv/bin/python` do `CLAUDE.md` é fato errado, não decisão: ela produz
  `ModuleNotFoundError: pydantic` em `gerar-tabela-de-curvas.py --check`;
- **portão declarado e ausente da árvore sai rc=1 nomeando**, nunca em silêncio.

### `scripts/bancada.sh` — o semáforo do aparelho (I4)

`reservar` / `status` / `exigir` / `liberar`, com estado em
`${XDG_RUNTIME_DIR}/hefesto-bancada.json` — fora do git de propósito: estado
transitório versionado vira commit de carona.

**Duas provas de vida independentes**, e é isso que a peça é: o PID do detentor
está vivo (responde o kernel) **e** ainda não passou de `expira_em` (responde o
relógio). Basta uma dizer não para a bancada ficar livre. Ninguém precisa
liberar nada.

### `scripts/despachar-agente.sh` — três costuras (I3, I16, e o gancho da I4)

- **o caminho morto nomeia**: sprint inexistente sai rc=1 dizendo **onde
  procurou** e que **nenhum worktree foi criado** — a recusa está *antes* do
  `git worktree add`;
- **`--limpar` aprendeu a podar o que já entrou em `onda/atual`** (quem responde
  é `for-each-ref --merged`) e a **poupar o que tem coisa não commitada dentro**,
  dizendo por quê;
- **a posse é exigida no despacho** (I16): sprint sem frontmatter sai rc=1 sem
  criar árvore;
- **o estado da bancada passou a vir do `bancada.sh`**, não de o despachante ler
  o arquivo por conta própria. Ler o arquivo direto era **errado**: um arquivo de
  reserva cujo dono morreu continua existindo, e o preâmbulo dizia "OCUPADA"
  para uma bancada livre;
- **o preâmbulo ganhou o bloco de fechamento** com `scripts/portoes.sh`.

### `scripts/check_colisao_de_sprints.py` — a posse num formato só (I15)

Um bloco no topo de cada sprint com `posse:` / `cria:` / `bancada:` /
`depois_de:` / `nao_toca:`, e um validador que cruza as sprints anotadas duas a
duas. **Nasce reprovando zero, de propósito**: sprint sem frontmatter entra numa
lista de **dívida**. A primeira sprint anotada é a
`2026-08-24-INFRA-DE-EXECUCAO-01`, que serve de espécime do formato.

Analisador próprio, sem PyYAML: o formato é pequeno e fechado, e um analisador
**estrito que recusa o que não entende, dizendo a linha** é mais seguro aqui que
um permissivo. Sem dependência, ele roda no `python3` pelado — o que faz o job de
CI ser uma linha, quando alguém o acrescentar.

### `scripts/costurar.sh` — o merge sob trava (I7, I8, I9, I10)

Roda no worktree do agente: exige a entrega e seus quatro cabeçalhos, chama o
sanitizador ele mesmo, roda os portões, e funde em `onda/atual` sob `flock` numa
árvore de integração — reusando a que já tiver o alvo em check-out, porque o git
recusa a mesma branch em duas árvores e é essa recusa que protege a árvore de
quem coordena.

**Conflito sai rc=1 nomeando os arquivos, e vai escrito na entrega.** Nada de
`-X ours`.

### Os documentos passam a dizer o que existe

- `COMO-EXECUTAR-UMA-SPRINT.md` — o bloco de portões é um comando só, com o
  aviso do `PYTHONPATH` vazio; e a bancada ganhou o parágrafo das duas provas de
  vida;
- `COMO-REGER-AGENTES.md` — **nota datada na R2** (a metade "árvore em
  movimento" caducou com o worktree; a suíte INTEIRA continua sendo de quem
  coordena, porque os nós `uinput` são do sistema e o worktree não os divide) e
  os comandos do semáforo na R3. **Nada foi removido**, por instrução de quem
  coordena: outras frentes estão lendo este arquivo agora;
- `COMO-COORDENAR-UMA-LEVA.md` — a tabela de o-que-já-chegou substituiu o
  parágrafo de o-que-falta.

---

## Qual mordida prova

Sete mordidas, cada uma arrancada da árvore, vista reprovar, e devolvida.

### I14 — a lista de portões

Arrancada a linha `caducos` da tabela:

```
E   AssertionError: A lista de portões divergiu em 1 ficha(s):
E       - scripts/validar-caducos.py: RODA NO CI e NÃO está no bloco local de
E         portoes.sh. (...) Foi assim que o validar-caducos.py atravessou uma leva inteira.
E   1 failed, 8 passed
```

Devolvida: `9 passed in 0.19s`.

**E ele achou um de verdade na primeira execução**, três horas depois de escrito:
`scripts/check_endereco_de_radio.py` roda no CI desde `1835f3b` e não estava no
bloco local. Está agora.

### I5 — as duas provas de vida da bancada, e a **independência** delas

| o que arranquei | o que reprovou |
|---|---|
| a checagem de PID | `test_detentor_morto_a_bancada_volta_a_ficar_livre` — **e só ela** (1 failed, 6 passed) |
| a checagem de `expira_em` | `test_o_teto_vence_mesmo_com_o_detentor_vivo` — **e só ela** (1 failed, 6 passed) |

```
E   AssertionError: o detentor morreu e a bancada continua travada — é o trinco
E   que o desenho manda NÃO construir:
E     OCUPADA por vitoriamaria (PID 219398) desde 25/08 03:00 até 25/08 07:00 — medição de BT
```

Devolvidas: `7 passed in 0.30s`. **Cada arranque reprovou um caso só** — que é o
que prova que as provas são independentes, e não uma só com duas caras.

### I3 — o caminho morto

Arrancado o bloco `if [ -z "$ARQ_SPRINT" ]`:

```
E   AssertionError: despachou sprint que não existe:
E     ===========================================================
E     PREÂMBULO DO AGENTE — cole isto no início do prompt dele
3 failed, 2 passed
```

Devolvido: `5 passed`. Uma das três é a régua da régua: com a checagem
arrancada, o worktree órfão **aparece** — e é isso que ela mede.

### I2 — a armadilha do editable install

Arrancada a linha de `PYTHONPATH` do `.envrc-voo`:

```
E   AssertionError: o agente importou
E   /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix/src/hefesto_dualsense4unix/__init__.py,
E   que NÃO é a árvore dele (/tmp/.../arvore-duble). É a armadilha do install
E   editable: o .pth do venv guarda um caminho ABSOLUTO para a árvore principal.
2 failed, 2 passed
```

Devolvida: `4 passed in 0.92s`. **A reprovação nomeia a árvore do vizinho**, e a
ordem das asserções é o produto: conferir a variável antes diria "faltou
PYTHONPATH" — verdadeiro e inútil.

### I15 — o campo caro

Arrancado o `cria:` do cálculo de reivindicação: `test_sem_o_campo_cria_a
_duplicata_some` e `test_acusa_a_duplicata_de_arquivo_que_ainda_nao_existe`
reprovam (2 failed, 11 passed). Devolvido: `13 passed`.

### I16 — a posse no despacho

Arrancado o bloco que exige o frontmatter: `2 failed, 5 passed`, com
`AssertionError: despachou agente para sprint sem posse`. Devolvido: `7 passed`.

### I7 / I8 — a costura

| o que fiz | o que reprovou |
|---|---|
| arranquei o `flock` | `test_duas_costuras_concorrentes_e_as_duas_sobrevivem` — **3 vezes de 3**, com `ERRO: conflito ao costurar voo/PARALELO-A1` (as duas costuras entraram na mesma árvore ao mesmo tempo) |
| pus `-X ours` no merge | `AssertionError: a segunda costura resolveu o conflito SOZINHA — barulho é o produto desejado, e sobrescrita silenciosa era o defeito` |

Devolvidas: `10 passed in 0.92s`.

### Os portões, no fim

```
TODOS VERDES — 22 portões.
```

E os seis arquivos de teste juntos: **48 passed** (58 com os dois últimos casos
da costura).

---

## O que NÃO verifiquei

1. **Não rodei a suíte inteira.** É de quem coordena, e há sete árvores em voo.
   Rodei só o meu escopo, seis arquivos.

2. **Não fiz a prova de tela.** Nada aqui toca a tela do produto — as duas
   "telas" desta sprint são de texto (o preâmbulo do despachante e a seção "em
   voo" do painel, que não é minha). **Marcado como aguarda o olho dela** por
   suspensão de quem coordena.

3. **Não medi `costurar.sh` contra a árvore de verdade.** Todas as dez réguas
   rodam em repositório dublê em `tmp`. Uma costura real mexeria em `onda/atual`
   do repositório compartilhado, com sete agentes em voo — que é a falha que esta
   leva existe para matar. **A primeira costura de verdade é de quem coordena, e
   eu recomendo rodá-la com `--seco` antes.**

4. **Não medi o `flock` sob contenção real de N agentes.** Duas costuras
   concorrentes, sim; vinte, não.

5. **Não medi o custo de N worktrees simultâneos.** Sete existem agora; o número
   de 59 MB e 0,18 s foi medido com um.

6. **`validar-caducos.py --all` deu rc=1 uma vez, às ~03h05, e verde em seis
   execuções depois.** A causa é conhecida: **minha árvore foi avançada de
   `f475b2a` para `1835f3b` por baixo de mim, no meio da sessão** (`reflog`:
   `merge dev: Fast-forward`), e `1835f3b` é justamente o commit que consertou
   aquele vermelho. **Não é defeito do portão** — mas registro que **medi
   árvore em movimento**, exatamente o defeito que esta sprint cura, dentro da
   execução dela.

7. **Não conferi o `pre-commit`.** A decisão do I14 — o framework entra no
   `install.sh` sem flag, ou o `.yaml` some — **não é minha e não a tomei**. Ela
   está **declarada** como `FORA-DO-LOCAL` no `portoes.sh`, com o motivo escrito,
   em vez de calada.

8. **Não conferi se o gancho `scripts/hooks/pre-commit` cabe no teto de 15 s**
   (I11/I12/I13). Não toquei no gancho.

---

## O que sobrou para o próximo

### Para quem coordena, e é a linha mais importante daqui

**O `check_colisao_de_sprints.py` está declarado `FORA-DO-CI` no `portoes.sh`,
com o motivo, porque `.github/workflows/ci.yml` não é posse desta frente.** É
dívida declarada, não divergência calada — mas é dívida. O job é uma linha
(`- run: python3 scripts/check_colisao_de_sprints.py`), e assim que ela entrar,
o bloco `FORA-DO-CI` sai e o teste da lista volta a exigir os dois lados.

### O que ficou aberto, com dono

| o que | de quem |
|---|---|
| **I6** — `bancada.sh exigir` nos pontos de chamada que param o daemon, abrem hidraw ou chamam `systemctl` | precisa do levantamento, e vários desses caminhos são de outras frentes. **Não fiz** para não editar arquivo alheio |
| **I11/I12/I13** — o gancho de camada 1 e o teto de 15 s | `scripts/hooks/pre-commit`, que não é minha posse |
| **I17/I18** — o carimbo de HEAD no painel e a seção "em voo" | `scripts/gerar-painel.py`, que não é minha posse |
| **I19** — encolher o `COMO-REGER-AGENTES` | **deliberadamente não feito**, por instrução: outras frentes estão lendo o arquivo agora. Só ganhou nota datada |
| **I20** — os vermelhos do HEAD | de quem coordena. Estão **verdes** em `1835f3b` |
| o frontmatter das outras 22 sprints | pago **uma a uma, no despacho** — é o desenho, não um esquecimento. `check_colisao_de_sprints.py --divida` lista a dívida |

### Um fato que caducou, e é do §2 da própria sprint

**M11 diz que os quatro módulos de PAREAMENTO × Z6 "não existem no disco".**
Hoje, 25/08, **os quatro existem** — a Z6 fechou e os criou:

```
scripts/gerar-fatos-de-tela.py                     EXISTE
src/hefesto_dualsense4unix/app/fatos_do_mapa.py    EXISTE
src/hefesto_dualsense4unix/app/fala_do_mapa.py     EXISTE
scripts/validar-fala-de-tela.py                    EXISTE
```

**Não editei o corpo da sprint** — é medição datada de 24/08, e estava certa
naquele dia. Mas o dublê do portão da colisão **não podia** usar os caminhos
reais, ou a prova de "nenhum grep os acharia" deixaria de provar. Ele usa
caminhos fictícios, com uma guarda que reprova se algum dia passarem a existir, e
a nota datada está no código. **A duplicata em si continua sendo decisão dela**
(§8.0/1).

### Três defeitos que a escrita dos portões revelou, e que já saem consertados

1. o sanitizador **quebrando** era relatado pela costura como **"recusa"** — o
   que mandou o autor destas linhas procurar um segredo que não existia. Agora
   traceback e recusa se dizem diferentes (as duas param a costura: na dúvida não
   passa);
2. o commit da entrega **falhava calado** quando um gancho da máquina recusava, e
   a costura acusava o agente de não ter commitado **duas telas adiante** — um
   diagnóstico que aponta a pessoa errada;
3. o `__pycache__` do sanitizador **sujava a árvore do agente** na véspera da
   checagem de "está tudo commitado?". Ferramenta não suja a árvore de quem a
   chamou.

### Uma nota de forma, e ela é deliberada

A sprint nomeia os portões `tests/unit/portao_*.py`. **Entreguei-os como
`tests/unit/test_portao_*.py`**, e o motivo é o defeito-mãe desta casa: o
`pyproject.toml` não define `python_files`, então `portao_*.py` **não é coletado
pelo pytest** e só rodaria com um job de CI dedicado — e `ci.yml` não é minha
posse. Um portão que nasce sem quem o chame é a cura escrita e nunca ligada. Com
o prefixo `test_`, os seis rodam na suíte a partir de hoje. **O nome é o único
desvio; o conteúdo é o que a sprint pediu.**
