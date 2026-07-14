import { getAssetBase } from "./theme.js";

const STORAGE_KEY = "mahaatlas_lang";

let dictionary = { en: {}, mr: {} };
let current = "en";

function getByPath(obj, path) {
  return path.split(".").reduce((o, key) => (o == null ? undefined : o[key]), obj);
}

export function getCurrentLanguage() {
  return current;
}

export function setLanguage(lang) {
  current = lang === "mr" ? "mr" : "en";
  localStorage.setItem(STORAGE_KEY, current);
  document.documentElement.lang = current === "mr" ? "mr" : "en";
  applyAll();
  window.dispatchEvent(new CustomEvent("mahaatlas:language", { detail: { lang: current } }));
}

export function t(key) {
  const dict = dictionary[current] || dictionary.en;
  const fallback = dictionary.en;
  return getByPath(dict, key) ?? getByPath(fallback, key) ?? key;
}

export function applyAll() {
  const dict = dictionary[current] || dictionary.en;
  const fallback = dictionary.en;

  document.querySelectorAll("[data-key]").forEach((el) => {
    const key = el.getAttribute("data-key");
    if (!key) return;
    const val = getByPath(dict, key) ?? getByPath(fallback, key);
    if (val != null) el.textContent = val;
  });

  document.querySelectorAll("[data-key-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-key-placeholder");
    if (!key || !("placeholder" in el)) return;
    const val = getByPath(dict, key) ?? getByPath(fallback, key);
    if (val != null) el.placeholder = val;
  });

  document.querySelectorAll("[data-key-aria]").forEach((el) => {
    const key = el.getAttribute("data-key-aria");
    if (!key) return;
    const val = getByPath(dict, key) ?? getByPath(fallback, key);
    if (val != null) el.setAttribute("aria-label", val);
  });
}

export function setDynamicKey(el, key) {
  if (!el) return;
  el.setAttribute("data-key", key);
  applyAll();
}

export async function initLanguage() {
  const base = getAssetBase();
  const res = await fetch(`${base}/data/language.json`);
  dictionary = await res.json();

  const stored = localStorage.getItem(STORAGE_KEY);
  current = stored === "mr" ? "mr" : "en";
  document.documentElement.lang = current === "mr" ? "mr" : "en";

  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-lang-toggle]");
    if (!btn) return;
    const target = btn.getAttribute("data-lang-target");
    if (target === "mr" || target === "en") setLanguage(target);
    else setLanguage(current === "en" ? "mr" : "en");
  });

  applyAll();

  return dictionary;
}
