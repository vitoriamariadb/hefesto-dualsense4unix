---
sprint: GTK-2
estado: feita
decisoes: [D-0609-GTK-LEVA-INTEIRA]
posse:
  GTK2:
    - src/hefesto_dualsense4unix/integrations/storm_doctor.py
    - src/hefesto_dualsense4unix/app/telas/vibracao.py
    - scripts/i18n_extract.sh
    - tests/unit/test_os_tres_textos_da_vibracao_tem_dono.py
depois_de: [ONDA5-05-03, GTK-1]
nao_toca:
  - src/hefesto_dualsense4unix/gui/
  - src/hefesto_dualsense4unix/interface/pacotes/
  - src/hefesto_dualsense4unix/interface/paginas/
  - pyproject.toml
  - install.sh
  - packaging/
---

# GTK-2 · A JANELA SAI (2 de 3) — os leitores do glade ganham dono no motor

> **A decisão dela, 06/09/2026** (`D-0609-GTK-LEVA-INTEIRA`). **O motor fica; a
> janela sai.** Esta sprint é a que torna a remoção possível **sem quebrar a
> interface nova**.

**O NÓ, medido no plano D-19 e confirmado pela GTK-1:** três programas que
**não são a janela** leem o `main.glade`. Enquanto lerem, apagar o arquivo
quebra o produto novo.

---

## 1. O QUE SE MEDIU — os três leitores, e por que cada um lê

### 1.1 `interface/aba05.py:273` — a interface NOVA lê três textos de tela

```python
_GLADE = (DADOS_DO_REPO.parent.parent / "src/hefesto_dualsense4unix/gui/main.glade").read_text()
```

**No corpo do módulo**, com a razão escrita logo acima (`:262-267`):

> *"ELAS SÃO LIDAS DO GLADE, NÃO REDIGITADAS. … o que tem dono não se digita.
> Uma segunda cópia de um texto de tela diverge na primeira edição."*

E `_do_glade` (`:276-288`) faz `SystemExit` quando a âncora some.

**A razão está CERTA e não se revoga — o que muda é o DONO.** Redigitar os três
textos na aba já custou uma vez nesta casa (`rumble_actions.BTN_GIVE_BACK_TO_GAME`,
RUM-01). **O dono natural é `app/telas/vibracao.py`**, que já é a fonte da linha
de estado desta aba — está no plano D-19, Passo 2, e é o que esta sprint
executa.

### 1.2 `integrations/storm_doctor.py:69` — o rótulo VIVO de um botão

Lê o rótulo do `btn_storm_fix_safe` e irmãos pelo id. **O `storm_doctor` é
integração, não janela: ele FICA.**

**E ele guarda um defeito silencioso**, escrito no plano: ele é "macio" —
devolve o `se_faltar` quando o glade não está ao alcance, porque *"uma frase
que some é pior que uma frase com um nome velho"*. **Sem o glade, ele passa a
publicar o nome de reserva PARA SEMPRE, e nada acusa.** Um `se_faltar` que vira
permanente é exatamente o tipo de instrumento falso que esta casa achou seis
vezes em três dias.

### 1.3 `scripts/i18n_extract.sh:22` — extrai as strings para tradução

Ele varre o glade. Sem o glade, ele extrai menos e **não reclama**.

**A tradução não é prioridade dela** (palavra dela, 05/09), mas um extrator que
emudece em silêncio é dívida escondida. O trabalho aqui é **pequeno e
obrigatório**: ele passa a apontar para onde os textos passaram a morar, ou
**diz** que a fonte sumiu — nunca extrai menos calado.

---

## 2. O TRABALHO, EM TRÊS PASSOS

### Passo 1 — os três textos da vibração mudam de dono

De `gui/main.glade` para `app/telas/vibracao.py`. **A leitura continua sendo
LEITURA** — a aba 05 não passa a digitar os textos; ela passa a lê-los do dono
novo.

**Cuidado com a ordem:** a `ONDA5-05-03` fecha antes e é dona da aba 05. **Esta
sprint toca a linha 273 e o que ela alcança — nada mais da aba 05.** Se você
precisar de mais, RELATE.

**A MORDIDA, e é a do plano:** apague o `main.glade` **numa árvore
descartável** (nunca na dela, nunca na de integração) e prove que a aba 05
**continua montando**. Devolva o glade. Sem esse teste, a `GTK-3` descobre o
defeito no dia em que apagar.

### Passo 2 — o `storm_doctor` para de mentir quando a fonte some

Ele continua macio (a frase não some), **mas o silêncio acaba**: quando o
rótulo vem do `se_faltar`, isso fica registrado onde alguém veja. **Um valor de
reserva que vira permanente sem nada acusando é o defeito, não a reserva.**

**A MORDIDA:** rode o `storm_doctor` sem o glade ao alcance e prove **duas**
coisas: a frase não sumiu, **e** o produto sabe que ela é a de reserva. Arranque
a segunda metade e a régua reprova.

### Passo 3 — o `i18n_extract.sh` aponta para a casa nova

Ou extrai do dono novo, ou **falha dizendo** que a fonte sumiu. **Não extrai
menos em silêncio.**

**A MORDIDA:** sem o glade, o script tem de mudar de comportamento de forma
observável.

---

## 3. O QUE ESTA SPRINT NÃO FAZ

* **Não remove o `main.glade`** nem nada de `gui/`. É a `GTK-3`.
* **Não mexe na aba 05 além da linha 273** — o resto é da `ONDA5-05-03`.
* **Não decide o destino de `gui/aba_conexoes.py` e `gui/aba_sistema.py`** — o
  inventário da `GTK-1` mediu que a interface nova os importa em mais de vinte
  pontos; **quem os move é a `GTK-3`, lendo a recomendação da `GTK-1`.**
* **Não traduz nada.** *"não são prioridades"* — palavra dela, 05/09.

## 4. NADA SE PERDEU

* **A razão de 26/08** — *rótulos lidos, nunca digitados* — continua valendo
  palavra por palavra. **Muda o dono, não a regra.**
* **`gui/ponte_da_tela.py`** não sai nunca.
* **A aba 05 continua montando** — é a mordida do Passo 1.

## A PROVA

Sem tela nova. A prova é **a aba 05 montando com o glade apagado** numa árvore
descartável, com a saída colada, e as três mordidas.
