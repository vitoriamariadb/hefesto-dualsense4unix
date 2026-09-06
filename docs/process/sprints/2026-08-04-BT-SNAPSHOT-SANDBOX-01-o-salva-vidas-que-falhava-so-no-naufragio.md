---
sprint: BT-SNAPSHOT-SANDBOX-01
estado: absorvida
---

> **ESTADO 06/09/2026: absorvida** — pela regra da §3 do `SPRINT_ORDER.md`
> (*"história — não remedidas desde 27/08; o resto, se ainda faltar, é linha do
> CSV"*): o que desta sprint ainda faltar é linha de `docs/data/paridade-gtk-html.csv`
> ou célula de `docs/data/mapa-controles.csv`, e é lá que se cobra. **Se você achar
> aqui um defeito vivo que não está em nenhum dos dois, ele é seu: abra a linha.**

# BT-SNAPSHOT-SANDBOX-01 — o salva-vidas que falhava só no naufrágio

- **Medido em:** 03→04/08/2026, no journal dela
- **Estado:** **CURADO em 04/08/2026;** o portão que a sprint pediu por escrito
  entrou em **22/08/2026** (ver "O que morde"). Registro de causa-raiz
- **Gravidade:** alta — o mecanismo falhava **exatamente** na ocasião para a
  qual foi construído
- **Pré-requisito:** nenhum

---

## O defeito, em uma linha

O snapshot de bonds do Bluetooth roda como `ExecStopPost=` do
`bluetooth.service` — ou seja, **no momento em que o BlueZ morre**, que é
precisamente quando os pareamentos correm risco. E era exatamente aí que ele
falhava.

```
23:58:07  bluetooth.service: Main process exited, code=dumped, status=6/ABRT
23:58:07  bt_bonds_snapshot.sh: linha 105:
          /var/lib/hefesto-dualsense4unix/bt-bonds/.lock:
          Sistema de arquivos somente para leitura
```

---

## A causa-raiz

O `ExecStopPost=` **herda o sandbox da unit**. O `bluetooth.service` do BlueZ
declara `ProtectSystem=strict`, que torna `/usr`, `/boot` e **`/var` inteiro**
somente-leitura para tudo o que roda dentro da unit — inclusive os nossos
`ExecStopPost`.

O nosso drop-in acrescentava comportamento à unit sem acrescentar a **permissão
de escrita** que esse comportamento exige. O script está correto; o ambiente em
que ele roda é que não permitia o que ele precisa fazer.

**A perversidade do defeito** é que ele é invisível em operação normal: o
`ExecStopPost` só corre quando o serviço para, e um `systemctl restart` manual
tem o mesmo sintoma — que ninguém olha. Ele só aparece no journal de um crash,
misturado ao ruído do próprio crash.

---

## A cura aplicada

`assets/systemd/bluetooth-dropin-10-hefesto-resilience.conf`:

```
ReadWritePaths=/var/lib/hefesto-dualsense4unix
```

Uma linha, e o mínimo possível: abre-se **só o nosso diretório**, não `/var`.
O `ProtectSystem=strict` do BlueZ continua valendo para todo o resto — a cura
não enfraquece o sandbox de quem não é nosso.

Conferir em vigor:

```bash
systemctl show bluetooth.service -p ReadWritePaths
```

---

## O que isto ensina, e é a parte que vale guardar

**Todo `ExecStartPre`/`ExecStopPost` que a casa acrescenta a uma unit de
TERCEIRO herda o sandbox daquele terceiro** — e o terceiro pode apertá-lo numa
atualização, sem aviso, quebrando o nosso comportamento em silêncio.

**O que a sprint seguinte deve varrer:** todo drop-in nosso em unit alheia,
cruzado com o que o script dentro dele escreve. O comando de partida:

```bash
grep -rln 'ExecStartPre\|ExecStopPost\|ExecStopPre' assets/systemd/
```

Para cada um, a pergunta: *o script escreve em algum lugar? A unit hospedeira
permite?* — e a resposta tem de estar **no arquivo**, não na cabeça de quem
escreveu.

---

## O que morde — **ESCRITO em 22/08/2026**

Um teste que leia o drop-in e exija `ReadWritePaths` cobrindo **todo caminho
que os `ExecStopPost` dele escrevem**. Arrancar a linha faz reprovar. Sem esse
teste, a próxima pessoa que acrescentar um `ExecStopPost` que escreve noutro
lugar reabre isto — e só descobre no próximo naufrágio.

`tests/unit/test_bt_sandbox_cobre_o_que_os_ganchos_escrevem.py`. Ele faz a
varredura pedida na seção acima **sozinho e a cada execução**: percorre
`assets/systemd/`, resolve cada `Exec*=` que aponta para script nosso (e os
scripts que ELES chamam), extrai os alvos de escrita — `install`, `cp`,
`mkdir`, `chmod`, redirecionamento — resolvendo as variáveis contra as
atribuições do próprio script, e confronta com o `ReadWritePaths`,
`StateDirectory` e `ReadOnlyPaths` declarados.

**A lista é DERIVADA, e essa é a parte que importa.** Uma lista de caminhos
escrita à mão caduca no primeiro caminho novo — o portão fica verde enquanto o
defeito volta, que é exatamente o modo de falhar desta sprint.

Três mordidas, todas conferidas em 22/08:

| arranque | quem reprova |
|---|---|
| apagar `ReadWritePaths=/var/lib/hefesto-dualsense4unix` do drop-in | `test_todo_caminho_escrito_esta_no_readwritepaths` |
| acrescentar ao snapshot uma escrita em lugar novo | o mesmo, nomeando o lugar novo |
| cegar o extrator (devolver vazio) | os quatro testes de `TestOExtratorEnxerga` |

A terceira é a régua do instrumento (lição de 19/08: cada portão precisa da
sua). Sem ela, um extrator quebrado deixaria o portão verde por não enxergar
nada.

**O único dado que não sai do repositório** é o sandbox da unit de terceiro — o
`ProtectSystem=strict` do `bluetooth.service` mora no pacote do bluez. Ele está
numa tabela nomeada dentro do teste, e uma segunda régua a confronta com o
`systemctl show` da máquina quando há uma, para que ela não envelheça calada.

---

## Relacionado

- [BT-AGENT-TRAVA-O-RESTART-01](2026-08-04-BT-AGENT-TRAVA-O-RESTART-01-noventa-segundos-de-bluetooth-fora-do-ar.md) — o outro defeito medido no MESMO crash
- [DOC-QUE-NAO-MENTE-04](2026-08-03-DOC-QUE-NAO-MENTE-04-os-nove-mecanismos-e-os-seis-portoes.md)
