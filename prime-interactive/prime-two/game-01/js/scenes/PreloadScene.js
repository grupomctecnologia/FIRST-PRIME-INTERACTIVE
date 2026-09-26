/* Preload: gera texturas procedurais e mostra loading premium.
 * Não há assets externos — tudo é gerado em runtime (offline-friendly). */
class PreloadScene extends Phaser.Scene {
  constructor() { super("PreloadScene"); }

  preload() {
    // carrega o logo OFICIAL da First Prime, se configurado (senão, placeholder)
    window.Brand.preload(this);
  }

  create() {
    const T = window.Theme, w = this.scale.width, h = this.scale.height;
    T.background(this, 0);
    T.ensureParticleTexture(this);

    // avatares estilizados (círculo com gradiente) para personagens
    this.makeAvatar("av_emma", 0x38e1ff, 0x6b8bff);
    this.makeAvatar("av_you", 0xffcf5c, 0xff6ba9);

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

  makeAvatar(key, c1, c2) {
    if (this.textures.exists(key)) return;
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // disco com gradiente aproximado (anéis)
    const R = 90;
    for (let i = R; i > 0; i -= 3) {
      const t = i / R;
      const col = Phaser.Display.Color.Interpolate.ColorWithColor(
        Phaser.Display.Color.ValueToColor(c2),
        Phaser.Display.Color.ValueToColor(c1), R, R - i);
      g.fillStyle(Phaser.Display.Color.GetColor(col.r, col.g, col.b), 1);
      g.fillCircle(100, 100, i);
    }
    g.lineStyle(5, 0xffffff, 0.5); g.strokeCircle(100, 100, R);
    g.generateTexture(key, 200, 200); g.destroy();
  }
}
window.PreloadScene = PreloadScene;
