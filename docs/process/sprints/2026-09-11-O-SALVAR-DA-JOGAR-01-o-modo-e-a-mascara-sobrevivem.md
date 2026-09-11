---
sprint: O-SALVAR-DA-JOGAR-01
estado: aberta
onda: A-LISTA-DE-0911B
posse:
  O-SALVAR-DA-JOGAR-01:
    - docs/process/2026-09-11-O-SALVAR-DA-JOGAR-o-modo-e-a-mascara-medidos-no-disco.md
cria:
  - docs/process/2026-09-11-O-SALVAR-DA-JOGAR-o-modo-e-a-mascara-medidos-no-disco.md
bancada: false
depois_de:
  - CADEADO-E-O-FATO-01
nao_toca:
  - src/
  - mockup/
  - docs/data/mapa-controles.csv
---

# O SALVAR DA JOGAR — o modo e a máscara sobrevivem ao disco?

> **ORDEM DELA, 11/09/2026:** *"eu preciso que vc verifique se algo foi alterado*  <!-- noqa-acento: citação literal dela -->
> *nisso, manda um agente ver se salvar na aba jogar o perfil do jogo vai salvar*  <!-- noqa-acento: citação literal dela -->
> *o modo e a mascara."*  <!-- noqa-acento: citação literal dela -->

**Esta sprint NÃO escreve uma linha de produto.** Ela responde UMA pergunta com
o disco na mão, e a resposta é um documento. `src/` está em `nao_toca`: se você
achar defeito, **nomeie e pare** — a cura é de outra frente, com a medição em
cima.

---

## §1 — POR QUE ELA ESTÁ PERGUNTANDO, e a desconfiança tem precedente MEDIDO

A leva de 11/09 tirou o quadro «Modo» da aba Perfis por ordem dela, e a
justificativa registrada foi esta: **a aba Jogar já grava o modo e a máscara no
perfil**, pela cadeia
`a01_jogar._gravar_o_modo_do_chip` → `_gravar_o_modo` →
`pacotes/perfil.gravar_o_modo_no_ativo`.

**Isso foi lido no código, não medido no disco. É exatamente o que esta casa já
pagou caro duas vezes:**

1. **05/09/2026** — o ciclo dela foi medido de ponta a ponta e **sobreviviam 5
   de 11 campos** a um «Salvar»; três dos seis perdidos não se perdiam por
   esquecimento: **o Salvar os DESTRUÍA**, depois de a aba já ter gravado o
   valor certo no disco;
2. **04/09/2026** — a máscara **nunca gravou um byte**: o dicionário ia como
   `timeout` posicional, e o dublê do teste era mais frouxo que a ponte real.

**A máscara é o campo com a pior folha corrida desta casa. Meça-a com
desconfiança dobrada.**

## §2 — A PERGUNTA, em quatro partes, e cada uma se responde no DISCO

O alvo é **um perfil de JOGO** (`Mortal Kombat`, `Elden Ring`, `PRAGMATA` — a
lista dela tem catorze), não o `Personalizado`. Para cada parte, o veredito é
`sobrevive` · `não grava` · `grava e o Salvar destrói` · `não medido`:

1. **O CLIQUE grava?** Clicar um chip da fileira «Modo» da Jogar (Sony DualSense
   · Xbox · Steam Input · Navegação) escreve `mode` no JSON daquele perfil?
2. **O CLIQUE grava a MÁSCARA?** Os três botões «O Controle é visto como»
   (DualSense · Xbox 360 · Nintendo Pro) escrevem a máscara — e **onde**:
   em `mode.gamepad_flavor`, em `controllers.<id>.mascara`, ou nos dois?
3. **O «Salvar Perfil» do rodapé PRESERVA o que o clique gravou?** Clique,
   depois Salvar, depois releia o arquivo. **Este é o degrau que caiu em 05/09.**
4. **E se o perfil NÃO estiver ativo?** `gravar_o_modo_no_ativo` resolve o alvo
   por `nome_do_ativo(state)`. Com o perfil do jogo **selecionado na lista mas
   não ativo**, o clique na Jogar escreve onde? No perfil selecionado, no ativo,
   ou em lugar nenhum? **Diga o que acontece, não o que deveria acontecer.**

## §3 — COMO MEDIR, e as duas travas que não se negociam

**NÃO TOQUE NO `~/.config` REAL DELA.** Rodar o piloto dispara as migrações
one-shot no perfil vivo dela. Desvie `HOME` e os quatro `XDG_*` para um lar de
mentira — é o que o `tests/conftest.py` já faz — e **semeie lá** um perfil de
jogo de mentira com a mesma forma dos dela.

**NÃO REINICIE O DAEMON e não abra janela na tela dela.** `--oculta` sempre. O
que decide esta sprint é o BYTE NO ARQUIVO, e ele se lê com `json.load` — não
precisa de aparelho, não precisa de bancada.

**MEÇA CHAMANDO AS FUNÇÕES REAIS**, não reimplementando o caminho: importe
`pacotes.a01_jogar`, monte um `Contexto` e uma ponte, e acione os **gestos**
(`@gesto("01-jogar.html", …)`) como o piloto os aciona. Um dublê mais frouxo que
o produto é o defeito que 11/09 já pegou duas vezes nesta leva.

**E LEIA O ARQUIVO ANTES E DEPOIS, sempre.** A régua que compara a saída com ela
mesma não mede nada — é a armadilha que esta casa nomeou em 07/09.

## §4 — O QUE O DOCUMENTO TEM DE TER

1. **A tabela das quatro perguntas**, com o veredito e o caminho do arquivo lido.
2. **O JSON antes e depois**, recortado nos campos que importam (`mode`,
   `mode.gamepad_flavor`, `controllers.<id>.mascara`), para cada gesto.
3. **A resposta em UMA frase**, que é o que ela vai ler: *o que salvar na aba
   Jogar guarda, e o que não guarda, num perfil de jogo.*
4. **Se houver perda, o endereço exato de onde ela acontece** — arquivo e linha
   — e se é «não grava» ou «grava e o Salvar destrói». As duas têm curas
   diferentes, e confundi-las custou 05/09.
5. **O que você NÃO mediu**, dito na cara.

## §5 — O QUE É DELA

**A decisão do que fazer com o que você achar.** Se a medição confirmar que
grava, isto fecha uma desconfiança dela e não nasce trabalho nenhum. Se
contradisser, o quadro «Modo» que saiu da aba Perfis volta a ser assunto — e
**essa** decisão é dela, não sua.
