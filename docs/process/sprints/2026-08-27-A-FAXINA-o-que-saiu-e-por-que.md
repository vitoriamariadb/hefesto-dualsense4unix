# A FAXINA — o que saiu, e por quê

**27/08/2026.** As sprints que o redesenho das dez abas substituiu saem do
disco. Este arquivo é o mapa para achá-las de volta.

**A decisão é dela.** Perguntada se apagava ou marcava DESATIVADA, respondeu
**"Apagar"**. Isso **substitui** a `D-AS-SPRINTS-VELHAS-SAO-DESATIVADAS-NAO-APAGADAS`
(`docs/data/decisoes-dela.csv:58`, de 26/08), que mandava o contrário — a fala
mais recente vence, e o git guarda o histórico. Ela também fixou a ordem: **as
sprints novas nascem ANTES**, e as 92 de `2026-08-27-ONDA-*` já estão no disco.

**Como achar de volta:**

```bash
git log --diff-filter=D --oneline -- docs/process/sprints/   # o commit que apagou
git show <commit>^:docs/process/sprints/<arquivo>            # o texto inteiro
```

---

## As 28 que saíram

| Sprint apagada | O que ela pedia | Quem tomou o lugar |
|---|---|---|
| `2026-07-25-LEGIBILIDADE-01-texto-legivel-alvo-clicavel.md` | Tipografia e realocação da janela antiga — inclusive "os analógicos no Status ao lado do microfone e lightbar". A fonte +3 fechou em 07/08 | `ONDA-CONTROLES-01..09` (mockup `layout/02-controles.html`) |
| `2026-07-25-PLAYER-01-um-numero-de-jogador.md` | O olho dela sobre o seletor "Número deste controle", que existe e é editável desde `14cd31b` | `ONDA-ILUMINACAO-03` — a escolha do número desce do cabeçalho (`D-A-ESCOLHA-DO-PLAYER-MORA-NA-LIGHTBAR`) |
| `2026-07-27-LIGHTBAR-JOGADOR-01-a-cor-e-consequencia-do-jogador.md` | E0–E4: a cor ser consequência do número do jogador. Queixa dela citada: "área de desenho das 5 luzes é meio nonsense" | `ONDA-ILUMINACAO-01` (o desenho sai das cinco caixas) e `ONDA-ILUMINACAO-03` |
| `2026-07-29-LARGURA-01-a-mesma-largura-em-todas-as-abas.md` | E5–E8: largura de linha nas abas do layout antigo (E1–E4 e E9 entregues) | `ONDA-JOGAR-09` e `ONDA-CONEXOES-01` — o mockup é a especificação de largura |
| `2026-07-31-CARD-OCUPA-01-o-desenho-ocupa-o-vao-que-o-teto-devolveu.md` | Layout do card da aba Estado: touchpad, lightbar, microfone e alto-falante ocupando o vão lateral | `ONDA-CONTROLES-01..09` — o card renasce inteiro no mockup |
| `2026-08-01-JANELA-QUE-RESPIRA-01-os-consertos-de-largura-que-a-casa-ja-tinha-decidido.md` | `homogeneous=True`, teto de largura e comprimento de linha nas NOVE abas antigas | o redesenho das dez abas (`ONDA-CONTROLES`, `ONDA-VIBRACAO`, `ONDA-NAVEGACAO`, `ONDA-CONEXOES`, `ONDA-SISTEMA`) |
| `2026-08-13-MESA-CHEIA-01-a-fita-do-alvo-ganha-a-cor-de-cada-um.md` | PLANO, zero código: a linguagem de cor nos chips das onze abas | `ONDA-CONTROLES-03`, pelo padrão P2 `D-A-BORDA-E-A-IDENTIDADE-DA-PECA` |
| `2026-08-13-MESA-CHEIA-02-a-marca-de-quem-escolheu-na-aba-gatilhos.md` | PLANO: pôr a marca de quem escolheu DENTRO da aba Gatilhos | `ONDA-GATILHOS-01`. O redesenho decidiu o contrário: "nenhum seletor de peça nasce dentro da aba" (`D-A-FITA-E-O-UNICO-ALVO`) |
| `2026-08-13-MESA-CHEIA-03-a-mesma-marca-na-aba-lightbar.md` | PLANO: a marca nos seis presets da Lightbar | `ONDA-ILUMINACAO-01..10` — os seis presets e as duas metades saem |
| `2026-08-13-MESA-CHEIA-04-a-marca-vira-gesto.md` | PLANO: faixa de quatro jogadores na aba Gatilhos, clicar troca o alvo | `ONDA-CONTROLES-03`. O padrão P1 decidiu o contrário: quem escolhe é a fita e o clique no card |
| `2026-08-13-MESA-CHEIA-05-o-rumble-por-mac-a-rota-que-ninguem-ligou.md` | PLANO: a força de vibração com endereço. A E0 (`uniq_do_alvo_de_output`) já está no código | `ONDA-VIBRACAO-04` (a força ganha endereço), com `ONDA-VIBRACAO-03` antes |
| `2026-08-13-MESA-CHEIA-06-o-portao-contra-a-marca-que-mente.md` | PLANO: portão contra a marca no formato antigo — travaria o novo | `ONDA-CONTROLES-03` e `ONDA-CONEXOES-08` |
| `2026-08-13-MESA-CHEIA-07-a-decima-aba-que-ninguem-mediu.md` | PLANO: a aba "No jogo". O redesenho a mata — vira faixa dentro do card de cada controle | `ONDA-CONTROLES-01` — "a faixa que a Steam guardava" |
| `2026-08-13-MESA-CHEIA-10-a-fita-que-nao-sabe-em-que-aba-esta.md` | PLANO: a fita que mente em seis abas porque não sabe onde está | `ONDA-CONTROLES-03` e `ONDA-ILUMINACAO-03`, pelo padrão P1 (a fita esmaece com "não se aplica") |
| `2026-08-15-ONDE-A-COR-MORA-01-a-borda-diz-quem-e-e-o-anel-diz-o-que-esta-escolhido.md` | Proposta para o olho dela: borda + anel. Ela decidiu — a proposta virou o padrão P2 | `ONDA-CONTROLES-03`, `ONDA-ILUMINACAO-08`, `ONDA-CONEXOES-08` |
| `2026-08-15-UNIDADE-COR-01-o-controle-sabe-de-que-cor-ele-e.md` | Que o produto soubesse a cor do plástico. Virou código (`integrations/cor_do_plastico.py`) e virou o padrão P2; a recusa do firmware no rádio está em `docs/data/mapa-controles.csv:111` | `ONDA-ILUMINACAO-08` (a cor do plástico chega à aba), `ONDA-CONTROLES-03`, `ONDA-CONEXOES-08`, `ONDA-JOGAR-07` |
| `2026-08-22-CENTRAL-SEM-TELA-01-o-censo-e-o-apelido-nasceram-sem-porta.md` | E2 e E4 (E1/E3 fecharam em `49797f8`): ver o barramento, renomear o dongle, mover um controle de adaptador | `ONDA-CONEXOES-02`, `ONDA-CONEXOES-03`, `ONDA-CONEXOES-04` |
| `2026-08-22-VPAD-SUSPENSO-MORTO-01-metade-da-cura-esta-ligada.md` | E2 (E1/E3 fechadas): escolha dela entre três saídas no texto das abas Início e Emulação | `ONDA-JOGAR-01` e `ONDA-SISTEMA-03`, que herdam o texto das duas abas |
| `2026-08-24-CONEXOES-MAPA-2D-01-o-gabinete-que-o-produto-nao-enxerga.md` | O mapa 2D do gabinete. O código já está na árvore (`app/widgets/mapa_da_mesa.py`, `0b815161` e `b87696bd`) | `ONDA-CONEXOES-02`, `ONDA-CONEXOES-04`, `ONDA-CONEXOES-10` |
| `2026-08-24-CONFIGURACOES-O-LEXICO-01-a-aba-que-fala-barramento-com-quem-ve-gabinete.md` | O léxico da aba Configurações — 88 textos fixos. A aba virou Conexões; o léxico virou o padrão P3 (tudo que explica vira dica) | a onda CONEXÕES inteira (`ONDA-CONEXOES-01` a `-10`) |
| `2026-08-24-GATILHOS-APLICADO-COM-PROVA-01-....md` | Onda de aba Gatilhos da fila de 24/08 (tira de ONZE abas). Central: a tela diz "aplicado" sem prova | `ONDA-GATILHOS-01`, `-03` (o recibo distingue aplicado / guardado / nada aconteceu pelo CORPO) e `-04` |
| `2026-08-24-INICIO-NAO-MENTE-01-a-ponte-que-nao-acende-e-a-escolha-que-ela-nao-fez.md` | Onda de aba Início: a ponte que não acende, a máscara, a pausa, o rodapé que joga fora a recusa do daemon | a onda JOGAR inteira — `ONDA-JOGAR-01`, `-03`, `-04`, `-06`, `-08`, `-10` |
| `2026-08-24-LIGHTBAR-COR-DE-CADA-UM-01-a-aba-mais-vazia-e-o-aceso-agora-que-nao-volta.md` | Onda 7 da leva das onze abas, para a aba Lightbar, que deixou de existir | `ONDA-ILUMINACAO-06` (o automático), `-09` (de onde veio esta cor), `-07` (duas peças nunca têm a mesma cor), `-04` e `-10` |
| `2026-08-24-NAVEGACAO-UM-CONTROLE-SO-01-o-teclado-que-jura-despachar-e-os-atalhos-que-somem.md` | Onda 10 de 12: gestos, mapa do mouse, a área que ensina, e os três atalhos do touchpad que somem da lista. Só a E2 foi merjada | `ONDA-NAVEGACAO-01` a `-09` — os atalhos do touchpad são a linha "Guardados, sem linha na lista" da `-09` |
| `2026-08-24-PERFIS-ABRE-O-QUE-GUARDA-01-....md` | Onda de aba Perfis da fila de 24/08, dez tarefas (P0a–P9) sobre a tela antiga | `ONDA-PERFIS-01` a `-09` (mockup `novo-layout/09-perfis.html`) |
| `2026-08-24-PORTAS-DA-CASA-01-o-produto-sabe-onde-cada-radio-mora-e-nao-diz.md` | O eixo USB da aba Configurações. O mecanismo já existe (`integrations/arranjo_da_mesa.py:877` e `:1063`); faltava a tela | `ONDA-CONEXOES-01` a `-10`, com os botões nomeados no contrato |
| `2026-08-24-RUMBLE-POR-JOGADOR-01-grava-na-peca-e-manda-na-mesa.md` | Onda de aba Rumble: gravar na peça e mandar na mesa, o "Auto", o 7º applier, a trava manual | a onda VIBRAÇÃO inteira (`ONDA-VIBRACAO-01` a `-06`) |
| `2026-08-25-CALIBRAR-AS-ENTRADAS-01-a-entrada-vazia-que-so-a-mao-dela-ensina.md` | Ensinar as entradas do gabinete. O código nasceu (`app/widgets/calibrar_entradas.py`, `integrations/entradas_do_gabinete.py`, cinco testes) | `ONDA-CONEXOES-02` (que já trata "Ensinar as minhas entradas" como botão que abre) e `ONDA-CONEXOES-10` |

---

## As TRÊS que o censo marcou APAGAR e **não** foram apagadas

O teste desta casa é o da regra de 11/08: *se apagar isto faria alguém repetir um
trabalho ou pagar um custo já pago?* Nestas três, sim.

### 1. `2026-07-25-CR-03-bancada-de-medicao.md`

> **NOTA DATADA — 29/08/2026: esta retenção CADUCOU, e com ela a corrente
> inteira.** Ela mandou cortar: **CR-03, CR-04 e CR-06 saíram do disco**
> (`D-A-CORRENTE-DO-CLEAN-ROOM-SAI`, `docs/data/decisoes-dela.csv`). A ordem de
> 26/08 citada no primeiro bullet (*"Preservadas por ordem dela … CR-03/04/06"*)
> foi **substituída** pela fala de 29/08 — a mais recente vence, e o git guarda
> o histórico, que é a mesma regra que este manifesto aplicou em 27/08.
>
> **A razão dela:** as três só faziam sentido juntas — sem a bancada de medir
> (CR-03) não há efeitos da casa (CR-04), e sem eles não há o que devolver ao
> ecossistema (CR-06). O Hefesto passa a viver com o catálogo de efeitos que já
> tem. O terceiro bullet abaixo continua verdadeiro e virou o **preço**: os sete
> parâmetros ao vivo, o A/B e a leitura de L2/R2 na mesma tela ficam sem dono.
>
> **Os três bullets abaixo ficam como estão** — são o registro do que foi
> decidido em 27/08. Para onde foram as três, veja
> [o manifesto do corte](2026-08-29-O-CORTE-DO-CLEAN-ROOM-o-que-saiu-e-por-que.md).
> As outras duas retidas desta seção **continuam retidas**; nada aqui as toca.

- **Ela mandou preservar, por escrito.** `docs/process/2026-08-26-CENSO-as-sprints-que-os-desenhos-substituem.md:79`:
  *"Preservadas por ordem dela (specs e bancada) — nenhuma tocada: … CR-03/04/06 …"*.
- **É elo de uma corrente que fica.** `CR-04` diz *"Depende de: CR-03"* (`:4`);
  `docs/process/CLEAN-ROOM.md:84-85` e `SPRINT_ORDER.md:583` fixam a ordem
  `CR-03 → CR-04 → CR-06`, declarada **fora da 0.9.5** pela D-J. Apagar o meio
  quebra as duas pontas.
- **A `ONDA-GATILHOS-05` entrega parte, não o todo.** Ela dá o catálogo em disco
  e o "Guardar esse efeito" com proveniência. A CR-03 pede mais: os sete
  parâmetros ao vivo sem passo de "aplicar", a leitura de L2/R2 **na mesma
  tela**, comparar A/B, e ceder o hidraw de volta ao daemon ao sair. Nada disso
  tem dono nas 92 sprints novas.

### 2. `2026-08-24-SISTEMA-O-VIGIA-VIVO-01-a-rede-de-seguranca-parada-e-o-conserto-que-nao-conserta.md`

Das quinze tarefas, **seis são `[SEM TELA]`** — não tocam a interface, logo o
redesenho da interface não pode substituí-las. Duas sem dono novo:

- **T-01** — `install.sh:3504` usa `enable --now`, que não re-arma um timer
  parado; a cura é `enable` + `restart`.
- **T-02** — `disable_steam_input.sh` e `fix_wireplumber_default_source.sh` não
  viajam em **cinco dos seis formatos de pacote**, e `scripts/check_packaging_parity.sh:8`
  ignora `scripts/` em bloco — o portão sai **verde** sobre o buraco.

O `ONDA-SISTEMA-INDICE` faz o censo pela **tabela de botões do contrato**, e a
`ONDA-SISTEMA-06` (`posse:`) não reivindica `install.sh`, `packaging/` nem o
portão de paridade. O que ela absorve — `curar_o_que_e_automatico` e
`steam_root_ou_recusa` sem chamador — é a T-10, não estas.

### 3. `2026-08-24-CONFIGURACOES-FECHA-01-o-aplicar-que-nao-responde-e-o-campo-que-apaga-o-arquivo.md`

**Dez tarefas `[SEM TELA]`.** A `ONDA-CONEXOES-09` absorve o `maquina.json` que
nunca nasceu no disco, e a seção "A janela" sai com a aba. Ficam sem dono:

- **T5/T6/T7** — as constantes do rádio declararem de qual célula do CSV vieram,
  e os números caducos saírem de **todos** os lugares (é a regra de 11/08
  aplicada, não layout);
- **T10/T11** — o censo das curas arrancáveis com régua declarada, e o portão
  *"existe chamador de PRODUÇÃO?"*.

Além disso, é citada por `CHANGELOG.md` e por `docs/usage/interface.md` — não é
só documento de processo.

**A saída barata:** se ela quiser as três fora da fila mesmo assim, o caminho é
mover o que sobrou para as sprints novas (ou para uma sprint de dívida) **antes**
de apagar, não junto.
