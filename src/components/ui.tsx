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

type SectionHeadingProps = {
  id: string
  title: ReactNode
  description?: ReactNode
  className?: string
}

export function SectionHeading({ id, title, description, className = '' }: SectionHeadingProps) {
  return (
    <Reveal className={`max-w-2xl ${className}`}>
      <h2 id={id} className="display text-[2.4rem] text-balance sm:text-[3.4rem]">
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
}

/** Primary CTA: picks the right build for the visitor's OS (see src/config/downloads.ts). */
export function DownloadButton({ className = '', unknownHref = '#download' }: DownloadButtonProps) {
  const os = useOS()
  const option = os === 'unknown' ? undefined : findDownload(downloads.primary[os])
  const href = option ? downloadHref(option) : unknownHref
  const Icon = os === 'windows' ? Windows : os === 'macos' ? Apple : DownloadIcon

  return (
    <a href={href} className={`btn btn-primary ${className}`}>
      <Icon className="size-4" />
      {OS_LABEL[os]}
    </a>
  )
}

export function Container({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>
}
