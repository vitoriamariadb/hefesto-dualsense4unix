---
sprint: MIGRA-PERFIS-06
onda: PERFIS
posse:
  MP6:
    - src/hefesto_dualsense4unix/app/actions/perfis_web.py
    - src/hefesto_dualsense4unix/app/actions/profiles_actions.py
    - scripts/gui-captura/retratar_abas.py
cria:
  - tests/unit/test_migra_perfis_06_o_ajuste_proprio_nasce_da_mesa.py
bancada: true
depois_de:
  - MIGRA-PERFIS-01
  - MIGRA-PERFIS-02
  - MIGRA-PERFIS-03
  - MIGRA-PERFIS-04
  - MIGRA-PERFIS-05
  # A ONDA PERFIS de 27/08: oito das nove reivindicam `profiles_actions.py`, e
  # quem divide arquivo corre EM SÉRIE (R5). O índice desta onda diz o que
  # sobra de cada uma depois da decisão do WebKit.
  - ONDA-PERFIS-01
  - ONDA-PERFIS-02
  - ONDA-PERFIS-03
  - ONDA-PERFIS-04
  - ONDA-PERFIS-05
  - ONDA-PERFIS-06
  - ONDA-PERFIS-08
  - ONDA-PERFIS-09
  # O retrato (`retratar_abas.py`) e a Vibração disputam arquivo com esta.
  - MIGRA-NAVEGACAO-01
  - ONDA-VIBRACAO-02
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/profiles/schema.py
  - src/hefesto_dualsense4unix/integrations/cor_do_plastico.py
  - novo-layout/
---

# MIGRA PERFIS · 06 — o "Ajuste próprio" nasce da mesa dela

**O defeito:** `Profile.controllers` grava desde **16/07** e **nenhuma tela
nunca mostrou quais controles têm ajuste próprio**. A aba Perfis sabe quantos
controles estão na mesa — `profiles_actions.py:2812` (`_controles_na_mesa`) — e
**nunca os pinta**: ela usa a contagem só para escolher o texto de um aviso.

Esta é a resposta à pergunta 4 do contrato (*"Os ajustes por controle que o
perfil guarda aparecem aqui como estado, ou continuam sendo gravados
calados?"*). O desenho responde: **aparecem**.

| O quê | Onde | Estado |
|---|---|---|
| o que o perfil guarda por controle | `profiles/schema.py:900-903` — `ControllerOverrides`: `leds` · `triggers` · `rumble` · `speaker`, **nem um a mais** | **existe** |
| a chave | `profiles/schema.py:1008` (`Profile.controllers`), pelo `uniq`, canonizada em `:1114` | **existe** |
| quem decide "aceso" contra "herda" | `app/draft_config.py:1082`, `:1112`, `:1173`, `:1225` (`effective_*_for`), pelo `model_fields_set` — merge **por campo** | **existe** |
| quem está na mesa | IPC `daemon.state_full`, bloco `controllers` — `daemon/ipc_handlers.py:2488` (`describe_controllers`) e `:3176` (o número do jogador) | **existe** |
| a forma de cada entrada | `core/backend_pydualsense.py:5080` → `{index, connected, transport, is_primary, uniq, battery_pct}` | **existe** |
| a cor do plástico | `integrations/cor_do_plastico.py:204/218/233/240` e `:524`; a declaração dela em `utils/maquina.py:655` | **existe, e NÃO está no `state_full`** |

**Campo `None` = sem opinião**, e apagado é a resposta certa para a maioria dos
controles na maioria dos perfis. Uma tabela que acenda as quatro seções nos
quatro controles ensina o contrário do que o produto faz.

## A MESA É A DELA, E ELA TEM DOIS CONTROLES

Palavra dela, 29/08:

> *"o layout se adapta a medida dos controles que eu tenho (…) e se eu comprar
> outros dualsense eles aparecem também seguindo a lógica que montamos no
> `mapa-do-controle.html`."*

O mockup desenha **quatro** porque quatro é o caso difícil. **A página nasce da
mesa real: um cartão por controle presente, e zero controles é estado
legítimo** — não é erro, não é caixa vazia, é a frase que diz o que está
faltando. A conta do topo (*"M de N controles com ajuste próprio neste
perfil"*) sai da mesma leitura, nunca de um número fixo.

## Os dois riscos que podem fazer a tabela nascer errada

### 1. A cor do plástico não chega pelo rádio, e metade da mesa dela é rádio

`docs/data/mapa-controles.csv`, linha `identidade.cor_do_aparelho@dualsense`:
`cabo_aciona = sim` (o produto passou a ler pelo cabo em 29/08/2026, pela porta do broker) e **`radio_aciona = não`** com motivo `divida` — era `o-aparelho-recusa` até 29/08, e a recusa era do nosso CRC, não do aparelho. O
filtro está no código: `_e_dualsense_no_cabo` (`integrations/cor_do_plastico.py:369`)
exige barramento USB.

A barra de 3px do plástico é **a única coisa que identifica a peça** na tabela —
o desenho de 32px foi removido justamente por não distinguir (33 pixels de 736
entre o par mais próximo). Sem a `ONDA-CONEXOES-11` (a semente `0x53`) ou sem a
declaração dela (`utils/maquina.py:655`), **as linhas dos controles no rádio
nascem cinzas**.

**A tabela mostra a cor que o produto TEM, nunca a que ele gostaria de ter.**
Cinza com o motivo na dica é honesto; pintar por adivinhação é o defeito que
`scripts/check_paridade_transporte.py` existe para reprovar — ele recusa
afirmação forte sem teste que a sustente.

**E a leitura de hoje não sobrevive à janela:** o único consumidor da cor é a aba
Conexões (`app/actions/config/secao_controles.py:916` e `:936`), que guarda o
resultado num dicionário de instância. Fechou a janela, a cor do cabo se perde.
Esta sprint **lê onde já se lê** e não abre um segundo caminho —
`cor_do_plastico.py` está no `nao_toca` de propósito: ele é disputado pelas
sprints 08, 11 e 12 da onda Conexões, e quem divide arquivo corre em série.

### 2. A coluna "ID da peça" põe endereços de rádio REAIS numa imagem versionada

O `uniq` é o MAC normalizado. A coluna o mostra, e o retrato
(`scripts/gui-captura/retratar_abas.py`) grava **PNG versionado** em
`docs/usage/assets/`.

**Os DOIS portões de anonimato desta casa PULAM `.png`:**
`scripts/check_endereco_de_radio.py` (`EXCLUIR_SUFIXO`) e
`tests/unit/test_docs_mac_anonimato.py` (`_SKIP_SUFFIXES`). A régua fica
**verde por cima do vazamento** — é a mesma forma do buraco do SVG cego nas três
réguas (26/08) e do `.gz` que portão nenhum enxergava.

O retrato já desvia os perfis **dela** por este motivo exato —
`_PERFIS_DA_FOTO` (`retratar_abas.py:868`), com a razão escrita: *"os portões de
anonimato não varrem imagens"*. **Ele não desvia a mesa, porque hoje esta aba
não mostra mesa nenhuma.** No motor novo o desvio tem de nascer **junto** com a
ponte, com a máscara da casa (octetos 4 e 5 zerados: `AA:BB:CC:00:00:FF`) — que
é exatamente o endereço didático que o próprio gerador do mockup já usa
(`src/hefesto_dualsense4unix/interface/aba10.py:61`).

## O que entrega

1. **A tabela nasce da mesa**: uma linha por controle conectado, com o rótulo
   curto (marca · player · plástico · transporte), a faixa `--plastico`, os
   quatro grupos de glifo acesos ou apagados, e o `uniq`.
2. **"Aceso" sai do merge que já existe**, não de uma segunda regra: o campo
   está em `model_fields_set` do `ControllerOverrides` daquele `uniq`. Escrever
   aqui uma segunda forma de decidir é criar a segunda verdade que
   `draft_config.py` já resolveu.
3. **A conta do topo** e o `title` de cada linha (*"N de 4 ajustes só deste
   controle"* / *"nada só dele — herda os quatro"*) saem da mesma leitura.
4. **O desvio da foto**: o retrato monta a tabela com uma mesa **inventada** e
   endereços mascarados, do mesmo jeito e pelo mesmo motivo que já faz com os
   perfis.

## Como se prova (a mordida)

`tests/unit/test_migra_perfis_06_o_ajuste_proprio_nasce_da_mesa.py`:

- **dois controles, duas linhas**: dublê de `state_full` com **dois** e a página
  tem duas linhas. Com **zero**, a página mostra a frase e **nenhuma** linha.
  Fixe quatro e o teste reprova — é a régua da palavra dela.
- **aceso é aceso, apagado é apagado**: um perfil com `leds` e `rumble` para o
  `uniq` A e nada para o B. A linha de A tem dois grupos acesos e dois
  apagados; a de B, quatro apagados e o texto *"herda"*. Arranque a consulta ao
  `model_fields_set` e todas acendem — o defeito que ensina o contrário do que o
  produto faz.
- **A MORDIDA DO ANONIMATO, e ela mede o que os portões não medem:** o teste
  monta a aba pelo caminho do retrato e confere que **nenhum** dos endereços
  produzidos passa no `scripts/check_endereco_de_radio.py` como MAC exposto —
  varrendo o **texto que vai para a tela**, não o PNG. Arranque a máscara e o
  teste reprova; os dois portões da casa continuam verdes, e é essa a diferença
  que ele existe para mostrar.
- **cinza é cinza, e diz por quê**: um controle no rádio, sem declaração dela e
  sem a cura da semente `0x53`, nasce **sem** cor e **com** a dica explicando.
  Pinte uma cor adivinhada e o teste reprova.
- **a foto sai e não vaza**: o PNG de `docs/usage/assets/` existe, tem a tabela,
  e o texto que a gerou é o inventado.

## O que é dela decidir

- **A tabela é só LEITURA?** É o que o mockup diz — e é por isso que a fita fica
  esmaecida: aqui não se escolhe alvo (`D-A-FITA-E-O-UNICO-ALVO`). Mas o motor
  para limpar o ajuste de um controle a partir dali **já existe**
  (`app/draft_config.py:1355`, `with_controller_fields_cleared`), e a legenda do
  mockup diz explicitamente que tela nova não foi inventada. Um gesto de limpar
  seria desenho novo, e desenho novo é dela.
- **O ID da peça fica visível na tela dela?** É ele que torna verificável a
  promessa da dica — *"amanhã, em outra porta ou no rádio, ele traz de volta o
  que você deixou hoje"* — e é ele que entra na imagem versionada. **A foto está
  resolvida acima; a tela dela é outra pergunta**, e a resposta pode ser
  diferente: o que ela vê na própria máquina não vaza para lugar nenhum.
- **Dois controles do mesmo plástico ficam com a linha idêntica.** A pergunta é
  antiga (é a mesma da onda Conexões) e aqui ela reaparece com o `uniq` ao lado,
  que resolve — se o `uniq` ficar.
