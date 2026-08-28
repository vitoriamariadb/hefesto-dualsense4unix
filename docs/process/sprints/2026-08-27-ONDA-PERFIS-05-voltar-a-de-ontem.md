---
sprint: ONDA-PERFIS-05
# onda: PERFIS
posse:
  P5:
    - src/hefesto_dualsense4unix/app/actions/profiles_actions.py
cria:
  - docs/process/sprints/2026-08-27-ONDA-PERFIS-05-voltar-a-de-ontem.md
  - tests/unit/test_voltar_a_de_ontem_chega_a_tela.py
bancada: false
depois_de:
  - ONDA-PERFIS-01          # o botão nasce na casca, desligado
  - ONDA-PERFIS-02
  - ONDA-PERFIS-03
  - ONDA-PERFIS-04
nao_toca:
  - src/hefesto_dualsense4unix/profiles/loader.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/cli/
---

# ONDA PERFIS · 05 — "Voltar à de ontem": a cura escrita e nunca ligada

**O defeito em uma frase:** toda gravação de perfil já arquiva a versão
anterior, e **a janela nunca ofereceu desfazer** — quem salva por engano só
recupera pela linha de comando.

É o defeito mais caro desta casa (A-CASA-SABE-E-O-PRODUTO-NÃO-FAZ), e desta vez
as duas metades estão a um `import` de distância.

## O que existe, e quem o chama

| Função | Onde | Chamadores |
|---|---|---|
| `listar_historico(identifier)` | `profiles/loader.py:1224` | `cli/cmd_profile.py:243` |
| `restaurar_do_historico(identifier, carimbo=None)` | `profiles/loader.py:1464` | `cli/cmd_profile.py:282` |
| `_arquivar_versao(slug, bruto)` | `profiles/loader.py:1265` | `save_profile:1374` — roda em **toda** gravação |

O docstring de `restaurar_do_historico` já escreve a frase do botão:

> *"Sem `carimbo`, restaura a MAIS RECENTE — que é a versão de antes da última
> gravação, e portanto a resposta certa para 'desfaça o que a janela acabou de
> fazer com meu perfil'."*

E ela já protege o gesto de si mesmo: *"A versão ATUAL é arquivada antes de ser
substituída — restaurar por engano também tem volta."*

Zero chamadores em `app/`. A tela nunca soube.

## O que entrega

1. **O botão "Voltar à de ontem"**, terceiro da fileira direita
   (`10-perfis.html:623`), com o tooltip do mockup: *"Desfaz um perfil salvo por
   engano: cada gravação já guarda a anterior."*
2. **Ele age sobre o perfil selecionado na lista**, não sobre o que está no
   editor — o editor pode ter texto não salvo, e desfazer no disco é operação
   de arquivo. Depois de restaurar, a lista e o editor releem.
3. **Ele diz de quando é a versão.** `listar_historico` devolve caminhos cujo
   nome é o carimbo ordenável `20260805T031500_123456`
   (`loader.py:1219`) — a tela mostra data e hora em português, não o carimbo.
4. **Sem histórico, o botão fica desligado e explica**, em vez de falhar no
   clique: *"Este perfil ainda não foi salvo por cima de nada."*
   `listar_historico` devolve lista vazia sem exceção (`loader.py:1230`), então
   o estado é legível antes do clique.
5. **Nada de diálogo de confirmação.** O gesto já tem volta por construção
   (o parágrafo acima), e perguntar sobre um desfazer é perguntar duas vezes.

## Como se prova (o teste que morde)

`tests/unit/test_voltar_a_de_ontem_chega_a_tela.py`, com `tmp_path` e sem GTK
vivo:

1. **O portão da casa sabe**: molde de
   `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py` — `restaurar_do_historico`
   tem pelo menos um chamador dentro de `src/hefesto_dualsense4unix/app/`.
   Mordida: apague a chamada e veja reprovar nomeando a função órfã.
2. **Salvar duas vezes e voltar devolve a primeira, byte a byte.** Grave o
   perfil A, grave o perfil B por cima, chame o handler, releia o arquivo e
   compare com os bytes de A. Mordida: troque `restaurar_do_historico` por uma
   reserialização e veja reprovar na comparação de bytes — é o que o docstring
   de `:1464` diz que não pode acontecer.
3. **Sem histórico o botão recusa e diz por quê**, sem exceção. O dublê tem de
   saber recusar: régua que só sabe passar não é régua.
4. **Restaurar por engano tem volta**: restaure, restaure de novo, e o disco
   volta a B. Mordida: apague o arquivamento da versão atual em
   `restaurar_do_historico` e veja reprovar.

## O que é dela decidir

1. **O rótulo.** No mockup é "Voltar à de ontem" (`10-perfis.html:623`), mas a
   versão guardada é a **anterior**, que pode ser de cinco minutos atrás. O
   tooltip diz a verdade; o rótulo é uma figura de linguagem. Fica?
2. **Uma versão ou várias?** `listar_historico` devolve **todas** as guardadas
   e o `_podar_historico` (`loader.py:1254`) já tem teto. O botão volta uma;
   ver a lista inteira seria outra tela.
