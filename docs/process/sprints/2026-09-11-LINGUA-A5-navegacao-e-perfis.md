---
sprint: LINGUA-A5
estado: feita
onda: A-LINGUA-DA-TELA
posse:
  LINGUA-A5:
    - src/hefesto_dualsense4unix/interface/aba06.py
    - src/hefesto_dualsense4unix/interface/pacotes/a06_navegacao.py
    - mockup/06-navegacao.html
cria: []
bancada: false
depois_de: []
nao_toca:
  - install.sh
---

> **ESTADO 12/09/2026: feita** — medido com `git cherry` contra
> `onda/0911c`: `voo/LINGUA-A5-opus` e `voo/APLICA-A5-opus` não tem um único commit fora da costura.
> O carimbo não é de quem entregou; é da MEDIÇÃO. Quatro irmãs desta
> mesma leva continuam `aberta` justamente por falharem nela.

# LINGUA-A5 — a língua da aba Navegação e da aba Perfis

Nasce da **A SEGUNDA LISTA DELA** (11/09/2026) — o índice está em
`docs/process/sprints/2026-09-11-A-SEGUNDA-LISTA-DELA-a-lingua-da-tela-e-a-paridade-INDICE.md`.

---
**A ABA PERFIS SAIU DESTA POSSE, e isso é coordenação, não
esquecimento:** a C4 está reescrevendo os dois campos dela (o «Nome do Jogo» e
o «Funciona em:») e a E1 vai mexer no que a lista mostra. Duas frentes no mesmo
arquivo é a costura virando «a última a gravar vence».

**ENTÃO VOCÊ FAZ A NAVEGAÇÃO NO CÓDIGO, E A PERFIS SÓ NA TABELA.** Para a
Perfis, entregue a proposta LENDO a página publicada
(`src/hefesto_dualsense4unix/interface/paginas/10-perfis.html`) — sem abrir o
`aba10.py` para editar. A tabela é a entrega; quem aplica sou eu, depois que as
outras duas frentes fecharem.

A Navegação é a aba do mouse e do teclado pelo controle, e o vocabulário dela é
o mais técnico do produto: aceleração, zona morta, curva, repetição.

## O QUE ENTREGAR — e é PROPOSTA, não commit de tela

**Ordem dela:** *"Pra apresentarem as propostas tá bom?"*  <!-- noqa-acento: citação literal dela -->

Você **NÃO** troca frase no gerador. Você entrega, em
`docs/process/agentes/2026-09-11/LINGUA-A5-opus.md`:

1. **A FOTO DO ANTES**, na vista dela (1918x840), de cada aba desta frente.
2. **A TABELA**, uma linha por texto, e ela é o coração da entrega:

   | onde (arquivo:linha) | o que a tela diz hoje | proposta | por quê |

   Cobre **todo texto que a pessoa LÊ**: rótulo, botão, selo, dica (`title`),
   frase de estado, recado de erro, cabeçalho de tabela, texto de legenda.
3. **A CONTA**: quantos caracteres a aba tem hoje e quantos teria com a
   proposta inteira aplicada.
4. **O QUE VOCÊ NÃO PROPÔS E POR QUÊ** — a frase que parece ruim e não é.

## O CRITÉRIO, e ele vem dela

> *"a ideia da interface como um todo é ter menos texto sempre e ser mais*  <!-- noqa-acento: citação literal dela -->
> *precisa e direta sempre."*  <!-- noqa-acento: citação literal dela -->

> *"toda mensagem de tooltip (…) deveria ser reduzida e ficar intuitiva e*  <!-- noqa-acento: citação literal dela -->
> *direta ao ponto."*  <!-- noqa-acento: citação literal dela -->

E o porquê, que decide os empates: ela quer o produto **traduzível** depois.
Uma frase que só funciona em português — trocadilho, ordem invertida, ironia,
metáfora de bancada — é dívida, ainda que esteja certa.

**As cinco perguntas que toda linha da tabela responde:**

1. **A frase diz o que ACONTECE quando se clica?** Se ela explica a mecânica
   interna em vez do efeito, está errada.
2. **Cabe numa respiração?** Uma dica de três linhas não é lida.
3. **Ela sobrevive à tradução?** Se um tradutor precisar do contexto desta
   casa para acertar, reescreva.
4. **Ela repete o que já está na tela?** Selo, contagem e rótulo já dizem
   coisas — a dica que os repete é ruído.
5. **Ela confessa dívida nossa?** Se sim, ela sai — decisão dela de 07/09, com
   portão (`scripts/check_a_tela_nao_confessa.py`).

## O QUE NÃO FAZER

* **Não acrescente feature, tela, botão nem campo.** Palavra dela: *"A ideia
  não é adicionar mais nada em termos de feature ou interface."*  <!-- noqa-acento: citação literal dela -->
* **Não apague informação que só existe ali.** Encurtar não é cortar o fato —
  se a frase é a única fonte de um dado, a proposta tem de preservá-lo.
* **Não toque em arquivo fora da sua posse.**
* **Não publique.** A publicação vem depois do olho dela.

---

## O QUE VALE PARA TODA FRENTE DESTA ONDA

1. **A tela dela é UMA SÓ e ela está usando a máquina.** `--oculta` em toda
   janela. O portão `a-tela-dela` reprova quem esquecer.
2. **Uma branch sua** (`voo/LINGUA-A5-opus`), árvore própria. Não toque em
   `dev`, não faça merge, não rode `install.sh`.
3. **Confira que sua árvore nasceu no `dev` de hoje** — worktree de agente já
   nasceu mil commits atrás nesta casa. `git log --oneline -1 dev` e adiante a
   sua se preciso.
4. **Curar o mockup não cura o produto:** o gerador escreve em `mockup/`, e
   sem `scripts/check_o_desenho_aprovado.py --publicar NN` a tela dela não
   muda.
5. **A foto é entrega**, na vista dela:
   `src/hefesto_dualsense4unix/interface/olhar.py NN-nome.html --publicado --vista dela`
6. **Rode `bash scripts/portoes.sh` antes de fechar**, depois do `git add -A`.
7. Leia o índice da onda: `docs/process/sprints/2026-09-11-A-SEGUNDA-LISTA-DELA-a-lingua-da-tela-e-a-paridade-INDICE.md`
