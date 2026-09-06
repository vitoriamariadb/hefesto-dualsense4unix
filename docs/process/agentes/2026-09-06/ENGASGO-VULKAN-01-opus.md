# ENGASGO-VULKAN-01 — o P: a régua do botão apontava para um arquivo que a GTK-3 apagou

**Agente:** opus · **Data:** 06/09/2026 · **Árvore:**
`hefesto-voo/ENGASGO-VULKAN-01-opus`, branch `voo/ENGASGO-VULKAN-01-opus`,
nascida de `onda/atual-0609` em `c15d2e3e` (conferido: `git log -1` da árvore ==
`git rev-parse onda/atual-0609`).

**A ROTA CORRIGIDA venceu o corpo da sprint, e é ela que descreve o trabalho
inteiro.** O motor desta sprint está na árvore desde `3a970dc6` (23/08):
`integrations/camadas_vulkan.py`, o gancho em `assets/hefesto-launch.sh`, o
passo 4b-3 do `install.sh`. Nada disso foi tocado — os dois primeiros estão no
`nao_toca:` do frontmatter, e a posse desta sprint são **dois arquivos de
teste**.

## O que mudou

Um arquivo, e ele é da posse: `tests/unit/test_o_botao_que_tira_o_que_faz_engasgar.py`.

**O defeito, medido antes de tocar em nada:**

```
FAILED tests/unit/test_o_botao_que_tira_o_que_faz_engasgar.py::test_o_handler_esta_no_mapa_da_janela
E  FileNotFoundError: [Errno 2] Arquivo ou diretório inexistente:
   '.../src/hefesto_dualsense4unix/app/app.py'
1 failed, 16 passed in 0.57s
```

A régua lia o mapa de handlers da janela GTK e cobrava a linha
`"on_camadas_engasgo": self.on_camadas_engasgo,`. A `GTK-3`
(`D-0609-GTK-LEVA-INTEIRA`) apagou `app/app.py` com a janela inteira, e a régua
passou a reprovar por **ausência do instrumento**, não do produto.

O clique de hoje entra por `data-gesto="procurar-camadas"` em
`interface/paginas/09-sistema.html:1381` e sai no
`@gesto("09-sistema.html", "procurar-camadas", grava="curar_todos")` de
`interface/pacotes/a09_sistema.py:2635`. **Um nó virou três, porque a fiação de
hoje tem três elos e cada um cai sozinho:**

| nó novo | o elo que ele cobra |
| --- | --- |
| `test_o_botao_existe_na_pagina_que_o_produto_serve` | a página que o `WebView` carrega tem o endereço, o rótulo dela e a dica |
| `test_o_handler_esta_registrado_no_dono_de_hoje` | o `@gesto(...)` está ESCRITO no dono — lido por `ast`, não por texto |
| `test_o_registro_vivo_entrega_o_clique_a_esse_handler` | o decorador RODOU: `gesto_da_pagina` devolve aquela função, daquele módulo |

O helper `_registros_de_gesto()` anda pela árvore com `ast` e devolve
`(página, nome) → nome da função`, aceitando `gesto(...)` e `pacotes.gesto(...)`.

**Por que `ast` e não `in fonte`, e a prova está na mordida A abaixo:** com o
decorador APAGADO, `grep -c '"procurar-camadas"' a09_sistema.py` ainda responde
**2** — a literal sobrevive num comentário do arquivo e na chamada
`_confirmado(o, "procurar-camadas")`. Uma régua de texto teria ficado VERDE com
o botão morto. É a cicatriz que esta própria sprint registrou em 23/08, quando
`test_o_install_materializa_o_curador_sem_flag` passava com o bloco inteiro
trancado atrás de um `if false`.

`ROTULO` voltou a trabalhar: a constante estava no arquivo desde 05/09 (palavra
dela) e **nenhum teste desta casa a usava** — grep por
`"Tirar a sobreposição Vulkan"` em `tests/` só achava o docstring. Agora ela é
cobrada contra a página servida. O rótulo continua nascendo no gerador
(`interface/aba09.py:1150`); o teste só cobra que os dois digam a mesma palavra.

Mais uma nota de dez linhas acima da classe `TestWorker`, dizendo que aquela
seção **não mede o caminho vivo** (ver "o que sobrou").

## Qual mordida prova

Quatro, cada uma arrancada no produto, rodada, e devolvida com
`git checkout --` no mesmo comando. Verde de partida: **19 passed**.

| # | cura arrancada | reprovou |
| --- | --- | --- |
| A | a linha `@gesto("09-sistema.html", "procurar-camadas", …)` de `a09_sistema.py:2635` | **2** — `test_o_handler_esta_registrado_no_dono_de_hoje` e `test_o_registro_vivo_entrega_o_clique_a_esse_handler` (`2 failed, 17 passed`) |
| B | o `data-gesto="procurar-camadas"` do `<button>` da página 09 | **1** — `test_o_botao_existe_na_pagina_que_o_produto_serve` (`1 failed, 18 passed`) |
| C | o rótulo do botão trocado para `Procurar sobreposição de novo` | **1**, na outra metade do mesmo nó: *"o botão de `procurar-camadas` não diz mais 'Tirar a sobreposição Vulkan'"* (`1 failed, 18 passed`) |
| D | o `a09_sistema` fora do carregador (glob `a0[0-8]_*.py` + a linha do import explícito) — o decorador continua ESCRITO e não roda | **1** — só `test_o_registro_vivo_entrega_o_clique_a_esse_handler`: *"`gesto_da_pagina('09-sistema.html', 'procurar-camadas')` devolveu None"* (`1 failed, 18 passed`) |

**A mordida D é a que justifica o terceiro nó existir**, e ela é a que eu tinha
mais chance de não conseguir: com a árvore dizendo a verdade e o registro vazio,
o nó de `ast` fica VERDE e só o do registro vivo cai. Os dois medem coisas
diferentes — "está escrito no dono" e "o carregador alcança o dono" — e a
segunda é a que separa botão ligado de botão desenhado.

Depois de devolver as quatro, o escopo inteiro:

```
tests/unit/test_o_botao_que_tira_o_que_faz_engasgar.py
tests/unit/test_a_cura_do_engasgo_alcanca_todos_os_prefixos.py
tests/unit/test_a_cura_do_engasgo_nunca_mira_o_driver_do_wine.py
tests/unit/test_a_cura_do_engasgo_nao_contamina_a_chave_vizinha.py
tests/unit/test_a_cura_reconhece_o_prefixo_que_ela_desligou_a_mao.py
tests/unit/test_a_09_sistema_fecha_a_paridade.py
tests/unit/test_a_09_sistema_sai_do_desenho.py
→ 135 passed in 2.19s
```

**Os portões: TODOS VERDES — 45 portões** (`bash scripts/portoes.sh`, saída em
`/tmp/portoes-ENGASGO-VULKAN-01.txt`). A primeira volta deu **um vermelho, e ele
era meu**: `acentuacao` pegou `paginas` na linha do caminho do disco. É nome de
PASTA, não palavra de texto — curado com o `noqa-acento` que as outras réguas
desta casa já usam para o mesmo caminho, e não trocando a letra, que quebraria o
`read_text`. Segunda volta: verde nos 45.

## O que NÃO verifiquei

- **Nada de aparelho, e nenhuma célula do mapa.** Esta sprint não toca canal de
  controle nenhum: ela mexe no registro de prefixo Wine e na fiação de um botão
  de tela. Varri `docs/data/mapa-controles.csv` (309 linhas, coluna `chave`)
  por `vulkan`, `engasg`, `sobrepos`, `camada`, `proton` e `steam` — **nenhuma
  chave cobre este território**. Logo `mediu` volta vazio: não é célula
  atrasada, é assunto fora do DNA do aparelho.
- **Não chamei `scripts/bancada.sh exigir`**, e não precisei: `bancada: false`
  no frontmatter, e nenhum caminho meu para o daemon, o `hidraw` ou o
  `systemctl`. A bancada continua LIVRE por mim.
- **Não abri janela nenhuma.** Sem foto, sem clique de tela, sem
  `controles_vivos.py`: eu não mudei um pixel — o `<button>`, o rótulo e a dica
  já estavam na página, e o meu trabalho foi a régua que os cobra. A prova de
  que o clique chega ao handler foi feita pelo registro do produto
  (`gesto_da_pagina`), que é o mesmo objeto que o piloto consulta.
- **Não rodei a suíte inteira** (é de quem coordena, e ela cria nós `uinput`).
- **Não medi o A/B do Sackboy**, que continua o item 1 do "o que ficou aberto"
  da sprint e é dela: os dois manifestos do Epic seguem renomeados à mão no
  prefixo dela, e um A/B honesto é a mesma fase do jogo duas vezes.
- **Não conferi o `hefesto-launch.sh` rodando de verdade** nesta sessão — quem
  o faz é `test_a_cura_do_engasgo_alcanca_todos_os_prefixos.py`, que passou
  (14 nós) sem eu tocar nele.

## O que sobrou para o próximo

1. **`emulation_actions.on_camadas_engasgo` é órfã, e a régua dela não sabe.**
   Medido: os únicos chamadores de `on_camadas_engasgo` eram o
   `btn_camadas_engasgo` do glade e a linha do mapa de `app/app.py` — os dois
   fora do disco desde a `GTK-3`. Hoje `on_camadas_engasgo`
   (`emulation_actions.py:2125`) e `_camadas_worker` (`:2211`) não têm chamador
   de produto; quem age é `a09_sistema.procurar_camadas`, chamando
   `camadas_vulkan.curar_todos` direto e com o SEU próprio portão de jogo
   aberto. A classe `TestWorker` deste arquivo (4 nós) portanto mede um caminho
   morto — deixei os nós de pé, porque as duas frases puras e o dublê ainda são
   de `emulation_actions`, e escrevi a nota acima da classe para ninguém ler
   aquele verde como prova do produto. **`emulation_actions.py` não é da posse
   desta sprint**, e apagar código de outro é como "a última a gravar vence".
   Quem tiver a posse decide entre remover a órfã ou fazer o gesto chamá-la.
2. **`gui/aba_sistema.py:89` ainda declara `on_camadas_engasgo` como dono de
   `procurar-camadas`** — a declaração envelheceu com o mesmo apagão. Arquivo de
   outra posse.
3. **`daemon_actions.py:478` ainda cita `btn_camadas_engasgo`**, um objeto de
   glade que não existe mais. Idem.
4. **Os três itens 2, 3 e 4 do "o que ficou aberto" da sprint continuam
   abertos** e nenhum é desta posse: o pacote (`.deb`/Arch/Fedora/flatpak) não
   materializa o `hefesto-camadas`; o `doctor.sh` não confere o curador; e o
   `wineserver` vivo pode desfazer a escrita (por desenho, idempotente).
5. **O A/B do Sackboy é dela** — `SPRINT_ORDER.md` §2.7 já diz isso, e a
   correção de 23/08 no topo da sprint deixa a hipótese com **evidência
   contrária**: a sessão SEM a camada foi pior em todas as réguas, e as duas
   rampam. O produto não promete cura do engasgo; promete dizer o que tirou — e
   o `title` do botão na página já está escrito assim (*"Já medimos tirar no
   jogo que engasgava e o engasgo continuou — não prometo que resolve"*).
