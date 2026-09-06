# O-TECLADO-QUE-NAO-DIZ-COMO-SAIR-01 — o L3 abre, e agora a tela fala

**Agente:** opus · **Data:** 06/09/2026 · **Branch:** `voo/O-TECLADO-QUE-NAO-DIZ-COMO-SAIR-01-opus`
**Base:** `c15d2e3e` (idêntico a `onda/atual-0609` no momento do despacho)

---

## O que mudou

**Três arquivos, e a cura é uma frase com dono.**

### 1. `src/hefesto_dualsense4unix/integrations/desktop_notifications.py`

Nasceu `notify_teclado_na_tela_aberto()`, irmã de
`notify_teclado_na_tela_ausente()` — a forma que a casa já usa para este mesmo
subsistema, exatamente como o §3 da sprint pedia. O texto publicado:

```
Teclado na tela aberto pelo L3.
Para fechar, aperte R3.
```

**A frase não é minha.** É `D-0609-A-FRASE-DO-TECLADO-NA-TELA`
(`docs/data/decisoes-dela.csv`), decidida por delegação em 06/09 e confirmada
palavra por palavra pela nota **ROTA CORRIGIDA** no topo da sprint. Ela vive em
duas constantes de módulo (`_OSK_ABERTO_TITULO` / `_OSK_ABERTO_CORPO`) para a
régua poder **ler** o texto publicado em vez de redigitá-lo.

Duas escolhas declaradas no docstring, porque as duas são reversíveis e as duas
têm preço:

- **sem o opt-in** `HEFESTO_DUALSENSE4UNIX_DESKTOP_NOTIFICATIONS` — mesmo motivo
  já escrito em `notify_emulation_suppressed` e em
  `notify_teclado_na_tela_ausente`: é resposta a um gesto deliberado dela, e
  gesto sem resposta visível parece produto quebrado;
- **sem `once_key`** — a segunda abertura acidental precisa da frase tanto
  quanto a primeira. Um aviso "uma vez por daemon" devolveria o silêncio de 20
  minutos na segunda vez. Não vira rajada porque quem chama é o `open()`
  **depois** do guarda de "já aberto": só há aviso onde houve transição de
  fechado para aberto, e cada transição é um clique dela.

### 2. `src/hefesto_dualsense4unix/daemon/subsystems/keyboard.py`

`_OSKController.open()` ganhou uma última linha, `self._avisar_abertura()`, e o
método best-effort que ela chama (import tardio + `contextlib.suppress`, molde
do `_avisar_ausencia`).

**A POSIÇÃO DELA É A CURA INTEIRA.** Os três ramos que voltam antes ficaram
todos acima da linha nova, de propósito, e o docstring diz por quê:

| ramo que volta antes | por que não avisa |
| --- | --- |
| `_pid_vivo() is not None` (já aberto) | não houve transição para anunciar — dois avisos para um teclado só |
| `resolved is None` (sem binário) | já tem dono e frase própria (`_avisar_ausencia`); dois avisos no mesmo gesto é ruído |
| `Popen` estourou | não abriu teclado nenhum — avisar ali é a tela mentindo sobre o que existe |

### 3. `tests/unit/test_o_teclado_avisa_como_sair.py` (novo)

Nove casos, todos entrando pelo caminho **público** —
`dispatch_token(<token>, "press")`, o callback que o `UinputKeyboardDevice`
chama quando o analógico é clicado.

**Nada de janela de verdade.** O binário é dublado por `sleep` pelo caminho
declarado (`_osk_candidatos` / `_OSK_CANDIDATES` / `_OSK_SPAWN_ARGS` mais o
`shutil.which`), com `XDG_RUNTIME_DIR` próprio, e a fixture mata por PID tudo o
que nasceu — inclusive quando um caso reprova no meio. É a mesma disciplina da
régua irmã, e pelo mesmo motivo: o teclado na tela é `layer-shell`, aparece por
cima de **todos** os workspaces, e um `wvkbd` de verdade aqui nasceria na frente
dela. Foi o que aconteceu em 30/08, quando quem coordenou dublou o atributo de
cache errado.

---

## Qual mordida prova

Comando das cinco execuções (o python é o que o `scripts/portoes.sh
--interpretador` resolve nesta árvore):

```
source .envrc-voo
/mnt/.../hefesto-dualsense4unix/.venv/bin/python -m pytest \
    tests/unit/test_o_teclado_avisa_como_sair.py -q
```

### Verde, com a cura no lugar

```
.........                                                                [100%]
9 passed in 0.35s
```

### MORDIDA 1 — arrancada a chamada `self._avisar_abertura()` do `open()`

```
E   AssertionError: um teclado só e 0 avisos de abertura — o aviso está acima do
    guarda de 'já aberto' e fala de uma abertura que não houve
FAILED ...::test_abrir_o_teclado_pelo_controle_avisa_na_tela[__TOGGLE_OSK__]
FAILED ...::test_abrir_o_teclado_pelo_controle_avisa_na_tela[__OPEN_OSK__]
FAILED ...::test_o_release_do_analogico_nao_repete_o_aviso
FAILED ...::test_a_frase_ensina_o_gesto_de_saida
FAILED ...::test_a_frase_e_a_que_ela_decidiu
FAILED ...::test_o_teclado_ja_aberto_nao_ganha_um_segundo_aviso
6 failed, 3 passed in 0.34s
```

É a linha do §1 da sprint: **nenhuma notificação emitida no press de L3**.

### MORDIDA 2 — arrancado o `R3` do texto publicado

Troquei `"Para fechar, aperte R3."` por `"Para fechar, aperte o analógico
direito."` — uma frase que continua correta e **deixa de ensinar o gesto**:

```
E   AssertionError: a frase publicada não nomeia o R3: 'Teclado na tela aberto
    pelo L3. Para fechar, aperte o analógico direito.'. Ela diz o que abriu e
    cala sobre como sair — o gesto de saída volta a existir só na documentação,
    que é o que ninguém lê com o teclado tapando a tela
E   AssertionError: o produto publica 'Teclado na tela aberto pelo L3. Para
    fechar, aperte o analógico direito.' e a decisão dela diz 'Teclado na tela
    aberto pelo L3. Para fechar, aperte R3.'
2 failed, 7 passed in 0.33s
```

O segundo caso é o que mais importa: **a régua lê a frase do
`docs/data/decisoes-dela.csv`**, não a digita. Trocar o texto no código sem
passar por ela reprova; trocar COM a palavra dela (mudando a linha da decisão)
passa. Uma régua que redigitasse mediria a própria digitação — é a forma exata
do defeito que derrubou onze réguas desta casa num dia só.

### MORDIDA 3 — o `_avisar_abertura()` movido para ANTES do guarda de "já aberto"

```
E   AssertionError: um teclado só e 2 avisos de abertura — o aviso está acima do
    guarda de 'já aberto' e fala de uma abertura que não houve
    assert 2 == 1
3 failed, 6 passed in 0.36s
```

**Dois avisos para um teclado só**, que é a linha da tabela do §5.

### MORDIDA 4 — o `_avisar_abertura()` movido para antes do `resolved is None`

```
E   AssertionError: a tela anunciou 'teclado na tela aberto' sem teclado nenhum
    ter aberto: ['Teclado na tela aberto pelo L3. Para fechar, aperte R3.',
    'Teclado na tela não instalado L3 abriria o teclado na tela, mas nenhum
    programa de teclado na tela foi encontrado no computador. …']
2 failed, 7 passed in 0.33s
```

**Os dois avisos no mesmo gesto** — a quarta linha da tabela, com o par inteiro
impresso na mensagem.

### MORDIDA 5 (não pedida pela sprint) — o `Popen` que estoura

O mesmo movimento da mordida 4 faz cair também
`test_o_spawn_que_estoura_nao_anuncia_teclado_nenhum`:

```
E   AssertionError: o `Popen` estourou e a tela anunciou um teclado aberto:
    ['Teclado na tela aberto pelo L3. Para fechar, aperte R3.']
```

É o terceiro ramo que volta antes, e o mais fácil de perder numa reescrita —
basta a chamada subir **uma linha**.

E o caso irmão, `test_o_aviso_que_estoura_nao_derruba_o_teclado`, guarda a
cicatriz de 04/09: **um recado de recusa quebrava a tela que vinha explicar**.
Com o `notify` levantando, o teclado tem de abrir do mesmo jeito.

### Depois de devolver as quatro curas

```
.........                                                                [100%]
9 passed in 0.32s
```

### Os portões

`git add -A && bash scripts/portoes.sh` — saída completa em
`/tmp/portoes-O-TECLADO-QUE-NAO-DIZ-COMO-SAIR-01.txt`.

---

## O que NÃO verifiquei

- **NÃO vi a notificação na tela.** Nenhum `notify` real saiu desta árvore: o
  `notify` foi dublado em todos os casos, e o teclado na tela foi dublado por
  `sleep`. A frase está provada como TEXTO publicado pelo caminho do produto,
  não como pixel no canto da tela dela. **Quem tem a tela é ela**, e o teclado na
  tela é `layer-shell` — abrir um de verdade daqui apareceria por cima do
  workspace dela, que é exatamente o estrago de 30/08. A PROVA-DE-TELA-01 desta
  frase é dela.
- **NÃO exercitei o aparelho.** Nenhum DualSense na mesa nesta execução, nenhum
  `hidraw`, nenhum `systemctl`, nenhum daemon vivo. O clique real do analógico
  esquerdo produzindo esta notificação continua por medir — a linha de prova de
  aparelho fica para a MESA-DE-QUATRO-01.
- **NÃO rodei a suíte inteira**, por protocolo (§5 do COMO-EXECUTAR-UMA-SPRINT).
  Rodei o meu escopo e a lista inteira de portões.
- **NÃO conferi o comportamento com `jeepney` ausente de verdade** — a ausência
  do barramento foi dublada por um `notify` que levanta. O ramo do `ImportError`
  dentro do `notify` já é coberto pelo produto (devolve `False`) e não foi
  reexercido aqui.
- **NÃO toquei `docs/usage/hotkeys.md`** nem nenhum dos nove arquivos que
  descrevem L3/R3: estão fora da minha `posse:`.

---

## O que sobrou para o próximo

### 1. A frase diz R3 e o L3 também fecha — e isso é pergunta para ela

**É o achado desta sprint, e ele é de rota.** A sprint foi escrita em 30/08,
quando o L3 de fábrica era `__OPEN_OSK__` e o **único** jeito de fechar era o R3
— por isso a frase ensina o R3. Em **02/09** ela decidiu outra coisa (*"deixar
no preset do botão L3, no mapeamento, abrir o teclado virtual e fechar o teclado
virtual caso apertado novamente"*), e hoje `core/keyboard_mappings.py` tem
`"l3": (TOKEN_TOGGLE_OSK,)`.

Então, no produto de hoje, **dois** gestos fecham o teclado: o R3 e o próprio L3
de novo. A frase decidida nomeia só o R3. Ela **não está errada** — o R3 fecha,
e a frase é palavra dela de 06/09, portanto posterior à decisão do toggle — mas
é a metade mais longa do caminho: o polegar dela já está no analógico esquerdo.

**Não mudei uma vírgula**, porque texto de tela é dela e a decisão é explícita.
Fica a pergunta, e ela cabe numa linha: *a frase deve dizer que o próprio L3
também fecha?*

### 2. O que caiu do enunciado da sprint, nomeado

- **§2(a)** — *"o L3 abre mas não fecha — não é toggle: é DESENHO, não defeito"*
  — **caducou pela palavra dela em 02/09**. O L3 alterna desde então
  (`TOKEN_TOGGLE_OSK`), o token novo nasceu ao lado dos dois antigos em vez de
  substituí-los, e o seletor da aba Navegação ganhou o terceiro item que o §4.1
  recomendava (`acoes_de_botao.py:165-167`: "Abrir e fechar" · "Abrir" ·
  "Fechar"). O §4.1 da sprint — *"o L3 vira toggle?"* — **já foi decidido, e não
  do jeito que a sprint recomendava**.
- **§5** — o caminho público da régua era `dispatch_token(TOKEN_OPEN_OSK,
  "press")`, *"que é o que o L3 do controle chama"*. **O L3 chama
  `TOKEN_TOGGLE_OSK` hoje.** A régua exercita **os dois**, parametrizada: o
  `__OPEN_OSK__` não morreu (é o que a aba Navegação grava quando ela escolhe
  "Abrir o teclado na tela"), então quem abre o teclado hoje são dois caminhos e
  o aviso tem de nascer nos dois.
- **§2(b)** — *"o `close()` não deixa zumbi"* — continua de pé e não foi
  remedido: não é caminho deste trabalho.

### 3. Os nove arquivos de documentação que descrevem L3/R3

`docs/usage/hotkeys.md:114` e `:223` e os oito irmãos citados no §2(a) da sprint
descrevem L3/R3 como ações separadas. Com o `__TOGGLE_OSK__` de fábrica desde
02/09, **é provável que pelo menos o `hotkeys.md` esteja descrevendo o mundo de
anteontem**. Não conferi um a um e não são da minha `posse:` — relato para quem
os tiver.

### 4. A prova de aparelho

Um DualSense na mesa, L3 clicado, a notificação aparecendo no canto e o R3
fechando o teclado. É `entrada.botoes` (dualsense) chegando ao degrau **O
APARELHO OBEDECEU** nos dois transportes, e é trabalho de bancada.

### 5. O sanitizador cria PASTA quando o destino não existe

Armadilha de processo, medida aqui em 06/09. O fluxo declarado em
`docs/process/agentes/README.md` é
`python3 scripts/sanitizar_saida_de_agente.py ORIGEM DESTINO`, e com um DESTINO
que ainda não existe ele o trata como **diretório**: a entrega foi parar em
`.../O-TECLADO-QUE-NAO-DIZ-COMO-SAIR-01-opus.md/entrega-tec01.md` — uma pasta
com nome de arquivo `.md`. Ele imprime `sanitizados e escritos: 1` e sai com
`rc=0`; **nenhum dos 45 portões viu**, porque a régua da posição da entrega é do
costurador, não deles.

O conserto foi um `git mv`. Quem escrever entrega daqui em diante: **confira com
`ls -l` que o caminho é arquivo**, ou passe o destino já existente.
