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
