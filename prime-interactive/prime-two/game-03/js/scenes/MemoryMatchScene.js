/* STEP 2 — MEMORY MATCH (Game 03). Flip two cards to match each picture with
 * its word. A mismatch simply flips the cards back down (a memory miss, the
 * answer is never revealed); matches award points + coins. Finish when every
 * pair is found. */
class MemoryMatchScene extends ActivityScene {
  constructor() { super("MemoryMatchScene"); }

  create() {
    this.buildBase({ phaseKey: "MemoryMatch", bgKey: "memory", stepNumber: 2, titleKey: "memoryTitle", instr: window.S("memoryInstr") });
    const w = this.scale.width, h = this.scale.height;

    const pairs = window.PRIME_CONTENT.memory.pairs;
    // Build the deck: one picture card + one word card per pair.
    let deck = [];
    pairs.forEach((p) => {
      deck.push({ key: p.key, type: "image", item: p.item, word: p.word });
      deck.push({ key: p.key, type: "word", item: p.item, word: p.word });
    });
    this._shuffle(deck);

    this.pairsTotal = pairs.length;
    this.matched = 0;
    this.first = null; this.busy = false;

    // Grid layout
    const cols = 4, rows = Math.ceil(deck.length / cols);
    const areaTop = 138, areaBottom = h - 24;
    const gapX = 18, gapY = 14;
    const cw = Math.min(158, (w - 120 - (cols - 1) * gapX) / cols);
    const ch = Math.min(150, (areaBottom - areaTop - (rows - 1) * gapY) / rows);
    const gridW = cols * cw + (cols - 1) * gapX;
    const startX = w / 2 - gridW / 2 + cw / 2;
    const startY = areaTop + ch / 2;

    this.cards = [];
    deck.forEach((data, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const x = startX + col * (cw + gapX);
      const y = startY + row * (ch + gapY);
      const card = window.UI.memoryCard(this, x, y, cw, ch, data, { onFlip: (c) => this.onFlip(c) });
      this.cards.push(card);
    });
  }

  onFlip(card) {
    if (this.busy || this._locked || card.faceUp || card.matched) return;
    card.flipUp();
    window.AudioManager.sfx("click");
    if (!this.first) { this.first = card; return; }
    // second card
    this.busy = true;
    const a = this.first, b = card; this.first = null;
    if (a.cardData.key === b.cardData.key) {
      this.time.delayedCall(280, () => {
        a.setMatched(); b.setMatched();
        this.matched++;
        this.registerCorrect();
        this.toast(window.S("matchFound"), true);
        this.busy = false;
        if (this.matched >= this.pairsTotal) this.time.delayedCall(600, () => this.finishStep());
      });
    } else {
      // memory miss: flip both back down (no reveal, no life lost)
      window.AudioManager.sfx("hover");
      this.time.delayedCall(760, () => { a.flipDown(); b.flipDown(); this.busy = false; });
    }
  }

  _shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
    return arr;
  }
}
window.MemoryMatchScene = MemoryMatchScene;
