/* =============================================================================
 *  SubtitleManager — legendas sincronizadas (overlay DOM sobre o canvas)
 *  - Inglês como principal, tradução PT-BR opcional (Modo Professor)
 *  - Respeita acessibilidade (fonte grande, alto contraste)
 * ===========================================================================*/
window.SubtitleManager = {
  el: null,
  enEl: null,
  ptEl: null,

  ensure() {
    if (this.el) return;
    const wrap = document.createElement("div");
    wrap.id = "subtitle-bar";
    wrap.setAttribute("role", "region");
    wrap.setAttribute("aria-label", "Legendas");
    wrap.innerHTML = '<div class="sub-en"></div><div class="sub-pt"></div>';
    document.getElementById("game-container").appendChild(wrap);
    this.el = wrap;
    this.enEl = wrap.querySelector(".sub-en");
    this.ptEl = wrap.querySelector(".sub-pt");
    this.applyA11y();
  },

  applyA11y() {
    if (!this.el) return;
    const s = window.GameState.settings;
    this.el.classList.toggle("large-font", !!s.largeFont);
    this.el.classList.toggle("high-contrast", !!s.highContrast);
  },

  /* line = { en, pt }  ou  string */
  show(line) {
    this.ensure();
    const s = window.GameState.settings;
    if (!s.subtitles) { this.hide(); return; }
    const en = typeof line === "string" ? line : (line.en || "");
    const pt = typeof line === "string" ? "" : (line.pt || "");
    this.enEl.textContent = en;
    this.ptEl.textContent = (s.showTranslation && pt) ? pt : "";
    this.ptEl.style.display = (s.showTranslation && pt) ? "block" : "none";
    this.el.classList.add("visible");
    this.applyA11y();
  },

  hide() { if (this.el) this.el.classList.remove("visible"); },

  refresh() { this.applyA11y(); }
};
