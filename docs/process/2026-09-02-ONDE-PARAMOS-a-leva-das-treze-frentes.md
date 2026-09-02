# ONDE PARAMOS — a leva das treze frentes, e a régua que faltava

**02/09/2026, madrugada.** Treze frentes em paralelo, cada uma na sua worktree,
território exclusivo por arquivo. **Todas as treze voltaram, zero conflito de
código** — o único conflito de merge foi o `mockup/DIVERGENCIAS.md`, onde cada
aba declara a sua seção, e resolveu-se por união.

**30 portões verdes** sobre o conjunto integrado.

---

## 1. A RÉGUA QUE FALTAVA EXISTE — e ela derrubou os dois números anteriores

O `ONDE-PARAMOS` de ontem pedia, com todas as letras:

> *"um portão que, com o daemon vivo e a mesa real, reprove quando um campo
> continua exibindo o valor do mockup. Hoje nada acusa isso — foi ela quem viu."*

Ela existe: `hefesto_vivo.py --prova-de-mockup`. Com a janela oculta e o daemon
vivo, passeia pelas dez abas, **retrata o DOM virgem antes de qualquer pintura**,
deixa a pintura correr oito voltas (ela vive no TEMPO), lê a tela de novo e
compara com o valor **cravado no arquivo publicado**. Classifica em PRODUTO ·
MOCKUP · INDECIDÍVEL e lista os MOCKUP pelo nome. O cérebro é puro
(`interface/regua_do_mockup.py`, sem GTK, sem display, sem daemon).

**E o primeiro que ela derrubou foi o número com que a leva começou:**

| régua | diz | erra porque |
| --- | --- | --- |
| o plano (36%) | 37 de 103 | conta presença de string no `aNN_*.py` |
| a correção do orquestrador (61%) | 63 de 103 | conta o dono compartilhado, mas ainda por string |
| **a régua do mockup** | **160 PRODUTO · 86 MOCKUP · 41 INDECIDÍVEL, de 287** | lê a TELA |

**A tela tem 287 campos, não 103.** Os dois números anteriores contavam NOMES
ÚNICOS de `data-campo`; o mesmo endereço se repete uma vez por coluna de
controle, e `aj-val-e-0` vale `7` na do P1 e `3` na do P2. E a `10-perfis`, que
o dossiê contava com 3 campos, tem **81 elementos** — ela endereça por `data-hef`,
que a régua antiga não olhava.

**A pior aba não era a que o plano apontava.** `03-gatilhos` carregava **41 dos
86** campos de mockup, e são exatamente os quatro ajustes que ela lia na tela
com o perfil dizendo `modo='Off' params=[]`.

## 2. O QUE MUDOU, medido pela régua nova

```
aba                    ANTES            DEPOIS           publicando o que espera ela
                    PROD  MOCK       PROD  MOCK             PROD  MOCK
01-jogar               9     2         10     0               10     0
02-controles          13     4         14     1               14     1
03-gatilhos            8    41         41     8               41     8
04-iluminacao          9     8          8     8                7     3
05-vibracao           15    26          1    40               20    21
06-navegacao           3     0          3     0                3     0
07-lancadores          1     0          1     0                7    15   (3 -> 29 campos)
08-conexoes           22     3         22     3               22     3
09-sistema             5     1          5     0                7     0
10-perfis             75     1         58    18               58    18
TODAS                160    86        163    78              189    69
```

**AS DUAS ABAS QUE PARECEM TER PIORADO NÃO PIORARAM — elas pararam de escrever
errado.** A régua conta PRODUTO quando o valor MUDOU em relação ao cravado, e
não sabe distinguir *pintar certo* de *destruir*:

- `05-vibracao` escrevia a palavra `balanceado` **dentro dos quatro botões de
  degrau** e na linha "Personalizado" de cada coluna — doze das treze "pinturas"
  eram destrutivas. Removidas, os campos voltam ao desenho e contam MOCKUP;
- `10-perfis` escrevia `guarda.linhas` como `textContent` **dentro do `<tbody>`
  que continha as quatro linhas da tabela** — o `2` sozinho que ela viu não era
  a tabela, era a tabela sendo APAGADA. Dezenove das setenta e quatro escritas
  eram destruições.

**A coluna da direita é o que a palavra dela destrava**: 78 → 69 campos de
mockup, 163 → 189 de produto, e a aba Lançadores nascendo de 3 para 29 campos.

## 3. O DEFEITO QUE QUATRO FRENTES ACHARAM E NENHUMA PODIA CURAR

`pacotes.normalizar()` comia a chave `blocos` — um `dict` de `seletor CSS →
HTML pronto` — no ramo `if isinstance(valor, dict): continue`. O `BOOTSTRAP` do
piloto sabe consumi-la desde 01/09; `a08_conexoes.py:763` a emite para trocar o
**mapa do gabinete dela** inteiro. Ela nunca chegava ao JS.

Quatro frentes independentes o mediram, cada uma pelo seu lado, e **nenhuma
tinha território para curá-lo** — a cura mora no `__init__.py`, e as quatro
estavam nos `aNN_*.py`. É trabalho de integração, e a prova é na tela:

```
08-conexoes.html   cura arrancada    1 pintura   17 valores
08-conexoes.html   cura devolvida    1 pintura   19 valores
```

Os dois de diferença são exatamente `.mm-faces` e `.mm-lista`.

**A LIÇÃO DE PROCESSO:** a divisão por arquivo é o que permitiu treze frentes
sem conflito — e é também o que produz defeitos que ninguém pode curar. Quem
coordena tem de ler os treze relatórios procurando o que se REPETE, porque o que
aparece em quatro relatórios diferentes é estrutural, não local.

## 4. OS FATOS QUE CAÍRAM — trinta e nove, e a maioria era de régua

Cada frente foi encarregada de dizer que afirmação a medição dela derrubou. As
que mais importam:

| o que se dizia | o que se mediu |
| --- | --- |
| *"no rádio o `player` volta `None`"* | é o **não-primário**; na mesa de hoje o `None` está no CABO. A condição real é `CoopManager.player_indexes` — quem o jogo enxerga |
| *"o `player` é o LED que o aparelho mostra"* | é o número que o JOGO vê; `player_leds` nem vai no payload |
| *"`a04_iluminacao.py:221` já está certo"* | `player_slot or player or 1` — o `or 1` é a POSIÇÃO disfarçada de default |
| *"**Não** reuse `app/actions/*.py`: são mixins GTK"* | 199 das 318 defs públicas são de módulo. Oito arquivos são puros. `footer_actions.py` é o único onde a proibição acertava |
| *"a03 duplicou `_padroes`, `_curva`, `_pronto_da_curva`"* | as três **já chamam o motor**. A acusação foi feita por nome, sem ler o corpo |
| *"a aba 03 escreve 1 campo de 25"* | ela monta os endereços por f-string; nenhuma régua de `grep` os vê. Escrevia 8, agora escreve 41 |
| *"06-navegacao menciona 7 e pinta 3"* | pinta os oito. O `3` é contagem de MUDANÇA — campo que já mostra o valor certo soma zero |
| *"os sete de Conexões dizem 'aplicado'"* | os sete **recusaram**, cada um com a frase que o desenho promete. A régua não distinguia recusa de mentira |
| *"07-lancadores nem é visitada"* | ela abre e renderiza — e mostrava `perfil = 'Mortal Kombat'` com o perfil ativo dela sendo outro |
| *"Steam · 412 jogos"* na aba Lançadores | a máquina dela tem **23 instalados**. E os cartões de Heroic, Lutris, RetroArch, Dolphin e mGBA prometiam o que o produto **não tem uma função** para fazer |
| *"o defeito H1 é do código"* | é `gtk-decoration-layout` da sessão DELA. As janelas nativas do COSMIC não leem essa chave; só as GTK destoam |

**E três réguas desta casa estavam cegas:**

1. `test_os_botoes_tem_dono.py` injeta `uniq` no clique de mentira — dava VERDE
   sobre quatro botões da Vibração que recusavam sempre na mão dela.
2. `test_o_perfil_chega_na_tela.py:166` tinha título e docstring dizendo *"`0.7`
   vira `70%`"* e a linha exigindo `== 0.7`. **A tela obedeceu à linha.**
3. A régua nova de `SEM_ECO` da aba 08 nasceu falsa e a própria mordida a
   derrubou: ela procurava o nome do gesto em qualquer comentário do módulo, e
   passou verde sobre uma entrada sem razão nenhuma escrita.

## 5. O QUE ESPERA A PALAVRA DELA

**Nada disto bloqueou a leva** — foi a correção dela que reorganizou a fila:
*"na real dá pra fazer todas as abas (…) Ao final eu faria apertando os botões."*

| # | o que | por quê é dela |
| --- | --- | --- |
| 1 | **publicar sete abas** (03, 04, 05, 06, 07, 09, 10) | publicar é ato dela. Medido: destrava 78→69 mockup, e nenhuma muda um pixel do desenho aprovado — o portão `desenho-aprovado` fica verde sozinho |
| 2 | **a frase da prioridade em Perfis** | texto de tela. A proposta está marcada `PROVISÓRIO` no `perfis_web.prioridade_dica` |
| 3 | **a caixa de ajustes dos gatilhos não cabe** | o desenho reserva 4 casas à esquerda e 2 à direita; o produto tem modos de 5, 6, 8, 10 e 11 parâmetros |
| 4 | **os botões da janela à esquerda** | é `~/.config/gtk-3.0/settings.ini` dela. Ninguém mexeu na configuração dela |
| 5 | **PRAGMATA perdeu o wrapper** | a Steam comeu a linha entre duas leituras. O reparo escreve no `localconfig.vdf` dela, com a Steam fechada |
| 6 | **um MAC real dela está num arquivo versionado** | `docs/process/2026-09-01-ONDE-PARAMOS-a-migra-definitiva.md:41`, herdado, não desta leva |
| 7 | **a validação final** | *"Ao final eu faria apertando os botões."* |

## 6. A ONDA DO MICROFONE ENTROU DEPOIS — e a auditoria pagou por si

Ela estava parada desde 01/09 em `worktree-wf_01bb9c2c-3c4-7` (`d6506b23`, 48
arquivos, +3401/−567): cinco lentes, o planejador, o executor — e **nunca a
auditoria**. Entrou depois da leva das treze, por três razões de arquivo (ela
toca `ipc_handlers.py`, `a02_controles.py` e `profiles/schema.py`, os três
mudados por outra gente no meio) e por uma de processo: integrar código não
auditado obrigaria treze frentes a rebasear sobre ele.

**Três auditores adversários, lentes distintas, e um corretivo com uma regra
só: PROVAR a acusação antes de corrigir.** Os três voltaram
`aprovo_com_ressalva`; SETE achados, os sete reproduzidos, os sete curados com
régua que morde. **Zero devolvido.**

**DOIS ERAM DE COMPORTAMENTO, e os dois iam para a mesa dela:**

1. **O mudo de QUALQUER controle devolvia o microfone da MESA INTEIRA**, e o LED
   de quem elegeu continuava ACESO. `_eleger_ou_devolver` decidia só pelo bit
   `mudo` e nunca perguntava se aquele `uniq` era o eleito. Medido com dublê:

   ```
   apos J1 eleger:   leds={J1:True}              chamadas=[(eleger, J1)]
   apos J2 apertar:  leds={J1:True, J2:False}    chamadas=[(eleger,J1), (DEVOLVER, <global>)]
   ```

   A J1 perdeu o microfone **sem soltar**, com a luz acesa. Alcançável no
   PRIMEIRO toque — os dois controles dela estão `mic_mudo: False`. E é o
   contrário exato do que ela pediu: *"com 4 pessoas com controle na mão
   localmente isso é necessário."*

2. **Desligar o interruptor prometia devolver a luz ao kernel e não devolvia.**
   Tomada a posse do `common[8]`, ela só cai por `set_microphone_led(None)`, e o
   ramo do interruptor fazia `continue`. A prosa afirmava o contrário.

E um terceiro que a própria auditoria criou e mediu logo depois: nem
`IController` nem o `FakeController` declaram `set_microphone_led`, então a
devolução do achado 2 caía num `getattr(...) is None` e saía **calada**.

**E A "IMPOSSIBILIDADE CONSTRUTIVA" DO COMMIT ERA FALSA.** Ele afirmava que
*"escrever no `common[9]` faz o kernel parar de alternar na borda"*. O fonte C
desta árvore decide o toggle por `ds_report->buttons[2] & DS_BUTTONS2_MIC_MUTE`
— o bit do BOTÃO no report de ENTRADA — e não lê nada que o userspace escreva
(`assets/dkms/hid-playstation/hid-playstation.c:1630-1640`). O que se perde ao
afirmar o byte é a **legibilidade** da borda: o detector desta casa lê o mudo do
FIRMWARE (`status[1]` BIT(2)), não o botão.

**A recusa de escrever o mudo do firmware continua inteira** — ela é sustentada
pelas três medições de 01/08, 03/08 e 19/08 (BT-E-VPAD-01, MIC-BT-DONO-01,
MIC-DOIS-DONOS-01). O que caiu foi o motivo NOVO, e ele saiu do teste e da
sprint. *Afirmação forte precisa de prova forte.*

**E a pergunta da primeira lente tem resposta, escrita para ninguém reauditar:**
a onda **não escreve uma linha no `common[9]`**. Varrido mecanicamente sobre as
4.818 linhas do diff; os nove acertos do filtro são prosa.

**O QUE A AUDITORIA CUSTOU E O QUE ELA RENDEU:** quatro agentes, 1M de tokens,
68 minutos. Rendeu dois defeitos que a mesa dela encontraria no primeiro toque —
e um deles com quatro pessoas na sala, que é exatamente o caso que ela descreveu
ao pedir a feature.

**O QUE FALTA, e é dela:** a onda inteira nunca foi tocada por ela, e a parte de
TELA continua sem prova de clique. O selo do mic tem dois pintores agora
(`a02_controles` e `Janela._pacote_do_card`), com um dono só
(`mesa_viva.selo_do_mic`) — e a prova no aparelho é a que nenhum dublê alcança.

## 7. AS ARMADILHAS DESTA LEVA, para a próxima não repetir

1. **`.envrc-voo` não é versionado e aponta com caminho cravado para a árvore
   dela.** Um agente que o rode por hábito testa o código DELA e lê o silêncio
   como sucesso. O briefing da leva o proibia por escrito, e por isso as treze
   mediram a própria árvore.
2. **`portoes.sh` cai na venv da árvore PRINCIPAL quando não há venv local** —
   e a principal do `git worktree list` é a `-estavel`, cuja venv está vazia.
   Sem `HEFESTO_PY` isso dá **cinco falsos vermelhos**. Na árvore de integração,
   `PATH` e `HEFESTO_PY` apontando para a venv de `dev` resolvem os dois.
3. **Duas worktrees nasceram fora da ponta de `dev`** (`e013d63a`, que não é nem
   ancestral nem descendente). As duas perceberam e fizeram `git reset --hard
   dev` antes de tocar em nada, porque o briefing mandava conferir. Sem essa
   linha no prompt, teriam entregue sobre um repositório de 21/08.
4. **`--publicar` limpa o `mockup/DIVERGENCIAS.md`.** Quem publicar para MEDIR
   (e reverter) tem de restaurar os dois: as páginas e as divergências.
