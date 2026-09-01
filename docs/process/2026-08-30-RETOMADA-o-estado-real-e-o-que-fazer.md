---
cria: nenhum módulo — este documento entrega o bastão
---

# RETOMADA — o estado real, os erros pagos, e o que fazer

**30/08/2026, 01h.** Escrito a pedido dela, para **outro Claude com contexto
zerado** assumir como PO e orquestrador.

> *"materializa tudo isso em sprints pra outro Claude com contexto zerado seguir
> como PO e como orquestrador."*

**Leia as §1, §2 e §3 antes de qualquer comando.** São dez minutos e evitam
repetir o que já custou caro a ela.

---

## 1. AS SETE REGRAS QUE ELA FIXOU, e cada uma nasceu de um estrago

Não são preferências. Sete coisas quebraram hoje por não existirem antes.

1. **`novo-layout/` é a REFERÊNCIA dela. Nenhum agente escreve lá.**
   Ela desenha ali, e a pasta está fora do git **de propósito** — palavra dela:
   *"não tava trackeado por um motivo ÓBVIO: é só pra referência do
   desenvolvimento."* O produto lê de **`layout/`**, que é versionado.
   **O que custou:** a interface carregava `layout/02-controles.html`
   direto, e toda leva que "ligava" uma aba editava a especificação junto com o
   produto. Um SVG que ela acabara de desenhar foi sobrescrito e ela **teve de
   refazer do zero**. Um botão inventado entrou na "especificação".

2. **Botão sem dono no produto não vai para a tela.**
   Ela viu: *"esse botão liberar no microfone não existe."* Se o desenho pede uma
   ação que o produto não tem, relate a lacuna — não desenhe o botão travado.

   **FATO ERRADO, SUBSTITUÍDO em 31/08/2026.** Esta linha dizia que o "Liberar"
   **"não existe em lugar nenhum"**, e isso é falso: `app/widgets/controller_card.py:490`
   define `TEXTO_BOTAO_MIC_DEVOLVER = "Liberar"`, a `:2026` o usa com dica
   própria, e `daemon/ipc_server.py:32` declara `mic.set {muted: bool|null}` —
   o `null` que devolve a posse ao `hid-playstation` (`ipc_handlers.py:3438`).
   O botão existe, tem IPC e tem texto.

   **O preço foi pago:** a sprint A-1 mandou tirá-lo, a sessão seguinte tirou, e
   quatro réguas de tela passaram a reprovar procurando um endereço que ninguém
   escrevia mais. Levado a ela em 31/08 com a medição, **ela manteve a decisão**
   — o botão fica fora da tela nova. O que caducou é a JUSTIFICATIVA, não a
   escolha, e a diferença importa: o princípio do item continua de pé; o exemplo
   que o ilustrava era o caso errado.

   **A lição que fica é sobre o ENUNCIADO, não sobre o botão:** ela falou do que
   via na tela, e quem escreveu aqui generalizou para o produto inteiro sem
   medir. Uma frase dela sobre a TELA não é uma afirmação sobre o CÓDIGO — e
   `grep` custa dez segundos.

3. **Valor sem fonte fica DECLARADO, nunca inventado.**
   Um número plausível e falso é pior que um traço honesto, porque ela confia no
   que lê.

4. **Se você mexeu na tela, você abre a tela e clica.**
   Três provas, sempre: a FOTO (antes e depois, `--oculta`), o CLIQUE (acionou o
   que mudou e mostrou a resposta), a MORDIDA (quebrou a própria cura e viu
   reprovar). A régua existe: `scripts/regua_de_tela.py`.

5. **A régua tem de viver no TEMPO.** Uma que roda o tique uma vez mede um
   INSTANTE. Em 29/08 uma leva introduziu regressão visível só aos **181
   segundos**, com 67 testes verdes.

6. **A régua é qualquer mesa, não a dela.** O app é GPL3 e pensado como
   acessibilidade. Cinco controles conhecidos é a amostra mais favorável que
   existe — o que prova é o MECANISMO.

7. **`radio_aciona = não` é ESTADO, nunca veredicto.** No PS5 tudo funciona nos
   quatro controles por Bluetooth. **Nunca escreva — em código, tela ou
   documento — que o aparelho não faz.**

---

## 2. OS ERROS DE QUEM COORDENOU HOJE — não os repita

Estão aqui porque cada um custou trabalho dela, e todos são de PROCESSO, não de
código.

| # | O erro | O que fazer em vez disso |
|---|---|---|
| 1 | **Lancei levas que escreviam onde ela editava.** Pasta sem git, sem desfazer. Ela refez um desenho do zero. | Antes de lançar, pergunte: esta pasta tem histórico? Ela está mexendo aí agora? |
| 2 | **Tratei um limite dela como problema a resolver.** Ela disse que o mockup não tinha histórico; eu propus tirar do `.gitignore` em vez de perguntar por quê. | Quando algo parecer "mal configurado" na árvore dela, pergunte o motivo antes de mudar |
| 3 | **Parei agentes sem conferir se o trabalho estava salvo.** Estava — mas ela levou o susto. | Antes de `TaskStop`: `git status`, e commite o que houver |
| 4 | **Generalizei recusas dela em regras.** Ela recusou inverter a numeração automática do jogador; escrevi "nenhuma sprint toca na numeração" — e a troca à mão é feature que ela QUER. | Registre a recusa com o escopo exato dela, nunca ampliado |
| 5 | **Afirmei sem medir.** Disse que a cor do plástico funcionava, com base numa foto tirada com `--cor-duble`. No instante da foto, o produto lia `None`. | Confira COMO a prova foi produzida antes de acreditar nela |
| 6 | **Commitei o índice inteiro** e varri o trabalho de outro agente para dentro de um commit que não o descrevia. | Com levas em voo, commite caminhos nomeados |
| 7 | **Repeti "28 portões" sem contar.** São 29 — havia um que existia só no gancho, invisível às duas listas. | Números se medem, inclusive os que você mesmo repetiu ontem |

---

## 3. O ESTADO REAL — o que funciona e o que não

**As duas árvores:**

```
/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix       branch dev       ← A DELA
/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix-dev   branch dev-gtk   ← o app novo
```

**NUNCA troque a branch de nenhuma das duas.** Trocar troca o que está no disco
dela — já aconteceu, e o mockup que ela ia abrir sumiu na frente dela.

**O que está instalado e funcionando:**

- Dois apps no menu do COSMIC: `Hefesto` (estável) e `Hefesto (dev)`, com casas
  separadas (`HEFESTO_VARIANTE=dev` → `~/.config/hefesto-dev-dualsense4unix/`).
- `hefesto-chave estavel|dev on|off|status` — liga e desliga cada um, atravessa
  o reboot, mascara as units e esconde o atalho.
- **O Hefesto estável está DESLIGADO** (ela o desligou para testar). O daemon de
  dev está no ar e vê o controle dela.
- A aba **Controles** está viva: mesa real, cor do plástico lida, giroscópio,
  LED do jogador, três campos na coluna esquerda.

**A variável é obrigatória para falar com o daemon de dev:**

```bash
cd /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix-dev
HEFESTO_VARIANTE=dev .venv/bin/python src/hefesto_dualsense4unix/interface/controles_vivos.py --oculta --segundos 3 --foto /tmp/x.png
```

Sem ela, `daemon_state_full()` devolve `None` e a tela diz "Errno 111".

---

## 4. AS SPRINTS — o que fazer, em ordem

### FAIXA A — os quatro defeitos que ela vê na tela AGORA

São os mais urgentes: ela olha a aba Controles e eles estão lá.

**A-1 · O botão "Liberar" sai do microfone.**
Ele não existe no produto. Antes de tirar, `git log -p` em
`src/hefesto_dualsense4unix/interface/aba02.py` para achar quando nasceu e com que justificativa;
se alegaram um IPC, meça se existe. Cole no relato: quantos botões o bloco tem,
e **o dono de cada um** (método de IPC, arquivo:linha). Sem dono, não entra.

**A-2 · A faixa de onda do microfone volta.**
O alto-falante tem os tracinhos; o microfone não. Compare com o contrato
(`docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, a tabela "Nada se
perdeu" — toda linha ali é requisito) e com o histórico. Devolva o que foi tirado
sem ela pedir; o que ela mandou tirar fica tirado.

**A-3 · O acelerômetro volta FUNCIONANDO.**
Decisão dela: `D-O-ACELEROMETRO-VOLTA-E-FUNCIONA`. *"não era pra ele sair, era
pra ele FUNCIONAR."*
O dado existe: o nó evdev "Motion Sensors" publica os SEIS eixos — `ABS_X/Y/Z`
(`resolution=8192`, acelerômetro) e `ABS_RX/RY/RZ` (`1024`, giroscópio). Lidos
nos controles dela: **|v| = 0,9971 g e 0,9928 g**. O produto já abre esse nó:
`core/evdev_reader.py:2146` e `:2165` filtram só três; `daemon/sensor_hub.py:119`
publica só `gyro`.
**CONFIRA ANTES**: uma leva pode já ter ligado no `src/` — meça o `state_full` ao
vivo antes de escrever linha.

**A-4 · A distribuição vertical.**
Giroscópio com X/Y/Z espalhados, Gatilhos com L2/R2 afastados. Regra dela, de
27/08: *"a cura do vão é na ALTURA, não no `space-between`"*. Meça em pixels
(`medir()` da régua de tela), não a olho.

### FAIXA B — as nove abas que faltam ligar

A **Controles** é o molde (121 valores por pintura, 1,0% do orçamento do tique).
As 109 sprints estão em `docs/process/sprints/2026-08-29-MIGRA-*` e a ordem em
`2026-08-29-MIGRA-A-ORDEM-das-dez-abas.md`.

**B-0 · A ponte vira biblioteca, ANTES de qualquer aba.**
Hoje ela vive dentro do `controles_vivos.py`. Nove cópias seria o defeito que
esta casa mais paga. Extraia para `scripts/`.

**B-1 a B-9**, na ordem medida: Vibração · Jogar · Perfis · Sistema · Conexões ·
Gatilhos · Iluminação · Lançadores · Navegação.
Cada uma com régua própria em `tests/unit/test_regua_de_tela_a_aba_*.py`.
**Quatro rascunhos não provados** ficaram de uma leva parada:
`src/hefesto_dualsense4unix/interface/{jogar_vivo,perfis_vivos,conexoes_vivas,sistema_viva}.py`.
Leia, meça, e diga se aproveita ou refaz — as duas respostas servem, desde que
medidas.

**O placar** está em `docs/process/2026-08-29-QUANTO-FALTA-PARA-AS-DEZ-ABAS-VIVEREM.md`:
34,5% dos valores estão no `state_full`, mas **88 a 96% do que a tela precisa é
alcançável pelo processo da GUI** — e o WebView mora dentro dele.

### FAIXA C — o que espera decisão dela

- **O carimbo da ponte.** Ela perguntou: *"por que não lembra a última versão que
  eu setei?"* Medido: 6 dos 29 perfis têm carimbo, **todos `por=silencio`**, e
  nenhum foi posto por ela. A decisão dela de 19/08 dizia *"ela confirma UMA
  vez"* — o que existe confirma sozinho aos 180 segundos.
- **A logo na dock**: o desenho é dela e renderiza inteiro, mas ela ainda não
  validou.
- **Os 29 perfis** não foram copiados para a casa de dev. Ela decide se quer
  testar com os jogos reais ou com uma casa limpa (a régua que ela fixou).

---

## 5. O QUE JÁ ESTÁ CURADO — não refaça

Em `dev-gtk`, tudo commitado e com mordida:

- a cor do plástico é lida (pela porta do broker); "Não sei" virou o nome real
- a trava manual do áudio e do LED solta (teto de ociosidade de 6h)
- a máscara por controle obedece (`make_virtual_pad` ganhou `identity`)
- a troca de player acontece (era `ok:true` sobre nada) — **mas vale a sessão,
  não o reboot**, e isso está escrito na §7.4 da sprint
- o gesto PS+R3 pula o degrau que exige reabrir o jogo (Sackboy tinha um aperto
  comido em cada quatro)
- a trava que impede dois daemons de segurar o mesmo controle
- a lápide "o aparelho recusa" saiu de 25 lugares — a causa era o nosso CRC
- o `install-dev.sh` assa os transforms do SVG sozinho

---

## 6. OS COMANDOS QUE NÃO ENVELHECEM

```bash
git log --since=midnight --format='%h %s'      # o que a casa fechou hoje
git worktree list                              # as árvores e suas branches
bash scripts/portoes.sh                        # os 29 · ~2 min
hefesto-chave status                           # os dois Hefestos
```

**A suíte roda em OITO LOTES, nunca inteira** — ela cria nós uinput de verdade e
já derrubou a sessão gráfica dela:

```bash
ls tests/unit/test_*.py | sort > /tmp/todos.txt
split -n l/8 -d /tmp/todos.txt /tmp/lote-
for f in /tmp/lote-*; do .venv/bin/python -m pytest $(tr '\n' ' ' < "$f") -q; done
```
