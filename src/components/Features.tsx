import { useState, type ReactNode } from 'react'
import { ArrowRight, Check, FileText, Folder, RotateCcw } from './Icons'
import { Accent, Container, Reveal, SectionHeading } from './ui'

// "What makes it different", from TidyFlow's README. Each card gets a small sketch of the idea.
const FEATURES: { title: string; body: string; sketch: ReactNode }[] = [
  {
    title: 'It reads the files, not just the names.',
    body: 'Text from PDFs, Office documents, code and spreadsheets, plus on-device OCR for scans and screenshots: Apple Vision on macOS, PaddleOCR on Windows.',
    sketch: <ReadSketch />,
  },
  {
    title: 'The folders come from your files.',
    body: 'The plan is built from what is actually in the folder, not a fixed template. Pick how much detail you want.',
    sketch: <DetailSketch />,
  },
  {
    title: 'Nothing happens until you approve.',
    body: 'Files are copied, not moved, unless you say otherwise. Every copy is checked with SHA-256 and existing files are never overwritten.',
    sketch: <CopySketch />,
  },
  {
    title: 'Undo is real.',
    body: 'Undo checks each file’s hash before removing anything, then cleans up the empty folders it created.',
    sketch: <UndoSketch />,
  },
  {
    title: 'Duplicates are flagged.',
    body: 'Exact copies, and near-identical images such as resized photos or repeat screenshots.',
    sketch: <DuplicateSketch />,
  },
  {
    title: 'It works without AI.',
    body: 'With no API key it sorts by rules and file types. With one, it uses the provider you pick.',
    sketch: <ProviderSketch />,
  },
]

export function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="features-title"
          eyebrow={{ n: '03', label: 'Features' }}
          title={
            <>
              What makes it <Accent>different.</Accent>
            </>
          }
        />

        {/* Hairline grid: the 1px gaps show the line colour behind the cards, like a ruled sheet. */}
        <ul className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-white/[0.12] bg-white/[0.12] sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <li key={f.title} className="bg-night">
              <Reveal delay={(i % 3) * 80} className="flex h-full flex-col p-6 sm:p-8">
                <p className="mono-label flex items-center gap-2 text-[0.68rem] text-mist-dim">
                  <span aria-hidden="true" className="text-[var(--h-accent)]">
                    +
                  </span>
                  03.{i + 1}
                </p>
                <h3 className="display mt-4 text-[1.9rem] leading-[1.02] tracking-[-0.015em] text-balance">{f.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-pretty text-mist">{f.body}</p>
                <div className="mt-auto pt-8">{f.sketch}</div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

/* ─── Sketches ─── */

function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div aria-hidden="true" className={`rounded-md border border-white/[0.1] bg-night-raised p-3.5 font-mono text-[0.7rem] text-mist ${className}`}>
      {children}
    </div>
  )
}

function Chip({ children, tone = 'plain' }: { children: ReactNode; tone?: 'plain' | 'accent' | 'warn' | 'ok' }) {
  const tones = {
    plain: 'border-white/[0.14] text-white/80',
    accent: 'border-[var(--h-accent)]/40 text-[var(--h-accent)]',
    warn: 'border-app-warn/40 bg-app-warn/10 text-app-warn',
    ok: 'border-app-ok/40 bg-app-ok/10 text-app-ok',
  }
  return <span className={`inline-flex items-center gap-1 rounded-[3px] border px-1.5 py-0.5 text-[0.66rem] ${tones[tone]}`}>{children}</span>
}

function ReadSketch() {
  return (
    <Panel>
      <p className="flex items-center gap-2 text-white">
        <FileText className="size-3.5 text-mist-dim" /> scan_0412.pdf
      </p>
      <p className="mt-2 border-l border-white/[0.14] pl-2.5 leading-relaxed text-mist-dim">
        INVOICE #0412 · Due 30 Sep
        <br />
        Total <span className="text-white/80">$248.00</span>
      </p>
      <p className="mt-2.5 flex items-center gap-2">
        <ArrowRight className="size-3 text-mist-dim" />
        <Chip tone="accent">Finance</Chip>
        <span className="text-mist-dim">next to your other invoices</span>
      </p>
    </Panel>
  )
}

const DETAIL = {
  Fewer: ['Documents', 'Photos', 'Work', 'Personal', 'Archives'],
  Balanced: ['Finance', 'Career', 'Academic', 'Personal', 'Design', 'Development', 'Photos', 'Screenshots'],
  Detailed: ['Finance/Invoices', 'Finance/Receipts', 'Career', 'Academic', 'Work/Design', 'Work/Development', 'Work/Notes', 'Photos', 'Screenshots', 'Data'],
} as const
type Level = keyof typeof DETAIL

function DetailSketch() {
  const [level, setLevel] = useState<Level>('Balanced')
  return (
    <div className="rounded-md border border-white/[0.1] bg-night-raised p-3.5">
      <div role="group" aria-label="Detail level (example)" className="inline-flex rounded-[4px] border border-white/[0.12] p-0.5 text-[0.75rem]">
        {(Object.keys(DETAIL) as Level[]).map((l) => (
          <button
            key={l}
            type="button"
            aria-pressed={l === level}
            onClick={() => setLevel(l)}
            className={`rounded-[3px] px-2.5 py-1 transition-colors ${l === level ? 'bg-white text-night' : 'text-mist hover:text-white'}`}
          >
            {l}
          </button>
        ))}
      </div>
      <ul aria-live="polite" className="mt-3 flex min-h-[4.6rem] flex-wrap content-start gap-1.5 font-mono">
        {DETAIL[level].map((name) => (
          <li key={name} className="fade-up">
            <Chip>
              <Folder className="size-3 text-mist-dim" />
              {name}
            </Chip>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CopySketch() {
  return (
    <Panel className="space-y-2">
      <p className="flex flex-wrap items-center gap-2">
        <span className="text-mist-dim">copy</span>
        <span className="text-white">invoice_aug.pdf</span>
        <ArrowRight className="size-3 text-mist-dim" />
        <span className="truncate">Organized/Finance/</span>
      </p>
      <p className="flex items-center gap-2">
        <Chip tone="ok">
          <Check className="size-3" /> sha256 match
        </Chip>
        <span className="text-mist-dim">original left in place</span>
      </p>
      <p className="flex flex-wrap items-center gap-2 border-t border-white/[0.08] pt-2">
        <span className="text-mist-dim">exists</span>
        <span className="text-white">report.pdf</span>
        <ArrowRight className="size-3 text-mist-dim" />
        <span>kept, never overwritten</span>
      </p>
    </Panel>
  )
}

function UndoSketch() {
  return (
    <Panel>
      <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-white/[0.16] px-2.5 py-1 font-sans text-[0.78rem] text-white">
        <RotateCcw className="size-3.5" /> Undo
      </span>
      <ol className="mt-3 space-y-1.5">
        {['hash checked for every copy', 'copies removed', 'empty folders cleaned up'].map((s) => (
          <li key={s} className="flex items-center gap-2">
            <Check className="size-3 text-app-ok" />
            {s}
          </li>
        ))}
      </ol>
    </Panel>
  )
}

function Thumb({ warm = false, small = false }: { warm?: boolean; small?: boolean }) {
  return (
    <span
      className={`relative block shrink-0 overflow-hidden rounded-[4px] border border-white/[0.14] ${small ? 'size-9' : 'size-12'}`}
      style={{ background: warm ? 'linear-gradient(#4a2a73, #ffb27a)' : 'linear-gradient(#24346f, #f4b6c8)' }}
    >
      <span className="absolute top-1.5 right-2 size-2 rounded-full bg-[#fff4d8]" />
      <span className="absolute inset-x-0 bottom-0 h-1/2 bg-[#151b38] [clip-path:polygon(0_100%,0_45%,30%_10%,55%_60%,80%_20%,100%_50%,100%_100%)]" />
    </span>
  )
}

function DuplicateSketch() {
  return (
    <Panel>
      <div className="flex items-center gap-3">
        <Thumb />
        <span className="text-mist-dim">≈</span>
        <Thumb small />
        <span className="text-mist-dim">≈</span>
        <Thumb warm small />
      </div>
      <p className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-white">IMG_2041-small.jpg</span>
        <Chip tone="warn">Near-duplicate</Chip>
      </p>
    </Panel>
  )
}

const PROVIDERS = ['DeepSeek', 'OpenAI', 'Gemini', 'Groq', 'OpenRouter', 'OpenAI-compatible']

function ProviderSketch() {
  return (
    <Panel>
      <p className="flex items-center gap-2">
        <span className="text-mist-dim">no key</span>
        <ArrowRight className="size-3 text-mist-dim" />
        <span className="text-white">rules + file types</span>
      </p>
      <p className="mt-3 text-mist-dim">with a key</p>
      <ul className="mt-1.5 flex flex-wrap gap-1.5">
        {PROVIDERS.map((p) => (
          <li key={p}>
            <Chip>{p}</Chip>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
