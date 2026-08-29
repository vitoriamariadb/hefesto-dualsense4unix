---
sprint: MIGRA-SISTEMA-05
# onda: MIGRA-SISTEMA (a aba 09, no motor novo)
posse:
  M5:
    - src/hefesto_dualsense4unix/app/actions/daemon_actions.py
cria:
  - tests/unit/test_migra_sistema_05_o_exame_na_pagina.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-PILOTO
  - MIGRA-MOLDURA-01
  - MIGRA-SISTEMA-01
  - MIGRA-SISTEMA-02
  - MIGRA-SISTEMA-03
  - MIGRA-SISTEMA-04
  # A 03 daquela onda é BACKEND PURO e SOBREVIVE INTACTA à troca de motor
  # (`nao_toca: app/`). Esta sprint CONSOME o que ela entrega; não a reescreve.
  - ONDA-SISTEMA-03
  # SÉRIE, por R5: dividem `daemon_actions.py` com esta.
  - ONDA-SISTEMA-01
  - ONDA-SISTEMA-02
  - ONDA-SISTEMA-04
  - ONDA-SISTEMA-05
  - ONDA-SISTEMA-06
  - ONDA-SISTEMA-07
  # SÉRIE: também reivindica `daemon_actions.py`.
  - LEVA-1
nao_toca:
  - src/hefesto_dualsense4unix/integrations/storm_doctor.py
  - src/hefesto_dualsense4unix/cli/
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/gui/main.glade
  - novo-layout/
---

# MIGRA SISTEMA · 05 — O exame chega em quatro partes, e a contagem é derivada

**O defeito, em duas partes:**

**(a) O exame inteiro é UM rótulo.** `_refresh_storm_diag:1109` monta uma
string de markup com todas as linhas e a joga num `GtkLabel` só
(`_apply_storm_diag:1166` → `storm_diag_label`). A tela nova tem **uma linha por
achado**, com selo, veredito curto e um `?` que abre *o que eu vi / por que
importa / o que fazer*. Uma string única não tem por onde ser fatiada sem
expressão regular sobre texto que ela vai ler.

**(b) A contagem está DIGITADA no lugar errado da conta.** O gerador acerta —
ele escreve `{len(ACHADOS)} linhas` (`aba09.py:582`), lendo a própria lista.
Mas o **produto** não tem essa lista: quem vier ligar isto pode digitar `8`, e
aí a tela passa a afirmar oito quando o exame devolveu seis. **O exame varia de
6 a 8 hoje** — `storm_report` devolve seis fixos e as duas condicionais
(`medir_guarda_do_steam_input:735`, `medir_prontuario_dos_jogos:807`) devolvem
`None` quando não há divergência. **O mockup congelou em oito.**

E `· nenhum aviso` é a mesma armadilha com outra roupa: qualquer `check_*` pode
devolver `WARN`, e a frase está escrita como se nunca fosse acontecer.

## O que entrega

1. **A lista chega à página como lista.** A ponte de leitura da
   MIGRA-SISTEMA-03 passa a receber `list[LinhaDeSaude]` (a dataclass de quatro
   campos que a `ONDA-SISTEMA-03` cria) e a página a desenha. **O Python não
   monta HTML de achado**: ele manda os campos; o desenho é da página. Misturar
   os dois é o começo do gerador de GTK que esta rota veio substituir.
2. **As duas condicionais aprendem a falar em quatro partes.** Elas moram em
   `daemon_actions.py` — dentro desta posse, e **fora** da posse da
   `ONDA-SISTEMA-03`. É esta sprint que as converte.
3. **A contagem é derivada, e o texto ao lado dela também.** `N linhas` sai de
   `len(achados)`; `nenhum aviso` / `1 aviso` / `N avisos` sai de contar os que
   têm selo `WARN`. **Nenhum dos dois se digita.**
4. **A ordem dos achados tem dono.** Hoje ela é a ordem do `storm_report` mais o
   que a GUI anexa no fim (`:1136` e `:1145`). A tela quebra em duas colunas por
   `MEIO = len//2 + len%2`: com número ímpar a coluna da esquerda fica com uma a
   mais. Declare a ordem (avisos primeiro? a ordem do exame?) — **e não a deixe
   nascer do acaso da anexação**.
5. **A moldura aguenta 6 e 9.** `aba09.py:38` grava `MIOLO_H, ALTURA = 542,
   540`: **dois pixels de folga**, e cada linha de achado custa **25,5px**
   (`.saude{height:25.5px}`, `aba09.py:308`). Duas linhas a mais numa coluna e o
   miolo volta a rolar por dentro — que é o defeito de 93px que a rodada de
   28/08 acabou de curar. **A entrega inclui a foto nos três tamanhos: 6, 8 e 9
   achados.** Se 9 não couber, isso é fato para ela, não para esconder.

## Como se prova (a mordida)

`tests/unit/test_migra_sistema_05_o_exame_na_pagina.py`:

- **a contagem acompanha.** Dublê que devolve 6, 7, 8 e 9 achados: o JS emitido
  diz o número certo nos quatro. **Digite `8` na ponte e veja reprovar em três
  dos quatro casos** — é a mordida, e ela é o motivo desta sprint existir;
- **`nenhum aviso` vira `2 avisos` quando dois achados são `WARN`.** Arranque a
  contagem de avisos e veja reprovar;
- **cada achado chega com os quatro campos separados.** O JS emitido tem
  veredito **e** dica, e a dica tem as três partes. Junte-os de novo numa string
  só e veja reprovar;
- **as duas condicionais somem quando devem sumir.** Sem divergência,
  `medir_guarda_do_steam_input` e `medir_prontuario_dos_jogos` devolvem `None` e
  a lista tem **seis**. Force a lista a ter sempre oito e veja reprovar;
- **o `PREFIXO_DA_CURA` não aparece duas vezes.** Ele marca o conserto **dentro**
  da frase hoje (`storm_doctor.py:41`); com o campo `o_que_fazer` separado, a
  frase não pode continuar carregando o prefixo. Reponha-o e veja reprovar;
- **a foto, e ela é da bancada de quem coordena.** `retratar_abas.py`, fora da
  árvore de agente, com 6, 8 e 9 achados. **A régua da foto mede a caixa, não a
  conta a partir do CSS** — e não usa `scrollIntoViewIfNeeded` antes de medir.

## O que é dela decidir

- **AS TRÊS LINHAS DO EXAME QUE O MOCKUP APAGOU.** `check_snd_quirk:560` (a cura
  do travamento do USB), `check_quirk:364` (o quirk `054c:0ce6`) e
  `check_wireplumber:509` **rodam hoje** e não estão entre os oito achados do
  desenho. **Saem de vez, ou voltam como 9ª/10ª/11ª linha?** Não é redação: com
  três a mais a aba volta a esconder conteúdo, que é o defeito que esta rodada
  curou. **Opções:** (a) saem, e o `storm_report` da GUI passa a filtrar — o
  terminal continua mostrando as três; (b) voltam, e o miolo é remedido; (c)
  voltam **só quando dão WARN** — o exame calaria sobre o que está bem, que é o
  que o desenho já faz com as duas condicionais.
- **A ordem dos achados.** Avisos no topo é o que uma pessoa procura; a ordem do
  exame é o que o terminal já mostra. As duas são defensáveis, e a escolha muda
  o que ela vê primeiro.
