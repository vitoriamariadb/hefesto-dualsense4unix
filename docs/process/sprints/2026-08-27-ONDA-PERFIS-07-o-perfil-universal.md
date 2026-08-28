---
sprint: ONDA-PERFIS-07
# onda: PERFIS
posse:
  P7:
    - src/hefesto_dualsense4unix/profiles/loader.py
    - assets/profiles_default/
cria:
  - docs/process/sprints/2026-08-27-ONDA-PERFIS-07-o-perfil-universal.md
  - assets/profiles_default/universal.json
  - tests/unit/test_o_universal_toma_o_lugar_dos_dois.py
bancada: false
depois_de:
  - ONDA-PERFIS-02          # loader.py: a migração dos ambientes vem antes
  - ONDA-PERFIS-04          # loader.py e assets/profiles_default/
  # SÉRIE, por R5: esta sprint divide assets/profiles_default/
  # e assets/profiles_default/universal.json
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-NAVEGACAO-05
  - IDENTIDADE-01  # fechou em 54b7ffd2 (o app-id e a migração); a série é nominal
  - LEVA-2  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/app/
  - src/hefesto_dualsense4unix/gui/
  - src/hefesto_dualsense4unix/daemon/
---

# ONDA PERFIS · 07 — o Universal toma o lugar de `fallback` e `meu_perfil`

**O defeito em uma frase:** o produto semeia **dois** perfis que dizem a mesma
coisa — "vale sempre" — com nomes que não explicam nada, e os dois entram na
disputa contra os perfis de jogo dela.

## Medido no disco

`assets/profiles_default/fallback.json` e `meu_perfil.json` têm o **mesmo**
`match: {"type": "any"}`. Diferem em `priority` (0 e 1) e em duas cores. Os dois
são semeados por `loader.py:140` (`seed_default_presets`).

O custo já está escrito no código, no comentário de `profiles_actions.py:317-330`
— quatro perfis dizendo "Sempre" ao mesmo tempo no disco dela:

```
fallback  prioridade 0     meu_perfil  prioridade 1
vitoria   prioridade 0     Pragmata    prioridade 5
```

> *"Quatro linhas idênticas na coluna, um vencedor, e nenhuma palavra sobre o
> porquê. É o mecanismo direto da queixa mais antiga desta casa, 'a config que
> eu deixo nunca é respeitada'."*

## A palavra dela

> D-O-PERFIL-UNIVERSAL: *"não é que liga tudo; ok, caso ele não defina, sim. Mas
> caso ele queira ou tenha um modo favorito, isso fica de default."*

Ou seja: o Universal **respeita o modo favorito de quem usa**, e só cai no
tudo-ligado quando não há preferência declarada. Ele não é um perfil "liga
tudo".

## O que entrega

1. **`assets/profiles_default/universal.json`** — `match: any`, **prioridade 0**
   (o mockup, `10-perfis.html:552`), para nunca atropelar ninguém. Nome
   `Universal`, e a coluna dizendo `Todos — quando nenhum casa`.
2. **`fallback.json` e `meu_perfil.json` saem da semeadura.** Quem instalar
   daqui em diante recebe **um** catch-all, não dois.
3. **Migração, e ela é a parte difícil.** Na pasta de quem já usa o produto os
   dois arquivos existem e **podem estar editados**. A regra:
   - `fallback.json` **intocado** (idêntico ao asset de fábrica) → vira o
     `universal.json` e sai;
   - `meu_perfil.json` **intocado** → sai;
   - **qualquer um dos dois editado** → **fica no disco, com o nome que tem**,
     e o Universal nasce ao lado. *Não se apaga escolha dela.* O molde de
     "intocado" já existe: `_coop_local_intocado` (`loader.py:322`), usado pela
     `migrate_coop_local_match`.
   - o marcador `.seeded_presets` (`loader.py:98`) registra a saída, para que a
     semeadura não ressuscite o que a migração tirou.
4. **A migração relata**, como as três irmãs já fazem (`loader.py:270`, `:349`,
   `:416`): devolve a lista do que mexeu, e o `doctor` a mostra.

## Como se prova (o teste que morde)

`tests/unit/test_o_universal_toma_o_lugar_dos_dois.py`, tudo em `tmp_path`:

1. **Instalação nova tem UM catch-all.** Semear numa pasta vazia e contar os
   perfis com `match.type == "any"`: exatamente 1, chamado `Universal`.
   Mordida: devolva `fallback.json` à semeadura e veja reprovar dizendo que há
   dois.
2. **Pasta com os dois intocados converge para um.** Mordida: apague a poda e
   veja reprovar.
3. **`meu_perfil` EDITADO sobrevive à migração, byte a byte.** Escreva um
   `meu_perfil.json` com uma lightbar diferente da de fábrica, migre, e exija
   que o arquivo continue lá com o mesmo conteúdo. **Este é o teste que
   importa** — é a regra "não se apaga decisão medida" virada em código.
   Mordida: faça a migração apagar sem comparar e veja reprovar.
4. **A migração é idempotente**: rodar duas vezes não muda nada na segunda.
   Mordida: tire a marca do `.seeded_presets` e veja reprovar.
5. **O dublê sabe recusar**: pasta sem permissão de escrita → a migração relata
   o erro e **não** deixa a pasta pela metade.

## O que é dela decidir

1. **O Universal "respeita o modo favorito"** — mas hoje não existe lugar
   onde esse favorito seja declarado. O Universal nasce com
   `mode` ausente (o `"Não mexer no modo"` de `profiles_actions.py:151`), que é
   a única leitura honesta de "sem preferência declarada". Onde ela declara o
   favorito é pergunta aberta, e provavelmente é da aba Sistema.
2. **Os perfis dela chamados `vitoria` e outros catch-all** continuam na
   disputa. O Universal em prioridade 0 não os atropela — mas também não os
   conserta. Vale a migração propor renomear os catch-all dela?
