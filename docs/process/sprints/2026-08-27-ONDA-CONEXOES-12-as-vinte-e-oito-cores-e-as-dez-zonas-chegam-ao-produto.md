---
sprint: ONDA-CONEXOES-12
onda: CONEXOES
posse:
  A12:
    - src/hefesto_dualsense4unix/integrations/cor_do_plastico.py
    - docs/data/cores-do-plastico.md
cria:
  - tests/unit/test_as_cores_do_produto_saem_do_csv.py
bancada: false
depois_de:
  # SÉRIE, por R5: divide `integrations/cor_do_plastico.py` com as três abaixo.
  # Vem depois da 11 de propósito: a 11 muda COMO se lê, esta muda O QUE se sabe.
  - ONDA-CONEXOES-08
  - ONDA-CONEXOES-11
nao_toca:
  - docs/data/cores-do-dualsense.csv
  - docs/data/pecas-do-dualsense.csv
  - assets/control-svg/dualsense.svg
  - scripts/gerar_cores_do_dualsense.py
  - scripts/check_cores_do_dualsense.py
  - src/hefesto_dualsense4unix/app/widgets/external_card.py
---

# ONDA CONEXÕES · 12 — as vinte e oito cores e as dez zonas chegam ao produto

**O defeito, numa frase:** `docs/data/cores-do-dualsense.csv` nasceu em 27/08
como a fonte da verdade das cores — **28 modelos e 10 zonas** — e o produto
continua com **21 códigos de uma zona só**, digitados à mão. É "a casa sabe e o
produto não faz", recém-criado.

## O que está medido, e é a conta inteira

| | o produto | o CSV |
|---|---|---|
| onde | `integrations/cor_do_plastico.py:96` (`NOMES_DE_FABRICA`) e `:122` (`TONS`) | `docs/data/cores-do-dualsense.csv` |
| modelos | 21 | **28** |
| zonas por modelo | **1** (o corpo inteiro) | **10** |
| procedência do hex | 20 dos 21 **aproximados**; só o `05` medido por ela em 21/08 | 202 `FOTO` + 31 `SEM-HEX` |

As **sete que só existem no CSV**: `13` HyperPop Techno Red, `14` HyperPop Remix
Green, `15` HyperPop Rhythm Blue, `ZC` Ghost of Yōtei, `ZD` Marathon, `ZE`
Genshin Impact, `ZF` 007 First Light.

E há uma **divergência de hex** já medida: o Cosmic Red do desenho era `#b11f54`
e a amostragem de 27/08 devolveu `#A51C48` — distância 17. Ninguém tinha como
ver, porque não havia com o que comparar. Agora há.

**A segunda tabela viva:** `docs/data/cores-do-plastico.md` é a fonte declarada
do `TONS` no cabeçalho do módulo (`cor_do_plastico.py:35-43`), com **um hex por
modelo**. Ela e o CSV afirmam a mesma coisa de dois jeitos — que é o defeito que
a regra do fato errado existe para matar.

## O que entrega

1. **`NOMES_DE_FABRICA` e `TONS` param de ser digitados.** Os dois passam a sair
   do CSV, lido uma vez no import. Nenhum chamador muda: `cor_do_codigo`
   (`:204`), `cor_do_nome` (`:218`) e `external_controllers.cores_para_busca`
   continuam com a mesma assinatura e o mesmo contrato — **código fora da tabela
   devolve `None`, e `None` vira "Não sei" na tela**, que é resposta válida em
   toda a aba. O que muda é que a tabela passa a ter 28 e a acompanhar o CSV
   sozinha.
2. **`TONS` deixa de ser um hex e passa a ser as zonas.** Nasce
   `zonas_do_codigo(codigo) -> dict[str, str] | None`, com as chaves do CSV
   (`casca_esq`, `casca_dir`, `painel`, `touch`, `botoes_face`, `simbolos`,
   `dpad`, `analogicos`, `gatilhos`, `detalhe`). O `TONS` de hoje sobrevive como
   **derivado** — `casca_esq` de cada modelo —, que é o que todos os chamadores
   atuais querem e é a zona que a ONDA-CONEXOES-08 declarou como a da borda.
3. **`SEM-HEX` não vira hex, e a assinatura diz isso.** 31 linhas do CSV não
   cabem num `fill` — iridescente, camuflado, metálico, arte. `zonas_do_codigo`
   devolve `None` **naquela zona**, nunca uma cor aproximada, e a receita continua
   na coluna `nota` para quem for medir. **O cabeçalho do CSV proíbe inventar com
   todas as letras**, e a proibição vira código aqui.
4. **`docs/data/cores-do-plastico.md` perde a tabela e guarda a decisão.** O que
   é **decisão medida** fica com a data: a palavra dela de 21/08/2026 — *"o padrão
   é leitura automática (pelo cabo hoje, pelo rádio quando a ponte existir), e a
   pessoa pode escolher a cor — a escolha dela vence a tabela"* (`:15-17`) — e a
   medição do `05`. O que é **tabela de hex** sai e vira ponteiro para o CSV: dois
   hex para a mesma cor obrigam a próxima pessoa a escolher entre duas
   afirmações, e é o custo que esta casa decidiu não pagar mais.

## Como se prova — o teste que morde

`tests/unit/test_as_cores_do_produto_saem_do_csv.py`:  <!-- ref-externa: o arquivo é o que a sprint VAI criar; a ausência é o assunto -->

1. **Os 28 do CSV estão no módulo, e o módulo não tem nenhum a mais.** Comparação
   nos **dois sentidos**, contra o CSV lido no teste — nunca contra literal
   digitado. É a asserção que reprova no dia em que alguém acrescentar uma cor ao
   CSV e esquecer o produto, **e** no dia em que alguém digitar uma no produto que
   o CSV não conhece.
2. **O hex do módulo é o hex do CSV, modelo a modelo.** Sem tolerância: `#A51C48`
   é `#A51C48`. Um teste que aceitasse "perto" seria o que deixou `#b11f54`
   atravessar o projeto.
3. **`SEM-HEX` devolve `None` naquela zona, e a cor do modelo continua chegando
   pelas outras.** Chroma Teal tem a casca iridescente e o painel em hex: a casca
   é `None`, o painel é cor. Devolver um cinza qualquer no lugar do `None` é o
   defeito, e é ele que esta asserção pega.
4. **Zona ausente é `None`, e não a cor da casca.** Quatro modelos têm o CSV
   incompleto por falta de amostragem (Ghost of Yōtei, Marathon, Genshin, 007).
   Herdar a casca ali seria inventar por conveniência.
5. **`tom_para_a_borda` continua recebendo `casca_esq`**, e o Midnight Black
   continua sendo o caso que morde — a mordida da ONDA-CONEXOES-08 tem de
   continuar passando depois desta sprint. **Régua de outra sprint que quebra é
   regressão, não progresso.**
6. **Nenhum hex de plástico continua digitado em `src/`.** Varredura por AST, no
   molde do `portao_a_casa_sabe_e_o_produto_nao_faz.py`. É esta que impede a
   terceira tabela de nascer.

**A mordida:** apague uma linha do CSV e veja a 1 reprovar nomeando o modelo;
troque um hex do CSV e veja a 2 reprovar dizendo os dois valores; faça
`zonas_do_codigo` devolver o hex do painel para uma zona `SEM-HEX` e veja a 3
reprovar. Depois devolva `TONS` ao literal digitado e veja a 6 reprovar. Cole as
quatro saídas.

## O que é dela decidir

1. **Nada trava esta sprint.** A decisão de 21/08 (`docs/data/cores-do-plastico.md:15-17`)
   já cobre a leitura automática, e o CSV é dado, não opinião.
2. **O que ela pode querer ver depois:** os 202 hex marcados `FOTO` vieram de
   pesquisa externa, com iluminação de estúdio, e **nenhum é `MEDIDO`**. O próprio
   cabeçalho do CSV nomeia o trabalho que falta: os quatro controles desta
   bancada — White, Cosmic Red, Starlight Blue e Galactic Purple — *"podem virar
   `MEDIDO` com uma foto sob luz constante, e é o primeiro trabalho a fazer"*.
   Isso é foto **da peça**, não do aparelho respondendo, e não precisa de escrita
   nenhuma — mas precisa da mesa dela.

## O que fica combinado com quem coordena

Esta sprint **não toca o CSV nem o SVG**. Ela lê. O caminho contrário — desenho e
gerador — já está fechado desde 27/08 e tem portão próprio
(`scripts/check_cores_do_dualsense.py`, duas réguas independentes: a leitura dos
CSV e a **pintura** medida no Chrome). Quem executar esta sprint e sentir vontade
de "consertar o CSV daqui" está criando o segundo dono que ela existe para não
criar.
