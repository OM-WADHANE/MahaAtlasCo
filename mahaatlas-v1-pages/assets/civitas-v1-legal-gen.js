/* civitas-v1-legal-gen.js
   Legal Document Generator — MahaAtlas Legal Atlas
   Powered by LaIRa AI (Legal AI Research Assistant) · Civitas Atlas Technologies
*/
(function () {

  var _k = ["gsk_Tc8WqOV7jelGZor5Ip3NWGdy","b3FYxPpbuCcMmlIOuk0Vu8cisUmB"].join("");
  var GROQ_URL   = "https://api.groq.com/openai/v1/chat/completions";
  var GROQ_MODEL = "llama-3.3-70b-versatile";

  /* LaIRa — Legal AI Research Assistant identity */
  var _CTX =
    "Your name is LaIRa — Legal AI Research Assistant. You are the Legal Document AI for MahaAtlas, " +
    "developed by Civitas Atlas Technologies Pvt. Ltd., Pune, Maharashtra. " +
    "When asked who you are, respond: 'I am LaIRa — Legal AI Research Assistant by MahaAtlas. " +
    "I specialise in generating, reviewing and researching Maharashtra property law documents.' " +
    "NEVER mention Groq, LLaMA, Meta, OpenAI, or any AI infrastructure. " +
    "NEVER call yourself CiVi AI. You are LaIRa.";

  /* LaIRa full system prompt for document generation */
  var LEGAL_SYSTEM_PROMPT =
    _CTX +
    " You specialise ONLY in: Maharashtra property legal documents, stamp duty (Maharashtra Stamp Act 1958), " +
    "registration (IGR Maharashtra), RERA (MahaRERA), MOFA 1963, MRTP 1966, MLR Code 1966, " +
    "Sale Deed, Gift Deed, Lease Agreement, Power of Attorney, Mortgage Deed, Affidavit, Indemnity Bond, " +
    "Legal Notice, Relinquishment Deed, NA Permission Letter, Will/Testament, Development Agreement, Society NOC, Undertaking. " +
    "Generate structured, legally formatted Maharashtra-compliant document drafts when asked. " +
    "Always note: documents must be reviewed by a licensed advocate before execution. " +
    "Do NOT answer topics outside Maharashtra property law and documentation.";

  var currentDoc = "sale_deed";

  /* ── EXTRA FIELDS PER DOC TYPE ─────────────────────────── */
  var EXTRA_FIELDS = {
    sale_deed:        [],
    gift_deed:        [{ id:"lf-relation", label:"Relationship between parties", ph:"e.g. Father to Son" }],
    na_permission:    [{ id:"lf-survey",   label:"Survey / Gut / Gat No.",        ph:"e.g. Gut No. 122"  },
                       { id:"lf-purpose",  label:"Purpose of NA (Land Use)",       ph:"e.g. Residential Construction" }],
    lease_deed:       [{ id:"lf-term",     label:"Lease Term",                    ph:"e.g. 11 months / 5 years" },
                       { id:"lf-rent",     label:"Monthly Rent (₹)",              ph:"e.g. ₹25,000"      }],
    power_of_attorney:[{ id:"lf-scope",    label:"Scope of Authority",            ph:"e.g. Sale, Mortgage, Manage property" }],
    will_deed:        [{ id:"lf-beneficiary",label:"Beneficiary / Legatee Name",  ph:"e.g. Sunita Sharma" },
                       { id:"lf-witness1", label:"Witness 1 Name",               ph:"Full name"         },
                       { id:"lf-witness2", label:"Witness 2 Name",               ph:"Full name"         }],
    mortgage_deed:    [{ id:"lf-bank",     label:"Mortgagee (Bank / Lender)",     ph:"e.g. SBI, Pune Branch" },
                       { id:"lf-loan",     label:"Loan Amount (₹)",              ph:"e.g. ₹40,00,000"   }],
    relinquishment:   [{ id:"lf-relinquisher",label:"Relinquishing Party Name",   ph:"e.g. Amit Patil"   },
                       { id:"lf-share",    label:"Share Relinquished",            ph:"e.g. 1/3rd share"  }]
  };

  /* ── DOC TYPE LABELS ─────────────────────────────────────── */
  var DOC_LABELS = {
    sale_deed:         "SALE DEED",
    gift_deed:         "GIFT DEED",
    na_permission:     "NON-AGRICULTURAL (NA) PERMISSION APPLICATION LETTER",
    lease_deed:        "LEAVE AND LICENCE / LEASE AGREEMENT",
    power_of_attorney: "POWER OF ATTORNEY",
    will_deed:         "LAST WILL AND TESTAMENT",
    mortgage_deed:     "MORTGAGE DEED",
    relinquishment:    "DEED OF RELINQUISHMENT"
  };

  /* ── STANDARD TEMPLATE BODIES ────────────────────────────── */
  function baseTemplate(data) {
    var d  = data;
    var dt = d.date ? new Date(d.date).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}) : "___________";
    switch (currentDoc) {
      case "sale_deed": return saleDeedBody(d, dt);
      case "gift_deed": return giftDeedBody(d, dt);
      case "na_permission": return naPermBody(d, dt);
      case "lease_deed": return leaseDeedBody(d, dt);
      case "power_of_attorney": return poaBody(d, dt);
      case "will_deed": return willBody(d, dt);
      case "mortgage_deed": return mortgageBody(d, dt);
      case "relinquishment": return relinquishBody(d, dt);
      default: return "<p>Template not available.</p>";
    }
  }

  function saleDeedBody(d, dt) {
    return `<p>THIS DEED OF SALE is executed on this <strong>${dt}</strong> at <strong>${d.district||"___"}</strong>, Maharashtra.</p>
<p><strong>BY:</strong> ${d.vendor||"[Vendor Name]"}, residing at ${d['vendor-addr']||"[Vendor Address]"} (hereinafter referred to as the <strong>"Vendor"</strong>).</p>
<p><strong>IN FAVOUR OF:</strong> ${d.purchaser||"[Purchaser Name]"}, residing at ${d['purchaser-addr']||"[Purchaser Address]"} (hereinafter referred to as the <strong>"Purchaser"</strong>).</p>
<h4>DESCRIPTION OF PROPERTY</h4>
<p>${d.property||"[Property Description]"}, admeasuring <strong>${d.area||"[Area]"}</strong>.</p>
<h4>CONSIDERATION</h4>
<p>In consideration of the sum of <strong>${d.value||"[Amount]"}</strong> (Rupees [Amount in words] only), paid by the Purchaser to the Vendor, the receipt whereof the Vendor doth hereby acknowledge, the Vendor doth hereby grant, sell, transfer, convey and assure unto and in favour of the Purchaser, the said property more particularly described above, TO HAVE AND TO HOLD the same unto and to the use of the Purchaser absolutely and forever.</p>
<h4>COVENANTS BY VENDOR</h4>
<p>The Vendor hereby covenants that: (a) the Vendor has good and marketable title to the said property; (b) the property is free from all encumbrances, liens, mortgages, charges, litigations or any other claims; (c) the Vendor has full right, power and authority to sell, transfer and convey the property.</p>
<p>This deed shall be registered at the Sub-Registrar Office, <strong>${d.sro||d.district||"[SRO]"}</strong>, Maharashtra.</p>`;
  }

  function giftDeedBody(d, dt) {
    return `<p>THIS DEED OF GIFT is made on <strong>${dt}</strong> at <strong>${d.district||"___"}</strong>, Maharashtra.</p>
<p><strong>BY (DONOR):</strong> ${d.vendor||"[Donor Name]"}, residing at ${d['vendor-addr']||"[Donor Address]"}.</p>
<p><strong>IN FAVOUR OF (DONEE):</strong> ${d.purchaser||"[Donee Name]"}, residing at ${d['purchaser-addr']||"[Donee Address]"}, being the <strong>${d.relation||"[Relationship]"}</strong> of the Donor.</p>
<h4>PROPERTY GIFTED</h4>
<p>${d.property||"[Property Description]"}, admeasuring <strong>${d.area||"[Area]"}</strong>.</p>
<h4>GIFT CLAUSE</h4>
<p>Out of natural love and affection and without any monetary consideration whatsoever, the Donor doth hereby give, grant, transfer and convey unto and in favour of the Donee, the said property as a free gift absolutely and forever. The Donee accepts the said gift.</p>
<p>Stamp duty as per Article 34, Schedule I of the Maharashtra Stamp Act 1958 shall apply. Registration at Sub-Registrar Office, <strong>${d.sro||d.district||"[SRO]"}</strong>.</p>`;
  }

  function naPermBody(d, dt) {
    return `<p style="text-align:right;">Date: <strong>${dt}</strong></p>
<p><strong>To,</strong><br>The Collector / Tehsildar,<br>${d.district||"[District]"} District, Maharashtra.</p>
<p><strong>Sub: Application for Non-Agricultural (NA) Permission under Section 44 / 45 of the Maharashtra Land Revenue Code, 1966 for Survey / Gut No. ${d.survey||"[Survey No.]"}, ${d.district||"[District]"}.</strong></p>
<p>Respected Sir / Madam,</p>
<p>I, <strong>${d.vendor||"[Applicant Name]"}</strong>, residing at <strong>${d['vendor-addr']||"[Address]"}</strong>, being the owner / khatedar of agricultural land bearing <strong>${d.survey||"[Survey/Gut No.]"}</strong>, Village ______, Taluka ______, District <strong>${d.district||"[District]"}</strong>, Maharashtra, admeasuring <strong>${d.area||"[Area]"}</strong>, do hereby apply for Non-Agricultural (NA) Use permission for the purpose of <strong>${d.purpose||"Residential Construction"}</strong>.</p>
<p>The said land is recorded as agricultural (Jirayat/Bagayat) in the 7/12 Extract. I undertake to comply with all conditions imposed under Section 44/45 of the MLR Code, 1966 and the MRTP Act, 1966 and to pay all premium and taxes as applicable.</p>
<p>Documents enclosed: 7/12 Extract, 8A, Village Map, Index II, Property Tax Receipt, ID Proof.</p>
<p>Yours faithfully,<br><strong>${d.vendor||"[Applicant Name]"}</strong><br>Date: ${dt}</p>`;
  }

  function leaseDeedBody(d, dt) {
    return `<p>THIS LEAVE AND LICENCE AGREEMENT is made on <strong>${dt}</strong> at <strong>${d.district||"___"}</strong>, Maharashtra.</p>
<p><strong>LICENSOR:</strong> ${d.vendor||"[Licensor Name]"}, residing at ${d['vendor-addr']||"[Address]"} (hereinafter "Licensor" / Owner).</p>
<p><strong>LICENSEE:</strong> ${d.purchaser||"[Licensee Name]"}, residing at ${d['purchaser-addr']||"[Address]"} (hereinafter "Licensee" / Tenant).</p>
<h4>PROPERTY</h4>
<p>${d.property||"[Property Description]"}, admeasuring <strong>${d.area||"[Area]"}</strong>.</p>
<h4>TERM &amp; RENT</h4>
<p>The Licensor grants a Licence to the Licensee for a period of <strong>${d.term||"11 months"}</strong> commencing from ${dt}, at a monthly licence fee of <strong>${d.rent||"[Monthly Rent]"}</strong>, payable in advance on or before the 5th of each month.</p>
<p>This Agreement shall be governed by the Maharashtra Rent Control Act, 1999. To be registered at Sub-Registrar Office, <strong>${d.sro||d.district||"[SRO]"}</strong> if term exceeds 11 months.</p>`;
  }

  function poaBody(d, dt) {
    return `<p>THIS POWER OF ATTORNEY is executed on <strong>${dt}</strong> at <strong>${d.district||"___"}</strong>, Maharashtra.</p>
<p><strong>PRINCIPAL:</strong> ${d.vendor||"[Principal Name]"}, residing at ${d['vendor-addr']||"[Address]"}.</p>
<p><strong>ATTORNEY / AGENT:</strong> ${d.purchaser||"[Attorney Name]"}, residing at ${d['purchaser-addr']||"[Address]"}.</p>
<h4>SCOPE OF AUTHORITY</h4>
<p>The Principal hereby appoints the Attorney as his/her true and lawful Attorney to act, execute and perform the following acts in respect of the property — <strong>${d.property||"[Property Description]"}</strong>:</p>
<p>${d.scope||"To sell, mortgage, execute deeds, manage, collect rents, appear before authorities, and do all lawful acts in connection with the said property."}</p>
<p>This Power of Attorney shall remain in force until revoked in writing. Executed voluntarily and without coercion.</p>`;
  }

  function willBody(d, dt) {
    return `<p>THIS IS THE LAST WILL AND TESTAMENT of <strong>${d.vendor||"[Testator Name]"}</strong>, residing at <strong>${d['vendor-addr']||"[Address]"}</strong>, made on <strong>${dt}</strong>, in sound mind and full understanding.</p>
<h4>REVOCATION OF PRIOR WILLS</h4>
<p>I hereby revoke all former Wills and Codicils previously made by me.</p>
<h4>BEQUEST</h4>
<p>I give, bequeath and devise to <strong>${d.beneficiary||"[Beneficiary Name]"}</strong>, absolutely and forever, all my right, title and interest in the property described as: <strong>${d.property||"[Property Description]"}</strong>, admeasuring <strong>${d.area||"[Area]"}</strong>.</p>
<h4>WITNESSES</h4>
<p>Signed by the Testator in the presence of:</p>
<p>1. <strong>${d.witness1||"[Witness 1]"}</strong> &nbsp;&nbsp; 2. <strong>${d.witness2||"[Witness 2]"}</strong></p>
<p>This Will shall be probated as per the Indian Succession Act, 1925.</p>`;
  }

  function mortgageBody(d, dt) {
    return `<p>THIS MORTGAGE DEED is made on <strong>${dt}</strong> at <strong>${d.district||"___"}</strong>, Maharashtra.</p>
<p><strong>MORTGAGOR:</strong> ${d.vendor||"[Mortgagor Name]"}, residing at ${d['vendor-addr']||"[Address]"}.</p>
<p><strong>MORTGAGEE:</strong> ${d.bank||d.purchaser||"[Bank / Lender]"}, having its office at ${d['purchaser-addr']||"[Address]"}.</p>
<h4>PROPERTY MORTGAGED</h4>
<p>${d.property||"[Property Description]"}, admeasuring <strong>${d.area||"[Area]"}</strong>.</p>
<h4>LOAN AMOUNT &amp; TERMS</h4>
<p>In consideration of the loan of <strong>${d.loan||d.value||"[Loan Amount]"}</strong> advanced by the Mortgagee, the Mortgagor hereby mortgages the above property as security. The Mortgagor shall repay the principal with interest as per the loan agreement. Stamp duty per Article 40, Schedule I, MSA 1958. Registered at SRO <strong>${d.sro||d.district||"[SRO]"}</strong>.</p>`;
  }

  function relinquishBody(d, dt) {
    return `<p>THIS DEED OF RELINQUISHMENT is made on <strong>${dt}</strong> at <strong>${d.district||"___"}</strong>, Maharashtra.</p>
<p><strong>RELINQUISHING PARTY:</strong> ${d.relinquisher||d.vendor||"[Name]"}, residing at ${d['vendor-addr']||"[Address]"}.</p>
<p><strong>IN FAVOUR OF:</strong> ${d.purchaser||"[Beneficiary Name]"}, residing at ${d['purchaser-addr']||"[Address]"}.</p>
<h4>PROPERTY</h4>
<p>${d.property||"[Property Description]"}, admeasuring <strong>${d.area||"[Area]"}</strong>.</p>
<h4>RELINQUISHMENT</h4>
<p>The Relinquishing Party hereby relinquishes, releases and gives up all his/her <strong>${d.share||"[share]"}</strong> right, title and interest in the above property in favour of the other co-owner(s) / family member(s), without any monetary consideration.</p>
<p>Stamp duty as per Article 52A, Schedule I, MSA 1958. Registered at SRO <strong>${d.sro||d.district||"[SRO]"}</strong>.</p>`;
  }

  /* ── COLLECT FORM DATA ────────────────────────────────────── */
  function collectData() {
    var ids = ["vendor","purchaser","vendor-addr","purchaser-addr","property","area","value","date","district","sro",
               "relation","survey","purpose","term","rent","scope","beneficiary","witness1","witness2","bank","loan","relinquisher","share"];
    var d = {};
    ids.forEach(function(id) {
      var el = document.getElementById("lf-" + id);
      if (el) d[id] = el.value.trim();
    });
    return d;
  }

  /* ── RENDER PREVIEW ─────────────────────────────────────────── */
  function renderPreview(body, data, enhanced) {
    var dt   = data.date ? new Date(data.date).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}) : new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"});
    var docTitle = DOC_LABELS[currentDoc] || "LEGAL DOCUMENT";
    var previewEl = document.getElementById("ldgPreview");
    previewEl.innerHTML =
      '<div class="ldgp-inner" id="ldgPrintContent">' +
        '<div class="ldgp-head">' +
          '<div class="ldgp-title">' + docTitle + '</div>' +
          '<div class="ldgp-meta">Maharashtra · Registration &amp; Stamps Dept.</div>' +
        '</div>' +
        '<div class="ldgp-body">' + body + '</div>' +
        '<div class="ldgp-sig">' +
          '<div class="ldgp-sig-col"><div class="ldgp-sig-line"></div><div class="ldgp-sig-label">Signature of Vendor / Transferor</div></div>' +
          '<div class="ldgp-sig-col"><div class="ldgp-sig-line"></div><div class="ldgp-sig-label">Signature of Purchaser / Transferee</div></div>' +
          '<div class="ldgp-sig-col"><div class="ldgp-sig-line"></div><div class="ldgp-sig-label">Notary / Advocate Signature</div></div>' +
        '</div>' +
        (enhanced ? '<div class="ldgp-ai-note">&#10022; Enhanced by LaIRa &mdash; review all content before execution</div>' : '') +
        '<div class="ldgp-brand">' +
          '<a href="https://civitasatlas.vercel.app" target="_blank" rel="noopener" class="ldgp-brand-link">' +
            'Legal Atlas | <strong>Civitas Atlas Co.</strong>' +
          '</a>' +
          '<span class="ldgp-brand-sep"> &middot; </span>' +
          '<span>Generated by LaIRa AI on MahaAtlas</span>' +
        '</div>' +
      '</div>';
    document.getElementById("ldgPreviewWrap").style.display = "block";
    document.getElementById("ldgPreviewWrap").scrollIntoView({ behavior:"smooth", block:"start" });
  }

  /* ── GENERATE (Standard first, then AI enhance) ─────────────── */
  window.ldgGenerate = function() {
    var data = collectData();
    if (!data.vendor && !data.purchaser) {
      alert("Please fill in at least the Vendor and Purchaser names.");
      return;
    }
    var btn  = document.getElementById("ldgGenerateBtn");
    var icon = document.getElementById("ldgBtnIcon");

    /* Show standard template immediately */
    var stdBody = baseTemplate(data);
    renderPreview(stdBody, data, false);

    /* Then call AI to enhance */
    btn.disabled = true;
    icon.style.animation = "spin 0.7s linear infinite";

    var sysPrompt = "You are a Maharashtra property law expert and legal document drafter. Enhance the following property document body text making it more legally precise and complete under Maharashtra law. Add appropriate legal clauses, schedules, and Maharashtra-specific provisions. Return ONLY the enhanced HTML body content (use <p>, <h4>, <ul>, <li> tags only). Keep it professional and formal.";
    var userPrompt = "Document type: " + DOC_LABELS[currentDoc] + "\n\nCurrent body:\n" + stdBody + "\n\nData: " + JSON.stringify(data) + "\n\nEnhance this document body for Maharashtra law compliance.";

    fetch(GROQ_URL, {
      method: "POST",
      headers: { "Content-Type":"application/json", "Authorization":"Bearer " + _k },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role:"system", content:sysPrompt },{ role:"user", content:userPrompt }],
        temperature: 0.3,
        max_tokens: 1800
      })
    })
    .then(function(r){ return r.json(); })
    .then(function(resp) {
      btn.disabled = false;
      icon.style.animation = "";
      var enhanced = resp.choices && resp.choices[0] && resp.choices[0].message && resp.choices[0].message.content;
      if (enhanced) {
        /* strip any markdown fences */
        enhanced = enhanced.replace(/```html|```/gi,"").trim();
        renderPreview(enhanced, data, true);
      }
    })
    .catch(function() {
      btn.disabled = false;
      icon.style.animation = "";
      /* keep standard template shown */
    });
  };

  /* ── PRINT ──────────────────────────────────────────────────── */
  window.ldgPrint = function() {
    var content = document.getElementById("ldgPrintContent");
    if (!content) return;
    var w = window.open("","_blank","width=900,height=700");
    w.document.write(
      '<html><head><title>' + (DOC_LABELS[currentDoc]||"Legal Document") + ' — MahaAtlas</title>' +
      '<style>body{font-family:Georgia,serif;padding:40px;max-width:800px;margin:auto;color:#111;line-height:1.7;}' +
      'h4{color:#2d1960;margin:14px 0 6px;}p{margin-bottom:10px;}' +
      '.ldgp-brand{margin-top:40px;padding-top:12px;border-top:1px solid #ccc;font-size:11px;color:#888;text-align:right;}' +
      '.ldgp-brand a{color:#6D28D9;text-decoration:none;}' +
      '.ldgp-sig{display:flex;gap:30px;margin-top:50px;}' +
      '.ldgp-sig-col{flex:1;text-align:center;}' +
      '.ldgp-sig-line{border-bottom:1px solid #333;height:40px;margin-bottom:6px;}' +
      '.ldgp-sig-label{font-size:11px;color:#555;}' +
      '.ldgp-head{text-align:center;margin-bottom:30px;border-bottom:2px solid #6D28D9;padding-bottom:12px;}' +
      '.ldgp-title{font-size:18px;font-weight:bold;color:#2d1960;letter-spacing:1px;}' +
      '.ldgp-meta{font-size:11px;color:#888;margin-top:4px;}' +
      '.ldgp-ai-note{font-size:10px;color:#9333EA;margin-top:16px;font-style:italic;}' +
      '</style></head><body>' +
      content.innerHTML +
      '</body></html>'
    );
    w.document.close();
    w.focus();
    setTimeout(function(){ w.print(); }, 400);
  };

  /* ── EDIT / RESET ─────────────────────────────────────────── */
  window.ldgEdit = function() {
    document.getElementById("ldgPreviewWrap").style.display = "none";
    document.getElementById("ldgForm").scrollIntoView({ behavior:"smooth" });
  };

  window.ldgReset = function() {
    ["vendor","purchaser","vendor-addr","purchaser-addr","property","area","value","date","district","sro"].forEach(function(id) {
      var el = document.getElementById("lf-"+id); if(el) el.value = "";
    });
    document.getElementById("ldgPreviewWrap").style.display = "none";
    document.getElementById("ldg-extra-fields").innerHTML = "";
  };

  /* ── CHIP SELECTOR ───────────────────────────────────────── */
  function updateExtraFields() {
    var extras = EXTRA_FIELDS[currentDoc] || [];
    var container = document.getElementById("ldg-extra-fields");
    if (!container) return;
    if (!extras.length) { container.innerHTML = ""; return; }
    var html = '<div class="ldg-form-row">';
    extras.forEach(function(f, i) {
      if (i > 0 && i % 2 === 0) html += '</div><div class="ldg-form-row">';
      html += '<div class="ldg-field"><label>' + f.label + '</label><input type="text" id="lf-' + f.id.replace("lf-","") + '" placeholder="' + f.ph + '" /></div>';
    });
    html += '</div>';
    container.innerHTML = html;
  }

  window.addEventListener("DOMContentLoaded", function() {
    /* Chip click */
    var chips = document.querySelectorAll(".ldg-chip");
    chips.forEach(function(chip) {
      chip.addEventListener("click", function() {
        chips.forEach(function(c){ c.classList.remove("active"); });
        chip.classList.add("active");
        currentDoc = chip.getAttribute("data-doc");
        updateExtraFields();
        document.getElementById("ldgPreviewWrap").style.display = "none";
      });
    });
    updateExtraFields();
    /* Set today's date as default */
    var dateEl = document.getElementById("lf-date");
    if (dateEl) dateEl.value = new Date().toISOString().split("T")[0];
  });

})();

/* ═══════════════════════════════════════════════════════════
   CUSTOM DOCUMENT GENERATOR — LaIRa AI (Legal AI Research Assistant)
   ═══════════════════════════════════════════════════════════ */
  var GROQ_URL_LG   = "https://api.groq.com/openai/v1/chat/completions";
  var GROQ_MODEL_LG = "llama-3.3-70b-versatile";
  var _kLG          = ["gsk_Tc8WqOV7jelGZor5Ip3NWGdy","b3FYxPpbuCcMmlIOuk0Vu8cisUmB"].join("");

  window.ldgOpenCustom = function () {
    var m = document.getElementById("ldgCustomModal");
    if (m) { m.style.display = "flex"; document.body.style.overflow = "hidden"; }
    var d = document.getElementById("cust-date");
    if (d) d.value = new Date().toISOString().split("T")[0];
  };

  window.ldgCloseCustom = function () {
    var m = document.getElementById("ldgCustomModal");
    if (m) { m.style.display = "none"; document.body.style.overflow = ""; }
  };

  window.ldgSetCustomPrompt = function (txt) {
    var el = document.getElementById("cust-prompt");
    if (el) { el.value = "I need a " + txt + "."; el.focus(); }
  };

  window.ldgGenerateCustom = function () {
    var name   = (document.getElementById("cust-name")   || {}).value || "";
    var addr   = (document.getElementById("cust-addr")   || {}).value || "";
    var phone  = (document.getElementById("cust-phone")  || {}).value || "";
    var date   = (document.getElementById("cust-date")   || {}).value || "";
    var prompt = (document.getElementById("cust-prompt") || {}).value || "";

    if (!prompt.trim()) { alert("Please describe the document you need."); return; }

    var btn  = document.getElementById("custGenBtn");
    var icon = document.getElementById("custBtnIcon");
    btn.disabled = true;
    icon.style.animation = "spin 0.7s linear infinite";

    var dt = date ? new Date(date).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}) : new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"});

    var sysPrompt =
      "Your name is LaIRa — Legal AI Research Assistant for MahaAtlas by Civitas Atlas Technologies. " +
      "Generate a professional, complete, legally formatted Maharashtra-compliant document based on the user's request. " +
      "Format: professional heading (ALL CAPS), proper sections with <h4> headings, <p> paragraphs, page footer, " +
      "signature block (3 columns: Executant, Witness 1, Witness 2), stamp paper instructions, and a passport photo placeholder box where required. " +
      "Return ONLY the document HTML body — use <h4>, <p>, <ul>, <li>, <table> tags only. No markdown, no backticks. " +
      "NEVER mention Groq, LLaMA, or any AI provider name. NEVER call yourself CiVi AI.";

    var userMsg =
      "Generate the following legal document for Maharashtra:\n\n" + prompt +
      (name  ? "\nApplicant/Party Name: " + name  : "") +
      (addr  ? "\nAddress: " + addr  : "") +
      (phone ? "\nMobile: " + phone : "") +
      (dt    ? "\nDate: " + dt : "") +
      "\n\nInclude: proper Maharashtra law references, stamp duty instructions, " +
      "execution clause, signature block with Witness 1 and Witness 2, " +
      "place for passport photo if applicable (show as a placeholder box with 'Passport Size Photograph' text), " +
      "and stamp area at bottom.";

    fetch(GROQ_URL_LG, {
      method: "POST",
      headers: { "Content-Type":"application/json", "Authorization":"Bearer " + _kLG },
      body: JSON.stringify({
        model: GROQ_MODEL_LG,
        messages: [{ role:"system", content:sysPrompt }, { role:"user", content:userMsg }],
        temperature: 0.3,
        max_tokens: 2000
      })
    })
    .then(function(r){ return r.json(); })
    .then(function(resp) {
      btn.disabled = false;
      icon.style.animation = "";
      var body = resp.choices && resp.choices[0] && resp.choices[0].message && resp.choices[0].message.content;
      if (!body) { alert("No response. Please try again."); return; }
      body = body.replace(/```html|```/gi,"").trim();

      /* Render in preview */
      var pw = document.getElementById("custPreviewWrap");
      var pc = document.getElementById("custPreview");
      pc.innerHTML = buildPrintableDoc(body, prompt, name, dt, true);
      pw.style.display = "block";
      pw.scrollIntoView({ behavior:"smooth", block:"start" });
    })
    .catch(function() {
      btn.disabled = false;
      icon.style.animation = "";
      alert("Connection error. Please check your network and try again.");
    });
  };

  window.ldgPrintCustom = function() {
    var content = document.getElementById("custPreview");
    if (!content) return;
    printDoc(content.innerHTML, "Custom Legal Document — MahaAtlas");
  };

  /* ── Shared print-quality document builder ── */
  function buildPrintableDoc(body, docTitle, applicant, dt, isCustom) {
    return (
      '<div class="ldgp-inner" id="ldgPrintContent">' +
        '<div class="ldgp-page-header">' +
          '<div class="ldgp-page-logo">⚖️ Legal Atlas — MahaAtlas</div>' +
          '<div class="ldgp-page-num">Page 1 of 1</div>' +
        '</div>' +
        '<div class="ldgp-head">' +
          '<div class="ldgp-title">' + (docTitle || "LEGAL DOCUMENT") + '</div>' +
          '<div class="ldgp-meta">Maharashtra · Registration &amp; Stamps Dept. · ' + dt + '</div>' +
        '</div>' +

        '<div class="ldgp-body">' + body + '</div>' +

        /* Stamp paper block */
        '<div class="ldgp-stamp-block">' +
          '<div class="ldgp-stamp-title">STAMP PAPER DETAILS</div>' +
          '<div class="ldgp-stamp-grid">' +
            '<div class="ldgp-stamp-item"><span>Stamp Paper Value:</span> ₹_________</div>' +
            '<div class="ldgp-stamp-item"><span>Stamp Paper No.:</span> ___________</div>' +
            '<div class="ldgp-stamp-item"><span>Purchased from:</span> Licensed Vendor</div>' +
            '<div class="ldgp-stamp-item"><span>Date of Stamp Paper:</span> ___________</div>' +
          '</div>' +
        '</div>' +

        /* Signature block — 3 columns */
        '<div class="ldgp-sig">' +
          '<div class="ldgp-sig-col">' +
            '<div class="ldgp-sig-photo">Passport Size<br>Photograph</div>' +
            '<div class="ldgp-sig-line"></div>' +
            '<div class="ldgp-sig-label">Executant / Party 1</div>' +
          '</div>' +
          '<div class="ldgp-sig-col">' +
            '<div class="ldgp-sig-photo" style="visibility:hidden;"></div>' +
            '<div class="ldgp-sig-line"></div>' +
            '<div class="ldgp-sig-label">Witness 1 (Name + Address)</div>' +
          '</div>' +
          '<div class="ldgp-sig-col">' +
            '<div class="ldgp-sig-photo" style="visibility:hidden;"></div>' +
            '<div class="ldgp-sig-line"></div>' +
            '<div class="ldgp-sig-label">Witness 2 (Name + Address)</div>' +
          '</div>' +
        '</div>' +

        /* Notary block */
        '<div class="ldgp-notary">' +
          '<div class="ldgp-notary-box">' +
            '<div class="ldgp-notary-title">NOTARY / ADVOCATE</div>' +
            '<div class="ldgp-notary-line"></div>' +
            '<div class="ldgp-notary-sub">Signature, Seal &amp; Registration No.</div>' +
          '</div>' +
        '</div>' +

        (isCustom ? '<div class="ldgp-ai-note">&#10022; Draft generated by LaIRa &mdash; Legal AI Research Assistant by MahaAtlas</div>' : '') +

        '<div class="ldgp-brand">' +
          '<a href="https://civitasatlas.vercel.app" target="_blank" rel="noopener" class="ldgp-brand-link">' +
            'Legal Atlas | <strong>Civitas Atlas Co.</strong>' +
          '</a>' +
          '<span class="ldgp-brand-sep"> &middot; </span>' +
          '<span>Generated by LaIRa AI on MahaAtlas</span>' +
        '</div>' +
      '</div>'
    );
  }
  window._ldgBuildDoc = buildPrintableDoc; /* expose for civitas-v1-legal-gen.js renderPreview */

  /* ── Shared print window launcher ── */
  function printDoc(html, title) {
    var w = window.open("", "_blank", "width=900,height=700");
    w.document.write(
      '<!DOCTYPE html><html><head><title>' + (title||"Legal Document") + ' — MahaAtlas</title>' +
      '<style>' +
        '@page{margin:20mm 18mm 22mm 22mm}' +
        'body{font-family:Georgia,"Times New Roman",serif;color:#111;line-height:1.75;font-size:12.5pt;}' +
        '.ldgp-page-header{display:flex;justify-content:space-between;font-size:9pt;color:#888;font-family:monospace;border-bottom:1px solid #ddd;padding-bottom:6px;margin-bottom:18px;}' +
        '.ldgp-head{text-align:center;margin-bottom:26px;padding-bottom:14px;border-bottom:2px solid #6D28D9;}' +
        '.ldgp-title{font-size:16pt;font-weight:700;color:#2d1960;letter-spacing:1.5px;text-transform:uppercase;}' +
        '.ldgp-meta{font-size:9pt;color:#666;margin-top:5px;font-family:monospace;}' +
        'h4{color:#2d1960;font-size:11pt;margin:16px 0 6px;text-transform:uppercase;letter-spacing:0.5px;}' +
        'p{margin-bottom:10px;}' +
        'ul{margin:6px 0 10px 22px;}li{margin-bottom:4px;}' +
        '.ldgp-stamp-block{border:1px solid #999;border-radius:6px;padding:12px 16px;margin:24px 0;background:#fafafa;}' +
        '.ldgp-stamp-title{font-size:10pt;font-weight:700;color:#2d1960;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;}' +
        '.ldgp-stamp-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:10pt;}' +
        '.ldgp-stamp-item span{font-weight:600;}' +
        '.ldgp-sig{display:flex;gap:24px;margin-top:52px;padding-top:12px;}' +
        '.ldgp-sig-col{flex:1;text-align:center;}' +
        '.ldgp-sig-photo{width:70px;height:90px;border:1px solid #999;margin:0 auto 8px;display:flex;align-items:center;justify-content:center;font-size:8pt;color:#888;text-align:center;padding:4px;}' +
        '.ldgp-sig-line{border-bottom:1px solid #333;height:40px;margin-bottom:6px;}' +
        '.ldgp-sig-label{font-size:9.5pt;color:#444;font-family:monospace;}' +
        '.ldgp-notary{margin-top:20px;display:flex;justify-content:flex-end;}' +
        '.ldgp-notary-box{width:220px;border:1px dashed #999;padding:12px;text-align:center;}' +
        '.ldgp-notary-title{font-size:9pt;font-weight:700;color:#2d1960;text-transform:uppercase;margin-bottom:30px;}' +
        '.ldgp-notary-line{border-bottom:1px solid #333;margin-bottom:6px;}' +
        '.ldgp-notary-sub{font-size:8.5pt;color:#666;}' +
        '.ldgp-ai-note{font-size:9pt;color:#9333EA;margin-top:16px;font-style:italic;padding:6px 10px;background:#f5f0ff;border-left:2px solid #9333EA;}' +
        '.ldgp-brand{margin-top:32px;padding-top:10px;border-top:1px solid #e5e7eb;display:flex;justify-content:flex-end;gap:4px;font-size:9pt;color:#9ca3af;font-family:monospace;}' +
        '.ldgp-brand-link{color:#6D28D9;text-decoration:none;font-weight:600;}' +
      '</style></head><body>' +
      html +
      '</body></html>'
    );
    w.document.close();
    w.focus();
    setTimeout(function(){ w.print(); }, 500);
  }
  window._ldgPrintDoc = printDoc;

  /* Override the base ldgPrint to use the new printDoc */
  window.ldgPrint = function() {
    var c = document.getElementById("ldgPrintContent");
    if (!c) { var card = document.getElementById("ldgPreview"); if (card) printDoc(card.innerHTML,"Legal Document"); return; }
    printDoc(c.innerHTML, "Legal Document — MahaAtlas");
  };
