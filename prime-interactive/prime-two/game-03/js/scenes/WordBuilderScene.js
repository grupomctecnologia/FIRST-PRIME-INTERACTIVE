/* STEP 3 — WORD BUILDER (Game 03). Tap the scrambled letter tiles in the right
 * order to spell each Underground word shown by its picture. A wrong letter
 * loses a life and lets you try again (the answer is never revealed). */
class WordBuilderScene extends ActivityScene {
  constructor() { super("WordBuilderScene"); }

  create() {
    this.buildBase({ phaseKey: "WordBuilder", bgKey: "wordbuilder", stepNumber: 3, titleKey: "wordBuilderTitle", instr: window.S("wordBuilderInstr") });
    this.words = window.PRIME_CONTENT.wordBuilder.words;
    this.wIdx = 0;
    this.loadWord();
  }

  loadWord() {
    const w = this.scale.width, h = this.scale.height, T = window.Theme;
    if (this._layer) { this._layer.destroy(); this._layer = null; }
    this._layer = this.add.container(0, 0);

    const data = this.words[this.wIdx];
    this.word = data.word.toUpperCase();
    this.nextIndex = 0;
    this.slotEls = [];

    // picture of the word
    if (window.Art && window.Art.itemExists(this, data.item)) {
      const im = window.Art.item(this, data.item, w / 2, 190, 150, { depth: 5 });
      if (im) this._layer.add(im);
    }

    // slots panel + slots
    const n = this.word.length;
    const slotSize = Math.min(70, (w - 200) / n - 10);
    const gap = 12;
    const totalW = n * slotSize + (n - 1) * gap;
    const sx = w / 2 - totalW / 2 + slotSize / 2;
    const sy = h * 0.56;
    this._layer.add(window.UI.panel(this, w / 2, sy, totalW + 60, slotSize + 34, "word"));
    for (let i = 0; i < n; i++) {
      const x = sx + i * (slotSize + gap);
      const g = this.add.graphics();
      g.lineStyle(2, T.colors.accent2, 0.7); g.strokeRoundedRect(x - slotSize / 2, sy - slotSize / 2, slotSize, slotSize, 10);
      this._layer.add(g);
      const t = this.add.text(x, sy, "", { fontFamily: T.font, fontSize: Math.round(slotSize * 0.5) + "px", fontStyle: "bold", color: T.colors.text }).setOrigin(0.5);
      this._layer.add(t);
      this.slotEls.push({ x, y: sy, txt: t });
    }

    // scrambled letter tiles
    const letters = this.word.split("");
    this._shuffle(letters);
    // guard: avoid exact same order for short words
    const tileSize = Math.min(70, (w - 220) / n - 8);
    const tgap = 14;
    const tW = n * tileSize + (n - 1) * tgap;
    const tx = w / 2 - tW / 2 + tileSize / 2;
    const ty = h - 90;
    this.tiles = [];
    letters.forEach((ch, i) => {
      const x = tx + i * (tileSize + tgap);
      const tile = window.UI.letterTile(this, x, ty, tileSize, ch, { onClick: (c) => this.onLetter(c) });
      this._layer.add(tile); this.tiles.push(tile);
    });
  }

  onLetter(tile) {
    if (this._locked || tile.used) return;
    if (tile.ch === this.word[this.nextIndex]) {
      tile.setUsed(true);
      const slot = this.slotEls[this.nextIndex];
      slot.txt.setText(tile.ch);
      slot.txt.setColor(window.Theme.hex(window.Theme.colors.good));
      this.tweens.add({ targets: slot.txt, scale: { from: 1.6, to: 1 }, duration: 200, ease: "Back.out" });
      window.AudioManager.sfx("click");
      this.nextIndex++;
      if (this.nextIndex >= this.word.length) {
        this.registerCorrect();
        this.toast(window.S("correct"), true);
        this.wIdx++;
        if (this.wIdx >= this.words.length) this.time.delayedCall(800, () => this.finishStep());
        else this.time.delayedCall(800, () => this.loadWord());
      }
    } else {
      this.registerWrong();
    }
  }

  _shuffle(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = arr[i]; arr[i] = arr[j]; arr[j] = t; } return arr; }
}
window.WordBuilderScene = WordBuilderScene;
