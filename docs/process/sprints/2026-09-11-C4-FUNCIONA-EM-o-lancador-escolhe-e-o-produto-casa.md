---
sprint: C4-FUNCIONA-EM
estado: feita
onda: A-SEGUNDA-LISTA-DELA
posse:
  EDITA:
    - src/hefesto_dualsense4unix/interface/aba10.py
    - src/hefesto_dualsense4unix/interface/pacotes/a10_perfis.py
    - src/hefesto_dualsense4unix/profiles/simple_match.py
cria:
  - tests/unit/test_o_funciona_em_oferece_lancador.py
bancada: false
depois_de: [LINGUA-A5, PERFIL-DOS-LANCADORES-E1]
nao_toca:
  - src/hefesto_dualsense4unix/backend/
---

# C4 · «Funciona em:» — o lançador escolhe, e o produto casa sozinho

**O DESENHO É DELA, CONFIRMADO EM 11/09/2026.** A proposta foi apresentada
assim, e ela respondeu *"isso mesmo."*:

> Você escolhe o lançador (Steam, Heroic, Lutris, RetroArch…), o campo de baixo
> passa a oferecer os jogos daquele lançador **pelo nome**, e o produto decide
> sozinho a forma técnica de reconhecer — que é o jargão que ela mandou tirar.

A ordem original, na foto 10:

> *"seria legal nome do programa launcher aqui: A gente adicionaria Navegação,  <!-- noqa-acento: citação literal dela -->
> remopve jogo da steam, jogo, jogo pela janela, estilo de jogo, e colocariamos
> os launchers. Isso deveria ajudar a identificar mais rápido o nome do jogo
> depois"*

---

## §1 — O QUE SAI DA TELA

O campo **«Funciona em:»** hoje oferece as seis formas de
`profiles/simple_match.py` com o nome técnico delas:

| hoje na tela | o que é por dentro |
| --- | --- |
| Jogo da Steam | `steam_game` — `steam_app_<id>` |
| Jogo | `game` — `process_name` |
| Jogo pela janela | `janela` — `wm_class` |
| Estilo de Jogo | o gênero |
| Qualquer jogo | `any` |
| Steam | `steam` |

**As quatro primeiras são jargão de implementação na cara de quem joga** — e a
escolha entre «Jogo» e «Jogo pela janela» pede da pessoa exatamente o
conhecimento que o produto tem e ela não: por qual chave aquele jogo é
reconhecível.

## §2 — O QUE ENTRA

O campo passa a oferecer **de onde o jogo vem**:

```
Funciona em:  [ Navegação ▾ ]      ← o perfil do desktop, sem jogo
              [ Steam ▾ ]
              [ Heroic ▾ ]
              [ Lutris ▾ ]
              [ RetroArch ▾ ]
              [ Dolphin ▾ ]  [ mGBA ▾ ]     ← os que o censo achar
              [ Qualquer jogo ▾ ]
```

A lista **não é digitada**: sai do censo (`integrations/censo_dos_lancadores.py`),
e um lançador que a máquina não tem **não aparece**. Numa instalação sem Steam,
sem Heroic e sem Lutris sobram «Navegação» e «Qualquer jogo» — e a tela continua
certa. É a ordem dela de hoje: *"a ideia é que todas as features mesmo do app  <!-- noqa-acento: citação literal dela -->
funcionem nao so pra mim mas pra qualquer outro user"*.  <!-- noqa-acento: citação literal dela -->

**«Estilo de Jogo» não morre — muda de lugar.** Ele não é uma procedência, é um
corte transversal; fica onde já vive na aba, fora deste campo.

## §3 — O CAMPO DE BAIXO, e o item 12 da lista dela

Escolhido o lançador, o campo **«Nome do Jogo»** passa a ser uma lista dos jogos
**daquele** lançador, pelo nome que a pessoa conhece. E a linha da lista mostra
**nome + código**, nunca o nome do executável — item 12 da segunda lista dela,
foto 9:

```
hoje:   1245620
falta:  ELDEN RING · 1245620
nunca:  eldenring.exe
```

## §4 — QUEM DECIDE A FORMA TÉCNICA

O produto, e sozinho. Escolhido «Steam» + «ELDEN RING · 1245620», quem grava é
`simple_match`, que já sabe as seis formas: `steam_app_1245620`. Escolhido
«Heroic» + um jogo da Epic, a forma é a que aquele lançador entrega — e a
pessoa nunca vê a palavra `wm_class`.

**A REGRA QUE ISSO IMPÕE:** a escolha da forma é do produto, mas o perfil
gravado continua guardando a forma REAL — nada de «lançador» virar um tipo novo
de casamento no disco. A tela ganha uma tradução; o `MatchCriteria` não muda.

## §5 — O QUE FICA PARA A PESSOA QUE SABE

Um perfil que já existe com forma escolhida à mão continua válido e continua
sendo mostrado. E a ressalva dela, de quando o desenho foi proposto:

> *"e se por algum motivo não encontrar eu posso criar ou criar um perfil  <!-- noqa-acento: citação literal dela -->
> duplicado do mesmo jogo."*

Então: **o campo do jogo aceita digitação livre**, e o «Duplicar» continua onde
está. A lista oferece; ela não obriga.

## §6 — A PROVA

1. Foto antes e depois da aba 10, na vista dela (1918x840).
2. **O clique**: escolher um lançador, ver a lista de baixo trocar, salvar, e
   ler no disco o `MatchCriteria` que saiu.
3. **A mordida**: arranque a tradução e veja a régua reprovar.
4. Numa máquina de mentira **sem nenhum lançador**, o campo tem de sair com
   «Navegação» e «Qualquer jogo» e nada mais — sem linha vazia e sem erro.
