# ONDA NAVEGAÇÃO — o índice

> **06/09/2026 — ESTA ONDA FOI ABSORVIDA.** As sprints deste índice estão `estado: absorvida`: a tela é o HTML desde 02/09, a fila é o `docs/data/paridade-gtk-html.csv` (aba 06) e a ordem de agora é [AS VINTE E QUATRO HORAS](../2026-09-06-AS-VINTE-E-QUATRO-HORAS-a-ordem-que-o-orquestrador-despacha-e-as-rotas-corrigidas.md). O que este índice mediu continua valendo como diagnóstico; nada aqui se despacha pelo id.

*Escrito em 27/08/2026. Nove sprints levam a aba **Navegação** do produto
instalado até o mockup aprovado — do frontal ao backend.*

**As fontes**, e toda afirmação daqui sai de uma delas:
`docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md` §6 (o contrato da aba) ·
`layout/06-navegacao.html` e `src/hefesto_dualsense4unix/interface/aba06.py` (a
especificação visual, aprovada por ela) ·
`src/hefesto_dualsense4unix/interface/CORRECOES-DELA.md` (as correções literais) ·
`/tmp/coleta/decisoes.md` (as decisões dela).

---

## A ordem

O backend primeiro, porque a tela do mockup **depende** dele: o dropdown de
ativação não tem o que gravar sem a 01, e as tabelas de dropdown não têm o que
listar sem a 03 e a 04.

```
01 A ativação mora no perfil        (backend)
   ├── 02 O quinto degrau da roda   (backend)  ──► 03 Os gestos reconfiguráveis (backend)
   ├── 04 O mapa do mouse sai do código (backend) ──► 05 O estilo Point-and-click (backend)
   └── 06 A aba renasce em duas colunas (frontal, GLADE)
          └── 07 As três tabelas viram dropdown (frontal, GLADE)
                 └── 08 A área que ensina acende (frontal, GLADE)
                        └── 09 A tela promete o que cumpre (frontal, GLADE)
```

**As quatro frontais correm em série, e não é escolha de coordenação:**
`gui/main.glade` é XML único, sem seções nomeadas, e conflito de merge nele é
irrecuperável na prática — é **recurso de bancada**, uma sprint por vez
(`docs/process/COMO-EXECUTAR-UMA-SPRINT.md` §2).

As quatro do backend (01, 02+03, 04+05) correm **em paralelo depois da 01**, em
três trilhas que não se cruzam: a trilha da roda (`integrations/`), a trilha do
mapa (`core/` + `profiles/`), e a tela.

| # | sprint | camada | tamanho | bancada | depois de |
|---|---|---|---|---|---|
| 01 | A ativação mora no perfil | backend | ~250 linhas | não | — |
| 02 | O quinto degrau da roda | backend | ~120 linhas | não | 01 |
| 03 | Os gestos são reconfiguráveis | backend | ~300 linhas | não | 02 |
| 04 | O mapa do mouse sai do código | backend | ~350 linhas | não | 01 |
| 05 | O estilo Point-and-click ganha definição | backend | ~250 linhas | não | 04 |
| 06 | A aba renasce em duas colunas | frontal | ~500 linhas | **sim** | 01 |
| 07 | As três tabelas viram dropdown | frontal | ~400 linhas | **sim** | 06 |
| 08 | A área que ensina acende | frontal | ~350 linhas | **sim** | 07 |
| 09 | A tela promete o que cumpre | frontal | ~200 linhas | **sim** | 08 |

---

## O que esta onda fecha da dívida "a casa sabe e o produto não faz"

O defeito mais caro desta casa é a cura escrita e nunca ligada. A aba Navegação
guarda **quatro** delas, e todas fecham aqui:

| o que existe | onde | quem fecha |
|---|---|---|
| `resolver_teclado_emulado` — no `__all__`, sem chamador | `profiles/schema.py:1300`; dívida registrada em `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py:1199` | 01 |
| `KIND_DESKTOP` — de primeira classe em toda validação, fora da escada | `integrations/ponte_escada.py:169` vs. `:253` | 02 |
| **PS + R3** — funciona desde 19/08, só um comentário o conhecia | `integrations/hotkey_daemon.py:142` | 03 (backend) · 08 (tela) |
| **Toque curto no PS** abre a Steam — nenhuma tela | `daemon/subsystems/hotkey.py:38`, teto em `hotkey_daemon.py:154` | 08 |
| `assets/control-svg/dualsense.svg` — pronto desde 11/08, nenhum widget o carrega (`grep -rn "control-svg" src/` = zero) | `assets/control-svg/dualsense.svg` | 08 |

---

## O "Nada se perdeu", item por item

Toda linha do contrato é requisito. Onde cada uma cai:

| item do contrato | destino | sprint |
|---|---|---|
| Emular mouse (interruptor) | **sai**; vira o dropdown de ativação | 01 + 06 |
| Velocidade do cursor | fica, na moldura própria | 06 |
| Velocidade da rolagem | fica, na moldura própria | 06 |
| Emular teclado (interruptor) | **sai**; entra no mesmo dropdown, e passa a gravar no perfil | 01 + 06 |
| Lista de atalhos com edição | fica, e a edição vira dropdown | 07 |
| Adicionar / Remover | ficam | 07 |
| Voltar ao padrão | fica, **perguntando antes** | 07 |
| Linha de estado do mouse virtual | fica como está (já é boa) | 09 |
| "Sem tecla (não digitam nada) — 10 são do mouse" | vira dica do rodapé da tabela | 09 |
| "Guardados, sem linha na lista" (touchpad) | fica, na dica | 09 |
| "Neste computador: …" (teclado na tela) | estado fica, receita vira dica | 09 |
| Cartão Mapeamento (8 pares) | vira tabela viva, e **sabe da tabela ao lado** | 04 + 07 |
| Itálico do uinput/udev | vira dica | 06 |
| Fita "Ajustes vão para" esmaecida | fica esmaecida, motivo trocado para "não se aplica" | 06 |
| As três ações do teclado com toast no pretérito | o mal-entendido sai | 09 |
| As barras mudando de destino | a ambiguidade sai | 09 |
| O vão de 35–45% embaixo | sai: é onde a área que ensina mora | 06 + 08 |
| PS + Options / PS + ↑ / PS + ↓ / PS + R3 / toque no PS | vêm da Emulação, desenhados e configuráveis | 03 + 08 |
| Sair do modo jogo | vem da Emulação | 09 |
| Configurar o estilo Point-and-click | **novo** | 05 + 06 |

---

## O que ficou de fora, e por quê

- **A roda de pontes na tela.** Ela mandou tirar, em 27/08: *"aquela parte de
  roda dos pontos some também"* (`/tmp/coleta/hoje.md:262`). A escolha do modo
  de conexão é da aba **Jogar**; aqui fica só a linha do gesto PS + R3.
- **O botão de despausar.** O redesenho o manda para a Sistema ("Nasce
  Retomar"), e o texto da aba Jogar que ensina duas saídas falsas ("PS + Options
  ou a aba Emulação") continua errado até quem tocar a Jogar trocá-lo. Fica
  registrado, não é desta onda.
- **Os outros treze Estilos de Jogo.** Só o Point-and-click se configura aqui —
  palavra dela: *"esse estilo em específico"*.
- **"Suspender mouse e teclado" (o botão).** Pergunta aberta: é o próprio PS +
  Options, que já ganha linha na área que ensina. O mockup não o desenhou.

---

## As perguntas que são dela

Reunidas para uma leitura só. As seis primeiras são as do contrato da aba; as
quatro últimas apareceram ao medir o código.

1. **As três regiões do touchpad ganham linha na tabela?** Hoje o perfil as
   guarda e o daemon não as dispara (`daemon/subsystems/keyboard.py:393`). → 04
2. **"Suspender mouse e teclado" e "Sair do modo jogo" vêm mesmo para cá?** → 06, 09
3. **Onde fica o despausar** — aqui ou na Jogar? (o redesenho já diz: Sistema) → 06
4. **Quais combos ela pode reconfigurar, e para quais ações?** A proposta do
   mockup: PS + R3 e PS + Options travados, o resto livre. → 03
5. **Cada jogador navega com o próprio controle** nasce ligado ou é interruptor
   desta aba? O mockup não desenhou nenhum. → 06
6. **Que campos o Point-and-click expõe** — só o mapa e as velocidades, ou também
   gatilho, luz e vibração? → 05
7. **O gate HARM-05 morre?** Ligar o mouse durante "Jogar pelo Hefesto" derrubava
   o vpad e os jogadores do co-op em silêncio. Com a ativação por perfil,
   `sempre` significa exatamente isso. → 01
8. **O mapa de mouse é por perfil ou da máquina?** Os atalhos de teclado já são
   por perfil. → 04
9. **A lista de teclas é fechada?** Fechar mata o erro de digitação e mata
   `Ctrl + Alt + F2` junto. → 07
10. **Estilo de fábrica se edita?** A D-OS-ESTILOS-DE-JOGO diz que não, e ela diz
    *"Eu seto lá como esse estilo deve funcionar"*. → 05

---

## Antes de fechar a onda

```bash
git add -A                       # os portões são cegos a arquivo novo
bash scripts/portoes.sh          # os 26 portões, ~2 min
scripts/gui-captura/retratar_abas.py   # a foto de depois, para o olho dela
```

A suíte inteira é de quem coordena, roda no fim e **em oito lotes** (a receita
está no `CLAUDE.md`). **Interface só fecha com o olho dela** — PROVA-DE-TELA-01,
foto antes e depois, e a palavra final é dela.

---

## Uma nota de infra, para quem coordenar

O frontmatter destas nove sprints traz a onda como **comentário**
(`# onda: NAVEGACAO`) e não como campo. O analisador de
`scripts/check_colisao_de_sprints.py:80` conhece seis campos —
`sprint`, `posse`, `bancada`, `cria`, `depois_de`, `nao_toca` — e **recusa o que
não entende, dizendo a linha**, de propósito. Um `onda:` real reprovaria as nove
de uma vez. A cura é uma linha em `_CAMPOS_CONHECIDOS`; quem a fizer, converta os
comentários em campo.
</content>
