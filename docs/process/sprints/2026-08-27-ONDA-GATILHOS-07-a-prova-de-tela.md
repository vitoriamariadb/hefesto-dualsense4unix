---
# onda: GATILHOS
sprint: ONDA-GATILHOS-07
estado: absorvida
posse:
  G7:
    - docs/usage/assets/readme_gatilhos.png
    - docs/usage/interface.md
cria: []
bancada: false
depois_de:
  - ONDA-GATILHOS-01
  - ONDA-GATILHOS-02
  - ONDA-GATILHOS-03
  - ONDA-GATILHOS-04
  - ONDA-GATILHOS-05
  - ONDA-GATILHOS-06
nao_toca:
  - src/
  - tests/
  - novo-layout/
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 03). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA GATILHOS · 07 — a prova de tela

**O defeito em uma frase:** seis sprints podem fechar verdes e a aba ainda não
parecer o mockup — e nesta casa **interface só fecha com o olho dela**.

> *"Sempre vai validando via navegador."*
> *"Faça todos os ajustes. Aba a aba valida com calma."*
> — `src/hefesto_dualsense4unix/interface/CORRECOES-DELA.md:71,73`

Regra da casa, PROVA-DE-TELA-01: foto antes e depois, e **a palavra final é
dela**.

**Esta sprint é de quem coordena, não de agente executor.**
`scripts/gui-captura/retratar_abas.py` reescreve as onze fotos de uma vez, e o
protocolo proíbe agente de rodá-lo (`COMO-EXECUTAR-UMA-SPRINT.md`, §5).

## O antes, que já está no disco

`docs/usage/assets/readme_gatilhos.png` é a foto de hoje: duas molduras, grade
de 19 modos em três colunas, *"Sem resistência."* solta numa linha, e no pé
"Aplicar em L2" + "Desligar". **Não a sobrescreva sem guardar cópia** — é o
"antes" da prova.

## A conferência, item a item

Cada linha sai do mockup ou do contrato. Confira **na foto**, não no código.

| # | O que tem de estar na tela | Fonte | Sprint |
|---|---|---|---|
| 1 | Um quadro só, título **"Seleção de Gatilho"** | `aba03.py:107,120` | 02 |
| 2 | Duas colunas, filete no meio, títulos "Gatilho esquerdo `L2`" / "Gatilho direito `R2`" | `aba03.py:78` | 02 |
| 3 | 19 modos em **duas** colunas por lado | `aba03.py:14` | 02 |
| 4 | Nenhum "Aplicar em L2/R2", nenhum "Desligar" | `aba03.py:122-124` | 02 |
| 5 | Nenhum banner no topo (nem estilo, nem DSX) | `aba03.py:121` | — |
| 6 | Rótulo "Efeito pronto:" **presente nos 19 modos**, sem brotar | `O-REDESENHO:257` | 04 |
| 7 | "──── Meus efeitos ────" abaixo dos prontos | `aba03.py:93-95` | 05 |
| 8 | Caixa de ajustes com a **mesma altura** em "Desligado" e em "Metralhadora" | `aba03.py:26` | 02 |
| 9 | "Este modo não tem o que ajustar." nos modos sem barra | `aba03.py:75` | 02 |
| 10 | Nenhuma frase em itálico solta (a descrição é dica do botão) | `O-REDESENHO:291` | 02 |
| 11 | "?" sensível ao lado do título, com a ressalva do "escreveu ≠ obedeceu" | `aba03.py:109-117` | 02 |
| 12 | Recibo no pé do quadro dizendo **os dois lados** | `aba03.py:100-103` | 03 |
| 13 | Botão **"Guardar esse efeito"** à direita do recibo | `aba03.py:104` | 05 |
| 14 | Barras com o número à direita, monoespaçado | `aba03.py:34` | 02 |
| 15 | Fita "Ajustes vão para" no topo e crachá "Perfil ativo" à direita | `03-gatilhos.html:434-450` | — |
| 16 | Rodapé com Aplicar · Salvar Perfil · Importar · Exportar | `03-gatilhos.html:606-612` | — |

Os itens **5, 15 e 16 não são desta onda** — vêm da moldura da janela e das abas
que a montam. Estão na lista porque a foto os mostra, e porque ausência não
notada é o defeito que a régua existe para pegar.

**O que a foto NÃO prova:** que o gatilho chegou ao aparelho. Não existe canal
de leitura de gatilho no protocolo — `gatilho.leitura` é *não/não* nos dois
transportes em `docs/data/mapa-controles.csv`. A prova de que o byte saiu é a
mordida das sprints 01 e 03, não o PNG.

## Como se prova

1. `scripts/gui-captura/retratar_abas.py` — uma execução, nenhum clique;
2. **leia o PNG** (a ferramenta de leitura enxerga imagens; é mais rápido e mais
   fiel que qualquer alternativa) e percorra as 16 linhas;
3. abra `layout/03-gatilhos.html` ao lado e compare;
4. o que divergir vira linha em *"o que sobrou para o próximo"* — **não** vira
   conserto improvisado nesta sprint;
5. a foto vai para ela, e **a palavra final é dela**.

**Nunca clicar por coordenada para focar a janela** — já caiu noutro aplicativo
duas vezes, e um clique cego já desfez configuração dela
(`docs/process/COMO-OLHAR-A-TELA.md`).

## O que é dela decidir

A aba inteira. É o ponto do processo em que ela olha e diz se fechou.
