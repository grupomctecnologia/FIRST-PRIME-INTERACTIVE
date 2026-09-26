/* =============================================================================
 *  UI — componentes de interface baseados nos PNGs do Pack 04 (Interface Premium).
 *  Botões, cards de resposta (4 estados), ícones, barra de progresso e painéis.
 *  Textos e números são desenhados POR CÓDIGO sobre as imagens.
 *  Hit-area sempre via Zone interativa (toque confiável em mobile).
 * ===========================================================================*/
window.UI = {
  ready(scene) { return scene.textures.exists("art_ui_answer_default"); },
  font: '"Segoe UI", "Trebuchet MS", system-ui, -apple-system, Arial, sans-serif',

  _stretch(scene, x, y, tex, w, h) {
    const im = scene.add.image(x, y, tex).setOrigin(0.5);
    im.setDisplaySize(w, h); return im;
  },

  /* Botão de imagem (primary/secondary) com rótulo por código */
  button(scene, x, y, w, h, label, opts = {}) {
    const c = scene.add.container(x, y); c.width = w; c.height = h;
    const secondary = !!opts.secondary || opts.color === (window.Theme && window.Theme.colors.panelLight);
    const tex = "art_ui_button_" + (secondary ? "secondary" : "primary");
    const img = this._stretch(scene, 0, 0, scene.textures.exists(tex) ? tex : "art_ui_button_primary", w, h);
    c.add(img); c.img = img;

    const txt = scene.add.text(0, -1, label, {
      fontFamily: this.font, fontSize: (opts.fontSize || 24) + "px", fontStyle: "bold",
      color: opts.imgTextColor || "#ffffff", align: "center", wordWrap: { width: w - 36 }
    }).setOrigin(0.5);
    txt.setShadow(0, 2, "rgba(0,0,0,0.55)", 4);
    c.add(txt); c.label = txt;

    const hit = scene.add.zone(0, 0, w, h).setOrigin(0.5).setInteractive({ useHandCursor: true });
    c.add(hit); c.hit = hit;
    hit.on("pointerover", () => { scene.tweens.add({ targets: c, scale: 1.04, duration: 110 }); window.AudioManager.sfx("hover"); });
    hit.on("pointerout",  () => scene.tweens.add({ targets: c, scale: 1.0, duration: 110 }));
    hit.on("pointerdown", () => scene.tweens.add({ targets: c, scale: 0.97, duration: 70 }));
    hit.on("pointerup",   () => { scene.tweens.add({ targets: c, scale: 1.0, duration: 90 }); window.AudioManager.sfx("click"); if (opts.onClick) opts.onClick(); });
    c.setEnabled = (en) => { c.disabled = !en; c.setAlpha(en ? 1 : 0.5); if (en) hit.setInteractive({ useHandCursor: true }); else hit.disableInteractive(); };
    return c;
  },

  /* Card de resposta com 4 estados: default | selected | correct | wrong */
  card(scene, x, y, w, h, label, opts = {}) {
    const c = scene.add.container(x, y); c.width = w; c.height = h;
    const img = this._stretch(scene, 0, 0, "art_ui_answer_default", w, h);
    c.add(img); c.img = img; c.state = "default";
    const txt = scene.add.text(0, -1, label, {
      fontFamily: this.font, fontSize: (opts.fontSize || 22) + "px", fontStyle: "bold",
      color: "#0b1630", align: "center", wordWrap: { width: w - 44 }
    }).setOrigin(0.5);
    c.add(txt); c.label = txt;

    c.setState = (st) => {
      c.state = st;
      const tex = "art_ui_answer_" + st;
      if (scene.textures.exists(tex)) img.setTexture(tex).setDisplaySize(w, h);
      // texto claro sobre estados coloridos, escuro no default
      c.label.setColor(st === "default" ? "#0b1630" : "#ffffff");
    };
    if (!opts.noHit) {
      const hit = scene.add.zone(0, 0, w, h).setOrigin(0.5).setInteractive({ useHandCursor: true });
      c.add(hit); c.hit = hit;
      hit.on("pointerover", () => { if (c.state === "default") { c.setState("selected"); window.AudioManager.sfx("hover"); } });
      hit.on("pointerout",  () => { if (c.state === "selected") c.setState("default"); });
      hit.on("pointerup",   () => { if (opts.onClick) opts.onClick(); });
    }
    return c;
  },

  /* Ícone (Pack 04) com hit Zone e função associada */
  icon(scene, x, y, size, name, opts = {}) {
    const c = scene.add.container(x, y);
    const tex = "art_ui_icon_" + name;
    const img = scene.add.image(0, 0, scene.textures.exists(tex) ? tex : "art_ui_icon_settings").setOrigin(0.5);
    img.setDisplaySize(size, size); c.add(img); c.img = img;
    c.setIcon = (nm) => { const t = "art_ui_icon_" + nm; if (scene.textures.exists(t)) img.setTexture(t).setDisplaySize(size, size); };
    c.setGlyph = () => {}; // compat: chamadas antigas de glifo não quebram
    const hitR = Math.max(size * 0.62, 22);
    const hit = scene.add.zone(0, 0, hitR * 2, hitR * 2).setOrigin(0.5).setInteractive({ useHandCursor: true });
    c.add(hit); c.hit = hit;
    hit.on("pointerover", () => { scene.tweens.add({ targets: c, scale: 1.12, duration: 100 }); });
    hit.on("pointerout",  () => scene.tweens.add({ targets: c, scale: 1.0, duration: 100 }));
    hit.on("pointerup",   () => { window.AudioManager.sfx("click"); if (opts.onClick) opts.onClick(); });
    return c;
  },

  /* Barra de progresso: track + fill (recorte por fração) */
  progress(scene, x, y, w, h) {
    const c = scene.add.container(x, y);
    c.add(this._stretch(scene, 0, 0, "art_ui_progress_track", w, h));
    const fillTex = scene.textures.get("art_ui_progress_fill").getSourceImage();
    const fill = scene.add.image(-w / 2, 0, "art_ui_progress_fill").setOrigin(0, 0.5);
    fill.setDisplaySize(w, h); c.add(fill); c.fill = fill; c._w = w; c._src = fillTex.width;
    c.setFrac = (f) => {
      f = Math.max(0, Math.min(1, f));
      fill.setCrop(0, 0, c._src * f, fillTex.height);
      fill.setDisplaySize(w, h); // manter escala; crop limita o visível
    };
    c.setFrac(0);
    return c;
  },

  /* Painel de imagem (hud/dialogue) esticado */
  panel(scene, x, y, w, h, name) {
    const tex = "art_ui_panel_" + name;
    return this._stretch(scene, x, y, scene.textures.exists(tex) ? tex : "art_ui_panel_hud", w, h);
  }
};
