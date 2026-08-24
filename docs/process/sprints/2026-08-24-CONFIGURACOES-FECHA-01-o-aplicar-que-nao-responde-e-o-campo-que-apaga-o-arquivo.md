# CONFIGURAÇÕES-FECHA-01 — o Aplicar que não responde e o campo que apaga o arquivo

**24/08/2026. GRAU: MEDIDO**, exceto onde a linha diz DESENHO ou NÃO VERIFICADO.
Onda 1 da leva das onze abas — a primeira a rodar, e o **piloto do formato**.

**Nota de escopo, e ela muda o título.** Os dois defeitos do nome desta sprint
foram consertados HOJE, entre o reconhecimento e este plano: o "Aplicar" mudo em
`22fe36a` e o campo inválido que apagava o documento inteiro em `9848c41`. O
nome fica — é o endereço pelo qual a fila conhece esta onda — mas **nenhuma
tarefa abaixo os refaz**. O que sobrou, e o que esta sprint fecha, é maior que os
dois.

**O que esta sprint fecha**

1. O `maquina.json` — o único lugar onde o produto aprende a topologia da casa —
   **nunca nasceu no disco de quem escreveu a aba**, e o produto não tem como
   saber disso.
2. Dos onze campos que a aba oferece declarar, **quatro não mudam nada em lugar
   nenhum do produto** e um deles não tem sequer escritor.
3. A aba pede 2465 px numa janela de 1080 — as três seções que **declaram**
   nascem abaixo da dobra.
4. As dicas: o `TOOLTIPS.md` desta leva declara duas afordâncias, e o CSS tem
   **zero**.
5. O elo com o mapa de canais: os quatro números que a aba publica na tela são
   constantes de Python sem lastro no CSV, e o CSV registra por escrito que o
   `README.md` publica números caducos.

**O que esta sprint NÃO faz**

- Não mede Bluetooth. É trilha dela (D2). O que esta aba não pode afirmar até lá
  está na seção 6.
- Não refaz o "Aplicar" nem o resgate campo a campo (feitos hoje).
- Não desenha a borda na cor do plástico (item 2 do
  [TODO-INTEGRACAO](2026-08-21-ABA-CONFIGURACOES/TODO-INTEGRACAO.md) — é da
  `ONDE-A-COR-MORA-01`).
- Não toca a fita do alvo. Esta aba se desqualifica do alvo de propósito
  (`ConfigActionsMixin.set_alvo_inativo`), e por isso **não depende da Z2** —
  é a única das onze nessa situação, e é o molde a copiar.

---

## 1. O defeito, em uma frase

**O Hefesto tem um caderno para anotar como a casa é montada, a aba inteira
existe para preencher esse caderno, e na máquina de quem a escreveu o caderno
nunca chegou a existir — nem em branco.**

---

## 2. O que está medido

Bancada: daemon vivo desde `Sun 2026-08-23 18:33:39 -03`. Régua de árvore: o
`src/` de hoje, no commit `7d38138`.

### 2.1 O caderno está vazio, e tudo que dependia dele está no escuro

```bash
.venv/bin/python -c "
from hefesto_dualsense4unix.utils.maquina import caminho_da_maquina, carregar_maquina
from hefesto_dualsense4unix.daemon.subsystems.bt_mic import uniqs_declarados
p = caminho_da_maquina(); m = carregar_maquina()
print(p, p.exists()); print(m.mesa.model_dump()); print(m.controles)
print(m.orcamento.model_dump()); print(m.ambiente); print(uniqs_declarados(m))"
```

```
/home/vitoriamaria/.config/hefesto-dualsense4unix/maquina.json False
{'altura_da_antena': None, 'linha_de_visada': None, 'radios': {}}
{}
{'teto': None}
None
frozenset()
```

E a segunda metade, no outro arquivo de configuração da janela:

```bash
cat ~/.config/hefesto-dualsense4unix/gui_preferences.json
# {"advanced_editor": false, "ambiente_corrigido": null, "rota_de_som_anterior": ""}
```

**Nenhuma das onze declarações que esta aba oferece foi feita uma única vez.** O
`ambiente_corrigido: null` não é escolha dela: é o valor que a camada de
preferências grava sozinha.

A consequência não é abstrata — são quatro caminhos vivos alimentados por vazio:

| fonte | consumidor | com o caderno vazio |
|---|---|---|
| `controles[*].microfone` | `uniqs_declarados` em `src/hefesto_dualsense4unix/daemon/subsystems/bt_mic.py:109` | a ponte de microfone nunca sobe para ninguém |
| `orcamento.teto` | `_orcamento_declarado` em `src/hefesto_dualsense4unix/core/rumble.py:105` | não há teto de vibração — a seção "Orçamento" é inerte |
| `mesa.radios` | a própria seção, `secao_mesa.py:939` | a coluna "O que é" fica só com o palpite do kernel |
| `mesa.altura_da_antena` | **ninguém** — ver 2.2 | — |

### 2.2 Quatro campos declaráveis sem consumidor de produção

Régua declarada, e ela foi provada acertando antes de eu acreditar no vazio
(rodei-a primeiro contra `microfone` e `teto`, que **têm** consumidor, e ela os
acusou):

```bash
for c in altura_da_antena linha_de_visada microfone teto; do
  echo "== $c"; grep -rn "$c" src/ | grep -v "utils/maquina.py"; done
```

| campo | escritor | quem relê para repintar a própria escolha | quem MUDA comportamento |
|---|---|---|---|
| `controles[*].microfone` | `secao_controles.py:1026` | `secao_controles.py:788` | `bt_mic.py:109` |
| `orcamento.teto` | `secao_orcamento.py` | `secao_orcamento.py:164` | `core/rumble.py:120` |
| `mesa.altura_da_antena` (`src/hefesto_dualsense4unix/utils/maquina.py:164`) | `secao_mesa.py:461` | `secao_mesa.py` | **NINGUÉM** |
| `mesa.linha_de_visada` (`src/hefesto_dualsense4unix/utils/maquina.py:165`) | `secao_mesa.py:474` | `secao_mesa.py` | **NINGUÉM** |
| `controles[*].modo` | `secao_controles.py` | `app/widgets/external_card.py:347` | **NINGUÉM** |
| `controles[*].botoes` (`src/hefesto_dualsense4unix/utils/maquina.py:206`) | `secao_controles.py` | `app/widgets/external_card.py:363` | **NINGUÉM** |
| `MaquinaConfig.ambiente` | **NINGUÉM** | **NINGUÉM** | **NINGUÉM** |

Dois desses são piores que "sem consumidor", porque a casa **escreveu a promessa
do consumidor**:

- o docstring de `MesaDeclarada` (`src/hefesto_dualsense4unix/utils/maquina.py:154-159`)
  diz que as duas escolhas existem *"para que o exame da mesa possa explicar um
  alcance ruim em vez de apenas medi-lo"*. `grep -n "maquina\|altura_da_antena\|
  linha_de_visada" src/hefesto_dualsense4unix/integrations/exame_da_mesa.py`
  devolve **zero linhas**. O exame nunca leu a declaração;
- o comentário de `MaquinaConfig.ambiente` diz que o campo *"informa só a
  mensagem de ajuda da bandeja"*. Quem grava a correção de ambiente é
  `gravar_correcao_de_ambiente` em `src/hefesto_dualsense4unix/app/ambiente.py:101`,
  e ele escreve `CHAVE_AMBIENTE` (`src/hefesto_dualsense4unix/app/ambiente.py:28`)
  no `gui_preferences.json`. O campo do esquema **não tem escritor nem leitor**.

É a família A-CASA-SABE-E-O-PRODUTO-NÃO-FAZ dentro da leva que a documentou, e
é o mesmo molde de `30b2d57` (`_refresh_config_controles` pendurado e ausente do
mapa que o chamaria).

### 2.3 O rodapé não diz que grava o que a aba declarou

A aba promete, cinco vezes, `QUANDO_VALE` (`src/hefesto_dualsense4unix/app/actions/config/moldura.py:46`):
*"A escolha passa a valer quando você clicar em 'Aplicar', no rodapé."*

O botão do rodapé (`btn_footer_apply`, `src/hefesto_dualsense4unix/gui/main.glade:4111`)
tem, na linha 4113:

> `Envia toda a configuração (gatilhos, LEDs, rumble, mouse) aos controles`

e a descrição acessível diz `Envia gatilhos LEDs rumble e mouse aos controles`.
**Nenhuma das duas menciona o que esta aba declarou** — e o encanamento está
inteiro do outro lado: `_gravar_declaracao_de_maquina`
(`src/hefesto_dualsense4unix/app/actions/footer_actions.py:272`) é a **primeira**
coisa que `on_apply_draft` (`:222`) faz. Quem só lê a dica conclui que o botão
não é para ela.

### 2.4 A dobra: 2465 px de página numa janela de 1080

```bash
.venv/bin/python -c "
import struct
for f in ('readme_configuracoes.png','readme_configuracoes_inteira.png'):
    d=open('docs/usage/assets/'+f,'rb').read(33)
    print(f, struct.unpack('>II', d[16:24]))"
# readme_configuracoes.png          (1920, 1080)
# readme_configuracoes_inteira.png  (1920, 2465)
```

A foto esticada ([readme_configuracoes_inteira.png](../../usage/assets/readme_configuracoes_inteira.png),
de 23/08 21h12, com o dublê de quatro controles) mostra o que a página pede:
**2,28 janelas**. Acima da dobra ficam "Está tudo certo?" e "Os controles".
Abaixo ficam **as três seções que declaram** — "A mesa" (altura da antena, linha
de visada, os rádios vizinhos), "Orçamento" e "A janela". A pessoa que abre a aba
para ver se está tudo certo vê o exame; a pessoa que precisa declarar a mesa
precisa saber que existe mais tela abaixo.

### 2.5 As dicas: duas afordâncias declaradas, zero implementadas

O [TOOLTIPS.md](2026-08-21-ABA-CONFIGURACOES/TOOLTIPS.md) fixa duas marcas —
sublinhado pontilhado e `?` em círculo. Na árvore de hoje:

```bash
grep -c "set_tooltip_text\|set_tooltip_markup" src/hefesto_dualsense4unix/app/actions/config/*.py
# 22 no total das cinco seções mais a moldura
grep -n "pontilhad\|dotted" src/hefesto_dualsense4unix/gui/theme.css
# (vazio)
grep -rn 'Gtk.Label(label="?")' src/hefesto_dualsense4unix/app/
# app/widgets/external_card.py:564
# app/actions/config/secao_mesa.py:552
```

**22 dicas, dois `?` na tela inteira, e o sublinhado pontilhado não existe em
lugar nenhum.** Vinte dessas dicas só aparecem para quem já passou o mouse por
cima sem motivo.

### 2.6 O elo com o mapa: quatro números sem lastro, e um caduco denunciado

A frase que a aba imprime abaixo dos cards —

> *"Com o microfone ligado, um controle no rádio troca 260,4 relatórios de
> entrada por segundo por 170,5 mais 106,2 quadros de áudio: 276,7 das 1600
> fatias daquele adaptador."*

— é montada por `frase_da_capacidade_do_mic`
(`src/hefesto_dualsense4unix/app/actions/config/secao_controles.py:436`) a partir
de `HZ_INPUT_SEM_MIC` (`src/hefesto_dualsense4unix/integrations/radio_da_mesa.py:120`)
e `SLOTS_POR_SEGUNDO` (`:111`). Os mesmos números estão medidos no CSV, na célula
`radio_ressalva` da linha `audio.microfone`:

```bash
.venv/bin/python -c "
import csv
r=[x for x in csv.DictReader(open('docs/data/mapa-controles.csv',newline='',encoding='utf-8'))
   if x['chave']=='audio.microfone'][0]
print(r['radio_ressalva'][:220])"
```

> *"Preço MEDIDO: mic desligado 260,4 Hz de input; ligado 170,5 Hz de input +
> 106,2 Hz de áudio. (…) E os números publicados de '55-75% de mudo / ~40% do
> sinal' estão CADUCOS (obtidos com um desmutador acidental no ar) — o README
> ainda os publica."*

Duas coisas nisso, e as duas são a F10 desta aba:

1. **não há elo.** `grep -rn "mapa-controles\|specs.html" src/` não devolve nada.
   Se alguém remedir o preço do microfone no CSV, a tela continua imprimindo o
   número velho, e nenhum portão reclama;
2. **o mapa já denuncia por escrito** que o `README.md` publica números que ele
   declara caducos, e eles seguem publicados.

E as duas seções que a aba tem e o mapa não conhece: as famílias do CSV são
`plataforma`, `luz`, `audio`, `combinacao`, `movimento`, `vibracao`, `gatilho`,
`entrada`, `identidade`, `energia`, `toque`
(`cut -d, -f1 docs/data/mapa-controles.csv | sed 's/\..*//' | sort | uniq -c`).
Não há família para topologia de mesa nem para teto de orçamento. A única linha
vizinha é `combinacao.adaptador_no_mesmo_controlador`.

### 2.7 O que esta aba já faz CERTO, e que as outras dez vão copiar

Registrado aqui porque é o motivo de esta onda ser o piloto, e porque apagá-lo
faria a próxima leva reinventá-lo:

- **a ponte sabe dizer não.** `machine_declare`
  (`src/hefesto_dualsense4unix/app/ipc_bridge.py:787`) usa `_safe_call` **de
  propósito** e traduz a recusa que vem no CORPO, não como erro de protocolo. O
  handler correspondente devolve `versao_desconhecida` / `falha_ao_gravar` /
  `declaracao_invalida`, e a frase de tela mora do lado da GUI. É exatamente o
  contrato que a Z1 quer para as outras sete abas — **já implementado, e o único
  do produto**;
- **a fila do "não sei" é resposta**, e desligar grava ausência em vez de `false`
  (`ControleDeclarado.microfone`, `src/hefesto_dualsense4unix/utils/maquina.py:208`);
- **o autostart é espelho, não segundo dono**: o interruptor de verdade vive na
  aba Sistema, e esta seção só reflete (`secao_janela.py:315`).

## 3. O que é hipótese

- **DESENHO:** que a cura da 2.1 seja fazer o caderno nascer sozinho. **Não é**,
  e o próprio `utils/maquina.py` explica por quê: todo campo do documento é uma
  DECLARAÇÃO — algo que só a pessoa sabe (a antena está acima ou abaixo da mesa,
  aquele dongle é do teclado ou da webcam, a chave física do 8BitDo). Gravar
  qualquer coisa sozinho é *"o default entrando disfarçado de escolha dela"*, que
  é o defeito que o módulo inteiro existe para recusar. A cura é o produto
  **pedir**, não adivinhar. Ver T3 e T12.
- **NÃO VERIFICADO:** as "11 curas arrancáveis sem nada ficar vermelho" que o
  reconhecimento reportou. Eu não refiz esse censo, e esta casa já provou três
  portões verdes cegos por mordida em 23/08
  ([AUDITORIA-DE-PERDA-01](2026-08-23-AUDITORIA-DE-PERDA-01-tres-portoes-verdes-que-nao-medem-nada.md)).
  O número entra na T10 como **pergunta**, nunca como fato.
- **NÃO VERIFICADO:** o custo de fazer "Tamanho do texto" valer na hora.
  `remove_provider_for_screen` não existe em `src/hefesto_dualsense4unix/app/theme.py`
  (só `add_provider_for_screen`, em `:221`), então é código novo de tamanho não
  medido. T14 mede antes de decidir.
- **NÃO VERIFICADO:** se `controles[*].botoes` deveria trocar o glifo dos botões
  em outras abas. O campo existe, ninguém o consome, e nenhuma decisão dela diz
  qual era a intenção. T1 pergunta; não presume.

---

## 4. A choreografia dos agentes

**Cinco agentes.** A1 abre sozinho porque produz a tabela de que A2, A4 e A5
dependem; os outros quatro correm em paralelo sobre arquivos disjuntos.

```
    dia 1                          dia 1-2                       fecho
    ┌──────────────┐
    │  A1  censo   │──── a tabela de consumo ──┬──> A2 ─┐
    │  do caderno  │                           ├──> A4 ─┼──> aceite
    └──────────────┘                           └──> A5 ─┤
    ┌──────────────┐                                    │
    │  A3  o mic   │────────────────────────────────────┘
    └──────────────┘   (independente: só toca secao_controles + o CSV)
```

| agente | o que faz | com quem colide | o que devolve |
|---|---|---|---|
| **A1 — o caderno** | T1, T2, T3, T4 | `utils/maquina.py`, `exame_da_mesa.py`, `main.glade` | a **tabela campo → consumidor** com o comando ao lado, e o portão que a prende |
| **A2 — comunhão com o specs** | T5, T6, T7 | `radio_da_mesa.py`, `docs/data/`, `README.md` | o pareamento constante↔célula do CSV, e a proposta **D-M** para ela |
| **A3 — o microfone** | T8, T9 | `secao_controles.py` só | o que a tela pode e não pode afirmar sobre a ponte, com a célula do CSV citada |
| **A4 — a mordida** | T10, T11 | `tests/` só | a lista **refeita** de curas arrancáveis, com a régua declarada e provada acertando |
| **A5 — a tela** | T12, T13, T14 | `theme.css`, `moldura.py`, `secoes.py` | as fotos antes/depois e o que ficou para o olho dela |

**Regras da choreografia, e as três nasceram de estrago real desta casa:**

1. **A5 não começa antes da Z0.** Cinco abas publicam o XML cru hoje; esta não é
   uma delas, mas a régua de foto é a mesma. Sem Z0, foto é prova sobre ficção.
2. **A3 não muda `pode_ligar_o_mic` sem a resposta de BT-M1** (seção 6). Pode
   mudar o TEXTO; não pode mudar quem o botão deixa clicar.
3. **Ninguém roda `retratar_abas.py` fora do seu turno.** Ele reescreve as onze
   de uma vez, e as outras dez ondas estão vivas. Quem precisa de foto no meio do
   trabalho passa um diretório como argumento
   (`scripts/gui-captura/retratar_abas.py /tmp/olhar`) — está em
   [COMO-OLHAR-A-TELA.md](../COMO-OLHAR-A-TELA.md).

---

## 5. As tarefas

Carimbo de classe de tela (D3, decisão dela de 23/08): **[COSMÉTICA]** =
pré-aprovada, foto depois em lote · **[ESTRUTURAL]** = precisa do olho dela ANTES
· **[SEM TELA]** = não toca a interface.

### A1 — o caderno

#### T1 — a tabela de consumo de cada campo do `maquina.json` · **[SEM TELA]**

Produzir, com a régua da seção 2.2 e o comando ao lado de cada linha, a tabela
`campo → escritor → leitor de repintura → consumidor de comportamento` para os
onze campos de `MaquinaConfig` (`src/hefesto_dualsense4unix/utils/maquina.py:226`).
Três colunas, não duas: um leitor que repinta o botão que a pessoa acabou de
clicar **não é consumidor** — é eco.

**A mordida:** rode a régua primeiro contra `microfone` e `teto`, que têm
consumidor, e veja-a acusar os dois. Uma régua que nunca foi vista acertando não
mediu nada.

**Custo:** ~0 linhas de produto, 40 min.

#### T2 — `MaquinaConfig.ambiente` sai do esquema · **[SEM TELA]**

Zero escritores, zero leitores (2.2). O dono real da correção de ambiente é
`gravar_correcao_de_ambiente` (`src/hefesto_dualsense4unix/app/ambiente.py:101`),
que grava no `gui_preferences.json` **na hora** — e a seção "A janela" já diz isso
na tela com `VALE_JA` (`moldura.py:50`). Manter o campo é manter um segundo dono
possível de um fato que já tem dono.

**Sai do esquema, não ganha consumidor**, e a diferença importa: a razão de a
seção "A janela" não ser diferida está escrita em `ambiente.py:104-107` — o
"Aplicar" do rodapé envia coisa AOS CONTROLES, e ambiente não é ajuste de
controle. Ligar o campo ao caderno inverteria essa decisão sem ninguém pedir.

**Migração: nenhuma.** O arquivo não existe no disco dela (2.1), e o `extra="forbid"`
do esquema só recusa chave DESCONHECIDA — um `maquina.json` antigo com `ambiente`
gravado passaria a ser recusado, então a remoção leva junto o resgate campo a
campo que `9848c41` instalou. Confirmar que ele cobre a chave que some.

**A mordida:** grave à mão um `maquina.json` com `"ambiente": "gnome"` mais uma
`mesa` válida; carregue; a `mesa` tem de sobreviver e só o `ambiente` cair. Sem o
resgate campo a campo, o documento inteiro vira vazio — e é esse o teste.

**Custo:** ~10 linhas de produto, ~40 de teste, 1 h.

#### T3 — o exame passa a ler o que ela declarou sobre a mesa · **[ESTRUTURAL]**

`vizinhanca_das_portas` (`src/hefesto_dualsense4unix/integrations/exame_da_mesa.py:431`)
mede a vizinhança e nunca lê `mesa.altura_da_antena` nem `mesa.linha_de_visada`,
apesar de o esquema prometer que é para isso que os dois campos existem (2.2).
Hoje a linha `ROTULO_VIZINHANCA` (`:66`) sai laranja na bancada dela e não diz
uma palavra sobre o que a mudaria.

**O conserto tem duas metades, e a segunda é a que fecha o buraco de 0.999:**

1. o exame recebe a declaração por argumento (o módulo é 100 % stdlib e
   read-only por contrato de CONFIG-09 — **não** importe `utils.maquina` lá
   dentro; quem carrega é quem chama);
2. quando a vizinhança está laranja **e** a declaração está vazia, a linha diz o
   que falta declarar e onde. É o produto PEDINDO, que é a única cura honesta
   para a 2.1 (ver seção 3).

**[ESTRUTURAL]** porque é texto novo na tela e muda o que se vê ao abrir a aba.
Leve à mesa dela a frase, não o código.

**A mordida:** arranque a passagem da declaração e rode o exame com
`altura_da_antena="abaixo"` — a linha tem de voltar a ser byte a byte igual à de
declaração vazia. Se continuar diferente, o teste está medindo outra coisa.

**Custo:** ~50 linhas de produto, ~60 de teste, 3 h.

#### T4 — o rodapé diz o que grava · **[ESTRUTURAL]**

`src/hefesto_dualsense4unix/gui/main.glade:4113` e a descrição acessível logo
abaixo. Cinco seções desta aba prometem esse botão pelo nome (`QUANDO_VALE`,
`moldura.py:46`) e a dica dele fala só de gatilhos, LEDs, rumble e mouse (2.3).

Redação **provisória**, para a mesa dela e não para o commit:

> `Envia a configuração aos controles e grava o que você declarou na aba Configurações`

**A mordida:** um portão que cruza a lista de seções que usam `QUANDO_VALE` com o
texto da dica de `btn_footer_apply` — se alguma seção promete o botão e a dica
não menciona a aba, reprova. Arranque a palavra "Configurações" da dica e veja
reprovar. É o mesmo desenho de `SECOES` (`secoes.py:38`):
derivar em vez de manter duas listas.

**Custo:** 2 linhas de XML, ~30 de teste, 1 h + o tempo dela.

### A2 — comunhão com o specs

#### T5 — as constantes do rádio declaram de qual célula do CSV vieram · **[SEM TELA]**

`HZ_INPUT_SEM_MIC` (`src/hefesto_dualsense4unix/integrations/radio_da_mesa.py:120`),
`HZ_INPUT_COM_MIC` (`:124`), `HZ_AUDIO_COM_MIC` (`:127`) e `SLOTS_POR_SEGUNDO`
(`:111`) são medição do CSV copiada à mão para dentro do Python (2.6). A aba
imprime as quatro na tela.

Cada constante ganha, ao lado, a **chave** da linha do mapa de onde veio
(`audio.microfone`) e um portão que reabre o CSV e compara. É a fatia mínima da
Z6 que esta aba pode carregar sozinha; a ponte geral é da `PAREAMENTO-01`.

**A mordida — e ela já foi provada em 23/08:** troque `HZ_INPUT_SEM_MIC` de 260,4
para 300,0 deixando a `radio_ressalva` para trás. Hoje: 36 testes verdes e portão
OK. Depois desta tarefa, tem de reprovar nomeando a célula.

**Custo:** ~40 linhas de produto/portão, ~50 de teste, 3 h.

#### T6 — os números caducos saem de TODOS os lugares · **[SEM TELA]**

O `radio_ressalva` de `audio.microfone` declara caducos os *"55-75% de mudo /
~40% do sinal"* e registra que o `README.md` ainda os publica (2.6). Pela regra
da casa, fato errado se SUBSTITUI, e sai de todos os lugares onde aparece.

Régua: `grep -rn "55-75\|55 a 75\|40% do sinal" . --exclude-dir=.git`. **Rode-a
antes de acreditar no resultado dela**, contra o `README.md`, que você sabe que
contém pelo menos uma ocorrência.

**A mordida:** o portão de citação já existe para linha
(`scripts/validar-citacoes-de-linha.py`); aqui a mordida é a régua acima voltando
vazia **depois** de ter voltado cheia antes.

**Custo:** ~0 de produto, 1 h.

#### T7 — "A mesa" e "Orçamento" não têm família no mapa — decisão D-M · **[SEM TELA]**

As onze famílias do CSV não cobrem topologia de mesa nem teto de orçamento (2.6).
Isso deixa duas das cinco seções desta aba **fora do portão** que a casa usa para
não afirmar demais sobre transporte.

**Não invente família.** Escreva a proposta com o preço dos dois lados e leve à
mesa dela como **D-M**:

- (a) família `mesa.*` e chave `orcamento.teto` no CSV — cabem 49 colunas por
  linha, e a maioria não se aplica a topologia;
- (b) declarar por escrito que as duas seções não são canal de controle e que o
  portão de paridade não as alcança — mais barato, e deixa uma zona cega
  nomeada.

**Custo:** ~0 de código, 1 h + a decisão dela.

### A3 — o microfone

#### T8 — a dica do microfone carrega o que a medição de 16/08 mediu · **[ESTRUTURAL]**

`DICA_MIC_NO_RADIO` (`src/hefesto_dualsense4unix/app/actions/config/secao_controles.py:410`)
diz o que o clique faz, quanto custa de banda e que a escolha é dela. **Não diz o
que o mapa mede**: a mesma célula `radio_ressalva` de `audio.microfone` registra
duas rodadas de 16/08 em que a ponte travou o controle em 10 segundos, com
`held_ms` de 17,6 / 17,5 / 17,9 — e o veredito dela, textual, de que *"a ponte
NÃO sobe sozinha e não entra no caminho automático da interface enquanto a
sequência do `0x32` tiver dois donos"*.

A regra 4 dela é `capacidade, não advertência` (`secao_controles.py:399`), e ela
continua valendo — foi escrita contra uma frase de PREÇO comparando números
errados. **"O que já aconteceu quando isto foi ligado" não é advertência: é
capacidade contada por inteiro.** Levar a frase à mesa dela; ela decide se entra.

**A mordida:** o portão de T5, estendido — se a `radio_ressalva` de
`audio.microfone` mudar e a dica não, reprova.

**Custo:** ~6 linhas de produto, ~30 de teste, 1 h + o tempo dela.

#### T9 — a caixa do microfone mostra o DECLARADO, nunca o vivo · **[SEM TELA para medir]**

Primeiro **meça**, e só depois conserte: a caixa nasce de `_mic_declarado`
(`secao_controles.py:788`), que lê o `maquina.json` fundido com o rascunho. A
pergunta a responder com comando ao lado é: **depois do "Aplicar", existe algum
caminho pelo qual a tela saiba que a ponte SUBIU?**

Se a resposta for não, é a F7 desta aba — declarado e funcionando pintam igual —
e o conserto é o do `daemon.state_full` (Z5), não daqui. Devolva o achado para a
Z5; **não** invente um segundo tique nesta seção.

**A mordida:** com a declaração gravada e o subsystem no chão (é o estado de
hoje, sem `libopus` ou sem BT), a tela tem de ficar diferente de com ele de pé.
Se ficar igual, o achado está confirmado.

**Custo:** 0 de produto nesta sprint, 2 h de medição.

### A4 — a mordida

#### T10 — refazer o censo das curas arrancáveis, com régua declarada · **[SEM TELA]**

O reconhecimento reportou "11 curas arrancáveis sem nada ficar vermelho". **Isso
é pergunta, não fato** (seção 3). Refaça: para cada cura desta aba, arranque,
rode a fatia da suíte e registre o que ficou vermelho.

Duas armadilhas medidas desta casa, e as duas moram aqui:

- **verde não é prova de cobertura.** Antes de reportar "N arrancáveis", prove
  que a régua sabe acusar: arranque `set_halign` de `rotulo_de_apoio`
  (`src/hefesto_dualsense4unix/app/actions/config/moldura.py:98`) e veja
  `tests/unit/test_moldura_a_dica_nao_atravessa_a_janela.py` reprovar. Ele
  reprova — foi escrito para isso;
- **o daemon vivo é mais velho que o código.** Cura de daemon só vale no próximo
  start. Confira `systemctl --user show hefesto-dualsense4unix.service -p
  ExecMainStartTimestamp --value` antes de acreditar em qualquer medição por
  journal, e **reiniciar é decisão dela**.

**Devolva:** a lista, com o comando de arranque e a saída, e a contagem final.
Se forem menos de 11, diga quantos e por que a conta anterior era outra.

**Custo:** 0 de produto, 3 h.

#### T11 — o portão "existe chamador de PRODUÇÃO?" para esta aba · **[SEM TELA]**

O defeito mais caro desta casa é a cura escrita e nunca ligada, e ele acabou de
acontecer duas vezes nesta aba: `_refresh_config_controles` pendurado e fora do
mapa (`30b2d57`), e `MaquinaConfig.ambiente` sem escritor (2.2). O portão que
pegou o primeiro existe e é estreito — `NOME_DO_REFRESH`
(`src/hefesto_dualsense4unix/app/actions/config/secao_controles.py:89`) cruzado
com `_REFRESH_POR_ABA` (`src/hefesto_dualsense4unix/app/app.py:1102`).

Generalize para os campos do caderno: **todo campo de `MaquinaConfig` tem de ter
um consumidor fora de `app/actions/config/` e fora de `utils/maquina.py`, ou uma
isenção nomeada no próprio portão.** Isenção com nome é decisão; ausência é
defeito.

A tabela da T1 é a entrada deste portão — não a redigite.

**A mordida:** acrescente um campo novo ao esquema sem consumidor e veja
reprovar. Depois isente-o pelo nome e veja passar.

**Custo:** ~70 linhas de portão/teste, 2 h.

### A5 — a tela

#### T12 — a dobra: quem declara não deveria nascer escondido · **[ESTRUTURAL]**

2465 px numa janela de 1080 (2.4). As três seções que declaram nascem abaixo.

A ordem das seções tem **um** dono, e isso é o que torna a tarefa barata:
`SECOES_DA_ABA` (`src/hefesto_dualsense4unix/app/actions/config/secoes.py:25`) —
*"trocar a ordem da tela é trocar a ordem aqui, e nada mais em lugar nenhum"*.

**Leve três opções à mesa dela, com a foto de cada uma**, e não decida sozinho:

- (a) trocar a ordem — "A mesa" sobe, "Os controles" desce. Custo: uma linha;
- (b) "Os controles" nasce colapsado quando há mais de dois cards. Custo médio,
  e muda o que se vê ao abrir;
- (c) deixar como está e resolver pela T14 (texto compacto).

**Isto é ordem das seções e o que nasce colapsado — as duas coisas que a D3 põe
explicitamente do lado do olho dela.** Nenhuma linha antes da palavra dela.

**A mordida:** um teste de altura que reprove se a soma das alturas naturais das
seções que **declaram** começar abaixo de 1080 px na largura de 1180. Arranque a
troca de ordem e veja reprovar.

**Custo:** 1 a 40 linhas conforme a escolha dela, ~50 de teste, 2 h + o tempo dela.

#### T13 — a afordância que o `TOOLTIPS.md` promete e o CSS não tem · **[COSMÉTICA]**

22 dicas, dois `?` na tela, zero sublinhado pontilhado (2.5). Nasce uma classe
CSS em `src/hefesto_dualsense4unix/gui/theme.css` e ela é aplicada aos rótulos
que hoje carregam dica sem marca nenhuma.

**Pré-aprovada pela D3** — é "tornar dica visível", com o texto intacto. Nada de
rótulo novo, nada de reescrever dica: só a marca.

**Duas armadilhas de GTK já pagas por esta casa** ([COMO-OLHAR-A-TELA.md](../COMO-OLHAR-A-TELA.md)):
`max-width-chars` sozinho não encolhe label nenhum, e todo `GtkSwitch` do GTK3
pinta um quadrado vermelho que só `-gtk-icon-transform: scale(0)` mata. Se a
marca for desenhada com pseudo-elemento, confira nas duas.

**A mordida:** um teste que conte, na aba montada, rótulos com `tooltip_text`
não vazio e SEM a classe de afordância. Hoje esse número é ~20; ao fim tem de ser
zero, e arrancar a classe de um rótulo tem de fazê-lo subir para 1.

**Custo:** ~15 linhas de CSS, ~25 de produto, ~40 de teste, 2 h. Foto depois, em
lote com as outras cosméticas da leva.

#### T14 — "Tamanho do texto" e a dobra são a mesma pergunta · **[SEM TELA para medir]**

A seção "A janela" diz, honestamente, que o tamanho novo vale na próxima abertura
— e a razão está escrita: `apply_theme`
(`src/hefesto_dualsense4unix/app/theme.py:168`) COMPÕE provedores e não sabe se
desfazer. `escala_gravada` (`:85`) existe justamente para a fileira nascer
marcando o que vale na PRÓXIMA vez.

Numa aba de 2,28 janelas, "Compacto" é a cura mais barata da dobra — e é a única
escolha do produto que não pode valer agora.

**Meça primeiro:** existe caminho para remover o provedor da escala sem derrubar
os outros três? `remove_provider_for_screen` não aparece em `theme.py` hoje.
Devolva o custo com o comando ao lado; a decisão de executar é dela, junto com a
T12.

**A mordida (se for executada):** trocar o degrau e medir a altura pedida pela
página **no mesmo processo**, antes e depois. Um teste que só leia
`escala_gravada()` passa com a cura arrancada.

**Custo:** 2 h de medição. Execução: **NÃO VERIFICADO**.

---

## 6. O que o Bluetooth bloqueia

D2: o mapeamento de BT é trilha dela com o assistente, na mesa do specs. Esta
sprint não o planeja. O que a **aba não pode afirmar na tela** até a medição
existir:

| # | a pergunta de BT | o que a aba não pode dizer enquanto ela estiver aberta |
|---|---|---|
| **BT-M1** | quem é o dono da sequência do `0x32` quando a ponte de microfone e o `motion_reader` leem o mesmo `/dev/hidraw` | que ligar o "Microfone" **funciona**. Pode dizer que foi declarado; não pode dizer que a voz chega. O CSV registra dois travamentos medidos em 16/08 e o `radio_aciona` da linha `audio.microfone` é `parcial`, não `sim` |
| **BT-M2** | existe fonte de captura de microfone por rádio sem a ponte? | **medido em 23/08: não existe.** O medidor de rádio e a seção "A mesa" não podem apresentar captura por BT como capacidade da mesa — só como consequência de a ponte estar de pé |
| **BT-M3** | os quatro números de banda (260,4 / 170,5 / 106,2 / 1600) valem para 2, 3 e 4 controles no mesmo adaptador? | que "cabe" ou "não cabe" com a mesa cheia. A barra "Rádio em uso" já cala quando não mediu (`0fd0a33`) — **mantenha assim**, e não converta ausência em zero |

E a advertência de bancada que vale para todo executor desta onda: **às 18h15 de
23/08 havia dois DualSense no rádio; às 19h29 e às 20h45, zero** — três réguas
independentes confirmaram, e o que sobrava no `/sys/class/hidraw` era o nosso
próprio vpad. Nenhum número desta leva sobre 2 ou 4 controles é medição viva.
Quem for medir mesa cheia, meça de novo.

---

## 7. As sprints absorvidas

| arquivo | o que contribui | morre ao fim desta? |
|---|---|---|
| [CONFIG-03](2026-08-21-ABA-CONFIGURACOES/CONFIG-03-a-declaracao-persiste.md) | criou a camada `maquina.json` e a decisão D-A4 (a aba é diferida). O aceite dela — *"declarar, fechar, reabrir, a declaração está lá"* — **nunca foi exercido no disco dela** (2.1). T1..T4 fecham a metade que faltava | **sim** |
| [CONFIG-04](2026-08-21-ABA-CONFIGURACOES/CONFIG-04-o-medidor-de-radio.md) | o medidor e os quatro números. O "Folgada" falso já caiu em `0fd0a33`; o que sobra é o lastro no CSV (T5) e o BT-M3 | **sim** |
| [CONFIG-06](2026-08-21-ABA-CONFIGURACOES/CONFIG-06-controles-que-nao-sao-dualsense.md) | os campos `modo` e `botoes`, que a T1 mede como **sem consumidor**. A pergunta "o glifo deveria mudar em outras abas?" volta dela para a mesa | **não** — sobrevive a pergunta do glifo, e ela é da Onda de Emulação/Navegação |
| [CONFIG-07](2026-08-21-ABA-CONFIGURACOES/CONFIG-07-a-janela.md) | a seção "A janela", a escala tipográfica e o espelho do autostart. T14 mede o que ela deixou aberto | **não** — só se a T14 for executada |
| [CONFIG-09](2026-08-21-ABA-CONFIGURACOES/CONFIG-09-esta-tudo-certo.md) | o exame da mesa, a fonte única e a doutrina de cor. É o hospedeiro da T3 — e a proibição *"o exame não roda na montagem"* continua valendo palavra por palavra | **sim** |
| [DECISÕES-ABERTAS](2026-08-21-ABA-CONFIGURACOES/DECISOES-ABERTAS.md) | D-A1 ("não sei" é resposta, feito em `68befc9`) e D-A4 (diferida). O que resta em aberto vira D-M (T7) | **sim** |
| [ELO-MUDO-01](2026-08-22-ELO-MUDO-01-o-ok-que-nao-sabe-dizer-nao.md) | o contrato "a ponte sabe dizer não". **Esta aba já o implementa** (2.7) e vira o molde da Z1 para as outras sete | **não** — vive na Z1 |
| [CENTRAL-SEM-TELA-01](2026-08-22-CENTRAL-SEM-TELA-01-o-censo-e-o-apelido-nasceram-sem-porta.md) | o censo dos rádios e o apelido do dongle, que a seção "A mesa" consome. O apelido tem porta hoje; o que falta é o consumidor de `RadioDeclarado.tipo` fora da própria seção (T1) | **sim** |
| [PORTAS-DA-CASA-01](2026-08-24-PORTAS-DA-CASA-01-o-produto-sabe-onde-cada-radio-mora-e-nao-diz.md) | "o produto sabe onde cada rádio mora e não diz" — é a mesma família da T3: dado calculado, tela calada | **não** — a metade fora desta aba fica com ela |
| [CARD-OCUPA-01](2026-07-31-CARD-OCUPA-01-o-desenho-ocupa-o-vao-que-o-teto-devolveu.md) | o precedente de vão vertical devolvido pelo teto. É o que a T12 tem de não repetir: `moldura_de_secao` já fixa `vexpand=False` por causa exatamente disto (`moldura.py:87`) | **não** — é referência, não pendência |

---

## 8. O aceite

**Linha de base de hoje, para comparar** (a fatia desta aba, medida antes de
qualquer tarefa):

```bash
timeout 560 xvfb-run -a .venv/bin/python -m pytest tests/unit/ \
  -k "config or maquina or mesa or exame or orcamento or moldura" -q
# 879 passed, 1 skipped, 2 xfailed  em 39,64 s   (23/08, commit 7d38138)
```

A sprint fecha quando **tudo abaixo está verde**:

```bash
git add -A                                  # os portões não veem arquivo novo
.venv/bin/python -m pytest -q
.venv/bin/ruff check src/ tests/
python3 scripts/validar-acentuacao.py --all
python3 scripts/validar-glifos.py --all
python3 scripts/validar-referencias-docs.py --all
python3 scripts/validar-citacoes-de-linha.py --all
python3 scripts/validar-palavra-de-tela.py --all
bash scripts/check_anonymity.sh
.venv/bin/python scripts/check_version_consistency.py
bash scripts/check_packaging_parity.sh
bash scripts/check_test_data.sh
.venv/bin/mypy src/hefesto_dualsense4unix
.venv/bin/python scripts/check_paridade_transporte.py
```

e mais **as sete provas próprias desta onda**, que são o que a distingue de uma
leva verde qualquer:

1. **o caderno nasce quando ela declara.** Apagar o `maquina.json`, abrir a
   janela, declarar a altura da antena, clicar "Aplicar", fechar, reabrir — a
   escolha está marcada. É o aceite que a CONFIG-03 escreveu e que nunca foi
   exercido;
2. **nenhum campo do esquema sem consumidor ou sem isenção nomeada** — o portão
   da T11 passa, e reprova quando se acrescenta um campo novo;
3. **`grep -rn "ambiente" src/hefesto_dualsense4unix/utils/maquina.py`** não
   devolve mais o campo, e o `gui_preferences.json` continua sendo o único dono
   da correção de ambiente;
4. **a dica do `btn_footer_apply` menciona a aba Configurações**, e o portão da
   T4 reprova se alguém a tirar;
5. **trocar `HZ_INPUT_SEM_MIC` sem tocar a `radio_ressalva` reprova** (T5). Hoje
   passa — é a mordida que fecha a AUDITORIA-DE-PERDA-01 nesta aba;
6. **`grep -rn "55-75\|40% do sinal" . --exclude-dir=.git` volta vazio** (T6);
7. **a foto.** `scripts/gui-captura/retratar_abas.py` no turno desta onda, e as
   duas imagens da Configurações (a normal e a esticada) lidas por quem executa,
   antes de dizer que fechou. As cosméticas vão em lote para o olho dela; as
   estruturais (T3, T4, T8, T12) **não fecham sem a palavra dela**.

---

## 9. O que fica aberto, e de quem é

**Dela, e só dela:**

- **D-M** — onde "A mesa" e "Orçamento" moram no mapa de canais, ou a declaração
  de que não moram (T7);
- a ordem das seções e o que nasce colapsado (T12);
- as três frases estruturais: a linha do exame que pede a declaração (T3), a dica
  do rodapé (T4) e a dica do microfone (T8);
- se "Tamanho do texto" passa a valer na hora, depois de a T14 devolver o custo;
- **se `controles[*].botoes` deveria trocar o glifo em outras abas.** O campo
  existe, ninguém o consome, e nenhuma decisão registrada diz qual era a
  intenção.

**Da trilha de BT dela com o assistente:** BT-M1, BT-M2 e BT-M3 (seção 6).

**De outras ondas, e esta sprint NÃO os toca:**

- a borda na cor do plástico e o RGB de cada nome — `ONDE-A-COR-MORA-01`,
  itens 2, 3 e 12 do [TODO-INTEGRACAO](2026-08-21-ABA-CONFIGURACOES/TODO-INTEGRACAO.md);
- o fixture de **cinco** controles para a captura (item 15 do mesmo arquivo). A
  mesa real desta casa é de cinco, e a foto de quatro não mostra o pior caso de
  largura — nem o pior caso da dobra que a T12 mede;
- a régua da Z5 sobre quem está na mesa. O achado da T9 vai para lá inteiro;
- `ExternalMaskRegistry.set_mask` sem chamador de produto (item 5 do
  TODO-INTEGRACAO). É a Onda de Emulação;
- a ponte geral medição → CSV → tela: `PAREAMENTO-01`. A T5 é só a fatia desta
  aba.
