# A CASA ARRUMADA · 01 — frente HTML (HTML-1 e HTML-2)

Árvore: `/mnt/Apate/Desenvolvimento/hefesto-voo/A-CASA-ARRUMADA-01-HTML`,
branch `voo/A-CASA-ARRUMADA-01-HTML`. Nada commitado; tudo no índice.

## O que mudou

**Os três instrumentos mudaram para `html/`, com `git mv`** — o `git status`
mostra `R` nos três, então o histórico de cada um viajou junto (é ele que prova
quando cada número mudou, e ela usa isso):

```
R  specs.html          -> html/specs.html
R  painel.html         -> html/painel.html
R  frases-de-tela.html -> html/frases-de-tela.html
```

**Nasceu `html/index.html`, e ele é GERADO** por
`scripts/gerar-indice-html.py` (novo). Um cartão por instrumento com: o que
cada um responde, quando usá-lo, **quando foi gerado e de qual commit**, o
gerador que o escreve e a fonte de onde ele sai. Ele **lê o disco**: página
ausente vira cartão vermelho, sem link, dizendo qual gerador a devolve — um
índice que aponta para arquivo que não existe entrega o erro do navegador em
vez do instrumento.

O índice tem `--check`, como os outros três. Ele lê o carimbo dos irmãos, então
**roda depois deles**.

**Nasceu `scripts/carimbo_da_casa.py`** — irmão do `paleta_da_casa.py` e pelo
mesmo motivo: o que os quatro dividem precisa ter um dono. A paleta dá a eles a
mesma cara; o carimbo dá a mesma **procedência**. Cada página passa a trazer, na
mesma linha e no mesmo formato:

```html
<p class="carimbo" data-carimbo="1">gerado em 25/08/2026 às 23:23 · commit
<code>872818f</code> na branch <code>voo/…</code> · árvore com N mudança(s) não
commitada(s) · por <code>scripts/gerar-mapa.py</code> ·
<a href="index.html">índice dos instrumentos</a></p>
```

A sujeira da árvore está lá de propósito: **o commit sozinho mente numa árvore
suja** — a página pode ter nascido de um dado que ainda não está em commit
nenhum.

**O índice diz quando os quatro discordam.** Se dois carimbos trouxerem commits
diferentes, ele troca a linha verde ("Os três falam a mesma coisa: gerados do
commit X") por um bloco laranja nomeando os commits e a linha de comando que
regera os quatro. É a metade útil do HTML-2: a divergência aparece no próprio
rodapé em vez de ser descoberta por acidente.

**Os quatro `--check` ficaram cegos ao carimbo, e isso é obrigatório.** O
carimbo traz o commit; um comparador que o enxergasse ficaria vermelho no
segundo commit de qualquer leva, e portão que reprova sempre é desligado na
semana seguinte. `carimbo_da_casa.sem_carimbo()` é a régua única, usada pelos
quatro. Medido: com o carimbo adulterado à mão (commit `0000000`, data de 1999),
os quatro `--check` continuam verdes.

**Zero rede nos quatro**, conferido com o comando da sprint:

```
html/index.html          0
html/painel.html         0
html/frases-de-tela.html 0
html/specs.html          3  ← os três são `xmlns="http://www.w3.org/2000/svg"`
```

Os três do `specs.html` são o namespace dos SVG embutidos — declaração de
XML, não busca de rede. Pré-existente, não introduzido aqui.

### Um defeito achado de carona, no `gerar-painel.py`

`_recorta_selo()` filtra POR LINHA, e o parágrafo `Árvore: …` quebrava em duas
linhas com **o commit na segunda** — fora do alcance do filtro. Consequência:
`gerar-painel.py --check` reprovava a cada commit novo. Só nunca doeu porque o
gancho de pré-commit regenera o painel antes de qualquer um perguntar. O
parágrafo passou a ser montado numa variável antes do template, para sair numa
linha só.

## Qual mordida prova

`tests/unit/test_indice_html_leva_aos_tres.py` — oito testes, todos verdes.
**Quatro mordidas, todas com a cura devolvida depois:**

1. **Cartão arrancado da página publicada** (removi o `<article>` do painel de
   `html/index.html`):
   `AssertionError: o índice de html/ não leva a: painel.html.` — reprova
   **nomeando qual sumiu**, que é o que a sprint pediu.
2. **Link apontando para o vazio** (`href="specs-que-nao-existe.html"`):
   `link(s) do índice apontando para arquivo que não existe em html/:
   specs-que-nao-existe.html.`
3. **Cartão arrancado da tupla `INSTRUMENTOS` do gerador**, e é a mordida que
   justifica o teste existir: eu regerei o índice com dois cartões e
   `gerar-indice-html.py --check` ficou **VERDE** — o publicado passou a ser
   exatamente o que o script produz. O teste reprovou:
   `o índice de html/ não leva a: frases-de-tela.html.` Duas réguas
   independentes é o que revela; é regra desta casa.
4. **Carimbo arrancado de uma página** (`sed -i '/data-carimbo/d'`):
   `html/frases-de-tela.html não traz o carimbo da casa (data-carimbo,
   scripts/carimbo_da_casa.py).`

E, fora do arquivo de teste, a mordida do carimbo contra o `--check`: adulterei
commit e data nos três publicados e os três `--check` seguiram verdes — que é o
comportamento exigido, e o oposto do que aconteceria sem `sem_carimbo()`.

Portões: `bash scripts/portoes.sh --rapido` → **19 verdes**. `ruff check src/
tests/` (o comando exato do CI) → **All checks passed**. `validar-acentuacao.py`
nos três arquivos novos → limpo.

## O que NÃO verifiquei

- **O bloco de discordância nunca foi visto RENDERIZADO.** Conferi o HTML que
  ele produz (li o texto gerado, com os dois commits e o comando de cura) e o
  CSS usa só tokens do `paleta_da_casa.py`, mas o Chrome parqueado no `OS`
  reusou a aba em cache e me devolveu a versão anterior. O estado normal (a
  linha verde de concordância) **foi visto** e está correto.
- **Não rodei a suíte inteira** — regra da casa, e há frentes em voo. Rodei os
  cinco arquivos de teste que tocam estes caminhos; o resultado está na lista
  abaixo.
- **Não conferi o `flatpak/`, o `packaging/` nem o `install.sh`** — não são
  desta frente, e o portão `packaging-parity` ficou verde.
- **Não sei se algum marcador do navegador dela aponta para o caminho antigo.**
  Se apontar, quebrou; o conserto é o marcador, não o repositório.
- **A palavra dela sobre a página nova** — `html/index.html` é interface, e
  interface só fecha com o olho dela (PROVA-DE-TELA-01). A foto está em
  `/tmp/Screenshot_2026-08-25_23-13-12.png`.

## O que sobrou para o próximo

### O que QUEBROU e é de outra frente (arquivo:linha, prontos para aplicar)

**1. `scripts/check_paridade_transporte.py:337` — URGENTE, e é a pior das
oito.** `SPECS_RELATIVO = "specs.html"` → `"html/specs.html"`.

O portão **continua VERDE** e imprime, no meio da saída:

```
regra DESLIGADA neste ambiente: mapa-nao-publicado (specs.html ausente —
quem cobra a existência dele é scripts/gerar-mapa.py)
```

Ou seja: a regra 5 (linha do CSV cujo `id` não aparece no `specs.html`) **parou
de medir e o portão não reprova por isso**. É a família do "a casa sabe e o
produto não faz", com verde por cima. Quem integrar esta frente tem de aplicar
esta linha, ou a rede contra regressão fica com um furo silencioso.

**2. Testes que leem o caminho antigo** — 4 falhas e 9 erros medidos:

| arquivo:linha | o que trocar |
|---|---|
| `tests/unit/test_o_painel_encabeca_as_decisoes_dela.py:91` | `RAIZ / "painel.html"` → `RAIZ / "html" / "painel.html"` |
| `tests/unit/test_o_painel_encabeca_as_decisoes_dela.py:106` | idem |
| `tests/unit/test_o_painel_encabeca_as_decisoes_dela.py:189` | idem |
| `tests/unit/test_o_grau_forte_exige_ensaio_no_caderno.py:763` | `RAIZ_REAL / "specs.html"` → `RAIZ_REAL / "html" / "specs.html"` |
| `tests/unit/test_check_do_mapa_pergunta_pelo_conteudo.py:123` | `return arvore / "specs.html"` → `arvore / "html" / "specs.html"` (a árvore de brinquedo do fixture precisa da pasta) |

`tests/unit/test_check_paridade_transporte.py` continua verde **porque escreve
`specs.html` na raiz do `tmp_path` e o portão o procura lá** — os dois seguem
concordando entre si. Quando a linha 337 acima for corrigida, os `tmp_path /
"specs.html"` desse arquivo (linhas 139 e 512, e o irmão em
`test_o_grau_forte…:168`, `test_id_estavel_z6_07.py:100` e `:145`,
`test_causa_nao_declarada_z6_05.py:68`) têm de virar `html/specs.html` **na
mesma passada**, senão eles é que ficam vermelhos.

**3. `scripts/hooks/pre-commit:31`** (frente HOOK) —
`git add painel.html` → `git add html/painel.html`. Hoje o gancho regenera o
painel em `html/` e adiciona um arquivo que não existe mais: o `|| true` engole
o erro, e **o painel vai velho no commit sem avisar**.

**4. `docs/usage/bluetooth.md:173`** — o link `[mapa de canais](../../specs.html)`
→ `(../../html/specs.html)`. É o único link de markdown para os três em toda a
árvore; o resto das ~50 menções em `docs/` é prosa histórica, que não se
reaponta.

### O que EU proponho e não fiz, porque não é meu

**5. Um portão para o índice.** `scripts/gerar-indice-html.py --check` não está
em `scripts/portoes.sh` nem no `ci.yml`. Sem ele, o índice é a única das quatro
páginas que pode envelhecer em silêncio — o defeito exato que a sprint veio
curar. A linha do `portoes.sh`, no formato das vizinhas (55 e 65):

```
rapido|indice-html|py|scripts/gerar-indice-html.py --check
```

**Atenção:** `tests/unit/test_portao_a_lista_de_portoes_e_uma_so.py` compara a
lista local com a do CI **nos dois sentidos** — tem de entrar nos dois arquivos
na mesma passada, ou declarar a divergência.

**6. O gancho de pré-commit tem de rodar o índice POR ÚLTIMO.** Ele lê o carimbo
dos irmãos; rodar antes publica um índice que descreve as páginas anteriores.

**7. `README.md`** ainda não aponta para `html/index.html`. A promessa da sprint
é *"a única página que ela precisa abrir"*, e hoje ninguém que chega ao
repositório é levado até ela.

**8. `docs/data/caducos.csv:2`** cita `specs.html` na célula de escopo. É prosa,
o portão `caducos` está verde, e o escopo da varredura (README, `docs/usage`,
`docs/protocol`, `src`) não mudou — só o nome do arquivo envelheceu.
