---
sprint: SISTEMA-OS-QUATRO-QUE-FALTAM-01
estado: feita
onda: G
posse:
  SIS:
    - src/hefesto_dualsense4unix/interface/pacotes/a09_sistema.py
    - src/hefesto_dualsense4unix/interface/aba09.py
    - mockup/09-sistema.html
    - src/hefesto_dualsense4unix/app/actions/daemon_actions.py
    - src/hefesto_dualsense4unix/app/actions/footer_actions.py
cria:
  - tests/unit/test_os_quatro_gestos_da_aba_sistema_que_faltavam.py
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - install.sh
  - docs/data/
---

# SISTEMA · OS QUATRO QUE FALTAM — corrigir modo, aplicar aos jogos, restaurar, e o recibo

> **ESTADO 2026-09-06: feita** — os três gestos que faltavam nasceram
> (`corrigir-modo`, `aplicar-aos-jogos`, `restaurar-de-fabrica`), `SEM_MOTOR`
> ficou VAZIA, os dois botões novos entraram na bancada (o do modo improvisado
> nasce escondido e troca de lugar com o «Reiniciar o serviço») e o recibo da
> L323 foi MEDIDO no WebKit nos três que ninguém tinha clicado — `retomar`,
> `reiniciar` e `autostart` piscam verde, e o que recusa não pisca. Entrega em
> `docs/process/agentes/2026-09-06/SISTEMA-OS-QUATRO-QUE-FALTAM-01-opus.md`.

> **ROTA — 06/09/2026, arrumação da leva (Fable, PO por delegação).** Esta sprint nasceu da
> definição de pronto dela — *"migrar tudo do gtk pro html … todas as features funcionando"* —
> medida contra o CSV da paridade: as linhas abaixo estavam `FALTA_NO_HTML` **sem nenhuma
> sprint aberta encarregada**. O enunciado de cada uma é a própria linha do CSV.

A SISTEMA-STEAM-01 de hoje fechou dois dos cinco botões (Refazer os consertos, e o tique de 1.341 ms → 18,6 ms); **estes três ficaram, e o relatório dela diz isso** (§"o que não fiz"). Os donos existem no motor: `daemon_actions.py:2409` (corrigir modo de execução → systemd), `:1360` (aplicar aos jogos da Steam — a metade que APLICA o que o Copiar só entrega), `footer_actions.py:1477` (restaurar de fábrica). Todos os três **mexem na máquina dela**: são `@gesto(..., grava=…)`, entram em `PERIGOSOS` pelo decorador e ficam fora do `--prova-gesto`. **O recibo:** `retomar`, `atualizar`, `autostart` e `reiniciar` agem e o sucesso é mudo — a piscada verde da `03-Q4` (`hef-deu-certo`) é o recibo da casa; ligue-os a ela, e o `atualizar` de 9,5 s ganha o estado "em andamento" que o piloto já sabe pintar.

---

## 1. AS LINHAS DO CSV QUE ESTA SPRINT FECHA — o enunciado é a linha

### Linha 315 — Botão "Corrigir modo de execução" (migrar para systemd)

* **O dono na GTK (reuse, não reescreva):** `src/hefesto_dualsense4unix/app/actions/daemon_actions.py:2409 · src/hefesto_dualsense4unix/app/actions/daemon_actions.py:1968 · src/hefesto_dualsense4unix/gui/main.glade:2811`
* **O que ele faz:** Aparece SÓ quando o estado é `online_avulso`. Lê o pid do daemon avulso, manda SIGTERM, sobe a unit pelo systemd e repinta a aba, com recibo em português nos dois desfechos.
* **Por que falta:** FATO DERRUBADO EM 03/09/2026, e a linha volta a FALTA_NO_HTML: ela tinha sido promovida a DIFERENTE porque o símbolo `_aplicar_sensibilidade_ligar_desligar` "apareceu no lado HTML" — e ele aparece em `a09_sistema.py:1251`, DENTRO DE UM DOCSTRING que cita a cura da janela antiga. A régua leu a palavra e contou como ato. O par do defeito "Estado do serviço" continua aberto pela metade que sobra: o HTML já RECONHECE `online_avulso` (a linha acima fechou), mas não oferece a saída — quem cair no modo avulso é avisado e não tem botão de conserto. O handler é `daemon_actions.on_daemon_migrate_to_systemd:2409`; o botão aparece só naquele estado, e um botão que nasce e some é desenho — decisão dela. || CONFERIDA em 06/09/2026 pela PARIDADE-REMEDIR-01 e MANTIDA: os onze `@gesto("09-sistema.html", …)` de `a09_sistema.py` foram lidos um a um e nenhum é este.

### Linha 323 — Recibo do gesto (barra de estado / toast)

* **O dono na GTK (reuse, não reescreva):** `src/hefesto_dualsense4unix/app/actions/daemon_actions.py:2298 · src/hefesto_dualsense4unix/app/actions/daemon_actions.py:1227 · src/hefesto_dualsense4unix/app/actions/daemon_actions.py:1586 · src/hefesto_dualsense4unix/app/actions/daemon_actions.py:1898 · src/hefesto_dualsense4unix/app/actions/daemon_actions.py:2084 · src/hefesto_dualsense4unix/app/actions/daemon_actions.py:2662`
* **O que ele faz:** Quase toda ação escreve na barra de estado da aba: "Reiniciando o Hefesto…", "Hefesto reiniciado.", "Aplicando correções (não pede senha)…", "Deixando tudo pronto…", "Verificando o Proton pinado…", "Olhando os jogos instalados…", e o resultado final com o que rodou e o que faltou.
* **Por que falta:** CONTINUA ABERTA, e o inventário mudou: `retomar`, `atualizar`, `autostart` e `reiniciar` agem de verdade e o SUCESSO é mudo — a recusa fala, o acerto não. O `atualizar` ainda demora 9,5 s sem uma palavra, e agora relê a aba no fim (o que se vê são os valores mudando, não um recibo). A cura é uma primitiva de recado no piloto (`interface/hefesto_vivo.py`), que é território de outra frente.

### Linha 340 — Steam — "Aplicar aos jogos da Steam"

* **O dono na GTK (reuse, não reescreva):** `src/hefesto_dualsense4unix/app/actions/daemon_actions.py:1360 · src/hefesto_dualsense4unix/app/actions/daemon_actions.py:1373 · src/hefesto_dualsense4unix/gui/main.glade:3021`
* **O que ele faz:** Diálogo de confirmação temado e não-bloqueante, e então aplica o wrapper a TODOS os jogos instalados preservando as opções existentes, com backup ao lado de cada arquivo, pedindo permissão para fechar a Steam por ~20 s se ela estiver aberta.
* **Por que falta:** É a metade que APLICA o que o "Copiar" só entrega na área de transferência. Os dois faltam juntos, e sem os dois a interface nova não tem caminho nenhum para o wrapper de launch. || CONFERIDA em 06/09/2026 pela PARIDADE-REMEDIR-01 e MANTIDA: continua sem botão e sem gesto. E agora ela tem ENDEREÇO decidido — `D-0609-STEAM-DIVIDIDO` põe "Aplicar aos jogos" nesta aba, a 09.

### Linha 343 — "Restaurar de fábrica" (devolver o meu_perfil ao asset original)

* **O dono na GTK (reuse, não reescreva):** `src/hefesto_dualsense4unix/app/actions/footer_actions.py:1477 · src/hefesto_dualsense4unix/gui/main.glade:4269 · src/hefesto_dualsense4unix/app/gui_dialogs.py:696`
* **O que ele faz:** Confirma num diálogo (`gui_dialogs.confirm_restore_default`), copia o asset para o `profiles_dir`, adota como perfil ativo, recarrega o `DraftConfig` e dispara refresh de todas as abas — trocando draft e NOME como unidade, para o "Salvar Perfil" seguinte não sobrescrever o perfil anterior.
* **Por que falta:** FATO DERRUBADO EM 03/09/2026, e a linha volta a FALTA_NO_HTML: ela tinha sido promovida a DIFERENTE porque `gui_dialogs.confirm_restore_default` "apareceu no lado HTML" — e ele aparece em `a09_sistema.py:1521`, dentro da STRING que declara por que este gesto continua sem dono. A régua leu a palavra e contou como ato. É o gesto mais destrutivo da página e o que menos acontece; o caminho existe (a aba Lançadores confirma em dois cliques desde 03/09) e adotá-lo aqui muda o rótulo de um botão que ela aprovou — decisão dela. || CONFERIDA em 06/09/2026 pela PARIDADE-REMEDIR-01 e MANTIDA: `restaurar-de-fabrica` é o ÚNICO nome que sobra em `a09_sistema.SEM_MOTOR` (eram três até 06/09), e a razão escrita lá não é mais o motor — é a rede de segurança: um gesto que chame `save_profile` restaura o `meu_perfil` DELA quando a régua de clique o acionar. `D-0609-STEAM-DIVIDIDO` confirma que ele mora nes

## 2. O QUE FICA FORA, E POR QUÊ

* **A conta de slots por adaptador de rádio** — o assunto é o adaptador, e vai para a CONEXOES-A-LUZ-QUE-NAO-ACENDE-01 (aba 08), com o censo do gabinete do lado.


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
