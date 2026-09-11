---
sprint: LINGUA-A4
estado: aberta
onda: A-LINGUA-DA-TELA
posse:
  LINGUA-A4:
    - src/hefesto_dualsense4unix/interface/aba03.py
    - src/hefesto_dualsense4unix/interface/aba04.py
    - src/hefesto_dualsense4unix/interface/aba05.py
    - src/hefesto_dualsense4unix/interface/pacotes/a03_gatilhos.py
    - src/hefesto_dualsense4unix/interface/pacotes/a04_iluminacao.py
    - src/hefesto_dualsense4unix/interface/pacotes/a05_vibracao.py
    - mockup/03-gatilhos.html
    - mockup/04-iluminacao.html
    - mockup/05-vibracao.html
cria: []
bancada: false
depois_de: []
nao_toca:
  - install.sh
---

# LINGUA-A4 — a língua das abas Gatilhos, Iluminação e Vibração

Nasce da **A SEGUNDA LISTA DELA** (11/09/2026) — o índice está em
`docs/process/sprints/2026-09-11-A-SEGUNDA-LISTA-DELA-a-lingua-da-tela-e-a-paridade-INDICE.md`.

---
AS TRÊS ABAS DE EFEITO, e elas compartilham um vício: descrevem
o EFEITO em termos de protocolo — modo do gatilho, degrau, força, byte — onde a
pessoa quer saber o que vai SENTIR na mão.

**A ILUMINAÇÃO TEM UMA TRAVA:** ela RECUSOU mexer nos modos em 11/09 —
*"Pera na aba de ilumininação se for pra mudar os modos pra pior. Deixa como*  <!-- noqa-acento: citação literal dela -->
*está hoje então."* — e a sprint ILUMINACAO-GRADE-01 está `caducou`. **Isso é  <!-- noqa-acento: citação literal dela -->
sobre LARGURA DE COLUNA e ARRANJO, não sobre texto.** A vistoria de língua
segue; o que não se toca é a grade e a fileira de tons.

## O QUE ENTREGAR — e é PROPOSTA, não commit de tela

**Ordem dela:** *"Pra apresentarem as propostas tá bom?"*  <!-- noqa-acento: citação literal dela -->

Você **NÃO** troca frase no gerador. Você entrega, em
`docs/process/agentes/2026-09-11/LINGUA-A4-opus.md`:

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
2. **Uma branch sua** (`voo/LINGUA-A4-opus`), árvore própria. Não toque em
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
