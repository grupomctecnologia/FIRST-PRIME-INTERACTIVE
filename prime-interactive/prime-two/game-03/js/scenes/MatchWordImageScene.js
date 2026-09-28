/* STEP 4 — MATCH WORD AND IMAGE (Game 03). See the picture, choose the word
 * that matches. A wrong choice loses a life and lets you try again; the wrong
 * option is marked (retry icon) but the correct answer is never revealed. */
class MatchWordImageScene extends ActivityScene {
  constructor() { super("MatchWordImageScene"); }

  create() {
    this.buildBase({ phaseKey: "MatchWordImage", bgKey: "match", stepNumber: 4, titleKey: "matchTitle", instr: window.S("matchInstr") });
    this.items = window.PRIME_CONTENT.match.items;
    this.qIdx = 0;
    this.loadItem();
  }

  loadItem() {
    const w = this.scale.width, h = this.scale.height, T = window.Theme;
    if (this._layer) { this._layer.destroy(); this._layer = null; }
    this._layer = this.add.container(0, 0);
    this._answered = false;

    const data = this.items[this.qIdx];

    // progress
    this._layer.add(this.add.text(w / 2, 128, window.S("questionOf", this.qIdx + 1, this.items.length), {
      fontFamily: T.font, fontSize: "14px", color: T.colors.textDim
    }).setOrigin(0.5));

    // picture
    if (window.Art && window.Art.itemExists(this, data.item)) {
      const im = window.Art.item(this, data.item, w / 2, h * 0.36, 190, { depth: 5 });
      if (im) this._layer.add(im);
    }

    // 4 word options (2x2)
    const opts = data.options;
    const cols = 2, bw = 300, bh = 62, gapX = 30, gapY = 18;
    const totalW = cols * bw + (cols - 1) * gapX;
    const startX = w / 2 - totalW / 2 + bw / 2;
    const startY = h * 0.62;
    this.cards = [];
    opts.forEach((label, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const x = startX + col * (bw + gapX);
      const y = startY + row * (bh + gapY);
      const card = window.UI.optionCard(this, x, y, bw, bh, label, { onClick: () => this.choose(i, card) });
      this._layer.add(card); this.cards.push(card);
    });
  }

  choose(i, card) {
    if (this._locked || this._answered) return;
    const data = this.items[this.qIdx];
    if (i === data.answer) {
      this._answered = true;
      this.cards.forEach((c) => c.lock());
      card.setState("correct");
      this.registerCorrect();
      this.toast(window.S("correct"), true);
      this.qIdx++;
      if (this.qIdx >= this.items.length) this.time.delayedCall(850, () => this.finishStep());
      else this.time.delayedCall(850, () => this.loadItem());
    } else {
      card.setState("wrong"); card.lock();
      this.registerWrong();
    }
  }
}
window.MatchWordImageScene = MatchWordImageScene;
