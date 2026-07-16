import { getAssetBase } from "../utils/theme.js";
import { applyAll } from "../utils/language.js";

export async function initFooter() {
  const base = getAssetBase();
  const res = await fetch(`${base}/data/app.json`);
  const app = await res.json();
  const portfolioUrl = app.footer?.portfolioUrl || "https://civitasatlas.vercel.app";

  const root = document.getElementById("footer-root");
  if (!root) return;

  root.innerHTML = `
    <footer class="site-footer">
      <p data-key="${app.footer.developedKey}">Developed by Civitas Atlas Technologies Pvt. Ltd.</p>
      <p>
        <a href="${portfolioUrl}" target="_blank" rel="noopener noreferrer" data-key="${app.footer.portfolioLabelKey}">Portfolio</a>
      </p>
    </footer>
  `;

  applyAll();
}
