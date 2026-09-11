---
sprint: ESQUELETO-C2
estado: aberta
onda: A-LINGUA-DA-TELA
posse:
  ESQUELETO-C2:
    - src/hefesto_dualsense4unix/interface/topo.html
    - src/hefesto_dualsense4unix/interface/monta.py
cria: []
bancada: false
depois_de: []
nao_toca:
  - install.sh
---

# ESQUELETO-C2 — o nome da janela, o centro e a maiúscula decorativa

Nasce da **A SEGUNDA LISTA DELA** (11/09/2026) — o índice está em
`docs/process/sprints/2026-09-11-A-SEGUNDA-LISTA-DELA-a-lingua-da-tela-e-a-paridade-INDICE.md`.

---
Três queixas dela do mesmo dia, e as três moram no esqueleto.

### 1. O NOME DA JANELA

> *"no nome da janela não conseguimos deixar Hefesto - DualSense4Unix ao invés*  <!-- noqa-acento: citação literal dela -->
> *de só hefesto?"*  <!-- noqa-acento: citação literal dela -->

Hoje: `barra.set_title("Hefesto")` — `interface/ver.py:158`. **O `ver.py` NÃO
está na sua posse** (ele é da TOOLTIP-C1, que mexe na mesma janela GTK):
entregue a linha exata na sua proposta e eu aplico na costura.

### 2. O CENTRO

> *"Não conseguimos centralizar a interfcace? tipo o bloco que contém todos os*  <!-- noqa-acento: citação literal dela -->
> *demais elementos?"*  <!-- noqa-acento: citação literal dela -->

**MEÇA ANTES DE MEXER.** O `body` já traz `align-items:center`
(`topo.html:119-123`) e a `.janela` é largura limitada a 1600px (`:186-191`) —
no papel isso já centraliza. Então **ou a conta está certa e o que ela viu é
outra coisa**, ou há algo que o CSS não alcança: a janela GTK, a barra do
compositor, o padding de 16px do `body` contra a borda do WebView.

Fotografe na vista dela (1918x840), meça a sobra da ESQUERDA e a da DIREITA em
pixels, e só então diga o que está torto. Um "centralizei" sem os dois números
não é entrega.

### 3. A MAIÚSCULA DECORATIVA — e ela é uma REGRA

> *"Leia o cabo e acordado (ambos minusculo sem iniciar de forma capitular).*  <!-- noqa-acento: citação literal dela -->
> *Esse tipo de coisa não pode se repetir na interface."*  <!-- noqa-acento: citação literal dela -->

O caso que ela viu: o seletor de controle diz o transporte em caixa alta
(`P1 • Starlight Blue • CABO`) e o cartão logo abaixo diz o mesmo transporte em
minúscula — a mesma palavra, duas grafias, na mesma tela.

**A SEGUNDA FRASE DELA É O QUE PESA:** *"não pode se repetir"*. Entregue a
**régua** que varre as dez páginas publicadas atrás de palavra em caixa alta
que não seja nome próprio, sigla nem selo — e a lista do que ela achar. Os
selos são desenho e ficam; o que sai é a maiúscula que não significa nada.

---

## O QUE VALE PARA TODA FRENTE DESTA ONDA

1. **A tela dela é UMA SÓ e ela está usando a máquina.** `--oculta` em toda
   janela. O portão `a-tela-dela` reprova quem esquecer.
2. **Uma branch sua** (`voo/ESQUELETO-C2-opus`), árvore própria. Não toque em
   `dev`, não faça merge, não rode `install.sh`.
3. **Confira que sua árvore nasceu no `dev` de hoje** — worktree de agente já
   nasceu mil commits atrás nesta casa.
4. **Curar o mockup não cura o produto:** sem
   `scripts/check_o_desenho_aprovado.py --publicar NN` a tela dela não muda.
5. **A foto é entrega**, na vista dela.
6. **Rode `bash scripts/portoes.sh` antes de fechar**, depois do `git add -A`.
7. Leia o índice da onda: `docs/process/sprints/2026-09-11-A-SEGUNDA-LISTA-DELA-a-lingua-da-tela-e-a-paridade-INDICE.md`
