/* =============================================================================
 *  UI STRINGS — English & Spanish (interface chrome, NOT pedagogical content).
 *  The whole experience runs in ONE language chosen at start. No Portuguese,
 *  no simultaneous translations. Pedagogical text lives in content.<lang>.js.
 * ===========================================================================*/
window.PRIME_STRINGS = {
  en: {
    play: "▶  PLAY",
    demoNote: "⚠ DEMO content (placeholder) — not the official PRIME TWO content",
    subtitles: "Subtitles", volume: "Volume", mute: "Mute", accessibility: "Accessibility", fullscreen: "Fullscreen",
    shortcuts: "Shortcuts: L subtitles · M mute · P pause · R repeat · F fullscreen",
    startAdventure: "▶  START ADVENTURE", skip: "Skip ⏭",
    stage: "STAGE",
    vocabTitle: "Vocabulary Mission", listeningTitle: "Listening Mission",
    conversationTitle: "Conversation Challenge", languageTitle: "Language Challenge", finalTitle: "Final Mission",
    playAudio: "🔊  Play audio",
    next: "Next  ▶", finishStage: "Finish stage  ✓", continueBtn: "Continue  ▶",
    nextSentence: "Next sentence  ▶", seeResult: "See result  🏆",
    correct: "Correct!", tryAgain: "Try again!", livesLeft: "life left",
    check: "✓  Check", clear: "↺  Clear", hint: "💡  Hint",
    yourSentence: "Your sentence (tap/drag the words here):",
    stageComplete: "STAGE COMPLETE!", correctLabel: "Correct",
    finalMission: "★  FINAL MISSION  ★",
    kindVocab: "VOCABULARY", kindListening: "LISTENING", kindComprehension: "COMPREHENSION", kindGrammar: "GRAMMAR",
    adventureComplete: "ADVENTURE COMPLETE!", gameOver: "GAME OVER",
    gameOverSub: "You ran out of lives", subTagline: "The English Adventure",
    scoreLabel: "Score", starsLabel: "Stars", accuracyLabel: "Accuracy",
    playAgain: "↺  Play again", backToMenu: "≡  Back to menu",
    paused: "PAUSED", resume: "▶  Resume", backToMenuShort: "≡  Back to Menu",
    msgExcellent: "🏆 Excellent! Impressive mastery!", msgGreat: "👏 Great job! Keep improving!",
    msgGood: "💪 Good start! Practice to improve!", msgKeep: "Keep practicing — you can do it!"
  },
  es: {
    play: "▶  JUGAR",
    demoNote: "⚠ Contenido DEMO (marcador) — no es el contenido oficial de PRIME TWO",
    subtitles: "Subtítulos", volume: "Volumen", mute: "Silencio", accessibility: "Accesibilidad", fullscreen: "Pantalla completa",
    shortcuts: "Atajos: L subtítulos · M silencio · P pausa · R repetir · F pantalla completa",
    startAdventure: "▶  COMENZAR AVENTURA", skip: "Saltar ⏭",
    stage: "ETAPA",
    vocabTitle: "Misión de Vocabulario", listeningTitle: "Misión de Comprensión Auditiva",
    conversationTitle: "Desafío de Conversación", languageTitle: "Desafío de Lengua", finalTitle: "Misión Final",
    playAudio: "🔊  Escuchar audio",
    next: "Siguiente  ▶", finishStage: "Terminar etapa  ✓", continueBtn: "Continuar  ▶",
    nextSentence: "Siguiente frase  ▶", seeResult: "Ver resultado  🏆",
    correct: "¡Correcto!", tryAgain: "¡Inténtalo de nuevo!", livesLeft: "vida restante",
    check: "✓  Comprobar", clear: "↺  Borrar", hint: "💡  Pista",
    yourSentence: "Tu frase (toca/arrastra las palabras aquí):",
    stageComplete: "¡ETAPA COMPLETA!", correctLabel: "Correctas",
    finalMission: "★  MISIÓN FINAL  ★",
    kindVocab: "VOCABULARIO", kindListening: "COMPRENSIÓN", kindComprehension: "COMPRENSIÓN", kindGrammar: "GRAMÁTICA",
    adventureComplete: "¡AVENTURA COMPLETADA!", gameOver: "FIN DEL JUEGO",
    gameOverSub: "Te quedaste sin vidas", subTagline: "La Aventura del Idioma",
    scoreLabel: "Puntos", starsLabel: "Estrellas", accuracyLabel: "Precisión",
    playAgain: "↺  Jugar de nuevo", backToMenu: "≡  Volver al menú",
    paused: "PAUSA", resume: "▶  Continuar", backToMenuShort: "≡  Volver al menú",
    msgExcellent: "🏆 ¡Excelente! ¡Dominio impresionante!", msgGreat: "👏 ¡Muy bien! ¡Sigue mejorando!",
    msgGood: "💪 ¡Buen comienzo! ¡Practica para mejorar!", msgKeep: "Sigue practicando — ¡tú puedes!"
  }
};

/* Helper: current-language UI string */
window.S = function (key) {
  const lang = (window.GameState && window.GameState.settings.lang) || "en";
  const table = window.PRIME_STRINGS[lang] || window.PRIME_STRINGS.en;
  return (table[key] != null) ? table[key] : (window.PRIME_STRINGS.en[key] || key);
};
