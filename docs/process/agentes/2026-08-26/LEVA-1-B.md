# LEVA-1-B — o sétimo applier: sair do Modo Nativo devolve a vibração ao jogo

**26/08/2026.** Frente B da LEVA 1. Nasce da BG-07b. O defeito sobreviveu a
duas levas por falta de dono, não de conserto.

## O que mudou

**Um arquivo de produto, um de teste.**

`src/hefesto_dualsense4unix/daemon/lifecycle.py::_reapply_last_profile` — a rota
que roda ao DESLIGAR o Modo Nativo — montava o `ProfileManager` **à mão**, com
SEIS dos sete appliers. Faltava o `rumble_passthrough_applier`, e *applier
ausente NÃO levanta: a seção é ignorada em silêncio*, com a ativação
respondendo sucesso.

O que ela sentia: em Modo Nativo, testa os motores pela aba Rumble (o "Aplicar"
FIXA a vibração em `config.rumble_active`) e desliga o Modo Nativo. Gatilhos,
LEDs, máscara do vpad, política de vibração, alto-falante e microfone voltam ao
que o perfil manda; **a vibração do jogo, não** — a fixação continua de pé e
`apply_game_rumble` ignora o FF do jogo, mesmo com o perfil pedindo
`rumble.passthrough=True`, que é o default de TODO perfil.

**A cura não foi acrescentar a sétima linha à lista à mão — foi apagar a lista
à mão.** A rota passou a vir de `gerente_do_daemon`, a fábrica que é a fonte
única dos sete appliers:

```python
manager = gerente_do_daemon(
    self,
    store=self.store,
    mode_applier=getattr(self, "_mode_applier_ao_sair_do_nativo", None),
)
```

**Por que a fábrica e não a sétima linha:** o portão da classe
(`test_toda_construcao_com_applier_tem_razao_escrita`) exige razão escrita em
`_A_MAO_COM_RAZAO` para toda construção direta que declare QUALQUER applier — e
a ordem manda apagar a entrada dessa rota. Manter a lista à mão com sete e
apagar a entrada deixaria o portão vermelho; as duas exigências só fecham pela
fábrica. É também o que a própria entrada da tabela prescrevia, com esta linha
de código escrita nela.

**O embrulho do `mode` FICA**, e é o único desvio nomeado que a fábrica aceita:
`set_native_mode(False)` já zerou `_native_mode`, então um `last_profile` com
`mode.kind=native` seria religado no mesmo instante — desfazendo o gesto dela.
O embrulho barra SÓ o `native`; `gamepad`/`desktop` passam.

**Notas datadas preservadas no comentário da rota**, porque são decisão medida e
não fato errado: PERFIL-REESCRITO-NA-PARTIDA-01 item 6 (05/08/2026, as três
seções que esta rota já perdeu uma vez) e PERFIL-GUARDA-O-MIC-01 (18/08/2026,
`origin="system"` devolve o volume do microfone e NÃO o mudo).

`tests/unit/test_a_fabrica_do_gerente_e_a_unica_lista_de_appliers.py`, **no mesmo
commit**, porque senão dois portões ficam vermelhos de propósito:

1. apagado o `@pytest.mark.xfail(strict=True)` de
   `test_sair_do_modo_nativo_devolve_a_vibracao_ao_jogo` — com a cura ele vira
   XPASS estrito e reprova;
2. apagada a entrada `('daemon.lifecycle', '_reapply_last_profile')` de
   `_A_MAO_COM_RAZAO` — a tabela é conferida contra a árvore por
   `test_a_tabela_nao_envelhece_calada`, e cobra a entrada que sobrou;
3. **a mordida do `test_a_tabela_nao_envelhece_calada` foi reescrita.** Ela
   dizia *"acrescentar `rumble_passthrough_applier` à entrada da
   `daemon.lifecycle::_reapply_last_profile`"* — uma mordida que aponta para
   entrada que não existe mais não morde nada. Agora aponta para
   `daemon.connection::restore_last_profile`, que continua na tabela;
4. o cabeçalho do arquivo dizia que a rota "passava SEIS", no presente. Ganhou
   a nota datada de que a dívida FECHOU em 26/08/2026 — o registro histórico
   fica, a afirmação no presente sai.

## Qual mordida prova

A régua já estava armada e verde-no-vermelho. **Estado antes da cura:**

```
$ python -m pytest tests/unit/test_a_fabrica_do_gerente_e_a_unica_lista_de_appliers.py::test_sair_do_modo_nativo_devolve_a_vibracao_ao_jogo -q
x                                                                        [100%]
1 xfailed in 0.42s
```

**Cura ARRANCADA** (a rota devolvida à lista à mão com os seis appliers, o teste
intocado) — **DOIS portões reprovam, e cada um por uma razão diferente**:

```
$ python -m pytest tests/unit/test_a_fabrica_do_gerente_e_a_unica_lista_de_appliers.py -q
...
E       AssertionError: a vibração continuou FIXADA depois de sair do Modo Nativo — o perfil
        pede `rumble.passthrough=True` e a seção foi ignorada em silêncio, porque a rota
        nasceu sem o `rumble_passthrough_applier`.
E       assert (128, 200) is None
...
FAILED tests/unit/test_a_fabrica_do_gerente_e_a_unica_lista_de_appliers.py::test_toda_construcao_com_applier_tem_razao_escrita
FAILED tests/unit/test_a_fabrica_do_gerente_e_a_unica_lista_de_appliers.py::test_sair_do_modo_nativo_devolve_a_vibracao_ao_jogo
2 failed, 14 passed in 5.26s
```

O segundo é a prova pelo EFEITO (o `rumble_active` continua `(128, 200)` depois
de sair do Modo Nativo). O primeiro é a prova pela FORMA, e nomeia a rota:

```
E       AssertionError: rota montando o `ProfileManager` à mão, SEM razão escrita:
E           - daemon.lifecycle::_reapply_last_profile (linha 1233): ['mic_applier',
            'mode_applier', 'mouse_applier', 'rumble_policy_applier', 'speaker_applier',
            'suppression_applier']
E         Applier ausente NÃO levanta: a seção é ignorada em silêncio.
```

**Cura DEVOLVIDA:**

```
$ python -m pytest tests/unit/test_a_fabrica_do_gerente_e_a_unica_lista_de_appliers.py -q
................                                                         [100%]
16 passed in 5.30s
```

**Colateral da rota, tudo verde** (99 testes — os oito arquivos que dirigem
`_reapply_last_profile` ou a seção `rumble.passthrough`):

```
$ python -m pytest tests/unit/test_profile_activate_origin.py \
    tests/unit/test_perfil_reescrito_na_partida_01.py tests/unit/test_native_mode.py \
    tests/unit/test_profile_rumble_policy.py \
    tests/unit/test_toda_secao_de_perfil_tem_quem_a_aplique.py \
    tests/unit/test_nativo_rumble_01_a_recusa_com_motivo.py \
    tests/unit/test_harm16_o_parar_que_desarmava_a_cura.py \
    tests/unit/test_a_mascara_persiste_ate_ela_mudar.py -q
99 passed in 1.68s
```

`portao_a_casa_sabe_e_o_produto_nao_faz.py`: **35 passed** — nenhuma lápide
citava este símbolo (conferido por `grep`: zero ocorrências de
`rumble_passthrough`, `_reapply_last_profile` ou `A-FÁBRICA` no portão), então a
posse de linha da R-B não foi exercida: **não toquei nesse arquivo.**

## O que NÃO verifiquei

- **O aparelho.** Nada foi medido na bancada — nem controle, nem daemon vivo,
  nem jogo. A prova é de código: o `config.rumble_active` volta a `None` e
  `set_rumble(weak=0, strong=0)` é chamado uma vez. **Que o jogo VOLTE A
  SACUDIR o controle depois disso é inferência**, apoiada no docstring de
  `apply_profile_rumble_passthrough` e no contrato de `apply_game_rumble` —
  não em medição. É a família ELO-MUDO-01 e merece um teste com o controle na
  mesa antes de alguém afirmar que fechou do lado de quem joga.
- **O caso `rumble_active == (0, 0)`** (o "Parar" da GUI, silêncio deliberado).
  O applier o preserva de propósito (nota M2 no docstring dele), e a cura não
  muda isso — mas não escrevi teste para essa metade, e a mordida não a
  exercita.
- **A `sprint` inteira em um processo.** Rodei por caminho, arquivo a arquivo,
  como manda a casa. Não rodei `pytest` sem argumento.
- **A tela.** A frente não toca `app/` nem `gui/`; nenhuma foto foi tirada
  (R-C), e nenhuma frase nova de tela foi escrita (R-E não se aplica).
- **`scripts/portoes.sh --rapido`: 18 de 19 verdes; o vermelho é
  `colisao-de-sprints`, e ele JÁ ESTAVA vermelho antes de mim.** Provado, não
  suposto: com o meu trabalho fora da árvore (`git stash push -u`),
  `scripts/check_colisao_de_sprints.py` no HEAD limpo devolve `rc=1`. As 16
  colisões que ele nomeia são todas da forma `<sprint antiga> x LEVA-1` — o
  frontmatter `posse:` da LEVA 1, commitado em `aa8dfd67` antes do despacho,
  reivindica arquivos que sprints de 24/08 já reivindicavam, sem `depois_de:`
  nem `nao_toca:`. **Nenhuma delas cita os meus dois arquivos**
  (`daemon/lifecycle.py`, o teste da fábrica). Não consertei: o conserto é o
  frontmatter da sprint (posse de quem coordena) ou o
  `scripts/check_colisao_de_sprints.py` (posse da L1-G).

## O que sobrou para o próximo

1. **`src/hefesto_dualsense4unix/profiles/manager.py:1806-1810` ficou com FATO
   ERRADO, e é posse da L3-E — RELATO, não editei.** O docstring de
   `gerente_do_daemon` afirma, no presente:

   > *"**saída do Modo Nativo** (`daemon/lifecycle.py::_reapply_last_profile`):
   > (...) Esta rota ainda NÃO vem da fábrica — é a E1 aberta da
   > A-FÁBRICA-COM-UM-CLIENTE-01, e é por isso que ela hoje passa 6 dos 7
   > appliers."*

   As duas frases estão falsas desde este commit: a rota vem da fábrica e passa
   os sete. Pela regra de *fato errado se SUBSTITUI*, isso não é decisão medida
   a preservar — é uma afirmação que a medição derrubou, e ela obriga a próxima
   pessoa a escolher entre duas versões. **A substituição cabe em duas frases**
   e o resto do parágrafo (o porquê do embrulho barrar só o `native`) continua
   inteiro e continua verdadeiro.

2. **`docs/process/agentes/2026-08-25/RUMBLE-POR-JOGADOR-01-B5.md:89`** diz
   *"`daemon/lifecycle.py:1196` continua com 6 de 7 appliers"*. É relatório de
   agente, datado — decisão de quem coordena se ganha nota de fechamento ou
   fica como registro do dia. Não é minha posse.

3. **A prova na bancada** do item 1 de "o que NÃO verifiquei": com o controle na
   mesa, ligar o Modo Nativo, "Aplicar" na aba Rumble, desligar o Modo Nativo e
   confirmar que o FF do jogo volta a chegar nos motores. É o que fecha o
   defeito do lado de quem joga.

4. **Nenhum portão foi pedido para `scripts/portoes.sh`** (R-D). Este teste já
   estava na suíte antes de mim; não acrescentei arquivo de teste novo.
