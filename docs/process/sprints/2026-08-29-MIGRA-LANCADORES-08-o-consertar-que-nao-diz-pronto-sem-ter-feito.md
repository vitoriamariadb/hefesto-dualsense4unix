---
sprint: MIGRA-LANCADORES-08
estado: absorvida
onda: MIGRA-LANCADORES
posse:
  ML8:
    - src/hefesto_dualsense4unix/app/telas/lancadores.py
    - tests/unit/test_migra_lancadores_08_o_consertar.py
cria:
  - tests/unit/test_migra_lancadores_08_o_consertar.py
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
  - MIGRA-LANCADORES-07
nao_toca:
  - src/hefesto_dualsense4unix/integrations/prontuario_dos_jogos.py
  - src/hefesto_dualsense4unix/integrations/sentinela_do_wrapper.py
  - src/hefesto_dualsense4unix/app/actions/carona_do_wrapper.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/daemon/
  - scripts/telas/aba07.py
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 07). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA LANÇADORES · 08 — o "Consertar", e por que ele não pode dizer "pronto"

**O defeito:** a cura está escrita, testada, com tabela de despacho — e **nunca
foi ligada**. É o defeito mais caro desta casa no exemplar mais puro que ela tem.

Medido agora, `grep -rn curar_o_que_e_automatico src/ tests/`:

```
src/…/integrations/prontuario_dos_jogos.py:56    (a docstring do módulo)
src/…/integrations/prontuario_dos_jogos.py:885   (a definição)
src/…/integrations/prontuario_dos_jogos.py:1019  (o `main()` do próprio módulo)
tests/unit/test_ponte_steam_input_01_a_lista_que_so_preservava.py:431
```

**Zero chamadores de produção.** A tabela `_CURAS` (`:879`) despacha
`_curar_excecao_inerte` (`:843`) e `_curar_sem_wrapper` (`:856`).

E **metade já roda invisível**: `_curar_sem_wrapper` delega a
`sentinela_do_wrapper.reparar_ou_adiar` (`:448`), que
`app/actions/carona_do_wrapper.py:300` chama como carona do Salvar/Aplicar
perfil — sem botão nenhum, sem a pessoa saber.

**E o risco herdado, que é o assunto do título.** `curar_o_que_e_automatico`
devolve `CURA_ADIADA` quando a Steam (ou um jogo) está aberta, e
`carona_do_wrapper.py:296` recusa pelo mesmo portão — a ordem não é negociável:
**jogo aberto antes de Steam aberta**, porque fechar a Steam com jogo aberto
mataria o jogo e o progresso não salvo. Como a pessoa clica no Hefesto
justamente **enquanto joga**, o adiamento é o caminho **mais comum**.

Esta casa já curou esse exato defeito uma vez: `HONESTIDADE-STEAM-01`, no toast
do "Aplicar correções" (`daemon_actions.py`, `format_fix_safe_result`), que dizia
*"Correções aplicadas"* inclusive quando tudo tinha sido adiado. **O botão novo
herda o risco inteiro.**

## O que entrega

1. **O botão existe e chama a cura.** `data-acao="consertar"` →
   `curar_o_que_e_automatico(censo=<o censo da 06>)`. O censo é passado, não
   relevantado: a função aceita `censo=` justamente para isso (`:885`).
2. **O botão só nasce onde o conserto resolve.** Um cartão só o ganha se tiver
   estorvo com `automatica=True`. É o princípio que a `ONDA-SISTEMA-02` fixou
   para o autoteste do gamepad virtual — *o botão do conserto só nasce no estado
   que o conserto resolve* —, e aqui ele economiza dois botões inúteis por tela.
3. **A tela diz o que aconteceu, com o vocabulário do próprio módulo.**
   `Cura.frase()` (`:827`) já distingue os quatro desfechos, e o texto do
   adiamento já está escrito lá: *"Tenho conserto para fazer, mas a Steam (ou um
   jogo) está aberta — faço assim que ela fechar."* A tela **lê** essa frase.
4. **O que sobrou manual é nomeado.** `Cura.manuais` volta com as chaves que só
   se consertam à mão; a tela as mostra com a cura de `_ESTORVOS` ao lado (a
   ligação que a 07 fez). Silêncio aqui é o que faz a pessoa achar que está tudo
   resolvido.
5. **A escrita sai da linha do GTK.** A cura escreve em disco e pode fechar
   processos; a aba não congela, e o botão fica inerte enquanto ela corre.

## Como se prova — a mordida

`tests/unit/test_migra_lancadores_08_o_consertar.py`:

1. **Adiado nunca vira "pronto".** Dublê devolvendo `CURA_ADIADA` → a tela mostra
   a frase do adiamento e **não** contém "Consertei" nem "Correções aplicadas".
   **Mordida:** troque a leitura do status por um texto fixo de sucesso →
   reprova. É a `HONESTIDADE-STEAM-01` refeita no botão novo.
2. **O botão não nasce sem cura automática.** Censo com só `LINHA_INTOCAVEL`
   (automática = `False`, `_ESTORVOS`) → nenhum `data-acao="consertar"` na
   página; com `SEM_WRAPPER`, ele aparece.
   **Mordida:** desenhe o botão sempre → reprova, com a citação da SISTEMA-02.
3. **O censo é reaproveitado.** Dublê que conta chamadas de `levantar_censo` →
   clicar em "Consertar" **não** levanta um segundo censo.
   **Mordida:** chame `curar_o_que_e_automatico()` sem `censo=` → reprova, e o
   custo é uma varredura de biblioteca inteira por clique.
4. **O manual é nomeado.** Censo com dois estorvos manuais → os dois aparecem com
   nome e com a cura de `_ESTORVOS`.
   **Mordida:** engula os manuais → reprova.
5. **Não congela.** Dublê que dorme 2 s na cura → o handler retorna antes e o
   botão fica inerte.
   **Mordida:** chame direto → reprova por tempo.

## O que é dela decidir

- **O "Consertar" também fica na aba Sistema, ou só aqui?** Metade da cura já
  roda invisível como carona do Salvar (`carona_do_wrapper.py:300`), e a Sistema
  já guarda os cinco botões de Steam que ela decidiu manter lá
  (`D-A-ABA-LANCADORES-NASCE-PLACEHOLDER`, decisão dela contra a recomendação de
  quem coordenava — **não reabrir a parte já respondida**). Dois caminhos para a
  mesma cura é o **P6** do redesenho, e duplicar botão foi o defeito mais caro do
  desenho antigo. A pergunta que sobra é só esta: **um dono, ou dois?**
- **Se o produto deve DIZER que a cura já roda sozinha no Salvar.** Hoje ela roda
  e ninguém conta. Contar é bom para quem quer entender; é também mais uma frase
  numa tela que o redesenho existe para enxugar.
