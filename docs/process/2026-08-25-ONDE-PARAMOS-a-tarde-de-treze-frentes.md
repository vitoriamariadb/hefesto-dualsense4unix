# ONDE PARAMOS — a tarde de treze frentes

**25/08/2026, à noite.** A madrugada entregou vinte e duas frentes; a tarde
entregou **treze**, e a diferença entre as duas está no que cada uma custou
para integrar: **zero conflitos**, porque a posse foi medida antes.

Este documento é a porta de entrada da próxima sessão. O anterior,
[a madrugada de vinte e duas frentes](2026-08-25-ONDE-PARAMOS-a-madrugada-de-vinte-e-duas-frentes.md),
continua valendo para o que ele mede — com três fatos já corrigidos por esta
tarde, marcados lá dentro.

---

## 1. O que passou a funcionar na máquina dela

| o que mudou | o que acontecia antes |
|---|---|
| **O Jogador 2 para de morrer** | cada piscada do primário no rádio promovia outro controle e **destruía** quem era o P2 — quatro vezes em 22 minutos |
| **A ordem de serviço saiu do tooltip** | *"Vale mudar um deles de porta"* estava dentro de um `set_tooltip_text`: quem não passasse o mouse pela palavra certa nunca descobria |
| **Os quatro DualSense dela voltaram a ser 1-4** | quatro endereços de fixture ocupavam os postos 2-5, e `led_control.py` só tem cor de PS5 até o 4 |
| **A janela da Steam parou de roubar o perfil** | treze trocas em 54 minutos de partida. Saiu do arquivo dela **e da fábrica**, onde ninguém tinha notado |
| **O mouse diz por quê** | as três razões estavam no código desde 25/08 e **nenhuma era chamada**: toda recusa caía em "sem motivo" |
| **O `/proc` para de ser varrido** duas vezes a cada 3,3 s | cada leitura de `cmdline` tomava o `mmap_read_lock` do processo alvo — inclusive o do jogo |
| **Cinco formatos param de sair pela metade** | Flatpak, AppImage, Arch, Fedora e Nix respondiam *"script não encontrado"* |
| **O exame diz FALHA onde é falha** | com o agente de pareamento morto **nenhum controle novo pareia**, e ele dizia WARN |
| **O install lê o firmware** | a MOTOR-7, com a divergência à mostra: a BIOS declara 5 conectores e a traseira tem 8 |

---

## 2. A colheita: CINCO instrumentos falsos num dia

Nenhum veio das levas de hoje. **Todos já estavam lá**, e o que os revelou foi
integrar treze frentes de uma vez.

| régua | o que ela deixava passar |
|---|---|
| `check_colisao_de_sprints` | um `# dona: A` no fim da linha **cegava o portão inteiro** — e eu o usei três vezes hoje para autorizar o próprio trabalho |
| `check_faixa_sintetica` | não enxergava **backup**: `Path.suffix` devolve só o último sufixo, e todo backup tem o seu |
| a escala de fonte nos testes | a preferência DELA (`escala_fonte: 6`) vazava entre arquivos pelo singleton do GTK; a correção existia **em 1 de 8 arquivos** |
| `test_mic_em_todo_formato` | casava a palavra "wireplumber" em qualquer lugar — **consertar não é empacotar** |
| `test_nome_citado_como_sprint` | não varria subpasta, e reprovava a citação **correta** de `CONFIG-07` |

**O padrão é um só, e ele tem nome agora: a régua confunde a PALAVRA com o
ATO.** Ela desliga (ou grita) exatamente quando alguém escreve bem — um
comentário útil, um nome de arquivo descritivo, uma explicação boa.

E uma delas morreu do jeito certo, que vale registrar: a régua do teclado disse
*"a régua não achou NENHUM valor produzível — ela cegou"* em vez de passar
verde. **É assim que um portão deve morrer.**

---

## 3. A suíte: o que se sabia dela estava errado

**13.381 testes verdes, em OITO LOTES.** O comando está no `CLAUDE.md`.

A suíte inteira num processo só **não fecha** — morre no meio, em ponto
variável, sem traceback e sem sumário. O `CLAUDE.md` atribuía isso a CARGA
("parou nos 13% com `load average` 6,7"); medido hoje com a máquina **ociosa**,
ela morre igual. **Fato substituído.**

Três diagnósticos meus caíram antes do certo — inclusive o de que a suíte
estava quebrada, quando não havia um único `F` nos logs.

---

## 4. O que espera ELA

1. **As SESSENTA frases de tela** — não 43, e a lista que os documentos mandavam
   consultar **nunca existiu**. Estão em
   [AS-FRASES-DE-TELA-QUE-ESPERAM-ELA](2026-08-25-AS-FRASES-DE-TELA-QUE-ESPERAM-ELA.md),
   e numa página de revisão com antes/depois por aba.
2. **`D-O-PAR-DE-ENTRADAS-VEM-DO-SYSFS` repousa numa premissa que a bancada
   contradiz — e a premissa era minha.** Ofereci o `peer` do sysfs dizendo que
   ele responde na entrada vazia; medido com `readlink` nos 38 nós, ele amarra
   o lado 2.0 e o 3.x de UM MESMO buraco, nunca dois vizinhos. A fonte certa já
   estava no esquema: a ordem do desenho dela, de duas em duas — e é **fato
   dela**, não inferência. O produto já implementa as duas na ordem certa; o
   registro da razão é que precisa dela.
3. **Os 30 s de reserva do posto** (BG-01). Escolha de projeto do agente,
   declarada como tal: ele mediu que sem ela o roteiro da noite dela termina com
   o Jogador 2 sendo o controle **errado**.
4. **A calibração**, que ela reservou para os dois.

---

## 5. O que fica para a próxima leva

**Catorze frentes** que o censo mediu e que não saíram, porque colidem com as
treze de hoje (`install.sh`, `main.glade`, `coop.py`). A fila e a razão de cada
uma estão no resultado do censo; a posse de vinte sprints já está declarada, e
é o que faltava para elas nascerem.

E o que o censo separou como **"é dela"**: o A/B do Sackboy, o co-op no Modo
Nativo, o app-id (cujo documento se **contradiz** — "DECIDIDO" no cabeçalho e
"nenhuma é obviamente melhor" trinta linhas abaixo), e o apelido de identidade
do 8BitDo.

---

## 6. Como conferir

```bash
git log --since=midnight --oneline | wc -l      # os commits do dia
bash scripts/portoes.sh                          # os 25 portões
ls docs/process/agentes/2026-08-25/              # os relatórios de cada frente
```
