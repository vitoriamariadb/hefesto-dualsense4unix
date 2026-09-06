---
sprint: ROTA-06
estado: feita
---

# ROTA 06 — a aba que já pintava tudo, e o "Guardar" que apagava o perfil dela

> **ESTADO 06/09/2026: feita** — fase fechada em 02–03/09 (ONDE PARAMOS de 02/09, fim do dia; a aba 03 em 03/09).

**02/09/2026.** Frente da aba `06-navegacao`. O enunciado mandava descobrir *por
que `navega`, `teclado-estado`, `vel-cursor` e `vel-rolagem` não chegam à tela*.

**Eles chegam. Os quatro, e mais quatro.** O enunciado estava errado, e o erro
era da régua — não do produto.

---

## 1. O FATO DERRUBADO: "MENCIONA 7 campos e PINTA 3"

O `--passear` imprime `06-navegacao.html  1 pintura  3 valores`, e disso se
concluiu que a aba pinta 3 de 7. **O `3` é contagem de MUDANÇA.**

`hefesto_vivo.BOOTSTRAP`, na função `escrever()`: `if(el.textContent !== t){ … ;
return 1; } return 0;`. Um campo que já mostra o valor certo devolve **zero** — e
zero soma zero. A tela pinta oito elementos e conta três porque cinco já
coincidiam com o daemon dela.

Medido campo a campo, com o daemon VIVO (só leitura, `daemon_state_full`):

```
campo            ctl   o pacote manda                    a página publicada já mostrava
vel-cursor        —    '6'                               '6'      COINCIDE  -> escrever devolve 0
vel-rolagem       —    '1'                               '1'      COINCIDE  -> 0
conta             —    '2 controles:'                    '2 controles:'      COINCIDE -> 0
conta-b           —    '1 USB · 1 BT'                    '1 USB · 1 BT'      COINCIDE -> 0
teclado-estado    —    'Ligada — atalhos e teclado…'     (option selected)   COINCIDE -> 0
perfil            —    'meu_perfil'                      'Mortal Kombat'     MUDA     -> 1
navega           p1    'Navega o PC'                     'USB • Navega o PC' MUDA     -> 1
navega           p2    'Só a janela'                     'BT • Só a janela'  MUDA     -> 1
                                                                             ------------
                                                                             3 valores
```

Estado vivo no instante da medição (02/09, 04:23):

```
uniq 444648000003  transport=bt   is_primary=True   player=1
uniq d42f4b0000d8  transport=usb  is_primary=False  player=None
mouse_emulation   : {'enabled': False, 'speed': 6, 'scroll_speed': 1, 'bloqueio': 'desligada', …}
keyboard_emulation: {'enabled': True, 'osk_disponivel': True, …}
active_profile    : meu_perfil
```

**A distância entre "menciona" e "pinta" existe — mas não é onde o plano
apontava.** Ela está entre o que o pacote MANDA e o que a página tem onde
receber, e a medição disso achou três defeitos que a leitura de "3 de 7"
escondia.

---

## 2. DEFEITO 1 — metade da linha do cartão ia para a tela, e a outra metade morria

O desenho escreve o cartão assim (`aba06.controle`):

```html
<div class="nav-est" data-campo="navega"><span class="bolinha"></span>USB
     <span class="pt">•</span> Navega o PC</div>
```

O endereço cobre a **linha inteira**. O pacote mandava só o papel
(`"Navega o PC"`) e, ao lado, uma chave `via` que **nenhum endereço recebia**.
Como o piloto escreve `textContent`, o primeiro tique APAGAVA o `USB •`: a tela
nascia dizendo por onde o controle está ligado e parava de dizer meio segundo
depois. Visível nas fotos, antes e depois.

```
ANTES   P1 • Cosmic Red / Navega o PC          P2 • Starlight Blue / Só a janela
DEPOIS  P1 • Cosmic Red / BT • Navega o PC     P2 • Starlight Blue / USB • Só a janela
```

O `via` não se calcula aqui: `mesa_viva.mesa_do_estado` é o dono da tradução
(`"USB" if transporte == "usb" else "BT"`), e o pacote lê o traduzido da mesa.
Sem casa na mesa, sai só o papel — nunca um transporte adivinhado.

**A cura fez aparecer outra mentira, e ela não é desta aba:** a fita do topo
continua dizendo `P1 · Cosmic Red · USB` e `P2 · Starlight Blue · BT` — os
transportes TROCADOS, porque são os do mockup. `hefesto_vivo._fita` devolve `""`
enquanto a cor do plástico não chega (`if not mesa or any(not c.get("cor") …)`),
e num passeio de 8 s ela não chegou. Agora o cartão diz `BT` e a fita diz `USB`
sobre o mesmo controle. **O cartão é quem está certo.** A cura é em
`hefesto_vivo.py`/`mesa_viva`, fora deste território.

---

## 3. DEFEITO 2 — o "Guardar" era um apagador, e isso é medido

`guardar-definicoes` lê as 21 `<select>` da tela de pop-up pelo `data-hef-forma`
e grava em `Profile.button_actions`. Medido contra a página **publicada**:

* as 21 `<select>` têm `data-linha` (que o Guardar LÊ) e **nenhum `data-campo`**
  (que a pintura ESCREVERIA) — nada nunca as pintou com o perfil dela;
* logo elas mostram para sempre o que o gerador cravou;
* e o que o gerador cravou é **exatamente** `core.acoes_de_botao.padrao()`:

```
$ ... forma.py   (o que o piloto recolheria da página publicada)
  circle = 'Enter' -> KEY_ENTER · cross = 'Botão esquerdo' -> BTN_LEFT · … (21 linhas)
  linhas fora de acoes.BOTOES  : []
  rotulos nao reconhecidos     : []
  DIFERENTES do padrao         : {}
  => o gesto gravaria button_actions = None
```

`None` apaga o campo. Então **qualquer clique em "Guardar" apagava, em silêncio,
o que o perfil dela guardasse** — com o botão dizendo o contrário. É o caso mais
puro da regra da casa: *um campo com gesto e sem pintura é pior que os dois
faltando*.

A cura tem duas metades:

1. **o pacote passa a EMITIR as 21 linhas** (`acao-<botao>`), com o vocabulário
   inteiro do motor — `acoes.BOTOES` diz quais linhas existem, `acoes.padrao()`
   o de fábrica, `acoes.rotulo()` o texto da `<option>`. Zero tabela nova;
2. **o gerador as MARCA** com `data-campo` + `data-hef-alvo="valor"`. Quando o
   desenho for publicado, a tela mostra o perfil e o Guardar vira verdade.

Até lá, **o gesto RECUSA em vez de apagar**: forma toda no de fábrica + perfil
com escolhas = *o piloto releu o desenho*, não *ela zerou 21 linhas*. E zerar
tem botão próprio a dois centímetros ("Voltar ao padrão"), que zera dizendo e
ainda pede confirmação.

**O portão do desenho continua VERDE com as 21 marcações** — `data-campo` e
`data-hef-alvo` estão em `check_o_desenho_aprovado.INVISIVEIS`, logo nada do que
chega aos olhos dela mudou:

```
$ python scripts/check_o_desenho_aprovado.py
desenho: 13 página(s) na bancada `mockup/`
  o produto já tem ..... 13
  o produto está atrás . 0  (0 em trabalho)
OK: o produto não está atrás do desenho dela sem dizer por quê.
```

**E o `casamento.py` vai acusar 21 órfãos até o `--publicar 06`** — ele mede
contra o PUBLICADO, e lá os endereços ainda não estão:

```
$ casamento.py 06-navegacao.html        (DEPOIS, contra o publicado)
06-navegacao.html          7    33      6      27       1
   órfãos: acao-circle … acao-triangle (21), + os 6 do `SEM_ENDERECO`
```

Isso não é regressão: `casamento.py` só reprova o ZERO, e `casam` continua 6.
`test_a_06_nao_manda_para_o_vazio.py` mede contra a BANCADA — o desenho de hoje
—, que é onde o pacote tem de ser coerente, e está verde. O que separa os dois
números é exatamente a publicação, que é ato dela.

---

## 4. DEFEITO 3 — oito chaves de catorze iam para o vazio, com o portão verde

`casamento.py` já imprimia os órfãos e **reprovava só o ZERO**:

```
$ casamento.py 06-navegacao.html        (ANTES)
aba                     html   pac  casam  órfãos  vazios
06-navegacao.html          7    14      6       8       1
   órfãos: gestos, gestos-lista, rato-bloqueio, rato-despachando, rato-ligado,
           teclado-ligado, teclado-osk, via
```

Órfão silencioso e defeito real ficavam na mesma pilha. Agora:

* `via` virou parte do `navega` (era defeito, não falta de lugar);
* `teclado-ligado` saiu — era o mesmo bit de `teclado-estado`, que tem endereço;
* os seis restantes estão em `SEM_ENDERECO`, **com a razão medida de cada um**, e
  `test_a_06_nao_manda_para_o_vazio.py` reprova qualquer órfão não declarado;
* a `cobertura` parou de contar chave emitida como "pintado" — era o mesmo erro
  que produziu o "77%".

### O maior deles: o interruptor que diz "Ligado" com o mouse desligado

`rato-ligado` tem lugar no desenho — o **"Status do Modo"**. O que falta é o
piloto poder escrevê-lo. O widget é

```html
<input type="checkbox" id="st-modo" class="tog-in" checked>
<label class="tog" for="st-modo" data-gesto="modo"><span class="pino"></span><span class="txt"></span></label>
```

e a palavra sai da CSS: `.tog .txt::after{content:'Desligado'}` /
`.tog-in:checked + .tog .txt::after{content:'Ligado'}`. **Não há nó de texto para
pintar**, e `escrever()` sabe escrever texto, largura, fundo, `value` e `html` —
nunca uma classe nem um atributo. Medido: `mouse_emulation.enabled = False` no
daemon dela e a tela dizendo **Ligado**, nas duas fotos.

**A cura é no piloto, não aqui: falta um alvo que escreva atributo/classe.** O
`hefesto_vivo` já prova que sabe fazê-lo — o ramo dos `vazios` escreve
`el.dataset.conectado` e mexe em `classList` —, mas só para os lugares vazios, em
código cravado. Enquanto esse alvo não existir, este interruptor mente em toda
tela que o use.

---

## 5. OS TRÊS GESTOS DESTA ABA QUE ESTAVAM NA LISTA DOS DEZESSEIS

| gesto | classificação | a prova |
| --- | --- | --- |
| `guardar-definicoes` | **(c) MENTIU** — e pior que mentir: apagava | as 21 linhas nunca eram pintadas, a forma era sempre o de fábrica, e o gesto gravava `button_actions = None`. Curado: recusa dizendo, e as linhas passam a ser pintadas |
| `padrao-definicoes` | **(a) agiu com razão** | gravar `None` nos dois campos **é** o trabalho dele, e ele sai sem gravar quando o perfil já está de fábrica. `test_o_padrao_dos_atalhos_volta_de_fabrica.py` já cobra os três casos |
| `teclado` | **(a) agiu com razão** | chama `keyboard.emulation.set` e o daemon ECOA — `keyboard_emulation.enabled` volta no `state_full` e pinta `teclado-estado`. O "aplicado sem mudar nada" do inventário é o clique na opção **já selecionada**: `enabled` já era `True` |

Esta aba continua com **zero `SEM_ECO`**, e a razão é que os três métodos que ela
usa voltam no `state_full`.

---

## 6. O QUE ESTA FRENTE NÃO FEZ, e por quê

* **Não publicou HTML.** `mockup/06-navegacao.html` ganhou as 21 marcações; o
  publicado só recebe pelo `--publicar 06`, que é ato dela.
* **Não tocou no `hefesto_vivo.py`.** As duas curas que ele precisa (o alvo de
  classe/atributo e a fita que não repinta sem cor) estão descritas acima.
* **Não deu `data-controle` aos cartões vazios P3/P4.** Eles não têm, e um
  terceiro controle na mesa não recebe pintura nenhuma nesta aba — só as `01`,
  `02` e `03` endereçam `p3`/`p4`. Meia cura (pintar o estado num cartão cuja
  moldura continua dizendo "Desconectado") seria pior que a falta.
* **Não mexeu na moldura verde do cartão.** Quem navega é `is_primary`, que
  muda; o TEXTO acompanha, a classe `.nav-ctl.navega` não. Mesma dependência do
  alvo de classe.
