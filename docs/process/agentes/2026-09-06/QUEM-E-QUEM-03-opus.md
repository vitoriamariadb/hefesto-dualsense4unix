# QUEM-E-QUEM-03 — as nove features têm dono, e a conta sai da mão

**Árvore:** `hefesto-voo/QUEM-E-QUEM-03-opus` · branch `voo/QUEM-E-QUEM-03-opus`
· nasceu de `onda/atual-0609` em `c15d2e3e`, conferido.
**Bancada:** não pedida, e não precisava — `bancada: false`, e o portão é
universal por construção (lê modelo pydantic e fonte de módulo, sem aparelho).

## O que mudou

**Um arquivo, e é um teste.** `profiles/schema.py` não foi tocado — o
`nao_toca` da sprint valeu, e `git diff -- src/` fecha em zero linhas.

`tests/unit/test_quem_e_quem_03_o_censo_das_features_por_controle.py`, 17
testes, 0,34 s. Ele carrega o **CENSO** como dado literal: as NOVE features que
a tela oferece por controle, e por linha o campo (ou `None`), o subcampo quando
duas dividem um, o nível (`por-controle` · `global` · `ausente`), o que `None`
significa NAQUELE campo, quem responde no lugar, a sprint dona e a chave do
mapa. O que ele vigia:

1. **o censo bate com `ControllerOverrides.model_fields` nos dois sentidos** —
   campo fora do censo reprova nomeando o campo; feature declarada presente sem
   campo no modelo reprova no outro sentido;
2. **a conta escrita à mão no `schema.py` deixou de poder mentir.** É o defeito
   que abre a sprint, e o teste novo desta execução: o comentário
   `# SÃO SEIS, e a tela oferece nove` é lido da FONTE (`inspect.getsource`),
   os dois numerais são traduzidos, e comparados com
   `len(ControllerOverrides.model_fields)` e com o tamanho do censo. **Nenhuma
   régua desta casa lia esse comentário até agora** (`grep` por `SÃO QUATRO` /
   `SÃO SEIS` em `tests/` e `scripts/`: quatro ocorrências, todas em outro
   assunto);
3. **"sem opinião" é declarado, nunca em branco** — e o que muda de campo para
   campo é *quem é a máquina que responde*, então cada linha escreve a sua;
4. **a parcialidade vale DENTRO da seção** — `model_fields_set`, e o mesmo
   depois de passar pelo disco (`Profile.model_validate`). É a regressão R-20
   de 23/07 em letra;
5. **a linha sem dono é nomeada, não silenciosa** — feature sem dono PASSA e sai
   impressa com o motivo. Ausência de dono é fato do projeto, não defeito do
   código;
6. **a régua sabe recusar** — as quatro contas são funções puras, exercitadas
   contra um censo sintético.

**A ROTA CORRIGIDA mandou conferir a conta antes de escrever, e ela tinha
mudado duas vezes.** O comentário dizia `QUATRO` em 29/08 e diz **`SEIS`** hoje:
o `mic` entrou em 03/09 (MIC-QUINTO-AJUSTE-01) e o `sensores` em 04/09
(SENSOR-DE-VERDADE-01). O censo nasceu contando o que existe hoje.

**A conta de hoje, medida:** seis campos por controle (`leds`, `triggers`,
`rumble`, `speaker`, `mic`, `sensores`), nove features na tela, **uma sem
dono**.

| Feature | Onde mora hoje | Dono |
| --- | --- | --- |
| barra de luz | `leds` | PERFIL-02 |
| gatilho | `triggers` | PERFIL-02 |
| vibração | `rumble` | POR-UNIDADE-01 |
| alto-falante | `speaker` | POR-UNIDADE-01 |
| microfone | `mic` | MIC-QUINTO-AJUSTE-01 |
| giroscópio | `sensores.giroscopio` | SENSOR-DE-VERDADE-01 |
| acelerômetro | `sensores.acelerometro` | SENSOR-DE-VERDADE-01 |
| o controle é visto como | fora do perfil: `daemon/subsystems/external_mask.py` | A-MASCARA-POR-CONTROLE-01 |
| **touchpad** | **lugar nenhum** | **NINGUÉM** |

`ruff check` e `mypy` limpos no arquivo novo.

## Qual mordida prova

**Sete mordidas, e as sete reprovam.** As duas primeiras arrancam a cura no
PRODUTO (`schema.py`, restaurado depois — `git diff -- src/` fecha em zero):

**1. campo novo em `ControllerOverrides`, censo intocado** — é a sprint seguinte
batendo no portão, que é para isso que ele existe. Reprovaram DOIS testes:

```
E  AssertionError: campo(s) de ControllerOverrides fora do censo: ['touchpad'].
E  AssertionError: a conta do comentário de ControllerOverrides diz 6 e a classe
   tem 7 campos (['leds','mic','rumble','sensores','speaker','touchpad','triggers']).
2 failed, 15 passed
```

**2. o comentário diz `CINCO` e a classe tem seis campos:**

```
E  AssertionError: a conta do comentário de ControllerOverrides diz 5 e a classe
   tem 6 campos (['leds','mic','rumble','sensores','speaker','triggers']).
1 failed, 16 passed
```

**3. `speaker` sai do censo** — reprova no outro sentido, e a régua sintética
reprova junto:

```
E  AssertionError: campo(s) de ControllerOverrides fora do censo: ['speaker'].
2 failed, 15 passed
```

**4. apago a frase de `sem_opiniao` do microfone:**

```
E  AssertionError: microfone: o campo 'mic' existe e não diz o que `None`
   significa nele. (…) essa confusão já custou a regressão R-20
1 failed, 16 passed
```

**5. `model_dump()` denso no lugar de `model_fields_set`** — o R-20 em letra:

```
E  AssertionError: o override de brilho materializou outros campos de LedsConfig
1 failed, 16 passed
```

**6. dono falso para o touchpad** (e, à parte, **a linha do touchpad apagada**):

```
E  AssertionError: esperava exatamente uma feature sem dono ('touchpad') e encontrei []
E  AssertionError: assert 9 == (9 - 1)
2 failed, 15 passed
--- e com a linha apagada:
E  AssertionError: o censo tem 8 linhas e a tela oferece 9.
2 failed, 14 passed
```

**7. subcampo que não existe no modelo de dentro:**

```
E  AssertionError: giroscópio: ControllerSensoresOverride não tem o campo 'giro'
   — tem ['acelerometro', 'giroscopio']
1 failed, 16 passed
```

**Cura devolvida:**

```
.................                                                        [100%]
17 passed in 0.34s
```

**E uma armadilha desta casa foi aplicada de propósito.** A régua da conta
exige ocorrência **ÚNICA** do padrão no corpo da classe, e reprova nomeando a
ambiguidade se houver duas. É a lição de 05/09: um comentário escrito para
AVISAR sobre um padrão CITOU o padrão e virou a primeira ocorrência do arquivo,
derrubando treze testes. Aqui, quem escrever esse comentário leva vermelho com
a instrução de reescrevê-lo — em vez de o portão passar a medir a frase errada.

## O que NÃO verifiquei

- **Nada no aparelho.** O portão é universal por construção — lê modelo pydantic
  e fonte de módulo. Nenhuma célula do mapa foi EXERCITADA; as que aparecem no
  censo estão **citadas**, não medidas, e o campo `chave_do_mapa` existe para
  que a SPECS-A-PROCEDENCIA-01 as encontre.
- **Não abri a tela.** O trabalho não a toca. As afirmações sobre a aba
  Controles saíram de `grep` no HTML publicado
  (`src/hefesto_dualsense4unix/interface/paginas/02-controles.html`): 27 menções
  a touchpad, e as duas que carregam `data-campo` são `glifo-touchpad` — glifo,
  não interruptor. **Não cliquei** para confirmar que nenhuma das outras 25 vira
  interruptor em tempo de execução.
- **Não conferi se a tela oferece exatamente nove ajustes por controle.** O
  número 9 veio do comentário do `schema.py` e da tabela F2 da sprint, e o
  portão agora exige que os dois concordem — mas **quem contou a tela foi o
  comentário, não eu**. Se a tela passou a oferecer dez, o portão vai
  concordar consigo mesmo e estar errado nos dois lados.
- **Não rodei a suíte inteira** (é de quem coordena, em oito lotes) nem toquei
  em `install.sh`, `systemctl` ou bancada.

## O que sobrou para o próximo

1. **A PERGUNTA DELA, e é a razão de a nona linha existir:** o touchpad de cada
   controle guarda alguma coisa no perfil do jogo — ligado / desligado, ou
   sensibilidade —, ou é **só leitura** e o perfil não tem nada a lembrar dele?
   O mapa fecha um dos lados: `toque.touchpad.escrita` tem `existe=nao-tem` — o
   aparelho não tem por onde receber escrita de touchpad. Enquanto ela não
   responder, nove menos um, e o portão imprime a linha a cada execução.
2. **Para a SPECS-A-PROCEDENCIA-01:** nenhuma célula foi medida aqui. As chaves
   citadas no censo (`luz.barra`, `gatilho.adaptativo`,
   `vibracao.rumble.esquerdo`, `audio.alto_falante.volume`,
   `audio.microfone.mudo`, `movimento.giroscopio`, `movimento.acelerometro`,
   `toque.touchpad.escrita`) são referência de leitura, não medição nova.
3. **Achado que não é meu para consertar** — `docs/data/mapa-controles.csv` não
   tem chave para a máscara/`flavor` (o "o controle é visto como"), então a
   linha do censo dela ficou com `chave_do_mapa` vazio. Se a máscara merece
   chave no mapa, é decisão de quem possui o CSV.
4. **A contradição aberta continua aberta, e é dela** —
   `D-AUDIO-E-GIRO-NASCEM-LIGADOS` (nasce ligado) contra o contrato
   `None = sem opinião` do topo da docstring. O censo REGISTRA os dois na linha
   dos sensores; fechá-la escrevendo código é o que o `schema.py` proíbe.
5. **Quem acrescentar o sétimo campo por controle** passa por dois vermelhos
   agora, e os dois dizem o que fazer: a linha do censo e a conta do comentário.
