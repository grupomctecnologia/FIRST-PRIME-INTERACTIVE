/* STAGE 3 — AT THE CHECKOUT. Read the price tags on the items, then answer a
 * money question (total / cheapest / change). Wrong = lose a life + retry
 * (answer not revealed). (Distinct mechanic: numbers & money.) */
class CheckoutScene extends Phaser.Scene {
  constructor() { super("CheckoutScene"); }

  create() {
    this.T = window.Theme;
    this.phaseKey = "Checkout";
    this.items = window.PRIME_CONTENT.checkout.items;
    this.idx = 0; this._advancing = false;   // reset por partida (instância reutilizada)
    this.cameras.main.fadeIn(280, 5, 7, 20);
    window.SubtitleManager.mount(this);
    this.T.scene(this, "checkout");
    window.AudioManager.playMusic("adventure");
    this.hud = new window.Hud(this, { phaseTitle: window.S("stage") + " 3 · " + window.S("checkoutTitle") });
    this.stage = this.add.container(0, 0);
    this.render();
  }

  render() {
    this.stage.removeAll(true);
    this._done = false;
    const T = this.T, w = this.scale.width;
    const item = this.items[this.idx];
    this.progressDots(w / 2, 70, this.items.length, this.idx);

    // produtos com etiqueta de preço
    const prods = item.products;
    const slotW = 190, gap = 60, totalW = prods.length * slotW + (prods.length - 1) * gap;
    const startX = w / 2 - totalW / 2 + slotW / 2;
    prods.forEach((p, i) => {
      const px = startX + i * (slotW + gap), py = 176;
      const card = T.card(this, px, py, 150, 150, { border: T.colors.accent, fill: T.colors.panelLight });
      this.stage.add(card);
      const im = window.Art.item(this, p.item, px, py - 6, 108, { originX: 0.5, originY: 0.5, depth: 5 });
      if (im) this.stage.add(im);
      this.stage.add(window.Shop.priceTag(this, px + 52, py + 64, 96, 46, "£" + p.price));
    });

    this.stage.add(this.add.text(w / 2, 296, item.question, {
      fontFamily: T.font, fontSize: "26px", fontStyle: "bold", color: T.colors.text, align: "center", wordWrap: { width: w - 160 }
    }).setOrigin(0.5).setShadow(0, 2, "rgba(0,0,0,0.85)", 6));

    this.feedback = this.add.text(w / 2, this.scale.height - 34, "", { fontFamily: T.font, fontSize: "20px", fontStyle: "bold", align: "center" }).setOrigin(0.5);
    this.stage.add(this.feedback);

    const cols = item.options.length <= 2 ? item.options.length : 2;
    this.quiz = window.Quiz.options(this, {
      x: w / 2, y: 360, options: item.options, correctIndex: item.answer, cols, buttonWidth: 260, buttonHeight: 58,
      onAnswer: (i, correct) => this.onAnswer(correct)
    });
    this.stage.add(this.quiz);
  }

  onAnswer(correct) {
    const T = this.T, w = this.scale.width;
    if (!correct) {
      window.GameState.loseLife(this.phaseKey); this.hud.updateScore();
      this.feedback.setColor(T.hex(T.colors.bad)); this.feedback.setText(window.S("tryAgain"));
      if (window.GameState.isGameOver()) { this.time.delayedCall(900, () => this.scene.start("ResultScene", { gameOver: true })); }
      return;
    }
    this._done = true;
    window.GameState.registerCorrect(this.phaseKey); this.hud.updateScore();
    this.feedback.setColor(T.hex(T.colors.good)); this.feedback.setText(window.S("correct"));
    const last = this.idx >= this.items.length - 1;
    this.stage.add(T.button(this, w / 2, this.scale.height - 66, 240, 48, last ? window.S("finishStage") : window.S("next"), { fontSize: 20, onClick: () => this.advance() }));
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
window.CheckoutScene = CheckoutScene;
