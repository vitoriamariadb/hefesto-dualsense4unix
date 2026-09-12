---
sprint: F1-REMAPEAR
estado: aberta
onda: A-FILA-DE-0911
posse:
  F12-NAVEGACAO:
    - docs/process/sprints/2026-09-11-F1-REMAPEAR-as-vinte-e-duas-linhas-e-o-motor-que-nao-existe.md
cria:
  - src/hefesto_dualsense4unix/core/remapeamento_de_botao.py
bancada: false
depois_de: []
nao_toca:
  - install.sh
---

# F1-REMAPEAR — as 22 linhas medidas, e o motor que não existe

Nasce do §1 de
[A FILA QUE A ONDA ABRIU](2026-09-11-A-FILA-QUE-A-ONDA-ABRIU-INDICE.md).

**ELA FICA `aberta`, e a razão é o achado.** O enunciado mandava dar gesto a
cada campo *que tem destino*, e mandava, com todas as letras, **não inventar
campo novo no perfil por conta própria**. Os 22 não têm destino — e o que falta
não é um campo: é o lugar no caminho quente, que é decisão dela desde 29/08.

---

## §0 — O NÚMERO, medido abrindo a página

| | |
| --- | --- |
| `<select>` em `#remapeamento` | **22** |
| …com `data-campo` ou `data-gesto` | **0** |
| gestos do rodapé com dono | **0 de 2** (`guardar-remapeamento`, `padrao-remapeamento`) |

Medido no motor do produto, na mesma corrida em que a tela irmã fechou:

```
[gesto sem dono] 06-navegacao.html · guardar-remapeamento · 'Guardar'
[gesto sem dono] 06-navegacao.html · padrao-remapeamento · 'Confirmar'
```

## §1 — O QUE CADA LINHA PEDE, e por que nenhuma cabe no que existe

As 22 linhas são as mesmas de `core/acoes_de_botao.BOTOES`, e a coluna é
**«Passa a ser»**: um `<select>` das cinco famílias de peças do controle
(botões, ombros e gatilhos, analógicos, direcional, sistema) mais
`— Sem troca —`.

**É botão → BOTÃO.** Os dois campos que o perfil tem falam outra língua:

| campo do perfil | o que ele guarda | por que não serve |
| --- | --- | --- |
| `Profile.button_actions` | botão → **ação** (tecla, botão de mouse, comando) | o vocabulário é `acoes_de_botao.ACOES`; «✕ passa a ser ○» não existe nele |
| `Profile.key_bindings` | botão → lista de `KEY_*` | idem, e mais estreito: só os oito do `DOMINIO_DO_TECLADO` |

Pendurar o remapeamento no `button_actions` — resolvendo «L1 passa a ser R1»
para *"o L1 faz o que o R1 faz"* — seria uma cura pior que a doença, por três
razões medidas:

1. **não é o que a tela promete.** O mockup diz, com estas palavras, que a troca
   *"vale antes de o jogo ver"*; `button_actions` alimenta o teclado e o mouse
   virtuais, que são o DESKTOP. O jogo não veria nada;
2. **duas telas escreveriam o mesmo campo com significados diferentes** — e a
   tela de Definições já é dona dele desde 01/09;
3. **os gatilhos e os eixos não têm como obedecer.** `resolver()` já mede que
   L2/R2 são espelho do `cross` e do `triangle`
   (`uinput_mouse._resolve_emulated_set`), e que os eixos não são evento de
   botão.

Medido, e é o mesmo `grep` que a `MIGRA-NAVEGACAO-13` publicou em 29/08 — três
semanas depois ele dá o mesmo número:

```
grep -n remap src/hefesto_dualsense4unix/profiles/schema.py     ->  0
src/hefesto_dualsense4unix/core/remapeamento_de_botao.py        ->  não existe
```

## §2 — O ACHADO DESTA FRENTE: o único lugar que traduziria nome de botão só alcança metade da mesa

**É o que esta sprint acrescenta ao que já se sabia.** A `MIGRA-NAVEGACAO-13`
escreveu que a tradução tem de entrar *"no `forward_buttons` do vpad
(`daemon/subsystems/coop.py`) ou no leitor de evdev"*, e deixou a escolha para
ela. Medida a árvore inteira em 11/09/2026, a primeira das duas **não é uma
escolha completa**:

```
grep -rn "forward_buttons" src/ --include=*.py   (fora das definições)
  src/hefesto_dualsense4unix/daemon/subsystems/coop.py:2065
```

**Um call site, e ele é o dos SECUNDÁRIOS.** `CoopSubsystem.forward_all` roda
por tique sobre `self._players` — os jogadores 2, 3 e 4, cujo evdev o co-op
segura e espelha num vpad. O controle PRIMÁRIO não passa por ali: o vpad dele
(`Daemon._gamepad_device`) é alimentado pelo `PhysicalReportReader`, que
encaminha **`forward_motion`, `forward_touchpad_click`, `forward_jack` e
`forward_battery`** — movimento, clique do touchpad, fone e bateria. Botão, não.

**A consequência, dita antes de alguém pagar por ela:** um remapeamento ligado
só ali funcionaria nos controles 2 a 4 e ficaria **mudo no controle 1** — o que
ela usa sozinha. É a forma exata do defeito que esta casa mais persegue (a
ausência de dado, que se lê como *"a mudança não pegou"*), e desta vez ela
apareceria só com quatro controles na mesa.

## §3 — A DECISÃO DELA JÁ EXISTE, e diz o que entra

`docs/data/decisoes-dela.csv:112` —
`D-O-REMAPEAMENTO-BOTAO-A-BOTAO-ENTRA`, 29/08/2026, **decidida**:

> *"ENTRA, E VIRA SPRINT PRÓPRIA. É feature real: trocar botão por botão é o que
> salva jogo que não deixa remapear."*

O contrato inteiro está escrito na
[MIGRA-NAVEGACAO-13](2026-08-29-MIGRA-NAVEGACAO-13-o-remapeamento-botao-a-botao-nasce.md)
(hoje `estado: absorvida`, e por isso não se despacha pelo id): o
`core/remapeamento_de_botao.py` puro, a recusa nomeando os dois botões quando
dois apontam para o mesmo destino ou quando há ciclo, e o PS travado nos dois
lados — se o PS puder ser remapeado, a pessoa perde as duas saídas de emergência
com um clique.

## §4 — O QUE SERIA PRECISO, em ordem

1. **A palavra dela sobre ONDE a troca entra.** As duas respostas mudam o
   produto e a §2 estreitou a pergunta: o `forward_buttons` do co-op vale para o
   jogo e para os secundários e **não alcança o primário**; o leitor de evdev
   alcança os quatro e passa a valer também para o desktop e para os cinco
   gestos — que é mais do que a tela promete.
2. **Um campo no perfil**, com serialização que OMITE quando vazio (é o
   requisito de compatibilidade que `controllers` e `speaker` já carregam: sem a
   omissão, um binário antigo com `extra="forbid"` recusaria TODO perfil no
   downgrade).
3. **`core/remapeamento_de_botao.py`** — puro, sem GTK e sem daemon: recebe o
   mapa declarado e devolve a permutação resolvida ou a recusa com motivo.
4. **A tradução num lugar só**, com custo por tique medido: `forward_all` roda
   por jogador, por tique.
5. **A tela**: `data-campo`/`data-linha`/`data-gesto` nas 22 linhas e a `forma`
   no "Guardar" — a parte barata, e é a mesma que a F2 fez em meia página.

**A ordem importa e o 1 é dela.** Ligar a tela antes do motor poria 22 escolhas
no disco que nada obedece — e a tela não pode dizer isso (*a tela nunca confessa
dívida nossa*, decisão dela de 07/09). Um "Guardar" que grava e cala é o botão
que responde calado; hoje o piloto pelo menos recusa PELO NOME.

## §5 — O QUE ESTA FRENTE MEXEU

Uma linha, no inventário do que falta: a entrada `guardar-remapeamento` do
`a06_navegacao.SEM_GESTO` passou a carregar a medição da §2, para a próxima
pessoa não remedir o mesmo `grep`. Nenhuma linha da tela mudou.
