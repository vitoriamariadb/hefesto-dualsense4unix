---
sprint: VIBRACAO-O-QUE-SOBROU-01
estado: aberta
onda: G
posse:
  VIB:
    - src/hefesto_dualsense4unix/interface/pacotes/a05_vibracao.py
    - src/hefesto_dualsense4unix/app/actions/rumble_actions.py
    - src/hefesto_dualsense4unix/app/actions/status_actions.py
cria:
  - tests/unit/test_a_vibracao_nao_manda_num_botao_que_nao_existe.py
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/interface/aba05.py
  - mockup/
  - src/hefesto_dualsense4unix/profiles/
  - docs/data/
---

# VIBRAÇÃO · O QUE SOBROU — a frase que manda num botão que não existe, e o Aplicar que retrava

> **ROTA — 06/09/2026, arrumação da leva (Fable, PO por delegação).** Esta sprint nasceu da
> definição de pronto dela — *"migrar tudo do gtk pro html … todas as features funcionando"* —
> medida contra o CSV da paridade: as linhas abaixo estavam `FALTA_NO_HTML` **sem nenhuma
> sprint aberta encarregada**. O enunciado de cada uma é a própria linha do CSV.

Duas coisas pequenas e ambas de perda silenciosa. (1) Uma frase do produto (`status_actions` e o rótulo de estado, `rumble_actions.py:1106`) manda clicar num botão **que a interface nova não tem** — é instrução impossível, e a régua da palavra da casa reprova frase que manda procurar botão inexistente. Cure no DONO. (2) Com `rumble.weak/strong` não-zero no perfil em disco, um gesto que reaplique o perfil **re-trava** a vibração que o Parar soltou — a causa é o `to_ipc_dict` emitir a seção `rumble` sempre; a cura da ABAS-04 na GTK era zerar no rascunho, e aqui não há rascunho: meça qual gesto do HTML reaplica e feche por onde ele passa.

---

## 1. AS LINHAS DO CSV QUE ESTA SPRINT FECHA — o enunciado é a linha

### Linha 177 — Deixar o jogo controlar a vibração (o botão de devolver, sozinho)

* **O dono na GTK (reuse, não reescreva):** `src/hefesto_dualsense4unix/app/actions/rumble_actions.py:1106 · src/hefesto_dualsense4unix/gui/main.glade:2028 · src/hefesto_dualsense4unix/gui/main.glade:101`
* **O que ele faz:** `on_rumble_passthrough`: `rumble_passthrough(True)`, zera as escalas e grava `passthrough=True` no rascunho. É o antídoto do 'Parar', e o banner do cabeçalho manda clicar nele PELO NOME.
* **Por que falta:** O produto tem uma frase de tela — em `status_actions` e no rótulo de estado — que manda clicar num botão que a interface nova NÃO TEM. Enquanto o 'Parar' do HTML devolver sozinho, ninguém fica travado; mas qualquer mensagem que cite o nome do botão vira instrução impossível.

### Linha 182 — Zerar weak/strong (e o passthrough) no rascunho ao parar ou devolver

* **O dono na GTK (reuse, não reescreva):** `src/hefesto_dualsense4unix/app/actions/rumble_actions.py:1043 · src/hefesto_dualsense4unix/app/actions/rumble_actions.py:1091 · src/hefesto_dualsense4unix/app/actions/rumble_actions.py:1124 · src/hefesto_dualsense4unix/app/actions/rumble_actions.py:1231`
* **O que ele faz:** `_zerar_rumble_no_rascunho` baixa weak/strong no rascunho no 'Parar' e no fim do teste, e escreve `passthrough=True` no 'Devolver' e no fim do teste. Sem isso, o próximo 'Aplicar' de QUALQUER aba re-travava a vibração que ela acabara de mandar parar (ABAS-04).
* **Por que falta:** O sintoma que ABAS-04 curou volta pelo caminho do HTML: se o perfil no disco tiver `rumble.weak/strong` não-zero, um 'Aplicar' do rodapé re-manda esses valores e re-trava a vibração que o 'Parar' da coluna acabou de soltar. A causa é a mesma (o `to_ipc_dict` emite a seção `rumble` sempre) e aqui não há a escrita compensatória. || REMEDIDA em 06/09/2026 pela PARIDADE-REMEDIR-01: metade da linha fechou e a outra metade é a que carrega o sintoma. Continua FALTA_NO_HTML porque o `_zerar_rumble_no_rascunho` da GTK faz DUAS coisas e o HTML faz uma — com um `rumble.weak/strong` não-zero no disco, o "Aplicar" do rodapé ainda re-manda os dois.

## 2. O QUE FICA FORA, E POR QUÊ

* **A explicação do modo Auto** e **a linha 'Estado da vibração'** — saíram por decisão dela em 05/09 (*"segue os três modos sempre"*, *"remove ela não faz sentido"*). Ficam `FALTA`, e ficam fora.
* **Aplicar (fixar a vibração)** — pela mesma decisão o estado é sempre o jogo mandando; fixar uma vibração contínua contradiz a palavra dela. Fora, declarado.


## AS REGRAS DESTA SPRINT — e são as da casa

1. **A linha do CSV é o enunciado.** `docs/data/paridade-gtk-html.csv` é o dono do fato;
   a coluna `gtk_onde` diz QUEM já faz isso no motor. **Você LÊ do dono e liga à tela** —
   reescrever a lógica em `interface/` é a segunda cópia, que é o defeito que onze réguas
   desta casa já tiveram. Se o dono precisar de um ajuste, ele é seu só se estiver na
   `posse:`; senão, RELATE.
2. **Texto de tela vem do glossário** (`docs/A-LINGUA-DESTA-CASA-…`): cabo/rádio, nunca
   usb/bt; "mesa" não entra; "serviço", não daemon. Frase nova é frase do DONO em `app/`
   (`app/textos_de_aplicacao.py`, `app/actions/*`) — o pacote a importa.
3. **Cada linha fecha com a MORDIDA da casa:** arranque a cura e a régua reprova. E com a
   PROVA DE TELA: foto `--oculta` antes e depois, e o clique de verdade pela ponte JS
   (`--prova-clique`/`--prova-gesto`), nunca o mouse dela.
4. **O CSV da paridade NÃO é sua posse.** Você entrega, no relatório, o texto pronto da
   linha (veredito · `sinal` que existe no CÓDIGO do lado HTML · `html_onde` · `html_faz`)
   — a PARIDADE-REMEDIR-02 recolhe no fim. O `sinal` tem de ser código, nunca prosa
   (`D-0609-O-SINAL-DA-PARIDADE-NAO-E-PROSA`).
5. **Se um passo esbarrar em decisão de produto**, decida como PO por delegação, registre
   em `docs/data/decisoes-dela.csv` com `quem_decidiu=delegacao` e REVERSÍVEL NUMA FRASE, e
   siga. Não pare.
6. A ordem de precedência (aparelho > mapa > sprint) está no preâmbulo do despachante.
