# ONDE PARAMOS — 29/08/2026: a tecnologia decidida, e a cura que a tela desfazia

> **O estado medido do projeto cabe em cinco minutos:**
> [O QUE É VERDADE HOJE](2026-08-29-O-QUE-E-VERDADE-HOJE.md). Leia-o antes deste arquivo se o que você
> precisa é o que é fato, o que é dívida e o que já foi curado.

**A porta de entrada de agora.** Quinze horas seguidas, e três coisas que valem
mais que o resto:

1. **A tecnologia da interface foi decidida** — e não pelo desenho, pelo que
   ACOMPANHA a mudança.
2. **O produto mandava ela pôr de volta uma trava que ele mesmo já tinha curado**,
   com um jogo dela citado pelo nome, em texto sempre visível na tela.
3. **Duas curas escritas nesta casa destruíam dado dela**, e uma delas foi
   introduzida por uma leva de hoje e pega antes de chegar nela.

---

## 1. A interface nova é o mockup dentro da janela

`D-A-INTERFACE-NOVA-E-O-MOCKUP-DENTRO-DE-UMA-JANELA-GTK`. Palavra dela, depois do
veredito da convivência: *"sem impeditivo então. manda ve em tudo."*

**As duas rotas foram provadas com a MESMA régua**, e a que decidiu não foi
fidelidade — as duas acertam o desenho. Foi **acompanhar**:

| | rota 3 · o gerador emitindo GTK | rota WebKit · o mockup na janela |
|---|---|---|
| Fidelidade | 0,4% de tinta perdida, **0 de 28** regiões | 3,7%, **0 de 28** (com duas curas) |
| **Acompanha a mudança** | **NÃO — foto byte-idêntica** | **SIM** — igual ao Chrome a 0,1 px em 8 medidas |
| Abas alcançadas | 3 de 10; a Jogar **fora por construção** | **10 de 10**, `.quadro` e rodapé iguais ao Chrome **ao pixel** |
| Custo por aba | **500–700 linhas** | as duas pontes: **31 linhas, uma vez** |
| `:hover` (91 usos, 10 abas) | **zero fotos** | **fotografado vivo** |
| Peso | zero | **Flatpak: zero byte** — o runtime dela já traz tudo |

**O teste que decidiu, e é simples:** mudou-se **uma linha** do mockup
(`.pt{font-size:10px}` → `16px`). O WebKit andou o que o Chrome andou; **a foto
GTK saiu byte-idêntica**. É a assinatura do emissor que a rota veio substituir,
reproduzida dentro dela.

**A convivência com o GTK3 era a última incógnita**, e só foi medível depois de
ela instalar o binding: GTK 3.24.41 + WebKit2 4.1 no mesmo processo, com o
webview **enxertado no `main.glade` real** — 376 objetos em 56 ms, virando a 12ª
página do `Gtk.Notebook` do produto. On-screen custa o mesmo que offscreen.

**O preço, medido e aceito por ela: 62 → ~285 MiB PSS (4,6×).**

**O que ainda não foi medido, e vai primeiro:** o enxerto **substitutivo**. O
provado foi **aditivo**; ninguém mediu **trocar** uma página, e é onde as 60.862
linhas que hoje chegam aos widgets por `builder.get_object()` reaparecem.

### Os números do censo, corrigidos por quem conferiu

O primeiro censo disse "934 linhas de código" e "80% sobrevivem". Conferido: são
**581** (as outras 411 são docstring), e o que sobrevive é **49–69%**. A direção
se sustenta — **73 a 100 linhas morrem contra ~55 que nascem por aba**, ainda
~10× melhor que a outra rota — mas o número estava inflado.

E o *"Rumble é a menor aba, 6 de 6"* era uma corrida de dois cavalos. Medindo as
onze: **Gatilhos é menor em todos os eixos**, e Rumble é a **6ª de 11**. O piloto
continua defensável, mas a base da extrapolação é uma aba **mediana**.

---

## 2. A resposta que derrubou a pergunta dela

Ela perguntou por que Mullet Mad Jack e Sackboy ainda precisam de travas manuais
e o Pragmata não.

**A cura pegou igual nos três.** A allowlist "Esconder os controles físicos" tem
**zero appids**, medida com o parser do próprio produto, e os três `.env` do
wrapper são **byte a byte idênticos** — desde 16/08 o `hefesto-launch` entrega o
`SDL_GAMECONTROLLER_IGNORE_DEVICES` a **todo** jogo.

**A trava que ela via era a tela pedindo.** A aba Emulação dizia, em texto sempre
visível:

> *"Quando o suporte a DualSense do jogo vem PELA Steam (é o caso do **Mullet Mad
> Jack**), marque 'Esconder os controles físicos neste jogo' no editor de perfil."*

**O produto curou o problema e continuava instruindo ela a desfazer a cura**, com
o jogo citado pelo nome. A mesma afirmação falsa vivia em mais três lugares.

### E faltaram quatro coisas, nenhuma por jogo

| | O que é |
|---|---|
| **a** | Os **23 perfis** dela pedem `dualsense`; ela joga em `xbox`. Todo lançamento arma o errado — **24 apertos de PS+R3 em 7 dias** |
| **b** | **Dois apertos derrubavam o gamepad no meio da partida.** Medido 3× — o 2º pedia o degrau Nativo, a escada parava *sem carimbar*, e o mesmo aperto levava tudo para `mouse_teclado`. **O Pragmata escapou por ter apertado uma vez só** |
| **c** | O carimbo do Sackboy **viveu 4 min 14 s** e um Salvar o apagou |
| **d** | O carimbo do Mullet está **errado**, e nada o corrigia |

---

## 3. As duas curas que destruíam dado

### O Salvar da aba Perfis apagava o carimbo da ponte

O carimbo só chegava ao disco por passthrough de uma **fotografia** que a janela
tirou ao abrir. Se o daemon carimbasse depois dela, o Salvar gravava nulo por
cima. **Duas perdas medidas**: o Sackboy em 26/08 (quatro minutos e catorze
segundos de vida) e o DON'T SCREAM em 19/08 — este com `confirmada_por:
escolha_dela`, **a escolha dela, apagada**.

**A cura óbvia não curava**, e a mordida provou: reusar o método da linha de cima
lê o *cache*, que é a **outra fotografia** da janela. A janela tem duas memórias e
as duas envelhecem juntas. Só o arquivo responde.

### E a leva que curou (a) e (b) criou uma regressão, pega antes de chegar nela

A régua da leva rodava o tique **uma vez** e afirmava que o degrau caro não
carimba. **A vida não para.** O gesto ficava vivo e, **181 segundos depois**, o
produto carimbava sozinho o degrau que ela acabou de recusar — e no lançamento
seguinte **o caminho para o Modo Nativo morria**.

**Os 67 testes daquela leva passavam com o defeito de pé.** Curado em uma linha
(`esquecer_o_gesto`), e a régua agora vive até os 181 s.

**A lição, e ela vale para toda régua desta casa:** *uma régua que roda o tique
uma vez mede um instante, não um comportamento.* A pessoa vive mais que o
primeiro tique.

---

## 4. Os instrumentos falsos do dia — seis

O padrão desta casa apareceu seis vezes em quinze horas, e em quatro delas o
instrumento era de quem estava conferindo:

1. **A régua do emissor GTK** só checava *"há mais de 50 px de plástico e de
   laranja"*. O comentário admitia: *"Ela passaria se o controle virasse um
   retângulo."* **Passou** sobre um d-pad deformado e os ombros sumidos.
2. **Um instrumento decidia o que medir pela PRIMEIRA PALAVRA do título** do
   experimento, e imprimia "ACOMPANHOU" para qualquer coisa que não fossem os
   dois casos para os quais foi escrito.
3. **Um censo de cor** perguntava *"há quatro cores distintas?"* e continuava
   respondendo **sim** com o defeito ativo — porque o bug não apaga a cor, ele a
   **muda de lugar**.
4. **A checagem do `install.sh`** dizia que *importar* provava que a biblioteca
   carrega. Medido com um typelib remendado: o import **passa**, e quem estoura é
   a primeira **chamada**.
5. **O teste que a cobria** usava um `gi` que quebrava no import — provava que a
   checagem importa, não que importar detecta biblioteca ausente.
6. **A régua de pop-up de quem coordena** comparava o rodapé com a viewport do
   navegador, quando a pop-up é `position:fixed` e vive na janela de 757.

**Cinco das seis foram pegas por quem escreveu a própria régua**, ao mordê-la.
A sexta foi pega por um cético independente.

---

## 5. Os erros de quem coordena, escritos

- **"A fila cai de 123 para 114"** com as nove sprints que ela fechou. **Falso** —
  as nove não estavam na fila. Foram fechados nove *documentos*.
- **"105 → 200 px"** no teste que reprovou a rota do emissor. Era **105 → 109**;
  o 200 era a régua medindo a moldura porque a faixa de `y` era fixa.
- **"94,67% de fidelidade"** não é nota de fidelidade: a foto com o desenho
  **quebrado** tira 82,20% e a boa tira 82,20% também.
- **As seis sprints do clean-room apresentadas a ela como pendentes.** Três
  estavam **entregues** há três semanas, duas com teste vivo. Ela decidiu "corta
  as seis" sobre premissa falsa; corrigido antes de executar.
- **"É o único dos dezenove com nome em inglês"** — são **dois**, e o mockup já
  estava limpo.
- **"121 linhas mortas, 4 são índices"** — eram **116**, e as 9 restantes não são
  índices.
- **Quinze links mortos criados** ao corrigir o corte (apontei para
  `A-CORRENTE-...` e o manifesto se chama `O-CORTE-...`).
- **Rodei a suíte enquanto agentes editavam a árvore**, e li instabilidade como
  regressão.

---

## 6. O que fica

**Dela:**
- **A remedição dos dois vpads com máscaras diferentes** — ela disse que já
  funcionou; o registro é que não existe, e ele destrava a máscara por controle.
- **Os 84 filtros mortos**: `monta.py` prefixa os ids do SVG e não reescreve o
  `url()` porque o desenho usa `&quot;` escapado. **O contorno do touchpad nunca
  apareceu, em motor nenhum** — o Chrome falhava calado, e foi o WebKit que
  revelou. A cura é uma linha, leva 84 para 12, e muda 1,09% dos pixels do
  desenho que ela aprovou. **Não aplicada, por isso.**
- **`SUBIR_REABRINDO_O_JOGO` é calculado, vai ao journal, e nenhum caminho o
  executa** — a escada nunca arma o Nativo nem o Steam Input. Anterior a esta
  leva, e fechá-lo mexe no ramo *"o perfil manda"*.
- Os 22 rótulos minúsculos das pop-ups da Navegação.

**Trabalho, com endereço:**
- **O enxerto substitutivo** — a medição que decide o custo real do transplante.
- **O `referencias-docs` vermelho no `dev`**: 9 linhas, sprints de 27/08 citando
  o que ainda vão criar. A pasta `-dev` nasceu vermelha junto, e está escrito no
  `CLAUDE.md` de lá.
- **`playwright` fora do `pyproject.toml`**, importado por dois portões.

---

## 7. A pasta `-dev` nasceu

`git worktree`, branch **`interface/nova`**, no mesmo `HEAD` do `dev`. O
`CLAUDE.md` e o `novo-layout/` foram **copiados à mão** — os dois são
`.gitignore` e o worktree não os leva, e sem eles o primeiro agente chega sem o
contrato e sem a especificação da interface.

O `CLAUDE.md` de lá tem uma seção nova, **OS QUATRO RISCOS**, e o primeiro é em
letras grandes: **nunca rodar o `install.sh` ali** — ele reescreve caminhos
únicos por máquina e reinicia o daemon que ela usa.

**A árvore dela continua em `dev`, intocada**, e o `md5` do mockup é o mesmo dos
dois lados.
