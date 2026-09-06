---
sprint: MIGRA-A-ORDEM
estado: absorvida
cria: nenhum módulo — este documento ordena, não constrói
---

> **ESTADO 06/09/2026: absorvida** — pela ROTA DO HTML (02/09) e pelo plano das 24 horas (06/09). Não se despacha pelo id.

# A ORDEM DAS DEZ ABAS — por onde o transplante entra, e o preço de cada posição

**29/08/2026.** Dez censos escreveram **109 sprints** e dez índices. Nenhum deles
podia escrever esta página, porque **cada um só via a sua aba**. Esta é a espinha:
qual aba muda de motor primeiro, e por quê.

**A EXECUÇÃO INTEIRA ESPERA UMA PALAVRA DELA.** Palavra dela, 29/08:

> *"Deixa a aba Controles completamente funcional. Preciso avaliar como ela se
> comporta. Depois dou o ok pra seguirmos materializando a ordem pra fazermos
> todas as abas funcionarem no novo motor."*

As 109 sprints **estão escritas**. Nenhuma se executa antes desse ok — e a ordem
abaixo é o que acontece **depois** dele.

---

## 1. A ORDEM, e o que decide cada posição

| # | Aba | Sprints | Por que aqui |
|---|---|---|---|
| **0** | **Controles** | 13 | **O PILOTO, e é decisão dela.** Já está viva em `scratchpad/controles-viva/` com a mesa REAL: dois controles, bateria, giroscópio lendo |
| **1** | **Vibração** | 8 | **A segunda mais barata, e a única já provada.** Foi nela que a prova da tecnologia rodou. Consolida o padrão com o menor risco |
| **2** | **Jogar** | 11 | **Fora de ordem de propósito, e o motivo é a cara do produto.** É a aba que abre. Se ela ficar velha enquanto o resto muda, a costura aparece **toda vez que ela abre o app** |
| **3** | **Perfis** | 6 | **A menor de todas.** Depois da Jogar porque o rodapé "Salvar Perfil" atravessa todas as abas — com três já no motor novo, o contrato do rodapé sai medido em vez de suposto |
| **4** | **Gatilhos** | 11 | Aba média, IPC bem conhecido (`trigger.set`), e é a menor do produto em todos os eixos (medido em 29/08, contra o "Rumble é a menor" que era corrida de dois cavalos) |
| **5** | **Iluminação** | 12 | Média. Depende do contrato de cor por controle que a Controles estabeleceu |
| **6** | **Sistema** | 10 | Média. Recebe o "Perfil de Bateria" e o "Retomar" que outras abas devolveram |
| **7** | **Lançadores** | 10 | Média-alta. A sprint 04 (backend) **corre solta desde o primeiro minuto** — o índice dela já diz isso |
| **8** | **Conexões** | 12 | Alta. É a aba do rádio, e o rádio é a 0.9.5 — ela mexe **na bancada** enquanto isso |
| **9** | **Navegação** | 16 | **A maior, e por último de propósito.** Dezesseis sprints, duas a mais do que o censo previu. Entra quando o padrão já rodou nove vezes |

**Total: 109 sprints.** A Controles (13) é a posição 0 porque já está feita.

---

## 2. O QUE VALE PARA AS DEZ, e por isso não se repete em cada uma

**As duas pontes nascem UMA VEZ**, na primeira aba executada, e as outras nove as
herdam: `run_javascript` (Python→tela) e `register_script_message_handler`
(tela→Python). **31 linhas, medidas.** Toda sprint `-03` de cada aba que diz "as
duas pontes nascem aqui" vira **verificação** depois da primeira.

**O enxerto SUBSTITUTIVO é a incógnita de todas**, e ainda não foi medido. O que
se provou em 29/08 foi o enxerto **aditivo** — o webview como 12ª página do
`Gtk.Notebook` real, 376 objetos em 56 ms. **Ninguém mediu TROCAR uma página**, e
é onde reaparecem as linhas que hoje chegam aos widgets por `builder.get_object()`.
Por isso ele é a sprint **01 de cada aba**, e por isso a posição 1 (Vibração, 8
sprints) é onde o preço real aparece primeiro.

**Se o enxerto substitutivo custar mais do que o previsto, a ordem não muda — o
prazo muda.** A ordem foi montada para que a notícia ruim chegue cedo e barato.

---

## 2b. AS 180 COLISÕES, e o que elas dizem sobre o projeto

**O portão de colisão reprovou as 109 sprints assim que entraram: 180 pares
reivindicavam os mesmos arquivos sem declarar a ordem.** Não é erro dos censos —
é a natureza do transplante, e vale ter o número escrito.

**Todas as 180 envolvem uma sprint MIGRA**, e só **3** são MIGRA contra MIGRA. As
outras 177 são a fila nova encostando na fila velha. E elas se concentram em
quatro arquivos, que somam **173 das 180**:

| Arquivo | Pares | O que ele é depois da migração |
|---|---:|---|
| `app/actions/lightbar_actions.py` | 90 | metade de tudo — é a aba Iluminação |
| `gui/main.glade` | 41 | **morre**: cada aba que migra sai dele |
| `app/app.py` | 23 | **sobrevive** — aqui a ordem importa de verdade |
| `daemon/ipc_handlers.py` | 19 | **sobrevive**: o daemon não muda de motor |

**A declaração aplicada, e o que ela significa:** cada sprint MIGRA ganhou
`depois_de:` com as antigas que disputam o mesmo arquivo. Isso **não decide** que
a sprint antiga continua valendo — decide só que as duas **não correm em
paralelo**. Quando a vez da MIGRA chegar, quem despachar vai ver se a antiga
ficou obsoleta (é o caso provável em `main.glade`, que a migração esvazia) ou se
ela entra antes (é o caso em `app.py` e `ipc_handlers.py`, que sobrevivem).

**Entre as três MIGRA × MIGRA, quem decidiu foi a tabela da §1**: `MIGRA-JOGAR`
está na posição 2 e `MIGRA-ILUMINACAO` na 5, então a Iluminação espera.

---

## 3. O QUE NÃO ENTRA NESTA FILA

- **A aba Emulação não está aqui.** O redesenho tem **dez** abas; o produto de
  hoje tem onze. O que a Emulação fazia se dissolveu nas outras, e o contrato de
  cada uma diz onde cada pedaço foi parar (`2026-08-26-O-REDESENHO-as-dez-abas.md`).
- **As 90 sprints de 27/08** (as dez ondas do desenho) são **outra fila** — elas
  desenham; estas 109 **ligam o desenho ao produto**. Onde as duas se tocam, o
  índice da aba diz qual vem antes.
- **A mesa de medição (`specs.html`)** é dela e minha, e não é sprint de agente.
  Palavra dela: *"aí eu e vc vamos pra linha de produção da mesa specs e os
  agentes fazem os demais."*

---

## 4. COMO SABER QUE UMA ABA FECHOU

Três provas, e nenhuma é opinião:

1. **A foto.** `scripts/gui-captura/retratar_abas.py` — a aba nova ao lado do
   mockup aprovado. O `.quadro` e o rodapé batem **ao pixel** com o Chrome.
2. **O dado é dela.** A aba nasce da mesa real: dois controles, não os quatro do
   desenho. Zero controle é um estado, e tem tela.
3. **A mordida.** Arranque a ponte e veja a aba reprovar. Uma aba que passa com
   a ponte arrancada não está ligada a nada.

---

## 5. O ERRO QUE ESTA ORDEM EXISTE PARA NÃO REPETIR

Em 29/08, seis réguas falsas em quinze horas — e a lição que vale aqui:

> *Uma régua que roda o tique uma vez mede um INSTANTE, não um comportamento.*

Uma leva daquele dia introduziu uma regressão que só aparecia **181 segundos
depois**, com 67 testes verdes. **Toda régua de aba desta fila tem de sobreviver
ao tempo passando** — a pessoa que usa o produto vive mais que o primeiro tique.
