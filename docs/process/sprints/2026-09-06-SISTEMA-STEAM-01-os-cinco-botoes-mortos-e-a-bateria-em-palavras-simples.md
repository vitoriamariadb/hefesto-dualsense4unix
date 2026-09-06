---
sprint: SISTEMA-STEAM-01
estado: feita
decisoes: [D-0609-STEAM-DIVIDIDO, D-0609-MESA-E-PALAVRA]
posse:
  09B:
    - src/hefesto_dualsense4unix/interface/pacotes/a09_sistema.py
    - src/hefesto_dualsense4unix/interface/aba09.py
    - mockup/09-sistema.html
    - tests/unit/test_a_09_sistema_fecha_a_paridade.py
depois_de: [ONDA5-09-01, ONDA5-09-02, ONDA4-S10-O-TRANSPORTE-01]
nao_toca:
  - src/hefesto_dualsense4unix/interface/paginas/09-sistema.html
  - src/hefesto_dualsense4unix/app/actions/daemon_actions.py
  - src/hefesto_dualsense4unix/app/actions/footer_actions.py
  - src/hefesto_dualsense4unix/app/actions/emulation_actions.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_orcamento.py
  - src/hefesto_dualsense4unix/interface/pacotes/a07_lancadores.py
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - docs/data/paridade-gtk-html.csv
---

> **FEITA — 06/09/2026, ONDA C (agente `C-SISTEMA-STEAM-01`).** **O tique da 09
> caiu de 1.341 ms para 18,6 ms** — era o pior das dez abas —, **dois botões que
> estavam mortos respondem, clicados no produto vivo**, a frase do exame parou de
> mandar clicar num botão que não existe, e as duas linhas do Perfil de Bateria
> deixaram de ser literal, em palavras simples, como ela pediu. Quinze mordidas
> coladas. O CSV estava no `nao_toca` e o diff saiu pronto no relatório (§7.2 e
> §10), para a `PARIDADE-REMEDIR-01`. Relatório: `docs/process/agentes/2026-09-06/SISTEMA-STEAM-01.md`.

# SISTEMA-STEAM-01 · PARIDADE — os botões que estão na tela e não fazem nada, e a bateria em palavras simples

> **A decisão dela, 06/09/2026** (`D-0609-STEAM-DIVIDIDO`): *Consertar,
> Restaurar de fábrica e Aplicar aos jogos ficam na **09**.*
>
> **E sobre a bateria** (`D-0609-MESA-E-PALAVRA`), com as palavras dela: *"o
> termo sai… feature fica"*. **A tabela e a conta de slots ENTRAM — com
> palavras simples, e sem a palavra "mesa" em rótulo nenhum.**

**O defeito que dá nome a esta sprint:** três botões estão **desenhados na
página, prometendo trabalho, e o clique é morto**. O CSV registra a frase, três
vezes: *"Botão presente, sem dono. Clique morto."*

Um botão que não faz nada é pior que um botão que não existe: ele já foi
clicado, e a pessoa concluiu que o produto está quebrado.

---

## 1. O QUE SE MEDIU — as nove linhas, em três famílias

### Família A — os três cliques mortos (a página já promete)

| linha | dono no motor | estado no HTML |
| --- | --- | --- |
| **"Consertar problemas conhecidos" / "Refazer os consertos automáticos"** | `daemon_actions.py:1218` | **botão presente, sem dono, clique morto** |
| **"Tirar a sobreposição Vulkan"** | `emulation_actions.py:2086`, `:2122` | **botão presente, sem dono, clique morto** |
| **"Restaurar de fábrica"** | `footer_actions.py:1477` | botão presente, vermelho, prometendo *"Pergunta antes"*, e **sem dono** — está entre os cinco de `SEM_C[AMINHO]` |

### Família B — o que nem botão tem

| linha | dono no motor |
| --- | --- |
| **"Aplicar aos jogos da Steam"** | `daemon_actions.py:1360`, `:1373` — diálogo não-bloqueante, aplica o wrapper a todos os jogos **preservando as opções existentes**, com **backup ao lado de cada arquivo** |
| **"Este jogo não funciona" (allowlist)** | `daemon_actions.py:1717` — **é a mesma feature da 07**; aqui ela aparece pela segunda vez no CSV |
| **"Corrigir modo de execução" (migrar para systemd)** | `daemon_actions.py:2409`, `:1968` — **só aparece quando o estado é `online_avulso`**; manda SIGTERM no avulso, sobe a unit, repinta, com recibo nos dois desfechos |

### Família C — o Perfil de Bateria, que é dela e não tem tela

| linha | dono no motor | HTML hoje |
| --- | --- | --- |
| **a tabela de consequências** | `app/actions/config/secao_orcamento.py:505`, `:180` — as cinco `LINHAS_DO_TETO` × os três perfis | **duas linhas ESTÁTICAS**, derivadas na hora da GERAÇÃO da página, **sem `data-campo`** — não são vivas |
| **a conta de slots por adaptador de rádio** | `secao_orcamento.py:585`, `:621` — bloco vivo que pergunta `daemon.state_full` e responde *"cabe o que eu quero fazer?"* por adaptador | **nada nesta página** |

---

## 2. O TRABALHO, EM QUATRO PASSOS

### Passo 1 — os três cliques mortos ganham dono

Um gesto por botão, chamando o dono no motor. **Nenhum deles é uma chamada
solta:**

* **"Consertar"** roda dois scripts em worker e **mede os jogos com Steam Input
  ANTES** de mexer — o número medido depois já está fora, e um recibo que conte
  o depois mente. Leia `daemon_actions.py:1218` inteiro.
* **"Tirar a sobreposição Vulkan"** faz um censo do `system.reg` de cada
  prefixo (~1 s) e **mostra o que achou antes de mexer**. Os botões **seguem o
  que existe**: "Tirar" só aparece com camada ligada, "Devolver" só com camada
  tirada. **Um botão que oferece o que não existe é o defeito que este desenho
  já evitou uma vez.**
* **"Restaurar de fábrica"** confirma num diálogo, copia o asset, **adota como
  perfil ativo**, recarrega o rascunho e repinta todas as abas. É o gesto mais
  destrutivo da aba: o "Pergunta antes" que a página promete **é requisito**,
  não enfeite.

**A MORDIDA, para os três:** clique com o dono arrancado e prove que a régua
reprova o clique morto. É literalmente o defeito de hoje virando régua.

### Passo 2 — "Aplicar aos jogos da Steam", com o backup que o motor já faz

Reuse `daemon_actions.py:1360`. **Não reimplemente a aplicação em massa:** o
motor preserva as opções existentes de cada jogo e deixa backup ao lado de cada
arquivo. Uma segunda implementação que esqueça o backup apaga a configuração
de jogo dela sem volta.

**A MORDIDA:** aplique com dublê e prove que uma opção pré-existente sobreviveu
e que o backup nasceu.

### Passo 3 — "Corrigir modo de execução", e o botão que só aparece quando cabe

Só com o estado `online_avulso`. **Nos outros estados ele não existe** — não é
"apagado", é ausente; oferecer migração a quem já está no systemd é uma
pergunta sem sentido.

**A MORDIDA:** os dois estados, e o botão nascendo em um e não no outro.

### Passo 4 — o Perfil de Bateria, com palavras simples

Ela decidiu: **a feature fica, o termo sai.** As cinco `LINHAS_DO_TETO` × três
perfis viram uma tabela **viva** (com `data-campo`, lida do dono a cada tique —
não derivada na geração), e a conta de slots por adaptador vira um bloco que
pergunta ao daemon.

**A LÍNGUA É A DO GLOSSÁRIO, e este passo é o que mais depende dela:**

* **"mesa" não entra em rótulo nenhum** — a palavra sai da tela inteira nesta
  leva (`A-PALAVRA-MESA-SAI-01`), e escrever uma nova é fazer trabalho para
  desfazer no mesmo dia;
* **"rádio"** e **"cabo"**, nunca `bt`/`usb` (a única exceção é a contagem do
  topo, decidida por ela);
* palavra que **não está** em `A-LINGUA-DESTA-CASA` **entra lá antes** de
  entrar na tela. Se você precisar de um termo novo para explicar o teto de
  bateria, escreva a linha no glossário no **mesmo commit**.

**Frase de tela nova espera o olho dela UMA vez, no FECHO** — não peça
aprovação no meio; escreva a melhor versão e deixe-a na bancada.

**A MORDIDA:** a tabela tem de MUDAR quando o dado muda. Um dublê com outro
perfil de bateria repinta as cinco linhas; congele o valor e a régua reprova.
**A tabela estática de hoje passaria numa régua que só conte linhas** — a sua
tem de medir que o valor VEIO do dono.

---

## 3. O QUE ESTA SPRINT NÃO CONSTRÓI

* **Steam Input e a allowlist como feature da 07.** A linha *"Este jogo não
  funciona"* aparece nas duas abas do CSV; **quem a constrói é a
  `STEAM-INPUT-01`**. Aqui ela entra, se entrar, como o **mesmo** gesto — nunca
  uma segunda implementação. Se a 07 ainda não tiver fechado, **RELATE** e
  deixe a linha para ela.
* **O recibo do gesto (barra de estado / toast).** É o **terceiro lugar do
  recado**, e ele é da `ONDA5-P-01` (onda A). Você **usa** o canal; não cria um
  segundo.
* **O CSV da paridade.** É da `PARIDADE-REMEDIR-01`. Você RELATA.

## 4. NADA SE PERDEU

* **Os quatro botões da coluna do serviço**, nesta ordem: Retomar · Reiniciar o
  serviço · Atualizar · Parar o serviço (`ONDA5-09-01` trava o número).
* **Os três cinzas** e o `?` dentro da `.acao` — a régua que os CONTA
  (`aba09.py:1638-1648`) continua valendo: um `?` fora do invólucro vira
  fileira numa coluna de flex, e as duas colunas irmãs param de acabar no mesmo
  `y`. Foi o vão de 58px que ela apontou em 31/08.
* **A dica que não diz mais *"Não muda nada"*** e a guarda literal dela.
* **O que a `ONDA5-09-02` entregou** — o "Atualizar" que faz o que promete.

## A PROVA DE TELA — obrigatória

1. **A FOTO** antes e depois, `--oculta`.
2. **O CLIQUE**: os três botões que estavam mortos, respondendo; a tabela de
   bateria mudando com o dado.
3. **A MORDIDA** colada, uma por passo.
4. **NO TEMPO**: a régua de mutações da `A-TELA-SAMBA-01`. A tabela viva é
   exatamente o tipo de bloco que reconstrói o miolo a cada tique — **prove que
   o seu não reconstrói quando o valor não muda.**
