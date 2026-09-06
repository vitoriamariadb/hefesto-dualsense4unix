# As vinte e quatro horas — a ordem que o orquestrador despacha, e as rotas corrigidas

**06/09/2026, madrugada.** Escrito por quem leu a casa inteira sem despachar
ninguém, a pedido dela:

> *"vá ajustando as specs, corrigindo as rotas pra que possamos otimizar. termos
> o produto completo de forma que um opus ao ser orquestrador e po, vá
> despachando agentes para a completa integração e funcionamento do projeto.
> (…) Eu realmente gostaria de voltar a jogar e a usar o meu app em html em no
> máximo 24h (…) Se aproveitando ao máximo do que eu programei em gtk mas
> adaptando ao html."* <!-- noqa-acento: citação literal dela -->

**Este arquivo é a fila.** Quem coordena (o Opus, como PO e orquestrador) lê a
§0, despacha a §5 na ordem, decide pela §3 sem reabrir, e só interrompe ela
pela §6. As specs que ele despacha são as sprints já escritas em
`docs/process/sprints/2026-09-05-*` e `2026-09-06-*`; **as rotas delas foram
corrigidas hoje** (§4) e a correção está nos próprios arquivos.

---

## 0. EM UMA LINHA, E O QUE "PRONTO" QUER DIZER

**Estado:** `dev` em `40835efb`, 43 portões verdes, 17.974 testes em doze
lotes, o daemon dela no ar desde 01:20 com dois DualSense na mesa. **O
lançador dela voltou a abrir** — a cura entrou em `e0bb5b79` (06/09 02:17);
o passo 0 da §5 confere e segue.

**Pronto, na palavra dela (02/09):** *"o que temos no gtk + os ajustes pra
comportar a nova infra + as features não desenvolvidas"* — com cabo **todas** as
features, e por rádio *"só faltava o som e o mic"*.

**O que estas 24 horas fecham, medido pela fila e não pelo desejo:**

| bloco | o que é | fecha em 24 h? |
| --- | --- | --- |
| **A–C** | as 20 sprints abertas da ONDA CINCO, a S-10 do transporte, AS DUAS ABAS FALAM, o piloto (P-01), o mic virtual no cabo e a T-10 das conexões | **sim** — é o corpo do dia (§5) |
| **D–E** | a paridade que ela USA para jogar: perfil com Modo, Steam Input e allowlist, as cinco luzes e a cor livre, "o que chega ao jogo", os atalhos de tecla | **se a costura não engasgar** — são sprints novas, escritas pelo Opus a partir da §5.4 |
| fora | som por rádio, editor avançado de regra, "Mapear Entrada a Entrada", controles externos, aposentar a janela GTK, o resto dos 89 FALTA | **não** — §10 diz por quê, um a um |

---

## 1. O ESTADO, MEDIDO EM 06/09 01:00

| instrumento | número |
| --- | --- |
| `check_paridade_gtk_html.py --tabela` | 396 feats · 119 IGUAL · 125 DIFERENTE · **89 FALTA** · 59 SÓ-HTML · 4 ? · **30 %** |
| `check_paridade_transporte.py` | 308 linhas · 616 células · 47 mudas · 72 afirmações fortes, todas com teste · 7 avisos |
| `check_donos_de_comportamento.py` | VERDE · 50 donos · 6 CURADO · 16 DIVERGE · 13 DUPLICATA · **15 SÓ-GTK** · dívida 2.397 linhas (teto) |
| `check_o_desenho_aprovado.py` | 13 páginas · 12 no produto · 1 atrás (`02-controles`, só comentário CSS) |
| ONDA CINCO | 25 itens · **4 fechados** (03-01 piscada, 04-01 brilho, MIC-VIRTUAL-01 passo 1, DOCUMENTACAO) · 21 abertos |
| fila T de 04/09 | T-01…T-09 **fechadas** (medido no fonte e no git) · **T-10** CONEXOES-LIGAR-TUDO aberta |
| fila S de 04/09 | 12 de 13 fechadas · **S-10** O-TRANSPORTE aberta |
| árvore | 378 branches · 294 worktrees `worktree-wf_*` residuais · 23 em `hefesto-voo/` · **5 branches com trabalho que pode não estar no `dev`** (§8) |
| registro de decisões | `docs/data/decisoes-dela.csv`: **as 54 da ONDA CINCO constam como "DECIDIDA POR DELEGAÇÃO (04/09)"** — ela as respondeu em 05/09, e a resposta só está nas sprints |

---

## 2. O CAOS, NOMEADO — e o que este arquivo fez com cada pedaço

1. **Filas empilhadas que não são filas.** Existem sete listas abertas (ONDA
   CINCO; T e S de 04/09; os 50 donos; as 232 linhas; as 120 sprints antigas do
   `SPRINT_ORDER` §4; as 110 da MIGRA; as 90 do redesenho). **Só uma é
   executável: a ONDA CINCO mais T-10 e S-10.** As outras são INVENTÁRIO, e a
   régua que as mede é uma só: `docs/data/paridade-gtk-html.csv`. → §3, decisão 1.
2. **O registro de decisões mente sobre quem decidiu.** 54 linhas do CSV dizem
   "delegação" onde há palavra dela, verbatim, nas 22 sprints. → §5, ONDA A,
   tarefa `C1`.
3. **As rotas das sprints tinham CICLOS e chaves duplicadas.** Nove pares de
   sprints esperavam uma pela outra (01-01↔01-03, 01-02↔01-03, 01-01↔07-03,
   AS-DUAS↔03-02, 05-01↔05-03, 05-02↔05-03, 08-01↔08-02, 10-01↔10-02,
   07-01↔10-02), e doze arquivos tinham **duas** chaves `depois_de:` — o
   analisador do portão (`scripts/check_colisao_de_sprints.py`, `le_frontmatter`)
   **fica com a última e descarta a primeira em silêncio**. Nenhum agente
   conseguiria começar. → **corrigido hoje nos 16 arquivos** (§4).
4. **Três relatos ao piloto sem dono.** A 05-03, a 10-02 e a 05-02 pedem
   mudanças em `hefesto_vivo.py` que nenhuma podia fazer. → nasceu a
   **ONDA5-P-01** (`sprints/2026-09-06-ONDA5-P-01-…md`), em ONDA A.
5. **Cinco branches com trabalho fora do `dev`**, e 294 árvores mortas. → §8.

---

## 3. AS DECISÕES DE COORDENAÇÃO — tomadas aqui, para não serem reabertas

Cada uma tem razão medida; o Opus registra as que forem de produto no CSV com
`quem_decidiu=delegacao` e segue.

1. **A única fila é a paridade.** O `SPRINT_ORDER.md` §2 (90 do redesenho) e
   §4 (120 antigas) e a auditoria da MIGRA (110, zero fechadas por rota
   diferente) são **arquivo**. Nenhuma sprint dessas é despachada pelo id: se o
   que ela pedia ainda falta, ela aparece como linha FALTA/DIFERENTE do CSV e é
   por essa linha que nasce trabalho. *Por quê:* três dias de auditoria mediram
   que as filas antigas contam o mesmo trabalho três vezes com nomes diferentes.
2. **S-10 (cabo/rádio) roda PRIMEIRO e sozinha nos seus sete arquivos.** Ela
   toca `mesa_viva`, `pacotes/__init__`, a01, a02, a03, a07 e a09 — quase tudo.
   Deixá-la para o fim seria costurar sete arquivos editados por dez frentes.
   *Custo:* as frentes de a01/a02/a03/a07/a09 nascem na ONDA B, de
   `onda/atual`, depois dela.
3. **O CSV da paridade e o `mockup/DIVERGENCIAS.md` são do coordenador durante
   as 24 h.** Toda sprint LISTA as linhas e a seção; ninguém edita. A 10-03
   (só CSV) vira tarefa do coordenador na costura da ONDA A. *Por quê:* dez
   frentes numa planilha é conflito por linha, medido na ONDA QUATRO.
4. **O terceiro lugar do recado é DESTINO DO PILOTO, declarado pela página**
   (`data-hef-recados`), não peça da aba. *Por quê:* a 05-03 mediu que um
   relógio dentro do pacote seria a segunda cópia do `_depositar`; a 03-01
   deixou a escolha para quem coordena. Está na P-01, §1.
5. **A quarta porta do ouvinte é `data-hef-vivo`** — evento `input` despacha um
   gesto de LEITURA, nunca o que grava. P-01, §2.
6. **O `↻` de reenvio da aba 03 FICA até ela dizer o contrário.** Tirar é
   destruir trabalho medido com cinco réguas por causa de uma resposta dada
   sobre um mundo sem ele (03-02, §2). A pergunta vai na §6.
7. **A janela GTK não se toca**, e `app/` é motor: as sprints de paridade
   REUSAM `app/actions/*` e `app/widgets/*`; o que for recriado em HTML entra em
   `docs/data/donos-de-comportamento.csv` com dono, e **o teto de 2.397 linhas
   não sobe sem razão escrita**. D-19 continua parada por decisão dela.
8. **Texto de tela novo vai para a bancada e espera o olho dela UMA vez, no
   fim** — não a cada item. É a `PROVA-DE-TELA-01` com a cadência que as 24 h
   pedem: as abas que a bancada adiantar (02, 05, 06, 08, 09, 10) chegam a ela
   juntas para `--publicar`. Enquanto não publica, o produto continua o de hoje.
9. **O Opus decide o resto sozinho** — ela delegou (*"seja o po e orquestrador
   e todas as sprints restantes"*, 04/09) e a única exceção é validação de tela.
   Quando ele recusar todas as opções escritas numa sprint, a hipótese certa é
   que a pergunta está errada, não que falta uma quarta.

---

## 4. AS ROTAS CORRIGIDAS

O que mudou nos frontmatters em 06/09 (16 arquivos): uma chave `depois_de` por
sprint, os nove ciclos desfeitos, `mockup/DIVERGENCIAS.md` saiu da posse de
02-02 e 08-01 (decisão 3), e a 02-01 passou a citar os 43 portões. A P-01 é
nova. **O portão `colisao-de-sprints` foi rodado depois e está verde.**

| sprint | posse-chave | espera (só o que ainda está aberto) | onda |
| --- | --- | --- | --- |
| **ONDA4-S10** | mesa_viva · pacotes/__init__ · a01 · a02 · a03 · a07 · a09 | — | A |
| ONDA5-P-01 | hefesto_vivo · ponte_da_tela | — | A |
| ONDA5-01-02 | home_actions · frases_que_ela_baniu | — | A |
| ONDA5-02-02 | aba02 · mockup/02 | — | A |
| ONDA5-05-01 | aba05 · mockup/05 | — | A |
| ONDA5-05-02 | a05 | — | A |
| ONDA5-06-01 | core/acoes_de_botao · profiles/manager · hotkey | — | A |
| ONDA5-07-02 | rodape · perfil | — (a linha de `a10_perfis` vai por relato; o coordenador aplica) | A |
| ONDA5-08-01 | aba08 · a08 · mockup/08 · paginas/08 | — | A |
| ONDA5-09-01 | aba09 · mockup/09 | — | A |
| ONDA5-10-01 | simple_match · perfis_web · profiles_actions · a10 · aba10 | — | A |
| ONDA5-MIC-VIRTUAL-01 (passos 2–4) | fontes_de_captura · quem_ouve · canal_do_microfone | — | A |
| C1 (registro) | docs/data/decisoes-dela.csv | — | A |
| ONDA5-10-03 | paridade CSV | S-10 (mesmo dono: o coordenador) | costura A |
| ONDA5-01-01 | a01 | S-10 | B |
| AS-DUAS-ABAS-FALAM-01 | a03 | S-10 | B |
| ONDA5-02-01 | ipc_handlers · audio_control · a02 | S-10 | B |
| ONDA5-05-03 | a05 · aba05 · mockup/05 | 05-01 · 05-02 · P-01 | B |
| ONDA5-06-02 | aba06 · a06 · paginas/06 | 06-01 | B |
| ONDA5-07-01 | steam_launch_options · sentinela · prontuario · desenho_dos_lancadores · a07 | S-10 | B |
| ONDA5-08-02 | mapa_da_mesa · aba08 | 08-01 | B |
| ONDA5-09-02 | a09 | S-10 | B |
| LUZES-01 *(nova, §5.4)* | a04 · aba04 · mockup/04 | — | B |
| ONDA5-03-02 | a03 · aba03 | AS-DUAS · (03-01 feita) | C |
| ONDA5-07-03 | home_actions · painel · a01 · jogar_vivo | 07-02 · 01-01 · 01-02 | C |
| ONDA5-10-02 | aba10 · a10 · mockup/10 · carona_do_wrapper · sentinela | 10-01 · 07-01 (P-01 para o "ao vivo") | C |
| MIC-VIRTUAL-02 *(nova)* | dualsense_bt_audio · bt_mic · eleicao · audio_control | MIC-VIRTUAL-01 · 02-01 | C |
| T-10 CONEXOES-LIGAR-TUDO | a08 · aba08 · ipc_handlers (família IPC) | 08-02 · 02-01 | C |
| STEAM-INPUT-01 *(nova)* | a07 · desenho_dos_lancadores · aba07 | 07-01 | C |
| SISTEMA-STEAM-01 *(nova)* | a09 · aba09 | 09-02 · 09-01 | C |
| CONTROLES-VERDADE-01 *(nova)* | a02 · aba02 · mockup/02 | 02-01 · 02-02 | C |
| NAVEGACAO-TECLAS-01 *(nova)* | core · profiles · a06 · aba06 | 06-02 | C |
| PERFIL-MODO-01 *(nova)* | perfil.py · a10 · aba10 · perfis_web | 10-02 · 07-02 | D |
| PARIDADE-REMEDIR-01 *(nova, doc)* | paridade CSV | tudo de A–C costurado | D |
| JOGAR-O-QUE-FALTA-01 *(nova)* + ONDA5-01-03 | a01 · aba01 · mockup/01 | 07-03 · PERFIL-MODO-01 | E |

---

## 5. AS ONDAS — por posse de arquivo, na ordem de desbloqueio

Cadência de cada onda: despacho → agentes em worktree própria → `costurar.sh`
para `onda/atual` → **43 portões** → próxima onda nasce de `onda/atual`
(`HEFESTO_BASE=onda/atual`). **A suíte em doze lotes é uma vez, no FECHO**, e
mais uma vez se a ONDA C tocar o daemon (toca: 02-01 e T-10). Tempos são de
relógio de parede com 8 a 12 agentes em paralelo.

### Passo 0 — antes de qualquer despacho (30 min, o coordenador, na árvore dela)

1. **O lançador já está em `dev`** (`e0bb5b79`, 06/09 02:17: `interface.sh`
   exporta `HEFESTO_NA_TELA=1`, a guarda fica, quatro réguas em
   `tests/unit/test_o_lancador_dela_nasce_na_tela_dela.py`). Confira que
   `git log -1 dev` é este ou posterior e que o `.desktop` abre as dez abas na
   tela dela. **Nenhum outro commit direto em `dev` até o FECHO.**
2. **A árvore de integração:** `git worktree add ../hefesto-voo/_integra-0609 -b onda/atual-0609 dev`.
   Copie o `CLAUDE.md` para lá e para toda worktree de agente
   (`.gitignore:90`).
3. **A casa (§8):** `scripts/despachar-agente.sh --limpar` e a triagem das cinco
   branches.

### ONDA A — h0 a h4 · 12 agentes · nada aqui espera nada

`S-10` · `P-01` · `01-02` · `02-02` · `05-01` · `05-02` · `06-01` · `07-02` ·
`08-01` · `09-01` · `10-01` · `MIC-VIRTUAL-01` (passos 2–4) · **C1**.

**C1 — o registro passa a dizer quem decidiu** (1 agente, só
`docs/data/decisoes-dela.csv`): as 54 linhas `D-0*` nascidas de *"as 54
levantadas em…"* ganham a coluna `quem_decidiu` (`ela` | `delegacao`) e a
`escolha` verbatim dela de 05/09, copiada **do cabeçalho da sprint que a
executa** (cada `2026-09-05-ONDA5-*.md` abre com a decisão entre aspas);
`revoga=` aponta a decisão do PO de 04/09 que caducou (cadeado 01-Q3, reenvio
03-Q3, custo da máscara 10-Q6, o cartão C-3 e a faixa C-6, o nome
"Reaplicar"). É o conserto C1/C2 de
`2026-09-05-POR-QUE-A-FILA-REPETE-a-queixa-dela-medida.md`. Sem isto a próxima
leitura repete as perguntas.

**Costura da A** (1 h): `10-03` (duas linhas do CSV) e a linha 21 da S-10 pelo
coordenador; a linha de `a10_perfis.py` que a 07-02 relata; `DIVERGENCIAS.md`
com as seções de 02, 05, 08 e 09. Portões. **Mede antes de abrir a B:**
`check_colisao_de_sprints.py` verde, `hefesto_vivo.py --oculta --prova-de-mockup`
sem regressão no número PRODUTO (188 em 02/09).

### ONDA B — h4 a h9 · 9 agentes · nasce de `onda/atual`

`01-01` · `AS-DUAS-ABAS-FALAM-01` · `02-01` · `05-03` · `06-02` · `07-01` ·
`08-02` · `09-02` · **LUZES-01**.

Atenção do coordenador: a 02-01 mexe em `ipc_handlers.py` (6.521 linhas, o
gargalo do daemon) — é a única da onda que toca daemon; a 06-02 vai deixar
vermelha `test_a_aba_06_navegacao_fecha_as_linhas.py:221` até reescrevê-la (a
06-01 avisa; está certo). A 05-03 só fecha o Passo 4 com a P-01 no lugar —
confira que `onda/atual` já a tem antes de despachar.

### ONDA C — h9 a h14 · 9 agentes

`03-02` · `07-03` · `10-02` · `MIC-VIRTUAL-02` · `T-10` · **STEAM-INPUT-01** ·
**SISTEMA-STEAM-01** · **CONTROLES-VERDADE-01** · **NAVEGACAO-TECLAS-01**.

Depois da costura da C: **doze lotes** (02-01 e T-10 tocaram o daemon).

### ONDA D — h14 a h18 · 3 agentes + coordenador

**PERFIL-MODO-01** · **PARIDADE-REMEDIR-01** (serial, é o CSV) · o que a C
devolver vermelho.

### ONDA E — h18 a h21

**JOGAR-O-QUE-FALTA-01** (com a `01-03` dobrada nela: são 20 minutos e o mesmo
arquivo) · sobras.

### FECHO — h21 a h24 (o coordenador)

1. merge de `onda/atual-0609` em `dev`, **de uma vez** (regra dela de 25/08);
2. `git add -A && bash scripts/portoes.sh` (os 43) e os doze lotes;
3. `check_paridade_gtk_html.py --tabela`, `check_donos_de_comportamento.py`,
   `check_o_desenho_aprovado.py` — os três números no handoff;
4. as dez fotos `--oculta` das abas, e a `PROVA-DE-TELA-01` de cada sprint
   conferida no relatório (foto, clique, mordida);
5. o `ONDE-PARAMOS` do dia, com a §6 deste arquivo respondida ou não;
6. **os três atos dela** (§6).

### 5.4 As sprints NOVAS — o coordenador escreve o arquivo antes de despachar

Cada uma nasce no molde das de 05/09 (decisão verbatim · o que se mediu · passos
com MORDIDA · réguas · NADA SE PERDEU · PROVA DE TELA), com o frontmatter de
posse. O escopo, o dono GTK a reusar e o que **não** entra:

| sprint | escopo (linhas FALTA do CSV) | reusa do GTK | não entra |
| --- | --- | --- | --- |
| **LUZES-01** (aba 04) | cor livre (paleta); marca da cor escolhida; as 5 luzes de jogador — marcar, presets P1..P4, todas acesas/apagadas, "Aplicar o desenho"; checkbox `auto_player_colors`; "Voltar todos ao automático"; a regra D4 com aviso | `app/actions/lightbar_actions.py` | prévia "honesta" como texto (máscara não custa feature: ou aplica, ou cala) |
| **STEAM-INPUT-01** (aba 07) | conferir e desligar o Steam Input; "Este jogo não funciona" (allowlist); "Deixar tudo pronto" com UM consentimento; lembrete do jogo que não abre pelo launcher | `app/actions/emulation_actions.py`, `daemon_actions.py`, `launch_wrapper_dialog.py` | nada do que a 07-01 já cobre |
| **SISTEMA-STEAM-01** (aba 09) | "Consertar problemas conhecidos"/"Refazer"; "Aplicar aos jogos da Steam"; "Restaurar de fábrica"; "Corrigir modo de execução"; "Tirar a sobreposição Vulkan" com o mesmo rótulo nos dois lados | `daemon_actions.py`, `footer_actions.py`, `emulation_actions.py` | perfil de bateria (tabela e conta de slots) — ela disse *"não é pra ter mesa em nada da interface"* |
| **CONTROLES-VERDADE-01** (aba 02) | "o que chega ao jogo"; título do card com a palavra do transporte (S-10) e o jogador; badge de degradação do vpad; giroscópio "fluindo (~N Hz)"; rótulo das quatro situações da barra de luz | `app/widgets/controller_card.py` | Liberar/Devolver (02-Q6 fechou: fora, com aviso) · medidor de onda (fica para depois) |
| **NAVEGACAO-TECLAS-01** (aba 06) | editar QUAL tecla cada botão digita; `key_bindings` × `button_actions` convivem no daemon (`resolver()` consulta os dois); "Voltar ao padrão" não apaga o que ela escreveu na janela antiga | `app/actions/input_actions.py`, `core/acoes_de_botao.py` | o PS (é a 06-01/06-02) |
| **PERFIL-MODO-01** (aba 10) | a seção `mode` do perfil (os quatro rótulos de `_MODE_KIND_ITEMS`) **sem as duas frases** (10-03); "Ativar" reflete nas outras abas na hora; a lista suspensa dos jogos DESTA máquina | `profiles_actions.py`, `perfis_web.py`, `jogos_locais.py` | editor avançado (recusado em 10-Q2) · "Salvar este perfil" (D1: o perfil grava o que ela tocou; o rodapé já salva) |
| **JOGAR-O-QUE-FALTA-01** (aba 01) | o modo/máscara clicados entram na seção `mode` do perfil ativo (usa o escritor da PERFIL-MODO-01); a linha "Ponte com o jogo"; o marcador "primário"; o que a aba faz com o daemon DESLIGADO; banner de degradação do vpad | `home_actions.py`, `app/actions/jogar/painel.py` | custo da máscara antes do clique (10-Q6) · controles externos · o aviso de Navegação (a máscara não custa feature) |
| **MIC-VIRTUAL-02** | o rádio alimenta o nó `hefesto_mic_<hex6>`; os quatro chamadores de `escolher_fonte` passam pela regra 0 | o corte está escrito em `ONDA5-MIC-VIRTUAL-01`, §3 | o mudo do firmware (`common[9]`) · drop-in · WirePlumber |
| **PARIDADE-REMEDIR-01** (só CSV) | reler as linhas FALTA que 05/09 e as decisões D1/D2/D3 envelheceram — as 6 da aba 05 (não há mais rascunho: "grava no clique" É a feature), os sliders da 02, o "Salvar" da 10 — e as que A–C fecharam | `check_paridade_gtk_html.py` (regra: IGUAL só com sinal PRESENTE e endereço) | nenhuma linha vira IGUAL sem endereço lido no código |

---

## 6. O QUE É DELA — três perguntas de dois minutos, e três atos

**Perguntas (respondem-se numa mensagem):**

1. **O `↻` de reenvio na aba Gatilhos fica ou sai?** Ele existe desde 04/09 à
   noite, ao lado do "Guardar", com cinco réguas. A pergunta 03-Q3 que você
   respondeu *"nada novo"* foi escrita antes de ele existir. *Recomendação:
   fica.*
2. **O selo da linha nova da coluna Atenção chama-se `CONTROLE`?** É a linha
   *"cura do travamento do USB ausente"* (01-01), que aparece só quando a cura
   cai. *Recomendação: sim.*
3. **Som por rádio: quer o ensaio na bancada com você?** Precisa da sua mão e
   da sua orelha (controle no rádio, `0x39` com conteúdo variado — a canônica
   diz o passo). Sem isso, som por BT não entra em plano nenhum. *Recomendação:
   marcar depois destas 24 h.*

**Atos (só você faz):**

* **Publicar**, no FECHO, as abas que a bancada adiantou:
  `scripts/check_o_desenho_aprovado.py --publicar NN` para 02, 05, 06, 08, 09 e
  10 — uma volta só, olhando as fotos que o handoff traz.
* **Instalar**, depois do merge em `dev`: `./install.sh --yes` na SUA árvore.
  Ele reinicia o seu daemon; por isso é seu, ou é com a sua palavra.
* **Abrir pelo `.desktop` e jogar.** É a prova final, e ninguém a substitui.

---

## 7. O QUE SE MEDE — antes de abrir a próxima onda, e no fim

| régua | hoje | meta das 24 h |
| --- | --- | --- |
| `bash scripts/portoes.sh` (43) | verde | verde em toda costura |
| doze lotes (`tests/unit`, 1.167 arquivos) | 17.974 verdes | verdes no FECHO e depois da C |
| `check_paridade_gtk_html.py --tabela` | 89 FALTA · 30 % | **FALTA ≤ 60**, e o terceiro número sobe — a régua diz quanto |
| `check_donos_de_comportamento.py` | teto 2.397 | **não sobe** sem linha nova no CSV dos donos |
| `check_colisao_de_sprints.py` | verde | verde a cada sprint nova escrita |
| `hefesto_vivo.py --oculta --prova-de-mockup` | 188 PRODUTO (02/09) | não regride; sobe com 02-02, 05-03, 06-02, 08-01 |
| `check_paridade_transporte.py` | 47 mudas | as células do mic virtual saem do travessão (MIC-VIRTUAL-02) |
| `install.sh` na árvore dela | rc=0 (05/09) | rc=0, `doctor` sem FALHA, o `.desktop` abre as dez abas |

**A regra que decide qualquer vermelho:** quando o instrumento e o aparelho
discordam, o aparelho ganha — arranque a cura e olhe de novo. Três dublês mais
frouxos que o real derrubaram 24 réguas em 05/09; a sprint que passar com a
cura arrancada não passou.

---

## 8. A CASA — o que se apaga, o que se examina

Medido com `git cherry dev <branch>` e conferindo se os arquivos que cada
commit CRIOU existem no `dev`:

* **Já estão no `dev` (apagar a branch é seguro):** `worktree-wf_2f0bd56a-8c9-{1,2,3,4}`,
  `worktree-wf_47e9d83d-862-{1,2}`, `worktree-wf_cd148479-67e-2`,
  `worktree-wf_401cc629-632-{6,13}`, `worktree-wf_40c88140-1ee-{3,4,7,8}`,
  `worktree-wf_51f2071e-3a7-{3,14}`, `worktree-wf_bfc27e0e-e60-7`,
  `worktree-wf_af2f3641-19f-{1,2,3,4,5}`. O `git cherry` marca metade delas
  com `+` só porque a costura de 02/09 e 05/09 foi por `cherry-pick` com
  conflito resolvido (o patch-id muda); o conteúdo está lá.
* **Examinar antes de apagar (5):** `voo/A-CASA-ARRUMADA-01-RAIZ` (um relatório
  de 25/08 e dez linhas de `.gitattributes`/`.gitignore`);
  `worktree-wf_3a532bd9-e75-{1,7}` (dois testes da aba 06 que não existem no
  `dev`: `test_a_06_a_escolha_dela_sobrevive_ao_tique.py` e
  `test_a_06_a_funcao_do_teclado_tem_tres.py`); `worktree-wf_47e9d83d-862-4`
  (`test_perfil_padrao_personalizado_0{1,2}.py`); `worktree-wf_a789ed37-3d3-conf`
  (a conferência das três levas de fonte externa, doc + teste);
  `worktree-wf_cd148479-67e-3` (um ensaio das duas barras de velocidade no WebKit, em `scripts/ensaios/`, que só existe na branch).
  Para cada uma: se o teste passa contra `onda/atual`, `cherry-pick`; se mede
  o mundo de ontem, uma lápide de uma linha no `ONDE-PARAMOS` e apaga.
* **As 294 árvores `worktree-wf_*`:** `scripts/despachar-agente.sh --limpar`
  remove as já integradas; o que sobrar aparece em `--listar`.
* **As 23 em `hefesto-voo/`:** todas `ahead=0`; as `ONDA0-*`/`ONDA1-*`/`ONDA2-*`
  podem sair (`git worktree remove`). `_integra-*` e `_juiz*` ficam até o FECHO.
* **Nunca** `checkout`, `switch`, `stash` puro, `reset` ou `clean` na árvore
  dela. A integração é em `hefesto-voo/_integra-0609`.

---

## 9. AS REGRAS DE DESPACHO — só o que mudou ou custou

As regras inteiras estão em `COMO-COORDENAR-UMA-LEVA.md` e
`COMO-REGER-AGENTES.md`. O delta destas 24 h:

1. **Toda worktree confere `git log -1 onda/atual-0609` e adianta a própria
   branch antes de escrever** — duas de quatro nasceram mil commits atrás em
   05/09. `HEFESTO_BASE=onda/atual-0609 scripts/despachar-agente.sh <sprint> <agente>`.
2. **Copie o `CLAUDE.md` para a árvore do agente antes de mandar lê-lo.**
3. **Um agente, uma posse; arquivo alheio é RELATO.** O relatório de quatro
   cabeçalhos vai para `docs/process/agentes/2026-09-06/`, **pelo sanitizador**
   (`scripts/sanitizar_saida_de_agente.py`) — os de 05/09 não foram guardados,
   e é dívida.
4. **Prova de tela obrigatória e `--oculta` sempre.** Foto antes/depois, o
   clique, a mordida colada. Sem as três o relatório volta.
5. **Saída de comando vai para arquivo**, nunca crua no terminal dela; matar
   processo só por PID conferido; nada de MAC real nem serial em arquivo
   versionado; a senha `sudo` não entra em prompt de agente.
6. **`install.sh` NUNCA por agente, nunca fora da árvore dela.**
7. **Substituição em massa sobre régua é edição cega** — cada teste que muda
   de pergunta é lido; duas de dezoito voltaram por isso.

---

## 10. O QUE NÃO ENTRA NAS 24 HORAS — e por quê

* **Som pelo rádio.** O canal existe e o firmware responde (`0x32`, `0x39`,
  medido com a lightbar), mas *"o conteúdo do payload ainda não foi
  identificado"* (canônica, *"Os reports de saída por transporte"*). É ensaio de
  bancada com ela, não sprint de agente. Por cabo o som está inteiro.
* **O microfone pelo rádio já funciona** (opt-in, `bt_mic`); o que as 24 h
  fazem é dar-lhe o nome do CONTROLE (mic virtual), que é a exceção que ela
  nomeou à regra de não recriar.
* **Editor avançado de regra** (10-Q2: *"só o aviso"*), **"Mapear Entrada a
  Entrada"** (cerimônia inteira), **controles externos na mesa** (ela tem
  DualSense), **perfil de bateria com tabela de mesa** (*"não é pra ter mesa"*).
* **Aposentar a janela GTK** — D-19, parada por decisão dela; o plano está
  escrito e espera o "agora".
* **O resto dos 89 FALTA** que não são de jogar — ficam na régua, que é onde
  fila mora.

---

## 11. O PROMPT PARA O OPUS

```
Você é o PO e orquestrador do Hefesto (DualSense4Unix) pelas próximas 24 horas.
A fila, as decisões já tomadas e as rotas estão em
docs/process/2026-09-06-AS-VINTE-E-QUATRO-HORAS-a-ordem-que-o-orquestrador-despacha-e-as-rotas-corrigidas.md
— leia inteiro antes de qualquer comando; depois COMO-COORDENAR-UMA-LEVA.md e
o CLAUDE.md da árvore. Regras que não se negociam: a árvore dela fica em `dev`
(integração em ../hefesto-voo/_integra-0609, merge em dev só no FECHO); um
agente por worktree e por posse; toda worktree adianta a branch antes de
escrever; cherry-pick, nunca git apply cego; saída de comando para arquivo;
--oculta sempre; install.sh nunca por agente; nada de MAC real nem serial em
arquivo; a senha sudo não existe para você. Execute o Passo 0, depois as ondas
A→E na ordem da §5, costurando com scripts/costurar.sh e rodando os 43 portões
a cada costura; escreva as sprints novas da §5.4 no molde das de 05/09 antes de
despachá-las e rode check_colisao_de_sprints.py; decida sozinho pelo §3 e
registre no docs/data/decisoes-dela.csv com quem_decidiu=delegacao; só a
interrompa com as três perguntas da §6, numa mensagem só. No FECHO, o
ONDE-PARAMOS com os números da §7, as dez fotos, e os três atos dela listados.
```
