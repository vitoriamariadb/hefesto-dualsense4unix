# ONDA G — a aba Perfis, e o perfil por controle

**ESPERA A ONDA A** — a tabela de controles precisa dos NOMES que a identidade
vai publicar.

## O QUE ELA VIU, e disse

> *"Prioridade 80 de 200. O maior vence a disputa quando dois perfis poderiam
> entrar. esse texto em perfis nem faz sentido mais fora a tabela dos
> controles."* <!-- noqa-acento: citação literal dela -->

Fotografado: a aba mostra `Prioridade 1 de 200` para um perfil cuja lista exibe
`1`, e a tabela `Controle / Ajuste próprio / ID da peça` traz só um `1`,
sozinho. O cabeçalho diz `0 de 1 controle com ajuste próprio neste perfil` com
DOIS controles na mesa.

**Medido:** a aba escreve **1 campo de 3**, e tem 2 gestos, um deles (`ativar`)
na lista dos que dizem "aplicado" sem mudar nada.

## O REUSO, PRIMEIRO

```
app/actions/profiles_actions.py   21 funções — a interface alcança UMA
app/actions/profile_writer.py     1 função — ZERO alcançadas
app/draft_config.py               o rascunho de perfil (já importado 1x)
```

**Vinte e uma funções de perfil no motor, uma alcançada.** Esta é a aba com a
maior distância entre o que existe e o que se liga.

## O TRABALHO 4 DO CONTRATO — o perfil por controle

Ela pediu:

> *"cada perfil, salvar cada config de cada aba, e dentro de cada perfil, cada
> controle poder salvar as sua config específica e isso ser lembrado na próxima
> jogatina."* <!-- noqa-acento: citação literal dela -->

**Medido no esquema:** o `Profile` tem 17 campos; o `ControllerOverrides` tem
**quatro** (`leds`, `triggers`, `rumble`, `speaker`).

**AS DECISÕES DELA JÁ TOMADAS, em 02/09/2026 — não reabra:**

| seção | onde vai |
| --- | --- |
| `key_bindings`, `button_actions`, `mouse`, `teclado_emulado` | **por controle** |
| `mic` (`volume`, `muted`, `button_toggles_system`) | **por controle, depois da onda do microfone** |
| `mode.kind` (`native`/`gamepad`/`desktop`) | **por controle** |
| `mode.gamepad_flavor` (`dualsense`/`xbox`) | **por controle** |
| `priority` | **global** — não existe prioridade de um controle |
| `ponte` | **global** — é o registro de uma confirmação dela |
| `suppress_desktop_emulation` | **global** — protege a máquina inteira |
| `mode.coop` | **NÃO EXISTE MAIS** — removido em 02/09; cada controle é um jogador, sempre |

**As três armadilhas, todas já pagas nesta casa:**

1. **A chave é o `uniq` NORMALIZADO** (`d42f…`, não `d4:2f:…`). Há régua.
2. **Nada mudou, nada grava.** Um `profile.switch` no meio da partida não é de
   graça.
3. **Seção nova no `Profile` quebra os portões de perfil**, que exigem
   classificação: `SecaoDireta`, `ISENTOS` com razão, e
   `_SECOES_OPCIONAIS_OMITIDAS_QUANDO_NONE`. Custou seis reprovações quando o
   `button_actions` nasceu.

## AS RÉGUAS

1. **O texto da prioridade diz a verdade** — ou some. É texto de tela, e o texto
   é dela: leve a frase nova para ela aprovar.
2. **A tabela de controles mostra os controles da mesa**, com o nome que a ONDA
   A publica.
3. **`ativar` muda o estado do daemon** — sai da lista dos dezesseis.
4. **Cada seção nova em `ControllerOverrides` tem régua de ida e volta:** grava,
   recarrega, e o valor volta igual.

## COMO SE SABE QUE FECHOU

```
[ ] `ControllerOverrides` saiu de 4 campos, e cada "não" tem razão escrita
[ ] a tabela mostra os DOIS controles, com nome
[ ] o texto da prioridade foi aprovado por ela
[ ] `ativar` sai da lista de "sem efeito"
[ ] gravar → trocar de perfil → voltar: o ajuste do controle volta igual
```
