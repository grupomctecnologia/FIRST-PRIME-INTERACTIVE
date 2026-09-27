/* =============================================================================
 *  PRIME TWO — Mission Map · lógica do mapa de progressão compartilhado.
 *  - 15 casas conectadas por uma trilha. Casa 1 -> Game 01, Casa 2 -> Game 02.
 *  - Cada jogo abre num <iframe> (mesma origem). A conclusão é detectada por
 *    polling: cena ativa "ResultScene" com gameOver falso = missão concluída
 *    (não altera os jogos). Ao concluir: salva, libera a próxima casa, mostra a
 *    conclusão e leva de volta ao mapa com o avatar avançando.
 *  - Casas 3–15 ficam bloqueadas até serem desenvolvidas (15 = Master).
 *  - Progresso salvo separadamente dos jogos (localStorage: prime2_map_v1).
 * ===========================================================================*/
(function () {
  "use strict";

  var CFG = window.MAP_CONFIG || {};
  var GAMES = CFG.games || { 1: "../game-01/index.html", 2: "../game-02/index.html" };
  var STORAGE_KEY = "prime2_map_v1";
  var STAGE_W = 1600, STAGE_H = 900;

  /* ---- posições das 15 casas (espaço 1600x900), formando uma trilha ---- */
  var NODES = [
    [250, 812], [430, 738], [372, 604], [548, 560], [694, 626],
    [636, 470], [478, 388], [702, 340], [884, 392], [852, 250],
    [1030, 300], [1196, 250], [1150, 120], [1330, 168], [1466, 120]
  ];

  /* ---- dados das casas (i18n) ---- */
  var HOUSES = {
    1: { game: 1, en: { name: "The English Adventure", desc: "Explore London, learn new words and complete every mission." },
                  es: { name: "La Aventura del Inglés", desc: "Explora Londres, aprende palabras nuevas y completa cada misión." } },
    2: { game: 2, en: { name: "London Shopping Mission", desc: "Go shopping in London across seven steps: find items, colours, sizes, prices and pay at the checkout." },
                  es: { name: "Misión de Compras en Londres", desc: "Ve de compras en Londres en siete pasos: artículos, colores, tallas, precios y paga en la caja." } }
  };

  var I18N = {
    en: { sub: "Mission Map", house: "HOUSE", master: "MASTER LEVEL", progress: "Progress",
      play: "▶ Play", replay: "↺ Play again", locked: "Locked", coming: "Coming soon",
      comingDesc: "This mission is being developed. Complete the unlocked houses to progress.",
      lockedDesc: "Complete the previous houses to unlock this one.",
      masterName: "Master Level", masterDesc: "Reach the top by completing every mission on the way.",
      close: "Close", backMap: "≡ Back to map", complete: "complete!", houseDone: "House %s complete!",
      returnMap: "Return to map", of: "of" },
    es: { sub: "Mapa de Misiones", house: "CASA", master: "NIVEL MASTER", progress: "Progreso",
      play: "▶ Jugar", replay: "↺ Jugar de nuevo", locked: "Bloqueada", coming: "Próximamente",
      comingDesc: "Esta misión está en desarrollo. Completa las casas liberadas para avanzar.",
      lockedDesc: "Completa las casas anteriores para desbloquear esta.",
      masterName: "Nivel Master", masterDesc: "Llega a la cima completando todas las misiones del camino.",
      close: "Cerrar", backMap: "≡ Volver al mapa", complete: "¡completa!", houseDone: "¡Casa %s completada!",
      returnMap: "Volver al mapa", of: "de" }
  };

  /* ---- estado / persistência ---- */
  var progress = { completed: {}, unlockedMax: 1, lang: "en" };
  function load() {
    try { var raw = localStorage.getItem(STORAGE_KEY); if (raw) { var p = JSON.parse(raw);
      progress.completed = p.completed || {}; progress.unlockedMax = p.unlockedMax || 1; progress.lang = p.lang || "en"; } } catch (e) {}
  }
  function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch (e) {} }
  function L() { return I18N[progress.lang] || I18N.en; }

  function stateOf(n) {
    if (progress.completed[n]) return "completed";
    if (n <= progress.unlockedMax) return "current";
    return "locked";
  }
  function currentHouse() {
    // avatar fica na casa liberada mais avançada
    var c = progress.unlockedMax; if (c > 15) c = 15; return c;
  }

  /* ---- DOM refs ---- */
  var stage, travellers, housesLayer, toastEl, poll = null, launchedHouse = null, completedThisLaunch = false, avatarAt = 1;

  function el(tag, cls, parent) { var e = document.createElement(tag); if (cls) e.className = cls; if (parent) parent.appendChild(e); return e; }

  /* ---- render ---- */
  function render(skipAvatar) {
    var t = L();
    // HUD textos
    document.getElementById("hud-sub").textContent = t.sub;
    var done = Object.keys(progress.completed).length;
    document.getElementById("progress-pill").textContent = t.progress + ": " + done + " / 15";
    document.getElementById("lang-btn").textContent = progress.lang === "es" ? "🇪🇸 ES" : "🇺🇸 EN";

    // casas
    housesLayer.innerHTML = "";
    for (var n = 1; n <= 15; n++) {
      var st = stateOf(n);
      var node = NODES[n - 1];
      var h = el("div", "house " + st + (n === 15 ? " master" : ""), housesLayer);
      h.style.left = (node[0] / STAGE_W * 100) + "%";
      h.style.top = (node[1] / STAGE_H * 100) + "%";
      var badge = el("div", "badge", h);
      badge.textContent = (n === 15 ? "★" : n);
      if (st === "completed") { var ck = el("div", "check", h); ck.textContent = "✓"; }
      if (st === "locked") { var lp = el("div", "lock-pin", h); lp.textContent = "🔒"; }
      var label = el("div", "label", h);
      label.textContent = houseTitle(n);
      var sub = el("div", "sub", h);
      sub.textContent = n === 15 ? t.master : (t.house + " " + n);
      (function (num) { h.addEventListener("click", function () { onHouse(num); }); })(n);
    }
    if (!skipAvatar) { positionTravellers(currentHouse(), false); avatarAt = currentHouse(); }
    drawPaths();
  }

  function houseTitle(n) {
    var t = L();
    if (n === 15) return t.masterName;
    var H = HOUSES[n];
    if (H) return H[progress.lang] ? H[progress.lang].name : H.en.name;
    return t.coming;
  }

  function drawPaths() {
    var svg = document.getElementById("paths");
    svg.setAttribute("viewBox", "0 0 " + STAGE_W + " " + STAGE_H);
    var d = "M " + NODES[0][0] + " " + NODES[0][1];
    for (var i = 1; i < NODES.length; i++) {
      var p0 = NODES[i - 1], p1 = NODES[i];
      var mx = (p0[0] + p1[0]) / 2;
      d += " Q " + mx + " " + p0[1] + " " + p1[0] + " " + p1[1];
    }
    svg.innerHTML =
      '<path d="' + d + '" fill="none" stroke="rgba(8,10,25,.55)" stroke-width="20" stroke-linecap="round"/>' +
      '<path d="' + d + '" fill="none" stroke="rgba(255,207,92,.85)" stroke-width="7" stroke-linecap="round" stroke-dasharray="2 16"/>';
  }

  /* ---- avatar ---- */
  function positionTravellers(house, animate) {
    var node = NODES[house - 1];
    travellers.style.left = (node[0] / STAGE_W * 100) + "%";
    travellers.style.top = (node[1] / STAGE_H * 100) + "%";
  }
  function walkTo(target, done) {
    var from = avatarAt, dir = target > from ? 1 : -1;
    var seq = []; for (var n = from + dir; dir > 0 ? n <= target : n >= target; n += dir) seq.push(n);
    var i = 0;
    travellers.style.transition = "left .5s ease-in-out, top .5s ease-in-out";
    function step() {
      if (i >= seq.length) { travellers.style.transition = ""; avatarAt = target; if (done) done(); return; }
      positionTravellers(seq[i], true); i++;
      setTimeout(step, 520);
    }
    if (seq.length === 0) { if (done) done(); return; }
    step();
  }

  /* ---- clique numa casa ---- */
  function onHouse(n) {
    var st = stateOf(n), t = L();
    if (st === "locked") { toast(t.locked + " · " + t.lockedDesc); return; }
    openModal(n, st);
  }

  function openModal(n, st) {
    var t = L(), H = HOUSES[n];
    var modal = document.getElementById("modal");
    document.getElementById("mc-num").textContent = n === 15 ? t.master : (t.house + " " + n);
    document.getElementById("mc-title").textContent = houseTitle(n);
    var desc = n === 15 ? t.masterDesc : (H ? (H[progress.lang] ? H[progress.lang].desc : H.en.desc) : t.comingDesc);
    document.getElementById("mc-desc").textContent = desc;
    var actions = document.getElementById("mc-actions"); actions.innerHTML = "";
    if (H && H.game) {
      var b = el("button", st === "completed" ? "mc-replay" : "mc-play", actions);
      b.textContent = st === "completed" ? t.replay : t.play;
      b.addEventListener("click", function () { closeModal(); launch(n); });
    } else {
      var info = el("button", "mc-replay", actions);
      info.textContent = t.coming; info.disabled = true; info.style.opacity = ".7"; info.style.cursor = "default";
    }
    var c = el("button", "mc-close", actions); c.textContent = t.close;
    c.addEventListener("click", closeModal);
    modal.classList.add("show");
  }
  function closeModal() { document.getElementById("modal").classList.remove("show"); }

  /* ---- lançar jogo (iframe) + detecção de conclusão ---- */
  function launch(house) {
    launchedHouse = house; completedThisLaunch = false;
    var t = L();
    document.getElementById("gb-title").textContent = (t.house + " " + house) + " · " + houseTitle(house);
    document.getElementById("done-banner").classList.remove("show");
    var frame = document.getElementById("game-frame");
    frame.src = GAMES[house];
    document.getElementById("game-overlay").classList.add("show");
    if (poll) clearInterval(poll);
    poll = setInterval(function () {
      try {
        var win = frame.contentWindow; if (!win || !win.PRIME_GAME) return;
        var scenes = win.PRIME_GAME.scene.getScenes(true); var key = null;
        for (var i = scenes.length - 1; i >= 0; i--) { if (scenes[i].scene.key) { key = scenes[i].scene.key; break; } }
        if (key === "ResultScene") {
          var rs = win.PRIME_GAME.scene.getScene("ResultScene");
          if (rs && !rs.gameOver && !completedThisLaunch) { completedThisLaunch = true; onGameComplete(house); }
        }
      } catch (e) { /* mesma origem esperada; ignora falhas transitórias */ }
    }, 600);
  }

  function onGameComplete(house) {
    if (!progress.completed[house]) {
      progress.completed[house] = true;
      if (house + 1 > progress.unlockedMax) progress.unlockedMax = Math.min(15, house + 1);
      save();
    }
    var t = L();
    document.getElementById("db-text").textContent = t.houseDone.replace("%s", house);
    document.getElementById("done-banner").classList.add("show");
  }

  function closeGame() {
    if (poll) { clearInterval(poll); poll = null; }
    var frame = document.getElementById("game-frame");
    frame.src = "about:blank";
    document.getElementById("game-overlay").classList.remove("show");
    document.getElementById("done-banner").classList.remove("show");
    // re-render mantendo o avatar onde estava, e então caminha até a casa liberada atual
    var newCurrent = currentHouse();
    render(true);
    if (newCurrent !== avatarAt) walkTo(newCurrent);
    else positionTravellers(avatarAt, false);
  }

  /* ---- toast ---- */
  var toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2600);
  }

  /* ---- escala do palco ---- */
  function fit() {
    var vw = window.innerWidth, vh = window.innerHeight;
    var scale = Math.min(vw / STAGE_W, vh / STAGE_H);
    stage.style.transform = "scale(" + scale + ")";
  }

  /* ---- idioma ---- */
  function toggleLang() { progress.lang = progress.lang === "es" ? "en" : "es"; save(); render(); }

  /* ---- init ---- */
  function init() {
    load();
    stage = document.getElementById("stage");
    travellers = document.getElementById("travellers");
    housesLayer = document.getElementById("houses");
    toastEl = document.getElementById("toast");

    // logo da marca
    if (window.PRIME_BRAND_LOGO) document.getElementById("brand-logo").src = window.PRIME_BRAND_LOGO;

    document.getElementById("lang-btn").addEventListener("click", toggleLang);
    document.getElementById("backMap").addEventListener("click", closeGame);
    document.getElementById("db-return").addEventListener("click", closeGame);

    // avatares
    var tr = travellers;
    tr.innerHTML = '<img class="alex" src="assets/avatar-alex.webp" alt="Alex">' +
                   '<img class="emma" src="assets/avatar-emma.webp" alt="Emma">';

    render();
    fit();
    window.addEventListener("resize", fit);
    window.addEventListener("orientationchange", function () { setTimeout(fit, 200); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  // expõe para testes headless
  window.PRIME_MAP = {
    get progress() { return progress; },
    stateOf: stateOf, currentHouse: currentHouse, launch: launch, closeGame: closeGame,
    onGameComplete: onGameComplete, toggleLang: toggleLang, render: render
  };
})();
