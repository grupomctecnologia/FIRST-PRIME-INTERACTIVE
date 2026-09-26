/* =============================================================================
 *  Art — camada de imagens OFICIAIS (packs 01–04). Carrega por nome de arquivo
 *  (PRIME_ASSETS) ou, na prévia single-file, por base64 (PRIME_ART_DATA).
 *  Fundos de Londres por fase + personagens Alex/Emma (transparentes).
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
    return !!((window.PRIME_ASSETS || window.PRIME_ART_DATA) && scene.textures.exists("art_bg_wide"));
  },

  /* Fase -> fundo de Londres correspondente */
  bgFor: {
    home: "bg_wide", langselect: "bg_dusk", intro: "bg_metro",
    travel: "bg_bus", audio: "bg_bigben", dialogue: "bg_cafe",
    tech: "bg_park", mission: "bg_tower", result: "bg_wide"
  },
  /* Grade de cor leve por fase (só clima; os fundos já são cenas limpas) */
  grades: {
    home:{t:0x0a1430,a:0.14}, langselect:{t:0x0a1430,a:0.18}, intro:{t:0x0a1430,a:0.16},
    travel:{t:0x1a1330,a:0.14}, audio:{t:0x0a1a30,a:0.16}, dialogue:{t:0x20101c,a:0.14},
    tech:{t:0x0a1a18,a:0.14}, mission:{t:0x0a1330,a:0.16}, result:{t:0x0a1430,a:0.14}
  },

  /* Fundo cinematográfico por fase (cover-fit) + scrims de leitura */
  background(scene, key = "home") {
    const { width: w, height: h } = scene.scale;
    const tex = "art_" + (this.bgFor[key] || "bg_wide");
    const g = this.grades[key] || this.grades.home;

    scene.add.rectangle(w / 2, h / 2, w, h, 0x05070f).setDepth(-20);
    const img = scene.add.image(w / 2, h / 2, scene.textures.exists(tex) ? tex : "art_bg_wide").setDepth(-14);
    const s = Math.max(w / img.width, h / img.height); img.setScale(s);

    // grade de clima (bem leve — sem faixas escuras nas bordas)
    const grade = scene.add.graphics().setDepth(-12);
    grade.fillStyle(g.t, g.a); grade.fillRect(0, 0, w, h);
    // apenas um degradê suave na base, para assentar as opções (sem barra no topo/laterais)
    const scrim = scene.add.graphics().setDepth(-10);
    scrim.fillStyle(0x05070f, 0.30); scrim.fillRect(0, h * 0.62, w, h * 0.38);
    return img;
  },

  /* Protagonista (transparente). key lógica -> textura carregada. */
  character(scene, key, x, y, targetH, opts = {}) {
    const map = { boy: "char_boy", girl: "char_girl", boy_intro: "char_boy_speak",
      boy_point: "char_boy_point", boy_speak: "char_boy_speak", boy_listen: "char_boy_listen",
      girl_head: "char_girl_head", girl_brief: "char_girl_brief", girl_speak: "char_girl_speak" };
    const tex = "art_" + (map[key] || ("char_" + key));
    if (!scene.textures.exists(tex)) return null;
    const img = scene.add.image(x, y, tex).setOrigin(opts.originX != null ? opts.originX : 0.5, opts.originY != null ? opts.originY : 1);
    img.setScale(targetH / img.height); if (opts.flip) img.setFlipX(true);
    img.setDepth(opts.depth != null ? opts.depth : -3);
    scene.add.ellipse(x, y - 2, img.displayWidth * 0.62, 18, 0x000000, 0.34).setDepth(img.depth - 1);
    if (opts.float !== false) scene.tweens.add({ targets: img, y: y - (opts.float || 5), duration: 2400, yoyo: true, repeat: -1, ease: "Sine.inOut" });
    return img;
  },

  /* Objeto/prop transparente (Pack 03). name = "suitcase","big_ben",... */
  item(scene, name, x, y, targetH, opts = {}) {
    const tex = "art_item_" + name;
    if (!scene.textures.exists(tex)) return null;
    const img = scene.add.image(x, y, tex).setOrigin(opts.originX != null ? opts.originX : 0.5, opts.originY != null ? opts.originY : 1);
    img.setScale(targetH / img.height); if (opts.flip) img.setFlipX(true);
    img.setDepth(opts.depth != null ? opts.depth : -4);
    if (opts.alpha != null) img.setAlpha(opts.alpha);
    return img;
  },

  /* compat: chamadas antigas a prop() usam os objetos como cenário lateral */
  prop(scene, name, x, y, targetH, opts = {}) {
    const alias = { phonebox: "phone_box", bigben: "big_ben", bus: "red_bus", museum: "museum" };
    return this.item(scene, alias[name] || name, x, y, targetH, Object.assign({ depth: -5, alpha: 0.95 }, opts));
  }
};
