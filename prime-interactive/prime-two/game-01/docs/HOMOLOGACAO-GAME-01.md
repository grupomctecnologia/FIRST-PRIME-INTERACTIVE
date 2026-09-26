# Homologação — PRIME TWO · Game 01 (The English Adventure)

**Status:** ✅ APROVADO (visual e funcional) pelo gestor.
**Aprovado por:** Márcio (gestor) · **Data:** 2026-09-26
**Versão aprovada:** Prévia **Versão 10** · commit `09c5573` · tag `homolog-game01-v10`
**Prévia (privada):** https://claude.ai/artifact/MLqpkHCFCHYCZh4D9npcKr

> Jogo educacional isolado (HTML5 + Phaser 3). Conteúdo pedagógico é **DEMO/placeholder**
> (marcado no jogo), a ser substituído pelo conteúdo real do PRIME TWO. Não altera o
> Portal do Professor, VPS, nginx, autenticação, livros/jogos/áudios homologados.

---

## 1. Escopo homologado
- Jogo ÚNICO (sem modos), fluxo: abrir → escolher idioma (🇺🇸 EN / 🇪🇸 ES) → PLAY/JUGAR
  → introdução → 7 etapas → resultado → jogar de novo / voltar ao menu.
- 7 etapas: Intro cinematográfica · Vocabulary · Listening · Conversation · Language
  (montar frase) · Final Mission · Resultado.
- Pontuação, estrelas (até 3★/fase), 3 vidas, retry sem revelar a resposta.
- EN e ES completos e independentes (sem português, sem tradução simultânea).
- Assets oficiais integrados (Packs 01–04): personagens Alex/Emma, fundos de Londres,
  objetos e UI premium (cards de 4 estados). Logo oficial First Prime.

## 2. Testes realizados
**Gestor (dispositivo real):** jogou até o final, reiniciou e voltou ao menu — OK.

**Automatizados (Chromium headless + Playwright):**
- Playthrough completo **EN e ES**, 7 etapas: 1800 pts · 15★ · **0 erros de console**.
- **Duas partidas consecutivas** (Result → Play again → Intro → Começar → fases → Result),
  **mouse e toque** — ambas concluídas, 0 erros.
- Toque validado: seleção de idioma, PLAY/JUGAR, opções de quiz, cards (4 estados).
- Carregamento dos assets por nome de arquivo (packs 01–04) sem erros.

## 3. Problemas encontrados e correções
| Problema | Correção |
|---|---|
| Toque não respondia (modo desafio) | Hit-areas via *interactive Zones* (mouse+toque) |
| Congelamento na transição de cena | `scene.start` imediato (sem depender de camera-fade) |
| Português / textos sobrepostos | 100% no idioma escolhido; legendas dentro do canvas |
| Pack visual reprovado (recortes) | Integração dos **packs oficiais 01–04** (Alex/Emma, Londres, objetos, UI) |
| Círculo "Saturno" atrás do logo | Removido; brilho do logo virou opt-in |
| Faixas pretas (topo/esquerda) | Removido scrim do fundo + `padding` de safe-area do container |
| Balões cobrindo rostos (Conversação) | Balão único centralizado, menor, cauda no falante; rostos livres |
| **Travamento da 2ª partida (botões mortos)** | **Causa: flags de guarda presos na instância reutilizada pelo Phaser (`_begun`, `_advancing`, `_starting`, `_chosen`). Fix: reset no `create()` de cada cena.** Validado (mouse+toque, 2 partidas). |

## 4. Testado × ainda NÃO validado
**Testado:** desktop (Chromium/emulação) e iPhone (gestor, dispositivo real); EN e ES;
7 etapas; pontuação/estrelas/vidas; reinício e volta ao menu; mouse e toque.

**NÃO validado (pendente de teste dedicado):**
- Android real, tablet real e lousa digital.
- Tela cheia em dispositivo real (mesma via de input; correção é de estado, não de área clicável).
- Desempenho em aparelhos de baixo custo.
- **Conteúdo pedagógico real** (o atual é placeholder).
- **Bandeiras realistas** (Pack 06 não entregue) — tela de idioma usa bandeiras vetoriais provisórias.
- **Exports oficiais da marca** light/dark/símbolo (fonte vetorial no Drive).

## 5. Restrições respeitadas
Sem deploy em produção · sem Game 02 · sem alterar portal/VPS/autenticação ·
push da arte proprietária apenas com repositório privado.
