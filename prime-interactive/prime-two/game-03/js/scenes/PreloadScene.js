/* Preload (Game 03): loads the OFFICIAL assets (packs 01–04 of London
 * Underground Mystery) by file name + brand logo; shows a premium loading
 * screen wired to the real loader progress. */
class PreloadScene extends Phaser.Scene {
  constructor() { super("PreloadScene"); }

  preload() {
    window.Brand.preload(this);
    if (window.Art) window.Art.preload(this);

    const T = window.Theme, w = this.scale.width, h = this.scale.height;
    T.background(this, 0);
    window.Brand.render(this, w / 2, h / 2 - 46, 360, 96, { onDark: true });
    const sub = this.add.text(w / 2, h / 2 + 34, "PRIME TWO", {
      fontFamily: T.font, fontSize: "38px", fontStyle: "bold", color: T.colors.text
    }).setOrigin(0.5);
    sub.setShadow(0, 4, "rgba(0,0,0,0.5)", 10, true, true);
    this.add.text(w / 2, h / 2 + 70, "London Underground Mystery", {
      fontFamily: T.font, fontSize: "16px", fontStyle: "bold", color: T.hex(T.colors.accent2)
    }).setOrigin(0.5);

    const bar = this.add.graphics();
    const bw = 340, bx = w / 2 - bw / 2, by = h / 2 + 100;
    const draw = (p) => {
      bar.clear();
      bar.fillStyle(0x1e2750, 1); bar.fillRoundedRect(bx, by, bw, 10, 5);
      bar.fillStyle(T.colors.accent, 1); bar.fillRoundedRect(bx, by, bw * p, 10, 5);
    };
    draw(0);
    this.load.on("progress", (p) => draw(p));
  }

  create() {
    this.time.delayedCall(200, () => this.scene.start("LanguageSelectScene"));
  }
}
window.PreloadScene = PreloadScene;
