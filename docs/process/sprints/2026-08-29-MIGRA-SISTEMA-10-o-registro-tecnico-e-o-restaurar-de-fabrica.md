---
sprint: MIGRA-SISTEMA-10
estado: absorvida
# onda: MIGRA-SISTEMA (a aba 09, no motor novo)
posse:
  M10:
    - src/hefesto_dualsense4unix/app/actions/footer_actions.py
    - src/hefesto_dualsense4unix/app/actions/daemon_actions.py
    - src/hefesto_dualsense4unix/gui/main.glade
cria:
  - tests/unit/test_migra_sistema_10_o_registro_e_o_restaurar.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-PILOTO
  - MIGRA-MOLDURA-01
  - MIGRA-SISTEMA-01
  - MIGRA-SISTEMA-02
  - MIGRA-SISTEMA-03
  - MIGRA-SISTEMA-04
  - MIGRA-SISTEMA-05
  - MIGRA-SISTEMA-06
  - MIGRA-SISTEMA-07
  - MIGRA-SISTEMA-08
  - MIGRA-SISTEMA-09
  # A 05 daquela onda é quem traz o "Restaurar de fábrica" do rodapé.
  - ONDA-SISTEMA-05
  - ONDA-SISTEMA-01
  - ONDA-SISTEMA-02
  - ONDA-SISTEMA-04
  - ONDA-SISTEMA-06
  - ONDA-SISTEMA-07
  # SÉRIE, por R5: `footer_actions.py` é disputado pela onda PERFIS, e o
  # `main.glade` é recurso de bancada — uma sprint por vez.
  - ONDA-PERFIS-05
  - ONDA-CONEXOES-09
  - ONDA-JOGAR-08
  # A BANCADA DO `gui/main.glade` — esta sprint tira um botão do `footer_box`.
  # Mesma regra da 01: uma sprint por vez, e a ordem é de quem coordena.
  - COOP-NA-CONEXAO-NATIVA-01
  - EMULACAO-UM-DONO-SO-01
  - LEVA-1
  - MIGRA-CONTROLES-01
  - MIGRA-GATILHOS-03
  - MIGRA-ILUMINACAO-02
  - MIGRA-JOGAR-01
  - MIGRA-LANCADORES-01
  - MIGRA-LANCADORES-10
  - MIGRA-NAVEGACAO-01
  - MIGRA-VIBRACAO-01
  - ONDA-CONTROLES-02
  - ONDA-GATILHOS-02
  - ONDA-ILUMINACAO-04
  - ONDA-ILUMINACAO-10
  - ONDA-JOGAR-09
  - ONDA-LANCADORES-01
  - ONDA-LANCADORES-10
  - ONDA-NAVEGACAO-06
  - ONDA-NAVEGACAO-07
  - ONDA-NAVEGACAO-08
  - ONDA-NAVEGACAO-09
  - ONDA-PERFIS-01
  - ONDA-PERFIS-08
  - ONDA-VIBRACAO-02
nao_toca:
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/integrations/
  - novo-layout/
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 09). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA SISTEMA · 10 — O registro técnico, e o Restaurar de fábrica

Os dois últimos itens da faixa **Avançado**, e os dois mudam de conteúdo ou de
casa.

## O defeito (a)  —  o painel mostra outra coisa

Hoje o botão "Ver detalhes" (`on_daemon_view_logs:2374`) joga a saída de
`systemctl status` num `GtkTextView` (`_set_daemon_text:2649` →
`daemon_status_text`, dentro do `daemon_log_scroll`).

**O mockup mostra o LOG DO HEFESTO**, e é outra coisa (`aba09.py:617-620`):

```
[23:41:02] daemon pronto · 4 controles · 4 gamepads virtuais · uinput ok
[23:41:02] p1 usb · p2 bt · p3 bt · p4 usb · fw 0x0356 nos 4 · cor de fábrica só no cabo (p1, p4)
[23:41:07] exame: steam input desligado em 2 jogos · proton 9.0-4 fixado em 3
[23:41:09] perfil "Mortal Kombat" aplicado aos 4 · gatilho L2 escrito, sem leitura de volta
```

Controles, transporte por jogador, firmware, o que o exame fez, o perfil
aplicado. **Não há IPC que devolva linhas de log do daemon.** E o `title` do
botão promete *"as últimas 80 linhas do registro técnico"* — um número que hoje
não tem de onde sair.

## O defeito (b)  —  o Restaurar de fábrica mora no rodapé

`btn_footer_restore_default` (`gui/main.glade:4269`) → `on_restore_default`
(`footer_actions.py:1477`). No desenho ele é o **primeiro botão da faixa
Avançado**, em vermelho. **Muda de lugar, não de motor** — e é o único gesto
desta aba cujo handler continua vivendo noutro módulo depois da
MIGRA-SISTEMA-04.

## O que entrega

1. **A escolha dela vira código, e é uma das duas.** *(ver "O que é dela
   decidir")* — esta sprint **não escolhe sozinha**, e o executor que a pegar
   sem a resposta **para**:
   - **caminho barato:** fica o `systemctl status`, e o `title` do botão passa a
     dizer o que ele realmente mostra. Custo: quase zero. Perda: o painel deixa
     de ser "de onde você copia quando for relatar um problema" com o dado dos
     controles;
   - **caminho caro:** nasce um método de IPC de log (`daemon.log_tail`, com
     `n` linhas), e o painel mostra o que o mockup desenhou. Custo: método novo,
     política de retenção, e **decidir o que NUNCA entra numa linha de log**.
2. **Nenhum endereço de rádio no painel, em nenhum dos dois caminhos.** É regra
   desta casa e há **dois** portões, com réguas diferentes de propósito:
   `tests/unit/test_docs_mac_anonimato.py` (por OUI, autoritativo) e
   `scripts/check_endereco_de_radio.py` (por **forma**, sem consultar OUI
   nenhum). O painel é a superfície mais fácil de vazar MAC que esta aba tem —
   **um log que imprime `hidraw` e adaptador está a um passo disso.**
3. **O "Restaurar de fábrica" muda de casa sem mudar de comportamento.** O
   diálogo de confirmação continua, e a frase continua dizendo que **os perfis
   salvos dela continuam onde estão**. O botão sai do `footer_box` do Glade e o
   handler continua sendo o mesmo método — **não duplique**.
4. **O painel não é o lugar de erro.** Se um gesto falha, a mensagem vai para a
   tela, junto do gesto (MIGRA-SISTEMA-04). Empurrar erro para o painel técnico
   é esconder — a pessoa tem de clicar para saber que deu errado.

## Como se prova (a mordida)

`tests/unit/test_migra_sistema_10_o_registro_e_o_restaurar.py`:

- **o botão e o `title` não divergem.** O teste lê o `title` do botão no HTML
  gerado e exige que o que ele promete seja o que o handler faz. Se o `title`
  diz "80 linhas", o teste exige que o número **venha do código**, não do texto.
  **Mude o `title` sem mudar o handler e veja reprovar** — é a forma exata do
  defeito de 29/08: a tela prometendo um ato que o produto não executa;
- **nenhum endereço de rádio sai no painel.** Alimente o painel com um payload
  que contenha um MAC nas **três formas** (separada, colada e binária, nas duas
  ordens de byte) e prove que nada disso chega ao DOM. **Arranque a máscara e
  veja reprovar** — e rode o `check_endereco_de_radio.py` depois do `git add`,
  porque os portões são cegos a arquivo novo;
- **o Restaurar de fábrica ainda pergunta antes.** Injete o gesto e prove que
  nada foi restaurado sem confirmação. Arranque a confirmação e veja reprovar;
- **um handler só.** `on_restore_default` continua existindo uma vez. Duplique-o
  em `daemon_actions` e veja reprovar;
- **o botão saiu do rodapé.** `btn_footer_restore_default` não está mais no
  `footer_box` do Glade, e o rodapé continua montando sem ele.

## O que é dela decidir

- **O PAINEL DE "DETALHES TÉCNICOS" MUDA DE CONTEÚDO — e isto trava a sprint.**
  Hoje o botão joga `systemctl status` no painel; o mockup mostra o log do
  Hefesto com controles, transporte por jogador, firmware e o que o exame fez.
  **São coisas diferentes, e não há IPC para a segunda.** Fica o `systemctl
  status` (barato, existe), ou nasce um método de log (caro, e é o que o mockup
  desenhou)?
- **Se nascer o log: o que NUNCA entra numa linha.** O painel existe para ela
  **copiar e mandar para alguém** — é o que a dica do mockup diz com todas as
  letras (`aba09.py:511`). Endereço de rádio, caminho do home, nome de jogo:
  cada um tem um custo diferente, e a escolha é dela.
- **Onde o "Restaurar de fábrica" deixa o rodapé.** Com ele fora, o rodapé fica
  com Aplicar · Salvar · Importar · Exportar. **Isso é mudança de moldura**, e
  a moldura aparece nas dez abas — quem coordena confere com a onda que a
  possui antes de esta sprint tocar o `footer_box`.
