---
sprint: ONDA-LANCADORES-08
onda: ABA-LANCADORES
posse:
  L8:
    - src/hefesto_dualsense4unix/app/actions/lancadores_actions.py
cria:
  - docs/process/sprints/2026-08-27-ONDA-LANCADORES-08-o-estilo-retro-na-linha-do-emulador.md
  - tests/unit/test_lancadores_estilo_retro.py
bancada: false
depois_de:
  - ONDA-LANCADORES-01
  - ONDA-LANCADORES-03
  - ONDA-LANCADORES-04
  - ONDA-LANCADORES-05
  - ONDA-LANCADORES-06
  - ONDA-LANCADORES-07
nao_toca:
  - src/hefesto_dualsense4unix/profiles/
  - src/hefesto_dualsense4unix/app/actions/profiles_actions.py
  - src/hefesto_dualsense4unix/gui/main.glade
---

# ONDA LANÇADORES · 08 — o Estilo Retrô/Emulador na linha do emulador

**O defeito, em uma frase:** o mockup mostra um botão que aplica um estilo de
fábrica que ainda não existe no código.

**Medido:** `grep -rn "estilo" src/hefesto_dualsense4unix/profiles/*.py` devolve
**zero**. O que existe é `profiles/trigger_presets.py` (só gatilho) e os perfis de
gênero. Os catorze estilos são decisão dela (D-CATORZE-ESTILOS-DE-FABRICA) e
**nascem fora desta onda**.

## O que entrega

O botão **"Aplicar o estilo Retrô/Emulador"** (roxo) na linha de um emulador —
`novo-layout/07-lancadores.html:528-539`, o cartão do RetroArch, que é onde o
mockup diz, com todas as letras, que *"este é o lugar do Estilo
Retrô/Emulador"*.

**E a regra que faz esta sprint valer a pena mesmo se os catorze atrasarem:**
enquanto o estilo não existir, **o botão não é desenhado**. Não um botão cinza,
não um botão que avisa que ainda não dá — nenhum botão. Botão que não faz nada é
a mesma família do "Passthrough em emulação", que o redesenho manda sair porque
*exibi-la ensinava que existe um controle que não existe*.

## A mordida

`tests/unit/test_lancadores_estilo_retro.py`:

1. Catálogo de estilos **sem** o Retrô → a fileira do cartão do RetroArch sai
   **sem** o botão. Arranque a checagem → o botão aparece sem estilo por trás, e
   o teste reprova.
2. Catálogo **com** o Retrô → o botão aparece e aplica **naquele** perfil, e o
   teste confere que o perfil gravado é o alvo, não o ativo por acidente.

## O que é dela decidir

- **Em qual perfil o estilo cai.** No perfil ativo (o que a fita do topo diz), num
  perfil novo para aquele emulador, ou o botão pergunta? A fita desta aba está
  **esmaecida** de propósito — aqui não se escolhe alvo (`novo-layout/07-lancadores.html:418-423`),
  então o alvo deste gesto precisa de nome.
- **Depende de fora:** esta sprint só fecha cheia quando os catorze estilos
  existirem. Quem coordena acrescenta a `depois_de` a sprint que os cria.
