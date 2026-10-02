import { useEffect, useRef, useState } from 'react'
import { clamp, useReducedMotion } from '../lib/hooks'
import { Container, Reveal, SectionHeading } from './ui'

// Stage names follow the pipeline in TidyFlow's README.
const STEPS = [
  {
    title: 'Scan',
    body: 'TidyFlow walks the folder you point it at, skipping anything your ignore rules exclude. It reads metadata, makes thumbnails and fingerprints every file for duplicate checks.',
    stages: 'scanner → metadata → deduplication',
  },
  {
    title: 'Understand',
    body: 'Text comes out of PDFs, Office files and images, with OCR on your machine. Rules place the obvious files. The rest go to your chosen model in batches of 15 to 40, with credentials redacted.',
    stages: 'text extraction → OCR → heuristic rules → LLM classification',
  },
  {
    title: 'Review',
    body: 'Every proposal lands on the Review & Apply screen with a category, a confidence score and a reason. Change what is wrong, triage what is unclear, select what you want.',
    stages: 'web UI review',
  },
  {
    title: 'Organize',
    body: 'Selected files are copied into the new structure and verified with SHA-256. The originals stay where they were unless you choose to move them.',
    stages: 'safe execution',
  },
]

const COMMANDS = [
  { cmd: 'python3 -m src.cli serve --host 127.0.0.1 --port 8000', what: 'Start the web UI' },
  { cmd: 'python3 -m src.cli run --input-dir <folder> --output-dir <folder>', what: 'Run the whole pipeline' },
  { cmd: 'python3 -m src.cli inventory --input-dir <folder> --output-dir <folder>', what: 'Offline inventory' },
  { cmd: 'python3 -m src.cli apply --decisions <file.csv> --output-dir <folder> --confirm', what: 'Apply saved decisions' },
]

export function HowItWorks() {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLOListElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<(HTMLLIElement | null)[]>([])

  // Which step is crossing the middle of the screen.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index))
      },
      { rootMargin: '-48% 0px -48% 0px' },
    )
    stepRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // The rail fills as you read down the steps.
  useEffect(() => {
    const list = listRef.current!
    const fill = fillRef.current!
    if (reduced) {
      fill.style.transform = 'scaleY(1)'
      return
    }
    let raf = 0
    const update = () => {
      raf = 0
      const r = list.getBoundingClientRect()
      fill.style.transform = `scaleY(${clamp((window.innerHeight * 0.5 - r.top) / r.height)})`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reduced])

  return (
    <section id="how-it-works" aria-labelledby="how-title" className="py-16 sm:py-24">
      <Container className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="how-title"
            title="What happens to a folder."
            description="The same four steps run whether you use the web UI or the command line."
          />
          <Reveal delay={150} className="mt-10">
            <h3 className="text-sm font-medium">From the command line</h3>
            <dl className="mt-3 divide-y divide-white/[0.07] border-y border-white/[0.07]">
              {COMMANDS.map((c) => (
                <div key={c.what} className="py-3">
                  <dt className="text-sm text-mist">{c.what}</dt>
                  <dd className="mt-1 font-mono text-[0.75rem] break-words text-white/85">{c.cmd}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-sm text-mist-dim">
              TidyFlow also ships an MCP server that lets AI assistants list, copy, move and delete files, but only inside folders you
              allow.
            </p>
          </Reveal>
        </div>

        <div className="relative">
          <div aria-hidden="true" className="absolute top-3 bottom-3 left-[0.6875rem] w-px bg-white/[0.1]">
            <div ref={fillRef} className="h-full w-full origin-top bg-white/70" style={{ transform: 'scaleY(0)' }} />
          </div>
          <ol ref={listRef} className="relative space-y-12">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                ref={(el) => {
                  stepRefs.current[i] = el
                }}
                data-index={i}
                className="relative pl-12"
              >
                <span
                  aria-hidden="true"
                  className={`absolute top-1 left-0 grid size-[1.375rem] place-items-center rounded-full border font-mono text-[0.68rem] transition-colors duration-500 ${
                    i <= active ? 'border-white bg-white text-night' : 'border-white/25 bg-night text-mist-dim'
                  }`}
                >
                  {i + 1}
                </span>
                <Reveal>
                  <h3 className="display text-[2rem]">
                    <span className="sr-only">Step {i + 1}: </span>
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-lg leading-relaxed text-mist">{step.body}</p>
                  <p className="mt-3 font-mono text-xs text-mist-dim">{step.stages}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}
