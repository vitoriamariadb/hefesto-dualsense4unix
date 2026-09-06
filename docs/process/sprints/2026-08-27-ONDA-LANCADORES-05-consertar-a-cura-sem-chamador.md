---
sprint: ONDA-LANCADORES-05
estado: absorvida
onda: ABA-LANCADORES
posse:
  L5:
    - src/hefesto_dualsense4unix/app/actions/lancadores_actions.py
cria:
  - docs/process/sprints/2026-08-27-ONDA-LANCADORES-05-consertar-a-cura-sem-chamador.md
  - tests/unit/test_lancadores_consertar.py
bancada: true
depois_de:
  - ONDA-LANCADORES-01
  - ONDA-LANCADORES-03
  - ONDA-LANCADORES-04   # o mesmo arquivo, e o botão nasce na mesma fileira
nao_toca:
  - src/hefesto_dualsense4unix/integrations/prontuario_dos_jogos.py
  - src/hefesto_dualsense4unix/integrations/steam_launch_options.py
  - src/hefesto_dualsense4unix/gui/main.glade
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 07). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA LANÇADORES · 05 — "Consertar": a cura escrita que nunca teve chamador

**O defeito, em uma frase:** `curar_o_que_e_automatico` conserta sozinho desde
19/08 e **nenhuma linha de `src/` o chama**.

**Medido hoje** — `grep -rn prontuario_dos_jogos src scripts install.sh` devolve
11 linhas: quatro são prosa (`schema.py:668`, `steam_input_ponte.py:5`,
`ponte_escada.py:123`, `hotkey.py:458`) e sete são o `levantar_censo` do cartão
de saúde (`daemon_actions.py:807-822`, `:1131`). **Do `curar_o_que_e_automatico`
(`prontuario_dos_jogos.py:885`): zero chamadores.** É a linha que o redesenho
marca em negrito — *"sem nenhum chamador"*.

## O que entrega

O botão **"Consertar"** (verde) na linha do lançador impedido
(`layout/07-lancadores.html:491-503`). Ele roda em thread e:

- repõe o `hefesto-launch` nas `LaunchOptions` (`_curar_sem_wrapper`) e grava a
  exceção do Steam Input (`_curar_excecao_inerte`) — a tabela `_CURAS`
  (`prontuario_dos_jogos.py:877-881`) é quem despacha;
- **respeita o instante de cada cura**: a ponte só sobrevive com a Steam
  fechada, e a cura devolve `adiado` nesse caso (`:808`, `:902`);
- **diz o que aconteceu com as palavras que já existem**: `Cura.frase()`
  (`:828-841`) separa "Consertei", "faço assim que ela fechar", "só se conserta à
  mão" e o "(simulação: nada foi escrito)". Não escreva texto novo — mostre este.

**Sem senha e sem fechar nada:** as duas curas escrevem no `localconfig.vdf` do
próprio usuário, com backup ao lado e `tmp`+`replace`.

## A mordida

`tests/unit/test_lancadores_consertar.py`:

1. Cura dublada devolvendo `CURA_ADIADA` → a tela **não** diz "consertado"; diz
   que faz assim que a Steam fechar. Arranque a checagem de status (faça o toast
   ser sempre o de sucesso) → o teste reprova. É a família exata do defeito que
   um conferente pegou em 23/08: *"Aplicar e fechar" ficou idêntico a "Fechar sem
   aplicar"* (COMO-EXECUTAR-UMA-SPRINT §9).
2. Cura dublada com `manuais=[linha_intocavel]` e nada automático → a tela diz
   que sobrou reparo à mão, **nomeando-o**. Silêncio aqui é o que faz a pessoa
   achar que está tudo resolvido.
3. **O portão da casa:** `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py`
   passa a listar `curar_o_que_e_automatico` como LIGADA. Leia o cabeçalho dele
   antes de mexer.

**Bancada:** `true`. A prova de ponta a ponta escreve no `localconfig.vdf` da
máquina dela e depende do estado da Steam — `scripts/bancada.sh exigir` antes.

## O que é dela decidir

- **O "Consertar" aparece em dois lugares?** A tabela do redesenho manda a cura
  automática para **Lançadores e Sistema**, e na Sistema já existe o "Consertar
  problemas conhecidos". Duplicar botão foi o defeito mais caro do desenho
  antigo — ela decide se o daqui é o mesmo gesto com outro alcance (por lançador)
  ou se um dos dois sai.
