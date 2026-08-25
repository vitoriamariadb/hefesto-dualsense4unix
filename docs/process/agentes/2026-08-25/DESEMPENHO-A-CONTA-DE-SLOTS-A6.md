# DESEMPENHO · A CONTA DE SLOTS-01 — entrega da frente A6

**25/08/2026, madrugada.** Árvore `hefesto-voo/DESEMPENHO-A-CONTA-DE-SLOTS-A6`,
branch `voo/DESEMPENHO-A-CONTA-DE-SLOTS-A6`. Bancada: não usada (`bancada:
false` na sprint). Merge: **não feito** — é de quem coordena.

## O que mudou

**Nasceu `src/hefesto_dualsense4unix/integrations/plano_de_radio.py`** (DESEMP-3,
6, 7). Módulo puro, sem `gi`, sem varredura própria de `/sys`: ele recebe o que
`radio_da_mesa` já sabe e responde as três perguntas que a `Ocupacao` sozinha
não responde.

- `plano_por_adaptador` agrupa por `HID_PHYS` e traz o `player_slot` de cada
  controle. **Duas contas, não uma:** `agora` sai de `bt_mic.uniqs` (a ponte que
  SUBIU) e `planejada` da declaração dela. Quando divergem, a tela diz as duas.
- `cabe_mais_um` responde o planejamento sem inventar controle, e a palavra
  continua saindo de `radio_da_mesa.palavra_da_ocupacao` — nenhum corte novo.
- `ordem_de_redistribuicao` devolve **dado puro** (`Redistribuicao`), no formato
  `D-ORDEM-DE-SERVICO`. É o contrato com a Frente B: trocar o renderizador não
  muda uma linha do dado. Com um adaptador só, ela devolve `None` e a seção diz
  a `FRASE_DO_ADAPTADOR_UNICO`.
- `selo_das_procedencias` tem **três partes** — especificação (1600),
  medido aqui (260,4 / 276,7, e é UM controle), derivado da conta (a soma de N,
  nunca medida) — mais uma quarta linha, só de três controles para cima, que
  confessa que o maior ensaio desta casa foi de **dois**.
- `apelido_por_endereco` mudou de casa: a junção nome↔endereço passa a viver
  aqui, e a seção Conexões importa daqui em vez de manter a cópia. **A ponta
  dela não foi costurada** — ver "o que sobrou".
- Nenhum número é digitado: toda frase deriva das constantes do `radio_da_mesa`.
  `frase_da_capacidade_do_mic(4)` calcula os 1042 → 1107 e os **4 pontos** —
  o achado que muda a decisão, e que a frase anterior não dizia.

**`secao_orcamento.py` virou a seção de perfil + conta** (DESEMP-2, 5, 6, 7, 8).

- **Os cinco degraus viraram três perfis** (`D-PERFIL-DE-DESEMPENHO`):
  `Tudo ligado` / `Bateria longa` / `Eu escolho`. **O esquema do disco não
  muda**: `TETO_POR_PERFIL` traduz perfil → chave, e `PERFIL_POR_TETO` é a
  migração 1-para-1 do que já está gravado.
- **A dica do "Auto" saiu inteira**, sem nota e sem data — era fato errado (ela
  descrevia a escada de `_effective_mult` no ramo da política da **aba Rumble**,
  que aquele clique nunca ligou).
- **A dica do "Bateria longa" é DERIVADA de `LINHAS_DO_TETO`.** A palavra dela
  na decisão dizia *"vibração com teto de 30% e barra de luz apagada"*, e **a
  barra de luz não tem ponto de aplicação nenhum**: escrevê-la seria cometer, no
  mesmo botão, o defeito que esta sprint existe para curar. Derivando, a dica
  não pode prometer mais do que a tabela mostra.
- **`LINHAS_DO_TETO`** é o dono único das cinco linhas, e `alcance_de_hoje()`
  DERIVA a frase de apoio dela. `COLUNAS` deriva dos perfis: uma coluna por
  opção oferecida, sempre.
- **Nasceu o bloco da conta** (`_ContaDeSlots`): uma linha por adaptador com
  nome DELA (nunca `hciN`), quem está nele por número de jogador, a conta, a
  palavra, o "cabe mais um", a ordem de serviço quando há, o preço do microfone
  e o selo de três partes. **Sem resposta do daemon a tela diz que não sabe** —
  a cura da B1, e "0/1600 · Folgada" nunca aparece.
- **O preço do microfone está na tela em TODOS os estados** (ordem de quem
  coordena): 260,4 sem, 276,7 com, das 1600 fatias.

**Testes.** Dois arquivos novos (`test_a_conta_de_slots_por_adaptador.py`, 32
nós; `test_o_teto_da_mesa_diz_o_que_faz.py`, 18 nós) e quatro atualizados com
nota datada (`test_orcamento_dono_unico_do_valor_efetivo.py`,
`test_a4_nao_sei_e_resposta_valida.py`, `test_a_marca_acende_no_clique.py`, e o
`test_config_a_palavra_de_tela_da_aba_montada.py` passou sem edição depois que a
célula ganhou maiúscula).

**O portão `call_async` foi ESTREITADO, não afrouxado.** `test_o_clique_nao_grava_nada`
banía a palavra inteira, e a conta precisa da leitura de `daemon.state_full`.
Empurrar essa leitura para outro módulo só para escapar do portão é a
meia-honestidade que esta casa não aceita, então a régua passou a ser por **AST**:
*toda* chamada assíncrona desta seção nomeia `daemon.state_full` e nada mais, e
`call_async` com método montado em tempo de execução também reprova. O que a
`D-A4` proíbe — escritor — continua banido por nome.

## Qual mordida prova

Cada uma abaixo foi **arrancada, vista reprovar e devolvida**, nesta árvore, em
25/08/2026. As saídas completas estão no resumo estruturado da entrega.

| # | cura arrancada | nó que reprovou | o que ele disse |
|---|---|---|---|
| 1 | agrupar por `uniq` em vez de `HID_PHYS` | `test_dois_controles_no_mesmo_adaptador_viram_um_plano_com_dois_jogadores` | `['aabbcc000011', 'aabbcc000022'] == ['e8:47:3a:00:00:09']` — duas barras de 260 onde há uma fila de 521 |
| 2 | alimentar `agora` com a DECLARAÇÃO | `test_a_ponte_pedida_e_a_ponte_de_pe_sao_duas_contas` | `assert 106.2 == 0.0` — o produto respondendo pelo pedido |
| 3 | corte próprio (0,60) em `cabe_mais_um` | `test_cabe_mais_um_usa_o_corte_do_medidor_e_nao_um_proprio` + `..._no_adaptador_de_tres` | `assert False is True` — duas réguas sobre o mesmo número |
| 4 | tirar o filtro do balde `SEM_ADAPTADOR` | `test_o_balde_do_nao_sei_nunca_e_destino_de_ordem` | *"a tela mandaria mover um controle para 'Adaptador que não sei qual é'"* |
| 5 | tirar a guarda `_respondeu` | `test_sem_resposta_do_daemon_a_palavra_nao_e_folgada` | a tela dizia *"Nenhum controle no rádio agora"* sobre um rádio que ninguém leu |
| 6 | digitar "1042"/"1107" na frase | `test_a_frase_de_capacidade_e_derivada_do_medidor` | com `HZ_INPUT_SEM_MIC=100`, a frase continuava dizendo 1042 |
| A | renomear SÓ `TITULO` | `test_o_titulo_da_secao_e_o_rotulo_do_rodape_sao_a_mesma_palavra` | `- Orçamento / + Desempenho` — a meia-correção nomeada |
| B | devolver a dica do "Auto" | `test_nenhuma_dica_promete_o_que_o_botao_nao_faz` + `test_a_dica_do_auto_saiu_de_vez` | `'acompanha a bateria' is contained here` |
| C | `ALCANCE_DE_HOJE` de volta a literal / tirar uma coluna | `test_a_frase_do_alcance_deriva_da_tabela` + `test_a_tabela_tem_uma_coluna_por_opcao_oferecida` | *"a frase parou de derivar da tabela"* / *"a tabela deixou de ter coluna para: ['Eu escolho']"* |
| D | marcar "Gatilhos" com ponto de aplicação | `test_so_a_vibracao_tem_ponto_de_aplicacao_hoje` | *"o teste é que muda — mas ele tem de ser IMPORTÁVEL"* |
| E | digitar `260.4` / `1600` em `app/` | `test_ninguem_em_app_recalcula_a_conta_de_slots` | `secao_orcamento.py:167 → 260.4` e `:168 → 1600`, com arquivo e linha |

**Uma mordida NÃO mordeu, e está registrada como tal.** A guarda
`p.endereco != origem.endereco` (impedir que a origem seja destino de si mesma)
foi arrancada e o teste ficou **verde**: com os cortes de hoje a origem nunca
pode ser seu próprio destino, porque para entrar na lista ela já passou de
`CORTE_APERTADA` (1360 fatias) e receber mais um a leva além da "Cheia" em
qualquer combinação. Aquela guarda é **cinto, não tirante**, e o docstring do nó
`test_a_ordem_so_nasce_quando_ha_para_onde_mover` diz isso com todas as letras.
A mordida de verdade foi reescrita para o filtro do balde `SEM_ADAPTADOR`, que é
o que de fato segura a tela.

## O que NÃO verifiquei

- **Prova de tela (D3): NENHUMA.** Suspensão 2 de quem coordena — a regra da
  casa é *"interface só fecha com o olho dela"*, e ela não está. As tarefas
  DESEMP-2, 5, 6, 7 e 8 são **ESTRUTURAIS** e ficam **AGUARDANDO O OLHO DELA**.
  Não rodei `retratar_abas.py` e não commitei PNG nenhum.
- **A suíte inteira.** Rodei o meu escopo (177 nós verdes nos 15 arquivos que
  tocam `secao_orcamento`, `plano_de_radio`, `radio_da_mesa` ou
  `_CAMPOS_DA_MAQUINA`) mais uma varredura de 1240 nós com `-k`. A suíte
  completa é de quem integra.
- **O bloco da conta nunca falou com um daemon de verdade.** Todo teste injeta
  `_desempenho_leitor` e `_desempenho_sysfs`. O caminho `call_async` real está
  escrito no molde literal de `secao_mesa._pedir_o_estado` e **não foi exercido
  contra um daemon vivo** — isso é bancada, e é dela.
- **A conta aditiva.** A `D-CONTA-ADITIVA-DO-RADIO` continua **aberta**, e o
  selo continua dizendo "derivado da conta" por isso. Se o denominador for do
  ADAPTADOR e não por controle (a releitura de 23/08 em `radio_da_mesa.py:76-81`),
  este modelo **superestima** — lado seguro, mas divergência conhecida.
- **A largura da seção com a aba montada.** A aba Configurações é DIFERIDA
  (`D-A4`), então ela mede **24px** no portão de layout: `test_nenhuma_aba_isolada_estoura_o_orcamento`
  **não enxerga esta seção**. Medi a seção sozinha, com `Gtk.OffscreenWindow`.

### DESEMP-9 — a medição, e ela é minha, não do portão

| | antes | depois |
|---|---|---|
| altura da seção (largura 1160) | **127px** | **295px** |
| largura mínima da seção | **436px** | **583px** |

O primeiro desenho da tabela pedia **939px** de largura mínima, porque a frase
"Ainda não tem por onde ser limitado" aparecia três vezes na mesma linha. Uma
célula que **atravessa as três colunas de perfil** devolveu 356px e lê melhor: a
informação é sobre a linha, não sobre cada perfil.

**O saldo de +168px de altura fica**, e o argumento que o pagaria não pôde ser
executado: a caixinha do microfone e a frase de capacidade **não saíram** de "Os
controles" (DESEMP-4, ver abaixo). Os seis vermelhos de
`test_layout_orcamento_altura.py` são **idênticos antes e depois** da minha
mudança (conferido com `git stash`): Emulação 806px, Lightbar 1289px, Sistema
1307px e os três dos cards. Não consertei nenhum e não criei nenhum.

## O que sobrou para o próximo

**Tarefas que ficaram ABERTAS por posse, não por dificuldade:**

1. **DESEMP-1 — o renome "Orçamento" → "Desempenho".** Precisa de
   `app/ipc_bridge.py:802`, que é da frente **A5** nesta leva. **O portão já
   está de pé e verde** (`test_o_titulo_da_secao_e_o_rotulo_do_rodape_sao_a_mesma_palavra`),
   então o renome é uma edição de **duas linhas que ninguém consegue fazer pela
   metade**:
   - `secao_orcamento.py` → `TITULO = "Desempenho"`;
   - `ipc_bridge.py:802` → `"orcamento": "Desempenho"`.

   A terceira ponta (`app/actions/config/__init__.py:23`, a docstring) é
   cosmética. **As duas CHAVES `orcamento` não se tocam** — são campo de disco.
2. **DESEMP-4 — a caixinha do microfone muda de casa.** Precisa de
   `secao_controles.py`, que não está na minha posse desta leva. **Não a movi de
   propósito:** adicionar a caixinha no Desempenho sem remover a de "Os
   controles" daria **dois donos ao mesmo `controles[mac].microfone`**, que é
   exatamente a classe de defeito que a `ABAS-01` curou. O que já está pronto
   para receber a mudança: `_ContaDeSlots._declaracoes()` já lê a declaração
   (disco por baixo, rascunho por cima) e alimenta a conta `planejada`. A lista
   item-a-item do que remover está na DESEMP-4 da sprint.
3. **A ponta do `apelido_por_endereco`.** `plano_de_radio.apelido_por_endereco`
   nasceu como o dono da junção nome↔endereço, e `secao_mesa._apelido_por_endereco`
   **continua existindo** — território da Frente B. Enquanto as duas viverem, há
   duas junções para o mesmo fato. A costura é uma linha: `secao_mesa` importa de
   `plano_de_radio` e apaga a cópia.
4. **O `_config_dongles` do hospedeiro.** O bloco da conta lê os apelidos de
   `host._config_dongles`, e **ninguém o preenche hoje** — quem conhece os
   dongles é a seção Conexões. Sem ele a tela diz "Adaptador sem nome", que é
   honesto mas pobre. Fiar isso toca `secao_mesa.py`.

**Decisões que continuam DELAS, e que eu não tomei:**

5. **`D-O-MIC-LIGADO-VALE-NO-RADIO` (aberta).** Não decidi, por ordem de quem
   coordena. **Onde está a linha que recebe o padrão:** o dono do padrão é o
   `default` do campo `ControleDeclarado.microfone` em `utils/maquina.py`
   (hoje `None`). `plano_de_radio.microfone_nasce_ligado()` **LÊ esse campo** —
   não opina —, e `frase_do_preco_por_controle()` deriva dele a última oração da
   frase de tela. **Trocar aquele `default` muda a tela sozinho**, e o nó
   `test_o_padrao_do_microfone_e_lido_do_dono_e_nao_opinado` prova as duas
   direções com `monkeypatch`. Nenhuma linha de tela foi mudada em nome dessa
   decisão.
6. **A célula "vazio → Tudo ligado" da migração.** É a única célula da tabela da
   `D-PERFIL-DE-DESEMPENHO` que **não** implementei literalmente, e a nota está no
   código (`PERFIL_POR_TETO`), marcada **PROVISÓRIO — decisão dela**. O motivo é
   medido: o `SegmentedSelector` é grupo de rádio e IGNORA o clique no botão já
   afundado. Se a ausência afundasse "Tudo ligado", quem clicasse "Eu escolho"
   (que grava a ausência) veria "Tudo ligado" afundar de novo na remontagem, sem
   gesto nenhum para sair dali — **o mesmo defeito que fez o quinto botão
   nascer** em 23/08. Hoje: quem nunca declarou vê a fileira **sem botão
   afundado**, como antes. Se ela quiser mesmo o botão afundado, o conserto é o
   esquema ganhar um valor para "cada aba manda", e aí a ausência deixa de
   existir — e isso é `utils/maquina.py`, território da A5.
7. **`docs/data/decisoes-dela.csv` NÃO foi tocado.** A cópia desta árvore está
   atrás da árvore dela (as linhas 17 a 38, incluindo a própria
   `D-PERFIL-DE-DESEMPENHO`, só existem no índice da árvore principal e não estão
   commitadas). Anexar aqui produziria um conflito de merge inútil. Se alguma
   das notas acima virar linha de CSV, quem integra a escreve na árvore dela.

**Dívida técnica declarada:**

8. **Dois `state_full` por entrada na aba.** O bloco da conta abre o segundo (o
   primeiro é o da seção Conexões). O conserto é um leitor único no nível da
   aba, com assinantes — e ele toca `secao_mesa.py`. Enquanto não nascer, os dois
   pedidos podem chegar em ordens diferentes e as duas seções mostrarem contas de
   instantes diferentes. **NÃO VERIFICADO:** nunca vi as duas divergirem na tela.
9. **A altura.** +168px nesta seção, sem a devolução que a DESEMP-4 pagaria. Se
   a aba apertar depois que a caixinha do microfone mudar de casa, o candidato
   declarado na sprint é a tabela de consequências nascer fechada num
   `Gtk.Expander` — e isso é decisão dela (P3 da seção 7).
