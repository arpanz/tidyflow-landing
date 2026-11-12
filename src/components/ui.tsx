import { useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'
import { downloadHref, downloads, findDownload } from '../config/downloads'
import { useInView, useOS } from '../lib/hooks'
import type { OS } from '../lib/os'
import { Apple, DownloadIcon, Windows } from './Icons'

type RevealProps = HTMLAttributes<HTMLDivElement> & { delay?: number }

/** Fades and lifts its children in the first time they scroll into view. */
export function Reveal({ delay = 0, className = '', style, children, ...rest }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { once: true, rootMargin: '0px 0px -8% 0px' })
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--delay': `${delay}ms`, ...style } as CSSProperties}
      {...rest}
    >
      {children}
    </div>
  )
}

/** Numbered sheet label, like the hero's badge: "■ 02 · Review & Apply ─────". */
export function Eyebrow({ n, label, className = '' }: { n: string; label: string; className?: string }) {
  return (
    <p className={`mono-label flex items-center gap-3 text-[0.72rem] text-mist ${className}`}>
      <span aria-hidden="true" className="size-2 shrink-0 bg-[var(--h-accent)]" />
      <span className="text-white">{n}</span>
      <span aria-hidden="true">·</span>
      {label}
      <span aria-hidden="true" className="ml-2 h-px max-w-40 flex-1 bg-white/[0.12]" />
    </p>
  )
}

/** The blue italic accent used in headlines ("On your terms."). */
export function Accent({ children }: { children: ReactNode }) {
  return <em className="text-[var(--h-accent)] italic">{children}</em>
}

/** A drafting-style frame: corner brackets around the content and a mono caption under it. */
export function Figure({ caption, className = '', children }: { caption?: string; className?: string; children: ReactNode }) {
  return (
    <figure className={className}>
      <div className="brackets relative p-2 sm:p-2.5">{children}</div>
      {caption && <figcaption className="mono-label mt-2 px-2 text-[0.64rem] text-mist-dim">{caption}</figcaption>}
    </figure>
  )
}

type SectionHeadingProps = {
  id: string
  title: ReactNode
  description?: ReactNode
  eyebrow?: { n: string; label: string }
  className?: string
}

export function SectionHeading({ id, title, description, eyebrow, className = '' }: SectionHeadingProps) {
  return (
    <Reveal className={`max-w-2xl ${className}`}>
      {eyebrow && <Eyebrow {...eyebrow} className="mb-6" />}
      <h2 id={id} className="display text-[2.6rem] leading-[0.98] tracking-[-0.02em] text-balance sm:text-[3.8rem]">
        {title}
      </h2>
      {description && <p className="mt-4 text-base leading-relaxed text-pretty text-mist sm:text-lg">{description}</p>}
    </Reveal>
  )
}

const OS_LABEL: Record<OS, string> = {
  windows: 'Download for Windows',
  macos: 'Download for macOS',
  unknown: 'Download TidyFlow',
}

type DownloadButtonProps = {
  className?: string
  /** Where the button goes when the OS can't be detected. */
  unknownHref?: string
  /** `solid` is the square black/white button used in the hero. */
  variant?: 'primary' | 'solid'
  iconClassName?: string
}

/** Primary CTA: picks the right build for the visitor's OS (see src/config/downloads.ts). */
export function DownloadButton({
  className = '',
  unknownHref = '#download',
  variant = 'primary',
  iconClassName = 'size-4',
}: DownloadButtonProps) {
  const os = useOS()
  const option = os === 'unknown' ? undefined : findDownload(downloads.primary[os])
  const href = option ? downloadHref(option) : unknownHref
  const Icon = os === 'windows' ? Windows : os === 'macos' ? Apple : DownloadIcon

  return (
    <a href={href} className={`${variant === 'solid' ? 'btn-solid' : 'btn btn-primary'} ${className}`}>
      <Icon className={iconClassName} />
      {OS_LABEL[os]}
    </a>
  )
}

export function Container({ className = '', children }: { className?: string; children: ReactNode }) {
  // Same width and gutters as the hero and navbar, so every section lines up with the headline.
  return <div className={`mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-12 xl:px-[4.5rem] ${className}`}>{children}</div>
}
