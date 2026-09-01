# Onde paramos — a migração definitiva, 01/09/2026

> **Leia isto antes de tocar em qualquer coisa.** Ele existe porque a Vitória
> desligou o PC no meio da migração e pediu, com estas palavras: *"salva tudo e
> materializa tudo dos agentes que rodaram buscas no projeto e bota um plano
> pra execução pro proximo claude po e orquestrador executar e seguir o que vc <!-- noqa-acento: citação literal, a fala dela não se corrige -->
> sabe fazendo do seu jeito. até a questao da senha sudo. no exato ponto onde
> estamos."*

---

## 1. O QUE ELA DECIDIU, E QUE NÃO SE REABRE

Estas não são sugestões. São escolhas dela, ditas em 01/09/2026:

1. **A interface antiga (GTK) MORREU.** Palavras dela: *"A versão antiga não
   segue disponível vai gerar confusão nos agentes. Só a nova tá disponível e
   deve ser integrada."* Não proponha manter as duas. Não proponha um modo de
   compatibilidade. O `src/hefesto_dualsense4unix/gui/` e o `app/` continuam no
   disco **só como peça de reuso e como referência histórica** — *"no máximo
   usamos a versão estável pra vermos como funcionava e era chamado tal coisa
   anteriormente"*.

2. **`-dev` saiu de tudo.** Do nome da pasta, do `APP_ID`, do `.desktop`, da
   unit, do WM_CLASS, das pastas XDG. A pasta dela é
   `/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix`, na branch `dev`. A
   árvore antiga ganhou `-estavel` no nome. *"o -dev sai de tudo não quero mais
   essa confusão."*

3. **Não se reescreve do zero.** *"não temos que criar o app do zero ele já
   existe e funciona"*, *"em todas as abas temos praticamente tudo pronto"*. A
   camada a reusar é `app/ipc_bridge.py` — 36 funções, zero GTK. Ver a seção 5.

4. **Clicar já aplica.** Nada de rascunho, nada de estado morto na tela. *"clicar
   na cor já deveria aplicar a cor no controle"*.

5. **Validação é no aparelho, botão a botão.** *"no aparelho por favor valida
   botão a botão tá bom?"* — e depois: *"quero que faça tudo como user / aba a
   aba"*. "Aplicado" não prova nada; o instrumento já mentiu de três jeitos
   diferentes nesta casa.

---

## 2. O PONTO EXATO ONDE PARAMOS

Commit `6f7e0119`, branch `dev`, árvore limpa.

### Está feito e provado

| O quê | Estado |
|---|---|
| Interface dentro do `src/` | `src/hefesto_dualsense4unix/interface/` — entra na wheel |
| Console-script | `hefesto-dualsense4unix-gui` → `interface.hefesto_vivo:main` |
| Purge do `-dev` | completo: nome, pasta, `.desktop`, unit, XDG, WM_CLASS |
| `install-dev.sh` | virou o instalador único; `APP_ID` sem variante |
| Ruff, repo inteiro | **727 → 0** |
| Os 12 ganchos do pre-commit | **todos verdes** |
| Gestos ligados e validados no aparelho dela | **48**, nas dez abas |
| Réguas novas | 5 (`test_os_botoes_tem_dono`, `test_o_casamento_das_dez`, `test_o_rodape_das_dez`, `test_a_bancada_de_bt_tem_regua`, `test_a_rota_do_alto_falante_chega_ao_estado`) |
| Portão 0.9.5 | `scripts/check_bancada_de_bt.py` — a escada de releases o nomeava e ele **não existia**. Existe. Acusa 183 pendências, e isso é o veredicto correto. |

### NÃO está feito

| O quê | Tamanho |
|---|---|
| **35 botões sem dono** | ver a tabela na seção 3 |
| Aba Conexões delegando ao `gui/aba_conexoes.py` | o código existe, **nunca foi chamado** |
| A suíte completa | não roda desde antes do commit `6f7e0119` |
| As 110 sprints MIGRA | **0 fechadas** — ver `docs/process/2026-09-01-A-AUDITORIA-DAS-DEZ-ONDAS-MIGRA.md` |

---

## 3. OS 35 BOTÕES SEM DONO — a ordem de ataque

Medido em 01/09/2026 com o script no fim desta seção. **Rode-o antes de
começar**: o número muda, e trabalhar sobre um número velho é como esta casa
já se enganou várias vezes.

| Aba | Sem dono | Quais |
|---|---|---|
| `06-navegacao.html` | **13** | `acao-do-gesto` `guardar-definicoes` `guardar-ponto` `guardar-remapeamento` `modo-steam` … |
| `08-conexoes.html` | **10** | `escolher-aparelho` `escolher-entrada` `luz-nao-acende` `mic-escopo` `nova-entrada` … |
| `09-sistema.html` | **9** | `autostart` `desligar` `procurar-camadas` `refazer-consertos` `refazer-proton` … |
| `01-jogar.html` | 2 | `mascara` `modo-steam` |
| `03-gatilhos.html` | 1 | `guardar` |
| 02, 04, 05, 07, 10 | **0** | fechadas |

**A ordem é essa mesma** — 06, 08, 09 primeiro, porque são 32 dos 35. E as três
podem ir em paralelo: o despachante dá território exclusivo por página
(`@gesto(pagina, nome)`), então três agentes em três pacotes diferentes não se
pisam.

```bash
# O censo. Rode ANTES de propor qualquer coisa.
.venv/bin/python - <<'PY'
import sys, re; sys.path.insert(0,'src')
from hefesto_dualsense4unix.interface import pacotes, onde
tem = {(p,g) for p,g in pacotes.GESTOS}
univ = {g for p,g in pacotes.GESTOS if p=="*"}
for html in sorted(onde.PUBLICADO.glob("[0-9][0-9]-*.html")):
    gestos = set(re.findall(r'data-gesto="([^"]+)"', html.read_text(encoding="utf-8")))
    sem = sorted(g for g in gestos if (html.name,g) not in tem and g not in univ)
    if sem: print(f"{html.name:22s} {len(sem):3d}  {' '.join(sem)}")
PY
```

**Atenção ao vocabulário.** `data-gesto` não é o único endereço. Vibração usa
`data-papel`+`data-lado`, Perfis usa `data-hef` (77 deles), o rodapé usa a
classe CSS `r-<nome>`. Por isso 05 e 10 aparecem com zero botões acima e mesmo
assim estão ligadas. O piloto cobre os quatro vocabulários — leia
`hefesto_vivo.py`, o `SELETOR`.

---

## 4. A QUESTÃO DA SENHA SUDO — leia antes de pedir qualquer senha

Ela ofereceu a senha do sudo nesta sessão, com estas palavras: *"nossa senha
[…] vc pode usar os agentes não."*

**A regra que eu segui, e que você deve seguir:**

1. **A senha NUNCA entra em arquivo nenhum.** Não em commit, não em log, não em
   documento, não em `.env`, não em script, não em comentário. Ela já pagou por
   isso: cinco commits com a senha dela foram para o `origin/main` público (ver
   a memória `senha-sudo-dela-no-historico-do-git`). A árvore atual está limpa e
   tem que continuar.

2. **A senha NUNCA vai para um agente.** Foi por isso que ela disse *"vc pode
   usar os agentes não"* — o prompt de todo subagente fica gravado no
   transcrito, e o transcrito é um arquivo. Ação com sudo é feita pelo
   orquestrador, na mão, no `Bash`, e nunca delegada.

3. **Ela dá a senha quando for preciso.** Não guarde, não persista, não peça
   "para deixar salvo". Se a sessão nova precisar de sudo (instalar a unit,
   mexer no BlueZ, `bt_ponte_privilegiada.sh`), peça a ela naquele momento.

4. **O jeito certo de ela rodar sozinha:** sugira que ela digite
   `! <comando>` no prompt do Claude Code. O `!` roda o comando na sessão dela e
   a saída cai na conversa — a senha não passa por você.

5. **O gancho global dela apaga menção a IA e co-autoria** nas mensagens de
   commit; e o `segredos-literais` cobre 9 fornecedores de chave. Trocar a senha
   dela exige trocar lá também.

---

## 5. COMO LIGAR UM BOTÃO — o caminho curto, com as três armadilhas

### A camada a reusar (nesta ordem)

1. **`app/ipc_bridge.py`** — 36 funções, zero GTK, payload montado, timeout
   pensado, recusa do daemon já traduzida em frase de tela. `pacotes/ponte.py` a
   expõe. **Procure aqui primeiro, sempre.**
2. **`cli/cmd_*.py`** — puros também.
3. **`ponte.chamar(metodo, …)`** cru — só para o que não existe nos dois de
   cima.

**Nunca `app/actions/*.py`**: são mixins GTK (`self._get`, `self._toast_light`),
a camada da janela que morreu.

### As três armadilhas medidas nesta casa

- **O nome do método IPC mente.** `lightbar.reset` se diz "instrumento de
  medição" e é o que devolve a luz ao jogo. `controller.target.set` não é
  máscara, é o alvo das ações de output. "Desligado" nos gatilhos é
  `trigger.reset` — `trigger.set` com `Off` arma a trava que pausa a troca
  automática de perfil. **Leia o handler em `daemon/ipc_handlers.py` antes de
  chamar.**

- **Pintar destrói `<select>`.** `select.textContent = "…"` apaga as `<option>`.
  Um agente mediu: 5 opções → 0.

- **`SEM_ECO`.** Alguns gestos o daemon não publica de volta: gatilho é comando
  de escrita, vibração é física, `maquina.json` é disco. Provar esses por
  `state_full` dá falso negativo — a prova tem que ser outra.

### O portão do desenho

O fluxo é **`mockup/` (bancada) → `interface/paginas/` (publicado)**, e quem diz
onde cada um mora é **`interface/onde.py`**. Nunca escreva a literal do caminho
num script: três portões faziam isso e, quando a pasta mudou, eles **morreram
num traceback de Playwright** em vez de reprovar. Pergunte ao `onde.py`.

Mudança de desenho **só entra no publicado com o OK dela**, aba por aba
(`scripts/check_o_desenho_aprovado.py --publicar`).

---

## 6. AS REGRAS DE SEGURANÇA QUE SEGUEM VALENDO

- **Toda janela nasce com `--oculta`.** Ela tem UMA tela. Uma janela na frente
  dela quebra o que ela está fazendo, e o mouse dela quebra o teste. Se
  precisar de janela visível, é no workspace `OS`, via
  `~/.config/zsh/scripts/aurora-claude-workspace.sh` (global dela, fora do repo).
- **MAC real nunca entra em arquivo versionado.** A máscara da casa zera os
  octetos 4 e 5 (`d42f4b4846d8` → `d42f4b0000d8`). Dois portões vigiam isso.
- **`install.sh` não roda nesta árvore.** Ele declara
  `readonly APP_ID="hefesto-dualsense4unix"` e sequestraria a instalação. O
  instalador desta árvore é o `install-dev.sh` — que, apesar do nome, **é o
  instalador único** desde 01/09. Renomeá-lo é trabalho pendente.
- **Nunca `git stash` puro.** O stash é compartilhado entre worktrees e outra
  sessão pode dar `pop` no seu. Se precisar guardar, é commit WIP.
- **Nunca `git checkout --` para desfazer uma mordida de teste.** Já custou
  trabalho duas vezes nesta casa. Faça cópia do arquivo antes.
- **`pkill -f hefesto_vivo.py` mata a sua própria sessão** — o padrão casa com a
  linha de comando do shell que o roda.

---

## 7. A ORDEM DE EXECUÇÃO PARA A PRÓXIMA SESSÃO

**Passo 0 — reconferir o chão (5 min).** O número de botões sem dono, os 12
ganchos, e a suíte. Não confie na tabela acima; ela envelhece.

```bash
source .envrc-voo
.venv/bin/ruff check .                      # tem de dar "All checks passed"
.venv/bin/python -m pytest tests/unit -q -x --timeout=120   # em OITO LEVAS, não de uma vez
```

**Passo 1 — os 32 botões das abas 06, 08 e 09.** Três agentes em paralelo, um
por pacote, território exclusivo pelo decorador. Cada agente entrega: o gesto
registrado, a régua que o morde, e o `arquivo:linha` do `ipc_bridge` que ele
reusou. **Sem `arquivo:linha`, não integre** — nesta casa um agente já afirmou
com confiança três coisas que não existiam.

**Passo 2 — os 3 que sobram** (01: `mascara`, `modo-steam`; 03: `guardar`).
Direto, sem agente.

**Passo 3 — a aba Conexões delega ao `gui/aba_conexoes.py`.** O código existe e
nunca foi chamado. Este é o defeito mais caro desta casa: *a cura escrita e
nunca ligada*. Procure por outras antes de investigar do zero.

**Passo 4 — validar no aparelho, botão a botão, como usuária.** Dois controles
conectados. Antes/depois do estado do daemon, e **desfazer tudo** no fim.

**Passo 5 — suíte completa, em oito levas.** Compare contra um worktree do
commit anterior; 60 falhas eram pré-existentes na última medição.

**Passo 6 — as sprints.** `docs/process/2026-09-01-A-AUDITORIA-DAS-DEZ-ONDAS-MIGRA.md`
tem as 110, auditadas uma a uma por dez agentes. Nenhuma fechada. É o mapa do
que falta para o produto, não uma lista de tarefas de interface.

---

## 8. O QUE OS AGENTES ACHARAM — materializado

Três workflows rodaram em 01/09, 22 agentes ao todo. O retorno de cada um está
em `docs/process/agentes/2026-09-01-migra-definitiva/`:

- **`onda-1-ligar-as-oito-abas.md`** (8 agentes) — um por aba, ligando botões.
- **`onda-2-segunda-leva-dos-botoes.md`** (4 agentes) — os que a onda 1 deixou
  sem dono, depois que o valor de `input`/`select` passou a chegar ao Python.
- **`onda-3-auditar-as-sprints-migra.md`** (10 agentes) — a auditoria das 110
  sprints, com o `arquivo:linha` que sustenta cada veredicto.

**Por que isso está no repositório e não só no transcrito:** o transcrito vivo
mora em `~/.claude/projects/`, numa pasta cujo nome ainda é o ANTIGO (com
`-dev`), e some quando a sessão for limpa. Ela pediu para materializar. Está
materializado.

---

## 9. UM ACHADO ABERTO QUE É DECISÃO DELA

`aba02.py` calculava `mic_trava` — a trava por posse do microfone, irmã da que o
alto-falante usa — e **jogava fora**. Os botões Virtual/Nativo nunca a
receberam.

Ligar a trava mudaria o desenho que ela aprovou: no mockup `mic_posse=False`, e
os dois nasceriam apagados. Por isso não liguei. A variável morta saiu do código;
**a pergunta é dela**:

> Quando o Hefesto não tem posse do microfone, os botões *Virtual* e *Nativo*
> devem ficar travados, como o do alto-falante fica?
