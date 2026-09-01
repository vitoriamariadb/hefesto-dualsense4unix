# ONDE PARAMOS — o redesenho virou fila

**27/08/2026.** O desenho das dez abas virou trabalho executável. Isto é o que
tem na mesa, e o que espera você.

## O que fazer primeiro

1. **Seis decisões suas.** Cada uma trava uma sprint com nome — sem elas, alguém
   para no meio ou inventa tela. Estão na
   [§0.1 do SPRINT_ORDER](SPRINT_ORDER.md#01-as-seis-que-travam-uma-sprint-com-nome),
   em tabela, com a fonte de cada uma.
2. **Três minutos de quem coordena, e a fila destrava.** O portão
   `check_colisao_de_sprints.py` recusa o campo `onda:`, e por isso **nenhuma
   sprint desta leva é despachável hoje** — nem as que não usam o campo, porque
   uma recusa cega o portão inteiro.
3. **Uma execução do `retratar_abas.py` e uma passada de olho.** As fotos de hoje
   são o **antes** das dez ondas, e por PROVA-DE-TELA-01 nenhuma aba fecha sem o
   seu olho.

## Os números

| | |
|---|---|
| Sprints que nasceram | **87 executáveis**, em dez ondas — uma por aba — mais dez índices |
| Sprints que saíram | **28**, apagadas pela faxina; **3 retidas** com a prova de por quê |
| A ordem de execução | dez ondas, na [§1.2 do SPRINT_ORDER](SPRINT_ORDER.md) |
| O gargalo | **18 das 87 abrem o `main.glade`** — XML único, uma sprint por vez em toda a casa |
| O que sobrou de antes | **123 sprints** que não são de aba nenhuma (§4), mais a trilha de Bluetooth, que é sua |

## A ordem das ondas, em uma linha cada

| # | Onda | Por que aqui |
|---|---|---|
| 0 | **JOGAR-09 sozinha** | é a moldura das dez abas, e o crachá "Perfil ativo" no topo que você disse que faltava |
| 1 | Vibração | cria o desenho do controle **e conserta o empacotamento do SVG**; quatro ondas o consomem |
| 2 | Sistema | é quem solta o microfone e o gamepad virtual da aba Emulação antes de outra aba pegá-los |
| 3 | Conexões | a única que não abre o Glade — corre em paralelo com tudo; e entrega a borda na cor do plástico |
| 4 | Iluminação | fixa onde se escolhe o número do jogador; depois disso, as outras abas só leem |
| 5 | Jogar | precisa da cor do plástico e do dono do Ligar/Desligar para não escrever a terceira versão da mesma coisa |
| 6 | Gatilhos | você aprovou sem ressalva, e ela toca uma faixa isolada do Glade — cabe em qualquer buraco |
| 7 | Navegação | quatro sprints no Glade e quatro na bancada: a mais cara por turno |
| 8 | Perfis | quase toda serial num arquivo de 4.546 linhas, e duas travas são palavra sua |
| 9 | Controles | absorve a aba "No jogo", e por isso colide com oito das nove outras |
| 10 | Lançadores | **por ordem sua**: *"ela só passa a existir quando tiver todas as features no projeto integrando e funcionando"* |

## O que espera a palavra dela

**As seis que travam sprint** (a §0.1): qual régua manda no arranjo · as
declarações da aba Conexões gravam na hora com recibo · "Modo que liga" e "O jogo
vê o controle como" ficam em Perfis · a máscara "Automático" A, B ou C · o
conteúdo dos oito Estilos de Jogo novos · como o produto mede "o controle chega
lá" por lançador.

**As que atravessam abas** (a §0.2), e a mais cara é a primeira: **onde mora
"Detectar o jogo que está aberto"** — PERFIS-03 e LANÇADORES-06 são a mesma
sprint escrita duas vezes. Junto dela: onde fica o despausar (três sprints, um
botão), a máscara é da mesa ou de cada jogador, e o Ligar/Desligar em dois
lugares.

**Duas nunca viraram sprint**, porque o mockup aprovado não as desenha e a regra
é não inventar feature: o **aviso e o histórico de bateria** (as funções estão
escritas e nunca são chamadas em produção) e a linha do **canal DSX** — a
explicação que falta quando o gatilho muda sozinho. Se você disser sim, nascem.

**As de uma aba só** somam setenta, e cada índice de onda traz as suas. Todas
estão marcadas `PROVISÓRIO — decisão dela` na sprint dona, nunca escolhidas em
silêncio.

## Os três pares que quem coordena resolve antes de despachar

Nenhum é decisão de arquitetura — é escolher qual dos dois sai.

1. **JOGAR-03 × NAVEGAÇÃO-02** — as duas põem o quinto degrau na mesma linha,
   `integrations/ponte_escada.py:253`.
2. **VIBRAÇÃO-01 × ILUMINAÇÃO-02** — o mesmo widget em dois caminhos
   (`app/widgets/` contra `gui/widgets/`), e **o portão fica cego** porque só
   grita quando o caminho é escrito igual nos dois lados.
3. **PERFIS-03 × LANÇADORES-06** — este espera **você**, não quem coordena.

## O que a faxina não pôde apagar

Três sprints antigas ficaram, e o teste foi o da casa — *se apagar isto faria
alguém repetir um trabalho ou pagar um custo já pago?*

- **CR-03** — preservada por ordem sua, e é elo de corrente (`CR-03 → CR-04 →
  CR-06`).

  > **Nota datada de 29/08/2026.** A CR-03 **saiu** dois dias depois, e por decisão
  > sua: posta na mesa a consequência de cortar um elo de uma corrente de três, você
  > mandou cortar a corrente inteira (`docs/data/decisoes-dela.csv`,
  > `D-A-CORRENTE-DO-CLEAN-ROOM-SAI`) — ver
  > [o manifesto do corte](sprints/2026-08-29-O-CORTE-DO-CLEAN-ROOM-o-que-saiu-e-por-que.md).
  > O raciocínio acima não estava errado — a CR-03 era mesmo elo de corrente; o que
  > mudou foi a corrente deixar de ser trabalho desta casa. As outras duas retidas
  > continuam de pé.
- **SISTEMA-O-VIGIA-VIVO-01** — seis tarefas `[SEM TELA]`: redesenho de interface
  não substitui o que não toca a interface. O `install.sh:3504` usa
  `enable --now`, que não re-arma timer parado; e os dois scripts do botão
  "Aplicar correções" **não viajam em cinco dos seis formatos de pacote**, com o
  portão de paridade saindo **verde** sobre o buraco.
- **CONFIGURACOES-FECHA-01** — dez tarefas `[SEM TELA]`, entre elas o portão
  *"existe chamador de PRODUÇÃO?"*, que é a régua contra o defeito mais caro
  desta casa.

Tudo, linha a linha, em
[A FAXINA](sprints/2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md).

## O que ainda está vermelho

- **`check_colisao_de_sprints.py` devolve rc=1** — e é pré-existente à faxina:
  as onze sprints de Lançadores declararam `onda:` como chave e o portão recusa
  campo desconhecido. Conserto: uma palavra em `_CAMPOS_CONHECIDOS` (`:81`), ou
  as onze trocam a chave por comentário.
- **`validar-referencias-docs.py --all`** — a faxina criou 151 referências mortas
  em 49 documentos e **as 151 foram consertadas**. As 125 falhas que sobram são
  pré-existentes: sprints escritas ontem e hoje citando arquivos que elas mesmas
  vão criar.

## Onde está tudo

| O quê | Onde |
|---|---|
| A fila, a ordem e o que espera você | [SPRINT_ORDER.md](SPRINT_ORDER.md) |
| O contrato de cada aba (o "Nada se perdeu") | [O REDESENHO](2026-08-26-O-REDESENHO-as-dez-abas.md) |
| A especificação visual, aprovada por você | `novo-layout/NN-*.html` |
| As suas correções, literais | `src/hefesto_dualsense4unix/interface/CORRECOES-DELA.md` |
| Como se executa uma sprint desta casa | [COMO-EXECUTAR-UMA-SPRINT.md](COMO-EXECUTAR-UMA-SPRINT.md) |
| O que a faxina tirou, e por quê | [A FAXINA](sprints/2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md) |
