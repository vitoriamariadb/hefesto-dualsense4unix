# ONDA GATILHOS — o índice

**27/08/2026.** Sete sprints que levam a aba **Gatilhos** do produto de hoje até
o mockup que ela aprovou.

> *"aba gatilhos perfeita. Parabéns."*
> — `novo-layout/_ferramentas/CORRECOES-DELA.md:27-28`, marcada **FECHADA, não
> tocar**

O alvo é `novo-layout/03-gatilhos.html` (gerador:
`novo-layout/_ferramentas/aba03.py`). O contrato é a seção 3 de
`docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md` (linhas 242-303). O antes é
`docs/usage/assets/readme_gatilhos.png`.

## A ordem

```
01 ─┬─ 02 ─┬─ 03 ─── 04 ─── 05 ─┐
    │      │                    ├─ 07
    │      └─ 06 ───────────────┘
```

| # | Sprint | Camada | Depois de | Tamanho |
|---|---|---|---|---|
| 01 | [o "Desligado" que não desliga](2026-08-27-ONDA-GATILHOS-01-o-desligado-que-nao-desliga.md) | backend | — | ~40 linhas |
| 02 | [um quadro só, e a tela que não pula](2026-08-27-ONDA-GATILHOS-02-um-quadro-so-e-a-tela-que-nao-pula.md) | frontal | 01 | ~450 linhas (Glade) |
| 03 | [o recibo dos dois lados](2026-08-27-ONDA-GATILHOS-03-o-recibo-dos-dois-lados.md) | ambas | 02 | ~60 linhas |
| 04 | [o "Efeito pronto" não brota, e tem nome](2026-08-27-ONDA-GATILHOS-04-o-efeito-pronto-nao-brota-e-tem-nome.md) | ambas | 02, 03 | ~120 linhas |
| 05 | ["Meus efeitos" ganham tela](2026-08-27-ONDA-GATILHOS-05-meus-efeitos-ganham-tela.md) | ambas | 04 | ~300 linhas |
| 06 | [os dois nomes em inglês](2026-08-27-ONDA-GATILHOS-06-os-dois-nomes-em-ingles.md) | frontal | 02 | ~5 linhas |
| 07 | [a prova de tela](2026-08-27-ONDA-GATILHOS-07-a-prova-de-tela.md) | conferência | 01-06 | zero código |

## Por que esta ordem, e não outra

**01 vem antes de 02** porque a 02 apaga os dois botões "Desligar", e hoje só
eles soltam a trava manual: escolher o modo *Desligado* na grade a **arma**
(`daemon/ipc_handlers.py:1240` contra `:1256`). Invertida, a ordem abriria uma
janela em que a troca automática de perfil fica pausada e calada — o defeito que
a R-19 curou uma vez.

**02 é a única que abre o `main.glade`.** XML único, sem seções nomeadas:
conflito de merge nele é irrecuperável na prática. Por isso ela cria, de uma
vez, **todos** os buracos de que 03, 04 e 05 precisam (`trigger_recibo`,
`trigger_<side>_pronto_slot`, `trigger_guardar_efeito`), e as três seguintes só
tocam Python.

**06 corre em paralelo com 03-05** — toca `trigger_specs.py`, que nenhuma outra
toca. Só espera a 02 porque as duas mexem em
`tests/unit/test_gatilho_palavra_rotulos.py`.

**07 é de quem coordena**, e roda com a leva fechada:
`scripts/gui-captura/retratar_abas.py` reescreve as onze fotos de uma vez, e
agente executor não o roda (`COMO-EXECUTAR-UMA-SPRINT.md`, §5).

## O que a onda fecha, em uma linha cada

- **A tela para de pular** — a caixa de ajustes ganha altura fixa e a linha
  "Efeito pronto" para de brotar (eram ~110 px de nada em 17 dos 19 modos, e
  mais de 300 px por coluna na foto de hoje).
- **Quatro botões saem** e nada se perde: o Aplicar do rodapé já manda o
  rascunho inteiro (`footer_actions.py:715`), e o modo *Desligado* passa a
  soltar a trava.
- **Um recibo que diz os dois lados** — hoje o L2 e o R2 disputam a mesma linha
  da barra da janela, e o último apaga o outro.
- **O perfil passa a guardar o NOME do efeito** — hoje grava só os dez números e
  a aba reabre em "Personalizar".
- **`profiles/curva_propria.py` ganha o primeiro chamador em `src/`** — está
  escrito, validado e desligado desde julho, e as duas lápides de
  `portao_a_casa_sabe_e_o_produto_nao_faz.py:1557,1567` saem com ele.

## Os três buracos de backend que a onda nomeia

1. **Falta o byte do MODO no efeito próprio.** `CurvaPropria.curva` são sete
   bytes — a largura do campo `forces` do report de saída, fato do protocolo —
   e o modo *Montar do zero* manda **modo + sete forças**. Sem o byte de modo, a
   curva guardada não se toca de volta. Custo de acrescentar: **zero hoje**, e
   o próprio módulo explica por quê (`curva_propria.py:34`). Sprint 05.
2. **O catálogo não tem onde morar do lado da usuária.** O único caminho é
   `docs/data/curvas-proprias.json`, do repositório. Sprint 05.
3. **`TriggerConfig` não tem campo de nome de efeito** (`profiles/schema.py:198`
   — só `mode` e `params`). Sprint 04. Sem migração: campo novo com padrão não
   quebra `extra="forbid"` na leitura dos 29 perfis do disco.

## O que ficou de fora, e por quê

- **Os dois banners do topo** (o do Estilo de Jogo e o do "outro programa está
  mandando gatilho pela porta DSX"). O contrato os previa; **o mockup os
  cortou**: *"Nenhum dos dois existe"* (`aba03.py:121`). Não entram.
- **"Mandar de novo para o controle"** — cortado pelo mockup: *"o Aplicar do
  rodapé já faz isso"* (`aba03.py:122`).
- **"Usar o mesmo nos dois gatilhos"** — cortado: *"a fita Ajustes vão para já
  responde a quem o ajuste vai"* (`aba03.py:123`).
- **O desenho do DualSense nesta aba** (pergunta 4 do contrato, `O-REDESENHO:302`).
  O mockup não o traz. Sem palavra dela, não entra.
- **A fita, o crachá "Perfil ativo" e o rodapé** — são a moldura da janela, de
  outra onda. Aparecem só na conferência da sprint 07.

## O que espera a palavra dela

| Onde | A pergunta |
|---|---|
| 02 | A fita nesta aba fica **viva** ou **esmaecida**? O comentário do mockup (`03-gatilhos.html:431`) e o markup logo abaixo (`:435`) discordam. |
| 02 | *Ler um modo custa aplicá-lo na sua mão* — o toque ao vivo de 300 ms fica? (pergunta 1 do contrato, `O-REDESENHO:299`) |
| 03 | O recibo do quadro sobrevive à troca de aba? De perfil? |
| 04 | Nos 17 modos sem efeito pronto, a lista fica **cinza** ou **some**? |
| 04/06 | "Stop hard", "Machine gun" — e "Arco de flecha (Bow)" / "Disparo (Weapon)". O inglês fica? Em 07/08 ela pediu que ficasse; o mockup o cortou. |
| 05 | Quem é o `medido_por`, o diálogo lembra? O `controle` vem pré-preenchido? Escolher um efeito próprio troca o modo da coluna? Onde mora o catálogo dela? |
| 07 | A aba inteira. |

Cada uma está escrita como **provisório marcado** na sprint dona
(`PROVISÓRIO — decisão dela`), nunca como escolha em silêncio.

## As colisões COM AS OUTRAS ONDAS — quem coordena serializa

Medido em 27/08 sobre as sprints das ondas irmãs escritas no mesmo dia. **O
portão não as enxerga**: o frontmatter delas usa `onda:` e não é lido (ver a
nota abaixo), então nenhuma destas aparece na saída do
`check_colisao_de_sprints.py`. Estão aqui porque silêncio não é declaração.

| Arquivo | Nossa | Delas |
|---|---|---|
| `gui/main.glade` | **02** | LANÇADORES 01-10, VIBRAÇÃO 01-06, NAVEGAÇÃO 01-09 |
| `gui/theme.css` | **02** | VIBRAÇÃO 02 |
| `profiles/schema.py` | **04** | VIBRAÇÃO 02-06, NAVEGAÇÃO 01, 03-07 |
| `app/draft_config.py` | **04** | VIBRAÇÃO 03-06, NAVEGAÇÃO 01 |

O `main.glade` é **recurso de bancada**: XML único, sem seções nomeadas, e
conflito de merge nele é irrecuperável na prática — **uma sprint por vez**. A
nossa toca só a faixa **776-1135**, a página `tab_triggers_box`, e nenhuma outra
linha; as das outras ondas tocam páginas distintas. Se quem coordena preferir
faixa declarada a fila, a nossa já está nomeada e é disjunta das delas.

`schema.py` e `draft_config.py` são acréscimo de campo, cada onda no seu bloco —
serializar basta, não há disputa de conteúdo.

## Uma nota sobre o frontmatter

`scripts/check_colisao_de_sprints.py` **recusa o campo `onda:`** — ele não está
em `_CAMPOS_CONHECIDOS` (`:79`), e campo desconhecido é `FormatoInvalido`, não
um aviso. Nas sete sprints a onda vai como **comentário** na primeira linha do
bloco (`# onda: GATILHOS`), que o analisador pula (`:117`). Quem for dono do
script decide se o campo entra; nenhuma sprint desta onda o inventa por conta
própria.
