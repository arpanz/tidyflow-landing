import { site } from '../config/site'
import { Github } from './Icons'
import { Container, DownloadButton } from './ui'
import { WizardLogo } from './WizardLogo'

const YEAR = new Date().getFullYear()

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Features', href: '#features' },
      { label: 'Privacy', href: '#privacy' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Download', href: '#download' },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'GitHub', href: site.repoUrl },
      { label: 'Releases', href: site.releasesUrl },
      { label: 'Report an issue', href: site.issuesUrl },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-white/[0.1]">
      <Container>
        {/* Closing line, in the hero's voice */}
        <div className="flex flex-col items-start justify-between gap-8 border-b border-white/[0.1] py-16 lg:flex-row lg:items-end lg:py-20">
          <p className="display text-[3rem] leading-[0.92] tracking-[-0.025em] sm:text-[4.5rem] lg:text-[5.5rem]">
            Your files.
            <br />
            In their place.
            <br />
            <em className="text-[var(--h-accent)] italic">On your terms.</em>
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <DownloadButton variant="solid" iconClassName="size-5" className="h-[3.4rem] px-8 text-[1.02rem]" />
            <a href={site.repoUrl} className="btn-outline h-[3.4rem] px-8 text-[1.02rem]">
              <Github className="size-5" />
              View on GitHub
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <a href="#top" className="inline-flex items-center gap-2.5 rounded-lg">
              <WizardLogo className="w-9" />
              <span className="text-lg font-semibold tracking-tight">TidyFlow</span>
            </a>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-mist">{site.tagline}</p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="mono-label text-[0.68rem] text-mist-dim">{col.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-mist transition-colors hover:text-white">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mono-label flex flex-col-reverse items-start justify-between gap-3 border-t border-white/[0.1] py-6 text-[0.64rem] text-mist-dim sm:flex-row sm:items-center">
          <p>
            © {YEAR} TidyFlow · {site.license} license
          </p>
          <p className="flex gap-6">
            <span>Private · Local first · You decide</span>
            <a href="#top" className="transition-colors hover:text-white">
              Back to top ↑
            </a>
          </p>
        </div>
      </Container>
    </footer>
  )
}
