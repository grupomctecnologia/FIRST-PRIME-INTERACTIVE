/* =============================================================================
 *  UI (Game 03) — interface components built on Pack 04 (London Underground
 *  Mystery interface elements). Text and numbers are drawn BY CODE over the
 *  official images. Hit-areas always use an interactive Zone (reliable touch on
 *  mobile). If a texture is missing, each component falls back to the vector
 *  drawing in Theme so the game never breaks.
 *
 *  Theme.button()/Theme.iconButton() delegate to UI.button()/UI.icon() when
 *  UI.ready(scene) is true, so the official button art is used everywhere.
 * ===========================================================================*/
window.UI = {
  font: '"Segoe UI", "Trebuchet MS", system-ui, -apple-system, Arial, sans-serif',

  ready(scene) { return scene.textures.exists("art_ui_primary_button"); },
  has(scene, tex) { return scene.textures.exists(tex); },

  _img(scene, x, y, tex, w, h) {
    const im = scene.add.image(x, y, tex).setOrigin(0.5);
    im.setDisplaySize(w, h); return im;
  },

  /* ---- Primary / secondary button ---------------------------------------- */
  button(scene, x, y, w, h, label, opts = {}) {
    const T = window.Theme;
    const c = scene.add.container(x, y); c.width = w; c.height = h;
    const secondary = !!opts.secondary;
    const tex = "art_ui_primary_button";
    let body;

    if (scene.textures.exists(tex)) {
      body = this._img(scene, 0, 0, tex, w, h); c.add(body);
      if (secondary) body.setTint(0x8fa6d8);          // muted tint = secondary
      c.body = body;
    } else {
      // vector fallback (no recursion into Theme.button image path)
      const g = scene.add.graphics(); c.add(g); c.gfx = g;
      const base = secondary ? T.colors.panelLight : 0xffd35c;
      const base2 = secondary ? T.colors.panel : 0xef9f2e;
      const r = Math.min(opts.radius || 16, h / 2);
      g.fillStyle(0x000000, 0.34); g.fillRoundedRect(-w / 2 + 2, -h / 2 + 6, w, h, r);
      g.fillGradientStyle(T._lighten(base, 0.12), T._lighten(base, 0.12), base2, base2, 1);
      g.fillRoundedRect(-w / 2, -h / 2, w, h, r);
      g.lineStyle(1.5, T._darken(base2, 0.2), 0.7); g.strokeRoundedRect(-w / 2, -h / 2, w, h, r);
    }

    const txt = scene.add.text(0, -1, label, {
      fontFamily: this.font, fontSize: (opts.fontSize || 24) + "px", fontStyle: "bold",
      color: opts.textColor || "#ffffff", align: "center", wordWrap: { width: w - 40 }
    }).setOrigin(0.5);
    txt.setShadow(0, 2, "rgba(0,0,0,0.6)", 6); c.add(txt); c.label = txt;

    const hit = scene.add.zone(0, 0, w, h).setOrigin(0.5).setInteractive({ useHandCursor: true });
    c.add(hit); c.hit = hit;
    hit.on("pointerover", () => { if (c.disabled) return; scene.tweens.add({ targets: c, scale: 1.04, duration: 110 }); window.AudioManager.sfx("hover"); });
    hit.on("pointerout", () => scene.tweens.add({ targets: c, scale: 1.0, duration: 110 }));
    hit.on("pointerdown", () => { if (c.disabled) return; scene.tweens.add({ targets: c, scale: 0.97, duration: 70 }); });
    hit.on("pointerup", () => { if (c.disabled) return; scene.tweens.add({ targets: c, scale: 1.0, duration: 90 }); window.AudioManager.sfx("click"); if (opts.onClick) opts.onClick(); });

    c.setEnabled = (en) => { c.disabled = !en; c.setAlpha(en ? 1 : 0.5); if (en) hit.setInteractive({ useHandCursor: true }); else hit.disableInteractive(); };
    c.setLabel = (s) => txt.setText(s);
    return c;
  },

  /* ---- Answer option card (MCQ) with the four Pack-04 feedback states ------
   * neutral -> official button · correct -> green + correct-icon ·
   * wrong -> red + retry-icon (the correct answer is NEVER revealed). */
  optionCard(scene, x, y, w, h, label, opts = {}) {
    const T = window.Theme;
    const c = scene.add.container(x, y); c.width = w; c.height = h;
    const tex = "art_ui_primary_button";
    let body;
    if (scene.textures.exists(tex)) { body = this._img(scene, 0, 0, tex, w, h); body.setTint(0xbcd0ff); c.add(body); }
    else { const g = scene.add.graphics(); g.fillStyle(T.colors.panelLight, 0.95); g.fillRoundedRect(-w / 2, -h / 2, w, h, 14); g.lineStyle(2, T.colors.accent, 0.5); g.strokeRoundedRect(-w / 2, -h / 2, w, h, 14); c.add(g); c.gfx = g; }
    c.body = body;

    const txt = scene.add.text(0, 0, label, {
      fontFamily: this.font, fontSize: (opts.fontSize || 22) + "px", fontStyle: "bold",
      color: "#0c1836", align: "center", wordWrap: { width: w - 40 }
    }).setOrigin(0.5);
    txt.setShadow(0, 1, "rgba(255,255,255,0.3)", 2); c.add(txt); c.label = txt;

    const hit = scene.add.zone(0, 0, w, h).setOrigin(0.5).setInteractive({ useHandCursor: true });
    c.add(hit); c.hit = hit;
    hit.on("pointerover", () => { if (c.locked) return; scene.tweens.add({ targets: c, scale: 1.03, duration: 100 }); window.AudioManager.sfx("hover"); });
    hit.on("pointerout", () => { if (c.locked) return; scene.tweens.add({ targets: c, scale: 1.0, duration: 100 }); });
    hit.on("pointerup", () => { if (c.locked) return; if (opts.onClick) opts.onClick(); });

    c._icon = null;
    c.setState = (state) => {
      if (c._icon) { c._icon.destroy(); c._icon = null; }
      if (state === "correct") {
        if (body) body.setTint(0x7ef0a8);
        else if (c.gfx) {}
        txt.setColor("#0a2a16");
        c._icon = this.iconImg(scene, w / 2 - 22, -h / 2 + 20, 30, "correct");
        if (c._icon) c.add(c._icon);
      } else if (state === "wrong") {
        if (body) body.setTint(0xff9aa6);
        txt.setColor("#3a0d12");
        c._icon = this.iconImg(scene, w / 2 - 22, -h / 2 + 20, 30, "retry");
        if (c._icon) c.add(c._icon);
      } else {
        if (body) body.setTint(0xbcd0ff);
        txt.setColor("#0c1836");
      }
    };
    c.lock = () => { c.locked = true; hit.disableInteractive(); };
    c.unlock = () => { c.locked = false; hit.setInteractive({ useHandCursor: true }); };
    return c;
  },

  /* ---- Icon (check / retry / others). Used by Theme.iconButton too. ------- */
  iconImg(scene, x, y, size, name) {
    const map = { correct: "art_ui_correct_icon", check: "art_ui_correct_icon", retry: "art_ui_retry_icon", wrong: "art_ui_retry_icon" };
    const tex = map[name];
    if (tex && scene.textures.exists(tex)) { const im = scene.add.image(x, y, tex).setOrigin(0.5); im.setDisplaySize(size, size); return im; }
    return null;
  },
  icon(scene, x, y, size, name, opts = {}) {
    const c = scene.add.container(x, y);
    const im = this.iconImg(scene, 0, 0, size, name);
    if (im) c.add(im);
    else c.add(scene.add.text(0, 0, name === "retry" ? "↻" : "✓", { fontFamily: this.font, fontSize: (size * 0.7) + "px", color: window.Theme.hex(window.Theme.colors.accent2) }).setOrigin(0.5));
    if (opts.onClick) {
      const hit = scene.add.zone(0, 0, size, size).setOrigin(0.5).setInteractive({ useHandCursor: true });
      c.add(hit); hit.on("pointerup", () => { window.AudioManager.sfx("click"); opts.onClick(); });
    }
    return c;
  },

  /* ---- Panels ------------------------------------------------------------- */
  panel(scene, x, y, w, h, name) {
    const T = window.Theme;
    const map = { mission: "art_ui_main_mission_panel", route: "art_ui_route_choice_panel", sentence: "art_ui_sentence_assembly_panel", word: "art_ui_word_assembly_slots" };
    const tex = map[name] || map.mission;
    if (scene.textures.exists(tex)) return this._img(scene, x, y, tex, w, h);
    return T.card(scene, x, y, w, h, { border: T.colors.accent2 });
  },

  /* ---- Progress bar (Pack 04) with code-drawn fill ----------------------- */
  progressBar(scene, x, y, w, h) {
    const c = scene.add.container(x, y);
    const tex = "art_ui_progress_bar";
    if (scene.textures.exists(tex)) c.add(this._img(scene, 0, 0, tex, w, h));
    const fill = scene.add.graphics(); c.add(fill); c.fill = fill;
    const pad = h * 0.34, iw = w - pad * 2, ih = h * 0.30;
    c.set = (p) => {
      p = Math.max(0, Math.min(1, p));
      fill.clear();
      fill.fillStyle(0x38e1ff, 0.95);
      fill.fillRoundedRect(-iw / 2, -ih / 2, Math.max(ih, iw * p), ih, ih / 2);
    };
    c.set(0);
    return c;
  },

  /* ---- Timer frame (Pack 04) with code-drawn digits ---------------------- */
  timer(scene, x, y, w, h) {
    const T = window.Theme;
    const c = scene.add.container(x, y);
    const tex = "art_ui_timer_frame";
    if (scene.textures.exists(tex)) c.add(this._img(scene, 0, 0, tex, w, h));
    else { const g = scene.add.graphics(); g.fillStyle(T.colors.panel, 0.9); g.fillRoundedRect(-w / 2, -h / 2, w, h, 14); g.lineStyle(2, T.colors.accent2, 0.7); g.strokeRoundedRect(-w / 2, -h / 2, w, h, 14); c.add(g); }
    const t = scene.add.text(0, 0, "0.0", { fontFamily: this.font, fontSize: Math.round(h * 0.42) + "px", fontStyle: "bold", color: "#ffffff" }).setOrigin(0.5);
    t.setShadow(0, 2, "rgba(0,0,0,0.6)", 6); c.add(t); c.label = t;
    c.set = (secs) => { t.setText(secs.toFixed(1) + "s"); };
    c.setColour = (hex) => t.setColor(hex);
    return c;
  },

  /* ---- Memory card (Pack 04 front/back). Shows word OR item image. -------- */
  memoryCard(scene, x, y, w, h, data, opts = {}) {
    const T = window.Theme;
    const c = scene.add.container(x, y); c.w = w; c.h = h; c.cardData = data; c.faceUp = false; c.matched = false;

    const backTex = "art_ui_memory_card_back", frontTex = "art_ui_memory_card_front";
    const back = scene.textures.exists(backTex) ? this._img(scene, 0, 0, backTex, w, h) : this._vecCard(scene, w, h, T.colors.panel, T.colors.accent);
    c.add(back); c.back = back;

    const face = scene.add.container(0, 0); c.add(face); c.face = face;
    if (scene.textures.exists(frontTex)) { const fb = this._img(scene, 0, 0, frontTex, w, h); face.add(fb); }
    else face.add(this._vecCard(scene, w, h, 0xf3f7ff, T.colors.accent2));

    if (data.type === "image" && window.Art && window.Art.itemExists(scene, data.item)) {
      const im = window.Art.item(scene, data.item, 0, -h * 0.02, h * 0.62, { depth: 0 });
      if (im) { im.setScrollFactor(0); face.add(im); }
    } else {
      const wt = scene.add.text(0, 0, data.word, { fontFamily: this.font, fontSize: Math.round(h * 0.16) + "px", fontStyle: "bold", color: "#f6f9ff", align: "center", wordWrap: { width: w - 16 } }).setOrigin(0.5);
      wt.setShadow(0, 2, "rgba(0,0,0,0.75)", 6); face.add(wt);
    }
    face.setVisible(false);

    const hit = scene.add.zone(0, 0, w, h).setOrigin(0.5).setInteractive({ useHandCursor: true });
    c.add(hit); c.hit = hit;
    hit.on("pointerup", () => { if (opts.onFlip && !c.faceUp && !c.matched) opts.onFlip(c); });

    c.flipUp = () => { if (c.faceUp) return; c.faceUp = true; c.back.setVisible(false); c.face.setVisible(true); scene.tweens.add({ targets: c, scaleX: { from: 0.6, to: 1 }, duration: 160, ease: "Back.out" }); };
    c.flipDown = () => { c.faceUp = false; c.face.setVisible(false); c.back.setVisible(true); };
    c.setMatched = () => { c.matched = true; hit.disableInteractive(); scene.tweens.add({ targets: c, alpha: 0.55, scale: 0.94, duration: 220 }); };
    return c;
  },

  _vecCard(scene, w, h, fill, border) {
    const T = window.Theme, g = scene.add.graphics();
    g.fillStyle(fill, 1); g.fillRoundedRect(-w / 2, -h / 2, w, h, 12);
    g.lineStyle(2, border, 0.8); g.strokeRoundedRect(-w / 2, -h / 2, w, h, 12);
    return g;
  },

  /* ---- Letter tile (Pack 04) with code-drawn glyph ----------------------- */
  letterTile(scene, x, y, size, ch, opts = {}) {
    const T = window.Theme;
    const c = scene.add.container(x, y); c.w = size; c.h = size; c.ch = ch;
    const tex = "art_ui_letter_tile";
    if (scene.textures.exists(tex)) c.add(this._img(scene, 0, 0, tex, size, size));
    else c.add(this._vecCard(scene, size, size, 0xf3f7ff, T.colors.accent2));
    const t = scene.add.text(0, -1, ch, { fontFamily: this.font, fontSize: Math.round(size * 0.5) + "px", fontStyle: "bold", color: "#f6f9ff" }).setOrigin(0.5);
    t.setShadow(0, 2, "rgba(0,0,0,0.8)", 6); c.add(t); c.label = t;
    const hit = scene.add.zone(0, 0, size, size).setOrigin(0.5).setInteractive({ useHandCursor: true });
    c.add(hit); c.hit = hit;
    hit.on("pointerover", () => { if (c.used) return; scene.tweens.add({ targets: c, scale: 1.08, duration: 90 }); });
    hit.on("pointerout", () => { if (c.used) return; scene.tweens.add({ targets: c, scale: 1.0, duration: 90 }); });
    hit.on("pointerup", () => { if (c.used) return; if (opts.onClick) opts.onClick(c); });
    c.setUsed = (u) => { c.used = u; c.setAlpha(u ? 0.28 : 1); if (u) hit.disableInteractive(); else hit.setInteractive({ useHandCursor: true }); };
    return c;
  },

  /* ---- Sentence block (Pack 04) with code-drawn word --------------------- */
  sentenceBlock(scene, x, y, w, h, word, opts = {}) {
    const T = window.Theme;
    const c = scene.add.container(x, y); c.w = w; c.h = h; c.word = word;
    const tex = "art_ui_sentence_block";
    if (scene.textures.exists(tex)) c.add(this._img(scene, 0, 0, tex, w, h));
    else { const g = scene.add.graphics(); g.fillStyle(0xffd35c, 1); g.fillRoundedRect(-w / 2, -h / 2, w, h, h / 2); c.add(g); }
    const t = scene.add.text(0, -1, word, { fontFamily: this.font, fontSize: Math.round(h * 0.42) + "px", fontStyle: "bold", color: "#f6f9ff" }).setOrigin(0.5);
    t.setShadow(0, 2, "rgba(0,0,0,0.8)", 6); c.add(t); c.label = t;
    const hit = scene.add.zone(0, 0, w, h).setOrigin(0.5).setInteractive({ useHandCursor: true });
    c.add(hit); c.hit = hit;
    hit.on("pointerover", () => { if (c.used) return; scene.tweens.add({ targets: c, scale: 1.06, duration: 90 }); });
    hit.on("pointerout", () => { if (c.used) return; scene.tweens.add({ targets: c, scale: 1.0, duration: 90 }); });
    hit.on("pointerup", () => { if (c.used) return; if (opts.onClick) opts.onClick(c); });
    c.setUsed = (u) => { c.used = u; c.setAlpha(u ? 0.28 : 1); if (u) hit.disableInteractive(); else hit.setInteractive({ useHandCursor: true }); };
    return c;
  },

  /* ---- Three-stars frame (Pack 04) with code-lit stars ------------------- */
  starsFrame(scene, x, y, w, h) {
    const T = window.Theme;
    const c = scene.add.container(x, y);
    const tex = "art_ui_three_stars_frame";
    if (scene.textures.exists(tex)) c.add(this._img(scene, 0, 0, tex, w, h));
    const gap = w * 0.26;
    c.spans = [];
    for (let i = 0; i < 3; i++) {
      const s = scene.add.text((i - 1) * gap, -h * 0.04, "★", { fontFamily: this.font, fontSize: Math.round(h * 0.5) + "px", color: "#3a4470" }).setOrigin(0.5);
      c.add(s); c.spans.push(s);
    }
    c.light = (n, withSfx) => {
      c.spans.forEach((s, i) => {
        if (i < n) {
          s.setColor(T.hex(T.colors.accent2)); s.setShadow(0, 0, T.hex(T.colors.accent2), 16, true, true);
          scene.tweens.add({ targets: s, scale: { from: 1.7, to: 1 }, duration: 300, delay: i * 200, ease: "Back.out" });
        }
      });
      if (withSfx) window.AudioManager.sfx("star");
    };
    return c;
  }
};
