# LEVA-3-C — as cinco pontes mortas do `ipc_bridge` saem, e a trava que as segurava era falsa

BG-07, reduzida a poda pura. Um commit em `voo/LEVA-3-C`.

## O que mudou

### As cinco funções apagadas

Todas em `src/hefesto_dualsense4unix/app/ipc_bridge.py`, todas publicadas no
`__all__`, todas com **zero chamadores em `src/`** — medido por AST e conferido
por `grep`, que concordam:

| função | quem ficou no lugar |
|---|---|
| `apply_draft` | `apply_draft_detalhado` + `aplicacao_confirmada` |
| `rumble_policy_set` | `rumble_policy_set_checked` (`app/actions/rumble_actions.py:797`) |
| `rumble_policy_set_detalhado` | `rumble_policy_set_checked` — o corpo deste RPC é ECO |
| `trigger_reset` | `trigger_reset_detalhado` (`app/actions/triggers_actions.py:697`) |
| `mouse_emulation_set` | `call_async("mouse.emulation.set", …)` direto, em `app/actions/mouse_actions.py:462` e `:560` |

O `__all__` caiu de 39 para 34 nomes. As cinco lápides correspondentes saíram de
`_SEM_CAMINHO_HOJE`, no bloco `app/ipc_bridge.py` do portão de lápides — e só
elas: nenhum outro bloco foi tocado (R-B).

**Nenhuma medição foi perdida.** Cada docstring podada tinha dentro uma
medição, e cada uma mudou de casa:

- R-19 / ABAS-06 / ABAS-05 (por que `trigger.reset` **não** é `trigger.set` com
  modo "Off": o `set` ARMA `mark_manual_trigger_active`, então o botão de
  "voltar ao normal" era mais um jeito de pausar a troca automática de perfil)
  → docstring de `trigger_reset_detalhado`;
- a fronteira do `bool` vs `dict` do `apply_draft` (um `dict` é SEMPRE
  verdadeiro num `if`, então trocar o tipo de retorno faria chamador não
  migrado dizer "aplicado" para um no-op) → docstring de
  `apply_draft_detalhado`;
- o corpo do `rumble.policy_set` ser eco (`{"status": "ok", "policy": <a
  pedida>}`, medido em 23/08) → docstring de `rumble_policy_set_checked`;
- a rota speed-only do `mouse.emulation.set` (BUG-MOUSE-GUI-SYNC-01 A4) → nota
  de poda acima do `__all__`, apontando para `mouse_actions.py:560`, que é onde
  ela vive hoje.

### A trava declarada CAIU, e está medida

As razões de 12/08/2026 diziam, três vezes, *"a assinatura pode estar sendo
importada pelo applet do COSMIC — conferir antes de apagar"*. Conferido em
26/08/2026:

```
$ grep -rn "apply_draft\|rumble_policy_set\|mouse_emulation_set\|trigger_reset" packaging/cosmic-applet/
$ echo $?
1
```

Zero ocorrências. O applet mora em `packaging/cosmic-applet/src/{app,ipc,main}.rs`,
é Rust, e fala **JSON-RPC por socket Unix** — `ipc.rs:3` diz com todas as
letras *"Espelha `src/hefesto_dualsense4unix/cli/ipc_client.py`"*. Um processo
Rust não importa função Python: o que ele espelha é o **protocolo**, e nenhum
método IPC foi tocado por esta poda (os cinco RPCs continuam roteados no
daemon). A razão que dizia o contrário foi **substituída**, não anotada.

### Uma medição que derruba o que a ordem afirmava

A ordem desta frente dizia: *"`led_set` e `player_leds_set` continuam vivos por
outros caminhos — confira antes de apagar qualquer um"*. **Conferi, e é falso.**
As duas têm **zero** chamadores em `src/` fora do próprio módulo — AST e `grep`
concordam. As únicas citações de `led_set` em `app/actions/lightbar_actions.py`
(`:78` e `:947`) são **comentário**.

Não as podei, porque a ordem nomeia cinco funções e não estas — mas corrigi a
razão da lápide de `led_set`, que também estava errada por outro motivo: ela
dizia que `app/ipc_bridge.py` estava no `nao_toca` da leva, quando o arquivo é
**posse** da LEVA-3-C. As duas ficam para a próxima leva, agora sem trava e com
o preço escrito (dez linhas de produto, cinco pontos em `test_ipc_bridge.py` e
dois métodos em `test_p1_a_resposta_do_daemon_atravessa_a_ponte.py`).

## Qual mordida prova

`tests/unit/test_ipc_bridge.py::TestOAllSoPublicaRotaAtravessada::test_o_all_nao_publica_ponte_sem_travessia`
— por AST, todo nome do `__all__` precisa de pelo menos uma citação **de
código** em `src/` fora do próprio escopo. Citação dentro do próprio
`ipc_bridge.py` só conta quando vem de outra função: sem isso todo invólucro
estreito se daria por vivo citando a irmã que o substituiu, e a régua mediria a
corrente fechada em vez da rota.

**Cura arrancada** (as cinco de volta, `git show HEAD:…/ipc_bridge.py`):

```
E       AssertionError: o `__all__` de `app/ipc_bridge.py` publica rota que NINGUÉM atravessa em `src/`:
E           - apply_draft — quem ficou no lugar: apply_draft_detalhado + aplicacao_confirmada
E           - mouse_emulation_set — quem ficou no lugar: call_async('mouse.emulation.set', ...) direto, em app/actions/mouse_actions.py:462 e :560
E           - rumble_policy_set — quem ficou no lugar: rumble_policy_set_checked
E           - rumble_policy_set_detalhado — quem ficou no lugar: rumble_policy_set_checked
E           - trigger_reset — quem ficou no lugar: trigger_reset_detalhado
E       assert not ['apply_draft', 'mouse_emulation_set', 'rumble_policy_set', 'rumble_policy_set_detalhado', 'trigger_reset']
1 failed, 2 passed, 51 deselected in 1.79s
```

**Cura arrancada só numa** (`trigger_reset` devolvida sozinha) — a régua não
depende de as cinco caírem juntas:

```
E       AssertionError: o `__all__` de `app/ipc_bridge.py` publica rota que NINGUÉM atravessa em `src/`:
E           - trigger_reset — quem ficou no lugar: trigger_reset_detalhado
E       assert not ['trigger_reset']
1 failed, 53 deselected in 1.04s
```

**Cura devolvida:**

```
54 passed in 1.84s
```

E o portão de lápides, depois da poda das cinco entradas:

```
$ pytest tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py -q
35 passed in 57.01s
```

### As outras duas réguas do mesmo arquivo

- `test_a_isencao_declarada_nao_vira_cemiterio` — a direção contrária: isenção
  citando nome que saiu do `__all__` reprova. Sem ela a lista de isenções
  viraria cemitério e passaria a responder a pergunta com entradas mortas.
- `test_a_regua_enxerga_chamada_e_ignora_texto` — **validação do instrumento
  contra respostas que eu já sabia**. Numa fonte fabricada, um nome em
  comentário, um em docstring e um em literal **não** podem contar como
  chamador, e a chamada explícita tem de contar: é a armadilha que já enganou o
  portão de lápides uma vez, quando a chave de IPC `"profile.apply_draft"` —
  escrita noutro módulo, para outra coisa — dava a função `apply_draft` por
  alcançada. E, na árvore de verdade, `call_async` (dezenas de chamadores) tem
  de aparecer atravessada; sem essa metade, o verde da régua poderia ser o
  silêncio de uma varredura que não anda.

  A primeira versão desta régua afirmava, contra a árvore de verdade, que
  `led_set` **não** tem travessia. Trocada: era um fato verdadeiro hoje que
  ficaria vermelho no dia em que alguém fizesse a coisa certa e a fiasse.

## O que NÃO verifiquei

- **Não toquei a bancada, e não precisei dela.** Nenhum método IPC mudou: os
  cinco RPCs (`profile.apply_draft`, `rumble.policy_set`, `trigger.reset`,
  `mouse.emulation.set`) continuam roteados no daemon e continuam sendo
  chamados pelas rotas vivas. Poda de invólucro Python não muda um byte do que
  vai no socket — mas **não confirmei isso com o aparelho ligado**.
- **Não abri a janela.** A frente não toca `app/actions/` nem `gui/`, e por R-C
  não rodei `retratar_abas.py`. Se algum gesto de tela regrediu, esta entrega
  não sabe.
- **Não rodei a suíte inteira** (é de quem coordena, e roda em oito lotes).
  Rodei, por caminho: `test_ipc_bridge.py`, o portão de lápides, e os três
  arquivos que citam os nomes podados.
- **A minha régua é mais fraca que o portão de lápides, de propósito.** Ela
  mede citação de código, não *alcance a partir dos pontos de entrada*: uma
  corrente fechada de funções mortas que se chamam entre si passaria por ela. É
  o portão que mede alcance, e ele está verde.
- **`machine_declare`, `alvo_honrado`, `mic_set_detalhado`,
  `mic_volume_set_detalhado`, `speaker_set_detalhado` e `trigger_set_checked`
  também não têm chamador direto fora do módulo.** As quatro últimas são
  chamadas por uma irmã que TEM chamador externo, então são rota viva. As duas
  primeiras não são, e têm lápide viva no portão — declarei as duas (mais
  `led_set` e `player_leds_set`) em `_SEM_TRAVESSIA_DECLARADA`. **Não medi** se
  as razões dessas lápides continuam corretas: só conferi que os símbolos
  existem.

## O que sobrou para o próximo

### 1. SETE testes VERMELHOS em dois arquivos FORA da minha posse — precisa de dono

Isto **bloqueia a costura** se ninguém pegar. A poda apaga símbolo público, e
dois arquivos de teste que **não estão na posse de nenhuma frente da LEVA-3**
ainda o chamam. R-A me manda relatar e não escrever, então relato — com o
conserto pronto, que é de três linhas:

**`tests/unit/test_r17_r18_uniq_e_sucesso_honesto.py:60`** (4 casos vermelhos,
`TestR18SucessoHonesto`). Trocar

```python
        return ipc_bridge.apply_draft({"leds": {"lightbar_rgb": [1, 2, 3]}})
```

por

```python
        return ipc_bridge.aplicacao_confirmada(
            ipc_bridge.apply_draft_detalhado({"leds": {"lightbar_rgb": [1, 2, 3]}})
        )
```

As quatro asserções R-18 continuam valendo palavra por palavra: é a mesma
regra, no mesmo dono único.

**`tests/unit/test_p1_a_resposta_do_daemon_atravessa_a_ponte.py`** (3 casos
vermelhos):

- `:349-357` — a classe `TestRumblePolicyEntregaOCorpo` inteira testava
  `rumble_policy_set_detalhado`. **Apagar a classe**: o que ela media (o
  `_checked` devolvendo `(True, None)` para o mesmo corpo) já está asserido em
  `:455`, uma linha acima do outro vermelho.
- `:388-390` — `test_trigger_reset_continua_dupla`. **Apagar o método**;
  `trigger_reset_detalhado` já é exercitado em `:227`, no mesmo arquivo.
- `:456` — apagar **só** a linha
  `assert ipc_bridge.rumble_policy_set("economia") is True`. A linha de cima,
  do `_checked`, fica.

`tests/unit/test_aplicar_verdade_ponte_lightbar.py:6` cita `ipc_bridge.apply_draft()`
**em docstring** — não quebra nada, mas está mentindo. Uma frase.

### 2. `led_set` e `player_leds_set` — a poda gêmea, agora sem trava

Medido acima: zero chamadores. As lápides continuam vivas e corrigidas no
portão. O preço está escrito: dez linhas de produto, mais os sete pontos de
teste nomeados na razão do `led_set`. É a mesma poda desta frente, e cabe num
commit.

### 3. `alvo_honrado` e `machine_declare` — dívida antiga, não é resto desta

As duas continuam declaradas. A do `alvo_honrado` é a cara: fechá-la pede um
estado NOVO na tela (controle insensível com a dica, para separar "sem fonte"
de "daemon offline"), e isso é **desenho** — foto antes e depois, e a palavra é
dela.

### 4. Nada de texto de tela nesta frente

Nenhuma palavra nova apareceu na interface: a poda é toda interna à ponte.
Nada para marcar `PROVISÓRIO — decisão dela`.
