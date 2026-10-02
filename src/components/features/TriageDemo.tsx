import { useState, type KeyboardEvent } from 'react'

// Mirrors the app's QuickTriageModal: number keys assign a category, Space skips.
const CATEGORIES = ['Finance/Receipts', 'Legal/Contracts', 'Personal/Notes', 'Work/Documents']

type Card = { name: string; path: string; size: string; excerpt: string; reason: string }

const QUEUE: Card[] = [
  {
    name: 'scan_0117.jpg',
    path: '~/Downloads/scan_0117.jpg',
    size: '1.3 MB',
    excerpt: 'MARKET HALL\n2x oat milk   4.80\nbread        3.20\nTOTAL       23.80\nTHANK YOU',
    reason: 'Uncertain context / Low confidence',
  },
  {
    name: 'agreement_v2_FINAL.pdf',
    path: '~/Downloads/agreement_v2_FINAL.pdf',
    size: '220 KB',
    excerpt: 'The parties hereby agree to the terms below.\nThis agreement is governed by the laws of…',
    reason: 'Contract language, but no matching category is active',
  },
  {
    name: 'untitled.txt',
    path: '~/Desktop/untitled.txt',
    size: '2 KB',
    excerpt: 'call landlord about lease renewal\nsign by friday\nask about parking spot',
    reason: 'Short personal note with no clear topic',
  },
  {
    name: 'IMG_0003.PNG',
    path: '~/Desktop/IMG_0003.PNG',
    size: '640 KB',
    excerpt: 'Q3 PLANNING\n• hiring plan\n• budget review\n• launch dates',
    reason: 'Screenshot of a slide; OCR text mentions planning and budget',
  },
]

export function TriageDemo() {
  const [index, setIndex] = useState(0)
  const [log, setLog] = useState<string[]>([])
  const done = index >= QUEUE.length
  const card = QUEUE[index]

  const assign = (category: string) => {
    if (done) return
    setLog((l) => [`${card.name} → ${category}`, ...l])
    setIndex((i) => i + 1)
  }

  const skip = () => {
    if (done) return
    setLog((l) => [`${card.name} left in place`, ...l])
    setIndex((i) => i + 1)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    const n = Number.parseInt(e.key, 10)
    if (n >= 1 && n <= CATEGORIES.length) {
      e.preventDefault()
      assign(CATEGORIES[n - 1])
    } else if (e.key === ' ' || e.key.toLowerCase() === 's') {
      e.preventDefault()
      skip()
    }
  }

  return (
    <div
      tabIndex={0}
      role="group"
      aria-label="Quick Triage demo. Press 1 to 4 to file the current card, Space to skip."
      onKeyDown={onKeyDown}
      className="rounded-lg outline-offset-4"
    >
      <div className="flex items-center justify-between gap-3 text-xs text-mist">
        <span>
          {done ? QUEUE.length : index + 1} of {QUEUE.length}
        </span>
        <span className="hidden font-mono text-mist-dim sm:inline">[1–4] assign · [Space] skip</span>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.07]">
        <div className="h-full bg-brand transition-[width] duration-300" style={{ width: `${(Math.min(index + 1, QUEUE.length) / QUEUE.length) * 100}%` }} />
      </div>

      {done ? (
        <div className="mt-4 rounded-lg border border-dashed border-white/15 px-4 py-8 text-center">
          <p className="font-medium">Triage queue empty</p>
          <p className="mt-1 text-sm text-mist">Every card was filed or left in place.</p>
          <button
            type="button"
            onClick={() => {
              setIndex(0)
              setLog([])
            }}
            className="mt-3 text-sm text-brand-bright hover:underline"
          >
            Start over
          </button>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div key={card.name} className="fade-up flex min-w-0 flex-col rounded-lg border border-white/[0.08] bg-black/30 p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{card.name}</p>
                <p className="truncate font-mono text-[0.68rem] text-mist-dim">{card.path}</p>
              </div>
              <span className="shrink-0 rounded border border-white/10 px-1.5 font-mono text-[0.65rem] text-mist">{card.size}</span>
            </div>
            <pre className="mt-3 flex-1 overflow-hidden rounded-md border border-white/[0.06] bg-black/40 p-2.5 font-mono text-[0.68rem] leading-relaxed whitespace-pre-wrap text-white/75">
              {card.excerpt}
            </pre>
            <p className="mt-2 text-[0.72rem] text-mist">
              <strong className="font-semibold text-white">AI Reason:</strong> {card.reason}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {CATEGORIES.map((c, i) => (
              <button
                key={c}
                type="button"
                onClick={() => assign(c)}
                className="flex items-center justify-between gap-2 rounded-lg border border-white/10 px-3 py-2 text-left font-mono text-[0.75rem] transition-colors hover:border-brand-bright/60 hover:bg-white/[0.03]"
              >
                <span className="truncate">{c}</span>
                <span className="kbd">{i + 1}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={skip}
              className="mt-1 rounded-lg px-3 py-2 text-[0.75rem] text-mist transition-colors hover:bg-white/[0.04] hover:text-white"
            >
              Skip / Leave in Place (Space)
            </button>
          </div>
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {log[0] ?? ''}
      </p>
      {log.length > 0 && (
        <ul className="mt-3 space-y-0.5 font-mono text-[0.68rem] text-mist-dim" aria-hidden="true">
          {log.slice(0, 2).map((entry, i) => (
            <li key={`${entry}-${i}`} className="truncate">
              {entry}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
