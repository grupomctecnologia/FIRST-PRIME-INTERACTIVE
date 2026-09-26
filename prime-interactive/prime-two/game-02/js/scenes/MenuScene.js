/* Main menu (Game 02) — single game. One big PLAY/JUGAR button in the chosen
 * language. Alex & Emma flank the brand. A small language button returns to the
 * language screen. */
class MenuScene extends Phaser.Scene {
  constructor() { super("MenuScene"); }

  create() {
    const T = window.Theme, w = this.scale.width, h = this.scale.height;
    this._starting = false;   // reset por visita (instância reutilizada pelo Phaser)
    window.SubtitleManager.hide();
    T.scene(this, "home");
    window.GameState.resetSession();

    const unlock = () => { window.AudioManager.unlock(); window.AudioManager.playMusic("menu"); };
    this.input.once("pointerdown", unlock);
    this.input.keyboard.once("keydown", unlock);

    // protagonistas (arte oficial) ladeando a marca
    if (window.Art && window.Art.ready(this)) {
      window.Art.character(this, "alex", "neutral", w * 0.135, h + 8, h * 0.80, { flip: false });
      window.Art.character(this, "emma", "pointing", w * 0.865, h + 8, h * 0.80, { flip: true });
    }

    window.Brand.render(this, w / 2, 72, 214, 112, { onDark: true });
    const pt = this.add.text(w / 2, 156, "PRIME TWO", { fontFamily: T.font, fontSize: "40px", fontStyle: "bold", color: T.colors.text }).setOrigin(0.5);
    pt.setShadow(0, 3, "rgba(0,0,0,0.55)", 12, true, true);
    pt.setLetterSpacing && pt.setLetterSpacing(4);
    const div = this.add.graphics();
    div.fillGradientStyle(T.colors.accent, T.colors.accent2, T.colors.accent2, T.colors.accent, 1);
    div.fillRoundedRect(w / 2 - 130, 182, 260, 3, 2);
    div.setBlendMode(Phaser.BlendModes.ADD);
    this.add.text(w / 2, 200, window.S("subTagline"), { fontFamily: T.font, fontSize: "18px", fontStyle: "bold", color: T.hex(T.colors.accent2) }).setOrigin(0.5).setShadow(0, 2, "rgba(0,0,0,0.85)", 6);
    this.add.text(w / 2, 224, window.S("tagline"), { fontFamily: T.font, fontSize: "13px", color: T.colors.text }).setOrigin(0.5).setShadow(0, 1, "rgba(0,0,0,0.9)", 5);

    // Single PLAY / JUGAR button (usa o botão oficial do Pack 04 quando disponível)
    window.Shop.button(this, w / 2, 300, 320, 82, window.S("play"), { fontSize: 32, onClick: () => this.startGame() });

    // Change-language button (small)
    window.Shop.button(this, w / 2, 402, 260, 48, (window.GameState.settings.lang === "es" ? "🇪🇸 Español" : "🇺🇸 English") + "  ▾", {
      secondary: true, fontSize: 18, textColor: T.colors.text,
      onClick: () => { window.AudioManager.sfx("click"); this.scene.start("LanguageSelectScene"); }
    });

    this.buildSettings(w);
    this.add.text(w / 2, h - 14, window.S("shortcuts"), { fontFamily: T.font, fontSize: "11px", color: T.colors.textDim }).setOrigin(0.5).setShadow(0, 1, "rgba(0,0,0,0.9)", 4);
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
    const y = 482;
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
    const x = w / 2 - 118, y = 504, bw = 60;
    this.volBar.clear();
    this.volBar.fillStyle(0x1e2750, 1); this.volBar.fillRoundedRect(x, y, bw, 5, 3);
    this.volBar.fillStyle(T.colors.accent, 1); this.volBar.fillRoundedRect(x, y, bw * (s.muted ? 0 : s.volume), 5, 3);
  }
}
window.MenuScene = MenuScene;
