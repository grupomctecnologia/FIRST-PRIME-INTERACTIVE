# Notas — PRIME TWO · Game 02 (London Shopping Mission)

**Base:** commit `35a1d8f` (homologação do Game 01). **Branch:** `claude/prime-two-game-02`.
**Isolamento:** todo o Game 02 vive em `prime-interactive/prime-two/game-02/`.
**Game 01 preservado integralmente** — nenhum asset, rota, progresso ou mecânica do Game 01
foi alterado ou reaproveitado como imagem.

## Assets oficiais (40)
4 packs recebidos e organizados em `assets/` (ver `ASSET-INVENTORY.md`):
- Pack 01 — 8 personagens (Alex/Emma, 4 poses cada).
- Pack 02 — 6 cenários da loja de Londres.
- Pack 03 — 14 itens de compra.
- Pack 04 — 12 elementos de interface premium.

Sem placeholders e sem reuso de imagens do Game 01. Os ZIPs originais **não** foram versionados.

## Reuso de engine (código, não assets)
Do Game 01 foram reaproveitados apenas MÓDULOS DE CÓDIGO (motor/UX validados na
homologação), copiados para `game-02/`: Phaser, `AudioManager`, `SubtitleManager`,
`theme.js`, `quiz.js`, `flow.js`, `flags.js`, `brand.js`/`brand-logo.js`, `style.css`.
Novos/adaptados para compras: `asset-manifest.js`, `strings.js`, `content.en/es.js`,
`GameState.js` (fases de compras + **moedas**), `art.js` (cenários/personagens/itens do
Game 02), `shopui.js` (Pack 04), `hud.js` (placar com moedas) e todas as cenas.

## Mecânicas (variadas — conforme direção da próxima etapa)
Evita repetir a mesma atividade só trocando perguntas:
1. **Shop Window** — palavra ↔ imagem do item (múltipla escolha).
2. **Shopping List** — áudio → **tocar a imagem** correta na grade (alvo visual).
3. **At the Checkout** — leitura de preços e **matemática de dinheiro**.
4. **In the Shop** — conversação com a atendente.
5. **Fill the Cart** — mecânica-assinatura: montar o carrinho tocando os itens da lista
   (slots de inventário, sacola e confirmação do Pack 04).

Pontuação + moedas, 3★/fase (0 erros→3, 1→2, senão 1), 3 vidas, retry sem revelar a
resposta, EN/ES independentes.

## Validação automatizada (Chromium headless + Playwright)
- Playthrough completo **EN e ES**, 7 etapas: **1700 pts · 170 moedas · 17/17 corretas ·
  15/15★ · 3 vidas · 0 erros de console**.
- **Erro** testado: resposta errada perde 1 vida (3→2) e permite retry sem revelar a resposta.
- **2ª partida consecutiva** (Result → Play again → Intro → …): OK — os guardas de estado
  (`_advancing`, `_starting`, `_begun`, `_done`) são resetados no `create()` de cada cena
  (mesma correção validada no Game 01).
- Todos os 40 assets carregam por nome de arquivo (200 OK).

## Pendências / substituíveis
- **Conteúdo pedagógico** atual é DEMO/placeholder (marcado no jogo) — substituir em
  `js/data/content.en.js` / `content.es.js` pelo conteúdo real da unidade de compras.
- Áudio de voz usa TTS do navegador (placeholder), como no Game 01.
- Não validado em dispositivo real (Android/iOS/tablet/lousa) — pendente de teste dedicado,
  como no Game 01.
