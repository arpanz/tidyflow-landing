import { site } from '../config/site'
import { Container } from './ui'
import { WizardLogo } from './WizardLogo'

const YEAR = new Date().getFullYear()

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Download', href: '#download' },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'GitHub', href: site.repoUrl },
      { label: 'Releases', href: `${site.repoUrl}/releases` },
      { label: 'Report an issue', href: site.issuesUrl },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-white/[0.07] pt-14 pb-10">
      <Container>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <a href="#top" className="inline-flex items-center gap-2.5 rounded-lg">
              <WizardLogo className="w-9" />
              <span className="text-lg font-semibold tracking-tight">TidyFlow</span>
            </a>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-mist">{site.tagline}</p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-sm font-medium">{col.title}</h2>
              <ul className="mt-3 space-y-2">
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

        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-3 border-t border-white/[0.07] pt-6 text-xs text-mist-dim sm:flex-row sm:items-center">
          <p>
            © {YEAR} TidyFlow. Released under the {site.license} License.
          </p>
          <a href="#top" className="transition-colors hover:text-white">
            Back to top
          </a>
        </div>
      </Container>
    </footer>
  )
}
