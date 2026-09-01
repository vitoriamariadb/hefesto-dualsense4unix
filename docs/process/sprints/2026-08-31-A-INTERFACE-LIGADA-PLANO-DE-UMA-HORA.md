---
sprint: A-INTERFACE-LIGADA
onda: MIGRA
bancada: false
nao_toca:
  - mockup/            # o desenho é dela; este plano só LIGA o que já está desenhado
  - docs/data/
  - install.sh
  - install-dev.sh
---

# A interface ligada — plano de UMA HORA

**Pedido dela, 31/08/2026:** *"pra termos a interface usável depois do novo
mockup e afins. Pode criar um plano pra correção. ligamentos e afins. pra
funcionar de fato pra ser executado dentro de 1h por x agentes, com o máximo de
qualidade e gestão do claude e avaliação dele no playwright."*

**Este plano só roda DEPOIS que a `mockup/TODO-DELA.md` fechar.** Ligar um
desenho que ainda vai mudar é pagar duas vezes.

---

## §0. O BURACO É MENOR DO QUE PARECE — medido em 31/08

A leitura fácil seria "faltam 120 sprints `MIGRA-*`". **Está errada.** O que a
medição mostra:

| piloto | linhas | toca o daemon | tem janela | sobrevive à troca de aba |
|---|---:|---:|:---:|:---:|
| **`controles_vivos.py`** | 1.654 | **47** | **sim** | **sim** (`load-changed`) |
| `jogar_vivo.py` | 984 | 20 | não | não |
| `perfis_vivos.py` | 632 | 18 | não | não |
| `sistema_viva.py` | 577 | 14 | não | não |
| `mesa_viva.py` | 552 | 20 | não | não |
| `conexoes_vivas.py` | 455 | 4 | não | não |

**O `controles_vivos.py` já é o piloto genérico.** Ele:
- cria a janela e o `WebView` (`ponte_da_tela.JanelaDaAba`);
- ouve `load-changed` e **reinstala tudo quando ela troca de aba** (`:789`);
- instala o interruptor em **"a fileira `[data-modo]` de QUALQUER página que a
  tenha"** (`:556`) — é por isso que o botão da aba Jogar já funciona hoje.

Os outros cinco são **conhecimento**, não infraestrutura: cada um sabe montar o
`_pacote` da sua aba e os endereços dela. **Nenhum deles precisa virar programa.**

**Logo o trabalho não é "ligar dez pilotos". É: um piloto, dez abas.** E ele já
tem a metade difícil pronta.

---

## §1. O CONTRATO — feito pelo Claude, ANTES de qualquer agente. 10 min

**Isto é indelegável.** Se cada agente inventar o formato do seu pacote, a
integração é um segundo projeto.

O `controles_vivos.py` ganha um **despachante por página**:

```python
#: UMA função por aba. A chave é o nome do arquivo; o valor monta o pacote que
#: a pintura consome. Assinatura FIXA, e é o contrato:
#:     def pacote_da_aba(state: dict) -> dict[str, object]
PACOTES = {
    "01-jogar.html":     jogar.pacote,
    "02-controles.html": controles.pacote,
    ...
}
```

Entregas desta fase, todas pelo Claude:
1. a assinatura acima, escrita e documentada no `controles_vivos.py`;
2. **um** módulo de exemplo completo, extraído do que o piloto já faz para a
   Controles — é o molde que os agentes copiam;
3. `tests/unit/test_o_despachante_serve_as_dez.py`, que **reprova quando uma aba
   não tem pacote** — a régua nasce vermelha em nove e vai ficando verde;
4. o `scripts/abrir_interface.py` deixa de cravar `controles_vivos.py` como
   único candidato.

**Sem o item 3 este plano não vale nada:** é ele que diz, a cada minuto, quanto
falta — e é o que impede um agente de dizer "pronto" sobre uma aba que não pinta.

---

## §2. AS OITO ABAS EM PARALELO — 8 agentes, 30 min

A Controles é o molde e já está feita. Sobram **nove**, e a **Lançadores é
placeholder por decisão dela** — logo **oito agentes, um por aba**:

| agente | aba | de onde ele tira o que sabe |
|---|---|---|
| 1 | `01` Jogar | `jogar_vivo.py` (984 l., já tem `_pacote`) |
| 2 | `03` Gatilhos | as 11 sprints `MIGRA-GATILHOS-*` |
| 3 | `04` Iluminação | as 12 sprints `MIGRA-ILUMINACAO-*` |
| 4 | `05` Vibração | as 8 sprints `MIGRA-VIBRACAO-*` |
| 5 | `06` Navegação | as 16 sprints `MIGRA-NAVEGACAO-*` |
| 6 | `08` Conexões | `conexoes_vivas.py` |
| 7 | `09` Sistema | `sistema_viva.py` |
| 8 | `10` Perfis | `perfis_vivos.py` |

**Por que oito e não dez:** dois agentes a mais custariam coordenação sem
entregar aba. E **por que um por aba, e não um por camada:** território
exclusivo é a regra desta casa — dois agentes no mesmo arquivo é o defeito que
`COMO-COORDENAR-UMA-LEVA.md` documenta.

**O que CADA agente entrega, e é o mesmo para os oito:**
1. `src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py` e os nove irmãos — o plano escrevia um molde com dois dígitos e um nome genérico, e os dez nasceram em 01/09/2026 com nome de verdade — só a função do contrato. **Um
   arquivo novo por agente: zero colisão por construção.**
2. cada valor da tela com **endereço no produto**, ou dito que não tem dono.
   Endereço inventado é o defeito mais caro desta casa.
3. o teste que **morde**: arranca a fonte de um valor e vê a régua reprovar.
4. **a prova em WebKitGTK, não em Chrome** — `--oculta`, foto antes e depois.

**O que NENHUM agente faz:** tocar o `controles_vivos.py`, o `topo.html`, o
`mockup/` ou outro `pacotes/*.py`. Quem precisar disso **para e relata**.

---

## §3. A AVALIAÇÃO NO PLAYWRIGHT — 15 min, e ela é do Claude

**Playwright não substitui o WebKitGTK, e a distinção é medida:** o Playwright
dirige o mockup num Chrome headless e serve para **layout, `:hover` e o
desenho**; a ponte JS testa **o motor que ela vai usar, com o daemon vivo**. São
dois instrumentos com alvos diferentes. **Rode os dois.**

**A régua tem de declarar a COBERTURA junto com o veredito** — foi a lição mais
cara de 31/08, quando quatro réguas desta casa deram verde sobre nada:

```
por aba:  valores pintados / valores que a página declara
          gestos ouvidos   / gestos que a página tem
          erros de JS
          seletor que casou ZERO elementos  ← isto é ERRO, nunca silêncio
```

**Se `pintados != declarados`, o número aparece no relatório.** Zero achados
nunca é resposta: é hipótese.

**E ela tem de viver no tempo:** rode o tique por **180 segundos**, não uma vez.
Em 29/08 uma leva introduziu regressão que só aparecia aos **181 segundos**, com
67 testes verdes.

---

## §4. A INTEGRAÇÃO E O FECHO — 5 min, Claude

1. `bash scripts/portoes.sh --rapido` (23 portões);
2. a régua do §1.3 verde nas dez;
3. **a foto das dez, lida pelo Claude** — não só gerada;
4. commit por aba, para que uma aba com defeito volte sozinha.

---

## O ORÇAMENTO DE UMA HORA

| | quem | tempo |
|---|---|---|
| §1 contrato + molde + régua | Claude | **10 min** |
| §2 oito abas em paralelo | 8 agentes | **30 min** |
| §3 avaliação Playwright + WebKitGTK | Claude | **15 min** |
| §4 portões e fecho | Claude | **5 min** |

**O caminho crítico é o §2**, e ele é paralelo de verdade: oito arquivos novos,
território exclusivo, zero colisão.

**O que estoura a hora, e como cada um é evitado:**

| risco | a cura, já embutida no plano |
|---|---|
| um agente inventa formato de pacote | o §1 é feito ANTES, e o molde é código pronto |
| dois agentes no mesmo arquivo | um arquivo novo por agente |
| "pronto" sobre aba que não pinta | a régua do §1.3 reprova, e ela é do Claude |
| endereço inventado no produto | o item 2.2 exige dono, e o teste que morde prova |
| o teto de uso da sessão | **rode com a sessão fresca.** Em 31/08, 37 de 40 agentes morreram por isso, e a auditoria mais importante do dia ficou 3/39 |

---

## O QUE ESTE PLANO NÃO ENTREGA, e é honesto dizer

- **não deixa as dez abas ESCREVENDO.** Ele liga a **leitura** — a tela passa a
  mostrar o estado real. Escrita (o clique que muda o produto) é a metade
  seguinte, e ela precisa de método de IPC por aba, que em várias não existe.
  A aba Controles e o interruptor da Jogar **já escrevem**, e são o molde.
- **não substitui as 120 sprints `MIGRA-*`.** Elas continuam sendo o detalhe de
  cada aba — valor por valor, gesto por gesto. Este plano entrega o **esqueleto
  vivo** em uma hora; elas enchem a carne.
- **não vale se o mockup mudar depois.** Rode depois que a `TODO-DELA.md`
  fechar.
