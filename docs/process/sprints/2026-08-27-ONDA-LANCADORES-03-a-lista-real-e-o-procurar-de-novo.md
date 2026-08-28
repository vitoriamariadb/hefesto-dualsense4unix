---
sprint: ONDA-LANCADORES-03
onda: ABA-LANCADORES
posse:
  L3:
    - src/hefesto_dualsense4unix/app/actions/lancadores_actions.py
    - src/hefesto_dualsense4unix/app/widgets/cartao_do_lancador.py
cria:
  - docs/process/sprints/2026-08-27-ONDA-LANCADORES-03-a-lista-real-e-o-procurar-de-novo.md
  - tests/unit/test_lancadores_a_lista_real.py
bancada: false
depois_de:
  - ONDA-LANCADORES-01   # a casca e o widget do cartão
  - ONDA-LANCADORES-02   # o detector que alimenta a lista
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/integrations/lancadores_instalados.py
  - src/hefesto_dualsense4unix/integrations/prontuario_dos_jogos.py
---

# ONDA LANÇADORES · 03 — a lista real, a conta e o "Procurar de novo"

**O defeito, em uma frase:** a casca da 01 mostra o estado vazio; o detector da
02 sabe a resposta e ninguém os apresentou.

## O que entrega

- **Um cartão por lançador**, na ordem do mockup, alimentado pelo detector da 02.
- **A contagem de jogos.** Só a Steam tem catálogo hoje —
  `jogos_locais.jogos_da_biblioteca_steam()` (`integrations/jogos_locais.py:200`),
  que lê os `appmanifest_*.acf`. Os demais mostram **"—"**, que é o que o mockup
  mostra (`novo-layout/07-lancadores.html:516-551`). **Nunca "0 jogos":** zero é
  uma afirmação, e o produto não a mediu.
- **A conta do topo** — `N encontrados · N com impedimento` (`:468`).
- **O carimbo** *"N jogos já sabem por onde entrar"* (`:485`), vindo do veredito
  `PONTE_CONFIRMADA` do prontuário (`integrations/prontuario_dos_jogos.py:126-140`)
  — o único veredito daquele módulo apoiado em evidência **positiva**.
- **"Procurar de novo"** revarre em thread e repinta. O gesto herda o "Atualizar"
  da Emulação, mas **não é ele**: aquele relê o estado do daemon e vai para a
  Sistema ("Nada se perdeu"); este varre a máquina atrás de lançadores.

## A mordida

`tests/unit/test_lancadores_a_lista_real.py`, réguas puras:

1. `frase_da_conta(encontrados=6, impedidos=1)` → `"6 encontrados · 1 com
   impedimento"`, e com `impedidos=0` a segunda metade **some** (alinhado é
   silêncio — o mesmo critério de `daemon_actions.py:790`).
2. `rotulo_de_jogos(None)` → `"—"`. Arranque a cura (faça `None` virar `0`) → o
   teste reprova dizendo que a tela afirmaria "0 jogos" sobre um lançador que o
   produto nunca contou.
3. Censo dublado com um jogo `PONTE_CONFIRMADA` e dois sem → o carimbo diz
   **1**, e some quando não há nenhum.

## O que é dela decidir

1. **A aba lista LANÇADORES ou também os JOGOS de fora da Steam?** Medido: o
   catálogo de hoje só enxerga Steam (`jogos_locais.py:119` lê apenas `.desktop`
   com `steam://rungameid/`; o prontuário lê `appmanifest_*.acf` e
   `localconfig.vdf`). Listar jogo de Heroic, Lutris ou Flatpak é **varredura
   nova**, não é ligar o que existe.
2. **O carimbo fica aqui?** Ela mandou o `◆ este jogo já sabe por onde entra`
   sair da aba Perfis — *"Isso sai. Isso tá na aba Jogar."*
   (`novo-layout/_ferramentas/CORRECOES-DELA.md:79-86`). Aqui ele aparece
   **agregado** ("3 jogos já sabem por onde entrar") e ela aprovou a aba inteira
   depois disso. Fica como está, ou o agregado segue o individual?
