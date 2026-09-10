---
sprint: SOM-NA-TELA-01
estado: aberta
onda: MESA-COMPLETA
posse:
  ESCREVE:
    - src/hefesto_dualsense4unix/interface/aba02.py
    - src/hefesto_dualsense4unix/interface/pacotes/a02_controles.py
cria: []
bancada: false
depois_de:
  # A posse é a MESMA aba (`aba02.py` + `pacotes/a02_controles.py`), e três
  # sprints abertas nela é colisão que o portão pega — corretamente. A ordem é
  # esta: a MIC-SEM-FONTE-01 já estava em voo antes destas duas.
  - SFX-POR-CONTROLE-01
  - MIC-SEM-FONTE-01
nao_toca:
  - novo-layout/
---

# SOM-NA-TELA-01 — a fonte de cada um chega à tela

**Lote A, sprint 3.** Escrita em 10/09/2026 depois de MEDIR a tela e o código —
e a medição derrubou a premissa com que ela foi anunciada.

## §0 — A PREMISSA DO ÍNDICE ESTAVA ERRADA, e este é o achado da sprint

O índice dizia:

> *"A3 — ligar/desligar o som por controle | **o botão existe; falta ele valer
> só para aquele controle**"*

**Medido no fonte em 10/09/2026: ele JÁ vale só para aquele controle.** O gesto
`mudo` (`a02_controles.py`) faz, no lado do alto-falante:

1. lê o `uniq` do clique e **recusa sem ele** (`"mudo: o clique não disse em
   qual controle"`);
2. chama `speaker_set(muted=…, uniq=uniq, **_volume_conhecido(dele))` — o alvo
   vai no parâmetro, não numa rota global;
3. **confessa quando o daemon mexeu em outro** (`frase_do_alvo_do_mic` /
   `alvo_honrado`), que é a trava contra o defeito *"aparece como sucesso"*;
4. grava por `_lembrar_do_som(ctx, uniq, speaker=…)`, o escritor único.

A frase do índice foi escrita de manhã, antes de alguém abrir este arquivo.
**Ela sai daqui**, pela lei do fato errado — e o que sobra no lugar é o buraco
de verdade, medido abaixo.

## §1 — O BURACO REAL: a `fonte` não tem gesto

A **A2 (SFX-POR-CONTROLE-01)** fiou o produto para respeitar
`ControllerOverrides.speaker.fonte` — `mix` ou `sfx`, por controle, com cache e
régua. E **nenhuma aba grava esse campo**:

```
grep -rn '"fonte"' interface/ app/   →  zero escritor de speaker.fonte
```

O produto obedece a uma escolha que ela não tem como fazer. É a mesma família
do defeito-mãe desta casa, virada do avesso: em vez de *"a escolha dela gravada
e sem efeito"*, é *"o efeito pronto e sem escolha"*.

## §2 — E A ARMADILHA, que é de PALAVRA e precisa da decisão dela

A coluna do som já tem um par de botões que **parece** dizer isto:

| na tela | o que faz de verdade | camada |
| --- | --- | --- |
| **Sons do jogo** | `OUTPUT_PATH_SEL = 2` — canal esquerdo para a TV, direito para o plástico | firmware (2) |
| **Todo o som do PC** | **MOVE** o som: `pactl set-default-sink` para o controle **e** o byte | sistema (1) + firmware (2) |

E a `fonte` do nó é uma **terceira** coisa:

| | o que faz |
| --- | --- |
| `sfx` | o nó fica livre para a corrente que o jogo mandar (o padrão) |
| `mix` | o monitor da saída padrão cai TAMBÉM no nó — **sem tirar o som da TV** |

**A diferença que importa para quem joga:** *"Todo o som do PC"* tira o som da
televisão e o põe no controle; `mix` faz o controle ouvir **junto** com a
televisão. Numa mesa de quatro, a segunda é a que faz sentido — e é a que não
está na tela.

> **ISTO É DECISÃO DELA, e não é de agente.** O gerador da aba já recusou uma
> vez *"duas gramáticas para escolher a rota do som na mesma coluna"* — e um
> terceiro par de botões ali é exatamente isso. As opções que eu vejo:
>
> **(a)** um par novo — *Só efeitos* / *Ouvir junto com a TV* — abaixo do que
> já existe;
> **(b)** a fonte vira o TERCEIRO estado do par que já existe: *Sons do jogo ·
> Ouvir junto · Todo o som do PC*;
> **(c)** a fonte não vai à tela: fica no perfil, para quem edita o arquivo.
>
> **Minha recomendação é a (b)**, e a razão é a coluna: os três são a mesma
> pergunta — *"o que este controle ouve?"* — e três botões numa fileira que já
> tem dois custam zero altura. A (a) põe uma segunda gramática na mesma coluna,
> que é o que o gerador já recusou.

## §3 — O QUE FAZER, quando a decisão sair

1. o gesto `fonte` no `aba02.py`, no padrão do `mic-modo` (dois botões
   `data-gesto=… data-campo=… data-hef-alvo="classe" data-hef-quando=…`);
2. o handler em `a02_controles.py`, gravando por `_lembrar_do_som(ctx, uniq,
   speaker={"fonte": …})` — o escritor único, nunca `controllers[...]` à mão;
3. o campo pintado, lido do perfil ativo daquele controle;
4. régua: o clique num cartão **não** muda a fonte do vizinho, e o valor
   sobrevive ao "Salvar" (é o item 13 daquele laudo, do outro lado);
5. **a foto, o clique e a mordida** — a regra da casa para tela, sem exceção.

## §4 — O QUE É DELA

* **a decisão da §2** (a, b ou c) — sem ela esta sprint não começa;
* **a validação de tela**: foto antes/depois, o clique, e o olho dela. A régua
  não substitui, e a interface só fecha com a palavra dela.
