# Como reger agentes nesta casa

**Leia isto antes de despachar o primeiro agente de uma leva.**

Irmão do [COMO-OLHAR-A-TELA.md](COMO-OLHAR-A-TELA.md): aquele ensina a medir a
tela sem sofrer, este ensina a reger agentes sem que eles se atropelem.

Em **23/08/2026** mais de sessenta agentes trabalharam em paralelo nesta árvore,
em seis workflows. O que funcionou e o que quebrou existia só na cabeça de quem
coordenou — e um `/clear` apaga isso. Cada linha abaixo é um defeito real desta
leva, com a cicatriz ao lado. Preferência sem defeito por trás não entrou.

O estado daquela leva — o que foi entregue, o que ficou aberto — está em
[2026-08-23-ONDE-PARAMOS](2026-08-23-ONDE-PARAMOS-os-doze-defeitos-de-forma-e-a-regencia.md).
Este arquivo não repete: cuida do **método**.

---

## O formato que funcionou

```
batedores em paralelo  →  UM sintetizador dono do plano  →  escritores com
arquivo próprio  →  conferente que REFAZ as mordidas  →  crítico de completude
```

**Por que a coleta é distribuída e a síntese é centralizada.** Ler onze abas,
261 sprints e 308 linhas de mapa de canais não cabe num agente só: ele estoura o
contexto e **degrada no meio** — as últimas fontes recebem uma leitura pior que
as primeiras, e nada no relatório denuncia isso. Batedores leem um pedaço cada,
com prompt curto. Mas o **plano tem de ter um dono só**: dois sintetizadores
produzem dois planos que se contradizem, e a contradição só aparece na execução.

Os dois últimos papéis não são luxo:

- **o conferente REFAZ as mordidas** — arranca a cura, vê reprovar, devolve. Foi
  ele, não o executor, quem achou a **A3** abaixo;
- **o crítico de completude** pergunta o que *não* está no plano. Executor e
  conferente olham para o que existe.

---

## As quatro regras

### R1 — posse de arquivo, sempre

Cada agente é dono exclusivo de um conjunto de arquivos, **escrito no prompt
dele**. Agente que edita arquivo alheio desfaz o trabalho do vizinho **em
silêncio**: as duas edições são válidas, nenhuma ferramenta reclama, e o que
sobra é a última a gravar.

Quando o conserto pede arquivo alheio, o agente **relata em vez de editar**. Daí
nascem as continuações — e continuação vira sprint própria, com dono próprio.

### R2 — a suíte inteira é de quem coordena, nunca do agente

`pytest` sem alvo cria **nós uinput de verdade**: 1.289 num dia derrubaram o
fullscreen dela. Com N agentes em paralelo isso multiplica por N. **Agente roda
só o próprio escopo** (`pytest tests/unit/test_isso.py`), e o prompt diz qual é.

**E o erro que quem coordenou cometeu em 23/08:** rodou a suíte inteira
*enquanto* agentes editavam a árvore, e o resultado saiu inválido — `passed:
None`, coleta contra arquivos que mudavam debaixo dela. **Medir árvore em
movimento não mede nada.** A suíte roda uma vez, no fim, com a leva parada.

### R3 — a bancada é dela durante a medição

Os agentes usam daemon e controles; a medição de Bluetooth dela também.
**Enquanto ela mede, nenhum agente para o daemon nem escreve no aparelho.** Um
agente que precise disso **espera e diz que está esperando** — não improvisa
outro caminho, que é como se inventa medição falsa.

### R4 — foto e portão no fim, não no meio

`scripts/gui-captura/retratar_abas.py` reescreve **as onze fotos de uma vez**.
Dois agentes rodando isso em paralelo gravam por cima um do outro, e o `git
status` fica ilegível. Nenhum agente fotografa; quem coordena fotografa depois
que a leva fecha, e só então roda os portões da lista do `CLAUDE.md` — depois do
`git add -A`, que é o que os torna capazes de ver arquivo novo.

---

## As armadilhas medidas em 23/08

### A1 — o briefing errado se propaga, multiplicado por N

Quem coordenou passou **a ordem das abas errada** a treze batedores. Três a
corrigiram por conta própria; os outros dez trabalharam sobre ela, e ondas
numeradas pela ordem errada apontam para a aba errada.

**A causa raiz não foi desatenção:** cinco abas não tinham host no
`retratar_abas.py` e o README publicava o glade cru — **a foto mentia**, e a
regra da casa manda olhar a foto primeiro. Os cinco hosts entraram no script no
fim do mesmo dia (P10, 23/08/2026); **as fotos ainda não foram refeitas** — as
de `docs/usage/assets/` são das 18h15 e o script mudou às 20h57, então elas
continuam mentindo até alguém rodar o `retratar_abas.py` com a leva parada.

**A lição: valide o briefing contra a fonte antes de multiplicá-lo por N
agentes.** Para a ordem das abas a fonte é o `<child type="tab">` do
`src/hefesto_dualsense4unix/gui/main.glade`, não a foto. Um minuto de conferência
contra N relatórios a refazer.

### A2 — o dublê que só sabe passar

A régua de uma cura usava um dublê que **nunca fracassava**. Por isso ela não viu
que o conserto reintroduzia o próprio defeito: o caminho de erro nunca era
exercido.

**Régua que só sabe passar não é régua.** Todo dublê tem de saber **recusar**, e
o teste tem de exercer as duas respostas.

### A3 — o conserto que reintroduz o defeito que cura

O diálogo de fechamento **ignorava o resultado da gravação**: com o daemon
desligado, "Aplicar e fechar" era idêntico a "Fechar sem aplicar" — a mesma
família do defeito que ele existia para curar ("aplicado" é palavra sem prova).

**Achado pelo conferente, não pelo executor.** É para isto que a fase de
conferência existe: quem escreveu a cura acredita nela.

### A4 — o cético vale o que custa

Sete achados foram submetidos a **dois céticos independentes cada** — um pela
lente do código, outro pela do uso real. **Nenhum foi refutado, e dois foram
estreitados**: um caiu de cinco campos para três, com dois reclassificados.

**Cético que não estreita nada provavelmente não leu.** Achado que sai do cético
idêntico ao que entrou é sinal de conferir, não de comemorar.

### A5 — instrumento de terceiro passa na régua da casa antes de valer

O `code-review-graph` foi reconstruído (24.684 nós) e testado contra **três
funções que já se sabia estarem sem chamador**: não achou nenhuma. E **508 dos
916 achados dele eram `struct` de C** dos drivers. Não substituiu o portão da
casa.

**Valide o instrumento contra o que você já sabe** — um conjunto pequeno de
respostas conhecidas — **antes de confiar no que ele diz que você não sabia.** Ver
também "o instrumento mente mais que o produto", em
[COMO-OLHAR-A-TELA.md](COMO-OLHAR-A-TELA.md).

### A6 — a rede derruba agente longo

Dez agentes morreram por instabilidade de Wi-Fi. Workflows têm
**`resumeFromRunId`**: os concluídos voltam do cache e só os que falharam
re-rodam. **Relance sempre; nunca refaça do zero** — refazer gasta o token de
novo e produz uma segunda versão do mesmo relatório, que é trabalho para o
sintetizador desempatar.

---

## O que todo prompt de agente tem de conter

Lista de verificação. Falta de qualquer item já custou uma leva:

1. **As regras da casa** — português do Brasil com acentuação (há portão),
   "fato errado se substitui em todos os lugares", nada de MAC real, nada de
   verbosidade.
2. **A posse de arquivo, positiva e negativa** — os arquivos que ele possui, e a
   lista explícita do que **não** tocar (arquivos de outros agentes da mesma
   leva, `src/` quando ele é de documentação).
3. **A bancada e seu estado** — se ela está medindo, dizer que o daemon e os
   controles estão fora de alcance (R3).
4. **O que NÃO rodar** — a suíte inteira (R2), `retratar_abas.py` (R4), qualquer
   portão que reescreva artefato compartilhado.
5. **A exigência de mordida** — arrancar a cura, ver reprovar, devolver; e o
   dublê que sabe recusar (A2).
6. **O formato do relatório** — o que devolver e como, porque a resposta final é
   o que o sintetizador lê. Agente que responde "pronto" queimou o próprio
   trabalho.
7. **O que fazer quando o conserto pede arquivo alheio** — relatar, não editar
   (R1).

---

## O relatório do agente não termina no transcrito

A saída bruta vai para `docs/process/agentes/`, **pelo sanitizador**:

```bash
python3 scripts/sanitizar_saida_de_agente.py ORIGEM DESTINO
```

O porquê, e o que o sanitizador recusa, está em
[agentes/README.md](agentes/README.md) — leia antes de salvar a primeira saída.
Em resumo: o portão de anonimato **não olha** `docs/process/**`, e foi por ali
que segredo entrou no repositório uma vez.

**Mas saída bruta não é entrega.** Pesquisa que não vira sprint, portão ou
correção de fato é token queimado — a conclusão tem de virar arquivo em
`docs/process/sprints/` ou uma substituição no documento que estava errado.

---

## Ver também

- [COMO-OLHAR-A-TELA.md](COMO-OLHAR-A-TELA.md) — a foto, os instrumentos, e as
  armadilhas de medição que este projeto já pagou.
- [2026-08-23-ONDE-PARAMOS](2026-08-23-ONDE-PARAMOS-os-doze-defeitos-de-forma-e-a-regencia.md)
  — o estado da leva que originou este documento.
- [agentes/README.md](agentes/README.md) — onde a saída bruta mora, e o que a
  impede de vazar.
