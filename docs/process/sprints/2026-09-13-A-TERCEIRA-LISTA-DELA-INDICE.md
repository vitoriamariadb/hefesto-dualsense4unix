---
sprint: A-TERCEIRA-LISTA-DELA-INDICE
estado: aberta
onda: A-TERCEIRA-LISTA-DELA
posse:
  A-TERCEIRA-LISTA-DELA-INDICE:
    - docs/process/sprints/2026-09-13-A-TERCEIRA-LISTA-DELA-INDICE.md
bancada: false
depois_de: []
---

# A TERCEIRA LISTA DELA — o índice da leva de 13/09/2026

**13/09/2026, madrugada.** Ela abriu o produto, ainda na versão de antes da
leva das frases, e mandou numa mensagem só:

> *"2 jogos nunca receberam as Opções de Inicialização do Hefesto na Steam: Avatar Legends: The Fighting Game (appid 2424420) e Pro Jank Footy (appid 3621330). Preciso da Steam FECHADA para repor (ela regrava o arquivo ao sair e engoliria a correção). Feche a Steam e eu reponho. esse tipo de info segue aparecendo nas abas"*
>
> *"esse tipo tambem tem que parar de aparecer"* — com a foto da aba Gatilhos e a caixa laranja *«Esse número é maior do que a quantidade de controles ligados»* <!-- noqa-acento: citação literal dela -->
>
> *"reconectar c ontroles segue dando pau,. falo do posicionamento e formato dele. ele segue sambando."* <!-- noqa-acento: citação literal dela -->
>
> *"o sack boy, não sei se tem outros na mesma condição, talvez o pragmata ou madjack. mas o sackboy não tá respeitando o modo e a máscara setado na aba jogar. ele tá diferente do resto dos jkogos. preciso que faça eles funcionarem como os demais nenhum jogo tem que ter esse tipo de exclusividade em termos de config fora da interface. outra coisa não sei se nossos botões da aba sistema fazem o que deveriam fazer de fato e se funcionam"* <!-- noqa-acento: citação literal dela -->
>
> *"outra coisa se ler sobre como descobrimos como funcionava o a escrita do lightbar dentro da steam e como fizemos os guards funcionarem lá pra isso sempre se autoaplicar. tenho receio que nossas features não cheguem aos jogos pelo mesmo motivo ou semelhantes. inclusive acho que o lightbar perdeu essas qualidades que tinhamos, ou foi desligado recentemente. Preciso que a auditoria revele isso."* <!-- noqa-acento: citação literal dela -->
>
> *"não vamos adicionar botões novos no layout no máximos vamos tirar e nxugar ou mexer o minimo. nada de adicionar. temos que fazer a interface funcionar porinteiro. além disso mande agentes executarem as demais sprints a serem concluidas no repo. faça com calma e zelo. todas as decisoes ja foram tomadas no passado não precisa de mim pra nada. sempre documente pra evitar que uma queda nos derrube"* <!-- noqa-acento: citação literal dela -->

## §0 — O processo desta leva (ordem dela)

1. **A sprint nasce aqui, commitada, ANTES de qualquer agente.**
2. **No máximo três agentes por sprint, em série:** ESTUDO (só lê e mede,
   devolve o achado e a posse real), IMPLEMENTA (na árvore própria da sprint),
   VALIDA/CORRIGE (foto, clique, mordida, portões; corrige o que achar).
3. **Quem coordena** escreve o estudo na sprint, acerta a posse, despacha,
   costura na integração, roda portões e suíte, leva ao `dev`, empurra e
   instala. O install final usa o sudo que ela autorizou — a senha não vai para
   arquivo nenhum.
4. **Nada de botão novo.** Tirar e enxugar pode; mexer o mínimo.
5. **Decisão:** as decisões já estão registradas na casa; quem decide escreve a
   razão e o endereço da decisão antiga que a sustenta.

## §1 — As sprints

| sprint | o pedido | estado |
| --- | --- | --- |
| FRASES-E-DICAS-01 | a frase da Steam e a caixa laranja da Gatilhos — toda frase de aviso que ainda chega à tela, em qualquer forma | estudo |
| RECONECTAR-SAMBA-02 | o «Reconectar controles» ainda muda de lugar e de formato na janela dela | estudo |
| JOGO-SEM-EXCLUSIVIDADE-01 | Sackboy (e talvez Pragmata e Mullet Mad Jack) não seguem o modo e a máscara da aba Jogar | estudo |
| SISTEMA-BOTOES-01 | cada botão da aba Sistema faz o que diz? funciona? | estudo |
| LIGHTBAR-NA-STEAM-01 | a luz dentro da Steam, as guardas que se autoaplicavam, e se as outras features chegam ao jogo | estudo |
| TELA-CALADA-04 | a recusa sem coluna, o verde sem dono, o painel da 09 que fala jargão | aberta (estudo pronto) |
| as abertas de antes | triagem: costurar o que já foi entregue, executar o que cabe, deixar à bancada o que é de aparelho | estudo |

## §2 — Onde está o estado, para sobreviver a uma queda

* **A integração:** `/mnt/Apate/Desenvolvimento/hefesto-voo/_integra-1309`, branch
  `onda/1309`. O `dev` dela recebe por fast-forward.
* **Os lotes:** `/mnt/Apate/Desenvolvimento/hefesto-voo/_lotes/<lote>/args.json`
  e as árvores em `/mnt/Apate/Desenvolvimento/hefesto-voo/hefesto-voo/<SPRINT>-opus`.
* **O que cada agente entregou:** `docs/process/agentes/2026-09-13/<SPRINT>-*.md`
  na branch `voo/<SPRINT>-opus`. Conferir com `git cherry onda/1309 voo/<SPRINT>-opus`.
* **O ONDE PARAMOS do dia:**
  `docs/process/2026-09-13-ONDE-PARAMOS-a-tela-que-parou-de-narrar-e-os-quatro-microfones-no-ar.md`.
* Esta tabela é atualizada a cada onda, no mesmo commit que muda o estado.
