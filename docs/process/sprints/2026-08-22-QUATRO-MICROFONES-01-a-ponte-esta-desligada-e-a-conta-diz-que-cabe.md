# QUATRO-MICROFONES-01 — a ponte está desligada, e a conta diz que cabe

**22/08/2026.** A mesa dela tem três adaptadores desde esta semana, e foi
exatamente para isto que eles foram comprados. A ponte que usa essa folga
continua desligada, e **nenhuma superfície do produto a liga**.

**Estado:** ABERTA — **decisão DELA**, e ela é de privacidade antes de ser
técnica.

---

## O defeito, em uma linha

**Os três dongles compraram a folga de rádio que os quatro microfones exigem, e
a ponte que os usaria não tem interruptor em lugar nenhum.**

## O que foi MEDIDO

**O estado de hoje** (varredura de 22/08 sobre `src/`):

```
grep -rn "bt_mic_enabled" src/
  daemon/lifecycle.py:277        bt_mic_enabled: bool = False     <- declaração
  daemon/subsystems/bt_mic.py:79 getattr(config, "bt_mic_enabled", False)
  daemon/ipc_handlers.py:2938    "enabled": ...                    <- só relata

grep -rn "bt_mic_enabled\s*=" src/   → nada além da declaração
```

Ou seja: o campo existe, o daemon o lê, o IPC o publica — e **ninguém o
escreve**. A ponte só sobe por `HEFESTO_DUALSENSE4UNIX_BT_MIC=1`, à mão, no
ambiente do daemon.

**A conta do rádio**, do
[GUIA-RADIO-DA-SALA.md](../../../GUIA-RADIO-DA-SALA.md) §2, que por sua vez cita o
A/B de 25/07 feito no próprio projeto:

```
mic DESLIGADO : input 260.4 Hz   audio   0.0 Hz   total 260.4 Hz
mic LIGADO    : input 170.5 Hz   audio 106.2 Hz   total 276.7 Hz

5 controles × 277 pacotes/s   ≈  1.385 transações/s
Um adaptador Bluetooth Classic ≈  1.600 slots/s
TRÊS adaptadores               =  4.800 slots/s
```

O total de pacotes **não se move** quando o mic liga: o áudio não abre canal
novo, ele ocupa lugar na mesma fila. Por isso a divisão sugerida do guia é por
microfone — um par com mic consome ~554 transações/s de 1.600, cerca de um
terço de um adaptador.

**Com um adaptador a mesa cheia com microfone não cabe. Com três, cabe com
folga.** Ela já tem os três, e os controles já estão distribuídos 1/2/1.

## O que já está decidido, e não se reabre

O `bt_mic.py` carrega no cabeçalho as duas razões de nascer desligado, e as
duas continuam de pé:

1. **Privacidade.** *"Um microfone que liga sozinho quando o daemon sobe é
   inaceitável, por melhor que seja a intenção. A ponte é um gesto explícito."*
2. **Banda do rádio.** Com o mic ligado, os reports de input caem de ~260 para
   ~170 Hz. Continua muito acima do poll de 60 Hz do daemon, mas **quem usa mira
   por giroscópio perde resolução de integração** — o espelho de motion mira
   250 Hz. É trade-off da usuária, não do programa.

E o [ONDE PARAMOS de 16/08](../2026-08-16-ONDE-PARAMOS-a-sessao-de-vinte-horas.md)
§1.5 registrou o estado como **decisão medida**: ponte parada, risco por dia
zero, e ela subiu naquele dia porque um agente a subiu à mão, duas vezes.
**Nada disto é para desfazer.** O que esta sprint pede é o gesto explícito
existir dentro do produto, em vez de morar numa variável de ambiente.

## O que NÃO é

- **Não é ligar o mic por padrão.** Se a entrega saísse assim, ela estaria
  errada por construção.
- **Não é a MIC-BT-DONO-01**, que trata da posse do mudo e do ciclo de vida do
  botão. Nem a CONTROLE-INTEIRO-NO-RADIO-01, que é a metade de SAÍDA (o sink
  virtual, que não existe). Esta é só a ENTRADA, e só o interruptor.
- **Não é a cadeia do microfone da TRES-PORTOES-01**, que mede se o áudio chega.
  Aqui a pergunta é anterior: ninguém consegue ligar.

---

## Entregas

### E1 — o interruptor existe, e ele é um gesto explícito

Um escritor de `bt_mic_enabled` que a janela alcance. O lugar natural é a aba
**Configurações**, seção "Os controles" — que já tem um card por controle e já
mostra o que cada aparelho sabe fazer.

**Três regras que a entrega não pode quebrar:**

1. nasce desligado, sempre, em máquina nova;
2. o estado é **da mesa**, não do perfil — o `maquina.json` de `CONFIG-03` é
   onde isto mora, porque um microfone que liga ao trocar de jogo é a mesma
   surpresa que o cabeçalho do módulo recusa;
3. a tela diz o preço antes: os ~170 Hz de input e o que isso significa para
   mira por giroscópio. Sem isso, o interruptor é uma armadilha educada.

### E2 — o produto diz quanto cabe, com a mesa que ela tem

O medidor de rádio de `CONFIG-04` já mostra a ocupação por adaptador com as duas
fatias (entrada em roxo, áudio em ciano) e o selo `NNN/1600 · derivado da
especificação`. Falta ele responder a pergunta que ela vai fazer ao ver o
interruptor: **"liga em quantos?"**

O medidor já tem o dado. A entrega é a frase, e ela é derivada — nunca um número
digitado à mão.

### E3 — o ensaio dos quatro ao mesmo tempo

**DELA, por construção.** Quatro controles, três adaptadores na divisão 1/2/1,
os quatro microfones ligados, e um jogo de co-op aberto. O que se anota: se
alguém cai, se a mira por giroscópio piora de forma perceptível, e se o áudio
chega inteiro.

O que a bancada precisa ter antes: a E1 (senão não há como ligar), e o
`bt_active_mode.sh` desarmado do `head -1` (E2 da
[N-IGUAL-A-UM-01](2026-08-22-N-IGUAL-A-UM-01-o-produto-escolhe-um-quando-ha-tres.md)),
senão a cura do Pro Controller está armada no adaptador errado durante o ensaio
e contamina o resultado.

---

## O que é decisão DELA

1. **Se o interruptor é por controle ou da mesa inteira.** Quatro microfones é o
   pedido; um por card é a forma que a seção já tem.
2. **Se vale ligar sabendo do preço de giroscópio.** A medição existe desde
   25/07 e nunca foi levada a ela nesses termos.

---

## Como morde

Arranque o escritor da E1 e o interruptor volta a não ter efeito nenhum — que é
o estado de hoje, e é o que um teste tem de reprovar. O portão que impede o
campo de voltar a ficar órfão é o `portao_a_casa_sabe_e_o_produto_nao_faz.py`:
`bt_mic_enabled` sem escritor é a definição do que ele mede.

## O que este achado ensina

**Um campo lido por três lugares e escrito por nenhum é uma feature que só
existe para quem lê o código.** O hardware foi comprado, a conta foi feita, o
módulo está pronto desde julho — e a distância entre isso e o produto é um
interruptor.
