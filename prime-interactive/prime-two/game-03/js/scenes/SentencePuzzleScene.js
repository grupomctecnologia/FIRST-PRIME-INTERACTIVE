/* STEP 6 — SENTENCE PUZZLE (Game 03). Tap the word blocks in the correct order
 * to build each sentence on the assembly panel. A wrong block loses a life and
 * lets you try again (the answer is never revealed). */
class SentencePuzzleScene extends ActivityScene {
  constructor() { super("SentencePuzzleScene"); }

  create() {
    this.buildBase({ phaseKey: "SentencePuzzle", bgKey: "sentence", stepNumber: 6, titleKey: "sentenceTitle", instr: window.S("sentenceInstr") });
    this.sentences = window.PRIME_CONTENT.sentence.sentences;
    this.sIdx = 0;
    this.loadSentence();
  }

  loadSentence() {
    const w = this.scale.width, h = this.scale.height, T = window.Theme;
    if (this._layer) { this._layer.destroy(); this._layer = null; }
    this._layer = this.add.container(0, 0);

    const data = this.sentences[this.sIdx];
    this.solution = data.blocks;
    this.nextIndex = 0;
    this.placed = [];

    this._layer.add(this.add.text(w / 2, 128, window.S("questionOf", this.sIdx + 1, this.sentences.length), {
      fontFamily: T.font, fontSize: "14px", color: T.colors.textDim
    }).setOrigin(0.5));

    // assembly panel (target)
    this.assemblyY = h * 0.34;
    this._layer.add(window.UI.panel(this, w / 2, this.assemblyY, w - 200, 90, "sentence"));
    this.assemblyContainer = this.add.container(0, 0);
    this._layer.add(this.assemblyContainer);

    // shuffled blocks
    const order = data.blocks.map((b, i) => i);
    this._shuffle(order);
    const bh = 56, gap = 16;
    const bw = (b) => Math.max(70, b.length * 16 + 34);
    // lay out in a row (wrap if needed)
    const y = h - 96;
    let totalW = 0; order.forEach((i) => totalW += bw(data.blocks[i]) + gap); totalW -= gap;
    let x = w / 2 - totalW / 2;
    this.blocks = [];
    order.forEach((i) => {
      const word = data.blocks[i];
      const bwv = bw(word);
      const block = window.UI.sentenceBlock(this, x + bwv / 2, y, bwv, bh, word, { onClick: (c) => this.onBlock(c) });
      block._solIndex = i;
      this._layer.add(block); this.blocks.push(block);
      x += bwv + gap;
    });
  }

  onBlock(block) {
    if (this._locked || block.used) return;
    if (block.word === this.solution[this.nextIndex]) {
      block.setUsed(true);
      this._placeBlock(block.word);
      window.AudioManager.sfx("click");
      this.nextIndex++;
      if (this.nextIndex >= this.solution.length) {
        this.registerCorrect();
        this.toast(window.S("correct"), true);
        this.sIdx++;
        if (this.sIdx >= this.sentences.length) this.time.delayedCall(850, () => this.finishStep());
        else this.time.delayedCall(850, () => this.loadSentence());
      }
    } else {
      this.registerWrong();
    }
  }

  _placeBlock(word) {
    const T = window.Theme, w = this.scale.width;
    // rebuild the assembled row centered
    this.placed.push(word);
    this.assemblyContainer.removeAll(true);
    const bh = 46, gap = 12;
    const bw = (b) => Math.max(60, b.length * 14 + 26);
    let totalW = 0; this.placed.forEach((b) => totalW += bw(b) + gap); totalW -= gap;
    let x = w / 2 - totalW / 2;
    this.placed.forEach((b) => {
      const bwv = bw(b);
      const blk = window.UI.sentenceBlock(this, x + bwv / 2, this.assemblyY, bwv, bh, b, {});
      blk.setUsed && (blk.hit.disableInteractive());
      this.assemblyContainer.add(blk);
      x += bwv + gap;
    });
  }

  _shuffle(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = arr[i]; arr[i] = arr[j]; arr[j] = t; } return arr; }
}
window.SentencePuzzleScene = SentencePuzzleScene;
