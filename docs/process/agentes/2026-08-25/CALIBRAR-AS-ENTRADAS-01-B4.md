# CALIBRAR AS ENTRADAS-01 · B4 — a CAL-1 e a CAL-2

25/08/2026, madrugada. Árvore `hefesto-voo/CALIBRAR-AS-ENTRADAS-B4`, branch
`voo/CALIBRAR-AS-ENTRADAS-B4`. Escopo estreito de propósito: **só a CAL-1 e a
CAL-2**. As telas (CAL-3 a CAL-7) ficaram para a próxima leva.

## O que mudou

**`src/hefesto_dualsense4unix/integrations/entradas_do_gabinete.py` (novo, CAL-1)**
— o leitor de entradas, dono único. Funções puras: sem GTK, sem IPC, sem
`/dev`, sem subprocesso, sem root. Raiz de `/sys` e os três leitores (`listar`,
`ler`, `real`) entram por argumento, nunca por constante de módulo.

| o que responde | assinatura |
|---|---|
| os nós de entrada, com `state`, `connect_type`, `panel`, `peer` | `listar_entradas(*, raiz_usb=RAIZ_USB_PADRAO, listar=os.listdir, ler=None, real=os.path.realpath) -> tuple[NoDeEntrada, ...]` |
| os nós agrupados em BURACOS pelo `peer` | `furos(entradas: Sequence[NoDeEntrada]) -> tuple[Furo, ...]` |
| os buracos sem nada encaixado — a caminhada | `vazias(entradas: Sequence[NoDeEntrada]) -> tuple[Furo, ...]` |
| o buraco onde um aparelho está | `entrada_de(caminho: str, entradas, *, raiz_usb=…, real=…) -> Furo \| None` |
| o buraco que o mapa declarou, contra a leitura de agora | `furo_declarado(nos: Sequence[str], entradas) -> Furo \| None` |

`NoDeEntrada` (frozen): `no`, `caminho_sysfs`, `hub`, `numero`, `estado`,
`tipo_de_encaixe`, `painel`, `posicao_horizontal`, `posicao_vertical`, `par`,
`aparelho`, `velocidade_mbps`, `excesso_de_corrente`, e a propriedade `vazio`.

`Furo` (frozen): `nos`, `entradas`, `aparelho`, `painel`, `tipo_de_encaixe`, e
as propriedades `vazio` (todos os nós vazios) e `rapido` (`True`/`False`/`None`).

Constantes públicas: `RAIZ_USB_PADRAO`, `ESTADO_VAZIO` (`"not attached"`),
`ESTADO_OCUPADO`, `VELOCIDADE_SUPERSPEED_MBPS`.

**`src/hefesto_dualsense4unix/integrations/lugar_declarado.py` (novo, CAL-2)**
— o chamador que faltava para `gravar_rascunho_da_mesa`, que estava escrita
desde 24/08 com **zero chamadores**. `declarar_a_mesa(declaracao) -> Recibo`
grava direto no disco, **nunca levanta**, e traduz as três recusas possíveis em
`Recibo(gravou, motivo)` com os tokens `MOTIVO_VERSAO_ESTRANHA`,
`MOTIVO_SCHEMA_RECUSOU` e `MOTIVO_DISCO`. `utils/maquina.py` **não foi tocado**.

**A validação do instrumento contra o `/sys` REAL dela** (leitura, sem escrita):
22 nós, 15 buracos, 11 vazias, 3,29 ms — os mesmos três números que a §2.2 da
sprint mediu por outro caminho. `entrada_de("4-4")` devolve
`('usb3-port4', 'usb4-port4')`, que é o par 2.0/3.0 do Wi-Fi.

## Qual mordida prova

Cinco mordidas, cada uma com a saída da reprovação e a do verde.

### 1. `test_o_par_2_0_e_3_0_e_um_furo_so` (obrigatória)

Arrancada: o `peer` ignorado no agrupamento de `furos()`.

```
E  AssertionError: `usb1-port5` e `usb2-port1` são o mesmo buraco (peer),
   e sairam separados: ('usb1-port5',)
E  assert ('usb1-port5',) == ('usb1-port5', 'usb2-port1')
1 failed in 0.20s
```

Devolvida: `1 passed in 0.20s`.

### 2. `test_entrada_vazia_aparece_com_state_not_attached` (obrigatória)

Arrancada: `listar_entradas` filtrando `if no_lido.aparelho`.

```
E  AssertionError: a entrada vazia sumiu da lista — sem ela a calibração
   não tem o que mostrar; sobraram 4 nós
1 failed in 0.20s
```

22 nós viraram 4. Devolvida: verde.

### 3. `test_a_caminhada_nao_visita_o_buraco_onde_o_mouse_dela_esta` (o F-2)

Arrancada: `Furo.vazio` de `all()` para `any()`.

```
E  AssertionError: `usb2-port2` é o lado 3.x do buraco onde o mouse `1-6`
   está — a caminhada não pode mandar ninguém lá
1 failed in 0.20s
```

Devolvida: verde. Este é o defeito que manda alguém se ajoelhar atrás do
gabinete para encaixar um cabo onde já tem aparelho.

### 4. `test_grava_sem_ipc` (obrigatória, CAL-2)

Arrancada: a chamada a `gravar_rascunho_da_mesa` trocada por `gravou = False` —
o comportamento de hoje, com a gravação só por `machine.declare`.

```
E  AssertionError: nada foi gravado com o daemon parado — a tela diria:
   'O Hefesto está desligado — não gravei o que você declarou'
E  assert False
E   +  where False = PosixPath('…/.xdg/config/hefesto-dualsense4unix/maquina.json').exists
1 failed in 0.24s
```

A mesma arrancada derruba mais dois testes do arquivo. Devolvida:
`5 passed in 0.24s`.

### 5. `test_o_caminho_da_gravacao_nao_conhece_ipc`

Arrancada: um `from hefesto_dualsense4unix.cli import ipc_client` no módulo.

```
E  AssertionError: o chamador voltou a depender do daemon:
   ['from hefesto_dualsense4unix.cli import ipc_client  # MORDIDA']
1 failed in 0.24s
```

Também exercitei o `except ValueError` de `declarar_a_mesa`: arrancado, o teste
`test_declaracao_invalida_recusa_em_vez_de_levantar` vira `ValidationError`
crua — que na janela é a cerimônia inteira caindo em cima da resposta que a
pessoa acabou de dar.

### Os portões

```
pytest tests/unit/test_entradas_do_gabinete.py
       tests/unit/test_a_calibracao_grava_com_o_daemon_morto.py   17 passed
ruff check src/ tests/                                            All checks passed
mypy src/hefesto_dualsense4unix                                   214 files, 0 issues
validar-acentuacao / glifos / referencias-docs                    rc=0
check_anonymity / check_test_data / check_endereco_de_radio       rc=0
check_version_consistency / check_packaging_parity                rc=0
validar-caducos / check_faixa_sintetica                           rc=0
```

`validar-referencias-docs.py` estava **vermelho antes de eu começar**: 9
referências mortas, todas do documento desta sprint. Três fecharam porque criei
os arquivos; as outras seis (CAL-3 a CAL-7) ganharam o marcador
`<!-- ref-externa: nasce na leva das telas, ainda não existe -->`, que é o
remédio documentado no cabeçalho do próprio portão e o mesmo padrão que a
`CONEXOES-MAPA-2D-01` já usa. Agora: rc=0.

**Não rodei a suíte inteira** (a regra da casa: ela cria nós uinput de verdade).

## O que NÃO verifiquei

- **A volta completa com o aparelho na mão.** Nenhum pulso, nenhuma luz, nenhum
  cabo encaixado. Os dois relógios do §2.5 continuam sendo leitura de outra
  medição, não minha.
- **O hub externo plugado.** Ele saiu às 02h36 e não voltou. Os 16 nós de hub
  existem só na bancada de mentira; nunca vi um `3-1-portN` real.
- **`Furo.rapido` contra o metal.** A régua é o `speed` do hub, e ela responde
  `True` para o par 2.0/3.0 e `False` para o nó solitário de `usb1`. **NÃO
  VERIFICADO** que isso case com o plástico azul do gabinete dela — e o módulo
  diz "não sei" em vez de prometer.
- **Que o `peer` do kernel seja sempre um par e nunca uma cadeia.** O
  agrupamento é aos pares com guarda contra alvo repetido; uma cadeia de três
  não foi observada nem construída.
- **Que `<dispositivo>/port` exista em todo kernel.** Existe nos quatro
  aparelhos desta bancada. `entrada_de` cai no índice invertido quando não
  existe, e esse caminho de queda está testado só contra a bancada de mentira.
- **Nada de GTK, nada de tela, nada de foto.** A CAL-1 e a CAL-2 não desenham
  pixel nenhum.

## O que sobrou para o próximo

### 1. A CAL-2 não alcança onde a calibração precisa gravar — e é `PARE e diga`

`gravar_rascunho_da_mesa` escreve em `{"mesa": …}`. O lugar de cada entrada mora
em **`mapa`**, que a `CONEXOES-MAPA-2D-01` (A5) acabou de pôr como campo de
**TOPO** de `MaquinaConfig`, irmão de `mesa` — não dentro dela. Confirmado em
`voo/CONEXOES-MAPA-2D-A5` (`1915cc3`): `MapaDaMesa` existe, `mapa:` está no
topo, e **não nasceu um `gravar_rascunho_do_mapa`**.

Consequência: `declarar_a_mesa` liga a primitiva que estava desligada, mas a
resposta *"esta entrada fica na frente"* ainda não tem por onde descer ao disco
sem daemon. O que falta é uma irmã de uma linha em `utils/maquina.py` —
`gravar_rascunho_do_mapa(d) -> bool` devolvendo `gravar_maquina({"mapa": …})` —
e ela é **posse da A5**, não minha. Não editei aquele arquivo.

Com ela no lugar, `lugar_declarado.py` ganha uma segunda função gêmea de três
linhas e a CAL-2 fecha inteira. Sem ela, a leva das telas não tem onde gravar.

### 2. Divergência entre a sprint e o que entreguei

A §8 da sprint diz que a CAL-2 mora em `src/hefesto_dualsense4unix/utils/maquina.py`
(*"só o chamador"*). Quem despachou instruiu o contrário — aquele arquivo é
posse da A5 nesta madrugada — e o chamador nasceu em
`integrations/lugar_declarado.py`. Segui o despachante. O documento da sprint
continua dizendo o outro.

### 3. Nada do que o mockup mostra ficou fora — mas nada dele foi implementado

Li o mockup inteiro. **Não achei divergência** entre ele e a sprint no que toca
à CAL-1 e à CAL-2: as duas são leitura e gravação, e o mockup é tela. Tudo o que
ele desenha (as duas fases, a pergunta única do hub, `[Não alcanço]`, a marreta
de 0,82 s, os dois relógios ditos sem eufemismo) é CAL-3 a CAL-7.

### 4. O que a frente das telas herda

Importa dois módulos e nada mais:

```python
from hefesto_dualsense4unix.integrations.entradas_do_gabinete import (
    listar_entradas, furos, vazias, entrada_de, furo_declarado,
)
from hefesto_dualsense4unix.integrations.lugar_declarado import declarar_a_mesa
```

Três coisas que a tela precisa saber antes de desenhar:

1. **a caminhada visita `vazias(entradas)`, que devolve `Furo`, não `NoDeEntrada`.**
   Contar nós daria 22 buracos onde existem 15, e mandaria ela ao buraco do
   mouse. O contador "entrada 4 de 15" é sobre furos;
2. **`furo_declarado(...) is None` significa "o hub sumiu", nunca "a entrada não
   existe".** A frase de tela dessa distinção é da `CONFIGURACOES-O-LEXICO-01`,
   mas o dado está separado;
3. **`Furo.rapido` é `True`/`False`/`None`**, e o `None` tem de virar "não sei"
   na tela, nunca "não".

### 5. Os três defeitos declarados da §7 continuam sem dono nesta árvore

O portão do idioma que não lê o `.glade` (§7.1) e a HARM-16 desarmada depois do
primeiro `rumble.stop` (§7.2) seguem como a sprint os deixou. O §7.3 — a
primitiva sem chamador — é o que esta entrega fecha pela metade (ver o item 1).
