/* STAGE 5 — LANGUAGE CHALLENGE (English). Drag/tap words to build the sentence. */
class LanguageScene extends Phaser.Scene {
  constructor() { super("LanguageScene"); }

  create() {
    this.T = window.Theme;
    this.phaseKey = "Language";
    this.items = window.PRIME_CONTENT.language.items;
    this.idx = 0;
    this.cameras.main.fadeIn(300, 5, 7, 20);
    window.SubtitleManager.mount(this);
    this.T.background(this, 1);
    this.T.particles(this, this.T.colors.accent2);
    window.AudioManager.playMusic("adventure");
    this.hud = new window.Hud(this, { phaseTitle: "STAGE 5 · Language Challenge" });
    this.stage = this.add.container(0, 0);
    this.render();
  }

  render() {
    this.stage.removeAll(true);
    const T = this.T, w = this.scale.width;
    const item = this.items[this.idx];
    this.item = item; this.built = []; this.answered = false;
    this.progressDots(w / 2, 66, this.items.length, this.idx);

    this.stage.add(this.add.text(w / 2, 100, window.PRIME_CONTENT.language.intro, {
      fontFamily: T.font, fontSize: "22px", fontStyle: "bold", color: T.colors.text, align: "center", wordWrap: { width: w - 120 }
    }).setOrigin(0.5));

    this.answerZone = { x: w / 2, y: 172, w: w - 150, h: 76 };
    const z = this.answerZone;
    this.stage.add(this.add.text(z.x, z.y - z.h / 2 - 16, "Your sentence (tap/drag the words here):", {
      fontFamily: T.font, fontSize: "13px", color: T.colors.textDim
    }).setOrigin(0.5));
    const zg = this.add.graphics();
    zg.fillStyle(T.colors.panel, 0.6); zg.fillRoundedRect(z.x - z.w / 2, z.y - z.h / 2, z.w, z.h, 14);
    zg.lineStyle(2, T.colors.accent, 0.5); zg.strokeRoundedRect(z.x - z.w / 2, z.y - z.h / 2, z.w, z.h, 14);
    this.stage.add(zg);

    this.pool = Phaser.Utils.Array.Shuffle(item.words.slice());
    this.poolContainer = this.add.container(0, 0); this.stage.add(this.poolContainer);
    this.builtContainer = this.add.container(0, 0); this.stage.add(this.builtContainer);
    this.layoutPool(); this.layoutBuilt();

    this.actionBtns = [];
    const check = T.button(this, w / 2 - 200, 356, 190, 52, "✓  Check", { onClick: () => this.check() });
    const clear = T.button(this, w / 2, 356, 150, 52, "↺  Clear", { color: T.colors.panelLight, color2: T.colors.panel, textColor: T.colors.text, onClick: () => this.clearBuilt() });
    const hint = T.button(this, w / 2 + 190, 356, 190, 52, "💡  Hint", { color: T.colors.accent2, color2: 0xff9f43, textColor: "#06121f", onClick: () => this.showHint() });
    this.stage.add(check); this.stage.add(clear); this.stage.add(hint);
    this.actionBtns = [check, clear, hint];

    this.feedback = this.add.text(w / 2, 420, "", { fontFamily: T.font, fontSize: "20px", fontStyle: "bold", align: "center", wordWrap: { width: w - 100 } }).setOrigin(0.5);
    this.stage.add(this.feedback);
  }

  makeTile(word, onClick) {
    const T = this.T;
    const c = this.add.container(0, 0);
    const tw = Math.max(66, 26 + word.length * 14), th = 48;
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.3); g.fillRoundedRect(-tw / 2 + 2, -th / 2 + 4, tw, th, 11);
    g.fillGradientStyle(T.colors.accent, T.colors.accent, 0x6b8bff, 0x6b8bff, 1); g.fillRoundedRect(-tw / 2, -th / 2, tw, th, 11);
    g.fillStyle(0xffffff, 0.18); g.fillRoundedRect(-tw / 2, -th / 2, tw, th * 0.42, { tl: 11, tr: 11, bl: 0, br: 0 });
    c.add(g);
    c.add(this.add.text(0, 0, word, { fontFamily: T.font, fontSize: "21px", fontStyle: "bold", color: "#06121f" }).setOrigin(0.5));
    c.word = word; c.tw = tw; c.th = th;
    c.setSize(tw, th);
    // interactive ZONE (touch-safe) as hit + drag target
    const hit = this.add.zone(0, 0, tw, th).setOrigin(0.5).setInteractive({ useHandCursor: true });
    c.add(hit); c.hit = hit;
    this.input.setDraggable(hit);
    hit.on("pointerup", () => { if (!c._dragging) onClick(); });
    return c;
  }

  layoutPool() {
    this.poolContainer.removeAll(true);
    const w = this.scale.width, y = 272, gap = 14;
    const widths = this.pool.map(wd => Math.max(66, 26 + wd.length * 14));
    let totalW = widths.reduce((a, b) => a + b + gap, -gap);
    let x = w / 2 - totalW / 2;
    this.pool.forEach((word, i) => {
      const tile = this.makeTile(word, () => this.addWord(i));
      tile.x = x + widths[i] / 2; tile.y = y;
      this.setupDrag(tile, i);
      this.poolContainer.add(tile);
      x += widths[i] + gap;
    });
  }

  layoutBuilt() {
    this.builtContainer.removeAll(true);
    const z = this.answerZone, gap = 12;
    const widths = this.built.map(wd => Math.max(66, 26 + wd.length * 14));
    let totalW = widths.reduce((a, b) => a + b + gap, -gap);
    let x = z.x - Math.max(0, totalW) / 2;
    this.built.forEach((word, i) => {
      const tile = this.makeTile(word, () => this.removeWord(i));
      tile.x = x + widths[i] / 2; tile.y = z.y;
      this.builtContainer.add(tile);
      x += widths[i] + gap;
    });
  }

  setupDrag(tile, index) {
    const zone = tile.hit;
    zone.on("dragstart", () => { tile._dragging = true; tile.setDepth(999); tile.setScale(1.08); });
    zone.on("drag", (pointer) => { tile.x = pointer.worldX; tile.y = pointer.worldY; });
    zone.on("dragend", () => {
      tile.setScale(1); tile.setDepth(0);
      const z = this.answerZone;
      const inZone = Math.abs(tile.x - z.x) < z.w / 2 + 40 && Math.abs(tile.y - z.y) < z.h / 2 + 70;
      if (inZone) this.addWord(index); else this.layoutPool();
      this.time.delayedCall(30, () => { tile._dragging = false; });
    });
  }

  addWord(poolIndex) {
    if (this.answered) return;
    const word = this.pool[poolIndex]; if (word == null) return;
    this.pool.splice(poolIndex, 1); this.built.push(word);
    window.AudioManager.sfx("click");
    this.layoutPool(); this.layoutBuilt();
  }
  removeWord(builtIndex) {
    if (this.answered) return;
    const word = this.built[builtIndex];
    this.built.splice(builtIndex, 1); this.pool.push(word);
    window.AudioManager.sfx("click");
    this.layoutPool(); this.layoutBuilt();
  }
  clearBuilt() {
    if (this.answered) return;
    while (this.built.length) this.pool.push(this.built.pop());
    this.layoutPool(); this.layoutBuilt();
  }

  showHint() {
    this.feedback.setColor(this.T.hex(this.T.colors.accent2));
    this.feedback.setText("💡 " + this.item.hint);
  }

  check() {
    if (this.answered) return;
    const T = this.T;
    const attempt = this.built.join(" ").trim();
    const correct = attempt.toLowerCase() === this.item.answer.toLowerCase();
    this.answered = true;
    window.GameState.registerAnswer(correct, this.phaseKey);
    this.hud.updateScore();
    window.AudioManager.sfx(correct ? "correct" : "wrong");
    T.flashFeedback(this, correct);
    if (this.actionBtns) this.actionBtns.forEach(b => b.setEnabled && b.setEnabled(false));

    this.feedback.setColor(correct ? T.hex(T.colors.good) : T.hex(T.colors.bad));
    this.feedback.setText((correct ? "✓ Correct!  " : "✕ Correct: ") + "\"" + this.item.answer + "\"");
    window.SubtitleManager.show(this.item.answer);
    window.AudioManager.speak(this.item.answer);

    if (window.GameState.isGameOver()) {
      this.time.delayedCall(1500, () => { window.AudioManager.sfx("lose"); this.scene.start("ResultScene", { gameOver: true }); });
      return;
    }
    const last = this.idx >= this.items.length - 1;
    this.stage.add(T.button(this, this.scale.width / 2, 470, 250, 50, last ? "Finish stage  ✓" : "Next sentence  ▶", { onClick: () => this.advance() }));
  }

  advance() {
    if (this._advancing) return; this._advancing = true;
    window.SubtitleManager.hide();
    this.idx++;
    if (this.idx >= this.items.length) { window.Flow.completePhase(this, this.phaseKey); return; }
    this._advancing = false;
    this.render();
  }

  progressDots(x, y, total, active) {
    const T = this.T, gap = 26, startX = x - ((total - 1) * gap) / 2;
    for (let i = 0; i < total; i++) {
      const d = this.add.circle(startX + i * gap, y, 7, i <= active ? T.colors.accent : 0x3a4470);
      if (i === active) d.setStrokeStyle(3, T.colors.accent2);
      this.stage.add(d);
    }
  }
}
window.LanguageScene = LanguageScene;
