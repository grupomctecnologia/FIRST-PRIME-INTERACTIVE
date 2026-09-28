/* Boot: basic initialisation (Game 03) */
class BootScene extends Phaser.Scene {
  constructor() { super("BootScene"); }
  create() {
    this.scale.on("enterfullscreen", () => this.game.events.emit("fs", true));
    this.scene.start("PreloadScene");
  }
}
window.BootScene = BootScene;
