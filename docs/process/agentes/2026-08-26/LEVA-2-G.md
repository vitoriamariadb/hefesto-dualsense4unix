# LEVA-2-G — o diagnóstico diz o que fazer, e nomeia o gesto de cada pacote

**26/08/2026.** BG-SAUDE-01 + BG-06b, fundidas: as duas eram *"o diagnóstico não
diz o que fazer"*.

## O que mudou

### (1) O cartão "Saúde do sistema" passou a dizer o que fazer

`src/hefesto_dualsense4unix/integrations/storm_doctor.py` — as **doze** frases de
alarme (`WARN`/`INFO`) ganharam o campo de ação no molde **já aprovado** na aba
Configurações ao lado (`app/actions/config/secao_exame.PREFIXO_DA_CURA`, foto
`docs/usage/assets/readme_configuracoes.png`: *"O que fazer: Vale mudar um
deles de porta."*).

A frase mais cara era a do WirePlumber: ela mandava rodar `doctor --fix-safe`
**no terminal** enquanto o botão que roda exatamente esse script — "Aplicar
correções" (`btn_storm_fix_safe` → `on_storm_fix_safe` →
`scripts/fix_wireplumber_default_source.sh --install`) — está na mesma tela.
Agora ela aponta o botão.

Onde o gesto honesto é **nada**, a frase diz *"nada"* e diz por quê: inventar
trabalho seria pior. Foi o caso do quirk do `usbcore` (é o cinto extra; a cura de
raiz é a linha de cima) e o da regra áudio-off, que é opt-in deliberado.

Mais duas linhas do MESMO cartão, em `app/actions/daemon_actions.py`, entraram no
mesmo molde:

* `interpretar_guarda_do_steam_input` — dizia *"Conserto: rode `bash
  install.sh` de novo"*. Dois defeitos: "Conserto:" onde as outras doze dizem "O
  que fazer:", e um instalador que não existe em cinco dos seis formatos. O `./`
  ausente é o que a escondeu da varredura sintática da BG-INSTALL-01, que
  procura `./install.sh`;
* `interpretar_prontuario_dos_jogos` — o gesto já estava escrito, faltava estar
  no mesmo lugar da frase.

**As treze frases PROVISÓRIAS — decisão dela** (as doze do `storm_doctor`, em
treze cenas porque o `return WARN` do `check_steam_input` escreve dois textos):

- **quirk_do_usbcore_ausente** — o cinto extra do áudio USB não está posto (sob carga o travamento pode voltar). O que fazer: nada, enquanto a linha da cura do travamento do USB, logo acima, estiver verde — é ela que resolve na raiz.
- **steam_nao_instalada** — Steam Input: não encontrei a Steam nesta máquina (nenhum localconfig.vdf). O que fazer: nada, se você não usa a Steam. Se usa, abra a Steam e faça login uma vez — depois volte a esta aba.
- **steam_input_por_jogo** — Steam Input ligado para <jogos> — o Hefesto vai desligá-lo no próximo ciclo do guarda, porque esse jogo não está na sua lista de exceções. O que fazer: para manter a sua escolha, abra o jogo e clique 'Este jogo não funciona' na aba Sistema.
- **steam_input_global** — Steam Input LIGADO no ajuste GLOBAL da Steam (vale para todo jogo, não é escolha por jogo). O que fazer: clique 'Aplicar correções' na aba Sistema para desligar.
- **wireplumber_sem_dropin** — o ajuste de áudio do Hefesto não está instalado — sem ele o controle pode virar o microfone padrão do sistema sozinho. O que fazer: clique 'Aplicar correções' na aba Sistema.
- **audio_off_ativa** — o mic e o fone do controle estão DESLIGADOS de propósito (regra áudio-off ATIVA). O que fazer: nada, se foi você que pediu. Para ter mic e fone de volta, reinstale o Hefesto sem a opção de desligar o áudio do controle.
- **audio_off_inativa** — regra áudio-off inativa — o mic e o fone do controle estão liberados. O que fazer: nada.
- **cura_do_usb_agendada** — a cura do travamento está agendada. O que fazer: desconecte e reconecte os controles para ela valer agora.
- **cura_do_usb_ausente** — cura do travamento do USB AUSENTE — sem ela os controles podem desconectar no meio do jogo. O que fazer: <gesto> e reconecte os controles (o botão 'Aplicar correções' não instala esta cura).
- **audio_ausente_sem_denominador** — áudio do controle ausente (controle desconectado? — ou áudio-off). O que fazer: conecte o controle pelo cabo — no rádio o mic e o fone não passam.
- **nenhum_no_cabo** — nenhum controle no cabo — o áudio USB não se aplica (no rádio o mic e o fone não passam por placa de som). O que fazer: nada; conecte pelo cabo se quiser usar o mic e o fone do controle.
- **audio_ausente_no_cabo** — áudio ausente nos N controles no cabo (áudio-off ligado? — ou a placa ainda subindo). O que fazer: espere alguns segundos e olhe de novo; se não voltar, desconecte e reconecte o cabo.
- **audio_em_parte_dos_controles** — áudio presente em 1 de 2 controles no cabo — o outro está sem mic nem fone. O que fazer: desconecte e reconecte no cabo quem ficou de fora.

E as duas de `daemon_actions.py`, também **PROVISÓRIAS**:

- *"Steam Input: a rede de segurança <motivo> — a Steam pode religar a entrada Steam nos jogos e nada vai desfazer. O que fazer: <gesto>."*
- *"Ponte confirmada que não bate com a lista de hoje: <jogos> — o jogo foi marcado (ou desmarcado) depois que a ponte pegou. O que fazer: abra o perfil dele na aba Perfis e confira a caixinha do Steam Input."*

### (2) O gesto de atualizar ganhou nome, por formato

*"atualize o Hefesto pelo mesmo caminho por onde você o instalou"* é verdadeira em
todo formato e não ajuda em nenhum. Agora ela é o **último degrau** de uma
escada, e cada degrau é uma MEDIÇÃO:

| degrau | como se mede | gesto |
|---|---|---|
| checkout | há um `install.sh` ao lado do código | `rode ./install.sh para atualizar o Hefesto` (inalterado) |
| flatpak | `/.flatpak-info` (que o flatpak monta) ou `FLATPAK_ID` | `rode flatpak update` |
| nix | o código está dentro do `/nix/store` | `rode nix profile upgrade` |
| arch | `pacman -Qo` assume o arquivo | `rode sudo pacman -Syu` |
| debian | `dpkg -S` assume o arquivo | `rode sudo apt upgrade` |
| fedora | `rpm -qf` assume o arquivo | `rode sudo dnf upgrade` |
| desconhecido | ninguém assume | a genérica de sempre |

**O que ele NÃO faz, de propósito: adivinhar o formato pela distribuição.** "Tem
`apt`, logo é `.deb`" está errado para todo AppImage e todo `pip install --user`
numa máquina Debian — e gesto errado é pior que gesto vago. A pergunta é sempre
sobre ESTE arquivo no disco: quem é o dono dele?

Duas cópias, como já era: `scripts/doctor.sh` (`_formato_desta_instalacao`,
`_gesto_de_atualizar`) e Python (`storm_doctor.GESTO_DE_ATUALIZAR` +
`formato_desta_instalacao`), amarradas por portão nos cinco formatos.

**A armadilha do aparte foi conferida RENDERIZANDO, não lendo o fonte.** As 32
frases hospedeiras do `doctor.sh` foram pintadas nos três layouts (checkout,
debian, desconhecido) e conferidas lado a lado. Nenhuma junta torta: o gesto
nomeado só aparece FORA do checkout, e é exatamente lá que o `so_no_checkout`
devolve nada — os dois nunca se encontram.

## Qual mordida prova

### `test_a_saude_do_sistema_diz_o_que_fazer.py` (novo)

Cura arrancada — a frase antiga do WirePlumber de volta:

```
E  AssertionError: frase do cartão 'Saúde do sistema' que diz o QUÊ e o PORQUÊ e não diz o que fazer:
E      wireplumber_sem_dropin: "WirePlumber sem drop-in do hefesto ('doctor --fix-safe' instala)"
E    O molde é o da aba Configurações: 'O que fazer: <gesto>'. Onde o gesto for um botão desta mesma tela, aponte o botão.
E  AssertionError: o cartão voltou a mandar rodar 'doctor --fix-safe' no terminal:
E      wireplumber_sem_dropin: "WirePlumber sem drop-in do hefesto ('doctor --fix-safe' instala)"
E    O botão 'Aplicar correções', na mesma tela, faz isso.
FAILED ...::test_toda_frase_de_alarme_tem_o_que_fazer
FAILED ...::test_nenhuma_frase_manda_para_o_terminal_quando_ha_botao
FAILED ...::test_a_frase_do_wireplumber_aponta_o_botao
3 failed, 2 passed in 0.32s
```

Cura devolvida: `5 passed in 0.24s`.

`test_todo_ramo_de_alarme_tem_uma_cena` é o portão do portão: conta os `return
WARN/INFO` pela árvore sintática e exige uma cena para cada. Ramo novo sem cena
reprova aqui, e não na tela dela.

### `test_bg06_…::test_o_gesto_e_nomeado_por_formato`

Cura arrancada — a genérica de volta nos cinco formatos, nas DUAS cópias:

```
E  AssertionError: o formato 'flatpak' voltou a receber a frase que não diz o gesto: 'atualize o Hefesto pelo mesmo caminho por onde você o instalou'
E  AssertionError: o formato 'arch' voltou a receber a frase que não diz o gesto: 'atualize o Hefesto pelo mesmo caminho por onde você o instalou'
E  AssertionError: o formato 'debian' voltou a receber a frase que não diz o gesto: 'atualize o Hefesto pelo mesmo caminho por onde você o instalou'
E  AssertionError: o formato 'fedora' voltou a receber a frase que não diz o gesto: 'atualize o Hefesto pelo mesmo caminho por onde você o instalou'
E  AssertionError: o formato 'nix' voltou a receber a frase que não diz o gesto: 'atualize o Hefesto pelo mesmo caminho por onde você o instalou'
6 failed, 22 passed in 1.95s
```

Cura arrancada — as duas cópias divergindo só no `debian`:

```
E  AssertionError: a aba Sistema e o exame passaram a dizer coisas diferentes para a MESMA pessoa (debian):
E      GUI....: 'rode sudo apt upgrade'
E      doctor.: 'rode apt-get upgrade'
1 failed, 1 passed, 26 deselected in 0.42s
```

Cura arrancada — um aparte começando por pontuação (a armadilha medida em 25/08):

```
E  AssertionError: frase com a junta torta no formato 'checkout' — o gesto e o aparte não colaram:
E      doctor.sh:1851: 'h ; ' em 'wrapper hefesto-launch ausente — rode ./install.sh ; opt-out: --no-dkms'
1 failed, 2 passed, 25 deselected in 0.56s
```

Cura devolvida (os dois arquivos):

```
33 passed in 2.19s
```

E a régua sabe RECUSAR do outro lado:
`test_o_formato_sem_dono_continua_recebendo_a_generica` exige que AppImage e
`pip install --user` continuem recebendo a genérica — sem isso, uma detecção que
respondesse "debian" para tudo passaria nos cinco.

### Fora do escopo, verde

* os 48 arquivos que tocam `daemon_actions`/`storm_doctor`/`repo_files`:
  **913 passed, 2 skipped in 29.69s**;
* `portao_a_casa_sabe_e_o_produto_nao_faz.py`: **35 passed in 57.01s** (nenhuma
  lápide tocada — esta frente só acrescentou símbolos);
* `bash scripts/portoes.sh --rapido`: **TODOS VERDES — 19 portões**;
* `ruff check src/ tests/`: limpo.

## O que NÃO verifiquei

* **A tela.** Não rodei `retratar_abas.py` (R-C) e não olhei o cartão pintado. As
  treze frases foram medidas pelo TEXTO que a função devolve, não pelo `markup`
  do `GtkLabel`. O cartão é `wrap=True` e as frases ficaram **mais longas** —
  três delas passam de 200 caracteres. **Não medi a altura da aba Sistema**, que
  já foi apertada antes (580px contra teto de 654px, medido em 22/08 no comentário
  do `main.glade:2846`). Quem fotografar a leva deve olhar esta aba primeiro.
* **A detecção de formato num formato de verdade.** Flatpak, Arch, Fedora, Nix e
  `.deb` foram medidos com **disco de mentira** (layout sem `install.sh`,
  `/.flatpak-info` plantado, caminho `/nix/store/…` passado por parâmetro,
  dublês de `pacman`/`dpkg`/`rpm`). Nenhum foi rodado numa instalação real desses
  formatos — não tenho as máquinas.
* **O custo do `dpkg -S` em produção.** Está em `lru_cache` e só é alcançado fora
  do checkout, mas não cronometrei numa máquina `.deb` real. Na bancada dela (que
  é checkout) o caminho nem é tocado.
* **`nix profile upgrade`** é o gesto que a documentação do Nix dá para perfis;
  não confirmei que é o certo para quem instalou por *flake* ou por `home-manager`.
  Esses caem no mesmo degrau `nix` e podem receber um gesto que não serve.
* **A suíte inteira.** Não rodei (é de quem coordena, e em oito lotes).

## O que sobrou para o próximo

1. **`utils/repo_files.py` é a casa certa do gesto, e está FORA da posse desta
   frente.** O bloco `GESTO_DE_ATUALIZAR` + `formato_desta_instalacao` foi
   escrito em `integrations/storm_doctor.py` **por posse, não por desenho** — a
   pergunta é a mesma de `repo_files` (*"o que esta instalação tem ao lado do
   código?"*), um grau mais fina. Consequência **medida e relatada**:
   `app/actions/mouse_actions.py:610` e `app/actions/emulation_actions.py:358`
   chamam `repo_files.como_atualizar_esta_instalacao()` direto e **continuam
   entregando a frase genérica** — o último degrau da escada, não uma
   contradição, mas ainda assim duas telas com fineza diferente. Quem tiver
   `repo_files.py` na posse: mova o bloco para lá, faça
   `como_atualizar_esta_instalacao()` chamar `gesto_de_atualizar()`, e apague o
   ponteiro de `storm_doctor`.
2. **`PREFIXO_DA_CURA` tem DUAS cópias**, e a segunda é minha:
   `app/actions/config/secao_exame.PREFIXO_DA_CURA` (o dono) e
   `integrations/storm_doctor.PREFIXO_DA_CURA` (nova). `integrations/` não pode
   importar de `app/` sem inverter a camada — a saída é o prefixo descer para
   `utils/`. Enquanto não descer, mudar a palavra num lugar e não no outro põe
   "O que fazer" numa aba e outra coisa na aba do lado.
3. **Nenhuma linha nova em `scripts/portoes.sh`** (R-D). O
   `test_a_saude_do_sistema_diz_o_que_fazer.py` entra pela suíte. **Não peço a
   lista** — ele é rápido (0,24 s) e não guarda artefato compartilhado.
4. **A frase do `check_quirk` diz "nada" e aponta a linha de cima.** Isso é
   correto hoje, mas AMARRA duas linhas do cartão: se o `check_snd_quirk` mudar
   de lugar na ordem do `storm_report`, o *"logo acima"* vira mentira. Não há
   portão para isso.
5. **`docs/process/2026-08-25-AS-FRASES-DE-TELA-QUE-ESPERAM-ELA.md` sobe de 60
   para 75 frases** com as quinze desta frente. O documento está fora da minha
   posse — quem integrar a leva atualiza o índice.
