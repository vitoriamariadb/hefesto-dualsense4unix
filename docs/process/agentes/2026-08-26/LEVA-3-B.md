# LEVA-3-B — o motor do arranjo ganhou tela, e o mapa passou a confessar

**26/08/2026.** Árvore `../hefesto-voo/LEVA-3-B`, branch `voo/LEVA-3-B`.
Posse: `app/widgets/mapa_da_mesa.py`, `integrations/arranjo_da_mesa.py`,
`integrations/mapa_das_portas.py`, e no portão de lápides os blocos daqueles
dois módulos. **Nenhum arquivo fora dela foi tocado** —
`integrations/arranjo_da_mesa.py` não precisou de uma linha.

## O que mudou

### 1. A junção que faltava — `mapa_das_portas.mesa_do_motor`

O motor do arranjo recebe a mesa como ARGUMENTO e não lê nada (é isso que o
torna testável sem aparelho). Faltava **quem montasse esse argumento** a partir
do que o produto tem na mão: o desenho dela (`MapaDaMesa`) e a leitura de agora
(`Censo`). É a mesma junção que `mapa_das_portas` já faz para o número da
entrada, e por isso mora lá.

`mesa_do_motor(mapa, censo) -> Bancada`, e a `Bancada` traz **duas** coisas: a
`Mesa` e as LACUNAS. As duas juntas de propósito — quem recebe a mesa sem
receber as lacunas não tem como saber que o juízo está apoiado em campo que
ninguém preencheu, e publicaria "aqui fica bem" com a mesma cara de quem mediu.

| campo do motor | de onde veio |
|---|---|
| `Aparelho.classe` | a tripla do kernel: `e0/01/01`→`bt`, `03/01/01`→`teclado`, `03/01/02`→`mouse`, classe `0e`→`webcam`, `e_hub`→`hub` |
| `Face.perto` / `.alto` | `FaceDeclarada.perto` / `.alto` — fato dela |
| `Entrada.par` | `irmas_de(mapa)` — o desenho dela, de duas em duas |
| `Entrada.filho` / `.esticada` | `filhas_de(mapa, n)` — a extensão que ela declarou |
| `Entrada.onde` / `Face.regiao` | `arranjo_da_mesa.regiao_do_caminho` sobre `caminho_do_hub` |
| `Entrada.usb` | o hub em que o nó declarado (`PortaDeclarada.nos`) mora, pela velocidade dele |
| `Entrada.pos` | **NINGUÉM** — vira lacuna |

**A armadilha (a) da ordem foi confirmada e evitada:** `irmas_de` é
`def irmas_de(mapa) -> dict[str, str]`, **um** argumento. A lápide do portão
ainda ensinava `irmas_de(mapa, entradas)`; a receita velha não compilaria. A
lápide saiu inteira (a cura chegou), e com ela a instrução errada.

**`Entrada.usb` ganhou fonte, e ela é a mesma régua de `Furo.rapido`:** o nome
do nó declarado carrega o hub que o hospeda (`usb3-port1`, `4-1-port2`), e o
lado SuperSpeed de um hub de dois chips enumera num barramento próprio. Nenhuma
leitura nova de `/sys`: a velocidade vem do `Censo` que a janela já recebe. Sem
`nos` declarado, a resposta é `None` e vira lacuna — não um `2` calado.

**O Wi-Fi não tem classe, e isso é MEDIDO:** o Archer T3U desta bancada declina
de se classificar (`ff/ff/ff`, na bancada de mentira). Nenhuma leitura o separa
de um adaptador de rede com fio, e as regras de Wi-Fi do motor valem só para
rádio. Ele entra com classe vazia e a lacuna `LACUNA_ESPECIE` diz isso. O
DualSense por cabo (`03/00/00`, HID sem protocolo de arranque) cai no mesmo
lugar, pelo mesmo motivo.

### 2. Cada quadrado publica o juízo — `mapa_da_mesa.py`

- `bancada_do_rascunho(logica, censo)` — a mesa do motor montada a partir do
  **rascunho**, não do disco: assim o juízo responde ao clique que ela acabou de
  dar. Um mapa que só julgasse depois do "Aplicar" faria a pessoa aplicar para
  descobrir se o lugar era bom;
- `veredito_do_quadrado(bancada, numero, escolhido)` — chama
  `arranjo_da_mesa.julgar` com a classe do aparelho na mão;
- o quadrado ganha o **veredito no rótulo** e a **razão na dica**;
- `janela.vereditos` (`número -> Veredito`) fica exposto pelo mesmo motivo de
  `janela.quadrados`: o teste e o retrato alcançam o que a tela diz sem varrer a
  árvore de widgets.

O juízo só sai com aparelho escolhido: a pergunta que o motor responde é *"e
para ESTE aparelho, aqui serve?"*, e sem a primeira metade do gesto ela não tem
sujeito.

### 3. A confissão — a metade da decisão dela que ninguém tinha escrito

`D-O-PAR-DE-ENTRADAS-VEM-DO-SYSFS`, com todas as letras: *"com o gabinete não
desenhado o motor fica sem par e as três penalidades de vizinho rádio (-30, -45,
-40) não disparam, e a linha do mapa passa a DIZER isso em vez de calar — juízo
otimista silencioso é pior que juízo nenhum"*.

Cinco chaves de contrato em `mapa_das_portas` (`LACUNA_PAR`, `LACUNA_POSICAO`,
`LACUNA_VELOCIDADE`, `LACUNA_REGIAO`, `LACUNA_ESPECIE`) — ASCII, nunca texto de
tela, porque aquele módulo não escreve frase. Quem as traduz é a janela, em
`CONFISSAO`.

Na mesa dela, hoje, a janela confessa **quatro**:

```
O que eu não consegui conferir neste desenho:
 - o que é algum dos aparelhos da lista: o sistema não diz o que ele é, e
   sobre ele eu não tenho juízo nenhum.
 - quais entradas ficam coladas no metal: alguma face está com um número
   sobrando. Eu as leio de duas em duas, na ordem em que você as desenhou.
 - em que ponto da fileira cada entrada fica. Sem isso eu não conto a folga
   entre dois adaptadores de rádio, e duas entradas nas pontas opostas do hub
   recebem o mesmo juízo de duas coladas.
 - quais entradas são azuis. Enquanto você não passar por "Calibrar as
   entradas", eu trato todas como pretas.
```

**TEXTO NOVO DE TELA — PROVISÓRIO, decisão dela** (R-E): o cabeçalho e as cinco
frases. O cabeçalho deriva do léxico que já existe: `calibrar_entradas.py` tem
`LAUDO_NAO_CONFERI = "O que eu não consegui conferir"`, e esta é a mesma coisa
dita sobre o desenho em vez de sobre a entrada. **São 6 frases novas** para a
lista de `2026-08-25-AS-FRASES-DE-TELA-QUE-ESPERAM-ELA.md`.

### 4. A armadilha (b): `Entrada.pos` continua sem fonte — e agora isso é DITO

Não inventei a posição. A G3 sugeriu derivá-la do índice em `FaceDeclarada.portas`
e isso é uma escolha, não uma leitura: o índice numa face de duas entradas não é
comparável ao índice na fileira de sete do hub, e `_bonus_separacao` compara
distâncias entre entradas quaisquer. Sem `pos`, `_bonus_separacao` **nunca
dispara** — a lacuna diz exatamente isso, e ela **não é condicional**: enquanto
ninguém declarar a posição, ela existe em toda mesa desenhada.

### 5. Um defeito de perda de dado, achado no caminho

`LogicaDoMapa` reconstruía cada face como `{"nome", "portas"}` e
`como_documento()` devolvia só esses dois campos. `perto` e `alto` **caíam no
rascunho**, e a gravação SUBSTITUI a lista de faces inteira — logo o primeiro
"Aplicar" depois de um clique no desenho apagaria do disco o fato dela. Os dois
passaram a atravessar o rascunho. Não há caixa de marcar para eles nesta janela e
eu não inventei uma (é desenho, e desenho é palavra dela); o que havia de
declarado deixou de se perder.

### 6. O portão de lápides: **28 caíram**

`integrations/arranjo_da_mesa.py` tinha 37 lápides (36 depois de a `::Entrada`
sair na L2-E). Com o módulo ALCANÇADO por produção, todo símbolo que ele usa por
dentro ganhou chamador junto — a régua do portão é "chamador em qualquer nó de um
módulo alcançado". Saíram 27 do motor mais `mapa_das_portas::irmas_de`.

**Ficam NOVE**, e são as que nada alcança nem de fora nem de dentro:
`adaptadores_da_mesa`, `candidatas`, `consequencias`, `plano_dos_controles`,
`qualidade`, `receita`, `reexame`, `sem_entrada`, `variante_por_id` — a RECEITA
(o que mover para onde), as VARIANTES, o reexame e a conta de slots. A razão das
nove foi **corrigida, não mantida ao lado da certa** (regra da casa): elas diziam
*"nenhuma tela o consome ainda"*, e isso deixou de ser verdade.

## Qual mordida prova

`tests/unit/test_o_mapa_julga_cada_quadrado.py` — 5 testes, 0,47 s, sobre a
bancada de mentira de 25/08 às 02h30. Nenhum aparelho tocado, nenhum daemon
ouvido, nenhum `/sys` desta máquina lido.

### Estado curado

```
$ .venv/bin/python -m pytest tests/unit/test_o_mapa_julga_cada_quadrado.py -q
.....                                                                    [100%]
5 passed in 0.47s
```

### Mordida A — a chamada ao motor arrancada do quadrado

`veredito = self._veredito_em(numero)` trocado por `veredito = None`:

```
E  AssertionError: com o adaptador 3-1.1.4 na mão, a entrada 14 não publicou
E  veredito nenhum — o quadrado continua mudo. Vereditos publicados: []
E  assert None is not None
E  AssertionError: a entrada 14 ficou muda numa das duas ordens de desenho
E  (de pé: None, trocado: None) — o motor não está sendo chamado, e a
E  comparação abaixo não teria o que medir
2 failed, 3 passed in 0.47s
```

### Mordida B — o par do desenho dela arrancado da montagem

`pares = irmas_de(mapa)` trocado por `pares = {}`. **Esta é a mordida que mais
importa**, porque ela reproduz o defeito com a palavra da decisão dela:

```
E  AssertionError: a entrada 14 está colada no Bluetooth da 13 e saiu com o
E  veredito 'melhor' ('melhor lugar') — juízo otimista onde deveria dizer
E  'aqui não'
E  assert 'melhor' == 'evite'
E  AssertionError: o veredito da entrada 14 não muda quando o DESENHO dela
E  muda de ordem ('melhor' -> 'melhor'). Ou o par não está vindo de
E  `irmas_de`, ou não está chegando ao motor — e nos dois casos as três
E  penalidades de vizinho rádio (-30, -45, -40) estão desarmadas
2 failed, 3 passed in 0.49s
```

### Mordida C — a confissão calada

`self.confissao = confissao_do_desenho(self._bancada)` trocado por `()`:

```
E  AssertionError: a janela não confessou nada, e a mesa dela tem pelo menos
E  dois fatos sem fonte (a posição na fileira e o par da entrada 15).
E  Silêncio aqui é o juízo otimista que a decisão dela mandou acabar
1 failed, 4 passed in 0.46s
```

### Mordida D — `perto`/`alto` caindo no rascunho (o estado de ANTES desta frente)

```
E  AssertionError: a face que ela marcou como a mais perto voltou do rascunho
E  sem o fato dela: {'nome': 'Frente', 'portas': ['1', '2']}
1 failed, 4 passed in 0.48s
```

### As quatro curas devolvidas

```
.....                                                                    [100%]
5 passed in 0.46s
```

### Os testes que já existiam continuam verdes

```
$ pytest test_arranjo_invariantes test_arranjo_da_mesa_bate_com_o_mockup
        test_as_duas_reguas_do_arranjo_divergem_onde test_censo_do_gabinete
        test_a_volta_so_visita_o_que_esta_vazio test_entradas_do_gabinete
        test_o_hub_de_dois_barramentos_nao_e_incoerencia
        test_o_par_vem_do_desenho_dela test_a_janela_do_mapa_coloca_o_aparelho
        test_o_mapa_julga_cada_quadrado test_ordens_da_mesa
        test_mapa_das_portas_responde_pela_porta
        test_o_esquema_guarda_o_fato_fisico test_o_laudo_confessa_o_que_nao_mede
        test_a_mesa_guarda_o_que_ela_declarou test_conexoes_nao_engorda_com_o_mapa
        test_app_mesa_dono_unico -q
289 passed in 3.75s
```

E o portão de lápides inteiro, depois da poda das 28:

```
$ pytest tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py -q
35 passed in 57.56s
```

### Os portões

```
$ git add -A && bash scripts/portoes.sh
  ... 25 verdes, entre eles casa-sabe, acentuacao e mypy ...
  ruff                   VERMELHO rc=1     9 ms
REPROVOU: 1 vermelho(s) de 26 -> ruff
```

**`ruff` JÁ ESTAVA VERMELHO antes de eu tocar em qualquer coisa**, e continua
vermelho pelas MESMAS três linhas, em arquivos que **não são posse desta
frente**. Conferido com a cura fora (`git stash -u`):

```
=== ruff no HEAD, sem a minha cura ===
E501 Line too long (103 > 100)  tests/unit/test_match_sem_caixa_e_sentinel_manual.py:275
E501 Line too long (135 > 100)  tests/unit/test_o_preset_nao_escolhe_a_mascara.py:63
E501 Line too long (136 > 100)  tests/unit/test_o_preset_nao_escolhe_a_mascara.py:85
Found 3 errors.
```

Depois da minha cura: **as mesmas três, e mais nenhuma.**

`tests/unit/test_as_fotos_acompanham_a_versao.py` também **já estava vermelho**:
ele acusa `b6fc746` (o merge da LEVA-2-G), que veio antes de mim. É a R-C
funcionando — quem coordena fotografa uma vez, no fim da leva.

## O que NÃO verifiquei

- **NÃO ABRI A JANELA E NÃO FOTOGRAFEI NADA.** O rótulo do quadrado ganhou uma
  terceira linha e a janela ganhou um bloco de texto no rodapé. `set_size_request`
  é MÍNIMO e não máximo, então o GTK cresce o botão para caber — mas **quebra de
  fileira, largura da coluna e legibilidade com a fileira de sete do hub são NÃO
  VERIFICADOS**. Não mexi em espaçamento, em `_COLUNAS` nem no tamanho pedido dos
  quadrados, justamente porque isso é desenho. **A prova de tela é dela.**
- **A ESCOLHA entre as duas réguas do arranjo continua sem ser feita, e eu não a
  fiz.** A `D-QUAL-REGUA-MANDA-NO-ARRANJO` trata de *"qual controle move para
  qual adaptador"* — `plano_de_radio.ordem_de_redistribuicao` contra
  `arranjo_da_mesa.plano_dos_controles`. **Esta frente não toca nenhuma das
  duas:** o que ela ligou é `julgar`, o juízo POR ENTRADA, que não tem segunda
  régua concorrente. Não houve escolha provisória a marcar porque não houve
  escolha. A medição da L1-G está feita e a palavra é dela.
- **A classificação por classe de USB não foi medida fora desta bancada.**
  `e0/01/01`, `03/01/01`, `03/01/02` e `0e` são o que o kernel publica e o que
  `censo_do_barramento._especie` já usa; nesta bancada de mentira eles acertam os
  seis aparelhos classificáveis. **Não testei contra aparelho real nenhum** — e o
  que declina de se classificar cai em `""`, que é ausência e não palpite.
- **A região da face depende de `caminho_do_hub` achar o hub CERTO.** Ele devolve
  o primeiro aparelho de classe `hub` da lista, e a lista vem na ordem do censo.
  Nesta bancada isso dá `3-1` (o hub externo), que é o que se quer. **Numa mesa
  com dois hubs externos eu não sei qual ele escolhe** — é comportamento do
  motor, que não é posse desta frente, e não o mudei.
- **Os textos do motor (`Veredito.texto` e `.porque`) não passam por `_()`.**
  Eles nascem em `arranjo_da_mesa`, que não é módulo de texto de tela, e agora
  chegam à tela por este caminho. Não os marquei nem os movi: isso é decisão de
  quem for dar dono ao texto da aba Conexões, e mexer nas strings do motor
  quebraria a paridade byte a byte com o mockup.
- **Não medi o custo do redesenho.** `_remontar_a_bancada` refaz a `Mesa` inteira
  a cada gesto (é preciso: acrescentar uma entrada muda o pareamento da face
  toda). Com as 15 entradas dela e 10 aparelhos isso é irrisório no papel;
  **não cronometrei**.
- **Não rodei a suíte inteira** (regra da casa: é de quem coordena, e ela cria nós
  uinput de verdade). Rodei, por caminho: o meu arquivo, os 16 que citam os
  módulos que toquei, e o portão de lápides inteiro.
- **Não toquei a bancada física**, não parei daemon, não escrevi em `hidraw`, não
  chamei `systemctl`. Não rodei `retratar_abas.py` (R-C) nem acrescentei linha a
  `portoes.sh` ou ao `ci.yml` (R-D). Não editei nenhum bloco do portão de lápides
  fora dos dois módulos da minha posse (R-B).

## O que sobrou para o próximo

1. **A PROVA DE TELA É O QUE FECHA ESTA FRENTE.** A janela do mapa nunca foi
   vista por ela (a própria lápide de `irmas_de` dizia isso), e agora ela tem
   duas coisas novas: uma linha a mais em cada quadrado e um bloco de confissão no
   rodapé. Foto antes e depois, e a palavra final é dela (`PROVA-DE-TELA-01`).

2. **SEIS FRASES DE TELA ESPERAM ELA.** `CONFISSAO_ABERTURA` mais as cinco de
   `CONFISSAO`, em `app/widgets/mapa_da_mesa.py`. Todas marcadas
   `PROVISÓRIO — decisão dela`. Entram na lista de
   `2026-08-25-AS-FRASES-DE-TELA-QUE-ESPERAM-ELA.md`, que já tinha 60.

3. **`perto` e `alto` continuam sem ESCRITOR.** Esta frente parou a PERDA deles,
   não criou a caixa de marcar. Enquanto ninguém escrever, toda face nasce
   `perto=False`/`alto=False` e o bônus de +20 do teclado ("na frente, que é a
   mais perto de você") nunca dispara. O lugar natural é a seção de mesa
   (`app/actions/config/secao_mesa.py`), que **não é posse desta frente** — e é
   duas caixas de marcar por face, que é desenho, logo palavra dela.

4. **`Entrada.pos` continua sem fonte, e agora a tela DIZ isso.** Quem for dar
   fonte a ela precisa decidir o que a posição significa numa face que não é uma
   fileira (a frente do gabinete tem duas entradas empilhadas, não uma régua). A
   sugestão da G3 — o índice em `FaceDeclarada.portas` — resolve o hub e não
   resolve o resto, e `_bonus_separacao` compara entradas quaisquer.

5. **AS NOVE LÁPIDES QUE FICAM SÃO UMA FRENTE SÓ:** a ordem de serviço. `receita`,
   as `VARIANTES`, `consequencias`, `qualidade`, `reexame`, `sem_entrada`,
   `candidatas`, `adaptadores_da_mesa` e `plano_dos_controles`. A última **depende
   da palavra dela** (`D-QUAL-REGUA-MANDA-NO-ARRANJO`); as oito primeiras não —
   elas respondem *"o que mover para onde"*, e a `D-MAPA-SEM-RECEITA` já fixou a
   regra que o desenho tem de seguir (*"se não há ordem, o mapa não move nada"*),
   que o motor já implementa em `_receita_manda_mover`.

6. **`ruff` e as fotos são de quem coordena.** As três linhas longas estão em
   `tests/unit/test_match_sem_caixa_e_sentinel_manual.py:275` e
   `tests/unit/test_o_preset_nao_escolhe_a_mascara.py:63,85`; as fotos precisam de
   uma execução de `retratar_abas.py` em `onda/atual`, no fim da leva.
