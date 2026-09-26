/* STAGE 5 — FILL THE CART (Final Mission). A shopping list + a store shelf.
 * Tap every item on the list; a wrong item costs a life (disabled, list not
 * spoiled). Complete the cart → checkout. Signature shopping mechanic using the
 * inventory slots, shopping bag and confirm elements (Pack 04). */
class FinalScene extends Phaser.Scene {
  constructor() { super("FinalScene"); }

  create() {
    this.T = window.Theme;
    this.phaseKey = "Final";
    this.data = window.PRIME_CONTENT.final;
    this._advancing = false; this._done = false;   // reset por partida (instância reutilizada)
    this.cameras.main.fadeIn(280, 5, 7, 20);
    window.SubtitleManager.mount(this);
    this.T.scene(this, this.data.store || "cart");
    window.AudioManager.playMusic("adventure");
    this.hud = new window.Hud(this, { phaseTitle: window.S("stage") + " 5 · " + window.S("finalTitle") });

    this.needed = this.data.list.map((l) => l.item);
    this.collected = {};
    this.slotIcons = [];

    this.buildList();
    this.buildShelf();
  }

  /* Painel da lista de compras + slots de inventário (esquerda) */
  buildList() {
    const T = this.T, h = this.scale.height;
    const px = 168, py = 300, pw = 288, ph = 392;
    const card = T.card(this, px, py, pw, ph, { border: T.colors.accent2, fill: T.colors.panel });
    // ícone sacola
    if (window.Shop.deco(this, px, py - ph / 2 + 6, 64, "bag")) { /* sacola oficial */ }
    this.add.text(px, py - ph / 2 + 44, window.S("yourCart"), {
      fontFamily: T.font, fontSize: "20px", fontStyle: "bold", color: T.hex(T.colors.accent2)
    }).setOrigin(0.5);

    // itens da lista (checkbox + label)
    this.listLabels = {};
    this.data.list.forEach((l, i) => {
      const ly = py - ph / 2 + 84 + i * 40;
      const box = this.add.text(px - pw / 2 + 26, ly, "☐", { fontFamily: T.font, fontSize: "22px", color: T.colors.textDim }).setOrigin(0, 0.5);
      const lab = this.add.text(px - pw / 2 + 54, ly, l.label, { fontFamily: T.font, fontSize: "19px", fontStyle: "bold", color: T.colors.text }).setOrigin(0, 0.5);
      this.listLabels[l.item] = { box, lab };
    });

    // slots de inventário (3) na base do painel
    const slotY = py + ph / 2 - 54;
    const n = this.needed.length, sw = 62, gap = 14, totalW = n * sw + (n - 1) * gap;
    const sx = px - totalW / 2 + sw / 2;
    this.slotSlots = [];
    for (let i = 0; i < n; i++) {
      const x = sx + i * (sw + gap);
      const g = this.add.graphics();
      g.lineStyle(2, T.colors.accent, 0.6); g.fillStyle(0x0a0f24, 0.5);
      g.fillRoundedRect(x - sw / 2, slotY - sw / 2, sw, sw, 10); g.strokeRoundedRect(x - sw / 2, slotY - sw / 2, sw, sw, 10);
      this.slotSlots.push({ x, y: slotY });
    }
  }

  /* Prateleira da loja (grade de itens à direita) */
  buildShelf() {
    const T = this.T, w = this.scale.width;
    const grid = this.data.grid.slice();
    const cols = 4, cardW = 158, cardH = 138, gapX = 40, gapY = 26;
    const rows = Math.ceil(grid.length / cols);
    const totalW = cols * cardW + (cols - 1) * gapX;
    const regionCX = (356 + w) / 2;
    const startX = regionCX - totalW / 2 + cardW / 2;
    const startY = 170;
    this.shelfCards = [];
    grid.forEach((key, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const cx = startX + col * (cardW + gapX);
      const cy = startY + row * (cardH + gapY);
      const card = this.makeShelfCard(cx, cy, cardW, cardH, key);
      this.shelfCards.push(card);
    });

    this.feedback = this.add.text(regionCX, this.scale.height - 26, "", { fontFamily: T.font, fontSize: "20px", fontStyle: "bold", align: "center" }).setOrigin(0.5);
  }

  makeShelfCard(x, y, w, h, itemKey) {
    const T = this.T;
    const c = this.add.container(x, y); c.state = "default"; c.key = itemKey;
    const g = this.add.graphics(); c.add(g);
    const draw = (state) => {
      g.clear();
      const border = state === "correct" ? T.colors.good : state === "wrong" ? T.colors.bad : (state === "hover" ? T.colors.accent2 : T.colors.accent);
      g.fillStyle(0x000000, 0.34); g.fillRoundedRect(-w / 2 + 3, -h / 2 + 6, w, h, 16);
      g.fillStyle(T.colors.panelLight, 0.9); g.fillRoundedRect(-w / 2, -h / 2, w, h, 16);
      g.lineStyle(state === "default" ? 2 : 4, border, state === "default" ? 0.6 : 1); g.strokeRoundedRect(-w / 2, -h / 2, w, h, 16);
      g.fillStyle(0xffffff, 0.05); g.fillRoundedRect(-w / 2, -h / 2, w, h * 0.4, { tl: 16, tr: 16, bl: 0, br: 0 });
    };
    draw("default");
    const im = window.Art.item(this, itemKey, 0, -2, h * 0.72, { originX: 0.5, originY: 0.5, depth: 5 });
    if (im) c.add(im);
    c.setCardState = (st) => { c.state = st; draw(st); };
    c.setSize(w, h);
    const hit = this.add.zone(0, 0, w, h).setOrigin(0.5).setInteractive({ useHandCursor: true });
    c.add(hit); c.hit = hit;
    hit.on("pointerover", () => { if (c.state === "default") { draw("hover"); window.AudioManager.sfx("hover"); } });
    hit.on("pointerout", () => { if (c.state === "default") draw("default"); });
    hit.on("pointerup", () => { if (c.state === "default" || c.state === "hover") this.pick(c); });
    return c;
  }

  pick(card) {
    if (this._done) return;
    const T = this.T;
    const key = card.key;
    const onList = this.needed.indexOf(key) >= 0 && !this.collected[key];
    if (onList) {
      this.collected[key] = true;
      card.setCardState("correct"); if (card.hit) card.hit.disableInteractive();
      window.GameState.registerCorrect(this.phaseKey); this.hud.updateScore();
      window.AudioManager.sfx("correct");
      // marca a lista
      const ll = this.listLabels[key];
      if (ll) { ll.box.setText("☑").setColor(T.hex(T.colors.good)); ll.lab.setColor(T.hex(T.colors.good)); }
      // preenche o próximo slot com miniatura
      const idx = Object.keys(this.collected).length - 1;
      const slot = this.slotSlots[idx];
      if (slot) { const im = window.Art.item(this, key, slot.x, slot.y, 52, { originX: 0.5, originY: 0.5, depth: 8 }); if (im) this.slotIcons.push(im); }
      this.feedback.setColor(T.hex(T.colors.good)); this.feedback.setText(window.S("addToCart"));

      if (Object.keys(this.collected).length >= this.needed.length) this.complete();
    } else if (this.needed.indexOf(key) >= 0 && this.collected[key]) {
      // já coletado (não deveria ser clicável) — ignora
    } else {
      card.setCardState("wrong"); if (card.hit) card.hit.disableInteractive();
      window.GameState.loseLife(this.phaseKey); this.hud.updateScore();
      window.AudioManager.sfx("wrong"); T.flashFeedback(this, false);
      this.feedback.setColor(T.hex(T.colors.bad)); this.feedback.setText(window.S("notOnList"));
      if (window.GameState.isGameOver()) { this.time.delayedCall(900, () => this.scene.start("ResultScene", { gameOver: true })); }
    }
  }

  complete() {
    this._done = true;
    const T = this.T, w = this.scale.width, h = this.scale.height;
    this.shelfCards.forEach((c) => c.hit && c.hit.disableInteractive());
    T.flashFeedback(this, true);
    this.feedback.setColor(T.hex(T.colors.good)); this.feedback.setText(window.S("cartFull"));
    window.Shop.button(this, (356 + w) / 2, h - 66, 280, 54, window.S("checkout"), { fontSize: 22, onClick: () => this.advance() });
  }

  advance() {
    if (this._advancing) return; this._advancing = true;
    window.Flow.completePhase(this, this.phaseKey);
  }
}
window.FinalScene = FinalScene;
