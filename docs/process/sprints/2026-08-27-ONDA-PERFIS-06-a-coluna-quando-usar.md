---
sprint: ONDA-PERFIS-06
# onda: PERFIS
posse:
  P6:
    - src/hefesto_dualsense4unix/app/actions/profiles_actions.py
cria:
  - docs/process/sprints/2026-08-27-ONDA-PERFIS-06-a-coluna-quando-usar.md
  - tests/unit/test_a_coluna_quando_usar_fala_a_lingua_nova.py
bancada: false
depois_de:
  - ONDA-PERFIS-01
  - ONDA-PERFIS-02          # os cinco ambientes
  - ONDA-PERFIS-03
  - ONDA-PERFIS-04          # "Estilo de Jogo · Terror"
  - ONDA-PERFIS-05
nao_toca:
  - src/hefesto_dualsense4unix/profiles/
  - src/hefesto_dualsense4unix/gui/main.glade
---

# ONDA PERFIS · 06 — a coluna "Quando usar" diz o ambiente e o alvo

**O defeito em uma frase:** a coluna que devia responder *"quando este perfil
entra?"* diz **"Só neste programa"** para catorze perfis diferentes — a mesma
frase para o Mortal Kombat, o Orpheus e o Elden Ring, sem dizer qual é qual.

Hoje, `profiles_actions.py:280-286`:

```python
_MATCH_LABELS = {"any": "Sempre", "criteria": "Só neste programa",
                 "manual": LABEL_SO_MANUAL}
```

O mockup (`10-perfis.html:539-552`) responde com **duas palavras**: o ambiente,
e o alvo dentro dele.

| Hoje | O desenho aprovado |
|---|---|
| `Só neste programa` | `Jogo · mk1.exe` |
| `Só neste programa` | `Jogo da Steam · 1245620` |
| `Só neste programa` | `Estilo de Jogo · Terror` |
| `Sempre — 4 disputam, vence Pragmata` | `Todos — 4 disputam` |
| `Sempre` | `Todos — quando nenhum casa` |

## O que entrega

1. **`_match_label` passa a devolver o par ambiente + alvo**, derivado do
   `match` do disco — nunca de um campo novo. As regras, na ordem:
   - `wm_class` no formato `steam_app_<n>` → `Jogo da Steam · <n>`;
   - `process_name` com um item → `Jogo · <nome>`;
   - regra de estilo (ONDA-PERFIS-04) → `Estilo de Jogo · <rótulo>`;
   - `MatchAny` → `Todos`;
   - `MatchCriteria` vazio e `MatchManual` → o `LABEL_SO_MANUAL` de hoje
     (`:278`), que continua certo e continua tendo o motivo escrito no R-12.
2. **"Sempre" vira "Todos"** — a mesma palavra do seletor. Duas palavras para o
   mesmo conceito na mesma janela é o que a D-AS-ABAS-CONVERSAM proíbe.
3. **A disputa fica**, e continua espelhando o desempate real do
   `profiles/manager.py` — nunca reimplementando critério próprio. A linha do
   mockup para o `Navegação` é `Todos — 4 disputam`; a disputa inteira, com a
   ordem do desempate, **continua na dica**, como já é hoje
   (D-TUDO-QUE-EXPLICA-VIRA-DICA).
4. **O Universal ganha a frase própria**: `Todos — quando nenhum casa`
   (`10-perfis.html:552`) — depende do que a ONDA-PERFIS-07 gravar.
5. **A contagem no rótulo da seção**: `N no disco · role para ver todos`
   (`10-perfis.html:519`), lida do mesmo cache que a lista já usa
   (`_profiles_cache`, `:1261`) — nada de segunda leitura de disco.

## Como se prova (o teste que morde)

`tests/unit/test_a_coluna_quando_usar_fala_a_lingua_nova.py` — funções puras,
sem GTK, como as de hoje já são (`:291`, `:381`):

1. **Cinco perfis, cinco frases diferentes.** Os cinco casos da tabela acima,
   comparados contra o texto exato. Mordida: devolva `"Só neste programa"` para
   o caso do `process_name` e veja reprovar mostrando as duas linhas iguais.
2. **Nenhuma frase da coluna contém a palavra "Sempre".** Mordida: devolva
   `_MATCH_LABELS["any"] = "Sempre"` e veja reprovar.
3. **A disputa não muda de vencedor.** Reusar o cenário já medido no comentário
   de `:317-330` (quatro catch-all no disco dela) e exigir o **mesmo vencedor**
   de hoje. Mordida: inverta a ordem de `vencedor_da_disputa` e veja reprovar —
   é a rede contra reescrever o desempate ao reescrever o texto.
4. **A contagem bate com o tamanho da lista**, e não com uma leitura de disco
   paralela. Mordida: some um ao número e veja reprovar.

## O que é dela decidir

1. **`Jogo · mk1.exe` mostra o executável.** Ela pediu que a interface falasse a
   língua de quem joga, não a do sistema (*"temos que pensar não em mim mas no
   usuário leigo médio"*, D-A-INTERFACE-E-UNIVERSAL-NAO-SO-STEAM) — e
   `mk1.exe` é nome de arquivo. O mockup é dela e diz `mk1.exe`, então fica;
   mas se o produto souber o nome bonito do jogo (`jogos_locais.catalogo_de_jogos`),
   vale trocar?
2. **`Jogo da Steam · 1245620` mostra o número.** Mesmo caso: o catálogo `.acf`
   sabe que 1245620 é o Elden Ring.
