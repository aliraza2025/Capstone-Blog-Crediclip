(function () {
  var ENDPOINT = "https://askaliraza.vercel.app/api/ask";
  var STORE_KEY = "ask-ali-chat";
  var SUGGESTIONS = [
    "What is CrediClip?",
    "What does Ali do at irha.ai?",
    "What did Ali build at Blue Ocean?",
    "Which tools does Ali use?"
  ];

  var css = [
    ".aa-launch{position:fixed;right:20px;bottom:20px;z-index:250;display:inline-flex;align-items:center;gap:.5rem;padding:.7rem 1.05rem;border:0;border-radius:999px;background:#db0070;color:#fff;font:600 .88rem/1 Inter,system-ui,sans-serif;cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.35);transition:background .15s,transform .15s}",
    ".aa-launch:hover{background:#c2005f;transform:translateY(-1px)}",
    ".aa-launch:focus-visible,.aa-panel button:focus-visible,.aa-panel a:focus-visible,.aa-input:focus-visible{outline:2px solid #fff;outline-offset:2px}",
    ".aa-launch svg{width:18px;height:18px}",
    ".aa-panel{position:fixed;right:20px;bottom:84px;z-index:251;width:min(390px,calc(100vw - 32px));height:min(580px,calc(100vh - 120px));display:flex;flex-direction:column;background:#120a2b;border:1px solid rgba(255,255,255,.14);border-radius:16px;box-shadow:0 24px 60px rgba(0,0,0,.5);font-family:Inter,system-ui,sans-serif;color:#cbd5e1;overflow:hidden}",
    ".aa-panel[hidden]{display:none}",
    ".aa-head{display:flex;align-items:flex-start;gap:.75rem;padding:.9rem 1rem;border-bottom:1px solid rgba(255,255,255,.1)}",
    ".aa-head h2{margin:0;font-size:.95rem;font-weight:700;color:#e5e7eb;letter-spacing:-.01em}",
    ".aa-head p{margin:.15rem 0 0;font-size:.75rem;color:#94a3b8}",
    ".aa-close{margin-left:auto;flex:none;width:32px;height:32px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.12);border-radius:8px;background:transparent;color:#cbd5e1;cursor:pointer}",
    ".aa-close:hover{color:#fff;border-color:rgba(255,255,255,.3)}",
    ".aa-log{flex:1;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:.75rem;scrollbar-width:thin}",
    ".aa-msg{max-width:92%;padding:.65rem .8rem;border-radius:12px;font-size:.88rem;line-height:1.55;overflow-wrap:anywhere}",
    ".aa-msg.aa-bot{align-self:flex-start;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08)}",
    ".aa-msg.aa-user{align-self:flex-end;background:rgba(255,45,141,.16);border:1px solid rgba(255,45,141,.3);color:#f1f5f9}",
    ".aa-msg.aa-error{border-color:rgba(251,191,36,.4)}",
    ".aa-msg a{color:#ff4aa3;font-weight:600}",
    ".aa-sources{margin:.55rem 0 0;padding:.5rem 0 0;border-top:1px solid rgba(255,255,255,.08);list-style:none;font-size:.76rem}",
    ".aa-sources li+li{margin-top:.25rem}",
    ".aa-sources a{font-weight:500;text-decoration:none}",
    ".aa-sources a:hover{text-decoration:underline}",
    ".aa-chips{display:flex;flex-wrap:wrap;gap:.4rem}",
    ".aa-chip{padding:.4rem .7rem;border:1px solid rgba(255,45,141,.35);border-radius:999px;background:transparent;color:#e5e7eb;font:500 .78rem/1.2 Inter,system-ui,sans-serif;cursor:pointer;text-align:left}",
    ".aa-chip:hover{background:rgba(255,45,141,.12)}",
    ".aa-typing{display:inline-flex;gap:4px}",
    ".aa-typing span{width:6px;height:6px;border-radius:50%;background:#94a3b8;animation:aa-blink 1.2s infinite}",
    ".aa-typing span:nth-child(2){animation-delay:.2s}.aa-typing span:nth-child(3){animation-delay:.4s}",
    "@keyframes aa-blink{0%,80%,100%{opacity:.25}40%{opacity:1}}",
    ".aa-form{display:flex;gap:.5rem;align-items:flex-end;padding:.75rem 1rem .4rem;border-top:1px solid rgba(255,255,255,.1)}",
    ".aa-input{flex:1;min-height:40px;max-height:110px;resize:none;padding:.6rem .75rem;border:1px solid rgba(255,255,255,.14);border-radius:10px;background:rgba(255,255,255,.04);color:#e5e7eb;font:400 .88rem/1.4 Inter,system-ui,sans-serif}",
    ".aa-input::placeholder{color:#94a3b8}",
    ".aa-send{flex:none;width:40px;height:40px;display:grid;place-items:center;border:0;border-radius:10px;background:#db0070;color:#fff;cursor:pointer}",
    ".aa-send:hover{background:#c2005f}",
    ".aa-send:disabled{opacity:.5;cursor:not-allowed}",
    ".aa-note{margin:0;padding:0 1rem .75rem;font-size:.7rem;line-height:1.45;color:#94a3b8}",
    ".aa-note a{color:#94a3b8}",
    ".aa-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}",
    "@media (max-width:560px){.aa-launch{right:14px;bottom:14px}.aa-panel{right:0;left:0;bottom:0;width:100%;height:min(85vh,640px);border-radius:16px 16px 0 0;border-bottom:0}}",
    "@media (prefers-reduced-motion:reduce){.aa-launch{transition:none}.aa-typing span{animation:none;opacity:.6}}",
    "@media print{.aa-launch,.aa-panel{display:none!important}}"
  ].join("");

  var ICON_CHAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  var ICON_CLOSE = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  var ICON_SEND = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var launch = document.createElement("button");
  launch.type = "button";
  launch.className = "aa-launch";
  launch.setAttribute("aria-expanded", "false");
  launch.setAttribute("aria-controls", "aa-panel");
  launch.innerHTML = ICON_CHAT + "<span>Ask my AI</span>";

  var panel = document.createElement("section");
  panel.id = "aa-panel";
  panel.className = "aa-panel";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-labelledby", "aa-title");
  panel.innerHTML =
    '<div class="aa-head"><div><h2 id="aa-title">Ask about Ali’s work</h2><p>AI assistant, not Ali. Answers come from this site.</p></div>' +
    '<button type="button" class="aa-close" aria-label="Close assistant">' + ICON_CLOSE + "</button></div>" +
    '<div class="aa-log" aria-live="polite" aria-relevant="additions"></div>' +
    '<form class="aa-form"><label class="aa-sr" for="aa-input">Your question</label>' +
    '<textarea id="aa-input" class="aa-input" rows="1" maxlength="500" placeholder="Ask about projects, roles, or skills"></textarea>' +
    '<button type="submit" class="aa-send" aria-label="Send question">' + ICON_SEND + "</button></form>" +
    '<p class="aa-note">Answers can be wrong; check the linked sources. Questions are processed by free AI models on OpenRouter, so please don’t share private information. <a href="about-this-site.html">How this works</a></p>';

  document.body.appendChild(launch);
  document.body.appendChild(panel);

  var log = panel.querySelector(".aa-log");
  var form = panel.querySelector(".aa-form");
  var input = panel.querySelector(".aa-input");
  var send = panel.querySelector(".aa-send");
  var closeBtn = panel.querySelector(".aa-close");
  var busy = false;
  var messages = load();
  var listeners = {};

  function emit(name, detail) {
    (listeners[name] || []).forEach(function (fn) {
      try { fn(detail); } catch (e) {}
    });
  }

  function load() {
    try { return JSON.parse(sessionStorage.getItem(STORE_KEY)) || []; } catch (e) { return []; }
  }
  function save() {
    try { sessionStorage.setItem(STORE_KEY, JSON.stringify(messages.slice(-12))); } catch (e) {}
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function renderAnswer(text, sources) {
    var byN = {};
    (sources || []).forEach(function (s) { byN[s.n] = s; });
    var html = escapeHtml(text)
      .replace(/\[(\d+)\]/g, function (m, n) {
        var s = byN[n];
        return s ? '<a href="' + escapeHtml(s.url) + '" title="' + escapeHtml(s.title) + '">[' + n + "]</a>" : "";
      })
      .replace(/\n/g, "<br>");
    if (sources && sources.length) {
      html += '<ul class="aa-sources" aria-label="Sources">' + sources.map(function (s) {
        return '<li><a href="' + escapeHtml(s.url) + '">[' + s.n + "] " + escapeHtml(s.title) + "</a></li>";
      }).join("") + "</ul>";
    }
    return html;
  }

  function addMessage(m) {
    var el = document.createElement("div");
    el.className = "aa-msg " + (m.role === "user" ? "aa-user" : "aa-bot") + (m.error ? " aa-error" : "");
    if (m.role === "user") el.textContent = m.content;
    else el.innerHTML = renderAnswer(m.content, m.sources);
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function renderAll() {
    log.innerHTML = "";
    addMessage({
      role: "assistant",
      content: "Hi. I’m an AI assistant, not Ali. I answer from this site’s pages and his CV, and I link my sources. What would you like to know?"
    });
    if (!messages.length) {
      var chips = document.createElement("div");
      chips.className = "aa-chips";
      SUGGESTIONS.forEach(function (q) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "aa-chip";
        b.textContent = q;
        b.addEventListener("click", function () { ask(q); });
        chips.appendChild(b);
      });
      log.appendChild(chips);
    }
    messages.forEach(addMessage);
  }

  function setBusy(v) {
    busy = v;
    send.disabled = v;
    log.setAttribute("aria-busy", v ? "true" : "false");
  }

  function ask(question) {
    question = (question || "").trim();
    if (!question || busy) return;
    var chips = log.querySelector(".aa-chips");
    if (chips) chips.remove();
    var history = messages.filter(function (m) { return !m.error; }).slice(-4).map(function (m) {
      return { role: m.role, content: m.content };
    });
    var userMsg = { role: "user", content: question };
    messages.push(userMsg);
    addMessage(userMsg);
    input.value = "";
    autosize();
    setBusy(true);

    var typing = document.createElement("div");
    typing.className = "aa-msg aa-bot";
    typing.innerHTML = '<span class="aa-typing" aria-hidden="true"><span></span><span></span><span></span></span><span class="aa-sr">Thinking</span>';
    log.appendChild(typing);
    log.scrollTop = log.scrollHeight;
    emit("ask", { question: question });

    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: question, history: history })
    })
      .then(function (r) { return r.json().catch(function () { return { error: "Something went wrong. Please try again." }; }); })
      .then(function (data) {
        typing.remove();
        var m = data && data.answer
          ? { role: "assistant", content: data.answer, sources: data.sources || [] }
          : { role: "assistant", content: (data && data.error) || "Something went wrong. Please try again.", error: true };
        messages.push(m);
        addMessage(m);
        save();
        emit("answer", m);
      })
      .catch(function () {
        typing.remove();
        var m = { role: "assistant", content: "I couldn’t reach the assistant. Check your connection and try again.", error: true };
        messages.push(m);
        addMessage(m);
        emit("answer", m);
      })
      .then(function () { setBusy(false); });
  }

  function autosize() {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 110) + "px";
  }

  function open(opts) {
    if (!panel.hidden) return;
    if (!log.childElementCount) renderAll();
    panel.hidden = false;
    launch.setAttribute("aria-expanded", "true");
    if (!(opts && opts.noFocus)) input.focus();
    emit("open");
  }
  function close() {
    panel.hidden = true;
    launch.setAttribute("aria-expanded", "false");
    launch.focus();
    emit("close");
  }

  window.AskAli = {
    open: open,
    close: close,
    ask: function (q) { open({ noFocus: true }); ask(q); },
    isBusy: function () { return busy; },
    on: function (name, fn) { (listeners[name] = listeners[name] || []).push(fn); }
  };

  launch.addEventListener("click", function () { panel.hidden ? open() : close(); });
  closeBtn.addEventListener("click", close);
  panel.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  form.addEventListener("submit", function (e) { e.preventDefault(); ask(input.value); });
  input.addEventListener("input", autosize);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(input.value); }
  });
})();
