/* STEP 7 — TIMED FINAL CHALLENGE (Game 03). Quick questions against the clock.
 * The final star rating comes from the completion time:
 *   up to 30s -> ★★★ · 31–45s -> ★★ · over 45s -> ★
 * A wrong answer still loses a life and lets you retry (no reveal). When every
 * question is solved the time is recorded and the mission result is shown. */
class TimedChallengeScene extends ActivityScene {
  constructor() { super("TimedChallengeScene"); }

  create() {
    this.buildBase({ phaseKey: "TimedChallenge", bgKey: "timed", stepNumber: 7, titleKey: "timedTitle", instr: window.S("timedInstr") });
    const w = this.scale.width, h = this.scale.height, T = window.Theme;

    this.questions = window.PRIME_CONTENT.timed.questions;
    this.qIdx = 0;
    this.running = false;
    this.elapsedMs = 0;

    // Timer frame + stopwatch (hidden until GO)
    this.timerUI = window.UI.timer(this, w / 2, 132, 190, 62);
    this.timerUI.setVisible(false);
    if (window.Art && window.Art.itemExists(this, "stopwatch")) {
      this.stopwatch = window.Art.item(this, "stopwatch", w / 2 - 130, 132, 66, { depth: 6 });
      if (this.stopwatch) this.stopwatch.setVisible(false);
    }
    this.starHint = this.add.text(w / 2, 172, window.S("starTimeHint"), { fontFamily: T.font, fontSize: "13px", color: T.colors.textDim }).setOrigin(0.5).setVisible(false);

    this.countdown();
  }

  countdown() {
    const w = this.scale.width, h = this.scale.height, T = window.Theme;
    const ready = this.add.text(w / 2, h * 0.52, window.S("getReady"), { fontFamily: T.font, fontSize: "40px", fontStyle: "bold", color: T.colors.text }).setOrigin(0.5);
    ready.setShadow(0, 4, "rgba(0,0,0,0.7)", 12, true, true);
    let n = 3;
    const num = this.add.text(w / 2, h * 0.66, "3", { fontFamily: T.font, fontSize: "80px", fontStyle: "bold", color: T.hex(T.colors.accent2) }).setOrigin(0.5);
    const tick = () => {
      if (this._locked) return;
      n--;
      window.AudioManager.sfx("click");
      if (n > 0) { num.setText(String(n)); this.tweens.add({ targets: num, scale: { from: 1.6, to: 1 }, duration: 300 }); this.time.delayedCall(800, tick); }
      else { num.setText(window.S("go")); num.setColor(T.hex(T.colors.good)); this.tweens.add({ targets: num, scale: { from: 1.8, to: 1 }, duration: 300 });
        this.time.delayedCall(600, () => { ready.destroy(); num.destroy(); this.begin(); }); }
    };
    this.time.delayedCall(900, tick);
  }

  begin() {
    this.running = true;
    this.startTime = this.time.now;
    this.timerUI.setVisible(true);
    if (this.stopwatch) this.stopwatch.setVisible(true);
    this.starHint.setVisible(true);
    window.AudioManager.sfx("transition");
    this.loadQuestion();
  }

  update() {
    if (!this.running) return;
    this.elapsedMs = this.time.now - this.startTime;
    const secs = this.elapsedMs / 1000;
    this.timerUI.set(secs);
    if (secs > 45) this.timerUI.setColour("#ff6b78");
    else if (secs > 30) this.timerUI.setColour("#ffd35c");
    else this.timerUI.setColour("#7ef0a8");
  }

  loadQuestion() {
    const w = this.scale.width, h = this.scale.height, T = window.Theme;
    if (this._layer) { this._layer.destroy(); this._layer = null; }
    this._layer = this.add.container(0, 0);
    this._answered = false;

    const data = this.questions[this.qIdx];
    this._layer.add(this.add.text(w / 2, 210, window.S("questionOf", this.qIdx + 1, this.questions.length), {
      fontFamily: T.font, fontSize: "14px", color: T.colors.textDim
    }).setOrigin(0.5));

    this._layer.add(window.UI.panel(this, w / 2, h * 0.40, 720, 90, "mission"));
    this._layer.add(this.add.text(w / 2, h * 0.40, data.q, {
      fontFamily: T.font, fontSize: "24px", fontStyle: "bold", color: "#f6f9ff", align: "center", wordWrap: { width: 660 }
    }).setOrigin(0.5).setShadow(0, 2, "rgba(0,0,0,0.85)", 7));

    const opts = data.options;
    const bw = 280, bh = 60, gap = 22;
    const totalW = opts.length * bw + (opts.length - 1) * gap;
    let startX = w / 2 - totalW / 2 + bw / 2;
    const y = h * 0.68;
    // wrap to two rows if too wide
    const perRow = totalW > w - 60 ? 2 : opts.length;
    const rowW = Math.min(perRow, opts.length) * bw + (Math.min(perRow, opts.length) - 1) * gap;
    startX = w / 2 - rowW / 2 + bw / 2;
    this.cards = [];
    opts.forEach((label, i) => {
      const col = i % perRow, row = Math.floor(i / perRow);
      const x = startX + col * (bw + gap);
      const yy = y + row * (bh + 16);
      const card = window.UI.optionCard(this, x, yy, bw, bh, label, { onClick: () => this.choose(i, card) });
      this._layer.add(card); this.cards.push(card);
    });
  }

  choose(i, card) {
    if (this._locked || this._answered) return;
    const data = this.questions[this.qIdx];
    if (i === data.answer) {
      this._answered = true;
      this.cards.forEach((c) => c.lock());
      card.setState("correct");
      this.registerCorrect();
      this.qIdx++;
      if (this.qIdx >= this.questions.length) { this.time.delayedCall(450, () => this.finishChallenge()); }
      else this.time.delayedCall(450, () => this.loadQuestion());
    } else {
      card.setState("wrong"); card.lock();
      this.registerWrong();
    }
  }

  finishChallenge() {
    if (this._locked) return;
    this.running = false;
    this.elapsedMs = this.time.now - this.startTime;
    window.GameState.setChallengeTime(this.elapsedMs);
    this.finishStep();
  }
}
window.TimedChallengeScene = TimedChallengeScene;
