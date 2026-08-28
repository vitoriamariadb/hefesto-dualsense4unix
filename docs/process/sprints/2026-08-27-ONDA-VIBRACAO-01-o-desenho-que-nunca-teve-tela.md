---
sprint: ONDA-VIBRACAO-01
# onda: ABA-VIBRACAO
posse:
  V1:
    - install.sh
    - scripts/check_packaging_parity.sh
    - src/hefesto_dualsense4unix/app/widgets/__init__.py
cria:
  - src/hefesto_dualsense4unix/app/widgets/desenho_do_controle.py
  - tests/unit/test_desenho_do_controle_acende_o_lado.py
  - tests/unit/test_o_desenho_viaja_no_pacote.py
bancada: false
depois_de:
  - IDENTIDADE-01  # fechou em 54b7ffd2 (o app-id e a migração); a série é nominal
  - LEVA-1  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
  - LEVA-4  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
  - LEVA-DE-BACKGROUND-01  # fechou no merge 27e6c4a6 (as sete frentes); a série é nominal
  - MOTOR-DO-ARRANJO-01  # sprint antiga ainda aberta: a onda vem depois, em série (R5)
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/actions/rumble_actions.py
  - assets/control-svg/dualsense.svg
---

# ONDA VIBRAÇÃO · 01 — o desenho que nunca teve tela

**O defeito em uma frase:** o DualSense desenhado existe no repositório desde
11/08, com os dois motores já nomeados, e **nenhuma linha da janela abre esse
arquivo** — e, se abrisse hoje, a janela nasceria vazia na máquina instalada,
porque o `install.sh` não copia a pasta.

## O que está medido

```bash
grep -rn 'control-svg' src/          # zero
```

- `assets/control-svg/dualsense.svg:203` — `<g id="feat-rumble-esquerdo">`
- `assets/control-svg/dualsense.svg:208` — `<g id="feat-rumble-direito">`
- O arquivo já traz as cinco cores de plástico por `data-colorway` e o
  mecanismo de acender (`.oculta` / `.oculta.acesa`).
- `install.sh:3053-3054` copia **só** `assets/glyphs` para
  `~/.local/share/hefesto-dualsense4unix/glyphs`. Um card que carregue o SVG
  numa máquina instalada nasce **vazio, sem um erro no log**.

Decisão dela (`/tmp/coleta/decisoes.md:168`, D-O-SVG-VIBRA-POR-LADO):

> *"Cor do plástico. divide o svgs do dualsense em dois lados esquerdo e
> direito. Parte esquerda vibra mostrando a cor do motor esquerdo."*

## O que esta sprint entrega

1. **`app/widgets/desenho_do_controle.py`** — o widget que **todas** as abas vão
   usar (Vibração agora; Iluminação, Controles e Navegação depois). API mínima:
   - `DesenhoDoControle(colorway: str | None = None)`
   - `acender(*ids: str)` / `apagar(*ids: str)` — pelos ids do SVG
   - `set_cor_do_plastico(tom_hex: str, nome: str)` — pinta o corpo **e a borda**
     (D-A-BORDA-E-A-IDENTIDADE-DA-PECA). A borda usa
     `integrations.cor_do_plastico.tom_para_a_borda:240`, que já resolve o caso
     difícil (Midnight Black some no fundo escuro) e hoje tem **um chamador só**.
   - Molde do tinting: `gui/widgets/button_glyph.py:113-118`
     (`_tintar_svg` + cache de pixbuf por `(nome, tamanho, hex)`), que é o
     precedente desta casa para colorir SVG shipado.
   - Duas variantes, como `button_glyph` e `stick_preview_gtk`: a real
     (`Gtk.DrawingArea`/`Gtk.Image`) e o stub puro quando não há PyGObject —
     senão o teste não roda no CI.
2. **O SVG entra no pacote.** `install.sh` copia `assets/control-svg/` para
   `~/.local/share/hefesto-dualsense4unix/control-svg/`, pelo mesmo passo e a
   mesma natureza do bloco dos glifos (`install.sh:3053`, "atalho, glyphs,
   i18n").
3. **`scripts/check_packaging_parity.sh` passa a exigir a pasta** — sem isso a
   regressão volta calada na próxima refatoração do install.

## Como se prova (o teste que MORDE)

`tests/unit/test_desenho_do_controle_acende_o_lado.py`
- `acender("feat-rumble-esquerdo")` deixa **aquele** grupo com a classe `acesa`
  e o direito sem. **Arranque:** troque o id por um fixo e veja o teste reprovar
  com o lado errado aceso.
- `set_cor_do_plastico` com `#00040d` (Midnight Black) produz **borda diferente
  do fundo**: a saída tem de bater com `tom_para_a_borda("#00040d")` — não com o
  hexa cru.
- Id inexistente **levanta**, não passa em silêncio: um `acender("feat-teclado")`
  que não faz nada é a forma de a tela mentir sem ninguém ver.

`tests/unit/test_o_desenho_viaja_no_pacote.py`
- Lê o `install.sh` e exige que `assets/control-svg` seja copiado. **Arranque:**
  comente a linha do install e veja reprovar. É o mesmo molde do portão dos
  glifos.

## O que é dela decidir

- Nada. Esta sprint só liga uma peça que ela já mandou usar.

## O que esta sprint NÃO faz

Não mexe no `main.glade` (é da 02) nem no `dualsense.svg` — o arquivo está certo
como está, e mudar o desenho é decisão dela, não desta obra.
