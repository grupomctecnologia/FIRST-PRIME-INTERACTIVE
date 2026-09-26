/* =============================================================================
 *  Hud — compact single-row top bar (mobile-first). Single game (no modes).
 *  Score · stars · lives + icons: subtitle, repeat, mute, pause, fullscreen, menu.
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

    this.scoreTxt = scene.add.text(14, this.BAR / 2, "", {
      fontFamily: T.font, fontSize: "15px", fontStyle: "bold", color: T.hex(T.colors.accent2)
    }).setOrigin(0, 0.5);
    bar.add(this.scoreTxt);

    if (this.opts.phaseTitle) {
      bar.add(scene.add.text(w / 2, this.BAR / 2, this.opts.phaseTitle, {
        fontFamily: T.font, fontSize: "16px", fontStyle: "bold", color: T.colors.text
      }).setOrigin(0.5));
    }

    this.buildControls();
    this.updateScore();

    scene.input.keyboard.on("keydown-P", () => this.togglePause());
    scene.input.keyboard.on("keydown-M", () => this.doMute());
    scene.input.keyboard.on("keydown-L", () => this.toggleSubs());
    scene.input.keyboard.on("keydown-R", () => window.AudioManager.repeatLast());
    scene.input.keyboard.on("keydown-F", () => this.toggleFullscreen());
    scene.input.keyboard.on("keydown-ESC", () => this.goMenu());
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
    this.scoreTxt.setText("★ " + S.score + "   ⭐ " + window.GameState.totalStars() + "/" + window.GameState.maxStars() + "   ❤ " + lives);
  }

  toggleSubs() {
    const s = window.GameState.settings;
    s.subtitles = !s.subtitles; window.GameState.save();
    this.subBtn.setGlyph(s.subtitles ? "CC" : "cc");
    if (!s.subtitles) window.SubtitleManager.hide();
    window.AudioManager.sfx("click");
  }
  doMute() { const m = window.AudioManager.toggleMute(); this.muteBtn.setGlyph(m ? "🔇" : "🔊"); }
  toggleFullscreen() { if (this.scene.scale.isFullscreen) this.scene.scale.stopFullscreen(); else { try { this.scene.scale.startFullscreen(); } catch (e) {} } }

  togglePause() {
    if (this.paused) return this.resume();
    this.paused = true;
    window.AudioManager.stopVoice();
    const scene = this.scene, T = this.T, w = scene.scale.width, h = scene.scale.height;
    const c = scene.add.container(0, 0).setDepth(95); this.pauseOverlay = c;
    const bg = scene.add.graphics(); bg.fillStyle(0x05070f, 0.85); bg.fillRect(0, 0, w, h); c.add(bg);
    c.add(T.card(scene, w / 2, h / 2, 400, 250, { border: T.colors.accent }));
    c.add(T.title(scene, w / 2, h / 2 - 70, window.S("paused"), 38, T.colors.text));
    c.add(T.button(scene, w / 2, h / 2 - 4, 280, 54, window.S("resume"), { onClick: () => this.resume() }));
    c.add(T.button(scene, w / 2, h / 2 + 62, 280, 54, window.S("backToMenuShort"),
      { color: T.colors.panelLight, color2: T.colors.panel, textColor: T.colors.text, onClick: () => this.goMenu() }));
    scene.tweens.pauseAll(); if (scene.time) scene.time.paused = true;
    this.pauseBtn.setGlyph("▶");
  }
  resume() {
    if (!this.paused) return; this.paused = false;
    if (this.pauseOverlay) { this.pauseOverlay.destroy(); this.pauseOverlay = null; }
    this.scene.tweens.resumeAll(); if (this.scene.time) this.scene.time.paused = false;
    this.pauseBtn.setGlyph("⏸");
  }

  goMenu() { window.AudioManager.stopVoice(); window.SubtitleManager.hide(); this.scene.scene.start("MenuScene"); }

  destroy() { if (this.pauseOverlay) { this.pauseOverlay.destroy(); this.pauseOverlay = null; } }
};
