---
sprint: DECISOES-DELA-09
estado: absorvida
---

> **ESTADO 06/09/2026: absorvida** — índice ou folha de decisões, não é sprint
> executável; o que ela lista vive nas sprints filhas e no `SPRINT_ORDER.md`.

# Decisões dela — aba `09-sistema`

**04/09/2026.** Levantadas por um agente que leu as linhas abertas desta aba no
`docs/data/paridade-gtk-html.csv` e as transformou em escolhas.

**RESPONDIDAS — pelo PO em 04/09 ([O PO DECIDE AS 54](../2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md)) e por ela em 05/09 (a [ONDA CINCO](2026-09-05-ONDA-CINCO-INDICE.md)); este arquivo é o registro das opções.** Eram a fila da conversa seguinte, no formato que
ela pediu: *"um ponto por vez, o próximo depois do OK dela"*. As dezesseis que
ela JÁ respondeu estão em
[`2026-09-04-AS-DEZESSEIS-DECISOES-DELA`](../2026-09-04-AS-DEZESSEIS-DECISOES-DELA-e-as-sprints-que-nascem.md)
— confira lá antes de perguntar de novo.

**3 decisão(ões) · 2 de peso alto**

---

## [01] "Atualizar" faz dois trabalhos com um nome só — qual deles ele fica sendo?

**Peso:** alta

A dica do botão diz "Relê tudo o que esta aba mostra. Não muda nada." e a segunda frase é falsa: além de reler, ele manda o Hefesto reaplicar a configuração e reescrever os arquivos de ambiente que a Steam usa para lançar jogo (`ipc_handlers.py:4823-4832`). Os dois trabalhos custam coisas muito diferentes — a releitura são 4 milissegundos (as cinco leituras caras somam 4,03 ms, medidas nesta máquina em 02/09) e a outra metade são 9,5 segundos, medidos no daemon dela em 01/09. E a releitura JÁ ACONTECE SOZINHA a cada 2 segundos, sem ninguém clicar (`LENTO_S = 2.0`), então o botão só existe por causa da metade que a frase nega. Conforme a resposta muda a dica, o nome do botão, ou o número de botões no cartão de cima.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **A frase passa a dizer os dois** | O botão continua chamando-se "Atualizar" e fazendo as duas coisas; só a dica de hover é reescrita para dizer que ele relê a aba E manda o Hefesto reaplicar a configuração. | Uma linha no gerador (`aba09.py:901`), zero linha de tela, mockup republicado. Fica o nome "Atualizar" prometendo leitura barata sobre uma espera de nove segundos e meio. |
| **O nome vira o trabalho** | O rótulo passa de "Atualizar" para "Reaplicar ajustes" e a dica diz o que ele reaplica. O nome deixa de nomear a metade que a aba já faz sozinha. | Um rótulo trocado dentro de um botão que já existe — 17 letras contra as 19 de "Reiniciar o serviço", cabe folgado nos 184px fixos da coluna. Zero linha nova de tela, mockup republicado. |
| **Dois botões separados** | "Atualizar" volta a ser só releitura (instantânea) e nasce ao lado "Reaplicar ajustes", que é o que espera os 9,5 s. | Um quinto botão na coluna de ação do cartão de cima. Medido: a coluna sai de 154px (4 botões de 34px + 3 vãos de 6px) para 194px, e passa a ultrapassar a coluna de estado, que tem 150px, em 44px — o cartão inteiro cresce. Mockup republicado. |
| **Volta a ser só releitura** | A metade cara morre: o botão passa a fazer o mesmo que o botão de mesmo nome da janela antiga, que não toca no daemon. A dica de hoje passa a ser verdadeira sem trocar uma letra. | Zero mudança na tela e zero mockup. Mas sobra um botão para o que a aba já faz sozinha a cada 2 s, e a interface fica sem nenhum lugar que mande o Hefesto reescrever os arquivos de lançamento da Steam depois de você mexer num perfil. |

**Minha recomendação:** O nome vira o trabalho — a metade que a dica promete já acontece sozinha a cada 2 segundos, então nomear o botão pela metade que só ele faz é a única forma que para de mentir sem gastar linha de tela.

**Fecha as linhas:** *Botão "Atualizar"*

---

## [02] Botão sem trabalho a fazer: apaga, ou deixa clicar e diz por quê?

**Peso:** alta

A janela antiga apaga o botão que não tem o que fazer, e a razão está escrita nela: o clique inútil dispara o `systemctl` de verdade, volta sucesso, e a tela confirma um trabalho que não houve. Esta tela faz a mesma conta, com o motivo já em português (`gui/aba_sistema.py:581`), mas em vez de apagar deixa clicar e RECUSA dizendo — um recado laranja fixo no rodapé da janela, que vive 30 segundos (`SEGUNDOS_DO_RECADO = 30.0`). O que falta é a metade do desenho: a folha desta página tem cara de apagado para os botões do seletor (`.seg button:disabled`, linha 334) e NADA para estes, então não há estado desligado a acender. Alcança três botões — "Retomar" (que fica sem trabalho sempre que o serviço não está pausado, ou seja, o dia inteiro no normal), "Reiniciar o serviço" e "Ver os plugins carregados".

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Fica como está: clica e recusa** | Os três botões continuam com cara de clicáveis o tempo todo; quem clicar sem trabalho a fazer recebe a frase do produto num recado laranja no rodapé. | Zero linha de tela e zero mockup. O preço é que o recado cobre a barra do rodapé (Aplicar/Salvar/Exportar) por 30 segundos a cada clique inútil, e o motivo só aparece DEPOIS do clique que não servia para nada. |
| **Apaga o botão, como na janela antiga** | O botão nasce desligado de verdade quando não há trabalho: borda apagada, texto mudo, seta de proibido. Clique nenhum sai dele. | Duas linhas de folha, copiadas da regra que os botões do seletor já têm desde 31/08 — zero linha de tela, mockup republicado. O preço: "Retomar" fica apagado quase todo dia, e o motivo passa a viver SÓ no hover, porque um botão desligado de verdade não dispara clique nem recado. |
| **Apagado e ainda assim responde** | Ele ganha a mesma cara de desligado, mas continua aceitando o clique — e quem clicar recebe a frase do produto, como hoje. | As mesmas duas linhas de folha mais o estado escrito a cada tique pelo piloto; zero linha de tela, mockup republicado. É a única forma que responde "por que este está apagado?" sem exigir o rato. |

**Minha recomendação:** Apagado e ainda assim responde — é o único que diz o porquê sem hover, e devolve a cara de desligado que a própria página já escolheu em 31/08, quando o achado foi exatamente este: "o travado tinha cara de clicável".

**Fecha as linhas:** *Botão cinza por estado (o que não tem trabalho a fazer)*

---

## [03] Nove segundos e meio calado — a tela diz que ele está trabalhando?

**Peso:** média · **Depende de:** A decisão do "Atualizar" acima: se ele virar só releitura, a espera cai de 9,5 s para 4 ms e esta pergunta morre sozinha.

Da cadeira dela, clicar "Atualizar" hoje é nove segundos e meio de nada, e no fim mais nada. A janela não congela — o gesto corre em thread justamente por causa desses 9,5 s —, mas nenhuma letra na tela diz que há trabalho em curso: procurei e não existe estado "em voo" em lugar nenhum do piloto. E quando volta, o estado publicado é IDÊNTICO, o que está certo (nada no disco mudou) e está declarado em `SEM_ECO`. O único canal de recado que esta página já tem é a mesma tarja laranja do rodapé que a recusa usa.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Continua calado** | Nada muda: o clique some por nove segundos e meio e a tela fica exatamente igual antes e depois. | Zero. O preço é um clique que se parece com um clique que não pegou — e o segundo clique parece o primeiro. |
| **O botão diz que está trabalhando** | Enquanto o gesto está no ar o rótulo do botão troca para "Atualizando…" e volta ao normal quando termina. | Zero linha nova de tela — a palavra mora dentro do botão que já existe, e cabe na coluna de 184px. Falta escrever o estado em voo, que hoje não existe em nenhuma das dez abas; mockup republicado. |
| **O recado laranja dá o recibo** | Ao voltar, a mesma tarja da recusa aparece dizendo "Ajustes reaplicados." — o canal já existe e já é usado. | Zero linha nova de tela e nada a inventar. O preço: fala só DEPOIS dos nove segundos, e a tarja cobre a barra do rodapé por 30 segundos (ou precisa de uma vida mais curta só para recibo). |

**Minha recomendação:** O botão diz que está trabalhando — é a única das três que fala DURANTE a espera em vez de depois dela, e a resposta aparece no lugar exato onde ela clicou.

**Fecha as linhas:** *Botão "Atualizar"*

---

## Não são decisão dela

Linhas desta aba que o levantamento descartou, com a razão. Ficam registradas para ninguém as ressuscitar como pergunta.

- **"Ver detalhes" e "Parar o serviço" ficarem de fora da trava** — Não é escolha de tela: as duas divergências já estão declaradas no código com a medição e a razão (`TRAVA_QUE_NAO_VALE_AQUI`, `a09_sistema.py:1318`). "Ver detalhes" lê o journal do systemd, que sobrevive à queda do serviço — trancá-lo apagaria a resposta para "por que ele caiu?" no minuto em que ela é a única que importa; e "Parar o serviço" virou o botão que TAMBÉM liga, por decisão dela de 03/09.
- **A trava do produto que prende "ver-plugins" e "ver-detalhes" com a mesma frase** — É defeito de motor, não desenho: a linha que tranca os dois juntos está em `gui/aba_sistema.py:606`, na camada do produto, e a frase ("não há o que perguntar a ele") é falsa para um dos dois. Consertar é código de outra frente; nada muda na tela dela conforme a resposta.
- **O canal de recado da recusa (a tarja laranja do rodapé)** — Já foi decidido e construído em 02/09, depois de medir que a frase da recusa ia para o terminal e não para a tela. Ela existe, funciona e é o que as três decisões acima usam como base — não há escolha aberta sobre ela, só sobre quem a aciona.
