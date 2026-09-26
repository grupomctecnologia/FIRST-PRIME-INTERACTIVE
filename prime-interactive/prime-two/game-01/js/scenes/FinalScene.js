/* STAGE 6 — FINAL MISSION. Vocab + listening + comprehension + grammar (retry). */
class FinalScene extends Phaser.Scene {
  constructor() { super("FinalScene"); }

  create() {
    this.T = window.Theme;
    this.phaseKey = "Final";
    this.items = window.PRIME_CONTENT.final.items;
    this.idx = 0;
    this.cameras.main.fadeIn(280, 5, 7, 20);
    window.SubtitleManager.mount(this);
    this.T.scene(this, "mission");
    window.AudioManager.playMusic("adventure");
    this.hud = new window.Hud(this, { phaseTitle: window.S("stage") + " 6 · " + window.S("finalTitle") });

    const w = this.scale.width;
    const banner = this.add.text(w / 2, 84, window.S("finalMission"), { fontFamily: this.T.font, fontSize: "26px", fontStyle: "bold", color: this.T.hex(this.T.colors.accent2) }).setOrigin(0.5);
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

    const kindLabel = { vocab: window.S("kindVocab"), listening: window.S("kindListening"), comprehension: window.S("kindComprehension"), grammar: window.S("kindGrammar") }[item.kind] || "";
    this.stage.add(this.add.text(w / 2, 142, kindLabel, { fontFamily: T.font, fontSize: "13px", color: T.hex(T.colors.accent) }).setOrigin(0.5));

    let qy = 188;
    if (item.kind === "listening") {
      this.stage.add(T.button(this, w / 2, 182, 240, 50, window.S("playAudio"), { color: T.colors.accent, color2: 0x6b8bff, textColor: "#06121f", onClick: () => { window.SubtitleManager.show(item.subtitle); window.AudioManager.speak(item.audioText, { key: "final_" + this.idx }); } }));
      qy = 240;
      this.time.delayedCall(400, () => { window.SubtitleManager.show(item.subtitle); window.AudioManager.speak(item.audioText, { key: "final_" + this.idx }); });
    }

    this.stage.add(this.add.text(w / 2, qy, item.question, { fontFamily: T.font, fontSize: "26px", fontStyle: "bold", color: T.colors.text, align: "center", wordWrap: { width: w - 160 } }).setOrigin(0.5));

    this.feedback = this.add.text(w / 2, 470, "", { fontFamily: T.font, fontSize: "20px", fontStyle: "bold", align: "center" }).setOrigin(0.5);
    this.stage.add(this.feedback);

    this.quiz = window.Quiz.options(this, { x: w / 2, y: qy + 66, options: item.options, correctIndex: item.answer, buttonWidth: 300, buttonHeight: 56, onAnswer: (i, correct) => this.onAnswer(correct, item) });
    this.stage.add(this.quiz);
  }

  onAnswer(correct, item) {
    const T = this.T, w = this.scale.width;
    if (!correct) {
      window.GameState.loseLife(this.phaseKey); this.hud.updateScore();
      this.feedback.setColor(T.hex(T.colors.bad)); this.feedback.setText(window.S("tryAgain"));
      if (window.GameState.isGameOver()) { this.time.delayedCall(900, () => this.scene.start("ResultScene", { gameOver: true })); }
      return;
    }
    window.GameState.registerCorrect(this.phaseKey); this.hud.updateScore();
    window.SubtitleManager.hide();
    this.feedback.setColor(T.hex(T.colors.good)); this.feedback.setText(window.S("correct"));
    const last = this.idx >= this.items.length - 1;
    this.stage.add(T.button(this, w / 2, 522, 240, 50, last ? window.S("seeResult") : window.S("next"), { fontSize: 20, onClick: () => this.advance() }));
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
    for (let i = 0; i < total; i++) { const d = this.add.circle(startX + i * gap, y, 7, i <= active ? T.colors.accent : 0x3a4470); if (i === active) d.setStrokeStyle(3, T.colors.accent2); this.stage.add(d); }
  }
}
window.FinalScene = FinalScene;
