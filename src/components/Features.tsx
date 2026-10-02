import type { ReactNode } from 'react'
import { DuplicateDemo } from './features/DuplicateDemo'
import { LayoutDemo } from './features/LayoutDemo'
import { OcrDemo } from './features/OcrDemo'
import { SafeCopyDemo } from './features/SafeCopyDemo'
import { TriageDemo } from './features/TriageDemo'
import { Container, Reveal, SectionHeading } from './ui'

const FEATURES: { title: string; body: ReactNode; note?: ReactNode; demo: ReactNode }[] = [
  {
    title: 'Organization Architect',
    body: 'Describe the categories you want in plain English and the Architect proposes a folder structure. Ask for changes until it looks right, then approve it to start organizing.',
    note: 'Or start from the built-in 18-folder taxonomy.',
    demo: <LayoutDemo />,
  },
  {
    title: 'Duplicate detection',
    body: 'Byte-identical copies are caught by SHA-256. Photos that were resized, re-encoded or lightly edited are caught by a perceptual hash, within a distance you choose.',
    note: <code>duplicates.hamming_distance_threshold: 8</code>,
    demo: <DuplicateDemo />,
  },
  {
    title: 'OCR, then redaction',
    body: 'TidyFlow reads text from PDFs, Word, Excel and PowerPoint files, and images. OCR runs on your machine: Apple Vision on macOS, PaddleOCR on Windows and Linux. Before any text is sent to the language model, anything that looks like an API key, token, password or private key is replaced with [REDACTED].',
    demo: <OcrDemo />,
  },
  {
    title: 'Quick Triage',
    body: 'Files nothing could place wait in a queue you clear one card at a time. Each card shows the file and the model’s reason; a number key files it, Space skips it.',
    demo: <TriageDemo />,
  },
  {
    title: 'Copy, then verify',
    body: 'Applying a plan copies each file into its new folder and checks the copy’s SHA-256 against the original. If a name is already taken, a short hash is added instead of overwriting anything.',
    demo: <SafeCopyDemo />,
  },
]

export function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          id="features-title"
          title="What it does to a messy folder."
          description="Each of these runs here in your browser on sample files, so you can try it before installing anything."
        />

        <ol className="mt-14">
          {FEATURES.map((f, i) => (
            <li key={f.title} className="border-t border-white/[0.08] py-12 first:border-t-0 first:pt-0 sm:py-16">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
                <Reveal className="lg:pt-2">
                  <p className="font-mono text-xs text-mist-dim">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="display mt-3 text-[2rem] sm:text-[2.4rem]">{f.title}</h3>
                  <p className="mt-4 leading-relaxed text-pretty text-mist">{f.body}</p>
                  {f.note && <p className="mt-4 font-mono text-xs text-mist-dim">{f.note}</p>}
                </Reveal>
                <Reveal delay={100} className="min-w-0">
                  <div className="rounded-xl border border-white/[0.08] bg-night-raised p-4 sm:p-5">{f.demo}</div>
                </Reveal>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
