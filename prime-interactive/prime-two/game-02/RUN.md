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

## Fluxo do jogo (7 etapas)
Idioma (🇺🇸 EN / 🇪🇸 ES) → menu → intro → **5 fases** → resultado.

1. **Shop Window** (vocabulário) — item na vitrine + frase com hueco, escolher a palavra.
2. **Shopping List** (compreensão auditiva) — ouvir o item e **tocar a imagem correta** na grade.
3. **At the Checkout** (números/dinheiro) — ler etiquetas de preço e responder (total/mais barato/troco).
4. **In the Shop** (conversação) — diálogo com a atendente (Emma), escolher a melhor resposta.
5. **Fill the Cart** (missão final) — tocar cada item da lista na prateleira até completar o carrinho.

Pontuação, **moedas**, estrelas (até 3★/fase), 3 vidas, retry sem revelar a resposta.
EN e ES completos e independentes (sem português no jogo).

## Idiomas
EN e ES completos e independentes. **Sem português no jogo.** O idioma é escolhido
na primeira tela e vale para toda a experiência.

## Observações
- Conteúdo pedagógico atual é **DEMO/placeholder** (marcado no jogo) — substituível
  em `js/data/content.en.js` e `js/data/content.es.js`.
- Assets carregados **por nome de arquivo** (`js/data/asset-manifest.js`).
- Sem credenciais ou segredos no projeto. Não conecta a serviços externos.
- **Game 01 preservado integralmente** — este jogo é isolado em `game-02/`.
