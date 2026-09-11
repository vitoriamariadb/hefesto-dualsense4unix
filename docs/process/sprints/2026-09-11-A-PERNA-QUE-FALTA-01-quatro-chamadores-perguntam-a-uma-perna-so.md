---
sprint: A-PERNA-QUE-FALTA-01
estado: feita
onda: A-LISTA-DE-0911B
posse:
  A-PERNA-QUE-FALTA-01:
    - src/hefesto_dualsense4unix/interface/pacotes/rodape.py
    - src/hefesto_dualsense4unix/interface/pacotes/ponte.py
    - src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py
    - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
cria: []
bancada: false
depois_de:
  - O-SALVAR-DA-JOGAR-01
nao_toca:
  - src/hefesto_dualsense4unix/interface/pacotes/perfil.py
  - src/hefesto_dualsense4unix/utils/session.py
  - src/hefesto_dualsense4unix/interface/aba10.py
  - src/hefesto_dualsense4unix/interface/pacotes/a10_perfis.py
  - docs/data/mapa-controles.csv
---

# A PERNA QUE FALTA — quatro chamadores perguntam o perfil ativo a uma perna só

> **ESTADO 2026-09-11: feita** — os quatro curados e mais DOIS que o censo
> da §3 achou (`rumble.motores.set` e `sensor.set`, os outros gravadores do
> `ipc_handlers`): a segunda perna do daemon é `_perfil_que_grava`, que
> pergunta ao `resolve_boot_profile` do próprio boot e **confirma que o nome
> carrega** antes de devolvê-lo. `ponte.chamar_detalhado` passou a juntar as
> duas formas de o daemon dizer não (`_recusa_no_corpo`), e o gesto da
> máscara traduz o motivo em frase de cartão. Régua nova com as quatro
> mordidas, e **toda escrita medida no `json.load` do perfil**.
> **O QUE A FOTO ACHOU, e é o que sobra:** a frase chega ao DOM e fica
> `visibility:hidden` — `.faixa-final:not(.ha) .pendente` (01-jogar.html:1500)
> apaga todo recado de sucesso desta aba, **inclusive o recibo do «Reconectar
> Controles» de 09/09**. O conserto é de `interface/aba01.py`, fora da posse.

**Achado pela conferência da `O-SALVAR-DA-JOGAR-01`, em 11/09/2026, e não pela
sprint que a mediu.** O laudo contou TRÊS chamadores; são QUATRO, e **o quarto
é o único que perde dado dela em silêncio.**

---

## §0 — O FATO, em uma linha

**A casa tem UM dono da pergunta «que perfil está valendo agora», e ele resolve
em DUAS pernas** — o daemon primeiro, o marcador em disco depois
(`profiles_actions.perfil_que_esta_valendo`, e do lado da interface
`pacotes/perfil.nome_do_ativo`). **Quatro lugares ainda perguntam só à
primeira.**

**E a segunda perna não é hipótese:** `nome_do_ativo` documenta, medido em
06/09/2026, o estado *"da máquina dela"* — **o daemon respondendo
`active_profile: null` com um perfil valendo no disco**. É exatamente sob esse
estado que os quatro erram.

## §1 — OS QUATRO, e a diferença entre eles é tudo

| # | onde | como erra | o que custa a ela |
| --- | --- | --- | --- |
| 1 | `pacotes/rodape.py:372` — gesto `salvar` | `nome = str(ctx.state.get("active_profile") or "")` | `ValueError: salvar: não há perfil ativo.` **Barulhento** — ela vê e reclama |
| 2 | `pacotes/rodape.py:349` — gesto `aplicar` | idem | idem |
| 3 | `pacotes/rodape.py:402` — gesto `exportar` | idem | idem |
| **4** | **`daemon/ipc_handlers.py:6506` — `_mascara_no_perfil`** | `nome = getattr(self.store, "active_profile", None)`; `:6508` devolve `sem_perfil` | **A MÁSCARA NÃO É GRAVADA NO PERFIL, e a tela diz que foi.** Calado |

**A MEDIÇÃO DO QUARTO, feita na conferência, com o store em `None` e os
marcadores em disco valendo:**

```
MODO    → grava:      "mode": {"kind":"gamepad","gamepad_flavor":"xbox"}
MÁSCARA → NÃO grava:  {'perfil': None, 'gravado': False, 'motivo': 'sem_perfil'}
                      o .json fica BYTE-IDÊNTICO · "controllers": null
```

**Na mesma corrida.** O modo entra pela interface e grava; a máscara sai pelo
daemon e não grava. A escolha dela fica só no `controller_masks.json`, que o
próprio laudo chama de **cache, não dono**: vale a sessão e **não volta
amanhã**.

**É a folha corrida da máscara se repetindo.** Em 04/09 ela *"nunca gravou um
byte"* — o dicionário ia como `timeout` posicional, e o dublê era mais frouxo
que a ponte real. A cura de hoje não é a mesma, mas o **sintoma na mão dela é
idêntico**: clicou, acendeu, e amanhã não está lá.

## §2 — A CURA DOS TRÊS PRIMEIROS, e ela é uma linha cada

```python
# ANTES
nome = str(ctx.state.get("active_profile") or "")
# DEPOIS
nome = perfil.nome_do_ativo(ctx.state)
```

`pacotes/perfil.py` está em `nao_toca`: a função **já existe e já é a certa**
(`:93`, *"perguntado ao dono"*). Você só a chama.

**A REGRA QUE MANDA FAZER OS TRÊS JUNTOS** é a de 05/09, e o laudo que gerou
esta sprint a invoca e depois a descumpre contando três de quatro: *quando a
cura conhece a causa, ela cobre TODOS os chamadores*. Cobrir um deixa a
próxima pessoa remedindo o mesmo defeito.

## §3 — A CURA DO QUARTO, e ela também já tem a peça pronta

**O daemon não pode importar `interface/pacotes/perfil.py`** — a direção é a
outra. Mas ele **já tem a sua segunda perna**, e já a usa no boot:
`utils/session.resolve_boot_profile()` (`daemon/connection.py:275`).

Então em `_mascara_no_perfil`, quando o store não sabe, pergunte ao disco pelo
mesmo resolvedor que o daemon usa para restaurar o perfil ao ligar. **Não
invente uma terceira leitura de `session.json`/`active_profile.txt`**;
`utils/session.py` está em `nao_toca` de propósito.

**E MEÇA O QUE MUDA NO RESTO.** `_mascara_no_perfil` não é o único método do
`ipc_handlers` que lê `self.store.active_profile`. **Levante todos**, e para
cada um diga:

* é um método que **grava** no perfil? Então tem o mesmo defeito — nomeie;
* é um método que só **lê** ou **reporta** o ativo? Então responder `null`
  quando o daemon não sabe pode ser a resposta certa — **não cure por
  simetria**, cure o que perde dado.

Um levantamento que não separa os dois repete o defeito que veio curar.

## §4 — O AVISO QUE MORRE NO CAMINHO, e a peça está a UMA linha do defeito

`a01_jogar.py:2400` chama `p.chamar("gamepad.mask.set", uniq=…, flavor=…)`, e
`ponte.py:180` faz `ok, _ = _safe_call(...)` — **o `motivo` que o daemon acabou
de devolver é descartado.**

**E a docstring do próprio `chamar`, UMA LINHA ACIMA, já diz isso:**

> *"perde a tradução da recusa, que é o que faz a tela dizer por que não deu,
> em vez de não dizer nada."*

**E o substituto já existe:** `ponte.py:184` —
`chamar_detalhado(...) -> (ok, motivo)`, *"a recusa do daemon traduzida"*.

**É a terceira vez em três dias que esta casa acha a causa uma linha acima do
sintoma**, e é por isso que esta seção existe mesmo depois de a §3 curar a
gravação: **a §3 fecha o caso de hoje; a §4 fecha a CLASSE.** No dia em que o
daemon recusar por outro motivo — `sem_endereco`, `sem_mudanca` — a tela volta
a mentir se ninguém trouxer o motivo.

**O QUE A TELA FAZ COM O MOTIVO é o limite desta sprint.** Ela tem canal de
recado e linha de ressalva. **Use o que existe**; não invente terceiro. E
**nada de confessar dívida nossa na tela** — ordem dela de 07/09: *"o layout
não informa os nossos defeitos"*. `sem_perfil` vira uma frase que diz o que ELA
faz a seguir (*"escolha um perfil para guardar a máscara nele"*), nunca o nome
do estado interno.

## §5 — A MORDIDA, e são quatro

1. arranque a segunda perna do `salvar` e veja a régua reprovar;
2. arranque a do `_mascara_no_perfil` e veja a máscara **sumir do JSON** com o
   store vazio — a régua tem de olhar o **byte no arquivo**, não o retorno;
3. devolva `chamar` no lugar de `chamar_detalhado` e veja a ressalva sumir da
   tela;
4. **a que morde mais:** um dublê de store que responde `None` **e** um
   `session.json` válido no lar de mentira. É a combinação da máquina dela, e
   é a que nenhuma régua de hoje exercita.

**O DUBLÊ NÃO PODE SER MAIS FROUXO QUE O PRODUTO.** Foi assim em 04/09 com a
máscara, e de novo em 05/09 com o co-op. A ponte real é
`chamar(metodo, timeout=None, **params)` — o dicionário cai em `params`. Se o
seu dublê aceitar qualquer coisa, ele não morde.

## §6 — O QUE ENTREGAR

1. **Os quatro chamadores curados**, com as quatro mordidas.
2. **O levantamento da §3**: todo leitor de `store.active_profile` no
   `ipc_handlers`, separado em *grava* × *só lê*.
3. **A ressalva na tela**, com a foto (`--oculta`) do que ela vê quando a
   máscara não pode ser guardada.
4. **A prova no BYTE:** o JSON do perfil antes e depois, com o store vazio e os
   marcadores em disco valendo. É o único degrau que decide.
5. **O que você NÃO mediu**, dito na cara — e diga explicitamente se o degrau
   *SAIU NO FIO* (o `gamepad.mask.set` atravessando o socket de verdade) ficou
   para a bancada.

## §7 — O QUE É DELA

**Nada de decisão, e isso é de propósito:** a `resolve_boot_profile` é o
resolvedor que o próprio daemon já usa, então curar o quarto não inventa
política nova — devolve a simetria que o boot já tem.

O que volta para o olho dela é **a frase da ressalva** (§4) e a foto. Texto de
tela é dela, e a régua da língua desta casa vale: palavra simples, e o que ELA
faz a seguir — nunca o nome do estado interno.
