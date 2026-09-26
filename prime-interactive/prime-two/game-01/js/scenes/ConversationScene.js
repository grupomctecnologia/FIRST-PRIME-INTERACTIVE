/* STAGE 4 — CONVERSATION CHALLENGE. Pick the correct reply to continue.
 * Wrong = lose a life + feedback + retry (you must choose correctly to advance).
 * Layout: balão ÚNICO centralizado no topo (cauda aponta para o falante), os dois
 * rostos sempre livres nas laterais, nada encostando no HUD. */
class ConversationScene extends Phaser.Scene {
  constructor() { super("ConversationScene"); }

  create() {
    this.T = window.Theme;
    this.phaseKey = "Conversation";
    this.data = window.PRIME_CONTENT.conversation;
    this.step = 0;
    this.cameras.main.fadeIn(280, 5, 7, 20);
    window.SubtitleManager.mount(this);
    this.T.scene(this, "dialogue");
    window.AudioManager.playMusic("adventure");
    this.hud = new window.Hud(this, { phaseTitle: window.S("stage") + " 4 · " + window.S("conversationTitle") });

    const w = this.scale.width;
    // protagonistas nas laterais (rostos altos e livres), voltados para o centro
    this.emma = this.buildCharacter(w * 0.15, "av_emma", this.data.speakerA.name, this.data.speakerA.role, false);
    this.you = this.buildCharacter(w * 0.85, "av_you", this.data.speakerB.name, this.data.speakerB.role, true);

    this.bubble = this.buildBubble();          // balão único, centralizado
    this.optionsC = this.add.container(0, 0);
    this.fb = this.add.text(w / 2, 520, "", { fontFamily: this.T.font, fontSize: "18px", fontStyle: "bold", align: "center", wordWrap: { width: w - 160 } }).setOrigin(0.5).setDepth(45);
    this.renderStep();
  }

  buildCharacter(x, tex, name, role, flip) {
    const T = this.T, c = this.add.container(x, 300);
    const artKey = (tex === "av_emma") ? "girl_speak" : "boy_speak";
    let av;
    if (window.Art && window.Art.ready(this)) {
      av = this.add.image(0, 0, "art_char_" + artKey).setOrigin(0.5, 1);
      const H = 200; av.setScale(H / av.height); if (flip) av.setFlipX(true);
      c.add(this.add.ellipse(0, 4, av.displayWidth * 0.62, 16, 0x000000, 0.32));
      c.add(av);
    } else {
      av = this.add.image(0, -100, tex).setScale(0.55).setOrigin(0.5, 0.5); if (flip) av.setFlipX(true);
      c.add(av);
      const mono = this.add.text(0, -100, (name || "?").charAt(0).toUpperCase(), {
        fontFamily: 'Georgia, "Times New Roman", serif', fontSize: "64px", fontStyle: "bold", color: T.hex(T.colors.accent2)
      }).setOrigin(0.5); mono.setShadow(0, 2, "rgba(0,0,0,0.55)", 8, true, true); c.add(mono);
    }
    const nm = this.add.text(0, 18, name, { fontFamily: T.font, fontSize: "18px", fontStyle: "bold", color: T.colors.text }).setOrigin(0.5);
    nm.setShadow(0, 1, "rgba(0,0,0,0.7)", 4); c.add(nm);
    const rl = this.add.text(0, 37, role, { fontFamily: T.font, fontSize: "12px", color: T.colors.textDim }).setOrigin(0.5);
    rl.setShadow(0, 1, "rgba(0,0,0,0.7)", 3); c.add(rl);
    c.avatar = av; c._baseScale = av.scaleY;
    this.tweens.add({ targets: av, y: av.y - 5, duration: 2000, yoyo: true, repeat: -1, ease: "Sine.inOut" });
    return c;
  }
  talk(ch) { const s = ch._baseScale || ch.avatar.scaleY; this.tweens.add({ targets: ch.avatar, scaleX: s * 1.05, scaleY: s * 1.05, duration: 160, yoyo: true, repeat: 3 }); }

  buildBubble() {
    const T = this.T, w = this.scale.width;
    const c = this.add.container(w / 2, 92).setDepth(40);
    c.bw = 540; c.bh = 56; c.r = 14;
    c.bg = this.add.graphics(); c.add(c.bg);
    c.txt = this.add.text(0, 0, "", { fontFamily: T.font, fontSize: "17px", fontStyle: "bold", color: "#10203a", align: "center", wordWrap: { width: c.bw - 34 } }).setOrigin(0.5);
    c.add(c.txt); c.setVisible(false);
    return c;
  }
  drawBubble(side, color) {
    const b = this.bubble, g = b.bg, bw = b.bw, bh = b.bh, r = b.r;
    const tx = side === "left" ? -150 : 150;
    g.clear();
    g.fillStyle(0x000000, 0.28); g.fillRoundedRect(-bw / 2 + 3, -bh / 2 + 5, bw, bh, r);
    g.fillStyle(color, 0.97); g.fillRoundedRect(-bw / 2, -bh / 2, bw, bh, r);
    g.fillTriangle(tx - 15, bh / 2 - 2, tx + 15, bh / 2 - 2, tx + (side === "left" ? -8 : 8), bh / 2 + 18);
  }
  setBubble(text, side, color) {
    const b = this.bubble;
    b.txt.setColor(color === 0xffffff ? "#10203a" : "#20140a");
    this.drawBubble(side, color); b.txt.setText(text);
    b.setVisible(true); b.setScale(0.85); b.setAlpha(0);
    this.tweens.add({ targets: b, scale: 1, alpha: 1, duration: 220, ease: "Back.out" });
  }

  renderStep() {
    this.optionsC.removeAll(true);
    this._answered = false;
    this.fb.setText("");
    const T = this.T, w = this.scale.width;
    const s = this.data.steps[this.step];
    this.progressDots(w / 2, 138, this.data.steps.length, this.step);
    this.setBubble(s.line, "left", 0xffffff);       // Emma fala (cauda à esquerda)
    this.talk(this.emma);
    window.SubtitleManager.show(s.line);
    window.AudioManager.speak(s.line, { key: "convA_" + this.step, rate: 0.95 });

    s.options.forEach((opt, i) => {
      const by = 362 + i * 54;
      const b = T.button(this, w / 2, by, 600, 48, opt.text, {
        color: T.colors.panelLight, color2: T.colors.panel, textColor: T.colors.text, secondary: true, fontSize: 20,
        onClick: () => this.choose(opt, b)
      });
      this.optionsC.add(b);
    });
  }

  choose(opt, btn) {
    if (this._answered) return;
    const T = this.T, w = this.scale.width;
    if (!opt.correct) {
      if (btn.hit) btn.hit.disableInteractive();
      btn.setAlpha(0.6);
      window.AudioManager.sfx("wrong"); T.flashFeedback(this, false);
      window.GameState.loseLife(this.phaseKey); this.hud.updateScore();
      this.fb.setColor(T.hex(T.colors.bad)); this.fb.setText("✕ " + opt.feedback + "   ·   " + window.S("tryAgain"));
      if (window.GameState.isGameOver()) { this.time.delayedCall(1200, () => this.scene.start("ResultScene", { gameOver: true })); }
      return;
    }
    this._answered = true;
    window.AudioManager.sfx("correct"); T.flashFeedback(this, true);
    window.GameState.registerCorrect(this.phaseKey); this.hud.updateScore();
    window.SubtitleManager.hide();
    this.setBubble(opt.text, "right", T.colors.accent2);   // "Você" responde (cauda à direita)
    this.talk(this.you);
    window.AudioManager.speak(opt.text, { pitch: 1.1 });
    this.optionsC.removeAll(true);
    this.fb.setColor(T.hex(T.colors.good)); this.fb.setText("✓ " + opt.feedback);
    const last = this.step >= this.data.steps.length - 1;
    this.optionsC.add(T.button(this, w / 2, 430, 240, 50, last ? window.S("finishStage") : window.S("continueBtn"), { fontSize: 20, onClick: () => this.advance() }));
  }

  advance() {
    if (this._advancing) return; this._advancing = true;
    this.step++; this._answered = false;
    if (this.step >= this.data.steps.length) { window.Flow.completePhase(this, this.phaseKey); return; }
    this._advancing = false;
    this.renderStep();
  }

  progressDots(x, y, total, active) {
    const T = this.T, gap = 26, startX = x - ((total - 1) * gap) / 2;
    if (this.dots) this.dots.destroy();
    this.dots = this.add.container(0, 0).setDepth(41);
    for (let i = 0; i < total; i++) { const d = this.add.circle(startX + i * gap, y, 7, i <= active ? T.colors.accent : 0x3a4470); if (i === active) d.setStrokeStyle(3, T.colors.accent2); this.dots.add(d); }
  }
}
window.ConversationScene = ConversationScene;
