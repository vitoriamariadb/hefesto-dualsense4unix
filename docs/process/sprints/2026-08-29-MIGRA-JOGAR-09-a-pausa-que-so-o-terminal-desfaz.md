---
sprint: MIGRA-JOGAR-09
onda: MIGRA-JOGAR
posse:
  J9:
    - src/hefesto_dualsense4unix/app/actions/jogar/pausa.py
cria:
  - src/hefesto_dualsense4unix/app/actions/jogar/pausa.py
  - tests/unit/test_migra_jogar_09_a_pausa_se_desfaz_na_janela.py
bancada: false
depois_de:
  - ONDA-JOGAR-01
  - ONDA-JOGAR-10
  - MIGRA-JOGAR-03   # o botão de despausar não existe no desenho: a 03 lhe dá endereço
  - MIGRA-JOGAR-04   # a 04 cria o pacote `app/actions/jogar/`
  - MIGRA-JOGAR-05   # o texto da pausa é um dos doze avisos que a 05 colhe
nao_toca:
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/utils/session.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - novo-layout/
---

# MIGRA JOGAR · 09 — a pausa que só o terminal desfaz

**O defeito, medido:** o Hefesto pode ficar pausado, a janela **diz** que está
pausado, e **não há como despausar pela janela**.

- a rota existe: `daemon/ipc_server.py:121` — `"daemon.resume":
  self._handle_daemon_resume`, atendida em `daemon/ipc_handlers.py:2293`;
- **zero chamadores em `src/hefesto_dualsense4unix/app/`.** Os únicos chamadores
  são a CLI (`cli/app.py:419-421`) e um conselho de texto no doutor
  (`cli/cmd_doctor.py:69`: *"'daemon resume' p/ retomar"*);
- a janela **já lê** o estado: `app/actions/home_actions.py:216`
  (`texto_da_pausa`);
- e a pausa **sobrevive ao reboot**: `utils/session.py:162` grava
  `paused.flag`, e `daemon/lifecycle.py:768-770` faz o daemon **nascer pausado**
  com o que estava em disco.

Junte as quatro: alguém pausa uma vez, fecha tudo, liga a máquina no dia
seguinte, o controle não responde, a janela explica **por quê** e **não oferece
saída**. A saída é abrir um terminal — que é a coisa que esta casa decidiu que a
usuária não precisa fazer.

**É a forma canônica do defeito mais caro daqui: a cura escrita e nunca ligada.**

## O que entrega

1. **O despausar chega à janela.** Um gesto, `daemon.resume`, e a janela relê o
   estado depois. Nada de rota nova, nada de flag nova.
2. **O botão nasce SÓ no estado que ele resolve.** Pausado, ele aparece; não
   pausado, não existe. É o mesmo princípio do *"Corrigir modo de execução"* da
   aba Sistema, e o mesmo que a `ONDA-SISTEMA-02` aplicou ao autoteste do gamepad
   virtual: **o botão do conserto só nasce no estado que o conserto resolve.**
3. **Ele mora ao lado da explicação.** O texto que diz *o que está acontecendo* é
   `texto_da_pausa`, e ele é um dos doze avisos que a MIGRA-JOGAR-05 colhe para a
   coluna Atenção. O botão nasce **naquela linha** — explicação e saída no mesmo
   lugar, que é a regra de diagnóstico desta casa: *toda frase diz o quê, por quê
   e o que fazer.*
4. **Não se inventa o pausar.** O desenho não tem botão de pausar, e **não
   inventar feature vale nos dois sentidos**. Se ela quiser o par, é sprint nova.

## O endereço não existe no desenho, e isso está declarado

`novo-layout/01-jogar.html` **não desenha** botão de despausar. A MIGRA-JOGAR-03
lhe dá endereço (`#jg-despausar`) dentro da linha do aviso, no mesmo molde
`#jg-modelo-aviso`, para não abrir uma forma nova de botão numa janela que já
custou uma sprint inteira para ter **uma altura por família**
(`01-jogar.html:454-471`).

**Nada disso substitui o olho dela** — `PROVA-DE-TELA-01`: foto antes e depois,
e a palavra final é dela.

## Como se prova (a mordida)

`tests/unit/test_migra_jogar_09_a_pausa_se_desfaz_na_janela.py`:

- **o botão só existe pausado.** `state_full.paused = True` → `#jg-despausar`
  na página; `False` → ausente. **A mordida:** deixe-o sempre visível — o teste
  reprova, e a janela volta a oferecer um conserto para um estado são;
- **o clique chama `daemon.resume`.** Dublê de IPC que registra as chamadas.
  **A mordida:** troque por qualquer outra rota — o teste reprova nomeando o
  método. Hoje esta chamada tem **zero** ocorrências em `app/`, e este é o teste
  que a torna obrigatória;
- **a tela acompanha, e não adivinha.** Depois do clique, a janela **relê** o
  estado; a linha de aviso e o botão só somem quando o daemon confirma.
  **A mordida:** esconda o botão no clique, antes da confirmação — o teste
  reprova no cenário em que o `resume` **falha**, que é onde a tela mentiria. É a
  mesma regra do `O-PRODUTO-RESPONDE-PELO-TRANSPORTE-E-NAO-PELO-EFEITO`:
  ausência de notícia não é sucesso;
- **a régua roda o tique mais de uma vez.** A pausa pode voltar por fora (a CLI,
  outro caminho); o botão tem de reaparecer no tique seguinte. Uma régua que roda
  o tique uma vez mede um instante, não um comportamento — a lição das seis
  réguas falsas de 29/08;
- **a pausa em disco não é apagada por esta sprint.** Nada aqui escreve
  `paused.flag` diretamente: quem grava é o daemon, e duplicar essa escrita
  criaria dois donos para o mesmo byte. **A mordida:** grave o flag pela janela
  — o teste reprova.

## O que é dela decidir

1. **O botão se chama como?** Três sprints já o batizaram de três jeitos —
   *"Continuar"* (a antiga JOGAR-10), *"Retomar"* (SISTEMA-01) e um gesto na
   Navegação. **Um botão, três nomes**, e está registrado em
   `docs/process/SPRINT_ORDER.md` §0.2.
2. **Onde ele mora — só na Jogar, ou também na Sistema?** Se em duas, o rótulo
   precisa de um dono só, como o `_MODE_ITEMS` já tem.
3. **Entra um botão de PAUSAR também?** O desenho não o tem, e esta sprint não o
   cria.
