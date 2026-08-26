# LEVA-2-D — o card de ordem de serviço responde: "Já movi", "Ignorar"

**26/08/2026.** Frente D da leva 2. Árvore `hefesto-voo/LEVA-2-D`, branch
`voo/LEVA-2-D`.

## O que mudou

O defeito era o mais caro desta casa na forma mais cara: **cinco funções
medidas, com bateria verde, e nenhuma tela**. `integrations/ordens_da_mesa.py`
sabia comparar o antes e o depois de uma ordem (`resposta_ao_ja_movi`), filtrar
o que ela dispensou (`ordens_novas`), contar o que ficou calado
(`ordens_caladas`), derivar os quatro cabeçalhos (`cabecalho`) e separar dois
adaptadores idênticos pelo serial (`identidades`) — e as cinco tinham lápide no
`portao_a_casa_sabe_e_o_produto_nao_faz.py`, porque a metade de cima da sprint
era tela. A seção tinha **um** botão, na linha 366: "Examinar de novo".

Tudo o que segue está em `app/actions/config/secao_exame.py`, e em nenhum outro
arquivo de produção.

**1. Os dois botões, em cada card de ordem** (`_botoes_da_ordem`). Rótulos
verbatim da `2026-08-24-ORDEM-DE-SERVICO-01` §7 — `[Já movi — reexaminar]` e
`[Ignorar]`. Nenhum texto de tela foi inventado nesta frente: os rótulos, as
quatro respostas e os quatro cabeçalhos já estavam escritos e decididos.

**2. "Já movi" compara o ARRANJO** (`_ao_ja_movi` → `_responder_ao_ja_movi`). A
ordem que estava na tela é guardada antes do exame novo — ela deixa de existir
no instante em que o exame novo chega. A resposta sai de `resposta_ao_ja_movi` e
entra no card como uma **quarta linha somada**, nunca no lugar de uma das três.
Quando a regra parou de disparar não há card para pendurar a frase, e aí nasce
um card só dela (`_card_da_resposta`): um card que simplesmente some é
indistinguível de um card que nunca foi desenhado, e ela apertou um botão.

**3. `identidades` costurado, e é o que autoriza o "Confirmei".**
`_identidade_do_caminho` marca ambíguo por `vid:pid`, e os três adaptadores
Bluetooth desta casa são `2357:0604` — sem a costura, **nenhuma** ordem sobre
eles poderia jamais confirmar. Quem separa é o serial, lido e descartado dentro
de `identidades`; `_com_ambiguidade_fina` aplica a resposta fina sobre a ordem.
O serial não chega ao painel: o que volta é uma `Identidade`, que não tem campo
para ele.

**4. "Ignorar" grava a dispensa chaveada pelo ARRANJO**
(`_ao_ignorar` → `_gravar_a_dispensa`), acumulada em `host._maquina_pendente`
sob `mesa.ordens_dispensadas`, com `quando` só-data. Mesmo contrato das outras
três seções diferidas: quem grava é o "Aplicar" do rodapé, e a marca do rodapé
acende. `D-ORDEM-IGNORADA-VOLTA`: *"a chave do dispensado é o ARRANJO, não a
recomendação"*.

**5. Os quatro cabeçalhos no topo** (`_escrever_o_cabecalho`). O selo passa a
dizer o texto de `cabecalho()` — a queixa dela (*"o 'está tudo certo' não fala
nada"*) vira "Nada a mudar. Conferi 5 coisas agora."

**6. E a cor NÃO é do cabeçalho — é do mais grave dos dois** (`o_mais_grave`).
Isto foi medido e é a parte que quase deu errado: **`cabecalho()` não conhece
`ESTADO_PROBLEMA`.** A assinatura dele vê ordens e duas contagens, e nada mais.
Um selo pintado só por ele mostra `● Nada a mudar. Conferi 5 coisas agora.` em
`#50fa7b` com a linha de pareamentos em `#ff5555` logo abaixo — a cicatriz de
`6c86e295` voltando pela porta dos fundos. A composição é escalação pura:
nenhum estado nasce ali, o resultado é sempre um dos dois que entraram, e ela
não consegue inventar um verde. Quem for mais grave também dá a frase; no
empate, o cabeçalho.

**7. O `[Ver]` da §8.2**, e só ele. `Cabecalho.botao` traz também
`[Ver o que conferi]` e `[Ver quais]`: os dois abririam o que já está aberto —
a tira do que foi conferido mora logo abaixo, sempre visível, com o glifo de
cada estado. Botão que não muda a tela ensina que os botões desta seção não
fazem nada. O `[Ver]` revela as ordens caladas, **sem os dois botões**.

**8. `QUANDO_VALE` entrou.** A seção deixou de ser só-leitura, e
`test_a_aba_diz_quando_a_escolha_fica_guardada` pega isso por AST. A frase é a
constante que já existe em `moldura.py`, em dica e não impressa (LEX-2), na
linha do escopo e no próprio `[Ignorar]`.

**9. As cinco lápides caíram**, no mesmo commit, e só as cinco do bloco
`integrations/ordens_da_mesa.py`. Nenhum outro bloco do portão foi tocado.

## Qual mordida prova

`tests/unit/test_a_dispensa_volta_quando_o_arranjo_muda.py` — 15 testes, todos
sobre `Gtk.OffscreenWindow` (nunca `Gtk.Window`: sob Xvfb ela fica 1x1 para
sempre). Nada abre `/sys`, lê o `maquina.json` ou fala com o rádio: os `Item` e
as `Ordem` são construídos à mão e o hospedeiro é um dublê.

**Três arrancadas, três reprovações.** Cada uma comentou UMA linha do produto.

### Arrancada 1 — a dispensa volta a ser chaveada pela recomendação

`ordens_novas(todas, self._dispensadas)` trocado por
`tuple(o for o in todas if o.chave not in self._dispensadas)`:

```
E   AssertionError: a mesma regra voltou a disparar com um arranjo NOVO e a
E   ordem continuou calada — a dispensa foi chaveada pela recomendação em vez
E   de pelo arranjo, e a decisão de ontem calou uma medição de hoje.
E       arranjo dispensado: '4-1.1.2|3-1.1.4'
E       arranjo de agora:   '4-1.1.2|3-1.2'
E       o que a seção guardou: {'radio_largo_no_mesmo_hub': '4-1.1.2|3-1.1.4'}
FAILED ...::test_ordem_ignorada_reaparece_quando_o_arranjo_muda
1 failed, 14 passed in 0.58s
```

### Arrancada 2 — o topo pintado só pelo cabeçalho

`o_mais_grave(...)` trocado por `estado = topo.estado`:

```
E   AssertionError: o topo não ficou vermelho sobre uma linha vermelha:
E   '<span foreground="#50fa7b" weight="bold">●</span>
E    <b>Nada a mudar. Conferi 5 coisas agora.</b>'
E   assert '#ff5555' in '<span foreground="#50fa7b" ...'
FAILED ...::test_o_verde_nunca_cobre_uma_linha_vermelha
1 failed, 14 passed in 0.55s
```

Verde sobre vermelho, com a frase inteira. É a cicatriz de `6c86e295` reproduzida
em uma linha.

### Arrancada 3 — a checagem cega contada como conferida

`contagens_do_cabecalho` devolvendo `(len(conferencias), 0)`:

```
E   AssertionError: o topo não disse que alguma coisa não deu resposta — ele
E   contou a checagem cega como conferida, e a frase virou o estado bom.
E       esperado: 'Conferi 4 coisas; 1 não deu resposta.'
E       na tela:  '○ Não deu para conferir tudo'
FAILED ...::test_zero_ordens_com_checagem_cega_nao_e_verde
1 failed, 14 passed in 0.60s
```

### Com a cura devolvida

```
tests/unit/test_a_dispensa_volta_quando_o_arranjo_muda.py .... [15 passed]
tests/unit/test_a_cura_nao_mora_so_no_tooltip.py .............
29 passed in 0.72s
```

E o portão das lápides, com as cinco entradas apagadas:

```
$ pytest tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py -q
35 passed in 57.21s
```

Duas réguas contra si mesmas, porque esta casa já pagou por três instrumentos
falsos num dia: `test_a_regua_dos_botoes_de_fato_acha_um_botao` (um localizador
quebrado faria toda asserção de ausência passar sobre uma tela cheia de botões)
e `test_a_montagem_nao_desenha_botao_de_ordem_nenhum`.

### Os portões

```
$ bash scripts/portoes.sh
TODOS VERDES — 26 portões.
```

## O que NÃO verifiquei

- **NÃO OLHEI A TELA.** Nenhuma foto, e por regra: R-C proíbe esta frente de
  rodar o `retratar_abas.py`. Tudo que afirmo sobre a aparência sai de
  `get_label()` e `get_text()` sobre widgets montados numa `Gtk.OffscreenWindow`
  — a largura dos dois botões dentro do card, a altura que a quarta linha
  acrescenta e o efeito disso na seção que já pede 2505 px **não foram
  medidos**. É PROVA-DE-TELA-01, e é dela.
- **NÃO RODEI o caminho de produção inteiro uma vez sequer.** `reexaminar()`
  submete um worker que lê `/sys`, o `maquina.json` e chama `busctl`; a bancada
  é recurso físico e esta frente é `bancada: false`. O que está medido é
  `aplicar()` para frente. Consequência concreta: **a ida ao disco pelo
  "Aplicar" do rodapé nunca foi exercida de ponta a ponta** — o que este
  arquivo prova é que a dispensa chega ao `_maquina_pendente` com a forma que
  `OrdemDispensada` aceita (e `test_a_dispensa_mora_na_mesa_dela.py` prova que
  essa forma atravessa o schema).
- **NÃO MEDI o `identidades` contra a bancada real.** A ambiguidade fina é
  exercida com uma `Identidade` injetada à mão. Que `identidades(censo)`
  devolva `ambigua=False` para os três `2357:0604` desta casa é o que
  `test_ordens_da_mesa.py` afirma; que a costura leia o `caminho` certo eu
  verifiquei por leitura de `_identidade_do_caminho`, não por execução.
- **NÃO SEI o que acontece com uma dispensa cuja regra sumiu do catálogo.** Se
  ela dispensar `teclado_so_no_hub` e a regra deixar de existir numa versão
  futura, a chave fica no `maquina.json` sem dono. `carregar_maquina` a aceita
  (o validador só olha a FORMA do slug) e ninguém a limpa. Não é defeito hoje —
  é dívida que ninguém mediu.
- **NÃO RODEI a suíte inteira**, por regra.

## O que sobrou para o próximo

### FORA DA POSSE — um teste alheio ficou VERMELHO, e eu não o toquei

`tests/unit/test_config_selo_de_saude.py:271`, em
`test_tudo_certo_ganha_o_sinal_de_conferido_em_verde`:

```python
assert secao.FRASE_DO_SELO[ESTADO_CERTO] in painel.selo.get_text()
#   AssertionError: assert 'Pronto para jogar' in '● Nada a mudar. Conferi 5 coisas agora.'
```

**A régua mede um contrato que a própria sprint revogou.** A §8.3 da
ORDEM-DE-SERVICO-01 diz, com todas as letras: *"os quatro cabeçalhos, e nenhum
deles é 'está tudo certo'"*. "Pronto para jogar" continua vivo e continua sendo
usado — é a frase que aparece quando o veredito é mais grave que o cabeçalho —,
mas ela deixou de ser o que o topo diz no caso zero-ordens-tudo-certo, que é
exatamente o caso desse teste.

O arquivo **não está no `posse:` de nenhuma das sete frentes desta leva**, e a
R-A é dura: relatar, não escrever. As outras duas asserções do teste (a cor
verde e o glifo `●` no início) continuam passando. O conserto de uma linha:

```python
    assert painel.selo.get_text().startswith(secao.GLIFO[ESTADO_CERTO])
-   assert secao.FRASE_DO_SELO[ESTADO_CERTO] in painel.selo.get_text()
+   # §8.3: nenhum dos quatro cabeçalhos é "está tudo certo". O verde agora
+   # CONTA o que foi conferido — era a queixa dela.
+   assert ordens.cabecalho(
+       ordens=[], conferidas=5, sem_resposta=0, dispensadas=0
+   ).texto in painel.selo.get_text()
```

Nenhum outro teste da árvore reprovou por causa desta frente — conferi os oito
arquivos que citam `secao_exame`/`PainelDoExame`, mais `test_ordens_da_mesa.py`
e `test_o_selo_de_procedencia_nunca_falta.py`: **129 passaram, 1 reprovou**, e é
este.

### A lacuna do módulo, e ela é REAL — `cabecalho()` é cego ao vermelho

Está escrita em §8.3 como *"derivados de `veredito()` mais duas contagens"*, e a
função implementada **não recebe o veredito**. A escalação em `o_mais_grave` é o
remendo do lado da tela, e ele funciona, mas o dono da cor do topo passou a ser
composto — o que o cabeçalho deste arquivo sempre proibiu.

**O conserto certo é do lado do módulo** (`integrations/ordens_da_mesa.py`, que
esta frente só pode CHAMAR): dar a `cabecalho()` um parâmetro `veredito: str` e
fazê-lo devolver o estado já composto. Aí o `o_mais_grave` desta camada sai, e
volta a haver um dono só. Quem pegar isso apaga também os dois testes de
escalação daqui, porque a régua passa a caber no módulo.

### O `[Ignorar]` não tem volta

`fundir_declaracao` só funde — não sabe APAGAR chave. Uma dispensa acumulada no
rascunho não pode ser desfeita por essa via, e é por isso que os cards revelados
pelo `[Ver]` são só-leitura. Pela `D-ORDEM-IGNORADA-VOLTA` isso não é defeito (a
ordem volta quando o arranjo muda), mas se ela clicar "Ignorar" por engano o
único caminho é mudar os cabos. Um "Trazer de volta" precisa de remoção de chave
em `utils/maquina.py` — fora da posse desta frente, e é **texto novo de tela**,
logo é dela.

### Os outros dois botões do cabeçalho

`[Ver o que conferi]` e `[Ver quais]` não viraram botão, e a razão está escrita
em `_mostrar_o_botao_do_cabecalho`: a tira que eles abririam já está aberta. Se
um dia a tira virar recolhível, eles ganham função e o `if` de lá é onde se
liga.

### As lápides irmãs continuam de pé

`integrations/portas_do_barramento.py::mesmo_hub_fisico` e
`::mesmo_soquete_fisico` seguem no portão, com a razão *"cai junto com o
catálogo de ordens, que é quem a consumiria até a tela"* — que agora está
desatualizada, porque o catálogo CHEGOU à tela. Não são do bloco desta frente
(R-B), e eu não as toquei. Quem for conferir precisa medir se elas têm caminho
de produção hoje.
