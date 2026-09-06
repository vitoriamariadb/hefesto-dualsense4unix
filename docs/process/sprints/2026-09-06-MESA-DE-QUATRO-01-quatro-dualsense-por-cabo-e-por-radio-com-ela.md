---
sprint: MESA-DE-QUATRO-01
estado: aberta
posse:
  BANCADA:
    - docs/data/ensaios.csv
cria:
  - docs/process/2026-09-07-A-MESA-DE-QUATRO-o-que-a-bancada-mediu.md
bancada: true
depois_de:
  - A-PALAVRA-MESA-SAI-01
  - A-TELA-SAMBA-01
  - CONEXOES-LIGAR-TUDO-01
  - ONDA4-S10-O-TRANSPORTE-01
  - ONDA5-01-01
  - ONDA5-02-01
  - ONDA5-MIC-VIRTUAL-01
  - SPECS-A-PROCEDENCIA-01
nao_toca:
  - src/
  - tests/
  - mockup/
  - docs/data/paridade-gtk-html.csv
---

# MESA-DE-QUATRO-01 · BANCADA — quatro DualSense, por cabo e por rádio, com ela

> **A palavra dela, 06/09/2026:** *"o foco do programa hoje é fazer os 4
> dualsense funcionar seja via bt ou cabo."* E, sobre quando: a bancada dos
> quatro é *"no FECHO, junto com o ensaio do som BT"*.

**Isto não é sprint de código.** É a hora dela com os quatro controles, no
FECHO das 24 horas, e é ela que decide **o que ainda está vivo** das dezoito
sprints antigas do co-op e do rádio — as que o `SPRINT_ORDER.md` §2.1 lista e
que ninguém remediu desde 27/08. Cada linha reprovada vira UMA sprint nova com
posse. **Nada se conserta durante a bancada:** um conserto no meio invalida o
resto do roteiro.

---

## 1. ANTES DE SENTAR (o coordenador, 15 min)

1. o merge em `dev` feito, os 45 portões verdes, os doze lotes verdes;
2. o `install.sh --yes` rodado **por ele, na árvore dela, com a palavra dela**
   (`D-0609-INSTALL-PELO-OPUS`); o `doctor` sem FALHA;
3. o journal indo para arquivo, nunca para o terminal dela:
   `journalctl --user -u hefesto-dualsense4unix -f > ~/.local/state/hefesto-dualsense4unix/bancada-0907.log &` (anote o PID; é por ele que se mata);
4. a janela aberta pelo `.desktop`; um jogo dela aberto — o que ela escolher;
5. os quatro DualSense carregados; dois cabos USB à mão.

## 2. O ROTEIRO (60 min) — cada linha tem PASSA/REPROVA e a sprint antiga que fala disso

| # | o que se faz | passa quando | se reprovar, quem já descreveu isto |
| --- | --- | --- | --- |
| 1 | liga dois no cabo e dois no rádio, um a um | cada um aparece na fita com P1…P4 e a cor do plástico certa em menos de 5 s | ORDEM-DE-CHEGADA-01 · IDENTIDADE-VEM-DE-CIMA-01 |
| 2 | move cada controle no jogo | o jogo vê os quatro; nenhum some nos dois primeiros minutos | COOP-QUE-NAO-DESMONTA-01 · JOGO-01 |
| 3 | tira o P1 do cabo e o põe no rádio, no meio da partida | ninguém mais cai; ele volta com o mesmo número | DUAS-CONTABILIDADES-01 · RESERVA-DO-POSTO-01 · PARTIDA-PICOTADA-01 |
| 4 | desliga um controle do rádio (PS longo) | os outros três seguem; a vibração dele não fica presa; a barra dos outros não muda | BORDA-DE-QUEDA-01 · DOIS-CAIRAM-DE-UMA-VEZ-01 |
| 5 | religa o mesmo controle | volta ao mesmo assento; a luz de jogador confere | JOGADOR-3-FANTASMA-01 · LUGAR-A-MESA-01 |
| 6 | Vibração: Testar em cada um, um de cada vez | só o escolhido treme; o teto por controle vale | POSSE-POR-CONTROLE-01 · QUATRO-NA-MESA-01 |
| 7 | Gatilhos: aplica um efeito no P3 | só o P3 muda, no cabo e no rádio | as linhas da aba 03 no CSV |
| 8 | Iluminação: uma cor em cada um; depois "voltar ao automático" | cada um obedece, inclusive no rádio; a troca automática de perfil volta a valer | A-TRAVA-DO-LED-NAO-SOLTA-01 · LUZ-NO-RADIO-01 |
| 9 | Microfone: o botão físico em cada um | a luz inverte e o canal DAQUELE controle aparece no sistema, no cabo e no rádio | ONDA5-MIC-VIRTUAL-01 · MIC-VIRTUAL-02 · QUATRO-MICROFONES-01 |
| 10 | Bateria: anota os quatro números; volta neles aos 20 min | mudaram | BATERIA-PARADA-01 |
| 11 | **Som pelo rádio — o ensaio 1 da bancada do rádio** (4 min, a orelha dela) | o `0x39` com conteúdo variado produz som no alto-falante de um controle no rádio | A-BANCADA-QUE-O-RADIO-PEDE-INDICE, ensaio 1 · O-ALTO-FALANTE-VIRTUAL-01 |
| 12 | fecha o jogo, fecha a janela, reabre as duas | os quatro continuam; o perfil ativo é o mesmo | AUTOMATISMO-MORTO-01 · CONECTA-E-DESLIGA-01 |
| 13 | **Perfil vivo, por controle, sem Salvar:** muda o gatilho do P2 na aba 03, a cor do P4 na 04, a vibração do P1 na 05; troca de aba e volta; fecha e reabre a janela | cada aba mostra o que foi feito NAQUELE controle, e o outro não mudou — sem Aplicar nem Salvar em aba nenhuma | ONDA5-01-01 · ONDA5-02-01 · QUEM-E-QUEM-03 |
| 14 | Gatilhos: "Todos" com três ligados; liga o quarto | o quarto herda o que "Todos" escreveu | GATILHOS-EM-TODOS-01 |
| 15 | Lançadores: cria um lançador para o jogo aberto e abre o jogo por ele | o jogo abre, o perfil troca sozinho, os quatro seguem no jogo | a aba 07 do CSV · a01_jogar |
| 16 | Conexões: pareia um controle pela aba, "a luz não acende" | a espera pelo PS, a contagem e o Cancelar aparecem e obedecem | CONEXOES-A-LUZ-QUE-NAO-ACENDE-01 |
| 17 | Reserva do posto: desliga o P2 por 20 s e religa | o assento fica reservado; ele volta P2 | RESERVA-DO-POSTO-01 |
| 18 | Modo Nativo com dois controles no jogo | os dois jogam; nenhum "jogador 2" fantasma | COOP-NA-CONEXAO-NATIVA-01 · QUATRO-NA-MESA-01 |
| 19 | Som: escolhe "Alto-falante · P2" como saída de um tocador | só o P2 toca (no cabo); a lista de som tem um nó por controle | O-ALTO-FALANTE-VIRTUAL-01 |
| 20 | Mudo no rádio: o botão do microfone do P3 (rádio) | o mudo obedece e o cartão diz | MIC-BT-DONO-01 |
| 21 | Luz no rádio: uma cor no P4 (rádio) | obedece | LUZ-NO-RADIO-01 |

**As linhas 13-21 são a ACEITAÇÃO DO PRODUTO** (06/09, arrumação da leva): a
definição de pronto dela — *"migrar tudo do gtk pro html, adaptando o html pra
funcionar pra 4 controles, cada perfil vivo, todas as features funcionando pra
cabo e radio, e cada aba se lembrando das configs de cada controle dentro do
perfil sem que eu precise aplicar ou salvar em cada aba e por fim tudo
funcionando (incluindo a aba de lançadores), de conexão e afins"* — dita em
gestos dela, um por sprint das ondas G-J. Cada sprint dessas constrói com dublê
e deixa AQUI a sua linha de prova (`D-0609-A-BANCADA-PROVA-NAO-BLOQUEIA`).

**E a passagem do `nao-medido`:** durante o roteiro, quem coordena anota pela
`chave` do mapa cada célula `nao-medido` que a mesa exercitou (as 109 de 06/09
estão em `grep -c nao-medido docs/data/mapa-controles.csv`); é a P2 da
SPECS-A-PROCEDENCIA-01, e o `ensaios.csv` só ganha linha do que ela viu.

A coluna da direita é **quem já mediu**, não quem executa: o que reprovar
ganha sprint nova, escrita no molde de 05/09 e com a medição desta bancada como
§1. O item 11 é o único que não é dos quatro: entra aqui porque ela mandou
(*"deixa pras últimas etapas da 24h mas ainda nessas 24"*).

## 3. O QUE SAI DAQUI

* `docs/process/2026-09-07-A-MESA-DE-QUATRO-o-que-a-bancada-mediu.md`: a tabela
  acima com PASSA/REPROVA por linha, a hora de cada uma, e o trecho do journal
  de cada reprova — **MAC mascarado** (octetos 4 e 5 zerados), sempre;
* para cada REPROVA, **uma sprint nova com posse**; a sprint antiga da coluna da
  direita ganha `estado: absorvida` apontando para a nova;
* para cada PASSA, a sprint antiga ganha `estado: feita` com a linha desta
  bancada como prova — é assim que as dezoito param de ser "não remedidas";
* `docs/data/ensaios.csv` ganha a linha do ensaio 1 do rádio e as células que a
  bancada mediu (o coordenador escreve; a régua `check_paridade_transporte.py`
  confere).

## 4. AS REGRAS DESTA HORA

* `--oculta` não vale aqui: **é a tela dela, com ela**. Ninguém mais abre
  janela durante a hora — nem agente, nem régua de clique.
* Saída de comando em arquivo; processo morre por PID conferido; nada de MAC
  real nem serial no relatório.
* **Quatro controles é o foco. Nenhum externo entra nesta mesa** — o Nintendo
  Pro e o 8BitDo são a EXTERNOS-01, depois.
