---
estado: aberta
---

# ONDE PARAMOS — 08/09/2026: a coluna da direita, e o conferente que derrubou a própria cura

> **ESTE ARQUIVO É SEGURO CONTRA QUEDA DE SESSÃO.** Ordem dela, 08/09/2026:
> *"sempre documenta pensando em caso a sessão caia"*. Quem chegar sem contexto
> nenhum consegue continuar daqui, sem ler transcript.

## §0 — O estado em uma linha

Árvore de integração `_integra-0609` em **`b5ed84ef`**, branch `onda/atual-0609`,
limpa, **49 portões verdes**. A mesa dela tem **os quatro DualSense** — dois no
cabo (P2, P3), dois no rádio (P1 roxo, P4 azul). O daemon dela está **vivo** e
não pode ser reiniciado sem a palavra dela.

## §1 — A ORDEM DELA, e ela é a régua de aceitação

Ela colou uma tabela de duas colunas — «✓ na árvore» e «falta» — e mandou:

> *"Rodo essa conferência de novo antes do merge, com as duas levas dentro — se
> alguma [ficar n]a direita, ela não passa para o dev. conclui isso antes tá
> bom? roda o install documenta e afins. garanta tudo incluindo tudo conectado
> na interface do app"*

E depois:

> *"tenta garantir pra que o produto como um todo esteja completo até amanhã de
> manhã tá bom? manda agentes revisores de conversa. documenta dores, corretores
> de problemas ou bugs não mapeados. roda uma verdadeira leva de controle de
> qualidade tá bom? tudo dentro do nosso Dev e após nosso install"*

**A CONFERÊNCIA VIROU PORTÃO:** `scripts/check_a_conferencia_dela.py`. Uma linha
por item, medida no **publicado**, nunca no mockup. `rc=1` enquanto sobrar
alguma coisa na direita.

Ele fica **fora** do `portoes.sh` e do CI de propósito, declarado em
`_SEM_CHAMADOR_HOJE` (`tests/unit/test_portao_todo_portao_tem_chamador.py`) com
a linha exata que o ligaria: a linha da cor única abre o socket do daemon vivo e
lê o `lightbar_rgb` de cada controle. Nem o CI nem worktree de agente têm quatro
DualSense conectados.

```bash
PYTHONPATH=$PWD/src .../python scripts/check_a_conferencia_dela.py
```

## §2 — A conferência, medida em 08/09 às 01h

| | linha | veredito |
| --- | --- | --- |
| ✓ | os 4 players nas dez abas | portão `os-quatro-lugares --publicado` |
| ✓ | a tela não confessa dívida nossa | **`A_DIVIDA` VAZIA** — as 4 saíram |
| ✓ | a tela não narra commit nem id de sprint | as dez, dentro da janela |
| ✓ | máscara Nintendo Pro no FLAVORS | 42 entradas |
| ✗ | Iluminação sem o «Automático» | 1 frase dentro da janela |
| ✗ | o «Virtual» liga o microfone | **curado na branch, não integrado** |
| ✗ | cor única entre controles | **`COLISÃO: jogadores [1,2] em #0000FF`** |

### A cor no plástico AGORA (lida do daemon, não da tela)

```
P1  bt   #0000FF   a0fa9c0000f0    roxo
P2  usb  #0000FF   444648000003    devia ser #FF0000   COLIDE
P3  usb  #00FF00   143a9a0000ab    ok
P4  bt   #FF0000   d42f4b0000d8    devia ser #FF0080
```

**A CAUSA, isolada:** os dois errados são os dois que têm override por MAC no
`personalizado.json`; os dois certos são os dois sem. O merge por campo
(`core/backend_pydualsense._merged_desired_for_key`) é
`default global < camada AUTOMÁTICA < override por-uniq < CO-OP < jogo` — o
override por MAC vence a camada automática.

**E É ESTRUTURAL:** o override é por MAC e CONGELADO; o número do jogador é de
SESSÃO e muda com a ordem de conexão. Azul era a cor certa do controle que
gravou no dia em que ele era o 1; hoje ele é o 2.

## §3 — A leva `wf_1de8f6da-e3c`, e o conferente que derrubou a cura

Duas frentes, cada uma em worktree própria, cada uma com advogado do diabo.
**As duas worktrees nasceram 1448 commits atrás** e as duas foram adiantadas
para `2cf26516` antes de trabalhar — a armadilha de sempre.

### `voo/FECHA-AUDIO-01-opus` — o «Virtual» liga o microfone. DE PÉ.

O `0x32` do rádio tinha UM dono (só `RUNNING` liga) onde precisava de DOIS em OU.
`pactl set-default-source` **não** põe nó em `RUNNING`, então o gesto dela
deixava a source `SUSPENDED` e o `0x32` saía DESLIGADO. Cura em
`integrations/dualsense_bt_audio.py`: `dizer_o_pedido_dela` (:1132), estado de
três valores, e o OU em `_talvez_seguir_a_source` (:1378) ANTES do intervalo.
`False` desliga sem consultar (o mudo dela vence um app gravando), `True` liga,
`None` devolve tudo ao ouvinte. **Não escreve da thread do ato** — guarda o campo
e o `_loop` aplica em ≤250 ms, senão o contador de sequência do 0x32 ganha dois
donos. TREZE mordidas. 49 portões verdes.

**O QUE ELE MESMO DECLARA ABERTO, e é o mais importante:** a cura **não foi
medida no aparelho**. Doze réguas mordem e nenhuma é o DualSense.

### `voo/FECHA-ILUMINACAO-01-opus` — cor única. **DERRUBADA PELO CONFERENTE.**

O relatório dizia FECHOU. O conferente mediu no backend REAL, com o handler IPC
REAL, e achou CINCO coisas. As três primeiras sozinhas derrubam:

1. **O BROADCAST DELA MORRE.** `led.set {rgb:[0,255,0]}` **sem** `uniq` — o
   "pinta os quatro de verde" — passou a escrever `[verde, vermelho, azul, rosa]`.
   Na base escrevia os quatro verdes. E o IPC responde `status: ok,
   aplicado_em: [os quatro]` — **diz aplicado em quatro tendo aplicado em um**.
   É o `BROADCAST-QUE-NAO-MENTE-01` ressuscitado.
   Pior: o P1 fica VERDE (a cor do número do 3) e o P3 fica AZUL (a do 1) — a
   regra "quem pede a cor do próprio número fica com ela" sai **invertida**.
   A régua dele dá verde por cima porque põe DOIS controles e escolhe o VERDE,
   que numa mesa de dois não é cor do número de ninguém. *O nome do teste
   promete a mesa dela; o corpo mede o único arranjo em que o defeito não
   aparece.*

2. **CRASH não declarado.** `test_troca_de_player_01_a_escolha_sobrepoe.py::
   test_a_escolha_de_cor_a_mao_vence_a_cor_do_numero` — verde na base, VERMELHO
   na branch, isolado. `AttributeError: 'PyDualSenseController' object has no
   attribute '_handles'` dentro do `_mesa_de_cores_locked` novo. O relatório
   afirma "nenhuma regressão minha".

3. **A TELA VOLTA A CONFESSAR, pela ARMADILHA DA PROSA — 5ª vez.**
   `interface/aba04.py:1491` põe `<!-- noqa-acento: ... -->` DENTRO de um
   comentário HTML já aberto. **Comentário HTML não aninha:** o `-->` de dentro
   FECHA o de fora e o resto vira corpo. A página passa a mostrar, visível, o
   hash `2c228352` e a prosa do botão morto — o defeito que a frente diz curar,
   na mesma página, pela mão do conserto.
   A régua nova não pega: `_BOTAO_MORTO = "autom"+"ático"` só casa a palavra
   ACENTUADA, e o bloco vazado escreve "automatico".  <!-- noqa-acento: a forma SEM acento é o defeito descrito -->
   **E a árvore fica internamente incoerente:** o HTML commitado não é o que o
   gerador commitado emite. Os portões só passam porque ninguém regerou.

4. **O mapa ficou com endereço podre.** OITO promessas de símbolo quebradas em
   24 citações do backend, porque o conteúdo andou e o número não. O
   `citacoes-de-linha` não vê: a pergunta 2 dele só dispara em duas formas
   sintáticas, e a célula usa a forma `` :N (`SIMBOLO` ...) ``.
   **Portão verde aqui NÃO é prova.**

5. **A regra não é "sempre".** `_mesa_de_cores_locked` faz
   `if not r.cor_por_controle: continue` — a cor GLOBAL fica fora da mesa. Com
   `auto_player_colors: false`, dois overrides idênticos da paleta ficam os dois
   `#0000FF`. E a guarda da interface ficou em UM gesto: `cor` ganhou
   `_sem_repetir_a_cor_do_vizinho`; **`reenviar` (`a04_iluminacao.py:2264`) não**.

## §4 — A DECISÃO DE PRODUTO que a segunda volta implementa

O próprio relatório nomeia a causa: *"fechar isso pede um campo de procedência no
esquema, que é decisão de produto."* **Decidido em 08/09/2026** (ela delega
decisão de produto; a exceção é validação de tela, que é dela):

> **O override de cor por MAC ganha PROCEDÊNCIA — para qual número ele foi
> escolhido.** Quando o número daquele aparelho muda, a cor gravada é FÓSSIL e
> sai sozinha, caindo de volta na paleta automática.

Isso resolve os três casos dela sem matar o broadcast:

| caso dela | o que acontece |
| --- | --- |
| ninguém escolheu cor | paleta automática, única por construção — cores de fábrica por número |
| ela escolhe X | grava com procedência = o número dela HOJE; o amigo é recusado no GESTO, com o recado dizendo de quem é a cor |
| override congelado de outro número | fóssil — ignorado, cai na paleta |
| `led.set` sem `uniq` (broadcast) | procedência = `broadcast`; **nunca é deslocado** |

**O QUE ISSO EVITA:** deslocar no RESOLVEDOR, que é onde broadcast e colisão são
indistinguíveis — foi exatamente aí que a primeira volta quebrou o produto.

## §5 — O SOM: seis passadas, silêncio, e o que sobra

Rodado em 08/09 no roxo dela (P1, rádio), com
`scripts/ensaios/o_som_que_sai.py --escrever --eu-estou-ouvindo`:

| passada | arranjo | bloco | registradores antes | ela ouviu |
| --- | --- | --- | --- | --- |
| 1 | ds5dongle | 0x13 | nenhum | nada |
| 2 | senshi | 0x13 | nenhum | nada |
| 3 | ds5dongle | 0x13 | rota 3 + vol 85 + sem mudo | nada |
| 4 | senshi | 0x13 | idem | nada |
| 5 | ds5dongle | 0x16 | idem | nada |
| 6 | senshi | 0x16 | idem | nada |

251 reports aceitos pelo kernel por passada, **zero recusa**, nas seis.

**O QUE O MAPA ENSINOU e o ensaio ignorava** (`audio.alto_falante*`):
* São TRÊS campos, não um: rota (`common[7]`), volume (`common[5]`) e pré-amp
  (`common[37]`). O kernel escreve os três juntos.
* **Por rádio o kernel NUNCA escreve nenhum dos três** — o gatilho é USB-only
  (`hid-playstation.c:1653`, dentro do `if (bus == BUS_USB)`).
* Sem alguém escrever volume o alto-falante fica MUDO — medido com a orelha dela
  em 15/08: volume 0 = "mudo", `speaker volume 85` = **"bep bep bep"**.
* Rota 3 = `R -> alto-falante`; o interno é MONO e come só o canal R. Rota 0 sem
  fone = silêncio.
* **O canal esquerdo se perde:** quem levar áudio ao alto-falante tem de SOMAR
  L+R. Quem salva hoje é a conversão 2→4 do PipeWire, que é política dele.

**A HIPÓTESE QUE SOBRA, e ela é de TRANSPORTE:** a semente do CRC-32 do
DS5Dongle é `0xEADA2D49`, que é o CRC do byte `0xA2` do cabeçalho HIDP que
`src/bt.cpp:846-861` prefixa antes de mandar pelo canal de interrupção **L2CAP**.
Nós escrevemos por `write()` no `/dev/hidrawN`, onde quem monta o HIDP é o
KERNEL. Se o enquadramento não bater byte a byte, o CRC cai no lugar errado e o
firmware **descarta calado** — sintoma indistinguível do que vimos.

**UM TERCEIRO CANDIDATO APARECEU**, proposto pela frente do áudio e ainda não
tocado: `--arranjo common-preservado`, contra as passadas de `[2]=0x91`. Custa
minutos e resolve a ressalva (b) do mapa, aberta desde 31/08.

**O QUE O MAPA PROÍBE ESCREVER, com todas as letras:** *"NÃO ESCREVER, EM LUGAR
NENHUM, que 'descobrimos o áudio por Bluetooth' ou que a ponte funciona. Não
funciona, e não há ponte: há um canal que responde. FALÁCIA DO CANAL QUE
RESPONDE."*

### O microfone pelo rádio FUNCIONA

1133 quadros, 0 drops, **−34,8 dBFS — mais alto que pelo cabo** (−44 a −52). A
cura foi derrubar um `module-pipe-source` ÓRFÃO dono do mesmo `source_name`
(commit `825e9516`). A captura armada (`scripts/ensaios/a_captura_armada_do_som_no_radio.py`)
subiu INTEIRA pela primeira vez em 08/09: 39.029 quadros ACL do `btmon` +
18.865 reports de entrada. Faltou só o gesto dela (o botão de mudo do plástico).

## §6 — O que saiu da tela em 08/09 (`b5ed84ef`)

`A_DIVIDA` do `check_a_tela_nao_confessa.py` está **VAZIA**. Quatro confissões
viraram o fato útil que elas escondiam:

| antes | agora |
| --- | --- |
| "Ainda não sei olhar este lançador" | "O perfil casa pelo nome do processo e pela janela." |
| "mas ainda não sei olhar dentro dele" (`DIZ_ACHEI`) | "Achei este lançador aqui (…). O perfil casa pelo nome do processo e pela janela." |
| "O perfil ainda não tem por onde limitar estes" | "Estes ficam livres do teto do perfil." |
| "O Hefesto ainda não lê a cor por rádio" | "Pelo rádio a cor do plástico vem da lista." |

**A QUARTA NÃO ESTAVA DECLARADA**, e é ponto cego escrito na tabela: a régua
olha o COMEÇO da frase, e o `DIZ_ACHEI` punha a confissão DEPOIS de um "Achei".
Quem puser confissão no meio de uma frase que começa bem continua passando.

**MORDIDA:** confissão devolvida ao `external_card.py` → `rc=1`; texto novo de
volta → `rc=0`.

## §7 — A FILA, na ordem dela

1. **Segunda volta da Iluminação** — os 5 defeitos da §3, com o desenho da §4.
2. **Conferente do áudio** (o 7º agente da leva) — ler o veredito antes de integrar.
3. **Integrar as duas branches** por `cherry-pick`, nunca `git apply` cego.
4. Tirar a frase do «Automático» que sobra na aba 02 (a frente do áudio a possui).
5. `scripts/check_a_conferencia_dela.py` → tem de dar **`rc=0`**.
6. `git add -A && bash scripts/portoes.sh` → 49 verdes.
7. A suíte em **DOZE LOTES**, nunca num processo só.
8. **Merge em `dev`**, feito de dentro da árvore DELA
   (`/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix`, que fica em `dev` sempre).
9. `./install.sh --yes` na árvore DELA. **NUNCA com `sudo`** (o `HOME` vira
   `/root`), **NUNCA** em `_integra-0609`. Ele reinicia o daemon e os quatro
   controles dela caem.
10. **A leva de QA que ela pediu**, DEPOIS do install: revisores de conversa,
    caçadores de bug não mapeado, dores documentadas.
11. O ensaio da orelha: `o_som_que_sai.py` com `--arranjo common-preservado`.

## §8 — As travas que não se negociam

* **Senha sudo dela: NUNCA em arquivo.** Ela a libera na conversa quando precisa.
* **Nunca parar nem reiniciar o daemon dela** sem a palavra dela. `start` numa
  unit inativa pode; `restart` nunca.
* **Saída de comando vai para ARQUIVO**, nunca crua no terminal — o terminal
  dela é o mesmo da conversa.
* **Nunca `pkill -f`.** Mate por PID conferido; um `pkill -f` derrubou o
  compositor dela.
* **Nenhum MAC real em arquivo versionado.** Máscara: octetos 4 e 5 zerados.
* **Toda janela nasce `--oculta`.** Ela tem UMA tela.
* **Nunca gravar o microfone dela em disco.**
* **A árvore dela fica em `dev`, sempre.** Integração em árvore própria.
* **A tela nunca confessa dívida nossa.** A dívida vai para o mapa.

