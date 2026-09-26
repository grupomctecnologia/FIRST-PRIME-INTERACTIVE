/* =============================================================================
 *  GameState — GAME 02 (London Shopping Mission). Single game (no modes).
 *  One language chosen at start (en|es). 3 lives. Wrong answer = lose a life +
 *  feedback + RETRY (the correct answer is never auto-revealed). Game over at 0.
 *  Adds COINS earned per correct answer (shopping theme).
 * ===========================================================================*/
window.GameState = {
  STORAGE_KEY: "prime2_game02_v1",

  phaseOrder: ["Vocabulary", "Listening", "Checkout", "Conversation", "Final"],
  START_LIVES: 3,
  COINS_PER_CORRECT: 10,

  session: null,

  settings: {
    lang: "en",              // "en" | "es" — chosen on the language screen
    subtitles: true,
    volume: 0.7,
    muted: false,
    largeFont: false,
    highContrast: false
  },

  init() { this.load(); this.applyLang(this.settings.lang); this.resetSession(); },

  applyLang(lang) {
    if (!window.PRIME_CONTENT_ALL || !window.PRIME_CONTENT_ALL[lang]) lang = "en";
    this.settings.lang = lang;
    window.PRIME_CONTENT = window.PRIME_CONTENT_ALL[lang];
  },
  setLang(lang) { this.applyLang(lang); this.save(); this.resetSession(); },
  voiceLang() { return (window.PRIME_CONTENT && window.PRIME_CONTENT.meta && window.PRIME_CONTENT.meta.voice) || (this.settings.lang === "es" ? "es-ES" : "en-US"); },

  resetSession() {
    this.session = {
      score: 0, coins: 0, correct: 0, wrongAttempts: 0, total: 0,
      lives: this.START_LIVES,
      phaseResults: {},        // { key: { total, wrong, stars } }
      startedAt: Date.now()
    };
  },

  _pr(phaseKey) {
    if (!this.session.phaseResults[phaseKey]) this.session.phaseResults[phaseKey] = { total: 0, wrong: 0, stars: 0 };
    return this.session.phaseResults[phaseKey];
  },

  /* Correct answer for a question (advances) — awards points + coins */
  registerCorrect(phaseKey) {
    this.session.total++; this.session.correct++; this.session.score += 100;
    this.session.coins += this.COINS_PER_CORRECT;
    this._pr(phaseKey).total++;
  },

  /* Wrong attempt: lose a life, allow retry (no reveal) */
  loseLife(phaseKey) {
    this.session.wrongAttempts++;
    this._pr(phaseKey).wrong++;
    if (this.session.lives !== Infinity) this.session.lives = Math.max(0, this.session.lives - 1);
  },

  /* Stars per phase from wrong attempts: 0→3, 1→2, else 1 */
  computePhaseStars(phaseKey) {
    const r = this.session.phaseResults[phaseKey];
    if (!r || r.total === 0) return 0;
    let s = 1;
    if (r.wrong <= 1) s = 2;
    if (r.wrong === 0) s = 3;
    r.stars = s;
    return s;
  },

  totalStars() { return this.phaseOrder.reduce((sum, k) => sum + (this.session.phaseResults[k]?.stars || 0), 0); },
  maxStars() { return this.phaseOrder.length * 3; },

  accuracy() {
    const denom = this.session.correct + this.session.wrongAttempts;
    if (denom === 0) return 0;
    return Math.round((this.session.correct / denom) * 100);
  },

  isGameOver() { return this.session.lives === 0; },

  save() {
    try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settings)); } catch (e) {}
  },
  load() {
    try { const raw = localStorage.getItem(this.STORAGE_KEY); if (raw) Object.assign(this.settings, JSON.parse(raw)); } catch (e) {}
  }
};
