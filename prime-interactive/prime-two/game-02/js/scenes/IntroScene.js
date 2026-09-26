/* STAGE 0 — INTRO (Game 02). Cinematic briefing: Alex & Emma welcome the player
 * to the London Shopping Mission. Narration + subtitles, then START. */
class IntroScene extends Phaser.Scene {
  constructor() { super("IntroScene"); }

  create() {
    const T = window.Theme, w = this.scale.width, h = this.scale.height;
    this._begun = false; this._starting = false;   // reset por partida (instância reutilizada)
    this.cameras.main.fadeIn(320, 5, 7, 20);
    window.SubtitleManager.mount(this);
    T.scene(this, "intro");
    window.AudioManager.playMusic("menu");

    const intro = window.PRIME_CONTENT.intro;

    if (window.Art && window.Art.ready(this)) {
      window.Art.character(this, "alex", "speaking", w * 0.17, h + 8, h * 0.78, { flip: false });
      window.Art.character(this, "emma", "neutral", w * 0.83, h + 8, h * 0.78, { flip: true });
    }

    // título
    const lines = intro.titleLines || ["PRIME TWO", "LONDON SHOPPING MISSION"];
    this.add.text(w / 2, 92, lines[0], { fontFamily: T.font, fontSize: "16px", fontStyle: "bold", color: T.hex(T.colors.accent) }).setOrigin(0.5).setShadow(0, 2, "rgba(0,0,0,0.9)", 6);
    const big = this.add.text(w / 2, 132, lines[lines.length - 1], { fontFamily: T.font, fontSize: "40px", fontStyle: "bold", color: T.colors.text, align: "center", wordWrap: { width: w - 120 } }).setOrigin(0.5);
    big.setShadow(0, 4, "rgba(0,0,0,0.7)", 14, true, true);
    this.tweens.add({ targets: big, scale: { from: 0.8, to: 1 }, duration: 600, ease: "Back.out" });

    // narração
    this.narration = intro.narration || [];
    this.nIdx = 0;
    this.narrText = this.add.text(w / 2, h * 0.52, "", {
      fontFamily: T.font, fontSize: "24px", fontStyle: "bold", color: T.colors.text, align: "center", wordWrap: { width: w - 200 }
    }).setOrigin(0.5).setShadow(0, 2, "rgba(0,0,0,0.9)", 8);

    // controles
    window.Shop.button(this, w / 2, h - 66, 300, 58, window.S("startAdventure"), { fontSize: 24, onClick: () => this.start() });
    T.button(this, w - 96, h - 66, 150, 46, window.S("skip"), {
      color: T.colors.panelLight, color2: T.colors.panel, textColor: T.colors.text, secondary: true, fontSize: 18, onClick: () => this.start()
    });

    this.input.once("pointerdown", () => window.AudioManager.unlock());
    this.time.delayedCall(500, () => this.nextLine());
    this.input.keyboard.on("keydown-ENTER", () => this.start());
  }

  nextLine() {
    if (!this.sys.isActive()) return;
    if (this.nIdx >= this.narration.length) return;
    const line = this.narration[this.nIdx++];
    this.narrText.setText(line);
    this.narrText.setAlpha(0);
    this.tweens.add({ targets: this.narrText, alpha: 1, duration: 300 });
    window.SubtitleManager.show(line);
    window.AudioManager.speak(line);
    const est = Math.min(6000, 1200 + line.length * 55);
    this.time.delayedCall(est, () => this.nextLine());
  }

  start() {
    if (this._starting) return; this._starting = true;
    window.AudioManager.stopVoice(); window.SubtitleManager.hide();
    window.AudioManager.sfx("transition");
    this.scene.start("VocabularyScene");
  }
}
window.IntroScene = IntroScene;
