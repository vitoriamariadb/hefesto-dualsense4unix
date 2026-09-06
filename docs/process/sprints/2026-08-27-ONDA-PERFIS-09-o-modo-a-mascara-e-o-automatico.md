---
sprint: ONDA-PERFIS-09
estado: absorvida
# onda: PERFIS
posse:
  P9:
    - src/hefesto_dualsense4unix/app/actions/profiles_actions.py
    - src/hefesto_dualsense4unix/app/actions/contrato_da_mascara.py
    - src/hefesto_dualsense4unix/profiles/schema.py
cria:
  - docs/process/sprints/2026-08-27-ONDA-PERFIS-09-o-modo-a-mascara-e-o-automatico.md
  - tests/unit/test_o_automatico_nao_decide_no_escuro.py
bancada: true
depois_de:
  - ONDA-PERFIS-01
  - ONDA-PERFIS-02
  - ONDA-PERFIS-03
  - ONDA-PERFIS-04
  - ONDA-PERFIS-05
  - ONDA-PERFIS-06
  - ONDA-PERFIS-08
  # SÉRIE, por R5: esta sprint divide src/hefesto_dualsense4unix/profiles/schema.py
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-VIBRACAO-03
  - ONDA-VIBRACAO-05
  - ONDA-GATILHOS-04
  - ONDA-NAVEGACAO-01
  - ONDA-NAVEGACAO-04
  - ONDA-NAVEGACAO-05
  - EMULACAO-UM-DONO-SO-01  # sprint antiga ainda aberta: a onda vem depois, em série (R5)
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/daemon/subsystems/external_mask.py
  - src/hefesto_dualsense4unix/app/actions/home_actions.py
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 10). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA PERFIS · 09 — o Modo, a máscara, e o "Automático" que o censo reprova

**PARE E LEIA ANTES DE ESCREVER CÓDIGO.** Esta sprint carrega uma decisão dela
que **uma medição desta casa já derrubou**, e a resposta certa é pôr o preço na
mesa, não implementar por obediência.

## O que ela decidiu

> D-A-MASCARA-GANHA-O-AUTOMATICO: *"SIM, COMO TERCEIRA OPÇÃO QUE FICA LIGADA:
> [Xbox 360] [DualSense] [AUTOMÁTICO]. Escolhendo Automático, o produto decide a
> cada jogo que abrir, sempre — ela nunca mais pensa nisso."*
> Justificativa registrada: *"`integrations/api_de_entrada.py` já diz quais APIs
> estão DENTRO do executável, e é consumido só por `prontuario_dos_jogos.py` —
> zero em `app/`. Hoje ela escolhe Xbox ou DualSense NO ESCURO."*

Metade disso é fato conferido: `api_de_entrada` não tem **nenhum** consumidor em
`src/hefesto_dualsense4unix/app/` — os únicos usos são
`prontuario_dos_jogos.py:73` e `:95`.

## O que a medição diz, e está escrita no próprio módulo

`integrations/api_de_entrada.py:12-49`, censo de 16/08/2026 sobre os **24 jogos
instalados dela**:

> *"O desenho pedido era: detectar o jogo que só fala XInput e trocar a máscara
> para Xbox sozinho. O censo mostrou que **a assinatura de disco não separa**.
> Dos 24 jogos, **14 caem no mesmo balde** … Duskfade e DON'T SCREAM têm a mesma
> assinatura na forma que importa. Um está quebrado, o outro funciona.
> **A heurística erraria em 13 dos 14.**"*

E o custo é assimétrico:

> *"marcar Xbox um jogo que entende DualSense tira cinco features de um jogo que
> funcionava; marcar DualSense um jogo XInput-only deixa a pessoa sem controle.
> Errar para o lado do DualSense preserva treze jogos e mantém um quebrado —
> que é o estado de hoje. Errar para o lado do Xbox conserta um e degrada
> treze."*

Por isso o `Veredito` do módulo tem **três** valores e nenhum deles é
`SO_XINPUT` (`:126-140`): `ENTENDE_DUALSENSE`, `INDECISO`, `SEM_EVIDENCIA`.
E o módulo declara, em `:73-78`: *"Ele **não** troca a máscara de ninguém …
Ligar o veredito à máscara é precisamente a mudança que o censo reprova, e ela
não foi feita."*

**A consequência aritmética:** um "Automático" construído sobre esta evidência
escolheria DualSense em **100%** dos casos — porque `INDECISO` e
`SEM_EVIDENCIA` só podem cair para o lado seguro. Seria um botão que não faz
nada, com um nome que promete que faz.

Regra desta casa: *hipótese tem de explicar o que JÁ funcionava*. Esta não
explica.

## O que esta sprint entrega — na ordem

**Primeiro, a pergunta a ela**, com os números acima na mesa e as três saídas:

| Saída | O que custa |
|---|---|
| **A. O Automático usa o que FUNCIONOU antes**, não o que o disco parece dizer | precisa de memória por jogo — e ela já existe em parte: `ProfileModeConfig.confirmada_por` (`schema.py:699`) grava `gesto`/`silencio`/`escolha_dela`. O Automático viraria "repete o que deu certo neste jogo", que **explica o que já funcionava** |
| **B. O Automático fica como está o produto hoje** — DualSense, e o veredito só **explica** a escolha na tela | honesto e barato; mas não é "o produto decide por jogo", é "o produto avisa" |
| **C. Implementar como escrito na decisão** | erra em 13 de 14 jogos medidos, e o erro é do lado caro |

**Depois da palavra dela**, o resto:

1. **`gamepad_flavor` ganha o terceiro valor** (`schema.py:585`, hoje
   `Literal["dualsense","xbox"] | None`), com migração — e **o `None` de hoje
   não é o Automático**: `None` é "sem opinião", e a diferença tem de
   sobreviver ao disco.
2. **O seletor com três botões** e o preço de cada um no tooltip — o texto já
   existe e tem dono único (`texto_do_custo_da_mascara`, reusado em
   `profiles_actions.py:1533`), a pedido dela: *"ao deixar o mouse sobre a opção
   Xbox, ele falaria que o Xbox não tem tais features"*.
3. **Modo e máscara conversam entre a Jogar e a Perfis** (D-AS-ABAS-CONVERSAM,
   e ela chamou a divergência de *"falha grotesca"*). O preço foi posto na mesa
   e ela escolheu assim mesmo: **continuam existindo duas cópias do fato**.
   Logo o aviso de divergência tem de ficar ligado **por construção, não por
   disciplina** — a frase já existe (`home_actions.py:1024`,
   *"a frase da divergência entre o que ela escolheu e o que o jogo vê"*).

## Como se prova (o teste que morde)

`tests/unit/test_o_automatico_nao_decide_no_escuro.py`:

1. **O portão do censo.** Sobre as evidências dos 14 jogos do balde (fixture com
   os dados do censo), o Automático **não pode** devolver `xbox` para nenhum
   deles. Mordida: faça o Automático mapear `INDECISO → xbox` e veja reprovar
   nomeando os treze que degradariam.
2. **`None` e `auto` são coisas diferentes no disco.** Grave um perfil com
   `gamepad_flavor: null` e outro com `auto`, releia, e exija que continuem
   distintos. Mordida: faça a migração converter `null` em `auto` e veja
   reprovar.
3. **Mudar a máscara na Jogar muda na Perfis, e vice-versa.** Mordida: quebre
   um dos dois sentidos e veja reprovar — o teste roda **nos dois sentidos**,
   porque foi um sentido só que produziu a "falha grotesca".
4. **O dublê sabe recusar**: sem evidência nenhuma, o Automático devolve a
   escolha segura **e diz que não sabe** — nunca um palpite calado.

**Bancada:** a máscara recria o vpad (`relancar.py:72`), e trocar máscara com o
jogo aberto já deixou ela sem controle nenhum no meio da partida
(`relancar.py:4`). `scripts/bancada.sh exigir` antes de qualquer prova viva.

## O que é dela decidir

1. **A escolha A, B ou C da tabela acima.** É a decisão inteira desta sprint.
2. **"Modo que liga" e "O jogo vê o controle como" ficam na aba Perfis?** A
   legenda do mockup diz que sim (`10-perfis.html:660`), o desenho não os mostra
   (`10-perfis.html:569-618`). Mesma pergunta da ONDA-PERFIS-01 §1 — e a
   resposta decide se esta sprint tem tela onde acontecer.
3. **Máscara por jogador** (um em Xbox, outro em DualSense na mesma mesa): a
   função que separa isso existe (`daemon/subsystems/external_mask.py:642`) e o
   Automático decidiria para a mesa inteira. Fica assim?
