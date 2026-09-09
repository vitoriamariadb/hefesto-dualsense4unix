# ONDE PARAMOS — 09/09/2026, de madrugada: os instrumentos prontos, e a bancada que ela faz ao voltar

**Ela desligou o computador com esta pergunta:** *"certo tá tudo materializado?
posso desligar o pc e ligando seguimos com os testes da bancada?"* <!-- noqa-acento: citação literal dela -->
A resposta é sim, e este arquivo é a prova: tudo está na `dev`, empurrado
para a `origin`, e o que se faz ao voltar está na §2 com os comandos.

## §0 — O estado em uma linha

`dev` = `origin/dev` = `bf3d0b58` · árvore limpa · **21 sprints abertas de
640** · portões 50 de 51 (o vermelho é `reb/`, cópia fora do git, decisão
dela) · **nenhuma decisão dela pendente**.

## §1 — O que ficou materializado nesta noite (quatro commits)

| commit | o quê |
| --- | --- |
| `4e208534` | a régua **cabo · BT · perfil · controle** (CABO-BT-PERFIL-CONTROLE-01), o censo por lançador (LANCADORES-ZERO-01), JOGAR-02, ROLAGEM-01, SENSORES-NO-JOGO-01, SOM-POR-CONTROLE-01, MASCARA-NO-PERFIL-01, MIC-OS-QUATRO-01 corrigida; o `SPRINT_ORDER.md` reescrito e MEDIDO; a Epic «dentro heróic» e a máscara «pode entrar sim» no caderno de decisões <!-- noqa-acento: citação literal dela --> |
| `0022fce2` | as cinco decisões da noite (*"concordo com as 5"*): modo um para todos, navegação global, som no cabo nasce em `sfx`, o nó vive sempre, o selo diz LOCALIZADO / NÃO LOCALIZADO (a palavra dela da manhã) |
| `e9d16fef` | as quatro da madrugada (*"1-b;2b;3-c;4a"*) e as três sprints de bancada que nascem delas: FONE-01, BRILHO-DE-HARDWARE-01, MIC-VOLUME-02; os nós chamam-se «Alto-falante do Controle N» e «Microfone do Controle N» |
| `bf3d0b58` | **os seis instrumentos** em `scripts/ensaios/`, linkados às sprints, ao índice do rádio e ao README; 26 testes que mordem o byte na posição errada |

O `push` estava barrado pelo `pre-push` de anonimato por 31 commits velhos
(01–07/09, nascidos em árvores de agente sem o `commit-msg`). Ela escolheu
isentar por commit: o hook lê `git config --get-all hooks.anonimato.isento`
e pula só esses SHAs. **A alteração vive na FONTE do hook,
`~/.config/zsh/hooks/pre-push` (repositório de dotfiles dela, ainda sem
commit lá), com backup `.bak-antes-isencao-20260908`.** O self-heal reinstala
por diferença a partir dessa fonte — está tudo no disco, sobrevive ao
desligar.

## §2 — A bancada ao voltar, na ordem — cada passo pergunta e propõe a linha do caderno

Antes de tudo, os quatro na mesa como a casa mede: **P2 e P3 no cabo, P1 e P4
no rádio**. Na madrugada só havia os dois do cabo.

```bash
cd /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix
.venv/bin/python scripts/ensaios/quem_e_quem.py                       # dois cabo, dois rádio?
.venv/bin/python scripts/ensaios/os_nos_de_som_por_controle.py        # leitura pura: o que existe hoje
```

| # | sprint | comando | o que ela faz | minutos |
| --- | --- | --- | --- | --- |
| 1 | FONE-01 | `scripts/ensaios/o_fone_tem_volume_proprio.py --alvo <MAC do P2>` | fone plugado no P2; cinco passos; diz o que ouviu | 5 |
| 2 | BRILHO-DE-HARDWARE-01 | `scripts/ensaios/o_brilho_de_hardware_da_barra.py --alvo <MAC>` e depois `--sem-bit` | olha a barra nos níveis 0·2·1·0; repete no P1 (rádio) | 5 |
| 3 | MIC-VOLUME-02 | `scripts/ensaios/o_byte_do_microfone_muda_a_captura.py --alvo <MAC do P2>` e depois `--sem-bit` | fala «aaaa» nas três gravações; o pico decide | 5 |
| 4 | ensaio 13 · SOM-POR-CONTROLE-01 | `scripts/ensaios/o_envelope_do_som_no_radio.py --alvo <MAC do P1> --so-a-luz`, depois sem `--so-a-luz`, depois `--crc-errado` | a luz azul chegou pelos dois envelopes? saiu som em algum? | 15 |
| 5 | SENSORES-NO-JOGO-01 | `scripts/ensaios/o_jogo_para_de_ver_o_giro.py` (os sete passos da §3 da sprint) | a mira por giroscópio num jogo que ela escolher | 20 |
| 6 | MESA-DE-QUATRO-01 · LUZ-NO-RADIO-01 | `./validar.sh` | o roteiro das 21 linhas com os quatro na mão | 40 |

Todo instrumento aceita `--listar` primeiro (só lê `/sys`), roda com o daemon
VIVO pelo broker, e **não conclui**: imprime as linhas para o
`docs/data/ensaios.csv`, e quem coordena as escreve. O MAC vai mascarado
(`14:3a:9a:00:00:ab`, `44:46:48:00:00:03`) — o instrumento aceita a máscara.

**O que cada resultado decide** está na sprint de cada um: byte que o
aparelho não obedece **não ganha campo** (FONE-01 §2.1, MIC-VOLUME-02 §2,
BRILHO §3).

## §3 — As armadilhas desta noite

1. **O `pactl` da máquina dela fala português.** Um parser que procura
   `Name:` diz «NÃO EXISTE» a um sink que está lá; o instrumento roda com
   `LC_ALL=C`. Medido na primeira corrida do censo dos nós.
2. **Duas premissas da lista de opções estavam pela metade**, e ela decidiu
   em cima delas: o fone TOCA no cabo desde 15/08 (o que ninguém variou foi o
   volume dele sozinho), e o volume do mic TEM ato na fonte do sistema
   (quieto é só o byte do aparelho). Corrigidas na régua e no caderno, com as
   decisões dela mantidas — reversíveis numa frase.
3. **A lista das cinco ofereceu ENCONTRADO contra a palavra dela da manhã**
   («Deveria ter Não Localizado»). O registro seguiu a manhã. A regra que
   sobra: antes de oferecer opção sobre uma palavra de tela, `grep` a
   palavra dela nas sprints do dia.
4. **O `pre-push` varre TODOS os commits que a origin não tem**, não só os
   novos: 968 commits atrás, 31 barravam. Reescrever a história rebaixaria
   190 branches e 3 tags; a saída é a isenção por commit.
5. **A fila de 06/09 listava trinta sprints como «depois» que já estavam
   `feita` ou `absorvida`.** O `SPRINT_ORDER.md` ganhou a regra 6: o `estado:`
   se lê, não se lembra.

## §4 — O que NÃO está no repositório, de propósito

* `reb/` — cópia velha, `.git/info/exclude`; derruba o portão
  `janela-nao-confessa`; apagar é decisão dela;
* a alteração do `pre-push` — no repositório de dotfiles dela, sem commit;
* nada escrito nos controles dela nesta sessão: os instrumentos só rodaram
  em `--listar` e o censo dos nós (leitura pura).
