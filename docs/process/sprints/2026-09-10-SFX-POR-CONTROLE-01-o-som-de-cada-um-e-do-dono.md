---
sprint: SFX-POR-CONTROLE-01
estado: feita
onda: MESA-COMPLETA
posse:
  ESCREVE:
    - src/hefesto_dualsense4unix/daemon/subsystems/alto_falante.py
cria:
  - tests/unit/test_o_sfx_de_cada_um_e_do_dono.py
bancada: false
depois_de:
  - SOM-FIADO-01
nao_toca:
  - novo-layout/
---

# SFX-POR-CONTROLE-01 — o som de cada um é do dono

**Lote A, sprint 2 do índice
[A MESA DE QUATRO, COMPLETA](2026-09-10-A-MESA-DE-QUATRO-COMPLETA-INDICE.md).**

## §0 — O defeito, e é a MESMA FAMÍLIA que a A1 fechou de manhã

`GerenciadorDeNosDeSom` aceita `fonte_por_controle` desde que nasceu, e
**ninguém o injetava**. O campo `speaker.fonte` existe no perfil
(`ProfileSpeakerConfig.fonte: Literal["mix","sfx"] | None`), a aba o grava, e
**todo nó nascia com o padrão**: a escolha dela morria no disco.

Duas peças com chamador zero no mesmo módulo, no mesmo dia — é o que o índice
avisava na §4, e é por isso que ele avisava.

## §1 — As duas fontes, e a diferença é a cena dela

| fonte | o que o nó recebe | quando |
| --- | --- | --- |
| `sfx` | nada por baixo — o nó fica LIVRE para a corrente que o jogo mandar | o padrão; é o tiro saindo no plástico DAQUELE jogador |
| `mix` | o monitor da SAÍDA PADRÃO cai também neste nó | o *«HDMI completo»* dela: o que a TV recebe, o controle recebe junto |

Numa mesa de quatro isso é **por pessoa**. O P1 pode querer o mix inteiro no
ouvido e o P2 só os efeitos do jogo — e um nó que ignora a escolha entrega a
mesma coisa aos quatro. Pior: `mix` publicado em quem não pediu põe a chamada
de voz, o navegador e a música no ouvido daquele jogador.

## §2 — O que foi fiado

| # | elo | onde |
| --- | --- | --- |
| 1 | o callable por controle, injetado no `start()` | `AltoFalanteSubsystem._fonte_do_controle` |
| 2 | o cache por `(nome do perfil, mtime)` — **não lê disco no laço** | `_fontes_do_perfil` |
| 3 | a leitura dos overrides, com `{}` honesto | `_fontes_por_controle` |
| 4 | a grafia do `uniq`: sysfs dá `aa:bb:…`, o perfil guarda `aabb…` | `_uniq_de_perfil` |

**O elo 4 é o que some em silêncio quando erra.** Chave que não bate devolve
`None` sem erro nenhum, e a escolha dela desaparece sem sintoma.

**E `None` continua sendo *"sem opinião"*, nunca `sfx`.** Gravar o padrão na
ausência congelaria a escolha de quem nunca escolheu — e o padrão não poderia
mais mudar sem reescrever perfil.

## §3 — As réguas, e as cinco mordidas

| régua | o que trava |
| --- | --- |
| `test_o_sfx_de_cada_um_e_do_dono.py` (7) | a fonte vem do override daquele controle; quem não declarou fica com o padrão; a grafia casa; sem perfil ativo a resposta é o padrão; o perfil não é relido a cada varredura; a escolha vale na varredura seguinte ao "Salvar"; e o `start()` injeta |
| `test_a_mesa_de_quatro_sobe_no_daemon.py::test_o_mix_de_um_nao_vira_o_mix_do_vizinho` | **no `Daemon` de verdade**: o P1 em `mix` com monitor resolvido, e os três vizinhos no padrão, sem monitor |

As mordidas, conferidas uma a uma:

* tirar `fonte_por_controle=` do `start()` → reprovam a do subsystem e a do daemon;
* trocar `_uniq_de_perfil(uniq)` por `uniq` cru → 3 reprovam;
* `None` virar `sfx` → 1 reprova;
* cache que nunca invalida → 1 reprova.

**UMA MORDIDA FUROU E FOI APERTADA:** a do `None` passava, porque o perfil do
teste não tinha nenhum controle com override de alto-falante **sem** `fonte`.
O caso que a mordida precisava não existia — *uma mordida que passa não mede
nada*. O perfil ganhou o P2 com `{"volume": 120}` e ela passou a morder.

**E o perfil do teste nascia INVÁLIDO:** faltava o `match`, obrigatório no
schema. O produto o recusava pelo `except` (comportamento certo) e a régua
media o dublê quebrado em vez da fiação.

## §4 — O QUE FALTA, E É SEU — nada aqui é de agente

Esta sprint **não pode fechar sozinha**, e a razão é a mesma de sempre nesta
casa: *o som só fecha com a orelha*. O que está provado é que o produto MONTA e
ROTEIA certo; o que ninguém pode provar sem você é que sai certo no plástico.

### 4.1 — O teste dos dois nós (10 minutos, com dois controles)

1. abra a interface, aba **Controles**;
2. no cartão do **P1**, ponha a fonte em **mix**; no do **P2**, em **sfx**;
3. Salvar;
4. toque qualquer coisa no PC (um vídeo serve);
5. **o P1 tem de tocar junto com a TV. O P2 tem de ficar em silêncio.**

Se o P2 tocar junto, a fonte vazou e esta sprint reabre.

### 4.2 — O negativo de rota (o que falta ao mapa, e vale para A1 e A2)

Continua sendo o mesmo de sempre, e é o que segura
`audio.alto_falante@dualsense` em `radio_aciona: não`:

1. mire um timbre no **HDMI** (não no nó do controle);
2. **o controle NÃO pode tocar.** Se tocar, o som que ouvimos em 10/09 podia
   estar vindo de outro caminho;
3. depois, o **teste cego**: alguém dispara ou não dispara, e você diz se
   ouviu — sem ver a tela.

Enquanto os dois não acontecerem, a célula fica onde está. Não é dúvida sobre
o que você ouviu: é disciplina, e é a que impede a casa de fabricar prova.

## §5 — O próximo

**A3 (SOM-NA-TELA-01)** — ligar/desligar o som por controle na interface. A
fiação de A1 e A2 já entrega nó, rota e fonte por controle; o que falta é o
botão valer só para aquele controle. **Ela toca a TELA, então fecha com o seu
olho** — é sprint de outra natureza, e está escrita no índice.
