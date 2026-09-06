# MOTOR-DO-ARRANJO-01 — as duas réguas que a sprint nomeou e ninguém tinha escrito

**06/09/2026 · agente `opus` · branch `voo/MOTOR-DO-ARRANJO-01-opus` · base `c15d2e3e`**

A `ROTA CORRIGIDA` mandou conferir MOTOR-1 a MOTOR-4 um a um antes de escrever, e
dizer o que já estava. **Estava quase tudo.** O que faltava eram as duas réguas —
a varredura da MOTOR-5 e as duas mordidas da MOTOR-6 — e são elas a entrega.

---

## O que mudou

### O que JÁ ESTAVA, conferido um a um (e não reescrito)

`tests/unit/test_arranjo_da_mesa_bate_com_o_mockup.py` +
`test_arranjo_invariantes.py` + `test_censo_do_gabinete.py`, antes de eu tocar em
nada: **171 testes, verdes em 1,42 s**.

| tarefa | o que existe | onde |
| --- | --- | --- |
| **MOTOR-1** o módulo puro | 1.297 linhas; as sete funções do enunciado (`alocacao`, `regiao_do_caminho`, `planejar`, `receita`, `julgar`, `reexame`, `plano_dos_controles`) | `src/hefesto_dualsense4unix/integrations/arranjo_da_mesa.py` |
| **MOTOR-1** a equivalência com o `node` | `::test_a_receita_e_a_mesma_do_javascript`, nas quatro variantes | `tests/unit/test_arranjo_da_mesa_bate_com_o_mockup.py:216` |
| **MOTOR-2** as quatro invariantes | ponto fixo, mapa=receita, só-melhora, intercambiável — cada uma com a arrancada | `tests/unit/test_arranjo_invariantes.py:101-350` |
| **MOTOR-3** as variantes com o preço em palavra | `::test_a_variante_declara_o_que_perde` e `::test_o_que_se_perde_nunca_sai_em_pontos` | `tests/unit/test_arranjo_invariantes.py:407,422` |
| **MOTOR-4** o rebalanceio dos controles | `::test_ninguem_troca_de_adaptador_sem_baixar_o_pico` — 4 em 2 dongles: zero; 4 no mesmo: dois | `tests/unit/test_arranjo_invariantes.py:255` |
| **MOTOR-7** o censo no install | `censo_do_gabinete.py` (872 linhas) e `install_censo_do_gabinete_host` | `install.sh:1254` e `:1578` |

**A MOTOR-6 também estava, do lado do PRODUTO, e isso eu remedi antes de
escrever régua nenhuma** — §7.1/§7.4 (a contagem por face, o DMI, a divergência
declarada) chegam à tela por `a08_conexoes._frases_do_gabinete` →
`secao_mesa._linhas_do_gabinete`; §7.2 (a região deduzida do barramento, que
corta as candidatas) está em `arranjo_da_mesa.julgar`, no ramo `segurando`, e é
consumida por `mapa_da_mesa.veredito_do_quadrado`.

### O que NASCEU — duas réguas, no arquivo que já era meu

Tudo em `tests/unit/test_arranjo_invariantes.py` (posse), **+ 473 linhas**.
Nenhuma linha de `src/` mudou.

**§9 — a MOTOR-5: a varredura AST que a sprint pediu com estas palavras.**
*"nenhum arquivo define função que decida arranjo, nota de entrada ou destino de
controle. Arrancada a cura (recolocando a conta na aba), o portão reprova
nomeando arquivo e função."* Ela varre `app/`, `interface/` e `gui/` — os três,
e não só o consumidor de hoje — e reconhece a segunda cópia de duas formas:

* **pela palavra** — `test_nenhuma_frase_do_motor_e_digitada_na_producao`: as
  razões da tabela de notas (`REGRAS`, lidas do motor) e as frases dos
  `Veredito` do `julgar` (colhidas por AST do fonte) não podem aparecer como
  literal em arquivo de produção;
* **pelo número** — `test_nenhuma_funcao_da_producao_redecide_a_nota`: dois
  pesos distintos da tabela na mesma função, ao lado de uma classe do motor. É a
  forma de quem reescreveu a conta sem copiar o texto.

Mais `test_a_varredura_da_segunda_copia_sabe_recusar` (o dublê das duas formas,
e o contraexemplo de quem só CHAMA o motor) e
`test_todo_perdao_da_varredura_esta_vivo` — perdão que não dispara é perdão
morto, e uma lista de isenções que ninguém confere é a porta dos fundos.

**O piso medido hoje: 1 acusação pela palavra e ZERO pelo número.** A única é
`interface/aba08.py`, declarada em `_A_COPIA_DECLARADA` com a razão inteira: a
`veredito()` dali é a **cena de bancada** do gerador (o motor de verdade precisa
do censo do `/sys` de quem roda o gerador, e a página sairia diferente em cada
máquina), e ela é guardada por `_confere_no_produto`, que para a geração no dia
em que o produto trocar a frase. O que a tela **pinta** vem do motor.

**§10 — a MOTOR-6: as duas mordidas da §7.5, medidas pelo caminho do produto.**

* `test_entrada_vazia_desenha_sem_caminho` — não sobre uma `Mesa` montada à mão,
  mas sobre `mapa_das_portas.mesa_do_motor(mapa_dela(), bancada_de_agora())`: o
  gabinete dela desenha **16 entradas, 8 sem caminho nenhum**, e `candidatas`
  devolve exatamente essas 8, quatro de cada lado. São os números da §7.2 da
  sprint, agora com régua;
* `test_arrancado_o_desenho_das_vazias_o_gabinete_perde_os_buracos` — a cura
  reposta ao contrário, e o gabinete encolhe;
* `test_a_contagem_da_face_nao_depende_da_ligacao_por_caminho` — a §7.5 em uma
  linha: apagar TODAS as ligações não encolhe o desenho. É o que separa
  *"quantas entradas esta face tem"* de *"o que está em cada uma"*;
* `test_a_confirmacao_da_ordem_liga_a_entrada` — o cenário medido da §3, o Wi-Fi
  saindo de `4-1.1.2` (entrada 11, declarada) para `4-2` (entrada nenhuma o
  declara). Sem resposta: `reexame` devolve `entrada_agora=None` (**não
  presume**), `sem_entrada` acusa o Wi-Fi com a região deduzida e `candidatas`
  corta a lista. Com o *"Sim"*: o mapa ganha `3 → 4-2`. Com o *"Não, na 7"*: ele
  ganha `7 → 4-2` e a 3 **continua vazia**. O gesto que confirma é o do produto —
  `LogicaDoMapa.colocar`, o clique-em-clique da `D-GESTO-DO-MAPA`;
* `test_presumir_a_entrada_sugerida_faz_o_mapa_mentir` — a cura arrancada da
  §7.3, e ela é o argumento inteiro: presumida a sugerida, o mapa passa a
  responder a entrada errada **e perde o único sinal de que não sabia** — o
  Wi-Fi sai de `sem_entrada` e a 3 sai de `candidatas`. O produto para de
  perguntar sobre uma coisa que ele inventou.

---

## Qual mordida prova

**Três arrancadas, cinco réguas reprovando.** Duas das três foram no FONTE do
produto, e não em `monkeypatch` — a cura foi desfeita no disco, medida, e
devolvida.

**1 · MOTOR-5, a cópia pela palavra e pelo número.** Duas funções postas no fim
de `interface/pacotes/a08_conexoes.py` — uma com a conta (`60` para o Bluetooth
no hub, `100` para o teclado) e outra devolvendo a frase do motor:

```
E   AssertionError: uma segunda cópia da regra do arranjo apareceu na produção
E       .../interface/pacotes/a08_conexoes.py
E         ['no alto do rack, com a antena acima da linha das cabeças']
E   AssertionError: a conta do arranjo voltou para a aba — duas verdades sobre a mesma coisa:
E       .../a08_conexoes.py::_nota_da_entrada_MORDIDA — pesos [60, 100], classes ['bt', 'hub', 'teclado']
2 failed, 32 deselected in 1,25 s
```

Nomeia **arquivo e função**, que é o que o enunciado da MOTOR-5 cobra. Cura
devolvida: `2 passed`.

**2 · MOTOR-6, a entrada vazia sumindo do desenho.** Uma linha em
`integrations/mapa_das_portas.py` — `for numero in numeros:` virou
`for numero in [n for n in numeros if n in declarado]:`:

```
E   AssertionError: ['1', '2', '4', '7', '9', '11', ...]
E   assert 7 == 16
2 failed, 37 deselected in 0,45 s
```

O gabinete dela caiu de **16 buracos para 7**. Cura devolvida.

**3 · MOTOR-6, o produto presumindo a entrada que ele sugeriu.** Uma linha em
`app/widgets/mapa_da_mesa.py::LogicaDoMapa.colocar` — `numero = "3"` antes do
`setdefault`, que é o defeito exato da §7.3:

```
E   AssertionError: ela apontou a entrada 7 e o mapa aprendeu ['3'] —
E   o produto presumiu em vez de gravar o que ela disse
1 failed, 38 deselected in 0,45 s
```

Cura devolvida. **`git status --short` depois de cada uma: só o meu arquivo de
teste modificado.**

**Verde final do escopo:** `test_arranjo_invariantes.py` **39 passed**;
os três arquivos do motor juntos, **171 → 180 passed** (as nove
réguas novas).

**Portões:** `bash scripts/portoes.sh` — **TODOS VERDES, 45 portões**, com o
`PYTHONPATH` desta árvore no cabeçalho (a linha de base, antes de eu escrever
nada, era a mesma: 45 verdes).

---

## O que NÃO verifiquei

* **Nenhum aparelho foi tocado.** A sprint é `bancada: false` e o módulo é puro;
  não rodei `scripts/bancada.sh exigir` porque nenhum passo meu para o daemon,
  escreve no aparelho ou chama `systemctl`. Tudo que medi saiu de dublê — a
  bancada de mentira de 25/08 (`test_mapa_a_bancada_de_mentira`) e as constantes
  do mockup (`mesa_do_mockup`). **Nada aqui é prova de aparelho**, e a linha de
  prova continua sendo da `MESA-DE-QUATRO-01`.
* **Nenhuma tela foi aberta, e nenhuma foto foi tirada.** As duas tarefas que
  fechei têm `Prova de tela: cosmética pré-aprovada` no enunciado, e nenhuma
  linha de `src/` mudou — logo não há pixel novo para ela olhar. A `MOTOR-3`, que
  é a que pede o olho dela, **já estava feita** desde 25/08 e eu não a toquei.
* **Não rodei a suíte inteira** (regra da casa: ela é de quem coordena, e roda
  no fim). Rodei o meu escopo e os 45 portões.
* **Não conferi a tabela DMI tipo 8 desta placa.** A MOTOR-7 já está fechada e
  `install.sh` é do FECHO; o `pkexec dmidecode` da §7.4 exige root e não é meu.
* **Não medi o custo da varredura da §9 dentro do `portoes.sh`.** Ela roda dentro
  do arquivo de teste (1,5 s para os 39), e **não** foi promovida à lista de
  portões — ver abaixo.

---

## O que sobrou para o próximo

### 1. A pergunta que é dela, e trava o resto — `D-QUAL-REGUA-MANDA-NO-ARRANJO`

A `ROTA CORRIGIDA` mandou ler a decisão antes de escrever. **Ela está no CSV como
`decidida`, mas o que foi decidido é *medir*, não *escolher*:** *"MEDIR AS DUAS
ANTES DE ESCOLHER. Um teste comparativo roda as duas sobre a mesma bancada e
mostra onde divergem; a escolha vem depois, com o caso na mão."* A medição existe
(`tests/unit/test_as_duas_reguas_do_arranjo_divergem_onde.py`) e a
`D-A-REGUA-DO-ARRANJO-SE-DECIDE-COM-A-DIVERGENCIA-NA-MAO` (29/08) repete: *"quem
coordena roda o teste, traz os casos concretos, e ela escolhe com o caso na
mão"*.

**Segui a instrução da rota** — *"se estiver aberta, o motor consome com a régua
que a `a08` já usa hoje"*. Medido: a `a08` usa **`arranjo_da_mesa`** e mais nada.
Ela não importa `plano_de_radio` nem `ordem_de_redistribuicao` em uma única
linha. Não há segunda régua na aba de hoje para escolher — a divergência só
apareceria quando a **ordem de serviço** nascer.

**A pergunta que sobe para ela:** quando a ordem de serviço da Conexões nascer,
qual régua manda no destino de cada controle — a `plano_de_radio.ordem_de_redistribuicao`,
que já publica, ou a `arranjo_da_mesa.plano_dos_controles`?

### 2. O achado que ninguém tinha medido: no produto, a identidade do aparelho **É** a posição

A §3 da sprint é construída sobre uma frase: *"quando alguém troca um aparelho de
lugar, o **caminho** dele muda e o **serial** não"*. **No caminho do produto isso
não chega ao motor.** Medido hoje em `integrations/mapa_das_portas.py`:

```
_aparelho_do_motor  →  motor.Aparelho(id=aparelho.nome_do_kernel, ...)
mesa_do_motor       →  leitura = {aparelho.id: aparelho.id}
```

O `id` **é** o caminho de barramento, e a leitura mapeia cada aparelho para si
mesmo. Logo `reexame(mesa, antes, agora)` compara por `id`, e um aparelho que
mudou de lugar tem `id` **novo** — ele não é "o mesmo aparelho noutro caminho",
é outro aparelho. **`reexame` é estruturalmente cego no produto**, e é por isso
que ele continua lápide no `portao_a_casa_sabe_e_o_produto_nao_faz`: não é
descuido de quem liga a tela, é o dado que chega errado.

O módulo já tem o que falta — `_endereco_do_serial` e `_serial_do_no`, medidos em
24/08 nos três TP-Link desta bancada — e os usa só em `porta_do_adaptador`.
**A cura é dar `id` de serial ao `Aparelho` do motor, com o caminho ficando na
`leitura`.** `mapa_das_portas.py` **não está na minha posse**, e a regra da casa
é relatar em vez de editar (R1). Fica aqui, com o endereço.

E há o contraexemplo medido no mesmo arquivo, que a cura tem de respeitar: o
Archer T3U responde serial `123456`, que não é endereço de nada — quem não tem
serial utilizável cai no caminho de hoje.

### 3. A varredura da §9 não é portão — é teste

Ela mora em `tests/unit/`, logo roda na camada `suite` do `portoes.sh`, não nas
camadas `rapido`/`completo`. Promovê-la exige linha em `scripts/portoes.sh` **e**
job no `.github/workflows/ci.yml` (o `test_portao_a_lista_de_portoes_e_uma_so`
confere os dois sentidos), e **nenhum dos dois é da minha posse**. A lição do
`mac-por-oui` vale aqui inteira: *era teste da SUÍTE, e a suíte roda no FIM*.
Quem tiver a posse dos dois arquivos: são duas linhas.

### 4. O que a MOTOR-6 ainda não faz, e por quê

* **O atalho de UM toque da §7.3** (*"Já movi" → "Você o pôs na entrada 3, como
  eu sugeri?"*) não existe, e não é desta sprint: ele pendura na **ordem de
  serviço**, que é da `ORDEM-DE-SERVICO-01` e espera o item 1. O gesto de
  ensinar que existe hoje é o clique-em-clique da `D-GESTO-DO-MAPA`, e ele
  cumpre a regra que importa: grava o que ELA apontou, nunca o que o produto
  sugeriu.
* **O produto não diz *"vi o Bluetooth num caminho que não conheço, e ele está
  numa destas quatro"*.** `sem_entrada` e `candidatas` respondem isso — e as duas
  continuam sem chamador de produção. É frase de tela nova, logo é dela; a
  §7.2 já traz o texto proposto.

### 5. Do §10 da sprint, ainda de pé

* o motor não conhece rádio vizinho que não está na mesa (roteador, TV);
* quatro controles no rádio ao mesmo tempo nunca foi medido nesta casa — o maior
  ensaio foi de dois, e a conta de fatias é derivada de uma medição de UM.
