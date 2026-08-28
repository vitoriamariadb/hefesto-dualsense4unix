---
sprint: ONDA-JOGAR-01
posse:
  J1:
    - src/hefesto_dualsense4unix/app/actions/home_actions.py
cria:
  - src/hefesto_dualsense4unix/app/actions/jogar/__init__.py
  - src/hefesto_dualsense4unix/app/actions/jogar/esqueleto.py
  - src/hefesto_dualsense4unix/app/actions/jogar/seletor_de_modo.py
  - src/hefesto_dualsense4unix/app/actions/jogar/modo_de_conexao.py
  - src/hefesto_dualsense4unix/app/actions/jogar/atencao.py
  - src/hefesto_dualsense4unix/app/actions/jogar/pecas_na_mesa.py
  - src/hefesto_dualsense4unix/app/actions/jogar/faixa_final.py
  - src/hefesto_dualsense4unix/app/actions/jogar/pausa.py
  - tests/unit/test_jogar_a_tela_nao_pula.py
  - tests/unit/test_jogar_o_que_saiu_nao_volta.py
bancada: false
depois_de:
  # SÉRIE, por R5: esta sprint divide src/hefesto_dualsense4unix/app/actions/home_actions.py
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-SISTEMA-01
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/app.py
  - src/hefesto_dualsense4unix/app/actions/footer_actions.py
  - src/hefesto_dualsense4unix/app/actions/status_actions.py
---

# ONDA JOGAR · 01 — o esqueleto, e o que ela mandou sair

**Onda:** JOGAR (aba 1). **É a base: nenhuma outra sprint desta onda desenha
antes desta fechar.**

## O defeito, em uma frase

A aba Início tem **três quadros e oito widgets que brotam e somem**, e o
mockup que ela aprovou tem **dois quadros de altura fixa** — o esqueleto de
hoje não comporta o desenho de amanhã.

## O que o mockup manda (`novo-layout/01-jogar.html`)

Dois quadros, cada um com um ícone `?` ao lado do título — e nada mais:

1. **Quando o jogo abrir** — o seletor de modo, o seletor de máscara e a
   sub-seção *Modo de conexão*.
2. **Conectado agora** — as peças à esquerda, a coluna *Atenção* à direita,
   e a **faixa final** embaixo (pendente + Reconectar Controles).

Palavra dela, literal, sobre o segundo quadro:

> *"Vc separou em dois blocos o atenção e o conectando agora. É um só bloco."*
> *"jogga o reconectar controles pora ficar ao lado direito vai mudar para
> Conexão Nativa (Sony) quando você clicar em Aplicar"*

## O que SAI, e a palavra dela em cada linha

| Sai | Onde está hoje | A palavra dela |
|---|---|---|
| Caixa **"Não trocar de perfil sozinho ao abrir um jogo"** + a linha de dica | `home_actions.py:2263-2295` (`lock_check`, `lock_hint`) | mockup: *"A caixa 'Não trocar de perfil sozinho' saiu — o perfil ativo já diz isso."* |
| Linha **"Ponte com o jogo"** | `home_actions.py:2124-2131` (`self._home_ponte_label`), texto em `texto_da_ponte` (`:1121`) | *"esse texto na real, quanndo vi o tooltip ele não faz sentido podemos remover ele"* […] |
| **"2 controles = 2 jogadores"** | `home_actions.py:2073-2079` (`players_hint`), texto em `_format_players_hint` (`:1504`) | *"vamos remover o 2 controles = 2 jogadores já que temos ● 2 controles: USB + USB"* |
| Botão **"Detectar o jogo que está aberto"** | não existe — era proposta do redesenho | *"pode remover esse botão, esse também Detectar o jogo que está aberto ›"* — **não nasce** |
| Botão **"Ver na aba Conexões ›"** | não existe nesta aba — era proposta | *"Ver na aba Conexões ›, pode remover esse botão"* — **não nasce** |
| Frame **"Sessão"** + o glossário | `home_actions.py:2298-2330`, `_GLOSSARY` (`:246`) | o gesto vira o botão **Desligado** da fileira (ONDA-JOGAR-02); o glossário cita a aba Emulação, que morreu |
| **Descrição do modo** e **custo da máscara** como rótulo fixo | `_home_mode_desc` (`:2040`), `_home_flavor_custo` (`:2105`) | viram texto do `?` do quadro (D-TUDO-QUE-EXPLICA-VIRA-DICA) |

**A linha da pausa (`home_actions.py:216`, `texto_da_pausa`) NÃO sai** — é
diagnóstico vivo. Ela muda de lugar em ONDA-JOGAR-10.

## O que esta sprint entrega

1. **`app/actions/jogar/`, o pacote da aba.** `install_home_tab` passa a montar
   só o esqueleto e a delegar cada pedaço a um módulo. É o que permite às nove
   sprints seguintes correrem sem disputar `home_actions.py` — hoje um arquivo
   de **3369 linhas** onde toda a aba mora.

2. **`esqueleto.py` — os dois quadros com espaço RESERVADO.** P8: *widget que
   brota empurra a tira de abas para baixo; a solução é espaço reservado, não
   widget escondido.* Cada área nasce com a altura do seu pior caso e o
   conteúdo aparece dentro dela.

3. **Os seis módulos-esboço, com a costura já pronta.** Cada um expõe
   `montar(quadro, janela)` e `atualizar(janela, state)`, e nasce desenhando
   um espaço reservado vazio. As sprints 02, 04, 06, 07, 08 e 10 preenchem
   cada uma o SEU arquivo — nenhuma volta a `esqueleto.py`.

4. **A remoção da tabela acima**, com lápide datada só onde a regra pede
   (decisão medida leva data; texto que ela mandou sair, sai).

## Como se prova — o teste que MORDE

`tests/unit/test_jogar_a_tela_nao_pula.py`

- Monta a aba com `Gtk.OffscreenWindow` (COMO-OLHAR-A-TELA: sob Xvfb não há
  gerenciador de janelas e uma `Gtk.Window` fica 1x1 para sempre).
- Mede a altura pedida pela aba em **três estados**: mesa vazia · 1 controle ·
  2 controles com dois avisos ativos.
- **Exige que os três números sejam IGUAIS.** Arranque o espaço reservado de
  uma das áreas e o teste reprova — é a mordida.
- E exige que a soma caiba em **1180 px**, a altura com que a janela abre
  (dívida medida no P8: a fileira "Avançado" da Sistema soma 1230 px numa
  janela de 1180).

`tests/unit/test_jogar_o_que_saiu_nao_volta.py`

- Um caso por linha da tabela "O que SAI": monta a aba e afirma que o widget
  **não existe** e que a frase **não aparece** em nenhum rótulo.
- Morde porque cada caso reprova sozinho: devolva o `players_hint` e só ele
  fica vermelho, dizendo qual voltou.

## O que é dela decidir

1. O ícone `?` fica **ao lado do título do quadro** (P3: no GTK3 widget
   insensível não dispara tooltip, então a explicação não pode morar no widget
   apagado). Confirmar que dois `?` na aba inteira bastam, como no mockup.
2. Se a aba deve continuar chamando-se `tab_home_box` por dentro. O nome de
   tela é **Jogar** e está decidido; o id do Glade é custo de renomear.

## Fontes

- `novo-layout/01-jogar.html` — o mockup aprovado.
- `/tmp/coleta/hoje.md`, falas [30], [31], [33], [38].
- `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 1 e padrão P8.
