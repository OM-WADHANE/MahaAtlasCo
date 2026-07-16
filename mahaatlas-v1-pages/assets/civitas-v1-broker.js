/* civitas-v1-broker.js
   Broker Module — Commission Calculator + CiVi AI Chat + Printable Report
   MahaAtlas · Civitas Atlas Technologies */
(function () {

  var _k = ["gsk_Tc8WqOV7jelGZor5Ip3NWGdy","b3FYxPpbuCcMmlIOuk0Vu8cisUmB"].join("");
  var GROQ_URL   = "https://api.groq.com/openai/v1/chat/completions";
  var GROQ_MODEL = "llama-3.3-70b-versatile";
  var brkHistory = [];
  var brkUploadedFiles = [];

  var SYSTEM_PROMPT =
    "You are CiVi AI, the Broker Assistant for MahaAtlas by Civitas Atlas Technologies, Pune. " +
    "NEVER mention Groq, LLaMA, or any AI infrastructure provider. " +
    "You specialise in Maharashtra real estate brokerage: commission calculation, GST on brokerage (18%), " +
    "TDS under Sec. 194H of IT Act (5% above ₹15,000), stamp duty (Maharashtra Stamp Act 1958), " +
    "registration fee (IGR Maharashtra), MahaRERA agent compliance (Sec. 9 RERA), " +
    "buyer/seller settlement, printable commission quotes. " +
    "When asked to calculate, always show: transaction value, brokerage %, base brokerage, GST 18%, total, and who pays. " +
    "You can analyze uploaded brokerage bills, invoices, stamp duty receipts, registration receipts. " +
    "Extract: amount, GST, commission %, transaction value, verify calculations, check for errors or overcharging. " +
    "Format numbers in Indian style (₹ lakhs/crore). Keep answers concise. " +
    "End with: 'Verify with a licensed broker or CA before finalising.'";

  /* ══════════════════════════════════════════════════
     COMMISSION CALCULATOR
  ══════════════════════════════════════════════════ */
  window.calcBrokerage = function () {
    var val   = parseFloat((document.getElementById("brkVal") || {}).value) || 0;
    var rate  = parseFloat((document.getElementById("brkRate") || {}).value) / 100;
    var mult  = parseInt((document.getElementById("brkParty") || {}).value, 10) || 1;

    var brk   = Math.round(val * rate * mult);
    var gst   = Math.round(brk * 0.18);
    var total = brk + gst;
    var tds   = brk > 15000 ? Math.round(brk * 0.05) : 0;
    var net   = total - tds;

    var amtEl = document.getElementById("commAmt");
    var noteEl = document.getElementById("commNote");
    var bdEl  = document.getElementById("commBreakdown");

    if (amtEl)  amtEl.textContent  = "₹" + total.toLocaleString("en-IN");
    if (noteEl) noteEl.textContent = "Brokerage ₹" + brk.toLocaleString("en-IN") + " + GST ₹" + gst.toLocaleString("en-IN");
    if (bdEl) {
      var rows = [
        ["Transaction Value",   "₹" + val.toLocaleString("en-IN")],
        ["Base Brokerage",      "₹" + brk.toLocaleString("en-IN")],
        ["GST @ 18%",           "₹" + gst.toLocaleString("en-IN")],
        ["Total Payable",       "₹" + total.toLocaleString("en-IN")],
        ["TDS @ 5%" + (tds ? "" : " (N/A)"), tds ? "−₹" + tds.toLocaleString("en-IN") : "Below threshold"],
        ["Net to Broker",       "₹" + net.toLocaleString("en-IN")]
      ];
      bdEl.innerHTML = rows.map(function(r) {
        return '<div class="comm-bd-row"><span>' + r[0] + '</span><span>' + r[1] + '</span></div>';
      }).join("");
    }
  };

  /* ══════════════════════════════════════════════════
     PRINTABLE COMMISSION REPORT
  ══════════════════════════════════════════════════ */
  window.brkPrintReport = function () {
    var val      = parseFloat((document.getElementById("brkVal") || {}).value) || 0;
    var rateEl   = document.getElementById("brkRate");
    var partyEl  = document.getElementById("brkParty");
    var propDesc = (document.getElementById("brkPropDesc") || {}).value || "—";
    var client   = (document.getElementById("brkClientName") || {}).value || "—";
    var rate     = parseFloat((rateEl || {}).value) || 2;
    var mult     = parseInt((partyEl || {}).value, 10) || 1;
    var rateLabel= rateEl ? rateEl.options[rateEl.selectedIndex].text : rate + "%";
    var partyLabel= partyEl ? partyEl.options[partyEl.selectedIndex].text : "—";
    var brk      = Math.round(val * (rate / 100) * mult);
    var gst      = Math.round(brk * 0.18);
    var total    = brk + gst;
    var tds      = brk > 15000 ? Math.round(brk * 0.05) : 0;
    var net      = total - tds;
    var today    = new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"});

    var html =
      '<div style="font-family:Georgia,serif;max-width:700px;margin:auto;padding:30px 32px;color:#111;">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #6D28D9;padding-bottom:14px;margin-bottom:20px;">' +
          '<div>' +
            '<div style="font-size:18px;font-weight:700;color:#2d1960;letter-spacing:0.5px;">COMMISSION STATEMENT</div>' +
            '<div style="font-size:10px;color:#888;font-family:monospace;margin-top:4px;">MahaAtlas · Broker Module · Civitas Atlas Technologies</div>' +
          '</div>' +
          '<div style="text-align:right;font-size:11px;color:#666;font-family:monospace;">' +
            '<div>Date: ' + today + '</div>' +
            '<div>Ref: BRK-' + Date.now().toString().slice(-6) + '</div>' +
          '</div>' +
        '</div>' +

        '<table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:20px;">' +
          '<tr style="background:#f3f0ff;"><td style="padding:8px 12px;font-weight:600;width:50%;">Client Name</td><td style="padding:8px 12px;">' + client + '</td></tr>' +
          '<tr><td style="padding:8px 12px;font-weight:600;">Property</td><td style="padding:8px 12px;">' + propDesc + '</td></tr>' +
          '<tr style="background:#f3f0ff;"><td style="padding:8px 12px;font-weight:600;">Transaction Value</td><td style="padding:8px 12px;font-family:monospace;">₹' + val.toLocaleString("en-IN") + '</td></tr>' +
          '<tr><td style="padding:8px 12px;font-weight:600;">Commission Rate</td><td style="padding:8px 12px;">' + rateLabel + '</td></tr>' +
          '<tr style="background:#f3f0ff;"><td style="padding:8px 12px;font-weight:600;">Charged To</td><td style="padding:8px 12px;">' + partyLabel + '</td></tr>' +
        '</table>' +

        '<div style="border:1px solid #d1d5db;border-radius:8px;overflow:hidden;margin-bottom:20px;">' +
          '<div style="background:#6D28D9;color:#fff;padding:10px 14px;font-size:11px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;">Commission Breakdown</div>' +
          '<table style="width:100%;border-collapse:collapse;font-size:12px;">' +
            '<tr><td style="padding:9px 14px;border-bottom:1px solid #f0f0f0;">Base Brokerage</td><td style="padding:9px 14px;border-bottom:1px solid #f0f0f0;text-align:right;font-family:monospace;">₹' + brk.toLocaleString("en-IN") + '</td></tr>' +
            '<tr style="background:#faf9ff;"><td style="padding:9px 14px;border-bottom:1px solid #f0f0f0;">GST @ 18% (Brokerage Service)</td><td style="padding:9px 14px;border-bottom:1px solid #f0f0f0;text-align:right;font-family:monospace;">₹' + gst.toLocaleString("en-IN") + '</td></tr>' +
            '<tr><td style="padding:9px 14px;border-bottom:1px solid #f0f0f0;font-weight:600;">Total Payable</td><td style="padding:9px 14px;border-bottom:1px solid #f0f0f0;text-align:right;font-family:monospace;font-weight:700;color:#2d1960;">₹' + total.toLocaleString("en-IN") + '</td></tr>' +
            '<tr style="background:#faf9ff;"><td style="padding:9px 14px;border-bottom:1px solid #f0f0f0;">TDS @ 5% (Sec. 194H)' + (tds ? "" : " — Below ₹15,000 threshold") + '</td><td style="padding:9px 14px;border-bottom:1px solid #f0f0f0;text-align:right;font-family:monospace;color:#dc2626;">' + (tds ? '−₹' + tds.toLocaleString("en-IN") : 'NIL') + '</td></tr>' +
            '<tr><td style="padding:9px 14px;font-weight:700;font-size:13px;">Net Receivable by Broker</td><td style="padding:9px 14px;text-align:right;font-family:monospace;font-weight:700;font-size:13px;color:#059669;">₹' + net.toLocaleString("en-IN") + '</td></tr>' +
          '</table>' +
        '</div>' +

        '<div style="display:flex;gap:30px;margin-top:50px;">' +
          '<div style="flex:1;text-align:center;"><div style="border-top:1px solid #333;padding-top:6px;font-size:10px;color:#666;">Client Signature</div></div>' +
          '<div style="flex:1;text-align:center;"><div style="border-top:1px solid #333;padding-top:6px;font-size:10px;color:#666;">Broker Signature &amp; Stamp</div></div>' +
        '</div>' +

        '<div style="margin-top:28px;padding-top:10px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;font-size:9px;color:#9ca3af;font-family:monospace;">' +
          '<span>MahaAtlas · Broker Module · civitasatlas.vercel.app</span>' +
          '<span>Generated by CiVi AI · ' + today + '</span>' +
        '</div>' +
        '<div style="font-size:9px;color:#aaa;margin-top:6px;font-style:italic;">Disclaimer: This is a computer-generated estimate. Actual commission, GST and TDS may vary. Verify with a licensed broker or CA.</div>' +
      '</div>';

    var w = window.open("","_blank","width=800,height=650");
    w.document.write('<!DOCTYPE html><html><head><title>Commission Report — MahaAtlas</title></head><body style="margin:0;padding:0;">' + html + '</body></html>');
    w.document.close();
    w.focus();
    setTimeout(function(){ w.print(); }, 400);
  };

  /* ══════════════════════════════════════════════════
     CIVI AI BROKER CHAT
  ══════════════════════════════════════════════════ */
  window.brkAskAI = function(q) {
    var inp = document.getElementById("brkAIInput");
    if (inp) { inp.value = q; }
    brkSendAI();
  };

  window.brkSendAI = function() {
    var inp = document.getElementById("brkAIInput");
    var q   = inp ? inp.value.trim() : "";
    if (!q && brkUploadedFiles.length === 0) return;
    
    var btn = document.getElementById("brkAISendBtn");
    btn.disabled = true;

    var message = q || "Please analyze the attached document(s).";
    if (brkUploadedFiles.length > 0) {
      message += "\n\n📎 " + brkUploadedFiles.map(function(f){ return f.name; }).join(", ");
    }

    inp.value = "";
    brkAppendMsg("user", message);
    brkHistory.push({ 
      role:"user", 
      content: q + (brkUploadedFiles.length > 0 ? 
        "\n\n[User uploaded " + brkUploadedFiles.length + " document(s): " + 
        brkUploadedFiles.map(function(f){ return f.name + " (" + f.type + ")"; }).join(", ") + 
        ". Analyze bill/invoice: extract amounts, GST, commission %, verify calculations.]" : "")
    });

    /* Clear files after sending */
    brkUploadedFiles = [];
    var previewArea = document.getElementById("brkFilePreviewArea");
    if (previewArea) {
      previewArea.innerHTML = "";
      previewArea.style.display = "none";
    }

    /* Remove empty state */
    var empty = document.querySelector(".brk-ai-empty");
    if (empty) empty.remove();

    var thinkId = brkAppendThinking();

    fetch(GROQ_URL, {
      method: "POST",
      headers: { "Content-Type":"application/json", "Authorization":"Bearer " + _k },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role:"system", content:SYSTEM_PROMPT }].concat(brkHistory),
        temperature: 0.5,
        max_tokens: 900
      })
    })
    .then(function(r){ return r.json(); })
    .then(function(data) {
      brkRemoveThinking(thinkId);
      btn.disabled = false;
      var reply = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      if (!reply) { brkAppendMsg("error","No response. Please try again."); return; }
      brkHistory.push({ role:"assistant", content:reply });
      brkAppendMsg("ai", reply);
    })
    .catch(function() {
      brkRemoveThinking(thinkId);
      btn.disabled = false;
      brkAppendMsg("error","Network error. Check your connection.");
    });
  };

  var _brkThinkN = 0;
  function brkAppendThinking() {
    var id = "brk-think-" + (++_brkThinkN);
    var el = document.createElement("div");
    el.className = "brk-ai-msg brk-ai-msg-think";
    el.id = id;
    el.innerHTML = '<span class="ai-thinking-dot"></span><span class="ai-thinking-dot"></span><span class="ai-thinking-dot"></span>';
    var msgs = document.getElementById("brkAIMessages");
    if (msgs) { msgs.appendChild(el); msgs.scrollTop = msgs.scrollHeight; }
    return id;
  }
  function brkRemoveThinking(id){ var el=document.getElementById(id); if(el) el.remove(); }

  function brkAppendMsg(role, text) {
    var msgs = document.getElementById("brkAIMessages");
    if (!msgs) return;
    var el = document.createElement("div");
    if (role === "user") {
      el.className = "brk-ai-msg brk-ai-msg-user";
      el.innerHTML = '<div class="brk-ai-bubble brk-bubble-user">' + escHtml(text) + '</div>';
    } else if (role === "error") {
      el.className = "brk-ai-msg brk-ai-msg-err";
      el.innerHTML = '<div class="brk-ai-bubble brk-bubble-err">⚠ ' + escHtml(text) + '</div>';
    } else {
      el.className = "brk-ai-msg brk-ai-msg-ai";
      el.innerHTML =
        '<div class="brk-ai-avatar">✦</div>' +
        '<div class="brk-ai-bubble brk-bubble-ai">' + fmtAI(text) + '</div>';
    }
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function escHtml(s){ return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br>"); }
  function fmtAI(t){
    t = t.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>");
    var lines=t.split("\n"), out=[], inList=false;
    lines.forEach(function(l){
      var b=l.match(/^[\*\-]\s+(.*)/);
      if(b){ if(!inList){out.push('<ul class="ai-ul">');inList=true;} out.push("<li>"+b[1]+"</li>"); }
      else { if(inList){out.push("</ul>");inList=false;} if(l.trim()) out.push("<p>"+l+"</p>"); }
    });
    if(inList) out.push("</ul>");
    return out.join("");
  }

  /* Enter key sends message */
  window.addEventListener("DOMContentLoaded", function() {
    var inp = document.getElementById("brkAIInput");
    if (inp) inp.addEventListener("keydown", function(e){ if(e.key==="Enter") brkSendAI(); });
    if (document.getElementById("brkVal")) calcBrokerage();

    /* ══ FILE UPLOAD HANDLERS ══ */
    var fileInput = document.getElementById("brkFileInput");
    var filePreviewArea = document.getElementById("brkFilePreviewArea");
    var dropOverlay = document.getElementById("brkDropOverlay");
    var card = document.querySelector(".brk-ai-card");

    if (fileInput) {
      fileInput.addEventListener("change", function(e) {
        handleBrkFiles(e.target.files);
      });
    }

    /* Drag & drop */
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
        handleBrkFiles(e.dataTransfer.files);
      });
    }

    function handleBrkFiles(files) {
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        
        if (file.size > 10 * 1024 * 1024) {
          brkAppendMsg("error", "File " + file.name + " is too large. Max 10MB.");
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
            brkUploadedFiles.push(fileData);
            renderBrkFilePreview(fileData);
          };
        })(file);
        reader.readAsDataURL(file);
      }
    }

    function renderBrkFilePreview(fileData) {
      if (filePreviewArea) filePreviewArea.style.display = "flex";
      
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
        icon.textContent = fileData.type.includes("pdf") ? "📄" : "💰";
        preview.appendChild(icon);
      }

      var info = document.createElement("div");
      info.className = "ai-fp-info";
      
      var name = document.createElement("div");
      name.className = "ai-fp-name";
      name.textContent = fileData.name;
      
      var size = document.createElement("div");
      size.className = "ai-fp-size";
      size.textContent = formatBrkFileSize(fileData.size);
      
      info.appendChild(name);
      info.appendChild(size);
      preview.appendChild(info);

      var removeBtn = document.createElement("button");
      removeBtn.className = "ai-fp-remove";
      removeBtn.textContent = "✕";
      removeBtn.onclick = function() {
        brkUploadedFiles = brkUploadedFiles.filter(function(f) { return f.name !== fileData.name; });
        preview.remove();
        if (brkUploadedFiles.length === 0 && filePreviewArea) {
          filePreviewArea.style.display = "none";
        }
      };
      preview.appendChild(removeBtn);

      if (filePreviewArea) filePreviewArea.appendChild(preview);
    }

    function formatBrkFileSize(bytes) {
      if (bytes < 1024) return bytes + " B";
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
      return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }
  });

})();


/* ═══════════════════════════════════════════════════════════
   STAMP DUTY & REGISTRATION CALCULATOR
   (Moved from Legal Atlas to Broker page)
   ═══════════════════════════════════════════════════════════ */
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
