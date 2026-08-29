---
sprint: MIGRA-PERFIS-INDICE
onda: PERFIS
posse:
  COORDENA:
    - docs/process/sprints/2026-08-29-MIGRA-PERFIS-INDICE.md
cria: []
bancada: false
depois_de: []
nao_toca:
  - src/
  - tests/
  - novo-layout/
---

# MIGRA PERFIS — o índice

**A aba Perfis muda de motor.** Deixa de ser 576 linhas de XML alcançadas por 74
`self._get()` e passa a ser `novo-layout/10-perfis.html` dentro de um
`WebKit2.WebView`, com o Python **pintando valores** e **recebendo gestos** —
nunca construindo widget.

Decisão: `D-A-INTERFACE-NOVA-E-O-MOCKUP-DENTRO-DE-UMA-JANELA-GTK`
(`docs/data/decisoes-dela.csv:119`, 29/08/2026).
Contrato da aba: `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 9 —
**toda linha do "Nada se perdeu" é requisito**.
Especificação visual: `novo-layout/10-perfis.html` e o gerador
`novo-layout/_ferramentas/aba10.py`.
Correções literais dela: `novo-layout/_ferramentas/CORRECOES-DELA.md`, aba Perfis.

## A EXECUÇÃO ESPERA A PALAVRA DELA

A aba **Controles** está sendo feita viva agora como **piloto** do enxerto no
`WebView`. Palavra dela, 29/08:

> *"Preciso avaliar como ela se comporta. Depois dou o ok pra seguirmos
> materializando a ordem pra fazermos todas as abas funcionarem no novo motor."*

**As seis sprints abaixo estão ESCRITAS. Nenhuma executa antes do ok dela sobre
o piloto.** E `PROVA-DE-TELA-01` continua valendo depois disso: interface só
fecha com o olho dela — foto antes e depois, e a palavra final é dela. Aprovar o
mockup não é aprovar a tela.

## As seis

| # | Sprint | Camada | Toca `src/`? | Trava |
|---|---|---|---|---|
| 01 | [a página troca de motor](2026-08-29-MIGRA-PERFIS-01-a-pagina-troca-de-motor.md) | estrutura | glade · app.py · retrato | **enxerto substitutivo não medido** |
| 02 | [todo valor ganha endereço](2026-08-29-MIGRA-PERFIS-02-todo-valor-ganha-endereco.md) | mockup | **não** | a prioridade arrastável é **palavra dela** |
| 03 | [a lista de perfis chega viva](2026-08-29-MIGRA-PERFIS-03-a-lista-de-perfis-chega-viva.md) | pintura | `perfis_web` · `profiles_actions` | — |
| 04 | [o editor pinta os cinco campos](2026-08-29-MIGRA-PERFIS-04-o-editor-pinta-os-cinco-campos.md) | pintura | `perfis_web` · `profiles_actions` | **cinco ou seis ambientes** |
| 05 | [a guarda anti-perda atravessa a ponte](2026-08-29-MIGRA-PERFIS-05-a-guarda-anti-perda-atravessa-a-ponte.md) | gesto | `perfis_web` · `profiles_actions` | **a fusão dos dois Salvar** |
| 06 | [o "Ajuste próprio" nasce da mesa dela](2026-08-29-MIGRA-PERFIS-06-o-ajuste-proprio-nasce-da-mesa-dela.md) | pintura | `perfis_web` · `profiles_actions` · retrato | **bancada** |

**Seis, e o censo já dizia seis.** O que mudou ao escrever foi o **conteúdo** de
duas: a guarda anti-perda ganhou sprint própria (era um item da casca) porque a
medição mostrou que ela **desliga em silêncio**, e a tabela do "Ajuste próprio"
absorveu a mesa, a cor e o anonimato — que eram três riscos soltos e são um
trabalho só.

## A ordem, e por quê

```
02  (solta — pode correr do primeiro minuto)
01 ──► 03 ──► 04 ──► 05 ──► 06
02 ──► 03
```

- **02 é a única que não toca `src/`** e não espera ninguém: ela só põe
  `data-hef` no gerador do mockup. Quanto antes correr, melhor — sem endereço
  não há o que pintar.
- **01 é o gargalo de todo mundo**: é ela que apaga `main.glade:2119-2694` e
  cria o `app/actions/perfis_web.py` onde as outras quatro escrevem. <!-- ref-externa: o módulo é o que a MIGRA-PERFIS-01 VAI criar; ele não existe hoje -->
- **03, 04, 05 e 06 correm EM SÉRIE**, e não por prudência: as quatro dividem
  o módulo da ponte e o `app/actions/profiles_actions.py`. Quem divide arquivo
  executa em série (R5).
- **05 depois de 04**: a válvula do "perfil que a tela não sabe mostrar" tem de
  existir antes de o Salvar ser ligado, ou o primeiro Salvar rebaixa a regra.

**AS SEIS FECHAM JUNTAS OU NENHUMA FECHA.** Entre a 01 e a 06 a aba existe e não
mostra nada — buraco **declarado**, não descuido. A integração corre em árvore
própria (`git worktree add`), e a árvore dela fica em `dev`, sempre: ela recebe
o trabalho no fim, de uma vez, pelo merge.

## O que a decisão do WebKit faz com as nove `ONDA-PERFIS` de 27/08

As nove foram escritas para um editor GTK que vai deixar de existir. **Nenhuma
some por inteiro; sete mudam de tamanho.** Esta tabela é para quem for fazer a
faxina — a decisão de apagar é de quem coordena, não desta materialização.

| Sprint de 27/08 | O que acontece com ela |
|---|---|
| `ONDA-PERFIS-01` (a casca em GTK) | **esvaziada**. A `MIGRA-PERFIS-01` faz o mesmo trabalho no motor novo, e a casca vem pronta do mockup |
| `ONDA-PERFIS-02` (o ambiente) | **parte-se**: a migração dos perfis com `browser`/`terminal`/`editor` fica com ela; a tela vai para a `MIGRA-PERFIS-04` |
| `ONDA-PERFIS-03` (Detectar) | **sobrevive inteira** — é backend: o daemon já lê (`daemon/state_store.py:714`) e o IPC não publica |
| `ONDA-PERFIS-04` (Estilo de Jogo) | **sobrevive inteira** — não existe campo, widget nem preset em lugar nenhum |
| `ONDA-PERFIS-05` (Voltar à de ontem) | **sobrevive**: o motor existe (`profiles/loader.py:1269` e `:1509`) e a janela nunca o chamou; a `MIGRA-PERFIS-05` só declara o botão desligado |
| `ONDA-PERFIS-06` ("Quando usar") | **sobrevive** a reescrita de `_MATCH_LABELS`; a pintura vai para a `MIGRA-PERFIS-03` |
| `ONDA-PERFIS-07` (o Universal) | **sobrevive inteira** — `loader.py` e `assets/`, nada de tela |
| `ONDA-PERFIS-08` (um Salvar só) | **sobrevive, e vira DEPENDÊNCIA**: no motor novo o Salvar do editor some por construção, e a `MIGRA-PERFIS-05` para se a divergência dos dois alvos não estiver fechada |
| `ONDA-PERFIS-09` (modo, máscara, Automático) | **encolhe**: o "Automático" morreu por decisão dela em 29/08 (a heurística erra em 13 de 14). O que sobra é a pergunta 2 abaixo |

## As travas — o que precisa dela antes de qualquer código

1. **O ok sobre o piloto** (a aba Controles). Trava as seis.
2. **"Modo que liga" e "O jogo vê o controle como" ficam nesta aba?** O contrato
   diz que **ficam**; o mockup **não os desenha**, e a legenda dele admite por
   escrito que a versão anterior afirmava o contrário e era falsa. No motor novo
   isso deixa de ser acabamento — **o que o mockup não desenha, o produto não
   tem**. Trava a **01** (o que fazer com `gui/main.glade:2640`) e a **04**.
3. **Cinco ou seis ambientes.** Duas decisões dela, do MESMO dia, se
   contradizem: `decisoes-dela.csv:55` fecha em cinco; `:84`
   (`D-PROGRAMAS-NO-LUGAR-DE-TERMINAL`) diz cinco **mais Programas**, com a
   palavra dela. **Nenhuma lápide explica por que a de seis caducou.** Trava a
   **04**, e muda o destino dos perfis dela que casam por
   `browser`/`terminal`/`editor`.
4. **A prioridade volta a ser arrastável?** O mockup desenha um trilho que **não
   é controle**, e ela pediu *"prioridade é slicer"*. Migrar como está é perder
   a única forma de mudar prioridade na janela. Trava um gesto da **05**.
5. **A tabela "Ajuste próprio" é só leitura?** O motor de limpar existe
   (`app/draft_config.py:1355`). Trava um item da **06**.
6. **O ID da peça fica visível na tela dela?** (A **foto** já está resolvida na
   **06**; a tela é outra pergunta.)

## Duas dependências de FORA desta onda, e as duas travam a 01

Nenhuma das duas tinha id no dia em que este índice foi escrito — por isso elas
estão em prosa, e não num `depois_de` com um id inventado.

1. **O enxerto SUBSTITUTIVO, medido.** O provado em 29/08 foi **aditivo** (uma
   12ª página do `Gtk.Notebook`, 376 objetos em 56 ms). Ninguém mediu **trocar**
   uma página, e é onde reaparecem as 60.862 linhas que hoje chegam aos widgets
   por `builder.get_object()`. **É a primeira sprint de todas, e é da leva, não
   desta aba.**
2. **Onde o HTML passa a morar.** `novo-layout/` é `.gitignore:108` — não viaja
   em `git worktree` nem no pacote — e o wheel inclui só `gui/*.glade` e
   `gui/assets/*.png` (`pyproject.toml:84-91`). O caminho já resolvido para caso
   análogo é `src/hefesto_dualsense4unix/utils/repo_files.py` mais o `install.sh`
   que copia `assets/glyphs` para `~/.local/share`. **Enquanto isso não fechar,
   a aba roda no `ver.py` e em lugar nenhum.**

## Colisões com outras ondas — quem coordena serializa

| Arquivo | Quem daqui | Quem de fora |
|---|---|---|
| `gui/main.glade` | **01** (faixa `2119-2694`) | as outras nove ondas — XML único, sem seções nomeadas; recurso de bancada, uma sprint por vez |
| `app/app.py` | **01** | `ONDA-SISTEMA-02`, `ONDA-VIBRACAO-06` e toda onda que troque uma página |
| `scripts/gui-captura/retratar_abas.py` | **01**, **06** | toda onda que mude uma aba — o retrato é um arquivo só para as dez |
| `app/actions/profiles_actions.py` | **03**, **04**, **05**, **06** | `ONDA-PERFIS-02/06/08/09` |
| `app/actions/footer_actions.py` | **ninguém** (está no `nao_toca` da 05) | `ONDA-PERFIS-08`, `ONDA-CONEXOES-09`, `ONDA-GATILHOS-02`, `ONDA-NAVEGACAO-09`, `ONDA-SISTEMA-05` |
| `integrations/cor_do_plastico.py` | **ninguém** (`nao_toca` da 06) | `ONDA-CONEXOES-08/11/12` |
| `novo-layout/_ferramentas/aba10.py` | **02** | ninguém — mas ver a nota abaixo |

**A nota do `novo-layout/`, e ela é séria:** a pasta é ignorada pelo git. Duas
levas editando o mesmo mockup em árvores diferentes **divergem sem conflito de
merge**, porque o git não vê nenhuma das duas. A árvore
`/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix-dev` recebeu a pasta
**copiada à mão**. É a mesma forma do defeito de 25/08 (oito agentes mandados
ler um `CLAUDE.md` que não estava na árvore deles), com o agravante de que aqui o
arquivo é a **especificação aprovada por ela**.

## As armadilhas desta rota, medidas em 29/08 — não remeça

1. **Quatro pinos obrigatórios**, nesta ordem: `Gtk 3.0`, `Gdk 3.0`,
   `GdkPixbuf 2.0`, `WebKit2 4.1`. Com o GTK4 ao lado, um `import Gdk` sem pino
   carrega o 4.0 e mata o Gtk 3.0.
2. **`FINISHED` dispara depois de `load-failed`** — o WebKit commita uma página
   de erro. Quem escuta só FINISHED **reporta sucesso sobre carga que falhou**.
3. **`get_title()` no handler de FINISHED devolve vazio** — o título chega
   depois.
4. **`select{appearance:none}`** — sem isso o WebKitGTK desenha a caixa do tema
   do sistema (branca, texto invisível). São **dois** `<select>` nesta página.
5. **Os 84 filtros mortos do SVG NÃO alcançam esta aba** — medido:
   `10-perfis.html` tem 29 SVGs e **zero** `filter=`. A cura pendente (que muda
   1,09% do desenho que ela aprovou, e é dela) é de outras abas.
6. **O `scrollIntoViewIfNeeded` do Playwright ROLA antes de medir** e cega toda
   medição de layout feita depois. Fotografe a página inteira.
7. **A régua não pode digitar o que deve LER.** Onze réguas reprovaram a melhora
   em vez do defeito em 26/08, todas por isso; e seis instrumentos falsos
   apareceram em quinze horas no dia 29/08.

## Antes de fechar a onda

```bash
scripts/gui-captura/retratar_abas.py   # a foto de hoje, antes e depois
git add -A                             # os portões são cegos a arquivo novo
bash scripts/portoes.sh                # os 26 portões, ~2 min
python3 scripts/check_colisao_de_sprints.py
```

E a suíte em **oito lotes**, no fim, com a máquina livre — nunca num processo
só, que morre no meio sem traceback e sem sumário.
