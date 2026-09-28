/* STEP 3 — WORD BUILDER (Game 03). Tap the scrambled letter tiles in the right
 * order to spell each Underground word shown by its picture. A wrong letter
 * loses a life and lets you try again (the answer is never revealed).
 *
 * The letters drop into the EXISTING blue slots of the official word-assembly
 * panel (Pack 04) — no extra frame is drawn on top. The panel has 7 slots, so
 * every word is <= 7 letters and is centred over those slots.
 * The ticket picture is identified as a fictional "LONDON TRAVEL PASS" (serial +
 * decorative barcode), never blank and never a real brand / working code. */
class WordBuilderScene extends ActivityScene {
  constructor() { super("WordBuilderScene"); }

  create() {
    this.buildBase({ phaseKey: "WordBuilder", bgKey: "wordbuilder", stepNumber: 3, titleKey: "wordBuilderTitle", instr: window.S("wordBuilderInstr") });
    this.words = window.PRIME_CONTENT.wordBuilder.words;
    this.wIdx = 0;
    this.loadWord();
  }

  loadWord() {
    const w = this.scale.width, h = this.scale.height, T = window.Theme, CELL = window.UI.CELL;
    if (this._layer) { this._layer.destroy(); this._layer = null; }
    this._layer = this.add.container(0, 0);

    const data = this.words[this.wIdx];
    this.word = data.word.toUpperCase();
    this.nextIndex = 0;
    this.slotEls = [];
    // The slot row ALWAYS has exactly one cell per letter of the round's word.
    const n = this.word.length;

    // --- dynamic slot row: N square blue cells, same size, centred ---
    const availW = w - 220;
    const cell = Math.max(58, Math.min(104, Math.floor((availW - (n - 1) * CELL.GAP) / n)));
    const rowW = n * cell + (n - 1) * CELL.GAP;
    const rowX = w / 2 - rowW / 2 + cell / 2;
    const rowY = h * 0.55;
    const font = Math.round(cell * 0.56);

    // --- picture of the word (above the row) ---
    const picH = 148, picY = rowY - cell / 2 - picH * 0.5 - 12;
    if (window.Art && window.Art.itemExists(this, data.item)) {
      const im = window.Art.item(this, data.item, w / 2, picY, picH, { depth: 5 });
      if (im) {
        this._layer.add(im);
        if (data.item === "ticket") this._decorateTicket(im.x, im.y, im.displayWidth, im.displayHeight);
      }
    }

    for (let i = 0; i < n; i++) {
      const sx = rowX + i * (cell + CELL.GAP);
      this._layer.add(window.UI.emptySlot(this, sx, rowY, cell, cell));
      const t = this.add.text(sx, rowY, "", { fontFamily: T.font, fontSize: font + "px", fontStyle: "bold", color: T.colors.text }).setOrigin(0.5);
      t.setShadow(0, 2, "rgba(0,0,0,0.7)", 5);
      this._layer.add(t);
      this.slotEls.push({ x: sx, y: rowY, txt: t });
    }

    // --- scrambled letter tiles (bottom) ---
    const letters = this.word.split("");
    this._shuffle(letters);
    const tileSize = Math.max(52, Math.min(78, Math.floor((availW - (n - 1) * CELL.GAP) / n)));
    const tW = n * tileSize + (n - 1) * CELL.GAP;
    const tx = w / 2 - tW / 2 + tileSize / 2;
    const ty = h - 78;
    this.tiles = [];
    letters.forEach((ch, i) => {
      const x = tx + i * (tileSize + CELL.GAP);
      const tile = window.UI.letterTile(this, x, ty, tileSize, ch, { onClick: (c) => this.onLetter(c) });
      this._layer.add(tile); this.tiles.push(tile);
    });
  }

  /* Fictional travel pass identity drawn on the (otherwise blank) ticket, aligned
   * to the ticket's tilt. Decorative only — no real brand, no working code. */
  _decorateTicket(cx, cy, dispW, dispH) {
    const T = window.Theme;
    const ang = 9.27 * Math.PI / 180;   // measured tilt of the ticket art
    const c = this.add.container(cx, cy).setDepth(6);
    c.setRotation(ang);
    const title = this.add.text(0, -dispH * 0.10, "LONDON TRAVEL PASS", {
      fontFamily: T.font, fontSize: Math.round(dispW * 0.066) + "px", fontStyle: "bold", color: "#3a2410", align: "center"
    }).setOrigin(0.5);
    c.add(title);
    const serial = this.add.text(0, dispH * 0.03, "SERIAL  LU-0472-8831", {
      fontFamily: T.font, fontSize: Math.round(dispW * 0.040) + "px", fontStyle: "bold", color: "#7a3f1e"
    }).setOrigin(0.5);
    c.add(serial);
    // decorative barcode (non-functional)
    const bc = this.add.graphics();
    const bw = dispW * 0.42, bh = dispH * 0.11, bx = -bw / 2, by = dispH * 0.135;
    let x = bx, k = 7;
    while (x < bx + bw - 1) {
      k = (k * 1103515245 + 12345) & 0x7fffffff;   // deterministic pseudo-widths
      const bar = 1 + (k % 4), gapv = 1 + ((k >> 3) % 3);
      bc.fillStyle(0x241a10, 1); bc.fillRect(x, by, bar, bh);
      x += bar + gapv;
    }
    c.add(bc);
    this._layer.add(c);
  }

  onLetter(tile) {
    if (this._locked || tile.used) return;
    if (tile.ch === this.word[this.nextIndex]) {
      tile.setUsed(true);
      const slot = this.slotEls[this.nextIndex];
      slot.txt.setText(tile.ch);
      slot.txt.setColor(window.Theme.hex(window.Theme.colors.accent2));
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
