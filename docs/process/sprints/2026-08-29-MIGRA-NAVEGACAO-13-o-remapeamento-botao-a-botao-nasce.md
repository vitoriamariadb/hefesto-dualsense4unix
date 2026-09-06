---
sprint: MIGRA-NAVEGACAO-13
estado: absorvida
onda: MIGRA-NAVEGACAO
posse:
  NAV6-REMAP:
    - src/hefesto_dualsense4unix/core/remapeamento_de_botao.py
    - src/hefesto_dualsense4unix/app/telas/navegacao/botoes.py
    - src/hefesto_dualsense4unix/daemon/subsystems/coop.py
cria:
  - src/hefesto_dualsense4unix/core/remapeamento_de_botao.py
  - tests/unit/test_migra_navegacao_13_o_remapeamento_botao_a_botao.py
bancada: true
depois_de:
  - MIGRA-NAVEGACAO-11  # mesmo arquivo (botoes.py) — série por R5
  - MIGRA-NAVEGACAO-12
  - ONDA-NAVEGACAO-01
  - ONDA-NAVEGACAO-04
  # SÉRIE, por R5: `daemon/subsystems/coop.py` é disputado.
  - COOP-QUE-NAO-DESMONTA-01
  - COOP-NA-CONEXAO-NATIVA-01
  - ONDA-JOGAR-01
  - ONDA-CONTROLES-07
  # A FILA QUE JÁ RECLAMAVA ESTES ARQUIVOS, medida com
  # `scripts/check_colisao_de_sprints.py` em 29/08/2026. Não é escolha de
  # coordenação: quem divide arquivo executa EM SÉRIE (R5). Reconferir no dia
  # do despacho — a fila anda, e endereço de código envelhece calado.
  - BORDA-DE-QUEDA-01
  - LEVA-1
  - MIGRA-JOGAR-10
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/app.py
  - src/hefesto_dualsense4unix/profiles/schema.py
  - src/hefesto_dualsense4unix/integrations/uinput_mouse.py
  - novo-layout/
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 06). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA NAVEGAÇÃO · 13 — O remapeamento botão a botão nasce, e ele vale antes de o jogo ver

**Decisão dela, 29/08/2026** (`D-O-REMAPEAMENTO-BOTAO-A-BOTAO-ENTRA`):
*"ENTRA, E VIRA SPRINT PRÓPRIA. É feature real: trocar botão por botão é o que
salva jogo que não deixa remapear."*

## O defeito

**Não existe nada.** Medido:

```
grep -n remap src/hefesto_dualsense4unix/profiles/schema.py   ->  0
```

Não há campo de schema, não há IPC, não há subsistema. A pop-up
**Remapeamento dos botões** (`aba06.py`, `TELA_REMAPEAMENTO`) desenha **21
linhas** de "L1 passa a valer como R1" sobre absolutamente nada.

**E o mockup promete onde a troca acontece:** *"É troca de botão por botão, e
ela **vale antes de o jogo ver**."* Isso a põe no caminho quente da entrada — o
`forward_buttons` do vpad (`daemon/subsystems/coop.py`) ou o leitor de evdev.
**Não é uma tabela de tela.**

## Por que é a sprint mais cara desta onda

Sozinha, ela é do tamanho de metade da onda, e o preço tem três partes:

1. **Um campo novo no perfil**, com serialização que OMITE quando vazio — é o
   requisito de compatibilidade que `controllers` e `speaker` já carregam
   (`profiles/schema.py`): sem a omissão, todo save gravaria a chave e um
   binário antigo com `extra="forbid"` rejeitaria **todo** perfil no downgrade,
   não só os que usam a seção. Quem alarga o schema é a `ONDA-NAVEGACAO-01`, que
   é dona do arquivo; esta sprint declara o contrato e **não** abre o schema.
2. **Um lugar no caminho quente**, e ele custa. O `forward_buttons` roda por
   tique, por jogador. Uma tradução com dicionário por evento é barata; uma que
   aloque, não.
3. **Uma regra para o ciclo.** `A→B` e `B→A` é troca; `A→B` e `B→C` é o quê? E
   `A→A`? O mockup não responde, e a lista dele tem um valor de fuga
   (`— Sem troca —`) que é o default de todas as 21.

## O que entrega

1. **`core/remapeamento_de_botao.py`** — puro, sem GTK e sem daemon: recebe o
   mapa declarado e devolve a permutação **resolvida**, ou uma **recusa com
   motivo**. É o molde do `core/disputa_de_botao.py` que a `ONDA-NAVEGACAO-04`  <!-- ref-externa: nasce em ONDA-NAVEGACAO-04, ainda não executada -->
   cria, e da `resolver_teclado_emulado`: a régua nasce pura para poder ser
   testada sem montar nada.
2. **A resolução recusa o que não é permutação.** Dois botões apontando para o
   mesmo destino, ou um ciclo, é recusa **nomeando os dois botões** — nunca uma
   escolha silenciosa. Silêncio aqui vira "meu círculo parou de funcionar e eu
   não sei por quê".
3. **A tradução entra num lugar só**, e a sprint **mede** onde: antes do
   `forward_buttons` (e então vale para o co-op e para o jogo) ou no leitor de
   evdev (e então vale também para o desktop e para os gestos). **As duas
   respostas mudam o produto**, e a diferença tem de ser medida antes de
   escolhida — ver "o que é dela".
4. **O remapeamento NÃO alcança o PS nem os cinco gestos.** Se o PS puder ser
   remapeado, a pessoa perde as duas saídas de emergência com um clique. A
   recusa é do mesmo tipo da sprint 08: travado na tela **e** no daemon.
5. **A pop-up escreve, e o "Voltar ao padrão" dela diz o que apaga.** A frase já
   está escrita no mockup e é a certa: devolver as 21 linhas ao *"— Sem troca —"*,
   e *"As Definições Controle e Mouse não são tocadas"*.

## Como se prova (a mordida)

`tests/unit/test_migra_navegacao_13_o_remapeamento_botao_a_botao.py`:

1. **A troca vale.** Mapa `{l1: r1, r1: l1}` → apertar L1 chega ao jogo como R1
   **e** apertar R1 chega como L1. **Morde:** aplique o mapa uma vez só (sem
   snapshot) e a segunda troca lê o resultado da primeira — o teste reprova
   nomeando o botão que voltou a si mesmo. É o erro clássico de permutação
   aplicada em ordem, e o único jeito de vê-lo é testar a troca **dupla**.
2. **Colisão é recusa com motivo.** `{l1: r1, l2: r1}` → recusa nomeando `l1`,
   `l2` e `r1`. **Morde:** aceite e reprova; recuse em silêncio e reprova
   também.
3. **O PS não se remapeia.** Qualquer mapa com `ps` na origem ou no destino é
   recusado. **Morde:** aceite e reprova, citando que os cinco gestos começam
   nele.
4. **O caminho quente não engorda.** Um teste de custo por tique: a tradução de
   um mapa vazio não pode alocar por evento. **Morde:** troque o dicionário por
   uma compreensão criada a cada chamada e reprova. Sem esta régua o preço só
   aparece no jogo dela, e a queixa chega como "engasgo".
5. **O perfil sobrevive ao downgrade.** Um perfil com a seção nova, lido por um
   `Profile` sem o campo, **não pode** derrubar os outros 28 do disco.
   **Morde:** grave a chave mesmo quando vazia e reprova — é o defeito que
   `controllers` e `speaker` já pagaram.
6. **A bancada, e é dela:** o controle na mão, um jogo aberto que não deixa
   remapear, e o L1 fazendo o que o R1 fazia. Nenhum teste de unidade prova
   isso; é por isso que `bancada: true`.

## O que é dela decidir

- **A troca vale para o jogo, ou vale para tudo?** É a pergunta que decide onde
  o código mora. *"Vale antes de o jogo ver"* (a frase do mockup) sugere o
  caminho do vpad — e então **os gestos e o mouse emulado continuam com os
  botões originais**, o que é bom (o PS+R3 sobrevive) e estranho (o X remapeado
  clica com o botão errado no desktop). `PROVISÓRIO — decisão dela`.
- **O remapeamento é por perfil ou da máquina?** Por perfil é o que a aba
  sugere; da máquina é o que uma pessoa com um controle com botão quebrado
  quer. Os dois têm precedente medido nesta casa.
- **Ele é por controle?** A pop-up diz, no cabeçalho, que as linhas *"valem para
  o controle que navega o PC"* — mas remapear é justamente o que se quer para o
  controle do **jogador 2** cujo X está falhando. `ControllerOverrides`
  (`profiles/schema.py`) é onde isso caberia, e ele **nunca foi escrito uma
  única vez** em 29 perfis de disco.
