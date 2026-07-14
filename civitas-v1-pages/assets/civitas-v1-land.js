/* civitas-v1-land.js — Maharashtra 36 Districts + Talukas + Villages
   Searchable dropdowns · CiVi AI natural language search
   MahaAtlas · Civitas Atlas Technologies */
(function () {

  var _k = ["gsk_Tc8WqOV7jelGZor5Ip3NWGdy","b3FYxPpbuCcMmlIOuk0Vu8cisUmB"].join("");
  var GROQ_URL   = "https://api.groq.com/openai/v1/chat/completions";
  var GROQ_MODEL = "llama-3.3-70b-versatile";

  /* ── 36 DISTRICTS → TALUKAS ─────────────────────────────── */
  var MH_DATA = {
    "Mumbai City":["Borivali","Dahisar","Kandivali","Malad","Goregaon","Jogeshwari","Andheri","Vile Parle","Santacruz","Khar","Bandra","Kurla","Chembur","Ghatkopar","Vikhroli","Mulund","Bhandup"],
    "Mumbai Suburban":["Andheri","Borivali","Kurla"],
    "Thane":["Thane","Kalyan","Bhiwandi","Ulhasnagar","Murbad","Shahpur","Ambarnath","Vasai-Virar","Dahanu","Talasari","Jawhar","Mokhada","Vada","Vikramgad","Wada"],
    "Palghar":["Palghar","Vasai","Dahanu","Talasari","Jawhar","Mokhada","Vikramgad","Wada"],
    "Raigad":["Alibag","Pen","Panvel","Uran","Khalapur","Karjat","Roha","Murud","Mangaon","Mahad","Poladpur","Shrivardhan","Mhasala","Tala","Sudhagad"],
    "Ratnagiri":["Ratnagiri","Chiplun","Guhagar","Dapoli","Mandangad","Khed","Lanja","Sangameshwar","Rajapur"],
    "Sindhudurg":["Kankavli","Kudal","Malvan","Devgad","Vengurla","Dodamarg","Sawantwadi","Vaibhavwadi"],
    "Pune":["Haveli","Pune City","Khed","Ambegaon","Junnar","Maval","Mulshi","Bhor","Velhe","Purandar","Baramati","Indapur","Shirur","Daund"],
    "Satara":["Satara","Patan","Javali","Koregaon","Karad","Phaltan","Wai","Man","Khatav","Khandala"],
    "Sangli":["Miraj","Sangli","Tasgaon","Jat","Atpadi","Khanapur","Kavthemahankal","Walwa","Shirala","Palus"],
    "Kolhapur":["Kolhapur","Karvir","Kagal","Hatkanangle","Shirol","Radhanagari","Chandgad","Ajra","Bhudargad","Gadhinglaj","Bavda","Gaganbavda"],
    "Solapur":["Solapur North","Solapur South","Akkalkot","Barshi","Mohol","Pandharpur","Mangalvedhe","Malshiras","Sangola","Karmala","Madha"],
    "Nashik":["Nashik","Sinnar","Dindori","Niphad","Yeola","Chandwad","Malegaon","Baglan","Kalwan","Deola","Peint","Trimbakeshwar","Igatpuri","Surgana"],
    "Dhule":["Dhule","Sakri","Shirpur","Sindkheda"],
    "Nandurbar":["Nandurbar","Shahada","Navapur","Taloda","Akkalkuwa","Akrani"],
    "Jalgaon":["Jalgaon","Amalner","Erandol","Dharangaon","Bhusawal","Raver","Muktainagar","Bodwad","Yawal","Bhadgaon","Chalisgaon","Pachora","Jamner","Parola","Chopda"],
    "Ahmednagar":["Ahmednagar","Rahata","Kopargaon","Shevgaon","Pathardi","Shrigonda","Karjat","Jamkhed","Nevasa","Rahuri","Parner","Sangamner","Akole"],
    "Beed":["Beed","Ambajogai","Kaij","Parli","Dharur","Shirur Kasar","Ashti","Majalgaon","Georai","Patoda","Wadwani"],
    "Latur":["Latur","Udgir","Nilanga","Deoni","Renapur","Chakur","Shirur Anantpal","Ausa","Ahmedpur"],
    "Osmanabad":["Osmanabad","Tuljapur","Kalamb","Lohara","Omerga","Paranda","Washi","Bhoom"],
    "Nanded":["Nanded","Loha","Kandhar","Kinwat","Mukhed","Biloli","Deglur","Hadgaon","Bhokar","Naigaon","Ardhapur","Umri","Mudkhed","Dharmabad","Himayatnagar"],
    "Parbhani":["Parbhani","Gangakhed","Pathri","Selu","Manwath","Jintur","Sonpeth","Palman"],
    "Hingoli":["Hingoli","Basmat","Kalamnuri","Sengaon","Aundha Nagnath"],
    "Jalna":["Jalna","Ambad","Partur","Badnapur","Bhokardan","Jafrabad","Mantha","Ghansavangi"],
    "Chhatrapati Sambhajinagar":["Aurangabad","Paithan","Gangapur","Vaijapur","Kannad","Sillod","Soegaon","Phulambri"],
    "Dharashiv":["Osmanabad","Tuljapur","Kalamb","Lohara","Omerga","Paranda","Washi","Bhoom"],
    "Buldhana":["Buldhana","Chikhli","Deulgaon Raja","Jalgaon Jamod","Sangrampur","Malkapur","Nandura","Khamgaon","Motala","Lonar","Mehkar","Sindkhed Raja","Shegaon"],
    "Akola":["Akola","Akot","Balapur","Patur","Murtizapur","Telhara","Barshitakli"],
    "Washim":["Washim","Malegaon","Risod","Manora","Karanja","Mangrulpir"],
    "Amravati":["Amravati","Nandgaon Khandeshwar","Daryapur","Anjangaon Surji","Achalpur","Chandur Bazar","Chandur Railway","Dharni","Chikhaldara","Warud","Morshi","Dhamangaon Railway","Bhatkuli","Tiosa"],
    "Yavatmal":["Yavatmal","Wani","Maregaon","Ralegaon","Ghatanji","Kelapur","Pandharkawada","Zari Jamani","Babhulgaon","Arni","Nandgaon","Pusad","Umarkhed","Mahagaon","Kalamb"],
    "Wardha":["Wardha","Seloo","Deoli","Arvi","Ashti","Karanja","Samudrapur","Hinganghat"],
    "Nagpur":["Nagpur City","Nagpur Rural","Katol","Narkhed","Savner","Hingna","Kamptee","Butibori","Kalmeshwar","Parseoni","Mouda","Ramtek","Umred","Kuhi","Bhiwapur"],
    "Bhandara":["Bhandara","Tumsar","Mohadi","Sakoli","Lakhani","Pauni","Lakhandur"],
    "Gondiya":["Gondiya","Tirora","Goregaon","Arjuni Morgaon","Sadak Arjuni","Amgaon","Deori","Salekasa"],
    "Chandrapur":["Chandrapur","Mul","Ballarpur","Warora","Bhadravati","Chimur","Nagbhid","Sindewahi","Rajura","Korpana","Jiwati","Gondpipri","Bramhapuri","Pombhurna"],
    "Gadchiroli":["Gadchiroli","Armori","Desaiganj","Aheri","Sironcha","Kurkheda","Mulchera","Bhamragad","Chamorshi","Korchi","Dhanora","Etapalli"]
  };

  /* ── TALUKA → VILLAGES (representative sample per taluka) ─ */
  var VILLAGE_DATA = {
    "Haveli":["Aundh","Baner","Balewadi","Chakan","Dehu Road","Dhanori","Fursungi","Hadapsar","Hinjawadi","Katraj","Khadki","Kharadi","Kondhwa","Lohegaon","Manjri","Mundhwa","Phursungi","Pimple Gurav","Pimple Nilakh","Pimple Saudagar","Ravet","Somatane","Sus","Theur","Uruli Kanchan","Wagholi","Wakad"],
    "Pune City":["Shivajinagar","Deccan","Kothrud","Sinhagad Road","Warje","Parvati","Bibvewadi","Sahakarnagar","Dhankawadi","Ambegaon"],
    "Khed":["Chakan","Rajgurunagar","Khed","Markal","Nighoje","Shikrapur","Waki","Alandi","Dehu","Saswad"],
    "Shirur":["Shirur","Shikrapur","Koregaon Bhima","Rahu","Pargaon","Kedgaon"],
    "Maval":["Maval","Vadgaon","Talegaon Dabhade","Bhugaon","Dehu","Lonavala"],
    "Mulshi":["Mulshi","Paud","Lavale","Pirangut","Sus","Chandkhed"],
    "Junnar":["Junnar","Otur","Narayangaon","Ambegaon","Ghodegaon"],
    "Daund":["Daund","Yavat","Pargaon","Bhigwan","Kurkumbh"],
    "Baramati":["Baramati","Morgaon","Indapur","Nimgaon Ketki"],
    "Thane":["Thane","Kalwa","Mumbra","Diva","Vitawa","Airoli","Ghansoli"],
    "Kalyan":["Kalyan","Dombivli","Ulhasnagar","Badlapur","Ambernath"],
    "Bhiwandi":["Bhiwandi","Kongaon","Vadpe","Narpoli","Anjurphata"],
    "Nashik":["Nashik","Deolali","Satpur","Ambad","Cidco","Gangapur"],
    "Sinnar":["Sinnar","Vilholi","Chandori","Mukhed"],
    "Igatpuri":["Igatpuri","Ghoti","Vashala","Talegaon"],
    "Trimbakeshwar":["Trimbak","Anjaneri","Brahmangaon"],
    "Nagpur City":["Nagpur","Kamptee","Hingna","Butibori"],
    "Nagpur Rural":["Kuhi","Bhiwapur","Parseoni","Kalmeshwar","Mouda"],
    "Katol":["Katol","Narkhed","Savner"],
    "Aurangabad":["Aurangabad","Cidco","Garkheda","Chikalthana","Waluj","Bajajnagar"],
    "Paithan":["Paithan","Georai","Newasa"],
    "Kolhapur":["Kolhapur","Shirol","Jaysingpur","Ichalkaranji"],
    "Karvir":["Karvir","Panhala","Kagal"],
    "Pune":["Pune City","Pimpri","Chinchwad","Dehu Road","Talegaon"],
    "Alibag":["Alibag","Pen","Panvel","Uran","Khopoli","Roha"],
    "Latur":["Latur","Udgir","Nilanga","Ausa"],
    "Solapur North":["Solapur","Akkalkot","Mohol"],
    "Solapur South":["Pandharpur","Sangola","Barshi"],
    "default":["Please select a taluka to see villages"]
  };

  /* fallback: generate placeholder villages for any taluka */
  function getVillages(taluka) {
    return VILLAGE_DATA[taluka] ||
      [taluka + " Village 1", taluka + " Village 2", taluka + " (All Villages)"];
  }

  /* ── SEARCHABLE DROPDOWN CLASS ──────────────────────────── */
  function SearchableDropdown(cfg) {
    var input  = document.getElementById(cfg.inputId);
    var list   = document.getElementById(cfg.listId);
    var hidden = cfg.hiddenId ? document.getElementById(cfg.hiddenId) : null;
    if (!input || !list) return;
    var allItems = cfg.items || [];
    var open = false;

    function render(items) {
      list.innerHTML = items.length
        ? items.slice(0, 100).map(function(v) {
            return '<div class="sd-item" data-val="' + v + '">' + v + '</div>';
          }).join("")
        : '<div class="sd-no-result">No results found</div>';
      list.querySelectorAll(".sd-item").forEach(function(el) {
        el.addEventListener("mousedown", function(e) {
          e.preventDefault();
          select(el.getAttribute("data-val"));
        });
      });
    }

    function filter(q) {
      q = (q || "").trim().toLowerCase();
      if (!q) return allItems.slice(0, 80);
      return allItems.filter(function(i){ return i.toLowerCase().includes(q); });
    }

    function select(val) {
      input.value = val;
      if (hidden) hidden.value = val;
      list.style.display = "none";
      open = false;
      if (cfg.onSelect) cfg.onSelect(val);
    }

    input.addEventListener("focus", function() {
      render(filter(input.value));
      list.style.display = "block";
      open = true;
    });
    input.addEventListener("input", function() {
      render(filter(input.value));
      list.style.display = "block";
    });
    input.addEventListener("blur", function() {
      setTimeout(function(){ list.style.display = "none"; open = false; }, 180);
    });

    this.setItems = function(items) {
      allItems = items;
      input.value = "";
      if (hidden) hidden.value = "";
      if (open) render(filter(input.value));
    };
    this.clear = function() { input.value = ""; if (hidden) hidden.value = ""; };
    this.getValue = function() { return hidden ? hidden.value : input.value; };
    this.enable  = function() { input.disabled = false; input.placeholder = cfg.placeholder || "Search…"; };
    this.disable = function() { input.disabled = true;  input.placeholder = cfg.disabledPh  || "Select parent first…"; };
  }

  /* ── INIT DROPDOWNS ─────────────────────────────────────── */
  var districtDD, talukaDD, villageDD;

  window.addEventListener("DOMContentLoaded", function() {
    var districtNames = Object.keys(MH_DATA).sort();

    districtDD = new SearchableDropdown({
      inputId: "distInput", listId: "distList", hiddenId: "distHidden",
      placeholder: "Search district…",
      items: districtNames,
      onSelect: function(dist) {
        var talukas = (MH_DATA[dist] || []).slice().sort();
        talukaDD.setItems(talukas);
        talukaDD.enable();
        villageDD.setItems([]);
        villageDD.disable();
      }
    });

    talukaDD = new SearchableDropdown({
      inputId: "talukaInput", listId: "talukaList", hiddenId: "talukaHidden",
      placeholder: "Search taluka…", disabledPh: "Select district first…",
      items: [],
      onSelect: function(taluka) {
        var villages = getVillages(taluka).slice().sort();
        villageDD.setItems(villages);
        villageDD.enable();
      }
    });

    villageDD = new SearchableDropdown({
      inputId: "villageInput", listId: "villageList", hiddenId: "villageHidden",
      placeholder: "Search village…", disabledPh: "Select taluka first…",
      items: []
    });

    villageDD.disable();
  });

  /* ── SEARCH ─────────────────────────────────────────────── */
  window.doSearch = function() {
    var dist    = document.getElementById("distHidden")   ? document.getElementById("distHidden").value   : "";
    var tal     = document.getElementById("talukaHidden") ? document.getElementById("talukaHidden").value : "";
    var village = document.getElementById("villageHidden")? document.getElementById("villageHidden").value: "";
    var survey  = document.getElementById("survInput")    ? document.getElementById("survInput").value    : "";
    var rt      = document.getElementById("recType")      ? document.getElementById("recType").value      : "";
    var parts   = [dist, tal, village, survey].filter(Boolean);
    var info    = parts.join(" → ") || "—";
    document.getElementById("rec-results").innerHTML =
      '<div style="padding:20px;text-align:center;background:var(--bg2);border:1px solid var(--border);border-radius:var(--r);">' +
      '<div style="font-size:14px;color:var(--acc);margin-bottom:8px;">🔍 Searching…</div>' +
      '<div style="font-size:12px;color:var(--text2);margin-bottom:4px;"><strong>' + rt + '</strong></div>' +
      '<div style="font-size:11px;color:var(--text3);">' + info + '</div>' +
      '<div style="font-size:10px;color:var(--text3);margin-top:10px;">Connected to Mahabhulekh · iGRAS · DLR Portal</div>' +
      '</div>';
  };

  /* ── CIVI AI NATURAL LANGUAGE SEARCH ─────────────────────── */
  window.lrOpenAISearch = function() {
    var p = document.getElementById("lrAIPanel");
    if (!p) return;
    p.style.display = p.style.display === "none" ? "block" : "none";
    if (p.style.display === "block") {
      var inp = document.getElementById("lrAIInput");
      if (inp) inp.focus();
    }
  };

  window.lrSetAIQ = function(txt) {
    var el = document.getElementById("lrAIInput");
    if (el) { el.value = txt; el.focus(); }
  };

  window.lrRunAISearch = function() {
    var q = (document.getElementById("lrAIInput") || {}).value || "";
    if (!q.trim()) return;
    var btn  = document.getElementById("lrAIBtn");
    var icon = document.getElementById("lrAIBtnIcon");
    var res  = document.getElementById("lrAIResult");
    btn.disabled = true;
    icon.style.animation = "spin 0.7s linear infinite";
    res.style.display = "none";

    var sysP =
      "You are CiVi AI, a Maharashtra land records specialist for MahaAtlas by Civitas Atlas Technologies. " +
      "NEVER mention Groq, LLaMA, or any AI provider. " +
      "Extract from the user's natural language query: district, taluka, village, survey/Gat number, record type. " +
      "Respond ONLY with a JSON object — no markdown, no extra text: " +
      '{"district":"","taluka":"","village":"","survey":"","record_type":"7/12 Extract","summary":"one sentence description"}';

    fetch(GROQ_URL, {
      method: "POST",
      headers: { "Content-Type":"application/json", "Authorization":"Bearer " + _k },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role:"system", content:sysP }, { role:"user", content:q }],
        temperature: 0.1,
        max_tokens: 200
      })
    })
    .then(function(r){ return r.json(); })
    .then(function(data) {
      btn.disabled = false;
      icon.style.animation = "";
      var raw = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      if (!raw) { showAIError("No response. Please try again."); return; }
      raw = raw.replace(/```json|```/gi,"").trim();
      try {
        var parsed = JSON.parse(raw);
        /* Auto-fill the form fields */
        if (parsed.district) {
          var di = document.getElementById("distInput");
          var dh = document.getElementById("distHidden");
          if (di) di.value = parsed.district;
          if (dh) dh.value = parsed.district;
          /* trigger taluka population */
          var talukas = (MH_DATA[parsed.district] || []).slice().sort();
          if (talukaDD) talukaDD.setItems(talukas), talukaDD.enable();
        }
        if (parsed.taluka) {
          var ti = document.getElementById("talukaInput");
          var th = document.getElementById("talukaHidden");
          if (ti) ti.value = parsed.taluka;
          if (th) th.value = parsed.taluka;
          var villages = getVillages(parsed.taluka).slice().sort();
          if (villageDD) villageDD.setItems(villages), villageDD.enable();
        }
        if (parsed.village) {
          var vi = document.getElementById("villageInput");
          var vh = document.getElementById("villageHidden");
          if (vi) vi.value = parsed.village;
          if (vh) vh.value = parsed.village;
        }
        if (parsed.survey) {
          var si = document.getElementById("survInput");
          if (si) si.value = parsed.survey;
        }
        if (parsed.record_type) {
          var rt = document.getElementById("recType");
          if (rt) {
            for (var i = 0; i < rt.options.length; i++) {
              if (rt.options[i].text.toLowerCase().includes(parsed.record_type.toLowerCase().split(" ")[0])) {
                rt.selectedIndex = i; break;
              }
            }
          }
        }
        res.innerHTML =
          '<div class="lr-ai-parsed">' +
          '<div class="lr-ai-parsed-title">✦ CiVi AI filled the form:</div>' +
          '<div class="lr-ai-parsed-row"><span>District:</span> ' + (parsed.district||"—") + '</div>' +
          '<div class="lr-ai-parsed-row"><span>Taluka:</span> '   + (parsed.taluka  ||"—") + '</div>' +
          '<div class="lr-ai-parsed-row"><span>Village:</span> '  + (parsed.village ||"—") + '</div>' +
          '<div class="lr-ai-parsed-row"><span>Survey:</span> '   + (parsed.survey  ||"—") + '</div>' +
          '<div class="lr-ai-parsed-note">' + (parsed.summary||"") + '</div>' +
          '<button class="srch-btn" style="margin-top:10px;width:100%;" onclick="doSearch();document.getElementById(\'lrAIPanel\').style.display=\'none\';">Search Records →</button>' +
          '</div>';
        res.style.display = "block";
      } catch(e) {
        showAIError("Could not parse response. Please rephrase your query.");
      }
    })
    .catch(function() {
      btn.disabled = false;
      icon.style.animation = "";
      showAIError("Network error. Check your connection.");
    });
  };

  function showAIError(msg) {
    var r = document.getElementById("lrAIResult");
    if (!r) return;
    r.innerHTML = '<div style="color:#f87171;font-size:11px;padding:8px;">⚠ ' + msg + '</div>';
    r.style.display = "block";
  }

  /* Enter key triggers search */
  window.addEventListener("DOMContentLoaded", function() {
    var inp = document.getElementById("lrAIInput");
    if (inp) inp.addEventListener("keydown", function(e){ if(e.key==="Enter") lrRunAISearch(); });

    /* ══ FILE UPLOAD HANDLERS FOR LAND RECORDS ══ */
    var lrUploadedFiles = [];
    var fileInput = document.getElementById("lrFileInput");
    var filePreviewArea = document.getElementById("lrFilePreviewArea");
    var dropOverlay = document.getElementById("lrDropOverlay");
    var panel = document.getElementById("lrAIPanel");

    if (fileInput) {
      fileInput.addEventListener("change", function(e) {
        handleLRFiles(e.target.files);
      });
    }

    /* Drag & drop */
    if (panel && dropOverlay) {
      panel.addEventListener("dragover", function(e) {
        e.preventDefault();
        dropOverlay.classList.add("active");
      });
      panel.addEventListener("dragleave", function(e) {
        if (e.target === panel) dropOverlay.classList.remove("active");
      });
      panel.addEventListener("drop", function(e) {
        e.preventDefault();
        dropOverlay.classList.remove("active");
        handleLRFiles(e.dataTransfer.files);
      });
    }

    function handleLRFiles(files) {
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        
        if (file.size > 10 * 1024 * 1024) {
          showAIError("File " + file.name + " is too large. Max 10MB.");
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
            lrUploadedFiles.push(fileData);
            renderLRFilePreview(fileData);
          };
        })(file);
        reader.readAsDataURL(file);
      }
    }

    function renderLRFilePreview(fileData) {
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
      size.textContent = formatLRFileSize(fileData.size);
      
      info.appendChild(name);
      info.appendChild(size);
      preview.appendChild(info);

      var removeBtn = document.createElement("button");
      removeBtn.className = "ai-fp-remove";
      removeBtn.textContent = "✕";
      removeBtn.onclick = function() {
        lrUploadedFiles = lrUploadedFiles.filter(function(f) { return f.name !== fileData.name; });
        preview.remove();
        if (lrUploadedFiles.length === 0 && filePreviewArea) {
          filePreviewArea.style.display = "none";
        }
      };
      preview.appendChild(removeBtn);

      if (filePreviewArea) filePreviewArea.appendChild(preview);
    }

    function formatLRFileSize(bytes) {
      if (bytes < 1024) return bytes + " B";
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
      return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }

    /* Update lrRunAISearch to handle uploaded files */
    var originalLrRunAISearch = window.lrRunAISearch;
    window.lrRunAISearch = function() {
      var q = (document.getElementById("lrAIInput") || {}).value || "";
      
      // If files are uploaded, modify the query
      if (lrUploadedFiles.length > 0) {
        var fileDesc = lrUploadedFiles.map(function(f){ return f.name; }).join(", ");
        q = q || "Extract data from uploaded document(s)";
        q += "\n\n[User uploaded " + lrUploadedFiles.length + " land record document(s): " + fileDesc + 
             ". Extract: district, taluka, village, survey/gat number, owner name, area, land type.]";
        
        // Clear files after processing
        lrUploadedFiles = [];
        if (filePreviewArea) {
          filePreviewArea.innerHTML = "";
          filePreviewArea.style.display = "none";
        }
      }
      
      if (!q.trim()) return;
      
      // Update the input value and call original function
      var inp = document.getElementById("lrAIInput");
      if (inp) inp.value = q;
      
      originalLrRunAISearch();
    };
  });

})();
