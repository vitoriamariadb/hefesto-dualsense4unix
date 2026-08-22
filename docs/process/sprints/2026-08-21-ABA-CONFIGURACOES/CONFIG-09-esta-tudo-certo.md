# CONFIG-09 — "Está tudo certo?"

**Depende de:** CONFIG-02. **Executada em 22/08/2026.**

> Nasceu de um pedido durante a revisão do mockup: *"seria maneiro rodar um scan
> tipo o doctor mas pra saúde das portas usb e do bt. ficando verde com um check
> pra dizer que o app funciona como deveria."*

## Por que esta é, talvez, a sprint mais valiosa da leva

O `scripts/doctor.sh` tem **5201 linhas** e o `main()` chama **65 conferências**
(64 antes desta sprint, mais a que ela acrescentou) — energia USB, autosuspend,
BlueZ, pareamento, CRC de rádio, estado do DKMS. É um dos ativos mais fortes do
projeto.

E é **invisível para quem não abre terminal** — ou seja, para a maior parte de
quem usa o produto.

Esta sprint não constrói diagnóstico novo. Ela dá cara de gente ao que já
existe: um selo verde com um check dizendo *"Pronto para jogar"*, e as linhas
abaixo dizendo o que foi conferido.

## O que aparece

```
● Pronto para jogar        [ Examinar de novo ]        Agora mesmo

● Economia de energia desligada     ● Energia das portas
● Pareamentos salvos                ● Suporte ao controle
! Vizinhança das portas
```

**São CINCO linhas, não seis.** "Firmware dos adaptadores" saiu: `grep firmware
scripts/doctor.sh` não devolve check nenhum por adaptador, só texto de mensagem
e o check de DKMS. Manter a linha exigiria construir diagnóstico novo — e a
sprint afirma, três parágrafos acima, que não constrói. Decisão E1 de
[DECISOES-DA-EXECUCAO.md](DECISOES-DA-EXECUCAO.md).

Quatro estados, e a semântica de cor do projeto manda em cada um:

| Estado | Cor | Quando |
|---|---|---|
| Certo | Verde `@green` `#50fa7b` | Nada a fazer |
| Atenção | **Laranja** `@orange` `#ffb86c` | Funciona, mas dá para melhorar — e é reversível |
| Problema | Vermelho `@red` `#ff5555` | Algo está quebrado agora |
| Não sei | Cinza `@text_muted` `#8b8fa8` | A resposta exigiria senha, ou a ferramenta não existe aqui |

**Laranja, e não amarelo.** O `gui/theme.css:13` fixa *"VERDE confirma, LARANJA
alerta, VERMELHO destrói, CIANO informa"*, e o `daemon_actions.py:754` já pinta
`[WARN]` de `#ffb86c` **nesta mesma janela**. Duas palavras para a mesma cor é
dívida de tela (F2 da execução).

**Vizinhança de porta ruim é laranja, nunca vermelho.** Vermelho é para o que
destrói e não tem volta.

**O quarto estado é a doutrina sudo-zero em forma de cor.** Checagem que
precisaria de root devolve "não deu para conferir" — jamais falha. E um
`nao_sei` na lista impede o verde do topo: *"está tudo certo"* sobre uma linha
que ninguém mediu é a mesma mentira do verde sobre vermelho, só mais barata.

## A decisão de arquitetura

A pergunta do reconhecimento era: a aba é superfície gráfica do doctor, ou um
segundo diagnóstico independente? **Fonte única** — a aba não reimplementa
checagem nenhuma.

O que a sprint recomendava para chegar lá (`doctor.sh --json`) **não sobrevive
ao empacotamento, e foi descartado.** O doctor NÃO viaja nos pacotes:

- `install.sh:3064-3076` copia só o `storm_watch.sh`;
- a spec do Fedora instala `install-host-udev.sh` e `dkms_lib.sh`, mais nada;
- o manifesto Flatpak não o menciona;
- `_find_doctor_sh` (`cli/cmd_doctor.py:36-38`) devolve `None` num pacote.

Uma aba que dependesse dele nasceria **vazia** para quem instalou por pacote.

A saída é a inversa, e é o padrão que a casa já usa três vezes: **o módulo
Python viaja dentro do wheel e o doctor é que o consome.** O precedente exato é
`integrations/sentinela_do_wrapper.py:211`, consumido por
`scripts/doctor.sh:1612`.

O que impede as duas leituras de divergirem não é a disciplina de quem edita —
é o mesmo mecanismo que `integrations/prontuario_dos_jogos.py:203-205` descreve
para a ponte dos jogos: **um portão que compara as duas leituras e reprova se
discordarem**. Aqui o mecanismo é mais barato, porque não há duas leituras: há
uma, e o doctor imprime a conclusão dela ao lado das suas próprias
(`check_exame_da_mesa`, `scripts/doctor.sh:3252`).

E há uma correção de custo que a sprint tinha invertida. Ela dizia que os testes
fazem grep na SAÍDA do doctor; é grep no **texto-fonte** (`test_plataforma_wiring.py:31`
faz `DOCTOR = (REPO_ROOT / "scripts" / "doctor.sh").read_text()`). O efeito
inverte a conta: **acrescentar ao doctor não ameaça nada; TIRAR checagem apaga
strings que 54 arquivos de teste asseram.**

## O que ficou de pé

| Arquivo | O que é |
|---|---|
| `src/hefesto_dualsense4unix/integrations/exame_da_mesa.py` | as cinco checagens, o `veredito()` e o CLI `--censo` / `--relatorio`. 100% stdlib, read-only, sem root, cada caminho por argumento |
| `src/hefesto_dualsense4unix/app/actions/config/secao_exame.py` | a seção 0: selo, botão, carimbo e as cinco linhas. A cor, o glifo e o texto moram aqui |
| `scripts/doctor.sh` | `check_exame_da_mesa()`, acrescentada depois de `check_bt_paired_sem_bonded` e chamada em `main()` |
| `tests/unit/test_exame_da_mesa.py` | 28 testes sem GTK e sem root |
| `tests/unit/test_config_selo_de_saude.py` | 13 testes com GTK real |

**O selo é derivado por UMA função.** `exame_da_mesa.veredito()` é a resposta
escrita ao commit `6c86e295` e à cicatriz de `scripts/doctor.sh:1586-1590`:
*"o dano não é errar um diagnóstico: é a tela ensinar que verde-e-vermelho
juntos são normais por aqui, que é como um portão morre de descrédito"*. A casa
pagou por isso duas vezes em agosto. Um segundo lugar decidindo a cor do topo é
como aquilo volta — por isso a tela recebe o selo pronto e não o calcula.

## Não pode

- **Rodar sozinho a cada tique.** O exame é caro. Roda ao ENTRAR na aba e no
  botão — **nunca na montagem**, que acontece no arranque da janela e é o
  caminho que o `scripts/gui-captura/retratar_abas.py` percorre para gerar os
  PNGs de `docs/usage/assets/`. Um exame ali poria leitura viva de `/sys` e do
  rádio dentro de imagem versionada, e nenhum portão de anonimato varre PNG.
  Travado por `test_a_montagem_nao_dispara_o_exame`.
- **Pedir senha.** A GUI é sudo-zero por doutrina, e `/var/lib/bluetooth` é
  proibido: `check_bt_bonds_persistidos` (`scripts/doctor.sh:3050-3053`) começa
  com `sudo -n true` e desiste sem ele. O pareamento é lido só pelo D-Bus.
- **Ecoar a mensagem do doctor.** Elas carregam `sudo` e carregam o endereço do
  rádio (`scripts/doctor.sh:3227` imprime o MAC). O exame traduz para
  consequência, ou cala.
- **Rodar na thread do GTK.** O `busctl` é subprocesso, e
  BUG-GUI-SYSTEMCTL-SYNC-NA-THREAD-GTK-01 (`daemon_actions.py:1817-1827`) já
  congelou a janela inteira assim.
- **Consertar nada por conta própria.** Diz o que achou e o que fazer. Quem age
  é a pessoa.

## Prova de trabalho

```bash
.venv/bin/python -m pytest tests/unit/test_exame_da_mesa.py -q
xvfb-run -a .venv/bin/python -m pytest tests/unit/test_config_selo_de_saude.py -q
.venv/bin/python src/hefesto_dualsense4unix/integrations/exame_da_mesa.py --relatorio
bash scripts/doctor.sh --quiet 2>&1 | grep -c 'exame da mesa'    # >= 1
shellcheck -S error scripts/doctor.sh
```

A prova que a sprint trazia (`scripts/doctor.sh --json | python3 -m json.tool`)
**não roda**: o laço de argumentos (`scripts/doctor.sh:72-82`) só imprime
`[doctor] aviso: argumento desconhecido` e segue, e o `json.tool` morre com
`Expecting value: line 1 column 2 (char 1)`. Ela foi substituída pelas cinco
linhas acima.

**Aceite:** numa máquina saudável, selo verde. Com um pareamento pela metade, a
linha de pareamentos fica vermelha e o selo do topo acompanha. Com um rádio na
porta vizinha, a vizinhança fica laranja e o topo diz "Dá para jogar, mas vale
um ajuste" — porque laranja não impede de jogar.

Nesta bancada o aceite verde não é demonstrável hoje: não há adaptador Bluetooth
encaixado, e há um par de portas coladas. O que ela devolve, medido em
22/08/2026, é `[WARN] exame da mesa: Vizinhança das portas`.
