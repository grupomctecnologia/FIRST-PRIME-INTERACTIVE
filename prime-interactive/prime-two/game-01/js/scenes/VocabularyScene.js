/* FASE 2 — VOCABULARY MISSION
 * O jogador vê um objeto no cenário e escolhe a palavra correta em inglês. */
class VocabularyScene extends Phaser.Scene {
  constructor() { super("VocabularyScene"); }

  create() {
    this.T = window.Theme;
    this.phaseKey = "Vocabulary";
    this.items = window.PRIME_CONTENT.vocabulary.items;
    this.idx = 0;
    const w = this.scale.width, h = this.scale.height;
    this.cameras.main.fadeIn(350, 5, 7, 20);
    window.SubtitleManager.hide();

    this.T.background(this, 0);
    this.T.particles(this, this.T.colors.accent);
    window.AudioManager.playMusic("adventure");

    this.hud = new window.Hud(this, { phaseTitle: "FASE 2 · Vocabulary Mission", phaseSubtitle: "Identifique as palavras em inglês" });

    this.iconEmoji = { suitcase: "🧳", ticket: "🎫", map: "🗺️", passport: "🛂", camera: "📷", key: "🔑", phone: "📱", wallet: "👛" };

    this.stage = this.add.container(0, 0);
    this.render();
  }

  render() {
    this.stage.removeAll(true);
    this._answeredItem = false;
    const T = this.T, w = this.scale.width, h = this.scale.height;
    const item = this.items[this.idx];

    this.progressDots(w / 2, 96, this.items.length, this.idx);

    // Card do objeto (cenário com objeto destacado)
    const objCard = T.card(this, w / 2, 250, 260, 220, { border: T.colors.accent2, fill: T.colors.panelLight });
    this.stage.add(objCard);
    const glow = this.add.graphics(); glow.fillStyle(T.colors.accent2, 0.12); glow.fillCircle(w / 2, 240, 110); glow.setBlendMode(Phaser.BlendModes.ADD);
    this.stage.add(glow);
    const emoji = this.add.text(w / 2, 235, this.iconEmoji[item.icon] || "❓", { fontSize: "120px" }).setOrigin(0.5);
    this.stage.add(emoji);
    this.tweens.add({ targets: emoji, y: 225, duration: 1600, yoyo: true, repeat: -1, ease: "Sine.inOut" });

    // Botão ouvir a palavra
    const listen = T.iconButton(this, w / 2 + 150, 250, "🔊", { radius: 26, onClick: () => this.saySoft(item) });
    this.stage.add(listen);

    // Prompt (frase com lacuna)
    const promptTxt = this.add.text(w / 2, 400, item.prompt.en, {
      fontFamily: T.font, fontSize: "30px", fontStyle: "bold", color: T.colors.text, align: "center"
    }).setOrigin(0.5);
    this.stage.add(promptTxt);
    if (window.GameState.settings.showTranslation) {
      this.stage.add(this.add.text(w / 2, 436, item.prompt.pt, { fontFamily: T.font, fontSize: "18px", color: T.colors.textDim }).setOrigin(0.5));
    }

    // legenda com a frase
    window.SubtitleManager.show({ en: item.prompt.en, pt: item.prompt.pt });

    // Opções
    const correctIndex = item.options.indexOf(item.word);
    this.quiz = window.Quiz.options(this, {
      x: w / 2, y: 500, options: item.options, correctIndex,
      buttonWidth: 300, buttonHeight: 60,
      onAnswer: (i, correct) => this.onAnswer(correct, item)
    });
    this.stage.add(this.quiz);

    // narra a palavra alvo suavemente
    this.time.delayedCall(300, () => this.saySoft(item));
  }

  saySoft(item) {
    if (this._answeredItem) return;   // não reexibir legenda após responder
    window.AudioManager.speak(item.word, { key: "vocab_" + item.id });
    window.SubtitleManager.show({ en: item.prompt.en, pt: item.prompt.pt });
  }

  onAnswer(correct, item) {
    this._answeredItem = true;
    window.GameState.registerAnswer(correct, this.phaseKey);
    this.hud.updateScore();
    window.AudioManager.speak(item.word);
    this.showFeedback(correct, item);
  }

  showFeedback(correct, item) {
    const T = this.T, w = this.scale.width, h = this.scale.height;
    window.SubtitleManager.hide();
    const teacher = window.GameState.settings.mode === "teacher";
    const msgEn = correct ? "Correct! " + item.word + " = " + item.translation
                          : "Not quite. The word is: " + item.word + " (" + item.translation + ")";
    const fb = this.add.text(w / 2, 614, msgEn, {
      fontFamily: T.font, fontSize: "20px", fontStyle: "bold",
      color: correct ? T.hex(T.colors.good) : T.hex(T.colors.bad), align: "center", wordWrap: { width: w - 120 }
    }).setOrigin(0.5);
    this.stage.add(fb);

    // Modo Desafio: fim de jogo?
    if (window.GameState.isGameOver()) {
      this.time.delayedCall(1200, () => { window.AudioManager.sfx("lose"); this.scene.start("ResultScene", { gameOver: true }); });
      return;
    }

    const nextBtn = T.button(this, w / 2, 662, 220, 50, this.idx < this.items.length - 1 ? "Próximo  ▶" : "Concluir fase  ✓", {
      fontSize: 20, onClick: () => this.advance()
    });
    this.stage.add(nextBtn);

    // Modo Desafio avança automaticamente (menos dicas)
    if (!teacher) this.time.delayedCall(1600, () => { if (this.scene.isActive()) this.advance(); });
  }

  advance() {
    if (this._advancing) return; this._advancing = true;
    this.idx++;
    if (this.idx >= this.items.length) { window.Flow.completePhase(this, this.phaseKey); return; }
    this._advancing = false;
    this.render();
  }

  progressDots(x, y, total, active) {
    const T = this.T, gap = 26, startX = x - ((total - 1) * gap) / 2;
    for (let i = 0; i < total; i++) {
      const d = this.add.circle(startX + i * gap, y, 7, i <= active ? T.colors.accent : 0x3a4470);
      if (i === active) d.setStrokeStyle(3, T.colors.accent2);
      this.stage.add(d);
    }
  }
}
window.VocabularyScene = VocabularyScene;
