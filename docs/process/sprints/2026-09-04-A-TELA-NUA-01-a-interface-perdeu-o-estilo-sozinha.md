---
sprint: A-TELA-NUA-01
estado: feita
---

# A-TELA-NUA-01 — a interface perdeu o estilo sozinha

> **ESTADO 06/09/2026: feita** — medida no fonte e no git em 06/09 (plano das 24 horas, §1).

> **Ela, 04/09/2026, 12h15, com foto:** *"interface quebrou sozinha oxi"*.

## 0. A PROVA, lida da foto

Janela `Hefesto — as dez abas, vivas` (o `hefesto_vivo`), aba Gatilhos. A
página inteira **sem estilo nenhum**: `h1` de navegador, as dez abas como
links sublinhados, os ícones de ajuda como `?` de texto, o conteúdo cortado na
borda esquerda. Os dados estão lá — `2 controles: 1 USB · 1 BT`, o perfil, os
modos de gatilho —, só a folha morreu. E foi **sem clique dela**: estava
vestida e ficou nua.

## 1. O QUE SE SABE, medido no disco

* A folha é INLINE: `paginas/03-gatilhos.html:9` abre o `<style>`, `:1070`
  fecha, `</head>` na `:1071`. Não há CSS externo a perder — só a fonte do
  Google (`:8`), que não muda leiaute.
* `paginas/03-gatilhos.html` é **byte-idêntica** ao `mockup/03-gatilhos.html`.
* A página entra por `load_uri` (`interface/hefesto_vivo.py:2332`;
  `gui/ponte_da_tela.py:465`).
* O piloto escreve o DOM em quatro lugares, e só: `innerHTML` do alvo `html`
  (`hefesto_vivo.py:265`), `classList.toggle` do alvo `classe` (`:296`), o
  `outerHTML` da `.fita` (`:591`), e o `innerHTML` dos `blocos` por seletor
  (`:619`). **A aba 03 não emite `blocos`** — só a fita e os campos.
* Nada trata `web-process-terminated`: se o processo web do WebKit cai, o
  piloto não sabe.

## 2. AS HIPÓTESES, na ordem do custo de conferir

| # | hipótese | como derrubar em minutos |
| --- | --- | --- |
| H1 | O processo web do WebKit caiu e voltou sem a página (ou com ela pela metade) | rodar `--oculta` por 20 min com `WEBKIT_DEBUG`/`journalctl --user` aberto; ligar `web-process-terminated` e imprimir |
| H2 | Um `escrever()` de alvo `html` pousou num elemento que contém o `<style>` de um bloco — ou a `.fita` casou mais do que a fita na 03 | `grep -c 'class="fita' paginas/03-gatilhos.html` e conferir o pai; ler o `desejado` que o pacote da 03 manda |
| H3 | A folha do Google (`<link>` antes do `<style>`) travou a renderização numa navegação com a rede caída | tirar a rede, trocar de aba, ver se nasce nua |
| H4 | A página foi reescrita no disco no meio de uma leitura (gerador/`--publicar` rodando enquanto a janela estava aberta) | `stat` das dez páginas: alguma mudou depois das 05:11? |

**H1 é a primeira porque explica o "sozinha"** — nenhuma das outras acontece
sem um tique ou um clique, e a foto tem os dados vivos na tela, o que exige
que o piloto ainda esteja pintando.

## 3. O QUE FICA, independente da causa

* O piloto passa a ouvir `web-process-terminated` e a **recarregar** a página
  à vista, com um recado no stderr e no cartão.
* Um ensaio `a_tela_nao_fica_nua.py`: 20 minutos `--oculta`, e a cada minuto lê <!-- ref-externa: a sprint CRIA este arquivo; ele ainda não existe -->
  `getComputedStyle(document.body).backgroundColor` — se voltar
  `rgba(0, 0, 0, 0)` a folha morreu, e o ensaio diz em que minuto. É a regra
  de 29/08: **a régua tem de viver no tempo**; a regressão daquele dia só
  aparecia aos 181 segundos.

## 4. A MORDIDA

Matar o processo web de propósito (`kill` no PID do `WebKitWebProcess`
FILHO do piloto — **por PID conferido com `ps -o pid,ppid,cmd`, nunca por
padrão de nome**) e ver o ensaio acusar, e depois a cura recarregar.

## Posse, para o despacho


**Toca:** `src/hefesto_dualsense4unix/interface/hefesto_vivo.py` · `src/hefesto_dualsense4unix/gui/ponte_da_tela.py`.

**Cria:** `scripts/ensaios/a_tela_nao_fica_nua.py`. <!-- ref-externa: a sprint CRIA este arquivo; ele ainda não existe -->

**Bancada:** sim.
