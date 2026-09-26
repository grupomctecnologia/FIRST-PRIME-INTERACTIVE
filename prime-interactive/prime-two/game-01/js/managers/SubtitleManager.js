/* =============================================================================
 *  SubtitleManager — IN-CANVAS English subtitles (single source of truth).
 *  Rendered inside the Phaser canvas so it scales with the game and NEVER
 *  detaches or overlaps buttons on mobile. English only (no translation).
 *  Mounted per gameplay scene; positioned in a reserved bottom band.
 * ===========================================================================*/
window.SubtitleManager = {
  scene: null,
  _last: "",

  /* Called in each gameplay scene's create() */
  mount(scene) {
    this.scene = scene;
    this._last = "";
    const c = scene.add.container(0, 0).setDepth(80);
    const g = scene.add.graphics();
    const t = scene.add.text(0, 0, "", { fontFamily: window.Theme.font }).setOrigin(0.5);
    c.add(g); c.add(t);
    c.setVisible(false);
    scene._subUI = { c, g, t };
    scene.events.once("shutdown", () => { if (this.scene === scene) this.scene = null; });
    scene.events.once("destroy", () => { if (this.scene === scene) this.scene = null; });
    return c;
  },

  _ui() {
    const s = this.scene;
    if (!s || !s.sys || !s.sys.isActive() || !s._subUI) return null;
    return s._subUI;
  },

  /* text: plain English string */
  show(text) {
    const ui = this._ui(); if (!ui) return;
    const set = window.GameState.settings;
    if (!set.subtitles || !text) { this.hide(); return; }
    this._last = text;
    const s = this.scene, T = window.Theme, w = s.scale.width, h = s.scale.height;
    const fs = set.largeFont ? 23 : 18;
    ui.t.setStyle({
      fontFamily: T.font, fontSize: fs + "px", fontStyle: "bold",
      color: set.highContrast ? "#ffffff" : T.colors.text, align: "center",
      wordWrap: { width: Math.min(w - 80, 880) }
    });
    ui.t.setText(text);
    const pad = 14, tw = ui.t.width, th = ui.t.height;
    const y = h - th / 2 - 14;
    ui.t.setPosition(w / 2, y);
    ui.g.clear();
    ui.g.fillStyle(set.highContrast ? 0x000000 : 0x060a18, set.highContrast ? 1 : 0.86);
    ui.g.fillRoundedRect(w / 2 - tw / 2 - pad * 1.4, y - th / 2 - pad * 0.55, tw + pad * 2.8, th + pad * 1.1, 12);
    ui.g.lineStyle(2, T.colors.accent, set.highContrast ? 0 : 0.45);
    ui.g.strokeRoundedRect(w / 2 - tw / 2 - pad * 1.4, y - th / 2 - pad * 0.55, tw + pad * 2.8, th + pad * 1.1, 12);
    ui.c.setVisible(true);
  },

  hide() { const ui = this._ui(); if (ui) ui.c.setVisible(false); },

  /* Re-apply styling (e.g. after toggling large font / high contrast) */
  refresh() { if (this._last && this._ui() && this._ui().c.visible) this.show(this._last); }
};
