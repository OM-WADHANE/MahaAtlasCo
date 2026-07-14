import { getAssetBase, refreshThemeToggleButtons } from "../utils/theme.js";
import { applyAll } from "../utils/language.js";

let appConfig = null;

export async function initHeader() {
  const base = getAssetBase();
  const res = await fetch(`${base}/data/app.json`);
  appConfig = await res.json();

  const root = document.getElementById("header-root");
  if (!root) return appConfig;

  const pageId = document.body.dataset.page || "overview";
  const titleKey = appConfig.headerTitleKeys?.[pageId] || "header.title_overview";

  const navHtml = (appConfig.nav || [])
    .map((item) => {
      const active = item.id === pageId ? " is-active" : "";
      return `<a class="nav-link${active}" href="${item.href}" data-nav-id="${item.id}" data-key="${item.labelKey}"></a>`;
    })
    .join("");

  root.innerHTML = `
    <header class="site-header">
      <div class="site-header__inner">
        <div class="site-header__brand">
          <div class="site-header__logo" aria-hidden="true">CA</div>
          <div class="site-header__titles">
            <div class="site-header__app" data-key="${appConfig.nameKey}">MahaAtlas</div>
            <div class="site-header__page" id="header-page-title" data-key="${titleKey}"></div>
          </div>
        </div>
        <nav class="site-header__nav" aria-label="Primary">
          ${navHtml}
        </nav>
        <div class="site-header__actions">
          <button type="button" class="icon-btn" data-theme-toggle aria-pressed="false" title="Toggle theme">
            <span class="theme-label-light" data-key="header.themeLight">Light</span>
            <span class="theme-label-dark" data-key="header.themeDark">Dark</span>
          </button>
          <button type="button" class="icon-btn" id="adminLoginBtn" title="Admin Panel" onclick="window.location.href='./admin.html'">
            <span>⚙️</span>
          </button>
          <button type="button" class="icon-btn" data-lang-toggle data-lang-target="en" title="English">
            <span data-key="header.langEn">EN</span>
          </button>
          <button type="button" class="icon-btn" data-lang-toggle data-lang-target="mr" title="Marathi">
            <span data-key="header.langMr">MR</span>
          </button>
          <button type="button" class="icon-btn drawer-toggle" data-drawer-open aria-expanded="false">
            <span data-key="header.menu">Menu</span>
          </button>
        </div>
      </div>
    </header>
  `;

  refreshThemeToggleButtons();

  applyAll();

  return appConfig;
}
