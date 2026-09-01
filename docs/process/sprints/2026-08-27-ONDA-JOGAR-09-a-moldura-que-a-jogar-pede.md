---
sprint: ONDA-JOGAR-09
posse:
  J9:
    - src/hefesto_dualsense4unix/app/app.py
    - src/hefesto_dualsense4unix/gui/main.glade
  J9b:
    - src/hefesto_dualsense4unix/app/mesa.py
cria:
  - tests/unit/test_a_moldura_da_jogar.py
bancada: false
depois_de:
  # A BANCADA DO `gui/main.glade` — XML único, sem seções nomeadas: conflito de
  # merge nele é irrecuperável na prática (SPRINT_ORDER.md §1.1, trava 2). Vinte
  # sprints o abrem, e por R5 elas correm EM SÉRIE, na ordem das ondas de
  # SPRINT_ORDER.md §1.2. As linhas abaixo são a fila inteira que vem ANTES desta:
  - EMULACAO-UM-DONO-SO-01
  - COOP-NA-CONEXAO-NATIVA-01
  - IDENTIDADE-01  # fechou em 54b7ffd2 (o app-id e a migração); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/home_actions.py
  - src/hefesto_dualsense4unix/app/actions/jogar/
  - src/hefesto_dualsense4unix/app/actions/footer_actions.py
---

# ONDA JOGAR · 09 — a moldura que a Jogar pede

**Onda:** JOGAR (aba 1). **A moldura é COMPARTILHADA com as outras nove abas.**
Se outra onda reivindicar `app.py`, `main.glade` ou `mesa.py`, esta sprint
**cede** e vira dependência dela — o que não pode é as duas escreverem.

## O defeito, em uma frase

Três coisas que o mockup da Jogar mostra **fora** do miolo estão erradas hoje:
a fita diz o motivo errado, o perfil ativo não aparece no topo, e o rodapé tem
um botão que o redesenho manda embora.

## Os quatro itens, medidos

### 1. A fita esmaecida diz o motivo errado

`app/app.py:1231`:

```python
"tab_home_box": _MOTIVO_ALVO_AINDA_NAO_LIGADO,
```

E `_MOTIVO_ALVO_AINDA_NAO_LIGADO` é, por escrito, **provisório** (`app.py:1208`):
*"esta frase é PROVISÓRIA, e a linha da aba sai do 'não lê' assim que a onda
dela ligar um leitor"*. A onda é esta, e a resposta é que a Jogar **nunca vai
ler**: os cards são leitura, nada aqui ajusta por controle. O motivo certo já
existe — `MOTIVO_ALVO_NAO_SE_APLICA` (`app/actions/config/mixin.py:33`), a
mesma frase que a Conexões usa por se desqualificar de propósito.

Mockup, no `title` da fita: *"Esta aba não usa o controle escolhido aqui — os
cards são leitura."* P1: *"onde a fita não se aplica, ela fica esmaecida com o
motivo certo — 'não se aplica', nunca 'ainda não ligamos o leitor'."*

### 2. O Perfil ativo não está no topo

Ela nomeou isto como a informação que lhe custou semanas:

> *"notei que faltou algo. No banner faltou o **Perfil ativo: Nome do Perfil**."*

> *"sempre terá o perfil ativo em cima pra falar o que diabos tamo fazendo em
> cada aba e onde isso impacta."* (`/tmp/coleta/decisoes.md:229`)

Hoje o perfil ativo mora em `status_active_profile`, um rótulo **dentro da aba
Status** (`main.glade:476`), escrito por `status_actions.py:2907`. Sobe para a
linha da fita, à direita, e vale nas dez abas. **Um escritor só** (P5): o que
já escreve continua escrevendo, e o topo lê dele.

### 3. A contagem do cabeçalho não diz o transporte

Mockup: `● 2 controles: 1 USB · 1 BT`. Hoje `texto_de_contagem`
(`app/mesa.py:91`) devolve `"2 controles"` — sem a quebra por transporte. E ela
usou a forma nova como motivo para tirar outra linha:

> *"vamos remover o 2 controles = 2 jogadores já que temos ● 2 controles: USB +
> USB"*

A palavra de cada transporte já existe e não se reescreve:
`palavra_do_transporte` (`home_actions.py:1338`).

### 4. O rodapé: "Voltar ao padrão" sai, "Exportar" entra

`main.glade:4269` — `btn_footer_restore_default`, rótulo *"Voltar ao padrão"*.
P7: *"'Voltar ao padrão' sai do rodapé: restaurar de fábrica é gesto raro e mora
na Sistema."* O mockup põe **Exportar** no lugar, fechando o par com Importar.

E o **recibo**, à esquerda dos quatro botões, nomeando o perfil:

> *"Anotado. Clique em **Aplicar** para valer agora — **Salvar Perfil** grava no
> perfil **Mortal Kombat**."*

Legenda do mockup: *"O recibo do rodapé nomeia o perfil — é onde a mudança vai
cair, que era a informação que faltava e te custou semanas."*

## Como se prova — o teste que MORDE

`tests/unit/test_a_moldura_da_jogar.py`

1. **A fita na Jogar está esmaecida com `MOTIVO_ALVO_NAO_SE_APLICA`** — o teste
   compara com a constante importada, não com o texto. E afirma que
   `_MOTIVO_ALVO_AINDA_NAO_LIGADO` **não** aparece para `tab_home_box`.
2. **O motivo chega ao ponteiro.** O teste percorre até o `EventBox` que
   carrega o tooltip (`status_actions.py:1697` — a fita insensível não dispara
   tooltip no GTK3) e lê o texto de lá. Ponha a frase na fita e reprova.
3. **O perfil ativo aparece no topo nas dez abas.** Um caso por aba, e cada um
   reprova sozinho.
4. **E é o MESMO texto do escritor único.** Troque o perfil ativo e os dois
   lugares mudam no mesmo tique. Um segundo escritor faz os dois divergirem, e
   é isso que o caso pega.
5. **A contagem com transporte, três casos**: `2 controles: 2 USB` ·
   `2 controles: 1 USB · 1 BT` · `3 controles: 1 USB · 2 BT`. E a palavra vem
   de `palavra_do_transporte`, comparada com a chamada direta.
6. **Um controle só ⇒ a contagem continua vazia**, como hoje
   (`mesa.py:108`) — a régua não pode acender uma linha nova na tela mais
   comum.
7. **`Voltar ao padrão` não existe no rodapé, e `Exportar` existe.** Duas
   afirmações, e a primeira reprova quem só adicionar o botão novo.
8. **O recibo nomeia o perfil ativo pelo nome** — com o perfil trocado, o texto
   troca junto.

## O que é dela decidir

1. **O `Exportar` exporta o quê?** O perfil ativo, ou uma seleção? O `Importar`
   de hoje carrega um `.json` de perfil (`main.glade:4262`); o par simétrico é
   exportar o perfil ativo.
2. **Para onde vai o "Voltar ao padrão"** na aba Sistema — o redesenho diz
   "Restaurar de fábrica", e é nome novo.
3. **O recibo aparece sempre, ou só com algo pendente?** No mockup ele está
   sempre lá. Sempre visível custa uma linha fixa no rodapé das dez abas.

## Fontes

- `layout/01-jogar.html`: `.cabecalho`, `.fita-linha`, `.rodape`.
- `/tmp/coleta/hoje.md`, falas [30] e [31]; `/tmp/coleta/decisoes.md:229`.
- `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, padrões P1, P5 e P7.
