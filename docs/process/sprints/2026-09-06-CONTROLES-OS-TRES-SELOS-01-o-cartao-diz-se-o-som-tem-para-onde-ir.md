---
sprint: CONTROLES-OS-TRES-SELOS-01
estado: feita
onda: H
posse:
  SELOS:
    - src/hefesto_dualsense4unix/interface/pacotes/a02_controles.py
    - src/hefesto_dualsense4unix/interface/aba02.py
    - mockup/02-controles.html
cria:
  - tests/unit/test_o_cartao_diz_se_o_som_tem_para_onde_ir.py
decisoes: [D-0609-O-MAPA-INFORMA-NUNCA-VETA]
bancada: false
depois_de:
  - A-CONFISSAO-NO-BOTAO-01
nao_toca:
  - src/hefesto_dualsense4unix/app/
  - src/hefesto_dualsense4unix/interface/paginas/
  - docs/data/
---

# CONTROLES · OS TRÊS SELOS — o cartão diz se o som tem para onde ir

> **ESTADO 2026-09-06: feita** — as quatro linhas do CSV fecharam (45, 57, 89 e 90) mais o QUARTO selo: o cartão diz qual gamepad virtual alimenta, apaga as peças que MANDAM som quando não há endereço, mostra `· acordado`/`· dormindo` e o selo do alarme no rótulo da moldura (ZERO altura, medido no motor), e ressalva no rádio que **o Hefesto ainda não faz** — frase LIDA de `fatos_do_mapa`, com régua que troca a célula num dublê e vê a frase sumir. 44 casos, 12 mordidas. Entrega em `docs/process/agentes/2026-09-06/CONTROLES-OS-TRES-SELOS-01-opus.md`.

> **ROTA — 06/09/2026, arrumação da leva (Fable, PO por delegação).** Esta sprint nasceu da
> definição de pronto dela — *"migrar tudo do gtk pro html … todas as features funcionando"* —
> medida contra o CSV da paridade: as linhas abaixo estavam `FALTA_NO_HTML` **sem nenhuma
> sprint aberta encarregada**. O enunciado de cada uma é a própria linha do CSV.

Três selos e uma dica, todos LIDOS de estado que já existe: a guarda **sem endereço** vira o **botão apagado com a razão na dica** (`D-03` dela, 04/09: *"o botão apaga e a dica diz por quê"* — a classe `.apagado` e `razoes_do_cinza` já são a língua da casa); o selo **Saída muda** lê a camada 1 do PipeWire pelo dono em `app/audio_saida.py`; **acordado/dormindo** é a metade de tela da SOM-ACORDADO-01 (o drop-in 54 do WirePlumber); a **dica do título** lê `coop.mesa` para dizer qual gamepad virtual este controle alimenta — se a COOP-NA-CONEXAO-NATIVA-01 já tiver posto isso no cartão, confira e não duplique. Roda depois da A-CONFISSAO-NO-BOTAO-01 (mesmo `a02_controles.py`).
>
> **E o QUARTO selo é a T6 da STATUS-DIZ-O-QUE-VE-01, viva desde 25/08 e nunca executada** (a A-RECUSA-QUE-CITOU-O-MAPA-01 §4.1 a devolveu à fila; a STATUS está `absorvida` e não volta). A guarda do bloco de som ganha a SEGUNDA pergunta — o TRANSPORTE — e a resposta vem do mapa, nunca da cabeça de quem escreve: `audio.alto_falante@dualsense` tem `radio_aciona=não` com causa `divida`, e com `divida` a única `Fala` legal (`app/fala_do_mapa.py`, `CAUSA_DE_FORA`) é `AFIRMA_NADA` com `porque=` — a frase honesta no rádio é *"o Hefesto ainda não faz"*, NUNCA *"o controle não faz"*, e os gestos NÃO apagam (`audio.alto_falante.rota` é `radio_aciona=sim`; apagar quatro gestos por uma dívida nossa é empurrá-la para a mão dela). O mudo do microfone (`parcial`) fica sensível. **Quando a SOM-QUE-SAI-01 (ONDA I) virar a célula, o selo muda sozinho — por isso ele LÊ `fatos_do_mapa.py`, não digita a frase.** A régua: o teste desta sprint troca a célula num dublê do mapa e vê a frase trocar.

---

## 1. AS LINHAS DO CSV QUE ESTA SPRINT FECHA — o enunciado é a linha

### Linha 45 — Dica do título — qual gamepad virtual este controle alimenta

* **O dono na GTK (reuse, não reescreva):** `src/hefesto_dualsense4unix/app/widgets/controller_card.py:1080 · src/hefesto_dualsense4unix/app/widgets/controller_card.py:4893`
* **O que ele faz:** Tooltip com o par físico↔vpad (backend, `vpad_uniq`, e o nome real quando divergente), ou a frase "ainda não alimenta gamepad virtual nenhum".
* **Por que falta:** É diagnóstico que custava apertar botão em cada controle para conferir. Nenhum pacote lê `coop.mesa` para montá-lo.

### Linha 57 — Guarda "sem endereço" — desligar o som do card quando não há MAC

* **O dono na GTK (reuse, não reescreva):** `src/hefesto_dualsense4unix/app/widgets/controller_card.py:5294 · src/hefesto_dualsense4unix/app/widgets/controller_card.py:5322 · src/hefesto_dualsense4unix/app/widgets/controller_card.py:5365`
* **O que ele faz:** Sem `uniq`, deixa insensíveis as cinco peças que MANDAM som (botão do mic, os dois deslizantes, mudo e devolução do alto-falante, e o seletor de canal), põe a dica nas duas molduras e acende um aviso visível. A leitura fica ligada de propósito.
* **Por que falta:** O que falta é a metade VISÍVEL. Sem endereço, `mic.set`/`speaker.set` caem no controle primário — o card do Controle 2 aplicando no Controle 1, que foi o estrago medido em 04/08/2026. O HTML recusa depois do clique; a GTK impede antes e diz por quê. || DECIDIDO em 04/09/2026 — O botão apaga e a dica diz por quê. É a D-03 aplicada a esta aba. Onde está escrito: `docs/process/2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md` §2 `02[04]`, sobre a pergunta [04] de `docs/process/sprints/2026-09-04-DECISOES-DELA-02-controles.md`. Não espera mais palavra dela.

### Linha 89 — Alto-falante — o selo "Saída muda" (a camada 1 do PipeWire)

* **O dono na GTK (reuse, não reescreva):** `src/hefesto_dualsense4unix/app/widgets/controller_card.py:2111 · src/hefesto_dualsense4unix/app/widgets/controller_card.py:4642`
* **O que ele faz:** Lê `speaker.saida_muda`/`audio.saida_muda` do payload ou a `LeituraMic.saida_muda` do MicMonitor; só `True` acende o selo.
* **Por que falta:** É a armadilha que ela mesma nomeou: *"volume perfeito num sink mudo no PipeWire é trabalho invisível"*. Sem o selo, ela mexe no som do controle e não sai nada, sem saber por quê — e no HTML nem o deslizante existe para ela tentar.

### Linha 90 — Alto-falante — "acordado / dormindo" no título da moldura

* **O dono na GTK (reuse, não reescreva):** `src/hefesto_dualsense4unix/app/widgets/controller_card.py:4556 · src/hefesto_dualsense4unix/app/widgets/controller_card.py:5232`
* **O que ele faz:** `definir_estado_do_canal` acrescenta o sufixo ao rótulo da moldura ("Alto-falante · 71 % · acordado"), com `""` significando "não sei" (o caso do rádio, sem placa de som).
* **Por que falta:** É a metade "ligar isso à interface" da SOM-ACORDADO-01, e ela separa "acordado agora, por acaso" de "acordado por padrão" (o drop-in 54 do WirePlumber).

## 2. O QUE FICA FORA, E POR QUÊ

* **A linha da verdade** — saiu da tela por decisão dela em 17/08; a CONTROLES-VERDADE-01 confirmou hoje. Fica `FALTA`, e fica fora.
* **O medidor de onda ao vivo** — precisa de um LEITOR de áudio que o produto novo não tem (`MicMonitor` só na janela antiga); fora das 24 horas, declarado.
* **O som de confirmação** — é a A-CONFISSAO-NO-BOTAO-01, que vem antes desta.


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
