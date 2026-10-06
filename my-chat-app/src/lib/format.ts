export function formatTime(d = new Date()) {
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
}

/** −12 / +15 / ±0 using a real minus sign */
export function formatDelta(d: number) {
  if (d === 0) return '±0';
  return d > 0 ? `+${d}` : `−${Math.abs(d)}`;
}

/** colour for a friction value (lower is better) */
export function frictionColor(value: number, target: number) {
  if (value <= target) return 'var(--color-good)';
  if (value <= target + 25) return 'var(--color-warn)';
  return 'var(--color-bad)';
}

export function zoneGradient(target: number) {
  const amber = Math.min(100, target + 25);
  return `linear-gradient(90deg,#E3F5E9 0 ${target}%,#FDF1DE ${target}% ${amber}%,#FCE8E8 ${amber}% 100%)`;
}

export const pronoun = (p: 'she' | 'he') => ({
  object: p === 'she' ? 'her' : 'him',
  possessive: p === 'she' ? 'her' : 'his',
  subject: p,
});
