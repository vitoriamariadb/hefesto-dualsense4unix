---
sprint: PARIDADE-REMEDIR-02
estado: aberta
onda: J
posse:
  PARIDADE:
    - docs/data/paridade-gtk-html.csv
    - docs/process/2026-09-03-O-TERCEIRO-NUMERO-a-paridade-com-a-gtk.md
cria: []
bancada: false
depois_de:
  - PARIDADE-CRUZA-O-MAPA-01
  - JOGAR-OS-SEIS-AVISOS-01
  - CONTROLES-OS-TRES-SELOS-01
  - GATILHOS-EM-TODOS-01
  - VIBRACAO-O-QUE-SOBROU-01
  - SISTEMA-OS-QUATRO-QUE-FALTAM-01
  - PERFIS-O-PRECO-E-O-RADIO-01
  - ILUMINACAO-O-AVISO-DOS-N-01
  - CONEXOES-A-LUZ-QUE-NAO-ACENDE-01
  - EXTERNOS-01
  - COOP-NA-CONEXAO-NATIVA-01
  - A-CONFISSAO-NO-BOTAO-01
nao_toca:
  - src/
  - tests/
  - scripts/
  - mockup/
  - docs/data/mapa-controles.csv
---

# PARIDADE · REMEDIR 02 — as linhas que as ondas G a J fecharam voltam ao CSV

> **ROTA — 06/09/2026, arrumação da leva (Fable, PO por delegação).** Esta sprint nasceu da
> definição de pronto dela — *"migrar tudo do gtk pro html … todas as features funcionando"* —
> medida contra o CSV da paridade: as linhas abaixo estavam `FALTA_NO_HTML` **sem nenhuma
> sprint aberta encarregada**. O enunciado de cada uma é a própria linha do CSV.

A irmã da PARIDADE-REMEDIR-01 (hoje, 57 → 39 `FALTA`), com o mesmo método e a mesma régua: **cada relatório de `docs/process/agentes/2026-09-06/` entrega o texto da linha pronto, e você NÃO cola sem abrir o código** — `sinal` no código do lado HTML, `html_onde` lido nesta árvore. A regra que a REMEDIR-01 firmou vale inteira: `DIFERENTE` exige a MESMA resposta por outro caminho, com endereço; se a resposta não chega à tela, é `FALTA`, mesmo por escolha dela (`D-0609-ADIAMENTO-NAO-E-REMOCAO`). Mordida: arranque o `sinal` de cada linha promovida e o portão nomeia. É a **última sprint de agente** antes do FECHO: o número que ela publica é o número do dia.

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
