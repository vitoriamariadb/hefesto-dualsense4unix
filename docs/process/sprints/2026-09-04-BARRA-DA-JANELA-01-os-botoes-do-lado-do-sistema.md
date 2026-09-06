---
sprint: BARRA-DA-JANELA-01
estado: feita
---

# BARRA-DA-JANELA-01 — os botões do lado do sistema

> **ESTADO 06/09/2026: feita** — medida no fonte e no git em 06/09 (plano das 24 horas, §1).

> **Queixa 2 dela, 04/09/2026:** *"a barra de navegação fechar, maximizar
> diminuir não é a mesma do sistema"*. A única das quinze que ficou aberta.

**DECIDIDA — 04/09/2026, tarde: "1-a", só a janela do Hefesto.** Era a [01] de
[`DECISOES-DELA-11`](2026-09-04-DECISOES-DELA-11-o-que-sobrou-da-madrugada.md).**
Nada mais espera.

## O QUE É

`gtk-decoration-layout` está `close,maximize,minimize:` na configuração dela; o
que vem antes dos dois-pontos vai para a esquerda. As janelas do COSMIC põem os
botões à direita.

## O TRABALHO

Em `app/theme.py`, ao lado de `adotar_o_tema_da_sessao` (que já PERGUNTA a
sessão pelo `Gio.Settings`): ler `org.gnome.desktop.wm.preferences
button-layout`; se a sessão não disser, cair em `:minimize,maximize,close`; e
escrever `Gtk.Settings.get_default().set_property("gtk-decoration-layout", …)`
**dentro do processo** — nenhum outro GTK muda.

## A MORDIDA

Teste com `Gtk.Settings` dublado: sem a cura, a propriedade fica como a sessão
mandou; com a cura, os três botões ficam à direita. Foto `--oculta` da janela
com barra (`TAMANHO_NA_TELA`, não `TAMANHO_OCULTA` — a barra é o que se mede).

## Posse, para o despacho


**Toca:** `src/hefesto_dualsense4unix/app/theme.py` · `src/hefesto_dualsense4unix/gui/ponte_da_tela.py`.

**Cria:** `tests/unit/test_a_barra_da_janela_segue_o_sistema.py`. <!-- ref-externa: a sprint CRIA este arquivo; ele ainda não existe -->

**Bancada:** não.
