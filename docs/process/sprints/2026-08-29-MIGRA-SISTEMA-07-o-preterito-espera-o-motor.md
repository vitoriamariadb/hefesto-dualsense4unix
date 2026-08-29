---
sprint: MIGRA-SISTEMA-07
# onda: MIGRA-SISTEMA (a aba 09, no motor novo)
posse:
  M7:
    - tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py
    - src/hefesto_dualsense4unix/app/actions/daemon_actions.py
cria:
  - tests/unit/test_migra_sistema_07_o_preterito_nao_mente.py
bancada: false
depois_de:
  - LEVA-4
  - ONDA-SISTEMA-01
  - ONDA-SISTEMA-02
  - ONDA-SISTEMA-04
  - ONDA-SISTEMA-05
  - MIGRA-CONTROLES-PILOTO
  - MIGRA-MOLDURA-01
  - MIGRA-SISTEMA-01
  - MIGRA-SISTEMA-02
  - MIGRA-SISTEMA-03
  - MIGRA-SISTEMA-04
  - MIGRA-SISTEMA-05
  - MIGRA-SISTEMA-06
  # A ONDA-SISTEMA-06 é BACKEND e SOBREVIVE: é ela que dá chamador de produção
  # aos dois motores. Esta sprint NÃO a reescreve — ela põe o PORTÃO que
  # impede a tela de contar o conserto antes de ele existir.
  - ONDA-SISTEMA-06
  # SÉRIE, por R5: o registro da casa-sabe é leva-wide — toda sprint que fecha
  # uma lápide o edita. As entradas são independentes, mas o portão não sabe.
  - ONDA-SISTEMA-07
  - ONDA-CONEXOES-04
  - ONDA-CONEXOES-09
  - ONDA-CONEXOES-10
  - ONDA-GATILHOS-05
  - ONDA-LANCADORES-05
  - ONDA-NAVEGACAO-01
  - ONDA-PERFIS-05
  # SÉRIE: o registro do portão da casa-sabe é leva-wide, e o `daemon_actions.py`
  # é dividido. Estas três o portão nomeia hoje, além das já listadas acima.
  - LEVA-1
  - LIGAR-OS-MODULOS-A-TELA
  - MIGRA-CONEXOES-08
nao_toca:
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/integrations/
  - src/hefesto_dualsense4unix/gui/main.glade
  - novo-layout/
---

# MIGRA SISTEMA · 07 — O pretérito espera o motor

**O defeito, e é o mais caro que esta aba pode cometer:** duas linhas do mockup
afirmam **um ato que o produto não executa**.

> *"Steam Input estava ligado em 2 jogos — **desliguei**"*
> *"Proton **fixado** em 9.0-4 para 3 jogos"*

Estão no **pretérito** porque ela decidiu, em 27/08, que os três consertos
rodam **sozinhos no exame** e o botão serve só para refazer. **E os dois
motores que fariam isso não têm chamador de produção:**

| motor | onde | estado |
|---|---|---|
| `curar_o_que_e_automatico` | `integrations/prontuario_dos_jogos.py:885` | **no registro do portão da casa-sabe** |
| `steam_root_ou_recusa` | `integrations/proton_pin.py:184` | **no registro do portão da casa-sabe** (`tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py:1623`) |

**Pintar essas frases antes da sprint dos motores é a tela contando um conserto
que nunca aconteceu.** É a mesma família do defeito de 29/08 — o produto curou o
problema e continuava instruindo ela a desfazer a cura, com um jogo dela citado
pelo nome. Ali era uma frase velha; aqui seria uma frase **nova**, escrita de
propósito.

**Esta sprint não é o motor.** O motor é a `ONDA-SISTEMA-06`, que é backend e
sobrevive intacta à troca de motor gráfico. **Esta sprint é o portão** que
impede a página de correr na frente dele.

## O que entrega

1. **A regra do tempo verbal, no código.** Cada `LinhaDeSaude` que fala no
   pretérito carrega uma marca de que **houve ato** — não uma string com um
   verbo no passado, mas o resultado do motor (quantos, quais, quando). Sem ato,
   a linha nasce no **presente**: *"Steam Input ligado em 2 jogos"*, com o
   conserto no campo `o_que_fazer` e o botão ao lado.
2. **Duas lápides saem do registro, ou o portão fica vermelho.** Quando a
   `ONDA-SISTEMA-06` der chamador aos dois motores, as entradas de
   `prontuario_dos_jogos.py::curar_o_que_e_automatico` e
   `proton_pin.py::steam_root_ou_recusa` saem do
   `portao_a_casa_sabe_e_o_produto_nao_faz.py`. **Sair da lista é a prova de que
   a cura foi ligada** — é para isso que o registro existe.
3. **O botão diz "Refazer" só quando houve o quê refazer.** O rótulo do mockup
   é *"Refazer os consertos automáticos"*. Se o exame não rodou conserto nenhum
   — porque o motor não tem chamador, porque a leitura falhou, porque não havia
   nada a consertar — **o rótulo mente**. A entrega inclui o rótulo alternativo,
   e ele é escolha dela (ver abaixo).
4. **A dica conta o que foi feito, com nome.** *"Mortal Kombat 1 e Elden Ring
   estavam com o Steam Input ligado. O exame desligou nos dois, sem senha e sem
   fechar a Steam."* Os nomes vêm do motor; **nenhum jogo dela é digitado no
   Python**.

## Como se prova (a mordida)

`tests/unit/test_migra_sistema_07_o_preterito_nao_mente.py`:

- **sem ato, sem pretérito.** Dublê em que o motor **não roda** (sem chamador,
  ou recusando): a linha emitida está no presente e tem `o_que_fazer`
  preenchido. **Force o pretérito com o motor parado e veja reprovar** — esta é
  a mordida, e é a razão de a sprint existir;
- **com ato, o número é o do motor.** O motor devolve dois jogos → a linha diz
  dois. Devolve zero → **a linha não fala em conserto nenhum**. Digite `2` e
  veja reprovar;
- **as duas lápides.** O teste lê o registro do portão da casa-sabe e exige que,
  **se** houver chamador de produção, a entrada **não** esteja lá — e vice-versa.
  Nos dois sentidos. Uma cura ligada com a lápide de pé é o registro mentindo
  para o lado bom, e ele deixa de valer como régua;
- **o rótulo do botão acompanha.** Sem conserto rodado, o rótulo não é
  "Refazer". Fixe-o e veja reprovar;
- **nenhum nome de jogo dela no código.** `grep` pelos nomes que o mockup usa
  (`Mortal Kombat`, `Elden Ring`) em `src/` devolve **zero**. Eles são cena de
  desenho, não dado.

## O que é dela decidir

- **O rótulo quando não houve conserto.** *"Consertar problemas conhecidos"* é o
  nome antigo e é honesto; *"Refazer os consertos automáticos"* só vale depois
  de haver o que refazer. **Opções:** (a) o rótulo muda com o estado (dois
  textos, um botão); (b) fica "Refazer" sempre, e a dica explica; (c) volta a
  "Consertar", e o pretérito das linhas basta para contar o que já rodou.
- **O que acontece quando o conserto automático FALHA.** Hoje ninguém desenhou
  esse estado. A linha vira `WARN` com o motivo? O botão fica em destaque? **O
  mockup não desenha, e a sprint não inventa** — é dela.
