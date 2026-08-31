# A lista dela — 31/08/2026, 20h

**Como esta lista funciona, e é ordem dela:**

> *"não é pra vc fazer. faz uma to do list pro claude e pra ele ir fazendo ponto
> a ponto comigo. Eu ir dando o ok quando ele terminar nos mockups e ele ir me
> mostrando a to do list atualizada. pra ser feito na pasta de mockups. (…)
> Quero essa lista e quero que ele faça isso **sem usar agentes** e **usando o
> navegador**."*

## As regras desta lista

1. **UM ponto por vez.** Termine, mostre, espere o OK dela. Só então o próximo.
2. **SEM AGENTES.** Este trabalho é para ser feito à mão, por quem conversa com
   ela. Despachar agente aqui é desobedecer.
3. **COM O NAVEGADOR.** Abra a página, olhe, clique, meça. `olhar.py` fotografa
   em Chrome headless (`cd layout/_ferramentas && python3 olhar.py NN-*.html`) —
   e a foto é para VOCÊ ler, não só para gerar. **Nunca abra janela na frente
   dela: ela tem UMA tela.**
4. **A cada ponto entregue, mostre ESTA LISTA atualizada** — com o que fechou,
   o que falta, e o que mudou de entendimento no caminho.
5. Marque `[x]` só depois do OK **dela**, nunca depois do seu próprio verde.

---

## PONTO 0 — resolver ANTES de tocar em qualquer coisa

Ela disse *"pra ser feito na pasta de mockups"*. Mas a `mockup/` nasceu hoje,
uma hora antes, como **fotografia congelada do que ela aprovou** — escrita só
pelo `scripts/check_o_desenho_aprovado.py --aprovar`, e o portão
`desenho-aprovado` reprova quem a editar à mão.

**As duas leituras, e ela decide:**

- **(a) o desenho muda primeiro, e depois vira produto** — a `mockup/` é onde se
  desenha, ela aprova, e o `layout/` recebe. É o fluxo natural de quem desenha,
  e **inverte** o `--aprovar`, que hoje copia `layout/` → `mockup/`.
- **(b) "pasta de mockups" quer dizer o mockup em geral** — o trabalho é nos
  geradores `layout/_ferramentas/abaNN.py`, e a `mockup/` continua sendo a
  fotografia do que ela já aprovou.

**Não adivinhe. Pergunte a ela em uma frase e siga.** Se for (a), o
`--aprovar` precisa de um irmão (`--publicar`, que leva `mockup/` → `layout/`),
e isso é uma linha no script.

- [ ] **0.** Perguntar a ela: o trabalho é em `mockup/` ou nos geradores?

---

## OS SETE PONTOS

### [ ] 1. O Point And Click sai da fileira de modos

> *"nos mockups tira o point and click e deixa só o navegação."*

**Onde:** aba **Jogar** — a fileira dos cinco modos dentro do Hefesto Ligado.
Hoje: `dualsense · xbox · steam · pointclick · navegacao`.

**O que muda:** a fileira passa a ter **quatro**. O `Point And Click` era o único
chip marcado `sem_dono` (borda tracejada) — ele não é degrau da
`ponte_escada.ESCADA` nem modo do `mode_transition.MODES`.

**Atenção — isto reabre uma decisão dela de hoje de manhã**, quando ela disse
*"Temos esse modo pro user configurar e a bridge do PS+R3 traz esse perfil também
pra ser corrido"*. **Confirme com ela** que o modo sai da TELA (e o perfil
`point_and_click.json` continua existindo), ou se sai de vez.

**Fonte:** `layout/_ferramentas/aba01.py`, lista `MODOS`.
**Toca também:** `src/.../app/actions/jogar/painel.py` (`CHIPS_DA_ESCADA`), e o
teste `tests/unit/test_o_botao_de_ligar_funciona_e_se_lembra.py` conta os chips.

---

### [ ] 2. Os campos que expandem não têm respiro

> *"o nome dos campos que expandem não tem respiro isso todas as abas que tem
> esses campos que expandem."*

**Onde:** os acordeões `▸ Check-up`, `▸ Gestão Controles`, `▸ Rádio e
adaptadores` — e **todas as abas que tenham campo desse tipo**. Ela mandou
duas fotos da aba **Conexões** (fechados e abertos) mostrando o aperto.

**O que é:** o rótulo do acordeão está colado na borda da faixa. Falta padding
vertical — o mesmo defeito que a aba Vibração teve hoje (`--r-ar`, divisória com
`top:0`), e a cura de lá é o precedente.

**Faça o CENSO primeiro:** varra as dez abas e liste toda faixa que expande,
com a folga medida acima e abaixo do rótulo. A cura tem de ser **uma variável no
`topo.html`**, não conserto por aba — senão a próxima aba nasce apertada.

---

### [ ] 3. "Ajustes vão para:" vira "Selecione", e só acende com controle

> *"Ajustes vão para: aqui vamos mudar para **Selecione**. E ele só fica ativo se
> surgir Controle naquela área. Enquanto não surgir controle ele fica desligado
> sem texto e sem identificado. Aí conectou ele reconhece."*

**Onde:** a fita do topo, em **todas as dez abas** (`topo.html`).

**Três mudanças:**
1. o rótulo `Ajustes vão para:` vira **`Selecione`**;
2. **sem controle na área:** a fita nasce **desligada, sem texto e sem
   identificação** — nada de `P1 · Cosmic Red · USB` inventado;
3. **conectou:** a fita reconhece e mostra o controle.

**Isto tem estado**, e o mockup é estático — então o desenho precisa mostrar
**os dois estados**: vazio/desligado e com controle. Combine com ela como
mostrar (uma aba de exemplo com a fita vazia? um bloco lado a lado no rodapé?).

---

### [ ] 4. Aba Controles: o "Desligado" sai, os dois botões descem

> *"na aba controle, remove o desligado (fica desligado com slicer no zero). Os 2
> botões ficam abaixo do slicer."*

**A minha leitura, e CONFIRME antes de mexer:** no bloco do **Microfone** da aba
Controles há a fileira `ATIVO · Virtual · Desativado · Nativo`. O `Desativado`
sai, porque **arrastar o slider até zero já é desligar**. E os dois botões do
**Alto-falante** (`Sons do jogo` / `Todo o som do PC`) passam a ficar **abaixo**
do slider, não ao lado.

Pode ser que ela se refira a outro par de botões. **Pergunte, com a foto na mão.**

---

### [ ] 5. A ordem dos campos segue os controles conectados

> *"a ordem dos campos expandidos vão de acordo com a ordem dos controles
> conectados. O que não tiver conectado não aparece ali."*

**O que muda:** os blocos que hoje aparecem numa ordem fixa passam a nascer **na
ordem em que os controles estão conectados**, e **controle desconectado não
aparece**.

Hoje o mockup desenha sempre P1·P2·P3·P4. Com quatro na mesa isso coincide — com
dois, sobra desenho de controle que não existe. É a mesma família do defeito que
a régua de tela pegou em 30/08, quando ela clicava o `.ctl[1]` e a mesa tinha um
controle só.

**Junta com o ponto 3:** os dois são "a tela mostra o que está lá, não o que
poderia estar".

---

### [ ] 6. As bordas das três tabelas continuam sobrando

> *"as bordas das 3 paginas de tabelas gatilhos iluminação e vibração tao
> sobrando de um jeito feio e tão sem dar respiro."*

**Onde:** **Gatilhos**, **Iluminação**, **Vibração** — as três de tabela.

**Atenção, e é o ponto delicado:** hoje já houve uma leva de bordas nessas três
(`--linha:#53576f`, contraste 2,01:1, cinco bordas duplicadas eliminadas, −31%
na Iluminação). **Ela olhou depois disso e ainda acha feio.** Então a cura de
hoje não resolveu — não repita a mesma abordagem.

**Meça o que sobrou** antes de propor: quais bordas ainda estão lá, quais são
estruturais e quais são de estado, e onde falta respiro (que é assunto do ponto
2, e pode ser a mesma causa). **Mostre a ela uma proposta em foto antes de
aplicar nas três.**

---

### [ ] 7. Perfil de Bateria vira três botões

> *"perfil da bateria transforma em três botões lado a lado com escolha única e
> tira o 'O perfil da mesa' pronto isso resolve."*

**Onde:** aba **Sistema**, o bloco `Perfil de Bateria` (ela circulou de verde).

**O que muda:**
- o dropdown `Tudo ligado` vira **três botões lado a lado**, escolha única —
  a mesma gramática do `.seg` que a aba Vibração já usa
  (`Economia · Balanceado · Máximo · Auto`);
- o rótulo **`O perfil da mesa` sai**.

**Cuidado com a altura:** este bloco ganhou hoje um portão no gerador que reprova
quando ele e o bloco `O serviço` deixam de acabar no mesmo y. Rode o gerador e
obedeça ao que ele disser.

**Os três nomes** saem de `RUMBLE_POLICY_MULT` / `PERFIL_BATERIA_LONGA` no
produto — **não invente rótulo**, leia de lá.

---

## O que já está fechado, e não se reabre sem ela

Estes vieram do olho dela **hoje** e estão no mockup. Não desfaça sem ordem:

- o `Automático` fora da escada · os algarismos fora dos modos
- `Os controles da mesa` → **Conectados**
- o interruptor Hefesto **fora** de "Quando o jogo abrir"
- a aba Sistema diz **serviço**, e o verbo é **Parar**
- os glifos **L2** e **R2** de volta na Gatilhos
- o botão **Liberar** do microfone fora da tela nova

## Onde olhar antes de começar

| | |
|---|---|
| o contrato da casa | `CLAUDE.md` |
| como fotografar sem atrapalhar ela | `docs/process/COMO-OLHAR-A-TELA.md` |
| o que aconteceu hoje | `docs/process/2026-08-31-O-HANDOFF-*.md` |
| as duas pastas | `mockup/LEIA-PRIMEIRO.md` |
