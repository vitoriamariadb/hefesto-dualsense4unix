---
sprint: ROTA-F
estado: feita
---

# ONDA F — a aba Lançadores

> **ESTADO 06/09/2026: feita** — fase fechada em 02–03/09 (ONDE PARAMOS de 02/09, fim do dia; a aba 03 em 03/09).

**FECHADA em 02/09/2026.** O que este documento tinha como plano está abaixo da
linha; acima está o que a execução MEDIU — e ela derrubou quatro afirmações.

---

## 0. A DECISÃO QUE ABRIU ESTA ABA, e ela caducou outra

Duas decisões dela, em dois dias, sobre a mesma aba:

> **01/09** — *"a única que não faremos, só deixamos o botão levando pra ela, é
> a de lançadores."*

> **02/09** — *"não daria para incluir G e F aqui? (…) temos um mapa funcional
> disso no gtk. a estrutura sim, validar de fato eu poderia somente juntos com
> ele."* <!-- noqa-acento: citação literal dela -->

A `F` é esta aba. **A segunda vale**, e traz a razão: o GTK tem o mapa
funcional. A primeira estava codificada em **três lugares** — o docstring do
`hefesto_vivo.py`, o `SEM_PACOTE` de `test_o_despachante_serve_as_dez.py` e a
nota do `PISO` de `test_o_casamento_das_dez.py` —, e a régua do despachante
**reprovava quem escrevesse o pacote**. Os três ganharam nota datada com as duas
citações; a régua mudou de lado e passa a reprovar quem TIRAR o pacote.

Quem executar uma onda desta pasta e esbarrar numa régua que a proíbe: **leia a
citação que a régua guarda antes de mexer nela.** Ela existe justamente para
isso, e neste caso ela estava certa até o dia anterior.

---

## 1. O QUE A ABA AFIRMAVA — e o produto contradiz os quatro números

Medido em 02/09/2026 na máquina dela, com `censo_do_wrapper(anotar=False)` e
`prontuario_dos_jogos.levantar_censo` (leitura pura, nada escrito):

| o HTML afirmava | o produto responde |
| --- | --- |
| `Steam · 412 jogos` | **23 jogos instalados**; 63 appids com o wrapper no vdf |
| `◆ 3 jogos já sabem por onde entrar` | **0 pontes confirmadas** |
| `5 encontrados · 1 com impedimento` | **1 lançador medível**, e a contagem estava em plural errado |
| `Heroic · 28 jogos · NÃO CHEGAM` | o produto **nunca olhou** o Heroic |

**A cura não foi apagar o desenho — foi dar-lhe fonte.** Nenhuma caixa andou: a
grade, o CSS, os textos de ajuda e o lugar de cada botão continuam os que ela
aprovou (*"lançadores perfeito parabéns"*).

### O selo `NÃO SEI`, e por que ele precisou nascer

`grep -rniE "heroic|lutris|retroarch|dolphin|mgba" src --include="*.py"` devolve
**cinco linhas, e as cinco são comentário ou docstring** — zero função, zero
chamada. Com só `CHEGAM` e `NÃO CHEGAM` disponíveis, o cartão do Heroic teria de
escolher entre duas afirmações que o produto não pode fazer. **"Não sei" é
resposta; palpite não é.**

Há régua que reprova se um deles ganhar código e continuar com o `NÃO SEI` — e
ela lê CÓDIGO, não texto: a primeira versão descartava só o que vinha depois de
um `#` e acusou os quatro achados em docstring. *Presença de string não é
funcionamento*, de novo.

---

## 2. O QUE A ABA ACHOU NO PRIMEIRO TIQUE — um defeito vivo, na máquina dela

Às **04h55 de 02/09**, com o pacote ligado pela primeira vez:

```
com_wrapper: 62 | faltantes: 1
   3357650 'PRAGMATA (appid 3357650)' regressao
   opcoes: 'VKD3D_CONFIG=no_upload_hvv %command%'
```

O **PRAGMATA perdeu as Opções de Inicialização do Hefesto**, e a linha dele
ficou só com o `VKD3D_CONFIG` que cura o crash de 14/08. É exatamente a
regressão que o `sentinela_do_wrapper` existe para nomear (*"funciona no cabo,
quebra no rádio, e SÓ o jogo não enxerga"*) — e ela **não aparecia em tela
nenhuma** antes desta aba.

Às 04h26, meia hora antes, o mesmo censo dava `63 com wrapper, 0 faltantes`. A
Steam comeu a linha entre as duas medições.

**Não cliquei em `Consertar`** — ele escreve no `localconfig.vdf` dela.

---

## 3. O QUE FOI LIGADO, e de onde cada coisa veio

Nenhuma linha nova decide se um jogo tem wrapper, repõe wrapper ou nomeia
impedimento. Seis gestos, e cada um chama o motor:

| gesto | quem faz | o que era antes |
| --- | --- | --- |
| `procurar` | `censo_do_wrapper` + `jogos_instalados` | — |
| `consertar` | `sentinela_do_wrapper.reparar_ou_adiar` | sem tela |
| `ver-o-que-impede` | `prontuario_dos_jogos.levantar_censo` | **sem chamador em `src/`** |
| `detectar` | `steam_launch_options.steam_game_running_appid` | só o lembrete do wrapper usava |
| `tirar-daqui` | `marcar_jogo_sem_wrapper` | **nenhuma tela escrevia** o `jogos_sem_wrapper.txt` |
| `voltar-a-usar` | `desmarcar_jogo_sem_wrapper` | idem |

**Três continuam SEM endereço, e é decisão:** `abrir-lancador` (é `xdg-open`,
não IPC), `criar-perfil` (é da aba Perfis — dois caminhos para o mesmo disco é
como duas telas passam a discordar) e o `estilo-retro` (não existe preset no
produto).

### `carona_do_wrapper` foi lida e NÃO foi usada — e a razão é dura

`carona_do_wrapper.passada()` responderia parte do que a pintura precisa, mas
ela **ESCREVE no `localconfig.vdf`** quando há o que repor. Uma pintura que
escreve em disco a cada tique é a coisa mais perigosa que esta aba poderia
fazer. A pintura usa o **censo** (read-only, seguro com a Steam aberta — e é por
isso que ele é uma camada separada do reparo). Só o `Consertar` chama o caminho
que escreve.

---

## 4. O CUSTO, e por que o disco não entra no tique

| chamada | custo medido |
| --- | --- |
| `censo_do_wrapper()` | 26 ms (85 ms na primeira) |
| `jogos_instalados()` | 12 ms |
| `levantar_censo()` | **13 440 ms** |

O tique do piloto é de 500 ms. A leitura vive numa `_Vigia` com TTL de 20 s e
thread própria; o prontuário só sai do lugar quando ela clica em "Ver o que
impede", que é gesto (e gesto já roda em thread).

**Medido depois de ligada**, no `--passear` das dez abas:

```
ANTES:  abas visitadas 9   ·  07-lancadores nem foi visitada — não tem pacote
        custo do tique: mediana 2.70 ms · max 655.98 ms

DEPOIS: abas visitadas 10  ·  07-lancadores.html   1 pintura   1 valor
        custo do tique: mediana 2.58 ms · max 18.04 ms
```

---

## 5. O QUE A FOTO DERRUBOU — três defeitos que só a tela mostrou

1. **`.lanc-diz{height:2.9em}` transbordava.** A altura fixa ("duas linhas
   cravadas") existia para alinhar as fileiras de botões dos cartões irmãos, e
   só funcionava porque o texto era escrito à mão. Com o corpo vindo do produto,
   a frase da sentinela — cinco linhas — atravessou os botões por cima. O
   alinhamento **não se perdeu**: `.lanc` virou coluna flex e `.acoes` ganhou
   `margin-top:auto`, então quem alinha agora é o cartão, e a grade já iguala a
   altura dos irmãos.
2. **`1 encontrados`** — plural cravado na contagem do quadro.
3. **O meu próprio instrumento mentiu.** O script que aplicava a pintura para a
   foto usava `(.*?)(</\2>)`, e o `<span class="conta">` tem um `<span
   class="sep">` dentro: a troca parou no `</span>` errado e a foto saiu com
   *"1 encontrados · 1 com impedimento **0 com impedimento**"*. Por dois minutos
   eu li isso como defeito do produto. É *o instrumento brigando com o produto*,
   a armadilha nº 3 do `COMO-OLHAR-A-TELA.md`, em miniatura.

---

## 6. A MORDIDA, e o susto que ela deu

Duas curas arrancadas, as duas reprovaram:

```
anotar=False → anotar=True
  AssertionError: a leitura da tela pediu `anotar=[True]`. Com `True` ela GRAVA
  o `wrapper-visto.json` a cada tique, e todo jogo novo vira 'já visto' antes de
  ela ver o aviso uma única vez.

censo.reparaveis → reparaveis + intocaveis
  AssertionError: o cartão diz NÃO CHEGAM por causa de um jogo que o produto não
  toca — assert 'warn' == 'ok'
```

**E o canário do `conftest` avisou, no minuto exato, que o
`~/.local/state/.../wrapper-visto.json` DELA tinha mudado.** A conclusão fácil
era "a mordida escreveu no estado dela". Medido, não foi:

```
registro:     /tmp/pytest-of-.../\.xdg/state/hefesto-dualsense4unix/wrapper-visto.json
sem_wrapper:  /tmp/pytest-of-.../\.xdg/config/hefesto-dualsense4unix/jogos_sem_wrapper.txt
vdfs:         []
```

Os três caminhos apontam para o lar de mentira, e **não há `localconfig.vdf`
nenhum a ler** sob a suíte. Quem escreveu foi outro processo — exatamente o que
o texto do canário prevê. Isso virou régua
(`test_esta_regua_nao_alcanca_a_biblioteca_dela`), porque a dúvida vai voltar.

---

## 7. O QUE ESPERA ELA

1. **Publicar a 07.** `scripts/check_o_desenho_aprovado.py --publicar 07`. O
   pacote emite 26 valores e a página publicada é a de 31/08, sem um endereço —
   por isso o passeio mostra `1 valor`. A divergência está declarada em
   `mockup/DIVERGENCIAS.md` com o antes e o depois de cada número.
2. **Clicar em `Consertar`** (ou não) para o PRAGMATA. Com a Steam fechada, o
   reparo preserva o `VKD3D_CONFIG` — o `migrate_value` PREPENDE.
3. **Quem mede Heroic, Lutris e os emuladores?** Ninguém, ainda. É varredura
   nova, não é ligar o que existe.

---
---

## ↓ O PLANO ORIGINAL, como estava escrito ↓

## O QUE FOI MEDIDO

**Zero.** A aba tem `0` gestos e `0` de 3 campos escritos. É desenho inteiro.

## O REUSO, PRIMEIRO — o motor já tem

```
app/actions/carona_do_wrapper.py        2 de 3 funções JÁ alcançadas pela interface
app/actions/launch_wrapper_dialog.py    4 funções, ZERO alcançadas
integrations/steam_launch_options.py    a string canônica do wrapper
assets/hefesto-launch.sh                o wrapper que roda em TODO jogo lançado
```

## AS RÉGUAS

1. **Todo campo tem pintura E gesto.**
2. **A lista de jogos vem do produto**, nunca cravada no HTML.
3. **Nenhuma função duplica `carona_do_wrapper` ou `launch_wrapper_dialog`.**

## COMO SE SABE QUE FECHOU

```
[x] a aba deixa de ter 0 gestos          -> 6 com dono, 3 sem (declarados)
[x] os campos são escritos pelo pacote   -> 26, e o desenho vem do MESMO módulo
[x] a lista de jogos bate com o produto  -> `censo_do_wrapper`, não o teclado
[x] foto, clique colado, e a mordida
```
