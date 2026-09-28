/* =============================================================================
 *  PRIME TWO — Game 03 · El Misterio del Metro de Londres · contenido en ESPAÑOL.
 *  Siete pasos oficiales. Las claves de artículo coinciden con asset-manifest.
 *  El objetivo pedagógico es el INGLÉS BRITÁNICO: el vocabulario y las frases
 *  meta se mantienen en inglés en ambos idiomas; el español localiza solo las
 *  instrucciones, la narración y la interfaz. Sin texto de "demo/marcador".
 * ===========================================================================*/
window.PRIME_CONTENT_ALL = window.PRIME_CONTENT_ALL || {};
window.PRIME_CONTENT_ALL.es = {
  meta: { book: "PRIME TWO", unit: "El Misterio del Metro de Londres", language: "es", voice: "en-GB" },

  /* PASO 1 — INSTRUCCIONES DE LA MISIÓN */
  intro: {
    titleLines: ["FIRST PRIME INTERACTIVE", "PRIME TWO", "EL MISTERIO DEL METRO DE LONDRES"],
    narration: [
      "¡Bienvenido al metro de Londres! Soy Alex.",
      "Y yo soy Emma. Un misterio nos espera aquí abajo.",
      "Une las palabras, forma las frases y sigue las rutas correctas",
      "para llegar al destino final. Cuidado con el hueco — ¡vamos!"
    ]
  },

  /* PASO 2 — JUEGO DE MEMORIA (palabras meta en inglés) */
  memory: {
    intro: "Encuentra las parejas de imagen y palabra.",
    pairs: [
      { key: "ticket",     item: "ticket",            word: "ticket" },
      { key: "train",      item: "underground_train", word: "train" },
      { key: "platform",   item: "platform",          word: "platform" },
      { key: "escalator",  item: "escalator",         word: "escalator" },
      { key: "bus",        item: "double_decker_bus", word: "bus" },
      { key: "taxi",       item: "london_taxi",       word: "taxi" }
    ]
  },

  /* PASO 3 — FORMA LA PALABRA (palabra meta en inglés) */
  wordBuilder: {
    intro: "Forma la palabra en inglés de cada imagen.",
    words: [
      { word: "TICKET",   item: "ticket" },
      { word: "TRAIN",    item: "underground_train" },
      { word: "EXIT",     item: "exit_door" },
      { word: "STATION",  item: "station_entrance" }
    ]
  },

  /* PASO 4 — UNE PALABRA E IMAGEN (opciones en inglés) */
  match: {
    intro: "¿Qué palabra en inglés corresponde a la imagen?",
    items: [
      { item: "underground_train", options: ["train", "bus", "taxi", "ticket"], answer: 0 },
      { item: "travel_card",       options: ["travel card", "route map", "platform", "escalator"], answer: 0 },
      { item: "escalator",         options: ["escalator", "exit", "platform", "ticket"], answer: 0 },
      { item: "double_decker_bus", options: ["bus", "taxi", "train", "lorry"], answer: 0 }
    ]
  },

  /* PASO 5 — SIGUE LA DIRECCIÓN (instrucción meta en inglés) */
  direction: {
    intro: "Sigue la instrucción en inglés y elige el camino correcto.",
    items: [
      { instruction: "Turn left to the platform.",   answer: "left" },
      { instruction: "Go straight to the exit.",      answer: "straight" },
      { instruction: "Turn right to the escalator.",  answer: "right" },
      { instruction: "Turn left to the ticket hall.", answer: "left" }
    ]
  },

  /* PASO 6 — ROMPECABEZAS DE FRASES (frases meta en inglés) */
  sentence: {
    intro: "Forma la frase en inglés en el orden correcto.",
    sentences: [
      { blocks: ["Mind", "the", "gap."] },
      { blocks: ["Where", "is", "the", "platform?"] },
      { blocks: ["I", "need", "a", "ticket."] },
      { blocks: ["Take", "the", "escalator", "to", "the", "exit."] }
    ]
  },

  /* PASO 7 — RETO FINAL CRONOMETRADO (enunciado en español, opciones en inglés) */
  timed: {
    intro: "¡Responde rápido para resolver el misterio!",
    questions: [
      { q: "¿Dónde esperas el tren?",                  options: ["Platform", "Escalator", "Exit"], answer: 0 },
      { q: "¿Qué necesitas para viajar?",              options: ["Ticket", "Taxi", "Map"], answer: 0 },
      { q: "¿Cómo subes entre niveles?",               options: ["Escalator", "Platform", "Train"], answer: 0 },
      { q: "¿Cuál es el famoso autobús rojo de Londres?", options: ["Double-decker bus", "Taxi", "Lorry"], answer: 0 },
      { q: "¿Cuál es el clásico coche negro de Londres?", options: ["Taxi", "Bus", "Train"], answer: 0 },
      { q: "¿Qué camino sale de la estación?",         options: ["Exit", "Platform", "Ticket"], answer: 0 }
    ]
  }
};
