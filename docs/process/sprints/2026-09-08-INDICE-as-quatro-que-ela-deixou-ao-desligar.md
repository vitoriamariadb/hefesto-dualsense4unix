---
sprint: INDICE-0908-NOITE
estado: aberta
---

# As que ela deixou ao desligar — e as que ela achou depois de ligar

> *"importante falar só monta as sprints pra isso. **Não quero agentes nem
> nada.** só que meça e arrume a casa incluindo o lance dos mic."*
>
> E, à noite, com o produto instalado: *"Lembrando que quero só que vc melhore
> as sprints e crie as faltantes"* — e *"a ideia é que tudo funcione em
> comunhão, mascaras, modos, tipo de conexão via cabo ou rádio. Estamos na
> etapa Final."* <!-- noqa-acento: citação literal dela -->

**Sem agentes.** É trabalho de quem conversa com ela, ponto a ponto.

## A ordem, e a razão de cada posição — 08/09/2026, 22h30

| # | sprint | por que aqui |
| --- | --- | --- |
| 0 | **[CABO-BT-PERFIL-CONTROLE-01](2026-09-08-CABO-BT-PERFIL-CONTROLE-01-a-regua-de-pronto-de-toda-feature-da-tela.md)** | **a régua dela:** toda feature da tela responde cabo · BT · no perfil · por controle. A tabela está lida do mapa e do esquema, as onze abertas ganharam o bloco, e as três decisões que sobram são dela (modo e navegação por controle; a máscara por controle dentro do perfil) |
| 1 | **[LANCADORES-ZERO-01](2026-09-08-LANCADORES-ZERO-01-a-aba-que-nao-identifica-nada-na-tela-dela.md)** | o print dela decidiu: o produto ACHA os seis e diz «NÃO SEI» porque não lê a biblioteca de nenhum além da Steam. A sprint virou o CENSO por lançador — onde cada biblioteca mora (Heroic: 35 jogos da Epic na máquina dela), como o ambiente entra no sandbox (`devices=all` nos cinco; o wrapper de hoje só fala `SteamAppId`), e o selo que responde uma pergunta só |
| 2 | **[JOGAR-02](2026-09-08-JOGAR-02-o-reconectar-responde-sem-a-lingua-de-dentro.md)** | a frase «Jogadores reconciliados…» cobre a identidade do P1 por seis segundos. Pedido dela com print; a cura é pequena e o mecanismo (piscada sem palavra) já existe |
| 3 | **[MIC-OS-QUATRO-01](2026-09-08-MIC-OS-QUATRO-01-os-quatro-microfones-funcionando.md)** | é o que ela pediu com todas as letras — **quatro microfones VIRTUAIS, um por controle, cabo e BT**. **Corrigida hoje:** o rádio ENTREGA voz com a ponte de pé (medido 07/09); às 23h a mesa dela tem 2 fontes USB, 0 BT, 0 virtual — o trabalho é o nó por controle com nome estável, a ponte subir por controle e a eleição valer para quatro |
| 3b | **[SOM-POR-CONTROLE-01](2026-09-08-SOM-POR-CONTROLE-01-o-mix-completo-ou-o-canal-de-sfx-caindo-em-cada-controle.md)** | o recado dela: *"os sons seja hdmi completo seja o canal do sfx caindo pra cada controle"* <!-- noqa-acento: citação literal dela -->. Medido às 23h: os nós por controle de duas sprints `feita` **não existem na mesa dela**; a fonte (mix/SFX) não tem campo; o BT espera o ensaio 13 |
| 3c | **[MASCARA-NO-PERFIL-01](2026-09-08-MASCARA-NO-PERFIL-01-a-mascara-por-controle-entra-no-perfil.md)** | decisão dela à noite: *"pode entrar sim"* — a máscara de cada controle passa a viver em `ControllerOverrides`, e trocar de perfil passa a trocar as quatro |
| 4 | **[VIBRA-MULT-01](2026-09-08-VIBRA-MULT-01-o-motor-multiplica-a-forca-por-controle.md)** | **corrigida hoje:** a conta existe e está no caminho do rumble do jogo (`_mults_por_motor`); o que nunca foi medido é a premissa física (o ensaio existe, o caderno não tem a linha) e o número da tela |
| 5 | **[COR-TROCA-01](2026-09-08-COR-TROCA-01-a-cor-repetida-troca-de-lugar-em-vez-de-recusar.md)** | decisão de produto dela. **Corrigida hoje:** o modelo é o gesto `player` da aba 04, não `identity.py`; e a troca tem de escrever na camada em que a cor mora (o override por MAC vence a automática — foi assim que P1 e P2 colidiram) |
| 6 | **[ROLAGEM-01](2026-09-08-ROLAGEM-01-a-barra-vertical-na-gatilhos-e-na-lancadores-e-os-blocos-que-dobram.md)** | a barra vertical na 03 e na 07 — a causa NÃO está no HTML publicado (medido nas três larguras); a sonda roda no WebKit com os quatro vivos. E a proposta dela dos blocos que dobram: **sim**, com três condições |
| 7 | **[SENSORES-NO-JOGO-01](2026-09-08-SENSORES-NO-JOGO-01-o-giroscopio-e-o-acelerometro-provados-ate-o-jogo.md)** · bancada dela | *"tenho dúvidas se giroscópio e acelerômetro funcionam de fato"* — e a dúvida está certa: medidos até o vpad, **nunca no jogo** (zero células `O JOGO RECEBEU` no mapa inteiro), e o SDL abriu o vpad por evdev em 04/09 |
| 8 | **[TELA-TRES-01](2026-09-08-TELA-TRES-01-a-altura-o-selo-e-a-caixa-alta.md)** | duas de três continuam (a altura do «Detalhes técnicos», `CABO`/`RÁDIO` em caixa alta); a do meio foi absorvida pela 1 |
| 9 | **[LANCADOR-ACHADO-01](2026-09-08-LANCADOR-ACHADO-01-o-produto-so-acha-o-que-a-lista-adivinhou.md)** | a busca por conteúdo; o degrau 1 (registrar à mão) entrou em 08/09 |
| 10 | **[NADA-MOCKADO-01](2026-09-08-NADA-MOCKADO-01-a-varredura-do-que-e-de-verdade.md)** | é um PORTÃO. **Ganhou hoje** a tabela máscara × modo × transporte e a medição de que **o mapa não é lido pelo produto** — só por réguas e scripts |
| 11 | **[TUDO-FUNCIONA-01](2026-09-08-TUDO-FUNCIONA-01-o-que-falta-para-nada-ser-de-brinquedo.md)** | o inventário honesto, com o custo de cada falta — e decide o destino de `pacotes/mapa.py` e `fatos_do_mapa.py`, que ninguém chama |

**Bancada — a hora dela, não de código:**
[MESA-DE-QUATRO-01](2026-09-06-MESA-DE-QUATRO-01-quatro-dualsense-por-cabo-e-por-radio-com-ela.md)
(o §1 está pago; o roteiro das 21 linhas espera),
[LUZ-NO-RADIO-01](2026-09-01-LUZ-NO-RADIO-01-a-prova-que-falta-e-de-aparelho.md)
(a premissa «um controle, no cabo» caducou — há dois no rádio) e
[A-BANCADA-QUE-O-RADIO-PEDE-INDICE](2026-08-31-A-BANCADA-QUE-O-RADIO-PEDE-INDICE.md)
(o ensaio 1 andou: seis passadas em silêncio, ainda sem linha no caderno).

**FEITAS em 08/09/2026**, com a prova na nota do topo de cada uma:
[JANELA-01](2026-09-08-JANELA-01-o-fundo-preto-e-o-titulo-que-fala-a-lingua-de-dentro.md) ·
[FITA-01](2026-09-08-FITA-01-o-chip-do-P1-fica-aceso-onde-a-fita-nao-escolhe.md) ·
[JOGAR-01](2026-09-08-JOGAR-01-o-cadeado-do-perfil-vai-para-o-canto-do-bloco.md) ·
[LANCADORES-DELA-01](2026-09-08-LANCADORES-DELA-01-o-selo-o-botao-a-epic-e-o-que-o-hefesto-nao-conhece.md)
(a Epic fica dentro do Heroic — palavra dela, à noite: *"dentro heróic"*).

## A comunhão que ela pediu, em uma linha

**A régua é a sprint 0.** Cada feature da tela com quatro respostas — cabo · BT ·
no perfil · por controle — lidas do mapa e do esquema. As seis famílias que
ela nomeou (gatilho, luz, vibração, som, mic, sensores) **já são por controle no
esquema**; o que falta é transporte (som e mic por BT, sensores até o jogo),
campo que não existe (o fone) ou morava fora (a máscara por controle — ela
decidiu: entra), e duas decisões dela que sobram: modo e navegação por controle.

Máscara, modo e transporte não são três listas: são uma tabela, e ela está na
[NADA-MOCKADO-01](2026-09-08-NADA-MOCKADO-01-a-varredura-do-que-e-de-verdade.md).
O que ela diz, em resumo: **o transporte está inocentado** onde foi medido
(giroscópio, cor); **a máscara decide** o que chega ao jogo (giroscópio e
touchpad só na DualSense/`uhid`; Xbox e Nintendo não têm onde pôr); e **o
modo** decide se o daemon está no caminho (em Nativo não está). O que sobra
sem medição é o último degrau — vpad → jogo — e é a sprint 7.

## E ela cobrou a frase, com razão

> *"mas aí me quebra. pq o programa de dias a fio é de brinquedo? uma prova de
> conceito? por favor. ele tem que funcionar em tudo."*

**A frase estava imprecisa, e a imprecisão é minha.** Dizer *"os quatro
microfones continuam sem funcionar"* somava duas faltas de HORAS (o cabo, onde
as fontes já existem) com duas de TRANSPORTE — e a de transporte também estava
mal contada: o rádio entrega voz com a ponte de pé, medido em 07/09. O produto
não é prova de conceito: os quatro controles, as quatro cores, os sensores nos
quatro (até o daemon), os gatilhos, os perfis, os seis lançadores e o wrapper
em 63 jogos foram medidos em 08/09, no aparelho dela.
A `TUDO-FUNCIONA-01` tem a lista inteira, com a prova de cada linha e o custo de
cada falta — e vira PORTÃO, para essa conta nunca mais ser feita de cabeça.

## A resposta que ela precisa ler primeiro

Ela perguntou: *"sobre o microfone a ideia é termos os 4 funcionando. A cura que
vc está trazendo faz isso?"*

**NÃO.** A cura de 08/09 conserta o INSTRUMENTO: o daemon leva 3.070 ms, a ponte
esperava 250 ms, e a razão verdadeira era descartada — a tela mostrava três
causas e nenhuma era a certa. Os quatro microfones continuam sem funcionar
JUNTOS, e o que falta está medido na sprint 3.

## O que ficou de pé nesta sessão, para não se perder

O produto foi **instalado** (`rc=0`, doctor sem falha, daemon reiniciado às
21h38), com 16 commits, 51 portões verdes, a suíte de **98 vermelhos para 8**, e
a **conferência dela em 7 ✓ / 0 falta**. O registro inteiro está em
[A SESSÃO INTEIRA](../2026-09-08-A-SESSAO-INTEIRA-o-que-mudou-e-como-fazer-o-merge.md).

**Um vermelho que não é da árvore (08/09, 22h40):** o portão `janela-nao-confessa`
acusa `reb/packaging/hefesto-dualsense4unix.desktop:38` — `reb/` é uma cópia
velha FORA do git (`.git/info/exclude:22`), e o portão varre o DISCO em vez da
árvore. Apagar a pasta é decisão dela; a régua ler só o que o git rastreia é
conserto de instrumento, e cabe na `NADA-MOCKADO-01`.

## Uma coisa que eu fiz e ela precisa saber

Para diagnosticar a faixa laranja eu mandei um comando de MUDO no microfone do
P1 dela, em vez de só perguntar ao daemon. Ele ficou mudo e eu devolvi
(`mic_mudo=False`, conferido). O P4 seguia mudo pelo botão FÍSICO dele — esse
não fui eu. **A regra que fica: no aparelho dela, só leitura.** À noite, para
estas sprints, a regra valeu: o que se leu foi o `/proc` do processo dela e as
páginas publicadas num Chrome sem janela — nada foi escrito no daemon nem no
controle.
