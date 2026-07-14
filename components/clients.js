import { getAssetBase } from "../utils/theme.js";
import { applyAll } from "../utils/language.js";

/**
 * Renders the infinite clients/partners marquee from clients.json.
 * @param {string} mountSelector
 */
export async function initClientsMarquee(mountSelector = "#clients-section-root") {
  const mount = document.querySelector(mountSelector);
  if (!mount) return;

  const base = getAssetBase();
  const res = await fetch(`${base}/data/clients.json`);
  const data = await res.json();
  const items = data.items || [];
  const duration = data.scrollSpeedSeconds || 32;

  document.documentElement.style.setProperty("--marquee-duration", `${duration}s`);

  const logosHtml = items
    .map(
      (c) => `
      <div class="client-logo" style="background:${c.color}" title="${c.name}">
        <span>${c.initials}</span>
      </div>
    `
    )
    .join("");

  mount.innerHTML = `
    <section class="clients-section" aria-label="Clients">
      <h2 class="clients-section__title" data-key="overview.partnersTitle"></h2>
      <div class="clients-marquee-wrap" style="overflow:hidden">
        <div class="clients-marquee">
          <div class="clients-track">${logosHtml}</div>
          <div class="clients-track" aria-hidden="true">${logosHtml}</div>
        </div>
      </div>
    </section>
  `;

  applyAll();
}
