---
sprint: ONDA-JOGAR-02
posse:
  J2:
    - src/hefesto_dualsense4unix/app/actions/jogar/seletor_de_modo.py
cria:
  - tests/unit/test_jogar_desligado_e_um_botao_da_fileira.py
bancada: false
depois_de:
  - ONDA-JOGAR-01
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/home_actions.py
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/app/actions/daemon_actions.py
---

# ONDA JOGAR · 02 — o quarto botão: Desligado entra na fileira

**Onda:** JOGAR (aba 1).

## O defeito, em uma frase

O gesto mais forte da aba — desligar o Hefesto — mora **fora** da fileira de
modos, num quadro "Sessão" próprio, enquanto o mockup dela põe **Desligado
como o primeiro dos quatro botões** da mesma fileira.

## O que existe hoje

- `home_actions.py:153` — `_MODE_ITEMS` tem **três** itens: `desktop`,
  `gamepad`, `native`.
- `home_actions.py:2298-2330` — o frame **Sessão**, com um botão único que
  troca entre `_BTN_LABEL_ONLINE` (`"Desligar Hefesto (voltar ao Linux puro)"`,
  `:255`) e `_BTN_LABEL_OFFLINE` (`"Ligar o Hefesto"`, `:256`), despachado por
  `_on_home_power_clicked`.
- O quarto estado **não é um `kind` do perfil**: `profiles/schema.py:584`
  declara `Literal["desktop", "gamepad", "native"]`. Desligado é sessão, não
  perfil — e é por isso que ele persiste no disco
  (`utils/session.load_gamepad_preference`, lido em `home_actions.py:2395`).

## O que o mockup manda

```
O que o controle faz agora:
[ Desligado ] [ Controlar o PC ] [ Jogar pelo Hefesto ] [ Conexão Nativa (Sony) ]
```

Quatro botões, **largura completa do bloco** — pedido literal dela:

> *"ajusta altura e largura dos botões pra ocuparem a largura completa do bloco
> tal como dualsense e xbox."*

E a legenda do mockup, que ela aprovou: *"Quatro modos, não três — Desligado
entra na fileira como você decidiu; a Sistema fica com 'Encerrar o serviço'."*

O texto do modo é dica do `?` do quadro, não rótulo na tela:

> *"**Desligado** — o Hefesto para de agir. O controle continua funcionando
> como um controle comum do Linux."*

## O que esta sprint entrega

1. **`seletor_de_modo.py` com quatro itens.** O quarto (`off`) não vira `kind`  <!-- ref-externa: nasce na ONDA-JOGAR-01, ainda não executada -->
   de perfil: ele chama o mesmo caminho que o botão de Sessão chamava hoje —
   `_on_home_power_clicked` — e nada é inventado no backend.
2. **O botão reflete o estado real.** Com o daemon parado ou o opt-out gravado
   em disco, `Desligado` nasce marcado — hoje isso vive em
   `self._home_offline` e `self._home_opt_out_cache`. É o mesmo fato, com um
   escritor só (P5).
3. **A largura completa**, medida contra o bloco, como os dois botões de
   máscara.
4. **O diálogo de confirmação continua**, e continua dizendo o que se perde: é
   o único gesto desta aba que apaga o produto.

## Como se prova — o teste que MORDE

`tests/unit/test_jogar_desligado_e_um_botao_da_fileira.py`

1. **A fileira tem quatro rótulos, nesta ordem** — e o teste compara a lista
   inteira, não "contém". Tire um e ele diz qual.
2. **Clicar em `Desligado` abre o diálogo e, só depois do sim, chama o mesmo
   handler de hoje.** Com um dublê que conta chamadas: se alguém trocar o
   caminho por um `daemon.pause` (que é OUTRO gesto, e persiste em disco), o
   teste reprova.
3. **Daemon offline ⇒ `Desligado` marcado, e nenhum outro.** Arranque a
   leitura do `_home_offline` e a aba passa a mostrar `Jogar pelo Hefesto`
   marcado com o produto morto — que é a mentira que este caso mata.
4. **A largura**: com `Gtk.OffscreenWindow`, a soma das larguras dos quatro
   botões iguala a largura do bloco (mesma régua que a fileira de máscara já
   passa).

## O que é dela decidir

1. **O `Desligado` vale no clique ou só no `Aplicar`?** Os outros três só
   marcam (D-APLICAR-NAO-SALVA, `marcar_escolha` em `home_actions.py:1743`).
   Um gesto destrutivo que espera o Aplicar é coerente com a fileira; um que
   vale na hora é coerente com o botão de hoje. **Está proposto: vale no
   clique, com diálogo** — é o comportamento que ela já tem hoje, e reduzir
   um gesto forte a uma marca pendente é mudança de semântica.
2. **A ordem dos quatro.** Legenda do mockup, dele para ela: *"pus Desligado
   primeiro (é o 'menos')... Pode ser o inverso."*
3. **Ligar/Desligar em dois lugares** (aqui e na Sistema): a Sistema fica com
   "Encerrar o serviço" como manutenção, ou sai? (pergunta 2 do redesenho).

## Fontes

- `novo-layout/01-jogar.html`, quadro *Quando o jogo abrir* e a legenda.
- `/tmp/coleta/hoje.md`, fala [34].
- `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 1 e padrão P6.
