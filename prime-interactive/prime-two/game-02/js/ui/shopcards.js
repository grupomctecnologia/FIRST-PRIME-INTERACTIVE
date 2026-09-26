/* =============================================================================
 *  ShopCards — card de item reutilizável (imagem do produto do Pack 03 sobre um
 *  card em vidro, com 4 estados: default | hover | correct | wrong). Hit via
 *  Zone (toque confiável). Opcional: legendas de cor/tamanho na base.
 *  Usado por Find the Item, Colour and Size e Shopping Bag.
 * ===========================================================================*/
window.ShopCards = {
  itemCard(scene, x, y, w, h, itemKey, onClick, opts = {}) {
    const T = window.Theme;
    const c = scene.add.container(x, y); c.state = "default"; c.key = itemKey;
    const g = scene.add.graphics(); c.add(g);
    const badges = opts.badges || [];
    const imgH = badges.length ? h * 0.58 : h * 0.72;
    const draw = (state) => {
      g.clear();
      const border = state === "correct" ? T.colors.good : state === "wrong" ? T.colors.bad : (state === "hover" ? T.colors.accent2 : T.colors.accent);
      g.fillStyle(0x000000, 0.34); g.fillRoundedRect(-w / 2 + 3, -h / 2 + 6, w, h, 16);
      g.fillStyle(T.colors.panelLight, 0.9); g.fillRoundedRect(-w / 2, -h / 2, w, h, 16);
      g.lineStyle(state === "default" ? 2 : 4, border, state === "default" ? 0.6 : 1); g.strokeRoundedRect(-w / 2, -h / 2, w, h, 16);
      g.fillStyle(0xffffff, 0.05); g.fillRoundedRect(-w / 2, -h / 2, w, h * 0.4, { tl: 16, tr: 16, bl: 0, br: 0 });
    };
    draw("default");
    const im = window.Art.item(scene, itemKey, 0, badges.length ? -h * 0.14 : -2, imgH, { originX: 0.5, originY: 0.5, depth: 5 });
    if (im) c.add(im);

    if (badges.length) {
      const by = h / 2 - 24, bw = 66, gap = 10, totalW = badges.length * bw + (badges.length - 1) * gap;
      let bx = -totalW / 2 + bw / 2;
      badges.forEach((b) => {
        const bg = scene.add.graphics();
        bg.fillStyle(b.fill != null ? b.fill : 0x0a0f24, 0.85); bg.fillRoundedRect(bx - bw / 2, by - 14, bw, 28, 8);
        bg.lineStyle(1.5, b.stroke != null ? b.stroke : T.colors.accent2, 0.8); bg.strokeRoundedRect(bx - bw / 2, by - 14, bw, 28, 8);
        c.add(bg);
        c.add(scene.add.text(bx, by, b.text, { fontFamily: T.font, fontSize: "14px", fontStyle: "bold", color: b.color || "#eef3ff" }).setOrigin(0.5));
        bx += bw + gap;
      });
    }

    c.setCardState = (st) => { c.state = st; draw(st); };
    c.setSize(w, h);
    const hit = scene.add.zone(0, 0, w, h).setOrigin(0.5).setInteractive({ useHandCursor: true });
    c.add(hit); c.hit = hit;
    hit.on("pointerover", () => { if (c.state === "default") { draw("hover"); window.AudioManager.sfx("hover"); } });
    hit.on("pointerout", () => { if (c.state === "default") draw("default"); });
    hit.on("pointerup", () => { if (c.state === "default" || c.state === "hover") onClick(); });
    return c;
  }
};
