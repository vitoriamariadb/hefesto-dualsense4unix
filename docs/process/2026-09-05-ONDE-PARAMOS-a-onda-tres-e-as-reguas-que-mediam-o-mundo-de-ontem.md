# ONDE PARAMOS — 05/09/2026

> A onda 3 fechou as três abas que faltavam da Fase 2 do perfil por controle e
> curou a fita que mentia em sete abas. Ela também deixou **24 testes
> vermelhos** — e as quatro famílias têm a mesma assinatura: *a régua mede o
> mundo de ontem.*

## O estado

| | |
| --- | --- |
| árvore dela | `/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix`, branch `dev` |
| portões | **42 verdes** (`bash scripts/portoes.sh`, ~4 min) |
| suíte | **17.856 verdes**, doze lotes, zero vermelho |
| `install.sh` | **`rc=0`**, doctor sem nenhuma FALHA (5 avisos de ambiente) |
| commits do dia | 47 |

## 1. A ONDA 3, em quatro frentes

| frente | o que fechou |
| --- | --- |
| aba 02 | o SOM de cada controle (mudo do mic, ganho, mudo do alto-falante, volume, rota) passa a viver no perfil, no clique |
| aba 03 | o efeito do gatilho vai ao perfil — **e só o lado que ela tocou**: clicar `Rígido` no L2 não grava um `Off` explícito no R2 |
| aba 06 | mouse e teclado emulado gravam no clique, e a tela para de PROMETER por-controle o que é global |
| a fita | o `inerte` perdido em sete abas, e o chip que não clicava em nenhuma |

A frente da aba 02 derrubou **três desenhos próprios medindo**, e o melhor
deles é o mesmo defeito das quinze queixas: a primeira versão preenchia o
volume do alto-falante com a leitura VIVA sempre, e o clique na rota devolvia o
perfil de 62 para os 100 do tique. **O tique não corrige o que ela escolheu.**

## 2. AS VINTE E QUATRO VERMELHAS, e a assinatura das quatro famílias

**A tag do chip mudou e dezoito réguas digitavam a antiga.** O chip virou
`<label>` para PODER SER CLICADO, e dezoito asserções em oito arquivos casavam
`<span class="chip`. A tag ganhou dono (`monta.TAG_DO_CHIP`).

Duas réguas foram DEVOLVIDAS na primeira tentativa, e as duas ensinam:
`test_aba03_*` fala de um `<span class="chip">` que **não é o da fita** (é o
cabeçalho do controle), e `test_a_fita_diz_o_que_a_aba_faz` já nascera com
`<label>` — trocar ali teria INVERTIDO a asserção. *Substituição em massa sobre
uma régua é edição cega; cada uma tem de ser lida.*

**A guarda nova parava a bancada junto com o typo.** `monta.a_fita_escolhe`
nasceu hoje parando toda página fora das dez — e matou na coleta oito testes que
geram página própria. A regra que separa as duas é o NÚMERO: `03-gatihos` tem o
prefixo de uma das dez e é typo; `98-prova-da-ressalva` não tem, e é bancada.

**TRÊS DUBLÊS ERAM MAIS FROUXOS QUE O REAL** — a família que esta casa já pagou
quatro vezes:

| dublê | o que faltava | o que escondia |
| --- | --- | --- |
| `test_os_botoes_tem_dono.FALSO` | `audio` e `speaker` VAZIOS | o daemon vivo publica os dois cheios; sem volume o gesto `rota` recusava com razão |
| três réguas sem perfil no disco | nenhum `regua.json` | o gesto lia o perfil ativo e não achava — o vermelho era da FIXTURE |
| `PROVAS` da aba 03 | sem a segunda metade do ato | o gatilho que chega ao aparelho agora vai também ao perfil, e a régua não cobrava |

## 3. A FRASE QUE DIZIA "AGORA" E NOMEAVA O JOGO DE ONTEM

O retrato das abas de hoje às 05:11 publicou, no cartão da aba Sistema:

    Trocar de perfil ao abrir o jogo: funcionando (na frente agora: pragmata.exe)

Sem um processo de Steam, Proton ou Wine vivo na máquina.

**A CAUSA ESTAVA ESCRITA UMA LINHA ACIMA DO DEFEITO.** O docstring de
`descrever_deteccao_de_janela` avisa que `window_detect_last_class` é STICKY —
guarda a última classe vista e nunca se apaga — e o corpo recuava justamente
para ele quando a classe de AGORA vinha `unknown`.

É a terceira vez em três dias que a mesma forma aparece: **aviso ao lado do
defeito não cura nada.** As duas telas foram curadas no mesmo commit, porque o
docstring da aba nova dizia seguir *"a MESMA regra da GTK"*.

## 4. A CURA QUE MEDIU E RECUOU

A fita da aba 06 perdia, no primeiro tique, o `title` PRÓPRIO dela e o
`data-campo="fita-chips"`. A primeira versão da cura devolveu os DOIS. Medido
com o daemon vivo:

| | tiques | pinturas |
| --- | --- | --- |
| antes | 80 | 2 |
| com o endereço de volta (06) | 80 | **80** |
| com o endereço de volta (09) | 43 | **43** |

A fita trocando dez vezes por segundo com a mesa parada. A causa: o endereço
tem um SEGUNDO dono — `a06_navegacao.chips_da_fita` e
`a09_sistema._html_da_fita` escrevem `fita-chips` pelo laço de campos, com chips
diferentes dos de `monta.fita()`. Revivê-lo põe os dois a escrever o mesmo
elemento, e cada um desfaz o outro no tique seguinte.

**Metade da cura entrou (o título) e metade recuou (o endereço), com a medição
escrita no docstring de `casca_da_fita`** — em vez de descoberta de novo pela
próxima pessoa.

## 5. O QUE FICA ABERTO

1. **O olho dela.** As frases novas de recusa da aba 02
   (`SOM_SEM_ENDERECO`, `SOM_SEM_VOLUME_PARA_GUARDAR`) e a ressalva da aba 06
   nunca foram lidas por ela. PROVA-DE-TELA-01.
2. **O clique no aparelho.** Os cinco gestos de som da aba 02 tocam o DualSense
   dela (`mic.canal.set`, `speaker.set`, `pactl set-default-sink`); a prova que
   os clica grava no perfil dela e ficou de fora. Com a mesa livre:
   `.venv/bin/python src/hefesto_dualsense4unix/interface/hefesto_vivo.py --oculta --abre 02 --prova-clique "mudo,volume,rota"`.
3. **Duas frentes discordam sobre a mesma pergunta.** Quando o aparelho recebeu
   e o perfil NÃO guardou: a aba 02 fala (*"o ajuste chegou ao controle, mas não
   consegui ler o perfil"*), a aba 03 cala. As duas têm razão escrita. **É
   decisão de produto e ainda não foi tomada.**
4. **O endereço morto da fita** nas abas 06 e 09 — ver a §4.
5. **A `07-lancadores`** era o único desvio de forma nos chips e foi curada;
   os quatro ponteiros para o parâmetro morto `fita_viva=False` passaram a citar
   `monta.ABAS_QUE_ESCOLHEM`.

## 6. O OITAVO INSTRUMENTO FALSO, e ele acusava o inocente

Oito ERROS no lote-00 da suíte, sempre nos mesmos casos, com a frase *"o WebKit
não respondeu em 30 s"* e o `saiu` VAZIO. **O laço não estourou — ele foi
MORTO.** Sete testes de GUI armavam `GLib.timeout_add(20000, Gtk.main_quit)` e
nunca o removiam; o disparo pendente caía DENTRO do `Gtk.main()` do teste
seguinte do mesmo processo.

A cura já existia em CINCO arquivos irmãos, com o comentário que a explica —
*"Um `timeout_add` pendente depois da fixture dispara DENTRO do laço do PRÓXIMO
teste de GUI do mesmo processo. Já matou onze medições."* Nos outros sete
faltava. Medido: duas voltas em três reprovavam antes; três em três passam
depois.

**E SÓ APARECE EM ORDEM ALEATÓRIA.** Rodando o arquivo sozinho, sempre verde —
por isso a primeira leitura culpou uma execução concorrente, e estava errada.

## 7. O INSTALL

`./install.sh --yes` da árvore DELA (`dev`, limpa), **`rc=0`**, 79 mudanças
planejadas e 26 com root. O `doctor` final: *"tudo OK"*, nenhuma FALHA, cinco
avisos — todos de ambiente e anteriores (histórico de storm USB, erros
acumulados do rádio BT, o exame da mesa, a autoridade de exibição desconhecida,
e o hide cobrindo só o hidraw com nenhum jogo aberto).

O daemon reiniciou e voltou: um controle no cabo, perfil `Personalizado`.
Os lançadores apontam para a árvore dela.

## A regra que este dia deixa

> **Régua que passa sobre um dublê mais frouxo que o real não mede o produto —
> mede o dublê.** Quatro das vinte e quatro vermelhas de hoje eram régua
> medindo o mundo de ontem, e as três piores foram as que passavam por isso.
