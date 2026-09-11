# LINGUA-A4 — a língua das abas Gatilhos, Iluminação e Vibração

**Agente:** opus · **Data:** 11/09/2026 · **Branch:** `voo/LINGUA-A4-opus`
· **Base:** `dev` (`f04f4a0b`, o mesmo commit de agora — conferido)

**Esta entrega é PROPOSTA DE TEXTO.** Nenhuma frase foi trocada em gerador
nenhum, nada foi publicado, e a árvore só ganha este arquivo. Ordem dela:
*"Pra apresentarem as propostas tá bom?"* <!-- noqa-acento: citação literal dela -->

---

## §0 — O que saiu daqui, em quatro linhas

* **312 textos de tela vistoriados** nas três abas — 273 na página publicada e
  **39 que só nascem no tique** e que nenhuma foto mostra.
* **77 propostas**, e a conta fecha em **17.118 → 11.928 caracteres (−30%)**.
* **Uma decisão dela de 29/08 está VIVA e NÃO aplicada**, e a tela dela mostra
  hoje exatamente o que ela mandou tirar (§4.1).
* **Sete recusas da aba Gatilhos põem caminho de arquivo e nome de atributo do
  DOM no cartão dela** — e nenhuma das três réguas de língua desta casa as lê
  (§4.2). É o vício que esta frente foi aberta para achar, na sua forma mais
  crua.

---

## §1 — A FOTO DO ANTES, na vista dela

As três já estão versionadas, e **são as de hoje**: rodei o retratista e as
somas bateram byte a byte com as que estão no disco.

```bash
PYTHONPATH=$PWD/src .venv/bin/python \
  src/hefesto_dualsense4unix/interface/olhar.py 03-gatilhos.html --publicado --vista dela
```

| aba | foto do ANTES (versionada) | md5 da minha corrida |
| --- | --- | --- |
| **03 Gatilhos** | `docs/usage/assets/maximizada/aba-03-gatilhos.png` | `f160242e51a9fbb060b52a6cf20bf009` |
| **04 Iluminação** | `docs/usage/assets/maximizada/aba-04-iluminacao.png` | `102780e5dd99a13600e4ac951a8bef82` |
| **05 Vibração** | `docs/usage/assets/maximizada/aba-05-vibracao.png` | `1d3b595dabb92e7b8777911773be723b` |

As três saíram `1600x777` dentro da vista `1918x840`, `passa_da_dobra: 0`,
`rolagem_lateral: false`. **Nenhuma janela nasceu na tela dela**: o `olhar.py`
fotografa num Chrome headless.

---

## §2 — O QUE SE MEDIU, e por que a conta tem duas metades

**A foto não é o inventário.** Uma foto é o estado INICIAL da página; o texto
que só aparece quando alguém clica errado, ou quando o Hefesto recusa, não está
nela. Então a vistoria leu dois canais:

```bash
# 1. o que a página publicada renderiza (dentro da `.janela`, fora da `.nota`)
#    — texto + title + placeholder + aria-label
# 2. o que o PACOTE escreve no cartão em tempo de execução
```

**E o segundo canal tem um contrato que decide o que é texto de tela.** Medido
em `interface/hefesto_vivo.py:2757-2786`:

| o que o pacote levanta | para onde a frase vai |
| --- | --- |
| `RuntimeError` | **o cartão laranja, na tela dela** (`_recusou_dizendo` deposita) |
| `ValueError` | **só o `stderr`** — `if not isinstance(erro, RuntimeError): return False` |
| `{"recado": …}` | o cartão verde da D-01 |

**Isso tirou 22 frases da tabela** que se leem como texto de tela e não são —
elas estão na §6.

### A conta, por aba

| aba | página (único) | só no tique | **hoje** | proposto | |
| --- | ---: | ---: | ---: | ---: | ---: |
| **03 Gatilhos** | 4.516 (105) | 2.497 (15) | **7.013** | 4.885 | **−30%** |
| **04 Iluminação** | 4.370 (101) | 912 (8) | **5.282** | 3.962 | **−25%** |
| **05 Vibração** | 3.032 (67) | 1.791 (16) | **4.823** | 3.081 | **−36%** |
| | | | **17.118** | **11.928** | **−30%** |

Os textos tocados somam **11.535 → 6.345 caracteres (−45%)**; o resto da tabela
acima é texto que a vistoria leu e deixou como está.

**O que a conta NÃO inclui, e é decisão:** o esqueleto (cabeçalho, fita, tira de
abas, rodapé) é de `topo.html` e `monta.py`, fora da posse desta frente; e a
`.nota` no fim de cada página, que `interface/ver.py:73` esconde no produto
(`.nota{display:none !important}`) — ela é o caderno da bancada, não tela.

**A conta por linha é medida sobre a frase RENDERIZADA** com a mesa da foto
(`P1 Cosmic Red · USB`, `P2 Starlight Blue · BT`, perfil `Mortal Kombat`), e os
totais por aba sobre o literal do fonte. As duas réguas estão declaradas porque
elas não são a mesma.

---

## §3 — A TABELA

> Convenção: `→` é a proposta. Onde a frase tem um valor que muda, ela aparece
> com o valor da foto entre parênteses angulares no fonte.

### 3.1 — Aba 03 · GATILHOS

| onde | o que a tela diz hoje | proposta | por quê |
| --- | --- | --- | --- |
| `aba03.py:1249` | `Seleção de Gatilho` | `Gatilhos` | A 04 e a 05 põem no quadro o **nome da aba** (`Iluminação`, `Vibração`). Só esta descreve o widget: "seleção de" é o gesto, não o assunto. 18→8 |
| `aba03.py:875` | `──── Meus efeitos ────` | `Meus efeitos` | Os oito traços de caixa são **desenho dentro de texto**: um leitor de tela os soletra, e nenhum tradutor sabe se os mantém. O separador de grupo do HTML é o `<optgroup>`, e ele não precisa de traço. 22→12 |
| `a03_gatilhos.py:1048` | `Este modo não tem o que ajustar.` | `Sem ajustes.` | Diz o mesmo dentro da célula. 32→12 |
| `aba03.py:1198` | `Abrir os ajustes deste gatilho. Só um dos dois fica aberto por vez.` | `Abre os ajustes deste gatilho. Só um fica aberto por vez.` | Infinitivo descreve o comando; os outros `title` desta casa estão na 3ª pessoa (`Guarda`, `Põe`, `Manda`, `Apaga`). "dos dois" é a contagem que o desenho já mostra. 67→57 |
| `aba03.py:1199` | `Fechar os ajustes. Modo e Efeito pronto continuam à vista.` | `Fecha os ajustes.` | A 2ª oração descreve o que a pessoa **vai ver acontecer** no mesmo instante. 58→17 |
| `aba03.py:1250` (o `?` do quadro) | *"O L2 e o R2 do DualSense têm um motorzinho dentro que opõe força à sua mão. É o que faz um gatilho parecer o freio de um carro e outro parecer uma metralhadora. // Uma coluna por controle, e os 4 ao mesmo tempo. Cada coluna escreve no controle do chip que a encabeça — não há o que escolher lá em cima, e é por isso que a fita está esmaecida. Escolher um modo já manda o efeito para aquele controle, e quem está com ele na mão sente na hora. // A descrição de cada modo está na lista — passe o mouse por ela antes de soltar o botão, porque soltar já manda. // Esta tela mostra o que o Hefesto escreveu no gatilho. A confirmação é o que você sente na mão — é assim que se prova um efeito adaptativo."* | *"O L2 e o R2 têm um motor dentro que empurra a sua mão de volta: é o que faz um gatilho parecer freio de carro e outro, metralhadora. // Uma coluna por controle. Escolher um modo já manda o efeito, e quem está com aquele controle na mão sente na hora. // O DualSense não devolve o modo em que está: o que você sente na mão é a confirmação."* | Quatro parágrafos não cabem numa respiração. O 3º **ensina a usar o instrumento** ("passe o mouse antes de soltar o botão"); "esmaecida" é palavra de quem desenhou. **O 4º fica** — reescrito: ele é o único fato do aparelho que a tela não tem de onde tirar. 689→332 |
| `aba03.py:1047` (`title` do campo Nome) | *"Dê um nome e o par L2+R2 desta coluna entra em Meus efeitos, para você escolher em qualquer perfil. Em branco, o botão só guarda no perfil deste controle."* | *"Com um nome, o par L2+R2 entra em Meus efeitos e serve a qualquer perfil. Em branco, fica só no perfil deste controle."* | "Dê um nome" instrui sobre o campo em que o cursor já está. 154→118 |
| `aba03.py:1049` (`title` do Guardar) | *"Guarda esse efeito: o L2 e o R2 desta coluna vão para o perfil, só deste controle. Com um nome ao lado, o par também entra em Meus efeitos."* | *"Guarda o L2 e o R2 desta coluna no perfil deste controle. Com um nome ao lado, o par também entra em Meus efeitos."* | "Guarda esse efeito:" repete o rótulo do botão logo abaixo. 139→114 |
| `aba03.py:1051` (`title` do Em todos) | *"Põe o L2 e o R2 desta coluna em todos os controles ligados e guarda o efeito no perfil como o de todo mundo — um controle que você ligar depois já nasce com ele. **Some** o ajuste próprio que cada controle tinha nesses dois gatilhos."* | *"Põe o L2 e o R2 desta coluna em todos os controles, agora e nos que você ligar depois. **Apaga** o ajuste próprio que cada um tinha nesses dois gatilhos."* | **`Some` lê-se de duas maneiras opostas** — 3ª pessoa de *sumir* ou imperativo de *somar* — e é a única frase destas três abas que se pode entender ao contrário do que quer dizer. Num texto que vai ser traduzido, é uma mina. 229→149 |
| `a03_gatilhos.py:603-616` (o aviso do Efeito pronto, **8 vezes na tela**) | *"Este gatilho está em «Metralhadora». Escolher uma curva pronta **TROCA** o modo dele para «Curva de força» na hora — é um clique, e já vai ao controle. Um efeito seu põe o modo com que ele foi guardado."* | *"Está em «Metralhadora». Escolher uma curva troca o modo para «Curva de força», na hora. Um efeito seu volta ao modo com que foi guardado."* | `TROCA` em versal é ênfase decorativa — a família que ela baniu em 11/09. "é um clique, e já vai ao controle" repete o "na hora" da mesma frase. 198→137 |
| `a03_gatilhos.py:487` (dica do modo Metralhadora) | *"Batidas rápidas e fortes enquanto apertado. É o padrão do Estilo FPS."* | *"Batidas rápidas e fortes enquanto apertado."* | É a única das 19 dicas que cita **outra feature do produto**; um tradutor não tem como saber que "Estilo FPS" é nome próprio de tela. 69→43 |
| `a03_gatilhos.py:478` (dica do Rígido simples) | *"**A mesma** trava dura, com um só ponto de ajuste em vez de dez."* | *"Trava dura, com um só ponto de ajuste em vez de dez."* | "A mesma" só se entende lendo a opção **anterior** da lista; num campo fechado só aparece esta. É a única das 19 que não se sustenta sozinha. 60→52 |
| `trigger_specs.py:135` | `Arco de flecha (Bow)` | `Arco de flecha` | **Não é proposta — é decisão DELA**, §4.1 |
| `trigger_specs.py:200` | `Disparo (Weapon)` | `Disparo` | **idem**, §4.1 |
| `trigger_presets.py:56` | `Rampa crescente` | `Endurece no fim` | As seis curvas descrevem o **gráfico**, e duas em inglês; a proposta descreve a **mão**. E mata a colisão com o modo `Rampa de força`. Medido em `FEEDBACK_POSITION_PRESETS`: `[0,1,2,3,4,5,6,7,8,8]` |
| `trigger_presets.py:57` | `Rampa decrescente` | `Solta no fim` | `[8,7,6,5,4,3,2,1,0,0]` |
| `trigger_presets.py:58` | `Plateau central` | `Pico no meio` | `[0,2,4,6,8,8,6,4,2,0]` — sobe e desce, não é platô; e "plateau" nem é português |
| `trigger_presets.py:59` | `Stop hard` | `Trava seca` | `[0,0,0,0,0,0,8,8,8,8]` — **inglês na tela de um produto em português** |
| `trigger_presets.py:60` | `Stop macio` | `Trava macia` | `[0,1,2,4,6,7,8,8,8,8]` — meia palavra em inglês é pior que a palavra inteira |
| `trigger_presets.py:61` | `Linear médio` | `Peso igual` | `[4,4,4,4,4,4,4,4,4,4]` — peso constante; "linear médio" é a matemática |
| `a03_gatilhos.py:2203` | *"modo: não há controle no lugar P3 — esta coluna está vazia. Um gatilho é de um aparelho; sem aparelho não há onde aplicar. Ligue um controle neste lugar e ele pega o efeito."* | *"não há controle no lugar P3. Ligue um aqui e ele pega o efeito."* | O meio justifica a recusa com a **arquitetura**; o fato e o conserto são as duas pontas. 173→63 |
| `a03_gatilhos.py:2337` | *"modo: não consegui abrir **`app/actions/trigger_specs.py`**, e sem ele não sei quais ajustes este modo tem. Mandar **`params`** vazio faria o **daemon** aplicar um efeito sem zona ativa — o gatilho ficaria solto e a tela diria que aplicou."* | *"modo: não consegui ler os ajustes deste modo, e aplicá-lo assim deixaria o gatilho solto. Nada foi mandado."* | **Caminho de arquivo, nome de campo do protocolo e a palavra `daemon` no cartão dela.** §4.2. 227→107 |
| `a03_gatilhos.py:2362` | *"efeito pronto: não consegui abrir **`profiles/trigger_presets.py`**."* | *"efeito pronto: não consegui ler as curvas. Nada foi mandado."* | idem — e sem "nada foi mandado" ela não sabe se ficou pela metade. 64→60 |
| `a03_gatilhos.py:3048` | *"não consegui ler a coluna deste controle. A barra precisa do **`data-hef-forma`** para o **piloto** recolher os campos — sem ele não sei em que modo o gatilho está, e o **daemon** lê a lista de ajustes INTEIRA: mandar um número solto trocaria os outros pelos padrões."* | *"não consegui ler os ajustes desta coluna, e mandar um só trocaria os outros. Nada foi mandado."* | Nome de atributo do DOM + `piloto` (palavra da casa) + `daemon`. §4.2. 255→94 |
| `a03_gatilhos.py:3055` | *"este gatilho não tem modo escolhido, e um ajuste é de um modo — é ele que diz quantos parâmetros existem e o que cada um significa. Escolha um modo primeiro."* | *"este gatilho ainda não tem modo. Escolha um modo primeiro."* | "quantos parâmetros existem" é o nosso modelo de dados. 157→58 |
| `a03_gatilhos.py:3128` **e** `:3156` | *"a coluna não trouxe modo nenhum. Os dois **`<select>`** de modo são **`modo-chave-e`** e **`modo-chave-d`** — se eles mudaram de endereço, o Guardar deixou de achar o que guardar."* | *"não consegui ler o modo desta coluna. Nada foi guardado."* | Dois endereços de campo do HTML no cartão. **E a frase está duplicada literal em dois lugares** — a mesma recusa escrita duas vezes. 167→56, ×2 |
| `a03_gatilhos.py:3232` | *"não consegui ler a coluna deste controle. O botão precisa do **`data-hef-forma`** para o **piloto** recolher os campos — e sem eles não sei qual efeito pôr em todos, porque o **daemon** não devolve o modo do gatilho."* | *"não consegui ler o efeito desta coluna. Nada foi mandado."* | §4.2. 204→57 |
| `a03_gatilhos.py:3392` | *"não consegui ler a coluna deste controle. O botão precisa do **`data-hef-forma`** … porque o **daemon** não devolve o modo do gatilho."* | *"não consegui ler o efeito desta coluna. Nada foi guardado."* | §4.2. 189→58 |
| `a03_gatilhos.py:2874` | *"… — o **daemon** respondeu, e nenhum controle recebeu."* | *"o Hefesto respondeu, e nenhum controle recebeu."* | §4.3 |
| `a03_gatilhos.py:2924` | *"o **daemon** não aplicou o modo `'Rigid'`"* | *"o Hefesto não aplicou o modo «Rígido»"* | §4.3 — e `'Rigid'` é a **chave de disco**, não o rótulo que ela escolheu na tela |
| `a03_gatilhos.py:2983` | *"o **daemon** não aplicou o seu efeito `'Recuo do MK'`"* | *"o Hefesto não aplicou o efeito «Recuo do MK»"* | §4.3 |
| `a03_gatilhos.py:3003` | *"o **daemon** não aplicou a curva `'stop_hard'`"* | *"o Hefesto não aplicou a curva «Trava seca»"* | §4.3 — `stop_hard` é o token do disco; a tela oferece um rótulo |
| `a03_gatilhos.py:3084` | *"o **daemon** não aplicou o ajuste no modo `'Machine'`"* | *"o Hefesto não aplicou o ajuste no modo «Metralhadora»"* | §4.3 |
| `a03_gatilhos.py:2629` **e** `:2638` | *"o efeito **FOI** para o aparelho, mas não consegui ABRIR o perfil Mortal Kombat para guardá-lo. Ele vale até a próxima troca de perfil — no dia seguinte o gatilho volta a ser o de antes."* | *"o efeito foi para o aparelho, mas não entrou no perfil Mortal Kombat. Ele vale até você trocar de perfil."* | `FOI`/`ABRIR` em versal (ênfase decorativa); "no dia seguinte…" repete "até a próxima troca". 182→105 e 172→105 |
| `a03_gatilhos.py:2973` | *"'Recuo do MK' não guardou nada para este gatilho. Um efeito seu é o par L2+R2, e o lado que estava sem modo na hora de guardar não entrou — escolha-o no outro gatilho, ou guarde de novo com os dois ajustados."* | *"«Recuo do MK» não tem nada para este gatilho: quando ele foi guardado, só o outro lado estava ajustado."* | "não guardou nada" põe o efeito como sujeito de um ato que é nosso. 208→103 |
| `a03_gatilhos.py:3271` | *"o efeito **FOI** para os controles ligados, mas não há perfil ativo agora — e o que faz um controle novo já nascer com ele é o perfil. Escolha um perfil na aba Perfis e clique de novo."* | *"o efeito foi para os controles ligados, mas sem perfil ativo ele não vale para os próximos. Escolha um perfil na aba Perfis."* | 180→124 |
| `a03_gatilhos.py:3279` | *"o efeito **FOI** para os controles ligados, mas não consegui ABRIR o perfil Mortal Kombat para guardá-lo. Ele vale até a próxima troca de perfil — e um controle que você ligar depois não vai pegá-lo"* | *"o efeito foi para os controles ligados, mas não entrou no perfil Mortal Kombat. Um controle que você ligar depois não vai pegá-lo."* | 194→130 |
| `a03_gatilhos.py:3419` | *"não há perfil ativo agora, e o efeito do gatilho é do perfil — não da máquina. Escolha um perfil na aba Perfis, ou dê um nome ao efeito para guardá-lo em 'Meus efeitos'."* | *"sem perfil ativo não há onde guardar. Escolha um perfil na aba Perfis, ou dê um nome ao efeito para guardá-lo em Meus efeitos."* | "é do perfil — não da máquina" é a nossa distinção de camada. 169→126 |

### 3.2 — Aba 04 · ILUMINAÇÃO

> **A trava está respeitada:** nada aqui mexe na **grade**, na **largura de
> coluna**, no **arranjo** nem na **fileira de tons**. Ela recusou isso em 11/09
> (*"Deixa como está hoje então"*) e a `ILUMINACAO-GRADE-01` está `caducou`.
> Só texto.

| onde | o que a tela diz hoje | proposta | por quê |
| --- | --- | --- | --- |
| `a04_iluminacao.py:1073` | *"O Cosmic Red **É** o Player 1 — é o número dele hoje."* | *"O Cosmic Red é o Player 1 hoje."* | **Maiúscula decorativa no meio da frase** — a família exata que ela nomeou em 11/09 (*"ambos minúsculo sem iniciar de forma capitular… esse tipo de coisa não pode se repetir na interface"*). E a 2ª oração repete a 1ª. 49→31 |
| `a04_iluminacao.py:1079` (×4 botões × 4 colunas) | *"Dar o Player 2 ao Cosmic Red: o Starlight Blue (BT), que tem o 2 hoje, fica com o 1. Os dois trocam de lugar — ninguém repete número e ninguém fica sem."* | *"Dar o 2 ao Cosmic Red: o Starlight Blue fica com o 1. Os dois trocam."* | A regra ("ninguém repete, ninguém fica sem") já está na dica do rótulo **Jogador**, a poucos pixels — repeti-la em cada botão é a pergunta 4 da sprint. 152→69 |
| `a04_iluminacao.py:578` (**8 botões por coluna**) | *"Cor automática do Player 1 — usar aqui pinta a barra deste controle, e não muda o número dele."* | *"Cor do Player 1. Pinta a barra, não muda o número."* | "usar aqui" instrui sobre o gesto que já está em curso; "deste controle" e "dele" repetem a coluna em que o botão está. 94→50, **e sai 8× por coluna** |
| `a04_iluminacao.py:580` (o botão livre) | *"Pinta a barra deste controle, e não muda o número dele."* | *"Pinta a barra, não muda o número."* | idem. 55→33 |
| `a04_iluminacao.py:458` (`title` do Brilho) | *"Arraste para mudar o brilho da barra deste controle. Ao soltar, a barra acende no brilho novo e o valor é gravado no perfil ativo — não espera o Salvar Perfil."* | *"Brilho da barra deste controle. Grava no perfil ao soltar — não espera o Salvar Perfil."* | "Arraste para mudar" ensina a usar uma barra; "a barra acende no brilho novo" descreve o que se vê acontecer. **"não espera o Salvar Perfil" fica** — é o único fato que a pessoa não deduz. 159→87 |
| `a04_iluminacao.py:2762` | *"Manda esta cor ao controle de novo — a mesma que já está escrita aqui."* | *"Manda esta cor ao controle de novo."* | "a mesma que já está escrita aqui" é o hexadecimal visível a 4px do cursor. 70→35 |
| `aba04.py:1541` (o `?` do quadro) | *"A barra de luz é a faixa que acende dos dois lados do touchpad, e é a identidade de cada controle: você olha e sabe de quem é. // O plástico é físico e pode se repetir; a luz é o que nunca se repete."* | *"A barra de luz é a faixa acesa dos dois lados do touchpad: é como você sabe de quem é cada controle. // O plástico pode se repetir; a luz nunca."* | Boa, e ainda cabe menos. 196→141 |
| `aba04.py:1570` (o `?` do interruptor) | *"Ligado, cada controle acende a cor do número dele e recebe o número automaticamente — inclusive os controles de outras marcas. // Ao desligar, a cor que cada controle tem agora é gravada no perfil na hora. Assim nenhuma se perde e nenhuma se repete: **sem isso, o próximo controle a chegar cairia na cor global e ficaria igual ao vizinho.** // Isto é do perfil: vale para todos os controles dele, e viaja quando você troca de perfil."* | *"Ligado, cada controle recebe um número e acende a cor dele — inclusive os de outras marcas. // Ao desligar, a cor de agora fica gravada no perfil, para nenhuma se perder. // É do perfil: viaja quando você troca de perfil."* | O trecho em negrito **argumenta a favor do nosso desenho** contra uma alternativa que ninguém propôs. 423→215 |
| `aba04.py:1593` (o `?` do rótulo Controle) | *"A barra acende na cor do número. A borda da moldura é a cor do plástico, e as cinco luzinhas acima do touchpad dizem o número. // Cada coluna é um controle e se ajusta sozinha — **por isso a fita do topo fica esmaecida aqui: não há um escolhido, estão os quatro.**"* | *"A barra acende na cor do número; a borda da moldura é a cor do plástico, e as cinco luzinhas acima do touchpad dizem o número. // Cada coluna é um controle: a fita do topo não escolhe nada aqui."* | "esmaecida" é palavra de quem desenhou; o fato que ela precisa é **que a fita não vale aqui**. 257→191 |
| `aba04.py:1614` (o `?` do rótulo Cor) | *"…Os oito primeiros quadradinhos são as cores do produto — uma por número de jogador **(1 azul, 2 vermelho, 3 verde, 4 rosa, 5 amarelo, 6 ciano, 7 laranja, 8 roxo)**. Os demais são tons a mais…"* | *"Sem escolha à mão, a barra fica na cor do número do controle. // Os oito primeiros quadradinhos são as cores dos jogadores 1 a 8; os demais são tons a mais. // Escolher um tom pinta a barra e não muda o número. O código embaixo é a cor que vai ao aparelho."* | A lista das oito cores **legenda o que já está pintado** e repete, uma a uma, o `title` de cada botão. E são oito nomes de cor para traduzir. 421→250 |
| `aba04.py:1634` (o `?` do rótulo Jogador) | *"O player é quem este controle é: o número do cabeçalho, o dos cards da aba Controles, e o das cinco luzinhas brancas acima do touchpad. // **Isto não escolhe o que você está vendo — os 4 estão na tela.** Isto dá um número ao controle da coluna. O anelzinho de cada botão é a cor do plástico de quem tem aquele número hoje. // Dar a este controle um número que já é de outro faz os dois trocarem de lugar… // Um jogo em co-op pode mandar o seu próprio número por cima…"* | *"Dá o número do jogador a este controle — o das cinco luzinhas acima do touchpad. O anelzinho de cada botão é a cor do plástico de quem tem aquele número hoje. // Dar um número que já é de outro faz os dois trocarem: ninguém repete e ninguém fica sem. // Um jogo em co-op pode mandar o próprio número por cima."* | **É a maior dica das três abas.** O 1º parágrafo mapeia onde mais o número aparece; o 2º **se defende de uma leitura errada** que ninguém fez. Nenhum dos dois diz o que acontece ao clicar. **−396, o maior corte da leva.** 699→303 |
| `a04_iluminacao.py:2591` | *"O Starlight Blue já está nesse tom, e duas peças nunca ficam da mesma cor. Troque a cor dele primeiro, ou escolha um tom livre. Nada foi mudado."* | *"O Starlight Blue já está nesse tom: duas peças nunca ficam da mesma cor. Nada mudou — escolha outro tom."* | Duas saídas para a mesma coisa; "Nada foi mudado" na ponta é a informação que tranquiliza e deve vir junto do conserto. 144→104 |
| `a04_iluminacao.py:3303` | *"o número deste controle mudou para 2, mas as cinco lâmpadas não acompanharam: com o co-op ligado quem as acende é ele, **e o Hefesto não respondeu ao pedido de reconciliar os controles**."* | *"o número deste controle mudou para 2, mas as cinco lâmpadas não: com o co-op ligado, quem as acende é o jogo."* | **Duas coisas de uma vez:** a 2ª metade é confissão de dívida nossa (o sujeito é o Hefesto) e usa `reconciliar`, palavra que ela baniu em 09/09. §4.4. 183→109 |
| `a04_iluminacao.py:3443` | *"(o desenho foi para 2 controles e a frase do produto não disse isso)"* | *"o número mudou em 2 controles."* | "a frase do produto não disse isso" é o produto relatando uma divergência interna. 66→30 |

### 3.3 — Aba 05 · VIBRAÇÃO

| onde | o que a tela diz hoje | proposta | por quê |
| --- | --- | --- | --- |
| `pecas-do-dualsense.csv:72` (dica **e** `title` do botão, ×4 colunas) | *"Contrapeso maior — soa grosso. **No código do produto é `strong`**."* | *"Contrapeso maior — soa grosso."* | **O nome da variável do nosso código na tela dela.** É o vício desta frente na forma mais pura. A informação não se perde: ela continua em `dualsense-referencia-canonica.md:303` e no CSV para quem desenvolve — a coluna que vai à tela é que tem de parar de carregá-la. 63→30 |
| `pecas-do-dualsense.csv:73` | *"Contrapeso menor — soa fino. **No código do produto é `weak`**."* | *"Contrapeso menor — soa fino."* | idem. 59→28 |
| `aba05.py:1256` (`title` das 8 barras de motor) | *"Arraste para escolher quanto da vibração que o jogo pede chega **a motor de vibração esquerdo** — de 0 a 100%. Ela **MULTIPLICA** o degrau da coluna: 100% deixa como o degrau pediu, 0 deixa este motor mudo neste perfil. Grava na hora, no perfil ativo, só para este controle."* | *"Quanto da vibração chega a este punho — 0 a 100% do degrau da coluna. Em 0, este motor fica mudo. Grava na hora, só para este controle."* | **Três defeitos numa frase.** (a) *"chega a motor de vibração esquerdo"* — **falta o artigo**: a frase é montada colando `m["nome"].lower()` depois de `a`, e sai errada em português; (b) `MULTIPLICA` em versal; (c) 266 caracteres num `title` de barra. O (a) é o retrato do que a sprint pergunta em terceiro lugar: **frase montada por pedaço não sobrevive a tradução nenhuma.** 266→135 |
| `aba05.py:1064` (`title` da barra Personalizado) | *"Arraste para escolher quanto da vibração que o jogo pede chega a este controle — de 0 a 200%. Grava na hora, no perfil ativo, só para ele."* | *"Quanto da vibração chega a este controle — 0 a 200%. Grava na hora, só para ele."* | 138→80 |
| `aba05.py:1739` (o `?` do quadro) | *"O jogo pede uma vibração, e esta aba decide quanto dela chega a cada controle. // **O endereço do ajuste é a coluna**, não a fita — os quatro estão sempre à vista, então a fita do topo fica esmaecida de propósito."* | *"O jogo pede uma vibração, e esta aba decide quanto dela chega a cada controle. // Ajuste na coluna do controle: a fita do topo não escolhe nada aqui."* | "endereço" é palavra desta casa (endereço de campo); "esmaecida de propósito" defende o desenho. A 1ª frase é excelente e fica inteira. 206→146 |
| `aba05.py:1764` (o `?` da Força da vibração) | *"…Máximo 150%, mais forte do que ele pediu. // O Perfil de Bateria pode impor um teto… // Com a força geral em Auto, a força escolhida numa coluna fica guardada e não chega ao motor: **o Auto muda com a bateria a cada instante, e uma força por controle contra um número que se move faria esse controle vibrar de um jeito imprevisível.**"* | *"Quanto da vibração que o jogo pede chega ao controle. // Economia 30% · Balanceado 100%, como o jogo pediu · Máximo 150%, mais forte. // O Perfil de Bateria pode impor um teto: a escolha continua valendo, só não passa dele. // Com a força geral em Auto, a escolha de cada coluna fica guardada e não chega ao motor."* | O trecho em negrito **justifica a regra**; o fato (a escolha não chega ao motor) é o que ela precisa, e ele fica. Os três degraus e os três números ficam — decisão dela (`D-0609-ABA05-FICA`, *"segue os três modos sempre"*). 480→305 |
| `aba05.py:1786` (o `?` do Motor esquerdo) | *"Motor de vibração esquerdo (motor forte). Contrapeso maior — soa grosso. No código do produto é `strong`. // **Cada punho tem UM motor e cada um recebe UM valor — não existe "leve" e "forte" para cada.** O da esquerda tem contrapeso maior e soa grosso; o da direita, contrapeso menor, soa fino. // Desligue um lado e o jogo deixa de fazer aquele punho tremer — o outro continua. Serve para quem sente enjoo com o motor pesado, **e para bancada**. // A barra ao lado diz com que força esse motor entra no Testar, de 0 a 255."* | *"Motor do punho esquerdo: contrapeso maior, som grosso. // Desligue um lado e aquele punho para de tremer; o outro continua. // A barra ao lado é a força desse motor no Testar."* | **Quatro defeitos.** (a) o `strong`; (b) o 2º parágrafo **discute um mal-entendido dela de agosto** e repete "soa grosso/soa fino" que a 1ª frase acabou de dizer — e esse registro já está guardado na `.nota` (`aba05.py:1912`), que é onde ele deve morar; (c) `UM`/`UM` em versal; (d) **"e para bancada"** — "bancada" é palavra desta casa, não de quem joga. 506→169 |
| `aba05.py:1794` (o `?` do Motor direito) | *"Motor de vibração direito (motor leve). Contrapeso menor — soa fino. No código do produto é `weak`."* | *"Motor do punho direito: contrapeso menor, som fino."* | idem. 99→51 |
| `aba05.py:1809` (o `?` do Testar agora) | *"Testar faz aquele controle tremer meio segundo com os valores das barras daquela coluna; Parar corta a vibração dele agora e devolve a mão ao jogo."* | *"Testar treme este controle por meio segundo, com os valores das barras da coluna. Parar corta e devolve a vibração ao jogo."* | "devolve a mão ao jogo" é metáfora — traduz mal. 147→123 |
| `app/telas/vibracao.py:171` | *"Os valores **acima** ainda passam pela **intensidade** escolhida **ali em cima** antes de chegar ao controle."* | *"Esses valores ainda passam pelo degrau da coluna."* | **Duas referências de posição na mesma frase** ("acima", "ali em cima") — a primeira coisa que um rearranjo ou uma tradução quebra. E **"intensidade" não é o nome de campo nenhum desta tela**: o rótulo é `Força da vibração`. A dica manda olhar para um campo que não existe com aquele nome. 97→49 |
| `a05_vibracao.py:1103` | *"este controle se desligou entre o clique e agora. **Sem o lugar dele na lista do Hefesto não há como mirar só nele — e mandar assim faria todos tremerem.** Espere ele voltar e clique de novo."* | *"este controle se desligou. Espere ele voltar e clique de novo."* | O meio explica o nosso mecanismo de mira. 187→62 |
| `a05_vibracao.py:1265` | *"**o clique não disse em qual controle** — e sem alvo todos tremeriam. Clique o botão dentro da coluna do controle que você quer sentir."* | *"Clique o botão dentro da coluna do controle que você quer sentir."* | "o clique não disse" é o produto relatando o próprio defeito de leitura; a 2ª metade já é a instrução inteira. **Quatro mensagens desta família nesta aba** (1265, 1801, 1839, 1901). 131→65 |
| `a05_vibracao.py:1270` | *"o Hefesto não aceitou mirar este controle, **e sem mira a vibração iria para todos** — então nada foi mandado. Veja se ele está rodando, na aba Sistema, e tente de novo."* | *"o Hefesto não aceitou mirar este controle, e nada foi mandado. Veja se ele está rodando, na aba Sistema."* | 165→104 |
| `a05_vibracao.py:1383` | *"esta coluna vai continuar mostrando Balanceado: a sua escolha é igual à força geral, **e só o que difere dela fica guardado no controle**."* | *"esta coluna vai continuar mostrando Balanceado: a sua escolha é igual à força geral."* | O trecho em negrito é o nosso modelo de armazenamento. 134→84 |
| `a05_vibracao.py:1723` | *"este controle não tem **endereço fixo de doze hexa**, e sem ele **não há chave no perfil** para guardar a força só dele. Um controle sem endereço estável muda de nome a cada conexão, e a escolha cairia num aparelho diferente do que você está vendo."* | *"este controle não tem um endereço fixo, e sem ele o perfil não sabe guardar a força só dele — amanhã ela cairia em outro aparelho."* | "doze hexa" é o formato do identificador; "chave no perfil" é a estrutura do arquivo. 240→130 |
| `a05_vibracao.py:1796` | *"este clique não disse qual degrau — tente de novo em cima de um dos botões (economia, balanceado, max)."* | *"Clique em cima de um dos degraus: Economia, Balanceado ou Máximo."* | **As três chaves de disco em minúsculas (`max`) no lugar dos três rótulos da tela.** 103→65 |
| `a05_vibracao.py:1801` | *"o clique não disse em qual controle — e a força agora é de cada um. Clique o degrau dentro da coluna do controle que você quer mudar."* | *"Clique o degrau dentro da coluna do controle que você quer mudar."* | 133→65 |
| `a05_vibracao.py:1839` | *"o arraste não disse em qual controle — a **intensidade** agora é de cada um. Use a barra dentro da coluna do controle que você quer mudar."* | *"Use a barra dentro da coluna do controle que você quer mudar."* | "intensidade" outra vez, e o campo não se chama assim. 134→61 |
| `a05_vibracao.py:1845` **e** `:1913` | *"a barra não mandou número nenhum. Arraste o cursor dela em vez de clicar no **rótulo** ao lado."* | *"Arraste o cursor da barra, em vez de clicar no número ao lado."* | "rótulo" é palavra de quem desenha; o que está ao lado é **o número**. 91→62, ×2 |
| `a05_vibracao.py:1901` | *"o arraste não disse em qual controle — cada controle tem as suas duas barras de motor. Use a barra dentro da coluna do controle que você quer mudar."* | *"Use a barra dentro da coluna do controle que você quer mudar."* | 148→61 |
| `a05_vibracao.py:1908` | *"este arraste não disse qual punho — tente de novo na barra do motor esquerdo ou na do direito."* | *"Use a barra do motor esquerdo ou a do direito."* | 94→46 |
| `a05_vibracao.py:1936` | *"o Hefesto não aceitou gravar esta barra, **e não disse por quê**"* | *"o Hefesto não gravou esta barra. Tente de novo."* | "não disse por quê" é o produto confessando que não sabe o que fez. E a pessoa fica sem conserto. 60→47 |

---

## §4 — Os quatro achados que não são proposta

### 4.1 — Uma decisão dela de 29/08 está VIVA e a tela dela mostra o contrário

`docs/data/decisoes-dela.csv:116` — **`D-ARCO-DE-FLECHA-SEM-O-INGLES`**,
decidida **por ELA** em 29/08/2026:

> *"SÓ «ARCO DE FLECHA». O inglês sai. O projeto é em português e há portão que
> reprova inglês na tela — este passou porque estava entre parênteses. (…) ela
> vale para o PRODUTO, no transplante, e **cobre os dois pela FORMA** — o inglês
> entre parênteses sai do rótulo de tela."*

**A tela dela hoje diz `Arco de flecha (Bow)` e `Disparo (Weapon)`**, nos oito
campos de modo da aba Gatilhos. Está na foto da §1.

**E o caminho de volta está medido.** A decisão dizia, com razão, que *"o MOCKUP
já está limpo"* — o gerador digitava `Arco de flecha` sem parêntese. Em
**03/09/2026** a aba parou de digitar os 19 rótulos e passou a lê-los do produto
(`aba03.py:625-655`, com a razão certa: duas cópias já tinham divergido). **O
inglês voltou pela porta da unificação**, e o commit que a fez cita a decisão de
**07/08** — a que a de 29/08 revogou.

Não há o que propor: a escolha já é dela. O que falta é uma linha em
`app/actions/trigger_specs.py:135` e `:200`. **Antes de executar, confira o
outro consumidor:** `app/actions/triggers_actions.py:113` monta `mode_items` com
os mesmos `label`.

### 4.2 — Sete recusas da aba Gatilhos põem o nosso código no cartão dela

Estas sete são `RuntimeError` — logo vão **para a tela**, pelo
`_recusou_dizendo`:

| endereço | o que aparece no cartão |
| --- | --- |
| `a03_gatilhos.py:2337` | `` `app/actions/trigger_specs.py` ``, `` `params` ``, `daemon` |
| `:2362` | `` `profiles/trigger_presets.py` `` |
| `:3048` | `` `data-hef-forma` ``, `piloto`, `daemon` |
| `:3128` | `` `<select>` ``, `` `modo-chave-e` ``, `` `modo-chave-d` `` |
| `:3156` | idem (a mesma frase, escrita duas vezes) |
| `:3232` | `` `data-hef-forma` ``, `piloto`, `daemon` |
| `:3392` | `` `data-hef-forma` ``, `piloto`, `daemon` |

**O próprio código já sabia que isso é errado — para o outro canal.** Em
`hefesto_vivo.py:2772-2776`:

> *"`ValueError` NÃO ENTRA (…): ele é clique inválido, e as frases que os
> pacotes escrevem nele falam com quem programa — uma delas cita
> `interface/aba06.py:OPCOES_TECLADO`. **Pôr um caminho de arquivo no cartão
> dela trocaria um silêncio por um ruído.**"*

A regra foi escrita para o `ValueError` e **não foi aplicada ao `RuntimeError`**,
que é o canal que chega mesmo.

**E nenhuma das três réguas de língua desta casa as lê:**

| régua | o que ela varre | alcança o cartão? |
| --- | --- | --- |
| `scripts/check_a_tela_nao_confessa.py` | as dez páginas HTML + toda `Fala` por `texto=` | **não** — é `RuntimeError`, não `Fala` |
| `scripts/check_a_janela_nao_confessa.py` | título da janela, `.desktop`, units, identidade | **não** — é a moldura, não o miolo |
| `tests/unit/test_a_palavra_mesa_nao_chega_a_tela.py` | o texto visível das páginas | **não** — a frase não está na página |

Não é acusação de ninguém: o canal é novo (02/09/2026) e as réguas são de antes
dele. **Fica escrito para que a próxima régua nasça sabendo onde olhar.**

### 4.3 — `daemon` está na tela, e o glossário de 06/09 o proíbe

`docs/A-LINGUA-DESTA-CASA-o-glossario-que-a-tela-e-o-codigo-falam.md:23` decide a palavra:

| na tela | na casa |
| --- | --- |
| **serviço** | `daemon`, `hefesto-dualsense4unix.service` |

**Cinco recusas da aba Gatilhos dizem `o daemon`** (`a03_gatilhos.py:2874, 2924,
2983, 3003, 3084`), enquanto a aba Vibração, no mesmo cartão, diz **`o Hefesto`**
(`a05_vibracao.py:1270, 1925`). Três nomes para a mesma coisa.

**Propus `o Hefesto`, e não `o serviço`** — porque é o que a 05 já diz, é o que
o glossário usa em §2 (*"o Hefesto no meio, ou fora"*), e porque quando o
produto recusa, quem recusa é o produto. **Fica registrado que o glossário, lido
ao pé da letra, diz `serviço`**: a escolha entre os dois é de quem costura.

### 4.4 — A palavra que ela baniu voltou, no infinitivo, por onde a régua não passa

`a04_iluminacao.py:3304`, no cartão:

> *"…e o Hefesto não respondeu ao pedido de **reconciliar** os controles."*

`PALAVRAS_BANIDAS` traz `reconciliad` desde 09/09 (JOGAR-02 §5), e a razão
escrita é *"a LÍNGUA DE DENTRO: `CoopManager.sync` (…) escrito na tela dela"*.

**Provei a régua nos dois sentidos antes de afirmar o vazio** — é o antídoto do
`COMO-OLHAR-A-TELA.md` contra o não-achado convincente:

```
'reconciliad'  casa na frase do cartão?          False
'reconciliad'  casa em 'Jogadores reconciliados'? True
```

A régua funciona; o que ela não alcança é o **infinitivo** — `reconciliar` não
contém `reconciliad`. Somam-se dois pontos cegos: a forma da palavra e o canal
(§4.2). A frase proposta não usa a palavra em forma nenhuma.

---

## §5 — O que eu NÃO propus, e por quê

**Onze coisas que parecem ruins e não são, ou que não são minhas.**

| o que | por que fica |
| --- | --- |
| **`— Nenhum —`** (`aba03.py:697`) | Parece irmão do travessão do lugar vazio, e o código até tem uma recusa que explica a diferença. **Mas o nome é DELA** — `aba03.py:694`: *"`— Nenhum —` É DELA e fica: o produto chama o `custom` de «Personalizar», e o nome desta tela é o que ela aprovou."* |
| **`LEDs`** (`aba04.py:1658`) | Sigla em inglês numa tela em português. **Foi ela que a escolheu**, 31/08: *"onde tem Disposição dos LEDs coloca só LEDs"* — e há régua que reprova o rótulo longo se ele voltar (`aba04.py:1971`). |
| **`Jogador`** (`aba04.py:1633`) | Mesma decisão do mesmo dia: *"Selecione o player coloca só Jogador"*. |
| **`Economia · Balanceado · Máximo`** | `D-0609-ABA05-FICA`, 06/09: *"Deixar a 05 como está"*, e *"segue os três modos sempre"*. Os três nomes e os três números ficam. |
| **`Opções`** (`aba04.py:1659`) | Rótulo genérico e plural para **um** botão (`Desligar`) — e é defeito de verdade. **Mas o conserto honesto é de ARRANJO**, não de texto: a célula tinha dois botões e um saiu por ordem dela em 07/09 (*"sai todos"*). Mudar o rótulo para `Desligar` duplicaria o botão. **E arranjo é o que a trava de 11/09 proíbe nesta aba.** |
| **`Personalizado`** (`aba05.py:1778`) | Abstrato, mas é a palavra padrão em português para "nem um dos presets acima", e a linha fica logo abaixo dos três degraus, que é o que a torna óbvia. |
| **As 19 dicas de modo** (`a03_gatilhos.py:476-494`) | Propus trocar **duas**. As outras 17 são o melhor texto destas três abas: falam de **freio de carro**, **espingarda**, **cavalo correndo**, **coice de um tiro único**. Elas passam a primeira pergunta da sprint melhor que qualquer coisa que eu escrevesse. |
| **`Modo`** (`aba03.py:1223`) | Cogitei que fosse jargão de protocolo. Não é: é palavra corrente em português, e trocá-la colidiria com `Efeito pronto`, a linha de baixo. |
| **A `.nota`** de cada página | ~2.400 caracteres de prosa por aba, e a maior parte fala de pixel, de decisão e de commit. **Não é tela:** `interface/ver.py:73` a esconde no produto. Vistoriei e deixei — é o caderno da bancada, e a `check_a_tela_nao_confessa` declara, com todas as letras, que é lá que a dívida **deve** ser nomeada. |
| **As 22 frases de `ValueError`** | Leem-se como texto de tela e não são: `hefesto_vivo.py:2783` as manda ao `stderr`. Uma delas diz *"o `<select>` carrega a chave no `value` de cada opção; quem tem de mandá-la é a ponte do piloto, no `change` — ver `_escolhido`"*. **Reescrevê-las seria polir o que ninguém lê.** O que há ali é outro defeito, e ele não é de língua: **esses cliques não dizem nada na tela.** O próprio código o nomeia — *"O que falta ali é uma frase que ela decida"*. Vai para a fila, não para esta tabela. |
| **O esqueleto** (`topo.html`, `monta.py`) | A dica do `Perfil ativo` (247 caracteres), o `title` da fita esmaecida e os quatro `title` do rodapé aparecem nas três abas e são bons candidatos. **Fora da posse desta frente** — são da `ESQUELETO-C2` / da costura. Registro os endereços: `topo.html:777`, `:789-793`, e os quatro botões do rodapé. |

---

## §6 — O que espera a palavra dela

1. **Os seis nomes de curva** (§3.1). Ela nunca foi perguntada: a
   `ONDA-GATILHOS-INDICE:116` registra *"«Stop hard», «Machine gun» — o inglês
   fica?"* como pergunta aberta desde 27/08.
2. **`daemon` → `o Hefesto` ou `o serviço`** (§4.3).
3. **`Arco de flecha` e `Disparo`** — ela **já** decidiu (§4.1); só precisa saber
   que a decisão não chegou à tela.

---

## §7 — O que esta frente NÃO fez

* Não trocou uma frase em gerador nenhum, nem em `mockup/`, nem em
  `interface/paginas/`.
* Não publicou (`--publicar`): a tela dela não muda com este commit.
* Não acrescentou feature, tela, botão nem campo.
* Não tocou `install.sh`, `dev`, nem arquivo fora da posse.
* Nenhuma janela nasceu na tela dela: o `olhar.py` roda num Chrome headless.

---

## §8 — Os comandos, ao lado dos números

```bash
# a foto do ANTES, na vista dela (as três, idênticas às versionadas)
PYTHONPATH=$PWD/src .venv/bin/python \
  src/hefesto_dualsense4unix/interface/olhar.py 05-vibracao.html --publicado --vista dela

# o canal que decide o que é texto de tela
sed -n '2757,2786p' src/hefesto_dualsense4unix/interface/hefesto_vivo.py

# a decisão dela de 29/08 que a tela não obedece
grep -n 'D-ARCO-DE-FLECHA-SEM-O-INGLES' docs/data/decisoes-dela.csv

# a palavra `daemon` que sai no cartão
grep -n 'o daemon não aplicou\|o daemon respondeu' \
  src/hefesto_dualsense4unix/interface/pacotes/a03_gatilhos.py
```

---

## §9 — Os portões, e os dois vermelhos que NÃO são desta frente

```bash
git add -A && bash scripts/portoes.sh
# REPROVOU: 2 vermelho(s) de 56 -> referencias-docs acentuacao
```

**Esta frente muda UM arquivo** (`git diff --cached --name-only` devolve só este
relatório), e os dois vermelhos vêm do commit base `f04f4a0b`. Medido nos dois
sentidos, em vez de afirmado:

### `referencias-docs` — eram 5, são 4, e a que caiu é a minha

| | mortas |
| --- | --- |
| sem este relatório no disco | **5** — `LINGUA-A1`, `A2`, `A3`, **`A4`**, `A5` |
| com ele | **4** — `LINGUA-A1`, `A2`, `A3`, `A5` |

As cinco sprints desta onda citam, cada uma, o relatório que o seu agente ainda
vai escrever. **A A4 deixou de citar futuro no instante em que este arquivo
nasceu**; as outras quatro fecham quando A1, A2, A3 e A5 commitarem os seus. É o
portão funcionando, não um defeito.

### `acentuacao` — três, e as três são CITAÇÃO LITERAL DELA

```
docs/process/sprints/2026-09-11-A-SEGUNDA-LISTA-DELA-…-INDICE.md:89: paginas -> páginas
docs/process/sprints/2026-09-11-A-SEGUNDA-LISTA-DELA-…-INDICE.md:94: codigo  -> código  (×2)
```

As três estão dentro das aspas dela, no `git show f04f4a0b` — *"em todas as
**paginas** isso ocorre"* e *"aqui deveria aparecer o nome e o **codigo**"*.
**A digitação dela não se limpa**: o conserto é o `<!-- noqa-acento: citação
literal dela -->` na linha, que é o que as outras dezenas de citações daquele
mesmo arquivo já têm.

**Não consertei**: o `posse` daquele arquivo é `COORDENA`, e mexer nele seria
tocar fora da posse. Fica aqui, com o endereço e o conserto de uma linha.
