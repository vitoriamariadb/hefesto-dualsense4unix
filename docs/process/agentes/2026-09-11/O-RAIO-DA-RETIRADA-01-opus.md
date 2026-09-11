# O RAIO DA RETIRADA — nada quebrou no produto, e uma linha do mapa quebrou

**Árvore:** `/mnt/Apate/Desenvolvimento/hefesto-voo/O-RAIO-DA-RETIRADA-01-opus`
· branch `voo/O-RAIO-DA-RETIRADA-01-opus`, nascida de `onda/0911b` (`6db7ea60`,
conferido contra `git rev-parse --short onda/0911b`).

**Bancada:** não pedida (`bancada: false`). Nada parou o daemon, nada escreveu
no aparelho, nada chamou `systemctl`, nenhuma janela nasceu. Tudo num **lar de
mentira** — `HOME` e os quatro `XDG_*` num `mkdtemp`, com `assert` de que
`loader.profiles_dir()` caiu lá dentro antes de a primeira linha escrever.

**A pergunta dela, 11/09/2026:** *"veja se a remoção dessa info na aba perfil* <!-- noqa-acento: citação literal dela -->
*não vai quebrar o resto tambem."* <!-- noqa-acento: citação literal dela -->

**A RESPOSTA EM UMA FRASE:** nada do produto quebrou — os **dezenove** leitores
de `Profile.mode` leem o CAMPO, e nenhum lia o quadro; o que quebrou foi **uma
linha do mapa dos donos**, que ainda afirma que a tela nova não edita o modo, e
o portão dela é **estruturalmente cego** a essa mentira.

---

## O que mudou

**Nenhuma linha de produto.** `src/`, `tests/` e `mockup/` estão em `nao_toca`,
e ficaram intocados. O que esta sprint entrega é a MEDIÇÃO:

`docs/process/2026-09-11-O-RAIO-DA-RETIRADA-o-que-mais-lia-o-modo-do-perfil.md`

### 1. O censo dos leitores — por árvore de sintaxe, não por `grep`

A §3 da sprint nomeia a armadilha (*o portão da paridade conta PROSA como
uso*), e a medição a mede: contadas em `src/`, as três espécies dão **19
chamadas · 88 comentários · 78 strings/docstrings**. Um levantamento por texto
responderia **166** onde a resposta é **19**.

**A coluna que responde à pergunta dela tem dezenove «não»:** o quadro «Modo»
era um **ESCRITOR**. Quem lê o modo sempre leu o CAMPO — o `mode_applier` do
daemon, a antecipação do `steam_app_<id>.env`, a ponte, o `doctor`, o
`DraftConfig`, o `perfis_web`. Nenhum deles passava pelo quadro, e é por isso
que a retirada podia sair barata.

A única linha com «sim» é o editor de modo da **janela GTK**
(`profiles_actions._populate_editor` / `_build_profile_from_editor`) — outro
quadro, o dela, que está sendo aposentado e cujo `main.glade` já não existe no
disco.

### 2. Nove caminhos medidos, nove de pé

| # | o caminho | o que se viu |
| --- | --- | --- |
| 2 | `Ativar` → `profile.switch` → `manager.activate` | o applier recebeu `ProfileModeConfig(kind='gamepad', gamepad_flavor='xbox')`, `relatorio['mode']='aplicado'` |
| 3 | autoswitch por `_tick` (dois tiques, o debounce inteiro) | escolheu `'Pragmata'` e o applier recebeu a mesma seção, `origin='autoswitch'` |
| 4a | `duplicar` | a cópia no disco com o `mode` do original |
| 4b | `voltar-a-de-ontem` | gravei COM, regravei SEM, o desfazer trouxe de volta |
| 4c | `editor.prioridade` **no perfil ATIVO** | atravessa o `DraftConfig` e o disco fica com o `mode` |
| 4d | `editor.nome` **no perfil ATIVO** (o renomear) | `sackboy.json` com o `mode` intacto |
| 4e | `rodape.exportar` → `rodape.importar` | o `.json` levado e trazido mantém o `mode` |
| 5 | `semear_perfis_dos_jogos` | nasce **sem a seção** — chaves `['match','name','priority']` |
| 6 | `perfil.gravar_o_modo_no_ativo` (os chips da aba Jogar) | disco `None` → `{'kind':'gamepad','gamepad_flavor':'dualsense'}` |

**4c e 4d são o buraco que faltava.** A régua que a `PERFIS-A-TELA-01` deixou
mede os gestos do editor com `active_profile: None` — e nesse estado
`_com_o_que_esta_valendo` devolve o perfil do disco e vai embora. Com o perfil
**ativo** o gesto passa por `rodape._draft_do_ativo` → `DraftConfig.to_profile`,
que é outro código e tem no caminho o portão `mesmo_perfil` do R-11 — o mesmo
que, com nome NOVO, **zera `match`, `mode` e `suppress_desktop_emulation` de
propósito**. É o caminho em que a perda seria invisível duas vezes: o campo já
não aparece na aba, e a régua de ontem não passa por ali.

### 3. A quebra, e ela é do MAPA

`docs/data/donos-de-comportamento.csv:48` diz `SO-GTK` — *"pronto e testado na
janela, **ausente** na tela nova"* — sobre `perfil.editor.modo`, com a razão
*"não é editável na tela nova"*. **É falso, e foi medido** (linha 6 da tabela
acima): a aba Jogar escreve `Profile.mode` do perfil ativo no clique do chip,
pelo dono compartilhado `interface/pacotes/perfil.gravar_o_modo_no_ativo`.

**Foi ELA quem derrubou esse fato**, e a `CADEADO-E-O-FATO-01` já o substituiu
em quatro lugares no mesmo dia — o docstring do escritor, `paridade-gtk-html.csv:384`,
a §3.1 da sprint `PERFIS-A-TELA-01` e a tabela de `2026-09-03-O-TERCEIRO-NUMERO…`.
Esta linha ficou de fora: é a **correção pela metade** que a regra desta casa
existe para matar.

**NÃO CUREI.** O CSV não está na `posse:` desta sprint, e a escolha do veredito
novo tem consequência — a §5 diz por quê, e é pergunta dela.

### 4. E o portão dela é cego por DESENHO — medido, não suposto

`scripts/check_donos_de_comportamento.py` tem a regra certa (*"SO-GTK que já
migrou: o portão vê o símbolo ser CHAMADO em `interface/`"*), e ela pergunta
pelo símbolo da coluna `dono`:

```
_quem_cita('_set_mode_editor')          -> []
_quem_cita('_mode_section_from_editor') -> []
_quem_cita('gravar_o_modo_no_ativo')    -> ['interface/pacotes/a01_jogar.py']
_quem_cita('secao_do_modo')             -> ['interface/pacotes/perfil.py']
```

O portão pergunta pelo nome da GTK; a tela nova implementou o comportamento com
**nome próprio** e nunca chamou o da janela — por decisão de arquitetura, ela
não liga fio nenhum lá. A regra 3 só pega quem *liga o fio ao símbolo antigo*.
**É a assinatura que esta casa já nomeou:** *o instrumento respondia sobre outra
coisa que não o produto.* O portão está verde, e a linha está errada.

### 5. O que CAIU da sprint — dois endereços, e os dois por aritmética

O enunciado cita duas linhas que andaram desde que ele foi escrito, e o
conteúdo continua certo — o que caducou é o número:

| a sprint diz | onde está hoje |
| --- | --- |
| *"o gesto `editor_modo` … hoje lápide em comentário, `:2509`"* | `interface/pacotes/a10_perfis.py:2593` |
| *"O `Voltar à de ontem` (`a10_perfis.py:1829`)"* | o `@gesto` em `:1854`, a função em `:1855` |

É a cicatriz que esta casa já pagou e que a `CADEADO-E-O-FATO-01` nomeou no
mesmo dia: **endereço se cita por SÍMBOLO**, porque linha caduca a cada edição
acima dela e reapontar por aritmética é como se erra de novo. Este laudo cita
todos por símbolo.

Nada mais do enunciado caiu: as seis perguntas continuam válidas, o campo não
foi tocado, e a §1 descreve a retirada como ela aconteceu.

---

## Qual mordida prova

A medição é o produto desta sprint, então a mordida é sobre ELA: uma régua que
só sabe dizer «de pé» não mede nada. Quatro curas arrancadas em memória (o
produto em disco não foi tocado), e cada uma derruba exatamente o que deve:

| mordida | o que se arranca | reprovou |
| --- | --- | --- |
| `funil` | `perfil.gravar_e_reaplicar` grava com `mode=None` | **4a · 4c · 4d** |
| `historico` | `loader.restaurar_do_historico` devolve sem o `mode` | **4b** |
| `applier` | o `ProfileManager` nasce sem `mode_applier` | **2 · 3** |
| `semeadura` | o perfil de jogo passa a nascer com opinião | **5** |

```
######## MORDIDA='funil'                       ######## MORDIDA='applier'
     de-pe  2. Ativar                            quebrado  2. Ativar
     de-pe  3. autoswitch                        quebrado  3. autoswitch
  quebrado  4a. Duplicar                            de-pe  4a. Duplicar
     de-pe  4b. Voltar à de ontem                   de-pe  4b. Voltar à de ontem
  quebrado  4c. editor no ATIVO                     de-pe  4c. editor no ATIVO
  quebrado  4d. RENOMEAR o ATIVO                    de-pe  4d. RENOMEAR o ATIVO
     de-pe  4e. Exportar/Importar                   de-pe  4e. Exportar/Importar
     de-pe  6. a tela nova edita                    de-pe  6. a tela nova edita
     de-pe  5. semeadura                            de-pe  5. semeadura
quebrados: 3                                   quebrados: 2
```

Devolvidas as quatro curas: **nove de pé, `quebrados: 0`.**

**A MORDIDA QUE NÃO MORDEU, e ela é um achado.** A primeira `semeadura` trocava
só `loader._perfil_do_jogo` por um molde COM modo — e a medição continuou
verde. A causa é que há **duas travas**, não uma: a peneira
`loader.CHAVES_DO_PERFIL_DE_JOGO` corta tudo que não seja nome, regra e
prioridade, depois do molde. Arrancar uma só não muda o disco. *Uma mordida que
não morde não prova que o produto está bem — prova que você mordeu no lugar
errado, e é o que revela a segunda trava.*

### Os portões e a suíte do escopo

* `bash scripts/portoes.sh` — **TODOS VERDES**
  (`/tmp/portoes-O-RAIO-DA-RETIRADA-01.txt`).
* `pytest tests/unit/test_o_quadro_do_modo_grava_no_perfil.py
  test_o_quadro_do_modo_nao_descreve_o_que_perde.py
  test_steam_input_ponteiros.py test_o_dono_do_comportamento_e_um_so.py`
  → **42 passed**.

---

## O que NÃO verifiquei

* **O APARELHO.** `bancada: false`, bancada não pedida. Provei que a seção
  CHEGA ao `mode_applier` com o valor certo pelos dois caminhos (manual e
  autoswitch); **não** provei que o daemon vivo sobe o gamepad virtual ou solta
  o controle no Nativo. Essa é a linha de prova da `MESA-DE-QUATRO-01`.
* **A TELA.** Nenhuma janela nasceu, nenhuma foto foi tirada. A retirada visual
  já foi medida e fotografada pela `PERFIS-A-TELA-01`; refazer seria remedir.
* **A ABA JOGAR COMO TELA.** Exercitei o escritor dela
  (`gravar_o_modo_no_ativo`) direto, não os quatro chips pelo `WebKit2.WebView`.
  Que eles estejam desenhados e clicáveis é do laudo daquela aba.
* **`docs/data/mapa-controles.csv`: ZERO células exercitadas.** O mapa de canais
  é do aparelho — report id, offset, comando — e `Profile.mode` é dado de perfil
  em disco. Não há `chave` a relatar, e inventar uma poluiria o mapa.
* **A SUÍTE INTEIRA.** Rodei os quatro arquivos do escopo. Os doze lotes são de
  quem costura.
* **A `O-SALVAR-DA-JOGAR-01`**, irmã que roda agora e mede o que a aba Jogar
  GRAVA. A entrega dela não existia quando esta fechou. Se as duas se cruzarem
  em `gravar_o_modo_no_ativo`, **a dela é a que mediu a aba** — esta só o
  chamou para derrubar a linha 48 do mapa.

---

## O que sobrou para o próximo

1. **`docs/data/donos-de-comportamento.csv:48`** — sair de `SO-GTK` para um dos
   `DIVERGE*`, com `onde_html` apontando para
   `interface/pacotes/perfil.py:gravar_o_modo_no_ativo`. A divergência que
   sobra é de **lugar** (a fileira de chips da Jogar, não um quadro no editor
   de Perfis) e de **escopo** (só o perfil VALENDO, e nunca `"none"` — «Não
   mexer no modo» não tem caminho de tela). **Espera a palavra dela** (§5 da
   sprint): `SO-GTK` é a lista que ela vai decidir *"migra ou morre com a
   janela"*, e tirar uma linha de lá muda o que ela decide.
2. **O portão dos donos pergunta só pelo nome da GTK.** Uma linha `SO-GTK` cujo
   comportamento a tela nova reimplementou com nome PRÓPRIO é invisível para
   ele — e é o caso normal, não o exótico, porque a interface nova não chama a
   janela. Fechar isso pede uma coluna nova no CSV (*"o símbolo do lado HTML, se
   houver"*) e uma quarta regra no `check_donos_de_comportamento.py`. **Não é
   trabalho desta sprint e não é de uma linha** — é mexer no portão e no mapa
   juntos, que é colisão garantida numa leva com irmãs em voo.
3. **A medição não tem chamador automático.** Ela roda fora da árvore, porque
   esta sprint não cria código. A receita inteira — o lar de mentira, os nove
   caminhos e as quatro mordidas — está na §6 do documento, e vira
   `scripts/ensaios/` num commit para quem tiver `scripts/` na posse. Pô-la na
   lista de portões exige mexer em `scripts/portoes.sh` **e** no `ci.yml` (o
   portão do portão compara os dois).
4. **A tabela publicada do mapa dos donos envelheceu, e eu não medi se é
   laudo datado ou fato vivo.**
   `docs/process/2026-09-05-O-DONO-DE-CADA-COMPORTAMENTO…` diz `SO-GTK` **15**
   e `CURADO` **6**; o CSV de hoje tem **9** e **12**. O texto ali não se
   declara como fotografia de 05/09, e quem o ler hoje decide com número
   errado. Não toquei: não é posse desta sprint, e a diferença é de outras
   levas, não desta.
