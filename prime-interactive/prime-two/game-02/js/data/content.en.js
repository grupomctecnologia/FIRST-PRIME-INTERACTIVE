/* =============================================================================
 *  PRIME TWO — Game 02 · London Shopping Mission · ENGLISH pedagogical content
 *  ⚠️ DEMO / PLACEHOLDER. Replace with the real PRIME TWO Unit content.
 *  All player-facing text here is ENGLISH only. Item keys match asset-manifest.
 * ===========================================================================*/
window.PRIME_CONTENT_ALL = window.PRIME_CONTENT_ALL || {};
window.PRIME_CONTENT_ALL.en = {
  meta: { book: "PRIME TWO", unit: "Unit 2 · Shopping (DEMO)", language: "en", voice: "en-US", placeholder: true,
    note: "Demonstration content. Replace with real PRIME TWO shopping unit (English)." },

  intro: {
    placeholder: true,
    titleLines: ["FIRST PRIME INTERACTIVE", "PRIME TWO", "LONDON SHOPPING MISSION"],
    narration: [
      "Welcome to London!",
      "Today we are going shopping in the city.",
      "Learn the words, listen carefully, and fill your cart to complete the mission."
    ]
  },

  /* STAGE 1 — SHOP WINDOW: item image + gap sentence, pick the word. */
  vocabulary: {
    placeholder: true,
    intro: "Tap the correct word for each item in the shop window.",
    items: [
      { id: "v1", item: "tshirt_blue", word: "T-shirt", prompt: "This is a blue ___.", options: ["T-shirt", "Jacket", "Scarf", "Cap"] },
      { id: "v2", item: "backpack", word: "Backpack", prompt: "I carry my books in a ___.", options: ["Wallet", "Backpack", "Watch", "Cap"] },
      { id: "v3", item: "sneakers_white", word: "Sneakers", prompt: "These white ___ are comfortable.", options: ["Trousers", "Sneakers", "Sunglasses", "Scarf"] },
      { id: "v4", item: "watch", word: "Watch", prompt: "I check the time on my ___.", options: ["Watch", "Wallet", "Headphones", "Cap"] },
      { id: "v5", item: "sunglasses", word: "Sunglasses", prompt: "On a sunny day I wear ___.", options: ["Sunglasses", "Scarf", "Jacket", "Gloves"] }
    ]
  },

  /* STAGE 2 — SHOPPING LIST: hear the item, tap it among a grid of images. */
  listening: {
    placeholder: true,
    intro: "Listen to the shopping list and tap the correct item.",
    items: [
      { id: "l1", target: "tshirt_blue", label: "blue t-shirt",
        audioText: "We need a blue t-shirt. Can you find it?",
        subtitle: "We need a blue t-shirt. Can you find it?",
        grid: ["tshirt_blue", "tshirt_white", "jacket", "scarf"] },
      { id: "l2", target: "headphones", label: "headphones",
        audioText: "I want to buy the headphones.",
        subtitle: "I want to buy the headphones.",
        grid: ["headphones", "watch", "wallet", "sunglasses"] },
      { id: "l3", target: "sneakers_white", label: "white sneakers",
        audioText: "Please find the white sneakers.",
        subtitle: "Please find the white sneakers.",
        grid: ["sneakers_white", "sneakers_blue", "trousers", "cap"] }
    ]
  },

  /* STAGE 3 — AT THE CHECKOUT: prices / money math (numbers). */
  checkout: {
    placeholder: true,
    intro: "Read the price tags and choose the correct answer.",
    items: [
      { id: "c1", products: [{ item: "tshirt_blue", price: 15 }, { item: "cap", price: 8 }],
        question: "How much are the t-shirt and the cap together?",
        options: ["£23", "£20", "£30", "£15"], answer: 0 },
      { id: "c2", products: [{ item: "backpack", price: 25 }, { item: "wallet", price: 12 }],
        question: "Which item is cheaper?",
        options: ["The backpack", "The wallet"], answer: 1 },
      { id: "c3", products: [{ item: "watch", price: 40 }],
        question: "You pay with £50. What is your change?",
        options: ["£10", "£5", "£15", "£20"], answer: 0 }
    ]
  },

  /* STAGE 4 — IN THE SHOP: conversation, pick the best reply. */
  conversation: {
    placeholder: true,
    intro: "Continue the conversation with the shop assistant. Choose the best reply.",
    speakerA: { name: "Emma", role: "Shop assistant" }, speakerB: { name: "You", role: "Customer" },
    steps: [
      { speaker: "A", line: "Hello! Welcome to our shop. Can I help you?", options: [
        { text: "Yes, I'm looking for a jacket.", correct: true, feedback: "Great — that's how you ask for help!" },
        { text: "I am a jacket.", correct: false, feedback: "That doesn't make sense here." },
        { text: "Goodbye!", correct: false, feedback: "It's too early to say goodbye." }] },
      { speaker: "A", line: "Sure! What size are you?", options: [
        { text: "Medium, please.", correct: true, feedback: "Perfect answer!" },
        { text: "It's blue.", correct: false, feedback: "That's a colour, not a size." },
        { text: "I'm fine, thanks.", correct: false, feedback: "That answers 'how are you'." }] },
      { speaker: "A", line: "Great. How would you like to pay?", options: [
        { text: "By card, please.", correct: true, feedback: "Excellent — enjoy your shopping!" },
        { text: "At nine o'clock.", correct: false, feedback: "That's a time, not a payment." },
        { text: "I'm from Brazil.", correct: false, feedback: "Not related to the question." }] }
    ]
  },

  /* STAGE 5 — FILL THE CART: tap every item on the list, avoid wrong items. */
  final: {
    placeholder: true,
    intro: "Final mission! Tap every item on your shopping list.",
    store: "clothing",
    list: [
      { item: "tshirt_blue", label: "blue t-shirt" },
      { item: "backpack", label: "backpack" },
      { item: "sneakers_white", label: "white sneakers" }
    ],
    grid: ["tshirt_blue", "backpack", "sneakers_white", "jacket", "scarf", "cap", "watch", "sunglasses"]
  }
};

/* Shared audio manifest (placeholder — Web Audio + TTS until real files exist) */
window.PRIME_AUDIO_MANIFEST = { placeholder: true, music: { menu: null, adventure: null, victory: null }, voice: {} };
