/* RESULT (Game 03). Final 1–3 star rating (time-based), score, coins, accuracy,
 * final time, replay / menu. The `gameOver` flag is the contract read by the
 * Mission Map to detect a successful completion (gameOver === false). */
class ResultScene extends Phaser.Scene {
  constructor() { super("ResultScene"); }
  init(data) { this.gameOver = data && data.gameOver; }

  create() {
    const T = window.Theme, w = this.scale.width, h = this.scale.height;
    this.cameras.main.fadeIn(400, 5, 7, 20);
    window.SubtitleManager.hide();
    T.scene(this, "result");

    if (!this.gameOver && window.Art && window.Art.ready(this)) {
      window.Art.character(this, "alex", "celebrating", w * 0.12, h + 10, h * 0.64, { flip: false, depth: -2 });
      window.Art.character(this, "emma", "celebrating", w * 0.88, h + 10, h * 0.64, { flip: true, depth: -2 });
    }

    const S = window.GameState.session;
    const stars = this.gameOver ? 0 : window.GameState.finalStars();
    const acc = window.GameState.accuracy();
    const secs = window.GameState.challengeSeconds();

    if (this.gameOver) { window.AudioManager.stopMusic(); window.AudioManager.sfx("lose"); }
    else { window.AudioManager.playMusic("victory"); window.AudioManager.sfx("win"); }

    const title = this.add.text(w / 2, 58, this.gameOver ? window.S("gameOver") : window.S("missionComplete"), {
      fontFamily: T.font, fontSize: "44px", fontStyle: "bold", color: this.gameOver ? T.hex(T.colors.bad) : T.colors.text
    }).setOrigin(0.5);
    title.setShadow(0, 4, "rgba(0,0,0,0.6)", 14, true, true);
    this.tweens.add({ targets: title, scale: { from: 0.7, to: 1 }, duration: 600, ease: "Back.out" });

    this.add.text(w / 2, 100, this.gameOver ? window.S("gameOverSub") : window.S("missionCompleteSub"), {
      fontFamily: T.font, fontSize: "16px", color: T.colors.text, align: "center", wordWrap: { width: w - 160 }
    }).setOrigin(0.5).setShadow(0, 1, "rgba(0,0,0,0.9)", 5);

    // Three-stars frame (Pack 04), lit per the time-based rating
    const frame = window.UI.starsFrame(this, w / 2, 176, 260, 108);
    if (!this.gameOver) { frame.light(stars, true); }

    T.card(this, w / 2, 320, 600, 250, { border: this.gameOver ? T.colors.bad : T.colors.accent2 });

    const stat = (x, label, value, color) => {
      this.add.text(x, 270, value, { fontFamily: T.font, fontSize: "34px", fontStyle: "bold", color: color || T.colors.text }).setOrigin(0.5);
      this.add.text(x, 310, label, { fontFamily: T.font, fontSize: "14px", color: T.colors.textDim }).setOrigin(0.5);
    };
    stat(w / 2 - 225, window.S("scoreLabel"), String(S.score), T.hex(T.colors.accent2));
    stat(w / 2 - 75, window.S("starsLabel"), stars + "/3", T.hex(T.colors.accent));
    stat(w / 2 + 75, window.S("coinsLabel"), "◉ " + S.coins, T.hex(0xffd35c));
    stat(w / 2 + 225, window.S("accuracyLabel"), acc + "%", T.hex(T.colors.good));

    if (secs != null) {
      this.add.text(w / 2, 360, `${window.S("finishTimeLabel")}: ${secs}${window.S("secondsShort")}`, {
        fontFamily: T.font, fontSize: "20px", color: T.colors.text
      }).setOrigin(0.5);
    }

    let msg;
    if (this.gameOver) msg = window.S("msgKeep");
    else if (stars >= 3) msg = window.S("msgExcellent");
    else if (stars >= 2) msg = window.S("msgGreat");
    else msg = window.S("msgGood");
    this.add.text(w / 2, 398, msg, { fontFamily: T.font, fontSize: "22px", fontStyle: "bold", color: T.hex(T.colors.accent) }).setOrigin(0.5);

    window.UI.button(this, w / 2 - 155, 468, 290, 58, window.S("playAgain"), {
      fontSize: 22, onClick: () => { window.GameState.resetSession(); window.AudioManager.stopMusic(); this.scene.start("MissionBriefingScene"); }
    });
    window.UI.button(this, w / 2 + 155, 468, 290, 58, window.S("backToMenu"), {
      secondary: true, textColor: T.colors.text, fontSize: 22,
      onClick: () => { window.AudioManager.stopMusic(); this.scene.start("MenuScene"); }
    });

    window.Brand.render(this, w / 2, h - 54, 128, 66, { onDark: true });
    this.add.text(w / 2, h - 14, window.S("subTagline"), { fontFamily: T.font, fontSize: "12px", color: T.colors.textDim }).setOrigin(0.5).setShadow(0, 1, "rgba(0,0,0,0.9)", 4);

    if (!this.gameOver) {
      T.ensureParticleTexture(this);
      [T.colors.accent, T.colors.accent2, T.colors.accentPink, T.colors.good].forEach((c, i) => {
        this.time.delayedCall(i * 150, () => {
          const p = this.add.particles(Phaser.Math.Between(200, w - 200), -20, "t_dot", { speedY: { min: 120, max: 260 }, speedX: { min: -60, max: 60 }, scale: { start: 0.6, end: 0 }, lifespan: 2000, quantity: 3, frequency: 60, tint: c, gravityY: 120 }).setDepth(80);
          this.time.delayedCall(1400, () => p.stop()); this.time.delayedCall(3600, () => p.destroy());
        });
      });
    }

    this.input.keyboard.on("keydown-ENTER", () => { window.GameState.resetSession(); window.AudioManager.stopMusic(); this.scene.start("MissionBriefingScene"); });
    this.input.keyboard.on("keydown-ESC", () => { window.AudioManager.stopMusic(); this.scene.start("MenuScene"); });
  }
}
window.ResultScene = ResultScene;
