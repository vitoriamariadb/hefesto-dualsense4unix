---
sprint: CADEADO-E-O-FATO-01
estado: feita
onda: A-LISTA-DE-0911B
posse:
  CADEADO-E-O-FATO-01:
    - src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py
    - src/hefesto_dualsense4unix/interface/pacotes/perfil.py
    - src/hefesto_dualsense4unix/interface/aba01.py
    - src/hefesto_dualsense4unix/app/actions/home_actions.py
    - src/hefesto_dualsense4unix/app/actions/relancar.py
    - tests/unit/test_o_cadeado_mora_no_canto_do_bloco.py
    - mockup/01-jogar.html
    - docs/data/paridade-gtk-html.csv
    - docs/process/2026-09-03-O-TERCEIRO-NUMERO-a-paridade-com-a-gtk.md
    - docs/process/sprints/2026-09-11-PERFIS-A-TELA-01-as-linhas-que-quebram-e-o-modo-que-nao-e-daqui.md
cria: []
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/interface/aba04.py
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/interface/topo.html
---

# CADEADO-E-O-FATO-01 — «Trava o perfil ativo», e a perda que não era perda

> **ESTADO 2026-09-11: feita** — a caixa do canto do bloco Modo diz **«Trava o perfil ativo»** nos cinco endereços, com a página gerada e PUBLICADA (`--publicar 01`) e as duas réguas do par rótulo↔GTK verdes; e o fato errado da leva de 11/09 — a «perda de capacidade» — foi SUBSTITUÍDO nos três lugares, com a palavra dela e a cadeia de código que a sustenta. A linha 384 da paridade saiu de `FALTA_NO_HTML` e voltou a `DIFERENTE`, a tabela publicada foi RECONTADA do CSV (`10-perfis` 19→20 DIFER e 8→7 FALTA; `TODAS` 159→160 e 31→30) e as duas mordidas reprovaram. Medido na tela: o rótulo vai de 254,1px para 116px numa linha de 1528px que já tinha 1219,9px livres — ele é ancorado à DIREITA, então encurtar não deixa nada solto. A entrega está em `docs/process/agentes/2026-09-11/CADEADO-E-O-FATO-01-opus.md`.

**Duas coisas, e as duas vêm da mesma conversa dela de 11/09/2026, depois de
olhar as fotos da Jogar e da Perfis lado a lado.**

---

## §1 — O TEXTO DA CAIXA MUDA, e a palavra é dela

> *"Trava o perfil ativo"*

A caixa no canto do bloco **Modo** da aba Jogar diz hoje
`Não trocar de perfil sozinho ao abrir um jogo`. Passa a dizer **`Trava o
perfil ativo`**.

**A frase está em QUATRO lugares e uma régua casa dois deles.** Troque nos
quatro, no mesmo commit:

| onde | o quê |
| --- | --- |
| `pacotes/a01_jogar.py:392` | `CADEADO_ROTULO` — o dono na tela nova |
| `app/actions/home_actions.py:2407` | o `label=` do `Gtk.CheckButton` — o dono ANTIGO, que a régua lê |
| `app/actions/home_actions.py:335` e `:350` | duas citações em comentário |
| `app/actions/relancar.py:101` | uma citação em comentário |
| `interface/aba01.py:1886` | a legenda da página que cita a frase |

**A RÉGUA É `tests/unit/test_o_cadeado_mora_no_canto_do_bloco.py:220-224`**, e
ela compara o que a página publica com o `CADEADO_ROTULO`. Há uma segunda,
`test_a_aba_01_jogar_fecha_as_linhas`, que lê o FONTE da GTK e reprova no dia em
que os dois lados se afastarem — é ela que obriga o `home_actions` a andar
junto. **Confira as duas e faça a mordida:** troque um dos lados só, veja
reprovar, devolva.

**A DICA NO PONTEIRO DO MOUSE (`CADEADO_DICA`) FICA COMO ESTÁ.** Ela já explica
o mecanismo com precisão — *"Congela a troca automática: o perfil que você
deixou ativo continua valendo mesmo ao abrir qualquer jogo"* —, e o rótulo novo
é curto justamente porque a explicação tem outro dono. Se a frase nova tornar
alguma palavra da dica redundante, corte a palavra; não reescreva a dica.

**E A PÁGINA TEM DE SER PUBLICADA:** a frase mora em
`interface/paginas/01-jogar.html:2102`. Gere `mockup/01-jogar.html` e rode
`--publicar 01`. Sem isso a tela dela continua com a frase velha.

## §2 — O FATO ERRADO, escrito HOJE, em três lugares

**A leva de 11/09 declarou uma «perda de capacidade» que a medição não
sustenta**, e foi ELA quem a derrubou:

> *"a informação que eu selecionar no modo ou mascara na aba jogar ao salvar o*  <!-- noqa-acento: citação literal dela -->
> *perfil faz a mesma função que o modo tinha na aba perfil isso foi*  <!-- noqa-acento: citação literal dela -->
> *implementado desde o inicio mas voltou e não deVEria ter ocorrido"*  <!-- noqa-acento: citação literal dela -->

**E O CÓDIGO CONCORDA COM ELA, na própria docstring** — `a01_jogar.py:1833`:

> *"Leva o modo clicado à seção `mode` do perfil ativo."*

Medido: `_gravar_o_modo_do_chip` → `_gravar_o_modo` →
`perfil.gravar_o_modo_no_ativo`. **Clicar um chip na aba Jogar já grava `mode`
no perfil** — e a máscara também (`_gravar_o_modo(ctx, "gamepad", mascara)`).
Não precisa nem do «Salvar Perfil»: o clique grava.

**ENTÃO O QUE SE PERDEU É MENOR DO QUE ESTÁ ESCRITO, e são DUAS coisas só:**

1. mexer no modo de um perfil **sem ativá-lo antes**;
2. o valor **«Não mexer no modo»** (`none`), que a Jogar não emite.

**E ELA DECIDIU QUE ISSO NÃO É DÍVIDA:** o quadro em Perfis era duplicata de uma
função que a Jogar já fazia desde o início, e ter voltado para lá foi o engano.
A retirada de 11/09 não tirou capacidade: **desfez a duplicata.**

### O que corrigir, e a regra é a do fato errado — SUBSTITUI, não guarda ao lado

| onde | o que diz hoje | o que passa a dizer |
| --- | --- | --- |
| `pacotes/perfil.py`, docstring de `gravar_o_modo_no_ativo` | a perda, com «ninguém» nas duas primeiras linhas da tabela | o ALCANCE real (perfil ativo) e as duas faltas da lista acima, como DECISÃO dela, não como dívida |
| `docs/data/paridade-gtk-html.csv:384` | veredito `FALTA_NO_HTML` para o quadro Modo do perfil | o veredito que a decisão dela sustenta — a função existe na Jogar, com o alcance escrito no `porque` |
| a sprint `PERFIS-A-TELA-01`, §3.1 | «A PERDA, MEDIDA E DECLARADA» com a tabela de três linhas | a correção datada, com a palavra dela e a medição do `a01_jogar.py:1833` |

**CUIDADO COM O PORTÃO DA PARIDADE, e ele é o de sempre:** a régua
`sinal-espera` lê o CÓDIGO, não o CSV. Mudar o veredito da linha 384 muda o que
ela espera achar — rode `scripts/check_paridade_gtk_html.py` e confira que a
tabela publicada em `docs/process/2026-09-03-O-TERCEIRO-NUMERO…` acompanha (a
regra `numero-publicado` conta o CSV e reprova quem não regerar). **A tabela não
se resolve escolhendo um número: ela se RECONTA do CSV.**

## §3 — O QUE ENTREGAR

1. A caixa diz **«Trava o perfil ativo»** nos cinco endereços, com a página
   publicada (`--publicar 01`) e as duas réguas verdes.
2. Os três lugares do fato corrigidos, com a citação dela e a linha do código
   que a sustenta.
3. A tabela da paridade **recontada** e o portão verde.
4. **A MORDIDA**, duas: troque só um lado do par rótulo↔GTK e veja reprovar;
   devolva o veredito velho na linha 384 e veja o portão reprovar.
5. A foto da aba Jogar, `--oculta`, com a caixa nova.

## §4 — O QUE É DELA

**O texto já é dela** — está na §1, palavra por palavra. O que sobra para o olho
dela é a foto: uma frase de três palavras no canto do bloco Modo pode ficar
solta onde a de sete preenchia a linha. Se ficar, diga no relatório com a medida
em pixels; não reescreva a frase para preencher espaço.
