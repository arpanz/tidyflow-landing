import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from '../../lib/hooks'
import { Check, RotateCcw } from '../Icons'

type Phase = 'waiting' | 'copying' | 'verified'

const FILES = [
  { src: 'invoice_8821.pdf', dest: 'Finance/Invoices/', hash: '9f2c…e41a' },
  { src: 'IMG_2041.HEIC', dest: 'Personal/Photos/', hash: '3b7d…08cf' },
  { src: 'report.pdf', dest: 'Work/Documents/report_3f9a.pdf', hash: 'c41e…7b20', renamed: true },
]

const COPY_MS = 900
const VERIFY_MS = 380

export function SafeCopyDemo() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, threshold: 0.5 })
  const [run, setRun] = useState(0)
  const [progress, setPhases] = useState<Phase[]>(() => FILES.map(() => 'waiting'))
  const phases: Phase[] = reduced ? FILES.map(() => 'verified') : progress

  useEffect(() => {
    if (!inView || reduced) return
    const set = (i: number, p: Phase) => setPhases((prev) => prev.map((x, j) => (j === i ? p : x)))
    const timers: number[] = []
    FILES.forEach((_, i) => {
      const start = 250 + i * (COPY_MS + VERIFY_MS)
      timers.push(window.setTimeout(() => set(i, 'copying'), start))
      timers.push(window.setTimeout(() => set(i, 'verified'), start + COPY_MS + VERIFY_MS))
    })
    return () => timers.forEach(window.clearTimeout)
  }, [inView, run, reduced])

  const verified = phases.filter((p) => p === 'verified').length

  return (
    <div ref={ref}>
      <ul className="divide-y divide-white/[0.06] rounded-lg border border-white/[0.08]">
        {FILES.map((f, i) => {
          const phase = phases[i]
          return (
            <li key={f.src} className="px-3 py-3">
              <div className="flex items-center justify-between gap-3">
                <p className="min-w-0 font-mono text-[0.78rem] break-all text-white/90">
                  {f.src} <span className="text-mist-dim">→ {f.dest}</span>
                </p>
                <span
                  className={`flex shrink-0 items-center gap-1 font-mono text-[0.68rem] ${
                    phase === 'verified' ? 'text-app-ok' : phase === 'copying' ? 'text-white/80' : 'text-mist-dim'
                  }`}
                >
                  {phase === 'verified' ? (
                    <>
                      <Check className="size-3" /> verified
                    </>
                  ) : phase === 'copying' ? (
                    'copying'
                  ) : (
                    'queued'
                  )}
                </span>
              </div>
              <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className={`h-full ease-out ${phase === 'verified' ? 'bg-app-ok' : 'bg-white/60'}`}
                  style={{ width: phase === 'waiting' ? '0%' : '100%', transition: `width ${COPY_MS}ms, background-color 300ms` }}
                />
              </div>
              <p className="mt-1.5 flex flex-wrap gap-x-3 font-mono text-[0.66rem] text-mist-dim">
                <span className={`transition-opacity duration-300 ${phase === 'verified' ? 'opacity-100' : 'opacity-0'}`}>
                  sha256 {f.hash} matches original
                </span>
                {f.renamed && <span className="text-app-warn">report.pdf already existed</span>}
              </p>
            </li>
          )
        })}
      </ul>
      <div className="mt-3 flex items-center justify-between text-sm text-mist">
        <span>
          {verified} of {FILES.length} copied and verified. Originals untouched.
        </span>
        <button
          type="button"
          onClick={() => {
            setPhases(FILES.map(() => 'waiting'))
            setRun((r) => r + 1)
          }}
          aria-label="Replay copy demo"
          className="grid size-8 shrink-0 place-items-center rounded-full transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          <RotateCcw className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
