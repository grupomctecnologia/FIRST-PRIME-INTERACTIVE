/* =============================================================================
 *  Hud — barra de jogo (HUD) e cluster de controles, reutilizável por fase.
 *  Score, estrelas, vidas, modo, título da fase + botões:
 *  legenda, tradução, repetir áudio, volume, mute, pausar, tela cheia, menu.
 * ===========================================================================*/
window.Hud = class {
  constructor(scene, opts = {}) {
    this.scene = scene;
    this.opts = opts;
    this.T = window.Theme;
    this.paused = false;
    this.build();
    scene.events.on("shutdown", () => this.destroy());
    scene.events.on("destroy", () => this.destroy());
  }

  build() {
    const scene = this.scene, T = this.T;
    const w = scene.scale.width;
    const S = window.GameState;
    const bar = scene.add.container(0, 0).setDepth(50);
    this.bar = bar;

    // fundo da barra
    const g = scene.add.graphics();
    g.fillStyle(0x0a0f24, 0.82); g.fillRect(0, 0, w, 64);
    g.lineStyle(2, T.colors.accent, 0.4); g.lineBetween(0, 64, w, 64);
    bar.add(g);

    // badge do modo
    const modeTxt = S.settings.mode === "teacher" ? "👩‍🏫 MODO PROFESSOR" : "🎯 MODO DESAFIO";
    const modeColor = S.settings.mode === "teacher" ? T.colors.accent : T.colors.accent2;
    const badge = scene.add.text(16, 32, modeTxt, {
      fontFamily: T.font, fontSize: "15px", fontStyle: "bold", color: T.hex(modeColor)
    }).setOrigin(0, 0.5);
    bar.add(badge);

    // título da fase (centro)
    if (this.opts.phaseTitle) {
      const t = scene.add.text(w / 2, 20, this.opts.phaseTitle, {
        fontFamily: T.font, fontSize: "18px", fontStyle: "bold", color: T.colors.text
      }).setOrigin(0.5, 0.5);
      bar.add(t);
      if (this.opts.phaseSubtitle) {
        const st = scene.add.text(w / 2, 42, this.opts.phaseSubtitle, {
          fontFamily: T.font, fontSize: "13px", color: T.colors.textDim
        }).setOrigin(0.5, 0.5);
        bar.add(st);
      }
    }

    // pontuação + estrelas + vidas (à direita, acima dos controles)
    this.scoreTxt = scene.add.text(w - 16, 16, "", {
      fontFamily: T.font, fontSize: "16px", fontStyle: "bold", color: T.hex(T.colors.accent2)
    }).setOrigin(1, 0.5);
    bar.add(this.scoreTxt);
    this.updateScore();

    // cluster de controles (segunda linha à direita)
    this.controls = scene.add.container(0, 0).setDepth(50);
    this.buildControls();

    // atalhos de teclado
    scene.input.keyboard.on("keydown-P", () => this.togglePause());
    scene.input.keyboard.on("keydown-M", () => this.doMute());
    scene.input.keyboard.on("keydown-L", () => this.toggleSubs());
    scene.input.keyboard.on("keydown-R", () => window.AudioManager.repeatLast());
    scene.input.keyboard.on("keydown-F", () => this.toggleFullscreen());
  }

  buildControls() {
    const scene = this.scene, T = this.T, S = window.GameState;
    const y = 100; let x = scene.scale.width - 34; const step = 60;
    const add = (glyph, cb, tip) => {
      const b = T.iconButton(scene, x, y, glyph, { radius: 24, onClick: cb });
      b.tip = tip;
      this.controls.add(b);
      x -= step;
      return b;
    };
    // menu
    add("≡", () => this.confirmMenu(), "Menu (Esc)");
    // tela cheia
    this.fsBtn = add("⛶", () => this.toggleFullscreen(), "Tela cheia (F)");
    // pausar
    this.pauseBtn = add("⏸", () => this.togglePause(), "Pausar (P)");
    // mute
    this.muteBtn = add(S.settings.muted ? "🔇" : "🔊", () => this.doMute(), "Mudo (M)");
    // repetir áudio
    add("↻", () => window.AudioManager.repeatLast(), "Repetir áudio (R)");
    // tradução (só faz sentido com legenda)
    this.transBtn = add(S.settings.showTranslation ? "🇧🇷" : "🇺🇸", () => this.toggleTranslation(), "Tradução PT/EN");
    // legenda
    this.subBtn = add(S.settings.subtitles ? "CC" : "cc", () => this.toggleSubs(), "Legendas (L)");
  }

  updateScore() {
    const S = window.GameState.session;
    const set = window.GameState.settings;
    let str = "⭐ " + S.score + " pts   ★ " + window.GameState.totalStars() + "/" + window.GameState.maxStars();
    if (set.mode === "challenge") str += "   ❤ " + (S.lives === Infinity ? "∞" : S.lives);
    this.scoreTxt.setText(str);
  }

  /* ---- ações ------------------------------------------------------------- */
  toggleSubs() {
    const s = window.GameState.settings;
    s.subtitles = !s.subtitles; window.GameState.save();
    this.subBtn.setGlyph(s.subtitles ? "CC" : "cc");
    if (!s.subtitles) window.SubtitleManager.hide();
    window.AudioManager.sfx("click");
  }
  toggleTranslation() {
    const s = window.GameState.settings;
    s.showTranslation = !s.showTranslation; window.GameState.save();
    this.transBtn.setGlyph(s.showTranslation ? "🇧🇷" : "🇺🇸");
    window.SubtitleManager.refresh();
  }
  doMute() {
    const muted = window.AudioManager.toggleMute();
    this.muteBtn.setGlyph(muted ? "🔇" : "🔊");
  }
  toggleFullscreen() {
    if (this.scene.scale.isFullscreen) this.scene.scale.stopFullscreen();
    else this.scene.scale.startFullscreen();
  }

  togglePause() {
    if (this.paused) return this.resume();
    this.paused = true;
    window.AudioManager.stopVoice();
    const scene = this.scene, T = this.T, w = scene.scale.width, h = scene.scale.height;
    const c = scene.add.container(0, 0).setDepth(90);
    this.pauseOverlay = c;
    const bg = scene.add.graphics(); bg.fillStyle(0x05070f, 0.82); bg.fillRect(0, 0, w, h); c.add(bg);
    const card = T.card(scene, w / 2, h / 2, 420, 300, { border: T.colors.accent });
    c.add(card);
    c.add(T.title(scene, w / 2, h / 2 - 90, "PAUSADO", 42, T.colors.text));
    const resume = T.button(scene, w / 2, h / 2 - 10, 300, 58, "▶  Continuar", { onClick: () => this.resume() });
    const menu = T.button(scene, w / 2, h / 2 + 66, 300, 58, "≡  Voltar ao Menu",
      { color: T.colors.panelLight, color2: T.colors.panel, textColor: T.colors.text, onClick: () => this.goMenu() });
    c.add(resume); c.add(menu);
    // pausa a lógica da cena (tweens/timers), mantém render
    scene.tweens.pauseAll(); if (scene.time) scene.time.paused = true;
    this.pauseBtn.setGlyph("▶");
  }
  resume() {
    if (!this.paused) return;
    this.paused = false;
    if (this.pauseOverlay) { this.pauseOverlay.destroy(); this.pauseOverlay = null; }
    this.scene.tweens.resumeAll(); if (this.scene.time) this.scene.time.paused = false;
    this.pauseBtn.setGlyph("⏸");
  }

  confirmMenu() { this.goMenu(); }
  goMenu() {
    window.AudioManager.stopVoice();
    window.SubtitleManager.hide();
    this.scene.scene.start("MenuScene");
  }

  destroy() {
    if (this.pauseOverlay) { this.pauseOverlay.destroy(); this.pauseOverlay = null; }
  }
};
