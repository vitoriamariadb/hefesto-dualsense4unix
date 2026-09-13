---
sprint: LIGHTBAR-NA-STEAM-01
estado: aberta
onda: A-TERCEIRA-LISTA-DELA
posse:
  LIGHTBAR-NA-STEAM-01:
    # PROVISÓRIA — o ESTUDO escreve a posse real no §E antes do despacho.
    - docs/process/sprints/2026-09-13-LIGHTBAR-NA-STEAM-01-a-luz-dentro-da-steam-e-as-guardas-que-se-autoaplicavam.md
bancada: false
depois_de: []
---

# LIGHTBAR-NA-STEAM-01 — a luz dentro da Steam, as guardas que se autoaplicavam, e as features que talvez não cheguem ao jogo

A palavra dela está no índice: *«ler sobre como descobrimos como funcionava a
escrita do lightbar dentro da steam e como fizemos os guards funcionarem lá pra
isso sempre se autoaplicar. tenho receio que nossas features não cheguem aos
jogos pelo mesmo motivo ou semelhantes. inclusive acho que o lightbar perdeu
essas qualidades… ou foi desligado recentemente. Preciso que a auditoria revele
isso.»*

## §0 — Onde a casa guardou essa história (a ler, não a copiar)

`docs/process/sprints/`: `2026-08-02-LIGHTBAR-BT-CLAIM-01`,
`2026-08-03-LIGHTBAR-BT-CULPADO-01`, `2026-08-05-SALVAR-NAO-REBAIXA-02`,
`2026-08-07-A-LUZ-QUE-CUROU-01`, `2026-08-16-SENTINELA-WRAPPER-01`,
`2026-08-22-LUZ-CEGA-01`, `2026-08-27-ONDA-CONTROLES-01-a-faixa-que-a-steam-guardava`,
`2026-08-29-MIGRA-PERFIS-05`, `2026-09-01-LUZ-NO-RADIO-01`,
`2026-09-02-LUZ-DO-MIC-01`; os `docs/protocol/` (referência canônica, drivers,
`pilha-steam-input-xpad-sdl.md`) e os ONDE PARAMOS de agosto.

## §E — O ESTUDO (só lê e mede; escreve aqui)

1. **A história, com commit e data:** como a casa descobriu quem escreve na luz
   com a Steam aberta, e quais guardas fazem a cor voltar sozinha (o que
   dispara, com que frequência, onde mora).
2. **A regressão:** cada guarda ainda existe, ainda é chamada e ainda está
   ligada por padrão? `git log -S`/`-G` nos símbolos das guardas desde 01/09;
   flags de ambiente, `default.env`, opções do install, `doctor`. Diga se a luz
   «perdeu as qualidades» e em qual commit, com a prova.
3. **As outras features no jogo:** gatilhos adaptativos, vibração, máscara,
   microfone e som — cada uma pode ser sobrescrita ou calada pelo mesmo
   mecanismo (Steam Input, SDL, o próprio jogo, o wrapper)? Onde há guarda e
   onde não há.
4. Proponha a cura (religar, generalizar a guarda) e a posse real. Sem aparelho
   o estudo mede com dublê e journal; o que só o aparelho responde fica
   escrito para a MESA-DE-QUATRO-01.

## §I — IMPLEMENTA  ·  §V — VALIDA/CORRIGE

Escritos por quem coordena depois do estudo.
