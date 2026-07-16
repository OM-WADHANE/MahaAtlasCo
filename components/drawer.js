import { getAssetBase } from "../utils/theme.js";
import { applyAll } from "../utils/language.js";

export async function initDrawer() {
  const base = getAssetBase();
  const res = await fetch(`${base}/data/app.json`);
  const app = await res.json();

  const pageId = document.body.dataset.page || "overview";

  const navHtml = (app.nav || [])
    .map((item) => {
      const active = item.id === pageId ? " is-active" : "";
      return `<a class="nav-link${active}" href="${item.href}" data-key="${item.labelKey}"></a>`;
    })
    .join("");

  const host = document.getElementById("drawer-root");
  if (!host) return;

  host.innerHTML = `
    <div class="drawer-overlay" data-drawer-overlay hidden></div>
    <aside class="drawer" id="app-drawer" aria-label="Mobile menu" hidden>
      <div class="drawer__head">
        <span class="site-header__app" data-key="${app.nameKey}"></span>
        <button type="button" class="icon-btn" data-drawer-close aria-label="Close menu">✕</button>
      </div>
      <nav class="drawer__nav" aria-label="Mobile primary">
        ${navHtml}
      </nav>
    </aside>
  `;

  const overlay = host.querySelector("[data-drawer-overlay]");
  const drawer = host.querySelector("#app-drawer");
  const openBtns = document.querySelectorAll("[data-drawer-open]");
  const closeBtns = host.querySelectorAll("[data-drawer-close]");

  function open() {
    overlay.hidden = false;
    drawer.hidden = false;
    requestAnimationFrame(() => {
      overlay.classList.add("is-open");
      drawer.classList.add("is-open");
    });
    openBtns.forEach((b) => b.setAttribute("aria-expanded", "true"));
    document.body.style.overflow = "hidden";
  }

  function close() {
    overlay.classList.remove("is-open");
    drawer.classList.remove("is-open");
    openBtns.forEach((b) => b.setAttribute("aria-expanded", "false"));
    document.body.style.overflow = "";
    const t = setTimeout(() => {
      overlay.hidden = true;
      drawer.hidden = true;
    }, 320);
    host.dataset.closeTimer = String(t);
  }

  openBtns.forEach((btn) => btn.addEventListener("click", open));
  closeBtns.forEach((btn) => btn.addEventListener("click", close));
  overlay.addEventListener("click", close);

  const nav = host.querySelector(".drawer__nav");
  if (nav) {
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a.nav-link")) close();
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("is-open")) close();
  });

  applyAll();
}
