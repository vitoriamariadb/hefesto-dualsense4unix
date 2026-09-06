---
sprint: ONDA5-02-02
posse:
  02-Q9:
    - src/hefesto_dualsense4unix/interface/aba02.py
    - mockup/02-controles.html
  02-Q6:
    - src/hefesto_dualsense4unix/interface/aba02.py
nao_toca:
  - mockup/DIVERGENCIAS.md
  - src/hefesto_dualsense4unix/interface/pacotes/a02_controles.py
  - src/hefesto_dualsense4unix/interface/paginas/02-controles.html
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/interface/regua_do_mockup.py
  - src/hefesto_dualsense4unix/interface/mesa_viva.py
  - scripts/check_o_desenho_aprovado.py
depois_de: [A-PORTA-DA-ABA-CONTROLES-01, ONDA2-02-CONTROLES-01]
---

# DESENHO · ONDA5-02-02 — o ♪ em duas cores, e as duas dicas que mandam para uma janela sem lançador

**Você é dono de UM arquivo de código** — o gerador `interface/aba02.py` — e da
bancada que ele emite. A publicação **não é sua**: ela é ato dela
(`PROVA-DE-TELA-01`). A frente irmã `ONDA5-02-01` mexe no daemon e no pacote e
não toca em nada seu: **as duas correm ao mesmo tempo, sem espera.**

---

## 1. AS DECISÕES DELA, VERBATIM

### 02-Q9 — onde se vê o alto-falante mudo

Ela marcou **"O botão de som acende"** e digitou por cima:

> *"Com cor diferente"*

E na segunda volta, hoje, fechou o que "cor diferente" quer dizer:

> **borda VERDE se ligado, ÂMBAR se desligado**

**São DOIS estados pintados, não um aceso.** A opção que ela marcou dizia "o
próprio botão que causa o estado fica aceso quando o alto-falante está mudo" —
um sinal só, no mudo. O esclarecimento de hoje MANDA: o ♪ diz as duas coisas.

### 02-Q6 — devolver o volume do alto-falante

> **"Fica fora, com aviso"**

Sem botão novo no cartão. O aviso é a dica do ♪ — e o efeito que ela leu dizia,
com todas as letras, que *"a dica do botão de som passa a dizer que a devolução
se faz pela janela do aplicativo completo"*.

### 02-Q10 — o clique do analógico

> **"Continua com colchetes"**

**Zero trabalho nesta frente e zero no produto** — está feito e publicado. O que
sobrou é uma linha de comentário no pacote, e ela é da `ONDA5-02-01`, que é dona
daquele arquivo.

---

## 2. O QUE SE MEDIU

### 2.1 O ♪ acende, e acende de VERMELHO no estado errado

```
  .mudo-i{width:22px;height:22px;…border:1px solid var(--border-forte);
          background:var(--panel);color:var(--texto-mudo);…}
  .mudo-i.on{border-color:var(--red);color:var(--red);background:rgba(255,85,85,.1)}
```
— `src/hefesto_dualsense4unix/interface/aba02.py:766-769`

```html
<button class="mudo-i{alto_on}" data-gesto="mudo" data-mudo="alto-falante"
        data-campo="alto-mudo" data-hef-alvo="classe" data-hef-classe="on"
        data-hef-quando="{SELO_MUDO}" title="{DICA_ALTO_MUDO}">♪</button>
```
— `aba02.py:1880`, com `alto_on` em `:1657`

**Hoje são dois estados e meio, e o meio é o problema:** MUDO pinta vermelho,
ATIVO fica com a mesma cara de "não sei". O `--red` é a cor da falha nesta casa
— o alto-falante calado por escolha dela não é falha, e o âmbar que ela pediu é
exatamente a palavra que esta janela já usa para o meio-termo (é a razão escrita
para o `--orange` da marca de degradação, `aba02.py:824-829`).

### 2.2 O campo JÁ TEM OS TRÊS ESTADOS — e é por isso que a cura cabe

```python
                "alto-mudo": mesa_viva.selo_do_mic(
                    bool(sp_lido and sp_lido[1]),
                    sp_lido is not None and sp_lido[1] is not None,
                ),
```
— `src/hefesto_dualsense4unix/interface/pacotes/a02_controles.py:2005-2008`

`selo_do_mic` devolve `MUDO` · `ATIVO` · `—`
(`src/hefesto_dualsense4unix/interface/mesa_viva.py:450-475`). **O pacote já
manda as três palavras a cada tique; o botão só sabe olhar uma.** Nada muda no
pacote — a cura inteira é do desenho, que é o que faz esta frente caber num
arquivo.

### 2.3 O alvo `classe` não sabe duas cores, e o alvo `atributo` sabe três

O alvo `classe` acende UMA classe no valor que casa com `data-hef-quando`
(`src/hefesto_dualsense4unix/interface/hefesto_vivo.py:477-480`), e
**`data-hef-alvo` é UM por elemento** — a razão está escrita no próprio piloto
(`hefesto_vivo.py:455-459`) e repetida em `linha_de_volume`
(`aba02.py:1510-1513`), que foi obrigada a pendurar a razão do cinza na LINHA
porque o ♪ já gastou o seu único par alvo/campo.

O alvo `atributo` responde às três palavras com uma linha:

```js
      if(vazio || t === '—'){ el.removeAttribute(nome); }
      else { el.setAttribute(nome, t); }
```
— `hefesto_vivo.py:600-601`

**`—` APAGA o atributo**, e o CSS sem regra casada devolve o botão ao neutro —
que é a resposta certa para "ninguém leu o alto-falante deste controle". Não é
um estado a mais para desenhar: é o desenho de hoje, quando não se sabe.

E o caminho de volta já é medido dos dois lados: `regua_do_mockup.py:377-397` e
`regua_do_mockup.py:888-892` leem o atributo pelo nome que `data-hef-atributo` diz, e o
`LER_CAMPOS` do piloto lê o mesmo com o mesmo vazio por omissão
(`hefesto_vivo.py:1486`). **Nenhum arquivo fora deste precisa mudar** — foi
conferido, e é a diferença entre esta cura e a que teria de pedir um alvo novo.

`data-som` passa a guarda de nome do piloto (`hefesto_vivo.py:280-285`: entra
todo `data-*` que não seja `data-hef*` nem vocabulário de endereço,
`hefesto_vivo.py:277-278`) — e **não** está na lista de invisíveis do portão do desenho
(`scripts/check_o_desenho_aprovado.py:102-127`). Isso está certo e é de
propósito: um atributo de que o CSS pinta **é** desenho, e o portão tem de
cobrar a passagem pela bancada.

### 2.4 O 🎙 tem uma cor CONGELADA na página publicada

```html
<button class="mudo-i on" data-gesto="mudo" data-mudo="microfone" title="…">🎙</button>
```
— `src/hefesto_dualsense4unix/interface/paginas/02-controles.html:2528`
(o segundo cartão), gerado por `aba02.py:1649` e `:1838`

**O 🎙 não tem `data-campo`.** O piloto nunca o visita, logo esse vermelho é o
que o gerador escreveu uma vez e vale para sempre: na tela viva dela, o
microfone do segundo cartão fica aceso de vermelho independentemente do
aparelho. É a mesma forma que este arquivo já nomeia no selo do microfone:
*"escrevê-los à mão nos dois lugares era como a cor congelou"*
(`aba02.py:1644-1647`).

**O estado vivo do 🎙 já existe e é o selo ao lado** (`mic-selo`, composto das
quatro faces, `a02_controles.py:1893`). Uma borda viva no 🎙 seria um SEGUNDO
sinal para o mesmo fato — que é exatamente o que a decisão [01] desta aba
recusou em 04/09 (*"não faça o pingo no cabeçalho"*). **A cura é tirar a
mentira, não acrescentar um sinal.**

### 2.5 As duas dicas mandam para uma janela que ninguém abre

```python
DICA_MIC_MUDO = (… "Esta tela não devolve o comando: a volta é "
                 "pela janela do aplicativo ou reiniciando o Hefesto.")
```
— `aba02.py:1459-1462`

**Essa janela não tem lançador desde 01/09/2026**, por decisão dela:

> *"a versão antiga não segue disponivel, vai gerar confusão nos agentes. So a <!-- noqa-acento: citação literal dela -->
> nova esta disponivel e deve ser integrada."* <!-- noqa-acento: citação literal dela -->
> — `pyproject.toml:100-102`, e o `-gui` aponta para a interface nova em `:107`

É o **mesmo defeito que este bloco de comentário já nomeou uma vez**
(`aba02.py:1451-1458`): a dica antiga mandava clicar num "Liberar" que tinha
saído da tela, e *"uma dica que manda a pessoa procurar um botão ausente é o
mesmo defeito que esta aba persegue"*. Quatro dias depois, a dica gêmea manda
procurar uma JANELA ausente.

```python
DICA_ALTO_MUDO = (… "o controle não o devolve, e "
                  "esta tela não tem como largá-lo de volta.")
```
— `aba02.py:1475-1478`

Verdadeiro sobre esta tela, e **beco sem saída**: a devolução EXISTE, e em dois
lugares medidos —

| onde | o quê |
| --- | --- |
| IPC | `speaker.set {release: true}` → `_speaker_release`, `daemon/ipc_handlers.py:5613-5630` |
| linha de comando | `speaker release`, `cli/cmd_speaker.py:49` e `:182-183`; a porta é `cli/app.py:255-289`, com `--uniq` |
| gêmeo do 🎙 | `mic release` → `mic.set {muted: null}`, `cli/cmd_mic.py:76-80`, porta em `cli/app.py:217-229` |
| janela GTK | o botão "Soltar" (`app/widgets/controller_card.py:4513-4532`, rótulo em `:481-488`) — **sem lançador** |

**A opção que eu ofereci a ela estava meio errada:** ela escolheu "fica fora,
com aviso" lendo que o aviso apontaria para a janela do aplicativo completo, e
essa janela não abre mais. A decisão dela fica de pé sem uma vírgula — o que
muda é para ONDE o aviso aponta, e agora ele aponta para um caminho que existe.

---

## 3. O TRABALHO, EM CINCO PASSOS

### Passo 1 — o ♪ troca a classe pelo atributo

`aba02.py:1880`. O botão passa de
`data-hef-alvo="classe" data-hef-classe="on" data-hef-quando="{SELO_MUDO}"` para
`data-hef-alvo="atributo" data-hef-atributo="data-som"`. O `data-campo` continua
`alto-mudo` e o `title` continua o mesmo — **um endereço, um alvo**.

O `alto_on` de `aba02.py:1657` vira o `data-som` estático da cena da bancada,
pelo mesmo dono das palavras que o pacote emite. Nada de literal `"MUDO"` digitado no
gerador: `SELO_MUDO`/`SELO_ATIVO` já existem em `aba02.py:1396-1397` e saem de
`mesa_viva.selo_do_mic`.

**A MORDIDA:** devolva o alvo `classe` e a régua nova (§4) reprova com a borda
do ♪ ATIVO igual à do ♪ sem leitura — *a tela em repouso não distingue "está
tocando" de "ninguém leu"*.

### Passo 2 — as duas cores, e o neutro que sobra

`aba02.py:766-769`. Entram duas regras e sai uma:

```
  .mudo-i[data-som="ATIVO"]{border-color:var(--green);color:var(--green)}
  .mudo-i[data-som="MUDO"]{border-color:var(--orange);color:var(--orange);
                           background:rgba(255,184,108,.1)}
```

As duas variáveis já estão na folha desta página
(`--green:#50fa7b`, `--orange:#ffb86c`, `interface/paginas/02-controles.html:34`)
— **nenhum hexadecimal novo entra no CSS.** Sem `data-som` o botão fica com o
`.mudo-i` de base, que é o cinza de "não sei".

**O CINZA DA RAZÃO CONTINUA VENCENDO, por especificidade e não por ordem:**
`.vol[data-porque] .mudo-i` (`aba02.py:795-797`) tem (0,2,1) contra os (0,2,0)
das regras novas. Um botão que o produto vai recusar não pode aparecer verde.
**Confira isso na foto, não na conta.**

**A MORDIDA:** troque o `--orange` da regra do MUDO por `--green` e a régua
reprova dizendo que os dois estados do ♪ pintam a mesma cor.

### Passo 3 — a mentira vermelha do 🎙 sai, e a regra órfã vai junto

`aba02.py:1649` e `:1838`: o `mic_on` sai. O 🎙 fica neutro nos dois cartões, e
quem diz o estado do microfone continua sendo o selo ao lado, que é vivo.

Com o `alto_on` (passo 1) e o `mic_on` fora, **`.mudo-i.on` de `aba02.py:769`
perde o último escritor e sai também**. É a regra que este arquivo já aplicou uma vez,
por escrito, quando o `.solta` saiu: *"CSS de elemento que ninguém mais escreve
é promessa esperando alguém tropeçar nela"* (`aba02.py:855-859`).

**A MORDIDA:** devolva o `mic_on` e a régua reprova achando um botão de
microfone pintado num cartão cujo selo diz outra coisa.

### Passo 4 — a guarda do próprio gerador aprende o alvo novo

`aba02.py:2924-2926` **vai reprovar no passo 1**, e é assim que tem de ser:

```python
    exigir(all('data-hef-alvo="classe"' in t for t in alvos_do_mudo),
           "o `alto-mudo` perdeu o alvo `classe`: a pintura escreveria a "
           "palavra MUDO dentro do botão, no lugar do glifo ♪")
```

Ela troca de alvo e **não afrouxa**: o estrago que ela impede — a palavra `MUDO`
escrita por cima do ♪ — é o mesmo por qualquer caminho, e um `exigir` sem
`data-hef-atributo="data-som"` deixaria a porta aberta pelo lado novo. A guarda
do endereço (`aba02.py:2921-2923`) fica intacta.

**A MORDIDA:** apague o `data-hef-atributo` do botão e a guarda tem de reprovar
na própria geração, antes de qualquer teste.

### Passo 5 — as duas dicas passam a apontar para onde há saída

`aba02.py:1459-1462` e `:1475-1478`. As duas dizem o mesmo preço de hoje e
trocam o destino:

* o 🎙 deixa de mandar para "a janela do aplicativo" e passa a nomear
  `hefesto-dualsense4unix mic release`, que é o que devolve o registrador ao
  kernel e faz o botão do plástico voltar a valer;
* o ♪ deixa de terminar em beco e passa a nomear
  `hefesto-dualsense4unix speaker release`, que devolve **o controle, não o
  valor** — o firmware fica com o último número que mandamos, e isso vai dito,
  porque é a diferença que a própria linha de comando escreve
  (`cli/cmd_speaker.py:22-24`).

**"Reiniciando o Hefesto" fica**, no 🎙: continua verdade.

**Nenhuma frase nova nasce sobre o que não foi medido**, e nenhuma promete botão
nesta tela — a decisão 02-Q6 dela é essa, e ela não muda.

**A MORDIDA:** devolva o texto velho e
`test_a_dica_do_som_nao_manda_para_janela_nenhuma` reprova achando a palavra
`janela` nas duas dicas — e reprova de novo se a saída nomeada não existir entre
os verbos que a linha de comando aceita (`cli/cmd_speaker.py:49` e
`cli/cmd_mic.py:76-80`, **lidos**, nunca digitados na régua).

---

## 4. A RÉGUA, E ELA LÊ A TELA

A casa dela é `tests/unit/test_a_aba_02_controles_fecha_as_linhas.py`, que abre
a página da bancada no Chrome do sistema (headless) e pergunta ao motor o que
ele DESENHA. O molde são duas réguas de lá — o botão de som que apaga e ainda
assim responde (`tests/unit/test_a_aba_02_controles_fecha_as_linhas.py:703-737`)
e o casco fora com a luz viva dentro
(`tests/unit/test_a_aba_02_controles_fecha_as_linhas.py:750-769`).

**As cores não se digitam.** A régua lê `--green` e `--orange` da MESMA página e
compara com o `borderTopColor` computado do ♪ nos três estados
(`data-som="ATIVO"` · `"MUDO"` · sem atributo). Uma régua com `#50fa7b` escrito
dentro mede o teste, não o produto — é a lição das onze réguas de 26/08 que
*digitavam o que deviam ler*.

Os quatro casos, e nenhum é opinião:

| cena | o que a régua exige |
| --- | --- |
| `data-som="ATIVO"` | borda = o `--green` da página |
| `data-som="MUDO"` | borda = o `--orange` da página, e ≠ do ATIVO |
| sem `data-som` | borda = a do `.mudo-i` de base, ≠ das duas |
| `.vol[data-porque]` + `data-som="ATIVO"` | borda = a do cinza, e ≠ do `--green` |

---

## 5. NADA SE PERDEU

1. **O ♪ continua clicável quando está cinza.** A D-03 dela é essa
   (*"apagado e ainda assim responde"*), e o `disabled` continua fora
   (`aba02.py:777` segue declarado só para quem ainda o use).
2. **O `?` da razão continua seguindo o mesmo atributo do cinza**
   (`aba02.py:813`) — nada nesta frente toca o `data-porque`.
3. **O selo ATIVO/MUDO do microfone fica**, composto das quatro faces. É ele que
   o passo 3 preserva ao tirar a borda congelada.
4. **O endereço `alto-mudo` fica**, com o mesmo nome e o mesmo dono da palavra.
   Muda o alvo, não o endereço — e o pacote não é tocado.
5. **O preço dos dois botões continua escrito.** As dicas ficam com o mesmo
   conteúdo de verdade; muda o destino da saída.
6. **O `[L3]`/`[R3]`** continua na tela: 02-Q10, e ela mandou não mexer.
7. **Nada é publicado.** O desenho vai para `mockup/02-controles.html`, com a
   seção declarada em `mockup/DIVERGENCIAS.md` — que hoje está vazia
   (`<!-- Nenhuma aba em trabalho -->`) e passa a ter a `## 02-controles.html`.
   A publicação é ato dela.

---

## 6. O QUE ESTA SPRINT RELATA E NÃO RESOLVE

**O verde do ♪ e o verde do "deu certo" são o MESMO `--green`.** A decisão
03-Q4 de hoje diz que a confirmação de um clique é *o campo piscando em VERDE
por ~1,5 s, sem palavra nova na tela* — e o campo do ♪ é o próprio botão.

**A decisão que esta frente toma, e registra:** o ♪ **não recebe o pisca**. A
mudança da borda de âmbar para verde É o recibo — ela acontece no tique
seguinte, é permanente, e um pisca por cima seria um segundo sinal para o mesmo
fato, que é o que a decisão [01] desta aba já recusou uma vez. Onde o pisca
continua fazendo falta nesta aba é nos campos que mudam número sem mudar cara (o
volume dos dois deslizantes), e esses não são desta frente.

**Quem construir o pisca precisa saber disto** — se ele nascer aplicado a todo
`data-campo` de gesto, ele cai no ♪ sozinho. Relatado à frente do piloto; o
arquivo é `nao_toca` aqui.

---

## 7. A PROVA DE TELA — obrigatória, e é sua

1. **A FOTO**, antes e depois, `--oculta` sempre. Ela tem UMA tela.
2. **O CLIQUE** no ♪ de um cartão, com a resposta mostrada: âmbar → verde e de
   volta. Botão que você mudou e nunca clicou não está entregue.
3. **A MORDIDA** colada, nos dois estados (reprovando e passando).

**A JANELA NÃO NASCE NA TELA DELA.** `Gtk.OffscreenWindow`, Chrome headless,
`--oculta` — e se for inevitável, ela nasce no workspace `OS`.

**E a régua tem de viver no TEMPO.** Uma que roda o tique uma vez mede um
instante: o ♪ tem de continuar certo depois de o pacote emitir `—`, `ATIVO` e
`MUDO` em tiques seguidos, que é o caminho de um controle que entra na mesa,
recebe volume e é calado.
