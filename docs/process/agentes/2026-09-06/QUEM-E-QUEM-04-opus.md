# QUEM-E-QUEM-04 — a chave atravessa o transporte, e a segunda forma nunca existiu

**06/09/2026 · branch `voo/QUEM-E-QUEM-04-opus` · base `52b81893`
(= `onda/atual-0609`) · bancada NÃO exigida (`bancada: false`; nenhum caminho
para o daemon, escrita no aparelho ou `systemctl`) · nenhuma janela aberta.**

**Esta sprint encolheu antes de começar, e o encolhimento é a entrega.** O
prompt já avisava; a conferência no código confirmou, e o que sobrou de
trabalho real foi feito e só isso.

## O que mudou

**Posse respeitada:** `src/hefesto_dualsense4unix/profiles/schema.py` (o
`posse: CHAVE`) e o arquivo que o `cria:` manda criar.
`daemon/subsystems/identity.py` não foi tocado (`nao_toca:`).

### 1. A §3 item 1 CAIU, e a conferência foi no código

O enunciado manda o validador aprender uma **segunda forma de chave** — a do
controle sem serial, *"com prefixo explícito, para que nunca se confunda com um
MAC malformado"*. **Essa forma não existe.** A `O-CONTROLE-SEM-MAC-01` fechou
antes (`cd5ff9bc`) e o resultado dela derruba a premissa. Conferido aqui, linha
a linha, e não no relatório dela:

| onde | o que diz |
| --- | --- |
| `identity.py:736` `resolver_crachas` | o que o provider devolve *"só vira key se passar pelas MESMAS guardas do serial — 12 hex canônicos e não-vpad"* |
|  `identity.py:776` | `candidata, ok = self._canonical(achado)` — o mesmo `_MAC_RE` do serial |
| `identity.py:710` `_chave` | quem tem MAC nem consulta o cache: *"o crachá jamais vence o serial"* |

E medido, com o registro REAL e um provider dublado:

```
provider("/dev/hidraw7") -> "AA:BB:CC:00:00:02"
registro._chave("/dev/hidraw7")  ->  ('aabbcc000002', True)   ← 12 hex, persistível
Profile.model_validate(... {"aabbcc000002": {...}} ...)  ->  ACEITO
```

**A porta que esta sprint ia abrir já estava aberta.** O perfil, o `sysfs_leds`,
o co-op e o disco não aprendem gramática nenhuma. **Nada foi alargado** — e a
recusa das gramáticas inventadas (`cracha:0x09:…`, `sem-mac:…`, `9f2a1c04`,
`0x09`) ficou com régua nomeada, justamente para uma segunda forma não nascer
por acidente numa sprint futura.

O que mudou em `schema.py` é **um bloco de docstring**, e ele é o registro dessa
medição: a forma é UMA, por que é uma, e o que uma futura segunda forma teria de
carregar junto (as três rejeições da F4) para não trocar um defeito por outro
pior. Zero linha de comportamento.

### 2. A régua nomeada, e ela mede as DUAS pontas no código REAL

`tests/unit/test_quem_e_quem_04_a_chave_atravessa_o_transporte.py` — 40 casos.
Ela não reproduz nenhum dos dois lados:

* **o perfil** é o `Profile.model_validate` de verdade;
* **a consulta** é o `describe_controllers` de verdade — o teste monta handles
  dublados em uma instância real de `PyDualSenseController` e lê a saída —, mais
  o `ipc_handlers._norm_uniq`, que é com o que o daemon procura no mapa.

As seis provas da §4 estão cobertas, e as duas metades da 4 estão **corrigidas
pelo achado**: `uniq=None` não produz chave (inalterada) e a chave de crachá é
aceita **sem cura nenhuma**, porque é um endereço.

**Nenhum endereço desta bancada.** Os dois controles são `aabbcc000002` e
`3c9d07000007` — sintéticos, na máscara da casa (octetos 4 e 5 zerados). Toda
prova roda na mesa de UM e na de DOIS (prova 6).

**O SEGUNDO CONTROLE NÃO É O QUE A SPRINT ESCREVEU, e quem derrubou foram os
portões.** A §4 nomeia um endereço de OUI `dd:e1:1f` para o segundo controle.
Os portões `test-data` e `mac-de-fixture` o recusam — ele não é faixa forjada
desta casa, e `mac-de-fixture` diz por quê: *"se for identidade real, ISSO é
vazamento"*. Trocado por `3c9d07…`, que é a SEGUNDA faixa sintética da casa,
conferida contra `/usr/share/ieee-data/oui.csv` em 22/08. O ganho é de graça:
os dois controles da prova passam a ter OUIs DIFERENTES, que é o que "mesa de
dois" quer dizer. **Foi a única linha do enunciado que os portões derrubaram**,
e ela custou uma volta vermelha antes de eu ver.

### 3. As três rejeições medidas saíram de longe e ganharam régua própria

Era o item 2 da §3, e é o que sobrou de pé inteiro. Elas existiam no código
desde julho e só eram exercidas de longe, em `test_profile_schema.py`. Agora têm
caso nomeado, parametrizado nas duas mesas, e **uma mordida que mostra o dano**:
sem a guarda de duplicata as duas grafias do mesmo controle colapsam numa
entrada, e a última vence por ordem de inserção — calada.

## Qual mordida prova

Quatro, **rodadas no FONTE e desfeitas**, cada uma com a contagem medida sobre
os 40 casos:

| # | o que foi arrancado | onde | caem |
| --- | --- | --- | --- |
| 1 | `mac = norm_mac(key)` → `mac = key` | `schema.py:1570` | **26** |
| 2 | `"uniq"` passa a levar o transporte colado | `backend_pydualsense.py`, `describe_controllers` | **28** |
| 3 | os dois `if` das rejeições a `False` | `schema.py` | **7** |
| 4 | a guarda de 12 dígitos fora | `backend`, `_key_to_uniq` | **2** |

**A mordida 1 é a que importa, porque ela DISCRIMINA.** Com o `norm_mac` fora,
os quatro sobreviventes de `test_duas_grafias_dois_transportes_a_mesma_entrada`
são exatamente aqueles cujo JSON está escrito na grafia do RÁDIO
(`aabbcc000002`); **todo caso de JSON na grafia do CABO** (`AA:BB:CC:…`) deixa
de achar. É a F2 medida em 29/08, reproduzida: uma régua que só exercitasse o
rádio passaria com a cura fora — mediria a string, não a identidade.

Foi por isso que dois casos (`test_o_transporte_nunca_entra_na_chave` e
`test_sem_mac_nao_produz_entrada_fantasma`) escrevem o JSON **já canônico**: o
assunto deles é outro, e misturar a grafia faria a mordida 1 derrubá-los junto,
escondendo qual das duas curas caiu.

**Vizinhos:** 124 verdes em `test_profile_schema.py`,
`test_backend_multi_controller.py` e
`test_perfil_por_controle_o_campo_espera_o_caminho.py`. Na vizinhança larga
(perfil + identidade + as quatro QUEM-E-QUEM), **1761 verdes e 13 vermelhos que
já eram vermelhos na base** — conferido com `git stash`: os mesmos 13, em
`test_nunca_troca_o_alvo_01` e `test_identidade_do_aplicativo_01`, que não têm
relação com esta chave.

## O que NÃO verifiquei

- **Nada no aparelho.** `bancada: false`, e nenhum passo desta sprint pede fio:
  as duas pontas medidas são código puro. A célula
  `identidade.cracha_nos_dois_transportes` foi exercitada **em dublê**, no
  degrau MONTOU — a linha de prova no aparelho é da MESA-DE-QUATRO-01.
- **Não abri janela**, não rodei o produto e não toquei `~/.config`: a régua
  constrói tudo em memória.
- **Não medi o caminho da GUI até o mapa** (`draft_config.to_profile` e o
  `ipc_draft_applier`). Ele passa pelo mesmo `Profile.model_validate`, então o
  contrato vale — mas quem escreve a chave lá é outra frente, e não conferi
  clicando.
- **Não conferi o 8BitDo nem o Pro** nesta régua. A chave é a mesma função para
  todos, mas quem tem `uniq` degenerado é o Pro, e ele aparece aqui só como o
  valor `000000000001` da rejeição — não como aparelho.

## O que sobrou para o próximo

**A PAREDE DA F3 NÃO CAIU: ELA MUDOU DE LUGAR, e isso é medido.** A sprint
temia que a *forma* da chave nova fosse recusada. A forma é a de sempre — mas o
**valor** ainda pode ser recusado, e o desfecho é o mesmo que o enunciado
chamava de pior:

```
provider("/dev/hidraw8") -> "00:00:00:00:00:01"
registro._chave("/dev/hidraw8") -> ('000000000001', True)   ← persistível para a identidade
Profile.model_validate({"controllers": {"000000000001": {...}}})
    -> RECUSADO: "é um uniq degenerado"                     ← e o perfil INTEIRO não grava
```

O `identity._canonical` aceita `000000000001` como persistível; o
`_validate_controllers_keys` o recusa — e recusar aqui derruba **o perfil
inteiro**, inclusive as entradas dos controles que têm endereço bom. É a mesma
frase da F3: *"o usuário sai de 'não lembra, em silêncio' para 'não salva, com
erro', e o segundo é pior"*.

**Não curei, e o motivo é de posse:** a cura fica em
`daemon/subsystems/identity.py`, que esta sprint declara `nao_toca:`. E a outra
metade — o que o perfil deve fazer com UMA chave ruim entre chaves boas — é
decisão de produto, não minha (está na `pergunta`).

Também fica de pé, e não é dívida desta sprint:

- **a régua ainda não olha o caminho da GUI.** `draft_config.to_profile` chega
  ao mesmo validador, mas ninguém mediu clicando quem escreve a chave lá;
- **`test_profile_schema.py` continua com os casos antigos das três rejeições.**
  Não os apaguei: eles cobrem o validador de dentro, e o arquivo novo cobre a
  travessia. Se um dia parecerem duplicata, o que sai são os de lá.
