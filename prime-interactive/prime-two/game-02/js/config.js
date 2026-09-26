/* =============================================================================
 *  Configuração do Phaser — GAME 02 (London Shopping Mission)
 *  Sete etapas: Briefing (Intro) · Find the Item · Colour and Size ·
 *  Prices and Pounds · Shopping Dialogue · Shopping Bag · Checkout Challenge.
 * ===========================================================================*/
window.GAME_CONFIG = {
  type: Phaser.AUTO,
  parent: "game-container",
  backgroundColor: "#0b1026",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 600,
    min: { width: 320, height: 180 },
    max: { width: 2560, height: 1200 }
  },
  dom: { createContainer: true },
  render: { antialias: true, roundPixels: false },
  scene: [
    BootScene, PreloadScene, LanguageSelectScene, MenuScene, IntroScene,
    FindItemScene, ColourSizeScene, PricesScene, DialogueScene,
    ShoppingBagScene, CheckoutChallengeScene, ResultScene
  ]
};
