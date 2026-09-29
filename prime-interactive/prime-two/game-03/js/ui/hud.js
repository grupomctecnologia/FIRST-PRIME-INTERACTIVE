/* =============================================================================
 *  Hud — GAME 03. Compact top bar (mobile-first). Single game.
 *  Scoreboard: score · COINS · lives. Controls: subtitles, repeat, mute, pause,
 *  fullscreen, menu. Vectorial, touch-safe icon chips. Glass background panel.
 * ===========================================================================*/
window.Hud = class {
  constructor(scene, opts = {}) {
    this.scene = scene; this.opts = opts; this.T = window.Theme;
    this.paused = false; this.BAR = 52;
    this.build();
    scene.events.on("shutdown", () => this.destroy());
    scene.events.on("destroy", () => this.destroy());
  }

  build() {
    const scene = this.scene, T = this.T, w = scene.scale.width;
    const bar = scene.add.container(0, 0).setDepth(60); this.bar = bar;
    const g = scene.add.graphics();
    g.fillStyle(0x0a0f24, 0.9); g.fillRect(0, 0, w, this.BAR);
    g.lineStyle(2, T.colors.accent, 0.4); g.lineBetween(0, this.BAR, w, this.BAR);
    bar.add(g);

    if (this.opts.phaseTitle) {
      bar.add(scene.add.text(w / 2, this.BAR / 2, this.opts.phaseTitle, {
        fontFamily: T.font, fontSize: "16px", fontStyle: "bold", color: T.colors.text
      }).setOrigin(0.5).setShadow(0, 1, "rgba(0,0,0,0.6)", 3));
    }

    this.buildStats();
    this.buildControls();
    this.updateScore();

    scene.input.keyboard.on("keydown-P", () => this.togglePause());
    scene.input.keyboard.on("keydown-M", () => this.doMute());
    scene.input.keyboard.on("keydown-L", () => this.toggleSubs());
    scene.input.keyboard.on("keydown-R", () => window.AudioManager.repeatLast());
    scene.input.keyboard.on("keydown-F", () => this.toggleFullscreen());
    scene.input.keyboard.on("keydown-ESC", () => this.goMenu());
  }

  /* Scoreboard: [★] score · [◉] coins · [❤] lives */
  buildStats() {
    const scene = this.scene, T = this.T, y = this.BAR / 2;
    let x = 12;
    const mk = (glyph, color, gap) => {
      this.bar.add(scene.add.text(x, y, glyph, { fontFamily: T.font, fontSize: "15px" }).setOrigin(0, 0.5));
      x += 18;
      const t = scene.add.text(x, y, "", { fontFamily: T.font, fontSize: "15px", fontStyle: "bold", color: color }).setOrigin(0, 0.5);
      t.setShadow(0, 1, "rgba(0,0,0,0.6)", 3); this.bar.add(t); x += gap; return t;
    };
    this.scoreT = mk("★", T.hex(T.colors.accent2), 68);
    this.coinsT = mk("◉", T.hex(0xffd35c), 58);
    this.livesT = mk("❤", T.hex(T.colors.bad), 40);
  }

  buildControls() {
    const scene = this.scene, T = this.T, S = window.GameState;
    const y = this.BAR / 2, r = 19, step = 44;
    let x = scene.scale.width - 26;
    const add = (glyph, cb) => { const b = T.iconButton(scene, x, y, glyph, { radius: r, fontSize: 20, onClick: cb }); this.bar.add(b); x -= step; return b; };
    add("≡", () => this.goMenu());
    this.fsBtn = add("⛶", () => this.toggleFullscreen());
    this.pauseBtn = add("⏸", () => this.togglePause());
    this.muteBtn = add(S.settings.muted ? "🔇" : "🔊", () => this.doMute());
    add("↻", () => window.AudioManager.repeatLast());
    this.subBtn = add(S.settings.subtitles ? "CC" : "cc", () => this.toggleSubs());
  }

  updateScore() {
    const S = window.GameState.session;
    const lives = S.lives === Infinity ? "∞" : S.lives;
    if (this.scoreT) {
      this.scoreT.setText(String(S.score));
      this.coinsT.setText(String(S.coins));
      this.livesT.setText(String(lives));
    }
  }

  toggleSubs() {
    const s = window.GameState.settings;
    s.subtitles = !s.subtitles; window.GameState.save();
    if (this.subBtn.setGlyph) this.subBtn.setGlyph(s.subtitles ? "CC" : "cc");
    if (!s.subtitles) window.SubtitleManager.hide();
    window.AudioManager.sfx("click");
  }
  doMute() {
    const m = window.AudioManager.toggleMute();
    if (this.muteBtn.setGlyph) this.muteBtn.setGlyph(m ? "🔇" : "🔊");
  }
  toggleFullscreen() { if (this.scene.scale.isFullscreen) this.scene.scale.stopFullscreen(); else { try { this.scene.scale.startFullscreen(); } catch (e) {} } }

  togglePause() {
    if (this.paused) return this.resume();
    this.paused = true;
    window.AudioManager.stopNarration();
    const scene = this.scene, T = this.T, w = scene.scale.width, h = scene.scale.height;
    const c = scene.add.container(0, 0).setDepth(95); this.pauseOverlay = c;
    const bg = scene.add.graphics(); bg.fillStyle(0x05070f, 0.85); bg.fillRect(0, 0, w, h); c.add(bg);
    c.add(T.card(scene, w / 2, h / 2, 400, 250, { border: T.colors.accent }));
    c.add(T.title(scene, w / 2, h / 2 - 70, window.S("paused"), 38, T.colors.text));
    c.add(T.button(scene, w / 2, h / 2 - 4, 280, 54, window.S("resume"), { onClick: () => this.resume() }));
    c.add(T.button(scene, w / 2, h / 2 + 62, 280, 54, window.S("backToMenuShort"),
      { secondary: true, textColor: T.colors.text, onClick: () => this.goMenu() }));
    scene.tweens.pauseAll(); if (scene.time) scene.time.paused = true;
    if (this.pauseBtn.setGlyph) this.pauseBtn.setGlyph("▶");
  }
  resume() {
    if (!this.paused) return; this.paused = false;
    if (this.pauseOverlay) { this.pauseOverlay.destroy(); this.pauseOverlay = null; }
    this.scene.tweens.resumeAll(); if (this.scene.time) this.scene.time.paused = false;
    if (this.pauseBtn.setGlyph) this.pauseBtn.setGlyph("⏸");
  }

  goMenu() { window.AudioManager.stopNarration(); window.SubtitleManager.hide(); this.scene.scene.start("MenuScene"); }

  destroy() { if (this.pauseOverlay) { this.pauseOverlay.destroy(); this.pauseOverlay = null; } }
};
