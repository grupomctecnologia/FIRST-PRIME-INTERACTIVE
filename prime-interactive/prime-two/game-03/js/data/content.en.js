/* =============================================================================
 *  PRIME TWO — Game 03 · London Underground Mystery · ENGLISH (British) content.
 *  Seven official steps. Item keys match asset-manifest. No learner-facing
 *  "demo/placeholder" wording, no Portuguese.
 * ===========================================================================*/
window.PRIME_CONTENT_ALL = window.PRIME_CONTENT_ALL || {};
window.PRIME_CONTENT_ALL.en = {
  meta: { book: "PRIME TWO", unit: "London Underground Mystery", language: "en", voice: "en-GB" },

  /* STEP 1 — MISSION BRIEFING */
  intro: {
    titleLines: ["FIRST PRIME INTERACTIVE", "PRIME TWO", "LONDON UNDERGROUND MYSTERY"],
    narration: [
      "Welcome to the London Underground! I'm Alex.",
      "And I'm Emma. A mystery is waiting for us down here.",
      "Match the words, build the sentences and follow the right routes",
      "to reach the final destination. Mind the gap — let's go!"
    ]
  },

  /* STEP 2 — MEMORY MATCH: match each picture card with its word card. */
  memory: {
    intro: "Find the matching pairs of picture and word.",
    pairs: [
      { key: "ticket",     item: "ticket",            word: "ticket" },
      { key: "train",      item: "underground_train", word: "train" },
      { key: "platform",   item: "platform",          word: "platform" },
      { key: "escalator",  item: "escalator",         word: "escalator" },
      { key: "bus",        item: "double_decker_bus", word: "bus" },
      { key: "taxi",       item: "london_taxi",       word: "taxi" }
    ]
  },

  /* STEP 3 — WORD BUILDER: tap the scrambled letters in order. */
  wordBuilder: {
    intro: "Build the word for each picture.",
    words: [
      { word: "TICKET",   item: "ticket" },
      { word: "TRAIN",    item: "underground_train" },
      { word: "EXIT",     item: "exit_door" },
      { word: "PLATFORM", item: "platform" }
    ]
  },

  /* STEP 4 — MATCH WORD AND IMAGE: see the picture, choose the correct word. */
  match: {
    intro: "Which word matches the picture?",
    items: [
      { item: "underground_train", options: ["train", "bus", "taxi", "ticket"], answer: 0 },
      { item: "travel_card",       options: ["travel card", "route map", "platform", "escalator"], answer: 0 },
      { item: "escalator",         options: ["escalator", "exit", "platform", "ticket"], answer: 0 },
      { item: "double_decker_bus", options: ["bus", "taxi", "train", "lorry"], answer: 0 }
    ]
  },

  /* STEP 5 — FOLLOW THE DIRECTION: read the instruction, choose the arrow. */
  direction: {
    intro: "Follow the instruction and choose the right way.",
    items: [
      { instruction: "Turn left to the platform.",   answer: "left" },
      { instruction: "Go straight to the exit.",      answer: "straight" },
      { instruction: "Turn right to the escalator.",  answer: "right" },
      { instruction: "Turn left to the ticket hall.", answer: "left" }
    ]
  },

  /* STEP 6 — SENTENCE PUZZLE: tap the blocks in order to build the sentence. */
  sentence: {
    intro: "Build the sentence in the correct order.",
    sentences: [
      { blocks: ["Mind", "the", "gap."] },
      { blocks: ["Where", "is", "the", "platform?"] },
      { blocks: ["I", "need", "a", "ticket."] },
      { blocks: ["Take", "the", "escalator", "to", "the", "exit."] }
    ]
  },

  /* STEP 7 — TIMED FINAL CHALLENGE: quick questions against the clock. */
  timed: {
    intro: "Answer quickly to solve the mystery!",
    questions: [
      { q: "Where do you wait for the train?", options: ["Platform", "Escalator", "Exit"], answer: 0 },
      { q: "What do you need to travel?",       options: ["Ticket", "Taxi", "Map"], answer: 0 },
      { q: "How do you go up between levels?",   options: ["Escalator", "Platform", "Train"], answer: 0 },
      { q: "What is the famous red London bus?", options: ["Double-decker bus", "Taxi", "Lorry"], answer: 0 },
      { q: "What is the classic black London car?", options: ["Taxi", "Bus", "Train"], answer: 0 },
      { q: "Which way leads out of the station?", options: ["Exit", "Platform", "Ticket"], answer: 0 }
    ]
  }
};

/* Shared audio manifest (Web Audio + TTS until real voice files are added) */
window.PRIME_AUDIO_MANIFEST = { music: { menu: null, adventure: null, victory: null }, voice: {} };
