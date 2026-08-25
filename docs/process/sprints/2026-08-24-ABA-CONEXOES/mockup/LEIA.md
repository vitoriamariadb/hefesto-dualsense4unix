# O mockup da aba Conexões — e por que ele está VERSIONADO

**Abra `mapa-das-portas.html` com duplo clique.** Autocontido: sem rede, sem
servidor, sem fonte web. A paleta é a Drácula de `scripts/paleta_da_casa.py`,
copiada byte a byte — o artefato tem de parecer parte do Hefesto.

## Por que ele mora aqui, e não em `novo-layout/`

`novo-layout/` é `.gitignore:108`. Este arquivo **não é rascunho: é a
especificação executável** de quatro sprints, e a única descrição existente do
motor de arranjo — 1058 linhas de lógica testada. Num `git clean -xdf` ele
morreria, e com ele a peça que ela pediu para levar à GUI.

O precedente é da própria casa:
`docs/process/sprints/2026-08-21-ABA-CONFIGURACOES/mockup/aba-configuracoes.html`
está rastreado pelo mesmo motivo.

## O que ele contém, e que nenhuma sprint descrevia

1. **O modelo `entrada → caminho de barramento`.** O mapa NÃO guarda "entrada 9
   tem um Bluetooth"; guarda "entrada 9 **é** o caminho `3-1.2`". Qual aparelho
   está lá é DERIVADO da leitura de agora. É isso — e só isso — que faz o
   produto reconhecer sozinho um aparelho que mudou de lugar.
2. **O planejador**, com nota por entrada e duas regras que salvam a
   credibilidade: *ficar parado vale bônus* e *aparelho intercambiável não troca
   com o irmão*. Sem elas o plano mandava 7 movimentos, dos quais 3 inúteis.
3. **Quatro arranjos**, não um: `O melhor no papel`, `Mexendo o mínimo`,
   `Sem o extensor`, `Sem usar o hub` — este último é o caso do notebook. Cada
   um diz **o que se perde**, em palavra, nunca em pontos.
4. **A re-identificação** por serial, comparando duas leituras reais da máquina
   dela (24/08, 21h e 22h50).
5. **A dedução de região** pelo barramento: quem pende do hub está no hub. Isso
   reduz o palpite de 16 entradas para 7 ou 8 sem chutar nada.
6. **Os controles**: em qual adaptador cada um rende 100%, com rebalanceamento
   **só quando baixa a carga do mais cheio**.

## Como se testa a lógica sem navegador

```bash
node mockup/fumaca.js      # pinta em 29 estados; falha se algum não pintar
```

**`node --check` NÃO basta**, e a cicatriz é de 25/08/2026: ele valida sintaxe e
não vê referência inexistente. Um `ReferenceError` na última linha de `pintar()`
deixou a seção "Os controles" — que carrega TRÊS decisões dela — sem desenhar em
todas as versões entregues, e nenhuma conferência de sintaxe acusou. Quem achou
foi uma auditoria que montou um DOM falso e **rodou**.

Para exercitar só o cálculo:

```bash
sed -n '/^(function () {/,/^  pintar();/p' mockup/mapa-das-portas.html \
  | sed '/document.addEventListener/,$d' | sed 's/^(function () {/;(function () {/' > /tmp/l.js
# chame planejar(), receita(), julgar(), reexame(), planoDosControles() e feche com })();
node /tmp/l.js
```
