# 04/09/2026 — a tela dela, três instrumentos falsos, e as quatro frentes em voo

**Escrito no fim da tarde de 04/09**, depois de ela reportar duas vezes que
janelas apareciam na tela dela. É o estado de agora, e ele existe porque fila
combinada que vive só na conversa morre no primeiro `/clear`.

---

## 1. O QUE ELA REPORTOU, e o que era de verdade

> *"segue tudo abrindo na Meow ao invés da OS"* · *"acho que tá na nossa tool
> de testes tem algo lá que roda sempre e sempre reabre. Acho que é o controle
> ou playtest do claude"* <!-- noqa-acento: citação literal dela -->

A suspeita dela apontava para os agentes. **Não era agente.** Medido com
`ps -eo pid,ppid,etime,cmd`: os únicos processos do projeto vivos eram o daemon
instalado dela, o `storm_watch.sh` e o broker. Nenhum instrumento, nenhum
Playwright, nenhum agente — os dois da ONDA 0 tinham terminado horas antes.

**Era a SUÍTE.** O `tests/conftest.py` não desviava a tela: na máquina dela o
ambiente é `WAYLAND_DISPLAY=wayland-1` e `GDK_BACKEND=wayland,x11` — a sessão
VIVA — e mais de vinte arquivos de teste constroem `Gtk.Window` e chamam
`show_all()`. Dezoito lotes rodaram naquela meia hora. Cada lote abria dezenas
de janelas de verdade, no workspace que estivesse na frente.

**E nenhum script de workspace podia curar isso:** o `park` move a janela
DEPOIS de ela existir, e a suíte abre e fecha centenas em segundos.

### As duas guardas que nasceram

| | o que cobre | onde |
| --- | --- | --- |
| **TELA-DELA-01** | a suíte | `tests/conftest.py` — sobe um `Xvfb` próprio antes de qualquer import, e **RECUSA rodar** sem ele em vez de usar a tela dela |
| **TELA-DELA-02** | os **21 scripts** de `scripts/` que abrem `Gtk.Window` | `utils/tela_de_mentira.py`, chamada no topo de cada um |

Escape único, declarado e classificado: `HEFESTO_NA_TELA=1`.

**Ela desvia em vez de recusar, e a razão está medida:** recusar deixaria os 21
instrumentos inúteis até alguém pôr bandeira em cada um — e *"alguém lembrar"* é
exatamente o que falhou. O custo declarado é que sob `Xvfb` não há gerenciador
de janelas, então o desvio **se anuncia em stderr**: um `1x1` inexplicado vira
diagnóstico errado.

**A TELA-DELA-02 fechou ANTES da ONDA 2 de propósito.** A regra desta casa
manda todo agente que mexe na tela abrir a tela e clicar; sem a guarda, dez
frentes custariam a tela dela dez vezes.

---

## 2. OS TRÊS INSTRUMENTOS FALSOS DO DIA, e os três apontavam para outra coisa

### 2.1 O portão escolhia a venv pela POSIÇÃO

`git worktree list | awk NR==1` devolve a árvore principal do `.git` — que
nesta casa é a `-estavel`, não a de trabalho. Quatro portões saíam vermelhos
sem nada errado no código. A regra passou a ser de **capacidade**: pergunta-se
à venv se ela tem `structlog`, `playwright`, `ruff` e `mypy`.

### 2.2 A suíte estava medindo o `src/` de OUTRA árvore

Doze lotes inteiros. Toda venv do projeto tem o pacote em modo editável, e o
`.pth` dela aponta para o `src/` da árvore onde ela nasceu — chamar
`<venv-de-lá>/bin/python -m pytest` aqui roda os TESTES daqui contra o PRODUTO
de lá.

**E o sintoma engana de um jeito caro:**

```
ImportError: cannot import name 'BYTE_SONS_DO_JOGO' from ...audio_saida
AttributeError: module ...hotkey has no attribute '_ECO_DO_ATO'
```

— exatamente o que se veria se o agente que criou esses símbolos não tivesse
terminado. **Trabalho ENTREGUE foi diagnosticado como trabalho faltando.**

O `CLAUDE.md` já descrevia o risco e o `portoes.sh` já AVISAVA. Nenhum dos dois
curava: **aviso no cabeçalho de um comando que termina verde ninguém lê.** Agora
o `conftest.py` põe o `src/` da própria árvore na frente do `sys.path`, e o
`portoes.sh` RESOLVE o `PYTHONPATH`.

### 2.3 O dublê do co-op era mais frouxo que a função real

`test_coop_player_leds.patched` trocava `normalize_flavor` por
`lambda f: f or "dualsense"` — que devolvia sinônimos crus. O `monkeypatch`
desfaz o que fez em `uinput_gamepad`, mas `external_mask` faz `from ... import`
na primeira importação: se essa cai dentro do patch, o módulo guarda a lambda
**para sempre**. O estrago aparecia em `KeyError: 'sony'` num arquivo sem
relação, dependente de ordem, verde quando rodava sozinho.

**A REGRA QUE OS TRÊS DEIXAM:** *o instrumento tem de dizer o que está medindo,
e a régua tem de PERGUNTAR — não supor pela posição, pelo nome, nem pelo aviso.*

---

## 3. O ESTADO

```
40 portões verdes  ·  17.251 testes em doze lotes  ·  árvore dela limpa em `dev`
```

Já em `dev`: as **54 decisões** do PO por delegação, a **ONDA 0** inteira (o
piloto P e a folha F), a **ONDA 1a** (D1, o som), a **ONDA 1 X** (a retriagem),
e as duas guardas de tela.

---

## 4. AS QUATRO FRENTES EM VOO

Despachadas no fim da tarde, cada uma em árvore própria nascida de `dev`:

| agente | frente | posse |
| --- | --- | --- |
| **D2** | a vibração — o multiplicador por motor compõe com o degrau | `ipc_handlers.py` · `subsystems/gamepad.py` |
| **A1** | aba 01 Jogar — a aba que ela mais olha | `aba01.py` · `a01_jogar.py` · os dois HTML |
| **A2** | aba 02 Controles — a maior de desenho | `aba02.py` · `a02_controles.py` · os dois HTML |
| **A4** | aba 04 Iluminação — o interruptor de verdade (D-13) | `aba04.py` · `a04_iluminacao.py` · os dois HTML |

**Por que quatro e não dez:** memória. A máquina tinha ~6 GB livres com o
navegador dela aberto, e cada frente roda pytest e um WebKit. As seis restantes
(`ONDA2-03`, `05`, `06`, `07`, `08`, `09`, `10` e a `D3` do sensor) saem à
medida que estas fecham.

**O despachante agora copia o `CLAUDE.md`** para a árvore do agente — ele é
`.gitignore:90` e `git worktree add` não copia ignorado; em 25/08 oito agentes
foram mandados ler um arquivo que não estava lá.

---

## 5. O QUE ESPERA

1. Integrar as quatro frentes e despachar a próxima leva.
2. **A `D3` do sensor** vem depois da `D2`: as duas disputam `ipc_handlers.py`.
3. **T-01, a tela nua, continua ABERTA.** A cura da ONDA 0 P é válida para um
   defeito real e invisível (WebView congelado + JS no vazio para sempre), mas
   **não explica a fotografia dela**. H3 e H4 caíram com medição; a H2 não achou
   caminho.
4. A leva de publicação para o olho dela, e a FASE 5 — ela apertando os botões.
