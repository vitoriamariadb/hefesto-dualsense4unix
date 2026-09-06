---
sprint: DECISOES-DELA-04
estado: absorvida
---

> **ESTADO 06/09/2026: absorvida** — índice ou folha de decisões, não é sprint
> executável; o que ela lista vive nas sprints filhas e no `SPRINT_ORDER.md`.

# Decisões dela — aba `04-iluminacao`

**04/09/2026.** Levantadas por um agente que leu as linhas abertas desta aba no
`docs/data/paridade-gtk-html.csv` e as transformou em escolhas.

**RESPONDIDAS — pelo PO em 04/09 ([O PO DECIDE AS 54](../2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md)) e por ela em 05/09 (a [ONDA CINCO](2026-09-05-ONDA-CINCO-INDICE.md)); este arquivo é o registro das opções.** Eram a fila da conversa seguinte, no formato que
ela pediu: *"um ponto por vez, o próximo depois do OK dela"*. As dezesseis que
ela JÁ respondeu estão em
[`2026-09-04-AS-DEZESSEIS-DECISOES-DELA`](../2026-09-04-AS-DEZESSEIS-DECISOES-DELA-e-as-sprints-que-nascem.md)
— confira lá antes de perguntar de novo.

**4 decisão(ões) · 2 de peso alto**

---

## [01] Quando a luz não é nossa, a tela diz por quê — ou só passando o rato?

**Peso:** alta

A tira da luz já tem os três desenhos que você decidiu em 03/09: cheia de cor quando está acesa, lisa e vazia quando você desligou, tracejada quando o produto não sabe. O que o tracejado não diz é QUAL das três causas — o jogo é dono do LED em Modo Nativo, a Steam está com este controle aberto, ou a cor é desconhecida (as três frases saem do mesmo motor da janela antiga, `controller_card.rotulo_lightbar`). Na janela antiga elas aparecem num rótulo fixo, sempre visível; aqui viajam só no `title` das tiras — some se você não passar o rato. E aqui pesa mais: a janela antiga continua pintando a cor mesmo nesses estados, e esta APAGA, que é a sua regra ("se não tá mostrando agora, não tem info pra mostrar"). O desenho apaga e a explicação exige um gesto.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Fica só no passar do rato** | Nada muda. A tira tracejada avisa que algo está diferente, e a razão espera o rato passar por cima dela. | Zero linha, zero mockup a publicar — já é o que está na tela hoje (medi: `data-campo="luz" data-hef-alvo="html"` está publicado, então o hover já funciona). O preço é que a razão de a barra ter apagado só existe para quem passa o rato. |
| **Uma linha só quando há ressalva** | Debaixo da tira aparece a frase curta do motor — "A Steam tem este controle aberto". Quando está tudo bem, a linha não existe: campo sem informação não mostra nada, como você já mandou. | Uma linha nova na tira, que nasce nas quatro colunas de uma vez, mas fica VAZIA na coluna que está bem. Precisa desenhar no mockup e publicar. Texto de tela só nos dias em que há algo a dizer. |
| **Uma marca de uma palavra ao lado da tira** | A tira ganha um selo curto — Nativo, Steam, ou um interrogação para "cor desconhecida". O texto inteiro continua no rato. | Não abre linha: o selo cabe na altura que a tira já ocupa. Mas cria um vocabulário novo de três palavras que só você escreve, e o interrogação não se explica sozinho. |

**Minha recomendação:** Uma linha só quando há ressalva — o tracejado avisa que algo mudou e a linha responde a pergunta seguinte sem exigir gesto; e nos dias normais ela não ocupa nada, que é exatamente a sua regra.

**Fecha as linhas:** *Ressalva do estado da barra (Nativo / Steam / fonte desconhecida / apagada)* · *Prévia da cor com o brilho aplicado*

---

## [02] O "Automático" do botão e o automático do perfil não são a mesma coisa

**Peso:** alta

O botão "Automático" da célula Opções larga a barra para o jogo escolher e pinta a cor do número — decisão sua de 01/09. Ele é por controle e é um toque só. O "Cores automáticas por controle" é outra coisa: um interruptor do PERFIL que governa a paleta E a numeração automática, e uma medição anterior achou-o LIGADO no seu perfil. Pelo HTML você não vê esse estado nem pode mudá-lo — a palavra "Automático" está na tela sem que o estado do automático esteja (medi hoje: em toda a interface nova ele aparece uma vez só, no rodapé, e o valor é descartado antes de chegar ao disco). O medo antigo caiu: o Salvar NÃO congela a paleta em override nenhum.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Fica fora desta aba** | Nada muda aqui. O interruptor do perfil continua sem lugar na interface nova, e o botão segue com o nome que tem. | Zero linha, zero mockup. O preço é a palavra dividida: dois "automáticos" diferentes na sua cabeça, um visível e um invisível. |
| **O botão mostra o estado** | O "Automático" fica aceso quando o automático do perfil está ligado, e apagado quando não está. Clicar continua fazendo o que faz hoje. | Nenhuma linha, nenhum botão novo — só um estado a mais no botão que já existe (o pacote da aba já lê o perfil do disco, o mesmo caminho do brilho). Precisa de mockup publicado, e o botão passa a dizer duas coisas: o que ele faz, e como o perfil está. |
| **Um interruptor de verdade na aba** | Uma chave "Cores automáticas por controle" que você liga e desliga aqui mesmo, gravando no perfil na hora — o mesmo caminho que o trilho de brilho usa. | Uma linha nova na tira (nas quatro colunas) ou uma linha no rodapé da aba. É a única opção que deixa você MUDAR o estado sem ir à aba Perfis. |
| **Trocar o nome do botão** | O botão passa a se chamar pelo que ele faz — "Devolver ao jogo", por exemplo — e a palavra "Automático" fica livre para o interruptor do perfil. | Zero linha; é uma palavra, e ela é sua. Precisa de mockup publicado, e muda um rótulo que você já leu muitas vezes. |

**Minha recomendação:** O botão mostra o estado — é a única que fecha o buraco de VER sem gastar linha nenhuma; mudar o estado continua na aba Perfis, onde o interruptor de fato mora.

**Fecha as linhas:** *Checkbox 'Cores automáticas por controle' (auto_player_colors)* · *Prévia honesta quando o automático está ligado* · *Regra D4 — cor única em 'Todos' desliga o automático e AVISA*

---

## [03] Uma cor de fora da guia não tem como ser reenviada

**Peso:** média

A aba manda a cor ao aparelho no instante do clique — não há rascunho nem "Aplicar", como você decidiu em 01/09. Clicar de novo num dos oito tons reenvia, porque um botão sempre dispara. O seletor livre não: ele só avisa quando o valor MUDA, então reabrir e confirmar a mesma cor não manda nada ao controle. Quando um controle cai e volta, ou quando você quer conferir se a cor chegou mesmo, a cor que você escolheu à mão é justamente a que não tem porta de volta. A janela antiga tem um botão dedicado para isso.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Fica como está** | Reenviar é escolher de novo. Para uma cor de fora da guia, é preciso mexer um tico no seletor e voltar ao valor de antes. | Zero linha, zero mockup. O preço é que a única cor sem reenvio é a que você escolheu à mão, e o caminho para reenviá-la é um truque. |
| **A caixa do hexadecimal vira o botão** | O `#0000FF` que já mostra a cor escolhida passa a ser clicável e reenvia essa cor ao controle. | Nenhum elemento novo, nenhuma linha. Mas uma caixa que hoje se lê como texto passa a ser clicável — precisa de um sinal (cursor, borda no rato) e de mockup publicado. |
| **Um terceiro botão em Opções** | A célula Opções ganha "Aplicar no controle", ao lado de Automático e Desligar — a porta da janela antiga, com o nome dela. | Não abre linha nova, mas a célula passa de dois para três botões nas quatro colunas: a fileira aperta, e aperto é coisa de que você já reclamou noutras abas. Precisa de mockup publicado. |

**Minha recomendação:** A caixa do hexadecimal vira o botão — o reenvio fica exatamente onde a cor de agora está escrita, e não custa nem linha nem botão numa fileira que já está apertada.

**Fecha as linhas:** *Botão de reenvio explícito da cor ('Aplicar no controle')*

---

## [04] Quando você mexe no brilho e a barra não pode acender

**Peso:** média · **Depende de:** Publicar a 04 com o trilho de brilho. O arrastador está no mockup e não na página publicada, e a divergência está declarada em `mockup/DIVERGENCIAS.md` esperando o seu OK. Até lá nenhum clique fica morto: o trilho publicado é só leitura, e não há polegar a arrastar.

Esta não estava no levantamento — medi hoje. O trilho de brilho já grava na hora, como você mandou em 03/09, mas ele está no desenho da bancada e ainda não no produto: o arrastador existe no mockup e não na página publicada. Quando ele entrar, há um caso em que o número é guardado e a barra NÃO muda — os mesmos estados em que a luz não é nossa (Nativo, a Steam com o controle aberto, cor desconhecida): não há cor a reescalar, e mandar preto apagaria a barra por um arraste de brilho. O produto responde com um cartão sobre a coluna. Essa frase é palavra de tela, e palavra de tela é sua.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **A frase inteira, como está** | "Guardei o brilho em 60% no perfil deste controle. A barra não mudou agora porque não há cor a reacender: A Steam tem este controle aberto." | Duas a três linhas de cartão sobre a coluna, e ele some sozinho. Diz tudo — e repete com palavras o que a tira tracejada já diz com desenho. |
| **Uma frase curta** | "Guardei 60%. A barra não mudou agora — a Steam está com este controle." | Uma linha de cartão. Perde a explicação do "porque não há cor a reacender", que a tira tracejada já conta pelo desenho. |
| **Silêncio: o número muda e pronto** | O trilho anda, o `%` muda no perfil, e nada é dito na tela. | Zero linha. E é a família de defeito que esta casa nomeia como a mais cara: o gesto aceita o toque, faz metade do trabalho, e não diz uma palavra. |

**Minha recomendação:** Uma frase curta — o silêncio está fora de questão, e a versão longa gasta três linhas repetindo o que a tira tracejada já mostra sem palavra nenhuma.

---

## Não são decisão dela

Linhas desta aba que o levantamento descartou, com a razão. Ficam registradas para ninguém as ressuscitar como pergunta.

- **Escolher uma cor livre (paleta do sistema)** — FECHOU, e o levantamento está velho. Medi na página publicada de hoje: as duas linhas do seletor livre trazem `data-gesto="cor"` (linhas 2052 e 2405) — o levantamento dizia que o publicado não tinha o atributo. Fechou nas publicações de 03/09 (`3f9160f4`, `aedf33b4`, `36b5722d`). Escolher uma cor fora da guia alcança o aparelho hoje.
- **Marca de qual cor está escolhida agora** — FECHOU, e o levantamento está velho. `grep -c 'data-campo="hex"'` dá 18 no publicado E 18 no mockup — o levantamento afirmava 2 no publicado. Os 16 botões de tom (8 por coluna) trazem `data-hef-alvo="classe" data-hef-quando="#RRGGBB"`, que é o que acende a marca na cor certa. A marca não está mais congelada.
- **Prévia honesta quando o automático está ligado** — É a mesma pergunta da decisão do automático — fundida nela. E metade já está na tela: o `title` de cada um dos oito tons diz "Cor automática do Player N — usar aqui pinta a barra deste controle, e não muda o número dele". O que sobra é saber se a cor de AGORA veio da paleta ou de você, e isso é o estado do automático.
- **Regra D4 — cor única em 'Todos' desliga o automático e AVISA** — O fato que a sustentava caiu em 04/09 e há régua trancando (`tests/unit/test_o_salvar_nao_congela_a_paleta_automatica.py`): o Salvar da interface nova não escreve `auto_player_colors=False` em override nenhum. E não existe escopo 'Todos' aqui — todo gesto desta aba exige saber em qual controle você clicou e recusa sem isso, de propósito. O que sobrava da linha é a decisão do automático.
- **Aviso 'o mesmo desenho foi para os N controles'** — Não é desenho seu hoje: é dívida condicional. Ela depende de duas coisas que não existem na interface nova — a escrita das cinco lâmpadas do jogador e o escopo 'Todos'. Sem elas nunca há um desenho indo para N controles, e não há o que avisar. Vira decisão sua no dia em que a escrita de player-LED chegar; até lá é motor.
