import { useEffect, useRef, useState } from 'react'
import { AppShot, type ShotName } from './AppShot'
import { Accent, Container, Reveal, SectionHeading } from './ui'

// The app's own flow (Folder → Plan → Review → Done), worded after TidyFlow's README.
const STEPS: { title: string; body: string; shot: ShotName; tag: string }[] = [
  {
    title: 'Pick a folder',
    body: 'Downloads, Desktop or any folder you like. Organized files go to a new Organized folder inside it, unless you choose somewhere else.',
    shot: 'home',
    tag: 'Folder',
  },
  {
    title: 'It reads every file',
    body: 'Contents, not just names, including the text inside scans and screenshots. You see each stage as it happens, with a live count of files placed.',
    shot: 'sorting',
    tag: 'Reading',
  },
  {
    title: 'Agree on a plan',
    body: 'Folders built from your files, not a template. Rename, remove or add any of them, set the detail from Fewer to Detailed, or ask for changes in plain English.',
    shot: 'plan',
    tag: 'Plan',
  },
  {
    title: 'Review',
    body: 'Files it is sure about are already placed. The few it isn’t sure about wait for you, and anything you leave unchecked stays where it is.',
    shot: 'review',
    tag: 'Review',
  },
  {
    title: 'Done, and undoable',
    body: 'Files are copied into Organized and every copy is checked. Your originals are untouched, and one click puts everything back.',
    shot: 'done',
    tag: 'Done',
  },
]

export function HowItWorks() {
  const [active, setActive] = useState(0)
  const stepRefs = useRef<(HTMLLIElement | null)[]>([])

  // The step crossing the middle of the screen picks the screenshot.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index))
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    stepRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="how-it-works" aria-labelledby="how-title" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="how-title"
          eyebrow={{ n: '02', label: 'How it works' }}
          title={
            <>
              From a messy folder to <Accent>an organized one.</Accent>
            </>
          }
          description="The same few steps every time. Nothing on your disk changes until the last one, and that one can be undone."
        />

        <div className="mt-14 grid grid-cols-1 gap-12 lg:mt-20 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.5fr)] lg:gap-16">
          <ol className="relative space-y-14 lg:space-y-0">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                ref={(el) => {
                  stepRefs.current[i] = el
                }}
                data-index={i}
                className="lg:flex lg:min-h-[62vh] lg:items-center"
              >
                <Reveal className="w-full">
                  <div
                    className={`border-l-2 pl-6 transition-colors duration-500 ${
                      i === active ? 'border-[var(--h-accent)]' : 'border-white/[0.12]'
                    }`}
                  >
                    <p className="mono-label flex items-center gap-3 text-[0.7rem] text-mist-dim">
                      <span className={i === active ? 'text-[var(--h-accent)]' : ''}>{String(i + 1).padStart(2, '0')}</span>
                      <span aria-hidden="true">·</span>
                      {step.tag}
                    </p>
                    <h3 className="display mt-3 text-[2.2rem] leading-none tracking-[-0.015em] sm:text-[2.6rem]">
                      <span className="sr-only">Step {i + 1}: </span>
                      {step.title}
                    </h3>
                    <p className="mt-4 max-w-md leading-relaxed text-pretty text-mist">{step.body}</p>
                  </div>
                  {/* Phones and tablets: each step carries its own screen. */}
                  <AppShot name={step.shot} className="mt-7 lg:hidden" />
                </Reveal>
              </li>
            ))}
          </ol>

          {/* Large screens: one window that follows the step you're reading. */}
          <div aria-hidden="true" className="hidden lg:block">
            <div className="sticky top-[calc(50vh-min(18vw,300px))]">
              <div className="brackets relative p-2.5">
                <div className="relative">
                  {STEPS.map((step, i) => (
                    <div
                      key={step.shot}
                      className={`transition-[opacity,translate] duration-700 ease-[var(--ease-soft)] ${
                        i === 0 ? 'relative' : 'absolute inset-0'
                      } ${i === active ? 'opacity-100' : 'pointer-events-none translate-y-2 opacity-0'}`}
                    >
                      <AppShot name={step.shot} eager={i === 0} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mono-label mt-3 flex items-center justify-between px-2.5 text-[0.64rem] text-mist-dim">
                <span>Fig. 02 — TidyFlow, {STEPS[active].tag.toLowerCase()} screen</span>
                <span className="flex gap-1.5">
                  {STEPS.map((s, i) => (
                    <span
                      key={s.tag}
                      className={`h-1 w-5 transition-colors duration-500 ${i === active ? 'bg-[var(--h-accent)]' : 'bg-white/[0.14]'}`}
                    />
                  ))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
