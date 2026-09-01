---
cria: nenhum módulo — este documento entrega o bastão
---

# ONDE PARAMOS — 31/08/2026: o app de dev anda sozinho, e as réguas que calaram

**A porta de entrada de hoje.** Se você só tem dois minutos, leia estas três
linhas:

1. **O app de dev funciona sem o estável.** Ela desinstalou o Hefesto estável, e
   o app de dev parou na hora. A premissa que sustentava isso estava escrita e
   caiu; a camada de máquina virou biblioteca própria e os dois instaladores a
   sourceiam. **Conferido nesta máquina agora:** grupo `hefesto` existe com ela
   dentro, `/dev/uhid` é `crw-rw----+ root hefesto` (nascia `crw------- root
   root`), e a única unit no ar é a `hefesto-dev-dualsense4unix.service`.
2. **O botão de ligar da tela nova liga de verdade** e lembra entre reinícios.
   Antes era desenho: `listeners=0` nos quatro botões.
3. **Quatro réguas desta casa deram verde sobre nada hoje**, cada uma de um jeito
   diferente. É o padrão que a casa já nomeou — *a régua desliga quando o alvo
   não está lá, e desliga calada* — e três delas foram achadas por agentes
   independentes que não sabiam um do outro.

**O dia em número:** 5 commits, 66 arquivos, +10.377/−2.562
(`git diff --shortstat 58e86a9b..HEAD`). Portões: **22 rápidos, TODOS VERDES**,
medidos nesta árvore às 13h40, em ~23 s.

---

## 1. A premissa que caiu: o app de dev dependia do estável

Palavra dela: *"eu desinstalei a versão antiga e vamos deixar só a dev."*

O cabeçalho do `install-dev.sh` dizia desde 29/08, com todas as letras, que *"o
app de dev DEPENDE do Hefesto estável para essa camada"*. Sem o estável, ninguém
instalava udev, grupo `hefesto`, broker, resiliência do bluetoothd nem a ponte
privilegiada.

**O sintoma foi o de sempre nesta casa: a AUSÊNCIA de dado.** `/dev/uhid` nascia
de root, o daemon caía para uinput em silêncio (`vpad_degradado
motivo=uhid_indisponivel`), e o teclado virtual não abria (`[Errno 13]`). Nada
disso era erro. Era aviso, no meio do log.

**A cura não foi duplicar.** As onze curas de HOST saíram do `install.sh` para
`scripts/lib/camada_de_maquina.sh` (919 linhas), que os DOIS instaladores
sourceiam. O `install-dev.sh` ganhou `--camada-de-maquina`. Conferido: a função
`instalar_camada_de_maquina` tem **11 passos e 11 chamadas**, e o portão proíbe
que o `install.sh` a chame — chamá-la daria as onze por servidas e o portão
viraria decoração.

### O defeito de anos que apareceu porque ganhou nome

O agente de pareamento BT (ONDA-R) era **código de topo do lado NATIVE** do
`install.sh`: a cerca abre na linha 1192, o `exit 0` está na 1309, e ele morava
na 2070. Quem instalava por flatpak, appimage ou deb saía **sem ele** — e todo
bond novo nascia meio-salvo (`Paired: yes / Bonded: no`) e sumia.

**Por que escapou anos ao portão, e a razão é de FORMA:** o portão ancora no
sufixo `_host`, e um bloco solto não tem nome. Virou `install_bt_agent_host` e o
portão acusou a falta **no mesmo minuto**.

### E um portão quebrou EM SILÊNCIO

`test_install_garante_deps_em_qualquer_familia` continuou **verde medindo um
canônico a menos**. O `run_pkg bt-agent` saiu do `install.sh` junto com a função,
a derivação parou de enxergá-lo, e o teste deixou de cobrar a linha dele na
tabela de pacotes. De 7 para 8 nomes.

`tests/unit/fonte_do_instalador.py` nasceu como fonte única para os 13 portões
que liam o `install.sh` e procuravam o que agora vive na lib.

---

## 2. As dez abas, e o botão que virou botão

### O botão que não ligava

Ela: *"não sei se o botão de ativar ele na interface tá funcionando"* / *"eu
quero é que ele funcione na interface e se lembre"*.

Medido antes de escrever uma linha: **`listeners=0`** nos quatro botões da
fileira de modos. Não faltava IPC — `gamepad.emulation.set` existe, persiste e é
respeitado. Faltava a metade **escritora**. Agora
`src/hefesto_dualsense4unix/app/actions/jogar/painel.py` tem
`ESCRITOR_DOS_MODOS`, `plano_do_modo` (que delega, sem uma linha de regra
própria) e `modo_lembrado`.

**Conferido ao vivo, com o daemon de dev no ar:** `modo_lembrado()` devolve
`Lembranca(ligado=False, mascara=None, frase='Está gravado como DESLIGADO de
propósito…')`. A máquina está como ela deixou.

### Sete frentes do olho dela

| O que ela viu | O que era, medido |
|---|---|
| A aba Controles quebrada | **três** defeitos, nenhum no CSS comum: colisão de nome de classe (`margin-left:auto` em coluna DESLIGA o stretch — 186px viraram 99, deslocados 87px); a linha do Microfone pedindo 292px numa moldura de 242 (**49,4px pintados fora**); quatro das cinco colunas em pixel fixo. Vazamentos **4 → 0** |
| *"as linhas divisórias em todas as páginas tão invisíveis"* | a faixa estrutural ia de **1,21:1 a 4,89:1** na mesma tela. Agora uma variável só, `--linha:#53576f` — **2,01:1**, o meio exato em luminância entre os dois valores que ela julgou. Conferido à mão sobre o painel `#282a36`: **2,008**. Iluminação: 470 → 326 bordas |
| O Perfil de Bateria "feio" | não era cor: **58px de painel vazio**, 38% do bloco, o único vão da aba |
| A Vibração apertada | quatro das sete faixas com **zero** folga acima e dez abaixo — a divisória era `::before` com `top:0`. Custo da cura em altura: **zero** |
| Os glifos L2/R2 sumidos | saíram na leva não commitada de 30/08, que levou junto o `GL = 36` e o `import glifo` — os dois sem um único chamador. É o `a-casa-sabe-e-o-produto-nao-faz` |

**Independente, hoje:** medi as dez abas com Playwright a 1920×1080 (a janela
nasce com 1180px dentro) procurando descendente que ultrapassa a moldura, fora de
contêiner que rola e fora de posicionamento absoluto: **zero vazamento nas dez**.
Confirma o commit `f7c6c199` com régua diferente da dele.

---

## 3. As decisões dela de hoje — cada uma resolveu uma confusão real

1. **O "Automático" da escada SAI.** Não tinha leitor nem escritor. Conferido: o
   único "Automático" que sobrou em `layout/` é a lápide em `01-jogar.html` que
   conta que ele saiu. E isto **fecha** a contradição aberta em 28/08 — o
   `10-perfis.html` não o anuncia mais.
2. **"Os controles da mesa" vira "Conectados".** Palavra dela. Conferido: a frase
   antiga não existe mais em `layout/` nem em `src/`.
3. **O Modo de conexão vira dois níveis.** Nasceu da pergunta dela: *"qual a
   diferença de nativo pra dualsense?"* — interruptor **Hefesto Ligado/Desligado**,
   cinco modos dentro (Sony DualSense, Xbox, Steam Input, Point And Click,
   Navegação) e o **Modo Nativo** do lado desligado. O degrau **Xbox**, que é o
   SEGUNDO que o produto tenta, nunca tinha chegado à tela.
4. **Os algarismos saem dos modos.** A tela escrevia "③ Steam Input", o produto o
   tenta em **quarto**, e a legenda prometia que o número era
   `indice_do_degrau + 1`. Os três não podiam estar certos. A ordem passou a
   viver na dica de cada modo.
5. **O botão "Liberar" do microfone fica fora**, mesmo existindo no produto — ver
   a §4.

---

## 4. Os erros do dia, sem cerimônia

### 4.1 O "Liberar", e é a lição do dia sobre MÉTODO

A `2026-08-30-RETOMADA-o-estado-real-e-o-que-fazer.md` afirmava que o botão
"Liberar" do microfone *"não existe em lugar nenhum"* e mandou tirá-lo.

**A afirmação é falsa.** `app/widgets/controller_card.py:490` define
`TEXTO_BOTAO_MIC_DEVOLVER = "Liberar"`, a `:2026` o usa com dica própria, e
`daemon/ipc_server.py:32` declara `mic.set {muted: bool|null}` — o `null` que
devolve a posse ao kernel. O botão existe, tem IPC e tem texto.

**O preço foi pago:** a sprint mandou tirar, a sessão seguinte tirou, e **quatro
réguas** passaram a reprovar procurando um endereço que ninguém escrevia mais.

**Levado a ela com a medição, ela MANTEVE a decisão.** O que caducou é a
justificativa, não a escolha — e a diferença importa: o princípio ("botão sem
dono no produto não vai para a tela") continua de pé; o exemplo que o ilustrava
era o caso errado.

**A lição é sobre o ENUNCIADO:** ela falou do que via na TELA, e quem escreveu
generalizou para o CÓDIGO sem medir. Uma frase sobre a tela não é uma afirmação
sobre o produto — e `grep` custa dez segundos. A RETOMADA já está corrigida no
lugar, com data.

### 4.2 A minha régua deu verde sobre catorze dropdowns que nunca tocou

Montei uma validação de tela que percorria as dez abas e relatava **"2 selects
exercidos"** — em **todas as dez, igual**. Ela clicava na aba ANTES de mexer nos
dropdowns, e o alvo sumia debaixo dela; o que sobrava eram os dois que a troca de
aba não engolia.

**Medido hoje com Playwright, aba por aba:** a Gatilhos tem **16** selects, todos
visíveis ao abrir. A Navegação declara 57 e mostra 8. A Conexões declara 16 e
mostra 0 (nascem dentro de cartão fechado). Somando as dez: **27 visíveis na
abertura**, não 20.

A régua deu verde sobre **catorze** dropdowns da Gatilhos que nunca clicou. É a
forma exata que esta casa já nomeou: *a régua desliga quando o alvo não está lá,
e desliga calada*. A validação que fechou o dia, refeita, exercitou **43 selects
e 278 cliques** nas dez abas.

### 4.3 A cegueira do portão do mapa, medida TRÊS vezes no mesmo dia

Três agentes independentes chegaram à mesma conclusão sem saber um do outro: o
`scripts/check_paridade_transporte.py` é **cego ao CONTEÚDO** de `*_offset`,
`*_report_id`, `*_evidencia`, `*_ressalva`, `*_comando`, `*_detalhe`,
`fonte_externa` e `nota` — onde mora quase toda a prosa do mapa.

**A prova é dura.** Células gravadas hoje foram estragadas de forma **plausível**
— o report id do rádio do DualSense numa linha do vpad do Pro, o `bat_con` do
SN30 deslocado um byte, o byte 11 do LED virando 47 — e o portão passou com
**rc=0** em todas. O controle positivo (valor fora do domínio, data ilegível)
reprovou com rc=1: a régua está viva, a cegueira é localizada e estrutural. As 16
regras liam `aciona`, `de_onde_sei`, `canal`, `existe`, datas e domínios.
**Ninguém lia o número.**

Nasceu a **regra 19** (`lado-sem-regua`): lado com `aciona` respondido + coluna de
conteúdo escrita + `*_de_onde_sei` daquele lado VAZIO. Ela **nasce em zero** — a
versão irrestrita acharia 4, todas em linhas com `aciona` vazio nos dois lados,
que é buraco de censo. **Ela cura um dos quatro estragos.** Os outros três
continuam passando, e está escrito porque fingir o contrário é pior.

### 4.4 As 762 citações do mapa não tinham régua — agora têm

Decisão dela. O `docs/data/mapa-controles.csv` carrega **762** citações
`arquivo:linha`, e nenhuma tinha portão. Uma citação que aponta para a linha
errada depois de um refactor vira afirmação forte e falsa — e é o defeito que
sustenta toda substituição de fato desta casa, porque `FATO ERRADO, SUBSTITUÍDO`
sempre cita um endereço.

O `scripts/validar-citacoes-de-linha.py` já fazia isso, mas varria só
`docs/protocol/` (13 documentos, 123 citações) e **recusava o CSV até quando
nomeado**. Agora alcança as planilhas. Rodado nesta árvore agora: **903 citações
conferidas, 221 ignoradas, 104 ms**. Zero apontam além do fim.

Três coisas que ele ensinou no caminho:

- **Correção de medição:** o enunciado dizia 518 citações resolvendo para esta
  árvore; são **723**. A diferença é o `assets/dkms/` — 208 citações são das
  cópias de driver que a casa versiona.
- **A forma curta `:N` ficou de fora por MEDIÇÃO, não por precaução.** Ampliada de
  propósito, ela produziu **nove acusações falsas** no mapa de hoje: duas eram
  faixas do `hid-nintendo.c` resolvendo contra um arquivo nosso de 402 linhas, e
  as outras estavam ancoradas na palavra "canônica". Uma hora de relógio na prosa
  ("a das 01:51:25") daria `:51` e `:25`. **Portão que grita falso é portão que se
  desliga.**
- **Prova acidental:** às 13h25 ele pegou, ao vivo, um
  `backend_pydualsense.py:99993` que outro agente tinha plantado para testar a
  própria mordida.

---

## 5. Os canais de rádio — o que entrou no mapa, e o que ele ainda não sabe

Duas rodadas de workflow com fontes externas, nove por agente e três céticos por
proposta. **68 propostas, 24 sobreviveram — 65% refutadas.** *(Estes três números
são a contagem de quem coordenou a leva; não há artefato versionado que os
confirme. O que segue abaixo eu medi contra o CSV.)*

**Medido, comparando `8fd32ba5^` com `8fd32ba5`:**

- **18 linhas** do mapa mudaram, **77 células** ao todo.
- `fonte_externa` foi de **5 para 21** linhas preenchidas.
- **O mapa NÃO está completo.** Contando as linhas com rádio no `transporte` e
  `existe = tem` (**73** linhas), as que ainda têm pelo menos um buraco em
  `radio_report_id`, `radio_offset` ou `radio_evidencia` caíram de **35 para 29**.
  Todas as 29 já foram tentadas por esta leva. Uma terceira rodada, com fontes
  inéditas, estava rodando quando este documento fechou.

### O achado maior: o payload de áudio do DualSense por rádio

Duas fontes externas descrevem, byte a byte, quadros **Opus** dentro do report
`0x39` (547 B) da escada de OUTPUT. Isso responde na FONTE uma pergunta aberta
desde 16/08 — e responde **só na fonte**.

**Três ressalvas viajam com o achado, e nenhuma é enfeite:**

1. **As duas fontes DIVERGEM** sobre o mesmo report: uma põe Opus em `[142..341]`
   e `[342..541]`, a outra em `[13..412]`. E a segunda **não é testemunha
   independente** — ela cita a primeira. O mapa ganhou **dois candidatos**, não
   uma resposta.
2. **O alto-falante interno é MONO**, medido em 16/08 no ensaio
   `sfx-tres-saidas-quatro-canais`; o encoder da fonte é **estéreo**. O estéreo
   casa com a rota de **fone**, não com o alto-falante — e `medido` ganha de
   `inferido-do-codigo` na régua desta casa.
3. **Ninguém desta casa mandou um byte de áudio** por nenhum dos dois arranjos. O
   levantamento diz o FORMATO do payload, não que o produto consiga tocá-lo.

Nenhum grau subiu na linha. `radio_aciona` continua `não`. Uma troca de
`radio_canal` para `hidraw` foi **proposta e recusada** na conferência, citando a
doutrina da própria linha (falácia do canal que responde) — é decisão dela.

### Duas células mentiam com números verdadeiros

Citavam medição real desta casa, **no recorte errado**: uma trocava cabo por
rádio; a outra usava contadores de uma janela de 19 h para um link que durou parte
dela. Substituídas, não duplicadas — a regra dela de 11/08.

---

## 6. O que fica ABERTO e espera a palavra dela

- **Point And Click e Navegação não têm dono.** Conferido: `ponte_escada.ESCADA`
  tem **quatro** degraus (DualSense, Xbox, Nativo, Steam Input). `chips_sem_dono()`
  devolve hoje **só** `pointclick` — a Navegação tem escritor, mas não é degrau da
  escada. Os dois chegaram à tela por decisão dela; quem os aplica ainda não
  existe.
- **A contradição do clone do 8BitDo por rádio, em modo Switch.** Duas páginas da
  casa se contradizem e as duas não podem estar certas: uma diz "endereços
  Bluetooth diferentes em cada modo (**medido nesta bancada**)"; a canônica, em
  nota datada que se declara válida para o rádio, diz que "neste adaptador **não
  há bond do 8BitDo em modo Switch**". A célula do mapa **relata em vez de
  escolher**. O conserto custa **um pareamento novo** — é dela.
- **17 citações do mapa apontam para arquivo NOSSO e ficam fora do portão** só
  porque o caminho não foi escrito (`led_control.py` sem o `core/`, e mais sete).
  Nenhuma está errada hoje; cada uma ganha portão com um conserto de uma linha.
- **Uma aba ainda vaza numa janela estreita.** A 1180px de **viewport** (janela
  menor que a que o produto abre), a Navegação passa **19px** da moldura no
  `.campo-num`; a Controles passa 2–3px, que é arredondamento. A 1920 as dez estão
  limpas. Decidir se a janela estreita é caso de suporte.
- **O `CLAUDE.md` está desatualizado no número dos portões:** diz "26 portões" e
  "`--rapido` faz 19 em 5 s". Medido hoje: **22 rápidos** (~23 s) e **29 portões**
  ao todo, mais a suíte. O arquivo é `.gitignore:90` e não viaja para árvore de
  agente — quem tiver a mão nele, corrija.

---

## 7. O que só a BANCADA resolve

Nenhum portão sem hardware e sem rede fecha estes. É a mão dela.

1. **`som-no-radio-observado-nao-replicado`** (16/08, `olho-dela`,
   `inconclusivo`). Repetir com a orelha dela, quatro minutos. O achado do Opus dá
   uma explicação **plausível** para as quatro tentativas negativas — plausível não
   é provado.
2. **Mandar áudio pelos dois arranjos do `0x39`** e ver qual (se algum) toca. É o
   que decide entre os dois candidatos.
3. **Parear o 8BitDo em modo Switch** e ler o endereço. Resolve a contradição da
   §6 e diz se as regras udev, que casam por `HID_UNIQ`, mudam de alvo sem avisar.
4. **Os três estragos que a regra 19 não pega.** Nenhuma régua desta casa diz que
   o byte é 11 e não 47.

---

## 8. Os comandos que não envelhecem

```bash
git log --since=midnight --format='%h %s'   # o que esta casa fechou hoje
git worktree list                           # as árvores e suas branches
bash scripts/portoes.sh --rapido            # 22 rápidos, ~23 s
bash scripts/portoes.sh                     # os 29, ~2 min
hefesto-chave status                        # os dois Hefestos
```

**A suíte roda em OITO LOTES, nunca inteira** — ela cria nós uinput de verdade e
já derrubou a sessão gráfica dela.

**Para falar com o daemon de dev, a variável é obrigatória:**

```bash
HEFESTO_VARIANTE=dev .venv/bin/python src/hefesto_dualsense4unix/interface/controles_vivos.py \
    --oculta --segundos 3 --foto /tmp/x.png
```

Sem ela, a tela responde "Errno 111".

---

## Nota de método — as divergências que este documento teve de corrigir

Esta casa mede antes de repassar, e hoje três números do enunciado que encomendou
este documento não bateram com o CSV:

- **"73 células gravadas em 18 linhas"** → são **77** células em 18 linhas. O 73 é
  o número de LINHAS de rádio do mapa (`transporte` com rádio e `existe = tem`);
  os dois se cruzaram.
- **"30 das 67 linhas de rádio ainda têm buraco (eram 37)"** → com a definição
  acima são **29 de 73** (eram 35). Nenhuma combinação de filtro e coluna que
  tentei reproduz 37 → 30, então a definição usada lá não está escrita em lugar
  nenhum — e por isso a minha está, na §5, para a próxima pessoa remedir.
- **"um portão para as 762 citações está sendo escrito agora"** → **já está
  pronto e commitado** (`79441567`), na camada rápida, nascido em zero.

E uma correção do próprio dia, que vale registrar: o commit `79441567` diz "zero
linha nova no `portoes.sh`". É verdade **para a lista de portões** — as 6 linhas
que ele acrescentou são comentário. A contagem seguiu 29.
