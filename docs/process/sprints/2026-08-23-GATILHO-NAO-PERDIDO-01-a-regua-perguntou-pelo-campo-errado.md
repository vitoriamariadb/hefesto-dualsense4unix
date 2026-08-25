---
sprint: GATILHO-NAO-PERDIDO-01
posse:
  E4:
    - src/hefesto_dualsense4unix/app/actions/trigger_specs.py
    - src/hefesto_dualsense4unix/core/trigger_curves.py
cria:
bancada: false
depois_de: [GATILHOS-APLICADO-COM-PROVA-01]
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/triggers_actions.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/profiles/schema.py
  - docs/data/decisoes-dela.csv
---
# GATILHO-NÃO-PERDIDO-01 — a régua perguntou pelo campo errado

**23/08/2026.** Uma frente inteira nasceu para curar isto:

> *"Os 34 perfis dela em `~/.config/hefesto-dualsense4unix/profiles/*.json` têm
> `trigger: null`. TODOS, sem exceção. Sackboy, Mortal Kombat, Wukong, os de
> co-op — nenhum guarda gatilho."*

**Não têm.** Os 34 guardam gatilho. O campo do esquema chama-se `triggers`, no
plural (`profiles/schema.py`, `Profile.triggers: TriggersConfig`), e a régua
perguntou por `trigger`, no singular — um campo que não existe em `Profile`.
Um `.get("trigger")` devolve `None` em qualquer perfil desta casa, hoje e
sempre. **É a sexta régua falsa da semana**, e a mais cara: fez inventariar um
defeito de gravação inexistente.

## A medição que fecha a pergunta

Instrumento declarado: `json.load` sobre os 34 arquivos dela, lidos do disco,
sem passar por nenhuma camada do produto.

```
perfis onde d.get("trigger") is None: 34 de 34     <- a régua falsa
perfis com a chave "trigger" no JSON:  0 de 34     <- a chave não existe
```

E o perfil do Sackboy, que é o do centro da queixa:

```json
"triggers": {
  "left":  { "mode": "Feedback", "params": [5, 4] },
  "right": { "mode": "Feedback", "params": [5, 4] }
}
```

Dezenove dos 34 gravam `Off/Off` (a resposta honesta de quem não opinou); os
outros quinze gravam efeito de verdade — `MultiPositionFeedback` na
`aventura`, `Bow` no `bow`, `SlopeFeedback` no `pragmata`, `Feedback` no
Sackboy, no `mortal_kombat`, na `mina` e no `touhou_luna_nights`.

**O caminho de gravação está inteiro, e não foi tocado nesta leva.** A aba
Gatilhos escreve em `self.draft` (`triggers_actions._persist_params_to_draft`),
o `to_profile` emite a seção (`draft_config._triggers_draft_to_config`), o
esquema a aceita e o disco a tem. O teste de ida e volta que cobre isso é
`test_perfil_salva_tudo_ida_e_volta.py`, e ele **não** é falso: o registro dele
nomeia `triggers` com o escritor certo.

## O que ERA defeito, e é da família ELO-MUDO

A queixa que sobrou vem do próprio relatório de ativação. O
`ProfileManager.apply` escrevia a palavra `aplicado` **FIXA** para gatilho e
luz, sem perguntar a ninguém se algum byte tinha saído:

```python
relatorio.setdefault(categoria, "aplicado")
```

Medido aqui em 23/08, com o perfil `Sackboy` dela e um controller de mesa vazia
— que é a volta exata do backend real, onde `_for_each` sem handles loga
`output_offline_noop` e retorna:

```
bytes escritos no aparelho: 0
relatorio: {'led': 'aplicado', 'trigger': 'aplicado'}
```

Zero byte, duas seções jurando que entraram. É a
[ELO-MUDO-01](2026-08-22-ELO-MUDO-01-o-ok-que-nao-sabe-dizer-nao.md) hospedada
dentro da própria cura: ela acabou com o silêncio de gatilho e luz, e pôs no
lugar uma palavra que ninguém mediu. Foi essa linha do journal que sustentou a
suspeita de gravação — quem lê não tem como separar isto de uma ativação que
funcionou.

## A cura: a palavra vem de quem viu

A casa já tinha o vocabulário e o precedente. A `MESA-CHEIA-09` fez
`apply_output_for` **devolver o que fez** (`core.controller.ResultadoDeSaida`:
`escreveu` / `registrado` / `falhou` / `sem_alvo` / `nada_a_fazer`), e chamou
isso de *"a raiz das quatro mentiras de aplicado da janela"*. A porta que o
PERFIL usa — `apply_output_defaults` — tinha ficado de fora.

1. **`core/backend_pydualsense.py`** — o backend que conhece a mesa responde:
   `nada_a_fazer` sem pedido, `registrado` com a mesa vazia (o
   `_desired_default` FOI gravado e o hotplug o aplica quando um controle
   chegar — nenhum byte saiu agora), `escreveu` com alguém na mesa.
2. **`core/controller.py`** — a base devolve `None`, que significa **"este
   backend não sabe dizer"**, nunca "nada aconteceu". É a disciplina do
   `profiles.manager._estado_da_secao`: quem não sabe não fabrica veredito.
   Dublê e backend de um controle só seguem byte-idênticos ao que eram.
3. **`profiles/manager.py`** — traduz para o dialeto do relatório. A tradução
   que importa é `registrado` → **`adiado_sem_controle`**: mesa vazia não é
   fracasso nem sucesso, e dizer `ignorado_*` mentiria para o outro lado,
   prometendo que nada vai acontecer.

Gatilho e luz compartilham UMA resposta porque compartilham UMA chamada e UMA
mesa. Quando a trava manual silencia uma delas, o `setdefault` preserva o
`ignorado_trava_manual` e a outra fica com o veredito — que é o certo, porque o
`OutputSpec` só levou a outra.

## O que continua ABERTO, e é dela

**A queixa do aparelho não foi respondida.** *"Ué, os gatilhos ainda tão bugados
nele?"* — o perfil do Sackboy está correto no disco e a ativação o escreve. O
que sobrou é a camada de baixo, e ela precisa do controle na mão dela:

- o Sackboy está na **allowlist do Steam Input**, e a Steam mantém o `hidraw`
  de cada DualSense aberto em leitura+escrita. Está MEDIDO que ela repinta a
  lightbar em rajada (98 reports contra 6 numa probe sem ela) e está CURADO com
  o [GATILHO-DA-COR-01](../../protocol/pilha-steam-input-xpad-sdl.md), que
  reafirma cor e número de jogador 1,5 s depois que a rajada sossega;
- **o gatilho não tem reafirmação equivalente.** Nada no produto reescreve o
  efeito adaptativo depois de uma rajada;
- **e ninguém mediu se a rajada da Steam derruba o gatilho.** É o item 7 da
  tabela de "em aberto por falta de medição" daquele documento — *"que report a
  Steam manda nos 98 pacotes da rajada"* —, e o parser de 12/08 não venceu o
  formato do `btmon`.

A hipótese é boa e a simetria é sugestiva, mas **hipótese não é medição**, e
esta casa já derrubou "reconectar cura" quatro vezes. O ensaio que fecha a
linha, com o controle na mão dela: abrir o Sackboy pela Steam com um gatilho
`Rigid` bem duro no perfil, sentir o L2 antes e depois da rajada, e ver se o
efeito sobrevive. Se não sobreviver, o gatilho ganha o mesmo tratamento da cor,
e o mecanismo genérico já existe (`core/gatilho_fim_de_sequencia.py`).

## A regra que fica

**O `.get()` de um campo que não existe devolve `None`, e `None` parece
defeito.** Antes de abrir uma frente contra uma ausência, confira que o nome
perguntado é o nome do campo — `Profile.model_fields` responde em uma linha. As
duas medições independentes que teriam matado esta na origem custavam segundos:
contar a chave crua no JSON, e validar um perfil pelo esquema.
