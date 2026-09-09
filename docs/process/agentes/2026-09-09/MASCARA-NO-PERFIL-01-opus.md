# MASCARA-NO-PERFIL-01 — a máscara por controle entra no perfil

**Árvore:** `hefesto-voo/MASCARA-NO-PERFIL-01-opus` · branch
`voo/MASCARA-NO-PERFIL-01-opus` · base `e5f4b3da` (= `dev`).
**Bancada:** não pedi — a sprint declara `bancada: false`. Nenhum aparelho foi
tocado; tudo abaixo é dublê e disco.

## O que mudou

**A decisão dela, 08/09/2026:** *"pode entrar sim"*. A máscara por controle
deixou de ser da sessão e passou a ser do PERFIL.

### 1. O campo — `ControllerOverrides.mascara`

`profiles/schema.py`: `mascara: MascaraDeGamepad | None = None`, ao lado das
seis irmãs. **`None` = "volte ao padrão"** — esta linha dizia *"sem opinião,
então perfil antigo carrega igual"*, e a decisão dela de 09/09 a substituiu: um
perfil antigo carrega igual **e devolve a mesa ao padrão** (§Reparo, R1). O tipo
é o MESMO `Literal` do `mode.gamepad_flavor`, que já é comparado com
`external_mask.mascaras_validas()` nos dois sentidos por
`test_a_mascara_nintendo_pro_atravessa_a_casa.py` — não nasceu um segundo
catálogo.

**É a primeira seção que não é uma seção:** as outras seis são sub-modelos, esta
é um valor só. Para a coluna da aba Perfis a diferença não existe
(`_secoes_do_controle` pergunta `is not None`), e as duas réguas que montavam um
"menor corpo" por seção aprenderam isso.

### 2. Quem aplica — `manager.apply_controller_mascaras`

Irmão exato de `apply_controller_mics`/`apply_controller_sensores`, e o último
da fila do `apply_profile` **de propósito**: é a única seção cuja aplicação pode
derrubar e recriar o vpad, e um vpad recriado no meio da leva invalidaria os
handles que as seções acima acabaram de escrever.

Relatório `mascara:<uniq>` → a máscara, uma chave por peça.

### 3. A ordem de decisão, e onde ela é mesmo executada

A ordem é **`controllers[uniq].mascara` > `mode.gamepad_flavor` > o padrão.**

**FATO SUBSTITUÍDO — 09/09/2026, apontado pelo conferente.** Esta seção dizia
que a ordem estava *"escrita ONDE É EXECUTADA (`external_mask.mascara_efetiva`)"*,
e isso é falso na metade que importa: **`mascara_efetiva` não executa o primeiro
degrau — ela LÊ o registro**, que é um cache. Quem executa o degrau 1 é
`manager.apply_controller_mascaras`, escrevendo no cache a cada ativação (e, desde
a decisão dela, apagando dele quem o perfil não declara); os degraus 2 e 3 é que
são resolvidos em `mascara_efetiva`. As duas docstrings foram corrigidas.

**E A RÉGUA DESSA AFIRMAÇÃO ERA FALSA — é a assinatura que a casa nomeia.**
`test_a_ordem_de_decisao_esta_escrita_onde_ela_e_executada` fazia três
`assert <substring> in mascara_efetiva.__doc__`: reprovava quem editasse o texto
e **passava com a ordem trocada no código**. Medido, não deduzido: com os degraus
1 e 2 invertidos em `mascara_efetiva`, a régua velha respondeu `PASSOU`. Foi
reescrita em duas que medem o ato — ver a §Reparo.

**O `controller_masks.json` virou CACHE do perfil ativo, e continua existindo
por medição:** `mascara_efetiva` é consultada na criação de todo vpad **e no
tique do co-op**, que compara para decidir recriar. Ler o perfil do disco ali
seria a tempestade de syscalls que o `gamepad._motores_do_perfil_ativo` já pagou
uma vez. O que ele deixou de ser é DONO.

### 4. O gesto da tela grava no perfil — mesma estrada, não uma segunda

`gamepad.mask.set {uniq, flavor}` continua com a MESMA forma (a sprint declara
`nao_toca` na aba Jogar, e a aba não mudou um byte). O handler passou a fazer
DUAS escritas, nesta ordem: o registro vivo (vale agora) e
`controllers[chave].mascara` do perfil ativo (vale amanhã) — pelo
`_chave_de_peca_que_grava`, o mesmo do `rumble.motores.set`.

A resposta ganhou `perfil`, `gravado` e `motivo`. Sem perfil ativo, ou com um
`uniq` que não é MAC de peça, a escrita no disco não acontece, a da sessão
acontece, e a tela recebe `gravado: false` com o motivo — recusar o gesto
inteiro deixaria a máquina sem perfil sem máscara nenhuma.

`flavor` vazio limpa dos dois lados, e a entrada que esvaziou SOME do mapa do
perfil (um `uniq` apontando para `{}` faria a coluna "Ajuste próprio" acender
sobre nada).

### 5. A tela — a sétima coluna, porque a casa a cobra

`test_a_coluna_de_ajuste_proprio_mostra_o_disco_inteiro` exige que TODA seção do
esquema tenha célula na página. Então: `aba10.SECOES` + `NOME_DA_SECAO`
(`"máscara"`, a palavra que a aba Jogar já usa) + `a10_perfis.SECOES_DA_COLUNA`
+ `_EXTENSO[7] = "sete"` nos dois donos do número, e a página regerada e
publicada (`mockup/10-perfis.html` → `paginas/10-perfis.html`, por
`check_o_desenho_aprovado.py --publicar 10`). A dica do cabeçalho passou a dizer
**"São os sete ajustes … luz, gatilhos, vibração, alto-falante, microfone,
sensores e máscara"**, montada da lista, não digitada.

**O GLIFO É PROVISÓRIO, e é decisão dela** (§8 do protocolo): a máscara não tem
peça de plástico. Pus o botão `ps`, que é o que carrega a marca do console. Está
marcado como provisório no comentário de `aba10.SECOES`; trocar é uma linha e
regerar.

### 6. O rascunho da janela sabe escrever a seção

`DraftConfig.with_controller_mascara` (+ `_with_override_scalar_cleared`, que é
a irmã escalar do `with_controller_fields_cleared` — a de campos chamaria
`.model_fields_set` num `str` e explodiria). Valor desconhecido levanta em vez
de virar `None`: um `"xbox 360"` que "limpasse" apagaria a escolha dela em
silêncio, que é o `or "xbox"` do editor de perfis pelo outro lado.

### 7. O contrato de IPC regerado

`gerar-contrato-ipc.py` (sem `--check`), porque os handlers desceram de linha
com os 89 que o `_mascara_no_perfil` acrescentou. Isso fechou DOIS portões de
uma vez — `contrato-ipc` e `citacoes-de-linha`, que reclamava dos sete endereços
do `docs/protocol/ipc-unix-socket.md`.

### 8. Doze endereços de linha reapontados

O `citacoes-no-codigo` acusou 12 comentários de `src/` cujo número mudou porque
os arquivos cresceram. Onze eram meus; **um não era e já estava vermelho no
`e5f4b3da`** — `interface/monta.py:291` citava `aba03.py:878`, que está em
branco no arquivo que a minha árvore não tocou (o `via` mora hoje na `:960`).
Reapontei os doze com `grep -n` em vez de declarar pendência: nenhum é de posse
alheia neste lote.

## Qual mordida prova

*(As três abaixo são de 08/09 e ficam como registro. Os nomes de teste que elas
citam mudaram no reparo de 09/09 — `..._sem_opiniao_nao_mexe_na_mascara_de_ninguem`
virou `..._calado_devolve_todo_mundo_ao_padrao`, e a régua da ordem virou duas.
As mordidas do reparo estão na §Reparo.)*

**MORDIDA 1 — arrancar a escrita no registro** (`if not registro.set_mask(...)`
→ `if False:` em `apply_controller_mascaras`):

```
FAILED test_a_mascara_do_perfil_vale_naquele_assento_e_so_nele
FAILED test_trocar_de_perfil_troca_as_quatro_mascaras
FAILED test_so_quem_mudou_e_repintado
FAILED test_o_perfil_sem_opiniao_nao_mexe_na_mascara_de_ninguem
FAILED test_apagar_o_arquivo_de_mascaras_nao_muda_vpad_de_quem_o_perfil_declara
5 failed, 10 passed

>       assert mask_mod.mascara_efetiva(P2, "dualsense") == "xbox"
E       AssertionError: assert 'dualsense' == 'xbox'
```

Devolvida: `15 passed`.

**MORDIDA 2 — arrancar a gravação no perfil** (`self._mascara_no_perfil(...)` →
`None, False, "MORDIDA"` no handler):

```
FAILED test_o_gesto_do_chip_grava_no_perfil_ativo
FAILED test_o_gesto_vazio_limpa_dos_dois_lados
FAILED test_sem_perfil_ativo_o_gesto_ainda_vale_na_sessao
FAILED test_o_gesto_nao_grava_sob_uma_chave_que_ninguem_casa
FAILED test_o_gesto_repetido_nao_regrava_o_perfil
5 failed, 10 passed
E       AssertionError: assert (None == 'Bancada')
```

Devolvida: `15 passed`.

**MORDIDA 3 — arrancar o campo do esquema** (`mascara: MascaraDeGamepad | None`
comentado):

```
E  AssertionError: consumidor declarado para campo que não existe mais: ['mascara']
FAILED test_perfil_por_controle_o_campo_espera_o_caminho.py::test_a_classificacao_cobre_o_esquema_nos_dois_sentidos
FAILED ...::test_o_valor_da_peca_sai_com_o_endereco_dela[mascara]
FAILED test_a_coluna_de_ajuste_proprio_mostra_o_disco_inteiro.py (6 casos)
8 failed, 31 passed
```

Devolvida: verde.

**AS TRÊS MORDIDAS QUE A SPRINT PEDIA, uma a uma:**

| a sprint pede | onde está |
| --- | --- |
| `mascara=xbox` no P2 → vpad `045e:028e`, P1 segue `054c:0df2`; trocar de perfil → os quatro seguem o novo | `test_a_mascara_do_perfil_vale_naquele_assento_e_so_nele` + `test_trocar_de_perfil_troca_as_quatro_mascaras` |
| arrancar o campo → a régua nomeia o assento que ficou na sessão | `test_arrancar_o_campo_deixa_o_assento_na_sessao` (faz a arrancada por dentro: um override SEM o campo) |
| `controller_masks.json` não decide mais nada | `test_apagar_o_arquivo_de_mascaras_nao_muda_vpad_de_quem_o_perfil_declara` |

**A NUMA-03 tem régua própria:** `test_so_quem_mudou_e_repintado` ativa um perfil
que repete a máscara de três assentos e muda a do quarto, e cobra que
`vpad_ficou_para_tras` diga "para trás" **uma vez só**.

**A TELA, medida com o motor do produto:** `test_uma_secao_guardada_acende_uma_
celula_so_e_na_linha_dela[mascara-0/1]` abre a página PUBLICADA no Chrome, entrega
a carga pelo `BOOTSTRAP` de verdade e confere que a célula da máscara acende na
linha e na coluna dela — e só nelas. Foto do publicado:
`olhar.py 10-perfis.html --publicado` → `passa_da_dobra: 0`,
`rolagem_lateral: false`, a sétima célula desenhada nas quatro linhas.

**OS PORTÕES: 53 de 54 verdes, e o vermelho não é meu.** `acentuacao` reprova
com **20 violações em três arquivos que a minha árvore não tocou** —
`git diff HEAD -- scripts/ tests/unit/test_portao_a_regua_das_quatro_respostas.py`
é VAZIO, então elas já estavam no `e5f4b3da`:

| arquivo | quantas | o que é |
| --- | --- | --- |
| `scripts/check_cabo_bt_perfil_controle.py` | 10 | a `:9` é **citação literal dela** (*"sua revisao"*) e pede o `noqa-acento` com a razão; as outras nove são o `_ESCADA = (…, "nao", …)`, que é o VOCABULÁRIO DO CSV do mapa, não prosa |
| `tests/unit/test_portao_a_regua_das_quatro_respostas.py` | 9 | o mesmo `nao` do CSV, citado na régua que mede o script acima |
| `scripts/ensaios/a_janela_cabe_no_que_ela_ve.py` | 1 | `media` (`a §1 da ROLAGEM-01 já a media assim`) |

**NÃO CONSERTEI, e é por posse:** `scripts/` é posse da TUDO-FUNCIONA-01 e os
dois primeiros arquivos nasceram hoje pela CABO-BT-PERFIL-CONTROLE-01 — o
despachante mandou não alterá-los; o terceiro é o instrumento da ROLAGEM-01.
Editá-los daqui viraria conflito de merge com duas frentes em voo. Relatado, não
tocado. **Os três reds que ERAM meus fecharam:** `contrato-ipc`,
`citacoes-de-linha` e a única violação de acentuação que eu tinha escrito.

**Levas rodadas** (os 133 arquivos de teste que tocam `ControllerOverrides`,
`perfis_web`, `draft_config`, `apply_controller` ou `a10_perfis`, em seis lotes
de primeiro plano): `324 + 294 + 408 + 374 + 491 + 528` verdes, 14 skipped,
2 xfailed, zero vermelhos.

**Uma corrida morreu antes disso**, e é a armadilha do `CLAUDE.md` acontecendo:
os 133 arquivos num lote de FUNDO morreram aos 44% sem sumário, com a máquina
livre. Em primeiro plano, em seis pedaços, fecharam. Não gastei tempo com a
causa — ela já está escrita.

## O que NÃO verifiquei

- **NENHUM gamepad virtual foi criado.** O par VID/PID sai do catálogo
  `uinput_gamepad.FLAVORS` aplicado sobre o que `mascara_efetiva` devolve. O
  degrau **MONTOU** (e todos acima dele) fica para a bancada, com a mesa cheia.
  A célula do mapa é `plataforma.vpad`, nas quatro famílias.
- **Não medi a troca de máscara com o daemon vivo.** Que trocar a máscara
  derruba e recria o vpad é medição herdada (MÁSCARA-01), não minha; o que eu
  provei é que a comparação que decide recriar só aponta quem mudou.
- **Não medi o risco declarado no `external_mask`:** ninguém sabe se um jogo
  aceita quatro vpads com máscaras diferentes ao mesmo tempo. Continua NÃO
  MEDIDO, e a decisão dela não o resolve — ela só põe a escolha no perfil.
- **Não rodei a suíte inteira** (§5 do protocolo). Rodei o meu escopo, largo.
- **A janela GTK não foi aberta.** A aba 10 foi medida pelo HTML publicado, no
  Chrome headless do `olhar.py` e do Playwright.

## O que sobrou para o próximo

1. ~~**A PERGUNTA QUE É DELA**~~ — **RESPONDIDA EM 09/09/2026, e ela escolheu o
   oposto do que eu escrevi.** A pergunta era *"um perfil que não fala de
   máscara deve DEVOLVER todo mundo ao padrão, ou deixar cada um como está?"*;
   a resposta dela: **"Default é Hefesto dualsense padrão"**. Eu tinha escrito a
   segunda e marcado como PROVISÓRIO. O provisório saiu e a decisão dela está
   implementada — §Reparo. **E o custo que eu aleguei para justificar a minha
   escolha (*"derrubaria os quatro vpads ao ativar um perfil calado"*) era
   suposição, não medição, e a medição o derruba:** cai só o vpad de quem estava
   FORA do padrão, e **0 de 4** com a mesa já no padrão.
2. **O GLIFO DA COLUNA** (`ps`) é provisório e é dela. Uma linha em
   `aba10.SECOES` e uma regeração.
3. ~~**A POSSE DA SPRINT ESTAVA CURTA**~~ — **ALARGADA EM 09/09/2026, e as duas
   afirmações desta linha eram falsas.** O frontmatter declarava dois arquivos;
   a sprint tocou dezessete. Eu enumerei SETE fora da posse e são TREZE (quinze
   com o reparo), e escrevi que *"nenhum deles é posse de outra sprint do
   LOTE-0909 (conferi as cinco)"* — **`src/hefesto_dualsense4unix/core/rumble.py`
   é posse da VIBRA-MULT-01, que está ABERTA**. A conferência que eu disse ter
   feito não foi feita contra o frontmatter das sprints; agora foi, por máquina.
   A lista inteira, com a razão de cada um, está no `posse:` da sprint e na
   §Reparo.
4. **Para a SPECS-A-PROCEDENCIA-01:** a célula `plataforma.vpad` continua sem
   medição minha. O que EU exercitei foi só a decisão de qual máscara o vpad
   receberia — não o vpad.
5. **Herança:** o `citacoes-no-codigo` estava vermelho no `e5f4b3da` por
   `monta.py:291` → `aba03.py:878`. Consertei junto; se alguém procurar quem
   quebrou, não foi esta leva.

---

## Reparo 09/09

Cinco achados do conferente, e o primeiro é a decisão dela.

### R1. A decisão dela vale — perfil calado devolve todo mundo ao padrão

**Palavra dela:** *"Default é Hefesto dualsense padrão"*. Eu tinha escrito o
oposto (*"`None` = sem opinião, deixa como está"*), marcado PROVISÓRIO. O
provisório saiu.

**O que passou a acontecer:** `apply_controller_mascaras` termina varrendo o
registro e **apaga a máscara própria de todo controle que o perfil não declara**
(`ExternalMaskRegistry.manter_somente`, novo). Aquele controle passa a herdar o
degrau de baixo — `mode.gamepad_flavor` do perfil e, sem ele, o
`DaemonConfig.gamepad_flavor`, que **de fábrica é `dualsense`**, que é o padrão
que ela nomeou. A varredura alcança até quem o perfil nunca viu (um externo que
ganhou máscara pela tela numa sessão sem perfil), porque o dono passou a ser o
perfil.

**O CUSTO QUE EU ALEGUEI ERA SUPOSIÇÃO. MEDIDO, ELE CAI** — e o número está
escrito em `manter_somente` e em `apply_controller_mascaras`. Quem derruba vpad
é o laço do co-op, por `vpad_ficou_para_tras`, e ele compara a máscara
**efetiva**: apagar a entrada de quem já estava no padrão não muda a efetiva, e o
vpad **não cai**.

| a mesa antes do perfil calado | vpads que caem | escritas de disco |
| --- | --- | --- |
| ninguém com máscara própria | **0 de 4** | 0 |
| um assento em Xbox | 1 de 4 | 1 |
| os quatro em Xbox | 4 de 4 | 1 |
| os quatro COM entrada, mas já no padrão | **0 de 4** | 1 |

A última linha é a que responde ao medo: quatro entradas apagadas, **nenhum**
controle dela saindo da partida. E o caminho barato é o que a decisão dela já
pedia — só recria o vpad de quem estava FORA do padrão.

**A varredura em si** (mediana de 200 voltas, `ext4`): **0,034 ms e ZERO escrita**
quando não há nada a devolver (o caso comum, e o que a torna barata em toda
ativação de perfil); **0,21 ms e UMA escrita** quando há quatro. O
`manter_somente` batelha de propósito: quatro `clear_mask` seguidos custariam
**0,63 ms e quatro** `_save_locked` (0,12 ms cada).

**MORDIDA:** troquei `registro.manter_somente(declaradas)` por `()` —
`3 failed, 15 passed`, as três da decisão dela. Devolvida: `18 passed`.

### R2. A afirmação falsa sobre posse alheia

A entrega dizia *"nenhum é posse de outra sprint do LOTE-0909 (conferi as
cinco)"*. **`src/hefesto_dualsense4unix/core/rumble.py` é posse da VIBRA-MULT-01,
que está `estado: aberta`.** Corrigido no item 3 do "O que sobrou".

A conferência agora foi feita por máquina, lendo o `posse:` de todas as 642
sprints com frontmatter e cruzando com os arquivos desta leva. **São DOIS os
cruzamentos com sprint aberta:**

* `core/rumble.py` → **VIBRA-MULT-01** — e a minha edição ali é **uma linha de
  citação**, não código;
* `profiles/schema.py` → **SOM-POR-CONTROLE-01** — declarado e serializado: a
  minha sprint já traz `depois_de: [SOM-POR-CONTROLE-01]`.

### R3. A posse alargada — são treze, não sete (quinze com o reparo)

O `posse:` do frontmatter declarava dois arquivos. Agora declara os dezessete,
com a razão de cada um na própria linha. Os treze que faltavam:

| # | arquivo | por quê |
| --- | --- | --- |
| 1 | `profiles/manager.py` | o applier `apply_controller_mascaras` |
| 2 | `daemon/ipc_handlers.py` | a rota `gamepad.mask.set` gravando no perfil |
| 3 | `app/draft_config.py` | `with_controller_mascara`, o escritor do rascunho |
| 4 | `app/actions/perfis_web.py` | a seção na lista do editor de perfis |
| 5 | `interface/aba10.py` | a sétima célula de "Ajuste próprio" |
| 6 | `interface/pacotes/a10_perfis.py` | a coluna e o número por extenso |
| 7 | `interface/paginas/10-perfis.html` | a página publicada, regerada |
| 8 | `mockup/10-perfis.html` | o desenho de onde a página sai |
| 9 | `core/acoes_de_botao.py` | **só citação de linha** |
| 10 | `core/rumble.py` | **só citação de linha** — e é posse da VIBRA-MULT-01 |
| 11 | `interface/monta.py` | **só citação de linha** |
| 12 | `interface/pacotes/a08_conexoes.py` | **só citação de linha** |
| 13 | `interface/pacotes/a09_sistema.py` | **só citação de linha** |

**Cinco dos treze (9 a 13) são reaponte de número de linha em comentário** — o
`citacoes-no-codigo` os cobra quando o arquivo citado cresce. O reparo de hoje
acrescentou mais dois da mesma espécie, e eles entraram no `posse:` junto:
`integrations/virtual_pad.py` e `interface/pacotes/perfil.py`.

**Fora da tabela, e de propósito:** os quatro arquivos de teste, o
`docs/protocol/ipc-unix-socket.md` (saída de gerador) e os dois documentos da
própria sprint. A convenção de `posse:` nesta casa é sobre `src/` e `scripts/`.

**Oito citações reapontadas no reparo**, todas quebradas pelo próprio reparo
(`schema.py`, `manager.py` e `external_mask.py` cresceram): `draft_config.py:547`,
`acoes_de_botao.py:395`, `virtual_pad.py:203` e `:309`, `aba10.py:221`,
`a08_conexoes.py:3409` e `:4681`, `a10_perfis.py:2523`, `perfil.py:428`. Duas
delas — as que apontavam para `manager.py:1854` — **já estavam podres antes** e
passavam caladas porque a linha velha não estava em branco; o crescimento do
arquivo as expôs. Apontadas para a linha certa (`manager.py:1999`), não
declaradas como pendência.

### R4. A prosa à frente do código: `mascara_efetiva` não executa o degrau 1

A entrega dizia que a ordem estava *"escrita ONDE É EXECUTADA
(`external_mask.mascara_efetiva`)"*. **Falso:** aquela função **lê** o registro,
que é cache. Quem executa o degrau 1 é `apply_controller_mascaras` — escrevendo
no cache, e agora também apagando dele. Corrigido em quatro lugares: a docstring
de `mascara_efetiva`, o cabeçalho do módulo, o campo `mascara` do `schema.py` e
esta entrega.

Há régua para a afirmação, e ela mede o ato:
`test_quem_executa_o_primeiro_degrau_nao_e_a_mascara_efetiva` carrega o perfil
com o campo preenchido, **não** chama o applier, e cobra que `mascara_efetiva`
responda o padrão — se ela executasse o degrau 1, responderia "xbox".

### R5. A régua de PROSA virou régua de comportamento

`test_a_ordem_de_decisao_esta_escrita_onde_ela_e_executada` fazia três
`assert <substring> in mascara_efetiva.__doc__`. **Ela reprovava quem editasse a
docstring e passava se alguém trocasse a ordem no código** — a assinatura de
instrumento falso que esta casa nomeia.

**MEDIDO, não deduzido:** inverti os degraus 1 e 2 dentro de `mascara_efetiva`
(devolver `flavor_do_jogo` antes de olhar o registro) e rodei a régua velha
literal. Ela respondeu **`PASSOU`**.

No lugar dela, `test_a_ordem_de_decisao_vale_degrau_a_degrau`, que prova cada
degrau pelo que ele VENCE — com três valores diferentes, para nenhum `assert`
casar por acaso: o campo do controle vence o eixo do perfil; o eixo do perfil
vence o padrão; e o padrão sai do `normalize_flavor`, não digitado. Com a mesma
inversão aplicada, a régua nova reprova (`11 failed, 7 passed` no arquivo).

### O que este reparo mediu e o que NÃO mediu

* **Não abri uinput.** Nenhum vpad foi criado ou derrubado de verdade: o que
  medi é a decisão de derrubar (`vpad_ficou_para_tras`), que é a função que o
  laço do co-op consulta. O tempo de um vpad real nascer e morrer continua sendo
  bancada, com a mesa cheia — e é o único número desta seção que falta.
* **Não abri janela GTK** e não toquei na tela: o reparo é de perfil, registro e
  réguas. A sétima célula da aba Perfis não mudou.
* **Levas rodadas:** o arquivo da frente (`18 passed`), os quatro arquivos de
  máscara/perfil vizinhos (`94 passed`), e os 20 arquivos que tocam
  `external_mask`/`apply_profile` (`404 passed`, 2 reprovações — uma minha, a das
  citações, curada; a outra **herdada**, ver abaixo).

**O VERMELHO HERDADO, medido contra a árvore sem as minhas mudanças:**
`test_todo_gesto_que_grava_esta_protegido::test_todo_gesto_que_escreve_declara_grava`
reprova com três gestos de `04-iluminacao.html` (`apagar`, `cor`, `reenviar`)
que escrevem por `save_profile` sem declarar `grava=`. **Já reprovava no meu
commit `0862e8ef`** — conferi devolvendo os três arquivos ao estado do commit e
rodando: `1 failed, 32 passed`. Não é meu e não é da aba 10.

### Os portões e a leva do reparo

**PORTÃO COMPLETO (não `--rapido`): 53 de 54 verdes.** O único vermelho é
`acentuacao`, com **20 violações em três arquivos que esta árvore não tocou** —
`scripts/check_cabo_bt_perfil_controle.py` (10),
`tests/unit/test_portao_a_regua_das_quatro_respostas.py` (9) e
`scripts/ensaios/a_janela_cabe_no_que_ela_ve.py` (1). **Já foram curados no
`dev` pelo `bb87d7df`; esta árvore está atrás dele.** Uma violação da leva
anterior era MINHA (`media` na docstring do teste) e fechou aqui, reescrita.

O `citacoes-no-codigo` fechou VERDE depois dos oito reapontes.

**A leva do reparo — os 284 arquivos de teste que tocam `external_mask`,
`profiles.manager`, `profiles.schema`, `draft_config`, `apply_profile` ou
`ControllerOverrides`, em SEIS partes de primeiro plano:**

```
678 + 715 + 851 + 746 + 1114 + 851  = 4.955 passaram
15 skipped · 3 xfailed · 2 reprovações, e as duas são HERDADAS
```

As duas: `test_som_02_devolucao_da_posse.py::TestPonteDaJanela::{test_release_manda_a_chave_e_o_uniq,
test_volume_continua_indo_explicito}` — **conferidas contra o commit `0862e8ef`
com os três arquivos do reparo devolvidos ao estado dele: reprovam igual.** São
território da SOM-POR-CONTROLE-01. A terceira herdada, fora desta leva, é o
`test_todo_gesto_que_grava_esta_protegido` da aba 04.

### A armadilha deste reparo, e ela é de FERRAMENTA

**O diretório de rascunho é COMPARTILHADO entre os agentes irmãos desta leva.**
A primeira corrida de portões que eu capturei trazia no cabeçalho
`árvore /mnt/.../hefesto-voo/LANCADORES-ZERO-01-opus` e TRÊS sumários diferentes
(54 e 56 portões); depois, a lista de arquivos de um lote cresceu de 285 para 352
linhas com saída de `pytest` de outra árvore (`TUDO-FUNCIONA-01-opus`) colada
dentro. Nenhum dos dois é defeito do repositório: **é output de agente vizinho
caindo no meu arquivo.**

Isso quase me fez ler como MEUS quatro vermelhos que não eram (`nada-mockado`,
`fatos-de-tela`, e um `citacoes-no-codigo` de outra árvore). A cura é uma linha:
**escreva em subpasta própria, com o nome da sprint**, e confira o cabeçalho —
`portoes.sh` imprime a árvore que mediu, e é para isso que ele a imprime.
