# LEVA-1-F — a janela de calibrar entradas

`CALIBRAR-AS-ENTRADAS-01`, tarefas **CAL-2 a CAL-7**. 26/08/2026.

## O que mudou

**`src/hefesto_dualsense4unix/app/widgets/calibrar_entradas.py`** (novo, 1153
linhas). A cerimônia inteira, e a lógica mora fora do GTK de propósito — dado
que só existe dentro de um widget não se testa sem display.

- **CAL-2 · grava com o daemon morto.** `LogicaDaCalibracao` grava a **cada
  resposta**, direto no disco, por `integrations/lugar_declarado.declarar_a_maquina`
  — que não passa por IPC nenhum. A cerimônia é abandonável, e isso só é honesto
  se nenhuma saída perder trabalho (R28).
  **Correção do que a sprint mandava:** a `CAL-2` dizia para ligar
  `gravar_rascunho_da_mesa`. Aquela primitiva é **escopada à seção `mesa`**, e o
  mapa é chave de TOPO do documento — mandá-lo pela porta estreita gravaria a
  mesa e perderia o mapa **calado**. A porta certa é a larga, e ela já existia
  (`lugar_declarado`, escrito em 25/08 e sem chamador até hoje).
- **CAL-3 · a fase sentada.** Uma pergunta por aparelho **sem lugar**, e o toque
  no HUB coloca o hub e tudo que pende dele — quatro aparelhos, um toque. A
  descida é por `cadeia_de_hubs`, nunca pelo pai: os três adaptadores desta casa
  têm dois pais diferentes e um único hub em comum (medido em 22/08).
- **CAL-4 · a fase em pé.** `caminhada()` lista **só buracos vazios**, e buraco,
  nunca nó — o lado 3.x do furo onde o mouse dela está também diz `not attached`.
  `[Não alcanço]` **tira da conta** em vez de deixar dívida (R22). O veredito sai
  do `sysfs` (`confirmar_entrada_nova`), comparando a leitura de antes com a de
  agora: o pulso na mão é "senti você", nunca "a entrada é boa" (F-1).
- **CAL-5 · a posse do vocabulário.** `PosseDoVocabulario` + `botoes_para_o_jogo`.
  A janela declara posse dos quatro botões enquanto tem foco; a peneira subtrai
  esses botões do que segue para o gamepad virtual. **A metade do daemon NÃO foi
  feita** — ver "o que sobrou".
- **CAL-6 · a marreta.** Uma batida, 0,82 s (1,22 Hz, abaixo do teto de 3 Hz do
  R36), e ela **lê `gtk-enable-animations`** — a chave que existe no GTK 3 e que
  o produto nunca leu (`grep` em `src/` dava zero). Com a animação desligada, a
  notícia chega igual: ela mora no nome acessível, e a marreta é enfeite (R14).
- **CAL-7 · o laudo.** Quatro blocos, sempre nesta ordem, e o quarto — "O que eu
  não meço" — **nunca some**. É ele que impede o exame de virar promessa.
- **R1/R3 · sem teclado, sem mouse e sem olhar.** `NavegacaoPorControle` traduz
  `inputs["buttons"]` do payload vivo em gesto, **só na borda de subida** (a
  10 Hz, segurar o X avançaria cinco entradas que ninguém veria passar). Nenhum
  import novo: o DualSense já é entrada da GUI.
- **`perto` e `alto` ganham fonte.** A face "Frente do gabinete" nasce
  `perto=True`. Até hoje nenhum dos dois tinha escritor, e o motor do arranjo
  publicava juízo com o bônus do teclado nunca podendo disparar.

**`tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py`** — seis lápides novas
para os símbolos públicos do módulo (o botão que abre a janela é da **L2-E**), e
a lápide de `entradas_do_gabinete.py::furo_declarado`, que é posse desta frente,
teve o texto **remedido**: ela dizia "as telas ficaram para a leva seguinte", e
as telas nasceram hoje. Continua de pé porque o portão mede alcance a partir dos
pontos de entrada, e a janela ainda não está no grafo.

**`utils/maquina.py` não foi tocado.** Era posse desta frente "só o chamador de
`gravar_rascunho_da_mesa`, CAL-2" — e o chamador que faltava já existia em
`integrations/lugar_declarado.py`, fechado na leva anterior. O que faltava era
alguém chamar **aquele módulo**, e é o que a janela faz.

**Seis arquivos de teste novos**, 1214 linhas, 38 testes.

## Qual mordida prova

Nove arranques, cada um com a saída da reprovação e a da devolução. Comando:
cada cura foi arrancada no fonte, o teste rodou, a cura voltou.

```
ARRANCADA: CAL-3 · a descida do hub                                    rc = 1
E  AssertionError: um toque em 'Num hub ou extensão' tinha de dar lugar aos
   quatro, e estes ficaram sem: 3-1.1, 3-1.2, 3-1.3. Quem pende do hub ESTÁ no
   hub, e o barramento já diz isso sozinho

ARRANCADA: CAL-2 · a gravação a cada resposta                          rc = 1
E  AssertionError: a resposta dela não chegou ao disco. É a frase que a tela
   mostraria: 'O Hefesto está desligado — não gravei o que você declarou' —
   para uma gravação que não depende de daemon nenhum

ARRANCADA: CAL-4 · a caminhada só nas vazias                           rc = 1
E  AssertionError: a caminhada mandaria ela a um buraco que já tem aparelho —
   o primeiro é ('usb1-port3',) com '1-3' dentro

ARRANCADA: CAL-4 · o veredito vem do sysfs (F-1)                       rc = 1
E  AssertionError: a tela confirmou uma entrada sem que o barramento tivesse
   mudado — é o pulso pelo rádio sendo lido como veredito do cabo

ARRANCADA: CAL-4 · o tique da janela (F-1, caminho real)               rc = 1
E  AssertionError: a janela confirmou uma entrada com o barramento parado

ARRANCADA: CAL-5 · a posse do vocabulário (F-3)                        rc = 1
E  AssertionError: o gesto de calibrar chegou ao jogo: cross. Confirmar uma
   entrada com o cabo na mão dispararia essa ação dentro do jogo que está
   aberto atrás da janela

ARRANCADA: CAL-6 · a marreta respeita o silêncio                       rc = 1
E  AssertionError: a marreta bateu 6 quadro(s) com a animação desligada

ARRANCADA: CAL-7 · o quarto bloco nunca some                           rc = 1
E  AssertionError: 'O que eu não meço' sumiu numa mesa sem nada a relatar — e
   é justamente aí que o laudo vira promessa

ARRANCADA: R1 · confirmar pelo controle, sem teclado e sem mouse       rc = 1
E  AssertionError: o botão do controle não confirmou nada: a janela ficou no
   primeiro passo e a cerimônia voltou a exigir mouse

CURA DEVOLVIDA: 38 passed in 0.94s
```

E o escopo inteiro, com o portão de lápides e os dois vizinhos que compartilham
a bancada de mentira:

```
tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py
tests/unit/test_a_calibracao_grava_com_o_daemon_morto.py
tests/unit/test_a_fase_sentada_resolve_o_hub.py
tests/unit/test_a_volta_so_visita_o_que_esta_vazio.py
tests/unit/test_o_botao_de_calibrar_nao_chega_no_jogo.py
tests/unit/test_a_marreta_respeita_o_silencio.py
tests/unit/test_o_laudo_confessa_o_que_nao_mede.py
tests/unit/test_entradas_do_gabinete.py
tests/unit/test_a_janela_do_mapa_coloca_o_aparelho.py
-> 95 passed in 53.69s
```

Portões: `bash scripts/portoes.sh --rapido` → **18 verdes de 19**. O vermelho é
`colisao-de-sprints`, e ele **já estava vermelho antes de eu tocar em qualquer
coisa** — provado num `git archive HEAD` extraído para um diretório limpo:

```
FALHA: 16 colisão(ões) de posse não declarada(s):
  CALIBRAR-AS-ENTRADAS-01 x LEVA-1: reivindicam os mesmos 7 arquivo(s) sem
  `depois_de` nem `nao_toca` [...]  <- e 6 destes NÃO EXISTEM no disco
```

As 16 são todas `<sprint antiga> x LEVA-1`: o documento da leva
(`docs/process/sprints/2026-08-26-LEVA-1-*.md`, commit `aa8dfd67`) redeclara a
posse de 16 sprints sem `depois_de:` nem `nao_toca:`. Meu diff **não toca um só
arquivo em `docs/process/sprints/`**, e esse documento não é posse desta frente.

## O que NÃO verifiquei

- **A tela.** Nenhuma foto foi tirada e o olho dela não passou por aqui. O
  carimbo de 25/08 às ~03h55 cobre o **desenho** (as duas fases, a pergunta do
  hub, os dois relógios, o `[Não alcanço]`, a marreta em 0,82 s e as quatro
  palavras das faces, usadas verbatim) e **não** cobre a tela GTK. Não rodei
  `retratar_abas.py` (regra R-C).
- **A bancada.** Nada foi medido com o aparelho na mão. Os dois relógios
  (~3,4 s e 10,3–15,6 s) vieram da leitura de 25/08 e entraram na tela como
  texto; a volta completa com quinze entradas continua sendo bancada dela.
- **Que o daemon respeita a posse.** Ele não respeita: nada em produção chama
  `botoes_para_o_jogo`. A régua mede a peneira contra um despacho de mentira, e
  o furo F-3 continua ABERTO no produto — está escrito na lápide e abaixo.
- **R17 (cor nunca sozinha) não foi entregue nesta janela.** Escrevi o helper de
  glifo+palavra e o **apaguei**: nada nesta tela desenha estado por entrada — o
  "caderno" do mockup é o desenho da `mapa_da_mesa`, não desta janela. Não há
  cor sozinha aqui porque não há cor aqui.
- **R16 (contraste), R18 (escala de fonte), R7 (o alto-falante), R11 (tooltip
  vira `accessible-description`) e R34 (o `toc`)** não foram exercidos: esta
  janela não pinta cor, não toca som e não usa `set_tooltip_text`.
- **R5 (todo pulso termina em `rumble.stop` + `passthrough`)**: esta janela
  **não escreve no aparelho**. O pulso e a luz são da Onda 9 · Rumble, e a
  HARM-16 continua desarmável pelo F-4.
- **Um aviso `BERCO-DE-TMP-01`** apareceu em algumas execuções, nomeando
  `hefesto-berco-<pid>`, `hefesto-lar-de-sessao-<pid>`, `portoes_final.txt` e
  `tmp.S5686LIBLI`. Não é portão, e o que ele nomeia é o andaime do `conftest` e
  arquivo de OUTROS agentes desta leva — nenhum teste meu escreve caminho fixo
  em `/tmp`. Bisecção teste a teste do meu escopo: zero ocorrências.
- **A suíte inteira não rodou** (regra da casa: é de quem coordena, no fim, em
  oito lotes).

## O que sobrou para o próximo

1. **O F-3 continua aberto no produto, e é o mais urgente.** O despacho
   (`daemon/lifecycle.py`, no bloco do `_dispatch_gamepad_emulation`) manda os
   botões CRUS ao gamepad virtual, gateado só pelos 0,3 s de grace e sobrevivendo
   de propósito ao `daemon.pause` e ao modo jogo. **O conserto é uma linha**:
   passar `buttons_pressed` por `calibrar_entradas.botoes_para_o_jogo` antes do
   `_dispatch_gamepad_emulation`. Não fiz porque `daemon/` não é posse da L1-F
   (R-A). E há um segundo problema que NÃO medi: a GUI e o daemon são processos
   diferentes, então a posse declarada na janela **não chega ao daemon por
   memória** — ou ela viaja por IPC, ou o gate tem de morar do lado da GUI.
   Quem pegar isto tem de decidir isso primeiro.
2. **O botão que abre a janela é da L2-E**, e é ele que apaga as seis lápides
   novas. O construtor é de uma linha: `JanelaDeCalibrarEntradas(host, mapa,
   censo, entradas)`.
3. **`mapa_da_mesa.LogicaDoMapa` APAGA `perto` e `alto`** — defeito real, achado
   aqui e não consertado (arquivo alheio). `como_documento()` devolve só `nome` e
   `portas` de cada face; `faces` é uma LISTA, que `fundir_declaracao`
   substitui inteira. Logo: **abrir a janela do mapa 2D e clicar em "Aplicar"
   apaga o `perto`/`alto` que a calibração acabou de gravar.** As duas telas
   editam o mesmo campo, e uma delas não conhece dois dos campos dele. Dono:
   quem tiver `app/widgets/mapa_da_mesa.py`.
4. **`colisao-de-sprints` vermelho no `dev`.** O documento da leva redeclara a
   posse de 16 sprints. O conserto é `nao_toca:` ou `depois_de:` no frontmatter
   do `2026-08-26-LEVA-1-*.md`. Dono: quem coordena.
5. **Dezenove constantes de texto desta janela esperam o olho dela** — todas marcadas
   `PROVISÓRIO — decisão dela` no fonte, exceto as quatro palavras das faces, o
   `[Não alcanço]` e a cadência da marreta, que ela carimbou vendo o mockup.
   Dona única do texto: a `CONFIGURACOES-O-LEXICO-01`.
6. **O tique de 2 Hz da fase em pé não está fiado.** `JanelaDeCalibrarEntradas.
   tique(agora)` existe e é testado, mas ninguém o chama num `GLib.timeout_add`:
   quem abrir a janela precisa pendurá-lo, junto com `listar_entradas()`.
7. **A HARM-16** (F-4) e **o portão do idioma que não lê o `.glade`** (§7.1 da
   sprint) continuam sem dono, como a sprint já declarava.
