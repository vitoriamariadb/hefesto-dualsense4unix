---
sprint: ONDA-CONEXOES-03
posse:
  A3:
    - src/hefesto_dualsense4unix/app/actions/config/secao_exame.py
cria:
  - tests/unit/test_conexoes_o_exame_em_tres_colunas.py
bancada: false
depois_de:
  - ONDA-CONEXOES-02
  - LEVA-4  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
  - ORDEM-DE-SERVICO-01  # sprint antiga ainda aberta: a onda vem depois, em série (R5)
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/config/secao_mesa.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_controles.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_orcamento.py
  - src/hefesto_dualsense4unix/integrations/exame_da_mesa.py
  - src/hefesto_dualsense4unix/integrations/ordens_da_mesa.py
---

# ONDA CONEXÕES · 03 — o exame em duas colunas

**O defeito, numa frase:** quem lê o `[WARN]` encontra o conserto trezentos
pixels abaixo, e a explicação de cada ordem — três linhas por card — ocupa a
altura que fez a aba não caber.

Fonte: `layout/_ferramentas/aba08.py:187-251`;
`docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 8, *"O que fica na
tela e o que vira dica"*. Decisão: `D-TUDO-QUE-EXPLICA-VIRA-DICA`.

**Esta sprint depende da ONDA-CONEXOES-02**, que tira as duas perguntas de rádio
da seção da mesa. Entre uma e outra elas não estão em tela nenhuma.

## O que entrega

O quadro "Está tudo certo?" passa a ter **três colunas, e cada uma responde uma
pergunta**:

| coluna | o que fica | de onde vem |
|---|---|---|
| **o que eu vi** | as cinco linhas do exame, com selo e glifo, mais `[Examinar de novo]` e `[Ver as ordens ignoradas]` | já existe — `secao_exame.py:268`, `:530` |
| **o que fazer** | os cards de ordem: imperativo, receita (ONDA-CONEXOES-04) e ganho, com `[Já movi — reexaminar]` e `[Ignorar]` | já existe — `:273`, `:677`, `:731` |

> **A TERCEIRA COLUNA SAIU — decisão dela, 29/08/2026**
> (`D-AS-PERGUNTAS-DA-SALA-MORAM-NO-MAPEAR-ENTRADAS`).
> *"Ficam na pop-up, e eu corrijo a sprint."* As duas perguntas de rádio — a
> altura do dongle e se há gente entre ele e o sofá — moram **dentro do
> "Mapear Entradas"**, a janela que desenha o gabinete. A razão é o assunto,
> não o espaço: quem está dizendo onde cada aparelho mora é quem sabe se o
> dongle fica acima da cabeça.
>
> **O exame fica em DUAS colunas**, e a sprint economiza os 110px que a
> terceira custava — a aba já esconde 286px de miolo.
>
> **A procedência importa, e é a lição:** o mockup já as tinha movido em
> 27/08, mas quem decidira era um **comentário de gerador**, com razão de
> ALTURA. Ninguém tinha perguntado a ela, e esta sprint continuou pedindo a
> coluna. O cético das pop-ups achou a divergência medindo o mockup contra a
> fila — e a divergência viveu dois dias entre a especificação aprovada e o
> trabalho enfileirado.

E mais três coisas:

* **o carimbo de idade** no cabeçalho do quadro — "examinado há 3 minutos".
  Hoje não existe: a tela não diz se o selo é de agora ou de meia hora atrás, e
  selo velho lido como fresco é a mesma família de defeito que
  `scripts/doctor.sh:1586-1590` já cobrou desta casa duas vezes;
* **`o_que_eu_vi` e `por_que_importa` saem da tela e vão para o "?"**. Fica
  visível o **imperativo** e o **ganho esperado** — e o ganho fica **sempre**,
  inclusive quando confessa que não foi medido, que é a regra escrita no
  cabeçalho de `secao_exame.py`;
* **o `[Examinar de novo]` absorve o "Reexaminar a mesa"** que a
  ONDA-CONEXOES-02 tirou: ao refazer o exame, releia também o barramento.

**O selo continua vindo de `exame_da_mesa.veredito()`**, nunca de conta feita
aqui. Essa é regra, não estilo — a casa pagou duas vezes em agosto
(`6c86e295`, `c3d3518f`) por uma tela que mostrava verde em cima de vermelho.

## Como se prova — o teste que morde

`tests/unit/test_conexoes_o_exame_em_tres_colunas.py`:

* montada com um exame de dublê que devolve um `[WARN]` com ordem, a seção
  produz **as três colunas**, e o card da ordem e a linha `[WARN]` ficam na
  **mesma faixa vertical** (a diferença de `y` entre os dois é menor que a
  altura de uma linha);
* as frases de `o_que_eu_vi` e `por_que_importa` **não aparecem como texto de
  widget** — aparecem em `get_tooltip_markup`. O imperativo e o ganho aparecem
  como texto;
* o carimbo de idade existe e **muda** quando o relógio injetado avança: com o
  exame carimbado há 3 min a frase difere da de 1 h. Relógio é injetado, nunca
  lido da máquina (`RELOGIO-NAO-E-ASSERCAO-01`);
* as duas perguntas de rádio respondem aqui, e gravam nas **mesmas chaves**
  (`altura_da_antena`, `linha_de_visada`);
* um exame **sem** ordem nenhuma monta as três colunas do mesmo jeito — coluna
  do meio vazia não pode derrubar a seção.

**A mordida:** empilhe as colunas de volta (uma caixa vertical) e veja a
asserção de faixa vertical reprovar; devolva as duas frases ao corpo do card e
veja a de tooltip reprovar. Cole as duas saídas.

## O que é dela decidir

1. **O carimbo de idade tem palavra dela em outra aba**: *"Isso sai. Isso tá na
   aba Jogar"* (`layout/_ferramentas/CORRECOES-DELA.md`, aba Perfis). Ali
   ela mandou tirar o carimbo de um perfil; aqui o carimbo é do EXAME, e é ela
   quem confirma que a distinção vale.
2. **A prova de tela.** Nada disto fecha sem foto antes e depois e a palavra
   dela (`PROVA-DE-TELA-01`). Aprovar o mockup não é aprovar a tela GTK.

## O QUE ELA QUESTIONOU DEPOIS, e o que a medição achou (27/08/2026, à noite)

Ela marcou três coisas nesta aba e perguntou se valia manter. Medido antes de
responder:

### AS DUAS PERGUNTAS DE RÁDIO — mudam UMA FRASE, não o veredito

*"O dongle fica acima da cabeça?"* e *"Tem gente entre o dongle e o sofá?"*

**Medido em `integrations/exame_da_mesa.py:519-540`:** os dois ramos — respondeu
e não respondeu — devolvem `estado=ESTADO_ATENCAO`, o MESMO. Só a `cura` muda.
E a cura de quem não respondeu é:

> *"declare a altura da antena e a linha de visada para o exame explicar o
> alcance em vez de só medi-lo, ou mude um dos dois aparelhos para uma porta
> mais longe."*

Ou seja: o conselho para quem não respondeu é **responder** — e quem responde
recebe o mesmo conselho, menos essa frase. Duas listas suspensas que pedem
informação para devolver o mesmo diagnóstico.

**DECIDIDO POR ELA em 27/08/2026, à noite: "PASSAM."** As respostas passam a
**mudar o veredito**, não a frase de conselho. As perguntas ficam na tela, e
ganham o lugar que hoje elas fingem ter.

O que isso exige de quem executar:

1. **A altura da antena e a linha de visada entram no juízo do alcance.** Hoje
   `exame_da_mesa.py:519` só olha se foram declaradas para escolher o texto da
   cura; passam a ser entrada da decisão.
2. **A linha muda de estado quando a resposta explica o problema.** Se as portas
   estão coladas MAS o dongle está alto e sem gente na frente, o alcance pode
   não estar comprometido — e a linha não pode continuar dizendo `ATENÇÃO` como
   se nada tivesse sido respondido. O inverso também vale: dongle atrás do
   gabinete com gente no caminho **agrava**, e isso hoje não aparece em lugar
   nenhum.
3. **A tela tem de dizer que a resposta pesou.** Sem isso, quem responde não
   descobre que valeu a pena — e é o que faz uma pergunta parecer questionário.
4. **Quem não respondeu continua com um veredito honesto**, e a cura continua
   pedindo a resposta. O que muda é que agora responder tem consequência.

**A régua que prova:** o mesmo arranjo de portas, com as duas respostas
diferentes, tem de produzir **vereditos diferentes**. Se as duas execuções
devolverem o mesmo `estado`, a cura não entrou — é o teste que morde.

### "EXAMINAR DE NOVO" — o botão não é o problema

O exame tem carimbo de idade ("examinado há 3 minutos"). Duas leituras, e elas
levam a lugares opostos:

- se o exame **reexamina sozinho** quando o arranjo muda, o botão é um refresh
  manual de coisa viva — sai;
- se ele **não reexamina**, o defeito não é o botão: é o exame envelhecer em
  silêncio. Aí o que falta é ele se refazer, e o carimbo passa a ser prova de
  que está fresco, não desculpa por estar velho.

**Meça qual dos dois é antes de mexer.** O carimbo já está na tela; o que ele
significa é que ninguém decidiu.

### "ENSINAR AS MINHAS ENTRADAS" — é passo 2, não irmão

Ele só funciona depois de *"Desenhar a minha mesa"* ter rodado — sem o desenho
não há entrada numerada para ensinar. São dois botões de UM fluxo, lado a lado,
com a mesma aparência e sem dizer a ordem.

O segundo vira o passo seguinte do primeiro: nasce depois que a mesa foi
desenhada, e não antes. Quem nunca desenhou vê um botão, não dois.
