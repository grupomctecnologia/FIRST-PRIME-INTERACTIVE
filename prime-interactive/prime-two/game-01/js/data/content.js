/* =============================================================================
 *  PRIME TWO — THE ENGLISH ADVENTURE  ·  GAME 01
 *  CONTEÚDO PEDAGÓGICO
 * -----------------------------------------------------------------------------
 *  ⚠️  ATENÇÃO — CONTEÚDO DEMONSTRATIVO (PLACEHOLDER)
 *
 *  Este arquivo contém conteúdo DEMONSTRATIVO, criado apenas para exercitar o
 *  MOTOR do jogo. NÃO representa o conteúdo oficial do livro PRIME TWO.
 *
 *  Todo item marcado com  placeholder: true  deve ser substituído pelo
 *  conteúdo real da Unidade correspondente do PRIME TWO (vocabulário,
 *  estruturas, diálogos, áudios e objetivos pedagógicos reais).
 *
 *  COMO SUBSTITUIR: veja  CONTENT_GUIDE.md  na raiz de  game-01/.
 *  A estrutura de dados abaixo permanece igual; troque apenas os valores.
 * ===========================================================================*/

window.PRIME_CONTENT = {
  meta: {
    book: "PRIME TWO",
    unit: "Unit 1 (DEMO)",
    theme: "Arrival — Travel, City & Introductions",
    language: "en",
    translationLanguage: "pt-BR",
    placeholder: true,
    note: "Conteúdo demonstrativo. Substituir pela Unidade 1 real do PRIME TWO."
  },

  /* ---- FASE 1 · CINEMATIC INTRO ------------------------------------------ */
  intro: {
    placeholder: true,
    titleLines: ["FIRST PRIME INTERACTIVE", "PRIME TWO", "THE ENGLISH ADVENTURE"],
    subtitle: "An interactive English adventure",
    narration: [
      { en: "Welcome, traveler.", pt: "Bem-vindo, viajante." },
      { en: "Your English adventure begins now.", pt: "Sua aventura em inglês começa agora." },
      { en: "Explore the city, learn new words, and complete every mission.", pt: "Explore a cidade, aprenda novas palavras e complete cada missão." }
    ]
  },

  /* ---- FASE 2 · VOCABULARY MISSION --------------------------------------- */
  /* O aluno vê um objeto no cenário e escolhe a palavra correta em inglês.   */
  vocabulary: {
    placeholder: true,
    intro: { en: "Tap the correct word for each object.", pt: "Toque na palavra correta para cada objeto." },
    items: [
      { id: "v1", icon: "suitcase", word: "Suitcase", translation: "Mala",
        prompt: { en: "This is my ___.", pt: "Esta é a minha ___." },
        options: ["Suitcase", "Ticket", "Map", "Camera"] },
      { id: "v2", icon: "ticket", word: "Ticket", translation: "Passagem / Bilhete",
        prompt: { en: "I need my ___ to board.", pt: "Preciso da minha ___ para embarcar." },
        options: ["Passport", "Ticket", "Suitcase", "Key"] },
      { id: "v3", icon: "map", word: "Map", translation: "Mapa",
        prompt: { en: "Let's check the ___.", pt: "Vamos ver o ___." },
        options: ["Map", "Phone", "Camera", "Ticket"] },
      { id: "v4", icon: "passport", word: "Passport", translation: "Passaporte",
        prompt: { en: "Show your ___, please.", pt: "Mostre seu ___, por favor." },
        options: ["Wallet", "Map", "Passport", "Key"] },
      { id: "v5", icon: "camera", word: "Camera", translation: "Câmera",
        prompt: { en: "Take a photo with the ___.", pt: "Tire uma foto com a ___." },
        options: ["Camera", "Phone", "Map", "Ticket"] }
    ]
  },

  /* ---- FASE 3 · LISTENING MISSION ---------------------------------------- */
  /* Áudio (voz sintetizada placeholder) + legenda sincronizada + múltipla escolha. */
  listening: {
    placeholder: true,
    intro: { en: "Listen carefully and choose the correct answer.", pt: "Ouça com atenção e escolha a resposta correta." },
    items: [
      { id: "l1",
        audioText: "Good morning! Welcome to the city. My name is Emma and I am your guide.",
        subtitle: { en: "Good morning! Welcome to the city. My name is Emma and I am your guide.",
                    pt: "Bom dia! Bem-vindo à cidade. Meu nome é Emma e eu sou sua guia." },
        question: { en: "What is the guide's name?", pt: "Qual é o nome da guia?" },
        options: ["Emma", "Anna", "Emily", "Olivia"], answer: 0 },
      { id: "l2",
        audioText: "The train leaves at nine o'clock. Please, don't be late.",
        subtitle: { en: "The train leaves at nine o'clock. Please, don't be late.",
                    pt: "O trem parte às nove horas. Por favor, não se atrase." },
        question: { en: "What time does the train leave?", pt: "A que horas o trem parte?" },
        options: ["8 o'clock", "9 o'clock", "10 o'clock", "11 o'clock"], answer: 1 },
      { id: "l3",
        audioText: "The museum is next to the old library, on Green Street.",
        subtitle: { en: "The museum is next to the old library, on Green Street.",
                    pt: "O museu fica ao lado da antiga biblioteca, na Rua Green." },
        question: { en: "Where is the museum?", pt: "Onde fica o museu?" },
        options: ["Next to the park", "Next to the library", "Next to the hotel", "Next to the station"], answer: 1 }
    ]
  },

  /* ---- FASE 4 · CONVERSATION CHALLENGE ----------------------------------- */
  /* Dois personagens conversam; o aluno escolhe a resposta correta.          */
  conversation: {
    placeholder: true,
    intro: { en: "Continue the conversation. Choose the best reply.", pt: "Continue a conversa. Escolha a melhor resposta." },
    speakerA: { name: "Emma", role: "Guide" },
    speakerB: { name: "You", role: "Traveler" },
    steps: [
      { speaker: "A", line: { en: "Hi! Welcome. How are you today?", pt: "Oi! Bem-vindo. Como você está hoje?" },
        options: [
          { text: "I'm fine, thank you!", correct: true, feedback: { en: "Great greeting!", pt: "Ótimo cumprimento!" } },
          { text: "I am a table.", correct: false, feedback: { en: "That doesn't answer the question.", pt: "Isso não responde à pergunta." } },
          { text: "Goodbye!", correct: false, feedback: { en: "It's too early to say goodbye.", pt: "É cedo demais para se despedir." } }
        ] },
      { speaker: "A", line: { en: "Where are you from?", pt: "De onde você é?" },
        options: [
          { text: "I'm from Brazil.", correct: true, feedback: { en: "Perfect answer!", pt: "Resposta perfeita!" } },
          { text: "I'm fine.", correct: false, feedback: { en: "That answers 'how are you', not 'where'.", pt: "Isso responde 'como vai', não 'de onde'." } },
          { text: "It's a car.", correct: false, feedback: { en: "Not related to the question.", pt: "Não tem relação com a pergunta." } }
        ] },
      { speaker: "A", line: { en: "Nice! Do you want to visit the museum?", pt: "Legal! Você quer visitar o museu?" },
        options: [
          { text: "Yes, I'd love to!", correct: true, feedback: { en: "Excellent, let's go!", pt: "Excelente, vamos!" } },
          { text: "I'm ten pencils.", correct: false, feedback: { en: "That makes no sense here.", pt: "Isso não faz sentido aqui." } },
          { text: "No thanks, I am blue.", correct: false, feedback: { en: "Odd reply — keep it natural.", pt: "Resposta estranha — mantenha natural." } }
        ] }
    ]
  },

  /* ---- FASE 5 · LANGUAGE CHALLENGE (drag & drop) ------------------------- */
  /* Arraste as palavras para formar a frase correta.                         */
  language: {
    placeholder: true,
    intro: { en: "Drag the words to build the correct sentence.", pt: "Arraste as palavras para formar a frase correta." },
    items: [
      { id: "g1", words: ["She", "is", "from", "London"], answer: "She is from London",
        translation: "Ela é de Londres.",
        hint: { en: "Subject + verb 'to be' + place.", pt: "Sujeito + verbo 'to be' + lugar." } },
      { id: "g2", words: ["They", "are", "at", "the", "airport"], answer: "They are at the airport",
        translation: "Eles estão no aeroporto.",
        hint: { en: "Use 'are' with 'they'.", pt: "Use 'are' com 'they'." } },
      { id: "g3", words: ["I", "have", "two", "tickets"], answer: "I have two tickets",
        translation: "Eu tenho dois bilhetes.",
        hint: { en: "Subject + 'have' + number + noun.", pt: "Sujeito + 'have' + número + substantivo." } }
    ]
  },

  /* ---- FASE 6 · FINAL MISSION -------------------------------------------- */
  /* Mistura de vocabulário, listening e compreensão.                         */
  final: {
    placeholder: true,
    intro: { en: "Final Mission! Use everything you learned.", pt: "Missão Final! Use tudo o que você aprendeu." },
    items: [
      { kind: "vocab", question: { en: "Which word means 'Mala'?", pt: "Qual palavra significa 'Mala'?" },
        options: ["Ticket", "Suitcase", "Map", "Camera"], answer: 1 },
      { kind: "listening", audioText: "The hotel is on the right, near the big fountain.",
        subtitle: { en: "The hotel is on the right, near the big fountain.",
                    pt: "O hotel fica à direita, perto da grande fonte." },
        question: { en: "Where is the hotel?", pt: "Onde fica o hotel?" },
        options: ["On the left", "On the right", "Behind the park", "Next to the train"], answer: 1 },
      { kind: "comprehension", question: { en: "Choose the correct reply: 'Where are you from?'", pt: "Escolha a resposta correta: 'De onde você é?'" },
        options: ["I'm fine.", "I'm from Brazil.", "It's nine o'clock.", "Yes, please."], answer: 1 },
      { kind: "grammar", question: { en: "Complete: 'They ___ at the airport.'", pt: "Complete: 'They ___ at the airport.'" },
        options: ["is", "am", "are", "be"], answer: 2 }
    ]
  }
};

/* -----------------------------------------------------------------------------
 *  MANIFESTO DE ÁUDIO (para substituição futura por áudios reais do PRIME TWO)
 * -----------------------------------------------------------------------------
 *  Enquanto os arquivos reais não existem, o jogo usa:
 *    - Música/efeitos: sintetizados via Web Audio API (royalty-free por natureza)
 *    - Vozes/narração: SpeechSynthesis do navegador (TTS placeholder)
 *
 *  Para usar áudios reais: coloque os arquivos em  assets/audio/  e preencha
 *  os caminhos abaixo. O AudioManager dá prioridade a arquivos quando existirem.
 * ---------------------------------------------------------------------------*/
window.PRIME_AUDIO_MANIFEST = {
  placeholder: true,
  music: { menu: null, adventure: null, victory: null },      // ex.: "assets/audio/music_menu.mp3"
  voice: {}                                                    // ex.: { "l1": "assets/audio/l1.mp3" }
};
