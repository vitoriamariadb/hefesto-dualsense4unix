---
sprint: GATILHOS-VAO-01
estado: feita
onda: A-LISTA-DE-0911
posse:
  GATILHOS-VAO-01:
    - src/hefesto_dualsense4unix/interface/aba03.py
    - src/hefesto_dualsense4unix/interface/pacotes/a03_gatilhos.py
    - mockup/03-gatilhos.html
cria: []
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/interface/monta.py
---

# GATILHOS-VAO-01 — o vão horizontal, e o P2 que perdeu o nome

> **ESTADO 2026-09-11: feita** — o P2 diz `P2 • Desconectado` no DOM vivo com um
> DualSense na mesa (o bloco pousava e o CAMPO o sobrescrevia: cura em
> `pacotes.apagar_os_lugares_sem_dono`, que deixou de apagar o que a aba já
> escrevera por bloco); o retângulo de glifo faltando ao lado do L2/R2 caiu
> junto (fuga octal do Python) e a aba foi publicada; e o vão é de TRÊS páginas,
> não desta sprint — `VAO-DO-ESQUELETO-01`, aberta e esperando a palavra dela.
> Entrega: `docs/process/agentes/2026-09-11/GATILHOS-VAO-01-opus.md`.

> *"tem uma falha horizobntal nos blocos das páginas além disso o p2 tá com -*  <!-- noqa-acento: citação literal dela -->
> *ao invés de P2 - Desconectado como os demais."*  <!-- noqa-acento: citação literal dela -->

---

## §1 — O DEFEITO DO P2 ESTÁ MEDIDO, e a assimetria é a pista

**Na PÁGINA PUBLICADA os quatro cabeçalhos existem e estão certos** — medido em
11/09/2026 lendo `interface/paginas/03-gatilhos.html`:

```
'P1 • Cosmic Red • USB'
'P2 • Starlight Blue • BT'
'P3 • Desconectado'
'P4 • Desconectado'
```

**Na tela dela, com UM controle na mesa, o P2 sai `—` e o P3/P4 saem
`Desconectado`.** Logo o defeito **não é do desenho: é do piloto**, no tique que
repinta a página com a mesa de verdade.

**E o código já sabe que o P2 é o caso difícil.** `a03_gatilhos.py:2054-2085`
tem o laço largo e o comentário que o explica:

> *"com um controle só na mesa, o P2 é um lugar que a PÁGINA dá por conectado.
> Sem esta linha ele continuaria com o «Starlight Blue» do desenho"*

A cura de lá escreve o cabeçalho por **BLOCO** (`blocos[seletor_do_chip(pref)]`),
e não por **CAMPO** — porque emitir coluna para o P2 custaria o
`data-conectado="nao"` que segura o `pointer-events:none`. **A hipótese mais
forte é que esse bloco não está pousando**, e o que sobra é o `escrever()` do
piloto trocando vazio por travessão (`TRAVESSAO = "—"`, `a03_gatilhos.py:361`).

**Meça antes de curar:** com um controle só, leia no DOM vivo o que há dentro do
`data-campo="chip-do-controle"` do P2, e diga se o bloco pousou, pousou vazio,
ou não pousou. **Os três diagnósticos têm curas diferentes** — e a guarda
`if CAMPO_DO_CHIP not in (colunas.get(pref) or {})` da linha 2084 é a primeira
suspeita, porque ela já foi escrita para impedir um buraco e pode estar criando
outro.

## §2 — O VÃO HORIZONTAL, e por que ele NÃO é só desta aba

Ela disse *"nos blocos das páginas"* — plural. Na foto da Gatilhos o quadro
«Seleção de Gatilho» termina e sobra uma faixa vazia grande até o rodapé, e o
quadro não se estica para ocupá-la.

**A regra desta casa manda procurar o dono antes de remendar a aba:** se a falha
vier do esqueleto (`monta.py`), consertar aqui pagaria o preço uma vez por aba —
é o defeito de forma que a casa já nomeou quinze vezes.

**`monta.py` está em `nao_toca` de propósito.** Meça: reproduza o vão nas dez
páginas com `--oculta` e diga **em quantas ele aparece**.

* **Se for só a 03** — é sua, cure aqui.
* **Se for de várias** — a cura é do esqueleto e **não é desta sprint**: escreva
  o achado no relatório com a lista das abas afetadas e a medida do vão em cada
  uma, e deixe uma sprint nova escrita (`estado: aberta`) com posse de
  `monta.py`. **Não toque no esqueleto** — três agentes desta leva dependem dele
  ao mesmo tempo.

## §3 — A FRASE QUE FICOU PELA METADE

Ela escreveu, em seguida: *"falta a tag chegam em todos os demais lançadores"*.  <!-- noqa-acento: citação literal dela -->
A frase junta duas queixas e **a segunda metade é de outra sprint**
(`JOGOS-DOS-LANCADORES-01`). Do que é desta aba, o que se lê é a **tag/chip do
controle** faltando onde os outros têm — que é exatamente o defeito do P2 da §1.
**Não invente a terceira leitura**: se ao medir você achar outra tag faltando na
Gatilhos, nomeie-a no relatório e cure; se não achar, diga que não achou.

## §4 — O QUE ENTREGAR

1. **O P2 diz `P2 • Desconectado`** com um controle na mesa, e o P3/P4 continuam
   dizendo. A prova é o DOM vivo, não o HTML do disco.
2. **O diagnóstico do vão**, com o número de abas afetadas.
3. **A MORDIDA**: arranque a cura do P2 e veja a régua reprovar — a
   `aba03.py:1540` já exige a frase nos lugares vazios; ela precisa passar a
   exigir também no lugar que a página dá por conectado e a mesa não tem.
4. Se mexer no desenho: gere `mockup/03-gatilhos.html` e publique com
   `--publicar 03`.

## §5 — O QUE É DELA

**O olho na foto.** E a decisão sobre o vão, se ele for do esqueleto: mudar o
esqueleto muda as dez abas de uma vez, e isso ela vê antes.
