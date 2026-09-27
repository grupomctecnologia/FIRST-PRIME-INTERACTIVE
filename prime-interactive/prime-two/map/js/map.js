/* =============================================================================
 *  PRIME TWO — Mission Map · lógica do mapa de progressão compartilhado.
 *  - 15 casas posicionadas SOBRE a estrada dourada do cenário. As posições são
 *    dadas em FRAÇÕES da imagem de fundo (1672x941) e mapeadas pela mesma
 *    transformação "cover" do <img>, de modo que casas, trilha e caminhada
 *    ficam sempre alinhadas à estrada em qualquer tela (iPhone/desktop).
 *  - A caminhada de Alex/Emma segue a estrada (spline Catmull-Rom pelos pontos
 *    da estrada), na ordem 1 → 2 → … → 15, chegando ao centro da casa, que
 *    acende/pulsa. Não há linha independente cruzando o cenário.
 *  - Casa 1 -> Game 01, Casa 2 -> Game 02. Conclusão detectada por polling da
 *    cena "ResultScene" (gameOver falso) no <iframe> — não altera os jogos.
 *  - Casas 3–15 bloqueadas até serem desenvolvidas (15 = Master).
 *  - Progresso salvo separado dos jogos (localStorage: prime2_map_v1).
 *  - Modo demo (botão "Demo" no HUD ou ?previewWalk=1): simula as caminhadas
 *    sem jogar e SEM alterar o progresso salvo.
 * ===========================================================================*/
(function () {
  "use strict";

  var CFG = window.MAP_CONFIG || {};
  var GAMES = CFG.games || { 1: "../game-01/index.html", 2: "../game-02/index.html" };
  var STORAGE_KEY = "prime2_map_v1";
  var demoMode = /previewWalk=1/.test(location.search) || /previewWalk/.test(location.hash);

  var IMG_W = 1672, IMG_H = 941;   // dimensões intrínsecas do fundo (map-bg)

  /* 15 casas em FRAÇÕES (fx,fy) da imagem — centradas nos MARCADORES pintados
     no cenário (estrelas + cadeados), lidas do arquivo original 1672x941. */
  var NODES = [
    [0.415, 0.828], [0.497, 0.847], [0.446, 0.628], [0.462, 0.480], [0.508, 0.378],
    [0.573, 0.572], [0.575, 0.272], [0.652, 0.352], [0.642, 0.242], [0.707, 0.267],
    [0.848, 0.309], [0.938, 0.297], [0.891, 0.252], [0.851, 0.207], [0.790, 0.152]
  ];

  var HOUSES = {
    1: { game: 1, en: { name: "The English Adventure", desc: "Explore London, learn new words and complete every mission." },
                  es: { name: "La Aventura del Inglés", desc: "Explora Londres, aprende palabras nuevas y completa cada misión." } },
    2: { game: 2, en: { name: "London Shopping Mission", desc: "Go shopping in London across seven steps: find items, colours, sizes, prices and pay at the checkout." },
                  es: { name: "Misión de Compras en Londres", desc: "Ve de compras en Londres en siete pasos: artículos, colores, tallas, precios y paga en la caja." } }
  };

  var I18N = {
    en: { sub: "Mission Map", house: "HOUSE", master: "MASTER", progress: "Progress",
      play: "▶ Play", replay: "↺ Play again", locked: "Locked", coming: "Coming soon",
      comingDesc: "This mission is being developed. Complete the unlocked houses to progress.",
      lockedDesc: "Complete the previous houses to unlock this one.",
      masterName: "Master Level", masterDesc: "Reach the top by completing every mission on the way.",
      close: "Close", houseDone: "House %s complete!", returnMap: "Return to map",
      demoTitle: "Preview walk demo — does not change saved progress",
      demo1: "▶ Complete House 1 (walk 1 → 2)", demo2: "▶ Complete House 2 (walk 2 → 3)", demoReset: "↺ Reset demo" },
    es: { sub: "Mapa de Misiones", house: "CASA", master: "MASTER", progress: "Progreso",
      play: "▶ Jugar", replay: "↺ Jugar de nuevo", locked: "Bloqueada", coming: "Próximamente",
      comingDesc: "Esta misión está en desarrollo. Completa las casas liberadas para avanzar.",
      lockedDesc: "Completa las casas anteriores para desbloquear esta.",
      masterName: "Nivel Master", masterDesc: "Llega a la cima completando todas las misiones del camino.",
      close: "Cerrar", houseDone: "¡Casa %s completada!", returnMap: "Volver al mapa",
      demoTitle: "Demo de caminata — no cambia el progreso guardado",
      demo1: "▶ Completar Casa 1 (camina 1 → 2)", demo2: "▶ Completar Casa 2 (camina 2 → 3)", demoReset: "↺ Reiniciar demo" }
  };

  var progress = { completed: {}, unlockedMax: 1, lang: "en" };
  function load() { if (demoMode) return; try { var raw = localStorage.getItem(STORAGE_KEY); if (raw) { var p = JSON.parse(raw);
      progress.completed = p.completed || {}; progress.unlockedMax = p.unlockedMax || 1; progress.lang = p.lang || "en"; } } catch (e) {} }
  function save() { if (demoMode) return; try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch (e) {} }
  function L() { return I18N[progress.lang] || I18N.en; }

  function stateOf(n) { if (progress.completed[n]) return "completed"; if (n <= progress.unlockedMax) return "current"; return "locked"; }
  function currentHouse() { var c = progress.unlockedMax; return c > 15 ? 15 : c; }

  var stage, travellers, housesLayer, toastEl, houseEls = {},
      poll = null, launchedHouse = null, completedThisLaunch = false, avatarAt = 1, walking = false,
      pathPts = [], nodeIdx = [];

  function el(tag, cls, parent) { var e = document.createElement(tag); if (cls) e.className = cls; if (parent) parent.appendChild(e); return e; }

  /* ---- mapeamento cover (fração da imagem -> px do palco) ---- */
  function coverPoint(f) {
    var w = stage.clientWidth, h = stage.clientHeight;
    var sc = Math.max(w / IMG_W, h / IMG_H);
    var rw = IMG_W * sc, rh = IMG_H * sc, ox = (w - rw) / 2, oy = (h - rh) / 2;
    return { x: ox + f[0] * rw, y: oy + f[1] * rh };
  }

  /* ---- spline Catmull-Rom pela estrada (para a caminhada) ---- */
  function catmull(p0, p1, p2, p3, u) {
    var u2 = u * u, u3 = u2 * u;
    return {
      x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * u + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * u2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * u3),
      y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * u + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * u2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * u3)
    };
  }
  function buildPath() {
    var pts = NODES.map(coverPoint), SEG = 18;
    pathPts = []; nodeIdx = [];
    for (var i = 0; i < pts.length - 1; i++) {
      nodeIdx[i] = pathPts.length;
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || pts[i + 1];
      for (var t = 0; t < SEG; t++) pathPts.push(catmull(p0, p1, p2, p3, t / SEG));
    }
    nodeIdx[pts.length - 1] = pathPts.length; pathPts.push(pts[pts.length - 1]);
  }

  /* ---- render (DOM das casas) + layout (posições em px) ---- */
  function render(skipAvatar) {
    var t = L();
    document.getElementById("hud-sub").textContent = t.sub;
    document.getElementById("progress-pill").textContent = t.progress + ": " + Object.keys(progress.completed).length + " / 15";
    document.getElementById("lang-btn").textContent = progress.lang === "es" ? "🇪🇸 ES" : "🇺🇸 EN";

    housesLayer.innerHTML = ""; houseEls = {};
    for (var n = 1; n <= 15; n++) {
      var st = stateOf(n);
      var h = el("div", "house " + st + (n === 15 ? " master" : ""), housesLayer);
      var badge = el("div", "badge", h); badge.textContent = (n === 15 ? "★" : n);
      if (st === "completed") { var ck = el("div", "check", h); ck.textContent = "✓"; }
      if (st === "locked") { var lp = el("div", "lock-pin", h); lp.textContent = "🔒"; }
      if (st !== "locked" || n === 15) { var label = el("div", "label", h); label.textContent = n === 15 ? t.masterName : houseTitle(n); }
      houseEls[n] = h;
      (function (num) { h.addEventListener("click", function () { onHouse(num); }); })(n);
    }
    layout(skipAvatar);
  }

  function layout(skipAvatar) {
    buildPath();
    for (var n = 1; n <= 15; n++) {
      var el2 = houseEls[n]; if (!el2) continue;
      var p = coverPoint(NODES[n - 1]);
      el2.style.left = p.x + "px"; el2.style.top = p.y + "px";
    }
    if (!skipAvatar && !walking) { positionTravellers(currentHouse()); avatarAt = currentHouse(); }
    else if (!walking) positionTravellers(avatarAt);
  }

  function houseTitle(n) { var H = HOUSES[n]; if (n === 15) return L().masterName; if (H) return H[progress.lang] ? H[progress.lang].name : H.en.name; return L().coming; }

  /* ---- avatar ---- */
  function positionTravellers(house) {
    var p = coverPoint(NODES[house - 1]);
    travellers.style.transition = "";
    travellers.style.left = p.x + "px"; travellers.style.top = p.y + "px";
  }
  function walkTo(target, done) {
    if (walking) { if (done) done(); return; }
    var from = avatarAt;
    if (from === target) { positionTravellers(target); if (done) done(); return; }
    walking = true; travellers.classList.add("walking");
    if (target < from) travellers.classList.add("flip"); else travellers.classList.remove("flip");
    var iStart = nodeIdx[from - 1], iEnd = nodeIdx[target - 1];
    var dir = iEnd > iStart ? 1 : -1, idx = iStart;
    travellers.style.transition = "left .05s linear, top .05s linear";
    function step() {
      if ((dir > 0 && idx > iEnd) || (dir < 0 && idx < iEnd)) return arrive(target);
      var pt = pathPts[idx]; if (pt) { travellers.style.left = pt.x + "px"; travellers.style.top = pt.y + "px"; }
      idx += dir; setTimeout(step, 30);
    }
    function arrive(house) {
      travellers.classList.remove("walking"); travellers.style.transition = "";
      positionTravellers(house); avatarAt = house; walking = false;
      var hEl = houseEls[house];
      if (hEl) { hEl.classList.add("arriving"); setTimeout(function () { if (hEl) hEl.classList.remove("arriving"); }, 1500); }
      if (done) done();
    }
    step();
  }

  /* ---- clique / modal ---- */
  function onHouse(n) { if (walking) return; var st = stateOf(n), t = L();
    if (st === "locked") { toast(t.locked + " · " + t.lockedDesc); return; } openModal(n, st); }
  function openModal(n, st) {
    var t = L(), H = HOUSES[n];
    document.getElementById("mc-num").textContent = n === 15 ? t.master : (t.house + " " + n);
    document.getElementById("mc-title").textContent = houseTitle(n);
    document.getElementById("mc-desc").textContent = n === 15 ? t.masterDesc : (H ? (H[progress.lang] ? H[progress.lang].desc : H.en.desc) : t.comingDesc);
    var actions = document.getElementById("mc-actions"); actions.innerHTML = "";
    if (H && H.game) {
      var b = el("button", st === "completed" ? "mc-replay" : "mc-play", actions);
      b.textContent = st === "completed" ? t.replay : t.play;
      b.addEventListener("click", function () { closeModal(); launch(n); });
    } else { var info = el("button", "mc-replay", actions); info.textContent = t.coming; info.disabled = true; info.style.opacity = ".7"; info.style.cursor = "default"; }
    var c = el("button", "mc-close", actions); c.textContent = t.close; c.addEventListener("click", closeModal);
    document.getElementById("modal").classList.add("show");
  }
  function closeModal() { document.getElementById("modal").classList.remove("show"); }

  /* ---- lançar jogo + detecção ---- */
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
        if (key === "ResultScene") { var rs = win.PRIME_GAME.scene.getScene("ResultScene");
          if (rs && !rs.gameOver && !completedThisLaunch) { completedThisLaunch = true; onGameComplete(house); } }
      } catch (e) {}
    }, 600);
  }
  function onGameComplete(house) { markComplete(house);
    document.getElementById("db-text").textContent = L().houseDone.replace("%s", house);
    document.getElementById("done-banner").classList.add("show"); }
  function markComplete(house) { if (!progress.completed[house]) { progress.completed[house] = true;
    if (house + 1 > progress.unlockedMax) progress.unlockedMax = Math.min(15, house + 1); save(); } }
  function closeGame() {
    if (poll) { clearInterval(poll); poll = null; }
    document.getElementById("game-frame").src = "about:blank";
    document.getElementById("game-overlay").classList.remove("show");
    document.getElementById("done-banner").classList.remove("show");
    var newCurrent = currentHouse();
    render(true);
    if (newCurrent !== avatarAt) walkTo(newCurrent); else positionTravellers(avatarAt);
  }

  var toastTimer = null;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2600); }

  function fit() { if (walking) { layout(true); return; } render(true); positionTravellers(avatarAt); }
  function toggleLang() { progress.lang = progress.lang === "es" ? "en" : "es"; save(); render(true); positionTravellers(avatarAt); }

  /* ---- modo demonstração ---- */
  function demoComplete(house) {
    if (walking) return;
    if (house === 2 && !progress.completed[1]) { progress.completed[1] = true; progress.unlockedMax = Math.max(progress.unlockedMax, 2); }
    var prevAvatar = avatarAt;
    progress.completed[house] = true;
    progress.unlockedMax = Math.min(15, Math.max(progress.unlockedMax, house + 1));
    render(true); positionTravellers(prevAvatar); avatarAt = prevAvatar;
    walkTo(currentHouse());
  }
  function demoReset() { if (walking) return; progress.completed = {}; progress.unlockedMax = 1; render(); avatarAt = 1; positionTravellers(1); }
  function buildDemoBar() {
    var t = L(), bar = document.getElementById("demo-bar");
    bar.style.display = "flex"; bar.innerHTML = '<span class="demo-title" id="demo-title"></span>';
    var mk = function (txt, fn) { var b = document.createElement("button"); b.className = "demo-btn"; b.textContent = txt; b.addEventListener("click", fn); bar.appendChild(b); };
    document.getElementById("demo-title").textContent = t.demoTitle;
    mk(t.demo1, function () { demoComplete(1); }); mk(t.demo2, function () { demoComplete(2); }); mk(t.demoReset, demoReset);
  }
  function hideDemoBar() { var bar = document.getElementById("demo-bar"); bar.style.display = "none"; bar.innerHTML = ""; }
  function toggleDemo() {
    demoMode = !demoMode; var btn = document.getElementById("demo-toggle");
    if (demoMode) { progress.completed = {}; progress.unlockedMax = 1; render(); avatarAt = 1; positionTravellers(1); buildDemoBar(); if (btn) btn.classList.add("active"); }
    else { progress.completed = {}; progress.unlockedMax = 1; load(); hideDemoBar(); render(); if (btn) btn.classList.remove("active"); }
  }

  /* ---- init ---- */
  function init() {
    load();
    stage = document.getElementById("stage");
    travellers = document.getElementById("travellers");
    housesLayer = document.getElementById("houses");
    toastEl = document.getElementById("toast");
    if (window.PRIME_BRAND_LOGO) document.getElementById("brand-logo").src = window.PRIME_BRAND_LOGO;
    document.getElementById("lang-btn").addEventListener("click", toggleLang);
    document.getElementById("demo-toggle").addEventListener("click", toggleDemo);
    document.getElementById("backMap").addEventListener("click", closeGame);
    document.getElementById("db-return").addEventListener("click", closeGame);
    travellers.innerHTML = '<img class="alex" src="assets/avatar-alex.webp" alt="Alex">' +
                           '<img class="emma" src="assets/avatar-emma.webp" alt="Emma">';
    render();
    window.addEventListener("resize", fit);
    window.addEventListener("orientationchange", function () { setTimeout(fit, 200); });
    // reajusta após o fundo carregar (garante alinhamento com a estrada)
    var bg = document.getElementById("bg"); if (bg) { if (bg.complete) fit(); else bg.addEventListener("load", fit); }
    if (demoMode) { buildDemoBar(); var dt = document.getElementById("demo-toggle"); if (dt) dt.classList.add("active"); }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();

  window.PRIME_MAP = {
    get progress() { return progress; }, get demo() { return demoMode; },
    stateOf: stateOf, currentHouse: currentHouse, launch: launch, closeGame: closeGame,
    onGameComplete: onGameComplete, demoComplete: demoComplete, demoReset: demoReset,
    toggleDemo: toggleDemo, toggleLang: toggleLang, render: render, isWalking: function () { return walking; },
    _nodePx: function (n) { return coverPoint(NODES[n - 1]); }, _avatarAt: function () { return avatarAt; }
  };
})();
