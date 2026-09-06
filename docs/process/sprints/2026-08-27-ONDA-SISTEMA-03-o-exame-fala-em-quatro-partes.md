---
sprint: ONDA-SISTEMA-03
estado: absorvida
# onda: SISTEMA
posse:
  S3:
    - src/hefesto_dualsense4unix/integrations/storm_doctor.py
    - src/hefesto_dualsense4unix/cli/cmd_doctor.py
cria:
  - tests/unit/test_onda_sistema_03_o_exame_em_quatro_partes.py
bancada: false
depois_de:
  - LEVA-1  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
  - LEVA-2  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
  - LEVA-DE-BACKGROUND-01  # fechou no merge 27e6c4a6 (as sete frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/app/
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/daemon/
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 09). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA SISTEMA · 03 — O exame aprende a falar em quatro partes

**O defeito:** cada linha do exame de saúde volta como um par
`(selo, frase única)`, com o veredito, a explicação e o conserto **grudados** —
e não há como pôr o veredito na tela e a explicação na dica sem cortar texto
no meio com expressão regular.

## O que já existe

`integrations/storm_doctor.py:755` — `storm_report()` devolve
`list[tuple[str, str]]`, seis linhas, cada uma vinda de um `check_*`:

| Função | Linha |
|---|---|
| `check_snd_quirk` | `:560` |
| `check_snd_audio_healthy` | `:691` |
| `check_quirk` | `:364` |
| `check_steam_input` | `:413` |
| `check_wireplumber` | `:509` |
| `check_authorized_rule` | `:536` |

Mais duas que a GUI acrescenta fora do `storm_report`:
`daemon_actions.medir_guarda_do_steam_input:735` (o vigia morto) e
`medir_prontuario_dos_jogos:807` (a ponte divergente) — as duas devolvem o
mesmo par de duas partes. **Seis a oito linhas**, como diz o redesenho
(linha 533). Essas duas moram em `daemon_actions.py`, **fora da sua posse** —
quem as converte é a ONDA-SISTEMA-04.

O tamanho é o problema medido: a linha de Steam Input com dois jogos citados
chega a **311 caracteres** (redesenho, linha 546); `check_wireplumber:532` já
carrega dentro de si a receita *"clique 'Aplicar correções' na aba Sistema"*
com o `PREFIXO_DA_CURA`.

## O que entrega

1. **`LinhaDeSaude`** (dataclass, em `storm_doctor.py`) com quatro campos:
   `selo` (`OK` / `WARN` / `INFO`), `veredito` (**curto**, o que vai para a
   tela), `o_que_vi`, `por_que_importa`, `o_que_fazer` (`str | None` — INFO e
   OK normalmente não têm conserto a propor).
2. **Os seis `check_*` passam a devolver `LinhaDeSaude`**, e o `PREFIXO_DA_CURA`
   deixa de ser concatenação: o conserto vira o campo `o_que_fazer`.
3. **Uma verdade, duas formas.** `storm_report_detalhado()` nasce devolvendo
   `list[LinhaDeSaude]`; **`storm_report()` continua devolvendo os pares**,
   agora derivados dela por `LinhaDeSaude.como_par()`. Isto não é gentileza —
   é o que impede a árvore de quebrar: hoje há **dois** consumidores de pares,
   `cli/cmd_doctor.py:113` e `app/actions/daemon_actions.py:1114`, e o segundo
   está fora da sua posse. Quem troca a GUI para a forma detalhada é a
   **ONDA-SISTEMA-04**; o terminal fica nos pares para sempre (lá não existe
   dica).
4. **Um teto medido para o `veredito`.** O mockup usa uma linha de 28 px de
   altura, sem quebra: fixe **80 caracteres** como limite e faça o teste
   reprovar quem passar. O texto longo tem para onde ir agora.

## Como se prova (a mordida)

`tests/unit/test_onda_sistema_03_o_exame_em_quatro_partes.py`:

- **as quatro partes existem e nenhuma é vazia** para cada uma das seis
  linhas, nos dois desfechos (o que passa e o que reprova) — dublê de
  filesystem para cada `check_*`, exercitando **`OK` e `WARN`**. Régua que só
  vê o caminho verde não é régua (§4);
- **o veredito cabe**: `len(linha.veredito) <= 80` para as seis, inclusive a
  do Steam Input **com dois jogos citados** — o caso de 311 caracteres que
  motivou a sprint. Devolva a frase antiga ao campo `veredito` e veja
  reprovar: é a mordida;
- **o conserto não se perde**: toda linha `WARN` tem `o_que_fazer` não vazio.
  É a regra desta casa (*toda frase de diagnóstico diz o quê, por quê e o que
  fazer* — `MEMORY: quem-e-o-usuario-e-por-que-a-aba-ensina`), e ela vale
  mesmo quando o "o que fazer" for exibido só na dica;
- **o terminal não regride**: `cmd_doctor` sobre um exame de saída conhecida
  imprime **as mesmas linhas de antes**, byte a byte. Este é o teste que
  impede a refatoração de virar mudança de comportamento — e as suítes que já
  existem (`tests/unit/test_storm_doctor.py:59`,
  `tests/unit/test_mesa_cheia_11_a_janela_conta_quatro.py:207`) medem os pares
  e **têm de continuar verdes sem edição**. Se você precisou editá-las, mudou
  o contrato antigo em vez de acrescentar o novo.

## O que é dela decidir

- **Nada de tela nesta sprint** — ela é backend puro e não escolhe onde cada
  parte aparece. A pergunta *"numa linha [WARN], o conserto aparece na tela ou
  só no hover?"* (redesenho, linha 594) é da **ONDA-SISTEMA-04**; aqui só se
  garante que as duas respostas sejam possíveis sem cortar texto.

## Por que ela roda em paralelo

Não toca `app/` nem o Glade: é a única sprint desta onda que pode correr ao
lado da fila do `main.glade`. A 04 depende dela.
