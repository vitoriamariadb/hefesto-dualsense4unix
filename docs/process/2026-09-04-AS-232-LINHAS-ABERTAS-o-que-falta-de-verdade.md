# As 232 linhas abertas, triadas uma a uma — e o que "100%" custa

**04/09/2026.** Ela perguntou, com estas palavras: *"ok e agora? o que resta?
concluímos o produto? O install está pronto?"*, e depois: *"conclui as
pendências todas. pode fazer isso agora? pra termos os 100%?"*

A resposta honesta exige separar duas coisas que o número 232 mistura. Este
documento faz essa separação, **linha por linha**, lendo a coluna `porque` de
`docs/data/paridade-gtk-html.csv` — que é onde as levas anteriores deixaram a
medição de cada uma.

---

## 1. O NÚMERO, e por que ele encolhe assim que se olha

A régua de paridade tem **396 features** medidas entre a janela GTK e a
interface nova. Delas, 164 já fecharam (101 `IGUAL` + 59 `SO_NO_HTML` + 4
`NAO_DA_PARA_SABER`), e **232 estão abertas** — 121 `DIFERENTE` e 111
`FALTA_NO_HTML`.

Triadas uma a uma:

| balde | quantas | o que é |
| --- | ---: | --- |
| **DELA** | **37** | a diferença existe porque ela decidiu assim. Não é dívida. |
| **MELHOR** | **15** | a interface nova faz mais, ou faz certo onde a GTK erra. Não é dívida. |
| **PUBLICAR** | **6** | está pronto no `mockup/` e espera o `--publicar` dela. |
| **LIGAR** | **43** | o dado JÁ existe nos dois lados; falta alguém ler e a página ter endereço. Trabalho mecânico, sem decisão. |
| **DESENHO** | **74** | falta lugar na tela ou palavra nova. **É decisão dela antes de ser trabalho meu.** |
| **MOTOR** | **57** | falta código de verdade — escrita que não existe, campo inalcançável, botão morto. |

**52 das 232 não são dívida nenhuma.** São escolhas dela e ganhos da interface
nova, registrados como `DIFERENTE` porque a régua compara COMPORTAMENTO e se
recusa a chamar de igual o que não mediu igual — que é o que a impede de virar
maquiagem.

**Então a fila real é 180**, e ela tem uma forma muito clara:

```
   6  PUBLICAR   ← uma palavra dela, e fecham hoje
  43  LIGAR      ← só trabalho meu, nenhuma decisão pendente
  74  DESENHO    ← param na palavra dela: onde cabe, e o que diz
  57  MOTOR      ← código novo
```

**Setenta e quatro das 180 esperam por ELA, não por mim.** Esse é o número
que responde à pergunta: não dá para "concluir tudo agora" porque 41% da fila
é decisão de tela, e tela é dela — é a regra desta casa desde a
`PROVA-DE-TELA-01`.

---

## 2. POR ABA — onde o trabalho está concentrado

| aba | abertas | DELA | MELHOR | PUBLICAR | LIGAR | DESENHO | MOTOR |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 01-jogar | 30 | 4 | 1 | — | **18** | 6 | 1 |
| 02-controles | 34 | 2 | 1 | — | 4 | **20** | 7 |
| 03-gatilhos | 10 | 2 | 1 | — | 2 | 4 | 1 |
| 04-iluminacao | 20 | 4 | 2 | 3 | — | 6 | 5 |
| 05-vibracao | 18 | 3 | — | 1 | — | 8 | 6 |
| 06-navegacao | 19 | 6 | 1 | — | — | 6 | 6 |
| 07-lancadores | 12 | — | 2 | — | — | 2 | **8** |
| 08-conexoes | 40 | 6 | 2 | 1 | **16** | 12 | 3 |
| 09-sistema | 21 | 6 | 2 | — | 3 | 2 | 8 |
| 10-perfis | 28 | 4 | 3 | 1 | — | 8 | **12** |

Três leituras que a tabela dá de graça:

1. **A 01-jogar é quase toda `LIGAR`** (18 de 30). O daemon já publica o que
   falta na tela — o aviso de máscara divergente, o banner do vpad degradado, os
   cards dos controles externos, o recibo do Reconectar. É a aba com a melhor
   razão entre trabalho e ganho de todo o inventário.
2. **A 02-controles é quase toda `DESENHO`** (20 de 34). Ela é a aba que mais
   espera pela palavra dela, e por isso a mais parada.
3. **A 10-perfis e a 07-lancadores são `MOTOR`** (12 e 8). São as duas em que
   falta código de verdade, não pintura.

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

## 4. O QUE FECHA SEM PERGUNTAR NADA A ELA — as 43 do balde `LIGAR`

Estas não precisam de desenho, de texto novo nem de decisão. O dado existe, o
dono existe, e falta o par *ler + endereço na página*. **Dezoito são da
01-jogar e dezesseis da 08-conexoes** — as duas abas fecham quase inteiras
nesse único movimento.

| aba | feature |
| --- | --- |
| `01-jogar` | A caixa da máscara só aparece quando faz sentido |
| `01-jogar` | A frase da PAUSA no lugar da promessa do modo |
| `01-jogar` | O aviso 'entrei em Navegação e o mouse/teclado está desligado' |
| `01-jogar` | A frase que conta os jogadores e separa adotado de externo |
| `01-jogar` | Cards dos controles EXTERNOS (Nintendo Pro, 8BitDo…) |
| `01-jogar` | Aviso de grab dobrado no card ('o jogo pode receber cada botão duas vezes') |
| `01-jogar` | O marcador 'primário' no card do controle principal |
| `01-jogar` | A palavra do transporte no cartão |
| `01-jogar` | O recibo do 'Reconectar' — quantos jogadores voltaram, se a numeração compactou |
| `01-jogar` | A dica do 'Reconectar' quando há jogo aberto |
| `01-jogar` | O aviso de divergência de máscara (a escolha dela não chegou ao aparelho) |
| `01-jogar` | A faixa laranja do que ela pediu e ainda não valeu |
| `01-jogar` | Banner de degradação do vpad (a máscara DualSense caiu para uinput) |
| `01-jogar` | Banner 'jogo aberto SEM o wrapper' |
| `01-jogar` | Banner 'a emulação está desligada por uma escolha ANTIGA sua' |
| `01-jogar` | A linha de origem — 'Nativo/Gamepad ligado pelo perfil ativo' |
| `01-jogar` | A coluna 'Atenção' — quais avisos aparecem |
| `01-jogar` | O que a aba faz quando o daemon está DESLIGADO |
| `02-controles` | Dica do título — qual gamepad virtual este controle alimenta |
| `02-controles` | Linha do giroscópio espelhado — "fluindo para o jogo (~N Hz)" |
| `02-controles` | Alto-falante — o selo "Saída muda" (a camada 1 do PipeWire) |
| `02-controles` | Alto-falante — "acordado / dormindo" no título da moldura |
| `03-gatilhos` | Dica (tooltip) por modo, com a descrição do que ele faz |
| `03-gatilhos` | Gravar a configuração do gatilho no perfil, por controle |
| `08-conexoes` | Exame da mesa — quantas conferências rodam, e quando |
| `08-conexoes` | Ambiguidade fina das ordens (quem é quem no barramento) |
| `08-conexoes` | Tabela de adaptadores Bluetooth (Nome · Adaptador · Onde está) |
| `08-conexoes` | O hub em comum acima de todos os adaptadores |
| `08-conexoes` | As contagens do gabinete (o que o firmware diz × o que o kernel conta) |
| `08-conexoes` | Medidor de rádio / Desempenho (turnos por adaptador) |
| `08-conexoes` | Rádios vizinhos — a coluna "Onde" e o aviso de vizinhança |
| `08-conexoes` | Alvo de saída — LER DE VOLTA qual é o alvo agora |
| `08-conexoes` | Microfone — quanto ele custa de rádio (a frase da capacidade) |
| `08-conexoes` | "A luz não acende" — a RAZÃO de a cura ser oferecida |
| `08-conexoes` | Aviso da mesa suja (outro programa segurando o nó do controle) |
| `08-conexoes` | Contagem da seção Gestão de Controles ("N na mesa · X no cabo · Y no rádio") |
| `08-conexoes` | Controles EXTERNOS (8BitDo, Pro Controller, Xbox) na lista da mesa |
| `08-conexoes` | Aviso "controle ligado que o sistema não entregou ao Hefesto" |
| `08-conexoes` | Aviso do Bluetooth nativo frágil |
| `08-conexoes` | Ocupação de rádio por adaptador (quem está em qual dongle) |
| `09-sistema` | Estado do serviço — "O Hefesto está" / "O serviço está" |
| `09-sistema` | Perfil de Bateria — a tabela de consequências (o que cada perfil faz com cada coisa) |
| `09-sistema` | Perfil de Bateria — a conta de slots por adaptador de rádio |

---

## 5. AS SEIS QUE ESPERAM UMA PALAVRA — o balde `PUBLICAR`

Estão prontas no `mockup/`, aprovadas na forma, e param no
`scripts/check_o_desenho_aprovado.py --publicar`. Uma palavra dela fecha as seis.

| aba | feature |
| --- | --- |
| `04-iluminacao` | Escolher uma cor livre (paleta do sistema) |
| `04-iluminacao` | Marca de qual cor está escolhida agora |
| `04-iluminacao` | Prévia da cor com o brilho aplicado |
| `05-vibracao` | Deslizador de intensidade livre (política "custom", `rumble.policy_custom`) |
| `08-conexoes` | A QUARTA cor do selo — `problema` não pode parecer `atencao` |
| `10-perfis` | Mudar a prioridade do perfil |

---

## 6. AS 74 QUE SÃO DELA — o balde `DESENHO`

Cada uma destas precisa de uma das duas coisas: **um lugar na tela** que hoje
não existe, ou **uma palavra** que só ela escreve. A regra da casa é explícita
— *"texto na interface é zero… se for de média importância vira tooltip"*
(30/08) e *"interface só fecha com o olho dela"*.

Elas não estão paradas por falta de trabalho meu. Estão paradas porque
começá-las sem ela produziria tela que ela vai mandar refazer.

| aba | feature |
| --- | --- |
| `01-jogar` | A descrição do modo escolhido |
| `01-jogar` | O número do jogador no cartão |
| `01-jogar` | A linha 'Ponte com o jogo' — por onde o jogo está recebendo o controle |
| `01-jogar` | O cadeado 'Não trocar de perfil sozinho ao abrir um jogo' |
| `01-jogar` | A frase-causa do cadeado, e o detector cego |
| `01-jogar` | Mesa com mais de quatro controles |
| `02-controles` | Título do card — "Controle N — USB · Jogador X" |
| `02-controles` | Quadradinho da cor VIVA ao lado do título (swatch) |
| `02-controles` | Selo do microfone (ATIVO/MUDO) — de que camada ele fala |
| `02-controles` | Perfil ativo e estado do Hefesto no topo do card |
| `02-controles` | Badge de degradação do gamepad virtual |
| `02-controles` | Guarda "sem endereço" — desligar o som do card quando não há MAC |
| `02-controles` | Confissão "o microfone em que mexi não é o deste card" |
| `02-controles` | Barra de luz — o código hexadecimal da cor |
| `02-controles` | Barra de luz — o retângulo colorido |
| `02-controles` | Barra de luz — o rótulo das quatro situações |
| `02-controles` | Accent do card — a cor viva tinge analógicos, glifos e barras de gatilho |
| `02-controles` | Clique dos analógicos (L3 / R3) |
| `02-controles` | Microfone — o botão diz o que o clique vai fazer |
| `02-controles` | Microfone — o controle deslizante de volume (mic.volume.set) |
| `02-controles` | Alto-falante — o valor do volume em texto |
| `02-controles` | Alto-falante — o número e a barra do bloco |
| `02-controles` | Alto-falante — o controle deslizante de volume |
| `02-controles` | Alto-falante — o botão de mudo |
| `02-controles` | Alto-falante — o botão "Devolver" (soltar a posse do volume) |
| `02-controles` | A recusa chega a quem clicou |
| `03-gatilhos` | Descrição visível do modo ESCOLHIDO (sem passar o mouse) |
| `03-gatilhos` | Quando o campo "Efeito pronto" aparece, e o que escolhê-lo faz |
| `03-gatilhos` | Aplicar o efeito no aparelho |
| `03-gatilhos` | Dizer na tela o desfecho: aplicado × guardado para depois × nada aconteceu |
| `04-iluminacao` | Botão de reenvio explícito da cor ('Aplicar no controle') |
| `04-iluminacao` | Ressalva do estado da barra (Nativo / Steam / fonte desconhecida / apagada) |
| `04-iluminacao` | Checkbox 'Cores automáticas por controle' (auto_player_colors) |
| `04-iluminacao` | Prévia honesta quando o automático está ligado |
| `04-iluminacao` | Regra D4 — cor única em 'Todos' desliga o automático e AVISA |
| `04-iluminacao` | Aviso 'o mesmo desenho foi para os N controles' |
| `05-vibracao` | A explicação do modo Auto (a escada da bateria e o intervalo de 5 s) |
| `05-vibracao` | A linha 'Estado da vibração': o jogo controla / travada em silêncio / travada em fraca=X, forte=Y |
| `05-vibracao` | O endereço do gesto — quem treme quando ela clica |
| `05-vibracao` | O ajuste de vibração por PEÇA (override do controle) e o aviso quando ele é apagado |
| `05-vibracao` | Avisar que o perfil não tem opinião sobre a política de vibração |
| `05-vibracao` | Recado de SUCESSO depois de cada gesto |
| `05-vibracao` | Recado de RECUSA quando o Hefesto não aceita |
| `05-vibracao` | A nota 'os valores acima ainda passam pela intensidade escolhida ali em cima' |
| `06-navegacao` | Portão de modo: impedir ligar o mouse fora de "Controlar o PC" |
| `06-navegacao` | O botão PS na tabela de atalhos |
| `06-navegacao` | As três regiões do touchpad na tabela |
| `06-navegacao` | Nomear os botões que não digitam nada |
| `06-navegacao` | Nomear os atalhos que o perfil guarda e a lista não mostra |
| `06-navegacao` | Avisar o CUSTO de desligar o teclado emulado |
| `07-lancadores` | Copiar a linha do wrapper para a área de transferência |
| `07-lancadores` | Aviso automático "o jogo aberto agora não passou pelo wrapper" |
| `08-conexoes` | Selo/veredito GLOBAL do Check-up |
| `08-conexoes` | O `?` de cada linha (por que importa + o que fazer) |
| `08-conexoes` | Card de ORDEM DE SERVIÇO (o imperativo e as três linhas com selo de procedência) |
| `08-conexoes` | Botão "Já movi — reexaminar" (comparar o arranjo de antes com o de agora) |
| `08-conexoes` | Reabrir uma ordem ignorada ("Ver as ordens ignoradas") |
| `08-conexoes` | Rádios vizinhos — gravar a resposta dela |
| `08-conexoes` | Mapa do gabinete — os seis gestos (escolher, colocar, tirar, nova entrada, nova extensão, nova face) |
| `08-conexoes` | Microfone — a trava no cabo e sem endereço |
| `08-conexoes` | "A luz não acende" — a trava no cabo |
| `08-conexoes` | Bateria de cada controle na linha do acordeão |
| `08-conexoes` | Transporte (cabo/rádio) de cada controle na linha do acordeão |
| `08-conexoes` | Onde a declaração da mesa é gravada — o "Aplicar" do rodapé |
| `09-sistema` | Botão "Atualizar" |
| `09-sistema` | Botão cinza por estado (o que não tem trabalho a fazer) |
| `10-perfis` | Ativar o perfil escolhido |
| `10-perfis` | Mostrar a prioridade (a barra e o número) |
| `10-perfis` | O perfil cuja regra a tela não sabe mostrar (a válvula do R-12) |
| `10-perfis` | O campo do jogo (o programa ou o número da Steam) |
| `10-perfis` | A frase "jogo reconhecido" e o carimbo de ponte ao lado do campo |
| `10-perfis` | "Exigência invisível": o que o perfil exige e a página não mostra |
| `10-perfis` | O preço da máscara (o que o Xbox custa) |
| `10-perfis` | O aviso de rádio frágil quando ela escolhe o Modo Nativo |

---

## 7. AS 57 DO BALDE `MOTOR`

Código novo. Nenhuma espera decisão dela para começar — mas todas custam mais
que as 43 do `LIGAR`, e três delas são features inteiras (a cerimônia "Mapear
Entrada a Entrada" da 08, o editor avançado de regra da 10, a seção `mode` do
perfil).

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

## 8. AS 52 QUE NÃO SÃO DÍVIDA

Ficam listadas porque a próxima pessoa vai olhar o CSV, ver `DIFERENTE`, e
querer "consertar" — e consertar algumas destas seria desfazer decisão dela ou
reintroduzir defeito que a interface nova curou.

### 8.1 — decisão dela (37)

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

## 9. UM FATO QUE CAIU HOJE, e ele estava no enunciado desta triagem

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

*"Pode fazer isso agora, pra termos os 100%?"* — **não em um gesto, e o motivo
não é volume: é que 74 das 180 linhas de fila são tela, e tela é dela.** O que
posso fazer sem perguntar nada são as 43 do `LIGAR` e as 57 do `MOTOR`; as 6 do
`PUBLICAR` esperam uma palavra; as 74 do `DESENHO` esperam sete conversas
curtas — uma por aba.

A ordem que eu proporia, e cada degrau é uma leva:

1. **as 18 da 01-jogar e as 16 da 08-conexoes** (balde `LIGAR`) — duas abas
   quase fechando com trabalho mecânico e nenhuma decisão;
2. **os seis defeitos da §3** — porque perdem trabalho dela em silêncio;
3. **as 6 do `PUBLICAR`** — uma palavra dela;
4. **as 74 do `DESENHO`**, aba por aba, no formato que ela já pediu para o
   `mockup/TODO-DELA.md`: um ponto por vez, o próximo depois do OK dela;
5. **as 57 do `MOTOR`** restantes.
