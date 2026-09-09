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
seis irmãs. `None` = sem opinião, então perfil antigo carrega igual. O tipo é o
MESMO `Literal` do `mode.gamepad_flavor`, que já é comparado com
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

### 3. A ordem de decisão, escrita onde é executada

`external_mask.mascara_efetiva` ganhou a ordem por extenso:
**`controllers[uniq].mascara` > `mode.gamepad_flavor` > o padrão.** Há régua que
reprova se essa docstring perder qualquer um dos três degraus
(`test_a_ordem_de_decisao_esta_escrita_onde_ela_e_executada`).

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

1. **A PERGUNTA QUE É DELA, e ela é UMA:** *um perfil que não fala de máscara
   deve DEVOLVER todo mundo ao padrão, ou deixar cada um como está?* Escrevi a
   segunda — `None` = sem opinião, o contrato do topo de `ControllerOverrides`,
   e a única que não derruba os quatro vpads dela ao ativar um perfil calado.
   Está **marcado como PROVISÓRIO** em `apply_controller_mascaras` e no teste
   `test_o_perfil_sem_opiniao_nao_mexe_na_mascara_de_ninguem`. A consequência
   medida: sair do perfil A (P2 em Xbox) para o perfil B (calado) deixa o P2 em
   Xbox. É a mesma contradição aberta que a docstring de `ControllerOverrides`
   já registra desde 02/09 (*"o perfil tem de guardar tudo"* contra *"campo
   `None` = sem opinião"*).
2. **O GLIFO DA COLUNA** (`ps`) é provisório e é dela. Uma linha em
   `aba10.SECOES` e uma regeração.
3. **A POSSE DA SPRINT ESTAVA CURTA.** O frontmatter declara só
   `external_mask.py` e `schema.py`, e a §2 da própria sprint exige o applier
   (`profiles/manager.py`) e a rota IPC (`daemon/ipc_handlers.py`); a régua
   `test_perfil_por_controle_o_campo_espera_o_caminho` recusa campo sem
   consumidor por-`uniq`, então o campo não entraria sozinho. Toquei também
   `app/draft_config.py`, `app/actions/perfis_web.py`, `interface/aba10.py`,
   `interface/pacotes/a10_perfis.py` e a página publicada — nenhum deles é posse
   de outra sprint do LOTE-0909 (conferi as cinco). Quem costurar deve esperar
   conflito ZERO, mas o aviso fica.
4. **Para a SPECS-A-PROCEDENCIA-01:** a célula `plataforma.vpad` continua sem
   medição minha. O que EU exercitei foi só a decisão de qual máscara o vpad
   receberia — não o vpad.
5. **Herança:** o `citacoes-no-codigo` estava vermelho no `e5f4b3da` por
   `monta.py:291` → `aba03.py:878`. Consertei junto; se alguém procurar quem
   quebrou, não foi esta leva.
