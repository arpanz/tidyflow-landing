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
