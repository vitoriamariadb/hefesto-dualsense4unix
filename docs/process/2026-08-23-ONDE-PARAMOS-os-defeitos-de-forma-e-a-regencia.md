# ONDE PARAMOS — os defeitos de forma, e como reger o resto

- **Escrito em:** 23/08/2026, ao fim do dia, na branch `dev`.
- **O que esta página é:** a **porta de entrada**. Ela sucede o
  [2026-08-22-ONDE-PARAMOS](2026-08-22-ONDE-PARAMOS-a-aba-que-nasceu-e-as-quatro-reguas-que-mentiam.md),
  que continua valendo para o que mediu.
- **Por que ela existe:** ela pediu para dar `/clear` e seguir com a medição de
  Bluetooth enquanto agentes executam as sprints. **Tudo o que não estiver aqui
  se perde nesse gesto.** Esta página é o que sobrevive.
- **Grau:** compilação. Cada medição traz o comando ao lado. O que não foi
  medido está dito como não medido.

---

## 1. O ACHADO DO DIA, e ele muda a ordem de tudo

Treze batedores mediram as onze abas da GUI em paralelo. A conclusão:

> **O produto não tem onze problemas de aba. Tem um punhado de defeitos de
> FORMA que aparecem onze vezes — e por isso consertar aba por aba seria pagar
> N vezes o mesmo preço.**

> **A CONTAGEM NÃO MORA AQUI, e isso é conserto de 24/08/2026.** Esta página
> numerava os defeitos de **P1 a P12** e dizia "DOZE"; a §0.1 do
> [SPRINT_ORDER](SPRINT_ORDER.md) — mais nova e mais medida — numerava os
> **mesmos** defeitos de **F1 a F11** e dizia "dez". **Duas numerações do mesmo
> produto obrigam a próxima pessoa a escolher entre elas**, e a escolha errada
> aponta um agente para o defeito errado: a Z4 chegou a escrever `F5/P5` no
> cabeçalho, e F5 e P5 eram defeitos DIFERENTES.
>
> Sobreviveu o **F**, porque é o que a fila executável usa (§0.2 e §0.3) e o que
> as oito sprints da Onda 0 citam. As seções abaixo foram **renomeadas** para o
> F correspondente; a tabela de correspondência e a razão estão na
> **§0.1 do SPRINT_ORDER**, que passou a ser a **dona única da lista e da
> contagem**. Nenhuma medição foi apagada: os três defeitos que só esta página
> tinha (o perfil, o pulso, a foto) e o quarto (verde que não protege) viraram
> **F12, F13, F14 e F15** lá.

É a lei que ela mesma formulou, aplicada ao código: *achar a causa raiz apaga N
gambiarras*. A história dela do storm — em que a descoberta de que o kernel AMD
não lida com áudio num único USB apagou milhares de tentativas — é o precedente.

### F1 — "aplicado" é uma palavra sem prova, em seis abas

`_call_checked`/`_safe_call` (`app/ipc_bridge.py`) terminam em `return True,
None`: **a ponte joga fora a resposta do daemon.** O daemon JÁ calcula a verdade
e ela morre no socket. Casos nomeados: `aplicado_em`/`guardado_em` (Gatilhos);
o campo de acerto do microfone (`ipc_handlers.py:4533` produz, `ipc_bridge.py:800`
descarta); a recusa do gate R-04 (o rodapé comemora troca RECUSADA); a recusa do
Modo Nativo; o `errors: 1 if status=="erro"` do Proton, que faz o botão anunciar
"já estão travados" depois de recusar.

**Não são seis defeitos: é um contrato de resposta que não existe.**

### F2 — a cura escrita e nunca ligada, em forma de censo

O daemon publica no `state_full` e nenhuma superfície lê: `mascara_divergente`
(medido em 18→19/08; três abas deveriam ler, zero leem), `bateria_no_jogo`,
`jack`, o bloco `coop` inteiro, `osk_instalado`, `controles_sem_driver`,
`native_bt_fragil` (só a Início lê), e a bandeira de trava manual do autoswitch,
que nem sai do daemon.

E o inverso: **`prontuario_dos_jogos.py`, 1037 linhas**, responde exatamente à
pergunta que a aba Sistema faz a cada clique, e **não tem um chamador**. Mais
`_home_flavor_pedido`, que nunca é escrito — e por isso a Início acusa *"você
escolheu"* sobre gesto que ninguém deu.

### F3 — o alvo tem um escritor e sete leitores

`_edit_target_uniq` nasce só em `status_actions._sync_edit_target`, no tique de
2 Hz da aba Status, **que sai cedo enquanto qualquer popup de combo estiver
aberto em QUALQUER aba**. Leem por `getattr(..., None)`: Lightbar, Gatilhos,
Rumble, Configurações, o escritor do perfil e os textos do rodapé.

**Se a Status não montar, quatro abas caem em edição GLOBAL em silêncio** — a
pessoa edita a mesa inteira achando que edita um controle.

### F4 — grava na peça, manda na mesa

Um clique em "Economia" grava 30% no Controle 2 no perfil e **manda o comando
para os quatro**. E o inverso, pior: **alvo que sai da mesa vira broadcast**
(`core/backend_pydualsense.py`) — o Controle 2 desliga, ela clica "Testar", e os
outros três vibram na mão dos outros jogadores.

É co-op, com gente segurando os controles. É o mais grave pela lente do uso.

### F12 — o perfil não guarda tudo, e cada aba tem seu buraco

A decisão dela de 18/08 não foi executada. Faltam: touch, giroscópio e
acelerômetro (Status); o liga/desliga do teclado, que mora em flag global
enquanto o mouse ao lado é por jogo (Navegação); microfone, Steam Input e
teclado (Emulação); o preset de gatilho (Gatilhos); os sete gestos da Sistema.
E o inverso: o campo `coop` do schema é aceito, logado e **ignorado**.

### F13 — só duas abas têm pulso

Início e Status se atualizam sozinhas. As outras nove dependem do gancho de
entrada na aba, **e vários faltam**. A lista de perfis não relê o disco; o
rótulo do mouse virtual nunca é relido — nem quando ela volta da aba Sistema,
que é onde a própria frase manda ir. E o laço do switch-page chama `fn()` **sem
`try`/`except`**: uma exceção deixa a aba desenhando o passado, calada.

> **Uma instância deste defeito foi CURADA hoje** e serve de molde:
> `_refresh_config_controles` estava pendurado e ausente do mapa que o chamaria.
> Conserto de **uma linha** em `app/app.py`, com prova de ponta na bancada
> (daemon parado → 97 rótulos; religado e reentrada → 139, com os dois DualSense
> reais). O portão que impede a volta é
> `test_config_01_a_aba_nasce_vazia.py::test_os_tres_refreshers_da_aba_estao_no_mapa`.

### F6 e F7 — a raiz dos pares, e o vazio que parece bom

**F6 — três réguas do MESMO daemon discordam sobre quem está na mesa.** Medido em
23/08 às 20h45, com ZERO DualSense no sistema: `daemon.status` diz
`connected:true, bt, 75%`; o topo do `state_full` diz o mesmo; `controllers[0]`
diz `connected:false`; e `controller.list` concorda com o último. **Duas fontes
distintas no MESMO payload**, ambas estagnadas no último estado bom. É a raiz do
F5, e é por isso que **nenhuma aba pode ser consertada antes dela** — toda aba lê
a mesa.

**F7 — o estado vazio é indistinguível do estado bom, em seis abas.** Gatilhos
com a mesa vazia é IDÊNTICA à mesa cheia (38 botões clicáveis). Rumble mostra
verde *"o JOGO controla a vibração"*. Emulação pinta *"Microfone: Ligado"* com
zero placa de áudio. Início AFIRMA *"Nenhum controle conectado"* com dois acesos
na frente dela. **É o que quebra a 0.999 para quem não é ela:** quem instala e
abre antes de ligar o controle vê um produto que se declara são.

> Um caso do F7 já FECHOU: a aba Configurações dizia "Folgada" em verde com o
> daemon desligado, e hoje diz "Não sei", com três estados (commit `0fd0a33`).
> Serve de molde para os outros cinco.

### F8 — o ambiente presumido tem sempre a mesma forma

`storm_doctor` ignora `XDG_CONFIG_HOME` (o cartão lê um arquivo, o botão escreve
outro). A **Steam só é procurada em `~/.steam/steam`** — Flatpak, Snap e
`~/.local/share/Steam` são os três layouts mais comuns fora desta bancada, e nos
três a aba diz "Steam não encontrado". O **teclado na tela só conhece `onboard`
e `wvkbd`**, e como nenhum atalho de fábrica digita letra, quem não tem os dois
fica **sem caminho para escrever**. systemd de usuário presumido pela Início,
que em caso de falha manda "tente pela aba Sistema" — que usa o mesmo mecanismo.

**Funciona na casa dela porque a casa dela é a exceção nos cinco casos.** Este é
o defeito que mais separa o produto da 0.999 liberável.

### F11 — o léxico é um trabalho só, não onze

"Microfone" nomeia três coisas em três abas e nenhuma diz de qual não fala. Dois
botões "Silenciar" idênticos a 60 px um do outro no mesmo card. "Vibração
leve/forte" lê como escala e são dois MOTORES — escolhe-se um lado sem saber.
E frases que a medição já derrubou seguem na tela: o enquadramento de Steam
Input que ela matou em 09/08 está sendo pintado agora.

### F9 e F10 — o portão do specs é cego à tela, e o elo não existe

`scripts/check_paridade_transporte.py` cruza CSV × testes × `specs.html` e **não
olha uma linha de `main.glade` nem de `app/`**. Toda divergência entre o que a
tela promete e o que o mapa sustenta passa por ele sorrindo.

O mapa também tem buracos de censo: nada da aba Sistema, nada da intensidade de
vibração (o card mais visível da Rumble), nada do teclado emulado, nada da
MÁSCARA (o gesto mais consequente da Início).

### F14 — a foto mente para a documentação

**Cinco abas fotografavam o glade cru**, e o README publicava isso: a Emulação
afirmava *"Device: Microsoft X-Box 360 pad"* — mentira que o código já parou de
contar; a Navegação, jargão que a aba abandonou; a Sistema, três "consultando…";
a Rumble nunca fotografou metade dos seus avisos, **logo eles nunca passaram
pelo olho dela**.

> **CURADO PELA METADE, em 23/08/2026.** Os cinco hosts existem agora —
> `_montar_aba_lightbar`, `_rumble`, `_sistema`, `_emulacao` e `_navegacao`
> (`scripts/gui-captura/retratar_abas.py:1410-1737`, chamados a partir de
> `:2201`), +486 linhas escritas hoje.
>
> **Fato errado, SUBSTITUÍDO em 24/08/2026.** Este trecho dizia *"mas eles
> nunca rodaram"*, com base na diferença de mtime entre o script e as fotos.
> **Eles rodaram:** `git show --stat 3de95ff` traz **sete PNGs** no mesmo commit
> dos hosts, e `docs/usage/assets/PROVA-DA-FOTO.txt` carimba
> `ensaio: 2026-08-23 21:12`. O mtime maior do script é edição **posterior** ao
> ensaio. A régua era falsa, e a afirmação forte que ela sustentava mandaria
> alguém refazer trabalho já pago.
>
> **O que sobrou do F14, e é o que a Z0 fecha:** o instrumento foi curado e a
> **régua que o vigia** não — `CODIGO_DA_TELA`
> (`tests/unit/test_as_fotos_acompanham_a_versao.py:72-75`) cobre `app/` e
> `gui/` e **não** `scripts/gui-captura/`, então mexer no retrato não torna foto
> nenhuma suspeita. Detalhe e mordida na
> [Z0](sprints/2026-08-24-ONDA0-Z0-A-REGUA-E-A-FOTO-01-cinco-abas-publicam-o-xml-cru.md).

**Custo composto, e ele já se realizou:** o próximo agente lê a foto errada e
planeja a aba que não existe. Aconteceu hoje — a ordem de abas passada a treze
batedores estava errada, e três deles corrigiram.

### F15 — verde que não protege

O padrão é sempre o mesmo: a função pura tem oito testes e o fio que a chama não
tem nenhum. Sete arquivos medem um card que a aba não constrói desde 02/08.
**Nenhum teste abre um perfil real pela porta da janela** — e é por isso que dois
perfis dela não abrem há semanas com a suíte verde.

### F5 — os pares que disputam o mesmo estado

- **Status ↔ No jogo:** moram no MESMO arquivo de 2917 linhas e importam o mesmo
  widget. **Não podem ser duas ondas paralelas** — é colisão garantida.
- **Início ↔ Emulação:** a máscara tem CINCO donos; a Início MARCA e a Emulação
  APLICA, e o "Aplicar" do rodapé desfaz o clique da Emulação em silêncio.
- **Início ↔ Sistema:** o mesmo gesto de ligar/desligar com dois contratos.

---

## 2. A CORREÇÃO QUE CUSTOU CARO — a ordem das abas

**A ordem real da tira**, conferida no `main.glade` pelos `<child type="tab">` e
na foto de hoje:

    Início · Status · No jogo · Gatilhos · Lightbar · Rumble · Perfis ·
    Sistema · Emulação · Navegação · Configurações

**"No jogo" é a 3ª, não a 10ª. "Navegação" é a 10ª, não a 9ª.** Três batedores
independentes acharam isso contra um briefing errado. Ondas numeradas pela
ordem errada apontariam para a aba errada duas vezes.

---

## 3. O QUE FOI ENTREGUE EM 23/08, e está na árvore

### A cura mais grave do dia, e ela era PERDA DE DADO DELA

**Um pixel de arrasto no brilho da Lightbar, com a mesa vazia, apagava os
overrides por controle do perfil inteiro** — e a tela dizia *"Cor enviada ao
controle"*, no singular, com zero controles conectados. Nenhum toast, nenhuma
recusa.

A causa: o alvo de edição morava num atributo com default de classe, lido por
**nove pontos** da janela, e o `None` dele carregava **duas coisas diferentes** —
*"ela clicou em Todos"* (escolha legítima) e *"eu não sei quem é o alvo"*
(ausência de informação). O segundo caía silenciosamente no primeiro.

Curado por `src/hefesto_dualsense4unix/app/alvo_de_edicao.py`, módulo novo e
**dono único** do alvo, que separa os dois estados. É a regra da casa aplicada
literalmente: *ausência de informação se declara, nunca vira ação padrão
silenciosa*. Os nove leitores continuam lendo o atributo antigo, espelhado —
migrá-los é de outra leva, porque quatro daquelas abas estão com outras frentes.

### Curas com prova
| o quê | prova |
|---|---|
| `_refresh_config_controles` ligado | bancada: 97 → 139 rótulos, com os dois DualSense reais |
| Portão `a-casa-sabe` verde | estava VERMELHO desde `9bf54b7`, bloqueando qualquer commit |
| A frase que engordava o cabeçalho, removida | pedido dela; teste novo mordeu |
| Regressão de i18n | `mixin.py` saiu do piso, com prova de zero textos de tela |

### A medição de rádio que fechou um item de sprint
**A cor do plástico por rádio NÃO funciona, e a causa é o firmware.** Captura
`btmon` do canal de controle: o `SET_REPORT` sai inteiro (TX 65 bytes no L2CAP) e
o **controle** responde `HANDSHAKE 0x04` (`ERR_INVALID_PARAMETER`) em ~5 ms, nos
dois aparelhos, com e sem CRC. Não é o BlueZ, não é o uhid, não é o kernel. A
régua foi validada antes: `GET_FEATURE 0x20` no mesmo canal responde em ~6 ms com
três âncoras batendo.

**A hipótese de 15/08 virou medida, e o fato errado saiu de oito arquivos.**

### Instrumentos novos
- `scripts/gerar-painel.py` → `painel.html`: estado do projeto, autocontido, sem
  rede. **80 ms.** Separa RÁPIDO (roda sempre) de CARO (cache com carimbo de
  idade). Ausência de medição é declarada, nunca preenchida com zero.
- `scripts/paleta_da_casa.py`: a paleta com **dono único**, dividida com o
  `specs.html`. Provado: o `--check` do `gerar-mapa.py` não acusou um byte.
- `scripts/hooks/pre-commit` + `scripts/instalar-hooks.sh`: **166 ms**, regenera
  o painel e **bloqueia** se o `specs.html` divergir do CSV. Mordida provada.

### O grafo de código
Reconstruído (estava 13 dias velho, de outra branch): **24.684 nós, 177.860
arestas, 1.033 arquivos**. **Mas a régua reprovou para uso como portão:** o
`dead-code` NÃO achou nenhuma das três funções que eu provei sem chamador à mão,
e **508 dos 916 achados dele são `struct` de C dos drivers**. Ele não substitui o
`portao_a_casa_sabe_e_o_produto_nao_faz`. `impact`, `query` e `wiki` seguem por
avaliar.

---

## 4. AS SPRINTS EM DISCO

Seis, em `docs/process/sprints/2026-08-24-*`, somando **3.716 linhas**, com 23 a
35 âncoras `arquivo:linha` e 14 a 24 mordidas cada. São executáveis por agente
sem contexto.

**Exceção medida:** `NO-JOGO-SEM-FALSO-VERDE-01` tem **zero** âncoras
`arquivo:linha`. Precisa de uma passagem antes de ser entregue a um executor.

---

## 5. AS TRÊS DECISÕES DE PROCESSO DELA (23/08)

**D1 — ordem das ondas: transversal primeiro.** Onda 0 = as invariantes (perfil
guarda tudo; 4 controles; co-op sempre; comunhão com o specs; vício de bancada).
Ondas 1..11 = uma por aba, JÁ sob essas regras. Onda 12 = as sprints abertas,
redistribuídas. **O motivo:** as invariantes MUDAM o que cada aba tem de fazer;
arrumar layout antes de saber se a feature vale POR CONTROLE é retrabalho.

**D2 — Bluetooth é trilha dela.** O plano NÃO planeja o mapeamento de BT. Mas
cada sprint declara **qual pergunta de BT a bloqueia**.

**D3 — prova de tela, com a classe cosmética pré-aprovada.**
- **Sem o olho dela antes:** alinhamento, espaçamento, altura/largura de botão,
  quebra de linha, tornar dica visível, cor de estado já decidida.
- **Com o olho dela ANTES:** texto novo ou reescrito, ordem das seções, o que
  nasce visível, qualquer coisa que mude o que se vê ao abrir.

---

## 6. COMO REGER DEPOIS DO `/clear` — as quatro regras

Ela vai medir Bluetooth enquanto agentes executam sprints. **Isso só funciona
com estas quatro regras, e cada uma nasceu de um defeito real desta casa.**

### R1 — posse de arquivo, sempre
Cada agente é dono exclusivo de um conjunto de arquivos, escrito no prompt dele.
Agente que edita arquivo alheio **desfaz o trabalho do vizinho em silêncio**.
Quando o conserto pede arquivo alheio, o agente **relata em vez de editar**.

### R2 — a suíte inteira é do maestro, nunca do agente
`pytest` sem alvo cria **nós uinput de verdade** — 1.289 num dia derrubaram o
fullscreen dela. Com N agentes em paralelo, isso multiplica. Agente roda só o
próprio escopo; a suíte inteira roda uma vez, no fim, por quem coordena.

### R3 — a bancada é dela durante a medição
Os agentes usam daemon e controles. A medição de BT também. **Enquanto ela mede,
nenhum agente pode parar o daemon nem escrever no aparelho.** Um agente que
precise disso espera, e diz que está esperando.

### R4 — foto e portão no fim, não no meio
`retratar_abas.py` reescreve as onze fotos de uma vez. Nenhum agente o roda;
quem coordena fotografa depois que a leva fecha.

---

## 7. O QUE ESTÁ ABERTO, e de quem é

### Dela
1. **A redação do que os agentes deixaram provisório** (classe estrutural):
   os três botões do diálogo de fechamento, a marca de pendência do rodapé, a
   frase de sucesso do "Aplicar".
2. **O dono da costura do apelido de BlueZ.** `costurar_a_mesa` está pronto e
   deliberadamente sem chamador: ligá-lo **recria** a duplicidade que o commit
   `e5376a0` desfez. Ou o produto assume e o script para, ou o script continua
   dono. Enquanto não decidir, dar chamador é regressão.
3. **A altura da aba Configurações.** 2116 px para 909 px de página; colapsar as
   duas maiores seções resolve, **mas muda o que se vê ao abrir**.
4. **A ordem das cinco seções** da aba Configurações.
5. **O "não sei" do Jogador** — o daemon PERMUTA em vez de fixar, e recusa
   número zero: não existe "desafixado" para onde voltar. Ou verbo IPC novo, ou
   reescrever a dica que promete um estado inalcançável.

### Do produto
- Os defeitos de forma acima, na ordem da §1 — a lista completa e a
  contagem são da §0.1 do [SPRINT_ORDER](SPRINT_ORDER.md).
- A `NO-JOGO-SEM-FALSO-VERDE-01` sem âncoras.
- 11 curas da aba Configurações arrancáveis sem nada ficar vermelho.
- 24 de 27 dicas invisíveis por falta de afordância.
- `validar-palavra-de-tela.py` é **cego** a abas montadas em Python — lê só o
  `main.glade`.
