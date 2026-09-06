# RESERVA-DO-POSTO-01 — o instrumento ficou de pé; o cronômetro é dela

**06/09/2026** · árvore `RESERVA-DO-POSTO-01-opus`, branch
`voo/RESERVA-DO-POSTO-01-opus`, nascida de `onda/atual-0609` (`c15d2e3e`).

A ROTA CORRIGIDA do topo da sprint divide o trabalho em dois, e esta entrega é
a metade de código: **o INSTRUMENTO é de agente, a MEDIÇÃO é dela.** Os 30 s de
`PRIMARIO_RESERVA_SEC` **não se mexeram** — *"ela mede antes de eu fixar"* —, e o
roteiro de bancada da §5 corre na MESA-DE-QUATRO-01.

## O que mudou

**1. A queda do primário diz de que transporte ela veio** (§RESERVA-1, a metade
que faltava). `core/backend_pydualsense.py:2563` —
`primario_deposto_reservado` passou a sair com `transporte=self._transport`, ao
lado do `key` que já correlacionava os três eventos.

O nível dos dois eventos mudos (`primario_deposto_reservado` e
`primario_reserva_caducou`) **já tinha subido para INFO em 26/08**
(`2cfbfc16`), com régua própria em
`tests/unit/test_reserva_do_posto_01_os_eventos_falam.py` — essa linha da §4 da
sprint estava paga e não foi refeita. O que faltava era o campo: sem ele o
caderno da §5.2 tem a coluna `transporte` e nada para preenchê-la, e a
distribuição que vai escolher o prazo seria a mistura de duas populações. No
cabo o primário praticamente não cai; no rádio, cair é rotina.

O valor é o ÚLTIMO transporte detectado para o primário, e o docstring diz
isso em voz alta: no instante da reserva o handle já morreu, e perguntar ao
aparelho que sumiu não é possível. Para o que o caderno pergunta — *em que
transporte ele ESTAVA quando caiu* — é a resposta certa.

**E a mudança é LINHA-NEUTRA de propósito, o que custou uma volta.** A primeira
versão explicava o campo num parágrafo novo do docstring: catorze linhas, e com
elas **doze citações `arquivo:linha` apodreceram de uma vez** — nove em
`docs/data/mapa-controles.csv` e quatro em `src/`, todas apontando para trechos
ABAIXO do ponto de inserção, todas com o mesmo desvio de +14. O
`citacoes-de-linha` e o `citacoes-no-codigo` ficaram vermelhos, e o conserto
natural — reapontar os números — esbarrava no `nao_toca:` desta sprint, que tem
o mapa dentro. A saída foi comprimir o parágrafo já existente sobre o nível
INFO (que tem régua própria e não precisa ser repetido aqui) e caber a
explicação nova no MESMO número de linhas: 9 adicionadas, 9 removidas, e o
arquivo com os mesmos 5813 do `onda/atual-0609`.

**A regra que isso deixa:** num arquivo tão citado quanto o
`backend_pydualsense.py`, *toda linha inserida acima da metade do arquivo é uma
edição no mapa* — e o mapa costuma ser de outra posse. Quem for inserir de
verdade (e uma hora alguém vai) precisa da posse do `mapa-controles.csv` junto,
ou de uma sprint que reaponte as citações como entrega própria.

**2. A trava que impede a janela da sessão de medição de atravessar a leva**
(§RESERVA-2). `tests/unit/test_reserva_do_posto_de_primario.py::test_a_constante_de_producao_nao_saiu_da_bancada`
afirma que `PRIMARIO_RESERVA_SEC` continua sendo um PRAZO (`0 < x ≤ 120 s`), e
não a janela de 3600 s que a sessão de medição precisa.

**Adotado o caminho (a) da §RESERVA-2** — editar a constante e reiniciar o
daemon —, que é o único dos três que **não deixa superfície nova depois que a
medição terminar**: nenhuma env, nenhum método de IPC. A recomendação já era
essa na sprint, e o custo (um reinício no começo e outro no fim da sessão) é
gesto que a bancada faz por outros motivos. O preço de esquecer de voltar é
assimétrico e é o que o teste cobre: o posto do Jogador 1 pendurado por uma
hora num controle que ela desligou de propósito.

**3. O que o produto FAZ quando o deposto volta pelo CABO, medido** (§RESERVA-5).
A §6 da sprint INFERIA do código que plugar o controle descarregado na tomada
tomaria o Jogador 1 de quem está jogando. Agora está medido no dublê:
`TestAVoltaPeloCabo::test_a_volta_pelo_cabo_retoma_o_posto` — **retoma**. E o
outro lado também: passada a janela, a tomada não toma o posto de ninguém.

É teste de **caracterização**, e o docstring diz que é: ele afirma o que o
produto faz hoje, não o que deve fazer. Quem inverter a asserção sem a palavra
dela está decidindo a §7.3 por ela.

**4. A bancada de queda aprendeu a diferença entre o cabo e o rádio.**
`tests/unit/test_coop_bancada_de_queda_do_primario.py`: `_Mesa.sentar` ganhou
`transporte=` (rádio por default, que é onde o defeito da bancada vive), o
`_FakeHandle` deixou de ter `conType` fixo em `BT`, e o `transporte_de` alimenta
o `_detect_transport` real do produto.

**E no caminho caiu um defeito latente do instrumento.** O
`tique_do_reconnect_loop` entregava os handles por uma **fila posicional**
(`fila.pop(0)`), mas o `connect()` do produto só abre as keys que ainda não têm
handle (`if key in existing: continue`). Com todos os dublês idênticos isso
nunca apareceu; com transportes diferentes, o handle do controle que volta iria
para o índice errado sempre que o outro já estivesse de pé. Agora o handle nasce
do `path` — o mapa `por_path` casa o que o backend enumerou com quem está
sentado na mesa.

## Qual mordida prova

`tests/unit/test_reserva_do_posto_de_primario.py` (novo, 6 testes) e os 24 que
já existiam nos dois arquivos vizinhos: **30 verdes**. Cada cura foi arrancada e
cada régua reprovou — as cinco mordidas, com a saída em `/tmp/mordidas-1-3.txt`
e `/tmp/mordidas-4-5.txt`:

| a cura arrancada | quem reprovou |
| --- | --- |
| `transporte=self._transport` fora do `logger.info` | `test_a_queda_e_a_caducidade_saem_em_info` + `test_o_transporte_da_queda_e_lido_e_nao_digitado` |
| `transporte="bt"` DIGITADO em vez de lido | só `test_o_transporte_da_queda_e_lido_e_nao_digitado` — e é para isso que ele existe |
| `PRIMARIO_RESERVA_SEC = 3600.0` esquecido no commit | `test_a_constante_de_producao_nao_saiu_da_bancada` (`assert 3600.0 <= 120.0`) |
| o botão de transporte da bancada INERTE (`conType` fixo em BT) | `test_a_bancada_sabe_a_diferenca_entre_o_cabo_e_o_radio` + a caracterização do cabo |
| a RESERVA arrancada (`_posto_reservado_de_volta` sempre `None`) | `test_a_queda_e_a_caducidade_saem_em_info` + `test_a_volta_pelo_cabo_retoma_o_posto` |

A segunda linha é a que interessa mais: a régua que **digita** o que devia
**ler** é o defeito recorrente desta casa, e a mordida separa "o campo existe" de
"o campo diz a verdade".

O journal não foi duplicado: o novo arquivo **importa** a fixture
`journal` do `test_reserva_do_posto_01_os_eventos_falam` — é a mesma régua de
nível (o `wrapper_class` REAL do produto), e a cicatriz escrita naquele arquivo
(reconfigurar o structlog global estraga a medição de um teste a dez arquivos
de distância) é motivo suficiente para não haver duas versões dela.

## O que NÃO verifiquei

- **Nada disto tocou aparelho.** A bancada estava LIVRE e eu não a reservei: a
  metade do trabalho que precisa de dois DualSense no rádio é a §5, e a ROTA
  CORRIGIDA a mandou para a MESA-DE-QUATRO-01. Não rodei `bancada.sh exigir`
  porque não há caminho meu que pare o daemon, escreva no aparelho ou chame
  `systemctl`.
- **O `transporte` no journal REAL dela não foi lido.** A régua mede o
  `logger` do produto com o filtro de nível real, num buffer — não o
  `journalctl`. Um daemon vivo com o código novo confirmaria em uma linha, e
  isso acontece sozinho na primeira queda de primário da próxima sessão.
- **A distribuição das voltas continua sem medição** — é a sprint inteira do
  ponto de vista dela, e continua aberta. As duas amostras de 02/08 (8 s e 27 s)
  seguem sendo tudo o que existe, e a de 27 s encosta em 90% do prazo.
- **A queda por bateria** continua nunca provocada nesta casa.
- **`primario_reserva_caducou` NÃO ganhou o campo `transporte`.** A reserva
  guarda `(key, quando)` e não o transporte da queda; o `key` é o que casa os
  dois eventos no journal, e a sprint só pediu o campo no primeiro. Quem quiser
  separar as caducidades por transporte terá de guardar o transporte na tupla.

## O que sobrou para o próximo

1. **A MEDIÇÃO (§5), e ela é dela** — na MESA-DE-QUATRO-01. O instrumento está
   pronto dos dois lados: o `t0` sai em INFO com o transporte, o `t1` e a
   caducidade também, e a trava impede que a janela de 3600 s da sessão vá
   parar no commit. O roteiro da §5 vale como está escrito; o único ajuste é que
   o `grep` do journal agora pode separar as amostras por `transporte=`.
2. **A §RESERVA-3 espera o número.** Quando a distribuição existir, a constante
   recebe o valor medido e o comentário de `:283-301` **substitui** as duas
   analogias — não as guarda ao lado. O teto de 120 s do teste é a fronteira
   entre prazo e esquecimento, não o número escolhido: um valor medido acima
   disso muda o teto junto, deliberadamente.
3. **A §RESERVA-4 (a célula do mapa) não é mais desta sprint** — os dois CSV
   saíram da posse pela ROTA CORRIGIDA. A célula
   `combinacao.slot_jogador.estabilidade@dualsense` continua com `radio_aciona`
   vazio, e quem a escreve é a SPECS-A-PROCEDENCIA-01, a partir do que a
   bancada relatar.
4. **A pergunta da §7.3 vai para ela COM o fato ao lado**, que era o que
   faltava: o deposto que volta pelo cabo **retoma** o Jogador 1. Plugar na
   tomada durante a partida tira o posto de quem está jogando — deixou de ser
   inferência.
