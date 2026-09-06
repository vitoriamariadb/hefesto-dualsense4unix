---
sprint: ONDA5-10-02
estado: feita
decisoes: 10-Q4, 10-Q5
posse:
  10-Q4:
    - src/hefesto_dualsense4unix/interface/aba10.py
    - src/hefesto_dualsense4unix/interface/pacotes/a10_perfis.py
    - mockup/10-perfis.html
  10-Q5:
    - src/hefesto_dualsense4unix/app/actions/carona_do_wrapper.py
    - src/hefesto_dualsense4unix/integrations/sentinela_do_wrapper.py
  reguas:
    - tests/unit/test_a_aba_10_perfis_fecha_as_linhas.py
nao_toca:
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/interface/pacotes/a07_lancadores.py
  - src/hefesto_dualsense4unix/profiles/simple_match.py
  - src/hefesto_dualsense4unix/app/actions/perfis_web.py
depois_de: [ONDA2-10-PERFIS-01, ONDA5-10-01, ONDA5-07-01]
---

# ONDA5-10-02 · DESENHO — o nome do jogo ao lado do campo, e a tira que diz a metade curta

Duas decisões, um arquivo em comum (`a10_perfis.py`), e por isso uma sprint só.
As duas são sobre **onde a resposta mora**: a 10-Q4 tira o nome do jogo da tira
e o põe ao lado do campo; a 10-Q5 encurta o que continua na tira.

---

## 0. DUAS DECISÕES DE HOJE JÁ ESTAVAM FEITAS — não há trabalho nelas

**10-Q1 — "Cadeado e frase no rato".** É o que está no produto, publicado.
`aba10.marca_com_dica` (`src/hefesto_dualsense4unix/interface/aba10.py:687-717`)
emite os dois endereços por marca — a `classe` que acende e o `html` da dica —,
o cadeado é SVG inline (`aba10.py:680-685`), o cadeado pousa no "Funciona em"
(`aba10.py:1151-1152`) e o ponto de alerta no "Nome do Jogo"
(`aba10.py:1166-1167`). O CSS dos dois está em `aba10.py:530-541`. **E chegou à página que ela abre:**
`interface/paginas/10-perfis.html` traz os dois `data-hef`, e a lista
`ESPERANDO_A_PUBLICACAO` (`a10_perfis.py:610`) está vazia desde a publicação de
05/09.

**10-Q3 — "A sua frase no desenho".** Feita, e amarrada.
`FRASE_DA_PRIORIDADE_DELA` (`aba10.py:740-741`) é a frase dela;
`FRASE_DO_UNIVERSAL` (`:745-747`) é a segunda metade que o PO mandou junto;
`DICA_DA_PRIORIDADE` (`:748`) soma as duas. Está na página publicada, e
`test_a_frase_da_prioridade_do_desenho_e_a_que_ela_aprovou`
(`tests/unit/test_a_aba_10_perfis_fecha_as_linhas.py:517`) compara o literal do
desenho com o `prioridade_dica` que o produto monta
(`app/actions/perfis_web.py:397-399`) e reprova se divergirem.

**Nada a fazer nas duas.** Ficam escritas aqui para ninguém as reabrir.

---

## 1. A 10-Q4 — "Rótulo ao lado, ao vivo", e ela recusou a opção que o produto tinha construído

> **A pergunta:** *"Quando você digita ou cola o número do jogo, a tela responde
> só na tira de baixo depois que você sai do campo, ou ao lado do campo enquanto
> você digita?"*
> **Ela marcou: "Rótulo ao lado, ao vivo"** — *"À direita do campo aparece o
> nome do jogo enquanto você digita, ou «não está nesta máquina», ou «não
> reconheci este endereço»"*.

**O produto construiu a OUTRA opção**, em 04/09: o campo se corrige sozinho
depois do `change` (`a10_perfis.py:2461-2464`, o `**{"editor.jogo": …}` que
viaja no embrulho do `_dizer`), e o nome do jogo chega pelo desfecho. As duas
réguas que guardam isso são `test_o_endereco_colado_vira_o_numero_na_frente_dela`
(`:571`) e `test_o_campo_nunca_volta_vazio_da_correcao` (`:607`).

**A escolha de hoje NÃO desfaz aquilo — ela acrescenta.** O campo continua se
corrigindo; o que nasce é o rótulo.

**Metade do motor já existe, e é a metade cara.** `_jogo_reconhecido`
(`a10_perfis.py:1890-1922`) chama `frase_do_campo_do_jogo`
(`integrations/jogos_locais.py:373-401`) — **a mesma função pura que alimenta o
rótulo da janela GTK**, com as mesmas quatro respostas:

| o que ela digitou | resposta | onde mora |
| --- | --- | --- |
| vazio | `None` — silêncio | `jogos_locais.py:393-394` |
| virou appid, o jogo está aqui | o NOME | `:396-398` |
| virou appid, o jogo não está aqui | `MSG_FORA_DA_MAQUINA` | `jogos_locais.py:370` |
| não virou appid, mas parece endereço | `MSG_NAO_RECONHECI`, com alerta | `jogos_locais.py:366`, `:399-400` |

E o docstring de `_jogo_reconhecido` já nomeia exatamente o que falta:

> *"a janela estável põe o nome do jogo ao lado do campo …, e **esta aba não tem
> esse rótulo no desenho**. Enquanto ela não o tiver, o nome chega pelo
> DESFECHO"* — `a10_perfis.py:1892-1897`

**O que ele joga fora é a segunda metade da decisão.** `frase_do_campo_do_jogo`
devolve `(frase, é_alerta)`, e `_jogo_reconhecido:1922` faz
`return "" if decisao is None else str(decisao[0])` — **o booleano do alerta
morre ali**. É ele que separa "não está nesta máquina" (rotina) de "não
reconheci este endereço" (erro), e é ele que o rótulo precisa para se pintar.

---

## 2. A 10-Q5 — "Encurtar as frases longas", e a medição de ontem envelheceu

> **Ela marcou: "Encurtar as frases longas"** — *"A tira passa a dizer só a
> metade curta e o aviso sai do texto."*

**A pergunta descrevia uma tira de UMA linha, e a tira tem DUAS desde 05/09.**
`.desfecho` usa `-webkit-line-clamp:2` e `.desfecho.on` reserva `height:30px`
(`aba10.py:495-500`). A opção que ela recusou hoje é a que já está no produto —
mais um caso da forma que este dia nomeou: *a régua média o mundo de ontem*.

**As duas coisas não brigam, e a escolha dela continua tendo trabalho.** As duas
linhas cabem ~400 caracteres, e existem DUAS frases que passam disso:

| frase | tamanho | onde nasce |
| --- | --- | --- |
| a carona reposta, 1 jogo | **212** | `app/actions/carona_do_wrapper.py:308-313` |
| a regressão da sentinela | ~290 | `integrations/sentinela_do_wrapper.py:407-415` |

Elas vêm **grudadas** na frase de ativação, por `_com_a_carona`
(`a10_perfis.py:277-321`), que faz `f"{frase} · {resultado.frase}"` em `:321`. A
metade de ativação é curta — `mensagem_de_ativacao`
(`app/actions/profiles_actions.py:862-878`) devolve `"Perfil ativado: X"`, ou
ele mais `_mensagem_de_aplicacao` (`app/actions/footer_actions.py:1791-1811`),
cujo pior caso é `"Aplicado, menos: <seções>."`. **A metade longa é sempre a da
carona.**

**E o aviso NÃO sai do produto — sai desta tira.** A mesma frase, inteira, já
tem casa em outro lugar: `a07_lancadores.py:781` a põe no corpo do cartão da
Steam, e o docstring de lá escreve por quê (*"aqui a mesma frase entra no corpo
do cartão da Steam, que é o lugar onde a recusa também aparece"*, `:801-803`).
Um cartão tem corpo; uma tira tem duas linhas. **É isso que faz a escolha dela
custar barato.**

---

## 3. O TRABALHO, EM CINCO PASSOS

### Passo 1 — `_jogo_reconhecido` para de jogar fora o alerta

`a10_perfis.py:1890-1922`. A assinatura passa de `-> str` para
`-> tuple[str, bool]`: a frase e o `é_alerta` que `frase_do_campo_do_jogo` já
devolve. O único chamador de hoje é `_agora_vale_em` (`:1925-1941`), que passa a
ler `[0]` — **uma linha**. Não crie função irmã: duas donas da mesma decisão é o
defeito que o próprio docstring de `_jogo_reconhecido` recusa (*"escrever um `if`
aqui seria a segunda verdade sobre o que é um jogo reconhecido"*, `:1904-1905`).

**A MORDIDA:** devolva o `str(decisao[0])` e
`test_o_rotulo_do_jogo_separa_a_rotina_do_erro` (novo, §4) reprova: com um
endereço malformado o rótulo sai sem alerta.

### Passo 2 — o rótulo nasce no desenho

`aba10.py:1162-1170`, dentro do `<span class="val">` do "Nome do Jogo",
**depois** do `marca_com_dica("exige", …)` e **antes** do botão `Detectar`.

**São DOIS endereços, pela mesma razão que `marca_com_dica` tem dois**
(`aba10.py:698-702`): `data-hef-alvo` é UM por elemento, e o rótulo precisa de
texto E de tinta. `editor.jogo.rotulo` (`alvo="texto"`) e `editor.jogo.alerta`
(`alvo="classe"`, no `<span>` que o embrulha). Nasce vazio: o desenho não sabe
que jogo é o dela, e um exemplo aqui seria a tela afirmando um jogo que o perfil
não tem — a mesma razão do `.dica` vazia em `aba10.py:709-712`.

**O campo encolhe para caber**, como a opção dela diz. O `<input>` do "Nome do
Jogo" divide o `.val` com a marca de 13px e com o `Detectar`; o rótulo entra na
mesma fileira, com `flex:0 1 auto` e `text-overflow:ellipsis` — **nome de jogo é
dado dela e pode ser longo**, e um rótulo sem teto empurraria o `Detectar` para
fora do quadro.

**A MORDIDA:** arranque o `<span>` e
`test_o_rotulo_do_jogo_tem_onde_pousar` (novo, §4) reprova nos DOIS sentidos —
endereço emitido sem lugar no desenho, e lugar no desenho sem quem o escreva.

### Passo 3 — o pacote escreve o rótulo a cada tique

`a10_perfis.py`, ao lado de `editor.jogo.exigencia`/`editor.jogo.exige`
(`:1381-1383`) — é o mesmo campo, é a mesma linha de código a se copiar. A
fonte é o DISCO: `simple_extra(alvo.match)`, que é o que `perfis_web`
(`:403`) já põe em `editor.jogo`.

**E os dois endereços entram em `ESPERANDO_A_PUBLICACAO`** (`a10_perfis.py:610`,
hoje vazia) até ela publicar o desenho. É exatamente o que a lista existe para
declarar, e as duas réguas de
`tests/unit/test_a_aba_perfis_manda_para_um_endereco_que_existe.py` (`:152`,
`:165`) a cobram nos dois sentidos: entrada aqui exige endereço faltando no
publicado, e endereço faltando exige entrada aqui.

**A MORDIDA:** tire a entrada da lista e
`test_toda_chave_emitida_tem_endereco_ou_esta_declarada` (`:120`, já existe)
reprova nomeando os dois endereços órfãos.

### Passo 4 — o "ao vivo" precisa de uma QUARTA porta, e ela não é desta posse

**Esta é a metade que esta sprint NÃO fecha sozinha, e declarar é o trabalho.**

O piloto tem TRÊS portas de escuta, e nenhuma é `input`:

```
document.addEventListener('change', …, true);   // hefesto_vivo.py:983
document.addEventListener('click',  …, true);   // hefesto_vivo.py:984
document.addEventListener('blur',   …, true);   // hefesto_vivo.py:1004
```

Nas três, quem responde é o gesto de `data-hef-gesto` — que aqui é
`editor.jogo`, e **ele GRAVA NO DISCO** (`a10_perfis.py:2380-2465`). Ligar um
`input` ao mesmo atributo faria o perfil ser regravado a cada tecla.

**Então a quarta porta tem de carregar endereço PRÓPRIO e de leitura** — um
`data-hef-vivo` que despacha um gesto que não escreve. O piloto é da ONDA0-P, e
a regra é a de sempre: **RELATE, não edite** — a edição some em silêncio no
merge. O próprio piloto já escreveu a lição, no bloco do `blur`:

> *"**o ouvinte único só ouve o que alguém lembrou de ensinar a ele.** Quem puser
> na tela um elemento novo que carregue valor confere se ele fala por uma destas
> três portas — senão o gesto nasce mudo, e mudo dá verde em toda régua que
> pergunte se o motor existe."* — `hefesto_vivo.py:999-1003`

**O que o Passo 3 entrega sem a quarta porta:** o rótulo certo em todo tique em
que ela **não** está digitando — ao abrir o perfil, ao trocar de perfil, e um
tique depois do `change`. **O que falta é a tecla a tecla.** Escreva isso na
entrega, com estas palavras; não a chame de pronta.

### Passo 5 — a tira recebe a metade CURTA, e o dono da frase é quem a escreve

Duas frases, dois donos, **nenhuma cirurgia de string**. Cortar no primeiro
ponto seria um segundo dono do texto, que é o defeito que esta casa nomeia toda
semana.

* `ResultadoDaCarona` (`carona_do_wrapper.py:215-229`) ganha `frase_curta: str`,
  com valor padrão `""` — os cinco pontos de construção (`:298`, `:306`, `:314`,
  `:319`, `:330`, `:332`) continuam válidos sem mudança, e só os que têm frase
  longa a preenchem. Em `:308-313` a curta é *"Reposta a Opção de Inicialização
  do Hefesto em N jogo(s) da Steam: <nomes>."* — o fato, sem o aviso;
* `sentinela_do_wrapper` ganha `frase_do_aviso_curta(censo)`, irmã de
  `frase_do_aviso` (`:393-429`) e no MESMO módulo, porque a frase é dele;
* `_com_a_carona` (`a10_perfis.py:277-321`) passa a somar `frase_curta` quando
  ela existe, e cai na `frase` quando não — **`""` continua querendo dizer "não
  diga nada"**, que é o contrato escrito em `carona_do_wrapper.py:219-220`.

**A tira CONTINUA com duas linhas.** Ela não pediu para encolher a tira; pediu
para encurtar as frases. E as duas réguas que guardam a altura —
`test_a_tira_do_desfecho_tem_duas_linhas_reservadas` (`:644`) e
`test_a_altura_reservada_e_a_conta_das_linhas_que_a_tira_mostra` (`:678`) —
ficam verdes e **não se tocam**.

**A MORDIDA:** faça `_com_a_carona` voltar a somar `resultado.frase` e
`test_a_tira_diz_a_metade_curta` (novo, §4) reprova comparando o tamanho do que
chega à tira com o teto de duas linhas.

---

## 4. AS RÉGUAS NOVAS — quatro, e cada uma morde num passo

1. `test_o_rotulo_do_jogo_separa_a_rotina_do_erro` — três entradas, três
   respostas: um appid instalado devolve o nome sem alerta; um appid ausente
   devolve `MSG_FORA_DA_MAQUINA` sem alerta; um endereço malformado devolve
   `MSG_NAO_RECONHECI` **com** alerta. **Ela LÊ as constantes de
   `jogos_locais`** (`:366`, `:370`) em vez de digitar o texto — foi assim que
   esta casa perdeu onze réguas em 26/08.
2. `test_o_rotulo_do_jogo_tem_onde_pousar` — a régua dos dois sentidos do
   Passo 2. Espelhe `test_a_marca_acende_exatamente_quando_a_frase_existe`
   (`:330`), que já faz isso para o cadeado.
3. `test_a_tira_diz_a_metade_curta` — com o dublê da carona devolvendo a frase
   longa, o que sai de `_com_a_carona` cabe nas duas linhas; e o **cartão da
   aba 07 continua recebendo a frase INTEIRA**. A segunda asserção é o que
   impede a cura de vazar para a outra aba.
4. `test_o_campo_do_jogo_nao_grava_por_tecla` — o guarda-costas do Passo 4:
   um evento `input` (ou qualquer evento que não seja `change`) **não** pode
   produzir gravação. Hoje quem segura isso é `_so_mudou`
   (`a10_perfis.py:1944-1972`), e ele só recusa `"click"`. **Esta régua reprova
   HOJE**, e é de propósito: ela é a que torna a quarta porta segura de nascer.

**E cuidado com o dublê da carona.** `ligada()` (`carona_do_wrapper.py:231-234`)
lê `HEFESTO_CARONA_WRAPPER`, e a `tests/conftest.py` o põe em `0` — na suíte a
carona **não fala**. Uma régua que só chame `_com_a_carona` sem armar o dublê
mede o `return frase` de `a10_perfis.py:314-315` e dá verde sobre a cura inteira.

---

## 5. O QUE ESTA SPRINT **NÃO** DECIDE

1. **A quarta porta do piloto.** É da ONDA0-P; aqui ela é RELATO, com o desenho
   proposto e a razão (§3, Passo 4).
2. **O carimbo de ponte** — *qual ponte já funcionou naquele jogo* — continua
   sem lugar na tela. A trava da 10-Q4 o cita, e a resposta dela não o
   endereça: o rótulo que ela escolheu tem quatro respostas, e nenhuma é essa.
   **Declarado, não esquecido.**
3. **A frase inteira da carona na janela GTK** (`carona_do_wrapper.py:411`,
   `_carona_toast`) e no cartão da aba 07 (`a07_lancadores.py:781`) **não muda**.
   O que nasce é uma segunda forma, não uma troca.

---

## 6. NADA SE PERDEU

* **O campo se corrige sozinho.** A cura de 04/09 fica inteira —
  `a10_perfis.py:2461-2464` e `:2532-2533`, com
  `test_o_endereco_colado_vira_o_numero_na_frente_dela` (`:571`) e
  `test_o_campo_nunca_volta_vazio_da_correcao` (`:607`).
* **A pintura não apaga o que ela digita.** `CAMPOS_QUE_ELA_DIGITA`
  (`a10_perfis.py:710-711`) tem `editor.jogo`, e o rótulo é endereço NOVO — ele
  não entra nessa lista, porque ninguém digita dentro dele.
* **A tira continua com duas linhas reservadas e colapsando vazia** —
  `aba10.py:495-500`, e a banda de 37px que ela chamou de bizarra continua
  morta em repouso.
* **O desfecho continua verde e com 30 s** — `SEGUNDOS_DO_DESFECHO`
  (`a10_perfis.py:274`), o mesmo prazo da tarja de recusa do piloto.
* **A carona continua REPONDO**, ligada ou calada. Nenhum passo toca
  `passada()`; o que muda é o que a tira mostra. O contrato de `frase` vazia
  (*"não diga nada"*) fica de pé.
* **O cadeado e a frase da prioridade** (§0) ficam onde estão, com as réguas que
  os guardam.
* **`_agora_vale_em` continua nomeando a regra pelo `_match_label`** — a mesma
  função pura que pinta a coluna "Quando usar" (`a10_perfis.py:1927-1930`), para
  o desfecho não chamar de outra coisa um perfil que a lista chama de "Só
  manual".

---

## A PROVA DE TELA

**Um rótulo que você acrescentou e nunca viu escrito não está entregue.** Foto
antes e depois, e o gesto: abra um perfil de jogo da Steam e leia o nome ao lado
do campo; cole um endereço malformado e veja o alerta; ative um perfil com a
carona armada e leia a tira sem reticências.

**A janela não nasce na tela dela.** `--oculta` sempre — ela tem UMA tela.
