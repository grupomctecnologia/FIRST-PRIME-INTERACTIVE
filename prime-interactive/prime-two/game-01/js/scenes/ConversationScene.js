/* FASE 4 — CONVERSATION CHALLENGE
 * Dois personagens conversam; o aluno escolhe a resposta correta para continuar. */
class ConversationScene extends Phaser.Scene {
  constructor() { super("ConversationScene"); }

  create() {
    this.T = window.Theme;
    this.phaseKey = "Conversation";
    this.data = window.PRIME_CONTENT.conversation;
    this.step = 0;
    this.cameras.main.fadeIn(350, 5, 7, 20);
    window.SubtitleManager.hide();
    this.T.background(this, 0);
    this.T.particles(this, this.T.colors.accent);
    window.AudioManager.playMusic("adventure");
    this.hud = new window.Hud(this, { phaseTitle: "FASE 4 · Conversation Challenge", phaseSubtitle: "Escolha a resposta correta" });

    const w = this.scale.width, h = this.scale.height;

    // Personagens
    this.emma = this.buildCharacter(w * 0.24, 300, "av_emma", this.data.speakerA.name, this.data.speakerA.role, false, "👩");
    this.you = this.buildCharacter(w * 0.76, 300, "av_you", "You", "Traveler", true, "🧑");

    // Balão de fala (personagem A)
    this.bubbleA = this.buildBubble(w * 0.24, 190, false);
    this.bubbleB = this.buildBubble(w * 0.76, 190, true);
    this.bubbleB.container.setVisible(false);

    this.optionsC = this.add.container(0, 0);
    this.renderStep();
  }

  buildCharacter(x, y, tex, name, role, flip, face) {
    const T = this.T;
    const c = this.add.container(x, y);
    const av = this.add.image(0, 0, tex).setScale(0.9);
    if (flip) av.setFlipX(true);
    // sombra elíptica
    const sh = this.add.ellipse(0, 110, 150, 30, 0x000000, 0.35);
    c.add(sh); c.add(av);
    // rosto estilizado (emoji sobre o avatar)
    if (face) {
      const f = this.add.text(0, 2, face, { fontSize: "92px" }).setOrigin(0.5);
      c.add(f);
    }
    const nm = this.add.text(0, 130, name, { fontFamily: T.font, fontSize: "22px", fontStyle: "bold", color: T.colors.text }).setOrigin(0.5);
    const rl = this.add.text(0, 156, role, { fontFamily: T.font, fontSize: "14px", color: T.colors.textDim }).setOrigin(0.5);
    c.add(nm); c.add(rl);
    c.avatar = av;
    // respiração idle
    this.tweens.add({ targets: av, y: -8, duration: 1800, yoyo: true, repeat: -1, ease: "Sine.inOut" });
    return c;
  }

  talk(charContainer) {
    this.tweens.add({ targets: charContainer.avatar, scale: { from: 0.9, to: 0.97 }, duration: 160, yoyo: true, repeat: 3 });
  }

  buildBubble(x, y, flip) {
    const T = this.T;
    const c = this.add.container(x, y);
    const g = this.add.graphics();
    const bw = 380, bh = 120;
    g.fillStyle(0x000000, 0.25); g.fillRoundedRect(-bw / 2 + 4, -bh / 2 + 6, bw, bh, 18);
    g.fillStyle(flip ? T.colors.accent2 : 0xffffff, 0.96); g.fillRoundedRect(-bw / 2, -bh / 2, bw, bh, 18);
    // ponta
    g.fillTriangle(flip ? bw / 2 - 60 : -bw / 2 + 60, bh / 2 - 2, flip ? bw / 2 - 20 : -bw / 2 + 20, bh / 2 - 2, flip ? bw / 2 - 40 : -bw / 2 + 40, bh / 2 + 30);
    c.add(g);
    const txt = this.add.text(0, -12, "", { fontFamily: T.font, fontSize: "20px", fontStyle: "bold", color: "#10203a", align: "center", wordWrap: { width: bw - 40 } }).setOrigin(0.5);
    c.add(txt);
    const tr = this.add.text(0, 34, "", { fontFamily: T.font, fontSize: "14px", color: "#4a5a78", align: "center", wordWrap: { width: bw - 40 } }).setOrigin(0.5);
    c.add(tr);
    return { container: c, txt, tr };
  }

  setBubble(bubble, line) {
    bubble.txt.setText(line.en);
    bubble.tr.setText(window.GameState.settings.showTranslation && line.pt ? line.pt : "");
    bubble.container.setVisible(true);
    bubble.container.setScale(0.7); bubble.container.setAlpha(0);
    this.tweens.add({ targets: bubble.container, scale: 1, alpha: 1, duration: 250, ease: "Back.out" });
  }

  renderStep() {
    this.optionsC.removeAll(true);
    const T = this.T, w = this.scale.width, h = this.scale.height;
    const s = this.data.steps[this.step];
    this.progressDots(w / 2, 100, this.data.steps.length, this.step);

    this.bubbleB.container.setVisible(false);
    this.setBubble(this.bubbleA, s.line);
    this.talk(this.emma);
    window.SubtitleManager.show(s.line);
    window.AudioManager.speak(s.line.en, { key: "convA_" + this.step, rate: 0.95 });

    // Opções de resposta (3)
    s.options.forEach((opt, i) => {
      const by = 492 + i * 62;
      const b = T.button(this, w / 2, by, 620, 54, opt.text, {
        color: T.colors.panelLight, color2: T.colors.panel, textColor: T.colors.text, fontSize: 20,
        onClick: () => this.choose(opt, s)
      });
      this.optionsC.add(b);
    });
  }

  choose(opt, step) {
    if (this._answered) return; this._answered = true;
    const T = this.T, w = this.scale.width;
    window.GameState.registerAnswer(opt.correct, this.phaseKey);
    this.hud.updateScore();
    window.AudioManager.sfx(opt.correct ? "correct" : "wrong");
    T.flashFeedback(this, opt.correct);

    // fala do jogador
    this.setBubble(this.bubbleB, { en: opt.text, pt: "" });
    this.talk(this.you);
    window.AudioManager.speak(opt.text, { pitch: 1.15 });

    // feedback pedagógico
    const fb = this.add.text(w / 2, 500, (opt.correct ? "✓ " : "✕ ") + opt.feedback.en +
      (window.GameState.settings.showTranslation ? "\n" + opt.feedback.pt : ""), {
      fontFamily: T.font, fontSize: "18px", fontStyle: "bold", align: "center",
      color: opt.correct ? T.hex(T.colors.good) : T.hex(T.colors.bad), wordWrap: { width: w - 140 }
    }).setOrigin(0.5);
    this.optionsC.removeAll(true);
    this.optionsC.add(fb);

    if (window.GameState.isGameOver()) {
      this.time.delayedCall(1400, () => { window.AudioManager.sfx("lose"); this.scene.start("ResultScene", { gameOver: true }); });
      return;
    }

    const last = this.step >= this.data.steps.length - 1;
    // avança sempre (mesmo se errou, mostra a fala e segue) — mantém o diálogo fluindo
    const nextBtn = T.button(this, w / 2, 575, 240, 54, last ? "Concluir fase  ✓" : "Continuar  ▶", {
      fontSize: 20, onClick: () => this.advance()
    });
    this.optionsC.add(nextBtn);
    if (window.GameState.settings.mode !== "teacher") this.time.delayedCall(2000, () => { if (this.scene.isActive()) this.advance(); });
  }

  advance() {
    if (this._advancing) return; this._advancing = true;
    this.step++;
    this._answered = false;
    if (this.step >= this.data.steps.length) { window.Flow.completePhase(this, this.phaseKey); return; }
    this._advancing = false;
    this.renderStep();
  }

  progressDots(x, y, total, active) {
    const T = this.T, gap = 26, startX = x - ((total - 1) * gap) / 2;
    if (this.dots) this.dots.destroy();
    this.dots = this.add.container(0, 0);
    for (let i = 0; i < total; i++) {
      const d = this.add.circle(startX + i * gap, y, 7, i <= active ? T.colors.accent : 0x3a4470);
      if (i === active) d.setStrokeStyle(3, T.colors.accent2);
      this.dots.add(d);
    }
  }
}
window.ConversationScene = ConversationScene;
