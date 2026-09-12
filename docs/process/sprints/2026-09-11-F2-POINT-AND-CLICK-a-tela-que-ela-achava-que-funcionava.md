---
sprint: F2-POINT-AND-CLICK
estado: feita
onda: A-FILA-DE-0911
posse:
  F12-NAVEGACAO:
    - src/hefesto_dualsense4unix/interface/aba06.py
    - src/hefesto_dualsense4unix/interface/pacotes/a06_navegacao.py
    - src/hefesto_dualsense4unix/interface/paginas/06-navegacao.html
    - mockup/06-navegacao.html
    - scripts/check_cabo_bt_perfil_controle.py
    - scripts/check_a_tela_nao_confessa.py
    - tests/unit/test_a_aba_06_navegacao_fecha_as_linhas.py
cria:
  - tests/unit/test_a_06_o_ponto_guarda_o_que_ela_escolhe.py
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/interface/mapa.py
  - src/hefesto_dualsense4unix/interface/calibrar.py
  - src/hefesto_dualsense4unix/interface/aba10.py
  - src/hefesto_dualsense4unix/interface/pacotes/a10_perfis.py
  - src/hefesto_dualsense4unix/app/widgets/calibrar_entradas.py
  - install.sh
---

# F2-POINT-AND-CLICK — seis das sete linhas passaram a gravar

Nasce do §1 de
[A FILA QUE A ONDA ABRIU](2026-09-11-A-FILA-QUE-A-ONDA-ABRIU-INDICE.md), que
nasce da medição da
[PAGINAS-ESPECIAIS-B1](2026-09-11-PAGINAS-ESPECIAIS-B1-o-inventario-e-a-lingua.md).

> *"eu achei que elas funcionavam"* — ela, 11/09/2026, ao ler o número.

**E ISTO NÃO É FEATURE NOVA.** A ordem dela na onda da língua foi *"A ideia não
é adicionar mais nada em termos de feature ou interface, Mas é fazer o todo
funcionar"*. A tela já estava desenhada, aprovada e prometida; o que faltava era
a segunda metade da frase.

---

## §0 — O NÚMERO, medido nos dois lados

| | antes | depois |
| --- | --- | --- |
| `<select>` em `#point-and-click` | 7 | 7 |
| …com endereço de gravação | **0** | **6** |
| gestos do rodapé com dono | 0 de 1 | **3 de 3** (`guardar-ponto`, e o `×`/`Cancelar` por `fechar-ponto`) |

Medido abrindo a página publicada e contando `select[data-campo]`, não lendo o
fonte — esta casa já publicou 77% onde a tela mostrava 36%.

## §1 — ONDE CADA UMA DAS SETE MORA HOJE NO PERFIL

O destino não precisou nascer: ele existe desde 01/09/2026, por decisão dela
(*"ganha campo. essa é a parte das features que precisam ou serem ajustadas ou
desenvolvidas"*). É `Profile.button_actions` — botão → ação, com `None` querendo
dizer *herda o de fábrica*.

| linha da tela | id em `acoes_de_botao.BOTOES` | onde mora | de fábrica |
| --- | --- | --- | --- |
| Touchpad · Deslizar | **nenhum** | — ver §4 | — |
| Touchpad · Clique esquerdo | `touchpad_left_press` | `button_actions` | Backspace |
| Touchpad · Clique direito | `touchpad_right_press` | `button_actions` | Delete |
| ✕ | `cross` | `button_actions` | Botão esquerdo |
| ○ | `circle` | `button_actions` | Enter |
| L3 · Direção | `l3_direcao` | `button_actions` | Movimento do cursor |
| R3 · Direção | `r3_direcao` | `button_actions` | Rolagem vertical e horizontal |

**A RECEITA DO ESTILO DIFERE DO DE FÁBRICA EM TRÊS** — o círculo e os dois
cliques do touchpad —, e esse número não está digitado em lugar nenhum: a régua
o deriva comparando as `<option selected>` da página publicada com
`acoes_de_botao.padrao()`.

## §2 — O FATO QUE CAIU, e ele era o que segurava o botão

O `SEM_GESTO` dizia:

> *"'Estilo de Jogo' não existe em campo, widget ou preset nenhum do produto
> (…) o `point_and_click` que existe é um PERFIL em disco, não um estilo, e
> gravar perfil não tem método"*

**Continua verdade sobre um campo chamado "estilo" — e é a pergunta errada.** A
tela não pergunta que estilo o perfil tem: ela pergunta **o que cada peça faz**,
e isso tem campo. É a QUARTA saída do `SEM_GESTO` com a mesma forma das três
anteriores (`teclado`, `padrao-definicoes`, e agora esta): *o que prendia o
botão não era o produto, era o que estava escrito sobre ele.*

E a metade final da frase — *"gravar perfil não tem método"* — já tinha sido
substituída em 01/09: `profiles/loader.save_profile` existe, e o
`perfil.gravar_e_reaplicar` é o caminho que a tela irmã usa desde então.

## §3 — O DESENHO DIVIDE O ENDEREÇO COM A TELA IRMÃ, e é decisão

As telas *Definições Controle e Mouse* e *Estilo Point-and-click* falam do
**mesmo campo do perfil**. Então falam pelo **mesmo endereço**:
`data-campo="acao-<botão>"` e `data-linha="<botão>"`.

* a pintura visita as duas de uma vez (medido: `el.value = t` acerta **2
  elementos** por chave), e nenhuma pode mostrar o contrário da outra;
* a `forma` de cada "Guardar" é recortada pelo `id` da pop-up
  (`hefesto_vivo`, o bloco `forma:`), então elas não disputam;
* e o "Guardar" do estilo **junta em vez de substituir**: a forma dele traz seis
  linhas, e gravar só o que recebeu apagaria as outras dezesseis em silêncio — o
  apagador com rótulo de "Guardar", que esta mesma aba já pagou em 02/09/2026.

Um segundo prefixo de endereço era a alternativa, e ela é a segunda verdade que
esta casa persegue: a tela não pintada mostraria o desenho enquanto o perfil diz
outra coisa.

## §4 — A LINHA QUE NÃO GANHOU ENDEREÇO, e o que seria preciso

**Touchpad · Deslizar → "Movimento do cursor".** Não é botão: não está em
`core/acoes_de_botao.BOTOES`, e quem move o cursor por ali é
`integrations/uinput_mouse.emit_touchpad_move` — o próprio mouse virtual, e não
uma escolha por peça. Dar-lhe um `data-campo` inventaria um botão que o
`resolver()` não conhece, e a escolha iria ao disco para nunca ser lida.

**O que seria preciso**, se ela quiser que a linha vire escolha: um papel novo
no vocabulário do motor (*o touchpad deslizando move o cursor · rola · nada*),
um campo que o guarde e uma porta no `uinput_mouse` que o consulte antes de
`emit_touchpad_move`. **É feature, e é decisão dela** — a alternativa barata é
a linha deixar de ser `<select>` e virar leitura, que também é decisão dela.

**E há um segundo ponto para ela, medido no mesmo dia:** os dois números
(*Velocidade do cursor* 8 · *Velocidade da rolagem* 4) têm destino —
`Profile.mouse.speed` e `Profile.mouse.scroll_speed`, da
`FEAT-POINT-AND-CLICK-01`, que é literalmente a seção que leva o nome desta
tela. O que falta é a palavra dela sobre o `enabled` daquela seção: escrevê-la
faz ATIVAR o perfil LIGAR a emulação de mouse, e ligar a emulação de mouse é
mexer no cursor dela. Não se escolhe isso em silêncio.

## §4-bis — A MARCA «não dispara», e quem mandou pô-la foi a régua

As duas linhas de clique do touchpad desta tela **não levavam a marca**. Dar-lhes
endereço fez a régua
`test_a_marca_esta_nas_tres_regioes_do_touchpad_e_so_nelas` passar a enxergá-las
— e reprovar, exatamente como o comentário dela prevê: *"é ela que pega a marca
posta na tela certa e na LINHA errada"*. **Até aqui as duas escapavam por não
terem endereço.** A marca entrou; o texto é o mesmo dos outros nove lugares
(decisão do PO de 04/09/2026 sobre a D-15 dela), e não uma frase nova.

**E A RÉGUA TINHA UM PROXY QUE DEIXOU DE PODER SER VERDADE.** Ela exigia que as
três regiões aparecessem o **mesmo número de vezes** com a marca — o que só vale
enquanto toda tela que lista botões listar as TRÊS. Esta lista **duas**, e a
igualdade passou a reprovar uma tela correta. A regra sem proxy é a que ficou:
*nenhuma célula de região do touchpad sem a marca, e nenhuma marca fora delas* —
que cobre o que a igualdade cobria **e** o que ela não via (as três esquecidas
de uma vez na mesma tela). Quem diz quais são as regiões continua sendo
`aba06.TOUCH_REGIOES`, que as tira da nota de `pecas-do-dualsense.csv`.

Conferido: com a marca arrancada de UMA linha desta tela, os dois casos
reprovam; devolvida, os dezoito voltam ao verde.

**O QUE FICA PARA ELA:** a dica do cabeçalho promete que *"o toque vira o
clique"* e a marca diz que nesta máquina o clique não dispara. As duas são
verdade sobre coisas diferentes — o toque MOVE o cursor; o CLIQUE é que não vira
tecla enquanto o touchpad for o ponteiro do computador. Como a tela diz isso é
palavra dela, e não foi mexido.

## §5 — COMO SE PROVOU

**A FOTO** — `#point-and-click` antes e depois, e a terceira é a que decide:
a tela **reaberta mostrando o que o perfil guarda** (o ✕ diz `Esc`, que é o que
foi gravado, e não o `Botão esquerdo` do desenho). Os rótulos dela saem de
`a06_navegacao._linhas_dos_botoes` — a mesma função do tique.

**O CLIQUE** — o gesto inteiro, com `Profile` de verdade e disco que revalida:

```
1. sem ter mexido em nada       RECUSA dizendo ("não havia o que guardar")
2. a tela ainda não foi pintada RECUSA dizendo, e NADA vai ao disco
3. ela troca as três linhas     ACEITOU · o arquivo passa a ter
                                {touchpad_left_press: BTN_LEFT,
                                 touchpad_right_press: BTN_RIGHT,
                                 circle: BTN_RIGHT}
4. a tela relê                  as seis linhas voltam com o que gravaram
5. o device recebe              `resolver()` entrega os quatro cliques ao mouse
6. as outras dezesseis          intocadas
7. opção que o produto não tem  RECUSA dizendo (`ValueError`)
8. sem perfil ativo             RECUSA dizendo, e nomeia o caminho
9. o Cancelar                   larga a escolha pendente
10. voltar ao de fábrica        TIRA do perfil (o campo some do arquivo)
```

**E NO MOTOR DO PRODUTO**, com `HOME` de mentira e `--oculta` (a tela dela é uma
só):

```
[gesto] 06-navegacao.html · fechar-ponto → aplicado, e a resposta foi para a tela
gestos: 1 · aplicados: 1 · sem dono: 0
```

Na mesma corrida, o contraste que mede o que esta frente NÃO fechou:

```
[gesto sem dono] 06-navegacao.html · guardar-remapeamento · 'Guardar'
[gesto sem dono] 06-navegacao.html · padrao-remapeamento · 'Confirmar'
```

**O `--prova-clique` RECUSOU apertar o `guardar-ponto`**, e a recusa é a casa
funcionando: `pacotes.perigosos()` deriva do `grava=` do decorador, e o gesto
passou a declarar que grava perfil. Sem essa declaração a prova de clique
escreveria no perfil REAL de quem a rodasse — foi o que aconteceu em 06/09/2026.

**A MORDIDA**, sete, todas conferidas — cada uma arrancada, a régua reprovando,
e devolvida:

| o que se arranca | quem reprova |
| --- | --- |
| o `gravar_e_reaplicar` do gesto | 3 casos |
| o `novo = dict(prof.button_actions or {})` (substituir em vez de juntar) | `..._junta_e_nao_substitui` |
| a trava `divergem and not _MEXENDO` | `..._que_ainda_nao_falou_nao_grava` |
| o `novo.pop` (gravar o de fábrica em vez de tirar) | `..._tira_do_perfil` |
| o `_largar_o_que_ela_mexeu` do `fechar-ponto` | `..._larga_a_escolha_pendente` |
| o `grava=` do decorador | `..._a_casa_sabe_que_ele_grava` |
| o endereço das listas no gerador, republicado | **8 casos** |
| a marca «não dispara» de uma linha de touchpad desta tela | 2 casos, na régua da marca |

## §6 — O QUE FICA PARA ELA

1. a linha do **deslizar** (§4) — vira escolha, ou vira leitura;
2. os **dois números** de velocidade (§4) — o `enabled` do `Profile.mouse`;
3. a coluna diz **«O que ele faz neste estilo»**, e o que se grava é o perfil
   ATIVO. É coerente com o resto (o estilo de jogo de um perfil mora no perfil),
   e mesmo assim é palavra de tela — fica anotado, e não mexido;
4. a **dica do cabeçalho contra a marca «não dispara»** (§4-bis).

## §7 — A OUTRA COISA QUE CAIU, e é de PROSA

`scripts/check_cabo_bt_perfil_controle.py` classificava o `guardar-ponto` como
*"grava um ponto de mira — é do perfil"*. **Ponto de mira não existe em lugar
nenhum deste produto.** A classificação estava certa (é do perfil, não do
aparelho); a descrição apontava para outra coisa, e é a assinatura que esta
casa persegue. Substituída pelo que o gesto faz.
