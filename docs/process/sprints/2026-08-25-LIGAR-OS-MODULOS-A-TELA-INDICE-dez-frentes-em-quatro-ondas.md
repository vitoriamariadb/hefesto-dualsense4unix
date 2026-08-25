---
sprint: LIGAR-OS-MODULOS-A-TELA
posse:
  QUEM-COORDENA:
    - docs/process/sprints/2026-08-25-LIGAR-OS-MODULOS-A-TELA-INDICE-dez-frentes-em-quatro-ondas.md
    - tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py
cria:
  - docs/process/sprints/2026-08-25-LIGAR-OS-MODULOS-A-TELA-INDICE-dez-frentes-em-quatro-ondas.md
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/
---

# LIGAR OS MÓDULOS À TELA — dez frentes em quatro ondas

**25/08/2026.** Índice de execução da leva que converte em produto o que a
madrugada de 25/08 construiu e deixou sem consumidor.

**O defeito, em uma frase:** a madrugada entregou **cinco módulos** com testes
verdes que **nenhuma linha de tela chama**. É `A-CASA-SABE-E-O-PRODUTO-NÃO-FAZ`,
o defeito mais caro desta casa, cinco vezes de uma vez — e o maior deles, o
motor do arranjo, são **1.157 linhas** portadas de um mockup a pedido dela
(*"a mesma lógica na GUI"*).

**A aba "Conexões" ainda não existe.** Medido: `main.glade` define onze abas e a
décima primeira continua sendo "Configurações" (`grep -c Conexões` → 0).

---

## Como este plano foi feito

Sete batedores (um por módulo, mais o forense do berço e o leitor das sprints)
→ três céticos com lentes distintas (alcance por import, destino de tela,
colisão de arquivo) → **um** sintetizador dono do plano. Onze agentes.

Os céticos ganharam o preço: **o rótulo `SEM_GUI` de dois módulos enganava para
menos** — pelo fecho de import são **cinco órfãos totais, não três**.

---

## As dez frentes

| # | O que entrega | Módulos que liga | Tamanho |
|---|---|---|---|
| **G1** | A ordem de serviço sai do tooltip e vira **card** | `ordens_da_mesa`, `portas_do_barramento`, `entradas_do_gabinete` | 250-400 |
| **G2** | O card responde: "Já movi", "Ignorar", e o "não sei" para de sair verde | resto de `ordens_da_mesa`, `MesaDeclarada.ordens_dispensadas` | 150-250 |
| **G3** | O esquema aprende `perto`, `alto`, `nos` — e a declaração ganha por onde descer ao disco | `lugar_declarado`, `mapa_das_portas` | 80-120 |
| **G4** | O motor para de ter dois donos para o mesmo número, e de mostrar mapa sem receita | `arranjo_da_mesa` | 60-100 |
| **G5** | A janela do desenho **julga**: cada quadrado diz se o aparelho fica bem ali | `arranjo_da_mesa` → `mapa_da_mesa` | 300-400 |
| **G6** | Com o Hefesto parado, o que ela declara **desce ao disco** | `lugar_declarado` (o chamador) | 40-60 |
| **G7** | **MOTOR-7** — o install lê o firmware e a aba abre com o gabinete desenhado | `censo_do_gabinete` (nasce) | 350 |
| **G8** | O berço que vaza — a suíte escreveu na fila de identidade dela | `conftest`, `check_faixa_sintetica` | 60-100 |
| **G9** | O léxico nos arquivos que ele possui | — | 200-300 |
| **G10** | O léxico nos quatro cedidos: a aba para de falar barramento com quem vê gabinete | — | 150-250 |

**A G7 é o pedido dela que não virou código:** *"manda isso tudo pro nosso
install viu. não podemos deixar isso passar."* Medido hoje contra o disco:
`censo_do_gabinete.py` **não existe**, <!-- ref-externa: nasce NA G7; a ausência é o assunto -->
`install_censo_do_gabinete_host()` **não existe**,
`test_censo_do_gabinete.py` **não existe**. <!-- ref-externa: nasce NA G7; a ausência é o assunto -->

O portão de referências acusou estas duas linhas assim que elas nasceram, e
estava certo em acusar: ele não tem como distinguir *"citei um arquivo que não
existe por engano"* de *"o arquivo não existir é o meu ponto"*. A isenção acima
é a resposta que o próprio portão oferece, e ela é de linha — some sozinha no
dia em que os dois arquivos nascerem.

E ela tem uma armadilha que a própria sprint já mediu: **a BIOS desta placa
mente.** Declara 5 conectores USB onde a traseira tem 8, e inventa um USB-C que
não existe. Por isso o firmware entra como **sugestão com selo**, nunca como
verdade — e quando as fontes divergirem, a aba mostra a divergência em vez de
escolher. *Divergência escondida é o F6 desta casa.*

## A ordem: quatro ondas, e quem decide é a POSSE

```
ONDA 1  G1 · G3 · G4 · G6 · G7 · G8 · G9      sete árvores em paralelo
ONDA 2  G2 (depois de G1)  ‖  G5 (depois de G3 e G4)
ONDA 3  G10 SOZINHA — abre os quatro arquivos mais disputados
ONDA 4  quem coordena aplica os manifestos de lápide num commit só
```

As listas da Onda 1 são disjuntas **arquivo por arquivo**, conferido com
`reivindicacao()` do portão de colisão. G2 e G1 escrevem o mesmo
`secao_exame.py` — R5 não admite exceção.

## As colisões, e quem ficou dona

| arquivo | dona | por quê |
|---|---|---|
| `secao_exame.py` | G1 → G2 → G10, **em série** | três pretendentes, nunca em paralelo |
| `secao_mesa.py` | **G10**, e só para texto | cinco pretendentes viram um: a MOTOR-5 sai da leva |
| `secao_orcamento.py` | **G10**, só texto | `plano_de_radio` já responde ali; fiar um segundo motor põe duas respostas na mesma seção |
| `utils/maquina.py` | **G3** | destrava a calibração e o motor de uma vez |
| `mapa_das_portas.py` | **G3**, ACRESCENTANDO | dois batedores se contradiziam sobre editar `vizinhas_de_verdade`; nasce `irmas_de` e a antiga fica intacta |
| `footer_actions.py` | **G6** | não tinha dono — e "sem dono" aqui é **sem proteção**, não território livre |
| `portao_a_casa_sabe…` | **QUEM COORDENA** | cinco frentes o tocariam; cada uma entrega um manifesto, um commit só no fim |
| `ordens_da_mesa`, `portas_do_barramento`, `entradas_do_gabinete` | **NINGUÉM — congelados** | têm teste verde; o defeito não é neles, é que ninguém os chama. Consumir cura o órfão; editar cria trabalho novo |

**`lugar_declarado.py` era órfão de SPRINT** — não aparecia em `posse`, `cria`
nem `nao_toca` de nenhuma das dez sprints anotadas. Ganha dono em G3/G6, e a
declaração entra no frontmatter **antes** do despacho, ou o gate recusa.

## O risco que precisa estar escrito na ordem de cada agente

**O portão da dívida fica VERMELHO na árvore de cada frente, por construção.**
Ele morde nos dois sentidos, e a leva apagaria 70 das 112 chaves de
`_SEM_CAMINHO_HOJE`. **Isso NÃO é critério de aceite da frente** — se for, o
agente vai tentar consertar o arquivo alheio e o plano se desfaz em silêncio.

**Três lápides colaterais que nenhum batedor viu:**
`utils/maquina.py::gravar_rascunho_da_mesa` cai com G6;
`mapa_das_portas.py::portas_livres` e `::vizinhas_de_verdade` caem com G1.
As outras duas de `mapa_das_portas` continuam órfãs e **devem ficar declaradas**
— o estrago é 2 de 4, não 4.

## O que é DELA

1. **A palavra final sobre todo texto novo de tela** (PROVA-DE-TELA-01), em
   cinco lugares desta leva. Somam-se às **43** que já esperam desde a madrugada.
2. **A pergunta de bancada do par de entradas.** `nota_de` lê `Entrada.par` como
   um irmão fixo **inclusive na entrada vazia** — é o que dispara as penalidades
   de vizinho rádio. Sem isso, metade do motor publica juízo otimista demais.
3. **Qual das duas réguas responde "qual controle move para qual adaptador".**
   Hoje há DUAS, e uma já está na tela.
4. **Se o Python pode divergir do mockup dela.** O `arranjo_da_mesa` guarda
   260/277 arredondados contra os 260,4 / 170,5+106,2 do dono único
   (`radio_da_mesa`), que tem portão contra o CSV. Importar do dono quebra a
   paridade com o mockup. **São duas verdades no mesmo repositório**, e a
   escolha tem preço dos dois lados.
5. **Se a calibração inteira fica fora desta leva.** É a proposta do
   sintetizador: janela nova de centenas de linhas, carimbo D3 em quatro
   tarefas, e a **primeira animação do produto** — que já quebrou um retrato
   em 14/08.
6. **MAPA-8:** o serial USB é o endereço Bluetooth em adaptador que não seja
   TP-Link? Exige aparelho na mão. Hoje o casamento aparelho→entrada se sustenta
   numa marca só.
7. **A janela do mapa nunca foi vista por ninguém.** É a única tela NOVA da leva
   anterior, e o relatório de quem a escreveu diz: *"layout, quebra de fileira,
   tamanho dos quadrados e legibilidade dos rótulos são todos NÃO
   VERIFICADOS"*. G5 põe mais coisa em cima dela.

## O que já fechou em 25/08, antes desta leva

Seis commits, e três deles saíram de defeitos que a **conferência** achou, não
o executor:

- `1dbe2ca` o `steam` sai do perfil Navegação — e da **fábrica**, que ninguém
  tinha notado;
- `263ace7` as cinco sprints ganham posse legível pela máquina;
- `5026694` a barra dizia "não há controle na mesa" em **quatro** casos onde há
  (regressão da própria frente C1) + os três relatórios que faltavam;
- `a7dc740` o veredito do hide afirmava as três superfícies de quem não mediu;
- `71c14d9` os quatro endereços forjados saem da fila de identidade dela, e a
  régua da faixa passa a enxergar **backup**;
- `94fa7a4` um `# dona: A` no fim da linha cegava o portão de colisão inteiro.

**Três réguas desta casa foram pegas sem medir o que prometem, no mesmo dia.**
É o padrão que o `COMO-OLHAR-A-TELA.md` já nomeia, e ele não está esgotado.
