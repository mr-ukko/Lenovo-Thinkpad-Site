// Used by 404.html on lenovo.thinkpad.fi and ibm.thinkpad.fi.
// /T460p  -> /t460p/   (case fix, if the model exists here)
// unknown -> https://thinkpad.fi/<id>  (the main site knows both brands and redirects to the right one)
(function () {
  var all = window.THINKPAD || {};
  var key = Object.keys(all)[0];
  var D = all[key];
  var seg = (location.pathname.split("/").filter(Boolean)[0] || "").toLowerCase().replace(/\.html?$/, "");
  var tried = location.search.indexOf("r=1") > -1;   // loop guard

  function notFound() {
    var msg = document.getElementById("msg");
    msg.innerHTML = '<h1>Page not found</h1><p>No ThinkPad called <b></b> here.</p>' +
      '<p><a class="btn" href="/">' + (D ? D.site.name : "Home") + '</a><a class="btn ghost" href="https://thinkpad.fi/">thinkpad.fi</a></p>';
    msg.querySelector("b").textContent = seg;
  }

  if (!seg) { location.replace("/"); return; }
  if (!D) { notFound(); return; }
  var own = D.models.some(function (m) { return m.id === seg; });
  if (own && !tried) { location.replace("/" + seg + "/?r=1"); return; }
  if (!own && !tried) { location.replace("https://thinkpad.fi/" + encodeURIComponent(seg)); return; }
  notFound();
})();
