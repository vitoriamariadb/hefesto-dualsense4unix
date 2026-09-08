# ONDE PARAMOS — 08/09/2026: as duas levas da tela, e os cem vermelhos que portão nenhum via

> **HANDOFF.** Escrito no meio do trabalho, por ordem dela: *"sempre documenta
> pensando em caso a sessão caia"*. A §0 é o estado em uma linha; a §5 é o
> próximo comando.

## §0 — O estado

| | |
|---|---|
| Árvore de integração | `/mnt/Apate/Desenvolvimento/hefesto-voo/_integra-0609`, branch `onda/atual-0609`, em **`9d95e05c`** |
| A mesa dela | `/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix`, branch `dev`, em `20a3304a`, **instalada e rodando** |
| Portões | 49 verdes em `9d95e05c`. A leva da tela traz o **50º** |
| A suíte | **~100 vermelhos**, e portão nenhum os alcança. É o achado central do dia |

## §1 — O que fechou e está commitado

**`9d95e05c` — os quatro vermelhos que portão nenhum alcançava.** Todos da mesma
espécie: *uma régua medindo o mundo de ontem*.

1. `a10_perfis.ESPERANDO_A_PUBLICACAO` declarava três endereços que a publicação
   `44c2327e` já tinha levado ao produto. Lista virou decoração. Esvaziada.
2. `test_a_06_o_duble_decide_o_indecidivel` cobrava `conferidos == 2`; o desenho
   tem **quatro** cartões desde a leva dos quatro na mesa. A contagem agora sai
   do dono, com piso de 2 contra a varredura que acha zero e passa.
3 e 4. **O `--publicar 03` aconteceu e metade do ato ficou pendurada dois dias.**
   Ela mandou tirar o `↻` em 06/09 (*"sai"*); o desenho saiu, o gesto ficou de
   propósito enquanto o botão vivia na publicada. A publicação tirou o botão e
   ninguém tirou o dono. `test_o_reenvio_sai_do_pacote_quando_sair_do_produto`
   acendeu no dia em que venceu, e a docstring dela era o roteiro da remoção.
   Executado inteiro; `PISO_DA_ABA` 6 → 5, a **primeira queda deste piso**.

Mais: a docstring do `em_todos` dizia "PROVISÓRIO, não está na publicada" e a
mesma publicação já o tinha levado; e o `mockup/LEIA-PRIMEIRO.md` mandava rodar
`--aprovar`, que o script **recusa** desde que a direção foi consertada.

## §2 — As duas levas em voo, e o que cada uma precisa na costura

### `voo/A-TELA-DELA-01-opus` — `51e688ad`, **de_pe: TRUE**

Os quatro pontos que ela fotografou: o fundo (`width:min(100%,1600px)`, o 1600
medido em 40 PNGs), o subtítulo *"as dez abas, vivas"* fora do `HeaderBar`, o
chip do P1 cinza em fita inerte (era CSS: a terceira regra desfazia as duas
acima para `.on`) e o cadeado no canto do bloco.

Nasceu um **portão novo**, `check_a_janela_nao_confessa.py` — as duas réguas de
tela mediam o **corpo** das páginas, e a barra de título é GTK: *a régua parava
na borda da `<body>`*. Na primeira corrida ela achou o `.desktop` dizendo *"As
dez abas, com o dado do aparelho."*

**O QUE FALTA, e as duas são a MESMA coisa:** a aba 07 é posse da outra leva e
ficou de fora. Ela carrega a regra VELHA do chip e a largura VELHA (1180 contra
1600). Numa janela maximizada, ir da Sistema para a Lançadores **encolhe a
moldura em 420px na frente dela**. A regressão medida
(`test_o_gerador_reproduz_a_bancada[aba07.py]`) é a mesma causa.
→ **Cura: regerar e publicar a 07 DEPOIS de integrar a leva dos lançadores.**

**Fragilidade plantada:** `check_a_janela_nao_confessa.py:115-129` fixa
`app/tray.py` e `app/compact_window.py` em `A_MOLDURA` e levanta `SystemExit`
para caminho inexistente. Os dois estão numa pasta em demolição
(`D-0609-GTK-LEVA-INTEIRA`); no dia em que saírem, o portão **para a corrida
inteira** em vez de reprovar uma linha.

### `voo/LANCADORES-DELA-02-opus` — em voo, task `wrw1obesi`

Segunda volta. A primeira (`0bce87d4`) foi derrubada por quatro pontos; carrega
os dois defeitos confirmados mais as três decisões dela:

* **A palavra:** cartão não-localizado → `Localizar este Lançador`; botão global
  → `Adicionar novo Lançador`. Selo e botão passam a falar a mesma palavra.
* **NÃO HÁ CARTÃO DA EPIC GAMES.** Decisão final dela, *"melhor deixar so heróic
  e tirar epic games não?"*, posterior ao *"ao lado do Heroic"*.
* **O Heroic continua `(Epic · GOG)`** e vira a única porta para os dois.

## §3 — O ACHADO CENTRAL: a suíte tem ~100 vermelhos e portão nenhum os vê

O advogado do diabo da leva da tela mediu a base `20a3304a` por NOME DE TESTE,
duas vezes, em caminho real: **101 falhas**. Um laudo anterior publicou "6
pré-existentes" — ele tinha rodado 103 testes, não a suíte.

Os doze lotes desta árvore confirmam a ordem de grandeza (66 falhas em 8 lotes
no meio da medição). Saída em `/tmp/claude-1000/suite-0908/lote-*.log`.

**Isto é estrutural, não um bug:** os 49 portões rodam ~15 arquivos de teste. Os
outros 1.208 só correm quando alguém chama a suíte à mão — e a suíte não roda em
processo único, roda em doze lotes. Foi assim que os quatro da §1 atravessaram.

## §4 — O que continua aberto

1. **Triar as ~100 falhas** e separar dívida real de régua velha.
2. **As fotos do `docs/usage/assets/` estão na largura de ontem** (1180x777) e
   já estavam atrás em `20a3304a`. Rodar `interface/olhar.py --todas
   --publicado --doc` DEPOIS das duas costuras.
3. **As cinco sprints de 08/09** seguem `estado: aberta`.
4. **O ♪ pelo rádio.** Seis passadas, silêncio nas seis. A hipótese que sobra é
   de TRANSPORTE (o enquadramento HIDP/L2CAP), não de payload. O passo é
   `scripts/ensaios/o_som_que_sai.py --escrever --eu-estou-ouvindo --arranjo
   common-preservado` — e quem decide é a orelha dela.

## §5 — O próximo comando

```bash
cd /mnt/Apate/Desenvolvimento/hefesto-voo/_integra-0609
git cherry-pick 51e688ad                      # a leva da tela
# e quando a dos lançadores pousar, DEPOIS de integrá-la:
PYTHONPATH=$PWD/src .venv/bin/python src/hefesto_dualsense4unix/interface/aba07.py
scripts/check_o_desenho_aprovado.py --publicar 07
```

## §6 — As regras que este dia acrescentou

* **Arranque que não arranca prova tanto quanto régua que não mede.** Todo
  arranque confere `count() == 1` antes de escrever — três falharam em silêncio.
* **Lote montado da árvore errada morre calado.** Um arquivo inexistente aborta
  o lote inteiro, e `no tests ran` lê-se como limpo.
* **Comentário HTML NÃO ANINHA** — quinta variante da armadilha da prosa.
* **Quem publica dá a baixa no mesmo commit.** Uma declaração que envelheceu é a
  régua se desligando sem ninguém decidir isso.
