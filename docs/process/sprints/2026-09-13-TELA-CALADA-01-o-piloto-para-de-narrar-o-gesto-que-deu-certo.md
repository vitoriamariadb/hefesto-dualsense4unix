---
sprint: TELA-CALADA-01
estado: feita
onda: A-FILA-DE-1309
posse:
  TELA-CALADA-01:
    - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
    - src/hefesto_dualsense4unix/interface/pacotes/rodape.py
cria:
  - tests/unit/test_a_tela_nao_narra_o_gesto_que_deu_certo.py
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py
  - src/hefesto_dualsense4unix/interface/pacotes/a07_lancadores.py
  - src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py
  - src/hefesto_dualsense4unix/interface/pacotes/a09_sistema.py
  - src/hefesto_dualsense4unix/interface/pacotes/a10_perfis.py
  - src/hefesto_dualsense4unix/integrations/carona_do_wrapper.py
---

# TELA-CALADA-01 — o piloto para de narrar o gesto que deu certo

> **ESTADO 2026-09-13: feita, com o item 4 PARADO pela régua da própria sprint** —
> o sucesso não deposita mais (a frase vai ao diário como `[relato]`), o
> `rodape._recado` devolve `None`, e a recusa só aparece na aba em que nasceu.
> Medido no piloto oculto: o «Aplicar» com um jogo da Steam sem o atalho não
> escreve nada na 01, na 02 nem na 05, e o atalho continua reposto. O item 4 não
> foi construído: o pouso de uma recusa é invisível (o recorte do botão sai byte
> a byte igual antes do clique e depois do pouso, no cadeado e no «Aplicar» da
> 01), e o item manda parar nesse caso. A entrega está em
> `docs/process/agentes/2026-09-13/TELA-CALADA-01-opus.md`.

**13/09/2026, madrugada.** A palavra dela, com a foto do rodapé:

> *"essas frases de status que aparecem no rodapé isso não deveria estar aparecendo. também. preciso que remova isso tambem."* <!-- noqa-acento: citação literal dela -->
>
> *"em todas as abas da interface"*

O `71c69c57` tirou a TARJA (recado sem cartão e sem faixa). O mapa de 13/09 —
cinco agentes só lendo o código sobre `71c69c57`, 55 achados brutos, 24
confirmados — mostra o recado chegando ainda por três portas: o **cartão** do
controle, as **faixas** `data-hef-recados` da 01 e da 05, e a **aba seguinte**.

## §1 — O que muda

1. **Sucesso não deposita.** `_deu_certo_dizendo` deixa de chamar
   `_depositar(..., "sucesso")`. A frase vai ao stderr como
   `[relato] <página> · <gesto>: <frase>` — o desenho que a aba 10 ganhou no
   mesmo dia (`a10_perfis._anotar`). O `recado` continua saindo da carga antes
   da pintura. Isto cala de uma vez a carona do rodapé nas 02/05/08
   (`rodape.py`, Aplicar/Salvar/Importar), o recibo do Reconectar na faixa da
   01, e os recados de sucesso da 03, 04, 05, 06, 07 e 09.
2. **`rodape._recado` devolve None**, e `perfil.com_a_carona()` continua
   sendo chamado: quem repõe o atalho é a carona, não a frase.
3. **A recusa fica — só na página em que nasceu.** O depósito guarda a
   página; `_recados_para_a_tela` devolve só os da página de agora. Hoje uma
   recusa de 30 s reaparece no cartão do mesmo controle na aba seguinte. A
   recusa é o único aviso de que o clique NÃO valeu; tirá-la é outra decisão,
   e não é desta sprint.
4. **Recusa de gesto que não é de coluna não pousa em cartão.** Rodapé,
   gabinete da 08, cadeado/Reconectar/modo da 01 levam `alvoPadrao` e a
   recusa cobre o cartão de um controle que não tem nada com o gesto. Sem
   ancestral `[data-controle]` no clique, a recusa fica no stderr e no pouso
   do botão (o `voltouDoVoo` já distingue recusa de sucesso). **Meça que o
   pouso de recusa é visível na foto**; se não for, pare e relate.

## §2 — O que NÃO é desta sprint

* A pergunta de confirmação do «Aplicar aos jogos da Steam»
  (`a09_sistema.py`, ramo sem `_confirmado`) ia só por recado de sucesso e
  morre com o item 1. Quem a muda de lugar é a **TELA-CALADA-03**, e **as
  duas entram juntas no `dev`**.
* Frases que os pacotes pintam por `blocos`/`mesa` a cada tique: TELA-CALADA-02
  (Lançadores), TELA-CALADA-03 (Sistema e Conexões) e
  JOGAR-A-FAIXA-QUE-PULA-01 (Jogar).
* As strings `recado` dentro dos pacotes ficam e viram relato no stderr.

## §3 — O que morde

* Teste novo: gesto de sucesso com `recado` → nenhum `.hef-recado` na faixa
  da 01 nem no cartão; a frase sai no stderr (capsys).
* Recusa na 02 com uniq, navega para a 03 (cartão do mesmo controle) → zero
  recado na 03.
* Recusa de gesto sem coluna → nenhum cartão recebe.
* **Mordida:** devolver o `_depositar` do sucesso → reprova; tirar o filtro
  de página → reprova.
* As réguas que cobravam o recado de sucesso mudam de contrato **com data e
  citação**, nunca apagadas em silêncio.
* Piloto `--oculta` na 01, 02 e 05: Aplicar com um jogo da Steam sem o atalho
  → nada escrito na tela. Foto antes e depois.

## §4 — A decisão que caducou

A D-01 (citada na docstring de `_deu_certo_dizendo`) valia para o SUCESSO e
caduca em 13/09/2026 pela palavra dela acima. Nota datada na docstring; a
metade da recusa continua valendo.

## Critério de pronto — por cabo · por BT · no perfil · por controle

| pergunta | resposta |
| --- | --- |
| **por cabo** / **por BT** | não se aplica: é o canal da tela, igual nos dois |
| **no perfil** | nada vai ao disco; a carona continua gravando o atalho da Steam |
| **por controle** | a recusa continua no cartão do controle clicado, e só na aba em que nasceu |
