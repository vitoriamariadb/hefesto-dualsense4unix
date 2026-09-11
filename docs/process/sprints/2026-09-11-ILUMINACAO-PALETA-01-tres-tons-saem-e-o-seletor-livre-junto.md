---
sprint: ILUMINACAO-PALETA-01
estado: feita
onda: A-LISTA-DE-0911
posse:
  ILUMINACAO-PALETA-01:
    - src/hefesto_dualsense4unix/interface/aba04.py
    - src/hefesto_dualsense4unix/interface/pacotes/a04_iluminacao.py
    - mockup/04-iluminacao.html
cria: []
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/core/led_control.py
  - src/hefesto_dualsense4unix/interface/monta.py
---

# ILUMINACAO-PALETA-01 — três tons saem da guia, e o seletor livre vai junto

> **ESTADO 2026-09-11: feita** — a fileira tem ONZE casas em cada um dos quatro
> lugares e a casa hachurada do fim não existe mais, com o gesto dela morto
> junto (o `<input>`, as quatro regras de CSS, a entrada do mapa de cobertura, a
> régua do `value` preto e a segunda porta do gesto `cor`, que agora recusa
> dizendo sem `data-hex`). Os três que saíram foram MEDIDOS pelo critério da §3:
> `#0080FF` (209,88°, vizinho a 29,88° contra 30,12° do `#0000FF`), `#FF00FF`
> (300,00°, empate em 29,88° desfeito pela §2 — o corte é na metade que NÃO é
> cor automática de jogador) e `#000000`. A poda é de TELA: `player_slot_color`
> e `monta.TOM_DA_CASA` não foram tocados, e `FORA_DA_GUIA` recusa dizendo se
> alguém tentar podar uma cor automática. Gerado e **PUBLICADO** (`--publicar
> 04`). **A §4 item 1 CAIU pela medição:** a largura renderizada da coluna NÃO
> cai — `repeat(4,1fr)` numa janela de 1180 px fixos —, e o que cai é a pressão
> (min-content da fileira 130 → 64 px; da coluna 151 → 129/134 px) e a largura
> de cada tom (10,23 → 15,77 px, +54%). Estreitar a coluna pede mudar a GRADE, e
> isso é decisão de tela dela. SEM APARELHO: `bancada: false`, nenhum byte vai
> ao controle, nenhuma célula do mapa exercitada. Entrega:
> `docs/process/agentes/2026-09-11/ILUMINACAO-PALETA-01-opus.md`.

> *"temos que remover esse botão que o mouse tá (que abre outras cores.) remover*  <!-- noqa-acento: citação literal dela -->
> *um tom de azul. um tom de rosa e o tom de preto de todas as cores pros 4*  <!-- noqa-acento: citação literal dela -->
> *controles. isso deve dar um desafogo horizontal legal pra página."*  <!-- noqa-acento: citação literal dela -->

**A razão é dela e é de espaço:** a fileira de tons empurra a largura da coluna
de cada controle, e com quatro colunas isso é o que aperta a página inteira.

---

## §1 — O QUE SAI, e são QUATRO coisas

| o quê | onde está hoje |
| --- | --- |
| **o seletor livre** (a casa hachurada no fim da fileira, que abre o seletor de cores do sistema) | `aba04.py:842-849`, classe `.guia .livre` |
| **um tom de azul** | dos catorze de `tons_da_guia()` |
| **um tom de rosa** | idem |
| **o tom de preto** | idem — `a04_iluminacao.tons_da_guia` declara, na docstring, que os seis extras são *"os quatro matizes que faltavam… mais o branco e o preto"* |

**Em todos os quatro controles** — a fileira é a mesma função para P1..P4.

## §2 — QUEM É O DONO DA LISTA, e é ele que se edita

`aba04.py:215` **não digita tom nenhum**:

```python
CRUS_DA_GUIA = ["#%02X%02X%02X" % rgb for rgb in _pacote04.tons_da_guia()]
TONS = [tom_da_casa(h) for h in CRUS_DA_GUIA]
```

O dono é `pacotes/a04_iluminacao.tons_da_guia()`, e ele junta **duas metades com
donos diferentes**:

1. os OITO primeiros são `core/led_control.player_slot_color(1..8)` — a paleta
   que o daemon usa como **cor automática de cada número**;
2. os SEIS seguintes são as chaves que `monta.TOM_DA_CASA` conhece e os oito não
   cobrem.

**A METADE 1 NÃO SE TOCA, e a razão é de produto:** tirar um tom de lá tiraria a
cor automática de um jogador. `core/led_control.py` e `monta.py` estão em
`nao_toca` de propósito. **O corte é na metade 2** — e se o azul ou o rosa que
ela quer fora estiver entre os oito automáticos, **isso é um achado, e a saída é
esconder da GUIA sem mexer no dono**: a guia passa a declarar quais chaves
mostra, e a cor automática do jogador continua existindo no daemon.

## §3 — QUAL AZUL E QUAL ROSA — decida VOCÊ, e mostre

Ela disse *um* tom de azul e *um* de rosa, não *qual*. **Não pergunte: meça e
decida pelo critério dela, que é o desafogo horizontal**, e o critério técnico
que o sustenta é a distância de matiz — **sai o tom mais próximo do vizinho que
fica**, porque é o que menos custa em escolha e mais devolve em largura.

Registre a decisão no relatório com os dois hex e o ângulo de matiz entre eles.
Se os dois candidatos empatarem, fica o que NÃO é cor automática de jogador.

## §4 — O QUE ENTREGAR

1. **A medição do desafogo**, que é a razão da ordem: largura da coluna de um
   controle antes e depois, em pixels, medida com a ponte JS e `--oculta`. Se a
   largura não cair, a entrega não cumpriu o pedido dela.
2. **A guia com onze casas** (catorze menos três) e **sem o seletor livre**.
3. **O gesto do seletor livre morre inteiro** — o `<input type="color">`, o CSS
   `.guia .livre`, o endereço do gesto e a régua que o cobrava. Peça sem
   chamador é o que o portão `casa-sabe` acusa; peça com chamador e sem tela é
   pior.
4. **Confira o que mais some junto**: `aba04.py:1218` cita *"livre, o puxador do
   brilho e os dois botões de Opções"* como um conjunto. Se alguma régua contar
   casas da guia por número fixo, ela é sua no mesmo commit.
5. **O mockup e a página**: gere `mockup/04-iluminacao.html` e publique com
   `--publicar 04`.
6. **A MORDIDA**: devolva um dos tons removidos e veja a régua reprovar.

## §5 — O QUE É DELA

**O olho, e a escolha do par.** Se ela olhar a foto e disser que o azul errado
saiu, a troca é de um hex — barata de propósito, porque a decisão foi tomada
por medição e não por gosto.
