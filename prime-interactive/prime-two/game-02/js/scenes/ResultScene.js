/* RESULT (Game 02). Total score, stars, coins, accuracy, replay / menu. */
class ResultScene extends Phaser.Scene {
  constructor() { super("ResultScene"); }
  init(data) { this.gameOver = data && data.gameOver; }

  create() {
    const T = window.Theme, w = this.scale.width, h = this.scale.height;
    this.cameras.main.fadeIn(400, 5, 7, 20);
    window.SubtitleManager.hide();
    T.scene(this, "result");

    // Alex & Emma comemorando (arte oficial) nos cantos
    if (!this.gameOver && window.Art && window.Art.ready(this)) {
      window.Art.character(this, "alex", "celebrating", w * 0.12, h + 10, h * 0.64, { flip: false, depth: -2 });
      window.Art.character(this, "emma", "celebrating", w * 0.88, h + 10, h * 0.64, { flip: true, depth: -2 });
    }

    const S = window.GameState.session;
    const totalStars = window.GameState.totalStars();
    const maxStars = window.GameState.maxStars();
    const acc = window.GameState.accuracy();

    if (this.gameOver) { window.AudioManager.stopMusic(); window.AudioManager.sfx("lose"); }
    else { window.AudioManager.playMusic("victory"); window.AudioManager.sfx("win"); }

    const title = this.add.text(w / 2, 58, this.gameOver ? window.S("gameOver") : window.S("shoppingComplete"), {
      fontFamily: T.font, fontSize: "44px", fontStyle: "bold", color: this.gameOver ? T.hex(T.colors.bad) : T.colors.text
    }).setOrigin(0.5);
    title.setShadow(0, 4, "rgba(0,0,0,0.6)", 14, true, true);
    this.tweens.add({ targets: title, scale: { from: 0.7, to: 1 }, duration: 600, ease: "Back.out" });

    this.add.text(w / 2, 98, this.gameOver ? window.S("gameOverSub") : window.S("subTagline"), { fontFamily: T.font, fontSize: "16px", color: T.colors.text }).setOrigin(0.5).setShadow(0, 1, "rgba(0,0,0,0.9)", 5);

    T.card(this, w / 2, 300, 560, 300, { border: this.gameOver ? T.colors.bad : T.colors.accent2 });

    const row = T.starRow(this, w / 2, 176, 0, maxStars, 22);
    for (let i = 0; i < totalStars; i++) {
      const st = row.list[i]; st.setColor(T.hex(T.colors.accent2)); st.setShadow(0, 0, T.hex(T.colors.accent2), 10, true, true);
      this.tweens.add({ targets: st, scale: { from: 1.6, to: 1 }, duration: 260, delay: i * 80, ease: "Back.out" });
    }
    window.AudioManager.sfx("star");

    const stat = (x, label, value, color) => {
      this.add.text(x, 250, value, { fontFamily: T.font, fontSize: "36px", fontStyle: "bold", color: color || T.colors.text }).setOrigin(0.5);
      this.add.text(x, 292, label, { fontFamily: T.font, fontSize: "14px", color: T.colors.textDim }).setOrigin(0.5);
    };
    stat(w / 2 - 210, window.S("scoreLabel"), String(S.score), T.hex(T.colors.accent2));
    stat(w / 2 - 70, window.S("starsLabel"), totalStars + "/" + maxStars, T.hex(T.colors.accent));
    stat(w / 2 + 70, window.S("coinsLabel"), "◉ " + S.coins, T.hex(0xffd35c));
    stat(w / 2 + 210, window.S("accuracyLabel"), acc + "%", T.hex(T.colors.good));

    this.add.text(w / 2, 342, `${window.S("correctLabel")}: ${S.correct}/${this.totalQuestions()}`, { fontFamily: T.font, fontSize: "20px", color: T.colors.text }).setOrigin(0.5);

    let msg;
    if (this.gameOver) msg = window.S("msgKeep");
    else if (acc >= 90) msg = window.S("msgExcellent");
    else if (acc >= 60) msg = window.S("msgGreat");
    else msg = window.S("msgGood");
    this.add.text(w / 2, 386, msg, { fontFamily: T.font, fontSize: "22px", fontStyle: "bold", color: T.hex(T.colors.accent) }).setOrigin(0.5);

    window.Shop.button(this, w / 2 - 150, 470, 280, 58, window.S("playAgain"), {
      fontSize: 22, onClick: () => { window.GameState.resetSession(); window.AudioManager.stopMusic(); this.scene.start("IntroScene"); }
    });
    window.Shop.button(this, w / 2 + 150, 470, 280, 58, window.S("backToMenu"), {
      secondary: true, textColor: T.colors.text, fontSize: 22,
      onClick: () => { window.AudioManager.stopMusic(); this.scene.start("MenuScene"); }
    });

    window.Brand.render(this, w / 2, h - 58, 128, 70, { onDark: true });
    this.add.text(w / 2, h - 16, window.S("demoNote"), { fontFamily: T.font, fontSize: "12px", color: T.colors.textDim }).setOrigin(0.5).setShadow(0, 1, "rgba(0,0,0,0.9)", 4);

    if (!this.gameOver) {
      T.ensureParticleTexture(this);
      [T.colors.accent, T.colors.accent2, T.colors.accentPink, T.colors.good].forEach((c, i) => {
        this.time.delayedCall(i * 150, () => {
          const p = this.add.particles(Phaser.Math.Between(200, w - 200), -20, "t_dot", { speedY: { min: 120, max: 260 }, speedX: { min: -60, max: 60 }, scale: { start: 0.6, end: 0 }, lifespan: 2000, quantity: 3, frequency: 60, tint: c, gravityY: 120 }).setDepth(80);
          this.time.delayedCall(1400, () => p.stop()); this.time.delayedCall(3600, () => p.destroy());
        });
      });
    }

    this.input.keyboard.on("keydown-ENTER", () => { window.GameState.resetSession(); window.AudioManager.stopMusic(); this.scene.start("IntroScene"); });
    this.input.keyboard.on("keydown-ESC", () => { window.AudioManager.stopMusic(); this.scene.start("MenuScene"); });
  }

  totalQuestions() {
    const c = window.PRIME_CONTENT;
    return c.vocabulary.items.length + c.listening.items.length + c.checkout.items.length + c.conversation.steps.length + c.final.list.length;
  }
}
window.ResultScene = ResultScene;
