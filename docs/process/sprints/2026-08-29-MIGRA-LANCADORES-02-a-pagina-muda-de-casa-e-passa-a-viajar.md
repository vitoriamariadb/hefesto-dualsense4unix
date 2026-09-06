---
sprint: MIGRA-LANCADORES-02
estado: absorvida
onda: MIGRA-LANCADORES
posse:
  ML2:
    - src/hefesto_dualsense4unix/gui/telas/07-lancadores.html
    - scripts/telas/aba07.py
    - tests/unit/test_migra_lancadores_02_a_pagina_viaja.py
cria:
  - src/hefesto_dualsense4unix/gui/telas/07-lancadores.html
  - scripts/telas/aba07.py
  - tests/unit/test_migra_lancadores_02_a_pagina_viaja.py
bancada: false
depois_de:
  # A CASA É DELA, NÃO DESTA SPRINT. A MIGRA-CONTROLES-02 fixa o contrato para as
  # dez páginas — `src/hefesto_dualsense4unix/gui/telas/NN-<aba>.html` e
  # `scripts/telas/abaNN.py` —, edita o `pyproject.toml` e o `install.sh`, e cria  <!-- ref-externa: `abaNN` é NOTAÇÃO — o NN é o número da aba, não um arquivo -->
  # o `scripts/check_a_pagina_e_a_do_gerador.py`. Dez sprints editando o  <!-- ref-externa: nasce na MIGRA-CONTROLES-02, ainda não executada -->
  # `install.sh` seria colisão de dez vias num arquivo só. Esta aqui só MUDA A
  # ABA 07 PARA DENTRO DA CASA e prova que ela chegou.
  - MIGRA-CONTROLES-02
nao_toca:
  - pyproject.toml
  - install.sh
  - scripts/check_a_pagina_e_a_do_gerador.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/integrations/
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 07). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA LANÇADORES · 02 — a página muda de casa, e passa a viajar

**O defeito:** no motor novo o HTML **é** o produto, e o HTML da aba 07 não está
no repositório.

Conferido agora:

```
$ git check-ignore -v layout/07-lancadores.html src/hefesto_dualsense4unix/interface/aba07.py
.gitignore:108:novo-layout/	layout/07-lancadores.html
.gitignore:108:novo-layout/	src/hefesto_dualsense4unix/interface/aba07.py
```

O diagnóstico completo — as quatro consequências, o wheel que só leva
`gui/*.glade`, `gui/assets/*.png` e os `.mo` (`pyproject.toml:84-91`), e o
`install.sh` que copia só os glifos (`:3102-3108`) — está escrito **uma vez**, na
`MIGRA-CONTROLES-02`. Não se repete aqui.

**O que é desta aba, e não está lá:**

1. **A página 07 é a mais barata das dez de mudar de casa.** 44 KB contra 344 KB
   da Conexões; **zero elementos `<select>`** (os dois `select` do arquivo estão
   dentro do `<style>`, `:114-115`); nenhum SVG do DualSense; nenhum pop-up; e
   os três `url()` do arquivo (`:483`, `:494`, `:497`) são o **logo do
   cabeçalho** — logo os **84 filtros mortos** do SVG (a 5ª armadilha medida) não
   a tocam. **Os dois preços conhecidos da rota WebKit não pesam aqui.**
2. **O gerador `aba07.py` já é honesto quanto à raiz** — ele importa o `monta`
   pela pasta e não por `/tmp` (a cicatriz de 27/08, quando três abas vinham de
   um montador de ontem), e o `monta.py` resolve `R` a partir de `__file__`, sem
   caminho absoluto (a cicatriz de 28/08, quando rodar uma **cópia** do gerador
   reescreveu o mockup **dela**). Mudar de pasta não quebra nenhuma das duas.
3. **A dependência de rede é herdada e vale aqui igual.**
   `07-lancadores.html:6-8` carrega Space Grotesk e JetBrains Mono de
   `fonts.googleapis.com`. Sem internet o WebKit cai no `system-ui`, as métricas
   mudam, e **o que ela vê deixa de ser o desenho que ela aprovou**. A cura é da
   `MIGRA-CONTROLES-02` (é o `topo.html`, dono único das dez); esta sprint só
   **exige a prova** para a aba 07.

## O que entrega

1. **A página no destino:** `src/hefesto_dualsense4unix/gui/telas/07-lancadores.html`.
2. **O gerador no destino:** `scripts/telas/aba07.py`, apontando para o
   `monta.py` que a MIGRA-CONTROLES-02 pôs ao lado.
3. **A prova de chegada**, e ela é da **máquina instalada**, não do repositório:
   arquivo no `git` e ausente no pacote é exatamente o defeito que esta sprint
   fecha. É a trava **P4** já medida com `assets/control-svg/dualsense.svg` no
   redesenho de 26/08 — sem o empacotamento, a aba nasce **vazia numa máquina
   instalada, sem um erro no log**.

## Como se prova — a mordida

`tests/unit/test_migra_lancadores_02_a_pagina_viaja.py`:

1. **A página chega ao pacote.** A lista de arquivos que o `hatch` inclui contém
   `gui/telas/07-lancadores.html`.
   **Mordida:** tire-a do diretório incluído → reprova. Hoje não existe teste
   nenhum, então o estado atual **é** o vermelho.
2. **A página não é uma casca.** O HTML servido tem `class="lanc"` **seis** vezes
   e um `.quadro` com o título *"De onde os seus jogos vêm"*.
   **Mordida:** gere a página com o `MIOLO` vazio → reprova.
3. **A página é a do gerador.** Rode `scripts/telas/aba07.py` num `tmp_path` e
   compare byte a byte com a versionada (é o `check_a_pagina_e_a_do_gerador.py`  <!-- ref-externa: nasce na MIGRA-CONTROLES-02, ainda não executada -->
   da MIGRA-CONTROLES-02 aplicado à aba 07).
   **Mordida:** edite o HTML à mão sem regerar → reprova, e é assim que a
   divergência silenciosa entre as duas cópias deixa de ser possível.
4. **Sem rede, o desenho é o mesmo.** Carregue a página com o acesso à rede
   negado e compare a foto com a de rede aberta.
   **Mordida:** devolva o `<link>` para `fonts.googleapis.com` → as fotos
   divergem e reprova. *E a armadilha de 27/08 vale aqui:* o
   `scrollIntoViewIfNeeded` do Playwright **rola antes de medir** e cega toda
   medição de layout feita depois — a foto é da página parada.

## O que é dela decidir

- **O que acontece com `novo-layout/` depois.** O contrato da MIGRA-CONTROLES-02
  a mantém como **bancada de desenho**. Se ela continuar sendo também **fonte**,
  as duas cópias voltam a existir — e a única coisa que as mantém iguais é o
  portão do item 3 acima. Vale marcar, na cabeça do gerador, qual das duas manda.
