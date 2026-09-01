---
sprint: MIGRA-GATILHOS-10
onda: MIGRA-GATILHOS
posse:
  M10:
    - src/hefesto_dualsense4unix/profiles/curva_propria.py
    - src/hefesto_dualsense4unix/utils/xdg_paths.py
    - src/hefesto_dualsense4unix/app/actions/triggers_actions.py
    - src/hefesto_dualsense4unix/app/gui_dialogs.py
    - src/hefesto_dualsense4unix/interface/aba03.py
cria:
  - src/hefesto_dualsense4unix/profiles/catalogo_de_curvas.py
  - tests/unit/test_migra_gatilhos_meus_efeitos_ganham_tela.py
bancada: true
depois_de:
  - MIGRA-GATILHOS-09
  # SÉRIE, por R5: divide src/hefesto_dualsense4unix/interface/aba03.py com a 02, a 04 e a
  # 05, e triggers_actions.py com a 03 e a 04.
  - MIGRA-GATILHOS-02
  - MIGRA-GATILHOS-03
  - MIGRA-GATILHOS-04
  - MIGRA-GATILHOS-05
  # SÉRIE, por R5: divide triggers_actions.py e aba03.py com as de baixo.
  - MIGRA-GATILHOS-06
  - MIGRA-GATILHOS-07
  - MIGRA-GATILHOS-08
  # SÉRIE, por R5: divide utils/xdg_paths.py com esta.
  - IDENTIDADE-01  # fechou em 54b7ffd2; a série é nominal
  # SUBSTITUÍDAS por esta onda (ver o índice, "As sete sprints ONDA-GATILHOS").
  # Ficam aqui porque enquanto elas estiverem no disco a posse é real, e
  # silêncio não é declaração.
  - ONDA-GATILHOS-01
  - ONDA-GATILHOS-02
  - ONDA-GATILHOS-03
  - ONDA-GATILHOS-04
  - ONDA-GATILHOS-05
nao_toca:
  - src/hefesto_dualsense4unix/profiles/schema.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - scripts/gerar-tabela-de-curvas.py
  - docs/data/curvas-proprias.json
  # O portão da dívida é de QUEM COORDENA: cada sprint entrega o MANIFESTO do
  # que ligou, e quem coordena aplica todos num commit só (decidido em 25/08,
  # 2026-08-25-LIGAR-OS-MODULOS-A-TELA-INDICE-dez-frentes-em-quatro-ondas.md).
  - tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py
---

# MIGRA GATILHOS · 10 — "Meus efeitos" ganham tela

**O defeito em uma frase:** o formato do efeito de gatilho próprio, com
proveniência obrigatória, está escrito e validado desde julho — e **nenhum módulo
de `src/` o importa**. É `A-CASA-SABE-E-O-PRODUTO-NAO-FAZ` em estado puro, o
defeito mais caro desta casa.

E a página aprovada **já o desenha**: `aba03.py:230` escreve o separador
`──── Meus efeitos ────` dentro de cada `select.pronto`, com duas entradas
(`MEUS`, `:162`) que hoje **não existem em lugar nenhum**.

## A medição

`grep -rl curva_propria src/` — os únicos arquivos que aparecem são o próprio
módulo. **Zero importadores.** Duas lápides no portão o registram:

- `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py:1557`
  (`::CurvaPropria`), com o texto já atualizado em 29/08:
  *"O QUE FECHA: a ONDA-GATILHOS-05, que dá tela ao catálogo e põe a mão dela no
  gatilho para produzir a primeira curva."*
- `:1570` (`::CatalogoCurvasProprias`) — *"o único leitor dele é
  `scripts/gerar-tabela-de-curvas.py`:52, um gerador de documentação. Nada em
  `src/` o carrega do disco."*

**Esta sprint é a herdeira nominal da `ONDA-GATILHOS-05`**, que continua válida
no diagnóstico e caduca nas citações de mockup. As lápides passam a nomeá-la, e
saem **por medição**, não à mão: quem as tira é
`test_nenhuma_lapide_sobreviveu_a_propria_cura`, reprovando se ficarem.

## Os TRÊS buracos, medidos hoje no fonte

**1 · O catálogo não tem onde morar do lado dela.** O único caminho que existe é
`docs/data/curvas-proprias.json` — arquivo **do repositório**, que a usuária não
tem. `utils/xdg_paths.py` já dá `profiles_dir()` (`:113`) e mais sete irmãos;
falta o das curvas.

**2 · Falta o byte do MODO.** `CurvaPropria.curva` são **sete** bytes
(`CURVA_BYTES = 7`, `curva_propria.py:57`) — a largura do campo `forces` do
report de saída, **fato do protocolo, medido**. Mas o modo *Montar do zero*
manda **modo + sete forças**: `TriggerParamSpec("mode", "Modo (byte cru)")`
seguido de `force_0..force_6` (`trigger_specs.py:249-263`, oito parâmetros).
Sem o byte de modo, **a curva guardada não se toca de volta**.
Custo de acrescentar: **zero hoje**, e o próprio módulo explica por quê
(`curva_propria.py:33-35`): *"não existe nenhuma curva própria no repositório,
então não há nada para migrar. Em seis meses existiria."*

**3 · Três campos são obrigatórios por construção** — `medido_por`, `controle` e
`nota` (mais `medido_em`), sem default nenhum, e a `nota` tem piso de **20
caracteres** (`NOTA_MINIMA_DE_CARACTERES`, `:78`). Sem eles **não instancia**.
Isso é a regra R3 virada propriedade do formato, e não se afrouxa — mas alguém
tem de decidir **quem preenche o quê** na hora do "Guardar esse efeito".

## O que entrega

1. **`profiles/catalogo_de_curvas.py`** — carrega e grava o catálogo do disco
   **dela**, com `xdg_paths.curvas_dir()` novo ao lado de `profiles_dir()`.
   Arquivo ausente é catálogo vazio, e não erro: mesa nova é estado legítimo.
2. **A lista de "Meus efeitos" chega ao `select.pronto`**, no separador que a
   página já desenha. Zero curvas → o separador e as entradas **somem**, e não
   ficam como um cabeçalho vazio.
3. **"Guardar esse efeito" grava.** É o **único** botão que sobrou na aba, um por
   coluna (`aba03.py:274`), e ele guarda **o par L2+R2 daquela coluna** — a
   legenda diz isso (`:323`). O diálogo pede o nome e a proveniência; o
   `controle` vem pré-preenchido do chip da coluna (modelo + transporte), que é
   exatamente o que o campo pede.
4. **O byte do modo entra no formato**, com a nota de fronteira R4 que o módulo
   já usa: sete bytes é fato do protocolo; o oitavo é o **modo**, que é outra
   coisa e por isso é campo próprio, não um bytezinho a mais na curva.
5. **Escolher um "meu efeito" aplica.** O que ele faz com o **modo** da coluna
   depende da resposta dela na sprint **09** — leitura (a) troca o modo,
   leitura (b) não. As duas cabem; a sprint escreve a (a) como
   `PROVISÓRIO — decisão dela`, porque é a que o desenho mostra.

## Como se prova (a mordida)

`tests/unit/test_migra_gatilhos_meus_efeitos_ganham_tela.py`:

1. **`src/` importa `curva_propria`.** Esta é a mordida do defeito-mãe, e ela é
   estrutural: `test_nenhuma_lapide_sobreviveu_a_propria_cura` reprova enquanto
   as duas lápides estiverem no portão com a corrente fechada. Desfaça a
   ligação e o portão volta a acusar as duas.
2. **Ida e volta pelo disco.** Gravar uma curva, reler o catálogo, e os **oito**
   bytes voltam iguais — os sete de força **e o modo**. Tire o campo de modo e o
   teste reprova mostrando a curva que não se toca de volta.
3. **Proveniência incompleta RECUSA, com a razão certa.** Nota de 19 caracteres
   → recusa citando o piso; `medido_por=None` → a mensagem do `_recusa_nao_texto`
   (`:118-125`), não o erro genérico do pydantic. Afrouxe um campo e reprova.
4. **Nome repetido recusa** — o `_sem_nome_repetido` do catálogo (`:267`) já o
   faz; a régua o cobra **pela tela**: tentar salvar com um nome que já existe
   produz uma frase, e não um catálogo corrompido nem um `except` mudo.
5. **Zero curvas não desenha cabeçalho vazio** — o separador
   `──── Meus efeitos ────` **não** está no HTML quando o catálogo está vazio.
6. **Catálogo ausente é catálogo vazio** — arquivo inexistente, aba abre, zero
   exceções.
7. **Nenhum nome do DSX** — `_nomes_do_dsx()` (`:85-94`) já recusa os doze nomes
   enlatados, lendo a fonte única `DSX_CANNED_TRIGGER_MODES`. A régua confirma
   que o caminho da tela passa por essa validação, e não por uma cópia.

## O que é dela decidir

1. **Quem é o `medido_por`, e o diálogo lembra?** É ela, na bancada dela — mas o
   campo é do formato, não da pessoa. Digitar o próprio nome toda vez é atrito;
   lembrar o último é uma linha de config.
2. **Onde mora o catálogo dela.** `curvas_dir()` sob `XDG_DATA_HOME` é o
   provisório (é onde os perfis moram). Se ela quiser as curvas **dentro** do
   perfil, o formato muda e o argumento contra está escrito em
   `curva_propria.py:27-31`: *"dois perfis com o mesmo nome e proveniências
   diferentes é exatamente a divergência que o processo quer impedir."*
3. **A `nota` de 20 caracteres.** O piso é *"escolha de julgamento, não uma
   medição"* (`:74-78`). Se ele atrapalhar na hora de salvar, é dela baixá-lo —
   mas baixá-lo até "ok" caber devolve o buraco que ele fecha.
4. **A bancada.** Esta sprint é `bancada: true` porque a prova final é ela
   sentar com o controle, montar uma curva, senti-la, salvá-la com nome, fechar
   a janela, abrir de novo e **encontrá-la lá**. Sem isso, o que existe é código
   que passa em teste — que é exatamente o estado em que este módulo está desde
   julho.
