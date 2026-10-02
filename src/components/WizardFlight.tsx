import { useEffect, useRef } from 'react'
import { clamp, easeInOutCubic, lerp, stickyProgress, useReducedMotion } from '../lib/hooks'
import { WIZARD_TAIL } from '../lib/brand'
import { SparkleField } from '../lib/sparkles'
import { FileText, Folder, ImageIcon } from './Icons'
import { WizardLogo } from './WizardLogo'

const FOLDERS = ['Work', 'Photos', 'Finance'] as const

// Scattered start positions (% of the stage) and the folder each file belongs in.
const FILES = [
  { name: 'invoice_8821.pdf', kind: 'doc', folder: 2, x: 8, y: 34, r: -14 },
  { name: 'IMG_2041.HEIC', kind: 'img', folder: 1, x: 22, y: 56, r: 9 },
  { name: 'Q3-roadmap.docx', kind: 'doc', folder: 0, x: 31, y: 30, r: -6 },
  { name: 'receipt_feb.png', kind: 'img', folder: 2, x: 42, y: 50, r: 16 },
  { name: 'DSC_0193.JPG', kind: 'img', folder: 1, x: 50, y: 32, r: -18 },
  { name: 'notes.md', kind: 'doc', folder: 0, x: 58, y: 60, r: 7 },
  { name: 'tax_2025.pdf', kind: 'doc', folder: 2, x: 66, y: 38, r: -9 },
  { name: 'pitch-deck.pptx', kind: 'doc', folder: 0, x: 76, y: 54, r: 12 },
  { name: 'IMG_2077.HEIC', kind: 'img', folder: 1, x: 84, y: 30, r: -4 },
  { name: 'statement.pdf', kind: 'doc', folder: 2, x: 90, y: 47, r: 18 },
  { name: 'budget.xlsx', kind: 'doc', folder: 0, x: 15, y: 46, r: 5 },
  { name: 'screenshot.png', kind: 'img', folder: 1, x: 70, y: 66, r: -12 },
] as const

/** Flight path as fractions of the stage, built in real pixels so the trail's dash maths stays exact. */
const flightPath = (W: number, H: number) =>
  `M ${-0.14 * W} ${0.7 * H} C ${0.22 * W} ${0.08 * H}, ${0.52 * W} ${0.92 * H}, ${0.78 * W} ${0.38 * H} ` +
  `S ${1.04 * W} ${0.12 * H}, ${1.18 * W} ${0.22 * H}`

const MESSAGES = ['Your Downloads folder, right now.', 'One pass of the wand,', 'and everything is where you said it should go.']

export function WizardFlight() {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wizardRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const trailRef = useRef<SVGPathElement>(null)
  const chipRefs = useRef<(HTMLDivElement | null)[]>([])
  const countRefs = useRef<(HTMLSpanElement | null)[]>([])
  const folderRefs = useRef<(HTMLDivElement | null)[]>([])
  const messageRefs = useRef<(HTMLParagraphElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current!
    const stage = stageRef.current!
    const canvas = canvasRef.current!
    const wizard = wizardRef.current!
    const svg = svgRef.current!
    const path = pathRef.current!
    const trail = trailRef.current!
    const field = new SparkleField(canvas)

    let W = 0
    let H = 0
    let total = 0
    let raf = 0
    let active = false
    let shown = reduced ? 1 : 0
    let last = performance.now()
    let prevTail: { x: number; y: number } | null = null
    const counts = FOLDERS.map(() => -1)

    const measure = () => {
      W = stage.clientWidth
      H = stage.clientHeight
      const d = flightPath(W, H)
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
      path.setAttribute('d', d)
      trail.setAttribute('d', d)
      total = path.getTotalLength()
      field.resize()
    }

    const pointAt = (t: number) => {
      const p = path.getPointAtLength(clamp(t) * total)
      return { x: p.x, y: p.y }
    }

    const render = (p: number, dt: number) => {
      // With reduced motion the scene is static: files filed, wizard parked mid-flight below the text.
      const flight = reduced ? 0.5 : clamp(p / 0.86)

      // Wizard + trail
      const here = pointAt(flight)
      const ahead = pointAt(flight + 0.01)
      const angle = clamp((Math.atan2(ahead.y - here.y, ahead.x - here.x) * 180) / Math.PI, -28, 28) * 0.55
      const ww = wizard.offsetWidth
      const wh = wizard.offsetHeight
      wizard.style.transform = `translate3d(${here.x - ww * WIZARD_TAIL.x}px, ${here.y - wh * WIZARD_TAIL.y}px, 0) rotate(${angle}deg)`
      trail.style.strokeDashoffset = String(1 - flight)

      // Sparkles follow the movement
      if (!reduced && prevTail) {
        const dist = Math.hypot(here.x - prevTail.x, here.y - prevTail.y)
        if (dist > 0.5) {
          const dx = (here.x - prevTail.x) / dist
          const dy = (here.y - prevTail.y) / dist
          field.emit(here.x, here.y, { count: Math.min(7, 1 + Math.round(dist / 5)), vx: -dx * 70, vy: -dy * 70 + 10, spread: 60, jitter: 10 })
        }
      }
      prevTail = here
      if (!reduced) field.step(dt)

      // Files fly from the mess into their folder's stack as the wizard passes them
      const filed = FOLDERS.map(() => 0)
      const slot = FOLDERS.map(() => 0)
      const chipH = W < 640 ? 26 : 30
      const folderTop = H - (W < 640 ? 112 : 132)
      FILES.forEach((f, i) => {
        const el = chipRefs.current[i]
        if (!el) return
        const k = slot[f.folder]++
        const start = clamp((f.x / 100) * 0.78 - 0.06)
        const t = reduced ? 1 : easeInOutCubic(clamp((flight - start) / 0.24))
        const x0 = (f.x / 100) * W
        const y0 = (f.y / 100) * H
        const x1 = ((f.folder * 2 + 1) / 6) * W
        const y1 = folderTop - 14 - (k + 0.5) * (chipH + 5)
        const arc = Math.sin(Math.PI * t) * -(H * 0.08)
        el.style.transform = `translate3d(${lerp(x0, x1, t)}px, ${lerp(y0, y1, t) + arc}px, 0) translate(-50%, -50%) rotate(${lerp(f.r, 0, t)}deg) scale(${lerp(1, 0.94, t)})`
        el.dataset.state = t >= 1 ? 'filed' : t > 0 ? 'flying' : 'messy'
        if (t >= 1) filed[f.folder]++
      })
      filed.forEach((n, i) => {
        if (n === counts[i]) return
        counts[i] = n
        const c = countRefs.current[i]
        if (c) c.textContent = `${n} file${n === 1 ? '' : 's'}`
        folderRefs.current[i]?.setAttribute('data-full', String(n === 4))
      })

      // Narration
      const o = [1 - clamp((flight - 0.18) / 0.1), clamp((flight - 0.26) / 0.1) - clamp((flight - 0.62) / 0.1), clamp((flight - 0.7) / 0.1)]
      messageRefs.current.forEach((m, i) => {
        if (!m) return
        const v = reduced ? (i === 2 ? 1 : 0) : o[i]
        m.style.opacity = String(v)
        m.style.transform = `translateY(${(1 - v) * 14}px)`
      })
    }

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const target = stickyProgress(section)
      shown += (target - shown) * Math.min(1, dt * 7)
      if (Math.abs(target - shown) < 0.0005) shown = target
      render(shown, dt)
      raf = active || field.active ? requestAnimationFrame(tick) : 0
    }

    measure()
    render(shown, 0)

    const onResize = () => {
      measure()
      render(shown, 0)
    }
    window.addEventListener('resize', onResize)

    let io: IntersectionObserver | undefined
    if (!reduced) {
      io = new IntersectionObserver(([entry]) => {
        active = entry.isIntersecting
        if (active && !raf) {
          last = performance.now()
          prevTail = null
          raf = requestAnimationFrame(tick)
        }
      })
      io.observe(section)
    }

    return () => {
      cancelAnimationFrame(raf)
      io?.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      aria-labelledby="flight-title"
      className={`relative ${reduced ? 'h-[min(100svh,820px)]' : 'h-[240svh]'}`}
    >
      <div ref={stageRef} className={`${reduced ? 'relative h-full' : 'sticky top-0 h-svh'} overflow-hidden`}>
        <h2 id="flight-title" className="sr-only">
          TidyFlow sorts scattered files into folders
        </h2>
        <div className="absolute inset-x-0 top-[12%] px-4 text-center">
          {MESSAGES.map((m, i) => (
            <p
              key={m}
              ref={(el) => {
                messageRefs.current[i] = el
              }}
              className={`display text-[2.1rem] text-balance will-change-transform sm:text-6xl ${i === 0 ? '' : 'absolute inset-x-4 top-0'} ${
                i === 1 ? 'italic' : ''
              }`}
            >
              {m}
            </p>
          ))}
        </div>

        <svg ref={svgRef} aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <linearGradient id="trail-gradient" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#9fd0ff" stopOpacity="0" />
              <stop offset="1" stopColor="#9fd0ff" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          <path ref={pathRef} fill="none" stroke="none" />
          <path
            ref={trailRef}
            pathLength={1}
            fill="none"
            stroke="url(#trail-gradient)"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeDasharray="1 1"
            strokeDashoffset={1}
          />
        </svg>

        <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />

        <div aria-hidden="true">
          {FILES.map((f, i) => {
            const Icon = f.kind === 'img' ? ImageIcon : FileText
            return (
              <div
                key={f.name}
                ref={(el) => {
                  chipRefs.current[i] = el
                }}
                data-state="messy"
                className="group/chip absolute top-0 left-0 will-change-transform"
              >
                <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-night-raised px-2 py-1 font-mono text-[0.62rem] whitespace-nowrap text-mist transition-[border-color,color] duration-300 group-data-[state=filed]/chip:text-white/90 group-data-[state=flying]/chip:border-white/40 group-data-[state=flying]/chip:text-white sm:px-2.5 sm:py-1.5 sm:text-xs">
                  <Icon className="size-3 text-mist-dim sm:size-3.5" />
                  {f.name}
                </div>
              </div>
            )
          })}
        </div>

        <div className="absolute inset-x-0 bottom-6 grid grid-cols-3 gap-2 px-3 sm:bottom-10 sm:px-8" aria-hidden="true">
          {FOLDERS.map((name, i) => (
            <div
              key={name}
              ref={(el) => {
                folderRefs.current[i] = el
              }}
              data-full="false"
              className="group/folder mx-auto flex w-full max-w-[13rem] items-center gap-2 rounded-lg border border-white/10 bg-night-raised px-2.5 py-2.5 transition-[border-color] duration-500 data-[full=true]:border-app-ok/40 sm:gap-3 sm:px-4 sm:py-3.5"
            >
              <Folder className="size-5 shrink-0 text-mist transition-colors group-data-[full=true]/folder:text-app-ok sm:size-6" />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold sm:text-sm">{name}</p>
                <span
                  ref={(el) => {
                    countRefs.current[i] = el
                  }}
                  className="block font-mono text-[0.62rem] text-mist-dim sm:text-[0.68rem]"
                >
                  0 files
                </span>
              </div>
            </div>
          ))}
        </div>

        <div
          ref={wizardRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 w-28 will-change-transform sm:w-40"
          style={{ transformOrigin: `${WIZARD_TAIL.x * 100}% ${WIZARD_TAIL.y * 100}%` }}
        >
          <WizardLogo className="w-full" />
        </div>
      </div>
    </section>
  )
}
