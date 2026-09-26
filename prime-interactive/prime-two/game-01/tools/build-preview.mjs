/* =============================================================================
 *  build-preview.mjs
 *  Gera  preview/index.html  — um HTML AUTOSSUFICIENTE (Phaser + JS + CSS inline)
 *  usado como PRÉVIA JOGÁVEL (arquivo único, fácil de hospedar/anexar).
 *
 *  Uso:  node tools/build-preview.mjs
 *  O jogo "de produção" continua sendo o index.html multi-arquivo (não muda).
 * ===========================================================================*/
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');   // .../game-01
const OUT_DIR = join(ROOT, 'preview');
const OUT = join(OUT_DIR, 'index.html');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

const scripts = [
  'lib/phaser.min.js',
  'js/data/strings.js', 'js/data/content.en.js', 'js/data/content.es.js', 'js/data/brand-logo.js', 'js/data/brand.js', 'js/data/asset-manifest.js',
  'js/managers/GameState.js', 'js/managers/AudioManager.js', 'js/managers/SubtitleManager.js',
  'js/ui/theme.js', 'js/ui/brand.js', 'js/ui/art.js', 'js/ui/uikit.js', 'js/ui/flags.js', 'js/ui/quiz.js', 'js/ui/hud.js', 'js/ui/flow.js',
  'js/scenes/BootScene.js', 'js/scenes/PreloadScene.js', 'js/scenes/LanguageSelectScene.js', 'js/scenes/MenuScene.js',
  'js/scenes/IntroScene.js', 'js/scenes/VocabularyScene.js', 'js/scenes/ListeningScene.js',
  'js/scenes/ConversationScene.js', 'js/scenes/LanguageScene.js', 'js/scenes/FinalScene.js',
  'js/scenes/ResultScene.js', 'js/config.js', 'js/main.js'
];

const css = read('css/style.css');

/* Prévia single-file: embute os assets (packs 01–04) em base64 (PRIME_ART_DATA),
   já que não há servidor para servir os arquivos no Artifact. */
const manifestSrc = read('js/data/asset-manifest.js');
const PRIME_ASSETS = Function('window', manifestSrc + '; return window.PRIME_ASSETS;')({});
const ext = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg' };
const dataEntries = Object.entries(PRIME_ASSETS).map(([k, rel]) => {
  const buf = readFileSync(join(ROOT, rel));
  const mime = ext[rel.slice(rel.lastIndexOf('.'))] || 'image/webp';
  return `  ${k}: "data:${mime};base64,${buf.toString('base64')}"`;
});
const artData = `\n/* ===== assets embutidos (packs 01–04) ===== */\nwindow.PRIME_ART_DATA = {\n${dataEntries.join(',\n')}\n};\n`;

const bundleJs = artData + scripts.map(p => `\n/* ===== ${p} ===== */\n` + read(p)).join('\n');

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
<meta name="theme-color" content="#0b1026" />
<meta name="description" content="PRIME TWO — The English Adventure · prévia jogável (homologação, conteúdo demonstrativo/placeholder)." />
<title>PRIME TWO Adventure</title>
<style>
${css}
</style>
</head>
<body>
<div id="game-container">
  <div id="rotate-hint" aria-hidden="true">
    <div class="rh-icon">📱↻</div>
    <div class="rh-title">Rotate your device · Gira tu dispositivo</div>
    <div class="rh-text">Play in landscape mode · Juega en modo horizontal</div>
  </div>
  <div id="boot-loader">
    <div class="bl-logo-slot">OFFICIAL LOGO · FIRST PRIME<br><span>awaiting official file — do not recreate</span></div>
    <div class="bl-title">PRIME TWO</div>
    <div class="bl-sub">FIRST PRIME INTERACTIVE</div>
    <div class="bl-spinner"></div>
    <div class="bl-hint">Loading… · Cargando…</div>
  </div>
</div>
<script>
${bundleJs}
</script>
</body>
</html>
`;

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT, html);
console.log('preview escrito:', OUT, '·', (html.length / 1024 / 1024).toFixed(2), 'MB');
