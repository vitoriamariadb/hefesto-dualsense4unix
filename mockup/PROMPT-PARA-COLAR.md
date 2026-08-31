# O prompt para colar na aba nova

Ela escreveu este arquivo em 31/08/2026 para não ter de reescrever o pedido toda
vez. **Copie o bloco abaixo inteiro** e cole numa sessão nova de Claude Code
aberta em `/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix-dev`.

---

```
Você trabalha em /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix-dev, na
branch dev-gtk. Rode tudo daqui — nunca de /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix,
que é a árvore dela e não se toca.

LEIA, NESTA ORDEM, ANTES DE QUALQUER COISA:
  1. CLAUDE.md — o contrato desta casa
  2. mockup/TODO-DELA.md — a lista de trabalho, aba a aba. É o seu roteiro.
  3. mockup/LEIA-PRIMEIRO.md — o que é cada pasta
  4. docs/process/COMO-OLHAR-A-TELA.md — como fotografar sem atrapalhar ela

O QUE VOCÊ VAI FAZER: concluir o mockup da interface. Ela disse, com estas
palavras: "primeiro nunca terminamos o mockup, por isso não era pra ser feito no
layout final. Vamos concluir lá e depois seguimos pra interface."

AS QUATRO REGRAS DELA, e elas valem acima de qualquer instinto seu:

  1. UM PONTO POR VEZ. Termine, mostre a ela, e ESPERE O OK DELA. Só então o
     próximo. Nunca emende dois pontos.
  2. SEM AGENTES. Nada de Task, subagente ou workflow. Este trabalho é para ser
     feito à mão, por você, conversando com ela. Ela pediu isso com todas as
     letras.
  3. COM O NAVEGADOR. Abra a página, olhe, clique, meça. Use
     `cd layout/_ferramentas && python3 olhar.py NN-*.html` — ele fotografa em
     Chrome headless. E LEIA o PNG com a ferramenta Read: você enxerga imagens,
     e a foto é para você olhar, não só para gerar.
  4. A CADA PONTO ENTREGUE, MOSTRE A LISTA ATUALIZADA — o que fechou, o que
     falta, e o que mudou de entendimento no caminho. Marque [x] só depois do OK
     DELA, nunca depois do seu próprio verde.

COMECE PELO PONTO 0 da lista. Ele é uma pergunta para ela e vem antes de tudo:
o fluxo hoje está invertido (o script copia produto → mockup, e o certo é
mockup → produto). Sem consertar isso, todo desenho novo cai direto no produto
que ela usa.

O FLUXO QUE ELA DECIDIU:
    layout/_ferramentas/abaNN.py   ← você edita AQUI (os geradores ficam onde estão)
            │  python3 abaNN.py
    mockup/NN-*.html               ← o desenho sendo concluído. É o que ela olha.
            │  só quando ela aprovar
    layout/NN-*.html               ← publicado. É o que o produto renderiza.

AS ARMADILHAS QUE JÁ CUSTARAM CARO NESTA CASA:

  - ELA TEM UMA TELA SÓ. Janela que nasce na frente dela quebra o que ela está
    fazendo. Sempre --oculta, sempre headless. Nunca abra janela.
  - NUNCA rode install.sh nem install-dev.sh. Eles reescrevem o app que ela usa,
    na hora.
  - A FONTE É O GERADOR. Editar mockup/NN-*.html ou layout/NN-*.html à mão é
    trabalho que a próxima regeração apaga.
  - MEÇA ANTES DE MEXER, e meça depois. Foto antes, foto depois.
  - A MORDIDA É OBRIGATÓRIA: quebre a própria cura de propósito e veja a régua
    reprovar. Régua que passa com a cura arrancada não mede nada.
  - RÉGUA QUE ACHA ZERO NÃO É RÉGUA VERDE — é hipótese. Se um seletor casou zero
    elementos, isso é ERRO, não silêncio. Quatro réguas desta casa deram verde
    sobre nada em 31/08.
  - Português do Brasil com acentuação correta em tudo: código, comentário,
    documentação e mensagem de commit. Há portão que reprova.

ANTES DE FECHAR QUALQUER PONTO:
    git add -A && bash scripts/portoes.sh --rapido      # 23 portões, ~5s

Não commite sem o OK dela. Quando ela aprovar, a mensagem de commit conta O QUE
FOI MEDIDO, não o que foi feito.

Comece agora pelo PONTO 0, e me diga qual é a pergunta que você vai fazer a ela.
```
