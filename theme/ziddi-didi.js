/* Ziddi Didi: AI shopkeeper widget for Shopify themes. */
(function () {
  var C = window.ZIDDI_DIDI || {};
  C.api = C.api || "https://ziddi-didi.onrender.com";
  C.whatsapp = C.whatsapp || "919888458818";
  C.lang = C.lang || "en-IN";
  if (!C.product && typeof window !== "undefined" && window.location) {
    var pMatch = window.location.pathname.match(//products/([^\/?#]+)/);
    if (pMatch) C.product = pMatch[1];
  }
  if (window.__zd) return;
  window.__zd = 1;
  var WA = C.whatsapp || "919888458818", KEY = "zd_hist", SEEN = "zd_seen";
  var API = C.api.replace(/\/$/, "") + "/api/didi/chat";
  var GREET = "Aao ji, aao! Ziddi Ladki mein aapka swagat hai. Kya dhoondh rahi hain aaj: shaadi ka suit, daily cotton, ya kuch winter wala?";
  var FACE = '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M16 96C14 58 30 8 50 8s36 50 34 88z" fill="#F4B63F"/><ellipse cx="50" cy="52" rx="25" ry="29" fill="#E8A97E"/><path d="M26 48C27 26 38 18 50 18s23 8 24 30C67 36 59 31 50 31s-17 5-24 17z" fill="#1E0E22"/><circle cx="50" cy="38" r="2.6" fill="#C21E63"/><ellipse cx="40" cy="50" rx="2.6" ry="3.4" fill="#2B1238"/><ellipse cx="60" cy="50" rx="2.6" ry="3.4" fill="#2B1238"/><path d="M42 64q8 8 16 0" fill="none" stroke="#7A1F2B" stroke-width="2.6" stroke-linecap="round"/></svg>';

  var CSS = ".zd-l{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:2147483000;width:64px;height:64px;padding:4px;border:3px solid #F4B63F;border-radius:50%;background:#2B1238;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.3)}" +
  ".zd-l svg{width:100%;height:100%}" +
  ".zd-t{position:fixed;right:16px;bottom:calc(92px + env(safe-area-inset-bottom,0px));z-index:2147483000;max-width:240px;padding:10px 30px 10px 14px;border-radius:14px;background:#fff;color:#2B1238;font-family:inherit;font-size:14px;line-height:1.4;box-shadow:0 6px 20px rgba(0,0,0,.25);cursor:pointer}" +
  ".zd-t button{position:absolute;top:2px;right:6px;border:0;background:none;color:#6E5A78;font-size:18px;cursor:pointer}" +
  ".zd-p{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:2147483001;display:none;flex-direction:column;width:380px;height:min(620px,calc(100vh - 32px));overflow:hidden;border-radius:18px;background:#fff;color:#2B1238;font-family:inherit;font-size:15px;line-height:1.45;box-shadow:0 12px 40px rgba(0,0,0,.35)}" +
  ".zd-p.o{display:flex}" +
  ".zd-h{display:flex;align-items:center;gap:10px;padding:12px 14px;background:#2B1238;color:#FFF1DC}" +
  ".zd-h b{display:block;font-size:16px;color:#F4B63F}.zd-h small{font-size:12px;color:#E8C9D8}" +
  ".zd-av{flex:none;width:40px;height:40px;padding:2px;border-radius:50%;background:#4A1D5C}.zd-av svg{width:100%;height:100%}" +
  ".zd-x{margin-left:auto;border:0;background:none;color:#FFF1DC;font-size:26px;line-height:1;cursor:pointer}" +
  ".zd-f{flex:1;display:flex;flex-direction:column;gap:12px;padding:14px;overflow-y:auto;background:#FFF9F2}" +
  ".zd-m{display:flex;flex-direction:column;gap:8px;max-width:90%}.zd-m.u{align-self:flex-end;align-items:flex-end}" +
  ".zd-b{padding:9px 13px;border:1px solid #EBCFDB;border-radius:15px;background:#fff;white-space:pre-wrap;overflow-wrap:anywhere}" +
  ".zd-m.u .zd-b{border-color:#C21E63;background:#C21E63;color:#fff}.zd-b.w{color:#6E5A78}" +
  ".zd-s{display:flex;gap:10px;max-width:100%;padding-bottom:6px;overflow-x:auto}" +
  ".zd-c{flex:none;display:flex;flex-direction:column;gap:4px;width:150px;padding:8px;border:1px solid #EBCFDB;border-radius:12px;background:#fff;font-size:13px}" +
  ".zd-c>a:first-child{display:block}.zd-c img{display:block;width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:8px;background:#F3E3EA}" +
  ".zd-n{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;color:#2B1238;font-weight:600;line-height:1.25;text-decoration:none}" +
  ".zd-pr{color:#B0185A;font-weight:600}.zd-pr s{color:#6E5A78;font-size:12px;font-weight:400}.zd-sz{color:#6E5A78;font-size:12px}.zd-so{color:#B3363F;font-size:12px}" +
  ".zd-a{padding:6px 8px;border:1px solid #C21E63;border-radius:8px;background:#C21E63;color:#fff;font:inherit;font-size:13px;font-weight:600;text-align:center;text-decoration:none;cursor:pointer}.zd-a.g{background:#fff;color:#C21E63}" +
  ".zd-q{display:flex;gap:6px;padding:8px 14px 0;overflow-x:auto}.zd-q[hidden]{display:none}.zd-q button{flex:none;padding:6px 12px;border:1px solid #F4B63F;border-radius:999px;background:#fff;color:#2B1238;font:inherit;font-size:13px;cursor:pointer}" +
  ".zd-r{display:flex;gap:6px;padding:10px 14px}.zd-r input{flex:1;min-width:0;padding:10px 12px;border:1px solid #EBCFDB;border-radius:10px;font:inherit;font-size:16px}" +
  ".zd-r button{border:0;border-radius:10px;background:#C21E63;color:#fff;font:inherit;font-weight:600;padding:0 14px;cursor:pointer}.zd-r button:disabled{opacity:.55}" +
  ".zd-r .zd-mic{width:42px;padding:0;border:1px solid #EBCFDB;background:#fff;color:#2B1238;font-size:18px}.zd-mic.on{border-color:#E53060;background:#E53060;color:#fff}.zd-mic[hidden]{display:none}" +
  ".zd-w{padding:8px 14px 12px;border-top:1px solid #EBCFDB;color:#6E5A78;font-size:12px}.zd-w a{color:#2B1238;font-weight:600}" +
  "@media(max-width:520px){.zd-p{right:0;bottom:0;left:0;width:auto;height:88vh;border-radius:18px 18px 0 0}}" +
  "@media(prefers-reduced-motion:no-preference){.zd-l{animation:zdp 2.4s ease-out 1}}@keyframes zdp{0%{box-shadow:0 0 0 0 rgba(244,182,63,.7)}100%{box-shadow:0 0 0 18px rgba(244,182,63,0)}}";

  var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
  var h = function (t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  var inr = function (n) { return "\u20B9" + Math.round(n).toLocaleString("en-IN"); };
  var store = function (m, v) { try { return m === "get" ? sessionStorage.getItem(KEY) : (v == null ? sessionStorage.removeItem(KEY) : sessionStorage.setItem(KEY, v)); } catch (e) { return null; } };

  var L = h("button", "zd-l"); L.type = "button"; L.setAttribute("aria-label", "Chat with Ziddi Didi"); L.innerHTML = FACE;
  var T = h("div", "zd-t", "Namaste ji! Kuch dhoondh rahi hain? Didi se poochhiye."); var TX = h("button", "", "\u00D7"); TX.type = "button"; TX.setAttribute("aria-label", "Dismiss"); T.appendChild(TX); T.hidden = true;
  var P = h("section", "zd-p"); P.setAttribute("role", "dialog"); P.setAttribute("aria-modal", "true"); P.setAttribute("aria-label", "Chat with Ziddi Didi");
  P.innerHTML = '<div class="zd-h"><span class="zd-av">' + FACE + '</span><span><b>Ziddi Didi</b><small>AI shopkeeper at Ziddi Ladki</small></span><button class="zd-x" type="button" aria-label="Close chat">\u00D7</button></div>' +
    '<div class="zd-f" aria-live="polite"></div><div class="zd-q"></div>' +
    '<div class="zd-r"><input type="text" placeholder="Didi se poochhiye\u2026" aria-label="Message for Didi" autocomplete="off"><button class="zd-mic" type="button" aria-label="Speak" hidden>\uD83C\uDF99</button><button class="zd-go" type="button">Send</button></div>' +
    '<div class="zd-w">Didi is an AI, so please do not share card, OTP or address details here. <a class="zd-wa" target="_blank" rel="noopener" href="https://wa.me/' + WA + '">Talk to a real person on WhatsApp</a></div>';
  document.body.appendChild(L); document.body.appendChild(T); document.body.appendChild(P);

  var F = P.querySelector(".zd-f"), Q = P.querySelector(".zd-q"), I = P.querySelector("input"), G = P.querySelector(".zd-go"), M = P.querySelector(".zd-mic"), W = P.querySelector(".zd-wa");
  var hist = [], busy = false, rec = null;
  try { hist = JSON.parse(store("get") || "[]"); } catch (e) { hist = []; }

  function card(p) {
    var c = h("div", "zd-c"), u = "/products/" + p.handle;
    if (p.image) { var ia = h("a"); ia.href = u; var im = h("img"); im.src = p.image; im.alt = p.title; im.loading = "lazy"; ia.appendChild(im); c.appendChild(ia); }
    var a = h("a", "zd-n", p.title); a.href = u; c.appendChild(a);
    var pr = h("div", "zd-pr", inr(p.price));
    if (p.compare) { pr.appendChild(document.createTextNode(" ")); pr.appendChild(h("s", "", inr(p.compare))); }
    c.appendChild(pr);
    if (p.sizes && p.sizes.length) c.appendChild(h("div", "zd-sz", "Sizes: " + p.sizes.join(", ")));
    if (!p.available) c.appendChild(h("div", "zd-so", "Sold out"));
    else if (p.variantId) {
      var b = h("button", "zd-a", "Add to bag"); b.type = "button";
      b.onclick = function () {
        b.disabled = true; b.textContent = "Adding\u2026";
        fetch("/cart/add.js", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: [{ id: p.variantId, quantity: 1 }] }) })
          .then(function (r) { if (!r.ok) throw 0; return r.json(); })
          .then(function () { b.disabled = false; b.textContent = "Added. View bag"; b.onclick = function () { location.href = "/cart"; }; document.dispatchEvent(new CustomEvent("zd:cart-added")); })
          .catch(function () { b.disabled = false; b.textContent = "Open product page"; b.onclick = function () { location.href = u; }; });
      };
      c.appendChild(b);
    } else { var v = h("a", "zd-a g", "Choose size"); v.href = u; c.appendChild(v); }
    return c;
  }
  function draw(m) {
    var d = h("div", "zd-m" + (m.role === "user" ? " u" : "")); d.appendChild(h("div", "zd-b", m.text));
    if (m.products && m.products.length) { var s = h("div", "zd-s"); m.products.forEach(function (p) { s.appendChild(card(p)); }); d.appendChild(s); }
    F.appendChild(d); F.scrollTop = F.scrollHeight; return d;
  }
  function push(m) { hist.push(m); store("set", JSON.stringify(hist.slice(-30))); wa(); return draw(m); }
  function wa() {
    var last = ""; for (var i = hist.length - 1; i >= 0; i--) if (hist[i].role === "user") { last = hist[i].text; break; }
    W.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent("Hi Ziddi Ladki, I was chatting with Didi on your website" + (last ? " about: " + last : "."));
  }
  function setBusy(b) { busy = b; G.disabled = b; I.disabled = b; if (!b) I.focus(); }

  function send(t) {
    t = (t || I.value).trim(); if (!t || busy) return;
    I.value = ""; Q.hidden = true; push({ role: "user", text: t }); setBusy(true);
    var wait = draw({ role: "didi", text: "Ek minute ji, dekhti hoon\u2026" }); wait.firstChild.classList.add("w");
    fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: hist.map(function (m) { return { role: m.role, text: m.text }; }), context: { handle: C.product || null } }) })
      .then(function (r) { if (r.status === 429) throw "slow"; if (!r.ok) throw "err"; return r.json(); })
      .then(function (o) { wait.remove(); push({ role: "didi", text: o.text || "Hmm, phir se poochhiye ji?", products: o.products || [] }); })
      .catch(function (e) { wait.remove(); push({ role: "didi", text: e === "slow" ? "Arre ji, thoda dheere dheere poochhiye. Ek minute baad phir try kijiye!" : "Didi ka counter abhi busy hai. WhatsApp pe seedha baat kar lijiye?" }); })
      .then(function () { setBusy(false); });
  }

  var chips = ["Shaadi ya festive suit", "Winter wear", "Daily cotton, \u20B91500 ke andar", "Custom stitching", "Handbags"];
  if (C.product) chips.unshift("Kya ye mere size mein hai?");
  chips.forEach(function (c) { var b = h("button", "", c); b.type = "button"; b.onclick = function () { send(c); }; Q.appendChild(b); });

  function open() {
    if (!hist.length) push({ role: "didi", text: GREET }); else if (!F.children.length) hist.forEach(draw);
    if (hist.some(function (m) { return m.role === "user"; })) Q.hidden = true;
    P.classList.add("o"); L.style.display = "none"; T.hidden = true; wa(); I.focus();
  }
  function close() { P.classList.remove("o"); L.style.display = ""; try { L.focus(); } catch (e) {} }
  L.onclick = open; T.onclick = open; TX.onclick = function (e) { e.stopPropagation(); T.hidden = true; };
  P.querySelector(".zd-x").onclick = close;
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && P.classList.contains("o")) close(); });
  G.onclick = function () { send(); };
  I.addEventListener("keydown", function (e) { if (e.key === "Enter") send(); });

  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SR) {
    M.hidden = false;
    M.onclick = function () {
      if (rec) { rec.stop(); return; }
      rec = new SR(); rec.lang = C.lang || "en-IN"; rec.interimResults = true;
      rec.onresult = function (e) { var s = ""; for (var i = 0; i < e.results.length; i++) s += e.results[i][0].transcript; I.value = s; };
      rec.onerror = function () {};
      rec.onend = function () { M.classList.remove("on"); rec = null; if (I.value.trim()) send(); };
      M.classList.add("on"); try { rec.start(); } catch (x) { rec = null; M.classList.remove("on"); }
    };
  }

  try { if (!sessionStorage.getItem(SEEN)) { sessionStorage.setItem(SEEN, "1"); setTimeout(function () { if (!P.classList.contains("o")) T.hidden = false; }, 5000); } } catch (e) {}
})();