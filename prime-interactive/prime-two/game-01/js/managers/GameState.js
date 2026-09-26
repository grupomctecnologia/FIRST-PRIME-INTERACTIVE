/* =============================================================================
 *  GameState — estado global do jogo + configurações persistentes
 * ===========================================================================*/
window.GameState = {
  STORAGE_KEY: "prime2_game01_v1",

  /* Ordem das fases jogáveis (Fase 1 é a intro, tratada à parte) */
  phaseOrder: ["Vocabulary", "Listening", "Conversation", "Language", "Final"],

  /* Estado de sessão (zerado a cada partida) */
  session: null,

  /* Configurações persistentes (interface 100% em inglês — sem tradução) */
  settings: {
    mode: "teacher",         // "teacher" (Teacher Mode) | "challenge" (Challenge Mode)
    subtitles: true,         // English subtitles visible
    volume: 0.7,             // 0..1
    muted: false,
    largeFont: false,        // accessibility
    highContrast: false
  },

  init() {
    this.load();
    this.resetSession();
  },

  resetSession() {
    this.session = {
      score: 0,
      stars: 0,
      lives: this.settings.mode === "challenge" ? 3 : Infinity,
      correct: 0,
      wrong: 0,
      total: 0,
      phaseResults: {},      // { phaseKey: {correct, total, stars} }
      startedAt: Date.now()
    };
  },

  setMode(mode) {
    this.settings.mode = mode;
    if (mode === "teacher") {
      this.settings.subtitles = true;   // subtitles always on in Teacher Mode
    }
    this.save();
    this.resetSession();
  },

  /* Pontuação -------------------------------------------------------------- */
  addScore(points) { this.session.score += points; },

  registerAnswer(correct, phaseKey) {
    this.session.total++;
    const r = this.session.phaseResults[phaseKey] || { correct: 0, total: 0, stars: 0 };
    r.total++;
    if (correct) {
      this.session.correct++; r.correct++;
      this.addScore(100);
    } else {
      this.session.wrong++;
      if (this.settings.mode === "challenge" && this.session.lives !== Infinity) {
        this.session.lives = Math.max(0, this.session.lives - 1);
      }
    }
    this.session.phaseResults[phaseKey] = r;
  },

  /* Estrelas por fase: 3 = perfeito, 2 = >=60%, 1 = concluiu */
  computePhaseStars(phaseKey) {
    const r = this.session.phaseResults[phaseKey];
    if (!r || r.total === 0) return 0;
    const ratio = r.correct / r.total;
    let s = 1;
    if (ratio >= 0.6) s = 2;
    if (ratio >= 0.999) s = 3;
    r.stars = s;
    return s;
  },

  totalStars() {
    return this.phaseOrder.reduce((sum, k) => sum + (this.session.phaseResults[k]?.stars || 0), 0);
  },
  maxStars() { return this.phaseOrder.length * 3; },

  accuracy() {
    if (this.session.total === 0) return 0;
    return Math.round((this.session.correct / this.session.total) * 100);
  },

  isGameOver() {
    return this.settings.mode === "challenge" && this.session.lives === 0;
  },

  /* Persistência ----------------------------------------------------------- */
  save() {
    try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settings)); }
    catch (e) { /* localStorage indisponível — segue sem persistir */ }
  },
  load() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) Object.assign(this.settings, JSON.parse(raw));
    } catch (e) { /* ignore */ }
  }
};
