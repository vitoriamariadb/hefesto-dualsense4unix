---
sprint: CONTINUACOES-01
estado: absorvida
---

> **ESTADO 06/09/2026: absorvida** — pela regra da §3 do `SPRINT_ORDER.md`
> (*"história — não remedidas desde 27/08; o resto, se ainda faltar, é linha do
> CSV"*): o que desta sprint ainda faltar é linha de `docs/data/paridade-gtk-html.csv`
> ou célula de `docs/data/mapa-controles.csv`, e é lá que se cobra. **Se você achar
> aqui um defeito vivo que não está em nenhum dos dois, ele é seu: abra a linha.**

# CONTINUAÇÕES-01 — o que cinco agentes deixaram declarado

**23/08/2026.** **GRAU: CONFERIDO CONTRA A ÁRVORE** — cada item abaixo foi
reconferido no fonte de hoje, e o `arquivo:linha` é o desta árvore, não o do
relatório de origem. Onde a árvore desmentiu o relatório, está escrito.

Cinco executores consertaram a aba Configurações em paralelo, cada um dono
exclusivo de um conjunto de arquivos. A disciplina evitou colisão e produziu um
efeito colateral **previsto**: cada um parou onde começava o arquivo do vizinho,
e declarou a continuação no relatório. Este documento é onde essas continuações
deixam de morrer em relatório.

**O que ela NÃO é:** um segundo plano da aba. A
[CONFIGURAÇÕES-FECHA-01](2026-08-24-CONFIGURACOES-FECHA-01-o-aplicar-que-nao-responde-e-o-campo-que-apaga-o-arquivo.md)
já adotou seis das dez continuações, com tarefa, mordida e agente. Repetir o
conserto aqui criaria duas versões da mesma instrução — §3 encaminha e não
reescreve.

---

## 1. Três FECHARAM hoje — não refaça

O conferente da leva marcou os três como "do maestro". **Os três estão curados
na árvore, com teste que morde.** Estão aqui porque um item já pago que entra na
próxima lista como aberto faz alguém repetir trabalho — que é o defeito que este
documento existe para evitar.

| o que era | onde está a cura | a mordida que já roda |
|---|---|---|
| **"Aplicar e fechar" encerrava mesmo com a gravação recusada** — a declaração morria com o processo, sem uma palavra | `app/app.py:558-573`: o retorno de `_gravar_declaracao_de_maquina` segura a janela e o motivo sai no rodapé | `tests/unit/test_a5_fechar_a_janela_nao_perde_a_declaracao.py:197` (`test_recusa_da_gravacao_impede_o_encerramento`) |
| **O botão do orçamento mostrava o disco enquanto o rodapé dizia "há pendência"** | `app/actions/config/secao_orcamento.py:167` (`orcamento_na_tela`), ao lado de `orcamento_em_vigor` (`:139`) — a razão de existirem **duas** está escrita em `:170-194` | `tests/unit/test_orcamento_dono_unico_do_valor_efetivo.py:318` e `:346`, as duas direções |
| **A marca do rodapé não acendia no clique** — só ao trocar de aba | `app/actions/footer_actions.py:325` (`_marcar_declaracao_por_aplicar`), chamada nos **três** pontos de escrita: `secao_controles.py:1052`, `secao_orcamento.py:306`, `secao_mesa.py:1328` | `tests/unit/test_a_marca_acende_no_clique.py:88` (`test_as_tres_secoes_pedem_a_marca`) |

---

## 2. Um número do relatório que a árvore corrigiu

O relatório do conferente diz **"de 27 pontos de dica, 24 são invisíveis"**. A
contagem desta árvore, com o instrumento declarado:

```bash
grep -c "set_tooltip_text\|set_tooltip_markup" \
  src/hefesto_dualsense4unix/app/actions/config/*.py \
  src/hefesto_dualsense4unix/app/widgets/external_card.py    # 22 + 4 = 26
grep -n '"?"' src/hefesto_dualsense4unix/app/widgets/external_card.py \
  src/hefesto_dualsense4unix/app/actions/config/*.py          # 2 construtores
```

**26 pontos de dica, 3 com `?` visível** (`_ajuda`, `external_card.py:561`, usado
em `:285` e `:370`; `_subcabecalho`, `secao_mesa.py:539`, usado em `:422`). O
27/24 sai; o 26/3 fica, e é o mesmo número que a FECHA-01 usa na T9 — as duas
páginas concordam de propósito.

---

## 3. Seis continuações já têm dono — encaminhamento, não instrução

| continuação declarada | onde ela vive agora |
|---|---|
| `descartados` é devolvido e ninguém consome (`utils/maquina.py:321-333` → `daemon/ipc_handlers.py:4872` → `app/ipc_bridge.py:775` → `footer_actions.py:302-311`) | FECHA-01 **T2**, com as três costuras na ordem |
| A assimetria do A2: a escrita resgata campo a campo (`maquina.py:373`), a leitura ainda devolve documento vazio com qualquer campo inválido (`maquina.py:313-318`) | FECHA-01 **T1** — e lá está dito que a invariante "nunca levanta" **não** muda |
| O `?` visível nos títulos de seção (`moldura.py:74` põe a dica no rótulo e nada mais) | FECHA-01 **T9**, com a triagem em duas pilhas |
| As 26 dicas sem afordância | FECHA-01 **T9** (mesma tarefa) |
| As curas arrancáveis sem nada ficar vermelho | FECHA-01 **T7** — e lá o número **onze** está marcado `NÃO VERIFICADO`, com o método de refazer o censo |
| "Não sei" inalcançável em Ambiente, Modo e Microfone | FECHA-01 **T4** |

**As quatro curas mais graves do censo, conferidas aqui** (o resto das onze fica
com a T7, que as remede): nenhuma delas é nomeada por teste nenhum hoje —

```bash
grep -rln "_sem_chave_repetida\|_cor_na_tela\|_tom_da_cor\|uniqs_no_radio" tests/
# só tests/unit/test_a_luz_nao_acende_o_botao_do_card.py, e por outro motivo
```

1. **a cor declarada vencer a lida** — `secao_controles.py:1474` (`_tom_da_cor`)
   e `:1454` (`_cor_na_tela`), que executam a decisão dela de 21/08;
2. **chave repetida repintando o card vizinho** — `secao_controles.py:1377`
   (`_sem_chave_repetida`), o CLONE-01 voltando pela porta dos fundos;
3. **`sysfs` ilegível virando "todos caíram"** — `secao_controles.py:265`
   (`uniqs_no_radio`), cuja terceira resposta (`None`) é a razão da função
   existir;
4. **o exame voltando para a thread do GTK** — `secao_exame.py:342`
   (`GLib.idle_add`), sem o qual o worker escreve widget de fora da thread.

---

## 4. Quatro continuações SEM dono — e é o que esta sprint entrega

Carimbo de tela na régua da **D3**: **[COSMÉTICA]** pré-aprovada ·
**[ESTRUTURAL]** espera o olho dela ANTES · **[SEM TELA]** não muda um pixel.

### C1 — o X não fecha a janela quando o diálogo fica inalcançável · **[ESTRUTURAL]**

`app/app.py:551-556`: `executar_dialogo(..., resposta_de_socorro=CANCEL)`. O
socorro existe porque um diálogo modal invisível já travou a janela inteira dela
(`gui_dialogs.py:139-158`, 06/08). **O preço está declarado e é o certo**: perder
a declaração é pior que não fechar. O que falta é a tela dizer isso — hoje o X
simplesmente não responde, e a única saída é o "Sair" da bandeja.

**O conserto:** quando `executar_dialogo` cai no socorro, o rodapé diz por que a
janela ficou de pé e nomeia o "Sair" da bandeja. Nada muda no default.

**A mordida:** minar `executar_dialogo` para devolver o socorro e exigir que
`on_window_delete_event` devolva `True` **e** que a frase saia no rodapé.
Arranque a frase: **VERMELHO**. Sem a segunda metade o teste só reprova o que a
`test_a5_*.py:139` (`test_o_default_e_cancelar`) já cobre.

**Custo:** ~10 linhas de produto, ~30 de teste; 30 min + a redação dela.

### C2 — o portão da palavra de tela é cego a aba montada em Python · **[SEM TELA]**

`scripts/validar-palavra-de-tela.py:12-17` declara o alcance: **só o
`main.glade`**, e o rótulo montado em Python fica de fora **de propósito** —
varrer código atrás de "isto aparece na tela?" produz falso positivo em nome de
variável e mensagem de log. **O argumento continua válido; o que mudou foi o
tamanho da lacuna:** a aba Configurações são 4.605 linhas de Python
(`app/actions/config/`) com 100% do texto de tela em código. O portão não é
falso — ele é honesto sobre não olhar —, mas uma aba inteira nasceu fora dele.

**O conserto, e ele não é varredura:** uma segunda fonte **estreita**, por AST,
com lista explícita de origens de texto de tela — `TITULO` e `DICA` de cada
módulo de seção (`secoes.py:39` já as enumera), as constantes `DICA_*` de
`app/actions/config/` e de `external_controllers.py`, e o **primeiro argumento
literal** de `moldura_de_secao`, `rotulo_de_apoio` e `_subcabecalho`. Fora
dessa lista, nada é lido.

**A mordida, e são duas:** (a) pôr um rótulo começando em minúscula em
`secao_janela.DICA` tem de reprovar; (b) **renomear uma das origens da lista tem
de reprovar com "alvo desconhecido", nunca passar verde** — a lista que não
encontra o que procura é o portão verde que não mede nada, e é a família da
[GATILHO-NÃO-PERDIDO-01](2026-08-23-GATILHO-NAO-PERDIDO-01-a-regua-perguntou-pelo-campo-errado.md).

**Custo:** ~70 linhas de portão, ~40 de teste; 1 h 30.

### C3 — "Jogador" 1..5 não tem "não sei", e a dica promete o que não existe · **[ESTRUTURAL]**

É o **quarto** campo sem "não sei" — a T4 da FECHA-01 cobre Ambiente, Modo e
Microfone, e não este.

`external_card.py:57` (`JOGADORES = 5`) e `:374` (`_linha_do_jogador`) montam um
`SegmentedSelector`, que é grupo de rádio: escolhido um número, **não há gesto
que volte**. E a dica (`external_card.py:63`) afirma o estado inalcançável:

> *"Fixa este controle num número de jogador. Sem nenhum marcado, vale a ordem de
> chegada — que é como o Hefesto trabalha por padrão."*

O daemon não tem verbo para desafixar: `identity.number.set`
(`daemon/ipc_handlers.py:1514`) **permuta** os lugares dos presentes
(`:1549-1555`) e recusa qualquer `number` menor que 1 (`:1567-1571`). O que a
lista de rádio não oferece, o protocolo também não.

**Duas saídas, e a escolha é dela:**

- **(a)** verbo novo — devolver o lugar à ordem de chegada, o que mexe na
  semântica da fila de preferência que o `identity.renumber` também escreve.
  ~60 linhas de produto, ~80 de teste, mais a medição da fila; **3 h**;
- **(b)** a dica para de prometer: some a segunda frase. **2 linhas**, e a
  redação é dela.

**A mordida (vale para as duas):** um teste que leia os ids do seletor de jogador
e o texto de `DICA_DO_JOGADOR`, e reprove a dica falar de "sem nenhum marcado"
enquanto nenhum id alcançar esse estado. Arranque a cura escolhida: **VERMELHO**.

### C4 — "Outra" com o campo livre vazio afunda o botão e declara `None` · **[ESTRUTURAL]**

`app/widgets/external_card.py:401-403`:

```python
if escolha == ID_DE_OUTRA_COR:
    texto = "" if self._campo_livre is None else self._campo_livre.get_text()
    self._declarar("cor", texto.strip() or None)
```

O botão "Outra" fica afundado e o disco não guarda nada. **É o mesmo defeito do
Ambiente na T4 por outra porta:** a tela afirma uma escolha que ela não fez — e
aqui ela até clicou, mas o que ficou registrado é "não sei", sem nada dizendo
isso.

**Duas saídas, e a escolha é dela:** "Outra" sem texto não afunda (o seletor
volta ao estado anterior ao perder o foco); ou afunda e a tela mostra que está
incompleto.

**A mordida:** escolher "Outra", não digitar, e exigir que `_maquina_pendente` e
o botão afundado **concordem**. Hoje divergem, e nenhum teste olha.

**Custo:** ~15 linhas de produto, ~35 de teste; 45 min + a decisão dela.

---

## 5. Pendente do olho dela — os oito textos, numa lista só

Classe estrutural: **texto novo de tela, e a palavra final é dela.** Três já
estão marcados `PROVISÓRIO` no código; **os outros cinco não estão, e marcar é a
metade barata do trabalho** — sem a marca, a próxima pessoa lê texto não
revisado como texto aprovado.

| texto | onde | marcado `PROVISÓRIO`? |
|---|---|---|
| *"Você declarou escolhas que ainda não foram aplicadas."* | `app/app.py:534` | sim (`:528`) |
| *"Fechar agora descarta o que você escolheu na aba Configurações."* | `app/app.py:542` | sim (`:528`) |
| os três botões: "Cancelar" · "Fechar sem aplicar" · "Aplicar e fechar" | `app/app.py:546-548` | sim (`:528`) |
| *"Há escolhas declaradas por aplicar — clique em 'Aplicar'."* | `footer_actions.py:342` | sim (`:341`) |
| *"Configurações gravadas."* | `footer_actions.py:308` | **não** |
| *"o daemon não respondeu"* (selo do medidor sem daemon) | `secao_mesa.py:299` | sim (`:298`) |
| o texto do leitor de tela do medidor | `secao_mesa.py:1566` (`_texto_acessivel`) | **não** |
| *"Apaga o que foi declarado aqui. O Hefesto volta a não saber."* | `external_controllers.py:476` (`DICA_DE_NAO_SEI`) | **não** |

*"Configurações gravadas."* está **também** na T3 da FECHA-01, que a transforma
em três frases. Se a T3 rodar primeiro, esta linha da tabela morre com ela.

---

## 6. A regra que fica

**Posse exclusiva de arquivo em execução paralela produz continuação na
fronteira — sempre, e isso não é defeito do método.** O defeito é a continuação
ficar no relatório: o relatório morre no `/clear`, o arquivo não.

Quem para porque o próximo arquivo é do vizinho entrega **duas** coisas: a cura
que coube e a continuação escrita com `arquivo:linha`. Foi o que os cinco
fizeram, e é por isso que este documento pôde ser escrito sem reabrir uma
investigação.

**E o carimbo importa mais aqui que em qualquer outro lugar:** das dez
continuações desta leva, **seis** encostam em texto de tela. Executá-las sem o
olho dela seria entregar dez telas novas de uma vez, que é exatamente o que a
[PROVA-DE-TELA-01](2026-07-27-PROVA-DE-TELA-01-dez-minutos-de-olho-antes-de-qualquer-leva.md)
proíbe.

A receita de execução continua sendo a
[COMO-EXECUTAR](2026-08-21-ABA-CONFIGURACOES/COMO-EXECUTAR.md) daquela leva, e
as decisões que mandam nos "não sei" continuam na
[DECISOES-ABERTAS](2026-08-21-ABA-CONFIGURACOES/DECISOES-ABERTAS.md) — nenhuma
das duas se reescreve aqui.
