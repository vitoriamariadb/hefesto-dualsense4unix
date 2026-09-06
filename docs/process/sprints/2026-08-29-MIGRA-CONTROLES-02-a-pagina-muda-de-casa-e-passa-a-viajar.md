---
sprint: MIGRA-CONTROLES-02
estado: absorvida
onda: MIGRA-CONTROLES
posse:
  MC2:
    - pyproject.toml
    - install.sh
    - src/hefesto_dualsense4unix/gui/telas/
    - scripts/telas/
cria:
  - src/hefesto_dualsense4unix/gui/telas/02-controles.html
  - scripts/telas/aba02.py
  - scripts/telas/monta.py
  - scripts/check_a_pagina_e_a_do_gerador.py
  - tests/unit/test_migra_controles_02_a_pagina_viaja.py
bancada: false
depois_de:
  # COLISÃO DE ARQUIVO DECLARADA. Estas reivindicam `install.sh` ou o
  # diretório das páginas/geradores que esta sprint cria. Quem decide a ORDEM é
  # quem coordena; aqui só se declara que o arquivo é compartilhado.
  - IDENTIDADE-01
  - LEVA-1
  - MIGRA-ILUMINACAO-04
  - MIGRA-ILUMINACAO-08
  - MIGRA-ILUMINACAO-09
  - MIGRA-ILUMINACAO-10
  - MIGRA-ILUMINACAO-11
  - MIGRA-JOGAR-02
  - MOTOR-DO-ARRANJO-01
  - ONDA-ILUMINACAO-02
  - ONDA-JOGAR-07
  - ONDA-VIBRACAO-01
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/integrations/
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 02). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA CONTROLES · 02 — A página muda de casa, e passa a viajar

**Esta sprint não é da aba 02 — é das dez.** Ela nasce aqui porque a Controles é
o piloto, e porque **nenhuma outra onda pode começar sem ela**: as sprints de
Sistema, Gatilhos, Perfis e Lançadores já declaram `depois_de: MIGRA-MOLDURA-01`
esperando exatamente o que está escrito abaixo. Ver a nota de reconciliação de
ids no [índice](2026-08-29-MIGRA-CONTROLES-INDICE.md).

## O defeito

**A especificação aprovada por ela não está no repositório.** Conferido em
29/08 com `git check-ignore -v`:

```
.gitignore:108:novo-layout/	layout/02-controles.html
.gitignore:108:novo-layout/	src/hefesto_dualsense4unix/interface/aba02.py
```

Disso saem quatro consequências, e as quatro já cobraram:

1. **Não viaja em `git worktree add`.** A árvore `-dev` recebeu o `novo-layout/`
   **copiado à mão** — está escrito no retrato do dia
   ([ONDE PARAMOS 29/08](../2026-08-29-ONDE-PARAMOS-a-tecnologia-decidida-e-a-cura-que-a-tela-desfazia.md),
   §7). É a mesma forma do defeito de 25/08 (oito agentes mandados ler um
   `CLAUDE.md` que não estava na árvore deles), com um agravante: **aqui o
   arquivo é a especificação aprovada por ela.**
2. **Duas levas editando o mesmo mockup em árvores diferentes divergem SEM
   conflito de merge**, porque o git não vê nenhuma das duas.
3. **Não está no pacote.** O wheel inclui `gui/*.glade`, `gui/assets/*.png` e os
   catálogos `.mo` (`pyproject.toml:84-91`) — mais nada. O `install.sh` copia
   `assets/glyphs/*.svg` (`install.sh:3102-3108`) e mais nada de desenho.
4. **Com o WebKit a falha muda de tamanho.** Antes era um desenho faltando;
   agora **a aba não existe** — o `WebView` carrega uma página de erro, e quem
   escuta só `FINISHED` chama isso de sucesso (por isso a MIGRA-CONTROLES-01
   escuta `load-failed`).

### E há um segundo buraco no mesmo arquivo: a página depende de rede

`layout/02-controles.html:6-8` carrega
**Space Grotesk** e **JetBrains Mono** de `fonts.googleapis.com` /
`fonts.gstatic.com`. Sem internet o WebKit cai no `system-ui`, as métricas
mudam, e **o que ela vê deixa de ser o desenho que ela aprovou** — e qualquer
régua de layout que compare com o Chrome online passa a medir contra a fonte
errada, que é a armadilha nº 1 desta casa.

## O que entrega

1. **A casa, e ela já foi escolhida por convergência.** As sprints de Lançadores
   escritas hoje já assumem os dois caminhos; esta sprint os fixa como contrato:
   - a página: `src/hefesto_dualsense4unix/gui/telas/02-controles.html`, e uma
     por aba no mesmo diretório;
   - o gerador: `scripts/telas/aba02.py`, e um por aba, com o
     `scripts/telas/monta.py` e as duas partes compartilhadas (o topo e o fim)
     ao lado dele.

   `novo-layout/` continua existindo como **bancada de desenho**; o que muda é
   que a página que o produto carrega **não mora mais lá**.

2. **O pacote leva as dez.** `pyproject.toml`, no `include` do wheel:
   `src/hefesto_dualsense4unix/gui/telas/*.html`. E o `install.sh` copia o que
   a página aponta por caminho, no mesmo lugar em que já copia os glifos.

3. **As duas fontes deixam de vir da rede.** Elas viajam junto, sob
   `gui/telas/fontes/`, com `@font-face` local e a licença de cada uma no
   diretório (as duas são de licença livre — **confirme os arquivos de licença
   antes de copiar, e cite-os**). A página não pode mais falar com a internet
   para desenhar certo.

4. **Um portão que impede a divergência de voltar.** `check_a_pagina_e_a_do_gerador.py`
   roda o gerador em memória e compara byte a byte com o `.html` versionado. É o
   mesmo princípio do `check_cores_do_dualsense.py`: **página gerada que alguém
   editou à mão é a segunda verdade que este projeto já pagou para matar.**

5. **A dependência sai de "importante" quando a primeira aba trocar de motor.**
   O `install.sh:642` já declara o `webkit2gtk` como *importante*, com a razão
   escrita: *"a interface GTK 3.0 de hoje continua inteira, e é só por isso que
   esta linha ainda não é obrigatória"*. **No dia em que a aba Controles for
   WebView, essa frase deixa de ser verdade** — a linha vira obrigatória, e a
   mudança é desta sprint porque é ela que possui o `install.sh`.

## Como se prova (a mordida)

`tests/unit/test_migra_controles_02_a_pagina_viaja.py`:

- **o git enxerga a página**: `git check-ignore` sobre
  `gui/telas/02-controles.html` sai **1** (não ignorado). Ponha a pasta no
  `.gitignore` e veja reprovar. Este teste é a régua do defeito inteiro;
- **o pacote a leva**: construir o wheel e afirmar que
  `gui/telas/02-controles.html` está dentro dele. **Arranque a linha do
  `include` e veja reprovar** — sem isso o teste está medindo o disco, não o
  pacote, que é a diferença entre a máquina dela e a de quem instalar;
- **nenhuma referência remota**: varredura da página — zero `http://`,
  `https://` e `//` em `href`, `src` e `url(...)`. **Devolva a linha do
  `fonts.googleapis.com` e veja reprovar.** Esta é a régua que a armadilha nº 1
  desta casa pede;
- **a página é a do gerador**: rodar `scripts/telas/aba02.py` para um buffer e
  comparar com o arquivo versionado. **Mude um caractere no `.html` e veja
  reprovar**;
- **o instalador copia o que a página pede**: um ensaio que resolve todo caminho
  relativo da página contra o destino do `install.sh` e afirma que os arquivos
  estão lá. Arranque uma cópia e veja reprovar.

**Não rode `install.sh` para provar isto.** Ele reescreve caminhos e faz
`systemctl --user restart` — é a máquina dela. A régua lê o script, não o
executa.

## O que é dela decidir

- **`novo-layout/` continua existindo?** Esta sprint propõe que sim, como
  bancada de desenho, com a página do produto gerada para dentro de `src/`. A
  alternativa — mover tudo e apagar a pasta — é mais limpa e **quebra o
  `ver.py`**, que é como ela olha a interface nova hoje. É escolha dela.  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->
- **As fontes embutidas.** Se ela preferir que a janela use a fonte do sistema
  (COSMIC), o desenho muda de métrica e as onze réguas de layout mudam de
  número. É uma decisão de aparência, e a aparência é dela.

## O que esta sprint NÃO faz

Ela não escreve uma linha de ponte, não abre o `main.glade` e não toca `app/`. É
mudança de endereço e de embalagem — de propósito, para poder correr **antes** do
ok dela sobre o piloto sem tocar em nada que ela esteja usando.

**O `depois_de` desta sprint não é precedência: é colisão de arquivo
declarada.** Ela não espera nenhuma das treze; o que ela divide é o `install.sh`
(com seis sprints de outras ondas) e o diretório das páginas (com as outras
`MIGRA-*`). O `check_colisao_de_sprints.py` só aceita duas respostas para duas
sprints no mesmo arquivo — `nao_toca` (mentira, eu toco) ou `depois_de`
(serializa) —, e a segunda é a verdadeira. **Quem coordena decide a ordem;
tecnicamente ela pode ser a primeira de todas.**
