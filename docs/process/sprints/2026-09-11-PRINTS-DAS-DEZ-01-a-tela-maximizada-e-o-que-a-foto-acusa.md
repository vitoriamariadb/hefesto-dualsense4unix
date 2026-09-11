---
sprint: PRINTS-DAS-DEZ-01
estado: aberta
onda: A-LISTA-DE-0911
posse:
  PRINTS-DAS-DEZ-01:
    - docs/process/2026-09-11-AS-DEZ-ABAS-MAXIMIZADAS-o-que-a-foto-acusa.md
    - docs/usage/assets/
    - src/hefesto_dualsense4unix/interface/olhar.py
cria:
  - docs/process/2026-09-11-AS-DEZ-ABAS-MAXIMIZADAS-o-que-a-foto-acusa.md
bancada: false
depois_de:
  # Ela fotografa o RESULTADO da leva. Sai depois de a costura fechar, ou
  # fotografa a tela de ontem.
  - PERFIS-A-TELA-01
  - ILUMINACAO-PALETA-01
  - GATILHOS-VAO-01
  - SOM-BOTOES-01
  - LANCADOR-LOCALIZAR-01
nao_toca:
  - src/hefesto_dualsense4unix/interface/aba01.py
  - src/hefesto_dualsense4unix/interface/aba02.py
  - src/hefesto_dualsense4unix/interface/aba03.py
  - src/hefesto_dualsense4unix/interface/aba04.py
  - src/hefesto_dualsense4unix/interface/aba10.py
  - src/hefesto_dualsense4unix/interface/pacotes/
---

# PRINTS-DAS-DEZ-01 — as dez abas maximizadas, e o que a foto acusa

> *"quero que vc maximize as telas e tire prints de todas as abas e valide se*  <!-- noqa-acento: citação literal dela -->
> *houve problemas."*  <!-- noqa-acento: citação literal dela -->

---

## §1 — A JANELA NÃO NASCE NA TELA DELA. NUNCA.

Ela tem **uma** tela e está usando a máquina. `--oculta` em **toda** execução, e
o portão `a-tela-dela` reprova quem esquecer. Isto não é preferência: a suíte já
abriu `Gtk.Window` de verdade na sessão viva dela duas vezes.

## §2 — «MAXIMIZADA» É UM NÚMERO, E ELE TEM DE SER DITO

O retratista de hoje é
`src/hefesto_dualsense4unix/interface/olhar.py --todas --publicado --doc`, e ele
fotografa as dez páginas que o `WebKit2.WebView` renderiza.

**A ordem dela é fotografar MAXIMIZADO**, e há sprint aberta que já mediu o
problema vizinho: `ALTURA-DA-VISTA-01` — *"a janela mede 777 numa vista de
840"*. **Não a execute** (não é sua), mas leia-a: ela diz onde a altura se
perde.

**O que esta sprint tem de declarar, em números:** a vista em que as fotos
foram tiradas (largura × altura), e **por que essa é a vista maximizada da
máquina dela** — a resolução da tela dela menos o que o compositor come. Uma
foto sem a vista declarada não responde à pergunta dela, porque o defeito que
ela está caçando **é de layout em largura**.

Se o `olhar.py` não aceitar a vista por argumento, **acrescente o argumento** —
ele é o dono do retrato e é o único lugar onde isso não vira segunda lista.

## §3 — «VALIDE SE HOUVE PROBLEMAS» — o que conta como problema

Leia as dez imagens (a ferramenta de leitura enxerga imagem) e reprove por
FORMA, não por gosto. A lista de defeitos de forma desta casa já existe e é a
sua régua de partida:

1. **vão** — bloco que termina e deixa faixa vazia grande até o rodapé;
2. **corte** — conteúdo que não cabe, barra de rolagem dentro de quadro que não
   devia rolar, última linha pela metade;
3. **rótulo mudo** — lugar vazio sem `PN • Desconectado`, travessão onde devia
   haver nome;
4. **desalinho** — colunas de controle que não se alinham entre si;
5. **frase que afirma o que a tela não mostra** — e para essa há dono:
   `docs/process/2026-09-10-AS-FRASES-QUE-MENTEM-a-tela-medida-contra-o-produto.md`
   tem 102 acusações de pé. **Não refaça esse trabalho**; cite a linha dele se a
   foto confirmar uma.

**Cada problema achado vira uma linha com: aba · o que se vê · onde no fonte ·
custo (alto/médio/baixo) · de quem é a cura.** Alto é o que a faz desistir do
que funciona.

## §4 — O QUE ENTREGAR

1. **As dez fotos**, na vista declarada, em `docs/usage/assets/`.
2. **O documento** com uma seção por aba e a tabela de problemas.
3. **Um veredito de uma linha por aba**: limpa · defeito de forma · defeito de
   conteúdo.
4. **Nada de cura de código.** As abas e os pacotes estão em `nao_toca` porque
   cinco agentes desta leva escrevem neles agora. O único fonte seu é o
   `olhar.py`, e só para a vista. Quem acha, escreve; quem cura é a próxima
   sprint, que você deixa escrita se o defeito for grande.

## §5 — O QUE É DELA

A palavra final sobre tela. O seu documento é o que ela lê para decidir o que
entra na próxima leva.
