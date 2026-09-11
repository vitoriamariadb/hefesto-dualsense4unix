# LANCADOR-LOCALIZAR-01 — o «Consertar» sai do cartão que já foi localizado

**Branch:** `voo/LANCADOR-LOCALIZAR-01-opus` · nasceu de `dev` em `315d912b`.

A palavra dela, de 09/09/2026, é o enunciado inteiro:

> *"na real não faz sentido. Digo se tenho tudo instalado e tá pra ser  <!-- noqa-acento: citação literal dela -->
> identificado não tem pq ter o botão de consertar. Ou no Máximo Localizar o  <!-- noqa-acento: citação literal dela -->
> lançador. aí eu mesmo abro a tela e procuro o .desktop."*  <!-- noqa-acento: citação literal dela -->

E a decisão dela sobre o COMO: a opção **(C)** — campo de texto **mais** botão
que abre o seletor do sistema.

---

## O que mudou

### 1. O «Consertar» saiu do cartão LOCALIZADO — o vaso, não a cura

`desenho_dos_lancadores.cartao_sem_censo` perdeu o ramo do `consertar`, e com
ele foram embora, em `a07_lancadores`, o gesto `consertar_lancador`, as quatro
funções que o serviam (`_armado_da_cura`, `_qual_cartao`,
`_com_a_confirmacao_da_cura`, `_o_cartao`) e o bloco `PROVISÓRIO` de dois
cliques. As constantes `CONSERTAR_LANCADOR` / `CONSERTAR_LANCADOR_ROTULO`
saíram do desenho e do `__all__`.

**A leitura dela é a leitura certa do cartão como ele estava pintado:** selo
`LOCALIZADO`, moldura `chega` — a MESMA do `ok`/CHEGAM da Steam — e a frase do
corpo terminando em *"um jogo aberto por aqui entra pelo mesmo caminho de
qualquer outro"*. Nada declarava defeito, e embaixo disso o produto oferecia
*consertar*.

**O contraste que prova que não se tirou o certo:** no cartão da Steam o mesmo
verbo tem antecedente — selo `NÃO CHEGAM`, moldura `impede`, e a frase logo
acima nomeando o jogo que perdeu o atalho. Ali o «Consertar» continua, intacto.

`DoDisco.estradas` saiu junto: ele existia só para decidir esse botão, e com ele
`medir_no_disco` deixou de abrir o `config.json` do Heroic e as caixas do
Flatpak a cada volta da vigia. `desenho_dos_lancadores` passou a importar DOIS
módulos de `integrations/`, não três — o número foi corrigido no topo do
arquivo, não guardado ao lado do certo.

### 2. O «Localizar este Lançador» passou a valer nos SEIS cartões achados

Não é botão novo: é o `acao_de_localizar(chave)` que o estado `off` já usava. O
que mudou é o ESTADO em que ele aparece. Ele entrou no ramo `localizado` de
`cartao_sem_censo` **e** nos dois estados bons de `cartao_da_steam`.

**Por que a Steam também**, e não só os cinco da sprint: é a regra de 05/09
desta casa — *quando a cura conhece a causa, ela cobre TODOS os chamadores*.
Deixar o sexto de fora repetiria, em outro estado, o esquecimento de 08/09 (o
botão faltou na Steam por ser LINHA e não função). E é o que a §4.2 pede: o
botão nos seis, em `off` E no estado achado.

**Ordem:** `abrir` · `localizar` · `tirar`. Localizar de novo é ato CORRETIVO, e
ato corretivo não disputa a primeira posição com o ato normal.

**A primeira meia volta (`nao_sei`) NÃO ganhou o botão, de propósito:** a página
publicada nasce de `cartoes(None)`, e um botão ali seria mudança de desenho.
Medido: as duas páginas continuam com **zero** `consertar-lancador` e sem
`adicionar-lancador` novo nos cartões.

### 3. A recusa do botão global perdeu o beco — e parou de confessar dívida nossa

`_recusa_de_quem_ja_tem_cartao` tinha três ramos. O primeiro dizia *"e o Hefesto
não achou onde ele está"* — que viraria mentira no mesmo commit, porque agora o
cartão achado também tem o botão. A oração saiu; o resto vale nos dois estados.

O terceiro dizia:

> *"Se o que ele achou não é o que você quer, me diga — hoje o cartão não tem
> por onde trocar."*

Era o produto contando à usuária um buraco NOSSO, que a decisão dela de 07/09
proíbe. **O buraco fechou de verdade** (o botão existe no cartão achado), e só
por isso a frase pôde sair — apagá-la sem fechar o buraco seria escondê-lo.

O ramo que sobra não cita botão nenhum, e é o que o torna verdadeiro nos três
estados que restam: a primeira meia volta, o cartão da Steam que não conseguiu
ler a biblioteca, e a leitura que levantou.

### 4. O seletor do sistema na caixa de registro — a opção (C) dela

| | |
| --- | --- |
| botão | «Escolher o arquivo…» (`desenho.PROCURAR_O_ARQUIVO_ROTULO`) |
| gesto | `procurar-o-arquivo`, `grava="machine_declare"` |
| onde | ao lado do campo «Onde ele está», na `tela_do_registro_html` |

**NÃO é capacidade nova**: `ponte.escolher_arquivo` é ponto de extensão que o
piloto preenche ao subir, com precedente vivo no «Importar» do rodapé. O pacote
continua puro.

**O campo de texto FICA**, e é ela quem diz por quê: um AppImage solto não tem
`.desktop` para apontar, e é o caso que a frase do cartão promete cobrir.

**A GRAVAÇÃO É UMA SÓ.** `_guardar_onde_ele_esta` nasceu do corpo do
«Adicionar»: as duas portas passam por ela, e o único ponto em que divergem é
`achar` — a função que resolve e que RECUSA. São duas recusas porque quem
digitou errou o comando (*"confira o caminho"*) e quem apontou com o mouse errou
a PASTA:

> *Este arquivo está fora das pastas em que eu procuro, e por isso eu nunca o
> reencontraria: …*

**O rótulo NÃO é «Procurar…», e a razão é medida:** «Procurar de novo» já é o
botão do topo do quadro e quer dizer *varra a máquina outra vez* — a busca
automática, sobre os seis cartões. Este quer dizer *eu te mostro o arquivo*,
sobre um. Duas palavras iguais para dois atos diferentes na mesma tela é a
quebra de "mesma família, mesma coisa" que esta aba já pagou uma vez.

**Uma cura pela metade, e ela é de outra posse:** o gesto manda
`sugestao=<primeira pasta de atalhos>` porque duas das quatro pastas dela ficam
dentro de `~/.local`, que um seletor aberto no `$HOME` com ocultos desligados
não mostra. **O piloto descarta essa sugestão hoje** —
`hefesto_vivo._escolher_arquivo` não a repassa ao `_dialogo` (só o
`_salvar_arquivo` repassa), e `hefesto_vivo.py` não está na minha posse. A
chamada já vai certa; falta UMA linha lá. Está em «o que sobrou».

### 5. `cura_por_estrada` fica, com a dívida DECLARADA

Sem o gesto, oito símbolos públicos do módulo ficaram sem chamador de produção
(`Estrada`, `Plano`, `ambiente_da_ponte`, `escrever_a_estrada`,
`estradas_do_cartao`, `frase_do_feito`, `planejar`, `tem_estrada`). Os oito
entraram em `_SEM_CAMINHO_HOJE`, cada um com onde o caminho se perde e o que o
fecharia.

**A lacuna é REAL e continua aberta:** `assets/hefesto-launch.sh` só age com
`SteamAppId`, e nenhum jogo do Heroic, do Lutris, do RetroArch, do Dolphin ou do
mGBA tem um. Apagar 483 linhas e 26 provas faria a próxima pessoa remedir tudo.
O vaso certo é a CARONA — palavra dela de 16/08 — e quem o constrói é a
**LANCADOR-CARONA-01**.

`"escrever_a_estrada"` saiu de `ESCREVEM`, em
`test_todo_gesto_que_grava_esta_protegido.py`: aquela lista é o vocabulário com
que a DIREÇÃO A acusa, e um nome sem chamador nenhum não acusa nada. No dia em
que a carona chamar a porta, a DIREÇÃO A cobra o `grava=` e a linha volta junto.

---

## Qual mordida prova

Sete réguas, e três delas nasceram aqui. **Cada mordida abaixo foi arrancada,
rodada e devolvida** — a saída de cada uma está em `/tmp/.../mordida*.txt`.

### 1. O par SELO↔BOTÃO — a régua que NÃO EXISTIA (§2.3)

`test_cartao_que_nao_declara_defeito_nao_oferece_conserto`. Um cartão cujo selo
AFIRMA que está tudo no lugar (`ok`, `localizado`) não carrega botão cujo rótulo
comece por «Consertar» — nos quatro estados, nos seis cartões.

*Arranquei a cura* (devolvi o ramo do `consertar` ao estado `localizado`):

```
FAILED …::test_cartao_que_nao_declara_defeito_nao_oferece_conserto
FAILED …::test_o_cartao_localizado_nao_oferece_conserto_e_o_flatpak_muda_de_pergunta
E   heroic em 'achei, e nada falta': selo 'localizado' ('LOCALIZADO', moldura
E   'chega') e o botão «Consertar»
E   lutris em 'achei, e nada falta': …
2 failed, 23 passed
```

**A guarda de vacuidade anda com ela:**
`test_o_consertar_da_steam_continua_onde_ha_o_que_consertar`. Sem ela, apagar o
«Consertar» da Steam INTEIRO deixaria a régua de cima verde — *uma régua que só
sabe proibir não mede nada*.

### 2. O «Localizar» nos SEIS, em `off` E no achado (§4.2)

`test_todo_cartao_tem_botao_nos_tres_estados_e_o_do_ausente_e_outro`, ampliada.

*Arranquei dos cinco* (`acoes=abrir + tirar` no ramo achado):

```
E   o cartão 'heroic' em 'achei aqui' (selo 'localizado') não oferece
E   «Localizar este Lançador» — … a recusa do botão global volta a mandar
E   clicar no vazio
```

*Arranquei do sexto* (tirei a linha de `cartao_da_steam`), que é o ponto cego
que esta aba já pagou uma vez:

```
E   o cartão 'steam' em 'achei aqui' (selo 'ok') não oferece
E   «Localizar este Lançador» — …
```

### 3. A recusa cita um botão QUE ESTÁ LÁ, e nunca confessa

`test_a_recusa_serve_os_tres_estados_do_cartao` (ampliada para cinco fileiras) e
`test_a_recusa_do_registro_nunca_confessa_divida_nossa` (nova).

*Arranquei as duas de uma vez* — a frase voltou a citar um rótulo digitado à mão
e o terceiro ramo voltou a confessar:

```
FAILED …::test_a_recusa_do_botao_global_manda_clicar_num_botao_que_existe
FAILED …::test_a_recusa_serve_os_tres_estados_do_cartao
FAILED …::test_a_recusa_do_registro_nunca_confessa_divida_nossa
E   estado 'não achou': a fileira é ('Localizar este Lançador', 'Tirar daqui')
E   e a recusa cita [], não «Localizar este Lançador»
E   AssertionError: a recusa confessa dívida NOSSA na tela dela:
```

### 4. O seletor, com dublê de `ponte.escolher_arquivo` — os quatro casos da §3.3.1

Quatro réguas novas, uma por caso medido, mais a da declaração:

| régua | o caso |
| --- | --- |
| `test_o_seletor_grava_o_desktop_que_ela_apontou` | `.desktop` numa pasta XDG · cobra o filtro `*.desktop`, a pasta de partida e a agulha gravada |
| `test_o_seletor_recusa_o_desktop_fora_das_pastas_em_que_o_produto_procura` | `.desktop` FORA delas · recusa com frase própria, e **nada gravado** |
| `test_o_seletor_aceita_um_programa_do_path` | um binário · entra pelo campo `comandos` |
| `test_cancelar_o_seletor_nao_e_erro_nem_noticia` | `None` · não é erro nem notícia |
| `test_o_seletor_declara_que_mexe_na_maquina_dela` | `perigosos()` DERIVADO do `grava=` |

**O dublê sabe RECUSAR** — devolve `None` quando o roteiro diz que ela cancelou,
e recolhe `padrao`/`sugestao` para a régua poder cobrá-los.

*Arranquei as três curas* (o seletor gravando sem procurar, o cancelar virando
erro, a confissão de volta):

```
FAILED …::test_o_seletor_grava_o_desktop_que_ela_apontou
FAILED …::test_o_seletor_recusa_o_desktop_fora_das_pastas_em_que_o_produto_procura
FAILED …::test_cancelar_o_seletor_nao_e_erro_nem_noticia
FAILED …::test_o_seletor_aceita_um_programa_do_path
FAILED …::test_a_recusa_do_registro_nunca_confessa_divida_nossa
5 failed, 72 passed
```

Devolvidas: **77 passed**.

### 5. A mordida do portão `casa-sabe`

Com o gesto fora e ANTES da declaração, o portão ficou VERMELHO citando os oito:

```
E  AssertionError: estas promessas públicas não têm chamador em produção e
E  ninguém disse o que elas são:
E      integrations/cura_por_estrada.py::Estrada
E      … (oito)
1 failed, 41 passed in 132.89s
```

Com as oito entradas em `_SEM_CAMINHO_HOJE`: **6 passed** na classe.
*Se ele tivesse ficado verde sem a declaração, a declaração não estaria medindo
nada.*

### 6. A TELA VIVA — foto, e o clique (regra dela de 29/08)

**Tudo `--oculta`.** Nenhuma janela nasceu na tela dela.

**A FOTO DE DEPOIS** (`aba07-DEPOIS.png`, janela oculta, daemon vivo, o produto
lendo o disco dela):

| cartão | selo | os botões |
| --- | --- | --- |
| Steam | **CHEGAM** | Abrir o lançador · Criar perfil para um jogo · **Localizar este Lançador** · Este jogo não funciona |
| Heroic (Epic · GOG) | LOCALIZADO | Abrir o lançador · **Localizar este Lançador** |
| Lutris | LOCALIZADO | Abrir o lançador · **Localizar este Lançador** |
| Flatpak | LOCALIZADO | Abrir o lançador · **Localizar este Lançador** |
| RetroArch | LOCALIZADO | Abrir o lançador · **Localizar este Lançador** |
| Dolphin · mGBA | LOCALIZADO | Abrir o lançador · **Localizar este Lançador** |

**Nenhum «Consertar» em cartão nenhum** — e na Steam dela não há, hoje, porque
não há o que consertar (0 jogos pendentes, selo CHEGAM). O ramo dele está
intacto no código e provado pela guarda de vacuidade acima.

**A FOTO DA CAIXA DE REGISTRO**, na bancada (Chrome headless, `#novo-lancador`):
a linha «Onde ele está» tem o campo (467 px) e o «Escolher o arquivo…» (147 px)
lado a lado, mesma altura de 34 px, `text-decoration: none`. Na página
PUBLICADA a mesma medição responde `BOTAO AUSENTE` — é a metade que espera o
`--publicar 07` dela.

**O CLIQUE, no motor de verdade** (`hefesto_vivo --oculta --prova-clique
"adicionar-lancador" --incluir-perigosos`):

```
[gesto] 07-lancadores.html · adicionar-lancador → aplicado, e a resposta foi
para a tela
gestos: 1 · aplicados: 1 · sem dono: 0
```

`md5sum` do `maquina.json` dela ANTES e DEPOIS: **idêntico**
(`f1b966d7…`). O `--incluir-perigosos` foi conferido antes de ser usado: sem
`forma` (e o botão global não tem `data-hef-forma`), `adicionar_lancador` só
aponta a tela e repinta — não há caminho de escrita.

**O CLIQUE DO BOTÃO DO CARTÃO**, contra a leitura VIVA do disco dela:

```
CLICANDO «Localizar este Lançador» do cartão 'heroic' (data-v='heroic')
antes do clique : Um lançador ou emulador que você usa
depois do clique: Heroic (Epic · GOG) — onde ele está nesta máquina
gravou?         : NADA — a primeira metade só aponta
«Consertar» vivo: False
```

E a recusa do botão global, com os rótulos LIDOS da máquina dela:

> Heroic (Epic · GOG) já tem cartão nesta aba, e é por ele que se aponta onde
> este lançador está. Use o «Localizar este Lançador» do cartão de Heroic
> (Epic · GOG) — …

### 7. Os portões — 54 de 56, e os DOIS vermelhos são do `dev`

`bash scripts/portoes.sh` (saída em `/tmp/portoes-LANCADOR-LOCALIZAR-01.txt`):

```
REPROVOU: 2 vermelho(s) de 56 -> mac-por-oui mac-de-fixture
```

**OS DOIS NÃO SÃO MEUS, e a prova é de uma linha.** Os dois acusam o MESMO
arquivo, e só ele:

```
tests/unit/test_o_no_do_radio_conta_como_placa.py:26: MAC real sem máscara (a0fa9c:xx:xx:xx)
tests/unit/test_o_no_do_radio_conta_como_placa.py:28: MAC real sem máscara (d42f4b:xx:xx:xx)
```

Ele **não está na minha posse** e **não foi tocado por mim**:

```
$ git diff dev --stat -- tests/unit/test_o_no_do_radio_conta_como_placa.py
(vazio — idêntico ao dev de agora)
$ git log --oneline -1 -- tests/unit/test_o_no_do_radio_conta_como_placa.py
315d912b fix(som): o nó que esta casa publica CONTA como placa
```

`315d912b` é a ponta de `dev` de onde esta árvore nasceu hoje. **O `dev` está
vermelho nesses dois portões agora**, e o `pre-push` do anonimato barra.

**A FORMA DO DEFEITO:** as duas constantes traziam o **OUI real do fabricante**
de cada um dos controles dela na frente, com um sufixo inventado atrás — o
oposto do que a convenção da casa pede.

Não as escrevi: o arquivo é de outra posse, e a regra desta casa é relatar, não
editar. **Quem costurar esta leva tem de resolver isto antes de empurrar.**

> **FECHOU EM 10/09/2026, e NÃO pela cura que este relato propunha** — nota
> acrescentada em 11/09 pela leva seguinte desta mesma sprint.
>
> O conserto veio em `f59e4ddf` (*"os endereços das réguas saem da faixa real,
> e as onze citações reapontam"*), já dentro de `onda/0911`. Aqui estava
> proposta uma cura de duas linhas que **mantinha o OUI real** e zerava os
> octetos 4 e 5; o que a casa fez foi outra coisa, e melhor: **os dois
> endereços saíram inteiros para a faixa sintética** (`02fe00…`, `aabbcc…`),
> que é a convenção escrita. Um OUI de fabricante mascarado continua sendo o
> fabricante dela na frente do endereço.
>
> **A proposta velha saiu daqui em vez de ficar ao lado da certa** — regra
> desta casa: *fato errado se substitui, e sai de todos os lugares onde
> aparece*; mantê-lo obrigaria a próxima pessoa a escolher entre duas
> respostas. Saíram junto os dois valores literais que ele citava: eles eram
> o OUI real com sufixo à mostra, e **`mac-por-oui` reprovava este arquivo por
> causa deles** — o relato virou a segunda cópia do defeito que denunciava.

---

## O que NÃO verifiquei

* **A mesa de QUATRO.** A §4.4 pede a foto com dois no cabo e dois no rádio.
  Havia **UM** DualSense na mesa no instante da medição (`1 controle: 1 USB ·
  0 BT`), e a bancada estava LIVRE — eu não a reservei porque a sprint diz
  `bancada: false` e nada aqui para o daemon, escreve no aparelho ou chama
  `systemctl`. **O que a foto mediria com quatro é o mesmo**, e a própria sprint
  diz por quê: qual botão o cartão mostra não depende de transporte — ele sai de
  leitura de DISCO. Não afirmo o que não vi: a foto com os quatro, se alguém a
  quiser, é da MESA-DE-QUATRO-01.
* **O «Escolher o arquivo…» clicado no motor.** Ele só existe na BANCADA até ela
  publicar, e o piloto abre a página PUBLICADA. Além disso, com `--oculta` não
  há diálogo por construção (`_dialogo` devolve `None` para não jogar um modal
  na tela dela) — a sprint já previa isto, e é por isso que o gesto declara
  `grava=` e é mordido por dublê, como o «Importar» do rodapé.
* **O seletor abrindo na pasta certa.** Provei que o gesto MANDA `sugestao`; não
  provei o diálogo do sistema abrindo lá, porque o piloto descarta o argumento
  hoje (ver abaixo) e o arquivo é de outra posse.
* **A suíte inteira.** Rodei o meu escopo — `test_a_aba_lancadores_diz_a_verdade`
  (77), `test_a_cura_por_estrada_e_a_caixa_do_flatpak` (24),
  `test_todo_gesto_que_grava_esta_protegido` (17),
  `portao_a_casa_sabe_e_o_produto_nao_faz` (42) — e os portões. A suíte é de
  quem coordena, e roda no fim.
* **O `--publicar 07`.** Não rodei, e não é meu: é ato dela.

---

## O que sobrou para o próximo

1. **O OLHO DELA NA BANCADA, e depois o `--publicar 07`.** A caixa com o
   «Escolher o arquivo…» está em `mockup/07-lancadores.html` e declarada em
   `mockup/DIVERGENCIAS.md`. Enquanto ela não publicar, a caixa na tela dela
   tem os dois campos e mais nada — o gesto `procurar-o-arquivo` fica sem clique
   que o alcance, e nada mais da sprint depende disso.

2. **UMA LINHA EM `hefesto_vivo.py`, e ela não é da minha posse.**
   `_escolher_arquivo` não repassa `sugestao` ao `_dialogo`:

   ```python
   def _escolher_arquivo(self, titulo, padrao="*", **_):
       return self._dialogo(titulo, Gtk.FileChooserAction.OPEN, "Abrir",
                            padrao=padrao)          # ← falta `sugestao=`
   ```

   Sem ela o seletor abre no `$HOME`, e **duas das quatro pastas de atalho dela
   ficam dentro de `~/.local`** — que um seletor com ocultos desligados não
   mostra. O gesto já manda o argumento; só falta quem o receba. `_salvar_arquivo`
   já faz o repasse, ao lado.

3. **`docs/data/paridade-gtk-html.csv`, aba `07-lancadores`** — a §3.5 manda a
   dívida da cura por estrada para o mapa, e o arquivo **não está na minha
   posse**. Ela está declarada onde EU podia declarar (`_SEM_CAMINHO_HOJE`, com
   os oito símbolos, o ponto em que o caminho se perde e a sprint que o desfaz).
   Quem tiver o mapa na posse copia de lá.

4. **A LANCADOR-CARONA-01.** É a sprint que esta nomeia e da qual ela depende:
   pôr a cura por estrada na CARONA (`perfil.com_a_carona`, que o «Aplicar» e o
   «Salvar» já chamam) em vez de num botão — palavra dela de 16/08. Mexe em
   `perfil.py` e no rodapé, que são outra posse, e a cura escreve em arquivo de
   OUTRO programa: **merece a palavra dela sobre "sem botão, no Salvar" antes de
   qualquer linha.** Quando ela fechar, o portão `casa-sabe` cobra que as oito
   entradas de `_SEM_CAMINHO_HOJE` sejam APAGADAS.

5. **O rótulo «Escolher o arquivo…» é texto de tela, e texto de tela é dela.**
   Escolhi-o medindo o conflito com «Procurar de novo», e está escrito no
   `desenho_dos_lancadores` que trocá-lo é UMA linha — o gesto, a recusa e a
   régua não dependem do rótulo.

6. **A §3.7 continua de fora**, como a sprint manda: *"a ideia é cada um dos  <!-- noqa-acento: citação literal dela -->
   lançadores passarem a ter os jogos com perfis dentro da aba perfis"* é a  <!-- noqa-acento: citação literal dela -->
   JOGOS-DOS-LANCADORES-01, de outro agente desta mesma leva.
