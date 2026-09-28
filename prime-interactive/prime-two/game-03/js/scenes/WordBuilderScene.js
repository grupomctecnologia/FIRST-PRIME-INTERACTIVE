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
    // Slot centres measured from the official panel (g03-ui-word-assembly-slots).
    this.SLOT_FX = [0.1517, 0.2670, 0.3837, 0.5000, 0.6151, 0.7318, 0.8469];
    this.SLOT_FY = 0.491;           // vertical centre of the blue slots
    this.SLOTS = this.SLOT_FX.length;
    this.PANEL_AR = 724 / 2172;     // panel height / width
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
    const n = Math.min(this.word.length, this.SLOTS);

    // --- word-assembly panel (official) geometry ---
    const panelW = Math.min(w - 200, 700);
    const panelH = panelW * this.PANEL_AR;
    const panelCx = w / 2, panelCy = h * 0.60;
    const panelLeft = panelCx - panelW / 2, panelTop = panelCy - panelH / 2;

    // --- picture of the word (above the panel) ---
    const picH = 150, picY = panelTop - picH * 0.55;
    if (window.Art && window.Art.itemExists(this, data.item)) {
      const im = window.Art.item(this, data.item, w / 2, picY, picH, { depth: 5 });
      if (im) {
        this._layer.add(im);
        if (data.item === "ticket") this._decorateTicket(im.x, im.y, im.displayWidth, im.displayHeight);
      }
    }

    // --- official panel with its real blue slots ---
    this._layer.add(window.UI.panel(this, panelCx, panelCy, panelW, panelH, "word"));

    // --- letters go INTO the existing slots (centred, no extra frame drawn) ---
    const start = Math.floor((this.SLOTS - n) / 2);
    const pitchPx = (this.SLOT_FX[1] - this.SLOT_FX[0]) * panelW;
    const font = Math.round(Math.min(pitchPx * 0.52, panelH * 0.30));
    const slotY = panelTop + this.SLOT_FY * panelH;
    for (let i = 0; i < n; i++) {
      const sx = panelLeft + this.SLOT_FX[start + i] * panelW;
      const t = this.add.text(sx, slotY, "", { fontFamily: T.font, fontSize: font + "px", fontStyle: "bold", color: T.colors.text }).setOrigin(0.5);
      t.setShadow(0, 2, "rgba(0,0,0,0.7)", 5);
      this._layer.add(t);
      this.slotEls.push({ x: sx, y: slotY, txt: t });
    }

    // --- scrambled letter tiles (bottom) ---
    const letters = this.word.split("");
    this._shuffle(letters);
    const tileSize = Math.min(72, (w - 220) / n - 8);
    const tgap = 14;
    const tW = n * tileSize + (n - 1) * tgap;
    const tx = w / 2 - tW / 2 + tileSize / 2;
    const ty = h - 82;
    this.tiles = [];
    letters.forEach((ch, i) => {
      const x = tx + i * (tileSize + tgap);
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
