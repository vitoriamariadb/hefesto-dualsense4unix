---
sprint: ONDA5-07-02
decisoes: [07-Q1]
posse:
  L2:
    - src/hefesto_dualsense4unix/interface/pacotes/rodape.py
    - src/hefesto_dualsense4unix/interface/pacotes/perfil.py
    - tests/unit/test_carona_do_wrapper_01_salvar_repoe_o_que_a_steam_comeu.py
nao_toca:
  - src/hefesto_dualsense4unix/integrations/steam_launch_options.py
  - src/hefesto_dualsense4unix/integrations/sentinela_do_wrapper.py
  - src/hefesto_dualsense4unix/app/actions/carona_do_wrapper.py
  - src/hefesto_dualsense4unix/app/actions/home_actions.py
  - src/hefesto_dualsense4unix/interface/pacotes/a07_lancadores.py
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
---

# ONDA5-07-02 · DEFEITO — o rodapé perdeu a carona que a janela velha pega

> **A decisão dela, verbatim (07-Q1, 05/09/2026):**
> *"Deve aplicar automaticamente como era no gtk"*

Três palavras dela — **como era no gtk** — são uma afirmação sobre o produto, e
ela está certa: a janela estável repõe o atalho sozinha, e a interface nova
perdeu esse fio em três dos quatro botões do rodapé.

**O desenho é dela desde 16/08/2026**, e está copiado no topo do módulo que o
implementa:

> *"nem precisa ter um botão na gui, mas ele se auto corrigir ao clicarmos em
> aplicar ou salvar o perfil seja dentro ou fora da guia de perfis."*
> — `src/hefesto_dualsense4unix/app/actions/carona_do_wrapper.py:7-9`

E a razão que ela deu vale mais que o mecanismo: *um botão novo é mais uma coisa
para lembrar de apertar* (`carona_do_wrapper.py:11-14`). É por isso que a
resposta certa para 07-Q1 não era nenhum dos quatro botões que eu ofereci.

---

## 1. O QUE SE MEDIU — cinco chamadas de um lado, uma do outro

A janela estável tem a tabela dos gestos escrita no fonte
(`carona_do_wrapper.py:40-53`) e um portão que **conta as chamadas**:

```python
    esperado = {
        "app/actions/profiles_actions.py": 2,  # Salvar e Ativar, na aba
        "app/actions/profile_writer.py": 1,  # o funil: Salvar/Importar/Restaurar
        "app/actions/footer_actions.py": 1,  # o botão verde "Aplicar"
        "app/app.py": 1,  # bandeja e janela compacta, pelo mesmo método
    }
```
— `tests/unit/test_carona_do_wrapper_01_salvar_repoe_o_que_a_steam_comeu.py:718-723`

**Na interface nova, a mesma pergunta tem uma resposta só:**

| gesto da interface nova | onde | pega carona? |
| --- | --- | --- |
| «Ativar» (aba Perfis) | `interface/pacotes/a10_perfis.py:1686` | **SIM** |
| «Aplicar» (o botão verde do rodapé) | `interface/pacotes/rodape.py:263-264` | **não** |
| «Salvar Perfil» (rodapé) | `interface/pacotes/rodape.py:283-284` | **não** |
| «Importar» (rodapé) | `interface/pacotes/rodape.py:348-349` | **não** |
| «Exportar» (rodapé) | `interface/pacotes/rodape.py:310-311` | não, e está certo |

O «Exportar» copia um arquivo para fora (`rodape.py:337-345`) e não toca o perfil
ativo — não há nada a repor.

**E o portão dá VERDE sobre isto.** Ele conta só nos quatro arquivos da janela
velha; `interface/pacotes/` não está no dicionário. É a assinatura que esta casa
nomeou em 05/09: **a régua média o mundo de ontem** — ela foi escrita quando a
interface nova não existia, e continuou verde enquanto o produto novo perdia
quatro quintos do comportamento que ela guarda.

**O que a ausência custa, e não é hipótese:** o `salvar` do rodapé grava o
perfil no disco dela (`rodape.py:301-308`) e o `aplicar` manda o perfil aos
controles (`rodape.py:280`). Nos dois, se a Steam tiver comido a linha de
`LaunchOptions`, o perfil entra e **o jogo continua sem enxergar o controle** —
o sintoma que ela descreveu: *"parou de ser reconhecido no jogo, mas o perfil
segue ativo no controle com tudo funcionando"* (`carona_do_wrapper.py:24-26`).

---

## 2. O TRABALHO, EM PASSOS

### Passo 1 — a carona ganha uma casa compartilhada

A função existe e está escrita com todo o cuidado que este caminho exige — o
desligador do dono, o "nunca levanta", a razão de não usar o método do mixin:

```python
def _com_a_carona(frase: str) -> str:
```
— `src/hefesto_dualsense4unix/interface/pacotes/a10_perfis.py:277`

Ela mora no pacote de UMA aba e o rodapé é das DEZ. **Mova o corpo para
`interface/pacotes/perfil.py`**, público, com o docstring inteiro — é o módulo
compartilhado que o rodapé já importa (`rodape.py:34`), e o assunto é o dele:
gravar e aplicar perfil.

**O `a10_perfis.py` muda UMA linha** — `_com_a_carona` vira delegação para a
função de `perfil`. Está declarado no cabeçalho (`toca_uma_linha`): se outra
frente desta leva for dona da a10, entregue essa linha a ela e diga na entrega.

**A MORDIDA:** troque a nova função por um `return frase` seco e
`test_ativar_na_aba_perfis_repoe_o_wrapper`
(`tests/unit/test_carona_do_wrapper_01_salvar_repoe_o_que_a_steam_comeu.py:310`)
reprova — a régua da a10 continua sendo a mesma, porque o comportamento é o
mesmo.

### Passo 2 — os três gestos do rodapé pegam a carona

`aplicar` (`:263`), `salvar` (`:283`) e `importar` (`:348`) chamam a função
compartilhada **depois** do trabalho deles, nunca antes: a carona é efeito
colateral de um gesto que já deu certo, e o contrato dela é **nunca levantar**
(`a10_perfis.py:302-303`).

**O `ligada()` não é um `if` seu.** Ele é o portão do dono
(`carona_do_wrapper.py:232`) e é o que desliga a carona na suíte — o
`conftest.py` põe `HEFESTO_CARONA_WRAPPER=0` justamente porque este caminho
ESCREVE no `localconfig.vdf` dela. Uma régua que rode sem ele reescreve a
biblioteca da máquina em que roda.

**A MORDIDA:** arranque a chamada de UM dos três e a régua do Passo 4 reprova
nomeando o gesto. Se reprovar nos três, a cura entrou no lugar errado.

### Passo 3 — a notícia da carona tem canal, e ele já existe

Os três gestos do rodapé devolvem `None` hoje. A `passada()` devolve um
`ResultadoDaCarona` com uma `frase` (`carona_do_wrapper.py:216-224`), e essa
frase é notícia, não confirmação: *"N jogos perderam as Opções de Inicialização
… vou repor assim que a Steam fechar"*.

**Devolva `{"recado": frase}` quando houver frase, e `None` quando não houver.**
O canal é o do piloto e o contrato está escrito: *"Um gesto que devolva
`{"recado": "…"}` manda a própria frase para o cartão, e ela vence esta"* —
`interface/hefesto_vivo.py:154-157`.

**E o silêncio é o caso comum, de propósito.** Sem nada a reparar, `frase` é
vazia (`carona_do_wrapper.py:402`) e o gesto volta a `None`: o "deu certo" é o
campo piscando em VERDE por ~1,5 s (decisão 03-Q4), **sem palavra nova na
tela**. A carona só fala quando tem notícia.

### Passo 4 — a régua passa a medir o mundo de hoje

No mesmo `test_os_cinco_gestos_chamam_a_carona` (`:710-730`), acrescente a
interface nova ao dicionário `esperado`, com a contagem e o comentário de cada
linha — `interface/pacotes/rodape.py` com três, e o pacote que ficar com a
delegação com a sua.

**Não faça substituição em massa neste arquivo.** *"Substituição em massa sobre
uma régua é edição cega; cada uma tem de ser lida"* — a lição das dezoito réguas
de 05/09, e duas delas voltaram por isso. O arquivo tem 21 casos e todos falam
da janela velha; o que entra é um caso a mais, não uma reescrita.

**A MORDIDA:** a do Passo 2, e ela tem de nomear o arquivo e a contagem — é o
que o portão já faz pela janela velha (`:726-729`).

### Passo 5 — o que NÃO ganha carona, e a razão de cada um

Escreva isto no docstring do módulo, porque declarar é o que separa dívida de
esquecimento. Os dois de fora na janela velha continuam de fora aqui, pelas
razões medidas do dono (`carona_do_wrapper.py:62-80`):

* **«Aplicar aos jogos da Steam»** já É a aplicação em massa, e tem uma máquina
  que a sentinela não tem — pedir consentimento para fechar a Steam. Trocá-la
  seria regressão.
* **AUTOSWITCH** aplica perfil exatamente quando o jogo está SUBINDO: Steam viva
  e jogo aberto, as duas condições em que escrever no `localconfig.vdf` é jogar
  o reparo fora.

E **meça** os gestos de escrita da aba Perfis que não são o «Ativar» —
`voltar-a-de-ontem` (`a10_perfis.py:1689`), `duplicar` (`:2606`), `remover`
(`:2667`) e os `editor.*`. Se algum for "aplicar ou salvar o perfil" na palavra
dela, ele entra na conta; se não for, **declare a razão**. O que não pode é
ninguém ter perguntado.

---

## 3. O QUE ESTA SPRINT **NÃO** DECIDE

1. **A linha intocável.** É a `ONDA5-07-01`, e ela é a outra metade da mesma
   frase dela — arquivos diferentes, sem uma linha em comum.
2. **A frase do aviso do jogo aberto.** É a `ONDA5-07-03`, dona de
   `app/actions/home_actions.py`.
3. **A bandeja e a janela compacta.** `app/app.py:1790` pega a carona pela
   janela estável; se a interface nova tiver o próprio caminho de troca de
   perfil por fora da janela, ele não foi medido aqui. **Não invente:** meça e
   declare.

---

## 4. NADA SE PERDEU

* **A carona nunca derruba o gesto dela** — `test_a_carona_nunca_derruba_o_gesto_dela`
  (`tests/unit/test_carona_do_wrapper_01_salvar_repoe_o_que_a_steam_comeu.py:619`).
  Uma exceção na carona transformaria uma gravação bem-sucedida em tarja de
  recusa.
* **Desligada, a carona não toca em nada** — `test_desligada_a_carona_nao_toca_em_nada`
  (`:639`). É o que faz a suíte inteira rodar sem reescrever a biblioteca da
  máquina.
* **Com jogo aberto ela nem cogita** — `test_com_jogo_aberto_a_carona_nem_cogita`
  (`:561`), e a razão é que fechar a Steam ali mataria o jogo dela.
* **O jogo que ela recusou não recebe o wrapper de carona** —
  `test_jogo_que_ela_recusou_nao_recebe_o_wrapper_de_carona` (`:586`). A vontade
  dela vem antes.
* **O aviso não repete no mesmo episódio** — `test_o_aviso_nao_repete_no_mesmo_episodio`
  (`:440`) e `test_um_episodio_novo_com_os_mesmos_jogos_volta_a_falar` (`:456`).
  A memória do episódio mora no mixin da janela velha; se o rodapé falar a cada
  clique, **isso é defeito novo** — meça antes de entregar.
* **O «Aplicar» não é redundante**, e a razão está no topo do rodapé
  (`rodape.py:23-27`): ele carrega o **depois** — modo e máscara, que o jogo só
  lê quando abre.
* **O «Salvar» grava no perfil ativo sem perguntar o nome**, por decisão dela de
  01/09 (`rodape.py:287-291`). Nenhum passo daqui muda isso.

---

## A PROVA DE TELA

O `recado` da carona é texto que ela lê, e ele nasce nesta sprint. Vale a
`PROVA-DE-TELA-01`: **foto antes e depois**, o clique no «Salvar» com a resposta
mostrada, e a mordida colada. **Botão que você mexeu e nunca clicou não está
entregue.**

**A janela não nasce na tela dela.** `--oculta` sempre — ela tem UMA tela.

**E a prova não escreve na biblioteca dela.** O caminho de escrita fica atrás do
`ligada()`; a prova de tela usa o desligador e um dublê, como os 21 casos do
arquivo de carona já fazem.
