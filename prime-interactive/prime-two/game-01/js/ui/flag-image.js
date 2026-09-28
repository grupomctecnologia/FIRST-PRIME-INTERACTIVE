/* =============================================================================
 *  FlagImage — bandeiras OFICIAIS homologadas (First Prime) para a seleção de
 *  idioma. Usa EXCLUSIVAMENTE os arquivos oficiais:
 *    assets/flags/BANDEIRA_EUA_PRIME_TWO.png     (English)
 *    assets/flags/BANDEIRA_ESPANHA_PRIME_TWO.png (Español)
 *  Sem emojis, sem bandeiras desenhadas/recriadas por código.
 *
 *  Animação: balanço suave de tecido ao vento — rotação/oscilação/flutuação
 *  sutis (sem malha, sem distorção dos símbolos nacionais). Movimento automático
 *  contínuo (celular/tablet) e um pouco mais forte ao passar o mouse (setHover).
 *  Driver por setInterval (independente do render-loop) para animar sempre.
 *  Nenhum som é associado ao movimento.
 * ===========================================================================*/
window.FlagImage = {
  SRC: {
    us: "assets/flags/BANDEIRA_EUA_PRIME_TWO.png",
    es: "assets/flags/BANDEIRA_ESPANHA_PRIME_TWO.png"
  },
  KEY: { us: "flag_us", es: "flag_es" },

  /* Chamar no preload() da PreloadScene (carrega as duas bandeiras oficiais). */
  preload(scene) {
    Object.keys(this.SRC).forEach((code) => {
      const key = this.KEY[code];
      if (!scene.textures.exists(key)) { try { scene.load.image(key, this.SRC[code]); } catch (e) {} }
    });
  },

  ready(scene, code) { return scene.textures.exists(this.KEY[code]); },

  /* Bandeira ondulante ajustada a maxW x maxH em (x,y). Retorna um container com
     .setHover(bool). code = "us" | "es". */
  wave(scene, x, y, maxW, maxH, code, opts = {}) {
    const key = this.KEY[code];
    const c = scene.add.container(x, y);
    if (opts.depth != null) c.setDepth(opts.depth);
    if (!scene.textures.exists(key)) return c;   // graceful (não deve ocorrer após preload)

    const img = scene.add.image(0, 0, key).setOrigin(0.5);
    const s = Math.min(maxW / img.width, maxH / img.height);
    img.setScale(s);
    // sombra suave (silhueta da própria bandeira) para dar profundidade
    const sh = scene.add.image(3, 6, key).setOrigin(0.5).setScale(s).setTint(0x000000).setAlpha(0.16);
    c.add(sh); c.add(img);
    c._img = img; c._sh = sh;

    const BASE = opts.baseAmp != null ? opts.baseAmp : 0.02;   // ~1.1°
    const HOVER = opts.hoverAmp != null ? opts.hoverAmp : 0.05; // ~2.9°
    const st = { t: Math.random() * 6, amp: BASE, target: BASE, prev: Date.now() };
    c.setHover = (on) => { st.target = on ? HOVER : BASE; };

    const apply = () => {
      const rot = Math.sin(st.t * 1.25) * st.amp;
      const bob = Math.sin(st.t * 1.7) * (st.amp * 120);
      const flut = 1 + Math.sin(st.t * 2.2) * 0.014;
      img.rotation = rot; img.y = bob; img.setScale(s * flut, s);
      sh.rotation = rot; sh.y = bob + 6; sh.setScale(s * flut, s);
    };
    apply();   // pose inicial correta mesmo sem loop

    const step = () => {
      if (!scene.sys || !scene.sys.isActive()) { this._clear(c); return; }
      const now = Date.now(), dt = (now - st.prev) / 1000; st.prev = now;
      st.t += dt;
      st.amp += (st.target - st.amp) * 0.08;
      apply();
    };
    c._iv = setInterval(step, 33);
    scene.events.once("shutdown", () => this._clear(c));
    scene.events.once("destroy", () => this._clear(c));
    return c;
  },

  _clear(c) { if (c && c._iv) { clearInterval(c._iv); c._iv = null; } }
};
