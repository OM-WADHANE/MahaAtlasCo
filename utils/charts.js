import { getAssetBase } from "./theme.js";

function readCssVar(name, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

export async function initPropertyGrowthChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof window.Chart === "undefined") return;

  const base = getAssetBase();
  const res = await fetch(`${base}/data/app.json`);
  const app = await res.json();
  const cfg = app.charts?.propertyGrowth;
  if (!cfg) return;

  const primary = readCssVar("--primary", "#6D28D9");
  const muted = readCssVar("--text-muted", "#5B5670");

  const ctx = canvas.getContext("2d");
  new window.Chart(ctx, {
    type: "line",
    data: {
      labels: cfg.labels,
      datasets: [
        {
          label: "Index",
          data: cfg.values,
          borderColor: primary,
          backgroundColor: `${primary}33`,
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          ticks: { color: muted },
          grid: { color: readCssVar("--border", "rgba(0,0,0,0.08)") },
        },
        y: {
          ticks: { color: muted },
          grid: { color: readCssVar("--border", "rgba(0,0,0,0.08)") },
        },
      },
    },
  });
}

export async function initFsiBarChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof window.Chart === "undefined") return;

  const base = getAssetBase();
  const res = await fetch(`${base}/data/app.json`);
  const app = await res.json();
  const cfg = app.charts?.fsiComparison;
  if (!cfg) return;

  const primary = readCssVar("--primary", "#6D28D9");
  const accent = readCssVar("--accent", "#A78BFA");
  const muted = readCssVar("--text-muted", "#5B5670");

  const ctx = canvas.getContext("2d");
  new window.Chart(ctx, {
    type: "bar",
    data: {
      labels: cfg.labels,
      datasets: [
        {
          label: "FSI",
          data: cfg.values,
          backgroundColor: cfg.values.map((_, i) => (i % 2 === 0 ? primary : accent)),
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          ticks: { color: muted },
          grid: { display: false },
        },
        y: {
          ticks: { color: muted },
          grid: { color: readCssVar("--border", "rgba(0,0,0,0.08)") },
        },
      },
    },
  });
}
