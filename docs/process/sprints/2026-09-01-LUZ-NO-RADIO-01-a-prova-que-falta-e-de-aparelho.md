---
sprint: LUZ-NO-RADIO-01
estado: aberta
bancada: true
---

# LUZ-NO-RADIO-01 — a prova que falta é de aparelho, não de código

> **ESTADO 06/09/2026: aberta, fora das 24 horas** — `docs/process/SPRINT_ORDER.md` §2.1 — prova de aparelho, na bancada dos quatro (MESA-DE-QUATRO-01).
>
> **ESTADO 08/09/2026:** a premissa «um controle, e no cabo» CADUCOU — a mesa dela
> tem o P1 e o P4 no rádio desde 08/09. A prova é a **linha 21** da
> MESA-DE-QUATRO-01 (uma cor no P4, pelo rádio) mais o clique `luz-nao-acende` da
> 08 com um deles. O roteiro abaixo continua valendo; a árvore do comando é a dela
> (`dev`), onde o produto instalado roda — e o piloto dispara as migrações no
> `~/.config` real: confira antes que já rodaram.

**01/09/2026.** Ordem dela, com estas palavras:

> *"Não validei no aparelho o caminho de rádio do luz-nao-acende — seu controle
> está no cabo. Deixa como sprint materializada pro proximo claude orquestrador."* <!-- noqa-acento: citação literal — a grafia não se corrige; o FATO sim — se caducar, apaga e substitui -->

---

## O ESTADO, e ele é bom: o botão está LIGADO

O gesto `luz-nao-acende` da aba Conexões ganhou dono em 01/09/2026, no commit
`2abbe8f7`. Ele chama `integrations/gesto_de_reconexao.desconectar`, que derruba
o controle do rádio pelo `Disconnect` do BlueZ, por D-Bus.

**Não há código a escrever.** O que falta é apertar o botão com um controle no
rádio e ver a barra de luz voltar a obedecer depois do PS.

## POR QUE NÃO FOI PROVADO

Havia **UM** controle na bancada, e ele estava **no cabo** — ela confirmou no
meio da sessão: *"só tem um controle conectado agora tá bom?"*.

E o gesto RECUSA no cabo, de propósito: é o que o `title` do botão apagado
promete — *"Este controle está no cabo, onde a barra de luz não depende de
reconexão nenhuma"*. A recusa foi provada na janela:

```
[gesto falhou] 08-conexoes.html · luz-nao-acende: este controle está no cabo, e
no cabo a barra de luz não depende de reconexão nenhuma. A cura é do rádio:
derrubar a conexão para você apertar PS.
```

**O caminho do cabo está provado. O do rádio, não.**

## O QUE JÁ TEM RÉGUA, e o que régua nenhuma alcança

`tests/unit/test_a_luz_que_nao_acende_derruba_o_radio.py` cobre os quatro
desfechos com dublê, e as três mordidas reprovam:

| caso | o que ele mede |
| --- | --- |
| `test_no_cabo_recusa_dizendo` | a guarda vem ANTES do subprocesso |
| `test_no_radio_pede_o_disconnect` | o `uniq` certo chega ao BlueZ |
| `test_ja_estava_fora_conta_como_sucesso` | os dois estados pedem o mesmo gesto dela |
| `test_o_que_nao_caiu_levanta_com_a_frase_do_produto` | a frase é a do módulo |

**O que o dublê não alcança** é o único ponto que importa aqui: se o
`Disconnect` do BlueZ, nesta máquina, com este adaptador e este firmware,
**derruba mesmo** o controle — e se, depois do PS, **a barra de luz volta a
obedecer**. Isso é medição de aparelho.

## A PROVA, quando houver um controle no rádio

Três passos, e o terceiro é o que decide.

```bash
cd /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix
source .envrc-voo

# 1. CONFIRME que há um controle no rádio, e ANOTE o estado da luz ANTES.
.venv/bin/python - <<'PY'
import sys; sys.path.insert(0,'src')
from hefesto_dualsense4unix.interface.pacotes import ponte
st = ponte.daemon_state_full() or {}
for c in st.get("controllers") or []:
    print(c.get("transport"), c.get("lightbar_rgb"), c.get("connected"))
PY

# 2. O CLIQUE, na janela oculta. Ela tem UMA tela.
.venv/bin/python -u src/hefesto_dualsense4unix/interface/hefesto_vivo.py \
    --oculta --abre 08-conexoes.html --segundos 9 --prova-clique "luz-nao-acende"

# 3. O APARELHO: o controle caiu? Aperte PS. A luz volta a obedecer?
#    Leia o estado de novo (passo 1) e compare.
```

**O que conta como PROVADO:** o controle sai de `connected`, o PS o traz de
volta, e um `led.set` depois disso **muda a cor de verdade** — não basta o daemon
responder `aplicado`. A regra desta casa é a de sempre: *"'aplicado' não prova;
o instrumento já mentiu de três jeitos"*.

## AS TRÊS COISAS QUE PODEM DAR ERRADO, e o que fazer com cada uma

1. **O `Disconnect` não derruba.** O módulo devolve `nao_deu`, e a tela mostra a
   frase dele. É o caminho `FRASE_NAO_DEU`, e ele significa *"não sei"*, não
   *"não caiu"* — a distinção está escrita em `gesto_de_reconexao.Resultado.caiu`
   e é a linha inteira daquele módulo. Se acontecer, meça o `busctl` na mão antes
   de acusar o gesto.
2. **O controle cai e a luz continua sem obedecer.** Então a hipótese da cura
   está errada: a reconexão não é o caminho de volta, e a sprint que a propôs
   precisa ser relida. **Não conserte o gesto** — ele faz o que promete. O que
   caducou é a premissa.
3. **O controle cai e não volta com o PS.** Isso é outro defeito, e ele tem casa:
   o restauro de bonds (memória `restauro-de-bonds-tem-de-ser-automatico`).

## O QUE ESTA SPRINT **NÃO** É

Não é para reescrever o gesto, nem para lhe acrescentar caminho. Ele está
ligado, tem régua e as mordidas reprovam. Se a medição no aparelho contradisser
alguma frase deste documento, **a medição vence** — e a frase se substitui, que é
a regra da casa para fato errado.

---

## Fecha quando

- [ ] Houver um controle no rádio na bancada dela.
- [ ] O clique derrubar o controle (ou disser `ja_estava_fora`).
- [ ] O PS o trouxer de volta e a barra de luz voltar a obedecer a um `led.set`.
- [ ] O resultado for escrito aqui, com a data — inclusive se for negativo.
