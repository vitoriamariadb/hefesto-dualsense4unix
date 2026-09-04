# ONDA2-06 · A ABA NAVEGAÇÃO — os dois defeitos que apagam o que ela escreveu

**04/09/2026.** Sprint
[`ONDA2-06-NAVEGACAO-01`](../../sprints/2026-09-04-ONDA2-06-NAVEGACAO-01-os-dois-defeitos-que-apagam-o-que-ela-escreveu.md).
Árvore `/mnt/Apate/Desenvolvimento/hefesto-voo/ONDA2-06-NAVEGACAO-A6`, branch
`voo/ONDA2-06-NAVEGACAO-A6`.

**Posse tocada — três arquivos dos quatro:** `interface/aba06.py` ·
`interface/pacotes/a06_navegacao.py` · `mockup/06-navegacao.html`.
**`interface/paginas/06-navegacao.html` NÃO foi tocado**, por decisão da sprint:
*"Não publica desenho novo. (…) A publicação é uma leva só, para o olho dela."*
A `06-navegacao.html` já estava declarada em `mockup/DIVERGENCIAS.md` desde a
folha da ONDA0-F, então a divergência nova entra na seção que já existe e o
portão `desenho-aprovado` continua VERDE.

**Criado:** `tests/unit/test_a_aba_06_navegacao_fecha_as_linhas.py` (17 casos).

---

## O que mudou

### As cinco decisões do PO, uma a uma

| # | decisão | onde ela mora agora |
| --- | --- | --- |
| **[01]** | *"Apaga o interruptor e escreve ao lado, na tira de estados"* | `a06_navegacao.RAZAO_DO_PORTAO` + `_a_razao_do_portao` · campo `modo-portao` na `aba06.ESTADOS` · a regra `.quadro-corpo:has(.estado.portao .laranja) .tog[data-gesto="modo"]` na folha da aba |
| **[02]** | *"As três regiões do touchpad ficam, com a marca de que não disparam"* | `aba06.MARCA_DO_TOUCHPAD`, aplicada às três linhas de `BOTOES` · a frase inteira na dica `D_DEFINICOES` |
| **[03]** | *"O botão PS fica fora, e a razão vira dica"* | `aba06.D_DEFINICOES` |
| **[04]** | *"Uma tira de aviso sob a tabela"* | `a06_navegacao._aviso_da_tabela` · campo `aviso-da-tabela` em `aba06.AVISO_DA_TABELA`, dentro da tela de Definições |
| **[05]** | *"Uma frase permanente enquanto estiver desativado"* | `a06_navegacao._o_custo_de_desligar_o_teclado` + `O_QUE_SAI_COM_O_TECLADO` · campo `teclado-custo` na tira |

### UM CAMPO SÓ APAGA O INTERRUPTOR, e não há segundo endereço a divergir

A peça `monta.botao_cinza` não serve aqui — ela emite um `.btn`, e o "Status do
Modo" é o rótulo `.tog` que ela pediu em 27/08. Mas a **lei** daquela peça
serve, e é a que foi seguida: *um campo só alimenta o botão e a dica*.

O que existe é **uma escrita só**: o pacote põe a razão na linha
`data-campo="modo-portao"` da tira. O cinza do interruptor sai dessa MESMA
linha, por `:has()` na folha da aba. Com dois campos seria possível pintar um
interruptor apagado sem razão, ou uma razão sem interruptor apagado; aqui não há
caminho no código em que isso aconteça, porque não há segundo valor.

E o interruptor **continua respondendo** — nada é `disabled` nem
`pointer-events:none`. É a decisão do PO sobre a aba 09 (*"Apagado e ainda assim
responde"*) aplicada aqui: quem navega pelo controle chega à razão pelo clique,
e o gesto levanta **a mesma frase** que está escrita ao lado.

### A tira sob a tabela diz QUATRO coisas, e nenhuma nasce sem o fato

Nenhuma frase dela é escrita no gerador. Os nomes dos botões saem de
`input_actions.humanize_button`, as teclas de `humanize_binding`, o que cada
linha faz de `core/acoes_de_botao`, e os mapas de `integrations/uinput_mouse`.

1. **Dois donos** (sempre) — o R3 faz *Botão do meio* para o mouse e *Fechar o
   teclado na tela* para o teclado, e a tabela mostra só o do mouse. Derivado de
   `acoes.padrao()` × `DEFAULT_BUTTON_BINDINGS`, nunca digitado: no dia em que
   um segundo botão cair na mesma situação, a tira o nomeia sozinha.
2. **Não acendem nada hoje** — a terceira sacola do `resolver()` mais as linhas
   em `— Nada —` que o device realmente cala.
3. **“— Nada —” ainda não cala estes** — o defeito que esta frente MEDIU (§ mais
   abaixo).
4. **O perfil guarda atalhos que esta lista não diz** — a metade dita do
   defeito §3-1, com o nome de cada atalho e o aviso de que guardar os
   substitui.

### Os dois defeitos da §3 — o que fechou e o que não podia fechar aqui

**§3-2 (“Voltar ao padrão” apaga mais do que promete) — FECHOU.** O ato não
mudou (zerar os dois campos continua certo; zerar só um deixaria a tabela metade
de fábrica). O que estava errado era a **pergunta**, e ela ganhou a metade que
faltava:

> Devolver ao de fábrica as 21 linhas de **o que cada botão faz**? Isto apaga
> também os **atalhos de teclado** que este perfil guarda — inclusive os que
> você escreveu na janela antiga e esta lista não sabe mostrar. O
> **Remapeamento dos botões** não é tocado.

E o gesto passou a dar **recibo**, pelo canal de sucesso da D-01: ele devolve
`{"recado": …}` nomeando os atalhos que saíram. Até hoje ele apagava e imprimia
`aplicado` no terminal de quem lançou a janela — e quem clica não lê terminal.

**§3-1 (os atalhos param de valer, calados) — só a METADE DITA.** A cura de
verdade é do MOTOR e está fora da posse desta frente; ver *"O que sobrou"*. O
que fechou aqui é o silêncio: a tira nomeia os atalhos antes do clique, e o
"Guardar" nomeia de novo os que aquele clique fez parar de valer.

### A coluna do nome cresceu 74px DENTRO das pop-ups

`.tn-cx .tab th:first-child,.tn-cx .tab td.b{width:250px}` — e o número é
medido, não escolhido. Ver *"o que derrubou uma suposição"*.

---

## Como provei (a mordida colada)

### 1. A TELA VIVA, com o piloto DE VERDADE

A sprint proíbe publicar. Sem publicar, o piloto não carrega o desenho novo — e
sem carregá-lo não há prova de que os endereços pintam. A cura foi desviar a
PASTA, que é a mesma disciplina que `test_o_botao_cinza_diz_a_razao.py` usa para
a bancada: `onde.PUBLICADO` aponta para uma cópia temporária de
`interface/paginas/` com a `06-navegacao.html` da BANCADA por cima. **O produto
dela não é tocado**; o WebKit, o BOOTSTRAP, o pacote e os gestos são os de
verdade, e o daemon é um dublê.

O instrumento está em
`/tmp/claude-1000/.../scratchpad/a6/prova_de_tela.py`, e roda `--oculta`
(`Gtk.OffscreenWindow`) — o próprio `utils/tela_de_mentira` declara que offscreen
não toca compositor nenhum, então nada nasce na tela dela. `--sem-cor` junto, para
o leitor de plástico não abrir lease de hidraw por um cartão sintético.

**O DOM lido, com o portão FECHADO (dublê em modo jogo, teclado desligado):**

```
 "interruptor": { "texto": "Desligado",
                  "borda": "rgb(52, 55, 70)",     ← --border-sutil
                  "cursor": "not-allowed",
                  "pino":  "rgb(52, 55, 70)" },
 "modo_portao":   { "visivel": true,  "texto": "O mouse e o teclado só se ligam
                    fora do jogo: … O degrau se troca na aba Jogar." },
 "teclado_custo": { "visivel": true,  "texto": "Com a “Função do teclado” em
                    “Desativado” saem também o teclado na tela (L3/R3) e as três
                    regiões do touchpad." },
 "marcas_do_touchpad": 6
```

**E com o portão ABERTO — a mesma tela, sem o fato:**

```
 "interruptor": { "borda": "rgb(68, 71, 90)",     ← --border-forte, o de sempre
                  "cursor": "pointer" },
 "modo_portao":   { "visivel": false, "texto": "" },
 "teclado_custo": { "visivel": false, "texto": "" }
```

### 2. O CLIQUE — no que mudou, e a resposta

`--prova-clique modo`, com o dublê em modo jogo. **O clique é seguro por
construção:** nesse estado o gesto levanta ANTES de tocar a ponte, e o relato do
piloto confirma `gestos: 1 · aplicados: 0` — zero IPC, nada mudou na máquina
dela. (`modo` está em `hefesto_vivo.PERIGOSOS` justamente por mexer no cursor
dela; este caminho não chega lá.)

```
[gesto falhou] 06-navegacao.html · modo: O mouse e o teclado só se ligam fora do
jogo: …

 "recados_na_tela": [ { "tom": "recusa", "lugar": "tarja",
                        "texto": "O mouse e o teclado só se ligam fora do jogo: …" } ]
```

O botão apagado **respondeu**, e a frase que chegou ao recado é **byte a byte a
mesma** que está escrita ao lado dele. É a D-03 inteira, medida.

### 3. AS FOTOS

**As quatro que provam viajam com este relatório**, porque prova que mora só no
`/tmp` morre com a sessão:

| o que mostra | arquivo |
| --- | --- |
| a aba VIVA, portão FECHADO — o interruptor apagado e as duas linhas novas | [`ONDA2-06-o-portao-fechado.png`](ONDA2-06-o-portao-fechado.png) |
| a MESMA tela, portão ABERTO — o interruptor normal e a tira vazia | [`ONDA2-06-o-portao-aberto.png`](ONDA2-06-o-portao-aberto.png) |
| a tela de botões, com a tira e as três marcas do touchpad | [`ONDA2-06-a-tira-sob-a-tabela.png`](ONDA2-06-a-tira-sob-a-tabela.png) |
| o clique no interruptor apagado, com a recusa na tarja | [`ONDA2-06-o-clique-recusado.png`](ONDA2-06-o-clique-recusado.png) |

O antes e o depois da BANCADA em repouso ficaram no `scratchpad`
(`a6/06-ANTES.png` e `a6/06-DEPOIS.png`) e são **pixel a pixel iguais** — as
duas linhas novas nascem vazias.

A aba em repouso mede **777px** de altura antes e depois, com
`passa_da_dobra: 0`: as duas linhas novas da tira nascem vazias e não custam um
pixel.

### 4. AS DOZE MORDIDAS

`scratchpad/a6/mordidas.py` arranca uma cura por vez, roda a régua nova, e
devolve. **Nenhuma passou com a cura arrancada:**

```
MORDIDA [01] a recusa deixa de ser a MESMA frase do aviso
   -> 1 failed, 16 passed      reprovou: test_a_razao_do_portao_e_a_mesma_no_aviso_e_na_recusa
MORDIDA [01] a linha do portão passa a falar sempre
   -> 1 failed, 16 passed      reprovou: test_a_linha_do_portao_so_nasce_quando_ha_portao
MORDIDA [01] a folha perde a regra que apaga o interruptor
   -> 1 failed, 16 passed      reprovou: test_a_folha_apaga_o_interruptor_pela_propria_linha
MORDIDA [02] uma das três regiões perde a marca
   -> 2 failed, 15 passed      reprovou: test_a_marca_esta_nas_tres_regioes_do_touchpad_e_so_nelas
                               reprovou: test_a_marca_nao_encosta_em_linha_que_dispara
MORDIDA [03] a razão do PS sai da dica
   -> 1 failed, 16 passed      reprovou: test_a_dica_da_tela_de_botoes_diz_por_que_o_ps_fica_fora
MORDIDA [04] a tira deixa de nomear o que o Guardar substitui
   -> 2 failed, 15 passed      reprovou: test_o_aviso_nomeia_o_que_o_guardar_vai_substituir
                               reprovou: test_o_guardar_nomeia_os_atalhos_que_param_de_valer
MORDIDA [04] a tira deixa de dizer o que o “— Nada —” não cala
   -> 1 failed, 16 passed      reprovou: test_o_que_o_nada_nao_cala_e_dito_e_o_produto_e_quem_decide
MORDIDA [04/§3-2] a confirmação volta a não dizer “atalhos”
   -> 1 failed, 16 passed      reprovou: test_a_confirmacao_do_voltar_ao_padrao_usa_a_palavra_atalhos
MORDIDA [05] a frase do custo diverge da GTK
   -> 1 failed, 16 passed      reprovou: test_o_custo_do_teclado_e_o_que_a_gtk_diz
MORDIDA [05] a linha do custo deixa de ser tri-estado
   -> 1 failed, 16 passed      reprovou: test_a_linha_do_custo_e_tri_estado[bloco2-False]
MORDIDA [§3-2] o “Voltar ao padrão” volta a apagar calado
   -> 1 failed, 16 passed      reprovou: test_o_voltar_ao_padrao_da_recibo_do_que_apagou
MORDIDA [§3-1] o “Guardar” grava e não diz o que perdeu
   -> 1 failed, 16 passed      reprovou: test_o_guardar_nomeia_os_atalhos_que_param_de_valer
```

**E a régua devolvida:** `17 passed in 0.62s`, e a leva da aba inteira
(`test_a_06_*` + as três vizinhas) `177 passed`.

### 5. A MORDIDA QUE PRECISOU SER AFIADA — e ela era um verde falso

A primeira redação de `test_o_que_o_nada_nao_cala…` **passou com a cura
arrancada**. A causa é a família de sempre: ela perguntava se o NOME do botão
aparecia no aviso, e o nome continuava aparecendo — só que na frase *"Não
acendem nada hoje"*, que diz o CONTRÁRIO. A cura foi recortar o `<div>` que fala
de não-calar e cobrar ali, mais a asserção simétrica: quem continua falando não
pode aparecer entre os que calaram.

---

## O que medi e derrubou uma suposição

### 1. **“— Nada —” NÃO CALA SEIS DAS VINTE E UMA LINHAS** — defeito novo, do motor

Este não estava em documento nenhum. `set_button_actions`
(`integrations/uinput_mouse.py:311-316`) reconstrói dois dos três mapas a partir
do DE FÁBRICA menos `do_mouse`:

```python
self._mapa_dpad = {b: k for b, k in DPAD_TO_KEY.items() if b not in do_mouse}
self._mapa_tap  = {b: k for b, k in EDGE_KEY_MAP.items() if b not in do_mouse}
```

Um botão em `— Nada —` **nunca entra em `do_mouse`** — o `resolver()` o pula de
propósito —, logo ele não é subtraído desses dois mapas e continua emitindo o de
fábrica. Medido, com o `resolver()` e os mapas do dono:

```
"— Nada —" no cross      -> NADA (calou de verdade)
"— Nada —" no options    -> NADA (calou de verdade)
"— Nada —" no dpad_up    -> ainda emite  dpad=KEY_UP
"— Nada —" no circle     -> ainda emite  tap=KEY_ENTER
```

São **seis** linhas: as quatro direções do d-pad, o Círculo e o Quadrado. É um
botão que responde calado — a tela oferece o silêncio e o produto não o entrega.
A cura é do motor (`set_button_actions` precisa saber quais botões foram calados
DE PROPÓSITO, e hoje `do_mouse` não distingue *"não é do mouse"* de *"foi
calado"*), e está em *"o que sobrou"*. Enquanto ela não vem, **a tela diz**.

A régua que cobra isso chama o `set_button_actions` **de verdade**, sobre um
objeto nu (`types.SimpleNamespace`): o método só escreve `self._mapa_*`, não toca
device nenhum e não precisa de `uinput`. É a diferença entre medir o produto e
medir uma cópia da regra dele — e é o que faz o caso continuar verde no dia em
que a cura chegar.

### 2. **A MARCA NÃO CABIA NA COLUNA DO NOME**, e a decisão dizia que cabia

A decisão do PO ([02]) diz, com todas as letras: *"Nenhuma linha nova — a marca
cabe na coluna do nome."* **Não cabia.** `.tab td.b` tem `width:176px`,
`white-space:nowrap` e `overflow:hidden`, e a linha mais longa das 21 (`Touchpad
· Clique esquerdo`) já usa ~168px. Fotografado: a marca saía **cortada**, com
dois caracteres à mostra por baixo do `<select>` vizinho.

Quando o instrumento e o aparelho discordam, o aparelho ganha. A marca é a
decisão; o que cedeu foi o número: 250px **dentro das pop-ups apenas**
(`.tn-cx` escopa a regra), deixando ~350px para a segunda coluna — mais do que a
maior opção da lista pede. As tabelas da ABA continuam com os 176px que ela
aprovou.

### 3. **UM COMENTÁRIO DE CSS VIROU ELEMENTO NA PÁGINA**

A primeira redação do bloco novo da folha citava a tag do rótulo por extenso.
O `<style>` vem antes do corpo, e
`test_a_06_o_status_do_modo_nao_mente::test_o_interruptor_tem_os_dois_enderecos`
achou a **citação** em vez do elemento e reprovou. É a irmã da armadilha do
`# noqa-acento` que virou título visível na aba Gatilhos: **o que se escreve num
gerador chega ao arquivo**, comentário incluído.

### 4. A TIRA ENCOLHE A TABELA, e isso é o desenho funcionando

`.tn-corpo > .moldura{overflow-y:auto}` — quem rola é a tabela, não a caixa. Com
a tira embaixo, a área da tabela encolhe e as 21 linhas passam a rolar. É
exatamente a garantia que a pop-up já dava ao título e ao "Guardar", agora
estendida à tira: **o que vai ser apagado nunca sai de vista**, e o preço é
rolagem no que se pode reler.

---

## O que NÃO verifiquei

- **A tela DELA.** Nada foi publicado: `interface/paginas/06-navegacao.html`
  está intocado, e o produto que ela usa continua exatamente como estava. Tudo o
  que este relatório mede foi medido contra a BANCADA (direto, ou pelo desvio de
  `onde.PUBLICADO` do instrumento).
- **O aparelho.** A bancada estava livre e não foi reservada: nada aqui para o
  daemon, escreve no controle ou chama `systemctl`. O instrumento roda com
  `--sem-cor` justamente para não abrir lease de hidraw.
- **O `apply_button_actions` rodando de verdade.** A afirmação da tira sobre o
  que "para de valer" foi medida contra `acoes_de_botao.resolver()` — a MESMA
  chamada que o `manager` faz — e contra a leitura do fonte, **não** contra um
  daemon aplicando um perfil com device de mouse vivo. É por isso que a frase
  diz *"assim que o mouse virtual estiver de pé"* em vez de prometer o desastre
  em todo caso: sem device, o método sai antes (`manager.py:614`).
- **A `--prova-de-mockup` e o passeio das dez.** Rodei a 06 sozinha; o efeito
  dos endereços novos sobre a contagem das outras nove abas não foi medido.
- **A suíte inteira.** É de quem coordena, e roda no fim, em oito lotes.

---

## O que sobrou para o próximo

### A) O MOTOR — e é aqui que o defeito §3-1 morre de verdade

**`core/acoes_de_botao.resolver()` precisa herdar `profile.key_bindings`.** Ele
parte de `padrao()` e nunca consulta o campo; `apply_button_actions`
(`profiles/manager.py:570`) roda DEPOIS do `apply_keyboard` e reescreve o
conjunto inteiro. A forma da cura, tal como a medição a desenha:

```python
def resolver(escolhas, *, atalhos_do_perfil=None):
    tabela = padrao()
    if atalhos_do_perfil:              # o que ela escreveu à mão vem ANTES
        tabela.update({b: "+".join(v) for b, v in atalhos_do_perfil.items()
                       if b in tabela})
    if escolhas:                       # e a escolha DESTA tela vence linha a linha
        tabela.update({b: a for b, a in escolhas.items() if b in tabela})
```

e `apply_button_actions` passando `profile.key_bindings` junto. **Dois arquivos,
nenhum deles desta posse.** No dia em que isso entrar,
`a06_navegacao.atalhos_que_param_de_valer` devolve lista vazia, a frase da tira
some sozinha, e `test_o_aviso_nomeia_o_que_o_guardar_vai_substituir` continua
VERDE — foi escrito para isso.

### B) O MOTOR, segunda dívida: **“— Nada —” tem de calar de verdade**

`integrations/uinput_mouse.set_button_actions` reconstrói `_mapa_dpad` e
`_mapa_tap` do de fábrica menos `do_mouse`, e um botão calado não está em
`do_mouse`. Seis das 21 linhas continuam digitando. A cura pede um segundo
argumento (os botões CALADOS, que `resolver()` já conhece — ele os pula no
`if token == TOKEN_NADA`) ou uma quarta sacola no `resolver()`. Enquanto isso, a
tela diz.

### C) A LINHA DE `hefesto_vivo.PERIGOSOS` — não falta nenhuma

Os dois gestos desta aba que gravam no disco dela (`guardar-definicoes` e
`padrao-definicoes`) **já estão na lista**, desde 03/09. Esta frente **não criou
gesto novo** e não escreve por nenhum caminho que a lista não cubra: as três
chaves novas (`modo-portao`, `teclado-custo`, `aviso-da-tabela`) são de PINTURA,
e nenhuma tem `data-gesto`. Nada a acrescentar — conferido, não presumido.

### C.1) UMA LINHA DE `mockup/DIVERGENCIAS.md` FICOU FALSA, e ela não é desta posse

A seção `## 06-navegacao.html` diz hoje:

> **04/09/2026** — a folha das dez peças (D-02 e D-03) entrou pelo `monta.py`.
> **Até publicar, o produto continua exatamente como ela o vê hoje:** nenhum
> elemento desta aba usa as peças, então as regras novas não casam com nada e a
> página publicada desenha o mesmo pixel que a bancada.

A primeira metade continua verdadeira e a **segunda caducou com esta frente**: a
bancada da 06 passou a ter cinco endereços a mais e uma coluna 74px mais larga
dentro das pop-ups, então ela **não** desenha mais o mesmo pixel que a publicada.
O portão `desenho-aprovado` continua VERDE (a aba está declarada em trabalho), e
por isso nada acusa a frase velha.

O arquivo é compartilhado pelas dez frentes desta onda e está fora da minha
posse — **a linha a acrescentar sob aquela seção é esta**:

```markdown
- **04/09/2026** — a ONDA2-06 pôs na bancada as cinco decisões do PO: a razão do
  portão de modo e o custo do teclado na tira de estados, a marca das três
  regiões do touchpad, a razão do PS na dica e a tira de aviso sob a tabela de
  botões. **A partir daqui a bancada NÃO desenha mais o mesmo pixel que a
  publicada** — o que fica esperando é o olho dela.
```

### D) A MARCA VIVA DO TOUCHPAD — sprint própria

A decisão do PO diz que *"a marca nasce FIXA"*, e ela nasceu. A marca **viva**
(que acende só quando o touchpad é o ponteiro do sistema) depende de o daemon
publicar o `ponteiro_do_sistema` do leitor no `state_full` — hoje ele só existe
dentro do daemon (`daemon/subsystems/keyboard._combine_with_touchpad:442`). É
trabalho no daemon, não na aba.

### E) AS LINHAS DE `MOTOR` DESTA ABA QUE NÃO COUBERAM, com a razão

| linha do CSV | por que não coube |
| --- | --- |
| **206** Velocidade guardada no PERFIL (`Profile.mouse`) | pede escrever a seção `mouse` do perfil; nenhum pacote da interface a alcança, e o caminho passa pela aba **Perfis** e pelo esquema — fora desta posse |
| **205** Preferência de velocidade com a emulação DESLIGADA | a perda é do DAEMON: `set_mouse_speed` só chama `save_mouse_emulation` com `mouse_emulation_enabled` verdadeiro (`daemon/lifecycle.py:1488-1496`). Curar na aba seria a interface guardando o que o daemon joga fora |
| **208 / 210** Editar QUAL TECLA cada botão digita (campo aberto) | é campo FECHADO × campo ABERTO, estrutural. A tela teria de ganhar um campo de texto com `dehumanize_binding`/`parse_binding` na fronteira, e o perfil teria de receber `key_bindings` por esta aba — o que só faz sentido DEPOIS da cura (A), senão o primeiro "Guardar" apagaria o que o campo novo escreveu |
| **213** Convivência `key_bindings` × `button_actions` | é a cura (A). Aqui fechou só a metade dita |

---

## As linhas do CSV que esta frente fechou — para a ONDA1-X lançar

**Não toquei em `docs/data/paridade-gtk-html.csv`** (ele tem UM dono nesta leva).
Abaixo, o que medi, com o endereço novo **lido no código**.

| linha | feature | veredito de hoje | o que proponho | endereço novo no HTML |
| ---: | --- | --- | --- | --- |
| **195** | Portão de modo: impedir ligar o mouse fora de "Controlar o PC" | `DIFERENTE` | **`IGUAL`** no comportamento (o interruptor apaga ANTES e a razão fica ao lado, como na GTK). A ressalva que fica: a frase é OUTRA de propósito — a da GTK manda à aba "Início", que não existe no desenho das dez | `interface/pacotes/a06_navegacao.py:RAZAO_DO_PORTAO` · `:_a_razao_do_portao` · `interface/aba06.py:ESTADOS` (campo `modo-portao`) · a regra `.quadro-corpo:has(.estado.portao .laranja) .tog[data-gesto="modo"]` |
| **214** | O botão PS na tabela de atalhos | `FALTA_NO_HTML` | **`DIFERENTE` por decisão** (fica fora, e a razão está dita) — sai do balde DESENHO | `interface/aba06.py:D_DEFINICOES` |
| **215** | As três regiões do touchpad na tabela | `DIFERENTE` | **`DIFERENTE` fechado por decisão** — ficam, com a marca, e a tela parou de prometer | `interface/aba06.py:MARCA_DO_TOUCHPAD` + `BOTOES` · `D_DEFINICOES` |
| **219** | Nomear os botões que não digitam nada | `FALTA_NO_HTML` | **`DIFERENTE`** — a tira nomeia, e vai ALÉM da GTK: ela diz também os dois donos do R3 e as seis linhas que o `— Nada —` não cala | `interface/pacotes/a06_navegacao.py:_aviso_da_tabela` · `:_dois_donos` · `:_linhas_que_nao_acendem` · `interface/aba06.py:AVISO_DA_TABELA` |
| **220** | Nomear os atalhos que o perfil guarda e a lista não mostra | `FALTA_NO_HTML` | **`DIFERENTE`** — a tira os nomeia e diz que guardar os substitui. A frase é DIFERENTE da GTK por FATO: lá *"nada nesta aba os apaga"*, aqui apaga | `interface/pacotes/a06_navegacao.py:atalhos_que_param_de_valer` · `:_aviso_da_tabela` |
| **221** | Avisar o CUSTO de desligar o teclado emulado | `FALTA_NO_HTML` | **`DIFERENTE`** — a frase é permanente enquanto durar, em vez do toast de 30 s | `interface/pacotes/a06_navegacao.py:_o_custo_de_desligar_o_teclado` · `:O_QUE_SAI_COM_O_TECLADO` · `interface/aba06.py:ESTADOS` (campo `teclado-custo`) |
| **211** | Voltar ao padrão dos atalhos | `DIFERENTE` | **continua `DIFERENTE`** (rascunho × disco é troca de modelo deliberada), mas **a metade PERIGOSA fechou**: a confirmação passou a dizer "atalhos de teclado" e o gesto dá recibo do que apagou | `interface/aba06.py:TELA_DEFINICOES` (o `confirma`) · `interface/pacotes/a06_navegacao.py:padrao_definicoes` |
| **213** | Convivência `key_bindings` × `button_actions` no daemon | `DIFERENTE` | **continua `DIFERENTE`** — fechou só a metade DITA. A cura é (A), no motor | — |

**E há uma linha NOVA a abrir**, que esta frente mediu e não existia no
inventário:

> `06-navegacao` · **`— Nada —` não cala seis das 21 linhas** ·
> `FALTA_NO_HTML`/`MOTOR` · `integrations/uinput_mouse.set_button_actions:311-316`
> reconstrói `_mapa_dpad` e `_mapa_tap` do de fábrica menos `do_mouse`, e um
> botão calado não entra em `do_mouse`. As quatro direções do d-pad, o Círculo e
> o Quadrado continuam digitando. **A tela já diz**; o produto ainda não faz.

---

## O portão que fica VERMELHO, e ele é o meu trabalho aparecendo

```
paridade-gtk-html      VERMELHO rc=1
    divida-fechada: paridade-gtk-html.csv:220  [06-navegacao] Nomear os
      atalhos que o perfil guarda e a lista não mostra
      o sinal 'frase_dos_atalhos_fora_da_lista' APARECEU em
      src/hefesto_dualsense4unix/interface/pacotes/a06_navegacao.py.
```

O portão está **certo**: a dívida da linha 220 fechou. O sinal aparece num
COMENTÁRIO — o que explica por que a frase desta tela **não pode** ser a da GTK
(lá *"nada nesta aba os apaga"*, aqui o "Voltar ao padrão" apaga) —, e não numa
chamada; mas o veredito da linha mudou de verdade, e quem reescreve a linha é a
ONDA1-X, dona do CSV. **Deixo o vermelho**, como a coordenação pediu.

Os outros **39 portões**: verdes.
