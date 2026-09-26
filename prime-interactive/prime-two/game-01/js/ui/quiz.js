/* =============================================================================
 *  Quiz — grade de opções de múltipla escolha reutilizável.
 *  Destaca acerto/erro, desabilita após responder e dispara callback.
 * ===========================================================================*/
window.Quiz = {
  /* opts: { x, y, width, options:[str], correctIndex, cols, onAnswer(idx, isCorrect) } */
  options(scene, opts) {
    const T = window.Theme;
    const c = scene.add.container(0, 0);
    const options = opts.options;
    const cols = opts.cols || (options.length <= 2 ? options.length : 2);
    const rows = Math.ceil(options.length / cols);
    const bw = opts.buttonWidth || 340;
    const bh = opts.buttonHeight || 66;
    const gapX = 24, gapY = 18;
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
        color: T.colors.panelLight, color2: T.colors.panel, textColor: T.colors.text,
        fontSize: 22,
        onClick: () => {
          if (answered) return;
          answered = true;
          const correct = i === opts.correctIndex;
          // recolore
          buttons.forEach((bb, j) => {
            if (bb.hit) bb.hit.disableInteractive();
            if (j === opts.correctIndex) { bb._draw = null; this._recolor(scene, bb, T.colors.good); }
            else if (j === i) this._recolor(scene, bb, T.colors.bad);
            else bb.setAlpha(0.5);
          });
          window.AudioManager.sfx(correct ? "correct" : "wrong");
          T.flashFeedback(scene, correct);
          if (opts.onAnswer) opts.onAnswer(i, correct);
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
