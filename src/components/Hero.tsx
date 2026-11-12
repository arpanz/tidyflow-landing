import type { CSSProperties } from 'react'
import heroDark from '../assets/hero/hero-dark.webp'
import heroLight from '../assets/hero/hero-light.webp'
import { site } from '../config/site'
import { useTheme } from '../lib/theme'
import { ArrowRight, FileText, Github, ImageIcon } from './Icons'
import { DownloadButton } from './ui'

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties

const PROMISES = ['Local OCR', 'Secrets redacted', 'Safe copy by default']
// The app's own steps: Folder → Plan → Review → Done.
const STEPS = ['Pick a folder', 'Read every file', 'Agree on a plan', 'Review', 'Done, undoable']
const RAIL = ['01', '02', '03']

type Row = {
  file: string
  icon: typeof FileText
  dest: string
  score: number
  status?: 'verified' | 'duplicate'
}

const ROWS: Row[] = [
  { file: 'invoice_aug.pdf', icon: FileText, dest: 'Finance/Invoices', score: 96, status: 'verified' },
  { file: 'IMG_8841.jpg', icon: ImageIcon, dest: 'Photos/Trips', score: 91, status: 'duplicate' },
  { file: 'final_v3.pdf', icon: FileText, dest: 'Needs review', score: 54 },
]

/** A slice of TidyFlow's review list: where each file would go and how sure it is. */
function ReviewCard({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <div
      className={`rounded-md border border-[var(--h-card-border)] bg-[var(--h-card-bg)] px-4 py-2 shadow-[0_20px_60px_-24px_rgb(0_0_0/0.45)] backdrop-blur-md sm:px-5 ${className}`}
      style={style}
    >
      <p className="sr-only">Example of TidyFlow's suggestions:</p>
      <ul className="divide-y divide-[var(--h-line)] font-mono text-[0.7rem] sm:text-[0.74rem]">
        {ROWS.map((r) => {
          const Icon = r.icon
          const sure = r.score >= 80
          return (
            <li
              key={r.file}
              className="grid grid-cols-[1.25rem_minmax(0,1fr)_2.4rem_4.75rem] items-center gap-x-3 py-3 sm:grid-cols-[1.25rem_minmax(0,1fr)_0.9rem_minmax(0,1fr)_2.4rem_4.75rem]"
            >
              <Icon className="size-5 text-[var(--h-ink-2)]" />
              {/* Phones: file over destination. Wider: one line, file → destination. */}
              <span className="flex min-w-0 flex-col gap-1 sm:contents">
                <span className="truncate text-[var(--h-ink)]">{r.file}</span>
                <ArrowRight className="hidden size-3.5 text-[var(--h-muted)] sm:block" />
                <span className="truncate text-[var(--h-ink-2)] sm:text-[var(--h-ink)]">
                  <span aria-hidden="true" className="text-[var(--h-muted)] sm:hidden">
                    →{' '}
                  </span>
                  {r.dest}
                </span>
              </span>
              <span className={`font-medium ${sure ? 'text-[var(--h-ok)]' : 'text-[var(--h-warn)]'}`}>
                {r.score}%<span className="sr-only"> confidence</span>
              </span>
              <span className="flex items-center justify-end gap-2">
                {r.status === 'verified' && (
                  <>
                    <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-[var(--h-ok)]" />
                    <span className="rounded-[3px] border border-[var(--h-chip-ok-border)] bg-[var(--h-chip-ok-bg)] px-1.5 py-0.5 text-[0.66rem] text-[var(--h-chip-ok)]">
                      Verified
                    </span>
                  </>
                )}
                {r.status === 'duplicate' && (
                  <span className="rounded-[3px] border border-[var(--h-chip-border)] px-1.5 py-0.5 text-[0.66rem] text-[var(--h-chip)]">
                    Duplicate
                  </span>
                )}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** Stacked sheets: the small "layers" mark beside the pipeline steps. */
function Layers({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 110" fill="none" stroke="currentColor" strokeWidth="0.8" aria-hidden="true" className={className}>
      {[0, 12, 24, 36].map((y) => (
        <path key={y} d={`M70 ${8 + y} 130 ${34 + y} 70 ${60 + y} 10 ${34 + y}Z`} opacity={1 - y / 60} />
      ))}
      <path d="M40 21 100 47M100 21 40 47" opacity="0.35" />
    </svg>
  )
}

export function Hero() {
  const theme = useTheme()

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="hero relative isolate flex flex-col overflow-hidden pt-24 sm:pt-28 lg:min-h-[max(720px,min(100svh,62.6vw))] lg:justify-center lg:pt-28 lg:pb-14"
    >
      {/* Artwork: full-bleed behind the copy on large screens, a picture under it on small ones. */}
      <div aria-hidden="true" className="hero-stage relative mt-10 aspect-[1.05] sm:aspect-[1.35] lg:absolute lg:inset-0 lg:mt-0 lg:aspect-auto order-2">
        <div className="hero-art hero-art-enter origin-bottom-right">
          <img
            src={theme === 'light' ? heroLight : heroDark}
            alt=""
            width={1585}
            height={992}
            fetchPriority="high"
            decoding="async"
            draggable={false}
            className="select-none"
          />

          <div
            className="brackets mono-label fade-up absolute left-[66.8%] hidden px-5 py-3.5 text-[0.68rem] leading-[1.75] text-[var(--h-ink-2)] lg:block"
            style={{ top: 'max(12%, calc(var(--art-h) - 100cqh + 7rem))', ...delay(900) }}
          >
            A messy folder
            <br />
            Hundreds of files
            <br />
            Duplicates
            <br />
            No structure
          </div>

          <ReviewCard
            className="fade-up absolute right-[3%] z-[2] hidden w-[clamp(400px,34.5%,600px)] lg:block"
            style={{ top: '77.4%', ...delay(1100) }}
          />
        </div>

        <div className="hero-scrim absolute inset-0 hidden lg:block" />
        <div className="hero-fade absolute inset-x-0 bottom-0 z-[1] h-16" />
      </div>

      {/* Drafting-table frame: numbered rail on the left, the three promises down the right. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-14 border-r border-[var(--h-line)] xl:block">
        <ul className="absolute top-36 right-0 space-y-6 font-mono text-[0.7rem] text-[var(--h-muted)]">
          {RAIL.map((n, i) => (
            <li key={n} className={`flex items-center gap-2 ${i === 2 ? 'mt-[42vh]' : ''}`}>
              {n}
              <span className="h-px w-2 bg-[var(--h-line-strong)]" />
            </li>
          ))}
        </ul>
      </div>
      <div
        aria-hidden="true"
        className="mono-label pointer-events-none absolute top-36 right-4 z-10 hidden flex-col items-center gap-3 text-[0.72rem] text-[var(--h-ink-2)] xl:flex"
      >
        <span className="size-2 bg-[var(--h-accent)]" />
        <span className="[writing-mode:vertical-rl]">Private &nbsp;·&nbsp; Local first &nbsp;·&nbsp; You decide</span>
        <span className="size-2 bg-[var(--h-accent)]" />
      </div>

      <div className="relative z-10 order-1 mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-12 xl:px-[4.5rem]">
        <div className="max-w-xl lg:max-w-[min(40rem,44vw)]">
          <p
            className="mono-label fade-up inline-flex items-center gap-3 rounded-[3px] border border-[var(--h-line-strong)] bg-[color-mix(in_srgb,var(--h-bg)_70%,transparent)] px-3 py-1.5 text-[0.72rem] text-[var(--h-ink-2)]"
            style={delay(50)}
          >
            <span aria-hidden="true" className="size-2 bg-[var(--h-accent)]" />
            Free &amp; open source · {site.license}
          </p>

          <h1
            id="hero-title"
            className="display hero-title fade-up mt-7 text-[3.5rem] leading-[0.92] tracking-[-0.025em] sm:text-[5rem] lg:mt-9 lg:text-[clamp(4.75rem,6.7vw,7rem)]"
            style={delay(150)}
          >
            Your files.
            <br />
            In their place.
            <br />
            <em className="text-[var(--h-accent)] italic">On your terms.</em>
          </h1>

          <p
            className="fade-up mt-7 max-w-[30rem] text-[1.0625rem] leading-relaxed text-pretty text-[var(--h-ink-2)] sm:text-[1.2rem]"
            style={delay(300)}
          >
            TidyFlow reads your documents and images, flags duplicates, and proposes a folder for every file. You review. Then it
            organizes.
          </p>

          <div className="fade-up mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4" style={delay(420)}>
            <DownloadButton variant="solid" iconClassName="size-5" className="h-[3.4rem] px-8 text-[1.02rem]" />
            <a href={site.repoUrl} className="btn-outline h-[3.4rem] px-8 text-[1.02rem]">
              <Github className="size-5" />
              View on GitHub
            </a>
          </div>

          <ul
            className="mono-label fade-up mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.72rem] text-[var(--h-ink-2)] sm:text-[0.78rem]"
            style={delay(520)}
          >
            {PROMISES.map((p, i) => (
              <li key={p} className="flex items-center gap-4">
                {i > 0 && <span aria-hidden="true">·</span>}
                {p}
              </li>
            ))}
          </ul>

          {/* Only on tall screens: elsewhere it would push the hero past the fold and the art under the copy. */}
          <div className="fade-up mt-14 hidden items-center gap-8 [@media(min-width:64rem)_and_(min-height:900px)]:flex" style={delay(640)}>
            <ol className="mono-label space-y-1.5 text-[0.68rem] text-[var(--h-muted)]" aria-label="How TidyFlow works">
              {STEPS.map((s) => (
                <li key={s} className="flex items-center gap-3">
                  <span aria-hidden="true" className="text-[var(--h-line-strong)]">
                    +
                  </span>
                  {s}
                </li>
              ))}
            </ol>
            <Layers className="w-32 text-[var(--h-muted)]" />
          </div>
        </div>
      </div>

      <div className="relative z-10 order-3 px-4 pb-16 sm:px-6 lg:hidden">
        <ReviewCard className="mx-auto -mt-6 max-w-xl" />
      </div>
    </section>
  )
}
