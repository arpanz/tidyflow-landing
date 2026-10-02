import { useState } from 'react'
import { Check } from './Icons'
import { Container, Reveal, SectionHeading } from './ui'
import { WizardLogo } from './WizardLogo'

type CalloutId = 'confidence' | 'rules' | 'dupes' | 'rename' | 'edit' | 'apply'

// Every callout describes something visible in the app's ReviewView (frontend/src/components/ReviewView.tsx).
const CALLOUTS: { id: CalloutId; title: string; body: string }[] = [
  {
    id: 'confidence',
    title: 'A folder and a confidence score',
    body: 'Every file gets a proposed category. Anything under 85% confidence is counted as Needs Review.',
  },
  {
    id: 'rules',
    title: 'Rules first, then the model',
    body: 'Files your keyword and extension rules can place say so. The rest are classified by the language model, which gives a reason.',
  },
  {
    id: 'dupes',
    title: 'Near-duplicates marked',
    body: 'A re-saved or edited copy of a photo is tagged in the table, so you can leave it out.',
  },
  {
    id: 'rename',
    title: 'Suggested renames',
    body: 'When the model suggests a clearer file name, it is shown under the original.',
  },
  {
    id: 'edit',
    title: 'Bulk edits in plain English',
    body: 'Type an instruction like “Move all invoice PDFs to Finance/Invoices” and the AI Edit Assistant updates the table.',
  },
  {
    id: 'apply',
    title: 'Copy unless you say move',
    body: 'Apply copies the files you selected. Moving the originals instead is a separate checkbox.',
  },
]

export function Product() {
  const [active, setActive] = useState<CalloutId>('confidence')

  return (
    <section id="product" aria-labelledby="product-title" className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          id="product-title"
          title="See every decision before it happens."
          description="This is TidyFlow’s Review & Apply screen, rebuilt here with sample files. Pick a line to see where it lives on the screen."
        />

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,290px)_minmax(0,1fr)] lg:gap-12">
          <Reveal>
            <ol className="space-y-1" aria-label="Parts of the Review & Apply screen">
              {CALLOUTS.map((c, i) => {
                const on = c.id === active
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => setActive(c.id)}
                      onMouseEnter={() => setActive(c.id)}
                      onFocus={() => setActive(c.id)}
                      className={`w-full border-l-2 py-2.5 pr-2 pl-4 text-left transition-colors ${
                        on ? 'border-brand-bright' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <span className={`flex items-baseline gap-3 font-medium ${on ? 'text-white' : 'text-mist'}`}>
                        <span className="font-mono text-xs text-mist-dim">{i + 1}</span>
                        {c.title}
                      </span>
                      <span className={`mt-1 pl-6 text-sm leading-relaxed text-mist ${on ? 'block' : 'hidden lg:block'}`}>{c.body}</span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </Reveal>

          <Reveal delay={100} className="min-w-0">
            <ReviewScreen focus={active} />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

/* ─── Recreation of the Review & Apply screen (app's dark theme) ─── */

type Row = {
  name: string
  preview: 'pdf' | 'docx' | 'photo' | 'photo-warm' | 'receipt'
  size: string
  category: string
  confidence: number
  /** Model's reason; rule matches show the app's default text instead. */
  reason?: string
  rename?: string
  nearDup?: boolean
  selected: boolean
}

const ROWS: Row[] = [
  { name: 'invoice_8821.pdf', preview: 'pdf', size: '184 KB', category: 'Finance/Invoices', confidence: 0.97, selected: true },
  { name: 'IMG_2041.HEIC', preview: 'photo', size: '2.4 MB', category: 'Personal/Photos', confidence: 0.99, selected: true },
  { name: 'IMG_2041-edit.jpg', preview: 'photo-warm', size: '1.1 MB', category: 'Personal/Photos', confidence: 0.99, nearDup: true, selected: false },
  {
    name: 'scan_0042.png',
    preview: 'receipt',
    size: '312 KB',
    category: 'Finance/Receipts',
    confidence: 0.91,
    reason: 'Café receipt; OCR text shows a subtotal and a card payment',
    rename: 'cafe-receipt_2026-02.png',
    selected: true,
  },
  {
    name: 'Document (3).docx',
    preview: 'docx',
    size: '48 KB',
    category: 'Work/Documents',
    confidence: 0.62,
    reason: 'Looks like meeting notes, but no project is named',
    rename: 'q3-planning-notes.docx',
    selected: false,
  },
]

const THRESHOLD = 0.85 // classification.auto_copy_threshold in TidyFlow's config.yaml
const COLS = 'grid grid-cols-[1.25rem_minmax(0,1fr)_auto] items-center gap-x-3 md:grid-cols-[1.25rem_minmax(0,1.3fr)_4rem_9.5rem_5.5rem] lg:grid-cols-[1.25rem_minmax(0,1.2fr)_3.75rem_9.5rem_5.25rem_minmax(0,1fr)]'

function ReviewScreen({ focus }: { focus: CalloutId }) {
  return (
    <div
      role="img"
      aria-label="TidyFlow's Review & Apply screen with sample files: summary counts, the AI Edit Assistant, a table of files with proposed categories, confidence scores, reasons, a near-duplicate tag and suggested renames, and the Apply bar with the Move files option unchecked."
      className="mock overflow-hidden rounded-xl border border-app-border bg-app-bg text-white shadow-[0_30px_80px_-40px_rgb(0_0_0/0.9)]"
      data-focus={focus}
    >
      {/* App header */}
      <div className="flex items-center gap-3 border-b border-app-border px-3 py-2.5 sm:px-4">
        <span className="grid size-7 shrink-0 place-items-center overflow-hidden rounded-md bg-white p-0.5">
          <WizardLogo tone="black" className="w-full" />
        </span>
        <div className="leading-tight">
          <p className="text-[13px] font-bold">TidyFlow</p>
          <p className="text-[10px] text-app-muted">Desktop File Organizer</p>
        </div>
        <div className="ml-auto hidden items-center rounded-md border border-app-border bg-app-surface p-0.5 lg:flex">
          {['Organize', 'Categories', 'Review & Apply', 'Search Index', 'Settings'].map((tab) =>
            tab === 'Review & Apply' ? (
              <span key={tab} className="flex items-center gap-1.5 rounded border border-[#383838] bg-[#2c2c2c] px-2.5 py-1 text-[11px] font-semibold">
                {tab}
                <span className="rounded-full bg-app-blue px-1.5 font-mono text-[10px]">214</span>
              </span>
            ) : (
              <span key={tab} className="px-2.5 py-1 text-[11px] text-app-muted">
                {tab}
              </span>
            ),
          )}
        </div>
        <span className="ml-auto flex items-center gap-1.5 rounded-full border border-[#1aae39]/30 bg-[#0c3917]/40 px-2 py-0.5 text-[10px] text-app-ok lg:ml-3">
          <span className="size-1.5 rounded-full bg-app-ok" />
          Connected
        </span>
      </div>

      <div className="space-y-3 p-3 sm:p-4">
        <div>
          <p className="text-[11px] text-app-muted">
            Workspace / <span className="text-white">Review &amp; Apply</span>
          </p>
          <p className="mt-0.5 text-lg font-bold">Review &amp; Apply</p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Metric label="Total Scanned" value="214" />
          <Metric label="Selected to Apply" value="186" tone="text-app-blue" region="apply" />
          <Metric label={`High Confidence (≥${THRESHOLD * 100}%)`} value="171" tone="text-app-ok" region="confidence" />
          <Metric label="Needs Review" value="43" tone="text-app-warn" region="confidence" />
        </div>

        <div data-region="edit" className="rounded-lg border border-app-blue/40 bg-app-surface p-2.5">
          <p className="text-[11px] font-bold">
            AI Edit Assistant
            <span className="ml-2 hidden font-normal text-app-muted sm:inline">
              Ask AI in natural language to adjust categories or rename files in bulk
            </span>
          </p>
          <div className="mt-2 flex gap-2">
            <p className="min-w-0 flex-1 truncate rounded-md border border-[#333] bg-app-bg px-2.5 py-1.5 text-[11px] text-white/85">
              Move all invoice PDFs to Finance/Invoices
            </p>
            <span className="shrink-0 rounded-md bg-app-blue px-2.5 py-1.5 text-[11px] font-semibold">Apply Edit</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-app-border bg-app-surface">
          <div className={`${COLS} border-b border-app-border bg-app-bg px-3 py-2 text-[10px] font-semibold tracking-wide text-app-muted uppercase`}>
            <Box checked />
            <span>File</span>
            <span className="hidden md:block">Size</span>
            <span className="hidden md:block">Category</span>
            <span>Confidence</span>
            <span className="hidden lg:block">Match Summary</span>
          </div>
          <ul className="divide-y divide-app-border">
            {ROWS.map((row) => (
              <ReviewRow key={row.name} row={row} />
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-xl border border-[#333] bg-app-surface px-3 py-2 sm:rounded-full sm:px-4">
          <p className="text-[11px]">
            Ready to organize <strong className="text-app-blue">186</strong> of 214 files
          </p>
          <span data-region="apply" className="flex items-center gap-1.5 p-0.5 text-[11px] text-app-muted">
            <Box /> Move files (Default is safe Copy)
          </span>
          <span data-region="apply" className="rounded-full bg-app-blue px-3 py-1.5 text-[11px] font-semibold">
            Apply &amp; Organize Selected Files
          </span>
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value, tone = 'text-white', region }: { label: string; value: string; tone?: string; region?: CalloutId }) {
  return (
    <div data-region={region ?? 'none'} className="rounded-lg border border-app-border bg-app-surface px-3 py-2">
      <p className={`truncate text-[9.5px] font-semibold tracking-wide uppercase ${region ? tone : 'text-app-muted'}`}>{label}</p>
      <p className={`mt-0.5 text-lg font-bold ${tone}`}>{value}</p>
    </div>
  )
}

function ReviewRow({ row }: { row: Row }) {
  const high = row.confidence >= THRESHOLD
  const summary = (
    <>
      <span data-region="rules" className="truncate px-0.5 text-[11px] text-app-muted">
        {row.reason ?? 'Matched by rule / keyword'}
      </span>
      {row.nearDup && (
        <span data-region="dupes" className="w-fit shrink-0 rounded border border-[#dd5b00]/30 bg-[#4a1c07]/40 px-1.5 font-mono text-[10px] text-app-warn">
          Near-duplicate
        </span>
      )}
    </>
  )
  const category = (
    <span data-region="confidence" className="w-fit truncate rounded-md border border-[#383838] bg-app-raised px-2 py-0.5 font-mono text-[10.5px]">
      {row.category}
    </span>
  )

  return (
    <li className={`${COLS} px-3 py-2.5 ${row.selected ? 'bg-[#0c3966]/20' : ''}`}>
      <span data-region="apply" className="p-0.5">
        <Box checked={row.selected} />
      </span>

      <div className="flex min-w-0 items-center gap-2.5">
        <Preview kind={row.preview} />
        <div className="flex min-w-0 flex-col gap-0.5">
          <span data-region="none" className="truncate font-mono text-[11.5px] font-semibold">
            {row.name}
          </span>
          {row.rename && (
            <span data-region="rename" className="truncate px-0.5 font-mono text-[10.5px] text-app-blue">
              ↳ Rename: {row.rename}
            </span>
          )}
          <span className="md:hidden">{category}</span>
          <span className="flex min-w-0 flex-col gap-1 lg:hidden">{summary}</span>
        </div>
      </div>

      <span data-region="none" className="hidden font-mono text-[11px] text-app-muted md:block">
        {row.size}
      </span>
      <span className="hidden md:block">{category}</span>

      <span data-region="confidence" className="flex items-center gap-1.5 p-0.5">
        <span className="hidden h-1.5 w-8 overflow-hidden rounded-full bg-[#333] sm:block">
          <span className={`block h-full rounded-full ${high ? 'bg-app-ok' : 'bg-app-warn'}`} style={{ width: `${row.confidence * 100}%` }} />
        </span>
        <span
          className={`rounded px-1 font-mono text-[10.5px] font-bold ${high ? 'bg-[#0c3917]/40 text-app-ok' : 'bg-[#4a1c07]/40 text-app-warn'}`}
        >
          {Math.round(row.confidence * 100)}%
        </span>
      </span>

      <span className="hidden min-w-0 flex-col gap-1 lg:flex">{summary}</span>
    </li>
  )
}

function Box({ checked = false }: { checked?: boolean }) {
  return (
    <span
      className={`grid size-3.5 shrink-0 place-items-center rounded-[3px] border ${checked ? 'border-app-blue bg-app-blue' : 'border-[#555]'}`}
    >
      {checked && <Check className="size-2.5 stroke-[3] text-white" />}
    </span>
  )
}

function Preview({ kind }: { kind: Row['preview'] }) {
  if (kind === 'pdf' || kind === 'docx') {
    return (
      <span data-region="none" className="grid size-8 shrink-0 place-items-center rounded-md border border-[#383838] bg-app-raised font-mono text-[8.5px] font-bold text-app-muted uppercase">
        {kind}
      </span>
    )
  }
  if (kind === 'receipt') {
    return (
      <span data-region="none" className="flex size-8 shrink-0 flex-col justify-center gap-[3px] rounded-md border border-[#383838] bg-[#efece4] px-1.5">
        {[80, 55, 70, 40].map((w) => (
          <span key={w} className="h-px bg-black/40" style={{ width: `${w}%` }} />
        ))}
      </span>
    )
  }
  return (
    <span
      data-region="none"
      className="relative size-8 shrink-0 overflow-hidden rounded-md border border-[#383838]"
      style={{ background: kind === 'photo-warm' ? 'linear-gradient(#4a2a73, #ffb27a)' : 'linear-gradient(#24346f, #f4b6c8)' }}
    >
      <span className="absolute top-1 right-1.5 size-2 rounded-full bg-[#fff4d8]" />
      <span className="absolute inset-x-0 bottom-0 h-1/2 bg-[#151b38] [clip-path:polygon(0_100%,0_45%,30%_10%,55%_60%,80%_20%,100%_50%,100%_100%)]" />
    </span>
  )
}
