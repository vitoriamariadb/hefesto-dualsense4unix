---
sprint: OS-GESTOS-QUE-SO-ELA-PODE-FAZER
estado: aberta
onda: MESA-COMPLETA
posse:
  COORDENA:
    - docs/process/sprints/2026-09-10-OS-GESTOS-QUE-SO-ELA-PODE-FAZER.md
cria: []
bancada: true
depois_de:
  - SOM-FIADO-01
  - SFX-POR-CONTROLE-01
nao_toca:
  - novo-layout/
---

# OS GESTOS QUE SÓ ELA PODE FAZER — a fila da bancada, 10/09/2026

**Você pode desligar aqui.** Este arquivo é o que sobra para VOCÊ na frente da
mesa de quatro, e nada dele espera código: o produto já monta, já roteia e já
escolhe a fonte por controle, com régua que morde em cada elo.

O que nenhuma régua substitui é a **orelha** e o **aparelho na mão**.

---

## §0 — O estado, para você retomar sem reler nada

| | |
| --- | --- |
| **Fechou hoje** | o som sai pelo rádio (`0x35`), o microfone parou de cair, a ponte é construída por controle, a fonte (`mix`/`sfx`) é de cada um |
| **Portões** | 55 de 56 (o vermelho é o `reb/`, que é seu e é antigo) |
| **Onde a fila continua** | [A MESA DE QUATRO, COMPLETA](2026-09-10-A-MESA-DE-QUATRO-COMPLETA-INDICE.md) |

---

## §1 — OS SETE GESTOS, na ordem que desbloqueia mais

Cada um diz o tempo, o que precisa na mesa, e **o que ele destrava**.

### G1 · O negativo de rota do som — 10 min, 1 controle no rádio

**Destrava:** `audio.alto_falante@dualsense` sair de `radio_aciona: não` — e
com ela, o grau da linha inteira no mapa.

1. mire um timbre no **HDMI** (não no nó do controle);
2. **o controle não pode tocar.**

Se tocar, o som de 10/09 podia estar vindo de outro caminho, e a linha volta
para `MONTOU`. É o único gesto que pode DERRUBAR o que fechou hoje — por isso
é o primeiro.

### G2 · O teste cego do som — 10 min, 1 controle no rádio, alguém junto

**Destrava:** o mesmo que o G1; os dois juntos completam o contrato da célula.

Alguém dispara ou não dispara o som, sem você ver a tela, e você diz se ouviu.
Três rodadas bastam.

### G3 · O teste dos dois nós (a fonte por controle) — 10 min, 2 controles

**Destrava:** a conferência da **A2 (SFX-POR-CONTROLE-01)**.

1. aba **Controles**: P1 em **mix**, P2 em **sfx**, Salvar;
2. toque um vídeo no PC;
3. **o P1 toca junto com a TV; o P2 fica em silêncio.**

Se o P2 tocar, a fonte vazou e a A2 reabre.

### G4 · Os quatro microfones ao mesmo tempo — 20 min, 4 controles

**Destrava:** a sprint **B1 (MIC-OS-QUATRO-01)**, e o número que falta para a
**C2**.

A estrutura de N microfones já existe (`bt_mic` trabalha com um conjunto de
`uniq`s) e **nunca foi medida com quatro**. Ligue os quatro, fale em cada um,
e diga qual falha primeiro — se algum falhar.

Enquanto o mic caía a 1,1 s isso não fazia sentido medir. Hoje faz: a raiz foi
curada e a cura está instalada.

### G5 · A luz do microfone, com o mic no ar — 10 min, 1 controle

**Destrava:** a sprint **B2 (LUZ-DO-MIC-VIVA-01)**.

O contrato de 02/09 (apagado / aceso / **piscando**) nunca rodou de verdade,
porque o microfone caía antes. Com o mic ligado e captando, a luz tem de
**piscar**. Diga o que ela faz.

### G6 · A mesa de quatro com TUDO ligado — 40 min, 4 controles + hub

**Destrava:** a sprint **C1 (QUATRO-COM-TUDO-01)** — a cena que este projeto
existe para entregar.

Três no rádio + um no cabo, e ao mesmo tempo: giroscópio, acelerômetro,
touchpad, gatilho adaptativo, vibração no máximo, som por controle e microfone
por controle. **Todo número deste mapa saiu de bancadas com um ou dois.**

O que anotar: o que degrada primeiro, e em que ordem.

### G7 · O orçamento do adaptador — 20 min, depois do G6

**Destrava:** a sprint **C2 (A-BANDA-DO-RADIO-01)**, e a decisão que é sua.

O mapa já avisa que **o limite é do ADAPTADOR, não do controle**
(`audio.microfone@dualsense`, medição de 23/08/2026). Com 3 microfones + 3
canais de SFX + IMU, quanto sobra?

**Se não couber, a escolha é sua**, e são três: *degrada*, *recusa*, ou *pede
um segundo adaptador*. Eu não decido essa — ela muda o que a pessoa que
instalar o produto vai sentir, e você é quem sabe o que prefere sentir.

---

## §2 — O QUE EU FAÇO ENQUANTO ISSO, e não depende de você

| sprint | o que é |
| --- | --- |
| **A3 · SOM-NA-TELA-01** | ligar/desligar o som por controle. A fiação existe; falta o botão valer só para aquele controle. **Fecha com o seu olho**, mas eu deixo pronto para você só olhar |
| **B3 · MIC-NA-TELA-01** | idem, do lado do microfone |
| **C3 · CADA-UM-DECIDE-01** | a independência provada em régua: um desativa uma feature e os outros três não sentem. Dá para provar no `Daemon` sem bancada |

Nenhuma das três precisa de aparelho na mesa para SER ESCRITA. Todas as três
precisam do seu olho para FECHAR — a regra da casa não muda.

---

## §3 — A armadilha que este dia deixou, e ela vale para as próximas

**Dois parâmetros por controle passaram meses sem chamador**, no mesmo módulo:
`ponte_do_radio_por_controle` e `fonte_por_controle`. Os dois tinham teste, os
dois tinham régua, e nenhum dos dois era construído por linha de produção
nenhuma.

> **Quando uma sprint entrega um parâmetro «por controle», a pergunta que fecha
> não é *"tem teste?"* — é *"quem o constrói em produção?"*.** O portão
> `casa-sabe` responde essa pergunta e foi ele quem acusou os dois.

---

## §4 — O próximo comando, quando você voltar

```bash
cd /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix
git log --since=midnight --format='%h %s'
```

E o gesto por onde começar é o **G1**: ele é o único que pode derrubar o que
fechou hoje, e por isso vale mais que os outros seis juntos.
