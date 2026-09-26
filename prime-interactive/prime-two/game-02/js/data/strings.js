/* =============================================================================
 *  UI STRINGS — GAME 02 (London Shopping Mission) · English (British) & Spanish.
 *  Interface chrome only (NOT pedagogical content). The whole experience runs
 *  in ONE language chosen at start. No Portuguese, no simultaneous translations.
 *  Seven official steps: Mission Briefing · Find the Item · Colour and Size ·
 *  Prices and Pounds · Shopping Dialogue · Shopping Bag · Checkout Challenge.
 * ===========================================================================*/
window.PRIME_STRINGS = {
  en: {
    play: "▶  PLAY",
    tagline: "Learn English by going shopping in London",
    subtitles: "Subtitles", volume: "Volume", mute: "Mute", accessibility: "Accessibility", fullscreen: "Fullscreen",
    shortcuts: "Shortcuts: L subtitles · M mute · P pause · R repeat · F fullscreen",
    startMission: "▶  START MISSION", skip: "Skip ⏭",
    stage: "STEP",
    subTagline: "London Shopping Mission",
    // step titles
    briefingTitle: "Mission Briefing",
    findItemTitle: "Find the Item", colourSizeTitle: "Colour and Size",
    pricesTitle: "Prices and Pounds", dialogueTitle: "Shopping Dialogue",
    shoppingBagTitle: "Shopping Bag", checkoutTitle: "Checkout Challenge",
    // gameplay chrome
    playAudio: "🔊  Play audio", listen: "🔊  Listen",
    next: "Next  ▶", finishStage: "Finish step  ✓", continueBtn: "Continue  ▶",
    correct: "Correct!", tryAgain: "Try again!",
    tapItem: "Tap the correct item", findLabel: "Find:",
    colour: "Colour", size: "Size", small: "Small", medium: "Medium", large: "Large",
    quantity: "Qty", total: "Total", review: "Check your order",
    yourBag: "Your bag", addToBag: "Added to your bag!", notOnList: "Not on the list!",
    tapToRemove: "Tap an item in your bag to remove it", removed: "Removed from bag",
    bagComplete: "Your bag is ready!", goCheckout: "Go to checkout  🛍️",
    confirmPurchase: "CONFIRM PURCHASE", whichTotal: "What is the total?",
    coins: "Coins", coinsLabel: "Coins",
    stageComplete: "STEP COMPLETE!", correctLabel: "Correct",
    missionComplete: "MISSION COMPLETE!", missionCompleteSub: "Excellent work! You completed the London Shopping Mission.",
    gameOver: "GAME OVER", gameOverSub: "You ran out of lives",
    scoreLabel: "Score", starsLabel: "Stars", accuracyLabel: "Accuracy",
    playAgain: "↺  Play again", backToMenu: "≡  Back to menu",
    paused: "PAUSED", resume: "▶  Resume", backToMenuShort: "≡  Back to Menu",
    msgExcellent: "🏆 Excellent shopper! Impressive!", msgGreat: "👏 Great job! Keep it up!",
    msgGood: "💪 Good start! Practise to improve!", msgKeep: "Keep practising — you can do it!"
  },
  es: {
    play: "▶  JUGAR",
    tagline: "Aprende inglés yendo de compras por Londres",
    subtitles: "Subtítulos", volume: "Volumen", mute: "Silencio", accessibility: "Accesibilidad", fullscreen: "Pantalla completa",
    shortcuts: "Atajos: L subtítulos · M silencio · P pausa · R repetir · F pantalla completa",
    startMission: "▶  EMPEZAR MISIÓN", skip: "Saltar ⏭",
    stage: "PASO",
    subTagline: "Misión de Compras en Londres",
    briefingTitle: "Instrucciones de la Misión",
    findItemTitle: "Encuentra el Artículo", colourSizeTitle: "Color y Talla",
    pricesTitle: "Precios y Libras", dialogueTitle: "Diálogo de Compras",
    shoppingBagTitle: "Bolsa de Compras", checkoutTitle: "Reto en la Caja",
    playAudio: "🔊  Escuchar audio", listen: "🔊  Escuchar",
    next: "Siguiente  ▶", finishStage: "Terminar paso  ✓", continueBtn: "Continuar  ▶",
    correct: "¡Correcto!", tryAgain: "¡Inténtalo de nuevo!",
    tapItem: "Toca el artículo correcto", findLabel: "Busca:",
    colour: "Color", size: "Talla", small: "Pequeña", medium: "Mediana", large: "Grande",
    quantity: "Cant.", total: "Total", review: "Revisa tu pedido",
    yourBag: "Tu bolsa", addToBag: "¡Añadido a tu bolsa!", notOnList: "¡No está en la lista!",
    tapToRemove: "Toca un artículo de tu bolsa para quitarlo", removed: "Quitado de la bolsa",
    bagComplete: "¡Tu bolsa está lista!", goCheckout: "Ir a la caja  🛍️",
    confirmPurchase: "CONFIRMAR COMPRA", whichTotal: "¿Cuál es el total?",
    coins: "Monedas", coinsLabel: "Monedas",
    stageComplete: "¡PASO COMPLETO!", correctLabel: "Correctas",
    missionComplete: "¡MISIÓN COMPLETADA!", missionCompleteSub: "¡Excelente trabajo! Completaste la Misión de Compras en Londres.",
    gameOver: "FIN DEL JUEGO", gameOverSub: "Te quedaste sin vidas",
    scoreLabel: "Puntos", starsLabel: "Estrellas", accuracyLabel: "Precisión",
    playAgain: "↺  Jugar de nuevo", backToMenu: "≡  Volver al menú",
    paused: "PAUSA", resume: "▶  Continuar", backToMenuShort: "≡  Volver al menú",
    msgExcellent: "🏆 ¡Excelente comprador! ¡Impresionante!", msgGreat: "👏 ¡Muy bien! ¡Sigue así!",
    msgGood: "💪 ¡Buen comienzo! ¡Practica para mejorar!", msgKeep: "Sigue practicando — ¡tú puedes!"
  }
};

/* Helper: current-language UI string */
window.S = function (key) {
  const lang = (window.GameState && window.GameState.settings.lang) || "en";
  const table = window.PRIME_STRINGS[lang] || window.PRIME_STRINGS.en;
  return (table[key] != null) ? table[key] : (window.PRIME_STRINGS.en[key] || key);
};
