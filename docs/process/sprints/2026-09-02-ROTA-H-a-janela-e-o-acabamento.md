# ONDA H — a janela e o acabamento

A menor das oito, e a única que não depende de nada.

## OS DOIS DEFEITOS, fotografados por ela em 02/09/2026

### H1 — a decoração da janela

Os botões de fechar/maximizar/minimizar aparecem **à esquerda e fora de ordem**,
diferentes de toda outra janela da sessão dela. Comparado lado a lado com duas
janelas vizinhas na mesma foto: elas trazem os botões à direita.

**Onde olhar:** `interface/hefesto_vivo.py` (a `Gtk.Window` e o header bar) e
`scripts/abrir_interface.py` (que veste a identidade no processo). O
`WM_CLASS` já está certo — medido: `'hefesto-dualsense4unix',
'Hefesto-Dualsense4Unix'`.

### H2 — a sobreposição do brilho, na Iluminação

O `100` aparece colado sobre a trilha do slider, e o valor à direita diz `1`.
**Nas duas colunas.** É CSS mais valor: o número não cabe onde está, e o valor
mostrado não é o do slider.

**Onde olhar:** o CSS na BANCADA (`mockup/`), e `a04_iluminacao.py` para o
valor.

## O REUSO, PRIMEIRO

A GTK resolvia decoração de janela em `app/app.py` e `app/main.py`
(`set_wmclass`, `set_default_icon_name`, `Gdk.set_program_class`). **Confira o
que ela fazia com o header bar antes de inventar.**

## AS RÉGUAS

1. **A janela publica o `WM_CLASS` certo** — já há régua; não quebre.
2. **Nenhum valor de tela sobrepõe outro** — se der para medir a geometria por
   `run_javascript`, a régua mede; se não, a prova é a FOTO, lida.

## COMO SE SABE QUE FECHOU

```
[ ] foto da janela ao lado de outra da sessão dela: os botões no mesmo lugar
[ ] foto da Iluminação sem sobreposição, e o valor do slider batendo
[ ] o CSS mudou na BANCADA, com a divergência declarada
```

## O QUE ESTA ONDA **NÃO** FAZ

Não publica HTML. Não toca em pacote nenhum além do valor do brilho.
