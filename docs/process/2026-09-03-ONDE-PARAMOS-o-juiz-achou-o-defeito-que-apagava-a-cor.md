# 03/09/2026 — o juiz achou o defeito que apagava a cor dela, e um agente resetou a mesa

**Leia a §1 antes de rodar qualquer comando.** Ela é a armadilha nova do dia, e
ela come trabalho que está no *stage* sem avisar.

---

## §1 — A ARMADILHA QUE CUSTOU MAIS: um agente resetou a ÁRVORE PRINCIPAL

O `reflog` desta árvore registra, no meio da sessão:

```
90fce1a1 HEAD@{3}: reset: moving to dev
```

**Ninguém desta conversa rodou esse comando.** Ele veio de um agente de
workflow, e a origem é a instrução que TODO workflow desta casa carrega no
bloco `CASA`:

> *"Você trabalha na SUA worktree. Primeiro comando: `git reset --hard dev`."*

Quando a resolução de diretório do agente falha — ou quando ele roda o comando
antes de estar dentro da worktree —, o alvo é a **mesa dela**.

**O que se perdeu, medido:** uma limpeza de 94 células do
`docs/data/mapa-controles.csv` e um `html/specs.html` regerado, ambos
adicionados com `git add -A` e **ainda não commitados**. O sintoma foi
enganoso: dois portões que eu tinha acabado de ver VERDES voltaram a VERMELHO
sem que nada os tivesse tocado.

**A REGRA QUE ISSO DEIXA, e ela é curta:**

> **Commite antes de lançar workflow, e commite de novo assim que uma cura
> fechar.** O *stage* não é lugar seguro enquanto houver agente em voo.

O contrário — proibir o `git reset --hard` na instrução `CASA` — não resolve:
o agente PRECISA partir de uma base limpa na worktree dele. O que protege é o
commit deste lado.

---

## §2 — O DEFEITO MAIS GRAVE DA LEVA, e ele não estava marcado como o mais grave

Três juízes independentes leram os 60 achados da leva de tela. O juiz 1 o
levantou do meio da lista e o pôs no topo:

> **"Desligar" a barra de luz e depois "Salvar Perfil" apaga a cor escolhida
> por ela, para sempre, em silêncio.**

**A causa era de vocabulário.** `rodape._draft_do_ativo` lia `lightbar_rgb` cru
do estado do daemon e o gravava como override daquele controle. Com a barra
apagada esse campo é `(0,0,0)` — e o `LedsDraft` **não tem campo de
aceso/apagado**, só a cor. Gravar o preto não guarda *"estava apagada"*: guarda
PRETO por cima da escolha dela, e o caminho de volta não existe.

**A cura é REUSO, e não regra nova.** `controller_card.rotulo_lightbar` já é o
dono desta leitura na GUI estável, e devolve a cor base como `None` exatamente
nos dois estados em que não há cor a afirmar — *cor desconhecida* e *apagada*.

**E a aba 04 já tinha pago por escrever a segunda verdade:** o
`c.get("lightbar_on", True)` que morava lá tinha o padrão INVERTIDO e afirmava
ACESA na ausência do campo, que é o estado de partida de um controle no rádio.

---

## §3 — A PROVA AUTOMÁTICA GRAVAVA NO PERFIL DELA, dez vezes por volta

**Medido, não deduzido.** Dez gravações em
`~/.config/hefesto-dualsense4unix/profiles/meu_perfil.json`, entre **07:14 e
07:47 de 03/09/2026** — uma por aba provada.

**Nada dela se perdeu desta vez.** As dez foram re-salvamentos do mesmo
conteúdo, conferidos campo a campo contra o backup de 02/09: das 27 chaves, UMA
diferença, e é a chave nova `rumble` com valor nulo.

**A causa era de forma.** O rodapé registra `@gesto("*", "salvar")` — um gesto
só, vivo nas dez páginas — e `PERIGOSOS` só sabia casar `(página, gesto)`.
Isentá-lo pediria dez linhas na lista, e a décima primeira aba nasceria
desprotegida sem ninguém notar.

**A cura tem duas metades, e as duas são necessárias:** `_alvos_a_clicar` casa
também `("*", nome)`, e `("*", "salvar")` entra em `PERIGOSOS`.

`exportar` e `importar` ficaram FORA da lista com razão medida: os dois passam
por seletor de arquivo do sistema, e o `importar` nunca sobrescreve — o
conflito de nome vira `nome-2`.

**E o cursor dela, pela outra porta:** o chip "Navegação" da aba Jogar chama
`mouse.emulation.restore` e LIGA a emulação de mouse. Só o
`("06-navegacao.html", "modo")` estava isento, e o cursor é o mesmo.

---

## §4 — A FERRAMENTA DE FUSÃO SUJOU O MAPA PELA TERCEIRA VEZ

As frentes editam a MESMA LINHA do `mapa-controles.csv` em COLUNAS DIFERENTES.
Para o git isso é conflito de linha inteira; para o dado, não há conflito. A
ferramenta de fusão campo a campo existe por isso — e por três vezes ela colou
o texto da divergência **dentro** da célula:

| dia | coluna | o que quebrou |
| --- | --- | --- |
| 02/09 | domínio fechado | `gerar-fatos-de-tela.py` levantou `ValueError` |
| 02/09 | domínio fechado | idem, noutra frente |
| 03/09 | `teste_que_morde` | o id de nó do pytest virou lixo; `paridade-transporte` acusou `mordida-fantasma` em quatro linhas |

**Uma das frentes desta leva achou o mesmo resíduo por conta própria**, sem
saber da outra — duas medições independentes do mesmo defeito.

**A regra nova está escrita no cabeçalho da ferramenta:** quando duas frentes
escrevem a MESMA célula com valores diferentes, o texto da divergência vai para
`nota`, **sempre**. A célula fica com UM valor.

Nesta leva as cinco frentes tocaram células disjuntas — **zero divergências**.

---

## §5 — OS NÚMEROS QUE ANDARAM HOJE

| medida | manhã | agora |
| --- | --- | --- |
| células `aciona` mudas no mapa | 208 | **47** |
| resíduo de fusão fora de `nota` | 94 células | **0** |
| identidade de marca congelada | 134 | **0** |
| cor do plástico cravada | 503 | **358** (workflow em voo) |
| paridade GTK↔HTML | 13% | 14% (54 IGUAL de 396) |

---

## §6 — O QUE OS TRÊS JUÍZES DECIDIRAM

| | confirmados | derrubados |
| --- | --- | --- |
| juiz 1 | 23 | 10 |
| juiz 2 | 58 | 2 |
| juiz 3 | 51 | 1 |

**Nenhum achado foi derrubado por estar errado sobre o que descreve.** O juiz 1
cortou por "isto é produto, ou é ferramenta de quem testa o produto"; o juiz 2
derrubou dois que o `dev` já tinha resolvido entre a medição e o julgamento.

**Os três padrões que eles nomearam, e que nenhum achado individual diz:**

1. **Texto de tela e código divergiram, e o código já SABIA.** Comentários
   confessando *"a política é da mesa, não da coluna"* ao lado da dica que
   promete o contrário. Não é falta de teste — é decisão pendente virando bug
   visível.
2. **Nove vezes, em quatro abas: um pacote calcula e envia um valor, e a página
   publicada não tem o `data-campo` para recebê-lo.** O trabalho foi feito e
   não chega à tela. É o mais barato de corrigir — não pede decisão dela, só o
   atributo que falta.
3. **Três consertos prontos e testados estavam presos em worktree de agente que
   ninguém mesclou.** Trabalho zero, ganho imediato. Já mesclados.

**A fila ordenada dos três está em
`/tmp/…/scratchpad/fila-dos-juizes.md`** enquanto esta sessão viver; o que
importa dela está aqui e nos commits.

---

## §7 — AS DUAS PENDÊNCIAS DELA QUE MORRERAM SOZINHAS

1. **A limpeza do `localconfig.vdf` não precisa acontecer.** `--status` (que
   não modifica nada) diz `resultado=nada-a-fazer`: as 12 linhas de
   `UseSteamControllerConfig` da conta real dela estão todas em `"0"`, e
   `PSSupport`/`SwitchSupport` também. Não há diff a aprovar.
2. **O entulho de backups da Steam é pequeno.** O número publicado era **234
   arquivos / 30 MB**; medido em 03/09 são **16 arquivos / 2,1 MB** (14/07 a
   01/09). Com 2,1 MB a pergunta *"vale podar?"* deixa de ser pergunta.

---

## §8 — O QUE AINDA ESPERA A PALAVRA DELA

1. **Rodar `./install.sh --dry-run` e ler as 83 linhas do plano.** Nada
   acontece. Para o plano COMPLETO (com os passos de root):
   `sudo -v && ./install.sh --dry-run`.
2. **A numeração "N/11" num install de quarenta passos.** Renumerar toca
   dezenas de réguas que ancoram nesses rótulos.
3. **`--no-udev` deveria gatear também o `--with-usb-quirk`?** Os dois escrevem
   o mesmo token no bootloader, e só um obedece à flag.
4. **Os dois portões que pedem o Google Chrome** — cair para `chromium` quando
   ele não existe.
5. **`entrada.stick.calibracao@dualsense`:** se o produto deve LER o finetune
   de fábrica, e se deve algum dia ESCREVER. A leitura (`[12, 2]`) é inócua; a
   escrita é da MESMA família `0x80` em que `(1, 1)` reseta o controle e
   `(12, 1)` grava na NVS. **É decisão dela, não de agente.**
6. **`luz.recursos_proprios@dualsense`:** partir a linha em duas chaves —
   turbo/LED-de-modo, que não existem no aparelho, contra o canal proprietário
   do feature `0x80`, que existe e ninguém tocou.
7. **A dica da aba Vibração** (*"o endereço do ajuste é a coluna, não a fita"*):
   frase honesta, ou implementação por controle?
