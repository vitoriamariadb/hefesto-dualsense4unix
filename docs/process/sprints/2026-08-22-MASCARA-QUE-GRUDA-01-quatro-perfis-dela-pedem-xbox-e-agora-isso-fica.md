---
sprint: MASCARA-QUE-GRUDA-01
estado: absorvida
---

> **ESTADO 06/09/2026: absorvida** — pela regra da §3 do `SPRINT_ORDER.md`
> (*"história — não remedidas desde 27/08; o resto, se ainda faltar, é linha do
> CSV"*): o que desta sprint ainda faltar é linha de `docs/data/paridade-gtk-html.csv`
> ou célula de `docs/data/mapa-controles.csv`, e é lá que se cobra. **Se você achar
> aqui um defeito vivo que não está em nenhum dos dois, ele é seu: abra a linha.**

# MASCARA-QUE-GRUDA-01 — quatro perfis dela pedem xbox, e agora isso fica

**22/08/2026.** Consequência direta e declarada de `2b11172`, a cura que fez a
máscara persistir até ela mudar na interface. A cura está certa e é decisão
dela; o efeito de borda é este documento.

**Estado:** **FECHADA em 23/08/2026.** A E2 e a E3 fecharam em 22/08 pela
decisão dela — o preset perdeu a opinião de máscara, a tela passou a dizer o
preço dos dois lados, e os perfis dela **não foram tocados** (o porquê está na
E3). A **E1 não é trabalho a fazer: é custo já pago**, e a nota datada de 23/08
dentro dela diz por quê.

---

## O defeito, em uma linha

**Os presets de gênero pedem `xbox`, e desde hoje a máscara GRUDA no disco** —
então abrir um jogo que case em "Ação" deixa `xbox` gravado para o próximo boot,
que é a mesma queixa dela por outra porta.

## O que foi MEDIDO em 22/08

**Os presets que o produto SHIPA** (`assets/profiles_default/*.json`, lidos um a
um): sete trazem `mode.kind = gamepad` com `gamepad_flavor = xbox` — `acao`,
`aventura`, `coop_local`, `corrida`, `esportes`, `fps` e `sackboy_nativo`. Os
outros cinco não declaram modo.

**O disco DELA** (`~/.config/hefesto-dualsense4unix/profiles/`): quatro perfis de
gênero seguem em `xbox` — `acao`, `aventura`, `coop_local` e `corrida`.

> **NOTA DATADA — 23/08/2026, releitura do disco dela.** Este parágrafo dizia
> que `esportes` **e `fps`** já estavam em `dualsense`. Só `esportes` está
> (`mode.gamepad_flavor: "dualsense"`, 9 chaves). O `fps.json` tem **8 chaves e
> nenhuma seção `mode`** — não é "posto em dualsense", é perfil **sem opinião de
> máscara**, que é coisa diferente e cai no ramo "mantém a que estiver valendo".
> Logo ela desfez a máscara à mão em **um** perfil, não em dois.

**A leitura disso importa:** ela já desfez a máscara Xbox à mão em um dos
sete. O produto shipa uma escolha que ela vem corrigindo perfil a perfil.

**E os quatro vpads subiram em `dualsense/uhid` sem degradação hoje**, medido no
daemon dela em `c9859ff`:

```
launch_env_materializado  backends=['uhid','uhid','uhid','uhid'] mascara=dualsense
mascara_divergencias: []   (eram 8)
```

## O portão que exigia o xbox, e o que ele afirmava

**Ele saiu em 22/08/2026** — o que está no lugar é
`tests/unit/test_o_preset_nao_escolhe_a_mascara.py`, e a nota datada de por que
a razão mudou está no cabeçalho dele. O que havia: um portão que reprovava
qualquer preset de jogo shipando fora de `xbox`, mais o
`DEFAULT_FLAVOR = "xbox"` de `integrations/uinput_gamepad.py` (esse **fica**,
ver E2). A justificativa estava escrita no cabeçalho, palavra por palavra:

> *"H1 da auditoria pré-release: a máscara DualSense faz o jogo ignorar o
> gamepad virtual (rumble in-game morto + controle duplicado)."*

**Essa premissa merece ser remedida, e é por isso que esta sprint existe.** Duas
coisas mudaram desde que ela foi escrita:

1. a máscara `dualsense` hoje sobe em `uhid`, e o `uhid` é adotado pelo
   `hid_playstation` — não é o mesmo caminho de quando a H1 foi medida;
2. `c9859ff` provou que a máscara é **o que o jogo enxerga**, e que um vpad Xbox
   **não tem** campo de touchpad, acelerômetro nem giroscópio no descritor HID.
   Ou seja: o preço do `xbox` não é zero, e o produto passou a saber disso.

## Por que importa, e o que o silêncio custa

Enquanto os presets pedirem `xbox` e a máscara grudar, o caminho de menor gesto
leva ela ao lugar onde touchpad, giroscópio e acelerômetro **não existem para o
jogo** — e o produto vai ter gravado essa escolha por ela. É o oposto da regra
dela de 09/08: *a vontade da GUI prevalece*.

## O que NÃO é

- **Não é reverter `2b11172`.** A persistência da máscara é decisão dela, de
  hoje, e o journal sustenta o desenho.
- **Não é a MASCARA-POR-JOGADOR-01**, que trata de máscara diferente por
  jogador. Aqui é o valor que os presets shipam.
- **Não é apagar o portão.** Portão que guarda uma medição não sai porque a
  medição ficou velha — ele sai, ou muda, quando a nova medição existir.

---

## Entregas

### E1 — remedir a H1 — **CANCELADA em 23/08/2026: o custo já foi pago**

> **NOTA DATADA — 23/08/2026.** Esta entrega mandava remedir a H1 de julho. Ela
> **já foi remedida**, em julho, e a cronologia fecha sem lacuna:
>
> | quando | o quê |
> |---|---|
> | **14/07** (`56564de`) | nasce o portão que impunha `xbox` aos presets, citando a "H1 da auditoria pré-release" |
> | **16/07** (`b0596f0`, `389e429`) | o vpad passa a subir por `uhid`, com PID próprio de Edge — o caminho em que a H1 foi medida deixa de existir |
> | **22/07** | HARMONIA-MASK-01, **decisão dela**: a máscara dualsense é *"validada em jogo real (Sackboy/Mad King/Pragmata)"*, e a razão do xbox fica *"de antes da máscara dualsense vibrar — **superado** pela validação da Onda Harmonia"* |
>
> Está escrito em `daemon/lifecycle.py`, ao lado do
> `gamepad_flavor: str = "dualsense"` que essa remedição produziu — **MEDIDO em
> 23/08 num `XDG_CONFIG_HOME` vazio:** o default de fábrica é `dualsense`, e não
> o `DEFAULT_FLAVOR = "xbox"` de `uinput_gamepad.py`, que só atende entrada
> corrompida.
>
> Manter esta entrega aberta mandava alguém pagar de novo um custo já pago —
> que é exatamente o teste que a regra *"fato errado se substitui"* usa. E o
> custo não era só de tempo: a frase que ela produziu chegou à **tela dela**
> dizendo que a máscara DualSense *"nunca foi reconferida"*, semeando dúvida
> sobre a máscara que a casa validou e empurrando para a Xbox — a que custa
> giroscópio, acelerômetro e touchpad. A frase foi substituída em 23/08 (ver
> `profiles_actions.TEXTO_MASCARA_DUALSENSE_VALIDADA`), **e a redação nova pede
> o olho dela**.

O ensaio que esta entrega descrevia, preservado para quem quiser um segundo
ponto de medição no desenho de hoje (não é pré-requisito de nada):

1. um jogo que use vibração, com um DualSense, máscara `dualsense`, vpad em
   `uhid`;
2. anotar: o jogo vibra? aparece controle duplicado? o touchpad e o giroscópio
   chegam?
3. repetir com máscara `xbox`, mesmo jogo, mesma sessão.

**Prova:** as duas linhas no `docs/data/ensaios.csv`, com o jogo nomeado e a
versão do cliente Steam anotada — foi a **ausência** dessa versão que invalidou
o resultado antigo da CONTROLE-SONY-MEDIDO-01, e repetir o erro custaria o
ensaio inteiro.

### E2 — a consequência — FECHADA em 22/08/2026

A pergunta "se a H1 caiu / se a H1 continua" **não é mais o que decide**: a
decisão dela vale nos dois casos. O que entrou:

* **os sete presets de jogo shipam `"gamepad_flavor": null`** — que o applier já
  entende como "mantém a máscara que estiver valendo". `acao`, `aventura`,
  `coop_local`, `corrida`, `esportes`, `fps`, `sackboy_nativo`;
* **`migrate_game_presets_to_xbox` foi REMOVIDA** de `profiles/loader.py`, com o
  chamador. O marker `.flavor_xbox_migrated` fica no disco de quem já a rodou e
  é inerte;
* **`DEFAULT_FLAVOR = "xbox"` FICA**, com nota datada em
  `integrations/uinput_gamepad.py`. São duas perguntas, e confundi-las foi o que
  fez o `xbox` viajar para dentro do disco dela: o que um *perfil* shipa (nada,
  agora) e o que o *daemon* usa quando ninguém nunca escolheu (este piso). O
  segundo depende da E1;
* **a tela diz o preço dos dois lados**, embaixo dos botões de máscara na aba
  Perfis — não mais só em tooltip. Xbox: os três campos que o descritor não tem
  (medido). DualSense: o que ela ganha, **mais** a H1 declarada como não
  reconferida. Sem escolha: o que `null` faz.

E uma sobra que a decisão apagou: a montagem do editor nascia com **Xbox
marcado** (`flavor_sel.set_active_id("xbox")`). Se algum caminho mostrasse o
editor sem passar pelo populate, o Salvar gravaria `xbox` — e desde `2b11172`
isso gruda. Nasce sem nada marcado.

**O que a E2 NÃO resolveu, e continua da E1:** se a H1 cair, a linha do
DualSense perde a ressalva e o `DEFAULT_FLAVOR` volta à mesa. Enquanto isso, a
tela diz que não sabe — que é diferente de calar e diferente de afirmar.

### E3 — os perfis dela — FECHADA: **não se toca**, e há portão

**Nenhuma migração escreve máscara em perfil que já existe.** Nem a inversa.

O motivo é que a distinção "preset" vs. "edição dela" **não funciona para o
`xbox`**: o preset shipava `xbox` E o seletor grava `xbox`, e nada no arquivo
separa os dois casos. Uma migração inversa desfaria em silêncio uma escolha
real — o defeito desta sprint com o sinal trocado. `esportes` prova que ela
edita esses arquivos (`mode.gamepad_flavor: dualsense`, mtime 06/08);
`duskfade`, que estava em `xbox` quando esta sprint foi aberta e está em
`dualsense` agora, prova que ela edita **enquanto** a sprint corre.

> **CORREÇÃO DATADA — 23/08/2026, medida arquivo a arquivo no disco dela.**
> Aqui e no §38 estava escrito *"`esportes` e `fps`"*. O `fps.json` **não tem
> seção `mode` nenhuma** — oito chaves, mtime 05/08, enquanto o preset shipado
> tem `mode` desde `bd22ed6` (25/07). Não é máscara desfeita à mão: é perfil
> sem opinião de máscara. O §38 foi corrigido para *"um dos"* e esta linha não
> — as duas versões vivas no mesmo arquivo é o defeito que a regra da casa
> existe para matar.

Estado do disco dela em 22/08/2026, lido arquivo a arquivo: quatro perfis em
`xbox` (`acao`, `aventura`, `coop_local`, `corrida`), oito em `dualsense`, o
resto sem seção `mode`. Ficam como estão. A máscara deles muda quando ela mudar,
na aba Perfis — que agora diz o que cada lado custa.

Portão: `tests/unit/test_o_preset_nao_escolhe_a_mascara.py` roda as três
migrações one-shot que a semeadura dispara contra um diretório de mentira com
os três casos (máscara dela, máscara oposta, sem opinião) e reprova se alguma
reescrever qualquer um.

**Uma divergência entre as duas leituras, e ela é dela, não do instrumento:** a
medição do topo desta página diz `fps` em `dualsense`; a de 22/08 à noite acha
`fps.json` **sem seção `mode`**. Nenhuma das duas está errada — ela mexeu no
arquivo entre uma e outra, que é exatamente o comportamento que a E3 protege.

---

## O que ela DECIDIU — 22/08/2026, e não se reabre

**A máscara vem da escolha de quem usa.** Textual:

> *"A máscara deve vir da escolha do user. Ele escolhe como quer que o jogo
> reconheça o controle conectado: se deve aparecer como Xbox ou DualSense."*

Isto responde as DUAS perguntas que estavam aqui, e a segunda deixa de existir:

- **o preset de gênero não tem opinião sobre máscara.** Preset é sobre gatilho,
  vibração e luz; quem o aplica não deve descobrir depois que ele também trocou
  o aparelho que o jogo enxerga. É a regra dela de 09/08 — *a vontade da GUI
  prevalece* — aplicada ao caso em que a vontade é sobre identidade;
- **"o que vale mais" não é pergunta para o produto.** Era a #2 desta lista, e
  ela a derrubou pela raiz: não se escolhe entre vibração e giroscópio em nome
  de quem usa. Escolhe-se **mostrando os dois preços e deixando a pessoa
  decidir**.

**O que a decisão NÃO dispensa: a remedição da E1.** Ela é o que dá conteúdo à
escolha. Uma tela que oferece Xbox e DualSense sem dizer o que cada um custa não
é escolha, é sorteio — e o produto hoje **não diz** que o pad Xbox não tem
touchpad, giroscópio nem acelerômetro no descritor.

**A H1, para quem chega sem contexto**, é uma frase só, congelada num teste como
a razão de `DEFAULT_FLAVOR = "xbox"` (`integrations/uinput_gamepad.py:137`):

> *"a máscara DualSense faz o jogo ignorar o gamepad virtual (rumble in-game
> morto + controle duplicado)."*

Se a H1 continuar de pé, ela não vira default imposto — vira **a frase que a
aba Perfis mostra ao lado de "DualSense"**. Se caiu, sai do teste com nota
datada. Nos dois casos quem escolhe é ela, e a E1 é o que a tela tem para dizer.

**O que fica em aberto e é trabalho, não decisão:** com que máscara um perfil
NOVO nasce, antes de alguém escolher qualquer coisa. Um campo obrigatório sem
default trava o gesto de criar perfil; a escolha dela vale a partir do momento
em que ela escolhe, e antes disso alguma coisa tem de estar lá. A E2 resolve
isso com o resultado da E1 na mão.

---

## Como morde

O portão velho (`test_preset_flavor_migration.py`) exigia o CONTRÁRIO — que todo  <!-- ref-externa: apagado em 22/08/2026 (MASCARA-QUE-GRUDA-01); no lugar está test_o_preset_nao_escolhe_a_mascara.py -->
preset de jogo shipasse `xbox` — e citava a H1 como razão. Ele **saiu**, e no
lugar entrou `test_o_preset_nao_escolhe_a_mascara.py`, com a nota datada de por
que a razão mudou de natureza: não porque a H1 caiu (ela segue sem remedição),
mas porque nem a H1 de pé autoriza o produto a escrever máscara no perfil de
alguém.

Falta a E1. Enquanto ela não rodar, a linha do DualSense na tela é o que o
produto tem a dizer: *"há uma anotação de julho […] e ela nunca foi reconferida
no desenho de hoje"*.

## O que este achado ensina

**Uma cura correta pode dar poder a um default velho.** Antes de hoje, o `xbox`
dos presets era reversível pela borda de processo — o produto o desfazia sem
querer. A cura tirou o acidente, e o que sobrou foi a escolha, que agora precisa
ser defendida por medição.
