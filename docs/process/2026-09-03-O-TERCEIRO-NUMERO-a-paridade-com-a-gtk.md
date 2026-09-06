# O TERCEIRO NÚMERO — a paridade com a GTK

> ## ATENÇÃO — ESTE NÚMERO MEDE A BANCADA, NÃO O QUE ELA ABRE
>
> **Medido em 04/09/2026, e é o achado maior da leva daquele dia.** As dez
> frentes de aba entregaram, e **nenhuma publicou** — `git diff` em
> `src/hefesto_dualsense4unix/interface/paginas/` não mostra **um byte** de
> mudança. O produto que ela abre continua o de antes.
>
> ```
> cadeado         bancada=2  publicado=0
> reenviar        bancada=2  publicado=0
> auto-cores      bancada=1  publicado=0
> forca-mesa      bancada=1  publicado=0
> ```
>
> **E isso está CERTO**, não é falha: a direção é `mockup/` → produto, nunca o
> contrário, e *publicação é o olho dela* (PROVA-DE-TELA-01). As dez frentes
> recusaram publicar porque cada uma move pixel, e pixel é decisão dela.
>
> **A leitura correta da tabela abaixo:** ela diz *"o código sabe fazer"*, não
> *"ela já tem"*. A distância entre as duas é UMA leva — a de publicação, que
> é dela aprovar aba por aba.


**03/09/2026.** Esta casa tinha dois números sobre a interface nova, e os dois
mediam a interface nova **contra ela mesma**:

| número | o que compara | o que ele não pode responder |
| --- | --- | --- |
| a régua de tela | quantos campos da página são escritos pelo produto | se o campo devia existir |
| a régua do mockup | o publicado contra o desenho que ela aprovou | se o desenho cobre o que o produto já fazia |

Nenhum dos dois responde a pergunta da qual sai a fila de trabalho: **o que a
janela GTK faz e a interface em HTML ainda não faz.** Esta é a medição desse
terceiro número, e ele nasce com dono, com dado e com portão.

**O número não se escreve nesta linha.** Ele está na tabela da §2, linha
`TODAS` — gerada da contagem do CSV e conferida pela regra `numero-publicado`.

Aqui havia uma segunda cópia dele, e ela envelheceu: em 04/09/2026 esta linha
dizia **14%** sobre uma tabela do mesmo arquivo que já dizia **27%**. Os dois
números estiveram certos — o 14% é o de 03/09 (`548c0fbc`), o 27% é o de hoje —
e o defeito não foi de medição: **era o número ter dois donos, e só um deles ter
régua.** A cópia sai; o dono fica.

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
| 01-jogar | 42 | 10 | 13 | 14 | 4 | 1 | 24% |
| 02-controles | 50 | 12 | 18 | 16 | 4 | 0 | 24% |
| 03-gatilhos | 31 | 15 | 9 | 1 | 5 | 1 | 48% |
| 04-iluminacao | 35 | 11 | 14 | 2 | 7 | 1 | 31% |
| 05-vibracao | 31 | 14 | 8 | 6 | 3 | 0 | 45% |
| 06-navegacao | 40 | 14 | 16 | 1 | 9 | 0 | 35% |
| 07-lancadores | 30 | 14 | 5 | 1 | 9 | 1 | 47% |
| 08-conexoes | 49 | 19 | 21 | 7 | 2 | 0 | 39% |
| 09-sistema | 38 | 11 | 13 | 7 | 7 | 0 | 29% |
| 10-perfis | 50 | 14 | 20 | 7 | 9 | 0 | 28% |
| TODAS | 396 | 134 | 137 | 62 | 59 | 4 | 34% |

<!-- /TABELA-DA-PARIDADE -->

A tabela é **gerada da contagem do CSV** e conferida pelo portão (regra
`numero-publicado`): quem mexer no dado e não regerar esta seção é barrado
nomeando a aba que divergiu. Um número publicado que não se pode conferir vira
folheto, e este é o número que ela vai ler para decidir.

**Duas correções de fato, e as duas são de 03/09.** O primeiro rascunho desta
medição publicou **394 features**, e duas `FALTA_NO_HTML` a menos que a conta:
as abas 08 e 09 contaram uma feature a menos cada uma **no resumo que
escreveram**, e a lista de features delas — que é o dado — sempre teve **49** e
**38**, como a tabela acima continua mostrando. E o `01-jogar` publicou **11%**
onde a divisão daquele dia dava **12%** (5 de 42).

**As duas correções ficam; os valores que elas corrigiram, não.** O total de
`FALTA_NO_HTML` e a paridade da `01-jogar` mudam a cada cura, e quem quiser os
de hoje lê a tabela, que tem dono. O que não caduca é a lição:
**o resumo de uma aba não é o dado dela.**

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

### `FALTA_NO_HTML` — a GTK faz, o HTML não

**Quantas são hoje: a coluna `FALTA` da tabela da §2.** Em 03/09 este era o
maior bloco, com 44% do total, e era ele que decidia a fila. **Deixou de ser**,
e é o que as levas pagaram: as curas foram desproporcionalmente daqui, e hoje o
maior bloco é o `DIFERENTE`.

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
<!-- A LINHA DO BRILHO SAIU DAQUI EM 03/09/2026, e ela era a maior falta
     desta aba: *"contados os gestos das duas páginas, nenhum de brilho em
     lugar nenhum — o trilho é decoração"*. O trilho passou a GRAVAR (decisão
     dela, "Grava na hora") e a linha virou `DIFERENTE`, com a diferença
     medida e o endereço dos dois lados no CSV. Ela não é decisão a preservar:
     é um fato que a medição derrubou. -->
- **`03-gatilhos` · os 73 parâmetros.** 17 dos 19 modos têm ajuste, e na GTK
  todos são `Gtk.Scale` que ela arrasta. No HTML são barras de leitura, sem
  `data-gesto` e sem `<input>`. Escolher um modo aplica os padrões dele e
  acabou — e "Montar do zero", cujos padrões são oito zeros, é um modo que não
  faz nada.
- **`10-perfis` · o botão "Salvar este perfil".** Com ele foram embora as cinco
  perguntas do Salvar e a fusão com o rascunho das outras abas.

### `DIFERENTE` — os dois fazem, e não a mesma coisa

**Quantas são hoje: a coluna `DIFER` da tabela da §2.** É a categoria que mais
engana, porque a tela não fica vazia: ela responde outra pergunta. E ela
**cresce** enquanto o trabalho anda: das dez linhas que deixaram
`FALTA_NO_HTML` entre 04/09 de manhã e a tarde, quatro pararam aqui e seis
foram direto a `IGUAL`.

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

### `SO_NO_HTML` — o HTML faz, e a GTK nunca fez

**Quantas são hoje: a coluna `SO_HTML` da tabela da §2.**

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

### `NAO_DA_PARA_SABER` — não se decide lendo

**Quantas são hoje: a coluna `?` da tabela da §2.**

Elas precisam de bancada: se a lista de 19 modos abre no compositor dela, se o
`Automático` de fato larga a luz para o jogo, se o reparo do HTML repõe a linha
no `.vdf` dela, e se o nome do plástico chega ao cartão. **Ficam registradas como indecidíveis em vez de chutadas** — é a mesma
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
símbolo aparece, o portão **reprova**, e o CSV tem de ser reescrito. Sem isso a
paridade publicada vira propaganda no dia seguinte à primeira cura.

**E a régua fez o que prometia.** Entre 03/09 e 04/09 a paridade andou de 14%
para 27% sem que ninguém a "atualizasse" à mão: cada cura fez o portão reprovar,
e a linha do CSV foi reescrita com o endereço novo lido no código.

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

Três leituras que a tabela sustenta, e nenhuma delas é opinião. **Quem lê os
extremos lê a tabela da §2, não este parágrafo** — a lista abaixo diz que TIPO
de atraso cada aba tem, que é o que não muda a cada cura.

1. **Nem toda aba atrasada está atrasada pelo mesmo motivo, e é isso que decide
   a ordem.** A `02-controles` é **leitura viva pura** — o dado existe e a
   página não tem onde pô-lo. A `06-navegacao` **mudou de campo**
   (`Profile.key_bindings` → `Profile.button_actions`), e o câmbio apaga em
   silêncio o que ela editou na janela antiga; é dívida de MOTOR, e nenhuma
   pintura a fecha. E a `01-jogar` é quase toda **ponte entre dois arquivos que
   já existem** — 18 das 30 linhas abertas dela caíram no balde `LIGAR` da
   triagem de 04/09, a melhor razão entre trabalho e ganho do inventário.
   <!-- O RANKING SAIU DAQUI EM 04/09/2026, e ele estava certo em 03/09: a
        `03-gatilhos` era a mais adiantada com 32% e a `02`, a `06` e a `09` as
        mais atrasadas com 8%. Hoje a `03` continua na frente e as três de trás
        não são mais as mesmas — a `09` saiu do fundo. Um ranking é uma segunda
        cópia da tabela, e foi a segunda cópia que envelheceu o `14%` desta
        página; ele não volta. -->
2. **Botão morto é pior que botão ausente.** Ele tem rótulo e tooltip, e é
   silencioso: custa pouco e engana muito. **A contagem de 03/09 — sete na 09,
   um na 10 ("Recarregar") — não vale mais**, e as duas curas têm régua:
   `tests/unit/test_a_09_sistema_fecha_a_paridade.py` mede o ATO gesto a gesto
   na 09, e `tests/unit/test_aba10_os_cinco_gestos_calados_passaram_a_falar.py`
   fecha os cinco últimos da 10. O princípio fica; o número tem dono, e o dono
   é o CSV.
3. **UM FATO QUE CAIU EM 04/09/2026, e ele encurtava a fila.** Esta linha dizia
   que quatro campos da 02 (`touch-ponto`, `luz-cor`, `alto-num`,
   `alto-barra`) e o `data-campo="luz"` da 04 esperavam o
   `scripts/check_o_desenho_aprovado.py --publicar` dela. **Não esperam mais** —
   os cinco estão nas páginas que o produto abre, e as duas páginas são
   byte-idênticas ao mockup:

   ```
   $ grep -c 'data-campo="alto-barra"' src/.../interface/paginas/02-controles.html   → 4
   $ grep -c 'data-campo="luz"'        src/.../interface/paginas/04-iluminacao.html  → 2
   $ .venv/bin/python scripts/check_o_desenho_aprovado.py
     o produto já tem ..... 13
     o produto está atrás . 0  (0 em trabalho)
   ```

   **Nenhuma linha desta medição espera o `--publicar` dela.** As treze páginas
   foram publicadas na madrugada de 04/09.

O que o CSV **não** decide é a ordem. Ele diz onde estão os buracos, com
endereço; qual se fecha primeiro é dela.

## Nota de verificação — 05/09/2026

A linha `01-jogar` foi de **21% para 24%** e a `TODAS` de 118 para 119 iguais,
por uma dívida que fechou: *A palavra do transporte no cartão* saiu de
`DIFERENTE` para `IGUAL`.

O que ela era: `interface/mesa_viva.py` montava a palavra curta com `"USB" if
transporte == "usb" else "BT"`, e o `else` pegava a AUSÊNCIA — um controle cujo
transporte o daemon não publicasse aparecia na aba 01 como **"BT"**, a tela
afirmando rádio sobre um campo que ninguém leu. Havia quatro respostas vivas no
produto para o mesmo campo.

O que fechou: o `mesa_viva` passou a LER `pacotes.VIA_DO_TRANSPORTE`, cujo
`.get(..., "")` já respondia certo na aba 02 — e cujo comentário AFIRMAVA (sem
ser verdade) que as duas traduções eram a mesma. Agora são. A razão continua
sendo a do dono da frase longa (`app/actions/home_actions.py:1333`): *"'?' não é
resposta — é a tela encolhendo os ombros"*.

Régua: `tests/unit/test_a_tela_nao_inventa_o_transporte.py`, com mordida.
