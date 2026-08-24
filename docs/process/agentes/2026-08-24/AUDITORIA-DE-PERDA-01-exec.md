# AUDITORIA-DE-PERDA-01 — execução das quatro entregas (E1-E4)

Agente executor, branch `voo/AUDITORIA-DE-PERDA-01-exec`, 24/08/2026. Sprint:
[2026-08-23-AUDITORIA-DE-PERDA-01](../../sprints/2026-08-23-AUDITORIA-DE-PERDA-01-tres-portoes-verdes-que-nao-medem-nada.md).

## O que mudou

**E1 — o portão da foto passa a olhar a foto**
(`tests/unit/test_a_bancada_da_foto_exercita_os_dois_graus.py`, reescrito).
As quatro asserções que mediam `_censo_de_mentira()`/`_dongles_de_mentira()`
soltas (fora de qualquer `_Host`) viraram duas que montam a aba
Configurações pelo `_Host` de PRODUÇÃO do retrato
(`retratar_abas.py::_montar_aba_configuracoes`, o mesmo caminho que `main()`
percorre) e leem a árvore Gtk de verdade: uma cobra os dois graus na coluna
"O que é" (`_SELO_LIDO` e `_AVISO_NAO_SABE`), a outra cobra que o nome do
adaptador chega à tela sem o prefixo Nintendo. O teste de endereço forjado
(`test_a_bancada_nao_usa_endereco_de_verdade`) ficou como estava — já testava
o dado certo.

**E2 — a tautologia vira comparação contra o widget**
(`tests/unit/test_a_coluna_do_que_e_nasce_lida.py:210-224`). A asserção
`ids.issubset({... for sel in achados[2:] for botao, _ in secao_mesa._TIPOS_DE_RADIO})`
relia `_TIPOS_DE_RADIO` (o módulo) nos dois lados — agora o lado direito lê
`sel._items`, o estado real que `SegmentedSelector.set_items()` gravou no
widget (mesmo padrão de acesso usado em `test_a4_nao_sei_e_resposta_valida.py`
e `test_triggers_actions.py`), comparado por igualdade (não mais subconjunto)
contra os ids do módulo.

**E3 — o portão de referências resolve o caminho antes do sufixo**
(`scripts/validar-referencias-docs.py`). A ordem foi invertida: a resolução
contra a pasta do documento citante roda primeiro; o índice de sufixos (mais
largo) só decide quando essa resolução falha, **e** só para três casos que
não afirmam posição: alvo com barra (caminho encurtado tipo `gui/main.glade`,
ou root-relative citado de outra pasta), alvo vindo de CRASE (nome solto
`.py`/`.sh`, convenção da casa) ou alvo que é nome de algo que mora na RAIZ
do repositório (`install.sh` não tem diretório para encurtar). Para isso:
`candidatos_da_linha` passou a devolver `(texto, veio_de_crase)`, e nasceu
`nomes_de_raiz(raiz)`. Preço medido (ver abaixo): **um** achado novo real na
árvore, corrigido no mesmo commit
(`docs/process/sprints/2026-08-24-O-QUE-FICOU-FORA-01-...md:666`, o link para
`SPRINT_ORDER` sem diretório ganhou o `../` que faltava).
Quatro testes novos em `tests/unit/test_validar_referencias_docs.py` fixam o
comportamento pretendido (mordida, contraprova, e as duas isenções).

**E4 — as três linhas do portão `A-CASA-SABE` já estavam aplicadas.**
Ao chegar, `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py` já tinha as
três entradas do §3 da sprint (`costurar_a_mesa`, `filhos_de`,
`hub_em_comum`) — outro agente da mesma leva chegou primeiro. O portão
continuava VERMELHO por dois símbolos NOVOS, não citados na sprint:
`app/ipc_bridge.py::machine_declare` e `utils/maquina.py::gravar_maquina`.
Medido: os dois são embrulhos estreitos (`(ok, motivo)` / `bool`) que a
CONFIG-06 (23/08) superou com uma variante rica
(`machine_declare_detalhado`, `gravar_maquina_com_descartes`) — o único
chamador de produção de cada família (`footer_actions.py:323` e
`daemon/ipc_handlers.py:4874-4889`) já usa só a variante rica, e o comentário
em `ipc_handlers.py:4885-4886` documenta a escolha. Mesma forma da entrada
já existente `led_control.py::apply_led_settings` (lápide com nota datada,
poda é dela): classifiquei os dois em `_NAO_E_PROMESSA` com a evidência
citada.

## Qual mordida prova

Todas as quatro entregas foram mordidas: cura arrancada → reprova → cura
devolvida → passa. Saídas completas no transcrito; resumo:

- **E1**: apagar `self._censo_leitor = _censo_de_mentira` em
  `retratar_abas.py` → `test_a_foto_da_mesa_mostra_os_dois_graus_pelo_host_de_producao`
  reprova (nenhuma linha com `(lido)`, todas caem em `▲ O Hefesto não sabe`).
  Apagar `self._dongles_leitor = _dongles_de_mentira` →
  `test_a_foto_da_mesa_mostra_o_nome_do_adaptador_e_esconde_o_prefixo` reprova
  (nem "Sala" nem "Extra" aparecem). Restaurado: `3 passed in 0.44s`.
- **E2**: trocar `seletor.set_items([(ident, _(nome)) for ...])` por
  `seletor.set_items([])` em `secao_mesa.py::_seletor_do_tipo` (linha 1103) →
  `AssertionError: o seletor 'O que é' oferece [] e devia oferecer
  exatamente ['caixa_de_som', 'mouse', 'nao_sei', ...]`. Restaurado:
  `10 passed in 0.37s`.
- **E3**: com a cura arrancada (`leniente = True` sempre, equivalente ao
  `referencia in sufixos` antigo antes de qualquer resolução) →
  `test_link_com_basename_certo_e_pasta_errada_reprova` falha com
  `returncode=0` (o defeito plantado passa calado). Restaurado:
  `37 passed, 1 failed` (o failed é o achado pré-existente do CLAUDE.md, ver
  "O que NÃO verifiquei").
- **E4**: apagar a entrada `app/ipc_bridge.py::machine_declare` de
  `_NAO_E_PROMESSA` → `test_toda_promessa_solta_esta_classificada` reprova
  citando exatamente esse símbolo. Restaurado: `31 passed in ~43s`.

Também rodei os quatro em conjunto mais os arquivos vizinhos que tocam os
mesmos módulos (`test_a_mesa_guarda_o_que_ela_declarou.py`,
`test_segmented_selector.py`, `test_p10_a_foto_nao_publica_o_glade_cru.py`,
`test_a_foto_monta_como_o_produto_monta.py`, `test_a_frase_refutada_da_allowlist.py`,
`test_validar_citacoes_de_linha.py`, `test_lingua_do_produto_01_o_convite_a_traduzir.py`,
`test_check_paridade_transporte.py`): `216 passed, 2 failed` — os dois falhos
são os dois achados pré-existentes descritos abaixo, confirmados por
`git stash` como já vermelhos ANTES de qualquer mudança minha.

Portões: `ruff check src/ tests/ scripts/` → `All checks passed!`;
`validar-acentuacao.py --all` → `exit 0`; `validar-glifos.py --all` →
`exit 0`; `mypy src/hefesto_dualsense4unix` → `Success: no issues found in
208 source files` (não toquei `src/`, confirmação de que nada regrediu).

## O que NÃO verifiquei

- **Não fiz o inventário completo de quantos links no corpus inteiro
  dependem da leniência antiga** para casos fora dos três exemptados (barra,
  crase, raiz). Contei por DIFERENÇA (`comm` entre a saída `--all` antes e
  depois da E3): exatamente **um** achado novo real. Não tentei enumerar
  todo padrão de link markdown-bare-sem-barra do repositório para prever
  outros casos que ainda não foram escritos.
- **Dois achados pré-existentes, medidos como já vermelhos ANTES de eu tocar
  em qualquer arquivo** (confirmado por `git stash` + rerun), fora do escopo
  E1-E4, ficam registrados aqui para quem for atrás:
  1. `test_validar_referencias_docs.py::test_a_arvore_real_esta_limpa` — 4
     achados citando um `CLAUDE.md` da raiz do repositório, três subidas de
     diretório acima, a partir de
     `docs/process/sprints/2026-08-24-ONDA0-Z6-COMUNHAO-COM-O-SPECS-01-...md`
     (linhas 347, 581, 694) e
     `docs/process/sprints/2026-08-24-PAREAMENTO-01-...md` (linha 660).
     `CLAUDE.md` está em `.gitignore` (nunca foi rastreado —
     `git log --all -- CLAUDE.md` vazio) e por isso não existe em NENHUM
     worktree criado por `git worktree add` nem em clone fresco — só na
     árvore de trabalho de quem já tem o arquivo local. O `ci.yml:142` roda
     este portão com `python3` puro, sem o arquivo local: **isto quebraria o
     CI hoje**, se ele rodar sobre estes dois documentos. NÃO é regressão
     minha (confirmado com a cura E3 revertida: o mesmo vermelho aparece) e
     NÃO é do escopo E1-E4 — não editei os dois documentos porque a decisão
     de como tratar uma referência a um arquivo deliberadamente não
     versionado não é minha para tomar sozinho.
  2. `test_validar_citacoes_de_linha.py::test_a_arvore_de_verdade_esta_limpa`
     — `docs/protocol/ipc-unix-socket.md:87-88` cita
     `daemon/ipc_handlers.py:4911` e `:4923` para `_handle_plugin_list` /
     `_handle_plugin_reload`, e as linhas hoje não contêm mais esses nomes
     (deriva de linha). Também confirmado pré-existente por `git stash`.
     Fora do escopo E1-E4 (não toquei `ipc_handlers.py` nem esse documento).
- Não rodei a suíte inteira (`pytest -q` sem escopo) nem
  `check_packaging_parity.sh` / `check_test_data.sh` / `check_anonymity.sh` /
  `check_version_consistency.py` — nada que toquei mexe em empacotamento,
  dado de teste, anonimato ou versão, e a suíte inteira cria nós `uinput`
  reais (proibido para agente, ver `COMO-EXECUTAR-UMA-SPRINT.md` §5).

## O que sobrou para o próximo

- **DÍVIDA TÉCNICA COMUM** (não é "DELA"): os dois achados pré-existentes do
  item acima. O da `CLAUDE.md` é potencialmente mais urgente — se o CI real
  já roda sobre os dois sprints de hoje, o portão `validar-referencias-docs`
  pode estar vermelho em `dev` agora mesmo por um motivo que ninguém plantou
  de propósito. Quem pegar isto tem duas rotas honestas: isentar as três
  linhas com o marcador `<!-- ref-externa -->` (a ausência do arquivo
  versionado é o assunto, não um erro) ou parar de referenciar `CLAUDE.md`
  por caminho relativo nesses dois documentos.
- O achado de `ipc-unix-socket.md` é conserto de uma linha cada
  (`daemon/ipc_handlers.py:4911`/`:4923` → onde `_handle_plugin_list` e
  `_handle_plugin_reload` estão hoje) — não investiguei o número certo
  porque está fora do território desta sprint.
- **Nada da minha posse ficou pendente.** E1-E4 estão feitas, mordidas e
  verdes.
