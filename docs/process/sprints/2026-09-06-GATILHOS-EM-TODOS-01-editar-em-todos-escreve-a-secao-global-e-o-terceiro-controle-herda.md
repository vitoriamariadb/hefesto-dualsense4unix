---
sprint: GATILHOS-EM-TODOS-01
estado: feita
onda: G
posse:
  TODOS:
    - src/hefesto_dualsense4unix/interface/pacotes/a03_gatilhos.py
    - src/hefesto_dualsense4unix/interface/aba03.py
    - mockup/03-gatilhos.html
cria:
  - tests/unit/test_editar_em_todos_escreve_a_secao_global.py
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/profiles/schema.py
  - src/hefesto_dualsense4unix/app/alvo_de_edicao.py
  - docs/data/
---

# GATILHOS · EDITAR EM TODOS — escreve a seção global, e o terceiro controle herda

> **ESTADO 2026-09-06: feita** — nasceu o gesto `em-todos` da aba 03: o par L2+R2
> de uma coluna vai aos controles em BROADCAST, entra na seção GLOBAL do perfil e
> SAI dos overrides por controle (a regra de
> `draft_config.with_override_fields_cleared`, aplicada no `Profile`). A mordida
> do terceiro controle está medida pelos dois donos da resolução —
> `profiles/manager._controllers_to_specs` e `a03_gatilhos._modo_de_agora` —, e a
> mordida A derruba seis réguas. **O BOTÃO ficou só na BANCADA e espera o
> `--publicar 03`, que é ato dela**; a faixa de ação e o rótulo encurtado estão
> declarados em `mockup/DIVERGENCIAS.md` com a medição que os obrigou. A leitura
> da 04 e da 05 que a sprint pediu **derrubou a premissa dela** — ver a entrega.
> Entrega: `docs/process/agentes/2026-09-06/GATILHOS-EM-TODOS-01-opus.md`.

> **ROTA — 06/09/2026, arrumação da leva (Fable, PO por delegação).** Esta sprint nasceu da
> definição de pronto dela — *"migrar tudo do gtk pro html … todas as features funcionando"* —
> medida contra o CSV da paridade: as linhas abaixo estavam `FALTA_NO_HTML` **sem nenhuma
> sprint aberta encarregada**. O enunciado de cada uma é a própria linha do CSV.

**Isto é o ponto 5 dela ("cada aba se lembrando das configs de cada controle dentro do perfil") do lado que ninguém mediu: o TERCEIRO controle.** Hoje o HTML grava um override por MAC; com "Todos" a GTK grava a seção GLOBAL do perfil, e é a global que um controle novo herda. O alvo de edição já existe (`app/alvo_de_edicao.py`, que é leitura aqui): o seletor `[Todos] [P1 · …]` da fita é o mesmo das outras abas. A mordida que importa: **um terceiro controle (dublê) ligado depois do "Todos" tem de herdar o efeito**; com override por MAC ele herda o nada. **E MEÇA a 04 e a 05 no mesmo ponto** (leitura, não posse): se o "Todos" delas também grava por MAC, é o mesmo defeito de produto — relate com endereço, e a cura vai para a ILUMINACAO-O-AVISO-DOS-N-01 e a VIBRACAO-O-QUE-SOBROU-01, que têm a posse.

---

## 1. AS LINHAS DO CSV QUE ESTA SPRINT FECHA — o enunciado é a linha

### Linha 110 — Editar em "Todos" — mexer no gatilho de toda a mesa de uma vez

* **O dono na GTK (reuse, não reescreva):** `src/hefesto_dualsense4unix/app/alvo_de_edicao.py · src/hefesto_dualsense4unix/app/actions/triggers_actions.py:368`
* **O que ele faz:** Três estados de alvo (`CONTROLE`, `TODOS`, `DESCONHECIDO`). Em `TODOS` a escrita vai para a seção GLOBAL do perfil e LIMPA o lado editado dos overrides por controle, espelhando a regra do backend.
* **Por que falta:** Com dois controles na mesa, pôr o mesmo efeito nos dois custa dois cliques em vez de um na GTK — e, mais importante, o perfil salvo pelo HTML fica com dois overrides por MAC em vez de uma seção global, o que muda o que acontece quando ela liga um TERCEIRO controle: ele herda a global (que o HTML nunca escreveu), não o efeito que ela configurou.


## AS REGRAS DESTA SPRINT — e são as da casa

1. **A linha do CSV é o enunciado.** `docs/data/paridade-gtk-html.csv` é o dono do fato;
   a coluna `gtk_onde` diz QUEM já faz isso no motor. **Você LÊ do dono e liga à tela** —
   reescrever a lógica em `interface/` é a segunda cópia, que é o defeito que onze réguas
   desta casa já tiveram. Se o dono precisar de um ajuste, ele é seu só se estiver na
   `posse:`; senão, RELATE.
2. **Texto de tela vem do glossário** (`docs/A-LINGUA-DESTA-CASA-…`): cabo/rádio, nunca
   usb/bt; "mesa" não entra; "serviço", não daemon. Frase nova é frase do DONO em `app/`
   (`app/textos_de_aplicacao.py`, `app/actions/*`) — o pacote a importa.
3. **Cada linha fecha com a MORDIDA da casa:** arranque a cura e a régua reprova. E com a
   PROVA DE TELA: foto `--oculta` antes e depois, e o clique de verdade pela ponte JS
   (`--prova-clique`/`--prova-gesto`), nunca o mouse dela.
4. **O CSV da paridade NÃO é sua posse.** Você entrega, no relatório, o texto pronto da
   linha (veredito · `sinal` que existe no CÓDIGO do lado HTML · `html_onde` · `html_faz`)
   — a PARIDADE-REMEDIR-02 recolhe no fim. O `sinal` tem de ser código, nunca prosa
   (`D-0609-O-SINAL-DA-PARIDADE-NAO-E-PROSA`).
5. **Se um passo esbarrar em decisão de produto**, decida como PO por delegação, registre
   em `docs/data/decisoes-dela.csv` com `quem_decidiu=delegacao` e REVERSÍVEL NUMA FRASE, e
   siga. Não pare.
6. A ordem de precedência (aparelho > mapa > sprint) está no preâmbulo do despachante.
