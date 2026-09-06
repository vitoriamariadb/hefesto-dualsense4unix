# Achados da leva de 06/09/2026 — o que uma frente achou e outra tem de curar

**Mantido pelo coordenador, na costura de cada onda.** Cada linha nasceu de uma
medição de agente sobre arquivo que não era dele. **Quem receber uma destas no
prompt tem de responder por ela no relatório** — curada ou relatada de novo, com
a medição.

## 1. DÍVIDA DE LÍNGUA — frases que chegam à tela e não passam pelo glossário

| onde | o que diz | por que é dívida | achado por |
| --- | --- | --- | --- |
| `integrations/storm_doctor.py` (as frases de `check_snd_quirk`) | *"cura do travamento do **USB**"* | o glossário manda **cabo**; `USB` é chave crua e só sobrevive na contagem do topo, por decisão dela | ONDA5-01-01 |
| idem | *"rode `./install.sh` para atualizar o Hefesto"* | **"linha de comando" é frase banida**; e mandar a pessoa ao terminal é o defeito que a ONDA5-10-01 fechou na aba 10 | ONDA5-01-01 |
| `pacotes/a10_perfis.py` e `interface/desenho_dos_lancadores.py:863` | duas frases com *"linha de comando"* | banida pelo glossário | ONDA5-02-02 e ONDA5-10-01 |

**O alcance é de DUAS abas** (01 e 09) para as duas primeiras: uma edição no
dono conserta as duas telas. **A cura é do dono, não da aba** — cobrir uma
deixaria a próxima pessoa remedindo a mesma frase.

**E FALTA O PORTÃO:** *"linha de comando"* é banida pelo glossário e **nenhuma
régua desta casa a cobre** (medido pela ONDA5-10-01). Pô-la na lista global
esbarra numa ocorrência legítima em `desenho_dos_lancadores.py` — logo o portão
precisa distinguir texto de tela de prosa de código, como a guarda que a
`ONDA5-01-02` construiu (literais por `ast`, comentários por `tokenize`).

## 2. INSTRUMENTOS FALSOS ACHADOS NESTA LEVA — e o que cada um ensinou

| régua | o que ela media | quem achou |
| --- | --- | --- |
| `aba09.py` (a guarda do rótulo) | comparava o HTML montado com **a constante que o montou** — os dois lados mudam juntos | o coordenador, refazendo a mordida na costura |
| `test_a_prioridade_viaja_de_verdade_no_load_module` | mede **o texto do argv**, não o aparelho; o `PRIORIDADE_SESSAO_DA_PONTE = 1500` nunca chega ao nó (nasce 2000) | ONDA5-MIC-VIRTUAL-01 |
| a régua do `.exame.apagada` (08) | cobrava **a presença do nome** da classe; passava com uma folha que não esmaece nada | ONDA5-08-01, contra a própria régua |
| as duas mordidas da `ONDA5-09-01` | trocar só o valor da constante deixava gerador e régua verdes | a própria 09-01 |
| a régua do gesto de vibração | injetava um `uniq` que **o piloto nunca manda** | ONDA5-05-02 |

**A assinatura é uma só:** *a régua respondia sobre outra coisa que não o
produto*. E a única forma de as achar foi **arrancar a cura e olhar de novo**.

## 3. DEFEITOS VIVOS RELATADOS E NÃO CURADOS — com dono candidato

| defeito | endereço | dono candidato |
| --- | --- | --- |
| `module-pipe-source` nasce `Mute: yes` — entrega **192 KB de zeros**, não silêncio | a ponte de rádio | MIC-VIRTUAL-02 (onda C) |
| `source_properties` perde tudo depois do primeiro espaço; a prioridade nunca chega ao nó | idem | MIC-VIRTUAL-02 |
| `ordens_novas`/`ordens_caladas` comparam sem exigir arranjo — com o desfazer novo, uma `Ordem` viva nasceria **calada** | `integrations/ordens_da_mesa.py` | ONDA5-08-02, senão T-10 |
| a fita da aba 07 é a **do mockup**, com um chip "Todos" que a viva não tem | `pacotes/a07_lancadores.py:927` | ONDA5-07-01 (onda B) |
| dois donos do `chip-do-controle` do lugar vazio: a coluna P2 mostra travessão pelado onde P3/P4 dizem "Desconectado" | `pacotes/a03_gatilhos.py` + `pacotes.apagar_os_lugares_sem_dono` | ONDA5-03-02 (onda C) |
| `a09_sistema` passou do teto de 100 ms em 7 de 40 tiques, pico **1.394 ms** — e **não é o `profile.list`**: `estado_do_daemon()` tem mediana 0,48 ms | `pacotes/a09_sistema.py` | SISTEMA-STEAM-01 (onda C) |
| a régua do mockup **não enxerga** `02·p1-card-aberto` e `04·auto-cores` — o parser lê `''` e a página virgem mostra `'sim'` | os dois alvos `marcado` | ONDA5-02-01 e LUZES-01 |
| `left:auto;right:22px` em `aba02.py:1920` — o mesmo arranjo que punha 224 px da dica fora da janela na aba 05; **não medido aqui** | `aba02.py` | ONDA5-02-01 |
| **nenhuma régua desta casa mede `.dica`** — a `regua_popup.py` só mede `.tela-nova`; foi por isso que 224 px de texto cortado atravessaram semanas | — | o coordenador, no FECHO |

## 4. AMBIGUIDADE ESTRUTURAL — `data-controle` tem dois significados

O SVG guarda o **modelo** (`"dualsense"`); o piloto usa o **assento**
(`p1`…`p4`). Quatro ocorrências nas abas 04, 05 e 06; duas na 08. Hoje não vira
clique, **mas `LER_CAMPOS` resolve dono por `closest`** — um alvo clicável novo
perto de um `data-controle` do SVG resolve para o dono errado.

Achado pela `ONDA5-05-02`. **Quem acrescentar alvo nessas abas mede antes.**

---

## A MEDIÇÃO PRÉ-C — as dez abas, com a mesa parada (06/09/2026, quem coordena)

`hefesto_vivo.py --oculta --abre <aba> --conta-mutacoes 100`, uma aba por vez.
O número certo é ZERO: com a mesa parada, tudo o que se mexe é a tela sambando.

| aba | mutações em 100 tiques | tique mediana | tique máximo |
| --- | --- | --- | --- |
| 01-jogar | **0** | 2,58 ms | 13,75 ms |
| 02-controles | **236–273** (ver abaixo) | 1,47 ms | 24,56 ms |
| 03-gatilhos | **0** | 2,77 ms | 9,30 ms |
| 04-iluminacao | **0** | 1,40 ms | 14,00 ms |
| 05-vibracao | **0** | 1,42 ms | 10,59 ms |
| 06-navegacao | **0** | 1,40 ms | 8,81 ms |
| 07-lancadores | **0** | 1,28 ms | 13,54 ms |
| 08-conexoes | **0** | 3,81 ms | 37,32 ms |
| 09-sistema | 7 | 1,31 ms | **1.329,35 ms** |
| 10-perfis | **0** | 5,82 ms | 13,64 ms |

**A 02 NÃO ESTÁ SAMBANDO, e a tabela por endereço é quem diz:**

```
giro-x       childList   (filhos)   60   120 nós
accel-x-neg  attributes  style      56
giro-y       childList   (filhos)   52   104
giro-z       childList   (filhos)   48    96
accel-y-pos  attributes  style      14
accel-x      childList   (filhos)    4
accel-y      childList   (filhos)    2
```

São o giroscópio e o acelerômetro. O controle parado na mesa emite ruído de
verdade, o valor MUDA, e a tela mostrando valor que mudou está certa. O que
sobra por medir é se trocar o BLOCO (`childList`, 120 nós por 60 mutações) é
caro perto de trocar o TEXTO — a `CONTROLES-VERDADE-01` leva a pergunta.

**O ACHADO É A 09:** um tique de **1.329 ms** num teto de 100 ms, treze vezes o
teto, com a mesa parada. Um tique de 1,3 segundo congela a janela dela e faz o
piloto pular os seguintes. A `SISTEMA-STEAM-01` leva a medição.

**E a 10-perfis é a mais cara em regime**: mediana de 5,82 ms parada, e um tique
de 189 ms durante o passeio das dez abas. Vai com a `ONDA5-10-02`.
