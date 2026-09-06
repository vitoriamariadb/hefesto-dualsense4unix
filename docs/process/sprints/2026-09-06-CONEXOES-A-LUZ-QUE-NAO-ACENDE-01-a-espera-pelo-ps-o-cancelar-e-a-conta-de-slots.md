---
sprint: CONEXOES-A-LUZ-QUE-NAO-ACENDE-01
estado: aberta
onda: I
posse:
  LUZ:
    - src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py
    - src/hefesto_dualsense4unix/interface/aba08.py
    - mockup/08-conexoes.html
cria:
  - tests/unit/test_a_conexoes_espera_o_ps_e_conta_os_slots.py
bancada: false
depois_de:
  - EXTERNOS-01
  - MOTOR-DO-ARRANJO-01
nao_toca:
  - src/hefesto_dualsense4unix/integrations/
  - src/hefesto_dualsense4unix/daemon/
  - docs/data/
---

# CONEXÕES · A LUZ QUE NÃO ACENDE — a espera pelo PS, o Cancelar, e a conta de slots

> **ROTA — 06/09/2026, arrumação da leva (Fable, PO por delegação).** Esta sprint nasceu da
> definição de pronto dela — *"migrar tudo do gtk pro html … todas as features funcionando"* —
> medida contra o CSV da paridade: as linhas abaixo estavam `FALTA_NO_HTML` **sem nenhuma
> sprint aberta encarregada**. O enunciado de cada uma é a própria linha do CSV.

Duas coisas. (1) **O desenho PROMETE** (`paginas/08-conexoes.html:2447`, o `title` do botão): *"enquanto ele espera o PS, o mesmo botão vira Cancelar"* — e o produto não entrega a espera, a contagem nem o Cancelar. O dono é `secao_controles.py:340`; a CONEXOES-LIGAR-TUDO-01 deixou a razão em §6 (esperava decisão dela): decida por delegação o que a tela diz durante a espera (proposta: *"Aperte PS no controle · Ns"* com o botão virando "Cancelar"), registre, e construa. (2) **A conta de slots por adaptador de rádio** (linha da aba 09, que mora aqui porque o assunto é o adaptador): o censo do gabinete (`censo_do_gabinete.py`, MOTOR-DO-ARRANJO-01) sabe os adaptadores; a conta A/B de `bt_mic.py` sabe os slots. Roda depois da EXTERNOS-01 e da MOTOR-DO-ARRANJO-01 (mesmo `a08_conexoes.py`).

---

## 1. AS LINHAS DO CSV QUE ESTA SPRINT FECHA — o enunciado é a linha

### Linha 296 — "A luz não acende" — a espera pelo PS, a contagem e o Cancelar

* **O dono na GTK (reuse, não reescreva):** `src/hefesto_dualsense4unix/app/actions/config/secao_controles.py:340 · src/hefesto_dualsense4unix/app/actions/config/secao_controles.py:1182 · src/hefesto_dualsense4unix/app/actions/config/secao_controles.py:1310 · src/hefesto_dualsense4unix/app/actions/config/secao_controles.py:1338 · src/hefesto_dualsense4unix/app/actions/config/secao_controles.py:1352 · src/hefesto_dualsense4unix/app/actions/config/secao_controles.py:221`
* **O que ele faz:** Máquina de dois estados: o clique entra na espera, mostra "▲ aperte PS", conta os segundos (`frase_da_procura`), oferece `[Cancelar]`, esconde os irmãos do card e, no fim, deixa um RECADO que sobrevive à espera ("Não voltou em Ns. Ele continua pareado…").
* **Por que falta:** E o desenho PROMETE: o `title` do botão diz "Enquanto ele espera o PS, o mesmo botão vira 'Cancelar'" (paginas/08-conexoes.html:2447). A tela promete um estado que o produto não entrega — ela clica, o controle cai, e a tela não diz uma palavra sobre o que fazer nem por quanto tempo esperar. || CONFERIDA em 06/09/2026 pela PARIDADE-REMEDIR-01 e MANTIDA: o gesto `luz-nao-acende` (`src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py:4874`) derruba e volta — os quatro desfechos do dono viram dois, e não há contagem, nem Cancelar, nem recado de "não voltou". A promessa do `title` ("o mesmo botão vira 'Cancelar'") continua sem cumprimento.

### Linha 330 — Perfil de Bateria — a conta de slots por adaptador de rádio

* **O dono na GTK (reuse, não reescreva):** `src/hefesto_dualsense4unix/app/actions/config/secao_orcamento.py:585 · src/hefesto_dualsense4unix/app/actions/config/secao_orcamento.py:621`
* **O que ele faz:** Um bloco vivo (`_ContaDeSlots`) que pergunta `daemon.state_full` por `call_async` e responde "cabe o que eu quero fazer?" por adaptador, com plano de rádio e apelidos.
* **Por que falta:** Faltando de fato — mas a atribuição é discutível: o assunto é rádio/adaptador, e provavelmente é território da aba 08 (Conexões), não da 09. Registro aqui porque na GTK ele mora na MESMA seção ("Desempenho") de onde vieram os três botões do Perfil de Bateria, então quem migrar a seção pela metade vai deixá-lo para trás sem perceber. || CONFERIDA em 06/09/2026 pela PARIDADE-REMEDIR-01 e MANTIDA — e agora ela é dívida DECIDIDA: `D-0609-MESA-E-PALAVRA-NAO-FEATURE`, palavra dela, diz que *"mesa" é PALAVRA banida na tela, não feature* e que **a tabela e a conta de slots ENTRAM**, com palavras simples. A `SISTEMA-STEAM-01` entregou a metade das duas linhas de estado (linha 329); a conta de slots por adaptador não nasceu.

## 2. O QUE FICA FORA, E POR QUÊ

* **"Já movi — reexaminar"** — decisão dela de 31/08 (*"não faz sentido termos o examinar e o reexaminar"*). Fora.
* **Ambiguidade fina das ordens** — a premissa caiu (CONEXOES-LIGAR-TUDO-01, hoje); a linha do CSV precisa de veredito novo, e a PARIDADE-CRUZA-O-MAPA-01 a corrige.
* **Mapear Entrada a Entrada** — fora das 24 horas por decisão dela (§10 do plano).


## AS REGRAS DESTA SPRINT — e são as da casa

1. **A linha do CSV é o enunciado.** `docs/data/paridade-gtk-html.csv` é o dono do fato;
   a coluna `gtk_onde` diz QUEM já faz isso no motor. **Você LÊ do dono e liga à tela** —
   reescrever a lógica em `interface/` é a segunda cópia, que é o defeito que onze réguas
   desta casa já tiveram. Se o dono precisar de um ajuste, ele é seu só se estiver na
   `posse:`; senão, RELATE.
2. **Texto de tela vem do glossário** (`docs/A-LINGUA-DESTA-CASA-…`): cabo/rádio, nunca
   usb/bt; "mesa" não entra; "serviço", não daemon. Frase nova é frase do DONO em `app/`
   (`app/textos_de_aplicacao.py`, `app/actions/*`) — o pacote a importa.
3. **Cada linha fecha com a MORDIDA da casa:** arranque a cura e a régua reprova. E com a
   PROVA DE TELA: foto `--oculta` antes e depois, e o clique de verdade pela ponte JS
   (`--prova-clique`/`--prova-gesto`), nunca o mouse dela.
4. **O CSV da paridade NÃO é sua posse.** Você entrega, no relatório, o texto pronto da
   linha (veredito · `sinal` que existe no CÓDIGO do lado HTML · `html_onde` · `html_faz`)
   — a PARIDADE-REMEDIR-02 recolhe no fim. O `sinal` tem de ser código, nunca prosa
   (`D-0609-O-SINAL-DA-PARIDADE-NAO-E-PROSA`).
5. **Se um passo esbarrar em decisão de produto**, decida como PO por delegação, registre
   em `docs/data/decisoes-dela.csv` com `quem_decidiu=delegacao` e REVERSÍVEL NUMA FRASE, e
   siga. Não pare.
6. A ordem de precedência (aparelho > mapa > sprint) está no preâmbulo do despachante.
