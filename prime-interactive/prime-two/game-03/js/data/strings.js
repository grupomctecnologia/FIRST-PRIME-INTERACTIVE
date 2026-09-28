/* =============================================================================
 *  UI STRINGS — GAME 03 (London Underground Mystery) · English (British) &
 *  Spanish. Interface chrome only (NOT pedagogical content). The whole
 *  experience runs in ONE language chosen at start. No Portuguese, no
 *  simultaneous translations on student screens.
 *  Seven official steps: Mission Briefing · Memory Match · Word Builder ·
 *  Match Word and Image · Follow the Direction · Sentence Puzzle ·
 *  Timed Final Challenge.
 * ===========================================================================*/
window.PRIME_STRINGS = {
  en: {
    play: "▶  PLAY",
    tagline: "Solve the mystery of the London Underground",
    subtitles: "Subtitles", volume: "Volume", mute: "Mute", accessibility: "Accessibility", fullscreen: "Fullscreen",
    shortcuts: "Shortcuts: L subtitles · M mute · P pause · R repeat · F fullscreen",
    startMission: "▶  START MISSION", skip: "Skip ⏭",
    step: "STEP",
    subTagline: "London Underground Mystery",

    /* step titles */
    briefingTitle: "Mission Briefing",
    memoryTitle: "Memory Match",
    wordBuilderTitle: "Word Builder",
    matchTitle: "Match Word and Image",
    directionTitle: "Follow the Direction",
    sentenceTitle: "Sentence Puzzle",
    timedTitle: "Timed Final Challenge",

    /* gameplay chrome */
    listen: "🔊  Listen", playAudio: "🔊  Play audio",
    next: "Next  ▶", finishStep: "Finish step  ✓", continueBtn: "Continue  ▶",
    correct: "Correct!", tryAgain: "Try again!",
    checkAnswer: "Check answer  ✓", clearAll: "Clear",
    coins: "Coins", coinsLabel: "Coins",
    timeLabel: "Time", secondsShort: "s",

    /* per-activity instructions */
    memoryInstr: "Find the matching pairs. Tap two cards.",
    matchFound: "Pair found!",
    timeUp: "Time's up!  −%a points",
    timeLeftShort: "Time",
    wordBuilderInstr: "Tap the letters in order to build the word.",
    matchInstr: "Which word matches the picture?",
    matchInstrWord: "Which picture matches the word?",
    directionInstr: "Follow the instruction. Choose the right way.",
    sentenceInstr: "Tap the blocks in order to build the sentence.",
    timedInstr: "Answer quickly! The faster you finish, the more stars you earn.",
    getReady: "Get ready…", go: "GO!",
    questionOf: "Question %a of %b",

    /* results / status */
    stepComplete: "STEP COMPLETE!", correctLabel: "Correct",
    missionComplete: "MISSION SOLVED!", missionCompleteSub: "Brilliant! You cracked the London Underground Mystery.",
    gameOver: "GAME OVER", gameOverSub: "You ran out of lives",
    scoreLabel: "Score", starsLabel: "Stars", accuracyLabel: "Accuracy",
    finishTimeLabel: "Final time",
    playAgain: "↺  Play again", backToMenu: "≡  Back to menu",
    paused: "PAUSED", resume: "▶  Resume", backToMenuShort: "≡  Back to Menu",
    livesLabel: "Lives",
    msgExcellent: "🏆 Outstanding detective work!", msgGreat: "👏 Great job! Keep it up!",
    msgGood: "💪 Good work! Practise to be faster!", msgKeep: "Keep practising — you can solve it!",
    starTimeHint: "★★★ under 30s · ★★ under 45s · ★ over 45s"
  },
  es: {
    play: "▶  JUGAR",
    tagline: "Resuelve el misterio del metro de Londres",
    subtitles: "Subtítulos", volume: "Volumen", mute: "Silencio", accessibility: "Accesibilidad", fullscreen: "Pantalla completa",
    shortcuts: "Atajos: L subtítulos · M silencio · P pausa · R repetir · F pantalla completa",
    startMission: "▶  EMPEZAR MISIÓN", skip: "Saltar ⏭",
    step: "PASO",
    subTagline: "El Misterio del Metro de Londres",

    briefingTitle: "Instrucciones de la Misión",
    memoryTitle: "Juego de Memoria",
    wordBuilderTitle: "Forma la Palabra",
    matchTitle: "Une Palabra e Imagen",
    directionTitle: "Sigue la Dirección",
    sentenceTitle: "Rompecabezas de Frases",
    timedTitle: "Reto Final Cronometrado",

    listen: "🔊  Escuchar", playAudio: "🔊  Escuchar audio",
    next: "Siguiente  ▶", finishStep: "Terminar paso  ✓", continueBtn: "Continuar  ▶",
    correct: "¡Correcto!", tryAgain: "¡Inténtalo de nuevo!",
    checkAnswer: "Comprobar  ✓", clearAll: "Borrar",
    coins: "Monedas", coinsLabel: "Monedas",
    timeLabel: "Tiempo", secondsShort: "s",

    memoryInstr: "Encuentra las parejas. Toca dos cartas.",
    matchFound: "¡Pareja encontrada!",
    timeUp: "¡Se acabó el tiempo!  −%a puntos",
    timeLeftShort: "Tiempo",
    wordBuilderInstr: "Toca las letras en orden para formar la palabra.",
    matchInstr: "¿Qué palabra corresponde a la imagen?",
    matchInstrWord: "¿Qué imagen corresponde a la palabra?",
    directionInstr: "Sigue la instrucción. Elige el camino correcto.",
    sentenceInstr: "Toca los bloques en orden para formar la frase.",
    timedInstr: "¡Responde rápido! Cuanto antes termines, más estrellas ganas.",
    getReady: "Prepárate…", go: "¡YA!",
    questionOf: "Pregunta %a de %b",

    stepComplete: "¡PASO COMPLETO!", correctLabel: "Correctas",
    missionComplete: "¡MISTERIO RESUELTO!", missionCompleteSub: "¡Genial! Resolviste el Misterio del Metro de Londres.",
    gameOver: "FIN DEL JUEGO", gameOverSub: "Te quedaste sin vidas",
    scoreLabel: "Puntos", starsLabel: "Estrellas", accuracyLabel: "Precisión",
    finishTimeLabel: "Tiempo final",
    playAgain: "↺  Jugar de nuevo", backToMenu: "≡  Volver al menú",
    paused: "PAUSA", resume: "▶  Continuar", backToMenuShort: "≡  Volver al menú",
    livesLabel: "Vidas",
    msgExcellent: "🏆 ¡Trabajo de detective excelente!", msgGreat: "👏 ¡Muy bien! ¡Sigue así!",
    msgGood: "💪 ¡Buen trabajo! ¡Practica para ir más rápido!", msgKeep: "Sigue practicando — ¡tú puedes resolverlo!",
    starTimeHint: "★★★ menos de 30s · ★★ menos de 45s · ★ más de 45s"
  }
};

/* Helper: current-language UI string, with optional %a/%b substitution */
window.S = function (key, a, b) {
  const lang = (window.GameState && window.GameState.settings.lang) || "en";
  const table = window.PRIME_STRINGS[lang] || window.PRIME_STRINGS.en;
  let v = (table[key] != null) ? table[key] : (window.PRIME_STRINGS.en[key] || key);
  if (a != null) v = v.replace("%a", a);
  if (b != null) v = v.replace("%b", b);
  return v;
};
