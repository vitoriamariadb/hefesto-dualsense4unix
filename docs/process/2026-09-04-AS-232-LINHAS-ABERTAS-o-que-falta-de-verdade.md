# As linhas abertas, triadas uma a uma — e o que "100%" custa

> **ESTE ARQUIVO NASCEU COM 232 NO NOME, E O NÚMERO JÁ MUDOU DUAS VEZES.**
> O nome do arquivo fica — meia dúzia de documentos apontam para ele. O número
> vivo está na §1, remedido em 04/09/2026 à tarde, e **o comando que o produz
> está ao lado dele.** Quem quiser o de hoje roda o comando; quem citar o do
> título está citando 03/09.

**04/09/2026.** Ela perguntou, com estas palavras: *"ok e agora? o que resta?
concluímos o produto? O install está pronto?"*, e depois: *"conclui as
pendências todas. pode fazer isso agora? pra termos os 100%?"*

A resposta honesta exige separar duas coisas que o número total mistura. Este
documento faz essa separação, **linha por linha**, lendo a coluna `porque` de
`docs/data/paridade-gtk-html.csv` — que é onde as levas anteriores deixaram a
medição de cada uma.

---

## 1. O NÚMERO, e por que ele encolhe assim que se olha

```
$ .venv/bin/python scripts/check_paridade_gtk_html.py
OK: 396 features conferidas contra o código — 107 IGUAL · 125 DIFERENTE ·
    101 FALTA_NO_HTML · 59 SO_NO_HTML · 4 NAO_DA_PARA_SABER (27% de paridade).
```

A régua de paridade tem **396 features** medidas entre a janela GTK e a
interface nova. Delas, **170 já fecharam** (107 `IGUAL` + 59 `SO_NO_HTML` + 4
`NAO_DA_PARA_SABER`), e **226 estão abertas** — 125 `DIFERENTE` e 101
`FALTA_NO_HTML`.

**Eram 232 quando esta triagem foi escrita, de manhã** (`f941a751`), e a
diferença não é ruído: **sete linhas fecharam e uma abriu.** As sete estão
nomeadas na §9.1; a que abriu é a queixa dela *"escolha do jogador no
iluminação não funciona"*, que virou linha em vez de sumir.

Triadas uma a uma:

| balde | quantas | o que é |
| --- | ---: | --- |
| **DELA** | **40** | a diferença existe porque ela decidiu assim. Não é dívida. |
| **MELHOR** | **15** | a interface nova faz mais, ou faz certo onde a GTK erra. Não é dívida. |
| **PUBLICAR** | **0** | **o balde MORREU** — as treze páginas foram publicadas na madrugada de 04/09. Medido, não lido: §9.2. |
| **LIGAR** | **38** | o dado JÁ existe nos dois lados; falta alguém ler e a página ter endereço. Trabalho mecânico, sem decisão. |
| **DESENHO** | **72** | falta lugar na tela ou palavra nova. **DECIDIDAS em 04/09** — deixaram de esperar por ela; ver §6. |
| **MOTOR** | **58** | falta código de verdade — escrita que não existe, campo inalcançável, botão morto. |
| **REMEDIR** | **3** | **balde novo.** A evidência escrita na linha CAIU, e o portão não pode enxergar isso — §9.3. |

**55 das 226 não são dívida nenhuma** (as 40 DELA mais as 15 MELHOR). São
escolhas dela e ganhos da interface nova, registrados como `DIFERENTE` porque a
régua compara COMPORTAMENTO e se recusa a chamar de igual o que não mediu igual
— que é o que a impede de virar maquiagem.

**Então a fila real é 171**, e ela tem uma forma muito clara:

```
   0  PUBLICAR   ← morreu: publicado na madrugada de 04/09
  38  LIGAR      ← só trabalho meu, nenhuma decisão pendente
  72  DESENHO    ← DECIDIDAS em 04/09. Deixaram de esperar por ela.
  58  MOTOR      ← código novo
   3  REMEDIR    ← a linha afirma uma medição que caiu
```

**NENHUMA DAS 171 ESPERA POR ELA.** Era esse o bloqueio — 74 linhas paradas na
palavra dela, 41% da fila — e ele caiu em 04/09, quando as 54 perguntas das dez
abas foram decididas em
[O PO DECIDE AS 54](2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md). O que
continua sendo dela é a **validação final**, que é a última e não a primeira
(`SPRINT_ORDER.md` §0, FASE 5: *"Ao final eu faria apertando os botões."*).

---

## 2. POR ABA — onde o trabalho está concentrado

Remedido em 04/09/2026 à tarde, com o CSV desta árvore:

| aba | abertas | DELA | MELHOR | LIGAR | DESENHO | MOTOR | REMEDIR |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 01-jogar | 29 | 4 | 1 | **18** | 5 | 1 | — |
| 02-controles | 34 | 2 | 1 | 4 | **20** | 7 | — |
| 03-gatilhos | 10 | 2 | 1 | 2 | 4 | 1 | — |
| 04-iluminacao | 21 | 5 | 2 | — | 6 | 6 | 2 |
| 05-vibracao | 18 | 4 | — | — | 8 | 6 | — |
| 06-navegacao | 19 | 6 | 1 | — | 6 | 6 | — |
| 07-lancadores | 12 | — | 2 | — | 2 | **8** | — |
| 08-conexoes | 34 | 6 | 2 | 11 | 11 | 3 | 1 |
| 09-sistema | 21 | 6 | 2 | 3 | 2 | 8 | — |
| 10-perfis | 28 | 5 | 3 | — | 8 | **12** | — |
| **TODAS** | **226** | **40** | **15** | **38** | **72** | **58** | **3** |

Três leituras que a tabela dá de graça:

1. **A 01-jogar é quase toda `LIGAR`** (18 de 29). O daemon já publica o que
   falta na tela — o aviso de máscara divergente, o banner do vpad degradado, os
   cards dos controles externos, o recibo do Reconectar. É a aba com a melhor
   razão entre trabalho e ganho de todo o inventário.
2. **A 02-controles é quase toda `DESENHO`** (20 de 34) — e por isso era a aba
   mais parada. **Deixou de ser:** as dez perguntas dela foram decididas em
   04/09, e as vinte linhas hoje esperam trabalho, não palavra.
3. **A 10-perfis e a 07-lancadores são `MOTOR`** (12 e 8). São as duas em que
   falta código de verdade, não pintura.

**E a 08-conexoes encolheu mais que qualquer outra aba** — de 40 abertas para
34, e **cinco das seis** que fecharam vinham do balde `LIGAR` dela. É o balde
`LIGAR` fazendo o que a §4 prometia: o dado já existia, e ligá-lo custou uma
leva só.

---

## 3. OS SEIS DEFEITOS QUE EU LEVARIA PRIMEIRO

Não são os mais numerosos — são os que **perdem trabalho dela em silêncio**,
que é a família de defeito que esta casa persegue acima de todas.

| # | onde | o que acontece |
| --- | --- | --- |
| 1 | `06-navegacao` | **Os atalhos escritos à mão param de valer, calados.** `resolver()` parte do de fábrica e aplica só `button_actions`; `profile.key_bindings` nunca é consultado, e `apply_button_actions` roda depois de `apply_keyboard` reescrevendo o conjunto inteiro. Um perfil com `button_actions` preenchido apaga o teclado dela na próxima ativação. |
| 2 | `06-navegacao` | **"Voltar ao padrão" apaga mais do que promete** — zera `key_bindings` inteiro, incluindo o que ela escreveu na janela antiga, e a confirmação nem usa a palavra "atalhos". |
| 3 | `05-vibracao` | **O "Salvar Perfil" não grava a força escolhida.** Ela clica "Máximo", vai ao rodapé, salva: grava a política que já estava no disco. É o mesmo defeito que o `_draft_do_ativo` curou na COR e que continua vivo na vibração — e o docstring afirma o contrário do que o corpo faz. |
| 4 | `05-vibracao` | **Um "Aplicar" do rodapé re-trava a vibração** que o "Parar" da coluna acabou de soltar, porque o `to_ipc_dict` emite a seção `rumble` sempre e aqui não há a escrita compensatória. |
| 5 | `08-conexoes` | **O campo de nome do adaptador promete e não guarda.** `apelido_do_dongle` não tem chamador na interface nova; o único vestígio clica um `data-g` que a página publicada não tem. Ela vai digitar e perder. |
| 6 | `10-perfis` | **A seção `mode` do perfil é inalcançável.** Um perfil criado pelo HTML não pode dizer "quando eu entrar, ligue o modo jogo com máscara DualSense". O valor do disco sobrevive só por herança — ninguém escreve nele. É a maior ausência isolada do inventário. |

---

## 4. O QUE FECHA SEM PERGUNTAR NADA A ELA — as 38 do balde `LIGAR`

Estas não precisam de desenho, de texto novo nem de decisão. O dado existe, o
dono existe, e falta o par *ler + endereço na página*. **Dezoito são da
01-jogar e 11 da 08-conexoes** — as duas abas fecham quase inteiras nesse
único movimento.

**Eram 43 de manhã. Cinco fecharam na leva da madrugada, e as cinco são
da 08-conexoes** — a prova de que este balde é o que ele diz ser: dado que já
existia, ligado sem uma decisão. Ficam riscadas na lista, não apagadas, porque
apagar uma linha fechada esconde quanto o balde entregou.

| aba | feature | estado |
| --- | --- | --- |
| `01-jogar` | A caixa da máscara só aparece quando faz sentido | aberta |
| `01-jogar` | A frase da PAUSA no lugar da promessa do modo | aberta |
| `01-jogar` | O aviso 'entrei em Navegação e o mouse/teclado está desligado' | aberta |
| `01-jogar` | A frase que conta os jogadores e separa adotado de externo | aberta |
| `01-jogar` | Cards dos controles EXTERNOS (Nintendo Pro, 8BitDo…) | aberta |
| `01-jogar` | Aviso de grab dobrado no card ('o jogo pode receber cada botão duas vezes') | aberta |
| `01-jogar` | O marcador 'primário' no card do controle principal | aberta |
| `01-jogar` | A palavra do transporte no cartão | aberta |
| `01-jogar` | O recibo do 'Reconectar' — quantos jogadores voltaram, se a numeração compactou | aberta |
| `01-jogar` | A dica do 'Reconectar' quando há jogo aberto | aberta |
| `01-jogar` | O aviso de divergência de máscara (a escolha dela não chegou ao aparelho) | aberta |
| `01-jogar` | A faixa laranja do que ela pediu e ainda não valeu | aberta |
| `01-jogar` | Banner de degradação do vpad (a máscara DualSense caiu para uinput) | aberta |
| `01-jogar` | Banner 'jogo aberto SEM o wrapper' | aberta |
| `01-jogar` | Banner 'a emulação está desligada por uma escolha ANTIGA sua' | aberta |
| `01-jogar` | A linha de origem — 'Nativo/Gamepad ligado pelo perfil ativo' | aberta |
| `01-jogar` | A coluna 'Atenção' — quais avisos aparecem | aberta |
| `01-jogar` | O que a aba faz quando o daemon está DESLIGADO | aberta |
| `02-controles` | Dica do título — qual gamepad virtual este controle alimenta | aberta |
| `02-controles` | Linha do giroscópio espelhado — "fluindo para o jogo (~N Hz)" | aberta |
| `02-controles` | Alto-falante — o selo "Saída muda" (a camada 1 do PipeWire) | aberta |
| `02-controles` | Alto-falante — "acordado / dormindo" no título da moldura | aberta |
| `03-gatilhos` | Dica (tooltip) por modo, com a descrição do que ele faz | aberta |
| `03-gatilhos` | Gravar a configuração do gatilho no perfil, por controle | aberta |
| `08-conexoes` | Exame da mesa — quantas conferências rodam, e quando | aberta |
| `08-conexoes` | Ambiguidade fina das ordens (quem é quem no barramento) | aberta |
| `08-conexoes` | ~~Tabela de adaptadores Bluetooth (Nome · Adaptador · Onde está)~~ | **FECHOU em 04/09** — hoje `IGUAL` |
| `08-conexoes` | O hub em comum acima de todos os adaptadores | aberta |
| `08-conexoes` | As contagens do gabinete (o que o firmware diz × o que o kernel conta) | aberta |
| `08-conexoes` | Medidor de rádio / Desempenho (turnos por adaptador) | aberta |
| `08-conexoes` | ~~Rádios vizinhos — a coluna "Onde" e o aviso de vizinhança~~ | **FECHOU em 04/09** — hoje `IGUAL` |
| `08-conexoes` | Alvo de saída — LER DE VOLTA qual é o alvo agora | aberta |
| `08-conexoes` | ~~Microfone — quanto ele custa de rádio (a frase da capacidade)~~ | **FECHOU em 04/09** — hoje `IGUAL` |
| `08-conexoes` | "A luz não acende" — a RAZÃO de a cura ser oferecida | aberta |
| `08-conexoes` | ~~Aviso da mesa suja (outro programa segurando o nó do controle)~~ | **FECHOU em 04/09** — hoje `IGUAL` |
| `08-conexoes` | Contagem da seção Gestão de Controles ("N na mesa · X no cabo · Y no rádio") | aberta |
| `08-conexoes` | Controles EXTERNOS (8BitDo, Pro Controller, Xbox) na lista da mesa | aberta |
| `08-conexoes` | Aviso "controle ligado que o sistema não entregou ao Hefesto" | aberta |
| `08-conexoes` | Aviso do Bluetooth nativo frágil | aberta |
| `08-conexoes` | ~~Ocupação de rádio por adaptador (quem está em qual dongle)~~ | **FECHOU em 04/09** — hoje `IGUAL` |
| `09-sistema` | Estado do serviço — "O Hefesto está" / "O serviço está" | aberta |
| `09-sistema` | Perfil de Bateria — a tabela de consequências (o que cada perfil faz com cada coisa) | aberta |
| `09-sistema` | Perfil de Bateria — a conta de slots por adaptador de rádio | aberta |

---

## 5. O BALDE `PUBLICAR` ESTÁ VAZIO — e as seis não esperam mais nada dela

Esta seção dizia que seis linhas estavam prontas no `mockup/` e paravam no
`scripts/check_o_desenho_aprovado.py --publicar`, e que **uma palavra dela
fechava as seis**. **Não é mais verdade.** As treze páginas foram publicadas na
madrugada de 04/09, e as duas medições são estas:

```
$ .venv/bin/python scripts/check_o_desenho_aprovado.py
desenho: 13 página(s) na bancada `mockup/`
  o produto já tem ..... 13
  o produto está atrás . 0  (0 em trabalho)

$ for f in mockup/*.html; do cmp -s "$f" "src/.../interface/paginas/$(basename $f)" \
    || echo "DIFEREM: $f"; done
   (13 páginas comparadas, 0 diferentes)
```

E o `mockup/DIVERGENCIAS.md`, que é quem declara aba em trabalho, diz
`<!-- Nenhuma aba em trabalho: o produto está igual ao desenho dela. -->`.

**Onde as seis foram parar:**

| aba | feature | para onde foi |
| --- | --- | --- |
| `04-iluminacao` | Escolher uma cor livre (paleta do sistema) | **`REMEDIR`** — a evidência caiu (§9.3) |
| `04-iluminacao` | Marca de qual cor está escolhida agora | **`REMEDIR`** — a evidência caiu (§9.3) |
| `04-iluminacao` | Prévia da cor com o brilho aplicado | **`DELA`** — a prévia apaga nos quatro estados com ressalva, que é a regra dela |
| `05-vibracao` | Deslizador de intensidade livre (política "custom", `rumble.policy_custom`) | **`DELA`** — o que sobra é MESA × CONTROLE e o passo, os dois por decisão dela |
| `08-conexoes` | A QUARTA cor do selo — `problema` não pode parecer `atencao` | **`REMEDIR`** — a evidência caiu (§9.3) |
| `10-perfis` | Mudar a prioridade do perfil | **`DELA`** — o que sobra é a guarda que aqui não faz falta, e o passo 1 contra 5 |

**A lição que este balde deixa ao morrer:** ele existia para separar *"falta
trabalho"* de *"falta uma palavra dela"*, e essa separação valeu enquanto valeu.
Mas o balde não tinha régua: nada reprovava quando o `--publicar` acontecia e as
seis linhas continuavam dizendo que esperavam. **Balde sem dono envelhece
calado** — três das seis afirmavam no CSV uma contagem de atributos que a
publicação derrubou, e as três foram substituídas nesta leva (§9.3).

---

## 6. AS 72 QUE ERAM DELA — o balde `DESENHO`, DECIDIDO

**Este era o bloqueio da fila, e ele caiu em 04/09/2026.** Cada uma destas
precisava de uma das duas coisas: **um lugar na tela** que não existia, ou
**uma palavra** que só ela escreve. Estavam paradas porque começá-las sem ela
produziria tela que ela mandaria refazer.

**As 54 perguntas que elas geraram foram decididas** em
[O PO DECIDE AS 54](2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md), sob o
mandato dela de 04/09 (*"seja o po e orquestrador"*). A coluna da direita diz
**o que foi decidido e onde está escrito** — é o que impede a próxima pessoa de
reabrir a pergunta. A mesma frase está na coluna `porque` de cada linha do CSV.

Da lista de 74 desta seção: **64 têm decisão**, **duas FECHARAM** (viraram
`IGUAL` na leva da madrugada) e **oito não eram desenho** — a razão de cada uma
está na coluna, medida pela lista da aba. **A reclassificação dessas oito é da
segunda passagem**, quando a Onda 2 relatar o que fechou; antecipá-la seria
marcar linha antes de a cura existir.

| aba | feature | o que foi decidido, e onde |
| --- | --- | --- |
| `01-jogar` | A descrição do modo escolhido | `01[01]` — Na coluna Atenção, só má notícia |
| `01-jogar` | O número do jogador no cartão | `01[02]` — "Player N", esmaecido enquanto espera |
| `01-jogar` | A linha 'Ponte com o jogo' — por onde o jogo está recebendo o controle | `01[01]` — Na coluna Atenção, só má notícia |
| `01-jogar` | O cadeado 'Não trocar de perfil sozinho ao abrir um jogo' | `01[03]` — Volta para a Jogar, embaixo de Modo |
| `01-jogar` | A frase-causa do cadeado, e o detector cego | **FECHOU** — hoje `IGUAL`. A medição do CSV caiu: as duas frases já são fontes da coluna Atenção |
| `01-jogar` | Mesa com mais de quatro controles | `01[04]` — MORREU — C-7 |
| `02-controles` | Título do card — "Controle N — USB · Jogador X" | **NÃO É DESENHO** — a medição envelheceu: `data-campo="peca"` e `data-campo="via"` estão na página publicada |
| `02-controles` | Quadradinho da cor VIVA ao lado do título (swatch) | `02[01]` — MORREU — C-1 |
| `02-controles` | Selo do microfone (ATIVO/MUDO) — de que camada ele fala | `02[03]` — O selo diz o estado COMPOSTO — C-2 |
| `02-controles` | Perfil ativo e estado do Hefesto no topo do card | **NÃO É DESENHO** — as duas metades já têm casa (a barra da página e a aba Sistema) |
| `02-controles` | Badge de degradação do gamepad virtual | `02[07]` — Uma marca na palavra e o motivo no hover |
| `02-controles` | Guarda "sem endereço" — desligar o som do card quando não há MAC | `02[04]` — O botão apaga e a dica diz por quê |
| `02-controles` | Confissão "o microfone em que mexi não é o deste card" | `02[08]` — Vira aviso no cartão, como as recusas |
| `02-controles` | Barra de luz — o código hexadecimal da cor | `02[02]` — Palavra curta no lugar do travessão, frase inteira no hover |
| `02-controles` | Barra de luz — o retângulo colorido | **NÃO É DESENHO** — o CSV já registrava o fecho em 03/09; o que sobrava virou `02`[02] |
| `02-controles` | Barra de luz — o rótulo das quatro situações | `02[02]` — Palavra curta no lugar do travessão, frase inteira no hover |
| `02-controles` | Accent do card — a cor viva tinge analógicos, glifos e barras de gatilho | `02[01]` — MORREU — C-1 |
| `02-controles` | Clique dos analógicos (L3 / R3) | `02[10]` — Fica `[L3]` |
| `02-controles` | Microfone — o botão diz o que o clique vai fazer | `02[04]` — O botão apaga e a dica diz por quê |
| `02-controles` | Microfone — o controle deslizante de volume (mic.volume.set) | `02[05]` — A barra pintada vira clicável |
| `02-controles` | Alto-falante — o valor do volume em texto | `02[09]` — O ♪ acende, e o `alto-estado` invisível sai do desenho |
| `02-controles` | Alto-falante — o número e a barra do bloco | **NÃO É DESENHO** — a medição envelheceu: `alto-num` e `alto-barra` estão na página publicada |
| `02-controles` | Alto-falante — o controle deslizante de volume | `02[05]` — A barra pintada vira clicável |
| `02-controles` | Alto-falante — o botão de mudo | `02[04]` — O botão apaga e a dica diz por quê |
| `02-controles` | Alto-falante — o botão "Devolver" (soltar a posse do volume) | `02[06]` — Fica fora, e a dica do ♪ diz o preço |
| `02-controles` | A recusa chega a quem clicou | `02[04]` — O botão apaga e a dica diz por quê |
| `03-gatilhos` | Descrição visível do modo ESCOLHIDO (sem passar o mouse) | `03[01]` — Dica do campo, com o texto desta tela |
| `03-gatilhos` | Quando o campo "Efeito pronto" aparece, e o que escolhê-lo faz | `03[02]` — Fica como está, e a dica avisa antes do clique |
| `03-gatilhos` | Aplicar o efeito no aparelho | `03[03]` — Um botão na faixa que já existe (`--r-acao`), mandando os dois gatilhos da coluna |
| `03-gatilhos` | Dizer na tela o desfecho: aplicado × guardado para depois × nada aconteceu | `03[04]` — No cartão, pela peça da D-01 — C-3 |
| `04-iluminacao` | Botão de reenvio explícito da cor ('Aplicar no controle') | `04[03]` — A caixa do hexadecimal vira o botão |
| `04-iluminacao` | Ressalva do estado da barra (Nativo / Steam / fonte desconhecida / apagada) | `04[01]` — Uma linha só quando há ressalva |
| `04-iluminacao` | Checkbox 'Cores automáticas por controle' (auto_player_colors) | `04[02]` — Interruptor de verdade na aba — C-4, com a gravação da cor ao desligar, como a D-13 mandou |
| `04-iluminacao` | Prévia honesta quando o automático está ligado | `04[02]` — Interruptor de verdade na aba — C-4, com a gravação da cor ao desligar, como a D-13 mandou |
| `04-iluminacao` | Regra D4 — cor única em 'Todos' desliga o automático e AVISA | `04[02]` — Interruptor de verdade na aba — C-4, com a gravação da cor ao desligar, como a D-13 mandou |
| `04-iluminacao` | Aviso 'o mesmo desenho foi para os N controles' | **NÃO É DESENHO** — é dívida CONDICIONAL: depende da escrita das cinco lâmpadas e de um escopo 'Todos' |
| `05-vibracao` | A explicação do modo Auto (a escada da bateria e o intervalo de 5 s) | `05[02]` — Só a nota do Testar sobe para a tela |
| `05-vibracao` | A linha 'Estado da vibração': o jogo controla / travada em silêncio / travada em fraca=X, forte=Y | `05[03]` — Uma linha de estado POR COLUNA — C-5, com os três estados da D-14 |
| `05-vibracao` | O endereço do gesto — quem treme quando ela clica | `05[05]` — Uma linha de MESA embaixo da grade |
| `05-vibracao` | O ajuste de vibração por PEÇA (override do controle) e o aviso quando ele é apagado | `05[04]` — No cartão, pela peça da D-01 — C-6 |
| `05-vibracao` | Avisar que o perfil não tem opinião sobre a política de vibração | `05[05]` — Uma linha de MESA embaixo da grade |
| `05-vibracao` | Recado de SUCESSO depois de cada gesto | `05[04]` — No cartão, pela peça da D-01 — C-6 |
| `05-vibracao` | Recado de RECUSA quando o Hefesto não aceita | `05[06]` — As duas frases que já existem sobem para o cartão |
| `05-vibracao` | A nota 'os valores acima ainda passam pela intensidade escolhida ali em cima' | `05[02]` — Só a nota do Testar sobe para a tela |
| `06-navegacao` | Portão de modo: impedir ligar o mouse fora de "Controlar o PC" | `06[01]` — Apaga o interruptor e escreve ao lado, na tira de estados |
| `06-navegacao` | O botão PS na tabela de atalhos | `06[03]` — Fica fora, e a razão vira dica |
| `06-navegacao` | As três regiões do touchpad na tabela | `06[02]` — Ficam, com a marca de que não disparam |
| `06-navegacao` | Nomear os botões que não digitam nada | `06[04]` — Uma tira de aviso sob a tabela |
| `06-navegacao` | Nomear os atalhos que o perfil guarda e a lista não mostra | `06[04]` — Uma tira de aviso sob a tabela |
| `06-navegacao` | Avisar o CUSTO de desligar o teclado emulado | `06[05]` — Uma frase permanente enquanto estiver desativado |
| `07-lancadores` | Copiar a linha do wrapper para a área de transferência | `07[01]` — Os dois, só quando faz falta — botão e linha à mostra, só no estado de linha intocável |
| `07-lancadores` | Aviso automático "o jogo aberto agora não passou pelo wrapper" | `07[02]` — A frase para de nomear lugar |
| `08-conexoes` | Selo/veredito GLOBAL do Check-up | **FECHOU** — hoje `IGUAL`. A decisão `08`[01] (D-16) fica registrada para a S-09 |
| `08-conexoes` | O `?` de cada linha (por que importa + o que fazer) | `08[03]` — Cartão de cura na coluna da direita |
| `08-conexoes` | Card de ORDEM DE SERVIÇO (o imperativo e as três linhas com selo de procedência) | `08[04]` — Só nas frases que não foram medidas aqui |
| `08-conexoes` | Botão "Já movi — reexaminar" (comparar o arranjo de antes com o de agora) | **NÃO É DESENHO** — ela decidiu em 31/08: *"não faz sentido termos o examinar e o reexaminar"* |
| `08-conexoes` | Reabrir uma ordem ignorada ("Ver as ordens ignoradas") | `08[05]` — A linha fica na lista, apagada, e o mesmo ⊘ desfaz |
| `08-conexoes` | Rádios vizinhos — gravar a resposta dela | `08[02]` — JÁ FOI — §3 |
| `08-conexoes` | Mapa do gabinete — os seis gestos (escolher, colocar, tirar, nova entrada, nova extensão, nova face) | `08[08]` — Trocar pela verdade |
| `08-conexoes` | Microfone — a trava no cabo e sem endereço | `08[02]` — JÁ FOI — §3 |
| `08-conexoes` | "A luz não acende" — a trava no cabo | `08[02]` — JÁ FOI — §3 |
| `08-conexoes` | Bateria de cada controle na linha do acordeão | **NÃO É DESENHO** — a linha já lê a bateria; a BARRA é da aba Controles, por desenho |
| `08-conexoes` | Transporte (cabo/rádio) de cada controle na linha do acordeão | **NÃO É DESENHO** — já lê o daemon; o que resta é forma de tela, não escolha dela |
| `08-conexoes` | Onde a declaração da mesa é gravada — o "Aplicar" do rodapé | `08[08]` — Trocar pela verdade |
| `09-sistema` | Botão "Atualizar" | `09[01]` — O nome vira o trabalho: "Reaplicar ajustes" |
| `09-sistema` | Botão cinza por estado (o que não tem trabalho a fazer) | `09[02]` — Apagado e ainda assim responde |
| `10-perfis` | Ativar o perfil escolhido | `10[05]` — A tira ganha uma segunda linha |
| `10-perfis` | Mostrar a prioridade (a barra e o número) | `10[03]` — A frase dela entra no desenho — e vão as DUAS, a dela primeiro, seguida da explicação do Universal em zero, que o texto de hoje tem e o dela não |
| `10-perfis` | O perfil cuja regra a tela não sabe mostrar (a válvula do R-12) | `10[01]` — Cadeado no campo, frase no hover |
| `10-perfis` | O campo do jogo (o programa ou o número da Steam) | `10[04]` — Só a tira, e o campo se corrige — o endereço colado vira o número na frente dela |
| `10-perfis` | A frase "jogo reconhecido" e o carimbo de ponte ao lado do campo | `10[04]` — Só a tira, e o campo se corrige — o endereço colado vira o número na frente dela |
| `10-perfis` | "Exigência invisível": o que o perfil exige e a página não mostra | `10[01]` — Cadeado no campo, frase no hover |
| `10-perfis` | O preço da máscara (o que o Xbox custa) | `10[06]` — Preço no hover, aviso do rádio em linha — como ela pediu por escrito |
| `10-perfis` | O aviso de rádio frágil quando ela escolhe o Modo Nativo | `10[06]` — Preço no hover, aviso do rádio em linha — como ela pediu por escrito |

---

## 7. AS 58 DO BALDE `MOTOR`

Código novo. Nenhuma espera decisão dela para começar — mas todas custam mais
que as 38 do `LIGAR`, e três delas são features inteiras (a cerimônia "Mapear
Entrada a Entrada" da 08, o editor avançado de regra da 10, a seção `mode` do
perfil).

**Eram 57, e entrou uma:** `04-iluminacao` · **Trocar o número do jogador deste
controle**, que era `IGUAL` até 04/09 e virou `DIFERENTE` sobre a queixa dela
*"escolha do jogador no iluminação não funciona"*. Medido na mesa dela com os
dois DualSense: `identity.number.set` troca o `player_slot` e **não move lâmpada
nenhuma** — só `coop.sync` move, e renumerar não é um dos gatilhos dele. A GTK
tem o MESMO defeito por este caminho. A cura é **uma linha** em
`daemon/ipc_handlers._handle_identity_number_set`, e cura os dois lados.

| aba | feature |
| --- | --- |
| `01-jogar` | O modo/máscara escolhidos entram no perfil que ela salva |
| `02-controles` | Touchpad — o pontinho e a POSIÇÃO do dedo |
| `02-controles` | Analógicos — a posição do ponto e os números X/Y |
| `02-controles` | Microfone — o medidor de onda ao vivo |
| `02-controles` | Alto-falante — "Sons do jogo" |
| `02-controles` | Alto-falante — "Todo o som do PC" |
| `02-controles` | Alto-falante — o som de confirmação |
| `02-controles` | Anotar no rascunho do perfil o que o gesto de som fez |
| `03-gatilhos` | Editar em "Todos" — mexer no gatilho de toda a mesa de uma vez |
| `04-iluminacao` | Marcar/desmarcar cada uma das 5 luzes de jogador |
| `04-iluminacao` | Presets 'Desenho do P1' … 'Desenho do P4' |
| `04-iluminacao` | Presets 'Todas acesas' / 'Todas apagadas' |
| `04-iluminacao` | Botão 'Aplicar o desenho' (reenvio das 5 luzes) |
| `04-iluminacao` | 'Voltar todos ao automático' |
| `05-vibracao` | As duas barras de motor (esquerdo/direito, 0–255) como AJUSTE |
| `05-vibracao` | Testar (o controle treme por meio segundo) |
| `05-vibracao` | Aplicar (fixar a vibração naqueles valores, até ela mudar) |
| `05-vibracao` | Deixar o jogo controlar a vibração (o botão de devolver, sozinho) |
| `05-vibracao` | Gravar a força escolhida no rascunho do perfil (o 'Salvar Perfil' persistir o que a aba mostra) |
| `05-vibracao` | Zerar weak/strong (e o passthrough) no rascunho ao parar ou devolver |
| `06-navegacao` | Preferência de velocidade com a emulação DESLIGADA |
| `06-navegacao` | Velocidade guardada no PERFIL (seção `Profile.mouse`) |
| `06-navegacao` | Editar QUAL TECLA cada botão digita (`Profile.key_bindings`, combinação livre) |
| `06-navegacao` | Remover: deixar um botão sem digitar nada |
| `06-navegacao` | Voltar ao padrão dos atalhos |
| `06-navegacao` | Convivência entre `key_bindings` (GTK) e `button_actions` (HTML) no daemon |
| `07-lancadores` | Repor o atalho de inicialização DE CARONA, ao Salvar/Aplicar perfil |
| `07-lancadores` | Lembrete proativo "este jogo ainda não abre pelo launcher do Hefesto" |
| `07-lancadores` | "Deixar tudo pronto" — Steam Input + wrapper com UM consentimento |
| `07-lancadores` | "Este jogo não funciona" — marcar o jogo na allowlist do Steam Input |
| `07-lancadores` | "Fixar a versão que funciona" — travar o Proton validado |
| `07-lancadores` | "Tirar o que faz engasgar" — a sobreposição Vulkan por jogo |
| `07-lancadores` | Steam Input: conferir se está ligado e desligar |
| `07-lancadores` | "Consertar problemas conhecidos" (áudio do controle + Steam Input, sem senha) |
| `08-conexoes` | Dar nome a um adaptador (o alias do BlueZ) |
| `08-conexoes` | Cerimônia "Mapear Entrada a Entrada" (calibrar as entradas, inclusive as VAZIAS) |
| `08-conexoes` | "A luz não acende" — a espera pelo PS, a contagem e o Cancelar |
| `09-sistema` | Botão "Corrigir modo de execução" (migrar para systemd) |
| `09-sistema` | Recibo do gesto (barra de estado / toast) |
| `09-sistema` | Steam — "Este jogo não funciona" |
| `09-sistema` | Steam — "Consertar problemas conhecidos" / "Refazer os consertos automáticos" |
| `09-sistema` | Steam — "Copiar opções para os jogos" (a linha de inicialização) |
| `09-sistema` | Steam — "Aplicar aos jogos da Steam" |
| `09-sistema` | Camadas Vulkan — "Tirar o que faz engasgar" / "Procurar sobreposição de novo" |
| `09-sistema` | "Restaurar de fábrica" (devolver o meu_perfil ao asset original) |
| `10-perfis` | Selecionar um perfil (clicar na linha abre o editor) |
| `10-perfis` | Ativar: as outras abas passam a mostrar o perfil ativado, na hora |
| `10-perfis` | Ativar: a carona do wrapper da Steam |
| `10-perfis` | O botão "Salvar este perfil" da aba |
| `10-perfis` | O Salvar funde o que as outras abas editaram (o rascunho) |
| `10-perfis` | O campo Nome / renomear o perfil |
| `10-perfis` | "Aplica a" / "Funciona em": os presets oferecidos |
| `10-perfis` | A lista suspensa com os jogos DESTA máquina |
| `10-perfis` | O editor avançado: window_class · título da janela · nome do programa |
| `10-perfis` | O aviso de que o `process_name` não casa nesta máquina (PROCESSO-CEGO-01) |
| `10-perfis` | A seção "Modo" do perfil (o que ATIVAR este perfil liga) |
| `10-perfis` | A caixinha "tirar este jogo do Steam Input" e a lista dos outros marcados |

---

## 8. AS 55 QUE NÃO SÃO DÍVIDA

Ficam listadas porque a próxima pessoa vai olhar o CSV, ver `DIFERENTE`, e
querer "consertar" — e consertar algumas destas seria desfazer decisão dela ou
reintroduzir defeito que a interface nova curou.

**Eram 52, e viraram 55.** As três que entraram vieram do balde `PUBLICAR` ao
morrer: publicada a página, o que sobrava de cada uma era diferença deliberada
— a prévia da cor que apaga sob ressalva (`04`), o deslizador que é da MESA na
GTK e do CONTROLE aqui (`05`), e o passo 1 contra 5 da prioridade (`10`). Estão
na §5 com a razão de cada uma, e não estão repetidas nas tabelas abaixo, que
são as originais de manhã.

### 8.1 — decisão dela (37 + as 3 da §5)

| aba | feature |
| --- | --- |
| `01-jogar` | Momento em que o clique vira ato (marcar × aplicar na hora) |
| `01-jogar` | O custo da máscara Xbox, dito ANTES do clique |
| `01-jogar` | O que a aba mostra quando não há controle na mesa |
| `01-jogar` | Desligar/ligar o Hefesto DE VERDADE (o frame 'Sessão') |
| `02-controles` | Linha da verdade — "o que chega ao jogo" |
| `02-controles` | Microfone — "Liberar": devolver a posse do mudo ao hid-playstation |
| `03-gatilhos` | As curvas prontas de VIBRAÇÃO por posição |
| `03-gatilhos` | O rascunho acompanha a tela, para o "Salvar Perfil" do rodapé gravar o que ela vê |
| `04-iluminacao` | Escolher a cor grava no rascunho do perfil |
| `04-iluminacao` | Ajustar o brilho da barra (0–100%) |
| `04-iluminacao` | 'Voltar ao automático' (o controle selecionado) |
| `04-iluminacao` | Escopo 'Todos' — um pedido POR MAC em cada conectado |
| `05-vibracao` | Clicar num dos quatro degraus de força (Economia/Balanceado/Máximo/Auto) |
| `05-vibracao` | A linha 'com um controle escolhido, a intensidade vale para todos' (RUM-1) |
| `05-vibracao` | Parar |
| `06-navegacao` | Ligar/desligar a emulação de MOUSE |
| `06-navegacao` | Ligar/desligar a emulação de TECLADO |
| `06-navegacao` | Velocidade do cursor |
| `06-navegacao` | Velocidade da rolagem |
| `06-navegacao` | Onde a escolha é GRAVADA (rascunho + rodapé × disco direto) |
| `06-navegacao` | Legenda que ensina como o teclado emulado funciona |
| `08-conexoes` | O carimbo "Examinado há …" |
| `08-conexoes` | ⊘ Ignorar uma ordem de serviço |
| `08-conexoes` | Rádios vizinhos — a coluna "O que é" com o degrau LIDO PELO KERNEL |
| `08-conexoes` | As duas perguntas da sala (altura da antena · linha de visada) — GRAVAR |
| `08-conexoes` | As duas perguntas da sala — MOSTRAR o que já está declarado |
| `08-conexoes` | Microfone por controle (a ponte, não o mudo) — gravar |
| `09-sistema` | Botão "Ligar o Hefesto" (start do serviço) |
| `09-sistema` | Botão "Parar o serviço" / "Desligar o Hefesto" |
| `09-sistema` | Perfil de Bateria — escolher um dos três (Tudo ligado / Bateria longa / Eu escolho) |
| `09-sistema` | Steam — "Deixar tudo pronto" |
| `09-sistema` | Proton — "Fixar a versão que funciona" / "Refazer a fixação do Proton" |
| `09-sistema` | Diálogo de confirmação antes de ação destrutiva |
| `10-perfis` | Novo perfil |
| `10-perfis` | Duplicar |
| `10-perfis` | Remover o perfil que está VALENDO agora |
| `10-perfis` | As cinco perguntas do Salvar (as guardas contra perda silenciosa) |

### 8.2 — a interface nova faz melhor (15)

| aba | feature |
| --- | --- |
| `01-jogar` | Cadência com que a tela reflete o daemon |
| `02-controles` | Alto-falante — qual botão de rota está aceso |
| `03-gatilhos` | "Desligar" — soltar a trava manual sem re-armá-la (R-19) |
| `04-iluminacao` | Rótulo 'Desenho que mandamos: …' (qual desenho vale e por ordem de quem) |
| `04-iluminacao` | Quem decide se o co-op manda nas 5 luzes |
| `06-navegacao` | Adicionar uma linha de atalho para um botão que não tinha |
| `07-lancadores` | Aplicar o wrapper à biblioteca INTEIRA por um gesto explícito |
| `07-lancadores` | Respeitar o `jogos_sem_wrapper.txt` no reparo em massa |
| `08-conexoes` | O texto de cada linha do exame |
| `08-conexoes` | Teto da vibração por controle |
| `09-sistema` | Reconciliação do estado da aba (quando a tela é relida) |
| `09-sistema` | "Ver detalhes" — as últimas 80 linhas do registro técnico |
| `10-perfis` | Quem responde "qual perfil está valendo agora" |
| `10-perfis` | Remover perfil |
| `10-perfis` | Importar um perfil de um arquivo |

---

## 9. OS FATOS QUE CAÍRAM, e um deles estava no enunciado desta triagem

### 9.1 — as sete que fecharam entre a manhã e a tarde de 04/09

Medidas comparando o CSV desta árvore com o do commit em que esta triagem
nasceu:

```
$ git show f941a751:docs/data/paridade-gtk-html.csv   # a triagem de manhã
   → 101 IGUAL · 121 DIFERENTE · 111 FALTA_NO_HTML · 59 SO_NO_HTML · 4 ?
$ .venv/bin/python scripts/check_paridade_gtk_html.py  # a mesma árvore, à tarde
   → 107 IGUAL · 125 DIFERENTE · 101 FALTA_NO_HTML · 59 SO_NO_HTML · 4 ?
```

| balde de origem | aba | feature | virou |
| --- | --- | --- | --- |
| `DESENHO` | `01-jogar` | A frase-causa do cadeado, e o detector cego | `IGUAL` |
| `DESENHO` | `08-conexoes` | Selo/veredito GLOBAL do Check-up | `IGUAL` |
| `LIGAR` | `08-conexoes` | Aviso da mesa suja (outro programa segurando o nó do controle) | `IGUAL` |
| `LIGAR` | `08-conexoes` | Microfone — quanto ele custa de rádio (a frase da capacidade) | `IGUAL` |
| `LIGAR` | `08-conexoes` | Ocupação de rádio por adaptador (quem está em qual dongle) | `IGUAL` |
| `LIGAR` | `08-conexoes` | Rádios vizinhos — a coluna "Onde" e o aviso de vizinhança | `IGUAL` |
| `LIGAR` | `08-conexoes` | Tabela de adaptadores Bluetooth (Nome · Adaptador · Onde está) | `IGUAL` |

E **uma abriu**: `04-iluminacao` · *Trocar o número do jogador deste controle*,
que era `IGUAL` e virou `DIFERENTE` — está na §7, com a causa medida.

### 9.2 — o balde `PUBLICAR` morreu

Está na §5, com os dois comandos que o mediram. **Seis linhas diziam esperar uma
palavra dela, e nenhuma esperava.**

### 9.3 — QUATRO LINHAS AFIRMAVAM UMA DIFERENÇA ENTRE A BANCADA E O PRODUTO QUE NÃO EXISTE MAIS

Este é o achado desta releitura, e ele tem a assinatura que 03/09 pagou quatro
vezes num dia: **o instrumento apontava para outra coisa.**

Com as treze páginas publicadas, `mockup/NN-*.html` e
`interface/paginas/NN-*.html` ficaram **byte-idênticos nos treze pares**. Logo
**toda afirmação de diferença entre os dois está errada** — e havia quatro,
todas do tipo "contei o atributo nos dois arquivos":

| aba | feature | o que a linha afirmava | o que eu medi em 04/09 |
| --- | --- | --- | --- |
| `01-jogar` | Escolher a máscara POR CONTROLE, no cartão de cada um | "na página publicada o p3 e o p4 dão `data-gesto=None`; na bancada os quatro respondem" | `data-gesto="mascara"`: **12 nos dois**. O que separa p3/p4 é `data-conectado="nao"` — estado, não publicação |
| `04-iluminacao` | Escolher uma cor livre (paleta do sistema) | "o publicado é `<input type=\"color\" class=\"livre\" value=\"#0000ff\"` e o mockup tem `data-gesto=\"cor\"`" | os dois têm `data-gesto="cor"` |
| `04-iluminacao` | Marca de qual cor está escolhida agora | "`grep -c 'data-campo=\"hex\"'` dá 2 no publicado e 18 no mockup" | **18 nos dois** |
| `08-conexoes` | A QUARTA cor do selo | "a página publicada tem 0 `data-campo=\"selo-estado\"` e 0 `data-hef-alvo=\"classe\"`; o mockup tem 5 de cada" | **5 e 20** no publicado |

**E o portão não podia pegar nenhuma das quatro.** O `sinal` que ele vigia
nessas linhas é um símbolo da GTK — `_on_lightbar_cor_solta`,
`_refresh_lightbar_from_draft`, `COR[ESTADO_ATENCAO]` — que o lado HTML **nunca
vai chamar**, porque a interface nova não chama internos da janela antiga: ela
fecha a dívida ganhando o ENDEREÇO DE TELA. A regra 6 (`divida-fechada`) só
morde quando o símbolo da GTK aparece; a regra 7 (`sinal-morto`) só morde quando
o símbolo não existe em lugar nenhum. **Um símbolo que existe na GTK e nunca
pode aparecer no HTML cai entre as duas**, e a linha fica verde para sempre
sobre uma dívida que já fechou.

As quatro frases foram substituídas com a medição. **As três que são do balde
`REMEDIR` guardam o veredito velho de propósito**: virá-lo para `IGUAL` exige
medir o ATO na tela viva, e isso é da frente da aba, na Onda 2. Marcar uma linha
como fechada antes de a cura ser medida é exatamente o instrumento falso que
esta seção denuncia.

### 9.4 — o fato que estava no enunciado desta triagem

A linha do CSV da `04-iluminacao` dizia que *"o 'Salvar' do rodapé grava
`auto_player_colors=False` FIXO no override"*, e a leitura do `rodape.py:117`
confirmava — a linha está lá, escrita.

**Medindo o ATO, o caminho não existe.** O valor é descartado duas vezes:
`with_controller_leds` chama `_leds_draft_to_config` sem `include_auto`, e o
filtro `only_fields` o derruba de novo. O toggle é do PERFIL, por decisão antiga
e escrita nas duas pontas.

Uma cura chegou a ser escrita no `rodape.py` sobre esse diagnóstico, e foi
**revertida**: ela não curava nada. O que ficou é a régua do fato —
`tests/unit/test_o_salvar_nao_congela_a_paleta_automatica.py` —, porque é dele
que a regra dela de 03/09 depende: *"nenhuma cor dos controles nunca pode ser a
mesma"*. Com o override calado sobre o automático, quem chega depois recebe a
cor do NÚMERO dele, e a paleta dos oito não repete nenhuma.

As duas linhas do CSV levaram a correção, com a razão. É a regra desta casa:
**fato errado se substitui, e em todos os lugares.**

E a lição é a que 03/09 já tinha pago quatro vezes, num dia só: **ler a linha
não é medir o ato.**

---

## 10. A RESPOSTA À PERGUNTA DELA

*"Concluímos o produto?"* — o produto está **instalado, rodando e verde**: 36
portões, a suíte inteira, as dez abas publicadas, o install com `rc=0`.

*"Pode fazer isso agora, pra termos os 100%?"* — **não em um gesto, mas o motivo
mudou entre a manhã e a tarde de 04/09.**

De manhã a resposta era *"74 das 180 linhas de fila são tela, e tela é dela"*.
**Isso caiu.** As 54 perguntas foram decididas sob o mandato dela
(*"seja o po e orquestrador"*), o balde `PUBLICAR` morreu, e hoje **nenhuma das
171 linhas de fila espera por ela**. O que resta é volume de trabalho, e a
validação final, que é a FASE 5 e é dela.

A ordem que eu proporia, e cada degrau é uma leva:

1. **as 18 da 01-jogar e as 11 da 08-conexoes** (balde `LIGAR`) — duas abas
   quase fechando com trabalho mecânico e nenhuma decisão. **Cinco das 43 já
   fecharam nesse movimento**, e as cinco eram da 08;
2. **os seis defeitos da §3** — porque perdem trabalho dela em silêncio;
3. **as 3 do `REMEDIR`** — são baratas e são medição, não código: quem abrir a
   tela viva da 04 e da 08 fecha as três ou prova que a dívida continua;
4. **as 72 do `DESENHO`**, aba por aba, **agora com a decisão já escrita** na
   §6 e na coluna `porque` do CSV — é a Onda 2, dez frentes em paralelo;
5. **as 58 do `MOTOR`** restantes.

**A ordem mudou de forma, não só de número.** De manhã o degrau 3 era *"as 6 do
`PUBLICAR` — uma palavra dela"* e o degrau 4 dependia de sete conversas curtas.
Os dois sumiram: **a fila deixou de ter degrau bloqueado.**
