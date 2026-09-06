---
sprint: ILUMINACAO-O-AVISO-DOS-N-01
estado: feita
onda: H
posse:
  AVISO:
    - src/hefesto_dualsense4unix/interface/pacotes/a04_iluminacao.py
cria:
  - tests/unit/test_a_iluminacao_avisa_quantos_receberam_o_desenho.py
bancada: false
depois_de:
  - A-TRAVA-DO-LED-NAO-SOLTA-01
nao_toca:
  - src/hefesto_dualsense4unix/interface/aba04.py
  - mockup/
  - src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
---

# ILUMINAÇÃO · O AVISO DOS N — o mesmo desenho foi para N controles, e a tela diz

> **ESTADO 2026-09-06: feita** — o `_Janela` deixou de cravar `_quantos_recebem_o_desenho`
> = 0 e passou a emprestar do dono os três degraus; `_o_aviso_dos_n` lê a frase de
> `_AVISO_MESMO_DESENHO_NOS_QUATRO`; e `_cobrar_a_frase_do_desenho`, que ENGOLIA o aviso
> por construção (ele vem colado na frase do corpo real E na do corpo feliz, e o
> `!=` calava), devolve a frase do dono para os quatro gestos de desenho a porem no
> canal de recado verde de 6,0 s. **O aviso ainda não aparece na tela** porque a aba
> não tem escopo "Todos" — decisão dela, em aberto no `aba04.py` —, e por isso a
> linha 158 do CSV virou `DIFERENTE`, não `IGUAL`. Régua:
> `tests/unit/test_a_iluminacao_avisa_quantos_receberam_o_desenho.py` (22 casos, três
> mordidas). Entrega:
> `docs/process/agentes/2026-09-06/ILUMINACAO-O-AVISO-DOS-N-01-opus.md`.

> **ROTA — 06/09/2026, arrumação da leva (Fable, PO por delegação).** Esta sprint nasceu da
> definição de pronto dela — *"migrar tudo do gtk pro html … todas as features funcionando"* —
> medida contra o CSV da paridade: as linhas abaixo estavam `FALTA_NO_HTML` **sem nenhuma
> sprint aberta encarregada**. O enunciado de cada uma é a própria linha do CSV.

Uma linha. A frase já tem dono desde hoje — `lightbar_actions._AVISO_MESMO_DESENHO_NOS_QUATRO` (curada na costura da ONDA E, sem a palavra banida) — e a escrita de player-LED chegou ao HTML pela LUZES-01. O que falta é o pacote **ler** `_quantos_recebem_o_desenho` e pôr a frase do dono no canal de recado verde (6 s) quando N > 1. Roda depois da A-TRAVA-DO-LED-NAO-SOLTA-01 (mesmo `a04_iluminacao.py`).

---

## 1. AS LINHAS DO CSV QUE ESTA SPRINT FECHA — o enunciado é a linha

### Linha 158 — Aviso 'o mesmo desenho foi para os N controles'

* **O dono na GTK (reuse, não reescreva):** `src/hefesto_dualsense4unix/app/actions/lightbar_actions.py:1550 · src/hefesto_dualsense4unix/app/actions/lightbar_actions.py:120`
* **O que ele faz:** Quando o alvo é 'Todos' deliberado, o toast acrescenta quantos controles receberam o mesmo desenho — porque mandar o desenho do P2 para os quatro quebra a invariante do co-op e nada na tela avisava (L12).
* **Por que falta:** REMEDIDO em 04/09/2026: a condição que esta linha previa ACONTECEU — 'só vira urgente quando a escrita de player-LED chegar ao HTML' — e a escrita chegou. A dívida NÃO fechou, e a régua tinha de continuar mordendo: o sinal era `_quantos_recebem_o_desenho`, que passou a existir no lado HTML como a DECLARAÇÃO de que o ramo não existe (devolve 0, para emprestar a frase do desenho de `lightbar_actions._msg_do_desenho` sem reescrever texto). Um nome que aparece por declarar a ausência não é a feature chegando. O sinal agora é o próprio texto do aviso, `_AVISO_MESMO_DESENHO_NOS_QUATRO`: ele só aparece no HTML quando o aviso aparecer. || O que a L12 mede continua valendo como dívida CONDICIONAL do dia em que esta aba ganhar um escopo 'Todos'. || SAI DO BALDE DESENHO em 04/09/2026, sem virar pergunta: Dívida CONDICIONAL, não desenho: depende da escrita das cinco lâmpadas do jogador e de um escop


## AS REGRAS DESTA SPRINT — e são as da casa

1. **A linha do CSV é o enunciado.** `docs/data/paridade-gtk-html.csv` é o dono do fato;
   a coluna `gtk_onde` diz QUEM já faz isso no motor. **Você LÊ do dono e liga à tela** —
   reescrever a lógica em `interface/` é a segunda cópia, que é o defeito que onze réguas
   desta casa já tiveram. Se o dono precisar de um ajuste, ele é seu só se estiver na
   `posse:`; senão, RELATE.
2. **Texto de tela vem do glossário** (`docs/A-LINGUA-DESTA-CASA-…`): cabo/rádio, nunca
   usb/bt; "mesa" não entra; "serviço", não daemon. Frase nova é frase do DONO em `app/`
   (`app/textos_de_aplicacao.py`, `app/actions/*`) — o pacote a importa.
3. **Cada linha fecha com a MORDIDA da casa:** arranque a cura e a régua reprova. E com a
   PROVA DE TELA: foto `--oculta` antes e depois, e o clique de verdade pela ponte JS
   (`--prova-clique`/`--prova-gesto`), nunca o mouse dela.
4. **O CSV da paridade NÃO é sua posse.** Você entrega, no relatório, o texto pronto da
   linha (veredito · `sinal` que existe no CÓDIGO do lado HTML · `html_onde` · `html_faz`)
   — a PARIDADE-REMEDIR-02 recolhe no fim. O `sinal` tem de ser código, nunca prosa
   (`D-0609-O-SINAL-DA-PARIDADE-NAO-E-PROSA`).
5. **Se um passo esbarrar em decisão de produto**, decida como PO por delegação, registre
   em `docs/data/decisoes-dela.csv` com `quem_decidiu=delegacao` e REVERSÍVEL NUMA FRASE, e
   siga. Não pare.
6. A ordem de precedência (aparelho > mapa > sprint) está no preâmbulo do despachante.
