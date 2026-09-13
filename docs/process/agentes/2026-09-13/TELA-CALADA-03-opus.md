# TELA-CALADA-03 — Sistema e Conexões perguntam, e não narram

**13/09/2026** · árvore `hefesto-voo/hefesto-voo/TELA-CALADA-03-opus` · branch
`voo/TELA-CALADA-03-opus` · base `onda/1309` = `53cfd578`

A régua da sprint, que é a palavra dela aplicada: **a pergunta de um gesto em
dois tempos fica** (sem ela o segundo clique não tem instrução), **o recibo
depois do gesto sai**, e **o conteúdo que ela pediu** («Ver detalhes», «Ver
plugins») fica.

---

## O que mudou

Quatro frentes, as quatro do §1 da sprint, e as quatro MEDIDAS no piloto oculto
antes de mexer (código de `53cfd578`) e depois (esta branch). O driver dirige a
janela por dentro (`ponte.perguntar`, `el.click()`), lê o DOM e fotografa a
`Gtk.OffscreenWindow` num Xvfb próprio — a tela dela não recebeu nada.

### 1 · «Aplicar aos jogos da Steam» (09) pergunta no painel

| | primeiro clique | o painel `registro-texto` |
| --- | --- | --- |
| **antes** | botão vira «Confirma?» | o repouso (`systemctl status`), sem uma palavra da pergunta; zero `.hef-recado` na página |
| **depois** | botão vira «Confirma?» | a pergunta do dono em 6 linhas, 838 px de 838 (sem rolar de lado), e ela continua lá no tique seguinte |

A pergunta ia por `recado`, e desde `71c69c57` a 09 não tem cartão nem faixa
onde um recado pouse — **o primeiro clique não mostrava nada**, como a sprint
previu. Agora ela sai pelo PACOTE (`_para_o_painel`), igual aos primeiros
cliques de «Refazer os consertos automáticos» e «Tirar a sobreposição Vulkan»,
e **não depende do canal de recado** que a TELA-CALADA-01 cala. Medido também
com o serviço parado (dublê da camada levantando): a pergunta chega igual.

O texto é `DaemonActionsMixin._STEAM_APPLY_CORPO`, palavra por palavra. Duas
coisas de forma, e nenhuma é palavra nova:

* **requebrado em 120 colunas** (`LARGURA_DA_PERGUNTA`). O painel é
  `white-space:pre`: linha que não cabe sai pela direita. Medido: a caixa tem
  838 px úteis e 134 px de altura, cabem ~133 caracteres e seis linhas; o
  terceiro parágrafo do dono tem 187. Quebrado em 120, as linhas medem
  117/120/120/66;
* **a instrução do segundo tempo** no fim: «Clique de novo para confirmar.», a
  frase que o clique 1 dos consertos JÁ escrevia. Virou `CLIQUE_DE_NOVO`, com
  dois leitores.

### 2 · Os quatro segundos cliques devolvem só os rótulos

`aplicar-aos-jogos`, `refazer-consertos`, `refazer-proton` e `procurar-camadas`:
no ramo confirmado, `_limpar_o_painel()` ANTES de agir (o ato pode levar 20 s
com a Steam fechando, e o painel diria "clique de novo" sobre um consentimento
já dado), e o retorno é só `{"blocos": …}`. O recibo continua sendo o do dono e
continua escrito — no diário da janela, pelo desenho que a TELA-CALADA-01 dá ao
sucesso: `[relato] 09-sistema.html · <gesto>: <frase>`.

| segundo clique (dublê) | antes, no painel | depois, no painel | depois, no diário |
| --- | --- | --- | --- |
| Aplicar aos jogos | (recado sem lugar) | repouso | `Pronto — 3 jogo(s) agora abrem pelo hefesto-launch …` |
| Consertos | `Correções aplicadas (sem senha). …` | repouso | a mesma frase |
| Camadas | `Nada mudou — não havia sobreposição para mexer.` | repouso | a mesma frase |
| Proton | `Pronto — 2 jogo(s) travados no Proton validado; …` | repouso | a mesma frase |

A recusa continua levantando (`RuntimeError`), e a pergunta também sai nela.

### 3 · Serviço parado: nem o registro nem o exame do desenho

O ramo de erro de `pacote()` passou a emitir `registro-texto`
(`_no_painel(None)`: o que ela pediu, ou o travessão), `exame-lista` e
`exame-contagem` (`monta.NADA_A_DIZER`).

| com a camada do produto levantando | antes | depois |
| --- | --- | --- |
| painel | `[23:41:02] daemon pronto …` · `[23:41:09] perfil "Mortal Kombat" aplicado aos 2 …` | `—` |
| exame | as oito linhas do desenho (*"Steam Input estava ligado em 2 jogos"*, Elden Ring) | vazio |
| contagem | `8 linhas · nenhum aviso` | vazia |

**A contagem entrou além do enunciado** (ele nomeia o registro e a lista): ela
é o cabeçalho do mesmo exame do desenho, e sem ela a foto mostrava
"8 linhas" sobre uma lista vazia.

### 4 · Conexões, «A luz não acende»: a contagem fica, o fim sai do cartão

`linha_da_espera` devolve `_sem_valor()` fora da espera, **inclusive quando ela
acabou falando**. A frase do fim (a do dono, `secao_controles`) vai ao diário
UMA vez, no instante em que a espera acaba (`_EsperaNaTela.correr`); a espera
acabada sai do depósito no mesmo tique; e `_correr_as_esperas` perdeu o
parâmetro `presentes`, que só existia para apagar o recado quando o controle
voltava.

Medido com daemon dublê (um controle sintético no rádio, `aa:bb:cc:00:00:01`),
`Disconnect` dublê e sonda que nunca vê o controle sumir — o desfecho que fala
«O controle não chegou a cair do rádio…»:

| | rótulo | linha `luz-espera` |
| --- | --- | --- |
| durante, antes e depois | «Cancelar» | `▲ Aperte PS no controle · procurando…  58s` → `56s`, `display:block` |
| relógio adiantado 70 s, **antes** | «A luz não acende» | «O controle não chegou a cair do rádio, então não houve o que reconectar. Ele continua pareado.», `display:block` |
| relógio adiantado 70 s, **depois** | «A luz não acende» | vazia, `display:none`; depósito com 0 esperas; a frase no diário |

### As réguas

* **Nova:** `tests/unit/test_sistema_e_conexoes_perguntam_e_nao_narram.py` — 14
  casos em quatro blocos, dois deles num WebKit oculto com a página PUBLICADA e
  o `BOOTSTRAP` do piloto (o registro e o exame do desenho somem do pixel; a
  pergunta cabe no painel sem rolar de lado). Todo dublê com desfecho sabe
  recusar (a Steam dublê recusa com jogo aberto).
* **Mudaram de contrato, com data e citação:**
  `test_os_quatro_gestos_da_aba_sistema_que_faltavam.py` (a pergunta no painel;
  o recibo no diário; a fixture zera o `_PAINEL`),
  `test_a_09_sistema_fecha_a_paridade.py` (o recibo do consertos no diário) e
  `test_a_conexoes_espera_o_ps_e_conta_os_slots.py` (o item 4 do cabeçalho e o
  bloco 4 reescritos com nota datada; as chamadas sem `presentes`).

---

## Qual mordida prova

Com a cura, as quatro réguas do escopo:

```
96 passed in 11.23s
```

Cinco mordidas, cada uma arrancando UM pedaço da cura por troca exata de texto,
rodando a régua nova e devolvendo o arquivo (md5 conferido depois:
`a09_sistema.py: SUCESSO`, `a08_conexoes.py: SUCESSO`):

```
1 · a pergunta volta ao `recado`                3 failed, 9 passed, 2 errors
  E   AssertionError: a pergunta voltou ao `recado`: a aba 09 não tem cartão nem
      faixa onde ele pouse, e o primeiro clique volta a não mostrar nada
  (os 2 errors são a fixture do WebKit: KeyError 'mesa' — não há pergunta a pintar)

2 · sem `_limpar_o_painel()` nos quatro         5 failed, 9 passed
  E   AssertionError: refazer-consertos: a pergunta do primeiro clique ficou no painel, velha
  E   assert 'o censo\n\nC...o para TIRAR.' == 'repouso'
  E   assert 'Cada jogo in...ra confirmar.' == 'repouso'

3 · ramo de erro sem painel e exame             3 failed, 11 passed
  E   AssertionError: o ramo de erro não emite `registro-texto` — a página continua
      com o literal do desenho nesse endereço
  E   AssertionError: o registro inventado pelo desenho continua na tela:
      '[23:41:02] daemon pronto · 2 controles · 2 gamepads virtuais · controle virtual ok\n[23:41…

4 · o fim da espera volta ao cartão             1 failed, 13 passed
  E   AssertionError: o recado do fim voltou ao cartão: 'O controle não chegou a cair
      do rádio, então não houve o que reconectar. Ele continua pareado.'

5 · o recibo não vai ao diário                  4 failed, 10 passed
  E   AssertionError: refazer-proton: o recibo do dono não chegou ao diário: ''
```

**A foto e o clique**, piloto `--oculta` com `HEFESTO_DUALSENSE4UNIX_SKIP_PRESET_SEED=1`,
três roteiros antes e três depois (as tabelas de «O que mudou» são a leitura do
DOM de cada passo). As fotos ficaram no `scratchpad` desta sessão e **não
entram no repositório**: o painel em repouso mostra o serial de fábrica e o
diário do daemon com o endereço do controle dela.

Na 08 o «antes» foi fotografado sobre uma cópia de `53cfd578`
(`git archive 53cfd578 src docs mockup` num diretório temporário), e as duas
fotos abrem a linha do P1 com uma folha de estilo de medição: o rótulo que a
abre carrega `data-gesto="alvo"`, e clicá-lo mandaria `controller.target.set` ao
daemon dela; o `checked` no rádio não segura, porque o tique o repõe. Na foto do
«antes», depois da espera, a frase «O controle não chegou a cair do rádio…» está
ao lado do botão; na do «depois» não há nada ali, e durante a espera as duas
mostram «▲ Aperte PS no controle · procurando… 58s» e «Cancelar».

---

## O que NÃO verifiquei

* **Nada no aparelho.** `bancada: false`, e «A luz não acende» derruba o rádio
  de verdade: o `Disconnect`, a sonda e o próprio daemon foram dublês. A prova
  no rádio fica para a MESA-DE-QUATRO-01. A célula do mapa que cita essa cura é
  `luz.lightbar.cor@dualsense` (lado rádio); nenhum degrau da escada foi
  alcançado por mim.
* **Os segundos cliques só com dublê.** Contra o real, só os primeiros: o do
  «Aplicar aos jogos» e o do Proton só armaram; o dos consertos leu o
  `localconfig.vdf`; o das camadas fez o censo (leitura).
* **O desfecho "não voltou" pelo piloto.** No piloto medi o desfecho em que o
  controle nunca caiu; o outro só na régua.
* **Esta sprint costurada com a TELA-CALADA-01.** Não medi as duas juntas. O que
  sustenta a costura é de forma: nenhum destes gestos devolve mais `recado`, e
  nenhum arquivo delas se cruza.
* **A largura do painel na janela dela.** Os 838 px são da moldura 1180×777 no
  Xvfb. Numa janela mais estreita a quebra em 120 pode não caber.
* **O olho dela** (PROVA-DE-TELA-01).
* **O canário de gravação.** Os perfis dela mudaram durante a sessão
  (`future_knight.json`, `pro_jank_footy.json`, 03:39:06–03:41:21 em
  `profile_salvo` do `interface.log`) — fora das janelas dos meus roteiros
  (03:36:58–03:38:01 e 03:53:46–03:54:51), e nenhum log meu tem `profile_salvo`.
  Na segunda janela, o `diff` contra a cópia de antes deu vazio.

---

## O que sobrou para o próximo

* **A pergunta envelhece quando o consentimento vence.** Aos 20 s o botão volta
  ao rótulo do desenho e o painel continua dizendo "Clique de novo para
  confirmar" até o próximo clique — e o mesmo acontece se ela armar OUTRO
  destrutivo. Não é deste enunciado (ele pediu limpar no ramo confirmado). A
  cura seria o tique apagar a pergunta quando `_armado_agora()` deixa de ser o
  gesto dela; o preço é o censo das camadas sumir junto aos 20 s.
* **O painel em repouso publica o endereço completo do controle.** O
  `systemctl status` emenda o diário do daemon, com `uniq=` inteiro, e o funil do
  piloto acusa `[texto banido] 'uniq'` a cada abertura da 09. Anterior a esta
  sprint; o dono é `_repouso_do_painel` e o diário do daemon.
* **`cobertura.pintados` do ramo de erro diz 0** com seis endereços emitidos —
  já dizia com três. Instrumento que não conta o que o ramo pinta.
* **O ramo feliz só emite o exame quando a camada devolve `exame`.** Se um dia
  ela vier sem, o desenho volta à lista. Não medido.
* **Cinco citações `arquivo:linha` de fora da minha posse andaram junto com as
  linhas que acrescentei.** O portão `citacoes-no-codigo` só reprova âncora em
  linha VAZIA, e as cinco caem em linha com texto — passam. Medidas pelo texto
  da linha citada em `53cfd578`:

  | quem cita | cita | o que a linha era | onde está hoje |
  | --- | --- | --- | --- |
  | `interface/hefesto_vivo.py:1597` | `a08_conexoes.py:1340` | `#: a palavra é secao_exame.PREFIXO_DA_CURA …` | 1341 |
  | `pacotes/a02_controles.py:1932` | `a08_conexoes.py:83` | `#: seria o mesmo desperdício que a regra acima proíbe.` | 84 |
  | `pacotes/__init__.py:1065` | `a08_conexoes.py:2498` | uma linha só com `#` | âncora fraca já na base |
  | `interface/aba09.py:1129` | `a09_sistema.py:172` | uma linha só com `#:` | âncora fraca já na base |
  | `app/actions/home_actions.py:241` | `a09_sistema.py:1697` | `return None` | âncora fraca já na base |

  Reapontar é por símbolo e é de quem tem a posse. A do meu arquivo
  (`a09_sistema.py:1537` → `a08_conexoes.py:1774`, o `def _bancada`) eu
  reapontei — era a que o portão pegou, na primeira corrida.
* **O `scratchpad` é compartilhado entre os agentes deste lote**: o script das
  minhas mordidas foi sobrescrito pelo da TELA-CALADA-01 no meio da sessão (já
  tinha rodado; a cura foi conferida por md5). Nomes únicos por sprint, ou uma
  pasta por agente.
