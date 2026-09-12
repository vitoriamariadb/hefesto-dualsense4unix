---
sprint: PERFIL-DOS-LANCADORES-E1
estado: feita
onda: A-LINGUA-DA-TELA
posse:
  PERFIL-DOS-LANCADORES-E1:
    - src/hefesto_dualsense4unix/profiles/loader.py
    - src/hefesto_dualsense4unix/profiles/schema.py
    - src/hefesto_dualsense4unix/integrations/jogos_locais.py
cria: []
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/interface/
  - install.sh
---

> **ESTADO 12/09/2026: feita** — medido com `git cherry` contra
> `onda/0911c`: `voo/PERFIL-DOS-LANCADORES-E1-opus` não tem um único commit fora da costura.
> O carimbo não é de quem entregou; é da MEDIÇÃO. Quatro irmãs desta
> mesma leva continuam `aberta` justamente por falharem nela.

# PERFIL-DOS-LANCADORES-E1 — todo jogo instalado ganha perfil, venha de onde vier

Nasce da **A SEGUNDA LISTA DELA** (11/09/2026).

---

## A QUEIXA, e ela veio com a foto

Ela digitou `guar` na lupa da aba Perfis procurando **Guardians of the
Galaxy** — que está instalado, pelo Heroic — e a lista voltou **vazia**: *"27
fora da busca"*. Então mandou:

> *"os demais jogos de outros lançadores deve aparecer um perfil*  <!-- noqa-acento: citação literal dela -->
> *automaticamente aqui na nossa guia de perfil. Pode fazer isso?"*  <!-- noqa-acento: citação literal dela -->

E, posta a escolha entre semear todos, semear ao abrir o jogo ou deixar como
está, ela decidiu:

> *"2-a e se por algum motivo não encontrar eu posso criar ou criar um perfil*  <!-- noqa-acento: citação literal dela -->
> *duplicado do mesmo jogo."*  <!-- noqa-acento: citação literal dela -->

**A SEGUNDA METADE DA FRASE É REQUISITO, não ressalva.** Ela tem de poder criar
à mão o que a semeadura não achar — e criar um perfil para um jogo que **já
tem** perfil não pode ser recusado nem sobrescrever o que está lá. Os dois
convivem, e a prioridade decide qual vence.

## O QUE JÁ EXISTE — medido em 11/09, não presumido

O caminho inteiro está pronto e vivo. **Falta UM elo.**

| peça | onde | estado |
| --- | --- | --- |
| quem semeia perfil sozinho | `profiles/loader.py:1298` (`semear_perfis_dos_jogos`) | **lê SÓ a Steam** — é o elo que falta |
| a decisão por jogo | `profiles/loader.py:1369` (`_semear_um_jogo`) | pronta |
| o perfil que nasce | `profiles/loader.py:1223` (`_perfil_do_jogo`) | nome + match + prioridade 80 |
| a chave gravada | `profiles/loader.py:1213` (`classes_do_perfil_do_jogo`) | devolve `[f"steam_app_{appid}"]` — **só isso existe** |
| a escrita sem pisar | `profiles/loader.py:1256` (`_gravar_sem_pisar`) | `os.link` atômico, nunca sobrescreve |
| a marca de já-semeado | `MARCA_DE_SEMEADURA_DE_JOGOS`, `loader.py:994` | appid marcado nunca renasce |
| o censo dos outros | `integrations/censo_dos_lancadores.py` | **pronto e vivo** — Heroic, Lutris, RetroArch, Dolphin, mGBA |
| a tradução para perfil | `integrations/jogos_locais.py:498` (`jogos_dos_lancadores`) | **pronta** |
| a chave de janela | `censo_dos_lancadores.py:119` (`classe_de_janela`) | basename do executável |
| o `match` que serve | `profiles/simple_match.py:271` — forma `"janela"` | `MatchCriteria(window_class=[...])` |

## O QUE ENTREGAR

### 1. A semeadura passa a ler os outros lançadores

`semear_perfis_dos_jogos` soma, à biblioteca da Steam, os jogos **instalados**
dos lançadores que o censo lê e que têm `classe_de_janela` — e para cada um
grava um perfil com `MatchCriteria(window_class=[<a classe>])`.

**O QUE NÃO ENTRA, e cada exclusão tem razão:**

* **jogo não instalado** — a biblioteca do Heroic tem 29 e só 1 está no disco.
  Semear os 28 que ela não pode abrir enche a lista de linhas mortas;
* **DLC e redistribuível** — `JogoDoLancador.e_acessorio` (`:172`) já os marca;
* **jogo sem `classe_de_janela`** — os emuladores (RetroArch, Dolphin, mGBA)
  rodam todas as ROMs no mesmo processo, e `classe_de_janela` devolve `""`.
  Um perfil por ROM casaria com o emulador inteiro. **Fica de fora e o
  relatório diz quantos ficaram.**

### 2. A marca de já-semeado passa a valer para eles

Hoje ela guarda appid. Um jogo de lançador não tem appid — ele tem a chave
nativa do lançador. **A marca tem de distinguir os dois**, senão um `gotg.exe`
e um `steam_app_gotg.exe` disputam a mesma linha do arquivo.

**E a razão de a marca existir é dela:** um perfil que ela APAGOU não pode
renascer no tique seguinte.

### 3. A troca automática aceita perfil de jogo que não é da Steam

`profiles/schema.py:1799` corta: `if steam_appid_from_wm_class(wm_class) is
None: return False`. Com a trava do perfil ativo armada, **o perfil do Heroic
nasce e não entra quando ela abre o jogo** — o pior dos dois mundos: a linha
aparece na lista e não faz nada.

**MEÇA O QUE ESSA LINHA PROTEGIA antes de mexer.** Ela é de quando «perfil de
jogo» e «perfil da Steam» eram sinônimos; hipótese tem de explicar o que já
funcionava.

### 4. Criar à mão o que a semeadura não achou

A segunda metade da frase dela. Prove, com teste, que:

* criar um perfil para um jogo que **já tem** perfil semeado **não é recusado**;
* o perfil dela **não é sobrescrito** pela semeadura seguinte;
* os dois convivem e a prioridade decide.

## COMO PROVAR — e a prova é o BYTE, não o retorno

* o `.json` no disco, lido com `json.load`, com a `window_class` certa;
* a conta: quantos perfis existiam antes, quantos nasceram, de que lançador;
* **a mordida**: arranque a leitura dos lançadores e veja a régua reprovar.

**E A SUÍTE DELA MIGRA O PERFIL REAL.** Nunca rode o piloto nem o daemon vivo
para testar isto: `tests/conftest.py` desvia `HOME` e os quatro `XDG_*` para um
lar de mentira, e é lá que esta sprint se mede.

## O QUE NÃO FAZER

* **Não toque na interface.** A lista da aba Perfis já mostra o que estiver no
  disco; se o perfil nasce, ele aparece.
* **Não mexa no que a Steam já faz.** A semeadura dela funciona há semanas.
* **Não crie botão** para semear. Palavra dela sobre a semeadura da Steam, que
  vale igual aqui: *"é automático, e não um botão"*.

---

## O QUE VALE PARA TODA FRENTE DESTA ONDA

1. A tela dela é UMA SÓ e ela está usando a máquina. `--oculta` em toda janela.
2. Uma branch sua (`voo/PERFIL-DOS-LANCADORES-E1-opus`), árvore própria. Não
   toque em `dev`, não faça merge, não rode `install.sh`.
3. `git add -A` e `bash scripts/portoes.sh` antes de fechar.
4. Saída de comando vai para arquivo, nunca crua.
5. O índice da onda:
   `docs/process/sprints/2026-09-11-A-SEGUNDA-LISTA-DELA-a-lingua-da-tela-e-a-paridade-INDICE.md`
