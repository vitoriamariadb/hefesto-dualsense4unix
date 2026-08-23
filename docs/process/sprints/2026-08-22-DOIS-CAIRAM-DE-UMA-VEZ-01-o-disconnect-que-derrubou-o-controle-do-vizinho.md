# DOIS-CAIRAM-DE-UMA-VEZ-01 — o `Disconnect` que derrubou o controle do vizinho

**22/08/2026.** Observação da bancada da
[BARRA-MUDA-01](2026-08-22-BARRA-MUDA-01-a-lampada-nao-se-le-o-nascimento-sim.md),
registrada por pedido dela e **sem hipótese**. Não era o encargo daquela frente,
e ninguém foi atrás.

**Estado:** ABERTA — precisa de medição antes de qualquer conclusão.

---

## O fato, em uma linha

**Um `Disconnect` do BlueZ, dirigido a UM controle, derrubou DOIS — e o segundo
estava em OUTRO adaptador.**

## O que se sabe, e é só isto

- o comando foi um `org.bluez.Device1.Disconnect` para um endereço só;
- caíram duas instâncias, e as duas estavam em adaptadores diferentes (os
  endereços estão na BARRA-MUDA-01 §7, item 4, com a máscara da casa);
- **nada do que foi medido naquele dia explica.** A frente registrou e parou:
  não era a E1.

## Por que isto não é curiosidade

Três coisas do produto passam a depender desta resposta:

1. **O botão "A luz não acende"** (`8b167cc`) usa exatamente esse `Disconnect`.
   Se ele pode derrubar um segundo controle, o botão que existe para curar um
   jogador tira outro do jogo — e o produto não avisa, porque não sabe.
2. **A migração de controle entre adaptadores** (E2 da
   [CENTRAL-SEM-TELA-01](2026-08-22-CENTRAL-SEM-TELA-01-o-censo-e-o-apelido-nasceram-sem-porta.md))
   é uma sequência que começa derrubando o controle. Se a queda vaza para o
   vizinho, o gesto de arrumar a sala derruba a sala.
3. **Se o efeito atravessa adaptador**, uma premissa que a casa vem usando cai
   junto: a de que separar controles em piconets diferentes os isola. A conta
   de slots do [GUIA-RADIO-DA-SALA.md](../../../GUIA-RADIO-DA-SALA.md) continua
   valendo — ela é sobre banda —, mas o isolamento de FALHA não estaria medido.

## O que NÃO é

- **Não é hipótese.** Este documento recusa nomear culpado. Quatro explicações
  plausíveis (o USB comum, o hub, a alimentação, o kernel derrubando os dois
  uhid) são igualmente compatíveis com uma única observação, e escolher uma
  agora é o que esta casa chama de contorno.
- **Não é o defeito da barra.** A barra travada nasce condenada e persiste na
  instância; isto é queda de link.

---

## Entregas

### E1 — reproduzir, ou não conseguir e dizer isso

O experimento é curto e não precisa dela:

1. dois controles no rádio, **em adaptadores diferentes**, com o
   `bt_ponte_privilegiada.sh adaptadores` confirmando quem hospeda quem;
2. `journalctl -k -f` e `journalctl --user -f` abertos e gravando;
3. um `Disconnect` no primeiro;
4. anotar o que caiu, na ordem, com o carimbo de tempo do kernel.

Repetir cinco vezes. **O negativo vale tanto quanto o positivo:** se não
reproduzir, o registro passa a dizer que foi visto uma vez e não reproduziu em
cinco tentativas — e o botão deixa de carregar uma dúvida sem tamanho.

### E2 — separar as três famílias, se reproduzir

Cada uma tem um teste barato que a distingue:

| Família | Como se separa |
|---|---|
| **elétrica** (hub, alimentação) | repetir com os dois adaptadores em portas de controladores PCI diferentes — o `censo_do_barramento` já sabe dizer quais são |
| **kernel** (os dois nós uhid caindo juntos) | o `journalctl -k` mostra os dois `hid` sumindo no mesmo milissegundo, ou não |
| **BlueZ** (o `Disconnect` alcançando mais de um) | `btmon` durante o comando: sai um `HCI Disconnect` ou dois? |

### E3 — o que o botão faz enquanto não se sabe

Se a E1 reproduzir, o botão precisa avisar antes de agir: *"isto pode derrubar
outro controle"*. Se não reproduzir, o registro fecha e o botão fica como está.

**Não antecipe a E3.** Pôr um aviso agora seria o produto afirmando o que não
mediu, que é o padrão que a
[ELO-MUDO-01](2026-08-22-ELO-MUDO-01-o-ok-que-nao-sabe-dizer-nao.md) nomeou hoje.

---

## Como morde

Não morde ainda — é observação, não cura. O que morde é a E1 ter resultado
escrito no `docs/data/ensaios.csv`, com as cinco tentativas, para que a próxima
pessoa não gaste a mesma hora descobrindo que ninguém tentou.

## O que este achado ensina

**Registrar sem explicar é entrega.** A alternativa real não era "explicar" — era
perder a observação, ou pior, colar nela a primeira hipótese que passasse pela
cabeça de quem a viu. Uma anomalia com nome e data vale mais que uma causa
inventada.
