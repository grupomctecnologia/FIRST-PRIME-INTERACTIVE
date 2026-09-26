/* STEP 3 — COLOUR AND SIZE. Read the sentence, then choose the product with the
 * right COLOUR and SIZE (S/M/L). Wrong = lose a life; that card is disabled
 * (answer not revealed) and the player keeps trying. */
class ColourSizeScene extends Phaser.Scene {
  constructor() { super("ColourSizeScene"); }

  create() {
    this.T = window.Theme;
    this.phaseKey = "ColourSize";
    this.items = window.PRIME_CONTENT.colourSize.items;
    this.idx = 0; this._advancing = false;   // reset por partida (instância reutilizada)
    this.cameras.main.fadeIn(280, 5, 7, 20);
    window.SubtitleManager.mount(this);
    this.T.scene(this, "shop");
    window.AudioManager.playMusic("adventure");
    this.hud = new window.Hud(this, { phaseTitle: window.S("stage") + " 3 · " + window.S("colourSizeTitle") });
    this.stage = this.add.container(0, 0);
    this.render();
  }

  colourTint(name) {
    const m = { blue: "#5b9bff", azul: "#5b9bff", white: "#ffffff", blanca: "#ffffff", blanco: "#ffffff",
      black: "#c9d2ee", negra: "#c9d2ee", negros: "#c9d2ee", red: "#ff6b6b", roja: "#ff6b6b",
      navy: "#8ab0ff", "azul marino": "#8ab0ff" };
    return m[(name || "").toLowerCase()] || "#eef3ff";
  }
  sizeText(sz) {
    const map = { S: window.S("small"), M: window.S("medium"), L: window.S("large") };
    return (map[sz] || sz);
  }

  render() {
    this.stage.removeAll(true);
    this._done = false;
    const T = this.T, w = this.scale.width;
    const item = this.items[this.idx];
    this.progressDots(w / 2, 70, this.items.length, this.idx);

    // frase-alvo
    this.stage.add(this.add.text(w / 2, 128, item.prompt, {
      fontFamily: T.font, fontSize: "27px", fontStyle: "bold", color: T.colors.text, align: "center", wordWrap: { width: w - 160 }
    }).setOrigin(0.5).setShadow(0, 2, "rgba(0,0,0,0.85)", 6));
    this.stage.add(T.iconButton(this, w / 2, 168, "🔊", { radius: 20, onClick: () => window.AudioManager.speak(item.prompt) }));

    // opções (imagem + cor + tamanho)
    const opts = item.options;
    const cols = 2, cardW = 190, cardH = 168, gapX = 44, gapY = 20;
    const totalW = cols * cardW + (cols - 1) * gapX;
    const startX = w / 2 - totalW / 2 + cardW / 2;
    const startY = 268;
    this.cards = [];
    opts.forEach((o, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const cx = startX + col * (cardW + gapX);
      const cy = startY + row * (cardH + gapY);
      const badges = [
        { text: o.colour, color: this.colourTint(o.colour) },
        { text: this.sizeText(o.size), color: "#ffd35c" }
      ];
      const card = window.ShopCards.itemCard(this, cx, cy, cardW, cardH, o.item, () => this.pick(i, card, item), { badges });
      this.cards.push(card);
      this.stage.add(card);
    });

    this.feedback = this.add.text(w / 2, this.scale.height - 26, "", { fontFamily: T.font, fontSize: "20px", fontStyle: "bold", align: "center" }).setOrigin(0.5);
    this.stage.add(this.feedback);

    this.time.delayedCall(320, () => window.AudioManager.speak(item.prompt));
  }

  pick(i, card, item) {
    if (this._done) return;
    const T = this.T, w = this.scale.width;
    if (i === item.answer) {
      this._done = true;
      this.cards.forEach((c) => c.hit && c.hit.disableInteractive());
      card.setCardState("correct");
      window.GameState.registerCorrect(this.phaseKey); this.hud.updateScore();
      window.AudioManager.sfx("correct"); T.flashFeedback(this, true);
      this.feedback.setColor(T.hex(T.colors.good)); this.feedback.setText(window.S("correct"));
      const last = this.idx >= this.items.length - 1;
      this.stage.add(T.button(this, w / 2, this.scale.height - 58, 240, 46, last ? window.S("finishStage") : window.S("next"), { fontSize: 20, onClick: () => this.advance() }));
    } else {
      card.setCardState("wrong"); if (card.hit) card.hit.disableInteractive();
      window.GameState.loseLife(this.phaseKey); this.hud.updateScore();
      window.AudioManager.sfx("wrong"); T.flashFeedback(this, false);
      this.feedback.setColor(T.hex(T.colors.bad)); this.feedback.setText(window.S("tryAgain"));
      if (window.GameState.isGameOver()) { this.time.delayedCall(900, () => this.scene.start("ResultScene", { gameOver: true })); }
    }
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
window.ColourSizeScene = ColourSizeScene;
