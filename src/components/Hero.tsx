import { useEffect, useRef, type CSSProperties } from 'react'
import { site } from '../config/site'
import { WIZARD_TAIL } from '../lib/brand'
import { useReducedMotion } from '../lib/hooks'
import { SparkleField } from '../lib/sparkles'
import { Github } from './Icons'
import { Container, DownloadButton } from './ui'
import { WizardLogo } from './WizardLogo'

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties

export function Hero() {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const parallaxRef = useRef<HTMLDivElement>(null)
  const wizardRef = useRef<HTMLImageElement>(null)

  // The wizard drifts up as you scroll away, trailing sparks from the broom.
  useEffect(() => {
    if (reduced) return
    const section = sectionRef.current!
    const canvas = canvasRef.current!
    const parallax = parallaxRef.current!
    const wizard = wizardRef.current!
    const field = new SparkleField(canvas)
    field.resize()

    let visible = true
    let raf = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const sy = window.scrollY
      parallax.style.transform = `translate3d(${sy * 0.04}px, ${-sy * 0.14}px, 0)`

      const w = wizard.getBoundingClientRect()
      const c = canvas.getBoundingClientRect()
      if (w.width > 0) {
        field.emit(w.left - c.left + w.width * (WIZARD_TAIL.x + 0.04), w.top - c.top + w.height * (WIZARD_TAIL.y - 0.02), {
          count: 1,
          vx: -70,
          vy: 14,
          spread: 40,
          jitter: w.width * 0.06,
        })
      }
      field.step(dt)
      raf = visible ? requestAnimationFrame(tick) : 0
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !raf) {
        last = performance.now()
        raf = requestAnimationFrame(tick)
      }
    })
    io.observe(section)

    const onResize = () => field.resize()
    window.addEventListener('resize', onResize)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [reduced])

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative overflow-x-clip pt-24 pb-16 sm:pt-32 lg:flex lg:min-h-[min(100svh,940px)] lg:items-center lg:pt-24 lg:pb-16"
    >
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />

      <Container className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-6">
        <div className="relative z-10 text-center lg:text-left">
          <h1 id="hero-title" className="display fade-up text-[3rem] text-balance sm:text-[4.25rem] lg:text-[5rem]" style={delay(100)}>
            An AI file organizer that <em className="italic">asks</em> before it moves anything.
          </h1>

          <p className="fade-up mx-auto mt-6 max-w-xl text-base leading-relaxed text-pretty text-mist sm:text-lg lg:mx-0" style={delay(300)}>
            Point TidyFlow at a cluttered folder. It reads documents and images, flags duplicates and proposes a home for every
            file, in a folder layout you describe in plain English. Nothing is moved until you approve the plan.
          </p>

          <div className="fade-up mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start" style={delay(450)}>
            <DownloadButton className="w-full sm:w-auto" />
            <a href={site.repoUrl} className="btn btn-ghost w-full sm:w-auto">
              <Github className="size-4" />
              View on GitHub
            </a>
          </div>

          <p className="fade-up mt-5 text-sm text-mist-dim" style={delay(550)}>
            Runs on macOS, Windows and Linux. Free and open source under the {site.license} license.
          </p>
        </div>

        <div aria-hidden="true" className="relative order-first mx-auto w-full max-w-[260px] sm:max-w-[380px] lg:order-none lg:max-w-[520px]">
          <div ref={parallaxRef} className="will-change-transform">
            <div className="wizard-enter">
              <div className="wizard-float">
                <WizardLogo ref={wizardRef} fetchPriority="high" loading="eager" className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
