/* STEP 2 — MEMORY MATCH (Game 03). Flip two cards to match each picture with
 * its word. A mismatch simply flips the cards back down (a memory miss, the
 * answer is never revealed); matches award points + coins. Finish when every
 * pair is found.
 *
 * A visible digital countdown runs 60 -> 0 while the player picks cards. When it
 * reaches zero it applies ONE fixed score penalty (100 points, coherent with
 * the +100 per correct pair) and the puzzle continues — no cards are revealed,
 * no life is lost, and the penalty never repeats. This countdown is independent
 * from the Timed Final Challenge star rating. */
class MemoryMatchScene extends ActivityScene {
  constructor() { super("MemoryMatchScene"); }

  create() {
    this.buildBase({ phaseKey: "MemoryMatch", bgKey: "memory", stepNumber: 2, titleKey: "memoryTitle", instr: window.S("memoryInstr") });
    const w = this.scale.width, h = this.scale.height;

    // --- Countdown state ---
    this.START_SECONDS = 60;
    this.PENALTY = 100;          // one-off points penalty at 0 (== one correct pair)
    this._cdRemainMs = this.START_SECONDS * 1000;
    this._penaltyApplied = false;

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

    // Grid layout (leave a right margin for the countdown badge)
    const cols = 4, rows = Math.ceil(deck.length / cols);
    const areaTop = 138, areaBottom = h - 24;
    const gapX = 18, gapY = 14;
    const cw = Math.min(150, (w - 210 - (cols - 1) * gapX) / cols);
    const ch = Math.min(150, (areaBottom - areaTop - (rows - 1) * gapY) / rows);
    const gridW = cols * cw + (cols - 1) * gapX;
    const startX = (w - 140) / 2 - gridW / 2 + cw / 2;
    const startY = areaTop + ch / 2;

    this.cards = [];
    deck.forEach((data, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const x = startX + col * (cw + gapX);
      const y = startY + row * (ch + gapY);
      const card = window.UI.memoryCard(this, x, y, cw, ch, data, { onFlip: (c) => this.onFlip(c) });
      this.cards.push(card);
    });

    this._buildCountdown();
    // Native wall-clock timer (independent of the render loop) so the digital
    // countdown always ticks 60 -> 0 for the player.
    this._cdPrev = Date.now();
    this._lastShown = this.START_SECONDS;
    this._cdInterval = setInterval(() => this._cdStep(), 250);
    this.events.once("shutdown", () => this._stopCountdown());
    this.events.once("destroy", () => this._stopCountdown());
  }

  _buildCountdown() {
    const T = window.Theme, w = this.scale.width, h = this.scale.height;
    const cx = w - 82, cy = h * 0.5;
    const c = this.add.container(cx, cy).setDepth(48); this.cdBox = c;
    const bw = 128, bh = 150;
    const g = this.add.graphics();
    g.fillStyle(0x0a0f24, 0.82); g.fillRoundedRect(-bw / 2, -bh / 2, bw, bh, 16);
    g.lineStyle(2, T.colors.accent2, 0.7); g.strokeRoundedRect(-bw / 2, -bh / 2, bw, bh, 16);
    c.add(g);
    if (window.Art && window.Art.itemExists(this, "stopwatch")) {
      const im = window.Art.item(this, "stopwatch", 0, -bh / 2 + 34, 52, { depth: 0 });
      if (im) c.add(im);
    }
    c.add(this.add.text(0, -bh / 2 + 66, window.S("timeLeftShort"), { fontFamily: T.font, fontSize: "13px", color: T.colors.textDim }).setOrigin(0.5));
    this.cdText = this.add.text(0, 18, String(this.START_SECONDS), { fontFamily: T.font, fontSize: "46px", fontStyle: "bold", color: "#7ef0a8" }).setOrigin(0.5);
    this.cdText.setShadow(0, 2, "rgba(0,0,0,0.6)", 6);
    c.add(this.cdText);
  }

  _cdStep() {
    if (!this.sys || !this.sys.isActive() || this._locked) { this._stopCountdown(); return; }
    const now = Date.now(), dt = now - this._cdPrev; this._cdPrev = now;
    if (this.hud && this.hud.paused) return;   // don't count time while paused
    this._cdRemainMs = Math.max(0, this._cdRemainMs - dt);
    const secs = Math.ceil(this._cdRemainMs / 1000);
    if (secs !== this._lastShown && this.cdText) {
      this._lastShown = secs;
      this.cdText.setText(String(secs));
      this.cdText.setColor(secs > 30 ? "#7ef0a8" : secs > 10 ? "#ffd35c" : "#ff6b78");
      if (secs <= 10 && secs > 0) this.tweens.add({ targets: this.cdText, scale: { from: 1.22, to: 1 }, duration: 240 });
    }
    if (this._cdRemainMs <= 0) this._onTimeUp();
  }

  _onTimeUp() {
    if (this.cdText) { this.cdText.setText("0"); this.cdText.setColor("#ff6b78"); }
    if (!this._penaltyApplied) {
      this._penaltyApplied = true;
      window.GameState.applyScorePenalty(this.PENALTY);
      if (this.hud) this.hud.updateScore();
      window.AudioManager.sfx("wrong");
      this.toast(window.S("timeUp", this.PENALTY), false);
    }
    this._stopCountdown();   // freeze at 0, no repeat
  }

  _stopCountdown() { if (this._cdInterval) { clearInterval(this._cdInterval); this._cdInterval = null; } }

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
        if (this.matched >= this.pairsTotal) { this._stopCountdown(); this.time.delayedCall(600, () => this.finishStep()); }
      });
    } else {
      // memory miss: flip both back down (no reveal, no life lost, no sound spam)
      this.time.delayedCall(760, () => { a.flipDown(); b.flipDown(); this.busy = false; });
    }
  }

  _shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
    return arr;
  }
}
window.MemoryMatchScene = MemoryMatchScene;
