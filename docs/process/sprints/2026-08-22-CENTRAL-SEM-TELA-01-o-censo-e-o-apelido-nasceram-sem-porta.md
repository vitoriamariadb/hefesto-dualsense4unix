# CENTRAL-SEM-TELA-01 — o censo e o apelido nasceram sem porta

**22/08/2026.** Três peças da central de rádio entraram no produto hoje
(`9bf54b7`, `67b07ed`) e nenhuma tinha por onde ser usada. A frente que as
escreveu declarou isso: *"nenhuma tem tela ainda — a tela é de outra leva."*
Esta é essa leva.

**Estado:** ABERTA — **E1 e E3 fecharam em `49797f8`, no mesmo dia.** Ficam a E2
e a E4, e a E4 é decisão DELA.

---

## O defeito, em uma linha

**Três capacidades novas, zero gestos.** Quem usa o produto não conseguia ver o
barramento, renomear um dongle, nem mover um controle de adaptador — e a
terceira continua sem gesto.

## O que foi MEDIDO em 22/08

Às 21h00, quando esta sprint foi aberta:

```
grep -rn "censo_do_barramento" src/ scripts/ | grep -v integrations/censo_do_barramento.py
  → 1 linha, e é um comentário em apelido_do_dongle.py

grep -rn "apelido_do_dongle" src/ scripts/ | grep -v integrations/apelido_do_dongle.py
  → 8 linhas, TODAS comentário ou docstring (gesto_de_reconexao, linhagem_nintendo,
    bt_active_mode.sh, doctor.sh)

grep -rn "bt_ponte_privilegiada" src/
  → nada. Os únicos que o citam são install.sh, uninstall.sh e um comentário
```

Nenhum `import` em `src/` alcançava `censo_do_barramento` nem
`apelido_do_dongle`. O próprio `core/linhagem_nintendo.py:181-184` registrava
isso por escrito.

**Às 21h48 os dois ganharam consumidor** (`49797f8`), e a medição de agora é
outra — `secao_mesa.py:110` e `:115` os importam. O helper privilegiado
**continua sem chamador Python**: `grep -rn "bt_ponte_privilegiada" src/` segue
vazio.

O que existe, e está pronto:

| Peça | O que ela sabe fazer | Como |
|---|---|---|
| `integrations/censo_do_barramento.py` | todo aparelho USB com espécie, topologia (quem atrás de qual hub, qual controlador PCI) e energia | `/sys`, sem root, sem subprocesso |
| `integrations/apelido_do_dongle.py` | ler e renomear os adaptadores pelo `Alias` do BlueZ, que persiste | uid 1000, sem helper |
| `scripts/bt_ponte_privilegiada.sh` | 7 verbos: `adaptadores`, `bonds`, `renomear`, `esquecer`, `descobrir`, `parear`, `regra-sudo` | helper instalado pelo `install.sh`, sem senha depois |

## Por que importa

**Renomear os dongles é pedido dela**, textual: *"temos que diferenciar os
dongles, renomear eles"*. Ela tem três adaptadores idênticos (mesmo VID:PID) e
hoje a única forma de distingui-los é `hciN`, que inverte entre boots.

**Mover um controle entre adaptadores é o gesto que a sala inteira depende.** A
divisão dos quatro controles entre os três adaptadores é o que faz a conta de
slots fechar ([GUIA-RADIO-DA-SALA.md](../../../GUIA-RADIO-DA-SALA.md) §6.4), e hoje
essa migração é uma sequência de comandos no terminal — §6.3 do mesmo guia. Sem
apagar o cache SDP junto, o pareamento novo nasce com SDP vazio, o BlueZ recusa
a reconexão como *unknown device*, o link cai sozinho e **parece defeito do
controle** (`SDP-CACHE-01`). É exatamente por causa disso que o helper
privilegiado foi instalado hoje.

**E a proteção do prefixo só funciona se o produto for o dono do nome.** O
prefixo `Nintendo` no alias não é enfeite: é ele que impede o Pro Controller de
cair sob carga (`BT-NINTENDO-ACTIVE-01`). Decisão dela: *"você escreve, o produto
protege o prefixo"* — o nome que a tela mostra é o dela, limpo; o que vai ao
BlueZ é o costurado. Enquanto não houver tela, essa decisão não tem onde
acontecer.

## O que NÃO é

- **Não é reabrir o alcance da aba.** Ele já foi reaberto por ela em 21/08
  (D-A2), e a nota datada está em `app/actions/external_controllers.py:11-14`.
- **Não é a E2 da N-IGUAL-A-UM-01**, que é desarmar o `head -1` do
  `bt_active_mode.sh`. Aquilo é o segundo escritor do alias; esta sprint é o
  primeiro. **A ordem importa:** pôr a tela antes de desarmar o `head -1` deixa
  dois escritores do mesmo alias, e a regra "nunca subtrai" garante que a
  palavra inventada nunca saia.

---

## Entregas

### ~~E1~~ **FEITA em 22/08** (`49797f8`) — os dongles ganham nome

Campo livre por adaptador na seção "A mesa", endereçado por BD Address e nunca
por `hciN`. O prefixo `Nintendo` é costurado por dentro, e a tela diz isso em
uma linha sem transformar em tarefa dela — que é a decisão dela ao pé da letra.

### E2 — mover um controle de adaptador vira um gesto

O helper tem os verbos. Falta a sequência, e ela é a do §6.3 do guia: esquecer
no adaptador antigo **com o cache junto**, parear no de destino. O produto tem
de dizer, antes, que o controle vai precisar entrar em modo de pareamento — e
tem de recusar com motivo quando o destino não existir.

**Cuidado medido em `67b07ed`:** os argumentos são MAC e MAC tem formato. Os
testes do helper mordem sobre `;`, `$(`, `..`, MAC malformado e argumento vazio.
Quem fiar a GUI ao helper passa argumento como elemento de argv, nunca por
string montada.

### ~~E3~~ **FEITA em 22/08** (`49797f8`) — a coluna "O que é" passa a ser LIDA

Decisão dela: *"classifica sozinho, você só corrige"*. A linha nasce preenchida
com `(lido)` da classe da interface 0, e os sete botões só aparecem onde o kernel
não soube. Na bancada dela, das quatro linhas de rádio vizinho **só uma** precisa
dela: o Wi-Fi Realtek, que sai como `ff`.

**Fica desta entrega, para a E4:** o censo enxerga muito mais do que a seção
mostra — todo aparelho USB com espécie, topologia (quem atrás de qual hub, qual
controlador PCI) e energia. A seção "A mesa" fala de RÁDIO, de propósito.

### E4 — o alcance que ela pediu, e que a leva de hoje não entregou

Pedido dela, textual: *"todo o rádio, hub de energia, todos os usb, todos os
dongles tipo do mouse e teclado, e até webcam ou microfones extras. tudo de
verdade."*

O censo já enxerga tudo isso — o kernel classifica pela interface 0, medido
nesta bancada: `03/01/02` mouse, `03/01/01` teclado, `e0/01/01` Bluetooth, `09`
hub. **O que falta é decisão de produto, e é dela:** o que uma central assim
mostra, o que ela deixa mudar, e o que ela só relata. Uma lista de tudo o que
está espetado no PC não é feature — é ruído — a menos que cada linha responda
uma pergunta que ela faz.

---

## Como morde

Arranque a chamada da E1 e a tabela perde o campo — e o portão que impede a
regressão inteira é o `portao_a_casa_sabe_e_o_produto_nao_faz.py`, que desde
`61ba2ab` mede alcance por grafo de import a partir dos pontos de entrada: com
as entregas ligadas, os dois módulos saem da lista de acusados; sem elas,
voltam para nela.

## O que este achado ensina

**Escrever a capacidade e declarar que a tela é de outra leva não é errado — é
honesto.** O que fecha o ciclo é a leva seguinte existir, com nome, e não
esperar semanas: aqui ela existiu **48 minutos depois** (`9bf54b7` às 20h01,
`49797f8` às 21h48). Sem isso, é a `A-CASA-SABE-E-O-PRODUTO-NAO-FAZ` de novo, e
esta casa já pagou por ela mais vezes do que por qualquer outro defeito.
