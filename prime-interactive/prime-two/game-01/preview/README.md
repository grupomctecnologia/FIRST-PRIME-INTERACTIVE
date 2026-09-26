# preview/ — Prévia jogável (arquivo único)

`index.html` aqui é uma versão **autossuficiente** do jogo (Phaser + todo o JS +
CSS embutidos num só arquivo). Serve para **jogar online sem instalar nada**.

Gerado por: `node tools/build-preview.mjs` (a partir do projeto multi-arquivo).
**Não edite este arquivo à mão** — edite o código-fonte e rode o build de novo.

## Formas de abrir a prévia (sem depender do seu PC)

1. **Claude Artifact (recomendado — link privado, já disponível)**
   Abre no celular e no computador logado na mesma conta claude.ai.
   O link é entregue na conversa do Claude.

2. **GitHub Pages (URL público permanente — opcional)**
   Requer habilitar Pages em Settings → Pages do repositório.
   ⚠️ Pages torna o conteúdo **público**. Só habilite enquanto o conteúdo for
   demonstrativo (placeholder). Antes de adicionar material real do PRIME TWO,
   deixe o repositório **privado** e reavalie.

3. **Local (opcional)**: qualquer servidor estático apontando para `game-01/`
   (`python3 -m http.server` e abrir `index.html`).
