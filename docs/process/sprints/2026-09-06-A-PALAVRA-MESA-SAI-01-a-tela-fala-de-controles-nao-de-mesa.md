---
sprint: A-PALAVRA-MESA-SAI-01
estado: feita
posse:
  MESA:
    - src/hefesto_dualsense4unix/interface/frases_que_ela_baniu.py
    - src/hefesto_dualsense4unix/interface/aba01.py
    - src/hefesto_dualsense4unix/interface/aba02.py
    - src/hefesto_dualsense4unix/interface/aba03.py
    - src/hefesto_dualsense4unix/interface/aba04.py
    - src/hefesto_dualsense4unix/interface/aba05.py
    - src/hefesto_dualsense4unix/interface/aba06.py
    - src/hefesto_dualsense4unix/interface/aba07.py
    - src/hefesto_dualsense4unix/interface/aba08.py
    - src/hefesto_dualsense4unix/interface/aba09.py
    - src/hefesto_dualsense4unix/interface/aba10.py
    - src/hefesto_dualsense4unix/interface/pacotes/
    - mockup/
    - tests/unit/test_a_frase_que_ela_baniu_nao_chega_a_tela.py
cria:
  - tests/unit/test_a_palavra_mesa_nao_chega_a_tela.py
bancada: false
depois_de: [ONDA4-S10-O-TRANSPORTE-01, ONDA5-P-01, A-TELA-SAMBA-01, ONDA5-01-01, ONDA5-01-02, ONDA5-01-03, ONDA5-02-01, ONDA5-02-02, ONDA5-03-02, ONDA5-05-01, ONDA5-05-02, ONDA5-05-03, ONDA5-06-01, ONDA5-06-02, ONDA5-07-01, ONDA5-07-02, ONDA5-07-03, ONDA5-08-01, ONDA5-08-02, ONDA5-09-01, ONDA5-09-02, ONDA5-10-01, ONDA5-10-02, ONDA5-MIC-VIRTUAL-01, AS-DUAS-ABAS-FALAM-01, CONEXOES-LIGAR-TUDO-01, ONDA3-GESTO-DECLARA-01, ONDA3-MOTOR-01, O-LOGO-NAS-DEZ-01, LUZES-01, STEAM-INPUT-01, SISTEMA-STEAM-01, CONTROLES-VERDADE-01, NAVEGACAO-TECLAS-01, PERFIL-MODO-01, JOGAR-O-QUE-FALTA-01, MIC-VIRTUAL-02]
nao_toca:
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/interface/mesa_viva.py
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/app/
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/interface/paginas/
  - docs/data/paridade-gtk-html.csv
  - mockup/DIVERGENCIAS.md
---

# A-PALAVRA-MESA-SAI-01 · TEXTO — a tela fala de controles, não de "mesa"

> **FEITA — 06/09/2026.** As 34 ocorrências lidas nas dez abas e os 23
> literais de tela dos dez pacotes foram a ZERO; a régua é
> `tests/unit/test_a_palavra_mesa_nao_chega_a_tela.py`, mordida duas vezes.
> **O que sobra é `app/`**, que não era desta posse: dezesseis frases lá
> ainda dizem a palavra e chegam à tela em execução — a lista com endereço,
> a razão de o funil `hefesto_vivo._json` NÃO ter adotado a palavra, e o
> que fecha estão no relatório
> [`docs/process/agentes/2026-09-06/A-PALAVRA-MESA-SAI-01.md`](../agentes/2026-09-06/A-PALAVRA-MESA-SAI-01.md).

> **A palavra dela, 06/09/2026:** *"Falei do termo mesa que é horrível. Mas os
> claudes anteriores entraram na pira de usar isso em tudo no layout. O termo
> sai e coloca-se termos simples pro user comum. feature fica."* <!-- noqa-acento: citação literal dela -->

**"Mesa" é PALAVRA banida na tela, não feature.** Nenhuma tabela, contagem ou
aviso sai por causa dela; o que muda é como a tela os chama. O vocabulário que
entra no lugar está em
[A LÍNGUA DESTA CASA](../../A-LINGUA-DESTA-CASA-o-glossario-que-a-tela-e-o-codigo-falam.md),
§1: *os controles*, *todos*, *P1 e P2*, *no cabo*, *no rádio*, *quem está
ligado*.

Ela é a **última sprint de tela das 24 horas** (ONDA E), de propósito: toca os
dez geradores e a pasta `mockup/` inteira, e por isso só corre quando mais
ninguém está escrevendo texto de aba. O `depois_de` acima é a lista de quem
escreve texto antes dela — inclusive as sprints que o Opus ainda vai escrever.

---

## 1. O QUE SE MEDIU (06/09, 04:10 — só leitura)

A palavra **mesa**, visível (fora de tag), nos dez mockups de hoje:

| página | ocorrências |
| --- | ---: |
| `02-controles` | 35 |
| `08-conexoes` | 32 |
| `01-jogar` | 27 |
| `06-navegacao` | 18 |
| `05-vibracao` | 15 |
| `03-gatilhos` | 14 |
| `04-iluminacao` | 13 |
| `10-perfis` | 12 |
| `09-sistema` | 7 |
| `07-lancadores` | 6 |
| **total** | **179** |

E `FRASES_BANIDAS` (`interface/frases_que_ela_baniu.py:37`) tem três trechos,
nenhum deles a palavra. Os nomes de código (`mesa_viva.py`, `app/mesa.py`,
`data-campo="mesa-frase"`, `MESA_VAZIA`) **não são texto de tela** e não mudam
nesta sprint — a régua mede o que a pessoa lê, não o identificador.

## 2. O TRABALHO

### Passo 1 — o instrumento

Um modo `--palavra mesa` em `interface/olhar.py` (ou um script curto na
mesma posse) que lista, por página, cada ocorrência visível com dez palavras de
contexto e de onde ela vem (o gerador da aba ou o pacote dela, com arquivo e
linha). Cole a lista no relatório: é o "antes".

### Passo 2 — a troca, pelo glossário

Cada ocorrência vira a palavra simples do glossário §1. Regras:

* *"controles na mesa"* → *"controles ligados"*; *"a mesa inteira"* / *"toda a
  mesa"* → *"todos os controles"*; *"mesa vazia"* → *"nenhum controle ligado"*;
  *"N na mesa · X no cabo · Y no rádio"* → *"N ligados · X no cabo · Y no
  rádio"*; *"o exame da mesa"* → *"o exame dos controles"*; *"mesa suja"* →
  *"outro programa está segurando o controle"*.
* Onde a frase tem dono no motor (`app/actions/*`), **a troca é no dono**, e
  isso é RELATO — o `app/` não é desta posse. Liste frase, arquivo e linha.
* Nada de frase nova que explique: a tela troca a palavra e cala.

### Passo 3 — a palavra entra na lista, como PALAVRA INTEIRA

`FRASES_BANIDAS` casa por trecho; "mesa" como trecho pegaria "mesmo"? Não —
mas pegaria "remesa" e o que mais vier. A lista ganha uma segunda tupla,
`PALAVRAS_BANIDAS`, casada com borda de palavra e sem distinguir maiúscula, e a
função `primeiro_trecho_banido` passa a consultar as duas.

**A MORDIDA:** `test_a_palavra_mesa_nao_chega_a_tela.py` renderiza as dez
páginas da bancada, tira as tags e reprova em qualquer "mesa" inteira. Ponha
uma de volta num gerador e veja o nome da página e a frase na reprovação.

### Passo 4 — regerar, e parar

`python3 src/hefesto_dualsense4unix/interface/aba01.py`, e assim até a `aba10.py`; `mockup/` muda; **`--publicar` é ato
dela, no FECHO**. O `check_o_desenho_aprovado.py` vai acusar as dez páginas
como divergentes do publicado — é o esperado, e a seção do `DIVERGENCIAS.md`
quem escreve é o coordenador (decisão 3 do plano).

## 3. NADA SE PERDEU

* **A tabela e a conta de slots do perfil de bateria FICAM** (decisão dela de
  06/09, `D-0609-MESA-E-PALAVRA-NAO-FEATURE`); a SISTEMA-STEAM-01 as constrói
  já com as palavras simples.
* **Os nomes internos ficam** (`mesa_viva.py`, `app/mesa.py`, `MESA_VAZIA`,
  `mesa-frase`): renomear identificador é outra sprint, e não é pedido.
* **As 43 frases da linha 01 continuam com dono**: a troca é de uma palavra
  dentro delas, no dono.

## A PROVA DE TELA

`--oculta`: as dez fotos depois da regeração, e a saída do Passo 1 vazia.
