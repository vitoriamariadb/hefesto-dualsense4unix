# EXTERNOS-NO-FRAME — o controle que o Hefesto só vê entra na grade dos assentos

**06/09/2026.** A EXTERNOS-01 (`2754b47c`) pôs o Nintendo Pro e o 8BitDo num
BLOCO À PARTE, embaixo dos quatro assentos, na aba 01 e na aba 08 — e perguntou
a ela, com duas maquetes ASCII na mão: bloco à parte, ou no MESMO frame dos
assentos, como a janela GTK fazia?

**Ela escolheu o mesmo frame.** E disse, junto da escolha: *"não temos que ter o
termo mesa na interface"*. <!-- noqa-acento: citação literal dela -->

Esta sprint é a resposta, e ela é de LUGAR — o cartão do externo já tinha a
forma certa desde a EXTERNOS-01; o que muda é onde ele nasce.

---

## O que mudou

### 1. O cartão do externo virou item da MESMA grade dos assentos (aba 01)

`src/hefesto_dualsense4unix/interface/aba01.py`

O endereço `data-campo="externos"` saiu de uma `.ressalva` embaixo da grade e
entrou **dentro** do `<div class="pecas">`, que é a grade dos quatro assentos.

Quem faz os cartões virarem itens da grade sem inventar um segundo endereço é a
**`.ext-vaga`**, e ela é `display:contents`: o piloto continua com **um**
elemento de pé para reescrever a cada tique (`data-hef-alvo="html"`), e esse
elemento some da caixa, entregando os filhos como itens da grade.

Medido no Chrome e **no WebKitGTK**, com dois externos injetados pelo pacote:

| | assentos | externos |
| --- | --- | --- |
| Chrome | `t=404`, `l=404 / 684 / 964 / 1243`, `w=273` | `t=540`, `l=404 / 684`, `w=273` |
| WebKitGTK (o motor dela) | `t=404`, `l=404 / 688 / 971 / 1255`, `w=277` | `t=540`, `l=404 / 688`, `w=277` |

Mesmas trilhas de coluna, mesma largura, segunda fileira da **mesma** grade.

**Em repouso a cena que ela aprovou não muda um pixel**: a vaga mede **0 px** nos
dois motores, e as fotos de antes e depois do estado parado são **byte-idênticas**
(`md5 db1c2754…` na 01, `7cf09d27…` na 08).

O `<i class="nada">` sai por `display:none`, e **não** pelo `:empty`/`:has(.nada)`
da `.ressalva`: sob `display:contents` um `<i>` vazio ainda seria um item da
grade, e abriria uma segunda fileira de altura zero com os 7 px de vão.

### 2. A linha do externo virou linha do MESMO acordeão (aba 08)

`src/hefesto_dualsense4unix/interface/aba08.py`

`data-campo="externos-lista"` saiu da ressalva debaixo do `.gc` e entrou dentro
dele. A coluna do nome bebe do **mesmo** `--larg-nome` das quatro linhas de cima
— um número, um lugar —, e medido: os seis nomes caem em `x=420` com `220 px`,
as seis linhas em `l=405`, `w=1110`.

### 3. Quem o distingue é a MARCA, como a janela GTK fazia

O assento diz `Sony • Player 1`; o externo diz `Controle 3 — 8BitDo`. A palavra
vem de `external_controllers.brand_of` por dentro de `_format_external_title` —
**nenhuma marca é digitada** nos dois pacotes nem nos dois geradores, e há régua
que reprova a segunda grafia.

As duas marcas chegam por caminhos diferentes, e a régua prova os dois:

* **8BitDo** pelo **OUI do MAC** (`e4:17:d8`), que é o único sinal capaz de
  desmentir o VID que um clone em modo DualShock4 mente;
* **Nintendo** pelo **VID `057e`**, num Pro Controller **por cabo** — sem `uniq`
  não há OUI. *Por rádio com o OUI da 8BitDo ele sairia "8BitDo", e isso não é
  defeito: é `brand_of` funcionando.*

O segundo sinal é a **borda tracejada**, que é o vocabulário que estas duas
páginas já usam para *"isto não é um ajuste seu"* (`.degrau.sem-dono` na 01,
`.renomeia` na 08). Nada de `opacity`, pela razão já medida nas duas páginas: a
opacidade mora no ancestral e toda régua de contraste que lê `color` fica cega.

E a altura vem de graça: item de grade estica. É a mesma lei que o card da
janela GTK pagava à mão (`app/widgets/external_card.py`, §1: *"Todos os cards
têm a MESMA altura"*).

### 4. O cabeçalho da seção morreu com a seção

`a01_jogar.EXTERNOS_TITULO` (*"Ligados, e o Hefesto só vê"*) **saiu**, e não por
gosto: ele existia porque os cards vinham em bloco. Dentro de uma grade de quatro
colunas, um cabeçalho ou vira um quinto item, ou vira uma faixa de largura
inteira — **que é a faixa à parte de volta, com outro nome**.

**Nenhuma informação se perdeu:** a frase que ele promovia a cabeçalho é a que
`home_actions._format_external_subtitle` já escreve em CADA cartão — *"o Hefesto
só vê"* —, uma vez por aparelho. O cabeçalho era a cópia; o dono ficou.

### 5. A palavra "mesa" — conferida, e ela não está lá

`interface/olhar.py --palavra mesa` sobre a bancada: **0 ocorrências visíveis nas
dez abas**. E uma varredura própria de `title` / `aria-label` / `placeholder` /
`alt` no miolo das duas abas desta sprint (fora comentário e fora a legenda):
**0**. Nada a curar — o bloco dos assentos já estava limpo.

### 6. O que entrou de régua

* `tests/unit/test_o_externo_entra_no_frame_dos_assentos.py` — **13 provas**;
* três `exigir` novos em `aba01.py` e três `_exigir` novos em `aba08.py`, com
  `_dentro_da_grade_dos_assentos` / `_dentro_do_acordeao`: a fronteira se **conta**
  por `div` aberto e fechado, e não se adivinha por recuo. Um `split` no primeiro
  `</div>` pararia dentro do primeiro cartão — e a régua ficaria vermelha sobre a
  maquete CERTA, que é o pior dos dois erros.

**Nada foi publicado.** `interface/paginas/` não foi tocado: `--publicar` é ato
dela, e ela já disse que quer olhar antes.

---

## Qual mordida prova

**Três mordidas, e cada uma derruba uma metade diferente.**

**A — a vaga sai da grade (aba 01).** Devolvi o endereço para depois do `</div>`
da `.pecas` — que é, letra por letra, a maquete da EXTERNOS-01:

```
ERRO em 01-jogar — decisão dela desfeita:
  - o bloco dos externos saiu de dentro da grade dos assentos — ela escolheu o
    MESMO frame em 06/09/2026, e uma faixa à parte é a maquete que ela recusou
FAILED …::test_o_endereco_da_aba01_mora_dentro_da_grade_dos_assentos
```

O que ela prova é o ponto cego óbvio: com a faixa de volta, **o endereço continua
na página**, o pacote continua escrevendo e as outras doze provas continuam
verdes. Só a fronteira reprova.

**B — a vaga sai do acordeão (aba 08).** O mesmo movimento na outra aba:

```
ERRO em 08-conexoes — decisão dela desfeita:
  - o bloco dos externos saiu de dentro do acordeão dos controles — …
FAILED …::test_o_endereco_da_aba08_mora_dentro_do_acordeao
```

**C — `display:contents` vira `display:block`.** Os dois geradores param, a régua
reprova, **e o navegador mostra o estrago**: os dois cartões da aba 01 passam de
`l=404` e `l=684` (lado a lado, nas trilhas da grade) para `l=404` e `l=404`,
`t=540` e `t=588` — **empilhados numa célula só**, a quinta coluna de uma grade
que tem quatro. *A faixa à parte de volta, com outro nome.*

**E declaro o que a mordida C NÃO mostrou:** na aba 08 a geometria ficou
**idêntica** com `display:block` — as seis linhas nos mesmos `t` e `l`. Um
wrapper de bloco dentro de um `flex-direction:column` não desloca nada hoje. A
regra fica lá assim mesmo, porque a estrutura das duas abas passa a ser a mesma e
porque `.gc-item:first-child{border-top:none}` conta IRMÃOS — mas **o efeito em
pixels medido hoje é zero**, e uma régua que se diz medida sem dizer isso mente.

**A régua também morde no outro sentido**, que é onde ela quase deu verde falso:
`test_nenhum_aparelho_de_exemplo_nasce_dentro_da_moldura` exige que a moldura
PARADA não tenha cartão nenhum. Dentro da grade dos assentos um 8BitDo cravado
mentiria **pior** do que mentia na faixa — ele pareceria um controle adotado.

---

## O que NÃO verifiquei

* **Com aparelho de verdade na mão dela.** Não havia Nintendo Pro nem 8BitDo
  nesta bancada (`/sys/bus/hid/devices` só tem `054C:0CE6` e `054C:0DF2`, os dois
  Sony). O que medi foi o caminho inteiro do payload até os pixels, com o payload
  na forma que `daemon.ipc_handlers._handle_controller_list` publica — e nos DOIS
  motores. **O aparelho ainda ganha do instrumento**, e a prova de aparelho
  continua sendo dela.
* **O piloto vivo.** Não rodei `hefesto_vivo.py`: ele dispara as migrações
  one-shot no `~/.config` real dela. A medição no WebKitGTK foi com uma
  `Gtk.OffscreenWindow` sob Xvfb, carregando a página da bancada e injetando o
  HTML **que o pacote devolve** — o motor é o mesmo; o daemon vivo não.
* **A tela publicada.** `interface/paginas/` continua com o desenho de ontem, de
  propósito. Enquanto ela não publicar, o produto renderiza a faixa à parte.
* **Mais de dois externos.** Medi com dois. Com cinco a grade abriria uma
  terceira fileira; nada no desenho impede, mas ninguém olhou.
* **A conta do topo do quadro.** Ver abaixo — é a única coisa que a mudança
  tornou visivelmente vizinha e que eu não podia decidir.

---

## O que sobrou para o próximo

1. **A contagem do quadro agora encosta nos externos, e é decisão dela.** Na aba
   08 o cabeçalho da "Gestão de Controles" diz *"2 controles · 1 no cabo · 1 no
   rádio"* — a frase tem UM dono (`texto_da_contagem`) e conta os controles que o
   Hefesto **adotou**, o que é honesto. Só que, com a decisão dela, esses dois
   números passaram a ficar **quatro linhas acima** de mais duas linhas de
   controle na MESMA moldura. Não mudei: quantos aparelhos a frase conta é texto
   de tela, e texto de tela é dela. **É a pergunta desta entrega.**
2. **A publicação.** `scripts/check_o_desenho_aprovado.py --publicar 01` e `08`,
   depois que ela olhar.
3. **A borda tracejada e o daltonismo.** O segundo sinal do externo é a marca
   (texto); o tracejado é reforço. Ninguém mediu contraste do tracejado contra o
   sólido, e a prova de tela desta casa mede `color`, não `border-style`.
4. **A ordem entre externos.** Hoje eles entram na ordem em que o daemon
   responde. Se um dia forem cinco, ordenar por marca ou por número é escolha
   que ninguém fez.

---

## E um vermelho que ACHEI e não é meu

`tests/unit/test_a_documentacao_conhece_todas_as_abas.py` reprova em duas provas
— `test_toda_foto_do_retrato_aparece_no_readme` e `test_a_foto_esticada_e_publicada`
— com:

```
FileNotFoundError: …/scripts/gui-captura/retratar_abas.py
```

**Não é desta sprint, e a prova é do git:** o arquivo foi apagado por
`f5311616` (`feat(gtk-3)!: a janela GTK sai`), não existe em `HEAD`, e meu diff
não toca nem a régua nem `scripts/`. A régua ficou apontando para o retratista
da janela que saiu — e é a assinatura que esta casa já nomeou três vezes: *a
régua media o mundo de ontem*.

**Nenhum portão o vê** (`portoes.sh` fecha TODOS VERDES, 45), o que o torna
exatamente o tipo de vermelho que só aparece quando alguém roda a suíte. Medido
aqui rodando os 68 arquivos de teste que leem estas duas abas: **1072 passaram,
8 pularam, 2 falharam** — os dois acima.

Deixei como está: a régua e `docs/usage/` não são posse desta sprint, e a cura é
apontá-la para `interface/olhar.py --todas --doc`, que é quem fotografa as dez
páginas hoje.
