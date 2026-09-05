# ONDA2-09 · A aba Sistema — o botão que mentia o nome, e os nove segundos calados

**04/09/2026.** Sprint `ONDA2-09-SISTEMA-01`, árvore `hefesto-voo/ONDA2-09-SISTEMA-A9`,
branch `voo/ONDA2-09-SISTEMA-A9`. As três decisões do PO desta aba são sobre o
**mesmo botão**, e as três fecharam.

---

## O que mudou

### [01] O nome virou o trabalho — **"Reaplicar ajustes"**

O botão dizia "Atualizar" e a dica dizia *"Relê tudo o que esta aba mostra. **Não
muda nada.**"* — e a segunda frase era falsa: o clique manda o IPC
`daemon.reload`, que faz o serviço reaplicar a configuração e rematerializar os
arquivos de ambiente que a Steam usa para lançar jogo. A metade barata (reler a
aba) **já acontece sozinha a cada 2 s** (`a09_sistema.LENTO_S`).

A dica passou a dizer os dois trabalhos, na ordem em que acontecem, e **sem
número**: os 9,5 s foram medidos no daemon DELA, e uma tela que crava tempo de
máquina alheia é a mesma espécie de afirmação que esta casa derrubou em 28/08 (a
dica que dizia 60% sobre um teto de 30%).

### [02] Apagado e ainda assim responde — três botões

`Retomar`, `Reiniciar o serviço` e `Ver os plugins carregados` passam a nascer
cinzas quando não há o que fazer, com a razão no `?` ao lado. A peça é a das dez
(`monta.botao_cinza`, da ONDA0-F) e **nada dela foi reescrito**: o botão leva
`data-hef-alvo="classe"` acendendo `apagado`, o `data-hef-atributo="aria-disabled"`
derivado da mesma classe (ONDA0-P), e o `?` com a `.dica` no **mesmo**
`data-campo`. Nenhum emite `disabled`, que mataria o clique — e o clique é o
único caminho de quem chega pelo controle até a razão.

**A razão não é digitada em lugar nenhum desta frente.** Ela é a de
`gui/aba_sistema.travas()`, que já existia e que a aba já consultava no clique
desde 03/09. O que faltava era a metade da tela.

**O endereço deriva do GESTO** (`retomar-razao`, `reiniciar-razao`,
`ver-plugins-razao`): quem fica cinza é o botão, e o botão É o gesto — `_gesto()`
já cobra que ele tenha dono declarado no produto.

**O que esta aba acrescentou à peça é uma caixa, e ela é de ALTURA:** o `.acao`.
`.col-acao` e `.lista` são colunas de flex, e um `?` solto ali vira **fileira** no
instante em que o piloto o mostra. Medido com o invólucro arrancado de propósito:
a faixa passa de **156 → 200 px** e o miolo começa a **rolar 43 px por dentro** —
a mesma família dos 93 px que a aba escondeu em 28/08.

### [03] O botão diz que está trabalhando — **"Reaplicando…"**

`data-hef-em-voo="Reaplicando…"` no botão do `daemon.reload`. O mecanismo é da
ONDA0-P; o que esta frente entrega é o **atributo no botão certo, com a palavra
certa** — e quem publica o atributo é quem responde por caber (a ONDA0-P mediu
que o texto transborda um botão de ícone de 20 px; aqui a coluna tem 184).

### E um DEFEITO VIVO, achado medindo

`pacote()` tem um `return` curto para quando a camada do produto **levanta** — e
ela levanta com o serviço fora do ar. Ele já carregava os `blocos:` dos rótulos,
pela razão escrita ali: *"a aba inteira emudece, e é exatamente o instante em que
ela precisa ler «Ativar o serviço»"*. **As razões do cinza não iam junto.** Os
três botões ficavam com a cara clicável do desenho no minuto exato em que os três
têm motivo para estar apagados. Curado no mesmo commit, com régua própria.

*A regra que isso deixa: **o ramo de erro é um caminho, e ele tem de dizer o
mesmo que o de sucesso.***

---

## Qual mordida prova — e a foto, e o clique

### A foto, antes e depois (bancada, `olhar.py`, Chrome 1920×1080)

`ONDA2-09-antes.png` · `ONDA2-09-depois.png`. **Um pixel só muda**, e está
medido com `compare`/`convert` do ImageMagick:

```
$ compare -metric AE ONDA2-09-antes.png ONDA2-09-depois.png /dev/null
660
$ convert ...-antes.png ...-depois.png -compose difference -composite -format "%@" info:
104x10+796+339
```

660 pixels, todos dentro de uma caixa de **104×10 em (796, 339)** — a palavra
dentro do botão, e nada mais. `.janela` continua **1180×777**,
`passa_da_dobra: 0`, sem rolagem lateral.

**A cena que ela aprovou não muda com a decisão [02]**, e isso é medida e não
promessa: nela os três botões TÊM trabalho a fazer, logo nenhum nasce `apagado` e
a folha comum esconde os três `?`
(`.btn:not(.apagado) + .ajuda.porque{display:none}`).

### O clique, na TELA VIVA — WebKit do produto, janela oculta

`ONDA2-09-o-cinza-na-tela-viva.png` é a foto do motor do produto com os três
botões cinzas e os três `?` à vista. A régua abre o **desenho de hoje** (a
bancada copiada para um `PUBLICADO` temporário), porque publicar é ato dela e a
decisão [01] move um pixel — apontar o instrumento para a página congelada daria
verde sobre o desenho velho.

Medido no DOM, com a razão que `razoes_do_cinza()` produziu:

| | com razão | sem razão | no voo | pousado |
| --- | --- | --- | --- | --- |
| `Retomar` — classe `apagado` | **true** | false | — | — |
| `Retomar` — `aria-disabled` | **"true"** | **"false"** | — | — |
| `?` visível (CSSOM `display`) | **true** | **false** | — | — |
| largura do botão | **171 px** | 184 px | — | — |
| altura da faixa | **156 px** | **156 px** | — | — |
| miolo rola por dentro | **0** | **0** | — | — |
| rótulo do `daemon.reload` | Reaplicar ajustes | Reaplicar ajustes | **Reaplicando…** | **Reaplicar ajustes** |
| `hef-em-voo` | false | false | **true** | **false** |
| `.hef-recado` na tela | — | — | — | **"Pronto." · tom `sucesso`** |
| endereços da página | 34 | 34 | 34 | 34 |

A frase lida no `?` é, letra por letra, a de `aba_sistema.travas()`:

```
retomar      "O serviço não está pausado — não há de que retomar."
reiniciar    "O serviço está desligado — não há o que reiniciar."
ver-plugins  "O serviço está desligado — não há o que perguntar a ele."
```

O clique é `el.click()` no botão do produto — o mesmo caminho de eventos do
clique do rato. **Nada foi ao daemon dela:** o gesto lento entra pelo REGISTRO
(`pacotes.GESTOS`), que é o mesmo lugar de onde o piloto lê.

### As quatro mordidas

**1 — a cura do pacote arrancada** (as duas emissões, o ramo de sucesso e o de
erro):

```
FAILED ...::test_o_pacote_do_tique_leva_as_tres_chaves[online_systemd]
FAILED ...::test_o_pacote_do_tique_leva_as_tres_chaves[offline]
FAILED ...::test_o_ramo_de_erro_tambem_leva_as_tres_chaves
E  assert 'retomar-razao' in {'hefesto-estado': 'Ligado', 'hefesto-estado-cls': 'ok', ...}
E  assert 'retomar-razao' in {'sem_dono': {'tela': {'sem_dono': True, 'oque':
                              'a camada do produto calou'}}, 'blocos': {...}}
3 failed, 29 passed
```
devolvida: `32 passed`.

**2 — um botão perde a peça** (`item_cinza` → `item`), e o GERADOR reprova antes
de a página existir:

```
ERRO: o botão de 'reiniciar' perdeu o endereço `reiniciar-razao`. Sem ele o
piloto não tem onde acender o cinza nem onde escrever a razão, e o botão volta a
ter cara de clicável quando não há o que fazer — que foi o achado de 31/08
("o travado tinha cara de clicável").
```

**3 — o rótulo da espera arrancado**:

```
ERRO: o botão 'Reaplicar ajustes' perdeu o `data-hef-em-voo`. Sem ele o clique
some por nove segundos e meio sem uma letra na tela, e o segundo clique parece o
primeiro — é a decisão [03], e ela pede que a tela fale DURANTE a espera, no
lugar exato do clique.
```

**4 — o invólucro `.acao` arrancado** (com a régua 8 calada de propósito, senão
ela pega antes), medido na TELA VIVA:

```
E  AssertionError: a faixa mede 200px com os três `?` à vista e 156px sem eles —
   44px que o `?` cobrou de altura.
E  AssertionError: com-razao: o miolo rola 43px por dentro — foi assim que a aba
   escondeu 93px em 28/08.
E  assert 184 < 184     (o botão deixou de encolher para o `?` caber)
3 failed, 7 passed
```

*(os nomes de teste desta entrega estão em minúscula: `ruff` cobra `N802`, e a
ênfase mora no docstring, que é onde ela se lê.)*

---

## O que medi e derrubou uma suposição

**1. A minha própria régua passou com a cura arrancada — e a culpa era do
dublê.** A primeira escrita de `_com_a_leitura` passava `autostart=True` a
`aba_sistema.Leitura`. O campo é a **saída crua de `systemctl --user is-enabled`,
uma string** — a camada faz `.strip()` nela. Com o booleano, `aba_sistema.pacote()`
levantava `AttributeError` em TODOS os casos, o `pacote()` caía no ramo de erro, e
a mordida da chave no tique **passou verde com a cura removida**. *Um dublê que
não fala a língua da ponte real mede o caminho errado sem dizer que mudou de
caminho* — é a mesma assinatura dos dois gestos que passaram verdes sem gravar um
byte em 04/09. Foi esse erro que revelou o defeito do ramo de erro.

**2. A régua da geometria que eu escrevi primeiro era cega.** Ela comparava
`fim_do_estado` com `fim_da_acao` — e com o invólucro arrancado os dois
continuaram **iguais**, porque o `align-items:stretch` do `.par2` estica a coluna
irmã junto. O que cresce é a **faixa**, e ela empurra a aba inteira. A régua certa
mede a ALTURA da faixa e a rolagem do miolo, e aí a mordida devolve 200 contra
156 e 43 px de rolagem.

**3. `monta.NADA_A_DIZER` NÃO serve ao botão cinza — só à ressalva.** O enunciado
da sprint diz *"sem razão, manda `monta.NADA_A_DIZER`"*, e para esta peça isso
seria um defeito: o mesmo `data-campo` alimenta dois alvos, e o do botão é
`classe`. O `ligado()` do piloto acende para qualquer texto fora da lista curta
de vazios (`''`, `—`, `0`, `false`, `nao`/`não`, `off`, `none`, `null`), e
`<i class="nada"></i>` **não está nela**: o marcador acenderia `apagado` para
sempre. O certo é a string vazia, e quem esconde o `?` é a folha comum
(`.btn:not(.apagado) + .ajuda.porque{display:none}`), que a própria peça declara
como o primeiro dos três jeitos de o `?` sumir. Há régua para isso.

**4. Uma frase da tela parou de prometer sem mudar uma letra.** O `title` do
"Retomar" diz *"Só acende com a pausa ativa"* desde que a aba nasceu, e era uma
PROMESSA — o botão acendia sempre. Com a peça, a mesma frase passa a DESCREVER o
que se vê. **Nenhum texto novo de tela** nessa metade.

**5. FATO CORRIGIDO — `restaurar-de-fabrica` não está sem motor.**
`SEM_MOTOR` dizia que o ato *"mora em `footer_actions.on_restore_default:1477`,
que lê `self._get('main_window')`"*. Isso descreve o **handler**, não o ato: lendo
o fonte, o miolo dele são três passos que já têm dono fora da janela, e são **os
mesmos três** que `pacotes/perfil.gravar_e_reaplicar` usa —
`footer_actions._meu_perfil_asset()` (função de módulo, sem `self`),
`Profile.model_validate` do JSON, e `loader.save_profile` + `p.profile_switch` +
`p.chamar("launch_env.refresh")`. O que é da janela é o diálogo (que a D-03 já
substituiu por dois cliques) e o refresh das abas velhas (que esta interface não
tem). **O que segura o botão não é mais o motor: é a rede de segurança** — ver
abaixo.

**6. A régua da paridade leu a minha PROSA e contou como ato — pela terceira
vez.** Escrever `_meu_perfil_asset()` no comentário que EXPLICA por que o gesto
continua sem dono fez `check_paridade_gtk_html` acusar `divida-fechada` na linha
343. É o mesmo evento que a própria linha do CSV já registra duas vezes (*"ela
tinha sido promovida a DIFERENTE porque `gui_dialogs.confirm_restore_default`
apareceu no lado HTML — e ele aparece dentro da STRING que declara por que este
gesto continua sem dono"*). **A régua está certa em não distinguir prosa de
ato** — quem escreve é que não pode pôr o sinal literal num comentário. A minha
prosa passou a nomear o localizador sem citá-lo, e o portão voltou ao verde
(`OK: 396 features conferidas · 28% de paridade`).

---

## O que NÃO verifiquei

* **A bancada não foi usada, e nada foi ao daemon dela.** `scripts/bancada.sh
  status` dizia `LIVRE`; não reservei porque nenhum caminho desta frente vai ao
  daemon, escreve no aparelho ou chama `systemctl`. O clique medido na tela viva
  usa um gesto dublê injetado no registro do produto.
* **A suíte inteira não rodou** — ela é de quem coordena, nos oito lotes. Rodei o
  meu escopo — as 18 réguas da 09 e as da interface que a tocam:
  **328 passed, 1 failed**, e o único vermelho é o do item 2 abaixo.
* **Não olhei o comportamento com a mesa VAZIA na tela viva.** A cena medida tem
  dois controles; nada nesta frente depende da mesa, mas não foi medido.
* **Não medi o `?` sob fonte grande.** As larguras (171/184/233/246 px) são da
  fonte do WebKit desta máquina.

---

## O que sobrou para o próximo

### 1. RELATADO — a linha de `hefesto_vivo.PERIGOSOS` que `restaurar-de-fabrica` exige

**Nenhum gesto novo nasceu nesta frente**, então esta leva não tem dívida de
`PERIGOSOS` própria. A linha abaixo é a que o **próximo** precisa, no MESMO
commit em que ligar o `restaurar-de-fabrica` (ver o fato corrigido, acima):

```python
    ("09-sistema.html", "restaurar-de-fabrica"),
```

Sem ela, `test_todo_gesto_que_grava_esta_protegido` reprova — e com razão: a
prova botão a botão restauraria o `meu_perfil` DELA para provar que sabe clicar.
`hefesto_vivo.py` está no `nao_toca` desta frente.

### 2. UM VERMELHO QUE EU DEIXO, e o conserto é de uma linha

```
FAILED tests/unit/test_a_aba_sistema_para_de_falar_pelo_desenho.py
       ::test_tudo_o_que_o_pacote_emite_e_endereco_desta_pagina
E      assert not ['reiniciar-razao', 'retomar-razao', 'ver-plugins-razao']
```

A régua monta `conhecidos = set(aba_sistema.ENDERECOS) | _campos_da_pagina()`, e
`_campos_da_pagina()` lê a página **publicada**. Os três `data-campo` do cinza
existem no DESENHO e ainda não no produto — porque a decisão [01] troca um
rótulo, e `--publicar-enderecos` recusa (corretamente) quando o desenho muda um
pixel. **Enquanto isso a chave cai no vazio sem estrago**, e emitir é o certo: no
dia da publicação os três acendem sem uma linha nova de Python.

Isso está declarado em `a09_sistema.ESPERA_A_PUBLICACAO`, **cobrado nos dois
sentidos** por `test_a_aba_09_sistema_fecha_as_linhas` — no dia em que a página
publicada ganhar os endereços, a régua reprova pedindo que a declaração saia.

O conserto, no arquivo que **não é da minha posse**:

```python
    conhecidos = (set(aba_sistema.ENDERECOS) | _campos_da_pagina()
                  | set(a09.ESPERA_A_PUBLICACAO))
```

**E há um achado dentro do achado:** aquela régua isenta por SUFIXO
(`if not k.endswith("-cls")`) em vez de consultar `a09_sistema.SEM_ALVO_NA_PAGINA`
— que é a lista declarada para exatamente isso, e cujas entradas todas terminam
em `-cls` por acaso. É *a régua que digita o que devia LER*, e ela funcionou
enquanto nenhuma declaração precisou de outro sufixo.

### 3. As linhas de `MOTOR` que NÃO couberam, com a razão medida

| linha do CSV | por que não coube |
| --- | --- |
| **L315** — botão "Corrigir modo de execução" (migrar para systemd) | **Não cabe na coluna, e está medido.** A faixa do serviço tem 4 botões (4×34 + 3×6 = 154 px) contra 5 linhas de estado (5×30 = 150) e o Perfil de Bateria (36 + 4×30 = 156). Um quinto botão dá 194 px e o portão dos dois blocos do gerador reprova por 38 px — o vão que ela reclamou em 31/08. E o botão da GTK **aparece só no estado `online_avulso`**: um botão que nasce e some é DESENHO, e desenho é dela. |
| **L339/L340** — Steam "Copiar opções para os jogos" e "Aplicar aos jogos da Steam" | **Faltam as duas metades.** (a) Não há primitiva de área de transferência na interface nova — a ponte oferece `chamar`, `chamar_detalhado`, `resultado`, `escolher_arquivo` e `salvar_arquivo`, e nada mais; (b) não há onde pôr os botões: a coluna "Preparar os jogos" tem 3 botões de 34 px = 102 px, que é exatamente a altura das 4 linhas de achado ao lado. |
| **L343** — "Restaurar de fábrica" | O caminho EXISTE (fato corrigido acima). O que falta é a linha de `PERIGOSOS`, item 1. |

### 4. As linhas do CSV que esta frente fecha — para a ONDA1-X lançar

**Não toquei em `docs/data/paridade-gtk-html.csv`.**

| linha | feature | de → para | endereço novo, lido no código |
| --- | --- | --- | --- |
| **L314** | Botão "Atualizar" | `DIFERENTE` → **`IGUAL`** (fecha as decisões [01] e [03]) | `src/hefesto_dualsense4unix/interface/aba09.py` (`ROTULO_REAPLICAR`, `DICA_REAPLICAR`, `EM_VOO_REAPLICAR`) · `mockup/09-sistema.html` (o botão do `data-gesto="atualizar"`) · `src/hefesto_dualsense4unix/interface/hefesto_vivo.py` (o `em_voo` do ouvinte). **Ressalva:** o rótulo só chega ao produto no `--publicar 09`. |
| **L318** | Botão cinza por estado | `DIFERENTE` → **`IGUAL`** (fecha a decisão [02]) | `src/hefesto_dualsense4unix/interface/pacotes/a09_sistema.py` (`BOTOES_CINZAS`, `razoes_do_cinza`, `SUFIXO_DA_RAZAO`, `ESPERA_A_PUBLICACAO`) · `src/hefesto_dualsense4unix/interface/aba09.py` (`item_cinza`, `_razao`) · `src/hefesto_dualsense4unix/interface/monta.py` (`botao_cinza`) |
| **L323** | Recibo do gesto (barra de estado / toast) | `FALTA_NO_HTML` → **`DIFERENTE`** | **MEDIDO nesta aba, no WebKit** (`test_o_gesto_que_da_certo_deixa_recibo_na_tela`): o clique no botão do `daemon.reload` volta sem levantar e o DOM ganha um `.hef-recado` com `data-hef-tom="sucesso"` dizendo **"Pronto."**. O canal é da ONDA0-P (`hefesto_vivo._deu_certo_dizendo` + `FRASE_DE_SUCESSO`, `SEGUNDOS_DO_RECADO_DE_SUCESSO`). `DIFERENTE` e não `IGUAL` porque a GTK escreve uma frase POR AÇÃO na barra de estado e aqui é uma frase só, na tarja do rodapé — **e a frase própria de cada gesto eu RECUSEI escrever**, ver abaixo. |

**Se o `sinal_escopo` de alguma dessas linhas for `LADO-HTML`**: as três que
listei têm `sinal_escopo` apontando para `a09_sistema.py` (L314, L318) e
`LADO-HTML` (L323). Nenhuma delas casou com a aba errada nesta medição.

### 5. A DECISÃO QUE EU RECUSEI, e a medição que a sustenta

O canal de sucesso (D-01) está de pé e a ONDA0-P pede que cada aba escreva as
frases. Para a `09` a frase óbvia já existe no produto: `_SYSTEMCTL_OK_MSG`
(`daemon_actions.py:53`), escrita pela LEIGO-03 em 26/08. **Não a usei.** Ela diz:

```
start    "Pronto — Hefesto ligado."
stop     "Hefesto desligado."
enable   "Pronto — o Hefesto vai ligar sozinho com o computador."
disable  "Pronto — o Hefesto não vai mais ligar sozinho."
```

Pô-las na tela desta aba **recria a colisão que ela mandou desfazer em 31/08**:
*"a palavra Hefesto ficou com a aba Jogar; esta aba nomeia o SERVIÇO"*. Quem
desliga na Jogar continua com o serviço rodando; quem para aqui mata tudo. E
escrever outras frases seria texto novo de tela — que é dela. Ficou a
`FRASE_DE_SUCESSO` do piloto (**"Pronto."**), que não escolhe lado.

**E há um defeito de vocabulário VIVO que isso revelou, e ele é de outra posse:**
`_systemctl()` desta aba já usa `_SYSTEMCTL_FAIL_MSG`, então a RECUSA desta tela
**já diz "Hefesto"** — *"Não consegui desligar o Hefesto"*, na aba que nomeia o
serviço. O `title` do botão vermelho pode dizer Hefesto (é lá que a diferença se
explica); a frase de recusa de um `systemctl stop`, não. O dono é
`app/actions/daemon_actions.py`.

### 6. Duas dívidas menores, relatadas

* **`data-hef-em-voo` e `data-hef-atributo` não estão em
  `check_o_desenho_aprovado.INVISIVEIS`.** Nenhum dos dois muda um pixel — são
  endereço puro, como os trinta que já estão na lista. Enquanto ficarem de fora,
  toda aba que os usar cai como *"o DESENHO mudou"* no `--publicar-enderecos`, e
  a única saída passa a ser o `--publicar`, que é ato dela. (Aqui não mudou nada:
  a decisão [01] já obriga o `--publicar`.)
* **A dica do microfone da aba 02 manda a pessoa "clicar em Atualizar"**
  (`emulation_actions.py:1325`, medida por `test_o_microfone_nao_pinta_verde_sem_alvo`).
  Na janela GTK o botão continua se chamando Atualizar e a frase segue certa; na
  interface nova, depois do `--publicar 09`, esse ponteiro passa a apontar para
  um botão que não existe mais. O dono é a camada do produto, não esta aba.
