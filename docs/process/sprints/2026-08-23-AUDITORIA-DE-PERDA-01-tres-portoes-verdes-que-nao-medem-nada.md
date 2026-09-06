# AUDITORIA-DE-PERDA-01 — três portões verdes que não medem nada

**23/08/2026.** Varredura dos relatos das duas levas de 22/08 (doze agentes, dois
diários de workflow) contra a árvore de hoje, procurando três coisas: achado
medido que não virou arquivo, entrega relatada que o arquivo não tem, e número
que contradiz número já escrito.

**O saldo é bom, e vale dizer primeiro:** quase tudo que os conferentes acharam
já foi tratado. Os presets perderam a máscara, a frase do acelerômetro fechou nos
dois lugares, o `test_faxina_de_testes.py` voltou ao verde, os ~392 Hz ganharam
nota datada na canônica, e o censo de sprints órfãs é um **não-achado**
confirmado por régua independente. O que sobrou está abaixo, e é pouco — mas três
itens são da pior família da casa: **portão verde que não mede o que promete.**

---

## 1. Os três portões cegos — GRAU: MEDIDO, com a cura arrancada

Nenhum dos três estava escrito em lugar nenhum da árvore. Os três vivem em
relatos de conferente que morreram no diário do workflow.

### 1.1 `tests/unit/test_a_bancada_da_foto_exercita_os_dois_graus.py` — não olha a foto  <!-- ref-externa: a régua da janela GTK saiu na GTK-3 (06/09/2026, `D-0609-GTK-LEVA-INTEIRA`); o registro do dia em que ela existiu não se reescreve -->

Ele mede o **dado** da bancada (`_censo_de_mentira()`, `_dongles_de_mentira()`) e
nunca que o retrato os usa. As duas linhas que ligam a bancada ao host do retrato
são `scripts/gui-captura/retratar_abas.py:1226` e `:1230`.

```
$ # arranquei as duas linhas (self._censo_leitor / self._dongles_leitor)
$ .venv/bin/python -m pytest -q -p no:randomly \
      tests/unit/test_a_bancada_da_foto_exercita_os_dois_graus.py
.....                                                                    [100%]
5 passed in 0.32s
```

Sem aquelas duas linhas a coluna "O que é" volta inteira para *"não sei"* e a
coluna "Nome" some — **exatamente a foto que este portão existe para impedir** —
e ele fica verde. O docstring dele afirma ser *"a única coisa que decide o que a
documentação mostra daquela seção"*; ele não decide nada sobre a foto.

**A cura é uma asserção sobre o `_Host` montado**, não sobre as funções soltas.

### 1.2 `tests/unit/test_a_coluna_do_que_e_nasce_lida.py:210-213` — tautologia

A asserção itera `achados[2:]`, mas o comprehension interno relê
`secao_mesa._TIPOS_DE_RADIO` e ignora o `sel`. O conjunto resultante **é** `ids`:
sobra `ids.issubset(ids)`.

```
$ # troquei set_items([...]) por set_items([]) em secao_mesa.py:1090
$ .venv/bin/python -m pytest -q -p no:randomly \
      tests/unit/test_a_coluna_do_que_e_nasce_lida.py
..........                                                               [100%]
10 passed in 0.45s
```

Seletor com **zero botões** e dez verdes. A versão boa existe e morde:
`tests/unit/test_a_mesa_guarda_o_que_ela_declarou.py:281-289` compara contra o
literal do esquema. Esta é cópia degradada daquela.

### 1.3 `scripts/validar-referencias-docs.py:546` — casa por SUFIXO de caminho

`if referencia in sufixos: continue`. Um link com o basename certo e o diretório
errado nunca chega à resolução relativa das linhas 555-559.

```
$ # troquei (sprints/2026-08-22-ELO-MUDO-01-….md) por (2026-08-22-ELO-MUDO-01-….md)
$ # — 2 ocorrências; esse caminho NÃO existe em docs/process/
$ python3 scripts/validar-referencias-docs.py --all
1 referência(s) morta(s) em 398 documento(s):
  …:73: test_preset_flavor_migration.py  [arquivo]
exit=1
```

O achado que saiu é **outro** (o do §2 abaixo); o link quebrado que eu plantei
passou batido. Ou seja: o *"OK: 398 documento(s) sem referência morta"* que três
relatos citam como prova **não prova que os links resolvem** — prova que existe
um arquivo com aquele nome em algum lugar da árvore.

Nenhum defeito passou por esse buraco até hoje (conferi os documentos novos por
resolução de caminho: zero quebrados). **A prova apresentada é que não é a prova
que se pensa que é.**

---

## 2. Uma referência morta que estava viva na árvore — CORRIGIDA

O mesmo comando acima achou, sem mutação nenhuma, o
`docs/process/2026-08-22-ONDE-PARAMOS-…:73` citando o arquivo de teste de
migração de preset <!-- ref-externa: o arquivo foi APAGADO em 22/08 e a ausência dele é o assunto da frase -->
apagado em 22/08. O portão estava **vermelho na árvore** e ninguém tinha visto.
Curado com o marcador de isenção — a ausência do arquivo é o assunto da frase.
`exit=0` de volta.

---

## 3. O portão `A-CASA-SABE` está vermelho e não é de ninguém — ABERTO

```
$ .venv/bin/python -m pytest -q -p no:randomly \
      tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py
FAILED …::test_toda_promessa_solta_esta_classificada
1 failed, 30 passed in 72.33s
```

Três símbolos acusados. **Três frentes diferentes relataram esta reprovação e as
três disseram, corretamente, "não é minha".** É assim que um vermelho vira
paisagem. Cada um tem destino, e eu os apurei:

| símbolo | destino, com a evidência |
|---|---|
| `integrations/apelido_do_dongle.py::costurar_a_mesa` | **Opção 2 ou 3.** A razão de existir dele caducou em `e5376a0` (22/08 21h26): o `bt_active_mode.sh` deixou de fazer `head -1` e passa a iterar TODOS os que hospedam Nintendo (`mapfile -t COM_NINTENDO`, laço em `:281`); `_adaptador()` não existe mais. O mesmo commit diz que resolveu *"a duplicidade … dois escritores do mesmo alias"*. **Fiá-lo no install RECRIA a duplicidade que aquele commit desfez.** O docstring que afirmava o contrário foi corrigido nesta passagem |
| `integrations/censo_do_barramento.py::filhos_de` | **Opção 4 (`_SEM_CAMINHO_HOJE`).** O caminho é a E4 da CENTRAL-SEM-TELA-01 — a seção "O que está espetado", em árvore, que ela pediu e ainda não existe |
| `integrations/censo_do_barramento.py::hub_em_comum` | idem. É o leitor que responde *"os três adaptadores estão no mesmo hub?"*, e comparar o pai responderia **errado** |

Eu **não** declarei nada no portão: mexer em `_NAO_E_PROMESSA` /
`_SEM_CAMINHO_HOJE` é escrita num arquivo que três frentes tocaram na mesma
árvore. O que falta é uma pessoa aplicar as três linhas acima.

---

## 4. Uma generalização que duas medições da casa derrubam — CORRIGIDA

A madrugada mediu que `MANGOHUD=1` exportado pelo `hefesto-launch` não aparece no
`environ` do jogo, e concluiu *"invalida qualquer cura por variável de ambiente
no wrapper"*. **A conclusão é maior que a medição**, e a árvore já tinha o
contra-fato em dois lugares — o estudo de 16/08 (o `environ` lido era o do
`reaper` da Steam, e *"o `/proc` do processo do jogo tinha a variável"*) e o
`sentinela_do_wrapper.py:26-33`. A correção datada está na
[ESCONDE-SÓ-O-HIDRAW-01](2026-08-23-ESCONDE-SO-O-HIDRAW-01-o-jogo-continua-vendo-o-fisico-pelo-evdev.md),
§5 e E2.3, e a armadilha do `/proc` entrou no
[COMO-OLHAR-A-TELA.md](../COMO-OLHAR-A-TELA.md).

**Fica aberto** só o caso do MangoHud, e o primeiro passo dele é refazer a
leitura com `scripts/ensaios/quem_o_jogo_abre.py`, que já existe e resolve o
processo certo.

---

## 5. O que também estava perdido, e já foi tratado nesta passagem

| o que era | onde estava | o que ficou |
|---|---|---|
| *"o MAC da instância muda"* — derrubado por 4 pares `uniq`↔`hw_version` idênticos com uma semana de distância; foi entregue em aberto por quem o mediu e ninguém pegou | `BARRA-MUDA-01` §1.1 | correção datada, com o endereço certo da prova (§1.6, não §1.1) |
| *"`esportes` e `fps` já estão em dualsense"* — o `fps.json` não tem seção `mode` nenhuma (8 chaves, mtime 05/08). O §38 foi corrigido e esta linha não | `MASCARA-QUE-GRUDA-01` §167 | correção datada. Reconferido por leitura direta dos seis perfis dela |
| *"no rádio, entre ~55 e ~392 Hz"* contra os 796,8/800,8 Hz medidos no mesmo arquivo | `QUATRO-MICROFONES-01` | correção datada, apontando a reconciliação que já existe na canônica |
| o índice de 21/08 sem **um único** ponteiro na árvore, carregando a única menção ao cofre `~/.config/git/segredos-literais` | `SPRINT_ORDER.md` | ponteiro reposto, com a linha do cofre citada no lugar de destino |

---

## 6. O que esta página NÃO afirma

* **Não afirma que os três portões cegos deixaram defeito passar.** Afirma que
  eles não medem o que prometem, e que a prova que os relatórios citam não é a
  prova que eles pensam que é;
* **não reabre a E1 da A-FÁBRICA-COM-UM-CLIENTE-01.** O `lifecycle.py:1196`
  continua montando 6 dos 7 appliers, o patch está pronto na sprint dela, e o
  bloqueio é de território, não de conhecimento. Está na fila (#6) e não é perda;
* **não julga o interruptor do microfone.** A ponte voltou à janela sem a
  arbitragem do `hidraw` que o estudo de 16/08 nomeou como pré-requisito — e
  isso **já foi escrito** enquanto esta auditoria corria, na nota *"O PREÇO QUE
  NÃO FOI POSTO NA MESA"* no topo da
  [QUATRO-MICROFONES-01](2026-08-22-QUATRO-MICROFONES-01-a-ponte-esta-desligada-e-a-conta-diz-que-cabe.md).
  Não é perda; é decisão dela esperando o preço.

## Entregas

### E1 — o portão da foto passa a olhar a foto

Asserção sobre o `_Host` montado por `retratar_abas.py`, não sobre as funções da
bancada. **Como morde:** apagar `self._censo_leitor` tem de reprovar. Hoje passa.

### E2 — a tautologia vira comparação contra o esquema

Copiar a forma de `test_a_mesa_guarda_o_que_ela_declarou.py:281-289`. **Como
morde:** `set_items([])` tem de reprovar. Hoje passa com dez verdes.

### E3 — o portão de referências resolve o caminho antes de casar o sufixo

Inverter a ordem em `validar-referencias-docs.py:546`: resolver o caminho
relativo primeiro, e só cair no índice de sufixos quando a resolução falhar.
**Como morde:** um link com basename certo e diretório errado tem de reprovar.
**Preço declarado:** vai acusar links que hoje passam; a leva que a ligar tem de
contar quantos, antes de decidir se corrige ou isenta.

### E4 — as três linhas do portão `A-CASA-SABE`

A tabela do §3 é o texto pronto. Uma pessoa, um arquivo, e o vermelho sai.
