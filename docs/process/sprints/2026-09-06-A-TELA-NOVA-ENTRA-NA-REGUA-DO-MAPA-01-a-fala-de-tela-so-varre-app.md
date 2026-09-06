---
sprint: A-TELA-NOVA-ENTRA-NA-REGUA-DO-MAPA-01
estado: aberta
onda: F
posse:
  REGUA:
    - scripts/validar-fala-de-tela.py
    - tests/unit/test_a_fala_de_tela_alcanca_a_interface_nova.py
cria:
  - tests/unit/test_a_fala_de_tela_alcanca_a_interface_nova.py
  - docs/process/agentes/2026-09-06/A-TELA-NOVA-ENTRA-NA-REGUA-DO-MAPA-01.md
bancada: false
depois_de: [GTK-3]
nao_toca:
  - docs/data/mapa-controles.csv
  - docs/data/paridade-gtk-html.csv
  - src/hefesto_dualsense4unix/interface/
  - src/hefesto_dualsense4unix/app/
  - mockup/
---

# A-TELA-NOVA-ENTRA-NA-RÉGUA-DO-MAPA-01 — a fala de tela só varre `app/`

> **Pergunta dela, 06/09/2026:** *"olharam o mapa dos controles e o csv que
> alimenta o specs.html?"* — e, quando a resposta foi não: *"se coisas assim
> aconteceram antes não so nessas duas sprints. entao tem coisa errada. o mapa
> specs tras o dna do dualsense e tá tudo medido lá."*
> <!-- noqa-acento: citação literal dela -->

**Ela está certa, e o defeito é de instrumento.** Esta sprint não cura frase
nenhuma: ela devolve à régua o alcance que a mudança de casa lhe tirou, e tira o
verde de cima do aviso.

---

## 1. O QUE FOI MEDIDO, ANTES DE UMA LINHA SER ESCRITA

### 1.1 A régua varre `app/`, e a tela nova não mora lá

`scripts/validar-fala-de-tela.py:51` — `APP_RELATIVO = "src/hefesto_dualsense4unix/app"`,
e é a única raiz que ele percorre (`app_dir.rglob("*.py")`, `:224` e `:750`).
A interface nova é `src/hefesto_dualsense4unix/interface/`, e **ela é toda a
tela desde que a janela GTK saiu, hoje**.

Censo dos literais com mais de 25 caracteres que citam transporte
(`cabo` · `rádio` · `bluetooth` · `USB` · `BT`), medido em 06/09:

| pasta | literais | arquivos | a régua vê? |
| --- | --- | --- | --- |
| `src/…/app` | 169 | 31 | **sim** |
| `src/…/interface` | **227** | **32** | **NÃO** |

**A maior parte do texto de transporte da casa está fora do alcance da régua que
existe para ele.** E não foi decisão: a régua é de 24/08, e a tela nova nasceu
depois — ela mediu o mundo em que a única tela era a `app/`.

### 1.2 E ela termina VERDE dizendo que quase não mediu

`bash scripts/portoes.sh` → `fala-de-tela` **ok**. A saída, verbatim:

```
A RÉGUA QUASE NÃO MEDIU: 1 `Fala` declarada(s), 3 número(s) de tela e 0 aba(s)
promovida(s), contra as 308 célula(s) de …/fatos_do_mapa.py. Um conjunto deste
tamanho não distingue uma tela em acordo com o mapa de uma tela que simplesmente
não declara nada — promova mais abas em `ABAS_COM_FALA_DECLARADA` e o verde daqui
passa a valer.
```

**`rc=0`.** É a forma que o `CLAUDE.md` já nomeia, com a regra que ela deixou em
04/09: *"o instrumento sabe do próprio risco e AVISA em vez de RESOLVER — aviso
no cabeçalho de um comando que termina verde ninguém lê."* **Instrumento que
sabe do próprio risco RESOLVE.**

### 1.3 Nenhum portão cruza a paridade com o mapa

`docs/data/paridade-gtk-html.csv` e `docs/data/mapa-controles.csv` são lidos, os
dois, por **exatamente dois arquivos**: `interface/aba02.py` e
`interface/mesa_viva.py` — o gerador e o piloto. **Nenhum portão, nenhum teste.**
Uma linha pode ser `IGUAL` na paridade enquanto o mapa diz que aquela feature
não aciona num dos transportes, e nada reprova.

### 1.4 O tamanho do que isso deixa passar

**29 features do DualSense** têm `existe=tem` e `aciona` em `não` ou `parcial`
em pelo menos um transporte. As três que a pergunta dela desenterrou:

| chave | cabo | rádio | o que a ressalva do mapa diz |
| --- | --- | --- | --- |
| `audio.alto_falante` | parcial | **não** | por rádio não há caminho de dados de áudio de saída |
| `audio.alto_falante.volume` | sim | sim | *"Mexer no volume por BT é mexer no volume de algo que NINGUÉM está tocando"* |
| `audio.microfone.mudo` | sim | **parcial** | *"um `mic unmute` evapora no próximo handle novo, em silêncio… como reconexão é rotina no rádio, o defeito é muito mais visível por BT"* |

E o deslizante do alto-falante **nasceu nesta leva** — então existe, desde hoje,
um arrasto que pelo rádio mexe num volume que não sai por lugar nenhum, e a tela
não diz isso.

---

## 2. OS PASSOS

### Passo 1 — a régua enxerga a tela nova

`validar-fala-de-tela.py` passa a varrer **as duas** raízes. Não troque uma pela
outra: `app/` é o motor e continua sendo tela em parte.

**Meça antes de escolher a forma:** as três funções que hoje recebem `app_dir`
podem receber uma lista de raízes, ou a raiz pode virar argumento. **A que
mexer em menos linhas ganha** — esta sprint é de alcance, não de reforma.

- **A MORDIDA:** devolva a raiz única e o teste novo reprova, nomeando quantos
  literais de `interface/` deixaram de ser vistos.

### Passo 2 — o "quase não mediu" deixa de ser verde

O aviso vira **piso**: abaixo do que já está declarado hoje, `rc=1`. O número
não se digita — **conte o que existe** e trave nisso, como o `piso 45` dos
portões e o `test_o_mapa_nunca_encolhe` fazem.

**A lista só cresce.** Quem tirar uma aba de `ABAS_COM_FALA_DECLARADA` tem de
reprovar.

- **A MORDIDA:** tire uma aba declarada. Reprova, dizendo o piso e o achado.
- **A SEGUNDA:** acrescente uma. **Passa** — e o piso sobe junto, senão a régua
  punisce quem melhora, que é o defeito que onze réguas desta casa já tiveram.

### Passo 3 — o CENSO, e ele é relatório, não cura

Rode o `--censo-de-transporte` com o alcance novo e **trie as frases de
`interface/` em três baldes**, no relatório:

1. **AFIRMA sem lastro** — a frase promete um transporte que o mapa não
   sustenta. É dívida, e cada uma leva a `chave` do mapa que a derruba.
2. **AFIRMA com lastro** — o mapa sustenta. Nada a fazer, e diga quantas.
3. **NÃO AFIRMA** — comentário, docstring, nome de campo, prosa de código.
   **A maior parte vai cair aqui, e isso não é fracasso da medição.**

**NÃO CURE NENHUMA FRASE.** `interface/` está no seu `nao_toca`, e não é
descuido: curar 227 literais no mesmo commit em que a régua muda impede alguém
de saber qual das duas coisas quebrou o quê. **O balde 1 vira sprint, com a
lista pronta.**

---

## 3. NADA SE PERDEU

| o que existe hoje | continua valendo |
| --- | --- |
| a régua compara `Fala.afirma` com a coluna `aciona` | sim |
| `test_a_aba_emulacao_nao_promete_transporte_sem_lastro` cobre a aba Emulação por outro caminho (`de_onde_sei` e `ate_onde_foi`, não `aciona`) | sim — **duas réguas independentes é regra desta casa**, não redundância a remover |
| `mapa-controles.csv` é portão, não documentação | sim — e é `nao_toca` seu |

## 4. O QUE ESTA SPRINT NÃO FAZ

Não toca no mapa, não toca na paridade, não cura frase, não escreve tela. E
**não** constrói o portão que cruza a paridade com o mapa (§1.3): esse é achado
declarado aqui, com a medição, e vira sprint própria — misturá-lo com este
alcance faria uma entrega que ninguém consegue morder por partes.
