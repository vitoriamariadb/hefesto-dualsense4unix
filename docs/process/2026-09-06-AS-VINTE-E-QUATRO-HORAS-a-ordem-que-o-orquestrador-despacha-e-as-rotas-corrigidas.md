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
no FECHO (§6). As specs que ele despacha são as sprints com `estado: aberta`
(`python3 scripts/check_colisao_de_sprints.py --abertas`); **as rotas delas
foram corrigidas hoje** (§4) e a correção está nos próprios arquivos. O
vocabulário é o de
[A LÍNGUA DESTA CASA](../A-LINGUA-DESTA-CASA-o-glossario-que-a-tela-e-o-codigo-falam.md);
o que vem depois destas 24 horas está no
[SPRINT_ORDER](SPRINT_ORDER.md) §2.

**Revisto às 04:30 do mesmo dia**, depois de seis rodadas de escolhas com ela:
as vinte decisões estão no `docs/data/decisoes-dela.csv` (`D-0609-*`) e mudaram
este arquivo onde está marcado **[ela, 06/09]**.

---

## 0. EM UMA LINHA, E O QUE "PRONTO" QUER DIZER

**Estado:** `dev` em `f0e264e6` mais este commit; 43 portões verdes; 17.974
testes em doze lotes; o daemon dela no ar com dois DualSense na mesa. **O
lançador dela voltou a abrir** (`e0bb5b79`, 06/09 02:17). **A interface está
"sambando"** [ela, 06/09] — repinta sem parar, perde cliques, mata a dica — e
por isso a primeira sprint do dia é a
[A-TELA-SAMBA-01](sprints/2026-09-06-A-TELA-SAMBA-01-a-interface-repinta-perde-cliques-e-mata-a-dica.md),
sozinha, antes de qualquer onda.

**Pronto, na palavra dela:** *"o que temos no gtk + os ajustes pra comportar a
nova infra + as features não desenvolvidas"* (02/09) — e o foco de hoje:
*"fazer os 4 dualsense funcionar seja via bt ou cabo"* [ela, 06/09]. Com cabo
**todas** as features; por rádio o mic entra nas 24 horas e o som tem o ensaio
no FECHO.

| bloco | o que é | fecha em 24 h? |
| --- | --- | --- |
| **Passo 1** | a tela para de sambar | **sim, primeiro** |
| **A–C** | as 21 sprints abertas da ONDA CINCO, a S-10 do transporte, AS DUAS ABAS FALAM, o piloto (P-01), o mic virtual no cabo e no rádio, a T-10 das conexões, os perfis que são perfis, o motor da aba 06 | **sim** — é o corpo do dia (§5) |
| **D–E** | a paridade que ela USA para jogar: perfil com Modo, Steam Input e allowlist, as cinco luzes e a cor livre, "o que chega ao jogo", os atalhos de tecla; a palavra "mesa" sai da tela; a janela GTK sai | **se a costura não engasgar** |
| **FECHO** | merge, portões, fotos; **ela** publica numa volta, o Opus instala com a palavra dela, e a **bancada dos quatro** com o ensaio do som por rádio | **sim, com ela** |
| fora | controles externos, editor avançado de regra, "Mapear Entrada a Entrada", o resto dos 89 FALTA que não é de jogar, o alto-falante virtual | **não** — `SPRINT_ORDER.md` §2 diz onde cada um espera |

---

## 1. O ESTADO, MEDIDO EM 06/09

| instrumento | número |
| --- | --- |
| `check_paridade_gtk_html.py --tabela` | 396 feats · 119 IGUAL · 125 DIFERENTE · **89 FALTA** · 59 SÓ-HTML · 4 ? · **30 %** |
| `check_paridade_transporte.py` | 308 linhas · 616 células · 47 mudas · 72 afirmações fortes, todas com teste · 7 avisos |
| `check_donos_de_comportamento.py` | VERDE · 50 donos · 6 CURADO · 16 DIVERGE · 13 DUPLICATA · **15 SÓ-GTK** · dívida 2.397 linhas (teto) |
| `check_o_desenho_aprovado.py` | 13 páginas · 12 no produto · 1 atrás (`02-controles`, só comentário CSS) |
| `check_colisao_de_sprints.py --abertas` | **59 abertas** de 338 com frontmatter (591 arquivos); 34 dentro das 24 horas |
| a tela dela (medido no DOM, 02:50) | três alvos do pintor mutam o DOM a cada tique mesmo sem mudança; blocos reconstruídos sob o mouse; 33 perfis abertos com `FileLock` a cada ~3 s; a janela do `.desktop` sem log |
| o disco dela | 33 perfis: 9 de gênero + `personalizado` + 24 por jogo, todos de 29/08 23:02, os de jogo iguais ao molde |
| a palavra "mesa" visível nos dez mockups | **179** ocorrências |
| ONDA CINCO | 25 itens · 4 fechados · 21 abertos |
| fila T de 04/09 | T-01…T-09 **fechadas** · **T-10** aberta, agora com frontmatter |
| fila S de 04/09 | 12 de 13 fechadas · **S-10** aberta |
| árvore | 378 branches · 294 worktrees `worktree-wf_*` residuais · 23 em `hefesto-voo/` · 5 branches a examinar (§8) |
| registro de decisões | as 54 da ONDA CINCO constam como "delegação" onde há palavra dela (C1 conserta); as 20 de 06/09 estão como `D-0609-*` |

---

## 2. O CAOS, NOMEADO — e o que este arquivo fez com cada pedaço

1. **Filas empilhadas que não são filas.** Sete listas abertas contavam o
   mesmo trabalho três vezes. → **uma fila** (esta), a régua é o CSV da
   paridade, e cada sprint diz `estado:` no frontmatter; o `SPRINT_ORDER.md`
   foi reescrito em cima disso (§3, decisão 1).
2. **O registro de decisões mente sobre quem decidiu.** → ONDA A, tarefa C1.
3. **As rotas tinham CICLOS e chaves duplicadas.** Nove ciclos e doze
   `depois_de` duplicados → corrigidos nos arquivos (§4).
4. **Três relatos ao piloto sem dono.** → ONDA5-P-01.
5. **Cinco branches com trabalho fora do `dev`**, 294 árvores mortas. → §8.
6. **A interface sambando, e ninguém medindo.** → A-TELA-SAMBA-01, P0.
7. **Perfis que não são perfis** (ação, aventura, corrida) e 24 perfis de
   jogo que são o molde de 29/08. → PERFIS-SAO-PERFIS-01.
8. **Sprints abertas que não estavam em fila nenhuma** — a T-10 sem
   frontmatter, a ONDA3-MOTOR-01 e a ONDA3-GESTO-DECLARA-01 de 04/09 com rotas
   para ids fechados. → entraram nas ondas B, C e D com as rotas certas.

---

## 3. AS DECISÕES — as dela, e as de coordenação, para não serem reabertas

### 3.1 As dela, de 06/09 (`docs/data/decisoes-dela.csv`, `D-0609-*`)

1. **O `↻` de reenvio da aba 03 SAI.** A ONDA5-03-02 ganhou o passo; as linhas
   106 e 108 do CSV fecham como DIFERENTE decidido.
2. **A cura do travamento do USB entra na coluna Atenção** (ONDA5-01-01
   fica); o selo é `CONTROLE`, revisto por ela na publicação.
3. **A contagem do topo fica `2 USB · 0 BT`**; o que muda é a palavra de cada
   controle (S-10).
4. **Frases novas: o Opus escreve, ela revê tudo de uma vez no FECHO.**
5. **Gêneros são Estilo de Jogo, não perfil.** Somem da lista e da semeadura;
   os arquivos ficam. Os 24 perfis por jogo ficam **só com nome e id**.
6. **Prioridade: todas as abas, menos Lançadores.** A 07 é a última da C.
7. **Steam dividido:** Steam Input e allowlist na 07; Consertar, Restaurar de
   fábrica e Aplicar aos jogos na 09.
8. **"Mesa" é PALAVRA banida na tela, não feature.** A tabela e a conta de
   slots do perfil de bateria ENTRAM (SISTEMA-STEAM-01), com palavras simples;
   a palavra sai da tela inteira (A-PALAVRA-MESA-SAI-01).
9. **A aba 05 fica como está.**
10. **Controles externos: sprint escrita (EXTERNOS-01), fora das 24 horas.**
    O foco é **quatro DualSense, por cabo ou por rádio**; a bancada dos quatro
    é no FECHO, com ela (MESA-DE-QUATRO-01).
11. **Mic virtual pelo rádio entra** (MIC-VIRTUAL-02), com prova em dois
    controles antes de trocar os chamadores.
12. **Som por rádio: o ensaio, nas últimas horas, com ela** — dentro da
    MESA-DE-QUATRO-01.
13. **12 agentes na ONDA A.**
14. **Publicar: uma volta só, no FECHO.** **Instalar: o Opus, com a palavra
    dela, na árvore dela.**
15. **Branches: cherry-pick do que passa, lápide no resto.**
16. **A janela GTK sai, a leva inteira, nas 24 horas** — *"a ideia sempre foi
    reaproveitar o que fiz no gtk e não apontar nada mais pra lá mas pro
    html"*. <!-- noqa-acento: citação literal dela --> O motor (`app/actions/`,
    `app/widgets/`, `daemon/`) fica: é reuso. **Nada novo aponta para a janela.**

### 3.2 As de coordenação (razão medida; não reabrir)

1. **A única fila é a paridade.** Nenhuma sprint de 27/08 ou 29/08 é
   despachada pelo id: estão `absorvida` ou `caducou`, com a nota no topo. Se
   o que ela pedia ainda falta, é linha FALTA/DIFERENTE do CSV.
2. **S-10 (cabo/rádio) roda na ONDA A e sozinha nos seus sete arquivos.**
3. **O CSV da paridade e o `mockup/DIVERGENCIAS.md` são do coordenador.** A
   10-03 é tarefa dele na costura da A.
4. **O terceiro lugar do recado é destino do piloto** (`data-hef-recados`),
   P-01 §1.
5. **A quarta porta do ouvinte é `data-hef-vivo`**, P-01 §2.
6. **Texto de tela novo vai para a bancada e espera o olho dela UMA vez, no
   FECHO** — é a decisão 4 dela com a cadência das 24 horas.
7. **O Opus decide o resto sozinho** (delegação de 04/09); quando recusar
   todas as opções escritas numa sprint, a pergunta está errada.
8. **Quem fecha uma sprint muda o `estado:` dela no mesmo commit**, com a
   prova. O despachante recusa o que não está `aberta`.

---

## 4. AS ROTAS CORRIGIDAS

O que mudou nos frontmatters em 06/09: uma chave `depois_de` por sprint, os
nove ciclos desfeitos, `DIVERGENCIAS.md` fora da posse de 02-02 e 08-01, a
02-01 citando os 43 portões; **`estado:` em 338 arquivos**; a T-10 ganhou
frontmatter; a ONDA3-MOTOR-01 e a ONDA3-GESTO-DECLARA-01 ganharam rotas para
sprints vivas; a P-01 espera a A-TELA-SAMBA-01. O portão está verde
(`check_colisao_de_sprints.py`).

| sprint | posse-chave | espera (só o que ainda está aberto) | onda |
| --- | --- | --- | --- |
| **A-TELA-SAMBA-01** | hefesto_vivo · ponte_da_tela · abrir_interface | — | **Passo 1** |
| **ONDA4-S10-O-TRANSPORTE-01** | mesa_viva · pacotes/__init__ · a01 · a02 · a03 · a07 · a09 | — | A |
| ONDA5-P-01 | hefesto_vivo · ponte_da_tela | SAMBA | A |
| ONDA5-01-02 | home_actions · frases_que_ela_baniu | — | A |
| ONDA5-02-02 | aba02 · mockup/02 | — | A |
| ONDA5-05-01 | aba05 · mockup/05 | — | A |
| ONDA5-05-02 | a05 | — | A |
| ONDA5-06-01 | core/acoes_de_botao · profiles/manager · hotkey | — | A |
| ONDA5-07-02 | rodape · perfil | — (a linha de `a10_perfis` vai por relato) | A |
| ONDA5-08-01 | aba08 · a08 · mockup/08 · paginas/08 | — | A |
| ONDA5-09-01 | aba09 · mockup/09 | — | A |
| ONDA5-10-01 | simple_match · perfis_web · profiles_actions · a10 · aba10 | — | A |
| ONDA5-MIC-VIRTUAL-01 (passos 2–4) | fontes_de_captura · quem_ouve · canal_do_microfone | — | A |
| C1 (registro) | docs/data/decisoes-dela.csv | — | A |
| ONDA5-10-03 | paridade CSV | S-10 (o coordenador) | costura A |
| ONDA5-01-01 | a01 | S-10 | B |
| AS-DUAS-ABAS-FALAM-01 | a03 | S-10 | B |
| ONDA5-02-01 | ipc_handlers · audio_control · a02 | S-10 | B |
| ONDA5-05-03 | a05 · aba05 · mockup/05 | 05-01 · 05-02 · P-01 | B |
| ONDA5-06-02 | aba06 · a06 · paginas/06 | 06-01 | B |
| ONDA5-07-01 | steam_launch_options · sentinela · prontuario · desenho_dos_lancadores · a07 | S-10 | B |
| ONDA5-08-02 | mapa_da_mesa · aba08 | 08-01 | B |
| ONDA5-09-02 | a09 | S-10 | B |
| LUZES-01 *(nova, §5.4)* | a04 · aba04 · mockup/04 | — | B |
| **PERFIS-SAO-PERFIS-01** | profiles/loader · assets/profiles_default · assets/estilos_de_jogo | — | B |
| **ONDA3-MOTOR-01** | uinput_mouse · core/acoes_de_botao · profiles/manager | 06-01 | B |
| **GTK-1** *(nova, §5.4)* | scripts/ (o portão) · tests/ (a régua) | — | B |
| ONDA5-03-02 | a03 · aba03 | AS-DUAS | C |
| ONDA5-07-03 | home_actions · painel · a01 · jogar_vivo | 07-02 · 01-01 · 01-02 | C |
| ONDA5-10-02 | aba10 · a10 · mockup/10 · carona_do_wrapper · sentinela | 10-01 · 07-01 · P-01 | C |
| MIC-VIRTUAL-02 *(nova)* | dualsense_bt_audio · bt_mic · eleicao · audio_control | MIC-VIRTUAL-01 · 02-01 | C |
| **CONEXOES-LIGAR-TUDO-01** (T-10) | a08 · aba08 · ipc_handlers | 08-01 · 08-02 · 02-01 | C |
| STEAM-INPUT-01 *(nova)* | a07 · desenho_dos_lancadores · aba07 | 07-01 | C (a última) |
| SISTEMA-STEAM-01 *(nova)* | a09 · aba09 | 09-01 · 09-02 | C |
| CONTROLES-VERDADE-01 *(nova)* | a02 · aba02 · mockup/02 | 02-01 · 02-02 | C |
| NAVEGACAO-TECLAS-01 *(nova)* | a06 · aba06 | 06-02 · **ONDA3-MOTOR-01** | C |
| **GTK-2** *(nova)* | aba05 (`:273`) · src/hefesto_dualsense4unix/integrations/storm_doctor.py · scripts/i18n_extract.sh | 05-03 | C |
| PERFIL-MODO-01 *(nova)* | perfil.py · a10 · aba10 · perfis_web | 10-02 · 07-02 | D |
| PARIDADE-REMEDIR-01 *(nova, doc)* | paridade CSV | tudo de A–C costurado | D |
| **ONDA3-GESTO-DECLARA-01** | pacotes/__init__ · hefesto_vivo (`PERIGOSOS`) · test_todo_gesto_que_grava | S-10 · P-01 · SAMBA | D |
| **GTK-3** *(nova)* | gui/ (menos `ponte_da_tela.py`) · app/app.py · 62 testes · pyproject · packaging/ · install.sh · README | GTK-1 · GTK-2 · tudo de A–C | D–E |
| JOGAR-O-QUE-FALTA-01 *(nova)* + ONDA5-01-03 | a01 · aba01 · mockup/01 | 07-03 · PERFIL-MODO-01 | E |
| **A-PALAVRA-MESA-SAI-01** | os dez geradores `aba01.py`…`aba10.py` · pacotes/ · mockup/ · frases_que_ela_baniu | tudo que escreve texto de aba (o frontmatter lista) | E |
| O-LOGO-NAS-DEZ-01 | o logo compartilhado | — | costura E (o coordenador) |
| **MESA-DE-QUATRO-01** | docs/data/ensaios.csv · o relatório | SAMBA · S-10 · 01-01 · 02-01 · T-10 · MIC-VIRTUAL-01 · A-PALAVRA-MESA | FECHO, com ela |

---

## 5. AS ONDAS — por posse de arquivo, na ordem de desbloqueio

Cadência de cada onda: despacho → agentes em worktree própria → `costurar.sh`
para `onda/atual` → **43 portões** → próxima onda nasce de `onda/atual`
(`HEFESTO_BASE=onda/atual-0609`). **A suíte em doze lotes é uma vez, no
FECHO**, e mais uma depois da C (02-01, T-10 e MIC-VIRTUAL-02 tocam o daemon).
Tempos de relógio de parede com 8 a 12 agentes em paralelo.

### Passo 0 — antes de qualquer despacho (30 min, o coordenador)

1. **O lançador está em `dev`** (`e0bb5b79`). Confira `git log -1 dev` e que o
   `.desktop` abre as dez abas na tela dela. **Nenhum outro commit direto em
   `dev` até o FECHO.**
2. **A árvore de integração:**
   `git worktree add ../hefesto-voo/_integra-0609 -b onda/atual-0609 dev`.
   Copie o `CLAUDE.md` para lá e para toda worktree de agente (`.gitignore:90`).
3. **A casa (§8):** `scripts/despachar-agente.sh --limpar` e as cinco branches
   — cherry-pick do que passa, lápide no resto [ela, 06/09].
4. **A lista viva:** `python3 scripts/check_colisao_de_sprints.py --abertas`.
   O despachante recusa o que não está `aberta`; não force.

### Passo 1 — h0 a h1,5 · 1 agente · A-TELA-SAMBA-01, sozinha

É P0 [ela, 06/09]. Os cinco passos estão na sprint: o instrumento de mutações
por tique, os três alvos que passam a comparar antes de escrever, o bloco que
não destrói botão em voo, o tique que se cronometra e não enfileira, e a
janela dela deixando log. **Mede antes de abrir a A:** a tabela de mutações
com a mesa parada dá ZERO no que não mudou; a dica da aba 03 fica aberta 5 s.
A P-01 nasce de `onda/atual` depois dela — são o mesmo arquivo.

### ONDA A — h1,5 a h5,5 · 12 agentes + C1 · nada aqui espera nada além do Passo 1

`S-10` · `P-01` · `01-02` · `02-02` · `05-01` · `05-02` · `06-01` · `07-02` ·
`08-01` · `09-01` · `10-01` · `MIC-VIRTUAL-01` (passos 2–4) · **C1**.

**C1 — o registro passa a dizer quem decidiu** (só
`docs/data/decisoes-dela.csv`): as 54 linhas `D-0*` nascidas de *"as 54
levantadas em…"* ganham `quem_decidiu` (`ela` | `delegacao`) e a `escolha`
verbatim dela de 05/09, copiada do cabeçalho da sprint que a executa;
`revoga=` aponta a decisão do PO de 04/09 que caducou. As 20 de 06/09 já estão
lá (`D-0609-*`); a `D-03G-BOTAO-REENVIO` já diz "sai".

**Costura da A** (1 h): `10-03` (duas linhas do CSV) e a linha 21 da S-10; a
linha de `a10_perfis.py` que a 07-02 relata; `DIVERGENCIAS.md` com as seções
de 02, 05, 08 e 09. Portões. **Mede antes de abrir a B:** colisão verde,
`hefesto_vivo.py --oculta --prova-de-mockup` sem regressão no número PRODUTO
(188 em 02/09), e a tabela de mutações do Passo 1 ainda em zero.

### ONDA B — h5,5 a h10 · 12 agentes · nasce de `onda/atual`

`01-01` · `AS-DUAS-ABAS-FALAM-01` · `02-01` · `05-03` · `06-02` · `07-01` ·
`08-02` · `09-02` · **LUZES-01** · **PERFIS-SAO-PERFIS-01** ·
**ONDA3-MOTOR-01** · **GTK-1**.

Atenção do coordenador: a 02-01 mexe em `ipc_handlers.py` (6.521 linhas, o
gargalo do daemon); a 06-02 deixa vermelha
`test_a_aba_06_navegacao_fecha_as_linhas.py:221` até reescrevê-la (está
certo); a 05-03 só fecha o Passo 4 com a P-01 no lugar; a PERFIS-SAO-PERFIS-01
roda a migração one-shot **no lar de mentira da suíte**, nunca no `~/.config`
dela — quem a prova de verdade é o FECHO, depois do `install.sh`.

### ONDA C — h10 a h15 · 10 agentes

`03-02` · `07-03` · `10-02` · `MIC-VIRTUAL-02` · `T-10` · **STEAM-INPUT-01**
(a última a ser despachada [ela, 06/09]) · **SISTEMA-STEAM-01** ·
**CONTROLES-VERDADE-01** · **NAVEGACAO-TECLAS-01** · **GTK-2**.

A MIC-VIRTUAL-02 prova em **dois controles** antes de trocar os chamadores
[ela, 06/09]. Depois da costura da C: **doze lotes**.

### ONDA D — h15 a h19 · 3 agentes + coordenador

**PERFIL-MODO-01** · **PARIDADE-REMEDIR-01** (serial, é o CSV; o coordenador)
· **ONDA3-GESTO-DECLARA-01** · **GTK-3** (começa: os 62 testes, um a um) · o
que a C devolver vermelho.

### ONDA E — h19 a h21 · 3 agentes

**JOGAR-O-QUE-FALTA-01** (com a `01-03` dobrada nela) ·
**A-PALAVRA-MESA-SAI-01** (a última de tela, de propósito: toca os dez
geradores) · **GTK-3** (termina: a remoção, `pyproject`, `packaging/`,
`install.sh`, README). Na costura, o coordenador faz a O-LOGO-NAS-DEZ-01 (uma
edição no logo compartilhado) e regera as dez páginas junto com a da palavra.

### FECHO — h21 a h24 (o coordenador, e ela)

1. merge de `onda/atual-0609` em `dev`, **de uma vez** (regra dela de 25/08);
2. `git add -A && bash scripts/portoes.sh` (os 43) e os doze lotes;
3. `check_paridade_gtk_html.py --tabela`, `check_donos_de_comportamento.py`,
   `check_o_desenho_aprovado.py`, `check_colisao_de_sprints.py --abertas` — os
   números no handoff;
4. as dez fotos `--oculta` das abas, e a `PROVA-DE-TELA-01` de cada sprint
   conferida no relatório (foto, clique, mordida);
5. **ela publica, numa volta só** [ela, 06/09]: `check_o_desenho_aprovado.py
   --publicar NN` para as abas que a bancada adiantou, olhando as fotos e as
   frases novas de uma vez;
6. **o Opus instala, com a palavra dela** [ela, 06/09]: `./install.sh --yes`
   na árvore dela, e só nela; o `doctor` sem FALHA; o `.desktop` abre as dez;
7. **MESA-DE-QUATRO-01** — a hora dela com os quatro controles, com o ensaio 1
   do som por rádio dentro; cada REPROVA vira sprint;
8. o `ONDE-PARAMOS` do dia: os números da etapa 3, o que a bancada disse, e
   as sprints novas que nasceram dela.

### 5.4 As sprints NOVAS — o coordenador escreve o arquivo antes de despachar

Cada uma nasce no molde das de 05/09 (decisão verbatim · o que se mediu · passos
com MORDIDA · réguas · NADA SE PERDEU · PROVA DE TELA), com frontmatter completo
e `estado: aberta`, e passa no portão de colisão. O escopo, o dono GTK a reusar
e o que **não** entra:

| sprint | escopo (linhas FALTA do CSV) | reusa do GTK | não entra |
| --- | --- | --- | --- |
| **LUZES-01** (aba 04) | cor livre (paleta); marca da cor escolhida; as 5 luzes de jogador — marcar, presets P1..P4, todas acesas/apagadas, "Aplicar o desenho"; checkbox `auto_player_colors`; "Voltar todos ao automático"; a regra D4 com aviso | `app/actions/lightbar_actions.py` | prévia "honesta" como texto (a máscara não custa feature: ou aplica, ou cala) |
| **STEAM-INPUT-01** (aba 07) | conferir e desligar o Steam Input; "Este jogo não funciona" (allowlist); "Deixar tudo pronto" com UM consentimento; lembrete do jogo que não abre pelo launcher | `app/actions/emulation_actions.py`, `daemon_actions.py`, `launch_wrapper_dialog.py` | nada do que a 07-01 já cobre; **é a última da C** [ela, 06/09] |
| **SISTEMA-STEAM-01** (aba 09) | "Consertar problemas conhecidos"/"Refazer"; "Aplicar aos jogos da Steam"; "Restaurar de fábrica"; "Corrigir modo de execução"; "Tirar a sobreposição Vulkan"; **o perfil de bateria — a tabela e a conta de slots — com palavras simples** [ela, 06/09: *"o termo sai… feature fica"*] | `daemon_actions.py`, `footer_actions.py`, `emulation_actions.py`, `status_actions.py` (a bateria) | a palavra "mesa" em qualquer rótulo |
| **CONTROLES-VERDADE-01** (aba 02) | "o que chega ao jogo"; título do card com a palavra do transporte (S-10) e o jogador; badge de degradação do vpad; giroscópio "fluindo (~N Hz)"; rótulo das quatro situações da barra de luz | `app/widgets/controller_card.py` | Liberar/Devolver (02-Q6: fora, com aviso) · medidor de onda |
| **NAVEGACAO-TECLAS-01** (aba 06) | a TELA de editar QUAL tecla cada botão digita; "Voltar ao padrão" não apaga o que ela escreveu na janela antiga | `app/actions/input_actions.py` | o motor — é a **ONDA3-MOTOR-01** (o `— Nada —` que não cala seis linhas e o `resolver()` que não herda `key_bindings`), que vem antes |
| **PERFIL-MODO-01** (aba 10) | a seção `mode` do perfil (os quatro rótulos de `_MODE_KIND_ITEMS`) sem as duas frases (10-03); "Ativar" reflete nas outras abas na hora; a lista suspensa dos jogos DESTA máquina | `profiles_actions.py`, `perfis_web.py`, `jogos_locais.py` | editor avançado (10-Q2) · "Salvar este perfil" (D1) · **Estilo de Jogo como perfil** (é motor a construir, depois) |
| **JOGAR-O-QUE-FALTA-01** (aba 01) | o modo/máscara clicados entram na seção `mode` do perfil ativo; a linha "Ponte com o jogo"; o marcador "primário"; o que a aba faz com o daemon DESLIGADO; banner de degradação do vpad | `home_actions.py`, `app/actions/jogar/painel.py` | custo da máscara antes do clique (10-Q6) · **controles externos** (EXTERNOS-01, depois) |
| **MIC-VIRTUAL-02** | o rádio alimenta o nó `hefesto_mic_<hex6>`; os quatro chamadores de `escolher_fonte` passam pela regra 0; **as PEÇAS B e C da CANAL-POR-CONTROLE-01** (a eleição só decide a fonte padrão do sistema; a tela conta quatro) e o `0x32` seguindo SUSPENDED/RUNNING da source; **prova em dois controles antes de trocar os chamadores** | o corte está em `ONDA5-MIC-VIRTUAL-01` §3 e o contrato em `2026-09-03-CANAL-POR-CONTROLE-01` | o mudo do firmware (`common[9]`) · drop-in · WirePlumber · som por rádio |
| **PARIDADE-REMEDIR-01** (só CSV) | reler as linhas FALTA que 05/09 e D1/D2/D3 envelheceram, as que A–C fecharam, e as duas do `↻` (106 e 108: DIFERENTE, decidido por ela) | `check_paridade_gtk_html.py` (IGUAL só com sinal PRESENTE e endereço) | nenhuma linha vira IGUAL sem endereço lido no código |
| **GTK-1** (a janela sai, 1 de 3) | o inventário do que ainda aponta para a janela GTK (`gui/`, `main.glade`, `app/app.py`, os 62 testes, `pyproject` entry points, `install.sh`, README) e **o portão *"nada novo aponta para a janela"*** — reprova import novo de `gui/` fora da lista, e a lista só diminui | o plano D-19 (`2026-09-05-A-JANELA-GTK-SE-APOSENTA-DEPOIS-01`) | remover qualquer coisa |
| **GTK-2** (2 de 3) | os leitores do `main.glade` ganham dono no motor: `interface/aba05.py:273`, `src/hefesto_dualsense4unix/integrations/storm_doctor.py:69`, `scripts/i18n_extract.sh` | o que cada um lê hoje do XML, medido antes | a aba 05 além da linha 273 (é da 05-03, que vem antes) |
| **GTK-3** (3 de 3) | os 62 testes um a um (apaga o que testa widget; reaponta o que testa motor); a remoção de `gui/` **menos `gui/ponte_da_tela.py`** (é do piloto HTML), do `main.glade`, de `app/app.py` e `app/main.py`; `pyproject.toml`, `packaging/`, `install.sh` (o `.desktop` e o entry point), README | — | o motor (`app/actions/`, `app/widgets/`); rodar o `install.sh` (é do FECHO, com a palavra dela) |

---

## 6. O QUE É DELA — só atos, no FECHO

Ela respondeu tudo em 06/09 (§3.1). Não há pergunta pendente; o Opus não a
interrompe antes do FECHO. Os quatro atos:

1. **Publicar, numa volta só:** as abas que a bancada adiantou, olhando as dez
   fotos e as frases novas de uma vez.
2. **Dar a palavra para o `install.sh`:** o Opus roda `./install.sh --yes` na
   árvore dela, e só com essa palavra.
3. **A bancada dos quatro** (MESA-DE-QUATRO-01, 40 min), com o ensaio 1 do som
   por rádio dentro.
4. **Abrir pelo `.desktop` e jogar.** É a prova final, e ninguém a substitui.

---

## 7. O QUE SE MEDE — antes de abrir a próxima onda, e no fim

| régua | hoje | meta das 24 h |
| --- | --- | --- |
| `bash scripts/portoes.sh` (43) | verde | verde em toda costura |
| doze lotes (`tests/unit`, 1.167 arquivos) | 17.974 verdes | verdes depois da C e no FECHO |
| mutações de DOM por tique, mesa parada (SAMBA, Passo 1) | dezenas por segundo | **zero** no que não mudou; a dica fica aberta 5 s |
| `check_paridade_gtk_html.py --tabela` | 89 FALTA · 30 % | **FALTA ≤ 60**, e o terceiro número sobe — a régua diz quanto |
| `check_donos_de_comportamento.py` | teto 2.397 | **não sobe** sem linha nova no CSV dos donos |
| `check_colisao_de_sprints.py` / `--abertas` | verde · 59 abertas | verde a cada sprint nova; no FECHO só sobram abertas as do `SPRINT_ORDER.md` §2 |
| a palavra "mesa" visível nos dez mockups | 179 | **0**, e a régua da palavra inteira reprova a volta |
| o portão da GTK-1 (*nada novo aponta para a janela*) | não existe | verde, com a lista só diminuindo até `gui/` sair |
| `hefesto_vivo.py --oculta --prova-de-mockup` | 188 PRODUTO (02/09) | não regride; sobe com 02-02, 05-03, 06-02, 08-01 |
| `check_paridade_transporte.py` | 47 mudas | as células do mic pelo rádio saem do travessão (MIC-VIRTUAL-02) |
| `install.sh` na árvore dela | rc=0 (05/09) | rc=0, `doctor` sem FALHA, o `.desktop` abre as dez abas — sem `gui/` |
| o disco dela, depois do `install.sh` | 33 perfis | `personalizado` + 24 de jogo com nome e id; os gêneros em `profiles/estilos-de-jogo/` |

**A regra que decide qualquer vermelho:** quando o instrumento e o aparelho
discordam, o aparelho ganha — arranque a cura e olhe de novo.

---

## 8. A CASA — o que se apaga, o que se examina

Medido com `git cherry dev <branch>` e conferindo se os arquivos que cada
commit CRIOU existem no `dev`:

* **Já estão no `dev` (apagar a branch é seguro):** `worktree-wf_2f0bd56a-8c9-{1,2,3,4}`,
  `worktree-wf_47e9d83d-862-{1,2}`, `worktree-wf_cd148479-67e-2`,
  `worktree-wf_401cc629-632-{6,13}`, `worktree-wf_40c88140-1ee-{3,4,7,8}`,
  `worktree-wf_51f2071e-3a7-{3,14}`, `worktree-wf_bfc27e0e-e60-7`,
  `worktree-wf_af2f3641-19f-{1,2,3,4,5}`. O `git cherry` marca metade com `+`
  porque a costura foi por `cherry-pick` com conflito resolvido; o conteúdo
  está lá.
* **Examinar (5) — cherry-pick do que passa, lápide no resto [ela, 06/09]:**
  `voo/A-CASA-ARRUMADA-01-RAIZ` (um relatório de 25/08 e dez linhas de
  `.gitattributes`/`.gitignore`); `worktree-wf_3a532bd9-e75-{1,7}` (dois testes
  da aba 06: `test_a_06_a_escolha_dela_sobrevive_ao_tique.py` e
  `test_a_06_a_funcao_do_teclado_tem_tres.py`); `worktree-wf_47e9d83d-862-4`
  (`test_perfil_padrao_personalizado_0{1,2}.py` — **os dois já estão no
  `dev`**; conferir o diff e apagar); `worktree-wf_a789ed37-3d3-conf` (a
  conferência das três levas de fonte externa); `worktree-wf_cd148479-67e-3`
  (um ensaio das duas barras de velocidade no WebKit). Se o teste passa contra
  `onda/atual`, `cherry-pick`; se mede o mundo de ontem, uma lápide de uma
  linha no `ONDE-PARAMOS` e apaga.
* **As 294 árvores `worktree-wf_*`:** `scripts/despachar-agente.sh --limpar`.
* **As 23 em `hefesto-voo/`:** todas `ahead=0`; as `ONDA0-*`/`ONDA1-*`/`ONDA2-*`
  podem sair. `_integra-*` e `_juiz*` ficam até o FECHO.
* **Nunca** `checkout`, `switch`, `stash` puro, `reset` ou `clean` na árvore
  dela. A integração é em `hefesto-voo/_integra-0609`.

---

## 9. AS REGRAS DE DESPACHO — só o que mudou ou custou

As regras inteiras estão em `COMO-COORDENAR-UMA-LEVA.md` e
`COMO-REGER-AGENTES.md`. O delta destas 24 h:

1. **Toda worktree confere `git log -1 onda/atual-0609` e adianta a própria
   branch antes de escrever.**
   `HEFESTO_BASE=onda/atual-0609 scripts/despachar-agente.sh <sprint> <agente>`.
2. **Copie o `CLAUDE.md` para a árvore do agente antes de mandar lê-lo.**
3. **Um agente, uma posse; arquivo alheio é RELATO.** O relatório vai para
   `docs/process/agentes/2026-09-06/`, pelo sanitizador
   (`scripts/sanitizar_saida_de_agente.py`).
4. **Prova de tela obrigatória e `--oculta` sempre.** Foto antes/depois, o
   clique, a mordida colada. E agora **no tempo**: a régua de mutações do
   Passo 1 é parte da prova de toda sprint de tela.
5. **Saída de comando vai para arquivo**, nunca crua no terminal dela; matar
   processo só por PID conferido; nada de MAC real nem serial em arquivo
   versionado; a senha `sudo` não entra em prompt de agente.
6. **`install.sh` NUNCA por agente; pelo Opus só no FECHO, com a palavra dela,
   na árvore dela.**
7. **Substituição em massa sobre régua é edição cega** — cada teste que muda
   de pergunta é lido.
8. **Texto de tela vem do glossário.** Palavra que não está em
   `A-LINGUA-DESTA-CASA` entra lá antes de entrar na tela; "mesa" não entra.
9. **Quem fecha uma sprint muda o `estado:` dela no mesmo commit.** O
   despachante recusa `feita`, `absorvida` e `caducou`.

---

## 10. O QUE NÃO ENTRA NAS 24 HORAS — e onde cada um espera

Tudo está no `SPRINT_ORDER.md` §2, com `estado: aberta` e a nota no topo:

* **Som pelo rádio além do ensaio 1.** O ensaio (4 min, a orelha dela) é no
  FECHO; o alto-falante virtual (O-ALTO-FALANTE-VIRTUAL-01, SOM-QUE-SAI-01)
  só depois de ele dar som. Por cabo o som está inteiro.
* **Controles externos** — EXTERNOS-01 está escrita e espera a bancada dos
  quatro [ela, 06/09].
* **Editor avançado de regra** (10-Q2), **"Mapear Entrada a Entrada"**, **o
  custo da máscara antes do clique** (10-Q6).
* **O Estilo de Jogo como motor** — os gêneros saem da lista de perfis agora
  (PERFIS-SAO-PERFIS-01); o motor que aplica gatilho + vibração + luz por
  estilo é sprint depois, com as receitas em `assets/estilos_de_jogo/`.
* **As dezoito antigas do co-op e do rádio** — a bancada dos quatro diz quais
  estão vivas; ninguém as despacha antes.
* **O resto dos 89 FALTA** que não é de jogar — fica na régua, que é onde fila
  mora.

---

## 11. O PROMPT PARA O OPUS

```
Você é o PO e orquestrador do Hefesto (DualSense4Unix) pelas próximas 24 horas.
A fila, as decisões já tomadas e as rotas estão em
docs/process/2026-09-06-AS-VINTE-E-QUATRO-HORAS-a-ordem-que-o-orquestrador-despacha-e-as-rotas-corrigidas.md
— leia inteiro antes de qualquer comando; depois docs/process/SPRINT_ORDER.md,
docs/A-LINGUA-DESTA-CASA-o-glossario-que-a-tela-e-o-codigo-falam.md,
COMO-COORDENAR-UMA-LEVA.md e o CLAUDE.md da árvore. A lista viva é
`python3 scripts/check_colisao_de_sprints.py --abertas`; o despachante recusa o
que não está `estado: aberta`, e quem fecha uma sprint muda o estado dela no
mesmo commit. Regras que não se negociam: a árvore dela fica em `dev`
(integração em ../hefesto-voo/_integra-0609, merge em dev só no FECHO); um
agente por worktree e por posse; toda worktree adianta a branch antes de
escrever; cherry-pick, nunca git apply cego; saída de comando para arquivo;
--oculta sempre; install.sh nunca por agente e só no FECHO com a palavra dela;
nada de MAC real nem serial em arquivo; a senha sudo não existe para você;
texto de tela vem do glossário e "mesa" não entra. Execute o Passo 0, o Passo 1
(A-TELA-SAMBA-01, sozinha, e meça as mutações antes de seguir), depois as ondas
A→E na ordem da §5, costurando com scripts/costurar.sh e rodando os 43 portões
a cada costura; escreva as sprints novas da §5.4 no molde de 05/09 antes de
despachá-las, com frontmatter e `estado: aberta`, e rode
check_colisao_de_sprints.py; decida sozinho pela §3 e registre no
docs/data/decisoes-dela.csv com quem_decidiu=delegacao; não a interrompa antes
do FECHO — lá ela publica numa volta, dá a palavra para o install, e senta na
bancada dos quatro (MESA-DE-QUATRO-01). No FECHO, o ONDE-PARAMOS com os
números da §7, as dez fotos, e as sprints que a bancada fez nascer.
```
