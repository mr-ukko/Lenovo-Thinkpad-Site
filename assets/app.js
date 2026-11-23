(function () {
  var all = window.THINKPAD || {};
  var key = Object.keys(all)[0];          // each subdomain site loads exactly one brand
  var D = all[key], S = D.site, M = D.models;
  document.body.classList.add("brand-" + key);

  var el = function (t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  // Site root derived from this script's own URL (works locally and on the custom domain)
  var me = document.currentScript.src;
  var root = me.slice(0, me.lastIndexOf("/assets/")) + "/";
  var modelUrl = function (id) { return root + id + "/"; };

  function mount(active) {
    var app = document.getElementById("app");
    var h = el("header", "site-header");
    h.innerHTML = '<div class="wrap"><a class="brand" href="' + root + '">Think<b>Pad</b><span class="era">' + esc(S.label) + "</span></a>" +
      '<nav class="nav"><a href="' + root + '"' + (active === "home" ? ' class="active"' : "") + '>Home</a>' +
      '<a href="' + root + '#models">Models</a>' +
      '<a href="' + esc(S.other.url) + '">' + esc(S.other.name) + "</a>" +
      '<a href="' + esc(S.main) + '">thinkpad.fi</a></nav></div>';
    document.body.insertBefore(h, app);
    var f = el("footer", "site-footer");
    f.innerHTML = '<div class="wrap">© ' + new Date().getFullYear() + " thinkpad.fi. Fan-made, not affiliated with Lenovo or IBM.</div>";
    document.body.appendChild(f);
    return app;
  }

  function renderHome() {
    var app = mount("home");
    app.innerHTML =
      '<div class="wrap"><div class="hero"><h1>' + esc(S.name) + "</h1><p>" + esc(S.tagline) + "</p>" +
      '<a class="btn" href="#models">Browse models</a><a class="btn ghost" href="' + esc(S.other.url) + '">' + esc(S.other.name) + "</a></div>" +
      '<section id="models"><h2>Models</h2>' +
      '<div class="toolbar"><input id="q" type="search" placeholder="Search models…">' +
      '<select id="series"><option value="">All series</option></select>' +
      '<select id="sort"><option value="year-desc">Newest first</option><option value="year-asc">Oldest first</option><option value="name">Name A–Z</option></select></div>' +
      '<div class="grid" id="grid"></div></section></div>';

    var series = Array.from(new Set(M.map(function (m) { return m.series; }))).sort();
    var sel = document.getElementById("series");
    series.forEach(function (s) { sel.appendChild(new Option(s + "-series", s)); });

    function draw() {
      var q = document.getElementById("q").value.trim().toLowerCase();
      var s = sel.value, sort = document.getElementById("sort").value;
      var list = M.filter(function (m) {
        return (!s || m.series === s) && (!q || (m.name + " " + m.id + " " + m.summary + " " + m.year).toLowerCase().indexOf(q) > -1);
      });
      list.sort(function (a, b) {
        return sort === "name" ? a.name.localeCompare(b.name) : sort === "year-asc" ? a.year - b.year : b.year - a.year;
      });
      document.getElementById("grid").innerHTML = list.length ? list.map(function (m) {
        return '<a class="card" href="' + modelUrl(m.id) + '"><h3>' + esc(m.name) + '</h3><div class="meta">' + m.year +
          ' <span class="tag">' + esc(m.series) + "</span></div><p>" + esc(m.summary) + "</p></a>";
      }).join("") : "<p>No models match.</p>";
    }
    ["q", "series", "sort"].forEach(function (id) { document.getElementById(id).addEventListener("input", draw); });
    draw();
  }

  function renderModel(id) {
    var app = mount("model");
    id = String(id).toLowerCase();
    var m = M.filter(function (x) { return x.id === id; })[0];
    if (!m) {
      app.innerHTML = '<div class="wrap"><h1>Model not found</h1><p><a href="' + root + '">Back to home</a></p></div>';
      return;
    }
    document.title = m.name + " – " + S.name + " – thinkpad.fi";
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = m.summary;

    var rows = Object.keys(m.specs).map(function (k) { return "<tr><th>" + esc(k) + "</th><td>" + esc(m.specs[k]) + "</td></tr>"; }).join("");
    var li = function (a) { return a.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join(""); };
    var idx = M.indexOf(m), nb = [M[idx - 1], M[idx + 1]].filter(Boolean);

    app.innerHTML =
      '<div class="wrap"><div class="crumbs"><a href="' + esc(S.main) + '">thinkpad.fi</a> / <a href="' + root + '">' + esc(S.name) + "</a> / " + esc(m.name) + "</div>" +
      '<div class="model-head"><h1>' + esc(m.name) + "</h1><p>" + esc(m.summary) + '</p><span class="tag">' + m.year + '</span><span class="tag">' + esc(m.series) + "-series</span></div>" +
      '<section><h2>Specifications</h2><table class="specs">' + rows + "</table></section>" +
      '<section class="two"><div class="panel pros"><h3>Strengths</h3><ul>' + li(m.pros) + "</ul></div>" +
      '<div class="panel cons"><h3>Weaknesses</h3><ul>' + li(m.cons) + "</ul></div></section>" +
      (nb.length ? '<section><h2>More ' + esc(S.label) + " models</h2><div class=\"grid\">" + nb.map(function (o) {
        return '<a class="card" href="' + modelUrl(o.id) + '"><h3>' + esc(o.name) + '</h3><div class="meta">' + o.year + "</div><p>" + esc(o.summary) + "</p></a>";
      }).join("") + "</div></section>" : "") + "</div>";
  }

  var page = document.body.dataset.page;
  if (page === "model") renderModel(document.body.dataset.model);
  else renderHome();
})();
