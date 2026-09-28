/* =============================================================================
 *  GameState — GAME 03 (London Underground Mystery). Single game (no modes).
 *  One language chosen at start (en|es). 3 lives. A wrong answer = lose a life
 *  + feedback + RETRY (the correct answer is NEVER auto-revealed). Game over at
 *  0 lives. COINS earned per correct answer.
 *
 *  STAR SYSTEM (time-based, per the mission brief):
 *    The headline 1–3 star rating comes from how fast the learner completes the
 *    Timed Final Challenge:
 *        up to 30s   -> ★★★ (3 stars)
 *        31s to 45s  -> ★★  (2 stars)
 *        over 45s    -> ★   (1 star)
 *    Per-step stars (from wrong attempts) are shown only on the "step complete"
 *    transition as encouragement; the final result uses the time rating.
 * ===========================================================================*/
window.GameState = {
  STORAGE_KEY: "prime2_game03_v1",

  // Six activities after the Mission Briefing (which is the Intro/step 1).
  phaseOrder: ["MemoryMatch", "WordBuilder", "MatchWordImage", "FollowDirection", "SentencePuzzle", "TimedChallenge"],
  START_LIVES: 3,
  COINS_PER_CORRECT: 10,

  // Time thresholds for the final challenge star rating (milliseconds)
  STAR_TIME_3: 30000,
  STAR_TIME_2: 45000,

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
  voiceLang() { return (window.PRIME_CONTENT && window.PRIME_CONTENT.meta && window.PRIME_CONTENT.meta.voice) || (this.settings.lang === "es" ? "es-ES" : "en-GB"); },

  resetSession() {
    this.session = {
      score: 0, coins: 0, correct: 0, wrongAttempts: 0, total: 0,
      lives: this.START_LIVES,
      phaseResults: {},        // { key: { total, wrong, stars } }
      challengeMs: null,       // Timed Final Challenge duration (ms)
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

  /* Per-step stars from wrong attempts (encouragement only): 0->3, 1->2, else 1 */
  computePhaseStars(phaseKey) {
    const r = this.session.phaseResults[phaseKey];
    if (!r || r.total === 0) return 0;
    let s = 1;
    if (r.wrong <= 1) s = 2;
    if (r.wrong === 0) s = 3;
    r.stars = s;
    return s;
  },

  /* Record the Timed Final Challenge duration (ms) */
  setChallengeTime(ms) { this.session.challengeMs = Math.max(0, Math.round(ms)); },
  challengeSeconds() { return this.session.challengeMs == null ? null : Math.round(this.session.challengeMs / 1000); },

  /* Headline star rating from the challenge time (falls back to full stars) */
  finalStars() {
    const ms = this.session.challengeMs;
    if (ms == null) return 3;
    if (ms <= this.STAR_TIME_3) return 3;
    if (ms <= this.STAR_TIME_2) return 2;
    return 1;
  },
  maxStars() { return 3; },

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
