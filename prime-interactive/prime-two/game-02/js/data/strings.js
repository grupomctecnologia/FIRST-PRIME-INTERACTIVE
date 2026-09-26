/* =============================================================================
 *  UI STRINGS — GAME 02 (London Shopping Mission) · English & Spanish.
 *  Interface chrome only (NOT pedagogical content). The whole experience runs
 *  in ONE language chosen at start. No Portuguese, no simultaneous translations.
 *  Pedagogical text lives in content.<lang>.js.
 * ===========================================================================*/
window.PRIME_STRINGS = {
  en: {
    play: "▶  PLAY",
    demoNote: "⚠ DEMO content (placeholder) — not the official PRIME TWO content",
    subtitles: "Subtitles", volume: "Volume", mute: "Mute", accessibility: "Accessibility", fullscreen: "Fullscreen",
    shortcuts: "Shortcuts: L subtitles · M mute · P pause · R repeat · F fullscreen",
    startAdventure: "▶  START SHOPPING", skip: "Skip ⏭",
    stage: "STAGE",
    subTagline: "London Shopping Mission",
    // stage titles
    vocabTitle: "Shop Window", listeningTitle: "Shopping List",
    checkoutTitle: "At the Checkout", conversationTitle: "In the Shop", finalTitle: "Fill the Cart",
    // gameplay chrome
    playAudio: "🔊  Play audio", listen: "🔊  Listen",
    next: "Next  ▶", finishStage: "Finish stage  ✓", continueBtn: "Continue  ▶",
    seeResult: "See result  🏆",
    correct: "Correct!", tryAgain: "Try again!", livesLeft: "life left",
    tapItem: "Tap the correct item", findItem: "Find:",
    whichPrice: "Choose the correct answer", total: "Total", cheapest: "cheapest", change: "change",
    yourCart: "Your cart", addToCart: "Added to cart!", notOnList: "Not on the list!",
    cartFull: "Cart complete!", checkout: "Checkout  🛍️", budget: "Budget", spent: "Spent",
    coins: "Coins", coinsLabel: "Coins",
    stageComplete: "STAGE COMPLETE!", correctLabel: "Correct",
    shoppingComplete: "SHOPPING COMPLETE!", gameOver: "GAME OVER",
    gameOverSub: "You ran out of lives",
    scoreLabel: "Score", starsLabel: "Stars", accuracyLabel: "Accuracy",
    playAgain: "↺  Play again", backToMenu: "≡  Back to menu",
    paused: "PAUSED", resume: "▶  Resume", backToMenuShort: "≡  Back to Menu",
    msgExcellent: "🏆 Excellent shopper! Impressive!", msgGreat: "👏 Great job! Keep it up!",
    msgGood: "💪 Good start! Practice to improve!", msgKeep: "Keep practicing — you can do it!"
  },
  es: {
    play: "▶  JUGAR",
    demoNote: "⚠ Contenido DEMO (marcador) — no es el contenido oficial de PRIME TWO",
    subtitles: "Subtítulos", volume: "Volumen", mute: "Silencio", accessibility: "Accesibilidad", fullscreen: "Pantalla completa",
    shortcuts: "Atajos: L subtítulos · M silencio · P pausa · R repetir · F pantalla completa",
    startAdventure: "▶  IR DE COMPRAS", skip: "Saltar ⏭",
    stage: "ETAPA",
    subTagline: "Misión de Compras en Londres",
    vocabTitle: "Escaparate", listeningTitle: "Lista de Compras",
    checkoutTitle: "En la Caja", conversationTitle: "En la Tienda", finalTitle: "Llena el Carrito",
    playAudio: "🔊  Escuchar audio", listen: "🔊  Escuchar",
    next: "Siguiente  ▶", finishStage: "Terminar etapa  ✓", continueBtn: "Continuar  ▶",
    seeResult: "Ver resultado  🏆",
    correct: "¡Correcto!", tryAgain: "¡Inténtalo de nuevo!", livesLeft: "vida restante",
    tapItem: "Toca el artículo correcto", findItem: "Busca:",
    whichPrice: "Elige la respuesta correcta", total: "Total", cheapest: "más barato", change: "cambio",
    yourCart: "Tu carrito", addToCart: "¡Añadido al carrito!", notOnList: "¡No está en la lista!",
    cartFull: "¡Carrito completo!", checkout: "Pagar  🛍️", budget: "Presupuesto", spent: "Gastado",
    coins: "Monedas", coinsLabel: "Monedas",
    stageComplete: "¡ETAPA COMPLETA!", correctLabel: "Correctas",
    shoppingComplete: "¡COMPRAS COMPLETADAS!", gameOver: "FIN DEL JUEGO",
    gameOverSub: "Te quedaste sin vidas",
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
