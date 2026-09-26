/* =============================================================================
 *  Shop (Game 02) — componentes de interface baseados no Pack 04 (Telas e
 *  Elementos de Interface do London Shopping Mission). Botões, painéis, cartão
 *  de produto, etiqueta de preço, moeda, slots de inventário e ícones.
 *  Textos e números são desenhados POR CÓDIGO sobre as imagens oficiais.
 *  Hit-area sempre via Zone interativa (toque confiável em mobile).
 *  Se uma textura não existir, cai para o desenho vetorial do Theme.
 * ===========================================================================*/
window.Shop = {
  font: '"Segoe UI", "Trebuchet MS", system-ui, -apple-system, Arial, sans-serif',
  ready(scene) { return scene.textures.exists("art_ui_button_primary"); },

  _img(scene, x, y, tex, w, h) {
    const im = scene.add.image(x, y, tex).setOrigin(0.5);
    im.setDisplaySize(w, h); return im;
  },

  /* Botão de imagem (primário/secundário) com rótulo por código */
  button(scene, x, y, w, h, label, opts = {}) {
    const T = window.Theme;
    const tex = "art_ui_button_" + (opts.secondary ? "secondary" : "primary");
    if (!scene.textures.exists(tex)) {
      return T.button(scene, x, y, w, h, label, opts.secondary
        ? { color: T.colors.panelLight, color2: T.colors.panel, textColor: T.colors.text, fontSize: opts.fontSize, onClick: opts.onClick }
        : T.goldOpts({ fontSize: opts.fontSize, onClick: opts.onClick }));
    }
    const c = scene.add.container(x, y); c.width = w; c.height = h;
    const img = this._img(scene, 0, 0, tex, w, h); c.add(img); c.img = img;
    const txt = scene.add.text(0, -1, label, {
      fontFamily: this.font, fontSize: (opts.fontSize || 24) + "px", fontStyle: "bold",
      color: opts.textColor || "#ffffff", align: "center", wordWrap: { width: w - 44 }
    }).setOrigin(0.5);
    txt.setShadow(0, 2, "rgba(0,0,0,0.55)", 4); c.add(txt); c.label = txt;
    const hit = scene.add.zone(0, 0, w, h).setOrigin(0.5).setInteractive({ useHandCursor: true });
    c.add(hit); c.hit = hit;
    hit.on("pointerover", () => { scene.tweens.add({ targets: c, scale: 1.04, duration: 110 }); window.AudioManager.sfx("hover"); });
    hit.on("pointerout", () => scene.tweens.add({ targets: c, scale: 1.0, duration: 110 }));
    hit.on("pointerdown", () => scene.tweens.add({ targets: c, scale: 0.97, duration: 70 }));
    hit.on("pointerup", () => { scene.tweens.add({ targets: c, scale: 1.0, duration: 90 }); window.AudioManager.sfx("click"); if (opts.onClick) opts.onClick(); });
    c.setEnabled = (en) => { c.disabled = !en; c.setAlpha(en ? 1 : 0.5); if (en) hit.setInteractive({ useHandCursor: true }); else hit.disableInteractive(); };
    return c;
  },

  /* Ícone do Pack 04 (back|check|bag|coin) com hit Zone e ação */
  iconBtn(scene, x, y, size, name, opts = {}) {
    const T = window.Theme;
    const tex = "art_ui_icon_" + name;
    const c = scene.add.container(x, y);
    if (scene.textures.exists(tex)) {
      const img = scene.add.image(0, 0, tex).setOrigin(0.5); img.setDisplaySize(size, size);
      c.add(img); c.img = img;
    } else {
      const glyphs = { back: "←", check: "✓", bag: "🛍️", coin: "◉" };
      c.add(scene.add.text(0, 0, glyphs[name] || "•", { fontFamily: this.font, fontSize: (size * 0.7) + "px", color: T.hex(T.colors.accent2) }).setOrigin(0.5));
    }
    if (opts.onClick) {
      const hitR = Math.max(size * 0.6, 24);
      const hit = scene.add.zone(0, 0, hitR * 2, hitR * 2).setOrigin(0.5).setInteractive({ useHandCursor: true });
      c.add(hit); c.hit = hit;
      hit.on("pointerover", () => scene.tweens.add({ targets: c, scale: 1.12, duration: 100 }));
      hit.on("pointerout", () => scene.tweens.add({ targets: c, scale: 1.0, duration: 100 }));
      hit.on("pointerup", () => { window.AudioManager.sfx("click"); opts.onClick(); });
    }
    return c;
  },

  /* Imagem decorativa simples do Pack 04 (moeda, sacola) — sem hit */
  deco(scene, x, y, size, name) {
    const tex = "art_ui_icon_" + name;
    if (!scene.textures.exists(tex)) return null;
    const im = scene.add.image(x, y, tex).setOrigin(0.5); im.setDisplaySize(size, size);
    return im;
  },

  /* Painel de imagem (mission|confirm) esticado, com fallback vetorial */
  panel(scene, x, y, w, h, name) {
    const T = window.Theme;
    const tex = "art_ui_panel_" + name;
    if (!scene.textures.exists(tex)) return T.card(scene, x, y, w, h, { border: T.colors.accent2 });
    return this._img(scene, x, y, tex, w, h);
  },

  /* Etiqueta de preço (Pack 04) com texto por código. Retorna container. */
  priceTag(scene, x, y, w, h, text) {
    const T = window.Theme;
    const c = scene.add.container(x, y);
    const tex = "art_ui_price_tag";
    if (scene.textures.exists(tex)) c.add(this._img(scene, 0, 0, tex, w, h));
    else { const card = T.card(scene, 0, 0, w, h, { border: T.colors.accent2, fill: T.colors.panelLight }); c.add(card); }
    const t = scene.add.text(2, 2, text, { fontFamily: this.font, fontSize: Math.round(h * 0.42) + "px", fontStyle: "bold", color: "#20140a" }).setOrigin(0.5);
    if (!scene.textures.exists(tex)) t.setColor(T.hex(T.colors.accent2));
    c.add(t); c.label = t;
    return c;
  },

  /* Cartão de produto (Pack 04, moldura vertical): imagem do item ao centro +
     rótulo/preço na faixa inferior. Retorna container com .setItem(). */
  productCard(scene, x, y, w, h, opts = {}) {
    const T = window.Theme;
    const c = scene.add.container(x, y); c.w = w; c.h = h;
    const tex = "art_ui_product_card";
    if (scene.textures.exists(tex)) c.add(this._img(scene, 0, 0, tex, w, h));
    else c.add(T.card(scene, 0, 0, w, h, { border: T.colors.accent2 }));
    c.slot = scene.add.container(0, -h * 0.10); c.add(c.slot);
    c.caption = scene.add.text(0, h * 0.34, opts.caption || "", {
      fontFamily: this.font, fontSize: Math.round(h * 0.075) + "px", fontStyle: "bold",
      color: "#20140a", align: "center", wordWrap: { width: w * 0.7 }
    }).setOrigin(0.5);
    c.add(c.caption);
    c.setItem = (itemKey, targetH) => {
      c.slot.removeAll(true);
      const im = window.Art.item(scene, itemKey, 0, 0, targetH || h * 0.5, { originX: 0.5, originY: 0.5, depth: 6 });
      if (im) c.slot.add(im);
    };
    return c;
  },

  /* Barra de progresso do Pack 04 (recorte por fração). */
  progress(scene, x, y, w, h) {
    const T = window.Theme;
    const c = scene.add.container(x, y);
    const tex = "art_ui_progress";
    if (scene.textures.exists(tex)) {
      const track = this._img(scene, 0, 0, tex, w, h); track.setAlpha(0.35); c.add(track);
      const fill = scene.add.image(-w / 2, 0, tex).setOrigin(0, 0.5); fill.setDisplaySize(w, h);
      const src = scene.textures.get(tex).getSourceImage(); c.add(fill);
      c.setFrac = (f) => { f = Math.max(0, Math.min(1, f)); fill.setCrop(0, 0, src.width * f, src.height); fill.setDisplaySize(w, h); };
    } else {
      const g = scene.add.graphics(); c.add(g);
      c.setFrac = (f) => { f = Math.max(0, Math.min(1, f)); g.clear(); g.fillStyle(0x1e2750, 1); g.fillRoundedRect(-w / 2, -h / 2, w, h, h / 2); g.fillStyle(T.colors.accent, 1); g.fillRoundedRect(-w / 2, -h / 2, w * f, h, h / 2); };
    }
    c.setFrac(0);
    return c;
  }
};
