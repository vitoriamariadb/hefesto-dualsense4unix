# PERFIS-O-PRECO-E-O-RADIO-01 — o preço e o rádio não nasceram, e o que nasceu foi o item 13 dela

> **A SPRINT PEDIA TRÊS LINHAS DO CSV DA PARIDADE. DUAS CAÍRAM ANTES DE EU
> COMEÇAR, e quem as derrubou foi ELA** — a decisão 10-Q6, de 05/09/2026, está
> escrita na própria célula das duas:
>
> *"É pra tudo funcionar independente do modo, mascarou forma de conexão.
> **Essas frases devem sumir.**"*
>
> As duas frases do título desta sprint — o preço da máscara no hover (linha
> 385) e o aviso do rádio em linha (linha 386) — são exatamente as que ela
> mandou sumir. Construí-las teria sido executar um enunciado revogado.
> **A terceira linha, a 370, é que era a dívida de verdade** — e ela é o item 13
> dela outra vez.

---

## O que mudou

### 1. As duas linhas que caíram — e por que eu não escrevi uma palavra delas

| linha do CSV | o que a sprint mandava | o que a derrubou |
| --- | --- | --- |
| **385** — O preço da máscara (o que o Xbox custa) | etiqueta com `texto_do_preco_da_mascara(flavor)` + tooltip por opção | **decisão dela 10-Q6, 05/09** |
| **386** — O aviso de rádio frágil no Modo Nativo | rótulo laranja com `frase_do_radio_fragil_no_modo(kind, state)` | **a mesma decisão** |

A dívida das duas **trocou de natureza** — de TEXTO para MECANISMO: o Hefesto
constrói o mecanismo em vez de descrever a limitação. As duas continuam
`FALTA_NO_HTML` na régua da paridade de propósito, e a própria célula diz por
que não se apaga: *"apagar faria a próxima pessoa reabrir a pergunta em três
semanas"*.

**O produto já se defende delas em dois lugares**, e eu conferi os dois em vez de
acreditar: `interface/aba10.py` recusa a geração se o quadro Modo voltar a
descrever o que se perde, e
`tests/unit/test_o_quadro_do_modo_nao_descreve_o_que_perde.py` é a régua
completa. **O que faltava era o terceiro degrau**, e ele é o que eu acrescentei:
os dois vigiam a GERAÇÃO, e nenhum olha o arquivo que está no disco. A geração
pode passar e a página publicada ser a de ontem.

`tests/unit/test_o_perfil_diz_o_preco_da_mascara_e_o_aviso_do_radio.py` §1 mede
as **duas páginas** (`mockup/` e `paginas/`) e **pergunta a frase ao DONO** —
`profiles_actions.texto_do_preco_da_mascara` e
`.frase_do_radio_fragil_no_modo` — em vez de digitar um pedaço dela. Digitar
faria a régua medir o texto de ontem no dia em que a frase mudasse.

**A foto está ao lado**
(`PERFIS-O-PRECO-E-O-RADIO-01-a-aba-10-sem-as-duas-frases.png`, `--oculta` pelo
`olhar.py`): o editor tem Nome, Prioridade, Funciona em, Nome do Jogo e Estilo
de Jogo — **sem quadro Modo, sem preço da máscara, sem aviso de rádio**. É a
decisão dela de pé na tela.

### 2. A linha 370 — e a conferência achou o defeito que ela descrevia

A célula pedia uma conferência de DADO:

> *"o que está VALENDO no aparelho e ainda não foi ao disco (a cor clicada, por
> exemplo) é perdido por um gesto desta aba que grave"*

**MEDIDO NESTA ÁRVORE, ANTES DE QUALQUER CURA** — perfil "Pragmata" valendo,
`[0,255,128]` no `.json`, `[255,0,255]` publicado pelo daemon (a cor que ela
acabou de clicar na aba 04), e o gesto de RENOMEAR:

```
no disco                (0, 255, 128)
viva (o daemon publica) (255, 0, 255)
gravado por editor.nome (0, 255, 128)   ← a cor dela morreu no renomear
```

**E O ESTRAGO PASSA DO DISCO.** `_gravar` reaplica o arquivo logo em seguida
(`perfil.gravar_e_reaplicar` → `profile.switch`), então o gesto não só perdia a
escolha dela no `.json` — **ele a desfazia no controle**. É a assinatura do item
13: *o Salvar DESTRUÍA, depois de a aba já ter gravado o valor certo*.

**A CURA É UM FUNIL SÓ, E ELA LÊ DO DONO** —
`a10_perfis._com_o_que_esta_valendo(nome, ctx)`. Ele chama
`rodape._draft_do_ativo`, que é quem sabe trazer o vivo por cima do disco e é o
mesmo que o «Salvar Perfil» do rodapé usa desde 01/09 (cor da barra, som,
sensores, política de vibração, `passthrough`, teto e velocidade do mouse).
Escrever essa leitura aqui seria a segunda cópia — o defeito que onze réguas
desta casa já tiveram, e a cópia é a que não recebe o campo novo do dia em que
alguém acrescentar um ao dono.

**SETE gestos passaram pelo funil**, e são os que gravam o perfil INTEIRO para
mudar UM campo:

```
editor.nome · editor.prioridade · editor.ambiente · editor.modo
editor.estilo · editor.jogo · detectar
```

**A sobreposição só vale para o perfil que está VALENDO**, com guarda por SLUG
(R-10). O que o daemon publica é o estado dos controles SOB o perfil ativo;
despejá-lo num perfil que ela edita sem ele estar valendo escreveria o estado de
um perfil dentro do arquivo de outro — **uma perda de dado nova no lugar da que
se cura**.

### 3. A armadilha que quase virou o conserto que reintroduz o defeito que cura

`DraftConfig.to_profile` tem um portão `mesmo_perfil` por slug e, com um nome
NOVO, **zera `match`, `mode` e `suppress_desktop_emulation` de propósito**
(R-11: *"o perfil nasce com a regra de casamento e a prioridade de outro
perfil"*). Medido antes de escrever a cura:

```
to_profile("Pragmata")  → difere do original em NADA
to_profile("Sackboy")   → perde match, mode e suppress_desktop_emulation
```

A rota ingênua — sobrepor já sob o nome novo — teria **apagado a regra que faz o
perfil dela entrar no jogo**, calada, para curar uma cor. Por isso o funil volta
sempre pelo **nome ANTIGO**, e o `editor_nome` renomeia DEPOIS, por
`model_copy`. §3 da régua é o que impede a volta disso.

### 4. Uma régua que media o próprio dublê — e ficou vermelha por isso

`tests/unit/test_aba10_os_cinco_gestos_calados_passaram_a_falar.py` ficou com
**dois vermelhos** por causa da minha mudança, e a causa **não é o produto**: o
`save_profile` daquele dublê era `lambda *a, **k: None` — descartava — e as duas
réguas conferiam a regra gravada lendo `todos[0].match`, **a instância que o
`load_profile` do próprio dublê devolve**. Elas passavam por ALIASING: o gesto
fazia `prof.match = …` no objeto que o dublê guardava, e a mutação aparecia na
lista **sem ninguém ter gravado nada**.

**No produto esse aliasing nunca existiu:** `load_profile` lê um `.json` e
devolve instância nova a cada chamada. A régua estava medindo o dublê, não a escrita — e
só apareceu no dia em que um gesto passou a MONTAR o perfil em vez de mutar o
que leu, que é a forma normal.

Curei o dublê (ele agora **substitui a entrada pelo perfil salvo**, por slug) e
as duas réguas passaram a ler o que foi ESCRITO, que é o que sempre quiseram
perguntar. As asserções não mudaram. **É edição de arquivo fora da minha
`posse:`** — está na §"o que sobrou" abaixo, e conferi antes que nenhuma sprint
aberta o declara.

---

## Qual mordida prova

**Régua nova:** `tests/unit/test_o_perfil_diz_o_preco_da_mascara_e_o_aviso_do_radio.py`
— 13 testes, todos verdes com a cura no lugar.

**CINCO mordidas, e as cinco reprovaram:**

| # | o que arranquei | o que a régua disse |
| --- | --- | --- |
| 1 | o funil volta a ser `load_profile` nos sete gestos | `6 failed, 7 passed` — `At index 0 diff: 0 != 255` |
| 2 | a guarda `mesmo_slug` de `_com_o_que_esta_valendo` | `1 failed` — a cor viva vaza para um perfil que não está valendo |
| 3 | a volta pelo NOME NOVO (a armadilha da §3) | `3 failed` — perde `match`, `mode` e `suppress` no renomear |
| 4 | o `try/except` do funil | `1 failed` — `RuntimeError` do daemon sobe e o gesto dela deixa de gravar |
| 5 | as duas frases coladas nas DUAS páginas | `4 failed` — §1 pega o preço e o rádio, no `mockup/` e no publicado |

E a cura devolvida, nas cinco: `13 passed`.

**A régua alheia que consertei também morde:** apaguei
`prof.match = from_simple_choice("janela", classe)` do `detectar` e
`test_o_detectar_grava_a_janela_do_jogo_de_fora_da_steam` reprovou
(`1 failed, 10 passed`); devolvida, `11 passed`. O dublê curado não ficou verde
por vacuidade.

**A régua §1 não passa por vacuidade:** ela exige que o DONO tenha produzido
frase antes de comparar (`assert frase, "…a régua passaria sem comparar nada"`).

**O dublê da ponte sabe RECUSAR:** `PonteDeMentira(daemon_vivo=False)` devolve
`False` no `profile_switch`, e há teste que exercita esse caminho — o da máquina
dela com o serviço parado.

**Vizinhança:** rodei os **58 arquivos de teste** que citam `a10_perfis`,
`10-perfis` ou `rodape` — **1316 passed, 6 failed**. Comparei com a base
(`git stash` do meu único arquivo de produto): **4 dos 6 já estavam vermelhos em
`onda/atual-0609`** e não são meus —

```
test_carona_do_wrapper_01_salvar_repoe_o_que_a_steam_comeu.py  (3)
test_o_lexico_da_aba_configuracoes.py::test_o_rodape_nao_perde_o_campo_que_nao_tem_secao
```

Os **2 que eram meus** são os da §4, e fecharam.

---

## O que NÃO verifiquei

* **O APARELHO. Não reservei a bancada e não medi um DualSense.** A sprint diz
  `bancada: false` e a minha prova é de dado (o `.json` que sai do gesto), não
  de fio. **Toda a medição da cor viva é com DUBLÊ**: um dicionário de controle
  com `lightbar_rgb`/`lightbar_on`/`lightbar_source` como o daemon publica.
  Que o daemon real publique essa forma nesse instante eu **não olhei** — a
  linha de prova no aparelho é da **MESA-DE-QUATRO-01**.
* **O CLIQUE PELA PONTE JS.** Não dirigi o `WebKit2.WebView` nem chamei
  `--prova-gesto`. A minha mudança **não toca um pixel** (nenhum HTML mudou —
  `git status` confirma), e o caminho que ela cura exige daemon vivo publicando
  cor, que é bancada. **A foto é de conferência, não é "antes e depois"**: as
  duas seriam o mesmo arquivo.
* **`duplicar` e `voltar-a-de-ontem` ficaram FORA do funil, e de propósito** —
  mas eu **não medi** o que acontece neles hoje. Ver abaixo.
* **`editor.estilo` e `detectar` passaram pelo funil sem régua própria.** O
  `editor.estilo` repinta as luzes por receita logo depois, então a cor viva é
  sobrescrita por desenho; o `detectar` precisa do detector de janela. Os cinco
  gestos medidos são `nome`, `prioridade`, `modo`, `jogo` e `ambiente`.
* **A suíte inteira.** Rodei o meu escopo e a vizinhança dele, não os doze lotes.

---

## O que sobrou para o próximo

1. **`rodape._draft_do_ativo` está no lugar errado, e agora tem DOIS
   chamadores.** O endereço certo é `pacotes/perfil.py`, que é o módulo que as
   abas já compartilham — é exatamente o argumento que moveu
   `gravar_e_reaplicar` para lá em 01/09 (*"um pacote de aba dependendo de outro
   é o oposto do território exclusivo"*). **`rodape.py` não é posse desta
   sprint**, então eu importei o dono em vez de copiá-lo, e deixo a mudança de
   casa escrita. Enquanto ela não acontece, `a10_perfis` importa `rodape` dentro
   da função.
2. **`duplicar` e `voltar-a-de-ontem` continuam lendo só o disco.** O
   `voltar-a-de-ontem` está CERTO assim — sobrepor o vivo desfaria o desfazer. O
   `duplicar` é **decisão de produto que eu não tomei**: duplicar o perfil ativo
   deveria copiar o que ela está VENDO (o vivo) ou o que está no `.json`? Ele
   grava com nome novo, e é justamente o caso em que o portão `mesmo_perfil` do
   `to_profile` morde — quem fechar isso tem de repetir a §3.
3. **A fila do próprio `_draft_do_ativo`**, que continua de pé e não é minha:
   `speaker`, `audio.mic_mudo` e `sensores` por controle já entram; o que o
   daemon publica e ninguém lê está no docstring dele, com endereço.
4. **Os 4 vermelhos herdados** de `onda/atual-0609` (a carona do wrapper e o
   léxico do rodapé) — nomeados acima, não são desta sprint e continuam lá.
5. **A régua alheia que consertei** —
   `tests/unit/test_aba10_os_cinco_gestos_calados_passaram_a_falar.py`, fora da
   minha `posse:`. Se alguém a estava editando em paralelo, o conflito na
   costura é o barulho desejado.

---

## O texto pronto da linha do CSV — para a PARIDADE-REMEDIR-02

O CSV da paridade **não é minha posse** (`nao_toca: docs/data/`). O `sinal` é
CÓDIGO, nunca prosa (`D-0609-O-SINAL-DA-PARIDADE-NAO-E-PROSA`):

**Linha 370** — *O Salvar funde o que as outras abas editaram (o rascunho)*

* `veredito`: **FEITO_NO_HTML**
* `sinal`: `_com_o_que_esta_valendo`
* `html_onde`: `src/hefesto_dualsense4unix/interface/pacotes/a10_perfis.py:1945`
* `html_faz`: `Os sete gestos que gravam o perfil inteiro (editor.nome,
  editor.prioridade, editor.ambiente, editor.modo, editor.estilo, editor.jogo,
  detectar) montam a base com o que está VALENDO por cima do disco, lendo do
  dono (rodape._draft_do_ativo) — o mesmo que o «Salvar Perfil» usa. A guarda é
  por slug: só o perfil que está valendo recebe a sobreposição. A volta é pelo
  nome ANTIGO, porque o portão mesmo_perfil de to_profile zera match, mode e
  suppress com nome novo. duplicar e voltar-a-de-ontem ficam de fora.`

**Linhas 385 e 386** — sem mudança de veredito. Continuam `FALTA_NO_HTML` por
decisão dela (10-Q6), e ganharam o degrau que faltava: a régua da PÁGINA
PUBLICADA, em
`tests/unit/test_o_perfil_diz_o_preco_da_mascara_e_o_aviso_do_radio.py`.

## O que eu medi, com a chave do mapa ao lado

| chave | transporte | até onde foi | o que eu vi |
| --- | --- | --- | --- |
| `luz.lightbar.cor` | cabo e rádio (dublê, não o fio) | **MONTOU** | A cor que o daemon publica (`lightbar_rgb` + `lightbar_on` + `lightbar_source`) chega ao `.json` que o gesto grava. Antes da cura ela era substituída pela cor do disco nos sete gestos; depois, sobrevive. **Não saiu no fio nesta medição** — a célula do mapa já diz `sim`/`sim` com "O APARELHO OBEDECEU", e eu não a remedi. |
