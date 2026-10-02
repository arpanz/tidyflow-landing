export type OS = 'windows' | 'macos' | 'unknown'

type NavigatorUAData = Navigator & { userAgentData?: { platform?: string } }

export function detectOS(): OS {
  if (typeof navigator === 'undefined') return 'unknown'
  const nav = navigator as NavigatorUAData
  const platform = (nav.userAgentData?.platform || nav.platform || '').toLowerCase()
  const ua = nav.userAgent.toLowerCase()

  if (/iphone|ipad|ipod|android/.test(ua)) return 'unknown'
  if (platform.includes('win') || ua.includes('windows')) return 'windows'
  if (platform.includes('mac') || ua.includes('mac os')) {
    // iPadOS reports itself as a Mac; a touch screen gives it away.
    return nav.maxTouchPoints > 1 ? 'unknown' : 'macos'
  }
  return 'unknown'
}
