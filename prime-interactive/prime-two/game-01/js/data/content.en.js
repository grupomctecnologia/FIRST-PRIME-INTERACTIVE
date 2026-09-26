/* =============================================================================
 *  PRIME TWO — Game 01 · ENGLISH pedagogical content
 *  ⚠️ DEMO / PLACEHOLDER. Replace with the real PRIME TWO Unit content.
 *  All player-facing text here is ENGLISH only.
 * ===========================================================================*/
window.PRIME_CONTENT_ALL = window.PRIME_CONTENT_ALL || {};
window.PRIME_CONTENT_ALL.en = {
  meta: { book: "PRIME TWO", unit: "Unit 1 (DEMO)", language: "en", voice: "en-US", placeholder: true,
    note: "Demonstration content. Replace with real PRIME TWO Unit 1 (English)." },

  intro: {
    placeholder: true,
    titleLines: ["FIRST PRIME INTERACTIVE", "PRIME TWO", "THE ENGLISH ADVENTURE"],
    narration: [
      "Welcome, traveler.",
      "Your English adventure begins now.",
      "Explore the city, learn new words, and complete every mission."
    ]
  },

  vocabulary: {
    placeholder: true,
    intro: "Tap the correct word for each object.",
    items: [
      { id: "v1", icon: "suitcase", word: "Suitcase", prompt: "This is my ___.", options: ["Suitcase", "Ticket", "Map", "Camera"] },
      { id: "v2", icon: "ticket", word: "Ticket", prompt: "I need my ___ to board.", options: ["Passport", "Ticket", "Suitcase", "Key"] },
      { id: "v3", icon: "map", word: "Map", prompt: "Let's check the ___.", options: ["Map", "Phone", "Camera", "Ticket"] },
      { id: "v4", icon: "passport", word: "Passport", prompt: "Show your ___, please.", options: ["Wallet", "Map", "Passport", "Key"] },
      { id: "v5", icon: "camera", word: "Camera", prompt: "Take a photo with the ___.", options: ["Camera", "Phone", "Map", "Ticket"] }
    ]
  },

  listening: {
    placeholder: true,
    intro: "Listen carefully and choose the correct answer.",
    items: [
      { id: "l1", audioText: "Good morning! Welcome to the city. My name is Emma and I am your guide.",
        subtitle: "Good morning! Welcome to the city. My name is Emma and I am your guide.",
        question: "What is the guide's name?", options: ["Emma", "Anna", "Emily", "Olivia"], answer: 0 },
      { id: "l2", audioText: "The train leaves at nine o'clock. Please, don't be late.",
        subtitle: "The train leaves at nine o'clock. Please, don't be late.",
        question: "What time does the train leave?", options: ["8 o'clock", "9 o'clock", "10 o'clock", "11 o'clock"], answer: 1 },
      { id: "l3", audioText: "The museum is next to the old library, on Green Street.",
        subtitle: "The museum is next to the old library, on Green Street.",
        question: "Where is the museum?", options: ["Next to the park", "Next to the library", "Next to the hotel", "Next to the station"], answer: 1 }
    ]
  },

  conversation: {
    placeholder: true,
    intro: "Continue the conversation. Choose the best reply.",
    speakerA: { name: "Emma", role: "Guide" }, speakerB: { name: "You", role: "Traveler" },
    steps: [
      { speaker: "A", line: "Hi! Welcome. How are you today?", options: [
        { text: "I'm fine, thank you!", correct: true, feedback: "Great greeting!" },
        { text: "I am a table.", correct: false, feedback: "That doesn't answer the question." },
        { text: "Goodbye!", correct: false, feedback: "It's too early to say goodbye." }] },
      { speaker: "A", line: "Where are you from?", options: [
        { text: "I'm from Brazil.", correct: true, feedback: "Perfect answer!" },
        { text: "I'm fine.", correct: false, feedback: "That answers 'how are you', not 'where'." },
        { text: "It's a car.", correct: false, feedback: "Not related to the question." }] },
      { speaker: "A", line: "Nice! Do you want to visit the museum?", options: [
        { text: "Yes, I'd love to!", correct: true, feedback: "Excellent, let's go!" },
        { text: "I'm ten pencils.", correct: false, feedback: "That makes no sense here." },
        { text: "No thanks, I am blue.", correct: false, feedback: "Odd reply — keep it natural." }] }
    ]
  },

  language: {
    placeholder: true,
    intro: "Drag the words to build the correct sentence.",
    items: [
      { id: "g1", words: ["She", "is", "from", "London"], answer: "She is from London", hint: "Subject + verb 'to be' + place." },
      { id: "g2", words: ["They", "are", "at", "the", "airport"], answer: "They are at the airport", hint: "Use 'are' with 'they'." },
      { id: "g3", words: ["I", "have", "two", "tickets"], answer: "I have two tickets", hint: "Subject + 'have' + number + noun." }
    ]
  },

  final: {
    placeholder: true,
    intro: "Final Mission! Use everything you learned.",
    items: [
      { kind: "vocab", question: "Which word means a bag for travel?", options: ["Ticket", "Suitcase", "Map", "Camera"], answer: 1 },
      { kind: "listening", audioText: "The hotel is on the right, near the big fountain.",
        subtitle: "The hotel is on the right, near the big fountain.",
        question: "Where is the hotel?", options: ["On the left", "On the right", "Behind the park", "Next to the train"], answer: 1 },
      { kind: "comprehension", question: "Choose the correct reply: 'Where are you from?'", options: ["I'm fine.", "I'm from Brazil.", "It's nine o'clock.", "Yes, please."], answer: 1 },
      { kind: "grammar", question: "Complete: 'They ___ at the airport.'", options: ["is", "am", "are", "be"], answer: 2 }
    ]
  }
};

/* Shared audio manifest (placeholder — Web Audio + TTS until real files exist) */
window.PRIME_AUDIO_MANIFEST = { placeholder: true, music: { menu: null, adventure: null, victory: null }, voice: {} };
