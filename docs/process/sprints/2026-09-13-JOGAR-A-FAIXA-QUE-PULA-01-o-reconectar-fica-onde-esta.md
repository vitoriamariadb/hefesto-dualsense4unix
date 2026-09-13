---
sprint: JOGAR-A-FAIXA-QUE-PULA-01
estado: aberta
onda: A-FILA-DE-1309
posse:
  JOGAR-A-FAIXA-QUE-PULA-01:
    - src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py
    - src/hefesto_dualsense4unix/interface/aba01.py
    - mockup/01-jogar.html
    - src/hefesto_dualsense4unix/interface/paginas/01-jogar.html
cria:
  - tests/unit/test_o_reconectar_nao_muda_de_lugar.py
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/interface/topo.html
  - src/hefesto_dualsense4unix/gui/ponte_da_tela.py
---

# JOGAR-A-FAIXA-QUE-PULA-01 — o «Reconectar controles» fica onde está

**13/09/2026, 02:48.** Duas fotos dela da aba Jogar, no mesmo minuto:

> *"essses bugs graficos natela sao muito comuns."* <!-- noqa-acento: citação literal dela -->
>
> *"botoes que mudam de lugar direto."* <!-- noqa-acento: citação literal dela -->

## §0 — O que as fotos mostram (medido nas imagens, não no produto)

| foto | janela GTK | «Reconectar controles» |
| --- | --- | --- |
| 1 | ~1228 px de largura, com a moldura do COSMIC em ~1300 | à esquerda, em DUAS linhas, estreito |
| 2 | ~1282 px | centralizado, UMA linha |

Na foto 1 o rodapé (Aplicar · Salvar Perfil…) também sai cortado embaixo —
isso é a altura da janela, frente da ALTURA-DA-VISTA-01, **não desta sprint**.

**A hipótese, lida no CSS e não medida:** `.faixa-final{display:flex}` com
`.faixa-final .pendente{flex:1}` e `.faixa-final:not(.ha) .pendente{visibility:hidden}`.
`visibility:hidden` guarda o espaço; o texto do `pendente` troca (literal do
mockup → frase do produto → vazio) e o `recibo-do-reconectar`
(`data-hef-recados`) entra na mesma fileira. Cada troca empurra o botão, e de
um jeito diferente em cada largura.

## §1 — Medir antes (Passo 1)

Piloto `--oculta` na 01, 60 s, a cada tique: o retângulo de
`[data-gesto="reconectar"]`, o texto e a largura do `.pendente`, a classe da
`.faixa-final`. Depois nas larguras 1212, 1228, 1282 e 1300. A tabela vai na
entrega. **Se o botão não se mexe no piloto, pare e relate** — a causa então
está fora da página.

## §2 — A cura

O lugar do botão não depende do texto nem da largura. A posição que ela
aprovou está escrita em `aba01.py` (o bloco de 30/08 da faixa final e a ordem
de 07/09 que deixou só o Reconectar) — respeite: botão à direita, uma linha
(`white-space:nowrap`), e a fileira não se redistribui quando o `pendente`
acende ou apaga. Pelo gerador: `aba01.py` → `mockup/01-jogar.html` →
`scripts/check_o_desenho_aprovado.py --publicar 01`.

## §3 — As duas frases desta aba («em todas as abas», TELA-CALADA-01)

1. **`mascara-ressalva`** («Guardada neste controle. Ela passa a valer
   quando…») é pintada a cada tique em Modo Nativo ou Navegação, até sem
   máscara escolhida. Passa a emitir `""`; a razão pode ir para o `title`
   dos chips.
2. **`pendente`** («● Vai mudar para: …») tem decisão registrada
   (AGORA-E-DEPOIS-01, no `relancar.py`) que a chama de *a única prova de
   que o clique registrou*. **Meça:** clicar Xbox com um jogo aberto — o chip
   do modo mostra a escolha? Se mostra, `pendente` emite `""` e a faixa não
   acende. Se o chip fica no modo velho até relançar, a frase FICA e a
   pergunta vai no campo `pergunta` da entrega.
3. **O nó `recibo-do-reconectar`:** depois da TELA-CALADA-01 nenhum recado
   de sucesso pousa nele. Se ele ocupa espaço na fileira, sai da página.

## §4 — O que morde

* Página publicada nas larguras 1228 e 1300: o botão em uma linha, colado à
  direita da faixa; acender `.ha` e trocar o texto do `pendente` não move o
  botão (x e y iguais, ±1 px). Layout pelo Playwright do `olhar.py`, prova
  no piloto (WebKit).
* **Mordida:** arrancar a cura → o botão volta a mudar de lugar → reprova.
* `mascara-ressalva` vazia em Modo Nativo → régua; arrancar → reprova.
* Foto antes e depois, `--oculta`, nas duas larguras.

## Critério de pronto — por cabo · por BT · no perfil · por controle

| pergunta | resposta |
| --- | --- |
| **por cabo** / **por BT** | não se aplica: é a página |
| **no perfil** | a máscara continua gravando igual; só a frase sai |
| **por controle** | não se aplica ao botão; a máscara continua por controle |
