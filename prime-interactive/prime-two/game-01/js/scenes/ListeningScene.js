/* STAGE 3 — LISTENING MISSION (English). Audio + synced subtitle + repeat + MCQ. */
class ListeningScene extends Phaser.Scene {
  constructor() { super("ListeningScene"); }

  create() {
    this.T = window.Theme;
    this.phaseKey = "Listening";
    this.items = window.PRIME_CONTENT.listening.items;
    this.idx = 0;
    this.cameras.main.fadeIn(300, 5, 7, 20);
    window.SubtitleManager.mount(this);
    this.T.background(this, 1);
    this.T.particles(this, this.T.colors.accentPink);
    window.AudioManager.playMusic("adventure");
    this.hud = new window.Hud(this, { phaseTitle: "STAGE 3 · Listening Mission" });
    this.stage = this.add.container(0, 0);
    this.render();
  }

  render() {
    this.stage.removeAll(true);
    const T = this.T, w = this.scale.width;
    const item = this.items[this.idx];
    this.progressDots(w / 2, 70, this.items.length, this.idx);

    const panel = T.card(this, w / 2, 150, 600, 96, { border: T.colors.accent });
    this.stage.add(panel);
    this.bars = [];
    const barCount = 22, bw = 8, gap = 10, totalW = barCount * (bw + gap);
    for (let i = 0; i < barCount; i++) {
      const bx = w / 2 - totalW / 2 + i * (bw + gap);
      const bar = this.add.rectangle(bx, 168, bw, 16, T.colors.accent).setOrigin(0.5, 1);
      this.bars.push(bar); this.stage.add(bar);
    }
    this.eqActive = false;
    this.eqEvent = this.time.addEvent({ delay: 90, loop: true, callback: () => this.animEq() });

    const play = T.button(this, w / 2 - 40, 232, 250, 52, "🔊  Play audio", {
      color: T.colors.accent, color2: 0x6b8bff, textColor: "#06121f", fontSize: 22, onClick: () => this.playAudio(item)
    });
    this.stage.add(play);
    const rep = T.iconButton(this, w / 2 + 165, 232, "↻", { radius: 24, onClick: () => this.playAudio(item) });
    this.stage.add(rep);

    const q = this.add.text(w / 2, 300, item.question, {
      fontFamily: T.font, fontSize: "25px", fontStyle: "bold", color: T.colors.text, align: "center", wordWrap: { width: w - 160 }
    }).setOrigin(0.5);
    this.stage.add(q);

    this.quiz = window.Quiz.options(this, {
      x: w / 2, y: 356, options: item.options, correctIndex: item.answer,
      buttonWidth: 300, buttonHeight: 56,
      onAnswer: (i, correct) => this.onAnswer(correct, item)
    });
    this.stage.add(this.quiz);

    this.time.delayedCall(400, () => this.playAudio(item));
  }

  playAudio(item) {
    this.eqActive = true;
    window.SubtitleManager.show(item.subtitle);
    window.AudioManager.speak(item.audioText, { key: item.id, onend: () => { this.eqActive = false; } });
    const est = Math.min(9000, 900 + item.audioText.length * 55);
    this.time.delayedCall(est, () => { this.eqActive = false; });
  }

  animEq() {
    if (!this.bars) return;
    this.bars.forEach(b => {
      const target = this.eqActive ? Phaser.Math.Between(10, 62) : 12;
      this.tweens.add({ targets: b, height: target, duration: 90 });
      b.fillColor = this.eqActive ? this.T.colors.accent : 0x3a4470;
    });
  }

  onAnswer(correct, item) {
    window.GameState.registerAnswer(correct, this.phaseKey);
    this.hud.updateScore();
    this.eqActive = false;
    window.SubtitleManager.hide();
    const T = this.T, w = this.scale.width;
    const msg = correct ? "Correct!" : ("Correct answer: " + item.options[item.answer]);
    this.stage.add(this.add.text(w / 2, 470, msg, {
      fontFamily: T.font, fontSize: "20px", fontStyle: "bold", color: correct ? T.hex(T.colors.good) : T.hex(T.colors.bad)
    }).setOrigin(0.5));

    if (window.GameState.isGameOver()) {
      this.time.delayedCall(1100, () => { window.AudioManager.sfx("lose"); this.scene.start("ResultScene", { gameOver: true }); });
      return;
    }
    const last = this.idx >= this.items.length - 1;
    this.stage.add(T.button(this, w / 2, 522, 240, 50, last ? "Finish stage  ✓" : "Next  ▶", { fontSize: 20, onClick: () => this.advance() }));
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
window.ListeningScene = ListeningScene;
