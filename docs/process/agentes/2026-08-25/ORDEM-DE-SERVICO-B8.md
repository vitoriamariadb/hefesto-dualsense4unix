# ORDEM-DE-SERVIÇO-01 · B8 — retomada de 25/08/2026

Branch `voo/ORDEM-DE-SERVICO-B8`, cinco commits, 23 portões verdes.

## O que eu resgatei

Cheguei com **três arquivos novos e zero commits**: `ordens_da_mesa.py` (1241
linhas), `portas_do_barramento.py` (232) e `tests/unit/bancada_das_ordens.py`
(213). Rodei, medi e commitei antes de tocar em qualquer outra coisa — está no
`e10be14`. Nada foi jogado fora.

**O que o agente anterior deixou pronto e certo:** o modelo inteiro da ordem
(selo, `Linha`, `Ordem`, `Leitura`), as seis regras, a dispensa, as quatro
respostas do "Já movi" e os quatro cabeçalhos. **O que faltava era teste** — não
havia um só — e um defeito de régua que descrevo abaixo.

## A pergunta que você me fez: `portas_do_barramento` × `entradas_do_gabinete`

**Nenhum dos dois morre. Eles não respondem a mesma pergunta.**
`portas_do_barramento.py` **não lê `/sys`** — ele importa `furos`, `vazias`,
`entrada_de` e `RAIZ_USB_PADRAO` de `entradas_do_gabinete` e só acrescenta a
DERIVAÇÃO que aquele não faz: agrupar os hubs que são o mesmo plástico. `livres`
delega a contagem inteira a `vazias()` e só filtra por `hotplug`. É exatamente o
que o C5 da sprint manda: duas camadas, uma régua.

**Quem tinha dois donos era outro par, e esse eu matei.** `ordens_da_mesa.py`
tinha a sua PRÓPRIA `mesmo_hub_fisico`, e `portas_do_barramento.py` estava sem
chamador nenhum na árvore inteira. Duas réguas para "mesmo plástico", e a que
estava viva era a errada.

## O defeito medido, e por que a régua viva era a errada

`ordens_da_mesa.mesmo_hub_fisico` casava os dois lados de um hub comparando
`devpath` + `busnum` + controlador PCI. Medi o `/sys` desta máquina hoje:

```
usb1-port5  peer -> usb2-port1
usb1-port6  peer -> usb2-port2
usb1-port7  peer -> usb2-port3
```

**Os números dos dois lados divergem.** Um hub encaixado no buraco que é
`usb1-port5` enumera `1-5` (devpath "5") do lado 2.0 e `2-1` (devpath "1") do
lado 3.0 — e a conta declara que os dois lados do MESMO hub são plásticos
diferentes. R1 ficava cega ali. E esses três buracos são `hotplug`: **são as
entradas que a própria R1 recomenda como destino.** O produto mandaria mover o
aparelho para o único lugar onde ele deixaria de enxergá-lo.

A cura é consumir `portas_do_barramento.hubs_do_mesmo_plastico`, que agrupa pelo
`peer` — o que o kernel costurou a partir do firmware, buraco a buraco.

**A bancada também estava incompleta:** ela não tinha `peer` nenhum, e por isso
R1 vinha passando pela conta e não pela medição. Refiz a bancada com os `peer`
que o `/sys` publica de verdade, e acrescentei
`bancada_do_hub_em_numeros_diferentes()`.

## Tarefas fechadas

| tarefa | o que fechou |
|---|---|
| **ORDEM-1** | `portas_do_barramento.py` commitado, agora com chamador; `hubs_do_mesmo_plastico`, `hubs_de`, `livres`, `livres_fora_de`, `mesmo_soquete_fisico` |
| **ORDEM-2** | `test_o_selo_de_procedencia_nunca_falta.py` — varredura por AST, 10 testes |
| **ORDEM-3** | `test_ordens_da_mesa.py` — 28 testes, as seis regras, o que cada uma acusa e o que ela CALA |
| **ORDEM-7** | `docs/protocol/por-que-usb3-atrapalha-24ghz.md`, e o portão que exige a fonte em disco |
| **ORDEM-8** | `test_o_estado_bom_nao_e_o_estado_vazio.py` — 12 testes, os quatro cabeçalhos |
| **ORDEM-6 (metade)** | `MesaDeclarada.ordens_dispensadas` + `OrdemDispensada` com três validadores; `test_a_dispensa_mora_na_mesa_dela.py` (25) e `test_a_ordem_confirma_que_ela_moveu.py` (14) |

**91 testes meus, todos verdes.**

## Tarefas abertas

- **ORDEM-4** — `Item.ordem` em `exame_da_mesa.py` + chave em `como_dicionario()`.
  **Não fiz porque `integrations/exame_da_mesa.py` não está na posse que você me
  deu nesta leva** (está na posse da sprint, mas a sua lista manda). Precisa de:
  campo `ordem: Ordem | None = None` no `Item`, a chave `ordem` em
  `como_dicionario()` (aditivo, o `doctor.sh --censo` só ganha campo), e
  `exame()` costurando `ordens_da_mesa.catalogo`. **`veredito()` não muda uma
  linha** — um segundo lugar decidindo a cor do topo é a cicatriz de `6c86e295`.
- **ORDEM-5 e a metade de tela da ORDEM-6** — os cards, as duas zonas e os dois
  botões em `secao_exame.py`. **Aguarda o olho dela**: é texto novo na tela.
- **A citação do USB 3.0 em mais três lugares.** A sprint dizia duas; são
  quatro: `mesa_de_radio.py`, `secao_mesa.py`, `interface.md` e a ordem. Só a
  ordem tem `fonte=`. Dar dono aos outros três é varredura de texto de tela, e a
  dona única é a CONFIGURACOES-O-LEXICO-01 — **não fiz de propósito**.

## Para quem coordena

1. **`portao_a_casa_sabe_e_o_produto_nao_faz.py` JÁ REPROVAVA nesta base antes
   de mim** — conferido com `git stash`. São quatro vermelhos. Depois de eu
   declarar as minhas 24 promessas, sobram **50 de quatro módulos que entraram
   na madrugada sem declaração**: `arranjo_da_mesa.py` (37),
   `entradas_do_gabinete.py` (7), `mapa_das_portas.py` (4) e
   `lugar_declarado.py` (2). **Não declarei por elas** — a razão tem de dizer o
   que fecha o caminho, e quem sabe isso é quem as escreveu. Roteie para os donos.
2. **A armadilha do `ipc_bridge._CAMPOS_DA_MAQUINA` não se aplicou**, e o motivo
   importa: `ordens_dispensadas` é aninhado em `MesaDeclarada`, não é campo de
   topo de `MaquinaConfig`. `test_descartados_chegam_ao_rodape.py` está verde.
3. **O portão do caderno (T11) pegou o campo novo sem consumidor**, que é o
   trabalho dele. A isenção entrou NOMEADA e com prazo, e sai quando ORDEM-5
   ligar a seção.
4. **A medição de rádio continua impossível** — `/sys/class/bluetooth/` está
   vazio. Mas **o hub voltou ao barramento**: `3-1`, `3-1.1`, `4-1`, `4-1.1`
   estão enumerados agora, com `3-1.1.3` e `4-1.1.1` encaixados. Nenhum
   adaptador Bluetooth. Nada disto muda esta sprint (nada aqui toca o rádio),
   mas muda o que a aba dela mostra agora.
5. **Não toquei em `mesa_de_radio.py`** — consumi `vizinhas_de_verdade` por
   argumento (`Leitura.vizinhas`), como você mandou.

## As bancadas dela (§9 da sprint, nenhuma executável hoje)

| id | o que fecha | o comando dela |
|---|---|---|
| W1 | o `derivado` de R1 | `bash scripts/medir_w3_coex.sh` antes e depois de mover o aparelho de 5 Gbps |
| W2 | o denominador de R7 | `btmon` observando o tipo de pacote (2-DH1 / 2-DH3) |
| W3 | o `derivado` de R4 | tirar o hub da tomada, ligar o computador, tentar entrar no setup |
| W4 | o `especificacao-de-terceiro` de R1 | abrir o PDF 327216-001 e conferir os números da tabela |

**W4 mudou de natureza:** o documento **foi achado** (Intel 327216-001, abril de
2012, publicado pela USB-IF). O que falta é ler o PDF — as duas tentativas de
baixá-lo responderam HTTP 403, e a página diz isso na cara.
