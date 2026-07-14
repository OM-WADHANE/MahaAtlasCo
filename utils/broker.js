import { getAssetBase } from "./theme.js";

function formatInr(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export async function initBrokerCalculator() {
  const valueInput = document.getElementById("broker-value");
  const rateInput = document.getElementById("broker-rate");
  const btn = document.getElementById("broker-calc-btn");
  const outBrokerage = document.getElementById("out-brokerage");
  const outGst = document.getElementById("out-gst");
  const outTotal = document.getElementById("out-total");

  if (!valueInput || !rateInput || !btn || !outBrokerage || !outGst || !outTotal) return;

  const base = getAssetBase();
  const res = await fetch(`${base}/data/app.json`);
  const app = await res.json();
  const d = app.brokerDefaults || {};
  const gstRate = typeof d.gstRate === "number" ? d.gstRate : 0.18;

  valueInput.value = d.propertyValue ?? 10000000;
  rateInput.value = d.brokeragePercent ?? 2;

  function render() {
    const value = Number(valueInput.value) || 0;
    const rate = Number(rateInput.value) || 0;
    const brokerage = (value * rate) / 100;
    const gst = brokerage * gstRate;
    const total = brokerage + gst;

    outBrokerage.textContent = formatInr(brokerage);
    outGst.textContent = formatInr(gst);
    outTotal.textContent = formatInr(total);
  }

  btn.addEventListener("click", render);
  render();
}
