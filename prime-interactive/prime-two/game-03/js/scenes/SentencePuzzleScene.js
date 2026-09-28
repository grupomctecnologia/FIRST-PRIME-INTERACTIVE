/* STEP 6 — SENTENCE PUZZLE (Game 03). Tap the word blocks in the correct order
 * to build each sentence. A wrong block loses a life and lets you try again (the
 * answer is never revealed).
 *
 * Component matches Step 3's measure (same height / padding / spacing). Each
 * block's width is dynamic — measured from its text with comfortable side
 * padding, so short and long words differ and nothing is compressed or clipped.
 * The empty assembly slots have exactly the same width as the block that fills
 * them. The sentence is centred and wraps to two lines when it is too wide. */
class SentencePuzzleScene extends ActivityScene {
  constructor() { super("SentencePuzzleScene"); }

  create() {
    this.buildBase({ phaseKey: "SentencePuzzle", bgKey: "sentence", stepNumber: 6, titleKey: "sentenceTitle", instr: window.S("sentenceInstr") });
    this.sentences = window.PRIME_CONTENT.sentence.sentences;
    this.sIdx = 0;
    this.loadSentence();
  }

  loadSentence() {
    const w = this.scale.width, h = this.scale.height, T = window.Theme, CELL = window.UI.CELL;
    if (this._layer) { this._layer.destroy(); this._layer = null; }
    this._layer = this.add.container(0, 0);

    const data = this.sentences[this.sIdx];
    this.solution = data.blocks;
    this.nextIndex = 0;
    this.H = CELL.H; this.FONT = CELL.FONT;

    this._layer.add(this.add.text(w / 2, 122, window.S("questionOf", this.sIdx + 1, this.sentences.length), {
      fontFamily: T.font, fontSize: "14px", color: T.colors.textDim
    }).setOrigin(0.5));

    // dynamic width per word (measured text + comfortable side padding)
    const widthOf = (word) => Math.max(64, Math.round(window.UI.measureText(this, word, this.FONT) + CELL.PAD * 2));
    const availW = w - 120;

    // --- assembly slots (targets), in solution order, wrapping if needed ---
    const solW = this.solution.map(widthOf);
    this.assemblyPos = this._layoutRow(solW, availW, CELL.GAP, h * 0.37, this.H, w);
    this.assemblyContainer = this.add.container(0, 0); this._layer.add(this.assemblyContainer);
    this.solution.forEach((word, i) => {
      const p = this.assemblyPos[i];
      this._layer.add(window.UI.emptySlot(this, p.x, p.y, p.w, this.H));
    });

    // --- shuffled draggable blocks (same measure), wrapping if needed ---
    const order = this.solution.map((b, i) => i);
    this._shuffle(order);
    const blkW = order.map((i) => solW[i]);
    const blkPos = this._layoutRow(blkW, availW, CELL.GAP, h * 0.78, this.H, w);
    this.blocks = [];
    order.forEach((solIdx, k) => {
      const word = this.solution[solIdx], p = blkPos[k];
      const block = window.UI.filledBlock(this, p.x, p.y, p.w, this.H, word, this.FONT, { onClick: (c) => this.onBlock(c) });
      block._solIndex = solIdx;
      this._layer.add(block); this.blocks.push(block);
    });
  }

  /* Greedy wrap of variable-width cells into <=2 centred lines. Returns [{x,y,w}]. */
  _layoutRow(widths, availW, gap, cy, H, w) {
    const lines = [[]]; let lineW = 0;
    widths.forEach((wd, i) => {
      const cur = lines[lines.length - 1];
      const add = wd + (cur.length ? gap : 0);
      if (lineW + add > availW && cur.length) { lines.push([]); lineW = 0; }
      const line = lines[lines.length - 1];
      line.push({ i, w: wd });
      lineW += wd + (line.length > 1 ? gap : 0);
    });
    const lineGap = 16, lineH = H + lineGap;
    const totalH = lines.length * H + (lines.length - 1) * lineGap;
    const startY = cy - totalH / 2 + H / 2;
    const pos = [];
    lines.forEach((line, li) => {
      let tw = 0; line.forEach((c, k) => tw += c.w + (k ? gap : 0));
      let x = w / 2 - tw / 2;
      const y = startY + li * lineH;
      line.forEach((c) => { pos[c.i] = { x: x + c.w / 2, y, w: c.w }; x += c.w + gap; });
    });
    return pos;
  }

  onBlock(block) {
    if (this._locked || block.used) return;
    if (block.word === this.solution[this.nextIndex]) {
      block.setUsed(true);
      const p = this.assemblyPos[this.nextIndex];
      const placed = window.UI.filledBlock(this, p.x, p.y, p.w, this.H, block.word, this.FONT, {});
      this.assemblyContainer.add(placed);
      this.tweens.add({ targets: placed, scale: { from: 0.6, to: 1 }, duration: 220, ease: "Back.out" });
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

  _shuffle(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = arr[i]; arr[i] = arr[j]; arr[j] = t; } return arr; }
}
window.SentencePuzzleScene = SentencePuzzleScene;
