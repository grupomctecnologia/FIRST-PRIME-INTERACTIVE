# PRIME TWO — Game 02 · London Shopping Mission · Como executar

Jogo estático (HTML5 + Phaser 3). **Não requer build nem servidor de aplicação**,
apenas um servidor de arquivos estáticos (por causa do carregamento dos assets).

## Executar (local)
Na pasta do jogo (`prime-interactive/prime-two/game-02`):

```bash
python3 -m http.server 8000
# abrir no navegador:
#   http://localhost:8000/index.html
```

(ou qualquer servidor estático: `npx serve`, extensão "Live Server" do VS Code, etc.)
Jogar em **paisagem**. Funciona em desktop, tablet e celular (toque e mouse).

## Estrutura
```
game-02/
├── index.html            # entrada
├── css/ js/ lib/         # estilo, código, Phaser
├── assets/               # ASSETS OFICIAIS do London Shopping Mission (packs 01–04)
│   ├── characters/       # Alex/Emma — 4 poses cada (transparente)
│   ├── backgrounds/      # 6 cenários da loja de Londres (1664×936)
│   ├── items/            # 14 itens de compra (transparente)
│   └── interface/        # 12 elementos de UI premium (Pack 04)
├── ASSET-INVENTORY.md    # inventário completo dos 40 assets
└── docs/                 # notas do Game 02
```

## Fluxo do jogo (7 etapas oficiais)
Idioma (🇺🇸 EN / 🇪🇸 ES) → menu → **7 etapas** → Mission Complete.

1. **Mission Briefing** — Alex e Emma apresentam a London Shopping Mission.
2. **Find the Item** — ouvir e **tocar o produto correto** entre opções visuais.
3. **Colour and Size** — identificar produto, **cor** e **tamanho** (small/medium/large).
4. **Prices and Pounds** — preços em libras (£) e cálculos simples.
5. **Shopping Dialogue** — conversa na loja (Can I help you? / I'm looking for a jacket? / Do you have this in blue? / What size? / Can I try it on? / Where is the fitting room? / I'll take it).
6. **Shopping Bag** — **adicionar, ver, conferir e remover** produtos nos slots de inventário.
7. **Checkout Challenge** — conferência (produtos, cores, tamanhos, quantidades, preços, total) + **CONFIRM PURCHASE** → **MISSION COMPLETE!**

Pontuação, **moedas**, estrelas (até 3★/etapa = 18★), 3 vidas, retry sem revelar a resposta.
EN e ES completos e independentes (sem português no jogo). Inglês britânico.
Progresso salvo separadamente do Game 01 (`localStorage: prime2_game02_v1`).

## Idiomas
EN e ES completos e independentes. **Sem português no jogo.** O idioma é escolhido
na primeira tela e vale para toda a experiência.

## Observações
- Conteúdo pedagógico atual é **DEMO/placeholder** (marcado no jogo) — substituível
  em `js/data/content.en.js` e `js/data/content.es.js`.
- Assets carregados **por nome de arquivo** (`js/data/asset-manifest.js`).
- Sem credenciais ou segredos no projeto. Não conecta a serviços externos.
- **Game 01 preservado integralmente** — este jogo é isolado em `game-02/`.
