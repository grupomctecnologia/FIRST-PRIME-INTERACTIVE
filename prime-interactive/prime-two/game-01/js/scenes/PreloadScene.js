/* Preload: gera texturas procedurais e mostra loading premium.
 * Não há assets externos — tudo é gerado em runtime (offline-friendly). */
class PreloadScene extends Phaser.Scene {
  constructor() { super("PreloadScene"); }

  preload() {
    // carrega o logo OFICIAL da First Prime, se configurado (senão, placeholder)
    window.Brand.preload(this);
    if (window.FlagImage) window.FlagImage.preload(this);
    // carrega a arte cinematográfica (casal + Londres) da referência aprovada
    if (window.Art) window.Art.preload(this);
  }

  create() {
    const T = window.Theme, w = this.scale.width, h = this.scale.height;
    T.background(this, 0);
    T.ensureParticleTexture(this);

    // avatares estilizados (círculo com gradiente) para personagens
    this.makeAvatar("av_emma", 0x2a3566, 0x121a3e, "emma");
    this.makeAvatar("av_you", 0x3a2a52, 0x1a1230, "you");

    // LOGO OFICIAL da First Prime (ou placeholder técnico enquanto não houver arquivo)
    window.Brand.render(this, w / 2, h / 2 - 40, 360, 96, { onDark: true });
    // nome do PRODUTO (game) — texto, não é o logo da marca
    const sub = this.add.text(w / 2, h / 2 + 40, "PRIME TWO", {
      fontFamily: T.font, fontSize: "40px", fontStyle: "bold", color: T.colors.text
    }).setOrigin(0.5);
    sub.setShadow(0, 4, "rgba(0,0,0,0.5)", 10, true, true);

    const bar = this.add.graphics();
    const bw = 340, bx = w / 2 - bw / 2, by = h / 2 + 95;
    let p = 0;
    this.time.addEvent({ delay: 30, repeat: 25, callback: () => {
      p = Math.min(1, p + 0.04);
      bar.clear();
      bar.fillStyle(0x1e2750, 1); bar.fillRoundedRect(bx, by, bw, 10, 5);
      bar.fillStyle(T.colors.accent, 1); bar.fillRoundedRect(bx, by, bw * p, 10, 5);
      if (p >= 1) this.time.delayedCall(150, () => this.scene.start("LanguageSelectScene"));
    }});
  }

  makeAvatar(key, c1, c2, kind) {
    if (this.textures.exists(key)) return;
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    const CX = 100, CY = 100, R = 92, Ri = R - 8;
    // moldura dourada dupla (premium)
    g.fillStyle(0xffcf5c, 1); g.fillCircle(CX, CY, R);
    g.fillStyle(0x8a641f, 1); g.fillCircle(CX, CY, R - 3);
    // disco interno com gradiente profundo (tons sóbrios, não infantil)
    for (let i = Ri; i > 0; i -= 2) {
      const col = Phaser.Display.Color.Interpolate.ColorWithColor(
        Phaser.Display.Color.ValueToColor(c2), Phaser.Display.Color.ValueToColor(c1), Ri, Ri - i);
      g.fillStyle(Phaser.Display.Color.GetColor(col.r, col.g, col.b), 1);
      g.fillCircle(CX, CY, i);
    }
    // brilho superior (gloss) — círculo contido no disco (sem vazar)
    g.fillStyle(0xffffff, 0.10); g.fillCircle(CX, CY - 28, 56);
    g.fillStyle(0xffffff, 0.06); g.fillCircle(CX, CY - 40, 40);
    // vinheta interna inferior — círculo contido
    g.fillStyle(0x000000, 0.16); g.fillCircle(CX, CY + 40, 48);
    // borda dourada por cima (recorte limpo)
    g.lineStyle(4, 0xffcf5c, 0.95); g.strokeCircle(CX, CY, R - 2);
    g.generateTexture(key, 204, 204); g.destroy();
  }
}
window.PreloadScene = PreloadScene;
