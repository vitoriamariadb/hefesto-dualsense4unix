# CONFIG-08 — a aba entra na documentação

**Depende de:** todas as anteriores que forem aprovadas.

> **EXECUTADA em 22/08/2026.** O que saiu diferente do plano está na última
> seção, e cada divergência tem o motivo escrito.

## O que entrega

| Alvo | O quê | Estado |
|---|---|---|
| `docs/usage/interface.md` | A aba descrita, no mesmo formato das outras dez | feito |
| `README.md` | A imagem da aba nova na grade; a contagem de abas não estava citada lá | feito |
| `docs/usage/assets/` | As capturas refeitas | **já estavam**, refeitas ao longo da leva |
| `CHANGELOG.md` | A entrada da leva | feito |
| `GUIA-RADIO-DA-SALA.md` | **Versionar** — a fonte primária da seção 1 | **já versionado** em `02fc5dc` |
| `REGRA-NAO-REGISTRO-01` | **Registrar o escopo novo do VETO 3.** Ver [D-A1](DECISOES-ABERTAS.md) | feito |
| `external_controllers.py:11-14` | **Nota datada** sobre o escopo reaberto. Ver [D-A2](DECISOES-ABERTAS.md) | **já escrita** em `9069dcd` |
| `tests/unit/test_a_documentacao_conhece_todas_as_abas.py` | O portão que não existia: a documentação tem de conhecer TODAS as abas do glade | novo |

## Prova de trabalho

```bash
GDK_PIXBUF_MODULE_FILE=/usr/lib/x86_64-linux-gnu/gdk-pixbuf-2.0/2.10.0/loaders.cache \
  scripts/gui-captura/retratar_abas.py
python3 scripts/validar-acentuacao.py
python3 scripts/validar-palavra-de-tela.py
.venv/bin/python -m pytest tests/unit/test_a_documentacao_conhece_todas_as_abas.py -q
```

**Aceite:** `interface.md` descreve onze abas; nenhuma imagem do README ficou
para trás; e a captura roda limpa nos dois ambientes.

## As duas notas de doutrina

Não são burocracia — são a diferença entre uma regra que evoluiu e uma regra que
foi ignorada.

**VETO 3.** A `REGRA-NAO-REGISTRO-01` ganha o escopo decidido: *proibido declarar
o que o produto pode medir; permitido declarar o que ele comprovadamente não
mede*, com as duas salvaguardas. Quem ler a regra daqui a seis meses precisa
entender por que a aba Configurações existe sem parecer que alguém a furou.

**Escopo dos externos.** A fala em `external_controllers.py:11-14` —
*"só uma aba pra ver como os controles aparecem, não uma super central"* —
**não sai**. Ganha nota datada abaixo, dizendo que em 21/08/2026 o escopo foi
reaberto e apontando para [D-A2](DECISOES-ABERTAS.md). O padrão da casa para
decisão revogada é NOTA DATADA dentro do próprio docstring, nunca apagar.

## O que saiu diferente do plano

**Três alvos já estavam feitos quando esta frente abriu**, e refazê-los seria
duplicar: as capturas (refeitas em quatro commits da leva, a última em
`85540ed`), o `GUIA-RADIO-DA-SALA.md` (versionado em `02fc5dc`) e a nota datada
do `external_controllers.py` (escrita junto de CONFIG-06, em `9069dcd`). Os três
foram conferidos, não reescritos.

**O `README.md` não citava a contagem de abas** — só a grade de imagens. Entrou
a linha da aba nova; nenhum número precisou mudar lá.

**Um portão nasceu que o roteiro não previa.** O que deixou a documentação
defasar não foi falta de disciplina: foi não haver nada medindo. O
`test_a_documentacao_conhece_todas_as_abas.py` deriva a lista de abas do
**próprio `main.glade`** e cobra seção no `interface.md` e imagem nos dois
documentos que a publicam. Quem acrescentar a décima segunda aba ganha o portão
de graça.

**Quatro correções de fato errado**, cada uma substituída onde aparecia:

* `interface.md` e `COMO-OLHAR-A-TELA.md` diziam **dez** abas e **dez** fotos;
* o `interface.md` afirmava que **todas** as fotos são de dois controles — a da
  aba nova é do fixture de quatro, porque a seção "Os controles" desenha um card
  por aparelho;
* o item 6 do [`TODO-INTEGRACAO.md`](TODO-INTEGRACAO.md) descrevia o
  `doctor.sh --json` como pendência. Aquele caminho foi **descartado com motivo**
  (o doctor não viaja nos pacotes) e a direção foi invertida — quem consome é o
  doctor;
* o mesmo arquivo prometia *"no máximo 40 % da força"* na seção que existe para
  a aba não aumentar dívida. O produto entrega **30%**.

**Estavam fora do território desta frente, e o PO fechou os três em 22/08:**
o [`INDICE.md`](INDICE.md) na D2 e na tabela de riscos, o
`docs/usage/quickstart.md` ("dez abas" → onze, com a Configurações na lista) e o
[`mockup/aba-configuracoes.html`](mockup/aba-configuracoes.html), que ganhou
nota datada no topo e a tabela do orçamento com os números que o produto
entrega.
