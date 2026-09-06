---
sprint: PERFIS-O-PRECO-E-O-RADIO-01
estado: feita
onda: G
posse:
  PERFIS:
    - src/hefesto_dualsense4unix/interface/pacotes/a10_perfis.py
    - src/hefesto_dualsense4unix/interface/aba10.py
    - mockup/10-perfis.html
cria:
  - tests/unit/test_o_perfil_diz_o_preco_da_mascara_e_o_aviso_do_radio.py
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/profiles_actions.py
  - src/hefesto_dualsense4unix/app/actions/perfis_web.py
  - docs/data/
---

# PERFIS · O PREÇO E O RÁDIO — o preço da máscara no hover, e o aviso do rádio em linha

> **ESTADO 2026-09-06: feita** — as linhas 385 e 386 NÃO foram construídas:
> a decisão 10-Q6 dela (*"Essas frases devem sumir"*) as derrubou, e a régua
> nova prova a ausência das duas na página PUBLICADA, que é o degrau que a
> guarda da geração não cobria. A linha 370 era a dívida de verdade e fechou:
> os sete gestos que gravam o perfil inteiro passaram a montar a base com o
> que está VALENDO por cima do disco (`a10_perfis._com_o_que_esta_valendo`,
> lendo de `rodape._draft_do_ativo`) — medido, o renomear apagava a cor que
> ela acabou de clicar e o `profile.switch` a desfazia no controle.

> **ROTA — 06/09/2026, arrumação da leva (Fable, PO por delegação).** Esta sprint nasceu da
> definição de pronto dela — *"migrar tudo do gtk pro html … todas as features funcionando"* —
> medida contra o CSV da paridade: as linhas abaixo estavam `FALTA_NO_HTML` **sem nenhuma
> sprint aberta encarregada**. O enunciado de cada uma é a própria linha do CSV.

As duas frases têm decisão dela de 04/09 escrita na própria linha do CSV: **preço da máscara no hover, aviso do rádio em linha**. As duas são funções puras de `profiles_actions.py` (`:256` e `:162`, leitura) que a seção Modo da PERFIL-MODO-01 não trouxe. **E uma conferência que é de dado dela:** a linha "Salvar funde o rascunho" diz que *o que está VALENDO no aparelho e ainda não foi ao disco é perdido por um gesto desta aba que grave* (`editor_nome`) — meça se isso acontece hoje com a cor clicada na 04 e, se sim, é o item 13 dela de novo: cure no gesto, não no Salvar.

---

## 1. AS LINHAS DO CSV QUE ESTA SPRINT FECHA — o enunciado é a linha

### Linha 370 — O Salvar funde o que as outras abas editaram (o rascunho)

* **O dono na GTK (reuse, não reescreva):** `src/hefesto_dualsense4unix/app/actions/profiles_actions.py:4280 · src/hefesto_dualsense4unix/app/actions/profiles_actions.py:4188 · src/hefesto_dualsense4unix/app/actions/profiles_actions.py:4232`
* **O que ele faz:** `_build_profile_from_editor` usa o `draft` como base quando o perfil salvo é o do rascunho (`_edita_o_perfil_do_rascunho`), reinjeta `controllers` como INSTÂNCIAS validadas (senão o `model_dump` densifica e apaga a herança por campo), e `_reconciliar_rascunho_com_perfil_salvo` reaponta o rascunho para o arquivo recém-gravado.
* **Por que falta:** Na interface nova não há `self.draft` — a decisão dela de 01/09 é ação imediata, e a cor clicada já vai ao controle. Então a fusão não faz falta pelo mesmo motivo. O que ela NÃO cobre: o que está VALENDO no aparelho e ainda não foi ao disco (a cor clicada, por exemplo) é perdido por um gesto desta aba que grave — `editor_nome` grava `load_profile(era)` + nome novo, e a cor viva não entra. O rodapé cobre isso (`_draft_do_ativo(nome, ctx)` traz a cor viva por cima do disco); os gestos desta aba, não. || CONFERIDA em 06/09/2026 pela PARIDADE-REMEDIR-01 e MANTIDA. **Mas a metade que ela cobra encolheu**: o rodapé passou a trazer do estado vivo, além da cor da barra, a política de vibração, o `passthrough`, o teto e a velocidade do mouse (`src/hefesto_dualsense4unix/interface/pacotes/rodape.py:269`). O que continua sem sobreposição é `speaker`, `audio.mic_mudo` e `sensores` por controle — e e

### Linha 385 — O preço da máscara (o que o Xbox custa)

* **O dono na GTK (reuse, não reescreva):** `src/hefesto_dualsense4unix/app/actions/profiles_actions.py:256 · src/hefesto_dualsense4unix/app/actions/profiles_actions.py:1553 · src/hefesto_dualsense4unix/app/actions/profiles_actions.py:1530`
* **O que ele faz:** Uma etiqueta visível embaixo dos botões de máscara, com `texto_do_preco_da_mascara(flavor)`, mais o tooltip por opção (`texto_do_custo_da_mascara`) — pedido literal dela: *"ao deixar o mouse sobre a opção Xbox, ele falaria que o Xbox não tem tais features"*. Teto de 64 caracteres por linha, medido: sem ele a frase comia 370px da coluna "Perfis salvos".
* **Por que falta:** Consequência da ausência da seção Modo, mas é peça própria e com dona: a frase é reuso de uma função pura que já vivia na aba Início, e ela pediu esse texto por escrito. Quem for construir o Modo no HTML tem de trazê-la junto, não reescrevê-la. || DECIDIDO em 04/09/2026 — Preço no hover, aviso do rádio em linha — como ela pediu por escrito. Espera o quadro Modo existir, e ele é a maior ausência isolada do inventário. Onde está escrito: `docs/process/2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md` §2 `10[06]`, sobre a pergunta [06] de `docs/process/sprints/2026-09-04-DECISOES-DELA-10-perfis.md`. Não espera mais palavra dela. || DECISÃO DELA, 05/09/2026 (10-Q6): a frase NÃO entra na aba 10 — *"É pra tudo funcionar independente do modo, mascarou forma de conexão. Essas frases devem sumir."* Esta linha deixa de ser dívida de TEXTO e passa a ser dívida de MECANISMO: o Hefesto constrói o

### Linha 386 — O aviso de rádio frágil quando ela escolhe o Modo Nativo

* **O dono na GTK (reuse, não reescreva):** `src/hefesto_dualsense4unix/app/actions/profiles_actions.py:162 · src/hefesto_dualsense4unix/app/actions/profiles_actions.py:1634 · src/hefesto_dualsense4unix/app/actions/profiles_actions.py:1667`
* **O que ele faz:** Um rótulo em laranja dentro da seção Modo, sincronizado nos três caminhos (montagem, gesto dela e populate), alimentado por `frase_do_radio_fragil_no_modo(kind, state)` com o estado do daemon buscado por gesto.
* **Por que falta:** §P8. O Modo Nativo é o único que depende do rádio aguentar, e o aviso é o que separa "você escolheu" de "você escolheu e vai dar errado neste aparelho". Terceira consequência da seção Modo ausente — listada em separado porque tem função pura própria e régua própria, e some do inventário se ficar embutida na anterior. || DECIDIDO em 04/09/2026 — Preço no hover, aviso do rádio em linha — como ela pediu por escrito. Espera o quadro Modo existir, e ele é a maior ausência isolada do inventário. Onde está escrito: `docs/process/2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md` §2 `10[06]`, sobre a pergunta [06] de `docs/process/sprints/2026-09-04-DECISOES-DELA-10-perfis.md`. Não espera mais palavra dela. || DECISÃO DELA, 05/09/2026 (10-Q6): a frase NÃO entra na aba 10 — *"É pra tudo funcionar independente do modo, mascarou forma de conexão. Essas frases devem sumir."* Esta linha deixa de se

## 2. O QUE FICA FORA, E POR QUÊ

* **"Salvar este perfil"** — D1 dela: clicar já aplica e já grava; o botão não volta.
* **O editor avançado** e **o aviso do `process_name`** — 10-Q2, decisão dela; fora.
* **A caixinha "tirar este jogo do Steam Input"** — vive na aba 07 desde a `D-0609-STEAM-DIVIDIDO` (STEAM-INPUT-01, feita); a linha do CSV está mal-vereditada e a PARIDADE-CRUZA-O-MAPA-01 a corrige.


## AS REGRAS DESTA SPRINT — e são as da casa

1. **A linha do CSV é o enunciado.** `docs/data/paridade-gtk-html.csv` é o dono do fato;
   a coluna `gtk_onde` diz QUEM já faz isso no motor. **Você LÊ do dono e liga à tela** —
   reescrever a lógica em `interface/` é a segunda cópia, que é o defeito que onze réguas
   desta casa já tiveram. Se o dono precisar de um ajuste, ele é seu só se estiver na
   `posse:`; senão, RELATE.
2. **Texto de tela vem do glossário** (`docs/A-LINGUA-DESTA-CASA-…`): cabo/rádio, nunca
   usb/bt; "mesa" não entra; "serviço", não daemon. Frase nova é frase do DONO em `app/`
   (`app/textos_de_aplicacao.py`, `app/actions/*`) — o pacote a importa.
3. **Cada linha fecha com a MORDIDA da casa:** arranque a cura e a régua reprova. E com a
   PROVA DE TELA: foto `--oculta` antes e depois, e o clique de verdade pela ponte JS
   (`--prova-clique`/`--prova-gesto`), nunca o mouse dela.
4. **O CSV da paridade NÃO é sua posse.** Você entrega, no relatório, o texto pronto da
   linha (veredito · `sinal` que existe no CÓDIGO do lado HTML · `html_onde` · `html_faz`)
   — a PARIDADE-REMEDIR-02 recolhe no fim. O `sinal` tem de ser código, nunca prosa
   (`D-0609-O-SINAL-DA-PARIDADE-NAO-E-PROSA`).
5. **Se um passo esbarrar em decisão de produto**, decida como PO por delegação, registre
   em `docs/data/decisoes-dela.csv` com `quem_decidiu=delegacao` e REVERSÍVEL NUMA FRASE, e
   siga. Não pare.
6. A ordem de precedência (aparelho > mapa > sprint) está no preâmbulo do despachante.
