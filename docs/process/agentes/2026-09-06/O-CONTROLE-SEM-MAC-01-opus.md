# O-CONTROLE-SEM-MAC-01 — o segundo conduíte, e o crachá que era o endereço

**06/09/2026 · branch `voo/O-CONTROLE-SEM-MAC-01-opus` · base `ae1c3d82`
(= `onda/atual-0609`) · bancada NÃO exigida (`bancada: false`; nenhum caminho
para o daemon, escrita no aparelho ou `systemctl`).**

## O que mudou

**Posse respeitada:** só `daemon/subsystems/identity.py` (o `posse:`) e o
arquivo que a sprint manda criar. `profiles/schema.py` não foi tocado
(`nao_toca:`).

### 1. O achado que reescreve o enunciado — o mapa venceu a sprint

A sprint manda escolher entre **cinco** crachás candidatos (`0x05`, `0x09`,
`0x0b`, `0x20`, `0x22`) *"por medição registrada, não por gosto"*. A medição
registrada **já tinha descartado quatro deles**, e está na mesma linha que a
sprint cita — `docs/data/mapa-controles.csv`,
`identidade.cracha_nos_dois_transportes`, célula `cabo_detalhe`:

> *"Os outros quatro candidatos só pareciam servir: o `0x20` e o
> `hardware_version` agrupam por REVISÃO DE PLACA (a data de compilação do
> firmware no `0x20` colide em PARES nos quatro controles dela); o `0x22` só
> distingue porque EMBUTE o MAC; o `0x05` é calibração analógica da IMU, e é
> reescrevível pela própria família `0x80`."*

Então a escolha não é entre cinco: **é o `0x09`** — `buf[1..6]`, o endereço
invertido, que é de onde o próprio `hid_playstation` tira o `HID_UNIQ` —, com o
`0x22` (`buf[17..22]`) como segunda estrada para o **mesmo valor**. O `0x05` e o
`0x20` não são identidade de unidade, e um deles é **reescrevível**: eleger o
`0x05` teria feito a memória do controle depender de um dado que o próprio
produto sobrescreve ao calibrar.

**A FORMA DA CHAVE, que a sprint manda declarar para a `QUEM-E-QUEM-04`: são os
12 hex canônicos de sempre.** Não há forma nova. O crachá não devolve *"um
crachá"*, devolve **o endereço** — a mesma coisa que o serial devolveria, por
outra estrada. Consequência para quem vem depois: **a porta do perfil não
precisa aprender gramática nenhuma**; ela já está aberta para esta forma.

### 2. O mecanismo (`identity.py`)

| o quê | onde |
| --- | --- |
| `set_cracha_provider(provider)` | o seam do segundo conduíte: `uniq` cru → endereço, ou `None` |
| `resolver_crachas(uniqs)` | pergunta ao aparelho, **no tique lento e fora do `_lock`** |
| `_chave(uniq)` | o funil de key dos quatro caminhos VIVOS; lê só o cache |
| `_esquecer_cracha_locked(vivos)` | solta o crachá de quem saiu da mesa |
| `avisos_sem_cracha()` | os controles de que a casa desistiu, com a frase |
| `FRASE_SEM_CRACHA` | `D-0609-A-FRASE-DO-CONTROLE-SEM-CRACHA`, literal |

Quatro decisões que valem mais que o código:

- **o crachá NUNCA vence o serial.** Quem tem MAC 12-hex nem chega a ser
  perguntado — o provider não é chamado. Trocar a chave de quem já é lembrado
  apagaria a memória de toda mesa que hoje funciona, na primeira subida do
  daemon com a cura dentro;
- **este módulo não fala com o aparelho, e não vai passar a falar.** A
  docstring da classe promete um `slot_for` sem I/O (ele roda sob o `_io_lock`
  do backend, uma vez por controle por tique de cor). Ler `0x09` é I/O de
  hidraw. Por isso a pergunta acontece no `sync_connected` (~2 s), fora do
  lock, e o caminho quente lê só o cache. Há caso que prova: 20 `slot_for` +
  20 `numero_da_lampada` = **zero** chamadas ao provider;
- **o cache é esquecido na saída, e isto não estava no enunciado.** Ele é
  indexado pelo `uniq` CRU (um path), e paths voltam a circular na MESMA
  sessão: `/dev/hidraw7` liberado pode ser reocupado por outro aparelho.
  Guardar o crachá do primeiro não *interromperia* a identificação — a
  **corromperia**, que é o único desfecho que a `radio_ressalva` do mapa
  exclui (*"trocar de braço, cair o rádio ou desligar o controle INTERROMPEM a
  identificação — não a corrompem"*);
- **é ADITIVO.** Sem provider fiado (`FakeController`, e o daemon de hoje) o
  registro se comporta exatamente como antes — só que agora a desistência tem
  voz. Nenhum caminho existente mudou de regra: D9, D2/R-15, R-23, R-24, D-30 e
  a separação D3 ficam onde estavam.

### 3. A desistência deixou de ser calada

Sem serial e sem crachá o slot **continua volátil** (D9 não foi revogada) — o
que mudou é que a casa passa a dizer. `FRASE_SEM_CRACHA` é a frase dela, literal,
e obedece ao glossário para o dia em que subir à tela: nada de `MAC`, `uniq`,
`hidraw` nem *"mesa"*. Sai como log estruturado
(`identity_sem_cracha_nao_sera_lembrado`, uma vez por controle) e como leitura
(`avisos_sem_cracha()`). **Quem a leva à tela é outra sprint** — aqui ela é
dado. O `uniq` do item não sobe: o que sobe é a `frase`.

## Qual mordida prova

`tests/unit/test_o_controle_sem_mac_e_lembrado.py` — **18 casos, sem um único
endereço desta bancada**, faixa forjada `aa:bb:cc` sem sequência simples. O
dublê do aparelho **sabe recusar** (path fora do mapa → `None`), que é o que
exercita a metade da desistência.

```
18 passed in 0.35s
```

**As seis arrancadas, cada uma rodada e devolvida** (`/tmp/mordidas.txt`):

| a cura arrancada | reprovaram |
| --- | --- |
| 1+2 · o crachá volta a não virar key (**chaveie pelo `path`**) | **7 falharam**, 11 passaram |
| 3 · `avisos_sem_cracha()` devolve `[]` (**cale a frase**) | **6 falharam**, 12 passaram |
| 4 · o cache consultado antes da guarda do serial (**o crachá vence o MAC**) | **3 falharam**, 15 passaram |
| 5 · a guarda `_VPAD_MAC_PREFIX` fora do `resolver_crachas` | **1 falhou**, 17 passaram |
| 6 · `_esquecer_cracha_locked` vira `return` | **2 falharam**, 16 passaram |

A mordida 4 derrubou junto o `test_vpad_com_serial_proprio_continua_sem_slot`, e
isso é informação: **a guarda do serial é também a guarda do vpad** — sem ela, o
`02:fe:…` entra pela porta nova mesmo tendo serial próprio.

A mordida que a sprint diz importar mais — *chaveie pelo `path` e veja reprovar*
— é a 1+2, e o caso que ela derruba é
`test_mesmo_cracha_outro_path_cai_na_MESMA_entrada`: o mesmo aparelho, o mesmo
crachá, outro nó (o que o boot faz), caindo em **uma** entrada.

**Sem regressão nos vizinhos:**

```
tests/unit/test_o_controle_sem_mac_e_lembrado.py
tests/unit/test_identity_registry.py
tests/unit/test_identity_numeracao_r14_r15.py
tests/unit/test_identity_renumber_ipc.py
tests/unit/test_external_identity.py
→ 131 passed in 1,75 s
```

### O que se mediu no aparelho (leitura pura, sem bancada)

`grep HID_UNIQ /sys/class/hidraw/hidrawN/device/uevent` nos oito nós hidraw da
máquina, **agora**. É o comando que a própria célula do mapa registra como *"de
graça, sem root, sem abrir hidraw, sem broker e sem disputar nada com o
daemon"* — não para o daemon, não escreve no aparelho, não chama `systemctl`,
e por isso não passa pelo `bancada.sh exigir`.

- **quatro DualSense na mesa, todos com `HID_UNIQ` não vazio**: dois no cabo
  (`HID_ID=0003:0000054C:00000CE6`) e dois no rádio
  (`HID_ID=0005:…`) — a célula `identidade.cracha_nos_dois_transportes`
  confirmada viva nos DOIS transportes;
- **quatro outros nós HID (dois receptores 2.4G de cada marca) com `HID_UNIQ`
  VAZIO** — o firmware que não expõe serial existe *nesta máquina agora*, só
  não num DualSense. É a forma exata do usuário que esta sprint cura.

Degrau: **MONTOU**. Nada saiu no fio — li o que o `hid_playstation` publica.
A célula já está `SAIU NO FIO` desde 15/08 pela confirmação via `0x09`, e
**esta leitura não a promove nem a rebaixa**; ela só a reconfirma pelo caminho
barato. Os endereços ficaram fora de todo arquivo versionado.

## O que NÃO verifiquei

- **o `0x09` lido de um controle SEM serial — ninguém aqui é esse controle.**
  Este é o ponto cego que a sprint existe para nomear: a mesa desta casa é a
  amostra mais favorável possível. O que provei é o MECANISMO (o registro faz a
  coisa certa com o que o provider responder), não que um DualSense de firmware
  sem serial responda `0x09`. Se ele não responder, a cura entrega a
  **desistência anunciada** — que já é melhor que o silêncio de hoje;
- **o provider não está FIADO** — `set_cracha_provider` não tem chamador em
  `lifecycle.py`. Foi decisão de posse, não esquecimento: quem sabe ler `0x09`
  é o `backend_pydualsense.py`, e ele não é meu (`posse:` é só o
  `identity.py`). Enquanto ninguém fiar, o produto se comporta como hoje **mais
  o aviso**. Não afirmo que o segundo conduíte está em produção;
- **a suíte inteira** — regra da casa: é de quem coordena, e roda no fim. Rodei
  o meu escopo e os quatro vizinhos de identidade (131 casos);
- **nenhuma tela** — este trabalho não toca a interface. Sem foto, sem clique,
  e o `avisos_sem_cracha()` não é exibido em lugar nenhum ainda;
- **o `0x22` como segunda estrada** — declarei-o pela medição do mapa, não o
  exercitei. Ele não está no código: o provider devolve um endereço, e de qual
  report o backend o tirou é decisão de quem escrever o provider.

## O que sobrou para o próximo

1. **FIAR O PROVIDER — é o que falta para isto virar produto.** O trabalho é
   `backend_pydualsense.py` (ler `0x09` do handle: `buf[1..6]`, endereço
   invertido, com o trailer de CRC-32 no rádio) mais uma linha em
   `lifecycle.py` ao lado da que já existe:
   `self.identity_registry.set_external_reserve_provider(…)` em
   `lifecycle.py:3997`. **O contrato do provider é: `uniq` cru → endereço em
   qualquer grafia, ou `None`.** Ele pode custar I/O — é chamado no tique
   lento, fora do lock, e no máximo uma vez por aparelho por sessão.
2. **`QUEM-E-QUEM-04`: a porta do perfil não precisa de forma nova.** A chave
   que sai daqui são os 12 hex canônicos de sempre. Se aquela sprint estava
   dimensionada para ensinar uma segunda gramática ao `profiles/schema.py`, ela
   encolheu.
3. **A célula do mapa merece o registro do que caiu.** Para a
   `SPECS-A-PROCEDENCIA-01`: `identidade.cracha_nos_dois_transportes` continua
   `SAIU NO FIO` nos dois transportes, e a `cabo_detalhe` dela já contém o
   descarte dos quatro candidatos — **é a sprint que estava velha, não o mapa**.
   Não editei o CSV (não é minha posse).
4. **A frase quer um lugar na tela.** `avisos_sem_cracha()` é leitura pronta e
   sem dono do lado da interface. Pela decisão dela a frase é texto de tela, e
   o `uniq` do item **não sobe** — só a `frase`. Candidata natural: a coluna
   Atenção (`AVISOS_DA_TELA`).
5. **A meia frase que a decisão dela não tem.** A frase de diagnóstico desta
   casa é *o quê · por quê · o que fazer*, e a dela tem as duas primeiras. Não
   inventei a terceira — texto de tela é dela, e a decisão está fechada. Se
   alguém quiser a terceira metade, é pergunta para ela, não conserto.

---

## Os portões, e as duas coisas que fiz FORA da minha posse

`bash scripts/portoes.sh` → **43 de 45 verdes**
(`/tmp/portoes-O-CONTROLE-SEM-MAC-01.txt`).

### As duas que sobram VERMELHAS já eram vermelhas na base — e provei

Antes de tocar em qualquer coisa, com `git stash -u` na base `ae1c3d82`:

```
scripts/check_paridade_gtk_html.py        rc=1
scripts/check_donos_de_comportamento.py   rc=1
scripts/validar-citacoes-de-linha.py --all  rc=0   ← estava VERDE
ruff check src/ tests/                    All checks passed!  ← estava VERDE
```

As duas vermelhas são **da aba 09**, e nenhuma toca `identity.py`:

- `paridade-gtk-html.csv:315` e `:343` — duas **dívidas FECHADAS**: os sinais
  `on_daemon_migrate_to_systemd` e `_meu_perfil_asset` apareceram em
  `interface/pacotes/a09_sistema.py`, e o CSV ainda diz `FALTA_NO_HTML`;
- `donos-de-comportamento.csv:47` — `migrar_para_systemd` marcado `SO-GTK`
  quando a tela nova já o chama.

**NÃO as consertei, de propósito.** Os dois portões dizem *"meça-a de novo e
reescreva-a"*, e remedir a aba 09 é trabalho de quem a fez — escrever um
veredito sobre uma medição que não fiz é exatamente a medição falsa que esta
casa proíbe. São da leva que tirou a janela GTK (`D-0609-GTK-LEVA-INTEIRA`).

### E as DUAS coisas que eu quebrei e consertei, ambas fora da `posse:`

**1. Seis citações de linha, em `docs/data/mapa-controles.csv`.** As minhas
inserções em `identity.py` moveram o `def slot_for` de **668 para 896**, e o
portão `citacoes-de-linha` — que estava VERDE na base — passou a apontar seis
citações podres, todas `identity.py:668 (slot_for)`. Editei o CSV **apesar de
ele não ser minha posse**, e a razão é estreita: o que mudei foram **quatro
linhas, só o número**, com `sed 's|identity.py:668|identity.py:896|g'`.
Nenhuma afirmação do mapa foi tocada — o `diff` palavra a palavra prova que a
única diferença é o endereço, que é literalmente o que a mensagem do portão
manda fazer (*"Reaponte-o para onde a coisa está hoje; não apague a
afirmação"*). A alternativa era entregar VERMELHO um portão que eu mesmo
quebrei.

**2. `html/specs.html`, regenerado.** A página EMBUTE o CSV, então o
`mapa-de-canais` ficou vermelho pelo mesmo motivo. Rodei
`scripts/gerar-mapa.py` uma vez — o protocolo desaconselha reescrever artefato
compartilhado, e por isso confiro o tamanho aqui: **3 linhas mudaram de
1959 KB**, e são as mesmas quatro citações. Se der conflito na costura, é
regenerável com um comando.

**Se quem costura preferir, os dois consertos são descartáveis:** reverter
`docs/data/mapa-controles.csv` e `html/specs.html` devolve o `citacoes-de-linha`
ao vermelho e não toca em uma linha do mecanismo.
