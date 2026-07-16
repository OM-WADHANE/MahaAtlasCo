/* civitas-v1-fsi.js — FSI Atlas Calculator
   MahaAtlas v1 · Civitas Atlas Technologies Pvt. Ltd.
   Data: DCPR 2034, PMC DP 2041, NMC DCR, RERA Maharashtra
*/
(function () {

  /* ─────────────────────────────────────────────────────────
     FSI DATA STORE
     Each city has an array of land-type entries:
       { key, label, category, baseFSI, maxFSI, tdrAllowed,
         premiumFSI, authority, regulation, note }
  ───────────────────────────────────────────────────────── */
  var FSI_DB = {

    mumbai: {
      name: "Mumbai",
      authority: "MCGM",
      regulation: "DCPR 2034",
      types: [
        { key:"island_base",     label:"Island City — Base",          category:"Residential",  baseFSI:1.33, maxFSI:1.33, tdrAllowed:true,  premiumFSI:0,   note:"Base FSI as per DCPR 2034 Table-1. TDR & fungible FSI applicable." },
        { key:"island_tdr",      label:"Island City — with TDR",      category:"Residential",  baseFSI:1.33, maxFSI:4.0,  tdrAllowed:true,  premiumFSI:2.67,note:"Max FSI 4.0 with TDR + fungible FSI (33% of base = 0.44)." },
        { key:"suburb_base",     label:"Suburbs — Base",              category:"Residential",  baseFSI:1.0,  maxFSI:1.0,  tdrAllowed:true,  premiumFSI:0,   note:"Suburban base FSI. Road-width premiums may raise effective FSI." },
        { key:"suburb_tdr",      label:"Suburbs — with TDR",          category:"Residential",  baseFSI:1.0,  maxFSI:3.0,  tdrAllowed:true,  premiumFSI:2.0, note:"Max FSI 3.0 with TDR in suburbs (Eastern/Western suburbs)." },
        { key:"tod",             label:"Transit-Oriented Dev. (TOD)",  category:"TOD",          baseFSI:4.0,  maxFSI:5.0,  tdrAllowed:false, premiumFSI:1.0, note:"TOD zones within 500m of Metro/Railway. Premium FSI purchasable." },
        { key:"sra",             label:"SRA — Slum Rehabilitation",    category:"SRA/Rehab",   baseFSI:3.0,  maxFSI:4.0,  tdrAllowed:false, premiumFSI:1.0, note:"Rehab + free-sale component. Regulated by SRA Authority." },
        { key:"it_ites",         label:"IT / ITES Zone",               category:"Commercial/IT",baseFSI:4.0,  maxFSI:4.0,  tdrAllowed:false, premiumFSI:0,   note:"Designated IT Parks. Reg. 26 DCPR 2034." },
        { key:"commercial",      label:"Commercial (Road > 12 m)",     category:"Commercial",   baseFSI:2.5,  maxFSI:2.5,  tdrAllowed:false, premiumFSI:0,   note:"Road width ≥ 12 m required. Additional 0.5 for corner plots." },
        { key:"cluster_rdev",    label:"Cluster Redevelopment",        category:"SRA/Rehab",   baseFSI:3.0,  maxFSI:4.0,  tdrAllowed:false, premiumFSI:1.0, note:"Reg. 33(9) DCPR 2034. Min plot 4,000 sq.m." },
        { key:"industrial",      label:"Industrial Zone",              category:"Industrial",   baseFSI:1.0,  maxFSI:1.0,  tdrAllowed:false, premiumFSI:0,   note:"Industrial zones. Change-of-use may apply." },
        { key:"gaothan",         label:"Gaothan / Koliwada",           category:"Residential",  baseFSI:2.5,  maxFSI:3.0,  tdrAllowed:false, premiumFSI:0.5, note:"Reg. 33(OA) DCPR 2034. Village settlements within city limits." }
      ]
    },

    pune: {
      name: "Pune (PMC + PCMC)",
      authority: "PMC / PCMC",
      regulation: "PMC DP 2041 · PCMC DCR",
      types: [
        { key:"pmc_res",         label:"PMC — Residential (General)",  category:"Residential",  baseFSI:2.5,  maxFSI:2.5,  tdrAllowed:true,  premiumFSI:0,   note:"Base FSI 2.5 under PMC DP 2041. TDR can add 0.3–0.5 more." },
        { key:"pmc_tod",         label:"PMC — Metro TOD Zone",         category:"TOD",          baseFSI:3.0,  maxFSI:4.0,  tdrAllowed:false, premiumFSI:1.0, note:"Metro corridor within 500 m. Incentive FSI purchasable." },
        { key:"pmc_commercial",  label:"PMC — Commercial",             category:"Commercial",   baseFSI:2.5,  maxFSI:3.0,  tdrAllowed:false, premiumFSI:0.5, note:"Commercial zone; corner plot & road-width premiums apply." },
        { key:"pcmc_res",        label:"PCMC — Residential",           category:"Residential",  baseFSI:2.6,  maxFSI:2.6,  tdrAllowed:true,  premiumFSI:0,   note:"Pimpri-Chinchwad Municipal Corporation base FSI." },
        { key:"hinjewadi_it",    label:"Hinjewadi IT Park (MIDC)",     category:"Commercial/IT",baseFSI:3.5,  maxFSI:3.5,  tdrAllowed:false, premiumFSI:0,   note:"MIDC notified IT zone. Subject to MIDC DCR." },
        { key:"midc_ind",        label:"MIDC Industrial",              category:"Industrial",   baseFSI:1.0,  maxFSI:1.0,  tdrAllowed:false, premiumFSI:0,   note:"Standard MIDC industrial plot FSI." },
        { key:"cluster_rdev",    label:"Cluster Redevelopment",        category:"SRA/Rehab",   baseFSI:3.0,  maxFSI:3.7,  tdrAllowed:false, premiumFSI:0.7, note:"Incentive FSI for cluster schemes ≥ 4,000 sq.m." },
        { key:"gaothan",         label:"Gaothan (Village Settlement)", category:"Residential",  baseFSI:1.0,  maxFSI:1.5,  tdrAllowed:false, premiumFSI:0,   note:"MRTP Sec. 37 applies. Permission from planning authority required." }
      ]
    },

    nagpur: {
      name: "Nagpur",
      authority: "NMC / NIT / NMRDA",
      regulation: "NMC DCR · NMRDA DP",
      types: [
        { key:"res_general",     label:"Residential — General",        category:"Residential",  baseFSI:1.5,  maxFSI:1.5,  tdrAllowed:true,  premiumFSI:0,   note:"Standard residential zone per NMC DCR." },
        { key:"metro_tod",       label:"Metro TOD Zone",               category:"TOD",          baseFSI:2.5,  maxFSI:3.5,  tdrAllowed:false, premiumFSI:1.0, note:"Nagpur Metro corridor. Incentive FSI purchasable up to 3.5." },
        { key:"commercial",      label:"Commercial (NMC)",             category:"Commercial",   baseFSI:2.0,  maxFSI:3.0,  tdrAllowed:false, premiumFSI:1.0, note:"Commercial zone; road width ≥ 9 m required." },
        { key:"mihan_sez",       label:"MIHAN SEZ / Aerospace Park",   category:"Commercial/IT",baseFSI:4.0,  maxFSI:4.0,  tdrAllowed:false, premiumFSI:0,   note:"Special Economic Zone — MIHAN. MIDC DCR applies." },
        { key:"industrial",      label:"Industrial (NMC/MIDC)",        category:"Industrial",   baseFSI:1.0,  maxFSI:1.0,  tdrAllowed:false, premiumFSI:0,   note:"Industrial zone. MIDC plot regulations apply." },
        { key:"nmrda",           label:"NMRDA Fringe Zone",            category:"Residential",  baseFSI:1.0,  maxFSI:1.5,  tdrAllowed:true,  premiumFSI:0,   note:"NMRDA jurisdiction. TDR allowed from reserved plots." }
      ]
    },

    thane: {
      name: "Thane (TMC)",
      authority: "TMC",
      regulation: "TMC DCR · MMRDA DP",
      types: [
        { key:"res_base",        label:"Residential — Base",           category:"Residential",  baseFSI:1.5,  maxFSI:1.5,  tdrAllowed:true,  premiumFSI:0,   note:"TMC standard residential FSI." },
        { key:"cluster_rdev",    label:"Cluster Redevelopment",        category:"SRA/Rehab",   baseFSI:2.5,  maxFSI:3.0,  tdrAllowed:false, premiumFSI:0.5, note:"Incentive FSI for cluster redevelopment schemes." },
        { key:"commercial",      label:"Commercial Zone",              category:"Commercial",   baseFSI:2.0,  maxFSI:2.5,  tdrAllowed:false, premiumFSI:0.5, note:"Main road commercial plots." },
        { key:"mmrda_tod",       label:"MMRDA TOD Zone",               category:"TOD",          baseFSI:2.5,  maxFSI:4.0,  tdrAllowed:false, premiumFSI:1.5, note:"MMRDA Metro corridor TOD notification." },
        { key:"industrial",      label:"Industrial / MIDC",            category:"Industrial",   baseFSI:1.0,  maxFSI:1.0,  tdrAllowed:false, premiumFSI:0,   note:"Standard MIDC / industrial zone." }
      ]
    },

    nashik: {
      name: "Nashik",
      authority: "NMC Nashik",
      regulation: "NMC DCR · NRDA",
      types: [
        { key:"res_general",     label:"Residential — General",        category:"Residential",  baseFSI:1.0,  maxFSI:1.0,  tdrAllowed:false, premiumFSI:0,   note:"Standard NMC Nashik residential zone." },
        { key:"commercial",      label:"Commercial Zone",              category:"Commercial",   baseFSI:1.5,  maxFSI:1.5,  tdrAllowed:false, premiumFSI:0,   note:"Commercial plots on roads ≥ 9 m." },
        { key:"industrial",      label:"Industrial / MIDC",            category:"Industrial",   baseFSI:1.0,  maxFSI:1.0,  tdrAllowed:false, premiumFSI:0,   note:"MIDC Nashik zone." },
        { key:"nrda_fringe",     label:"NRDA Fringe / New Area",       category:"Residential",  baseFSI:0.8,  maxFSI:1.2,  tdrAllowed:false, premiumFSI:0,   note:"Nashik Regional Development Authority peripheral area." }
      ]
    },

    aurangabad: {
      name: "Chhatrapati Sambhajinagar (Aurangabad)",
      authority: "CSMC / AURIC",
      regulation: "CSMC DCR · DMIC AURIC",
      types: [
        { key:"res_general",     label:"Residential — General",        category:"Residential",  baseFSI:1.0,  maxFSI:1.0,  tdrAllowed:false, premiumFSI:0,   note:"Standard CSMC residential zone." },
        { key:"commercial",      label:"Commercial Zone",              category:"Commercial",   baseFSI:1.5,  maxFSI:1.5,  tdrAllowed:false, premiumFSI:0,   note:"Commercial plots in CSMC area." },
        { key:"auric_dmic",      label:"AURIC / DMIC Industrial",      category:"Commercial/IT",baseFSI:2.0,  maxFSI:2.5,  tdrAllowed:false, premiumFSI:0.5, note:"Aurangabad Industrial City — DMIC phase-II notified zone." },
        { key:"industrial",      label:"Industrial / MIDC",            category:"Industrial",   baseFSI:1.0,  maxFSI:1.0,  tdrAllowed:false, premiumFSI:0,   note:"MIDC Waluj/Chikalthana." }
      ]
    },

    navi_mumbai: {
      name: "Navi Mumbai (NMMC)",
      authority: "NMMC / CIDCO",
      regulation: "CIDCO DCR · NMMC DP",
      types: [
        { key:"res_general",     label:"Residential — General",        category:"Residential",  baseFSI:1.0,  maxFSI:1.5,  tdrAllowed:true,  premiumFSI:0,   note:"CIDCO sector-wise FSI. Varies by node." },
        { key:"commercial",      label:"Commercial Zone",              category:"Commercial",   baseFSI:2.0,  maxFSI:2.5,  tdrAllowed:false, premiumFSI:0.5, note:"Commercial zones in CBD nodes (Vashi, Belapur)." },
        { key:"naina_tod",       label:"NAINA TOD Zone",               category:"TOD",          baseFSI:2.0,  maxFSI:3.5,  tdrAllowed:false, premiumFSI:1.5, note:"NAINA (Navi Mumbai Airport Influence Notified Area) TOD." },
        { key:"it_ites",         label:"IT / ITES Park",               category:"Commercial/IT",baseFSI:2.5,  maxFSI:3.0,  tdrAllowed:false, premiumFSI:0.5, note:"Mahape / Turbhe IT zone." },
        { key:"industrial",      label:"Industrial / MIDC",            category:"Industrial",   baseFSI:1.0,  maxFSI:1.0,  tdrAllowed:false, premiumFSI:0,   note:"TTC Industrial Area, Thane-Belapur Road." }
      ]
    },

    rural: {
      name: "Rural Maharashtra",
      authority: "Gram Panchayat / Collector",
      regulation: "MRTP Act · MLR Code",
      types: [
        { key:"agricultural",    label:"Agricultural Zone",            category:"Agricultural", baseFSI:0,    maxFSI:0,    tdrAllowed:false, premiumFSI:0,   note:"No FSI. NA (Non-Agricultural) order required under Sec. 44/45 MLR Code before any construction." },
        { key:"gaothan",         label:"Village Settlement (Gaothan)", category:"Residential",  baseFSI:0.5,  maxFSI:1.0,  tdrAllowed:false, premiumFSI:0,   note:"MRTP Sec. 37 permissions apply. Layout sanction from Gram Panchayat." },
        { key:"midc_ind",        label:"MIDC Industrial",              category:"Industrial",   baseFSI:0.5,  maxFSI:1.0,  tdrAllowed:false, premiumFSI:0,   note:"Varies by MIDC zone notification." },
        { key:"tourism_eco",     label:"Tourism / Eco-sensitive Zone", category:"Other",        baseFSI:0.2,  maxFSI:0.5,  tdrAllowed:false, premiumFSI:0,   note:"Eco-sensitive / forest buffer areas. MoEF/SEAC clearance required." },
        { key:"warehouse",       label:"Warehouse / Logistics",        category:"Industrial",   baseFSI:0.5,  maxFSI:0.75, tdrAllowed:false, premiumFSI:0,   note:"NH/SH corridor warehousing. Subject to Collector approval." }
      ]
    }

  }; // end FSI_DB

  /* ─────────────────────────────────────────────────────────
     CATEGORY COLOUR MAP
  ───────────────────────────────────────────────────────── */
  var CAT_STYLE = {
    "Residential":   { tag:"t-res",  icon:"🏠", color:"#22c55e" },
    "Commercial":    { tag:"t-com",  icon:"🏢", color:"#60a5fa" },
    "Commercial/IT": { tag:"t-it",   icon:"💻", color:"#c084fc" },
    "TOD":           { tag:"t-tod",  icon:"🚇", color:"#facc15" },
    "SRA/Rehab":     { tag:"t-sra",  icon:"🏗", color:"#f87171" },
    "Industrial":    { tag:"t-ind",  icon:"🏭", color:"#9ca3af" },
    "Agricultural":  { tag:"t-ind",  icon:"🌾", color:"#86efac" },
    "Other":         { tag:"t-ind",  icon:"📌", color:"#9ca3af" }
  };

  /* ─────────────────────────────────────────────────────────
     UTILITY: populate city dropdown
  ───────────────────────────────────────────────────────── */
  function populateCitySelect(sel) {
    sel.innerHTML = '<option value="">— Select City —</option>';
    Object.keys(FSI_DB).forEach(function(k) {
      var opt = document.createElement("option");
      opt.value = k;
      opt.textContent = FSI_DB[k].name;
      sel.appendChild(opt);
    });
  }

  /* populate land-type dropdown based on selected city */
  function populateLandSelect(cityKey, landSel) {
    landSel.innerHTML = '<option value="">— Select Land Type —</option>';
    if (!cityKey || !FSI_DB[cityKey]) return;
    FSI_DB[cityKey].types.forEach(function(t) {
      var opt = document.createElement("option");
      opt.value = t.key;
      opt.textContent = t.label + " (" + t.category + ")";
      landSel.appendChild(opt);
    });
  }

  /* ─────────────────────────────────────────────────────────
     CITY SEARCH — filter suggestions
  ───────────────────────────────────────────────────────── */
  function buildSearchSuggestions(inputEl, citySelEl, landSelEl) {
    var box = document.getElementById("fsi-city-suggestions");
    if (!box) return;
    var q = inputEl.value.trim().toLowerCase();
    if (!q) { box.style.display = "none"; return; }
    var matches = Object.keys(FSI_DB).filter(function(k) {
      return FSI_DB[k].name.toLowerCase().includes(q);
    });
    if (!matches.length) { box.style.display = "none"; return; }
    box.innerHTML = matches.map(function(k) {
      return '<div class="fsi-suggest-item" data-key="' + k + '">' +
             FSI_DB[k].name + '<span class="fsi-suggest-auth">' + FSI_DB[k].authority + '</span></div>';
    }).join("");
    box.style.display = "block";
    box.querySelectorAll(".fsi-suggest-item").forEach(function(el) {
      el.addEventListener("click", function() {
        var key = el.getAttribute("data-key");
        inputEl.value = FSI_DB[key].name;
        citySelEl.value = key;
        box.style.display = "none";
        populateLandSelect(key, landSelEl);
        clearResult();
      });
    });
  }

  /* ─────────────────────────────────────────────────────────
     CALCULATOR — main logic
  ───────────────────────────────────────────────────────── */
  function clearResult() {
    var r = document.getElementById("fsi-calc-result");
    if (r) r.style.display = "none";
  }

  function runCalc() {
    var cityKey  = document.getElementById("fsi-city-sel").value;
    var landKey  = document.getElementById("fsi-land-sel").value;
    var plotArea = parseFloat(document.getElementById("fsi-plot-area").value) || 0;
    var unit     = document.getElementById("fsi-area-unit").value;

    var result = document.getElementById("fsi-calc-result");
    if (!result) return;

    if (!cityKey || !landKey) {
      result.innerHTML = '<div class="fsi-error">Please select both city and land type.</div>';
      result.style.display = "block"; return;
    }

    var city = FSI_DB[cityKey];
    var type = city.types.find(function(t){ return t.key === landKey; });
    if (!type) return;

    /* convert area to sq.m */
    var areaSqm = 0;
    var areaSqft = 0;
    if (plotArea > 0) {
      if (unit === "sqft")  { areaSqm = plotArea * 0.0929; areaSqft = plotArea; }
      else if (unit === "sqm") { areaSqm = plotArea; areaSqft = plotArea * 10.764; }
      else if (unit === "acre") { areaSqm = plotArea * 4046.86; areaSqft = plotArea * 43560; }
      else if (unit === "hectare") { areaSqm = plotArea * 10000; areaSqft = plotArea * 107639; }
    }

    var baseBUA  = areaSqm ? (areaSqm * type.baseFSI).toFixed(1) : "—";
    var maxBUA   = areaSqm ? (areaSqm * type.maxFSI).toFixed(1)  : "—";
    var baseSqft = areaSqm ? (areaSqft * type.baseFSI).toFixed(0) : "—";
    var maxSqft  = areaSqm ? (areaSqft * type.maxFSI).toFixed(0)  : "—";

    var cat = CAT_STYLE[type.category] || CAT_STYLE["Other"];
    var tdrBadge = type.tdrAllowed
      ? '<span class="fsi-badge fsi-badge-tdr">TDR Allowed</span>'
      : '<span class="fsi-badge fsi-badge-notdr">No TDR</span>';

    result.innerHTML =
      '<div class="fsi-res-header">' +
        '<div class="fsi-res-city">' + cat.icon + ' ' + city.name + '</div>' +
        '<span class="fsi-tag ' + cat.tag + '">' + type.category + '</span>' +
      '</div>' +
      '<div class="fsi-res-land">' + type.label + '</div>' +
      '<div class="fsi-res-auth">📜 ' + city.authority + ' · ' + city.regulation + '</div>' +

      '<div class="fsi-res-fsi-row">' +
        '<div class="fsi-res-box">' +
          '<div class="fsi-rb-label">Base FSI</div>' +
          '<div class="fsi-rb-val">' + type.baseFSI.toFixed(2) + '</div>' +
        '</div>' +
        '<div class="fsi-res-box fsi-res-box-max">' +
          '<div class="fsi-rb-label">Max FSI</div>' +
          '<div class="fsi-rb-val fsi-rb-gold">' + type.maxFSI.toFixed(2) + '</div>' +
        '</div>' +
        '<div class="fsi-res-box">' +
          '<div class="fsi-rb-label">Premium FSI</div>' +
          '<div class="fsi-rb-val">' + (type.premiumFSI > 0 ? '+' + type.premiumFSI.toFixed(2) : 'None') + '</div>' +
        '</div>' +
      '</div>' +

      (areaSqm > 0 ? (
        '<div class="fsi-res-bua">' +
          '<div class="fsi-bua-row">' +
            '<span class="fsi-bua-label">Base BUA (sq.m / sq.ft)</span>' +
            '<span class="fsi-bua-val">' + baseBUA + ' m² / ' + Number(baseSqft).toLocaleString() + ' ft²</span>' +
          '</div>' +
          '<div class="fsi-bua-row">' +
            '<span class="fsi-bua-label">Max BUA (with full FSI)</span>' +
            '<span class="fsi-bua-val fsi-bua-gold">' + maxBUA + ' m² / ' + Number(maxSqft).toLocaleString() + ' ft²</span>' +
          '</div>' +
        '</div>'
      ) : '') +

      '<div class="fsi-res-note">' + tdrBadge + '<p>' + type.note + '</p></div>';

    result.style.display = "block";
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /* ─────────────────────────────────────────────────────────
     INIT — wire up all DOM events
  ───────────────────────────────────────────────────────── */
  window.addEventListener("DOMContentLoaded", function () {
    var cityInput  = document.getElementById("fsi-city-input");
    var citySel    = document.getElementById("fsi-city-sel");
    var landSel    = document.getElementById("fsi-land-sel");
    var calcBtn    = document.getElementById("fsi-calc-btn");
    var resetBtn   = document.getElementById("fsi-reset-btn");

    if (!cityInput || !citySel || !landSel) return; // not on fsi page

    populateCitySelect(citySel);

    /* city text search */
    cityInput.addEventListener("input", function () {
      buildSearchSuggestions(cityInput, citySel, landSel);
      citySel.value = "";
      populateLandSelect("", landSel);
      clearResult();
    });

    /* hide suggestions on outside click */
    document.addEventListener("click", function(e) {
      var box = document.getElementById("fsi-city-suggestions");
      if (box && !box.contains(e.target) && e.target !== cityInput) {
        box.style.display = "none";
      }
    });

    /* city dropdown change */
    citySel.addEventListener("change", function () {
      var key = citySel.value;
      if (key && FSI_DB[key]) cityInput.value = FSI_DB[key].name;
      populateLandSelect(key, landSel);
      clearResult();
    });

    /* land type change */
    landSel.addEventListener("change", function () { clearResult(); });

    /* calculate */
    if (calcBtn) calcBtn.addEventListener("click", runCalc);

    /* reset */
    if (resetBtn) resetBtn.addEventListener("click", function () {
      cityInput.value = "";
      citySel.value = "";
      populateLandSelect("", landSel);
      document.getElementById("fsi-plot-area").value = "";
      clearResult();
    });
  });

})(); // end IIFE
