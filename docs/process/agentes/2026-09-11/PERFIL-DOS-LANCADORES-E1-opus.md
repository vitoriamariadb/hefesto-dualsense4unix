# PERFIL-DOS-LANCADORES-E1 — todo jogo instalado ganha perfil, venha de onde vier

**11/09/2026** · árvore `hefesto-voo/PERFIL-DOS-LANCADORES-E1-opus` · branch
`voo/PERFIL-DOS-LANCADORES-E1-opus`

---

## §0 — O ESTADO EM UMA LINHA

O elo que faltava era um só e fechou: `semear_perfis_dos_jogos` passou a somar,
à biblioteca da Steam, os jogos **instalados** dos cinco lançadores que o censo
lê. **Na máquina dela nasce UM perfil — *Marvel's Guardians of the Galaxy*, do
Heroic, `window_class: ["gotg.exe"]`, prioridade 80** — e os 27 perfis que ela
já tem ficam com o md5 intacto, medido.

---

## §1 — O NÚMERO DELA, medido numa CÓPIA da pasta de perfis

**Nada neste laudo foi medido escrevendo no disco dela.** A pasta de perfis foi
copiada para o `scratchpad` (com a marca junto), e a varredura rodou contra a
cópia, com `home=/home/vitoriamaria` — leitura da biblioteca, escrita na cópia.

```
PERFIS ANTES: 27
biblioteca Steam: 23 jogos · lançadores: 1 jogo com endereço
CRIADOS: 1
   + marvels_guardians_of_the_galaxy.json  (Marvel's Guardians of the Galaxy)  endereco=janela:gotg.exe
DESFECHOS: {'ja_semeado': 23, 'criado': 1}
```

**O perfil que nasce, byte a byte:**

```json
{"name": "Marvel's Guardians of the Galaxy",
 "match": {"type": "criteria", "window_class": ["gotg.exe"],
           "window_title_regex": null, "process_name": []},
 "priority": 80}
```

### Quantos ficaram de fora, e por quê — lançador por lançador

| lançador | estado | biblioteca | instalados | com chave de janela | **fora** | por quê |
| --- | --- | --- | --- | --- | --- | --- |
| **Heroic** | lido | 29 | 1 | **1** | 28 | não estão no disco |
| **Lutris** | lido | 0 | 0 | 0 | 0 | biblioteca vazia |
| **RetroArch** | lido | 7 | 7 | 0 | **7** | ROM não tem janela própria |
| **Dolphin** | lido | 1 | 0 | 0 | 1 | não está no disco |
| **mGBA** | lido | 0 | 0 | 0 | 0 | biblioteca vazia |

**36 jogos de fora, e cada exclusão tem razão escrita:**

* **28 do Heroic não estão baixados.** Semear os 28 encheria a lista de linhas
  que ela não pode abrir. Quem decide é `JogoDoLancador.instalado`;
* **7 ROMs do RetroArch não têm `classe_de_janela`.** Os emuladores rodam
  **todas** as ROMs no MESMO processo: um perfil por ROM casaria com o emulador
  inteiro. Quem decide é `classe_de_janela`, que devolve `""` sem `executavel`;
* **1 do Dolphin** pelo mesmo motivo do Heroic;
* **DLC e redistribuível** nem chegam aqui — `JogoDoLancador.e_acessorio` os
  corta no censo (8 medidos no disco dela em 10/09).

### O QUE EU DECIDI NÃO SEMEAR, e é decisão, não descuido

`jogos_locais.jogos_com_janela` — que é o que a aba Perfis oferece no campo
«Nome do Jogo» — traz **cinco** linhas na máquina dela, não uma:

```
heroic  gotg.exe                    Marvel's Guardians of the Galaxy
desktop azahar / mGBA / retroarch / SUPERZSNES   ← os EMULADORES, pelo .desktop
```

As quatro últimas são os **programas emuladores**, achados pelo
`StartupWMClass` dos `.desktop`. Semeá-las criaria quatro perfis para
*aplicativos*, não para jogos — e o perfil do «RetroArch» valeria para todas as
ROMs de uma vez, que é exatamente o que a sprint manda não fazer. A semeadura lê
`jogos_dos_lancadores` (só o censo), e não `jogos_com_janela`.

---

## §2 — O QUE A LINHA `schema.py:1799` PROTEGIA — medido antes de mexer

A linha era `if steam_appid_from_wm_class(wm_class) is None: return False` dentro
de `perfil_e_regra_de_jogo`. Ela já vinha depois de duas exigências (o `match`
ser `MatchCriteria` com `window_class`, e a janela em foco estar listada nele),
então a pergunta é: **o que ela corta que as outras duas não cortam?**

A medição rodou sobre os **27 perfis reais dela**, lidos e nunca escritos,
comparando o veredito de hoje com o da mesma função **sem a linha**:

```
PERFIS DELA QUE MUDAM DE VEREDITO SE A LINHA 1799 CAI SEM NADA NO LUGAR:
  personalizado.json   perfil='Personalizado'  wm_class='Hefesto-Dualsense4Unix'  prio=1
                       hoje=False -> sem-a-linha=True
  total: 1
```

**É UM SÓ, E É A JANELA DO PRÓPRIO PRODUTO.** O `personalizado.json` dela mira
`Hefesto-Dualsense4Unix` — a fábrica o entrega com `match: {"type":"any"}`, e o
que está no disco dela tem a `window_class` da janela do Hefesto gravada ali
(a assinatura do botão «Detectar» apertado com a própria janela em foco).

**O estrago que a linha impedia**, e ele acontece no pior momento possível:

1. `AutoSwitcher.travado()` — com o cadeado armado, ele **cede** à regra própria
   do jogo. Focar a janela do Hefesto passaria a valer como "abriu um jogo";
2. `AutoSwitcher._activate` (F2/R-01) — com `manual_trigger_active`, a regra do
   jogo **limpa a trava manual** e deixa o perfil entrar por cima. Ou seja: ela
   aplica um gatilho na aba, a janela do Hefesto está em foco (ela está olhando
   para ela), e o `Personalizado` pisaria no que ela acabou de fazer. É a queixa
   mais antiga desta casa — *"a config que eu deixo nunca é respeitada"* — de
   volta por outra porta.

Os outros 26 perfis dela são todos `steam_app_<id>` e **não mudam de veredito**
nem com a linha nem sem ela.

### A cura, e por que ela não é "afrouxar"

A pergunta *"esta janela é de um jogo?"* **não se responde olhando a janela**.
A Steam tem um CARIMBO (`steam_app_<id>`); um jogo do Heroic anuncia `gotg.exe`,
indistinguível de qualquer outro programa. **Quem sabe a resposta é o censo dos
lançadores**, que lê a biblioteca no disco — e `perfil_e_regra_de_jogo` roda a
2 Hz dentro do tique do autoswitch, onde não cabe leitura de disco.

Então o dono RESPONDE UMA VEZ por varredura e o predicado consulta:

```
schema._CLASSES_DE_JOGO_CONHECIDAS   ← cadastro, já em minúsculas
schema.registrar_classes_de_jogo()   ← UM escritor: loader.semear_perfis_dos_jogos
schema.e_endereco_de_jogo(wm_class)  ← carimbo da Steam OU classe declarada
```

**Vazio = o comportamento histórico, exatamente.** Sem ninguém ter declarado
nada (processo que não semeia, `SKIP_PRESET_SEED=1`, máquina sem lançador), o
predicado volta a ser o `steam_appid_from_wm_class(...) is not None` de antes.
É o fail-safe deliberado.

O cadastro se monta de **duas metades que se somam**, e nenhuma basta sozinha:

* a **biblioteca desta varredura** — o que está instalado agora;
* a **marca de semeadura** — o que este produto já tratou como jogo, inclusive o
  recusado por colisão de nome e o que já era dela.

---

## §3 — AS QUATRO ENTREGAS

### 1. A semeadura lê os outros lançadores

`semear_perfis_dos_jogos` passou de `jogos_da_biblioteca_steam(home)` para
`[*jogos_da_biblioteca_steam(home), *jogos_dos_lancadores(home)]`. O `match` do
jogo de lançador é `MatchCriteria(window_class=[<a classe>])` — a sexta forma do
`simple_match`, a mesma que o «Detectar» grava. **Prioridade 80 nos dois**: um
jogo do Heroic não é menos jogo que um da Steam.

**E o freio passou a assinar as duas bibliotecas.** `_talvez_semear_jogos`
comparava só a assinatura da `steamapps`; com o daemon de pé (o dela fica dias),
ela baixava um jogo pelo Heroic, o `mtime` da `steamapps` não mudava, a
assinatura dava igual e a varredura voltava sem olhar. Agora ele compara
`(assinatura_da_biblioteca(), assinatura_das_bibliotecas())`.
**O preço, medido e aceito:** quando o Heroic reescreve `store_cache/*_library.json`,
os 33 `.acf` da Steam são relidos — no máximo uma vez por
`INTERVALO_MINIMO_DA_VARREDURA_S` (5 min).

### 2. A marca distingue appid de chave de janela

`_linhas_da_marca` descartava toda linha cujo primeiro campo não fosse dígito.
Uma chave de janela crua seria **escrita e nunca relida** — e a consequência não
é cosmética: *o perfil renasceria a cada varredura, inclusive depois de ela o
apagar*, que é o contrato inteiro da marca virado do avesso.

A identidade agora tem duas formas, e elas não se confundem:

```
1715980                    ← appid da Steam (inalterado, compatível com a marca dela)
janela:gotg.exe            ← PREFIXO_DA_CHAVE_DE_JANELA + wm_class em minúsculas
```

A classe entra em minúsculas **na identidade** (o `pga.db` do Lutris guarda
`GOTG.exe` e a janela pelo Heroic anuncia `gotg.exe`) e **com a caixa do disco**
no `match` (quem dobra a caixa é o matcher do esquema, não quem escreve a regra).

`_appids_com_dono` virou `_donos_dos_jogos` e passou a enxergar as duas formas.

### 3. A troca automática aceita perfil de jogo que não é da Steam

Ver a §2 inteira. O que entrou no lugar da linha: `e_endereco_de_jogo(wm_class)`.

### 4. Criar à mão o que a semeadura não achou

*"e se por algum motivo não encontrar eu posso criar ou criar um perfil
duplicado do mesmo jogo"* — três provas em byte, cada uma num teste:

* **criar à mão não é recusado**: com o perfil semeado já no disco,
  `save_profile` grava o dela com a MESMA `window_class` e prioridade 90; os
  dois ficam na pasta, e o semeado sai da operação com os bytes que tinha;
* **a varredura seguinte não pisa**: três varreduras depois, o dicionário
  `{nome: bytes}` da pasta inteira é idêntico ao de antes;
* **a prioridade decide**: pelo seletor REAL (`ProfileManager.select_for_window`),
  quem entra com a janela `gotg.exe` em foco é o dela (90), não o semeado (80);
* e o caminho inverso — **ela criou primeiro** — dá `ja_tinha_perfil`, o arquivo
  dela byte a byte intacto, e a marca ganha `janela:gotg.exe\t` com o campo de
  arquivo VAZIO: o produto sabe que tratou o jogo e sabe que o arquivo não é dele.

---

## §4 — A PROVA, E A MORDIDA

**25 testes novos** em
`tests/unit/test_o_perfil_do_lancador_nasce_sozinho.py`. A prova é o BYTE: todo
teste de nascimento abre o `.json` com `json.load` e confere a `window_class`.

**Nenhum teste abre o piloto nem fala com o daemon vivo** — a biblioteca é falsa
sempre (`dest_dir` em `tmp_path`, `home` em `tmp_path` ou no lar de mentira da
`conftest.py`). Medido: no lar de mentira, `Path.home()/.var` **não existe** e
`jogos_dos_lancadores()` devolve `[]`, então a suíte não alcança o Heroic dela.

### As cinco mordidas, arrancadas uma a uma e medidas

| # | a cura arrancada | quem reprovou |
| --- | --- | --- |
| 1 | a semeadura volta a ler **só** a Steam | `test_o_jogo_do_heroic_ganha_perfil_sem_dubles` |
| 2 | a semeadura para de declarar as classes | `test_a_semeadura_declara_as_classes_ao_esquema` |
| 3 | o predicado volta a exigir o carimbo da Steam | `test_o_perfil_do_heroic_vira_regra_de_jogo_depois_de_declarado` |
| 4 | o freio volta a assinar só a Steam | `test_o_jogo_do_heroic_instalado_amanha_e_semeado_sem_reiniciar_o_daemon` |
| 5 | a marca perde o prefixo `janela:` | `test_a_marca_escreve_a_chave_de_janela_com_prefixo` |

**E a mordida da RÉGUA DE FIAÇÃO**, que é a que engana: a chamada de
`jogos_dos_lancadores` apagada **com o `import` deixado para trás** faz uma
régua de "o nome aparece no fonte" passar. A régua daqui lê `ast.Call` com
`ast.Name`, não citação — medido, e ela reprova nos dois casos (três testes
caem).

### O que NÃO tem régua, e fica escrito

O cadastro `_CLASSES_DE_JOGO_CONHECIDAS` é **estado de módulo, por processo**.
Uma `fixture` `autouse` no arquivo novo fotografa e repõe o valor — estado de
módulo que vaza entre testes é armadilha conhecida desta casa. O que ele **não**
cobre: um processo que carregue perfis com `SKIP_PRESET_SEED=1` nunca declara
nada, e o predicado fica no comportamento histórico. É de propósito e está
escrito na docstring do cadastro.

---

## §5 — O QUE ACHEI E NÃO CUREI, porque é de outro dono

**`profiles/manager.py:1574` decide `e_janela_de_jogo` pelo carimbo da Steam:**

```python
e_janela_de_jogo = steam_appid_from_wm_class(wm_class) is not None
```

É o mesmo defeito que a §2 fechou, na outra ponta. Consequências enquanto ele
ficar:

* o **veto do catch-all** (*"um genérico de desktop não tem autoridade sobre uma
  janela de JOGO"*) não vale para jogo de lançador — com o perfil do Heroic
  apagado por ela, um catch-all pode entrar na janela do jogo;
* o **`MOTIVO_JOGO_SEM_PERFIL_PROPRIO`** nunca dispara para jogo de lançador,
  então o **modo jogo padrão** (MODO-01/B3) não liga sozinho ali.

Com esta sprint o caso principal está coberto — o perfil EXISTE, é específico, e
a especificidade já vence o catch-all na seleção. A cura, para quem tiver o
arquivo: trocar por `e_endereco_de_jogo(wm_class)`, que já está exportado no
esquema. **`manager.py` não está na posse da E1 e eu não o toquei.**

**Um arquivo fora da posse foi tocado, e só em comentário:**
`integrations/censo_dos_lancadores.py` — a docstring de
`assinatura_das_bibliotecas` argumentava contra "somar as duas num freio", que é
justamente o que `_talvez_semear_jogos` passou a fazer. Deixar o argumento
contra ao lado do código que o contraria é o defeito que esta casa nomeia toda
semana. Nenhuma sprint ABERTA possui o arquivo (as três que o listam estão
`feita`). Zero linha de comportamento.

---

## §6 — OS ARQUIVOS

| arquivo | o que mudou |
| --- | --- |
| `profiles/loader.py` | `PREFIXO_DA_CHAVE_DE_JANELA`, `_identidade`, `_identidade_valida`, `classes_de_jogo_da_marca`, `classes_do_perfil_do_jogo_de_lancador`, `_classes_do_perfil`, `_donos_dos_jogos` (era `_appids_com_dono`), `_declarar_as_classes_de_jogo`, o desfecho `sem_endereco`, `PerfilSemeado.chave`/`.identidade`, a soma das duas origens e a assinatura em par |
| `profiles/schema.py` | o cadastro `_CLASSES_DE_JOGO_CONHECIDAS`, `registrar_classes_de_jogo`, `classes_de_jogo_conhecidas`, `e_endereco_de_jogo`, e a linha do `perfil_e_regra_de_jogo` |
| `integrations/jogos_locais.py` | só docstring: `jogos_dos_lancadores` ganhou um SEGUNDO leitor, e agora o que ela devolve vira arquivo no disco dela |
| `integrations/censo_dos_lancadores.py` | só docstring (ver §5) |
| `tests/unit/test_o_perfil_do_lancador_nasce_sozinho.py` | novo — 25 testes |

**O que NÃO foi tocado, como a sprint manda:** a interface (a lista da aba
Perfis já mostra o que está no disco), o `install.sh`, e o caminho da Steam, que
funciona há semanas — os 23 jogos dela saíram `ja_semeado`, um a um.
**Nenhum botão para semear:** é automático, pelas mesmas três portas de carga de
perfil de sempre.

---

## §7 — OS PORTÕES: 54 de 56, e os DOIS vermelhos não são desta frente

Cabeçalho conferido: a árvore medida é
`/mnt/Apate/Desenvolvimento/hefesto-voo/PERFIL-DOS-LANCADORES-E1-opus`.

| portão | o que acusa | de quem é |
| --- | --- | --- |
| `referencias-docs` | 5 mortas, todas `docs/process/agentes/2026-09-11/LINGUA-A{1..5}-opus.md` | **das frentes LINGUA-A1..A5**, que estão EM VOO nesta mesma onda. Fecha quando cada uma gravar o laudo que a própria sprint promete |
| `acentuacao` | 3, todas em `2026-09-11-A-SEGUNDA-LISTA-DELA-…-INDICE.md:89,94` (`paginas`, `codigo` ×2) | **do INDICE, posse `COORDENA`** — e as três são **citação literal dela** (itens 1 e 6 da §2). A cura é `<!-- noqa-acento: citação literal dela -->` na linha, nunca corrigir a digitação dela |

**Nenhum dos dois toca arquivo desta frente** — `git status` mostra só os seis
da §6, e nenhum dos citados está entre eles.

**E TRÊS VERMELHOS QUE ERAM MEUS FECHARAM NO CAMINHO**, cada um com a causa:

* `mypy` — `type: ignore[union-attr]` sobre um `object` iterado. Curado por
  `isinstance` que ESTREITA, e não por ignore mais largo;
* `casa-sabe` — `classes_de_jogo_conhecidas` nascia sem chamador em produção.
  Curado FIANDO (opção 1 das quatro): `e_endereco_de_jogo` passou a ler o
  cadastro por ela, que é também o certo — um `global` com dois leitores é duas
  verdades esperando divergir;
* `citacoes-no-codigo` — **e este é o que ensina.** Um `import` novo na linha 10
  de `schema.py` empurrou o arquivo inteiro em UMA linha, e **quatro endereços
  citados em quatro arquivos envelheceram de uma vez** — três deles em arquivos
  que esta sprint não pode tocar (`interface/aba10.py` está no `nao_toca`).
  A cura não foi reapontar as quatro citações: foi **não empurrar o arquivo** —
  a anotação passou a ser `object` com `isinstance`, sem import novo, e as
  quatro voltaram a apontar para o que prometem.
  *Acrescentar uma linha no topo de um módulo muito citado custa o preço de
  todas as citações a ele, e o preço é pago por quem não pode tocar nos
  citantes.*
