---
sprint: MIGRA-NAVEGACAO-14
estado: absorvida
onda: MIGRA-NAVEGACAO
posse:
  NAV6-ESTILO:
    - src/hefesto_dualsense4unix/app/telas/navegacao/estilo.py
    - assets/profiles_default/point_and_click.json
cria:
  - src/hefesto_dualsense4unix/app/telas/navegacao/estilo.py
  - tests/unit/test_migra_navegacao_14_o_estilo_point_and_click.py
bancada: false
depois_de:
  - MIGRA-NAVEGACAO-01
  - MIGRA-NAVEGACAO-02
  - MIGRA-NAVEGACAO-04  # as duas velocidades da aba são as mesmas do estilo
  - MIGRA-NAVEGACAO-12  # as três regiões do touchpad são metade das sete linhas
  - ONDA-NAVEGACAO-05   # ela cria `core/estilo_point_and_click.py`  <!-- ref-externa: nasce em ONDA-NAVEGACAO-05, ainda não executada -->
  # A FILA QUE JÁ RECLAMAVA ESTES ARQUIVOS, medida com
  # `scripts/check_colisao_de_sprints.py` em 29/08/2026. Não é escolha de
  # coordenação: quem divide arquivo executa EM SÉRIE (R5). Reconferir no dia
  # do despacho — a fila anda, e endereço de código envelhece calado.
  - IDENTIDADE-01
  - ONDA-PERFIS-04
  - ONDA-PERFIS-07
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/app.py
  - src/hefesto_dualsense4unix/profiles/schema.py
  - src/hefesto_dualsense4unix/daemon/
  - novo-layout/
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 06). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA NAVEGAÇÃO · 14 — O estilo Point-and-click, e as quatro velocidades que o schema não tem

## O defeito

**O Point-and-click existe como PERFIL e não como ESTILO.**
`assets/profiles_default/point_and_click.json` é um perfil de fábrica com match
no Grim Fandango, `mouse: {enabled, speed: 8, scroll_speed: 1}` e sete
`key_bindings` — incluindo os **três do touchpad** que a aba deixou de listar em
09/08 e que a sprint 12 devolve.

A decisão dela é outra coisa (`D-O-ESTILO-APONTA-PARA-O-MODO`):

> *"É um estilo de jogo mas esse estilo em específico é configurável dentro da
> aba navegação. Eu seto lá como esse estilo deve funcionar. E no perfil eu
> posso pegar o jogo e aplicar esse estilo mas se durante um jogo eu usar o modo
> PS+R3 e chegar no mesmo modo de conexão é como se eu tivesse aplicado o estilo
> dentro daquele perfil ativado."*

**Não é duplicação, são camadas:** a Navegação **define**; o perfil **escolhe**;
o PS+R3 **chega** nele ao vivo.

**Segundo defeito, e ele é de schema.** `ProfileMouseConfig`
(`profiles/schema.py:361`) tem **um** `speed` (1-12) e **um** `scroll_speed`
(1-5). O mockup pede **quatro** números, e diz por quê na dica: *"Duas
velocidades separadas, porque são dois aparelhos: o **touch** do touchpad e o
**analógico** esquerdo"* — e o mesmo para dois dedos e o analógico direito.

E as faixas divergem: a dica diz **1 a 10** nos quatro; o schema diz 1-12 para o
cursor e **1-5** para a rolagem. Três números na tela do estilo (`Touch 8`,
`Analógico 6`, `Dois dedos 4`, `Analógico 1`) e um deles — o 8 — vem do
`point_and_click.json` de fábrica.

## O que entrega

1. **A tela define o estilo, e o estilo tem dono próprio.** Quem guarda o que o
   Point-and-click faz é `core/estilo_point_and_click.py`, criado pela  <!-- ref-externa: nasce em ONDA-NAVEGACAO-05, ainda não executada -->
   `ONDA-NAVEGACAO-05`. Esta sprint é a **tela** dele e o **consumidor**; não
   reescreve a definição.
2. **As sete linhas saem do mapa**, como as 21 da pop-up vizinha: touchpad
   deslizar, os dois cliques do touchpad, X, O, e as duas direções dos
   analógicos (`PONTO_MAPA`, `aba06.py`).
3. **As quatro velocidades ficam DECLARADAS antes de existirem.** Enquanto
   `ProfileMouseConfig` tiver dois campos, a tela mostra **dois** números vivos e
   **dois** desligados com o motivo. Quem alarga o schema é a `ONDA-NAVEGACAO-01`
   ou a `-05` — as duas são donas do arquivo. Mostrar quatro campos gravando em
   dois é a tela prometendo o que o disco não guarda.
4. **A faixa da tela é a faixa do schema.** Ou a dica muda para 1-12/1-5, ou o
   schema muda para 1-10 nos quatro. **Não podem ser duas.** Um valor que a tela
   aceita e o schema recusa vira erro de validação no Salvar, e a pessoa não tem
   como saber o que fez de errado.
5. **O perfil de fábrica e o estilo param de ser a mesma coisa com dois nomes.**
   Ou o `point_and_click.json` passa a ser *"um perfil que escolhe o estilo"*
   (e então os `key_bindings` dele saem, porque quem os define é o estilo), ou o
   estilo nasce **do** perfil de fábrica. As duas são defensáveis; ter as duas é
   o defeito.

## Como se prova (a mordida)

`tests/unit/test_migra_navegacao_14_o_estilo_point_and_click.py`:

1. **O estilo manda enquanto vale, e as linhas da aba voltam quando ele sai.**
   É o que a própria dica do mockup promete. **Morde:** deixe as linhas do
   estilo persistirem depois de ele sair e reprova — seria o estilo escrevendo
   por cima do perfil dela sem ela pedir.
2. **Chegar pelo PS+R3 tem o mesmo efeito de escolher no perfil.** Dois
   caminhos, um estado. **Morde:** faça um deles gravar e o outro não, e
   reprova. É a palavra dela, literal.
3. **A tela não oferece campo que o disco não guarda.** Enquanto forem dois
   campos no schema, dois números da tela nascem inertes **com o motivo**.
   **Morde:** deixe os quatro editáveis e reprova, nomeando
   `ProfileMouseConfig`.
4. **A faixa é uma só.** O maior valor que a tela aceita é aceito por
   `ProfileMouseConfig`. **Morde:** ponha 10 na rolagem (o schema para em 5) e
   reprova. Esta régua é a que impede um erro de validação mudo no Salvar.
5. **As três regiões do touchpad do perfil de fábrica batem com a tabela.**
   `point_and_click.json` e a tabela do estilo dizem a mesma coisa sobre os três
   cliques. **Morde:** deixe o `KEY_E` do `touchpad_left_press` e reprova — num
   estilo de apontar e clicar, o clique esquerdo é botão esquerdo.

## O que é dela decidir

- **Que campos o Point-and-click expõe** — pergunta 6 do contrato, aberta desde
  26/08: só o mapa de botões e as velocidades, ou também gatilho, luz e vibração?
- **Estilo de fábrica se edita?** A `D-OS-ESTILOS-DE-JOGO` diz que não, e ela
  diz *"Eu seto lá como esse estilo deve funcionar"*. As duas frases são dela;
  a segunda é mais nova e é sobre **este** estilo.
- **O `point_and_click.json` continua sendo perfil de fábrica com match no Grim
  Fandango?** Se o estilo passa a definir o comportamento, o perfil vira uma
  linha só: "este jogo usa o estilo Point-and-click".
