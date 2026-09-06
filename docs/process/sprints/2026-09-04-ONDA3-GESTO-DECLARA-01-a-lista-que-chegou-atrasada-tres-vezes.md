---
sprint: ONDA3-GESTO-DECLARA-01
estado: feita
onda: 3
posse:
  DECLARA:
    - src/hefesto_dualsense4unix/interface/pacotes/__init__.py
    - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
    - tests/unit/test_todo_gesto_que_grava_esta_protegido.py
nao_toca:
  - docs/data/paridade-gtk-html.csv
depois_de: [ONDA4-S10-O-TRANSPORTE-01, ONDA5-P-01, A-TELA-SAMBA-01]
---

> **ROTA 06/09/2026:** `estado: aberta`, ONDA D do plano das 24 horas. `PERIGOSOS` mora em `hefesto_vivo.py`, e esta sprint o deriva do registro — logo o arquivo entrou na posse (só esse bloco) e saiu do `nao_toca`; espera a S-10 (mesmo `pacotes/__init__.py`), a A-TELA-SAMBA-01 e a P-01 (mesmo piloto).

# A lista que chegou atrasada TRÊS VEZES no mesmo dia

**Isto não é uma cura de defeito — é a cura da FORMA de um defeito**, e ela só
pôde ser escrita porque o defeito se repetiu três vezes em 04/09/2026, com
frentes diferentes, arquivos diferentes e a mesma assinatura.

## O QUE ACONTECEU TRÊS VEZES

Um gesto aprende a gravar. Ele precisa de **duas linhas em dois arquivos que
ninguém que escreve gestos costuma abrir**:

| onde | o que |
| --- | --- |
| `interface/hefesto_vivo.PERIGOSOS` | para a régua de clique NÃO acioná-lo |
| `tests/unit/test_todo_gesto_que_grava_esta_protegido.ESCREVEM` | para a régua SABER que ele grava |

E as duas listas moram longe do gesto, em posses que a sprint da aba declara no
`nao_toca`. **Quem escreve o gesto não pode fechar o próprio contrato.**

**As três vezes, e as três com a mesma frase no relatório:**

1. `01-jogar·cadeado` — `autoswitch_lock_set`. A régua não conhecia a porta e
   **não acusou**. Sem a linha, a régua de clique mudaria a preferência dela de
   troca automática de perfil.
2. `08-conexoes·renomear-adaptador` — `renomear_o_dongle`. A régua estava cega
   para toda escrita que passasse pelo BlueZ, E lia um nível só (o gesto chama
   um ajudante do mesmo módulo). Ao aprender a descer, revelou **mais oito** de
   uma vez.
3. `05-vibracao·motor` e `05-vibracao·forca-mesa` — `rumble_motores_set` e
   `rumble_policy_set_checked`. A frente escreveu, com todas as letras: *"é a
   mesma cegueira do `autoswitch_lock_set`"*.

**Três vezes é padrão, não azar.** E o custo de cada repetição não é o
conserto — é a JANELA: entre o gesto nascer e alguém lembrar da linha, a régua
de clique pode escrever no disco dela.

## O QUE ESTA SPRINT FAZ

**Tirar as duas listas da lembrança e pô-las no próprio decorador.**

```python
@gesto("05-vibracao.html", "forca-mesa", grava="rumble_policy_set_checked")
```

- O decorador passa a aceitar `grava=` (o nome da porta) e a registrá-lo junto
  com a função.
- `hefesto_vivo.PERIGOSOS` deixa de ser uma lista digitada e passa a ser
  **DERIVADA** do registro: perigoso é o gesto que declara `grava=`.
- A régua de AST continua existindo, e **muda de papel**: ela deixa de ser a
  lista e vira o CONFERENTE — *"você declarou `grava=`? o que a árvore diz?"*.
  Duas fontes independentes, que é regra desta casa.
- Um gesto que grava e NÃO declara reprova; um que declara e não grava também
  (senão a declaração vira ruído e a régua de clique perde cobertura de graça).

## O QUE NÃO PODE ACONTECER

- **A lista não pode ser derivada SÓ da declaração.** Se a única fonte for o
  que o autor escreveu, voltamos ao problema: o autor que esquece a linha
  também esquece o `grava=`. É a régua de AST que fecha esse buraco, e ela tem
  de continuar independente.
- **As isenções continuam sendo do PAR, nunca da porta** — a nota de
  `ISENTOS` explica por quê, e ela sobrevive a esta sprint.

## O QUE FECHA

1. `grava=` existe, é registrado, e `PERIGOSOS` é derivado dele.
2. A régua de AST continua e passa a conferir os DOIS sentidos.
3. Os gestos de hoje migram para a forma nova sem mudar de comportamento — a
   lista derivada tem de sair IGUAL à digitada de hoje, e isso é a prova de
   que a migração não perdeu ninguém.
4. **A MORDIDA:** escreva um gesto que grave e não declare — a régua reprova
   nomeando-o. Declare um que não grave — reprova também.

## O RELATÓRIO FINAL

`docs/process/agentes/2026-09-04/ONDA3-GESTO-DECLARA-01.md` <!-- ref-externa: esta sprint CRIA o relatório; ele nasce no fim da frente -->,
com **o que mudou** · **como provei (a mordida colada)** · **o que medi e
derrubou uma suposição** · **o que sobrou para o próximo**.
