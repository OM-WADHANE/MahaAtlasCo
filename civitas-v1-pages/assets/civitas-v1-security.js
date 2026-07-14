(function () {
  var checks = [
    { label: { en: "30-Year Title Chain Verified", mr: "३० वर्षांची मालमत्ता साखळी" }, weight: 20, checked: true },
    { label: { en: "Encumbrance Certificate — Clear", mr: "भार प्रमाणपत्र — स्वच्छ" }, weight: 20, checked: true },
    { label: { en: "NA Permission Obtained (Sec. 44 MLR)", mr: "एनए परवानगी मिळाली" }, weight: 15, checked: true },
    { label: { en: "Property Tax — Fully Paid", mr: "मालमत्ता कर — भरलेला" }, weight: 10, checked: false },
    { label: { en: "RERA Registration Verified", mr: "RERA नोंदणी सत्यापित" }, weight: 15, checked: true },
    { label: { en: "OC / CC Available", mr: "व्याप प्रमाणपत्र उपलब्ध" }, weight: 10, checked: true },
    { label: { en: "No Litigation on Record", mr: "कोणतीही खटला नाही" }, weight: 10, checked: false },
  ];

  function currentLang() {
    return localStorage.getItem("mahaatlas_v1_lang") || "en";
  }

  window.renderChecks = function () {
    var lang = currentLang();
    var html = "";
    checks.forEach(function (c, i) {
      html +=
        '<div class="check-item"><div class="toggle-wrap"><input type="checkbox"' +
        (c.checked ? " checked" : "") +
        ' onchange="window.toggleCheck(' +
        i +
        ',this.checked)"><div class="toggle-track"></div><div class="toggle-thumb"></div></div><div class="check-text">' +
        c.label[lang] +
        '</div><div class="check-weight">' +
        c.weight +
        "pt</div></div>";
    });
    var list = document.getElementById("checkList");
    if (list) list.innerHTML = html;
    window.updateRisk();
  };

  window.toggleCheck = function (i, v) {
    checks[i].checked = v;
    window.updateRisk();
  };

  window.updateRisk = function () {
    var total = checks.reduce(function (a, c) {
      return a + (c.checked ? c.weight : 0);
    }, 0);
    var pct = Math.min(100, total);
    var needle = 100 - pct;
    var needleEl = document.getElementById("riskNeedle");
    var scoreEl = document.getElementById("riskScore");
    var labelEl = document.getElementById("riskLabel");
    if (needleEl) needleEl.style.left = needle + "%";
    if (scoreEl) scoreEl.textContent = pct;
    if (labelEl) {
      var lbl = pct >= 80 ? "LOW RISK — Strong Title" : pct >= 50 ? "MODERATE RISK — Verify Pending Items" : "HIGH RISK — Major Issues Found";
      var col = pct >= 80 ? "#4ade80" : pct >= 50 ? "#facc15" : "#f87171";
      labelEl.textContent = lbl;
      if (scoreEl) scoreEl.style.color = col;
    }
  };

  window.mahaatlasSecurityRefresh = function () {
    window.renderChecks();
  };

  window.addEventListener("load", function () {
    if (document.getElementById("checkList")) window.renderChecks();
  });
})();

/* ═══════════════════════════════════════════════════════════
   SECURITY AI — DOCUMENT ANALYSIS
   ═══════════════════════════════════════════════════════════ */
(function() {
  var GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
  var _k = ["gsk_Tc8WqOV7jelGZor5Ip3NWGdy", "b3FYxPpbuCcMmlIOuk0Vu8cisUmB"].join("");
  var MODEL = "llama-3.3-70b-versatile";

  var SYSTEM_PROMPT =
    "Your name is DiVA — Document Intelligence and Verification Assistant. You are built by MahaAtlas, developed by Civitas Atlas Technologies Pvt. Ltd., Pune, Maharashtra. " +
    "When asked who you are, respond: 'I am DiVA — Document Intelligence and Verification Assistant by MahaAtlas. I specialize in property document analysis, title verification, and due diligence for Maharashtra real estate.' " +
    "You are a Maharashtra property due diligence and title verification specialist. You assist with: " +
    "Title search, encumbrance certificate (EC) analysis, litigation risk, mortgage/lien detection, " +
    "RERA project verification, builder background check, society formation compliance (MOFA 1963), " +
    "ownership chain verification, tribal land restrictions (Sec 36 MLR), " +
    "NA conversion validity, occupancy certificate, completion certificate. " +
    "Analyze uploaded title deeds, encumbrance certificates, NOCs, property documents for verification. " +
    "Extract key information: property details, owner names, encumbrances, restrictions, red flags. " +
    "Provide structured risk scoring and recommendations. Always note: this is AI analysis, final verification requires a licensed advocate or title company. " +
    "NEVER mention Groq, LLaMA, Meta, OpenAI, or any underlying AI model. Never call yourself CiVi AI.";

  var history = [];
  var uploadedFiles = [];

  var messagesEl, userInput, sendBtn, fileInput, filePreviewArea, dropOverlay, card;

  function init() {
    messagesEl = document.getElementById("secAIMessages");
    userInput = document.getElementById("secAIInput");
    sendBtn = document.getElementById("secAISendBtn");
    fileInput = document.getElementById("secFileInput");
    filePreviewArea = document.getElementById("secFilePreviewArea");
    dropOverlay = document.getElementById("secDropOverlay");
    card = document.querySelector(".sec-ai-card");

    if (!messagesEl || !userInput || !sendBtn) return;

    sendBtn.addEventListener("click", handleSend);
    userInput.addEventListener("keydown", function(e) {
      if (e.key === "Enter") { e.preventDefault(); handleSend(); }
    });

    // File input
    if (fileInput) fileInput.addEventListener("change", handleFileSelect);

    // Drag & drop
    if (card && dropOverlay) {
      card.addEventListener("dragover", function(e) {
        e.preventDefault();
        dropOverlay.classList.add("active");
      });
      card.addEventListener("dragleave", function(e) {
        if (e.target === card) dropOverlay.classList.remove("active");
      });
      card.addEventListener("drop", function(e) {
        e.preventDefault();
        dropOverlay.classList.remove("active");
        handleFileDrop(e.dataTransfer.files);
      });
    }

    // Quick chips
    document.querySelectorAll(".sec-ai-chip").forEach(function(chip) {
      chip.addEventListener("click", function() {
        userInput.value = chip.getAttribute("data-q");
        handleSend();
      });
    });
  }

  function handleFileSelect(e) {
    addFiles(e.target.files);
  }

  function handleFileDrop(files) {
    addFiles(files);
  }

  function addFiles(files) {
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      
      if (file.size > 10 * 1024 * 1024) {
        appendMessage("error", "File " + file.name + " is too large. Maximum 10MB.");
        continue;
      }

      var reader = new FileReader();
      reader.onload = (function(f) {
        return function(e) {
          var fileData = {
            name: f.name,
            size: f.size,
            type: f.type,
            data: e.target.result
          };
          uploadedFiles.push(fileData);
          renderFilePreview(fileData);
        };
      })(file);
      reader.readAsDataURL(file);
    }
  }

  function renderFilePreview(fileData) {
    filePreviewArea.style.display = "flex";
    
    var preview = document.createElement("div");
    preview.className = "ai-file-preview";
    preview.dataset.filename = fileData.name;

    if (fileData.type.startsWith("image/")) {
      var img = document.createElement("img");
      img.src = fileData.data;
      img.className = "ai-fp-img";
      preview.appendChild(img);
    } else {
      var icon = document.createElement("div");
      icon.className = "ai-fp-icon";
      icon.textContent = fileData.type.includes("pdf") ? "📄" : "📋";
      preview.appendChild(icon);
    }

    var info = document.createElement("div");
    info.className = "ai-fp-info";
    
    var name = document.createElement("div");
    name.className = "ai-fp-name";
    name.textContent = fileData.name;
    
    var size = document.createElement("div");
    size.className = "ai-fp-size";
    size.textContent = formatFileSize(fileData.size);
    
    info.appendChild(name);
    info.appendChild(size);
    preview.appendChild(info);

    var removeBtn = document.createElement("button");
    removeBtn.className = "ai-fp-remove";
    removeBtn.textContent = "✕";
    removeBtn.onclick = function() {
      removeFile(fileData.name);
    };
    preview.appendChild(removeBtn);

    filePreviewArea.appendChild(preview);
  }

  function removeFile(filename) {
    uploadedFiles = uploadedFiles.filter(function(f) { return f.name !== filename; });
    var preview = filePreviewArea.querySelector('[data-filename="' + filename + '"]');
    if (preview) preview.remove();
    
    if (uploadedFiles.length === 0) {
      filePreviewArea.style.display = "none";
    }
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function handleSend() {
    var text = userInput.value.trim();
    if ((!text && uploadedFiles.length === 0) || sendBtn.disabled) return;
    
    var message = text || "Please analyze the attached property document(s).";
    
    if (uploadedFiles.length > 0) {
      message += "\n\n📎 " + uploadedFiles.map(function(f) { return f.name; }).join(", ");
    }
    
    // Clear empty state
    var empty = messagesEl.querySelector(".sec-ai-empty");
    if (empty) empty.remove();
    
    appendMessage("user", message);
    history.push({ 
      role: "user", 
      content: text + (uploadedFiles.length > 0 ? 
        "\n\n[User uploaded " + uploadedFiles.length + " property document(s): " + 
        uploadedFiles.map(function(f) { return f.name + " (" + f.type + ")"; }).join(", ") + 
        ". Analyze for title verification, encumbrances, ownership issues, and risk factors.]" : "")
    });
    
    userInput.value = "";
    uploadedFiles = [];
    filePreviewArea.innerHTML = "";
    filePreviewArea.style.display = "none";
    
    sendToGroq();
  }

  function sendToGroq() {
    var thinkingId = appendThinking();
    sendBtn.disabled = true;

    fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + _k
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: SYSTEM_PROMPT }].concat(history),
        temperature: 0.7,
        max_tokens: 1024
      })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      removeThinking(thinkingId);
      sendBtn.disabled = false;

      if (data.error) {
        var msg = data.error.message || "API error.";
        appendMessage("error", msg.toLowerCase().includes("rate") ? 
          "Rate limit reached. Please wait and try again." : "Error: " + msg);
        return;
      }

      var reply = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      if (!reply) { 
        appendMessage("error", "No response received."); 
        return; 
      }
      
      history.push({ role: "assistant", content: reply });
      appendMessage("ai", reply);
    })
    .catch(function(err) {
      removeThinking(thinkingId);
      sendBtn.disabled = false;
      appendMessage("error", "Network error: " + err.message);
    });
  }

  var thinkingCounter = 0;
  function appendThinking() {
    var id = "sec-think-" + (++thinkingCounter);
    var el = document.createElement("div");
    el.className = "sec-ai-msg sec-ai-msg-think";
    el.id = id;
    el.innerHTML =
      '<span class="ai-thinking-dot"></span>' +
      '<span class="ai-thinking-dot"></span>' +
      '<span class="ai-thinking-dot"></span>';
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return id;
  }

  function removeThinking(id) { 
    var el = document.getElementById(id); 
    if (el) el.remove(); 
  }

  function appendMessage(role, text) {
    var el = document.createElement("div");
    
    if (role === "user") {
      el.className = "sec-ai-msg sec-ai-msg-user";
      el.innerHTML = '<div class="sec-ai-bubble sec-bubble-user">' + escHtml(text) + '</div>';
    } else if (role === "error") {
      el.className = "sec-ai-msg";
      el.innerHTML = '<div class="sec-ai-bubble sec-bubble-err">⚠ ' + escHtml(text) + '</div>';
    } else {
      el.className = "sec-ai-msg";
      el.innerHTML =
        '<div class="sec-ai-avatar">DiVA</div>' +
        '<div class="sec-ai-bubble sec-bubble-ai">' + formatAI(text) + '</div>';
    }
    
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function escHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
  }

  function formatAI(text) {
    text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    var lines = text.split("\n");
    var out = [], inList = false;
    lines.forEach(function(line) {
      var bl = line.match(/^[\*\-]\s+(.*)/);
      if (bl) {
        if (!inList) { out.push('<ul>'); inList = true; }
        out.push("<li>" + bl[1] + "</li>");
      } else {
        if (inList) { out.push('</ul>'); inList = false; }
        if (line.trim()) out.push("<p>" + line + "</p>");
      }
    });
    if (inList) out.push('</ul>');
    return out.join("");
  }

  window.addEventListener("DOMContentLoaded", init);
})();
