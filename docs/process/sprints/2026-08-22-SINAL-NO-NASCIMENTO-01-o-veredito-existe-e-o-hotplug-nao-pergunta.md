# SINAL-NO-NASCIMENTO-01 — o veredito existe, e o hotplug não pergunta

**22/08/2026.** Continuação direta da
[BARRA-MUDA-01](2026-08-22-BARRA-MUDA-01-a-lampada-nao-se-le-o-nascimento-sim.md),
que entregou o módulo e declarou o que faltava ligar. Metade foi ligada no mesmo
dia, algumas horas depois — esta sprint é a outra metade.

**Estado:** ABERTA

---

## O defeito, em uma linha

**O produto sabe dizer se uma conexão nasceu condenada, e não pergunta na hora
em que ela nasce.**

## O que já está ligado, e o que não está — medido em 22/08

```
grep -rn 'Disconnect(' src/
  → integrations/gesto_de_reconexao.py:234

grep -rn 'limpo_para_conectar\|sinal_da_barra' src/ | grep -v integrations/sinal_da_barra.py
  → app/actions/config/secao_controles.py:280   (instancias_dualsense)
  → app/actions/config/secao_controles.py:1105  (limpo_para_conectar)
```

| Ponto de chamada da BARRA-MUDA-01 §7 | Estado hoje |
|---|---|
| o **botão de reconectar** consultar `limpo_para_conectar` antes de oferecer a cura | **LIGADO** — `secao_controles.py:1110`, no botão "A luz não acende" (`8b167cc`) |
| o **tique de hotplug** carimbar o veredito no nascimento | **NÃO LIGADO** |

E `sinal_da_barra.ler_a_mesa()` — a metade de **diagnóstico** do módulo, a que
responde *"esta instância nasceu limpa?"* — continua com **zero chamadores em
`src/`**. O que aparece na varredura é `mesa_de_radio.ler_a_mesa`, que é outra
função com o mesmo nome (ver "O que NÃO é").

## Por que importa

Sem o carimbo no nascimento, o veredito só existe enquanto o **diário** ainda
tem a linha `lightbar_escritor_cru_detectado`. É frágil por três razões
medidas na BARRA-MUDA-01:

1. o diário rotaciona, e a instância pode viver mais que a janela de retenção;
2. o carimbo de tempo do sysfs **não serve** de relógio de nascimento (derrubado
   com medição: `os.stat()` deu o mesmo instante nos quatro, sete minutos
   depois de um `ls -la` que batia com o kernel);
3. o defeito **persiste na instância** — matar a Steam não cura. Sem carimbo, o
   produto não tem como distinguir "está travada desde que nasceu" de "está
   normal", e é justamente essa distinção que decide se vale oferecer a cura.

O custo do silêncio é a experiência que ela já descreveu em 12/08 e que agora
tem nome: a cura parece **intermitente**. Ela funciona quando a mesa está limpa
na hora, e não funciona quando não está — e sem o carimbo ninguém consegue dizer
qual dos dois casos aconteceu.

## O que NÃO é

- **Não é reconectar sozinho.** O produto derruba e espera o PS dela, por
  decisão registrada: `gesto_de_reconexao` **não tem** função `reconectar` de
  propósito, e cancelar não reconecta. Esta sprint não muda isso.
- **Não é a E1 da LUZ-CEGA-01** (o doctor enxergar o controle no rádio), que
  fechou em `29c8a19`.
- **Não é `mesa_de_radio.ler_a_mesa`.** São duas funções homônimas em módulos
  diferentes: a de `mesa_de_radio` lê ocupação de adaptador para a seção "A
  mesa"; a de `sinal_da_barra` dá o veredito de nascimento. A colisão está
  registrada como achado próprio na E4.

---

## Entregas

### E1 — o tique de hotplug carimba o veredito

Na conexão de cada controle, chamar o lado de **diagnóstico** do módulo e
guardar o veredito **junto da instância**, não em variável global: a
BARRA-MUDA-01 mediu que instâncias travadas e sãs coexistem na mesma máquina, no
mesmo adaptador, no mesmo minuto.

A chave de casamento **não é o MAC**: o `hw_version` é impressão digital de
plástico e casa instâncias através da reconexão, que é exatamente o que a
`O-ALVO-POR-MAC-E-BURACO-DE-TODAS-AS-ABAS` pede.

**Prova:** com a fixture das seis instâncias da BARRA-MUDA-01, quatro nascem
carimbadas como condenadas e duas como sãs, sem ler o diário na hora da
pergunta.

### E2 — o veredito aparece na tela

O card de cada controle já tem o botão "A luz não acende". Falta a **razão**:
enquanto o veredito diz que aquela instância nasceu condenada, o card pode dizer
isso — e, quando `limpo_para_conectar` diz que a mesa **não** está limpa agora,
o botão explica por que reconectar não vai adiantar em vez de simplesmente
recusar.

**Regra dela, já valendo:** sempre visível, só acionável no rádio. Botão que
some ensina que a tela é instável.

### E3 — o portão que impede o módulo de virar enfeite

O `portao_a_casa_sabe_e_o_produto_nao_faz.py` passou a medir alcance por GRAFO
em `61ba2ab`. Conferir que `sinal_da_barra` está no alcance dos pontos de
entrada declarados **depois** da E1 — e, se não estiver, é porque a E1 não foi
ligada no caminho que roda.

### E4 — a colisão de nome sai

`integrations/mesa_de_radio.py` e `integrations/radio_da_mesa.py` coexistem, e
`ler_a_mesa` existe em `mesa_de_radio` e em `sinal_da_barra`. É a colisão de
nome que o portão A-CASA-SABE passou a pegar hoje — aqui ela está no produto.

O trabalho é escolher UM nome por conceito e renomear, com nota datada no que
sair. Não é cosmético: foi essa colisão que fez a primeira varredura desta
sprint parecer dizer que o veredito já estava ligado.

---

## Como morde

Arranque a chamada da E1 e o teste da E2 reprova, porque o card perde a razão.
Sem o portão da E3, o módulo volta a poder existir sem chamador — que é o estado
em que ele nasceu, declarado pela própria frente que o escreveu.

## O que este achado ensina

**Uma sprint escrita às 20h38 pode estar defasada às 21h19.** A BARRA-MUDA-01
registrou "zero chamadores" com o comando ao lado, e estava certa no instante em
que foi escrita. Quem for agir sobre o que uma sprint declara aberto **roda o
comando de novo antes**.
