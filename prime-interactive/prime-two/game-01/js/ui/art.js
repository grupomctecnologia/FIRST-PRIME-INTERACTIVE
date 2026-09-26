/* =============================================================================
 *  Art — camada CINEMATOGRÁFICA baseada na ARTE OFICIAL APROVADA (v2, realista).
 *  Casal de protagonistas + Londres + props por fase, recortados da referência
 *  (references/game-01/reference-approved-2.png), em PRIME_ART (base64).
 *  Backdrop de Londres (rua/aeroporto) com grade de cor por fase; a Final usa o
 *  MAPA (progressão até o destino). Sem arte → fallback vetorial.
 * ===========================================================================*/
window.Art = {
  keys: ["bg_london", "bg_map", "char_boy", "char_girl", "char_couple",
         "char_boy_intro", "char_girl_head", "prop_phonebox", "prop_bigben",
         "prop_bus", "prop_museum"],

  preload(scene) {
    const A = window.PRIME_ART;
    if (!A) return;
    this.keys.forEach((k) => {
      if (A[k] && !scene.textures.exists("art_" + k)) scene.load.image("art_" + k, A[k]);
    });
  },

  ready(scene) { return !!(window.PRIME_ART && scene.textures.exists("art_bg_london")); },

  /* Grade de cor (clima) por fase — mesma Londres realista, humor diferente */
  grades: {
    home:     { tint: 0x16244e, tintA: 0.20, warm: 0xffb14a },
    intro:    { tint: 0x1a2a55, tintA: 0.16, warm: 0xffc06a },
    travel:   { tint: 0xff9c4a, tintA: 0.18, warm: 0xffb14a },
    audio:    { tint: 0x1f8fd6, tintA: 0.20, warm: 0x2ad0c0 },
    dialogue: { tint: 0xff6fa8, tintA: 0.18, warm: 0xff9a5c },
    tech:     { tint: 0x27a6b0, tintA: 0.20, warm: 0x38e1ff },
    mission:  { tint: 0x2a3a66, tintA: 0.12, warm: 0x8a7bff },  // mapa (mais claro)
    result:   { tint: 0x1c2c58, tintA: 0.18, warm: 0xffe08a }
  },

  bgTexFor(key) {
    return (key === "mission") ? "art_bg_map" : "art_bg_london";
  },

  /* Fundo cinematográfico com grade da fase (depth negativo) */
  background(scene, key = "home") {
    const { width: w, height: h } = scene.scale;
    const g = this.grades[key] || this.grades.home;
    const tex = this.bgTexFor(key);

    scene.add.rectangle(w / 2, h / 2, w, h, 0x05070f).setDepth(-20);
    const img = scene.add.image(w / 2, h / 2, scene.textures.exists(tex) ? tex : "art_bg_london").setDepth(-14);
    const s = Math.max(w / img.width, h / img.height); img.setScale(s);
    img.setTint(0xaebfe0);

    // escurecimento base + grade de cor da fase
    const base = scene.add.graphics().setDepth(-13);
    base.fillStyle(0x05070f, key === "mission" ? 0.20 : 0.30); base.fillRect(0, 0, w, h);
    const grade = scene.add.graphics().setDepth(-12);
    grade.fillStyle(g.tint, g.tintA); grade.fillRect(0, 0, w, h);
    const warm = scene.add.graphics().setDepth(-11);
    warm.fillStyle(g.warm, 0.12); warm.fillCircle(w * 0.5, -h * 0.12, w * 0.6); warm.setBlendMode(Phaser.BlendModes.ADD);

    // escurecimento topo/base + vinheta (legibilidade)
    const scrim = scene.add.graphics().setDepth(-10);
    scrim.fillStyle(0x05070f, 0.58); scrim.fillRect(0, 0, w, h * 0.20);
    scrim.fillStyle(0x05070f, key === "mission" ? 0.55 : 0.66); scrim.fillRect(0, h * 0.64, w, h * 0.36);
    scrim.fillStyle(0x05070f, 0.36); scrim.fillRect(0, 0, w * 0.07, h); scrim.fillRect(w * 0.93, 0, w * 0.07, h);

    if (window.Theme) window.Theme.particles(scene, g.warm).setDepth(-8);
    return img;
  },

  /* Protagonista recortado (arte oficial aprovada) */
  character(scene, key, x, y, targetH, opts = {}) {
    const tex = "art_char_" + key;
    if (!scene.textures.exists(tex)) return null;
    const img = scene.add.image(x, y, tex).setOrigin(opts.originX != null ? opts.originX : 0.5, opts.originY != null ? opts.originY : 1);
    img.setScale(targetH / img.height); if (opts.flip) img.setFlipX(true);
    img.setDepth(opts.depth != null ? opts.depth : -3);
    scene.add.ellipse(x, y - 4, img.displayWidth * 0.7, 20, 0x000000, 0.35).setDepth(img.depth - 1);
    scene.tweens.add({ targets: img, y: y - (opts.float || 5), duration: 2200, yoyo: true, repeat: -1, ease: "Sine.inOut" });
    return img;
  },

  /* Prop temático da fase (cabine, Big Ben, ônibus, museu) — bottom-anchored */
  prop(scene, key, x, y, targetH, opts = {}) {
    const tex = "art_prop_" + key;
    if (!scene.textures.exists(tex)) return null;
    const img = scene.add.image(x, y, tex).setOrigin(0.5, 1);
    img.setScale(targetH / img.height); if (opts.flip) img.setFlipX(true);
    img.setDepth(opts.depth != null ? opts.depth : -5);
    img.setAlpha(opts.alpha != null ? opts.alpha : 0.92);
    return img;
  }
};
