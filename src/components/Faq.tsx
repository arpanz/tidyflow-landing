import type { ReactNode } from 'react'
import { site } from '../config/site'
import { Accent, Container, Reveal, SectionHeading } from './ui'

// Answers come from TidyFlow's README.
const FAQ: { q: string; a: ReactNode }[] = [
  {
    q: 'Is TidyFlow free?',
    a: `Yes. It’s free and open source under the ${site.license} license. If you want AI sorting, you bring your own key.`,
  },
  {
    q: 'Do I need an AI key?',
    a: 'No. Without one it sorts by rules and file types, and nothing is sent anywhere. With a key it uses the provider you pick: DeepSeek, OpenAI, Gemini, Groq, OpenRouter, or any OpenAI-compatible endpoint.',
  },
  {
    q: 'What does the AI get to see?',
    a: 'Only file names and short text excerpts. Passwords, API keys and tokens are scrubbed before anything leaves, and the files themselves, the OCR and the text extraction stay on your computer.',
  },
  {
    q: 'Will it move or overwrite my files?',
    a: 'By default files are copied into an Organized folder, not moved. Every copy is checked with SHA-256, and existing files are never overwritten.',
  },
  {
    q: 'Can I undo it?',
    a: 'Yes. Undo checks each file’s hash before removing anything, then cleans up the empty folders it created.',
  },
  {
    q: 'Why does my computer warn me the first time I open it?',
    a: 'The builds aren’t notarized yet. On macOS, right-click the app and choose Open. On Windows, choose More info, then Run anyway.',
  },
  {
    q: 'Is there a command line?',
    a: (
      <>
        Yes. The same pipeline runs from the terminal, for example{' '}
        <code className="rounded-[3px] bg-white/[0.07] px-1.5 py-0.5 font-mono text-[0.82em] text-white/90">
          python3 -m src.cli run -i ~/Downloads -o ~/Downloads/Organized
        </code>{' '}
        for a dry run with an HTML report.
      </>
    ),
  },
  {
    q: 'Where are my settings and keys kept?',
    a: (
      <>
        In your user data folder,{' '}
        <code className="font-mono text-[0.85em] text-white/90">~/Library/Application Support/TidyFlow</code> or{' '}
        <code className="font-mono text-[0.85em] text-white/90">%APPDATA%\TidyFlow</code>, readable only by you.
      </>
    ),
  },
]

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="py-20 sm:py-28">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="faq-title"
            eyebrow={{ n: '07', label: 'FAQ' }}
            title={
              <>
                Questions, <Accent>answered.</Accent>
              </>
            }
            description={
              <>
                Something else?{' '}
                <a href={site.issuesUrl} className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
                  Open an issue on GitHub
                </a>
                .
              </>
            }
          />
        </div>

        <Reveal>
          <ul className="border-t border-white/[0.12]">
            {FAQ.map((item, i) => (
              <li key={item.q} className="border-b border-white/[0.12]">
                <details className="group" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-center gap-4 py-5 text-left [&::-webkit-details-marker]:hidden">
                    <span className="mono-label w-8 shrink-0 text-[0.66rem] text-mist-dim">{String(i + 1).padStart(2, '0')}</span>
                    <span className="flex-1 text-[1.05rem] font-medium text-white">{item.q}</span>
                    <span
                      aria-hidden="true"
                      className="grid size-7 shrink-0 place-items-center rounded-[4px] border border-white/[0.14] font-mono text-mist transition-transform duration-300 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <div className="pr-11 pb-6 pl-12 leading-relaxed text-pretty text-mist">{item.a}</div>
                </details>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  )
}
