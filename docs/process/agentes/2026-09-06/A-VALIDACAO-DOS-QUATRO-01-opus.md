# A-VALIDACAO-DOS-QUATRO-01 — a mesa de medição, e os dois defeitos que o realce escondia

**06/09/2026.** A encomenda dela está transcrita palavra por palavra em
`A-VALIDACAO-DOS-QUATRO-01-entrada/ESPEC-A-VALIDACAO.md`, ao lado deste arquivo.
A frase que decide todo o desenho é a do defeito de MEMÓRIA: a sessão de quem
estava na bancada acabava e levava embora não só o resultado como **o modo de
chegar nele**.

Por isso a peça central desta entrega não é a página bonita — é a **recusa**:
`Registro.gravar` não escreve uma linha sem o gesto que foi aplicado.

---

## O que mudou

### 1. `validar.sh`, na raiz — o lançador

Sobe um servidor local e abre a página na tela dela. `--sem-abrir` para a régua,
`--censo` para o retrato, `--porta` para escolher a porta.

* **o interpretador se declara e é conferido**: ele escolhe o python por
  CAPACIDADE (o primeiro que importa o pacote **desta** árvore) e **para** se o
  `hefesto_dualsense4unix` resolver para outra — a armadilha que já fez trabalho
  entregue ser diagnosticado como faltando;
* **não toca no daemon**: não instala, não reinicia, não escreve um byte no
  aparelho. Só lê o que o daemon já publicou pelo socket;
* **a janela é DELA**: aqui não vale `--oculta`, e é a única janela desta casa
  que nasce de propósito na tela dela. As réguas rodam headless;
* mata o servidor **por PID conferido**, nunca por `pkill -f`.

### 2. `scripts/mesa_de_medicao.py` — o instrumento

**Zero dependência nova.** `http.server` + `csv` + `json` + `socket`, tudo da
biblioteca padrão. A dívida do `playwright`, que não está no `pyproject.toml` e
deixa toda árvore de agente com dois portões vermelhos, já ensinou o preço.

**148 testes, e nenhum digitado.** O censo de hoje:

```
    21  O roteiro — a aceitação do produto     (as 21 linhas da §2 da MESA-DE-QUATRO-01)
    33  O mapa de canais — plataforma
    23  O mapa de canais — luz
    16  O mapa de canais — audio
    13  O mapa de canais — movimento
    12  O mapa de canais — entrada
    10  O mapa de canais — energia
     6  O mapa de canais — toque
     5  O mapa de canais — identidade
     4  O mapa de canais — gatilho
     4  O mapa de canais — vibracao
     1  O mapa de canais — combinacao
```

**A regra de entrada de uma célula do mapa**, e cada metade tem dono escrito:

* a célula diz `nao-medido` na coluna do porquê — o mapa declarando que ninguém
  mediu —, **ou**
* o **grau é fraco** (`ate_onde_foi` fora de `SAIU NO FIO` / `O APARELHO
  OBEDECEU`, que é como o `docs/data/LEIA-PRIMEIRO.md` §3 define grau forte)
  **e** o produto AFIRMA alguma coisa ali (`aciona` em `sim`/`parcial`).

E `existe = nao-tem` sai fora: pôr isso na fila dela seria fazê-la conferir uma
ausência.

**Os três tempos**, como ela pediu:

| tempo | o que é |
| --- | --- |
| 1 · ANTES | o que vai acontecer · o que observar em CADA um (deve reagir · não pode reagir · observe) · a célula que isto fecha e o estado dela hoje · a peça que vai acender **e a palavra que a achou** · o COMO que o arquivo já publica · **[▶ INICIAR]** |
| 2 · TIMER | a contagem, e ela conta **o que a linha nomeia**: 5 s por padrão, 20 minutos na linha 10 do roteiro (*"volta neles aos 20 min"*), 4 min na linha 11 |
| 3 · DEPOIS | os quatro desenhos com a peça acesa, quatro respostas por controle, "o que eu vi", e o campo do **COMO — obrigatório** |

**De onde vem cada peça de um teste**, e nada disso é lista escrita à mão:

| o que | dono |
| --- | --- |
| a peça de uma célula do mapa | a coluna `peca` de `docs/data/mapa-controles.csv` |
| a peça de uma linha do roteiro | as palavras de `nome` e `apelidos` de `docs/data/pecas-do-dualsense.csv`, casadas contra o texto da linha — *"Vibração"* acha os dois motores porque eles se chamam *Motor de vibração esquerdo/direito*; *"Gatilhos"* acha L2 e R2 porque o apelido deles é *gatilho adaptativo*. **Medido: as 46 palavras que saem dali identificam, cada uma, no máximo QUATRO peças — e as de quatro são o D-pad, que é uma peça em quatro direções.** Não há palavra genérica a filtrar |
| quem deve reagir | os `P1`…`P4` que a própria linha nomeia. A linha 7 diz *"aplica um efeito no P3"* → P3 **deve reagir**, os outros três **não podem reagir**. A linha 6 não nomeia nenhum → os quatro **observam** |
| o COMO | as colunas `canal`, `report_id`, `offset`, `comando`, `codigo_ref` e `teste_que_morde` da própria célula |
| o tempo do timer | o número que a linha escreve |

**E a peça acende com a palavra que a achou escrita ao lado.** Um realce sem
procedência é um realce que ninguém pode contestar; assim, se ela discordar do
que acendeu, ela vê por qual palavra a mesa decidiu.

### 3. O registro — e é aqui que a página se justifica

Cada clique grava **duas vezes, na hora, em disco**, sob
`$XDG_STATE_HOME/hefesto-dualsense4unix/mesa-de-medicao/`:

* `registro-<data>.jsonl` — a fita, *append-only*. Uma resposta corrigida não
  apaga a anterior;
* `estado.json` — a última resposta de cada teste, escrita por `os.replace`. É o
  que a página lê ao recarregar, e é o que faz a medição sobreviver a fechar o
  navegador.

Cada linha carrega: o teste, a célula, a resposta **por controle**, o texto
livre, **o estado dos quatro no instante** (endereço mascarado, transporte,
bateria, modelo, slot, o que a barra dizia) e **o COMO** — o que o arquivo
publica sobre a célula MAIS o gesto que a pessoa digitou.

**`Registro.gravar` levanta `ValueError` quando o gesto vem vazio**, e o servidor
devolve 400. Quem não sabe dizer como fez escreve isso — o campo aceita
`"não apliquei"`; o que ele não aceita é o silêncio.

### 4. Os dois defeitos do `apertados=` — e o segundo era o pior

A especificação me mandou curar o `apertados=` de `interface/monta.py`, órfão
desde que nasceu, e avisou que a linha *"tem cara de defeito"*. **A linha estava
sintaticamente correta** (`x.replace(velho, novo, 1)` é uma `str.replace` de três
argumentos, não de dois). Os defeitos eram outros dois, e o segundo só apareceu
quando fui MEDIR a cor no Chrome:

**Defeito 1 — a âncora ausente passava em silêncio.** `str.replace` que não casa
devolve o texto intacto sem avisar. Quem chama passa o `id` de uma peça vinda da
coluna `peca` do mapa, que é escrita à mão: um `alto_falante` com sublinhado
onde o desenho tem `alto-falante` e os quatro desenhos sairiam IGUAIS — que é
exatamente a leitura errada que uma mesa de medição não pode produzir. Agora a
ausência PARA a geração, como o `jogador=` e o `_tira_grupo` já faziam.

**Defeito 2 — a classe entrava como um SEGUNDO atributo `class`, e a peça
marcada perdia a cor do aparelho.** O grupo saía:

```html
<g class="marcada" id="p3-l2" class="z-gatilhos" transform="…">
```

O navegador ignora o segundo `class`, sem erro e sem aviso — e com ele ia embora
a **zona de plástico**. Medido no Chrome, com um Nova Pink na mesa: o R1 pintava
`rgb(227,91,140)` e o L2 marcado caía no `#3a3f4b` cru do desenho. **A peça em
foco era a única sem a cor do aparelho dela.** É a MESMA lição que a cura do
`jogador=` carrega vinte linhas acima, no mesmo arquivo; ela não tinha sido
aplicada aqui. Agora a classe é FUNDIDA na que já está lá.

### 5. A regra CSS que faltava — `monta.folha_de_realce()`

E ela **quase nasceu falsa**. Escrevi primeiro
`svg[data-colorway] g.marcada :is(path,…)` — e medi:

```
R1 do P3 com .marcada  ->  rgb(227, 91, 140)   (a cor da zona; o realce NÃO apareceu)
```

A conta: a folha das zonas escreve
`svg[data-colorway="x"] .z-gatilhos :is(path,…):not([fill="none"])` = **(0,3,2)**,
porque o `:not([…])` também conta como classe. A minha dava **(0,2,3)** e perdia.
O `.marcada.marcada` repetido sobe para **(0,3,3)** e ganha por um ponto. Parece
erro de digitação e não é — é a única forma de subir um degrau de classe sem
inventar um id nem pôr um seletor a mais no desenho, e a docstring diz isso.

Medido depois da cura, com quatro modelos na mesa:

```
L2 do P3 (deve reagir)      rgb(255, 121, 198)   <- --reage
L2 do P1 (não pode reagir)  rgb(124, 133, 152)   <- --calado
R1 do P3 (fora do teste)    rgb(227, 91, 140)    <- a zona do Nova Pink
R1 do P1 (fora do teste)    rgb(174,  51,  90)   <- a zona do Cosmic Red
```

**Os quatro acendem, com papéis distintos.** O que separa não é a ausência do
realce — é a TINTA: acender só no que deve reagir tiraria da tela justamente a
pergunta que interessa, *o que NÃO PODE reagir reagiu?*, e ela só se responde
olhando a mesma peça nos quatro.

### 6. A cor, e o portão que NÃO subiu

`monta.folha_das_cores()` publica a folha dos **28 modelos inteira**, UMA vez na
página; cada desenho nasce com o novo `svg(..., folha=False)` e escolhe por
`data-colorway`. Uma folha podada por desenho seria a escolha cravada que
`scripts/check_a_cor_vem_do_aparelho.py` conta como dívida.

**O portão continua em ZERO nas duas medidas** — ele varre
`src/hefesto_dualsense4unix/interface/paginas` (publicado) e `mockup/`
(bancada), e esta página não mora em nenhum dos dois: ela é **montada a cada
`GET /`**, nunca guardada em disco. Assim ela também nunca envelhece — mudou o
CSV, o próximo `F5` mostra a mesa nova.

**O RECUO DOS MODELOS INCOMPLETOS, declarado como pedido.** Quatro modelos têm
menos que as dez zonas no CSV dela — Ghost of Yōtei 4, Marathon 3, Genshin
Impact 3, 007 First Light 2. **Eu não inventei fill nenhum e não escrevi recuo
nenhum:** a folha que a página publica é a que
`scripts/gerar_cores_do_dualsense.py` já escreveu no `ds_limpo.svg`, e o recuo
é o DELE, medido no fonte:

| caso | o que o gerador faz | onde |
| --- | --- | --- |
| zona sem linha no CSV | `NAO_MEDIDA = "#4A4A52"` — *"não medido não é sem cor"* | `gerar_cores_do_dualsense.py:103`, `:162-163` |
| zona com `grau = SEM-HEX` (iridescente, camuflado, arte) | `url(#hachura-sem-hex)` — hachura, e a lista avisa | `:164-165` |
| um campo de cor CSS que não aceita `url(…)` | `monta.cor_de_css` devolve `""` | `monta.py` |

Confirmei no disco que os 28 slugs do CSV são os 28 declarados na folha, e o
teste `test_a_folha_publicada_tem_os_vinte_e_oito_modelos` compara os dois
conjuntos — se um modelo entrar no CSV e não na folha, ele reprova.

### 7. Quem é quem, e o que a bancada de hoje já sabe

A página lê `daemon.state_full` pelo socket unix (JSON-RPC, uma mensagem por
linha), com o caminho vindo do dono (`utils/xdg_paths.ipc_socket_path`). **Ela
não escreve NADA no aparelho**: o degrau `modelo` custa um `SET_FEATURE 0x80` —
a mesma família em que `[1,1]` reseta o controle — e quem o paga é o daemon.

A precedência do nome é a do dono (`pacotes/__init__.identidade_de`):
`nome_declarado` > `modelo` > o transporte sozinho. **Sem modelo publicado,
travessão — nunca um colorway escolhido**, e há teste que cobra isso.

**As medições de hoje chegam à página SOZINHAS, porque estão no mapa.** Não
digitei um número; conferi que a página as mostra:

* `energia.bateria.percentual@dualsense` traz, no COMO, `payload[52] =
  report[53]` no cabo e `payload[52] = report[54]` no rádio — **o mesmo nibble,
  a mesma decodificação, só o offset muda**. É a prova da decisão
  `D-0609-A-CARGA-POR-ICONE-E-SEM-TRANSPORTE`, e a página a respeita: o estado
  de carga do cartão vem de `battery_state` do daemon, **nunca inferido do
  transporte**;
* `plataforma.crc32@dualsense` traz as quatro sementes e o `report[74..77]`, e a
  ressalva dela diz que a medição foi feita *"com QUATRO DualSense na mesa ao
  mesmo tempo — DOIS no cabo e DOIS no rádio — e com o daemon PARADO"*;
* `plataforma.taxa_relatorios@dualsense` traz o teto de 250 Hz e a correção
  datada sobre os `~765 Hz`.

### 8. O índice

No fim da página, por seção, com o número, o título, a célula e o estado —
**não feito · obedeceu · falhou · parcial** —, e cada número leva ao teste. As
seções saem das famílias do mapa e da seção do roteiro.

**O veredito NÃO julga o papel**, de propósito: uma resposta `obedeceu` num
controle que devia ficar calado é um ACHADO, e transformá-la em "falhou"
automaticamente esconderia exatamente a linha que interessa. Quem julga é quem
olhou o aparelho.

---

## Qual mordida prova

`tests/unit/test_a_mesa_de_medicao.py` — **28 testes, verdes**. As cinco
mordidas foram arrancadas, vistas reprovar e devolvidas:

| arranquei | quem reprovou |
| --- | --- |
| um `.marcada` do seletor de realce (a versão que eu escrevi primeiro) | `test_mordida_o_realce_vence_a_folha_das_zonas` **e** a prova no navegador |
| a fusão do `class=`, voltando o atributo duplicado | `test_mordida_a_peca_marcada_nao_perde_a_zona_de_plastico`, `test_mordida_apertados_recusa_quando_a_ancora_some`, `test_mordida_troque_a_peca_e_o_realce_muda_de_lugar` (3 reprovas) |
| a exigência do COMO em `Registro.gravar` | `test_mordida_gravar_sem_o_como_e_recusado` **e** `test_o_servidor_recusa_a_gravacao_sem_o_como` |

E as duas mordidas que a especificação pede sobre os arquivos:

* **§7.1** `test_mordida_mude_o_mapa_e_a_mesa_muda` — promove uma célula a
  `O APARELHO OBEDECEU` numa cópia do mapa e cobra que o teste dela **suma**. Se
  a lista estivesse escrita à mão, ela continuaria lá;
* **§7.7** `test_mordida_troque_a_peca_e_o_realce_muda_de_lugar` — troca a coluna
  `peca` para `touchpad` e cobra que o `<g class="marcada">` mude de lugar.

**A prova no navegador** (`test_a_pagina_dirigida_pelo_navegador`, Playwright +
Chrome headless) cobre os nove pontos da §7, e ela **achou dois defeitos meus**:

1. **os campos herdavam o valor do teste anterior.** Eles só eram preenchidos
   QUANDO havia registro, então o texto do teste passado ficava na tela — ela
   avançaria e salvaria o gesto do teste anterior como se fosse deste. *Um campo
   que herda o valor do anterior é pior que um campo em branco: ele afirma.*
   Curado em `ir()`, com a régua ao lado;
2. **a minha própria régua estava dando verde sobre nada.** Ela "recarregava" com
   um `goto` que só trocava o `#` — navegação no MESMO documento, sem
   `DOMContentLoaded` — e conferia um campo que nunca tinha sido relido. Agora
   passa por `about:blank` primeiro, e o comentário no teste diz por quê.

E o endereço sai mascarado nas três camadas — na tela, no JSON e na fita —, com
o teste montando o MAC **em tempo de execução** a partir do OUI real (o mesmo
arranjo de `test_bateria_no_journal.py`): escrever o endereço inteiro num
literal faria os dois portões de anonimato reprovarem o arquivo, e os dois
estariam certos. **Os dois portões me pegaram fazendo exatamente isso**, e foi
assim que eu soube.

---

## O que NÃO verifiquei

**1. A leitura do daemon VIVO. É o buraco maior desta entrega.**
`systemctl --user is-active hefesto-dualsense4unix` = `inactive` durante toda a
sessão, e o socket não existe em `/run/user/1000/hefesto-dualsense4unix/`. Eu
**não** iniciei o daemon dela — não é ato meu. O que isso deixa sem prova:

* o caminho feliz de `quem_esta_na_mesa()` contra um `daemon.state_full` real —
  em especial **os nomes das chaves da resposta**. Eu leio `controllers` com
  `controles` como alternativa, e `player_slot`, `modelo`, `nome_declarado`,
  `battery_pct`, `battery_state`, `transporte`, `lightbar_rgb`, `uniq`, todos
  vindos do laudo dos batedores (`_achados/OS-ENDERECOS.md`) e do fonte
  (`ipc_handlers.py:3498`), **não de uma resposta que eu tenha visto**;
* o casamento `modelo` → `colorway`. Eu casei pelo NOME de fábrica contra a
  coluna `nome` do CSV das cores. Se o daemon publicar o nome com outra
  grafia, o desenho cai no travessão — que é a falha segura, mas é falha.

O que EU provei foi o caminho sem daemon (a página sobe e diz que ele está
parado) e o caminho com os quatro modelos, pela porta declarada da régua
(`MESA_DE_MEDICAO_MESA_DE_MENTIRA`). **A primeira coisa a fazer quando o daemon
dela subir é abrir a página e conferir os quatro cartões.**

**2. Nenhum controle na mesa.** Não havia aparelho ligado. Nada nesta entrega
tocou hardware, e nada deveria — a página não aciona o aparelho por decisão
dela.

**3. A suíte inteira.** Rodei o meu arquivo (28), o `casa-sabe` (42) e os 45
portões. Os doze lotes são de quem coordena e rodam no fim.

**4. A tela dela.** Não abri o `validar.sh` sem `--sem-abrir`: seria uma janela
na frente dela. As fotos desta entrega são do Chrome headless.

---

## O que sobrou para o próximo

**1. DOIS PORTÕES ESTAVAM VERMELHOS ANTES DE EU ENCOSTAR, e continuam.**
Medido: `bash scripts/portoes.sh` na árvore limpa, em `ae1c3d82` (a ponta de
`onda/atual-0609`), ANTES da primeira linha que escrevi, já reprovava
`paridade-gtk-html` e `donos-de-comportamento`, com **exatamente os mesmos três
achados de agora**:

```
divida-fechada: paridade-gtk-html.csv:315  [09-sistema] Botão "Corrigir modo de execução"
divida-fechada: paridade-gtk-html.csv:343  [09-sistema] "Restaurar de fábrica"
VERMELHO: donos-de-comportamento.csv:47 migrar_para_systemd: marcado SO-GTK, mas a tela
          nova já chama `on_daemon_migrate_to_systemd` em a09_sistema.py — reclassifique
```

`git diff HEAD --name-only` prova que **não toquei** nenhum dos três arquivos que
eles acusam. Os três dizem a mesma coisa: alguém FECHOU a dívida do
`09-sistema` em `interface/pacotes/a09_sistema.py` e não voltou para remedir a
linha do CSV. **Não os consertei de propósito**: o conserto certo é *medir de
novo* se o HTML faz mesmo aquilo e reescrever o veredito — trabalho de quem
fechou, com posse daqueles dois CSV. Reescrever o veredito sem medir seria
publicar um fato que eu não medi, e é a única coisa que esta casa não perdoa.

**Placar: 43 de 45 verdes.** Os outros três que estavam vermelhos no começo
(`glifos`, `anonimato`, `acentuacao`) eram do `ESPEC-A-VALIDACAO.md` largado na
raiz, e fecharam — ver abaixo.

**2. As duas funções novas de `monta.py` nascem declaradas em
`_SEM_CAMINHO_HOJE`.** `folha_das_cores` e `folha_de_realce` são promessas ao
produto que **hoje só o instrumento chama**, e o portão `casa-sabe` cobra a
lápide. Ela diz onde o caminho se perde e o que o fecha:

* `folha_das_cores` fecha quando uma aba publicar a folha inteira e trocar os
  quatro `svg()` dela para `folha=False`, com `data-colorway` endereçado. **É a
  cura da família `zona` de `check_a_cor_vem_do_aparelho.py`, hoje em 358 no
  publicado**, e publicar é ATO DELA;
* `folha_de_realce` fecha na primeira aba que precisar apontar UMA peça do
  desenho — a 03 dos gatilhos e a 06 da navegação são as candidatas.

**3. Uma citação de linha envelheceu por causa da minha edição.**
`a06_navegacao.py:900` citava `monta.py:1532` (onde a `--luz` é escrita); minhas
setenta linhas novas empurraram para `:1648`. Corrigi. **O portão
`citacoes-no-codigo` a pegou**, e vale registrar: quem mexer em `monta.py` de
novo vai empurrá-la outra vez.

**4. O `ESPEC-A-VALIDACAO.md` e o `_achados/` saíram da raiz** para
`docs/process/agentes/2026-09-06/A-VALIDACAO-DOS-QUATRO-01-entrada/`, que é onde
saída bruta de agente mora e é isento do `acentuacao` (as citações dela são
literais e corrigir a grafia de uma citação é falsificá-la). **UMA alteração de
conteúdo, declarada no cabeçalho do arquivo:** o `U+26A1` do croqui da §1 virou
a palavra `carreg.`, porque o ADR-011 proíbe emoji de apresentação e o portão
`glifos` o reprovava.

**5. O nome do assistente não entra em código versionado.** A frase dela cita
"claude fable", e o portão `anonimato` reprova isso fora de `docs/process/`. Nos
três arquivos de código a frase é **referida, não repetida** — o endereço do
documento onde ela está literal fica no lugar dela.

**6. Duas coisas que eu deixaria para a próxima volta, e nenhuma bloqueia a
bancada:**

* **148 testes é muito para os 60 minutos do roteiro.** As 21 primeiras são a
  aceitação e vêm primeiro por isso; as 127 do mapa são a fila longa. Um filtro
  por seção na página (ou um `--so-o-roteiro` no lançador) faria a hora dela
  render mais. Não fiz porque ela não pediu, e o índice já deixa pular;
* **a saída para `docs/data/ensaios.csv` e para as células do mapa** (§4 da
  especificação) **não foi escrita.** A fita `.jsonl` tem tudo o que uma linha
  de ensaio precisa, mas escrever no caderno e no mapa é ato do coordenador, com
  o `check_paridade_transporte.py` conferindo — e fazer o instrumento escrever
  sozinho num arquivo com portão, antes de ela ter medido uma linha sequer, era
  construir a segunda metade da ponte antes da primeira.

---

## Como se sobe

```bash
cd /mnt/Apate/Desenvolvimento/hefesto-voo/hefesto-voo/A-VALIDACAO-DOS-QUATRO-01-opus
./validar.sh                 # sobe e abre na tela dela
./validar.sh --sem-abrir     # sobe e só imprime o endereço
./validar.sh --censo         # o retrato dos testes, sem servir nada
```

O registro dela fica em
`$XDG_STATE_HOME/hefesto-dualsense4unix/mesa-de-medicao/`, e o cabeçalho da
página mostra o caminho, para ela nunca ter de perguntar onde foi parar.

---

## A prova

**06/09/2026, à noite.** As nove da §7 foram dirigidas pelo Playwright, com o
Chrome **headless** (`launch()` sem `headless=False`, o mesmo caminho dos
portões `pecas-do-dualsense` e `cores-do-dualsense`) — **nenhuma janela nasceu
na tela dela**. Cada linha abaixo traz o NÚMERO medido, não a palavra "ok".

**17 de 17 provas verdes · 6 de 6 mordidas morderam · 37 testes no arquivo do
construtor e no da prova.**

### As três que mais importam, e as três são mordidas nos ARQUIVOS DE VERDADE

Não em cópia de `tmp_path`: no `docs/data/mapa-controles.csv` desta árvore e no
`scripts/mesa_de_medicao.py`, com `md5` conferido antes e depois.

| § | o que se mordeu | o que a régua mediu |
| --- | --- | --- |
| **7.1** | promovi a célula `audio.microfone.mudo@dualsense [cabo]` a `O APARELHO OBEDECEU` e apaguei o `nao-medido` | a página caiu de **148 para 147 testes** e `mapa-audio.microfone.mudo-cabo` **sumiu** dela. Uma lista copiada à mão teria continuado com 148 |
| **7.7** | troquei a coluna `peca` daquela linha de `mic` para `touchpad` | o `<g class="marcada">` saiu do `mic` e foi para o `touchpad` nos **quatro** desenhos: touchpad **4/4** e mic **0/4** mordido; devolvido, mic **4/4** e touchpad **0/4** |
| **7.9** | arranquei a recusa de `Registro.gravar` (`if not gesto: raise ValueError`) | com a cura arrancada o servidor devolveu **HTTP 200 e gravou em disco**; devolvida, **HTTP 400 e nenhum arquivo no registro**. A régua reprovou exatamente onde devia |

O mapa voltou byte a byte — `md5 292167d2c29a99a1e00e446d3df2a212` antes e
depois; o módulo, `48fafadba9a9…` antes e depois.

### As outras seis, e o que cada uma mediu

| § | prova | o número |
| --- | --- | --- |
| 7.2 | nada acontece antes do INICIAR | `#antes` visível, `#contagem` e `#depois` ocultos; **0 svg** e **0 respostas** na tela; **0 pedidos** a `/desenhos` e **0** a `/registro`; **0 arquivos** no registro em disco. E o INICIAR aparece no **primeiro, no do meio e no último** dos 148 |
| 7.3 | o timer conta ANTES de aplicar | o relógio foi de **5 para 3 em 2,4 s**; `#depois` oculto, **0 pedidos** a `/desenhos` e **0 desenhos** montados durante a contagem. Os tempos distintos da mesa são **[5, 20, 240, 1200] s** — a linha 10 do roteiro pede os **1200** |
| 7.4 | avançar e voltar | `roteiro-07` → `#roteiro-08` ao salvar, e o campo do COMO voltou **vazio** (não herdou); `anterior` devolveu a `#roteiro-07`; salvar o **último** deixou o índice na viewport |
| 7.5 | sobrevive a recarregar **e está em disco** | o servidor foi **morto por PID** (`rc=-15`), um processo **NOVO** subiu no mesmo lar e releu o gesto e o rádio marcado. A fita tinha **4 linhas** e o `estado.json`, **3 testes** |
| 7.6 | os quatro desenhos | colorways `['cosmic-red','starlight-blue','nova-pink','midnight-black']`; transporte **USB/USB/BT/BT** no cartão; os quatro modelos escritos; lâmpadas acesas **`['3','24','135','1245']`** — o padrão canônico do produto, lido de `monta.PADRAO_JOGADOR`, não digitado |
| 7.8 | o índice | **12 seções** com contador (`O ROTEIRO — A ACEITAÇÃO DO PRODUTO — 1 DE 21`…), **148 linhas**, e o número 1 levou a `#roteiro-01` |

E o endereço saiu mascarado **nas duas camadas**: `AA:BB:CC:00:00:01` na tela e
na fita, com **zero** ocorrências do endereço cru (`AA:BB:CC:D1:E1:01`) em
qualquer das duas.

### A RÉGUA QUE IMPEDE A CURA PREGUIÇOSA — e ela vem primeiro no arquivo

Quatro das provas acima conferem **ausência** (`0 svg`, `0 pedidos`, `0
arquivos`) ou um punhado de elementos. **Uma página que não renderizasse nada
passaria em todas elas.** Por isso a primeira régua do arquivo novo é um PISO DE
CONTEÚDO, com a mordida no mesmo teste — a página vazia é medida pela **mesma
função**, porque duas cópias mediriam coisas diferentes.

| o que se conta | medido | piso |
| --- | --- | --- |
| elementos no DOM | 2.041 | 400 |
| testes em `__TESTES__` | 148 | 140 |
| palavras na tela | 2.651 | 200 |
| formas nos quatro desenhos | 212 | 200 |
| regras `data-colorway` na folha | 252 | 28 |
| linhas do índice | 148 | 140 |

Medido: `<html><body></body></html>` reprova nos **seis de seis**.

### O DEFEITO QUE A PROVA ACHOU — e ele era um VERDE SOBRE NADA

`veredito()`, a função que decide a cor de cada linha do índice:

```
ANTES:  veredito({P1..P4: "nada"})  ->  "obedeceu"
DEPOIS: veredito({P1..P4: "nada"})  ->  "falhou"
```

**Os quatro controles disseram *"nada aconteceu"* e o índice pintava a linha de
VERDE.** A regra era `all(v in ("obedeceu", "nada"))`, e um conjunto só de
`nada` a satisfaz. O índice é o instrumento que ela lê para saber o que ainda
falta medir: dar verde à linha em que o gesto não produziu efeito em controle
NENHUM é a leitura errada que uma mesa de medição não pode produzir. Uma
resposta só (`{"P1": "nada"}`) dava verde do mesmo jeito.

**E `falhou` era INALCANÇÁVEL.** A docstring nomeia quatro estados, o CSS tem
`.e-falhou` e o JS tem o ramo que a escolhe — e **nenhum caminho da função
jamais o devolvia**. Uma paleta com quatro cores para três estados é o
instrumento afirmando uma medida que ele não faz.

A cura **não julga papel**, que é a decisão do construtor e continua de pé:
`obedeceu` passou a exigir que **ao menos um** controle tenha obedecido; nenhum
obedeceu e ninguém viu coisa estranha = `falhou`. Os quatro casos que o teste do
construtor já cobrava continuam idênticos. Medido na TELA, e não só na função: a
linha do teste com os quatro em `nada` aparece no índice como
`falhou` / `class="e-falhou"`.

Duas réguas nasceram com ela, e as duas mordem:
`test_mordida_os_quatro_disseram_nada_e_o_indice_dizia_obedeceu` e
`test_todo_estado_que_o_indice_pinta_e_alcancavel`, que compara os estados do JS
com os que a função consegue devolver — é ela que teria pego o `falhou` órfão no
dia em que ele nasceu.

### As seis mordidas do arquivo novo

Arranquei cada cura, vi a régua reprovar e devolvi byte a byte (`md5
48fafadba9` nos seis antes e depois):

| arranquei | reprovou |
| --- | --- |
| `if (tempo === 3) desenhar()` → `desenhar()` sempre | `…nada_acontece_antes_do_iniciar…` |
| o `resta -= 1` do tique | `…o_timer_desce…` |
| o `os.replace(tmp, self.estado)` | `…sobrevive_ao_servidor_morrer…` |
| `jogador=lampada` → `jogador=1` nos quatro | `…a_lampada_do_padrao_do_produto` |
| a cura do veredito (a regra velha de volta) | `…os_quatro_disseram_nada…` |
| a recusa do COMO | `…a_recusa_do_como_nao_deixa_rastro_no_disco` |

### O que a prova NÃO alcançou

**1. O daemon vivo continua sem prova, e o buraco é o mesmo que o construtor
declarou.** `systemctl --user is-active hefesto-dualsense4unix` = `inactive`
durante toda a prova, e **eu não iniciei o daemon dela — não é ato meu**. Os
quatro cartões foram medidos pela porta declarada da régua
(`MESA_DE_MEDICAO_MESA_DE_MENTIRA`), com endereço FICTÍCIO (OUI `AA:BB:CC`). O
que continua sem prova é o nome das chaves de `daemon.state_full` e o casamento
`modelo` → `colorway` pelo nome de fábrica. **A primeira coisa a fazer quando o
daemon dela subir é abrir a página e conferir os quatro cartões.**

**2. Nenhum controle na mesa.** Nada nesta prova tocou hardware, e nada
escreveu um byte em aparelho nenhum.

**3. A tela dela.** Não abri o `validar.sh` sem `--sem-abrir`. As três fotos
são do Chrome headless:

* `A-VALIDACAO-DOS-QUATRO-01-prova-01-antes-do-iniciar.png` — o TEMPO 1, inerte;
* `A-VALIDACAO-DOS-QUATRO-01-prova-02-durante-o-timer.png` — o TEMPO 2, contando;
* `A-VALIDACAO-DOS-QUATRO-01-prova-03-depois-do-registro.png` — o TEMPO 3, com
  os quatro modelos, as lâmpadas e o COMO preenchido.

### O que sobrou, e a primeira é uma PERGUNTA PARA ELA

**1. O realce acende na peça certa, mas quase não se distingue da vizinha no
MESMO desenho — e a cor tem dono, então eu não a escolhi.** Medido no
`getComputedStyle`, a razão de contraste entre a peça marcada e a zona de
plástico ao lado dela:

```
P1  Cosmic Red       marcada rgb(124,133,152)  vizinha rgb(174, 51, 90)   1,66:1
P2  Starlight Blue   marcada rgb(124,133,152)  vizinha rgb(126,184,212)   1,71:1
P3  Nova Pink        marcada rgb(255,121,198)  vizinha rgb(227, 91,140)   1,43:1
P4  Midnight Black   marcada rgb(124,133,152)  vizinha rgb( 96, 96, 98)   1,69:1
```

O que o desenho separa BEM é o papel — entre desenhos, `--reage` contra
`--calado` são cores francamente diferentes, e a §7.7 mede isso. O que ele
separa MAL é **qual peça acendeu dentro de um controle**, que é a leitura que
ela vai fazer com o plástico na mão: o pior caso é o Nova Pink, com o realce
rosa sobre plástico rosa. Não curei porque a tinta tem dono
(`monta.REALCE_PADRAO` e as `--reage`/`--calado`/`--observa` do CSS da página), e
uma cor digitada por mim seria a decisão cravada que esta casa proíbe. **A cura
que não escolhe cor existe** — um contorno de espessura, que é independente de
matiz —, e cabe numa linha da `folha_de_realce`. É pergunta dela.

**2. `SEGUNDOS_LONGO` descreve um comportamento que a página não tem.** A
docstring diz *"o teto do que a página conta sozinha. Acima disto ela mostra o
alvo e um botão de 'já passou'"* — mas a constante só é usada como
`min(segundos, SEGUNDOS_LONGO * 20)`, e a página conta os 1200 s da linha 10 de
segundo em segundo, como conta os 5. O botão "já passou" está sempre lá, em todo
teste. Não é defeito de comportamento; é uma frase que descreve outro. Medido:
os tempos da mesa são `[5, 20, 240, 1200]` e o teto real é 2400.

**3. Os dois portões vermelhos: MEDIDOS na base, e a medição que falta está
feita — mas a linha não é minha para reescrever.**

**Placar do fecho: 43 de 45 verdes.** Os dois que sobram são
`paridade-gtk-html` e `donos-de-comportamento`, e eu não os herdei de boato:
abri uma árvore descartável em `ae1c3d82` — a ponta de `onda/atual-0609`, antes
da primeira linha desta frente — e rodei os dois scripts lá.

```
ae1c3d82 (base, árvore limpa):
  check_paridade_gtk_html.py        rc=1   divida-fechada em :315 e :343
  check_donos_de_comportamento.py   rc=1   VERMELHO em donos-de-comportamento.csv:47
```

**Os mesmos três achados, byte a byte.** E `git diff ae1c3d82 --name-only`
mostra que esta branch não tocou `paridade-gtk-html.csv`, nem
`donos-de-comportamento.csv`, nem `a09_sistema.py`.

**O QUE OS TRÊS PEDEM É UMA MEDIÇÃO, E EU A FIZ** — o portão diz *"meça-a de
novo e reescreva-a"*, e a metade de medir não custa posse de arquivo nenhum:

| a linha | o que ela afirma | o que eu MEDI no código de hoje |
| --- | --- | --- |
| `paridade-gtk-html.csv:315` "Corrigir modo de execução" — `FALTA_NO_HTML`, `html_faz` = *"Nada. Não existe o botão nem o gesto em página nenhuma"* | que o lado HTML não tem o ato | **tem.** `@gesto("09-sistema.html", "corrigir-modo", grava="_systemctl")` em `a09_sistema.py:2472`, com os três tempos da janela antiga: `_read_daemon_pid` → `_o_avulso_saiu` (que consulta o `is_alive` do produto e espera `SEGUNDOS_ATE_O_AVULSO_SAIR`) → `ativar_o_servico` |
| `paridade-gtk-html.csv:343` "Restaurar de fábrica" — `FALTA_NO_HTML`, `html_faz` = *"NÃO TEM DONO… o clique cai em `gesto_da_pagina() -> None`"* | que o gesto não tem motor | **tem.** `@gesto("09-sistema.html", "restaurar-de-fabrica", grava="gravar_e_reaplicar")` em `a09_sistema.py:2580`: chama `_rodape._meu_perfil_asset()`, valida o `Profile`, e grava por `perfil.gravar_e_reaplicar`. E `a09_sistema.SEM_MOTOR` está **VAZIO desde 06/09** — o comentário lá dentro registra o número indo de 5 → 3 → 1 → 0 em quatro dias |
| `donos-de-comportamento.csv:47` `migrar_para_systemd` marcado `SO-GTK` | que só a janela faz isto | **a janela saiu do disco nesta leva** (`GTK-3`, `D-0609-GTK-LEVA-INTEIRA`) e o ato mora na tela nova, no endereço acima |

**E POR QUE EU NÃO REESCREVI AS LINHAS, que é a parte que importa.** Duas
razões, e a segunda é a que decide:

1. **a troca do `sinal` é uma armadilha conhecida, e esta linha já caiu nela
   duas vezes.** O `porque` das duas linhas registra que elas foram promovidas
   a `DIFERENTE` em 03/09 porque o símbolo *"apareceu no lado HTML"* — e
   aparecia **dentro de um docstring**. Hoje é a mesma forma:
   `on_daemon_migrate_to_systemd` está em `a09_sistema.py:2442` e `:2480`, nos
   dois casos em PROSA, não em ato. A reescrita certa troca o `sinal` por
   `corrigir_modo` / `restaurar_de_fabrica`, que são funções com corpo — e o
   próprio portão avisa *"não troque o sinal por outro que só passe"*, o que faz
   dessa troca uma decisão de quem tem posse, não uma correção mecânica;
2. **`paridade-gtk-html.csv` tem DONO nesta leva, e não sou eu.** As árvores
   `voo/PARIDADE-CRUZA-O-MAPA-01-opus` e
   `voo/PARIDADE-REMEDIR-01-F-PARIDADE-REMEDIR-01` estão em voo sobre esse
   arquivo, e `a09_sistema.py` é de `voo/SISTEMA-OS-QUATRO-QUE-FALTAM-01-opus`.
   A leva é dividida POR POSSE DE ARQUIVO justamente para não haver conflito;
   editar o CSV daqui criaria o conflito que o desenho da onda evita. Some-se a
   isso que a `regra 8` do portão exige regerar a tabela publicada — o número de
   paridade da 09-sistema e o `TODAS` mudam junto —, e o custo de fazer isso
   sem posse é uma segunda verdade sobre a porcentagem que a casa publica.

**Para quem tem a posse: a medição acima é a entrega.** Reescrever as três
linhas com esses endereços é trabalho de minutos, e nenhum deles é remedir.
