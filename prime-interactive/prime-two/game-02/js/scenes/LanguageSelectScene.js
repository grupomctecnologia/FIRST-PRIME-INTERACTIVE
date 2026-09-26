/* Language selection (Game 02) — the ONLY screen that shows both languages.
 * Picking one makes the WHOLE experience run in that language. */
class LanguageSelectScene extends Phaser.Scene {
  constructor() { super("LanguageSelectScene"); }

  create() {
    const T = window.Theme, w = this.scale.width, h = this.scale.height;
    this._chosen = false;   // reset por visita (instância reutilizada pelo Phaser)
    window.SubtitleManager.hide();
    T.scene(this, "home");

    const unlock = () => window.AudioManager.unlock();
    this.input.once("pointerdown", unlock);

    window.Brand.render(this, w / 2, 78, 214, 118, { onDark: true });
    const pt = this.add.text(w / 2, 164, "PRIME TWO", { fontFamily: T.font, fontSize: "30px", fontStyle: "bold", color: T.colors.text }).setOrigin(0.5);
    pt.setShadow(0, 3, "rgba(0,0,0,0.55)", 10, true, true);
    pt.setLetterSpacing && pt.setLetterSpacing(3);
    // Bilingual prompt is acceptable ONLY on this language-choice screen
    this.add.text(w / 2, 200, "Choose your language  ·  Elige tu idioma", {
      fontFamily: T.font, fontSize: "17px", fontStyle: "bold", color: T.hex(T.colors.accent2)
    }).setOrigin(0.5).setShadow(0, 2, "rgba(0,0,0,0.85)", 6);

    this.makeLangButton(w / 2 - 250, 372, "us", "ENGLISH", "PLAY", T.colors.accent, 0x6b8bff, "en");
    this.makeLangButton(w / 2 + 250, 372, "es", "ESPAÑOL", "JUGAR", T.colors.accent2, 0xff9f43, "es");

    this.add.text(w / 2, h - 22, "First Prime Interactive — London Shopping Mission", {
      fontFamily: T.font, fontSize: "12px", color: T.colors.textDim
    }).setOrigin(0.5).setShadow(0, 1, "rgba(0,0,0,0.9)", 4);
  }

  makeLangButton(x, y, flag, name, action, c1, c2, lang) {
    const T = window.Theme;
    const cw = 460, ch = 250;
    const c = this.add.container(x, y);
    const g = this.add.graphics();
    const draw = (hover) => {
      g.clear();
      g.fillStyle(0x000000, 0.3); g.fillRoundedRect(-cw / 2 + 4, -ch / 2 + 8, cw, ch, 24);
      g.fillStyle(T.colors.panelLight, hover ? 1 : 0.94); g.fillRoundedRect(-cw / 2, -ch / 2, cw, ch, 24);
      g.lineStyle(hover ? 5 : 3, c1, hover ? 1 : 0.6); g.strokeRoundedRect(-cw / 2, -ch / 2, cw, ch, 24);
      g.fillStyle(0xffffff, 0.05); g.fillRoundedRect(-cw / 2, -ch / 2, cw, ch * 0.4, { tl: 24, tr: 24, bl: 0, br: 0 });
    };
    draw(false); c.add(g);
    window.Flags.draw(this, x, y - 56, 152, 100, flag);
    c.add(this.add.text(0, 40, name, { fontFamily: T.font, fontSize: "34px", fontStyle: "bold", color: T.colors.text }).setOrigin(0.5));
    const pill = this.add.graphics();
    pill.fillGradientStyle(c1, c1, c2, c2, 1); pill.fillRoundedRect(-120, ch / 2 - 62, 240, 46, 23);
    c.add(pill);
    c.add(this.add.text(0, ch / 2 - 39, "▶  " + action, { fontFamily: T.font, fontSize: "22px", fontStyle: "bold", color: "#06121f" }).setOrigin(0.5));

    c.setSize(cw, ch);
    const hit = this.add.zone(0, 0, cw, ch).setOrigin(0.5).setInteractive({ useHandCursor: true });
    c.add(hit);
    hit.on("pointerover", () => { draw(true); window.AudioManager.sfx("hover"); });
    hit.on("pointerout", () => draw(false));
    hit.on("pointerup", () => this.choose(lang));
    return c;
  }

  choose(lang) {
    if (this._chosen) return; this._chosen = true;
    window.AudioManager.unlock();
    window.AudioManager.sfx("transition");
    window.GameState.setLang(lang);
    this.scene.start("MenuScene");
  }
}
window.LanguageSelectScene = LanguageSelectScene;
