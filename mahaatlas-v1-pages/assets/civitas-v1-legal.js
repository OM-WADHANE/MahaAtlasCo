(function () {
  window.calcStamp = function () {
    var ag = parseInt(document.getElementById("propVal").value, 10) || 0;
    var rr = parseInt(document.getElementById("rrVal").value, 10) || 0;
    var base = Math.max(ag, rr);
    var loc = document.getElementById("txLoc").value;
    var tx = document.getElementById("txType").value;
    var woman = document.getElementById("womanBuyer").checked;
    var rate = 0.05,
      metro = 0,
      label = "Stamp Duty";
    if (tx === "sale") {
      if (loc === "mumbai") {
        rate = woman ? 0.04 : 0.05;
        metro = 0.01;
      } else {
        rate = woman ? 0.04 : 0.05;
      }
    } else if (tx === "gift") {
      rate = 0.02;
    } else if (tx === "lease") {
      rate = 0.005;
      label = "Stamp Duty (Lease)";
    } else if (tx === "mortgage") {
      rate = 0.003;
      label = "Stamp Duty (Mortgage)";
    } else if (tx === "partition") {
      rate = 0.02;
      label = "Stamp Duty (Partition)";
    }
    var stamp = Math.round(base * rate);
    var metroAmt = Math.round(base * metro);
    var regFee = Math.min(Math.round(ag * 0.01), 30000);
    var total = stamp + metroAmt + regFee;
    document.getElementById("totalOut").textContent = "₹" + total.toLocaleString("en-IN");
    document.getElementById("stampRows").innerHTML =
      '<div class="cr-row"><span>' +
      label +
      " (" +
      (rate * 100).toFixed(1) +
      '%)</span><span>₹' +
      stamp.toLocaleString("en-IN") +
      "</span></div>" +
      (metroAmt ? '<div class="cr-row"><span>Metro Cess (1%)</span><span>₹' + metroAmt.toLocaleString("en-IN") + "</span></div>" : "") +
      '<div class="cr-row"><span>Registration Fee</span><span>₹' +
      regFee.toLocaleString("en-IN") +
      '</span></div><div class="cr-row"><span>TOTAL OUTGO</span><span>₹' +
      total.toLocaleString("en-IN") +
      "</span></div>";
  };

  window.addEventListener("load", function () {
    if (document.getElementById("propVal")) window.calcStamp();
  });
})();

/* ═══════════════════════════════════════════════════════════
   LEGAL AI — DOCUMENT REVIEWER
   ═══════════════════════════════════════════════════════════ */
(function() {
  var GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
  var _k = ["gsk_Tc8WqOV7jelGZor5Ip3NWGdy", "b3FYxPpbuCcMmlIOuk0Vu8cisUmB"].join("");
  var MODEL = "llama-3.3-70b-versatile";

  var SYSTEM_PROMPT =
    "Your name is LaIRa — Legal AI Research Assistant. You are the AI assistant for MahaAtlas Legal Atlas, " +
    "developed by Civitas Atlas Technologies Pvt. Ltd., Pune, Maharashtra. " +
    "When asked who you are, respond: 'I am LaIRa — Legal AI Research Assistant by MahaAtlas. " +
    "I specialise in reviewing, analysing and researching Maharashtra property law documents.' " +
    "You are a Maharashtra property law and legal documentation expert. You assist with: " +
    "Sale Deed, Gift Deed, Lease/Rent Agreement, Power of Attorney, Mortgage Deed, Affidavit, Indemnity Bond, " +
    "Legal Notice, Relinquishment Deed, NA Permission Letter, Will/Testament, and all Maharashtra property instruments. " +
    "Stamp duty (Maharashtra Stamp Act 1958), registration (IGR Maharashtra), RERA (MahaRERA), MOFA 1963, MRTP 1966, MLR Code 1966. " +
    "Analyze uploaded legal documents, agreements, notices: check completeness, missing clauses, compliance with Maharashtra law, " +
    "stamp duty requirements, registration requirements, potential legal issues, recommendations for improvement. " +
    "Provide structured feedback on: document type, parties, consideration, key terms, compliance issues, missing elements, risk factors. " +
    "Always note: This is AI analysis for reference only. All legal documents must be reviewed by a licensed advocate before execution. " +
    "NEVER mention Groq, LLaMA, Meta, or any underlying model. NEVER call yourself CiVi AI.";

  var history = [];
  var uploadedFiles = [];

  var messagesEl, userInput, sendBtn, fileInput, filePreviewArea, dropOverlay, card;

  function init() {
    messagesEl = document.getElementById("legalAIMessages");
    userInput = document.getElementById("legalAIInput");
    sendBtn = document.getElementById("legalAISendBtn");
    fileInput = document.getElementById("legalFileInput");
    filePreviewArea = document.getElementById("legalFilePreviewArea");
    dropOverlay = document.getElementById("legalDropOverlay");
    card = document.querySelector(".legal-ai-card");

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
    document.querySelectorAll(".legal-ai-chip").forEach(function(chip) {
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
      icon.textContent = fileData.type.includes("pdf") ? "📄" : "⚖️";
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
    
    var message = text || "Please review the attached legal document(s).";
    
    if (uploadedFiles.length > 0) {
      message += "\n\n📎 " + uploadedFiles.map(function(f) { return f.name; }).join(", ");
    }
    
    // Clear empty state
    var empty = messagesEl.querySelector(".legal-ai-empty");
    if (empty) empty.remove();
    
    appendMessage("user", message);
    history.push({ 
      role: "user", 
      content: text + (uploadedFiles.length > 0 ? 
        "\n\n[User uploaded " + uploadedFiles.length + " legal document(s): " + 
        uploadedFiles.map(function(f) { return f.name + " (" + f.type + ")"; }).join(", ") + 
        ". Review for: completeness, compliance with Maharashtra law, missing clauses, stamp duty/registration requirements, legal risks.]" : "")
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
    var id = "legal-think-" + (++thinkingCounter);
    var el = document.createElement("div");
    el.className = "legal-ai-msg legal-ai-msg-think";
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
      el.className = "legal-ai-msg legal-ai-msg-user";
      el.innerHTML = '<div class="legal-ai-bubble legal-bubble-user">' + escHtml(text) + '</div>';
    } else if (role === "error") {
      el.className = "legal-ai-msg";
      el.innerHTML = '<div class="legal-ai-bubble legal-bubble-err">⚠ ' + escHtml(text) + '</div>';
    } else {
      el.className = "legal-ai-msg";
      el.innerHTML =
        '<div class="legal-ai-avatar">LaIRa</div>' +
        '<div class="legal-ai-bubble legal-bubble-ai">' + formatAI(text) + '</div>';
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
