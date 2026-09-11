# O RAIO DA RETIRADA — o que mais lia o «Modo» do perfil

> **ORDEM DELA, 11/09/2026:** *"veja se a remoção dessa info na aba perfil não*  <!-- noqa-acento: citação literal dela -->
> *vai quebrar o resto tambem."*  <!-- noqa-acento: citação literal dela -->

Medido em 11/09/2026, na árvore `hefesto-voo/O-RAIO-DA-RETIRADA-01-opus`
(`voo/O-RAIO-DA-RETIRADA-01-opus`, nascida de `onda/0911b`), com um lar de
mentira — `HOME` e os quatro `XDG_*` desviados — e **sem bancada**: nenhum
DualSense foi tocado, nenhum daemon parado, nenhum `systemctl` chamado.

---

## §0 — A RESPOSTA, EM UMA FRASE

**A retirada não quebrou nada do produto: os dezenove leitores de
`Profile.mode` leem o CAMPO, e nenhum deles lia o quadro — o que quebrou foi
UMA linha do mapa dos donos, que ainda afirma que a tela nova não edita o modo,
e o portão dela é estruturalmente cego a isso.**

Nove caminhos medidos, nove de pé. A única quebra é de MAPA, custa uma linha de
CSV, e não tira nem devolve nada à mão dela.

---

## §1 — O QUE SAIU, e por que a pergunta dela é boa

A `PERFIS-A-TELA-01` tirou do editor da aba Perfis o quadro «Modo» com os
quatro botões, o gesto `editor_modo` de
`src/hefesto_dualsense4unix/interface/pacotes/a10_perfis.py` (hoje lápide em
comentário) e a constante `MODO_DO_PERFIL` de
`src/hefesto_dualsense4unix/app/actions/perfis_web.py`. O laudo dela está em
[`docs/process/agentes/2026-09-11/PERFIS-A-TELA-01-opus.md`](agentes/2026-09-11/PERFIS-A-TELA-01-opus.md).

**A pergunta dela mira o risco certo, e o risco tem nome:** o que saiu foi um
ESCRITOR, e o campo que ele escrevia ficou **invisível nesta aba**. Os gestos
que sobraram no editor gravam o perfil INTEIRO — um deles que reconstruísse o
`Profile` sem a seção apagaria o modo dela **sem nada na tela para mostrar**.
Enquanto o quadro existia, os quatro botões apagariam no tique seguinte; sem
ele, ela só descobriria no dia em que o perfil deixasse de ligar o que ela
pediu.

---

## §2 — OS LEITORES DE `Profile.mode`, e o que cada um dependia

O censo é por **árvore de sintaxe**, não por `grep` — é a armadilha que a §3 da
sprint nomeia: *o portão da paridade conta PROSA como uso*, e foi assim que a
linha 384 do CSV da paridade ficou verde sobre um símbolo morto até 11/09. O
classificador separa três coisas que um `grep` mistura:

| espécie | quem a enxerga | quantos | entra na tabela? |
| --- | --- | ---: | --- |
| **CHAMADA** — nó de código que lê ou escreve o campo | `ast` | **19** | **sim**, é a tabela abaixo |
| **COMENTÁRIO** — lápide, razão datada, aviso | `tokenize` (comentário nem vira nó de sintaxe) | 88 | não: registro não é uso |
| **STRING/docstring** — `"editor.modo"` numa declaração, a frase de uma régua, o parágrafo que explica | `ast.Constant` | 78 | não: prosa não é uso |

Os dois últimos números são as ocorrências em `src/` de qualquer um de dez
termos do assunto (`Profile.mode`, `ProfileModeConfig`, `mode_applier`,
`editor_modo`…) — é a medida do quanto um `grep` inflaria a resposta: **166
contra 19**.

O censo desconta os **forasteiros de nome igual**: `triggers.left/right.mode` é
o preset do gatilho, `trigger.mode` é o byte do efeito, e `native.mode.set` é
método de IPC. Nenhum é `Profile.mode`.

### Os dezenove — nove leem, oito escrevem, dois fazem os dois

Nenhum endereço é citado por número de linha sozinho: o símbolo vem junto,
porque linha caduca a cada edição acima dela.

| # | endereço | símbolo | o que faz | dependia do quadro? |
| ---: | --- | --- | --- | :-: |
| 1 | `profiles/manager.py:853` | `ProfileManager.apply_emulation` | **O leitor que decide.** Entrega a seção (inclusive `None`) ao `mode_applier` a cada ativação — é por aqui que ATIVAR liga o modo | **não** |
| 2 | `profiles/manager.py:2005` | `alinhar_o_modo_com_a_ponte` | lê o `mode` atual para trocar só a máscara quando ela sobe a ponte com o controle na mão | **não** |
| 3 | `profiles/manager.py:1779` | `ProfileManager.alinhar_o_modo_do_appid` | lê `salvo.mode.gamepad_flavor` para o journal | **não** |
| 4 | `daemon/lifecycle.py:3034` | `Daemon._drenar_modo_pendente` | relê `pendencia.mode` quando o lock de gesto manual expira e o modo adiado enfim entra | **não** |
| 5 | `daemon/lifecycle.py:4320` | `Daemon._profile_rule_matches_game` | *"este perfil é um jogo com máscara?"* — `kind == "gamepad"` + `match` por critério | **não** |
| 6 | `daemon/launch_env.py:1285` | `arm_launch_profile` | arma o `steam_app_<id>.env` que o jogo lê no `exec` | **não** |
| 7 | `daemon/launch_env.py:1833` | `_nativos_fora_da_antecipacao` | decide se o `default.env` pode omitir o IGNORE | **não** |
| 8 | `daemon/launch_env.py:1970` | `_modo_antecipado` | o prognóstico do que o jogo vai encontrar | **não** |
| 9 | `integrations/ponte_escada.py:371` | `ponte_do_perfil` | a ponte que o perfil pede, por duck-typing (o módulo não importa o esquema de propósito) | **não** |
| 10 | `profiles/sanidade.py:212` | `_catch_all_com_cara_de_jogo` | o `doctor`: catch-all com `kind=="gamepad"` declara opinião e some do aviso | **não** |
| 11 | `profiles/schema.py:1870` | `perfil_declara_modo_de_jogo` | o predicado compartilhado (`gamepad`/`native`), com `getattr` defensivo | **não** |
| 12 | `profiles/loader.py:550` | `_coop_local_intocado` | lê `mode` do JSON CRU para saber se a fábrica ainda está intocada | **não** |
| 13 | `profiles/loader.py:614` | `migrate_modo_jogo_nos_presets` | one-shot: leva `mode` do asset ao preset já instalado, e **só onde ainda não há nenhum** | **não** |
| 14 | `app/actions/perfis_web.py:512` | `_pacote_do_editor` | publica o modo **como id** para a página — e continua publicando, porque o dado continua no disco | **não** — o dono do dado não é da aba 10 |
| 15 | `app/draft_config.py:672` | `DraftConfig.from_profile` | fotografa `source_mode` ao abrir o perfil | **não** |
| 16 | `app/draft_config.py:937` | `DraftConfig.with_profile_identity` | refotografa depois de gravar, para o `mesmo_perfil` voltar a dizer a verdade | **não** |
| 17 | `app/draft_config.py:852` | `DraftConfig.to_profile` | **ESCREVE**: reemite `source_mode` quando o nome é o mesmo; com nome novo, zera (R-11) | **não** |
| 18 | `interface/pacotes/perfil.py:535` | `gravar_o_modo_no_ativo` | **ESCREVE** a seção do perfil que está VALENDO — é o escritor dos chips da aba Jogar | **não** — nunca foi da aba 10 |
| 19 | `app/actions/profiles_actions.py:4047` e `:4559` | `_populate_editor` · `_build_profile_from_editor` | o editor de Modo da **janela GTK**, lado do `mode` | **do quadro DELA, que é outro** |

**A COLUNA DA DIREITA É A RESPOSTA:** *nenhum leitor lia o quadro.* O quadro
era um **escritor** — quem lia era sempre o campo, que não foi tocado. É por
isso que a retirada podia sair barata, e saiu.

A linha 19 é a única com «sim» e o «sim» é de outro quadro: o da janela GTK,
que está sendo aposentada (`D-0609-GTK-LEVA-INTEIRA`) e cujo `main.glade` já
não existe no disco. Ela não é dívida desta retirada.

**A CLI não tem leitor próprio.** `profile show` imprime
`profile.model_dump(mode="json")` inteiro e `profile save --from-active`
redump-e-revalida: as duas carregam `mode` sem nunca nomeá-lo, e por isso não
há o que quebrar ali. `profile activate` vai por `profile.switch`, que cai na
linha 1 desta tabela.

---

## §3 — AS SEIS PERGUNTAS, MEDIDAS

Nove caminhos, rodados num lar de mentira. A §6 diz como refazer.

### 1. Quem lê `Profile.mode` hoje? — **de pé**

A tabela da §2: dezenove nós de código, **oitenta e oito** comentários e
setenta e oito strings. **Zero leitores dependiam do quadro.**

> **UM NÚMERO ERRADO, SUBSTITUÍDO:** aqui se lia *"onze comentários"*, contra
> os **88** da tabela da §2 — dois números para a mesma medição, no mesmo
> documento. A aritmética do próprio texto decide: 88 + 78 = **166**, que é o
> total que a §2 publica duas vezes (*"166 contra 19"*). O 88 fica; o onze sai.

### 2. O `Ativar` continua aplicando o modo? — **de pé**

```
ProfileManager.activate(origin='manual') → mode_applier recebeu
  ProfileModeConfig(kind='gamepad', gamepad_flavor='xbox') (origin='manual')
relatorio['mode'] = 'aplicado'
```

O caminho inteiro, e ele não passa por tela nenhuma: o botão «Ativar» da aba
Perfis pede `profile.switch` ao daemon (`a10_perfis.ativar`), o handler
`_handle_profile_switch` chama `manager.activate`, e `apply_emulation` entrega
a seção ao applier do daemon.

### 3. O autoswitch entra com o modo certo? — **de pé**

```
AutoSwitcher._tick (janela steam_app_1245620) → escolheu 'Pragmata'
  → mode_applier recebeu ProfileModeConfig(kind='gamepad', gamepad_flavor='xbox')
    (origin='autoswitch')
```

Medido pelo `_tick`, não pelo `_activate`: dois tiques, porque o primeiro só
abre a contagem do debounce. **É a pergunta que mais importava** — ninguém
clica nada aqui, e uma quebra seria silenciosa por definição. O autoswitch não
lê o campo: ele chama `manager.activate`, o mesmo funil da pergunta 2.

### 4. `Duplicar`, `Voltar à de ontem` e `Importar`/`Exportar` preservam? — **de pé**

```
4a  a10_perfis.duplicar        → cópia no disco com mode={'kind':'gamepad', …}
4b  voltar-a-de-ontem          → gravei COM, regravei SEM (None), voltou COM
4c  editor.prioridade no ATIVO → disco com mode={'kind':'gamepad', …}
4d  editor.nome no ATIVO       → sackboy.json com mode={'kind':'gamepad', …}
4e  rodape.exportar/importar   → o .json levado e trazido mantém o mode
```

**4c e 4d são o buraco que faltava**, e valem por si: a régua que a
`PERFIS-A-TELA-01` deixou mede os gestos do editor com `active_profile: None`,
e nesse estado `_com_o_que_esta_valendo` devolve o perfil do DISCO e vai
embora. Com o perfil **ativo** o gesto passa por
`rodape._draft_do_ativo` → `DraftConfig.to_profile`, que é outro código e tem
o portão `mesmo_perfil` do R-11 no caminho — o mesmo portão que, com nome novo,
**zera `match`, `mode` e `suppress_desktop_emulation` de propósito**. Medido
nos dois: o modo atravessa, **inclusive o RENOMEAR**.

> **FATO ERRADO, SUBSTITUÍDO na conferência de 11/09** — esta linha dizia que
> *"o `source_name` casa por slug, o `mesmo_perfil` responde verdadeiro"*, e a
> medição derruba: `slugify("Stray")` é `stray`, `slugify("Stray BR")` é
> `stray_br`, e num draft fotografado de um perfil o `to_profile` com nome novo
> devolve `mode=None` — o R-11 zera, como ele promete zerar.
>
> **O QUE DE FATO SALVA O RENOMEAR É OUTRA COISA, e é mais frágil:**
> `interface/pacotes/a10_perfis.py:2447` chama `_com_o_que_esta_valendo(era, ctx)`
> com o nome **VELHO**, e só em `:2457` faz `model_copy(update={"name": novo})`.
> **O portão nunca vê o nome novo.** Conferido linha a linha.
>
> **POR QUE A CORREÇÃO IMPORTA, sendo o desfecho o mesmo:** a frase velha
> ensinava que o R-11 protege renomeação por slug. Ele **não protege**. Quem
> mover o `rename` para antes do `to_profile` — uma refatoração inocente —
> perde a seção `mode` dela **calado**, e teria a página como aval.

`Exportar` copia o arquivo byte a byte e `Importar` regrava o JSON cru depois
de validar — nenhum dos dois reserializa o perfil, então não há como perderem
um campo. Os dois moram no rodapé (`interface/pacotes/rodape.py`), que a
retirada não tocou.

### 5. A semeadura cria perfil com que modo? — **de pé, e com DUAS travas**

```
semear_perfis_dos_jogos → ['pragmata.json']
  chaves = ['match', 'name', 'priority'] · mode = <ausente>
```

Perfil de jogo nasce **sem a seção** — «Não mexer no modo», o sem-opinião —, e
esse valor **não mudou com a retirada**: ele é de `PERFIS-SAO-PERFIS-01`
(06/09), anterior ao quadro. Duas travas independentes o garantem, e a
descoberta de que são duas veio de uma mordida que NÃO mordeu: o molde
(`loader._perfil_do_jogo`, que nasce sem a seção) e a peneira do payload
(`loader.CHAVES_DO_PERFIL_DE_JOGO`, que só deixa passar nome, regra e
prioridade). Arrancar só a primeira deixa a medição verde.

### 6. Sobrou peça sem chamador, ou chamador sem peça? — **UMA, e é do mapa**

No código, **nada**: `data-hef="editor.modo"`, `data-modo` e a regra
`.campo.modo` têm zero ocorrências em `interface/paginas/10-perfis.html` e em
`mockup/10-perfis.html`; o componente `.seg` não aparece mais na página; as
réguas que citavam o quadro **inverteram** em vez de morrer (a de
`tests/unit/test_steam_input_ponteiros.py` passou a exigir que a isenção
continue VAZIA).

Os nomes mortos (`editor_modo`, `editor.modo`, `MODO_DO_PERFIL`,
`botoes_do_modo`) têm **doze ocorrências em `src/`**, e as três espécies se
separam limpas: **duas são código VIVO** — a régua de `interface/aba10.py` que
proíbe `data-hef="editor.modo"` de voltar à página, e a declaração de
`editor.modo` em `a10_perfis.SEM_ENDERECO`, que é o que impede a chave de cair
no vazio calada —, e as outras **dez são comentário ou docstring**, isto é,
lápide. A sprint declara que lápide não é defeito, e nenhuma das duas vivas
EXIGE o quadro: as duas exigem que ele continue fora.

A quebra está na §4.

---

## §4 — A QUEBRA: `docs/data/donos-de-comportamento.csv:48`

> **FECHADA NA COSTURA — 11/09/2026.** A linha foi reclassificada de `SO-GTK`
> para `DIVERGE`, com `aba` 10→01, `onde_html` apontando para
> `interface/pacotes/a01_jogar.py:_gravar_o_modo` e a razão dizendo os DOIS
> pontos em que os lados de fato divergem — o alcance (a tela nova só escreve
> no perfil ATIVO) e o valor «Não mexer no modo», que os chips não emitem. As
> duas são decisão dela de 11/09, não dívida. `check_donos_de_comportamento.py`
> verde: 50 comportamentos com dono vivo.
>
> **O QUE NÃO FECHOU, e fica com endereço:** a cegueira do portão, descrita
> abaixo. Ela é estrutural — a regra `SO-GTK` pergunta se a tela nova chama o
> símbolo do **GTK**, e um comportamento reimplementado com outro nome passa
> por baixo dela **por desenho**. Curá-la pede um campo que diga o símbolo novo
> numa linha que, sendo `SO-GTK`, tem `onde_html` vazio por definição. **É
> frente própria, e não nasce nesta leva.**

**O que a linha diz hoje:**

```
perfil.editor.modo,10,app/actions/profiles_actions.py:_set_mode_editor,,SO-GTK,,
  "O modo do perfil (Hefesto ou puro, e o sabor da máscara) não é editável na tela nova."
```

**`SO-GTK` quer dizer *"pronto e testado na janela, ausente na tela nova"*. É
falso, e foi medido:**

```
perfil.gravar_o_modo_no_ativo (o escritor dos chips da aba Jogar)
  → escreveu em 'Pragmata'
  disco antes = None   depois = {'kind': 'gamepad', 'gamepad_flavor': 'dualsense'}
```

A tela nova edita `Profile.mode` desde sempre, pela aba Jogar:
`a01_jogar._gravar_o_modo_do_chip` → `_gravar_o_modo` →
`interface/pacotes/perfil.gravar_o_modo_no_ativo`. Foi ELA quem derrubou o
fato, e a `CADEADO-E-O-FATO-01` já o substituiu em quatro lugares no mesmo dia —
o docstring do escritor, a linha 384 de `docs/data/paridade-gtk-html.csv`, a
§3.1 da sprint `PERFIS-A-TELA-01` e a tabela de
`2026-09-03-O-TERCEIRO-NUMERO…`. **Esta linha ficou de fora**, e é exatamente a
correção pela metade que a regra desta casa existe para matar: duas versões
vivas do mesmo fato, em dois CSV do mesmo repositório.

### E O PORTÃO DELA É CEGO A ISSO POR DESENHO — medido

`scripts/check_donos_de_comportamento.py` tem a regra certa (*"SO-GTK que já
migrou: o portão vê o símbolo ser CHAMADO em `interface/` e manda
reclassificar"*), e ela pergunta pelo símbolo da coluna `dono`:

```
_quem_cita('_set_mode_editor')        -> []
_quem_cita('_mode_section_from_editor') -> []
_quem_cita('gravar_o_modo_no_ativo')  -> ['interface/pacotes/a01_jogar.py']
_quem_cita('secao_do_modo')           -> ['interface/pacotes/perfil.py']
```

O portão pergunta pelo nome da GTK; a tela nova implementou o comportamento com
**nome próprio** e nunca chamou o da GTK. A regra 3 só pega o caso em que
alguém *liga o fio ao símbolo antigo* — e a interface nova, por decisão de
arquitetura, não liga fio nenhum à janela. **É a assinatura que esta casa já
nomeou: o instrumento respondia sobre outra coisa que não o produto.** O portão
está verde, e a linha está errada.

### O que se perde na mão dela, e quanto custa curar

**Na mão dela: nada.** A linha é laudo, não código; nenhum gesto muda, nenhum
perfil muda, nenhum byte vai ou deixa de ir ao aparelho. O custo é de quem lê o
mapa depois: ele diz *"falta trabalho"* sobre trabalho feito — que é o modo de
mentir que o próprio cabeçalho do portão chama de **"mentir para menos"**.

**Custa curar:** uma linha de CSV, e a forma já está decidida pela irmã dela. A
`paridade-gtk-html.csv:384` foi de `FALTA_NO_HTML` para `DIFERENTE` com o sinal
trocado para `gravar_o_modo_no_ativo`; aqui o desenho equivalente é sair de
`SO-GTK` para um dos `DIVERGE*` — a divergência é de **lugar** (a fileira de
chips da Jogar, não um quadro no editor de Perfis) e de **escopo** (só o perfil
que está VALENDO, e nunca `"none"`, então «Não mexer no modo» não tem caminho
de tela) —, com `onde_html` apontando para
`interface/pacotes/perfil.py:gravar_o_modo_no_ativo`.

**NÃO CUREI**, e a razão é dupla: `docs/data/donos-de-comportamento.csv` não
está na `posse:` desta sprint, e a escolha do veredito novo tem consequência —
`SO-GTK` é a lista que ela vai decidir *"migra ou morre com a janela"*, e tirar
uma linha de lá muda o que ela decide. **A decisão é dela**, e está na §5.

---

## §5 — O QUE EU **NÃO** MEDI

* **O aparelho.** `bancada: false`, e a bancada não foi pedida. Que o
  `mode_applier` do daemon vivo *faça* o que o relatório diz — subir o gamepad
  virtual, soltar o controle no Nativo — **não foi medido aqui**. O que provei
  é que a seção CHEGA ao applier com o valor certo, pelos dois caminhos
  (manual e autoswitch). A prova de aparelho é da `MESA-DE-QUATRO-01`.
* **A tela.** Não abri janela nenhuma. A retirada visual já foi medida e
  fotografada pela `PERFIS-A-TELA-01`; refazer aquilo seria remedir.
* **A aba Jogar como TELA.** Exercitei o escritor dela
  (`gravar_o_modo_no_ativo`) direto, não os quatro chips pelo WebKit. Que os
  chips estejam desenhados e clicáveis é do laudo daquela aba.
* **`docs/data/mapa-controles.csv`: nenhuma célula foi exercitada.** O mapa de
  canais é do aparelho — report id, offset, comando — e `Profile.mode` é dado
  de perfil em disco. Não há `chave` a relatar, e inventar uma seria poluir o
  mapa.
* **A suíte inteira.** Rodei os quatro arquivos do escopo (42 testes, verdes) e
  os portões. Os doze lotes são de quem costura.
* **A `O-SALVAR-DA-JOGAR-01`**, que roda agora e mede o que a aba Jogar GRAVA.
  A entrega dela não existia quando esta fechou; se as duas se cruzarem em
  `gravar_o_modo_no_ativo`, a dela é a que mediu a aba.

### O QUE A CONFERÊNCIA ACRESCENTOU A ESTA SEÇÃO — 11/09/2026

**Duas coisas que faltavam, e a segunda é a que a própria §1 tinha nomeado como
o perigo.**

**(a) O ELO `source_mode` FICOU FORA DA TABELA DOS DEZENOVE, e nele há um
ESCRITOR.** A tabela conta o campo `Profile.mode`; o rascunho tem um espelho, e
ele decide se a seção sobrevive a um Salvar com nome novo:

| onde | o que é |
| --- | --- |
| `app/draft_config.py:957`, `:970` — `DraftConfig.with_mode` | **ESCREVE** `source_mode` e acende `mode_dirty` — o quarto escritor |
| `app/actions/home_actions.py:1896` | o **único** chamador de `with_mode` em `src/`: é por aqui que a janela GTK escreve o modo |
| `app/actions/home_actions.py:1847`, `:2098`, `:3064` | leem `source_mode` pelo rascunho |
| `app/actions/profiles_actions.py:4555` | lê `mode_dirty` — o par do `with_mode`, e é ele que fecha o elo |
| `daemon/ipc_handlers.py:961` | lê o desfecho (`relatorio["mode"]`) que o leitor nº 1 escreve — é por ele que a tela sabe se o modo entrou |

**Nenhum dependia do quadro retirado** — o de `home_actions` é o quadro da
JANELA, que é outro. A conclusão da §0 não muda; **o levantamento estava
incompleto**, e um censo que corta o elo do rascunho não responde *"quem mais
lia"*.

**(b) CINCO ESCRITORES DO PERFIL INTEIRO NA MESMA TELA não foram medidos** —
e a §1 deste laudo nomeia exatamente esse perigo: *"um deles que reconstruísse
o `Profile` sem a seção apagaria o modo dela sem nada na tela para mostrar"*.
A medição parou em dois dos sete. **A conferência mediu os cinco que faltavam,
no disco, com o perfil ATIVO e `mode` gravado — e os cinco PRESERVAM:**

`a10_perfis.py:2589` (`editor.ambiente`) · `:2806` (`editor.estilo`) · `:2898`
(`editor.jogo`) · `:2985`/`:2991` (`detectar`) · `rodape.py:382` (`salvar`).

**Os dois que mais mereciam a medição eram justamente estes:** o
`editor.estilo` **não faz `model_copy`** — passa por `_com_o_estilo`, que MONTA
outro perfil; e o `rodape.salvar` é o Salvar que esta casa pegou **destruindo
campo em 05/09**. Os dois passaram.

**E sobram dois lidos, não medidos:** `a02_controles.py:3362` e
`a05_vibracao.py:1749`, que chamam `to_profile(nome, …)` com o **mesmo** nome
— logo `mesmo_perfil` verdadeiro, logo a seção passa. **É leitura, não
medição**, e agora está dito.

---

## §6 — COMO REFAZER A MEDIÇÃO

O ensaio rodou fora da árvore (a sprint não cria código), e a receita é curta o
bastante para caber aqui — que é o que impede a medição de morrer com a sessão.

**O lar de mentira, antes de qualquer import do produto:** `HOME` e
`XDG_CONFIG_HOME`/`XDG_DATA_HOME`/`XDG_STATE_HOME`/`XDG_CACHE_HOME` para um
`mkdtemp`, e um `assert` de que `loader.profiles_dir()` caiu lá dentro. Sem o
`assert`, a medição escreveria no `~/.config` real dela.

**Os nove caminhos:** um `Profile` com `mode=ProfileModeConfig(kind="gamepad",
gamepad_flavor="xbox")` gravado por `loader.save_profile`, e então —
`ProfileManager(controller=FakeController(), store=StateStore(),
mode_applier=<espião>).activate(...)`; `AutoSwitcher(...)._tick` duas vezes;
`a10_perfis.duplicar` · `voltar_a_de_ontem` · `editor_prioridade` ·
`editor_nome` com um `Contexto(state={"active_profile": …})` e uma ponte de
mentira; `rodape.exportar`/`importar` com `escolher_arquivo`/`salvar_arquivo`
dublados; `loader.semear_perfis_dos_jogos(dest_dir=…, jogos=[JogoLocal(…)])`; e
`perfil.gravar_o_modo_no_ativo({"active_profile": …}, "gamepad", "dualsense")`.

**AS QUATRO MORDIDAS, e é o que separa esta medição de uma que só sabe passar.**
Cada uma arranca UMA cura em memória, e a coluna diz quais respostas caem:

| mordida | o que se arranca | cai |
| --- | --- | --- |
| `funil` | `perfil.gravar_e_reaplicar` passa a gravar com `mode=None` | 4a · 4c · 4d |
| `historico` | `loader.restaurar_do_historico` devolve o arquivo sem `mode` | 4b |
| `applier` | o `ProfileManager` nasce sem `mode_applier` (o daemon para de injetar) | 2 · 3 |
| `semeadura` | `loader._perfil_do_jogo` ganha `mode` **e** `CHAVES_DO_PERFIL_DE_JOGO` ganha `"mode"` | 5 |

As quatro morderam. A `semeadura` **não mordeu na primeira tentativa** — foi
assim que as duas travas da pergunta 5 apareceram.
