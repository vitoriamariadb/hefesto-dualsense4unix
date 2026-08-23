# MASCARA-QUE-GRUDA-01 — quatro perfis dela pedem xbox, e agora isso fica

**22/08/2026.** Consequência direta e declarada de `2b11172`, a cura que fez a
máscara persistir até ela mudar na interface. A cura está certa e é decisão
dela; o efeito de borda é este documento.

**Estado:** ABERTA — **decisão DELA**, com uma medição pendente antes da
pergunta.

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
gênero seguem em `xbox` — `acao`, `aventura`, `coop_local` e `corrida`. Os
outros dois presets de jogo que shipam em `xbox` já estão em `dualsense` no
disco dela: `esportes` e `fps`.

**A leitura disso importa:** ela já desfez a máscara Xbox à mão em dois dos
sete. O produto shipa uma escolha que ela vem corrigindo perfil a perfil.

**E os quatro vpads subiram em `dualsense/uhid` sem degradação hoje**, medido no
daemon dela em `c9859ff`:

```
launch_env_materializado  backends=['uhid','uhid','uhid','uhid'] mascara=dualsense
mascara_divergencias: []   (eram 8)
```

## O portão que exige o xbox, e o que ele afirma

`tests/unit/test_preset_flavor_migration.py` reprova qualquer preset de jogo que
shipe fora de `xbox`, e `integrations/uinput_gamepad.py:137` fixa
`DEFAULT_FLAVOR = "xbox"`. A justificativa está escrita no cabeçalho do teste,
palavra por palavra:

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

### E1 — remedir a H1, com o desenho de hoje

O ensaio é curto e mecânico, e **não** precisa dela para rodar:

1. um jogo que use vibração, com um DualSense, máscara `dualsense`, vpad em
   `uhid`;
2. anotar: o jogo vibra? aparece controle duplicado? o touchpad e o giroscópio
   chegam?
3. repetir com máscara `xbox`, mesmo jogo, mesma sessão.

**Prova:** as duas linhas no `docs/data/ensaios.csv`, com o jogo nomeado e a
versão do cliente Steam anotada — foi a **ausência** dessa versão que invalidou
o resultado antigo da CONTROLE-SONY-MEDIDO-01, e repetir o erro custaria o
ensaio inteiro.

### E2 — a consequência, seja qual for

- **Se a H1 caiu:** os presets de gênero deixam de shipar `xbox`, o
  `DEFAULT_FLAVOR` é reavaliado, e o portão muda de conteúdo com nota datada
  dizendo o que foi remedido e quando.
- **Se a H1 continua de pé:** o portão fica como está, e o produto ganha uma
  frase — na aba Perfis, onde a máscara é escolhida — dizendo o que se perde em
  cada lado. Hoje a tela não diz que o vpad Xbox não tem touchpad, giroscópio
  nem acelerômetro.

### E3 — a migração dos perfis dela, se a E2 mudar o default

`migrate_game_presets_to_xbox` (em `profiles/loader.py`) é o precedente exato:
migra uma vez, **sem tocar edições da usuária**. Se o default mudar, a migração
inversa segue a mesma regra — e `esportes` e `fps`, que ela já pôs em
`dualsense`, provam que a distinção entre "preset" e "edição dela" precisa
funcionar.

---

## O que é decisão DELA

1. **Se a máscara deve vir dos presets de gênero.** A alternativa é o preset não
   ter opinião sobre máscara nenhuma, e ela decidir por jogo — que é o fluxo que
   ela descreveu em 22/08: *"eu só ativaria o perfil do jogo, sairia modificando
   as abas"*.
2. **O que vale mais no caso de a H1 continuar de pé:** vibração garantida no
   jogo (`xbox`) ou touchpad, giroscópio e acelerômetro visíveis para o jogo
   (`dualsense`). Não há resposta técnica — é escolha de produto, com o preço na
   mesa.

---

## Como morde

Rode a E1 e o resultado é a mordida: ou o portão passa a guardar uma medição de
22/08 em vez de uma de julho, ou ele muda. Enquanto isso não acontecer, o teste
continua verde guardando uma frase que ninguém reconferiu.

## O que este achado ensina

**Uma cura correta pode dar poder a um default velho.** Antes de hoje, o `xbox`
dos presets era reversível pela borda de processo — o produto o desfazia sem
querer. A cura tirou o acidente, e o que sobrou foi a escolha, que agora precisa
ser defendida por medição.
