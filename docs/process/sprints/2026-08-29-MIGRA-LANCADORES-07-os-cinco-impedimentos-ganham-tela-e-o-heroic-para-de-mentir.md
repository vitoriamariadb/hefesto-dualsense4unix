---
sprint: MIGRA-LANCADORES-07
onda: MIGRA-LANCADORES
posse:
  ML7:
    - src/hefesto_dualsense4unix/app/telas/lancadores.py
    - tests/unit/test_migra_lancadores_07_os_impedimentos.py
cria:
  - tests/unit/test_migra_lancadores_07_os_impedimentos.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-02
  - MIGRA-CONTROLES-01
  # O ENXERTO DESTA ABA: é ele quem cria `app/telas/lancadores.py`,  <!-- ref-externa: nasce na MIGRA-LANCADORES-01, ainda não executada -->
  # que da 05 à 10 é escrito EM SÉRIE por ser um arquivo só.
  - MIGRA-LANCADORES-01
  - MIGRA-LANCADORES-02
  - MIGRA-LANCADORES-03
  - MIGRA-LANCADORES-04
  - MIGRA-LANCADORES-05
  - MIGRA-LANCADORES-06
nao_toca:
  - src/hefesto_dualsense4unix/integrations/prontuario_dos_jogos.py
  - src/hefesto_dualsense4unix/app/actions/daemon_actions.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/daemon/
  - scripts/telas/aba07.py
---

# MIGRA LANÇADORES · 07 — os cinco impedimentos ganham tela, e o Heroic para de mentir

**O defeito tem duas metades, e a segunda é pior que a primeira.**

**Primeira metade — quatro dos cinco nunca foram renderizados.**
`prontuario_dos_jogos.py:139-143` nomeia os cinco impedimentos (`SEM_WRAPPER`,
`LINHA_INTOCAVEL`, `SEM_EXECUTAVEL`, `EXCECAO_INERTE`, `PONTE_DIVERGENTE`), e
`_ESTORVOS` (`:146`) traz **o texto pronto de cada um, com a cura ao lado e se
ela é automática**. Um só chega à tela: `ponte_divergente`, por
`daemon_actions.py:757`, numa linha do cartão "Saúde do sistema" da aba Sistema.

**Segunda metade — o cartão do Heroic carimba uma causa que só a Steam tem.**
No mockup aprovado (`layout/07-lancadores.html:599-610`) o Heroic é o
**único cartão laranja da tela**, e a causa é *"Sem wrapper"*. Essa causa nasce
de `Prontuario.tem_wrapper` (`prontuario_dos_jogos.py:395`), que lê a
`LaunchOptions` do `localconfig.vdf` — Steam. E `levantar_censo` (`:733`) só abre
`discover_vdfs` (`:755`) e `appmanifest_*.acf` (`:781`).

**Não existe uma linha no produto que leia configuração do Heroic.** Servir essa
frase é pôr causa de Steam num lançador que não é Steam — **no cartão que ela vai
olhar primeiro**, porque é o único colorido.

## O que entrega

1. **A frase de causa é LIDA, nunca digitada.** O `data-campo="diz"` de cada
   cartão sai de `_ESTORVOS` (`:146`), com o texto e a cura que já estão escritos
   lá. Mudou lá, mudou na tela — nenhuma segunda cópia.
2. **Um lançador sem régua própria mostra "não sei o que impede".** Regra dura:
   um estorvo cuja fonte é o `vdf`/`.acf` da Steam **só** pode aparecer no cartão
   da Steam. Os outros quatro nascem sem causa, com a frase honesta e a dica
   dizendo o que faltaria para saber.
3. **"Ver o que impede"** (`data-acao="ver-impede"`, no cartão do impedido) abre
   o detalhe: o que é, **a cura ao lado** e se ela é automática — os três campos
   que `_ESTORVOS` já carrega. Diagnóstico sem cura ao lado só transfere o
   trabalho para ela, e é por isso que aquela tabela nasceu com três colunas.
4. **Nomeia, nunca só conta.** `Censo.frase()` (`:579`) já aplica a regra do
   `WRAPPER-EM-TODOS-01` e existe por um motivo com nome próprio: *"3 jogos com
   pendência"* é o texto que deixou o Pragmata quebrado a noite inteira. A tela
   herda a regra.
5. **A moldura do cartão acompanha a frase.** `data-estado="impede"` e o selo
   mudam **juntos** com o texto — selo e frase discordando na mesma linha é
   exatamente o desalinho que ela enxerga (a cicatriz do `SELOS` no gerador,
   quando o selo dizia `CHEGA` e o corpo falava dos quatro).

**O que esta sprint NÃO faz:** não conserta nada (é a 08) e não decide o selo
(é a 10). Aqui o cartão só ganha **causa**.

## Como se prova — a mordida

`tests/unit/test_migra_lancadores_07_os_impedimentos.py`:

1. **A frase vem de `_ESTORVOS`.** Censo dublê com um jogo `SEM_WRAPPER` → o
   `diz` do cartão da Steam é **literalmente** o texto de
   `_ESTORVOS[SEM_WRAPPER][0]`, lido do módulo pelo próprio teste.
   **Mordida:** troque a frase no módulo de origem e **não** mude o teste — ele
   continua verde. Agora digite a frase dentro de `app/telas/lancadores.py` → um  <!-- ref-externa: nasce na MIGRA-LANCADORES-01, ainda não executada -->
   teste-irmão, que compara a tela contra a fonte, **reprova**.
2. **Causa de Steam nunca cai em lançador que não é Steam.** Censo com dois jogos
   impedidos e um cartão de Heroic presente → o cartão do Heroic tem
   `diz == "não sei o que impede"` e `data-estado != "impede"`.
   **Mordida:** arranque o filtro de procedência → o Heroic volta a mostrar
   *"Sem wrapper"* e o teste reprova. **Este é o teste que justifica a sprint.**
3. **Os cinco chegam.** Um censo por impedimento → os cinco aparecem, cada um com
   a sua cura e a sua marca de automática.
   **Mordida:** deixe um de fora do despacho → reprova nomeando qual.
4. **Nomeia.** Três jogos impedidos → a tela traz os **nomes**, não só a
   contagem.
   **Mordida:** troque por `f"{n} jogos com pendência"` → reprova, com a citação
   do Pragmata.

## O que é dela decidir

- **A frase do "não sei o que impede".** É texto novo em tela, num cartão que ela
  aprovou com outra frase — **ESTRUTURAL** pelo carimbo D3, passa por ela antes.
  E o preço tem de ir junto: **o cartão do Heroic deixa de ser laranja** e a
  conta do quadro deixa de dizer *"1 com impedimento"* até haver régua para ele.
  Ela precisa saber disso **antes** de ver a foto, não ao vê-la.
- **Se o Heroic ganha varredura própria em vez da frase honesta.** É trabalho
  novo — ler a configuração do Heroic —, e a alternativa é a mesma da 06: régua
  de verdade, ou instrumento que mente. Não há terceira.
