# 03/09/2026 — as DOZE decisões dela, e as quinze receitas para ela corrigir

> Substitui a fila de perguntas de
> [A-LISTA-DELA](2026-09-03-A-LISTA-DELA-o-que-espera-a-palavra-dela.md): as dez
> perguntas foram respondidas, e as respostas abriram duas novas, também
> respondidas. **Este arquivo é o contrato do que vem a seguir.**

---

## §1 — AS DOZE, na forma em que ela decidiu

| # | o que era a dúvida | **a decisão dela** |
| --- | --- | --- |
| 1 | o trilho de brilho grava o perfil? | **grava na hora** — como a cor, decisão dela de 01/09 |
| 2 | publicar a aba Gatilhos? | **publicada** (25 lugares, `181f7a6a`+) |
| 3 | a política de vibração é da mesa | **construir por controle** |
| 4 | a barra "Personalizado" | **0 a 200%, arrastável, grava na hora** |
| 5 | a prioridade dos perfis | **slider**, como ela pediu em 27/08 |
| 6 | confirmação antes de apagar | **dois cliques**, como a Lançadores; o botão diz **"Confirma?"** |
| 7 | ligar o serviço pela interface | **o "Ligar" da Jogar liga o daemon TAMBÉM**; e a Sistema ganha um par próprio Parar/Ativar |
| 8 | o Estilo de Jogo | **construir o motor** — gatilho + vibração + luz |
| 9 | o interruptor da Navegação | **manter junto**, como ela decidiu em 27/08 |
| 10 | o selo do microfone | **cor + ícone** (risco sobre o mic quando mudo) |
| 11 | "Câmera" do kernel = "Webcam"? | **depende do aparelho** — a tela SUGERE, ela confirma |
| 12 | bateria desconhecida | **`— %`**, como a janela antiga |

**Duas correções que ELA fez em mim, e as duas mudaram o diagnóstico:**

* *"O parar é sobre o teste."* — eu havia concluído que o "Parar" da Vibração
  deixava o controle mudo no jogo sem volta, e apresentei isso como armadilha de
  mão única. **Não é:** `a05_vibracao.parar` chama `rumble_stop_checked()` **e**
  `rumble_passthrough(True)` na mesma função. O que me enganou foi uma nota
  desatualizada em `app/telas/vibracao.py`, já substituída;
* *"Aplicar é só no rodapé."* — eu contei o `r-aplicar` do rodapé como se fosse
  um botão da aba Vibração.

---

## §2 — AS QUINZE RECEITAS, para ela corrigir

**Ela escolheu:** *"Eu proponho, você corrige"*. Abaixo está a proposta. Cada
linha usa só o que o produto JÁ SABE FAZER — os 19 modos de gatilho reais, os
três degraus de vibração (`economia` 0.3 · `balanceado` 1.0 · `max` 1.5) e a cor
da barra de luz.

**A regra que gerou a coluna do gatilho:** o efeito tem de descrever a RESISTÊNCIA
que aquele gênero pede no dedo, não o clima do jogo.

| estilo | gatilho (L2/R2) | vibração | luz | por quê |
| --- | --- | --- | --- | --- |
| **FPS** | `AutoGun` — Arma automática | `max` | vermelho | o gatilho estala em rajada, que é o gesto do gênero |
| **Corrida** | `Resistance` — Resistência | `balanceado` | laranja | o acelerador tem peso constante; o freio também |
| **Ação** | `Weapon` — Disparo | `max` | roxo | trava, solta no estalo, fica leve — o golpe |
| **Aventura** | `Feedback` — Ponto duro | `balanceado` | verde | um ponto de resistência que marca a ação, sem cansar |
| **Esportes** | `SimpleRigid` — Rígido simples | `balanceado` | azul | curso curto e previsível; o gatilho não conta história |
| **Point-and-click** | `Off` — Desligado | `economia` | ciano | o gatilho não é usado; vibração baixa não distrai a leitura |
| **Terror** | `PulseB` — Pulso (curva B) | `max` | vermelho escuro | o pulso irregular é o susto no dedo |
| **Luta** | `SemiAutoGun` — Arma semi-automática | `max` | magenta | um estalo por golpe, com volta rápida |
| **Co-op na mesa** | `SimpleRigid` — Rígido simples | `balanceado` | **a cor do jogador** | quatro controles, e a luz é quem diz quem é quem |
| **Maratona** | `Off` — Desligado | `economia` | apagada | a sessão é longa: tudo que gasta bateria sai |
| **Plataforma** | `Off` — Desligado | `balanceado` | amarelo | o pulo é botão, não gatilho; a vibração marca o impacto |
| **Retrô/Emulador** | `Off` — Desligado | `economia` | branco | o console original não tinha nada disso |
| **Ritmo/Música** | `Off` — Desligado | `max` | ciclo pela batida | a vibração É o instrumento; o gatilho atrapalha o tempo |
| **Simulação/Voo** | `SlopeFeedback` — Rampa de força | `economia` | azul claro | o manche endurece com o curso, e o voo é longo |
| **Personalizado** | não mexe | não mexe | não mexe | é o estilo que diz *"eu ajusto na mão"* |

### As três coisas desta tabela que EU NÃO SEI e ela decide

1. **A luz do "Co-op na mesa"** — "a cor do jogador" quer dizer a paleta
   automática (P1 azul, P2 vermelho…). Se ela preferir uma cor fixa, é uma
   palavra;
2. **A luz do "Ritmo/Música"** — "ciclo pela batida" é a única linha que pede
   MECANISMO NOVO (uma luz que muda no tempo). Se for demais, vira uma cor fixa
   e a linha fica igual às outras;
3. **"Maratona" com a luz apagada** — economiza bateria de verdade, e é a única
   receita que deixa o controle sem sinal visual nenhum.

---

## §3 — O QUE CADA DECISÃO DESTRAVA, e o tamanho

| # | trabalho | tamanho |
| --- | --- | ---: |
| 3 + 4 | vibração por controle + a barra arrastável | médio — o perfil já guarda `rumble` por controle |
| 1 | o trilho de brilho grava | pequeno — o gesto existe, falta gravar |
| 5 | a prioridade vira slider | pequeno — o motor de escrita existe |
| 6 | dois cliques nos cinco | pequeno — copia o padrão da 07 |
| 7 | ligar o daemon | pequeno — `systemctl start` já existe |
| 10, 12 | selo com cor+ícone, bateria `— %` | pequenos |
| 11 | a tela sugere o aparelho | médio |
| 8 | o motor do Estilo de Jogo | **o maior** — depende da §2 |
