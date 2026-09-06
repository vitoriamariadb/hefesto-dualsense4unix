---
sprint: DECISOES-DELA-01
estado: absorvida
---

> **ESTADO 06/09/2026: absorvida** — índice ou folha de decisões, não é sprint
> executável; o que ela lista vive nas sprints filhas e no `SPRINT_ORDER.md`.

# Decisões dela — aba `01-jogar`

**04/09/2026.** Levantadas por um agente que leu as linhas abertas desta aba no
`docs/data/paridade-gtk-html.csv` e as transformou em escolhas.

**RESPONDIDAS — pelo PO em 04/09 ([O PO DECIDE AS 54](../2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md)) e por ela em 05/09 (a [ONDA CINCO](2026-09-05-ONDA-CINCO-INDICE.md)); este arquivo é o registro das opções.** Eram a fila da conversa seguinte, no formato que
ela pediu: *"um ponto por vez, o próximo depois do OK dela"*. As dezesseis que
ela JÁ respondeu estão em
[`2026-09-04-AS-DEZESSEIS-DECISOES-DELA`](../2026-09-04-AS-DEZESSEIS-DECISOES-DELA-e-as-sprints-que-nascem.md)
— confira lá antes de perguntar de novo.

**4 decisão(ões) · 1 de peso alto**

---

## [01] Duas frases da janela antiga não têm lugar aqui. Em que canal elas entram?

**Peso:** média · **Depende de:** Nenhum. As duas frases já são função pura do produto (`home_actions.texto_da_ponte` e `_MODE_DESCRIPTIONS['native']`), e a coluna Atenção já lê seis fontes desse mesmo formato.

A janela antiga escreve duas linhas fixas embaixo do seletor que a interface nova não tem em superfície nenhuma. A primeira é o aviso do Modo Nativo — "Alguns jogos derrubam o controle no meio da partida neste modo" (home_actions.py:169-199); medido agora, a palavra "derruba" não aparece uma única vez nas páginas publicadas, nem nos tooltips. A segunda é a linha "Ponte com o jogo" (home_actions.py:1121, cinco desfechos), que na sua máquina diria hoje "nenhuma — nenhum jogo está recebendo controle do Hefesto". As descrições dos modos já viraram tooltip, como você mandou em 30/08; o que ficou de fora foi justamente o AVISO e o ESTADO.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Na coluna Atenção, só má notícia** | As duas entram na coluna Atenção que já fica ao lado dos cartões: o aviso do Modo Nativo enquanto ele estiver valendo, e a ponte só nos dois desfechos ruins ("de pé, e vazia" e "nenhuma"). Somem sozinhas quando o estado melhora. | Zero linha nova. A coluna tem SEIS vagas de aviso hoje (01-jogar.html:2860-2894) e a conta ao lado já diz quantos são. Nada a redesenhar e nada a republicar. Preço: a boa notícia ("o jogo vê um DualSense") nunca aparece, e a frase da ponte precisa de uma versão sem a cor da janela antiga. |
| **Uma linha fixa embaixo de Modo** | Paridade com a janela antiga: a linha está sempre lá, boa notícia inclusive, e se lê sem passar o mouse. | Uma linha de ~28px, sempre. Pela conta da própria legenda desta aba, o miolo pede 502px e a janela oferece 542 — cabe, com 12px de sobra. Mexe no desenho: hoje o mockup e a página publicada são byte a byte idênticos, então exige gerar de novo e você aprovar. |
| **Tudo no ponteiro do mouse** | O aviso do Modo Nativo entra nos `title` que o rótulo "Desligado" e o chip "Modo Nativo" já têm (01-jogar.html:1546-1548 e 1602-1603). A ponte não entra em lugar nenhum. | Zero pixel, zero desenho novo, zero código de aviso. Preço: a frase que mais importa — "nenhum jogo está recebendo controle do Hefesto" — é exatamente a que ninguém vai caçar com o mouse, porque quem não sabe do problema não procura a explicação dele. |

**Minha recomendação:** Na coluna Atenção, só má notícia — a coluna já existe, já conta e foi feita para carregar exatamente este tipo de frase; nenhuma linha nova aparece na tela e o desenho aprovado não muda.

**Fecha as linhas:** *A descrição do modo escolhido* · *A linha 'Ponte com o jogo' — por onde o jogo está recebendo o controle*

---

## [02] O cartão chama de "Player 1" um controle que o jogo ainda não recebeu. Muda a palavra?

**Peso:** média

O cartão escreve "Player N" (a01_jogar.py:142), e o N sai do `player_slot` — a posição de sessão. A janela antiga escreve "Controle N" e só acrescenta "— P2" quando o daemon confirmou o jogador (home_actions.py:1571). A diferença não é o número: desde 15/08 os dois saem da mesma fila de chegada e batem quando existem. É a PALAVRA. Medido em 02/09 na sua mesa, o controle do cabo estava com `player` nulo — tinha reservado o lugar e o jogo ainda não o via — e o cartão dizia "Player 2" assim mesmo.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Fica "Player N"** | Nada muda. É a gramática que você fixou em 26/08 (marca • player • plástico • transporte) e é o que está no desenho aprovado. | Zero pixel, zero aprovação. Preço: com um controle esperando o co-op, o cartão diz "Player 2" enquanto o jogo tem um jogador só. |
| **"Controle N", e "— P2" quando confirmar** | Paridade com a janela antiga: o cartão sempre se identifica, e a palavra jogador só aparece quando é verdade. | Mesma linha, mesma largura, zero pixel a mais. Mas desfaz a sua gramática de 26/08 e muda o texto do mockup e da página — exige gerar de novo e você aprovar. |
| **"Player N", esmaecido enquanto espera** | A palavra e o desenho ficam como estão; o número perde a cor forte enquanto o daemon não confirmar o jogador, e o porquê fica no ponteiro do mouse. | Uma classe de CSS e um `title`. Zero linha, zero largura, nenhum texto novo na tela. Preço: a razão só se lê com o mouse em cima, e o mockup ganha um estado a mais para você aprovar. |

**Minha recomendação:** "Player N", esmaecido enquanto espera — guarda a sua palavra e o seu desenho, e fecha o único dano real, que é o cartão afirmar um jogador que o jogo ainda não tem.

**Fecha as linhas:** *O número do jogador no cartão*

---

## [03] A coluna Atenção já explica o cadeado. Só falta onde ligá-lo — e onde ele fica?

**Peso:** alta

A caixa "Não trocar de perfil sozinho ao abrir um jogo" é pedido nomeado seu, de 23/07, e saiu do desenho por escolha minha, declarada na legenda da própria página: "A caixa saiu — o perfil ativo já diz isso" (01-jogar.html:3080). O que mudou desde então: a coluna Atenção passou a ler as fontes do produto (a01_jogar.py:350), e duas delas são a frase do cadeado e a do detector cego (painel.py:650-651). Hoje a tela EXPLICA o cadeado e não oferece onde ligá-lo, em nenhuma das dez abas. O escritor já está pronto na ponte (ponte.py:88); falta só o desenho.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Volta para a Jogar, embaixo de Modo** | Causa e interruptor na mesma tela: a razão já aparece na coluna Atenção, a um palmo dali. | Uma linha de ~28px na aba mais cheia. Pela conta da legenda desta aba, o miolo pede 502px de 542 — cabe. Exige gerar o desenho de novo e você aprovar. |
| **Vai para a Perfis (aba 10)** | A troca automática é do perfil. A aba 10 já lê o estado do cadeado (a10_perfis.py:1112) e declara por escrito que não o desenha (a10_perfis.py:474). | Zero linha na Jogar; uma linha na Perfis, que é a aba com mais folga. Também exige gerar e aprovar. Preço: a frase que explica fica uma aba longe do interruptor que a resolve. |
| **Fica sem cadeado** | Como está hoje: a coluna avisa, e não há botão. | Zero. Preço: a coluna Atenção pode dizer "Cadeado ligado: o perfil não troca sozinho" sem que exista onde desligá-lo, e o seu pedido de 23/07 segue sem superfície na interface nova. |

**Minha recomendação:** Volta para a Jogar, embaixo de Modo — é a única opção em que a frase que explica e o botão que decide ficam na mesma tela, e a folga medida comporta a linha.

**Fecha as linhas:** *O cadeado 'Não trocar de perfil sozinho ao abrir um jogo'*

---

## [04] Com cinco controles na mesa, o cabeçalho conta cinco e a tela mostra quatro. O que ela diz?

**Peso:** baixa · **Depende de:** Só a opção 3: a página publicada é estática e hoje só a bancada remonta cartão — crescer a fileira é motor, não desenho.

A página tem quatro lugares fixos (`data-controle` de p1 a p4), escritos na geração. Um quinto controle vira `p5`, o pintor procura esse endereço, não acha, e o laço segue sem erro e sem contar nada (hefesto_vivo.py:586-618). Já o cabeçalho conta a mesa inteira (mesa_viva.py:357-372) e escreveria "5 controles" — a mesma tela afirmando dois números. Hoje é borda: o co-op trabalha com quatro jogadores. O caso irmão, um 8BitDo ou um Nintendo Pro na mesa, é linha à parte e nem chega a virar cartão.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Nada muda** | O quinto some calado, como hoje. | Zero. Preço: a tela se contradiz sozinha, e não há como saber que falta um. |
| **Uma frase na coluna Atenção** | Enquanto a mesa passar de quatro, aparece "Há 5 controles na mesa e esta tela mostra 4", e a frase some quando um sai. | Zero linha nova: a coluna já existe, já tem seis vagas e já conta. Uma fonte de aviso a mais, nenhum desenho a republicar. |
| **A fileira cresce** | A página deixa de ter quatro lugares fixos e monta um cartão por controle, como a janela antiga faz. | O mais caro dos três: no produto a página é estática — quem remonta cartão hoje é a bancada, não a interface. Motor novo, desenho novo e aprovação; e os quatro numa fileira só, que é o que deixa a mesa num relance, deixa de ser garantido. |

**Minha recomendação:** Uma frase na coluna Atenção — custa zero pixel, usa o canal que já existe e fecha a contradição entre o cabeçalho e os cartões, que é o dano de verdade.

**Fecha as linhas:** *Mesa com mais de quatro controles*

---

## Não são decisão dela

Linhas desta aba que o levantamento descartou, com a razão. Ficam registradas para ninguém as ressuscitar como pergunta.

- **A frase-causa do cadeado, e o detector cego** — O fato do CSV caiu — medido hoje na árvore. O CSV diz "nada na 01" e que só a bancada `jogar_vivo` pintaria essa linha; não é mais verdade: `a01_jogar._avisos` chama `painel.avisos_do_estado` (a01_jogar.py:350), e `autoswitch_lock_text` e `texto_do_cadeado_cego` são duas das seis fontes dessa lista (painel.py:650-651). A página publicada tem seis vagas de aviso e a conta ao lado (01-jogar.html:2860-2894). Ou seja, a frase "O Hefesto não está conseguindo ver qual programa está na frente…" APARECE na aba Jogar hoje. O que continua faltando é o interruptor do cadeado, e ele virou a decisão "A coluna Atenção já explica o cadeado" acima.
