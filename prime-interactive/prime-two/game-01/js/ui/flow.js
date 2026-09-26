/* =============================================================================
 *  Flow — progressão entre fases + transição de conclusão de fase.
 * ===========================================================================*/
window.Flow = {
  /* Tela intermediária "Fase concluída" com estrelas, depois avança. */
  completePhase(scene, phaseKey) {
    const T = window.Theme, w = scene.scale.width, h = scene.scale.height;
    const stars = window.GameState.computePhaseStars(phaseKey);
    window.AudioManager.stopVoice();
    window.SubtitleManager.hide();

    const layer = scene.add.container(0, 0).setDepth(95);
    const bg = scene.add.graphics(); bg.fillStyle(0x05070f, 0.85); bg.fillRect(0, 0, w, h); layer.add(bg);
    const card = T.card(scene, w / 2, h / 2, 480, 340, { border: T.colors.accent2 });
    layer.add(card);
    layer.add(T.title(scene, w / 2, h / 2 - 110, "FASE CONCLUÍDA!", 34, T.colors.text));
    const row = T.starRow(scene, w / 2, h / 2 - 30, 0, 3, 48);
    layer.add(row);
    // revela estrelas uma a uma
    for (let i = 0; i < stars; i++) {
      scene.time.delayedCall(300 + i * 300, () => {
        const star = row.list[i];
        star.setColor(T.hex(T.colors.accent2));
        star.setShadow(0, 0, T.hex(T.colors.accent2), 14, true, true);
        scene.tweens.add({ targets: star, scale: { from: 1.6, to: 1 }, duration: 300, ease: "Back.out" });
        window.AudioManager.sfx("star");
      });
    }
    const r = window.GameState.session.phaseResults[phaseKey] || { correct: 0, total: 0 };
    layer.add(scene.add.text(w / 2, h / 2 + 40, `Acertos: ${r.correct}/${r.total}  ·  +${r.correct * 100} pts`, {
      fontFamily: T.font, fontSize: "20px", color: T.colors.textDim
    }).setOrigin(0.5));

    scene.time.delayedCall(300 + stars * 300 + 500, () => {
      const btn = T.button(scene, w / 2, h / 2 + 110, 280, 60, "Continuar  ▶", {
        onClick: () => { window.AudioManager.sfx("transition"); this.next(scene, phaseKey); }
      });
      layer.add(btn);
    });
  },

  next(scene, phaseKey) {
    // fim de jogo no Modo Desafio
    if (window.GameState.isGameOver()) { scene.scene.start("ResultScene", { gameOver: true }); return; }
    const order = window.GameState.phaseOrder;
    const idx = order.indexOf(phaseKey);
    const nextKey = order[idx + 1];
    scene.cameras.main.fadeOut(350, 5, 7, 20);
    scene.cameras.main.once("camerafadeoutcomplete", () => {
      if (nextKey) scene.scene.start(nextKey + "Scene");
      else scene.scene.start("ResultScene", { gameOver: false });
    });
  }
};
