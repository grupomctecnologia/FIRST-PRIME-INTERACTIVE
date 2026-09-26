/* FASE 6 — FINAL MISSION
 * Combina vocabulário, listening, compreensão e gramática. */
class FinalScene extends Phaser.Scene {
  constructor() { super("FinalScene"); }

  create() {
    this.T = window.Theme;
    this.phaseKey = "Final";
    this.items = window.PRIME_CONTENT.final.items;
    this.idx = 0;
    this.cameras.main.fadeIn(350, 5, 7, 20);
    window.SubtitleManager.hide();
    this.T.background(this, 0);
    this.T.particles(this, this.T.colors.accentPink);
    window.AudioManager.playMusic("adventure");
    this.hud = new window.Hud(this, { phaseTitle: "FASE 6 · Final Mission", phaseSubtitle: "Use tudo o que você aprendeu!" });

    // banner de missão final
    const w = this.scale.width;
    const banner = this.add.text(w / 2, 130, "★  FINAL MISSION  ★", {
      fontFamily: this.T.font, fontSize: "30px", fontStyle: "bold", color: this.T.hex(this.T.colors.accent2)
    }).setOrigin(0.5);
    banner.setShadow(0, 0, this.T.hex(this.T.colors.accent2), 18, true, true);
    this.tweens.add({ targets: banner, scale: { from: 0.96, to: 1.04 }, duration: 1200, yoyo: true, repeat: -1 });

    this.stage = this.add.container(0, 0);
    this.render();
  }

  render() {
    this.stage.removeAll(true);
    const T = this.T, w = this.scale.width;
    const item = this.items[this.idx];
    this.progressDots(w / 2, 170, this.items.length, this.idx);

    const kindLabel = { vocab: "Vocabulário", listening: "Listening", comprehension: "Compreensão", grammar: "Gramática" }[item.kind] || "Missão";
    this.stage.add(this.add.text(w / 2, 210, kindLabel.toUpperCase(), { fontFamily: T.font, fontSize: "14px", color: T.colors.accent && T.hex(T.colors.accent) }).setOrigin(0.5));

    // Se for listening, botão de áudio
    if (item.kind === "listening") {
      const play = T.button(this, w / 2, 270, 240, 52, "🔊  Ouvir áudio", {
        color: T.colors.accent, color2: 0x6b8bff, textColor: "#06121f", onClick: () => {
          window.SubtitleManager.show(item.subtitle);
          window.AudioManager.speak(item.audioText, { key: "final_" + this.idx });
        }
      });
      this.stage.add(play);
      this.time.delayedCall(400, () => { window.SubtitleManager.show(item.subtitle); window.AudioManager.speak(item.audioText, { key: "final_" + this.idx }); });
    }

    const qy = item.kind === "listening" ? 340 : 290;
    this.stage.add(this.add.text(w / 2, qy, item.question.en, {
      fontFamily: T.font, fontSize: "28px", fontStyle: "bold", color: T.colors.text, align: "center", wordWrap: { width: w - 160 }
    }).setOrigin(0.5));
    if (window.GameState.settings.showTranslation) {
      this.stage.add(this.add.text(w / 2, qy + 34, item.question.pt, { fontFamily: T.font, fontSize: "16px", color: T.colors.textDim }).setOrigin(0.5));
    }

    this.quiz = window.Quiz.options(this, {
      x: w / 2, y: qy + 100, options: item.options, correctIndex: item.answer,
      buttonWidth: 300, buttonHeight: 58,
      onAnswer: (i, correct) => this.onAnswer(correct, item)
    });
    this.stage.add(this.quiz);
  }

  onAnswer(correct, item) {
    window.GameState.registerAnswer(correct, this.phaseKey);
    this.hud.updateScore();
    window.SubtitleManager.hide();
    const T = this.T, w = this.scale.width;
    const fb = this.add.text(w / 2, 606, correct ? "✓ Correct!" : "✕ Correct: " + item.options[item.answer], {
      fontFamily: T.font, fontSize: "20px", fontStyle: "bold", color: correct ? T.hex(T.colors.good) : T.hex(T.colors.bad)
    }).setOrigin(0.5);
    this.stage.add(fb);

    if (window.GameState.isGameOver()) {
      this.time.delayedCall(1300, () => { window.AudioManager.sfx("lose"); this.scene.start("ResultScene", { gameOver: true }); });
      return;
    }
    const last = this.idx >= this.items.length - 1;
    const nextBtn = T.button(this, w / 2, 656, 240, 50, last ? "Ver resultado  🏆" : "Próximo  ▶", { fontSize: 20, onClick: () => this.advance() });
    this.stage.add(nextBtn);
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
