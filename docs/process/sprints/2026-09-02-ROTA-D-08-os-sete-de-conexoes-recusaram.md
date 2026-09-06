---
sprint: ROTA-D-08
estado: feita
---

# ROTA D · aba 08 — os sete "aplicados" que na verdade RECUSARAM

> **ESTADO 06/09/2026: feita** — fase fechada em 02–03/09 (ONDE PARAMOS de 02/09, fim do dia; a aba 03 em 03/09).

**02/09/2026.** A ONDA D pede que os dezesseis gestos que *"dizem aplicado e
não mudam nada"* sejam **classificados antes de consertados**, em três montes:
(a) recusou com razão · (b) o daemon não ecoa · (c) mentiu.

Sete dos dezesseis são da aba Conexões:

```
escolher-aparelho · escolher-entrada · luz-nao-acende ·
nova-entrada · nova-extensao · nova-face · tirar-daqui
```

**O monte (c) está VAZIO.** Nenhum dos sete mentiu, e a medição abaixo é a
prova. Esta sprint não conserta gesto nenhum — ela **trava a classificação
numa régua**, para que a próxima leva não "conserte" o que está certo.

---

## 1. A MEDIÇÃO — dublê da ponte, nenhum comando ao daemon vivo

Dois cliques por gesto: o **CEGO**, exatamente como o instrumento clicou em
02/09 (o controle da coluna, e nada do botão), e o **DIRIGIDO**, com o
argumento que o botão carrega no HTML.

| gesto | clique CEGO | clique DIRIGIDO | chamou a ponte |
| --- | --- | --- | --- |
| `escolher-aparelho` | `ValueError` | ACEITOU | **NADA** |
| `escolher-entrada` | `ValueError` | `RuntimeError` (falta o 1º tempo) | — |
| `tirar-daqui` | `ValueError` | ACEITOU | `machine_declare` |
| `nova-entrada` | `ValueError` | ACEITOU | `machine_declare` |
| `nova-extensao` | `ValueError` | ACEITOU | `machine_declare` |
| `nova-face` | `ValueError` | ACEITOU | `machine_declare` |
| `luz-nao-acende` | `ValueError` | `RuntimeError` ("está no cabo") | — |

As frases, literais:

```
escolher-aparelho  o clique não disse qual aparelho — sem o caminho do kernel,
                   dois adaptadores iguais seriam o mesmo botão.
escolher-entrada   escolha antes o aparelho, na lista de cima — este gesto tem
                   dois tempos: primeiro o que vai, depois onde vai.
nova-face          a face precisa de um nome — escreva no campo ao lado antes
                   de clicar. Sem nome, não cria.
luz-nao-acende     este controle está no cabo, e no cabo a barra de luz não
                   depende de reconexão nenhuma. A cura é do rádio: derrubar a
                   conexão para você apertar PS.
```

**Os sete recusaram, cada um dizendo o que falta.** Nenhum respondeu
"aplicado".

---

## 2. POR QUE A RÉGUA LEU "MENTIU" — e o defeito é dela, não dos gestos

`_depois_do_gesto`, em `src/hefesto_dualsense4unix/interface/hefesto_vivo.py`,
fotografa o estado do daemon antes do clique, espera, fotografa depois, e
compara. **Ela não pergunta se o gesto levantou.**

Quando o gesto levanta, o piloto imprime `[gesto falhou]` no `stderr` e
`self.aplicados` **não recebe nada** — mas a prova já foi guardada como "sem
efeito". Sem `SEM_ECO`, o gesto entra na linha final:

```
sem efeito e sem `SEM_ECO`: escolher-aparelho, escolher-entrada, ...
```

**"Sem efeito e sem `SEM_ECO`" não quer dizer "disse aplicado".** Um gesto que
recusou dizendo cai na mesma lista de um que mentiu — e foi assim que sete
recusas viraram sete acusações no mapa de 02/09.

O conserto do instrumento é da frente que tem o `hefesto_vivo.py` na mão. O que
esta sprint faz é o que cabe ao pacote: **declarar o que não ecoa, com a razão**.

---

## 3. A CLASSIFICAÇÃO, e o que ela impõe

### (b) o daemon não ecoa — os SEIS do mapa do gabinete

**Medido contra o daemon vivo em 02/09:** o `state_full` tem **47 chaves de
topo**, e **nem `mapa` nem `maquina` está entre elas**. O caminho é
`machine_declare` → `_handle_machine_declare` (`daemon/ipc_handlers.py`) →
`maquina.json`, e ali ele para. Nada volta pelo estado.

O desenho do gabinete dela é **declaração em disco**, não estado de aparelho —
barramento nenhum responde "quantas faces tem o seu gabinete".

`escolher-aparelho` entra pela razão **oposta**: ele é o primeiro tempo do gesto
de dois, guarda o aparelho na mão (`LogicaDoMapa.escolhido`) e **não chama a
ponte de forma nenhuma**. Não há o que ecoar porque não há o que gravar.

Os seis foram acrescentados ao `SEM_ECO` do pacote, cada um com a razão escrita
ao lado — porque **`SEM_ECO` sem razão é lápide para esconder defeito**.

### (a) recusou com razão — `luz-nao-acende`, e ele FICA FORA do `SEM_ECO`

Ele é o único dos sete **com eco de verdade**: derrubar um controle do rádio o
tira da lista `controllers` do `state_full`. Declará-lo sem eco cegaria a régua
exatamente onde ela mais enxerga — um `Disconnect` que não derrubasse nada
passaria a contar como sucesso, que é o desfecho que
`gesto_de_reconexao.Resultado.nao_deu` existe para acusar.

A recusa medida estava CERTA: o instrumento clicou com o controle do **cabo**, e
no cabo a barra de luz não depende de reconexão. **Não conserte isto.**

### (c) mentiu — vazio

---

## 4. A RÉGUA QUE TRAVA A CLASSIFICAÇÃO

`tests/unit/test_os_sete_de_conexoes_recusam_dizendo.py` — 24 casos:

1. os sete recusam DIZENDO no clique cego, e nenhum toca a ponte ao recusar;
2. `escolher-aparelho` guarda na mão e não fala com o daemon;
3. os quatro que gravam mandam o gabinete **inteiro** (meia lista apagaria as
   faces que ela já tinha);
4. o gesto de dois tempos grava no segundo, e tira o aparelho de onde estava;
5. `luz-nao-acende` recusa no cabo, **e não está em `SEM_ECO`**;
6. os seis do gabinete **estão** em `SEM_ECO`;
7. todo `SEM_ECO` desta aba tem razão escrita **onde a razão mora**.

**AS QUATRO MORDIDAS, e a quarta consertou a própria régua:**

| o que arranquei | o que reprovou |
| --- | --- |
| `escolher-entrada` fora do `SEM_ECO` | `test_os_seis_do_gabinete_estao_declarados_sem_eco` |
| `luz-nao-acende` dentro do `SEM_ECO` | `test_a_luz_nao_e_sem_eco_porque_derrubar_do_radio` |
| a recusa do cabo, no `luz_nao_acende` | `test_a_luz_no_cabo_...` **e** `test_nenhum_dos_sete_e_o_monte_c` |
| um `SEM_ECO` sem razão (`mic-escopo`) | **passou VERDE na primeira tentativa** |

A quarta é a que vale contar. A régua da razão procurava o nome em **qualquer**
comentário do arquivo, e `mic-escopo` já aparecia mil linhas acima, num
inventário de contradições, sobre outro assunto. **A régua mediu a palavra, não
a razão** — o modo de falhar mais frequente desta casa. Apertada para procurar
só onde a razão mora (o bloco `#:` colado na tupla, e os docstrings das funções
de gesto), ela morde.

**E a terceira mordida achou um risco na própria régua:** com a recusa do cabo
arrancada, o caso chegou ao BlueZ de verdade e o log da suíte imprimiu
`reconexao_ja_estava_fora` com o endereço do controle dela. Nada caiu — o do
cabo não estava no rádio —, mas o caminho estava aberto. O `desconectar` virou
dublê numa fixture `autouse`: **um teste unitário não fala com o rádio de
ninguém.**

---

## 5. O QUE ESTA SPRINT NÃO FEZ

- **Não consertou o `hefesto_vivo.py`.** O instrumento que confunde recusa com
  mentira é território de outra frente.
- **Não ligou o `novo-hub`.** A onda devolveu `viavel: false` e *"a razão não é
  técnica"* — espera decisão dela.
- **Não mexeu na pintura.** Esta aba escreve 8 dos 11 campos, e os 3 que faltam
  são do cabeçalho comum, que já tem dono em `pacotes/__init__.py:topo()`.
- **Não estendeu a régua da razão às outras nove abas.** Medida com a mesma
  régua, `a05_vibracao` reprovaria por `testar` — citado no comentário pelo
  RÓTULO ("Testar") em vez do identificador. É defeito de grafia, e o conserto é
  de quem tem a aba 05 na mão.
