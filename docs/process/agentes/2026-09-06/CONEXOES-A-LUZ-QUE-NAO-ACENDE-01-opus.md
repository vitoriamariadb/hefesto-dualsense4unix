# CONEXOES-A-LUZ-QUE-NAO-ACENDE-01 · A espera pelo PS, o Cancelar, a conta de slots — e o botão que nascia cinza

**Sprint:** `docs/process/sprints/2026-09-06-CONEXOES-A-LUZ-QUE-NAO-ACENDE-01-a-espera-pelo-ps-o-cancelar-e-a-conta-de-slots.md`
**Árvore:** `hefesto-voo/CONEXOES-A-LUZ-QUE-NAO-ACENDE-01-opus` · branch
`voo/CONEXOES-A-LUZ-QUE-NAO-ACENDE-01-opus`, de `onda/atual-0609` (`ae1c3d82`, conferido
contra `git rev-parse --short onda/atual-0609`).
**Posse:** `interface/pacotes/a08_conexoes.py` · `interface/aba08.py` ·
`mockup/08-conexoes.html` · `tests/unit/test_a_conexoes_espera_o_ps_e_conta_os_slots.py`.

**Bancada:** LIVRE o tempo todo, e **não a reservei porque não precisei dela** —
`bancada: false` no frontmatter, e nenhuma escrita no aparelho, nenhum `systemctl`,
nenhum `Disconnect` disparado, o serviço nunca tocado. **E ele estava PARADO:**
`systemctl --user is-active hefesto-dualsense4unix.service` → `inactive`. A linha de
prova COM CONTROLE NA MESA fica para a **MESA-DE-QUATRO-01**
(`D-0609-A-BANCADA-PROVA-NAO-BLOQUEIA`) — ver §5.

**Portões:** `bash scripts/portoes.sh` (saída em
`/tmp/portoes-CONEXOES-A-LUZ-QUE-NAO-ACENDE-01.txt`) → **43 verdes de 45**, e os dois vermelhos são
`paridade-gtk-html` e `donos-de-comportamento`, os DOIS com o CSV em `docs/data/`, que é
o meu `nao_toca:`. **Os dois já estavam vermelhos no commit de partida** (medido antes de
eu tocar em nada: `paridade-gtk-html` com 2 achados e `donos-de-comportamento` com 1). O
que mudou é que os meus DOIS achados entraram no primeiro — e eles são a régua acusando
que **a dívida FECHOU**, que é o caso BOM da regra 6 dela. O texto pronto das duas linhas
está na §6.

**Testes do escopo:** o arquivo novo fecha **23**, e os três últimos abrem a bancada num
WebKit com o `hefesto_vivo.BOOTSTRAP` de verdade. Rodei também os **47 arquivos** que
citam `a08_conexoes`, `aba08` ou `08-conexoes`: **721 verdes, 7 pulados, 2 vermelhos**, e
os dois vermelhos são de fora do meu diff — §7. **Não rodei a suíte inteira**: é de quem
coordena.

---

## O que mudou

### 1 · A espera pelo PS — a promessa do `title`, cumprida

**O DEFEITO, e o desenho o denunciava sozinho.** O `title` do botão diz, desde que
nasceu: *"Enquanto ele espera o PS, o mesmo botão vira 'Cancelar'"*. O gesto
`luz-nao-acende` derrubava o controle e voltava. Sem contagem, sem Cancelar, sem recado.
Ela clicava, o controle caía, e a tela não dizia uma palavra sobre o que fazer nem por
quanto tempo esperar.

**NADA DE MÁQUINA NOVA FOI ESCRITO.** Quem sabe esperar é
`app/actions/config/secao_controles.EsperaPeloPS` — o dono na janela estável, com os DOIS
marcos (ver o controle SUMIR, e só depois vê-lo voltar), os quatro desfechos e as frases
do fim. Ele foi escrito **sem GTK, sem IPC e sem relógio** de propósito (*"quem chama dá
o tique"*), e é por isso que a interface nova o reusou inteiro em vez de reescrever a
espera. As sete frases da tela são as dele, uma a uma.

O que este pacote acrescentou é o **relógio** e os **dois endereços**:

| onde | o quê |
| --- | --- |
| `a08_conexoes.py:2519` | `_EsperaNaTela` — o dono da espera mais o recado do fim |
| `a08_conexoes.py:2558-2620` | `comecar_a_espera` · `cancelar_a_espera` · `esperando` · `_correr_as_esperas` |
| `a08_conexoes.py:2622` | `texto_do_botao_da_luz` — `"A luz não acende"` / `"Cancelar"` |
| `a08_conexoes.py:2643` | `linha_da_espera` — o pedido do PS com a contagem, e o recado |
| `a08_conexoes.py:5279` | o gesto: o segundo clique CANCELA; o `Disconnect` que derruba LIGA o relógio |
| `aba08.py:2261` | `data-campo="luz-texto"` num `<span>` DENTRO do botão |
| `aba08.py:2290` | `monta.ressalva("luz-espera")` na ponta direita da linha, numa caixa `.gc-luz` |

**A ARMADILHA DESTA CURA É O RELÓGIO, e ela tem régua própria.** O tique do piloto é de
**100 ms** (`hefesto_vivo.TIQUE_MS`) e a espera do dono é de **60 SEGUNDOS**. Um `tique()`
por pintura faria os 60 s virarem 6 — a tela diria *"não voltou"* com 54 segundos
sobrando na mão dela. Por isso o avanço é medido em tempo **monotônico**, e o
`EsperaPeloPS` recebe um `tique()` por segundo inteiro decorrido, nem mais nem menos. O
relógio é monotônico pela mesma razão do canal de recado: um acerto de hora do sistema no
meio da espera não pode fazer a contagem pular nem voltar.

**O CANCELAR VEM ANTES DA GUARDA DO TRANSPORTE, e isso não é ordem à toa.** Durante a
espera o controle está FORA do rádio: `ctx.por_uniq` não o encontra, o transporte chega
vazio, e a guarda do cabo recusaria o **próprio Cancelar** com a frase errada. O caso
`test_o_segundo_clique_cancela_sem_falar_com_o_radio` monta exatamente essa cena
(`conectados=[]`) e mede que o Cancelar **não fala com o BlueZ** — não existe reconexão
neste produto, o botão PS é dela.

**O RECADO SOBREVIVE À ESPERA E MORRE QUANDO DEIXA DE SER VERDADE.** Sobreviver é do dono
(*"sem ele 'não voltou' viraria silêncio"* — ELO-MUDO-01). Morrer é meu, e é medido:
`"Não voltou em 60s"` é verdade no instante em que é escrita e vira mentira assim que o
controle reaparece na lista do serviço. `_correr_as_esperas` recebe os `uniq` presentes e
apaga só esse recado; o `nao_caiu` continua verdadeiro e fica até o próximo clique.

### 2 · A conta de slots por adaptador — o que CABE, que a barra não diz

A régua de Desempenho mostra **o que ESTÁ** em cada adaptador. A conta de slots responde
**o que CABE** — e isso não se lê de uma fatia: olhar 260,4 em 1.600 não diz se o PRÓXIMO
controle entra, que é a pergunta de quem tem um controle no cabo e quer trazê-lo.

`a08_conexoes._conta_de_slots` (`:2929`) lê `integrations/plano_de_radio` e **não redige
uma palavra**: `linha_do_declarado_que_nao_subiu` primeiro (o que está errado AGORA vem
antes do que se pode planejar — a ordem é do dono), depois `linha_do_cabe_mais_um`. Os
dois estados que não são conta vêm de `secao_orcamento`: `SEM_RESPOSTA_DO_DAEMON` e
`NINGUEM_NO_RADIO`. **A cicatriz da B1 é a razão de os dois existirem:** com o Hefesto
parado, as três barras diziam *"Folgada"*, em verde, *"0/1600"* — byte a byte a tela de um
rádio vazio. Não saber e estar vazio são coisas diferentes, e a diferença é a informação
inteira.

**DUAS COISAS FICARAM DE FORA, e as duas por medição:**

* **`linha_do_plano`** — ele diz quem está em qual adaptador e quanto custa, que é
  exatamente o que a régua logo acima desenha, com a cor do plástico de cada um.
  Repeti-lo em texto seria a segunda grafia do mesmo fato na MESMA seção.
* **o segundo `state_full`** — a janela estável faz um `call_async` próprio, e o dono
  declara isso como dívida (*"este é o SEGUNDO `state_full` por entrada na aba"*). Aqui o
  `ctx.state` do tique já é o `state_full`: a dívida do dono **não atravessou**.

### 3 · O TERCEIRO DEFEITO — o botão que nascia cinza, e não era da sprint

**MEDIDO NO DOM, com um controle no RÁDIO no lugar do P1** (o `medir_apagado.py` do
scratchpad, Chrome headless, `BOOTSTRAP` do piloto):

```
antes:  {"classe_do_botao": "btn apagado", "classe_da_trava": "ltrava",
         "opacidade": "0.55", "cursor": "help"}
depois: {"classe_do_botao": "btn",         "classe_da_trava": "ltrava",
         "opacidade": "1",    "cursor": "pointer"}
```

O `luz-trava` chegava **certo** — o `<i>` ficava `ltrava`, sem o `on`. O que não chegava
era o botão: ele carregava `class="btn apagado"` **do mockup**, e o pintor não tem como
apagá-la porque o `data-campo` do botão está gasto no `title`. **Quem herdasse o lugar do
P1 pelo rádio veria um botão com cara de desligado para sempre — e o "Cancelar" desta
sprint nasceria cinza.**

É a metade que faltava da cura de 03/09, e ela estava escrita: *"a classe `apagado`
continua nascendo do transporte da CENA … e o `data-campo="luz-trava"` é o que deixa o
produto reescrevê-la"*. O `~` **ACRESCENTA** a aparência de desligado; ele não REMOVE a
classe literal.

**A cura tirou a classe do botão, e não move um pixel do desenho:**
`.gc-corpo .ltrava.on ~ .btn` tem as MESMAS quatro declarações de `.btn.apagado`, e o
`<i class="ltrava on">` já está no HTML estático da linha do cabo. **Medido:** a foto da
janela inteira saiu **byte a byte idêntica** (`md5 7cf09d27…`) antes e depois de toda esta
leva. O que muda é que a aparência passou a ter **um dono só**, e ele é dado.

**Por que eu mexi nisso, sendo outra linha do CSV:** o arquivo é da minha posse, o botão é
o mesmo, e a minha própria entrega renderizava errada sem a cura. Está declarado aqui para
o coordenador poder desfazê-lo em uma linha se preferir separá-lo.

### 4 · A decisão por delegação

`docs/data/decisoes-dela.csv` ganhou **uma linha**, no fim:
`D-0609-A-ESPERA-PELO-PS-DIZ-AS-DUAS-FALAS-DO-DONO`, `quem_decidiu=delegacao`,
reversível numa frase.

A sprint mandava decidir *"o que a tela diz durante a espera"*, com a proposta
*"Aperte PS no controle · Ns"*. **Escolhi as DUAS falas do dono, juntas numa linha só:**

```
▲ Aperte PS no controle · procurando…  38s        [Cancelar]
```

A proposta da sprint teria sido uma **quarta redação do mesmo pedido** — a janela GTK já
diz duas coisas (`FRASE_APERTE_PS` num rótulo, `frase_da_procura` noutro, empilhados), e
inventar uma terceira no HTML é a grafia que ninguém revisa. O cartão do HTML é uma linha
só, então o que a interface escolhe é a **ORDEM e o separador** — o pedido primeiro, o
relógio depois. É a mesma junção que `dica_da_luz` já fazia neste arquivo.

**O `docs/data/` está no meu `nao_toca:`** e a regra 5 da sprint manda registrar ali. Fiz
o registro por ser instrução explícita da sprint e por ser um **append no fim** — a forma
de menor colisão. Se o coordenador preferir, a linha sai sozinha (`git show` do commit).

---

## Qual mordida prova

`tests/unit/test_a_conexoes_espera_o_ps_e_conta_os_slots.py` — **23 casos, 23 verdes.**

**SEIS MORDIDAS, uma a uma, com a saída de cada reprovação:**

| # | o que arranquei | o que reprovou |
| --- | --- | --- |
| 1 | o avanço por tempo virou `passou = 1` (um tique por pintura) | **5 casos**, e o primeiro nomeia o defeito: *"dez pinturas num segundo comeram 10 segundos da espera dela"* |
| 2 | comentei `comecar_a_espera(uniq)` no fim do gesto | **3 casos**: *"o controle caiu e a tela NÃO entrou na espera"* |
| 3 | comentei o ramo `if cancelar_a_espera(uniq): return` | **1 caso**: o Cancelar falou com o BlueZ |
| 4 | tirei o ramo `if not st: SEM_RESPOSTA_DO_DAEMON` | **1 caso**: *"rádio vazio e serviço mudo não podem dizer a mesma coisa"* |
| 5 | tirei `data-campo="luz-texto"` da página (2 lugares) | **3 casos**, e dois deles são os do WebKit |
| 6 | `linha_da_espera` devolvendo `""` em vez de `_sem_valor()` | **2 casos**: a ressalva vazia ocuparia altura para dizer nada |

```
# MORDIDA 1
FAILED ...::test_o_relogio_conta_segundos_e_nao_tiques
FAILED ...::test_a_espera_termina_no_tempo_do_dono
FAILED ...::test_o_recado_de_nao_voltou_sobrevive_a_espera
FAILED ...::test_o_recado_morre_quando_o_controle_volta
FAILED ...::test_o_que_nao_caiu_do_radio_diz_a_frase_do_dono
5 failed, 15 passed
# A CURA DE VOLTA
23 passed
```

### A PROVA DE TELA — a foto, o clique e o motor de verdade

**O CLIQUE NÃO FOI NO MOUSE DELA, e o motor não foi imitado.** Os dois últimos casos
abrem a **bancada** (`mockup/08-conexoes.html`) num `WebKit2.WebView` dentro de uma
`Gtk.OffscreenWindow`, injetam o **`hefesto_vivo.BOOTSTRAP` de verdade** (lido do módulo,
nunca copiado) e chamam `window.__hef.pintar` com a carga que
`a08_conexoes.pacote` + `pacotes.normalizar` produzem — a MESMA sequência do piloto.
Depois LEEM o DOM. Molde: `test_a_aba01_veste_o_controle_de_ponta_a_ponta.py`.

Medido no WebKit, e é o elo que não tinha régua nenhuma dos dois lados:

```
repouso: rotulo="A luz não acende"  linha=""                                  display=none
espera:  rotulo="Cancelar"          linha="▲ Aperte PS no controle · procurando…  38s"  display=block
cabo:    opacidade < 1                    (a regra dela: só acionável no rádio)
```

**AS FOTOS**, as três headless (`--oculta` por construção: Chrome sem cabeça e
`Gtk.OffscreenWindow` — **nenhuma janela nasceu na tela dela**):

| foto | o que mostra |
| --- | --- |
| `CONEXOES-A-LUZ-QUE-NAO-ACENDE-01-antes-a-linha-do-controle.png` | o controle no RÁDIO e o botão **cinza** — o defeito da §3 |
| `CONEXOES-A-LUZ-QUE-NAO-ACENDE-01-depois-o-repouso.png` | o mesmo, com o botão aceso e clicável; nenhuma linha nova |
| `CONEXOES-A-LUZ-QUE-NAO-ACENDE-01-depois-a-espera-pelo-ps.png` | `▲ Aperte PS no controle · procurando…  38s` e o **Cancelar** |

**E A GEOMETRIA NÃO ANDOU:** `larg 1180 · alt 777 · passa_da_dobra 0 ·
rolagem_lateral false`, e a foto da janela inteira é **byte a byte idêntica** à de antes
da leva (`md5sum` igual nas duas). A `.ressalva` em repouso mede ZERO — que é a decisão
dela (D-02, *"linha fixa só quando HÁ ressalva"*) — e a linha da espera não estoura a
largura do cartão.

---

## O que NÃO verifiquei

1. **NÃO EXERCITEI O GESTO NO APARELHO.** Nenhum `Disconnect` real foi disparado, e não
   podia ser: o serviço estava `inactive` e a prova pediria a bancada. **Tudo o que está
   medido acima é dublê** — a sonda do `EsperaPeloPS` é injetada, e o
   `gesto_de_reconexao.desconectar` é `monkeypatch`. A linha que falta é
   *"a pessoa clica, o controle cai de verdade, ela aperta PS e a barra volta a
   obedecer"*, e ela é da **MESA-DE-QUATRO-01**.
2. **NÃO MEDI a célula `luz.lightbar.cor` do mapa.** Ela diz
   `radio_ate_onde_foi = O APARELHO OBEDECEU`, medida em 16/08; **eu não a remedi e não a
   contradigo**. O que esta sprint entrega é a TELA do gesto, não o canal.
3. **NÃO ABRI O PILOTO COM O DAEMON VIVO.** O `hefesto_vivo.py --oculta` só mostraria a
   aba sem controle nenhum (serviço parado), e ligar o serviço é `systemctl` — bancada.
   O WebKit dos dois últimos casos roda o MESMO motor e o MESMO `BOOTSTRAP`; o que ele
   não prova é a janela abrindo e o tique real de 100 ms rodando por minutos.
4. **NÃO MEDI a conta de slots contra adaptadores REAIS.** Os três estados foram provados
   com `plano_por_adaptador` dublado; a bancada tem três adaptadores (medidos em 04/09
   por outra frente) e a conta com eles é da MESA-DE-QUATRO-01.
5. **NÃO RODEI a suíte inteira** nem os oito lotes — é de quem coordena, e ela toca nós
   `uinput` de verdade.
6. **NÃO PUBLIQUEI.** `interface/paginas/08-conexoes.html` **não está na minha posse** e
   publicar é ato dela (`scripts/check_o_desenho_aprovado.py --publicar 08`). A bancada
   já estava à frente do publicado antes de eu chegar. **Enquanto não publicar, os três
   endereços novos não existem na página que o produto instalado renderiza** — ver §5.
7. **NÃO CONFERI o comportamento com DOIS controles esperando ao mesmo tempo em cartões
   diferentes.** O depósito é por `uniq` e o desenho suporta, mas não há caso que o meça.

---

## O que sobrou para o próximo

### 5 · As três coisas que dependem de outra pessoa

1. **A PROVA NO APARELHO — `MESA-DE-QUATRO-01`.** Com um DualSense no rádio: clicar "A
   luz não acende", ver o botão virar Cancelar, a contagem correr, apertar PS e a linha
   sumir sozinha; e deixar a espera vencer para ler *"Não voltou em 60s. Ele continua
   pareado…"*. É a única metade que dublê nenhum alcança.
2. **PUBLICAR a 08** quando ela aprovar o desenho. Sem isso os três endereços novos
   (`luz-texto`, `luz-espera`, `conta-de-slots`) vivem só na bancada.
3. **O CSV DA PARIDADE** — §6, e é do coordenador.

### 6 · O TEXTO PRONTO das duas linhas do CSV (o que é do COORDENADOR)

**Linha 296 — o `sinal` novo é código, nunca prosa** (`D-0609-O-SINAL-DA-PARIDADE-NAO-E-PROSA`):

```
veredito     DIFERENTE
sinal        frase_da_procura
sinal_espera PRESENTE
sinal_escopo LADO-HTML
html_onde    src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py:2643 ·
             src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py:2519 ·
             src/hefesto_dualsense4unix/interface/aba08.py:2290
html_faz     A mesma máquina de dois estados, com o MESMO dono (`secao_controles.EsperaPeloPS`,
             reusado inteiro): o clique entra na espera, a linha de ressalva do cartão mostra
             "▲ Aperte PS no controle · procurando…  Ns", o mesmo botão vira "Cancelar", e o
             fim deixa o recado do dono, que sobrevive à espera e é apagado quando o controle
             reaparece. O relógio é monotônico, um `tique()` por segundo — o tique do piloto é
             de 100 ms.
porque       DIFERENTE e não IGUAL por UMA coisa: a GTK ESCONDE os irmãos do card durante a
             espera ("Cor:", "Jogador:"); no HTML o cartão é uma linha de 40 px e a espera
             ocupa a ponta direita dela, ao lado do botão. Nada mais difere.
```

**Linha 330 — e ela pede uma decisão de coluna:**

```
aba          08-conexoes   (RECOMENDADO — a própria linha dizia que "provavelmente é
             território da aba 08"; se o coordenador preferir não mexer na chave
             (aba, feature), deixe 09-sistema e o html_onde já aponta para cá)
veredito     DIFERENTE
sinal        linha_do_cabe_mais_um
sinal_espera PRESENTE
sinal_escopo LADO-HTML
html_onde    src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py:2929 ·
             src/hefesto_dualsense4unix/interface/aba08.py:3652
html_faz     A conta por adaptador na seção Desempenho, lendo `integrations/plano_de_radio`:
             o "cabe mais um controle com microfone no <nome>?" com o "ficaria em N de M", a
             linha do microfone declarado que não subiu, e os dois estados honestos de
             `secao_orcamento` (o serviço mudo e o rádio vazio, que nunca dizem a mesma coisa).
porque       DIFERENTE por DUAS ausências deliberadas, as duas medidas: (1) `linha_do_plano`
             fica de fora porque a régua logo acima já desenha quem está em qual adaptador,
             com a cor do plástico — repeti-la em texto seria a segunda grafia na MESMA seção;
             (2) o segundo `state_full` do dono não atravessou: aqui o `ctx.state` do tique já
             é o `state_full`.
```

**E o achado que o `sinal` de hoje expõe:** a régua acusou a linha 330 porque
`_ContaDeSlots` — o `sinal` atual dela — **aparece num COMENTÁRIO meu** em
`a08_conexoes.py`. Ele é um nome PRIVADO de `app/`, e nenhum código de `interface/` vai
chamá-lo nunca: como sinal ele só pode disparar por citação em prosa. Trocá-lo por
`linha_do_cabe_mais_um` é o que faz aquela linha voltar a medir código.

### 7 · O que rodei, e o que achei rodando

```
tests/unit/test_a_conexoes_espera_o_ps_e_conta_os_slots.py     23 passed
os 47 arquivos que citam a08_conexoes / aba08 / 08-conexoes    721 passed, 7 skipped
bash scripts/portoes.sh                                        43 verdes de 45
```

**A PRIMEIRA VOLTA DOS 47 DEU QUATRO VERMELHOS, e duas eram MINHAS — as duas curadas
sem tocar em teste alheio:**

```
FAILED test_a08_o_veredito_e_a_mesa_de_radio_dela.py::test_o_botao_da_luz_tem_a_dica_e_a_trava_em_nos_diferentes
FAILED test_a_linha_fechada_da_aba08_segue_o_aparelho.py::test_todo_botao_da_luz_tem_a_trava
  → "0 dos 2 botões da luz têm o interruptor colado ANTES deles"
```

**As duas estavam certas, e a lição é de posição.** Eu tinha posto a linha da espera
ENTRE o `<i class="ltrava">` e o `<button>`, e as duas réguas exigem os dois **colados**
(`></i><button`) — com a razão escrita nelas: *"o `~` do CSS só alcança irmãos
POSTERIORES"*. **A cura foi trocar a ordem dentro da caixa** — `ressalva · <i> · <button>`
—, e ela não custa um pixel porque `.ltrava` é `display:none`. **Nenhum teste alheio foi
editado**, que é a regra do §2 do protocolo.

**Os DOIS que sobram não são meus, e nenhum toca o meu diff:**

| vermelho | por que não é meu |
| --- | --- |
| `test_o_dono_do_comportamento_e_um_so::test_o_mapa_de_hoje_passa` | é o portão `donos-de-comportamento`, e ele **já estava vermelho no commit de partida** (medido antes de eu tocar em nada). A queixa é da aba **09** (`migrar_para_systemd`), e o CSV é `docs/data/` — meu `nao_toca:` |
| `test_a_fala_de_tela_alcanca_a_interface_nova::test_o_portao_de_hoje_esta_no_piso_e_diz_qual_e` | **desencontro de MAIÚSCULA entre a régua e o script**, e os dois são de fora do meu diff: o teste exige `"PISO" in ultima` e `scripts/validar-fala-de-tela.py` escreve `"Piso: abas≥0, falas≥1, numeros≥3, raizes≥2."`. A palavra `PISO` em caixa alta só sai do ramo `PISO NÃO APLICADO` (`:1096`), que é o da árvore que **não** é o produto — então a régua passa numa worktree de agente comum e reprova onde a árvore É reconhecida como produto. Nasceu em `9b18651c`. Nem o script nem o teste estão no meu `git diff`, e a única coisa que eu poderia mover naquela linha são os NÚMEROS, nunca a caixa da palavra. **Fica RELATADO** |

### 8 · Três coisas para quem vier depois

1. **`interface/olhar.py` REBENTA com `HEFESTO_BANCADA` apontando para fora da árvore.**
   `pathlib.relative_to` na última linha (`olhar.py:172`) levanta `ValueError` — **depois**
   de gravar o PNG, então a foto existe e o comando sai `rc=1`. Achado ao fotografar o
   estado ANTERIOR a partir de `/tmp`. Não é da minha posse; fica RELATADO.
2. **`aba08.py` tinha uma variável `luz` viva na função da linha do controle** (a cor do
   jogador, que entra no `desenho_do_controle`). Reusei o nome por dez minutos, e o
   gerador saiu `rc=0` cuspindo o bloco HTML inteiro **dentro do atributo CSS**
   `<g id="p1-lightbar" style="--luz:<span class="gc-luz">…`. Só a leitura do HTML gerado
   mostrou. **O gerador não reprova HTML absurdo dentro de um atributo** — ele conta
   `<div>`s e confere frases.
3. **`luz-nao-acende` NÃO está em `pacotes.perigosos()`** (ele não declara `grava=`), então
   uma prova botão a botão do piloto (`--prova-no-aparelho`) **CLICA nele** — e agora o
   clique não só derruba o controle do rádio como liga um relógio de 60 s. Com o serviço
   vivo e um controle no rádio, isso derruba o controle DELA. Ou o gesto ganha um
   `grava=` que o descreva, ou a régua ganha a exceção — e a decisão é de quem for dono
   do `hefesto_vivo.py`, que está fora da minha posse.
