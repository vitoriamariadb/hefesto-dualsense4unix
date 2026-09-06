---
sprint: ONDA-CONTROLES-09
estado: absorvida
# onda: CONTROLES (ver a nota de frontmatter da ONDA-CONTROLES-01)
posse:
  CTRL09:
    - src/hefesto_dualsense4unix/app/widgets/controller_card.py
cria:
  - tests/unit/test_controles_a_explicacao_virou_dica.py
bancada: false
depois_de:
  - LEVA-3
  - ONDA-CONTROLES-01
  - ONDA-CONTROLES-03
  - ONDA-CONTROLES-04
  - ONDA-CONTROLES-05
  - ONDA-CONTROLES-06
  - ONDA-CONTROLES-08
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/config/moldura.py
  - src/hefesto_dualsense4unix/app/actions/status_actions.py
  - src/hefesto_dualsense4unix/gui/main.glade
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 02). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA CONTROLES · 09 — trinta e cinco frases viram quinze

**O defeito, numa frase:** a aba tem **35 textos fixos** e a maior parte deles
explica em vez de dizer o estado — texto que estaria ali igual com a tela
intocada e com a tela toda mexida.

## A regra que manda

`D-TUDO-QUE-EXPLICA-VIRA-DICA`, decidida em 26/08:

> Fica na tela: **título de quadro, rótulo de botão, e o valor/estado atual.**
> Todo o resto — explicação, ressalva, exemplo — vai para o ícone "?" ou para a
> dica do widget.

E ela em 21/08, sobre o custo: *"a ideia é que o dev não morra no caminho ou que
a IA não chegue a um milhão de tokens só de ler um único script ou documento."*
Verbosidade tem preço em atenção de quem lê **e** em espaço de tela.

## O que está medido

- **A ferramenta já existe, e esta aba nunca a usou.**
  `app/actions/config/moldura.py:30`, `CLASSE_AJUDA = "hefesto-ajuda"`; `:34`,
  `GLIFO_DE_AJUDA = "?"`; `:158`, `marcar_afordancias`, que **desce a árvore** e
  marca sozinha os rótulos com dica e os `?` já montados; `:240`,
  `moldura_de_secao(titulo, dica)`. Foi escrita para a aba Configurações em
  22/08 e é o molde da casa.
- O card monta os blocos pelo `_bloco(titulo)` próprio
  (`controller_card.py:3013`), que **não tem** parâmetro de dica.

## O que esta sprint entrega

1. **`_bloco(titulo, dica=None)`** — o `?` no canto do título do bloco, com a
   marca `hefesto-ajuda`, sem inventar componente novo: `marcar_afordancias`
   já sabe reconhecê-lo.
2. **Os quatro `?` que o contrato nomeia**, com o texto que o mockup aprovado já
   escreveu (`src/hefesto_dualsense4unix/interface/aba02.py`, os blocos `class="dica"`):
   - **Microfone** — *"A barra mostra o som entrando agora. O ícone à direita
     cala no firmware e apaga a luz vermelha do plástico"*;
   - **Som** — a diferença entre "Sons do jogo" e "Todo o som do PC";
   - **Entradas** (giroscópio/acelerômetro) — *"Leitura viva do aparelho, dez
     vezes por segundo. Nada aqui se clica."*;
   - **No jogo** — a faixa do topo do card, e é aqui que caem as cinco linhas
     que a ONDA-CONTROLES-01 deixou em aberto.
3. **O `?` do quadro** "Os controles da mesa": a borda é quem é, o fundo lilás é
   o escolhido, e o card mostra sem nunca escolher.
4. **As explicações que hoje ocupam a tela saem dela** — as que o contrato
   nomeia: por que o Modo Nativo não tem o que medir, por que este controle
   ainda não tem gamepad virtual, o que é tomar a posse do registrador de
   volume, e a diferença entre mudo de firmware e volume zero.

**O que fica visível**, e a lista é fechada: o título do card, a bateria, a
faixa de estado, o alarme de divergência, o aviso do perfil que não entrou, os
rótulos dos dois blocos de som, os números dos slicers e as leituras vivas.

## Como se prova (o teste que morde)

`tests/unit/test_controles_a_explicacao_virou_dica.py`:

1. **A conta.** Contar os rótulos **visíveis** do card montado: hoje 35, depois
   no máximo 15. Um número, medido pelo mesmo caminho que o redesenho usou.
   Arranque a cura (devolva um parágrafo ao corpo) e veja a conta estourar.
2. **Nada se perdeu, só mudou de casa.** Para cada frase que sai da tela, existe
   uma dica que a contém. Um teste que só contasse os rótulos aprovaria
   **apagar** as frases — que é o defeito oposto e pior.
3. **Os `?` são alcançáveis.** Cada um tem dica não vazia e a classe
   `hefesto-ajuda`; nenhum `?` nasce mudo.
4. **`marcar_afordancias` reconhece os novos.** Roda sobre o card e o número de
   marcas bate com o número de `?` montados — a régua contra a marca à mão que
   diverge do molde.

## O que é dela decidir

1. **Ela mandou tirar um `?` desta aba**, em 27/08, e é preciso não desfazer:
   > *"literalmente não tá alinhado. **tira essa interrogação aí**"*

   Era o `?` **colado no "vê como Xbox"** da faixa — e ele saiu do mockup. Os
   `?` desta sprint são os **de bloco**, no canto do título, que é forma
   diferente e lugar diferente. **PROVISÓRIO — decisão dela:** a faixa não ganha
   `?` colado a item nenhum; se as cinco linhas do "No jogo" forem para uma
   dica, ela pende do **título do card**, não de uma palavra no meio da linha.
2. **A conta-alvo.** O redesenho estimou "~15 visíveis". *É teto ou é meta?*
   Teto vira portão; meta vira intenção que ninguém mede.
