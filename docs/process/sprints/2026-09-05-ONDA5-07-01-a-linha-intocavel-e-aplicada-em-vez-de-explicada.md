---
sprint: ONDA5-07-01
decisoes: [07-Q1, 07-Q4]
posse:
  L1:
    - src/hefesto_dualsense4unix/integrations/steam_launch_options.py
    - src/hefesto_dualsense4unix/integrations/sentinela_do_wrapper.py
    - src/hefesto_dualsense4unix/integrations/prontuario_dos_jogos.py
    - src/hefesto_dualsense4unix/interface/desenho_dos_lancadores.py
    - src/hefesto_dualsense4unix/interface/pacotes/a07_lancadores.py
    - tests/unit/test_steam_launch_options_vdf.py
    - tests/unit/test_sentinela_do_wrapper_01_a_steam_comeu_o_hefesto_launch.py
    - tests/unit/test_prontuario_01_o_disco_nao_sabe_dizer_que_funciona.py
    - tests/unit/test_ponte_steam_input_01_a_lista_que_so_preservava.py
    - tests/unit/test_a_aba_07_lancadores_fecha_as_linhas.py
nao_toca:
  - src/hefesto_dualsense4unix/interface/pacotes/rodape.py
  - src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py
  - src/hefesto_dualsense4unix/interface/pacotes/a10_perfis.py
  - src/hefesto_dualsense4unix/app/actions/home_actions.py
  - src/hefesto_dualsense4unix/app/actions/jogar/painel.py
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
depois_de: [DAEMON-ACORDADO-01, ONDA-SISTEMA-06, ONDA2-07-LANCADORES-01, ONDA4-S10-O-TRANSPORTE-01, ONDA5-10-02]
---

# ONDA5-07-01 · DEFEITO — a linha intocável é APLICADA, não explicada

> **A decisão dela, verbatim (07-Q1, 05/09/2026):**
> *"Deve aplicar automaticamente como era no gtk"*

Ela leu quatro opções sobre **como receber a linha para colar na Steam à mão** —
botão de copiar, linha à mostra, os dois, ou dentro do «Ver o que impede» — e
**recusou as quatro**. Nenhuma era a resposta porque a pergunta estava errada:
todas partiam de que o reparo manual é um fato do mundo.

**A regra que a resposta dela deixa, e ela é a mesma de 10-Q6:** *a máscara não
custa feature — o Hefesto não descreve a limitação, ele constrói o mecanismo que
a remove.* E a desta madrugada: **o Hefesto não explica a própria falha, ele a
conserta.**

**A trava que isto solta** (texto da fila): *"Fica parada a linha aberta «Copiar
a linha do wrapper para a área de transferência», e com ela a pergunta 2."*
Depois desta sprint a linha não fica parada — ela **morre**, porque não há mais
o que copiar à mão.

---

## 1. O QUE SE MEDIU — quem é a "linha intocável", exatamente

A Steam guarda **uma** linha de `LaunchOptions` por jogo. Numa era anterior o
produto escrevia ali um veneno cirúrgico:

```python
IGNORE_SIGNATURE = "SDL_GAMECONTROLLER_IGNORE_DEVICES=0x054c/0x0ce6"
```
— `src/hefesto_dualsense4unix/integrations/steam_launch_options.py:97`

Quando **ela** estendeu essa lista à mão para esconder um segundo aparelho, a
linha virou intocável para o produto inteiro:

```python
def has_extended_ignore(value: str) -> bool:
    return IGNORE_SIGNATURE in value and not _token_presente(value, IGNORE_SIGNATURE)
```
— `steam_launch_options.py:200-207`

E a partir daí, **três recusas em cadeia**, cada uma com endereço:

| onde | linha | o que faz |
| --- | --- | --- |
| `migrate_value` | `steam_launch_options.py:260-261` | `return value` — devolve a linha intacta |
| `apply_wrapper_vdf_text` | `steam_launch_options.py:600-601` | `skipped.append((appid, "ignore_estendido"))` |
| `Censo.reparaveis` | `sentinela_do_wrapper.py:207-209` | tira os intocáveis do que o reparo alcança |

O caso exato está congelado numa régua, com o motivo escrito:

```python
LINHA_ESTENDIDA = (
    "SDL_JOYSTICK_HIDAPI=0 "
    "SDL_GAMECONTROLLER_IGNORE_DEVICES=0x054c/0x0ce6,0x057e/0x2009 %command%"
)
```
— `tests/unit/test_steam_launch_options_vdf.py:100-103`

**O medo é legítimo e está medido:** remover só o nosso pedaço com a régua de
token completo (`_token_re`, `:160-168`) deixaria `,0x057e/0x2009` pendurado —
sem `=`, o `env(1)` tenta EXECUTAR aquilo, dá ENOENT, e **o jogo nunca mais
abre**. É o pior modo de falha que este repositório conhece.

E o preço disso chega na tela dela em três lugares, todos escritos:

* `sentinela_do_wrapper.py:423-428` — a frase termina em *"não vou tocar nelas
  … Reparo manual."*;
* `desenho_dos_lancadores.py:949` — o carimbo do cartão da Steam diz *"N jogos
  com a linha intocável — só reparo manual"*;
* `prontuario_dos_jogos.py:156-161` — o estorvo `LINHA_INTOCAVEL` nasce com
  `automatica=False` e a cura *"Só reparo manual: revise a linha na Steam"*.

---

## 2. POR QUE A RAZÃO DA RECUSA NÃO VENCE MAIS

O argumento escrito é verdadeiro sobre **um** jeito de mexer, e o produto o
tratou como verdadeiro sobre **todos**:

> *"remover só o nosso pedaço deixaria fragmento-comando (jogo não abre) e
> embrulhar manteria o veneno ativo por fora do wrapper"* —
> `steam_launch_options.py:255-258`

As duas metades caem quando o mecanismo para de tratar a atribuição como texto
e passa a tratá-la como **o que ela é**: uma atribuição de shell, um token só,
com uma lista separada por vírgula do lado direito.

1. **Não sobra fragmento** porque a atribuição sai inteira e volta inteira:
   `SDL_GAMECONTROLLER_IGNORE_DEVICES=0x054c/0x0ce6,0x057e/0x2009` vira
   `SDL_GAMECONTROLLER_IGNORE_DEVICES=0x057e/0x2009`. Nunca existe um instante
   em que a vírgula fique órfã.
2. **Não sobra veneno** porque o par que o wrapper repõe por conta própria é
   exatamente o que se subtrai. O que fica é o que **ela** escreveu, e o que ela
   escreveu vira argumento do `env(1)` dentro do wrapper — o mesmo destino que a
   função já dá a qualquer opção da usuária (`:252-254`).

**A subtração é o produto devolvendo o que é dele e devolvendo a ela o que é
dela.** É a diferença entre "não mexo na sua linha" e "tiro a minha sujeira de
dentro da sua linha".

---

## 3. O TRABALHO, EM PASSOS

### Passo 1 — a função que subtrai, com nome próprio

Em `steam_launch_options.py`, ao lado de `_remove_token` (`:175-192`), uma
função pura que recebe a `LaunchOptions` e devolve a mesma linha sem o **nosso
par** dentro da atribuição de IGNORE. O contrato, e cada cláusula existe por um
caso:

* o par no meio ou no fim da lista sai igual — a vírgula que sobra é comida;
* se depois da subtração a lista fica **vazia**, a atribuição inteira sai (um
  `VAR=` pendurado é resíduo, e é a mesma regra do `%command%` órfão em
  `strip_value`, `:236-238`);
* linha sem a nossa assinatura volta **byte a byte**;
* nunca, em nenhum ramo, emite um token sem `=`.

**A MORDIDA:** arranque a cláusula da vírgula (deixe a subtração ingênua) e
`test_nenhum_caminho_deixa_fragmento_sem_igual_pendurado`
(`tests/unit/test_steam_launch_options_vdf.py:114-121`) reprova nomeando o
fragmento. Ela é a régua mais valiosa deste arquivo e **não muda uma letra**
nesta sprint — ela é o que separa a cura da catástrofe.

### Passo 2 — `migrate_value` passa a subtrair em vez de desistir

Troque o `return value` de `:260-261` pela subtração, e siga para o caminho que
já existe: remover os co-ocorrentes (`_COOCCURRING_TOKENS`, `:101`) e os de
preload (`:104-107`), e então prefixar.

**A MORDIDA:** `test_migrate_nao_toca_lista_ignore_estendida` (`:107-108`)
reprova, e é para reprovar — ele asserta o defeito. **Reescreva-o**, não o
apague: o nome vira o que a linha faz agora, e a asserção passa a exigir que
`0x057e/0x2009` continue lá e `0x054c/0x0ce6` não. Depois arranque a chamada à
subtração e veja o novo caso reprovar.

### Passo 3 — `strip_value` também, e a razão é a desinstalação

`strip_value` (`:222-239`) tem o mesmo `if` implícito pela `has_poison`: numa
linha estendida ele não tira nada. Isso deixa o nosso par na lista dela **para
sempre depois de desinstalar** — e sem o wrapper, aquele par manda o jogo
ignorar o DualSense físico dela.

**A MORDIDA:** `test_strip_nao_toca_lista_ignore_estendida` (`:111-112`) — mesma
receita do Passo 2: reescreva o caso, arranque a cura, veja reprovar.

### Passo 4 — `apply_wrapper_vdf_text` para de pular

O `skipped.append((appid, "ignore_estendido"))` de `:600-601` deixa de existir
para a linha que a subtração alcança. O motivo `linha_fora_do_padrao` (`:614`) e
o `opt_out_da_usuaria` (`:598`) **continuam intactos** — o segundo é a vontade
dela e vem antes de todo diagnóstico nosso.

**A MORDIDA:** `test_apply_wrapper_pula_ignore_estendido_sem_tocar`
(`:433-439`) reprova. Reescreva-o para exigir o contrário — `aplicados` traz o
appid, a linha resultante chama o wrapper, e a lista dela sobreviveu — e depois
arranque o Passo 2 para vê-lo reprovar de novo.

### Passo 5 — a assinatura só enxerga o nosso par quando ele é o PRIMEIRO

`IGNORE_SIGNATURE` cola `VAR=` ao nosso par (`:97`), e `has_extended_ignore`
pergunta por substring (`:207`). **Lido no fonte, não executado:** numa linha
`SDL_GAMECONTROLLER_IGNORE_DEVICES=0x057e/0x2009,0x054c/0x0ce6` a substring não
aparece, então `has_poison` e `has_extended_ignore` respondem **os dois `False`**
— o produto não vê o próprio veneno.

**Escreva o caso ANTES de curar.** Se ele confirmar a leitura, o Passo 1 tem de
olhar a **atribuição**, não a assinatura colada — e aí a subtração cura os dois
buracos de uma vez. Se não confirmar, a leitura estava errada e isto sai da
sprint com uma linha dizendo por quê.

**A MORDIDA:** o caso novo em `test_has_poison_exige_token_completo`
(`:124-129`), que já é o dono desta pergunta.

### Passo 6 — o censo deixa de ter uma categoria

`Censo.intocaveis` (`:202-204`) e `Censo.reparaveis` (`:207-209`) continuam
existindo — **o que muda é quem cai em cada uma**. `MOTIVO_ESTENDIDO` (`:155`)
passa a nomear só o que a subtração não alcança.

E o terceiro ramo de `frase_do_aviso` (`sentinela_do_wrapper.py:423-428`), o que
termina em *"Reparo manual."*, deixa de acender no caso comum. **Não o apague:**
ele é a frase certa para a linha que ainda sobrar, e o dia em que ela sobrar é
o dia em que a frase é a única coisa honesta na tela.

**A MORDIDA:** `test_linha_com_ignore_estendido_e_intocavel`
(`tests/unit/test_sentinela_do_wrapper_01_a_steam_comeu_o_hefesto_launch.py:196`)
reprova — leia o caso inteiro e reescreva o que ele mede, sem substituição em
massa.

### Passo 7 — o prontuário promete o conserto porque agora ele acontece

Em `prontuario_dos_jogos.py:156-161`, o estorvo `LINHA_INTOCAVEL` vira
`automatica=True` e ganha a cura que o `SEM_WRAPPER` já tem (`:150-154`).

**E ele precisa de dono em `_CURAS`** (`:879-882`): a cura é a mesma,
`_curar_sem_wrapper`, porque agora o reparo alcança a linha.

**A MORDIDA, e ela é gratuita:** vire o `automatica` para `True` **sem** pôr a
entrada em `_CURAS` e
`tests/unit/test_ponte_steam_input_01_a_lista_que_so_preservava.py:382-383`
reprova nomeando a chave — *"estorvo automático sem cura ligada"*. É um portão
que já existe e que mede exatamente a promessa sem dono.

Depois: `test_linha_intocavel_nao_promete_conserto_automatico`
(`tests/unit/test_prontuario_01_o_disco_nao_sabe_dizer_que_funciona.py:110-124`)
reprova, e o nome dele é a frase que caducou. Reescreva o caso.

### Passo 8 — o cartão da Steam não perde um botão

`desenho_dos_lancadores.py:909-913` acende o «Copiar a linha» e o bloco com a
linha à mostra **só** quando `lida.intocaveis and lida.linha`. Depois desta
sprint essa condição para de ser verdadeira na máquina dela — e **nada é
removido**. O botão continua sendo a saída de quem cair no que a subtração não
alcança (Passo 4).

**Não mexa em `PISO_DA_ABA = 11`** (`a07_lancadores.py:1719`): o gesto
`copiar-a-linha` continua registrado e continua sendo o único botão de copiar de
toda a interface nova.

O carimbo (`:947-949`) segue a mesma sorte: ele conta `lida.intocaveis`, e a
contagem cai sozinha.

---

## 4. AS DUAS DECISÕES DO DIA QUE VALEM AQUI

1. **O "deu certo" é o campo piscando em VERDE por ~1,5 s** (03-Q4). O
   «Consertar» já devolve recado; nenhum passo desta sprint acrescenta palavra
   nova de sucesso à tela.
2. **Quando uma metade dá certo e a outra não, a tela FALA as duas**
   (`2026-09-05-AS-DUAS-ABAS-FALAM-01`). Aqui o caso concreto é o reparo
   parcial: `apply_wrapper_to_all_games` devolve `applied`, `skipped` e `errors`
   (`steam_launch_options.py:656-659`). Se a subtração aplicou em quatro jogos e
   um continuou fora do padrão, a frase diz **as duas metades** — não só a boa,
   não só a má.

---

## 5. O QUE ESTA SPRINT **NÃO** DECIDE

1. **Onde o wrapper é aplicado sozinho.** A outra metade da palavra dela —
   *"como era no gtk"* — é a **carona**, e ela é a `ONDA5-07-02`: três gestos do
   rodapé da interface nova não a pegam (`rodape.py:263`, `:283`, `:348`),
   enquanto a janela estável a pega em cinco lugares. Arquivos diferentes, sem
   conflito, e as duas fecham a mesma frase dela.
2. **O sandbox continua proibido.** `_SANDBOXED_MARKERS` (`:136`) e
   `is_sandboxed_layout` (`:388`) não são desta sprint: ali o wrapper do host é
   **invisível** de dentro do Flatpak, e aplicar escreveria um caminho órfão.
   Isso não é máscara nossa — é o mundo.
3. **A ordem dos portões do reparo.** `reparar_ou_adiar` (`sentinela_do_wrapper.py:448`)
   continua com jogo aberto antes de tudo, depois Steam aberta, e só então a
   escrita. Nenhum passo daqui mexe nela.

---

## 6. NADA SE PERDEU

O que existe hoje e tem de continuar existindo depois:

* **Nenhum caminho emite token sem `=`** —
  `test_nenhum_caminho_deixa_fragmento_sem_igual_pendurado`
  (`tests/unit/test_steam_launch_options_vdf.py:114-121`). É a régua que não
  muda.
* **A vontade dela vem antes do diagnóstico** — o `opt_out_da_usuaria` de
  `steam_launch_options.py:595-598`, e o comentário que o explica.
* **O que ela já tinha na linha sobrevive** — `migrate_value` PREPENDE, e o
  Pragmata precisa do wrapper **e** do `VKD3D_CONFIG` dela ao mesmo tempo
  (`sentinela_do_wrapper.py:465-468`). Régua:
  `test_o_reparo_nao_joga_fora_o_vkd3d_dela`
  (`tests/unit/test_carona_do_wrapper_01_salvar_repoe_o_que_a_steam_comeu.py:352`).
* **Idempotência** — quem já chama o wrapper é pulado com `ja_tem_wrapper`
  (`steam_launch_options.py:604` e `:608`), e
  `test_quem_ja_tinha_o_wrapper_nao_e_tocado` (`:366` do mesmo arquivo de
  carona) guarda isso.
* **O botão «Copiar a linha» e o bloco à mostra continuam existindo** —
  `desenho_dos_lancadores.py:909-913`, com o gesto em `a07_lancadores.py:1666` e
  a régua `test_o_estado_intocavel_traz_o_botao_e_a_linha`
  (`tests/unit/test_a_aba_07_lancadores_fecha_as_linhas.py:134`). O que muda é a
  frequência com que ela os vê, não a existência deles.
* **07-Q4 JÁ ESTÁ FECHADA, e esta sprint não pode desfazê-la.** A decisão *"O
  corpo nomeia o conjunto"* está no produto desde 04/09:

  ```python
        diz = ("Os controles chegam. O atalho de inicialização está no lugar em "
               f"{_plural(len(lida.com_wrapper), 'jogo', 'jogos')} da sua "
               "biblioteca (instalados ou não).")
  ```
  — `src/hefesto_dualsense4unix/interface/desenho_dos_lancadores.py:886-888`,
  com a régua em
  `tests/unit/test_a_aba_07_lancadores_fecha_as_linhas.py:386`. **Não há trabalho
  em 07-Q4** — há uma régua a não quebrar.

---

## A PROVA DE TELA

O cartão da Steam muda de estado nesta sprint: sai do selo com carimbo *"linha
intocável — só reparo manual"* e entra no que o `Consertar` alcança. Vale a
`PROVA-DE-TELA-01`: **foto antes e depois**, o clique no `Consertar` com a
resposta mostrada, e a mordida colada.

**A janela não nasce na tela dela.** `--oculta` sempre — ela tem UMA tela.

**E não rode o reparo de verdade na biblioteca dela.** Este caminho ESCREVE no
`localconfig.vdf`; é por isso que o `conftest.py` desliga a carona em todo teste
(`HEFESTO_CARONA_WRAPPER=0`, citado em `a07_lancadores.py:676-680`). A prova de
tela usa uma `Leitura` montada à mão, que é o que a régua da aba já faz.
