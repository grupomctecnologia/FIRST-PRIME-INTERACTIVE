/* =============================================================================
 *  PRIME TWO — Game 02 · London Shopping Mission · ENGLISH (British) content.
 *  Seven official steps. Item keys match asset-manifest. No learner-facing
 *  "demo/placeholder" wording.
 * ===========================================================================*/
window.PRIME_CONTENT_ALL = window.PRIME_CONTENT_ALL || {};
window.PRIME_CONTENT_ALL.en = {
  meta: { book: "PRIME TWO", unit: "London Shopping Mission", language: "en", voice: "en-GB" },

  /* STEP 1 — MISSION BRIEFING */
  intro: {
    titleLines: ["FIRST PRIME INTERACTIVE", "PRIME TWO", "LONDON SHOPPING MISSION"],
    narration: [
      "Welcome to London! I'm Alex.",
      "And I'm Emma. Let's go shopping!",
      "Find the right items, mind the colours, sizes and prices,",
      "then fill your shopping bag and pay at the checkout. Let's start!"
    ]
  },

  /* STEP 2 — FIND THE ITEM: choose the correct product among visual options. */
  findItem: {
    intro: "Listen and tap the correct item.",
    items: [
      { id: "f1", target: "backpack", label: "backpack",
        audioText: "Find the backpack.", subtitle: "Find the backpack.",
        grid: ["backpack", "watch", "wallet", "cap"] },
      { id: "f2", target: "headphones", label: "headphones",
        audioText: "Find the headphones.", subtitle: "Find the headphones.",
        grid: ["headphones", "sunglasses", "scarf", "watch"] },
      { id: "f3", target: "trousers", label: "trousers",
        audioText: "Find the trousers.", subtitle: "Find the trousers.",
        grid: ["trousers", "jacket", "tshirt_white", "cap"] }
    ]
  },

  /* STEP 3 — COLOUR AND SIZE: product + colour + size (S/M/L). */
  colourSize: {
    intro: "Read the sentence and choose the right colour and size.",
    items: [
      { id: "cs1", prompt: "I need a blue T-shirt in medium.", answer: 0, options: [
        { item: "tshirt_blue", colour: "Blue", size: "M" },
        { item: "tshirt_white", colour: "White", size: "M" },
        { item: "tshirt_blue", colour: "Blue", size: "L" },
        { item: "jacket", colour: "Blue", size: "M" } ] },
      { id: "cs2", prompt: "Choose the small black jacket.", answer: 0, options: [
        { item: "jacket", colour: "Black", size: "S" },
        { item: "jacket", colour: "Blue", size: "S" },
        { item: "jacket", colour: "Black", size: "L" },
        { item: "trousers", colour: "Black", size: "S" } ] },
      { id: "cs3", prompt: "Find the large red scarf.", answer: 0, options: [
        { item: "scarf", colour: "Red", size: "L" },
        { item: "scarf", colour: "Red", size: "S" },
        { item: "cap", colour: "Red", size: "L" },
        { item: "scarf", colour: "Blue", size: "L" } ] }
    ]
  },

  /* STEP 4 — PRICES AND POUNDS: prices in £ + simple maths. */
  prices: {
    intro: "Read the price tags and choose the correct answer.",
    items: [
      { id: "p1", products: [{ item: "tshirt_blue", price: 15 }, { item: "cap", price: 8 }],
        question: "How much are the T-shirt and the cap together?",
        options: ["£23", "£20", "£30", "£15"], answer: 0 },
      { id: "p2", products: [{ item: "backpack", price: 25 }, { item: "wallet", price: 12 }],
        question: "Which item is cheaper?",
        options: ["The backpack", "The wallet"], answer: 1 },
      { id: "p3", products: [{ item: "watch", price: 40 }],
        question: "You pay with £50. What is your change?",
        options: ["£10", "£5", "£15", "£20"], answer: 0 }
    ]
  },

  /* STEP 5 — SHOPPING DIALOGUE: conversation in the shop. */
  dialogue: {
    intro: "Talk with the shop assistant. Choose the best reply.",
    speakerA: { name: "Emma", role: "Shop assistant" }, speakerB: { name: "You", role: "Customer" },
    steps: [
      { speaker: "A", line: "Hello! Can I help you?", options: [
        { text: "I'm looking for a jacket.", correct: true, feedback: "Great — that's how you ask for help." },
        { text: "I am a jacket.", correct: false, feedback: "That doesn't make sense here." },
        { text: "Goodbye!", correct: false, feedback: "It's too early to say goodbye." } ] },
      { speaker: "A", line: "What size do you need?", options: [
        { text: "Medium, please.", correct: true, feedback: "Perfect answer!" },
        { text: "It's red.", correct: false, feedback: "That's a colour, not a size." },
        { text: "Thank you, I'm fine.", correct: false, feedback: "That doesn't answer the question." } ] },
      { speaker: "A", line: "We have it in black and blue.", options: [
        { text: "Do you have this in blue?", correct: true, feedback: "Excellent question!" },
        { text: "What time is it?", correct: false, feedback: "Not related to shopping." },
        { text: "I'm from Brazil.", correct: false, feedback: "Not related to the question." } ] },
      { speaker: "A", line: "Yes, here it is. Would you like to try it on?", options: [
        { text: "Yes, where is the fitting room?", correct: true, feedback: "Great — off to the fitting room!" },
        { text: "No, I am blue.", correct: false, feedback: "That doesn't make sense." },
        { text: "It's nine pounds.", correct: false, feedback: "That's a price, not a reply." } ] },
      { speaker: "A", line: "It looks great on you!", options: [
        { text: "I'll take it.", correct: true, feedback: "Wonderful — let's pay at the checkout." },
        { text: "I'll take a nap.", correct: false, feedback: "Keep it about shopping." },
        { text: "It's a car.", correct: false, feedback: "That doesn't fit here." } ] }
    ]
  },

  /* STEP 6 — SHOPPING BAG: add, view, check and remove items using the slots. */
  shoppingBag: {
    intro: "Add every item on your list to your bag. Tap an item in the bag to remove it.",
    store: "clothing",
    list: [
      { item: "tshirt_blue", label: "blue T-shirt" },
      { item: "backpack", label: "backpack" },
      { item: "sneakers_white", label: "white trainers" }
    ],
    grid: ["tshirt_blue", "backpack", "sneakers_white", "jacket", "scarf", "cap", "watch", "sunglasses"]
  },

  /* STEP 7 — CHECKOUT CHALLENGE: review the order, confirm the total, pay. */
  checkoutChallenge: {
    intro: "Check your order, then confirm the total to pay.",
    receipt: [
      { item: "tshirt_blue", label: "Blue T-shirt", colour: "Blue", size: "M", qty: 1, price: 15 },
      { item: "backpack", label: "Backpack", colour: "Navy", size: "—", qty: 1, price: 25 },
      { item: "sneakers_white", label: "White trainers", colour: "White", size: "M", qty: 1, price: 30 }
    ],
    totalQuestion: "What is the total to pay?",
    options: ["£70", "£65", "£55", "£40"], answer: 0
  }
};

/* Shared audio manifest (Web Audio + TTS until real voice files are added) */
window.PRIME_AUDIO_MANIFEST = { music: { menu: null, adventure: null, victory: null }, voice: {} };
