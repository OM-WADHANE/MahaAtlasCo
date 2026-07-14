/**
 * Risk score: (yesCount / total) * 100 — all items count toward total;
 * only "yes" answers increment the numerator.
 * @param {number} yesCount
 * @param {number} totalCount
 * @returns {number} 0–100 integer
 */
export function computeRiskScore(yesCount, totalCount) {
  if (!totalCount || totalCount < 1) return 0;
  const safeYes = Math.max(0, Math.min(yesCount, totalCount));
  return Math.round((safeYes / totalCount) * 100);
}

/**
 * @param {Record<string, 'yes'|'no'|null|undefined>} states
 * @returns {{ yes: number, total: number, score: number }}
 */
export function summarizeRisk(states) {
  const entries = Object.values(states);
  const total = entries.length;
  const yes = entries.filter((v) => v === "yes").length;
  return { yes, total, score: computeRiskScore(yes, total) };
}
