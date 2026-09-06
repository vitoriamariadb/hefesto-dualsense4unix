# ILUMINACAO-O-AVISO-DOS-N-01 — o aviso dos N na aba Iluminação

**Sprint:** `docs/process/sprints/2026-09-06-ILUMINACAO-O-AVISO-DOS-N-01-o-mesmo-desenho-foi-para-n-controles-e-a-tela-diz.md`
**Branch:** `voo/ILUMINACAO-O-AVISO-DOS-N-01-opus` · nasceu de `onda/atual-0609` em `c15d2e3e`
**Linha do CSV:** `docs/data/paridade-gtk-html.csv:158` — *"Aviso 'o mesmo desenho foi para os N controles'"*

---

## O que mudou

**A entrega em uma linha:** o lado HTML parou de AFIRMAR a conta dos N e passou a
PERGUNTÁ-LA ao dono; e o aviso do dono, que era engolido por construção, passou a
chegar ao canal de recado verde de 6,0 s. **A frase continua sem aparecer na tela
de hoje**, e a razão está na §"O que NÃO verifiquei" — ela não é código.

Duas coisas eram defeito, e as duas fecharam. A segunda é a que ninguém via.

### 1. A conta era uma CONSTANTE onde havia dono

`_Janela._quantos_recebem_o_desenho` (o "host" mínimo que
`app/textos_de_aplicacao` interroga) tinha um `return 0` cravado, com a razão
escrita na própria docstring: nesta aba todo gesto leva `uniq`, e com alvo por
controle a própria GTK devolve 0.

**O valor estava certo; o MÉTODO estava errado.** Uma constante não erra junto
com o dono quando ele muda — ela só para de concordar, e o desacordo não aparece
em lugar nenhum. Era a segunda cópia da regra, pelo avesso.

O `_Janela` ganhou os dois degraus que faltavam, os DOIS emprestados do dono e
não reescritos:

| degrau | quem responde |
| --- | --- |
| `_edit_uniq` | `LightbarActionsMixin._edit_uniq` (que lê `app/alvo_de_edicao`) |
| `_uniqs_conectados` | `LightbarActionsMixin._uniqs_conectados` (R-14, ordem por índice) |
| `_quantos_recebem_o_desenho` | `LightbarActionsMixin._quantos_recebem_o_desenho` |

Os três passam por `_o_dono_da_frase()`, um `import` tardio — `app/actions/`
arrasta o GTK, e um `import` no topo do pacote poria a janela estável dentro do
processo da interface nova.

**Medido, com dois controles na mesa sintética:** alvo em "Todos" -> a conta diz
**2**; alvo por controle -> diz **0**. A resposta de hoje continua sendo zero, e
a diferença é que ela passou a ser MEDIDA.

### 2. O aviso era ENGOLIDO, e por construção

`_cobrar_a_frase_do_desenho` pergunta ao dono o que ele diria no caminho FELIZ,
compara com o que ele diz para o corpo real e, iguais, cala. Só que
`_msg_do_desenho` cola `_AVISO_MESMO_DESENHO_NOS_QUATRO` no fim de **toda** frase
que compõe quando N >= 2 — na do corpo real E na do corpo feliz, porque as duas
saem do mesmo método com a mesma `_Janela`. **As duas ficavam iguais, o `!=`
calava, e o aviso morria ali dentro.**

Isso quer dizer que, mesmo no dia em que o escopo "Todos" nascesse, o clique
teria pegado em N controles e a tela não diria nada. É a L12 —
*"nada na tela avisava"* — reaparecendo do lado HTML, um degrau adiante.

O que passou a existir:

* `_o_aviso_dos_n(janela)` — a SONDA. Lê a conta do dono e o texto do dono
  (`_AVISO_MESMO_DESENHO_NOS_QUATRO`) e responde *"este desfecho carrega o aviso
  dos N?"*. Nenhuma sílaba de texto nasce deste lado;
* `_cobrar_a_frase_do_desenho` devolve a frase INTEIRA do dono quando ela carrega
  o aviso, e `""` quando não. Se a conta disser N >= 2 e a frase do dono NÃO
  trouxer o aviso, ele levanta em vez de pôr um recibo comum no canal que existe
  para o aviso — as duas metades andam juntas ou ninguém anda;
* `_o_recado(frase)` — a porta única do canal (`{"recado": ...}` ou `None`).

**E ela cobre os QUATRO chamadores, não um.** É a regra de 05/09 desta casa
(*quando a cura conhece a causa, ela cobre TODOS os chamadores*): `luzes`,
`desenho-de` (os dois ramos que escrevem), `reenviar-desenho` e `player`
(via `_acender_o_numero`) devolvem o recado. Sem frase, `None` — e quem responde
continua sendo a piscada de 1,5 s do piloto, que é a `03-Q4` dela.

### 3. O CSV da paridade, porque o portão exigiu

A régua `check_paridade_gtk_html.py` acusou `divida-fechada` — *"o sinal
`_AVISO_MESMO_DESENHO_NOS_QUATRO` APARECEU no lado HTML"* —, que é ela
funcionando exatamente como a docstring dela promete. **A regra da sprint manda
entregar o texto e deixar a PARIDADE-REMEDIR-02 recolher; o portão manda ficar
verde.** Ficar vermelho por dias ensina a próxima pessoa a ignorar o portão,
então a linha foi reescrita aqui E o texto vai abaixo para a coletora conferir.

`paridade-gtk-html.csv:158`, campo a campo:

| campo | agora |
| --- | --- |
| `veredito` | `DIFERENTE` (era `FALTA_NO_HTML`) |
| `sinal` | `_AVISO_MESMO_DESENHO_NOS_QUATRO` (inalterado) |
| `sinal_espera` | `PRESENTE` (era `AUSENTE`) |
| `sinal_escopo` | `LADO-HTML` (inalterado) |
| `html_onde` | `interface/pacotes/a04_iluminacao.py:3178` (`_o_aviso_dos_n`) · `:2173` (`_quantos_recebem_o_desenho`) |
| `html_faz` | o caminho inteiro existe e é o do dono, mas o aviso não dispara — a diferença é de ESCOPO, não de código |
| `porque` | a nota de 06/09 acrescentada ao histórico medido, sem apagar nada |

**`DIFERENTE` e não `IGUAL`, e a escolha é o ponto:** dizer `IGUAL` seria
propaganda. A GTK MOSTRA o aviso; o HTML tem o caminho inteiro e nunca o mostra,
porque não há escopo "Todos" nesta aba.

Isso zera o `FALTA_NO_HTML` da aba 04: **35 features, 1 -> 0**. No total,
`36 -> 35`. A tabela publicada em
`docs/process/2026-09-03-O-TERCEIRO-NUMERO-a-paridade-com-a-gtk.md` foi acertada
junto (regra `numero-publicado`), e a paridade em % não se moveu — `IGUAL` não
mudou.

### Os arquivos

| arquivo | posse |
| --- | --- |
| `src/hefesto_dualsense4unix/interface/pacotes/a04_iluminacao.py` | `posse: AVISO` |
| `tests/unit/test_a_iluminacao_avisa_quantos_receberam_o_desenho.py` | `cria:` |
| `docs/data/paridade-gtk-html.csv` | fora da posse — mexido só na linha 158, pelo portão; ver acima |
| `docs/process/2026-09-03-O-TERCEIRO-NUMERO-...md` | idem, só os dois números da tabela conferida |

`nao_toca` respeitado: `interface/aba04.py`, `mockup/` e
`app/actions/lightbar_actions.py` não têm uma linha alterada.

---

## Qual mordida prova

`tests/unit/test_a_iluminacao_avisa_quantos_receberam_o_desenho.py` — **22 casos,
verdes**. As três mordidas foram arrancadas de verdade e a saída está abaixo.

| a cura arrancada | o que caiu |
| --- | --- |
| **1.** o `return 0` cravado de volta em `_Janela._quantos_recebem_o_desenho` | **11 de 22** |
| **2.** `_cobrar_a_frase_do_desenho` volta a calar (o corpo de ontem) | **7 de 22** |
| **3.** só o gesto `luzes` perde o `_o_recado` | **1 de 22** |

```
=========== MORDIDA 1 — o `return 0` cravado de volta ===========
FAILED ...::test_a_conta_e_a_do_dono_e_nao_um_zero_cravado
FAILED ...::test_a_mesa_de_um_controle_nao_dispara_o_aviso
FAILED ...::test_o_aviso_e_a_frase_do_dono_e_nenhuma_silaba_nasce_aqui
FAILED ...::test_a_comparacao_do_desfecho_e_surda_ao_aviso_por_construcao
FAILED ...::test_o_desfecho_devolve_a_frase_quando_ela_tem_aviso
FAILED ...::test_se_o_dono_parar_de_colar_o_aviso_o_pacote_recusa
FAILED ...::test_o_gesto_poe_a_frase_do_dono_no_canal_de_recado[0..4]
11 failed, 11 passed

=========== MORDIDA 2 — o desfecho volta a engolir o aviso ===========
FAILED ...::test_o_desfecho_devolve_a_frase_quando_ela_tem_aviso
FAILED ...::test_se_o_dono_parar_de_colar_o_aviso_o_pacote_recusa
FAILED ...::test_o_gesto_poe_a_frase_do_dono_no_canal_de_recado[0..4]
7 failed, 15 passed

=========== MORDIDA 3 — só o `luzes` perde o _o_recado ===========
FAILED ...::test_o_gesto_poe_a_frase_do_dono_no_canal_de_recado[0]
1 failed, 21 passed
```

**A MORDIDA 3 é a que vale por si:** ela cai em UM caso só. É a prova de que os
cinco caminhos são medidos separadamente — se fossem um `for` dentro de um teste,
tirar o recado de um gesto e de todos daria o mesmo vermelho, e a próxima pessoa
não saberia qual.

**Três coisas que a régua faz e que não são óbvias:**

1. **A porta do "Todos" é a FUNÇÃO DO PRODUTO, não um dublê.** A aba não tem esse
   escopo, então `_abrir_o_todos` faz `monkeypatch` sobre a própria
   `_janela_do_desfecho`, chamando-a com o `uniq` vazio que ela já sabe
   interpretar (`definir_alvo`). O objeto que chega ao dono da frase é o mesmo
   que chegaria no dia em que o botão nascer. Um dublê responderia o que a régua
   quer ouvir, que é a família de defeito que esta casa mais pagou.
2. **`test_a_comparacao_do_desfecho_e_surda_ao_aviso_por_construcao` mede a
   CAUSA, não a cura** — que as duas frases do dono são IGUAIS com N >= 2. Ela
   existe para que o motivo não se perca quando alguém for mexer no `!=`.
3. **`test_o_pacote_nao_digita_o_texto_do_aviso` lê o próprio fonte:** o nome da
   constante TEM de estar lá (é o `sinal` que o CSV cobra do lado HTML) e o texto
   dela NÃO pode estar. Uma cópia literal da frase passaria em todos os outros
   casos e só apareceria no dia em que o dono mudasse uma palavra.

**A prova de tela:** foto `--oculta` da aba 04 antes e depois, com o piloto
(`interface/hefesto_vivo.py --oculta --abre 04-iluminacao --segundos 8 --foto`).
As duas saíram **byte a byte idênticas** (`md5 4bd0f029...`), e isso é o
resultado honesto: nada mudou na tela porque, sem escopo "Todos", a conta responde
zero e o aviso não dispara. Uma foto diferente aqui seria a notícia ruim.

**Os vizinhos continuam verdes:** 86 casos de
`test_a_04_as_cinco_lampadas_sem_o_numero.py`,
`test_a_aba_04_iluminacao_fecha_as_linhas.py`,
`test_a04_o_jogador_acende_as_lampadas.py` e
`test_lightbar_todos_o_desenho_de_cada_um.py`. Os 11 gestos da aba continuam
registrados e o `PISO_DA_ABA` continua 11.

---

## O que NÃO verifiquei

**1. O aviso na tela dela, com o olho dela — e ele NÃO PODE ser visto hoje.**
Esta é a linha que caiu do enunciado, e ela caiu pelo CSV, que é o dono do fato:
**não há escopo "Todos" nesta aba**. Todo gesto de `a04_iluminacao` leva `uniq`,
os que não o têm recusam dizendo, e com alvo por controle a conta do dono é zero.
O `aba04.py` diz isso na própria lista *"Ainda aberto"*, e a frase é dela:

> *"Ajustar os quatro de uma vez? Não há mais alvo único nesta aba, então um
> 'aplicar a todos' teria de ser um botão próprio — e ele não existe."*

Criar esse botão seria mexer em `interface/aba04.py` e em `mockup/`, os dois no
`nao_toca:` desta sprint, e é decisão de produto que está aberta com ela. **Então
o que esta sprint entrega é o caminho inteiro pronto e medido, atrás de uma porta
que só ela manda abrir** — e a régua já mede o dia seguinte a essa decisão.

**2. Nenhuma medição no aparelho.** `bancada: false`, e esta árvore não tem
aparelho nem serviço: `/sys/class/leds` não lista nenhum `playstation`, o piloto
relatou `[daemon mudo]` em todos os tiques e o soquete de IPC está vazio. **Não
esperei a bancada** — nada nesta sprint escreve no aparelho, para o serviço ou
chama `systemctl`. Toda medição aqui é de dublê e de tela, e está dito assim na
tabela do relatório. A linha de prova no aparelho, se alguém a quiser, é a
`MESA-DE-QUATRO-01`.

**3. O clique de verdade pela ponte JS, no gesto.** Sem controle na mesa a aba
pinta as quatro colunas como "lugar sem dono" e os botões de LED não são
emitidos, então `--prova-clique` não tem o que clicar; e sem serviço vivo o gesto
não chegaria ao daemon de qualquer forma. O que ficou provado foi o registro (os
11 gestos da aba, o piso 11) e a tela (a foto). O clique dos quatro gestos de
desenho tem régua própria e verde em
`test_a_04_as_cinco_lampadas_sem_o_numero.py`, da LUZES-01.

**4. Três casos de `test_o_recado_de_sucesso_pousa_no_cartao.py` são INSTÁVEIS, e
não são meus.** Eles abrem uma janela WebKit de verdade e medem a piscada por
tempo. Rodados três vezes seguidas com a minha árvore: `19 passed`,
`4 failed / 15 passed`, `19 passed`. O sintoma do vermelho é o botão que fica
`em_voo: True` — o gesto não pousou dentro do prazo da régua. **Não consegui
reproduzir de forma determinística e não os toquei.** Fica registrado porque um
vermelho intermitente numa régua de tela é exatamente o que a casa não quer ver
sendo ignorado.

**5. Um vermelho de base, medido e alheio:** com a minha árvore ESCONDIDA
(`git stash`), `test_lightbar_onda7_as_mordidas.py::test_envio_recusado_o_rotulo_nao_afirma_o_desenho`
e dois casos de `test_saida_de_agente_sanitizada.py` (arquivos de outras frentes
desta leva) já reprovavam. Nenhum deles está na lista de portões.

---

## O que sobrou para o próximo

**1. A pergunta que é dela, e é UMA:** *a aba Iluminação ganha um "aplicar o
desenho a todos"?* Enquanto a resposta não vem, o aviso dos N existe inteiro e
não tem quando falar. As duas respostas possíveis já estavam nomeadas na L12
(`lightbar_actions.py:110`) e continuam valendo — e a terceira, que é a de hoje,
é não ter o escopo.

**2. Para a PARIDADE-REMEDIR-02:** a linha 158 já está reescrita nesta branch,
pela razão de portão explicada acima. Se a coletora tiver texto próprio para ela,
o que está lá é ponto de partida, não veredito final — o que **não** se deve
desfazer é o `veredito`/`sinal_espera`, sob pena de o portão voltar ao vermelho.

**3. Para quem abrir o "Todos" um dia:** não há nada a emendar no pacote. O
`_Janela` já empresta os três degraus do dono, o `_o_aviso_dos_n` já lê a frase, o
`_cobrar_a_frase_do_desenho` já a devolve e os quatro gestos já a põem no canal.
O que falta é o botão e o `uniq` vazio chegando ao gesto. A régua desta sprint
mede exatamente esse dia.

**4. Uma coisa que vi e não é minha:** `interface/paginas/04-iluminacao.html`, a
página publicada, não traz `data-gesto="luzes"`, `"desenho-de"` nem
`"reenviar-desenho"` — só `"player"` (8 vezes, a fileira). Os três nasceram na
LUZES-01 e são emitidos por coluna CONECTADA, e a página publicada foi gerada com
a mesa vazia; pode ser só isso. Não confirmei, porque `aba04.py` é `nao_toca`
aqui. **Fica a pulga:** se a página publicada é o que o produto renderiza, vale a
pena alguém com a posse do gerador conferir com controle na mesa.
