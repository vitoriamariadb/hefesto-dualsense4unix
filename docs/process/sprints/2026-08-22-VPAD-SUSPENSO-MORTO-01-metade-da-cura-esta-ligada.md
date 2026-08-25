# VPAD-SUSPENSO-MORTO-01 — metade da cura está ligada

**22/08/2026.** Achado da auditoria de 228 sprints, por um cético que conferia
outra coisa. Não estava em lista nenhuma.

**Estado:** **E1 e E3 FECHADAS** (25/08/2026). **E2 é DELA** — a escolha entre as
duas saídas está medida e escrita abaixo, e as duas mexem em arquivo de outra
frente. **E4 RECUSADA como escrita**, com a medição que a derruba, também abaixo.

---

## O defeito, em uma linha

**Existe quem RETOMA o vpad e não existe quem o SUSPENDE.** A flag
`_steam_input_vpad_suspenso` só pode andar para `False`.

| Função | O que faz | Chamada em `src/` |
|---|---|---|
| `suspend_vpads_for_steam_input()` | põe `True` (`gamepad.py:882`) | **nenhuma** |
| `resume_vpads_after_steam_input()` | põe `False` (`gamepad.py:977`) | `gamepad.py:526` |
| `start_gamepad_emulation_desfecho()` | põe `False` (`gamepad.py:1956`) | (caminho de subida) |

A `suspend_*` só é exercitada por quatro arquivos de teste
(`test_coop_nao_cai_em_silencio`, `test_jogo01_um_dispositivo_por_controle`,
`test_esconder_em_vez_de_sair_01`, `test_aviso_falso_do_coop_01`). **A suíte
verde é o que esconde o defeito:** a função é testada, então ninguém percebe que
produção nunca a chama.

## Por que importa

O estado é lido em **cinco** lugares de produção — recontado em 25/08/2026, e
**nenhum deles pode ser verdadeiro hoje**. (Esta linha dizia "três" e citava
`lifecycle.py:2183` e `hotkey.py:258`; a árvore andou e a conta estava curta.)

| # | Onde | O que fica inalcançável |
|---|---|---|
| 1 | `daemon/lifecycle.py:2254` | `CALADA_VPAD_SUSPENSO` **nunca é devolvida** |
| 2 | `daemon/subsystems/hotkey.py:261` | ramo de modo, num `or` que o outro lado já carrega |
| 3 | `daemon/ipc_handlers.py:2107` | publica `vpad_suspenso` sempre `False` no `state_full` |
| 4 | `app/actions/home_actions.py:1115` | **Onda 2 · Início**: a aba nunca consegue dizer "pelo Steam Input" |
| 5 | `app/actions/emulation_actions.py:408` | **Onda 5 · Emulação**: a frase do vpad recolhido, escrita e revisada, **nunca aparece** |

Os dois últimos são texto que **a pessoa leria na tela**. É o que as duas ondas
esperam desta sprint, e é por isso que ela as trava.

O par `(excecao_ativa, vpad_suspenso)` existe para distinguir dois estados:

- **os dois `True`** — o jogo da allowlist rodando com a entrada entregue a ele;
- **primeiro `True`, segundo `False`** — o jogo da allowlist rodando com o vpad
  **de pé**, porque a suspensão não pôde ser armada.

Como o segundo nunca é `True`, **o produto sempre relata o segundo estado**, e
quem olhar conclui que a suspensão falhou — mesmo quando não havia suspensão a
fazer. É pior que ausência de dado: é dado que mente sempre para o mesmo lado.

E a `CALADA_VPAD_SUSPENSO = "vpad_suspenso_pelo_steam_input"`
(`lifecycle.py:390`) é uma razão de calada que **nunca pode ser emitida**.

## O que NÃO é

Não é a JOGO-01/E2. Aquela sprint pede que a **frase da aba Emulação** leia o
par; esta diz que **metade do par está morta**. Ligar a frase agora escreveria
na tela um estado que o daemon não consegue produzir — foi por isso que a
triagem de 22/08 reclassificou a JOGO-01 de `SO_LIGAR` para **caducada**.

Também não é regressão de hoje: a `resume_*` foi ligada e a `suspend_*` não, e
não achei commit que tenha desligado a segunda. Se alguém achar, a nota vai
aqui.

---

## Entregas

### E1 — descobrir se a suspensão deve existir

**Antes de ligar, medir.** A função existe desde a JOGO-01 (25/07). Três saídas
possíveis, e a resposta muda tudo o que vem depois:

1. **Deve ser chamada e ninguém ligou** — é a família "a casa sabe e o produto
   não faz". Liga-se, com teste que morde.
2. **Foi desligada de propósito** — então a decisão existe em algum lugar e o
   código não a registra. Vira nota datada, e o par de estados vira um só.
3. **Foi substituída** por outro mecanismo (a escada de pontes, de 19/08, faz
   coisa parecida por outro caminho). Aí a `suspend_*` e a flag saem, e as três
   leituras de produção saem junto.

**Prova:** um parágrafo com a resposta e o commit ou a sprint que a sustenta.

#### RESPOSTA (25/08/2026) — é a (3), e a trichotomia estava curta

**Foi SUBSTITUÍDA, por decisão dela, e a substituição parou no meio.**

O commit **`d8022ea`** (09/08/2026) tirou `suspend_vpads_for_steam_input` da
borda de entrada da exceção de Steam Input e pôs `esconder_o_fisico_para_o_jogo`
no lugar — é a **ESCONDER-EM-VEZ-DE-SAIR-01**, *a allowlist do Steam Input NÃO
tira o Hefesto da frente*. O preço que matou a suspensão foi medido na máquina
dela em 08/08: **o jogador 2 É um gamepad virtual**, e derrubar os virtuais para
curar o duplicado do P1 derrubava o P2 junto
(`coop_derrubado_pela_excecao_steam_input`, 20 ocorrências num dia).

**A saída que a sprint não previu, e que muda a E2.** A sprint ofereceu três
respostas; a árvore tem uma quarta: *substituída na ENTRADA, mantida como CINTO
na SAÍDA*. O comentário em `gamepad.py:520-526` é explícito e datado — a chamada
de `resume_*` fica porque um daemon que subiu **antes** desta cura pode estar com
uma suspensão de pé, e sair da exceção com o flag pendurado deixaria a janela
avisando de um estrago encerrado. Isso não é descuido a limpar: é cinto escolhido.

**Consequência para a E2:** a `suspend_*` **não** é "fato errado" a apagar. Ela é
uma lápide que o `portao_a_casa_sabe_e_o_produto_nao_faz` já classificou em
12/08/2026 (`_NAO_E_PROMESSA`: *"Não deve chamador: ela deve continuar não sendo
chamada"*). O que a lápide não previu foi a **flag** ficar viva e lida.

### E2 — a consequência, seja qual for

**ABERTA, e a escolha é DELA.** Não porque falte medição — a medição está acima —,
mas porque as duas saídas mexem em arquivo de três outras frentes, e a segunda
reverte uma decisão dela.

**Saída A — as cinco leituras saem** (o que a E2 pedia). O produto para de
prometer um estado que não produz. Preço: as frases da Início e da Emulação
somem, e as duas abas perdem o vocabulário para o caso "a Steam assumiu a
entrada" — que **acontece**, só que hoje é observado por `excecao_ativa` sozinho.
Arquivos: `daemon/lifecycle.py` (C3), `daemon/subsystems/hotkey.py` e
`daemon/ipc_handlers.py` (B5), `app/actions/home_actions.py` (B7),
`app/actions/emulation_actions.py`.

**Saída B — o par vira um só.** `excecao_ativa` passa a ser o único estado, e as
duas frases da tela passam a ler ele. Nada é apagado da tela, e a distinção que
o par prometia (suspensão armada vs. não armada) morre — ela já estava morta na
prática desde 09/08. **Esta é a saída barata**, e é a que preserva o texto que já
foi escrito e revisado.

**Saída C — religar a suspensão.** Reverte a ESCONDER-EM-VEZ-DE-SAIR-01 e traz de
volta o co-op derrubado. **Não recomendada**, e só ela justificaria a E4.

Enquanto nenhuma fecha, `_PAR_ACEITO` guarda a razão datada e
`test_nenhuma_declaracao_ficou_obsoleta` avisa sozinho se alguma frente religar.

### E3 — o portão contra a classe inteira

O defeito é **assimetria de par**: uma metade ligada, a outra não. Um portão que
pegue a família: para todo par `armar/desarmar` (ou `suspend/resume`,
`enable/disable`) em `daemon/`, se um dos dois tem chamador em produção e o
outro não, reprova nomeando os dois.

Isso é irmão do `portao_a_casa_sabe_e_o_produto_nao_faz.py`, que hoje **não
pega** este caso: ele mede alcance por símbolo, não por par.

#### FECHADA (25/08/2026) — `tests/unit/test_portao_o_par_com_metade_ligada.py`

Dez casos. A pergunta dele **não** é a do irmão: em vez de *"esta função tem
chamador?"*, ele pergunta *"existe caminho de produção que ponha esta flag em
CADA um dos dois valores que o produto lê?"*.

Ele **não** procura nome de par (`armar`/`desarmar`): convenção de nome é
citação, não declaração, e o irmão já reprovou essa via em 12/08 com 525
apelidos únicos em `src/`. Procura o fato — quem escreve `True`, quem escreve
`False`, e qual dos dois lados tem chamador.

**Calibrado contra resposta conhecida:** das **17** flags de `daemon/` com
escritor dos dois lados, ele acusa **uma**, e é a da sprint. Um portão que acusa
dezessete é ruído; um que acusa zero é decoração.

**Duas armadilhas em que a varredura caiu, e que ficaram plantadas em teste:**
docstring contada como chamador (o nome aparece 18 vezes em prosa dentro do
`gamepad.py`, e a primeira medição saiu **verde com o defeito na frente dela**) e
`__all__` contado como chamador.

**Ele nomeia os endereços**, não só a flag: `_leituras` dá **um** salto pelo
acessor que devolve o estado, e por isso a reprovação lista os três sítios do
daemon em vez dos dois toques diretos. A fronteira está declarada: os dois
leitores da tela atravessam o dicionário do IPC, e seguir string por travessia de
serialização seria adivinhar.

### E4 — o observável na aba Configurações

Pedido dela em 22/08: o estado tem de **aparecer na tela**, não só existir.

Lugar: a seção **"Está tudo certo?"** da aba Configurações, que é onde mora o
diagnóstico. A linha diz se o par de estados está coerente — e, enquanto a E1
não fechar, ela diz a verdade incômoda: *o produto não sabe relatar este
estado.*

**Depende de `CONFIG-09`** (a seção "Está tudo certo?"), que depende de
`CONFIG-01` (feita em 22/08, commit `c6b8daa`) e de `CONFIG-02`. Enquanto a
seção não existir, esta entrega não tem onde morar — e é assim que fica escrito,
em vez de a linha nascer solta noutra aba.

#### RECUSADA como escrita (25/08/2026) — a E1 derrubou a premissa dela

O bloqueio de `CONFIG-09` **caiu**: a seção existe desde 22/08 (`7a52931`,
`app/actions/config/secao_exame.py:51`). Não é por falta de lugar que esta
entrega não entra. São **três** razões, e a primeira sozinha basta:

**1. Não há mais incoerência para relatar.** A E4 mandava a linha dizer *"o
produto não sabe relatar este estado"*. Depois da E1, isso é falso: o produto
relata `vpad_suspenso = False`, e **`False` está CERTO** — o vpad nunca é
suspenso, por decisão dela de 09/08. O par não está incoerente; ele está
resolvido em um valor só. Uma linha na tela avisando de incoerência mostraria
alarme para uma decisão que funcionou. O defeito que sobrou é **código morto em
cinco sítios** — coisa de quem edita, não de quem joga.

**2. Fura o escopo declarado da própria seção**, que está escrito nela e foi
mostrado a ela: *"Este exame olha a mesa: portas, energia e rádio. O estado do
Hefesto e do som fica na aba Sistema."* (`secao_exame.py`, `ESCOPO`). Uma flag
interna do daemon não é a mesa. Aquela linha nasceu para a pessoa não ter de
adivinhar por que há dois diagnósticos; furá-la aqui desfaz o que ela paga.

**3. A seção não reimplementa checagem** — é regra escrita no cabeçalho dela, e a
casa pagou duas vezes em agosto (`6c86e295`, `c3d3518f`) por tela verde em cima
de vermelho. A medição teria de nascer em `integrations/exame_da_mesa.py`, e
`exame_da_mesa` lê **a mesa**, não a memória de um daemon vivo.

**O que fica no lugar, e é o que ela pediu de verdade** (*o estado tem de
aparecer na tela*): as frases dos itens 4 e 5 do censo acima **já existem, já
foram revisadas, e estão na tela errada — a inalcançável**. Fechar a E2 pela
**Saída B** faz as duas voltarem a aparecer. É a mesma vontade, pelo caminho que
não inventa diagnóstico novo.

---

## Como morde

Arranque a chamada que a E1 acrescentar e o teste da E2 reprova. Sem o portão da
E3, a próxima assimetria de par entra igual — com a suíte verde, que foi
exatamente o que aconteceu aqui.

## O que este achado ensina

**Teste que exercita não prova que produção chama.** Os quatro testes da
`suspend_*` passam há semanas, e nenhum deles pergunta quem a invoca fora dali.
É a mesma lição do `prontuario_dos_jogos.py`, medida no mesmo dia: `pytest`
verde não derruba "capacidade sem chamador em produção".
