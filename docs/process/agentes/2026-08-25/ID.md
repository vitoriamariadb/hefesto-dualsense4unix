# ID — o app-id que ela decidiu foi para o código

**25/08/2026.** Sprint `IDENTIDADE-01`, Fases 2 e 3. A Fase 1 já estava feita
(a `<url type="homepage">` do metainfo e as demais já apontam para
`Hefesto-Team`); confirmei antes de começar.

O id: `io.github.hefesto_team.hefesto_dualsense4unix`. Não reabri a escolha.

## O que mudou

**Fase 2 — renomear.** Os três arquivos de `flatpak/` viajaram por `git mv`
para o nome novo. Trocado em 49 arquivos: `app-id` e todos os destinos de
`install -D` do manifesto (ícone, `.desktop`, metainfo), `<id>` e
`<launchable>` do metainfo, `Icon=` do `.desktop`, a detecção em `app/app.py`,
o comentário em `app/main.py`, `install.sh`, `uninstall.sh`, os 15 testes que
cobram o id nos empacotamentos, `.github/workflows/flatpak.yml` e
`release.yml`, `NOTICE`, `LICENSES/README.md`, `scripts/build_flatpak.sh`,
`check_packaging_parity.sh`, `check_version_consistency.py`,
`install-host-udev.sh`, `purge.sh`, as três páginas de `docs/usage/` e três
docstrings em `src/` que citam o manifesto pelo caminho.

**Duas afirmações caducas SUBSTITUÍDAS, não empilhadas:** o cabeçalho do
manifesto e o comentário do `flatpak.yml` diziam *"App-id preservado por design
no rebrand v3.0.0 — não muda para evitar quebrar instalações existentes"*. A
decisão de hoje derruba a de então; as duas linhas agora dizem o que é verdade
e por quê.

**Fase 3 — migrar.** É onde mora o risco, e o roteiro da sprint não previa duas
das peças:

1. `utils/migrate_legacy_paths.py` ganhou uma segunda origem. Dentro do sandbox
   o `XDG_CONFIG_HOME` é `~/.var/app/<app-id>/config`, então trocar o app-id
   troca a pasta onde os perfis dela moram. `_raiz_do_sandbox_antigo()` traduz
   o caminho do sandbox novo para o do antigo e devolve `None` fora do sandbox
   — instalação nativa não muda de pasta ao trocar app-id, e se respondesse
   aqui um usuário do `.deb` veria perfis aparecerem do nada. Copia só o que
   falta, **nunca apaga a origem**, e roda no boot do daemon e da GUI, que é
   onde a função já era chamada.
2. **O manifesto precisou de `--filesystem=~/.var/app/br.andrefarias.Hefesto:ro`.**
   Sem ela a migração é código morto: o Flatpak esconde a casa de outro id, e
   os perfis existiriam invisíveis dois diretórios ao lado. `:ro` porque aqui
   só se lê — mesmo critério das duas linhas da Steam empacotada.
3. **O `uninstall.sh` apagava a casa do sandbox INTEIRA, sempre** — `rm -rf
   "${HOME}/.var/app/<id>"` incondicional, contradizendo a linha logo abaixo
   que promete "configs preservadas por padrão". A IDENTIDADE-01 tornou isso
   caro: é justamente essa pasta que a migração lê. Agora só o `cache/` sai por
   padrão; a casa inteira só com `--purge-config`, e com backup.
4. `uninstall.sh` e `scripts/purge.sh` conhecem **os dois** ids. `app/main.py` e
   `app/app.py` matam a instância anterior sob qualquer dos dois.
5. `install.sh` **avisa** quem tem o Flatpak antigo, diz por quê (o Flatpak não
   migra id: instala ao lado), diz que os perfis não se perdem, e dá o comando.
6. O metainfo ganhou `<replaces><id>br.andrefarias.Hefesto</id></replaces>` — é
   o que faz a LOJA entender que um substitui o outro em vez de mostrar dois
   Hefestos. `appstreamcli validate --no-net` passa (2 infos, as mesmas de
   antes).
7. `docs/usage/flatpak.md` ganhou a seção "Se você já usava o Hefesto pelo
   Flatpak antes de 25/08/2026".

**Não desfiz nada da BG-04 nem da G7.** Conferi com `git log --oneline -8` antes
de começar; os cinco scripts do BG-04 continuam no manifesto (o
`check_packaging_parity.sh` os confere e está verde) e o
`install_censo_do_gabinete_host()` da G7 está intacto no `install.sh`.

## Qual mordida prova

Régua nova: `tests/unit/test_identidade_do_aplicativo_01.py`, 19 testes. **O
literal do id está escrito na régua, não importado do produto** — uma régua que
lê a constante do código sob teste passa com a cura arrancada.

Seis mordidas, cada uma arrancada, vista reprovar, e devolvida:

| arranquei | reprovou |
|---|---|
| as duas linhas do sandbox antigo em `candidatos` | `test_os_perfis_atravessam_a_troca_de_app_id`, `test_e_idempotente` |
| `--filesystem=…br.andrefarias.Hefesto:ro` | `test_o_manifesto_deixa_a_migracao_ler_a_casa_antiga` |
| `app-id:` de volta para o antigo | `test_o_manifesto_declara_o_id_novo` |
| o id antigo do array do `uninstall.sh` | `test_o_uninstall_desinstala_os_dois_ids` |
| o bloco de aviso do `install.sh` | `test_o_install_avisa_…`, `test_o_id_antigo_so_sobrevive_…` |
| o `<replaces>` do metainfo | `test_o_metainfo_declara_que_substitui_…`, `test_o_id_antigo_so_sobrevive_…` |

A régua que mais morde é `test_o_id_antigo_so_sobrevive_nos_pontos_de_transicao_declarados`:
varre tudo o que EXECUTA ou EMPACOTA (por `git ls-files`, porque bytecode não é
produto) e cobra **nos dois sentidos** — nenhum arquivo fora da lista nomeia o
id antigo, e todo arquivo da lista ainda o nomeia. Correção pela metade é
exatamente o defeito que deixa as duas versões vivas.

**A prova de trabalho do ciclo, medida:** não rodei `install.sh` de verdade —
ele mexe em udev, DKMS e units na máquina dela, e a bancada é a dela. O que
rodei foi cada bloco REAL, recortado do arquivo por número de linha, contra um
`HOME` de mentira e um `flatpak` dublê que finge que só o id antigo está
instalado:

1. bloco do `uninstall.sh` → desinstalou `br.andrefarias.Hefesto`, apagou o
   `cache/`, e **o `profiles/sackboy_nativo.json` sobreviveu**;
2. bloco de aviso do `install.sh` → imprimiu o aviso com o comando certo;
3. `migrate_legacy_paths()` real, com `XDG_CONFIG_HOME` apontando para o
   sandbox novo → `{'config_app_id_antigo': ['profiles/sackboy_nativo.json']}`,
   perfil no destino **e a origem intacta**.

Portões: os 26 do `scripts/portoes.sh`, um vermelho — `acentuacao`, e **não é
meu** (ver abaixo). `appstreamcli validate --no-net` OK. 465 testes do escopo
verdes.

## O que NÃO verifiquei

- **Não rodei `flatpak-builder`.** Que o manifesto CONSTRÓI com o nome novo é
  inferência a partir de o `app-id` e os destinos casarem; não há flatpak-builder
  nesta bancada e o build baixa runtime da rede.
- **Não vi o ícone na grade dela.** Que `Icon=` e o destino do `install -D`
  casam está sob teste; que o tema resolve o PNG na prática, não.
- **Não testei com um Flatpak antigo REAL instalado.** O `flatpak` dos dois
  ensaios é dublê. O comportamento do `flatpak info`/`list`/`uninstall` real é
  inferência a partir da interface de linha de comando deles.
- **Não sei se o `<replaces>` produz o efeito prometido numa loja real.** A
  tag valida no `appstreamcli` 1.0.2; que o GNOME Software ofereça a troca em
  vez de um segundo aplicativo é o que a documentação do AppStream diz, não algo
  que eu tenha visto acontecer.
- **Sem DualSense na bancada.** Nada aqui toca o aparelho.

## O que sobrou para o próximo

- **UMA LÁPIDE OBSOLETA, e o arquivo é de quem coordena.**
  `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py:218` cita
  `flatpak/br.andrefarias.Hefesto.yml:320`. Duas coisas erradas nela: o nome do
  arquivo (renomeado hoje) e o número da linha — que **já estava errado antes de
  mim**: no `HEAD` o `install -Dm644 …/hidraw_broker.py` estava em `:342`, não
  em `:320`. Hoje está em
  `flatpak/io.github.hefesto_team.hefesto_dualsense4unix.yml:358`. Não editei o
  arquivo, como mandado.
- **O portão `acentuacao` está VERMELHO no `dev`, e não é desta frente.** As 8
  violações estão em `scripts/gerar-frases-de-tela.py` (7) e
  `docs/process/2026-08-25-AS-FRASES-DE-TELA-QUE-ESPERAM-ELA.md` (1), dois
  arquivos que não toquei. São tokens de CSS/HTML lidos como português —
  `data-voto="nao"` e `@media` —, ou seja, a régua está medindo código como
  texto. Quem fechar a frente das frases de tela decide se conserta o dado ou a
  régua.
- **`CHANGELOG.md:1851` e os docs de `docs/process/` continuam com o nome
  antigo do manifesto.** Deixei de propósito: são registro do dia em que foram
  escritos. As 11 referências que o `validar-referencias-docs.py` reprovou —
  ponteiros para o arquivo renomeado, em 7 documentos de `docs/process/` — essas
  eu repontei, porque ponteiro morto não é registro, é ruído. O portão está
  verde.
- **A migração roda no boot do daemon e da GUI, não pela CLI.** É o mesmo
  alcance que a migração legada já tinha; se alguém abrir só a CLI dentro do
  Flatpak novo, os perfis chegam na próxima abertura da janela.
- **Uma tensão que deixo escrita, porque é decisão e não detalhe:** o pedido
  dizia "perfis intactos E nenhum resto do id velho". Os dois não cabem juntos
  no default — a casa `~/.var/app/br.andrefarias.Hefesto/` É os perfis. Escolhi
  perfis intactos (e `--purge-config` para quem quiser a casa fora, com backup),
  porque a sprint diz "sem apagar o antigo" com todas as letras e porque apagar
  não tem volta. O `docs/usage/flatpak.md` ensina o `rm -rf` para quem quiser.
