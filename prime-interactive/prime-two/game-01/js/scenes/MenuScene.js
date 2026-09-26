/* Main menu — single game (no modes). One big PLAY/JUGAR button in the chosen
 * language. A small language button returns to the language screen. */
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

    window.Brand.render(this, w / 2, 52, 250, 50, { onDark: true });
    const pt = this.add.text(w / 2, 108, "PRIME TWO", { fontFamily: T.font, fontSize: "48px", fontStyle: "bold", color: T.colors.text }).setOrigin(0.5);
    pt.setShadow(0, 4, "rgba(0,0,0,0.55)", 12, true, true);
    this.add.text(w / 2, 150, window.S("subTagline"), { fontFamily: T.font, fontSize: "20px", fontStyle: "bold", color: T.hex(T.colors.accent2) }).setOrigin(0.5);
    this.add.text(w / 2, 178, window.S("demoNote"), { fontFamily: T.font, fontSize: "12px", color: T.colors.textDim }).setOrigin(0.5);

    // Single PLAY / JUGAR button
    const play = T.button(this, w / 2, 300, 320, 82, window.S("play"), {
      fontSize: 32, onClick: () => this.startGame()
    });

    // Change-language button (small)
    const langBtn = T.button(this, w / 2, 400, 260, 48, (window.GameState.settings.lang === "es" ? "🇪🇸 Español" : "🇺🇸 English") + "  ▾", {
      color: T.colors.panelLight, color2: T.colors.panel, textColor: T.colors.text, fontSize: 18,
      onClick: () => { window.AudioManager.sfx("click"); this.scene.start("LanguageSelectScene"); }
    });

    this.buildSettings(w);
    this.add.text(w / 2, h - 14, window.S("shortcuts"), { fontFamily: T.font, fontSize: "11px", color: T.colors.textDim }).setOrigin(0.5);
  }

  startGame() {
    if (this._starting) return; this._starting = true;
    window.AudioManager.unlock();
    window.AudioManager.sfx("transition");
    window.GameState.resetSession();
    this.scene.start("IntroScene");
  }

  buildSettings(w) {
    const T = window.Theme, s = window.GameState.settings;
    const y = 480;
    const mk = (x, glyph, cb) => T.iconButton(this, x, y, glyph, { radius: 22, fontSize: 20, onClick: cb });
    const cx = w / 2;
    this.subToggle = mk(cx - 230, s.subtitles ? "CC" : "cc", () => {
      s.subtitles = !s.subtitles; window.GameState.save(); this.subToggle.setGlyph(s.subtitles ? "CC" : "cc");
    });
    mk(cx - 140, "🔉", () => { window.AudioManager.setVolume(s.volume - 0.15); this.drawVol(); });
    mk(cx - 80, "🔊", () => { window.AudioManager.setVolume(s.volume + 0.15); this.drawVol(); });
    this.muteToggle = mk(cx - 10, s.muted ? "🔇" : "🔈", () => { const m = window.AudioManager.toggleMute(); this.muteToggle.setGlyph(m ? "🔇" : "🔈"); });
    this.fontToggle = mk(cx + 90, "A+", () => { s.largeFont = !s.largeFont; window.GameState.save(); window.applyBodyA11y(); this.fontToggle.glyph.setColor(s.largeFont ? T.hex(T.colors.accent2) : T.colors.text); });
    this.contrastToggle = mk(cx + 150, "◑", () => { s.highContrast = !s.highContrast; window.GameState.save(); window.applyBodyA11y(); this.contrastToggle.glyph.setColor(s.highContrast ? T.hex(T.colors.accent2) : T.colors.text); });
    mk(cx + 230, "⛶", () => { if (this.scale.isFullscreen) this.scale.stopFullscreen(); else { try { this.scale.startFullscreen(); } catch (e) {} } });

    this.volBar = this.add.graphics(); this.drawVol();
    const lbl = (x, t) => this.add.text(x, y + 30, t, { fontFamily: T.font, fontSize: "10px", color: T.colors.textDim }).setOrigin(0.5);
    lbl(cx - 230, window.S("subtitles")); lbl(cx - 110, window.S("volume")); lbl(cx - 10, window.S("mute")); lbl(cx + 120, window.S("accessibility")); lbl(cx + 230, window.S("fullscreen"));
  }

  drawVol() {
    const T = window.Theme, s = window.GameState.settings, w = this.scale.width;
    const x = w / 2 - 118, y = 502, bw = 60;
    this.volBar.clear();
    this.volBar.fillStyle(0x1e2750, 1); this.volBar.fillRoundedRect(x, y, bw, 5, 3);
    this.volBar.fillStyle(T.colors.accent, 1); this.volBar.fillRoundedRect(x, y, bw * (s.muted ? 0 : s.volume), 5, 3);
  }
}
window.MenuScene = MenuScene;
