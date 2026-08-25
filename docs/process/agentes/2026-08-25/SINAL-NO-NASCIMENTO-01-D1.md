# SINAL-NO-NASCIMENTO-01 · D1 — o veredito existia, e o carimbo não carimbava nada

Agente D1, 25/08/2026, rodada da tarde. Árvore `hefesto-voo/SINAL-NO-NASCIMENTO-D1`,
branch `voo/SINAL-NO-NASCIMENTO-D1`. Cinco commits, `9cfd638..80ecb58`.

## O que resgatei

**Nada, e isso é uma correção ao recado.** O recado dizia *"VOCÊ JÁ TEM DOZE
COMMITS nesta branch, de uma rodada anterior"*. A branch estava em
**fast-forward puro sobre `onda/atual`** (reflog: três `merge … Fast-forward`
entre 04h36 e 13h05), sem um commit sequer que fosse só dela:

```
$ git log --oneline onda/atual..HEAD
(vazio)
```

Os doze commits da rodada de 22/08 (a E1 e a E3) **já estavam integrados** — é
por isso que `integrations/sinal_da_barra.py::CartorioDoNascimento` e
`daemon/connection.py::carimbar_o_nascimento` estavam no disco antes de eu
escrever qualquer linha. Não havia trabalho pela metade, não havia arquivo de
outra frente na árvore, e não havia relatório porque não havia rodada.

**Segunda correção ao recado: a minha sprint NÃO tinha bloco `posse:`.** O
`e175dd8` deu o bloco a quatro sprints, e nenhuma delas é esta. Escrevi um, com
a posse real do que fiz, e ele está no topo do arquivo.

## O defeito que eu não fui procurar, e que muda a sprint

A E2 pedia uma porta de IPC para o cartório. Antes de escrevê-la fui conferir a
grafia do endereço com que a tela ia perguntar — e a conferência derrubou a E1.

`carimbar_o_nascimento` filtra "só os controles NOSSOS" assim:

```python
nossos = _uniqs_que_o_backend_segura(daemon)      # nos_hidraw_por_uniq
vivas  = [alvo for alvo in vivas if alvo.uniq.lower() in nossos]
```

As duas metades escrevem o mesmo MAC de jeitos diferentes, e está **MEDIDO na
bancada, hoje**, no `uevent` do DualSense que está no cabo desta máquina:

```
$ grep HID_UNIQ /sys/bus/hid/devices/0003:054C:0CE6.0009/uevent
HID_UNIQ=a0:fa:9c:00:00:f0        # (mascarado; COM os dois-pontos)
```

e do outro lado, `core/backend_pydualsense.py:4839` (`_key_to_uniq` →
`core/sysfs_leds.norm_mac`) devolve `a0fa9c…`, **sem**. `"a0:fa:9c:…" in
{"a0fa9c…"}` é `False` sempre. A lista saía vazia, `observar([])` não devolvia
nada a carimbar, e **o tique retornava zero — todo tique, desde 22/08**.

`CartorioDoNascimento.do_uniq` tinha o mesmo defeito na outra ponta, e é por ele
que a tela pergunta: a E2, escrita como o contrato manda, teria devolvido `None`
em todo card. `None` ali quer dizer *"não carimbei"*, então o produto teria
ficado calado sem ninguém notar.

**O que escondia era o instrumento**, que é a armadilha nº 1 desta casa: o
`_MAPA_DA_BANCADA` do teste devolvia a grafia do SYSFS onde o produto lê a do
BACKEND. Régua falsa aprovando um casamento que em produção não acontece nunca.
Agora ele passa por `como_o_backend_escreve()`, com o porquê no docstring.

Isto é a `A-CASA-SABE-E-O-PRODUTO-NÃO-FAZ` um degrau abaixo do usual: a fiação
existe, roda a cada 30 s, e não alcança nada. Vale a pena registrar a forma —
**"ligado" e "funcionando" não são a mesma afirmação**, e só a segunda tem
medição atrás.

## O que mudou

| commit | o quê |
|---|---|
| `116525b` | a cura das duas grafias: `endereco_normalizado()` nos DOIS lados de cada comparação, no filtro do daemon e no `do_uniq`; o fixture passa a falar como o backend fala |
| `77e8250` | **E2, metade daemon**: `_nascimento_para` e o campo `nascimento` no payload por controle |
| `270dbb5` | **E2, metade tela**: `frase_do_nascimento` + a linha da razão no `_BlocoDaLuz`, e a fiação do payload ao card |
| `6c54b59` | **E4, metade função**: `sinal_da_barra.ler_a_mesa` → `veredito_do_nascimento` |
| `80ecb58` | o `docs/protocol/ipc-unix-socket.md` regerado — o método novo empurrou as linhas dos handlers |

Arquivos:

- `src/hefesto_dualsense4unix/integrations/sinal_da_barra.py`
- `src/hefesto_dualsense4unix/daemon/connection.py`
- `src/hefesto_dualsense4unix/daemon/ipc_handlers.py`
- `src/hefesto_dualsense4unix/app/actions/config/secao_controles.py`
- `tests/unit/test_a_porta_do_veredito_de_nascimento.py` (novo)
- `tests/unit/test_o_carimbo_do_nascimento_no_tique_de_hotplug.py`
- `tests/unit/test_a_luz_nao_acende_o_botao_do_card.py`
- `tests/unit/test_barra_muda_01_o_sinal_que_nao_le_a_lampada.py`
- `docs/process/sprints/2026-08-22-SINAL-NO-NASCIMENTO-01-…md`
- `docs/protocol/ipc-unix-socket.md` (gerado)

**O desenho da tela, em uma linha:** a razão mora **debaixo do botão que ela
explica**, e só aparece quando o veredito CONDENA. Os outros três casos calam —
sem carimbo, `limpa` e `nao_sei` —, e cada silêncio tem preço medido atrás:
ausência não é inocência e também não é acusação; "nasceu bem" em todo card é
ruído crônico; alarme sem medição atrás ensina a ignorar alarmes.

## As mordidas, arrancadas e devolvidas

Nove, todas por LINHA (nunca por âncora de texto), com `__pycache__` limpo entre
arrancar e devolver.

| # | o que arranquei | reprovou | com a cura |
|---|---|---|---|
| 1 | `endereco_normalizado` sai do filtro do `carimbar_o_nascimento` | **7 de 30** | 30 verdes |
| 2 | `do_uniq` volta a comparar as grafias cruas | 1 de 30 (`test_a_tela_acha_o_carimbo_pela_grafia_que_ela_conhece`) | 30 verdes |
| 3 | a linha `entry["nascimento"] = …` sai do `_enrich` | 1 de 9 | 9 verdes |
| 4 | `isinstance(cartorio, CartorioDoNascimento)` vira `is not None` | 1 de 9 (o `MagicMock` virou acusação) | 9 verdes |
| 5 | a ausência de carimbo passa a devolver `confianca="limpa"` | 2 de 9 | 9 verdes |
| 6 | `frase_do_nascimento` para de olhar `pede_reconexao` | **4 de 39** | 39 verdes |
| 7 | `_pendurar_a_luz` para de passar `nascimento=` | 1 de 39 (a fiação payload→card) | 39 verdes |
| 8 | a razão deixa de sumir no estado de espera | 1 de 39 | 39 verdes |
| 9 | (a régua do fixture) `_MAPA_DA_BANCADA` honesto, produto sem cura | **6 de 25** | é a mordida que revelou o defeito |

Saídas cruas das duas primeiras, que são as que provam o achado:

```
# 1 — sem a cura
FAILED …::TestOTiqueDeHotplugCarimba::test_o_tique_carimba_as_seis_com_quatro_condenadas
FAILED …::TestOTiqueDeHotplugCarimba::test_o_segundo_tique_nao_le_o_diario_de_novo
FAILED …::TestOTiqueDeHotplugCarimba::test_o_modo_nativo_nao_fabrica_limpa
FAILED …::TestOTiqueDeHotplugCarimba::test_o_modo_nativo_nao_agrava_com_foto_velha
FAILED …::TestOTiqueDeHotplugCarimba::test_a_sonda_do_daemon_condena_a_conexao_recem_chegada
FAILED …::TestOCarimboSoFalaDosControlesDoProduto::test_o_dualsense_do_vizinho_nao_e_carimbado
FAILED …::TestOEnderecoCasaAsDuasGrafias::test_o_tique_carimba_com_o_backend_na_grafia_dele
7 failed, 23 passed in 0.33s
# 1 — com a cura
30 passed in 0.29s

# 2 — sem a cura
E       assert None is not None
FAILED …::TestOEnderecoCasaAsDuasGrafias::test_a_tela_acha_o_carimbo_pela_grafia_que_ela_conhece
1 failed, 29 passed in 0.31s
# 2 — com a cura
30 passed in 0.29s
```

**A armadilha da bomba continua valendo, e eu a respeitei:** o
`_enrich_controllers_per_controller` roda dentro de um `suppress` no chamador, e
um teste-bomba sairia verde. As duas asserções de "não foi chamado"
(`TestPerguntarNaoCustaDiario`) usam CONTADOR, e o contador é conferido depois de
sessenta perguntas seguidas — um minuto do tique de 1 s da GUI.

## O que fica aberto, e para quem

1. **A prova de tela (`PROVA-DE-TELA-01`) — dela.** Código e teste de pé; nenhuma
   foto de aba nesta leva, por ordem de quem coordena. **Aguarda o olho dela**;
2. **Os dois módulos homônimos — de quem couber depois desta leva.**
   `integrations/mesa_de_radio.py` e `integrations/radio_da_mesa.py` continuam
   com as palavras trocadas. É a outra metade da E4, e não a fiz porque os dois
   são **posse declarada de outras frentes AGORA** (`mesa_de_radio` é da
   CONEXOES-MAPA-2D-01/MAPA-B; `radio_da_mesa` está no `nao_toca` da
   DESEMPENHO-A-CONTA-DE-SLOTS-01). São 2 arquivos e 14 citações;
3. **A `BARRA-MUDA-01` §7 tem linha caduca** (diz que o carimbo no nascimento
   está por fazer). Documento de outra frente — não editei;
4. **A `BARRA-MUDA-01` §1.1 continua com o fato derrubado** *"o MAC da instância
   muda"*, já registrado em 22/08 e ainda lá, pela mesma razão;
5. **O `hw_version` viaja no payload e ninguém o lê.** Entrou porque o contrato
   de leitura da E2 o declara. Quem for cortar verbosidade: é uma chave por
   controle por segundo, e a razão de estar lá é diagnóstico de suporte.

## Portões

`bash scripts/portoes.sh --rapido` depois do `git add -A`:

```
TODOS VERDES — 18 portões.
```

Dois vermelhos apareceram no caminho e os dois eram MEUS: `contrato-ipc` e
`citacoes-de-linha`, porque o método novo empurrou as linhas dos handlers do
`ipc_handlers.py` e o `docs/protocol/ipc-unix-socket.md` guarda `arquivo:linha`
de cada um. Curados com `scripts/gerar-contrato-ipc.py` (`80ecb58`) — nenhuma
linha escrita à mão.

Fora da peça: `ruff check src/ tests/` limpo, `mypy` limpo (221 arquivos),
`validar-acentuacao.py --all` e `validar-referencias-docs.py --all` verdes.

Escopo rodado no pytest — **105 verdes**, e só o meu escopo (a suíte inteira cria
nós uinput de verdade):

```
tests/unit/test_o_carimbo_do_nascimento_no_tique_de_hotplug.py    30
tests/unit/test_a_porta_do_veredito_de_nascimento.py               9
tests/unit/test_a_luz_nao_acende_o_botao_do_card.py               39
tests/unit/test_barra_muda_01_o_sinal_que_nao_le_a_lampada.py     27
```

## O que NÃO fiz, e por quê

- **Não parei o daemon dela, não rodei `systemctl`, não escrevi no aparelho.** A
  única leitura de máquina foi `cat` de `uevent` no sysfs, que é o que mediu o
  defeito;
- **Não toquei em `daemon/lifecycle.py`**, que a frente do Daemon Acordado mexeu
  nesta madrugada: o campo `_cartorio_do_nascimento` que ela declara já servia;
- **Não toquei em `app/widgets/external_card.py`.** O veredito viaja fora do
  `DadosDoControle`, como o `_mic_declarado` já viajava — o card é território de
  outra frente, e um campo novo lá obrigaria as duas a mexer no mesmo arquivo;
- **Não mexi em `docs/data/decisoes-dela.csv`**, e não há decisão nova pedindo
  entrada: a E2 executa uma regra dela que já está registrada;
- **Não apaguei entrada do `portao_a_casa_sabe_e_o_produto_nao_faz.py`**: nenhum
  símbolo desta frente estava declarado órfão lá, conferido por `grep`.
