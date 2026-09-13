# TELA-CALADA-02 — o cartão da Steam diz o estado, e não a história

**Branch:** `voo/TELA-CALADA-02-opus` · nascida de `onda/1309` (`53cfd578`)
**Bancada:** não pedida, não usada — `bancada: false`, e nada desta leva toca o aparelho.
**Portões:** ver o fim da seção «O que NÃO verifiquei».

---

## O que mudou

**Os quatro canais da §1, e o que o cartão diz agora em cada um:**

| # | canal | antes (medido no piloto, cena com dublê) | agora |
| --- | --- | --- | --- |
| 1 | a frase da sentinela no corpo | *«2 jogos perderam as Opções de Inicialização do Hefesto na Steam: … Feche a Steam e eu reponho.»* | **«2 jogos sem o atalho»** |
| 2 | a notícia da vigia na cabeça | *«Reposta a Opção de Inicialização do Hefesto em 2 jogos da Steam: …»* por uma volta da vigia | nada no cartão; `[relato] 07-lancadores.html · vigia-da-steam: …` no stderr |
| 3 | o aviso do jogo aberto | *«O jogo está rodando sem o atalho de inicialização — controles podem duplicar. Reponho o atalho…»* | **«Jogo aberto sem o atalho»** |
| 4 | a primeira meia volta | *«Estou lendo a sua biblioteca da Steam…»* | corpo vazio (comentário HTML — um `""` viraria travessão no `escrever()`) |

**Onde, arquivo por arquivo:**

* `src/hefesto_dualsense4unix/interface/desenho_dos_lancadores.py` — o ramo
  `lida.reparaveis` de `cartao_da_steam` escreve só a contagem; o ramo
  `lida is None` escreve `SEM_FRASE`; **o campo `Leitura.frase` saiu** (nenhum
  leitor sobrava, e a vigia montava a frase a cada volta para ninguém).
* `src/hefesto_dualsense4unix/interface/pacotes/a07_lancadores.py` —
  `_ler_do_disco` deixa de encher `frase`; `aviso_do_jogo_aberto` devolve o
  rótulo `JOGO_ABERTO_SEM_O_ATALHO` (a decisão de acender continua do dono,
  `home_actions.wrapper_banner_text`); `_VigiaDaSteam` perdeu `noticia()` e o
  estado de tela, e `_anotar` escreve o `[relato]`; `com_o_que_o_daemon_diz`
  não soma mais a notícia à cabeça.
* A página: `aba07.py` → `mockup/07-lancadores.html` →
  `scripts/check_o_desenho_aprovado.py --publicar 07` →
  `src/hefesto_dualsense4unix/interface/paginas/07-lancadores.html`. Uma linha
  mudou nas duas, e só ela.

**AS DUAS ESCOLHAS DE TEXTO, e por quê:**

1. **«N jogos sem o atalho», e não a reserva inteira.** A sprint manda usar a
   reserva que já existia (*«N jogos sem o atalho de inicialização do
   Hefesto.»*) e, na mesma página, a régua de até seis palavras — a reserva tem
   nove. Fiquei com a régua, que é o exemplo literal da sprint. A palavra curta
   já está na tela: cada linha da lista do cartão diz «nunca recebeu o atalho» /
   «tinha o atalho e perdeu».
2. **«Jogo aberto sem o atalho» no lugar da frase do jogo aberto.** A §1.3 pedia
   medir se o «Não perguntar para este jogo» se explica sozinho. **Não se
   explica:** sem nada escrito, o botão aparece no cartão sem dizer sobre o quê
   não perguntar. O rótulo tem cinco palavras, sem primeira pessoa e sem
   instrução.

**O QUE NÃO SE PERDEU:** os nomes dos jogos continuam na lista do cartão (com o
motivo e o «Não usar neste jogo»); o selo `COM IMPEDIMENTO`, o «Consertar» e o
«Posso fechar a Steam por uns 20 segundos?» continuam; a frase da sentinela
continua sendo a RECUSA do «Consertar»; e a vigia continua repondo e
repintando pelo `VIGIA.esquecer()`.

**As réguas que cobravam o contrato velho mudaram com data e citação**, nenhuma
apagada: `test_a_aba_nao_escreve_uma_segunda_frase_do_aviso`,
`test_o_aviso_e_a_decisao_da_gtk_e_nao_uma_copia`,
`test_o_aviso_usa_o_texto_dela_sem_redigitar`,
`test_o_aviso_e_o_botao_de_dispensar_chegam_ao_cartao`,
`test_o_relogio_e_perguntado_ao_dono` (a metade da notícia saiu) e
`test_a_noticia_da_vigia_vai_para_o_cartao_da_steam`, que **se inverteu** e foi
renomeado para `test_a_noticia_da_vigia_nao_vai_mais_para_o_cartao_da_steam`.
Seis construções `Leitura(frase="alguma frase")` perderam o argumento
(`tests/unit/test_a_aba_lancadores_diz_a_verdade.py` e
`tests/unit/test_a_aba07_le_o_que_o_daemon_ja_dizia.py`).

**O ensaio do WebKit mudou de contrato junto:**
`scripts/ensaios/a_vigia_da_steam_no_webkit.py` exigia a frase da vigia DENTRO
do cartão; agora exige o relato escrito e o cartão calado.

**A régua nova:** `tests/unit/test_o_cartao_da_steam_nao_narra.py` — dez casos,
um por canal, mais a régua que sabe recusar (as quatro frases de antes
reprovam nela), a recusa do «Consertar» que continua e o literal das duas
páginas.

### A foto e o clique

Piloto `hefesto_vivo.Piloto` com `--oculta` (Xvfb próprio), por um driver
descartável fora do repositório, com `HEFESTO_DUALSENSE4UNIX_SKIP_PRESET_SEED=1`
e dublês em `_ler_do_disco` (dois jogos de mentira), `reparar_ou_adiar`,
`carona_do_wrapper.passada` e `with_steam_closed` — este último levanta se for
chamado. A Steam dela estava aberta; nada foi fechado. Tempos: foto aos 3 s,
clique no «Consertar» aos 3,8 s, releitura aos 5,2 s, vigia repondo e foto aos
12,5 s.

| | antes (`53cfd578`) | depois |
| --- | --- | --- |
| cartão aos 12,5 s | [ANTES-07-cartao-da-steam.png](ANTES-07-cartao-da-steam.png) | [DEPOIS-07-cartao-da-steam.png](DEPOIS-07-cartao-da-steam.png) |
| página publicada (Chrome sem janela, `olhar.py --publicado`) | [ANTES-07-publicado.png](ANTES-07-publicado.png) | [DEPOIS-07-publicado.png](DEPOIS-07-publicado.png) |

O que o DOM disse (`data-campo="steam-diz"`, `innerHTML`):

```
antes  t0   2 jogos perderam as Opções de Inicialização do Hefesto na Steam: JOGO DE ENSAIO A e
            JOGO DE ENSAIO B. Sem elas, no Bluetooth o jogo tende a não enxergar controle nenhum —
            … Preciso da Steam FECHADA para repor (…). Feche a Steam e eu reponho.
antes  t3   <b>Reposta a Opção de Inicialização do Hefesto em 2 jogos da Steam: …</b><br>2 jogos perderam …
depois t0   <b>Jogo aberto sem o atalho</b><br><b>2 jogos sem o atalho</b>
depois t2   (igual; clique no «Consertar» chegou ao gesto — `[gesto falhou] 07-lancadores.html · consertar: …`)
depois t3   <b>Jogo aberto sem o atalho</b><br><b>2 jogos sem o atalho</b>
stderr      [relato] 07-lancadores.html · vigia-da-steam: Reposta a Opção de Inicialização do Hefesto em 2 jogos …
botões      Consertar · Ver o que impede · Abrir o lançador · Apontar outro caminho ·
            Não perguntar para este jogo · Posso fechar a Steam por uns 20 segundos? · Este jogo não funciona
```

**O «Jogo aberto sem o atalho» da cena depois NÃO veio de injeção:** naquela
volta o daemon VIVO publicou `wrapper_used=False` com um jogo da Steam em foco
(ela estava jogando). Na cena com o estado injetado o rótulo acendeu igual.

**Leitura real, antes e depois:** sem o dublê de disco, o piloto leu a
biblioteca dela, SÓ LEITURA (a recusa, a carona e o `with_steam_closed`
continuaram dublados). **Antes**, o cartão mostrou a mesma frase que ela colou,
com dois jogos reais sem o atalho — a volta nasceu de um erro meu de módulo (o
pacote é importado com dois nomes e o dublê caiu no outro). **Depois**, a mesma
biblioteca: `<b>2 jogos sem o atalho</b><br>Desligado — tudo certo`, selo
`COM IMPEDIMENTO`, igual aos 3 s, depois do «Consertar» e aos 12,5 s. A
`~/.config/hefesto-dualsense4unix` saiu byte a byte igual das duas voltas (md5
dos arquivos antes e depois de cada uma).

**O ensaio mudado foi rodado:** `scripts/ensaios/a_vigia_da_steam_no_webkit.py`
→ `rc=0` — *«antes: corpo '1 jogo sem o atalho' · clique no Consertar · vigia
armada=False, tiques=2, relatos=1 · depois: corpo '1 jogo sem o atalho' · OK»*,
com o `[relato] 07-lancadores.html · vigia-da-steam: …` no stderr.

## Qual mordida prova

Cada cura arrancada numa CÓPIA da árvore (troca exata de texto, casando uma
vez), a régua rodada, e a cura devolvida:

```
== M1 — o corpo volta a narrar (campo `frase` + `_e(lida.frase) or …` + `frase=sw.frase_do_aviso(censo)`)
FAILED tests/unit/test_o_cartao_da_steam_nao_narra.py::test_dois_reparaveis_o_corpo_diz_so_a_contagem
E   AssertionError: o corpo do cartão da Steam narra: achei 'Feche' em '1 jogo perdeu as Opções …
1 failed, 9 passed in 1.10s

== M2 — a notícia volta à cabeça (o `_anotar` guarda, a `cabeca` soma)
FAILED tests/unit/test_o_cartao_da_steam_nao_narra.py::test_a_noticia_da_vigia_vai_ao_relato_e_nao_ao_cartao
FAILED tests/unit/test_o_cartao_da_steam_nao_narra.py::test_o_tique_que_repoe_repinta_pelo_estado_e_nao_pela_frase
FAILED tests/unit/test_o_cartao_da_steam_nao_narra.py::test_o_aviso_do_jogo_aberto_e_um_rotulo_de_estado
FAILED tests/unit/test_a_vigia_da_steam_repoe_sozinha_07.py::test_a_noticia_da_vigia_nao_vai_mais_para_o_cartao_da_steam
E   AssertionError: a notícia da vigia voltou ao corpo do cartão da Steam
4 failed, 19 passed in 0.92s
    (o terceiro reprova por arrasto: a notícia guardada pelo caso anterior entra na cabeça dele)

== M3 — o aviso volta à frase longa (`_texto(texto)` no retorno)
FAILED tests/unit/test_o_cartao_da_steam_nao_narra.py::test_o_aviso_do_jogo_aberto_e_um_rotulo_de_estado
FAILED tests/unit/test_a_aba07_le_o_que_o_daemon_ja_dizia.py::test_o_aviso_e_a_decisao_da_gtk_e_nao_uma_copia
FAILED tests/unit/test_a_aba07_le_o_que_o_daemon_ja_dizia.py::test_o_aviso_usa_o_texto_dela_sem_redigitar
FAILED tests/unit/test_a_aba07_le_o_que_o_daemon_ja_dizia.py::test_o_aviso_e_o_botao_de_dispensar_chegam_ao_cartao
FAILED tests/unit/test_a_aba_07_lancadores_fecha_as_linhas.py::test_a_aba_nao_escreve_uma_segunda_frase_do_aviso
E   AssertionError: a frase longa do jogo aberto voltou ao cartão, a cada tique
9 failed, 56 passed in 3.36s
    (os outros 4 vermelhos desta rodada são os do Steam Input — ver «O que sobrou», item 1: não são desta mordida)

== M4 — «Estou lendo…» volta ao `lida is None`
FAILED tests/unit/test_o_cartao_da_steam_nao_narra.py::test_enquanto_le_o_corpo_do_cartao_cala
E   AssertionError: o corpo do cartão narra enquanto lê: 'Estou lendo a sua biblioteca da Steam…'
1 failed, 9 passed in 0.64s

== M5 — as duas páginas de `onda/1309` de volta
FAILED tests/unit/test_o_cartao_da_steam_nao_narra.py::test_a_pagina_nasce_com_o_corpo_calado[arquivo0]
FAILED tests/unit/test_o_cartao_da_steam_nao_narra.py::test_a_pagina_nasce_com_o_corpo_calado[arquivo1]
E   AssertionError: mockup/07-lancadores.html nasce narrando: 'Estou lendo a sua biblioteca da Steam…'
E   AssertionError: paginas/07-lancadores.html nasce narrando: 'Estou lendo a sua biblioteca da Steam…'
2 failed, 8 passed in 0.59s

== CURA DEVOLVIDA
10 passed in 0.58s
```

**A régua sabe recusar:** `test_a_regua_recusa_as_frases_que_sairam` passa as
quatro frases de antes pela régua de estado e exige que as quatro reprovem.

**Na árvore de trabalho, com a cura:** `test_o_cartao_da_steam_nao_narra.py` +
os 27 arquivos de teste que tocam a aba 07 → **451 passed, 4 failed**; os 4 são
os do item 1 de «O que sobrou», e reprovam IGUAL na base exportada de
`onda/1309` (`git archive`, `PYTHONPATH` na cópia) enquanto um jogo da Steam
está aberto na máquina. Antes das minhas mudanças, sem jogo aberto, a mesma
lista deu **445 passed**.

## O que NÃO verifiquei

* **O clique no «Posso fechar a Steam por uns 20 segundos?»** — proibido contra
  a Steam real, e o `with_steam_closed` dublado levanta. Medi só que o botão
  continua no cartão antes e depois do «Consertar».
* **A recusa do «Consertar» na tela.** Ela chegou ao gesto
  (`[gesto falhou] … consertar: <frase da sentinela>` no stderr), mas **nenhum
  `.hef-recado` apareceu, nem antes nem depois** da minha mudança: é a base
  `71c69c57`, que tirou a tarja. Onde a recusa pousa é da TELA-CALADA-01.
* **A janela instalada dela.** Nada disto chega à tela dela antes do merge e da
  instalação, que não são meus.
* **A primeira meia volta no WebKit.** O `SEM_FRASE` foi medido no valor emitido
  e no HTML estático (Chrome); a janela do piloto passa por ele em menos de um
  tique, e não fotografei esse instante.
* **O que mais narra no MESMO cartão**, fora dos quatro canais — não mexi, e
  está no item 3 de «O que sobrou».
* **Célula do mapa:** nenhuma. O cartão da Steam não é canal de controle;
  `docs/data/mapa-controles.csv` não tem linha para ele.
* **O CANÁRIO DO `casa-sabe` e a janela dela.** Entre o meu backup
  (`~/.config/hefesto-dualsense4unix`, 03:29) e o fim das provas, mudaram
  `active_profile.txt`, `controller_masks.json`, `gamepad_emulation.flag`,
  `session.json`, dois perfis e onze cópias em `.historico/`. **Todas as linhas
  `profile_salvo` do `interface.log` depois das 03:07 têm o mesmo `pid`**, e
  esse processo é `scripts/abrir_interface.py` da árvore instalada, iniciado às
  03:38:47 — a janela dela. Nenhuma tem o `pid` de um piloto meu.
* **O VERMELHO DOS PORTÕES FOI ESSE CANÁRIO, e só ele.** A primeira corrida
  completa (antes desta entrega) deu **60 de 60 verdes**. A segunda deu **59 de
  60**: `casa-sabe` com `42 passed` e o `CANARIO-FS-01` acusando 25 mudanças em
  `~/.config/hefesto-dualsense4unix` — onze cópias novas em `.historico/`, a
  rotação das antigas, dois perfis, `active_profile.txt` e `session.json`. As
  onze cópias casam uma a uma com as **onze linhas `profile_salvo` de 03:58:58
  a 03:59:48, todas do `pid` 300298**, que é `scripts/abrir_interface.py` da
  árvore instalada, reaberto às 03:57:35 — a janela dela, com ela jogando.
  Nenhum processo meu grava perfil (a suíte usa o lar de mentira, e os pilotos
  deixaram o md5 da pasta igual). A corrida que fecha esta entrega foi feita
  com `HEFESTO_SEM_CANARIO_FS=1`, como manda o próprio aviso do canário.

## O que sobrou para o próximo

1. **QUATRO TESTES DA ABA 07 REPROVAM COM UM JOGO DA STEAM ABERTO NA MÁQUINA**, e
   não são desta sprint: `test_o_botao_de_desligar_so_nasce_com_o_steam_input_ligado`,
   `test_o_desligar_com_a_steam_aberta_pergunta_antes_de_fechar`,
   `test_deixar_tudo_pronto_so_nasce_quando_os_dois_tem_trabalho` e
   `test_a_leitura_do_disco_leva_o_steam_input_ate_o_cartao`, em
   `tests/unit/test_a_aba_07_lancadores_fecha_as_linhas.py`. A causa provável:
   `test_o_produto_enche_a_linha_com_a_constante_do_motor` chama
   `a07._ler_do_disco()` sem dublar `steam_game_running`, e o `PORTOES` do
   módulo fica com `jogo_aberto=True` lido do `/proc` real — o que esconde o
   «Desligar o Steam Input» nos quatro seguintes. Medido: verde às 03:2x sem
   jogo aberto, vermelho às 03:47 com jogo aberto, nas duas árvores.
2. **Citações que envelheceram em arquivo que não é meu** — citam a notícia no
   cartão (`a07_lancadores.noticia`):
   `src/hefesto_dualsense4unix/integrations/sentinela_do_wrapper.py` (docstring
   de `frase_do_aviso_curta`, `nao_toca` desta sprint),
   `src/hefesto_dualsense4unix/app/actions/carona_do_wrapper.py` (comentário de
   `ResultadoDaCarona.frase_curta`),
   `docs/data/paridade-gtk-html.csv` (a linha da `10-perfis` sobre a carona, e a
   linha da `07-lancadores` do aviso automático, que diz `IGUAL` e agora mostra
   rótulo e não a frase da GTK) e
   `docs/process/sprints/2026-09-13-PERFIS-TIRA-BUSCA-ATIVO-01-a-frase-que-nao-aparece-a-lupa-e-o-perfil-que-vale.md`.
3. **O que ainda narra no cartão da Steam e fora da régua da sprint** (não mexi):
   a linha do Steam Input (`emulation_actions.markup_status_steam_input`:
   *«Ligado para … — o Hefesto desliga no próximo ciclo, porque…»*); o ramo de
   erro (*«Não consegui ler a biblioteca da Steam — … Nada foi alterado.»*); o
   `DIZ_NAO_ACHEI` (*«… use «Apontar outro caminho» e me mostre onde»*); e o ramo
   bom (*«Os controles chegam. O atalho de inicialização está no lugar em N jogos
   da sua biblioteca (instalados ou não).»*, 17 palavras, decisão `07[04]`).
4. **O olho dela** no «Jogo aberto sem o atalho» e no «N jogos sem o atalho»: as
   fotos estão acima.
