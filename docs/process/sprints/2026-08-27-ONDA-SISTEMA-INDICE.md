# ONDA SISTEMA — o índice

> **06/09/2026 — ESTA ONDA FOI ABSORVIDA.** As sprints deste índice estão `estado: absorvida`: a tela é o HTML desde 02/09, a fila é o `docs/data/paridade-gtk-html.csv` (aba 09) e a ordem de agora é [AS VINTE E QUATRO HORAS](../2026-09-06-AS-VINTE-E-QUATRO-HORAS-a-ordem-que-o-orquestrador-despacha-e-as-rotas-corrigidas.md). O que este índice mediu continua valendo como diagnóstico; nada aqui se despacha pelo id.

*A aba do "o Hefesto está bem?" — do que o produto é hoje até o que o mockup
aprovado mostra.* Sete sprints.

- **Contrato:** `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, §7 Sistema
  (linhas 506-601).
- **Mockup aprovado:** `layout/09-sistema.html`, gerado por
  `src/hefesto_dualsense4unix/interface/aba09.py`.
- **A palavra dela:** `src/hefesto_dualsense4unix/interface/CORRECOES-DELA.md`, seção
  "Aba Sistema".
- **Protocolo de quem executa:** `docs/process/COMO-EXECUTAR-UMA-SPRINT.md`.

## A ordem

```
  03 ───────────────┐                (backend puro, corre em paralelo)
                    ↓
  01 ──→ 02 ──→    04    ──→ 05 ──→ 06 ──→ 07
```

Duas frentes ao mesmo tempo no começo (01 e 03), uma fila depois — e o motivo
é o Glade, não a lógica.

| # | Sprint | Camada | Tamanho | Depois de |
|---|---|---|---|---|
| 01 | O Retomar, e o Ligar/Desligar com um dono só | ambas | ~350 linhas | — |
| 02 | O gamepad virtual muda-se da Emulação | ambas | ~300 linhas | 01 |
| 03 | O exame aprende a falar em quatro partes | backend | ~400 linhas | — |
| 04 | O cartão de saúde vira linhas, e a explicação vira dica | frontal | ~400 linhas | 01, 02, 03 |
| 05 | Os botões que não cabiam, e o registro técnico ao lado | frontal | ~450 linhas | 01, 02, 04 |
| 06 | Os dois motores que ninguém chama | ambas | ~300 linhas | 01, 02, 04, 05 |
| 07 | O que só o terminal alcança | ambas | ~350 linhas | 01, 02, 04, 05, 06 |

**Por que a fila é quase linear:** `gui/main.glade` é XML único sem seções
nomeadas — conflito de merge nele é irrecuperável na prática, e o protocolo o
trata como **recurso de bancada, uma sprint por vez**
(`COMO-EXECUTAR-UMA-SPRINT.md` §2). Cinco das sete sprints o tocam, e
`app/actions/daemon_actions.py` (2.780 linhas) é tocado por seis. O
`depois_de` **serializa** essas colisões em vez de proibi-las — que é o que o
`check_colisao_de_sprints.py` aceita como declaração. A 03 é a única que não
toca `app/` nem o Glade: ela pode correr desde o primeiro minuto.

**Por que o `depois_de` repete a fila inteira em vez de só o antecessor:** o
`check_colisao_de_sprints.py:230` compara **par a par** e não fecha
transitivamente — `04 depois_de [02]` não faz o portão parar de acusar
`01 x 04`. Cada sprint lista **todas** as anteriores com que compartilha
arquivo. Não é redundância: é o que o portão lê. Medido — com só o antecessor
declarado, o portão devolvia **dez** queixas nesta onda.

## O que cada uma fecha, em uma linha

1. **01** — `daemon.resume` existe desde sempre e nenhuma tela o chama; a
   pausa sobrevive ao boot. Nasce o botão **Retomar**, nasce o quinto estado
   `pausado`, e o Ligar/Desligar das duas abas passa a ter **um dono só**.
2. **02** — o diagnóstico da máquina (uinput, aparelho, VID:PID, controles
   detectados, autoteste) muda-se da Emulação para o quadro **Gamepad
   virtual**; os dois "Atualizar" viram um; a fita apaga com o motivo certo.
3. **03** — o exame de saúde passa a devolver **quatro campos** em vez de uma
   frase grudada, para que o veredito caiba na tela e a explicação caiba na
   dica. O terminal não muda.
4. **04** — o cartão de saúde deixa de ser **um** `GtkLabel` e vira uma linha
   por achado, com selo, veredito curto e "?" com *o que eu vi / por que
   importa / o que fazer*.
5. **05** — a fileira de cinco botões que pedia **1230 px** numa janela de
   1180 vira duas listas verticais com dica em cada botão; "Detalhes técnicos"
   sobe para a direita do Avançado; "Restaurar de fábrica" chega do rodapé; os
   dois quadros do topo ficam do mesmo tamanho.
6. **06** — os dois motores escritos, testados e **sem chamador**:
   `curar_o_que_e_automatico` (`prontuario_dos_jogos.py:885`) e
   `steam_root_ou_recusa` (`proton_pin.py:184`).
7. **07** — o que só o terminal alcança: a lista de **plugins** do daemon, e a
   linha **Como o Hefesto enxerga a janela** (`ambiente_na_tela.py:76`, zero
   chamadores).

## O censo: o que virou sprint, e o que não virou

Da tabela de botões do contrato (redesenho, linhas 528-552) e do "Nada se
perdeu" (linhas 561-586):

| Item | Veredito |
|---|---|
| Ligar junto com o computador · Ligar · Desligar · Reiniciar · Corrigir modo de execução · Atualizar · Ver detalhes · Deixar tudo pronto · Este jogo não funciona · Copiar opções · Aplicar aos jogos da Steam · Tirar o que faz engasgar · painel Detalhes técnicos · linha "Trocar de perfil ao abrir o jogo" · vigia do Steam Input morto · ponte divergente | **existem e funcionam** — só mudam de forma/lugar (01, 02, 04, 05) |
| Retomar · Ver os plugins / Recarregar · Como o Hefesto enxerga a janela | **existem no código e nunca tiveram tela** → sprints de LIGAR (01, 07) |
| Consertar problemas conhecidos · Fixar a versão que funciona | **existem, e o motor certo nunca foi chamado** → 06 |
| Testar o controle virtual · UINPUT/Device/VID:PID/Controles detectados | **vêm da Emulação** → 02 |
| Restaurar de fábrica | **vem do rodapé** → 05 |
| Cartão Saúde do sistema | existe, e é **reformado** → 03 + 04 |
| Desligado / DualSense (PS) / Xbox 360 · Gamepad para os jogos · Suspender mouse e teclado · Sair do modo jogo · quadro dos combos · Buffer 150 · Passthrough · Verificar / Desligar Steam Input · Mic ligar/desligar · Próximo/Anterior | **não são desta aba** — o redesenho os manda para Jogar, Navegação, Conexões e Controles. Fora desta onda |

## As perguntas dela — o estado de cada uma

O contrato deixou seis abertas (redesenho, linhas 592-601). Três já têm
resposta e **não se reabrem**:

1. **Os cinco botões de Steam ficam na Sistema ou vão para a Lançadores?**
   **RESPONDIDA POR ELA:** ficam na Sistema — *"E OS CINCO BOTÕES DE STEAM
   FICAM NA SISTEMA — ela decidiu contra a minha recomendação, e a razão dela é
   coerente: a aba nova não existe ainda"*
   (`D-A-ABA-LANCADORES-NASCE-PLACEHOLDER`, `/tmp/coleta/decisoes.md:237`).
   → sprint 05.
2. **Numa linha [WARN], o conserto aparece na tela ou só no hover?**
   **RESPONDIDA PELO MOCKUP APROVADO:** só no hover (`aba09.py:56`). A sprint
   04 segue o mockup e marca `PROVISÓRIO — decisão dela` na linha que escolhe.
3. **"Este jogo não funciona" e a caixinha "Esconder os controles físicos"
   marcam o mesmo arquivo — ficam os dois caminhos?** **ABERTA, e não é desta
   onda:** a caixinha é da aba Perfis. Nenhuma sprint daqui mexe nela; o botão
   fica como está.
4. **O interruptor "avisar quando a bateria estiver acabando" mora aqui?**
   **ABERTA, e NÃO virou sprint.** As duas funções existem e ninguém as chama
   (`integrations/desktop_notifications.py:272` `notify_battery_low`, `:288`
   `notify_battery_recovered`), mas **não há interruptor no mockup aprovado** —
   e a regra é não inventar feature. Se ela disser que sim, é uma oitava
   sprint, pequena.
5. **Entra uma linha "outro programa está mandando efeito pelo canal DSX" no
   diagnóstico?** **ABERTA, e NÃO virou sprint.** A porta existe
   (`daemon/udp_server.py`, `127.0.0.1:6969`, e ela aceita gatilho e cor de
   qualquer programa local), nenhuma tela conta isso, e o mockup não tem a
   linha. É a explicação que falta quando o gatilho muda sozinho — vale
   perguntar de novo, com a tela na frente dela.
6. **Plugins na tela: sim ou não?** **RESPONDIDA PELO MOCKUP APROVADO:** sim,
   botão no quadro Avançado, saída no painel "Detalhes técnicos", sem quadro
   próprio. → sprint 07.

## Duas coisas que quem coordena precisa saber

**O campo `onda:` não existe no portão.** O formato de frontmatter aceito por
`scripts/check_colisao_de_sprints.py:81` é
`sprint · posse · cria · bancada · depois_de · nao_toca`, e ele **recusa campo
desconhecido** em vez de ignorá-lo (por desenho: *"um campo com erro de
digitação que passa em silêncio vira posse não declarada"*). Nas sete sprints
a onda está declarada como **comentário** (`# onda: SISTEMA`), que o
analisador pula.

**E isto já está reprovando o repositório agora**, por outra onda: as onze
sprints de `2026-08-27-ONDA-LANCADORES-*.md` declararam `onda:` como **chave**,
e o portão devolve `rc=1` com *"11 frontmatter(s) que não consegui ler"* — o
que **cega o portão inteiro**: com erro de leitura ele nem chega a procurar
colisão. Ou aquelas onze trocam a chave por comentário, ou alguém acrescenta
`"onda"` a `_CAMPOS_CONHECIDOS` (`check_colisao_de_sprints.py:81`). Não é
trabalho desta onda — é decisão de quem coordena, e vale para as dez.

**Três arquivos são disputados por outras ondas**, e está declarado em cada
sprint:

| Arquivo | Quem mais o quer | Onde |
|---|---|---|
| `gui/main.glade` | **todas** as ondas de aba | 01, 02, 04, 05, 07 |
| `app/actions/emulation_actions.py` | onda **Lançadores** | 02 |
| `app/actions/footer_actions.py` | onda **Perfis** | 05 |
| `app/actions/home_actions.py` | onda **Jogar** | 01 |

O `check_colisao_de_sprints.py` vai **gritar** quando as outras ondas
existirem no disco. Barulho é o produto desejado: quem coordena serializa com
`depois_de`, não com edição simultânea.

## O que esta onda NÃO entrega, de propósito

- **A frase da aba Jogar sobre a pausa** (`home_actions.py:208`,
  `TEXTO_EM_PAUSA`) é corrigida pela sprint 01 porque ela ensina uma saída que
  não existe; **o resto da aba Jogar não é desta onda.**
- **`descrever_steam_encontrada`** (`ambiente_na_tela.py:103`) continua sem
  tela: a chave `steam_layout_achado` que ela lê **ninguém publica** em
  `state_full`, e o mockup não pede a linha. Fica declarado, não fica escondido.
- **A aba Emulação não é apagada.** A sprint 02 tira dela só o bloco de
  diagnóstico; a página inteira é da onda **Lançadores**
  (`D-A-ABA-LANCADORES-NASCE-PLACEHOLDER`).

## Antes de fechar a onda

```bash
git add -A                       # os portões são cegos a arquivo novo
bash scripts/portoes.sh          # os 26 portões
python3 scripts/check_colisao_de_sprints.py
```

E, porque a onda mexe na tela: `scripts/gui-captura/retratar_abas.py` — **por
quem coordena, depois que a leva fechar**, nunca dentro da árvore de um agente
(`COMO-EXECUTAR-UMA-SPRINT.md` §5).

## CORTES DELA, DEPOIS DE VER A ABA PRONTA (27/08/2026, à noite)

Ela abriu o mockup e perguntou *"quais desses botões ainda fazem sentido
existir?"*. Três decisões saíram daí, e elas mudam o tamanho de duas sprints:

| o quê | decisão | onde está escrito |
|---|---|---|
| **Este jogo não funciona** | **SAI** — o daemon já faz sozinho (`gamepad.py:517`) | `ONDA-SISTEMA-05` |
| **Copiar opções para os jogos** | **SAI** — é a versão braçal do "Aplicar aos jogos da Steam" | `ONDA-SISTEMA-05` |
| **Deixar tudo pronto** | **FUNDE** com "Consertar problemas conhecidos"; a diferença é uma confirmação, não um botão | `ONDA-SISTEMA-05` |
| **Testar o controle virtual** | **CONDICIONA** — só aparece quando a linha diz *indisponível*, e vira "me mostra o erro" | `ONDA-SISTEMA-02` |

**Sete botões de "Preparar os jogos" viram três.** O problema de layout que dá
nome à `ONDA-SISTEMA-05` (cinco botões somando 1230 px numa janela de 1180)
deixa de existir por subtração, não por rearranjo — ela ficou menor do que
nasceu.

**DECIDIDO POR ELA, no mesmo dia:** os três que ficam (Consertar · Fixar a
versão · Tirar o que engasga) **rodam sozinhos no exame**, e o botão serve só
para refazer. A linha de saúde passa ao pretérito — *"estava ligado em 2 jogos,
desliguei"* — e o motor que faz isso já existe sem chamador
(`prontuario_dos_jogos.py:885`). Nada desta aba fica esperando decisão dela.
