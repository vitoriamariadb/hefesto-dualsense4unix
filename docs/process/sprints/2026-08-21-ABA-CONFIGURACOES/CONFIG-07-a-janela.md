# CONFIG-07 — a janela

**Depende de:** CONFIG-01. Independente das outras — pode correr em paralelo.

**Executada em 22/08/2026.** O que segue é o que ficou na árvore, não o plano.

## O que entrega

Seção 4 da aba (a última): ajustes do programa, não dos controles.

| Ajuste | O que ficou na tela |
|---|---|
| Tamanho do texto | Três degraus — Compacto, Normal, Grande. Grava no clique e a tela diz que vale ao reabrir |
| Ambiente da área de trabalho | Lido da sessão, mostrado numa linha, e corrigível em COSMIC / GNOME / Outro |
| Ícone na barra do sistema | O estado, e a instrução do que ligar quando ele não sobe |
| Ligar junto com o computador | Espelho do interruptor da aba Sistema, com atalho para lá |

## As quatro decisões que moldaram a seção

**J1 — o tamanho do texto grava e vale ao reabrir**, e a tela diz isso.
Reaplicar na hora exigiria desfazer o tema, e `theme.apply_theme` **compõe**:
quatro chamadas no mesmo processo levaram a fonte de 12,25 a 19 pontos, porque
ele soma ao `gtk-font-name` já posto e empilha provider sem nunca chamar
`remove_provider_for_screen`. Reescrever isso é outra leva. O clique aqui grava
e nada mais — e há teste que reprova se alguém acrescentar `apply_theme` ao
handler.

Os degraus vivem em `app/theme.py`, dono único da escala: `compacto` 0,
`normal` `ESCALA_PADRAO`, `grande` 6. Seis e não oito porque `ESCALA_MAXIMA` é
teto de segurança — acima dele a janela deixa de caber numa tela 1080p, e um
degrau colado no teto não tem folga. `degrau_da_escala(delta)` devolve o degrau
mais perto, para quem tem `5` gravado à mão ver um botão marcado em vez de uma
fileira em branco.

**J2 — não existe caixa de ligar/desligar o ícone da barra.** Não há o que ela
ligaria: a `AppTray` é sempre construída e nenhuma chave a desliga. A caixa
seria decoração — e desligar a bandeja sem ensinar `_has_persistent_access`
esconderia a janela sem caminho de volta. No lugar dela, a seção mostra o
**estado** e, quando o ícone não sobe, a **instrução que hoje falta**: é a
entrega real desta parte.

**J3 — "Ligar junto com o computador" é espelho, não um segundo dono.** O
interruptor de verdade vive na aba Sistema, sob `_daemon_autostart_guard`. Aqui
é um rótulo que segue o original por `notify::active`, mais o botão "Abrir a
aba Sistema", que acha a página pelo id do Glade e nunca pelo número (EST-10).
Dois donos do mesmo gesto é a cicatriz que a casa já pagou uma vez.

**J4 — o ambiente é rótulo visível mais seletor corrigível**, e **informa só a
mensagem, nunca o comportamento**. Corrigir para GNOME numa sessão COSMIC não
muda uma linha do que o produto faz: muda o que a seção sabe recomendar quando
o ícone não sobe. A linha "Detectado:" continua contando o que a **sessão**
declarou — reescrevê-la com a correção apagaria justamente a discordância que
motivou a correção.

## O aceite COSMIC / GNOME

É esta sprint que carrega o requisito dos dois ambientes, e **não há GNOME
nesta bancada** — ela roda COSMIC. Foi o que decidiu o desenho: a escolha da
frase saiu do widget e virou `mensagem_da_bandeja(ambiente, watcher_presente)`
em `app/ambiente.py`, uma função pura com os quatro casos travados por teste.
O aceite fecha sem depender de um computador que ninguém aqui tem.

`XDG_CURRENT_DESKTOP` vem **vazia** em toda sessão headless e **composta** em
Pop!_OS (`pop:GNOME`), então `ambiente_normalizado` casa por substring, sem
diferenciar maiúscula, sobre as duas variáveis da sessão. Um `==` classificaria
o Pop!_OS como "outro" e a instrução da extensão nunca apareceria justamente
para quem precisa dela. COSMIC é conferido primeiro: uma sessão COSMIC pode
carregar `GNOME` na lista, e a recíproca não acontece.

A sonda (`statusnotifierwatcher_available`) é síncrona e fala D-Bus com dois
segundos de teto: vai por `run_in_thread`, e o callback devolve `False` porque
`GLib.idle_add` reagenda para sempre quem devolve `True`.

**Aceite, e como cada parte foi verificada:** a aba abre com
`XDG_CURRENT_DESKTOP` vazia (teste, com as duas variáveis apagadas); num GNOME
sem a extensão a seção mostra a instrução com o id literal
`ubuntu-appindicators@ubuntu.com` (teste, pelos quatro casos da função pura e
pela correção manual do ambiente na tela montada); e nenhuma escolha da seção é
um `GtkComboBox`, cujo popup o cosmic-comp fecha no clique.

## O que a execução descobriu

**O `SegmentedSelector` sem `wrap` é um `Gtk.Box` VERTICAL** e empilha as
opções uma sobre a outra. Não é defeito desta seção: é como
"Sons do jogo / Todo o som do PC" aparece hoje em
`docs/usage/assets/readme_status.png`. Quem quer a fileira deitada pede
`wrap=True`, que é a grade de três colunas fixas — e com exatamente três
opções ela vira uma linha só. As duas fileiras desta seção têm três opções.

**No Pango, `>` passa cru, mas `&` e `<` não.** Medido: o rótulo com markup
fica **em branco** e o erro só aparece no log. Por isso o texto da bandeja
entra escapado, ainda que a frase de hoje não tenha nenhum dos dois.

## O que ficou de fora, e por quê

- **A caixa "Mostrar ícone na barra do sistema"** (J2). Ela está no desenho e
  não tem backend nenhum atrás.
- **Reaplicar a escala na hora** (J1). Exige um `reaplicar_escala` que guarde o
  provider, chame `Gtk.StyleContext.remove_provider_for_screen`, reponha o
  `gtk-font-name` original e zere o cache da sessão. É sprint própria.
- **A aba nos dois mapas de `app.py`** (`_REFRESH_POR_ABA` e o teto elástico) e
  a frase "ainda vazias" de `retratar_abas.py`. São arquivos compartilhados
  pela leva inteira e ficaram para quem costura as sprints. Sem a entrada de
  refresh, o ambiente e a bandeja são lidos na montagem da aba e não de novo a
  cada entrada — o que muda por fora da janela nesse intervalo é a resposta da
  sonda, e ela só muda quando a pessoa liga a extensão ou o applet, que é
  justamente quando ela vai reabrir o Hefesto para conferir.

## Onde está

| Arquivo | O que ganhou |
|---|---|
| `app/ambiente.py` | Novo. Leitura, normalização, correção e a frase da bandeja |
| `app/actions/config/secao_janela.py` | A seção inteira, montada em código |
| `app/theme.py` | Os três degraus, `degrau_da_escala` e `escala_gravada` |
| `app/gui_prefs.py` | A chave da correção de ambiente |
| `tests/unit/test_config_a_janela_le_o_ambiente.py` | As decisões, sem GTK |
| `tests/unit/test_config_a_janela_na_tela.py` | A fiação, com GTK real |
