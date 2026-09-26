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

    // Progressões harmônicas simples por faixa
    const palettes = {
      menu:      { root: 220.0, scale: [0, 3, 5, 7, 10], tempo: 2.2, wave: "sine" },   // Am pentatônica, calmo
      adventure: { root: 261.63, scale: [0, 2, 4, 7, 9], tempo: 1.4, wave: "triangle" }, // C maior, animado
      victory:   { root: 329.63, scale: [0, 4, 7, 11, 12], tempo: 1.0, wave: "sawtooth" }
    };
    const p = palettes[track] || palettes.adventure;

    // Pad de fundo (acorde sustentado suave)
    const padFreqs = [p.root / 2, (p.root / 2) * Math.pow(2, 4 / 12), (p.root / 2) * Math.pow(2, 7 / 12)];
    padFreqs.forEach(f => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = "sine"; o.frequency.value = f;
      g.gain.value = 0.06;
      o.connect(g); g.connect(this.musicGain); o.start();
      this._musicNodes.push(o, g);
    });

    // Arpejo rítmico
    let step = 0;
    const beat = () => {
      if (this._currentTrack !== track) return;
      const semis = p.scale[step % p.scale.length] + (step % (p.scale.length * 2) >= p.scale.length ? 12 : 0);
      const freq = p.root * Math.pow(2, semis / 12);
      this._blip(freq, p.wave, 0.16, this.musicGain, 0.12);
      step++;
      this._musicTimer = setTimeout(beat, (p.tempo / 2) * 1000);
    };
    beat();
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
        this._blip(880, "sine", 0.05, this.sfxGain, 0.08); break;
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
    const load = () => {
      const voices = speechSynthesis.getVoices();
      this._voice = voices.find(v => /en[-_]US/i.test(v.lang)) ||
                    voices.find(v => /^en/i.test(v.lang)) || voices[0] || null;
    };
    load();
    speechSynthesis.onvoiceschanged = load;
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
      const u = new SpeechSynthesisUtterance(text);
      if (this._voice) u.voice = this._voice;
      u.lang = "en-US";
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
