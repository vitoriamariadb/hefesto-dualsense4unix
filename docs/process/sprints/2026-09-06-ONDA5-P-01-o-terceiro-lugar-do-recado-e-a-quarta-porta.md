---
sprint: ONDA5-P-01
posse:
  P:
    - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
    - src/hefesto_dualsense4unix/gui/ponte_da_tela.py
    - tests/unit/test_o_recado_de_sucesso_pousa_no_cartao.py
cria:
  - tests/unit/test_o_piloto_tem_o_terceiro_lugar_e_a_quarta_porta.py
bancada: false
depois_de: [MIGRA-CONTROLES-03, ONDA0-P-O-PILOTO-01, ONDA5-03-01]
nao_toca:
  - src/hefesto_dualsense4unix/interface/pacotes/
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/interface/paginas/
  - src/hefesto_dualsense4unix/interface/ds_limpo.svg
  - mockup/
  - docs/data/paridade-gtk-html.csv
---

# ONDA5-P-01 · INFRA — o terceiro lugar do recado, e a quarta porta do ouvinte

**Esta sprint nasceu de três RELATOS que a ONDA CINCO deixou para o piloto**, e
nenhuma das três frentes podia escrevê-los: `hefesto_vivo.py` está no
`nao_toca` de todas. Ela é infraestrutura: **três peças pequenas, no arquivo que
só uma frente por vez pode tocar**, para que a 05-03 e a 10-02 não fiquem com
metade entregue.

| relato | quem pediu | onde está escrito |
| --- | --- | --- |
| o recado com NOTÍCIA da aba 05 quer pousar na **faixa sob a grade**, e o depósito só conhece cartão e tarja | ONDA5-05-03, Passo 4; ONDA5-03-01, §5 | `2026-09-05-ONDA5-05-03-…md`, `2026-09-05-ONDA5-03-01-…md` |
| o rótulo "ao vivo" do campo do jogo precisa de uma porta que **não grava** — o ouvinte só tem `change`, `click` e `blur`, e todas despacham o gesto que escreve no disco | ONDA5-10-02, Passo 4 | `2026-09-05-ONDA5-10-02-…md` |
| `data-controle` tem dois significados: assento (`p1`..`p4`) no piloto, e **modelo** no desenho compartilhado (`ds_limpo.svg:2`, `data-controle="dualsense"`); `LER_CAMPOS` resolve o dono por `closest('[data-controle],[data-uniq]')` e todo campo dentro do `<svg>` volta com dono `"dualsense"` | ONDA5-05-02, §4.3 | `2026-09-05-ONDA5-05-02-…md` |

---

## 1. O terceiro lugar — a página DECLARA onde o recado pousa

Hoje `pintar_recados` (`hefesto_vivo.py:710`) conhece dois lugares: o cartão do
controle (`data-controle`) e a tarja de rodapé para quem não tem cartão. O
relógio, a poda e a tradução `uniq → pref` são do `_depositar`
(`hefesto_vivo.py:2268`) e **continuam sendo** — a 05-03 diz por que um segundo
relógio dentro do pacote seria a segunda cópia da mesma regra.

**O desenho:** um container da página pode carregar `data-hef-recados`. Quando
um recado nasce de um gesto **daquela página** e o container existe, o nó do
recado pousa dentro dele — mesmo HTML, mesmo tom, mesmo prazo. Sem o atributo,
nada muda: cartão, depois tarja, como hoje.

* **um lugar por página**, e a régua recusa dois: dois containers seria a
  tela escolhendo por ordem do documento, que é o defeito da lista plana
  (T-04, a coluna "Ajuste próprio");
* **o `uniq` continua viajando**: o texto do recado nomeia a coluna
  (`P2 · …`, decisão 05-Q4), e é a aba quem escreve o prefixo, não o piloto;
* **o container é bloco de outra frente** (`#vib-estado` é escrito por
  `blocos` em `a05_vibracao.py:774`). O recado entra **ao lado** do conteúdo
  do bloco, nunca dentro do `innerHTML` que a pintura troca — senão o tique
  seguinte o apaga.

**A MORDIDA:** tire o `data-hef-recados` da página de teste e o recado volta ao
cartão; devolva-o e ponha DOIS containers — a régua reprova nomeando os dois.

## 2. A quarta porta — `data-hef-vivo`, o gesto que LÊ e não grava

As três portas de hoje (`hefesto_vivo.py:1034`, `:1035`, `:1055`) despacham
o gesto de `data-hef-gesto`. Um `input` ligado ao mesmo atributo regravaria o
perfil dela a cada tecla (`a10_perfis.py:1944`, `_so_mudou`, só recusa
`click`).

**O desenho:** um elemento pode carregar `data-hef-vivo="<gesto>"`. O evento
`input` despacha **esse** gesto, com a mesma carga (`valor`, `controle`, o
número do voo), e **nunca** o de `data-hef-gesto`. O contrato do gesto vivo é
o do `recado`: ele devolve `{"campos": {...}}` para pintar, e o piloto recusa
em `stderr` se ele devolver `blocos` ou tentar gravar (a régua da 10-02,
`test_o_campo_do_jogo_nao_grava_por_tecla`, é a cliente).

* **sem `data-hef-vivo`, o `input` continua sem ouvinte** — nenhuma das dez
  abas muda de comportamento;
* **o `em_voo` não veste o elemento** no gesto vivo: o cursor `progress` a
  cada tecla seria a tela dizendo "trabalhando" sobre uma leitura de 2 ms;
* **um gesto vivo em voo por elemento**: tecla nova cancela a leitura
  anterior, ou a resposta velha pinta por cima da nova.

**A MORDIDA:** ligue `data-hef-vivo` ao gesto que grava e a régua reprova
nomeando o gesto; arranque a quarta porta e o `input` volta a não fazer nada.

## 3. O dono do campo — assento não é modelo

`LER_CAMPOS` (`hefesto_vivo.py:1444`) e o ouvinte (`:1075`) resolvem o dono
por `closest('[data-controle],[data-uniq]')`. O SVG compartilhado leva
`data-controle="dualsense"`, e o valor é **modelo**, não assento.

**O desenho, e é o mais barato:** o piloto só aceita como dono um
`data-controle` cujo valor seja **assento** (`p1`..`p4`); qualquer outro valor
é ignorado e a busca continua subindo. Renomear o atributo do SVG é desenho
de quatro abas e publicação — **não é desta sprint**; fica declarado como
dívida da frente do desenho compartilhado.

**A MORDIDA:** ponha um `data-campo` dentro do `<svg>` de uma coluna `p2` e
leia o dono: tem de ser `p2`, nunca `dualsense`.

## 4. As réguas — no arquivo que já abre um WebKit de verdade

`tests/unit/test_o_recado_de_sucesso_pousa_no_cartao.py` é a bancada certa
(WebKit real, página publicada, DOM lido). **Não faça substituição em massa
nele**: as quatro réguas que a ONDA5-03-01 manteve continuam intocadas. As
novas vão para `tests/unit/test_o_piloto_tem_o_terceiro_lugar_e_a_quarta_porta.py`,
uma por mordida acima, mais a que prova que **sem os três atributos nada
mudou** — é a régua de regressão das dez abas.

## 5. NADA SE PERDEU

* **o canal do recado continua UM** — `_depositar`, poda, prazo e tradução
  de endereço não mudam de dono;
* **a piscada da 03-Q4** (`MS_DA_PISCADA`, `hefesto_vivo.py:187`) e o
  `hef-deu-certo` continuam como a ONDA5-03-01 os deixou;
* **as três portas de hoje** e o `_so_mudou` da aba 10 não perdem uma recusa;
* **`PERIGOSOS`** (`hefesto_vivo.py:1591`) continua fora do `--prova-gesto`;
* **nenhuma página é regerada nem publicada** — o que nasce aqui é
  capacidade do piloto; quem a usa é a 05-03 e a 10-02, cada uma na sua
  página, e a publicação é ato dela.

## A PROVA DE TELA

`--oculta` sempre. Três fotos: o recado da 05 na faixa e não sobre o desenho
do controle; o rótulo da 10 mudando a cada tecla sem gravação no disco (o
`mtime` do perfil não muda); e um campo dentro do SVG com dono `p2`.
