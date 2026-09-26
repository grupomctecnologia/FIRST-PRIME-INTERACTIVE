/* FASE 5 — LANGUAGE CHALLENGE
 * Gramática contextualizada: arraste (ou toque) as palavras para formar a frase.
 * Drag-and-drop com fallback por toque/clique (acessível). */
class LanguageScene extends Phaser.Scene {
  constructor() { super("LanguageScene"); }

  create() {
    this.T = window.Theme;
    this.phaseKey = "Language";
    this.items = window.PRIME_CONTENT.language.items;
    this.idx = 0;
    this.cameras.main.fadeIn(350, 5, 7, 20);
    window.SubtitleManager.hide();
    this.T.background(this, 1);
    this.T.particles(this, this.T.colors.accent2);
    window.AudioManager.playMusic("adventure");
    this.hud = new window.Hud(this, { phaseTitle: "FASE 5 · Language Challenge", phaseSubtitle: "Arraste as palavras para formar a frase" });
    this.stage = this.add.container(0, 0);
    this.render();
  }

  render() {
    this.stage.removeAll(true);
    const T = this.T, w = this.scale.width;
    const item = this.items[this.idx];
    this.item = item;
    this.built = [];   // palavras colocadas (na ordem)
    this.answered = false;

    this.progressDots(w / 2, 96, this.items.length, this.idx);

    // Instrução + tradução alvo
    this.stage.add(this.add.text(w / 2, 150, window.PRIME_CONTENT.language.intro.en, {
      fontFamily: T.font, fontSize: "24px", fontStyle: "bold", color: T.colors.text
    }).setOrigin(0.5));
    this.stage.add(this.add.text(w / 2, 184, "🇧🇷 " + item.translation, {
      fontFamily: T.font, fontSize: "18px", color: T.hex(T.colors.accent2)
    }).setOrigin(0.5));

    // Zona de resposta (slots)
    this.answerZone = { x: w / 2, y: 300, w: w - 220, h: 90 };
    const zg = this.add.graphics();
    zg.fillStyle(T.colors.panel, 0.6); zg.fillRoundedRect(this.answerZone.x - this.answerZone.w / 2, this.answerZone.y - this.answerZone.h / 2, this.answerZone.w, this.answerZone.h, 14);
    zg.lineStyle(2, T.colors.accent, 0.5); zg.strokeRoundedRect(this.answerZone.x - this.answerZone.w / 2, this.answerZone.y - this.answerZone.h / 2, this.answerZone.w, this.answerZone.h, 14);
    this.stage.add(zg);
    this.stage.add(this.add.text(this.answerZone.x, this.answerZone.y - this.answerZone.h / 2 - 18, "Sua frase (toque/arraste as palavras aqui):", {
      fontFamily: T.font, fontSize: "13px", color: T.colors.textDim
    }).setOrigin(0.5));

    // Pool de palavras (embaralhado)
    this.pool = Phaser.Utils.Array.Shuffle(item.words.slice());
    this.poolContainer = this.add.container(0, 0); this.stage.add(this.poolContainer);
    this.builtContainer = this.add.container(0, 0); this.stage.add(this.builtContainer);
    this.layoutPool();
    this.layoutBuilt();

    // Botões
    this.actionBtns = [];
    const check = T.button(this, w / 2 - 200, 578, 200, 54, "✓  Verificar", { onClick: () => this.check() });
    const clear = T.button(this, w / 2, 578, 160, 54, "↺  Limpar", { color: T.colors.panelLight, color2: T.colors.panel, textColor: T.colors.text, onClick: () => this.clearBuilt() });
    const hint = T.button(this, w / 2 + 190, 578, 200, 54, "💡  Dica", { color: T.colors.accent2, color2: 0xff9f43, textColor: "#06121f", onClick: () => this.showHint() });
    this.stage.add(check); this.stage.add(clear); this.stage.add(hint);
    this.actionBtns = [check, clear, hint];

    this.feedback = this.add.text(w / 2, 648, "", { fontFamily: T.font, fontSize: "20px", fontStyle: "bold", align: "center", wordWrap: { width: w - 100 } }).setOrigin(0.5);
    this.stage.add(this.feedback);
  }

  makeTile(word, onClick) {
    const T = this.T;
    const c = this.add.container(0, 0);
    const tw = Math.max(70, 28 + word.length * 15), th = 52;
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.3); g.fillRoundedRect(-tw / 2 + 2, -th / 2 + 4, tw, th, 12);
    g.fillGradientStyle(T.colors.accent, T.colors.accent, 0x6b8bff, 0x6b8bff, 1); g.fillRoundedRect(-tw / 2, -th / 2, tw, th, 12);
    g.fillStyle(0xffffff, 0.18); g.fillRoundedRect(-tw / 2, -th / 2, tw, th * 0.42, { tl: 12, tr: 12, bl: 0, br: 0 });
    c.add(g);
    const t = this.add.text(0, 0, word, { fontFamily: T.font, fontSize: "22px", fontStyle: "bold", color: "#06121f" }).setOrigin(0.5);
    c.add(t);
    c.word = word; c.tw = tw; c.th = th;
    c.setSize(tw, th);
    c.setInteractive(new Phaser.Geom.Rectangle(-tw / 2, -th / 2, tw, th), Phaser.Geom.Rectangle.Contains);
    this.input.setDraggable(c);
    c.on("pointerup", () => { if (!c._dragging) onClick(); });
    return c;
  }

  layoutPool() {
    this.poolContainer.removeAll(true);
    const w = this.scale.width, y = 470;
    let totalW = 0; const gap = 16;
    const tiles = this.pool.map(word => {
      const idxInPool = this.pool.indexOf(word);
      return { word };
    });
    // largura estimada
    const widths = this.pool.map(wd => Math.max(70, 28 + wd.length * 15));
    totalW = widths.reduce((a, b) => a + b + gap, -gap);
    let x = w / 2 - totalW / 2;
    this.pool.forEach((word, i) => {
      const tile = this.makeTile(word, () => this.addWord(i));
      tile.x = x + widths[i] / 2; tile.y = y;
      this.setupDrag(tile, "pool", i);
      this.poolContainer.add(tile);
      x += widths[i] + gap;
    });
  }

  layoutBuilt() {
    this.builtContainer.removeAll(true);
    const z = this.answerZone; const gap = 12;
    const widths = this.built.map(wd => Math.max(70, 28 + wd.length * 15));
    let totalW = widths.reduce((a, b) => a + b + gap, -gap);
    let x = z.x - Math.max(0, totalW) / 2;
    this.built.forEach((word, i) => {
      const tile = this.makeTile(word, () => this.removeWord(i));
      tile.x = x + widths[i] / 2; tile.y = z.y;
      this.builtContainer.add(tile);
      x += widths[i] + gap;
    });
  }

  setupDrag(tile, from, index) {
    tile.on("dragstart", () => { tile._dragging = true; this.children.bringToTop(this.poolContainer); tile.setScale(1.08); });
    tile.on("drag", (p, dx, dy) => { tile.x = dx; tile.y = dy; });
    tile.on("dragend", (p) => {
      tile.setScale(1);
      const z = this.answerZone;
      const inZone = Math.abs(tile.x - z.x) < z.w / 2 + 40 && Math.abs(tile.y - z.y) < z.h / 2 + 60;
      if (inZone) this.addWord(index);
      else this.layoutPool();
      this.time.delayedCall(30, () => { tile._dragging = false; });
    });
  }

  addWord(poolIndex) {
    if (this.answered) return;
    const word = this.pool[poolIndex];
    if (word == null) return;
    this.pool.splice(poolIndex, 1);
    this.built.push(word);
    window.AudioManager.sfx("click");
    this.layoutPool(); this.layoutBuilt();
  }

  removeWord(builtIndex) {
    if (this.answered) return;
    const word = this.built[builtIndex];
    this.built.splice(builtIndex, 1);
    this.pool.push(word);
    window.AudioManager.sfx("click");
    this.layoutPool(); this.layoutBuilt();
  }

  clearBuilt() {
    if (this.answered) return;
    while (this.built.length) this.pool.push(this.built.pop());
    this.layoutPool(); this.layoutBuilt();
  }

  showHint() {
    const item = this.item;
    this.feedback.setColor(this.T.hex(this.T.colors.accent2));
    this.feedback.setText("💡 " + item.hint.en + (window.GameState.settings.showTranslation ? "\n" + item.hint.pt : ""));
  }

  check() {
    if (this.answered) return;
    const T = this.T;
    const attempt = this.built.join(" ").trim();
    const correct = attempt.toLowerCase() === this.item.answer.toLowerCase();
    this.answered = true;
    window.GameState.registerAnswer(correct, this.phaseKey);
    this.hud.updateScore();
    window.AudioManager.sfx(correct ? "correct" : "wrong");
    T.flashFeedback(this, correct);

    // desabilita botões de ação após responder
    if (this.actionBtns) this.actionBtns.forEach(b => b.setEnabled && b.setEnabled(false));

    if (correct) {
      this.feedback.setColor(T.hex(T.colors.good));
      this.feedback.setText("✓ Correct!  \"" + this.item.answer + "\"");
      window.AudioManager.speak(this.item.answer);
    } else {
      this.feedback.setColor(T.hex(T.colors.bad));
      this.feedback.setText("✕ Not yet. Correct: \"" + this.item.answer + "\"");
      window.AudioManager.speak(this.item.answer);
    }

    if (window.GameState.isGameOver()) {
      this.time.delayedCall(1600, () => { window.AudioManager.sfx("lose"); this.scene.start("ResultScene", { gameOver: true }); });
      return;
    }
    const last = this.idx >= this.items.length - 1;
    const nextBtn = T.button(this, this.scale.width / 2, 690, 260, 50, last ? "Concluir fase  ✓" : "Próxima frase  ▶", {
      onClick: () => this.advance()
    });
    this.stage.add(nextBtn);
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
window.LanguageScene = LanguageScene;
