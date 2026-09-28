/* =============================================================================
 *  Flow — step progression + step-complete transition (Game 03).
 *  Uses the Pack-04 three-stars frame; per-step stars come from wrong attempts
 *  (encouragement only — the FINAL rating is the time-based one on ResultScene).
 * ===========================================================================*/
window.Flow = {
  /* Intermediate "Step complete" screen with stars, then advance. */
  completePhase(scene, phaseKey) {
    const T = window.Theme, w = scene.scale.width, h = scene.scale.height;
    const stars = window.GameState.computePhaseStars(phaseKey);
    window.AudioManager.stopVoice();
    window.SubtitleManager.hide();

    const layer = scene.add.container(0, 0).setDepth(95);
    const bg = scene.add.graphics(); bg.fillStyle(0x05070f, 0.85); bg.fillRect(0, 0, w, h); layer.add(bg);
    layer.add(window.UI.panel(scene, w / 2, h / 2, 480, 300, "mission"));
    layer.add(T.title(scene, w / 2, h / 2 - 96, window.S("stepComplete"), 32, T.colors.text));

    const frame = window.UI.starsFrame(scene, w / 2, h / 2 - 20, 240, 100);
    layer.add(frame);
    frame.light(stars, true);

    const r = window.GameState.session.phaseResults[phaseKey] || { total: 0 };
    layer.add(scene.add.text(w / 2, h / 2 + 44, `${window.S("correctLabel")}: ${r.total}/${r.total}  ·  +${r.total * 100} pts`, {
      fontFamily: T.font, fontSize: "20px", color: T.colors.textDim
    }).setOrigin(0.5));

    const btn = T.button(scene, w / 2, h / 2 + 104, 260, 54, window.S("continueBtn"), {
      onClick: () => { window.AudioManager.sfx("transition"); this.next(scene, phaseKey); }
    });
    layer.add(btn);
  },

  next(scene, phaseKey) {
    if (window.GameState.isGameOver()) { scene.scene.start("ResultScene", { gameOver: true }); return; }
    const order = window.GameState.phaseOrder;
    const idx = order.indexOf(phaseKey);
    const nextKey = order[idx + 1];
    if (nextKey) scene.scene.start(nextKey + "Scene");
    else scene.scene.start("ResultScene", { gameOver: false });
  }
};
