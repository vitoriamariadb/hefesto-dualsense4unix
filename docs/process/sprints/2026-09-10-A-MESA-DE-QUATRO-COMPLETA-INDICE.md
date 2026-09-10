---
sprint: A-MESA-DE-QUATRO-COMPLETA-INDICE
estado: aberta
onda: MESA-COMPLETA
posse:
  COORDENA:
    - docs/process/sprints/2026-09-10-A-MESA-DE-QUATRO-COMPLETA-INDICE.md
cria: []
bancada: true
depois_de: []
nao_toca:
  - novo-layout/
---

# A MESA DE QUATRO, COMPLETA — o índice

**A cena que este projeto existe para entregar, com as palavras dela
(10/09/2026):**

> *"imagina que estejam jogando um fps com 4 players local (3 por bt … + um no
> cabo). cada feature funcionando, giroscopio, acelerometro, touch, gatilho e
> vibração no max. Só que pra cada controle. o canal de som sfx (a cada tiro
> dado o som do tiro efeito sonoro sai pra cada controle), e cada controle com
> seu microfone individual funcionando. De forma que cada user de dualsense
> tenha a mesma experiência ao mesmo tempo."*
> <!-- noqa-acento: citação literal dela -->

E a régua de aceitação, também dela, que é o que separa esta frente de uma
demonstração:

> *"qualquer outro usuário que instalar no pc e usar os 4 dualsense ao mesmo
> tempo tem que ter acesso a mesmas features e se cada user escolher desativar
> uma delas, vai conseguir sem impactar os demais."*
> <!-- noqa-acento: citação literal dela -->

---

## §0 — O ESTADO MEDIDO, e ele é melhor do que a fila sugere

Levantado no `docs/data/mapa-controles.csv` em 10/09/2026 — 60 linhas de
feature do DualSense, lidas uma a uma.

**AS FEATURES DE ENTRADA JÁ ESTÃO VERDES NOS DOIS TRANSPORTES.** Não há sprint
a escrever para elas; há bancada a rodar.

| feature | cabo | rádio | grau |
| --- | --- | --- | --- |
| giroscópio · acelerômetro | sim | **sim** | medido |
| touchpad · clique · cursor | sim | **sim** | medido |
| gatilho adaptativo (E e D) | sim | **sim** | medido |
| vibração: rumble E/D, FF, simultâneo, passthrough | sim | **sim** | medido |
| LED de jogador · lightbar · LED do microfone | sim | **sim** | medido |
| bateria | sim | **sim** | medido |

**O BURACO É ÁUDIO, NAS DUAS DIREÇÕES** — e é exatamente onde 10/09 mexeu:

| feature | cabo | rádio | o que falta |
| --- | --- | --- | --- |
| `audio.alto_falante` | parcial | **não** | ~~a ponte existe e ninguém a constrói~~ **FECHOU (A1)**; falta o negativo de rota e o teste cego, que são DELA |
| `audio.microfone` | sim | **parcial** | o corte foi curado hoje; falta medir com quatro |

**A INDEPENDÊNCIA JÁ TEM ESTRUTURA.** `profiles.schema.ControllerOverrides`
tem sete campos por controle — `leds`, `triggers`, `rumble`, `speaker`, `mic`,
`sensores`, `mascara`. O que falta não é o campo: é a PROVA de que cada um
chega ao aparelho certo sem tocar no vizinho.

**E A ESCALA NUNCA FOI MEDIDA.** Todo número deste mapa saiu de bancadas com um
ou dois controles. Quatro simultâneos, com tudo ligado, é medição que não
existe — e o mapa já avisa que **o orçamento de banda é do ADAPTADOR**, não do
controle (`audio.microfone@dualsense`, medição de 23/08/2026).

---

## §1 — O QUE 10/09 ENTREGOU, e por que ele abre esta frente

| o quê | onde |
| --- | --- |
| **O som SAI pelo rádio** — report `0x35`, 334 B, um quadro Opus, 10,667 ms | 70 s com a orelha dela; `ARRANJO_035` no produto, provado byte a byte |
| **O microfone para de cair** — a raiz era o `hid-playstation` lendo áudio como botão | `patch/0003`; 1231 transições do bit viraram **uma** |
| **O teclado/mouse maluco acabou** — mesma causa | palavra dela: *"nao ficou maluco e nao desligou"* <!-- noqa-acento: citação literal dela --> |

Antes de 10/09 esta frente não podia ser escrita: metade dela era *"descobrir
se o aparelho aceita"*. Agora é fiação, medição e tela.

---

## §2 — OS TRÊS LOTES, na ordem de desbloqueio

### LOTE A — O SOM SAI, POR CONTROLE (3 sprints)

Desbloqueia sozinho. É a dívida que 10/09 deixou explícita.

| # | sprint | o que fecha |
| --- | --- | --- |
| A1 | **SOM-FIADO-01** — a ponte por controle sobe em produção | **FEITA em 10/09/2026** — a fábrica por controle, o subsystem no daemon (as três pontas) e a guarda «sem rota, sem nó». `casa-sabe` fechou. [A sprint](2026-09-10-SOM-FIADO-01-a-ponte-por-controle-sobe-em-producao.md) |
| A2 | **SFX-POR-CONTROLE-01** — o efeito sonoro chega ao controle certo | **FEITA em 10/09/2026** — `fonte_por_controle` era o mesmo defeito da A1: parâmetro sem chamador. O `mix` de um não vira o do vizinho, provado no daemon. [A sprint](2026-09-10-SFX-POR-CONTROLE-01-o-som-de-cada-um-e-do-dono.md) |
| A3 | **SOM-NA-TELA-01** — ligar/desligar o som por controle | o botão existe; falta ele valer só para aquele controle |

### LOTE B — O MICROFONE DE CADA UM (3 sprints)

Depende de A só no que toca a tela. A estrutura de N microfones simultâneos
**já existe** (`bt_mic` trabalha com um conjunto de `uniq`s).

| # | sprint | o que fecha |
| --- | --- | --- |
| B1 | **MIC-OS-QUATRO-01** — quatro fontes de captura ao mesmo tempo | medir; a estrutura existe, a prova com quatro não |
| B2 | **LUZ-DO-MIC-VIVA-01** — a luz diz o estado, com o mic no ar | o contrato de 02/09 (apagado/aceso/piscando) nunca rodou: o mic caía antes |
| B3 | **MIC-NA-TELA-01** — ligar/desligar o microfone por controle | idem A3, do outro lado |

### LOTE C — A MESA DE QUATRO, MEDIDA (3 sprints)

Depende de A e B. É a régua de aceitação dela.

| # | sprint | o que fecha |
| --- | --- | --- |
| C1 | **QUATRO-COM-TUDO-01** — a bancada da cena inteira | 3 no rádio + 1 no cabo, todas as features, ao mesmo tempo |
| C2 | **A-BANDA-DO-RADIO-01** — o orçamento do adaptador | o mapa diz que o limite é do ADAPTADOR; com 3 mics + 3 SFX + IMU, quanto sobra? |
| C3 | **CADA-UM-DECIDE-01** — a independência, provada | um desativa uma feature e os outros três não sentem |

---

## §3 — O QUE É DELA, E NÃO DE AGENTE

1. **A orelha.** Som e microfone só fecham com ela ouvindo. Nenhuma régua
   substitui isso, e o mapa já recusa afirmação forte sem a medição.
2. **O negativo de rota e o teste cego** do som — o contrato está escrito na
   própria célula `audio.alto_falante@dualsense`, e a corrida de 10/09 cumpriu
   um terço dele.
3. **A decisão do C2, se a banda não couber.** Se três microfones mais três
   canais de SFX estourarem o adaptador, a escolha entre *"degrada"*,
   *"recusa"* ou *"pede um segundo adaptador"* é dela, com o número na mão.

---

## §4 — A ARMADILHA DESTA FRENTE, e ela já mordeu esta casa

**`MONTOU` não é `O APARELHO OBEDECEU`.** A escada de degraus desta casa é
`MONTOU → SAIU NO FIO → O APARELHO OBEDECEU → O JOGO RECEBEU → O JOGO REAGIU`,
e a linha do alto-falante passou meses em `MONTOU` sendo lida como pronta.

Nesta frente isso teve endereço concreto: em 10/09 pela manhã o
`PonteDeSomPorRadio` nasceu com teste, com régua e com o report certo — **e
nenhuma linha de produção o construía**. A conferência daquele dia pegou o mapa
afirmando *"a ponte existe no produto"*, que era forte demais.

**A1 FECHOU ESSE BURACO NA MESMA TARDE**, e o preço dele ficou registrado: o
portão `casa-sabe` acusava a peça sem chamador, e nove lápides `_SEM_CAMINHO_HOJE`
morreram de uma vez quando a fiação chegou. Duas curas de instrumento vieram
junto — a suíte estava abrindo o hidraw do controle DELA, e um default de função
média o mundo do import.

> **Toda sprint deste índice fecha em `O JOGO REAGIU` ou não fecha.** Um teste
> verde sobre uma peça que ninguém liga é o defeito que este índice existe para
> não repetir.

---

## §5 — O próximo comando

```bash
cd /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix
git log --since=midnight --format='%h %s'     # o que esta casa fechou hoje
```

**A1 e A2 estão FEITAS**, e as duas fecharam o mesmo defeito de família: um
parâmetro por controle que ninguém injetava. O lote A tem agora nó, rota e
fonte **por controle**, provados num `Daemon` de verdade com quatro DualSense.

**A PRÓXIMA A RODAR É A A3 (SOM-NA-TELA-01)** — e ela é de outra natureza:
toca a TELA, então fecha com o olho dela, nunca com régua.

**O QUE ESPERA A BANCADA DELA está reunido num lugar só:**
[OS GESTOS QUE SÓ ELA PODE FAZER](2026-09-10-OS-GESTOS-QUE-SO-ELA-PODE-FAZER.md)
— sete gestos, com o tempo de cada um e o que cada um desbloqueia.
