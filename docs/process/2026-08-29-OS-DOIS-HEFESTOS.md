# Os dois Hefestos — o teu e o de dev, na mesma máquina

29/08/2026. Escrito para ser lido em três minutos, começando pelos comandos.

**Nada disto foi executado.** Os scripts nasceram prontos para tu rodares, com
o teu dedo. Nenhum arquivo do teu Hefesto foi tocado.

---

## Os comandos

Estás em `/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix-dev`.

```bash
# 1. A LOGO NA DOCK — é isto e mais nada. Escreve UM atalho e os ícones,
#    tudo com "dev" no nome, tudo dentro de ~/.local/share. Zero sudo.
./scripts/instalar_atalho_da_interface.sh
#    tirar:  ./scripts/instalar_atalho_da_interface.sh --desfazer

# 2. VER SE O APP COMPLETO DE DEV COLIDE COM ALGUMA COISA (não instala nada)
./install-dev.sh --conferir

# 3. INSTALAR O APP COMPLETO DE DEV, se o passo 2 disser que está limpo
./install-dev.sh
#    tirar:  ./install-dev.sh --desfazer

# 4. A CHAVE — desliga e religa o Hefesto estável por inteiro
hefesto-chave estado          # quem está ligado agora (só lê, roda sempre)
hefesto-chave estavel off     # desliga o teu
hefesto-chave estavel on      # devolve exatamente como estava
```

Depois do passo 1, `./interface` abre com a logo âmbar na dock, e não se funde
mais com a janela do teu Hefesto.

---

## O que muda na tua máquina

**Nada, até tu rodares um dos comandos acima.** Depois:

| Passo | Escreve | Onde | Toca o teu Hefesto? |
|---|---|---|---|
| 1 | 1 atalho + 12 ícones | `~/.local/share/` | **não** |
| 3 | + 3 binários + 1 unit | `~/.local/bin`, `~/.config/systemd/user` | **não** |
| 4 | 1 arquivo-chave + máscaras | `~/.config/hefesto-dualsense4unix/` | sim — é o que ele faz |

Nenhum deles pede `sudo`. Nenhum deles escreve em `/etc` ou `/usr`.

**Não rodes `./install.sh` na pasta de dev.** Ele tem o nome do app cravado
(`install.sh:192`): rodá-lo ali não cria um app novo, **reescreve o teu** — o
atalho passa a apontar para a pasta de dev, e a tua unit passa a rodar código de
desenvolvimento sem trocar o nome de nada. O `install-dev.sh` existe por isso, e  <!-- ref-externa: `install-dev.sh` foi aposentado em 01/09/2026, quando o app virou único; o parágrafo é o registro do dia em que ele existia -->
ele **se recusa a rodar** se detectar que vai colidir, dizendo o que colide.

---

## O que fica separado

Cada Hefesto tem casa própria. Uma linha de código separa sete coisas de uma vez
(`utils/identidade.py`):

| | o teu | o de dev |
|---|---|---|
| perfis e config | `~/.config/hefesto-dualsense4unix/` | `~/.config/hefesto-dev-dualsense4unix/` |
| socket do daemon | `.../hefesto-dualsense4unix/` | `.../hefesto-dev-dualsense4unix/` |
| unit do systemd | `hefesto-dualsense4unix.service` | `hefesto-dev-dualsense4unix.service` |
| atalho e ícone | `hefesto-dualsense4unix` | `hefesto-dev-dualsense4unix` |
| logo | anel em degradê | **anel âmbar + bola âmbar** |

**O `dev` fica no MEIO do nome, e isso não é estilo.** A GUI mata a instância
anterior com `pgrep -f`, que casa por pedaço de texto. Se o app de dev se
chamasse `hefesto-dualsense4unix-gui-dev`, o nome do teu estaria *dentro* do
dele: abrir um mataria o outro, sem instalar nada e sem erro nenhum. Com
`hefesto-dev-dualsense4unix-gui`, nenhum dos dois alcança o outro. Há teste que
reprova se alguém mudar isso.

### O que os dois PARTILHAM, de propósito

Regras udev, o broker de hidraw, o `bt-agent`, o watchdog do Bluetooth. Essa
camada é da **máquina**, não do app — e o broker foi desenhado para servir dois
daemons ao mesmo tempo, cada um com a sua lease. Duplicá-la exigiria `sudo` toda
vez, que é o custo que tu vetaste em 22/08. **O app de dev depende do teu
Hefesto para essa camada.**

---

## Se tu desligares o estável

`hefesto-chave estavel off` faz cinco coisas, todas reversíveis:

1. para, desabilita e **mascara** as 5 units do teu Hefesto;
2. escreve um arquivo-chave em `~/.config/hefesto-dualsense4unix/`;
3. manda SIGTERM no processo avulso, **lido do pid file** — nunca por `pgrep`,
   que alcançaria o outro Hefesto;
4. esconde o teu atalho da dock (acrescenta uma linha; `on` a remove);
5. imprime o que desligou e o comando que devolve tudo.

**O que tu perdes enquanto ele está desligado:** trocar perfil por jogo, o vigia
da Steam, o registro do storm de USB, a bandeja — tudo que o daemon faz. O app
de dev ainda não faz nada disso. **A interface nova (`./interface`) continua
funcionando com o estável LIGADO** — ela só lê o teu daemon; é aí que ela mostra
a tua mesa de verdade.

**O que ele não toca:** teus perfis, tua config, as regras udev, o broker. Nada é
apagado. `on` desfaz tudo.

### A coisa que quase deu errado, e vale tu saberes

O plano original era só `systemctl mask`, e a suposição era que isso fechava tudo
— inclusive o botão "Ligar daemon" da tua GUI. **Medimos: não fecha.** Quando o
`systemctl start` falha, o botão cai num caminho alternativo que sobe o daemon
direto, sem passar pelo systemd (`app/actions/daemon_actions.py:2162`). A máscara
não o alcança: tu terias desligado o Hefesto e um clique no botão o religaria.

Por isso a chave tem **duas cintas**. A segunda é o arquivo em disco, que o
próprio daemon lê antes de tocar no aparelho — e quando ele recusa, **diz por
quê, desde quando, e qual comando desfaz**. Sem barulho, sem silêncio.

---

## As janelas na mesma instância

Tu pediste: *"as janelas adicionais que abrirem devem ficar na MESMA INSTÂNCIA
da janela da dock, sem abrir o mesmo app ao lado como se fosse outro programa"*.

**Estava assim, e agora está curado — uma linha.** Medido em servidor X isolado,
lendo o que a janela publica de verdade:

| | antes | agora |
|---|---|---|
| janela principal | certo | certo |
| Mapear Entradas | **errado** | certo |
| Mapear Entrada a Entrada | **errado** | certo |
| seletor de arquivo | **errado** | certo |
| os 17 avisos e diálogos | **errado** | certo |

**1 de 6 → 6 de 6.** A cura é `Gdk.set_program_class` em `app/main.py`: ela vale
para o processo inteiro, então conserta as 23 janelas de uma vez — inclusive as
que ainda não foram escritas. A alternativa (uma chamada por janela) é API
depreciada, deixaria os diálogos de fora, e a próxima janela nasceria quebrada de
novo.

**A rota grande (`Gtk.Application`) não foi feita, e não deve ser.** Nós a
medimos: sob o teu ambiente ela **não conserta nada** — o identificador do
aplicativo não chega ao que a dock lê. Custaria 7 arquivos e brigaria com o
mecanismo de instância única que já existe. Está descartada com o motivo medido.

---

## O que ainda está aberto, e é teu decidir

1. **A logo de dev é uma proposta, não uma decisão.** Anel âmbar + bola âmbar no
   canto — escolhido porque é o que se distingue a 24 px, onde texto vira borrão.
   Se quiseres outra marca, é uma linha em `assets/hefesto-dev-logo.svg`.

2. **A tua logo nova tem um defeito de compatibilidade, e não foi tocada.**
   `assets/hefesto-logo.svg` usa dois recursos de CSS que o renderizador dos
   ícones **ignora** — o resultado é que **o anel e o martelo somem** do ícone da
   dock, embora apareçam certos dentro do app. Medimos a correção e ela é exata
   (o Chrome desenha o antes e o depois idênticos, pixel por pixel), mas o
   arquivo é teu e está em edição, então só deixamos a conta pronta:

   ```
   anel    → transform="matrix(-1, 0, 0, -1, 199.465951, 199.998882)"
   martelo → transform="matrix(0.514677, -1.055068, 0.985237, 0.428599, -58.405815, 136.782981)"
   ```
   (e apagar os `style="transform-box…"` / `style="transform-origin…"` dos dois).

   Enquanto isso, o portão dos ícones fica **vermelho** — não por causa desta
   leva: ele já estava assim quando chegamos.

3. **A unit do daemon de dev é instalada mas NÃO habilitada.** Dois daemons
   disputam o aparelho. Quando quiseres o de dev no boot: `hefesto-chave estavel
   off` e depois `systemctl --user enable --now hefesto-dev-dualsense4unix.service`.

4. **O ícone da bandeja de dev é o mesmo desenho do teu.** A grade de 16 px não
   tem folga para uma marca a mais. Quem distingue os dois na bandeja é o ícone
   colorido do degrau de queda, esse sim diferente.
