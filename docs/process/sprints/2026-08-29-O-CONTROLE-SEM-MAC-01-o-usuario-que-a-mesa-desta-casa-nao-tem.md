---
sprint: O-CONTROLE-SEM-MAC-01
estado: aberta
onda: I
posse:
  CRACHA:
    - src/hefesto_dualsense4unix/daemon/subsystems/identity.py
cria:
  - tests/unit/test_o_controle_sem_mac_e_lembrado.py
bancada: false
depois_de:
  - QUATRO-NA-MESA-01
nao_toca:
  - src/hefesto_dualsense4unix/profiles/schema.py
---

> **ROTA CORRIGIDA — 06/09/2026, arrumação da leva (Fable, PO por delegação).** **Vale inteira, e é só mecanismo.** Roda depois da QUATRO-NA-MESA-01 (mesmo `identity.py`).
Os cinco crachás candidatos (`0x05`, `0x09`, `0x0b`, `0x20`, `0x22`) estão em
`docs/data/mapa-controles.csv`, chave `identidade.cracha_nos_dois_transportes` — **escolha por
medição registrada, não por gosto, e DECLARE a forma da chave no relatório**, porque a
QUEM-E-QUEM-04 abre a porta do perfil para essa forma e vem depois. A frase da desistência foi
decidida por delegação (`D-0609-A-FRASE-DO-CONTROLE-SEM-CRACHA`): *"Este controle não tem
identificação estável: o Hefesto não vai lembrar dele no próximo jogo."* As cinco mordidas da
sprint valem inteiras; a que importa é *chaveie pelo `path` e veja reprovar*.

> **ESTADO 06/09/2026: aberta, fora das 24 horas** — `docs/process/SPRINT_ORDER.md` §2.5 — controles externos.

# O CONTROLE SEM MAC · 01 — o usuário que a mesa desta casa não tem

**O defeito, numa frase:** um controle cujo firmware não expõe serial nunca é
lembrado — ele configura, fecha o jogo, e perdeu; **em todo jogo, para sempre** —
e nenhuma medição desta bancada consegue mostrar isso, porque os controles daqui
todos têm MAC.

## O que está medido

- **`daemon/subsystems/identity.py:104` (regra D9), em letra:** *"key sem MAC
  12-hex (fallback `path:...` de firmware sem serial) ganha slot VOLÁTIL: vale
  na sessão, nunca é persistido (D9 — path muda entre boots)"*.
- **A consequência não é o número do jogador — é a MEMÓRIA.** O
  [QUEM-E-QUEM-01](2026-08-29-QUEM-E-QUEM-01-o-perfil-do-jogo-lembra-cada-controle-pela-identidade.md)
  entrega o perfil que lembra cada controle **pela chave**, e a chave é o MAC
  normalizado (`profiles/schema.py:1112`). Sem MAC não há chave estável, logo
  não há o que o perfil lembre.
- **A cura não é inventar nada, e já foi medida.** O ensaio
  `scripts/ensaios/identidade_nos_dois_transportes.py` (15/08/2026, leitura pura,
  pela porta do broker, com o daemon rodando) achou **cinco** candidatos a crachá
  — `0x05`, `0x09`, `0x0b`, `0x20`, `0x22` — saindo nos DOIS transportes e
  estáveis byte a byte entre leituras com 2 s de distância
  (`docs/data/mapa-controles.csv:126`, `identidade.cracha_nos_dois_transportes`).
  Hoje se usa **um**; quando ele falta, desiste-se.

## Por que isto é sprint própria, e não um item do QUEM-E-QUEM-01

O QUEM-E-QUEM-01 **cobra** este caso na terceira prova da sua mordida (*"um
controle SEM MAC: a régua tem de cobri-lo"*), e **não pode curá-lo**: a posse
dele é `profiles/schema.py`, e a cura mora em
`daemon/subsystems/identity.py`. Sem esta sprint, aquela régua nasce medindo uma
cura que ninguém tem permissão de escrever.

**E é a régua universal desta casa aplicada a si mesma.** A própria linha do mapa
diz que *"4-de-4 numa mesa de quatro placas diferentes NÃO prova universalidade —
o que prova é o MECANISMO"*. Este é o caso em que a mesa desta casa é a amostra
mais favorável possível: os controles daqui têm MAC, então **o defeito é
invisível daqui**, e só o mecanismo o revela.

## O que entrega

1. **Quando o MAC falta, o segundo conduíte assume.** A key deixa de cair direto
   no `path:...` volátil: tenta um dos crachás medidos que saem nos dois
   transportes e são estáveis, e só desiste depois deles.
2. **A desistência deixa de ser calada.** Quando nenhum crachá serve, o slot
   continua volátil — e o produto **diz** que aquele controle não vai ser
   lembrado, com a frase de diagnóstico desta casa: o quê, por quê, o que fazer.
   Perder configuração em silêncio é o defeito; perder avisando é uma limitação
   declarada.
3. **A chave nova não muda a chave velha.** Quem tem MAC continua com o MAC —
   trocar a chave de quem já é lembrado apagaria a memória de todo mundo, que é
   exatamente o estrago que esta sprint existe para evitar.

## Como se prova (a mordida)

`tests/unit/test_o_controle_sem_mac_e_lembrado.py`, **sem um único MAC desta
casa** — dublês:

- **o sem-serial ganha slot persistível.** Um handle cuja key cai em `path:...`
  e que responde um dos crachás: o slot atravessa um restart simulado. **A
  mordida:** devolva o `_volatile` e veja reprovar — é o produto de hoje;
- **o path continua não sendo identidade.** O MESMO controle, no MESMO crachá,
  com o `path` diferente (o que acontece entre boots): cai na MESMA entrada.
  **A mordida:** chaveie pelo `path` e veja reprovar. Esta é a mordida que
  importa mais, porque o defeito que ela pega é o motivo de a regra D9 existir;
- **sem crachá nenhum, a desistência é ANUNCIADA.** Handle que não responde a
  nada: slot volátil **e** a frase de diagnóstico. **A mordida:** cale a frase e
  veja reprovar;
- **quem tem MAC não muda de chave.** Um handle com MAC 12-hex cai na entrada de
  sempre, byte a byte. **A mordida:** faça o crachá vencer o MAC e veja
  reprovar — seria a perda de memória de toda mesa que hoje funciona;
- **o vpad continua sem slot.** O MAC forjado `02:fe:...` nunca ganha lugar
  (D9, `identity.py:101-103`) — nem pela porta nova.

## Nada se perdeu

- a regra D9 **não é revogada**: o `path` continua não sendo identidade, e é
  precisamente por isso que o segundo conduíte não é o `path`, é o crachá;
- a separação D3 fica intacta: este slot é EXIBIÇÃO/LED, e o índice do vpad do
  co-op não é tocado (`identity.py:112-120`);
- a ordem por chegada fica **exatamente como está** — ela é decisão medida dela
  de 29/08 (*"cuidado"*), e esta sprint não encosta em `_ordem_do_momento_locked`.

## O que é dela decidir

**A frase da desistência**, se e quando ela aparecer na tela — texto de interface
é palavra dela. O mecanismo não espera por isso: sem crachá o slot já é volátil
hoje, e o que muda é passar a dizê-lo.
