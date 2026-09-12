---
sprint: PAGINAS-ESPECIAIS-B1
estado: feita
onda: A-LINGUA-DA-TELA
posse:
  PAGINAS-ESPECIAIS-B1:
    - docs/process/agentes/2026-09-11/PAGINAS-ESPECIAIS-B1-opus.md
cria: []
bancada: false
depois_de: []
nao_toca:
  - src/
  - install.sh
---

> **ESTADO 12/09/2026: feita** — medido com `git cherry` contra
> `onda/0911c`: `voo/PAGINAS-ESPECIAIS-B1-opus` e `voo/APLICA-B1-opus` não tem um único commit fora da costura.
> O carimbo não é de quem entregou; é da MEDIÇÃO. Quatro irmãs desta
> mesma leva continuam `aberta` justamente por falharem nela.

# PAGINAS-ESPECIAIS-B1 — o inventário primeiro, a língua depois

Nasce da **A SEGUNDA LISTA DELA** (11/09/2026).

> *"temos as páginas especiais. Como calibração de sensores. mapa do controle.*  <!-- noqa-acento: citação literal dela -->
> *Definição de Controle e mouse, remapeamento, configurar point and click*  <!-- noqa-acento: citação literal dela -->
> *entre outras. Preciso que sejam analisada também."*  <!-- noqa-acento: citação literal dela -->

O *"entre outras"* é o ponto desta sprint: **nenhum documento desta casa diz
quantas são.** Ela nomeou cinco e sabe que há mais.

---

## §1 — O INVENTÁRIO, e ele vem ANTES de qualquer proposta

Um agente que comece a reescrever texto sem a lista reescreve as que achar e
declara o conjunto revisto. **Conte primeiro.**

Para cada página especial, uma linha:

| nome na tela | arquivo | como se chega | abre hoje? | quem a pinta |

**«Como se chega» é o que mais falta.** Uma página que só abre por um botão
dentro de outra aba é invisível para quem lê o código de fora — e é invisível
para ela também, se o botão não disser para onde leva.

**E «abre hoje?» se responde ABRINDO.** Não leia o código e conclua; dirija a
página pelo piloto (`run_javascript`) ou fotografe-a. Esta casa já publicou 77%
lendo o fonte onde a tela mostrava 36%.

## §2 — DEPOIS, A MESMA VISTORIA DE LÍNGUA DA ONDA A

Mesmo formato das cinco frentes de língua — a tabela
`arquivo:linha | o que a tela diz hoje | proposta | por quê`, a conta de
caracteres e o que você decidiu NÃO propor. O critério inteiro está no índice
da onda, §0.

**As cinco perguntas que cada linha responde:**

1. A frase diz o que ACONTECE quando se clica, ou explica a mecânica interna?
2. Cabe numa respiração?
3. Sobrevive à tradução, ou precisa do contexto desta casa?
4. Repete o que a tela já diz por outro meio?
5. Confessa dívida nossa? (decisão dela de 07/09 — se sim, sai)

## §3 — O QUE ESTA SPRINT ENTREGA, E O QUE NÃO

**ENTREGA:** o inventário, a foto de cada página que abre, a tabela de
proposta, e **a lista das que NÃO abrem** — que é achado de produto e vai para
o relatório, não para a tela.

**NÃO ENTREGA:** nenhuma linha de `src/`. Esta é frente de inventário e
proposta; a posse é só o seu relatório. Se você achar defeito de código,
escreva-o com endereço e deixe.

---

## O QUE VALE PARA TODA FRENTE DESTA ONDA

1. A tela dela é UMA SÓ e ela está usando a máquina. `--oculta` em toda janela.
2. Uma branch sua, árvore própria. Não toque em `dev`, não faça merge, não rode
   `install.sh`, nunca com sudo.
3. **Nunca rode o piloto contra o `~/.config` real dela** — ele dispara as
   migrações one-shot no perfil de verdade.
4. `git add -A` e `bash scripts/portoes.sh` antes de fechar.
5. Saída de comando vai para arquivo, nunca crua.
6. O índice da onda:
   `docs/process/sprints/2026-09-11-A-SEGUNDA-LISTA-DELA-a-lingua-da-tela-e-a-paridade-INDICE.md`
