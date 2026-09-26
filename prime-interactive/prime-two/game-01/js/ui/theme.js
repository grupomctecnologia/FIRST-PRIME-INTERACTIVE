/* =============================================================================
 *  Theme / UI Kit — sistema visual PREMIUM compartilhado
 *  Cores, fundos com gradiente, partículas, botões e cards sofisticados.
 * ===========================================================================*/
window.Theme = {
  colors: {
    bgTop: 0x0b1026,
    bgBottom: 0x1b2450,
    bgTopAlt: 0x1a0b2e,
    bgBottomAlt: 0x0b2540,
    panel: 0x141a38,
    panelLight: 0x1e2750,
    accent: 0x38e1ff,     // ciano
    accent2: 0xffcf5c,    // dourado
    accentPink: 0xff6ba9,
    good: 0x4ee39a,
    bad: 0xff5d6c,
    text: "#eef3ff",
    textDim: "#9fb0d8",
    white: 0xffffff
  },

  hex(n) { return "#" + n.toString(16).padStart(6, "0"); },

  font: '"Segoe UI", "Trebuchet MS", system-ui, -apple-system, Arial, sans-serif',

  /* Fundo premium com gradiente + vinheta + brilho superior */
  background(scene, variant = 0) {
    const { width: w, height: h } = scene.scale;
    const g = scene.add.graphics();
    const top = variant ? this.colors.bgTopAlt : this.colors.bgTop;
    const bot = variant ? this.colors.bgBottomAlt : this.colors.bgBottom;
    g.fillGradientStyle(top, top, bot, bot, 1);
    g.fillRect(0, 0, w, h);
    // brilho radial superior
    const glow = scene.add.graphics();
    glow.fillStyle(this.colors.accent, 0.10);
    glow.fillCircle(w * 0.5, -h * 0.15, w * 0.7);
    glow.setBlendMode(Phaser.BlendModes.ADD);
    // vinheta inferior
    const vg = scene.add.graphics();
    vg.fillStyle(0x000000, 0.35);
    vg.fillRect(0, h * 0.7, w, h * 0.3);
    return g;
  },

  /* Textura de partícula (uma vez) */
  ensureParticleTexture(scene) {
    if (scene.textures.exists("t_dot")) return;
    const gr = scene.make.graphics({ x: 0, y: 0, add: false });
    gr.fillStyle(0xffffff, 1); gr.fillCircle(8, 8, 8);
    gr.generateTexture("t_dot", 16, 16); gr.destroy();
  },

  /* Partículas flutuantes de fundo (profundidade) */
  particles(scene, tint) {
    this.ensureParticleTexture(scene);
    const { width: w, height: h } = scene.scale;
    const p = scene.add.particles(0, 0, "t_dot", {
      x: { min: 0, max: w },
      y: h + 20,
      lifespan: 9000,
      speedY: { min: -30, max: -70 },
      speedX: { min: -12, max: 12 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.55, end: 0 },
      quantity: 1,
      frequency: 320,
      tint: tint || this.colors.accent,
      blendMode: "ADD"
    });
    p.setDepth(1);
    return p;
  },

  /* Rótulo/título com sombra e tracking forte.
     Aceita cor como número (0xRRGGBB) ou string CSS. */
  title(scene, x, y, text, size = 54, color) {
    let col = this.colors.text;
    if (typeof color === "number") col = this.hex(color);
    else if (typeof color === "string") col = color;
    const t = scene.add.text(x, y, text, {
      fontFamily: this.font, fontSize: size + "px", fontStyle: "bold",
      color: col
    }).setOrigin(0.5);
    t.setShadow(0, 4, "rgba(0,0,0,0.5)", 8, true, true);
    t.setLetterSpacing ? t.setLetterSpacing(2) : null;
    return t;
  },

  /* Card sofisticado: painel arredondado com borda e brilho */
  card(scene, x, y, w, h, opts = {}) {
    const c = scene.add.container(x, y);
    const g = scene.add.graphics();
    const r = opts.radius || 22;
    const fill = opts.fill != null ? opts.fill : this.colors.panel;
    g.fillStyle(0x000000, 0.28);
    g.fillRoundedRect(-w / 2 + 4, -h / 2 + 8, w, h, r);      // sombra
    g.fillStyle(fill, opts.alpha != null ? opts.alpha : 0.92);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, r);
    g.lineStyle(2, opts.border || this.colors.accent, 0.55);
    g.strokeRoundedRect(-w / 2, -h / 2, w, h, r);
    // realce superior
    g.fillStyle(0xffffff, 0.05);
    g.fillRoundedRect(-w / 2, -h / 2, w, h * 0.4, { tl: r, tr: r, bl: 0, br: 0 });
    c.add(g);
    c.bg = g; c.w = w; c.h = h;
    return c;
  },

  /* Botão premium com gradiente, hover, press, teclado e som */
  button(scene, x, y, w, h, label, opts = {}) {
    const c = scene.add.container(x, y);
    c.width = w; c.height = h;
    const r = opts.radius || 16;
    const baseTop = opts.color || this.colors.accent;
    const baseBot = opts.color2 || this.colors.accentPink;
    const g = scene.add.graphics();

    const draw = (pressed, hover) => {
      g.clear();
      const oy = pressed ? 2 : 0;
      g.fillStyle(0x000000, 0.35);
      g.fillRoundedRect(-w / 2 + 3, -h / 2 + 6, w, h, r);
      const a = hover ? 1 : 0.94;
      g.fillGradientStyle(baseTop, baseTop, baseBot, baseBot, a);
      g.fillRoundedRect(-w / 2, -h / 2 + oy, w, h, r);
      g.fillStyle(0xffffff, hover ? 0.22 : 0.14);
      g.fillRoundedRect(-w / 2, -h / 2 + oy, w, h * 0.42, { tl: r, tr: r, bl: 0, br: 0 });
      g.lineStyle(2, 0xffffff, hover ? 0.5 : 0.22);
      g.strokeRoundedRect(-w / 2, -h / 2 + oy, w, h, r);
    };
    draw(false, false);
    c.add(g);

    const txt = scene.add.text(0, 0, label, {
      fontFamily: this.font, fontSize: (opts.fontSize || 26) + "px", fontStyle: "bold",
      color: opts.textColor || "#0b1026", align: "center",
      wordWrap: { width: w - 30 }
    }).setOrigin(0.5);
    txt.setShadow(0, 1, "rgba(255,255,255,0.3)", 2);
    c.add(txt);
    c.label = txt;

    c.setSize(w, h);
    c.setInteractive(new Phaser.Geom.Rectangle(-w / 2, -h / 2, w, h), Phaser.Geom.Rectangle.Contains);
    c.on("pointerover", () => { draw(false, true); scene.tweens.add({ targets: c, scale: 1.03, duration: 120 }); window.AudioManager.sfx("hover"); });
    c.on("pointerout",  () => { draw(false, false); scene.tweens.add({ targets: c, scale: 1.0, duration: 120 }); });
    c.on("pointerdown", () => { draw(true, true); });
    c.on("pointerup",   () => { draw(false, true); window.AudioManager.sfx("click"); if (opts.onClick) opts.onClick(); });
    c._draw = draw;
    c.setEnabled = (en) => { c.disabled = !en; c.setAlpha(en ? 1 : 0.45); if (en) c.setInteractive(); else c.disableInteractive(); };
    return c;
  },

  /* Botão-ícone circular (HUD) */
  iconButton(scene, x, y, glyph, opts = {}) {
    const c = scene.add.container(x, y);
    const rad = opts.radius || 26;
    const g = scene.add.graphics();
    const drawn = (hover) => {
      g.clear();
      g.fillStyle(0x000000, 0.3); g.fillCircle(2, 3, rad);
      g.fillStyle(opts.fill || this.colors.panelLight, hover ? 1 : 0.9); g.fillCircle(0, 0, rad);
      g.lineStyle(2, opts.border || this.colors.accent, hover ? 0.9 : 0.5); g.strokeCircle(0, 0, rad);
    };
    drawn(false);
    c.add(g);
    const t = scene.add.text(0, 0, glyph, { fontFamily: this.font, fontSize: (opts.fontSize || 24) + "px", color: this.colors.text }).setOrigin(0.5);
    c.add(t); c.glyph = t;
    c.setSize(rad * 2, rad * 2);
    c.setInteractive(new Phaser.Geom.Circle(0, 0, rad), Phaser.Geom.Circle.Contains);
    c.on("pointerover", () => { drawn(true); window.AudioManager.sfx("hover"); });
    c.on("pointerout", () => drawn(false));
    c.on("pointerup", () => { window.AudioManager.sfx("click"); if (opts.onClick) opts.onClick(); });
    c.setGlyph = (gg) => t.setText(gg);
    return c;
  },

  /* Linha de estrelas (preenchidas/vazias) */
  starRow(scene, x, y, filled, total, size = 34) {
    const c = scene.add.container(x, y);
    const gap = size + 8;
    const startX = -((total - 1) * gap) / 2;
    for (let i = 0; i < total; i++) {
      const on = i < filled;
      const s = scene.add.text(startX + i * gap, 0, "★", {
        fontFamily: this.font, fontSize: size + "px",
        color: on ? this.hex(this.colors.accent2) : "#3a4470"
      }).setOrigin(0.5);
      if (on) s.setShadow(0, 0, this.hex(this.colors.accent2), 12, true, true);
      c.add(s);
    }
    return c;
  },

  /* Efeito visual de acerto/erro no centro */
  flashFeedback(scene, ok) {
    const { width: w, height: h } = scene.scale;
    const mark = scene.add.text(w / 2, h / 2, ok ? "✓" : "✕", {
      fontFamily: this.font, fontSize: "160px", fontStyle: "bold",
      color: ok ? this.hex(this.colors.good) : this.hex(this.colors.bad)
    }).setOrigin(0.5).setDepth(60).setAlpha(0);
    mark.setShadow(0, 0, ok ? this.hex(this.colors.good) : this.hex(this.colors.bad), 30, true, true);
    scene.tweens.add({ targets: mark, alpha: 1, scale: { from: 0.4, to: 1.1 }, duration: 220, yoyo: true, hold: 260,
      onComplete: () => mark.destroy() });
    if (ok) this.burst(scene, w / 2, h / 2, this.colors.good);
  },

  burst(scene, x, y, tint) {
    this.ensureParticleTexture(scene);
    const p = scene.add.particles(x, y, "t_dot", {
      speed: { min: 120, max: 320 }, angle: { min: 0, max: 360 },
      scale: { start: 0.7, end: 0 }, lifespan: 700, quantity: 24,
      tint: tint || this.colors.accent2, blendMode: "ADD"
    }).setDepth(61);
    scene.time.delayedCall(200, () => p.stop());
    scene.time.delayedCall(1200, () => p.destroy());
  }
};
