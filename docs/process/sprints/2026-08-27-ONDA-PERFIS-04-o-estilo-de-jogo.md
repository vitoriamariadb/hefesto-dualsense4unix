---
sprint: ONDA-PERFIS-04
estado: absorvida
# onda: PERFIS
posse:
  P4:
    - src/hefesto_dualsense4unix/app/actions/profiles_actions.py
    - src/hefesto_dualsense4unix/profiles/loader.py
    - assets/profiles_default/
cria:
  - docs/process/sprints/2026-08-27-ONDA-PERFIS-04-o-estilo-de-jogo.md
  - src/hefesto_dualsense4unix/profiles/estilos.py
  - assets/estilos_de_jogo/
  - tests/unit/test_catorze_estilos_de_fabrica.py
  - tests/unit/test_o_estilo_preenche_o_perfil_inteiro.py
bancada: false
depois_de:
  - ONDA-PERFIS-01
  - ONDA-PERFIS-02          # o id `estilo` do seletor nasce lá
  - ONDA-PERFIS-03          # profiles_actions.py
  # SÉRIE, por R5: esta sprint divide assets/profiles_default/
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-NAVEGACAO-05
  - IDENTIDADE-01  # fechou em 54b7ffd2 (o app-id e a migração); a série é nominal
  - LEVA-2  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/profiles/schema.py
  - src/hefesto_dualsense4unix/daemon/
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 10). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA PERFIS · 04 — Estilo de Jogo: catorze de fábrica, e o fim do aba-a-aba

**O defeito em uma frase:** para o controle ficar do jeito de um jogo de tiro,
ela abre seis abas e ajusta gatilho, luz, vibração, som, sensores e máscara uma
por uma — e os seis perfis de gênero que fariam isso sozinhos
(`assets/profiles_default/`) são **perfis**, então competem por prioridade em
vez de servirem de ponto de partida.

## A palavra dela

> *"pensando num user que tem lá um jogo tipo call of duty, ao invés dele
> configurar aba a aba cada feature do controle, esse jogo ou perfil já
> pré-aplica um default pra todas as abas. Aí o cara abre o jogo que ele só
> marcou lá da steam e joga com um perfil universal ao invés da lógica estranha
> do regex."* — D-ESTILO-DE-JOGO-E-UM-PRESET-UNIVERSAL

> *"no campo estilo de jogo tem que aparecer o campo pra selecionar o jogo,
> assim como temos pra steam, e temos que ter na aba jogo também."* — idem

## O que já existe no disco

Seis arquivos em `assets/profiles_default/`: `acao.json`, `aventura.json`,
`corrida.json`, `esportes.json`, `fps.json`, `point_and_click.json`. Cada um já
traz **gatilhos, LEDs, brilho, rumble e modo** resolvidos — `fps.json` é o
retrato do que um estilo é: `Rigid` à esquerda, `SemiAutoGun` à direita,
lightbar `[200,20,20]`, `mode.kind: gamepad`.

O que eles **não** têm: nome de estilo, mic, alto-falante, sensores e máscara —
e são semeados como perfil (`loader.py:140` `seed_default_presets`), com
prioridade 60 competindo com os perfis de jogo dela.

## O que entrega

1. **`profiles/estilos.py`** — o catálogo, com dono único. Cada estilo é
   `(id, rótulo, payload)`, onde o payload é um **fragmento de `Profile`**:
   as seções que o estilo resolve, e só elas. Nada de `match`, `name` nem
   `priority` — quem escolhe o alvo é o perfil, não o estilo.
2. **Catorze de fábrica + o Personalizado** (D-CATORZE-ESTILOS-DE-FABRICA),
   na ordem do mockup (`10-perfis.html:602-616`):
   FPS · Corrida · Ação · Aventura · Esportes · Point-and-click · **Terror** ·
   **Luta** · **Co-op na mesa** · **Maratona** · **Plataforma** ·
   **Retrô/Emulador** · **Ritmo/Música** · **Simulação/Voo** · Personalizado.
   Os seis primeiros **herdam os JSON de hoje**, campo a campo — não se
   reinventa o que já foi ajustado. Os oito novos são conteúdo a escrever, e o
   único aprovado por escrito é o FPS: *"metralhadora nos gatilhos, tons
   escuros um por controle, rumble máximo, mic ativo"*.
   **Por que Terror e Luta:** medido na biblioteca dela — dos 23 jogos com
   perfil no disco, **dez são de terror** e não havia preset; e Luta é o jogo
   aberto agora (Mortal Kombat).
3. **Os de fábrica não se editam** (palavra dela). O `Personalizado` é o que
   aceita o que ela ajustou nas outras abas.
4. **Escolher um estilo pré-aplica o perfil inteiro no editor** — as seções do
   payload entram no rascunho, e as abas passam a mostrar aquilo. Isto é a
   sprint: *pré-aplica*, não *grava*. Quem grava é o Salvar (ONDA-PERFIS-08).
5. **"Estilo de Jogo" como ambiente**: com `estilo` escolhido no seletor, o
   `match` sai da lista de jogos daquele estilo — que é exatamente a forma dos
   seis JSON de hoje (`window_title_regex` + `process_name`). A linha da lista
   fica `Estilo de Jogo · Terror` (`10-perfis.html:549`).
6. **O campo do jogo aparece também no Estilo de Jogo** (palavra dela, acima).
7. **Os seis deixam de ser semeados como perfil.** `seed_default_presets`
   (`loader.py:140`) perde os seis nomes; e a migração **respeita quem já os
   tem no disco**: o arquivo dela não é apagado — ele deixa de ser
   ressemeado, e o marcador `.seeded_presets` (`loader.py:98`) continua sendo o
   contrato que impede ressurreição.

## Como se prova (o teste que morde)

`tests/unit/test_catorze_estilos_de_fabrica.py`:

1. **Catorze mais um**, com os ids e os rótulos na ordem do mockup. Mordida:
   tire o `Terror` e veja reprovar nomeando o que falta.
2. **Todo estilo de fábrica resolve as seis famílias** que ela nomeou —
   gatilho, luz, vibração, som, sensores e máscara. Um estilo que deixa uma
   família em branco reprova: metade de um preset é pior que nenhum, porque a
   pessoa acha que configurou. Mordida: apague a seção de som de um estilo e
   veja reprovar dizendo qual.
3. **Nenhum estilo carrega `match`, `name` ou `priority`.** Mordida: acrescente
   um `match` a um payload e veja reprovar.
4. **Os seis herdados batem com o JSON de hoje.** Comparar campo a campo contra
   `assets/profiles_default/*.json` **na versão de antes desta sprint** (o
   arquivo entra como fixture). Mordida: mude um parâmetro de gatilho do FPS e
   veja reprovar — é a rede contra "reescrevi o preset dela sem querer".

`tests/unit/test_o_estilo_preenche_o_perfil_inteiro.py`: escolher um estilo no
editor dublê preenche as seis famílias do rascunho **e não toca em `name`,
`priority` nem `match`**. Mordida: faça a aplicação sobrescrever o nome e veja
reprovar.

## O que é dela decidir

1. **O conteúdo dos oito estilos novos.** Só o FPS tem conteúdo aprovado. Os
   outros sete precisam da palavra dela ou de uma proposta para ela olhar —
   e o formato que funciona com ela é **ver**, não ler.
2. **Duplicar um estilo de fábrica vira um Personalizado editável, ou os
   catorze são só escolha e ponto?** (redesenho, "falta decidir" §5 da Perfis).
3. **Point-and-click**: D-O-ESTILO-APONTA-PARA-O-MODO diz que o estilo existe
   aqui mas *o que cada botão faz* se define na aba Navegação. Esta sprint traz
   o estilo; o atalho para a Navegação é da onda daquela aba.
4. **Um perfil com Estilo escolhido E jogo escolhido**: o estilo é ponto de
   partida (aplica e ela ajusta por cima) ou trava (o perfil segue o estilo
   para sempre)? O mockup mostra `Mortal Kombat` com `Estilo: Luta` e ambiente
   `Jogo` ao mesmo tempo (`10-perfis.html:588`, `:609`), então os dois convivem
   — falta dizer quem vence quando ela mexe numa aba depois.
