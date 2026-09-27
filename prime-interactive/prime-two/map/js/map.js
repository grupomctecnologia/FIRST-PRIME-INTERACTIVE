/* =============================================================================
 *  PRIME TWO — Mission Map · lógica do mapa de progressão compartilhado.
 *  - 15 casas centradas nos MARCADORES do cenário (frações da imagem 1672x941),
 *    mapeadas pela transformação "cover" -> alinhadas à estrada em qualquer tela.
 *  - Casa 1 -> Game 01, Casa 2 -> Game 02. Conclusão detectada por polling da
 *    cena "ResultScene" (gameOver falso) no <iframe> — não altera os jogos.
 *  - Casas 3–15 bloqueadas para o aluno até serem desenvolvidas (15 = Master).
 *  - Progresso do aluno salvo em localStorage (prime2_map_v1).
 *
 *  MODO ADM / TESTE (botão "🛠 ADM" no HUD, ou ?adm=1 / ?previewWalk=1):
 *    - NÃO lê nem grava o progresso do aluno (opera só em memória).
 *    - Escolher qualquer casa inicial (1–15) e caminhar até qualquer outra.
 *    - Abrir diretamente o jogo das casas com jogo (1/2), mesmo "bloqueadas".
 *    - Simular a conclusão de uma casa: caminhada com passos + casa acendendo na
 *      chegada + 3 estrelas iluminando. Sequências rápidas 1→2, 2→3 e →10.
 * ===========================================================================*/
(function () {
  "use strict";

  var CFG = window.MAP_CONFIG || {};
  var GAMES = CFG.games || { 1: "../game-01/index.html", 2: "../game-02/index.html" };
  var STORAGE_KEY = "prime2_map_v1";
  var admMode = /(previewWalk=1|[?&]adm=1)/.test(location.search) || /(previewWalk|adm)/.test(location.hash);

  var IMG_W = 1672, IMG_H = 941;

  /* 15 casas em FRAÇÕES (fx,fy) — centradas nos marcadores pintados no cenário */
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
      admTitle: "ADM / Test mode — does not change student progress",
      admStart: "Start at", admWalkTo: "Walk to", admWalk: "▶ Walk", admComplete: "★ Complete & next",
      admOpen: "🎮 Open game", admReset: "↺ Reset", admNoGame: "No game on this house yet",
      admGoto: "→ House 10" },
    es: { sub: "Mapa de Misiones", house: "CASA", master: "MASTER", progress: "Progreso",
      play: "▶ Jugar", replay: "↺ Jugar de nuevo", locked: "Bloqueada", coming: "Próximamente",
      comingDesc: "Esta misión está en desarrollo. Completa las casas liberadas para avanzar.",
      lockedDesc: "Completa las casas anteriores para desbloquear esta.",
      masterName: "Nivel Master", masterDesc: "Llega a la cima completando todas las misiones del camino.",
      close: "Cerrar", houseDone: "¡Casa %s completada!", returnMap: "Volver al mapa",
      admTitle: "Modo ADM / Prueba — no cambia el progreso del alumno",
      admStart: "Empezar en", admWalkTo: "Caminar a", admWalk: "▶ Caminar", admComplete: "★ Completar y avanzar",
      admOpen: "🎮 Abrir juego", admReset: "↺ Reiniciar", admNoGame: "Esta casa aún no tiene juego",
      admGoto: "→ Casa 10" }
  };

  var progress = { completed: {}, unlockedMax: 1, lang: "en" };
  function load() { if (admMode) return; try { var raw = localStorage.getItem(STORAGE_KEY); if (raw) { var p = JSON.parse(raw);
      progress.completed = p.completed || {}; progress.unlockedMax = p.unlockedMax || 1; progress.lang = p.lang || "en"; } } catch (e) {} }
  function save() { if (admMode) return; try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch (e) {} }
  function L() { return I18N[progress.lang] || I18N.en; }

  function stateOf(n) { if (progress.completed[n]) return "completed"; if (n <= progress.unlockedMax) return "current"; return "locked"; }
  function currentHouse() { var c = progress.unlockedMax; return c > 15 ? 15 : c; }

  var stage, travellers, housesLayer, toastEl, houseEls = {}, starEls = {},
      poll = null, launchedHouse = null, completedThisLaunch = false, avatarAt = 1, walking = false,
      pathPts = [], nodeIdx = [];

  function el(tag, cls, parent) { var e = document.createElement(tag); if (cls) e.className = cls; if (parent) parent.appendChild(e); return e; }

  function coverPoint(f) {
    var w = stage.clientWidth, h = stage.clientHeight;
    var sc = Math.max(w / IMG_W, h / IMG_H);
    var rw = IMG_W * sc, rh = IMG_H * sc, ox = (w - rw) / 2, oy = (h - rh) / 2;
    return { x: ox + f[0] * rw, y: oy + f[1] * rh };
  }
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

  function render(skipAvatar) {
    var t = L();
    document.getElementById("hud-sub").textContent = t.sub;
    document.getElementById("progress-pill").textContent = t.progress + ": " + Object.keys(progress.completed).length + " / 15";
    document.getElementById("lang-btn").textContent = progress.lang === "es" ? "🇪🇸 ES" : "🇺🇸 EN";

    housesLayer.innerHTML = ""; houseEls = {}; starEls = {};
    for (var n = 1; n <= 15; n++) {
      var st = stateOf(n);
      var h = el("div", "house " + st + (n === 15 ? " master" : ""), housesLayer);
      var badge = el("div", "badge", h); badge.textContent = (n === 15 ? "★" : n);
      if (st === "completed") { var ck = el("div", "check", h); ck.textContent = "✓"; }
      if (st === "locked") { var lp = el("div", "lock-pin", h); lp.textContent = "🔒"; }
      if (st !== "locked" || n === 15) { var label = el("div", "label", h); label.textContent = n === 15 ? t.masterName : houseTitle(n); }
      // 3 estrelas (aparecem nas casas concluídas)
      var sc = el("div", "stars3", h); var spans = [];
      for (var s = 0; s < 3; s++) { var sp = el("span", "st" + (st === "completed" ? " on" : ""), sc); sp.textContent = "★"; spans.push(sp); }
      sc.style.visibility = (st === "completed") ? "visible" : "hidden";
      starEls[n] = { wrap: sc, spans: spans };
      houseEls[n] = h;
      (function (num) { h.addEventListener("click", function () { onHouse(num); }); })(n);
    }
    layout(skipAvatar);
  }

  function layout(skipAvatar) {
    buildPath();
    for (var n = 1; n <= 15; n++) {
      var e = houseEls[n]; if (!e) continue;
      var p = coverPoint(NODES[n - 1]);
      e.style.left = p.x + "px"; e.style.top = p.y + "px";
    }
    if (!skipAvatar && !walking) { positionTravellers(currentHouse()); avatarAt = currentHouse(); }
    else if (!walking) positionTravellers(avatarAt);
  }

  function houseTitle(n) { var H = HOUSES[n]; if (n === 15) return L().masterName; if (H) return H[progress.lang] ? H[progress.lang].name : H.en.name; return L().coming; }

  function positionTravellers(house) {
    var p = coverPoint(NODES[house - 1]);
    travellers.style.transition = "";
    travellers.style.left = p.x + "px"; travellers.style.top = p.y + "px";
  }

  /* caminhada com passos visíveis; onDone(house) ao chegar */
  function walkTo(target, onDone) {
    if (walking) { if (onDone) onDone(target); return; }
    var from = avatarAt;
    if (from === target) { positionTravellers(target); pulseHouse(target); if (onDone) onDone(target); return; }
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
      pulseHouse(house);
      if (onDone) onDone(house);
    }
    step();
  }
  function pulseHouse(house) {
    var hEl = houseEls[house];
    if (hEl) { hEl.classList.remove("arriving"); void hEl.offsetWidth; hEl.classList.add("arriving");
      setTimeout(function () { if (hEl) hEl.classList.remove("arriving"); }, 1500); }
  }
  /* ilumina as 3 estrelas de uma casa, uma a uma */
  function lightStars(house) {
    var s = starEls[house]; if (!s) return;
    s.wrap.style.visibility = "visible";
    s.spans.forEach(function (sp, i) { sp.classList.remove("on"); setTimeout(function () { sp.classList.add("on"); }, 160 + i * 220); });
  }

  function onHouse(n) {
    if (walking) return;
    var st = stateOf(n), t = L();
    if (st === "locked" && !admMode) { toast(t.locked + " · " + t.lockedDesc); return; }
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
    } else { var info = el("button", "mc-replay", actions); info.textContent = t.coming; info.disabled = true; info.style.opacity = ".7"; info.style.cursor = "default"; }
    var c = el("button", "mc-close", actions); c.textContent = t.close; c.addEventListener("click", closeModal);
    document.getElementById("modal").classList.add("show");
  }
  function closeModal() { document.getElementById("modal").classList.remove("show"); }

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
  function onGameComplete(house) {
    if (!admMode) markComplete(house);   // no ADM não grava progresso do aluno
    document.getElementById("db-text").textContent = L().houseDone.replace("%s", house);
    document.getElementById("done-banner").classList.add("show");
  }
  function markComplete(house) { if (!progress.completed[house]) { progress.completed[house] = true;
    if (house + 1 > progress.unlockedMax) progress.unlockedMax = Math.min(15, house + 1); save(); } }
  function closeGame() {
    if (poll) { clearInterval(poll); poll = null; }
    document.getElementById("game-frame").src = "about:blank";
    document.getElementById("game-overlay").classList.remove("show");
    document.getElementById("done-banner").classList.remove("show");
    if (admMode) { render(true); positionTravellers(avatarAt); return; }
    var newCurrent = currentHouse();
    render(true);
    if (newCurrent !== avatarAt) walkTo(newCurrent); else positionTravellers(avatarAt);
  }

  var toastTimer = null;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2600); }

  function fit() { if (walking) { layout(true); return; } render(true); positionTravellers(avatarAt); }
  function toggleLang() { progress.lang = progress.lang === "es" ? "en" : "es"; save(); render(true); positionTravellers(avatarAt); if (admMode) buildAdmPanel(); }

  /* ===================== MODO ADM / TESTE ===================== */
  function admSetProgress(current) {
    progress.completed = {}; for (var i = 1; i < current; i++) progress.completed[i] = true;
    progress.unlockedMax = current;
  }
  function admStart(n) {           // define a casa inicial (teleporte)
    if (walking) return;
    admSetProgress(n); render(true); avatarAt = n; positionTravellers(n);
  }
  function admWalk(target) {        // caminha da casa atual até 'target' (demonstração)
    if (walking) return;
    var from = avatarAt;
    // marca como concluídas as casas entre from e target (visual da progressão)
    var hi = Math.max(from, target);
    admSetProgress(hi >= target ? target : hi);
    // garante que a origem apareça concluída e o alvo como atual
    for (var i = 1; i < target; i++) progress.completed[i] = true;
    progress.unlockedMax = target;
    render(true); positionTravellers(from); avatarAt = from;
    walkTo(target);
  }
  function admCompleteNext() {      // conclui a casa atual (3 estrelas) e avança para a próxima
    if (walking) return;
    var cur = avatarAt;
    progress.completed[cur] = true; progress.unlockedMax = Math.min(15, Math.max(progress.unlockedMax, cur + 1));
    render(true); positionTravellers(cur); avatarAt = cur;
    pulseHouse(cur); lightStars(cur);           // casa acende + 3 estrelas iluminam
    if (cur >= 15) { toast("★★★"); return; }
    setTimeout(function () { walkTo(cur + 1); }, 1100);   // caminha até a próxima
  }
  function admOpenGame() {
    var H = HOUSES[avatarAt];
    if (H && H.game) launch(avatarAt); else toast(L().admNoGame);
  }
  function admReset() { if (walking) return; admStart(1); }

  function buildAdmPanel() {
    var t = L(), bar = document.getElementById("demo-bar");
    bar.style.display = "flex"; bar.innerHTML = "";
    var title = el("div", "demo-title", bar); title.textContent = t.admTitle;
    var mkSel = function (id) { var s = document.createElement("select"); s.id = id; s.className = "adm-sel";
      for (var i = 1; i <= 15; i++) { var o = document.createElement("option"); o.value = i; o.textContent = (i === 15 ? "15 ★" : i); s.appendChild(o); } return s; };
    var row1 = el("div", "adm-row", bar);
    var l1 = el("span", "adm-lab", row1); l1.textContent = t.admStart;
    var selStart = mkSel("adm-start"); row1.appendChild(selStart);
    var l2 = el("span", "adm-lab", row1); l2.textContent = t.admWalkTo;
    var selTo = mkSel("adm-to"); selTo.value = 2; row1.appendChild(selTo);
    var mkBtn = function (parent, txt, fn) { var b = document.createElement("button"); b.className = "demo-btn"; b.textContent = txt; b.addEventListener("click", fn); parent.appendChild(b); return b; };
    var row2 = el("div", "adm-row", bar);
    mkBtn(row2, t.admWalk, function () { admWalk(parseInt(selTo.value, 10)); });
    mkBtn(row2, t.admComplete, admCompleteNext);
    var row3 = el("div", "adm-row", bar);
    mkBtn(row3, t.admOpen, admOpenGame);
    mkBtn(row3, "1→2", function () { admStart(1); setTimeout(admCompleteNext, 250); });
    mkBtn(row3, "2→3", function () { admStart(2); setTimeout(admCompleteNext, 250); });
    mkBtn(row3, t.admGoto, function () { admWalk(10); });
    mkBtn(row3, t.admReset, admReset);
    selStart.addEventListener("change", function () { admStart(parseInt(selStart.value, 10)); });
  }
  function hideAdmPanel() { var bar = document.getElementById("demo-bar"); bar.style.display = "none"; bar.innerHTML = ""; }
  function toggleAdm() {
    admMode = !admMode; var btn = document.getElementById("demo-toggle");
    if (admMode) { admStart(1); buildAdmPanel(); if (btn) btn.classList.add("active"); }
    else { progress.completed = {}; progress.unlockedMax = 1; load(); hideAdmPanel(); render(); if (btn) btn.classList.remove("active"); }
  }

  function init() {
    load();
    stage = document.getElementById("stage");
    travellers = document.getElementById("travellers");
    housesLayer = document.getElementById("houses");
    toastEl = document.getElementById("toast");
    if (window.PRIME_BRAND_LOGO) document.getElementById("brand-logo").src = window.PRIME_BRAND_LOGO;
    document.getElementById("lang-btn").addEventListener("click", toggleLang);
    document.getElementById("demo-toggle").addEventListener("click", toggleAdm);
    document.getElementById("backMap").addEventListener("click", closeGame);
    document.getElementById("db-return").addEventListener("click", closeGame);
    travellers.innerHTML = '<img class="alex" src="assets/avatar-alex.webp" alt="Alex">' +
                           '<img class="emma" src="assets/avatar-emma.webp" alt="Emma">';
    render();
    window.addEventListener("resize", fit);
    window.addEventListener("orientationchange", function () { setTimeout(fit, 200); });
    var bg = document.getElementById("bg"); if (bg) { if (bg.complete) fit(); else bg.addEventListener("load", fit); }
    if (admMode) { admStart(1); buildAdmPanel(); var dt = document.getElementById("demo-toggle"); if (dt) dt.classList.add("active"); }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();

  window.PRIME_MAP = {
    get progress() { return progress; }, get adm() { return admMode; },
    stateOf: stateOf, currentHouse: currentHouse, launch: launch, closeGame: closeGame,
    onGameComplete: onGameComplete, toggleAdm: toggleAdm, toggleLang: toggleLang, render: render,
    admStart: admStart, admWalk: admWalk, admCompleteNext: admCompleteNext, admOpenGame: admOpenGame, admReset: admReset,
    isWalking: function () { return walking; }, _avatarAt: function () { return avatarAt; }
  };
})();
