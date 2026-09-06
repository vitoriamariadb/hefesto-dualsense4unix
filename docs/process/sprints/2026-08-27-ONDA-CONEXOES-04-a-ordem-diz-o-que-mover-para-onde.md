---
sprint: ONDA-CONEXOES-04
estado: absorvida
posse:
  A4:
    - src/hefesto_dualsense4unix/app/actions/config/secao_exame.py
cria:
  - tests/unit/test_conexoes_a_receita_chega_a_tela.py
bancada: false
depois_de:
  - ONDA-CONEXOES-03
  - LEVA-4  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
  - ORDEM-DE-SERVICO-01  # sprint antiga ainda aberta: a onda vem depois, em série (R5)
nao_toca:
  - src/hefesto_dualsense4unix/integrations/arranjo_da_mesa.py
  - src/hefesto_dualsense4unix/integrations/ordens_da_mesa.py
  - src/hefesto_dualsense4unix/integrations/mapa_das_portas.py
  - src/hefesto_dualsense4unix/app/widgets/mapa_da_mesa.py
  # O portão da dívida é de QUEM COORDENA, e não desta onda: cada sprint
  # entrega o MANIFESTO do que ligou, e quem coordena aplica todos num
  # commit só. Está decidido desde 25/08 em
  # 2026-08-25-LIGAR-OS-MODULOS-A-TELA-INDICE-dez-frentes-em-quatro-ondas.md
  # ("cinco frentes o tocariam; cada uma entrega um manifesto").
  - tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 08). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA CONEXÕES · 04 — a ordem diz o que mover para onde

**O defeito, numa frase:** a tela publica o **juízo** ("dois rádios em entradas
vizinhas") e esconde o **conserto** ("mova o adaptador da Entrada 3 para a
Entrada 9, e o que você ganha") — que já está calculado, medido e sem um único
chamador.

**Isto é `A-CASA-SABE-E-O-PRODUTO-NÃO-FAZ` na forma cara**, e o registro desta
casa já nomeia as lápides:
`integrations/arranjo_da_mesa.py::receita` (`:877`),
`::consequencias` (`:1063`), `::variante_por_id`, `::reexame`, `::sem_entrada`,
`::candidatas`, `::adaptadores_da_mesa`, `::plano_dos_controles`, `::qualidade` —
nove, todas com a mesma razão escrita em
`tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py:891-1078`: *"a RECEITA — o
que mover para onde — continua sem tela... O QUE O FECHA: a ordem de serviço da
aba Conexões, depois da palavra dela sobre qual régua vence."*

**Esta sprint é essa palavra virando código.**

## ATENÇÃO — ela está TRAVADA por decisão dela

`D-QUAL-REGUA-MANDA-NO-ARRANJO`: *"MEDIR AS DUAS ANTES DE ESCOLHER"*. Duas
réguas respondem "qual controle move para qual adaptador" e uma já está na tela
(o juízo por entrada, que a janela do mapa ligou em 26/08). A medição que ela
pediu existe: `tests/unit/test_as_duas_reguas_do_arranjo_divergem_onde.py`.

**Quem executar não escolhe.** Leia a medição, leve o caso à mesa dela, e só
então escreva o texto do imperativo. A parte estrutural (o widget da receita, o
teste, a limpeza do registro) pode ser escrita antes; **o texto que a tela
publica, não.**

## O que entrega

O card de ordem (`secao_exame.py:677`, `_card_da_ordem`) ganha a **receita**,
exatamente como o mockup a desenha (`aba08.py:217-229`):

```
Mova o adaptador Bluetooth da Entrada 3 para a Entrada 9
[Entrada 3 · USB 3.0]  →  [Entrada 9 · USB 2.0]
Ganho esperado: sai do controlador do teclado e do ruído do USB 3.0.
```

* **de onde e para onde** saem de `arranjo_da_mesa.receita(mesa)` — que já
  devolve `Movimento` com origem, destino e as `Linha`s de porquê. **Só entra
  aqui o que MELHORA**: aparelho já numa entrada tão boa quanto a melhor
  candidata não vira movimento (`receita`, docstring);
* **a dica de cada caixa** é o que aquela entrada é (região, velocidade), e sai
  de `Entrada`, não de texto digitado;
* **o "o que se perde"** de `consequencias(mesa)` vai para o "?" do card;
* **ordem sem destino continua sem imperativo** — `Ordem.tem_acao` já governa
  isso (`ordens_da_mesa.py:262`) e o card já respeita. Uma ordem que manda mover
  para lugar nenhum é pior que silêncio;
* **`D-MAPA-SEM-RECEITA` continua valendo**: uma verdade só na tela. O desenho
  do mapa mostra o que a receita manda, e nunca move o que ela não mandou.

E o **registro é limpo**: cada lápide de `arranjo_da_mesa` que esta sprint
alcançar sai de `portao_a_casa_sabe_e_o_produto_nao_faz.py`. As que **não**
alcançar ficam, com a razão corrigida — nunca apagadas por parecerem irmãs das
que caíram.

## Como se prova — o teste que morde

`tests/unit/test_conexoes_a_receita_chega_a_tela.py`:

* com uma `Mesa` de dublê onde `receita()` devolve **um** movimento, o card
  publica origem e destino **como texto de widget**, e o par bate com o que a
  função devolveu — o teste compara contra a chamada, nunca contra literal
  digitado no teste;
* com uma `Mesa` onde `receita()` devolve **lista vazia**, o card monta com
  imperativo e **sem** a linha da receita, sem levantar;
* o "?" do card carrega o texto de `consequencias()`;
* o portão `portao_a_casa_sabe_e_o_produto_nao_faz` fica **verde** — as lápides
  fechadas saíram e nenhuma sobrou apontando para função que agora tem tela.

**A mordida:** troque a chamada de `receita()` por uma lista fixa e veja o
primeiro teste reprovar (é ele que separa "a tela mostra uma receita" de "a tela
mostra A receita"). Depois devolva uma lápide fechada ao registro e veja o
portão reprovar. Cole as quatro saídas.

## O que é dela decidir

1. **Qual régua manda** (`D-QUAL-REGUA-MANDA-NO-ARRANJO`) — trava esta sprint
   inteira, e é palavra dela.
2. **O texto do imperativo muda com a resposta.** O mockup mostra a receita, que
   é o que o código tem; se o juízo por entrada vencer, a frase é outra
   (`aba08.py`, "Ainda aberto", item 4).
