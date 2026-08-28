---
sprint: ONDA-VIBRACAO-INDICE
# onda: ABA-VIBRACAO
posse:
cria:
  - docs/process/sprints/2026-08-27-ONDA-VIBRACAO-INDICE.md
bancada: false
depois_de: []
nao_toca:
  - src/
  - tests/
  - novo-layout/
---

# ONDA VIBRAÇÃO — índice

**27/08/2026.** As seis sprints que levam a aba **Vibração** do que o produto é
hoje até o que o mockup mostra, do frontal ao backend.

**A especificação é `novo-layout/05-vibracao.html`**, aprovada por ela:

> *"ok, foda. Viu esses detalhes que eu pedi? Eu quero esse refinamento em todas
> as demais agora em diante. Tá fechado essa. Excelente trabalho."*

Onde o mockup (27/08) e o contrato de
`docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md:368-431` (26/08) divergirem,
**vence o mockup**. As três divergências, todas por palavra escrita dela:
não há quinto botão "Personalizado" (é o rótulo da linha da barra); a barra para
em **150**, não 200; e as duas linhas de estado **saem** da tela.

## A ordem

```
01  o desenho que nunca teve tela            ─┐
                                              ├─ podem correr juntas
02  a aba vira um quadro só                  ─┘
        │
        ▼
03  a força vira uma escolha só, para em 150, e aplica ao soltar
        │
        ▼
04  a força ganha endereço                    (bancada)
        │
        ▼
05  os dois motores ligam e desligam por lado (bancada)
        │
        ▼
06  o desenho treme ao vivo                   (depende de 01 e de 05)
```

| # | Sprint | Camada | Tamanho | Depois de |
|---|---|---|---|---|
| 01 | o desenho que nunca teve tela | frontal + empacotamento | ~250 linhas | — |
| 02 | a aba vira um quadro só | frontal | ~450 linhas (XML) | — |
| 03 | a força vira uma escolha só | frontal + esquema | ~200 linhas | 02 |
| 04 | a força ganha endereço | backend + frontal | ~350 linhas | 03 |
| 05 | os dois motores ligam por lado | backend + esquema + frontal | ~300 linhas | 04 |
| 06 | o desenho treme ao vivo | frontal + payload | ~250 linhas | 01, 05 |

**A cadeia 02→03→04→05 é serial de propósito**, e não por gosto: as quatro tocam
`app/actions/rumble_actions.py`, e `main.glade` é XML único — conflito de merge
nele é irrecuperável na prática (COMO-EXECUTAR-UMA-SPRINT §2). `depois_de`
serializa uma colisão em vez de proibi-la.

## O aviso que quem coordena precisa ler

**`src/hefesto_dualsense4unix/app/widgets/desenho_do_controle.py` (ONDA-VIBRACAO-01)
não é desta onda só.** O mesmo desenho é pedido pela Iluminação
(`O-REDESENHO:347`), pela Navegação (`:299`) e, em aberto, pelos cards da
Controles (`:237`). Se outra onda declarar o mesmo `cria:`, **serialize** — dois
agentes escrevendo o mesmo widget é a colisão que o
`check_colisao_de_sprints.py` existe para gritar, e ela só grita quando o
caminho é escrito **igual** nos dois frontmatters.

E a trava de empacotamento vale para todas elas: `assets/control-svg/` **não é
instalado** (`install.sh:3053-3054` copia só `assets/glyphs`). Sem a
ONDA-VIBRACAO-01, o desenho nasce vazio na máquina instalada, **sem um erro no
log**.

## O que NÃO virou sprint, e por quê

O trabalho de medir foi feito item a item sobre o "Nada se perdeu" e a tabela de
botões. Isto aqui já existe, funciona, e só muda de nome ou de lugar:

| Item | Onde está | O que acontece |
|---|---|---|
| Testar por 500 ms | `rumble_actions.py:1008` | fica; ganha o desenho (06) e passa a respeitar os lados (05) |
| Travar nesta vibração (era "Aplicar") | `rumble_actions.py:982` | só o rótulo muda (02) |
| Deixar o jogo controlar | `rumble_actions.py:1092` | intacto |
| Parar | `rumble_actions.py:1064` | intacto, e continua o último da fileira |
| O alvo do par fixado | `ipc_rumble_policy.uniq_do_alvo_de_output:112` | **já tem endereço** desde MESA-CHEIA-05 — quem não tinha era a força |
| Recusa no Modo Nativo | `rumble_actions.py:993`, NATIVO-RUMBLE-01 | chega pelo toast, com motivo; não dependia do rótulo apagado |
| "Vibração em silêncio" no cabeçalho | `status_actions.py:2238` | já é visível de **qualquer** aba, enquanto ela joga |
| Teto do "Bateria longa" | `core/rumble.py:61`, `rumble_actions.py:516` | vira o sufixo `máx` da linha Personalizado |
| Vibração dos catorze Estilos de Jogo | `RumbleConfig.policy`, aplicada na ativação | o campo já existe: o Estilo só o preenche. Nada a construir aqui |
| Desenho do 5º ao 8º controle | `core/led_control.py:122` | não é desta aba |
| [Aplicar] [Salvar Perfil] [Importar] [Exportar] | `main.glade:4234-4261` | é o rodapé, igual nas dez abas |

## O que é dela decidir — a lista inteira da onda

1. **A aba fica sem nenhuma linha de estado?** (02) O mockup não tem nenhuma. O
   banner do cabeçalho cobre "travada"; *"o jogo está pedindo agora"* passa a ser
   dito **só** pelo desenho aceso.
2. **O sufixo `máx` fica sempre visível, ou só quando o teto morde?** (02)
3. **O `Auto` continua na fileira de escolha única?** (03) Ele não é um degrau de
   força — varia com a bateria do controle **primário**, e por isso o esquema o
   recusa por unidade.
4. **`custom_mult` acima de 1,5 é aparado em silêncio, ou a aba avisa?** (03)
   Vale para os perfis dela que já estejam acima.
5. **Um perfil sem entrada para a peça herda a força global, ou o último valor
   daquela peça?** (04) A regra da casa hoje diz global; a regra dela — *"o
   controle carrega a SUA setting"* — puxa para o outro lado.
6. **O `Auto` passa a valer por peça?** (04) Exige ler a bateria de cada
   controle. É trabalho de outra frente.
7. **O lado desligado vale por peça ou pela mesa?** (05)
8. **Desligar um lado entra nos catorze Estilos de Jogo?** (05) Se for
   acessibilidade e não gosto, entra.
9. **O desenho apaga sozinho quando o jogo para?** (06) Jogo que morre no meio
   não manda o par zero, e o punho ficaria aceso para sempre.
10. **Com a fita em "Todos", o desenho mostra quem?** (06)

## Antes de fechar a onda

```bash
git add -A                       # os portões são cegos a arquivo novo
bash scripts/portoes.sh
scripts/gui-captura/retratar_abas.py     # a foto da aba, ao lado do mockup
```

E a regra que fecha: **interface só fecha com o olho dela** (PROVA-DE-TELA-01).
