---
sprint: ONDA5-01-03
estado: feita
posse:
  01-Q3:
    - src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py
    - tests/unit/test_a_aba_01_jogar_fecha_as_linhas.py
nao_toca:
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/interface/aba01.py
  - src/hefesto_dualsense4unix/interface/paginas/
  - mockup/
  - src/hefesto_dualsense4unix/app/
depois_de: [ONDA2-01-JOGAR-01, ONDA4-S10-O-TRANSPORTE-01, ONDA5-01-01, ONDA5-01-02, ONDA5-03-01, ONDA5-07-03]
---

> **ESTADO 06/09/2026: feita** — entrega em
> `docs/process/agentes/2026-09-06/ONDA5-01-03.md`.
>
> **E A §3 MEDIU MENOS DO QUE HAVIA.** Ela dizia *"esta aqui espera pela
> `ONDA5-03-01`: enquanto o pisca não existir, o passo 3 fica parado"*. O pisca
> entrou em 05/09 e **já alcançava esta caixa sozinho** — quem o acende é o
> pouso do piloto, no elemento que ela clicou, e não havia endereço a criar. O
> que faltava era outra coisa: **o gesto jogava fora a resposta da ponte**, e
> por isso a caixa piscava VERDE com o serviço parado — desmarcando 100 ms
> depois, pelo tique. O verde não faltava; ele mentia.

# 01-Q3 · DESENHO — o cadeado já está na tela, e o que falta é o verde

> **A escolha dela, 05/09/2026**, entre três opções: **"Na aba Jogar, sob Modo"**.
>
> A pergunta era *"a tela já avisa que o perfil não troca sozinho ao abrir um
> jogo, mas não oferece em lugar nenhum onde ligar ou desligar isso — em que aba
> você quer esse interruptor?"*

**MEDIDO ANTES DE ESCREVER: ela já está lá, e nesse exato lugar.** A caixa nasceu
em 04/09/2026, e a escolha dela de hoje CONFIRMA a decisão — não abre trabalho de
desenho. O que sobra desta pergunta são duas linhas, e uma delas é um fato errado
no fonte.

---

## 1. O QUE JÁ EXISTE — a caixa está ligada de ponta a ponta

| camada | onde | estado |
| --- | --- | --- |
| o desenho | `interface/aba01.py:1321-1325` — `<label class="cadeado">`, fora das duas seções do interruptor | pronto |
| a página que o produto abre | `interface/paginas/01-jogar.html:1840-1842` | **publicada** |
| a bancada | `mockup/01-jogar.html:1841` | igual |
| o rótulo e a dica | `interface/pacotes/a01_jogar.py:248-253` — palavra por palavra da janela antiga | pronto |
| o endereço prometido | `a01_jogar.DA_PAGINA`, `:43` | pronto |
| o leitor | `a01_jogar._cadeado`, `:256` — devolve `"sim"`/`""` na língua do alvo `marcado` | pronto |
| o valor no tique | `a01_jogar.py:450` — `"cadeado": _cadeado(ctx.state)` | pronto |
| o escritor | `a01_jogar.cadeado`, `:1585-1639` — `p.autoswitch_lock_set(locked=…)`, valor **absoluto** | pronto |
| a proteção | `hefesto_vivo.PERIGOSOS` (`:1539`), entrada `("01-jogar.html", "cadeado")` em `:1602` | pronto |
| a régua do clique | `a01_jogar.py:1855-1857` — declara `evento: change` e `autoswitch_lock_set(locked=True)` | pronto |

**E o lugar é o que ela escolheu**: `aba01.py:1321` põe a caixa **fora** das
seções `so-ligado` e `so-desligado` (`:1280` e `:1288`), e a razão está escrita ali:
essas duas trocam com o interruptor do Hefesto, e a troca automática de perfil
vale nas duas — dentro de uma delas, a caixa sumiria justamente no Modo Nativo.

**Nada de desenho a fazer.** Esta sprint não move um pixel.

---

## 2. O PRIMEIRO RESTO — um fato errado no fonte, e ele já caducou

O docstring do gesto fecha assim:

```
    Enquanto isso não fechar, a mordida é o desenho: a caixa vive só no
    `mockup/`, e o piloto abre o PUBLICADO.
```
— `a01_jogar.py:1634-1635`

**Era verdade quando foi escrito e não é mais**: a caixa está no publicado
(`paginas/01-jogar.html:1841`), que é o que `onde.PUBLICADO`
(`interface/onde.py:73`) aponta e o que o piloto carrega.

**Fato errado se SUBSTITUI, não se acumula.** E a substituição não é apagar a
frase: a conclusão dela continua de pé por outro motivo, que é o que tem de
ficar escrito. O `--prova-gesto` não clica esta caixa **porque ela está em
`PERIGOSOS`** — o gesto grava no disco dela (`utils/session.save_autoswitch_locked`,
por `autoswitch_lock_set`), e uma régua de clique que mudasse uma preferência
dela para provar que sabe clicar seria pior que a cobertura que ela compra. O
`hefesto_vivo.py:1590-1601` já conta esse caso inteiro, inclusive por que a régua
de escrita não o pegou sozinho.

- **A MORDIDA:** ponha a frase velha de volta.
  `test_a_aba_01_jogar_fecha_as_linhas::test_o_cadeado_esta_publicado` reprova,
  porque ela lê `paginas/01-jogar.html` e acha `data-gesto="cadeado"` lá.
  **A régua tem de ler o arquivo, não o docstring** — senão ela envelhece do
  mesmo jeito que a frase que veio corrigir.

---

## 3. O SEGUNDO RESTO — o único gesto desta aba que não diz "deu certo"

**A decisão de hoje que vale para as dez abas (03-Q4):** *o "deu certo" é o campo
piscando em VERDE por ~1,5 s, sem palavra nova na tela.*

O cadeado é o gesto desta aba que mais precisa disso, e por uma razão medida: ele
é o único cujo efeito **não aparece em lugar nenhum da tela**. Trocar de modo
acende um chip; trocar a máscara muda o cartão; o cadeado só muda um booleano no
disco, e a caixa que ela mesma acabou de clicar já está marcada pelo próprio
clique.

**O que existe hoje no lugar disso** é a volta do daemon: o alvo `marcado`
repinta a caixa a cada tique de 100 ms (`hefesto_vivo.py:114`, `TIQUE_MS = 100`) a
partir de `autoswitch_locked`, e **se a escrita não pegar a caixa volta sozinha**
(`a01_jogar.py:1625-1628`). Isso é honesto para a FALHA e mudo para o SUCESSO: a
caixa continuar marcada não distingue *"guardado"* de *"a tela ainda não voltou"*.

**O mecanismo do verde não é desta posse.** O canal de sucesso de hoje é um recado
de texto em verde, com vida de 6 s (`hefesto_vivo.py:642-648`, e o `tom` que viaja
no recado em `:697`) — **uma palavra nova na tela**, que é justamente o que a
decisão 03-Q4 tira. Quem construiu esse canal foi a
`docs/process/sprints/2026-09-04-ONDA0-P-O-PILOTO-01-a-tela-que-nao-fica-nua-e-o-canal-de-sucesso.md`,
e quem troca a forma é a **ONDA5-03-01**
(`docs/process/sprints/2026-09-05-ONDA5-03-01-o-campo-que-pisca-e-o-numero-do-voo-que-ja-o-endereca.md`),
que tem `hefesto_vivo.py` na posse dela e `interface/pacotes/` no `nao_toca` —
as duas metades se encaixam sem tocar no mesmo arquivo. **Esta aqui espera por
ela**: enquanto o pisca não existir, o passo 3 fica parado e o passo 2 fecha
sozinho.

**O que ESTA sprint faz, quando o piloto tiver o pisca:** o gesto `cadeado`
(`a01_jogar.py:1585`) passa a pedir o verde **pelo endereço que a caixa já tem**
— `data-campo="cadeado"` (`aba01.py:1323`), que está em `DA_PAGINA` (`:43`) e
portanto é endereço que a régua de cobertura já confere. Zero campo novo.

- **A MORDIDA:** arranque o pedido do verde e
  `test_o_cadeado_confirma_em_verde` reprova, provando pelo desfecho que o gesto
  devolve — e não pelo texto do código, que é a forma de instrumento falso que
  esta casa já derrubou seis vezes.
- **A SEGUNDA MORDIDA, e ela é a que importa:** faça o `autoswitch_lock_set`
  levantar. O verde **não pode acender** — o teste tem de reprovar se acender, e
  é essa metade que separa *"o produto confirmou"* de *"a tela pintou sozinha"*.

---

## 4. O QUE ESTA SPRINT NÃO FAZ

**Não põe a caixa na aba Perfis.** Era a segunda opção da pergunta e ela não a
escolheu. A razão que a decisão de 04/09 já escreveu continua valendo: a coluna
Atenção desta aba EXPLICA o cadeado por duas das seis fontes de
`painel.AVISOS_DA_TELA` — `autoswitch_lock_text` e `texto_do_cadeado_cego`
(`app/actions/jogar/painel.py:650-651`) — e esta é a única posição em que a frase
que explica e o botão que resolve ficam na mesma tela.

**Não mexe no gerador nem republica a página.** Publicar é ato dela, e não há
nada a publicar: o desenho e o publicado já batem.

**Não muda o `PERIGOSOS`.** O gesto continua fora do `--prova-gesto`, e continua
certo que esteja: ele grava preferência dela.

---

## 5. NADA SE PERDEU

1. **O valor vai ABSOLUTO, nunca como toggle** (`a01_jogar.py:1639`). O docstring
   mede as duas razões: um clique chega DUAS vezes ao ouvinte único (`click` **e**
   `change`), e dois toggles seriam um no-op — *ela clica e nada acontece*, a
   queixa dela em estado puro. O verde não pode virar desculpa para simplificar
   isto.
2. **O filtro do evento** (`:1638`): só o `change` escreve, para o disco dela
   receber UMA gravação por clique. Um clique sem `evento` continua valendo.
3. **A verdade volta do daemon.** A caixa é repintada pelo alvo `marcado` a cada
   tique e volta sozinha se a escrita não pegar. **O verde entra ao lado disso,
   nunca no lugar** — uma tela que pisca verde e não relê é uma tela que finge ter
   guardado.
4. **Sem daemon, a caixa DESMARCA** (`_cadeado`, `:256-270`): um checkbox tem dois
   estados e o produto tem três, e marcar sobre estado que ninguém leu seria a
   tela afirmando uma escolha que ela não fez.
5. **O rótulo e a dica são da janela antiga**, palavra por palavra
   (`:248-253`). Texto que ela já leu não é texto novo de tela, e por isso não
   volta para o olho dela.
6. **A caixa fica FORA das duas seções do interruptor** (`aba01.py:1321`). É o que
   a faz continuar existindo no Modo Nativo, onde o cadeado continua valendo.
