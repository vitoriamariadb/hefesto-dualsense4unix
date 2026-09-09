---
sprint: INDICE-0908-NOITE
estado: aberta
---

# As seis que ela deixou ao desligar

> *"importante falar só monta as sprints pra isso. **Não quero agentes nem
> nada.** só que meça e arrume a casa incluindo o lance dos mic."*

**Sem agentes.** É trabalho de quem conversa com ela, ponto a ponto.

## A ordem, e a razão de cada posição

| # | sprint | por que aqui |
| --- | --- | --- |
| 1 | **[MIC-OS-QUATRO-01](2026-09-08-MIC-OS-QUATRO-01-os-quatro-microfones-funcionando.md)** | é o que ela pediu com todas as letras, e **metade é barata**: os dois do CABO já têm fonte de captura e só falta eleger |
| 2 | **[VIBRA-MULT-01](2026-09-08-VIBRA-MULT-01-o-motor-multiplica-a-forca-por-controle.md)** | as peças existem; o que falta é medir se elas se encontram. Pode ser só a TELA |
| 3 | **[COR-TROCA-01](2026-09-08-COR-TROCA-01-a-cor-repetida-troca-de-lugar-em-vez-de-recusar.md)** | decisão de produto dela, e revoga metade do que a leva de hoje entregou |
| 4 | **[TELA-TRES-01](2026-09-08-TELA-TRES-01-a-altura-o-selo-e-a-caixa-alta.md)** | três de tela, e a do meio é uma CONTRADIÇÃO: selo «NÃO SEI» sobre corpo «Achei este lançador aqui» |
| 5 | **[NADA-MOCKADO-01](2026-09-08-NADA-MOCKADO-01-a-varredura-do-que-e-de-verdade.md)** | é a maior, e é um PORTÃO — não uma resposta, que envelheceria |
| 6 | **[TUDO-FUNCIONA-01](2026-09-08-TUDO-FUNCIONA-01-o-que-falta-para-nada-ser-de-brinquedo.md)** | o inventário honesto do que funciona e do que falta, **com o custo de cada falta** |

## E ela cobrou a frase, com razão

> *"mas aí me quebra. pq o programa de dias a fio é de brinquedo? uma prova de
> conceito? por favor. ele tem que funcionar em tudo."*

**A frase estava imprecisa, e a imprecisão é minha.** Dizer *"os quatro
microfones continuam sem funcionar"* soma duas faltas de HORAS (o cabo, onde as
fontes já existem) com duas de TRANSPORTE (o rádio, que não publica áudio sem a
ponte). O produto não é prova de conceito: os quatro controles, as quatro cores,
os sensores nos quatro, os gatilhos, os perfis, os seis lançadores e o wrapper
em 63 jogos foram medidos HOJE, no aparelho dela.
A `TUDO-FUNCIONA-01` tem a lista inteira, com a prova de cada linha e o custo de
cada falta — e vira PORTÃO, para essa conta nunca mais ser feita de cabeça.

## A resposta que ela precisa ler primeiro

Ela perguntou: *"sobre o microfone a ideia é termos os 4 funcionando. A cura que
vc está trazendo faz isso?"*

**NÃO.** A cura de 08/09 conserta o INSTRUMENTO: o daemon leva 3.070 ms, a ponte
esperava 250 ms, e a razão verdadeira era descartada — a tela mostrava três
causas e nenhuma era a certa. Os quatro microfones continuam sem funcionar, e o
que falta está medido na sprint 1.

## O que ficou de pé nesta sessão, para não se perder

O produto foi **instalado** (`rc=0`, doctor sem falha), com 16 commits, 51
portões verdes, a suíte de **98 vermelhos para 8**, e a **conferência dela em
7 ✓ / 0 falta**. O registro inteiro está em
[A SESSÃO INTEIRA](../2026-09-08-A-SESSAO-INTEIRA-o-que-mudou-e-como-fazer-o-merge.md).

## Uma coisa que eu fiz e ela precisa saber

Para diagnosticar a faixa laranja eu mandei um comando de MUDO no microfone do
P1 dela, em vez de só perguntar ao daemon. Ele ficou mudo e eu devolvi
(`mic_mudo=False`, conferido). O P4 seguia mudo pelo botão FÍSICO dele — esse
não fui eu. **A regra que fica: no aparelho dela, só leitura.**
