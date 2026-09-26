/* =============================================================================
 *  Theme / UI Kit — sistema visual PREMIUM (nível "console 2026", high-tech).
 *  - Paleta sóbria + acentos ciano/dourado (não infantil, não 8-bit)
 *  - Fundos TEMÁTICOS por fase (cada fase tem identidade visual própria)
 *  - Botões e painéis com vidro (glass), brilho, profundidade e acabamento
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

  hex(n) { return "#" + (n & 0xffffff).toString(16).padStart(6, "0"); },

  font: '"Segoe UI", "Trebuchet MS", system-ui, -apple-system, Arial, sans-serif',

  /* ---- helpers de cor (clarear / escurecer / misturar) --------------------- */
  _lighten(color, f) {
    const c = Phaser.Display.Color.ValueToColor(color);
    return Phaser.Display.Color.GetColor(
      Math.min(255, c.red + (255 - c.red) * f),
      Math.min(255, c.green + (255 - c.green) * f),
      Math.min(255, c.blue + (255 - c.blue) * f));
  },
  _darken(color, f) {
    const c = Phaser.Display.Color.ValueToColor(color);
    return Phaser.Display.Color.GetColor(c.red * (1 - f), c.green * (1 - f), c.blue * (1 - f));
  },
  _mix(a, b, t) {
    const o = Phaser.Display.Color.Interpolate.ColorWithColor(
      Phaser.Display.Color.ValueToColor(a), Phaser.Display.Color.ValueToColor(b), 100, t * 100);
    return Phaser.Display.Color.GetColor(o.r, o.g, o.b);
  },

  /* =========================================================================
   *  DEFINIÇÃO DOS TEMAS — cada fase remete ao seu conteúdo.
   *  key: gradiente (4 cantos) + acento principal + par de acento secundário.
   * =======================================================================*/
  themes: {
    home:     { g: [0x0a0f2e, 0x141a4c, 0x0b2440, 0x122a5a], accent: 0x38e1ff, accent2: 0xffcf5c },
    travel:   { g: [0x0a1030, 0x243a6e, 0x3a2c4e, 0x6b3a4a], accent: 0xffb35c, accent2: 0x9be1ff }, // amanhecer de viagem
    audio:    { g: [0x07132e, 0x0d2a52, 0x102b46, 0x0a3a52], accent: 0x38e1ff, accent2: 0x7cf5d0 }, // ondas sonoras
    dialogue: { g: [0x120a26, 0x2a1440, 0x3a1c3e, 0x4a2440], accent: 0xff8fbf, accent2: 0xffcf5c }, // entardecer/plaza
    tech:     { g: [0x050d20, 0x0a2140, 0x08202f, 0x0c2b3a], accent: 0x33f0c8, accent2: 0x38e1ff }, // digital/grid
    mission:  { g: [0x0a0820, 0x1a1440, 0x102a4a, 0x143a4e], accent: 0x8a7bff, accent2: 0x5ce1ff }  // missão/aurora
  },

  /* Fundo simples com gradiente (telas de carregamento / fallback) */
  background(scene, variant = 0) {
    const { width: w, height: h } = scene.scale;
    const g = scene.add.graphics();
    const top = variant ? this.colors.bgTopAlt : this.colors.bgTop;
    const bot = variant ? this.colors.bgBottomAlt : this.colors.bgBottom;
    g.fillGradientStyle(top, top, bot, bot, 1);
    g.fillRect(0, 0, w, h);
    const glow = scene.add.graphics();
    glow.fillStyle(this.colors.accent, 0.10);
    glow.fillCircle(w * 0.5, -h * 0.15, w * 0.7);
    glow.setBlendMode(Phaser.BlendModes.ADD);
    return g;
  },

  /* =========================================================================
   *  scene(scene, key) — FUNDO TEMÁTICO PREMIUM por fase.
   *  Camadas: gradiente profundo → nebulosa/aurora → estrelas → cenário
   *  específico do tema → brilho de horizonte → partículas → vinheta.
   *  Retorna um container "backdrop" com profundidade -10 (fica atrás de tudo).
   * =======================================================================*/
  /* Opções de botão "pílula dourada" (CTA primário, estilo da referência) */
  goldOpts(extra = {}) {
    return Object.assign({
      color: 0xffd35c, color2: 0xef9f2e, textColor: "#20140a", radius: 999
    }, extra);
  },

  scene(scene, key = "home") {
    // Se a arte cinematográfica (casal + Londres) estiver carregada, usa a foto.
    if (window.Art && window.Art.ready(scene)) { window.Art.background(scene, key); return; }
    const th = this.themes[key] || this.themes.home;
    const { width: w, height: h } = scene.scale;

    // 1) gradiente profundo (4 cantos)
    const g = scene.add.graphics().setDepth(-10);
    g.fillGradientStyle(th.g[0], th.g[1], th.g[2], th.g[3], 1);
    g.fillRect(0, 0, w, h);

    // 2) nebulosa / aurora suave (blobs em ADD)
    const a = scene.add.graphics().setDepth(-9);
    a.fillStyle(th.accent, 0.13); a.fillCircle(w * 0.18, -h * 0.06, w * 0.5);
    a.fillStyle(th.accent2, 0.10); a.fillCircle(w * 0.85, h * 0.04, w * 0.44);
    a.fillStyle(this._lighten(th.accent, 0.4), 0.05); a.fillCircle(w * 0.55, h * 0.5, w * 0.6);
    a.setBlendMode(Phaser.BlendModes.ADD);

    // 3) estrelas / poeira luminosa
    this._stars(scene, w, h, 0.72).setDepth(-9);

    // 4) cenário específico do tema
    (this["_scene_" + key] || this._scene_home).call(this, scene, w, h, th);

    // 5) brilho no horizonte
    const hg = scene.add.graphics().setDepth(-6);
    hg.fillStyle(th.accent, 0.10); hg.fillRect(0, h - 130, w, 130);
    hg.setBlendMode(Phaser.BlendModes.ADD);

    // 6) partículas ambiente
    this.particles(scene, th.accent).setDepth(-5);

    // 7) vinheta (leitura)
    const vg = scene.add.graphics().setDepth(-4);
    vg.fillStyle(0x05070f, 0.42); vg.fillRect(0, h * 0.72, w, h * 0.28);
    vg.fillStyle(0x05070f, 0.28); vg.fillRect(0, 0, w, h * 0.14);
    vg.fillStyle(0x000000, 0.18); vg.fillRect(0, 0, w, 6); vg.fillRect(0, h - 6, w, 6);
    return g;
  },

  /* compat: chamadas antigas a scenic() caem no tema "travel" (aventura/viagem) */
  scenic(scene, opts = {}) {
    return this.scene(scene, (opts && opts.theme) || "travel");
  },

  _stars(scene, w, h, topFrac) {
    const st = scene.add.graphics();
    for (let i = 0; i < 96; i++) {
      const sx = Math.random() * w, sy = Math.random() * h * (topFrac || 0.72);
      st.fillStyle(0xffffff, 0.14 + Math.random() * 0.5);
      st.fillCircle(sx, sy, Math.random() < 0.14 ? 1.8 : 1);
    }
    st.setBlendMode(Phaser.BlendModes.ADD);
    return st;
  },

  /* ---- CENÁRIOS TEMÁTICOS -------------------------------------------------- */

  // HOME: skyline dupla + rota de voo + avião (marca "aventura mundial")
  _scene_home(scene, w, h, th) {
    this._silhouette(scene, w, h, this._darken(th.g[3], 0.35), 0.9, h - 66, 30, 92);
    this._silhouette(scene, w, h, this._mix(th.g[1], th.accent, 0.15), 1.0, h - 46, 22, 120);
    this._route(scene, w, h, th.accent2);
  },

  // TRAVEL (Vocabulary): amanhecer, sol no horizonte, cidade distante, rota + avião
  _scene_travel(scene, w, h, th) {
    const sun = scene.add.graphics().setDepth(-8);
    sun.fillStyle(this._lighten(th.accent, 0.35), 0.18); sun.fillCircle(w * 0.78, h * 0.30, 150);
    sun.fillStyle(this._lighten(th.accent, 0.5), 0.22); sun.fillCircle(w * 0.78, h * 0.30, 90);
    sun.setBlendMode(Phaser.BlendModes.ADD);
    // colinas distantes (viagem por terra)
    this._hills(scene, w, h, this._darken(th.g[2], 0.2), 0.86, h - 40);
    this._silhouette(scene, w, h, this._mix(th.g[1], th.accent, 0.12), 1.0, h - 44, 20, 96);
    this._route(scene, w, h, th.accent2);
  },

  // AUDIO (Listening): anéis sonoros concêntricos + barras de equalizador
  _scene_audio(scene, w, h, th) {
    const rings = scene.add.graphics().setDepth(-8);
    const cx = w * 0.5, cy = h * 0.42;
    for (let i = 1; i <= 6; i++) {
      rings.lineStyle(2, th.accent, 0.16 - i * 0.02 + 0.02);
      rings.strokeCircle(cx, cy, 60 + i * 62);
    }
    rings.setBlendMode(Phaser.BlendModes.ADD);
    // equalizador na base
    const eq = scene.add.graphics().setDepth(-7);
    const bars = 46, bw = w / bars;
    for (let i = 0; i < bars; i++) {
      const bh = 18 + Math.abs(Math.sin(i * 0.7)) * 74 + Math.random() * 20;
      const col = i % 2 ? th.accent : th.accent2;
      eq.fillStyle(col, 0.22);
      eq.fillRoundedRect(i * bw + 3, h - bh - 8, bw - 6, bh, 3);
    }
    eq.setBlendMode(Phaser.BlendModes.ADD);
  },

  // DIALOGUE (Conversation): entardecer quente + luzes de varal (plaza)
  _scene_dialogue(scene, w, h, th) {
    const glow = scene.add.graphics().setDepth(-8);
    glow.fillStyle(this._lighten(th.accent, 0.2), 0.14); glow.fillRect(0, h * 0.4, w, h * 0.6);
    glow.setBlendMode(Phaser.BlendModes.ADD);
    this._silhouette(scene, w, h, this._darken(th.g[2], 0.25), 1.0, h - 40, 26, 110);
    // string lights (luzes penduradas em arco)
    const lg = scene.add.graphics().setDepth(-6);
    const n = 16;
    for (let i = 0; i <= n; i++) {
      const t = i / n, lx = w * 0.06 + t * w * 0.88;
      const ly = 60 + Math.sin(t * Math.PI) * 44;
      lg.lineStyle(1, 0x000000, 0); // (linha do fio omitida para leveza)
      lg.fillStyle(i % 2 ? th.accent2 : this._lighten(th.accent, 0.3), 0.9);
      lg.fillCircle(lx, ly, 3.2);
      lg.fillStyle(i % 2 ? th.accent2 : th.accent, 0.25);
      lg.fillCircle(lx, ly, 8);
    }
    lg.setBlendMode(Phaser.BlendModes.ADD);
  },

  // TECH (Language): grade em perspectiva + nós de circuito (digital)
  _scene_tech(scene, w, h, th) {
    const grid = scene.add.graphics().setDepth(-8);
    grid.lineStyle(1, th.accent, 0.12);
    const horizon = h * 0.42;
    // linhas horizontais (aproximando)
    for (let i = 1; i <= 10; i++) {
      const y = horizon + Math.pow(i / 10, 2) * (h - horizon);
      grid.lineBetween(0, y, w, y);
    }
    // linhas verticais convergindo ao ponto de fuga
    const vp = w * 0.5;
    for (let i = -10; i <= 10; i++) {
      grid.lineBetween(vp + i * (w / 6), h, vp + i * 26, horizon);
    }
    grid.setBlendMode(Phaser.BlendModes.ADD);
    // nós de circuito flutuantes
    const nodes = scene.add.graphics().setDepth(-7);
    for (let i = 0; i < 26; i++) {
      const nx = Math.random() * w, ny = Math.random() * horizon;
      nodes.fillStyle(th.accent2, 0.5); nodes.fillCircle(nx, ny, 2);
      nodes.lineStyle(1, th.accent, 0.14); nodes.strokeCircle(nx, ny, 6 + Math.random() * 8);
    }
    nodes.setBlendMode(Phaser.BlendModes.ADD);
  },

  // MISSION (Final): aurora + picos de montanha + holofotes (clímax/aventura)
  _scene_mission(scene, w, h, th) {
    const beams = scene.add.graphics().setDepth(-8);
    beams.fillStyle(th.accent, 0.10);
    beams.fillTriangle(w * 0.2, h, w * 0.05, 0, w * 0.35, 0);
    beams.fillStyle(th.accent2, 0.08);
    beams.fillTriangle(w * 0.8, h, w * 0.65, 0, w * 0.95, 0);
    beams.setBlendMode(Phaser.BlendModes.ADD);
    // cordilheira (picos)
    const mt = scene.add.graphics().setDepth(-7);
    const draw = (baseY, col, alpha, jag) => {
      mt.fillStyle(col, alpha); mt.beginPath(); mt.moveTo(0, h);
      let x = 0;
      while (x < w) { mt.lineTo(x, baseY - Math.random() * jag); x += 40 + Math.random() * 60; mt.lineTo(x, baseY - Math.random() * jag * 0.4); }
      mt.lineTo(w, h); mt.closePath(); mt.fillPath();
    };
    draw(h - 70, this._darken(th.g[2], 0.3), 0.9, 120);
    draw(h - 40, this._mix(th.g[1], th.accent, 0.12), 1.0, 80);
  },

  _route(scene, w, h, color) {
    const rg = scene.add.graphics().setDepth(-6);
    rg.fillStyle(color, 0.5);
    const steps = 26;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const rx = w * 0.12 + t * w * 0.76;
      const ry = h * 0.30 - Math.sin(t * Math.PI) * h * 0.14;
      rg.fillCircle(rx, ry, 2);
    }
    rg.setBlendMode(Phaser.BlendModes.ADD);
    const dm = scene.add.text(w * 0.12, h * 0.30, "✈", { fontFamily: this.font, fontSize: "22px", color: this.hex(color) }).setOrigin(0.5).setAngle(20).setDepth(-6);
    dm.setShadow(0, 0, this.hex(color), 10, true, true);
  },

  _hills(scene, w, h, color, alpha, baseY) {
    const g = scene.add.graphics().setDepth(-7); g.fillStyle(color, alpha);
    g.beginPath(); g.moveTo(0, h);
    for (let x = 0; x <= w; x += 24) g.lineTo(x, baseY - Math.sin(x * 0.004) * 26 - Math.random() * 8);
    g.lineTo(w, h); g.closePath(); g.fillPath();
    return g;
  },

  _silhouette(scene, w, h, color, alpha, baseY, minH, maxH) {
    const g = scene.add.graphics().setDepth(-7); g.fillStyle(color, alpha);
    let x = -20;
    while (x < w + 40) {
      const bw = Phaser.Math.Between(38, 78), bh = Phaser.Math.Between(minH, maxH);
      g.fillRect(x, baseY - bh, bw, bh + 80);
      g.fillStyle(0xffe9b0, alpha * 0.32);
      for (let wy = baseY - bh + 10; wy < baseY - 6; wy += 16) {
        for (let wx = x + 6; wx < x + bw - 6; wx += 13) if (Math.random() > 0.62) g.fillRect(wx, wy, 5, 7);
      }
      g.fillStyle(color, alpha);
      x += bw + Phaser.Math.Between(4, 14);
    }
    return g;
  },

  ensureParticleTexture(scene) {
    if (scene.textures.exists("t_dot")) return;
    const gr = scene.make.graphics({ x: 0, y: 0, add: false });
    gr.fillStyle(0xffffff, 1); gr.fillCircle(8, 8, 8);
    gr.generateTexture("t_dot", 16, 16); gr.destroy();
  },

  particles(scene, tint) {
    this.ensureParticleTexture(scene);
    const { width: w, height: h } = scene.scale;
    const p = scene.add.particles(0, 0, "t_dot", {
      x: { min: 0, max: w }, y: h + 20, lifespan: 9000,
      speedY: { min: -30, max: -70 }, speedX: { min: -12, max: 12 },
      scale: { start: 0.5, end: 0 }, alpha: { start: 0.5, end: 0 },
      quantity: 1, frequency: 320, tint: tint || this.colors.accent, blendMode: "ADD"
    });
    return p;
  },

  title(scene, x, y, text, size = 54, color) {
    let col = this.colors.text;
    if (typeof color === "number") col = this.hex(color);
    else if (typeof color === "string") col = color;
    const t = scene.add.text(x, y, text, {
      fontFamily: this.font, fontSize: size + "px", fontStyle: "bold", color: col
    }).setOrigin(0.5);
    t.setShadow(0, 4, "rgba(0,0,0,0.5)", 8, true, true);
    t.setLetterSpacing ? t.setLetterSpacing(2) : null;
    return t;
  },

  /* Card em VIDRO (glassmorphism): painel translúcido, borda luminosa,
     realce superior e sombra profunda. */
  card(scene, x, y, w, h, opts = {}) {
    const c = scene.add.container(x, y);
    const g = scene.add.graphics();
    const r = opts.radius || 22;
    const fill = opts.fill != null ? opts.fill : this.colors.panelLight;
    const border = opts.border != null ? opts.border : this.colors.accent;
    // sombra profunda
    g.fillStyle(0x000000, 0.34);
    g.fillRoundedRect(-w / 2 + 4, -h / 2 + 10, w, h, r);
    // vidro (duas camadas para dar densidade)
    g.fillStyle(this._darken(fill, 0.15), opts.alpha != null ? opts.alpha : 0.82);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, r);
    g.fillStyle(this._lighten(fill, 0.06), 0.16);
    g.fillRoundedRect(-w / 2, -h / 2, w, h * 0.5, { tl: r, tr: r, bl: 0, br: 0 });
    // borda luminosa
    g.lineStyle(1.5, border, 0.55);
    g.strokeRoundedRect(-w / 2, -h / 2, w, h, r);
    // filete claro no topo (reflexo)
    g.lineStyle(1, this._lighten(border, 0.5), 0.4);
    g.beginPath(); g.moveTo(-w / 2 + r, -h / 2 + 1); g.lineTo(w / 2 - r, -h / 2 + 1); g.strokePath();
    c.add(g);
    c.bg = g; c.w = w; c.h = h;
    return c;
  },

  /* Botão PREMIUM high-tech: halo externo (glow), corpo com gradiente
     claro→escuro, gloss superior, filete de brilho no topo, borda fina.
     c.body guarda o graphics do corpo (usado por Quiz._recolor). */
  button(scene, x, y, w, h, label, opts = {}) {
    // usa o botão de imagem oficial (Pack 04) quando disponível
    if (window.UI && window.UI.ready(scene)) return window.UI.button(scene, x, y, w, h, label, opts);
    const c = scene.add.container(x, y);
    c.width = w; c.height = h;
    const r = Math.min(opts.radius || 16, h / 2, w / 2);   // clamp p/ pílula
    // cor base do botão (um só tom → gradiente é derivado dele)
    const base = opts.color || this.colors.accent;
    const base2 = opts.color2 != null ? opts.color2 : this._darken(base, 0.32);
    c._base = base; c._base2 = base2;

    // halo externo (glow) em ADD
    const glow = scene.add.graphics();
    c.add(glow); c.glow = glow;
    // corpo
    const g = scene.add.graphics();
    c.add(g); c.body = g;

    const draw = (pressed, hover) => {
      const top = c._base, bot = c._base2;
      glow.clear();
      glow.fillStyle(top, hover ? 0.28 : 0.16);
      glow.fillRoundedRect(-w / 2 - 6, -h / 2 - 4, w + 12, h + 12, r + 6);
      glow.setBlendMode(Phaser.BlendModes.ADD);

      g.clear();
      const oy = pressed ? 2 : 0;
      // sombra de contato
      g.fillStyle(0x000000, 0.38);
      g.fillRoundedRect(-w / 2 + 2, -h / 2 + 7, w, h, r);
      // corpo (gradiente claro em cima → escuro embaixo)
      g.fillGradientStyle(this._lighten(top, hover ? 0.18 : 0.10), this._lighten(top, hover ? 0.18 : 0.10), bot, bot, 1);
      g.fillRoundedRect(-w / 2, -h / 2 + oy, w, h, r);
      // gloss superior
      g.fillStyle(0xffffff, hover ? 0.20 : 0.13);
      g.fillRoundedRect(-w / 2 + 2, -h / 2 + oy + 2, w - 4, h * 0.44, { tl: r, tr: r, bl: 0, br: 0 });
      // filete de brilho no topo
      g.lineStyle(1.5, this._lighten(top, 0.6), hover ? 0.85 : 0.55);
      g.beginPath(); g.moveTo(-w / 2 + r, -h / 2 + oy + 1.5); g.lineTo(w / 2 - r, -h / 2 + oy + 1.5); g.strokePath();
      // borda fina
      g.lineStyle(1.5, this._darken(bot, 0.2), 0.7);
      g.strokeRoundedRect(-w / 2, -h / 2 + oy, w, h, r);
    };
    c._draw = draw;
    // permite recolorir (acerto/erro no quiz) mantendo o mesmo acabamento
    c.recolor = (col, col2) => { c._base = col; c._base2 = col2 != null ? col2 : this._darken(col, 0.32); draw(false, false); };
    draw(false, false);

    const txt = scene.add.text(0, 0, label, {
      fontFamily: this.font, fontSize: (opts.fontSize || 26) + "px", fontStyle: "bold",
      color: opts.textColor || "#08122c", align: "center", wordWrap: { width: w - 30 }
    }).setOrigin(0.5);
    txt.setShadow(0, 1, "rgba(255,255,255,0.28)", 2);
    c.add(txt); c.label = txt;

    c.setSize(w, h);
    const hit = scene.add.zone(0, 0, w, h).setOrigin(0.5).setInteractive({ useHandCursor: true });
    c.add(hit); c.hit = hit;
    hit.on("pointerover", () => { draw(false, true); scene.tweens.add({ targets: c, scale: 1.03, duration: 120 }); window.AudioManager.sfx("hover"); });
    hit.on("pointerout",  () => { draw(false, false); scene.tweens.add({ targets: c, scale: 1.0, duration: 120 }); });
    hit.on("pointerdown", () => { draw(true, true); });
    hit.on("pointerup",   () => { draw(false, true); window.AudioManager.sfx("click"); if (opts.onClick) opts.onClick(); });
    c.setEnabled = (en) => { c.disabled = !en; c.setAlpha(en ? 1 : 0.45); if (en) hit.setInteractive({ useHandCursor: true }); else hit.disableInteractive(); };
    return c;
  },

  /* Botão-ícone em CHIP de vidro (HUD) — hit via Zone (touch-safe) */
  iconButton(scene, x, y, glyph, opts = {}) {
    // ícone de imagem oficial (Pack 04) quando há mapeamento por nome
    if (window.UI && window.UI.ready(scene) && opts.iconName) {
      return window.UI.icon(scene, x, y, (opts.radius || 26) * 1.8, opts.iconName, { onClick: opts.onClick });
    }
    const c = scene.add.container(x, y);
    const rad = opts.radius || 26;
    const border = opts.border || this.colors.accent;
    const g = scene.add.graphics();
    const drawn = (hover) => {
      g.clear();
      g.fillStyle(0x000000, 0.32); g.fillCircle(1, 3, rad);
      g.fillStyle(this._darken(opts.fill || this.colors.panelLight, 0.1), hover ? 0.98 : 0.85); g.fillCircle(0, 0, rad);
      g.fillStyle(0xffffff, hover ? 0.16 : 0.08); g.fillCircle(0, -rad * 0.35, rad * 0.7);
      g.lineStyle(1.5, border, hover ? 0.95 : 0.5); g.strokeCircle(0, 0, rad);
    };
    drawn(false);
    c.add(g);
    const t = scene.add.text(0, 0, glyph, { fontFamily: this.font, fontSize: (opts.fontSize || 24) + "px", color: this.colors.text }).setOrigin(0.5);
    c.add(t); c.glyph = t;
    c.setSize(rad * 2, rad * 2);
    const hitR = Math.max(rad, 22);
    const hit = scene.add.zone(0, 0, hitR * 2, hitR * 2).setOrigin(0.5).setInteractive({ useHandCursor: true });
    c.add(hit); c.hit = hit;
    hit.on("pointerover", () => { drawn(true); window.AudioManager.sfx("hover"); });
    hit.on("pointerout", () => drawn(false));
    hit.on("pointerup", () => { window.AudioManager.sfx("click"); if (opts.onClick) opts.onClick(); });
    c.setGlyph = (gg) => t.setText(gg);
    return c;
  },

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
