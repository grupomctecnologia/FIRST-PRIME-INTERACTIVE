/* =============================================================================
 *  Art (Game 02) — camada de imagens OFICIAIS (packs 01–04 do London Shopping
 *  Mission). Carrega por nome de arquivo (PRIME_ASSETS) ou, na prévia
 *  single-file, por base64 (PRIME_ART_DATA).
 *  Cenários da loja por fase + Alex/Emma (transparentes) + itens de compra.
 * ===========================================================================*/
window.Art = {
  /* Carrega todas as texturas (chamar no preload de PreloadScene) */
  preload(scene) {
    const U = window.PRIME_ASSETS || {};
    const D = window.PRIME_ART_DATA || null;   // base64 (prévia single-file)
    Object.keys(U).forEach((k) => {
      if (scene.textures.exists("art_" + k)) return;
      const src = (D && D[k]) ? D[k] : U[k];
      if (src) { try { scene.load.image("art_" + k, src); } catch (e) {} }
    });
  },

  ready(scene) {
    return !!((window.PRIME_ASSETS || window.PRIME_ART_DATA) && scene.textures.exists("art_bg_street"));
  },

  /* Fase -> cenário da loja correspondente */
  bgFor: {
    home: "bg_street", langselect: "bg_street", intro: "bg_street",
    shop: "bg_clothing", list: "bg_accessories", checkout: "bg_checkout",
    talk: "bg_fitting", cart: "bg_clothing", result: "bg_street",
    // store keys usados pela fase final
    clothing: "bg_clothing", shoes: "bg_shoes", accessories: "bg_accessories"
  },
  /* Grade de cor leve por fase (só clima; assenta a UI sobre a foto clara) */
  grades: {
    home: { t: 0x0a1430, a: 0.30 }, intro: { t: 0x0a1430, a: 0.30 },
    shop: { t: 0x0a1430, a: 0.24 }, list: { t: 0x0a1430, a: 0.26 },
    checkout: { t: 0x0a1430, a: 0.24 }, talk: { t: 0x140a20, a: 0.26 },
    cart: { t: 0x0a1430, a: 0.24 }, result: { t: 0x0a1430, a: 0.28 }
  },

  /* Fundo (cover-fit) + grade de clima + scrims de leitura (topo/base) */
  background(scene, key = "home") {
    const { width: w, height: h } = scene.scale;
    const tex = "art_" + (this.bgFor[key] || "bg_street");
    const g = this.grades[key] || this.grades.home;

    scene.add.rectangle(w / 2, h / 2, w, h, 0x05070f).setDepth(-20);
    const img = scene.add.image(w / 2, h / 2, scene.textures.exists(tex) ? tex : "art_bg_street").setDepth(-14);
    const s = Math.max(w / img.width, h / img.height); img.setScale(s);

    // grade de clima (leve — só para dar contraste à interface)
    const grade = scene.add.graphics().setDepth(-12);
    grade.fillStyle(g.t, g.a); grade.fillRect(0, 0, w, h);
    // scrim superior (HUD) + inferior (opções), sem faixas laterais
    const scrim = scene.add.graphics().setDepth(-10);
    scrim.fillStyle(0x05070f, 0.40); scrim.fillRect(0, 0, w, 64);
    scrim.fillStyle(0x05070f, 0.34); scrim.fillRect(0, h * 0.60, w, h * 0.40);
    return img;
  },

  /* Protagonista (transparente). who = "alex"|"emma", pose opcional. */
  character(scene, who, pose, x, y, targetH, opts = {}) {
    const key = "alex" === who || "emma" === who ? (who + "_" + (pose || "neutral")) : who;
    const tex = "art_" + key;
    if (!scene.textures.exists(tex)) return null;
    const img = scene.add.image(x, y, tex).setOrigin(opts.originX != null ? opts.originX : 0.5, opts.originY != null ? opts.originY : 1);
    img.setScale(targetH / img.height); if (opts.flip) img.setFlipX(true);
    img.setDepth(opts.depth != null ? opts.depth : -3);
    scene.add.ellipse(x, y - 2, img.displayWidth * 0.58, 18, 0x000000, 0.34).setDepth(img.depth - 1);
    if (opts.float !== false) scene.tweens.add({ targets: img, y: y - (opts.float || 5), duration: 2400, yoyo: true, repeat: -1, ease: "Sine.inOut" });
    return img;
  },

  /* Item de compra transparente (Pack 03). key = "tshirt_blue", "backpack"... */
  item(scene, key, x, y, targetH, opts = {}) {
    const tex = "art_item_" + key;
    if (!scene.textures.exists(tex)) return null;
    const img = scene.add.image(x, y, tex).setOrigin(opts.originX != null ? opts.originX : 0.5, opts.originY != null ? opts.originY : 0.5);
    img.setScale(targetH / img.height); if (opts.flip) img.setFlipX(true);
    img.setDepth(opts.depth != null ? opts.depth : 5);
    if (opts.alpha != null) img.setAlpha(opts.alpha);
    return img;
  }
};
