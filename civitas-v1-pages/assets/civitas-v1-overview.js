/* civitas-v1-overview.js
   Chart data sourced from:
   MahaRERA · IGR Maharashtra · MCGM · PMC · NMC · MMRDA
   Maharashtra Economic Survey 2024-25 · NHB Residex
   All figures are estimates based on government reports and public data.
*/
(function () {

  /* ── CHART INSTANCES (global so AI updater can replace data) ── */
  window._mahaCharts = {};

  /* ── THEME COLOURS ── */
  var C = {
    p1: "#6D28D9", p2: "#9333EA", p3: "#C084FC",
    gold: "#E8B84B", teal: "#22C55E", blue: "#60A5FA",
    text: "rgba(255,255,255,0.6)",
    grid: "rgba(255,255,255,0.05)"
  };

  /* detect light mode */
  function tc() {
    return document.body.classList.contains("light-mode")
      ? "rgba(31,41,55,0.6)" : "rgba(255,255,255,0.6)";
  }
  function gc() {
    return document.body.classList.contains("light-mode")
      ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)";
  }

  /* ── SHARED CHART DEFAULTS ── */
  var BASE_OPTS = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 900, easing: "easeOutQuart" },
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: tc(), boxWidth: 10, font: { size: 10 }, padding: 10 }
      },
      tooltip: {
        backgroundColor: "rgba(15,10,31,0.92)",
        titleColor: "#C084FC",
        bodyColor: "rgba(255,255,255,0.8)",
        borderColor: "rgba(109,40,217,0.4)",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 10
      }
    }
  };

  /* ─────────────────────────────────────────────────────────────
     1. FSI COMPARISON — 2024-25 (DCPR 2034, PMC DP 2041, NMC DCR)
     Source: DCPR 2034 Table-1, PMC DP 2041, NMC DCR notifications
  ───────────────────────────────────────────────────────────── */
  var FSI_DATA = {
    labels: ["Mumbai\nIsland", "Mumbai\nTOD", "Pune\nGeneral", "Pune\nTOD", "Nagpur", "Navi\nMumbai", "Thane", "Nashik"],
    base:   [1.33,  4.0,  2.5,  3.0,  1.5,  1.0,  1.5,  1.0],
    max:    [4.0,   5.0,  3.7,  4.0,  4.0,  3.5,  3.0,  2.0]
  };

  /* ─────────────────────────────────────────────────────────────
     2. MARKET PRICE TREND — ₹ per sq.ft, 2019–2025
     Source: NHB Residex, IGR Maharashtra, JLL India, Anarock 2024
  ───────────────────────────────────────────────────────────── */
  var PRICE_DATA = {
    labels: ["2019","2020","2021","2022","2023","2024","2025*"],
    mumbai: [13800, 14200, 14800, 16100, 17400, 18900, 19850],
    pune:   [5100,  5300,  5700,  6300,  7100,  8200,  8950],
    nagpur: [3600,  3750,  3950,  4300,  4750,  5400,  5900]
  };

  /* ─────────────────────────────────────────────────────────────
     3. TRANSACTION MIX — Maharashtra FY 2024-25
     Source: IGR Maharashtra Annual Report 2024, MahaRERA data
  ───────────────────────────────────────────────────────────── */
  var PIE_DATA = {
    labels: ["Residential", "Commercial", "Plot / Land", "Industrial"],
    values: [64, 19, 12, 5],
    colors: [C.p1, C.p2, C.p3, C.gold]
  };

  /* ── Build / rebuild charts ── */
  function buildFSIChart() {
    var el = document.getElementById("fsiChart");
    if (!el || typeof Chart === "undefined") return;
    if (window._mahaCharts.fsi) window._mahaCharts.fsi.destroy();
    window._mahaCharts.fsi = new Chart(el, {
      type: "bar",
      data: {
        labels: FSI_DATA.labels,
        datasets: [
          {
            label: "Base FSI",
            data: FSI_DATA.base,
            backgroundColor: C.p1,
            borderRadius: 5,
            borderSkipped: false
          },
          {
            label: "Max Permissible FSI",
            data: FSI_DATA.max,
            backgroundColor: C.p3,
            borderRadius: 5,
            borderSkipped: false
          }
        ]
      },
      options: Object.assign({}, BASE_OPTS, {
        plugins: Object.assign({}, BASE_OPTS.plugins, {
          legend: { position:"bottom", labels:{ color:tc(), boxWidth:10, font:{size:10} } },
          tooltip: Object.assign({}, BASE_OPTS.plugins.tooltip, {
            callbacks: {
              label: function(ctx) {
                return " " + ctx.dataset.label + ": " + ctx.parsed.y.toFixed(2);
              }
            }
          })
        }),
        scales: {
          x: { ticks:{ color:tc(), font:{size:9} }, grid:{ display:false } },
          y: { ticks:{ color:tc() }, grid:{ color:gc() }, min:0, max:6 }
        }
      })
    });
  }

  function buildPriceChart() {
    var el = document.getElementById("priceChart");
    if (!el || typeof Chart === "undefined") return;
    if (window._mahaCharts.price) window._mahaCharts.price.destroy();
    window._mahaCharts.price = new Chart(el, {
      type: "line",
      data: {
        labels: PRICE_DATA.labels,
        datasets: [
          {
            label: "Mumbai",
            data: PRICE_DATA.mumbai,
            borderColor: C.p2,
            backgroundColor: "rgba(147,51,234,0.08)",
            tension: 0.42, fill: true,
            pointRadius: 4, pointBackgroundColor: C.p2,
            pointHoverRadius: 6
          },
          {
            label: "Pune",
            data: PRICE_DATA.pune,
            borderColor: C.p3,
            backgroundColor: "rgba(192,132,252,0.06)",
            tension: 0.42, fill: true,
            pointRadius: 4, pointBackgroundColor: C.p3,
            pointHoverRadius: 6
          },
          {
            label: "Nagpur",
            data: PRICE_DATA.nagpur,
            borderColor: C.gold,
            backgroundColor: "rgba(232,184,75,0.06)",
            tension: 0.42, fill: true,
            pointRadius: 4, pointBackgroundColor: C.gold,
            pointHoverRadius: 6
          }
        ]
      },
      options: Object.assign({}, BASE_OPTS, {
        plugins: Object.assign({}, BASE_OPTS.plugins, {
          legend: { position:"bottom", labels:{ color:tc(), boxWidth:10, font:{size:10} } },
          tooltip: Object.assign({}, BASE_OPTS.plugins.tooltip, {
            callbacks: {
              label: function(ctx) {
                return " " + ctx.dataset.label + ": ₹" + ctx.parsed.y.toLocaleString() + "/sqft";
              }
            }
          })
        }),
        scales: {
          x: { ticks:{ color:tc() }, grid:{ display:false } },
          y: {
            ticks: {
              color: tc(),
              callback: function(v){ return "₹" + (v/1000).toFixed(0) + "K"; }
            },
            grid: { color:gc() }
          }
        }
      })
    });
  }

  function buildPieChart() {
    var el = document.getElementById("pieChart");
    if (!el || typeof Chart === "undefined") return;
    if (window._mahaCharts.pie) window._mahaCharts.pie.destroy();
    window._mahaCharts.pie = new Chart(el, {
      type: "doughnut",
      data: {
        labels: PIE_DATA.labels,
        datasets: [{
          data: PIE_DATA.values,
          backgroundColor: PIE_DATA.colors,
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 900 },
        plugins: {
          legend: { display: false },
          tooltip: Object.assign({}, BASE_OPTS.plugins.tooltip, {
            callbacks: {
              label: function(ctx) {
                return " " + ctx.label + ": " + ctx.parsed + "%";
              }
            }
          })
        },
        cutout: "68%"
      }
    });
    /* Update the legend text with live percentages */
    var items = document.querySelectorAll(".pie-legend-item");
    if (items.length) {
      var labels = ["Residential","Commercial","Plot / Land","Industrial"];
      items.forEach(function(el, i) {
        var span = el.querySelector(".pie-legend-pct");
        if (span) span.textContent = labels[i] + " — " + PIE_DATA.values[i] + "%";
      });
    }
  }

  /* ── Expose for AI updater ── */
  window.mahaUpdateCharts = function(data) {
    if (data.fsi_base   && data.fsi_max)    { FSI_DATA.base  = data.fsi_base;  FSI_DATA.max   = data.fsi_max;  buildFSIChart(); }
    if (data.price_mum  && data.price_pune) { PRICE_DATA.mumbai = data.price_mum; PRICE_DATA.pune = data.price_pune; if(data.price_ngp) PRICE_DATA.nagpur = data.price_ngp; buildPriceChart(); }
    if (data.pie_values){ PIE_DATA.values = data.pie_values; buildPieChart(); }
  };

  window.addEventListener("load", function() {
    buildFSIChart();
    buildPriceChart();
    buildPieChart();
  });

  /* Re-render on theme toggle to pick up correct text/grid colours */
  var _origToggle = window.toggleTheme;
  window.toggleTheme = function() {
    if (_origToggle) _origToggle();
    setTimeout(function() {
      buildFSIChart();
      buildPriceChart();
      buildPieChart();
    }, 80);
  };

})();
