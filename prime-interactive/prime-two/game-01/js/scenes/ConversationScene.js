/* STAGE 4 — CONVERSATION CHALLENGE. Pick the correct reply to continue.
 * Wrong = lose a life + feedback + retry (you must choose correctly to advance). */
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
    this.emma = this.buildCharacter(w * 0.26, 200, "av_emma", this.data.speakerA.name, this.data.speakerA.role, false, "👩");
    this.you = this.buildCharacter(w * 0.74, 200, "av_you", this.data.speakerB.name, this.data.speakerB.role, true, "🧑");
    this.bubbleA = this.buildBubble(w * 0.26, 106, false);
    this.bubbleB = this.buildBubble(w * 0.74, 106, true);
    this.bubbleB.container.setVisible(false);

    this.optionsC = this.add.container(0, 0);
    this.fb = this.add.text(w / 2, 500, "", { fontFamily: this.T.font, fontSize: "19px", fontStyle: "bold", align: "center", wordWrap: { width: w - 140 } }).setOrigin(0.5);
    this.renderStep();
  }

  buildCharacter(x, y, tex, name, role, flip, face) {
    const T = this.T, c = this.add.container(x, y);
    const av = this.add.image(0, 0, tex).setScale(0.6); if (flip) av.setFlipX(true);
    c.add(this.add.ellipse(0, 72, 110, 22, 0x000000, 0.35)); c.add(av);
    // monograma elegante (assinatura premium) em vez de rosto infantil
    const mono = this.add.text(0, -2, (name || "?").charAt(0).toUpperCase(), {
      fontFamily: 'Georgia, "Times New Roman", serif', fontSize: "72px", fontStyle: "bold", color: T.hex(T.colors.accent2)
    }).setOrigin(0.5);
    mono.setShadow(0, 2, "rgba(0,0,0,0.55)", 8, true, true);
    c.add(mono);
    c.add(this.add.text(0, 86, name, { fontFamily: T.font, fontSize: "20px", fontStyle: "bold", color: T.colors.text }).setOrigin(0.5));
    c.add(this.add.text(0, 106, role, { fontFamily: T.font, fontSize: "13px", color: T.colors.textDim }).setOrigin(0.5));
    c.avatar = av;
    this.tweens.add({ targets: av, y: -6, duration: 1800, yoyo: true, repeat: -1, ease: "Sine.inOut" });
    return c;
  }
  talk(ch) { this.tweens.add({ targets: ch.avatar, scale: { from: 0.6, to: 0.66 }, duration: 160, yoyo: true, repeat: 3 }); }

  buildBubble(x, y, flip) {
    const T = this.T, c = this.add.container(x, y);
    const g = this.add.graphics(); const bw = 380, bh = 96;
    g.fillStyle(0x000000, 0.25); g.fillRoundedRect(-bw / 2 + 4, -bh / 2 + 6, bw, bh, 16);
    g.fillStyle(flip ? T.colors.accent2 : 0xffffff, 0.96); g.fillRoundedRect(-bw / 2, -bh / 2, bw, bh, 16);
    g.fillTriangle(flip ? bw / 2 - 60 : -bw / 2 + 60, bh / 2 - 2, flip ? bw / 2 - 20 : -bw / 2 + 20, bh / 2 - 2, flip ? bw / 2 - 40 : -bw / 2 + 40, bh / 2 + 26);
    c.add(g);
    const txt = this.add.text(0, 0, "", { fontFamily: T.font, fontSize: "20px", fontStyle: "bold", color: "#10203a", align: "center", wordWrap: { width: bw - 40 } }).setOrigin(0.5);
    c.add(txt);
    return { container: c, txt };
  }
  setBubble(bubble, text) {
    bubble.txt.setText(text); bubble.container.setVisible(true);
    bubble.container.setScale(0.7); bubble.container.setAlpha(0);
    this.tweens.add({ targets: bubble.container, scale: 1, alpha: 1, duration: 250, ease: "Back.out" });
  }

  renderStep() {
    this.optionsC.removeAll(true);
    this._answered = false;
    this.fb.setText("");
    const T = this.T, w = this.scale.width;
    const s = this.data.steps[this.step];
    this.progressDots(w / 2, 70, this.data.steps.length, this.step);
    this.bubbleB.container.setVisible(false);
    this.setBubble(this.bubbleA, s.line);
    this.talk(this.emma);
    window.SubtitleManager.show(s.line);
    window.AudioManager.speak(s.line, { key: "convA_" + this.step, rate: 0.95 });

    s.options.forEach((opt, i) => {
      const by = 344 + i * 56;
      const b = T.button(this, w / 2, by, 600, 50, opt.text, {
        color: T.colors.panelLight, color2: T.colors.panel, textColor: T.colors.text, fontSize: 20,
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
    this.setBubble(this.bubbleB, opt.text); this.talk(this.you);
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
    this.dots = this.add.container(0, 0);
    for (let i = 0; i < total; i++) { const d = this.add.circle(startX + i * gap, y, 7, i <= active ? T.colors.accent : 0x3a4470); if (i === active) d.setStrokeStyle(3, T.colors.accent2); this.dots.add(d); }
  }
}
window.ConversationScene = ConversationScene;
