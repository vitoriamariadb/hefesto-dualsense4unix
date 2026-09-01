---
sprint: MIGRA-SISTEMA-02
# onda: MIGRA-SISTEMA (a aba 09, no motor novo)
posse:
  M2:
    - layout/_ferramentas/aba09.py
    - layout/09-sistema.html
cria:
  - novo-layout/_ferramentas/regua_enderecos09.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-PILOTO
nao_toca:
  - src/
  - tests/
  - layout/_ferramentas/monta.py
  - layout/_ferramentas/topo.html
---

# MIGRA SISTEMA · 02 — A página ganha endereço

**O defeito:** a página que o `WebView` vai carregar **não tem por onde ser
alcançada**. Medido hoje em `layout/09-sistema.html`: a página inteira tem
**três** `id=` — `ring`, `flameOut` e `flameIn` (`:565`, `:570`, `:574`), e os
três são filtros do SVG do logotipo. **Nenhum valor da tela tem endereço.**

São **19 valores** e **12 gestos** anônimos no DOM. O Python pode pintar por
`run_javascript`, mas só alcança o que sabe nomear — e hoje o único caminho
seria contar filhos (`querySelector(".est:nth-child(3) .val")`), que é a régua
mais frágil que existe: qualquer linha nova reindexa todas.

**Mudar atributo não muda pixel** — mas **é mudança no gerador dela**, e por
isso está declarada aqui em vez de escondida dentro de outra sprint.

## O que entrega

1. **Um endereço por valor**, no gerador (`aba09.py`), nunca no HTML à mão — o
   HTML é saída. Os helpers `est()` (`:355`), `saude()` (`:381`), `item()`
   (`:395`) e `sel()` (`:402`) ganham um parâmetro de identidade e o emitem como
   `data-id`. **`data-` e não `id`**: `id` é espaço global e a página já tem o
   SVG do logotipo dentro dela, com ids que o `monta.py:439` prefixa.

2. **Os 19 valores**, agrupados pela faixa que os contém:

   | faixa | valores | endereço sugerido |
   |---|---|---|
   | O Hefesto | O Hefesto está · Pausado · Trocar de perfil ao abrir o jogo · Como ele enxerga a janela · Ligar junto com o computador (a chave) | `hefesto-estado`, `hefesto-pausa`, `hefesto-troca-de-perfil`, `hefesto-ambiente`, `hefesto-autostart` |
   | Perfil de Bateria | o `<select>` · O que ele impõe · Vale para · a frase do teto | `bateria-perfil`, `bateria-impoe`, `bateria-vale-para`, `bateria-frase` |
   | O exame de hoje | a contagem (`8 linhas · nenhum aviso`) · a **lista** de achados | `exame-contagem`, `exame-lista` |
   | Detalhes técnicos | as quatro linhas do painel | `registro-texto` |

3. **A lista de achados é UM endereço, não oito.** O exame varia de **6 a 8
   linhas** hoje (`storm_report` devolve seis, e as duas condicionais —
   `medir_guarda_do_steam_input:735` e `medir_prontuario_dos_jogos:807` —
   devolvem `None` quando não há o que dizer). Dar endereço a `achado-1`..`8`
   congelaria em oito o que o produto não congela. **O Python entrega a lista; a
   página a desenha.** As duas colunas continuam sendo `MEIO = len//2 + len%2`,
   que já é o que o gerador faz (`aba09.py:463`).

4. **Os 12 gestos**, com o nome do que fazem e não do que parecem:
   `retomar`, `reiniciar`, `atualizar`, `desligar`, `autostart`,
   `perfil-da-mesa`, `refazer-consertos`, `refazer-proton`, `procurar-camadas`,
   `restaurar-de-fabrica`, `ver-plugins`, `ver-detalhes`.

5. **O SVG do logotipo não muda.** `nao_toca` inclui `monta.py` e `topo.html`
   justamente por isso: os **84 filtros mortos** das cinco abas são cura pronta,
   **não aplicada**, e são dela — mudam 1,09% do desenho que ela aprovou.

## Como se prova (a mordida)

A régua **não pode viver em `tests/unit/`**, e isso é fato medido, não
preferência: `novo-layout/` é **`.gitignore:108`**. Um teste em `tests/` que
lesse a página **passaria em branco** em toda árvore de agente e no CI — a
régua cega que esta casa já pagou seis vezes em quinze horas. Ela vive em
`novo-layout/_ferramentas/regua_enderecos09.py`, ao lado do `regua.py` e do
`regua_estados.py`, **até a moldura decidir a casa nova do HTML**; no dia em que
o HTML mudar para dentro de `src/`, ela vira teste em `tests/unit/`.

A régua:

- **conta os endereços contra o gerador, não contra um número escrito.** Ela lê
  `len(ACHADOS)` e a lista de faixas do próprio `aba09.py` e exige o mesmo
  tanto no HTML. **Digitar `19` nela é o defeito que este gerador existe para
  evitar** — ele já lê `len(ACHADOS)` para a contagem da tela (`:582`);
- **morde:** tire o `data-id` de **um** valor no gerador, regere, e a régua
  reprova **dizendo qual**. Uma régua que só diz "faltou um" manda a próxima
  pessoa procurar em 800 linhas;
- **nenhum endereço duplicado.** Dois `data-id` iguais fazem o `run_javascript`
  pintar o primeiro e calar sobre o segundo — sem erro, sem log;
- **o pixel não mudou.** Foto antes e depois com `layout/_ferramentas/olhar.py`,
  no **mesmo** Chrome e no **mesmo** tamanho, e a diferença tem de ser **zero**.
  Se mudou, o `data-` pegou um seletor CSS por acidente. **Atenção:** o
  `scrollIntoViewIfNeeded` do Playwright **rola antes de medir** e cega toda
  medição de layout feita depois — foi assim que um portão deu verde sobre uma
  linha fora da caixa (27/08). Meça sem rolar;
- **o miolo continua cabendo.** `aba09.py:38` grava `MIOLO_H, ALTURA = 542,
  540` — **dois pixels de folga, e é número de foto.** A régua confere que o
  `ALTURA` recalculado não passou de `MIOLO_H`.

## O que é dela decidir

Nada nesta sprint muda o que ela vê. Se o olho dela pegar um pixel diferente
depois da regeração, **a mudança volta atrás** — o desenho aprovado vence o
endereço.
