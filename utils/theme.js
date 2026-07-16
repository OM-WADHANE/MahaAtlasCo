const STORAGE_KEY = "mahaatlas_theme";

/** @returns {'..'|'.'} */
export function getAssetBase() {
  return window.location.pathname.includes("/pages/") ? ".." : ".";
}

function applyCssVars(theme, mode) {
  const root = document.documentElement;
  const palette = theme[mode] || theme.light;

  root.style.setProperty("--primary", theme.primary);
  root.style.setProperty("--primary-hover", theme.primaryHover);
  root.style.setProperty("--primary-muted", theme.primaryMuted);
  root.style.setProperty("--accent", theme.accent);
  root.style.setProperty("--font-sans", theme.fontSans);
  root.style.setProperty("--transition-theme", theme.transitionTheme);
  root.style.setProperty("--radius-sm", theme.radiusSm);
  root.style.setProperty("--radius-md", theme.radiusMd);
  root.style.setProperty("--radius-lg", theme.radiusLg);

  root.style.setProperty("--bg", palette.bg);
  root.style.setProperty("--bg-elevated", palette.bgElevated);
  root.style.setProperty("--surface", palette.surface);
  root.style.setProperty("--surface-hover", palette.surfaceHover);
  root.style.setProperty("--border", palette.border);
  root.style.setProperty("--text", palette.text);
  root.style.setProperty("--text-muted", palette.textMuted);
  root.style.setProperty("--header-bg", palette.headerBg);
  root.style.setProperty("--shadow", palette.shadow);
  root.style.setProperty("--shadow-sm", palette.shadowSm);
}

function getStoredTheme() {
  const v = localStorage.getItem(STORAGE_KEY);
  return v === "dark" || v === "light" ? v : "light";
}

export function getTheme() {
  return getStoredTheme();
}

export function refreshThemeToggleButtons() {
  const t = getStoredTheme();
  document.querySelectorAll("[data-theme-toggle]").forEach((el) => {
    el.setAttribute("aria-pressed", t === "dark" ? "true" : "false");
    el.dataset.activeTheme = t;
    const light = el.querySelector(".theme-label-light");
    const dark = el.querySelector(".theme-label-dark");
    if (light && dark) {
      light.style.display = t === "light" ? "inline" : "none";
      dark.style.display = t === "dark" ? "inline" : "none";
    }
  });
}

export function setTheme(mode) {
  const next = mode === "dark" ? "dark" : "light";
  localStorage.setItem(STORAGE_KEY, next);
  document.documentElement.setAttribute("data-theme", next);
  if (window.__mahaatlasThemePayload) {
    applyCssVars(window.__mahaatlasThemePayload, next);
  }
  window.dispatchEvent(new CustomEvent("mahaatlas:theme", { detail: { theme: next } }));
}

export async function initTheme() {
  const base = getAssetBase();
  const res = await fetch(`${base}/data/theme.json`);
  const theme = await res.json();
  window.__mahaatlasThemePayload = theme;

  const stored = getStoredTheme();
  document.documentElement.setAttribute("data-theme", stored);
  applyCssVars(theme, stored);

  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-theme-toggle]");
    if (!btn) return;
    const current = getStoredTheme();
    setTheme(current === "dark" ? "light" : "dark");
  });

  refreshThemeToggleButtons();
  window.addEventListener("civitas:theme", refreshThemeToggleButtons);

  return theme;
}
