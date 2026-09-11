---
sprint: O-RAIO-DA-RETIRADA-01
estado: aberta
onda: A-LISTA-DE-0911B
posse:
  O-RAIO-DA-RETIRADA-01:
    - docs/process/2026-09-11-O-RAIO-DA-RETIRADA-o-que-mais-lia-o-modo-do-perfil.md
cria:
  - docs/process/2026-09-11-O-RAIO-DA-RETIRADA-o-que-mais-lia-o-modo-do-perfil.md
bancada: false
depois_de:
  - CADEADO-E-O-FATO-01
nao_toca:
  - src/
  - mockup/
  - tests/
---

# O RAIO DA RETIRADA — quem mais lia o «Modo» do perfil?

> **ORDEM DELA, 11/09/2026:** *"veja se a remoção dessa info na aba perfil não*  <!-- noqa-acento: citação literal dela -->
> *vai quebrar o resto tambem."*  <!-- noqa-acento: citação literal dela -->

**Esta sprint NÃO escreve uma linha de produto.** Ela mede o RAIO de uma
retirada que já aconteceu e já está em `dev`. `src/`, `tests/` e `mockup/` estão
em `nao_toca`: se você achar algo quebrado, **nomeie com o endereço e pare.**

**É IRMÃ da `O-SALVAR-DA-JOGAR-01` e NÃO é a mesma pergunta.** Aquela pergunta
*«o que a Jogar grava?»*; esta pergunta *«quem mais dependia do que a Perfis
escrevia, e continua de pé?»*. Não refaça o trabalho dela; leia a entrega dela
se já existir e cite.

---

## §1 — O QUE FOI RETIRADO, exatamente

Em 11/09/2026, por ordem dela (*"em perfis ainda aparece modo. Isso deve
aparecer só na aba jogar"*), a `PERFIS-A-TELA-01` tirou do editor da aba Perfis:

| o quê | onde estava |
| --- | --- |
| o quadro «Modo» com quatro botões (*Não mexer no modo · Controlar o PC · Jogar pelo Hefesto · Conexão Nativa (Sony)*) | `interface/aba10.py` |
| o gesto `editor_modo` | `interface/pacotes/a10_perfis.py` (hoje lápide em comentário, `:2509`) |
| a constante `MODO_DO_PERFIL` | `app/actions/perfis_web.py` — saiu depois, no reparo |
| sete réguas que EXIGIAM o quadro | duas em `aba10.py` e quatro arquivos de teste |

**O campo `Profile.mode` NÃO foi tocado.** Ele continua no esquema
(`profiles/schema.ProfileModeConfig`), no disco e em quem o lê.

## §2 — AS SEIS PERGUNTAS, e cada uma tem de terminar num arquivo:linha

Para cada uma: `de pé` · `quebrado` · `não medido`.

1. **QUEM LÊ `Profile.mode` HOJE?** Levante todos os leitores em `src/` —
   daemon, `profiles/manager`, `autoswitch`, CLI, `app/actions/`, os dez
   pacotes. **A lista é o produto desta sprint.** Para cada leitor, diga se ele
   dependia do quadro retirado ou só do CAMPO (que continua lá).
2. **O `Ativar` de um perfil com `mode` gravado continua aplicando o modo?**
   É a pergunta que decide: se um perfil diz «Jogar pelo Hefesto» e ela clica
   `Ativar`, o modo entra? Meça, não leia.
3. **O AUTOSWITCH continua entrando com o modo certo?** O perfil troca sozinho
   quando o jogo abre (`profiles/autoswitch`). Se o `mode` do perfil deixou de
   ser aplicado nessa entrada, isso é quebra silenciosa — e é a pior forma,
   porque ninguém clicou nada.
4. **O `Duplicar`, o `Voltar à de ontem` e o `Importar`/`Exportar` PRESERVAM o
   `mode`?** Os três mexem no perfil inteiro. O `Voltar à de ontem`
   (`a10_perfis.py:1829`) restitui o arquivo anterior byte a byte — confira que
   ainda restitui, e que o `mode` volta junto.
5. **A SEMEADURA de perfis de jogo** (`profiles/loader.semear_perfis_dos_jogos`)
   cria perfil novo com que `mode`? E esse valor continua sendo o mesmo de antes
   da retirada?
6. **SOBROU PEÇA SEM CHAMADOR, ou CHAMADOR SEM PEÇA?** O portão `casa-sabe`
   pega parte; você pega o resto. Procure função, constante, chave de tradução,
   entrada de CSS, `data-campo` órfão e régua que ainda cite `editor_modo` ou o
   quadro. **Uma lápide em comentário NÃO é defeito** — é registro; mas uma
   régua que ainda EXIJA o quadro é.

## §3 — A ARMADILHA DESTA SPRINT, e ela é de PROSA

**O portão da paridade conta PROSA como uso** (`check_paridade_gtk_html.ocorre`,
e a `prosa_do_codigo.usa` conta string literal). Foi assim que a linha 384 ficou
verde sobre um símbolo morto até 11/09. **Então não confie em «o grep acha»:**
para cada ocorrência, diga se é CHAMADA, se é COMENTÁRIO, ou se é STRING. Um
levantamento que não separa os três repete o defeito que ele veio medir.

## §4 — O QUE O DOCUMENTO TEM DE TER

1. **A tabela dos leitores de `Profile.mode`**, com arquivo:linha e a coluna
   «dependia do quadro?».
2. **As seis perguntas respondidas**, com a prova de cada uma.
3. **A resposta em UMA frase**, que é o que ela vai ler: *o que a retirada
   quebrou, e o que continua de pé.*
4. **Se houver quebra: o endereço, o que se perde na mão dela, e quanto custa
   curar.** Não cure — `src/` está em `nao_toca`, e a decisão é dela.
5. **O que você NÃO mediu**, dito na cara.

## §5 — O QUE É DELA

**A decisão sobre o que aparecer.** Se a medição disser que nada quebrou, isto
fecha a desconfiança e não nasce trabalho. Se disser que algo quebrou, o que
fazer é dela — inclusive devolver o quadro, que foi ela quem mandou tirar.
