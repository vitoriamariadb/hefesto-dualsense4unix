# As decisões que a execução exigiu — 22/08/2026

As cinco decisões de doutrina foram respondidas em 21/08 e estão em
[`DECISOES-ABERTAS.md`](DECISOES-ABERTAS.md). Este arquivo é outro: são as
**vinte e uma perguntas que o reconhecimento levantou ao abrir o código**, cada
uma decidida para a leva poder correr sem parar a cada dúvida.

Elas não reabrem nada do que foi decidido em 21/08. Onde uma delas contradiz o
roteiro ou o desenho, o motivo está escrito — quase sempre uma medição feita
nesta bancada que a bancada do roteiro não tinha.

## As de forma, que valem para as cinco seções

**F1 — Todo widget nasce em código, no pacote `app/actions/config/`.** O Glade
segue reservando só o container. A alternativa (declarar no XML) recriaria num
arquivo só a colisão que o pacote acabou de desfazer.

O preço é real e conhecido: `validar-palavra-de-tela.py` e
`test_layout_orcamento_altura.py` só enxergam o `main.glade`, então o texto
desta aba nasceria fora do alcance dos dois. **Pago com portão novo**, e não
com promessa: `test_config_a_palavra_de_tela_da_aba_montada.py` monta a aba de
verdade, anda a árvore de widgets e aplica as regras do validador — importadas
dele, nunca copiadas.

**F2 — A cor de "atenção" é laranja `@orange`, não amarelo.** Os documentos da
leva dizem amarelo; o `theme.css:13` fixa *"VERDE confirma, LARANJA alerta,
VERMELHO destrói, CIANO informa"* e o `daemon_actions.py:754` já pinta `[WARN]`
de laranja **nesta mesma janela**. Duas palavras para a mesma cor é dívida de
tela; a do tema vence, e os documentos da leva foram corrigidos.

**F3 — Onde não há fonte, a coluna não existe.** Nada de campo mostrando "não
sei" em todas as linhas para honrar um desenho: coluna vazia em toda linha é
ruído que ensina a ignorar a tabela. Ela volta no dia em que houver medição.

**F4 — Toda leitura de `/sys` entra por argumento com default do sistema real.**
Nunca por constante de módulo, que o `CANARIO-FS-01` pega. É o que permite ao
retrato injetar uma bancada falsa em vez de fotografar a máquina dela.

**F5 — A foto nunca publica dado vivo.** `retratar_abas.py` alimenta a aba com
dublês. Uma seção que leia a máquina de verdade dentro do retrato põe endereço
de rádio dela num PNG versionado, e nenhum portão de anonimato varre imagem.

## As da seção 2 — A mesa

**M1 — O nome do adaptador é a identidade física**, nunca `hciN`, que inverte
entre boots: VID:PID + barramento + porta + painel.

**M2 — O painel tem sete valores, não três.** O roteiro diz `front/back/unknown`
e o kernel entrega também `top/bottom/left/right` — esta bancada mede `right`.
Os rótulos: Frente, Trás, Esquerda, Direita, Cima, Baixo, e ausência é
"Não sei".

**M3 — A coluna "Firmware" sai** (F3: não há check por adaptador em lugar
nenhum). **A coluna "Em uso" sai da tabela** e vira o medidor de CONFIG-04, que
é onde ela tem procedência.

**M4 — Os controles não são rádios concorrentes.** A regra do roteiro
("dispositivo USB que não é hub e não é o adaptador") lista os dois DualSense
do cabo como interferência — o produto acusando os próprios controles. Filtra
por VID conhecido de controle.

**M5 — Sem adaptador nenhum, a seção diz isso em uma linha** e não mostra
tabela vazia. É o caso REAL desta bancada hoje, e o desenho não o previu.

## As da seção 3 — a camada de máquina

**C1 — A recusa é `{"ok": False, "reason": "<chave>"}`**, com a frase de tela
do lado da GUI. Espelha `identity.number.set`, que já existe.

**C2 — `cor` é texto livre.** A tela oferece os seis nomes de fábrica e o campo
"Outra", como no desenho.

**C3 — `tipo` de rádio tem sete estados:** wifi, teclado, mouse, webcam,
caixa de som, outro (com campo livre), e ausente = não sei. O mockup se
contradizia entre duas linhas; esta é a união das duas.

**C4 — A declaração pendente mora na base `WidgetAccessMixin`**, junto de
`_escolha_pendente`, porque dois mixins a tocam.

**C5 — Entrar na aba relê o disco.** A montagem é idempotente por processo;
separar leitura de montagem custa pouco e evita a aba mentir depois de uma
edição por fora.

**C6 — CONFIG-03 corre junto de CONFIG-02, não depois.** O schema não precisa de
sysfs, e quatro sprints esperam por ele.

## As da seção 5 — a janela

**J1 — O tamanho do texto grava e vale ao reabrir**, e a tela diz isso.
`apply_theme` COMPÕE — quatro chamadas no mesmo processo levaram a fonte de
12,25 a 19 pontos — e não sabe se desfazer. Aplicar na hora exigiria reescrever
o tema, que é outra leva.

**J2 — Não existe caixa de ligar/desligar a bandeja.** Não há backend: a
`AppTray` é sempre construída, e não há chave que alguém leia. Criar a caixa
seria decoração. A seção mostra o **estado** e, quando o ícone não sobe, a
instrução que hoje falta — que é a entrega real desta parte.

**J3 — "Ligar junto com o computador" é espelho, não editável**, com link para
a aba Sistema. O desenho mostra editável; dois donos do mesmo gesto é cicatriz
conhecida desta casa.

**J4 — O ambiente é rótulo visível mais seletor corrigível** (COSMIC / GNOME /
Outro), como no desenho — e informa só a mensagem de ajuda, nunca o
comportamento.

## As da seção 0 — o exame

**E1 — São cinco linhas, não seis.** "Firmware dos adaptadores" sai por F3:
`grep firmware scripts/doctor.sh` não devolve check nenhum por adaptador.

**E2 — O selo é o sinal de conferido colorido**, sem badge circular. O GTK3 não
tem badge, e desenhar um seria widget novo por estética. O pedido dela era
*"ficando verde com um check"* — o check é o que importa.

**E3 — Selo verde nunca convive com linha vermelha.** Está escrito em
`doctor.sh:1586-1590`, e a casa já pagou duas vezes em agosto: *"o dano não é
errar um diagnóstico: é a tela ensinar que verde-e-vermelho juntos são
normais"*. Vermelho em qualquer linha derruba o selo.

**E4 — O exame nunca ecoa mensagem do doctor na tela.** Elas carregam `sudo` e
carregam MAC. O exame traduz para consequência, ou cala.

**E5 — Duas telas de saúde coexistem, com escopos declarados.** A da aba
Sistema é do Hefesto; esta é da mesa (portas e rádio). Nada se move de aba (D3).

**E6 — O exame roda ao ENTRAR na aba e no botão** — nunca no arranque da
janela, que é o caminho por onde o retrato passa.
