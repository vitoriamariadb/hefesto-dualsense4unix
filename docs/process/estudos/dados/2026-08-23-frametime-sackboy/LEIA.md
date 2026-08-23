# Frametime do Sackboy — os dados crus de 23/08/2026

**O que é:** cinco sessões do Sackboy (appid 1599660) gravadas pelo MangoHud
com `log_interval=0` — uma linha **por quadro apresentado**, não amostragem.
**267.465 linhas** no total. São a prova do achado
[ENGASGO-VULKAN-01](../../../sprints/2026-08-23-ENGASGO-VULKAN-01-sessenta-quadros-por-segundo-e-setenta-engasgos-por-minuto.md).

Ficam aqui porque **medição que só existe em `/tmp` não é medição** — uma
auditoria desta mesma madrugada não conseguiu conferir os números por não achar
os arquivos, e concluiu (corretamente, com o que tinha) que eles não eram
sustentáveis.

| arquivo | o que estava valendo |
|---|---|
| `23-55-06` | camada Vulkan da Epic **LIGADA**; tela de título |
| `00-19-21` | sessão curta, morreu ao parar o daemon (738 linhas) |
| `00-26-02` | camada **LIGADA**, jogo em partida |
| `00-39-24` | camada **LIGADA** — a sessão de 28 min que mostra a rampa do p99 |
| `01-15-43` | camada **DESLIGADA** — o A/B, com ela jogando |

## Como ler

Linha 1 e 2 são cabeçalho de máquina; **linha 3 é o cabeçalho das colunas**;
os dados começam na linha 4. `frametime` já vem em **milissegundos** (não
divida por mil — foi o erro da primeira leitura). `elapsed` vem em
**nanossegundos** desde o início da captura.

```python
L = open(caminho).read().splitlines()
cab = L[2].split(",")
i_ft, i_el = cab.index("frametime"), cab.index("elapsed")
for l in L[3:]:
    c = l.split(",")
    segundos, ms = float(c[i_el]) / 1e9, float(c[i_ft])
```

## Duas armadilhas medidas nestes arquivos

1. **As seis colunas de GPU são inúteis nesta máquina** — `gpu_load`,
   `gpu_temp`, `gpu_core_clock`, `gpu_mem_clock`, `gpu_vram_used` e `gpu_power`
   são 100% zeros, e o campo `driver` do cabeçalho vem vazio. Enquanto isso o
   `nvidia-smi` mostrava 51% de uso e 2.600 MiB. Uma conclusão foi construída
   em cima desse zero e teve de ser jogada fora.
2. **Os primeiros ~90 segundos de cada sessão são carga e compilação de
   shader**, com quadros de dezenas de segundos. Descarte-os, ou a mediana
   mente.
