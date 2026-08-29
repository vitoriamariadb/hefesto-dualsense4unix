---
sprint: MIGRA-JOGAR-08
onda: MIGRA-JOGAR
posse:
  J8:
    - src/hefesto_dualsense4unix/app/actions/jogar/faixa.py
cria:
  - src/hefesto_dualsense4unix/app/actions/jogar/faixa.py
  - tests/unit/test_migra_jogar_08_a_faixa_e_o_rodape.py
bancada: false
depois_de:
  - MIGRA-JOGAR-03   # sem `#jg-pendente`, `#jg-reconectar` e `#jg-recibo` não há alvo
  - MIGRA-JOGAR-04   # a 04 cria o pacote `app/actions/jogar/`
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/footer_actions.py
  - src/hefesto_dualsense4unix/app/actions/home_actions.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - novo-layout/
---

# MIGRA JOGAR · 08 — a faixa final e o rodapé

**O defeito:** a faixa de baixo e o rodapé são a parte da tela em que a pessoa
**age**, e no motor novo cada um desses gestos precisa de fio. Os mecanismos já
existem — o que não existe é o caminho da página até eles.

O que já responde, e esta sprint **liga**:

| Peça | Quem já responde |
|---|---|
| a linha laranja (escolha pendente) | `app/actions/home_actions.py:1685` (`reconciliar_pendente`), `:1718` (`render_pendente`), `:1821` (`recolher_escolha_pendente_no_rascunho`) |
| o texto dela | `app/actions/relancar.py` (`texto_do_pendente`) |
| "Reconectar Controles" | `home_actions.py:3112` (`_on_home_reconciliar_clicked`) — encadeia `coop.sync` e `identity.renumber` |
| o nome do perfil no recibo | `app/actions/footer_actions.py:884` (`_perfil_que_as_abas_editam`), que **já diz por escrito** por que não é o `_active_profile_name` |

Duas mudanças de tela vêm com isso, e as duas já foram aprovadas:

- **"Reconciliar jogadores" vira "Reconectar Controles"** (`01-jogar.html:2284`,
  e a legenda `:2343`). Só o nome muda — o gesto é o mesmo;
- **o recibo do rodapé nomeia o perfil** (`:2297`): *"`Aplicar` vale agora ·
  `Salvar Perfil` grava no Mortal Kombat"*. A legenda diz por que isso importa:
  *"é onde a mudança vai cair, que era a informação que faltava e te custou
  semanas."*

## O que entrega

1. **A linha laranja é a prova de que o `Aplicar` ainda deve.** `#jg-pendente`
   aparece quando há escolha pendente e some quando não há —
   `D-APLICAR-NAO-SALVA` já está implementada, e o texto vem de
   `relancar.texto_do_pendente`, não de uma segunda frase.
2. **O espaço dela é reservado**, para a tela não pular. A faixa é uma grade com
   a mesma largura de coluna da dupla acima (`--col-avisos`, `01-jogar.html:355`)
   — é isso que faz a borda esquerda do botão cair exatamente sob a barra
   vertical da coluna de avisos. Com `flex` o botão parava 85 px à direita dela,
   perto o bastante para ler como erro.
3. **Os cinco gestos chegam ao Python**: `#jg-reconectar`, `#jg-aplicar`,
   `#jg-salvar`, `#jg-importar`, `#jg-exportar`. Nenhum deles ganha
   implementação nova — os quatro do rodapé são da **moldura das dez abas** e
   esta sprint só entrega o fio. Se a moldura ainda não os tiver, o botão fica
   **inerte com o motivo na dica**, nunca clicável e mudo.
4. **O recibo nomeia o perfil que as abas editam**, lido de
   `footer_actions._perfil_que_as_abas_editam`. **Não** de uma segunda variável:
   a segunda variável é a origem literal da queixa *"clico em salvar e ele salva
   com um nome aleatório ou de outro perfil"*.

## Como se prova (a mordida)

`tests/unit/test_migra_jogar_08_a_faixa_e_o_rodape.py`:

- **a linha laranja segue o rascunho.** Dublê com escolha pendente:
  `#jg-pendente` visível, com o texto que `relancar.texto_do_pendente` devolve
  para aquele rascunho. Sem pendência: escondido. **A mordida:** escreva o texto
  na página em vez de lê-lo — o teste reprova quando o produtor muda a frase;
- **a tela não pula.** Meça a posição do `#jg-reconectar` com e sem a linha
  laranja: **a mesma**. **A mordida:** tire o espaço reservado — o teste reprova
  com os pixels que o botão andou. É o motivo pelo qual o desenho reserva;
- **o botão fica alinhado com a barra da coluna.** A borda esquerda de
  `#jg-reconectar` cai sob a barra vertical de `.col-atencao`, com a tolerância
  de um pixel. **A mordida:** troque a grade por `flex` — o teste reprova com os
  85 px que essa troca custa. **Cuidado:** o `scrollIntoViewIfNeeded` do
  Playwright rola antes de medir e falsifica esta medida;
- **"Reconectar" chama o que já existe.** Clique; a sequência tem de ser
  `coop.sync` e depois `identity.renumber`, na ordem. **A mordida:** inverta a
  ordem — o teste reprova, porque renumerar antes de sincronizar renumera uma
  mesa que ainda vai mudar;
- **o recibo nomeia o perfil certo.** Com um perfil ativo A e um perfil em edição
  B, o recibo tem de dizer **B** — que é o que `_perfil_que_as_abas_editam`
  devolve. **A mordida:** leia o `_active_profile_name` — o teste reprova, e é
  literalmente o caminho da queixa dela;
- **nenhum botão fica clicável e mudo.** Para cada um dos cinco: ou o clique
  produz efeito verificável, ou o botão está inerte **com motivo**. **A mordida:**
  ligue um botão a um `pass` — o teste reprova.

## O que é dela decidir

- **O que o `Exportar` exporta, e para onde vai o "Voltar ao padrão".** As duas
  perguntas são da **moldura das dez abas**, não desta — mas é aqui que os botões
  aparecem, e é aqui que a resposta faz falta primeiro.
- **A redação do recibo.** O mecanismo é o mesmo dos outros
  (`D-O-RECIBO-DO-RODAPE-ENCURTA-NAO-SAI`); trocar o texto depois é uma
  constante, e por isso não trava nada.
