/* =============================================================================
 *  Flags — premium hand-drawn flags (USA / Spain) as framed badges.
 *  Rounded corners (geometry mask), gold frame, gloss and drop shadow.
 * ===========================================================================*/
window.Flags = {
  _star(g, cx, cy, r, color, alpha) {
    const pts = [];
    for (let i = 0; i < 5; i++) {
      const ao = -Math.PI / 2 + i * (2 * Math.PI / 5);
      pts.push({ x: cx + Math.cos(ao) * r, y: cy + Math.sin(ao) * r });
      const ai = ao + Math.PI / 5;
      pts.push({ x: cx + Math.cos(ai) * r * 0.42, y: cy + Math.sin(ai) * r * 0.42 });
    }
    g.fillStyle(color, alpha == null ? 1 : alpha);
    g.fillPoints(pts, true);
  },

  /* returns a container with the flag badge centered at (x,y) */
  draw(scene, x, y, w, h, code) {
    const T = window.Theme, r = 11;
    const c = scene.add.container(x, y);

    // drop shadow
    const sh = scene.add.graphics();
    sh.fillStyle(0x000000, 0.4); sh.fillRoundedRect(-w / 2 + 3, -h / 2 + 6, w, h, r);
    c.add(sh);

    // flag artwork (square corners; rounded via geometry mask)
    const g = scene.add.graphics();
    const L = -w / 2, Tp = -h / 2;
    if (code === "us") {
      const stripeH = h / 13;
      for (let i = 0; i < 13; i++) {
        g.fillStyle(i % 2 === 0 ? 0xb22234 : 0xffffff, 1);
        g.fillRect(L, Tp + i * stripeH, w, stripeH + 0.5);
      }
      const cw = w * 0.42, ch = stripeH * 7;
      g.fillStyle(0x3c3b6e, 1); g.fillRect(L, Tp, cw, ch);
      // star grid (simplified 5 x 4)
      const cols = 5, rows = 4, sr = Math.min(cw / cols, ch / rows) * 0.32;
      for (let ry = 0; ry < rows; ry++) {
        for (let cx2 = 0; cx2 < cols; cx2++) {
          const sx = L + (cx2 + 0.5) * (cw / cols);
          const sy = Tp + (ry + 0.5) * (ch / rows);
          this._star(g, sx, sy, sr, 0xffffff, 1);
        }
      }
    } else if (code === "es") {
      g.fillStyle(0xaa151b, 1); g.fillRect(L, Tp, w, h * 0.25);
      g.fillStyle(0xf1bf00, 1); g.fillRect(L, Tp + h * 0.25, w, h * 0.5);
      g.fillStyle(0xaa151b, 1); g.fillRect(L, Tp + h * 0.75, w, h * 0.25);
      // stylized emblem (shield hint) on the yellow band, left of center
      const ex = L + w * 0.30, ey = 0, ew = w * 0.16, eh = h * 0.30;
      g.fillStyle(0x8a1218, 0.95); g.fillRoundedRect(ex - ew / 2, ey - eh / 2, ew, eh, 4);
      g.fillStyle(0xf1bf00, 1); g.fillRect(ex - ew / 2, ey - eh / 2, ew / 2, eh / 2);
      g.fillStyle(0xf1bf00, 1); g.fillRect(ex, ey, ew / 2, eh / 2);
      // tiny crown dots
      g.fillStyle(0xf7d94a, 1);
      for (let i = -1; i <= 1; i++) g.fillCircle(ex + i * (ew * 0.28), ey - eh / 2 - 3, 2.2);
    }
    c.add(g);

    // rounded geometry mask (world-space; card is not scaled on hover)
    const mask = scene.make.graphics({ x: 0, y: 0, add: false });
    mask.fillStyle(0xffffff);
    mask.fillRoundedRect(x - w / 2, y - h / 2, w, h, r);
    g.setMask(mask.createGeometryMask());
    c._mask = mask;

    // gloss
    const gloss = scene.add.graphics();
    gloss.fillStyle(0xffffff, 0.16); gloss.fillRoundedRect(-w / 2, -h / 2, w, h * 0.4, { tl: r, tr: r, bl: 0, br: 0 });
    c.add(gloss);
    // gold frame
    const bd = scene.add.graphics();
    bd.lineStyle(3, T.colors.accent2, 0.9); bd.strokeRoundedRect(-w / 2, -h / 2, w, h, r);
    c.add(bd);

    return c;
  }
};
