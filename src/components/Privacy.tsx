import { ArrowRight, Check, Eye, FileText, Folder, ImageIcon, Lock } from './Icons'
import { Accent, Container, Reveal, SectionHeading } from './ui'

// Everything here is from the Privacy section of TidyFlow's README and its release notes.
const LOCAL = [
  { icon: Folder, text: 'Your files, and the Organized copies' },
  { icon: FileText, text: 'Text extraction from PDFs, Office files and code' },
  { icon: ImageIcon, text: 'OCR: Apple Vision on macOS, PaddleOCR on Windows' },
  { icon: Lock, text: 'Settings and keys, readable only by you' },
]

const PROMISES = [
  { title: 'No key, nothing sent', body: 'Without an AI key, TidyFlow sorts by rules and file types and nothing leaves your computer.' },
  { title: 'Secrets are scrubbed', body: 'Passwords, API keys and tokens are removed from the text before it is sent.' },
  { title: 'Some files are never read', body: 'Password exports and account recovery or backup codes are never read, let alone sent.' },
]

export function Privacy() {
  return (
    <section id="privacy" aria-labelledby="privacy-title" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="privacy-title"
          eyebrow={{ n: '05', label: 'Privacy' }}
          title={
            <>
              Your files stay <Accent>on your computer.</Accent>
            </>
          }
          description="If you connect an AI provider, only file names and short text excerpts go to it, to work out where each file belongs."
        />

        <Reveal className="mt-14">
          <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[minmax(0,1.15fr)_auto_minmax(0,1fr)_auto_minmax(0,0.7fr)] lg:gap-5">
            {/* On your computer */}
            <div className="brackets p-2.5">
              <div className="h-full rounded-md border border-white/[0.12] bg-night-raised p-5 sm:p-6">
                <p className="mono-label text-[0.68rem] text-mist-dim">Stays on your computer</p>
                <ul className="mt-4 space-y-3">
                  {LOCAL.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-start gap-3 text-[0.92rem] text-white/90">
                      <span className="grid size-7 shrink-0 place-items-center rounded-[4px] border border-white/[0.12] text-mist">
                        <Icon className="size-3.5" />
                      </span>
                      <span className="pt-1">{text}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-white/[0.08] pt-4 font-mono text-[0.68rem] leading-relaxed text-mist-dim">
                  ~/Library/Application Support/TidyFlow
                  <br />
                  %APPDATA%\TidyFlow
                </p>
              </div>
            </div>

            <Connector />

            {/* What is sent */}
            <div className="flex flex-col justify-center">
              <p className="mono-label mb-3 text-[0.68rem] text-mist-dim">Sent, only if you add a key</p>
              <pre className="overflow-hidden rounded-md border border-dashed border-[var(--h-accent)]/50 bg-night-raised p-4 font-mono text-[0.72rem] leading-[1.8] whitespace-pre-wrap text-mist">
                <span className="text-mist-dim">name </span>
                <span className="text-white">scan_0412.pdf</span>
                {'\n'}
                <span className="text-mist-dim">text </span>
                “Invoice #0412 · Total due $248.00 …”
                {'\n'}
                <span className="text-mist-dim">note </span>
                api_key=<span className="rounded-[2px] bg-[var(--h-accent)]/15 px-1 text-[var(--h-accent)]">[REDACTED]</span>
              </pre>
              <p className="mt-3 flex items-center gap-2 text-[0.8rem] text-mist">
                <Eye className="size-3.5 text-mist-dim" /> Names and short excerpts, never whole files.
              </p>
            </div>

            <Connector />

            {/* Provider */}
            <div className="flex flex-col justify-center rounded-md border border-white/[0.12] p-5">
              <p className="mono-label text-[0.68rem] text-mist-dim">AI provider</p>
              <p className="display mt-2 text-[1.6rem] leading-tight">The one you pick.</p>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-mist">DeepSeek, OpenAI, Gemini, Groq, OpenRouter or any OpenAI-compatible endpoint. Optional.</p>
            </div>
          </div>
        </Reveal>

        <ul className="mt-14 grid grid-cols-1 gap-8 border-t border-white/[0.1] pt-10 sm:grid-cols-3">
          {PROMISES.map((p, i) => (
            <li key={p.title}>
              <Reveal delay={i * 80}>
                <p className="flex items-center gap-2 font-medium text-white">
                  <Check className="size-4 text-[var(--h-accent)]" />
                  {p.title}
                </p>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-pretty text-mist">{p.body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

/** Dashed link between the diagram's boxes: sideways on large screens, downwards on small ones. */
function Connector() {
  return (
    <div aria-hidden="true" className="flex items-center justify-center text-[var(--h-accent)]">
      <span className="h-8 w-px border-l border-dashed border-current lg:hidden" />
      <span className="hidden items-center lg:flex">
        <span className="w-8 border-t border-dashed border-current" />
        <ArrowRight className="size-4" />
      </span>
    </div>
  )
}
