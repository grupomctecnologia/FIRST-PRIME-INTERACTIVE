/* STEP 7 — CHECKOUT CHALLENGE. Review the order (products, colours, sizes,
 * quantities, prices) and its total, confirm the total, then CONFIRM PURCHASE.
 * Wrong total = lose a life + retry (answer not revealed). Confirm → mission
 * complete. */
class CheckoutChallengeScene extends Phaser.Scene {
  constructor() { super("CheckoutChallengeScene"); }

  create() {
    this.T = window.Theme;
    this.phaseKey = "CheckoutChallenge";
    this.data = window.PRIME_CONTENT.checkoutChallenge;
    this._advancing = false; this._done = false;   // reset por partida
    this.cameras.main.fadeIn(280, 5, 7, 20);
    window.SubtitleManager.mount(this);
    this.T.scene(this, "checkout");
    window.AudioManager.playMusic("adventure");
    this.hud = new window.Hud(this, { phaseTitle: window.S("stage") + " 7 · " + window.S("checkoutTitle") });
    this.render();
  }

  render() {
    const T = this.T, w = this.scale.width, h = this.scale.height;
    const d = this.data;
    const total = d.receipt.reduce((s, r) => s + r.qty * r.price, 0);

    // ---- Recibo (esquerda) ----
    const rx = 340, ry = 300, rw = 600, rh = 420;
    T.card(this, rx, ry, rw, rh, { border: T.colors.accent2, fill: T.colors.panel });
    this.add.text(rx, ry - rh / 2 + 30, window.S("review"), {
      fontFamily: T.font, fontSize: "22px", fontStyle: "bold", color: T.hex(T.colors.accent2)
    }).setOrigin(0.5);

    // cabeçalho de colunas
    const colX = { item: rx - rw / 2 + 120, cs: rx - 40, qty: rx + 150, price: rx + rw / 2 - 40 };
    const headY = ry - rh / 2 + 66;
    const head = (x, t, o) => this.add.text(x, headY, t, { fontFamily: T.font, fontSize: "13px", fontStyle: "bold", color: T.colors.textDim }).setOrigin(o, 0.5);
    head(rx - rw / 2 + 120, "", 0.5);
    head(colX.cs, window.S("colour") + " · " + window.S("size"), 0.5);
    head(colX.qty, window.S("quantity"), 0.5);
    head(colX.price, "£", 1);

    d.receipt.forEach((r, i) => {
      const y = headY + 40 + i * 78;
      const im = window.Art.item(this, r.item, rx - rw / 2 + 60, y, 62, { originX: 0.5, originY: 0.5, depth: 5 });
      this.add.text(rx - rw / 2 + 100, y - 12, r.label, { fontFamily: T.font, fontSize: "17px", fontStyle: "bold", color: T.colors.text }).setOrigin(0, 0.5);
      this.add.text(rx - rw / 2 + 100, y + 12, r.colour + (r.size && r.size !== "—" ? "  ·  " + this.sizeText(r.size) : ""), { fontFamily: T.font, fontSize: "14px", color: T.hex(T.colors.accent) }).setOrigin(0, 0.5);
      this.add.text(colX.qty, y, "×" + r.qty, { fontFamily: T.font, fontSize: "17px", fontStyle: "bold", color: T.colors.text }).setOrigin(0.5);
      this.add.text(colX.price, y, "£" + (r.qty * r.price), { fontFamily: T.font, fontSize: "17px", fontStyle: "bold", color: T.colors.text }).setOrigin(1, 0.5);
    });

    // linha do total
    const totalY = ry + rh / 2 - 46;
    const line = this.add.graphics(); line.lineStyle(1, T.colors.accent, 0.4); line.lineBetween(rx - rw / 2 + 30, totalY - 26, rx + rw / 2 - 30, totalY - 26);
    this.add.text(rx - rw / 2 + 30, totalY, window.S("total"), { fontFamily: T.font, fontSize: "22px", fontStyle: "bold", color: T.hex(T.colors.accent2) }).setOrigin(0, 0.5);
    this.totalText = this.add.text(colX.price, totalY, "£ ___", { fontFamily: T.font, fontSize: "24px", fontStyle: "bold", color: T.hex(T.colors.textDim) }).setOrigin(1, 0.5);
    this._total = total;

    // ---- Pergunta do total + opções (direita) ----
    const qx = w - 300;
    this.add.text(qx, 110, d.totalQuestion, {
      fontFamily: T.font, fontSize: "22px", fontStyle: "bold", color: T.colors.text, align: "center", wordWrap: { width: 440 }
    }).setOrigin(0.5).setShadow(0, 2, "rgba(0,0,0,0.85)", 6);

    this.feedback = this.add.text(qx, h - 150, "", { fontFamily: T.font, fontSize: "19px", fontStyle: "bold", align: "center", wordWrap: { width: 440 } }).setOrigin(0.5);

    this.quiz = window.Quiz.options(this, {
      x: qx, y: 190, options: d.options, correctIndex: d.answer, cols: 2, buttonWidth: 210, buttonHeight: 58,
      onAnswer: (i, correct) => this.onAnswer(correct)
    });

    this.confirmBtn = null;
  }

  sizeText(sz) { const m = { S: window.S("small"), M: window.S("medium"), L: window.S("large") }; return m[sz] || sz; }

  onAnswer(correct) {
    const T = this.T, w = this.scale.width, h = this.scale.height;
    if (!correct) {
      window.GameState.loseLife(this.phaseKey); this.hud.updateScore();
      this.feedback.setColor(T.hex(T.colors.bad)); this.feedback.setText(window.S("tryAgain"));
      if (window.GameState.isGameOver()) { this.time.delayedCall(900, () => this.scene.start("ResultScene", { gameOver: true })); }
      return;
    }
    this._done = true;
    window.GameState.registerCorrect(this.phaseKey); this.hud.updateScore();
    // revela o total no recibo
    this.totalText.setText("£" + this._total).setColor(T.hex(T.colors.good));
    this.feedback.setColor(T.hex(T.colors.good)); this.feedback.setText(window.S("correct"));
    // botão CONFIRM PURCHASE (usa o botão oficial do Pack 04)
    this.confirmBtn = window.Shop.button(this, w - 300, h - 74, 360, 62, window.S("confirmPurchase"), { fontSize: 24, onClick: () => this.advance() });
    this.tweens.add({ targets: this.confirmBtn, scale: { from: 0.9, to: 1 }, duration: 300, ease: "Back.out" });
  }

  advance() {
    if (this._advancing) return; this._advancing = true;
    window.AudioManager.sfx("transition");
    window.Flow.completePhase(this, this.phaseKey);
  }
}
window.CheckoutChallengeScene = CheckoutChallengeScene;
