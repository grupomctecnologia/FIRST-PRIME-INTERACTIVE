/* =============================================================================
 *  Bootstrap do jogo
 * ===========================================================================*/
(function () {
  window.GameState.init();
  const game = new Phaser.Game(window.GAME_CONFIG);
  window.PRIME_GAME = game;

  // Acessibilidade global aplicada ao container (contraste/fonte)
  const applyBodyA11y = () => {
    const s = window.GameState.settings;
    document.body.classList.toggle("high-contrast", !!s.highContrast);
    document.body.classList.toggle("large-font", !!s.largeFont);
  };
  applyBodyA11y();
  window.applyBodyA11y = applyBodyA11y;

  // Esconde o loader HTML quando o Phaser assume
  window.addEventListener("load", () => {
    const l = document.getElementById("boot-loader");
    if (l) l.style.display = "none";
  });
})();
