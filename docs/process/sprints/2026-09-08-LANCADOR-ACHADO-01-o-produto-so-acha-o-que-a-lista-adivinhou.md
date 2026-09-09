---
sprint: LANCADOR-ACHADO-01
estado: aberta
posse:
  LANCADOR-ACHADO-01:
    - src/hefesto_dualsense4unix/integrations/jogos_locais.py
bancada: false
depois_de: [LANCADORES-ZERO-01]
---

# LANCADOR-ACHADO-01 — o produto só acha o lançador que a lista adivinhou, e a culpa não é dela

**Nasceu em 08/09/2026 de uma frase MINHA que ela leu e classificou certo.** Eu
escrevi, explicando por que instalei os apps por flatpak em vez de apt:

> *"Se algum ficar NÃO LOCALIZADO com o app instalado, mandei o agente tratar
> isso como o achado mais valioso da frente: quer dizer que a lista de atalhos
> não cobre o caminho do flatpak."*

E ela respondeu: ***"isso é uma falha de produto e a culpa é minha."***

**A culpa NÃO é dela, e essa é a primeira coisa que esta sprint registra.** O
produto que exige do usuário a forma certa de instalar não é um produto exigente;
é um produto que terceiriza para quem usa uma pergunta que ele mesmo deveria
responder. Ela instalou o Lutris de algum jeito e o Hefesto disse NÃO ACHEI —
o defeito nasceu ali, não na escolha dela.

## §1 — O que o produto faz hoje, medido

`desenho_dos_lancadores.py:685-722` declara cinco `SemCenso` mais a `A_STEAM`, e
cada um traz duas listas ADIVINHADAS na hora em que alguém escreveu o arquivo:

```python
SemCenso("lutris", "Lutris", ("net.lutris.Lutris", "lutris"), ("lutris",))
#                             ^^^^ os `stem` de .desktop        ^^^^ o PATH
```

`a07_lancadores._onde_estao_os_lancadores()` (`:367`) percorre
`jogos_locais.pastas_de_atalhos()` procurando aqueles `stem`, e depois o `PATH`
procurando aqueles comandos. **Achou = cartão aceso. Não achou = NÃO ACHEI.**

**MEDIDO NESTA MÁQUINA em 08/09/2026**, depois de instalar os seis por
`flatpak --user`: os SEIS acenderam, os cinco pelo `.desktop` em
`~/.local/share/flatpak/exports/share/applications`. **O caminho do flatpak É
coberto** — a pasta está em `pastas_de_atalhos()`, que segue a spec XDG.

Então o defeito NÃO é o flatpak. **É a lista.** E em 08/09 às 22h o ambiente do
PROCESSO dela foi lido (`/proc/<pid>/environ`): o `XDG_DATA_DIRS` tem as duas
pastas do flatpak. A hipótese do ambiente está morta duas vezes — o que ela viu
à noite (*"identificando nada"*) é a
[LANCADORES-ZERO-01](2026-09-08-LANCADORES-ZERO-01-a-aba-que-nao-identifica-nada-na-tela-dela.md).

## §2 — O DEFEITO DE VERDADE: a busca é por NOME ADIVINHADO

O produto não procura "um lançador de jogos". Ele procura **cinco strings que
alguém digitou**. Tudo o que não bate com elas some, e o cartão diz NÃO ACHEI
sobre uma coisa que está instalada e funcionando.

Os casos que caem no buraco, e nenhum é exótico:

| como ela instala | por que some |
| --- | --- |
| AppImage solto em `~/Aplicativos` | não publica `.desktop`, não entra no `PATH` |
| um `.desktop` com `stem` diferente (`lutris-wine`, `net.lutris.Lutris-beta`) | o `stem` não bate |
| snap | outro prefixo de `.desktop` e outro `PATH` |
| compilado à mão em `/opt` | nada bate |
| um lançador que a lista não conhece (itch, Bottles, Steam Deck tools, ES-DE) | não está nos seis |
| um emulador qualquer | idem — e são dezenas |

**A ASSIMETRIA QUE PROVA O PONTO:** o cartão do Flatpak procura o COMANDO
`flatpak` e acha. O cartão do Lutris procura o NOME `net.lutris.Lutris`. O
primeiro pergunta *"existe um programa que faz isso?"*; o segundo pergunta
*"existe um arquivo com este nome?"*. **Só o primeiro é uma pergunta sobre o
mundo.**

## §3 — O QUE ESTA SPRINT ENTREGA, em três degraus

### Degrau 1 — a saída de emergência — ENTROU em 08/09 (`d1f17040` + `1bebb847`)

O cartão não-localizado diz **«Localizar este Lançador»** e o botão global diz
**«Adicionar novo Lançador»**, gravando um `LancadorDeclarado` em `maquina.json`
(`utils/maquina.py:581`) — os mesmos três campos do `SemCenso`, um procurador
só. Isso NÃO fecha esta sprint — é o que permite ela não ficar travada enquanto a cura de verdade
não vem. **Registrar à mão é a confissão de que a busca falhou.**

### Degrau 2 — procurar pelo que a coisa É, não pelo nome que ela tem

Um `.desktop` diz de si mesmo o que ele é: `Categories=Game`, `StartupWMClass`,
`Exec`, `MimeType`. Um lançador de jogos declara `Game` ou `Emulator` nas
categorias, e um emulador declara os `MimeType` das ROMs que abre.

**Varra as pastas XDG e classifique pelo CONTEÚDO**, com os nomes de hoje virando
um índice de rótulo bonito — não o critério de existência. Assim o
`net.lutris.Lutris-beta`, o AppImage que publicou `.desktop`, o snap e o
emulador que ninguém previu entram sozinhos.

### Degrau 3 — o que a varredura não alcança, ela PERGUNTA

Um AppImage solto não publica nada. Para esses fica o registro do degrau 1 — mas
com um recado que diz **por que** ele é necessário, sem confessar dívida: *"me
mostre onde ele está e eu passo a achar sozinho"*.

## §4 — O QUE NÃO FAZER, e vem escrito porque a tentação é forte

* **NÃO instale nada pelo usuário.** O Hefesto configura controle; ele não é
  gerenciador de pacotes. "Adicionar Launcher" quer dizer *"ele está aqui, eu te
  mostro onde"*, e o próprio cartão já diz isso.
* **NÃO escreva na tela que a busca é limitada.** É confissão, e a ordem dela de
  07/09 a proíbe. A dívida vai para o `docs/data/mapa-controles.csv`.
* **NÃO troque a lista por uma lista maior.** Acrescentar `lutris-wine` e mais
  vinte nomes é pagar o mesmo preço de novo daqui a um mês. O degrau 2 é o que
  fecha; o resto adia.

## §5 — A MORDIDA

Fabrique, numa casa de mentira, um `.desktop` de um lançador que a lista NÃO
conhece (`Categories=Game;` e um `Exec` que existe) e cobre que o produto o
ENCONTRE. Com a busca de hoje ele não aparece — é essa reprova que prova a cura.

E o negativo que importa: um `.desktop` que NÃO é lançador (um editor de texto)
não pode virar cartão. Busca que acha tudo não achou nada.

## Critério de pronto — por cabo · por BT · no perfil · por controle

É a régua dela de 08/09 ([CABO-BT-PERFIL-CONTROLE-01](2026-09-08-CABO-BT-PERFIL-CONTROLE-01-a-regua-de-pronto-de-toda-feature-da-tela.md)); a sprint só fecha com as quatro respondidas.

| | |
| --- | --- |
| cabo / BT | — (o lançador não sabe de transporte) |
| no perfil | o lançador achado por conteúdo entra no MESMO censo da LANCADORES-ZERO-01, e o jogo dele ganha `match` |
| por controle | — |
