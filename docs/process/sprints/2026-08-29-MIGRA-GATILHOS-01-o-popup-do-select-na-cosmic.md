---
sprint: MIGRA-GATILHOS-01
estado: absorvida
onda: MIGRA-GATILHOS
posse:
  M1:
    - docs/process/sprints/2026-08-29-MIGRA-GATILHOS-01-o-popup-do-select-na-cosmic.md
cria:
  - docs/process/medicoes/2026-08-29-o-popup-do-select-no-webkitgtk-sob-cosmic.md
bancada: true
depois_de: []
nao_toca:
  - src/
  - tests/
  - novo-layout/
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 03). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA GATILHOS · 01 — o popup do `<select>` na COSMIC

**Zero código. É medição de bancada, e ela vem primeiro porque pode derrubar o
desenho desta aba inteira** — e mais 101 campos das outras nove.

## O defeito possível, e por que ele não é hipótese solta

O produto **já tirou** o popup de escolha desta janela, e a razão está escrita
no arquivo que o substituiu:

> *"FEAT-DSX-COMBO-TO-SEGMENTED-01: substitui `GtkComboBox`/`GtkComboBoxText` na
> COSMIC, onde o cosmic-comp **rouba o foco no clique e FECHA o popup do combo
> na hora** (bug do compositor — cosmic-epoch#2497 / pop#3660). Botões sempre
> visíveis (sem popup/grab GTK) são imunes: a usuária consegue escolher."*
> — `src/hefesto_dualsense4unix/app/widgets/segmented_selector.py:1-6`

A aba Gatilhos é **o maior consumidor desse widget no produto**: os 19 modos e
a lista de efeitos prontos são dois `SegmentedSelector` por lado
(`triggers_actions.py:130-149`), quatro na aba.

**O mockup aprovado desfaz exatamente essa cura.** Medido no arquivo gerado
hoje: `layout/03-gatilhos.html` tem **16 `<select>`** no miolo — 8
`select.modo` e 8 `select.pronto` —, e o gerador explica por que
(`aba03.py:101-106`): com quatro colunas a grade de 19 botões pediria 566px numa
coluna de 447. Nas dez abas são **117** (contados em 29/08, `ver.py:80`).  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->

**O que não foi medido:** se o popup que o **WebKitGTK** abre para um `<select>`
sobrevive ao cosmic-comp na máquina dela. As duas medições de 29/08 sobre
`<select>` foram outras:

| já medido | o quê |
|---|---|
| `ver.py:77-90` | a **caixa fechada** sai BRANCA (o WebKitGTK relata a cor do autor e desenha o tema do sistema). Curado com `appearance:none` |  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->
| `03-gatilhos.html:108-115` | a **lista aberta no Chrome** saía clara sobre clara. Curado na `option`, não no `select` |

Nenhuma das duas responde **se a lista chega a ficar aberta** sob o compositor
dela. E se não ficar, o gesto principal desta aba — escolher um dos 19 modos —
não existe.

## O que entrega

Uma medição, na máquina dela, com a ferramenta que **já está no disco**:

```bash
src/hefesto_dualsense4unix/interface/ver.py 03      # a aba Gatilhos no WebView, na tela dela
```

Registrar, em `docs/process/medicoes/2026-08-29-o-popup-do-select-no-webkitgtk-sob-cosmic.md`:

1. **abre?** clicar num `select.modo` e dizer se a lista aparece;
2. **fica aberta?** contar quantos milissegundos até fechar sozinha, se fechar;
3. **escolhe?** um clique numa opção diferente troca o valor;
4. **teclado?** `Tab` até o campo, `Espaço`/`Enter` para abrir, setas, `Enter`.
   O caminho de teclado pode ser o que sobra se o do mouse cair;
5. **as 19 opções são legíveis** — o `option{background}` de `:114` é uma cura
   do Chrome; sob WebKitGTK o popup é um widget do sistema e a folha pode não o
   alcançar. Fotografar;
6. **o mesmo, com a janela do produto** — `ver.py` desenha a própria decoração  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->
   (`Gtk.HeaderBar`, `:129`) e o produto não. Se o resultado divergir, o dono
   do defeito é a decoração, não o WebKit.

**Sem controle na mesa e sem daemon.** Esta medição é de tela: nada aqui toca
`hidraw`, e por isso ela pode correr enquanto o resto da casa trabalha.

## Como se prova (a mordida)

A mordida de uma medição é **a régua reprovando quando o defeito está lá**, e
aqui ela é direta: com o `SegmentedSelector` o defeito é conhecido e curado, logo
existe um controle positivo.

1. **O controle positivo** — abrir a aba Gatilhos **do produto de hoje**
   (`hefesto-gui`, aba Gatilhos) e confirmar que os 19 modos aparecem como
   botões, sem popup. É o estado "curado".
2. **O controle negativo, e é o que morde** — qualquer `GtkComboBoxText` vivo na
   janela de hoje. Se **nenhum** fechar sozinho no clique, o bug do compositor
   **caducou** nesta versão da COSMIC, e a comparação com o WebKit perde o
   sentido: registre isso, com a versão do `cosmic-comp`, porque então a
   `FEAT-DSX-COMBO-TO-SEGMENTED-01` inteira vira decisão a rever.
3. **A medição** — o `select` do WebView, os seis itens acima, com foto.

Uma frase como *"pareceu funcionar"* não fecha esta sprint. O que fecha é:
**abriu / não abriu**, **ficou N ms**, **trocou o valor / não trocou**, com o
PNG ao lado.

## O que é dela decidir

**Se o popup não sobreviver, qual das três saídas.** Nenhuma é escolha de
agente, e as três têm preço diferente:

| saída | o que custa | o que ela perde |
|---|---|---|
| **(a) lista desenhada DENTRO da página** — um `<div>` que a página abre e fecha, sem popup do sistema | CSS + JS no gerador, **uma vez para as dez abas** (117 campos). Imune pelo mesmo motivo que os botões segmentados são | nada de desenho: a lista pode ficar idêntica à que ela aprovou |
| **(b) voltar aos botões sempre visíveis** nesta aba | mata o desenho de quatro colunas: 19 fileiras de 36px não cabem em 447px de coluna (`aba03.py:372-376`) | as quatro colunas lado a lado, que é a decisão de 28/08 |
| **(c) só o teclado** | zero | o mouse, que é como ela usa a janela |

A (a) é a que preserva o desenho aprovado, e é a que eu recomendaria — mas
**recomendar não é decidir**, e ela já disse o que pensa de campo de escolha:
*"quando eu falei de drop in eu tava falando de todos os campos"*.

## O que esta sprint NÃO faz

Não escreve a cura. Se a medição sair boa, esta onda segue como está escrita e
esta sprint fecha com um documento. Se sair ruim, quem coordena reabre a **02** e
a **06** com a saída que ela escolher — e é por isso que esta é a **01**.
