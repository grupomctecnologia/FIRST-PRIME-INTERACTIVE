/* STAGE 2 — VOCABULARY MISSION (English). Object + gap sentence, pick the word. */
class VocabularyScene extends Phaser.Scene {
  constructor() { super("VocabularyScene"); }

  create() {
    this.T = window.Theme;
    this.phaseKey = "Vocabulary";
    this.items = window.PRIME_CONTENT.vocabulary.items;
    this.idx = 0;
    this.cameras.main.fadeIn(300, 5, 7, 20);
    window.SubtitleManager.mount(this);
    this.T.background(this, 0);
    this.T.particles(this, this.T.colors.accent);
    window.AudioManager.playMusic("adventure");
    this.hud = new window.Hud(this, { phaseTitle: "STAGE 2 · Vocabulary Mission" });
    this.iconEmoji = { suitcase: "🧳", ticket: "🎫", map: "🗺️", passport: "🛂", camera: "📷", key: "🔑", phone: "📱", wallet: "👛" };
    this.stage = this.add.container(0, 0);
    this.render();
  }

  render() {
    this.stage.removeAll(true);
    this._answered = false;
    const T = this.T, w = this.scale.width;
    const item = this.items[this.idx];
    this.progressDots(w / 2, 72, this.items.length, this.idx);

    // object card
    const objCard = T.card(this, w / 2, 168, 210, 156, { border: T.colors.accent2, fill: T.colors.panelLight });
    this.stage.add(objCard);
    const glow = this.add.graphics(); glow.fillStyle(T.colors.accent2, 0.12); glow.fillCircle(w / 2, 162, 82); glow.setBlendMode(Phaser.BlendModes.ADD);
    this.stage.add(glow);
    const emoji = this.add.text(w / 2, 162, this.iconEmoji[item.icon] || "❓", { fontSize: "92px" }).setOrigin(0.5);
    this.stage.add(emoji);
    this.tweens.add({ targets: emoji, y: 154, duration: 1600, yoyo: true, repeat: -1, ease: "Sine.inOut" });

    const listen = T.iconButton(this, w / 2 + 132, 168, "🔊", { radius: 24, onClick: () => this.sayWord(item) });
    this.stage.add(listen);

    // prompt (English gap sentence)
    const promptTxt = this.add.text(w / 2, 288, item.prompt, {
      fontFamily: T.font, fontSize: "30px", fontStyle: "bold", color: T.colors.text, align: "center"
    }).setOrigin(0.5);
    this.stage.add(promptTxt);

    const correctIndex = item.options.indexOf(item.word);
    this.quiz = window.Quiz.options(this, {
      x: w / 2, y: 358, options: item.options, correctIndex,
      buttonWidth: 320, buttonHeight: 60,
      onAnswer: (i, correct) => this.onAnswer(correct, item)
    });
    this.stage.add(this.quiz);

    this.time.delayedCall(300, () => this.sayWord(item));
  }

  sayWord(item) { window.AudioManager.speak(item.word, { key: "vocab_" + item.id }); }

  onAnswer(correct, item) {
    this._answered = true;
    window.GameState.registerAnswer(correct, this.phaseKey);
    this.hud.updateScore();
    window.AudioManager.speak(item.word);
    const T = this.T, w = this.scale.width;
    const msg = correct ? "Correct!  " + item.word : "The word is: " + item.word;
    this.stage.add(this.add.text(w / 2, 498, msg, {
      fontFamily: T.font, fontSize: "22px", fontStyle: "bold",
      color: correct ? T.hex(T.colors.good) : T.hex(T.colors.bad), align: "center"
    }).setOrigin(0.5));

    if (window.GameState.isGameOver()) {
      this.time.delayedCall(1100, () => { window.AudioManager.sfx("lose"); this.scene.start("ResultScene", { gameOver: true }); });
      return;
    }
    const last = this.idx >= this.items.length - 1;
    this.stage.add(T.button(this, w / 2, 552, 240, 52, last ? "Finish stage  ✓" : "Next  ▶", {
      fontSize: 20, onClick: () => this.advance()
    }));
    if (window.GameState.settings.mode !== "teacher") this.time.delayedCall(1500, () => { if (this.scene.isActive()) this.advance(); });
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
window.VocabularyScene = VocabularyScene;
