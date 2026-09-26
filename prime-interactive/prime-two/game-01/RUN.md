# PRIME TWO — Game 01 · Como executar

Jogo estático (HTML5 + Phaser 3). **Não requer build nem servidor de aplicação**,
apenas um servidor de arquivos estáticos (por causa do carregamento dos assets).

## Opção A — versão multi-arquivo (desenvolvimento/local)
Na pasta do jogo (`prime-interactive/prime-two/game-01`):

```bash
python3 -m http.server 8000
# abrir no navegador:
#   http://localhost:8000/index.html
```

(ou qualquer servidor estático: `npx serve`, extensão "Live Server" do VS Code, etc.)
Jogar em **paisagem**. Funciona em desktop, tablet e celular (toque e mouse).

## Opção B — prévia de arquivo único (para abrir/compartilhar fácil)
`preview/index.html` é **autossuficiente** (Phaser + código + assets embutidos em base64).
Pode ser aberto direto ou hospedado em qualquer lugar. É a versão publicada na
prévia privada de homologação.

Para regenerar após mudanças:
```bash
node tools/build-preview.mjs
```

## Estrutura
```
game-01/
├── index.html            # entrada (multi-arquivo)
├── css/ js/ lib/         # estilo, código, Phaser
├── assets/v1/            # ASSETS OFICIAIS (packs 01–04)
│   ├── 00-originals/     # PNGs originais dos packs (preservados)
│   ├── 01-characters/    # Alex/Emma (webp, transparente)
│   ├── 02-backgrounds/   # fundos de Londres
│   ├── 03-items/         # objetos
│   ├── 04-ui/            # UI premium (cards 4 estados, botões, ícones)
│   ├── 05-brand/ 07-references/ 08-mapping/
├── preview/index.html    # prévia single-file
├── tools/build-preview.mjs
├── docs/                 # homologação + direção próxima etapa
└── screenshots/
```

## Idiomas
EN e ES completos e independentes. **Sem português no jogo.** O idioma é escolhido
na primeira tela e vale para toda a experiência.

## Observações
- Conteúdo pedagógico atual é **DEMO/placeholder** (marcado no jogo) — substituível
  em `js/data/content.en.js` e `js/data/content.es.js`.
- Sem credenciais ou segredos no projeto. Não conecta a serviços externos.
