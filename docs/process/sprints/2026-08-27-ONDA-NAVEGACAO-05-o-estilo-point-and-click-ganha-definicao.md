---
# onda: NAVEGACAO  (o campo `onda:` não existe no analisador de
# `scripts/check_colisao_de_sprints.py:80` — vai como comentário até ele existir)
sprint: ONDA-NAVEGACAO-05
estado: absorvida
posse:
  NAV-E:
    - src/hefesto_dualsense4unix/profiles/schema.py
    - assets/profiles_default/
cria:
  - src/hefesto_dualsense4unix/core/estilo_point_and_click.py
  - tests/unit/test_nav_estilo_point_and_click.py
bancada: false
depois_de:
  - ONDA-NAVEGACAO-04
  # SÉRIE, por R5: esta sprint divide src/hefesto_dualsense4unix/profiles/schema.py
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-VIBRACAO-03
  - ONDA-VIBRACAO-05
  - ONDA-GATILHOS-04
  - ONDA-NAVEGACAO-01
  - EMULACAO-UM-DONO-SO-01  # sprint antiga ainda aberta: a onda vem depois, em série (R5)
  - IDENTIDADE-01  # fechou em 54b7ffd2 (o app-id e a migração); a série é nominal
  - LEVA-2  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/
  - src/hefesto_dualsense4unix/integrations/
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 06). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA NAVEGAÇÃO · 05 — O estilo Point-and-click ganha definição

## O defeito, em uma frase

O Point-and-click é um dos catorze Estilos de Jogo, o perfil pode escolhê-lo e o
PS + R3 pode chegar nele ao vivo — mas **o que ele faz não está escrito em lugar
nenhum**: `grep -rn "estilo" src/` devolve zero.

## O que está medido

- Nenhum módulo em `src/hefesto_dualsense4unix/` conhece estilo de jogo. O que
  existe é `ProfileMouseConfig` (`profiles/schema.py:361`,
  FEAT-POINT-AND-CLICK-01) — as duas velocidades e o `enabled`, sem mapa de
  botões e sem nome de estilo.
- Os seis perfis de gênero dela (Ação, Aventura, Corrida, Esportes, FPS,
  `point_and_click`) existiam como **perfis próprios** e a D-OS-ESTILOS-DE-JOGO
  (`/tmp/coleta/decisoes.md:208`) os transforma em Estilos.

Decisão dela: **D-O-ESTILO-APONTA-PARA-O-MODO** (`/tmp/coleta/decisoes.md:189`) —
*"É um estilo de jogo mas esse estilo em específico é configurável dentro da aba
navegação. Eu seto lá como esse estilo deve funcionar. E no perfil eu posso pegar
o jogo e aplicar esse estilo mas se durante um jogo eu usar o modo PS+R3 e chegar
no mesmo modo de conexão é como se eu tivesse aplicado o estilo dentro daquele
perfil ativado."*

**Não é duplicação, são camadas:** a Navegação **define**, o perfil **escolhe**,
o PS + R3 **chega** — com o mesmo efeito de tê-lo escolhido.

## O que entrega

1. `core/estilo_point_and_click.py` — a definição do estilo, **uma só, da
   máquina**, não copiada em cada perfil: o mapa de botões (o vocabulário da
   ONDA-NAVEGACAO-04), as duas velocidades, e o de fábrica.
2. O perfil ganha o campo que **aponta** para o estilo, em vez de guardar uma
   cópia dele. Um estilo, muitos perfis: mudar a definição muda todos os jogos
   que a usam — que é o que ela descreveu.
3. Chegar no quinto degrau pelo PS + R3 (ONDA-NAVEGACAO-02) aplica a mesma
   definição, ao vivo, sem gravar nada no perfil — é `pelo_gesto`, não uma
   segunda escrita.
4. Os perfis de fábrica em `assets/profiles_default/` que hoje são
   `point_and_click` passam a **apontar** para o estilo.

## O que NÃO entra

Os outros treze Estilos de Jogo. Só o Point-and-click se configura nesta aba, e é
literalmente o que ela disse: *"esse estilo em específico"*. Os demais são da
onda de Perfis.

## Como se prova (o teste que morde)

`tests/unit/test_nav_estilo_point_and_click.py`:

1. **Uma definição, não N cópias:** dois perfis que usam o estilo e uma edição na
   definição — os dois passam a ver o valor novo, sem tocar em nenhum `.json` de
   perfil.
2. **As três camadas dão o mesmo resultado:** perfil que escolhe o estilo, e
   perfil sem estilo + PS + R3 no quinto degrau, resolvem o **mesmo** mapa de
   botões e as mesmas velocidades.
3. **O gesto não grava:** depois de chegar pelo PS + R3 e voltar, o `.json` do
   perfil está byte a byte igual ao de antes.
4. **A régua sabe recusar:** perfil que aponta para um estilo inexistente reprova
   na validação, dizendo o nome que não achou — não cai em silêncio para o
   default.
5. **A mordida:** arrancar a resolução do estilo e ver 1 e 2 reprovarem; colar as
   duas saídas.

Portão que tem de continuar verde:
`tests/unit/test_a_fabrica_nao_casa_com_a_loja.py` — a fábrica é o que alcança
quem instala hoje, e ela roda a régua do produto sobre `assets/profiles_default/`.

## O que é dela decidir

1. **Que campos o estilo expõe** (pergunta 6 do contrato da aba): só o mapa de
   botões e as duas velocidades — que é o que o mockup mostra atrás do botão
   "Configurar o estilo Point-and-click" — ou também gatilho, luz e vibração?
   O preço da segunda: a Navegação passa a configurar o que as abas Gatilhos,
   Iluminação e Vibração configuram, e vira uma segunda porta para as mesmas
   três decisões.
2. **Estilo de fábrica se edita?** A D-OS-ESTILOS-DE-JOGO diz *"os de fábrica NÃO
   se editam"*, e o Point-and-click é de fábrica — mas ela diz, com todas as
   letras, *"Eu seto lá como esse estilo deve funcionar"*. Ou este é a exceção
   nomeada, ou editar cria uma cópia "Point-and-click (seu)".
</content>
