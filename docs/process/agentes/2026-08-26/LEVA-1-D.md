# LEVA-1-D — o exame para de sair verde onde não mediu

**26/08/2026.** Dois falsos verdes do `scripts/doctor.sh`, fundidos numa frente
porque abrem o mesmo arquivo e são o mesmo defeito de forma: **a régua responde
uma pergunta estreita e publica a conclusão larga.**

---

## O que mudou

### 1. DROPIN-AMBIGUO-01 — a ausência do drop-in 51 tinha duas origens e virava uma só

O terceiro degrau de `_prefere_mic_do_dualsense` (`scripts/doctor.sh`) era:

```bash
[[ -f "${conf}/51-hefesto-dualsense-no-default-source.conf" ]] && return 1
return 0
```

A ausência do 51 tem **duas** origens — a promoção explícita (`mic promote`) e
o `uninstall` que desarmou a cura (ou a instalação que nunca houve) — e o disco
não as distingue. Máquina curada e máquina quebrada eram o mesmo estado, e é
desse estado que saiu a queixa dela de 04/08: *"não funciona nem mic, nem os
botões de sons do jogo"*.

**A cura é marcar o GESTO, nunca o estado.**

- `scripts/fix_wireplumber_default_source.sh` ganhou `_marca_do_gesto_gravar` /
  `_marca_do_gesto_apagar` e a constante `MARCA_MIC_DST` —
  `${XDG_STATE_HOME:-~/.local/state}/hefesto-dualsense4unix/mic-do-dualsense-pedido.conf`,
  arquivo próprio, com `gesto=` e `data=`. **Só arquivos**: nenhum `systemctl`,
  `wpctl` ou `pactl` vive nelas, pelo mesmo motivo do `_arma_dropins_do_mic` ao
  lado — o portão exercita a função de verdade num `HOME` de mentira;
- `enable_mic_dualsense` carimba **antes** de `_arma_dropins_do_mic`. A ordem é
  o ponto inteiro: o `--promote-source` apaga o 51 ali dentro, e é a partir daí
  que a ausência precisa de alguém dizendo de onde veio. Isso cobre os quatro
  caminhos de ligar o mic — `--enable-mic`, `--promote-source`, o botão "Ligar"
  da aba Emulação (`emulation_actions.py:1394` chama `--enable-mic`) e o
  `hefesto-dualsense4unix mic on|promote`;
- os gestos **contrários** apagam: os ramos `install)` e `disable)` do despacho;
- dois modos novos, só-arquivo: `--marcar-gesto-do-mic` e
  `--apagar-gesto-do-mic`;
- `install.sh`: o ramo `--keep-dualsense-mic` (que até hoje terminava idêntico a
  uma máquina que nunca instalou nada) chama `--marcar-gesto-do-mic`;
- `uninstall.sh`: `MARCA_MIC_PEDIDO` sai junto do 51, com o motivo escrito —
  depois do uninstall a ausência volta a ter duas origens, e deixar a marca de
  pé faria a instalação seguinte herdar uma promoção que ninguém pediu;
- `doctor.sh` ganhou `_marca_do_gesto_do_mic` (**só lê**, nunca escreve) e o
  degrau passou a: 51 presente → não; marca presente → sim; **nenhum dos dois →
  `return 1`, "não sei"**;
- `check_wireplumber_source` passou a aceitar a marca como "foi pedido". É a
  outra metade do mesmo defeito: quem promoveu a dedo fica sem o 51 por
  desenho e levava `[FAIL]` a cada doctor — aviso que se aprende a ignorar é
  pior que aviso nenhum;
- **check novo**, `check_dropin_do_mic_armado`, registrado na seção "áudio
  (microfone)". É a E3 da sprint de 04/08: o check que fala do **ARQUIVO** e
  não do sintoma, e por isso **vale com nenhum controle conectado** — que é
  justamente a hora em que a maioria das instalações roda e em que todos os
  outros checks de mic ficam mudos.

**A MIGRAÇÃO — a decisão que é dela, e que eu tomei em voz alta.** A sprint de
04/08 deixou duas saídas (E4). Escolhi a **conservadora, opção (b)**: máquina
que promoveu ANTES desta cura existir não tem marca e passa a ser tratada como
"não sei". O preço é conhecido e pequeno — ela deixa de ser a primeira da fila
quando a fonte padrão é um monitor, e o caminho de volta é um gesto só
(`mic promote`, que grava a marca). O preço da opção (a) era o `[OK]` em cima do
defeito, que já custou uma noite. **Está escrito no código, no teste e aqui** —
não descoberto por quem for usar.

### 2. ESCONDE-SÓ-O-HIDRAW-01, item 3.1 — o denominador do veredito do hide

`_veredito_do_hide` recebia em `$4..` os nós que o **broker escondeu**, olhava as
três superfícies só neles e fechava com `pass "… o jogo só vê o vpad"` — uma
afirmação sobre a **mesa**. Um DualSense físico que o broker nunca escondeu era
invisível para a régua, e a cena de 16/08 (dois físicos, um escondido) saía
**verde**. O comentário do próprio arquivo já confessava isso por escrito desde
25/08; faltava o censo.

- `_censo_de_fisicos()` chama `physical_nodes_exposure`
  (`broker/hidraw_broker.py`) pelo `_python_do_produto`, no mesmo molde de
  import que o `check_arvore_canonica_do_wrapper` já usa. **Não reimplementa o
  critério** de "o que é um DualSense físico" — é o mesmo validador do broker,
  o que recusa o vpad uhid. Duas réguas para a mesma pergunta é como esta casa
  já produziu alarme convincente e falso;
- `_veredito_do_hide` ganhou `$4` = censo (nós separados por espaço) e compara
  os conjuntos **antes** de medir superfície nenhuma. Divergiu, sai `warn`
  nomeando o que ficou de fora e **negando a frase forte em voz alta**;
- **censo vazio é "não sei", nunca zero** — sem o pacote alcançável a régua
  segue sem comparar, em vez de acusar o hide de esconder o que não existe;
- o comentário de `_tres_superficies_medir` que dizia "NÃO FECHA o 3.1" foi
  **substituído** (regra da casa: fato errado se substitui) pelo que vale agora.

Medido nesta bancada hoje, com o censo real: `_censo_de_fisicos` devolve **dois
nós hidraw de DualSense físico** (dois controles distintos no cabo, MACs
diferentes) — a cena de 16/08 está de pé na mesa, e a régua agora a enxerga.

---

## Qual mordida prova

### Defeito 1 — `test_dropin_ambiguo_01_a_marca_do_gesto.py::test_ausencia_sem_marca_nao_e_escolha`

Cura arrancada: degrau da marca comentado e o `return 1` final revertido para
`return 0` — o `doctor.sh` de ontem, literalmente.

```
E       AssertionError: verde sobre uma máquina com a cura do microfone desarmada e ninguém tendo pedido a promoção:
E         [ OK ] o mic do DualSense é escolha dela (sinal explícito: DUALSENSE_MIC_INTENDED)
...
FAILED tests/unit/test_dropin_ambiguo_01_a_marca_do_gesto.py::TestAAusenciaSemMarcaNaoEEscolha::test_ausencia_sem_marca_nao_e_escolha
FAILED tests/unit/test_dropin_ambiguo_01_a_marca_do_gesto.py::TestAAusenciaSemMarcaNaoEEscolha::test_o_aviso_diz_os_dois_caminhos
FAILED tests/unit/test_dropin_ambiguo_01_a_marca_do_gesto.py::TestAAusenciaSemMarcaNaoEEscolha::test_o_predicado_recusa_sem_marca
FAILED tests/unit/test_dropin_ambiguo_01_a_marca_do_gesto.py::TestAAusenciaSemMarcaNaoEEscolha::test_a_mordida_sem_a_leitura_da_marca_a_cena_volta_a_ser_verde
4 failed, 20 passed in 0.40s
```

Cura devolvida:

```
........................                                                 [100%]
24 passed in 0.43s
```

### Defeito 2 — `test_esconde_so_o_hidraw_veredito_das_tres_superficies.py::test_fisico_que_o_broker_nunca_escondeu_derruba_o_verde`

Cura arrancada: `for _fisico in ${censo}` trocado por `for _fisico in "$@"` — o
denominador antigo, o veredito comparando o que escondeu consigo mesmo.

```
E       AssertionError: verde sobre uma mesa com um DualSense físico FORA do hide — é a cena de 16/08/2026 saindo verde:
E         [PASS] broker escondendo 1 nó(s) físico(s), e as TRÊS superfícies dos 1 controle(s) fechadas (hidraw + evdev + joydev) — o jogo só vê o vpad (giroscópio sobrevive via fd-injection)
...
FAILED ...::TestODenominadorEAMesa::test_fisico_que_o_broker_nunca_escondeu_derruba_o_verde
FAILED ...::TestODenominadorEAMesa::test_o_aviso_nomeia_o_que_ficou_de_fora
FAILED ...::TestODenominadorEAMesa::test_a_mordida_o_denominador_antigo_volta_a_ficar_verde
3 failed, 4 passed, 26 deselected in 0.32s
```

Cura devolvida:

```
.................................                                        [100%]
33 passed in 0.59s
```

### O escopo inteiro, verde

```
$ .venv/bin/python -m pytest $(ls tests/unit/*.py | grep -Ei "doctor|install|_mic|broker|som_|wireplumber|esconde|hidraw|uninstall|fonte_padrao|audio") -q
1 failed, 1537 passed in 60.51s
```

O único vermelho é **arquivo alheio** e está em "o que sobrou", abaixo.

```
$ pytest tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py -q
35 passed in 52.87s
```

### E uma lição de processo, paga aqui

**`--rapido` (19 portões) não é o portão.** Ele saiu verde com duas violações de
acentuação nos MEUS arquivos; quem as pegou foi a camada inteira (26 portões,
via `costurar.sh --seco`):

```
acentuacao             VERMELHO rc=1 44966 ms
2 violação(es) de acentuação PT-BR encontrada(s).
scripts/doctor.sh:3998:media -> sugestão média
tests/unit/test_esconde_so_o_hidraw_veredito_das_tres_superficies.py:273:media -> sugestão média
```

O imperfeito de *medir* colide com o substantivo *média* na régua. Consertado
trocando o verbo (commit `99bdd429`) — brigar com o portão seria o defeito.
`acentuacao`, `anonimato` e `mypy` só existem na camada completa: **quem
despachar um agente com "`--rapido` verde antes de fechar" está pedindo menos
do que a costura cobra.**

---

## O que NÃO verifiquei

- **Nada foi exercido com o aparelho no ciclo real.** Não parei o daemon, não
  rodei `install.sh`, `uninstall.sh` nem
  `fix_wireplumber_default_source.sh --enable-mic` de verdade: eles escrevem no
  `HOME` dela e reiniciam o WirePlumber da sessão dela. Toda a prova é por
  `source` das funções REAIS num `HOME` e `XDG_STATE_HOME` de mentira. **O
  ciclo `uninstall` → `install` → `mic promote` → `doctor` numa máquina de
  verdade continua NÃO MEDIDO.**
- **O `warn` novo do censo nunca foi visto na tela do doctor completo.** Provei
  a função por `source`; não rodei `check_hidraw_broker` inteiro, que precisa do
  broker de sistema ativo e do socket. Os dois nós físicos que o censo achou
  hoje dizem que a cena existe, mas não sei o que o broker está escondendo agora.
- **Não medi o efeito no áudio.** Se a migração conservadora muda de fato qual
  fonte o `--fix-mic` elege nesta máquina, é dedução do código — não medição.
  Nesta bancada o drop-in 51 está no lugar, então o degrau novo nem é alcançado
  (`_prefere_mic_do_dualsense` → rc=1, igual a antes).
- **E5 da sprint de 04/08 (varrer os irmãos) NÃO foi feita.** O par
  "`uninstall` remove / `doctor` lê a ausência como intenção" quase certamente
  não é só do 51 — o commit `9c944a8` já pagou por essa família uma vez. A
  lista completa continua devendo.
- **Não rodei a suíte inteira** (regra da casa) nem os portões completos — só
  `--rapido` e o portão de lápides.

---

## O que sobrou para o próximo

1. **UM TESTE ALHEIO FICOU VERMELHO POR MINHA CAUSA, e eu não o toquei (R-A).**

   `tests/unit/test_fonte_padrao_01_e_cura_do_fix_mic.py:512` —
   `TestQuemPodeSerPromovido::test_sem_o_dropin_51_a_promocao_e_explicita`:

   ```python
   def test_sem_o_dropin_51_a_promocao_e_explicita(self, cenario: Cenario) -> None:
       """A ausência do 51 é o que `--promote-source` / `mic promote` deixam."""
       assert self._rc_prefere(cenario) == 0
   ```

   Ele **codifica o defeito**: afirma que a ausência do 51, sozinha, é a
   promoção explícita. É exatamente o contrato que a DROPIN-AMBIGUO-01 derruba.
   O conserto é de uma linha e quem coordena aplica em segundos — trocar o corpo
   por:

   ```python
   def test_sem_o_dropin_51_e_sem_marca_o_veredito_e_nao_sei(self, cenario: Cenario) -> None:
       """DROPIN-AMBIGUO-01: a ausência tem duas origens; sem a marca do gesto
       ela não é escolha de ninguém. Quem promova de propósito grava a marca
       (`mic promote`), e aí o rc volta a 0 — é o que o
       `test_dropin_ambiguo_01_a_marca_do_gesto.py` cobra."""
       assert self._rc_prefere(cenario) == 1
   ```

   Os outros três testes da mesma classe continuam verdes sem tocar em nada.

2. **`install.sh --keep-dualsense-mic` NÃO carimba no ramo não-nativo**
   (`--flatpak` / `--appimage` / `--deb`). O ramo de lá (install.sh:1931-1941)
   não tem `else`, e acrescentar um me obrigaria a chamar o script com o modo
   novo **antes** do `exit 0` da bifurcação — o que reprova em
   `tests/unit/test_mic_em_todo_formato_01.py::test_o_ramo_nao_nativo_respeita_as_flags_dela`,
   que exige que todo modo chamado ali esteja na lista `_MODOS_DO_MIC` daquele
   arquivo. **Arquivo alheio: relatei em vez de escrever.** O conserto é
   acrescentar `"--marcar-gesto-do-mic"` a `_MODOS_DO_MIC` (é decisão sobre o
   microfone, logo entra na lista do mic, não na `_MODOS_FORA_DO_MIC`) e então
   fechar o `else` no ramo não-nativo. Enquanto isso não acontecer, quem instala
   por flatpak/appimage/deb **com** `--keep-dualsense-mic` cai no "não sei" e
   recebe o `warn` novo — que diz o comando exato, então não é armadilha, é
   ruído.

3. **`colisao-de-sprints` está VERMELHO, e já estava antes de mim.** Medido:
   `git stash -u` + `bash scripts/portoes.sh --rapido` no `HEAD` desta árvore dá
   o mesmo `REPROVOU: 1 vermelho(s) de 19 -> colisao-de-sprints`, com 16
   colisões entre a `LEVA-1` recém-declarada e sprints abertas antigas (duas
   delas são minhas: `ESCONDE-SO-O-HIDRAW-01 x LEVA-1` e
   `LEVA-DE-BACKGROUND-01 x LEVA-1`, ambas por `scripts/doctor.sh`;
   `IDENTIDADE-01` e `MOTOR-DO-ARRANJO-01` por `install.sh`/`uninstall.sh`). O
   conserto é declarar `nao_toca:`/`depois_de:` no frontmatter das sprints
   antigas, e o dono do script da régua é a **L1-G**.

4. **Texto novo de tela — PROVISÓRIO, decisão dela (R-E).** Cinco frases, todas
   marcadas no código:
   - o `warn` + as duas `info` de `check_dropin_do_mic_armado` (a política não
     armada, o `--install` para rearmar, o `mic promote` para carimbar);
   - os dois `pass` do mesmo check (política armada / escolha dela, com a data);
   - o `warn` + a `info` do censo em `_veredito_do_hide`;
   - a linha nova do `install.sh` no ramo `--keep-dualsense-mic`.

   O léxico é o que já existe (`drop-in 51`, `promover`, `marca do gesto`,
   `censo`, `vpad`, `aba Emulação`); nenhuma palavra nova foi inventada.

5. **E5 da sprint de 04/08 continua aberta** — a lista dos outros pares
   "`uninstall` remove / alguém lê a ausência como intenção". Ela não cabia
   nesta frente e não foi tentada.

6. **A sprint `2026-08-04-DROPIN-AMBIGUO-01-...md` continua com `Estado:
   aberta`** e o `docs/process/sprints/` não é da minha posse. E1, E2, E3 e E4
   fecharam aqui; E5 não. Quem coordena decide se vira "parcial" com nota
   datada.

---

## O estado em que a frente fecha

```
$ bash scripts/portoes.sh            # a camada INTEIRA, 26 portões
REPROVOU: 1 vermelho(s) de 26 -> colisao-de-sprints
```

`acentuacao ok`, `mypy ok`, `anonimato ok`, `shellcheck ok`, `casa-sabe ok`
(o portão de lápides, 56 s), `ruff ok`. O único vermelho é o
`colisao-de-sprints`, **que já estava vermelho no `HEAD` desta árvore antes de
qualquer commit meu** — 16 colisões entre a `LEVA-1` recém-declarada e sprints
abertas antigas. Está no item 3 acima.

Quatro commits em `voo/LEVA-1-D`, e nenhum arquivo fora da posse:

```
99bdd429 fix(acentuação): "media" onde o portão pede "média" — troco o verbo
c48630a1 docs(LEVA-1-D): a entrega da frente, com as duas mordidas coladas
1e5b16f4 fix(broker): o veredito do hide mede a MESA, não só o que ele escondeu
96e3c4a1 fix(mic): a marca do gesto substitui a ausência do drop-in 51 (DROPIN-AMBIGUO-01)
```

**A costura NÃO foi rodada** (só `--seco`, que recusou pelo vermelho
pré-existente). Quem coordena decide: ou o `colisao-de-sprints` é pago antes,
ou a integração desta branch entra por fora dele.
