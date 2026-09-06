---
sprint: O-LOGO-NAS-DEZ-01
estado: caducou
onda: O-LOGO-NAS-DEZ
posse:
  L1:
    - layout/02-controles.html
    - layout/04-iluminacao.html
---

> **ESTADO 06/09/2026: aberta, fora das 24 horas** — `docs/process/SPRINT_ORDER.md` FECHO das 24 horas — os quatro `<title>` do logotipo ainda estão nos dez mockups (medido em 06/09); saem numa regeração só, antes do `--publicar`.

**ESPERA AS TRAVAS CAÍREM.** `aba02.py` e `aba04.py` estavam travados por levas
em voo em 29/08 — as duas páginas que faltam saem de uma regeração só.

# O LOGO NAS DEZ — a cura que chegou a uma página só

> **CADUCOU em 06/09/2026, e a premissa morreu por CIMA, não por baixo.**
> Medido pelo coordenador na costura da ONDA D, com a árvore em `4070cf82`:
>
> ```
> $ grep -o "<title>[^<]*</title>" assets/hefesto-logo.svg
> <title>Borda</title>          <title>Bolinha rosa</title>
> <title>Bolinha azul</title>   <title>Fogo</title>
> <title>Chama amarela</title>  <title>Chama vermelha</title>
> <title>Bigorna</title>        <title>Martelo</title>
> ```
>
> **Os oito são dela e os oito são capitalizados.** O defeito que esta sprint
> descreve — quatro nomes em minúscula e com hífen (`bolinha-rosa`) ao lado de
> cinco irmãos maiúsculos — não existe em arquivo nenhum desta árvore. O que ela
> pediu era o fim da MISTURA, e o fim da mistura chegou por outra porta: em
> 30/08 o `interface/monta.py:87` passou a LER `assets/hefesto-logo.svg` em vez
> de carregar o desenho digitado, e o desenho dela já nasce com os oito nomes na
> mesma forma. As vinte páginas (dez da bancada, dez do publicado) trazem os
> quatro `<title>` capitalizados, e é isso que o número 80 desta medição diz —
> não oitenta defeitos, oitenta ocorrências do desenho CERTO.
>
> **E a posse desta sprint aponta para uma pasta que não existe:** `layout/` foi
> aposentada em 31/08 e hoje as duas pontas são `mockup/` (a bancada) e
> `interface/paginas/` (o publicado). Uma sprint cuja posse não existe não se
> despacha — é a definição de `caducou` do glossário desta casa.
>
> **O QUE FICA DE LIÇÃO, e por isso a sprint não se apaga:** o defeito não era o
> nome minúsculo. Era **desenho digitado num arquivo que não é o dono dele** — a
> mesma doença da fita, das cores do plástico e do padrão das lâmpadas. Quem
> curou em 29/08 editou os arquivos que tinha na frente e a terceira cópia
> continuou viva sem ninguém saber. A cura que fechou foi dar um DONO ao
> desenho. O comentário que guarda essa razão está em `interface/topo.html:635`
> e viaja com o arquivo dela.

**28/08/2026, decisão dela:** os quatro `<title>` minúsculos do logotipo saem.
`<title>` dentro de um SVG é **tooltip**: passar o mouse na bolinha rosa escrevia
*"bolinha-rosa"* na tela dela. Quatro nomes de peça em minúscula e com hífen, do
lado de cinco irmãos maiúsculos (`Background`, `Borda`, `Fogo`, `Bigorna`,
`Martelo`) — a mistura é que era o defeito, e ela mandou caçar minúscula de
rótulo visível em **todas as abas**.

**A cura chegou a UMA das dez.** Medido em 29/08:

```
$ for f in novo-layout/??-*.html; do
    echo "$f: $(grep -c '<title>Bolinha rosa</title>\|<title>Bolinha azul</title>\|<title>Chama vermelha</title>\|<title>Chama amarela</title>' $f)"
  done
01-jogar.html: 0      06-navegacao.html: 4
02-controles.html: 4  07-lancadores.html: 4
03-gatilhos.html: 4   08-conexoes.html: 4
04-iluminacao.html: 4 09-sistema.html: 4
05-vibracao.html: 4   10-perfis.html: 4

$ grep -c ... src/hefesto_dualsense4unix/interface/topo.html
4
```

**Trinta e seis instâncias vivas**, e a causa é estrutural: a 01-jogar era a
única página escrita à mão, quem curou editou o arquivo que tinha na frente, e
o `topo.html` — que é a fonte das outras nove — não foi tocado.

## O que foi feito em 29/08

O `topo.html` foi curado e **oito das dez** foram regeradas: 01, 03, 05, 06, 07,
08, 09, 10. Conferido que **só o logo mudou** nas cinco regeradas de passagem —
diff fora do bloco do `<svg>` do cabeçalho: **0 linhas** em cada uma.

## O que falta, e por que não foi feito

**A 02-Controles e a 04-Iluminação**, porque `aba02.py` e `aba04.py` estavam
travados por levas em voo em 29/08. **Oito instâncias** continuam vivas.

O conserto é uma linha, quando a trava cair:

```bash
cd layout/_ferramentas && python3 regerar.py 02 04
```

Nada mais: o `topo.html` já está certo, e o gerador de cada aba lê dele.

## A prova

```bash
grep -c '<title>Bolinha rosa</title>' layout/02-controles.html   # tem de dar 0
grep -c '<title>Bolinha rosa</title>' layout/04-iluminacao.html  # tem de dar 0
```

E o teste que morde é o mesmo de sempre: pôr o `<title>` de volta no `topo.html`,
regerar, e ver as duas voltarem a 4.

## O que os CINCO irmãos maiúsculos fazem ali

Ficam. Tirá-los não é defeito de minúscula, é outra decisão — e esta casa não
entrega mudança que não foi pedida. A decisão dela era sobre os quatro em
minúscula.
