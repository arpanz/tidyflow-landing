import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from '../lib/hooks'
import { ArrowRight, Check, FileText, ImageIcon } from './Icons'
import { Accent, Container, Figure, Reveal, SectionHeading } from './ui'

// Review features from TidyFlow's recent releases.
const WAYS = [
  { title: 'One card at a time', body: 'Swipe through files with sharp previews, and open any file to look at it before you decide.' },
  { title: 'Search as you type', body: 'Find any file in the plan, with filters and full keyboard control.' },
  { title: 'Rename, or skip a whole folder', body: 'Rename files by hand, or rename and skip entire folders right on the review screen.' },
  { title: 'Ask in plain English', body: 'Describe a change and the plan updates. Take every suggestion in one click, and undo it just as fast.' },
]

type Card = { name: string; kind: 'img' | 'doc'; reason: string; folder: string; tint: string }

const CARDS: Card[] = [
  { name: 'IMG_4810.JPG', kind: 'img', reason: 'Camera image, likely a personal photo', folder: 'Photos', tint: 'linear-gradient(160deg,#2b5fd9,#7cc4ff)' },
  { name: 'Event_Registration_Form.pdf', kind: 'doc', reason: 'Registration form for a design week workshop', folder: 'Design', tint: '' },
  { name: 'IMG_4811.JPG', kind: 'img', reason: 'Camera image, likely a personal photo', folder: 'Photos', tint: 'linear-gradient(160deg,#f97316,#fda4af)' },
  { name: 'grocery_list.txt', kind: 'doc', reason: 'Personal grocery shopping list', folder: 'Personal', tint: '' },
]

export function ReviewWays() {
  return (
    <section id="review" aria-labelledby="review-title" className="py-20 sm:py-28">
      <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
        <div>
          <SectionHeading
            id="review-title"
            eyebrow={{ n: '04', label: 'Review' }}
            title={
              <>
                Review it <Accent>your way.</Accent>
              </>
            }
            description="A list when you want to see everything at once, cards when you’d rather go one file at a time."
          />
          <ul className="mt-10 border-t border-white/[0.1]">
            {WAYS.map((w, i) => (
              <li key={w.title} className="border-b border-white/[0.1] py-5">
                <Reveal delay={i * 60} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-2">
                  <span className="mono-label pt-1 text-[0.68rem] text-[var(--h-accent)]">04.{i + 1}</span>
                  <div>
                    <h3 className="font-medium text-white">{w.title}</h3>
                    <p className="mt-1 text-[0.95rem] leading-relaxed text-pretty text-mist">{w.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <Reveal delay={120}>
          <Figure caption="Fig. 04 — card review, sample files">
            <SwipeDeck />
          </Figure>
        </Reveal>
      </Container>
    </section>
  )
}

/** A small stack of review cards. Buttons file or skip the top card; it also deals itself while on screen. */
function SwipeDeck() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref)
  const [top, setTop] = useState(0)
  const [leaving, setLeaving] = useState<null | 'keep' | 'skip'>(null)
  const [paused, setPaused] = useState(false)
  const [filed, setFiled] = useState(0)

  const deal = (how: 'keep' | 'skip') => {
    if (leaving) return
    setLeaving(how)
    window.setTimeout(() => {
      if (how === 'keep') setFiled((n) => n + 1)
      setTop((t) => (t + 1) % CARDS.length)
      setLeaving(null)
    }, reduced ? 0 : 420)
  }

  useEffect(() => {
    if (reduced || !visible || paused) return
    const id = window.setInterval(() => deal('keep'), 3200)
    return () => window.clearInterval(id)
  })

  const card = CARDS[top]

  return (
    <div
      ref={ref}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="rounded-md border border-white/[0.1] bg-night-raised p-4 sm:p-6"
    >
      <div className="mono-label flex items-center justify-between text-[0.66rem] text-mist-dim">
        <span>
          Card {top + 1} of {CARDS.length}
        </span>
        <span aria-live="polite">{filed} filed</span>
      </div>

      <div className="relative mx-auto mt-5 h-[16.5rem] max-w-sm">
        {[2, 1, 0].map((depth) => {
          const c = CARDS[(top + depth) % CARDS.length]
          const isTop = depth === 0
          const out = isTop && leaving
          return (
            <div
              key={`${c.name}-${depth}`}
              aria-hidden={!isTop}
              className="absolute inset-0 rounded-md border border-white/[0.14] bg-night p-4 shadow-[0_24px_50px_-30px_rgb(0_0_0/0.6)] transition-[transform,opacity] duration-[420ms] ease-soft"
              style={{
                transform: out
                  ? `translate(${leaving === 'keep' ? 115 : -115}%, -4%) rotate(${leaving === 'keep' ? 14 : -14}deg)`
                  : `translateY(${depth * 12}px) scale(${1 - depth * 0.045})`,
                opacity: out ? 0 : 1 - depth * 0.28,
                zIndex: 3 - depth,
              }}
            >
              <Preview card={c} />
              <p className="mt-3 truncate font-mono text-[0.78rem] text-white">{c.name}</p>
              <p className="mt-1 truncate text-[0.8rem] text-mist">{c.reason}</p>
              <p className="mt-3 flex items-center gap-2 text-[0.75rem] text-mist-dim">
                Suggested
                <ArrowRight className="size-3" />
                <span className="rounded-[3px] border border-[var(--h-accent)]/40 px-1.5 py-0.5 font-mono text-[0.7rem] text-[var(--h-accent)]">
                  {c.folder}
                </span>
              </p>
            </div>
          )
        })}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button type="button" onClick={() => deal('skip')} className="btn-outline h-11 text-[0.9rem]">
          Skip
        </button>
        <button type="button" onClick={() => deal('keep')} className="btn-solid h-11 text-[0.9rem]">
          <Check className="size-4" />
          Move to {card.folder}
        </button>
      </div>
    </div>
  )
}

function Preview({ card }: { card: Card }) {
  if (card.kind === 'img') {
    return (
      <div className="relative h-36 overflow-hidden rounded-[4px] border border-white/[0.1]" style={{ background: card.tint }}>
        <span className="absolute top-4 right-6 size-6 rounded-full bg-white/70" />
        <span className="absolute inset-x-0 bottom-0 h-1/2 bg-black/25 [clip-path:polygon(0_100%,0_55%,25%_15%,50%_60%,75%_25%,100%_55%,100%_100%)]" />
        <ImageIcon className="absolute bottom-2 left-2 size-4 text-white/80" />
      </div>
    )
  }
  return (
    <div className="flex h-36 flex-col justify-center gap-2 rounded-[4px] border border-white/[0.1] bg-night-raised px-6">
      <FileText className="mb-1 size-5 text-mist-dim" />
      {[90, 70, 82, 55, 66].map((w) => (
        <span key={w} className="h-1 rounded-full bg-white/[0.12]" style={{ width: `${w}%` }} />
      ))}
    </div>
  )
}
