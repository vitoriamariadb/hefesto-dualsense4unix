# CANAL-POR-CONTROLE-01 — quatro controles, quatro canais

> **Decisão dela, 03/09/2026:** *"4 controles os 4 tem que ter canais de entrada
> unico pra cada qual. Não faz sentido essas frases."*
>
> Ela recusou a PREMISSA de um recado de tela, não o texto dele. As frases
> propostas descreviam a perda de um recurso único que passa de mão em mão — e
> não é isso que o produto deve ser. **Nenhuma frase nova foi escrita.**

## 0. O QUE EXISTE HOJE, medido

Com os dois controles dela na mesa, um no cabo e um no rádio:

```
$ pactl list sources short | grep -i dualsense
600  alsa_input...DualSense_Wireless_Controller-00.iec958-stereo  RUNNING
     (o controle do RÁDIO não publica fonte nenhuma)
```

**Existe UM canal.** Não dois, e muito menos quatro.

O rádio está trancado DUAS vezes, e as duas travas são NOSSAS:

| trava | onde | o que exige |
| --- | --- | --- |
| opt-in por ambiente | `daemon/subsystems/bt_mic.habilitado_por_env` | uma variável de ambiente ligada |
| declaração à mão | `daemon/subsystems/bt_mic.uniqs_declarados` | o `uniq` marcado no `maquina.json`, um a um |

**É a mesma forma do que a ONDA-CONEXOES-11 acabou de destravar na identidade:**
o aparelho aceitava, e quem recusava era o filtro nosso. Lá foram três filtros
de cabo; aqui são duas travas de opt-in.

## 1. O CONTRATO

1. **Todo DualSense conectado publica o canal de captura DELE**, no cabo e no
   rádio, sem variável de ambiente e sem declaração à mão.
2. **A eleição para de decidir quem TEM canal.** Ela passa a decidir só quem é a
   **fonte padrão do sistema** — o único recurso genuinamente único, porque
   `pactl get-default-source` devolve um nome só.
3. **Ninguém perde nada quando outro é eleito.** Perder o padrão não é perder o
   canal: o seu microfone continua aberto e qualquer app pode escolhê-lo.
4. **Nenhum recado novo de tela.** O evento que a frase descreveria deixa de
   existir. Se sobrar alguma tela dizendo que alguém "perdeu o microfone", ela
   está errada e sai.

## 2. POR QUE AS TRAVAS EXISTIAM, e o que responder antes de tirá-las

Não se arranca trava sem saber o que ela segurava. **Este é o primeiro trabalho
da sprint, e ele é de leitura:**

- Ache o commit e o documento que introduziram cada trava, e escreva o que cada
  uma protegia. Uma ponte de rádio que sobe sozinha custa bateria, banda de
  rádio, ou estabilidade? Há medição disso, ou era precaução?
- Se a razão ainda vale, **a trava não sai** — ela vira automática, com o
  critério explícito no lugar da declaração à mão.
- Se a razão caducou, ela sai, e a razão de sair vai escrita no lugar de onde ela
  saiu. É a regra desta casa e a ONDA-CONEXOES-11 acabou de aplicá-la.

**Hipótese tem de explicar o que JÁ funcionava.** O canal do cabo sobe sozinho
hoje, sem opt-in nenhum, e ninguém reclamou de custo. Qualquer razão que
justifique trancar o rádio precisa dizer por que o cabo não precisa da mesma
proteção.

## 3. AS PEÇAS

### PEÇA A — a ponte sobe sozinha
`daemon/subsystems/bt_mic.py`. Tirar as duas travas ou torná-las automáticas,
conforme a §2 responder. O `maquina.json` continua podendo DESLIGAR um controle
específico — o que sai é a exigência de LIGAR um a um.

### PEÇA B — a eleição encolhe para o que é de fato único
`integrations/eleicao_de_microfone.py` e `daemon/subsystems/mic_da_mesa.py`.
Separar "ter canal" de "ser o padrão". As três recusas medidas (BT-E-VPAD-01,
MIC-BT-DONO-01, MIC-DOIS-DONOS-01) continuam valendo e não são tocadas.

### PEÇA C — a tela conta quatro
As abas que falam de microfone passam a mostrar o canal de CADA controle, não o
da mesa. Enquanto a bancada não tiver o desenho, isto para e espera ela.

## 4. PRONTO É

1. Com dois controles na mesa, `pactl list sources short` mostra **DOIS** canais
   de DualSense — e ela viu.
2. Trocar o padrão de um para o outro **não derruba** o canal de ninguém.
3. Nenhuma tela diz que alguém perdeu o microfone.
4. Cada peça com teste que MORDE, com a data em `mordida_provada_em`.
5. 30 portões verdes.

## 5. E CASA COM A LUZ-DO-MIC-01

O contrato da luz — *aceso = algum app com o microfone DESTE controle aberto* —
já pressupõe canal por controle. **As duas decisões são a mesma decisão vista de
dois lados:** a luz do controle só faz sentido se o canal for dele. Se esta
sprint não fechar, o estado `aceso` da luz nunca acende para quem está no rádio,
porque não há canal para abrir.
