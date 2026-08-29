---
sprint: MIGRA-LANCADORES-03
onda: MIGRA-LANCADORES
posse:
  ML3:
    - src/hefesto_dualsense4unix/gui/telas/07-lancadores.html
    - scripts/telas/aba07.py
    - tests/unit/test_migra_lancadores_03_os_enderecos.py
cria:
  - tests/unit/test_migra_lancadores_03_os_enderecos.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-02
  - MIGRA-CONTROLES-01
  # SÉRIE: divide a página e o gerador com a 02.
  - MIGRA-LANCADORES-02
nao_toca:
  - src/hefesto_dualsense4unix/app/
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/integrations/
  - src/hefesto_dualsense4unix/gui/main.glade
  - install.sh
---

# MIGRA LANÇADORES · 03 — cada valor da tela ganha endereço

**O defeito:** a página tem **35 valores** e **zero endereços**. O Python não tem
como alcançar nenhum deles sem contar filhos.

O que está no HTML hoje (`novo-layout/07-lancadores.html:586-593`, o cartão da
Steam):

```html
<div class="lanc chega">
  <div class="lanc-topo">
    <span class="lanc-nome">Steam</span>
    <span class="lanc-selo ok">CHEGAM</span>
    <span class="lanc-jogos">412 jogos</span>
  </div>
  <div class="lanc-diz">Os 4 controles chegam. …</div>
```

A única âncora é a **classe**, e classe é estilo. Restam duas saídas ruins:

- **por posição** — `.lancadores > div:nth-child(2)`. A ordem dos cartões muda
  com a máquina: os ausentes vão para o fim e o mockup os **agrupa** num cartão
  só (`Dolphin · mGBA`, `:648`). Endereço por posição erra no primeiro Heroic
  desinstalado;
- **por texto** — procurar `Steam`. É exatamente o defeito medido em 27/08: o
  `monta.py` procurava o rótulo do chip (`Sony 1 · USB`), o rótulo virou
  `P1 • Cosmic Red • USB`, e a troca **deixou de fazer nada em silêncio, com a
  régua verde**. Seis abas ficaram erradas sem ninguém ver.

## O que entrega

**Atributos, e nada mais.** Nenhuma caixa anda, nenhuma cor muda, nenhum texto
nasce — o desenho está **selado** por ela e esta sprint não o abre.

1. **No quadro:**
   `id="lanc-conta"` na linha *"5 encontrados · 1 com impedimento"*
   (`:576`), `id="lancadores"` na grade (`:585`), e
   `data-acao="detectar"` / `data-acao="procurar"` nos dois botões de cima
   (`:581-582`).
2. **Em cada cartão:** `data-lanc="steam|heroic|lutris|flatpak|retroarch|ausentes"`.
   A chave é a mesma do detector da **04** — um vocabulário, não dois.
3. **Dentro do cartão:** `data-campo="nome|selo|jogos|diz|carimbo"`, e
   `data-estado` no `.lanc` para o Python trocar a moldura (`chega` / `impede` /
   `ausente`) sem mexer em `class`, que é do desenho.
4. **Nos botões:** `data-acao="abrir|criar-perfil|consertar|ver-impede|estilo-retro|procurar"`.
   São os **14 gestos** da aba, e o `data-lanc` do cartão-pai diz de quem é cada
   um. Os **dois** *"Procurar de novo"* (o do quadro, `:582`, e o do cartão dos
   ausentes, `:656`) recebem **a mesma** `data-acao` — é o mesmo rótulo no
   desenho aprovado, logo tem de ser a mesma chamada, ou é o **P6** do redesenho
   se repetindo (o mesmo gesto escrito duas vezes foi o defeito mais caro do
   desenho antigo).
5. **A função que recebe o JSON**, no gerador e por isso na página:
   `hefesto.pintarLancadores(dados)` — **uma** passada, não trinta.
   A medição de 29/08 é o que justifica: a bomba dos 130 valores a 2 Hz custou
   **1,95 ms**, 0,4% do orçamento; trinta `run_javascript` separados jogam essa
   folga fora sem precisar.

**O que esta sprint NÃO faz:** não chama nada do Python (é a 05) e não decide um
único texto de tela.

## Como se prova — a mordida

`tests/unit/test_migra_lancadores_03_os_enderecos.py`:

1. **Os 35 valores têm endereço.** Parse do HTML: cada cartão tem os cinco
   `data-campo`, cada botão tem `data-acao`, a conta tem id.
   **Mordida:** apague um `data-campo` do gerador → reprova, nomeando qual.
2. **Nenhum endereço é posicional.** Nenhum seletor usado pelo produto contém
   `nth-child` nem casa por texto visível. Grep no módulo da aba (que nasce na
   04) e no JS da página.
   **Mordida:** troque um `[data-lanc="heroic"]` por `:nth-child(2)` → reprova.
3. **Os dois "Procurar de novo" são uma chamada só.** Contar `data-acao="procurar"`
   → exatamente 2 ocorrências, **um** valor.
   **Mordida:** dê `data-acao="procurar-ausentes"` ao segundo → reprova, com a
   frase do P6.
4. **O atributo não mudou pixel.** Foto do Chrome antes e depois, pelo
   `novo-layout/_ferramentas/olhar.py`, comparadas byte a byte.
   **Mordida:** acrescente junto um `style` qualquer → as fotos divergem e
   reprova. *E a armadilha de 27/08 vale aqui:* o `scrollIntoViewIfNeeded` do
   Playwright **rola antes de medir** e cega toda medição de layout feita
   depois — a foto é da página parada, sem hover e sem rolagem induzida.

## O que é dela decidir

Nada. Esta sprint não toca desenho — é a única da onda que pode correr sem uma
palavra dela, e por isso vem cedo.
