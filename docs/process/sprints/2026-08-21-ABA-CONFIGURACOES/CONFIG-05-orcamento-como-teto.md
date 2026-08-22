# CONFIG-05 — orçamento como teto

**Depende de:** CONFIG-03. [D-A5 decidida](DECISOES-ABERTAS.md): espelhar com teto visível.

**Entregue em 22/08/2026.** O que ficou de fora está no fim, com o motivo.

## Vocabulário: reusar, nunca renomear

Não é preferência estética — é compatibilidade de dados: `RumbleConfig.policy`
já grava estas chaves, `OrcamentoDeclarado.teto` grava as quatro primeiras, e o
pydantic está com `extra="forbid"`. **Renomear quebra os perfis já gravados no
disco dela**, e gravar o RÓTULO no lugar da chave faz a próxima carga recusar o
documento inteiro — o sintoma na tela seria "não consegui gravar", não "valor
inválido".

| Chave | Rótulo na tela | No orçamento da mesa? |
|---|---|---|
| `economia` | Economia | sim — é o único que impõe teto |
| `balanceado` | Balanceado | sim — sem teto |
| `max` | Máximo | sim — sem teto |
| `auto` | Auto | sim — teto móvel, e por isso sem número na tela |
| `custom` | *(sem rótulo de botão)* | **não** |

Os rótulos vêm de `_POLICY_LABEL`
(`src/hefesto_dualsense4unix/app/actions/rumble_actions.py`), exportado como
`ROTULOS_DO_ORCAMENTO` para a seção da aba usar sem redigitar.

`custom` fica fora porque não é escolha de mesa: é o deslizador livre da aba
Rumble, com teto próprio em `RUMBLE_CUSTOM_MULT_MAX = 2.0`
(`src/hefesto_dualsense4unix/profiles/schema.py`), que **acima de 1.0
amplifica**. Ele é limitado pelo orçamento como qualquer outro pedido — não é
uma das opções dele.

## Teto, não troca

Escolher Economia não apaga nada. O jogo pede, a aba de origem manda, e o valor
chega ao controle limitado. Voltar para Balanceado devolve tudo **sem ela
reclicar coisa alguma**, porque o `rumble_policy` dela nunca foi reescrito.

A conta é `min(mult, teto)`, e nunca produto: 0,3 sobre um `custom` já
amplificado a 2,0 entrega 0,6 — o dobro do que o Economia promete, e mais forte
que o Balanceado. Teto que multiplica não é teto. O `min` também preserva o
denominador de `_controllers_to_rumble_scales`
(`src/hefesto_dualsense4unix/profiles/manager.py`): o valor que chega ao backend
já vem escalado pela política global, então o fator por unidade é relativo.

## Onde o teto entra: um ponto só

`core.rumble._effective_mult` é o funil dos **três** caminhos de vibração do
produto — `apply_rumble_policy` (o `rumble.set` e o "Aplicar" do rodapé),
`_game_rumble_mult` (o force-feedback do jogo) e `reassert_rumble` (o tique de
200 ms do rumble fixado). O teto entra lá, antes das **quatro** saídas: `custom`,
políticas fixas, `auto` e o fallback de política desconhecida. Deixar a quarta
de fora abriria um caminho inteiro em que o orçamento não valeria.

No ramo do `auto` o teto entra **antes do debounce**. Limitar só o valor
devolvido deixaria a âncora com o degrau cru, o `auto` se declararia em mudança
a cada chamada e o journal ganharia um `rumble_auto_policy_change` por tique.

## Dono único do valor efetivo

O orçamento **calcula**; a aba de origem **só exibe**. Os quatro botões da aba
Rumble seguem afundando onde ela os pôs, o deslizador continua editável, e ao
lado deles nasce a linha *"150% · limitado a 30% pelo orçamento"*.

Isso é invariante de teste, não recomendação — espelhar estado entre abas foi a
classe de bug que a `ABAS-01` curou.

A linha **cala** em quatro casos, e cada silêncio é uma pergunta diferente:
ninguém declarou orçamento; o orçamento não impõe teto; não se sabe o que a aba
está pedindo; o teto não morde (o número da aba é o que chega). *"Não sei"* e
*"não chega"* mandam caçar em lugares opostos.

## Dono único do gesto de gravar

A seção **não tem método IPC próprio**. O clique acumula em `_maquina_pendente`
e o "Aplicar" do rodapé grava, pelo `machine.declare` que CONFIG-03 criou. Dois
donos do mesmo valor é a classe de defeito que a `ABAS-01` curou, e a aba é
diferida por decisão de produto (D-A4): nada vale antes do "Aplicar".

No daemon, a config carrega a **fonte** do teto e não uma cópia dele
(`DaemonConfig.orcamento_da_mesa`, fiada no boot em `daemon/lifecycle.py`). A
diferença é o gesto do "Aplicar": o `machine.declare` relê o `maquina.json` e
rebinda `daemon._maquina`, então uma cópia tirada no boot ficaria velha
exatamente no instante em que ela acabou de escolher — e o teto novo só valeria
no próximo início do Hefesto.

## O que o orçamento NÃO promete

**Não existe medição de mA nem de horas de autonomia neste projeto.** O
multiplicador de rumble (0,3 / 1,0 / 1,5) é **força, não energia**, e o desconto
nunca foi convertido em minutos.

Então a tela **não diz "poupa bateria em X %"**. Diz o que faz: *"a vibração
chega ao controle com no máximo 30 % da força"*. Consequência verificável, não
promessa sem número.

E o 30 % não é digitado em lugar nenhum da tela: sai de
`RUMBLE_POLICY_MULT["economia"]`, que é o mesmo degrau que o botão Economia da
aba Rumble entrega. Assim o orçamento em Economia entrega exatamente a força que
o botão Economia entrega — e se o degrau mudar, os dois mudam juntos.

> Nota: "poupar bateria" já é promessa feita na tela hoje, sem número por trás.
> Corrigir isso é trabalho próprio, não desta leva — mas a aba nova não pode
> aumentar a dívida.

## Auto

**O Auto nunca amplifica** (decisão de 11/08/2026, registrada no docstring de
`_effective_mult`): ele existe para poupar bateria, e amplificar seria fazer o
oposto do que promete. Ele não lê transporte nenhum — lê só a bateria, em três
degraus:

| Bateria | Multiplicador |
|---|---|
| acima de 50 % | 100 % |
| de 20 a 50 % | 70 % |
| abaixo de 20 % | 30 % |

Com debounce de 5 s para não oscilar no limiar.

> **Correção datada — 22/08/2026.** Este arquivo dizia *"controle no cabo joga
> em Máximo. Controle em rádio abaixo de 20 % de bateria cai para Economia"*, e
> dizia 40 % onde o produto entrega 30 %. Os dois eram fatos errados, não
> decisões medidas: o código, o rótulo da tela e a dica do botão dizem a escada
> acima desde 11/08/2026, e `RUMBLE_POLICY_MULT["economia"]` é 0,3. Substituídos
> em vez de anotados ao lado, que é a regra da casa para número errado.

Como orçamento da mesa, o Auto tem teto **móvel**: ele muda a cada tique com a
bateria. A linha da aba de origem não exibe percentual nenhum nesse caso — a
casa já enfrentou o problema em `_controllers_to_rumble_scales` e escolheu pular
com log em vez de prometer um número que vira outro no minuto seguinte.

## O que ficou de fora, e por quê

A tabela da tela lista **uma** linha, não as cinco do desenho: só a vibração tem
ponto de aplicação de verdade. Uma linha dizendo "limitado a 25 % pelo
orçamento" sem ninguém limitar nada é a tela mentindo, e é o defeito que esta
leva inteira existe para não cometer.

| Linha do desenho | Por que ficou fora |
|---|---|
| Barra de luz | O brilho não tem funil único: passa por `_handle_led_set` **e** pelo caminho de perfil. Dois pontos de aplicação, e os dois fora deste território. |
| Gatilhos | Sem ponto de aplicação nenhum. |
| Microfone por rádio | O campo existe no daemon, a tela não existe em lugar nenhum. |
| Giroscópio | O teto de emissão é uma constante sem setter ao vivo, com margem zero medida; 60 Hz e 125 Hz não existem em `src/`. |

A linha de apoio abaixo da tabela diz isso em voz alta, na tela. Cada uma entra
na leva que lhe der ponto de aplicação.

> **Terceira correção datada — 22/08/2026.** A dica do botão Máximo dizia *"e o
> giroscópio na taxa mais alta"*. Nada aqui mexe na taxa do giroscópio, então a
> oração prometia o que o produto não faz — e prometia a três centímetros da
> linha que diz, na mesma seção, que o giroscópio ainda não tem por onde ser
> limitado. Saiu pelo mesmo argumento que tirou a barra de luz da dica do
> Economia. **`TOOLTIPS.md` e o mockup ainda têm a versão antiga**: a mesma
> correção de uma linha vale para os dois.
