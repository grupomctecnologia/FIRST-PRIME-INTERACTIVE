/* FASE 1 — CINEMATIC INTRO
 * Abertura premium: céu em gradiente, skyline em parallax, partículas,
 * revelação do título e narração com legendas. */
class IntroScene extends Phaser.Scene {
  constructor() { super("IntroScene"); }

  create() {
    const T = window.Theme, w = this.scale.width, h = this.scale.height;
    window.AudioManager.unlock();
    window.AudioManager.playMusic("adventure");

    // Céu noturno em gradiente
    const sky = this.add.graphics();
    sky.fillGradientStyle(0x1a0b3d, 0x2a1b5e, 0x0b2540, 0x123a63, 1);
    sky.fillRect(0, 0, w, h);

    // Lua/sol com brilho
    const moon = this.add.graphics();
    moon.fillStyle(0xffe9b0, 0.9); moon.fillCircle(w - 180, 130, 46);
    moon.fillStyle(0xffe9b0, 0.15); moon.fillCircle(w - 180, 130, 90);
    moon.setBlendMode(Phaser.BlendModes.ADD);

    // Estrelas
    T.ensureParticleTexture(this);
    const stars = this.add.particles(0, 0, "t_dot", {
      x: { min: 0, max: w }, y: { min: 0, max: h * 0.5 },
      lifespan: 4000, scale: { start: 0.25, end: 0 }, alpha: { start: 0.8, end: 0 },
      quantity: 2, frequency: 250, tint: 0xffffff, blendMode: "ADD"
    });

    // Parallax: 3 camadas de skyline
    this.buildSkyline(w, h, 0x0d1030, 0.9, h - 120, 60, 140, 6000);
    this.buildSkyline(w, h, 0x151a45, 1.0, h - 90, 40, 190, 4200);
    this.buildSkyline(w, h, 0x232a63, 1.0, h - 60, 30, 230, 2800);

    // Névoa/glow inferior
    const glow = this.add.graphics();
    glow.fillStyle(T.colors.accent, 0.10); glow.fillRect(0, h - 160, w, 160);
    glow.setBlendMode(Phaser.BlendModes.ADD);

    // Partículas ascendentes (luzes da cidade)
    T.particles(this, T.colors.accent2);

    // Título — revelação sequencial
    // l1 = LOGO OFICIAL da First Prime (ou placeholder técnico até receber o arquivo)
    const lines = window.PRIME_CONTENT.intro.titleLines;
    const l1 = window.Brand.render(this, w / 2, 150, 320, 70, { onDark: true }).setAlpha(0);
    const l2 = this.add.text(w / 2, 215, lines[1], { fontFamily: T.font, fontSize: "72px", fontStyle: "bold", color: T.colors.text }).setOrigin(0.5).setAlpha(0);
    l2.setShadow(0, 6, "rgba(0,0,0,0.6)", 18, true, true);
    const l3 = this.add.text(w / 2, 285, lines[2], { fontFamily: T.font, fontSize: "34px", fontStyle: "bold", color: T.hex(T.colors.accent2) }).setOrigin(0.5).setAlpha(0);
    l3.setShadow(0, 0, T.hex(T.colors.accent2), 18, true, true);

    this.tweens.add({ targets: l1, alpha: 1, y: 140, duration: 900, delay: 300, ease: "Cubic.out" });
    this.tweens.add({ targets: l2, alpha: 1, scale: { from: 0.8, to: 1 }, duration: 1000, delay: 900, ease: "Back.out" });
    this.tweens.add({ targets: l3, alpha: 1, y: 275, duration: 900, delay: 1700, ease: "Cubic.out" });

    // Narração + legendas sincronizadas
    const narration = window.PRIME_CONTENT.intro.narration;
    const times = [2500, 5200, 8200];
    narration.forEach((line, i) => {
      this.time.delayedCall(times[i], () => {
        window.SubtitleManager.show(line);
        window.AudioManager.speak(line.en);
      });
    });
    this.time.delayedCall(11500, () => window.SubtitleManager.hide());

    // Botão START (aparece após a revelação; permite pular)
    const startBtn = T.button(this, w / 2, h - 150, 320, 72, "▶  START ADVENTURE", {
      fontSize: 28, onClick: () => this.begin()
    }).setAlpha(0);
    this.tweens.add({ targets: startBtn, alpha: 1, y: h - 160, duration: 700, delay: 2600, ease: "Cubic.out" });
    startBtn.on("pointerover", () => this.tweens.add({ targets: startBtn, scale: 1.05, duration: 150 }));

    // Skip
    const skip = this.add.text(w - 20, 24, "Pular ⏭", { fontFamily: T.font, fontSize: "16px", color: T.colors.textDim }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
    skip.on("pointerup", () => this.begin());

    // hint
    this.add.text(w / 2, h - 90, "Modo: " + (window.GameState.settings.mode === "teacher" ? "Professor" : "Desafio"), {
      fontFamily: T.font, fontSize: "14px", color: T.colors.textDim
    }).setOrigin(0.5);

    this.input.keyboard.on("keydown-ENTER", () => this.begin());
    this.input.keyboard.on("keydown-ESC", () => { window.SubtitleManager.hide(); this.scene.start("MenuScene"); });
  }

  buildSkyline(w, h, color, alpha, baseY, minH, maxH, panMs) {
    const cont = this.add.container(0, 0);
    const g = this.add.graphics();
    g.fillStyle(color, alpha);
    let x = -40;
    while (x < w * 2 + 80) {
      const bw = Phaser.Math.Between(45, 90);
      const bh = Phaser.Math.Between(minH, maxH);
      g.fillRect(x, baseY - bh, bw, bh + 60);
      // janelas
      g.fillStyle(0xffe9b0, alpha * 0.5);
      for (let wy = baseY - bh + 12; wy < baseY - 8; wy += 20) {
        for (let wx = x + 8; wx < x + bw - 8; wx += 16) {
          if (Math.random() > 0.45) g.fillRect(wx, wy, 7, 10);
        }
      }
      g.fillStyle(color, alpha);
      x += bw + Phaser.Math.Between(6, 20);
    }
    cont.add(g);
    // parallax loop
    this.tweens.add({ targets: cont, x: -w, duration: panMs * 3, repeat: -1, ease: "Linear" });
  }

  begin() {
    if (this._begun) return; this._begun = true;
    window.SubtitleManager.hide();
    window.AudioManager.stopVoice();
    window.AudioManager.sfx("transition");
    this.cameras.main.fadeOut(400, 5, 7, 20);
    this.cameras.main.once("camerafadeoutcomplete", () => this.scene.start("VocabularyScene"));
  }
}
window.IntroScene = IntroScene;
