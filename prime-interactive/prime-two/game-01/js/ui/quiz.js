/* =============================================================================
 *  Quiz — multiple-choice grid with RETRY on wrong answers.
 *  Wrong: that option is disabled/greyed (correct answer is NEVER revealed),
 *  and the player may try the remaining options. Correct: all disabled, proceed.
 *  onAnswer(index, isCorrect) is called on EACH attempt.
 * ===========================================================================*/
window.Quiz = {
  options(scene, opts) {
    const T = window.Theme;
    const c = scene.add.container(0, 0);
    const options = opts.options;
    const cols = opts.cols || (options.length <= 2 ? options.length : 2);
    const rows = Math.ceil(options.length / cols);
    const bw = opts.buttonWidth || 320;
    const bh = opts.buttonHeight || 60;
    const gapX = 24, gapY = 16;
    const totalW = cols * bw + (cols - 1) * gapX;
    const startX = opts.x - totalW / 2 + bw / 2;
    const startY = opts.y;
    const buttons = [];
    let answered = false;

    options.forEach((label, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const bx = startX + col * (bw + gapX);
      const by = startY + row * (bh + gapY);
      const b = T.button(scene, bx, by, bw, bh, label, {
        color: T.colors.panelLight, color2: T.colors.panel, textColor: T.colors.text, fontSize: 22,
        onClick: () => {
          if (answered) return;
          const correct = i === opts.correctIndex;
          if (correct) {
            answered = true;
            buttons.forEach((bb) => { if (bb.hit) bb.hit.disableInteractive(); });
            this._recolor(scene, b, T.colors.good);
            window.AudioManager.sfx("correct");
            T.flashFeedback(scene, true);
            if (opts.onAnswer) opts.onAnswer(i, true);
          } else {
            // disable ONLY this wrong option; allow retry on the rest
            if (b.hit) b.hit.disableInteractive();
            this._recolor(scene, b, T.colors.bad);
            b.setAlpha(0.75);
            window.AudioManager.sfx("wrong");
            T.flashFeedback(scene, false);
            if (opts.onAnswer) opts.onAnswer(i, false);
          }
        }
      });
      buttons.push(b);
      c.add(b);
    });
    c.buttons = buttons;
    c.correctIndex = opts.correctIndex;
    c.totalHeight = rows * bh + (rows - 1) * gapY;
    return c;
  },

  _recolor(scene, btn, color) {
    const g = btn.list[0];
    const w = btn.width, h = btn.height, r = 16;
    g.clear();
    g.fillStyle(0x000000, 0.35); g.fillRoundedRect(-w / 2 + 3, -h / 2 + 6, w, h, r);
    g.fillStyle(color, 1); g.fillRoundedRect(-w / 2, -h / 2, w, h, r);
    g.fillStyle(0xffffff, 0.18); g.fillRoundedRect(-w / 2, -h / 2, w, h * 0.42, { tl: r, tr: r, bl: 0, br: 0 });
    if (btn.label) btn.label.setColor("#0b1026");
  }
};
