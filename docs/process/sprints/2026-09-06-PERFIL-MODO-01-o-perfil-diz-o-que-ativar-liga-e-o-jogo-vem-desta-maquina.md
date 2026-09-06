---
sprint: PERFIL-MODO-01
estado: feita
decisoes: [D-0609-PRIORIDADE-TODAS-AS-ABAS, 10-Q2, D1]
posse:
  10D:
    - src/hefesto_dualsense4unix/interface/pacotes/a10_perfis.py
    - src/hefesto_dualsense4unix/interface/aba10.py
    - src/hefesto_dualsense4unix/app/actions/perfis_web.py
    - mockup/10-perfis.html
    - tests/unit/test_a_aba_10_perfis_fecha_as_linhas.py
depois_de: [ONDA5-10-02, ONDA5-07-02, ONDA5-10-03, ONDA5-10-01]
nao_toca:
  - src/hefesto_dualsense4unix/interface/paginas/10-perfis.html
  - src/hefesto_dualsense4unix/app/actions/profiles_actions.py
  - src/hefesto_dualsense4unix/profiles/loader.py
  - src/hefesto_dualsense4unix/profiles/estilos_de_jogo.py
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - docs/data/paridade-gtk-html.csv
---

# PERFIL-MODO-01 · PARIDADE — o perfil diz o que "Ativar" liga, e o jogo vem desta máquina

> **FEITA — 06/09/2026.** As três linhas fecharam. O quadro **Modo** existe nas
> três camadas (dado · desenho · motor), com os quatro rótulos LIDOS de
> `_MODE_KIND_ITEMS` e as duas frases da 10-Q6 fora — e o clique dos quatro foi
> provado no `WebKit2.WebView`, com o `.json` lido do outro lado. O **«Ativar»
> chega às outras abas** por uma cura no DONO do estado
> (`pacotes/perfil.nome_do_ativo`), e a causa medida NÃO era a que esta sprint
> supunha: os tiques sempre reliam o disco; o que faltava era o NOME chegar,
> porque o daemon responde `active_profile: null`. A **lista dos jogos desta
> máquina** é um `<datalist>` que OFERECE sem fechar o campo — medido no
> WebKitGTK 2.52, `input.list` resolve.
>
> **DUAS COISAS SOBRARAM PARA QUEM COSTURA, e as duas são de UMA LINHA em
> arquivo de outra posse:** `hefesto_vivo.PERIGOSOS` precisa do
> `("10-perfis.html", "editor.modo")` (é a QUARTA aparição do defeito que a
> `ONDA3-GESTO-DECLARA-01` existe para curar), e `pacotes/__init__.topo:765`
> continua lendo `state["active_profile"]` cru — o chip "Perfil ativo" das dez
> abas. O laudo inteiro, com as fotos, as mordidas coladas e o texto pronto das
> três linhas do CSV, está em
> [`docs/process/agentes/2026-09-06/PERFIL-MODO-01.md`](../agentes/2026-09-06/PERFIL-MODO-01.md).
>
> **O DESENHO ESPERA O `--publicar 10`**, que é ato dela — declarado em
> `mockup/DIVERGENCIAS.md` com o custo da espera medido nas duas páginas.

> **A decisão dela, 06/09/2026**: todas as abas entram; **Estilo de Jogo não é
> perfil** (os gêneros saem da lista — é a `PERFIS-SAO-PERFIS-01`); e o foco é
> **quatro DualSense, por cabo ou por rádio**.

A aba 10 tem **11 linhas `FALTA_NO_HTML`**. **Três são suas** (§2). As outras
oito estão na §3, e duas delas ela mesma tirou de cena.

---

## 1. O QUE SE MEDIU

| linha do CSV | dono no motor | HTML hoje |
| --- | --- | --- |
| **A seção "Modo" do perfil** (o que ATIVAR este perfil liga) | `app/actions/profiles_actions.py:1481` | **NÃO EXISTE — nem na página, nem no pacote.** Grep de `ProfileModeConfig`, `with_mode`, `mode_kind` em `interface/` não devolve nada |
| **"Ativar": as outras abas mostram o perfil ativado, na hora** | `profiles_actions.py:3248` | **NADA.** O gesto termina no `profile_switch`; as outras abas se atualizam pelo tique de 500 ms lendo o **daemon** — mas **nada relê o perfil** |
| **A lista suspensa com os jogos DESTA máquina** | `profiles_actions.py:2495` | **NADA.** O `<input>` é texto livre |

**Os quatro rótulos do modo são DELA**, de 06/08, e estão no glossário §2:
*Jogar pelo Hefesto* · *Conexão Nativa (Sony)* · *Controlar o PC* · *Não mexer
no modo*. **Eles vêm de `_MODE_KIND_ITEMS`** — importe; não redigite.

**E as DUAS FRASES do modo já foram decididas fora:** a `ONDA5-10-03` as
remove e mantém o mecanismo. Ela fecha antes de você. **O mecanismo é seu; as
frases não voltam.**

---

## 2. O TRABALHO, EM TRÊS PASSOS

### Passo 1 — a seção `mode` do perfil

Quatro rótulos, um valor, gravado no perfil. **A gravação é a do dono**
(`with_mode` / `ProfileModeConfig`), e o clique **já aplica e já grava** — é a
decisão D1/D2, e vale aqui como vale nas outras nove abas.

**A MORDIDA:** escolha cada um dos quatro e prove que o perfil no disco mudou;
prove que **nenhuma** das duas frases removidas pela 10-03 voltou.

### Passo 2 — "Ativar" reflete nas outras abas na hora

Hoje o gesto termina no `profile_switch` e **nada relê o perfil**. O sintoma é
o pior desta casa: **a ausência de dado**, que se lê como *"não pegou"*.

A cura é do dono do estado, não uma segunda leitura na sua aba. **Cubra TODOS
os chamadores** — é a regra que 05/09 deixou escrita: *quando a cura conhece a
causa, ela cobre todos os chamadores*; cobrir um deixa a próxima pessoa
remedindo o mesmo defeito, e isso aconteceu duas vezes num dia.

**A MORDIDA:** ative um perfil e prove, **no tique seguinte**, que outra aba
mostra o valor novo. Arranque a releitura e a régua reprova — e é ela que
mede o defeito de hoje.

### Passo 3 — a lista dos jogos DESTA máquina

`profiles_actions.py:2495` e `integrations/jogos_locais.py` são os donos. O
campo deixa de ser texto livre e passa a **oferecer** o que existe na máquina —
continuando a **aceitar** o que ela digitar: uma lista que recusa o que ela
sabe que existe é pior que campo livre.

**A MORDIDA:** com a lista vazia, o campo continua aceitando texto; com jogos,
a escolha entra no `match` sem ela digitar.

---

### Passo 4 — o que a costura da ONDA A pôs no seu colo

**1. As duas frases do Modo NÃO nascem** (`ONDA5-10-03`, Passo 1, decisão dela
10-Q6). O quadro entrega os quatro botões e **nada mais**: nem linha condicional
para o rádio, nem dica com o preço do Xbox. As duas linhas do CSV já foram
remedidas na costura — **elas são dívida de mecanismo agora, não de texto**.

**A MORDIDA que a 10-03 encomendou:**
`test_o_quadro_do_modo_nao_descreve_o_que_perde` varre o HTML gerado da aba 10
atrás de `TEXTO_CUSTO_MASCARA_XBOX` e do retorno de `texto_do_radio_fragil`, e
reprova se qualquer uma aparecer. **Ela LÊ as constantes de `home_actions`** —
digitar o texto aqui a faria desligar sozinha no dia em que a frase mudasse uma
vírgula.

**2. Os NOVE gestos que gravam o perfil inteiro sem a carona**, censo por AST
entregue pela `ONDA5-07-02`: `voltar-a-de-ontem` mais os oito de `_gravar` (com
o `detectar` incluso). A casa compartilhada existe e chama-se
`perfil.com_a_carona()`; o rodapé já a usa em «Aplicar», «Salvar Perfil» e
«Importar».

**`perfil.gravar_e_reaplicar` NÃO ganha a carona** — e a razão é medida: seis
chamadores em cinco abas, ação imediata; seria uma varredura do vdf por clique,
que é a opção que o dono recusou. **Não reabra isso.**

**A MORDIDA:** arranque a carona de um dos nove e o portão por gesto (árvore de
sintaxe, da 07-02) reprova **nomeando qual perdeu o fio**.

**3. O que a `ONDA5-10-01` deixou para você**, medido por ela: pôr `"janela"` em
`_IDS_COM_CAMPO_LIVRE` faz um perfil NOVO nessa opção **pré-selecionar o modo
jogo** (`profiles_actions.py:2152`). É de propósito, mas é comportamento novo
dentro do seu quadro — **decida com os olhos abertos e escreva o que decidiu**.

---

## 3. O QUE ESTA SPRINT NÃO CONSTRÓI — e por decisão de quem

* **O editor avançado de regra** (`window_class` · título da janela · nome do
  programa) e **o aviso do `process_name` que não casa**: **fora, decisão dela
  (10-Q2)**, e fora das 24 horas.
* **"Salvar este perfil" da aba**: fora por **D1** — clicar já aplica e já
  grava; um botão de salvar ao lado disso ensina o contrário.
* **"O Salvar funde o que as outras abas editaram (o rascunho)"**: é do
  rodapé, e o rodapé é da `ONDA5-07-02`. **RELATE.**
* **Estilo de Jogo como perfil**: os gêneros **saem** da lista
  (`PERFIS-SAO-PERFIS-01`, onda B). O **motor** que aplica gatilho + vibração +
  luz por estilo é sprint depois das 24 horas.
* **O preço da máscara e o aviso de rádio frágil no Nativo**: são frases de
  **aviso** que pertencem ao mesmo canal de recado da 01 — **RELATE** para a
  `JOGAR-O-QUE-FALTA-01`, que é a dona da aba onde a escolha acontece.
* **"Tirar este jogo do Steam Input"**: é da `STEAM-INPUT-01` (decisão dela de
  06/09 dividindo a Steam). **RELATE**; não construa a segunda.
* **O CSV da paridade**: é da `PARIDADE-REMEDIR-01`.

## 4. NADA SE PERDEU

* **O que a `ONDA5-10-01` e a `ONDA5-10-02` entregaram** — o Hefesto que não
  manda ninguém para o terminal, e o nome do jogo ao lado do campo.
* **Os 24 perfis por jogo ficam com nome e id** (decisão dela, 06/09), e os
  gêneros viram Estilo de Jogo. Se você encostar num deles, é RELATO — o dono
  é a `PERFIS-SAO-PERFIS-01`.
* **A palavra da tela vem do glossário**: "perfil", "Personalizado", "Modo",
  "Funciona em", "Estilo de Jogo". **"mesa" não entra**, e `window_class`,
  `vdf`, `process_name` são **proibidos em texto de tela**.

## A PROVA DE TELA — obrigatória

1. **A FOTO** antes e depois, `--oculta`.
2. **O CLIQUE**: os quatro modos, o "Ativar" refletindo em **outra aba**, e a
   lista de jogos oferecendo.
3. **A MORDIDA** colada, uma por passo.
4. **NO TEMPO**: a régua de mutações da `A-TELA-SAMBA-01`.
