/* STEP 5 — SHOPPING DIALOGUE. Conversation with the shop assistant (Emma).
 * Choose the best reply. Wrong = lose a life + feedback; that option is disabled
 * (the correct one is never revealed) and the player keeps trying. */
class DialogueScene extends Phaser.Scene {
  constructor() { super("DialogueScene"); }

  create() {
    this.T = window.Theme;
    this.phaseKey = "Dialogue";
    this.conv = window.PRIME_CONTENT.dialogue;
    this.steps = this.conv.steps;
    this.idx = 0; this._advancing = false;   // reset por partida (instância reutilizada)
    this.cameras.main.fadeIn(280, 5, 7, 20);
    window.SubtitleManager.mount(this);
    this.T.scene(this, "talk");
    if (window.Art && window.Art.ready(this)) {
      window.Art.character(this, "emma", "speaking", this.scale.width * 0.12, this.scale.height + 6, this.scale.height * 0.74, { flip: false, depth: -3 });
    }
    window.AudioManager.playMusic("adventure");
    this.hud = new window.Hud(this, { phaseTitle: window.S("stage") + " 5 · " + window.S("dialogueTitle") });
    this.stage = this.add.container(0, 0);
    this.render();
  }

  render() {
    this.stage.removeAll(true);
    this._done = false;
    const T = this.T, w = this.scale.width;
    const step = this.steps[this.idx];
    this.progressDots(w / 2, 70, this.steps.length, this.idx);

    const who = this.conv.speakerA;
    this.stage.add(this.add.text(w / 2, 104, who.name + " · " + who.role, {
      fontFamily: T.font, fontSize: "15px", fontStyle: "bold", color: T.hex(T.colors.accent2)
    }).setOrigin(0.5).setShadow(0, 1, "rgba(0,0,0,0.85)", 4));

    const bubble = T.card(this, w / 2, 156, 720, 70, { border: T.colors.accent, fill: T.colors.panelLight });
    this.stage.add(bubble);
    this.stage.add(this.add.text(w / 2, 156, step.line, {
      fontFamily: T.font, fontSize: "23px", fontStyle: "bold", color: T.colors.text, align: "center", wordWrap: { width: 680 }
    }).setOrigin(0.5));
    this.stage.add(T.iconButton(this, w / 2 + 330, 156, "🔊", { radius: 20, onClick: () => window.AudioManager.speak(step.line) }));

    this.feedback = this.add.text(w / 2, this.scale.height - 30, "", { fontFamily: T.font, fontSize: "19px", fontStyle: "bold", align: "center", wordWrap: { width: w - 120 } }).setOrigin(0.5);
    this.stage.add(this.feedback);

    const opts = step.options;
    const bw = 640, bh = 52, gap = 12, startY = 236;
    this.optButtons = [];
    opts.forEach((o, i) => {
      const by = startY + i * (bh + gap);
      const b = T.button(this, w / 2, by, bw, bh, o.text, {
        color: T.colors.panelLight, color2: T.colors.panel, textColor: T.colors.text, fontSize: 20,
        onClick: () => this.pick(o, b, step)
      });
      this.optButtons.push(b);
      this.stage.add(b);
    });

    this.time.delayedCall(320, () => window.AudioManager.speak(step.line));
  }

  pick(o, btn, step) {
    if (this._done) return;
    const T = this.T, w = this.scale.width;
    if (o.correct) {
      this._done = true;
      this.optButtons.forEach((b) => b.hit && b.hit.disableInteractive());
      if (btn.recolor) btn.recolor(T.colors.good);
      window.GameState.registerCorrect(this.phaseKey); this.hud.updateScore();
      window.AudioManager.sfx("correct"); T.flashFeedback(this, true);
      this.feedback.setColor(T.hex(T.colors.good)); this.feedback.setText(o.feedback || window.S("correct"));
      window.AudioManager.speak(o.text);
      const last = this.idx >= this.steps.length - 1;
      this.stage.add(T.button(this, w / 2, this.scale.height - 64, 240, 46, last ? window.S("finishStage") : window.S("next"), { fontSize: 20, onClick: () => this.advance() }));
    } else {
      if (btn.recolor) btn.recolor(T.colors.bad); if (btn.hit) btn.hit.disableInteractive(); btn.setAlpha(0.9);
      window.GameState.loseLife(this.phaseKey); this.hud.updateScore();
      window.AudioManager.sfx("wrong"); T.flashFeedback(this, false);
      this.feedback.setColor(T.hex(T.colors.bad)); this.feedback.setText(o.feedback || window.S("tryAgain"));
      if (window.GameState.isGameOver()) { this.time.delayedCall(900, () => this.scene.start("ResultScene", { gameOver: true })); }
    }
  }

  advance() {
    if (this._advancing) return; this._advancing = true;
    this.idx++;
    if (this.idx >= this.steps.length) { window.Flow.completePhase(this, this.phaseKey); return; }
    this._advancing = false;
    this.render();
  }

  progressDots(x, y, total, active) {
    const T = this.T, gap = 26, startX = x - ((total - 1) * gap) / 2;
    for (let i = 0; i < total; i++) {
      const d = this.add.circle(startX + i * gap, y, 7, i <= active ? T.colors.accent : 0x3a4470);
      if (i === active) d.setStrokeStyle(3, T.colors.accent2);
      this.stage.add(d);
    }
  }
}
window.DialogueScene = DialogueScene;
