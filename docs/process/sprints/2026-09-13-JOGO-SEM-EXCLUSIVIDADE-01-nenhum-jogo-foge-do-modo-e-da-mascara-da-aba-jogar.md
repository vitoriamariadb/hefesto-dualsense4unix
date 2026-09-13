---
sprint: JOGO-SEM-EXCLUSIVIDADE-01
estado: aberta
onda: A-TERCEIRA-LISTA-DELA
posse:
  JOGO-SEM-EXCLUSIVIDADE-01:
    # PROVISÓRIA — o ESTUDO escreve a posse real no §E antes do despacho.
    - docs/process/sprints/2026-09-13-JOGO-SEM-EXCLUSIVIDADE-01-nenhum-jogo-foge-do-modo-e-da-mascara-da-aba-jogar.md
bancada: false
depois_de: []
---

# JOGO-SEM-EXCLUSIVIDADE-01 — nenhum jogo foge do modo e da máscara da aba Jogar

A palavra dela está no índice: o Sackboy *«não tá respeitando o modo e a máscara
setado na aba jogar… diferente do resto dos jogos»*, talvez também Pragmata e
Mullet Mad Jack, e *«nenhum jogo tem que ter esse tipo de exclusividade em
termos de config fora da interface»*.

## §0 — O que já se sabe (só nomes e endereços)

* Ela tem perfis de jogo para os três: `sackboytm_a_big_adventure.json`,
  `pragmata.json`, `mullet_mad_jack.json` em
  `~/.config/hefesto-dualsense4unix/profiles/`.
* O código já cita o Sackboy em dois lugares com cheiro de exceção:
  `cli/cmd_native.py` (*«os gatilhos adaptativos NATIVOS da Sony (Sackboy &
  cia), sem o hefesto no meio»*) e `interface/pacotes/a01_jogar.py`
  (*«"Jogar pelo Hefesto" parou de funcionar com o Sackboy marcado»*).
* `cli/cmd_steam.py` cita o Mullet Mad Jack aberto numa medição.
* Outras portas possíveis, a conferir: o `launch_env/steam_app_<appid>.env`
  por jogo, as opções de inicialização da Steam por jogo, a entrada Steam por
  jogo (`localconfig.vdf`), o Modo Nativo e as dispensas por jogo, a trava
  R-04 por origem do perfil, e campos do perfil de jogo que a tela não mostra.
* **Regra da casa que vale aqui:** *o produto é para qualquer usuário* — a cura
  não pode depender dos jogos dela nem ter lista de jogos.

## §E — O ESTUDO (só lê e mede; escreve aqui)

1. Para os três jogos e para um jogo que se comporta «como os demais»: todo
   lugar onde existe configuração POR JOGO que vence o modo e a máscara da aba
   Jogar — perfil, env, Steam, daemon —, com o valor lido (sem MAC, sem serial).
2. Diga qual é visível na interface e qual não é. O que não é visível e muda o
   comportamento é a exclusividade a tirar.
3. Proponha a cura geral e a posse real; diga o que acontece com os perfis que
   já estão no disco dela (migração ou leitura que ignora o campo).

## §I — IMPLEMENTA  ·  §V — VALIDA/CORRIGE

Escritos por quem coordena depois do estudo.
