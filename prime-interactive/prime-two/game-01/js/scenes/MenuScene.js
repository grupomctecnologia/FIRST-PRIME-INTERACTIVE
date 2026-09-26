/* Main menu — English UI. Two DIRECT-START mode buttons (one tap starts the
 * game in that mode: fixes the "challenge mode won't open" issue). */
class MenuScene extends Phaser.Scene {
  constructor() { super("MenuScene"); }

  create() {
    const T = window.Theme, w = this.scale.width, h = this.scale.height;
    window.SubtitleManager.hide();
    T.background(this, 1);
    T.particles(this, T.colors.accent);
    window.GameState.resetSession();

    const unlock = () => { window.AudioManager.unlock(); window.AudioManager.playMusic("menu"); };
    this.input.once("pointerdown", unlock);
    this.input.keyboard.once("keydown", unlock);

    // Official First Prime logo (or technical placeholder until the file arrives)
    window.Brand.render(this, w / 2, 40, 250, 50, { onDark: true });

    const pt = this.add.text(w / 2, 90, "PRIME TWO", {
      fontFamily: T.font, fontSize: "48px", fontStyle: "bold", color: T.colors.text
    }).setOrigin(0.5);
    pt.setShadow(0, 4, "rgba(0,0,0,0.55)", 12, true, true);
    const adv = this.add.text(w / 2, 126, "THE ENGLISH ADVENTURE", {
      fontFamily: T.font, fontSize: "22px", fontStyle: "bold", color: T.hex(T.colors.accent2)
    }).setOrigin(0.5);
    adv.setShadow(0, 0, T.hex(T.colors.accent2), 14, true, true);
    this.add.text(w / 2, 152, "⚠ DEMO content (placeholder) — not the official PRIME TWO content", {
      fontFamily: T.font, fontSize: "12px", color: T.colors.textDim
    }).setOrigin(0.5);

    // Two big mode buttons (each starts the game directly on tap)
    this.makeModeButton("teacher", w / 2 - 268, 300, "👩‍🏫  TEACHER MODE", T.colors.accent, 0x6b8bff,
      ["Subtitles always on", "Manual pacing · no timer", "Repeat audio · pause", "Pedagogical feedback"]);
    this.makeModeButton("challenge", w / 2 + 268, 300, "🎯  CHALLENGE MODE", T.colors.accent2, 0xff9f43,
      ["Score & stars", "3 lives / attempts", "Sequence of stages", "Final result"]);

    // Settings / accessibility row (English)
    this.buildSettings(w);

    this.add.text(w / 2, h - 14, "Shortcuts: L subtitles · M mute · P pause · R repeat · F fullscreen", {
      fontFamily: T.font, fontSize: "11px", color: T.colors.textDim
    }).setOrigin(0.5);
  }

  makeModeButton(mode, x, y, title, c1, c2, bullets) {
    const T = window.Theme;
    const cw = 520, ch = 232;
    const c = this.add.container(x, y);
    const g = this.add.graphics();
    const draw = (hover) => {
      g.clear();
      g.fillStyle(0x000000, 0.3); g.fillRoundedRect(-cw / 2 + 4, -ch / 2 + 8, cw, ch, 22);
      g.fillStyle(T.colors.panelLight, hover ? 1 : 0.94); g.fillRoundedRect(-cw / 2, -ch / 2, cw, ch, 22);
      g.lineStyle(hover ? 4 : 3, c1, hover ? 1 : 0.6); g.strokeRoundedRect(-cw / 2, -ch / 2, cw, ch, 22);
      g.fillStyle(0xffffff, 0.05); g.fillRoundedRect(-cw / 2, -ch / 2, cw, ch * 0.4, { tl: 22, tr: 22, bl: 0, br: 0 });
    };
    draw(false);
    c.add(g);
    c.add(this.add.text(0, -ch / 2 + 34, title, { fontFamily: T.font, fontSize: "24px", fontStyle: "bold", color: T.colors.text }).setOrigin(0.5));
    bullets.forEach((b, i) => {
      c.add(this.add.text(-cw / 2 + 40, -ch / 2 + 72 + i * 26, "•  " + b, {
        fontFamily: T.font, fontSize: "16px", color: T.colors.textDim
      }).setOrigin(0, 0.5));
    });
    // START pill
    const pill = this.add.graphics();
    pill.fillGradientStyle(c1, c1, c2, c2, 1); pill.fillRoundedRect(-110, ch / 2 - 52, 220, 40, 20);
    c.add(pill);
    c.add(this.add.text(0, ch / 2 - 32, "▶  START", { fontFamily: T.font, fontSize: "20px", fontStyle: "bold", color: "#06121f" }).setOrigin(0.5));

    // whole card is the touch target — via an interactive ZONE (touch-safe)
    c.setSize(cw, ch);
    const hit = this.add.zone(0, 0, cw, ch).setOrigin(0.5).setInteractive({ useHandCursor: true });
    c.add(hit);
    hit.on("pointerover", () => { draw(true); this.tweens.add({ targets: c, scale: 1.02, duration: 120 }); window.AudioManager.sfx("hover"); });
    hit.on("pointerout", () => { draw(false); this.tweens.add({ targets: c, scale: 1, duration: 120 }); });
    hit.on("pointerup", () => this.startGame(mode));
    return c;
  }

  startGame(mode) {
    if (this._starting) return; this._starting = true;
    window.AudioManager.unlock();
    window.AudioManager.sfx("transition");
    window.GameState.setMode(mode);      // sets mode + resets session (lives=3 for challenge)
    window.GameState.resetSession();
    this.cameras.main.fadeOut(280, 5, 7, 20);
    // robust transition: timer-driven (not dependent on the fade-complete event)
    this.time.delayedCall(300, () => this.scene.start("IntroScene"));
  }

  buildSettings(w) {
    const T = window.Theme, s = window.GameState.settings;
    const y = 486;
    const mk = (x, glyph, cb) => T.iconButton(this, x, y, glyph, { radius: 22, fontSize: 20, onClick: cb });
    const cx = w / 2;
    this.subToggle = mk(cx - 230, s.subtitles ? "CC" : "cc", () => {
      s.subtitles = !s.subtitles; window.GameState.save(); this.subToggle.setGlyph(s.subtitles ? "CC" : "cc");
    });
    mk(cx - 140, "🔉", () => { window.AudioManager.setVolume(s.volume - 0.15); this.drawVol(); });
    mk(cx - 80, "🔊", () => { window.AudioManager.setVolume(s.volume + 0.15); this.drawVol(); });
    this.muteToggle = mk(cx - 10, s.muted ? "🔇" : "🔈", () => {
      const m = window.AudioManager.toggleMute(); this.muteToggle.setGlyph(m ? "🔇" : "🔈");
    });
    this.fontToggle = mk(cx + 90, "A+", () => {
      s.largeFont = !s.largeFont; window.GameState.save(); window.applyBodyA11y();
      this.fontToggle.glyph.setColor(s.largeFont ? T.hex(T.colors.accent2) : T.colors.text);
    });
    this.contrastToggle = mk(cx + 150, "◑", () => {
      s.highContrast = !s.highContrast; window.GameState.save(); window.applyBodyA11y();
      this.contrastToggle.glyph.setColor(s.highContrast ? T.hex(T.colors.accent2) : T.colors.text);
    });
    mk(cx + 230, "⛶", () => { if (this.scale.isFullscreen) this.scale.stopFullscreen(); else { try { this.scale.startFullscreen(); } catch (e) {} } });

    this.volBar = this.add.graphics(); this.drawVol();
    const lbl = (x, t) => this.add.text(x, y + 30, t, { fontFamily: T.font, fontSize: "10px", color: T.colors.textDim }).setOrigin(0.5);
    lbl(cx - 230, "Subtitles"); lbl(cx - 110, "Volume"); lbl(cx - 10, "Mute"); lbl(cx + 120, "Accessibility"); lbl(cx + 230, "Fullscreen");
  }

  drawVol() {
    const T = window.Theme, s = window.GameState.settings, w = this.scale.width;
    const x = w / 2 - 118, y = 508, bw = 60;
    this.volBar.clear();
    this.volBar.fillStyle(0x1e2750, 1); this.volBar.fillRoundedRect(x, y, bw, 5, 3);
    this.volBar.fillStyle(T.colors.accent, 1); this.volBar.fillRoundedRect(x, y, bw * (s.muted ? 0 : s.volume), 5, 3);
  }
}
window.MenuScene = MenuScene;
