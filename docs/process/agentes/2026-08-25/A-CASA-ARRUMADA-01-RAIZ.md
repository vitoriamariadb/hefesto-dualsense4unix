# A CASA ARRUMADA 01 — RAIZ: o censo do que fica e do que sai

Pedido dela: *"na raiz, vamos organizar e limpar ela. Tanto localmente quanto
online. coisa tipo novo layout, flatpak (não sei se usamos ainda e afins)
**precisamos validar isso com seriedade**."*

"Com seriedade" foi lido como: **nenhuma linha desta página é impressão.** Cada
veredito tem o comando que o sustenta, e o que não foi medido está na seção
`O que NÃO verifiquei`, não escondido num advérbio.

A raiz tem **33 itens versionados** (20 arquivos + 13 diretórios) e **11 itens
ignorados no disco dela**. O `HEAD` inteiro pesa **60,4 MB em 2.231 arquivos**;
o disco dela, na mesma pasta, guarda **19 GB só de `packaging/cosmic-applet/target/`**.

```bash
git ls-tree -r -l HEAD | awk '{s+=$4}END{printf "%.1f MB em %d arquivos\n", s/1048576, NR}'
# 60,4 MB em 2231 arquivos
du -sh packaging/cosmic-applet/target        # 19G
```

---

## O que mudou

**Dois arquivos, e são os únicos que esta frente possui.** Tudo o mais é
proposta.

### 1. `.gitattributes` — quatro `.mo` e cinco `.gz` dependiam de heurística

O arquivo já explica, para o `.btsnoop`, por que a declaração explícita importa:
*"sem esta linha, uma configuração de git com conversão de fim de linha pode
reescrever bytes e a captura deixa de ser a captura."* O mesmo argumento vale
para dois tipos que estavam de fora.

```bash
# os binários versionados no HEAD, por extensão
git ls-files -z | xargs -0 -n1 -I{} sh -c 'f="{}"; if git diff --no-index --numstat /dev/null "$f" 2>/dev/null | head -1 | grep -q "^-"; then echo "$f"; fi' | sed 's/.*\.//' | sort | uniq -c | sort -rn
#     121 png      <- declarado
#       5 gz       <- NÃO declarado
#       4 mo       <- NÃO declarado
#       4 bin      <- declarado
#       2 btsnoop  <- declarado
```

Antes:

```
locale/pt_BR/LC_MESSAGES/hefesto-dualsense4unix.mo: text: auto
locale/pt_BR/LC_MESSAGES/hefesto-dualsense4unix.mo: binary: unspecified
```

Depois de `*.mo binary` e `*.gz binary`:

```
locale/pt_BR/LC_MESSAGES/hefesto-dualsense4unix.mo: text: unset
locale/pt_BR/LC_MESSAGES/hefesto-dualsense4unix.mo: binary: set
```

**Nenhum blob mudou** — `git status --porcelain` acusa só `M .gitattributes`.

### 2. `.gitignore` — dois artefatos que os DOCUMENTOS DESTA CASA mandam gerar

As duas linhas não são precaução genérica; são o resíduo de comandos que o
próprio repositório ensina o usuário a rodar.

| linha nova | quem cria | onde está escrito |
|---|---|---|
| `*.flatpak` | `scripts/build_flatpak.sh --bundle` grava `${REPO_ROOT}/${APP_ID}.flatpak` | `scripts/build_flatpak.sh:107` |
| `/result`, `/result-*` | `nix build .#default` deixa o symlink na raiz | `packaging/nix/README.md:36,39` — *"nix build .#default"* e depois *"./result/bin/hefesto-dualsense4unix"* |

```bash
git check-ignore -v result br.andrefarias.Hefesto.flatpak
# .gitignore:37:/result	result
# .gitignore:33:*.flatpak	br.andrefarias.Hefesto.flatpak

# e nenhum arquivo VERSIONADO passou a ser ignorado por engano:
git ls-files | git check-ignore --stdin -v     # (vazio)
```

O `/result` saiu **ancorado na raiz** de propósito: `result` solto pegaria
qualquer `tests/fixtures/result` futuro em silêncio.

```bash
git check-ignore -v tests/fixtures/result   # (vazio — correto)
```

O portão de acentuação aprova os dois:

```bash
.venv/bin/python scripts/validar-acentuacao.py --check-file .gitignore .gitattributes   # rc=0
```

---

## Qual mordida prova

### O censo, item a item

Legenda: **FONTE** (escrito à mão, é a verdade) · **ARTEFATO** (gerado por um
comando) · **DELA** (material dela, não se apaga) · **LIXO**.

| item | classe | quem consome HOJE | último toque | veredito |
|---|---|---|---|---|
| `.gitignore` | FONTE | o git | 26/08 (eu) | **FICA** |
| `.gitattributes` | FONTE | o git | 26/08 (eu) | **FICA** |
| `.pre-commit-config.yaml` | FONTE | `pre-commit install` (README:273, CONTRIBUTING:36) | 24/08 | **FICA** |
| `.code-review-graphignore` | FONTE órfã | **NINGUÉM** no repositório | 11/08 | **PROPOSTA** — ver abaixo |
| `README.md` | FONTE | a página pública | 25/08 | **FICA** |
| `CHANGELOG.md` (226 KB) | FONTE | 4 citações no CI, 11 na suíte | 25/08 | **FICA** |
| `DECISOES.md` | FONTE | 1 script, 1 teste | 22/08 | **FICA** |
| `GUIA-RADIO-DA-SALA.md` | FONTE | `install.sh`, 4 no `src/`, 2 na suíte, 10 docs | 21/08 | **FICA** — com um alerta em `O ONLINE` |
| `LICENSE` + `NOTICE` + `LICENSES/` | FONTE | 32 + 24 citações na suíte | 07/08 | **FICA** |
| `pyproject.toml` | FONTE | tudo | 19/08 | **FICA** |
| `requirements.txt` | ESPELHO de `pyproject.toml` | **ninguém lê** — `build_appimage.sh:86` gera o dele | **25/07** | **FICA_COM_RESSALVA** |
| `flake.nix` | FONTE | `packaging/nix/package.nix`, `docs/usage/instalacao.md`, `tests/unit/test_purge_argumentos_e_readme_nix.py` | 21/08 | **FICA** — nenhum job de CI o constrói |
| `install.sh` (226 KB) / `uninstall.sh` (95 KB) | FONTE | o produto | 25/08 / 23/08 | **FICA** |
| `run.sh` | FONTE | **7 citações no CI** | 18/08 | **FICA** |
| `bancada.py` (25 KB) | FONTE (ferramenta de medição) | 3 scripts, **14 citações em 3 testes que o leem por AST** | 25/08 | **FICA** |
| `specs.html` / `painel.html` / `frases-de-tela.html` | **ARTEFATO** | virou `html/` no `dev` hoje | 25/08 | **FICA** (fora do meu escopo) |
| `assets/` (1,02 MB, 147 arq) | FONTE | 218 na suíte, 62 no `src/`, 46 no `install.sh` | 25/08 | **FICA** |
| `captures/` (4 arq, 20 KB) | FONTE (fixture binária) | `src/.../uhid_blueprint.py`, `scripts/capture_blueprint.py`, 2 testes | **16/07** | **FICA** |
| `docs/` (35,43 MB, 741 arq) | FONTE | tudo | 25/08 | **FICA** — 59% do clone; ver `O ONLINE` |
| `examples/` (2 arq, 10 KB) | FONTE | **só `docs/adr/017-plugin-system.md`** — nenhum import, nenhum teste | **16/05** | **FICA_COM_RESSALVA** |
| `flatpak/` (3 arq) | FONTE | workflow próprio + release + `install.sh` | 25/08 | **FICA** — a medição da coordenação confere |
| `.github/` (14 arq) | FONTE | o CI | 25/08 | **FICA** |
| `locale/` (2 `.mo`) | **ARTEFATO** de `scripts/i18n_compile.sh` | `install.sh:3113`, `scripts/build_deb.sh:351` | 25/08 | **FICA_COM_RESSALVA** — sem portão `--check` |
| `po/` (3 arq, 204 KB) | FONTE | 3 no CI, 13 em scripts, 16 na suíte | 25/08 | **FICA** |
| `packaging/` (24 arq versionados, 416 KB) | FONTE | 91 em scripts, 120 na suíte | 25/08 | **FICA** — mas ver os 19 GB abaixo |
| `scripts/` (118 arq) | FONTE | tudo | 25/08 | **FICA** |
| `src/` (229 arq) | FONTE | é o produto | 25/08 | **FICA** |
| `tests/` (921 arq, 11,8 MB) | FONTE | o CI | 25/08 | **FICA** |

**Ignorados, no disco dela:**

| item | tamanho | classe | veredito |
|---|---|---|---|
| `packaging/cosmic-applet/target/` | **19 GB** | ARTEFATO (cargo), jul 13 | **PROPOSTA** |
| `.code-review-graph/` | **344 MB** | ARTEFATO de ferramenta externa | **PROPOSTA** |
| `.venv/` | 149 MB | ARTEFATO | **FICA** — é o interpretador da casa |
| `venv/` | **12 MB, jul 13** | ARTEFATO **abandonado** | **PROPOSTA** |
| `flatpak-repo/` | 22 MB | ARTEFATO (OSTree) | **PROPOSTA** |
| `.mypy_cache/` + `.pytest_cache/` + `.ruff_cache/` + `.coverage` | 20 MB | ARTEFATO | **FICA** — caches vivos |
| `novo-layout/` | 1,9 MB, 26 arq | **DELA** | **FICA — e não se propõe apagar** |
| `.claude/` | 16 KB | ARTEFATO | **FICA** |

### As três medições que valem por si

**1. `requirements.txt` é um espelho sem portão — e hoje está em dia.**
Ele mesmo declara: *"FONTE DE VERDADE: pyproject.toml"*. Confirmado item a item,
as 10 dependências batem. Mas **nada reprova a divergência**, e o único script
que fala em `requirements.txt` (`scripts/build_appimage.sh:86`) **escreve o seu
próprio** com um heredoc. Ou seja: se ele caducar amanhã, ninguém sabe.

**2. `locale/*.mo` é o único artefato gerado desta casa SEM portão `--check`.**
Todo artefato gerado daqui tem um: `gerar-mapa.py --check`, `gerar-painel.py
--check`, `gerar-frases-de-tela.py --check`, `gerar-contrato-ipc.py --check`,
`gerar_icones.sh --check`. Os catálogos, não.

```bash
grep -nE "i18n|msgfmt|\.mo\b|locale" .pre-commit-config.yaml     # (vazio)
grep -nE "i18n_compile|msgfmt" .github/workflows/ci.yml
# 910:        run: bash scripts/i18n_compile.sh     <- RECOMPILA, não CONFERE
```

E eles estão versionados **em duplicata, byte a byte idêntica**, porque
`i18n_compile.sh:30` escreve nos dois lugares:

```bash
git rev-parse HEAD:locale/pt_BR/LC_MESSAGES/hefesto-dualsense4unix.mo
git rev-parse HEAD:src/hefesto_dualsense4unix/locale/pt_BR/LC_MESSAGES/hefesto-dualsense4unix.mo
# 81121de7802305302cc9d5ea0674ae0946fca09a  (os dois)
```

Os dois têm consumidor real: a raiz é o que `install.sh:3113` copia para
`~/.local/share/locale` num clone puro, e o de `src/` é o *fallback* do wheel
(`src/.../utils/i18n.py:77`). **Não é lixo — é artefato duplicado sem régua.**

**3. `.code-review-graphignore` é a única órfã completa da raiz.**

```bash
git grep -rIln "code-review-graph"
# docs/process/COMO-REGER-AGENTES.md
# docs/process/sprints/2026-08-24-ONDA0-Z2-...
# docs/process/sprints/2026-08-25-A-CASA-ARRUMADA-01-...
# tests/unit/test_z2_o_numero_bate_com_a_contagem.py
```

Nenhum script, nenhum portão, nenhum job de CI o lê. É o `.ignore` de uma
ferramenta de indexação **externa ao repositório**, versionado e público. O
diretório que ele serve (`.code-review-graph/`, 344 MB) não aparece no
`.gitignore` da casa — ele se auto-ignora com um `*` no `.gitignore` dele:

```bash
git check-ignore -v .code-review-graph/
# .code-review-graph/.gitignore:3:*	.code-review-graph/
```

Funciona, mas por acidente: se a ferramenta um dia escrever a pasta sem esse
arquivo, **344 MB aparecem no `git status` dela**.

### A duplicação que a coordenação pediu para eu relatar

**`mapa-das-portas.html` existe em dois lugares e os dois DIVERGIRAM — o de
`novo-layout/`, que é o que ela abre, é o VELHO:**

```bash
md5sum novo-layout/mapa-das-portas.html \
       docs/process/sprints/2026-08-24-ABA-CONEXOES/mockup/mapa-das-portas.html
# 9ea6e1767052a30616f7b5922ef1d8f5  novo-layout/mapa-das-portas.html
# 3d4b4cfa772d703fb554f6cb44b33fb1  docs/process/sprints/.../mapa-das-portas.html
```

| cópia | tamanho | mtime |
|---|---|---|
| `novo-layout/mapa-das-portas.html` (dela, ignorada) | 87.995 B | **25/08 01:09** |
| `docs/process/sprints/2026-08-24-ABA-CONEXOES/mockup/` (versionada) | 91.812 B | **25/08 21:52** |

**Isto morde de verdade:** ela abre `novo-layout/`, vê o mockup de ontem de
madrugada, e a frente trabalhou na cópia versionada de ontem à noite.
**Nada aqui deve ser apagado** — a decisão de qual é a boa é dela.

A logo tem o mesmo padrão, mas benigno: `novo-layout/assets/hefesto-logo.svg`
(2.430 B, **24/07**) difere de `assets/hefesto-logo.svg` (2.612 B, 03/08), e o
comentário do `.gitignore:107` já declara qual vale — *"A logo final vive em
`assets/hefesto-logo.svg`"*. O de `novo-layout/` é rascunho antigo. Fica.

### `flatpak/` — a resposta ao "não sei se usamos ainda"

Confirmo a medição da coordenação, com número próprio:

```bash
git grep -cIF "flatpak"  -- .github | awk -F: '{s+=$NF}END{print s}'   # 59  (confere com a coordenação)
git grep -cIF "flatpak/" -- .github | awk -F: '{s+=$NF}END{print s}'   #  8  (só o literal do diretório)
ls .github/workflows/                # flatpak.yml existe, 4,5 KB
grep -c flatpak install.sh           # 11
```

`flatpak/` tem workflow próprio, entra no `release.yml` como bundle, o
`install.sh` o detecta, e a suíte tem 44 citações. **Usamos, sim.** O que NÃO
usamos é o `flatpak-repo/` de 22 MB no disco — é cache de build local.

---

## O que NÃO verifiquei

- **Não rodei a suíte inteira** nem `retratar_abas.py` — proibido para esta frente.
- **Não rodei `scripts/portoes.sh` completo.** Rodei só o portão de acentuação
  sobre os dois arquivos que mudei, e o `check_endereco_de_radio.py` (verde).
- **Não conferi se `nix build` de fato cria `result`** nesta máquina — não há nix
  instalado aqui. A regra saiu do que o `packaging/nix/README.md:36,39` **manda o
  usuário fazer**, não de uma execução.
- **Não rodei `scripts/build_flatpak.sh --bundle`** para ver o `.flatpak` nascer
  na raiz. A linha saiu da leitura de `build_flatpak.sh:107`.
- **Não medi o tamanho de um bundle `.flatpak`** — nenhum foi gerado aqui.
- **Não abri o conteúdo dos 26 arquivos de `novo-layout/`.** Comparei nomes,
  tamanhos, mtimes e md5 — não julguei o desenho.
- **Não conferi se o `.deb`/AppImage/wheel embarcam `docs/`.** Se embarcarem, os
  35 MB de `docs/` viram peso de pacote e a conta muda.
- **Não medi o `.git` como o GitHub o serve.** `du -sh .git` dá 173 MB nesta
  árvore, mas `git count-objects -vH` diz `size-pack: 36,73 MiB` — o resto é
  objeto solto e metadados dos 21 worktrees. **O clone público é o pack**, e
  36,7 MB é a ordem de grandeza honesta.
- **Não conferi o histórico atrás de segredo.** A memória da casa registra a
  senha dela em cinco commits já públicos em `origin/main`; não reabri isso, e
  **não é para reabrir sem ela**.

---

## O ONLINE — levantado, nunca executado

**Nada desta seção foi executado.** Reescrever histórico é irreversível.

### 1. `GUIA-RADIO-DA-SALA.md` publica a impressão digital do PC dela — na raiz

```bash
sed -n '7,13p' GUIA-RADIO-DA-SALA.md
# Máquina alvo: MeowSystem / Andromeda-OS
# Placa:        Gigabyte B450M S2H · Ryzen 7 5800X · RTX 4060 · EVGA 600 BR
# Sistema:      Pop!_OS 24.04 · kernel 7.0.11 · BlueZ 5.86
# Comprado em:  21/08/2026 — três adaptadores, não dois
```

Nome de máquina, placa-mãe, CPU, GPU, fonte e **data de compra**. Os endereços
de rádio ali **estão mascarados corretamente** (octetos 4 e 5 zerados) e o
portão por forma aprova:

```bash
.venv/bin/python scripts/check_endereco_de_radio.py
# OK: nenhum endereço de rádio real em arquivo versionado.    rc=0
```

Não é vazamento de segredo — é exposição de perfil pessoal, e a decisão é dela.
O guia é bom e tem 16 consumidores; a pergunta é só se o bloco de inventário
precisa do nome da máquina e da data de compra.

### 2. Duas identidades competindo no repositório público

```bash
git grep -lI "br.andrefarias" | wc -l    # 62 arquivos
git grep -lI "com.vitoriamaria" | wc -l  # 23 arquivos
```

O app id do Flatpak é `br.andrefarias.Hefesto` (`scripts/build_flatpak.sh:23`,
`flatpak/br.andrefarias.Hefesto.yml`), e o do applet COSMIC é
`com.vitoriamaria.HefestoDualsense4Unix`. **Território da frente IDENTIDADE —
levantado aqui só para não ficar sem dono.** Trocar app id de Flatpak publicado
quebra atualização de quem já instalou; não é mudança de um commit.

### 3. `docs/process/` é metade do que o mundo baixa

```
29,76 MB   612 arq   docs/process     <- 49% do HEAD inteiro (60,4 MB)
 2,63 MB    41 arq   docs/data
 2,31 MB    40 arq   docs/usage
```

Nesta casa **o processo é a entrega tanto quanto o código** — isto não é defeito,
é escolha. Registro o número porque ele responde "por que o clone é grande": não
é código, são 612 arquivos de sprint e as capturas de tela deles.

### 4. `specs.html` custou 34,7 MB de histórico por ser artefato versionado

```bash
git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectsize) %(rest)' \
  | awk '$1=="blob" && ($3=="specs.html" || $3=="html/specs.html"){n++; s+=$2} END{print n, s/1048576}'
# 33 revisões, 34,7 MB somados (bruto, antes do delta do pack)
```

Cada regeneração grava 1,3 MB novos. O pack comprime bem (36,7 MB no total), mas
**o crescimento é linear no número de regenerações**. Ele TEM portão
(`gerar-mapa.py --check`), então versioná-lo é decisão consciente, com preço
conhecido. Registro o preço, não proponho reverter.

### 5. `.code-review-graphignore` publica ferramenta de análise externa

O `.gitignore` desta casa tem um bloco explícito **"anti-IA (anonimato local)"**
com 15 linhas. Este arquivo está do lado de fora dele, versionado e público, e
**nenhum script do repositório o lê**. Não menciona fornecedor nem modelo — mas é
a única pegada de ferramenta auxiliar que sobreviveu ao bloco.

---

## O que sobrou para o próximo — as propostas, com o preço

Nenhuma foi executada. Ordenadas por quanto devolvem.

| # | o quê | ganha | perde | reversível? |
|---|---|---|---|---|
| 1 | `cargo clean` em `packaging/cosmic-applet/` | **19 GB** | próximo build do applet Rust é do zero (minutos) | **sim** |
| 2 | apagar `.code-review-graph/` | **344 MB** | o índice é refeito na próxima indexação | **sim** |
| 3 | apagar `venv/` (o antigo, jul 13; `.venv/` é o vivo) | **12 MB** | nada — as duas únicas citações a `^venv/` (`scripts/validar-acentuacao.py:434`, `scripts/validar-glifos.py:233`) são regras de EXCLUSÃO de varredura: sem o diretório, viram padrão morto, não erro | **sim**, `python -m venv` |
| 4 | `flatpak-repo/` (22 MB) | **22 MB** | próximo `build_flatpak.sh` refaz o OSTree | **sim** |
| 5 | portão `i18n_compile.sh --check` para os `.mo` | fecha o único artefato gerado sem régua | ~2 s por leva | **sim** |
| 6 | portão que confere `requirements.txt` contra `pyproject.toml` | mata a divergência silenciosa de um espelho que ninguém lê | idem | **sim** |
| 7 | decidir qual `mapa-das-portas.html` vale | ela para de abrir a cópia velha | nada | **sim** |
| 8 | `.code-review-graphignore`: sair do git, ou o `.code-review-graph/` entrar no `.gitignore` da casa | tira a órfã / protege os 344 MB do `git status` | as duas mexem no que o repositório publica | **sim** |

**Os itens 1 a 4 somam 19,4 GB e nenhum deles apaga fonte.** Mas **todos apagam
arquivo do disco dela**, e por isso **nenhum foi executado**. A palavra é dela.
