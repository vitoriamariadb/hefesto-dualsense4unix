# LEVA-4-D — a régua da paridade morde, e a porta das specs para de digitar número à mão

**26/08/2026.** Frente D da leva 4. Posse: `scripts/check_paridade_transporte.py`,
`docs/data/LEIA-PRIMEIRO.md`, e os dois testes novos. Nada fora dela foi tocado.

## O que mudou

### 1. A regra 2 do censo deixou de confundir COLETAR com MORDER

`motivo_de_o_pytest_nao_coletar` conferia quatro coisas — caminho sob `tests/`,
arquivo no disco, coleta pela convenção do pytest, nome no índice AST. **Em
nenhum ramo olhava o CORPO.** Logo um `def test_x(): pass` satisfazia a regra 2
inteira e, com ela, a regra 1 (`sem-mordida`) — que existe justamente porque a
queixa dela é *"tínhamos algo para o cabo e na hora do vamos ver a versão de BT
não funcionava"*. Um teste de corpo vazio passa **também com a cura arrancada**:
é a definição exata da rede que não existe.

O que entrou, em `scripts/check_paridade_transporte.py`:

- `corpo_e_inerte()` — o corpo só tem docstring, `pass` ou `...`;
- `marcador_que_desliga_sempre()` — `pytest.mark.skip` (com ou sem `reason`) e
  `skipif` cuja condição é constante verdadeira. **`skipif` com condição de
  verdade continua valendo:** é honestidade, não teste desligado — e uma régua
  que reprovasse todo `skipif` empurraria quem escreve teste condicional a
  esconder a condição;
- `_pytestmark_que_desliga()` — o `skip` no `pytestmark` do módulo, que apaga o
  arquivo inteiro sem aparecer em nenhum decorador de teste;
- `ArquivoDeTeste` ganhou `inertes`, `puladas` e `modulo_pulado`, indexados por
  AST no mesmo passo que já rodava (custo zero de leitura extra);
- `testes_cobertos_pelo_alvo()` e `motivo_de_a_mordida_nao_morder()` — a régua
  nova. Um alvo cobre um CONJUNTO (arquivo inteiro, classe, ou um teste só), e
  só reprova quando **todos** os cobertos são inertes ou pulados. Um alvo de
  arquivo com um teste vivo e um vazio continua sendo rede.
  `motivo_de_o_pytest_nao_coletar` ficou intacto, e a função nova o chama: o
  nome dele continua dizendo a verdade sobre o que ele mede.
- Cobre também `skip` na CLASSE (alcança todo método) e o caso `tests/…/x.py`
  que não coleta **teste nenhum** — coletável e vazio, que passava calado.

**A mudança não reprovou nada, como a ordem previa.** O portão contra o mapa
real continua `OK`, e `test_a_arvore_real_nao_tem_alvo_podre` afirma isso na
suíte: **nenhum dos alvos que o mapa cita hoje é vazio ou pulado.** O buraco era
latente; a régua existe para que o primeiro não atravesse calado.

### 2. `docs/data/LEIA-PRIMEIRO.md` parou de digitar número

Medido antes da cura, contra o carimbo de 22/08 que o documento trazia:

| o que ele publicava | o que a medição diz |
|---|---:|
| `mapa-controles.csv` 696.546 | **700.602** |
| `ensaios.csv` 149.862 | **150.714** |
| `specs.html` 1.341.232, **listado na raiz** | **1.364.796**, em `html/` desde 25/08 |
| `dualsense-referencia-canonica.md` 97.475 | **98.370** |
| `paridade-bluetooth-versus-cabo.md` 17.383 | **18.193** |
| `METODO-DE-ISOLAMENTO.md` 60.445 | **63.404** |
| `check_paridade_transporte.py` 85.063 | **102.818** (antes desta frente) |
| `bancada.py` 25.197 | **25.465** |
| 47 colunas | **49** |
| 13 pares `cabo_*`/`radio_*` | **14** |
| 177 ensaios | **178** |
| a docstring do portão "vai da linha 2 à 249" | **272** (antes desta frente) |

Só `eliminacao.py` (11.675) e `mapa-controles-v1.csv` (138.192) batiam. **Sete
dos dez tamanhos errados, quatro dias depois de terem sido medidos à mão.**

**Não corrigi os números — tirei a mão do caminho**, que é a cura de raiz que o
próprio arquivo já confessava em `:40-45`. Cada número mora entre marcas HTML
que a renderização não mostra (`<!--@chave-->valor<!--/-->`), e quem as mede é
`python3 scripts/check_paridade_transporte.py --leia-primeiro` (com
`--escrever`, regrava e diz o que mudou). São **20 números gerados**: os dez
tamanhos, linhas e colunas do mapa, linhas e colunas do caderno, colunas em
pares, pares de transporte, a última linha da docstring do portão, e os dois
contadores de `degrau`/`ponte` vazios.

**Ignorei a instrução do `SPRINT_ORDER` §0.6/§0.12** de trocar o tamanho do mapa
por 701.611, como a ordem mandou: esse número também já tinha caducado (o disco
diz 700.602 agora, e amanhã dirá outro).

**FATO ERRADO, SUBSTITUÍDO:** o documento dizia *"`degrau` e `ponte` … estão
VAZIAS em 177 de 177"*. Medido hoje: `ponte` está vazia em 178 de 178, mas
`degrau` em **177 de 178** — alguém respondeu um. O texto agora sai da medição.

O gerador **não** entrou em `scripts/portoes.sh` nem no `ci.yml` (R-D). Quem
cobra o frescor é o teste novo, na suíte.

## Qual mordida prova

### `test_paridade_a_mordida_tem_de_morder.py` — 15 casos

Cura arrancada: no `censo`, a chamada a `motivo_de_a_mordida_nao_morder`
trocada de volta por `motivo_de_o_pytest_nao_coletar` (a régua volta a só
perguntar se o pytest COLETA). Rodado junto com o
`test_check_paridade_transporte.py`, que é a régua vizinha da mesma função:

```
FAILED tests/unit/test_paridade_a_mordida_tem_de_morder.py::test_corpo_vazio_nao_e_mordida
FAILED ...::test_corpo_inerte_em_todas_as_formas_reprova[    pass-corpo vazio]
FAILED ...::test_corpo_inerte_em_todas_as_formas_reprova[    """Só a docstring, e nada mais."""-corpo vazio]
FAILED ...::test_corpo_inerte_em_todas_as_formas_reprova[    ...-corpo vazio]
FAILED ...::test_corpo_inerte_em_todas_as_formas_reprova[    """Docstring e um pass."""\n    pass-corpo vazio]
FAILED ...::test_skip_incondicional_nao_e_mordida[@pytest.mark.skip]
FAILED ...::test_skip_incondicional_nao_e_mordida[@pytest.mark.skip(reason="a bancada não está livre")]
FAILED ...::test_skip_incondicional_nao_e_mordida[@pytest.mark.skipif(True, reason="desligado e pronto")]
FAILED ...::test_modulo_desligado_por_pytestmark_nao_e_mordida
FAILED ...::test_classe_desligada_desliga_o_metodo
FAILED ...::test_alvo_de_arquivo_inteiro_reprova_so_quando_TUDO_e_inerte
FAILED ...::test_arquivo_sem_teste_nenhum_nao_e_mordida
12 failed, 46 passed in 5.42s
```

Os DOZE que exigem reprovação caíram; **os do arquivo vizinho ficaram todos
verdes** — a régua nova não é regressão das outras regras. Cura devolvida:

```
58 passed in 5.30s
```

### `test_leia_primeiro_nao_digita_numero_a_mao.py` — 7 casos

Cura arrancada: as 20 marcas do documento desfeitas, os números de volta a
literal.

```
FAILED ...::test_nenhum_numero_do_censo_e_literal
FAILED ...::test_o_documento_confere_com_a_medicao_de_agora
FAILED ...::test_numero_trocado_a_mao_reprova_nomeando
FAILED ...::test_tamanho_trocado_a_mao_reprova_nomeando
FAILED ...::test_escrever_conserta_e_diz_o_que_mudou
5 failed, 2 passed in 0.40s
```

E ele **nomeia**, que é o que a ordem pedia:

```
AssertionError: cada linha da tabela de arquivos tem de tirar o tamanho da medição:
  docs/data/mapa-controles.csv: o tamanho está digitado à mão ('700.602')
  docs/data/ensaios.csv: o tamanho está digitado à mão ('150.714')
  html/specs.html: o tamanho está digitado à mão ('1.364.796')
  ...
```

Cura devolvida:

```
OK: docs/data/LEIA-PRIMEIRO.md — os 20 números conferem com a medição.
70 passed in 6.21s
```
(o escopo inteiro: os dois arquivos novos mais
`test_check_paridade_transporte.py` e `test_portao_do_mapa_esta_ligado.py`.)

Além do ciclo, os dois arquivos exercitam as DUAS respostas da régua: os casos
de recusa acima e os contrapesos — `test_skipif_com_condicao_de_verdade_
continua_valendo`, `test_teste_de_verdade_continua_passando`, e a metade do
alvo-de-arquivo com um teste vivo. Régua que só sabe passar não é régua; régua
que só sabe reprovar também não.

### Os portões

`bash scripts/portoes.sh` (os 26, não só a camada rápida): **25 verdes, e o
único vermelho não é meu.**

```
ruff  VERMELHO rc=1
  RUF012 Mutable default value for class attribute
     --> tests/unit/test_ambiente_presumido_01_o_que_a_maquina_nao_tem.py:166:20
```

Conferido com `git stash -u` (a árvore sem uma linha minha): **já estava
vermelho antes de eu chegar**, e o arquivo é posse da **frente B** desta mesma
leva. Não toquei — a regra é relatar, não consertar arquivo alheio. Meus três
arquivos passam `ruff` limpos.

`tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py`: 35 passados (R-B — não
editei nenhuma entrada dele; `motivo_de_o_pytest_nao_coletar` continua com
chamador, agora dentro de `motivo_de_a_mordida_nao_morder`).

## O que NÃO verifiquei

- **A suíte inteira.** Rodei só o meu escopo, por caminho, como manda a ordem.
  Nenhum outro arquivo de teste da casa foi executado, então **não sei** se a
  regra 2 endurecida derruba algum teste de terceiro que eu não vi. O que sei é
  que o portão contra o mapa REAL continua `OK` e que
  `test_check_paridade_transporte.py` e `test_portao_do_mapa_esta_ligado.py` —
  as duas réguas que cobrem esta função — passam.
- **A renderização do `.md`.** As marcas `<!--@chave-->…<!--/-->` são
  comentários HTML e, pela especificação, não aparecem no render — mas **não
  abri a página** para confirmar com o olho. Dentro de célula de tabela é o
  ponto que eu conferiria primeiro.
- **Se `mordida_provada_em` deveria virar FALHA.** Não promovi (a ordem
  proibiu). Ver a seção seguinte.
- **`html/specs.html`, `docs/data/mapa-controles.csv` e `scripts/gerar-*`** —
  fora da posse, não tocados, não medidos.
- **A bancada.** Nenhum aparelho foi tocado; nada aqui precisa dela.

## O que sobrou para o próximo

1. **A regra 11 (`mordida-nao-provada`) continua AVISO, e a ordem mandou não
   promover.** Medido hoje: `mordida_provada_em` está vazia em **33 das 65
   linhas** que têm `teste_que_morde` (o portão hoje avisa em 4 delas, porque só
   cobra quem tem grau forte). Promover é uma linha, mas é decisão de quem
   coordena — e custa preencher 33 células com data de arrancamento real.
2. **O resto do censo do `LEIA-PRIMEIRO.md` ainda é digitado:** a distribuição de
   `existe` (`tem` 139 · `desconhecido` 83 · …), as duas réguas por valor
   (seção 3) e as 20 casas do cruzamento. O bloco *Resumo do censo* do portão
   **não** imprime esses — ele conta afirmação forte, grau e ponte, não a
   distribuição por valor. Gerá-los pede contadores novos no `Resumo`, e é a
   continuação natural desta cura. Está escrito no próprio documento, na seção 1.
3. **Números da seção 5 e do preâmbulo que também caducaram e ficaram de fora**
   por não serem "os dez tamanhos, as colunas e os pares": *661.177 caracteres
   em células*, *27.828*, *3.447*, *35 das 308 linhas*, *`teste_que_morde` (64
   linhas)*, *`mordida_provada_em` (31)*, *`provado_em` (58)*, *`nota` (224)*,
   *`ponte_alcanca` preenchido em 10 de 308*. São da mesma família e o mesmo
   gerador os alcança — cada um vira uma chave.
4. **`scripts/portoes.sh` (R-D).** Não acrescentei linha, e **relato**: se quem
   coordena achar que `--leia-primeiro` merece a lista, ele entra em
   `portoes.sh` **e** no `.github/workflows/ci.yml` no mesmo commit. Minha
   leitura é que **não precisa** — o teste já está na suíte, que o CI roda.
5. **`docs/process/SPRINT_ORDER.md` §0.6/§0.12** manda trocar o tamanho do mapa
   por 701.611. Essa instrução está **caduca por construção** e deve sair: o
   número agora é gerado, e qualquer literal que alguém escreva ali nasce velho.
   O arquivo não é da minha posse.
6. **`html/specs.html`** era citado na raiz. Corrigi **no meu arquivo**; se o
   endereço antigo aparecer em outro documento, é a mesma correção pela metade
   que a casa proíbe — não varri os outros, por posse.
