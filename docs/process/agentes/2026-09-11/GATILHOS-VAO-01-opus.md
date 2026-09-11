# GATILHOS-VAO-01 — o vão horizontal, e o P2 que perdeu o nome

Árvore `hefesto-voo/GATILHOS-VAO-01-opus`, branch `voo/GATILHOS-VAO-01-opus`,
nascida de `onda/0911` (`779c71f8`). Bancada LIVRE e **não reservada**: nenhum
caminho desta frente parou o daemon, escreveu no aparelho nem chamou
`systemctl`. Havia **um DualSense por rádio na mesa** durante as medições, e ele
entrou nelas — o piloto leu a mesa que o daemon publicava.

---

## O que mudou

### 1. O P2 volta a dizer `P2 • Desconectado` — e a causa não era a que a sprint supunha

**A sprint dava três diagnósticos possíveis** (o bloco não pousa · pousa vazio ·
não pousa) e apontava a guarda de `a03_gatilhos.py:2084` como primeira suspeita.
**Medido, é um quarto: o bloco POUSA, e o CAMPO escreve por cima dele.** A
guarda está certa.

O caminho, medido no DOM vivo (`WebKit2.WebView`, `--oculta`, aba 03, um
DualSense por rádio no P1):

```
ANTES                                  DEPOIS
p1  'P1 • Starlight Blue • rádio'      p1  'P1 • Starlight Blue • rádio'
p2  '—'                    ← a queixa  p2  'P2 • Desconectado'
p3  'P3 • Desconectado'                p3  'P3 • Desconectado'
p4  'P4 • Desconectado'                p4  'P4 • Desconectado'
```

**A mecânica, nos dois passos que o separam:**

1. `a03_gatilhos.pacote()` emite o chip do P2 em `blocos`
   (`[data-controle="p2"] [data-campo="chip-do-controle"]`) — e emite certo.
2. `pacotes.apagar_os_lugares_sem_dono()` enche a coluna do lugar sem dono com
   `dict.fromkeys(chaves, '—')`. `chip-do-controle` está em `chaves` porque as
   **outras três** colunas o emitem por campo.
3. O piloto pinta **blocos no passo 0** e **campos no passo 2**
   (`hefesto_vivo.py`, o `BOOTSTRAP`): a segunda escrita ganha. No tique
   seguinte o bloco se cala sozinho (`alvo.__hefBloco === html`) e o travessão
   fica **para sempre**.

**A cura é a regra que esta casa já escreve em toda parte — não se escreve duas
vezes no mesmo elemento.** `apagar_os_lugares_sem_dono` passa a não apagar o
endereço que a carga já mandou por BLOCO para aquele lugar
(`_o_que_o_bloco_ja_escreveu`). Três linhas, e ela é **geral**: a cura de
05/09 conhecia esta mesma causa e cobriu UM nome de campo (`identidade`, da aba
05); seis dias depois a falta voltou noutra aba com outro nome de campo. É a
regra desta casa — *quando a cura conhece a causa, ela cobre todos os
chamadores* — cobrada por dentro.

**O que a cura NÃO custou, e era o risco:** o P2 continua em `vazios`, logo
continua recebendo `data-conectado="nao"` e a classe `off`. A borda apagada, o
`pointer-events:none` dos `<select>` e dos botões, e a recusa do gesto ficam
todos de pé — conferido no DOM vivo (`p2 data-conectado='nao'`). O caminho
óbvio (emitir uma `colunas` para o P2) quebrava exatamente isso, e há régua
nova segurando esse lado.

### 2. O retângulo de glifo faltando ao lado do L2 e do R2 — achado olhando a foto

Não estava no enunciado. A foto do produto publicado mostrava, ao lado do glifo
do L2 e do R2, **o retângulo de "glifo faltando" colado num `be`**. A causa é do
Python, não do navegador: `aba03.py` escrevia `content:'\25be'` dentro de uma
string, e ali `\25` é **fuga OCTAL** — o gerador emitia o byte `0x15` mais as
duas letras que sobravam. Confirmado por `hexdump` da página publicada
(`content:'<15>be'`). O navegador nunca viu fuga nenhuma.

Curado com o caractere cru (`▾` / `▴`), que é como `topo.html` e `aba08.py` já
escreviam. O gerador rodou, o desenho foi para `mockup/03-gatilhos.html` e a aba
foi **publicada** (`--publicar 03`) — sem publicar, a tela dela não mudaria.

### 3. O vão: são TRÊS páginas, não uma — e a cura é decisão DELA

Medido nas dez páginas publicadas, Chrome headless, 1920x1080, moldura de
1600px, sem janela na tela dela. O vão é o que sobra entre o fim do último
elemento visível do `.miolo` e o fundo útil dele:

| página | vão | | página | vão |
| --- | ---: | --- | --- | ---: |
| `08-conexoes` | **163 px** | | `04-iluminacao` | 4 px |
| `03-gatilhos` | **161 px** | | `07-lancadores` | 0 px |
| `01-jogar` | **142 px** | | `09-sistema` | 0 px |
| `05-vibracao` | 24 px | | `10-perfis` | −20 px |
| `06-navegacao` | 23 px | | `02-controles` | −267 px |

**É de várias, logo não é desta sprint** (§2 do enunciado), e o esqueleto NÃO
foi tocado. Fica escrita, `estado: aberta`,
`docs/process/sprints/2026-09-11-VAO-DO-ESQUELETO-01-a-faixa-vazia-de-tres-paginas-e-a-decisao-de-27-08.md`,
com posse de `topo.html` + `monta.py`.

**E ela nasce PARADA, esperando a palavra dela, porque a medição derrubou a
premissa do enunciado** — ver "O que caiu da sprint".

### 4. A §3 do enunciado: NÃO achei outra tag faltando na Gatilhos

Procurada no DOM vivo, e a resposta é negativa de propósito. A fita do topo
trazia UM chip (`'P1 • Starlight Blue • rádio'`) com um controle na mesa, e o
`Todos` **não** estava lá: conferido em `monta.fita` — `escolha_da_fita` esconde
o `Todos` quando há um só controle, com a razão escrita (*"ali não há segundo
conjunto a escolher"*). **É desenho, não falta.** A única tag que faltava na
Gatilhos era a do P2, que é a §1.

---

## Qual mordida prova

### Mordida 1 — a cura do P2, arrancada

`chaves - ja_escrito.get(pref, set())` trocado por `chaves` em
`pacotes.apagar_os_lugares_sem_dono`:

```
E  AssertionError: a coluna de p2 chega à tela com '—' no cabeçalho. O bloco já
   escrevera '<span class="chip vazio" …>P2 • Desconectado</span>' ali, e o molde
   passou por cima — duas escritas no mesmo elemento, e a última vence. É a
   queixa dela de 11/09/2026, palavra por palavra.
FAILED tests/unit/test_aba03_o_selo_do_lugar_vazio.py::test_o_p2_sem_aparelho_diz_desconectado_na_tela
1 failed, 6 passed
```

Devolvida: `7 passed in 0.52s`.

**A régua nova mede o que a TELA recebe, e é por isso que ela morde.** As cinco
que já existiam naquele arquivo param no que `pacote()` devolve — e **as cinco
estavam VERDES** com o travessão na tela dela. `_o_que_a_tela_recebe` passa pelos
dois passos que faltavam (`normalizar` e `apagar_os_lugares_sem_dono`), na ordem
em que `hefesto_vivo.Piloto._tique` os chama.

### Mordida 2 — a cura FÁCIL, a que quebraria a moldura

O laço dos vazios de `a03_gatilhos.pacote()` passando a emitir coluna também
para o lugar que a página dá por conectado (`_todos_os_lugares_da_pagina()` no
lugar de `_lugares_que_o_desenho_da_por_vazios()`):

```
E  AssertionError: o P2 saiu da lista de vazios: []. Sem ela o piloto não escreve
   `data-conectado="nao"`, e a coluna de um lugar sem aparelho volta a parecer —
   e a responder — como uma viva.
FAILED …::test_o_lugar_sem_dono_continua_com_a_moldura_de_vazio
1 failed, 6 passed
```

Devolvida: `7 passed`.

### Mordida 3 — a fuga octal de volta

```
ERRO em 03-gatilhos — decisão dela desfeita:
  - há caractere de controle no documento (0x15) — ele vira o retângulo de glifo
    faltando na tela dela. Quase sempre é uma fuga CSS `\NN` lida como OCTAL pelo Python
  - a seta '▾' do glifo da seção sumiu do CSS — o L2 e o R2 deixam de dizer se a
    seção abre ou fecha
  - a seta '▴' do glifo da seção sumiu do CSS — …
```

Devolvida: `03-gatilhos: OK, 83 divs · …`.

### O escopo, rodado inteiro

Os 15 arquivos de teste que tocam `apagar_os_lugares_sem_dono` /
`TODOS_OS_LUGARES`, mais os cinco da aba 03: **367 passed**.

---

## O que NÃO verifiquei

* **O olho dela.** PROVA-DE-TELA-01 continua de pé: as fotos e o DOM estão
  medidos, a palavra final é dela.
* **A mesa de DOIS ou mais.** Só havia **um** DualSense na mesa durante a
  sessão, e a bancada não foi reservada (`bancada: false`). A mesa de dois — em
  que o P2 tem dono e o chip dele volta a sair por CAMPO — foi exercitada só no
  dublê (`MESA_DELA`, dois controles), nunca no aparelho. **A prova de aparelho
  da mesa de quatro fica para a MESA-DE-QUATRO-01.**
* **A aba 05 e as outras que usam `apagar_os_lugares_sem_dono`.** A mudança é
  no despachante, e rodei os 15 arquivos de teste que o tocam — mas **não** abri
  as outras nove abas no DOM vivo para ver se alguma delas dependia, sem saber,
  de o molde escrever por cima de um bloco seu. O grep diz que só a `a03` emite
  bloco com a forma `[data-controle=…] [data-campo=…]`; o DOM não foi
  perguntado nas outras nove.
* **A suíte inteira** — é de quem coordena, e roda no fim (regra da casa).
* **Nenhuma célula do mapa de canais foi exercitada.** Esta frente é de TELA:
  não houve escrita no aparelho, nem leitura de canal, nem transporte medido.
  Não há linha de `mapa-controles.csv` a marcar por causa dela.

---

## O que sobrou para o próximo

1. **`VAO-DO-ESQUELETO-01`** (escrita, `estado: aberta`) — e a §4 dela é uma
   pergunta para ELA, não trabalho para um agente. Três páginas com faixa
   grande, e os dois caminhos óbvios são os dois que ela já recusou em 27/08.
2. **O selo do P2.** O chip do lugar que a página dá por conectado sai por
   BLOCO, e bloco não carimba `data-hef-visto`. Antes desta frente ele tinha
   selo — sobre um travessão. Agora diz a verdade sem selo. A régua do mockup
   continua classificando o campo como PRODUTO (o valor difere do cravado
   `P2 • Starlight Blue • BT`), então nada regrediu — **mas o dia em que a
   página publicada nascer com os quatro lugares vazios, esse campo vira
   indecidível.** A cura estrutural é o piloto deduzir "vazio" da MESA em vez de
   "quem não emitiu coluna", e ela é de `hefesto_vivo.py`.
3. **A fuga octal é uma família, não um caso.** Varri `aba03.py` inteiro
   (`\[0-7]{1,3}` dentro de string) e os dois achados eram estes dois. **Os
   outros nove geradores não foram varridos** — é um grep de um minuto e a
   régua nova (`caractere de controle no documento`) é copiável linha a linha.
4. **Fora da posse, e declarado:** `src/hefesto_dualsense4unix/interface/pacotes/__init__.py`.
   A razão está na §1: a cura do lugar sem dono só existe lá, e a alternativa
   dentro da posse custava a moldura do lugar vazio (mordida 2). Nenhuma das
   cinco sprints irmãs do lote 0911-onda1 tem esse arquivo na posse — conferido
   nos frontmatters. Se a costura brigar, é neste arquivo.
