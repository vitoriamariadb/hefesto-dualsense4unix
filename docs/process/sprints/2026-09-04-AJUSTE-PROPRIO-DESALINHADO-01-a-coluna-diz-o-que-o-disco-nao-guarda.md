# A coluna "Ajuste próprio" diz o que o disco não guarda

**04/09/2026, achado do coordenador ao conferir a ONDA-G.** Não estava em fila
nenhuma, e é da família que esta casa persegue: **a tela afirmando o que não é.**

---

## O que se mediu

A tabela `Controle · Ajuste próprio · ID da peça` da aba 10 acende cinco células
por linha — `leds · triggers · rumble · speaker · mic`. Lido do **DOM vivo**, com
a página publicada, o daemon dela no ar e dois controles na mesa (um no cabo, um
no rádio):

```
P1 • Cosmic Red • USB      ACESA   ACESA   ACESA   apagada  ACESA
P2 • Starlight Blue • BT   ACESA   apagada ACESA   apagada  apagada
P3 • Desconectado          ACESA   apagada apagada apagada  apagada
P4 • Desconectado          apagada apagada apagada apagada  apagada
```

E o perfil ativo, lido do **disco** (`~/.config/hefesto-dualsense4unix/profiles/meu_perfil.json`):

```
controles guardados: 3
  d42f4b0000d8  ->  ['leds', 'rumble', 'triggers']     ← o P2 da tela
  444648000003  ->  ['leds', 'rumble', 'triggers']     ← o P1 da tela
  143a9a0000ab  ->  []                                  ← não está na mesa
```

**As duas leituras não batem, e a divergência tem três formas:**

| linha | a tela diz | o disco diz | o erro |
| --- | --- | --- | --- |
| P1 | leds · triggers · rumble · **mic** | leds · triggers · rumble | **`mic` aceso e não guardado** |
| P2 | leds · rumble | leds · triggers · rumble | **`triggers` guardado e apagado** |
| P3 | **leds** | — (o lugar está vazio) | **acende sobre lugar sem controle** |
| P4 | — | — | correta |

O padrão é de **deslocamento**, não de valor errado: cada linha parece ler os
valores de uma posição adiante da sua.

---

## Onde a corrente pode arrebentar

A distribuição é por **ordem do documento**, não por nome de linha. O bootstrap
do piloto faz `alvos.forEach((el, i) => i < v.length ? v[i] : '')`
(`interface/hefesto_vivo.py`), e o pacote emite **uma lista plana**:

```python
fora["guarda.secao"] = [
    "sim" if (g.get("secoes") or {}).get(secao) else ""
    for g in guarda
    for secao in SECOES_DA_COLUNA
]
```
— `interface/pacotes/a10_perfis.py:1291`

E `guarda` vem de `_linhas_da_guarda`, que faz **uma linha por controle
PRESENTE** (`app/actions/perfis_web.py:468`), iterando a **mesa**, não os
controles do perfil.

**Os números do desenho:** a página publicada tem **20 células** e **4 linhas** de
controle; `SECOES_DA_COLUNA` e o `SECOES` do gerador (`aba10.py:86`) declaram as
mesmas cinco seções, na mesma ordem. Com dois controles na mesa, a lista tem
**10 valores para 20 células** — as dez últimas deveriam receber `''`.

**A hipótese que a medição sustenta:** ou `guarda` traz mais linhas do que a mesa
(o que empurraria valores para P3), ou a ordem do documento inclui células
`guarda.secao` que não são das quatro linhas de controle, ou o `escrever()` com
valor vazio no alvo `classe` não apaga a classe `on` que o gerador cravou. **As
três são verificáveis em minutos, e nenhuma foi verificada aqui** — este arquivo
registra a medição, não o diagnóstico.

---

## Por que isto importa mais do que parece

A legenda desta própria aba avisa que *"uma tela que acende tudo nos quatro
ensinaria o contrário"*, e o comentário do pacote
(`a10_perfis.py:1257-1272`) registra que uma versão anterior desta mesma linha
**acendia as quatro seções para todo controle** porque iterava as chaves de um
dicionário em vez dos valores. Aquele defeito ficou invisível enquanto
`NAO_PINTAVEIS` segurava o campo.

**O campo foi destravado em 03/09** e passou a pintar. Esta é a primeira medição
do DOM vivo depois disso — e ela mostra que o valor chegou à tela **errado**.

O que ela perde: a coluna existe para responder *"o que este perfil guarda só
deste controle"*. Errada, ela responde outra coisa com a mesma cara de certeza.

---

## O primeiro passo, para quem pegar

```bash
# 1. o que o pacote emite, com a mesa real dela
.venv/bin/python -c "
from hefesto_dualsense4unix.interface import mesa_viva
from hefesto_dualsense4unix.interface.pacotes import a10_perfis, Contexto
p = a10_perfis.pacote(Contexto(mesa_viva.estado_do_daemon()))
print(len(p['guarda.secao']), p['guarda.secao'])"

# 2. o que o DOM recebeu — o driver está pronto
.venv/bin/python <scratchpad>/medir_guarda.py
```

Se (1) devolver 10 valores e (2) mostrar P3 aceso, o defeito é da distribuição no
bootstrap. Se (1) devolver 15, o defeito é do `_linhas_da_guarda`.

**A MORDIDA que este conserto exige:** um teste que monte um perfil com seções
conhecidas por controle, rode a pintura e compare **célula a célula** com o
disco. Sem ele o campo volta a mentir na próxima mudança de coluna — já voltou
uma vez.
