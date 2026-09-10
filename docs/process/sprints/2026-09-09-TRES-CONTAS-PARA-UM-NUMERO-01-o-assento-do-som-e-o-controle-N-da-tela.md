---
sprint: TRES-CONTAS-PARA-UM-NUMERO-01
estado: aberta
posse:
  TRES-CONTAS-PARA-UM-NUMERO-01:
    - src/hefesto_dualsense4unix/daemon/subsystems/alto_falante.py
    - src/hefesto_dualsense4unix/daemon/subsystems/bt_mic.py
    - src/hefesto_dualsense4unix/daemon/subsystems/__init__.py
    - src/hefesto_dualsense4unix/daemon/lifecycle.py
    - src/hefesto_dualsense4unix/daemon/connection.py
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/base.py
---

> **DEIXOU DE SER TEÓRICA — 09/09/2026, 22h, na tela DELA.** A divergência foi
> achada em teste e virou PUBLICADA: o nó do microfone do controle BRANCO existe
> no PipeWire dela com `Description: Microfone do Controle 2`, e a tela chama o
> mesmo aparelho de **P1** — o cabeçalho do cartão diz `P1 • White • cabo` e o
> chip da fita diz `P1 • White • CABO`.
>
> **Dois números para o mesmo aparelho, nas duas janelas ao mesmo tempo**, que é
> exatamente o defeito que o `numero_do_controle` foi criado para matar. A §4
> continua valendo e a recomendação (a) ficou mais forte: a lista de som do
> sistema é mais uma janela, e ela já está mentindo nela.

# TRÊS CONTAS PARA UM NÚMERO — o assento do som e o «Controle N» da tela

**Achado em 09/09/2026 pelo CONFERENTE da SOM-POR-CONTROLE-01**, e o achado é
de integração: nenhum dos dois agentes podia vê-lo sozinho.

## §1 — As três contas, e o que cada uma responde

| onde | a regra | responde |
| --- | --- | --- |
| `app/actions/base.numero_do_controle` | `player_slot`, senão `index + 1` | *"com que número este controle se identifica na interface inteira"* (COR-01/D6) |
| `daemon/ipc_handlers.py:609` | a MESMA, copiada — `base.py` importa `gi`, que o daemon não pode | idem, do lado do daemon |
| `AltoFalanteSubsystem.numero_do_assento` · `BtMicSubsystem.numero_do_assento` (09/09) | posição entre os CONECTADOS | *"que assento este controle ocupa na mesa AGORA"* |

**As duas primeiras já tinham portão que as amarra:**
`tests/unit/test_mesa_cheia_11_a_janela_conta_quatro.py` compara as duas sobre o
payload REAL de quatro controles — e foi ele que mediu por que a escolha
importa: `player_slot` é `[4,1,3,2]` e `player` é `[1,2,3,4]`, listas
**diferentes**.

## §2 — A divergência, medida

Com o **P1 desligado** e o P2 na mesa:

* a conta da casa chama o P2 de **Controle 2** — o `player_slot` é a identidade
  ESTÁVEL, que sobrevive a desconectar e reconectar;
* a conta nova o chama de **Controle 1** — ele é o primeiro conectado.

**E A PROVA NA MESA DELA, 09/09 às 22h** — quatro controles, dois no cabo e
dois no rádio, um só nó de microfone de pé:

```
$ pactl list sources | grep -A3 hefesto_mic
        Name: hefesto_mic_13ebab
        Description: Microfone do Controle 2      ← o daemon
tela:   P1 • White • cabo                          ← a interface
```

Régua que fixa isto:
`tests/unit/test_o_som_por_controle_cai_em_cada_um.py::test_o_terceiro_numerador_do_mesmo_rotulo_esta_medido_e_confinado`.
Ela não reprova hoje: ela **trava a divergência onde ela está**, e reprova se
qualquer uma das três contas mudar sem as outras.

## §3 — Por que não se cura numa linha

`numero_do_assento` não pode chamar a regra da casa porque
`describe_controllers()` **não devolve `player_slot`** — ele vem do registro,
pelo `slot_resolver`. Ligar o subsistema ao registro são as **mesmas três linhas
de `daemon/`** que a SOM-POR-CONTROLE-01 declarou fora da posse dela
(`subsystems/__init__.py`, `lifecycle.py`, `connection.py`), e que também são o
que falta para o nó existir de verdade na mesa dela.

Curar por metade daria um QUARTO número.

## §4 — O que decidir, e é decisão de produto

O rótulo é «Alto-falante do Controle N» e «Microfone do Controle N». **Qual N?**

* **(a) o da tela** (`player_slot`): a lista de som fala a mesma língua que a
  interface, e o nó de um controle não troca de nome quando o vizinho sai da
  mesa. Custo: o subsistema precisa do registro;
* **(b) o assento de agora**: o nó diz onde o controle está na mesa. Custo: o
  nome muda sozinho quando alguém desliga um controle — e o nome está gravado
  no `load-module`, que ninguém reescreve (é a pergunta pendente da
  MIC-OS-QUATRO-01, e as duas são a mesma pergunta por dois lados).

**Recomendação: (a).** O defeito que o `numero_do_controle` foi criado para
matar é exatamente este — *"Controle 1" no card e "Sony 3" no cabeçalho*, dois
números para o mesmo aparelho na mesma janela. A lista de som do sistema é mais
uma janela.

## §5 — O que MORDE

* as três contas sobre a MESMA mesa, com um controle desligado, devolvem o
  mesmo número;
* o portão `test_mesa_cheia_11_a_janela_conta_quatro` continua verde — a cura
  não pode mexer na conta da casa, só alcançá-la;
* a régua da §2 sai quando esta sprint fechar: uma divergência travada que já
  foi curada é propaganda.

## §6 — O instrumento do censo casa pela DESCRIÇÃO, e o dono trocou

**Achado em 09/09/2026 pelo agente do microfone, e ela mandou anotar aqui.**

`scripts/ensaios/os_nos_de_som_por_controle.py:186,192` decide de quem é o nó
comparando o TEXTO do `Description` do PipeWire com
`«Alto-falante do Controle N»` / `«Microfone do Controle N»`
(`NOME_DO_ALTO_FALANTE`, `NOME_DO_MICROFONE`, linhas 58-59). O N desse texto é o
`numero_do_assento` — a terceira conta da §1. Entre duas corridas do
instrumento, com a mesa mudando, **o mesmo nó virtual passou a ser atribuído a
outro controle**: o assento andou, o texto do `Description` andou junto, e o
censo seguiu o texto.

Não é defeito novo: é a §2 outra vez, medida por um terceiro lado. O que ele
acrescenta é que **a divergência já contamina INSTRUMENTO**, não só tela — quem
for medir o som por controle mede errado sem perceber.

**A RESSALVA DELA, 09/09/2026, e ela é sobre o produto, não sobre a bancada:**

> *"aí é foda pq a ideia não é termos nada focado pro meu caso apenas, mas como
> produto que possa funcionar com outra pessoa."*  <!-- noqa-acento: citação literal dela -->

O que isso decide: **casar por texto de rótulo é a cura errada**, mesmo que
funcionasse na mesa dela. O rótulo é prosa em português, muda com tradução,
muda quando o assento anda, e some se alguém renomear o nó. A âncora tem de ser
o que o daemon ESCREVE e não muda de forma: a propriedade do nó, não a frase
que o usuário lê.

Então a cura da §4(a) ganha uma segunda metade:

1. o `Description` continua sendo o rótulo humano — «Microfone do Controle N»,
   com o N da tela (§4a);
2. o nó ganha uma **propriedade de posse** (`hefesto.controle.uniq`, ou o que a
   ponte já tiver de identidade estável do aparelho), e **é por ela que
   instrumento e produto casam** — nunca pelo texto.

A §5 ganha, com isso, uma mordida a mais:

* renomeie o `Description` de um nó à mão e o censo **continua** acertando o
  dono. Se ele errar, ele ainda está lendo prosa.

## Critério de pronto — por cabo · por BT · no perfil · por controle

É a régua dela de 08/09 ([CABO-BT-PERFIL-CONTROLE-01](2026-09-08-CABO-BT-PERFIL-CONTROLE-01-a-regua-de-pronto-de-toda-feature-da-tela.md)).

| | |
| --- | --- |
| cabo / BT | o número tem de ser o mesmo nos dois — hoje o assento conta conectados, e um controle no rádio que cai e volta troca de nome |
| no perfil | não: o número é de sessão, não de perfil |
| por controle | é a pergunta inteira desta sprint |
