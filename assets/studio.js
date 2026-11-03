(function () {
  var studio = document.getElementById("hero");
  if (!studio || !studio.classList.contains("studio")) return;

  var PREFS_KEY = "studio-prefs";
  var GREETING = "Hi, I’m Ali’s AI, an assistant, not Ali. I answer from this site and his CV. Ask me about his work.";
  var THINKING = "Let me check Ali’s pages…";
  var MALE_VOICES = [/guy/i, /andrew/i, /davis/i, /christopher/i, /eric/i, /uk english male/i, /aaron/i, /alex\b/i, /daniel/i, /david/i, /fred/i];

  var avatar = studio.querySelector(".avatar");
  var bubble = studio.querySelector(".avatar-bubble");
  var bubbleText = bubble.querySelector("p");
  var form = studio.querySelector(".studio-ask");
  var input = form.querySelector("input");
  var mic = form.querySelector(".studio-mic");
  var meet = document.getElementById("meet-ai");
  var synth = window.speechSynthesis;
  var Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  var prefs = loadPrefs();
  if (prefs.paused === undefined) prefs.paused = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefs.voice === undefined) prefs.voice = !!synth;

  function loadPrefs() {
    try { return JSON.parse(localStorage.getItem(PREFS_KEY)) || {}; } catch (e) { return {}; }
  }
  function savePrefs() {
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch (e) {}
  }

  function applyPrefs() {
    studio.dataset.motion = prefs.paused ? "off" : "on";
    studio.classList.toggle("is-simple", !!prefs.simple);
    studio.classList.toggle("no-avatar", !!prefs.hideAvatar);
    studio.querySelectorAll("[data-pref]").forEach(function (b) {
      b.setAttribute("aria-pressed", prefs[b.dataset.pref] ? "true" : "false");
    });
    if (!prefs.voice || prefs.hideAvatar) stopSpeaking();
    if (typeof updateCovered === "function") requestAnimationFrame(updateCovered);
  }

  studio.querySelectorAll("[data-pref]").forEach(function (b) {
    if (b.dataset.pref === "voice" && !synth) { b.hidden = true; return; }
    b.addEventListener("click", function () {
      prefs[b.dataset.pref] = !prefs[b.dataset.pref];
      savePrefs();
      applyPrefs();
    });
  });

  function showAvatar(wave) {
    avatar.classList.add("is-in");
    if (wave && !prefs.paused) {
      avatar.classList.remove("is-hello");
      void avatar.offsetWidth;
      avatar.classList.add("is-hello");
    }
  }
  avatar.addEventListener("animationend", function (e) {
    if (e.animationName === "studioHello") avatar.classList.remove("is-hello");
  });

  var hotspots = studio.querySelectorAll(".hotspot");

  // Labels the bubble would overlap fade out until the bubble closes.
  function updateCovered() {
    var b = bubble.hidden || prefs.hideAvatar ? null : bubble.getBoundingClientRect();
    hotspots.forEach(function (h) {
      h.classList.remove("is-covered");
      if (!b || !b.width) return;
      var r = h.getBoundingClientRect();
      var overlap = r.width && r.left < b.right + 4 && r.right > b.left - 4 && r.top < b.bottom + 4 && r.bottom > b.top - 4;
      h.classList.toggle("is-covered", !!overlap);
    });
  }

  var bubbleTimer = null;

  function setBubble(text, autoCloseMs) {
    clearTimeout(bubbleTimer);
    bubbleText.textContent = text;
    bubble.hidden = false;
    requestAnimationFrame(updateCovered);
    if (autoCloseMs) {
      bubbleTimer = setTimeout(function () {
        if (synth && synth.speaking) return;
        hideBubble();
      }, autoCloseMs);
    }
  }

  function hideBubble() {
    clearTimeout(bubbleTimer);
    bubble.hidden = true;
    updateCovered();
  }

  bubble.querySelector(".avatar-bubble-close").addEventListener("click", function () {
    stopSpeaking();
    hideBubble();
  });

  window.addEventListener("resize", function () { requestAnimationFrame(updateCovered); });

  function plain(text) {
    return String(text || "")
      .replace(/\[\d+\]/g, "")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/[*_#`>]/g, "")
      .replace(/\s+([.,;:!?])/g, "$1")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  function preview(text, max) {
    if (text.length <= max) return text;
    var cut = text.slice(0, max);
    var stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "), cut.lastIndexOf("! "));
    return stop > 60 ? cut.slice(0, stop + 1) : cut.replace(/\s+\S*$/, "") + "…";
  }

  // Lip sync: word boundary events drive the mouth when the voice supports them,
  // otherwise the mouth flaps on a timer while speech is playing.
  var flapTimer = null;
  var closeTimer = null;
  var gotBoundary = false;

  function mouth(open) { avatar.classList.toggle("is-talking", open); }

  function startFlap() {
    stopFlap();
    gotBoundary = false;
    flapTimer = setInterval(function () {
      if (!gotBoundary) mouth(!avatar.classList.contains("is-talking"));
    }, 140);
  }
  function stopFlap() {
    clearInterval(flapTimer);
    clearTimeout(closeTimer);
    flapTimer = null;
    mouth(false);
  }

  function pickVoice() {
    var voices = synth.getVoices().filter(function (v) { return /^en(-|_|$)/i.test(v.lang); });
    for (var i = 0; i < MALE_VOICES.length; i++) {
      for (var j = 0; j < voices.length; j++) {
        if (MALE_VOICES[i].test(voices[j].name)) return voices[j];
      }
    }
    return voices.filter(function (v) { return /en-US/i.test(v.lang); })[0] || voices[0] || null;
  }

  function speak(text) {
    if (!synth || !prefs.voice || prefs.hideAvatar) return;
    stopSpeaking();
    var u = new SpeechSynthesisUtterance(text);
    var v = pickVoice();
    if (v) { u.voice = v; u.lang = v.lang; }
    u.rate = 1.03;
    u.onstart = startFlap;
    u.onboundary = function (e) {
      if (e.name && e.name !== "word") return;
      gotBoundary = true;
      mouth(true);
      clearTimeout(closeTimer);
      closeTimer = setTimeout(function () { mouth(false); }, 120);
    };
    u.onend = u.onerror = stopFlap;
    synth.speak(u);
  }

  function stopSpeaking() {
    if (synth && (synth.speaking || synth.pending)) synth.cancel();
    stopFlap();
  }

  if (synth && synth.onvoiceschanged !== undefined) synth.onvoiceschanged = function () {};

  function greet(withVoice) {
    showAvatar(true);
    setBubble(GREETING, withVoice ? 0 : 8000);
    if (withVoice) speak(GREETING);
  }

  function submit(question) {
    question = (question || "").trim();
    if (!question) return;
    if (!window.AskAli) {
      setBubble("The assistant didn’t load. Please refresh and try again.");
      return;
    }
    if (window.AskAli.isBusy()) {
      setBubble("One moment, I’m still answering your last question.");
      return;
    }
    input.value = "";
    window.AskAli.ask(question);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    submit(input.value);
  });

  studio.querySelectorAll(".studio-chips button").forEach(function (b) {
    b.addEventListener("click", function () { submit(b.textContent); });
  });

  meet.addEventListener("click", function () {
    if (prefs.hideAvatar) { prefs.hideAvatar = false; savePrefs(); applyPrefs(); }
    if (prefs.simple) { prefs.simple = false; savePrefs(); applyPrefs(); }
    greet(true);
    input.focus({ preventScroll: true });
  });

  avatar.addEventListener("click", function () {
    if (synth && synth.speaking) stopSpeaking();
    else greet(true);
  });

  if (window.AskAli) {
    window.AskAli.on("ask", function () {
      stopSpeaking();
      showAvatar(false);
      setBubble(THINKING);
    });
    window.AskAli.on("answer", function (m) {
      var text = plain(m.content);
      if (m.error) {
        setBubble(text);
        return;
      }
      setBubble(preview(text, 130) + " The full answer and sources are in the chat.");
      speak(text);
    });
    window.AskAli.on("close", stopSpeaking);
  }

  if (Recognition) {
    mic.hidden = false;
    var rec = null;
    mic.addEventListener("click", function () {
      if (rec) { rec.stop(); return; }
      stopSpeaking();
      rec = new Recognition();
      rec.lang = "en-US";
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      var finalText = "";
      mic.setAttribute("aria-pressed", "true");
      mic.setAttribute("aria-label", "Stop listening");
      showAvatar(false);
      setBubble("I’m listening. Ask your question.");
      rec.onresult = function (e) {
        var interim = "";
        for (var i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) finalText += e.results[i][0].transcript;
          else interim += e.results[i][0].transcript;
        }
        input.value = (finalText + interim).trim();
      };
      rec.onerror = function (e) {
        setBubble(e.error === "not-allowed" || e.error === "service-not-allowed"
          ? "I can’t use the microphone. Check your browser’s permission, or type instead."
          : "I didn’t catch that. Try again, or type your question.");
      };
      rec.onend = function () {
        rec = null;
        mic.setAttribute("aria-pressed", "false");
        mic.setAttribute("aria-label", "Ask by voice");
        if (finalText.trim()) submit(finalText);
      };
      rec.start();
    });
  }

  applyPrefs();
  setTimeout(function () { greet(false); }, prefs.paused ? 0 : 700);
})();
