# ONDE PARAMOS — 08/09/2026: as duas levas da tela, e os cem vermelhos que portão nenhum via

> **HANDOFF.** Escrito no meio do trabalho, por ordem dela: *"sempre documenta
> pensando em caso a sessão caia"*. A §0 é o estado em uma linha; a §5 é o
> próximo comando.

## §0 — O estado

| | |
|---|---|
| Árvore de integração | `/mnt/Apate/Desenvolvimento/hefesto-voo/_integra-0609`, branch `onda/atual-0609`, em **`2129b797`** |
| A mesa dela | `/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix`, branch `dev`, em `20a3304a`, **instalada e rodando** |
| Portões | **51 verdes**, árvore limpa |
| **A conferência dela** | **7 ✓ / 0 falta — a coluna da direita está VAZIA.** Liberada para o merge |
| A suíte | **98 → 8 vermelhos.** As três frentes de QA entraram e a costura foi medida |
| Falta para o merge | só a leva das RESSALVAS (`w1f3uydal`) pousar — quatro frentes |
| **Ordem dela** | **o `install.sh` roda no fim**, na árvore dela. Ver a §5 |

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

### `voo/A-TELA-DELA-01-opus` — DENTRO, em `d63bbd73`

Os quatro pontos que ela fotografou: o fundo (`width:min(100%,1600px)`, o 1600
medido em 40 PNGs), o subtítulo *"as dez abas, vivas"* fora do `HeaderBar`, o
chip do P1 cinza em fita inerte (era CSS: a terceira regra desfazia as duas
acima para `.on`) e o cadeado no canto do bloco.

Nasceu um **portão novo**, `check_a_janela_nao_confessa.py` — as duas réguas de
tela mediam o **corpo** das páginas, e a barra de título é GTK: *a régua parava
na borda da `<body>`*. Na primeira corrida ela achou o `.desktop` dizendo *"As
dez abas, com o dado do aparelho."*

**AS DUAS RESSALVAS FECHARAM EM `1bebb847`.** A aba 07 era posse da outra leva e
ficou de fora, com a regra VELHA do chip e a largura VELHA — numa janela
maximizada, ir da Sistema para a Lançadores encolhia a moldura em 420px na
frente dela. Depois de integrar os lançadores, a 07 foi regerada e publicada:
`.janela` em `min(100%,1600px)` como as outras nove, chip cinza em fita inerte,
e a regressão (`test_o_gerador_reproduz_a_bancada[aba07.py]`) fechou junto.

**Fragilidade plantada:** `check_a_janela_nao_confessa.py:115-129` fixa
`app/tray.py` e `app/compact_window.py` em `A_MOLDURA` e levanta `SystemExit`
para caminho inexistente. Os dois estão numa pasta em demolição
(`D-0609-GTK-LEVA-INTEIRA`); no dia em que saírem, o portão **para a corrida
inteira** em vez de reprovar uma linha.

### `voo/LANCADORES-DELA-02-opus` — DENTRO, em `d1f17040` + `1bebb847`

Segunda volta, `de_pe: true`. **Integrada como PAR** (`cbb3a697..branch`): a
primeira volta era a base da segunda, e um cherry-pick do commit de cima
sozinho dá conflito nos sete arquivos. As três decisões dela:

* **A palavra:** cartão não-localizado → `Localizar este Lançador`; botão global
  → `Adicionar novo Lançador`. Selo e botão passam a falar a mesma palavra.
* **NÃO HÁ CARTÃO DA EPIC GAMES** — e a frase que sustentou isso, *"melhor deixar so heróic
  e tirar epic games não?"*, era uma PERGUNTA dela, não decisão: ela cobrou à noite
  (*"como assim caducou por decisão minha?"*). Fica em aberto na LANCADORES-DELA-01.
* **O Heroic continua `(Epic · GOG)`** e vira a única porta para os dois.

### OS TRÊS RESÍDUOS DO CONFERENTE — fechados em `1bebb847`

1. **O «Tirar daqui» da Steam não tinha régua nenhuma.** Arrancar o botão
   inteiro deixava 76 testes verdes. *Um botão que se pode apagar com a suíte
   verde não está entregue.*
2. **O beco estava fechado em UM estado de três, e o aberto era o da máquina
   dela.** A recusa citava o «Localizar este Lançador», que o cartão só mostra
   quando o Hefesto não achou. A régua ficava verde porque montava uma `Leitura`
   vazia — *uma régua que só mede o estado em que a cura foi escrita não mede a
   cura*. Agora a frase pergunta ao cartão, e quando nenhum botão serve ela diz
   o fato e para.
3. **A tela oferecia um campo que ela digita e o produto joga fora, calado.** O
   produto passou a dizer o que descartou. **Esconder o campo seria melhor, e é
   PIXEL — decisão dela.**

### AS TRÊS REGRESSÕES QUE A INTEGRAÇÃO CRIOU — `2129b797`

**Nenhum dos três conferentes as viu**, e a razão é estrutural: cada um mediu a
PRÓPRIA frente, isolada, contra a base. *Conferente que mede a frente isolada não
vê o que a integração cria* — só quem costura ocupa essa posição.

1 e 2. **A citação dela foi CORRIGIDA ao ser citada.** A leva dos lançadores
   trouxe o pedido dela do botão novo para o código e limpou a digitação dela.
   O `noqa-acento` que sobrou ficou mudo e estourou o teto dos escapes.
   Restaurada como ela escreveu. **Nesta casa a fala dela não se limpa.**
3. **O dublê do co-op vazava — reincidência de 04/09.** `external_mask` é
   importado TARDE, nascia dentro da janela do `monkeypatch` e copiava o dublê;
   o `undo` desfaz o que ele trocou, não o que nasceu torto. **A mordida
   revelou que o dublê nunca foi preciso** — 37 testes passam com a função real.
   Saiu inteiro. *Um dublê que não muda nenhum resultado só pode esconder.*

## §3 — O ACHADO CENTRAL: a suíte tinha ~100 vermelhos e portão nenhum os via

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

A leva de QA (`wt8dg1u48`) é a última coisa entre esta árvore e o `dev`. Quando
ela pousar, conferir os três vereditos e integrar; depois:

```bash
cd /mnt/Apate/Desenvolvimento/hefesto-voo/_integra-0609
PYTHONPATH=$PWD/src <python> src/hefesto_dualsense4unix/interface/olhar.py \
    --todas --publicado --doc          # as fotos do README, na largura nova
PYTHONPATH=$PWD/src <python> scripts/check_a_conferencia_dela.py   # o portão do merge
git add -A && bash scripts/portoes.sh  # 50 verdes
```

E O FIM É ORDEM DELA — *"não esquece do install ao fim também"*, 08/09/2026.
O merge e o install são na ÁRVORE DELA, que fica em `dev` e não troca de branch:

```bash
cd /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix
git merge onda/atual-0609
./install.sh --yes        # NUNCA com sudo: o HOME viraria /root
```

**A senha dela entra no `sudo` que o PRÓPRIO `install.sh` pede** (os três módulos
DKMS), nunca antes do comando. E ele reinicia o daemon — que é o único momento em
que isso é permitido, porque é o install que o faz, não nós.

## §6 — As regras que este dia acrescentou

* **Arranque que não arranca prova tanto quanto régua que não mede.** Todo
  arranque confere `count() == 1` antes de escrever — três falharam em silêncio.
* **Lote montado da árvore errada morre calado.** Um arquivo inexistente aborta
  o lote inteiro, e `no tests ran` lê-se como limpo.
* **Comentário HTML NÃO ANINHA** — quinta variante da armadilha da prosa.
* **Quem publica dá a baixa no mesmo commit.** Uma declaração que envelheceu é a
  régua se desligando sem ninguém decidir isso.
