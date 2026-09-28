/* =============================================================================
 *  Art (Game 03) — official image layer (packs 01–04 of London Underground
 *  Mystery). Loads by file name (PRIME_ASSETS) or, in the single-file preview,
 *  by base64 (PRIME_ART_DATA). Underground scenes per step + Alex/Emma
 *  (transparent) + Underground objects.
 * ===========================================================================*/
window.Art = {
  /* Load every texture (call from PreloadScene.preload) */
  preload(scene) {
    const U = window.PRIME_ASSETS || {};
    const D = window.PRIME_ART_DATA || null;   // base64 (single-file preview)
    Object.keys(U).forEach((k) => {
      if (scene.textures.exists("art_" + k)) return;
      const src = (D && D[k]) ? D[k] : U[k];
      if (src) { try { scene.load.image("art_" + k, src); } catch (e) {} }
    });
  },

  ready(scene) {
    return !!((window.PRIME_ASSETS || window.PRIME_ART_DATA) && scene.textures.exists("art_bg_station_entrance"));
  },

  /* Step -> Underground scene background */
  bgFor: {
    home: "bg_station_entrance", langselect: "bg_station_entrance", intro: "bg_station_entrance",
    memory: "bg_ticket_hall", wordbuilder: "bg_ticket_hall",
    match: "bg_underground_platform", direction: "bg_escalator_corridor",
    sentence: "bg_route_puzzle_room", timed: "bg_train_interior",
    result: "bg_final_destination"
  },
  /* Light colour grade per step (reading contrast over the photo) */
  grades: {
    home: { t: 0x081026, a: 0.34 }, intro: { t: 0x081026, a: 0.34 },
    memory: { t: 0x081026, a: 0.40 }, wordbuilder: { t: 0x081026, a: 0.42 },
    match: { t: 0x081026, a: 0.40 }, direction: { t: 0x081026, a: 0.42 },
    sentence: { t: 0x0a0820, a: 0.42 }, timed: { t: 0x100818, a: 0.40 },
    result: { t: 0x081026, a: 0.32 }
  },

  /* Background (cover-fit) + colour grade + reading scrims (top/bottom) */
  background(scene, key = "home") {
    const { width: w, height: h } = scene.scale;
    const tex = "art_" + (this.bgFor[key] || "bg_station_entrance");
    const g = this.grades[key] || this.grades.home;

    scene.add.rectangle(w / 2, h / 2, w, h, 0x05070f).setDepth(-20);
    const img = scene.add.image(w / 2, h / 2, scene.textures.exists(tex) ? tex : "art_bg_station_entrance").setDepth(-14);
    const s = Math.max(w / img.width, h / img.height); img.setScale(s);

    const grade = scene.add.graphics().setDepth(-12);
    grade.fillStyle(g.t, g.a); grade.fillRect(0, 0, w, h);
    const scrim = scene.add.graphics().setDepth(-10);
    scrim.fillStyle(0x05070f, 0.46); scrim.fillRect(0, 0, w, 70);
    scrim.fillStyle(0x05070f, 0.40); scrim.fillRect(0, h * 0.58, w, h * 0.42);
    return img;
  },

  /* Protagonist (transparent). who = "alex"|"emma", pose optional. */
  character(scene, who, pose, x, y, targetH, opts = {}) {
    const key = (who === "alex" || who === "emma") ? (who + "_" + (pose || "mission_ready")) : who;
    const tex = "art_" + key;
    if (!scene.textures.exists(tex)) return null;
    const img = scene.add.image(x, y, tex).setOrigin(opts.originX != null ? opts.originX : 0.5, opts.originY != null ? opts.originY : 1);
    img.setScale(targetH / img.height); if (opts.flip) img.setFlipX(true);
    img.setDepth(opts.depth != null ? opts.depth : -3);
    scene.add.ellipse(x, y - 2, img.displayWidth * 0.58, 18, 0x000000, 0.34).setDepth(img.depth - 1);
    if (opts.float !== false) scene.tweens.add({ targets: img, y: y - (opts.float || 5), duration: 2400, yoyo: true, repeat: -1, ease: "Sine.inOut" });
    return img;
  },

  /* Transparent Underground object (Pack 03). key = "ticket", "platform"... */
  item(scene, key, x, y, targetH, opts = {}) {
    const tex = "art_item_" + key;
    if (!scene.textures.exists(tex)) return null;
    const img = scene.add.image(x, y, tex).setOrigin(opts.originX != null ? opts.originX : 0.5, opts.originY != null ? opts.originY : 0.5);
    img.setScale(targetH / img.height); if (opts.flip) img.setFlipX(true);
    img.setDepth(opts.depth != null ? opts.depth : 5);
    if (opts.alpha != null) img.setAlpha(opts.alpha);
    return img;
  },

  itemExists(scene, key) { return scene.textures.exists("art_item_" + key); }
};
