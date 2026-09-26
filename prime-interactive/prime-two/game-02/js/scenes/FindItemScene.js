/* STEP 2 — FIND THE ITEM. Hear the item, then TAP the correct product image
 * among a grid. Wrong = lose a life; that item is disabled (answer not
 * revealed) and the player keeps trying. */
class FindItemScene extends Phaser.Scene {
  constructor() { super("FindItemScene"); }

  create() {
    this.T = window.Theme;
    this.phaseKey = "FindItem";
    this.items = window.PRIME_CONTENT.findItem.items;
    this.idx = 0; this._advancing = false;   // reset por partida (instância reutilizada)
    this.cameras.main.fadeIn(280, 5, 7, 20);
    window.SubtitleManager.mount(this);
    this.T.scene(this, "list");
    if (window.Art && window.Art.ready(this)) {
      window.Art.character(this, "emma", "pointing", this.scale.width * 0.10, this.scale.height + 6, this.scale.height * 0.70, { flip: false, depth: -3 });
    }
    window.AudioManager.playMusic("adventure");
    this.hud = new window.Hud(this, { phaseTitle: window.S("stage") + " 2 · " + window.S("findItemTitle") });
    this.stage = this.add.container(0, 0);
    this.render();
  }

  render() {
    this.stage.removeAll(true);
    this._done = false;
    const T = this.T, w = this.scale.width;
    const item = this.items[this.idx];
    this.progressDots(w / 2, 70, this.items.length, this.idx);

    this.stage.add(T.button(this, w / 2 - 40, 116, 250, 50, window.S("listen"), {
      color: T.colors.accent, color2: 0x6b8bff, textColor: "#06121f", fontSize: 22, onClick: () => this.playAudio(item)
    }));
    this.stage.add(T.iconButton(this, w / 2 + 160, 116, "↻", { radius: 22, onClick: () => this.playAudio(item) }));

    this.stage.add(this.add.text(w / 2, 168, window.S("findLabel") + " " + item.label, {
      fontFamily: T.font, fontSize: "22px", fontStyle: "bold", color: T.hex(T.colors.accent2)
    }).setOrigin(0.5).setShadow(0, 2, "rgba(0,0,0,0.85)", 5));

    const grid = item.grid.slice();
    const cols = 2, cardW = 180, cardH = 150, gapX = 40, gapY = 22;
    const totalW = cols * cardW + (cols - 1) * gapX;
    const startX = w / 2 - totalW / 2 + cardW / 2;
    const startY = 262;
    this.cards = [];
    grid.forEach((key, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const cx = startX + col * (cardW + gapX);
      const cy = startY + row * (cardH + gapY);
      const card = window.ShopCards.itemCard(this, cx, cy, cardW, cardH, key, () => this.pick(key, card, item));
      this.cards.push(card);
      this.stage.add(card);
    });

    this.feedback = this.add.text(w / 2, this.scale.height - 30, "", { fontFamily: T.font, fontSize: "20px", fontStyle: "bold", align: "center" }).setOrigin(0.5);
    this.stage.add(this.feedback);

    this.time.delayedCall(420, () => this.playAudio(item));
  }

  playAudio(item) {
    window.SubtitleManager.show(item.subtitle);
    window.AudioManager.speak(item.audioText, { key: item.id });
  }

  pick(key, card, item) {
    if (this._done) return;
    const T = this.T, w = this.scale.width;
    if (key === item.target) {
      this._done = true;
      this.cards.forEach((c) => c.hit && c.hit.disableInteractive());
      card.setCardState("correct");
      window.GameState.registerCorrect(this.phaseKey); this.hud.updateScore();
      window.AudioManager.sfx("correct"); T.flashFeedback(this, true); window.SubtitleManager.hide();
      this.feedback.setColor(T.hex(T.colors.good)); this.feedback.setText(window.S("correct"));
      const last = this.idx >= this.items.length - 1;
      this.stage.add(T.button(this, w / 2, this.scale.height - 62, 240, 48, last ? window.S("finishStage") : window.S("next"), { fontSize: 20, onClick: () => this.advance() }));
    } else {
      card.setCardState("wrong"); if (card.hit) card.hit.disableInteractive();
      window.GameState.loseLife(this.phaseKey); this.hud.updateScore();
      window.AudioManager.sfx("wrong"); T.flashFeedback(this, false);
      this.feedback.setColor(T.hex(T.colors.bad)); this.feedback.setText(window.S("tryAgain"));
      if (window.GameState.isGameOver()) { this.time.delayedCall(900, () => this.scene.start("ResultScene", { gameOver: true })); }
    }
  }

  advance() {
    if (this._advancing) return; this._advancing = true;
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
window.FindItemScene = FindItemScene;
