---
sprint: MIGRA-CONEXOES-02
onda: MIGRA-CONEXOES
posse:
  M2:
    - src/hefesto_dualsense4unix/gui/telas/08-conexoes.html
    - scripts/telas/aba08.py
cria:
  - src/hefesto_dualsense4unix/gui/telas/08-conexoes.html
  - scripts/telas/aba08.py
  - tests/unit/test_migra_conexoes_a_pagina_viaja.py
bancada: false
depois_de:
  # A MOLDURA DAS DEZ fixa (a) o diretório das páginas dentro de `src/`, (b) a
  # linha do `install.sh` e do `pyproject.toml` que as copia, (c) onde os
  # geradores passam a morar. Dez sprints editando `install.sh` é colisão de dez
  # vias num arquivo só, e por isso essa decisão não é desta onda. Ela é a
  # MIGRA-CONTROLES-02, que declara posse de `gui/telas/` e de `scripts/telas/`
  # como PASTAS; as outras oito ondas a chamam de `MIGRA-MOLDURA-01`.
  - MIGRA-CONTROLES-02
  - MIGRA-CONTROLES-01
nao_toca:
  - install.sh
  - pyproject.toml
  - flatpak/io.github.hefesto_team.hefesto_dualsense4unix.yml
  - scripts/telas/monta.py
  - src/hefesto_dualsense4unix/app/
  - src/hefesto_dualsense4unix/gui/main.glade
---

# MIGRA CONEXÕES · 02 — a página viaja, e perde a segunda tira

**O defeito, em uma frase:** no motor novo o HTML **é** o produto, e o HTML desta
aba não existe no repositório.

```
$ git check-ignore -v novo-layout/08-conexoes.html
.gitignore:108:novo-layout/	novo-layout/08-conexoes.html
```

Logo ele **não viaja** em `git worktree add`, **não** entra no wheel
(`pyproject.toml` inclui hoje `gui/*.glade`, `gui/assets/*.png` e os `.mo` — e
mais nada) e **não** é copiado pelo `install.sh`. Se ninguém o mover, a aba nasce
**em branco** em toda árvore de agente e em toda instalação. É a mesma cicatriz
de 25/08, quando oito agentes foram mandados ler um `CLAUDE.md` que não estava na
árvore deles — com o agravante de que aqui o arquivo é a **especificação
aprovada por ela**.

O tamanho: **3.253 linhas** de HTML e **2.174** de gerador.

## Três coisas que quebram na mudança, e as três estão medidas

### 1. O gerador resolve caminho por `__file__`, e a distância muda

`aba08.py` faz `R = pathlib.Path(__file__).resolve().parents[2]` e lê **do
produto, por AST**, sete constantes de `integrations/radio_da_mesa.py`, o teto da
vibração de `app/actions/config/secao_orcamento.py`, e os textos das duas janelas
(`app/widgets/mapa_da_mesa.py`, `app/widgets/calibrar_entradas.py`). Ele lê por
AST e **nunca por import**, porque `radio_da_mesa` puxa `structlog` e o gerador
não roda no `.venv` — a mesma disciplina de `scripts/validar-fala-de-tela.py`.

`parents[2]` conta pastas. Em `novo-layout/_ferramentas/` a raiz fica a dois
saltos; em `scripts/telas/`, a dois também — **mas isso é coincidência, não
garantia**, e o `_constantes()` **levanta `SystemExit`** quando um nome some. A
sprint confere a raiz resolvida, não a conta de saltos.

### 2. O gerador reescreve o HTML depois de gerá-lo

As quatro `.tela-nova` (o desenho da mesa e as três telas da cerimônia) não saem
do `monta()`: o gerador **relê o arquivo**, procura a marca
`<!-- ================= LEGENDA DO MOCKUP ================= -->` e injeta as
telas antes dela, com `raise SystemExit` se a marca sumir. Esse passo de
pós-escrita tem de sobreviver à mudança de casa, e ele grava **no caminho de
destino**, não no de origem.

### 3. A página traz uma SEGUNDA tira de abas, e ela navega

`08-conexoes.html:1085-1094` — dez `<a class="aba" href="NN-....html">`. Isso é o
defeito que **ela já viu e nomeou** em 29/08, no `ver.py`: *as abas apareciam  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->
duas vezes*, a tira do GTK em cima e a tira do desenho dentro. No enxerto
substitutivo o `Gtk.Notebook` do produto continua desenhando a tira; a da página
seria a segunda.

E há um agravante que a janela do mockup não tinha: aqui **cada aba é um
`WebView` seu**. Clicar em "Gatilhos" dentro da página da Conexões faria o
`WebView` **da aba Conexões** carregar `03-gatilhos.html` — a página certa dentro
da aba errada, sem que nada avise.

**A cura, e ela é decisão da moldura, não desta aba:** ou a tira do HTML sai das
dez páginas, ou o `href` vira gesto (`data-g="aba.ir"`) e quem troca de página é
o `Gtk.Notebook`. Esta sprint **não escolhe**; ela entrega a página com a tira
**neutralizada de um jeito reversível** e o teste que impede a navegação por
`href` de acontecer dentro do produto.

## O que entrega

1. **`src/hefesto_dualsense4unix/gui/telas/08-conexoes.html`** e
   **`scripts/telas/aba08.py`**, nos caminhos que a `MIGRA-MOLDURA-01` fixar —
   se ela escolher outros, valem os dela.
2. **O gerador continua sendo o dono do HTML.** Nada de editar o `.html` à mão:
   ele é saída. Quem editar o HTML e não o gerador perde a mudança na próxima
   geração — e foi exatamente assim que o `05-vibracao.html` dela ficou com
   `--r-motor:56px` em 28/08, quando um agente rodou uma cópia do gerador noutro
   diretório.
3. **A `.nota` não vai para o usuário — ou vai, e é dela decidir.** Medido: a
   legenda do fim desta página tem **22.887 bytes em 91 linhas**, de **346.595**
   do arquivo — **6,6%** da página que o produto passaria a instalar é caderno
   interno ("O que eu desenhei de cabeça, e por que"). Hoje ela é só escondida
   por CSS. A saída barata é o gerador emitir duas versões (a de trabalho, com
   nota; a do produto, sem) do mesmo `MIOLO`.
4. **A cópia à mão morre.** A árvore `hefesto-dualsense4unix-dev` recebeu
   `novo-layout/` **copiado à mão**. Duas levas editando o mesmo mockup em
   árvores diferentes divergem **sem** conflito de merge, porque o git não vê
   nenhuma das duas. Depois desta sprint o arquivo é versionado e o git volta a
   enxergar.

## Como se prova (a mordida)

`tests/unit/test_migra_conexoes_a_pagina_viaja.py`:

* **o arquivo existe e o git o vê.** `git check-ignore` **não** reprova o novo
  caminho. **Mordida:** acrescente `gui/telas/` ao `.gitignore` e o teste
  reprova. (É a régua que o defeito original pedia: um `os.path.exists` sozinho
  passaria verde sobre um arquivo ignorado.)
* **o gerador roda a partir do caminho novo e escreve no caminho novo.** Roda-o
  num diretório temporário com uma cópia da árvore e confere que o HTML mudou
  **lá**, não na árvore dela. **Mordida:** cravar a raiz em vez de derivá-la de
  `__file__` e ver o teste apontar o arquivo de fora.
* **as quatro `.tela-nova` chegaram.** O HTML gerado tem `id="mapear-entradas"`
  e as três telas da cerimônia. **Mordida:** apague a marca da legenda e veja o
  `SystemExit` — o gerador tem de **parar**, nunca gerar meia página.
* **os sete números continuam vindo do produto.** Renomeie
  `SLOTS_POR_SEGUNDO` em `radio_da_mesa.py` num dublê e o gerador tem de
  **reprovar em voz alta**, não sumir com o número.
* **nenhum `href` de aba sobrevive no HTML do produto.** Zero
  `<a class="aba" href="0`. **Mordida:** devolva um e veja reprovar — este é o
  teste que impede a página certa de aparecer dentro da aba errada.
* **a página cabe no pacote.** O tamanho do HTML entra no teste como **número
  lido**, não digitado, e o teste falha se a página passar de um teto declarado
  pela moldura. (Hoje: 346.595 bytes, dos quais 22.887 são a `.nota`.)

## O que é dela decidir

* **A legenda vai instalada?** São 6,6% da página, e é caderno de decisões
  escrito para ela e para quem executa — não para quem joga.
* **A tira do HTML sai, ou vira gesto?** É uma decisão para as **dez** páginas,
  e ela já disse o que acha do sintoma quando o viu no `ver.py`: *"as abas  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->
  apareciam duas vezes"*.
