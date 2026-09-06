---
sprint: O-CORTE-DO-CLEAN-ROOM
estado: absorvida
---

> **ESTADO 06/09/2026: absorvida** — pela regra da §3 do `SPRINT_ORDER.md`
> (*"história — não remedidas desde 27/08; o resto, se ainda faltar, é linha do
> CSV"*): o que desta sprint ainda faltar é linha de `docs/data/paridade-gtk-html.csv`
> ou célula de `docs/data/mapa-controles.csv`, e é lá que se cobra. **Se você achar
> aqui um defeito vivo que não está em nenhum dos dois, ele é seu: abra a linha.**

# O CORTE DO CLEAN-ROOM — o que saiu, e por quê

**29/08/2026.** A corrente `CR-03 → CR-04 → CR-06` sai do disco. Este arquivo é o
mapa para achá-la de volta, e a conta do que se perde.

**A decisão é dela**, e veio em duas falas. Perguntada sobre a CR-03 — retida pela
faxina de 27/08 justamente por ser elo de corrente —, respondeu primeiro:

> *"corta essa sprint"*

Posta na mesa a consequência (cortar um elo do meio deixa as duas pontas sem
sentido), respondeu:

> *"Corta a corrente inteira"*

**A razão dela:** as três só faziam sentido juntas — sem a bancada de medir
(CR-03) não há efeitos da casa (CR-04), e sem eles não há o que devolver ao
ecossistema (CR-06). O Hefesto passa a viver com o catálogo de efeitos que já tem.

Isso **substitui** a ordem dela de 26/08 que as preservava
(`docs/process/2026-08-26-CENSO-as-sprints-que-os-desenhos-substituem.md:79`,
*"Preservadas por ordem dela (specs e bancada) — nenhuma tocada: … CR-03/04/06"*) —
a fala mais recente vence, e o git guarda o histórico. É a mesma regra que a
[faxina de 27/08](2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md) aplicou dois dias
antes. A decisão está gravada em `docs/data/decisoes-dela.csv`,
`D-A-CORRENTE-DO-CLEAN-ROOM-SAI`.

**Como achar de volta:**

```bash
git log --diff-filter=D --oneline -- docs/process/sprints/   # o commit que apagou
git show <commit>^:docs/process/sprints/<arquivo>            # o texto inteiro
```

---

## O ERRO DE QUEM COORDENA, e ele mudou o tamanho do corte

**As seis sprints do clean-room foram apresentadas a ela como se fossem trabalho
pendente. Três estavam ENTREGUES.** Ela decidiu "corta a corrente inteira" sobre
uma premissa falsa.

O erro foi medido e corrigido **antes** de executar, e por isso o corte que saiu
não é o corte que a pergunta pedia:

| Sprint | Como foi apresentada | Estado real, medido |
|---|---|---|
| CR-01 posição jurídica | pendente | **ENTREGUE em 07/08** — a decisão MIT/CC0 é dela e está no `NOTICE` |
| CR-02 formato e proveniência | pendente | **ENTREGUE em 31/07** — teste vivo `tests/unit/test_cr02_curva_propria_proveniencia.py`, 50 casos, mordida provada por arrancamento |
| **CR-03** a bancada de medição | pendente | **ABERTA** ← sai |
| **CR-04** os efeitos da casa | pendente | **ABERTA** ← sai |
| CR-05 o `NOTICE` | pendente | **ENTREGUE em 31/07, FECHADA em 07/08** — teste vivo `tests/unit/test_cr05_licencas_de_terceiros_viajam.py` |
| **CR-06** publicar as curvas | pendente | **ABERTA** ← sai |

**Saem só as três ABERTAS.** Apagar as três entregues seria apagar registro de
trabalho feito e testado — o oposto exato da regra desta casa (*não se apaga
decisão medida*), e um custo já pago que alguém teria de pagar de novo.

Esta casa escreve os erros de quem coordena porque o processo é a entrega tanto
quanto o código. O padrão já tem nome e já está na memória desta casa desde
27/08: **o enunciado também carrega fato errado.** A defesa é a mesma de sempre —
conferir o enunciado contra a fonte antes de propagar. Aqui a conferência custou
uma leitura das seis sprints e evitou apagar três entregas.

---

## As TRÊS que saíram

| Sprint apagada | O que ela pedia | O que fica no lugar |
|---|---|---|
| `2026-07-25-CR-03-bancada-de-medicao.md` | Uma tela onde se mexe nos sete parâmetros ao vivo, aperta o gatilho, sente, ajusta e salva com nome — a leitura de L2/R2 na mesma tela, o comparar A/B, o aplicar em qualquer controle conectado, e a posse explícita do hidraw enquanto aberta | **Nada.** É a única das três com entregas sem herdeiro — ver *O que se perde*, abaixo |
| `2026-07-25-CR-04-os-efeitos-da-casa.md` | O conjunto de efeitos com nome do Hefesto (`Pesado`, `Macio`, `Trepidante`, `Trava`, `Dois Estágios` eram hipóteses de partida), cada um medido na bancada, em mais de um controle, com a nota de sensação de quem mediu | **Nada.** A [ONDA-GATILHOS-05](2026-08-27-ONDA-GATILHOS-05-meus-efeitos-ganham-tela.md) dá a **porta** — o catálogo no disco dela e o "Guardar esse efeito" com proveniência —, mas não produz efeito nenhum: quem produz é a mão dela |
| `2026-07-25-CR-06-devolver-ao-ecossistema.md` | Publicar as curvas da CR-04 como material livre em `CC0-1.0`, num formato independente do Hefesto, com o método documentado e o anúncio a quem está preso na mesma parede | **Nada.** Sem curva medida não há artefato a publicar |

**Nenhuma das três tinha medição.** Conferido arquivo a arquivo antes de apagar:
49, 73 e 84 linhas de objetivo, entregas e critério, com **15 caixas `- [ ]` e
zero `- [x]`**. São plano.

---

## O que se perde — e é honesto dizer que é caro

**O Hefesto deixa de ter caminho para um catálogo de efeitos de gatilho medido em
casa.** A consequência mais direta:
`docs/protocol/curvas-proprias.md` **nunca será preenchido** por esta série. Ele
fica de pé como registro de proveniência — a regra R3 continua normativa e o
portão continua montado —, mas a tabela de efeitos permanece vazia até que alguém
meça uma curva por outro caminho.

**As quatro entregas que ficam sem dono nenhum** — são da CR-03 e nenhuma das 90
sprints novas as reivindica:

1. a **barra analógica de L2/R2 na mesma tela** dos parâmetros, para ver a
   resposta enquanto se aperta;
2. o **comparar A/B** entre dois conjuntos de valores sem perder o ajuste — sem
   ele, calibrar por sensação vira adivinhação;
3. o **aplicar em qualquer um dos controles conectados**, não só no primário (a
   sensação muda entre aparelhos, e é isso que a proveniência registra);
4. a **posse explícita do hidraw** enquanto a bancada está aberta — o cuidado que
   a `CR-SEQUENCIA-01`/E3 acrescentou por causa do `display_authority` caindo
   sozinho.

**O que NÃO se perde, e vale corrigir aqui:** *"mexer e sentir"* não morre com a
CR-03. O live-preview já existe no produto
(`app/actions/triggers_actions.py:322`, `_schedule_live_preview`) e sobrevive nas
ondas de Gatilhos. O que morre é a bancada dedicada, com A/B e leitura de gatilho
ao lado.

---

## O que NÃO se perde

**As três entregues ficam de pé, cada uma com régua viva:**

- **CR-01** — a posição jurídica registrada com data, e a decisão dela de 07/08
  (*MIT no código, CC0-1.0 nas curvas*).
- **CR-02** — o formato que **recusa** valor sem proveniência.
  `profiles/curva_propria.py` não instancia um efeito com `medido_por`,
  `controle` ou `nota` vazios. Régua: `tests/unit/test_cr02_curva_propria_proveniencia.py`.
- **CR-05** — o `NOTICE` declarando toda a proveniência de terceiros. Régua:
  `tests/unit/test_cr05_licencas_de_terceiros_viajam.py`.

**As quatro regras do processo (R1–R4) continuam normativas.** O que caiu foi o
*plano de medir*, não a *regra de como entra o que for medido*: qualquer valor de
curva que chegue a este repositório, com bancada ou sem, entra por R1, R2, R3 e
R4. `docs/process/CLEAN-ROOM.md` fica, com as três linhas riscadas e a razão do
risco.

**A decisão dela de 07/08 não é apagada com as sprints.** Ela aparecia dentro da
CR-04 (`:53-67`) e da CR-06 (`:40-53`) — mas ali era **cópia**. O lar canônico é
`docs/process/2026-08-07-DECISOES-DELA-as-onze-respostas-do-painel.md` (resposta
2) e o `NOTICE`, seção *"A LICENÇA DAS CURVAS PRÓPRIAS"* (`NOTICE:279`), com
teste vivo cobrando a frase.

**O resíduo que parecia morar só na CR-06 não morre com ela.** A instrução de pôr
a linha `"licenca": "CC0-1.0"` **dentro** do arquivo de dados publicado, e o texto
canônico em `LICENSES/CC0-1.0.txt` quando o artefato existir, já está escrita em
`NOTICE:304-306`. Medido antes de apagar; nada precisou mudar de casa.

---

## A CR-SEQUÊNCIA-01 não vai junto, e a razão é uma decisão dela em aberto

`2026-07-31-CR-SEQUENCIA-01-o-que-avanca-sem-a-mao-dela-e-o-que-nao.md` sequencia
a série inteira, e **metade dela caducou hoje** (a E3 era a bancada; a E4, a parte
dela). Ela fica, com lápide, por três coisas que sobrevivem ao corte:

1. **A E5, ABERTA e DELA** — se o `(Rigid)`, o `(Bow)` e o `(Galloping)` ficam nos
   rótulos dos dezenove presets. É a decisão irmã da
   [GATILHO-PALAVRA-01](2026-07-29-GATILHO-PALAVRA-01-os-dezenove-modos-em-portugues.md),
   que está na fila ativa (Onda 8 · Gatilhos). Apagar a sprint apagaria uma
   decisão dela em aberto.
2. **A medição de 31/07** — os 133 arquivos rastreados que citam DSX, separados
   pelo lado da fronteira R4, e a prova de que `DSX_CANNED_TRIGGER_MODES`
   (`daemon/udp_server.py:149-163`) existe só para falhar alto.
3. **A colisão literal do nome `Rigid`**, que é o achado que motivou a E5.

**O corte não derruba a seção *"Por que a CR-04 não avança sem ela"*.** Ela
explica por que um número inventado por um agente não tem defesa, e isso continua
sendo doutrina desta casa para qualquer curva futura. Caducou a sprint que ia
produzir as curvas, não a razão de a mão dela ser obrigatória.

---

## O preço medido, no portão

`scripts/validar-referencias-docs.py --all` (portão `completo|referencias-docs`)
reprova link markdown cujo alvo não existe.

**Linha de base, medida com a árvore limpa ANTES deste corte: 9 referências
mortas em 540 documentos** — todas em sprints `2026-08-27-ONDA-*` que citam
módulos de widget e de ação que ainda vão nascer. **Nenhuma tem relação com o
clean-room** — o portão já estava vermelho, e "verde depois do corte" não podia
ser o critério de aceite. (A lista nominal sai do próprio portão; repeti-la aqui
custaria sete referências mortas novas, medido.)

**O corte cria 10 referências mortas novas** se ninguém tratar os ponteiros:
`SPRINT_ORDER.md:271,449,450,451` · `curvas-proprias.md:9,24,26,62` ·
`CR-01:72` · `INDICE-o-que-falta-depois-da-v030:66`.

**Depois dos tratamentos deste manifesto: 9 — nenhuma nova.** As dez foram
repontadas ou reescritas, uma a uma, na mesma leva do apagamento.

Os ponteiros em `docs/process/arquivo/` e `docs/process/agentes/` não precisaram
de nada: os dois prefixos estão isentos por decisão escrita em
`scripts/validar-referencias-docs.py` (`PREFIXOS_IGNORADOS`) — *um relatório cita
o caminho que existia no instante da medição; corrigir esses caminhos falsificaria
o registro*.

---

## O que ficou ABERTO, e é frente de código

**Uma referência à CR-04 continua viva dentro do produto, e nenhum portão a
enxerga.** A string `_(nenhum ainda — ver CR-04)_` é **emitida por código**
(`src/hefesto_dualsense4unix/profiles/curva_propria.py:300`), publicada dentro do
bloco gerado de `docs/protocol/curvas-proprias.md:58`, e exigida **literalmente**
por três réguas vivas: `scripts/gerar-tabela-de-curvas.py --check` (portão
`rapido|curvas`), `tests/unit/test_tabela_de_curvas_e_gerada.py:56` e
`tests/unit/test_cr02_curva_propria_proveniencia.py:270,328`.

Depois deste corte, o produto aponta a usuária para uma sprint que não existe — e
**as réguas continuam verdes**, porque conferem a *string*, não o *arquivo*. É
literalmente o padrão que esta casa batizou de *a régua confunde a PALAVRA com o
ATO*.

**Não foi consertado aqui de propósito:** é transação de quatro arquivos em
`src/`, `scripts/` e `tests/` — trocar o literal, atualizar os dois testes, rodar
o gerador para reescrever o bloco. Editar a linha à mão em `curvas-proprias.md`
reprovaria o portão `curvas` e dois testes. Fica nomeado aqui para quem abrir a
frente.

O que **foi** consertado, porque a [ONDA-GATILHOS-05](2026-08-27-ONDA-GATILHOS-05-meus-efeitos-ganham-tela.md)
transcreve a lápide *verbatim* e declara aquele arquivo em `nao_toca:`: o
`O QUE FECHA: a CR-04` de `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py`
passou a nomear a ONDA-GATILHOS-05, no mesmo commit em que as três saíram.

---

## Os ponteiros que NÃO foram tocados, e por quê

Onze arquivos citam as três e **não mudaram uma vírgula**. Todos pela mesma razão:
são retrato datado, e retrato não se reescreve.

| Arquivo | Por que fica intacto |
|---|---|
| `2026-07-25-CR-05-proveniencia-completa-do-notice.md` | **zero** citações às três, medido. Quem citava a CR-05 era a CR-06, não o contrário |
| `2026-07-25-INDICE-leva-quatro-controles.md` | registra a fala literal dela de 25/07 (*"essas não faremos hoje"*). Verdadeira sobre aquele dia |
| `2026-07-26-INDICE-o-que-falta.md`, `2026-07-26-INDICE-a-fila-do-jogador.md`, `2026-07-30-INDICE-as-tres-faixas-depois-da-v040.md` | filas datadas, sucedidas pelo `SPRINT_ORDER.md`. A última é uma confissão do que aquele levantamento **não** mediu — o gênero de linha que esta casa guarda inteiro |
| `arquivo/agentes-2026-08-06/decisoes/as-17-sprints-de-25-07.md` | medição datada de 06/08 conferida contra a árvore daquele dia; prefixo isento no portão |
| `agentes/2026-08-26/LEVA-4-E.md` | saída bruta de agente; prefixo isento no portão |
| `estudos/2026-07-29-mapa-total-...md` | retrato sobre HEAD declarado (`e8e18b9`), com a fala dela transcrita |
| `estudos/2026-07-31-auditoria-geral-...md` | a linha *"CR-03 … zero commits que a citem"* é **prova a favor do corte**. A CR-03 morreu sem um commit, exatamente como a auditoria previu |
| `estudos/2026-08-03-o-backlog-real-...md` | retrato verificado sobre HEAD `19acbeb`; descreve a topologia `CR-03 → CR-04 → CR-06` que é a premissa da própria razão dela |
| `CHANGELOG.md:2794`, `DECISOES.md:160` | registro datado de release e de pergunta já respondida; citam por nome solto, sem link |
