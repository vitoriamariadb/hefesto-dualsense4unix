# PAREAMENTO-01 — a medição nova tem de chegar sozinha na tela

**24/08/2026.** Escrita a pedido dela, com as palavras dela:

> *"Os agentes de execução, ao concluírem as sprints, deixarem placeholders e
> afins — mas de forma que, ao atualizarmos a bancada do specs descobrindo X ou
> Y, com isso vamos conseguir parear tudo automaticamente. Pra que não tenhamos
> que mudar meio mundo depois, e ambos os trabalhos possam ser executados em
> paralelo."*

**A dor é de ontem.** Em 23/08 a bancada mediu que a cor do plástico **não** se
lê por rádio: o controle responde `HANDSHAKE 0x04` ao pedido de feature,
capturado com `btmon`. O fato foi substituído à mão em **oito** arquivos.
Nenhum portão teria acusado se um deles ficasse para trás — e dois ficaram:

- **`docs/data/mapa-controles.csv`**, a origem. A linha
  `identidade.cor_do_aparelho@dualsense` ainda traz `radio_evidencia` da
  medição de 15/08 (o `EIO`), `radio_ate_onde_foi = MONTOU` — quando hoje
  sabemos que o pacote **saiu no fio e foi recusado** — e
  `radio_por_que_nao_aciona = divida`, quando a medição de 23/08 mostrou que a
  causa é **do aparelho, não nossa** (o valor certo é o de P-05/P-07).
  Último commit do arquivo: 22/08, um dia antes da medição.
- **`src/hefesto_dualsense4unix/app/widgets/external_card.py:86`**, a tela:

  ```python
  DICA_DA_COR_NO_RADIO = "Lida do próprio controle, por cabo ou por rádio."
  ```

  Escrita em 22/08, um dia antes da medição. **A tela promete por rádio
  exatamente o que o firmware recusou.**

E o buraco que deixou os dois passarem está medido: `scripts/check_paridade_transporte.py`
abre quatro arquivos — `docs/data/mapa-controles.csv`, `docs/data/ensaios.csv`,
`specs.html` e `src/hefesto_dualsense4unix/integrations/ponte_escada.py` — e
**não olha uma linha de `src/hefesto_dualsense4unix/gui/main.glade` nem de
`app/`**. Mordido em 23/08: uma raiz falsa com um `main.glade` mentindo
("*a cor de fábrica é lida do aparelho também no rádio, sempre*") e uma raiz
**sem `main.glade` nenhum** produzem relatório **byte-idêntico** ao da raiz
real, `rc=0` nas três. O portão não distingue interface que mente de interface
que não existe.

E o vizinho não fecha pelo outro lado: `scripts/validar-palavra-de-tela.py` lê
só o `main.glade`, nunca toca o CSV, e declara no docstring que rótulo montado
em Python fica de fora **de propósito**. A dica da cor que mente é exatamente
uma constante Python. **Dois portões adjacentes e nenhum dos dois cruza a
fronteira.** É nessa fresta que esta leva se pendura.

---

## O DEFEITO, EM UMA FRASE

O mapa de canais e a interface falam do mesmo aparelho e **não têm nenhum
endereço em comum**, então toda medição nova chega na tela por cópia humana —
e quando a cópia falha, nada acusa.

---

## O QUE JÁ ESTÁ MEDIDO (a régua, declarada)

Levantado em 23/08 sobre `dev @ f0632cf`, com `grep -rn`, `csv.DictReader`,
`ast` e execução real do portão contra raiz falsa em scratchpad.

| Fato | Valor |
|---|---|
| Linhas do mapa / chaves distintas | **308 / 110** — `chave` não é endereço; `id` (`chave@controle`) é |
| `id` únicos e preenchidos | 308/308, e há portão vivo (regra `integridade`, `ci.yml:207`) |
| `id` estáveis | **NÃO, e sem portão.** A coluna `id_v1` guarda o endereço antigo em **136 de 308** linhas |
| Leitura do CSV por `src/` | **zero.** 16 ocorrências de `mapa-controles`/`docs/data` em `src/`, **todas** em docstring ou comentário |
| `specs.html` / `painel.html` citados em `src/` | **zero** |
| O CSV viaja no pacote? | **NÃO.** `pyproject.toml:83` traz `packages = ["src/hefesto_dualsense4unix"]`; `grep` por `mapa-controles` em `packaging/`, `flatpak/`, `scripts/build_*.sh` e `scripts/check_packaging_parity.sh` devolve zero |
| Linhas com afirmação forte (`aciona=sim` + `de_onde_sei=medido`) | 37 — das quais **1** cita `app/` ou `gui/` em `codigo_ref`, e é justamente a linha da cor |
| Rótulos do `main.glade` que citam transporte | **0 de 207** — a fala que afirma transporte mora em Python, não em XML |
| Frases de `app/`+`gui/` que citam cabo/rádio/Bluetooth, fora de docstring | **31** (piso); **135** contando docstring (teto) |
| Colunas órfãs (nenhum consumidor vivo) | **`cabo_por_que_nao_aciona`** e **`radio_por_que_nao_aciona`**, nascidas em 22/08 para viabilizar "o portão mais óbvio" e lidas por ninguém |

**Onde a régua mente, dito na cara:** as 31 não pegam f-string montada em
runtime nem frase que afirma capacidade sem usar a palavra "cabo"/"rádio". O
piso é 31; a população real é maior e **NÃO VERIFICADA**.

**E a direção "o mapa sabe e a tela não oferece" é INMENSURÁVEL hoje.** A
tentativa de casar as 37 linhas fortes com o texto da tela por palavra do
`rotulo` deu 0 linhas sem eco — obviamente falso: "controle", "microfone" e
"cor" aparecem em toda parte. A régua tem falso-negativo perto de 100% e foi
descartada. **Isso não é lacuna do levantamento: é a conclusão.** Sem endereço
declarado, essa direção não tem instrumento.

---

## O CONTRATO

Três peças, e a divisão entre elas **é** o contrato. Um agente executor segue
isto sem adivinhar.

### Peça 1 — o gerador: o CSV vira Python em *build time*

**A CRIAR — scripts/gerar-fatos-de-tela.py**, no molde de `scripts/gerar-mapa.py`
(mesmo `--check`, mesma comparação **por conteúdo**), gerando

**A CRIAR — src/hefesto_dualsense4unix/app/fatos_do_mapa.py**, versionado, com
cabeçalho "GERADO — não edite à mão":

```python
FATOS: Final[dict[str, FatoDoMapa]] = {
    "identidade.cor_do_aparelho@dualsense": FatoDoMapa(
        existe="tem",
        cabo=Lado(aceita="sim", aciona="sim", de_onde_sei="medido",
                  ate_onde_foi="O APARELHO OBEDECEU", por_que_nao_aciona=""),
        radio=Lado(aceita="desconhecido", aciona="não", de_onde_sei="medido",
                   ate_onde_foi="SAIU NO FIO", por_que_nao_aciona="o-aparelho-recusa"),
    ),
    ...
}
```

**O vocabulário não se redigita.** O gerador importa `DOMINIO_POR_SUFIXO`
(`check_paridade_transporte.py:558`), `DOMINIO_EXISTE` (`:570`) e `ESCADA`
(`:422`) do portão que já é dono deles — é a regra que `scripts/gerar-mapa.py`
já escreveu no próprio bloco de import: régua e legenda divergirem quer dizer
publicar uma página que descreve um domínio diferente do que o portão aceita.

**Por que gerado, e não lido em runtime:** o CSV **não está no wheel, no `.deb`
nem no Flatpak** (medido acima). Uma GUI que lê `docs/data/` funciona na
máquina dela e quebra na de quem instalou — o contrário exato do alvo 0.9.5.
O módulo gerado viaja no pacote.

### Peça 2 — o registro: onde a tela declara do que está falando

**A CRIAR — src/hefesto_dualsense4unix/app/fala_do_mapa.py**, escrito à mão,
~60 linhas, dono **só da amarração**:

```python
DICA_DA_COR_NO_RADIO = Fala(
    chave="identidade.cor_do_aparelho@dualsense",
    lado="radio",
    aba="Início",
    texto="No rádio o controle recusa o pedido da cor. Escolha na lista.",
    afirma=AFIRMA_NAO_ACIONA,
    porque="",
)
```

O vocabulário de `afirma` é minúsculo e mapeia 1:1 em coluna do mapa:

| `afirma` | o portão exige |
|---|---|
| `AFIRMA_EXISTE` / `AFIRMA_NAO_EXISTE` | `FATOS[chave].existe` == `tem` / `nao-tem` |
| `AFIRMA_ACIONA` / `AFIRMA_PARCIAL` | `FATOS[chave][lado].aciona` == `sim` / `parcial` |
| `AFIRMA_NAO_ACIONA` | `aciona` == `não` **e** `por_que_nao_aciona` ∈ `CAUSA_DE_FORA` |
| `AFIRMA_NADA` | nada — mas exige `porque=` escrito, linha a linha, no molde das listas de exceção de `scripts/validar-palavra-de-tela.py` |

**Por que `aciona = não` sozinho não basta.** Ele não diz de quem é a culpa.
Contado com `csv.DictReader` sobre `docs/data/mapa-controles.csv` em 23/08, os
valores reais das duas colunas de causa:

```
cabo : nada-a-acionar 10, decisao-tomada 8, so-ela-decide 1, divida 1
radio: nada-a-acionar 10, decisao-tomada 7, divida 3,        so-ela-decide 1
```

**Nenhum dos quatro separa "o aparelho recusa" de "ninguém escreveu o código".**
Sem a segunda condição, uma linha com `aciona = não` e `por_que = divida`
autorizaria na tela a frase *"No rádio o controle recusa o pedido"* — e o portão
ficaria **verde por cima de uma mentira sobre o aparelho**. É a mesma objeção
que esta página faz mais abaixo para proibir desligar COMPORTAMENTO por `aciona`
(*"a mesa dela virando teto do mundo"*), aplicada à **palavra** em vez do widget.

`CAUSA_DE_FORA = {"nada-a-acionar", "o-aparelho-recusa"}` — as duas únicas que
nomeiam causa **fora do nosso código**. `divida`, `decisao-tomada` e
`so-ela-decide` são nossas: com elas o único `afirma` legal é `AFIRMA_NADA` com
`porque=` explícito. O valor `o-aparelho-recusa` **é novo** e entra em P-07,
junto com a régua da coluna; hoje o domínio não tem quem diga isso, porque
`decisao-tomada` quer dizer *"não acionar é a escolha"* — a escolha **nossa**,
conforme a legenda em `tests/unit/test_o_mapa_separa_divida_de_decisao.py`.

**O caso que prova que a distinção importa é de ontem:** a cor por rádio tem
`aciona = não` porque o **firmware recusa** (`HANDSHAKE 0x04`, capturado com
`btmon`). Um item com `divida` tem `aciona = não` porque **ninguém escreveu o
código**. A tela pode dizer a primeira coisa; dizer a segunda como se fosse a
primeira é **culpar o aparelho pelo que é nosso**.

**A separação `existe` × `aciona` é o contrato inteiro**, porque é o defeito que
esta casa já pagou: a frase de `src/hefesto_dualsense4unix/app/audio_saida.py`
dizia *"no rádio não existe alto-falante"* (`AFIRMA_NAO_EXISTE`) e o mapa dizia
`existe = tem`, `radio_aceita = sim`. Corrigida à mão em 17/08/2026. Sob o
contrato, isso reprova no CI.

### Peça 3 — o portão: um só, nos dois sentidos

**A CRIAR — scripts/validar-fala-de-tela.py**, três modos: `--all`, `--fila`,
`--exigir-prazo`.

**Lê as `Fala` por AST, nunca importando o pacote.** A razão já está escrita em
`scripts/gerar-contrato-ipc.py`: `ImportError` num runner sem dependências vira
"zero métodos", que é o jeito silencioso de um portão se desligar.

A descoberta do desenho: *"a tela afirma além do mapa"* e *"o mapa mudou e
deixou a tela para trás"* são **a mesma comparação** — `Fala.afirma` contra
`FATOS[chave][lado]`. O que muda é qual lado se mexeu, e a mensagem de erro diz
qual, olhando o `git blame` do arquivo gerado.

**O que o portão NÃO compara, para não gritar falso:** `provado_em`,
`*_evidencia`, `*_detalhe`, `nota` — só as colunas de que o claim depende
(`existe`, `aceita`, `aciona`). Recarimbar uma prova não acorda o portão;
mudar o veredito acorda.

### A decisão que reconcilia as duas frentes

O levantamento pediu **uma coluna nova no CSV** dizendo onde a linha aparece na
tela. **Recusado, e o motivo importa:** essa coluna seria uma segunda cópia do
mesmo vínculo, mantida à mão, no arquivo que esta leva existe para tirar da
lista de "lugares a lembrar". **O endereço mora em UM lugar só: a `Fala` em
Python.** O gerador publica a lista invertida (`id` → onde aparece na tela)
dentro do `specs.html`, ao lado do `teste_que_morde` — assim a memória externa
dela ganha a informação **sem** ganhar mais uma célula para preencher.

---

## A FRONTEIRA QUE SALVA A PROPOSTA

Automatizar julgamento humano junto com fato é o erro clássico desta classe de
proposta. **Fica escrito, e fica forçado por teste.**

### DERIVA — domínio fechado, régua executável, o mapa é dono

`existe`, `cabo_aceita`/`radio_aceita`, `cabo_aciona`/`radio_aciona`,
`*_de_onde_sei`, `*_ate_onde_foi`, `*_por_que_nao_aciona`, `*_canal`,
`ponte_alcanca`. Todas têm domínio em `DOMINIO_POR_SUFIXO` ou em `ESCADA`.
Todas respondem sim/não/parcial a uma pergunta de fato.

### NÃO DERIVA — é dela

`rotulo`, `cabo_detalhe`/`radio_detalhe`, `cabo_ressalva`/`radio_ressalva`,
`nota`, `estado_hoje`, `*_feature_v1`, `*_evidencia`. Prosa de bancada, escrita
para quem depura rádio, não para quem joga. O `cabo_detalhe` de
`audio.alto_falante` tem ~400 palavras de protocolo; virar dica de tela é
impossível, e a tentativa é o erro que esta leva manda evitar.

**Precedente medido:** a única vez que esta casa suavizou uma palavra medida
para caber na tela ("alto-falante" → "placa de som", 15/08), ela derrubou —
*"falso, no próprio projeto já fizemos isso"*. O conserto foi **ela escrever a
frase**, não um gabarito melhor.

**Mecanicamente forçado:** o gerador tem uma *allowlist* de colunas emitidas, e
um teste reprova se coluna de texto livre entrar nela. Sem isso, a proposta
escorrega para "gerar a voz dela a partir de célula" em três levas.

### A mesma fronteira aplicada a COMPORTAMENTO — e este é o ponto fino

O produto pode usar `FATOS` para decidir o que **mostrar**? Só numa coluna:

- **PODE** esconder/desligar por `existe == "nao-tem"` — é fato do aparelho.
  `audio.alto_falante@pro` diz `nao-tem`: nenhum firmware faz um Pro Controller
  ganhar alto-falante.
- **NÃO PODE** desligar por `aciona`. `aciona` é afirmação sobre **o nosso
  produto na bancada dela**. Outro kernel, outro adaptador, outro firmware pode
  se comportar diferente, e o alvo declarado é a máquina **deles**. Desligar
  por `aciona` é a mesa dela virando teto do mundo.

Também não deriva: **a ordem das seções, o que nasce visível, e se a chave
merece espaço de tela**. São 110 chaves para 11 abas. A maioria nunca aparece,
e quais aparecem é decisão de produto — dela.

---

## O PLACEHOLDER

O que um agente de execução deixa quando a medição ainda não existe:

```python
DICA_SOM_DEDICADO_RADIO = Fala(
    chave="audio.saida_dedicada@dualsense",
    lado="radio",
    aba="Status",
    texto=NAO_MEDIDO,                 # sentinela — não é string, não é ""
    afirma=AFIRMA_NADA,
    pendente=Pendencia(
        aberta_em="2026-08-24",
        prazo_dias=30,
        quem_fecha="a bancada, com o aparelho na mão",
        o_que_falta="o conteúdo do payload da saída dedicada por rádio",
    ),
)
```

**(a) Não mente na tela hoje.** `NAO_MEDIDO` renderiza a frase única da casa —
*"Ainda não medimos isto no rádio."* — em estado visual neutro: **nunca verde,
nunca número, nunca barra em 0%**. A regra *"ausência de medição se declara,
nunca se preenche com zero, porque zero pinta verde"* fica no **tipo**: `Fala`
recusa em `__post_init__` construir pendência com valor numérico ou booleano. O
tipo faz o que a regra manda, em vez de a regra depender de alguém lembrar.

**(b) Encontrável por máquina.** `pendente is not None` → `--fila` varre o AST e
imprime chave, lado, aba, `arquivo:linha`, prazo, quem fecha, o que falta. **É a
lista de trabalho da bancada, gerada pela interface.** O laço fecha: a tela
passa a *pedir* a medição de que precisa.

**(c) Resolve-se sozinha quando a medição chegar — e a palavra é precisa.** O
que se resolve sozinho é a **pressão**, não a prosa. No dia em que
`FATOS[chave][lado].de_onde_sei == "medido"`, o portão vira de silencioso para
vermelho:

```
app/audio_saida.py:1017: a medição chegou (radio_de_onde_sei=medido,
  radio_aciona=não, provado_em=2026-09-02) e esta frase ainda diz que não
  sabemos. Aba: Status. Chave: audio.saida_dedicada@dualsense.
  Escreva a frase e apague `pendente=`.
```

Uma pessoa escreve uma frase e apaga quatro linhas.

**Auto-escrever a frase é o que esta leva RECUSA** — é a ideia mais elegante da
proposta e a mais errada: seria pôr palavra na boca dela.

**Envelhecimento.** `prazo_dias` vencido **avisa** no `--all` (saída 0, imprime)
e **reprova** no job de release (`--exigir-prazo`). O motivo do split está
escrito no cabeçalho de `scripts/validar-palavra-de-tela.py`, com nome: portão
que derruba o CI por trabalho que não é dele é desligado na semana seguinte. E
o release é o lugar certo pela regra dela — as imagens acompanham a versão, a
dívida também. `prazo_dias` é **por placeholder**, escrito por quem sabe quanto
demora, nunca uma constante global que erra para todos.

---

## A COREOGRAFIA DOS AGENTES

Onze agentes. Cada um devolve o que está na coluna, e nada mais.

| # | Agente | Papel | Retorno |
|---|---|---|---|
| 1 | **Vocabulário** | Extrai `DOMINIO_POR_SUFIXO`, `DOMINIO_EXISTE` e `ESCADA` do portão para import limpo; confirma que nenhum consumidor redigita valor | diff + prova de que `gerar-mapa.py --check` continua verde |
| 2 | **Gerador** | Escreve o gerador e o módulo gerado; `--check` por conteúdo | o módulo gerado + saída do `--check` antes/depois de editar uma célula |
| 3 | **Tipos** | Escreve `Fala`, `Pendencia`, `NAO_MEDIDO`, os seis `AFIRMA_*`, com a recusa no `__post_init__` | o módulo + o teste da recusa de zero/booleano |
| 4 | **Portão** | Escreve o validador AST, três modos, mensagens com endereço | as seis mordidas de P-03, cada uma arrancada e devolvida |
| 5 | **Censo da fala** | Reconta as 31 frases com régua independente da minha (AST + literal de `set_label`/`set_tooltip_text`, não só palavra); declara divergência | número novo + a lista, ou "confirmo 31" |
| 6 | **O caso da cor** | Corrige a linha do CSV e a dica de `external_card.py`; declara a primeira `Fala` | os dois diffs + o portão reprovando ANTES da correção |
| 7 | **Estabilidade do `id`** | Portão de renome, apoiado na `id_v1` que já existe em 136 linhas | o portão + mordida de renomear um `id` |
| 8 | **Colunas órfãs** | Dá régua a `cabo_por_que_nao_aciona`/`radio_por_que_nao_aciona`, acrescenta `o-aparelho-recusa` ao domínio e a condição `CAUSA_DE_FORA` ao portão | a regra nova, o número de linhas que ela alcança e as três mordidas de P-07 |
| 9 | **Sinônimo** | Resolve o caso microfone (ver P-10): mapa fala de firmware, tela fala de PipeWire | decisão escrita: endereço novo no mapa OU `AFIRMA_NADA` + `porque=` |
| 10 | **Fotógrafo** | `scripts/gui-captura/retratar_abas.py` antes e depois de P-04/P-06; as onze abas | os PNGs, e a confirmação de que só a aba tocada mudou |
| 11 | **Costureiro** | Junta, roda a bateria inteira do `CLAUDE.md`, fecha o commit | saída dos onze comandos + o commit |

**Territórios exclusivos:** os agentes 2, 3 e 4 escrevem arquivos que não
existem hoje e não colidem. O 6 é o único que toca `docs/data/mapa-controles.csv`
e `app/widgets/`. O 11 é o único que commita.

**O `ci.yml` é o único arquivo compartilhado** — P-02, P-03 e P-11 mexem nele. O
costureiro (11) aplica as três edições de uma vez, para não colidir. **P-11 é a
primeira delas:** sem ela os portões de P-06 e P-09 entram no CI já cegos.

---

## AS TAREFAS

Custo em arquivos tocados e linhas, estimado. **Classe de tela** carimbada pela
decisão dela de 23/08: *cosmética* é pré-aprovada; *estrutural* precisa do olho
dela.

### P-01 — o vocabulário tem um dono só

**Entrega.** `DOMINIO_POR_SUFIXO`, `DOMINIO_EXISTE` e `ESCADA` importáveis sem
efeito colateral; nenhum consumidor novo redigita valor.
**Mordida.** Acrescentar um degrau à `ESCADA` e ver o gerador de P-02 emitir o
degrau novo sem edição própria; tirar o import e ver o teste reprovar.
**Custo.** 1 a 2 arquivos, ~30 linhas. **Classe de tela:** não toca a tela.

### P-02 — o CSV vira Python que viaja no pacote

**Entrega.** O gerador e o módulo gerado, com `--check` por conteúdo (nunca por
`mtime` — a MAPA-CONTEÚDO-01 de 12/08 já pagou por isso duas vezes: por omissão
de fonte e por relógio do `actions/checkout`). Entrada no `pre-commit` e no CI
ao lado de `scripts/gerar-mapa.py --check` (`ci.yml:181`).
**Mordida.** Editar uma célula do CSV sem regerar → `--check` reprova com diff.
Segunda mordida: pôr coluna de texto livre na allowlist → o teste da fronteira
reprova.
**Custo.** 2 arquivos novos (~200 + ~350 geradas), 2 linhas de CI.
**Classe de tela:** não toca a tela.

### P-03 — o portão, nos dois sentidos

**Entrega.** O validador AST com `--all`, `--fila` e `--exigir-prazo`; `--all`
no CI.
**As seis mordidas**, cada uma arrancada, vista reprovar e devolvida:

1. Trocar `AFIRMA_NADA` por `AFIRMA_NAO_EXISTE` na frase de
   `src/hefesto_dualsense4unix/app/audio_saida.py` → reprova citando
   `existe=tem`. **É o defeito de 17/08 reproduzido como teste**: o portão
   nasce provado contra um bug que chegou à tela.
2. Editar o CSV sem regerar → `--check` reprova.
3. Num CSV de mentira, virar `radio_de_onde_sei` para `medido` numa chave com
   placeholder aberto → reprova dizendo "a medição chegou".
4. `prazo_dias=1` com `aberta_em` de ontem → `--exigir-prazo` reprova, `--all`
   só avisa.
5. Coluna de texto livre na allowlist → o teste da fronteira reprova.
6. **A régua validada contra contagem independente:** a população de `Fala`
   vem do AST, e a lista de abas promovidas é um `frozenset` **do próprio
   arquivo de teste**, não lida da árvore — a lição de
   `tests/unit/test_o_mapa_separa_divida_de_decisao.py` ("um teto lido do
   próprio CSV passaria sempre, e é o defeito que a ADR-016 pagou por um mês").

**Custo.** 1 script novo (~250 linhas), 1 teste novo (~200), 2 linhas de CI.
**Classe de tela:** não toca a tela.

### P-04 — a dica da cor para de mentir

**Entrega.** `DICA_DA_COR_NO_RADIO` reescrita em
`src/hefesto_dualsense4unix/app/widgets/external_card.py:86` e declarada como
`Fala` com `AFIRMA_NAO_ACIONA`.
**Mordida.** Devolver o texto antigo → o portão reprova com endereço e com as
células do mapa na mensagem.
**Custo.** 2 arquivos, ~15 linhas.
**Classe de tela: ESTRUTURAL — precisa do olho dela.** É texto reescrito, e
muda o que se lê ao abrir. Foto antes e depois; a palavra final é dela.

### P-05 — o CSV recebe a medição de 23/08

**Entrega.** Na linha `identidade.cor_do_aparelho@dualsense` (hoje
`docs/data/mapa-controles.csv:111`): `radio_evidencia` passa a citar o
`HANDSHAKE 0x04` capturado com `btmon`, `radio_ate_onde_foi` sai de `MONTOU`
para o degrau que descreve "saiu no fio e foi recusado", e
`radio_por_que_nao_aciona` sai de `divida` para **`o-aparelho-recusa`** — o valor
que P-07 acrescenta ao domínio. **Não é `decisao-tomada`:** quem recusou foi o
firmware, e `decisao-tomada` diria que a escolha foi nossa. As duas linhas de
bancada entram em `docs/data/ensaios.csv` — **evidência bruta, não cópia**.
**Mordida.** Rodar `scripts/check_paridade_transporte.py` antes e depois; o
degrau novo tem de bater com a `ESCADA` ou reprova.
**Custo.** 2 arquivos, ~4 linhas. **Classe de tela:** não toca a tela — mas
sozinha ela vira o portão de P-04 vermelho, e é isso que se quer.
**Depende de P-07:** é essa célula que licencia o `AFIRMA_NAO_ACIONA` de P-04.

### P-06 — o `id` para de poder sumir em silêncio

**Entrega.** Regra nova no portão do mapa: `id` que desaparece entre `HEAD~1` e
`HEAD` sem aparecer em `id_v1` de outra linha **reprova**, com nota datada como
única saída — o molde da dívida declarada de `scripts/validar-palavra-de-tela.py`.
**Por que primeiro.** O `id` tem a forma certa e **metade** da garantia: é único
e publicado (regra `mapa-nao-publicado` exige que todo `id` apareça no
`specs.html`), mas **nada trava renome**. Um `id` renomeado hoje passa verde e
leva junto toda `Fala` que se apoiar nele.
**Mordida.** Renomear um `id` e ver reprovar; acrescentar a nota e ver passar.
**Custo.** 1 arquivo, ~60 linhas. **Classe de tela:** não toca a tela.
**Não entra sem P-11:** no runner, `HEAD~1` não existe.

### P-07 — as duas colunas órfãs ganham quem as leia

**Entrega.** `cabo_por_que_nao_aciona` e `radio_por_que_nao_aciona` — nascidas
em 22/08 para viabilizar "o portão mais óbvio", preenchidas em 20 e 21 linhas,
**lidas por ninguém** — passam a alimentar a mensagem do portão de P-03 e a
coluna correspondente do `specs.html`.

**E é aqui que entra a condição que impede o portão de licenciar astrologia:**
o domínio ganha o valor **`o-aparelho-recusa`** (causa fora do nosso código,
como o `HANDSHAKE 0x04` da cor por rádio), e o portão de P-03 passa a exigir
`por_que_nao_aciona ∈ CAUSA_DE_FORA` para aceitar `AFIRMA_NAO_ACIONA` — ver
"Por que `aciona = não` sozinho não basta". O domínio hoje mora no docstring de
`tests/unit/test_o_mapa_separa_divida_de_decisao.py`, que já registra que o
lugar dele é o `DOMINIO_POR_SUFIXO` do portão; esta tarefa é quem o muda.

**Mordidas.** (1) Esvaziar uma célula `*_por_que_nao_aciona` numa linha com
`aciona=não` e `de_onde_sei=medido` → reprova. (2) Declarar `AFIRMA_NAO_ACIONA`
numa `Fala` cuja chave tem `por_que_nao_aciona = divida` → **reprova dizendo que
a causa é nossa**, e a saída oferece `AFIRMA_NADA` + `porque=`. (3) Trocar
`o-aparelho-recusa` por `decisao-tomada` na linha da cor → a mesma reprovação,
porque `decisao-tomada` também é causa nossa.
**Custo.** 3 arquivos, ~50 linhas. **Classe de tela:** não toca a tela.
**Nota:** é a família *"a casa sabe e o produto não faz"* com **dois dias** de
idade. Vale registrar que a distância entre escrever a coluna e ligá-la foi de
48 horas — o defeito não precisa de meses para nascer.

### P-08 — a fila da bancada sai pela interface

**Entrega.** `--fila` publicado: a lista de placeholders abertos entra no
`specs.html` (ao lado do `teste_que_morde`) e no `painel.html`, com a lista
invertida `id` → onde aparece na tela.
**Mordida.** Abrir um placeholder novo e ver a linha aparecer nos dois HTML
sem edição manual; fechar e ver sumir.
**Custo.** 2 scripts editados, ~50 linhas.
**Classe de tela: ESTRUTURAL** para a frase única de `NAO_MEDIDO` — uma vez, e
depois é constante. Cada placeholder novo é **cosmético**.

### P-09 — o portão cresce de "avisa" para "reprova", uma aba por vez

**Entrega.** `ABAS_COM_FALA_DECLARADA: frozenset` no portão. Aba **dentro** do
conjunto: 100% das frases de transporte declaradas, ou reprova. Aba **fora**:
livre. O conjunto **só cresce** — o mesmo gesto do `TETO_DA_DIVIDA` que só
desce.
**Primeiras promovidas:** **Início** e **Status** — é onde a frase falsa de
17/08 morava e onde a pessoa lê "isto funciona?". Depois **Configurações** e
**Lightbar**, que é onde o caso da cor bate.
**Mordida.** Promover uma aba com uma frase de transporte não declarada → tem
de reprovar. Despromover não pode ser possível: o teste assere que o conjunto
de hoje é superconjunto do da referência anterior.
**Custo.** 1 linha por aba promovida.
**Classe de tela:** não toca a tela.
**Não entra sem P-11:** no runner, `HEAD~1` não existe.

### P-10 — o sinônimo, e por que ele decide se o portão sobrevive

**O caso, medido.** `src/hefesto_dualsense4unix/app/widgets/controller_card.py:593`
diz *"Volume da captura do microfone, no sistema. Vale igual no cabo e no
rádio"*. A linha `audio.microfone.volume@dualsense` marca `cabo_aciona = não`
**e** `radio_aciona = não`. **Não é contradição:** a linha do CSV fala do byte 6
do report de firmware (`cabo_detalhe`: *"Cura escrita e nunca ligada"*); a tela
fala do volume de captura no PipeWire. **São dois conceitos e o mapa só tem
endereço para um.**

**Isso não é ruído — é a medida do problema.** O mapa é modelado por firmware, a
tela por pessoa. Sem endereço declarado, nenhuma régua automática separa a
mentira do sinônimo, e um portão que grita falso é desligado na semana seguinte.

**Entrega.** Uma decisão escrita, entre duas: **(a)** o mapa ganha a linha que
falta (`audio.microfone.volume_do_sistema@dualsense`) e a tela aponta para ela;
ou **(b)** a frase vira `AFIRMA_NADA` com `porque=` explicando a distinção.
**Recomendação:** (a), porque o volume do sistema **é** uma capacidade do
produto e merece linha; (b) esconde a lacuna.
**Mordida.** Depois da decisão, apontar a frase para a chave errada tem de
reprovar.
**Custo.** 1 a 3 arquivos, ~20 linhas. **Classe de tela:** não toca a tela em
(b); em (a), **estrutural** se a frase for reescrita.

### P-11 — o `HEAD~1` que os dois portões comparam não existe no CI

**O defeito, medido.** P-06 e P-09 comparam contra `HEAD~1`. O
`.github/workflows/ci.yml` tem **20** `actions/checkout@v4` e **nenhum** com
`fetch-depth` — `grep -c "actions/checkout@v4"` devolve 20, e
`grep -A3 "actions/checkout@v4" | grep -c "fetch-depth"` devolve 0. O padrão da
ação é profundidade 1: **`HEAD~1` não existe no runner**, e os dois portões
nasceriam verdes sem medir nada. É a classe que esta casa mais paga.

**Entrega.**

1. `fetch-depth: 0` nos dois jobs que rodariam esses portões: o de mapa de
   canais (checkout em `.github/workflows/ci.yml:176`, portão em `:207`) e o de
   lint e teste (checkout em `.github/workflows/ci.yml:338`, unit em `:501`).
2. **A referência de comparação vem do evento, não de `HEAD~1`.** Os portões
   recebem `--contra <ref>`; o CI passa o intervalo do payload. É exatamente o
   que a casa já faz no portão de anonimato: checkout com `fetch-depth: 0` em
   `.github/workflows/anonymity-check.yml:36-39` e o intervalo montado logo
   abaixo, em `:45-53`, como `PR_BASE_SHA..PR_HEAD_SHA` ou
   `PUSH_BEFORE..PUSH_AFTER`. `HEAD~1` fica só de padrão para quem roda local.
   Sem isto, num PR de cinco commits o portão compara contra o commit anterior
   em vez da base — e um renome feito no primeiro commit passa.
3. **Referência que não resolve REPROVA alto**, nunca passa calado. O mesmo
   portão de anonimato já escreveu o motivo em `anonymity-check.yml:67-70`:
   engolir o código de saída de um `git log` que falha por *"objeto ausente num
   clone raso"* é o jeito silencioso de um portão se desligar.

**Mordida.** `git clone --depth 1` da própria árvore, rodar os dois portões →
têm de **reprovar pedindo histórico**, não sair 0. Depois, apontar `--contra`
para uma ref inexistente → reprova nomeando a ref.

**Custo.** 2 blocos do `ci.yml` (~4 linhas), ~15 linhas nos dois portões.
**Classe de tela:** não toca a tela.

**O precedente é do mesmo job e da mesma ação.** O comentário MAPA-CONTEÚDO-01
já registra ali uma armadilha do `actions/checkout` — o `mtime` que era ordem de
checkout, e fazia o passo passar sempre. Esta é a segunda do mesmo padrão, no
mesmo job: **o defeito não é o portão estar errado, é o runner não ter o que ele
lê.**

---

## A MIGRAÇÃO INCREMENTAL

**Não há *big bang*, e não é concessão — é o desenho.** `Fala` é opt-in, e os
portões **só enxergam o que foi declarado**. No dia 1 o registro tem zero
entradas e tudo passa. Não há nada a converter.

| Fase | O que entra | Custo | Quem |
|---|---|---|---|
| **F0** — uma leva | P-01 a P-07, mais **P-11** (que P-06 exige). Registro com **duas** entradas: a dica da cor (P-04) e a frase de `audio_saida.py` (a prova do portão) | 5 arquivos novos, ~1 dia | dono de `scripts/` + `app/` |
| **F1** — por aba, **de carona** | Quem conserta uma aba declara `Fala` para as frases de transporte que a aba **já tem**. Nenhuma frase nova. Placeholder para o que a aba precisa e o mapa não tem | ~3 frases por aba (31 ÷ 11) | quem já está na aba — **zero sessão extra** |
| **F2** — o portão cresce | P-09, uma aba por vez | 1 linha por aba | a leva que fecha a aba |

**Os ~110 × 11 do enunciado nunca acontecem.** A população não é chave × aba: é
**frase de tela que afirma transporte**, e são 31 medidas (piso). A conta certa
muda a proposta de "impossível" para "de carona".

**Onde a migração pode dar errado, dito antes:** se o censo do agente 5 devolver
um número muito acima de 31 — digamos, acima de 80 — a F1 deixa de caber de
carona e a resposta certa é **reduzir o alcance**, não aumentar o esforço:
promover só Início e Status, e deixar as outras nove livres por tempo
indeterminado. Um portão que cobre duas abas e é verdadeiro vale mais que um
que promete onze e é desligado.

---

## A PROVA COM O CASO REAL: a cor por rádio, refeita sob o contrato

**Os oito lugares de hoje**, medidos por `grep`:

| # | Lugar | O que carrega |
|---|---|---|
| 1 | `docs/data/ensaios.csv` | as duas linhas de bancada, com e sem suspeito |
| 2 | `docs/data/mapa-controles.csv` | as células `radio_*` da linha da cor |
| 3 | `docs/process/sprints/2026-08-15-UNIDADE-COR-01-o-controle-sabe-de-que-cor-ele-e.md` | a narrativa, com a linha que diz "e em 23/08/2026 pela causa" |
| 4 | `docs/process/2026-08-16-ONDE-PARAMOS-a-sessao-de-vinte-horas.md` | uma linha de tabela |
| 5 | `docs/process/estudos/2026-08-15-SEMPRE-IDENTIFICADO-a-resposta-e-o-MAC-e-onde-ela-falha.md` | o estudo |
| 6 | `tests/unit/test_o_mapa_separa_divida_de_decisao.py` | a dívida nomeada em comentário |
| 7 | `src/hefesto_dualsense4unix/integrations/cor_do_plastico.py` | a explicação do `-EIO` |
| 8 | `src/hefesto_dualsense4unix/app/actions/config/secao_controles.py` | "lida DO APARELHO, **pelo cabo**" |

E o **nono**, que ninguém notou porque não está em lista nenhuma:
`src/hefesto_dualsense4unix/app/widgets/external_card.py:86`.

**Sob o contrato, a mesma correção:**

1. A bancada acrescenta as linhas em `docs/data/ensaios.csv` — evidência bruta,
   fica.
2. Uma pessoa edita as células `radio_*` de `docs/data/mapa-controles.csv` —
   **1 arquivo**.
3. `python3 scripts/gerar-fatos-de-tela.py` reescreve o módulo gerado —
   **1 arquivo, gerado, nunca à mão**.
4. O portão reprova e **entrega o endereço**:

   ```
   app/actions/config/secao_controles.py:82: AFIRMA_ACIONA em
     identidade.cor_do_aparelho@dualsense[radio], e o mapa hoje diz aciona=não,
     de_onde_sei=medido, por_que_nao_aciona=o-aparelho-recusa.
   app/widgets/external_card.py:86: idem.
   ```

   **2 frases para reescrever, com endereço na mão.**

**O número.** Os lugares onde **o mesmo fato** é reafirmado e pode divergir em
silêncio caem de **4** (mapa, docstring do `secao_controles`, dica de tela,
comentário do teste) para **1** — o CSV. Os itens 3, 4 e 5 são **narrativa
histórica**, e o contrato não tenta eliminá-los: é a regra dela, *não se apaga
decisão medida*. O item 6 some, porque a lista de dívidas passa a ser gerada da
mesma fonte.

**Na conta de arquivos por commit: de 9 para ~4.** Melhoria modesta, e isto
está dito. **Na conta de risco de divergência silenciosa: de 4 cópias não
conferidas para 0** — toda cópia restante é conferida por portão. E o tempo de
"descobrir quais frases da tela ficaram mentindo" cai de *caçar por grep* para
*o portão te diz*. É esse o eixo que decide, e nele a melhoria é drástica.

---

## O ACEITE

1. `python3 scripts/gerar-fatos-de-tela.py --check` sai 0 na árvore limpa e
   reprova com diff depois de uma célula editada.
2. `python3 scripts/validar-fala-de-tela.py --all` sai 0, e cada uma das seis
   mordidas de P-03 foi arrancada, vista reprovar e devolvida — **com a saída
   colada no commit**.
3. `python3 scripts/validar-fala-de-tela.py --fila` lista os placeholders
   abertos com `arquivo:linha`, e o número bate com `grep -c "pendente=" `
   contado à mão.
4. A dica da cor no rádio **não promete mais o que o firmware recusa**, e a
   foto antes/depois foi vista **por ela**.
5. A linha `identidade.cor_do_aparelho@dualsense` carrega a medição de 23/08,
   com a causa nomeada como do aparelho — não como escolha nossa.
6. **`AFIRMA_NAO_ACIONA` numa chave com `por_que_nao_aciona = divida` reprova**,
   e a mensagem oferece `AFIRMA_NADA` + `porque=`. Sem isto o portão licencia
   frase que culpa o aparelho pelo que é nosso.
7. Renomear um `id` reprova.
8. **Os dois portões que comparam com o passado reprovam num clone raso**, em
   vez de sair 0: `git clone --depth 1` da árvore, rodar os dois, ver reprovar.
   E os dois jobs do `ci.yml` que os rodam têm `fetch-depth: 0`.
9. A bateria completa do `CLAUDE.md` verde, com
   `scripts/gui-captura/retratar_abas.py` rodado antes de commitar e as onze
   fotos no mesmo commit que toca `app/` ou `gui/`.

---

## O QUE FICA ABERTO

- **A direção "o mapa sabe e a tela não oferece" continua sem instrumento** até
  a F2 cobrir abas de verdade. Declaro o fracasso da régua tentada em 23/08 em
  vez de publicar o número falso que ela deu (0 linhas sem eco). Quando
  `ABAS_COM_FALA_DECLARADA` tiver duas abas, a pergunta passa a ter resposta
  **dentro daquelas duas** — e só ali.
- **A população real de frases de transporte é NÃO VERIFICADA.** 31 é piso, 135
  é teto contando docstring. O agente 5 refaz com régua independente; se
  divergir muito, a F1 muda de forma (ver "onde a migração pode dar errado").
- **O caso do sinônimo (P-10) é decisão de modelagem, não de código.** A
  recomendação está escrita; a escolha entre (a) e (b) é dela ou de quem for
  dono do mapa.
- **O `estado_hoje` está preenchido em 5 de 308** e não entra nesta leva. Fica
  registrado que é a próxima coluna a decidir: dar dono ou tirar.
- **Oito colunas (`*_offset`, `*_de_onde_sei`, `*_evidencia`, `*_detalhe`) só
  são alcançadas por sufixo**, via `pares_de_transporte()`. Funcionam, mas
  ninguém as nomeia — renomear qualquer uma quebra em silêncio. Não é escopo
  desta leva; é a mesma família de P-06.

---

**Nada disto foi executado.** Esta página planeja; a execução é de outra leva.
