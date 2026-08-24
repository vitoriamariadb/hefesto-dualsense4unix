# ONDA0-Z0 — a régua e a foto — relatório do executor (24/08/2026)

## O que mudou

**Z0-1** — `tests/unit/test_as_fotos_acompanham_a_versao.py`: `CODIGO_DA_TELA`
ganhou `"scripts/gui-captura"` como terceira entrada (o instrumento passa a
contar como código da tela). Teste novo
`test_o_portao_acusa_retrato_mexido_depois_da_foto` (repositório de dois
commits: foto, depois só o retrato).

**Z0-2** — `tests/unit/test_a_foto_monta_como_o_produto_monta.py`: já estava
em curso quando entrei na árvore (ver nota abaixo); confirmei e completei.
`MIXINS_DE_ABA` virou `dict[str, tuple[str, str]]` chaveado pelas 11 entradas
de `NOMES` (antes eram 3 mixins soltos). Teste novo
`test_toda_aba_de_nomes_tem_mixin_declarado` — o portão do aceite. Corrigi
uma violação de acentuação pré-existente na linha 38 (`referencia` como verbo
confundia o validador; reescrevi a frase).

**Z0-3** — `tests/unit/test_p10_a_foto_nao_publica_o_glade_cru.py`:
`esperadas` deixou de ser uma lista literal de 5 e passou a ser derivada de
`MIXINS_DE_ABA` (importado do arquivo do Z0-2) cruzado com uma tabela nova
`_FUNCAO_QUE_HOSPEDA_A_ABA` (a função real do `main` que monta cada uma das
11 abas — `_injetar_card` para Status, `_injetar_modos_de_gatilho` para
Gatilhos, sem exigir prefixo `_montar_aba_*`).

**Z0-4** — mesmo arquivo: linha nova em `_ROTULOS_QUE_O_CODIGO_REESCREVE`
para `emulation_vidpid_label` (já estava no diff ao entrar na árvore, só
verifiquei e comprovei a mordida). Reescrevi o comentário em
`scripts/gui-captura/retratar_abas.py:1720-1723` (era uma nota informal
"não arranque isto de verdade"; virou documentação permanente apontando
para a régua e a data da mordida).

**Z0-5** — `scripts/gui-captura/retratar_abas.py`: `_gravar_prova_da_foto`
ganhou `modo: str` e `fixture: Path | None`, grava linhas `modo:`,
`fixture:` e a frase fixa "toda linha destas imagens é dublê…" no
`PROVA-DA-FOTO.txt`. O recibo passou a ser gravado nos **três** destinos
canônicos (`DESTINO_DOC`, `DESTINO_MESA_CHEIA`, `DESTINO_MESA_DE_CINCO`) —
antes só o do README ganhava um. Arquivo novo
`tests/unit/test_o_recibo_declara_a_bancada_de_cada_foto.py` (3 testes: modo
padrão sem fixture, mesa-cheia nomeando `state_full_quatro_controles.json`,
e um teste de AST garantindo que o `main` de verdade repassa `modo=`/
`fixture=`, não só a função isolada).

**Z0-9** — `docs/usage/interface.md:8-17`: a data "22/08/2026" virou
"23/08/2026" (a do `PROVA-DA-FOTO.txt`); o parágrafo inteiro sobre "a foto
da Configurações está atrás da árvore… Folgada 0/1600" **saiu** (fato
caduco — a medição de hoje leu a imagem e a frase não está lá); entrou uma
frase curta "estas imagens são dublê" com link para o recibo.
`docs/usage/assets/CONFERIDO-EM.md`: linha nova para 23/08/2026 (`3de95ff`,
sete PNGs), que faltava.

## Qual mordida prova

**Z0-1**: comentei a linha `"scripts/gui-captura"` em `CODIGO_DA_TELA` e
rodei o teste novo:

```
E       AssertionError: o comparador não acusou uma mudança em
        `scripts/gui-captura` posterior à foto...
E       assert None is False
```

Devolvida a linha, 4 passed / 1 failed (o failed é pré-existente, ver
"O que sobrou para o próximo" abaixo).

**Z0-2** (dupla, como a sprint pede):
1. Removi a entrada `"readme_inicio"` de `MIXINS_DE_ABA` (em memória, cópia
   de segurança em `/tmp`):
   ```
   E       AssertionError: estas abas de `NOMES` não têm linha em
           `MIXINS_DE_ABA`...: readme_inicio
   E       assert not ['readme_inicio']
   ```
   Devolvida, 4 passed.
2. Simulei a remoção do `HomeActionsMixin` do conjunto `citados` (script
   avulso, sem tocar o arquivo): `faltando = {'HomeActionsMixin': '...'}` —
   confirmado que `test_o_retrato_chama_o_mixin_de_cada_aba_montada_em_codigo`
   reprovaria.

**Z0-3**: comentei a chamada de `_montar_aba_inicio` na linha 2207 do
`main` (cópia de segurança em `/tmp`):
```
E       AssertionError: o `main` do retrato parou de montar estas abas...:
        Início (_montar_aba_inicio)
```
Devolvida, `diff` contra a cópia de segurança = idêntico, 4 passed.

**Z0-4**: comentei `self._sync_uinput_card(_MASCARA_DE_BANCADA)` (linha
1725):
```
E       AssertionError: a foto da documentação voltou a publicar o glade cru:
        Emulação: `emulation_device_name_label` foi fotografado com o texto
        do XML (...) — ...
        Emulação: `emulation_vidpid_label` foi fotografado com o texto do
        XML ('045E:028E (Xbox 360)') — ...
```
Devolvida, `diff` = idêntico, 4 passed.

**Z0-5** (dupla):
1. Troquei a chamada em `main` de
   `_gravar_prova_da_foto(saida, modo=modo, fixture=fixture_da_prova)` para
   `_gravar_prova_da_foto(saida)` (cópia de segurança em `/tmp`):
   ```
   E       AssertionError: a chamada de `_gravar_prova_da_foto` na linha 2294
           não passa ['fixture', 'modo'] — o recibo voltaria a nascer sem
           proveniência
   ```
   Devolvida, `diff` = idêntico.
2. Chamei `_gravar_prova_da_foto(saida, modo="--mesa-cheia", fixture=None)`
   num script avulso (arranque isolado, sem tocar o arquivo):
   ```
   AssertionError: MORDEU: fixture sumiu do recibo, exatamente como o teste
   real detectaria
   ```

**Z0-9**: mordida por régua externa —
`grep -rn "Folgada 0/1600" docs/usage/ README.md` voltou vazio;
`validar-referencias-docs.py --all` não ganhou referência morta nova (as 4
que aparecem são de dois outros documentos de sprint, nunca tocados por
mim — ver "o que a sprint não previu").

Testes de regressão do escopo (43 no total, todos verdes) e portões locais
rodados após cada mordida — saída completa abaixo, em "O que NÃO verifiquei"
não se aplica aqui porque tudo isto FOI verificado:

```
GDK_PIXBUF_MODULE_FILE=... xvfb-run -a python -m pytest \
  tests/unit/test_p10_a_foto_nao_publica_o_glade_cru.py \
  tests/unit/test_a_foto_monta_como_o_produto_monta.py \
  tests/unit/test_as_fotos_acompanham_a_versao.py \
  tests/unit/test_retrato_das_abas_nao_vaza_dado_real.py \
  tests/unit/test_a_aba_perfis_na_foto.py \
  tests/unit/test_a_mesa_cheia_na_foto.py \
  tests/unit/test_a_bancada_da_foto_exercita_os_dois_graus.py \
  tests/unit/test_o_recibo_declara_a_bancada_de_cada_foto.py -q
...........................................                              [100%]
43 passed in 2.81s
```

Escopo local:
```
ruff check src/ tests/          -> All checks passed!
ruff check scripts/gui-captura/retratar_abas.py -> All checks passed!
mypy src/hefesto_dualsense4unix -> Success: no issues found in 208 source files
python3 scripts/validar-acentuacao.py --all -> rc=0
python3 scripts/validar-glifos.py --all     -> rc=0
```

## O que NÃO verifiquei

- **Não rodei `retratar_abas.py` de ponta a ponta nesta árvore** (vedado
  pela instrução desta execução) — então Z0-5 está provado até o nível de
  `_gravar_prova_da_foto` chamada diretamente e de AST sobre o `main`, mas
  **não vi o `PROVA-DA-FOTO.txt` de verdade nascer com as linhas novas**
  num ensaio real. Quem rodar o lote (Z0-11) deve conferir que o recibo dos
  três destinos saiu com `modo:`/`fixture:` preenchidos.
- **Não conferi visualmente nenhuma foto** — nenhuma tarefa minha muda
  pixel do produto (todas com carimbo "não toca a tela"), mas não tenho
  como jurar que `_sync_uinput_card` continua sendo a única gravadora de
  `emulation_vidpid_label` no futuro; a régua do Z0-4 cobre isso automaticamente,
  não eu.
- **Não confirmei se `costurar.sh` existe** para fechar esta entrega — não
  achei o script na árvore (`find` vazio); se ele não existir mesmo, quem
  integra precisa mergear a branch `voo/ONDA0-Z0-exec` à mão.

## O que sobrou para o próximo

- **Z0-6 (mesa vazia), Z0-7 (segunda foto de Perfis), Z0-8 (trinco de
  arquivo), Z0-10 (citar as fotos novas na doc), Z0-11 (o lote)** — não
  feitas. As quatro primeiras exigem montar/injetar estado real em GTK
  (fixture novo, segunda captura com o Modo avançado ligado, dois processos
  concorrentes gravando PNG de verdade) e a instrução desta execução veda
  rodar `scripts/gui-captura/retratar_abas.py` nesta árvore; fazer essas
  tarefas com rigor (mordida real, não simulada) pediria rodar o script de
  ponta a ponta — o que a régua desta execução proíbe. Preferi entregar
  Z0-1 a Z0-5 e Z0-9 com mordida **real**, provada, a entregar Z0-6/7/8 sem
  poder provar a mordida do jeito que a própria sprint exige (nota "todo
  dublê tem de saber recusar"). Z0-10 e Z0-11 dependem de Z0-6/7 existirem.
- **`test_as_fotos_nao_ficam_atras_do_codigo_da_tela` continua vermelho**
  antes do commit (ver achado abaixo) — não é meu para consertar (pedir
  o ensaio real é Z0-11, fora do meu escopo e vedado nesta árvore).

## O que notei que a sprint não previu

1. **A árvore desta execução não tem `CLAUDE.md`** (arquivo gitignored,
   nunca copiado para um `git worktree add`). `validar-referencias-docs.py
   --all` acusa 4 referências mortas a `../../../CLAUDE.md` em DOIS
   documentos de sprint que nunca toquei
   (`2026-08-24-ONDA0-Z6-COMUNHAO-COM-O-SPECS-01...md` e
   `2026-08-24-PAREAMENTO-01...md`). Não é defeito meu nem da Z0 — é um
   buraco estrutural do `despachar-agente.sh`: **todo** agente despachado
   por ele vai ver essas 4 linhas vermelhas, achando que quebrou algo.
   Vale um aviso ou uma isenção no próprio script de referências para
   worktrees de agente.

2. **O portão de frescor (`test_as_fotos_nao_ficam_atras_do_codigo_da_tela`)
   já estava vermelho ANTES de eu tocar em qualquer coisa**, e continua
   assim contra a árvore de HOJE (commit `0e12780`, "Aplicar e fechar",
   mexeu em `app/app.py` DEPOIS do último ensaio de fotos em `3de95ff`).
   Confirmei isolando minha edição (`git stash` só do arquivo de teste): o
   vermelho é **pré-existente**, não introduzido pela Z0-1. É exatamente o
   estado que a Z0-11 (o lote, fora do meu escopo) existe para resolver.

3. **Achado sobre o próprio portão de frescor, incidental**: como
   `docs/usage/assets/CONFERIDO-EM.md` mora DENTRO da pasta que o portão
   vigia (`FOTOS = "docs/usage/assets"`), qualquer commit que só edite esse
   `.md` — sem regenerar PNG nenhum — já satisfaz a régua de TOPOLOGIA
   (`merge-base --is-ancestor`), porque o commit "toca" a pasta e vem depois
   do código. O portão mede procedência do **commit**, não da **imagem**; e
   isso está documentado no próprio cabeçalho do arquivo ("não diz que a
   foto está errada — diz que ela não foi conferida"), então não é bug —
   mas é um ponto cego que vale registrar: um commit em `CONFERIDO-EM.md`
   sozinho (sem rodar o script) já é suficiente para o portão ficar verde,
   mesmo que nenhuma foto tenha sido re-olhada de verdade. Efeito colateral
   observado: depois do commit desta entrega, o portão que estava vermelho
   (achado 2) deve VOLTAR ao verde só por eu ter editado o `CONFERIDO-EM.md`
   — sem uma única foto ter sido regenerada. Registro para quem revisar não
   confundir "portão verde" com "fotos conferidas".

4. **A tabela `esperadas` do Z0-3 revelou, ao ler o `main`, que
   `_montar_aba_configuracoes` já é chamado e monta a 11ª aba
   corretamente** — a sprint fala em "cinco, não onze" citando a régua
   antiga, mas o `main` real (linha 2211) já montava Configurações há mais
   tempo; o buraco de régua era mesmo só de cobertura de teste, confirmado.

## Ver também

Sprint: `docs/process/sprints/2026-08-24-ONDA0-Z0-A-REGUA-E-A-FOTO-01-cinco-abas-publicam-o-xml-cru.md`.
