import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from '../../lib/hooks'
import { REDACTED, redactSecrets, secretSegments } from '../../lib/redact'
import { Eye, Lock, RotateCcw } from '../Icons'

// Sample screenshot text. The credentials are fake but shaped to match TidyFlow's real redaction patterns.
const LINES = [
  'Staging deploy notes',
  'region: ap-south-1',
  'OPENAI_API_KEY=sk-EXAMPLE0000demo0000KEY0000',
  'password: "hunter2-staging"',
  'db: https://admin:s3cret@db.example.com',
  'next rotation: 14 Mar 2026',
]

const LINE_MS = 360

export function OcrDemo() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, threshold: 0.45 })
  const [run, setRun] = useState(0)
  const [revealed, setVisible] = useState(0)
  const [chosenView, setView] = useState<'device' | 'model'>('device')
  const [touched, setTouched] = useState(false)
  const visible = reduced ? LINES.length : revealed
  const view = reduced && !touched ? 'model' : chosenView
  const scanning = visible < LINES.length && (inView || run > 0)

  useEffect(() => {
    if (!inView || reduced) return
    const timers = LINES.map((_, i) => window.setTimeout(() => setVisible(i + 1), 300 + i * LINE_MS))
    return () => timers.forEach(window.clearTimeout)
  }, [inView, run, reduced])

  // Once the text is out, show what actually leaves the machine (unless the visitor already chose a view).
  useEffect(() => {
    if (visible < LINES.length || touched || reduced) return
    const t = window.setTimeout(() => setView('model'), 900)
    return () => window.clearTimeout(t)
  }, [visible, touched, reduced])

  const choose = (v: 'device' | 'model') => {
    setTouched(true)
    setView(v)
  }

  const rescan = () => {
    setTouched(false)
    setView('device')
    setVisible(0)
    setRun((r) => r + 1)
  }

  return (
    <div ref={ref} className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      {/* The "screenshot" being read */}
      <div className="relative overflow-hidden rounded-lg border border-white/10 bg-[#141826] p-3.5" aria-hidden="true">
        <p className="mb-3 truncate font-mono text-[0.65rem] text-mist-dim">Screenshot 10.42.png</p>
        <div className="space-y-1.5 font-mono text-[0.7rem] text-white/55 [filter:blur(0.35px)]">
          {LINES.map((line) => (
            <p key={line} className="truncate">
              {secretSegments(line).map((s, i) => (
                <span key={i} className={s.secret ? 'text-app-warn/80' : undefined}>
                  {s.text}
                </span>
              ))}
            </p>
          ))}
        </div>
        {scanning && !reduced && (
          <div key={run} className="scanline pointer-events-none absolute inset-x-0 h-10 -translate-y-1/2" style={{ animationDuration: `${300 + LINES.length * LINE_MS}ms` }}>
            <div className="h-full bg-gradient-to-b from-transparent via-brand-bright/10 to-transparent" />
            <div className="absolute inset-x-0 top-1/2 h-px bg-brand-bright/80" />
          </div>
        )}
        <p className="mt-3 font-mono text-[0.65rem] text-mist-dim">OCR on this machine</p>
      </div>

      {/* Extracted text */}
      <div className="flex min-w-0 flex-col rounded-lg border border-white/[0.07] bg-black/30 p-3.5">
        <div className="flex items-center justify-between gap-2">
          <div role="group" aria-label="Which text to show" className="flex rounded-full border border-white/10 p-0.5 text-[0.7rem]">
            {(
              [
                ['device', 'On your machine', Eye],
                ['model', 'Sent to model', Lock],
              ] as const
            ).map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                aria-pressed={view === id}
                onClick={() => choose(id)}
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 whitespace-nowrap transition-colors ${view === id ? 'bg-white/10 text-white' : 'text-mist hover:text-white'}`}
              >
                <Icon className="size-3" />
                {label}
              </button>
            ))}
          </div>
          <button type="button" onClick={rescan} aria-label="Scan again" className="grid size-7 place-items-center rounded-full text-mist transition-colors hover:bg-white/[0.06] hover:text-white">
            <RotateCcw className="size-3.5" />
          </button>
        </div>

        <div className="mt-3 space-y-1.5 font-mono text-[0.72rem]">
          {LINES.slice(0, visible).map((line) => (
            <p key={line} className="fade-up break-all text-white/85">
              {view === 'device'
                ? secretSegments(line).map((s, i) => (
                    <span key={i} className={s.secret ? 'text-app-warn' : undefined}>
                      {s.text}
                    </span>
                  ))
                : redactSecrets(line)
                    .split(REDACTED)
                    .flatMap((part, i) =>
                      i === 0
                        ? [part]
                        : [
                            <span key={i} className="rounded border border-white/15 px-1 text-mist">
                              {REDACTED}
                            </span>,
                            part,
                          ],
                    )}
            </p>
          ))}
        </div>
        <p className="mt-auto pt-3 text-[0.7rem] text-mist-dim">
          {view === 'device'
            ? 'The full text stays local, where TidyFlow uses it for search and rules.'
            : 'Redacted with TidyFlow’s own patterns before the text is batched to the model you configured.'}
        </p>
      </div>
    </div>
  )
}
