---
sprint: MIGRA-PERFIS-02
estado: absorvida
onda: PERFIS
posse:
  MP2:
    - src/hefesto_dualsense4unix/interface/aba10.py
cria:
  - tests/unit/test_migra_perfis_02_todo_valor_tem_endereco.py
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/
  - scripts/gui-captura/retratar_abas.py
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 10). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA PERFIS · 02 — todo valor ganha endereço

**O defeito:** `layout/10-perfis.html` tem **zero** `id=`, **zero**
`data-`, **zero** `<script>` — os únicos três ids do arquivo (`flameIn`,
`flameOut`, `ring`) são do logo da moldura. **Não há por onde o Python alcançar
nenhum dos dezenove valores da tela**, e os treze gestos são HTML inerte. Um
`run_javascript` que não tem seletor não pinta; um `postMessage` que não tem
elemento não chega.

**A cura muda atributo, e atributo não muda pixel.** Mas é mudança no gerador
aprovado, e por isso está aqui como sprint declarada, não como detalhe de
execução de outra.

**Esta sprint pode correr do primeiro minuto** — é a única das seis que não toca
`src/` e não espera a **01**.

## O contrato de endereço

Um atributo só, `data-hef`, com o nome do valor em pontos. **O nome do atributo
é da moldura, não desta aba:** se a sprint da moldura já tiver escolhido outro
prefixo quando esta for executada, o executor usa o dela — o que não se admite é
esta aba inventar um segundo padrão.

| # | O valor na tela | Endereço | Já é lido hoje? |
|---|---|---|---|
| 1 | "N perfis" (a conta do topo) | `perfis.conta` | **sim** |
| 2 | "N de M controles com ajuste próprio neste perfil" | `perfis.com-ajuste` | não |
| 3 | o corpo da lista | `perfis.lista` (no `<tbody>`) | **sim** |
| 4 | o nome de cada perfil | `<tr data-hef-perfil="…">` | **sim** |
| 5 | a prioridade na lista | `perfis.linha.prioridade` | **sim** |
| 6 | a coluna "Quando usar" | `perfis.linha.quando` | **sim** |
| 7 | qual linha é a ativa | `class="ativo"` na `<tr>` (já existe) | **sim** |
| 8 | a dica da linha (a disputa inteira) | `title` da `<tr>` | **sim** |
| 9 | Nome (campo) | `editor.nome` | **sim** |
| 10 | Prioridade (o trilho e o número) | `editor.prioridade` / `editor.prioridade.n` | **sim** |
| 11 | Funciona em | `editor.ambiente` | **sim** |
| 12 | Nome do jogo | `editor.jogo` | **sim** |
| 13 | Estilo de Jogo | `editor.estilo` | **não existe em lugar nenhum** |
| 14 | o corpo da tabela "Ajuste próprio" | `guarda.linhas` (no `<tbody>`) | não |
| 15 | o rótulo curto de cada controle | `<tr data-hef-uniq="…">` + `guarda.nome` | não |
| 16 | a cor do plástico da linha | `style="--plastico:…"` (já existe) | não |
| 17 | os quatro grupos de ajuste, acesos/apagados | `guarda.secao` + `data-hef-secao="leds\|triggers\|rumble\|speaker"` | não |
| 18 | o "N de 4" (hoje só no `title` da linha) | `title` da `<tr>` | não |
| 19 | o ID da peça | `guarda.id` | não |

**Dez dos dezenove já são lidos e pintados hoje** (`load_all_profiles`, a
seleção do ativo e os quatro campos do editor). É o que torna esta aba barata
do lado do dado — e cara do lado do gesto, que é a **05**.

O **rodapé** (Aplicar · Salvar Perfil · Importar · Exportar, e o recibo) é da
**moldura**: ele vive em `src/hefesto_dualsense4unix/interface/fim.html`, é o mesmo nas dez
abas, e tem classe (`r-salvar`, `recibo`) mas nenhum `data-hef`. **Esta sprint
não o toca** — endereçá-lo uma vez para as dez é da moldura, e endereçá-lo aqui
criaria a décima cópia do mesmo problema.

## O que entrega

1. **`aba10.py` emite `data-hef`** em cada um dos dezenove, nas funções que já
   montam o HTML: `linha_do_controle` (os cinco da tabela), o bloco `MIOLO` (os
   campos do editor e as contas do topo) e a compreensão que monta as linhas de
   `PERFIS`.
2. **Os dois `<tbody>` ganham endereço próprio** (`perfis.lista` e
   `guarda.linhas`), porque é o `<tbody>` inteiro que o Python vai reescrever —
   um perfil a mais ou um controle a menos não é "trocar um texto", é trocar a
   lista.
3. **A chave da linha é a chave do dado.** A `<tr>` do perfil carrega o **nome**
   (que é o identificador que `load_all_profiles` devolve) e a `<tr>` do
   controle carrega o **`uniq`** — que é exatamente a chave de
   `Profile.controllers` (`profiles/schema.py:1008`, canonizada em `:1114`).
   Endereço que não é a chave do dado obriga a inventar uma tradução, e a
   tradução é onde nasce a segunda verdade.
4. **O HTML é regerado** (`src/hefesto_dualsense4unix/interface/regerar.py`) e a foto do
   Chrome é conferida contra a de antes.

## Como se prova (a mordida)

`tests/unit/test_migra_perfis_02_todo_valor_tem_endereco.py`:

- **os dezenove existem**: o teste **LÊ o HTML gerado** e procura os dezenove
  endereços da tabela acima. Ele não recebe a lista por parâmetro nem a digita
  duas vezes — a lista mora **no teste**, e o alvo é o arquivo. Tire um
  `data-hef` do gerador, regere, e o teste reprova nomeando qual faltou.
- **A RÉGUA NÃO PODE DIGITAR O QUE DEVE LER.** Em 26/08, **onze** réguas
  reprovaram a melhora em vez do defeito, todas pela mesma forma: digitavam o
  número que deviam ler. Aqui isso vira: nada de comparar o HTML contra uma
  cópia do HTML. A pergunta é *"este endereço existe e é único?"*, não *"o
  arquivo é igual ao que eu guardei"*.
- **cada endereço é único**: `data-hef` repetido é o defeito silencioso desta
  rota — o `querySelector` pega o primeiro e pinta o valor errado num lugar
  plausível. Conte as ocorrências: os dezenove valem 1, e as duas famílias de
  linha (`data-hef-perfil`, `data-hef-uniq`) valem uma por linha.
- **ZERO PIXEL MUDOU**, e esta é a mordida que importa: renderize o HTML de
  antes e o de depois no **mesmo** motor e compare as imagens. Diferente de
  zero, reprova. Uma régua que só conte atributos aprovaria alguém que trocasse
  uma classe junto.
  **Cuidado medido (27/08):** o `scrollIntoViewIfNeeded` do Playwright **rola
  antes de medir** e cega toda medição de layout feita depois — foi assim que um
  portão deu verde sobre uma linha fora da caixa. Fotografe a página inteira,
  não elemento por elemento.
- **o motor de verdade também**: a mesma comparação no `WebKit2.WebView`, com
  `select{appearance:none}` e `.nota{display:none}` aplicados como o `ver.py`  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->
  aplica (`src/hefesto_dualsense4unix/interface/ver.py:66-90`). O Chrome sozinho não prova  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->
  nada sobre a tela dela.

## O que é dela decidir

- **A PRIORIDADE NÃO É EDITÁVEL NO MOCKUP, E ELA PEDIU QUE FOSSE.** Palavra
  dela, 27/08: *"prioridade é slicer"*
  (`src/hefesto_dualsense4unix/interface/CORRECOES-DELA.md`). O mockup desenha
  `<span class="trilho"><span class="cheio" style="width:90%">` — um desenho,
  não um controle: **não há como arrastar**. Hoje o produto tem uma
  `Gtk.Scale` de verdade (`profile_priority_scale`, seis `self._get()`), e o
  gesto de mexer nela arma a guarda `SALVAR-NAO-REBAIXA-02`
  (`_on_prioridade_tocada`, `profiles_actions.py:4081`). **Migrar como está é
  perder a única forma de mudar prioridade na janela.**
  A cura é um `<input type="range">` vestido com o CSS do trilho — e vestir um
  `range` para ficar **idêntico** ao desenho aprovado é trabalho de pixel, não
  de atributo. **Por isso ele não entra nesta sprint:** ou ela aprova a troca
  vendo as duas fotos lado a lado, ou aprova uma diferença visível. Sem a
  palavra dela, a **05** não tem onde ligar o gesto.
- **As duas fontes vêm da internet.** O mockup carrega `fonts.googleapis.com`
  (Space Grotesk + JetBrains Mono) e **todo o layout foi medido com elas**. As
  duas estão instaladas nesta máquina e `gui/theme.css:65` e `:124` já as nomeia
  — logo a cura é tirar o `<link>` —, mas **trocar a origem da fonte é REMEDIR,
  não presumir**. Vale para as dez abas e no Flatpak vira também permissão de
  rede: é da **moldura**, e esta sprint só o registra.
