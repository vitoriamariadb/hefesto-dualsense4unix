---
sprint: TUDO-FUNCIONA-01
estado: aberta
posse:
  TUDO-FUNCIONA-01:
    - docs/data/mapa-controles.csv
    - scripts
bancada: false
depois_de: [NADA-MOCKADO-01]
---

# O inventário honesto: o que funciona, o que não, e por quê

## A cobrança dela, e ela é justa

> *"mas aí me quebra. pq o programa de dias a fio é de brinquedo? uma prova de
> conceito? por favor. ele tem que funcionar em tudo. tudo realmente. é essa a
> ideia."*

E ela está certa. **A resposta que eu dei foi imprecisa** — eu disse *"os quatro
microfones continuam sem funcionar"* como se as quatro faltas fossem iguais, e
elas não são: duas são conserto de horas e duas são o trabalho grande. Uma frase
que soma coisas de custos diferentes faz o produto inteiro parecer inacabado.

**Esta sprint existe para que essa frase nunca mais precise ser dita de cabeça.**

## O que FUNCIONA, medido no aparelho dela em 08/09/2026

Nenhum destes é sandbox, dublê ou mockup — cada um foi lido do daemon vivo ou
visto na tela dela, com os quatro DualSense na mesa:

| | prova |
| --- | --- |
| quatro controles, 2 cabo + 2 rádio | `state_full`, e a fita da tela |
| quatro cores distintas | `#0000FF #FF0000 #00FF00 #FF0080` no `lightbar_rgb` |
| giroscópio e acelerômetro nos QUATRO | `sensores` presente nos quatro, **inclusive nos não-primários** — que estavam mudos até 04/09 |
| gatilhos adaptativos | 19 modos, a aba escreve e o aparelho recebe |
| LEDs de jogador, brilho, barra de luz | a tela pinta e o plástico acende |
| bateria por controle | 100% · 95% · 85% no print dela |
| perfis, importar, exportar | e o ciclo do Salvar, curado em 05/09 |
| seis lançadores achados | Steam, Heroic, Lutris, Flatpak, RetroArch, Dolphin·mGBA |
| o wrapper da Steam | em **63 jogos** da biblioteca dela |
| alto-falante do controle | «Sons do jogo» sai pelo plástico |
| máscara Nintendo Pro | `0x057E:0x2009` no `FLAVORS` |

## O que NÃO funciona, e o custo de cada um

| o quê | por quê | custo |
| --- | --- | --- |
| **mic no CABO, os dois ao mesmo tempo** | as duas fontes de captura EXISTEM (`pactl` confirma); só uma está eleita | **horas** — é eleição, não hardware |
| **mic no RÁDIO** | o DualSense no rádio **não publica fonte de áudio nenhuma** sem a `PonteMicBluetooth` de pé. Não é escolha nossa: é o transporte | **grande**, e é a `MIC-OS-QUATRO-01` |
| **♪ pelo alto-falante no RÁDIO** | seis passadas, silêncio nas seis. A hipótese que sobra é o enquadramento HIDP/L2CAP | **grande**, e quem decide é a orelha dela |
| **vibração: motor × força** | as peças existem, falta medir se se encontram | **ver `VIBRA-MULT-01`** |

## O que fazer — e o entregável é um PORTÃO, não uma resposta

Uma resposta envelhece no dia seguinte; um portão não. Ele responde, a cada
corrida, *"o que esta casa promete e ainda não faz?"* — a mesma forma do
`casa-sabe`.

1. **A coluna que falta no mapa é "chega ao JOGO"**, e ela é diferente de "chega
   ao aparelho". O que o jogo lê é o nó `vpad` (uinput/uhid), não o DualSense.
   Uma feature que o daemon publica e o SDL não expõe **não está entregue**.
2. O mapa já tem `provado_por` com **77 linhas respondidas** e `aparelho` em 44.
   Comece dali, não do zero.
3. O portão cobra: toda feature com selo forte na tela tem prova de APARELHO ou
   ressalva declarada.

## A regra que esta sprint deixa

> **Nunca some faltas de custos diferentes numa frase só.** Duas horas de
> trabalho e um bloqueio de transporte não são "não funciona" — e dizer que são
> faz dias de trabalho parecerem uma prova de conceito.
