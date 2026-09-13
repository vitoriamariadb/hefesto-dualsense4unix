# JOGAR-A-FAIXA-QUE-PULA-01 — entrega (opus)

Árvore `hefesto-voo/JOGAR-A-FAIXA-QUE-PULA-01-opus`, branch
`voo/JOGAR-A-FAIXA-QUE-PULA-01-opus`, nascida de `onda/1309` = `53cfd578`.
Bancada: não exigida (`bancada: false`); nenhum gesto foi mandado ao daemon dela.

## O que mudou

**A causa, medida antes de mexer (Passo 1).** Piloto `--oculta` na 01, com
`HEFESTO_DUALSENSE4UNIX_SKIP_PRESET_SEED=1`, instrumento de rascunho que lê o
retângulo de `[data-gesto="reconectar"]`, o `.pendente` e a classe da
`.faixa-final`. A hipótese do §0 caiu pela metade:

* **parado 60 s** (120 amostras a cada 500 ms, 1212 px): o botão não se move
  — 132 amostras em `x=1005.7`;
* **acender e apagar a pendência** (`.ha` e a frase do produto): não move;
* **o recibo do Reconectar pousando na fileira** — o depósito de sucesso do
  piloto, pelo caminho do produto (`Piloto._depositar`): move, e move
  **invisível**, porque o recado veste `.pendente` e a faixa sem `.ha` esconde
  tudo o que veste `.pendente`.

| largura | repouso / pendência | recibo curto | recibo longo | três frases (dublê de comprimento) |
| --- | --- | --- | --- | --- |
| 1212 | x=1005.7 | x=782.2 (−223.5) | x=704.3 (−301.4) | x=156.6 |
| 1228 | x=1021.7 | x=798.2 | x=720.3 | x=172.6 |
| 1282 | x=1075.7 | x=852.2 | x=774.3 | x=226.6 |
| 1300 | x=1093.7 | x=870.2 | x=792.3 | x=244.6 |

Em todas: `y=522`, uma linha. A foto 2 dela (botão no meio, contorno verde) é
o recibo curto logo depois do pouso; a foto 1 (botão à esquerda) é um recibo
longo. **As duas linhas da foto 1 não se reproduziram no WebKit** — só no
Chrome, com a cura arrancada (mordida M2).

**A cura, pelo gerador** (`aba01.py` → `mockup/01-jogar.html` →
`check_o_desenho_aprovado.py --publicar 01`):

1. `aba01.py` MIOLO — o nó `recibo-do-reconectar` (`data-hef-recados="sucesso"`)
   saiu da `.faixa-final`, com nota datada no lugar (§3.3).
2. `aba01.py` CSS — três regras: `.faixa-final .pendente{flex:1 1 0;min-width:0;
   overflow:hidden}` e `.faixa-final > .btn{flex:none;white-space:nowrap;
   margin-left:auto;order:1;align-self:flex-start}`. O seletor é `.btn` e não
   o `data-gesto`: a primeira versão repetia `data-gesto="reconectar"` na folha
   e duas réguas que exigem o botão UMA vez reprovaram — medido e trocado.
3. `a01_jogar.py` — `_ressalva_da_mascara` devolve `""` em todo estado (§3.1),
   com nota datada; ela continua dona da linha.
4. `a01_jogar.py` — `pacote()` emite `""` em `pendente`, `pendente-alvo` e
   `pendente-ha` (§3.2). A pendência continua medida por `_faixa_do_pendente`
   e vai ao diário por `_relatar_a_pendencia`
   (`[relato] 01-jogar.html · pendente: …`, uma linha por mudança).
5. `aba01.py` LEGENDA — a linha da faixa tracejada deixou de prometer o que a
   tela não faz mais.

**§3.2, medido no código e em dublê — não no aparelho** (ela estava jogando, e
o adendo proíbe clicar modo contra o daemon real): o chip Xbox pede
`gamepad.emulation.set {"enabled": true, "origin": "manual", "flavor": "xbox"}`
(`mode_transition.plan_mode_transition`); `gamepad._recriacao_bloqueada_por_jogo`
devolve `False` para `manual` com `display_authority="game"` e `True` para
`profile` (o dublê sabe recusar); o daemon grava `config.gamepad_flavor` depois
de o vpad novo nascer, e `_estado_da_tela` acende o chip com esse `flavor`.
**O chip mostra a escolha** — pelo ramo da sprint, a faixa não acende.

**Depois da cura, a mesma medição no piloto, com a página publicada final:**

| largura | as 7 cenas (repouso, pendência, pendência+recibo, recibo curto, longo, três frases, limpo) |
| --- | --- |
| 1212 | x=1017.7, y=522, 1 linha, folga à direita 0 |
| 1228 | x=1033.7, y=522, 1 linha, folga 0 |
| 1282 | x=1087.7, y=522, 1 linha, folga 0 |
| 1300 | x=1105.7, y=522, 1 linha, folga 0 |

Parado 60 s: 128 amostras numa posição só. O botão ficou 12 px mais à direita
que antes: era o `gap` do nó vazio do recibo.

**O CLIQUE.** `element.click()` no WebKit do piloto oculto, pelo ouvinte do
BOOTSTRAP até `_gesto`, a thread e o gesto `reconectar` —
com `ponte.resultado` trocada NO PROCESSO DO INSTRUMENTO por um dublê
(`coop.sync` e `identity.renumber` com notícia; qualquer outro método devolve
`None` sem chamar o daemon). Desfecho `01-jogar.html:reconectar → aplicou`.
Antes do clique, em voo, no pouso verde (`hef-deu-certo`) e 2 s depois: x=1033.7
em 1228 e x=1105.7 em 1300, y=522, uma linha, folga 0. **E o recado pousou no
cartão do P1** — ver "O que sobrou", item 1.

**AS FOTOS**, todas `--oculta`, fora do repositório (rascunho da sessão):
`antes2/foto-antes-{1228,1300}-{repouso,recibo-curto,recibo-muito-longo}.png`,
`final/foto-depois-{1228,1300}-{repouso,recibo-curto,recibo-muito-longo}.png`,
`clique/foto-clique-{1228,1300}-pousou.png`.

**Réguas:** nasce `tests/unit/test_o_reconectar_nao_muda_de_lugar.py` (12 casos:
a página nos dois lados; o layout no Chrome headless em 1228 e 1300, sete cenas;
as duas frases no pacote; os três elos do §3.2). Mudam de contrato, com data e
citação: `test_a01_a_mascara_vale_sempre_que_pode.py` (a régua da ressalva
virou `…_sem_frase_na_tela`) e `test_a_faixa_de_pendencia_da_jogar.py` (o
ajudante mede a dona, `_faixa_do_pendente`, e não mais a tela). As réguas da
aba: 133 verdes (`test_o_reconectar_nao_muda_de_lugar`,
`test_a01_a_mascara_vale_sempre_que_pode`, `test_a_faixa_de_pendencia_da_jogar`,
`test_a_aba_01_jogar_fecha_as_linhas`, `test_a01_a_mesa_vazia_fala`,
`test_a_01_jogar_tirou_a_atencao_e_o_canal_continua_vivo`,
`test_a_aba01_le_o_estado_em_vez_de_cravar`,
`test_o_piloto_tem_o_terceiro_lugar_e_a_quarta_porta`,
`test_o_dono_do_comportamento_e_um_so`).

## Qual mordida prova

Quatro, aplicadas por roteiro que arranca, roda, e devolve de cópia (conferido
byte a byte nos quatro arquivos; a régua nova fecha `12 passed` depois).

**M1 — o nó do recibo volta ao MIOLO** (regerado e publicado):

```
E       AssertionError: a 01 voltou a declarar um lugar de recado: o recibo volta a entrar na fileira do Reconectar e a empurrá-lo
FAILED tests/unit/test_o_reconectar_nao_muda_de_lugar.py::test_a_faixa_final_nao_declara_lugar_de_recado[bancada]
FAILED tests/unit/test_o_reconectar_nao_muda_de_lugar.py::test_a_faixa_final_nao_declara_lugar_de_recado[publicado]
2 failed, 10 passed in 16.48s
```

Declarado: com o nó de volta e o CSS novo inteiro, a cena «o piloto pousa o
recibo» NÃO move o botão no Chrome — as regras da faixa já o seguram. Quem
morde o nó é a metade da página.

**M2 — as três regras da faixa saem do CSS** (regerado e publicado):

```
E           AssertionError: 1228px · um vizinho de texto longo entra na fileira: o botão quebrou em 2 linhas
E           AssertionError: 1300px · um vizinho de texto longo entra na fileira: o botão quebrou em 2 linhas
FAILED tests/unit/test_o_reconectar_nao_muda_de_lugar.py::test_o_botao_nao_muda_de_lugar_em_cena_nenhuma[1228]
FAILED tests/unit/test_o_reconectar_nao_muda_de_lugar.py::test_o_botao_nao_muda_de_lugar_em_cena_nenhuma[1300]
2 failed, 10 passed in 16.58s
```

**M3 — `_ressalva_da_mascara` volta a devolver `RESSALVA_DA_MASCARA` fora do modo jogo:**

```
E       AssertionError: a ressalva voltou a ser pintada fora do modo jogo: 'Guardada neste controle. Ela passa a valer quando o Hefesto voltar a entregá-lo ao jogo.'
FAILED tests/unit/test_o_reconectar_nao_muda_de_lugar.py::test_a_ressalva_da_mascara_nao_chega_a_tela[nativo]
FAILED tests/unit/test_o_reconectar_nao_muda_de_lugar.py::test_a_ressalva_da_mascara_nao_chega_a_tela[navegacao]
FAILED tests/unit/test_a01_a_mascara_vale_sempre_que_pode.py::test_fora_do_modo_jogo_a_escolha_fica_guardada_sem_frase_na_tela[estado0]
FAILED tests/unit/test_a01_a_mascara_vale_sempre_que_pode.py::test_fora_do_modo_jogo_a_escolha_fica_guardada_sem_frase_na_tela[estado1]
4 failed, 5 passed, 15 deselected in 0.76s
```

**M4 — a frase da pendência volta ao endereço `pendente`:**

```
E           AssertionError: a faixa voltou a falar: pendente='● Vai mudar para: Xbox'
FAILED tests/unit/test_o_reconectar_nao_muda_de_lugar.py::test_a_pendencia_nao_acende_a_faixa_e_vai_ao_diario
1 failed, 11 deselected in 0.56s
```

A mordida da TELA (antes/depois no WebKit) é a das duas tabelas acima: o mesmo
instrumento, a mesma sequência, com a página antiga e com a publicada.

## O que NÃO verifiquei

* **Nada no aparelho.** Nenhum clique no Reconectar, no modo Xbox/DualSense nem
  no interruptor contra o daemon dela. O §3.2 («clicar Xbox com um jogo
  aberto») foi medido no código e em dublê; com um jogo aberto de verdade, NÃO
  VERIFICADO.
* **As duas linhas da foto 1 no WebKit.** Sem a cura, o botão foi para a
  esquerda mas não quebrou linha no piloto; a quebra só apareceu no Chrome
  (M2). A largura da janela dela (~1228 e ~1282) é leitura das fotos.
* **O `[relato]` da pendência no `interface.log` do produto instalado** — só
  no stderr do teste (capsys).
* **A suíte inteira** — rodei as nove réguas da aba (133) e a nova; a suíte é
  de quem coordena.
* **`olhar.py --todas --publicado --doc`** — as fotos da documentação ficam
  para quem coordena; a da aba 01 mudou 12 px.
* **A primeira medição «antes» abriu o `hidraw` do controle dela pelo broker**
  (o leitor de cor do piloto, só leitura, `hidraw_broker_fd_recebido`). As
  outras quatro corridas foram com `sem_cor`. Não medi efeito nenhum no jogo
  dela, e não houve pedido de escrita.
* **A razão da ressalva no `title` dos chips** (o «pode» do §3.1) — não feita:
  o chip já carrega o endereço `mascara-cartao`, e um elemento carrega um só.

## O que sobrou para o próximo

1. **ORDEM DE COSTURA: esta branch entra JUNTO ou DEPOIS da TELA-CALADA-01.**
   Sozinha, sem a faixa declarada na página, o recado de sucesso do Reconectar
   cai no fallback do `pintar_recados` e pousa no **cartão do P1**, cobrindo o
   desenho, o nome e o plástico por 6 s — o defeito que ela fotografou em
   08/09 (JOGAR-02). Medido pelo clique (`recado.onde = "cartao p1"`) e na
   foto `clique/foto-clique-1300-pousou.png`. A TELA-CALADA-01 §1.1 para de
   depositar sucesso, e aí não há o que pousar.
2. **Achado sobre a JOGAR-02 §3:** a faixa do recibo NUNCA mostrou o recibo.
   Ele pousava ali vestido de `.pendente`, e a faixa só tem `.ha` com
   pendência — logo, de 09/09 até hoje, o recibo do Reconectar existia na tela
   só como o empurrão do botão.
3. **`docs/data/donos-de-comportamento.csv`** (não é da minha posse): as linhas
   `mascara.pode_escolher_agora` (`onde_html` = `_ressalva_da_mascara`,
   DIVERGE-GTK-ERRA) e `pendente.memoria_e_faixa` (`_faixa_do_pendente`,
   DUPLICATA, 51 linhas) descrevem frases que a tela não mostra mais. Os dois
   símbolos continuam definidos de propósito — o portão resolve por símbolo —,
   mas a razão das duas linhas precisa ser relida por quem tem a posse.
4. **`docs/data/paridade-gtk-html.csv:29`** — «A faixa laranja do que ela pediu
   e ainda não valeu», `DIFERENTE`/`PRESENTE`: a faixa não acende mais.
5. **`docs/usage/AS-DEZ-ABAS-o-que-cada-uma-faz.md:72-74`** ainda descreve a
   área de Atenção (saiu em 07/09) e a linha «Vai mudar para … quando você
   clicar em Aplicar». Fato errado, fora da minha posse.
6. **O par `mascara-ressalva` e a `RESSALVA_DA_MASCARA` seguem cravados na
   página** (escondidos). Se o silêncio ficar, quem tiver a posse do desenho
   pode tirar o par e o `_conferir` §8; hoje ele é o que deixa a frase voltar
   mudando uma função.
7. **O silêncio do caso de falha:** uma pendência que persiste (o daemon não
   alcançou o modo) agora só aparece no diário. A sprint decidiu pelo ramo «o
   chip mostra»; se a falha do daemon precisar de lugar na tela, é outra sprint.
