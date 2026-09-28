/* =============================================================================
 *  ActivityScene — shared base for the six Game 03 activities. Provides the
 *  themed background, HUD, step header, a floating feedback toast, and the
 *  correct / wrong (lose a life, retry, never reveal) lifecycle. Game over at 0
 *  lives routes to ResultScene({gameOver:true}). Not registered directly.
 * ===========================================================================*/
class ActivityScene extends Phaser.Scene {
  buildBase(opts) {
    const T = window.Theme, w = this.scale.width, h = this.scale.height;
    this.phaseKey = opts.phaseKey;
    this._locked = false;
    this.cameras.main.fadeIn(300, 5, 7, 20);
    window.SubtitleManager.mount(this);
    T.scene(this, opts.bgKey);
    this.hud = new window.Hud(this, {});
    // Trilha de fundo de aventura/mistério durante o jogo (no-op se já tocando).
    this.input.once("pointerdown", () => window.AudioManager.unlock());
    window.AudioManager.playMusic("adventure");

    // Step header
    const label = window.S("step") + " " + opts.stepNumber + " · " + window.S(opts.titleKey);
    const head = this.add.text(w / 2, 74, label, {
      fontFamily: T.font, fontSize: "24px", fontStyle: "bold", color: T.colors.text
    }).setOrigin(0.5).setDepth(40);
    head.setShadow(0, 3, "rgba(0,0,0,0.7)", 8, true, true);

    if (opts.instr) {
      this.add.text(w / 2, 104, opts.instr, {
        fontFamily: T.font, fontSize: "16px", color: T.hex(T.colors.accent2), align: "center", wordWrap: { width: w - 160 }
      }).setOrigin(0.5).setDepth(40).setShadow(0, 2, "rgba(0,0,0,0.85)", 6);
    }
  }

  /* Floating feedback toast at mid-height */
  toast(msg, good) {
    const T = window.Theme, w = this.scale.width, h = this.scale.height;
    if (this._toastEl) this._toastEl.destroy();
    const c = this.add.container(w / 2, h * 0.30).setDepth(90);
    const t = this.add.text(0, 0, msg, { fontFamily: T.font, fontSize: "22px", fontStyle: "bold", color: good ? T.hex(T.colors.good) : T.hex(T.colors.bad) }).setOrigin(0.5);
    const pad = 16;
    const g = this.add.graphics();
    g.fillStyle(0x05070f, 0.82); g.fillRoundedRect(-t.width / 2 - pad, -t.height / 2 - 8, t.width + pad * 2, t.height + 16, 12);
    g.lineStyle(2, good ? T.colors.good : T.colors.bad, 0.7); g.strokeRoundedRect(-t.width / 2 - pad, -t.height / 2 - 8, t.width + pad * 2, t.height + 16, 12);
    c.add(g); c.add(t);
    c.setAlpha(0); c.setScale(0.8);
    this.tweens.add({ targets: c, alpha: 1, scale: 1, duration: 180, ease: "Back.out" });
    this._toastEl = c;
    this.time.delayedCall(1400, () => { if (c && c.active) this.tweens.add({ targets: c, alpha: 0, duration: 260, onComplete: () => c.destroy() }); });
  }

  registerCorrect() {
    window.GameState.registerCorrect(this.phaseKey);
    if (this.hud) this.hud.updateScore();
    window.AudioManager.sfx("correct");
    window.Theme.flashFeedback(this, true);
  }

  /* Returns true if this wrong attempt ended the game. */
  registerWrong() {
    window.GameState.loseLife(this.phaseKey);
    if (this.hud) this.hud.updateScore();
    window.AudioManager.sfx("wrong");
    window.Theme.flashFeedback(this, false);
    this.toast(window.S("tryAgain"), false);
    if (window.GameState.isGameOver()) {
      this._locked = true;
      this.time.delayedCall(800, () => { window.AudioManager.stopVoice(); this.scene.start("ResultScene", { gameOver: true }); });
      return true;
    }
    return false;
  }

  finishStep() {
    if (this._locked) return;
    this._locked = true;
    window.AudioManager.sfx("transition");
    window.Flow.completePhase(this, this.phaseKey);
  }
}
window.ActivityScene = ActivityScene;
