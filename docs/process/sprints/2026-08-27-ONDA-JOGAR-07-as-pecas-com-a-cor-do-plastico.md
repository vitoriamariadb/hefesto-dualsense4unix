---
sprint: ONDA-JOGAR-07
posse:
  J7:
    - src/hefesto_dualsense4unix/app/actions/jogar/pecas_na_mesa.py
  J7b:
    - src/hefesto_dualsense4unix/app/actions/config/secao_controles.py
    - install.sh
    - scripts/check_packaging_parity.sh
cria:
  - tests/unit/test_jogar_a_peca_tem_a_cor_do_plastico.py
  - tests/unit/test_a_cor_lida_vai_para_o_disco.py
bancada: true
depois_de:
  - ONDA-JOGAR-01
  # SÉRIE, por R5: esta sprint divide install.sh
  # e scripts/check_packaging_parity.sh
  # e src/hefesto_dualsense4unix/app/actions/config/secao_controles.py
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-VIBRACAO-01
  - ONDA-CONEXOES-05
  - ONDA-CONEXOES-06
  - ONDA-CONEXOES-09
  - ONDA-CONEXOES-11  # nasceu em 27/08 à noite: é ela que levanta o filtro do cabo
  - ONDA-ILUMINACAO-02
  - IDENTIDADE-01  # fechou em 54b7ffd2 (o app-id e a migração); a série é nominal
  - LEVA-1  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
  - LEVA-4  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
  - LEVA-DE-BACKGROUND-01  # fechou no merge 27e6c4a6 (as sete frentes); a série é nominal
  - MOTOR-DO-ARRANJO-01  # sprint antiga ainda aberta: a onda vem depois, em série (R5)
nao_toca:
  - src/hefesto_dualsense4unix/app/widgets/controller_card.py
  - src/hefesto_dualsense4unix/app/actions/status_actions.py
  - assets/control-svg/
---

# ONDA JOGAR · 07 — as peças com a cor do plástico

**Onda:** JOGAR (aba 1). **`bancada: true`** — a prova exige DualSense de
verdade na mesa, e desde 27/08 ela vale **nos dois transportes**.

## O defeito, em uma frase

O desenho do DualSense está no disco desde 11/08, com 32 peças nomeadas — e
desde 27/08 com os **28 colorways em dez zonas** dentro do próprio SVG
(`assets/control-svg/dualsense.svg:49`). `grep -rn 'control-svg' src/` continua
devolvendo **zero**.

## O que o mockup manda

No quadro *Conectado agora*, à esquerda, uma peça por controle:

```
[SVG do DualSense na cor do plástico]
Sony • Player 1
Cosmic Red • USB                    100%
```

com **borda grossa da cor do plástico**. Palavra dela, duas vezes:

> *"ahhhhh, a borda do controle sempre tem a cor do plástico... e quando
> selecionado o interior segue verde mas a **borda grossa** é a cor do
> controle."*

> *"pode deixar a borda dos svgs do controles com as linhas grossaas e nas
> mesmas cores do tipo de controle?"*

E o formato do rótulo, ditado por ela:

> *"Sony • Player 1 • Cósmic Red • BT"*

E o SVG não pode ficar **careca** — ela reprovou duas versões por isso:

> *"o complicado do controle assim é que sem a parte superior do touch do
> controle parece que ele tá careca"*

Legenda do mockup, aprovada: *"Sem card por controle — só a contagem e as
peças, com o SVG pequeno na cor do plástico. O card completo é da aba
Controles."* Isso responde a pergunta 1 do redesenho.

## As três travas medidas

**1. A cor é lida e jogada fora — e quem recusa o rádio é o NOSSO filtro.**
`_perguntar_as_cores` (`app/actions/config/secao_controles.py:916`) só pergunta
no cabo (`transporte != "usb"` pula, `:930`) e a resposta só **repinta a borda**
(`_chegou_a_cor`, `:936`) — nunca vai para o disco. O `if` do `:930` não é o
único ponto: `cor_do_plastico.no_do_controle` (`:382`) devolve nó **só para
DualSense no cabo** — `_e_dualsense_no_cabo` (`:369`) exige o barramento USB
(`_BUS_USB`, `:165`), e a recusa é o `return None` de `:446`. Gravar o que se
leu conserta a borda de **quatro abas de uma vez** (P2).

**FATO ERRADO, SUBSTITUÍDO (27/08/2026).** A razão desse filtro, escrita no
próprio código, **era** *"por rádio o firmware do controle RECUSA o `0x80` (…)
Não é o BlueZ, não é o uhid, não é o kernel, não é o daemon — é o aparelho"*.
**Não era o aparelho: era o nosso CRC** — a semente é `0x53`
(`SET_REPORT|FEATURE`, o feature que SAI) e não `0xA3` (`DATA|FEATURE`, o que
chega); assinar com a errada devolve `errno 5`. Um DualSense desta bancada
respondeu **pelo rádio** com o `0x53` (`hidraw8`, serial `F55602…`, Cosmic Red),
e o cabo confirmou no outro (canônica `:1611-1616`; bruto em
`docs/data/ensaios.csv:100`). O próprio código já carrega essa lápide
(`cor_do_plastico.py:403-418`); o filtro do cabo continua lá porque ninguém o
tirou ainda. **Levantar o filtro é de quem tem a posse de `cor_do_plastico.py`,
não desta sprint** — o que esta sprint deve garantir é não escrever nada que
precise ser desfeito no dia em que isso acontecer.

**2. O desenho não é empacotado.** `install.sh:3053-3058` copia
`assets/glyphs/*.svg` e mais nada. Pôr o desenho na tela sem mexer no install e
no `scripts/check_packaging_parity.sh` produz **um card vazio numa máquina
instalada, sem um erro no log** — o pior defeito possível, porque não deixa
rastro.

**3. O tom da borda já tem função pronta.** `cor_do_plastico.tom_para_a_borda`
(`integrations/cor_do_plastico.py:240`) e **só a aba Conexões a chama**
(`secao_controles.py:954`). Não escrever uma segunda.

## O que esta sprint entrega

1. **`pecas_na_mesa.py`** — uma peça por controle da mesa, DualSense e
   externos, com o SVG de `assets/control-svg/`, borda grossa por
   `tom_para_a_borda`, e o rótulo no formato dela. **O corpo a peça NÃO pinta:**
   ela só escolhe o colorway (`data-colorway`, com o slug da coluna `id` de
   `docs/data/cores-do-dualsense.csv`), porque desde 27/08 o `<style>` de
   `assets/control-svg/dualsense.svg:49` é **gerado** daquele CSV por
   `scripts/gerar_cores_do_dualsense.py` — 28 modelos e **dez zonas**, com
   hachura nas 31 linhas SEM-HEX e corte duro nas cascas partidas (Spider-Man 2,
   God of War 20th, onde `casca_esq` e `casca_dir` são cores diferentes). Um
   `fill` escrito à mão aqui cria exatamente a segunda verdade que aquele CSV
   nasceu para matar.
2. **A cor lida vai para o disco**, por endereço da peça — para que a **sessão
   seguinte** e o **controle ausente** (guardado, desligado, fora da mesa agora)
   já nasçam coloridos sem uma única leitura de hidraw.

   **FATO ERRADO, SUBSTITUÍDO (27/08/2026).** A razão escrita aqui era *"para
   que a sessão seguinte, **e o rádio**, já saibam a cor sem perguntar"*. O rádio
   deixou de precisar de carona: a cor se lê nos **dois** transportes, e o que
   travava era a semente do CRC (canônica `:1574-1663`). Persistir continua
   valendo — pela sessão seguinte e pelo aparelho ausente —, mas não vale mais
   como substituto da leitura no rádio.
3. **O `install.sh` copia `assets/control-svg/`**, e o
   `check_packaging_parity.sh` passa a **reprovar** a ausência. Sem esta
   metade, a máquina instalada fica com a peça vazia.
4. **Nada de card cheio aqui.** Entradas, sensores, áudio e "o que chega ao
   jogo" são da aba Controles (D-A-NO-JOGO-FUNDE-COM-A-STATUS).

## Como se prova — o teste que MORDE

`tests/unit/test_jogar_a_peca_tem_a_cor_do_plastico.py`

1. **Um caso por colorway, LIDO da fonte — nunca digitado no teste.** A peça
   escolhe o colorway do desenho e pinta a borda com `tom_para_a_borda(tom)`,
   comparado com a chamada direta da função. Os casos saem de
   `integrations/cor_do_plastico.NOMES_DE_FABRICA` (`:96`) e `TONS` (`:122`), ou
   dos 28 modelos de `docs/data/cores-do-dualsense.csv` — é a disciplina que a
   ONDA-CONEXOES-05 já aplica
   (`docs/process/sprints/2026-08-27-ONDA-CONEXOES-05-o-card-vira-tira.md:161`) e
   a ONDA-CONEXOES-08 também
   (`docs/process/sprints/2026-08-27-ONDA-CONEXOES-08-a-borda-e-a-identidade-da-peca.md:101-102`).
   Escreva um hex à mão e reprova.

   **FATO ERRADO, SUBSTITUÍDO (27/08/2026).** Este item pedia *"cinco casos, um
   por cor de plástico"*. As cinco cores digitadas viraram
   `docs/data/cores-do-dualsense.csv` — 28 modelos e dez zonas, contra os 21
   códigos de UMA zona que o módulo conhece.
2. **A pintura medida no motor de PRODUÇÃO.** O portão
   `scripts/check_cores_do_dualsense.py` mede a pintura no Chrome (`:201`,
   `:229`); a peça na tela dela é `GdkPixbuf`/librsvg
   (`gui/widgets/button_glyph.py:290`). São dois motores, e verde num não é
   verde no outro: o teste carrega o SVG **pelo caminho que o produto carrega** e
   afirma que o corpo saiu na cor do colorway pedido. Sem esta régua, o defeito
   aparece na foto dela, não aqui.
3. **Cor desconhecida ⇒ borda neutra, e a peça continua desenhada.** `cor_do_codigo`
   devolve `None` para código que a tabela não tem (`cor_do_plastico.py:204`), e
   controle externo (8BitDo, Pro Controller) nem chega a ser perguntado — o
   filtro de VID:PID o corta (`:419-420`). Para os dois, a cor **declarada** por
   ela é o único caminho, e um controle sem cor lida não pode sumir da mesa.
4. **A mordida do empacotamento:** o teste resolve o caminho do SVG pela mesma
   função que o produto usa e **abre o arquivo**. Não é um `assert exists` de
   caminho literal — é o caminho de produção. Tire a cópia do `install.sh` e o
   portão de paridade reprova; mude o caminho no código e este reprova.
5. **O desenho não está careca:** o teste exige que os ids da parte superior do
   touchpad estejam no SVG carregado. É a régua da queixa dela, e ela reprova
   a versão que ela já reprovou.
6. **A peça NÃO é um card.** O teste afirma que nenhum glifo de botão, nenhuma
   linha de sensor e nenhuma barra de áudio nasce aqui — é a trava contra o
   card da aba Controles vazar para cá.

`tests/unit/test_a_cor_lida_vai_para_o_disco.py`

7. **Ler a cor e reabrir: a cor persiste.** Grave, recarregue do disco, e a peça
   já nasce colorida sem uma única leitura de hidraw. Arranque a escrita e a
   segunda metade do teste reprova — que é exatamente o defeito de hoje.
8. **Um perguntador só, e a peça não é ele.** Com um dublê que conta comandos
   `0x80`: a peça monta, repinta e remonta **sem mandar nenhum**. Quem pergunta é
   `_perguntar_as_cores` (`secao_controles.py:916`), uma vez por endereço e por
   sessão. A régua conta a **origem**, não o transporte: com o mesmo endereço no
   rádio, a conta da peça continua zero — e a do perguntador pode ser um.

   **FATO ERRADO, SUBSTITUÍDO (27/08/2026).** Este item dizia *"No rádio, a peça
   usa a cor gravada e NÃO pergunta. Com um dublê que conta comandos `0x80`:
   zero. (…) mandar no rádio nunca foi combinado"*. Errado duas vezes. (a) **Já
   era combinado**: `docs/data/cores-do-plastico.md:15-17`, decisão dela de
   21/08 — *"o padrão é leitura automática (pelo cabo hoje, pelo rádio quando a
   ponte existir)"* —, e a ponte existe desde 27/08. (b) Escrita assim, a régua
   passava **porque a cura não existia**: a primeira frente que ligasse a leitura
   por rádio quebraria neste teste e concluiria que tinha estragado algo.

   **A trava que continua inteira é a do PAYLOAD, não a do transporte.** A
   família `0x80` é a mesma em que `[1, 1]` **reseta o controle** e `[12, 1, …]`
   **grava calibração na NVS** (`secao_controles.py:921-922`; canônica
   `:1626-1629`): byte errado escreve onde não devia, e não há desfazer. O
   payload continua montado por função sem parâmetro (`cor_do_plastico.py:294`,
   `montar_pedido`) e conferido byte a byte (`:307`, `conferir_pedido`). Nada
   disso se reescreve aqui.

## O que é dela decidir

1. **O tamanho da peça** e quantas cabem lado a lado antes de quebrar linha.
2. **Onde a cor gravada mora**: no perfil (por peça, dentro de
   `controllers`) ou fora dele, num arquivo de mesa. **A cor é da PEÇA, não do
   perfil** — a mesma peça tem a mesma cor em todo perfil —, então a proposta é
   fora do perfil. É decisão dela porque muda o que um perfil exportado leva
   junto.
3. Se a peça de um controle **externo** (8BitDo, Pro Controller) usa o desenho
   dele (`assets/control-svg/nintendo-pro.svg`, `8bitdo-sn30-pro.svg`, que
   existem) ou um genérico. Externo não tem serial de fábrica da Sony e é
   cortado pelo filtro de VID:PID (`cor_do_plastico.py:419-420`), então para ele
   a cor **declarada** nunca é correção de leitura: é a única fonte que existe.

## O que fica combinado com quem coordena

1. **Esta sprint não liga a leitura por rádio, e não pode travar contra ela.**
   `cor_do_plastico.py` não está na posse daqui; levantar o filtro do cabo é de
   quem o tem. O contrato desta sprint é o de cima: a peça não pergunta, a cor
   persiste por endereço, e nenhuma régua daqui exige ausência de pergunta no
   rádio.
2. **O corpo e a borda saem de fontes diferentes, e elas divergem hoje.** O
   corpo vem do CSV das dez zonas (White casca `#E4E0D8`,
   `docs/data/cores-do-dualsense.csv:71`); a borda vem de `TONS`, de uma zona só
   (White `#edeef0`, `cor_do_plastico.py:123`). Unificar as duas é de quem tem a
   posse de `cor_do_plastico.py` — o que esta sprint não pode fazer é inventar
   uma **terceira** tabela de hexa.
3. **`bancada: true` continua valendo, e agora nos dois transportes:** a prova de
   que a peça nasce colorida sem perguntar se confere com o controle no cabo
   **e** no rádio.

## Fontes

- `novo-layout/01-jogar.html`, `.pecas` e `.cartao`.
- `/tmp/coleta/hoje.md`, falas [8], [31], [34], [48].
- `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, padrões P2 e P4.
- `docs/protocol/dualsense-referencia-canonica.md:1574-1663` — a cor nos dois
  transportes, e a semente `0x53`.
- `docs/data/cores-do-dualsense.csv` — 28 modelos, dez zonas, 31 linhas SEM-HEX;
  gerador `scripts/gerar_cores_do_dualsense.py`, portão
  `scripts/check_cores_do_dualsense.py`.
- `docs/data/cores-do-plastico.md:15-17` — a decisão dela de 21/08: leitura
  automática pelo cabo e pelo rádio, e a escolha dela vence a tabela.
