---
sprint: NAVEGACAO-TECLAS-01
estado: feita
decisoes: [D-0609-PRIORIDADE-TODAS-AS-ABAS]
posse:
  06B:
    - src/hefesto_dualsense4unix/interface/pacotes/a06_navegacao.py
    - src/hefesto_dualsense4unix/interface/aba06.py
    - mockup/06-navegacao.html
    - tests/unit/test_a_06_a_funcao_do_teclado_tem_tres.py
depois_de: [ONDA5-06-02, ONDA3-MOTOR-01]
nao_toca:
  - src/hefesto_dualsense4unix/interface/paginas/06-navegacao.html
  - src/hefesto_dualsense4unix/app/actions/input_actions.py
  - src/hefesto_dualsense4unix/core/acoes_de_botao.py
  - src/hefesto_dualsense4unix/profiles/manager.py
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - docs/data/paridade-gtk-html.csv
---

> **FEITA — 06/09/2026, ONDA C (agente `C-NAVEGACAO-TECLAS-01`).** Nasceu a
> pop-up **"Teclas do teclado"**, com um campo por botão do
> `DOMINIO_DO_TECLADO` — ela digita `Ctrl + W`, `Alt + Shift + Tab`, `F5`,
> **qualquer combinação**, e não uma opção nova numa lista. **Nenhuma tabela de
> nomes de tecla nasceu aqui:** são quatro donos, e o quarto era o que faltava —
> sem `uinput_keyboard.SUPPORTED_KEYS`, `KEY_BANANA` atravessava `parse_binding`,
> era gravado no perfil, aparecia no campo e **não digitava nada**. O `↺` passou
> a ser de UMA linha, o `guardar-teclas` preserva o que está fora do alcance
> dele, e `atalhos_que_param_de_valer` parou de mentir por excesso. Relatório:
> `docs/process/agentes/2026-09-06/NAVEGACAO-TECLAS-01.md`.

# NAVEGACAO-TECLAS-01 · PARIDADE — a tela de escolher QUAL tecla, e o botão PS na lista

> **A decisão dela, 06/09/2026** (`D-0609-PRIORIDADE-TODAS-AS-ABAS`): todas as
> abas entram, menos Lançadores por último. A 06 tem **duas** linhas
> `FALTA_NO_HTML`, e as duas são de uso diário de quem usa o controle para
> mexer no PC.

**O MOTOR VEM ANTES, E NÃO É ESTA SPRINT.** A `ONDA3-MOTOR-01` cura *o `— Nada
—` que não cala seis linhas* e *o `resolver()` que não herda `key_bindings`*.
Sem ela, a tela que você construir escreve num campo que o motor ignora — e o
sintoma é o pior desta casa: **a ausência de dado, que se lê como "a mudança
não pegou"**. Confira que ela fechou antes de escrever a primeira linha.

---

## 1. O QUE SE MEDIU — duas linhas, e as duas são de lista fechada

| linha do CSV | o que a janela antiga faz | o que a tela nova faz hoje |
| --- | --- | --- |
| **Editar QUAL TECLA cada botão digita** (`Profile.key_bindings`, combinação livre) | `input_actions.py:369`, `:533` — coluna **editável em texto**: ela digita `Alt + Tab`, `Ctrl + Shift + F`, `Super`, `Abrir teclado na tela` — **qualquer** combinação de `KEY_*`, e `dehumani[ze]` a traduz | **não existe**: a tela oferece uma **LISTA FECHADA de 25 opções** por linha, e `key_bindings` só é tocado **para ser ZERADO** pelo "Voltar ao padrão" |
| **O botão PS na tabela de atalhos** | `input_actions.py:100`, `:146` — `ps` é um dos **17 botões canônicos**, com o rótulo "Botão PS" | **não existe**: as **21 linhas** de `acoes_de_botao.BOTOES` não incluem `ps` |

**As duas juntas descrevem uma perda concreta:** o que ela escreveu na janela
antiga — uma combinação que não está entre as 25 — **some** quando ela clica
"Voltar ao padrão" na tela nova, e não há como reescrevê-la ali.

---

## 2. O TRABALHO, EM TRÊS PASSOS

### Passo 1 — a tela de escolher a tecla

Uma tela de edição que aceite **combinação livre**, não uma vigésima sexta
opção na lista. Ela digita, e o dono traduz.

**A tradução é do motor.** `input_actions.py` já tem a dupla que humaniza e
desumaniza (`Alt + Tab` ↔ `KEY_LEFTALT+KEY_TAB`). **Importe-a.** Uma segunda
tabela de nomes de tecla é a segunda verdade mais previsível deste repositório:
ela diverge no primeiro teclado que não for o dela.

**O que a tela faz quando a combinação não existe:** recusa **dizendo**, no
recado laranja de 30 s (glossário §3), com a frase do dono. Não aceita calada,
não grava lixo, e não some com o que estava lá.

**A MORDIDA:** digite uma combinação válida fora das 25 e prove que ela chegou
ao `key_bindings`; digite uma inválida e prove que a anterior **sobreviveu**.

### Passo 2 — "Voltar ao padrão" para de apagar o que ela escreveu

Hoje `key_bindings` **só é tocado para ser zerado**. Depois do Passo 1 isso
vira perda de trabalho dela — a mesma família do item 13 de 05/09, em que *o
Salvar destruía o que a aba já tinha gravado certo*.

**A regra:** "Voltar ao padrão" devolve **a linha** ao padrão; ele não é um
apagador de tudo o que ela escreveu na janela antiga. Se as duas coisas não
couberem no mesmo botão, o botão diz o que faz — e a palavra vem do glossário.

**A MORDIDA:** grave uma combinação, clique "Voltar ao padrão" na linha ao
lado, e prove que a sua sobreviveu. Arranque a guarda e veja a régua reprovar.

### Passo 3 — o botão PS entra na lista

`ps` é canônico no motor e **falta** nas 21 linhas da tela. O rótulo é **"Botão
PS"**, que é o do dono.

**Cuidado, e ele é medido:** a `ONDA5-06-02` entrega *"a vigésima segunda
linha"* e fecha antes de você. **Confira o que ela já pôs lá** antes de
acrescentar — duas linhas `ps` é o defeito que a régua da aba 06 vai apanhar,
e você teria construído a segunda.

**E há uma régua que vai ficar vermelha de propósito:**
`tests/unit/test_a_aba_06_navegacao_fecha_as_linhas.py:221` conta as linhas. O
plano do dia já registra que a `ONDA5-06-02` a deixa vermelha **até ser
reescrita**, e que isso **está certo**. Se ela ainda estiver vermelha quando
você chegar, reescreva-a — lendo o que ela pergunta, uma a uma. **Substituição
em massa sobre régua é edição cega**, e esta casa já pagou por isso.

**A MORDIDA:** o `ps` na lista, com tecla atribuída, chegando ao perfil.

---

## 3. O QUE ESTA SPRINT NÃO CONSTRÓI

* **O motor.** É a `ONDA3-MOTOR-01`: o `— Nada —` que não cala seis linhas e o
  `resolver()` que não herda `key_bindings`. Ela vem **antes**.
* **O teclado na tela que o L3 abre.** São duas sprints próprias
  (`O-TECLADO-QUE-NAO-DIZ-COMO-SAIR-01` e
  `O-TECLADO-QUE-SOBREVIVE-AO-DAEMON-01`), fora das 24 horas.
* **O CSV da paridade.** É da `PARIDADE-REMEDIR-01`. Você RELATA.

## 4. NADA SE PERDEU

* **As 21 linhas de hoje** e o que a `ONDA5-06-02` acrescentou.
* **A escolha dela sobrevive ao tique** (`test_a_06_a_escolha_dela_sobrevive_ao_tique.py`)
  — e agora com mais razão: um campo de texto sendo editado **não pode** ser
  reconstruído sob os dedos dela. A `A-TELA-SAMBA-01` curou o bloco que
  destruía nó em voo; **o seu campo de edição é exatamente o caso que ela
  protege**. Prove isso.
* **O segundo clique que não é engolido**, a recusa que diz o motivo, e o
  status do modo que não mente — os `test_a_06_*` continuam verdes.
* **A palavra da tela vem do glossário.** "Botão PS", "controle", "atalho".
  **"mesa" não entra.**

## A PROVA DE TELA — obrigatória

1. **A FOTO** antes e depois, `--oculta`.
2. **O CLIQUE**: digite uma combinação livre, veja-a chegar ao perfil, e veja o
   "Voltar ao padrão" ao lado **não** apagá-la.
3. **A MORDIDA** colada, uma por passo.
4. **NO TEMPO**: a régua de mutações da `A-TELA-SAMBA-01`, e em especial o
   campo de texto em edição sobrevivendo a 50 tiques com o cursor dentro.
