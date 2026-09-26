/* STAGE 1 — CINEMATIC INTRO. Parallax skyline, title reveal, narration +
 * in-canvas subtitles in the chosen language. */
class IntroScene extends Phaser.Scene {
  constructor() { super("IntroScene"); }

  create() {
    const T = window.Theme, w = this.scale.width, h = this.scale.height;
    this._begun = false;   // reset por partida (instância é reutilizada pelo Phaser)
    window.AudioManager.unlock();
    window.AudioManager.playMusic("adventure");
    window.SubtitleManager.mount(this);

    if (window.Art && window.Art.ready(this)) {
      // chegada a Londres (arte oficial) + protagonista (Alex) no aeroporto
      window.Art.background(this, "intro");
      window.Art.character(this, "boy_intro", w * 0.82, h + 8, h * 0.80, { flip: false, depth: 5 });
    } else {
      const sky = this.add.graphics();
      sky.fillGradientStyle(0x1a0b3d, 0x2a1b5e, 0x0b2540, 0x123a63, 1); sky.fillRect(0, 0, w, h);
      const moon = this.add.graphics();
      moon.fillStyle(0xffe9b0, 0.9); moon.fillCircle(w - 170, 100, 40);
      moon.fillStyle(0xffe9b0, 0.15); moon.fillCircle(w - 170, 100, 80); moon.setBlendMode(Phaser.BlendModes.ADD);
      T.ensureParticleTexture(this);
      this.add.particles(0, 0, "t_dot", { x: { min: 0, max: w }, y: { min: 0, max: h * 0.5 }, lifespan: 4000, scale: { start: 0.25, end: 0 }, alpha: { start: 0.8, end: 0 }, quantity: 2, frequency: 250, tint: 0xffffff, blendMode: "ADD" });
      this.buildSkyline(w, h, 0x0d1030, 0.9, h - 100, 50, 120, 6000);
      this.buildSkyline(w, h, 0x151a45, 1.0, h - 74, 34, 160, 4200);
      this.buildSkyline(w, h, 0x232a63, 1.0, h - 50, 26, 190, 2800);
      const glow = this.add.graphics(); glow.fillStyle(T.colors.accent, 0.10); glow.fillRect(0, h - 140, w, 140); glow.setBlendMode(Phaser.BlendModes.ADD);
      T.particles(this, T.colors.accent2);
    }

    const lines = window.PRIME_CONTENT.intro.titleLines;
    const l1 = window.Brand.render(this, w / 2, 96, 208, 116, { onDark: true }).setAlpha(0);
    const l2 = this.add.text(w / 2, 196, lines[1], { fontFamily: T.font, fontSize: "56px", fontStyle: "bold", color: T.colors.text }).setOrigin(0.5).setAlpha(0);
    l2.setShadow(0, 6, "rgba(0,0,0,0.6)", 16, true, true);
    const l3 = this.add.text(w / 2, 242, lines[2], { fontFamily: T.font, fontSize: "26px", fontStyle: "bold", color: T.hex(T.colors.accent2) }).setOrigin(0.5).setAlpha(0);
    l3.setShadow(0, 0, T.hex(T.colors.accent2), 16, true, true);
    this.tweens.add({ targets: l1, alpha: 1, y: 88, duration: 900, delay: 300, ease: "Cubic.out" });
    this.tweens.add({ targets: l2, alpha: 1, scale: { from: 0.8, to: 1 }, duration: 1000, delay: 900, ease: "Back.out" });
    this.tweens.add({ targets: l3, alpha: 1, y: 236, duration: 900, delay: 1700, ease: "Cubic.out" });

    const narration = window.PRIME_CONTENT.intro.narration;
    const times = [2500, 5200, 8200];
    narration.forEach((line, i) => { this.time.delayedCall(times[i], () => { window.SubtitleManager.show(line); window.AudioManager.speak(line); }); });
    this.time.delayedCall(11500, () => window.SubtitleManager.hide());

    const startBtn = T.button(this, w / 2, h - 92, 340, 66, window.S("startAdventure"), T.goldOpts({ fontSize: 26, onClick: () => this.begin() })).setAlpha(0);
    this.tweens.add({ targets: startBtn, alpha: 1, y: h - 100, duration: 700, delay: 2600, ease: "Cubic.out" });

    const skip = this.add.text(w - 18, 22, window.S("skip"), { fontFamily: T.font, fontSize: "16px", color: T.colors.textDim }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
    skip.on("pointerup", () => this.begin());

    this.input.keyboard.on("keydown-ENTER", () => this.begin());
    this.input.keyboard.on("keydown-ESC", () => { window.SubtitleManager.hide(); this.scene.start("MenuScene"); });
  }

  buildSkyline(w, h, color, alpha, baseY, minH, maxH, panMs) {
    const cont = this.add.container(0, 0);
    const g = this.add.graphics(); g.fillStyle(color, alpha);
    let x = -40;
    while (x < w * 2 + 80) {
      const bw = Phaser.Math.Between(45, 90), bh = Phaser.Math.Between(minH, maxH);
      g.fillRect(x, baseY - bh, bw, bh + 60);
      g.fillStyle(0xffe9b0, alpha * 0.5);
      for (let wy = baseY - bh + 12; wy < baseY - 8; wy += 20) { for (let wx = x + 8; wx < x + bw - 8; wx += 16) { if (Math.random() > 0.45) g.fillRect(wx, wy, 7, 10); } }
      g.fillStyle(color, alpha); x += bw + Phaser.Math.Between(6, 20);
    }
    cont.add(g);
    this.tweens.add({ targets: cont, x: -w, duration: panMs * 3, repeat: -1, ease: "Linear" });
  }

  begin() {
    if (this._begun) return; this._begun = true;
    window.SubtitleManager.hide();
    window.AudioManager.stopVoice();
    window.AudioManager.sfx("transition");
    // immediate, reliable transition (VocabularyScene fades in)
    this.scene.start("VocabularyScene");
  }
}
window.IntroScene = IntroScene;
