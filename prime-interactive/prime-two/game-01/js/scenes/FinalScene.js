/* STAGE 6 — FINAL MISSION (English). Vocab + listening + comprehension + grammar. */
class FinalScene extends Phaser.Scene {
  constructor() { super("FinalScene"); }

  create() {
    this.T = window.Theme;
    this.phaseKey = "Final";
    this.items = window.PRIME_CONTENT.final.items;
    this.idx = 0;
    this.cameras.main.fadeIn(300, 5, 7, 20);
    window.SubtitleManager.mount(this);
    this.T.background(this, 0);
    this.T.particles(this, this.T.colors.accentPink);
    window.AudioManager.playMusic("adventure");
    this.hud = new window.Hud(this, { phaseTitle: "STAGE 6 · Final Mission" });

    const w = this.scale.width;
    const banner = this.add.text(w / 2, 84, "★  FINAL MISSION  ★", {
      fontFamily: this.T.font, fontSize: "26px", fontStyle: "bold", color: this.T.hex(this.T.colors.accent2)
    }).setOrigin(0.5);
    banner.setShadow(0, 0, this.T.hex(this.T.colors.accent2), 16, true, true);
    this.tweens.add({ targets: banner, scale: { from: 0.96, to: 1.04 }, duration: 1200, yoyo: true, repeat: -1 });

    this.stage = this.add.container(0, 0);
    this.render();
  }

  render() {
    this.stage.removeAll(true);
    const T = this.T, w = this.scale.width;
    const item = this.items[this.idx];
    this.progressDots(w / 2, 116, this.items.length, this.idx);

    const kindLabel = { vocab: "Vocabulary", listening: "Listening", comprehension: "Comprehension", grammar: "Grammar" }[item.kind] || "Mission";
    this.stage.add(this.add.text(w / 2, 142, kindLabel.toUpperCase(), { fontFamily: T.font, fontSize: "13px", color: T.hex(T.colors.accent) }).setOrigin(0.5));

    let qy = 188;
    if (item.kind === "listening") {
      const play = T.button(this, w / 2, 182, 240, 50, "🔊  Play audio", {
        color: T.colors.accent, color2: 0x6b8bff, textColor: "#06121f", onClick: () => { window.SubtitleManager.show(item.subtitle); window.AudioManager.speak(item.audioText, { key: "final_" + this.idx }); }
      });
      this.stage.add(play);
      qy = 240;
      this.time.delayedCall(400, () => { window.SubtitleManager.show(item.subtitle); window.AudioManager.speak(item.audioText, { key: "final_" + this.idx }); });
    }

    this.stage.add(this.add.text(w / 2, qy, item.question, {
      fontFamily: T.font, fontSize: "26px", fontStyle: "bold", color: T.colors.text, align: "center", wordWrap: { width: w - 160 }
    }).setOrigin(0.5));

    this.quiz = window.Quiz.options(this, {
      x: w / 2, y: qy + 66, options: item.options, correctIndex: item.answer,
      buttonWidth: 300, buttonHeight: 56,
      onAnswer: (i, correct) => this.onAnswer(correct, item)
    });
    this.stage.add(this.quiz);
  }

  onAnswer(correct, item) {
    window.GameState.registerAnswer(correct, this.phaseKey);
    this.hud.updateScore();
    window.SubtitleManager.hide();
    const T = this.T, w = this.scale.width;
    this.stage.add(this.add.text(w / 2, 470, correct ? "✓ Correct!" : "✕ Correct: " + item.options[item.answer], {
      fontFamily: T.font, fontSize: "20px", fontStyle: "bold", color: correct ? T.hex(T.colors.good) : T.hex(T.colors.bad)
    }).setOrigin(0.5));

    if (window.GameState.isGameOver()) {
      this.time.delayedCall(1200, () => { window.AudioManager.sfx("lose"); this.scene.start("ResultScene", { gameOver: true }); });
      return;
    }
    const last = this.idx >= this.items.length - 1;
    this.stage.add(T.button(this, w / 2, 522, 240, 50, last ? "See result  🏆" : "Next  ▶", { fontSize: 20, onClick: () => this.advance() }));
    if (window.GameState.settings.mode !== "teacher") this.time.delayedCall(1700, () => { if (this.scene.isActive()) this.advance(); });
  }

  advance() {
    if (this._advancing) return; this._advancing = true;
    this.idx++;
    if (this.idx >= this.items.length) { window.Flow.completePhase(this, this.phaseKey); return; }
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
window.FinalScene = FinalScene;
