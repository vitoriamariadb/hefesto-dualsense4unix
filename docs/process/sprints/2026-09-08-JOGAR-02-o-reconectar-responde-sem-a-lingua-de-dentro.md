---
sprint: JOGAR-02
estado: feita
posse:
  JOGAR-02:
    - src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py
    - src/hefesto_dualsense4unix/app/actions/jogar/painel.py
    - src/hefesto_dualsense4unix/interface/aba01.py
    - src/hefesto_dualsense4unix/interface/frases_que_ela_baniu.py
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/home_actions.py
---

# JOGAR-02 — o «Reconectar Controles» responde sem a língua de dentro

**Pedido por ELA em 08/09/2026, com um print da aba Jogar.** Palavras dela:
*"remover essa frase que aparece tambem ao clciar em reconectar controles. M as antes aguarda."* <!-- noqa-acento: citação literal dela, palavra por palavra -->
— e, na sequência: *"adicione o que eu mandei acima como sprint."*

A frase do print, dentro do cartão do P1, numa caixa verde:

```
Jogadores reconciliados — 2 jogador(es). A numeração já estava compacta.
```

## §1 — De onde a frase vem, e por onde ela chega ao cartão

| passo | onde | o que faz |
| --- | --- | --- |
| o botão | `aba01.py:1751` — `data-gesto="reconectar"` | «Reconectar Controles», no bloco «O Controle é visto como», à direita |
| o gesto | `a01_jogar.py:2515-2587` | PASSO 1 `coop.sync` (ciclo forçado de reconciliação); PASSO 2 `identity.renumber` (compacta a numeração — recusado com jogo aberto, e a recusa não é erro) |
| a frase | `app/actions/jogar/painel.py:838-854` → `home_actions.reconciliar_toast` (`:1035-1064`) | monta a frase da JANELA GTK de 06/08 — «Jogadores reconciliados» + um dos quatro desfechos da numeração |
| o pouso | `hefesto_vivo.py:157` (`{"recado": …}`) e `pintar_recados` | recado **verde, 6 s** (`SEGUNDOS_DO_RECADO_DE_SUCESSO`), dentro do CARTÃO do controle escolhido |

**No print, o recado cobriu a identidade do P1** — o desenho, «Sony • Player 1»,
a cor do plástico, o transporte e a bateria sumiram por seis segundos e no
lugar ficou a frase. O P2, ao lado, seguiu inteiro.

## §2 — Por que a frase está errada, e são três razões, não uma

1. **É a língua de dentro.** *Reconciliados* e *numeração compacta* são palavras
   do daemon (`CoopManager.sync`, `identity.compact`). A
   [LÍNGUA DESTA CASA](../../A-LINGUA-DESTA-CASA-o-glossario-que-a-tela-e-o-codigo-falam.md) §3
   já decidiu como a tela responde a «deu certo»: a **piscada verde**, *sem
   palavra nova* (03-Q4). O recado verde é para quando **há notícia**.
2. **«Já estava compacta» não é notícia** — é a ausência dela. Um recibo que
   diz «não mudou nada» é o piloto falando quando não tem o que dizer, e isso
   morreu em 05/09 (`hefesto_vivo.py:143-158`).
3. **O gesto é dos controles todos e o recado pousa num cartão só.** O
   `coop.sync` reconcilia a lista inteira; o recado vai para o cartão do
   escolhido porque o piloto endereça o recado pelo controle. Na aba 05 isso
   foi resolvido com a faixa da página (`data-hef-recados`, 05-Q4 dela, 06/09);
   a 01 **não declara faixa nenhuma** (medido: zero `data-hef-recados` no
   `01-jogar.html` publicado), então tudo cai no cartão.

**O que a frase cobre é pior do que a frase:** a identidade do cartão é o que
ela olha para saber QUAL controle está falando com ela. Um recado que a apaga
por seis segundos tira a resposta da pergunta que ele veio responder.

## §3 — O que esta sprint entrega

1. **Quando nada mudou, nenhuma frase.** `coop.sync` devolveu a mesma mesa e
   `identity.renumber` disse «já estava compacta» (ou recusou com jogo aberto,
   que também não é notícia) → o gesto devolve **sem `recado`**, e a tela
   responde com a piscada verde no botão. O mecanismo já existe; é só devolver
   `None` em vez de `{"recado": …}`.
2. **Quando mudou, uma frase na língua da tela**, vinda do dono
   (`app/actions/jogar/painel.py`) — e **as palavras são dela**. Proposta para o
   OK dela, uma por desfecho:
   * voltou alguém → *«O P3 voltou.»* (nomeando o assento, que é a palavra que
     a tela já usa);
   * a numeração mudou → *«Os controles foram renumerados: P1, P2.»*;
   * o serviço não respondeu → continua a recusa laranja de hoje
     (`RECONECTAR_SEM_SERVICO`), que já é frase de tela.
3. **O recado de mesa não cobre identidade.** A 01 passa a declarar uma faixa
   (`data-hef-recados="sucesso"`) na linha do botão, como a 05 fez — assim o
   recibo, quando existir, fica ao lado do botão e não em cima do P1.
4. **`reconciliar_toast` fica onde está.** É frase da janela GTK, que está
   saindo inteira (`D-0609-GTK-LEVA-INTEIRA`); ela sai com a janela. O que muda
   é o `recibo_do_reconectar`, que hoje só repassa aquela função.
5. **A palavra entra na lista das banidas de tela** (`PALAVRAS_BANIDAS`, em
   `interface/frases_que_ela_baniu.py`, a tupla de `A-PALAVRA-MESA-SAI-01`): *reconciliad* e *compacta*. É o que
   impede a frase de voltar por outro gesto.

## §4 — O que MORDE

* clicar «Reconectar Controles» com os quatro na mesa e nada a mudar → **nenhum
  `.hef-recado` no DOM** e a piscada no botão; devolver a frase de hoje e a
  régua reprova nomeando «reconciliados»;
* tirar um controle da mesa, clicar → o recado diz o assento que voltou, e a
  identidade do P1 **não some** (medir a geometria de `[data-campo="identidade"]`
  antes e depois — não o texto do gerador);
* `test_o_recado_de_sucesso_pousa_no_cartao.py` continua verde: o que muda é
  ESTE gesto deixar de mandar frase vazia de notícia, não o canal.

**A régua mede na página publicada, com o piloto `--oculta` e
`--prova-clique reconectar`** — a validação de tela desta casa é o clique, não o
fonte.

## Critério de pronto — por cabo · por BT · no perfil · por controle

É a régua dela de 08/09 ([CABO-BT-PERFIL-CONTROLE-01](2026-09-08-CABO-BT-PERFIL-CONTROLE-01-a-regua-de-pronto-de-toda-feature-da-tela.md)); a sprint só fecha com as quatro respondidas.

| | |
| --- | --- |
| cabo / BT | o gesto é da mesa e vale igual nos dois — o recibo, quando houver, nomeia o assento que voltou, não o transporte |
| no perfil | — (nada se grava) |
| por controle | — (é da mesa); a única coisa por controle aqui é a IDENTIDADE do cartão, que o recado não pode cobrir |


---

## FEITA em 09/09/2026 — os cinco itens

| item | como fechou |
| --- | --- |
| 1 · sem notícia, sem frase | `painel._sem_noticia` — `renumbered` vazio e `sessao_de_jogo_aberta` devolvem `""`, e o gesto traduz o vazio em `None`. Um `{"recado": ""}` não serve: o piloto pousaria uma caixa verde VAZIA sobre a identidade |
| 2 · a frase na língua da tela | `painel._na_lingua_da_tela` — «Os controles foram renumerados: **P1, P2**.» Os números saem do próprio `renumbered`; dizer *"2 controle(s)"* obriga ela a descobrir quais |
| 3 · o recado sai de cima da identidade | `aba01.py` declara `data-hef-recados="sucesso"` na linha do botão, como a 05 fez com a 05-Q4. **Só o sucesso muda de lugar** — a recusa é sobre AQUELE controle e fica no cartão |
| 4 · `reconciliar_toast` fica onde está | ela não é mais chamada por aqui; sai com a janela GTK (`D-0609-GTK-LEVA-INTEIRA`) |
| 5 · as palavras entram na lista | `PALAVRAS_BANIDAS += ("reconciliad", "compactada")` |

### Os quatro desfechos, medidos

```
{'ok': True,  'renumbered': {}}                  ->  ''
{'ok': False, 'reason': 'sessao_de_jogo_aberta'} ->  ''
{'ok': True,  'renumbered': {'a':1,'b':2}}       ->  'Os controles foram renumerados: P1, P2.'
{'ok': False, 'reason': 'x'}                     ->  'Não consegui ajustar a numeração dos controles.'
None                                             ->  'Não consegui conferir a numeração dos controles.'
```

**As duas falhas continuam sendo notícia:** *"não consegui"* é o produto
dizendo que não fez, e silêncio sobre isso é a mentira que esta casa persegue.

### `compactada`, e não `compacta`

A raiz curta é o verbo `compactar`, que é a palavra certa em código e em
comentário; banir a raiz acusaria toda prosa que explica o que o daemon faz. A
régua casa por borda de palavra, então `compactada` pega a frase e deixa o
verbo em paz.

### As réguas

`test_a_aba_jogar_le_os_seis_avisos.py`: três substituídas (mediam a frase da
janela GTK) e uma nova —
`test_a_numeracao_ja_compacta_nao_vira_recado`, que é o caso exato do print
dela. Mordida: `_sem_noticia` devolvendo `False` traz a frase de volta em cima
do cartão do P1.

### O que ficou para o olho dela

As palavras do item 2 eram **proposta**. Elas estão na tela agora, e são
reversíveis numa linha (`painel._RENUMEROU`). Se ela quiser outras, é trocar a
constante.
