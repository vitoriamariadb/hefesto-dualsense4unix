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

## As da seção 2 — o medidor de rádio

**R1 — Um relatório consome um slot.** É a única conta que a palavra "derivado
da especificação" consegue defender. Não está escrito em lugar nenhum da árvore,
e por isso vai escrito na tela.

**R2 — As taxas são as do A/B de 25/07** (260,4 sem microfone; 170,5 de entrada
mais 106,2 de áudio com ele). Medir ao vivo não serve: o rádio não tem número
único — o envelope medido num dia inteiro vai de 157,8 a 402,9 Hz
(`docs/data/ensaios.csv:104`), e um medidor que oscilasse assim ensinaria a
desconfiar dele.

**R3 — Três palavras, duas cores: Folgada (verde) até 60 %, Apertada (laranja)
até 85 %, Cheia (laranja) acima.** Nunca vermelho. Rádio cheio é reversível —
basta tirar um controle do adaptador —, e vermelho nesta casa é para o que
destrói e não tem volta.

**R4 — "Com microfone" é só a ponte por HID**, nunca a placa USB: por rádio o
DualSense não publica placa ALSA nenhuma (medido em 15/08), e é a ponte que
custa rádio.

**R5 — O aceite fecha com o controle negativo.** Não há adaptador Bluetooth
nesta bancada — medido em 22/08, `/sys/class/bluetooth` vazio. Com todos os
controles no cabo, toda barra em zero é resultado válido e é o que a foto vai
mostrar. O ensaio com dongle fica registrado como pendente dela.

**R6 — A dependência dura do medidor é CONFIG-02, não CONFIG-03.** Ele não lê
nada do `maquina.json`. O índice diz o contrário e está errado.

## As da seção 3 — o orçamento

**O1 — A tabela só lista o que tem ponto de aplicação de verdade.** Hoje é a
vibração, que tem funil único (`core/rumble._effective_mult`). Uma linha
dizendo "limitado a 25 % pelo orçamento" sem ninguém limitar nada é a tela
mentindo — e é o defeito que esta leva inteira existe para não cometer. Cada
linha nova entra na leva que lhe der ponto de aplicação.

**O2 — O dono da escolha é o `machine.declare` de CONFIG-03.** Nada de handler
próprio: dois donos do mesmo valor é a classe de bug que a `ABAS-01` curou.

**O3 — O clique marca o rascunho; o efeito sai no "Aplicar".** É a D-A4, sem
exceção.

**O4 — A dica do Auto está errada e se substitui.** O desenho diz *"controle no
cabo joga em Máximo"*; o código, o rótulo e a dica do botão dizem, desde
11/08/2026, que o Auto **nunca amplifica** e lê só bateria. A escada real é
acima de 50 % → 100 %, de 20 a 50 % → 70 %, abaixo de 20 % → 30 %.

**O5 — Economia é 30 %, não 40 %.** O produto entrega 30 %
(`RUMBLE_POLICY_MULT`) e a tela de hoje já diz 30 % (`main.glade:1654`). O
desenho e o `TOOLTIPS.md` dizem 40 % em três lugares, e é neles que se corrige —
o número tem dono, e o dono é o código.

## As da seção 1 — os controles

**T1 — O modo é DEDUZIDO e mostrado, não declarado.** A dedução tem grau ALTA
em cinco dos sete pares modo-transporte
(`externos-firmware-e-modos.md:218-228`), e declarar colidiria com a leitura que
já existe.

**T2 — Um seletor de modo só, e ele herda a insensibilidade e a dica do que já
existe** na ficha do controle (*"a troca não é por software"*). Dois seletores
fariam a janela dizer duas coisas opostas sobre o mesmo fato.

**T3 — Quatro modos, não três:** D-input, X-input, Switch e macOS. O desenho
mostra três; a canônica lista quatro, e faltar um faz o card mentir sobre o
aparelho.

**T4 — "Tratar como modelo conhecido" fica FORA desta leva.** É máscara, e a
`ExternalMaskRegistry.set_mask` tem condição de retorno própria, fixada em
`MÁSCARA-01`. Ligar por atalho aqui seria furar aquela decisão de lado.

**T5 — A cor do plástico persiste no `maquina.json`.** O veto de 12/08 era
contra *arquivo por endereço*; a camada de máquina é um arquivo só, e é
exatamente o lugar que a D-A3 criou para isto.

**T6 — A leitura da cor por cabo entra no produto nesta leva.** Ela está provada
(ensaio E7) e vive fora do app, em `scripts/ensaios/`. Sem ela, toda linha
"Cor:" nasce em "não sei" — inclusive nos DualSense do cabo, que o desenho
mostra com a cor lida.

**T7 — Os cards ficam lado a lado, com altura igual.** A `EMPILHA-01` (decisão
dela, 02/08) é sobre os cards da aba Status e continua valendo lá. Este é outro
desenho, aprovado por ela depois — e a invariante de altura igual só existe
porque eles ficam lado a lado.
