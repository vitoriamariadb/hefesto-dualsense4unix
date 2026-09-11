# AUDITORIA-SOM-GIRO-01 — entrega

Árvore: `/mnt/Apate/Desenvolvimento/hefesto-voo/AUDITORIA-SOM-GIRO-01-opus`,
branch `voo/AUDITORIA-SOM-GIRO-01-opus`, nascida de `onda/0911` (`779c71f8`,
conferido contra `git rev-parse --short onda/0911`).

## O que mudou

**Um documento novo, e nenhuma linha de produto:**
`docs/process/2026-09-11-A-AUDITORIA-DO-SOM-E-DO-GIROSCOPIO.md`. O
`docs/data/mapa-controles.csv` não foi tocado (está em `nao_toca`), e as
propostas de célula estão no documento, com `chave`, transporte, valor de hoje,
valor proposto e a prova.

**A resposta às duas perguntas dela, medida:**

| | |
| --- | --- |
| **A — por controle** | o endereçamento existe ponta a ponta (`sensor.set`, `speaker.set`, `mic.set`, `mic.canal.set`, os quatro com `uniq`; o nó de saída e a fonte de captura nascem com o nome do aparelho). **A prova para de dois:** os 60 ensaios destas três famílias saíram de mesas de um ou dois controles |
| **B — dentro do jogo** | **não medida, em nenhuma linha, em nenhum lançador, em nenhuma máscara** |

**Os números que sustentam o B, e cada um é contagem, não impressão:**

- 24 chaves `@dualsense` nas famílias `audio.`, `movimento.` e `toque.` — **48
  células** (cabo e rádio);
- **18** dessas 48 têm o JOGO como destino (canal `evdev`/`uhid`, pela
  `DIRECAO_POR_CANAL` de `scripts/check_paridade_transporte.py`);
- **ZERO** delas está em `O JOGO RECEBEU` ou `O JOGO REAGIU`. No mapa INTEIRO
  (311 linhas × 2 transportes) também são **zero**;
- **ZERO de 227** ensaios do caderno preenchem a coluna `ponte`. Nenhum ensaio
  desta casa diz sob que máscara foi medido.

**A correção que o mapa faz na sprint** (precedência 2 > 3): a §3.3 pede a
coluna do JOGO *"para cada linha"*, e para o áudio ela não existe por desenho da
própria escada — `hidraw` e `alsa-pipewire` andam para o aparelho, então **onze
das doze linhas de áudio terminam em `O APARELHO OBEDECEU`**. A única de áudio
cujo destino é o jogo é `audio.jack.deteccao`, porque o estado do plugue viaja
dentro do report do vpad. O documento diz, no lugar disso, qual é a pergunta
certa do som — *quem toca no nó daquele controle* — e mede que ela não tem
instrumento.

**Seis buracos com endereço**, dos quais três são achados novos:

1. `sink-input` não tem um único leitor: `grep -rF "sink-input" src/ scripts/`
   devolve **zero**. O espelho de `integrations/quem_ouve_o_microfone.py` para a
   saída — o instrumento que fecharia o degrau de entrada do alto-falante — não
   existe;
2. `integrations/sandbox_dos_lancadores.py` lê `devices=` e **não lê `sockets=`**
   (`grep -c "sockets"` = 0). O controle entra na caixa do Flatpak; ninguém sabe
   se o som entra;
3. o **jogo direto não tem estrada**: `grep -rF` por `environment.d`,
   `/etc/profile.d` e `set-environment` em `src/ scripts/ assets/ install.sh`
   devolve zero nas três. Um binário nativo aberto do terminal não recebe o
   ambiente por caminho nenhum;
4. o interruptor do **acelerômetro** é cobrado pela linha do giroscópio: o
   `DO_APARELHO` de `scripts/check_cabo_bt_perfil_controle.py` mapeia o gesto
   `sensor` só para `movimento.giroscopio`, e a tela oferece dois interruptores;
5. a máscara **Nintendo Pro** não é degrau de `integrations/ponte_escada.py` —
   escolhê-la desliga a escada, e isso não estava escrito em lugar nenhum;
6. nenhuma medição desta casa foi feita com quatro controles.

**Três contradições entre o aparelho e o mapa** (e o aparelho ganha), todas da
folha de 09/09 com a orelha dela: o pré-amplificador diz `aciona = sim` e não
altera nada audível; três das quatro rotas do `OUTPUT_PATH_SEL` saem mono no
fone; e o volume do microfone, que a célula diz `não` por decisão, **obedece** —
o que decide a MIC-VOLUME-02 em vez de contradizê-la.

**Cinco células que o caderno já ultrapassou**, propostas no documento com a
prova ao lado (três do rádio subindo a `O APARELHO OBEDECEU`, uma a `MONTOU`, e
o `aciona` de `audio.alto_falante` no rádio, que **não se muda sozinho**: ele
espera o negativo de rota e o teste cego, por disciplina).

**Sete gestos para a bancada dela**, ordenados pelo que desbloqueia mais, com
tempo e número de controles. Eles não repetem os sete de
`docs/process/sprints/2026-09-10-OS-GESTOS-QUE-SO-ELA-PODE-FAZER.md`, que são da
direção de saída — estes são a coluna do JOGO, que nenhum deles cobre. **Se o
tempo der para só um, é o J1**, o touchpad dentro do jogo no rádio: é o único
que pode DERRUBAR a leitura mais confortável desta casa, a de que o repasse ao
vpad basta.

## Qual mordida prova

Duas, e as duas com a cura arrancada e devolvida.

**1. O número central é medição, não um zero digitado.** Um contador
independente (`scratchpad/contar.py`, fora da árvore) lê o mapa e conta as
células cujo destino é o jogo e as que já estão num degrau de jogo.

    COM A CURA (o mapa de verdade):
      celulas=48 destino_jogo=18 ja_no_degrau_do_jogo=0 | mapa_inteiro=0

    MORDIDA — uma CÓPIA do mapa, no scratchpad, com `movimento.giroscopio.jogo`
    levado a `O JOGO RECEBEU` no cabo:
      celulas=48 destino_jogo=18 ja_no_degrau_do_jogo=1 | mapa_inteiro=1

    git status --short docs/data/mapa-controles.csv  ->  (vazio: intocado)

O zero vira um quando UMA célula sobe. Se o contador fosse cego, os dois lados
dariam o mesmo número.

**2. A régua que guarda esta entrega reprova o documento.** O portão
`referencias-docs` é quem impede um documento de citar arquivo que não existe.

    COM A CURA:
      OK: 924 documento(s) sem referência morta.   rc=0

    CURA ARRANCADA (acrescentei ao documento uma citação a
    `integrations/quem_toca_no_alto_falante.py`, que não existe):
      docs/process/2026-09-11-A-AUDITORIA-DO-SOM-E-DO-GIROSCOPIO.md:518:
        integrations/quem_toca_no_alto_falante.py  [arquivo]
      rc=1

    CURA DEVOLVIDA:
      OK: 924 documento(s) sem referência morta.   rc=0

Ela acusou o MEU arquivo, na MINHA linha, com o nome que eu inventei.

## O que NÃO verifiquei

- **Nada foi medido no aparelho.** A bancada estava LIVRE e não foi reservada: a
  sprint declara `bancada: false`, e o documento não fecha degrau nenhum. As
  duas matrizes e as propostas de célula são leitura do mapa, do caderno e do
  fonte desta árvore.
- **Nenhum jogo foi aberto.** As três colunas de Steam · Heroic · jogo direto
  dizem «não medido» porque ninguém mediu — e não por falta de instrumento em
  quatro das seis linhas.
- **A Steam, o Heroic e o jogo direto foram lidos no CÓDIGO**, não exercitados.
  O que afirmo do caminho de cada lançador é o que os módulos que o fazem dizem,
  mais as medições de disco de 09/09 que eles citam.
- **Não confirmei se falta a permissão de som do Flatpak** em algum dos cinco
  lançadores dela. O que está medido é que o **produto não olha** para ela.
- **Não rodei a suíte inteira**, e não abri janela nenhuma: esta sprint não toca
  tela. Rodei `bash scripts/portoes.sh` completo.
- **O Pro Controller e o 8BitDo ficaram fora das matrizes** de propósito (a tela
  é dos quatro DualSense, decisão dela de 06/09). Onde eles importam — o
  giroscópio nativo do Pro passando direto ao jogo — está na §5 do documento.

## O que sobrou para o próximo

1. **O instrumento que falta é um só, e o molde já existe.** O espelho de
   `integrations/quem_ouve_o_microfone.py` para a SAÍDA: ler os fluxos de saída
   do PipeWire, tirar o PID de cada um, descartar os nossos com
   `descende_do_hefesto` e perguntar se algum é da árvore do jogo. **Mas o J3 da
   lista vem ANTES** — ele diz se vale escrever o instrumento ou se o problema é
   de rota.
2. **Um fato caducou dentro do `src/`, e não é da minha posse.** Um comentário
   de `src/hefesto_dualsense4unix/interface/pacotes/a02_controles.py` afirma que
   *"não há método de sensor nos 39"*, medido em 01/09. O `sensor.set` existe,
   está registrado em `src/hefesto_dualsense4unix/daemon/ipc_server.py` e aceita
   `{uniq?, giroscopio?, acelerometro?}` — ele nasceu em 04/09 com a
   SENSOR-DE-VERDADE-01. Quem tocar naquele arquivo substitui.
3. **A coluna `ponte` do caderno é uma decisão de processo, não de código.**
   Enquanto os ensaios não disserem sob que máscara foram feitos, nenhum deles
   pode ser relido como prova sobre máscara — e as duas perguntas que a máscara
   decide não têm como ser respondidas por arquivo nenhum. Quem despachar a
   próxima bancada pode fechar isso pedindo a coluna.
4. **O acelerômetro merece linha própria na régua das quatro perguntas**
   (`DO_APARELHO`, em `scripts/check_cabo_bt_perfil_controle.py`). É uma entrada
   de dicionário, e o mapa já tem a chave.
5. **A SOM-BOTOES-01, que corre nesta mesma leva, tem a medição que precisa** —
   três das quatro rotas fazem a mesma coisa no fone, com as palavras dela no
   ensaio `folha-rota-todas-mono-no-fone-cabo-0909`. Está na §8.2 do documento.
