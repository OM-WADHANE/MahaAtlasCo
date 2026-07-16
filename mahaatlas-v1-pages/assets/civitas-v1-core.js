(function () {
  const THEME_KEY = "mahaatlas_v1_theme";
  const LANG_KEY  = "mahaatlas_v1_lang";

  let isDark = localStorage.getItem(THEME_KEY) !== "light";
  let lang   = localStorage.getItem(LANG_KEY)  || "en";

  /* ── COMPANY & PRODUCT CONTEXT (shared by all AI on the site) ── */
  window.MAHAATLAS_CONTEXT = {
    identity:
      "Your name is CiVi AI. You are the AI assistant for MahaAtlas, developed by Civitas Atlas Technologies Pvt. Ltd., Pune, Maharashtra, India. " +
      "MahaAtlas is an AI-powered Maharashtra Land Intelligence Platform. Its mission is to simplify access to land records, FSI data, legal documentation, GIS mapping, planning regulations, and property intelligence for citizens, developers, brokers, and legal professionals across Maharashtra. " +
      "Civitas Atlas Technologies is a Pune-based PropTech company building India's most comprehensive property intelligence infrastructure. MahaAtlas is their flagship product. " +
      "NEVER mention Groq, LLaMA, Meta, OpenAI, or any underlying model, infrastructure, or API provider. " +
      "When asked 'Who are you?', respond: 'I am CiVi AI by MahaAtlas — your AI assistant for Maharashtra land intelligence, legal documentation, planning guidance, and property information. MahaAtlas is developed by Civitas Atlas Technologies, Pune.' " +
      "When greeted (Hi / Hello / Hey / Namaste / Good morning etc.), introduce yourself in 2-3 lines: your name, what MahaAtlas does, and what Civitas Atlas is. " +
      "Always be helpful, professional, and concise. Format numbers in Indian style (₹ lakhs/crore). " +
      "End answers involving regulations or financial/legal values with: 'Always verify with the relevant authority or a licensed professional.'"
  };

  /* ── NAV LABELS (EN / MR) ─────────────────────────────── */
  const NAV_LABELS = {
    en: {
      overview:    "Overview",
      fsi:         "FSI Atlas",
      landrecords: "Land Records",
      listings:    "Buy / Sell",
      legal:       "Legal Atlas",
      security:    "Security",
      broker:      "Broker",
      ai:          "✦ CiVi AI",
      about:       "About",
      sub:         "Maharashtra Property Intelligence",
      drawerSub:   "Civitas Atlas Technologies · Pune",
      footerTxt:   "Developed by Civitas Atlas Technologies Pvt. Ltd. · MahaRERA Compliant",
      clientsLbl:  "Our Clients & Partners"
    },
    mr: {
      overview:    "आढावा",
      fsi:         "FSI अटलस",
      landrecords: "जमीन नोंदी",
      listings:    "खरेदी / विक्री",
      legal:       "कायदेशीर केंद्र",
      security:    "सुरक्षा",
      broker:      "दलाल",
      ai:          "✦ CiVi AI",
      about:       "आमच्याबद्दल",
      sub:         "महाराष्ट्र मालमत्ता माहिती",
      drawerSub:   "Civitas Atlas Technologies · पुणे",
      footerTxt:   "Civitas Atlas Technologies Pvt. Ltd. · MahaRERA अनुरूप",
      clientsLbl:  "आमचे ग्राहक आणि भागीदार"
    }
  };

  /* ── THEME ─────────────────────────────────────────────── */
  function applyTheme() {
    document.body.classList.toggle("light-mode", !isDark);
    const cb = document.getElementById("themeToggle");
    if (cb) cb.checked = !isDark;
  }

  window.toggleTheme = function () {
    isDark = !isDark;
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    applyTheme();
  };

  /* ── LANGUAGE ──────────────────────────────────────────── */
  function applyLang() {
    const L   = NAV_LABELS[lang];
    const btn = document.getElementById("langBtn");

    /* button label */
    if (btn) {
      btn.textContent = lang === "en" ? "MR" : "EN";
      btn.title       = lang === "en" ? "मराठीत बदला" : "Switch to English";
    }

    /* drawer items */
    document.querySelectorAll("[data-nav]").forEach(function (el) {
      const key = el.getAttribute("data-nav");
      if (!L[key]) return;
      /* preserve the icon span if present */
      const icon = el.querySelector(".di-icon");
      if (icon) {
        /* drawer link — replace text node after icon */
        const span = el.querySelectorAll("span")[1];
        if (span) span.textContent = L[key].replace(/^✦\s*/, "");
      } else {
        /* tab link — full text */
        el.textContent = L[key];
      }
    });

    /* header subtitle */
    const sub = document.querySelector(".header-sub");
    if (sub) sub.textContent = L.sub;

    /* drawer subtitle */
    const dSub = document.querySelector(".drawer-sub");
    if (dSub) dSub.textContent = L.drawerSub;

    /* footer */
    const foot = document.querySelector(".drawer-foot");
    if (foot) foot.textContent = L.footerTxt;

    /* clients label */
    const clbl = document.querySelector(".clients-label");
    if (clbl) clbl.textContent = L.clientsLbl;

    /* page-specific content translations */
    applyPageTranslations();

    if (typeof window.mahaatlasSecurityRefresh === "function")
      window.mahaatlasSecurityRefresh();
  }

  window.toggleLang = function () {
    lang = lang === "en" ? "mr" : "en";
    localStorage.setItem(LANG_KEY, lang);
    applyLang();
  };

  /* ── PAGE-SPECIFIC TRANSLATIONS ────────────────────────── */
  const PAGE_STRINGS = {
    en: {
      /* FSI page */
      "fsi-h":            "FSI Atlas",
      "fsi-calc-heading": "FSI Calculator",
      "fsi-calc-sub":     "Select city & land type to check FSI limits and buildable area",
      /* headerTitle — these are the .ht-page span values only */
      "headerTitle":      { overview:"Overview", fsi:"FSI Atlas",
                            landrecords:"Land Records", listings:"Buy / Sell",
                            legal:"Legal Atlas", security:"Security Analysis",
                            broker:"Broker", ai:"CiVi AI", about:"About" },
      /* CiVi AI page */
      "ai-welcome-title": "CiVi AI — MahaAtlas Assistant",
      "ai-welcome-sub":   "Ask anything about FSI, land types, DCPR, TDR, stamp duty, RERA, or Maharashtra real-estate regulations.",
      "ai-sidebar-session":"Session",
      /* broker */
      "broker-intro":     "Estimate brokerage with GST for quick client quotes.",
      /* security */
      "sec-intro":        "Run through the checklist. Your risk score updates as you answer."
    },
    mr: {
      "fsi-h":            "FSI अटलस",
      "fsi-calc-heading": "FSI कॅल्क्युलेटर",
      "fsi-calc-sub":     "FSI मर्यादा आणि बांधकाम क्षेत्र तपासण्यासाठी शहर आणि जमीन प्रकार निवडा",
      "headerTitle":      { overview:"आढावा", fsi:"FSI अटलस",
                            landrecords:"जमीन नोंदी", listings:"खरेदी / विक्री",
                            legal:"कायदेशीर केंद्र", security:"सुरक्षा विश्लेषण",
                            broker:"दलाल", ai:"CiVi AI", about:"आमच्याबद्दल" },
      "ai-welcome-title": "CiVi AI — MahaAtlas सहाय्यक",
      "ai-welcome-sub":   "FSI, जमीन प्रकार, DCPR, TDR, मुद्रांक शुल्क, RERA किंवा महाराष्ट्र रिअल इस्टेट नियमांबद्दल कोणतेही विचारा.",
      "ai-sidebar-session":"सत्र",
      "broker-intro":     "द्रुत ग्राहक कोटसाठी GST सह दलालीचा अंदाज.",
      "sec-intro":        "चेकलिस्ट पूर्ण करा. हो / नाही उत्तरांसह धोका गुण अपडेट होतो."
    }
  };

  function applyPageTranslations() {
    const S    = PAGE_STRINGS[lang];
    const page = document.body.dataset.page || "overview";

    /* header title — update ONLY the .ht-page span, preserving MahaAtlas brand */
    const ht = document.getElementById("headerTitle");
    if (ht && S.headerTitle && S.headerTitle[page]) {
      /* Rebuild the span structure every time so it's always correct */
      ht.innerHTML =
        '<span class="ht-brand">MahaAtlas</span>' +
        '<span class="ht-sep"> | </span>' +
        '<span class="ht-page">' + S.headerTitle[page] + '</span>';
    }

    /* elements by id */
    ["fsi-h","fsi-calc-heading","fsi-calc-sub",
     "ai-welcome-title","ai-welcome-sub"].forEach(function(id) {
      const el = document.getElementById(id);
      if (el && S[id]) el.textContent = S[id];
    });
  }

  /* ── DRAWER / NAV ──────────────────────────────────────── */
  window.openDrawer = function () {
    document.getElementById("drawer")?.classList.add("open");
    document.getElementById("overlay")?.classList.add("open");
  };
  window.closeDrawer = function () {
    document.getElementById("drawer")?.classList.remove("open");
    document.getElementById("overlay")?.classList.remove("open");
  };

  function highlightNav() {
    const page = document.body.dataset.page || "overview";
    document.querySelectorAll("[data-nav]").forEach(function (el) {
      el.classList.toggle("active", el.getAttribute("data-nav") === page);
    });
  }

  /* ── CLIENTS MARQUEE ───────────────────────────────────── */
  /* Only injected on pages that have #clients-mount */
  const CLIENTS = [
    { name: "Adani Group",           icon: "🏙️" },
    { name: "Godrej Properties",     icon: "🏢" },
    { name: "Kolte Patil Developers",icon: "🏗️" },
    { name: "Kumar Properties",      icon: "🏛️" },
    { name: "Mantra Properties",     icon: "🏠" },
    { name: "Kohinoor Group",        icon: "💎" },
    { name: "Krisala Group",         icon: "🌟" },
    { name: "Garve Associates",      icon: "🤝" }
  ];

  function buildClientItem(c) {
    return '<div class="client-item">' +
      '<span class="client-icon">' + c.icon + '</span>' +
      '<span class="client-name">' + c.name + '</span>' +
      '</div>';
  }

  function injectClients() {
    const mount = document.getElementById("clients-mount");
    if (!mount) return;

    /* Double the list so the marquee loops with zero gap */
    const items = CLIENTS.concat(CLIENTS)
                         .map(buildClientItem)
                         .join("");

    mount.innerHTML =
      '<div class="clients-section">' +
        '<div class="clients-label" id="clients-label">' +
          NAV_LABELS[lang].clientsLbl +
        '</div>' +
        '<div class="clients-marquee-wrap">' +
          '<div class="clients-track">' + items + '</div>' +
        '</div>' +
      '</div>';
  }

  /* ── SCROLL BEHAVIOUR ─────────────────────────────────── */
  /* Hide header when scrolling DOWN fast, reveal on scroll UP.
     Add .scrolled (flat rectangle) once past 10px from top.    */
  (function () {
    var header     = document.querySelector(".main-header");
    if (!header) return;

    var lastY      = window.scrollY;
    var ticking    = false;
    var THRESHOLD  = 60;   /* px scrolled down before hiding */
    var hideAt     = 0;    /* Y position where we started scrolling down */

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    function update() {
      var y     = window.scrollY;
      var delta = y - lastY;

      /* ── scrolled class: flat rectangle when > 10px from top ── */
      header.classList.toggle("scrolled", y > 10);

      /* ── hide / show logic ── */
      if (delta > 0) {
        /* scrolling DOWN */
        if (hideAt === 0) hideAt = y;
        if (y - hideAt > THRESHOLD) {
          header.classList.add("header-hidden");
        }
      } else {
        /* scrolling UP — always show */
        hideAt = 0;
        header.classList.remove("header-hidden");
      }

      lastY   = y;
      ticking = false;
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    /* run once on load to set initial state */
    update();
  })();

  /* ── INIT ──────────────────────────────────────────────── */
  window.addEventListener("DOMContentLoaded", function () {
    /* Set body padding = actual header height (dynamic, handles AI setup banner) */
    var hdr = document.querySelector(".main-header");
    if (hdr) {
      function syncPad() { document.body.style.paddingTop = hdr.offsetHeight + "px"; }
      syncPad();
      if (window.ResizeObserver) {
        new ResizeObserver(syncPad).observe(hdr);
      }
    }
    applyTheme();
    highlightNav();
    injectClients();
    applyLang();   /* apply saved language on load — also rebuilds header spans */
  });
})();
