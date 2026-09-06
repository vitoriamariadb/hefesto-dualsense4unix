---
sprint: ROTA-DO-HTML-INDICE
estado: absorvida
---

> **ESTADO 06/09/2026: absorvida** — índice ou folha de decisões, não é sprint
> executável; o que ela lista vive nas sprints filhas e no `SPRINT_ORDER.md`.

# ROTA DO HTML — o índice, e o contrato que segura as sete ondas

> **06/09/2026 — A ROTA FECHOU E FOI ABSORVIDA.** As ondas A–F e H estão `estado: feita`; a G, `absorvida` (ONDA5-10-* e PERFIL-MODO-01). A regra do reuso e o ritual das quatro provas continuam valendo; a fila de agora é [AS VINTE E QUATRO HORAS](../2026-09-06-AS-VINTE-E-QUATRO-HORAS-a-ordem-que-o-orquestrador-despacha-e-as-rotas-corrigidas.md).

**02/09/2026.** Ela decidiu, e a decisão não se reabre:

> *"já investimos muitas horas, muito dinheiro, muita energia e muitos tokens.
> não dá pra voltar atrás e não quero. Meu layout o claude detonou e falou que o
> dele era melhor e é real. é infinitamente melhor mesmo, mas foi todo pensado
> pra html não vai funcionar em gtk e eu não quero usar o gtk agora. ele tá no
> repo pra ajudar nisso. corrige a rota pra fazer o html funcionar."*
<!-- noqa-acento: citação literal dela -->

**O GTK NÃO É PLANO B. É A REFERÊNCIA.** Ele fica no repositório para responder
uma pergunta e só uma: *"como isto funcionava?"*. Ninguém volta para ele.

---

## A REGRA QUE GOVERNA A ROTA INTEIRA — e era a ideia dela desde o começo

> *"minha ideia sempre foi usar 100% do legado e linkar ele ao html e só depois
> fazer o resto do produto. Eu tinha esse medo."*
<!-- noqa-acento: citação literal dela -->

**O medo dela estava certo, e ele se materializou.** A medição de 02/09/2026
prova, e a correlação não deixa dúvida:

| pacote | linhas | módulos do legado | campos que escreve |
| --- | --- | --- | --- |
| `a08_conexoes.py` | 1790 | **11** | **8/11 (73%)** |
| `a10_perfis.py` | 932 | **6** | 1/3 (33%) |
| `a02_controles.py` | 509 | 3 | 7/12 (58%) |
| `a03_gatilhos.py` | 632 | 3 | **1/25 (4%)** |
| `a04_iluminacao.py` | 273 | **1** | 6/12 (50%) |

**REMEDIDO PELA ONDA B1 EM 02/09/2026.** A tabela anterior dizia `a04 = 0`,
`a10 = 1`, `a02 = 1`, `a03 = 1` e `a08 = 14`, e as cinco estavam erradas: a
régua não contava `profiles/`, de onde as abas Perfis e Gatilhos tiram quase
tudo.

**A aba que mais LINKA o legado é a que mais FUNCIONA** — no topo. Mas a
correlação NÃO é monótona: `a03_gatilhos` alcança três módulos e pinta 1 campo
de 25. **Reuso não é pintura.**

No total: 6.027 linhas nos nove pacotes, **34 módulos do legado alcançados**
(não 24), 20 chamadas de IPC cru — contra **415 defs públicas** em
`app/actions/`, `app/widgets/` e `gui/ponte_da_tela.py`, das quais **314
atravessam para HTML**. A tela nova chama cerca de treze.

**O inventário completo — o que cada aba deveria estar chamando e não chama —
está em
[2026-09-02-ROTA-B1-o-inventario-do-motor.md](2026-09-02-ROTA-B1-o-inventario-do-motor.md).
Leia antes de escrever uma linha de qualquer aba.**

### O QUE ISSO IMPÕE A TODA ONDA DESTA PASTA

**Antes de escrever UMA linha, pergunte: isto já existe no motor?** Os dois
grafos respondem em segundos. O motor, por área:

```
gatilhos     trigger_specs · triggers_actions
lançadores   carona_do_wrapper · launch_wrapper_dialog
perfis       profile_writer · profiles_actions
iluminação   lightbar_actions
vibração     rumble_actions · vibracao
navegação    input_actions · mouse_actions
sistema      ambiente · ambiente_na_tela · daemon_actions · status_actions
controles    controller_card · external_card · external_controllers ·
             mapa_da_mesa · mesa · secao_mesa · sensor_widgets
```

**A divisão que decide o que reusa:** se a função responde *"qual é o valor?"*,
ela REUSA. Se responde *"onde ponho na tela?"*, é da aba. Lógica atravessa;
desenho não.

**E o que NÃO se reusa, para não errar do outro lado:** o que constrói
`Gtk.Widget` não atravessa para HTML. Isso é impossibilidade, não preguiça.

---

## O QUE DEU ERRADO ATÉ AQUI, e o plano inteiro é a cura disto

Em 02/09 ela abriu o produto e mediu o que o assistente não tinha medido: a
interface entrega **36%** dos campos, e **dezesseis gestos dizem "aplicado" sem
mudar nada**. O assistente havia reportado **77%** — número obtido contando se o
NOME de um método aparecia no código.

**A LIÇÃO, e ela é a regra número um deste plano:**

> **Presença de string não é funcionamento. Só clicar mede.**

O mapa completo, com os sete defeitos nomeados e a prova de cada um, está em
[2026-09-02-O-MAPA-DA-INTERFACE-medido-clicando-e-as-ondas.md](../2026-09-02-O-MAPA-DA-INTERFACE-medido-clicando-e-as-ondas.md).
**Leia-o antes de abrir qualquer sprint desta pasta.**

---

## O RITUAL — nenhuma onda fecha sem as quatro

Isto não é sugestão. É o que faltou e custou a madrugada dela.

```bash
# 1. A FOTO — e LEIA o PNG (a ferramenta de leitura enxerga imagem)
.venv/bin/python src/hefesto_dualsense4unix/interface/hefesto_vivo.py \
    --oculta --abre NN-aba.html --segundos 6 --foto /tmp/antes.png

# 2. O CLIQUE — cole a saída LITERAL no relatório
.venv/bin/python src/hefesto_dualsense4unix/interface/hefesto_vivo.py \
    --oculta --abre NN-aba.html --prova-no-aparelho --entre 250 --espera 350

# 3. A COMPARAÇÃO — campo a campo, o daemon × a tela
python - <<'PY'
import sys; sys.path.insert(0,'src'); sys.path.insert(0,'src/hefesto_dualsense4unix/interface')
from pacotes import ponte
st = ponte.daemon_state_full() or {}
for c in st.get("controllers") or []:
    print({k: c.get(k) for k in ("uniq","transport","battery_pct","player","player_slot")})
PY

# 4. A MORDIDA — arranque a cura, veja reprovar, devolva por CÓPIA
```

**`--oculta` SEMPRE.** Ela tem UMA tela; janela visível quebra o que ela está
fazendo.

**A PROVA DE CLIQUE MUDA A MÁQUINA DELA.** Medido em 02/09: o
`--prova-no-aparelho` da aba Jogar clicou `modo-xbox` e deixou os dois controles
em `uinput`. Foi preciso clicar `modo-dualsense` para devolver. **Leia o estado
antes, leia depois, e devolva o que mudou** — e diga isso no relatório.

---

## OS DOIS GRAFOS — a pergunta central vira consulta

| árvore | o que ela responde |
| --- | --- |
| esta (`dev`) | 1405 arquivos · 32.596 nós · 227.832 arestas |
| `…-estavel` (o GTK) | 1304 arquivos · 30.911 nós · 216.323 arestas |

A pergunta deste projeto é **"o que a GTK fazia e a HTML não faz?"**. Com os dois
grafos ela é consulta, não arqueologia. Reconstruir: `fazer_grafos` na raiz de
cada árvore.

---

## AS OITO ONDAS

| onda | o que é | arquivos que ela abre | espera |
| --- | --- | --- | --- |
| **A** identidade | o controle passa a se identificar | `daemon/ipc_handlers.py` · `integrations/cor_do_plastico.py` · `pacotes/__init__.py` | — |
| **B** reuso | trocar cópia por chamada ao motor GTK | os dez `pacotes/*.py` | — |
| **C** regressões | o que a GTK lia e a HTML não lê | `pacotes/*.py` (leitura de estado) | — |
| **D** os dezesseis | os gestos que dizem "aplicado" e não aplicam | `pacotes/aNN_*.py` (gestos) | — |
| **E** gatilhos | a aba que entrega 1 campo de 25 | `aba03.py` · `a03_gatilhos.py` · HTML 03 na BANCADA | **B** |
| **F** lançadores | a aba com ZERO gestos | `aba07.py` · `a07_*.py` · HTML 07 na BANCADA | — |
| **G** perfis | a aba + o perfil por controle | `aba10.py` · `a10_perfis.py` · HTML 10 na BANCADA | **A** |
| **H** janela | decoração e acabamento | `hefesto_vivo.py` · `abrir_interface.py` · CSS na BANCADA | — |

```
  PRIMEIRO, AS DUAS DE FUNDAÇÃO        DEPOIS                    E POR FIM
  ─────────────────────────────        ──────                    ─────────
   A  identidade  ──────────────────>  G  perfis
   B  reuso  ───────────────────────>  E  gatilhos
                                       C  regressões              H  janela
                                       D  os dezesseis            F  lançadores

  A e B rodam JUNTAS. C, D, F e H a qualquer momento.
  As duas ÚNICAS esperas: G depende de A · E depende de B.
```

**A divisão é POR ARQUIVO, não por assunto** — é o que permite rodarem juntas,
cada uma na sua worktree, e integrarem por merge sem conflito.

**AS SPRINTS ESCRITAS ATÉ AGORA:**

- [ONDA A — a identidade do controle](2026-09-02-ROTA-A-a-identidade-do-controle.md)
- [ONDA B — o reuso que não aconteceu](2026-09-02-ROTA-B-o-reuso-que-nao-aconteceu.md)
- [ONDA F — a aba Lançadores](2026-09-02-ROTA-F-a-aba-lancadores.md) — **FECHADA
  em 02/09.** A aba saiu de `0 gestos / 0 campos` para **6 gestos e 26
  endereços**, e os quatro números que ela afirmava caíram: `412 jogos` era 23
  instalados, `3 já sabem por onde entrar` era 0 pontes confirmadas, e o
  `Heroic · NÃO CHEGAM` era afirmação sobre um lançador que o produto **nunca
  olhou** — nasceu o selo `NÃO SEI` para os cinco sem fonte. No primeiro tique
  ela achou um **defeito vivo**: o PRAGMATA tinha acabado de perder as Opções de
  Inicialização. A onda também derrubou a decisão de 01/09 que a proibia (ver §0
  da sprint), e o desenho novo espera o `--publicar 07` dela.

As demais (C a H) estão descritas em
[O MAPA](../2026-09-02-O-MAPA-DA-INTERFACE-medido-clicando-e-as-ondas.md), §4,
com arquivos, o que fecha e o que não fazer. **Quem for executar uma delas
escreve a sprint própria antes, no molde das duas acima.**

---

## COMO SE INTEGRA

Quem coordena trabalha em árvore PRÓPRIA, nunca na dela:

```bash
git worktree add ../hefesto-voo/_integra onda/atual
```

Cada onda volta com branch própria. O merge é **uma por vez**, com
`git add -A && bash scripts/portoes.sh` (os 30) entre cada uma. A árvore dela
recebe tudo no fim, de uma vez, pelo merge em `dev`.

---

## O QUE NENHUMA ONDA PODE FAZER

1. **Publicar HTML.** Os geradores escrevem em `mockup/` (a BANCADA). O produto
   só recebe por `scripts/check_o_desenho_aprovado.py --publicar NN`, e isso é
   ATO DELA. Se a onda precisa de HTML novo, escreve na bancada e declara em
   `mockup/DIVERGENCIAS.md`.
2. **Rodar `install.sh`.** Ele reinicia o daemon dela.
3. **Abrir janela visível.**
4. **Dizer "pronto" sem colar a saída do clique.**

---

## A RÉGUA QUE DECIDE SE A ROTA ESTÁ CERTA

Depois de cada onda integrada, meça de novo — e o número tem de subir:

```bash
# quantos campos o produto escreve, dos que o HTML tem
python - <<'PY'
import sys, re, pathlib
sys.path.insert(0,'src'); sys.path.insert(0,'src/hefesto_dualsense4unix/interface')
from hefesto_dualsense4unix.interface import onde
tot=esc=0
for h in sorted(onde.PUBLICADO.glob("[01]*.html")):
    campos = set(re.findall(r'data-campo="([^"]+)"', h.read_text(encoding="utf-8")))
    src = ""
    for p in pathlib.Path("src/hefesto_dualsense4unix/interface/pacotes").glob("a*_*.py"):
        if p.name.startswith("a" + h.name[:2]):
            src = p.read_text(encoding="utf-8")
    esc += len({c for c in campos if f'"{c}"' in src or f"'{c}'" in src}); tot += len(campos)
print(f"{esc}/{tot} = {100*esc/tot:.0f}%")
PY
```

**O piso de 02/09/2026 é `37/103 = 36%`.** Ele não pode cair, e cada onda diz
quanto subiu.

**MAS ESSE NÚMERO NÃO BASTA** — ele conta se o pacote MENCIONA o campo, e é
primo do erro que produziu o 77%. O número que decide é o do CLIQUE: gestos
aplicados sobre gestos existentes, e a lista de "sem efeito e sem `SEM_ECO`"
vazia. **O piso é `36/48` aplicados e DEZESSEIS mentindo.**
