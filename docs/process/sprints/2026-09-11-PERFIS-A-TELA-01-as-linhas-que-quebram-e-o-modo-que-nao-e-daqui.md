---
sprint: PERFIS-A-TELA-01
estado: aberta
onda: A-LISTA-DE-0911
posse:
  PERFIS-A-TELA-01:
    - src/hefesto_dualsense4unix/interface/aba10.py
    - src/hefesto_dualsense4unix/interface/pacotes/a10_perfis.py
    - mockup/10-perfis.html
cria: []
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/profiles/loader.py
  - src/hefesto_dualsense4unix/integrations/censo_dos_lancadores.py
  - src/hefesto_dualsense4unix/integrations/jogos_locais.py
---

# PERFIS-A-TELA-01 — as linhas dos controles que quebram, e o Modo que não é daqui

**Duas queixas dela, 11/09/2026, na mesma aba e no mesmo arquivo.** Por isso uma
sprint só: separá-las poria dois agentes no `aba10.py` ao mesmo tempo.

> *"em perfis as linhas dos controles e ajustes proprios quebram."* <!-- noqa-acento: citação literal dela -->

> *"em perfis ainda aparece modo. Isso deve aparecer só na aba jogar."*

---

## §1 — O QUE ELA VIU, nas duas fotos

**A tabela «Controle · Ajuste próprio · ID da peça»** aparece cortada: as quatro
linhas não cabem no quadro, a última (`P4`) fica pela metade, há barra de
rolagem dentro de um quadro que o desenho não previu rolando, e as colunas
`Ajuste próprio` e `ID da peça` dos lugares vazios não alinham com a do `P1` —
o travessão do vazio flutua na altura errada.

**E o quadro «Modo»** — os quatro botões *Não mexer no modo · Controlar o PC ·
Jogar pelo Hefesto · Conexão Nativa (Sony)* — está no editor de perfil. Ela quer
esse quadro **só na aba Jogar**.

## §2 — O QUE A CASA JÁ SABE, e é o que faz esta sprint ser de medição primeiro

**O `aba10.py` já registrou o corte, e ele tem causa escrita no próprio
arquivo:**

- `aba10.py:731` — *"cura de um CORTE EM SILÊNCIO que o quadro Modo revelou"*;
- `aba10.py:736` — *"Com a fileira do Modo (36px) a conta virou negativa, e as
  linhas do …"*;
- `aba10.py:530` — a tabela «Ajuste próprio» é `overflow:` dentro do quadro;
- `aba10.py:756` e `:800` — `height:100%` divide a altura que sobra entre as
  quatro linhas, e a conta já foi medida perto do limite.

**Leia isto como a hipótese mais forte, e não como o diagnóstico:** as duas
queixas podem ser UMA — o quadro Modo ocupa 36 px que a tabela precisava, e ao
tirá-lo a altura volta. **Meça antes de acreditar.** Se a tabela continuar
cortada sem o Modo, a causa é outra e ela tem de ser nomeada.

**E há régua que vai reprovar a retirada** — `aba10.py:1999` e `:2016`:

```
"o quadro Modo sumiu do editor — o perfil volta a não poder dizer o "
f"o quadro Modo não tem {len(MODOS)} endereços `editor.modo` — o "
```

Essas duas exigências nasceram para impedir uma regressão. **A ordem dela as
revoga**: elas passam a cobrar o contrário — que o quadro Modo **não** esteja no
editor de Perfis. Reescreva as duas no mesmo commit, com a data e a palavra dela
na razão. Uma régua que some é dívida; uma régua que inverte com a decisão
registrada é o contrato novo.

## §3 — O QUE ISSO CUSTA, e a pergunta que NÃO se faz a ela

O `Profile` guarda `mode` (`ProfileModeConfig`). Tirar o quadro da tela **não**
tira o campo do disco: um perfil que já diz «Jogar pelo Hefesto» continua
dizendo. O que muda é quem EDITA.

**Decida você, e registre:** o valor de `mode` de um perfil novo criado sem o
quadro. O padrão vivo é *Não mexer no modo* (o perfil sem opinião), e é ele que
preserva o comportamento de hoje para quem nunca tocou no quadro. **Não pergunte
isso a ela** — é decisão de projeto com padrão seguro óbvio, e a §5 diz o que
é dela.

A linha `aba10.py:1643` já avisa que *"«Modo que liga» e «O jogo vê o controle
como» não estão desenhados aqui"*. Confira se a saída do quadro deixa o texto
dessa lista mentindo — se deixar, ele é seu no mesmo commit.

## §4 — O QUE ENTREGAR

1. **A medição primeiro**, com a ponte JS e `--oculta`: a altura pedida pelas
   quatro linhas, a altura disponível no quadro, e o mesmo par **sem** a fileira
   do Modo. Três números, no relatório.
2. **O quadro Modo sai do editor de Perfis.** As duas réguas do `aba10.py`
   invertem. A aba Jogar não se toca (não é sua).
3. **As quatro linhas cabem**, e o travessão do lugar vazio alinha com o
   conteúdo do lugar ocupado. Se a causa não era o Modo, nomeie-a e cure-a.
4. **O mockup e a página**: gere `mockup/10-perfis.html` e publique com
   `--publicar 10`. Sem publicar, a tela dela não muda — e a queixa volta.
5. **A MORDIDA**: arranque a cura da altura e veja a régua reprovar; devolva.
   Régua que passa com a cura arrancada não mede nada.

## §5 — O QUE É DELA

**O olho.** A tela só fecha com a foto antes/depois e a palavra dela. Entregue
as duas fotos no relatório, `--oculta` nas duas.
