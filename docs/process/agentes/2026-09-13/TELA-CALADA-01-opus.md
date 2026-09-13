# TELA-CALADA-01 — o piloto para de narrar o gesto que deu certo

Agente: opus · árvore `voo/TELA-CALADA-01-opus`, nascida de `onda/1309` (`53cfd578`).
Sprint: `docs/process/sprints/2026-09-13-TELA-CALADA-01-o-piloto-para-de-narrar-o-gesto-que-deu-certo.md`.

## O que mudou

**Itens 1, 2 e 3 da §1 construídos. O item 4 foi medido e PARADO**, como o próprio
item manda quando o pouso da recusa não aparece na foto (ver abaixo).

| arquivo | o que mudou |
| --- | --- |
| `src/hefesto_dualsense4unix/interface/hefesto_vivo.py` | `_deu_certo_dizendo` não deposita mais: a frase do `recado` sai no stderr como `[relato] <página> · <gesto>: <frase>` e continua saindo da carga antes da pintura. O depósito ganhou a **página do clique** como quarta casa (`_depositar(uniq, frase, tom, pagina)`, `_recusou_dizendo`, `_a_pagina_morreu`), e `_recados_para_a_tela` devolve só os da `self.pagina`. Nota datada da D-01 (a metade do sucesso caduca em 13/09; a da recusa fica). Três comentários que afirmavam o comportamento velho foram substituídos (o aviso que "acompanha" a troca de aba, a "tarja de rodapé" do `_gesto`, a nota do `SEGUNDOS_DO_RECADO_DE_SUCESSO`). |
| `src/hefesto_dualsense4unix/interface/pacotes/rodape.py` | `_recado` relata no stderr (`[relato] rodapé · carona: …`) e devolve `None`; `aplicar`, `salvar` e `importar` continuam chamando `perfil.com_a_carona()` e devolvem `None`. |
| `tests/unit/test_a_tela_nao_narra_o_gesto_que_deu_certo.py` | **novo** — 10 casos: piloto oculto 01 → 02 → 03 → 02, e três unitários (o canal e o rodapé). |
| `tests/unit/test_o_recado_de_sucesso_pousa_no_cartao.py` | **por cima da versão da FLAKE-DO-PISCA** (ver abaixo): os itens 1–5 do docstring e quatro testes mudam de contrato **com data e citação** — `test_a_frase_do_dono_nao_pousa_em_cartao_nenhum` (era `…_pousa_no_cartao_de_quem_foi_clicado`), `test_a_recusa_tem_o_tom_dela_e_o_sucesso_nao_tem_no` (era `…_sucesso_e_verde_e_a_recusa_e_laranja`), `test_a_frase_do_dono_nao_chega_a_tela` (era `…_frase_do_dono_vence`), `test_nao_ha_recibo_a_vencer` (era `test_o_recibo_vence_e_some`). As esperas por condição e o vigia dela ficam intactos. |
| `tests/unit/test_o_piloto_tem_o_terceiro_lugar_e_a_quarta_porta.py` | o clique de prova passa a RECUSAR e as faixas declaram `recusa` (o único tom que ainda atravessa o canal); o depósito e a tela zeram antes do `change`, senão a recusa de 30 s daria verde sobre um recado velho. |
| `tests/unit/test_carona_do_wrapper_01_salvar_repoe_o_que_a_steam_comeu.py` | «Salvar» e «Aplicar» do rodapé: `resposta is None` e a notícia no stderr (capsys). O atalho continua sendo cobrado no `localconfig.vdf` de mentira. |
| `tests/unit/test_a_tela_nao_confessa_divida_nossa.py` | a leitura literal do depósito da recusa perde o fecho do parêntese (a página virou quarto argumento), com nota datada. |
| `tests/unit/test_a_iluminacao_avisa_quantos_receberam_o_desenho.py` | docstring: o canal verde caducou; a chave `recado` continua. |

**A COSTURA COM A FLAKE-DO-PISCA, a pedido de quem coordena (13/09).** Eu já tinha
editado `test_o_recado_de_sucesso_pousa_no_cartao.py` quando a outra sprint o reescreveu
(marcos de tempo fixo viraram esperas por condição com teto e um `MutationObserver`),
costurada em `onda/1309` como `6c61cdb6`. Guardei a minha versão fora da árvore, devolvi o
arquivo ao HEAD, trouxe `7524dd6e` por `git cherry-pick` (limpo; `f40df869` nesta branch)
e reescrevi o meu contrato **por cima da versão dela**, sem tocar nas esperas. A versão
dela, rodada sobre a minha cura antes da reescrita, reprovou exatamente os quatro casos
que mudam de contrato (`test_a_frase_pousa_no_cartao_de_quem_foi_clicado`,
`test_o_sucesso_e_verde_e_a_recusa_e_laranja`, `test_a_frase_do_dono_vence`,
`test_o_recibo_vence_e_some`) e passou nos outros 15.

**No piloto oculto, o que ela vê (foto e clique):**

O «Aplicar» do rodapé com um jogo da Steam sem o atalho, em lar de mentira (vdf, perfis
e `HOME` desviados; `apply_draft_detalhado` e o estado do daemon dublados), clicado
pelo ouvinte de verdade na 01, na 02 e na 05:

| aba | ANTES da cura (base `53cfd578`) | DEPOIS da cura |
| --- | --- | --- |
| 01 | a frase da carona na **faixa** `.recibo-do-reconectar` | zero `.hef-recado`, nada no texto da página |
| 02 | a frase no **cartão do P1** — e já estava lá **antes** do clique, vinda da 01 (a porta da aba seguinte) | zero `.hef-recado` antes e depois |
| 05 | a frase na **faixa** `#vib-estado` (foto: a linha verde inteira sob a grade) | zero `.hef-recado`; a foto mostra só a piscada verde no «Aplicar» |

Nos dois lados: desfecho `aplicou`, atalho reposto (`False → True` no vdf de mentira),
três envios ao dublê do daemon. Depois da cura, três linhas `[relato] rodapé · carona:
Reposta a Opção de Inicialização do Hefesto em 1 jogo da Steam: appid 3357650…` no stderr.

## Qual mordida prova

**A régua nova na BASE, antes de qualquer linha de `src/` mudar** — ela reprova o defeito
vivo:

```
FAILED …::test_o_recibo_do_reconectar_nao_escreve_na_faixa_da_01
FAILED …::test_o_sucesso_da_02_nao_pousa_no_cartao
FAILED …::test_a_frase_do_sucesso_vai_ao_diario
FAILED …::test_a_recusa_nao_segue_para_a_aba_seguinte
FAILED …::test_o_gesto_que_deu_certo_nao_deposita_e_relata
FAILED …::test_o_rodape_nao_devolve_recado_e_relata
6 failed, 4 passed in 10.80s
```

**As três mordidas, na árvore curada**, aplicadas por troca exata de texto
(`scratchpad/morder.py`, que aborta se não achar a string uma vez só) e devolvidas por
`cp`, conferido com `cmp`:

```
== MORDIDA sucesso   (_deu_certo_dizendo volta a _depositar(uniq, frase, "sucesso", pagina))
   rodada DEPOIS do cherry-pick, sobre a régua da FLAKE-DO-PISCA com o meu contrato
FAILED test_a_tela_nao_narra_o_gesto_que_deu_certo.py::test_o_recibo_do_reconectar_nao_escreve_na_faixa_da_01
FAILED test_a_tela_nao_narra_o_gesto_que_deu_certo.py::test_o_sucesso_da_02_nao_pousa_no_cartao
FAILED test_a_tela_nao_narra_o_gesto_que_deu_certo.py::test_a_frase_do_sucesso_vai_ao_diario
FAILED test_a_tela_nao_narra_o_gesto_que_deu_certo.py::test_o_gesto_que_deu_certo_nao_deposita_e_relata
FAILED test_o_recado_de_sucesso_pousa_no_cartao.py::test_a_frase_do_dono_nao_pousa_em_cartao_nenhum
FAILED test_o_recado_de_sucesso_pousa_no_cartao.py::test_a_recusa_tem_o_tom_dela_e_o_sucesso_nao_tem_no
FAILED test_o_recado_de_sucesso_pousa_no_cartao.py::test_a_frase_do_dono_nao_chega_a_tela
FAILED test_o_recado_de_sucesso_pousa_no_cartao.py::test_nao_ha_recibo_a_vencer
8 failed, 21 passed in 21.13s
   (antes do cherry-pick, sobre a minha versão velha da régua: 7 failed, 22 passed)
   com a cura intacta, a régua da FLAKE-DO-PISCA com o meu contrato: 19 passed in 7.64s

== MORDIDA filtro    (sem o `if pagina == self.pagina` de _recados_para_a_tela)
FAILED test_a_tela_nao_narra_o_gesto_que_deu_certo.py::test_a_recusa_nao_segue_para_a_aba_seguinte
1 failed, 9 passed in 10.65s

== MORDIDA rodape    (_recado volta a devolver {"recado": frase})
FAILED test_a_tela_nao_narra_o_gesto_que_deu_certo.py::test_o_rodape_nao_devolve_recado_e_relata
FAILED test_carona_do_wrapper_01_salvar_repoe_o_que_a_steam_comeu.py::test_o_salvar_do_rodape_repoe_o_atalho_de_inicializacao
FAILED test_carona_do_wrapper_01_salvar_repoe_o_que_a_steam_comeu.py::test_o_aplicar_verde_do_rodape_repoe_o_atalho
3 failed, 32 passed in 11.04s

== devolvidos por copia: byte a byte iguais
== a cura de volta: 10 passed in 10.64s
```

**Uma primeira tentativa de mordida NÃO mordeu, e fica escrita:** passei `·` e `é` pelo
shell, a troca achou zero ocorrências, e duas rodadas deram verde **sobre a cura
intacta** (29 e 35 passed). O instrumento mentia, não o produto; o mutador passou a
guardar as strings dentro do próprio arquivo e a abortar sem aplicar.

**Os vizinhos, com a cura:** `ruff` e `mypy` limpos em `hefesto_vivo.py` e `rodape.py`;
onze arquivos de régua do canal (o novo, os cinco mudados, a recusa no cartão, as abas
01, 09 e 10, e a segunda perna do perfil ativo): **203 passed in 90.84s**.

Os portões inteiros estão no fim desta entrega.

**O ITEM 4, MEDIDO E PARADO.** Piloto oculto na 01, dois gestos sem coluna recusando com
`RuntimeError` e 1,2 s de espera: o cadeado (`input[data-gesto="cadeado"]`) e o
«Aplicar» (`.r-aplicar`). CSSOM e recorte de pixels do botão em três instantes:

| botão | antes do clique | em voo | depois do pouso | recorte antes × depois |
| --- | --- | --- | --- | --- |
| cadeado | opacity 1, cursor pointer | opacity 0.6, cursor progress | opacity 1, cursor pointer | **0 bytes diferentes** |
| «Aplicar» | opacity 1, fundo verde | opacity 0.6, cursor progress | opacity 1, fundo verde | **0 bytes diferentes** |

O `voltouDoVoo(n, false)` só tira a classe de voo: **o pouso de uma recusa é igual ao
botão antes do clique.** Hoje o único sinal visível dessa recusa é a frase no cartão do
controle que a fita aponta — a foto mostra *"O Hefesto está desligado: a trava não foi
aplicada."* cobrindo o nome do P1. Tirá-la dali sem um sinal no botão faria o clique
recusado sumir calado, que é o defeito que o canal nasceu para curar. Não construí; está
em *o que sobrou*.

## O que NÃO verifiquei

- **Aparelho nenhum.** `bancada: false` e o canal é da tela; nada foi ao daemon dela nem
  ao hidraw. Todas as medições são no piloto oculto com dublê do daemon e da ponte.
- **A janela instalada dela** e o `interface.log` real: não abri. O `[relato]` foi lido
  no stderr do piloto oculto e do teste, não no diário da sessão dela.
- **As dez abas, gesto a gesto.** Cliquei a 01 (Reconectar, cadeado, «Aplicar»), a 02
  (microfone do P1, «Aplicar»), a 03 (só leitura depois de navegar) e a 05 («Aplicar»). Os
  `recado` de sucesso da 03, 04, 06, 07 e 09 passam pelo mesmo `_deu_certo_dizendo` e não
  foram clicados um a um.
- **O «Importar» do rodapé** não foi clicado no piloto (abre seletor de arquivo); a mudança
  nele é a mesma linha do «Aplicar» e do «Salvar», coberta só pelo `mypy` e pela leitura.
- **Os ensaios de `scripts/ensaios/`** que leem `.hef-recado` depois de um sucesso
  (`a_vigia_da_steam_no_webkit.py`, `o_botao_copiar_a_linha_no_webkit.py`) não rodei.
  Pelo que leem, devem passar a não achar a frase — por desenho, não por regressão.
- **A suíte inteira** (é de quem coordena).
- **Uma recusa com o gesto em voo durante a troca de aba** (ela clica na 02 e navega antes
  de o gesto voltar): o código grava a página do CLIQUE, mas nenhuma régua exercita o
  gesto lento atravessando a navegação.

## O que sobrou para o próximo

1. **A decisão do item 4 é dela.** A recusa de um gesto que não mora em coluna (cadeado,
   Reconectar, modo da 01, rodapé, gabinete da 08) continua pousando no cartão do
   controle apontado pela fita, cobrindo o nome dele. Para tirá-la dali sem calar o
   clique, o botão precisa de um sinal próprio de recusa no pouso (hoje não há nenhum), e
   isso é o que nasce visível na tela.
2. **O tom `sucesso` ficou sem quem deposite**, e o que o carrega cruza a posse desta
   sprint: `SEGUNDOS_DO_RECADO_DE_SUCESSO` e o `COR_DO_SUCESSO` do BOOTSTRAP, as faixas
   `data-hef-recados="sucesso"` da 01 e da 05 (`aba01.py`, `aba05.py`, `paginas/`), as
   réguas que as cobram (`test_a_aba_05_vibracao_fecha_as_linhas.py`,
   `test_a_iluminacao_avisa_quantos_receberam_o_desenho.py::test_o_canal_e_o_verde_de_seis_segundos`,
   `test_o_recado_de_sucesso_pousa_no_cartao.py::test_o_prazo_do_sucesso_e_menor_que_o_da_recusa`)
   e a prosa de `a03_gatilhos.py`, `a04_iluminacao.py` e `a05_vibracao.py` que ainda descreve
   o canal verde. Deixei de pé, com nota datada no piloto, para não editar arquivo alheio.
3. **A TELA-CALADA-03 tem de entrar junto no `dev`**: a pergunta de confirmação do
   «Aplicar aos jogos da Steam» (`a09_sistema.py`, ramo sem `_confirmado`) ia só por
   recado de sucesso e, com esta entrega sozinha, some da tela.
4. As strings `recado` dentro dos pacotes continuam montadas e agora só viram relato; a
   TELA-CALADA-02/03 e a JOGAR-A-FAIXA-QUE-PULA-01 cuidam do que as abas pintam por
   `blocos`/`mesa` a cada tique, que esta sprint não toca.

## Portões

`git add -A && bash scripts/portoes.sh > /tmp/portoes-TELA-CALADA-01.txt 2>&1`, na
árvore com o cherry-pick da FLAKE-DO-PISCA e o meu contrato por cima.

A rodada focada de 203 testes citada acima foi tirada ANTES do cherry-pick; depois dele,
rodei de novo só a régua reescrita (19 passed) e a mordida do sucesso sobre ela (8 failed).

**Houve uma corrida duplicada dos portões na mesma árvore** (uma em segundo plano às
04:02:05, outra em primeiro plano às 04:03:14); quem coordena matou a primeira, e a que
vale é a segunda.

**A segunda reprovou 3 de 60, os três meus, e os três foram curados:**

| portão | a causa | a cura |
| --- | --- | --- |
| `saida-de-agente` | esta entrega tinha o glifo do microfone (emoji) numa linha, e o sanitizador o troca | a palavra no lugar do glifo |
| `acentuacao` | dez ocorrências de `pagina` na régua nova — a chave do JS, as leituras `leitura["pagina"]` e três linhas de prosa | a chave virou `aba` e a prosa foi reescrita, sem `noqa` |
| `citacoes-no-codigo` | o docstring de `a10_perfis.py` cita `rodape.py:114` para o «Salvar» do rodapé; o `import sys` e o docstring novo do `_recado` desceram o `_draft_do_ativo`, e a 114 ficou em branco (o trecho citado está hoje na 119) | `a10_perfis.py` está no `nao_toca:` da sprint: a chave entrou em `_CITACOES_PENDENTES` com a razão e o símbolo, como a própria régua manda |

O CANARIO-FS-01 avisou (aviso, não portão) `interface.log` e `kernel.log` do estado dela
mudando durante a corrida. **Atribuição:** o `interface.log` dela registra `profile_salvo`
de `avatar_legends_the_fighting_game.json`, `future_knight.json` e `pro_jank_footy.json`
desde as 03:30 — e esses três são exatamente os três perfis que diferem da cópia que tirei
de `~/.config/hefesto-dualsense4unix/profiles/` às 03:30:36 antes de abrir qualquer piloto.
É a janela dela, jogando; os meus pilotos correram com lar de mentira.

**Com as três curas, a corrida em primeiro plano das 04:16:42 às 04:23:12 fechou
`TODOS VERDES — 60 portões.`** (rc=0; saída em `/tmp/portoes-TELA-CALADA-01.txt`).
