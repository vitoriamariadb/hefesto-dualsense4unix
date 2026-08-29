---
sprint: MIGRA-SISTEMA-06
# onda: MIGRA-SISTEMA (a aba 09, no motor novo)
posse:
  M6:
    - src/hefesto_dualsense4unix/integrations/storm_doctor.py
    - src/hefesto_dualsense4unix/app/actions/daemon_actions.py
cria:
  - tests/unit/test_migra_sistema_06_os_cinco_achados_novos.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-PILOTO
  - MIGRA-MOLDURA-01
  - MIGRA-SISTEMA-01
  - MIGRA-SISTEMA-02
  - MIGRA-SISTEMA-03
  - MIGRA-SISTEMA-04
  - MIGRA-SISTEMA-05
  # `storm_doctor.py` é dela primeiro: a `LinhaDeSaude` de quatro campos nasce
  # lá, e os cinco achados novos já nascem no formato novo.
  - ONDA-SISTEMA-03
  # SÉRIE, por R5: dividem `storm_doctor.py` ou `daemon_actions.py` com esta.
  - ONDA-SISTEMA-01
  - ONDA-SISTEMA-02
  - ONDA-SISTEMA-04
  - ONDA-SISTEMA-05
  - ONDA-SISTEMA-06
  - ONDA-SISTEMA-07
  - LEVA-1
  - LEVA-2
nao_toca:
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/integrations/camadas_vulkan.py
  - src/hefesto_dualsense4unix/integrations/proton_pin.py
  - src/hefesto_dualsense4unix/integrations/prontuario_dos_jogos.py
  - novo-layout/
---

# MIGRA SISTEMA · 06 — As cinco linhas de exame que não existem

**O defeito:** o exame do mockup tem **oito** achados. O produto sabe fazer
**três** deles. Os outros cinco não existem em `storm_report` — e **quatro dos
cinco têm o dado pronto em outro módulo, sem chamador nenhum nesta aba.**

| a linha do desenho | o que existe hoje | o que falta |
|---|---|---|
| **O serviço sobe sozinho no login** | `systemctl is-enabled`, já consultado em `_refresh_daemon_view_async:1923` | **não é um achado** — é o valor do interruptor. Vira linha do exame |
| **Nenhuma sobreposição picotando o jogo** | `integrations/camadas_vulkan.py` **inteiro**, com censo, cura e relatório | **nenhum chamador de exame.** O único chamador é `on_camadas_engasgo` (`emulation_actions.py:2075`), que é **gesto**, não leitura — e mora na aba que morre |
| **Um gamepad virtual por jogador (co-op)** | `state_full` → `coop.vpads` (`daemon/ipc_handlers.py:3102`) | **sem leitor nesta aba** |
| **Proton fixado em 9.0-4 para 3 jogos** | `integrations/proton_pin.py` | `steam_root_ou_recusa:184` está **no registro do portão da casa-sabe** (`tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py:1623`) — escrito, testado, **sem chamador de produção** |
| **Bluetooth: 1 adaptador, N controles no rádio** | `integrations/radio_da_mesa.ocupacao_por_adaptador:323` | consumido hoje por `app/actions/config/secao_mesa.py:1331`, **nunca por esta aba** |

## O que entrega

1. **Cinco leituras novas, no formato de quatro campos** que a
   `ONDA-SISTEMA-03` criou. **Leitura, não gesto:** nenhuma delas conserta nada
   — quem conserta é a MIGRA-SISTEMA-07.
2. **Nenhuma delas reimplementa o que já existe.** Cada uma chama o módulo que
   já sabe: `camadas_vulkan.censo`, `radio_da_mesa.ocupacao_por_adaptador`,
   `proton_pin`, e o `state_full` para o co-op e o `is-enabled` para o serviço.
   **Duplicar o cálculo é o defeito que a `D-AS-ABAS-CONVERSAM` existe para
   matar** — e as duas cópias divergem no dia seguinte.
3. **Cada linha diz o que fazer quando não consegue ler.** `camadas_vulkan`
   tem `sabe_enumerar():436` justamente porque enumerar prefixo pode não dar; o
   `state_full` pode não vir. **"Não consegui ler" é um achado honesto; um `OK`
   sobre leitura que falhou é a mentira mais barata de escrever.**
4. **As cinco custam tempo, e o exame já roda em thread.** `_refresh_storm_diag`
   já é worker (`:1111`), e `medir_prontuario_dos_jogos` foi para lá justamente
   porque lê manifestos da Steam e perfis do disco (~1 s na máquina dela). As
   cinco novas entram **no mesmo worker**. Nenhuma delas na linha do GTK.
5. **A conta do rádio não se reescreve.** "1 adaptador, N controles no rádio"
   sai de `ocupacao_por_adaptador`. **Não conte adaptador por conta própria** —
   a `ONDA-CONEXOES-07` existe para haver **uma conta só** para o rádio.

## Como se prova (a mordida)

`tests/unit/test_migra_sistema_06_os_cinco_achados_novos.py`:

- **cada um dos cinco entra e sai da lista conforme a fonte.** Para cada:
  monte a fonte no estado A e no estado B e prove que o achado muda. **Arranque
  a chamada ao módulo e veja reprovar** — sem isso, este teste seria um dublê
  concordando consigo mesmo;
- **a cura não é reimplementada.** `grep` prova que o achado da sobreposição
  chama `camadas_vulkan`, e não uma varredura própria. Cole uma cópia do censo
  dentro do achado e veja reprovar;
- **leitura que falha vira achado, não `OK`.** Force `sabe_enumerar()` a
  devolver `False`, o `state_full` a estourar, e o `steam_root_ou_recusa` a
  recusar: os três casos têm de virar linha com motivo. **Devolva `OK` num deles
  e veja reprovar**;
- **o exame passa de 6-8 para 11-13, e a moldura tem de dizer se cabe.** Esta é
  a consequência aritmética das cinco, e ela colide de frente com a decisão
  aberta na MIGRA-SISTEMA-05 (as três linhas que o mockup apagou). **Foto com a
  lista cheia**, e o número na mesa. Nada aqui esconde linha para caber;
- **a linha do rádio conta o que o mapa permite contar.** `docs/data/mapa-controles.csv`
  manda, e `scripts/check_paridade_transporte.py` reprova afirmação forte sem
  teste que a sustente.

## O que é dela decidir

- **Quantas linhas o exame pode ter.** Com os cinco novos e as três que o mockup
  apagou, o exame vai a **onze**. O miolo tem `542` para `540` (`aba09.py:38`) e
  cada achado custa 25,5px. **Ou a aba cresce, ou o exame filtra.** As opções
  que não escondem nada: (a) só o que está `WARN` aparece, e uma linha diz
  *"mais 7 conferidos, todos bem"*; (b) duas colunas viram três; (c) o exame
  ganha rolagem própria dentro da faixa — e aí a tela **diz** que há mais.
- **AINDA ABERTA, e o mockup a repete: entra uma linha de saúde para o canal
  DSX?** A porta `127.0.0.1:6969` (`daemon/udp_server.py:62`) aceita gatilho e
  cor **de qualquer programa local**, e nenhuma tela conta isso — é a explicação
  que falta quando o gatilho muda sozinho. Opções: (a) mais um achado; (b) só
  nos Detalhes técnicos; (c) invisível.
