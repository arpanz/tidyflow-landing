import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/hooks'

type Star = { x: number; y: number; r: number; a: number; depth: number }

/** Fixed night sky behind the page. Stars drift a little with scroll; they don't twinkle. */
export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const reduced = prefersReducedMotion()
    let stars: Star[] = []
    let width = 0
    let height = 0
    let raf = 0

    const makeStars = () => {
      const count = Math.min(140, Math.round((width * height) / 11000))
      stars = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 0.9 + 0.25,
        a: Math.random() * 0.45 + 0.12,
        depth: Math.random() * 0.8 + 0.2,
      }))
    }

    const draw = () => {
      raf = 0
      ctx.clearRect(0, 0, width, height)
      const scroll = reduced ? 0 : window.scrollY
      ctx.fillStyle = '#e3ebff'
      for (const s of stars) {
        const y = (((s.y * height - scroll * s.depth * 0.05) % height) + height) % height
        ctx.globalAlpha = s.a
        ctx.beginPath()
        ctx.arc(s.x * width, y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const widthChanged = window.innerWidth !== width
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // Mobile URL bars change the height constantly; only reshuffle when the width changes.
      if (widthChanged || !stars.length) makeStars()
      draw()
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    if (!reduced) window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />
}
