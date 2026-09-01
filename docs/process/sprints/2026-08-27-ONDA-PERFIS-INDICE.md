---
sprint: ONDA-PERFIS-INDICE
# onda: PERFIS
posse:
cria:
  - docs/process/sprints/2026-08-27-ONDA-PERFIS-INDICE.md
bancada: false
depois_de: []
nao_toca:
  - src/
  - tests/
  - novo-layout/
---

# ONDA PERFIS — índice

**Nove sprints** que levam a aba Perfis do que o produto faz hoje até o que o
mockup aprovado mostra (`layout/10-perfis.html`), do frontal ao backend.

Contrato: `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md:688-775`.
Correções literais dela: `layout/_ferramentas/CORRECOES-DELA.md:62-80`.

## A ordem

| # | Sprint | Camada | Depois de | O defeito |
|---|---|---|---|---|
| 01 | [A casca que ela desenhou](2026-08-27-ONDA-PERFIS-01-a-casca-que-ela-desenhou.md) | frontal | — | dois blocos desiguais, cinco gestos que ela mandou tirar, três campos de regex crus |
| 02 | [Funciona em qual ambiente?](2026-08-27-ONDA-PERFIS-02-funciona-em-qual-ambiente.md) | ambas | 01 | sete contextos, três deles listas desta bancada; o desenho tem cinco |
| 03 | [Detectar o jogo que está aberto](2026-08-27-ONDA-PERFIS-03-detectar-o-jogo-que-esta-aberto.md) | ambas | 01, 02 | o daemon lê o exe da janela em foco e o IPC não publica |
| 04 | [O Estilo de Jogo](2026-08-27-ONDA-PERFIS-04-o-estilo-de-jogo.md) | ambas | 01, 02, 03 | seis abas para configurar um jogo de tiro; os seis presets de gênero competem por prioridade |
| 05 | [Voltar à de ontem](2026-08-27-ONDA-PERFIS-05-voltar-a-de-ontem.md) | frontal | 01–04 | toda gravação arquiva a anterior e a janela nunca ofereceu desfazer |
| 06 | [A coluna "Quando usar"](2026-08-27-ONDA-PERFIS-06-a-coluna-quando-usar.md) | frontal | 01–05 | "Só neste programa" para catorze perfis diferentes |
| 07 | [O perfil Universal](2026-08-27-ONDA-PERFIS-07-o-perfil-universal.md) | backend | 02, 04 | dois catch-all de fábrica com nomes que não explicam nada |
| 08 | [Um Salvar só](2026-08-27-ONDA-PERFIS-08-um-salvar-so.md) | ambas | 01–06 | dois botões de salvar que já miraram arquivos diferentes no mesmo instante |
| 09 | [O modo, a máscara e o Automático](2026-08-27-ONDA-PERFIS-09-o-modo-a-mascara-e-o-automatico.md) | ambas | 01–06, 08 | a decisão do "Automático" que um censo desta casa já derrubou |

## O que corre em paralelo, e o que não corre

**A onda é quase serial de propósito, e o motivo é um arquivo:**
`app/actions/profiles_actions.py` tem **4.546 linhas** e é tocado por oito das
nove sprints. Vale para ele a mesma regra que vale para o `main.glade` — um
dono por vez —, e o `depois_de` serializa em vez de proibir.

**O único par que corre em paralelo de verdade** é a **07** (que só toca
`profiles/loader.py` e `assets/`) contra a **05** e a **06**, depois que a 04
fechar.

**A 01 é o gargalo de todo mundo**, porque é ela que reescreve a faixa
`main.glade:2119-2695`. Nada começa antes dela.

## O que ela CORTOU, e por isso não virou sprint

O contrato da aba abre com *"Nasce um aviso no topo: '2 perfis nunca vão entrar
— veja quais'"* (D-O-AVISO-DE-PORQUE-O-PERFIL-NAO-ENTRA). **Ela cortou, duas
vezes:**

> *"tira ? ◆ 2 perfis nunca vão entrar — outro perfil os atropela sempre, por
> prioridade. veja quais"* — `CORRECOES-DELA.md:63`
>
> *"2 perfis nunca vão entrar — outro perfil os atropela sempre, por prioridade.
> isso tá fora de perfis também."* — idem, `:75-76`

O mockup aprovado não o desenha. **Não entra.** O detector
(`profiles/sanidade.py:358`, `verificar_perfis`) continua com um chamador só —
`cli/cmd_doctor.py:132` — e a queixa mais antiga desta casa (*"a config que eu
deixo nunca é respeitada"*) continua visível só por terminal. **Onde esse aviso
mora, se é que mora em alguma aba, é decisão dela.**

Igualmente cortados por ela, e portanto ausentes das nove: **"Salvar este
perfil"**, **"Esconder os controles físicos neste jogo"** e o carimbo **"Este
jogo já sabe por onde entra"** (*"Isso sai. Isso tá na aba Jogar."*).

## As perguntas que travam execução

Estas não são refinamento: sem a palavra dela, a sprint correspondente para.

1. **"Modo que liga" e "O jogo vê o controle como" ficam na aba Perfis?**
   A legenda do mockup diz que sim (`10-perfis.html:660`, *"ficaram, como você
   disse"*); **o mockup não os desenha** — são cinco campos, e nenhum deles é
   modo ou máscara (`10-perfis.html:569-618`). Trava a **01** (o que fazer com
   `profile_mode_frame`, `main.glade:2640`) e a **09** inteira.
2. **A máscara "Automático": A, B ou C.** O censo dos 24 jogos dela já mediu que
   a heurística prometida **erra em 13 de 14**
   (`integrations/api_de_entrada.py:12-49`), e o custo é assimétrico. Trava a
   **09**.
3. **O conteúdo dos oito estilos novos.** Só o FPS tem conteúdo aprovado por
   escrito. Trava metade da **04** — e o formato que funciona com ela é **ver**,
   não ler.
4. **"Terminal" sai junto com "Editor"?** A lista nova não o traz e a decisão
   escreveu o motivo só do Editor. Trava um item da **02**.
5. **"Esconder os controles físicos" sai daqui — e o gesto some da janela?**
   Os mockups da Sistema (`09-sistema.html:561`) e da Lançadores
   (`07-lancadores.html:510`) tocam no assunto, mas enquanto aquelas ondas não
   fecharem, tirá-lo da Perfis deixa a pessoa sem por onde marcar. Risco da
   **01**.
6. **Perfis em nono lugar na tira** contraria o que ela descobriu — que o perfil
   é quem manda (ressalva registrada em D-AS-DEZ-ABAS-E-SEUS-NOMES). É decisão
   de tira, não desta onda, mas muda o peso de tudo aqui.

## Colisões com as outras ondas do dia — quem coordena serializa

Nove ondas foram materializadas no mesmo dia. Estas sprints disputam arquivo com
sprints de fora desta onda, e **a declaração está aqui porque o `depois_de` só
alcança quem eu escrevi**:

| Arquivo | Quem daqui | Quem de fora |
|---|---|---|
| `gui/main.glade` | **01** (faixa `2119-2695`, declarada no frontmatter) | todas as outras nove ondas — XML único, sem seções nomeadas |
| `daemon/ipc_handlers.py` | **03** | CONEXOES-09, CONTROLES-04/05/06, GATILHOS-01, ILUMINACAO-03, SISTEMA-01, VIBRACAO-04/05/06 |
| `app/actions/footer_actions.py` | **08** | CONEXOES-09, GATILHOS-02, NAVEGACAO-09, SISTEMA-05 |
| `profiles/schema.py` | **09** | CONEXOES-06, CONTROLES-06, GATILHOS-04/05, NAVEGACAO-05/06/07, VIBRACAO-02/03/04/05/06 |
| `assets/profiles_default/` | **04**, **07** | NAVEGACAO-05 (o estilo point-and-click) |

O caso do `main.glade` é o de sempre: **recurso de bancada, uma sprint por vez**.
A faixa da Perfis não encosta na de nenhuma outra aba, mas o conflito de merge
num XML sem seções é irrecuperável na prática — logo a serialização é de
calendário, não de linha.

**A dupla mais perigosa é `assets/profiles_default/`**: a ONDA-PERFIS-04 tira os
seis perfis de gênero da semeadura e a ONDA-NAVEGACAO-05 mexe no
`point_and_click.json` — que é **um dos seis**. As duas têm de conversar antes
de qualquer uma salvar.

## Nota de processo — o campo `onda:` não existe no portão

O frontmatter pedido para esta leva traz `onda: <ABA>`. O analisador de
`scripts/check_colisao_de_sprints.py:83` conhece **seis** campos —
`sprint, posse, bancada, cria, depois_de, nao_toca` — e **recusa o que não
entende**, por escrito (`:96-101`): um campo desconhecido é `FormatoInvalido`,
não um aviso.

Medido: um frontmatter com `onda:` reprova com
`campo desconhecido 'onda'`. As nove sprints desta onda gravam a onda **num
comentário** logo abaixo do `sprint:` (comentário é linha pulada pelo
analisador) e no próprio id (`ONDA-PERFIS-NN`), para não deixar o portão
vermelho.

**Quem quiser o campo de verdade acrescenta `"onda"` a `_CAMPOS_CONHECIDOS`** —
está fora do que esta materialização podia tocar.
