import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react'
import { detectOS, type OS } from './os'

/** Detected once per mount; the page is client-rendered so this is safe on first render. */
export function useOS(): OS {
  const [os] = useState(detectOS)
  return os
}

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  )
}

export function prefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION).matches
}

type InViewOptions = { once?: boolean; rootMargin?: string; threshold?: number }

export function useInView(
  ref: RefObject<Element | null>,
  { once = false, rootMargin = '0px', threshold = 0 }: InViewOptions = {},
) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting && once) observer.disconnect()
      },
      { rootMargin, threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, once, rootMargin, threshold])

  return inView
}

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/** How far `el` has scrolled through the viewport: 0 when its top hits the top, 1 when its bottom hits the bottom. */
export function stickyProgress(el: Element) {
  const rect = el.getBoundingClientRect()
  const travel = rect.height - window.innerHeight
  return travel <= 0 ? 1 : clamp(-rect.top / travel)
}
