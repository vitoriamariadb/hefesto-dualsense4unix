---
sprint: ONDA-SISTEMA-06
estado: absorvida
# onda: SISTEMA
posse:
  S6:
    - src/hefesto_dualsense4unix/integrations/prontuario_dos_jogos.py
    - src/hefesto_dualsense4unix/integrations/proton_pin.py
    - src/hefesto_dualsense4unix/app/actions/daemon_actions.py
cria:
  - tests/unit/test_onda_sistema_06_os_dois_motores.py
bancada: false
depois_de:
  - ONDA-SISTEMA-01
  - ONDA-SISTEMA-02
  - ONDA-SISTEMA-04
  - ONDA-SISTEMA-05
  - LEVA-1  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/integrations/storm_doctor.py
  # O portão da dívida é de QUEM COORDENA, e não desta onda: cada sprint
  # entrega o MANIFESTO do que ligou, e quem coordena aplica todos num
  # commit só. Está decidido desde 25/08 em
  # 2026-08-25-LIGAR-OS-MODULOS-A-TELA-INDICE-dez-frentes-em-quatro-ondas.md
  # ("cinco frentes o tocariam; cada uma entrega um manifesto").
  - tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 09). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA SISTEMA · 06 — Os dois motores que ninguém chama

**O defeito:** dois botões desta aba prometem mais do que executam, porque a
função que cumpre a promessa **existe, está testada e não tem chamador de
produção** — é o defeito mais caro desta casa.

## Motor 1 — "Consertar problemas conhecidos"

| | |
|---|---|
| O que o botão faz hoje | `app/actions/daemon_actions.py:1204` (`on_storm_fix_safe`) roda **dois scripts de shell**: `scripts/disable_steam_input.sh --apply-quiet` e `scripts/fix_wireplumber_default_source.sh --install` |
| O motor que existe | `integrations/prontuario_dos_jogos.py:885` — `curar_o_que_e_automatico()`, que despacha pela tabela `_CURAS` (`:879`) os estorvos com `automatica=True`, devolve os `manuais` **nomeados**, e sabe dizer `adiado_steam_aberta` quando não é a hora |
| Chamadores de produção | **zero** — só o `__main__` do próprio módulo (`:1019`) e o teste `tests/unit/test_ponte_steam_input_01_a_lista_que_so_preservava.py:431` |

A própria docstring do motor diz o que está em jogo: *"nada no produto o
importava: só o teste dele. Modelo que ninguém consulta é o defeito mais caro
desta casa, o da cura escrita e nunca ligada. Esta função é o fio."*

Contrato: redesenho, tabela dos botões — *"Consertar problemas conhecidos …
**ganha motor**: `integrations/prontuario_dos_jogos.py:885`
(`curar_o_que_e_automatico`, **sem nenhum chamador hoje**)"*.

**Entrega:** `on_storm_fix_safe` passa a chamar `curar_o_que_e_automatico()`
e a relatar o que ele devolve — o que curou, o que **adiou** e por quê, e os
`manuais` **pelo nome**. Os dois scripts continuam, mas atrás do motor, não ao
lado dele: o motor é quem decide se é a hora. `format_fix_safe_result:825`
passa a formatar a `Cura`, não o dicionário improvisado do worker.

## Motor 2 — "Fixar a versão que funciona"

| | |
|---|---|
| O que falta | `integrations/proton_pin.py:184` — `steam_root_ou_recusa()`, escrita em 24/08 para dar o **motivo** quando a Steam não é achada (Flatpak/Snap, que `default_steam_root` exclui por decisão medida) |
| Chamadores de produção | **zero** — só o teste `tests/unit/test_ambiente_presumido_01_a_steam_dos_quatro_layouts.py:416` |
| Quem já espera por ela | `daemon_actions._frase_de_recusa_do_proton:957`, que **já** sabe traduzir `status="recusado"` + `reason` para português, e `format_proton_lock_result:985` |

O portão desta casa já nomeia o buraco e quem o fecha —
`tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py:1620`: *"o botão 'Travar
Proton validado' ainda chama só `default_steam_root`. O QUE FECHA: a Onda 5 ·
Emulação"*. **A Emulação morre** (`D-A-EMULACAO-MORRE`), então quem fecha é
esta sprint — e a nota do portão tem de ser **substituída**, não deixada ao
lado da certa (regra da casa, 11/08).

**Entrega:** `lock_proton_for_all_games()` (`proton_pin.py:903`) passa por
`steam_root_ou_recusa()` antes de qualquer trabalho e devolve
`status="recusado"` + `reason` quando não há raiz — que é exatamente o par que
`_frase_de_recusa_do_proton` já consome. O caminho fica completo sem inventar
frase nova.

## Como se prova (a mordida)

`tests/unit/test_onda_sistema_06_os_dois_motores.py`:

- **o motor 1 é chamado**: dublê de `curar_o_que_e_automatico` que **conta**
  chamadas; clicar no botão chama uma vez. Arranque a chamada e veja
  reprovar;
- **o motor 1 sabe recusar**: dublê devolvendo `adiado_steam_aberta` → o toast
  **diz que adiou** e aponta "Deixar tudo pronto"; dublê com dois `manuais` →
  o toast **nomeia os dois**. Silêncio sobre o que não foi curado é o defeito
  que `HONESTIDADE-STEAM-01` já pagou (`daemon_actions.py:1204`);
- **o motor 2 recusa com motivo**: um `HOME` com Steam **só** em Flatpak faz
  `lock_proton_for_all_games` devolver `status="recusado"` com `reason`, e
  `format_proton_lock_result` devolve a frase em português — **nunca** o
  *"Nada a mudar — os jogos já estão no Proton validado"*, que é o falso verde
  que a T-04 curou em 25/08 e que volta sozinho se o gate ficar de fora;
- **o portão não fica mentindo**: as duas entradas do
  `portao_a_casa_sabe_e_o_produto_nao_faz.py` saem (a de `steam_root_ou_recusa`
  e, se houver, a de `curar_o_que_e_automatico`), e o portão continua verde —
  agora porque há chamador, não porque há nota.

## O que é dela decidir

- **Nada de tela nova.** Os dois botões já existem, com os rótulos que ela
  aprovou. O que muda é o que acontece ao clicar e o que o toast diz.
- Se o motor 1 passar a **nomear jogos** no toast, confira o portão de
  anonimato antes de commitar: `bash scripts/portoes.sh` (nome de jogo é
  público, endereço de rádio não é — mas o toast é copiado para relatos).
