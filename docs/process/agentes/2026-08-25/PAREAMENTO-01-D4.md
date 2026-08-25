# PAREAMENTO-01 · D4 — o elo medição→tela, e as três checagens que ninguém chamava

Agente D4, 25/08/2026, retomada de manhã. Árvore `hefesto-voo/PAREAMENTO-D4`,
branch `voo/PAREAMENTO-D4`. Quatro commits, `2940136..29616ac`.

## O que resgatei

A árvore tinha **um arquivo modificado e não commitado** —
`scripts/validar-fala-de-tela.py` — e ele estava **pela metade**: a sessão
anterior tinha escrito o corpo de P-09 (`valida_abas_promovidas`,
`descobre_frases_de_transporte`, `FRASES_SEM_FALA`) e trocado a assinatura de
`valida_numeros`, e **não tinha tocado no `main()`**.

O efeito, medido antes de qualquer edição minha:

```
$ python3 scripts/validar-fala-de-tela.py --all
TypeError: valida_numeros() missing 1 required positional argument: 'formata_pt_br'
rc=1
```

E, na suíte, **16 testes vermelhos** em cinco arquivos
(`test_validar_fala_de_tela.py`, `test_numero_medido_tem_um_dono_so_z6_08.py`,
`test_regua_declaracao_nao_fluxo_z6_10.py`). Nada disso foi jogado fora: o
corpo escrito estava certo, faltava o fio. Liguei, provei e commitei.

## O que mudou

### 1. O fio que faltava (commit `2940136`)

- `main()` passa `fala_do_mapa.formata_pt_br` para `valida_numeros`. Era a
  **quarta cópia** de `f"{v:.1f}".replace(".", ",")` da árvore; com a cópia,
  mudar o formato da tela deixava o portão conferindo o formato de ontem —
  verde por cima da divergência que ele existe para pegar.
- `main()` chama `valida_abas_promovidas`. Sem isso `ABAS_COM_FALA_DECLARADA`
  era um conjunto que ninguém lia: **promover uma aba não faria nada**.
- `--censo-de-transporte`, que o docstring de `descobre_frases_de_transporte`
  já prometia e não existia.
- A mensagem de falha deixou de dizer "`Fala` em desacordo" — nem todo
  problema agora é de uma `Fala`.

**CORREÇÃO DE FATO.** O docstring de `descobre_falas` publicava *"40 frases em
11 arquivos"*, contado antes de as oito frentes da madrugada entrarem. Na base
de hoje são **38 em 10**. Substituí o número e escrevi na mesma linha que ele
envelhece e que o de hoje sai de `--censo-de-transporte` — portão nenhum lê
número de docstring.

### 2. A trava por aba morde HOJE (commit `afc959f`)

`tests/unit/test_abas_promovidas_so_crescem_p09.py` — o arquivo que o
docstring de `ABAS_COM_FALA_DECLARADA` **nomeava e que não existia**.

O conjunto nasce vazio de propósito, então a trava só seria exercitada no dia
da primeira promoção, por outra pessoa, meses depois — e ela acreditaria nela.
O teste promove uma aba **numa árvore de mentira** (copiando o roteiro real
com as três constantes trocadas, e **afirmando que a troca casou**: uma
substituição que não casasse devolveria um portão de conjunto vazio, que passa
em tudo) e prova sete regras: aba livre passa; aba promovida com frase de
transporte solta reprova nomeando `arquivo:linha`; declarar a `Fala` resolve;
isenção com razão passa; isenção sem razão reprova; isenção que não casa mais
com frase nenhuma reprova mandando APAGAR; promover sem declarar os arquivos
reprova alto.

Mais a catraca, cujo conjunto de referência é **literal deste arquivo de
teste** — um teto lido da própria fonte passa sempre, e é o que a ADR-016
pagou por um mês.

### 3. A régua e a legenda são a mesma peça (commit `afc959f`)

`tests/unit/test_a_regua_e_a_legenda_sao_a_mesma_peca.py`. Afirmar que a cópia
do formato sumiu do texto do roteiro não mede nada — uma quinta cópia escrita
com `format()` passaria. A mordida **troca `formata_pt_br` para duas casas** na
árvore de mentira e exige que o portão vire de verde para vermelho junto.

### 4. O mecanismo: a `Fala` que ninguém exibe (commit `4771509`)

`tests/unit/test_toda_fala_declarada_chega_a_tela.py`. O portão de
`scripts/` guarda uma ponta — que a `Fala` declarada não afirme mais do que o
mapa mede. **A outra ponta não tinha ninguém**, e é a que some calada: uma
`Fala` DECLARADA que nenhuma tela EXIBE.

Não é hipótese. É a `A-CASA-SABE-E-O-PRODUTO-NAO-FAZ` dentro da cura que a
combate, e já aconteceu nesta leva (`formata_pt_br` e `Numero`, ONDA0-Z6). E o
caminho para acontecer de novo **está desenhado**: a fase F1 da PAREAMENTO-01
é *de carona* — quem conserta uma aba declara `Fala` para as frases que a aba
já tem. Nada obrigava a frase declarada a ser a frase que a tela mostra. Sem
esta prova, o gesto que satisfaz P-09 é *declarar a `Fala` e deixar o literal
antigo na tela*: portão verde, pessoa lendo a frase de ontem, e o portão vira
o contrário do que a sprint quer — uma lembrança a mais para alguém ter.

Duas regras, e a segunda existe por causa da primeira:

1. toda `Fala` de módulo em `app/` passa por `frase_de_exibicao` em algum
   ponto de `app/`;
2. ninguém lê `fala.texto` fora de `app/fala_do_mapa.py`. Sem ela a regra 1 se
   satisfaz com `set_label(DICA.texto)` — e o `NAO_MEDIDO`, que é **sentinela e
   não string**, chega à tela como `<_NaoMedidoSentinela object at 0x…>`.

A régua é de **declaração, não de fluxo** (Z6-10): `frase_de_exibicao` é o
sítio declarado de "isto vai para a tela", como `Fala` é o de "isto fala do
mapa". Tem lista de lacunas declarada (`_FALA_SEM_TELA_HOJE`, nasce vazia) com
a regra da lápide: entrada que não casa mais **reprova**.

### 5. O mesmo defeito, aplicado ao próprio portão (commit `29616ac`)

`test_toda_checagem_do_portao_e_chamada_pelo_main` varre por AST as funções
`valida*` do roteiro e exige que `main()` chame cada uma. **É o teste que teria
pegado o estado em que encontrei a árvore hoje de manhã** — e é a razão de ele
existir, escrita no docstring dele.

## As mordidas, arrancadas e devolvidas

| # | o que arranquei | o que ficou vermelho |
|---|---|---|
| 1 | a cópia própria do formato de volta em `valida_numeros` | `test_o_portao_segue_o_formato_da_tela_e_nao_o_seu` |
| 2 | `main()` sem `valida_abas_promovidas` | 5 testes de P-09 |
| 3 | a fronteira de palavra fora de `_TRANSPORTE` (`acabou` volta a casar `cabo`) | `test_a_palavra_de_transporte_tem_fronteira_de_palavra` |
| 4 | a cobrança da lápide de `FRASES_SEM_FALA` | `test_isencao_que_nao_casa_mais_com_frase_nenhuma_reprova` |
| 5 | uma aba na referência da catraca e não no portão | `test_o_conjunto_de_abas_promovidas_so_cresce` |
| 6 | **na árvore real**: `frase_de_exibicao(DICA_DA_COR_NO_RADIO)` → `DICA_DA_COR_NO_RADIO.texto` em `app/widgets/external_card.py:295` | os DOIS testes de árvore real, nomeando arquivo e linha |
| 7 | `main()` sem `valida_abas_promovidas`, de novo | `test_toda_checagem_do_portao_e_chamada_pelo_main` |

Cada uma com `__pycache__` limpo entre arrancar e devolver. A mordida 6 tocou
arquivo de outra frente (`app/widgets/` é de B6) e foi **integralmente
revertida com `git checkout`** — nenhum dos meus commits toca `src/`.

## O que fica aberto, e para quem

### Para quem coordena — a base `cb7248f` está VERMELHA num portão do CI

`tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py` roda no CI
(`.github/workflows/ci.yml:347`) e reprova **quatro testes** na base que eu
recebi. **Não é meu**: meus commits não tocam uma linha de `src/`
(`git diff cb7248f..HEAD --stat` mostra `scripts/` e `tests/` só).

1. **19 lápides caducas** (`test_nenhuma_lapide_sobreviveu_a_propria_cura`).
   Alguém ligou `integrations/api_de_entrada.py` (9 símbolos) e
   `integrations/prontuario_dos_jogos.py` (10) e não apagou as entradas de
   `_SEM_CAMINHO_HOJE`. É o par que o docstring do portão cita como *"corrente
   fechada em si mesma"*. **Conserto: apagar as 19 entradas.** Não fiz porque
   o registro é escrito por todas as frentes e eu criaria conflito em oito
   merges.
2. **106 promessas soltas contra um teto de 80**
   (`test_a_varredura_enxerga_os_chamadores_que_existem`). As 50 novas estão em
   quatro módulos que nasceram esta noite e ainda não são alcançados de ponto
   de entrada nenhum: `integrations/arranjo_da_mesa.py` (37),
   `integrations/entradas_do_gabinete.py` (7), `integrations/mapa_das_portas.py`
   (4), `integrations/lugar_declarado.py` (2). **Ou eles ganham chamador de
   produção, ou entram em `_SEM_CAMINHO_HOJE` com quem os liga** — é a regra
   escrita no próprio portão. Donos: B3 e B8.
3. `test_o_ponto_de_entrada_declarado_e_o_que_abre_o_alcance` cai junto com (1)
   — o caso de controle dele é `prontuario_dos_jogos.py::Prontuario`, que
   deixou de ser órfão.

### `scripts/gerar-painel.py --check` não pode ficar verde

Medido hoje: o `painel.html` gerado carrega o **selo de geração** — data, hora,
branch e hash do commit. O `--check` compara conteúdo, então ele reprova em
qualquer árvore cujo HEAD não seja o commit que gerou a página. Rodado agora, a
única diferença entre o comitado e o regerado são essas quatro linhas de selo.
É o que explica ele **não ter chamador nenhum** — nem CI, nem `portoes.sh`, nem
pre-commit. **Não consertei**: é o script de outra família e o conserto
(excluir o selo da comparação, como `gerar-mapa.py` faz) é decisão de quem o
mantém.

### Os órfãos que quem coordena me apontou

- **`app/textos_de_aplicacao.py::frase_do_desfecho` JÁ FOI LIGADO** por
  GATILHOS-APLICADO-COM-PROVA/T3, e a entrada dele já saiu do registro. A
  informação que recebi estava velha; nada a fazer.
- **`app/fala_do_mapa.py::formata_pt_br` e `::Numero` seguem órfãos, e
  continuam corretamente registrados.** Eu dei um chamador a `formata_pt_br`
  — mas em `scripts/`, e **`scripts/` não é caminho de produção** por decisão
  medida em 22/08/2026 (a nota de `_PONTOS_DE_ENTRADA`: *"um instrumento de
  bancada é da mesma espécie que `tests/`"*). A entrada continua verdadeira,
  então **não a apaguei** — apagá-la é que seria a mentira. O registro nomeia
  quem a fecha: a frente do léxico (CONFIGURACOES-O-LEXICO-01).
- `Numero` é o caso mais fino: o único produtor de número medido é
  `integrations/radio_da_mesa.py::NUMEROS_MEDIDOS_NO_MAPA`, uma tupla de
  4-tuplas. Usar `Numero` ali faria `integrations/` importar `app/` —
  **inversão de camada**, e não é conserto, é troca de um defeito por outro.
  Quem fecha isto de verdade é mover o tipo para fora de `app/`, e isso é
  decisão de modelagem, não desta leva.

### Da sprint, o que continua em aberto

- **P-09 está entregue como MECANISMO e vazio como POLÍTICA.**
  `ABAS_COM_FALA_DECLARADA` segue `frozenset()`. Promover **Início** e
  **Status** (as duas que a sprint nomeia) exige editar `app/actions/`,
  `app/widgets/` e `app/app.py`, que são de B6, B7 e B5 — registro e não
  edito. O que falta é literalmente duas linhas no roteiro e duas em
  `ARQUIVOS_DA_ABA`, mais o que o portão então cobrar.
- **P-10, o sinônimo do microfone, não foi decidido.**
  `app/widgets/controller_card.py:593` diz *"Vale igual no cabo e no rádio"* e
  a linha `audio.microfone.volume@dualsense` marca `aciona = não` dos dois
  lados. Não é contradição — a linha fala do byte 6 do firmware, a tela fala do
  volume do PipeWire. A opção (a) da sprint exige a linha
  `audio.microfone.volume_do_sistema@dualsense` em
  `docs/data/mapa-controles.csv` (**posse de B5**); a (b) exige reescrever a
  frase em `app/widgets/` (**posse de B6**). A própria sprint diz que a escolha
  é dela ou de quem for dono do mapa.
- **P-01 a P-08 e P-11 já estavam fechados** por Z6/Z7 antes de eu chegar:
  o gerador, os dois módulos de registro, a linha da cor no CSV com
  `o-aparelho-recusa`, a regra 17 do renome de `id`, o domínio da coluna de
  causa, o `--fila` publicado no `specs.html` e no `painel.html`, e os dois
  `fetch-depth: 0`. Conferi cada um antes de não refazer.

## Portões

`bash scripts/portoes.sh` (completo, 23 portões): **TODOS VERDES**.
`--rapido` verde antes de cada um dos quatro commits.

Escopo no pytest, 75 verdes:
`test_validar_fala_de_tela.py`, `test_fala_do_mapa.py`,
`test_gerar_fatos_de_tela.py`, `test_numero_medido_tem_um_dono_so_z6_08.py`,
`test_regua_declaracao_nao_fluxo_z6_10.py`,
`test_abas_promovidas_so_crescem_p09.py`,
`test_a_regua_e_a_legenda_sao_a_mesma_peca.py`,
`test_toda_fala_declarada_chega_a_tela.py`,
`test_portao_todo_portao_tem_chamador.py`.

Não rodei a suíte inteira: ela cria nós uinput de verdade e já derrubou a
sessão gráfica dela.

## O que NÃO fiz, e por quê

- **Nenhuma medição de rádio.** O hub USB dela saiu do barramento às 02:36 e
  `/sys/class/bluetooth/` está vazio. Nada desta sprint precisava de aparelho,
  então não há tarefa de bancada minha em aberto.
- **Nenhum PNG em `docs/usage/assets/`** e nenhuma prova de tela: meus commits
  não tocam `app/`, `gui/` nem nada que a tela mostre.
- **Nenhum arquivo de outra frente.** As sete listadas como fora da minha posse
  continuam byte-idênticas ao que recebi.
