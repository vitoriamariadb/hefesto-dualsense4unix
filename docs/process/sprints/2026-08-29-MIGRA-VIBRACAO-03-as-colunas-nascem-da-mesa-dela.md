---
sprint: MIGRA-VIBRACAO-03
onda: MIGRA-VIBRACAO
posse:
  MV3:
    - src/hefesto_dualsense4unix/interface/aba05.py
    - src/hefesto_dualsense4unix/app/telas/vibracao.py
cria:
  - tests/unit/test_migra_vibracao_03_a_mesa_e_a_dela.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-PILOTO
  - MIGRA-MOLDURA-01
  - MIGRA-VIBRACAO-01
  - MIGRA-VIBRACAO-02   # mesmo arquivo (`aba05.py`): série por R5
  # A COR DO PLÁSTICO tem dono único, e não é esta aba. A CONEXÕES-08 entrega o
  # contrato da borda + o portão; a 11 liga a leitura pelo rádio (semente
  # 0x53); a 12 traz os 28 modelos e as 10 zonas ao produto.
  - ONDA-CONEXOES-08
  - ONDA-CONEXOES-11
  - ONDA-CONEXOES-12
  - ONDA-JOGAR-09   # `app/mesa.py` em posse
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/integrations/cor_do_plastico.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_controles.py
  - src/hefesto_dualsense4unix/app/mesa.py
---

# MIGRA VIBRAÇÃO · 03 — as colunas nascem da mesa dela, e a cor não se inventa no rádio

**O defeito em uma frase:** a página desenha **quatro** controles porque um
dicionário chumbado diz quatro, e **ela tem dois**.

Palavra dela, 29/08:

> *"o layout se adapta a medida dos controles que eu tenho (…) e se eu comprar
> outros dualsense eles aparecem também seguindo a lógica que montamos no
> `mapa-do-controle.html`."*

## O que está chumbado, e onde

`src/hefesto_dualsense4unix/interface/aba05.py:76-81` — o dicionário `ESTADO`, com quatro
chaves fixas (`p1`…`p4`), cada uma com a força, o percentual e o par de lados.
As colunas saem de `monta.MESA`, que é a mesa **de cena**. O comentário do
próprio arquivo diz que a cena foi escolhida para ensinar (os quatro degraus
uma vez cada, dois lados desligados) — é boa especificação visual e **péssimo
produto**.

E a grade é `132px repeat(4,1fr)` (`aba05.py`, `.vib`), com sete alturas de
linha fixas (`--r-des:124px … --r-acoes:74px`) que as cinco colunas
compartilham — é isso que faz as colunas acabarem no mesmo `y`, que é a régua
dela (`O-REFINAMENTO-DE-ALINHAMENTO-QUE-ELA-EXIGE`).

## O que já existe, e a sprint só LIGA

| o quê | de onde |
|---|---|
| quem está na mesa | `app/mesa.py:30` `controles_conectados(state)` — de `state["controllers"]`, só os `connected` |
| o bloco em si | `core/backend_pydualsense.py:5080` `describe_controllers` — `index`, `connected`, `transport`, `is_primary`, `uniq`, `battery_pct` |
| o número do jogador | injetado em `daemon/ipc_handlers.py:2491-2504` (e `player_slot` ≠ `player`: são listas diferentes, `:519-523`) |
| a contagem do cabeçalho | `app/mesa.py:91` `texto_de_contagem` — *"4 controles: 2 USB · 2 BT"* |
| a cor lida do aparelho | `integrations/cor_do_plastico.py:524` `ler_pelo_cabo` — **só no cabo** (`_e_dualsense_no_cabo:369`) |
| o que a tela mostra da cor | `app/actions/config/secao_controles.py:1558` `_cor_na_tela` e `:1578` `_tom_da_cor` — **o dono único**, e já sabe responder "Não sei" |
| a declaração dela no disco | `ControleDeclarado.cor` (`utils/maquina.py:551`) |

## A cor pelo rádio, e por que ela não se inventa

`docs/data/mapa-controles.csv`, linha `identidade.cor_do_aparelho@dualsense`:
**`radio_aciona = não`**, `radio_por_que_nao_aciona = divida` (era
`o-aparelho-recusa` até 29/08/2026 — a recusa era do nosso CRC, não do aparelho).

O mockup mostra **P2 Starlight Blue • BT** e **P3 Galactic Purple • BT**, com a
cor pintada na borda, na moldura e nas dez zonas do desenho. **Metade da mesa
dela é rádio.** Sem a declaração dela, essas colunas nascem com o nome que
ninguém leu.

`scripts/check_paridade_transporte.py` reprova afirmação forte sem teste que a
sustente, e esta é uma afirmação forte por coluna.

## O que entrega

1. **`aba05.py` deixa de saber contar até quatro.** O `ESTADO` chumbado sai; a
   coluna é montada **por controle**. A cena estática continua existindo — é a
   especificação visual aprovada — mas gerada a partir de uma mesa de exemplo
   **declarada uma vez**, não de um dicionário paralelo que pode divergir dela.
2. **A grade vira `132px repeat(N,1fr)`**, com as sete alturas de linha
   intactas. Um a quatro (e além: `core/led_control.py:122` já sabe do 5º ao
   8º) sem mexer no alinhamento que ela aprovou.
3. **Zero controles é estado legítimo e tem tela** — o quadro com uma frase que
   diz **o quê, por quê e o que fazer** (`QUEM-E-O-USUARIO-E-POR-QUE-A-ABA-ENSINA`),
   nunca uma grade vazia.
4. **O adaptador pinta `data-uniq`, a identidade e a cor por coluna** a cada
   `state_full`, pelos endereços da **02**.
5. **A cor pelo rádio cai para a declaração dela, ou para "Não sei" com a borda
   neutra** — e quem responde é `_cor_na_tela`/`_tom_da_cor`, o dono único.
   Nunca uma segunda tabela de cores nesta aba.

## Como se prova (a mordida)

`tests/unit/test_migra_vibracao_03_a_mesa_e_a_dela.py`

- **`state_full` com DOIS controles → duas colunas**, e a grade tem três faixas
  (rótulos + 2). *Arranque:* volte o `repeat(4,1fr)` e veja a régua achar duas
  colunas vazias ocupando um terço da tela.
- **`state_full` com ZERO → a frase, e nenhuma coluna.** *Arranque:* deixe o
  caminho cair no vazio e veja reprovar. Zero controles não é erro: é a mesa
  dela quando ela guarda tudo.
- **Cinco controles não quebram a grade** nem o alinhamento das sete linhas.
- **P2 no rádio SEM declaração dela → o rótulo diz "Não sei" e a borda é a
  neutra**, nunca um nome de plástico. *Arranque:* leia a cor no rádio assim
  mesmo e veja reprovar — a régua **LÊ** a célula `radio_aciona` do
  `mapa-controles.csv`, não a digita.
- **P2 no rádio COM declaração dela → o nome declarado**, e a tela diz que é
  **declarado**, nunca "o controle disse". A distinção é o produto respondendo
  pelo transporte, e não pelo efeito.
- **O `uniq` que a coluna carrega casa com o que o daemon publica.** *Arranque:*
  troque `player` por `player_slot` na montagem e veja reprovar — são listas
  diferentes, e o próprio `ipc_handlers.py:519-523` guarda a prova de que
  confundi-las já custou.

## O que é dela decidir

1. **A cor do plástico pelo rádio.** Declaração dela da aba Configurações, ou
   "Não sei" com a borda neutra? **É a mesma pergunta das dez abas, e a resposta
   vale para todas** — quem a responder primeiro fecha o assunto do produto
   inteiro.
2. **Com um controle só, a coluna ocupa a largura toda**, ou fica na largura de
   uma de quatro, com o resto vazio? A grade faz as duas; o desenho aprovado só
   mostrou o caso de quatro.
