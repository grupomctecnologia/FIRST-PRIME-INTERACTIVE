/* =============================================================================
 *  Game bootstrap (Game 03). Exposes window.PRIME_GAME so the Mission Map can
 *  detect completion via the ResultScene contract.
 * ===========================================================================*/
(function () {
  window.GameState.init();
  const game = new Phaser.Game(window.GAME_CONFIG);
  window.PRIME_GAME = game;

  const applyBodyA11y = () => {
    const s = window.GameState.settings;
    document.body.classList.toggle("high-contrast", !!s.highContrast);
    document.body.classList.toggle("large-font", !!s.largeFont);
  };
  applyBodyA11y();
  window.applyBodyA11y = applyBodyA11y;

  window.addEventListener("load", () => {
    const l = document.getElementById("boot-loader");
    if (l) l.style.display = "none";
  });
})();
