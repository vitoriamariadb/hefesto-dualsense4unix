# QUEM-E-QUEM-02 — o campo novo não pode quebrar os perfis que já estão no disco

**Árvore:** `hefesto-voo/QUEM-E-QUEM-02-opus`, branch `voo/QUEM-E-QUEM-02-opus`,
nascida de `onda/atual-0609` em `c15d2e3e` (conferido: `git log -1 --format=%h`
== `git rev-parse --short onda/atual-0609`).

**Bancada:** não pedida e não usada. `bancada: false` no frontmatter, e a sprint
não tem um passo que toque aparelho, `hidraw`, `systemctl` ou daemon: ela é
inteira sobre a FORMA do arquivo de perfil no disco. **`esperou_bancada`: não.**

---

## O que mudou

### 1. A tupla escrita à mão deixou de ser consultada — quem omite agora é o VALOR

`src/hefesto_dualsense4unix/profiles/loader.py`, `_payload_do_perfil`:

```python
# antes
for secao in _SECOES_OPCIONAIS_OMITIDAS_QUANDO_NONE:
    if payload.get(secao) is None:
        payload.pop(secao, None)

# agora
for secao in _secoes_de_topo_omitidas_quando_none(payload):
    payload.pop(secao, None)
```

`_secoes_de_topo_omitidas_quando_none` devolve as chaves cujo valor é `None` —
`is None` e **não** falsy, porque `key_bindings: {}` é a ordem "teclado
silencioso" e tem de sobreviver ao save.

`_SECOES_OPCIONAIS_OMITIDAS_QUANDO_NONE` **ficou no arquivo**, com um bloco novo
de comentário marcando-a como **registro datado e não mais consultada** — não se
apaga decisão medida, e cada linha dela é uma sprint que esqueceu de vir até ali
e foi pega por acidente por um teste vizinho.

### 2. A seção que NASCE DENSA ganhou contrato escrito

Tupla nova, `_SECOES_DE_TOPO_QUE_NASCEM_DENSAS`, com os oito campos do núcleo v1
(`name`, `version`, `match`, `priority`, `triggers`, `leds`, `rumble`,
`suppress_desktop_emulation`) e o motivo de cada bloco ao lado. Campo de topo
que nunca vale `None` é gravado em todo save e **é** incompatível com um binário
anterior a ele, por construção — isso não tem cura, então a entrega é obrigar a
DECLARAR.

### 3. O portão

`tests/unit/test_quem_e_quem_02_o_campo_novo_nao_quebra_o_perfil_de_ontem.py`,
148 casos. A régua central varre `Profile.model_fields` e exige que todo campo
de topo esteja em **exatamente uma** das duas saídas: aceita `None` (e a omissão
derivada o alcança sozinha) **ou** está declarado como nasce-denso. Nunca nas
duas, nunca em nenhuma — e a queixa NOMEIA o campo.

**Nada aqui lê nem grava `~/.config/hefesto-dualsense4unix/profiles/`.** Os
perfis são construídos no teste, num `tmp_path`; a chave por controle é
`aabbcc000002`, sintética, na máscara da casa.

### 4. O que caiu do enunciado da sprint — o disco de hoje discorda dela em três números

| a sprint dizia (29/08) | o disco de 06/09 | consequência |
| --- | --- | --- |
| a tupla tem **seis** nomes | tem **sete** — `button_actions` entrou em 01/09 pela FEAT-ACOES-DE-BOTAO-01 | a varredura da prova 3 cobre as sete, e um teste próprio impede a tupla de crescer sem a varredura crescer |
| `ControllerOverrides` tem **quatro** campos | tem **seis** — `mic` (03/09) e `sensores` já chegaram | o `_OverrideDeBinarioDeOntem` do teste congela os quatro de propósito: é o binário de ONTEM, não o modelo de hoje |
| `sensors` é o que a ONDA-CONTROLES-07 vai acrescentar nos **dois** níveis | a metade POR CONTROLE **já está lá** (`ControllerOverrides.sensores`) | sobra para a 07 só a metade do TOPO, que é justamente a que o portão novo cobra |

Nenhuma dessas três derrubou um passo da entrega — todas as três só corrigiram
números do enunciado. **Nenhuma célula do mapa de canais foi citada para parar
passo nenhum**, porque nenhuma se aplica (ver abaixo).

---

## Qual mordida prova

**Três mordidas, aplicadas no produto e desfeitas. As saídas estão coladas.**

### Mordida 1 — devolver a tupla escrita à mão no lugar da regra derivada

É a mordida que a própria sprint especifica. `_payload_do_perfil` voltou a
`for secao in _SECOES_OPCIONAIS_OMITIDAS_QUANDO_NONE`:

```
FAILED ...::test_secao_nova_de_topo_com_none_some_do_arquivo
1 failed, 147 passed in 0.66s

>       assert "secao_inventada" not in payload
E       AssertionError: assert 'secao_inventada' not in {'name': 'amanha_sem_secao', ...}
```

E o efeito no downgrade, medido na mesma passada:

```
secao_inventada no arquivo -> None
o binario de ontem RECUSOU: secao_inventada
```

É exatamente a linha 2 da tabela F2 da sprint (`| None = None`, **fora** da
lista → vai como `null` → recusado). Cura devolvida: **148 passed**.

### Mordida 2 — trocar o `is None` do laço por falsy

```
FAILED ...::test_teclado_silencioso_sobrevive_ao_save
FAILED ...::test_a_generalizacao_nao_muda_o_arquivo_de_hoje[0..127]
FAILED ...::test_a_generalizacao_nao_muda_o_arquivo_com_mapa_por_controle
130 failed, 18 passed in 1.23s
```

A ordem "teclado silencioso" some do arquivo e a comparação byte a byte contra a
tupla antiga reprova nas 128 combinações. Cura devolvida: **148 passed**.

### Mordida 3 — acrescentar uma seção densa ao `Profile` REAL, sem declarar

Em `schema.py`, encenando a ONDA-CONTROLES-07:
`sensors: ProfileSpeakerConfig = ProfileSpeakerConfig(volume=1)`.

```
FAILED ...::test_toda_secao_de_topo_esta_em_exatamente_uma_lista
E  AssertionError: sensors: NASCE DENSO e não está declarado em
E  _SECOES_DE_TOPO_QUE_NASCEM_DENSAS. Ele é gravado em TODO save e um hefesto
E  anterior a ele recusa os perfis dela inteiros. Declare-o com o motivo, ou
E  dê a ele `| None = None`.
```

O portão NOMEIA o campo. `schema.py` foi restaurado byte a byte (`git status`
limpo nele) — **esta sprint não toca `schema.py`**, como o `nao_toca:` manda.

### E as três saídas do portão são exercitadas, não só a que passa

`test_o_portao_das_duas_listas_morde` dirige a classificação contra modelos de
mentira e cobra as três queixas — denso-e-não-declarado, declarado-e-inexistente,
e nas-duas-listas — cada uma nomeando o campo. Régua que só sabe passar não é
régua, e um `assert` que só o caso verde exercita é a mesma coisa.

### O verde final

```
$ .venv/bin/python -m pytest tests/unit/test_quem_e_quem_02_...py -q
148 passed in 0.68s
```

`bash scripts/portoes.sh` → **TODOS VERDES** (saída em
`/tmp/portoes-QUEM-E-QUEM-02.txt`).

---

## O que NÃO verifiquei

- **Aparelho: nada.** Nenhum DualSense foi tocado, nenhum byte saiu no fio,
  nenhuma célula do mapa foi exercida. **E isso não é omissão:**
  `docs/data/mapa-controles.csv` não tem família de persistência de perfil — as
  onze são `audio`, `combinacao`, `energia`, `entrada`, `gatilho`, `identidade`,
  `luz`, `movimento`, `plataforma`, `toque`, `vibracao` —, e as 16 linhas de
  `identidade` são sobre REQ_DEV_INFO, pareamento, firmware e cor do plástico,
  não sobre o que se grava no JSON. Esta sprint mede a forma de um arquivo em
  disco. **`mediu` sai vazio, e vazio é a resposta honesta.**
- **O downgrade REAL**, com um binário anterior instalado. O que se prova aqui é
  um `Profile` congelado com `extra="forbid"` dentro do teste — é a encenação
  que a sprint pede (*"é o downgrade, sem instalar binário nenhum"*), e ela não
  substitui rodar um hefesto velho contra o disco.
- **Os 29 perfis dela.** Não foram lidos nem contados nesta passada: a regra 5
  da leva proíbe, e a prova 7 cobre as FORMAS que eles têm, construídas no
  teste. O número 29 é da medição de 29/08 e não foi remedido.
- **A tela.** Nenhuma linha desta entrega toca interface, então não há foto,
  clique nem `--oculta` a mostrar.
- **A suíte inteira.** Rodei o meu escopo mais os 75 arquivos de teste que casam
  `test_*profile*` / `test_*perfil*` (`1281 passed, 10 skipped`, mais os 12
  vermelhos herdados de que falo abaixo), que é o que o protocolo manda — a
  suíte inteira é de quem coordena, e toca nós uinput de verdade.

### 12 vermelhos que NÃO são meus, e a prova

`tests/unit/test_nunca_troca_o_alvo_01_o_salvar_que_mirava_outro_perfil.py`
reprova 12 casos. **Reprova IGUAL com a minha mudança fora:** `git stash` do
`loader.py` e a mesma passada dá `12 failed, 6 passed`. É a JANELA GTK — as
falhas são `janela.nome_no_editor() == ''` —, e a janela saiu inteira do disco
em 06/09 pela GTK-3 (`D-0609-GTK-LEVA-INTEIRA`). Este arquivo de teste ficou
para trás na remoção. Relato e não conserto: não é meu, e `posse:` diz
`loader.py`.

---

## O que sobrou para o próximo

1. **Esta régua não está na lista do `portoes.sh`.** Ela é teste de unidade, e
   é o CI que a roda com a suíte — o `cria:` da sprint só me dava o arquivo de
   teste, e acrescentar linha ao `portoes.sh` + `ci.yml` é arquivo de outro
   dono. **Quem tiver os dois na posse: vale a linha**, porque é exatamente o
   caso da cicatriz do `citacoes-no-codigo` (*"se dois portões da suíte medem
   coisa que a lista não roda, o piso tem furo"*).
2. **A ONDA-CONTROLES-07 vai reprovar, e isso é o portão funcionando.** O que
   ela precisa fazer, em uma linha: pôr `sensors` em
   `_SECOES_DE_TOPO_QUE_NASCEM_DENSAS` com o motivo e a decisão dela
   (`D-AUDIO-E-GIRO-NASCEM-LIGADOS`) ao lado — **ou** declarar o campo
   `| None = None` e não precisar de nada. O comentário que reserva o lugar já
   está escrito na tupla.
3. **E ela NÃO deve repetir o molde denso na entrada por controle.** Medido e
   congelado aqui (prova 6): `_override_vazio(_OverrideComCampoNovoDenso())` é
   `False`, ou seja **nenhuma entrada é vazia nunca** e a chave de endereço fica
   presa no JSON dela sem a janela conseguir apagá-la. São dois moldes, não um.
4. **A metade por controle de `sensors` já existe** (`ControllerOverrides.
   sensores`). Quem despachar a 07 confira o escopo antes: parte do enunciado
   dela já está no disco.
5. **Os 12 vermelhos do `test_nunca_troca_o_alvo_01`** (acima) precisam de dono
   — provavelmente a costura da GTK-3.
6. **`docs/data/mapa-controles.csv` não recebeu nada desta sprint**, e não
   deveria: não há célula de persistência de perfil para marcar. Se a
   SPECS-A-PROCEDENCIA-01 esperar uma linha minha, a resposta é esta.
