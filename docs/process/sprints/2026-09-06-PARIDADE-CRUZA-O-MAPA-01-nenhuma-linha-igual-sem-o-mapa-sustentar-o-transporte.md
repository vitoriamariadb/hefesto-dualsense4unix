---
sprint: PARIDADE-CRUZA-O-MAPA-01
estado: feita
onda: H
posse:
  PORTAO:
    - scripts/check_paridade_gtk_html.py
    - docs/data/paridade-gtk-html.csv
    - docs/process/2026-09-03-O-TERCEIRO-NUMERO-a-paridade-com-a-gtk.md
cria:
  - tests/unit/test_a_paridade_cruza_o_mapa_de_canais.py
bancada: false
depois_de:
  - A-TELA-NOVA-ENTRA-NA-REGUA-DO-MAPA-01
nao_toca:
  - docs/data/mapa-controles.csv
  - src/
  - mockup/
---

# PARIDADE · CRUZA O MAPA — nenhuma linha IGUAL sem o mapa sustentar o transporte

> **ESTADO 2026-09-06: feita** — o portão da paridade passou a perguntar ao mapa de
> canais (regras 10 `ponte-morta`, 11 `transporte-nao-declarado` e 12 `ponte-encolheu`
> em `scripts/check_paridade_gtk_html.py`, com 26 pontes declaradas e o veredito LIDO
> do mapa a cada execução); `nao-medido` vira AVISO e nunca `rc=1`
> (`D-0609-O-MAPA-INFORMA-NUNCA-VETA`); duas linhas que afirmavam paridade sem dizer o
> transporte ganharam a declaração com endereço no dono; e as duas linhas de veredito
> novo foram remedidas com medição de hoje — **as duas continuam `FALTA_NO_HTML`, e o
> que mudou foi a razão**. Entrega:
> `docs/process/agentes/2026-09-06/PARIDADE-CRUZA-O-MAPA-01-opus.md`.

> **ROTA — 06/09/2026, arrumação da leva (Fable, PO por delegação).** Esta sprint nasceu da
> definição de pronto dela — *"migrar tudo do gtk pro html … todas as features funcionando"* —
> medida contra o CSV da paridade: as linhas abaixo estavam `FALTA_NO_HTML` **sem nenhuma
> sprint aberta encarregada**. O enunciado de cada uma é a própria linha do CSV.

**Achado 3 da A-TELA-NOVA-ENTRA-NA-REGUA-DO-MAPA-01 (hoje):** `paridade-gtk-html.csv` e `mapa-controles.csv` são lidos juntos por exatamente dois arquivos — o gerador e o piloto — e por **nenhum portão**. Uma linha pode ser `IGUAL` na paridade enquanto o mapa diz `aciona=não` num transporte. O portão novo INFORMA, nunca veta (`D-0609-O-MAPA-INFORMA-NUNCA-VETA`): para toda linha `IGUAL`/`DIFERENTE` cujo `sinal` casa com uma `chave` do mapa, ele exige que a linha declare o transporte em que vale quando o mapa diz `parcial`/`não` num lado — e a palavra `nao-medido` na célula não é veto, é aviso. **E duas linhas do CSV precisam de veredito novo, com evidência:** a *ambiguidade fina das ordens* (08 — a premissa caiu, CONEXOES-LIGAR-TUDO-01) e a *caixinha do Steam Input* (10 — vive na aba 07 por `D-0609-STEAM-DIVIDIDO`, STEAM-INPUT-01). A tabela publicada do TERCEIRO-NUMERO acompanha.

---


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
