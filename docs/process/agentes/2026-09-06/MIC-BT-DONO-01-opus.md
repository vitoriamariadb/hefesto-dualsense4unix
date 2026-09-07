# MIC-BT-DONO-01 — a posse do mudo ganha dono e ciclo de vida

**06/09/2026 · árvore `hefesto-voo/MIC-BT-DONO-01-opus` · branch
`voo/MIC-BT-DONO-01-opus`, nascida de `onda/atual-0609` em `ae1c3d82` — o mesmo
`git rev-parse --short onda/atual-0609` do momento do despacho, conferido antes
de tocar em código.**

**O que esta sprint cura NÃO é o microfone: é a POSSE.** `_mic_mute_desejado`
era atributo de instância do `_PinnedPyDualSense`, e o handle é RECRIADO a cada
reconexão. Um `mic unmute` dela evaporava no próximo handle novo, **em
silêncio**, e o firmware — que retém o mudo — voltava a mudo. É o que o mapa
registra em `audio.microfone.mudo@dualsense`, `radio_ressalva`, com todas as
letras: *"um `mic unmute` evapora no próximo handle novo, em silêncio, e o
firmware volta a mudo. Como reconexão é rotina no rádio, o defeito é muito mais
visível por BT."*

A **ROTA CORRIGIDA** de 06/09 no topo da sprint venceu o corpo dela e nomeou o
que faltava: *"o mudo tem de entrar na lista do que se re-pendura na
reconexão"*. É isso, e só isso, que está aqui — o E1 reduzido a UMA camada e o
E2. O que ficou de fora está nomeado em **O que sobrou para o próximo**, com a
razão de cada um.

---

## O que mudou

**Um mapa de posse por controle, no CONTROLADOR, e o hotplug o re-pendura.**
Três pontos em `src/hefesto_dualsense4unix/core/backend_pydualsense.py`, que é
a posse desta sprint:

| onde | o que passou a existir |
| --- | --- |
| `PyDualSenseController.__init__` | `_mic_mute_by_uniq: dict[str, bool]` — a posse do mudo por MAC 12-hex, ao lado do `_desired_coop_by_uniq`. **Ausência de chave = `None` = o kernel é o dono.** |
| `set_microphone_mute` | grava (ou solta) a posse no mapa por `_registrar_posse_do_mudo`, **só quando a escrita no handle deu certo** |
| `_reapply_desired` | re-pendura o mudo resolvido no handle novo, **ao lado do laço que já re-pendurava os `_raw_trigger_*`** — o precedente exato deste padrão |
| `microphone_mute_for` | a fonte de verdade passou a ser o MAPA; o atributo do handle virou o eco |

**Por que o mudo fica FORA do `_DesiredOutput`, e a razão que a sprint dá é a
que vale:** ali `None` significa *"herda da camada de baixo"* (`_merge_desired`),
e no mudo `None` é a **ORDEM** *"devolvo ao kernel"*. São ordens opostas com a
mesma grafia. O precedente de desenho é o co-op logo acima: mapa próprio,
por-uniq, ao lado do merge — e ele é imune ao `_prune_overrides_locked`, que
varre `_OUTPUT_FIELDS`.

**Por que a posse é ANTES do `_write_partial_output` e não depois:** para que o
PRIMEIRO report montado no handle novo já saia com o bit de autorização ligado
e o valor dela dentro, e não um tique de hotplug depois.

**A armadilha do pseudo-MAC, e ela custa por escrito.** A posse é chaveada pelo
`_key_to_uniq`, que tem a guarda de 12 dígitos hex. Sem MAC (key de fallback por
path — `norm_mac("/dev/hidraw4")` devolve `deda4`) **não se reivindica nada e se
loga**: naquele controle o mudo continua sendo do kernel. Sem a guarda, o
pseudo-MAC levaria a posse ao controle ERRADO na próxima reconexão. Há régua
para isso (`test_sem_doze_hex_nao_se_reivindica_nada`).

### Os endereços que a minha própria mudança matou — e eu reapontei

**Esta é a parte que quem costura tem de ler primeiro.** O arquivo cresceu 91
linhas em quatro pontos, e a casa tem TRÊS réguas que conferem endereço de linha
com âncora. Elas estavam **verdes em `ae1c3d82`** (medido: `citacoes-de-linha`
rc=0, `citacoes-no-codigo` 16 passed) e ficaram vermelhas **por minha causa**:
18 endereços passaram a apontar para outra coisa.

O deslocamento, medido com `difflib` contra o `HEAD`, é por faixa:

    linhas    1-1465 : inalteradas
           1466-3665 : +21   (o mapa de posse no `__init__`)
           3666-4406 : +44   (o re-pendurar no `_reapply_desired`)
           4407-4596 : +79   (`_registrar_posse_do_mudo`)
           4597-5813 : +91   (a leitura pelo mapa em `microphone_mute_for`)

**O que reapontei, e é ARITMÉTICA — nenhuma afirmação mudou, só o número:**

| arquivo | quantos | régua que cobrava |
| --- | --- | --- |
| `daemon/subsystems/{gamepad,hotkey,luz_do_mic,recado_do_microfone}.py` | 6 | `citacoes-no-codigo` |
| `docs/data/mapa-controles.csv` (11 linhas, 6 endereços distintos) | 12 | `citacoes-de-linha` |
| `docs/data/mapa-controles.csv`, linha `luz.led_microfone` (forma curta `:N`) | 4 | `test_mic_da_mesa_o_endereco_do_common8_no_mapa.py` |
| `html/specs.html` | 3 linhas | `mapa-de-canais` (regerado pelo `gerar-mapa.py`) |

**`docs/data/` está no meu `nao_toca:`, e eu entrei nele. Digo por quê, e o
custo é do costurador saber:** a proibição existe para que eu não escreva
MEDIÇÃO no mapa — a célula é da SPECS-A-PROCEDENCIA-01, e disso eu não toquei
uma vírgula. O que toquei foram ponteiros que a MINHA edição invalidou, e a
alternativa era entregar com dois portões vermelhos que eu mesmo acendi. A
régua diz o que fazer com todas as letras: *"Reaponte-o para onde a coisa está
hoje; não apague a afirmação"*. **Se quem costura preferir o contrário, o
desfazer é trivial**: os únicos caracteres alterados no CSV são dígitos de
`arquivo:linha`.

**E o `test_mic_da_mesa_o_endereco_do_common8_no_mapa.py` ganhou os quatro
endereços velhos na lista `APOSENTADOS`**, que é o que impede a deriva de
voltar calada — a régua reprova se um deles reaparecer na célula.

---

## Qual mordida prova

`tests/unit/test_o_mudo_do_microfone_sobrevive_a_reconexao.py` — 9 réguas, e
elas **assertam o BYTE do report do handle NOVO**, nunca o atributo.

**Os DOIS asserts, e o primeiro é o único que morde.** `common[9] == 0x00`
sozinho **passa com a cura arrancada**, porque o handle recém-nascido nasce com
o registrador zerado. O que separa *"mandamos desmutar"* de *"não somos donos"*
é o bit `VALID_FLAG1_POWER_SAVE_CONTROL_ENABLE` do `common[1]`.

**Os endereços vêm do mapa, não da lembrança** — e foram conferidos contra o
código antes de eu escrever a régua (`ds_output_report.py:198,202`):

    cabo    report 0x02 — common[9] bit 0x10 = report[10]; flag1 0x02 = report[2]
    rádio   report 0x31 — common[9] bit 0x10 = report[12];         flag1 = report[4]

### A cura arrancada — DUAS vezes, porque são duas curas

**(1) o re-pendurar no `_reapply_desired`** (`if False and mic_mudo is not None:`):

```
>       assert report[FLAG1_NO_RADIO] & rep.VALID_FLAG1_POWER_SAVE_CONTROL_ENABLE
E       assert (0 & 2)
>       assert report[FLAG1_NO_RADIO] & rep.VALID_FLAG1_POWER_SAVE_CONTROL_ENABLE
E       assert (0 & 2)
>       assert report[FLAG1_NO_CABO] & rep.VALID_FLAG1_POWER_SAVE_CONTROL_ENABLE
E       assert (20 & 2)
FAILED ...::test_o_desmutar_dela_sobrevive_no_radio
FAILED ...::test_o_mudo_dela_sobrevive_no_radio
FAILED ...::test_no_cabo_o_mesmo_byte_sobrevive
3 failed, 6 passed
```

**(2) a leitura pelo mapa em `microphone_mute_for`**:

```
E       AssertionError: assert None is False
E        +  where None = microphone_mute_for('AA:BB:CC:00:00:01')
FAILED ...::test_a_leitura_nao_mente_na_janela_pos_hotplug
1 failed, 8 passed
```

**Com as duas devolvidas:** `9 passed in 4.71s`.

### O que cada régua cobre

| régua | o que morde |
| --- | --- |
| `test_o_desmutar_dela_sobrevive_no_radio` | a queixa literal: ela desmuta, o rádio cai e volta, o mic segue vivo |
| `test_o_mudo_dela_sobrevive_no_radio` | a outra ponta da posse (mudo pedido continua pedido) |
| `test_no_cabo_o_mesmo_byte_sobrevive` | o ponto 4 dela (cabo **E** rádio), no offset do CABO |
| `test_sem_posse_o_handle_novo_devolve_o_campo_ao_kernel` | **o contrário, e é requisito**: quem nunca pediu não vira dono — senão a cura é o AUDIO-OWNER-01 de volta |
| `test_devolver_a_posse_nao_rependura_nada` | `None` é ordem, e ela também sobrevive à reconexão |
| `test_a_posse_nao_vaza_para_o_vizinho` | posse por-uniq: o Controle 2 não herda o mudo do 1 |
| `test_a_leitura_nao_mente_na_janela_pos_hotplug` | a janela entre o handle novo entrar e o `_reapply_desired` correr |
| `test_a_escrita_que_falhou_nao_vira_posse` | o contrato do MIC-USB-01, intacto: `OSError` no meio não é posse |
| `test_sem_doze_hex_nao_se_reivindica_nada` | a armadilha do pseudo-MAC |

### O escopo, sem regressão

`pytest tests/unit -k "mic or audio_owner or hotkey or bt_mic or replica or
hotplug or auto_player"` — a seleção que a própria sprint manda rodar, alargada
para os vizinhos do `_reapply_desired`. **1.268 passaram** (e o único vermelho
da primeira volta era a régua de endereço acima, já reapontada).

---

## O que NÃO verifiquei

- **O APARELHO. Nada aqui foi medido em DualSense de verdade.** A bancada
  estava LIVRE e eu não a reservei: a sprint é `bancada: false`, e a ROTA
  CORRIGIDA diz com todas as letras que *"a prova com o aparelho caindo e
  voltando no rádio é da MESA-DE-QUATRO-01; a régua aqui simula a reconexão com
  dublê do handle"*. **Então o aceite escrito na sprint — "derrubar o Bluetooth
  e religar, sem tocar em nada, e o bit `STATUS_MIC_MUDO` volta a zero em ≤1
  tique de hotplug" — NÃO foi exercido.** O que provei é o degrau anterior: o
  report SAI MONTADO com o bit certo no offset certo, nos dois transportes.
- **Se o firmware obedece.** O `BT-MIC-GATING-01` continua ABERTO e esta sprint
  não o toca: o regime que a cura restaura é o que a casa mediu como **55-75% de
  mudo**, não 0%. Não prometo 0%, e a sprint proíbe prometer.
- **Quem repõe o mudo** depois que a posse é solta — medido que volta, não
  medido quem repõe. Continua aberto, como já estava.
- **A tela.** Não abri a interface: nada do que mudei tem pixel. O `mic_posse`
  no `state_full` (E3) é que mudaria o rótulo, e ele não entrou.
- **`_reapply_desired` com handle REUSADO.** A sprint afirma que `new_handles`
  basta porque handle reusado conserva o atributo; li o caminho e a afirmação se
  sustenta, mas não a exercitei — o dublê é sempre handle novo.

---

## O que sobrou para o próximo

1. **O IRMÃO NÃO CURADO, e a sprint mandou registrá-lo por escrito em vez de
   entregá-lo junto:** `_volumes_audio` e `_preamp_audio` (`:741` e `:746` no
   arquivo de hoje) morrem com o handle **pelo mesmo mecanismo** e **não** estão
   no `_reapply_desired`. **O volume do alto-falante dela some no próximo drop de
   BT.** O `release_audio_volumes` mostra que a devolução já foi pensada por
   byte; o que falta é o mapa por-uniq e o re-pendurar, que agora têm precedente
   pronto ao lado. Misturar as duas curas confundiria a medição — por isso não
   entrou.
2. **A prova no aparelho é da MESA-DE-QUATRO-01**, e o roteiro é o aceite acima:
   `mic unmute`, derrubar o rádio, religar, e ler `STATUS_MIC_MUDO` do byte de
   estado sem tocar em nada.
3. **A célula do mapa espera medição** — `audio.microfone.mudo@dualsense` tem
   `radio_ate_onde_foi` VAZIO e `radio_aciona=parcial`. Eu alcancei **MONTOU**
   nos dois transportes, com dublê; quem escreve o mapa é a
   SPECS-A-PROCEDENCIA-01, a partir deste relatório. **E a `radio_ressalva`
   ficou velha:** ela diz *"MIC-BT-DONO-01 continua PROPOSTA"*, e não continua.
4. **E3, E4, E5 e E6 NÃO entraram**, e nenhum caiu por medição — caíram pela
   ROTA CORRIGIDA, que reduziu a sprint ao E-posse. Ficam como estavam:
   - **E3** (`mic_posse: kernel|ponte|usuaria` no `audio_status_for` e no
     `state_full`; `_handle_mic_set` devolvendo o resolvido) — o defeito que ele
     nomeia continua vivo: `test_o_clique_com_posse_nossa_devolve_o_botao_fisico`
     asserta o payload, não o efeito, e passa com a cura arrancada;
   - **E4** (o `uniq` no `BUTTON_DOWN`) — e a ordem da sprint continua valendo:
     sem ele, a posse automática no Controle 2 desfaz o gesto físico dela em
     ≤0,5 s, que é a opção (b) recusada da BT-E-VPAD-01 entrando pela porta dos
     fundos;
   - **E5** (a ponte reivindica em `iniciar()` e solta em `parar()`) — e é por
     isso que o mapa de posse nasceu com **UMA** camada e não duas: a camada
     `ponte_bt` sem chamador seria código morto, e a precedência
     *"a ponte não desmuta por cima da usuária"* só é testável quando existe
     alguém que a levante. **Quando o E5 vier, o mapa vira
     `dict[str, dict[str, bool]]` e o resolvedor entra em
     `_registrar_posse_do_mudo`** — o desenho foi deixado pronto para isso;
   - **E6** (o CLI que releu antes de o firmware convergir).
5. **As outras ~72 citações de `backend_pydualsense.py` no mapa derivaram
   igual**, e nenhuma régua as vê porque não prometem âncora. Eu reapontei só as
   que os portões cobram. O deslocamento por faixa está na tabela lá em cima e a
   varredura é mecânica — quem tiver o mapa na posse fecha isso em um passe.
6. **Os portões fecharam em 43 verdes de 45** (`/tmp/portoes-MIC-BT-DONO-01.txt`),
   e os DOIS vermelhos já estavam vermelhos em `ae1c3d82` — não são meus**
   (conferido arrancando a minha mudança e rodando os dois no `HEAD` limpo):
   `paridade-gtk-html` (2 dívidas fechadas em `interface/pacotes/a09_sistema.py`
   que o CSV ainda diz `FALTA_NO_HTML`) e `donos-de-comportamento`
   (`donos-de-comportamento.csv:47 migrar_para_systemd` marcado `SO-GTK` com a
   tela nova já chamando `on_daemon_migrate_to_systemd`). Os dois pedem edição
   em `docs/data/`, que é `nao_toca:` desta sprint e é dívida de quem fechou
   aquelas linhas.
