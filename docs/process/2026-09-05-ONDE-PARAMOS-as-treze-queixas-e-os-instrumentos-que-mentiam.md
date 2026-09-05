# Onde paramos — 05/09/2026

**A PORTA DE ENTRADA DE AGORA.** Ela abriu o produto com um DualSense na mesa e
listou **treze coisas**; treze fecharam ou estão em voo numa madrugada. No
caminho caíram **seis instrumentos que davam verde sobre nada** — e dois deles
eram meus, escritos horas antes.

O estado: **27 portões verdes** · a suíte em doze lotes · três ondas de agentes
(quatro frentes cada) · o perfil guardando o que ela configura.

---

## 1. AS TREZE DELA, uma a uma

| # | o que ela disse | onde fechou |
| --- | --- | --- |
| 1 | *"aba 10 tá com o mesmo problema de antes. nada mudou"* | a coluna "Ajuste próprio" escondia a SEXTA seção (`sensores`, que entrou no esquema em 04/09) — `ba70c4b3` |
| 2 | *"e o botão de correção do vulkan? veja no gtk"* | `8ac42e98` |
| 3 | *"o procurar sobreposição de novo deveria ser Corrigir Sobreposição do Vulkan, não?"* | vira **"Tirar a sobreposição Vulkan"** — o verbo dela não entrou, e a razão é medida |
| 4 | *"velocidade do cursor e da rolagem coloca um slicer pra cada"* | `ba70c4b3` |
| 5 | *"se só tem um controle conectado só aparece config daquele. aba cinco tá errada"* | a cura S-04 na folha compartilhada, e o lugar vazio se nomeia — `df6c2bc1` |
| 6 | *"a aba dez tem um espaço vertical bizarro desnecessário no título"* | 37 px de banda morta reservada; passa a colapsar vazia — `ba70c4b3` |
| 7 | *"ondas sonoras do auto falante e do microfone devem ser reais"* | `integrations/ondas_de_som.py`, novo — `ba70c4b3` |
| 8 | *"só faz sentido aparecer o todos se tiver mais de um controle conectado"* | `ee71f868` |
| 9 | *"pq temos uma linha de estado se o estado sempre vai ser o jogo mandando? remove"* | `dcaaa051` — e a medição deu razão a ela: os outros dois estados **não nasciam** nesta aba |
| 10 | *"muda o termo pra objeto e sinônimos nesses casos"* | `61eb1fb6`, 24 arquivos |
| 11 | *"Meu_perfil como perfil default não deveria existir … acho Personalizado melhor"* | `cb41c851`, com a migração que preserva o disco dela |
| 12 | *"manda em loop agentes pra esses outros casos também"* | três ondas, doze frentes |
| 13 | *"o perfil vai se lembrando de cada config de cada aba pra cada controle"* | fases 0 e 1 fechadas; fase 2 em voo |

**E DUAS QUE ELA ACRESCENTOU OLHANDO A TELA:** o realce da linha escolhida na
aba Perfis (que tinha a MESMA cor do `:hover` — a marca existia e não marcava
nada) e os SVGs dos controles desconectados (`052260c0`).

---

## 2. O ITEM 13 ERA PIOR DO QUE A DESCRIÇÃO

O ciclo dela foi medido de ponta a ponta, em `HOME` de mentira: perfil no
disco, configura nas abas 02, 04, 05 e 06, volta e clica **Salvar**.

```
SOBREVIVEM 5 de 11
```

**E TRÊS DOS SEIS PERDIDOS NÃO SE PERDIAM POR ESQUECIMENTO — o Salvar os
DESTRUÍA**, depois de a aba já ter gravado o valor certo no disco:

| campo | o que acontecia |
| --- | --- |
| `lightbar_brightness` por controle | o rodapé montava o override DELE lendo a seção GLOBAL |
| `player_leds` por controle | mesma causa, mesma linha |
| `button_actions` e `teclado_emulado` | `to_profile` monta o `Profile` com catorze campos e estes dois **não estavam lá** — os nomes apareciam ZERO vezes no arquivo |

O alcance dos dois últimos passava da interface nova: `footer_actions.py` (a
janela GTK) e `profiles_actions.py` (a aba Perfis) chamam o mesmo método, e o
`button_actions` nasceu por decisão dela em 01/09 sem nenhum Salvar preservá-lo.

**AS TRÊS DECISÕES QUE O LAUDO DEIXOU** estão em
[AS TRÊS DECISÕES DO PERFIL](2026-09-05-AS-TRES-DECISOES-DO-PERFIL-medidas-e-decididas.md):
o perfil grava **o que ela tocou** (D1), a persistência é **no clique** em toda
parte (D2), e os cinco campos sem caminho de entrada por unidade **ficam
globais e a tela diz isso** (D3).

---

## 3. OS SEIS INSTRUMENTOS QUE MENTIAM, e a assinatura que eles partilham

**1. O piloto que fotografa a tela, em três lugares de uma vez.** `--abre`
navegava por relógio e se matava acusando a página; `--abre 10` montava o
caminho `paginas/10` literal e o relatório saía com as dez abas zeradas sobre
uma foto que dizia "No such file"; e página morta devolvia `rc=0` fora das
provas. A cura da corrida **existia desde 04/09 e tinha sido aplicada a UM dos
quatro chamadores** — foi por isso que a frente da aba 10 teve de escrever um
driver próprio.

**2. A régua disso digitava o código.** Ela cobrava a linha
`if e_regua and piloto.tela.morreu is not None:` letra por letra: quando a
guarda ficou mais ESTRITA, a régua ficou vermelha sobre a cura.

**3. Catorze réguas cobravam botões que não existem mais.** A onda 1 trocou o
par `-`/`+` das velocidades por barras, e o filtro `-k` da minha integração não
alcançava `test_a_06_*`. Uma delas era **verde pelo motivo errado**: um
`pytest.raises(RuntimeError)` genérico aceitava o erro novo ("a barra não
mandou número nenhum") sem nunca chegar ao daemon.

**4. A régua dos órfãos envelheceu.** Dois órfãos foram CURADOS e a lista
congelada reprovava a melhora.

**5. A minha mordida do CSS não mordeu.** Arranquei a regra que esconde os
glifos e nenhum teste reprovou — a régua nova roda o Chrome sobre a página
publicada e pergunta o `getComputedStyle().visibility` de cada glifo.

**6. A minha própria integração da onda 1 perdeu uma frente inteira.** Conferi
três das quatro no `dev`, dei a leva por integrada, e o Vulkan ficou de fora por
três horas. O que revelou foi olhar a PÁGINA PUBLICADA procurando o gesto do
botão — não o `git`.

**A ASSINATURA:** *o instrumento respondia sobre outra coisa que não o produto*
— sobre o próprio texto do código, sobre a mesa que não estava lá, sobre a
lista congelada de ontem. **A regra que sobra:** quando a cura conhece a causa,
ela cobre TODOS os chamadores — cobrir um deixa a próxima pessoa remedindo o
mesmo defeito, e foi o que aconteceu duas vezes num dia.

---

## 4. AS TRÊS ARMADILHAS DO PROCESSO

**1. A worktree do agente pode nascer mil commits atrás.** Das quatro árvores
da onda 2, **duas nasceram em `e013d63a` (21/08) — 1150 commits atrás**, numa
época em que `src/.../interface/` não existia. Duas frentes perceberam e
adiantaram sozinhas; a terceira não, e o patch dela trazia de volta o que fora
removido depois (as constantes `_FLAVOR_MIGRATION_*`, a
`migrate_game_presets_to_xbox` e o preset `bow.json`, todos podados por decisão
dela). **Todo despacho passa a carregar a instrução de conferir e adiantar a
própria branch**, e a integração é por `cherry-pick`, nunca `git apply` cego —
os conflitos são o sinal.

**2. Rodar o piloto na árvore dela ESCREVE no disco dela.** Uma foto `--oculta`
da aba 10, tirada logo depois de integrar a renomeação do perfil padrão,
disparou a migração one-shot: `meu_perfil.json` virou `personalizado.json` no
`~/.config` REAL. Nada se perdeu (só o campo `name` mudou, e a migração guarda
backup), mas o daemon vivo ficou com o nome velho em memória e a tela passou a
mostrar um perfil ativo que não existia na lista. Curado com um restart do
serviço, com ela sem jogo aberto.

**3. Mordida e portão não dividem a árvore.** Uma frente rodou uma mordida
enquanto os portões corriam em segundo plano na mesma árvore, e o `ruff` ficou
vermelho sobre o `if True:` da mordida — vermelho falso do próprio instrumento.

---

## 5. O QUE SOBRA

**Em voo (onda 3):** a aba 02 persistindo `mic`/`speaker` por controle, a aba
03 persistindo os gatilhos, a aba 06 persistindo `mouse`/`teclado_emulado` e
dizendo na tela que eles são globais (D3), e a fita — que perde o `inerte` em
seis abas e cujos chips **não clicam no produto** (só na bancada).

**A fase 3 do perfil:** o caminho de ENTRADA por unidade
(`daemon/lifecycle.py` + `PyDualSenseController.read_state`). Frente própria,
não bloqueia nada, e destrava cinco campos de uma vez. A ordem que não se
inverte é a da casa: primeiro o caminho por unidade existir, depois o campo
entrar no esquema.

**Treze citações de linha podres** em `src/`, quase todas apontando para
`monta.py` e `hefesto_vivo.py` — os dois arquivos que a onda 3 está mexendo.
Fecham na integração dela.

**E uma pergunta que é dela:** o rodapé `#vib-estado` da aba Vibração ficou. Ele
não é a linha "Estado" que ela mandou tirar — é o aviso do gamepad virtual, que
foi cura de uma das quinze queixas de 04/09. Se ela quiser o rodapé fora
também, são duas linhas e uma régua invertida.
