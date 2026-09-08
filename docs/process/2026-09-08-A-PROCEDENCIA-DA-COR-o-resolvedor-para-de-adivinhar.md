---
estado: feita
---

# A PROCEDÊNCIA DA COR — 08/09/2026: o resolvedor para de adivinhar

> Segunda volta da cor única. A primeira foi **derrubada por um conferente** que
> mediu no backend REAL, e ele estava certo: o passe matava o broadcast dela.
> Este documento é o desenho que fechou, o que ele custou e o que ele deixa.

## §0 — O estado em uma linha

`voo/FECHA-ILUMINACAO-02-opus`, sobre `536f8deb`. **49 portões verdes.** Os
cinco defeitos do conferente fechados, com a medição no produto real abaixo.

## §1 — A CAUSA RAIZ, e ela era de ESQUEMA, não de algoritmo

O override de cor é **por MAC e congelado**; o número do jogador é **de sessão**
e gira com a ordem de conexão. `ControllerOverrides.leds` guardava *"azul"* e
perdia *"azul porque ele era o 1"*.

Sem esse dado, um resolvedor que queira desfazer colisão só pode **adivinhar** —
e no disco um broadcast (`led.set` sem `uniq`, a MESMA cor em todos de
propósito) é indistinguível de duas escolhas que colidiram. A primeira volta
adivinhou pela FORMA da cor, e o palpite escreveu `[verde, vermelho, azul,
rosa]` onde ela pediu quatro verdes.

**A decisão de produto (delegada, §4 do handoff do dia):** o override ganha
PROCEDÊNCIA — *para qual número ele foi escolhido*. Quando o número muda, a cor
é fóssil e sai sozinha.

## §2 — O DESENHO, em quatro peças

| peça | onde | o que faz |
| --- | --- | --- |
| o campo | `profiles/schema.py::LedsConfig.lightbar_para_o_numero` | grava o número no disco. `None` = perfil anterior ao campo |
| a ponte | `profiles/manager.py::_controllers_to_procedencias` | leva o carimbo do disco ao backend, com `_publicar_camada` |
| o carimbo vivo | `core/backend_pydualsense.py::_carimbar_procedencia_locked` | carimba toda escrita de cor por-uniq; `DO_BROADCAST` vem **declarado** pelo `_registrar_em_todos` do IPC |
| a leitura | `core/led_control.py::_e_fossil` | LÊ o carimbo. Só o `LEGADO` ainda prova pela forma |

**O vocabulário** (`core/led_control.py`): `DA_PALETA` (camada automática),
`DO_BROADCAST` (o "Todos" dela — **nunca deslocado**), `DO_GLOBAL` (o global do
perfil — cede a quem tem identidade, nunca à irmã que também está no global),
`DA_MAO` (escolha por controle sem número conhecido), `LEGADO` (disco anterior
ao campo), ou o **número inteiro**.

**Por que `LEGADO` não é "fóssil por padrão":** o disco dela HOJE não tem o
campo. Tratar ausência como fóssil apagaria em silêncio toda cor escolhida de
verdade. A prova por forma fica restrita a esse caso, e ela é conservadora: só
desloca a cor que é **exatamente a do número de OUTRO da mesa**. Um roxo que não
é número de ninguém sobrevive à migração.

## §3 — A MEDIÇÃO NO PRODUTO REAL

Backend `PyDualSenseController` real, `IpcServer._handle_led_set` real,
`reassert_resolved_outputs` real, nós sysfs falsos só para se poder LER o fio.
Mesa de QUATRO com os overrides dela (ranks 2 e 4 guardando as cores dos slots
1 e 2).

```
(a) BROADCAST  led.set {rgb:[0,255,0]} sem uniq
    fio: #00FF00 #00FF00 #00FF00 #00FF00        4 de 4
    e depois de mais um reassert:                4 de 4
    IPC diz aplicado_em=4  ·  o fio mostra 4     (o IPC parou de mentir)

(b) SEM broadcast, o disco dela
    P1 #0000FF   P2 #FF0000   P3 #00FF00   P4 #FF0080     4 cores distintas
    (com o passe arrancado: 3 de 4, dois #0000FF)

(c) quem pede a cor do PRÓPRIO número FICA com ela
    P1 pediu #0000FF -> #0000FF     P3 pediu #00FF00 -> #00FF00
    (na primeira volta saía INVERTIDO: P1 verde, P3 azul)
```

E o gesto por controle continua mirando um só: `led.set` com `uniq` pinta o
alvo e deixa os outros três na cor do número deles.

## §4 — OS CINCO DO CONFERENTE, um a um

1. **O broadcast dela** — fechado pelo carimbo `DO_BROADCAST`, declarado no
   `_registrar_em_todos` (`daemon/ipc_handlers.py`). A régua velha punha DOIS
   controles e escolhia o verde, o único arranjo em que o defeito não aparece;
   a nova exercita QUATRO com os overrides dela.
2. **O crash `_handles`** — a mesa da regra passou a sair da IDENTIDADE
   (`uniqs_da_mesa`, a segunda companheira do provider), com `_handles` como
   última fonte e lida por `getattr`. A regra de cor única é a única parte do
   merge que olha para fora da chave que resolve, e não pode fazer um merge que
   respondia parar de responder.
3. **A prosa que vazou** — o `<!-- noqa-acento -->` saiu de dentro do comentário
   HTML e virou comentário **Python**. A aba foi regerada e publicada, e o corpo
   visível conferido nas duas leituras: zero ocorrências do botão morto, zero
   hash de commit. Nasceram DUAS réguas: `_BOTAO_MORTO` casa as duas grafias, e
   `_comentarios_aninhados` mede a FORMA em todas as dez páginas.
4. **O mapa com endereço podre** — o `citacoes-de-linha` aprendeu a terceira
   forma (`` :N (`SIMBOLO`, …) ``) e passou de 87 podres a **zero**, com 3.302
   citações conferidas. As de `src/` que esta leva moveu foram reapontadas por
   **mapeamento de diff**, nunca por delta a olho.
5. **A regra não era "sempre"** — a cor GLOBAL entra na mesa (cede a quem tem
   identidade, não à irmã), e a guarda da interface mudou de lugar: mora dentro
   do `_escrever_a_cor`, a porta única, com `escolha=True` nos dois gestos que
   escolhem tom (`cor` e `reenviar`). `apagar` e `brilho` passam por fora, com a
   razão escrita.

## §4b — O SEXTO, QUE O CONFERENTE NÃO VIU

A comparação da suíte contra a árvore da base achou **mais dois** vermelhos que
só existiam nesta branch, e nenhum dos dois estava na lista das cinco:

* **a transcrição de `estado_hoje` se partiu.** A prosa de 597 caracteres da
  `vibracao.rumble.ff` mora em DOIS lugares — a célula do mapa e a cópia em
  `bancada.py::_ESTADO_RUMBLE_FF` —, e a régua exige que sejam a mesma string
  **byte a byte**, porque o seletor da bancada regrava a coluna com o que a
  grade devolve. A primeira volta reapontou os endereços dentro da célula e
  deixou a cópia para trás; o valor virou órfão, e a próxima gravação da
  bancada apagaria a medição. As duas voltaram a casar, com os endereços de
  hoje;
* **um `if nome else {}` antes de `perfil.ativo`.** A cura do nome vazio mora
  no DONO, e um curto-circuito não é alcançado por ela — com o daemon calado a
  aba voltaria a ver `{}` e a comparação de cor diria "livre" sobre o tom que
  o vizinho está acendendo. A guarda saiu.

**A regra que isso deixa:** *"nenhuma regressão minha" não é uma leitura, é uma
COMPARAÇÃO.* Os mesmos doze lotes, na árvore da base e na minha. Sem isso, os
dois acima passariam como paisagem — foi o que aconteceu na primeira volta.

Números finais: **104 vermelhos aqui contra 105 na base**, e o que sobra na
base é justamente o que esta branch cura. Conjunto "só na minha": **vazio**.

## §5 — O QUE ESTA LEVA ENSINA

**Uma trava que se mede contra a própria suposição não trava nada.** A primeira
volta escreveu a regra com o dado que faltava e cobriu o buraco com uma
heurística; a heurística é que quebrou o produto. O conserto não foi um
algoritmo melhor — foi **um campo no esquema**.

**Comentário HTML NÃO ANINHA.** É a quinta forma da armadilha da prosa nesta
casa, e a primeira estrutural: o `-->` de dentro fecha o de fora e o resto vira
corpo visível. `# noqa-…` só comenta em Python; prosa de projeto que precise de
um `noqa` sai do HTML.

**Portão verde não é prova quando a régua só dispara em duas formas.** O
`citacoes-de-linha` estava verde sobre 87 endereços podres porque a pergunta 2
dele não alcançava a forma que o mapa mais usa.

## §6 — O QUE FICA ABERTO

* **NADA foi medido em APARELHO.** As medições são no backend real com nós
  sysfs falsos. Quem tiver os quatro DualSense na mesa confere com
  `scripts/check_a_conferencia_dela.py`, que lê o `lightbar_rgb` do daemon vivo.
* **A suíte tem 104 vermelhos em doze lotes, e NENHUM é desta leva.** Medido
  por comparação, não por leitura: os mesmos doze lotes na árvore da base dão
  105, e o conjunto "só na minha" é VAZIO. Os 104 são herdados e continuam
  abertos — a maioria é foto de GTK e página publicada.
* **O piloto não foi dirigido.** `hefesto_vivo.py` dispara as migrações one-shot
  no `~/.config` real e os gestos escreveriam nos quatro DualSense dela, que
  estão na mesa agora. O clique foi medido pelo DESPACHANTE
  (`pacotes.gesto_da_pagina`), que é o mesmo caminho que o piloto usa.
