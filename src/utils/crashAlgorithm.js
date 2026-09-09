/**
 * 
 * src/utils/crashAlgorithm.js
 * 
 */

/**
 * 
 * Generates a crash multiplier with a 3% house edge.
 * @returns {number} Multiplier value between 1.00 and 1000.00
 * 
 */
export const generateCrashPoint = () => {
  if (Math.random() < 0.03) return 1.0; // 3% House edge instant crash
  const e = 100;
  const r = Math.random() * e;
  const crash = Math.max(1.0, Math.floor((100 / (100 - r)) * 100) / 100);
  return Math.min(crash, 1000.0);
};
