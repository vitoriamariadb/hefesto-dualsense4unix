---
sprint: ONDA5-09-02
decisoes: [09-Q3 (a metade de mecanismo)]
posse:
  09B:
    - src/hefesto_dualsense4unix/interface/pacotes/a09_sistema.py
cria:
  - tests/unit/test_o_atualizar_da_aba_09_confirma_o_que_fez.py
depois_de: [ONDA2-09-SISTEMA-01, ONDA4-S10-O-TRANSPORTE-01]
nao_toca:
  - src/hefesto_dualsense4unix/interface/aba09.py
  - mockup/09-sistema.html
  - src/hefesto_dualsense4unix/interface/paginas/09-sistema.html
  - src/hefesto_dualsense4unix/interface/pacotes/ponte.py
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
  - src/hefesto_dualsense4unix/daemon/lifecycle.py
  - tests/unit/test_a_aba_09_sistema_fecha_as_linhas.py
  - docs/data/paridade-gtk-html.csv
---

# ONDA5-09-02 · DEFEITO — o "Atualizar" não diz "Pronto." sem ter feito

> **O esclarecimento dela, 05/09/2026, sobre a 09-Q3:**
>
> > *"o botão diz Atualizando… e no fim o campo pisca em verde — **mas o botão
> > tem de realmente fazer o que promete**"*
>
> A palavra escrita antes, na mesma pergunta: *"Atualizando **e funciona em
> termo de feature**"*.

**Ela disse duas coisas e a segunda é a que custa.** A primeira é rótulo e mora
na `ONDA5-09-01`. Esta sprint é a segunda: **o Hefesto não explica a própria
falha — ele a conserta**, e um botão que diz "Pronto." depois de não ter feito
nada é a falha explicando-se com a palavra errada.

**O trabalho é de UM arquivo.**

---

## 1. O QUE SE MEDIU — o botão sabe se deu certo, e joga fora

O gesto inteiro são duas linhas de código:

```python
    p.chamar("daemon.reload")
    _LENTO.clear()
```
— `src/hefesto_dualsense4unix/interface/pacotes/a09_sistema.py:1510-1511`

**`chamar` devolve `bool`, e ninguém o lê.**

```python
def chamar(metodo: str, timeout: float | None = None, **params: Any) -> bool:
    ok, _ = _b._safe_call(metodo, params, timeout=timeout or teto(metodo))
    return bool(ok)
```
— `src/hefesto_dualsense4unix/interface/pacotes/ponte.py:169-181`

E `_safe_call` devolve `(False, None)` para **daemon desligado, socket ausente,
timeout de conexão e erro JSON-RPC do servidor** —
`src/hefesto_dualsense4unix/app/ipc_bridge.py:105-112`.

### O desfecho, seguido até o pixel

O gesto **não levanta**. O piloto então executa o ramo do sucesso:

```python
                self.desfechos[f"{pagina}:{nome}"] = ("aplicou", "")
                GLib.idle_add(
                    lambda r=resposta: self._deu_certo_dizendo(pagina, nome, alvo, r))
```
— `src/hefesto_dualsense4unix/interface/hefesto_vivo.py:2111-2113`

…que deposita `FRASE_DE_SUCESSO` — **"Pronto."** — em verde
(`hefesto_vivo.py:158` e `:2254`).

**A CENA COMPLETA, com o serviço desligado:** o botão troca de palavra, espera o
tempo do teto, volta ao rótulo original e a tela diz **"Pronto."** em verde.
Nenhum byte saiu, e a tela afirma que saiu.

**E o botão não fica cinza para avisar**, porque `atualizar` não é um dos três
que a camada do produto tranca: `BOTOES_CINZAS = ("retomar", "reiniciar",
"ver-plugins")` — `a09_sistema.py:1310`. **Com o serviço parado, este botão fica
aceso, clicável, e mente ao ser clicado.**

### O irmão a 650 linhas de distância já faz certo

No MESMO arquivo, `ver-plugins` lê a resposta da mesma função e a usa na frase:

```python
    releu = p.chamar("plugin.reload")
    …
        motivo = ("os plugins estão ligados e não há nenhum no diretório"
                  if releu else "os plugins não estão habilitados neste daemon")
```
— `a09_sistema.py:2165-2172`

**Não falta mecanismo. Falta uma linha, e a casa já sabia disso** — o docstring
da função que resolve está escrito uma acima da que se usa:

> *"Prefira esta quando o botão precisar DIZER por que não deu. **Um botão que
> falha calado é a mesma doença de um botão que não faz nada.**"*
> — `ponte.py:184-190`, `chamar_detalhado`

---

## 2. E O QUE O BOTÃO FAZ QUANDO DÁ CERTO — medido, e é menos do que a dica diz

O clique manda `daemon.reload` **sem `config_overrides`**. Do outro lado:

| onde | o que acontece com o parâmetro vazio |
| --- | --- |
| `src/hefesto_dualsense4unix/daemon/ipc_handlers.py:5450` | `overrides` chega `{}` |
| `ipc_handlers.py:5462` | `new_cfg = replace(self.daemon.config, **{})` — uma cópia de valor **igual** |
| `src/hefesto_dualsense4unix/daemon/lifecycle.py:1351-1352` | derruba e sobe o leitor de atalhos — **isto acontece** |
| `lifecycle.py:1353` e `:1361` | os ramos que reaplicam mouse e teclado comparam `old` com `new`: **nunca disparam** |
| `lifecycle.py:1366-1370` | o registro sai com `keys_changed=[]` |
| `ipc_handlers.py:5472` | reescreve os arquivos de ambiente da Steam — **isto acontece** |

**Duas coisas acontecem, e a dica promete "reaplicar a configuração", que soa
como todas.** Quem corrige a dica é a `ONDA5-09-01`, dona do texto de tela;
**esta sprint é a fonte da medição**, e as duas citam as mesmas linhas.

### O TERCEIRO buraco, e ele NÃO é desta aba — declarado, não construído

```python
        with contextlib.suppress(Exception):
            …
            materialize_launch_env(self.daemon)
        return {"status": "ok", "config": _config_que_viaja(new_cfg)}
```
— `ipc_handlers.py:5467-5473`

A metade Steam pode falhar inteira e a resposta ainda sai `"ok"` —
`materialize_launch_env` também nunca propaga por conta própria
(`src/hefesto_dualsense4unix/daemon/launch_env.py:2165-2167`). **A cura mora no
daemon, que está no `nao_toca`.** Fica declarado aqui porque *declarar é o que
separa dívida de esquecimento*: enquanto isso, o "Pronto." desta aba responde
por **uma** das duas metades, não pelas duas.

**E há precedente do mesmo pedaço de código:** `ipc_handlers.py:46-60` registra o
DEFEITO VIVO de 03/09 em que `daemon.reload` **fazia o trabalho e a resposta
nunca chegava**, com a frase que vale palavra por palavra aqui — *"O PIOR
DESFECHO NÃO É O ERRO — É O TRABALHO FEITO SEM RESPOSTA."* É por causa dele que
a frase de recusa do Passo 2 **não pode afirmar que nada foi feito**.

---

## 3. O TRABALHO, EM QUATRO PASSOS

### Passo 1 — o gesto lê a resposta

`a09_sistema.py:1510-1511` passa a:

```python
    ok, motivo = _ok_e_motivo(p.chamar_detalhado("daemon.reload"))
    _LENTO.clear()
    if not ok:
        raise RuntimeError(motivo or FRASE_SEM_CONFIRMACAO)
```

**`_ok_e_motivo` NÃO É ENFEITE, E É A ARMADILHA DESTE PASSO.** Ele já existe
(`a09_sistema.py:1540`) e o docstring dele diz por quê: o dublê da régua
responde `True` a qualquer nome que não termine em `_set`
(`tests/unit/test_os_botoes_tem_dono.py:99-104`), então
`ok, motivo = p.chamar_detalhado(…)` **rebentaria com `TypeError` na régua e
funcionaria na mão dela** — a régua reprovando a cura, a forma de defeito que
esta casa pagou onze vezes em 26/08 e mais duas em 04/09.

**A ORDEM NÃO MUDA E O COMENTÁRIO DE `:1506-1508` CONTINUA VALENDO:** zera-se o
cache **depois** de o `daemon.reload` voltar. E agora ele zera **nos dois
desfechos**, de propósito: uma recusa na tela ao lado de cinco leituras caras de
até 2 s atrás é a tela dizendo "não deu" sobre valores que ninguém releu.

**A MORDIDA:** troque de volta para `p.chamar("daemon.reload")` sem ler o
retorno, e a régua do Passo 4 mede o botão dizendo **"Pronto."** com a ponte
recusando.

### Passo 2 — a frase da recusa diz AS DUAS METADES

`_call_checked` — que é quem `chamar_detalhado` usa — **só traz `motivo` quando
o daemon respondeu e recusou por parâmetro inválido**; falha de transporte volta
`(False, None)`, e está escrito com todas as letras em
`src/hefesto_dualsense4unix/app/ipc_bridge.py:382-387`. Na mesa dela, com o
serviço parado, o `motivo` é `None`.

A frase de reserva **não pode dizer *"nada foi reaplicado"***: um timeout é
exatamente o caso em que o daemon pode ter feito o trabalho e a resposta não ter
chegado (`ipc_handlers.py:49-60`).

Ela diz o que se sabe e o que não se sabe, que é a decisão de hoje
([AS DUAS ABAS FALAM](2026-09-05-AS-DUAS-ABAS-FALAM-01-o-aparelho-recebeu-e-o-perfil-nao-guardou.md)),
em uma linha:

> *"não consegui falar com o serviço: pode não ter reaplicado nada, e pode ter
> reaplicado sem me responder. Clique de novo com o serviço de pé."*

**Reaplicar duas vezes não custa nada** — é o mesmo `replace` do mesmo estado,
medido na §2 —, então mandar clicar de novo é seguro. **A frase mora numa
constante do módulo**, ao lado das outras, e não digitada dentro do gesto: texto
de tela repetido em dois lugares é o que diverge no primeiro dia em que alguém
mexe num.

**A MORDIDA:** faça o dublê devolver `(False, "o serviço não respondeu")` e
depois `(False, None)`. Na primeira a tela mostra a frase DO PRODUTO; na
segunda, a de reserva. Uma régua que só testa a primeira dá verde sobre o caso
que acontece de verdade na mesa dela — daemon desligado devolve `None`.

### Passo 3 — o contrato do módulo acompanha, ou a régua desliga sozinha

Três lugares, e nenhum é opcional:

| onde | de | para |
| --- | --- | --- |
| `a09_sistema.py:2248` | `PONTE = {"chamar", "machine_declare", "resultado"}` | mais `"chamar_detalhado"` |
| `a09_sistema.py:2277-2278` | `"chama": [("chamar", ["daemon.reload"], {})]` | `("chamar_detalhado", ["daemon.reload"], {})` |
| `a09_sistema.py:2249-2250` | `METODOS` já traz `"daemon.reload"` | **não muda** |

`PONTE` é a lista que `test_nenhum_gesto_chama_funcao_que_a_ponte_nao_tem`
confere contra a ponte real; `PROVAS` é o que clica o gesto de verdade contra o
dublê e olha o que chegou.

**A MORDIDA:** cure o Passo 1 e **não** mexa em `PROVAS` — a prova reprova
dizendo que esperava `chamar` e recebeu `chamar_detalhado`. É a régua fazendo o
trabalho dela: ela mede a chamada que saiu, não o texto do arquivo.

### Passo 4 — a régua nova, e ela mede o DESFECHO, não a linha

`tests/unit/test_o_atualizar_da_aba_09_confirma_o_que_fez.py`, com uma ponte de
mentira que recusa, e três asserções:

1. **com a ponte recusando**, o gesto **levanta `RuntimeError`** — e a frase
   contém as duas metades do Passo 2;
2. **com a ponte aceitando**, o gesto volta sem levantar e `_LENTO` está vazio —
   a aba relê na hora, que é a metade barata que ela mandou manter no botão;
3. **com a ponte recusando**, `_LENTO` está vazio **também** — o Passo 1 zera nos
   dois desfechos.

**ELA NÃO PODE LER O TEXTO DO ARQUIVO.** Onze réguas desta casa caíram em 26/08
por *digitarem o que deviam LER*; esta chama o gesto e olha o que ele fez.

**E ELA NÃO CLICA NO PRODUTO VIVO.** `atualizar` não está em
`hefesto_vivo.PERIGOSOS`, e não precisa estar — a régua usa o dublê, e nenhum
byte vai ao daemon de quem roda a suíte.

**A MORDIDA:** arranque o `if not ok: raise` e as asserções 1 e 3 reprovam. A 2
continua verde — e é assim que se sabe que ela mede outra coisa.

---

## 4. O QUE ESTA SPRINT NÃO CONSTRÓI

* **O pisca verde de ~1,5 s** (decisão 03-Q4, das dez abas). É peça do piloto,
  que está no `nao_toca`. Enquanto ele não chega, o sucesso deste botão fala
  pela tarja verde de hoje (`hefesto_vivo.py:2254`) — e a recusa que esta sprint
  acrescenta chega pela tarja laranja, pelo mesmo depósito (`:2197`).
* **A suppress do `materialize_launch_env`** — §2, declarada e do daemon.
* **O rótulo e a dica** — `ONDA5-09-01`.

---

## 5. NADA SE PERDEU — o que existe hoje e tem de continuar existindo

* **O gesto continua rodando em THREAD.** `daemon.reload` leva 9,5 s medidos no
  daemon dela em 01/09; síncrono, ele congelaria a janela inteira
  (`hefesto_vivo.py:2080-2084`). Nada nesta sprint pode trazê-lo para o laço do
  GTK.
* **O teto de 15 s.** `ponte.py:143-160` dá a `daemon.reload` um timeout maior
  que o resto do produto justamente porque ele demora. `chamar_detalhado` **usa
  o mesmo `teto(metodo)`** (`ponte.py:190`) — conferido, e é o que faz a troca de
  função não encolher a espera para os 0,25 s do padrão. **Confira isto de novo
  antes de fechar:** se encolher, o botão passa a recusar todo clique que
  funciona, e a cura vira um defeito pior que o original.
* **`_LENTO.clear()` depois do retorno**, nunca antes: zerar no meio dos nove
  segundos publicaria o estado de antes como se fosse o de depois.
* **`SEM_ECO` continua listando `atualizar`** (`a09_sistema.py:2321`) e a razão
  escrita em `:2302-2303` continua verdadeira: o `state_full` fica igual quando
  nada no disco mudou.
* **`ver-plugins` continua lendo o `releu`** (`a09_sistema.py:2165`). Esta sprint
  copia o padrão dele; não o mexa.
* **Os três botões cinzas** (`retomar`, `reiniciar`, `ver-plugins`) e o
  `razoes_do_cinza` que os alimenta a cada tique (`a09_sistema.py:1345`, chamado
  em `:1163`). **`atualizar` não entra em `BOTOES_CINZAS`**: a camada do produto
  não tem trava para ele, e pintar de cinza um botão que este arquivo deixa
  clicar seria a tela dizendo o contrário do que o produto faz.
