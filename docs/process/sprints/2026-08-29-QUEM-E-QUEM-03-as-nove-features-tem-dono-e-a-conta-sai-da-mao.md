---
sprint: QUEM-E-QUEM-03
estado: aberta
onda: G
posse:
  CENSO:
    - tests/unit/test_quem_e_quem_03_o_censo_das_features_por_controle.py
cria:
  - tests/unit/test_quem_e_quem_03_o_censo_das_features_por_controle.py
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/profiles/schema.py
---

> **ROTA CORRIGIDA — 06/09/2026, arrumação da leva (Fable, PO por delegação).** **Vale inteira, e é só um teste.** O censo das nove features por controle vira portão
(a linha sem dono é o touchpad, nomeada). **Confira antes se o comentário `SÃO QUATRO` de
`schema.py:928` ainda diz quatro** — se a ONDA-CONTROLES-06/07 já acrescentou `mic`/`sensors`, o
censo nasce contando o que existe hoje, não o de 29/08.

> **ESTADO 06/09/2026: aberta, fora das 24 horas** — `docs/process/SPRINT_ORDER.md` §2.3 — régua do esquema do perfil, não remedida desde 29/08.

# QUEM É QUEM · 03 — as nove features têm dono, e a conta sai da mão

**Filha da [QUEM-E-QUEM-01](2026-08-29-QUEM-E-QUEM-01-o-perfil-do-jogo-lembra-cada-controle-pela-identidade.md).**
Ela responde à pergunta 1 do enunciado — *o que "sem opinião" significa em cada
campo* — e faz isso do único jeito que não caduca: **transformando a tabela do
pai em portão**.

**O defeito, numa frase:** a conta está escrita à mão dentro do código
(`profiles/schema.py:928`, *"SÃO QUATRO, e a tela oferece nove"*), e **quatro
sprints em fila vão acrescentar campo sem mexer nessa linha** — no dia em que a
ONDA-CONTROLES-06 entrar, o comentário passa a dizer quatro quando são cinco, e
ninguém percebe. A tabela de features vira ficção no arquivo onde a próxima
pessoa vai confiar.

---

## 1. O QUE ESTÁ MEDIDO

Medido em 29/08/2026, contra o `dev`.

### F1 — a conta é literal, e está no código

`schema.py:928-929`, imediatamente acima dos campos:

```python
# SÃO QUATRO, e a tela oferece nove. O que falta e por quê está na última
# seção do docstring acima — três por ausência, não por decisão.
leds / triggers / rumble / speaker
```

Quatro campos (`:930-933`). **Nada obriga esse número a acompanhar a lista.**

### F2 — o censo de hoje, com o dono de cada linha

`grep` de `posse:` no frontmatter das sprints de `docs/process/sprints/`,
cruzado com os campos de `ControllerOverrides`:

| Feature, por controle | No perfil hoje | Dono da entrega | Estado do dono |
|---|---|---|---|
| Barra de luz | `leds` (`schema.py:930`) | — | **entregue** |
| Gatilhos | `triggers` (`:931`) | — | **entregue** |
| Vibração | `rumble` (`:932`) | — | **entregue** |
| Alto-falante | `speaker` (`:933`) | — | **entregue** |
| Microfone | **não** — global em `Profile.mic` (`:1012`) | `ONDA-CONTROLES-06` | escrita, em fila |
| Máscara | **não** — global em `controller_masks.json` | `A-MASCARA-POR-CONTROLE-01`, `MIGRA-CONTROLES-09` | escritas, em fila |
| Giroscópio | **não existe** | `ONDA-CONTROLES-07` | escrita, em fila |
| Acelerômetro | **não existe** | `ONDA-CONTROLES-07` | escrita, em fila |
| **Touchpad** | **não existe** | **NINGUÉM** | — |

**Oito das nove têm dono. O touchpad não tem, e não é esquecimento** — ver §3.

### F3 — o touchpad não tem tela aprovada, e isso está medido nos dois lados

- **No esquema:** `grep -in touch src/hefesto_dualsense4unix/profiles/schema.py`
  devolve **duas** linhas hoje (`:420` e `:906`), e as duas são **comentário** —
  não há campo. *(O pai diz "UMA linha"; a segunda é a própria seção que ele
  acrescentou ao docstring em 29/08. O número mudou; a substância — nenhum campo
  — não.)*
- **No desenho:** `layout/02-controles.html` cita o touchpad 26 vezes e
  **nenhuma é interruptor**. Ele é moldura de leitura viva (`:607`, *"o touchpad
  estica"*; `:620`, `sensor_widgets.TouchpadView` normaliza por fração), e o
  comentário de `:428` diz o que a fileira do topo ganhou: *"os dois
  interruptores de sensor"* — **dois**, giroscópio e acelerômetro. O touchpad não
  está entre eles.

---

## 2. O PADRÃO QUE MANDA, campo a campo — e é isto que o portão congela

`D-O-MICROFONE-A-MAQUINA-DA-O-PADRAO-O-PERFIL-SOBREPOE`: a máquina dá o padrão,
o perfil sobrepõe. O que **muda** de campo para campo é *quem é a máquina* — e é
por isso que "sem opinião" não é uma frase só:

| Campo | `None` significa | Quem responde no lugar |
|---|---|---|
| `leds` | esta peça não escolheu cor/brilho | a seção `Profile.leds`, e abaixo dela a cor automática do slot (`led_control.player_slot_color`) |
| `triggers` | esta peça não escolheu efeito | `Profile.triggers` |
| `rumble` | esta peça não tem escala própria | `Profile.rumble` |
| `speaker` | esta peça não tem volume/rota próprios | `Profile.speaker`; e **perfil sem a seção não escreve NADA** — escrever tomaria a posse dos bytes de volume (`profiles/manager.py:841-849`) |
| `mic` *(a chegar)* | esta peça não opina sobre o mudo | `Profile.mic`, e abaixo dele `ControleDeclarado.microfone` (`utils/maquina.py`) — a máquina |
| `sensors` *(a chegar)* | esta peça não opina | o topo do perfil, que **nasce ligado** por decisão dela |

**A parcialidade vale DENTRO da seção, não só entre seções.** `manager.py`,
`_controllers_to_specs` (`:1598-1631`): só os campos em `model_fields_set` entram
no spec; o que não foi escrito à mão no JSON vira `None` e herda o global. Um
override que escreveu só o brilho não materializa a cor. **Esta é a diferença
entre "sem opinião" e "opinião igual ao default", e ela já custou uma regressão
registrada** (R-20, auditoria de 23/07: ajustar o brilho de um controle matava a
cor do slot dele).

---

## 3. O TOUCHPAD — a linha sem dono, e ela fica sem dono de propósito

O pai já decidiu: *"nenhuma tela aprovada oferece interruptor para ele […] **é
pergunta aberta para ela, não dívida com dono** — inventá-lo aqui seria feature
nova"* (`schema.py:906-910`).

**Esta sprint não o inventa.** O que ela faz é impedir que ele desapareça: o
censo tem nove linhas, e a nona diz `dono: None` com o motivo. Uma tabela que
some quando ninguém olha é como a lista de portões virou duas
(`portoes.sh`, 25/08) — o registro existe para não se reaprender.

**A pergunta que vai à mesa dela, e está escrita aqui para ter endereço:**

> O touchpad de cada controle guarda alguma coisa no perfil do jogo — ligado /
> desligado, ou sensibilidade —, ou ele é **só leitura** e o perfil não tem nada
> a lembrar dele?

Hoje o produto não tem resposta nem no esquema nem na tela, e o desenho aprovado
trata o touchpad como diagnóstico. **Enquanto ela não responder, nove menos um.**

---

## 4. O QUE ESTA SPRINT ENTREGA

**Um portão, e nenhuma linha de produto.** `posse` é só o arquivo de teste — é
deliberado: `profiles/schema.py` é disputado por treze sprints, e este censo não
precisa de uma linha dele.

O teste carrega o **CENSO** como dado literal: por feature, o nome do campo (ou
`None`), o que "sem opinião" significa, o nível (por controle / global / ausente)
e a sprint dona. E ele compara esse censo com o que o código realmente tem —
`ControllerOverrides.model_fields` e `Profile.model_fields` — **nos dois
sentidos**, no molde do `test_portao_a_lista_de_portoes_e_uma_so.py`:

- campo no modelo e **fora** do censo → reprova nomeando o campo;
- feature no censo declarada como presente e **sem** campo no modelo → reprova;
- feature sem dono → **passa**, e imprime a linha. Ausência de dono é um fato do
  projeto, não um defeito do código; o portão a torna visível, não ilegal.

---

## 5. COMO SE PROVA — e a régua tem de MORDER

`tests/unit/test_quem_e_quem_03_o_censo_das_features_por_controle.py`.
**Universal por construção: nenhum MAC, nenhum aparelho, nenhum arquivo dela** —
o portão lê a definição dos modelos, e um modelo é o mesmo em qualquer mesa do
mundo.

1. **O censo bate com os campos de hoje.** Quatro por controle, e as cinco
   restantes declaradas onde estão.
   **A mordida:** acrescente `mic: ProfileMicConfig | None = None` a
   `ControllerOverrides` numa subclasse de teste sem tocar no censo, e veja
   reprovar com `mic` no nome da falha. **É a ONDA-CONTROLES-06 batendo no
   portão** — que é para isso que ele existe.
2. **Tirar campo também reprova.** Remova `speaker` do censo e veja reprovar no
   outro sentido. Portão de um lado só deixa passar metade dos erros — foi assim
   que a lista de portões divergiu do `ci.yml`.
3. **"Sem opinião" é declarado, nunca em branco.** Toda feature marcada como
   presente tem a frase do que `None` significa, não vazia.
   **A mordida:** apague a frase de um campo e veja reprovar.
4. **A parcialidade dentro da seção continua valendo.** Um
   `ControllerOverrides(leds=LedsConfig(brightness=0.5))` — só o brilho escrito —
   produz `model_fields_set == {"leds"}` e, dentro dele, só `brightness`.
   **A mordida:** troque por um `model_dump()` denso e veja os campos não
   escritos aparecerem — que é, em letra, a regressão R-20 de 23/07.
5. **A linha sem dono é NOMEADA, não silenciosa.** O teste afirma que existe
   exatamente **uma** feature sem dono e que ela é o touchpad.
   **A mordida:** dê um dono falso ao touchpad e veja reprovar; apague a linha do
   censo e veja reprovar por contagem (nove features, sempre nove). **Sem isto o
   portão viraria cúmplice do esquecimento que ele existe para impedir.**

---

## 6. O QUE ESTA SPRINT NÃO FAZ

- **Não acrescenta campo, não mexe no `schema.py`, não corrige o comentário
  `SÃO QUATRO`.** Quem acrescentar o quinto campo é que passa por ele — e agora
  com um portão vermelho apontando o caminho.
- **Não decide o touchpad.** É dela.
- **Não resolve a contradição aberta.** `D-AUDIO-E-GIRO-NASCEM-LIGADOS` (nasce
  ligado) contra o contrato `None = sem opinião` do topo do docstring, que ela
  derrubou em 18/08 (*"o perfil tem de guardar tudo"*). O censo **registra os
  dois** e marca a linha como em disputa; fechá-la escrevendo código é
  exatamente o que o `schema.py:918-923` proíbe.
- **Não toca o número do jogador.** O número é do momento (`identity.py:70-95`);
  o censo é só de features. Ela foi explícita: *"a ideia que falei de se lembrar
  é sobre as features dentro do perfil de tal jogo. **cuidado**"*.
