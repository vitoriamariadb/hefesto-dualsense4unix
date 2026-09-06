# PERFIS-SAO-PERFIS-01 — os gêneros viram Estilo de Jogo, e o perfil de jogo fica com nome e id

**Agente BPERF · 06/09/2026 · árvore `hefesto-voo/PERFIS-SAO-PERFIS-01-BPERF`,
branch `voo/PERFIS-SAO-PERFIS-01-BPERF`, nascida de `eb7b844c` (a costura da
ONDA A).**

Decisão dela: ***"os perfis que voltaram não fazem sentido. ação, aventura,
corrida. Isso não é perfil, isso é estilo de jogo."*** — os gêneros **somem da
lista e da semeadura, os arquivos ficam**; os 24 por jogo **ficam só com nome e
id**.

## O que mudou

| passo | onde | o que entrou |
| --- | --- | --- |
| 1 | `assets/` | os oito gêneros saíram de `profiles_default/` para `estilos_de_jogo/`. `seed_default_presets` **não mudou uma linha** — ele copia o que há na pasta, e na pasta ficou o `personalizado.json` |
| 2 | `loader.migrar_generos_para_estilos_de_jogo` | one-shot com marcador `.generos_viraram_estilo_de_jogo`: o gênero **intocado** vai para `profiles/estilos-de-jogo/` (fora do `glob("*.json")` de todo leitor da casa); o que ela editou **fica na lista, inteiro**, e o resultado o NOMEIA |
| 2b | `loader.load_profile` | uma **última camada de busca** na subpasta — o gênero saiu da LISTA e continua abrindo pelo nome |
| 3 | `loader.enxugar_perfis_de_jogo` | one-shot com marcador `.perfis_de_jogo_so_nome_e_id`: o perfil de jogo que ainda é o molde de 29/08 passa a ter três chaves; um com qualquer campo diferente não é tocado |
| 4 | `loader._payload_do_perfil_de_jogo` | o perfil de jogo **novo** já nasce com `name`, `match`, `priority` |
| — | `flatpak/*.yml`, `scripts/build_appimage_gui.sh` | levam a pasta nova; sem ela a migração do Passo 2 fica sem com o que comparar dentro do pacote e recua calada |

### As duas peças que a sprint não pedia e sem as quais a entrega seria metade

**A régua de "intocado" é o JSON DECODIFICADO, não os bytes.** A sprint dizia
byte a byte, e byte a byte funciona no disco dela — os oito são idênticos ao
asset hoje. Mas quem instalou o produto **antes da MODO-01** teve os cinco de
gênero REESCRITOS por `migrate_modo_jogo_nos_presets`, que copia `mode` do
próprio asset e regrava com `json.dumps(indent=2)`, mudando o espaçamento. Uma
régua byte a byte marcaria como *"editado por ela"* um arquivo que **o produto**
reformatou — e os oito ficariam na lista para sempre justamente na máquina de
quem instalou mais cedo. A comparação por valor cobre os dois casos; qualquer
diferença de VALOR continua sendo dela e recua.

**`load_profile` aprendeu a olhar a subpasta.** *"Nada se perdeu"* seria falso
na metade que importa: `session.json` e `active_profile.txt` guardam o NOME do
último perfil que ela ativou, e o daemon restaura por esse nome no boot. Se ela
tinha `navegacao` ativo em 06/09, sem esta camada o boot cairia sem perfil, com
um `last_profile_restore_failed` no journal — o mesmo estrago que
`_repontar_a_sessao_para_o_padrao_novo` evitou na renomeação do padrão, por
outra porta.

**A ORDEM em `_maybe_seed_presets` é decisão medida:** a migração dos gêneros
roda **depois** da MODO-01, nunca antes. Rodando antes, ela acharia o arquivo no
estado pré-MODO-01 — que É o de fábrica daquela época — e o moveria, deixando a
receita do futuro motor sem a seção que a MODO-01 existe para lhe dar.

## Qual mordida prova

Seis cortes, saída colada, cura devolvida (`12 passed` no fim de cada um).

**1 — devolvi o `acao.json` a `assets/profiles_default/`:**

```
E  AssertionError: a semeadura de fábrica entregou mais que o Personalizado:
   ['acao.json', 'personalizado.json'] — gênero não é perfil (decisão dela, 06/09/2026)
E  AssertionError: acao.json voltou para a semeadura — ele é Estilo de Jogo, não perfil
2 failed, 10 passed
```

**2 — tirei a comparação com a fábrica (a migração passa a mover pelo NOME):**

```
E  AssertionError: ResultadoDosEstilos(movidos=('acao.json', 'fps.json'), dela=(), …)
E  assert ('acao.json', 'fps.json') == ('acao.json',)
```

*O `fps.json` com a cor DELA dentro iria junto.*

**3 — arranquei a última camada de busca de `load_profile`:**

```
E  FileNotFoundError: perfil não encontrado: navegacao
```

**4 — `_e_perfil_de_jogo_intocado` passa a devolver `True` sempre:**

```
E  AssertionError: ['peak.json', 'stray.json']
E  assert ['peak.json', 'stray.json'] == ['stray.json']
```

**5 — devolvi `_payload_do_perfil` a `_semear_um_jogo`:**

```
E  assert ['name', 'ver..., 'leds', ...] == ['name', 'match', 'priority']
E  assert b'{\n  "name"...ity": 80\n}\n' == b'{\n  "name"...": false\n}\n'
2 failed, 10 passed
```

**6 — tirei a guarda do outro campo de critério do `match`:**

```
E  AssertionError: assert ['faith.json'] == []
```

*Um perfil com `process_name` junto é regra que ela escreveu, e seria enxugado.*

## O que NÃO verifiquei

* **Não rodei o produto, nem a janela, nem o piloto.** Esta sprint não toca
  tela; e rodar `hefesto_vivo.py` dispara as migrações one-shot no `~/.config`
  REAL, que é exatamente o que não pode acontecer aqui.
* **Não rodei a suíte inteira** — só o meu escopo e a vizinhança que a mudança
  de pasta alcança (19 arquivos, 501 testes, verdes).
* **Não vi a lista da aba 10 encolher com os olhos.** A régua mede o
  `glob("*.json")` do diretório, que é a fonte de `load_all_profiles` →
  `ProfileManager.list_profiles` → `profile.list`. Quem prova de verdade é o
  FECHO, depois do `install.sh`.
* **Não sei o que o motor de Estilo de Jogo vai querer do formato** desses oito
  arquivos. Eles ficaram no formato de perfil porque é o que a migração compara.

## O que sobrou para o próximo

**PARA O FECHO, depois do `install.sh` — e nesta ordem:**

1. `ls ~/.config/hefesto-dualsense4unix/profiles/*.json | wc -l` → **25** (era
   33: 8 gêneros saíram da lista);
2. `ls ~/.config/hefesto-dualsense4unix/profiles/estilos-de-jogo/` → **os oito
   arquivos**, byte-idênticos aos de `assets/estilos_de_jogo/`. **Se faltar um,
   pare**: nada nesta sprint apaga arquivo;
3. `cat .../profiles/stray.json` → **três chaves**;
4. o journal diz `generos_viraram_estilo_de_jogo` com `movidos` de oito nomes e
   `editados_por_ela=[]`, e `perfis_de_jogo_so_nome_e_id` com 24;
5. a aba Perfis abre **sem** Ação/Aventura/Corrida/Esportes/FPS/Navegação/
   point_and_click/fallback, e **com** os 24 jogos e o Personalizado;
6. se o perfil ativo dela era um gênero, ele **ainda carrega**: o boot não pode
   sair sem perfil.

**PARA A `QUEM-E-QUEM-02` (mesmo `loader.py`), o que ela precisa saber:**

* nasceram **duas migrações one-shot** em `_maybe_seed_presets`, no fim da fila,
  nesta ordem: `migrar_generos_para_estilos_de_jogo` e `enxugar_perfis_de_jogo`.
  A ordem contra a MODO-01 está justificada acima e **não se inverte**;
* `_seed_source_file` passou a ter **duas cascatas** — `profiles_default` e
  `estilos_de_jogo`. `_DEFAULT_SEED_SOURCE_DIRS` NÃO mudou: quem semeia varre a
  PASTA inteira, e juntar as duas ressuscitaria os oito na lista dela;
* `load_profile` ganhou uma camada **no fim** da busca (subpasta
  `estilos-de-jogo/`). Ela é a última de propósito: nada no diretório principal
  muda de comportamento;
* `_semear_um_jogo` grava por `_payload_do_perfil_de_jogo`, que é
  `_payload_do_perfil` **cortado** — as regras de omissão continuam com um dono
  só;
* o `glob("*.json")` do diretório de perfis segue **sem recursão** em todo
  leitor desta casa. A subpasta depende disso.

**PARA QUEM FOR CONSTRUIR O MOTOR DE ESTILO DE JOGO:** os oito arquivos de
`assets/estilos_de_jogo/` estão **congelados**, e o `LEIA-PRIMEIRO.md` de lá diz
por quê — mudá-los faz a migração dizer *"ela editou"* para todo mundo que tem a
versão anterior no disco.

## As duas medições que a sprint mandou relatar

**1 — o que o esquema faz com seção ausente (Passo 3).** Medido com o `Profile`
do produto:

| campo | perfil SEM a seção (default do esquema) | o que o `Personalizado` diz |
| --- | --- | --- |
| `leds.lightbar` | `(0, 0, 0)` | `(40, 80, 180)` |
| `leds.player_leds` | `[F, F, F, F, F]` | `[F, F, True, F, F]` |
| `leds.lightbar_brightness` | `1.0` | `1.0` |
| `leds.auto_player_colors` | `True` | `True` |
| `triggers` | `Off` / `Off` | `Off` / `Off` |
| `rumble` | `passthrough=True`, `policy=None` | idem |

**O esquema entrega o default DELE, não o que o `Personalizado` diz** — e a
decisão D1 dela (*"o perfil grava o que ela tocou"*) pede o segundo. **É
`profiles/schema.py`, que não é desta posse: fica RELATADO, não consertado.**

Aqui a diferença é **inócua por construção**: o arquivo enxugado já continha
exatamente o default do esquema, chave a chave — e há régua provando que o
`Profile` carregado é IDÊNTICO antes e depois
(`test_o_arquivo_enxuto_carrega_o_mesmo_perfil_de_antes`). O dia em que o
esquema passar a herdar do `Personalizado`, **os 24 mudam de comportamento** —
essa é a hora de reler esta linha.

**2 — a aba 10 tem lista fixa com os nove nomes?** **Não.**
`grep -n "acao\|aventura\|corrida" src/hefesto_dualsense4unix/app/actions/perfis_web.py`
dá três linhas, e as três são `explicacao_da_disputa` (o `acao` dentro de
"explicação"). `a10_perfis.py` dá zero. A aba lista o que `profile.list`
devolver — nada a mudar lá, e é por isso que o Passo 2 sozinho já tira as oito
linhas da tela.

## Nenhum byte foi ao `~/.config` dela

* **Todo caminho novo recebe `dest_dir`.** As duas migrações e os testes que as
  exercitam passam `tmp_path`; o único teste que usa `profiles_dir()` roda sob o
  `conftest`, que desvia `HOME` e os quatro `XDG_*` para o lar de mentira.
* **Não rodei o piloto nem o `install.sh`.**
* **Medido no disco dela, ao fechar:** os **33** `.json` continuam lá; os
  marcadores `.generos_viraram_estilo_de_jogo` e `.perfis_de_jogo_so_nome_e_id`
  **não existem**; não há subpasta `estilos-de-jogo/`; e o **mtime do próprio
  diretório é `2026-09-06 02:46:08`** — anterior a esta sessão inteira, o que
  significa que **nenhum arquivo foi criado ou removido lá** enquanto trabalhei.
* Os `*.json.lock` com mtime de agora são do **daemon vivo dela** (PID 1833,
  `/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix/.venv/bin/python`), que
  relê os perfis a cada troca de janela: o mtime de `stray.json.lock` avançou de
  `05:59:26` para `05:59:52` enquanto eu só rodava `pgrep`.

## Os instrumentos que passaram a medir o mundo de ontem

A mudança de pasta deixou **115 testes vermelhos em oito arquivos**, e a
assinatura dos oito é a mesma: *a régua tinha o endereço do dado escrito à mão*.
Nenhum media conteúdo que mudou — o conteúdo dos oito arquivos é byte a byte o
de antes. Todos foram apontados para as **duas** casas de fábrica, por função e
não por lista de quem mora onde:

| arquivo | o que fiz |
| --- | --- |
| `test_profiles_preset.py` (101) | `preset_path()` / `preset_em_alguma_casa()`; a poda de 26/08 passou a valer para as duas casas; `test_a_fabrica_embarca_nove` virou `..._em_duas_casas` e mede a SEPARAÇÃO — um gênero de volta à semeadura reprova |
| `test_modo01_*.py` (9) | `asset_de_fabrica()` |
| `test_o_preset_nao_escolhe_a_mascara.py` (2) | a régua da máscara passou a varrer as duas |
| `test_a_fabrica_nao_casa_com_a_loja.py` (2) | a régua da loja roda nas duas — o `navegacao.json`, onde a D-STEAM-SAI-DA-NAVEGACAO foi paga, mora na casa nova |
| `test_empate01_*.py` (2) | `FALLBACK_JSON` mudou de casa |
| `test_profile_loader.py` (1 + 2 SKIPs) | **dois `pytest.skip` viraram `assert`** — os testes de `aventura` e `corrida` teriam ficado calados a partir de hoje, verdes por AUSÊNCIA de dado |
| `test_perfil_padrao_personalizado_01.py` (1) | a semeadura agora tem **UM catch-all só**, que é exatamente o que `sanidade.MAX_CATCH_ALL_TOLERADOS` tolera |
| `test_o_carimbo_de_ponte_*.py` (1) | a exclusão do `personalizado` caducou: ele é o único preset que sobrou |
| `test_retrato_dos_dialogos_*.py` (1) | "perfil de fábrica" passou a ser "versionado em qualquer das duas" |
| `test_versoes_rancosas_e_seed_flatpak.py` (1) | o canário mudou para `personalizado.json`, e a paridade passou a cobrar a pasta nova nos dois empacotadores |
| `test_um_perfil_por_jogo_nasce_sozinho.py` (2) | mediam o contrato ANTIGO do Passo 4. O título já dizia *"e nada mais"* — virou literal |

## O que rodei

```
tests/unit/test_os_generos_nao_sao_perfis.py            12 passed
a vizinhança (19 arquivos)                             501 passed
tests/unit/test_um_perfil_por_jogo_nasce_sozinho.py     33 passed
bash scripts/portoes.sh                    TODOS VERDES — 43 portões
```
