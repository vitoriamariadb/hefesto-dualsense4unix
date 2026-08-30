# O POSTO DE COMANDO — o que está em voo, e o que fazer se o contexto sumir

> **O estado medido do projeto cabe em cinco minutos:**
> [O QUE É VERDADE HOJE](2026-08-29-O-QUE-E-VERDADE-HOJE.md). Leia-o antes deste arquivo se o que você
> precisa é o que é fato, o que é dívida e o que já foi curado.

**29/08/2026, escrito com a conversa em 99% do contexto.** Pedido dela:

> *"salvar nossa conversa no novo repo pq agora por exemplo tá em 99% do contexto,
> pelo que o projeto andou acho que vamos perder tudo (…) resume o seu contexto
> também pra ir coordenando tudo."*

Este arquivo é a memória de quem coordena. Se a conversa for compactada ou
morrer, **quem assumir lê isto e continua sem perguntar nada a ela.**

---

## 1. AS TRÊS LEVAS ATERRISSARAM — 29/08, 18h30

| Leva | O que entregou | Onde |
|---|---|---|
| **A aba Controles viva** | **O PILOTO, e ele RODA.** A aba nasce da mesa dela — dois controles, bateria, giroscópio lendo. Custa **1,0% do orçamento do tique**. **CORRIGIDO em 29/08/2026, e as duas correções são de quem coordenou:** (a) esta linha dizia *"cor do plástico"* entre o que a aba lê da mesa, e a foto que a sustentava foi tirada com `--cor-duble` — um dublê que não manda byte nenhum (`controles_vivos.py`, `--cor-duble`). No instante daquela foto o produto NÃO lia a cor: `ler_pelo_cabo` devolvia `None` nos dois controles, por permissão de nó (BROKER-01). A cura entrou mais tarde no mesmo dia (`A-COR-PELA-PORTA-DO-BROKER-01`) e pelo cabo a leitura passou a acontecer — **mas o piloto continua sem prova disso, porque a foto que existe é a do dublê.** Refotografar com a leitura viva é trabalho, não conclusão. (b) "a aba nasce da mesa dela" é a AMOSTRA MAIS FAVORÁVEL que existe, e a régua desta casa é `D-A-REGUA-E-QUALQUER-MESA-NAO-A-DELA` (decidida por ela em 29/08): o piloto só está provado quando passar com 0, 1, 3 e 5 controles, e com um controle SEM MAC de 12 hex — que é o usuário para quem `identity.py` dá slot volátil e a memória por identidade nunca funciona | `novo-layout/_ferramentas/controles_vivos.py` |
| **Materializar a migração** | **109 sprints** em dez ondas, dez índices, uma por aba | `docs/process/sprints/2026-08-29-MIGRA-*` |
| **O caminho até a conclusão** | as 6 faixas da fila medidas contra o disco | `docs/process/2026-08-29-O-CAMINHO-ATE-A-CONCLUSAO.md` |
| **A ordem entre as dez abas** | a espinha que nenhuma onda podia escrever (cada uma só via a sua) | `docs/process/sprints/2026-08-29-MIGRA-A-ORDEM-das-dez-abas.md` |

**A mordida do piloto foi rodada e ela morde:** com `--sem-ponte`, **nenhum** valor
escrito; com a ponte, **125 valores e 30 voltas** em 3 segundos.

**Como ela vê:**

```bash
novo-layout/_ferramentas/controles_vivos.py     # a aba Controles, com a mesa dela
```

**Se um workflow morreu sem entregar:** o transcrito de cada agente fica em
`~/.claude/projects/*/subagents/workflows/wf_*/journal.jsonl`, uma linha por
agente com o valor devolvido. Leia o journal **antes** de concluir que algo se
perdeu.

---

## 2. A DECISÃO QUE MANDA EM TUDO, e ela é de hoje

**A interface nova é o mockup HTML rodando num `WebKit2.WebView` dentro da janela
GTK3.** `D-A-INTERFACE-NOVA-E-O-MOCKUP-DENTRO-DE-UMA-JANELA-GTK`.

Duas rotas foram provadas com a mesma régua. O que decidiu **não foi fidelidade**
— foi **acompanhar a mudança**:

- **o gerador emitindo GTK**: desenho impecável (0,4% de tinta perdida, 0 de 28
  regiões), mas mudou-se uma linha do mockup e a foto GTK saiu **byte-idêntica**.
  Custo real medido: **500–700 linhas por aba**. **Reprovada.**
- **o WebKit**: acompanha por construção; as **dez** abas carregam com o `.quadro`
  e o rodapé iguais ao Chrome **ao pixel**; as duas pontes custam **31 linhas, uma
  vez**; `:hover`, Tab e Enter reais fotografados. Convivência com o GTK3 medida —
  os dois no mesmo processo, webview enxertado no `main.glade` real. Preço:
  **62 → 285 MiB PSS**. No Flatpak, **zero byte**. **Escolhida.**

**A primeira sprint de todas, e ainda não foi medida:** o enxerto **substitutivo**.
O provado foi **aditivo** (uma 12ª página); ninguém mediu **trocar** uma página.

---

## 3. O QUE ELA MANDOU, E EM QUE ORDEM

1. **A aba Controles completamente funcional** — é o piloto. Palavra dela:
   *"Preciso avaliar como ela se comporta. Depois dou o ok pra seguirmos
   materializando a ordem pra fazermos todas as abas funcionarem no novo motor."*
   **As sprints das outras nove se ESCREVEM; a execução espera o ok dela.**
2. **A mesa tem de ser a dela.** Ela tem **dois** controles e o mockup desenha
   quatro. *"o layout se adapta a medida dos controles que eu tenho (…) e se eu
   comprar outros dualsense eles aparecem também seguindo a lógica que montamos no
   `mapa-do-controle.html`."*
3. **Os botões da janela seguem o estilo do COSMIC** — resolvido com
   `Gtk.HeaderBar` no `ver.py`; sem ela a decoração vinha do compositor e os
   botões saíam à esquerda.

---

## 4. COMO ELA VÊ A INTERFACE NOVA, hoje

```
novo-layout/_ferramentas/ver.py        # abre na Jogar; a tira do desenho navega
novo-layout/_ferramentas/ver.py 02     # abre já na Controles
```

Um `WebView`, uma `HeaderBar`, e **nada de `Gtk.Notebook`** — a primeira versão
punha um por cima e ela viu as abas duas vezes na hora. A tira do mockup já é
`<a href="02-controles.html">`, ou seja, **ela já navega**.

Duas curas aplicadas ali, e as duas são preço conhecido da rota:
`.nota{display:none}` (o caderno de decisões não é tela) e
`select{appearance:none}` (senão o WebKitGTK pinta caixa branca — são **117**
`<select>` nas dez abas).

---

## 5. O QUE ESPERA A PALAVRA DELA

| O quê | Onde |
|---|---|
| **O ok sobre o piloto** (a aba Controles) | trava a execução das outras nove |
| **A remedição dos dois vpads com máscaras diferentes** | ela disse que já funcionou; o registro não existe, e destrava a máscara por controle |
| **Os 84 filtros mortos** | cura pronta, muda 1,09% do desenho que ela aprovou (o contorno do touchpad). `/tmp/filtro-LADO-A-LADO.png` |
| Os 22 rótulos minúsculos das pop-ups da Navegação | complementos, não rótulos — não é o padrão que ela apontou |
| `SUBIR_REABRINDO_O_JOGO` sem executor | a escada nunca **arma** o Nativo nem o Steam Input; fechá-lo mexe no ramo *"o perfil manda"* |

---

## 6. O QUE ESTA SESSÃO PAGOU PARA DESCOBRIR — não remeça

**Sobre o WebKit (série 4.1, que é a de GTK 3):**
- **quatro pinos obrigatórios**: `Gtk 3.0`, `Gdk 3.0`, `GdkPixbuf 2.0`,
  `WebKit2 4.1`. Com o GTK4 ao lado, um `import Gdk` sem pino carrega o 4.0 e mata
  o Gtk 3.0. Só dispara se o `Gdk` vier **antes** do pino do `Gtk`;
- **`FINISHED` dispara depois de `load-failed`** — o WebKit commita uma página de
  erro. Quem escuta só FINISHED **reporta sucesso sobre carga que falhou**;
- **`get_title()` no handler de FINISHED devolve vazio** — o título chega depois.
  Nove de dez abas voltaram sem título para quem mediu assim;
- a 4.1 tem **as duas** APIs (`run_javascript` e `evaluate_javascript`); o
  `register_script_message_handler` leva **um** argumento (na 6.0, dois);
- **on-screen custa o mesmo que offscreen**, e nem com compositing forçado nasce
  um terceiro processo.

**Sobre o mockup:**
- **84 filtros mortos** em cinco abas: o `monta.py:439` prefixa os ids do SVG e
  não reescreve o `url()` porque o desenho usa `&quot;` escapado. O Chrome ignora
  e desenha; o WebKit segue o SVG 1.1 e **não desenha**. O contorno do touchpad
  **nunca apareceu, em motor nenhum**;
- `novo-layout/` é `.gitignore:108` — **não viaja** em worktree nem no pacote.

**Sobre o instrumento — seis réguas falsas em quinze horas:**
1. a régua do emissor GTK só checava *"há 50px de plástico e de laranja"*, e o
   comentário admitia *"Ela passaria se o controle virasse um retângulo"*;
2. um instrumento decidia o que medir **pela primeira palavra do título**;
3. um censo de cor perguntava *"há quatro cores distintas?"* e dizia **sim** com o
   defeito ativo — o bug não apaga a cor, **muda de lugar**;
4. a checagem do `install.sh` dizia que *importar* provava que a biblioteca
   carrega — não prova; quem prova é **tocar um símbolo**;
5. o teste que a cobria quebrava no import, não na chamada;
6. a régua de pop-up comparava o rodapé com a viewport do navegador.

**E a lição que vale para toda régua:** *uma régua que roda o tique uma vez mede um
INSTANTE, não um comportamento.* Foi assim que uma leva de hoje introduziu uma
regressão que só aparecia **181 segundos depois**, com 67 testes verdes.

---

## 7. AS REGRAS QUE MAIS CUSTARAM HOJE

- **A árvore dela é `dev` e não se troca de branch nela.**
- **Nunca `install.sh`** fora da máquina dela: reescreve caminhos únicos e faz
  `systemctl --user restart`.
- **Nunca `git stash`** numa árvore com agentes em voo — aconteceu hoje, foi
  declarado, e nada se perdeu por sorte.
- **Nenhum perfil dela se escreve** enquanto o produto está rodando.
- **Janela só no workspace `OS`**, por `aurora-claude-workspace.sh run`, ou
  `Gtk.OffscreenWindow`. Exceção: o `ver.py`, que **ela** manda abrir.
- **Não rodar a suíte enquanto agentes editam a árvore** — a instabilidade lê
  como regressão.

---

## 8. A QUEIXA DELA SOBRE O PRAZO, e o fato

> *"sinto que nada tá dentro do chrono imaginado."*

O balanço de 28/08 mediu o desconfortável: o trabalho **cresceu 28%** (de 279 para
358 unidades) porque medir revelou trabalho que ninguém tinha contado — as **139
filhas**, sprints que produzem outras sprints. **Ninguém estava atrasado em
relação a um plano; o plano é que não conhecia o tamanho do trabalho.**

E a régua que encurta de verdade **não é a interface**: a Faixa 5 (o aparelho)
tem 34 sprints e **97 das 139 filhas**, e **27 delas são bancada dela**. O
documento `2026-08-29-O-CAMINHO-ATE-A-CONCLUSAO.md` encara isso de frente e
propõe o que **cortar**.

---

## 9. O COMANDO QUE NÃO ENVELHECE

```bash
git log --since=midnight --format='%h %s'        # o que esta casa fechou hoje
git worktree list                                # as árvores, e em que branch cada uma
bash scripts/portoes.sh                          # os 28 · linha de base: 1 vermelho
                                                 #   (referencias-docs, 9 linhas, herdado)
python3 -c "import csv;print(sum(1 for _ in csv.reader(open('docs/data/decisoes-dela.csv')))-1)"
```

**119 decisões dela** no fim deste dia. **Dez commits** em `dev`. Os dois retratos
do dia: `2026-08-28-ONDE-PARAMOS-*` e `2026-08-29-ONDE-PARAMOS-*`.
