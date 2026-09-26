/* =============================================================================
 *  PRIME TWO — Game 02 · Misión de Compras en Londres · contenido en ESPAÑOL.
 *  Siete pasos oficiales. Las claves de artículo coinciden con asset-manifest.
 *  Sin texto de "demo/marcador" visible para el alumno.
 * ===========================================================================*/
window.PRIME_CONTENT_ALL = window.PRIME_CONTENT_ALL || {};
window.PRIME_CONTENT_ALL.es = {
  meta: { book: "PRIME TWO", unit: "Misión de Compras en Londres", language: "es", voice: "es-ES" },

  /* PASO 1 — INSTRUCCIONES DE LA MISIÓN */
  intro: {
    titleLines: ["FIRST PRIME INTERACTIVE", "PRIME TWO", "MISIÓN DE COMPRAS EN LONDRES"],
    narration: [
      "¡Bienvenido a Londres! Soy Alex.",
      "Y yo soy Emma. ¡Vamos de compras!",
      "Encuentra los artículos correctos, fíjate en el color, la talla y el precio,",
      "luego llena tu bolsa y paga en la caja. ¡Empecemos!"
    ]
  },

  /* PASO 2 — ENCUENTRA EL ARTÍCULO */
  findItem: {
    intro: "Escucha y toca el artículo correcto.",
    items: [
      { id: "f1", target: "backpack", label: "mochila",
        audioText: "Encuentra la mochila.", subtitle: "Encuentra la mochila.",
        grid: ["backpack", "watch", "wallet", "cap"] },
      { id: "f2", target: "headphones", label: "auriculares",
        audioText: "Encuentra los auriculares.", subtitle: "Encuentra los auriculares.",
        grid: ["headphones", "sunglasses", "scarf", "watch"] },
      { id: "f3", target: "trousers", label: "pantalones",
        audioText: "Encuentra los pantalones.", subtitle: "Encuentra los pantalones.",
        grid: ["trousers", "jacket", "tshirt_white", "cap"] }
    ]
  },

  /* PASO 3 — COLOR Y TALLA */
  colourSize: {
    intro: "Lee la frase y elige el color y la talla correctos.",
    items: [
      { id: "cs1", prompt: "Necesito una camiseta azul en talla mediana.", answer: 0, options: [
        { item: "tshirt_blue", colour: "Azul", size: "M" },
        { item: "tshirt_white", colour: "Blanca", size: "M" },
        { item: "tshirt_blue", colour: "Azul", size: "L" },
        { item: "jacket", colour: "Azul", size: "M" } ] },
      { id: "cs2", prompt: "Elige la chaqueta negra pequeña.", answer: 0, options: [
        { item: "jacket", colour: "Negra", size: "S" },
        { item: "jacket", colour: "Azul", size: "S" },
        { item: "jacket", colour: "Negra", size: "L" },
        { item: "trousers", colour: "Negros", size: "S" } ] },
      { id: "cs3", prompt: "Encuentra la bufanda roja grande.", answer: 0, options: [
        { item: "scarf", colour: "Roja", size: "L" },
        { item: "scarf", colour: "Roja", size: "S" },
        { item: "cap", colour: "Roja", size: "L" },
        { item: "scarf", colour: "Azul", size: "L" } ] }
    ]
  },

  /* PASO 4 — PRECIOS Y LIBRAS */
  prices: {
    intro: "Lee las etiquetas de precio y elige la respuesta correcta.",
    items: [
      { id: "p1", products: [{ item: "tshirt_blue", price: 15 }, { item: "cap", price: 8 }],
        question: "¿Cuánto cuestan la camiseta y la gorra juntas?",
        options: ["£23", "£20", "£30", "£15"], answer: 0 },
      { id: "p2", products: [{ item: "backpack", price: 25 }, { item: "wallet", price: 12 }],
        question: "¿Qué artículo es más barato?",
        options: ["La mochila", "La cartera"], answer: 1 },
      { id: "p3", products: [{ item: "watch", price: 40 }],
        question: "Pagas con £50. ¿Cuánto es tu cambio?",
        options: ["£10", "£5", "£15", "£20"], answer: 0 }
    ]
  },

  /* PASO 5 — DIÁLOGO DE COMPRAS */
  dialogue: {
    intro: "Habla con la dependienta. Elige la mejor respuesta.",
    speakerA: { name: "Emma", role: "Dependienta" }, speakerB: { name: "Tú", role: "Cliente" },
    steps: [
      { speaker: "A", line: "¡Hola! ¿Puedo ayudarte?", options: [
        { text: "Estoy buscando una chaqueta.", correct: true, feedback: "¡Muy bien! Así se pide ayuda." },
        { text: "Soy una chaqueta.", correct: false, feedback: "Eso no tiene sentido aquí." },
        { text: "¡Adiós!", correct: false, feedback: "Es muy pronto para despedirse." } ] },
      { speaker: "A", line: "¿Qué talla necesitas?", options: [
        { text: "Mediana, por favor.", correct: true, feedback: "¡Respuesta perfecta!" },
        { text: "Es roja.", correct: false, feedback: "Eso es un color, no una talla." },
        { text: "Gracias, estoy bien.", correct: false, feedback: "Eso no responde la pregunta." } ] },
      { speaker: "A", line: "La tenemos en negro y azul.", options: [
        { text: "¿La tienes en azul?", correct: true, feedback: "¡Excelente pregunta!" },
        { text: "¿Qué hora es?", correct: false, feedback: "No se relaciona con las compras." },
        { text: "Soy de Brasil.", correct: false, feedback: "No se relaciona con la pregunta." } ] },
      { speaker: "A", line: "Sí, aquí está. ¿Quieres probártela?", options: [
        { text: "Sí, ¿dónde está el probador?", correct: true, feedback: "¡Genial, al probador!" },
        { text: "No, soy azul.", correct: false, feedback: "Eso no tiene sentido." },
        { text: "Cuesta nueve libras.", correct: false, feedback: "Eso es un precio, no una respuesta." } ] },
      { speaker: "A", line: "¡Te queda genial!", options: [
        { text: "Me la llevo.", correct: true, feedback: "¡Perfecto, vamos a pagar!" },
        { text: "Me echo una siesta.", correct: false, feedback: "Habla sobre las compras." },
        { text: "Es un coche.", correct: false, feedback: "Eso no encaja aquí." } ] }
    ]
  },

  /* PASO 6 — BOLSA DE COMPRAS */
  shoppingBag: {
    intro: "Añade cada artículo de tu lista a la bolsa. Toca un artículo de la bolsa para quitarlo.",
    store: "clothing",
    list: [
      { item: "tshirt_blue", label: "camiseta azul" },
      { item: "backpack", label: "mochila" },
      { item: "sneakers_white", label: "zapatillas blancas" }
    ],
    grid: ["tshirt_blue", "backpack", "sneakers_white", "jacket", "scarf", "cap", "watch", "sunglasses"]
  },

  /* PASO 7 — RETO EN LA CAJA */
  checkoutChallenge: {
    intro: "Revisa tu pedido y confirma el total para pagar.",
    receipt: [
      { item: "tshirt_blue", label: "Camiseta azul", colour: "Azul", size: "M", qty: 1, price: 15 },
      { item: "backpack", label: "Mochila", colour: "Azul marino", size: "—", qty: 1, price: 25 },
      { item: "sneakers_white", label: "Zapatillas blancas", colour: "Blanco", size: "M", qty: 1, price: 30 }
    ],
    totalQuestion: "¿Cuál es el total a pagar?",
    options: ["£70", "£65", "£55", "£40"], answer: 0
  }
};
