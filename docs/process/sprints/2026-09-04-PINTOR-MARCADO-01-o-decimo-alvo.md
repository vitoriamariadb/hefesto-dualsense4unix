# PINTOR-MARCADO-01 — o décimo alvo do pintor

> **Decisão dela, 04/09/2026, tarde:** opção **a** — *décimo alvo `marcado`*.

O pintor tem nove alvos (`interface/hefesto_vivo.py:228`–`:402`:
largura·fundo·valor·html·classe·cor·plastico·atributo, mais o texto padrão) e
nenhum escreve `el.checked`. O acordeão do alto-falante da aba 02 é um
`<input type="checkbox">` em CSS puro, e o estado da saída não tem como
chegar nele.

## O TRABALHO

* `if(alvo === 'marcado')`: escreve `el.checked = (t === 'sim')`, devolve 1 só
  se mudou — como os outros nove.
* A leitura de volta (`hefesto_vivo.py:1026`) ganha o ramo: `v = el.checked`.
* Vale para todo checkbox e radio das dez abas; a 02 é a primeira a usar
  (`data-hef-alvo="marcado"` no acordeão, publicado por
  `--publicar-enderecos 02` — atributo invisível, zero pixel).

## A MORDIDA

Teste do pintor com um checkbox: `marcado=sim` acende, `marcado=""` apaga,
segundo tique igual devolve 0. Arrancar o ramo → reprova. Tela: o acordeão
abre sozinho quando o daemon diz que a saída está no controle.

## Posse, para o despacho

**Toca:** `src/hefesto_dualsense4unix/interface/hefesto_vivo.py` · `src/hefesto_dualsense4unix/interface/aba02.py`.

**Cria:** `tests/unit/test_o_pintor_marca_o_checkbox.py`. <!-- ref-externa: a sprint CRIA este arquivo; ele ainda não existe -->

**Bancada:** não.
