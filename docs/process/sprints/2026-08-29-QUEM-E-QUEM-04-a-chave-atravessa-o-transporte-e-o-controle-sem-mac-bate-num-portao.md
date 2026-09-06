---
sprint: QUEM-E-QUEM-04
estado: aberta
onda: QUEM-E-QUEM
posse:
  QQ04:
    - src/hefesto_dualsense4unix/profiles/schema.py
cria:
  - tests/unit/test_quem_e_quem_04_a_chave_atravessa_o_transporte.py
bancada: false
depois_de:
  # SÉRIE por R5: divide `profiles/schema.py` — treze sprints o disputam.
  - EMULACAO-UM-DONO-SO-01
  - MIGRA-GATILHOS-09
  - MIGRA-VIBRACAO-05
  - MIGRA-VIBRACAO-06
  - ONDA-CONTROLES-06
  - ONDA-CONTROLES-07
  - ONDA-GATILHOS-04
  - ONDA-NAVEGACAO-01
  - ONDA-NAVEGACAO-04
  - ONDA-NAVEGACAO-05
  - ONDA-PERFIS-09
  - ONDA-VIBRACAO-03
  - ONDA-VIBRACAO-05
  - QUEM-E-QUEM-01
  # A CURA que esta sprint deixa entrar no perfil nasce lá. Ver §3.
  - O-CONTROLE-SEM-MAC-01
nao_toca:
  - src/hefesto_dualsense4unix/daemon/subsystems/identity.py
  - src/hefesto_dualsense4unix/profiles/loader.py
  - novo-layout/
  - src/hefesto_dualsense4unix/gui/main.glade
---

> **ESTADO 06/09/2026: aberta, fora das 24 horas** — `docs/process/SPRINT_ORDER.md` §2.3 — régua do esquema do perfil, não remedida desde 29/08.

# QUEM É QUEM · 04 — a chave atravessa o transporte, e o controle sem MAC bate num portão

**Filha da [QUEM-E-QUEM-01](2026-08-29-QUEM-E-QUEM-01-o-perfil-do-jogo-lembra-cada-controle-pela-identidade.md).**
Ela responde à pergunta 3 do enunciado — **a mordida universal** — e traz um
achado que nenhuma das duas sprints vizinhas podia ver de dentro de si.

**O achado, numa frase:** a
[O-CONTROLE-SEM-MAC-01](2026-08-29-O-CONTROLE-SEM-MAC-01-o-usuario-que-a-mesa-desta-casa-nao-tem.md)
promete uma **chave estável que não é MAC** para quem não tem serial — e o
perfil **recusa essa chave**. As duas sprints estão certas cada uma no seu
arquivo, e entre as duas há uma parede que nenhuma delas declara.

---

## 1. O QUE ESTÁ MEDIDO

Medido em 29/08/2026, com o `.venv` desta árvore, contra o `dev`.
**Nenhum aparelho foi tocado; nenhum MAC desta casa aparece.**

### F1 — a travessia de transporte funciona, e a prova não precisa de hardware

`core/backend_pydualsense.py:5107-5113`, `describe_controllers`, devolve `uniq`
e `transport` como **campos separados** — e `_key_to_uniq` (`:5118-5132`) já
normaliza o `uniq` com o mesmo `norm_mac` que o perfil usa. **O transporte nunca
entra na chave.** Isso é o requisito dela, e é estrutural, não uma coincidência
de medição.

Medido, com um controle que ninguém aqui tem (`AA:BB:CC:00:00:02`, sintético, na
máscara da casa) e um perfil com uma entrada:

| Entrada de `describe_controllers` | Chave resolvida | Achou a entrada? |
|---|---|---|
| `uniq="AA:BB:CC:00:00:02"`, `transport="usb"` | `aabbcc000002` | **sim** |
| `uniq="aabbcc000002"`, `transport="bluetooth"` | `aabbcc000002` | **sim** |
| `uniq=None`, `transport="usb"` | — | **não** |

**Duas grafias, dois transportes, a MESMA entrada.** É a prova 2 do pai, e ela
cabe num teste de unidade.

### F2 — a mordida discrimina, e isso foi medido, não suposto

Arrancando a normalização (`schema.py:1162`, `mac = norm_mac(key)`) e comparando
a string crua:

| Caso | Com a cura | Com a cura ARRANCADA |
|---|---|---|
| cabo, `AA:BB:CC:00:00:02` | acha | **NÃO acha** |
| rádio, `aabbcc000002` | acha | acha |

A régua **separa os dois**. Uma que só exercitasse o caso do rádio passaria com a
cura fora e não mediria nada — mediria a string. **É exatamente a prova 4 que o
pai pede, e ela morde.**

### F3 — O ACHADO: a cura do sem-MAC não passa pelo portão do perfil

`schema.py:1137` (`_validate_controllers_keys`), na guarda de `:1163-1167`,
**rejeita toda chave que não vira 12 dígitos hex**. Medido, com as formas que um
crachá produziria:

| Chave | Resultado |
|---|---|
| `"cracha:0x09:9f2a1c04"` | **RECUSADO** — *"não é um MAC de 12 dígitos hex"* |
| `"sem-mac:0b:9f2a1c04"` | **RECUSADO** |
| `"9f2a1c04"` | **RECUSADO** |
| `"aabbcc000002"` | aceito |

E as duas sprints vizinhas passam por cima disso sem se cruzarem:

- a **O-CONTROLE-SEM-MAC-01** cura `daemon/subsystems/identity.py` e declara
  `nao_toca: profiles/schema.py`. Ela **não pode** abrir o portão;
- a **QUEM-E-QUEM-01** tem a posse de `schema.py`, e escreveu que *"cobra"* o
  caso na terceira prova da mordida — cobrar não é curar.

**Consequência, se as duas entrarem como estão:** o `identity.py` passa a dar uma
chave estável ao controle sem serial, o produto passa a achar que o lembra, e o
`Profile` recusa o perfil **inteiro** na hora de gravar. O usuário sai de "não
lembra, em silêncio" para "não salva, com erro" — e o segundo é pior, porque
derruba também as peças que tinham MAC no mesmo perfil.

### F4 — e o portão que recusa tem razões que NÃO podem cair junto

As rejeições de `schema.py:1168-1178` não são burocracia — cada uma é uma
medição:

- **`00:00:00…`** foi medido **ao vivo no Pro Controller**: `000000000001`,
  **idêntico entre unidades**. Aceitar isso faria dois controles diferentes
  dividirem a mesma memória;
- **`ff:ff:ff:ff:ff:ff`** é broadcast, não é unidade;
- **duplicata após normalização** evita a colisão silenciosa em que um override
  vence por ordem de inserção, sem aviso.

**Alargar a chave sem preservar as três é trocar um defeito por outro pior.** É a
armadilha desta sprint, e está escrita antes de alguém cair nela.

---

## 2. O PADRÃO QUE MANDA

`D-O-MICROFONE-A-MAQUINA-DA-O-PADRAO-O-PERFIL-SOBREPOE`, aplicado à **chave** em
vez de ao valor: a máquina (o `identity.py`) diz **quem é** aquele aparelho; o
perfil só guarda o que aquele aparelho escolheu naquele jogo. O perfil não
inventa identidade, e **também não pode recusar a que a máquina já resolveu**.

Traduzido para esta sprint: quem decide a forma da chave é o subsistema de
identidade; o esquema **valida a forma declarada**, não uma forma que ele
escolheu sozinho em julho, quando MAC era a única que existia.

---

## 3. O QUE ESTA SPRINT ENTREGA

1. **O contrato da chave passa a ter DUAS formas, e as duas são declaradas.**
   `_validate_controllers_keys` aceita o MAC de 12 hex (como hoje, canonizando) e
   a forma estável do sem-MAC que a O-CONTROLE-SEM-MAC-01 definir — com prefixo
   explícito, para que **nunca** se confunda com um MAC malformado. O que não
   casa nenhuma das duas continua sendo recusado com a mesma mensagem clara.
2. **As três rejeições medidas ficam de pé, e agora com portão próprio.** OUI
   degenerado, broadcast e duplicata-após-normalização passam a ser exercidos por
   teste nomeado — hoje eles existem no código e a régua que os prova mora longe.
3. **Nada muda para quem tem MAC.** Os 29 perfis do disco dela não têm entrada
   por controle (medido na
   [QUEM-E-QUEM-02](2026-08-29-QUEM-E-QUEM-02-o-campo-novo-nao-pode-quebrar-os-vinte-e-nove-perfis-dela.md),
   F4), e a canonização das grafias segue idêntica.

**Se a O-CONTROLE-SEM-MAC-01 não for executada, esta sprint entrega só o item 2 e
a prova de travessia** — e o achado F3 continua registrado, que é a metade que
não depende de ninguém.

---

## 4. COMO SE PROVA — e a régua tem de MORDER

`tests/unit/test_quem_e_quem_04_a_chave_atravessa_o_transporte.py`.

**A universalidade é a régua, e ela é estrutural:** nenhum MAC desta bancada,
nenhum arquivo de `~/.config`, nenhum aparelho. O controle da prova é
`aabbcc000002` — sintético, na máscara da casa (octetos 4 e 5 zerados) — e **um
segundo**, `dde11f000007`, para que a mesa da prova nunca tenha o tamanho da mesa
dela. As entradas de `describe_controllers` são dicionários construídos no teste,
com a forma medida em F1.

1. **Duas grafias, dois transportes, a MESMA entrada.** Congela F1, com a mesa de
   **um** controle e a mesa de **dois** — porque "4 de 4 numa mesa de quatro
   placas não prova universalidade; o que prova é o mecanismo"
   (`mapa-controles.csv`, `identidade.cracha_nos_dois_transportes`).
2. **A mordida da normalização.** Arranque `norm_mac` de
   `_validate_controllers_keys` e do lado da consulta: o caso do **cabo**
   (`AA:BB:CC:…`) tem de **deixar de achar**, e o do rádio continua achando.
   Medido em 29/08 — F2. **Se os dois continuarem passando, a régua mede a
   string, e não a identidade.**
3. **O transporte NUNCA entra na chave.** Para os dois controles, com
   `transport` variando entre `usb`, `bluetooth` e `None`, a chave resolvida é
   **byte a byte a mesma**. **A mordida:** faça a chave concatenar o transporte e
   veja a memória do rádio deixar de encontrar a do cabo — que é, em letra, o
   defeito que o requisito dela existe para impedir.
4. **O controle sem MAC.** `uniq=None` **não** produz chave, e o perfil não ganha
   entrada fantasma. E — o caminho de erro, exercido — a chave em forma de crachá
   é **recusada com motivo** antes desta sprint e **aceita** depois. Congela F3
   nos dois lados da cura.
5. **As três rejeições medidas continuam de pé.** `000000000001` (o Pro
   Controller, idêntico entre unidades), `ffffffffffff`, e duas grafias do mesmo
   MAC no mesmo mapa. **A mordida:** alargue a chave sem preservá-las e veja duas
   unidades diferentes dividirem a mesma memória — que é F4, e é o defeito pior
   que esta sprint pode causar se for feita com pressa.
6. **A mesa de UM.** Todo caso acima roda também com um único controle no mapa.
   *"Funcione como acessibilidade pra qualquer usuário simples"* — o usuário de
   um controle é a mesa mais comum do mundo e a que esta casa nunca tem.

---

## 5. O QUE ESTA SPRINT NÃO FAZ

- **Não escreve a cura do sem-MAC.** Ela mora em `daemon/subsystems/identity.py`
  e é da O-CONTROLE-SEM-MAC-01. Esta sprint abre a porta que aquela cura vai
  atravessar, e **declara a parede que ninguém tinha visto**.
- **Não escolhe qual dos cinco crachás vira chave.** São `0x05`, `0x09`, `0x0b`,
  `0x20` e `0x22`, medidos em 15/08 pela porta do broker, estáveis nos dois
  transportes. Escolher é da sprint dona; aqui só se aceita a forma que ela
  declarar.
- **Não toca a numeração do jogador.** O número é da fila de chegada
  (`identity.py:70-95`) e ela recusou colá-lo à identidade, com a razão medida:
  *"eu sempre conectava o controle branco e mesmo não tendo nenhum outro
  controle ele era sempre o player 3. E o jogo de um player só não entendia."*
  Nada aqui grava número.
- **Não acrescenta feature.** Campos são da
  [QUEM-E-QUEM-03](2026-08-29-QUEM-E-QUEM-03-as-nove-features-tem-dono-e-a-conta-sai-da-mao.md)
  e das sprints de onda; aqui só se mexe na **chave**.
