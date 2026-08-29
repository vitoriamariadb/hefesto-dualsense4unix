---
sprint: MIGRA-CONEXOES-07
onda: MIGRA-CONEXOES
posse:
  M7:
    - src/hefesto_dualsense4unix/app/actions/config/secao_exame.py
cria:
  - tests/unit/test_migra_conexoes_o_exame_mostra_o_que_confere.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-01
  - MIGRA-CONEXOES-01
  - MIGRA-CONEXOES-03
  - MIGRA-CONEXOES-04
  # SÉRIE por arquivo (R5): as cinco abaixo também possuem `secao_exame.py`.
  - ONDA-CONEXOES-03
  - ONDA-CONEXOES-04
  - ONDA-CONEXOES-09
  - ORDEM-DE-SERVICO-01
  - LEVA-2
  - LEVA-4
nao_toca:
  - src/hefesto_dualsense4unix/integrations/exame_da_mesa.py
  - src/hefesto_dualsense4unix/integrations/ordens_da_mesa.py
  - src/hefesto_dualsense4unix/integrations/arranjo_da_mesa.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - scripts/telas/aba08.py
---

# MIGRA CONEXÕES · 07 — o exame volta a ser o que o produto confere

**O defeito:** o produto confere **cinco** coisas, o mockup mostra **cinco**
linhas, e só **duas** são as mesmas.

O que o produto confere hoje — `integrations/exame_da_mesa.py`, pela `chave` de
cada item:

| chave | linha | o que ela responde |
|---|---|---|
| `energia_do_radio` | `:192` | o adaptador Bluetooth está recebendo energia bastante |
| `energia_das_portas` | `:260` | as entradas em uso entregam 500 mA ou mais |
| `suporte_ao_controle` | `:306` | esta máquina sabe falar com este controle |
| `pareamentos` | `:397` | os pareamentos estão sãos — **é a linha que avisa que o controle vai cair logo depois de conectar** |
| `vizinhanca_das_portas` | `:507` | dois rádios em entradas que dividem controlador |

O que a página mostra:

* **ficam:** `energia_das_portas` e `vizinhanca_das_portas`;
* **somem da tela:** `energia_do_radio`, `suporte_ao_controle` e `pareamentos`;
* **entram três que não existem em check nenhum:** exclusividade do controlador
  USB dos controles no cabo, contagem de rádios vizinhos, e "Nenhuma outra ordem
  de serviço pendente".

E o contrato é explícito: *"Selo do exame, carimbo de idade, cinco linhas —
**ficam**"* (`docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 8, "Nada
se perdeu"). Ligar a página como ela está desenhada **apaga três diagnósticos
reais e acende três que ninguém calcula** — e o mais caro dos três apagados é o
`pareamentos`, que é a explicação do sintoma mais comum desta casa.

## O que entrega

1. **As cinco linhas saem das cinco chaves.** `dados(host, estado)` devolve, por
   chave: o **selo** (`ok` / `warn` / `info`), a **frase**, e a **dica** com "o
   que eu vi" e "por que importa" (`DICAS_DAS_LINHAS`, `secao_exame.py:237`).
   Nada é digitado na página: cada linha ganha `data-v="exame.<chave>.selo"` e
   `…frase`, e o Python pinta as cinco.
2. **O selo do quadro é o mais grave das cinco**, por `o_mais_grave`
   (`secao_exame.py:387`), e as contagens do cabeçalho por
   `contagens_do_cabecalho` (`:413`). Recalcular na página seria a segunda
   verdade.
3. **O carimbo é `frase_de_quando`** (`secao_exame.py:311`), não um "há 3
   minutos" escrito na página.
4. **Os quatro botões**, na ordem que ela escreveu: *Examinar de novo · Já movi —
   reexaminar · Ignorar · Ver as ordens ignoradas*, cada um com `data-g`.
   "Reexaminar a mesa" **funde** com "Examinar de novo" — dois botões que releem
   a mesma coisa (contrato, "Nada se perdeu").
5. **As três linhas inventadas: ou saem, ou viram check.** Esta sprint **não
   escolhe** — ver abaixo. O que ela entrega é o mecanismo pelo qual as cinco
   linhas da tela são as cinco do produto, **qualquer que seja o conjunto**: um
   check novo em `exame_da_mesa.py` aparece na tela sem tocar o gerador.
6. **`montar()` sai, `dados()` entra**, e as 17 chamadas a `Gtk.` deste módulo
   somem. O refresher continua se chamando `_refresh_saude_da_mesa`
   (`secao_exame.py:164`) — quem o pendura passa a ser o `pagina.py`.  <!-- ref-externa: o módulo nasce na MIGRA-CONEXOES-01, e a ausência é o assunto -->

## Como se prova (a mordida)

`tests/unit/test_migra_conexoes_o_exame_mostra_o_que_confere.py`:

* **as chaves da tela são as chaves do produto, LIDAS dos dois lados.** O teste
  colhe as chaves emitidas por `exame_da_mesa.leitura_do_sistema()` (dublê) e as
  chaves `data-v="exame.*"` do HTML gerado, e exige **igualdade de conjuntos**.
  Nenhuma lista de cinco nomes escrita à mão — é exatamente a régua que as onze
  de 26/08 não foram. **Mordida:** apague o `pareamentos` de um dos dois lados e
  o teste diz **qual** lado ficou sem.
* **um check novo aparece sozinho.** Acrescente uma sexta chave no dublê: a
  página mostra seis linhas, sem mudar o gerador. **Mordida:** se a tela ignorar
  a chave nova, é porque alguém cravou cinco.
* **o selo do quadro é derivado.** Com uma linha `warn` entre quatro `ok`, o selo
  do quadro é o `warn`. **Mordida:** calcule o selo na página e veja divergir do
  `o_mais_grave`.
* **o carimbo vem de `frase_de_quando`.** Congele o relógio e confira a frase.
  **Mordida:** escreva "Examinado há 3 minutos" na página e o teste reprova — é
  o mesmo defeito dos oito literais que esta aba já pagou.
* **um Examinar só.** Contar os gestos de reexame no HTML → exatamente **1**
  (mais o "Já movi", que é outro gesto e diz outra coisa).
* **nada afirma o que não foi conferido.** Nenhuma frase da tela aparece sem uma
  chave por trás. **Mordida:** deixe a linha "Nenhuma outra ordem de serviço
  pendente" sem chave e veja reprovar.

## O que é dela decidir

* **AS TRÊS LINHAS QUE O MOCKUP TROCOU: VOLTAM OU SAEM?** Voltam
  `energia_do_radio`, `suporte_ao_controle` e `pareamentos` — e esta última é a
  que avisa que o controle vai cair logo depois de conectar. Saem, ou viram check de verdade,
  as três novas. O contrato diz *"cinco linhas — ficam"*; a tela que ela aprovou
  mostra outras cinco. **É a única contradição desta onda entre dois documentos
  que ela mesma aprovou**, e nenhuma sprint a resolve sozinha.
* **O carimbo de idade fica?** Ela mandou tirar o carimbo na aba Perfis. Aqui ele
  é do exame — o exame envelhece, e sem carimbo a tela afirma o presente com dado
  de dez minutos atrás. A distinção precisa da palavra dela (aberto desde 27/08).
* **O exame se refaz sozinho?** Dela, de 27/08, sobre o "Examinar de novo":
  *depende de o exame se refazer sozinho ou não — e isso ninguém decidiu*. Se ele
  se refizer, o botão perde metade da razão de existir; se não, o carimbo é
  obrigatório.
