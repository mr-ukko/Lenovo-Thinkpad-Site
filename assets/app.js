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

  // ---------- GPU helpers ----------
  function gpuList(m) { return m.gpu || []; }
  function hasDiscrete(m) { return gpuList(m).some(function (g) { return g.type === "discrete"; }); }
  function discreteOptional(m) {
    var d = gpuList(m).filter(function (g) { return g.type === "discrete"; });
    return d.length > 0 && d.every(function (g) { return g.optional; });
  }
  // Short label for cards: "Integrated", "Discrete option", "Discrete"
  function gpuTag(m) {
    if (!gpuList(m).length) return "";
    if (!hasDiscrete(m)) return "Integrated";
    return discreteOptional(m) ? "Discrete option" : "Discrete";
  }
  function gpuSummary(m) {
    if (!hasDiscrete(m)) return "Integrated graphics only. There is no discrete GPU option on this model.";
    if (discreteOptional(m)) return "Every unit has integrated graphics. A discrete GPU was an option chosen when buying, so check which configuration you have.";
    return "This model has discrete (dedicated) graphics.";
  }
  function badge(g) { return g.type === "discrete" ? '<span class="badge dis">Discrete</span>' : '<span class="badge int">Integrated</span>'; }

  function mount(active) {
    var app = document.getElementById("app");
    var apexUrl = window.TP ? window.TP.url("") : S.main;   // local dev server aware, falls back to production
    var h = el("header", "site-header");
    h.innerHTML = '<div class="wrap"><a class="brand" href="' + esc(apexUrl) + '" title="thinkpad.fi">Think<b>Pad</b><span class="era">' + esc(S.label) + "</span></a>" +
      '<nav class="nav"><a href="' + root + '"' + (active === "home" ? ' class="active"' : "") + '>Home</a>' +
      '<a href="' + root + '#models">Models</a>' +
      '<a href="' + esc(S.other.url) + '">' + esc(S.other.name) + "</a>" +
      (window.TP && window.TP.tools ? window.TP.tools.map(function (t) { return '<a class="ext" href="' + esc(t.url) + '" target="_blank" rel="noopener">' + esc(t.name) + "</a>"; }).join("") : "") +
      "</nav></div>";
    document.body.insertBefore(h, app);
    var f = el("footer", "site-footer");
    f.innerHTML = '<div class="wrap">© ' + new Date().getFullYear() + " thinkpad.fi. Fan-made, not affiliated with Lenovo or IBM.</div>";
    document.body.appendChild(f);
    return app;
  }

  // ---------- Home ----------
  function haystack(m) {
    return [m.name, m.id, m.summary, m.year].concat(
      gpuList(m).map(function (g) { return g.name; }),
      (m.ports || []).map(function (p) { return p.name; }),
      (m.storage || []).map(function (s) { return s.slot + " " + s.interface; })
    ).join(" ").toLowerCase();
  }

  function renderHome() {
    var app = mount("home");
    app.innerHTML =
      '<div class="wrap"><div class="hero"><h1>' + esc(S.name) + "</h1><p>" + esc(S.tagline) + "</p>" +
      '<a class="btn" href="#models">Browse models</a><a class="btn ghost" href="' + esc(S.other.url) + '">' + esc(S.other.name) + "</a></div>" +
      '<section id="models"><h2>Models</h2>' +
      '<div class="toolbar"><input id="q" type="search" placeholder="Search name, GPU or port, e.g. 940MX, HDMI…">' +
      '<select id="series"><option value="">All series</option></select>' +
      '<select id="gpu"><option value="">Any graphics</option><option value="integrated">Integrated only</option><option value="discrete">Has discrete GPU (standard or optional)</option></select>' +
      '<select id="sort"><option value="year-desc">Newest first</option><option value="year-asc">Oldest first</option><option value="name">Name A–Z</option></select></div>' +
      '<div class="grid" id="grid"></div></section></div>';

    var series = Array.from(new Set(M.map(function (m) { return m.series; }))).sort();
    var sel = document.getElementById("series");
    series.forEach(function (s) { sel.appendChild(new Option(s + "-series", s)); });

    function draw() {
      var q = document.getElementById("q").value.trim().toLowerCase();
      var s = sel.value, g = document.getElementById("gpu").value, sort = document.getElementById("sort").value;
      var list = M.filter(function (m) {
        if (s && m.series !== s) return false;
        if (g === "integrated" && hasDiscrete(m)) return false;
        if (g === "discrete" && !hasDiscrete(m)) return false;
        return !q || haystack(m).indexOf(q) > -1;
      });
      list.sort(function (a, b) {
        return sort === "name" ? a.name.localeCompare(b.name) : sort === "year-asc" ? a.year - b.year : b.year - a.year;
      });
      document.getElementById("grid").innerHTML = list.length ? list.map(function (m) {
        var t = gpuTag(m);
        return '<a class="card" href="' + modelUrl(m.id) + '"><h3>' + esc(m.name) + '</h3><div class="meta">' + m.year +
          ' <span class="tag">' + esc(m.series) + "</span>" + (t ? ' <span class="tag">GPU: ' + esc(t) + "</span>" : "") +
          "</div><p>" + esc(m.summary) + "</p></a>";
      }).join("") : "<p>No models match.</p>";
    }
    ["q", "series", "gpu", "sort"].forEach(function (id) { document.getElementById(id).addEventListener("input", draw); });
    draw();
  }

  // ---------- Model page ----------
  function gpuSection(m) {
    var g = gpuList(m);
    if (!g.length) return "";
    return "<section><h2>Graphics</h2><div class=\"panel\"><p class=\"lead\">" + esc(gpuSummary(m)) + "</p><ul class=\"gpu-list\">" +
      g.map(function (x) {
        return "<li>" + badge(x) + (x.type === "discrete" && x.optional ? ' <span class="badge opt">Optional</span>' : "") +
          " <b>" + esc(x.name) + "</b>" + (x.vram ? ' <span class="muted">' + esc(x.vram) + "</span>" : "") +
          (x.note ? '<div class="note">' + esc(x.note) + "</div>" : "") + "</li>";
      }).join("") + "</ul>" +
      (hasDiscrete(m) ? '<p class="foot">Integrated = built into the processor, shares system memory. Discrete = a separate GPU chip with its own video memory. On ThinkPads it is soldered to the motherboard, so it cannot be added or swapped later.</p>' : "") +
      "</div></section>";
  }
  function portsSection(m) {
    var p = m.ports || [];
    if (!p.length) return "";
    return '<section><h2>Ports and connectors</h2><table class="specs ports"><thead><tr><th>Port</th><th>Qty</th><th>Notes</th></tr></thead><tbody>' +
      p.map(function (x) {
        return "<tr><td>" + esc(x.name) + '</td><td class="qty">' + (x.count ? x.count + "×" : "") + "</td><td>" + esc(x.note || "") + "</td></tr>";
      }).join("") + "</tbody></table></section>";
  }

  function storageSection(m) {
    var s = m.storage || [];
    if (!s.length) return "";
    return '<section><h2>Storage slots</h2><table class="specs ports"><thead><tr><th>Slot</th><th>Interface</th><th>Notes</th></tr></thead><tbody>' +
      s.map(function (x) {
        return "<tr><td>" + esc(x.slot) + "</td><td>" + esc(x.interface || "") + "</td><td>" + esc(x.note || "") + "</td></tr>";
      }).join("") + "</tbody></table></section>";
  }
  // Links are only allowed to be http(s) or relative, never javascript: etc.
  function safeUrl(u) { return /^(https?:\/\/|[a-z0-9_\-\/.%]+$)/i.test(u) ? u : "#"; }
  function notesSection(m) {
    var n = m.notes || [];
    if (!n.length) return "";
    return "<section><h2>Good to know</h2><div class=\"panel\"><ul class=\"notes\">" + n.map(function (x) {
      if (typeof x === "string") x = { text: x };
      return "<li>" + (x.unverified ? '<span class="badge opt">Unverified</span> ' : "") + esc(x.text) +
        (x.source ? ' <a class="src" href="' + esc(safeUrl(x.source)) + '" target="_blank" rel="noopener">source</a>' : "") + "</li>";
    }).join("") + "</ul></div></section>";
  }
  function docsHtml(m) {
    var d = m.docs || [];
    if (!d.length) return "";
    return '<p class="docs">' + d.map(function (x) {
      return '<a class="btn ghost" href="' + esc(safeUrl(x.url)) + '" target="_blank" rel="noopener">' + esc(x.label) + "</a>";
    }).join("") + "</p>";
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

    var rows = Object.keys(m.specs || {}).map(function (k) { return "<tr><th>" + esc(k) + "</th><td>" + esc(m.specs[k]) + "</td></tr>"; }).join("");
    var li = function (a) { return (a || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join(""); };
    var idx = M.indexOf(m), nb = [M[idx - 1], M[idx + 1]].filter(Boolean);
    var t = gpuTag(m);

    app.innerHTML =
      '<div class="wrap"><div class="crumbs"><a href="' + esc(S.main) + '">thinkpad.fi</a> / <a href="' + root + '">' + esc(S.name) + "</a> / " + esc(m.name) + "</div>" +
      '<div class="model-head"><h1>' + esc(m.name) + "</h1><p>" + esc(m.summary) + '</p><span class="tag">' + m.year + '</span><span class="tag">' + esc(m.series) + "-series</span>" +
      (t ? '<span class="tag">GPU: ' + esc(t) + "</span>" : "") + "</div>" +
      docsHtml(m) +
      (m.verified ? "" : '<p class="notice">Sample data: these specs have not been verified yet.</p>') +
      '<section><h2>Specifications</h2><table class="specs">' + rows + "</table></section>" +
      gpuSection(m) + storageSection(m) + portsSection(m) + notesSection(m) +
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
