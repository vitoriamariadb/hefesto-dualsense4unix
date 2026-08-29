---
sprint: MIGRA-CONTROLES-12
onda: MIGRA-CONTROLES
posse:
  MC12:
    - src/hefesto_dualsense4unix/app/actions/controles_web.py
    - src/hefesto_dualsense4unix/app/actions/config/secao_controles.py
cria:
  - tests/unit/test_migra_controles_12_a_borda_e_a_peca.py
bancada: false
depois_de:
  # A FONTE. A CONEXOES-08 entrega o dono único da borda na cor do plástico
  # mais o portão, que as outras nove telas consomem; a CONEXOES-12 é quem faz
  # o produto ler o CSV das 28 cores. ESTA SPRINT NÃO AS REESCREVE.
  - ONDA-CONEXOES-08
  - ONDA-CONEXOES-12
  # A leitura pelo rádio, e o que ela destrava.
  - ONDA-CONEXOES-11
  - MIGRA-CONTROLES-06
  # SÉRIE por R5: dividem `secao_controles.py`.
  - ONDA-CONEXOES-05
  - ONDA-CONEXOES-06
  # SÉRIE INTERNA: as três dividem o tradutor da aba (o módulo que a 06 cria),
  # e quem divide arquivo executa em série.
  # A ordem é 08 -> 10 -> 11 -> 12 -> 13.
  - MIGRA-CONTROLES-08
  - MIGRA-CONTROLES-11
  - LEVA-4
  - ONDA-CONEXOES-09
  - ONDA-JOGAR-07
nao_toca:
  - src/hefesto_dualsense4unix/integrations/cor_do_plastico.py
  - docs/data/cores-do-plastico.md
  - docs/data/cores-do-dualsense.csv
  - scripts/gerar_cores_do_dualsense.py
  - scripts/check_cores_do_dualsense.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - novo-layout/
---

# MIGRA CONTROLES · 12 — A borda é a peça, e metade da mesa dela é rádio

**Esta sprint NÃO troca a tabela de cores.** Isso é a
[ONDA-CONEXOES-12](2026-08-27-ONDA-CONEXOES-12-as-vinte-e-oito-cores-e-as-dez-zonas-chegam-ao-produto.md),
que atravessa a troca de motor **intacta** — ela nunca falou de widget. O que
esta sprint faz é a metade que é desta aba: **a borda de cada cartão chegar ao
HTML, e a tela dizer a verdade nos cartões em que a cor não chega.**

## O defeito

O mockup pinta cada cartão com `--plastico`, lido de
`docs/data/cores-do-dualsense.csv` pelo gerador
(`novo-layout/_ferramentas/monta.py:172`, `cor_da_zona`). **Nenhuma linha de
`src/` lê esse CSV** — conferido em 29/08: `grep -rn "cores-do-dualsense" src/`
devolve **zero**. Quem o lê é `scripts/` e o `novo-layout/`.

Isso é assunto da CONEXÕES-12. **O que é desta aba são as duas linhas
seguintes**, e nenhuma das duas está escrita em sprint nenhuma:

### 1. Metade da mesa dela é rádio, e pelo rádio a cor não chega

`docs/data/mapa-controles.csv`, `identidade.cor_do_aparelho@dualsense`:
`cabo_aciona = sim`, **`radio_aciona = não`**, com `radio_por_que_nao_aciona =
o-aparelho-recusa`. O filtro está no código: `_e_dualsense_no_cabo`
(`integrations/cor_do_plastico.py:369`) exige `_BUS_USB` (`:378`) e reprova o nó
em `:445`.

O mockup pinta os **quatro** cartões, e dois deles são BT (P2 Starlight Blue,
P3 Galactic Purple). **Sem memória, esses dois nascem cinzentos no produto** —
e a mesa dela hoje tem **dois** controles.

**Nota, e ela muda o tamanho do problema:** a lápide *"é o aparelho que
recusa"* **caiu** em 28/08 — não era o aparelho, era o CRC desta casa (a semente
`0x53`, e o conserto já está em `dev`, commit `8da72018`). A célula do mapa
ainda diz `o-aparelho-recusa`, e quem a corrige é a
[ONDA-CONEXOES-11](2026-08-27-ONDA-CONEXOES-11-a-cor-se-le-no-radio-e-a-semente-e-0x53.md).
**Enquanto ela não fechar, esta aba tem de saber viver sem a cor no rádio.**

### 2. A leitura não sobrevive à janela

`app/actions/config/secao_controles.py` guarda o que leu em `self._cores`
(`:646`) — **dicionário de instância** —, e `_perguntar_as_cores` (`:916`) pula
tudo o que não é `transporte == "usb"` (`:930`).

Fechou a janela, a cor do cabo se perde. Passou o controle para o rádio, ela
nunca esteve lá.

**O campo de disco que resolveria já existe e não é usado para isto:**
`ControleDeclarado.cor` (`utils/maquina.py:551`), escrito **só** por declaração
dela, em `app/widgets/external_card.py:526-535`.

## O que entrega

1. **A borda de cada cartão sai do dado**, pelo dono único que a CONEXÕES-08
   entrega — nunca por um hexadecimal digitado no Python. Digitar aqui seria a
   terceira tabela: `TONS`, o CSV, e mais uma.
2. **A cor lida vira memória por peça.** O que a leitura do cabo descobre é
   gravado contra a identidade da peça e relido na abertura seguinte, para que
   o mesmo controle no rádio **continue com a cor que ele tem**. É a única
   coisa que faz os dois cartões BT dela não nascerem cinzentos.
3. **Cinzento é um estado, e ele fala.** Sem cor conhecida, a borda é neutra e a
   dica diz **o quê, por quê e o que fazer** — regra desta casa para toda frase
   de diagnóstico. *"Não sei"* é resposta válida; borda inventada não é.
4. **Duas peças do mesmo plástico ficam com a borda idêntica**, e isso é
   pergunta aberta da onda Conexões (toca a 05, a 07 e a 08). Esta sprint **não
   a resolve** — ela a herda, e a declara na tela em vez de fingir que não
   existe.

## Como se prova (a mordida)

`tests/unit/test_migra_controles_12_a_borda_e_a_peca.py`:

- **a borda não é digitada**: AST — nenhum literal hexadecimal de cor de
  plástico no tradutor da aba. **Escreva um `#A51C48` e veja reprovar.** É a
  régua que impede a terceira tabela;
- **o cartão no rádio, sem memória, nasce NEUTRO com o motivo** — não com a cor
  do primeiro controle, não com a do jogo, não com um padrão. **Faça a tela
  chutar uma cor e veja reprovar**;
- **a cor lida sobrevive a fechar e abrir**: leia pelo cabo, derrube a janela,
  reabra — a cor está lá. **Devolva o `self._cores` de instância e veja
  reprovar**, que é o defeito de hoje reproduzido em teste;
- **a cor segue a peça, não o transporte**: o mesmo `uniq` que foi lido no cabo
  aparece colorido quando volta pelo rádio. Chaveie por transporte e veja
  reprovar;
- **nenhum endereço de rádio vira pixel**: a identidade que casa a peça com a
  cor não pode aparecer na tela nem na foto — `scripts/check_endereco_de_radio.py`
  sobre o HTML gerado e o teste de anonimato sobre o PNG;
- **a foto vale**: se a régua for medir a cor no navegador, ela declara **contra
  qual biblioteca mede**, e não usa `scrollIntoViewIfNeeded` antes de medir —
  ele **rola** e cega toda medição de layout feita depois (foi assim que um
  portão desta casa deu verde sobre uma linha fora da caixa, em 27/08).

## O que é dela decidir

- **Se a memória por peça é gravada sozinha ou só por declaração dela.** Hoje
  `ControleDeclarado.cor` é campo de **declaração**; gravar ali o que o firmware
  leu mistura o que ela disse com o que a máquina descobriu. As duas saídas
  custam coisas diferentes, e a que separa (dois campos, "declarada" e "lida")
  é mais honesta e mais cara.
- **A cor no rádio.** Enquanto a CONEXÕES-11 não fechar, os cartões BT ficam sem
  cor ou ficam com a cor lembrada do cabo? Lembrar é útil e é uma afirmação sem
  confirmação **naquele** transporte — o padrão que esta casa já nomeou.
