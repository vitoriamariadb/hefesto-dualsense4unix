# ONDE PARAMOS — 10/09/2026: o som saiu pelo rádio, e a ponte foi fiada

> **A frase do dia é dela, e ela mede a distância que a casa andou:**
> *"Como vc é o primeiro que fez o microfone funcionar e o som também."*
> <!-- noqa-acento: citação literal dela -->

## §0 — O estado, em uma linha

**O DualSense toca som pelo rádio, o microfone parou de cair, e a ponte que faz
isso é construída pelo produto — uma por controle.** `casa-sabe` verde.

## §1 — As três coisas que fecharam, e as três eram antigas

### 1. O som SAIU pelo rádio — report `0x35`

**A casa procurava no degrau errado.** Nove passadas bateram no `0x39` (547 B,
dois quadros), que a comunidade documentava e que **aceita** o pacote — e não
toca. É a *falácia do canal que responde*: o aparelho aceitar não quer dizer
que era ali.

O certo é o `0x35`: 334 B, **UM** quadro Opus de 10 ms, tag `0x13`, cadência
**512/48000 = 10,667 ms** (93,75 reports/s, não 100), CRC-32 LE seed `0xA2`.
Setenta segundos com a orelha dela, sem um corte.

**E o achado já estava na casa.** A leva de agentes de 31/08 registrou
`0x35 com 334 (CRC em 330..333)` no achado [8.19]. O que falhou não foi a
descoberta — foi o que a casa fez com ela.

### 2. O microfone parou de cair, e o teclado fantasma acabou junto

`BT-MIC-GATING-01` estava aberto desde agosto **com o suspeito errado
registrado** (o nosso daemon escrevendo a 60 Hz). A causa real é do kernel:

> Um quadro de microfone por Bluetooth chega com o **mesmo `reportID` `0x31`, o
> mesmo tamanho de 78 B e um CRC válido** que um report de gamepad. **Só o bit
> 1 do byte 1 os separa** — e o `hid-playstation` não o consultava.

Consequência dupla, e ninguém tinha ligado as duas: o driver via borda falsa no
bit de mudo sobre payload Opus e **desligava o microfone sozinho** aos ~1,1 s;
e injetava eixos e botões que ninguém apertou — *"o teclado maluco"*.

**UMA LINHA curou as duas.** `patch/0003`, `if (data[1] & DS_INPUT_BT_FLAG_AUDIO)
return 0;`, instalado por DKMS. Medido antes e depois: **1231 transições do bit
viraram UMA**. Palavra dela: *"nao ficou maluco e nao desligou"* <!-- noqa-acento: citação literal dela -->

**Esta casa sabia a resposta em Python desde 16/08** (`INPUT_FLAG_AUDIO`,
PS-PRESO-01). *Uma casa que sabe a resposta numa metade e a esquece na outra
paga o defeito inteiro do mesmo jeito.*

### 3. A ponte deixou de ser peça sem chamador — SOM-FIADO-01

`PonteDeSomPorRadio` nasceu de manhã com teste, régua e o report certo, **e
nenhuma linha de produção a construía**. À tarde: a fábrica por controle no
`AltoFalanteSubsystem`, o subsystem no daemon nas três pontas, e a guarda
**«sem rota, sem nó»** que impede o `module-null-sink` mudo de nascer.

A sprint está em
[SOM-FIADO-01](sprints/2026-09-10-SOM-FIADO-01-a-ponte-por-controle-sobe-em-producao.md);
a fila que ela abre, em
[A MESA DE QUATRO, COMPLETA](sprints/2026-09-10-A-MESA-DE-QUATRO-COMPLETA-INDICE.md).

## §2 — As armadilhas deste dia, e são CINCO

1. **`MONTOU` lido como pronto.** A peça existia, tinha teste e régua, e não
   era ligada. O portão `casa-sabe` acusava, e nove lápides `_SEM_CAMINHO_HOJE`
   morreram de uma vez quando a fiação chegou.

2. **A SUÍTE ESTAVA FALANDO COM O CONTROLE DELA.** Registrar o subsystem fez
   `controles_na_lista()` varrer `/sys/class/hidraw` de verdade dentro de todo
   teste que sobe um `Daemon` — e a primeira corrida abriu o hidraw do DualSense
   dela e subiu uma ponte de som. Curado com a fixture
   `_nenhum_hidraw_vivo_na_varredura_de_som`, irmã da que já fazia isso para o
   vpad. *Afirmação sobre aparelho se mede na bancada, nunca na suíte.*

3. **Um default de função média o mundo do import.**
   `nos_dualsense_bluetooth(raiz = _SYSFS_HIDRAW)` congelava a raiz no import,
   então apontá-la para outro lugar não alcançava a função. É a *régua que mede
   o mundo de ontem*, e é reincidente nesta casa.

4. **Um dublê mais POBRE que o produto.** A cura da sustentação acrescentou dois
   campos ao estado da borda do mic, e o `_handle()` do teste os redigitava à
   mão: sete testes caíram com `AttributeError`. Curado com um dono único,
   `zerar_estado_da_borda_do_mic`, que a suíte chama.

5. **Um ponteiro de 64 bits truncado a 32 numa thread.** `opus_encoder_ctl` é
   variádica, logo sem `argtypes`; o ctypes passa `int` do Python como C `int`.
   Na thread principal o heap fica abaixo de 4 GB e passa por sorte; **na thread
   de trabalho o glibc aloca numa arena acima de 4 GB e o processo INTEIRO cai
   com SIGSEGV**. A `PonteDeSomPorRadio` é a primeira coisa desta casa a
   construir o codificador dentro de uma thread — o defeito nasceu junto com ela.

## §3 — O que é DELA, e não de agente

1. **O negativo de rota e o teste cego** do som. É o que falta para
   `audio.alto_falante@dualsense` sair de `radio_aciona: não` — e a célula fica
   como está até lá, por disciplina e não por dúvida.
2. **A mesa de QUATRO com tudo ligado**, que nunca foi medida (sprint C1).
3. **A decisão da banda (C2)**, se três microfones mais três canais de SFX
   estourarem o adaptador. O mapa já avisa que o orçamento é do ADAPTADOR.

## §4 — O próximo comando

```bash
cd /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix
git log --since=midnight --format='%h %s'
```

A próxima sprint é a **A2 (SFX-POR-CONTROLE-01)**: cada nó já tem nome e rota
próprios; falta provar que o tiro do P2 não sai no plástico do P1.
