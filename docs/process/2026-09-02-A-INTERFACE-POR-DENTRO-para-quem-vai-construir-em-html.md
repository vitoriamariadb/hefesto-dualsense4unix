# A interface por dentro — para quem vai construir em HTML

**Escrito em 02/09/2026, e a razão é dela**, com estas palavras:

> *"cara, eu não entendo nada de html, eu fiz tudo em python e no gtk, quem vai
> realizar tudo vai ser o claude em html. por isso é importante vc dar o maximo <!-- noqa-acento: citação literal dela — a grafia não se corrige; o FATO sim -->
> de contexto."*

**QUEM LÊ ISTO É O PRÓXIMO CLAUDE**, e o contrato é: ela decide o que a tela
diz e o que o produto faz; **a construção em HTML é sua**. Ela não vai revisar
seu HTML linha a linha — ela vai OLHAR A TELA e dizer se está certo. Logo:
nenhuma decisão de HTML pode virar pergunta para ela. Decida, meça, e mostre.

---

## 0. ANTES DE VARRER ARQUIVO POR ARQUIVO: EXISTE UM GRAFO

**Construído em 02/09/2026, a pedido dela.** O repositório tem um ÍNDICE DE
CÓDIGO em `.code-review-graph/` — e ele responde em segundos o que um `rg` em
1405 arquivos leva minutos para dizer errado.

```
1405 arquivos · 32.596 nós · 227.832 arestas · 356 MB
importes resolvidos: 3.149 (zero ambíguos)
CALLS com evidência: 15.639 · TESTED_BY: 12.125
```

**COMO USAR:** com o grafo presente, o servidor MCP de consulta sobe e as
ferramentas dele ficam disponíveis. **Prefira-as** para tarefa de mapeamento ou
de revisão — "quem chama isto", "o que este módulo alcança", "que teste cobre
esta função". Sem grafo o servidor nem sobe.

**COMO (RE)CONSTRUIR:** `fazer_grafos` no terminal (ou `/fazer-grafos` na
sessão), da raiz do repositório. Leva ~1 min. Ele é DERIVADO e está no
`.gitignore:128` — não versione, reconstrua.

**QUANDO RECONSTRUIR:** depois de uma leva grande, ou quando uma consulta
devolver algo que você sabe que mudou. Um grafo velho responde com confiança
sobre um código que não existe mais — que é o pior tipo de resposta.

**O QUE ELE NÃO SUBSTITUI:** medir. O grafo diz quem chama quem; ele não diz se
o produto FAZ. As três armadilhas da §10 deste documento passariam ilesas por
qualquer consulta ao grafo — foram achadas rodando, clicando e fotografando.

---

## 1. A ARQUITETURA EM UMA FIGURA

```
 mockup/NN-*.html          ← A BANCADA. O desenho que ela aprova. `onde.BANCADA`
      │                      Quem escreve: os geradores. Quem olha: ELA.
      │  scripts/check_o_desenho_aprovado.py --publicar NN   ← ATO DELA
      ▼
 src/…/interface/paginas/NN-*.html   ← O PUBLICADO. `onde.PUBLICADO`
      │                                É o que o produto RENDERIZA.
      ▼
 WebKit2.WebView dentro de uma Gtk.Window     ← hefesto_vivo.py, o PILOTO
      │  injeta o BOOTSTRAP (JS) e chama window.__hef.pintar(carga)
      ▼
 interface/pacotes/aNN_*.py    ← os PACOTES: quem PINTA e quem AGE
      │  @registrar(pagina) → devolve a carga · @gesto(pagina, nome) → o clique
      ▼
 interface/pacotes/ponte.py    ← a PONTE: fala com o daemon por IPC
      ▼
 o daemon (systemd --user), que é quem toca o aparelho
```

**Dez abas, dez geradores** (`interface/aba01.py` … `aba10.py`), **dez pacotes**
(`interface/pacotes/aNN_*.py`). Um por aba, sem exceção.

---

## 2. O VOCABULÁRIO DE ENDEREÇO — o coração de tudo

O HTML **não** tem lógica. Ele tem ENDEREÇOS, em atributos `data-*`, e o piloto
os lê. É isso que permite a tela ser desenho e produto ao mesmo tempo.

| atributo | para que serve | quem usa |
| --- | --- | --- |
| `data-campo` | **recebe valor pintado**. É o endereço de escrita. | pintura |
| `data-gesto` | **é clicável**. O nome do gesto que o pacote implementa. | ação |
| `data-controle` / `data-uniq` | de QUAL controle é esta região | os dois |
| `data-linha` | uma linha de tabela, endereçada por nome | pintura |
| `data-papel` | o papel semântico do nó (P1, P2…) | pintura |
| `data-hef` | um bloco inteiro que o piloto substitui por HTML novo | pintura |
| `data-hef-alvo` | onde o valor do gesto vai (`valor`, `texto`…) | ação |
| `data-hef-forma` | o gesto recolhe a FORMA em volta antes de agir | ação |
| `data-hef-rolar` | rola até aqui depois de pintar | pintura |
| `data-hef-gesto` | gesto declarado num elemento que não é botão | ação |
| `data-lado`, `data-modo`, `data-rota`, `data-sensor`, `data-forca`, `data-mudo`, `data-player`, `data-conectado`, `data-mic-modo`, `data-v` | qualificadores de domínio | conforme a aba |

**A REGRA QUE VOCÊ NÃO PODE QUEBRAR**, e ela é do próprio gerador:

> *"Um campo com gesto e sem pintura é pior que os dois faltando: o clique grava
> e a tela continua mostrando o padrão do desenho, então o segundo clique parece
> o primeiro."*

Campo novo nasce com os DOIS: `data-campo` (para você pintar o valor de volta) e
`data-gesto` (para o clique agir). Um sem o outro é defeito, não meio caminho.

---

## 3. COMO SE PINTA UMA ABA

O pacote registra uma função de pintura. Ela recebe o contexto (o estado do
daemon já lido) e devolve uma CARGA — um dicionário que o BOOTSTRAP aplica.

```python
from . import Contexto, registrar

@registrar("04-iluminacao.html")
def pintar(ctx: Contexto) -> dict:
    return {
        "campos": {"brilho": "80%"},                 # data-campo="brilho"
        "linhas": {"bateria": "72%"},                # data-linha="bateria"
        "mesa":   [{"uniq": "…", "campos": {...}}],  # por controle
        "blocos": {"#lista": "<li>…</li>"},          # HTML inteiro, por seletor
    }
```

**O piloto conta o que pintou.** Rodando o passeio, ele imprime `pinturas` e
`valores` por aba — e é assim que você prova que a aba está VIVA:

```bash
.venv/bin/python src/hefesto_dualsense4unix/interface/hefesto_vivo.py \
    --oculta --passear --parada 1200 --segundos 20
```

Medido em 01/09: 9 das 10 abas pintando, 184 valores num passeio.

**`PISO_DA_ABA`** declara quantos valores a aba tem de pintar no mínimo. É o que
impede uma aba de emagrecer sem ninguém ver.

---

## 4. COMO SE LIGA UM BOTÃO

```python
from . import Contexto, gesto

@gesto("08-conexoes.html", "tirar-daqui")
def tirar_daqui(ctx: Contexto, o: dict, ponte) -> dict | None:
    uniq = o.get("uniq")
    if not uniq:
        raise ValueError("este gesto é de um controle, não da mesa")
    if not ponte.chamar("device.forget", uniq=uniq):
        raise RuntimeError("o daemon recusou — o controle está no cabo?")
    return {"mesa": [...]}          # devolver pinta na hora
```

Três coisas que o contrato exige:

1. **`ValueError` = clique inválido** (faltou o alvo). **`RuntimeError` = o
   produto recusou**, e a mensagem VAI PARA A TELA — escreva-a para quem está
   com o controle na mão, não para quem lê log.
2. **Recusar dizendo é obrigatório.** Um botão que aceita o clique e não faz
   nada é o defeito mais caro desta casa. Se o produto não faz, o gesto levanta
   com o motivo.
3. **O que o gesto devolve é PINTADO na hora**, sem esperar o próximo tique.

O guia passo a passo está em
`src/hefesto_dualsense4unix/interface/pacotes/COMO-LIGAR-UMA-ABA.md`.

---

## 5. A PONTE — como se fala com o daemon

`interface/pacotes/ponte.py`, em três degraus de reuso, nesta ordem:

1. `ipc_bridge` — o caminho do produto, com o motor GTK inteiro por trás
2. o CLI — quando o primeiro não serve
3. `chamar(metodo, **kw)` — IPC cru, o último recurso

**Nunca invente um quarto caminho.** Se o dado que você quer não chega, o
problema é o daemon não publicá-lo — e isso é trabalho no daemon, não um
atalho na interface.

`ponte.daemon_state_full()` devolve o estado inteiro. É leitura pura e pode ser
chamada à vontade, inclusive fora da janela:

```python
import sys; sys.path.insert(0,'src'); sys.path.insert(0,'src/hefesto_dualsense4unix/interface')
from pacotes import ponte
st = ponte.daemon_state_full() or {}
```

---

## 6. A BANCADA E O PUBLICADO — e por que publicar é ATO DELA

```
onde.BANCADA   = <raiz>/mockup           ← ela olha aqui
onde.PUBLICADO = src/…/interface/paginas ← o produto lê aqui
```

Os geradores (`interface/aba01.py` … `aba10.py`) escrevem na **BANCADA**. O produto só recebe
por `scripts/check_o_desenho_aprovado.py --publicar NN`, e isso acontece **depois
do OK dela na aba inteira**.

**Palavra dela, 31/08:** *"primeiro nunca terminamos o mockup, por isso não era
pra ser feito no layout final. Vamos concluir lá e depois seguimos pra
interface."*

**O QUE ISSO SIGNIFICA PARA VOCÊ:** se o seu trabalho exige HTML novo, você
escreve na bancada e DECLARA a divergência em `mockup/DIVERGENCIAS.md`. Não
publique. O portão `desenho-aprovado` reprova divergência não declarada.

---

## 7. COMO OLHAR A TELA SEM ATRAPALHAR ELA

**Ela tem UMA tela.** Janela que nasce visível quebra o que ela está fazendo.
`--oculta` usa `Gtk.OffscreenWindow` e não aparece.

```bash
# abrir uma aba e fotografar
… hefesto_vivo.py --oculta --abre 08-conexoes.html --segundos 9 --foto /tmp/x.png

# clicar UM gesto e medir o que o daemon respondeu
… hefesto_vivo.py --oculta --abre 08-conexoes.html --prova-clique "luz-nao-acende"

# clicar CADA gesto da aba, um por vez
… hefesto_vivo.py --oculta --abre 08-conexoes.html --prova-no-aparelho

# passear pelas dez e medir a pintura
… hefesto_vivo.py --oculta --passear --parada 1200
```

**Leia os PNG.** A ferramenta de leitura enxerga imagens — é mais rápido e mais
fiel que qualquer alternativa. E nunca clique por coordenada para focar janela:
já caiu noutro aplicativo duas vezes e desfez configuração dela.

**A armadilha que esta casa já pagou:** o `--prova-gesto` dava VERDE sobre dois
botões mortos (nunca clicava o do microfone nem o do alto-falante). Uma
validação de interface que não cobre o botão novo é uma validação que mente.

**E ela tem de viver no TEMPO.** Uma régua que roda o tique uma vez mede um
INSTANTE. Em 29/08 uma leva introduziu regressão que só aparecia aos **181
segundos**, com 67 testes verdes.

---

## 8. OS PORTÕES QUE OLHAM A INTERFACE

Dos 30, estes são os que reprovam trabalho de tela:

| portão | o que ele cobra |
| --- | --- |
| `casa-sabe` | cura escrita e nunca ligada — inclusive nos módulos da interface |
| `portao-tem-chamador` | régua que ninguém roda |
| `desenho-aprovado` | bancada × publicado, com as divergências declaradas |
| `fatos-de-tela`, `fala-de-tela`, `frases-de-tela`, `palavra-de-tela` | o que a tela AFIRMA tem de ser verdade |
| `regua-de-tela` | os instrumentos de tela existem e são chamados |
| `pecas-do-dualsense`, `cores-do-dualsense` | o desenho do controle e as cores do plástico |
| `acentuacao` | português do Brasil, com acento, inclusive no HTML |

---

## 9. O QUE ELA DECIDE E O QUE VOCÊ DECIDE

**DELA, sempre:**
- o TEXTO da tela (rótulo, dica, frase de recusa)
- o DESENHO (o que aparece, onde, em que ordem)
- PUBLICAR da bancada para o produto
- o que o produto FAZ (a feature)

**SUA, sempre — e não pergunte:**
- como o HTML é estruturado
- qual atributo de endereço usar
- como o pacote pinta e como o gesto age
- que régua escrever e o que ela morde
- como medir

**A regra que decide o meio-termo:** se a pergunta é *"o que ela vai VER"*, é
dela. Se é *"como isso funciona por dentro"*, é sua.

---

## 10. AS TRÊS ARMADILHAS QUE MAIS CUSTARAM NA INTERFACE

1. **Os dez geradores morreram calados.** Depois da mudança de `layout/` para
   `src/`, TODOS os dez pararam de rodar e nada detectou — porque o portão do
   desenho compara dois arquivos congelados, e os dois estavam igualmente
   velhos. **Rode os dez** depois de mexer em gerador.
2. **`# noqa-acento` virou título visível.** Um marcador de portão apareceu como
   texto na tela, em quatro colunas da aba Gatilhos. O que você escreve num
   gerador SAI NA TELA.
3. **A tela prometia o que o produto não fazia** — dois velocímetros onde o
   produto tem um, faixas "de 1 a 10" para intervalos de 1–12 e 1–5, e três
   regiões de touchpad com ações que o produto não executa. **Toda frase da tela
   é uma afirmação, e há portão que a cobra.**
