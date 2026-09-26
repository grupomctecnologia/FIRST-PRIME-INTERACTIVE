/* =============================================================================
 *  Brand — renderiza o logotipo OFICIAL da First Prime.
 *  - Se o arquivo oficial estiver configurado em PRIME_BRAND → usa a imagem.
 *  - Senão → mostra um PLACEHOLDER TÉCNICO neutro (sem símbolo inventado)
 *    e a arte final do cabeçalho fica explicitamente EM ESPERA.
 *  NUNCA recria/estiliza a marca.
 * ===========================================================================*/
window.Brand = {
  /* Chamar no preload() das cenas que exibem o logo (carrega só se houver arquivo). */
  preload(scene) {
    const b = window.PRIME_BRAND || {};
    const tryLoad = (key, path) => {
      if (path && !scene.textures.exists(key)) {
        try { scene.load.image(key, path); } catch (e) {}
      }
    };
    tryLoad("brand_logo", b.logo);
    tryLoad("brand_logo_light", b.logoLight);
    tryLoad("brand_logo_dark", b.logoDark);
  },

  hasOfficial(scene) {
    return scene.textures.exists("brand_logo") ||
           scene.textures.exists("brand_logo_light") ||
           scene.textures.exists("brand_logo_dark");
  },

  /* Renderiza o logo (oficial ou placeholder) centralizado em (x,y),
     ajustado para caber em maxW × maxH. onDark=true escolhe a versão clara. */
  render(scene, x, y, maxW, maxH, opts = {}) {
    const T = window.Theme;
    const onDark = opts.onDark !== false; // jogo é tema escuro por padrão
    const c = scene.add.container(x, y);

    // 1) Logo OFICIAL, se disponível
    const key = onDark
      ? (scene.textures.exists("brand_logo_light") ? "brand_logo_light" : "brand_logo")
      : (scene.textures.exists("brand_logo_dark") ? "brand_logo_dark" : "brand_logo");

    if (scene.textures.exists(key)) {
      const img = scene.add.image(0, 0, key);
      const scale = Math.min(maxW / img.width, maxH / img.height);
      img.setScale(scale);
      // subtle premium glow behind the official logo
      if (opts.glow !== false) {
        const gl = scene.add.graphics();
        gl.fillStyle(T.colors.accent2, 0.12);
        gl.fillCircle(0, 0, Math.max(img.displayWidth, img.displayHeight) * 0.62);
        gl.setBlendMode(Phaser.BlendModes.ADD);
        c.add(gl);
      }
      c.add(img);
      c.official = true;
      return c;
    }

    // 2) PLACEHOLDER TÉCNICO (neutro, sem recriar a marca)
    const w = maxW, h = maxH;
    const g = scene.add.graphics();
    g.fillStyle(0x0f1636, 0.55);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, 12);
    // borda tracejada
    g.lineStyle(2, T.colors.accent, 0.6);
    const dash = 12, gap = 8;
    const drawDashed = (x1, y1, x2, y2) => {
      const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
      const steps = Math.floor(len / (dash + gap));
      const ux = dx / len, uy = dy / len;
      for (let i = 0; i < steps; i++) {
        const sx = x1 + (dash + gap) * i * ux, sy = y1 + (dash + gap) * i * uy;
        g.lineBetween(sx, sy, sx + dash * ux, sy + dash * uy);
      }
    };
    drawDashed(-w / 2, -h / 2, w / 2, -h / 2);
    drawDashed(w / 2, -h / 2, w / 2, h / 2);
    drawDashed(w / 2, h / 2, -w / 2, h / 2);
    drawDashed(-w / 2, h / 2, -w / 2, -h / 2);
    c.add(g);

    const t1 = scene.add.text(0, -h * 0.14, "OFFICIAL LOGO · FIRST PRIME", {
      fontFamily: T.font, fontSize: Math.max(13, Math.round(h * 0.16)) + "px",
      fontStyle: "bold", color: T.hex(T.colors.accent), align: "center"
    }).setOrigin(0.5);
    const t2 = scene.add.text(0, h * 0.20, "awaiting official file — do not recreate", {
      fontFamily: T.font, fontSize: Math.max(10, Math.round(h * 0.12)) + "px",
      color: T.colors.textDim, align: "center"
    }).setOrigin(0.5);
    c.add(t1); c.add(t2);
    c.official = false;
    return c;
  }
};
