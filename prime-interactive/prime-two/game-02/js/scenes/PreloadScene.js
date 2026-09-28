/* Preload (Game 02): carrega os assets OFICIAIS (packs 01–04 do London Shopping
 * Mission) por nome de arquivo + logo da marca; mostra loading premium com o
 * progresso real do loader. */
class PreloadScene extends Phaser.Scene {
  constructor() { super("PreloadScene"); }

  preload() {
    // logo OFICIAL First Prime (se configurado) + arte oficial do Game 02
    window.Brand.preload(this);
    if (window.FlagImage) window.FlagImage.preload(this);
    if (window.Art) window.Art.preload(this);

    // barra de progresso ligada ao loader real
    const T = window.Theme, w = this.scale.width, h = this.scale.height;
    T.background(this, 0);
    window.Brand.render(this, w / 2, h / 2 - 46, 360, 96, { onDark: true });
    const sub = this.add.text(w / 2, h / 2 + 34, "PRIME TWO", {
      fontFamily: T.font, fontSize: "38px", fontStyle: "bold", color: T.colors.text
    }).setOrigin(0.5);
    sub.setShadow(0, 4, "rgba(0,0,0,0.5)", 10, true, true);
    this.add.text(w / 2, h / 2 + 70, "London Shopping Mission", {
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
    // pequena folga para o fade e então vai para a escolha de idioma
    this.time.delayedCall(200, () => this.scene.start("LanguageSelectScene"));
  }
}
window.PreloadScene = PreloadScene;
