/* =============================================================================
 *  PRIME TWO — Mission Map · lógica do mapa de progressão compartilhado.
 *  - 15 casas conectadas por uma trilha (posições em % → layout fluido que
 *    preenche a tela em paisagem, sem barras laterais).
 *  - Casa 1 -> Game 01, Casa 2 -> Game 02. Cada jogo abre num <iframe> (mesma
 *    origem); a conclusão é detectada por polling da cena ativa "ResultScene"
 *    com gameOver falso (não altera os jogos).
 *  - Ao concluir: salva, libera a próxima casa e Alex/Emma CAMINHAM (passos
 *    visíveis) até a nova casa, que pulsa ao chegar e vira a casa atual.
 *  - Casas 3–15 bloqueadas até serem desenvolvidas (15 = Master).
 *  - Progresso salvo separado dos jogos (localStorage: prime2_map_v1).
 *  - Modo de demonstração da caminhada: ?previewWalk=1 (NÃO altera o progresso
 *    salvo do aluno) com botões para simular a conclusão das Casas 1 e 2.
 * ===========================================================================*/
(function () {
  "use strict";

  var CFG = window.MAP_CONFIG || {};
  var GAMES = CFG.games || { 1: "../game-01/index.html", 2: "../game-02/index.html" };
  var STORAGE_KEY = "prime2_map_v1";
  var DEMO = /[?&]previewWalk=1\b/.test(location.search);

  /* ---- posições das 15 casas em % (x,y) do palco, formando a trilha ---- */
  var NODES = [
    [12, 88], [27, 82], [15, 68], [31, 60], [44, 66],
    [33, 50], [21, 40], [40, 34], [55, 40], [50, 25],
    [64, 30], [77, 22], [67, 11], [83, 15], [92, 30]
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
  function load() { if (DEMO) return; try { var raw = localStorage.getItem(STORAGE_KEY); if (raw) { var p = JSON.parse(raw);
      progress.completed = p.completed || {}; progress.unlockedMax = p.unlockedMax || 1; progress.lang = p.lang || "en"; } } catch (e) {} }
  function save() { if (DEMO) return; try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch (e) {} }
  function L() { return I18N[progress.lang] || I18N.en; }

  function stateOf(n) {
    if (progress.completed[n]) return "completed";
    if (n <= progress.unlockedMax) return "current";
    return "locked";
  }
  function currentHouse() { var c = progress.unlockedMax; return c > 15 ? 15 : c; }

  var stage, travellers, housesLayer, toastEl, svg, houseEls = {},
      poll = null, launchedHouse = null, completedThisLaunch = false, avatarAt = 1, walking = false;

  function el(tag, cls, parent) { var e = document.createElement(tag); if (cls) e.className = cls; if (parent) parent.appendChild(e); return e; }
  function px(pct, dim) { return pct / 100 * dim; }

  /* ---- render ---- */
  function render(skipAvatar) {
    var t = L();
    document.getElementById("hud-sub").textContent = t.sub;
    var done = Object.keys(progress.completed).length;
    document.getElementById("progress-pill").textContent = t.progress + ": " + done + " / 15";
    document.getElementById("lang-btn").textContent = progress.lang === "es" ? "🇪🇸 ES" : "🇺🇸 EN";

    housesLayer.innerHTML = ""; houseEls = {};
    for (var n = 1; n <= 15; n++) {
      var st = stateOf(n), node = NODES[n - 1];
      var h = el("div", "house " + st + (n === 15 ? " master" : ""), housesLayer);
      h.style.left = node[0] + "%"; h.style.top = node[1] + "%";
      var badge = el("div", "badge", h);
      badge.textContent = (n === 15 ? "★" : n);
      if (st === "completed") { var ck = el("div", "check", h); ck.textContent = "✓"; }
      if (st === "locked") { var lp = el("div", "lock-pin", h); lp.textContent = "🔒"; }
      // nome só para casas concluídas/atual (evita sobreposição de rótulos)
      if (st !== "locked" || n === 15) {
        var label = el("div", "label", h);
        label.textContent = n === 15 ? t.masterName : houseTitle(n);
      }
      houseEls[n] = h;
      (function (num) { h.addEventListener("click", function () { onHouse(num); }); })(n);
    }
    if (!skipAvatar) { positionTravellers(currentHouse()); avatarAt = currentHouse(); }
    drawPaths();
  }

  function houseTitle(n) {
    var H = HOUSES[n];
    if (n === 15) return L().masterName;
    if (H) return H[progress.lang] ? H[progress.lang].name : H.en.name;
    return L().coming;
  }

  function stageSize() { return { w: stage.clientWidth, h: stage.clientHeight }; }

  function drawPaths() {
    var s = stageSize();
    svg.setAttribute("viewBox", "0 0 " + s.w + " " + s.h);
    svg.setAttribute("width", s.w); svg.setAttribute("height", s.h);
    var pt = function (i) { return [px(NODES[i][0], s.w), px(NODES[i][1], s.h)]; };
    var p0 = pt(0), d = "M " + p0[0] + " " + p0[1];
    for (var i = 1; i < NODES.length; i++) {
      var a = pt(i - 1), b = pt(i), mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - 18;
      d += " Q " + mx + " " + my + " " + b[0] + " " + b[1];
    }
    svg.innerHTML =
      '<path d="' + d + '" fill="none" stroke="rgba(6,9,22,.6)" stroke-width="18" stroke-linecap="round"/>' +
      '<path d="' + d + '" fill="none" stroke="rgba(255,207,92,.9)" stroke-width="6" stroke-linecap="round" stroke-dasharray="2 15"/>';
  }

  /* ---- avatar ---- */
  function positionTravellers(house) {
    var node = NODES[house - 1];
    travellers.style.transition = "";
    travellers.style.left = node[0] + "%"; travellers.style.top = node[1] + "%";
  }

  /* caminhada com passos visíveis ao longo da curva entre casas adjacentes */
  function walkTo(target, done) {
    if (walking) { if (done) done(); return; }
    var from = avatarAt;
    if (from === target) { positionTravellers(target); if (done) done(); return; }
    walking = true;
    travellers.classList.add("walking");
    if (target < from) travellers.classList.add("flip"); else travellers.classList.remove("flip");
    var seq = []; var dir = target > from ? 1 : -1;
    for (var n = from; dir > 0 ? n < target : n > target; n += dir) seq.push([n, n + dir]);
    var si = 0;
    function segment() {
      if (si >= seq.length) { arrive(target); return; }
      var a = NODES[seq[si][0] - 1], b = NODES[seq[si][1] - 1];
      var cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2 - 2; // controle da curva (em %)
      var STEPS = 26, k = 0;
      travellers.style.transition = "left .05s linear, top .05s linear";
      function step() {
        if (k > STEPS) { si++; segment(); return; }
        var u = k / STEPS, iu = 1 - u;
        var x = iu * iu * a[0] + 2 * iu * u * cx + u * u * b[0];
        var y = iu * iu * a[1] + 2 * iu * u * cy + u * u * b[1];
        travellers.style.left = x + "%"; travellers.style.top = y + "%";
        k++; setTimeout(step, 40);
      }
      step();
    }
    function arrive(house) {
      travellers.classList.remove("walking");
      travellers.style.transition = "";
      avatarAt = house; walking = false;
      var hEl = houseEls[house];
      if (hEl) { hEl.classList.add("arriving"); setTimeout(function () { if (hEl) hEl.classList.remove("arriving"); }, 1500); }
      if (done) done();
    }
    segment();
  }

  /* ---- clique numa casa ---- */
  function onHouse(n) {
    if (walking) return;
    var st = stateOf(n), t = L();
    if (st === "locked") { toast(t.locked + " · " + t.lockedDesc); return; }
    openModal(n, st);
  }
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
    } else {
      var info = el("button", "mc-replay", actions);
      info.textContent = t.coming; info.disabled = true; info.style.opacity = ".7"; info.style.cursor = "default";
    }
    var c = el("button", "mc-close", actions); c.textContent = t.close; c.addEventListener("click", closeModal);
    document.getElementById("modal").classList.add("show");
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
      } catch (e) {}
    }, 600);
  }
  function onGameComplete(house) {
    markComplete(house);
    var t = L();
    document.getElementById("db-text").textContent = t.houseDone.replace("%s", house);
    document.getElementById("done-banner").classList.add("show");
  }
  function markComplete(house) {
    if (!progress.completed[house]) {
      progress.completed[house] = true;
      if (house + 1 > progress.unlockedMax) progress.unlockedMax = Math.min(15, house + 1);
      save();
    }
  }
  function closeGame() {
    if (poll) { clearInterval(poll); poll = null; }
    document.getElementById("game-frame").src = "about:blank";
    document.getElementById("game-overlay").classList.remove("show");
    document.getElementById("done-banner").classList.remove("show");
    var newCurrent = currentHouse();
    render(true);
    if (newCurrent !== avatarAt) walkTo(newCurrent); else positionTravellers(avatarAt);
  }

  /* ---- toast ---- */
  var toastTimer = null;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2600); }

  function fit() { drawPaths(); }
  function toggleLang() { progress.lang = progress.lang === "es" ? "en" : "es"; save(); render(true); positionTravellers(avatarAt); }

  /* ---- modo demonstração da caminhada ---- */
  function demoComplete(house) {
    if (walking) return;
    // garante pré-requisito
    if (house === 2 && !progress.completed[1]) { progress.completed[1] = true; progress.unlockedMax = Math.max(progress.unlockedMax, 2); }
    var prevAvatar = avatarAt;
    progress.completed[house] = true;
    progress.unlockedMax = Math.min(15, Math.max(progress.unlockedMax, house + 1));
    render(true);                 // atualiza estados (destino vira "current")
    positionTravellers(prevAvatar);
    avatarAt = prevAvatar;
    walkTo(currentHouse());       // caminha com passos visíveis + pulso na chegada
  }
  function demoReset() {
    if (walking) return;
    progress.completed = {}; progress.unlockedMax = 1;
    render(); avatarAt = 1; positionTravellers(1);
  }
  function buildDemoBar() {
    var t = L();
    var bar = document.getElementById("demo-bar");
    bar.style.display = "flex";
    bar.innerHTML = '<span class="demo-title" id="demo-title"></span>';
    var mk = function (txt, fn) { var b = document.createElement("button"); b.className = "demo-btn"; b.textContent = txt; b.addEventListener("click", fn); bar.appendChild(b); return b; };
    document.getElementById("demo-title").textContent = t.demoTitle;
    mk(t.demo1, function () { demoComplete(1); });
    mk(t.demo2, function () { demoComplete(2); });
    mk(t.demoReset, demoReset);
  }

  /* ---- init ---- */
  function init() {
    load();
    stage = document.getElementById("stage");
    travellers = document.getElementById("travellers");
    housesLayer = document.getElementById("houses");
    toastEl = document.getElementById("toast");
    svg = document.getElementById("paths");
    if (window.PRIME_BRAND_LOGO) document.getElementById("brand-logo").src = window.PRIME_BRAND_LOGO;

    document.getElementById("lang-btn").addEventListener("click", toggleLang);
    document.getElementById("backMap").addEventListener("click", closeGame);
    document.getElementById("db-return").addEventListener("click", closeGame);

    travellers.innerHTML = '<img class="alex" src="assets/avatar-alex.webp" alt="Alex">' +
                           '<img class="emma" src="assets/avatar-emma.webp" alt="Emma">';

    render();
    fit();
    window.addEventListener("resize", fit);
    window.addEventListener("orientationchange", function () { setTimeout(fit, 200); });

    if (DEMO) buildDemoBar();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.PRIME_MAP = {
    get progress() { return progress; }, get demo() { return DEMO; },
    stateOf: stateOf, currentHouse: currentHouse, launch: launch, closeGame: closeGame,
    onGameComplete: onGameComplete, demoComplete: demoComplete, demoReset: demoReset,
    toggleLang: toggleLang, render: render, isWalking: function () { return walking; }
  };
})();
