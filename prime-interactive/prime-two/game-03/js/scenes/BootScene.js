/* Boot: basic initialisation (Game 03) */
class BootScene extends Phaser.Scene {
  constructor() { super("BootScene"); }
  preload() {
    // Carrega o logo OFICIAL cedo, para que a tela de carregamento já mostre a
    // marca (nunca o marcador técnico/placeholder).
    if (window.Brand) window.Brand.preload(this);
  }
  create() {
    this.scale.on("enterfullscreen", () => this.game.events.emit("fs", true));
    this.scene.start("PreloadScene");
  }
}
window.BootScene = BootScene;
