/* =============================================================================
 *  Quiz — grade de múltipla escolha com RETRY e os 4 ESTADOS de card do Pack 04:
 *  neutro (default) · selecionado (hover) · correto · errado.
 *  Errado: aquele card fica "wrong" e é desabilitado (a resposta certa NUNCA é
 *  revelada); o jogador tenta os demais. Correto: todos desabilitam, avança.
 *  onAnswer(index, isCorrect) é chamado a cada tentativa.
 * ===========================================================================*/
window.Quiz = {
  options(scene, opts) {
    const T = window.Theme;
    const useCards = !!(window.UI && window.UI.ready(scene));
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

      const handle = () => {
        if (answered) return;
        const correct = i === opts.correctIndex;
        if (correct) {
          answered = true;
          buttons.forEach((bb) => { if (bb.hit) bb.hit.disableInteractive(); });
          this._mark(b, "correct");
          window.AudioManager.sfx("correct"); T.flashFeedback(scene, true);
          if (opts.onAnswer) opts.onAnswer(i, true);
        } else {
          if (b.hit) b.hit.disableInteractive();
          this._mark(b, "wrong"); b.setAlpha(0.92);
          window.AudioManager.sfx("wrong"); T.flashFeedback(scene, false);
          if (opts.onAnswer) opts.onAnswer(i, false);
        }
      };

      let b;
      if (useCards) {
        b = window.UI.card(scene, bx, by, bw, bh, label, { fontSize: 22, onClick: handle });
      } else {
        b = T.button(scene, bx, by, bw, bh, label, {
          color: T.colors.panelLight, color2: T.colors.panel, textColor: T.colors.text, fontSize: 22, onClick: handle
        });
      }
      buttons.push(b);
      c.add(b);
    });
    c.buttons = buttons;
    c.correctIndex = opts.correctIndex;
    c.totalHeight = rows * bh + (rows - 1) * gapY;
    return c;
  },

  /* Aplica estado visual (card de imagem) ou recolore (fallback vetorial) */
  _mark(btn, state) {
    if (btn.setState) { btn.setState(state); return; }        // card de imagem
    const T = window.Theme, color = state === "correct" ? T.colors.good : T.colors.bad;
    if (btn.recolor) btn.recolor(color);
    if (btn.label) btn.label.setColor("#08122c");
  }
};
