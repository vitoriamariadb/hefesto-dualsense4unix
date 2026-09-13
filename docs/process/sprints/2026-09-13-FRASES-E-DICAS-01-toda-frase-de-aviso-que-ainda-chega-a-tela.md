---
sprint: FRASES-E-DICAS-01
estado: aberta
onda: A-TERCEIRA-LISTA-DELA
posse:
  FRASES-E-DICAS-01:
    # PROVISÓRIA — o ESTUDO escreve a posse real no §E antes do despacho.
    - docs/process/sprints/2026-09-13-FRASES-E-DICAS-01-toda-frase-de-aviso-que-ainda-chega-a-tela.md
bancada: false
depois_de: []
---

# FRASES-E-DICAS-01 — toda frase de aviso que ainda chega à tela, em qualquer forma

As palavras dela estão no índice (`2026-09-13-A-TERCEIRA-LISTA-DELA-INDICE.md`):
a frase da Steam *«… Feche a Steam e eu reponho.»* «segue aparecendo nas abas», e
a caixa laranja da aba Gatilhos *«Esse número é maior do que a quantidade de
controles ligados»* «também tem que parar de aparecer».

## §0 — O que já se sabe

* **A leva de 13/09 calou três portas** (TELA-CALADA-01/02/03 e a
  JOGAR-A-FAIXA-QUE-PULA-01): o sucesso não deposita recado; o cartão da Steam
  diz só a contagem; Sistema e Conexões perguntam e não narram. A tela dela
  ainda rodava a versão de antes quando ela escreveu — **meça na versão
  instalada depois de `e58bfe2b`**, não na memória.
* **O que ficou de pé por desenho:** a RECUSA. Ela ainda pousa no cartão do
  controle (30 s) — e a frase da sentinela é a recusa do «Consertar»; e a
  frase da imagem é `app/ipc_bridge.py` (`RuntimeError` do número do jogador),
  recusa também.
* **A regra dela de 13/09, lida pela régua desta casa:** frase de aviso não
  chega à tela, *em nenhuma aba e em nenhuma forma* — recado, faixa, caixa,
  dica flutuante, `title`. A tela mostra ESTADO (rótulo curto) e responde ao
  clique pelo sinal do botão.

## §E — O ESTUDO (só lê e mede; escreve aqui)

1. Liste TODA forma de frase de aviso que ainda chega à tela nas dez abas, com
   endereço: `.hef-recado` de recusa, caixas flutuantes, `title`, dicas `?`,
   frases emitidas por `blocos`/`mesa`. Separe **aviso** (sai) de **ajuda**
   que ela abre de propósito (o `?` que explica o controle) e de **estado**.
2. Ache a caixa laranja da foto: que nó, que gatilho (P2 desconectado? escolha
   de número?), quem escreve.
3. Proponha a cura de cada uma, sem botão novo; diga a posse real e o que
   colide com a TELA-CALADA-04 (que já pega a recusa sem coluna).

## §I — IMPLEMENTA  ·  §V — VALIDA/CORRIGE

Escritos por quem coordena depois do estudo.
