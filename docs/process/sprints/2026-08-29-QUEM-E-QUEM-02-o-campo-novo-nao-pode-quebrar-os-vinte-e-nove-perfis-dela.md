---
sprint: QUEM-E-QUEM-02
onda: QUEM-E-QUEM
posse:
  QQ02:
    - src/hefesto_dualsense4unix/profiles/loader.py
cria:
  - tests/unit/test_quem_e_quem_02_o_campo_novo_nao_quebra_o_perfil_de_ontem.py
bancada: false
depois_de:
  # SÉRIE por R5: divide `profiles/loader.py`.
  - LEVA-2
  - MIGRA-PERFIS-05
  - ONDA-PERFIS-02
  - ONDA-PERFIS-04
  - ONDA-PERFIS-05
  - ONDA-PERFIS-07
  - ONDA-PERFIS-08
  # A tabela de features que esta sprint protege é a do pai.
  - QUEM-E-QUEM-01
nao_toca:
  - src/hefesto_dualsense4unix/profiles/schema.py
  - src/hefesto_dualsense4unix/app/draft_config.py
  - novo-layout/
  - src/hefesto_dualsense4unix/gui/main.glade
---

# QUEM É QUEM · 02 — o campo novo não pode quebrar os 29 perfis dela

**Filha da [QUEM-E-QUEM-01](2026-08-29-QUEM-E-QUEM-01-o-perfil-do-jogo-lembra-cada-controle-pela-identidade.md).**
Ela responde à pergunta 2 do enunciado: *a memória por identidade vai ganhar
campo novo cinco vezes seguidas (microfone, giroscópio, acelerômetro, máscara,
touchpad) — como nenhuma dessas cinco invalida um perfil que já está no disco?*

**O defeito, numa frase:** a regra que protege o downgrade é uma **lista escrita
à mão** (`profiles/loader.py:1213`), e cinco sprints em fila vão acrescentar
seção sem passar por ela — o esquecimento não dá erro, dá 29 perfis recusados
num `git checkout` para trás.

---

## 1. O QUE ESTÁ MEDIDO — e duas medições derrubaram a hipótese com que esta sprint começou

Medido em 29/08/2026, com o `.venv` desta árvore, contra o código do `dev`.
**A hipótese de partida era que o campo novo por controle quebrava o downgrade.
Ela está ERRADA, e o número mostra por quê.**

### F1 — a ENTRADA por controle já é imune, e não por sorte

`loader.py:1411-1415` serializa cada entrada do mapa com `exclude_unset=True`:

```python
payload["controllers"] = {
    uniq: cfg.model_dump(mode="json", exclude_unset=True)
    for uniq, cfg in (profile.controllers or {}).items()
}
```

Medição: um `ControllerOverrides` com um campo novo acrescentado — **nos dois
moldes, `| None = None` e default denso** — construído com só `leds` escrito,
sai do `_payload_do_perfil` como `{"leds": {}}` **nos dois casos**. E um modelo
congelado com os quatro campos de hoje e `extra="forbid"` (o binário de ontem)
**ACEITA os dois**.

> **Consequência para as cinco sprints em fila:** acrescentar campo a
> `ControllerOverrides` **não** é o risco. Quem escrever a ONDA-CONTROLES-06 ou
> a 07 não precisa tocar em omissão nenhuma para a entrada por controle.

### F2 — o TOPO do perfil não é imune, e a lista que o protege é manual

`loader.py:1406-1408` só remove o que está numa tupla escrita à mão,
`_SECOES_OPCIONAIS_OMITIDAS_QUANDO_NONE` (`:1213`), hoje com seis nomes:
`speaker`, `mouse`, `mic`, `mode`, `key_bindings`, `teclado_emulado`.

Medição, com uma seção `sensors` acrescentada ao `Profile`:

| Molde da seção nova | Vai para o arquivo? | O `Profile` de ontem aceita? |
|---|---|---|
| `sensors: Sensores = Sensores()` (default denso) | **sim**, `{"gyro": true, "accel": true}` | **RECUSADO** — `sensors` |
| `sensors: Sensores \| None = None`, **fora da lista** | **sim**, como `null` | **RECUSADO** — `sensors` |

**Os dois moldes quebram.** O default `None` não salva ninguém sozinho — o que
salva é **lembrar da lista**, e é exatamente isso que não tem portão.

**E já aconteceu, com registro no próprio arquivo.** O comentário de
`loader.py:1219-1225` diz, sobre o `teclado_emulado`: *"Achado pela própria rede
de regressão desta leva (`test_profile_speaker_section.py::test_binario_antigo_…`),
**não previsto pela sprint**"*. Uma sprint esqueceu; quem pegou foi um teste
vizinho, por acidente. Cinco sprints em fila é cinco vezes esse acidente.

### F3 — default denso em `ControllerOverrides` quebra OUTRA coisa, e não o downgrade

`app/draft_config.py:376-390`, `_override_vazio`, já varre `model_fields` em vez
de listar à mão — então ele **não** precisa ser atualizado a cada campo novo (a
ONDA-CONTROLES-06, item 4, prevê uma edição que a medição diz ser desnecessária).

Mas ele decide por `is None` em **todos** os campos declarados. Medido:

- campo novo `| None = None` → `_override_vazio(ControllerOverrides())` = **True** (certo);
- campo novo com default denso → **False** (errado).

Com o default denso, **nenhuma entrada é vazia nunca**: a chave de MAC fantasma
fica no JSON dela e a janela não consegue mais apagá-la — que é, em letra, o
defeito que a docstring daquela função diz existir para impedir.

> **Recado para a ONDA-CONTROLES-07**, que hoje especifica
> `ProfileSensorsConfig` com `gyro: bool = True` e a mesma seção em
> `ControllerOverrides`: **o default denso vale no TOPO do perfil, e não na
> entrada por controle.** No topo ele é a decisão dela
> (`D-AUDIO-E-GIRO-NASCEM-LIGADOS`) e precisa da linha na tupla de omissão; na
> entrada por controle ele produz a chave fantasma. São dois moldes, não um.

### F4 — são 29 perfis, e ZERO usam o mapa por controle

```
ls ~/.config/hefesto-dualsense4unix/profiles/*.json | wc -l     ->  29
grep -l '"controllers"' …/profiles/*.json | wc -l               ->   0
```

**O enunciado desta leva dizia 23.** São 29, e nenhum tem entrada por controle
para migrar. **Isso muda o trabalho inteiro:** não há migração de dado a
escrever — não existe entrada velha para converter. O risco é 100% no TOPO do
perfil e na PRIMEIRA gravação, e é só ele que precisa de portão.

---

## 2. O PADRÃO QUE MANDA, aplicado campo a campo

`D-O-MICROFONE-A-MAQUINA-DA-O-PADRAO-O-PERFIL-SOBREPOE` — a máquina dá o padrão,
o perfil sobrepõe. Traduzido para os dois níveis que esta sprint governa:

| Nível | "sem opinião" é | Como se escreve |
|---|---|---|
| `Profile.<seção>` | o perfil não manda nesta feature; vale o que a máquina/o global disser | `\| None = None` **e** o nome na tupla de omissão |
| `ControllerOverrides.<seção>` | esta peça não tem opinião; herda a seção global do perfil | `\| None = None`, e só |

**A exceção declarada, e ela é dela:** uma feature que ela decidiu que *nasce
ligada* (`D-AUDIO-E-GIRO-NASCEM-LIGADOS`) tem default denso **no topo** — e aí a
linha na tupla de omissão deixa de bastar, porque o valor nunca é `None`. Para
esse caso o contrato é outro e está no item 3 do que esta sprint entrega.

---

## 3. O QUE ESTA SPRINT ENTREGA

1. **A tupla deixa de ser escrita à mão.** `_payload_do_perfil` passa a omitir
   **toda** seção de topo cujo valor é `None`, derivando a lista de
   `Profile.model_fields` em vez de a ler de `_SECOES_OPCIONAIS_OMITIDAS_QUANDO_NONE`.
   Medido antes de propor: as seis da tupla são hoje as **únicas** seções de topo
   que podem valer `None` — o `ponte` já tem serializador próprio
   (`schema.py:1046`, `_sem_ponte_a_chave_nem_aparece`) e o `controllers` tem
   regra própria (`loader.py:1409-1415`).
   **A generalização não muda um byte do que é gravado hoje**, e é isso que a
   prova 3 mede.
   A tupla fica no arquivo como **registro datado** de por que a regra existe —
   não se apaga decisão medida —, marcada como não mais consultada.

2. **`key_bindings: {}` continua sendo gravado.** É a ordem *"teclado
   silencioso"* e não é `None` — o comentário está em `loader.py:1403-1405`, em
   letra: *"`is None` e não falsy"*. A regra nova mantém o `is None`, agora sem
   depender de alguém relê-lo.

3. **A seção que NASCE LIGADA ganha contrato próprio e escrito.** Default denso
   no topo não pode ser omitido (o valor não é `None`), então ele **é**
   incompatível com o binário de ontem, por construção. A entrega aqui não é
   curar isso — é **obrigar quem acrescentar a declarar**: a seção de topo com
   default não-`None` entra numa tupla `_SECOES_DE_TOPO_QUE_NASCEM_DENSAS`, com
   o motivo e a decisão dela ao lado, e o portão da prova 4 exige que toda seção
   de topo esteja em **exatamente uma** das duas listas. Esquecer deixa de ser
   silêncio e passa a ser vermelho.

**Não toca o `schema.py`.** Treze sprints o disputam, e nada aqui precisa dele.

---

## 4. COMO SE PROVA — e a régua tem de MORDER

`tests/unit/test_quem_e_quem_02_o_campo_novo_nao_quebra_o_perfil_de_ontem.py`.
**Nada aqui usa perfil dela nem MAC desta casa:** os perfis são construídos no
teste, e a chave por controle é `aabbcc000002` — sintética, na máscara da casa.

1. **O binário de ontem, congelado no teste.** Um modelo `extra="forbid"` com
   **só** os campos de topo que existem hoje, declarados em lista literal. Um
   `Profile` novo é gravado e relido por ele. **É o downgrade, sem instalar
   binário nenhum.**
2. **A seção nova de topo com `None` some do arquivo — sem ninguém a registrar.**
   Uma subclasse de `Profile` com `secao_inventada: X | None = None` é dumpada:
   a chave **não aparece**, e o binário de ontem aceita.
   **A mordida:** devolva o `for secao in _SECOES_OPCIONAIS_OMITIDAS_QUANDO_NONE`
   no lugar da regra derivada e rode de novo — a chave aparece, e o binário de
   ontem **recusa com `secao_inventada`**. Medido em 29/08: é exatamente o que
   as duas linhas da tabela F2 mostram, e é o teste que separa a cura da
   coincidência.
3. **A generalização não muda o arquivo de hoje.** Para um `Profile` com cada
   combinação das seis seções (`None` e preenchida), o payload da regra nova é
   **byte-idêntico** ao da tupla escrita à mão. Se divergir em um byte, a cura
   mudou o disco dela e reprova.
4. **Toda seção de topo está em exatamente uma lista.** Varre
   `Profile.model_fields`; toda seção opcional tem de estar na regra do `None`
   **ou** declarada como nasce-densa, nunca nas duas, nunca em nenhuma.
   **A mordida:** acrescente uma seção de topo não declarada e veja reprovar
   **nomeando-a** — é o portão que a ONDA-CONTROLES-07 vai encontrar.
5. **A entrada por controle aceita campo novo nos dois moldes.** Congela F1: um
   `ControllerOverrides` com campo extra, escrito só no `leds`, sai `{"leds": {}}`
   e o modelo de quatro campos com `extra="forbid"` aceita. É o que impede a
   próxima sprint de pagar um preço que a medição diz que não existe.
6. **O default denso por controle produz a chave fantasma.** `_override_vazio`
   de um override recém-criado é `True` no molde `None` e `False` no molde
   denso. Congela F3, e é o caminho de ERRO sendo exercido — régua que só sabe
   passar não é régua.
7. **Ida e volta dos 29, sem tocar nos 29.** Um diretório temporário recebe
   cópias de perfis construídos no teste cobrindo as formas que o disco dela tem
   (com e sem `key_bindings: {}`, com e sem `match` por classe); `load → save`
   não acrescenta **uma chave** a nenhum. **Nunca se lê nem se grava
   `~/.config/hefesto-dualsense4unix/profiles/`** — a regra 5 desta leva, e o
   perfil dela não é bancada de teste.

---

## 5. A ORDEM IMPORTA — este portão tem de chegar ANTES das cinco

Um portão que chega depois do campo é autópsia. A ONDA-CONTROLES-06
(`ControllerOverrides.mic`) e a ONDA-CONTROLES-07 (`sensors` nos dois níveis)
são as duas primeiras a atravessá-lo, e a 07 **vai reprovar** como está
especificada hoje — o que é o portão funcionando, não um conflito.

Por isso o `depois_de` desta sprint tem só os donos de `profiles/loader.py`, e
**não** tem as sprints de campo. Quem integrar: esta antes daquelas.

---

## 6. O QUE ESTA SPRINT NÃO FAZ

- **Não acrescenta campo nenhum.** Nem `mic`, nem `sensors`, nem touchpad. Ela é
  a rede que os cinco vão atravessar; escrever um deles aqui seria disputar
  `schema.py` com treze sprints por nada.
- **Não migra dado.** F4 mede que não há o que migrar: zero perfis usam o mapa.
- **Não decide o que nasce ligado.** Isso é dela
  (`D-AUDIO-E-GIRO-NASCEM-LIGADOS` × `D-PERFIL-DE-DESEMPENHO`, contradição aberta
  desde 25/08). A sprint só exige que a resposta esteja **escrita** onde o
  portão a enxergue.
- **Não toca a numeração do jogador.** O número é do momento
  (`identity.py:70-95`), e ela recusou colá-lo à identidade com a razão medida —
  *o controle branco era sempre o player 3 mesmo sozinho na mesa*. Aqui não se
  grava número nenhum.
