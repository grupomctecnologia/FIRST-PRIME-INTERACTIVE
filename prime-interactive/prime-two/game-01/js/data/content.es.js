/* =============================================================================
 *  PRIME TWO — Game 01 · SPANISH pedagogical content
 *  ⚠️ DEMO / PLACEHOLDER. NOT an official Spanish curriculum and NOT an
 *  automatic translation of the English course. Replace with the real,
 *  independently-designed Spanish course content. Player-facing text: SPANISH only.
 * ===========================================================================*/
window.PRIME_CONTENT_ALL = window.PRIME_CONTENT_ALL || {};
window.PRIME_CONTENT_ALL.es = {
  meta: { book: "PRIME TWO", unit: "Unidad 1 (DEMO)", language: "es", voice: "es-ES", placeholder: true,
    note: "Contenido de demostración. Reemplazar con el contenido REAL del curso de español (no una traducción automática del inglés)." },

  intro: {
    placeholder: true,
    titleLines: ["FIRST PRIME INTERACTIVE", "PRIME TWO", "LA AVENTURA DEL IDIOMA"],
    narration: [
      "Bienvenido, viajero.",
      "Tu aventura en español comienza ahora.",
      "Explora la ciudad, aprende palabras nuevas y completa cada misión."
    ]
  },

  vocabulary: {
    placeholder: true,
    intro: "Toca la palabra correcta para cada objeto.",
    items: [
      { id: "v1", icon: "suitcase", word: "Maleta", prompt: "Esta es mi ___.", options: ["Maleta", "Billete", "Mapa", "Cámara"] },
      { id: "v2", icon: "ticket", word: "Billete", prompt: "Necesito mi ___ para embarcar.", options: ["Pasaporte", "Billete", "Maleta", "Llave"] },
      { id: "v3", icon: "map", word: "Mapa", prompt: "Vamos a mirar el ___.", options: ["Mapa", "Teléfono", "Cámara", "Billete"] },
      { id: "v4", icon: "passport", word: "Pasaporte", prompt: "Muestra tu ___, por favor.", options: ["Cartera", "Mapa", "Pasaporte", "Llave"] },
      { id: "v5", icon: "camera", word: "Cámara", prompt: "Saca una foto con la ___.", options: ["Cámara", "Teléfono", "Mapa", "Billete"] }
    ]
  },

  listening: {
    placeholder: true,
    intro: "Escucha con atención y elige la respuesta correcta.",
    items: [
      { id: "l1", audioText: "¡Buenos días! Bienvenido a la ciudad. Me llamo Emma y soy tu guía.",
        subtitle: "¡Buenos días! Bienvenido a la ciudad. Me llamo Emma y soy tu guía.",
        question: "¿Cómo se llama la guía?", options: ["Emma", "Ana", "Emilia", "Olivia"], answer: 0 },
      { id: "l2", audioText: "El tren sale a las nueve en punto. Por favor, no llegues tarde.",
        subtitle: "El tren sale a las nueve en punto. Por favor, no llegues tarde.",
        question: "¿A qué hora sale el tren?", options: ["A las 8", "A las 9", "A las 10", "A las 11"], answer: 1 },
      { id: "l3", audioText: "El museo está al lado de la antigua biblioteca, en la calle Verde.",
        subtitle: "El museo está al lado de la antigua biblioteca, en la calle Verde.",
        question: "¿Dónde está el museo?", options: ["Al lado del parque", "Al lado de la biblioteca", "Al lado del hotel", "Al lado de la estación"], answer: 1 }
    ]
  },

  conversation: {
    placeholder: true,
    intro: "Continúa la conversación. Elige la mejor respuesta.",
    speakerA: { name: "Emma", role: "Guía" }, speakerB: { name: "Tú", role: "Viajero" },
    steps: [
      { speaker: "A", line: "¡Hola! Bienvenido. ¿Cómo estás hoy?", options: [
        { text: "¡Estoy bien, gracias!", correct: true, feedback: "¡Buen saludo!" },
        { text: "Soy una mesa.", correct: false, feedback: "Eso no responde la pregunta." },
        { text: "¡Adiós!", correct: false, feedback: "Es muy pronto para despedirse." }] },
      { speaker: "A", line: "¿De dónde eres?", options: [
        { text: "Soy de Brasil.", correct: true, feedback: "¡Respuesta perfecta!" },
        { text: "Estoy bien.", correct: false, feedback: "Eso responde '¿cómo estás?', no '¿de dónde?'." },
        { text: "Es un coche.", correct: false, feedback: "No tiene relación con la pregunta." }] },
      { speaker: "A", line: "¡Genial! ¿Quieres visitar el museo?", options: [
        { text: "¡Sí, me encantaría!", correct: true, feedback: "¡Excelente, vamos!" },
        { text: "Soy diez lápices.", correct: false, feedback: "Eso no tiene sentido aquí." },
        { text: "No gracias, soy azul.", correct: false, feedback: "Respuesta rara — sé natural." }] }
    ]
  },

  language: {
    placeholder: true,
    intro: "Arrastra las palabras para formar la frase correcta.",
    items: [
      { id: "g1", words: ["Ella", "es", "de", "Madrid"], answer: "Ella es de Madrid", hint: "Sujeto + verbo 'ser' + lugar." },
      { id: "g2", words: ["Ellos", "están", "en", "el", "aeropuerto"], answer: "Ellos están en el aeropuerto", hint: "Usa 'están' (estar) para ubicación." },
      { id: "g3", words: ["Tengo", "dos", "billetes"], answer: "Tengo dos billetes", hint: "Verbo 'tener' + número + sustantivo." }
    ]
  },

  final: {
    placeholder: true,
    intro: "¡Misión Final! Usa todo lo que aprendiste.",
    items: [
      { kind: "vocab", question: "¿Qué palabra significa una bolsa para viajar?", options: ["Billete", "Maleta", "Mapa", "Cámara"], answer: 1 },
      { kind: "listening", audioText: "El hotel está a la derecha, cerca de la gran fuente.",
        subtitle: "El hotel está a la derecha, cerca de la gran fuente.",
        question: "¿Dónde está el hotel?", options: ["A la izquierda", "A la derecha", "Detrás del parque", "Al lado del tren"], answer: 1 },
      { kind: "comprehension", question: "Elige la respuesta correcta: '¿De dónde eres?'", options: ["Estoy bien.", "Soy de Brasil.", "Son las nueve.", "Sí, por favor."], answer: 1 },
      { kind: "grammar", question: "Completa: 'Ellos ___ en el aeropuerto.'", options: ["es", "soy", "están", "ser"], answer: 2 }
    ]
  }
};
