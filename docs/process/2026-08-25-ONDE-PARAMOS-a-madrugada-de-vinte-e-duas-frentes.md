# ONDE PARAMOS — a madrugada de vinte e duas frentes

**25/08/2026.** Ela saiu às 02h30 e delegou: *"aja como PO e orquestrador e faça
todas as sprints relacionadas aos eventos via agentes… a ideia é concluirmos o
máximo de ondas possível essa madrugada e conto com vc"*. Voltou às 13h.

**164 commits. 278 arquivos. 13.108 testes.** Este documento é a porta de entrada
da próxima sessão: o que fechou, o que espera ela, e os erros que a integração
encontrou — **inclusive os de quem coordenou**.

---

## 1. O que ela precisa saber antes de tudo

### 1.1 O hub dela está desconectado, e isso bloqueou a noite inteira

Às **02h36** o hub USB externo saiu do barramento com dois `clear tt error -71`,
levando junto os **três adaptadores Bluetooth**. Ela confirmou às 03h05: *"pera o
hub tá desconectado de fato."* O cabo está fora.

**`/sys/class/bluetooth/` ficou VAZIO a noite inteira.** Consequência dura:
**nenhuma medição de rádio foi executável**, em nenhuma frente. Toda tarefa que
dependia disso está registrada com o comando exato que ela roda.

O relato completo, com as duas hipóteses concorrentes e o que as derrubou, está
em [2026-08-25-O-HUB-CAIU-INTEIRO](estudos/2026-08-25-O-HUB-CAIU-INTEIRO-seis-segundos-depois-do-cabo-do-controle.md).

### 1.2 Três defeitos VIVOS na máquina dela foram consertados

| defeito | o que acontecia |
|---|---|
| **A cura HARM-16 estava desarmada** | um clique em "Parar" e ela virava no-op **pelo resto da sessão** — o controle podia ficar vibrando ao sair de um modo. A guarda exigia `rumble_active is None`, e `rumble.stop` gravava `(0, 0)` |
| **A troca de perfil por jogo estava cega** | o `xlib` morto numa sessão Wayland **não tinha saída**; e o `healthy` mentia em DOIS lugares — a Onda 0 curou um em 24/08 e o segundo seguia 40 linhas abaixo |
| **Um gesto apagava três atalhos do perfil dela** | a aba Teclado nunca mostrou os atalhos de toque do touchpad, e a escrita substituía o rascunho pela tela |

### 1.3 Uma decisão que eu tomei errado, e voltou a ser dela

**`D-O-MIC-LIGADO-VALE-NO-RADIO` está ABERTA de novo.** Decidi por delegação que
"microfone ligado por padrão vale igual nos dois transportes" — e **não li as
specs antes**. O mapa de canais registra, medido, que ele *"nasce desligado por
opt-in: privacidade e banda"*, e a prova dela é um print do **cabo**.

**A delegação cobre o que as specs sustentam. Aqui elas diziam o contrário.**

---

## 2. O que espera o olho dela

**Quarenta e três mudanças de texto de tela**, em dez das onze abas. A lista
completa, aba por aba, com a frase que saiu e a que entrou, está no relatório do
conferente da leva (`docs/process/agentes/2026-08-25/`).

**As oito que mais mudam o que ela vê:**

1. **Início — a pausa chega à primeira aba.** Em pausa o produto prometia luz,
   vibração e um jogador por controle enquanto nada acontecia.
2. **Início — "você escolheu" para de acusar sobre gesto que ela não deu.** A
   divergência era medida contra a máscara do PERFIL, que entra sozinho — e
   quatro perfis desta casa pedem xbox.
3. **Emulação — o microfone para de pintar verde sobre alvo que a aba nunca
   olhou.** O caso comum não é exótico: é **o controle no rádio**, onde não
   existe placa ALSA nenhuma.
4. **Emulação — a aba para de prometer vibração que ninguém mediu.** Fato errado,
   e maior que a sprint mediu: `passthrough` é `inferido-do-codigo` nos **dois**
   transportes, não só no rádio.
5. **Lightbar — "Aceso agora:" vira "Desenho que mandamos:".** "Aceso" é leitura
   de volta que o produto **não tem**.
6. **Perfis — remover diz quando o perfil é o que está valendo.** Com o
   `active_profile.txt` dela em Sackboy, apagar o Sackboy era um clique.
7. **Sistema — oito frases param de mandar rodar `./install.sh`**, que só existe
   para quem clonou o repositório.
8. **Configurações — "Entrada 9" no lugar de "Barramento 3, porta 1.2"**, com a
   janela "A minha mesa" e o clique-em-clique que ela decidiu em 24/08.

**Nenhuma delas está aprovada.** As catorze fotos foram refeitas e mostram o
código de hoje; a palavra final sobre o desenho é dela (PROVA-DE-TELA-01).

---

## 3. As três regras novas, e as três nasceram de estrago medido

### R5 — a mordida é destrutiva enquanto dura

Entre arrancar a cura e devolvê-la, **a árvore está inválida**. Dois agentes na
mesma árvore produziram um commit com os testes e **sem o produto**.

**O worktree isola o ÍNDICE do git, não a ÁRVORE DE TRABALHO.**

### R6 — a árvore dela fica em `dev`

**Regra dela.** Trocar a branch da árvore principal fez um mockup **sumir do
disco na frente dela**. Quem integra usa árvore própria; ela recebe tudo no fim,
de uma vez, pelo merge.

### A suíte inteira não termina com frentes em voo

Parou nos 13% duas vezes, com `load average` 6,7. **Os portões decidem a
integração; a suíte roda no fim**, com a máquina livre.

---

## 4. Réguas que não mediam o que prometiam

Esta foi a colheita mais valiosa da noite, e ela diz algo sobre a casa.

- **Uma FRASE DE TELA desligava um portão.** A varredura contava toda palavra de
  toda string como "despacho", e um agente **silenciou o portão sem querer**
  escrevendo o nome de um símbolo numa mensagem de erro. **É a régua que para de
  medir exatamente quando alguém escreve uma mensagem boa.**
- **O portão `casa-sabe` roda no CI e ficou vermelho no `dev` por horas** — a
  mesma causa que o `validar-caducos.py` cometeu antes. O `portoes.sh` ganhou
  runner `pytest`, e são 24.
- **19 lápides caducas** e **51 promessas novas** sem classificação.
- **O canário da própria régua deixou de ser canário** — o módulo que ela usava
  como exemplo de "inalcançável" ganhou caminho hoje.
- **O piso do emblema de testes nunca foi verdadeiro:** repintado para 12.000 às
  02h52, quando a contagem real era 10.346.
- **Um teste fossilizava o defeito do perfil**, exigindo igualdade exata sobre os
  atalhos — e por isso protegia o apagamento.

---

## 5. Os erros de quem coordenou

Ficam escritos porque o processo é a entrega tanto quanto o código.

1. **Troquei a branch da árvore dela** no meio da leva. Virou a R6.
2. **Redisparei uma leva sem matar a anterior** — dois agentes por árvore em
   quatro frentes. Virou a R5.
3. **Decidi o microfone no rádio sem ler as specs.** A decisão voltou a ser dela.
4. **Passei premissas caducas a três agentes** — um campo que não existe desde
   23/08 e dois módulos inexistentes. Os três mediram e me corrigiram.
5. **Escrevi uma receita de mordida que não mordia.** O conferente refez e provou.

---

## 6. O que fica aberto, e de quem é

### É dela

- **A bancada inteira** — reencaixar o hub e conferir `ls /sys/class/bluetooth/`.
- **O carimbo D3** das quarenta e três mudanças de texto.
- **`D-O-MIC-LIGADO-VALE-NO-RADIO`**, reaberta.
- **O orçamento de altura da aba Emulação:** os 20px vieram de uma frase que
  **substitui um fato errado**. Encurtá-la desfaz a correção; e para caber na
  escala de fonte que ela usa, a janela precisaria de 1045px, que não cabe em
  1080p com painel.
- **`install.sh` T-01** — a hipótese do `enable --now` continua sem medição.

### É da próxima leva

- **A MOTOR-7**, que é o único pedido que ela fez PARA O INSTALL nesta madrugada
  e **não virou linha de código**: o install lendo o firmware com root para a aba
  abrir com o gabinete já desenhado. Palavra dela: *"não podemos deixar isso
  passar."*
- **Os cinco módulos novos sem consumidor de tela** — o motor do arranjo, o
  leitor de entradas, a junção do mapa, a gravação sem daemon e o contrato da
  máscara. Estão declarados no portão, com o que fecha cada um.
- **Três frentes entregaram código sem relatório** — 2.030 linhas sem prova de
  mordida documentada.
- **A meia-cura do empacotamento:** a GUI passou a procurar scripts em
  `/app/share` e **nenhum formato os põe lá** — só o `.deb` leva os dois scripts.

---

## 7. Como conferir tudo isto

```bash
git log --oneline f475b2a..dev          # os 164 commits da madrugada
bash scripts/portoes.sh                 # os 24 portões, ~2 min
ls docs/process/agentes/2026-08-25/     # os relatórios de cada frente
```

Os relatórios são a fonte primária: cada um tem *o que mudou*, *qual mordida
prova*, *o que NÃO verifiquei* e *o que sobrou para o próximo*. **O terceiro
cabeçalho é o mais valioso** — "NÃO VERIFICADO" é muito preferível a chute.
