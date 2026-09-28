/* =============================================================================
 *  AudioManager
 *  - Música de fundo (sintetizada via Web Audio API — royalty-free por natureza)
 *  - Efeitos sonoros (sintetizados)
 *  - Voz dos personagens / narração (SpeechSynthesis — TTS placeholder)
 *  - Controle de volume, mute e "repetir fala"
 *
 *  ⚠️ PLACEHOLDER: música/efeitos são gerados proceduralmente e as vozes usam o
 *  TTS do navegador. Para usar áudios REAIS, preencha PRIME_AUDIO_MANIFEST em
 *  js/data/content.js — o manager dá prioridade a arquivos quando existirem.
 * ===========================================================================*/
window.AudioManager = {
  ctx: null,
  masterGain: null,
  musicGain: null,
  sfxGain: null,
  _musicNodes: [],
  _musicTimer: null,
  _currentTrack: null,
  _lastUtterance: null,
  _voice: null,
  _fileCache: {},

  init() {
    if (this.ctx) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
      this.masterGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.musicGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
      this.musicGain.gain.value = 0.35;
      this.sfxGain.gain.value = 0.9;
      this.applyVolume();
    } catch (e) {
      console.warn("[AudioManager] Web Audio indisponível:", e);
    }
    this._pickVoice();
  },

  /* Deve ser chamado por um gesto do usuário (autoplay policy) */
  unlock() {
    this.init();
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
  },

  applyVolume() {
    if (!this.masterGain) return;
    const s = window.GameState.settings;
    this.masterGain.gain.value = s.muted ? 0 : s.volume;
  },
  setVolume(v) { window.GameState.settings.volume = Math.max(0, Math.min(1, v)); window.GameState.save(); this.applyVolume(); },
  toggleMute() { window.GameState.settings.muted = !window.GameState.settings.muted; window.GameState.save(); this.applyVolume(); return window.GameState.settings.muted; },

  /* ---- MÚSICA DE FUNDO (pad + arpejo procedural) ------------------------- */
  playMusic(track = "adventure") {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    if (this._currentTrack === track) return;
    this.stopMusic();
    this._currentTrack = track;

    /* Trilha original, atmosférica (aventura + mistério). Sem batida de
     * relógio: acordes sustentados que evoluem por uma progressão em tom menor,
     * baixo suave (nota longa, não percussivo) e melodia esparsa/variável. */
    const palettes = {
      // Am — Dm — E — Am (mistério calmo)  · menu
      menu:      { rootHz: 220.0, chordDur: 4.2, wave: "sine",     prog: [[0, 3, 7], [5, 8, 12], [7, 11, 14], [0, 3, 7]], mel: [0, 3, 5, 7, 10, 12] },
      // Am — F — C — G (aventura em tom menor) · briefing + jogo
      adventure: { rootHz: 196.0, chordDur: 3.6, wave: "triangle", prog: [[0, 3, 7], [8, 12, 15], [3, 7, 10], [10, 14, 17]], mel: [0, 2, 3, 5, 7, 10, 12] },
      // C — G — Am — F (triunfal) · resultado
      victory:   { rootHz: 261.63, chordDur: 2.6, wave: "triangle", prog: [[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]], mel: [0, 4, 7, 12, 16] }
    };
    const p = palettes[track] || palettes.adventure;
    const hz = (semi, octShift) => p.rootHz * Math.pow(2, (semi + (octShift || 0) * 12) / 12);

    let idx = 0;
    const playChord = () => {
      if (this._currentTrack !== track || !this.ctx) return;
      const t = this.ctx.currentTime, dur = p.chordDur;
      const chord = p.prog[idx % p.prog.length];

      // Pad sustentado (tríade uma oitava abaixo) — envelope suave (sem clique)
      chord.forEach((s) => {
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = "sine"; o.frequency.value = hz(s, -1);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.05, t + 0.7);
        g.gain.setValueAtTime(0.05, t + dur - 0.7);
        g.gain.linearRampToValueAtTime(0.0001, t + dur);
        o.connect(g); g.connect(this.musicGain); o.start(t); o.stop(t + dur + 0.05);
        this._musicNodes.push(o, g);
      });
      // Baixo grave e longo (não percussivo)
      const bo = this.ctx.createOscillator(), bg = this.ctx.createGain();
      bo.type = "sine"; bo.frequency.value = hz(chord[0], -2);
      bg.gain.setValueAtTime(0.0001, t);
      bg.gain.linearRampToValueAtTime(0.09, t + 0.4);
      bg.gain.linearRampToValueAtTime(0.0001, t + dur * 0.9);
      bo.connect(bg); bg.connect(this.musicGain); bo.start(t); bo.stop(t + dur + 0.05);
      this._musicNodes.push(bo, bg);

      // Melodia esparsa e variável (2–3 notas em tempos aleatórios)
      const notes = 2 + Math.floor(Math.random() * 2);
      for (let k = 0; k < notes; k++) {
        const deg = p.mel[Math.floor(Math.random() * p.mel.length)];
        const oct = Math.random() < 0.3 ? 1 : 0;
        const when = (0.4 + Math.random() * (dur - 0.9)) * 1000;
        setTimeout(() => { if (this._currentTrack === track) this._blip(hz(deg, oct), p.wave, 0.55, this.musicGain, 0.06); }, when);
      }
      idx++;
      this._musicTimer = setTimeout(playChord, dur * 1000);
    };
    playChord();
  },

  stopMusic() {
    this._currentTrack = null;
    if (this._musicTimer) { clearTimeout(this._musicTimer); this._musicTimer = null; }
    this._musicNodes.forEach(n => { try { if (n.stop) n.stop(); if (n.disconnect) n.disconnect(); } catch (e) {} });
    this._musicNodes = [];
  },

  _blip(freq, type, dur, dest, peak = 0.2) {
    if (!this.ctx) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type; o.frequency.value = freq;
    const t = this.ctx.currentTime;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest || this.sfxGain);
    o.start(t); o.stop(t + dur + 0.02);
  },

  /* ---- EFEITOS SONOROS --------------------------------------------------- */
  sfx(name) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    switch (name) {
      case "click":
        this._blip(660, "square", 0.08, this.sfxGain, 0.18); break;
      case "hover":
        // Silenciado de propósito: mover o cursor sobre botões/cartas disparava
        // "hover" repetidamente (pointerover), causando chiadeira contínua.
        break;
      case "correct": // arpejo maior ascendente
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
          setTimeout(() => this._blip(f, "triangle", 0.18, this.sfxGain, 0.22), i * 70)); break;
      case "wrong":   // descida grave
        this._blip(196, "sawtooth", 0.28, this.sfxGain, 0.22);
        setTimeout(() => this._blip(155.56, "sawtooth", 0.3, this.sfxGain, 0.2), 90); break;
      case "star":
        [1046.5, 1318.5, 1568].forEach((f, i) =>
          setTimeout(() => this._blip(f, "sine", 0.15, this.sfxGain, 0.18), i * 60)); break;
      case "transition":
        this._sweep(220, 880, 0.4); break;
      case "win":
        [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) =>
          setTimeout(() => this._blip(f, "triangle", 0.25, this.sfxGain, 0.24), i * 110)); break;
      case "lose":
        [392, 329.63, 261.63, 196].forEach((f, i) =>
          setTimeout(() => this._blip(f, "sawtooth", 0.3, this.sfxGain, 0.22), i * 130)); break;
      default: this._blip(440, "sine", 0.1, this.sfxGain, 0.12);
    }
  },

  _sweep(from, to, dur) {
    if (!this.ctx) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    const t = this.ctx.currentTime;
    o.type = "sine";
    o.frequency.setValueAtTime(from, t);
    o.frequency.exponentialRampToValueAtTime(to, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.18, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.sfxGain);
    o.start(t); o.stop(t + dur + 0.02);
  },

  /* ---- VOZ / NARRAÇÃO (TTS placeholder) ---------------------------------- */
  _pickVoice() {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.onvoiceschanged = () => {};
  },
  _voiceFor(lang) {
    if (!("speechSynthesis" in window)) return null;
    const voices = speechSynthesis.getVoices();
    const pref = lang === "es" ? /^es/i : /^en/i;
    const exact = lang === "es" ? /es[-_]ES/i : /en[-_]US/i;
    return voices.find(v => exact.test(v.lang)) || voices.find(v => pref.test(v.lang)) || voices[0] || null;
  },

  /* key: opcional, para futuro áudio real via manifest (voice[key]) */
  speak(text, opts = {}) {
    const s = window.GameState.settings;
    // Prioridade a arquivo real, se existir no manifesto
    const key = opts.key;
    const manifest = window.PRIME_AUDIO_MANIFEST || {};
    if (key && manifest.voice && manifest.voice[key]) {
      this._playFile(manifest.voice[key]);
      this._lastUtterance = { file: manifest.voice[key] };
      return;
    }
    if (!("speechSynthesis" in window) || s.muted) return;
    try {
      speechSynthesis.cancel();
      const lang = window.GameState.settings.lang || "en";
      const voiceLang = window.GameState.voiceLang ? window.GameState.voiceLang() : (lang === "es" ? "es-ES" : "en-US");
      const u = new SpeechSynthesisUtterance(text);
      const v = this._voiceFor(lang);
      if (v) u.voice = v;
      u.lang = voiceLang;
      u.rate = opts.rate || 0.98;
      u.pitch = opts.pitch != null ? opts.pitch : 1.0;
      u.volume = s.volume;
      if (opts.onend) u.onend = opts.onend;
      this._lastUtterance = { text, opts };
      speechSynthesis.speak(u);
    } catch (e) { /* TTS indisponível */ }
  },

  repeatLast() {
    if (!this._lastUtterance) return;
    if (this._lastUtterance.file) { this._playFile(this._lastUtterance.file); return; }
    this.speak(this._lastUtterance.text, this._lastUtterance.opts);
  },

  stopVoice() { if ("speechSynthesis" in window) { try { speechSynthesis.cancel(); } catch (e) {} } },

  _playFile(url) {
    if (!this.ctx) this.init();
    const s = window.GameState.settings;
    let a = this._fileCache[url];
    if (!a) { a = new Audio(url); this._fileCache[url] = a; }
    a.volume = s.muted ? 0 : s.volume;
    a.currentTime = 0;
    a.play().catch(() => {});
  }
};
