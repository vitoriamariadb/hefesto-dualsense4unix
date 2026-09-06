---
sprint: ROTA-A
estado: feita
---

# ONDA A — a identidade do controle

> **ESTADO 06/09/2026: feita** — fase fechada em 02–03/09 (ONDE PARAMOS de 02/09, fim do dia; a aba 03 em 03/09).

**A raiz de metade do que ela viu.** Leia o
[índice da rota](2026-09-02-ROTA-DO-HTML-INDICE.md) antes.

## O DEFEITO, medido em 02/09/2026 com dois controles na mesa

`Cosmic Red` e `Starlight Blue` estão **cravados no HTML — 170 vezes nas dez
abas**, 54 só na Iluminação. O daemon publica `uniq`, `transport`,
`battery_pct`, `player`, `player_slot`, `lightbar_rgb`, `inputs`, `audio`,
`speaker`, `vpad_backend` — e **nada que identifique o aparelho**.

```
o que ela viu:  1 controle  -> o USB chamava-se "Starlight Blue"
                2 controles -> o MESMO USB virou "Cosmic Red"
```

**O nome vem da POSIÇÃO.** E na aba Jogar a mesma tela chama o mesmo controle de
`P1 · Cosmic Red · USB` no chip e `Starlight Blue · USB` no card, ao mesmo tempo.

Consequência visual: na Iluminação a borda do desenho é a cor do PLÁSTICO, e ela
desenha **vermelho no controle azul** e **azul no vermelho**, porque o modelo é
inventado pela ordem.

## A CASA JÁ SABE FAZER — a cadeia está cortada em dois pontos

`integrations/cor_do_plastico.py` tem:

| função | o que faz |
| --- | --- |
| `cor_do_serial(serial)` | *"A cor escondida nos caracteres 5 e 6 do serial de fábrica"* |
| `decodificar(dados)` | lê o feature report e devolve o modelo |
| `cor_do_codigo(codigo)` | a tabela — **a única que a interface chama** |
| `cor_do_nome(nome)` | por nome comercial |

```
firmware → [1] o daemon não publica serial/modelo → [2] a interface não decodifica → HTML cravado
```

## ANTES DO PASSO 1: A PERGUNTA DO REUSO

**A ONDA B mediu, e vale para esta também:** a aba que mais reusa o motor GTK é
a que mais funciona (`a08_conexoes`, 14 imports, 73%); as que reescreveram estão
em 4% e 20%.

**Então comece perguntando, não escrevendo.** Para a identidade, o motor tem:

```
integrations/cor_do_plastico.py   cor_do_serial · cor_do_codigo · cor_do_nome · decodificar
app/widgets/controller_card.py    como a GTK montava o cartão de cada controle
gui/aba_conexoes.py               o desenho do gabinete (já reusado pela a08)
```

**A GTK mostrava o modelo?** Consulte o grafo da árvore estável e o
`controller_card.py`. Se mostrava, a lógica dela é a que se liga — não uma nova.

## O QUE FECHOU EM 02/09/2026 — os passos 1 e 2

| | onde |
| --- | --- |
| o daemon publica `serial`, `modelo` e `nome_declarado` por controle | `daemon/ipc_handlers._identidade_publicada` |
| a leitura de aparelho sai do tique e vira cache de sessão, **uma pergunta por endereço** | `_identidade_de_fabrica` + `_perguntar_identidade` |
| o serial deixa de ser descartado dentro do `decodificar` | `integrations/cor_do_plastico.serial_de` + `ler_identidade_pelo_cabo` |
| o dono do nome na tela | `interface/pacotes.identidade_de` |
| as réguas | `tests/unit/test_os_donos_de_fato.py` (37) |

**`nome_declarado` é a TERCEIRA chave, e ela não estava no plano.** Sem ela o
primeiro termo da ordem — *"o que ELA nomeou"* — não tem fonte: a declaração
dela vive em `maquina.json` (`controles[<uniq>].cor`), que o `state_full` não
publicava. Custo zero: o daemon já carrega o documento em `_maquina` no boot e
o rebinda no "Aplicar".

**O passo 3 NÃO foi feito** — ver o fim deste arquivo.

## OS PASSOS

### 1. O daemon passa a publicar a identidade

**Arquivo:** `daemon/ipc_handlers.py`, no bloco que monta cada entrada de
`controllers` do `state_full`.

Acrescentar ao dicionário por controle: `serial` (o de fábrica, se o backend o
tiver) e `modelo` (o código/nome que `cor_do_plastico` decodifica).

**A DISCIPLINA:** `None` quando não souber. **Nunca** invente, nunca caia num
padrão. Um `modelo=None` honesto é o que faz a tela mostrar travessão; um modelo
inventado é o defeito que esta onda existe para matar.

**CUIDADO MEDIDO:** ler feature report DISPUTA o hidraw com o daemon — é a
armadilha nº 3 desta casa (`test trigger --raw` imprime "aplicado" sem ter
aplicado). Se a leitura precisar do aparelho, ela é do DAEMON, que já tem o fd,
e nunca de um instrumento paralelo.

### 2. Um dono só, na interface

**Arquivo:** `interface/pacotes/__init__.py`.

Uma função — `identidade_de(c)` — que devolve o nome a mostrar, com a ordem de
preferência escrita e testada. Ela é a ÚNICA que as abas chamam.

```python
def identidade_de(c: dict) -> str:
    """O nome deste controle na tela, ou o travessão.

    Ordem: o que ELA nomeou > o modelo decodificado > o transporte só.
    NUNCA a posição — foi o que fez o mesmo controle mudar de nome quando
    o segundo entrou na mesa.
    """
```

### 3. As abas param de cravar

**Arquivo:** nenhum HTML publicado. Os geradores escrevem na BANCADA, e o campo
ganha `data-campo` para o pacote poder pintar.

**SE ISSO EXIGIR HTML NOVO:** escreva em `mockup/`, declare em
`mockup/DIVERGENCIAS.md`, e PARE. Publicar é ato dela.

## AS RÉGUAS — o que cada uma tem de MORDER

1. **Nenhum nome de modelo cravado no HTML publicado.** Arranque a cura e ela
   reprova listando os 170.
2. **`identidade_de` não olha a posição.** Passe dois controles em ordem trocada
   e o nome tem de acompanhar o `uniq`, não o índice.
3. **`None` vira travessão, nunca um padrão.** Um controle sem modelo conhecido
   não pode ganhar nome de outro.
4. **O daemon publica a chave.** Se ela sumir do `state_full`, reprova.

## COMO SE SABE QUE FECHOU

```
Com DOIS controles na mesa:
  [ ] cada um mostra o próprio modelo, e são DIFERENTES entre si
  [ ] desligar o P1 e religar NÃO troca o nome do P2
  [ ] a borda do desenho na Iluminação é a cor do plástico DAQUELE controle
  [ ] `grep -c 'Cosmic Red\|Starlight Blue' src/.../paginas/*.html` == 0
  [ ] a saída do `--prova-no-aparelho` colada no relatório
```

## O QUE ESTA ONDA **NÃO** FAZ

- Não mexe em nenhum `aNN_*.py` além de ler o dono novo — as outras ondas estão
  neles ao mesmo tempo.
- Não publica HTML.
- Não toca no `player`/`player_slot` — isso é a ONDA B.

## O QUE FICOU ABERTO, e por quê (02/09/2026)

* **o passo 3 — as abas param de cravar.** Exige editar os `aNN_*.py` e os
  geradores (`src/hefesto_dualsense4unix/interface/aba01.py` e os nove irmãos),
  onde dez frentes estavam ao mesmo tempo. Os donos existem e estão testados;
  ligá-los é a próxima leva;
* **`grep -c 'Cosmic Red\|Starlight Blue' src/.../paginas/*.html == 0`** —
  continua **170**, e continuará até o passo 3;
* **a prova no aparelho.** Ela pede clique e escrita no daemon vivo, com dois
  controles na mesa e treze frentes em voo. É do orquestrador, serializada;
* **o `serial` publicado é o de fábrica, cru.** Ele identifica o aparelho de
  forma única, como um MAC. Quem o levar para a TELA ou para arquivo versionado
  responde pelas duas réguas de anonimato desta casa.
