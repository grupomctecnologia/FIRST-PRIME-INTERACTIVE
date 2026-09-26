/* FASE 7 — RESULTADO
 * Pontuação total, estrelas, acertos, mensagem, jogar novamente, voltar ao menu. */
class ResultScene extends Phaser.Scene {
  constructor() { super("ResultScene"); }
  init(data) { this.gameOver = data && data.gameOver; }

  create() {
    const T = window.Theme, w = this.scale.width, h = this.scale.height;
    this.cameras.main.fadeIn(400, 5, 7, 20);
    window.SubtitleManager.hide();
    T.background(this, this.gameOver ? 0 : 1);
    T.particles(this, this.gameOver ? T.colors.bad : T.colors.accent2);

    const S = window.GameState.session;
    const totalStars = window.GameState.totalStars();
    const maxStars = window.GameState.maxStars();
    const acc = window.GameState.accuracy();

    if (this.gameOver) { window.AudioManager.stopMusic(); window.AudioManager.sfx("lose"); }
    else { window.AudioManager.playMusic("victory"); window.AudioManager.sfx("win"); }

    // Título
    const titleTxt = this.gameOver ? "GAME OVER" : "ADVENTURE COMPLETE!";
    const title = this.add.text(w / 2, 90, titleTxt, {
      fontFamily: T.font, fontSize: "52px", fontStyle: "bold",
      color: this.gameOver ? T.hex(T.colors.bad) : T.colors.text
    }).setOrigin(0.5);
    title.setShadow(0, 4, "rgba(0,0,0,0.6)", 16, true, true);
    this.tweens.add({ targets: title, scale: { from: 0.7, to: 1 }, duration: 600, ease: "Back.out" });

    this.add.text(w / 2, 138, this.gameOver ? "Modo Desafio — suas vidas acabaram" : "PRIME TWO · The English Adventure", {
      fontFamily: T.font, fontSize: "18px", color: T.colors.textDim
    }).setOrigin(0.5);

    // Card de resultados
    const card = T.card(this, w / 2, 380, 560, 360, { border: this.gameOver ? T.colors.bad : T.colors.accent2 });

    // Estrelas grandes
    const row = T.starRow(this, w / 2, 260, 0, maxStars, 30);
    for (let i = 0; i < totalStars; i++) {
      this.time.delayedCall(200 + i * 120, () => {
        const st = row.list[i]; st.setColor(T.hex(T.colors.accent2));
        st.setShadow(0, 0, T.hex(T.colors.accent2), 12, true, true);
        this.tweens.add({ targets: st, scale: { from: 1.6, to: 1 }, duration: 250, ease: "Back.out" });
        window.AudioManager.sfx("star");
      });
    }

    // Números
    const stat = (x, label, value, color) => {
      this.add.text(x, 340, value, { fontFamily: T.font, fontSize: "44px", fontStyle: "bold", color: color || T.colors.text }).setOrigin(0.5);
      this.add.text(x, 390, label, { fontFamily: T.font, fontSize: "16px", color: T.colors.textDim }).setOrigin(0.5);
    };
    stat(w / 2 - 180, "Pontuação", String(S.score), T.hex(T.colors.accent2));
    stat(w / 2, "Estrelas", totalStars + "/" + maxStars, T.hex(T.colors.accent));
    stat(w / 2 + 180, "Precisão", acc + "%", T.hex(T.colors.good));

    // Acertos e detalhamento por fase
    this.add.text(w / 2, 440, `Acertos: ${S.correct}/${S.total}`, { fontFamily: T.font, fontSize: "20px", color: T.colors.text }).setOrigin(0.5);

    // Mensagem de conclusão
    let msg;
    if (this.gameOver) msg = "Continue praticando — você consegue!";
    else if (acc >= 90) msg = "🏆 Excelente! Domínio impressionante!";
    else if (acc >= 60) msg = "👏 Muito bom! Continue evoluindo!";
    else msg = "💪 Bom começo! Pratique para melhorar!";
    this.add.text(w / 2, 486, msg, { fontFamily: T.font, fontSize: "22px", fontStyle: "bold", color: T.hex(T.colors.accent) }).setOrigin(0.5);

    // Botões
    const replay = T.button(this, w / 2 - 150, 600, 280, 62, "↻  Jogar novamente", {
      onClick: () => { window.GameState.resetSession(); window.AudioManager.stopMusic(); this.scene.start("IntroScene"); }
    });
    const menu = T.button(this, w / 2 + 150, 600, 280, 62, "≡  Voltar ao menu", {
      color: T.colors.panelLight, color2: T.colors.panel, textColor: T.colors.text,
      onClick: () => { window.AudioManager.stopMusic(); this.scene.start("MenuScene"); }
    });

    // LOGO OFICIAL da First Prime (ou placeholder técnico até receber o arquivo)
    window.Brand.render(this, w / 2, h - 58, 190, 44, { onDark: true });

    // rodapé placeholder
    this.add.text(w / 2, h - 20, "Conteúdo demonstrativo (placeholder). Substituível pelo conteúdo real do PRIME TWO.", {
      fontFamily: T.font, fontSize: "12px", color: T.colors.textDim
    }).setOrigin(0.5);

    // confete de vitória
    if (!this.gameOver) {
      T.ensureParticleTexture(this);
      [T.colors.accent, T.colors.accent2, T.colors.accentPink, T.colors.good].forEach((c, i) => {
        this.time.delayedCall(i * 150, () => {
          const p = this.add.particles(Phaser.Math.Between(200, w - 200), -20, "t_dot", {
            speedY: { min: 120, max: 260 }, speedX: { min: -60, max: 60 },
            scale: { start: 0.6, end: 0 }, lifespan: 2200, quantity: 3, frequency: 60, tint: c, gravityY: 120
          }).setDepth(80);
          this.time.delayedCall(1500, () => p.stop());
          this.time.delayedCall(4000, () => p.destroy());
        });
      });
    }

    this.input.keyboard.on("keydown-ENTER", () => { window.GameState.resetSession(); window.AudioManager.stopMusic(); this.scene.start("IntroScene"); });
    this.input.keyboard.on("keydown-ESC", () => { window.AudioManager.stopMusic(); this.scene.start("MenuScene"); });
  }
}
window.ResultScene = ResultScene;
