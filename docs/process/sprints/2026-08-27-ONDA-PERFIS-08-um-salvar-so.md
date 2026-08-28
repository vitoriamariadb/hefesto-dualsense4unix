---
sprint: ONDA-PERFIS-08
# onda: PERFIS
posse:
  P8:
    - src/hefesto_dualsense4unix/app/actions/footer_actions.py
    - src/hefesto_dualsense4unix/app/actions/profiles_actions.py
cria:
  - docs/process/sprints/2026-08-27-ONDA-PERFIS-08-um-salvar-so.md
  - tests/unit/test_um_salvar_so_e_ele_mira_o_editor.py
bancada: false
depois_de:
  - ONDA-PERFIS-01          # o "Salvar este perfil" sai lá
  - ONDA-PERFIS-02
  - ONDA-PERFIS-03
  - ONDA-PERFIS-04
  - ONDA-PERFIS-05
  - ONDA-PERFIS-06
  # SÉRIE, por R5: esta sprint divide src/hefesto_dualsense4unix/app/actions/footer_actions.py
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-SISTEMA-05
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/profiles/loader.py
  - src/hefesto_dualsense4unix/daemon/
---

# ONDA PERFIS · 08 — um Salvar só, e ele mira o que está no editor

**O defeito em uma frase:** a mesma janela tem dois botões de salvar que já
miraram **arquivos diferentes no mesmo instante** — e ela mandou tirar um.

## O defeito, escrito pelo próprio código

`footer_actions.py:880-895`, no docstring de `_perfil_que_as_abas_editam`:

> *"com o jogo abrindo, a reconciliação do tique de 2 Hz movia
> `_active_profile_name` sozinha e o diálogo nascia perguntando 'substituir
> sackboy_nativo?' — um nome que ela nunca digitou nem escolheu. Pior: o
> **'Salvar este perfil' da aba Perfis e o 'Salvar Perfil' do rodapé, na MESMA
> janela e no mesmo instante, miravam arquivos diferentes**."*

A cura de 06/08 fez o rodapé mirar `draft.source_name` — a fotografia que o
rascunho carrega. Sobrou o botão do editor (`profiles_actions.py:3321`,
`on_profile_save`), que mira `_alvo_do_salvar`. **Dois donos da mesma pergunta.**

## O que ela decidiu

> *"tira ... e Salvar este Perfil"* — `CORRECOES-DELA.md:63-64`

E o rodapé do mockup (`10-perfis.html:645-651`) mostra o resto da resposta:

> *"Anotado. Clique em **Aplicar** para valer agora — **Salvar Perfil** grava no
> perfil **Mortal Kombat**."*

O recibo **diz o nome do perfil que está no editor**. É a resposta à pergunta
"para onde isso vai?", dada antes do clique em vez de depois.

## O que entrega

1. **`on_profile_save` e o botão saem** (o botão já saiu na ONDA-PERFIS-01;
   aqui sai o handler e o `_alvo_do_salvar` deixa de ser um segundo dono).
2. **O "Salvar Perfil" do rodapé passa a mirar o perfil aberto no editor.**
   A fonte continua sendo `draft.source_name`, e a ONDA-PERFIS-01 já garante
   que abrir um perfil na lista carrega o rascunho — o que muda é que **não há
   mais um segundo caminho** que possa divergir.
3. **O recibo do rodapé nomeia o perfil**, com a frase do mockup. O texto já
   existe em `app/actions/relancar.py:145` (*"Anotado. Clique em 'Aplicar' para
   valer…"*) e ganha a metade que falta.
4. **A divisão de trabalho fica explícita** (D-APLICAR-NAO-SALVA, palavra dela):
   *"Aplicar aplica naquele momento pra aquele perfil mas não salva nada. Eu no
   jogo aberto já noto isso. Aí Salvar Perfil aplica agora E salva."*
   O "Aplicar" é a rede de segurança de quem experimenta com o jogo aberto.
5. **O "Restaurar Default" do rodapé vira "Exportar"** (mesma decisão): o
   rodapé fica `[Aplicar] [Salvar Perfil] [Importar] [Exportar]`, como no
   mockup. Restaurar de fábrica **muda para a aba Sistema** — gesto raro e
   perigoso mora lá. Esta sprint tira do rodapé; **quem o recebe na Sistema é
   a onda daquela aba**, e enquanto ela não fechar o gesto não tem casa.

## Como se prova (o teste que morde)

`tests/unit/test_um_salvar_so_e_ele_mira_o_editor.py`:

1. **Só há um Salvar.** Nenhum handler chamado `on_profile_save` em
   `profiles_actions`, e nenhum `profile_save_button` no glade. Mordida:
   devolva o handler e veja reprovar nomeando os dois donos.
2. **O alvo é o do editor, e não o perfil ativo.** Monte o cenário exato do
   docstring de `footer_actions.py:880`: rascunho com `source_name="MadJack"`,
   `_active_profile_name="sackboy_nativo"` (movido pelo tique de 2 Hz), e exija
   que o rodapé mire `MadJack`. Mordida: troque a fonte de volta para
   `_active_profile_name` e veja reprovar — este é o teste que impede a
   regressão de 06/08 de voltar pela porta dos fundos.
3. **O recibo nomeia o perfil.** A frase do rodapé contém o nome do perfil do
   editor. Mordida: apague o nome da frase e veja reprovar.
4. **Aplicar não grava.** Chame o Aplicar sobre um `tmp_path` e exija que
   **nenhum arquivo mude de mtime**. Mordida: faça o Aplicar chamar
   `save_profile` e veja reprovar. É a D-APLICAR-NAO-SALVA virada em régua.
5. **O dublê sabe recusar**: com o editor vazio, o Salvar recusa com frase de
   gente em vez de gravar um perfil sem nome.

## O que é dela decidir

1. **A prioridade num Salvar pelo rodapé.** `_prioridade_do_save`
   (`footer_actions.py:913-930`) só calcula número para perfil que **não existe
   em disco** — quem já existe herda a do próprio arquivo, e a razão está
   escrita (a catraca de 04/08: 10, 20, 30…). Com um Salvar só, essa regra
   passa a valer para **todo** salvamento da aba Perfis, inclusive o que antes
   passava pelo botão do editor. Confirmar que é o que ela quer.
2. **O "Exportar" exporta o quê** — o perfil do editor, ou a pasta inteira?
   O mockup mostra o botão; a decisão nomeia só a intenção (*"mandar o perfil
   para fora, para alguém usar"*).
