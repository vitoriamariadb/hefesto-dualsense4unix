---
sprint: TOOLTIP-C1
estado: feita
onda: A-LINGUA-DA-TELA
posse:
  TOOLTIP-C1:
    - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
    - src/hefesto_dualsense4unix/interface/ver.py
cria: []
bancada: false
depois_de: []
nao_toca:
  - install.sh
---

> **ESTADO 12/09/2026: feita** — medido com `git cherry` contra
> `onda/0911c`: `voo/TOOLTIP-C1-opus` não tem um único commit fora da costura.
> O carimbo não é de quem entregou; é da MEDIÇÃO. Quatro irmãs desta
> mesma leva continuam `aberta` justamente por falharem nela.

# TOOLTIP-C1 — a dica que não abre, e ela apaga a tela inteira

Nasce da **A SEGUNDA LISTA DELA** (11/09/2026) — o índice está em
`docs/process/sprints/2026-09-11-A-SEGUNDA-LISTA-DELA-a-lingua-da-tela-e-a-paridade-INDICE.md`.

---
> *"em todos os tooltips somem os textos e eles não mostram ou*  <!-- noqa-acento: citação literal dela -->
> *mostram e saem direto. em todas as paginas isso ocorre."*  <!-- noqa-acento: citação literal dela -->

**ESTE É O DEFEITO MAIS CARO DA LISTA, e a razão é aritmética:** o produto
inteiro explica-se por `title`. Uma dica que não abre apaga, de uma vez, toda a
explicação das dez abas — e é justamente onde ela mandou cortar texto. Cortar a
prosa das dicas enquanto elas não aparecem é melhorar o que ninguém lê.

## O QUE MEDIR ANTES DE CURAR

O `title` é do navegador, e aqui o navegador é um `WebKit2.WebView` dentro de
uma `Gtk.Window`. **Não presuma a causa.** As hipóteses, e cada uma se mede:

1. **O tique apaga o elemento.** O piloto repinta a cada 100 ms; se ele
   reescreve o nó sob o ponteiro, o WebKit cancela a dica que ia abrir.
   Meça com `--conta-mutacoes` e veja se o nó do `title` está entre os que
   mudam com a mesa parada.
2. **O `title` é reescrito com o MESMO valor.** Uma reescrita de atributo é
   mutação mesmo quando o texto não muda — foi assim que o samba de 06/09
   nasceu, e a cura foi comparar antes de escrever.
3. **O WebKitGTK não desenha tooltip nativo nesta configuração.** Se for isto,
   a cura é do lado GTK (`set_tooltip_*` / `has-tooltip`), não do HTML.
4. **O CSS come o evento.** `pointer-events`, `overflow:hidden` ou um elemento
   por cima podem impedir o `mouseover` de chegar ao nó que tem o `title`.

**A ENTREGA É A CAUSA MEDIDA MAIS A CURA.** Uma cura sem a medição é um
contorno, e contorno é gambiarra nesta casa.

## A MORDIDA

Arranque a cura e veja a régua reprovar. E a régua tem de medir a dica
**ABRINDO** — não a presença do atributo `title` no DOM, que é o que as réguas
de hoje medem e é justamente por isso que nenhuma viu este defeito.

---

## O QUE VALE PARA TODA FRENTE DESTA ONDA

1. **A tela dela é UMA SÓ e ela está usando a máquina.** `--oculta` em toda
   janela. O portão `a-tela-dela` reprova quem esquecer.
2. **Uma branch sua** (`voo/TOOLTIP-C1-opus`), árvore própria. Não toque em
   `dev`, não faça merge, não rode `install.sh`.
3. **Confira que sua árvore nasceu no `dev` de hoje** — worktree de agente já
   nasceu mil commits atrás nesta casa. `git log --oneline -1 dev` e adiante a
   sua se preciso.
4. **Curar o mockup não cura o produto:** o gerador escreve em `mockup/`, e
   sem `scripts/check_o_desenho_aprovado.py --publicar NN` a tela dela não
   muda.
5. **A foto é entrega**, na vista dela:
   `src/hefesto_dualsense4unix/interface/olhar.py NN-nome.html --publicado --vista dela`
6. **Rode `bash scripts/portoes.sh` antes de fechar**, depois do `git add -A`.
7. Leia o índice da onda: `docs/process/sprints/2026-09-11-A-SEGUNDA-LISTA-DELA-a-lingua-da-tela-e-a-paridade-INDICE.md`
