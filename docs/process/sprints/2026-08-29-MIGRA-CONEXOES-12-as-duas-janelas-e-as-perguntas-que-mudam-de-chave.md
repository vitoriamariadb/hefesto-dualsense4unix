---
sprint: MIGRA-CONEXOES-12
estado: caducou
onda: MIGRA-CONEXOES
posse:
  M12:
    - src/hefesto_dualsense4unix/app/widgets/mapa_da_mesa.py
    - src/hefesto_dualsense4unix/app/widgets/calibrar_entradas.py
    - src/hefesto_dualsense4unix/app/actions/config/secao_mesa.py
cria:
  - tests/unit/test_migra_conexoes_as_duas_janelas_e_as_duas_perguntas.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-01
  - MIGRA-CONEXOES-01
  - MIGRA-CONEXOES-03
  # SÉRIE por arquivo: as duas possuem `secao_mesa.py`.
  - MIGRA-CONEXOES-09
  - MIGRA-CONEXOES-10
  # SÉRIE por arquivo (R5): donos declarados das duas janelas e da seção.
  - LEVA-1
  - LEVA-2
  - LEVA-3
  - LEVA-4
  - ONDA-CONEXOES-02
  - ONDA-CONEXOES-09
  - ONDA-CONEXOES-10
  - MOTOR-DO-ARRANJO-01
nao_toca:
  - src/hefesto_dualsense4unix/integrations/arranjo_da_mesa.py
  - src/hefesto_dualsense4unix/integrations/mapa_das_portas.py
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/gui/main.glade
  - scripts/telas/aba08.py
---

> **ESTADO 06/09/2026: caducou.** O enxerto da página dentro da janela GTK morreu: o produto é a janela HTML (`interface/hefesto_vivo.py`), e a janela GTK sai nas 24 horas (D-19, liberada por ela em 06/09). Fica como registro do que se mediu.

# MIGRA CONEXÕES · 12 — as duas janelas, e as perguntas que mudam de chave

**Esta sprint tem duas formas, e qual delas vale é decisão dela.** O que
sobrevive às duas está no fim, e é ele que a torna executável de qualquer jeito.

## O que existe hoje

Duas janelas **GTK vivas**, abertas pela própria seção:

| janela | módulo | quem abre | tamanho |
|---|---|---|---|
| "Desenhar a minha mesa" | `app/widgets/mapa_da_mesa.py` | `app/actions/config/secao_mesa.py:1624` (`_abrir_o_desenho`), botão `_BOTAO_DESENHAR:1810` | `set_default_size(720, 520)`, `:481` |
| "Ensinar as minhas entradas" | `app/widgets/calibrar_entradas.py` | `secao_mesa.py:1602` (`_abrir_a_calibracao`), botão `_BOTAO_CALIBRAR:1842` | `set_default_size(640, 420)`, `:859` |

O mockup as desenha como `.tela-nova` — `position:fixed`, fora do miolo, e por
isso **custam zero pixel** da aba.

## A pergunta que decide o tamanho desta onda

**AS DUAS POP-UPS VIRAM HTML DENTRO DO WEBVIEW, OU CONTINUAM JANELAS GTK?**

* **Continuam GTK** (Forma A): as duas já rodam, **não** conflitam com um WebView
  na aba, e o juízo por entrada — que a `arranjo_da_mesa.julgar` alimenta desde
  26/08 — continua funcionando. O preço é uma inconsistência **visível**: a aba
  nova ao lado de duas janelas velhas.
* **Viram HTML** (Forma B): ganha-se a unidade e paga-se a reimplementação de
  **duas janelas inteiras**, o juízo por entrada incluído.

**É a decisão que mais muda o tamanho desta onda.**

## Três defeitos das janelas que a medição achou, e valem nas duas formas

1. **A janela GTK do desenho NÃO ROLA.** 720×520 num `Gtk.Box` puro, **sem
   `ScrolledWindow` em lugar nenhum** — com o conteúdo de hoje, o que sobra fica
   fora e ninguém avisa. O mockup mostra a cura: teto de 717 px, rolagem por
   dentro, topo e rodapé sempre à vista.
2. **Um nome não bate, e o produto é quem está errado — em três lugares.** A
   confissão da janela manda a pessoa a *"Calibrar as entradas"*; o botão da aba
   chama-se **"Ensinar as minhas entradas"**. `calibrar_entradas.py:155` diz
   `TITULO_DA_JANELA = "Calibrar as entradas"`, e `mapa_da_mesa.py:83` diz
   `TITULO_DA_JANELA = "A minha mesa"` onde o botão diz "Desenhar a minha mesa".
   **A tela do mockup já usa os nomes certos; quem falta corrigir é o produto.**
3. **A ordem da confissão é SORTEADA.** As lacunas vivem num `set`, e um `set` de
   textos não tem ordem estável entre execuções: as mesmas três linhas saem em
   ordens diferentes a cada abertura. **É defeito, e é de uma linha.**

E um quarto, que **não** é desta sprint: os dois botões de ação da janela do
desenho nascem apagados e a janela **não tem realce nenhum de foco** — só os dois
botões contam a história. Está declarado como defeito do produto no mockup, e
esta sprint apenas o registra.

## O que sobrevive às duas formas, e é a espinha da sprint

**AS DUAS PERGUNTAS DA SALA MUDAM DE CASA E DE CHAVE.**

Hoje elas moram na aba — `secao_mesa.py:583` (`_declaracoes`), com
`_PERGUNTA_DA_ALTURA:335` (*"O dongle fica acima da cabeça de quem joga
sentado?"*) e `_PERGUNTA_DA_VISADA:344` (*"Tem gente sentada entre o dongle e o
sofá?"*) — e gravam sob a chave **`mesa`**. Na janela "Desenhar a minha mesa" o
desenho grava sob **`mapa`**.

**São chaves com disciplinas diferentes: substituição numa, fusão na outra.** É
trabalho de código, não de desenho. E entre a saída de um lugar e a chegada ao
outro elas não estão em tela nenhuma — **buraco declarado, não descuido**.

Lá elas preenchem um vazio real: a janela do desenho cria face com
`perto=False, alto=False` e **não tem um único gesto** que mude os dois. Ela não
guarda nenhum fato que só ela tem.

**E "sem resposta" não é "Não sei".** A da altura está respondida e a da visada
não, de propósito — a tela precisa mostrar os dois estados, e as três opções
(Sim / Não / Não sei) vêm literais de onde moravam.

**As duas passam no juízo do alcance** — decidido em 27/08, contra a suspeita
dela de que não mudavam nada: elas mudavam **uma frase de conselho** e agora
entram no veredito (`integrations/exame_da_mesa.py:519-540`).

## O que entrega

1. **As duas perguntas mudam de casa**, com a disciplina de gravação certa em
   cada chave — e um caminho de migração para quem já respondeu sob `mesa`.
2. **Os três defeitos acima, curados**: rolagem na janela do desenho, os dois
   `TITULO_DA_JANELA` batendo com os botões, e a ordem da confissão estável.
3. **Na Forma A**, os dois botões da aba viram gestos
   (`data-g="mesa.desenhar"`, `data-g="mesa.calibrar"`) que abrem as janelas
   GTK de sempre. **Na Forma B**, as quatro `.tela-nova` entram na página e as
   duas janelas saem — e aí esta sprint vira **três**, e o índice muda.
4. **A peneira do jogo aberto NÃO é desta sprint.**
   `calibrar_entradas.botoes_para_o_jogo:399` está escrita e **sem chamador**
   (lápide em `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py:1162`); quem
   tem de perguntar por ela é `daemon/lifecycle.py`, no `_dispatch_gamepad_emulation`.
   O dono é a `ONDA-CONEXOES-10`. **Enquanto ela não correr, confirmar uma entrada
   com o cabo na mão continua disparando um pulo no jogo aberto** — e a tela foi
   honesta e tirou a frase que prometia o contrário em 29/08.

## Como se prova (a mordida)

`tests/unit/test_migra_conexoes_as_duas_janelas_e_as_duas_perguntas.py`:

* **as perguntas gravam na chave certa, com a disciplina certa.** Responder a da
  altura na janela → o valor aparece sob a chave nova, e **responder de novo
  substitui** (ou funde) conforme a disciplina daquela chave. **Mordida:** grave
  sob a chave antiga e o teste reprova dizendo qual chave recebeu.
* **quem já respondeu não perde a resposta.** Estado antigo sob `mesa` →
  a leitura nova o encontra. **Mordida:** arranque a migração e veja a resposta
  dela sumir. Duas curas desta casa já destruíram dado dela em 29/08; esta régua
  existe por isso.
* **"sem resposta" ≠ "Não sei".** Os três estados são distinguíveis na leitura e
  na tela. **Mordida:** colapse os dois e veja reprovar.
* **a janela rola.** Com conteúdo maior que 520 px, o rodapé com o "Fechar"
  continua alcançável. **Mordida:** tire o `ScrolledWindow` e veja o botão sair
  da tela. Medir com `Gtk.OffscreenWindow`, nunca `Gtk.Window`: sob Xvfb não há
  gerenciador de janelas e a janela fica 1x1 para sempre.
* **os nomes batem.** `mapa_da_mesa.TITULO_DA_JANELA` e
  `calibrar_entradas.TITULO_DA_JANELA` casam com `_BOTAO_DESENHAR` e
  `_BOTAO_CALIBRAR` — **lidos dos dois lados**, nunca digitados. **Mordida:**
  troque um e o teste diz qual par divergiu.
* **a confissão sai na mesma ordem duas vezes.** Duas montagens seguidas →
  sequência idêntica. **Mordida:** devolva o `set` e veja o teste falhar de forma
  intermitente — e é por isso que ele roda a montagem **mais de uma vez**.

## O que é dela decidir

* **HTML OU GTK.** Se ficarem em GTK, esta onda tem **doze** sprints e o produto
  guarda uma inconsistência visível. Se virarem HTML, ela tem **catorze** e paga
  a reimplementação do juízo por entrada, que hoje já funciona.
* **O nome das duas janelas.** Os títulos internos ("A minha mesa", "Calibrar as
  entradas") vão ser trocados pelos nomes dos botões. Se ela preferir o
  contrário, são os botões que mudam — e aí muda o mockup aprovado.
