/* STEP 6 — SHOPPING BAG. Add every item on the list to the bag, VIEW them in
 * the inventory slots, and REMOVE one by tapping its slot. A wrong item (not on
 * the list) costs a life (answer not revealed). Complete the bag → checkout. */
class ShoppingBagScene extends Phaser.Scene {
  constructor() { super("ShoppingBagScene"); }

  create() {
    this.T = window.Theme;
    this.phaseKey = "ShoppingBag";
    this.data = window.PRIME_CONTENT.shoppingBag;
    this._advancing = false; this._done = false;   // reset por partida
    this.cameras.main.fadeIn(280, 5, 7, 20);
    window.SubtitleManager.mount(this);
    this.T.scene(this, this.data.store || "cart");
    window.AudioManager.playMusic("adventure");
    this.hud = new window.Hud(this, { phaseTitle: window.S("stage") + " 6 · " + window.S("shoppingBagTitle") });

    this.needed = this.data.list.map((l) => l.item);
    this.scored = {};                 // keys already scored (no double-count on re-add)
    this.slots = [];                  // { x, y, key, icon }

    this.buildList();
    this.buildShelf();
  }

  buildList() {
    const T = this.T;
    const px = 168, py = 300, pw = 288, ph = 392;
    T.card(this, px, py, pw, ph, { border: T.colors.accent2, fill: T.colors.panel });
    if (window.Shop.deco(this, px, py - ph / 2 + 6, 64, "bag")) { /* sacola oficial */ }
    this.add.text(px, py - ph / 2 + 44, window.S("yourBag"), {
      fontFamily: T.font, fontSize: "20px", fontStyle: "bold", color: T.hex(T.colors.accent2)
    }).setOrigin(0.5);

    this.listLabels = {};
    this.data.list.forEach((l, i) => {
      const ly = py - ph / 2 + 84 + i * 38;
      const box = this.add.text(px - pw / 2 + 26, ly, "☐", { fontFamily: T.font, fontSize: "22px", color: T.colors.textDim }).setOrigin(0, 0.5);
      const lab = this.add.text(px - pw / 2 + 54, ly, l.label, { fontFamily: T.font, fontSize: "18px", fontStyle: "bold", color: T.colors.text }).setOrigin(0, 0.5);
      this.listLabels[l.item] = { box, lab };
    });

    // slots de inventário (toque para remover)
    const slotY = py + ph / 2 - 72;
    const n = this.needed.length, sw = 64, gap = 14, totalW = n * sw + (n - 1) * gap;
    const sx = px - totalW / 2 + sw / 2;
    for (let i = 0; i < n; i++) {
      const x = sx + i * (sw + gap);
      const g = this.add.graphics();
      const drawSlot = (hot) => { g.clear(); g.lineStyle(2, hot ? T.colors.bad : T.colors.accent, hot ? 1 : 0.6); g.fillStyle(0x0a0f24, 0.5); g.fillRoundedRect(x - sw / 2, slotY - sw / 2, sw, sw, 10); g.strokeRoundedRect(x - sw / 2, slotY - sw / 2, sw, sw, 10); };
      drawSlot(false);
      const slot = { x, y: slotY, key: null, icon: null, g, drawSlot };
      const hit = this.add.zone(x, slotY, sw, sw).setOrigin(0.5).setInteractive({ useHandCursor: true });
      hit.on("pointerover", () => { if (slot.key) drawSlot(true); });
      hit.on("pointerout", () => drawSlot(false));
      hit.on("pointerup", () => { if (slot.key && !this._done) this.removeFromBag(slot); });
      this.slots.push(slot);
    }

    this.hint = this.add.text(px, py + ph / 2 - 22, window.S("tapToRemove"), {
      fontFamily: T.font, fontSize: "11px", color: T.colors.textDim, align: "center", wordWrap: { width: pw - 30 }
    }).setOrigin(0.5);
  }

  buildShelf() {
    const T = this.T, w = this.scale.width;
    const grid = this.data.grid.slice();
    const cols = 4, cardW = 158, cardH = 138, gapX = 40, gapY = 26;
    const totalW = cols * cardW + (cols - 1) * gapX;
    const regionCX = (356 + w) / 2;
    const startX = regionCX - totalW / 2 + cardW / 2;
    const startY = 170;
    this.shelfCards = {};
    grid.forEach((key, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const cx = startX + col * (cardW + gapX);
      const cy = startY + row * (cardH + gapY);
      const card = window.ShopCards.itemCard(this, cx, cy, cardW, cardH, key, () => this.pick(card));
      this.shelfCards[key + "_" + i] = card; card._gridId = key + "_" + i;
    });
    this.regionCX = regionCX;
    this.feedback = this.add.text(regionCX, this.scale.height - 26, "", { fontFamily: T.font, fontSize: "20px", fontStyle: "bold", align: "center" }).setOrigin(0.5);
  }

  firstEmptySlot() { return this.slots.find((s) => !s.key); }
  bagHasAllNeeded() { return this.needed.every((k) => this.slots.some((s) => s.key === k)); }

  pick(card) {
    if (this._done) return;
    const T = this.T;
    const key = card.key;
    const alreadyInBag = this.slots.some((s) => s.key === key);
    const onList = this.needed.indexOf(key) >= 0;
    if (onList && !alreadyInBag) {
      const slot = this.firstEmptySlot();
      if (!slot) return;
      card.setCardState("correct"); if (card.hit) card.hit.disableInteractive();
      slot.key = key;
      slot.icon = window.Art.item(this, key, slot.x, slot.y, 52, { originX: 0.5, originY: 0.5, depth: 8 });
      const ll = this.listLabels[key]; if (ll) { ll.box.setText("☑").setColor(T.hex(T.colors.good)); ll.lab.setColor(T.hex(T.colors.good)); }
      if (!this.scored[key]) { this.scored[key] = true; window.GameState.registerCorrect(this.phaseKey); this.hud.updateScore(); }
      window.AudioManager.sfx("correct");
      this.feedback.setColor(T.hex(T.colors.good)); this.feedback.setText(window.S("addToBag"));
      if (this.bagHasAllNeeded()) this.complete();
    } else if (onList && alreadyInBag) {
      // já está na bolsa — sem efeito
    } else {
      card.setCardState("wrong"); if (card.hit) card.hit.disableInteractive();
      window.GameState.loseLife(this.phaseKey); this.hud.updateScore();
      window.AudioManager.sfx("wrong"); T.flashFeedback(this, false);
      this.feedback.setColor(T.hex(T.colors.bad)); this.feedback.setText(window.S("notOnList"));
      if (window.GameState.isGameOver()) { this.time.delayedCall(900, () => this.scene.start("ResultScene", { gameOver: true })); }
    }
  }

  removeFromBag(slot) {
    const T = this.T;
    const key = slot.key;
    if (slot.icon) { slot.icon.destroy(); slot.icon = null; }
    slot.key = null; slot.drawSlot(false);
    const ll = this.listLabels[key]; if (ll) { ll.box.setText("☐").setColor(T.colors.textDim); ll.lab.setColor(T.colors.text); }
    // reabilita o card da prateleira desse item
    Object.values(this.shelfCards).forEach((c) => { if (c.key === key && c.state === "correct") { c.setCardState("default"); if (c.hit) c.hit.setInteractive({ useHandCursor: true }); } });
    window.AudioManager.sfx("click");
    this.feedback.setColor(T.hex(T.colors.accent2)); this.feedback.setText(window.S("removed"));
  }

  complete() {
    this._done = true;
    const T = this.T, w = this.scale.width, h = this.scale.height;
    Object.values(this.shelfCards).forEach((c) => c.hit && c.hit.disableInteractive());
    T.flashFeedback(this, true);
    this.feedback.setColor(T.hex(T.colors.good)); this.feedback.setText(window.S("bagComplete"));
    window.Shop.button(this, this.regionCX, h - 64, 300, 54, window.S("goCheckout"), { fontSize: 22, onClick: () => this.advance() });
  }

  advance() {
    if (this._advancing) return; this._advancing = true;
    window.Flow.completePhase(this, this.phaseKey);
  }
}
window.ShoppingBagScene = ShoppingBagScene;
