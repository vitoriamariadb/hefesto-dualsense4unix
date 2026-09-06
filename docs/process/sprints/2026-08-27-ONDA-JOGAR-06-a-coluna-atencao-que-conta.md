---
sprint: ONDA-JOGAR-06
estado: absorvida
posse:
  J6:
    - src/hefesto_dualsense4unix/app/actions/jogar/atencao.py
cria:
  - tests/unit/test_jogar_a_atencao_conta_e_nao_esconde.py
bancada: false
depois_de:
  - ONDA-JOGAR-01
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/home_actions.py
  - src/hefesto_dualsense4unix/app/actions/jogar/pausa.py
  - src/hefesto_dualsense4unix/daemon/
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 01). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA JOGAR · 06 — a coluna Atenção que conta

**Onda:** JOGAR (aba 1).

## O defeito, em uma frase

Onze diagnósticos disputam **três rótulos empilhados** no topo da aba, e o
primeiro deles decide entre quatro frases **em cascata** — um rádio frágil
esconde um vpad degradado sem dizer que escondeu.

## A cascata, medida

`home_actions.py:613`, `vpad_degradation_text`. Ele devolve **uma** frase e
descarta as outras, nesta ordem:

```
texto_do_radio_fragil          -> devolve e PARA        (:637-639)
fora do modo gamepad           -> None
máscara != dualsense           -> None
backend == "uinput"            -> VPAD_DEGRADED_TEXT    (:651)
dedup jogador em uinput        -> texto_coop_degradado  (:659)
```

Com o rádio frágil ligado, um vpad degradado **não aparece** — e a tela não diz
que existe um segundo aviso. É o defeito que a área única existe para matar.

Os onze diagnósticos vivos desta aba, com o dono de hoje:

| Diagnóstico | Função pura | Widget |
|---|---|---|
| Rádio frágil (BT + Nativo) | `texto_do_radio_fragil` `:589` | escondido pela cascata |
| Vpad degradado | `VPAD_DEGRADED_TEXT` `:405` | `_home_vpad_banner` |
| Jogador do co-op em uinput | `texto_coop_degradado` `:476` | escondido pela cascata |
| BT frágil, com nomes | `texto_native_bt_fragil` `:539` | escondido pela cascata |
| Jogo aberto sem o wrapper | `wrapper_banner_text` `:565` | `_home_wrapper_banner` |
| Emulação desligada por escolha antiga | `aviso_de_opt_out_antigo` `:3325` | `_home_opt_out_banner` |
| "Controlar o PC" calado | `texto_do_desktop_sem_emulacao` `:762` | `_home_desktop_aviso` |
| Máscara divergente do aparelho | `texto_da_divergencia` `:1016` | `_home_divergencia_banner` |
| Hefesto em pausa | `texto_da_pausa` `:216` | rouba a linha da descrição do modo (`:2614`) |
| Cadeado cego | `texto_do_cadeado_cego` `:310` | vira dica |
| Reconciliar com jogo aberto | `_reconciliar_gate_text` `:707` | `_home_reconciliar_hint` |

**Todos são diagnóstico vivo — nenhum vira dica** (P3: *"nem todo texto longo é
ajuda; diagnóstico não some sob o ponteiro"*).

## O que o mockup manda

Coluna à direita das peças, dentro do MESMO quadro *Conectado agora* (palavra
dela: *"Vc separou em dois blocos o atenção e o conectando agora. É um só
bloco."*):

```
Atenção                    1 aviso
[RÁDIO] Dois rádios da bancada estão em portas vizinhas.
```

Título, **contador**, e um item por aviso — cada um com selo e frase curta.

## O que esta sprint entrega

1. **`atencao.py` — um agregador PURO** que recebe o `state` e devolve a lista  <!-- ref-externa: nasce na ONDA-JOGAR-01, ainda não executada -->
   de avisos, cada um com selo, frase e severidade. **Ele chama as onze
   funções puras que já existem** e não reescreve nenhuma frase: o texto tem um
   dono só (P5).

2. **A cascata morre.** `texto_do_radio_fragil` deixa de ESCONDER o vpad
   degradado — os dois entram na lista, e a lista diz **dois avisos**.

3. **O contador**, com o plural certo: `1 aviso` / `3 avisos` / e nada quando
   a lista está vazia.

4. **Espaço reservado para a coluna inteira** (P8). Com zero avisos a coluna
   fica vazia e a altura da aba não muda — a régua da ONDA-JOGAR-01 continua
   verde.

5. **Teto de itens visíveis**, com `+N` no fim quando estourar. Onze avisos
   simultâneos é raro mas possível, e a aba não pode crescer por causa disso.

## Como se prova — o teste que MORDE

`tests/unit/test_jogar_a_atencao_conta_e_nao_esconde.py`

1. **O caso que nomeia o defeito:** um `state` com rádio frágil **e** vpad
   degradado devolve **dois** avisos e o contador diz `2 avisos`. Devolva a
   cascata a `vpad_degradation_text` e este caso reprova sozinho — é a
   mordida.
2. **Um caso por linha da tabela acima**, montando o `state` mínimo que acende
   cada um. Onze casos, e cada um reprova sozinho dizendo qual sumiu.
3. **A frase é a MESMA da função pura.** O teste compara o texto do item com o
   retorno de `texto_do_radio_fragil(state)` chamado diretamente. Quem
   reescrever a frase aqui cria a divergência que o P5 proíbe, e reprova.
4. **Mesa saudável ⇒ zero avisos, contador ausente, e a altura da aba
   idêntica.** Sem isto, o espaço reservado vira espaço gasto.
5. **Nada aqui vira tooltip.** O teste afirma que cada item tem texto
   **visível**, não `tooltip-text` — é a trava do P3.

## O que é dela decidir

1. **O texto de cada selo.** O mockup traz um só, `RÁDIO`. Os outros dez
   precisam de nome curto — é texto de tela, e texto de tela é palavra dela
   (PROVA-DE-TELA-01).
2. **O teto de itens visíveis**: três? quatro?
3. **Aviso clicável?** O mockup não desenha ação nenhuma no item. Alguns têm
   conserto óbvio (o vpad degradado pede reiniciar o Hefesto). Fica como
   pergunta, e a pausa é o caso concreto — ONDA-JOGAR-10.

## Fontes

- `layout/01-jogar.html`, `.col-atencao` e `.conta-avisos`.
- `/tmp/coleta/hoje.md`, falas [30] e [31].
- `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, padrões P3 e P8.
