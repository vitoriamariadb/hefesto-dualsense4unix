---
sprint: ONDA-VIBRACAO-02
# onda: ABA-VIBRACAO
posse:
  V2:
    - src/hefesto_dualsense4unix/gui/main.glade
    - src/hefesto_dualsense4unix/gui/theme.css
    - scripts/gui-captura/retratar_abas.py
cria:
  - tests/unit/test_a_aba_vibracao_diz_o_que_o_mockup_diz.py
bancada: false
depois_de:
  # A BANCADA DO `gui/main.glade` — XML único, sem seções nomeadas: conflito de
  # merge nele é irrecuperável na prática (SPRINT_ORDER.md §1.1, trava 2). Vinte
  # sprints o abrem, e por R5 elas correm EM SÉRIE, na ordem das ondas de
  # SPRINT_ORDER.md §1.2. As linhas abaixo são a fila inteira que vem ANTES desta:
  - EMULACAO-UM-DONO-SO-01
  - COOP-NA-CONEXAO-NATIVA-01
  - ONDA-JOGAR-09
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/rumble_actions.py
  - src/hefesto_dualsense4unix/core/rumble.py
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/profiles/schema.py
---

# ONDA VIBRAÇÃO · 02 — a aba vira um quadro só

**O defeito em uma frase:** a aba se chama "Rumble", tem **dois quadros** onde o
desenho dela tem um, **26 textos fixos para 11 controles**, e nada nela se parece
com o mockup que ela aprovou.

Palavra dela, 27/08 (`/tmp/coleta/hoje.md:273`):

> *"Vibração. Não gosto de Duas áreas, Unifica os blocos."*

E o aceite (`/tmp/coleta/hoje.md`, mensagem 68; `CORRECOES-DELA.md`, seção
"Aba Vibração — FECHADA"):

> *"ok, foda. Viu esses detalhes que eu pedi? (…) Tá fechado essa."*

**A especificação é `layout/05-vibracao.html`.** Onde o mockup e o contrato
de 26/08 divergirem, **vence o mockup** — ele é de 27/08 e tem o aceite dela.

## O que esta sprint entrega — a tela, e só a tela

Um `GtkFrame` **único**, "Vibração", em duas colunas separadas por linha
vertical (`05-vibracao.html:459`, `.vib > div:last-child{border-left:…}`) —
pedido literal dela (`hoje.md:322`): *"adiciona uma barra de separação vertical
entre o bloco do svg com o bloco da direita"*.

**Coluna da esquerda** — o desenho e os quatro botões:
- `GtkBox id="rumble_desenho_slot"`, vazio no XML: quem o preenche é o widget da
  ONDA-VIBRACAO-01, em código. Molde do slot: `main.glade:831` e `:995`
  (`FEAT-DSX-COMBO-TO-SEGMENTED-01`).
- A legenda `P1 · Cosmic Red · USB` abaixo do desenho.
- **Os quatro botões em 2x2, todos da mesma largura** — `hoje.md:309`:
  *"vibração em baixo do svg coloca os 4 botões. com mesma largura."*
  `Testar por 500 ms` · `Travar nesta vibração` · `Deixar o jogo controlar` ·
  `Parar` (o `Parar` continua o **último**, e a razão está escrita no
  `main.glade:2047-2062` — não a apague).

**Coluna da direita** — duas seções com título no mesmo estilo:
- **"Força da vibração"**: os quatro botões `Economia · Balanceado · Máximo ·
  Auto` numa fileira, e **abaixo** a linha `Personalizado` (rótulo com o **mesmo
  estilo de título**), trilho, número em `%` e o sufixo `máx`.
  `hoje.md:319`: *"Força da vibração, tem um estilo de título igual a motores.
  Aplica ele Onde tá escrito Força Sozinho e ali Escreve Personalizado e remove
  o botão Personalizado"* — **não existe um quinto botão**; a tabela do contrato
  de 26/08 (`O-REDESENHO:400`) está vencida nesse ponto.
- **"Motores"** — o título é essa palavra e nada mais (`hoje.md:313`:
  *"Motor esquerdo e direito, coloca só Motores"*; e `hoje.md:309`: *"Motores
  que tremem durante o jogo? Não é o titulo que sugeri"*). Duas linhas na
  **mesma grade de quatro colunas** da linha de cima (rótulo · trilho · número ·
  sufixo), cada uma com um `GtkToggleButton` à esquerda:
  `[·] Motor esquerdo` + trilho `0` `/255` e `[·] Motor direito` + trilho `60`
  `/255`. `hoje.md:309`: *"Coloca o botão em estado desligado (esquerda) e a
  direita do botão Motor Esquerdo coloca o Slicer Esquerdo a direita."*

## O que SAI da tela, e para onde vai

| Sai | Para onde | Fonte |
|---|---|---|
| Rótulo da aba `Rumble` | vira **Vibração** | D-AS-DEZ-ABAS-E-SEUS-NOMES |
| `rumble_info` (`main.glade:2085`) | dica do "?" do quadro | D-TUDO-QUE-EXPLICA-VIRA-DICA |
| `rumble_policy_auto_label` (`:1861`) | dica do botão Auto, que já a tem | idem — e para de empurrar a tela para baixo |
| `rumble_policy_aviso` (`:1916`) | **some** | `hoje.md:204-208`: *"A Força da vibração vale para os dois controles — ela ainda não tem endereço. (…) remove"*, *"vale para a mesa inteira, remove, botão de ajustes faz isso"* |
| `rumble_state_label` (`:2075`) | **some** | não está no mockup; a metade dos pedidos ela cortou por escrito (`hoje.md:312`: *"o jogo está pedindo vibração forte 180 · leve 40 (…) isso era pra sair"*) |
| `Intensidade global:` + a frase em itálico (`:1799-1810`) | vira o rótulo **Personalizado** | `hoje.md:319` |
| `Vibração leve` / `Vibração forte` (`:1965`, `:1988`) | viram **Motor esquerdo** / **Motor direito** | `hoje.md:273` |
| Título `Testar motores (enquanto testa…)` (`:1943`) | vira a seção **Motores** + dica | `hoje.md:313` |
| Botão `Aplicar` da aba (`:2021`) | vira **Travar nesta vibração** | havia quatro "Aplicar" na mesma janela |

**Nada se perdeu, e onde cada coisa foi parar:**
- *"travada em silêncio"* já é dita **fora da aba**, no banner do cabeçalho, e é
  visível de qualquer aba enquanto ela joga — `status_actions.py:2238`
  (`_update_rumble_badge`). Aquela linha da aba era a cópia pior: só aparecia
  para quem estava na aba.
- A **recusa do Modo Nativo** continua chegando pelo **toast**, e por caminho
  próprio: `rumble_set_checked` devolve `motivo` no corpo da resposta
  (`rumble_actions.py:993-1000`, NATIVO-RUMBLE-01). Ela não dependia do rótulo.
- *"o JOGO controla a vibração"* passa a ser dito **pelo desenho**, que é o que
  ela desenhou — ONDA-VIBRACAO-06.

## Como se prova (o teste que MORDE)

`tests/unit/test_a_aba_vibracao_diz_o_que_o_mockup_diz.py` lê o `main.glade`
como XML (sem GTK, roda no CI) e exige:
- o rótulo da aba é `Vibração`, e a palavra `Rumble` não aparece em **nenhum**
  texto traduzível da aba (os `id`s continuam `rumble_*`: renomear id é outra
  obra, e quebraria seis arquivos);
- existem `rumble_desenho_slot`, `rumble_motor_esquerdo_toggle`,
  `rumble_motor_direito_toggle`;
- **não** existem `rumble_info`, `rumble_policy_auto_label`,
  `rumble_policy_aviso`, `rumble_state_label`;
- os rótulos são, literalmente, `Motor esquerdo`, `Motor direito`, `Motores`,
  `Força da vibração`, `Personalizado`, `Travar nesta vibração`,
  `Deixar o jogo controlar`, `Parar`, `Testar por 500 ms`;
- há **um** `GtkFrame` dentro de `tab_rumble_box`, não dois.

**Arranque:** devolva o segundo `GtkFrame` e veja reprovar; devolva o rótulo
`Vibração leve` e veja reprovar.

**E a prova de tela**, que é a que vale (PROVA-DE-TELA-01):
```bash
scripts/gui-captura/retratar_abas.py
```
A foto da aba, lado a lado com `layout/05-vibracao.html`, e a palavra final
é dela. O `retratar_abas.py:1685-1750` monta esta aba com um host de bancada e
**cita por nome** os widgets que esta sprint apaga — ele quebra junto, e faz
parte da posse.

## O que é dela decidir

1. **A aba fica sem nenhuma linha de estado?** O mockup não tem nenhuma, e o
   banner do cabeçalho cobre "travada". Mas *"o jogo está pedindo agora"* passa
   a existir **só** como o desenho aceso. Confirma?
2. **O sufixo `máx` da linha Personalizado** é o teto do orçamento da mesa
   (`core/rumble.py:61`, `teto_do_orcamento` — só o "Bateria longa" tem teto
   real). Ele fica sempre visível, ou só quando o teto MORDE?

## O que esta sprint NÃO faz

Nenhuma linha de comportamento. Os botões novos nascem **inertes** — quem os liga
são as sprints 03 a 06. Isto é deliberado: `main.glade` é XML único e conflito de
merge nele é irrecuperável, então ele é de **uma sprint por vez**
(COMO-EXECUTAR-UMA-SPRINT §2).
