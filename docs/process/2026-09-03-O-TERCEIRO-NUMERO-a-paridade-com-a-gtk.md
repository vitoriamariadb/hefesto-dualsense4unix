# O TERCEIRO NÚMERO — a paridade com a GTK

**03/09/2026.** Esta casa tinha dois números sobre a interface nova, e os dois
mediam a interface nova **contra ela mesma**:

| número | o que compara | o que ele não pode responder |
| --- | --- | --- |
| a régua de tela | quantos campos da página são escritos pelo produto | se o campo devia existir |
| a régua do mockup | o publicado contra o desenho que ela aprovou | se o desenho cobre o que o produto já fazia |

Nenhum dos dois responde a pergunta da qual sai a fila de trabalho: **o que a
janela GTK faz e a interface em HTML ainda não faz.** Esta é a medição desse
terceiro número, e ele nasce com dono, com dado e com portão.

O número é **14%**.

---

## 1. O que se mediu, e como

**396 features**, uma a uma, lendo os dois lados no fonte — a janela GTK
(`gui/main.glade` + `app/actions/` + `app/widgets/`) contra a interface em HTML
(`interface/` + `app/telas/`) — e, em oito das dez abas, **rodando o pacote da
aba contra o daemon vivo dela**, em leitura pura.

Uma feature é uma coisa que a tela **faz ou diz**: um botão, um campo que se
repinta, um aviso que acende sozinho, uma recusa com frase. Cada uma recebeu um
veredito e o **endereço dos dois lados**, para a próxima pessoa conferir sem
refazer a leitura.

| veredito | o que quer dizer |
| --- | --- |
| `IGUAL` | os dois fazem a mesma coisa, pelo mesmo motor |
| `DIFERENTE` | os dois fazem, e não a mesma coisa |
| `FALTA_NO_HTML` | a GTK faz, o HTML não |
| `SO_NO_HTML` | o HTML faz, e a GTK nunca fez |
| `NAO_DA_PARA_SABER` | não se decide lendo — precisa de bancada |

**A paridade é `IGUAL / total`.** É a régua mais dura de propósito: `DIFERENTE`
não conta como paridade, porque a queixa dela que originou tudo foi exatamente
essa — *"o produto via html não funcionou igual o gtk"*.

O dado mora em **[`docs/data/paridade-gtk-html.csv`](../data/paridade-gtk-html.csv)**,
396 linhas, e o portão que o mantém honesto é
**[`scripts/check_paridade_gtk_html.py`](../../scripts/check_paridade_gtk_html.py)**.

---

## 2. O número, por aba

<!-- TABELA-DA-PARIDADE -->

| aba | feats | IGUAL | DIFER | FALTA | SO_HTML | ? | paridade |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 01-jogar | 42 | 5 | 12 | 20 | 4 | 1 | 12% |
| 02-controles | 50 | 4 | 18 | 24 | 4 | 0 | 8% |
| 03-gatilhos | 31 | 10 | 10 | 5 | 5 | 1 | 32% |
| 04-iluminacao | 35 | 5 | 9 | 13 | 7 | 1 | 14% |
| 05-vibracao | 31 | 6 | 12 | 10 | 3 | 0 | 19% |
| 06-navegacao | 40 | 3 | 19 | 9 | 9 | 0 | 8% |
| 07-lancadores | 30 | 8 | 6 | 6 | 9 | 1 | 27% |
| 08-conexoes | 49 | 6 | 17 | 24 | 2 | 0 | 12% |
| 09-sistema | 38 | 3 | 15 | 13 | 7 | 0 | 8% |
| 10-perfis | 50 | 8 | 17 | 16 | 9 | 0 | 16% |
| TODAS | 396 | 58 | 135 | 140 | 59 | 4 | 15% |

<!-- /TABELA-DA-PARIDADE -->

A tabela é **gerada da contagem do CSV** e conferida pelo portão (regra
`numero-publicado`): quem mexer no dado e não regerar esta seção é barrado
nomeando a aba que divergiu. Um número publicado que não se pode conferir vira
folheto, e este é o número que ela vai ler para decidir.

**Duas correções de fato, e as duas são deste dia.** O primeiro rascunho desta
medição publicou **394 features e 174 `FALTA_NO_HTML`**. Os números certos são
**396 e 176**: as abas 08 e 09 contaram uma feature a menos cada uma no resumo
que escreveram, e a lista de features delas — que é o dado — sempre teve 49 e
38. O errado sai; o certo fica. E o `01-jogar` publicou **11%** onde a divisão
dá **12%** (5 de 42).

---

## 3. O padrão, e ele é UM SÓ nas dez abas

> **O que tem GESTO migrou. O que é LEITURA AO VIVO não.**

Os botões funcionam, e funcionam bem: reusam o motor da GTK **função por
função** — `rumble_policy_set_checked`, `acao_mic`, `acao_speaker_mudo`,
`LogicaDoMapa`, `ordem_de_exibicao`, `politica_do_rotulo`. É a lei 0 sendo
cumprida: quase nada foi reescrito.

A leitura viva não migrou quase nada. E **isso não é tela vazia — é tela que
mente**, porque o que está na página é o valor que o gerador cravou do desenho
aprovado, e ele fica lá para sempre. Fotografado no HTML publicado, contra o
daemon vivo dela:

| a tela diz | o daemon diz |
| --- | --- |
| três glifos acesos no card do P1 (`cross`, `dpad_up`, `l2`) | ninguém tocou em botão nenhum |
| L2 em `200 / 255` | o gatilho está solto |
| giroscópio em `+143.2 / −412.0 / +22.8` | o controle está parado |
| volume do alto-falante `100` em todo controle | um valor por controle |
| degrau `Máximo` aceso na coluna do P1 | `rumble_policy = 'balanceado'` |
| interruptor do mouse em **Ligado** | `mouse_emulation.enabled = False` |
| chip `Sony DualSense` aceso, e `Xbox 360` no P2 | `flavor = dualsense` nos dois |
| barra de luz `#7EB8D4` | o campo ao lado dela diz `#0000FF` |
| o card do P2 mostra tudo isso igual ao P1 | o daemon só publica leitura para o primário |

A causa é uma só e está no vocabulário de endereço: **a página não tem onde pôr
o valor.** A 01 publicada tem 11 `data-campo` e **zero** `data-hef-alvo` /
`data-hef-quando`; a 08 tem 13 `data-campo` e nenhum deles é `via`, `bateria`,
`ponte` ou `fragil` — que são exatamente os quatro campos que o pacote já emite
por controle.

**A metade boa disso**: em vários pontos o dado JÁ é calculado certo e morre no
caminho. O `a09_sistema` lê o autostart na faixa lenta e o achatamento joga
fora; as `travas` da aba Sistema (quais gestos estão cinza, e por quê) são
calculadas em `gui/aba_sistema.py` e não são reencaminhadas; `AVISOS_DA_TELA`
tem as seis fontes puras da coluna Atenção da aba Início e quem as chama é a
bancada, não o produto. **Boa parte da dívida é ponte entre dois arquivos que já
existem, não código novo.**

---

## 4. As três categorias, com exemplo

### `FALTA_NO_HTML` — 176 features, 44% do total

O maior bloco, e o que decide a fila.

- **`05-vibracao` · qual degrau está aceso.** A GTK tem
  `_apply_policy_to_widgets` (`app/actions/rumble_actions.py:699`) fazendo a
  exclusão mútua entre os quatro. No HTML a classe `on` está cravada da cena do
  mockup: com `rumble_policy = 'balanceado'` no daemon, a tela mostra `Máximo`
  aceso no P1. Ela clica, o daemon obedece, e a tela não muda. **O produto já
  sabe disso por escrito** — `SEM_DONO["degrau-aceso"]`
  (`src/hefesto_dualsense4unix/interface/pacotes/a05_vibracao.py:49`) — e o
  pintor já tem o alvo `classe`. Falta o endereço no HTML e a emissão no pacote.
- **`02-controles` · os 16 glifos.** `_refresh_glyphs` no card da GTK; no HTML,
  três glifos com a classe `on` do mockup, acesos o tempo todo.
- **`04-iluminacao` · o brilho.** Contados os gestos das duas páginas
  (publicado: cor 16, apagar 2, auto 2, player 8; mockup: cor 18, apagar 2,
  auto 2, player 8) — **nenhum de brilho em lugar nenhum**. O trilho é
  decoração: ela vê `82%` e não tem como mexer.
- **`03-gatilhos` · os 73 parâmetros.** 17 dos 19 modos têm ajuste, e na GTK
  todos são `Gtk.Scale` que ela arrasta. No HTML são barras de leitura, sem
  `data-gesto` e sem `<input>`. Escolher um modo aplica os padrões dele e
  acabou — e "Montar do zero", cujos padrões são oito zeros, é um modo que não
  faz nada.
- **`10-perfis` · o botão "Salvar este perfil".** Com ele foram embora as cinco
  perguntas do Salvar e a fusão com o rascunho das outras abas.

### `DIFERENTE` — 103 features, 26%

Fazem os dois, e não a mesma coisa. É a categoria que mais engana, porque a tela
não fica vazia: ela responde outra pergunta.

- **`05-vibracao` · o número do multiplicador.** A GTK mostra o **pedido**
  (`_POLICY_MULT[policy] * 100` = 100); o HTML mostra o **aplicado**
  (`rumble_mult_applied` = 0,7 → `70%`). Medidos lado a lado, ao vivo. E o 0,7 é
  um valor que o próprio produto documentou como preso em passthrough ocioso —
  o HTML publica exatamente essa aparência.
- **`06-navegacao` · o campo mudou.** A GTK edita `Profile.key_bindings` (9
  botões, combinação livre); o HTML edita `Profile.button_actions` (21 botões,
  lista fechada). Os dois existem e o daemon aplica os dois — mas o
  `apply_button_actions` roda **depois** e reescreve o conjunto inteiro de
  bindings a partir do de fábrica. **No instante em que ela clica "Guardar" na
  tela nova, tudo o que editou na tabela da GTK deixa de valer, em silêncio.**
- **`01-jogar` · a palavra do transporte.** A GTK diz `cabo` e `rádio`, com
  função dona (`palavra_do_transporte`); o HTML diz `USB` e `BT`, com um `if`
  inline. Duas cópias da mesma tradução, e o HTML voltou ao jargão que a GTK
  tinha abandonado.
- **`04-iluminacao` · onde a cor é gravada.** A GTK guarda a **intenção** no
  rascunho; o HTML **fotografa o que está aceso**. A diferença aparece quando o
  daemon não aplicou: a GTK salva o que ela pediu, o HTML salva o que o aparelho
  está mostrando.

### `SO_NO_HTML` — 59 features, 15%

**Ninguém pode "consertar" removendo.** Boa parte é motor que já existia em
`integrations/` e nunca tinha tela: o histórico do perfil (`Voltar à de
ontem`), o `Retomar` da pausa do daemon, os cinco lançadores, `Meus efeitos`, a
tabela de ajuste por controle, o `Exportar`. A aba 07 sozinha tem nove, e **as
nove são a lei 0 cumprida**: não se recriou nada, ligou-se o que estava escrito.

E há três lugares em que **o HTML está certo e a GTK errada**, medidos:
escolher "Desligado" no campo de modo manda `trigger.reset` (a GTK arma a trava
com `Off`); o HTML nomeia a curva salva (a GTK sempre mostra "Personalizar"); e
os três pontos em que a GTK aplica o wrapper em massa ignoram a lista "não usar
neste jogo" (o HTML passa `excluir=`). **Três linhas a NÃO copiar de volta.**

### `NAO_DA_PARA_SABER` — 4 features

Não se decide lendo. As quatro precisam de bancada: se a lista de 19 modos abre
no compositor dela, se o `Automático` de fato larga a luz para o jogo, se o
reparo do HTML repõe a linha no `.vdf` dela, e se o nome do plástico chega ao
cartão. **Ficam registradas como indecidíveis em vez de chutadas** — é a mesma
disciplina do `de_onde_sei` do mapa de canais.

---

## 5. A régua, e por que ela não compara o CSV com ele mesmo

Uma régua que confere o CSV contra o CSV não mede nada. É a família de defeito
que esta casa mais pagou, e uma frente deste mesmo dia pegou uma régua
comparando o produto **contra ele mesmo** — ela concordava com a semente errada
dos dois lados.

Então **o veredito de cada linha virou uma afirmação sobre o código**,
verificável sem o CSV. Cada linha carrega um `sinal` (um símbolo literal) e o
que se espera dele:

| veredito | `sinal_espera` | o que a régua lê no fonte |
| --- | --- | --- |
| `IGUAL` · `DIFERENTE` · `SO_NO_HTML` · `NAO_DA_PARA_SABER` | `PRESENTE` | o símbolo **tem** de estar no arquivo do lado HTML que a linha cita |
| `FALTA_NO_HTML` | `AUSENTE` | o símbolo da GTK **não pode** aparecer no lado HTML |

**A segunda metade é a que envelhece o número de propósito.** Quando alguém
fechar uma dívida — o lado HTML passar a chamar a função da GTK que a carregava,
ou a página ganhar o endereço que lhe faltava (`data-campo="fragil"`) —, o
símbolo aparece, o portão **reprova**, e o CSV tem de ser reescrito. Sem isso,
"14% de paridade" vira propaganda no dia seguinte à primeira cura.

### As oito regras

| regra | reprova quando |
| --- | --- |
| `integridade` | cabeçalho, veredito fora do domínio, aba desconhecida, `(aba, feature)` repetido |
| `endereco-morto` | `caminho:linha` cujo arquivo sumiu, ou cuja linha passa do fim |
| `lado-trocado` | endereço da GTK na coluna do HTML, ou o contrário — é o que impede o portão de virar a régua que se compara consigo mesma |
| `sem-endereco` | linha sem endereço nenhum, ou que afirma `PRESENTE` e não diz **onde** |
| `sinal-sumiu` | `PRESENTE` cujo símbolo saiu do escopo — uma feature `IGUAL` pode ter sido removida sem ninguém ver |
| `divida-fechada` | `AUSENTE` cujo símbolo **apareceu** no lado HTML. O caso bom |
| `sinal-morto` | `AUSENTE` cujo símbolo não existe no lado GTK **e** não tem forma de endereço de tela: ninguém vai escrevê-lo, então a linha nunca morderia |
| `numero-publicado` | a tabela da §2 diverge da contagem do CSV |

A `sinal-morto` é a régua se auditando: ela pegou **quatro linhas minhas** na
primeira execução, antes de eu ensinar o portão que `data-campo="fragil"` é um
endereço legítimo *que ainda vai nascer*.

### O que ela NÃO mede, dito na cara

Nada aqui abre janela, clica ou toca aparelho. **Um botão que existe nos dois
lados e está quebrado nos dois passa por este portão sorrindo.** Quem morde isso
é a ponte JS do piloto (`--prova-gesto`), que roda com o daemon vivo. Este
portão responde uma pergunta só: *o CSV continua descrevendo o código de hoje?*

### O que se corrigiu ao escrever a régua

Três endereços da medição original apontavam para o arquivo **vizinho** ou para
uma linha que a árvore já tinha movido, e os três foram lidos e corrigidos:

| era | é | o que está lá |
| --- | --- | --- |
| `app/actions/relancar.py:2794` | `app/actions/home_actions.py:2794` | `render_pendente(self)` — o arquivo velho tem 301 linhas |
| `interface/pacotes/a03_gatilhos.py:864` | `.../a03_gatilhos.py:1084` | `def pacote(ctx: Contexto)` |
| `interface/pacotes/a08_conexoes.py:1966` | `.../a08_conexoes.py:2333` | a frase da recusa do cabo |

É o que a regra `endereco-morto` existe para pegar antes da próxima pessoa.

---

## 6. Como usar

```bash
scripts/check_paridade_gtk_html.py            # o portão (rc=1 no primeiro achado)
scripts/check_paridade_gtk_html.py --tabela   # o número por aba
```

Ele entra na camada **rápida** do `scripts/portoes.sh` (medido: 0,4 s) e no
`ci.yml`, porque a lista de portões desta casa é uma só.

**Quando o veredito de uma linha mudar** — e ele vai mudar, é para isso que o
trabalho existe —, o conserto é na **linha do CSV**, com o endereço novo lido no
código: veredito, `sinal`, `sinal_espera`, `sinal_escopo` e os dois `onde`. E
regerar a tabela da §2. Nunca afrouxando a regra no script.

---

## 7. O que este número diz sobre a fila

Três leituras que a tabela sustenta, e nenhuma delas é opinião:

1. **A `03-gatilhos` é a mais adiantada (32%) e a `02-controles`, a `06` e a
   `09` são as mais atrasadas (8%).** As três atrasadas não têm o mesmo
   problema: a 02 é leitura viva pura, a 06 **mudou de campo** (e o câmbio
   apaga edição da GTK em silêncio), e a 09 tem **sete botões sem dono** na tela
   dela hoje — o clique cai no despacho, imprime no stdout e não diz uma letra.
2. **Botão morto é pior que botão ausente.** A 09 tem sete, a 10 tem um
   ("Recarregar"), a 07 aponta três na 09. Todos com rótulo e tooltip, todos
   silenciosos. Custam pouco e enganam muito.
3. **Uma parte da dívida é ato dela, não código.** Quatro campos da 02
   (`touch-ponto`, `luz-cor`, `alto-num`, `alto-barra`) e o `data-campo="luz"`
   da 04 já têm dono e emissão, e esperam só o
   `scripts/check_o_desenho_aprovado.py --publicar`. Isso fecha cinco buracos
   sem uma linha de código nova.

O que o CSV **não** decide é a ordem. Ele diz onde estão os buracos, com
endereço; qual se fecha primeiro é dela.
