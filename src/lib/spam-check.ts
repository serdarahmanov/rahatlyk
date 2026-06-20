const MIN_ELAPSED_MS = 4000

export function isSpam(honeypot: string | null | undefined, loadedAt: number | null | undefined): boolean {
  if (honeypot) return true
  if (!loadedAt || Date.now() - loadedAt < MIN_ELAPSED_MS) return true
  return false
}

// Prefix values that start with a spreadsheet formula character so Excel / Sheets
// treats them as literal text instead of executing them as formulas.
const FORMULA_PREFIX = /^[=+\-@\t\r]/

export function sanitizeCsv(value: string): string {
  return FORMULA_PREFIX.test(value) ? `'${value}` : value
}
