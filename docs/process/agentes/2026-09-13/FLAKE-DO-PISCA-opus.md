# FLAKE-DO-PISCA — opus, 13/09/2026

Branch `voo/FLAKE-DO-PISCA-opus`, nascida de `dev` em `4b3b6879`. Posse: um
arquivo, `tests/unit/test_o_recado_de_sucesso_pousa_no_cartao.py`. `src/` não
foi tocado; as sabotagens das mordidas moraram em cópias da régua fora da
árvore.

## O que mudou

**A régua deixou de medir por relógio.** Os marcos de `GLib.timeout_add` de
tempo fixo (700 ms, 2200 ms, `VENCE_EM_S + 400`, …) viraram esperas por
condição (`esperar`). Cada espera pergunta de novo só depois de a resposta
anterior voltar, e para num teto: `TETO_S` = 10 s, 30 s para a página de pé,
120 s para o roteiro inteiro. No teto o roteiro segue, e o marco vai para
`faltou` com a frase do que não chegou; `_leitura` transforma isso na reprova da
régua daquele marco, no lugar de um `KeyError` mudo.

**Estado de passagem se fotografa, não se pergunta.** O voo e a piscada duram
segundos, e uma pergunta avulsa só os pega dentro da janela deles — sob carga
ela chega fora. Um `MutationObserver` instalado na página (`_VIGIA`) tira uma
foto do DOM no microtask em que o [mic] muda, com `performance.now()`. As duas
condições:

- `_pouso` — o carimbo `data-hef-voo` saiu depois de entrar. Sai no mesmo passo
  que a classe `hef-em-voo`; ler o carimbo e não a classe foi decidido pela
  mordida C, abaixo.
- `_apagou` — a piscada do pouso apagou, com a duração no relógio da página.

**A leitura "no meio do voo" mora dentro do gesto lento.** O gesto só volta
depois de a leitura voltar, e o pouso só é agendado quando o gesto volta: a
foto é durante o voo por construção, não por relógio.

**O `fim()` passou para a resposta da última leitura.** Antes ele era agendado
500 ms depois de a pergunta SAIR, e sob carga podia fechar o laço antes de a
leitura voltar.

**Três réguas ganharam ou recuperaram dente:**

- `test_o_recibo_vence_e_some` **passava sobre o vazio desde 05/09**: lia o
  cartão depois do sucesso calado, que não deposita frase. Na versão de `dev`,
  com `SEGUNDOS_DO_RECADO_DE_SUCESSO = 600.0`, deu `19 passed`. Agora ela lê
  depois da frase do dono, espera a frase sair, e exige que a frase tenha estado
  lá.
- `test_a_piscada_apaga_sozinha` confere a duração no relógio da página, entre
  `MS_DA_PISCADA − 100` e `MS_DA_PISCADA + 1500`.
- `test_o_sucesso_calado_pisca_e_nao_fala` confere o DOM sem frase também quando
  a piscada apaga, 1,5 s de repintura depois do pouso.

**E uma espera que o relógio escondia:** antes do clique da recusa, o [mic] tem de
estar em repouso. Sem frase no cartão, a espera anterior terminaria na hora e a
recusa pousaria com a piscada do clique 2 ainda acesa (mordida F).

Sem carga a régua fecha em ~10 s; a versão de `dev` levava ~18 s.

## Qual mordida prova

### A do tempo — §4.3 da sprint

"Arrancar a espera por condição" é a versão de `dev` (`4b3b6879`), rodada
intercalada com a curada, uma volta cada, sob `stress-ng --cpu 64` em 16
núcleos, cada volta com a carga própria:

| rodada | velha (tempo fixo) | curada |
| --- | ---: | ---: |
| calibração, só a velha | 2 reprovas em 4 | — |
| 6 pares, primeira versão da cura | 1 em 6 | 0 em 6 |
| 6 pares, só a velha valeu (a curada caiu num defeito do meu instrumento: `IndentationError` na cópia) | 0 em 6 | — |
| 4 pares, versão final | 1 em 4 | 0 em 4 |
| 3 pares, régua e carga presas a 2 núcleos (`taskset`, `--cpu 8`) | 0 em 3 | 0 em 3 |

A velha reprova sempre nas mesmas três, com a assinatura da sprint:

    FAILED test_o_sucesso_calado_pisca_e_nao_fala
      o gesto deu certo e o campo não piscou … {'classes': 'mudo-i hef-em-voo', 'em_voo': True, 'deu_certo': False, …}
    FAILED test_a_piscada_apaga_sozinha
      a piscada não apagou sozinha em 1500 ms: {'classes': 'mudo-i hef-deu-certo', …}
    FAILED test_o_pisca_nao_move_a_tela
      a foto do 'durante' não pegou a piscada acesa

A carga reprova por sorteio. **A prova determinística** é o mecanismo da sprint
sem carga nenhuma: o dublê do `mic_canal_set_detalhado` passa a demorar 1,6 s.

    lento-original  rc=1 | 3 failed, 16 passed   (as mesmas três, a mesma assinatura)
    lento-curada    rc=0 | 19 passed

Sob `--cpu 64`, na versão final, o primeiro pouso levou até 1,87 s (até 2,61 s
na primeira versão), contra a janela velha de 700 ms; a piscada durou de 1500 a
1579 ms no relógio da página.

### As do produto — cada sabotagem reprova a sua régua

Numa cópia da régua curada, uma linha de sabotagem logo depois dos dublês, sem
carga, com `src/` intocado. Sem sabotagem: `19 passed`.

| sabotagem | reprova |
| --- | --- |
| A — `_pousou` sempre com `certo=False` (o pouso nunca pisca) | `test_o_sucesso_calado_pisca_e_nao_fala`, `test_a_piscada_apaga_sozinha`, `test_o_pisca_nao_move_a_tela` |
| B — some a retirada agendada da `hef-deu-certo` (piscada eterna) | `test_a_piscada_apaga_sozinha`; por herança `test_a_piscada_nao_acende_na_recusa` e `test_o_recibo_vence_e_some` — com a piscada acesa para sempre o [mic] nunca volta a repouso, e a tela está de fato verde na recusa |
| C — some o `classList.add('hef-em-voo')` do `em_voo()` | só `test_o_botao_diz_que_esta_trabalhando` |
| D — `SEGUNDOS_DO_RECADO_DE_SUCESSO = 600.0` | só `test_o_recibo_vence_e_some` (na versão de `dev`: `19 passed`) |
| F — `_deu_certo` no lugar de `_deu_certo_dizendo` (a mordida do cabeçalho) | `test_a_frase_pousa_no_cartao_de_quem_foi_clicado`, `test_o_sucesso_e_verde_e_a_recusa_e_laranja`, `test_a_frase_do_dono_vence`, `test_o_recibo_vence_e_some` |

**Duas destas mordidas corrigiram a cura antes do commit.** Na primeira versão,
C derrubava DOZE réguas: o pouso lia a classe, então sem a classe nenhum marco
chegava, e as réguas de frase caíam sem ter nada com o voo. E F derrubava também
a da recusa, porque a espera por `depois-de-vencer` terminava na hora. As duas
curas estão descritas acima; a tabela é da versão final.

## O que NÃO verifiquei

- **A régua dentro do lote**, com os vizinhos de GUI no mesmo processo. O laço
  que reentra depois de um `main_quit` alheio ficou como estava, e não o
  exercitei. A suíte não é minha.
- **A carga da noite de 12/09** (Chrome + playwright de outra árvore) não foi
  reproduzida — usei `stress-ng`. A contraprova que não depende de carga é o
  gesto lento.
- **A folga da piscada sob a suíte.** `FOLGA_DA_PISCADA_MS = 1500` foi escolhida
  contra um excesso medido de até 79 ms sob `--cpu 64`; sob outra carga, não sei.
- **Aparelho e daemon**: a régua é de tela, com a ponte e o estado do daemon em
  dublê. Nenhuma célula de `docs/data/mapa-controles.csv` foi exercitada.
- **O `CANARIO-FS-01` acusou "a suíte ESCREVEU"** em três voltas: históricos de
  `avatar_legends_the_fighting_game` e de `future_knight`, e o
  `controller_masks.json`, no `~/.config` real. Atribuo ao produto vivo — havia
  um `hefesto-launch` do Steam no ar, o mesmo histórico recebeu escrita às 01:53,
  antes desta sessão, e a régua só grava o perfil `regua`, no lar de mentira.
  **Não provei por eliminação.** O rc=1 dessas voltas é do canário, com todos os
  testes verdes.
- **Os portões fecharam com `HEFESTO_SEM_CANARIO_FS=1`.** Numa rodada com o
  canário ligado, `mac-por-oui` e `casa-sabe` saíram rc=1 com `11 passed` e
  `42 passed`: o canário acusou escrita em `future_knight`, `pro_jank_footy`,
  `active_profile.txt` e `session.json`, a troca de jogo do produto vivo no mesmo
  minuto. O próprio canário manda desligá-lo quando o daemon roda ao lado. Na
  rodada anterior, com ele ligado, os dois passaram verdes.
- Não fotografei tela: nada visível do produto mudou, só a régua.

## O que sobrou para o próximo

- **O mesmo relógio fixo em réguas irmãs**, fora da minha posse:
  `tests/unit/test_a_aba_01_jogar_fecha_as_linhas.py` lê o verde aos 700 ms e o
  apagar em `da_piscada_ms + 500` (linhas 1165 a 1199) — a mesma forma que
  reprovou aqui. A busca também casou
  `tests/unit/test_o_piloto_tem_o_terceiro_lugar_e_a_quarta_porta.py` e
  `tests/unit/test_os_quatro_gestos_da_aba_sistema_que_faltavam.py`; não os li.
  O `_VIGIA`, o `_pouso` e o `esperar` desta régua servem de molde.
- **O recibo que some cedo demais passa.** A régua exige que a frase saia antes
  do teto, não que dure o prazo; o número só é conferido por
  `test_o_prazo_do_sucesso_e_menor_que_o_da_recusa`.
- **`(r,) = _r(…)` reprova com `ValueError` sem frase** quando o cartão está
  vazio (mordida F). Um ajudante com mensagem trocaria isso.
- **O canário lê escrita do produto vivo como escrita da suíte** e sai rc=1 com
  tudo verde — quem conta reprova por rc conta errado.
