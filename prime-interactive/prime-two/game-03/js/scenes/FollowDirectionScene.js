/* STEP 5 — FOLLOW THE DIRECTION (Game 03). Read the instruction and choose the
 * matching arrow (left / straight / right) on the route-choice panel. A wrong
 * arrow loses a life and lets you try again; the answer is never revealed. */
class FollowDirectionScene extends ActivityScene {
  constructor() { super("FollowDirectionScene"); }

  create() {
    this.buildBase({ phaseKey: "FollowDirection", bgKey: "direction", stepNumber: 5, titleKey: "directionTitle", instr: window.S("directionInstr") });
    this.items = window.PRIME_CONTENT.direction.items;
    this.qIdx = 0;
    this.loadItem();
  }

  loadItem() {
    const w = this.scale.width, h = this.scale.height, T = window.Theme;
    if (this._layer) { this._layer.destroy(); this._layer = null; }
    this._layer = this.add.container(0, 0);
    this._answered = false;

    const data = this.items[this.qIdx];

    this._layer.add(this.add.text(w / 2, 128, window.S("questionOf", this.qIdx + 1, this.items.length), {
      fontFamily: T.font, fontSize: "14px", color: T.colors.textDim
    }).setOrigin(0.5));

    // route-choice panel + instruction
    this._layer.add(window.UI.panel(this, w / 2, h * 0.30, 620, 96, "route"));
    this._layer.add(this.add.text(w / 2, h * 0.30, data.instruction, {
      fontFamily: T.font, fontSize: "26px", fontStyle: "bold", color: "#f6f9ff", align: "center", wordWrap: { width: 560 }
    }).setOrigin(0.5).setShadow(0, 2, "rgba(0,0,0,0.85)", 7));

    // three arrows
    const dirs = [
      { key: "left", item: "arrow_left" },
      { key: "straight", item: "arrow_straight" },
      { key: "right", item: "arrow_right" }
    ];
    const bw = 220, gap = 40, totalW = dirs.length * bw + (dirs.length - 1) * gap;
    const startX = w / 2 - totalW / 2 + bw / 2;
    const y = h * 0.64;
    this.choices = [];
    dirs.forEach((d, i) => {
      const x = startX + i * (bw + gap);
      const c = this.add.container(x, y);
      const plate = this.add.graphics();
      plate.fillStyle(0x0c1330, 0.55); plate.fillRoundedRect(-bw / 2, -70, bw, 150, 16);
      plate.lineStyle(2, T.colors.accent, 0.5); plate.strokeRoundedRect(-bw / 2, -70, bw, 150, 16);
      c.add(plate); c._plate = plate; c._bw = bw;
      if (window.Art && window.Art.itemExists(this, d.item)) {
        const im = window.Art.item(this, d.item, 0, 0, 118, { depth: 5 });
        if (im) c.add(im);
      } else {
        c.add(this.add.text(0, 0, d.key === "left" ? "⬅" : d.key === "right" ? "➡" : "⬆", { fontFamily: T.font, fontSize: "72px", color: T.hex(T.colors.accent2) }).setOrigin(0.5));
      }
      const hit = this.add.zone(0, 4, bw, 150).setOrigin(0.5).setInteractive({ useHandCursor: true });
      c.add(hit); c._hit = hit;
      hit.on("pointerover", () => { if (c._done) return; this.tweens.add({ targets: c, scale: 1.05, duration: 100 }); window.AudioManager.sfx("hover"); });
      hit.on("pointerout", () => { if (c._done) return; this.tweens.add({ targets: c, scale: 1.0, duration: 100 }); });
      hit.on("pointerup", () => this.choose(d.key, c));
      this._layer.add(c); this.choices.push(c);
    });
  }

  _recolor(c, colour) {
    c._plate.clear();
    c._plate.fillStyle(colour, 0.28); c._plate.fillRoundedRect(-c._bw / 2, -70, c._bw, 150, 16);
    c._plate.lineStyle(3, colour, 0.95); c._plate.strokeRoundedRect(-c._bw / 2, -70, c._bw, 150, 16);
  }

  choose(key, c) {
    if (this._locked || this._answered || c._done) return;
    const data = this.items[this.qIdx], T = window.Theme;
    if (key === data.answer) {
      this._answered = true;
      this.choices.forEach((x) => { x._done = true; x._hit.disableInteractive(); });
      this._recolor(c, T.colors.good);
      const ic = window.UI.iconImg(this, c._bw / 2 - 24, -60, 34, "correct"); if (ic) c.add(ic);
      this.registerCorrect();
      this.toast(window.S("correct"), true);
      this.qIdx++;
      if (this.qIdx >= this.items.length) this.time.delayedCall(850, () => this.finishStep());
      else this.time.delayedCall(850, () => this.loadItem());
    } else {
      c._done = true; c._hit.disableInteractive();
      this._recolor(c, T.colors.bad);
      const ic = window.UI.iconImg(this, c._bw / 2 - 24, -60, 34, "retry"); if (ic) c.add(ic);
      this.registerWrong();
    }
  }
}
window.FollowDirectionScene = FollowDirectionScene;
