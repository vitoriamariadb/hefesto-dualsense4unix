---
sprint: A-CASA-ARRUMADA-01
estado: feita
posse:
  HTML:
    - html/
    - scripts/gerar-frases-de-tela.py
    - scripts/gerar-painel.py
    - scripts/gerar-mapa.py
    - scripts/paleta_da_casa.py
  HOOK:
    - scripts/hooks/
    - .pre-commit-config.yaml
    - scripts/instalar-hooks.sh
  RAIZ:
    - .gitignore
    - .gitattributes
cria:
  - html/
bancada: false
nao_toca:
  - install.sh
  - uninstall.sh
  - src/hefesto_dualsense4unix/
  - tests/conftest.py
  - flatpak/
  - packaging/
depois_de:
  - IDENTIDADE-01
---

> **ESTADO 06/09/2026: feita** — o cabeçalho ou os arquivos que ela cria dizem (conferido em 06/09).

# A CASA ARRUMADA · 01 — um HTML só, e a raiz limpa

**25/08/2026.** Pedido dela, literal:

> *"temos vários html no projeto. Eu preciso de um único e de uma pasta chamada
> html. Todos precisam ser auto atualizados via hooks. todos precisam estarem
> linkados e falarem a mesma coisa sempre. (…) E na raiz, vamos organizar e
> limpar ela. Tanto localmente quanto online. coisa tipo novo layout, flatpak
> (não sei se usamos ainda e afins) precisamos validar isso com seriedade."*

## 1. O que está medido, antes de qualquer proposta

**Os HTML da árvore, todos:**

| arquivo | versionado? | quem o gera | tamanho |
|---|---|---|---|
| `specs.html` | sim | `scripts/gerar-mapa.py` | 1,3 MB |
| `painel.html` | sim | `scripts/gerar-painel.py` | 84 KB |
| `frases-de-tela.html` | sim | `scripts/gerar-frases-de-tela.py` | 77 KB |
| `novo-layout/*.html` (4) | **não** (`.gitignore:108`) | ninguém — são mockups dela | — |
| `docs/process/sprints/*/mockup/*.html` (3) | sim | ninguém — mockups versionados | — |
| `.code-review-graph/*.html` (2) | **não** | ferramenta de terceiro | — |

**Os três primeiros são irmãos por construção:** dividem
`scripts/paleta_da_casa.py` e a mesma regra — *autocontido, zero rede, zero CDN,
zero fonte web, abre com duplo clique*.

**O `flatpak/` ESTÁ VIVO, e isto responde a pergunta dela com medição:**

```
.github/workflows/flatpak.yml      workflow próprio de CI
.github/workflows/release.yml      entra no release
scripts/build_flatpak.sh           o build
install.sh                         detecta e usa
59 menções a "flatpak" nos workflows
```

**`flatpak-repo/` é outra coisa:** 22 MB de repositório OSTree local, já
ignorado pelo git. É artefato de build, não fonte.

## 2. O defeito, em uma frase

**Três páginas que se dizem irmãs vivem soltas na raiz, sem uma que leve às
outras, e nada garante que estejam em dia ao mesmo tempo.**

O `painel.html` já é atualizado por gancho de pré-commit; os outros dois, não —
o `specs.html` e o `frases-de-tela.html` têm `--check`, que **acusa** a
divergência mas não a **cura**. Quem commitar sem rodar o gerador leva um
vermelho, não uma página em dia.

## 3. O que esta sprint entrega

### HTML-1 — a pasta `html/` e o índice único

Os três mudam para `html/`, e nasce `html/index.html`: **a única página que ela
precisa abrir**, com um cartão por instrumento dizendo o que cada um responde,
quando foi gerado, e o link.

O índice é gerado, nunca escrito à mão — senão ele mesmo vira a quarta página
que envelhece em silêncio.

**A regra dos irmãos vale para ele:** autocontido, zero rede, paleta da casa.

### HTML-2 — todos falam a mesma coisa

Cada um passa a trazer, no rodapé, **o mesmo carimbo**: o commit e a data de
geração. Se dois discordarem, a diferença aparece no próprio rodapé em vez de
ser descoberta por acidente.

### HOOK-1 — o gancho atualiza os três, não um

O `pre-commit` passa a rodar os três geradores quando o que os alimenta muda.
**A régua de "o que os alimenta"** é o que decide se isto ajuda ou irrita: gerar
1,3 MB de `specs.html` a cada commit de teste é o caminho mais curto para
alguém desligar o gancho.

### RAIZ-1 — o que sai da raiz, com a razão de cada um

Uma tabela: o que é fonte, o que é artefato, o que é lixo. **Nada é apagado sem
a razão escrita**, e o que for do disco dela (não versionado) é **proposta**,
nunca ação.

### RAIZ-2 — o online

O que o `git` publica e não devia. **Isto exige a palavra dela antes de
qualquer push** — apagar do histórico é irreversível e ela já foi mordida por
segredo em commit público.

## 4. O que esta sprint NÃO faz

- **Não apaga `novo-layout/`.** São os mockups dela, e um deles já sumiu do
  disco na frente dela uma vez.
- **Não mexe no `flatpak/`.** Está vivo, medido acima.
- **Não reescreve o conteúdo de nenhuma das três páginas** — só onde elas moram,
  como se ligam, e quem as mantém em dia.
