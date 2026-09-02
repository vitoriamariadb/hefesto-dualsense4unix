# ONDA G — a aba Perfis, e o perfil por controle

**ESPERA A ONDA A** — a tabela de controles precisa dos NOMES que a identidade
vai publicar.

## O QUE ELA VIU, e disse

> *"Prioridade 80 de 200. O maior vence a disputa quando dois perfis poderiam
> entrar. esse texto em perfis nem faz sentido mais fora a tabela dos
> controles."* <!-- noqa-acento: citação literal dela -->

**A CAUSA, MEDIDA EM 02/09/2026 — e ela é UMA para as duas queixas.**

O que ela leu no lugar do trilho não é um texto ruim: é uma FRASE QUE ENGOLIU UM
CONTROLE DESLIZANTE. O pintor termina em `el.textContent = t`
(`hefesto_vivo.py:170`), e `textContent` num elemento que tem filhos-elemento
apaga todos eles. Contando os filhos de cada alvo no
`interface/paginas/10-perfis.html`:

| endereço emitido | tag | filhos | o que sumia da tela |
| --- | --- | --- | --- |
| `guarda.linhas` | `<tbody>` | 4 | **as quatro linhas da tabela, com 24 endereços dentro** |
| `editor.prioridade.dica` | `<span>` | 2 | **o trilho da prioridade E o número ao lado** |
| `guarda.secao` | `<span>` ×16 | 2 | o glifo SVG de cada seção |

O `2` sozinho na tabela é o `guarda.linhas` escrevendo `"2"` (a contagem de
controles) dentro do `<tbody>`. A frase no lugar do controle deslizante é o
`editor.prioridade.dica`. **Nenhum dos dois é defeito de texto.**

**FATOS SUBSTITUÍDOS, medidos na ponta de `dev` (2b219284) com os dois
controles na mesa dela:**

* *"a tabela traz só um `1`"* → traz um **`2`**, e é a CONTAGEM de controles
  na mesa, não uma linha de tabela;
* *"o cabeçalho diz `0 de 1 controle`"* → diz **`1 de 2 controles com ajuste
  próprio neste perfil`**, e está CERTO: `perfis.com-ajuste` sai de
  `perfis_web._texto_do_ajuste` e conta a mesa viva. O cabeçalho nunca foi o
  problema;
* *"a aba escreve 1 campo de 3"* → a régua que produziu esse número contava só
  `data-campo`, e esta aba endereça por `data-hef`: são **21 endereços únicos
  em 81 elementos**, e o pacote escrevia 74 valores por tique já em 01/09.
  O problema nunca foi quantidade — era que a pintura se desmontava;
* *"`ativar` diz aplicado sem mudar nada"* → o FATO está certo e a CAUSA era
  outra: ele trocava para o perfil **que já estava valendo**. `pacote()` grava
  `_ESCOLHIDO = ativo` a cada tique (a sincronização inicial de `_escolhido()`)
  e a régua de cliques aciona os gestos sem `selecionar` antes — `ativar` é o
  primeiro em ordem alfabética. Nada mudava porque não havia o que mudar.
  Curado com a terceira guarda, que recusa DIZENDO.

**E UM DEFEITO NOVO, que a medição achou e ninguém tinha visto — JÁ CURADO:** a
lista de perfis tinha **14 linhas no HTML** e ela tem **33 perfis**. O cabeçalho
dizia `33 perfis` e a coluna mostrava 14 — dezenove perfis dela eram invisíveis
nesta aba, e com eles nove dos dez botões, que agem sobre o perfil ESCOLHIDO.
Esta seção afirmava que *"não tem cura pelo pacote"*, porque o `normalizar()` do
despachante descartava o `blocos`. **O `normalizar()` foi curado** e a lista
virou `blocos` (`a10_perfis._html_da_lista`): fotografado em 02/09, as 33 linhas
estão na tela, com o realce na certa.

## O REUSO, PRIMEIRO

```
app/actions/profiles_actions.py   21 funções — a interface alcança UMA
app/actions/profile_writer.py     1 função — ZERO alcançadas
app/draft_config.py               o rascunho de perfil (já importado 1x)
```

**Vinte e uma funções de perfil no motor, uma alcançada.** Esta é a aba com a
maior distância entre o que existe e o que se liga.

## O TRABALHO 4 DO CONTRATO — o perfil por controle

Ela pediu:

> *"cada perfil, salvar cada config de cada aba, e dentro de cada perfil, cada
> controle poder salvar as sua config específica e isso ser lembrado na próxima
> jogatina."* <!-- noqa-acento: citação literal dela -->

**Medido no esquema:** o `Profile` tem 17 campos; o `ControllerOverrides` tem
**quatro** (`leds`, `triggers`, `rumble`, `speaker`).

**AS DECISÕES DELA JÁ TOMADAS, em 02/09/2026 — não reabra:**

| seção | onde vai |
| --- | --- |
| `key_bindings`, `button_actions`, `mouse`, `teclado_emulado` | **por controle** |
| `mic` (`volume`, `muted`, `button_toggles_system`) | **por controle, depois da onda do microfone** |
| `mode.kind` (`native`/`gamepad`/`desktop`) | **por controle** |
| `mode.gamepad_flavor` (`dualsense`/`xbox`) | **por controle** |
| `priority` | **global** — não existe prioridade de um controle |
| `ponte` | **global** — é o registro de uma confirmação dela |
| `suppress_desktop_emulation` | **global** — protege a máquina inteira |
| `mode.coop` | **NÃO EXISTE MAIS** — removido em 02/09; cada controle é um jogador, sempre |

**As três armadilhas, todas já pagas nesta casa:**

1. **A chave é o `uniq` NORMALIZADO** (`d42f…`, não `d4:2f:…`). Há régua.
2. **Nada mudou, nada grava.** Um `profile.switch` no meio da partida não é de
   graça.
3. **Seção nova no `Profile` quebra os portões de perfil**, que exigem
   classificação: `SecaoDireta`, `ISENTOS` com razão, e
   `_SECOES_OPCIONAIS_OMITIDAS_QUANDO_NONE`. Custou seis reprovações quando o
   `button_actions` nasceu.

## AS RÉGUAS

1. **O texto da prioridade diz a verdade** — ou some. É texto de tela, e o texto
   é dela: leve a frase nova para ela aprovar.
2. **A tabela de controles mostra os controles da mesa**, com o nome que a ONDA
   A publica.
3. **`ativar` muda o estado do daemon** — sai da lista dos dezesseis.
4. **Cada seção nova em `ControllerOverrides` tem régua de ida e volta:** grava,
   recarrega, e o valor volta igual.

## COMO SE SABE QUE FECHOU

```
[ ] `ControllerOverrides` saiu de 4 campos, e cada "não" tem razão escrita
[x] a tabela mostra os DOIS controles, com nome          02/09 — a pintura os apagava
[ ] o texto da prioridade foi aprovado por ela           a frase abaixo espera o OK
[x] `ativar` sai da lista de "sem efeito"                02/09 — recusa DIZENDO
[ ] gravar → trocar de perfil → voltar: o ajuste do controle volta igual
```

## O QUE FECHOU EM 02/09, e o que ficou

**FECHOU — `src/hefesto_dualsense4unix/interface/pacotes/a10_perfis.py`:**

* a tabela `Controle / Ajuste próprio / ID da peça` voltou a existir e nomeia os
  dois controles da mesa. O `guarda.nome` saía `["", ""]` porque
  `perfis_web._linhas_da_guarda:397` lê `controle.get("rotulo")` e
  `mesa_viva.mesa_do_estado` **não devolve `rotulo`** — a docstring de
  `pacote_da_aba` afirmava que devolvia. Quem já fazia certo era
  `interface/perfis_vivos.mesa_de_agora:318`, o visor que o piloto não carrega;
* `ativar` ganhou a terceira guarda: reativar o perfil que já vale é recusa, e a
  comparação é por SLUG (R-10), não por texto cru;
* `NAO_PINTAVEIS` é a lista, num lugar só, do que a página publicada não sabe
  receber — com a medição de cada linha e quem destrava cada uma.

**FICOU, e cada um tem dono fora desta aba:**

| o que | por quê | dono |
| --- | --- | --- |
| a coluna `Ajuste próprio` mostra o padrão do mockup | aceso é `.gr.on`, apagado é `.gr`, e nenhum dos cinco alvos do pintor (texto·largura·fundo·valor·html) alcança uma CLASSE | `hefesto_vivo.py` — falta um `alvo === 'classe'` |
| o `<tbody>` da lista é reescrito a cada 500 ms | o `escrever()` carimba `data-hef-visto="1"` nos filhos, e o laço do `blocos` compara `innerHTML` COM os selos contra o HTML sem eles: as duas strings nunca batem. Medido em 02/09 — `BLOCOS 20` em 20 tiques, divergência no caractere 594. Só morde um `blocos` cujos filhos tenham endereço; os dois da `08` não têm | `hefesto_vivo.py` — o selo fora da serialização, ou a comparação sem ele |
| `ControllerOverrides` continua com 4 campos | mexe em `profiles/schema.py` e nos portões de perfil — fora do território desta frente | uma onda própria |

**DUAS LINHAS SAÍRAM DESTA TABELA — 02/09/2026, e as duas fecharam:**

* *"a barra da Prioridade fica na largura do desenho, esperando o ato de
  PUBLICAR"* — a página FOI publicada (`70b58116`) e `editor.prioridade` saiu de
  `NAO_PINTAVEIS` (`1f6e356b`). Fotografado hoje: com o perfil em 1 de 200, o
  trilho abre quase vazio, e não nos 90% do desenho;
* *"19 dos 33 perfis dela não aparecem na lista"* — a lista virou `blocos` e
  cabe inteira. Fotografado hoje: as 33 linhas, com o realce na certa.

## A FRASE DA PRIORIDADE — **APROVADA POR ELA, 02/09/2026, e aplicada**

A frase que vale, em `perfis_web._pacote_do_editor`, campo `prioridade_dica`:

> *Quando dois perfis servem ao mesmo tempo, o de número maior entra.*

A anterior era *"Prioridade 1 de 200. O maior vence a disputa quando dois
perfis poderiam entrar."*, e a queixa dela foi literal: *"esse texto em perfis
nem faz sentido mais"*. Com o trilho de volta, o número já está ao lado e a
frase repetia o que se vê — além de dizer "prioridade", que é o rótulo do campo.

A marca **PROVISÓRIO** que estava neste título saiu junto: a proposta virou
decisão dela e o texto está no produto.
