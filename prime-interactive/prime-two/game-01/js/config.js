/* =============================================================================
 *  Configuração do Phaser
 * ===========================================================================*/
window.GAME_CONFIG = {
  type: Phaser.AUTO,
  parent: "game-container",
  backgroundColor: "#0b1026",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720
  },
  dom: { createContainer: true },
  render: { antialias: true, roundPixels: false },
  scene: [
    BootScene, PreloadScene, MenuScene,
    IntroScene, VocabularyScene, ListeningScene,
    ConversationScene, LanguageScene, FinalScene, ResultScene
  ]
};
