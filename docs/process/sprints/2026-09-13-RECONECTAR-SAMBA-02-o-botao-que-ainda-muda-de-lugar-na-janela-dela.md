---
sprint: RECONECTAR-SAMBA-02
estado: aberta
onda: A-TERCEIRA-LISTA-DELA
posse:
  RECONECTAR-SAMBA-02:
    # PROVISÓRIA — o ESTUDO escreve a posse real no §E antes do despacho.
    - docs/process/sprints/2026-09-13-RECONECTAR-SAMBA-02-o-botao-que-ainda-muda-de-lugar-na-janela-dela.md
bancada: false
depois_de: []
---

# RECONECTAR-SAMBA-02 — o botão que ainda muda de lugar e de formato na janela dela

A palavra dela está no índice: *«reconectar controles segue dando pau… falo do
posicionamento e formato dele. ele segue sambando.»*

## §0 — O que já se sabe

* **A JOGAR-A-FAIXA-QUE-PULA-01 (`87d4bd0c`, no `dev` em `e58bfe2b`)** mediu no
  piloto oculto, em 1212/1228/1282/1300 px, que quem empurrava o botão era o
  recibo invisível na `.faixa-final`, tirou o nó e prendeu o botão à direita,
  numa linha. **A queixa dela veio antes da instalação dessa cura** — o
  primeiro passo é medir se ela continua depois de instalada.
* **O que o piloto não mede:** a janela DELA. O COSMIC, a escala de texto e de
  tela da sessão dela, a largura e a altura que o compositor dá (as fotos de
  02:48 mostram ~1228 e ~1282 px no mesmo minuto), a fonte que o WebKit dela
  resolve, e o redimensionamento enquanto a janela está aberta. As duas linhas
  da foto 1 **não se reproduziram no WebKit do piloto**, só no Chrome.
* Fotos dela: `~/.claude/image-cache/8fc26f69-7ade-42a1-9497-63eac702dfb8/4.png` e `5.png`
  (nunca copie para o repositório).

## §E — O ESTUDO (só lê e mede; escreve aqui)

1. Com a versão instalada, meça o botão no piloto `--oculta` nas condições da
   sessão dela: escala de texto (`gsettings`/COSMIC), DPI, a fonte resolvida, e
   larguras de 1100 a 1920 px; e durante um redimensionamento.
2. Ache TODO elemento da aba Jogar cujo tamanho muda com o tique ou com a
   largura na mesma fileira ou acima do botão (a ressalva da máscara, a
   pendência, os cartões, a moldura).
3. Diga a causa com número e a posse real. Nada de botão novo; mexer o mínimo.

## §I — IMPLEMENTA  ·  §V — VALIDA/CORRIGE

Escritos por quem coordena depois do estudo.
