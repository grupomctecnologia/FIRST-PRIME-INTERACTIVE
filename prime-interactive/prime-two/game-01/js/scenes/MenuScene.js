/* Menu inicial: seleção de modo, START e configurações/acessibilidade. */
class MenuScene extends Phaser.Scene {
  constructor() { super("MenuScene"); }

  create() {
    const T = window.Theme, w = this.scale.width, h = this.scale.height;
    window.SubtitleManager.hide();
    T.background(this, 1);
    T.particles(this, T.colors.accent);
    window.GameState.resetSession();

    // desbloqueia áudio no primeiro gesto e toca música do menu
    const unlock = () => { window.AudioManager.unlock(); window.AudioManager.playMusic("menu"); };
    this.input.once("pointerdown", unlock);
    this.input.keyboard.once("keydown", unlock);

    // LOGO OFICIAL da First Prime (ou placeholder técnico até receber o arquivo)
    window.Brand.render(this, w / 2, 52, 290, 56, { onDark: true });
    // Nome do PRODUTO (game) — texto, não é o logo da marca
    const pt = this.add.text(w / 2, 118, "PRIME TWO", {
      fontFamily: T.font, fontSize: "60px", fontStyle: "bold", color: T.colors.text
    }).setOrigin(0.5);
    pt.setShadow(0, 5, "rgba(0,0,0,0.55)", 14, true, true);
    const adv = this.add.text(w / 2, 168, "THE ENGLISH ADVENTURE", {
      fontFamily: T.font, fontSize: "26px", fontStyle: "bold", color: T.hex(T.colors.accent2)
    }).setOrigin(0.5);
    adv.setShadow(0, 0, T.hex(T.colors.accent2), 16, true, true);

    // Badge placeholder
    this.add.text(w / 2, 192, "⚠ Conteúdo DEMONSTRATIVO (placeholder) — não é o conteúdo oficial do PRIME TWO", {
      fontFamily: T.font, fontSize: "13px", color: T.colors.textDim
    }).setOrigin(0.5);

    // Cartões de modo
    this.modeCards = {};
    this.buildModeCard("teacher", w / 2 - 235, 330, "👩‍🏫  MODO PROFESSOR",
      ["Legendas sempre visíveis", "Tradução PT-BR", "Repetir áudio · Pausar", "Sem cronômetro · Avanço manual", "Feedback pedagógico"]);
    this.buildModeCard("challenge", w / 2 + 235, 330, "🎯  MODO DESAFIO",
      ["Pontuação e estrelas", "3 vidas / tentativas", "Sequência de fases", "Menos dicas", "Resultado final"]);
    this.refreshModeCards();

    // START
    const start = T.button(this, w / 2, 540, 300, 70, "▶  START", {
      fontSize: 30, onClick: () => {
        window.AudioManager.unlock();
        window.AudioManager.sfx("transition");
        window.GameState.resetSession();
        this.scene.start("IntroScene");
      }
    });

    // Barra de configurações/acessibilidade
    this.buildSettings(w, h);

    // rodapé
    this.add.text(w / 2, h - 16, "Atalhos: L legenda · M mudo · P pausar · R repetir · F tela cheia", {
      fontFamily: T.font, fontSize: "12px", color: T.colors.textDim
    }).setOrigin(0.5);
  }

  buildModeCard(mode, x, y, titleTxt, lines) {
    const T = window.Theme;
    const card = T.card(this, x, y, 430, 250, { border: T.colors.accent });
    card.mode = mode;
    const title = this.add.text(0, -95, titleTxt, {
      fontFamily: T.font, fontSize: "24px", fontStyle: "bold", color: T.colors.text
    }).setOrigin(0.5);
    card.add(title);
    lines.forEach((l, i) => {
      const t = this.add.text(-180, -50 + i * 34, "•  " + l, {
        fontFamily: T.font, fontSize: "17px", color: T.colors.textDim
      }).setOrigin(0, 0.5);
      card.add(t);
    });
    card.bg.setInteractive(new Phaser.Geom.Rectangle(-215, -125, 430, 250), Phaser.Geom.Rectangle.Contains);
    card.bg.on("pointerup", () => {
      window.AudioManager.unlock();
      window.AudioManager.sfx("click");
      window.GameState.setMode(mode);
      this.refreshModeCards();
      if (this.hud) this.hud.updateScore?.();
    });
    this.modeCards[mode] = card;
  }

  refreshModeCards() {
    const T = window.Theme, sel = window.GameState.settings.mode;
    Object.values(this.modeCards).forEach(card => {
      const on = card.mode === sel;
      card.bg.clear();
      const w = card.w, h = card.h, r = 22;
      card.bg.fillStyle(0x000000, 0.28); card.bg.fillRoundedRect(-w / 2 + 4, -h / 2 + 8, w, h, r);
      card.bg.fillStyle(on ? T.colors.panelLight : T.colors.panel, 0.95); card.bg.fillRoundedRect(-w / 2, -h / 2, w, h, r);
      card.bg.lineStyle(on ? 4 : 2, on ? T.colors.accent2 : T.colors.accent, on ? 1 : 0.4);
      card.bg.strokeRoundedRect(-w / 2, -h / 2, w, h, r);
      card.setScale(on ? 1.02 : 0.98);
    });
  }

  buildSettings(w, h) {
    const T = window.Theme;
    const y = 640;
    const cont = this.add.container(0, 0);
    const s = window.GameState.settings;

    const mk = (x, glyph, cb) => T.iconButton(this, x, y, glyph, { radius: 24, onClick: cb });

    // legenda
    this.subToggle = mk(w / 2 - 300, s.subtitles ? "CC" : "cc", () => {
      s.subtitles = !s.subtitles; window.GameState.save(); this.subToggle.setGlyph(s.subtitles ? "CC" : "cc");
    });
    // tradução
    this.trToggle = mk(w / 2 - 240, s.showTranslation ? "🇧🇷" : "🇺🇸", () => {
      s.showTranslation = !s.showTranslation; window.GameState.save(); this.trToggle.setGlyph(s.showTranslation ? "🇧🇷" : "🇺🇸");
    });
    // volume down / up
    mk(w / 2 - 170, "🔉", () => { window.AudioManager.setVolume(s.volume - 0.15); this.drawVol(); });
    mk(w / 2 - 110, "🔊", () => { window.AudioManager.setVolume(s.volume + 0.15); this.drawVol(); });
    // mute
    this.muteToggle = mk(w / 2 - 50, s.muted ? "🔇" : "🔈", () => {
      const m = window.AudioManager.toggleMute(); this.muteToggle.setGlyph(m ? "🔇" : "🔈");
    });
    // fonte grande
    this.fontToggle = mk(w / 2 + 60, "A+", () => {
      s.largeFont = !s.largeFont; window.GameState.save(); window.applyBodyA11y(); window.SubtitleManager.refresh();
      this.fontToggle.glyph.setColor(s.largeFont ? T.hex(T.colors.accent2) : T.colors.text);
    });
    // alto contraste
    this.contrastToggle = mk(w / 2 + 120, "◑", () => {
      s.highContrast = !s.highContrast; window.GameState.save(); window.applyBodyA11y(); window.SubtitleManager.refresh();
      this.contrastToggle.glyph.setColor(s.highContrast ? T.hex(T.colors.accent2) : T.colors.text);
    });
    // tela cheia
    mk(w / 2 + 230, "⛶", () => {
      if (this.scale.isFullscreen) this.scale.stopFullscreen(); else this.scale.startFullscreen();
    });

    // barra de volume
    this.volBar = this.add.graphics();
    this.drawVol();

    // legenda dos ícones
    this.add.text(w / 2 - 300, y + 34, "Legenda", { fontFamily: T.font, fontSize: "11px", color: T.colors.textDim }).setOrigin(0.5);
    this.add.text(w / 2 - 240, y + 34, "Tradução", { fontFamily: T.font, fontSize: "11px", color: T.colors.textDim }).setOrigin(0.5);
    this.add.text(w / 2 - 140, y + 34, "Volume", { fontFamily: T.font, fontSize: "11px", color: T.colors.textDim }).setOrigin(0.5);
    this.add.text(w / 2 - 50, y + 34, "Mudo", { fontFamily: T.font, fontSize: "11px", color: T.colors.textDim }).setOrigin(0.5);
    this.add.text(w / 2 + 90, y + 34, "Acessibilidade", { fontFamily: T.font, fontSize: "11px", color: T.colors.textDim }).setOrigin(0.5);
    this.add.text(w / 2 + 230, y + 34, "Tela cheia", { fontFamily: T.font, fontSize: "11px", color: T.colors.textDim }).setOrigin(0.5);
  }

  drawVol() {
    const T = window.Theme, s = window.GameState.settings;
    const w = this.scale.width, x = w / 2 - 145, y = 668, bw = 70;
    this.volBar.clear();
    this.volBar.fillStyle(0x1e2750, 1); this.volBar.fillRoundedRect(x, y, bw, 6, 3);
    this.volBar.fillStyle(T.colors.accent, 1); this.volBar.fillRoundedRect(x, y, bw * (s.muted ? 0 : s.volume), 6, 3);
  }
}
window.MenuScene = MenuScene;
