/* =============================================================================
 *  Art — camada CINEMATOGRÁFICA baseada na ARTE OFICIAL APROVADA.
 *  Usa o casal de protagonistas e o cenário de Londres recortados da referência
 *  (references/game-01/reference-approved.png), embutidos em PRIME_ART (base64).
 *  Quando os assets existem, os fundos das cenas passam a ser a foto de Londres
 *  com grade de cor por fase; senão, cai no fundo vetorial (fallback).
 * ===========================================================================*/
window.Art = {
  keys: ["bg_london", "char_boy", "char_girl", "char_girl_brief", "char_boy_goggles"],

  /* Carrega as texturas (chamar no preload de PreloadScene) */
  preload(scene) {
    const A = window.PRIME_ART;
    if (!A) return;
    this.keys.forEach((k) => {
      if (A[k] && !scene.textures.exists("art_" + k)) scene.load.image("art_" + k, A[k]);
    });
  },

  ready(scene) {
    return !!(window.PRIME_ART && scene.textures.exists("art_bg_london"));
  },

  /* Grade de cor (clima) por fase — mesma Londres, humor diferente */
  grades: {
    home:     { tint: 0x1a2a55, tintA: 0.30, warm: 0x2a3f7a },
    travel:   { tint: 0xff9c4a, tintA: 0.26, warm: 0xffb14a },  // amanhecer/viagem
    audio:    { tint: 0x1fb6d6, tintA: 0.30, warm: 0x2ad0c0 },  // frio/escuta
    dialogue: { tint: 0xff6fa8, tintA: 0.26, warm: 0xff9a5c },  // entardecer/conversa
    tech:     { tint: 0x27d6b0, tintA: 0.30, warm: 0x38e1ff },  // digital
    mission:  { tint: 0x7a6bff, tintA: 0.30, warm: 0x5ce1ff },  // clímax
    result:   { tint: 0xffcf5c, tintA: 0.24, warm: 0xffe08a }   // comemorativo
  },

  /* Fundo cinematográfico de Londres com grade da fase (depth negativo) */
  background(scene, key = "home") {
    const { width: w, height: h } = scene.scale;
    const g = this.grades[key] || this.grades.home;

    // base preta (garante fundo mesmo antes da imagem)
    scene.add.rectangle(w / 2, h / 2, w, h, 0x05070f).setDepth(-20);

    // foto de Londres em cover-fit
    const img = scene.add.image(w / 2, h / 2, "art_bg_london").setDepth(-14);
    const s = Math.max(w / img.width, h / img.height);
    img.setScale(s);
    img.setTint(0x9fb2d8); // leve dessaturação para não competir com a UI

    // escurecimento base (legibilidade sobre a foto)
    const base = scene.add.graphics().setDepth(-13);
    base.fillStyle(0x05070f, 0.30); base.fillRect(0, 0, w, h);
    // grade de cor da fase (multiplica o clima)
    const grade = scene.add.graphics().setDepth(-12);
    grade.fillStyle(g.tint, g.tintA); grade.fillRect(0, 0, w, h);
    // brilho quente no topo (rim/atmosfera)
    const warm = scene.add.graphics().setDepth(-11);
    warm.fillStyle(g.warm, 0.14); warm.fillCircle(w * 0.5, -h * 0.12, w * 0.6);
    warm.setBlendMode(Phaser.BlendModes.ADD);

    // escurecimento superior + inferior (legibilidade do texto/HUD)
    const scrim = scene.add.graphics().setDepth(-10);
    scrim.fillStyle(0x05070f, 0.58); scrim.fillRect(0, 0, w, h * 0.22);
    scrim.fillStyle(0x05070f, 0.70); scrim.fillRect(0, h * 0.62, w, h * 0.38);
    // vinheta lateral (esconde bordas/artefatos do recorte)
    scrim.fillStyle(0x05070f, 0.40); scrim.fillRect(0, 0, w * 0.08, h); scrim.fillRect(w * 0.92, 0, w * 0.08, h);

    // partículas de atmosfera
    if (window.Theme) window.Theme.particles(scene, g.warm).setDepth(-8);
    return img;
  },

  /* Coloca um protagonista (imagem recortada) na cena */
  character(scene, key, x, y, targetH, opts = {}) {
    const tex = "art_char_" + key;
    if (!scene.textures.exists(tex)) return null;
    const img = scene.add.image(x, y, tex).setOrigin(opts.originX != null ? opts.originX : 0.5, opts.originY != null ? opts.originY : 1);
    const s = targetH / img.height; img.setScale(s);
    if (opts.flip) img.setFlipX(true);
    img.setDepth(opts.depth != null ? opts.depth : -3);
    // sombra de contato
    const sh = scene.add.ellipse(x, y - 4, img.displayWidth * 0.7, 20, 0x000000, 0.35).setDepth(img.depth - 1);
    // respiração sutil
    scene.tweens.add({ targets: img, y: y - (opts.float || 5), duration: 2200, yoyo: true, repeat: -1, ease: "Sine.inOut" });
    img._shadow = sh;
    return img;
  }
};
