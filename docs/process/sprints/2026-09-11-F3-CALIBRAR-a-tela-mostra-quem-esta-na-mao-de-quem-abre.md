---
sprint: F3-CALIBRAR
estado: feita
onda: A-FILA-DE-0911
posse:
  F3-CALIBRAR:
    - src/hefesto_dualsense4unix/interface/calibrar.py
    - src/hefesto_dualsense4unix/interface/pacotes/a11_calibrar_sensores.py
    - src/hefesto_dualsense4unix/interface/paginas/calibrar-sensores.html
    - mockup/calibrar-sensores.html
    - tests/unit/test_a_calibracao_mostra_quem_esta_na_mao.py
cria:
  - src/hefesto_dualsense4unix/interface/pacotes/a11_calibrar_sensores.py
  - tests/unit/test_a_calibracao_mostra_quem_esta_na_mao.py
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/interface/aba06.py
  - src/hefesto_dualsense4unix/interface/aba10.py
  - src/hefesto_dualsense4unix/interface/mapa.py
  - src/hefesto_dualsense4unix/interface/pacotes/a06_navegacao.py
  - src/hefesto_dualsense4unix/interface/pacotes/a10_perfis.py
---

# F3-CALIBRAR — a tela mostra quem está na mão de quem abre

**11/09/2026.** Nasce da §1 da
[A FILA QUE A ONDA ABRIU](2026-09-11-A-FILA-QUE-A-ONDA-ABRIU-INDICE.md), sobre o
achado da [PAGINAS-ESPECIAIS-B1](2026-09-11-PAGINAS-ESPECIAIS-B1-o-inventario-e-a-lingua.md)
(§2.4). A ordem dela que decide todos os casos de borda é de hoje:

> *"a ideia é que todas as features mesmo do app funcionem nao so pra mim mas*  <!-- noqa-acento: citação literal dela -->
> *pra qualquer outro user"*  <!-- noqa-acento: citação literal dela -->

---

## §1 — O QUE A TELA DIZIA E O QUE O APARELHO RESPONDIA

Medido no daemon dela hoje, com os dois DualSense na bancada
(`daemon.state_full`, leitura pura):

| a tela dizia | o aparelho respondia |
| --- | --- |
| P1 · **Cosmic Red** · USB | P1 · **Starlight Blue** · USB |
| P2 · **Starlight Blue** · BT | P2 · **Cosmic Red** · BT |
| giro `+0.2 / -0.1 / +0.0` | `inputs` **sem chave `gyro` nenhuma** |
| accel `+0.105 / +0.976 / +0.170` | `inputs` **sem chave `accel` nenhuma** |

**Os dois controles trocados e as doze leituras inventadas.** A lista vinha de
`monta.CONECTADOS` — o DESENHO, que tem sempre dois — e os números da constante
`calibrar.REPOUSO`, seis por controle, escritos à mão em 31/08. **Com quatro na
bancada ela veria dois**; com um, a página escrevia *"dos 1 controles"*
(curado na onda da língua, horas antes desta sprint, tirando o número da frase).

A causa é uma só: `calibrar-sensores.html` tinha **0 `data-campo`, 0
`data-gesto` e nenhum pacote**. O piloto abria, anotava *"página trocada no meio
do tique: calibrar-sensores.html 1"* e **pintava zero valores** — por onze dias,
sem uma linha de erro.

## §2 — O QUE MUDOU

**O gerador (`interface/calibrar.py`)**

* `REPOUSO` **morreu**. Os seis eixos de cada cartão nascem no travessão —
  `mesa_viva.SEM_LEITOR`, o «ninguém leu» desta casa — e o tique os preenche.
  *Um arquivo que nasce com número é um arquivo que mente quando o tique não
  vem*, e esta página provou isso por onze dias;
* cada eixo ganhou **três endereços** (`giro-x`, `-neg`/`-pos`, `-cor`), na
  gramática que a aba Controles já usa: o número é texto, cada metade da barra é
  largura, a cor sobe para o trilho. O risco do centro virou `::after`, que é o
  que abriu lugar para a leitura sem apagar o desenho aprovado;
* o bloco dos cartões ganhou endereço (`[data-bloco="controles"]`) e a classe
  passou de `.mesa` a `.controles` — a palavra é banida na tela por decisão dela
  de 06/09, e um endereço novo nasce na língua de hoje;
* `controles(quem)` com a lista **vazia** devolve a frase, nunca um cartão:
  *"Nenhum controle conectado. Ligue um pelo cabo ou pelo rádio e ele aparece
  aqui."* — `cabo` · `rádio` são as palavras do glossário, §1;
* `plural()` e `contagem()` são o dono da concordância desta página, e os dois
  lados leem daqui.

**O pacote (`pacotes/a11_calibrar_sensores.py`, novo)**

Remonta o bloco dos cartões **pelo próprio gerador** — nunca por HTML escrito
lá —, escreve a leitura de cada eixo pelos donos do produto
(`controller_card.gyro_do_inputs`, `sensor_widgets.texto_eixo`,
`mesa_viva._barra_bipolar`, `a02_controles.meias_da_barra`) e diz quantos são.

**O `a11_` não é a aba 11.** O prefixo existe porque é o que as réguas desta casa
varrem (`glob("a??_*.py")`): um arquivo fora dele nasceria invisível para o
portão da língua.

**O procedimento em três passos não mudou** — é o desenho aprovado. O que mudou
é de quem são os números.

## §3 — O QUE ISTO ACHOU NO CAMINHO, e é de TODAS as abas

**O CONTADOR DE PINTURAS MENTIA EM TODA BARRA DE NÚMERO REDONDO.** Com a
bancada parada e um dublê de daemon, a calibração mediu **60 tiques · 60
pinturas · 69 valores — e ZERO mutações de DOM**.

O defeito não é samba, e é por isso que atravessou as cinco réguas do
`test_a_tela_nao_samba.py`: o DOM não se mexe. Sondado neste WebKit:

```
escreve "5.0%"   →  el.style.width devolve "5%"      (o `.0` some)
escreve "22.0%"  →  el.style.width devolve "22%"
escreve "0.4%"   →  el.style.width devolve "0.4%"    (casa)
```

`mesa_viva._barra_bipolar` emite `f"{largura:.1f}"`, então toda barra de número
redondo ia como `5.0`; o CSSOM guarda `5%`; e a comparação ANTES da escrita
(`el.style.width !== t + '%'`) nunca casava. O piloto reescrevia a mesma largura
e somava **+1 por tique, para sempre**.

**Paga quem usar o alvo** — os eixos da `02-controles`, os da calibração e toda
barra futura com uma casa decimal. Por isso a cura foi no `escrever()` do
piloto, na forma que `cor`, `plastico` e `atributo` já usam (**escreve e depois
relê**), e não num pacote: *quando a cura conhece a causa, ela cobre TODOS os
chamadores*. O gêmeo `altura` foi junto — cobrir um é a correção pela metade.

De quebra, ela cura o valor INVÁLIDO: o travessão que `molde_do_lugar` escreve
num lugar sem dono vira `width: —%`, que o CSSOM recusa — e contava uma pintura
que nunca aconteceu, a cada tique.

**E O MOLDE DO DESPACHANTE SAÍA VAZIO, CALADO.** `pacotes._LUGAR_DE_MENTIRA`
não tem chave `cor`; o `KeyError` do gerador caía dentro do `except Exception`
de `molde_do_lugar` e o molde devolvia `{}` sem uma palavra — a forma exata da
*ausência de notícia lida como sucesso*. O cartão passou a ler todo campo por
`.get`, com o travessão no lugar do vazio.

## §4 — A PROVA

| o quê | a medida |
| --- | --- |
| **zero controles** | uma frase, **zero cartões**, rodapé vazio (o alvo `html`, porque o alvo padrão escreveria um `—` solto) |
| **um controle** | um cartão, os números dele, **«1 controle conectado»** |
| **quatro controles** | quatro cartões, **cada um com a leitura DO SEU**, «4 controles conectados» |
| **a bancada dela** | P1 **Starlight Blue · cabo** · P2 **Cosmic Red · rádio** — o inverso do que a tela mostrava |
| **quietude** | 60 tiques · **1 pintura** · 0 mutações (era 60 pinturas) |
| **as réguas** | `test_a_calibracao_mostra_quem_esta_na_mao.py` (15) · duas novas no `test_a_tela_nao_samba.py` |

**As quatro mordidas, conferidas uma a uma:** a lista de volta ao desenho (4
reprovam), a leitura do primeiro controle em todos os cartões (1), o plural
sempre no plural (1), e a largura comparando antes de escrever (2).

## §5 — O QUE FICA ABERTO, e é declarado

1. **O botão «Começar» continua sem dono, de propósito.** Não há método de
   calibração no daemon — nenhum `gyro.*`, `motion.*` nem `sensor.*` em
   `daemon/ipc_handlers.py` zera o repouso. *Um botão que responde calado é pior
   que um que recusa*, e o piloto o recusa dizendo o nome. Ligar a calibração de
   verdade é sprint própria, e ela precisa do aparelho na mesa.
2. **O leitor de movimento nasce fechado.** Medido hoje: `sensores.
   grab_do_movimento = "sem_reader"` nos dois controles dela, e por isso o
   `state_full` sai sem `gyro`. Com o piloto aberto, o `sensor_hub` abre o nó e
   os números aparecem — o que a foto da §4 mostra. Quem for ligar o «Começar»
   encontra este fato primeiro.
3. **`_plural` tem CINCO cópias nesta casa** (`a09_sistema`,
   `desenho_dos_lancadores`, `aba08`, `integrations.ordens_da_mesa` e esta).
   Promovê-las a um dono só é trabalho de outra posse: são quatro arquivos, três
   de território alheio nesta leva.
