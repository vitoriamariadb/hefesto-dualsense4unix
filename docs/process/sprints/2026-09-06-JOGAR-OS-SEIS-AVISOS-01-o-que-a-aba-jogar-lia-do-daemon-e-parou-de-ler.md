---
sprint: JOGAR-OS-SEIS-AVISOS-01
estado: aberta
onda: I
posse:
  AVISOS:
    - src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py
    - src/hefesto_dualsense4unix/app/actions/jogar/painel.py
    - src/hefesto_dualsense4unix/interface/aba01.py
    - mockup/01-jogar.html
cria:
  - tests/unit/test_a_aba_jogar_le_os_seis_avisos.py
bancada: false
depois_de:
  - EXTERNOS-01
  - COOP-NA-CONEXAO-NATIVA-01
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/home_actions.py
  - src/hefesto_dualsense4unix/interface/paginas/
  - docs/data/
---

# JOGAR · OS SEIS AVISOS — o que a aba Jogar lia do daemon e parou de ler

> **ROTA — 06/09/2026, arrumação da leva (Fable, PO por delegação).** Esta sprint nasceu da
> definição de pronto dela — *"migrar tudo do gtk pro html … todas as features funcionando"* —
> medida contra o CSV da paridade: as linhas abaixo estavam `FALTA_NO_HTML` **sem nenhuma
> sprint aberta encarregada**. O enunciado de cada uma é a própria linha do CSV.

Seis avisos, todos com a mesma forma: **o daemon publica a chave, ou `home_actions` já tem a função pura, e o pacote não lê.** `mascara_divergente`/`mascara_divergencias` (o daemon publica; medido), `jogo_com_autoridade` (pura), a condição de três termos do grab dobrado (pura), `ponte.chamar_detalhado` devolvendo `(ok, motivo)` para o recibo do Reconectar, `native_mode_origin`/`mode_from_profile` para a linha de origem. **Os avisos entram na coluna Atenção por `painel.AVISOS_DA_TELA` e `ORDEM_DA_GRAVIDADE`** (o dono, desde a ONDA-JOGAR-06) — não invente um segundo lugar. Roda depois da EXTERNOS-01 e da COOP-NA-CONEXAO-NATIVA-01, que mexem no mesmo `a01_jogar.py`.

---

## 1. AS LINHAS DO CSV QUE ESTA SPRINT FECHA — o enunciado é a linha

### Linha 12 — O aviso 'entrei em Navegação e o mouse/teclado está desligado'

* **O dono na GTK (reuse, não reescreva):** `src/hefesto_dualsense4unix/app/actions/home_actions.py:762 · src/hefesto_dualsense4unix/app/actions/home_actions.py:2053 · src/hefesto_dualsense4unix/app/actions/home_actions.py:2621`
* **O que ele faz:** ressalva logo abaixo da descrição, com a lógica de transição em voo (sabe que o `mouse.emulation.restore` pode ainda estar chegando)
* **Por que falta:** É o MODO-QUE-NAO-CONTROLA-01, medido com ela ao vivo (*'cliquei em aplicar e nada'*). O HTML herdou o terceiro IPC que curou metade do defeito e não herdou a linha que cobre a outra metade — quando o restore não pega, o produto novo volta a ficar mudo exatamente onde a GTK aprendeu a falar.

### Linha 17 — Aviso de grab dobrado no card ('o jogo pode receber cada botão duas vezes')

* **O dono na GTK (reuse, não reescreva):** `src/hefesto_dualsense4unix/app/actions/home_actions.py:1381 · src/hefesto_dualsense4unix/app/actions/home_actions.py:1394 · src/hefesto_dualsense4unix/app/actions/home_actions.py:2992`
* **O que ele faz:** linha vermelha no card do primário quando `primary_grab_state == 'failed'` com o gamepad de pé, com o porquê no hover
* **Por que falta:** É o aviso do defeito mais confuso da mesa — o jogo lendo cada botão duas vezes — e a condição é de três termos que a GTK já isolou em função pura testável. Medido agora: `primary_grab_state='off'`, então nada acenderia hoje nos dois; mas o HTML não acenderia nunca.

### Linha 25 — O recibo do 'Reconectar' — quantos jogadores voltaram, se a numeração compactou

* **O dono na GTK (reuse, não reescreva):** `src/hefesto_dualsense4unix/app/actions/home_actions.py:821 · src/hefesto_dualsense4unix/app/actions/home_actions.py:3134`
* **O que ele faz:** toast na barra de estado montado por `reconciliar_toast(jogadores, resultado_renumber)`, e o encadeamento só renumera se o sync voltou; falha do sync vira 'Não consegui reconciliar — o Hefesto pode estar desligado'
* **Por que falta:** O botão do HTML é o botão que responde calado: clicar com o daemon fora do ar e clicar com ele vivo produzem exatamente a mesma tela. A GTK tem quatro desfechos nomeados nesse mesmo gesto. (O caminho para curar existe — `ponte.chamar_detalhado` devolve `(ok, motivo)` e o piloto sabe pintar recado por cartão, hefesto_vivo.py:325-372 — e não é usado aqui.)

### Linha 26 — A dica do 'Reconectar' quando há jogo aberto

* **O dono na GTK (reuse, não reescreva):** `src/hefesto_dualsense4unix/app/actions/home_actions.py:681 · src/hefesto_dualsense4unix/app/actions/home_actions.py:707 · src/hefesto_dualsense4unix/app/actions/home_actions.py:2575`
* **O que ele faz:** frase ao lado do botão dizendo o que NÃO vai acontecer (a numeração espera), e o botão fica de pé de propósito — o gesto é justamente o de partida aberta
* **Por que falta:** Sem essa linha, no caso mais importante do botão (jogo aberto, jogador caiu) ele faz metade do trabalho e a tela não distingue isso de ter feito tudo. A função `jogo_com_autoridade` já é pura e já é a fonte única das três condições que dependem de 'há jogo em cena' na GTK.

### Linha 28 — O aviso de divergência de máscara (a escolha dela não chegou ao aparelho)

* **O dono na GTK (reuse, não reescreva):** `src/hefesto_dualsense4unix/app/actions/home_actions.py:989 · src/hefesto_dualsense4unix/app/actions/home_actions.py:1016 · src/hefesto_dualsense4unix/app/actions/home_actions.py:2874`
* **O que ele faz:** banner com motivo e caminho, comparando a máscara ESCOLHIDA (gesto dela ou perfil) com a do aparelho, a cada tique — e usando o alarme `mascara_divergente` que o próprio daemon publica
* **Por que falta:** O daemon publica a chave hoje (medido: `mascara_divergente: null`, `mascara_divergencias: []`), e a interface nova não a lê. É o mesmo defeito que a I3 nomeou na GTK — 'o ALARME que ele já publicava e que esta janela nunca leu' — reintroduzido na migração.

### Linha 35 — A linha de origem — 'Nativo/Gamepad ligado pelo perfil ativo'

* **O dono na GTK (reuse, não reescreva):** `src/hefesto_dualsense4unix/app/actions/home_actions.py:2179 · src/hefesto_dualsense4unix/app/actions/home_actions.py:2727`
* **O que ele faz:** linha discreta que diz quando o modo em vigor foi ligado pelo PERFIL e não por ela
* **Por que falta:** É a resposta a 'por que o modo mudou sem eu mexer'. Medido agora: `native_mode_origin=None` e `mode_from_profile` ausente, então nem a GTK diria nada hoje — mas com um perfil de jogo carregado a GTK explica e o HTML não tem onde.

## 2. O QUE FICA FORA, E POR QUÊ

* **O custo da máscara Xbox antes do clique** — decisão dela de 31/08 (*"o tooltip falando o contrário é sem nexo"*) e 10-Q6. Fica `FALTA`, e fica fora.
* **Cards dos controles externos** — é a EXTERNOS-01, que vem antes desta.


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
