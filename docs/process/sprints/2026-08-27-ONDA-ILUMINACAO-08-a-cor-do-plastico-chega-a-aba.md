---
sprint: ONDA-ILUMINACAO-08
# onda: ILUMINACAO (ver a nota de frontmatter da ONDA-ILUMINACAO-01)
posse:
  ILUM08:
    - src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
cria:
  - tests/unit/test_ilum_08_a_cor_do_plastico_na_aba.py
bancada: true
depois_de:
  - ONDA-ILUMINACAO-02
  - ONDA-ILUMINACAO-07
  # SÉRIE, por R5: esta sprint divide src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-ILUMINACAO-01
  - ONDA-ILUMINACAO-03
  - ONDA-ILUMINACAO-04
  - ONDA-ILUMINACAO-05
  - ONDA-ILUMINACAO-06
  - LEVA-1  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/config/secao_controles.py
  - src/hefesto_dualsense4unix/integrations/cor_do_plastico.py
  - src/hefesto_dualsense4unix/gui/main.glade
---

# ONDA ILUMINAÇÃO · 08 — A cor do plástico chega à aba (e o "Corrigir")

**O defeito, em uma frase:** a aba que desenha o controle na cor do plástico não
tem como saber essa cor — a leitura existe, e desde 27/08 responde nos **dois**
transportes, mas só uma tela no produto inteiro a consome.

## Onde está hoje, medido

- a leitura no produto: `integrations/cor_do_plastico.py` — pede o serial de
  fábrica pela família `SET_FEATURE 0x80`, decodifica os caracteres 5 e 6, e
  traduz por duas tabelas de procedências diferentes (`NOMES_DE_FABRICA` e
  `TONS`), com **21 códigos** de uma zona só;
- **o único chamador é a aba Conexões**: `_perguntar_as_cores`
  (`app/actions/config/secao_controles.py:916`), com `tom_para_a_borda`
  aplicado em `:954`;
- **o filtro do cabo continua no código, e ele é NOSSO**:
  `if … transporte != "usb": continue`
  (`app/actions/config/secao_controles.py:930`). A linha está lá e descreve a
  árvore de hoje. O que caducou é a RAZÃO dela:

  > **FATO ERRADO, SUBSTITUÍDO (27/08/2026).** Este item dizia *"No rádio a
  > leitura não acontece — é por isso que existe o 'Corrigir'"*. Não era o rádio
  > que não deixava: era **a semente do nosso CRC**. Assinar o `SET_REPORT` com
  > `0xA3` (`DATA|FEATURE`, o feature que CHEGA) devolve `errno 5`; com `0x53`
  > (`SET_REPORT|FEATURE`, o que SAI) o aparelho responde. Foram **duas**
  > medições em 27/08, mesmo comando e só a semente mudando: `hidraw7` no cabo
  > (`05`, Starlight Blue) e `hidraw8` **no rádio** (`02`, Cosmic Red), os dois
  > sãos depois. A medição inteira está em
  > `docs/protocol/dualsense-referencia-canonica.md:1574-1663`, e leia-a antes de
  > escrever uma linha desta sprint. A lápide velha — *"não é o BlueZ, não é o
  > uhid, não é o kernel, não é o daemon — é o aparelho"* — **já saiu do fonte**,
  > substituída em `cor_do_plastico.py:403-418`; o que continua lá é o filtro.

  Para quem executa, a consequência é curta: a trava deixou de ser *"o aparelho
  não deixa"* e virou *"o nosso filtro não deixa"* — e o conserto, que é barato,
  **não é desta sprint** (ver "O que fica combinado com quem coordena");
- a correção à mão já existe e já grava: `_ao_declarar` (`:1115`) acumula no
  `_maquina_pendente` e o rodapé grava no `maquina.json` pelo
  `fundir_declaracao`; a borda repinta na hora (`_repintar`, `:1146`);
- a trava: a família `0x80` é a mesma em que um par errado **reseta o
  controle**. Por isso a pergunta é feita **uma vez por endereço e por sessão** e
  o payload é montado por função sem parâmetro e conferido byte a byte
  (`cor_do_plastico.py:16-27`). **Nada disso se reescreve aqui**, e o rádio não
  afrouxou nada: a escrita continua sendo escrita.

## O que entrega

1. **A aba Iluminação lê a cor declarada/lida** e a entrega ao desenho da
   ILUM-02 — a borda grossa é a identidade da peça
   (**D-A-BORDA-E-A-IDENTIDADE-DA-PECA**).
2. **A fonte é uma só**: a declaração dela vence a leitura, e a leitura vence a
   tabela — a mesma ordem que a aba Conexões já aplica (`_tom_da_cor`,
   `app/actions/config/secao_controles.py:1578`). **Não se escreve uma segunda
   leitura do `maquina.json` nesta aba**; consome-se a que existe. Esta
   precedência ficou **mais** importante, não menos: com leitura nos dois
   transportes, há agora um valor lido competindo com a declaração em quase todo
   controle, e é a ordem que decide quem ganha.
3. **O botão "Ver a cor do plástico / Corrigir"**, ali do lado do desenho. Com a
   cor lida nos dois transportes, **o campo onde a pessoa DECLARA a cor deixa de
   ser o caminho principal**. Ele não some — vira **correção**, para exatamente
   três casos:
   - **código desconhecido**: `cor_do_codigo` devolve `None`
     (`cor_do_plastico.py:204`) — a tabela tem 21 entradas e a Sony fabrica
     edição nova sem avisar;
   - **controle externo** (8BitDo, Pro Controller): não tem serial de fábrica
     Sony e é filtrado por VID:PID (`cor_do_plastico.py:419-420`). Para ele o
     campo continua sendo o **único** caminho — nunca "correção";
   - **quando ela discorda** do que o aparelho respondeu: a declaração vence a
     leitura.

   Com a cor sabida, o botão só mostra; nos três casos acima, o texto convida a
   declarar.
4. **Nada de comando novo ao aparelho por esta aba**: quem pergunta continua
   sendo a rota de Conexões, uma vez por endereço e por sessão. Esta aba **lê o
   que já foi perguntado**.

## A mordida

`tests/unit/test_ilum_08_a_cor_do_plastico_na_aba.py`:

- **precedência**: com declaração dela `starlight-blue` e leitura `cosmic-red`, o
  desenho recebe `starlight-blue`. Invertido, reprova;
- **sem nada**: sem declaração e sem leitura, o desenho recebe o neutro e o botão
  fica no estado que convida a declarar — **"Não sei" não vira cor inventada**;
- **o rádio não é motivo de "Corrigir"**: uma entrada com transporte de rádio e
  cor **lida** chega ao desenho pintada, e o botão fica no estado de MOSTRAR, não
  no de corrigir. **A régua olha o ESTADO, nunca a palavra** — a palavra é dela e
  ainda está em aberto (decisão 2); teste que casa literal carimba texto que ela
  não aprovou. Sem essa régua, alguém copia o `transporte != "usb"` da aba
  Conexões para cá e carimba no desenho um defeito nosso como se fosse do
  aparelho;
- **zero escrita no aparelho**: um dublê de hidraw que **explode se for
  escrito**. A aba monta, repinta, troca de alvo, e o dublê nunca é tocado. A
  razão desta régua mudou e ela ficou mais dura: não é mais *"impedir que alguém
  resolva a cor faltante mandando um `0x80` daqui"* — agora que a pergunta
  funciona nos dois transportes, ela é de **POSSE**. Um perguntador só no produto
  inteiro, com o cache de uma vez por endereço e por sessão. Duas telas
  perguntando é a família de fábrica saindo duas vezes por controle;
- **o Midnight Black não some**: `tom_para_a_borda` é aplicado — sem ele a borda
  do preto desaparece no fundo escuro, que é o caso difícil que a função já
  resolve.

Arranque a precedência e o primeiro caso reprova nomeando as duas cores.

## Por que `bancada: true`

Só para a **conferência final na peça**: uma foto da aba com um controle no cabo
e outro no rádio, e **os dois com a cor LIDA**. O código e os testes não precisam
de bancada — quem for executar pode escrever tudo antes de pedir a bancada.

> **FATO ERRADO, SUBSTITUÍDO (27/08/2026).** Esta seção encomendava *"uma foto da
> aba com um controle no cabo e outro no rádio, provando que o do rádio cai no
> caminho do 'Corrigir'"*. Era a prova de um defeito **nosso**, e invertida:
> aprovar essa foto carimbaria como correto exatamente o que a medição derrubou.
> A cor do rádio existe; quem não a mostra é o nosso filtro.

Enquanto o caminho do rádio não chegar ao produto, o controle no rádio ainda cai
no "Corrigir" — **isso é pendência, não é o comportamento a fotografar**: a foto
espera, a sprint não.

## O que é dela decidir

1. **O botão fica também na Iluminação, ou só em Conexões?** O mesmo fato em duas
   telas exige sincronia (**D-AS-ABAS-CONVERSAM**), e o contrato traz o botão
   para cá. Ela decide vendo.
2. **A palavra do botão**: "Ver a cor do plástico" e "Corrigir" são dois textos;
   o contrato os põe num só com barra. Texto de tela é dela — e a escolha mudou
   de peso: "Corrigir" era o caminho comum e passou a ser a exceção de três
   casos, então a barra pode estar oferecendo o raro com o mesmo tamanho do
   frequente.

## O que fica combinado com quem coordena

- **O caminho do rádio no produto não é desta sprint, e já tem dona:**
  **ONDA-CONEXOES-11**, que possui `integrations/cor_do_plastico.py` e
  `secao_controles.py` — os dois arquivos do `nao_toca` daqui. Portar a semente
  `0x53` e derrubar o `transporte != "usb"` de `secao_controles.py:930` é lá.
  Quem executar aqui **não** encosta neles. **A foto de bancada desta sprint
  depende da CONEXOES-11**, e é de quem coordena decidir se isso vira `depois_de`
  ou só espera a foto.
- **A cor por zona também não é desta sprint.** A fonte de cor a consumir agora é
  `docs/data/cores-do-dualsense.csv` — **28 modelos × 10 zonas**, contra os 21
  códigos de uma zona que o produto conhece — e o desenho já sabe pintar por zona
  (`scripts/gerar_cores_do_dualsense.py`, com o portão
  `scripts/check_cores_do_dualsense.py`). Ligar esse CSV ao produto é **sprint
  nova, que quem coordena vai escrever**; aqui se consome a cor de uma zona que
  existe hoje.

## Fontes

- contrato: `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 4, tabela
  de botões, linha *"Ver a cor do plástico / Corrigir"*;
- decisão: **D-A-BORDA-E-A-IDENTIDADE-DA-PECA**;
- a medição dos dois transportes e a semente do CRC:
  `docs/protocol/dualsense-referencia-canonica.md:1574-1663`;
- a decisão dela de 21/08, que já autorizava o rádio e **não precisa ser
  reaberta**: `docs/data/cores-do-plastico.md:15-17` — *"o padrão é leitura
  automática (pelo cabo hoje, pelo rádio quando a ponte existir), e a pessoa pode
  escolher a cor — a escolha dela vence a tabela"*. A ponte existe desde 27/08;
- as cores por zona: `docs/data/cores-do-dualsense.csv` (31 linhas são SEM-HEX —
  iridescente, camuflado, metálico e arte não cabem num `fill`, e **inventar hex
  é proibido**: a receita está na coluna `nota`).
