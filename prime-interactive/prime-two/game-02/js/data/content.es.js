/* =============================================================================
 *  PRIME TWO — Game 02 · Misión de Compras en Londres · contenido en ESPAÑOL
 *  ⚠️ DEMO / MARCADOR. Reemplazar con el contenido real de la unidad PRIME TWO.
 *  Todo el texto para el jugador aquí es SOLO en español. Las claves de artículo
 *  coinciden con asset-manifest.
 * ===========================================================================*/
window.PRIME_CONTENT_ALL = window.PRIME_CONTENT_ALL || {};
window.PRIME_CONTENT_ALL.es = {
  meta: { book: "PRIME TWO", unit: "Unidad 2 · Compras (DEMO)", language: "es", voice: "es-ES", placeholder: true,
    note: "Contenido de demostración. Reemplazar con la unidad de compras real (español)." },

  intro: {
    placeholder: true,
    titleLines: ["FIRST PRIME INTERACTIVE", "PRIME TWO", "MISIÓN DE COMPRAS EN LONDRES"],
    narration: [
      "¡Bienvenido a Londres!",
      "Hoy vamos de compras por la ciudad.",
      "Aprende las palabras, escucha con atención y llena tu carrito para completar la misión."
    ]
  },

  /* ETAPA 1 — ESCAPARATE: imagen del artículo + frase con hueco, elige la palabra. */
  vocabulary: {
    placeholder: true,
    intro: "Toca la palabra correcta para cada artículo del escaparate.",
    items: [
      { id: "v1", item: "tshirt_blue", word: "Camiseta", prompt: "Esta es una ___ azul.", options: ["Camiseta", "Chaqueta", "Bufanda", "Gorra"] },
      { id: "v2", item: "backpack", word: "Mochila", prompt: "Llevo mis libros en una ___.", options: ["Cartera", "Mochila", "Reloj", "Gorra"] },
      { id: "v3", item: "sneakers_white", word: "Zapatillas", prompt: "Estas ___ blancas son cómodas.", options: ["Pantalones", "Zapatillas", "Gafas de sol", "Bufanda"] },
      { id: "v4", item: "watch", word: "Reloj", prompt: "Miro la hora en mi ___.", options: ["Reloj", "Cartera", "Auriculares", "Gorra"] },
      { id: "v5", item: "sunglasses", word: "Gafas de sol", prompt: "En un día soleado uso ___.", options: ["Gafas de sol", "Bufanda", "Chaqueta", "Guantes"] }
    ]
  },

  /* ETAPA 2 — LISTA DE COMPRAS: escucha el artículo y tócalo en la cuadrícula. */
  listening: {
    placeholder: true,
    intro: "Escucha la lista de compras y toca el artículo correcto.",
    items: [
      { id: "l1", target: "tshirt_blue", label: "camiseta azul",
        audioText: "Necesitamos una camiseta azul. ¿Puedes encontrarla?",
        subtitle: "Necesitamos una camiseta azul. ¿Puedes encontrarla?",
        grid: ["tshirt_blue", "tshirt_white", "jacket", "scarf"] },
      { id: "l2", target: "headphones", label: "auriculares",
        audioText: "Quiero comprar los auriculares.",
        subtitle: "Quiero comprar los auriculares.",
        grid: ["headphones", "watch", "wallet", "sunglasses"] },
      { id: "l3", target: "sneakers_white", label: "zapatillas blancas",
        audioText: "Por favor, encuentra las zapatillas blancas.",
        subtitle: "Por favor, encuentra las zapatillas blancas.",
        grid: ["sneakers_white", "sneakers_blue", "trousers", "cap"] }
    ]
  },

  /* ETAPA 3 — EN LA CAJA: precios / matemática de dinero (números). */
  checkout: {
    placeholder: true,
    intro: "Lee las etiquetas de precio y elige la respuesta correcta.",
    items: [
      { id: "c1", products: [{ item: "tshirt_blue", price: 15 }, { item: "cap", price: 8 }],
        question: "¿Cuánto cuestan la camiseta y la gorra juntas?",
        options: ["£23", "£20", "£30", "£15"], answer: 0 },
      { id: "c2", products: [{ item: "backpack", price: 25 }, { item: "wallet", price: 12 }],
        question: "¿Qué artículo es más barato?",
        options: ["La mochila", "La cartera"], answer: 1 },
      { id: "c3", products: [{ item: "watch", price: 40 }],
        question: "Pagas con £50. ¿Cuánto es tu cambio?",
        options: ["£10", "£5", "£15", "£20"], answer: 0 }
    ]
  },

  /* ETAPA 4 — EN LA TIENDA: conversación, elige la mejor respuesta. */
  conversation: {
    placeholder: true,
    intro: "Continúa la conversación con el dependiente. Elige la mejor respuesta.",
    speakerA: { name: "Emma", role: "Dependienta" }, speakerB: { name: "Tú", role: "Cliente" },
    steps: [
      { speaker: "A", line: "¡Hola! Bienvenido a nuestra tienda. ¿Puedo ayudarte?", options: [
        { text: "Sí, busco una chaqueta.", correct: true, feedback: "¡Muy bien! Así se pide ayuda." },
        { text: "Soy una chaqueta.", correct: false, feedback: "Eso no tiene sentido aquí." },
        { text: "¡Adiós!", correct: false, feedback: "Es muy pronto para despedirse." }] },
      { speaker: "A", line: "¡Claro! ¿Qué talla usas?", options: [
        { text: "Mediana, por favor.", correct: true, feedback: "¡Respuesta perfecta!" },
        { text: "Es azul.", correct: false, feedback: "Eso es un color, no una talla." },
        { text: "Estoy bien, gracias.", correct: false, feedback: "Eso responde a '¿cómo estás?'." }] },
      { speaker: "A", line: "Genial. ¿Cómo te gustaría pagar?", options: [
        { text: "Con tarjeta, por favor.", correct: true, feedback: "¡Excelente, disfruta tus compras!" },
        { text: "A las nueve.", correct: false, feedback: "Eso es una hora, no un pago." },
        { text: "Soy de Brasil.", correct: false, feedback: "No se relaciona con la pregunta." }] }
    ]
  },

  /* ETAPA 5 — LLENA EL CARRITO: toca cada artículo de la lista, evita los demás. */
  final: {
    placeholder: true,
    intro: "¡Misión final! Toca cada artículo de tu lista de compras.",
    store: "clothing",
    list: [
      { item: "tshirt_blue", label: "camiseta azul" },
      { item: "backpack", label: "mochila" },
      { item: "sneakers_white", label: "zapatillas blancas" }
    ],
    grid: ["tshirt_blue", "backpack", "sneakers_white", "jacket", "scarf", "cap", "watch", "sunglasses"]
  }
};
