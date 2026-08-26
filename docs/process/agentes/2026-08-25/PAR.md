# PAR — o `peer` sai, e a fonte do par de entradas é o desenho dela

**25/08/2026.** Árvore `hefesto-voo/CONEXOES-MAPA-2D-01-PAR`, branch
`voo/CONEXOES-MAPA-2D-01-PAR`. **Sem commit** — quem coordena integra.

Bancada: **sem DualSense conectado**. Nada aqui precisa de um — a fonte que
ficou é função pura sobre o mapa declarado, e a medição que derrubou a outra é
de `/sys`, feita em 25/08 e agora escrita como régua.

---

## O que mudou

| arquivo | o que aconteceu |
|---|---|
| `src/.../integrations/mapa_das_portas.py` | saíram `_pelo_peer`, `_pelo_desenho`, `Irma`, `SELO_DECLARADO`, `SELO_INFERIDO` e o import de `NoDeEntrada`. `irmas_de(mapa) -> dict[str, str]` |
| `src/.../app/actions/config/secao_mesa.py` | `_SEM_MAPA` passa a dizer o juízo que o produto NÃO faz sem o desenho |
| `docs/data/decisoes-dela.csv` | linha `D-O-PAR-DE-ENTRADAS-VEM-DO-SYSFS`: `escolha`, `custo` e `onde_mora` **substituídos** |
| `tests/unit/test_o_par_vem_do_desenho_dela.py` (novo) | 5 testes — a medição virada régua, e a frase de tela |
| `tests/unit/test_o_esquema_guarda_o_fato_fisico.py` | **arquivo alheio, editado** — ver a seção "Relatei em vez de editar" |

`-179 / +73` no módulo. A frente **remove** mais do que acrescenta, e é o ponto:
a segunda fonte custava um dataclass, dois selos, duas funções privadas, um
import entre módulos de `integrations/` e um bloco `noqa-acento` de seis linhas
no `__all__` — tudo para responder por zero entradas na mesa dela.

### Por que o selo saiu junto

`Irma.de_onde_sei` existia para separar duas procedências. Com **uma** fonte, e
sendo ela **fato dela**, não há segunda procedência de que desconfiar: o selo
viraria um campo com um valor só, que é o enfeite que o `de_onde_sei` existe
para não ser. A procedência não sumiu — ela deixou de ser por linha e passou a
ser da função, escrita uma vez no cabeçalho.

Se alguém precisar do termo na tela, `secao_mesa._SELO_DECLARADO` já existe e já
diz `"(você disse)"` — é a palavra desta casa e não precisa vir de
`integrations/`.

### A consequência que chega à tela

`_SEM_MAPA`, a linha de quem nunca desenhou.

**Saiu:**

> Você ainda não desenhou a sua mesa. Enquanto isso o Hefesto diz o caminho do
> sistema (3-1.1.4) em vez do número da sua entrada.

**Entrou** — `PROVISÓRIO — decisão dela`, marcado assim no código:

> Você ainda não desenhou a sua mesa. Enquanto isso o Hefesto diz o caminho do
> sistema (3-1.1.4) em vez do número da sua entrada, e não sabe quais entradas
> ficam coladas no metal — então ele não avisa quando dois receptores sem fio
> estão encostados. Não é que esteja tudo bem: ele não sabe.

A última oração é a metade que não pode cair. Sem ela, o silêncio sobre a
vizinhança é lido como aprovação — que é o juízo otimista silencioso que esta
frente existe para fechar.

**O "o que fazer" não está na frase de propósito:** ele é o botão ao lado, que
diz *"Desenhar a minha mesa"*. Repetir a instrução no texto gastaria altura por
nada.

**O preço em altura, MEDIDO** (`Gtk.OffscreenWindow`, a linha sozinha):

| estado | antes | depois |
|---|---|---|
| sem mapa nenhum | 40 px | **74 px** (+34) |
| com o mapa dela | 40 px | 40 px (intacto) |

O teto de 48 px de `test_conexoes_nao_engorda_com_o_mapa` mede o estado **com** o
mapa, então ele continua verde e não foi afrouxado. Os 34 px crescem só na tela
de quem nunca desenhou — que é exatamente quem precisa ler o preço. **Se ela
achar caro**, a saída é encurtar, não mandar para a dica: a
`D-A-ALTURA-DA-ABA-EMULACAO` já decidiu que o texto curto tem de DIZER que há
mais, e cura que mora só no tooltip é cura que ninguém acha.

---

## Qual mordida prova

**Quatro mordidas, quatro reprovações, quatro devoluções.** Todas exercidas
nesta árvore, e a árvore ficou sem commit no intervalo.

### Mordida A — o `peer` de volta em `irmas_de`

Devolvi o parâmetro `entradas`, o `SELO_INFERIDO` e o passe do `peer`:

```
E  AssertionError: a irmã tem UMA fonte, e ela é o desenho dela. Parâmetro a
   mais na assinatura é porta de entrada para leitura de sistema:
   ['mapa', 'entradas']
FAILED ...::test_a_irma_nao_aceita_leitura_de_sistema_nenhuma
1 failed, 4 passed
```

**E a mordida me corrigiu:** eu tinha escrito que um segundo teste também
reprovaria, e ele **passou** — porque `entradas` volta com `()` por padrão e
aquele teste não passa leitura nenhuma. A afirmação era falsa e saiu do
docstring. Foi o instrumento me pegando, não eu pegando o instrumento.

### Mordida A2 — o atalho que substitui o `peer`

Fiz `irmas_de` cair para `mapa.portas` quando não há face desenhada:

```
E  AssertionError: sem face desenhada não há fileira, e o peer amarraria 5 a 6
   — que são o mesmo furo, não dois vizinhos. Medido: usb2-port1
E  assert {'5': '6', '6': '5'} == {}
FAILED ...::test_o_lado_2_0_e_o_lado_3_x_declarados_separados_nao_viram_irmas
```

O par que aparece é **exatamente** o que o `peer` amarraria: os dois nós do
mesmo furo virando "colados no metal", e o motor cobrando -45 de um vizinho que
não existe.

### Mordida B — a frase de tela de antes

```
E  AssertionError: a frase de quem nunca desenhou não diz que o Hefesto ignora
   quais entradas ficam coladas — logo esconde o aviso que ele deixa de dar:
   'Você ainda não desenhou a sua mesa. Enquanto isso o Hefesto diz o caminho
   do sistema (3-1.1.4) em vez do número da sua entrada.'
```

A reprovação imprime **a frase que a tela mostra**, não o nome da variável.

### Mordida B2 — só a última oração cortada, e A RÉGUA ERA FALSA

Cortei apenas *"Não é que esteja tudo bem: ele não sabe"* e deixei o resto. **A
primeira redação desta régua PASSOU** — ela procurava `"não sabe"`, que
continuava vivo dentro de *"e não sabe quais entradas ficam coladas"*. É o
padrão que esta casa nomeou hoje: *a régua confunde a PALAVRA com o ATO*, e
desliga justamente quando alguém escreve bem.

Trocada pelo termo que só existe na oração que garante o resto, e refeita:

```
E  AssertionError: a frase não recusa a leitura otimista: sem dizer que NÃO É
   QUE ESTEJA TUDO BEM, o silêncio sobre a vizinhança é lido como aprovação —
   o juízo otimista que esta frente existe para fechar: '...'
```

### O verde, depois de devolver tudo

```
324 passed, 1 xfailed   (os 25 arquivos que citam mapa_das_portas, secao_mesa,
                         _SEM_MAPA ou irmas_de, mais o painel de decisões, o
                         portão do chamador, o do órfão e entradas_do_gabinete)
ruff check src/ tests/                              All checks passed!
validar-acentuacao.py --check-file (os 5 tocados)   rc=0
check_endereco_de_radio.py                          rc=0
check_paridade_transporte.py                        rc=0
```

Rodado depois de `git add -A` — os portões são cegos a arquivo novo.

---

## As lápides

**NENHUMA lápide fica obsoleta com esta frente**, e eu **não editei** o
`portao_a_casa_sabe_e_o_produto_nao_faz.py`. Ele passa verde na árvore com a
mudança dentro.

Duas conferências que valem estar escritas:

1. **A lápide de `mapa_das_portas.py::irmas_de` continua VERDADEIRA** — nada em
   produção chama a função; quem a consome é a G5, que não saiu. **Mas o texto
   dela tem um fato agora errado:** ele diz *"O QUE O FECHA: `mapa_da_mesa.py`
   chamar `irmas_de(mapa, entradas)`"*, e a função não recebe mais `entradas`.
   Uma linha, e o arquivo é de quem coordena.
2. **Tirar o `from ...entradas_do_gabinete import NoDeEntrada` NÃO reabre
   lápide nenhuma.** Foi a preocupação óbvia (a G3 relatou que era esse import
   que punha o módulo no grafo de produção). Conferido: `secao_exame.py` chama
   `entradas_do_gabinete.listar_entradas()` e `censo_do_gabinete.py` importa
   `NoDeEntrada, furos, listar_entradas` — o módulo continua alcançado por dois
   caminhos independentes do meu. O portão confirma.

---

## O que NÃO verifiquei

- **Nada com aparelho na mão.** A bancada não tem DualSense. A medição do
  `readlink` nos 38 `*/peer` é a de 25/08, herdada da G3 e agora escrita como
  constante de teste; **não plugei nem despluguei nada para reconferir**.
- **Que o motor julgue diferente.** Não toquei `arranjo_da_mesa.py` (é da
  G4/G5), e **ninguém ainda monta a `Mesa` do motor a partir do mapa
  declarado**. Esta frente prova que a fonte é única e honesta, e que a tela
  diz o que falta — **não** que um quadrado mudou de cor.
- **A frase nova sob o olho dela.** `PROVISÓRIO — decisão dela`. A palavra final
  sobre tela é dela (`PROVA-DE-TELA-01`), e a dona única do texto desta aba é a
  `CONFIGURACOES-O-LEXICO-01`.
- **Nenhuma foto de tela.** Não rodei `retratar_abas.py` — é de quem coordena,
  no fim. A medição de altura acima é `Gtk.OffscreenWindow`, não retrato.
- **Que o `peer` se comporte assim fora desta placa.** Aqui são 19 pares, todos
  atravessando dois hubs-raiz. Nada disso é regra do kernel que eu tenha lido no
  fonte — é o que esta bancada respondeu.
- **A suíte inteira.** Rodei só o meu escopo, como manda a ordem.

---

## Relatei em vez de editar (R1)

1. **`tests/unit/test_o_esquema_guarda_o_fato_fisico.py` — EU EDITEI, e declaro
   aqui porque não está na minha lista.** Não havia alternativa: o arquivo
   importa `SELO_INFERIDO` de `mapa_das_portas`, e sem tocá-lo a coleta da suíte
   inteira quebra. As mudanças são só nas partes de `irmas_de`:
   - o import perde `SELO_DECLARADO`, `SELO_INFERIDO` e `NoDeEntrada`;
   - `PEER_DA_BANCADA` e o ajudante `_leitura` saem daqui e viram régua própria
     em `test_o_par_vem_do_desenho_dela.py`;
   - a seção *"4. As duas fontes, e o selo de cada uma"* (três testes) sai — os
     dois primeiros medem a fonte que não existe mais, e o terceiro está
     reescrito na régua nova;
   - `irma.numero` vira o número cru em quatro asserções;
   - o cabeçalho ganha o parágrafo que aponta para a régua nova.

   **Nada fora de `irmas_de` foi tocado** — os testes de `perto`, `alto`, `nos`,
   do validador de nó e do disco estão intactos.
2. **`tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py:1452`** — a correção
   de uma linha da lápide de `irmas_de`, na seção acima.
3. **`docs/process/2026-08-25-ONDE-PARAMOS-a-tarde-de-treze-frentes.md:73-79`** —
   o item 2 de *"O que espera ELA"* termina em *"O produto já implementa as duas
   na ordem certa; o registro da razão é que precisa dela"*. A primeira metade
   caducou nesta frente: ela **decidiu**, e o produto agora implementa **uma**.
   O documento é de quem coordena.
4. **`painel.html`** — rodar `test_o_painel_encabeca_as_decisoes_dela.py`
   **regenera o arquivo** e carimba nele a branch e o commit de quem rodou. Eu o
   devolvi ao HEAD (`git checkout HEAD -- painel.html`) para não sujar a
   integração com o nome da minha branch. **Ele precisa ser regerado no `dev`
   depois do merge**, senão o painel que ela abre continua mostrando a razão
   antiga da decisão.
5. **`src/.../integrations/arranjo_da_mesa.py`** — quem lê `Entrada.par`. Não
   toquei. Segue de outra frente.

---

## O que sobrou para o próximo

1. **A G5 continua sendo o último palmo.** `irmas_de(mapa)[n]` → `Entrada.par`.
   Ficou **mais simples** do que estava: uma chamada de um argumento, sem
   leitura de sistema para orquestrar e sem selo para propagar.
2. **`PortaDeclarada.nos` perdeu o único leitor que tinha em
   `mapa_das_portas`.** O campo continua justificado por si (é o que nomeia o
   BURACO e responde com ele vazio), e o leitor declarado dele é
   `entradas_do_gabinete.furo_declarado` — que hoje **só tem chamador em teste**.
   Quem for fechar a calibração (CAL-A) fecha isso junto.
3. **`Entrada.pos` continua sem fonte** — a posição na fileira, de que o
   `_bonus_separacao` depende. Deriva do índice em `FaceDeclarada.portas`, e é
   decisão de quem montar a `Mesa`. Herdado da G3, não mexido.
4. **Se ela achar a frase longa**, encurtar preservando as duas metades: *"não
   sabe quais entradas ficam coladas"* e *"não é que esteja tudo bem"*. A régua
   `test_a_tela_diz_o_que_deixa_de_julgar_sem_o_desenho` prende as duas, e o
   docstring dela diz o que sobrevive a uma reescrita.
