# A auditoria das dez ondas MIGRA — 01/09/2026

Ela perguntou: *"quais sprints foram concluídas com esse trampo que fizemos"*.
Dez agentes leram os dez índices e conferiram, sprint a sprint, contra o código
de hoje. Nenhum escreveu código; todos mediram.

## A resposta, e ela é dura

| onda | sprints | fechadas | parciais | abertas |
|---|---:|---:|---:|---:|
| MIGRA-CONEXOES | 12 | **0** | 9 | 3 |
| MIGRA-CONTROLES | 13 | **0** | 10 | 3 |
| MIGRA-GATILHOS | 11 | **0** | 5 | 6 |
| MIGRA-ILUMINACAO | 12 | **0** | 5 | 7 |
| MIGRA-JOGAR | 11 | **0** | 9 | 2 |
| MIGRA-LANCADORES | 10 | **0** | 1 | 9 |
| MIGRA-NAVEGACAO | 16 | **0** | 4 | 12 |
| MIGRA-PERFIS | 6 | **0** | 6 | 0 |
| MIGRA-SISTEMA | 11 | **0** | 8 | 3 |
| MIGRA-VIBRACAO | 8 | **0** | 4 | 4 |
| **TOTAL** | **110** | **0** | **61** | **49** |

**Zero de 110.** E a causa não é desleixo — é ROTA.

## A causa, na palavra do auditor da Conexões

> ZERO SPRINTS FECHARAM, E A CAUSA É ESTRUTURAL, NÃO DESLEIXO: o trabalho de
> 01/09 tomou uma ROTA DIFERENTE da que as doze especificam. As sprints
> endereçam `app/actions/config/pagina.py`, `gui/telas/08-conexoes.html` e  <!-- ref-externa: o arquivo NÃO existir é o assunto deste parágrafo -->
> `scripts/telas/aba08.py`; o que existe é `src/hefesto_dualsense4unix/interface/hefesto_vivo.py`  <!-- ref-externa: o arquivo NÃO existir é o assunto deste parágrafo -->
> + `src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py` + `layout/08-conexoes.html`.
> As três pastas que as sprints pressupõem NÃO EXISTEM. (…) Nove sprints
> avançaram em SUBSTÂNCIA; nenhuma fecha pelo próprio critério.

As dez ondas foram escritas em 29/08 para **enxertar o mockup dentro da janela
GTK que já existe**, na aba Configurações. O que foi construído em 01/09 é uma
**janela própria** — o `hefesto_vivo.py`, que o `./interface` abre.

**A aba Configurações do produto GTK está intocada**: `install_config_tab`
monta as mesmas cinco molduras de sempre.

## O que se repete nas 61 faltas

| quantas | o que falta |
|---:|---|
| 46 | o teste com o NOME que a sprint pede (`test_migra_<onda>_*`) |
| 5 | as páginas vivem em `layout/`, fora de `src/` — não entram no wheel nem no `install.sh` |
| 4 | o enxerto na aba Configurações (`config/pagina.py`) |  <!-- ref-externa: o arquivo NÃO existir é o assunto deste parágrafo -->
| 4 | as leituras duplicadas de `state_full` no GTK antigo |
| 3 | a `MESA` fixa do mockup ainda viva no gerador |

## A decisão que isto põe na mesa, e é dela

Há duas saídas, e nenhuma é técnica:

1. **Reescrever as dez ondas para a rota nova.** O `./interface` já abre o
   piloto das dez abas, e ela o aprovou em uso. As sprints passariam a
   endereçar `src/hefesto_dualsense4unix/interface/`, e o que hoje é 'parcial' viraria
   'fechada' pelo critério certo.
2. **Fazer o enxerto como as sprints pedem.** A janela GTK ganharia o WebView
   na aba Configurações, e as páginas mudariam para `src/gui/telas/`.  <!-- ref-externa: o arquivo NÃO existir é o assunto deste parágrafo -->

A segunda tem um argumento medido a favor: **as páginas em `layout/` não
entram no pacote instalável**. Quem instalar o Hefesto hoje não recebe a
interface nova — ela só existe nesta árvore.

## Os achados dos auditores

- MIGRA-CONEXOES: O ENUNCIADO DA TAREFA CARREGA UM NÚMERO ERRADO. O prompt diz '18 sprints distintas' no índice. O índice diz DOZE, com todas as letras — `docs/process/sprints/2026-08-29-MIGRA-CONEXOES-INDICE.md` tem a seção '## Por que DOZE, e não as onze do censo' e a tabela '## As doze'. E `ls docs/process/sprints/*MIGRA-CONEXOES*` devolve 13 arquivos: as doze mais o índice. Auditei as doze. (O índice prevê que a onda VIRE catorze se ela escolher a Forma B da sprint 12 — talvez seja daí a confusão, mas 14 também não é 18.)
- MIGRA-CONEXOES: ZERO SPRINTS FECHARAM, E A CAUSA É ESTRUTURAL, NÃO DESLEIXO: o trabalho de 01/09 tomou uma ROTA DIFERENTE da que as doze especificam. As sprints endereçam `src/hefesto_dualsense4unix/app/actions/config/pagina.py`, `src/.../gui/telas/08-conexoes.html` e `scripts/telas/aba08.py`; o que existe é `src/hefesto_dualsense4unix/interface/hefesto_vivo.py` + `src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py` + `layout/08-conexoes.html`. As três pastas que as sprints pressupõem (`gui/telas/`, `scripts/telas/`, e o `pagina.py`) NÃO EXISTEM. Nenhum dos doze arquivos de `cria:` foi criado: `ls tests/unit/ | grep migra_conexoes` → nenhum. Nove sprints avançaram em SUBSTÂNCIA; nenhuma fecha pelo próprio critério. Quem for subir versão sobre isto precisa saber que a aba Configurações do produto GTK está INTOCADA — `install_config_tab` monta as mesmas cinco molduras de sempre.  <!-- ref-externa: o arquivo NÃO existir é o assunto deste parágrafo -->
- MIGRA-CONEXOES: A MORDIDA DA SPRINT 02 REPROVARIA O PRODUTO DE HOJE, E MESMO ASSIM O DEFEITO NÃO EXISTE. A sprint exige 'zero `<a class="aba" href="0`' porque duas tiras apareceriam (a do `Gtk.Notebook` em cima, a do HTML dentro). Medido: os NOVE `href` continuam lá. Mas o piloto único NÃO TEM `Gtk.Notebook` — é UM WebView só, e a navegação entre as dez abas é justamente esses `href`, com o despachante descobrindo a aba pelo nome do arquivo à vista (`hefesto_vivo.py:14-17` e `_pagina_da_uri:372`). Quem executar a 02 ao pé da letra hoje QUEBRA a navegação da interface nova. A sprint precisa ser reescrita antes de correr.
- MIGRA-CONEXOES: O ENDEREÇO POR POSIÇÃO VOLTOU, E A SPRINT 03 O PROIBIA COM TODAS AS LETRAS. Ela diz: 'a chave do controle é o `uniq`, NUNCA o `p1`/`p2` do mockup — um endereço por posição volta a ser o jogador 3 fantasma', e a mordida é 'nenhum `data-v` nem `data-g` casa com `^p[0-9]`'. Medido no HTML publicado: `data-controle="p1"` e `data-controle="p2"`, mais `data-v="0".."4"` endereçando as linhas do exame e os blocos de vizinho. O piloto traduz `uniq→pref` (`hefesto_vivo.py:20-28`) e o pacote confere a faixa (`a08_conexoes._slot:755-773`), então não há clique no alvo errado — mas o DOM é posicional, e a sprint 03 e a 05 reprovam isso por escrito. É uma decisão que alguém tomou sem desfazer a proibição.
- MIGRA-CONEXOES: AS SPRINTS 09 E 12 SE CONTRADIZEM SOBRE AS DUAS PERGUNTAS DA SALA, E O PRODUTO SEGUIU UMA TERCEIRA VIA. A 09 diz: 'As duas perguntas da sala NÃO estão aqui... quem as move é a MIGRA-CONEXOES-12. Entre a saída daqui e a chegada lá elas não estão em tela nenhuma: buraco declarado.' A 12 diz que elas mudam de casa E DE CHAVE. O trabalho de 01/09 fez metade: pôs as duas na tela-nova `#mapear-entradas` e as ligou, mas gravando na chave ANTIGA (`mesa`), e sem tirá-las de `secao_mesa.py:583`. Resultado: as perguntas existem agora em DOIS lugares, na mesma chave. Não é buraco — é duplicata.
- MIGRA-CONEXOES: UM DOS TRÊS DEFEITOS DA SPRINT 12 JÁ ESTAVA CURADO ANTES DE ELA SER ESCRITA. Ela afirma: 'A ordem da confissão é SORTEADA. As lacunas vivem num `set`... É defeito, e é de uma linha.' Medido: `Bancada.lacunas` é `tuple[str, ...]` (`src/.../integrations/mapa_das_portas.py:466`) e é construída como `lacunas=tuple(sorted(lacunas))` (`:583`); `confissao_do_desenho` itera essa tupla (`app/widgets/mapa_da_mesa.py:404-407`). `git blame` da linha 583 devolve `0b815161e [REDACTED] 2026-08-26` — três dias ANTES de a sprint ser escrita. Quem executar a 12 vai procurar um defeito que não está lá. (Os outros dois — a janela sem `ScrolledWindow` e os dois `TITULO_DA_JANELA` divergentes — conferi e continuam reais.)
- MIGRA-CONEXOES: DOIS NÚMEROS DO ENUNCIADO DA 09 CADUCARAM, E UM DELES POR DECISÃO DELA. A sprint diz '16 `<select>` no miolo — 12 nas linhas dos controles e 4 nos rádios vizinhos', e pede `data-g="adaptador.renomear"`. Medido hoje, contando TAGS fora de comentário: 13 `<select>` no arquivo, 10 no corpo com gesto (4 vizinho-o-que-e, 2 mic-existe, 2 mic-escopo, 2 teto-da-vibracao). E o Renomear deixou de ser botão por palavra dela em 31/08 — `src/hefesto_dualsense4unix/interface/aba08.py:1157`: 'O RENOMEAR DEIXOU DE SER BOTÃO — 31/08/2026: tirar o botão Renomear'. O entregável da sprint virou pergunta, não dívida.
- MIGRA-CONEXOES: O ÓRFÃO MAIS CARO DESTA ABA É A LINHA DO CONTROLE. `HEFESTO_VARIANTE=dev .venv/bin/python src/hefesto_dualsense4unix/interface/casamento.py 08-conexoes.html` devolve `html 9 · pac 14 · casam 8 · órfãos 6 · vazios 1`, e os órfãos são `['achados','bateria','fragil','graves','ponte','via']`. Ou seja: o pacote JÁ CALCULA transporte, bateria, ponte confirmada e fragilidade de cada controle, e a página não tem um `data-campo` onde pôr. O acordeão desta aba — que é o que ela olha para saber quem está no cabo e quem está no rádio — continua mostrando o dado do mockup. Isso é dinheiro no chão: são quatro valores prontos esperando um atributo no gerador.
- MIGRA-CONEXOES: O `data-campo="exame"` É VAZIO POR CONSTRUÇÃO, E NINGUÉM ACUSOU. O pacote emite `exame` como lista de DICIONÁRIOS (`a08_conexoes.py:439`), e `normalizar` descarta lista de dicionários de propósito (`pacotes/__init__.py:241-247`: 'escrever `[object Object]` numa caixa é pior que nada'). Os 5 `<div class="exame" data-campo="exame">` do HTML nunca recebem nada — o casamento os lista em `vazios`. Não é defeito de dado (o selo e o achado casam), mas é um endereço que existe e não serve para nada, e o `test_o_casamento_das_dez` passa mesmo assim.
- MIGRA-CONEXOES: O EXAME MOSTRA TRÊS LINHAS E APAGA DUAS ATÉ ELA CLICAR. No tique só rodam três das cinco conferências (`a08_conexoes._conferencias:262`), porque `pareamentos` forka `busctl` com teto de 5 s. O piloto distribui a lista pelos 5 elementos e escreve `''` nos que sobram (`hefesto_vivo.py:152`). Logo, ao abrir a aba, a 4ª e a 5ª linha do Check-up ficam EM BRANCO — sem selo e sem frase — até ela apertar 'Examinar Portas'. É honesto (melhor que mostrar o texto do mockup), mas é um estado que o desenho aprovado não prevê e que ela não viu. Vale a foto antes de fechar.
- MIGRA-CONTROLES: O ENUNCIADO DESTA AUDITORIA DIZ 18 SPRINTS; O ÍNDICE DIZ TREZE. `docs/process/sprints/2026-08-29-MIGRA-CONTROLES-INDICE.md` tem a seção 'As treze', com tabela de 13 linhas, e `ls docs/process/sprints/*MIGRA-CONTROLES*` devolve 13 arquivos + o índice. Não existe `MIGRA-CONTROLES-14..18`. Auditei 13.
- MIGRA-CONTROLES: A ONDA MUDOU DE ENDEREÇO E O ÍNDICE NÃO SABE. Nenhum dos caminhos que as 13 sprints declaram em `cria:` existe: `gui/webview_de_aba.py`, `gui/telas/`, `scripts/telas/` (aba02.py, monta.py, topo.html, fim.html, regua_que_clica.py), `app/actions/controles_web.py`, `scripts/check_a_pagina_e_a_do_gerador.py`, `scripts/check_a_tela_nao_promete_o_que_o_mapa_nega.py` e nenhum dos 11 `tests/unit/test_migra_controles_*.py`. O que existe é `layout/` + `src/hefesto_dualsense4unix/interface/pacotes/`. Isso é grave FORA desta onda: `MIGRA-SISTEMA-01`, `MIGRA-CONEXOES-01`, `MIGRA-LANCADORES-01` e `-02` declaram `depois_de: MIGRA-MOLDURA-01` esperando `gui/telas/` e `scripts/telas/` — e o índice já avisava que 'inventar um id no meio do caminho cria referência falsa'. A reconciliação continua por fazer, e agora com os caminhos também divergindo.  <!-- ref-externa: o arquivo NÃO existir é o assunto deste parágrafo -->
- MIGRA-CONTROLES: O RECIBO NÃO CHEGA À TELA, E A DOCSTRING AFIRMA QUE CHEGA. `hefesto_vivo.py:490-497` diz 'ele despacha o que tem DONO no daemon e RECUSA o resto **com o motivo na tela**'. O código só imprime no terminal: `:503-504` (`[gesto sem dono]`, stdout), `:520-528` (`[gesto falhou]`, stderr), `:539` (`[gesto] … → aplicado`, stdout). O único Python→página é `:701`, `window.__hef.pintar(...)`. Clicar 'Todo o som do PC' levanta e a tela não diz nada. Três sprints desta onda (03, 08, 11) pedem o recibo pelo nome, citando a `LIGHTBAR-BT-RESET-01` — 330 mil escritas ignoradas com a barra apagada. A repintura de 10 Hz mascara isso nos campos pintados; nos NÃO pintados (rota, mic-modo) não mascara nada.
- MIGRA-CONTROLES: `touch-estado` É UM LITERAL. `src/hefesto_dualsense4unix/interface/pacotes/a02_controles.py:77` emite `"touch-estado": "Sem toque"` — constante, sem fonte. Ele CASA no `casamento.py` e entra na conta de 'pintados', então a régua o conta como valor vivo. É a tela afirmando sem medir, dentro do instrumento que existe para medir.
