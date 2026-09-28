/* =============================================================================
 *  Brand — renderiza o logotipo OFICIAL da First Prime.
 *  - Se o arquivo oficial estiver configurado em PRIME_BRAND → usa a imagem.
 *  - Senão → mostra um PLACEHOLDER TÉCNICO neutro (sem símbolo inventado)
 *    e a arte final do cabeçalho fica explicitamente EM ESPERA.
 *  NUNCA recria/estiliza a marca.
 * ===========================================================================*/
window.Brand = {
  /* Chamar no preload() das cenas que exibem o logo (carrega só se houver arquivo). */
  preload(scene) {
    const b = window.PRIME_BRAND || {};
    const tryLoad = (key, path) => {
      if (path && !scene.textures.exists(key)) {
        try { scene.load.image(key, path); } catch (e) {}
      }
    };
    tryLoad("brand_logo", b.logo);
    tryLoad("brand_logo_light", b.logoLight);
    tryLoad("brand_logo_dark", b.logoDark);
  },

  hasOfficial(scene) {
    return scene.textures.exists("brand_logo") ||
           scene.textures.exists("brand_logo_light") ||
           scene.textures.exists("brand_logo_dark");
  },

  /* Renderiza o logo (oficial ou placeholder) centralizado em (x,y),
     ajustado para caber em maxW × maxH. onDark=true escolhe a versão clara. */
  render(scene, x, y, maxW, maxH, opts = {}) {
    const T = window.Theme;
    const onDark = opts.onDark !== false; // jogo é tema escuro por padrão
    const c = scene.add.container(x, y);

    // 1) Logo OFICIAL, se disponível
    const key = onDark
      ? (scene.textures.exists("brand_logo_light") ? "brand_logo_light" : "brand_logo")
      : (scene.textures.exists("brand_logo_dark") ? "brand_logo_dark" : "brand_logo");

    if (scene.textures.exists(key)) {
      const img = scene.add.image(0, 0, key);
      const scale = Math.min(maxW / img.width, maxH / img.height);
      img.setScale(scale);
      // brilho circular atrás do logo: OPT-IN (evita "anel/Saturno" indesejado)
      if (opts.glow === true) {
        const gl = scene.add.graphics();
        gl.fillStyle(T.colors.accent2, 0.12);
        gl.fillCircle(0, 0, Math.max(img.displayWidth, img.displayHeight) * 0.62);
        gl.setBlendMode(Phaser.BlendModes.ADD);
        c.add(gl);
      }
      c.add(img);
      c.official = true;
      return c;
    }

    // 2) Fallback LIMPO (sem marcador técnico visível ao jogador): um wordmark
    //    neutro "FIRST PRIME". Nunca exibe texto de placeholder/instrução.
    const h = maxH;
    const t1 = scene.add.text(0, -h * 0.12, "FIRST PRIME", {
      fontFamily: T.font, fontSize: Math.max(14, Math.round(h * 0.26)) + "px",
      fontStyle: "bold", color: T.hex(T.colors.accent2), align: "center"
    }).setOrigin(0.5);
    t1.setShadow(0, 2, "rgba(0,0,0,0.6)", 6);
    const t2 = scene.add.text(0, h * 0.22, "INTERACTIVE", {
      fontFamily: T.font, fontSize: Math.max(10, Math.round(h * 0.14)) + "px",
      fontStyle: "bold", color: T.colors.text, align: "center"
    }).setOrigin(0.5);
    if (t2.setLetterSpacing) t2.setLetterSpacing(4);
    c.add(t1); c.add(t2);
    c.official = false;
    return c;
  }
};
