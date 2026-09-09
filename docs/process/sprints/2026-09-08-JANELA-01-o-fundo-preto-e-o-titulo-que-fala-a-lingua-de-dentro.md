---
sprint: JANELA-01
estado: feita
posse:
  JANELA-01:
    - src/hefesto_dualsense4unix/interface/topo.html
    - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
    - src/hefesto_dualsense4unix/gui/ponte_da_tela.py
bancada: false
depois_de: []
---

# JANELA-01 — o fundo preto quando ela maximiza, e o título que fala a língua de dentro

> **FEITA em 08/09/2026 — `d63bbd73` (leva `A-TELA-DELA-01`), em `dev`.** O subtítulo
> saiu (`hefesto_vivo.py:2328`: *"A MOLDURA NÃO TEM SEGUNDA LINHA"*); a barra diz só
> **Hefesto**. A sobra preta fechou pela saída **esticar**: `.janela{width:min(100%,1600px)}`
> (`topo.html:187`), e o 1600 foi MEDIDO em quarenta fotos, não escolhido. A régua nova
> é `scripts/check_a_janela_nao_confessa.py` (o 50º portão) — na primeira corrida achou o
> `.desktop` dizendo *"As dez abas, com o dado do aparelho"*.
>
> **O que NÃO mudou:** a altura, `--alt-janela:777px` (`topo.html:701`). A barra vertical
> que ela viu na Gatilhos e na Lançadores depois disto é a
> [ROLAGEM-01](2026-09-08-ROLAGEM-01-a-barra-vertical-na-gatilhos-e-na-lancadores-e-os-blocos-que-dobram.md).

**Achado por ELA em 08/09/2026, com o produto instalado e os quatro DualSense na
mesa.** Palavras dela: *"o background fica completamente preto. Temos o Termo as
dez abas vivas no title da janela"*.

## §1 — São DOIS defeitos na mesma foto, e as causas são diferentes

### 1a. O TÍTULO DA JANELA FALA A LÍNGUA DE DENTRO

`interface/hefesto_vivo.py:2328` passa `subtitulo="as dez abas, vivas"`, que
`gui/ponte_da_tela.py:506` escreve no `Gtk.HeaderBar`. A barra de título dela diz:

    Hefesto
    as dez abas, vivas

*"as dez abas, vivas"* é o nome que ESTA CASA deu ao piloto — é o jeito de a
equipe dizer "o piloto único está montando as dez abas de verdade". Não é
informação para quem usa o produto; é o registro de obra vazando para a moldura
da janela.

**A REGRA QUE ISSO VIOLA já existe e é dela**, de 07/09: *"o layout não informa
os nossos defeitos"* — e a irmã dela, que a conferência já mede: a tela não
narra commit nem decisão interna. O que faltava era alguém olhar FORA do HTML.

**E É ACHADO DE INSTRUMENTO TAMBÉM, e isto é o que esta sprint deixa de mais
útil:** `scripts/check_a_conferencia_dela.py` e `check_a_tela_nao_confessa.py`
medem o **corpo das dez páginas**. A barra de título é GTK, não HTML — nenhuma
das duas réguas a alcança, e por isso este texto atravessou incólume enquanto as
dez páginas eram varridas linha por linha. *A régua parava na borda da `<body>`,
e a tela dela não para.*

### 1b. O FUNDO PRETO QUANDO A JANELA CRESCE

Medido na foto dela: a janela maximizada tem o desenho no meio e **preto em
volta**, em cima, embaixo e dos dois lados. A causa está em
`gui/ponte_da_tela.py:498`:

```python
self.janela.set_size_request(LARGURA_DO_DESENHO, ALTURA_DO_DESENHO + ALTURA_DA_BARRA)
```

O desenho tem tamanho FIXO e o `WebKit2.WebView` não estica com a janela. O que
sobra é o fundo do widget, que é preto.

**A DECISÃO DE TELA É DELA, e são três saídas honestas — esta sprint não
escolhe:**

| saída | o que acontece |
| --- | --- |
| **esticar** | o desenho ocupa a janela inteira; as colunas ficam mais largas |
| **centralizar com fundo da casa** | o desenho fica do tamanho de hoje, e o que sobra deixa de ser preto e passa a ser a cor de fundo do tema |
| **travar o tamanho** | a janela deixa de maximizar; ela nunca vê a sobra |

## §2 — O QUE ESTA SPRINT ENTREGA

1. O subtítulo da janela deixa de falar a língua de dentro. Se a moldura precisa
   de uma segunda linha, ela diz o que serve a QUEM USA — e se não precisa, sai.
2. **A régua nova, e ela é o valor durável:** uma que meça o texto da JANELA —
   `set_title`, `set_subtitle`, o `.desktop`, o nome da unit e o `tray` — pelo
   mesmo vocabulário proibido que `check_a_tela_nao_confessa.py` já usa. Ela
   entra no `portoes.sh` e no `ci.yml`.
3. A sobra preta, pela saída que ela escolher.

## §3 — A MORDIDA

Ponha `subtitulo="a onda 5 fechou"` e a régua nova tem de REPROVAR. Sem isso ela
não mede nada — e uma régua que só sabe passar foi o que deixou este defeito
chegar aos olhos dela.
