/* STAGE 2 — VOCABULARY MISSION. Object + gap sentence, pick the word.
 * Wrong = lose a life + "try again" (answer is not revealed). */
class VocabularyScene extends Phaser.Scene {
  constructor() { super("VocabularyScene"); }

  create() {
    this.T = window.Theme;
    this.phaseKey = "Vocabulary";
    this.items = window.PRIME_CONTENT.vocabulary.items;
    this.idx = 0;
    this.cameras.main.fadeIn(280, 5, 7, 20);
    window.SubtitleManager.mount(this);
    this.T.scene(this, "travel");
    window.AudioManager.playMusic("adventure");
    this.hud = new window.Hud(this, { phaseTitle: window.S("stage") + " 2 · " + window.S("vocabTitle") });
    // ícone do conteúdo -> objeto real do Pack 03
    this.itemTex = { suitcase: "suitcase", ticket: "ticket", map: "map", passport: "passport", camera: "camera" };
    this.iconEmoji = { suitcase: "🧳", ticket: "🎫", map: "🗺️", passport: "🛂", camera: "📷", key: "🔑", phone: "📱", wallet: "👛" };
    this.stage = this.add.container(0, 0);
    this.render();
  }

  render() {
    this.stage.removeAll(true);
    this._done = false;
    const T = this.T, w = this.scale.width;
    const item = this.items[this.idx];
    this.progressDots(w / 2, 72, this.items.length, this.idx);

    const objCard = T.card(this, w / 2, 168, 210, 156, { border: T.colors.accent2, fill: T.colors.panelLight });
    this.stage.add(objCard);
    const glow = this.add.graphics(); glow.fillStyle(T.colors.accent2, 0.12); glow.fillCircle(w / 2, 162, 82); glow.setBlendMode(Phaser.BlendModes.ADD);
    this.stage.add(glow);
    let obj;
    if (window.Art && window.Art.ready(this) && this.itemTex[item.icon]) {
      obj = window.Art.item(this, this.itemTex[item.icon], w / 2, 164, 130, { originX: 0.5, originY: 0.5, depth: 5 });
    } else {
      obj = this.add.text(w / 2, 162, this.iconEmoji[item.icon] || "❓", { fontSize: "92px" }).setOrigin(0.5);
    }
    if (obj) { this.stage.add(obj); this.tweens.add({ targets: obj, y: obj.y - 8, duration: 1600, yoyo: true, repeat: -1, ease: "Sine.inOut" }); }

    this.stage.add(T.iconButton(this, w / 2 + 132, 168, "🔊", { radius: 24, iconName: "volume", onClick: () => window.AudioManager.speak(item.word) }));

    this.stage.add(this.add.text(w / 2, 288, item.prompt, {
      fontFamily: T.font, fontSize: "30px", fontStyle: "bold", color: T.colors.text, align: "center", wordWrap: { width: w - 120 }
    }).setOrigin(0.5));

    this.feedback = this.add.text(w / 2, 498, "", { fontFamily: T.font, fontSize: "22px", fontStyle: "bold", align: "center", wordWrap: { width: w - 100 } }).setOrigin(0.5);
    this.stage.add(this.feedback);

    const correctIndex = item.options.indexOf(item.word);
    this.quiz = window.Quiz.options(this, {
      x: w / 2, y: 358, options: item.options, correctIndex, buttonWidth: 320, buttonHeight: 60,
      onAnswer: (i, correct) => this.onAnswer(correct, item)
    });
    this.stage.add(this.quiz);

    this.time.delayedCall(300, () => window.AudioManager.speak(item.word));
  }

  onAnswer(correct, item) {
    const T = this.T, w = this.scale.width;
    if (!correct) {
      window.GameState.loseLife(this.phaseKey); this.hud.updateScore();
      this.feedback.setColor(T.hex(T.colors.bad)); this.feedback.setText(window.S("tryAgain"));
      if (window.GameState.isGameOver()) { this.time.delayedCall(900, () => this.scene.start("ResultScene", { gameOver: true })); }
      return;
    }
    this._done = true;
    window.GameState.registerCorrect(this.phaseKey); this.hud.updateScore();
    window.AudioManager.speak(item.word);
    this.feedback.setColor(T.hex(T.colors.good)); this.feedback.setText(window.S("correct") + "  " + item.word);
    const last = this.idx >= this.items.length - 1;
    this.stage.add(T.button(this, w / 2, 552, 240, 52, last ? window.S("finishStage") : window.S("next"), { fontSize: 20, onClick: () => this.advance() }));
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
