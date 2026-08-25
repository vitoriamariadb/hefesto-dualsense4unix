# VPAD-SUSPENSO-MORTO-01 · agente D2

| | |
|---|---|
| **Árvore** | `hefesto-voo/VPAD-SUSPENSO-MORTO-D2`, branch `voo/VPAD-SUSPENSO-MORTO-D2` |
| **Base** | `cb7248f` (merge da leva B+C, oito frentes) |
| **Fechou** | **E1** (a medição) e **E3** (o portão da classe) |
| **Não fez** | **E2** — medida, escrita, e a escolha é **DELA**: as três saídas mexem em arquivo de quatro outras frentes. **E4** — **RECUSADA como escrita**, e é a própria E1 que derruba a premissa dela |
| **Commits** | `e61943d`, `2e543cf` |
| **Portões** | `bash scripts/portoes.sh` → **TODOS VERDES — 23 portões** |
| **`src/` tocado** | **nenhum arquivo.** `git diff --cached --stat -- src/` vazio nos dois commits |

---

## O que resgatei da árvore

Cheguei com **um arquivo não commitado**: `tests/unit/test_portao_o_par_com_metade_ligada.py`,
o portão da E3, escrito inteiro pelo agente que morreu às 6h10. **Rodei antes de
qualquer outra coisa: 9 passaram.** O `ruff` reprovava em 4 pontos (`SIM102`, dois
`N815`, um `E501`) — consertei sem mudar comportamento e **commitei** (`e61943d`)
antes de continuar. Não refiz nada do que ele fez.

A medição da E1 dele estava **certa** e eu a reconferi contra a árvore de hoje,
que andou oito frentes desde 22/08: a metade desligada **continua desligada**,
nenhuma frente religou.

---

## O que mudou

### E1 — a resposta, e por que a trichotomia da sprint estava curta

**É a saída (3): foi SUBSTITUÍDA. Mas a substituição parou no meio, e é isso que
o título da sprint diz.**

O commit **`d8022ea`** (09/08/2026) tirou `suspend_vpads_for_steam_input` da borda
de entrada da exceção de Steam Input e pôs `esconder_o_fisico_para_o_jogo` no
lugar — é a **ESCONDER-EM-VEZ-DE-SAIR-01**, decisão dela: *a allowlist do Steam
Input NÃO tira o Hefesto da frente*. O preço que matou a suspensão foi medido na
máquina dela em 08/08: **o jogador 2 É um gamepad virtual**, e derrubar os
virtuais para curar o duplicado do P1 derrubava o P2 junto
(`coop_derrubado_pela_excecao_steam_input`, 20 ocorrências num dia).

**A quarta saída, que a sprint não previu:** *substituída na ENTRADA, mantida como
CINTO na SAÍDA*. `gamepad.py:520-526` é explícito e datado — a chamada de
`resume_*` fica porque um daemon que subiu **antes** da cura pode estar com uma
suspensão de pé, e sair da exceção com o flag pendurado deixaria a janela avisando
de um estrago encerrado.

Isso **muda a E2**: a `suspend_*` não é "fato errado a apagar". É lápide que o
`portao_a_casa_sabe_e_o_produto_nao_faz` já classificou em 12/08 (`_NAO_E_PROMESSA`:
*"Não deve chamador: ela deve continuar não sendo chamada"*). O que aquela lápide
não previu foi a **flag** ficar viva e lida.

### A CONTA ERA TRÊS E SÃO CINCO — e dois estão na tela

A sprint dizia *"lida em três lugares de produção"* citando `lifecycle.py:2183` e
`hotkey.py:258`. **Fato errado, substituído em todos os lugares** (a sprint, a
razão do `_PAR_ACEITO` e o cabeçalho do portão). Censo de 25/08, e **nenhum destes
cinco pode responder `True`**:

| # | Onde | O que fica inalcançável |
|---|---|---|
| 1 | `daemon/lifecycle.py:2254` | `CALADA_VPAD_SUSPENSO` **nunca é devolvida** |
| 2 | `daemon/subsystems/hotkey.py:261` | ramo de modo, num `or` cujo outro lado carrega a decisão sozinho |
| 3 | `daemon/ipc_handlers.py:2107` | publica `vpad_suspenso` sempre `False`, com docstring que documenta um contrato de dois estados dos quais um é impossível |
| 4 | `app/actions/home_actions.py:1115` | **Onda 2 · Início** |
| 5 | `app/actions/emulation_actions.py:408` | **Onda 5 · Emulação** |

### E3 — o portão, e o defeito que ele tinha

`tests/unit/test_portao_o_par_com_metade_ligada.py`, **10 casos**. A pergunta dele
não é a do irmão: em vez de *"esta função tem chamador?"*, ele pergunta **"existe
caminho de produção que ponha esta flag em CADA um dos dois valores que o produto
lê?"**. Não procura nome de par (`armar`/`desarmar`) — convenção de nome é citação,
não declaração, e o irmão já reprovou essa via em 12/08 com 525 apelidos únicos.
Procura o fato: quem escreve `True`, quem escreve `False`, quem tem chamador.

**Calibrado contra resposta conhecida:** das **17** flags de `daemon/` com escritor
dos dois lados, acusa **uma** — a da sprint.

**O defeito do próprio instrumento, que eu consertei (`2e543cf`):** ele acusava o
par certo e dava **dois** endereços quando o defeito tinha cinco, porque media só
o toque direto no atributo. Três dos cinco leitores passam pelo acessor
`steam_input_vpad_suspenso`. **O endereço é o que roteia o conserto entre as
frentes** — sem ele a reprovação nomeia o sintoma e esconde o alvo. `_leituras`
passa a dar **um** salto pelo acessor; a fronteira fica declarada no código,
porque os dois leitores da tela atravessam o dicionário do IPC e seguir string por
travessia de serialização seria adivinhar. O `descreva` parou de truncar no sexto
(cortava justamente o `hotkey.py`).

---

## Qual mordida prova

### Mordida 1 · o defeito de hoje, sem plantio — tirar a entrada de `_PAR_ACEITO`

```
# CURA ARRANCADA (_PAR_ACEITO = {})
E   AssertionError: PAR COM METADE LIGADA — o produto LÊ um estado que nenhum
E     caminho de produção consegue escrever:
E     _steam_input_vpad_suspenso: nenhum caminho de produção põe True.
E         sem chamador: ['suspend_vpads_for_steam_input']
E         vivos       : ['resume_vpads_after_steam_input', 'start_gamepad_emulation_desfecho']
FAILED ...::test_todo_par_assimetrico_esta_declarado
1 failed, 8 passed

# CURA DEVOLVIDA
9 passed
```

### Mordida 2 · a outra direção — religar a suspensão em produção

A linha exata que o `d8022ea` trocou, desfeita: `suspend_vpads_for_steam_input(daemon)`
reposta ao lado de `esconder_o_fisico_para_o_jogo` em `gamepad.py:517`.

```
# CURA ARRANCADA (a suspensão religada na borda da exceção)
E   AssertionError: declaração obsoleta em `_PAR_ACEITO`: ['_steam_input_vpad_suspenso'].
E     O par voltou a ter as duas metades ligadas. APAGUE a entrada — e, se foi a
E     suspensão do vpad que voltou, avise a Onda 2 · Início e a Onda 5 · Emulação.
E   AssertionError: a régua deixou de ver o par que a sprint mediu.
FAILED ...::test_nenhuma_declaracao_ficou_obsoleta
FAILED ...::test_a_regua_ve_o_par_de_hoje
2 failed, 7 passed

# CURA DEVOLVIDA (git checkout de src/)
9 passed
```

**É esta metade que avisa quem coordena, sozinha, se alguma frente religar a
suspensão** — os dois casos reprovam juntos, dizendo a mesma coisa por dois
caminhos.

### Mordida 3 · o salto pelo acessor (a cura de `2e543cf`)

```
# CURA ARRANCADA (acessores = set())
E   AssertionError: o portão não nomeia daemon/lifecycle.py:2254, que LÊ a flag
E     pelo acessor. Ele listou: ['daemon/ipc_handlers.py:2107',
E                                'daemon/subsystems/gamepad.py:632']
FAILED ...::test_a_lista_de_leituras_atravessa_o_acessor
1 failed, 9 passed

# CURA DEVOLVIDA
10 passed
```

O `__pycache__` foi apagado entre arrancar e devolver em **todas** as três.

---

## O que as duas frentes travadas ganham — o despacho

### Onda 2 · Início — `app/actions/home_actions.py:1112-1116`

```python
if (isinstance(steam_input, dict)
        and steam_input.get("excecao_ativa")
        and steam_input.get("vpad_suspenso")):
```

O segundo termo é **sempre `False`**. **A aba Início NUNCA consegue dizer "pelo
Steam Input"** — o ramo inteiro, com a cor e a ressalva que a medição de 06/08
obrigou, é código morto desde `609bbac` (19/08). A frase que a aba realmente
mostra hoje é a de outro ramo.

**O que a Onda 2 precisa decidir:** trocar a condição para `excecao_ativa` sozinho
(a **Saída B** abaixo — a frase volta a aparecer, sem inventar texto novo), ou
apagar o ramo (**Saída A**). **Não** é preciso esperar mais nada desta sprint.

### Onda 5 · Emulação — `app/actions/emulation_actions.py:408`

A frase está escrita, revisada, e carrega uma nota datada de 07/08 corrigindo o
verbo depois da medição dela:

> *"Ligado, em pausa agora: neste jogo quem entrega o controle é a Steam, e o
> controle virtual foi recolhido. Não foi desligado — volta sozinho quando você
> fechar o jogo."*

**É inalcançável, e a cadeia está conferida ponta a ponta:** a chave
`"vpad_suspenso_pelo_steam_input"` **é** `lifecycle.CALADA_VPAD_SUSPENSO`; ela
chega à janela como `bloqueio` no bloco `keyboard_emulation`
(`ipc_handlers.py:_keyboard_emulation_payload`, `bloqueio = motivo_jogo`);
`motivo_jogo` tem **um único** produtor, `lifecycle._jogo_no_controle_do_desktop()`
(`lifecycle.py:2209`), que devolve a constante **só** sob
`if steam_input_vpad_suspenso(self)`. Logo `bloqueio` só pode ser `"desligada"`,
`"sem_device"`, `"modo_jogo"` ou `None`.

**O que a Onda 5 precisa decidir:** a mesma escolha, sobre a mesma frase.

---

## O que eu recusei executar, e a medição que derruba

### E4 — o observável na aba Configurações

**O bloqueio que a sprint declarou CAIU**, e não é por ele que recuso: a seção
"Está tudo certo?" existe desde 22/08 (`7a52931`,
`app/actions/config/secao_exame.py:51`). Três razões, e a primeira basta:

**1. Não há mais incoerência para relatar.** A E4 mandava a linha dizer *"o produto
não sabe relatar este estado"*. Depois da E1 isso é **falso**: o produto relata
`vpad_suspenso = False`, e **`False` está CERTO** — o vpad nunca é suspenso, por
decisão dela de 09/08. O par não está incoerente; está resolvido num valor só. A
linha mostraria **alarme para uma decisão que funcionou**. O que sobrou é código
morto em cinco sítios — assunto de quem edita, não de quem joga.

**2. Fura o escopo declarado da própria seção**, escrito nela e mostrado a ela:
*"Este exame olha a mesa: portas, energia e rádio. O estado do Hefesto e do som
fica na aba Sistema."* (`secao_exame.py`, `ESCOPO`). Uma flag interna do daemon
não é a mesa, e aquela linha nasceu justamente para a pessoa não ter de adivinhar
por que há dois diagnósticos.

**3. A seção não reimplementa checagem** — regra escrita no cabeçalho dela, e a
casa pagou **duas vezes** em agosto (`6c86e295`, `c3d3518f`) por tela verde em cima
de vermelho. A medição teria de nascer em `integrations/exame_da_mesa.py`, que lê
**a mesa**, não a memória de um daemon vivo.

**E o que ela pediu de verdade se paga sem a E4.** O pedido era *o estado tem de
aparecer na tela*. As duas frases que dizem esse estado **já existem e já foram
revisadas** — só estão na tela inalcançável. Fechar a E2 pela **Saída B** faz as
duas voltarem. Mesma vontade, pelo caminho que não inventa diagnóstico novo.

---

## O que sobrou para o próximo — a E2 é dela

Não é falta de medição; é que as três saídas mexem em arquivo de quatro frentes, e
uma delas reverte decisão dela.

| | O que faz | Preço | Arquivos (dono) |
|---|---|---|---|
| **A** | as cinco leituras saem | as duas abas perdem o vocabulário para "a Steam assumiu a entrada" — que **acontece**, e hoje é observável por `excecao_ativa` sozinho | `lifecycle.py` (C3), `hotkey.py` + `ipc_handlers.py` (B5), `home_actions.py` (B7), `emulation_actions.py` |
| **B** ← recomendada | o par vira **um só**: `excecao_ativa`. As duas frases da tela passam a ler ele | morre a distinção "suspensão armada vs. não armada", que **já estava morta na prática** desde 09/08 | os mesmos, e **nada é apagado da tela** |
| **C** | religar a suspensão | reverte a ESCONDER-EM-VEZ-DE-SAIR-01 e traz de volta o co-op derrubado (20 ocorrências num dia) | **não recomendada**; só ela justificaria a E4 |

Enquanto nenhuma fecha, `_PAR_ACEITO` guarda a razão datada e
`test_nenhuma_declaracao_ficou_obsoleta` **avisa sozinho** se alguma frente
religar — sem ninguém lembrar de conferir.

---

## O que NÃO verifiquei

- **Nada de bancada, e nada de rádio.** A sprint não pede aparelho, e não havia:
  `/sys/class/bluetooth/` está vazio desde 02:36.
- **Nenhuma prova de tela.** As duas frases inalcançáveis são conclusão de leitura
  de código, conferida ponta a ponta na cadeia, **não** foto de tela. Fechar a E2
  vai precisar do olho dela nas duas abas.
- **Não rodei a suíte inteira** — só o meu arquivo, por causa dos nós uinput.
- **Os quatro testes que exercitam a `suspend_*`** (`test_coop_nao_cai_em_silencio`,
  `test_jogo01_um_dispositivo_por_controle`, `test_esconder_em_vez_de_sair_01`,
  `test_aviso_falso_do_coop_01`) continuam verdes e continuam exercitando uma
  função sem chamador em produção. **Deixei como estão**: a sprint não pede, e a
  decisão de que ela "deve continuar não sendo chamada" é de 12/08. É a lição que
  o achado ensina — *teste que exercita não prova que produção chama*.
