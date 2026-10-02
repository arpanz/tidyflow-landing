/*
 * TidyFlow's secret redaction, ported as-is from the app's src/utils.py (_SECRET_PATTERNS / redact_secrets)
 * so the OCR demo shows exactly what the app would send. Keep in sync if the app's patterns change.
 */
const PATTERNS: RegExp[] = [
  /AIza[0-9A-Za-z\-_]{35,}/gi, // Google API key
  /sk-[A-Za-z0-9]{20,}/gi, // OpenAI / DeepSeek key
  /ghp_[A-Za-z0-9]{36,}/gi, // GitHub PAT
  /github_pat_[A-Za-z0-9_]{50,}/gi, // GitHub fine-grained PAT
  /-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/gi, // PEM private keys
  /password\s*[:=]\s*['"][^\s'"]+['"]?/gi, // password = "..."
  /token\s*[:=]\s*['"][^\s'"]+['"]?/gi, // token = "..."
  /secret\s*[:=]\s*['"][^\s'"]+['"]?/gi, // secret = "..."
  /api[_-]?key\s*[:=]\s*['"][^\s'"]+['"]?/gi, // api_key = "..."
  /https?:\/\/[^\s:]+:[^\s@]+@[^\s]+/gi, // URL with basic auth
  /[a-zA-Z0-9_-]+:[a-zA-Z0-9_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi, // user:pass@host
]

export const REDACTED = '[REDACTED]'

/** Same result as the app's redact_secrets(): each pattern applied in turn, matches replaced. */
export function redactSecrets(text: string) {
  return PATTERNS.reduce((result, pattern) => result.replace(pattern, REDACTED), text)
}

export type Segment = { text: string; secret: boolean }

/** Splits text into plain and secret parts, for highlighting what redaction will remove. */
export function secretSegments(text: string): Segment[] {
  const spans: [number, number][] = []
  for (const pattern of PATTERNS) {
    for (const m of text.matchAll(pattern)) spans.push([m.index, m.index + m[0].length])
  }
  spans.sort((a, b) => a[0] - b[0])

  const segments: Segment[] = []
  let at = 0
  for (const [start, end] of spans) {
    if (end <= at) continue
    if (start > at) segments.push({ text: text.slice(at, start), secret: false })
    segments.push({ text: text.slice(Math.max(start, at), end), secret: true })
    at = end
  }
  if (at < text.length) segments.push({ text: text.slice(at), secret: false })
  return segments
}
