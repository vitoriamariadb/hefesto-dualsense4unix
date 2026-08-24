# O arquivo — o que ninguém mais alcança por navegação

Nasceu em 24/08/2026, por decisão dela, depois que a auditoria do processo
mediu que `docs/process` tinha **445 arquivos e 9,3 MB** e que boa parte deles
não era alcançável a partir de nenhum ponteiro vivo.

**Mover não é apagar.** A regra da casa — *"não se apaga decisão medida"* —
continua de pé: tudo que está aqui continua no git, com o histórico inteiro, e
continua legível. O que muda é só uma coisa: **não está mais na árvore que quem
chega varre**. O custo que isso ataca é o que ela nomeou em 21/08/2026: *"que o
dev não morra no caminho ou que a IA não chegue a um milhão de tokens só de ler
um único script ou documento."*

## O critério, e por que não é "idade"

Um arquivo vem para cá quando **nenhum outro documento o alcança** — nem pelo
nome do arquivo, nem pelo id da sprint (`NUM-01`, `MONITOR-QUE-VENCE-01`). Não
é "velho", não é "ninguém abriu": é **órfão de navegação**.

A diferença importa, e custou uma medição errada para ficar clara. A primeira
régua desta leva contou *"arquivos que nenhum agente abriu em 23-24/08"* e
chegou a **269 arquivos, ~1,39 milhão de tokens**. A segunda, que pergunta quem
aponta para quem, chegou a **69 arquivos, 1,29 MB, ~337 mil tokens** — quatro
vezes menos. A primeira teria movido 195 documentos que estão vivos e
alcançáveis; um documento pode ser essencial e simplesmente não ter sido
preciso em dois dias.

E mesmo a régua boa teve falso positivo: buscar só pelo **nome do arquivo**
marcou como órfãs a `NUM-01` (citada por quatro documentos, pelo id) e os
relatórios de 24/08 (citados pelo `agentes/README.md`, pelo nome da frente).
Régua que não conhece o id da sprint mente. Se for medir de novo, meça pelos
dois.

## O que NÃO vem para cá

- **Estudo e sprint** — são medição, e medição é decisão medida. Ficam onde
  estão mesmo quando ninguém aponta para elas; o conserto certo ali é o
  ponteiro que falta, não a mudança de pasta.
- **Relatório de agente recente** — o de hoje é o registro do que acabou de
  acontecer, e é justamente o que um `/clear` precisa achar.
- **Qualquer coisa que um portão leia.**

O primeiro lote, e o único até aqui: `agentes-2026-08-06/`, 57 relatórios de
agente da leva de 06/08/2026 — subproduto de execução, órfão havia 18 dias.

## A isenção que veio junto

`scripts/validar-referencias-docs.py` ignora `docs/process/arquivo/` pelo mesmo
motivo que já ignorava `docs/process/agentes/`: é saída bruta, e um relatório
cita o caminho que existia **no instante da medição**. Corrigir esses caminhos
falsificaria o registro. O que continua valendo aqui é segurança —
`tests/unit/test_saida_de_agente_sanitizada.py` varre MAC e segredo, e não
conhece isenção.
