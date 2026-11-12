import { useState } from 'react'
import { downloadHref, downloads } from '../config/downloads'
import { site } from '../config/site'
import { useOS } from '../lib/hooks'
import { Apple, Check, DownloadIcon, Github, Windows } from './Icons'
import { Accent, Container, Reveal, SectionHeading } from './ui'

// "Run from source" in TidyFlow's README.
const SOURCE = `git clone ${site.repoUrl}.git
cd Tidyflow
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
npm --prefix frontend install && npm --prefix frontend run build
python3 desktop.py`

export function Download() {
  const os = useOS()

  return (
    <section id="download" aria-labelledby="download-title" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="download-title"
          eyebrow={{ n: '06', label: 'Download' }}
          title={
            <>
              Bring a little magic to your <Accent>Downloads folder.</Accent>
            </>
          }
          description={`Free and open source under the ${site.license} license. On first launch, open Settings to add an AI key if you want one.`}
        />

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {downloads.options.map((d, i) => {
            const Icon = d.id === 'macos' ? Apple : Windows
            const detected = d.id === os
            return (
              <Reveal key={d.id} delay={i * 80}>
                <div
                  className={`flex h-full flex-col rounded-md border bg-night-raised p-6 sm:p-7 ${
                    detected ? 'border-[var(--h-accent)]/60' : 'border-white/[0.12]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-[5px] border border-white/[0.12]">
                      <Icon className="size-5" />
                    </span>
                    {detected && <span className="mono-label text-[0.64rem] text-[var(--h-accent)]">Your computer</span>}
                  </div>
                  <h3 className="display mt-6 text-[2.2rem] leading-none">{d.label}</h3>
                  <p className="mt-2 font-mono text-[0.78rem] text-mist">{d.file}</p>
                  <ol className="mt-5 space-y-2 text-[0.92rem] leading-relaxed text-mist">
                    <li className="flex gap-2.5">
                      <span className="mono-label pt-0.5 text-[0.66rem] text-mist-dim">1</span>
                      {d.install}
                    </li>
                    <li className="flex gap-2.5">
                      <span className="mono-label pt-0.5 text-[0.66rem] text-mist-dim">2</span>
                      {d.firstRun}
                    </li>
                  </ol>
                  <a href={downloadHref(d)} className={`${detected ? 'btn-solid' : 'btn-outline'} mt-auto h-12 w-full text-[0.95rem]`}>
                    <DownloadIcon className="size-4" />
                    Download for {d.id === 'macos' ? 'macOS' : 'Windows'}
                  </a>
                  <p className="mt-3 text-center text-[0.78rem] text-mist-dim">The builds aren’t notarized yet, hence step 2.</p>
                </div>
              </Reveal>
            )
          })}

          <Reveal delay={160}>
            <SourceCard />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

function SourceCard() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SOURCE)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard blocked: the text is still selectable */
    }
  }

  return (
    <div className="flex h-full flex-col rounded-md border border-white/[0.12] bg-night-raised p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <span className="grid size-11 place-items-center rounded-[5px] border border-white/[0.12]">
          <Github className="size-5" />
        </span>
        <button type="button" onClick={copy} className="mono-label text-[0.64rem] text-mist transition-colors hover:text-white">
          {copied ? (
            <span className="flex items-center gap-1 text-app-ok">
              <Check className="size-3" /> Copied
            </span>
          ) : (
            'Copy'
          )}
        </button>
      </div>
      <h3 className="display mt-6 text-[2.2rem] leading-none">From source</h3>
      <p className="mt-2 font-mono text-[0.78rem] text-mist">Python 3.10+ · Node.js 18+</p>
      <pre className="mt-5 overflow-x-auto rounded-[4px] border border-white/[0.08] bg-night p-3.5 font-mono text-[0.68rem] leading-[1.75] text-white/85">
        {SOURCE}
      </pre>
      <p className="mt-3 mb-6 text-[0.78rem] text-mist-dim">On Windows, activate with venv\Scripts\activate.</p>
      <a href={site.repoUrl} className="btn-outline mt-auto h-12 w-full text-[0.95rem]">
        <Github className="size-4" />
        View on GitHub
      </a>
    </div>
  )
}
