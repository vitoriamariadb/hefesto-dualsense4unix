# ONDA0-Z2-EXEC — relatório final

**Execução única** de toda a frente Z2 (13 tarefas, coreografia de seis
agentes na sprint) por um agente só, em `/mnt/Apate/Desenvolvimento/hefesto-voo/ONDA0-Z2-exec`,
branch `voo/ONDA0-Z2-exec`. Commits: `cd41e4f`, `97ae33b`, `b277abe`,
`b036dca`, `067a71d`, `287d264`.

## O que mudou

### Z2-1/Z2-2 — Lightbar, Gatilhos, Rumble param ao dono (commit `cd41e4f`)

- `app/actions/lightbar_actions.py` — `_edit_uniq()` passa a devolver
  `AlvoDeEdicao` (era `str | None`). Choke points de escrita
  (`_persist_leds_update`, `_aplicar_cor_no_controle`, `on_lightbar_off`,
  `_enviar_player_leds`) recusam com `alvo.recusa()` quando `DESCONHECIDO`.
- `app/actions/triggers_actions.py` — L2 (`_refresh_triggers_from_draft`), L3
  (`_persist_params_to_draft`) migrados. **Achado não previsto pela sprint:**
  `_apply_trigger`/`_reset_trigger` liam `_edit_uniq` da Lightbar via
  `getattr(self, "_edit_uniq", ...)` — não estavam no censo L1..L7 (usam
  `getattr` no MÉTODO, não no atributo), mas quebrariam silenciosamente com
  a mudança de assinatura (receberiam `AlvoDeEdicao` onde o IPC espera
  `str | None`). Migrados para chamar `alvo_de_edicao(self)` direto.
- `app/actions/rumble_actions.py` — `_rumble_edit_uniq()` migrado, guarda em
  `_gravar_intensidade_no_rascunho`.
- `tests/unit/test_rumble_actions.py`, `test_triggers_actions.py` — fixtures
  `_FakeRumbleMixin`/`_FakeTriggersMixin` montavam hosts "virgens" (sem
  `_edit_target_uniq`) só por acidente do próprio defeito P3; corrigidas para
  gravar `None` (Todos) explicitamente em `__init__`, como a fixture da
  Lightbar já fazia. 5 + 17 = 22 testes que reprovariam sem a correção.
- `tests/unit/test_z2_abas_leitoras_recusam.py` (novo) — 8 testes.

### Z2-3/Z2-4 — rodapé e escritor do perfil (commit `97ae33b`)

- `app/textos_de_aplicacao.py` — `alvo_fora_da_mesa` lê `alvo_de_edicao(host)`
  e levanta `AlvoDesconhecidoNaMesaError` (nova) quando `DESCONHECIDO`, em vez
  de devolver `None` (o mesmo valor de "Todos") e deixar `frase_de_guardado`
  compor sucesso por engano. Zero chamadores de produção precisam capturar a
  exceção hoje — os quatro já recusam antes (Z2-1/Z2-2).
- `app/draft_config.py` — `registrar_alto_falante_no_rascunho` (L7) migrado;
  com `DESCONHECIDO` recusa em vez de cair no ramo GLOBAL.
- Três fixtures de teste (`_Janela` em dois arquivos, `_AbaStatus`) corrigidas
  pelo mesmo padrão do bloco anterior.
- `tests/unit/test_z2_rodape_para_de_mentir_guardado.py` (novo) — 6 testes.

### Z2-5 — Configurações migra, `set_alvo_inativo` exige motivo (commit `b277abe`)

- `app/actions/config/secao_controles.py` — L5 migrado.
  **ACHADO: a migração não morde.** `selecionado = bool(alvo) and alvo == uniq`
  já era imune ao P3 — `bool(None)` é `False` tanto para `TODOS` quanto para
  `DESCONHECIDO`, então nenhum card jamais foi marcado às cegas mesmo ANTES
  desta leva. Arranquei a migração e rodei o teste dedicado: **não
  reprovou**. A migração vale por higiene de fonte (compliance com a régua 1
  do portão), não por defeito medido nesta linha específica — registrado nos
  dois testes dedicados como nota, não como mordida.
- `app/actions/config/mixin.py` — `set_alvo_inativo(inativo, motivo="")`.
  `inativo=True` sem `motivo` levanta `ValueError` — **este sim morde**
  (mordida provada, ver abaixo). Motivo guardado em
  `self._alvo_inativo_motivo`, nunca pintado (decisão dela de 23/08 citada
  na docstring).
- `app/app.py` — único chamador (`_on_notebook_switch_page`) atualizado para
  passar `MOTIVO_ALVO_NAO_SE_APLICA`.
- `tests/unit/test_config_01_a_aba_nasce_vazia.py` — 3 chamadas existentes
  de `set_alvo_inativo(True)` atualizadas com o motivo; 2 testes novos.

### Z2-7/Z2-8 — ordem dos cards e fita por aba (commit `b036dca`)

- `app/actions/status_actions.py` — `_status_card_keys_for` percorre
  `_por_numero_de_identidade(conectados)` em vez da ordem de enumeração. M2
  (medido na sprint) reproduzido e curado: com os controles ligados fora de
  ordem, o primeiro card virou o mesmo controle do primeiro chip. Índice de
  cada controle preservado (vem do próprio registro, nunca da posição de
  iteração).
- `app/app.py` — mapa `_ALVO_POR_ABA: dict[str, str | None]` novo, cobrindo
  as onze abas (quatro leitoras: Status/Gatilhos/Lightbar/Rumble; sete
  inertes: Configurações por desenho + seis com motivo PROVISÓRIO
  `_MOTIVO_ALVO_AINDA_NAO_LIGADO`). `_on_notebook_switch_page` consulta o
  mapa; aba fora dele esmaece por segurança em runtime (a ausência na fonte
  é pega em build-time pelo portão Z2-6/9, não no usuário vendo a tela).
- `tests/unit/test_z2_ordem_dos_cards.py`, `test_z2_fita_declara_quem_obedece.py`
  (novos) — 3 + 14 testes.

### Z2-6/Z2-9/Z2-10/Z2-11 — o portão, os comentários caducos, os números (commit `067a71d`)

- `scripts/portao_alvo_tem_dono.py` (novo) — duas réguas: (1) reprova
  `_edit_target_uniq` em qualquer arquivo de `src/` fora do dono, inclusive
  comentário; (2) confere `HefestoApp._ALVO_POR_ABA` contra as onze abas
  conhecidas (quatro leitoras + sete inertes), reprovando nomeando a aba se
  faltar alguma ou se uma leitora estiver marcada inerte (ou vice-versa).
  Validado contra as duas respostas conhecidas (A5) antes de confiar nele.
- **Achado: a anotação de classe `_edit_target_uniq: str | None`
  (`status_actions.py:448`) NÃO precisava virar exceção do portão.** A Z2-0a
  (que fiz inline, não como rodada separada) confirmou por grep que nada em
  `src/` atribui a ela direto — só `getattr`, todos migrados. Era vestígio
  para o mypy dos sete leitores não migrados; removida junto com
  `_edit_target_label`, em vez de virar allowlist permanente.
- `integrations/sinal_da_barra.py`, `app/actions/status_actions.py` — os
  quatro comentários caducos do censo (Z2-10) reescritos citando
  `app/alvo_de_edicao.py`, não o campo velho.
- `app/alvo_de_edicao.py` — docstring reescrita: "nove pontos"/"nove
  leitores" → "sete, em seis arquivos" (com o comando `grep` ao lado);
  "migrá-los é de outra leva" ganhou nota datada (a leva foi esta); o
  contrato do §5 da sprint entrou na docstring do módulo.
- `docs/process/SPRINT_ORDER.md` — linha de F3 corrigida e marcada CURADA.
  **NÃO tocado**: as ~10 outras ocorrências de "nove leitores"/"nove pontos"
  em OUTROS documentos de sprint (Z3, Z5, PERFIS-ABRE, LIGHTBAR-COR-DE-CADA-UM,
  snapshots ONDE-PARAMOS) — são artefatos datados de OUTRAS levas descrevendo
  o que sabiam na hora; fora do escopo declarado de Z2-11
  (`app/alvo_de_edicao.py` + a linha de F3 do SPRINT_ORDER, nomeados
  explicitamente na tarefa). O grep do aceite `+7` não vai voltar
  totalmente vazio por causa deles — decisão de escopo, não descuido.
- `.github/workflows/ci.yml` — o portão entra como último passo do job
  `gtk-real` (o único que já monta venv com GTK real, necessário para
  importar `HefestoApp`). **NÃO VERIFICADO em CI de verdade** — testado só
  localmente com o mesmo venv (`.venv --system-site-packages` da árvore
  principal) e YAML validado por `yaml.safe_load`.
- `tests/unit/test_z2_o_numero_bate_com_a_contagem.py` (novo) — 3 testes,
  por AST sobre `src/` (não grep textual).
- **ACHADO FORA DO ESCOPO DECLARADO:** `CLAUDE.md` não existe nesta árvore —
  nem no `HEAD` do git (`git show HEAD:CLAUDE.md` falha). A instrução de
  Z2-6 de "acrescentar a linha do portão no CLAUDE.md" não pôde ser cumprida
  aqui. Não é um arquivo apagado por mim: nunca existiu nesta árvore
  despachada.
- `tests/unit/test_r17_r18_uniq_e_sucesso_honesto.py` — corrigido de quebra:
  comparava a string literal `"led_set((0, 0, 0), uniq=self._edit_uniq())"`
  contra a fonte; atualizado para `"uniq=estado_alvo.uniq"` (mesma garantia
  R-17, forma nova pós-Z2-1).

### Lint (commit `287d264`)

- `AlvoDesconhecidoNaMesa` → `AlvoDesconhecidoNaMesaError` (ruff N818),
  achado só ao rodar `ruff check src/ tests/` — o comando exato do CI, que
  `ruff check src/` sozinho não pega (regra da casa, confirmada na prática).

## A MORDIDA — cada cura, arrancada e vista reprovar

Todas as mordidas abaixo foram arrancadas com backup, rodadas até reprovar,
restauradas e revalidadas verdes. Saídas completas nas mensagens de commit
de cada leva; resumo aqui:

| Cura | Arquivo:linha | Reprova ao arrancar? |
|---|---|---|
| Guarda `_persist_leds_update` (Lightbar) | `lightbar_actions.py` | SIM — `test_lightbar_desconhecido_nao_escreve_no_rascunho` |
| Guarda `_aplicar_cor_no_controle` (Lightbar) | idem | SIM (via `NameError`, não assert limpo — ver nota abaixo) |
| Guarda `_gravar_intensidade_no_rascunho` (Rumble) | `rumble_actions.py` | SIM |
| Guarda `_persist_params_to_draft` (Gatilhos) | `triggers_actions.py` | SIM |
| Guarda `_apply_trigger` (Gatilhos, achado extra) | idem | SIM |
| Guarda `alvo_fora_da_mesa` (rodapé) | `textos_de_aplicacao.py` | SIM |
| Guarda `registrar_alto_falante_no_rascunho` (perfil) | `draft_config.py` | SIM |
| Migração de `secao_controles.py` (Configurações) | `secao_controles.py` | **NÃO** — ver achado Z2-5 acima |
| `set_alvo_inativo` exige motivo | `config/mixin.py` | SIM |
| `_status_card_keys_for` usa `_por_numero_de_identidade` | `status_actions.py` | SIM — reproduz M2 exato |
| Mapa `_ALVO_POR_ABA` generalizado | `app.py` | SIM — 8 falhas (6 abas + ida-e-volta + fallback) |
| Portão régua 1 (campo velho) | `portao_alvo_tem_dono.py` | SIM — nomeia arquivo:linha |
| Portão régua 2 (moldura) | idem | SIM — nomeia a aba |
| Docstring "sete pontos" | `alvo_de_edicao.py` | SIM |
| AST zero-leitores | idem | SIM — nomeia arquivo:linha |

**Nota sobre a guarda de `_aplicar_cor_no_controle`:** ao arrancar SÓ o bloco
`if estado_alvo.desconhecido: ...`, o resto da função ainda referenciava
`estado_alvo` mais abaixo — reprovou com `NameError`, não com a asserção
limpa do teste. Prova que o teste FALHA sem a cura (o que a mordida exige),
mas por um caminho menos didático que uma asserção de negócio. Registrado
como nuance, não escondido.

## Testes rodados e resultado

- Escopo por área (lightbar/rumble/trigger, config, status_actions/app.py,
  alvo_de_edicao): **~1500 testes verdes**, rodados repetidamente a cada
  leva — nenhum vermelho novo introduzido.
- `ruff check src/ tests/` (comando exato do CI): limpo.
- `mypy src/hefesto_dualsense4unix` (208 arquivos): limpo.
- `python3 scripts/validar-acentuacao.py --all`: limpo.
- `python3 scripts/validar-glifos.py --all`: limpo.
- `python3 scripts/validar-referencias-docs.py --all`: 4 referências mortas,
  todas pré-existentes (`CLAUDE.md` citado em documentos de OUTRAS sprints —
  Z6, PAREAMENTO — que esta leva nunca tocou).
- `bash scripts/check_anonymity.sh`: OK.
- `bash scripts/check_test_data.sh`: OK.
- `.venv/bin/python scripts/check_version_consistency.py`: OK (0.9.4.5).
- `bash scripts/check_packaging_parity.sh`: OK.
- `.venv/bin/python scripts/portao_alvo_tem_dono.py`: OK.
- `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py`: 1 vermelho
  **pré-existente e confirmado fora do meu escopo** — `machine_declare`/
  `gravar_maquina`, já documentado no relatório da Z5 como não tocado por
  aquela leva nem por esta.

**NÃO RODEI a suíte inteira (`pytest -q` sem alvo)** — proibido pelo
protocolo (cria nós `uinput` reais). Cobri o escopo relevante em ~10
chamadas direcionadas ao longo da execução, listadas nos commits.

## O que NÃO fez, e por quê

- **Z2-0a como rodada isolada** — fiz o levantamento (fio do tique, os onze
  comentários, a anotação de classe) inline, junto com Z2-10/11, em vez de
  como entrega separada — não havia outro agente esperando o relatório dela
  antes de prosseguir.
- **Z2-0b completo (as 28 provas, uma a uma)** — fiz uma versão agregada: os
  dois corpos (`set_mask`/`clear_mask`) arrancados JUNTOS, suíte rodada uma
  vez. Resultado: **18 de 28 reprovam, 9 passam + 1 xfail** (não exercitam o
  caminho de escrita bem-sucedida — testam recusa/herança, legítimo). Não
  fiz a matriz completa (cada teste × cada função isolada) por custo de
  tempo. O número **28** bate exatamente com a contagem da sprint (não 34) —
  confirma a correção que a própria ONDA0-Z5/Z2-11 já registrava.
- **Z2-12/Z2-13 (o escritor de produção da máscara por jogador) — NÃO
  IMPLEMENTADO, de propósito.** A sprint marca as duas como *"em suspenso"*
  até a D-K dela (ligar o escritor, ou caducar o mecanismo por escrito). Não
  é uma tarefa que falte tempo — é uma tarefa que **não é minha para
  decidir em silêncio** (regra da casa: "escolha em silêncio vira fato
  consumado que ela descobre na tela"). Identifiquei o ponto exato do
  gancho para quando ela decidir: `daemon/lifecycle.py:2746`
  (`_gravar_mascara_do_perfil`), logo depois do `if not flavor: return` —
  precisaria do `uniq` do controle-alvo do perfil, que a função hoje não
  recebe (só `flavor`). As três guardas da função (flag opt-in, `flavor`
  vazio = sem opinião, grava o EFEITO não o transporte) valem literalmente
  para o irmão por-jogador também.
- **Retratar as abas** (`scripts/gui-captura/retratar_abas.py`) — proibido
  no meu escopo (árvore isolada, quem fotografa é quem coordena, depois que
  a leva fecha).
- **Rodar a suíte inteira** — proibido (nós uinput reais).
- **As três telas estruturais (Z2-2, Z2-7, Z2-8) não foram mostradas a
  ela** — carimbo "espera o olho dela" (D3): a recusa aparecendo no toast, a
  nova ordem dos cards, a fita esmaecida em seis abas. Implementadas e
  testadas; o lote de fotos é do coordenador, não meu.
- **`CLAUDE.md`** — não existe nesta árvore, então a linha do portão não
  pôde ser acrescentada lá (Z2-6 pedia isso).

## O que a sprint não previu (o item que o teste de viés pede)

1. **`_apply_trigger`/`_reset_trigger` liam `_edit_uniq` da Lightbar por
   composição de mixin, fora do censo L1..L7.** O censo da sprint (`grep`
   por `getattr(self, "_edit_target_uniq", None)` textual) não pega
   `getattr(self, "_edit_uniq", lambda: None)()` — uma chamada indireta ao
   MÉTODO de outro mixin. Mudar a assinatura de `_edit_uniq()` sem notar
   isso teria quebrado silenciosamente o "Aplicar"/"Desligar" dos Gatilhos
   em produção (um `AlvoDeEdicao` sendo passado onde o IPC espera
   `str | None`). Achado ao rodar a suíte de regressão depois da mudança de
   assinatura, não por leitura prévia — reforça a lição já registrada desta
   casa ("o instrumento mente mais que o produto": aqui foi o CENSO
   textual que tinha um ponto cego, não o produto).
2. **Fixtures de teste "virgens" eram, elas mesmas, instâncias do defeito
   P3** — `_FakeRumbleMixin`, `_FakeTriggersMixin`, `_Janela` (dois
   arquivos), `_AbaStatus` nunca escreviam `_edit_target_uniq`, e só
   passavam porque o BUG fazia `None` (ausência) e `None` (Todos)
   responderem igual. Corrigir o produto sem corrigir as fixtures quebraria
   ~30 testes que mediam corretamente OUTRA coisa (o efeito de "Todos") —
   corrigidas todas, com nota explicando por quê, em vez de eu concluir
   "a sprint estava certa, o produto está quebrado" e sair reescrevendo o
   produto para acomodar um teste que media a coisa errada.
3. **Z2-5's mordida sobre `secao_controles.py` não morde** — a fórmula
   `bool(alvo) and alvo == uniq` já era imune ao P3 antes desta leva.
   Diferente de "a sprint errou": ela mediu certo que o CAMPO era lido por
   `getattr` cru (L5, censo §2.2), só não percebeu que o `bool()` já
   neutralizava o efeito prático do defeito NESSE ponto específico —
   diferente de todos os outros seis leitores, onde `None` virava ESCRITA
   GLOBAL diretamente. Registrado nos dois testes dedicados como nota,
   nunca apagado.
4. **`CLAUDE.md` não existe na árvore despachada.** Referenciado por
   múltiplas sprints (inclusive Z6, PAREAMENTO, que citam
   `../../../CLAUDE.md`) como se existisse universalmente; nesta árvore,
   não existe nem no commit `HEAD`. Pode ser uma lacuna deliberada do
   despachante (não copiar as instruções globais para a árvore do
   trabalhador) ou um esquecimento — não é meu papel decidir qual, só
   registrar que a tarefa que dependia dele (Z2-6) não pôde ser cumprida
   literalmente.
5. **A régua textual do §2.2 (`grep -rn "_edit_target_uniq"`) contava
   comentário como ocorrência, mas nunca me disse quais dos 23 eram
   comentário vs. código de forma automática** — teve de ser lido um a um
   (Z2-0a/Z2-10). Um instrumento que separasse os dois automaticamente
   teria economizado uma rodada de leitura manual; ofereço isso como nota
   para quem desenhar a próxima régua deste tipo (o AST scanner que escrevi
   em `test_z2_o_numero_bate_com_a_contagem.py` já faz essa distinção, e
   pode ser reaproveitado).
