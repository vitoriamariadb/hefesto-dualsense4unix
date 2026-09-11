---
sprint: SOM-BOTOES-01
estado: feita
onda: A-LISTA-DE-0911
posse:
  SOM-BOTOES-01:
    - src/hefesto_dualsense4unix/interface/aba02.py
    - src/hefesto_dualsense4unix/interface/pacotes/a02_controles.py
    - mockup/02-controles.html
cria: []
bancada: false
depois_de:
  # A posse é a MESMA aba destas três, e todas estão paradas esperando decisão
  # DELA (a forma da `fonte` na tela, o limiar do «captando»). Esta não espera
  # decisão nenhuma: ela mede o que JÁ está na tela. Se alguma delas for
  # despachada antes, esta vem depois.
  - SOM-NA-TELA-01
  - MIC-NA-TELA-01
  - MIC-SEM-FONTE-01
nao_toca:
  - src/hefesto_dualsense4unix/daemon/subsystems/alto_falante.py
  - src/hefesto_dualsense4unix/integrations/alto_falante_bt.py
---

# SOM-BOTOES-01 — os botões do som fazem o que dizem?

> **ESTADO 2026-09-11: feita** — dois defeitos medidos e curados na fileira de
> três botões do alto-falante. **«Ouvir junto» nunca acendia**:
> `A_FILEIRA_TEM_TRES` valia `False` com a página publicada trazendo o botão
> quatro vezes, porque a atribuição rodava antes de `PAGINA` existir e um
> `except Exception` devolvia o `NameError` como *"a página não tem o botão"*
> — e a régua de 10/09 não via porque monkeypatchava a própria constante
> (12/12 verde com o defeito inteiro de volta). E **sair de «Todo o som do PC»
> para «Ouvir junto» deixava o firmware em «só no alto-falante»**, com o
> cartão publicando a ressalva que mandava desfazer o clique dela. Régua nova
> com 19 testes, sem monkeypatch da constante. A ORELHA DELA continua devendo:
> nada aqui tocou o aparelho. A entrega é
> `docs/process/agentes/2026-09-11/SOM-BOTOES-01-opus.md`.

> *"tipo sobre o som ta funcionando como deveria mas não sei se os botões*  <!-- noqa-acento: citação literal dela -->
> *funcionam lá como deveriam. eu não sei explicar funciona mas sinto que tem*  <!-- noqa-acento: citação literal dela -->
> *algo errado."*  <!-- noqa-acento: citação literal dela -->

**Esta é uma sprint de MEDIÇÃO com cura no fim, e a ordem é essa.** Ela não
relatou um defeito: relatou uma desconfiança. **Uma desconfiança dela já valeu
treze defeitos reais** — 05/09, as treze queixas. O trabalho é transformá-la em
fato ou em «não achei», com o teste que sustenta cada um.

---

## §1 — O QUE ESTÁ NA TELA HOJE, e é o alvo

A aba **Controles** ganhou em 10/09 (`5fdbf090`) **os três botões do som e o 🎙
vivo**. Os gestos dessa coluna são o alvo desta sprint, e são eles que ela
clicou quando escreveu a frase.

**Levante a lista antes de medir**, e a lista é LIDA da página, nunca digitada:
todo `data-gesto` da coluna de som da `02-controles.html`, com o gesto que o
`a02_controles.py` declara por `@gesto(...)`.

## §2 — A PERGUNTA, para cada botão, e são QUATRO

Para **cada** gesto de som, com a ponte JS, `--oculta`, e o daemon vivo:

1. **Ele chama alguém?** Ou é botão sem chamador — o defeito que o portão
   `casa-sabe` existe para acusar e que mordeu esta casa em 10/09 (a ponte que
   ninguém construía).
2. **O que ele diz que fez bate com o que fez?** A cicatriz de 04/09 tem nome:
   dezesseis gestos diziam «aplicado» sem mudar nada, e a máscara **nunca gravou
   um byte**. Um campo que pisca verde não é prova.
3. **Ele vale só para aquele controle?** A premissa da `SOM-NA-TELA-01` caiu
   exatamente aqui: o botão **já** vale só para o controle da coluna, medido no
   fonte. Confirme no DOM vivo, porque a casa já errou nos dois sentidos.
4. **O estado que ele mostra é lido ou lembrado?** Um botão que guarda o próprio
   estado em vez de perguntar ao daemon mente depois do primeiro `Recarregar`.

## §3 — O QUE JÁ SE SABE, e economiza meia noite

* **O `mix`/`sfx` (a fonte) NÃO tem gesto na tela** — é a `SOM-NA-TELA-01`, e a
  forma dela é decisão DELA. **Não crie esse gesto aqui.** Se a sua medição
  tocar nisso, registre e siga.
* **O som pelo rádio é o report `0x35`**, e o bit 0 dos `enables` é o
  **microfone**: em 10/09 o som pelo rádio desligava o mic por causa desse bit.
  Se um botão de som mexer no microfone, esse é o fio a medir.
* **Dois microfones não ficam no ar juntos** — a eleição de fonte única desfaz o
  primeiro. É desenho, não banda: se um botão de mic parecer «não pegar» com
  dois controles, pode ser isto, e então a cura é de TEXTO, não de código.

## §4 — O QUE ENTREGAR

1. **A tabela dos botões**, um por linha: gesto · chama quem · o que mudou de
   verdade (nó do PipeWire, byte do report, campo do perfil) · vale só para o
   dono? · o estado é lido?
2. **Toda mentira achada vira cura no mesmo commit**, com teste que morde.
3. **Toda desconfiança que NÃO virou defeito fica escrita como «medi e não
   achei»**, com o que foi medido. Silêncio aqui faz ela remedir sozinha.
4. **A MORDIDA** de cada cura: arranque, veja reprovar, devolva.
5. Se a tela mudar: `mockup/02-controles.html` e `--publicar 02`.

## §5 — O QUE É DELA

**A orelha.** Som e microfone só fecham com ela ouvindo, e o mapa recusa
afirmação forte sem a medição dela. Você fecha o que é de código; o que precisar
de orelha entra no relatório como gesto para a bancada dela, com o tempo que
custa.
