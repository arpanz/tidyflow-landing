import { useEffect, useRef } from 'react'
import { downloadHref, downloads, type Platform } from '../config/downloads'
import { site } from '../config/site'
import { clamp, useOS, useReducedMotion } from '../lib/hooks'
import type { OS } from '../lib/os'
import { Container, DownloadButton, Reveal } from './ui'
import { WizardLogo } from './WizardLogo'

const DETECTED: Record<Platform, OS | null> = { windows: 'windows', macos: 'macos', source: null }

export function Download() {
  const os = useOS()
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const wizardRef = useRef<HTMLDivElement>(null)

  // The wizard crosses the moon as the section scrolls past.
  useEffect(() => {
    if (reduced) return
    const section = sectionRef.current!
    const wizard = wizardRef.current!
    let raf = 0
    const update = () => {
      raf = 0
      const r = section.getBoundingClientRect()
      const p = clamp((window.innerHeight - r.top) / (window.innerHeight + r.height))
      wizard.style.transform = `translate3d(${(p - 0.5) * 70}%, ${Math.sin(p * Math.PI) * -10 + 6}%, 0) rotate(${(p - 0.5) * -10}deg)`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [reduced])

  return (
    <section id="download" ref={sectionRef} aria-labelledby="download-title" className="pt-10 pb-24 sm:pb-32">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
          <Reveal>
            <h2 id="download-title" className="display text-[2.4rem] text-balance sm:text-[3.4rem]">
              Bring a little magic to your Downloads folder.
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-mist sm:text-lg">
              TidyFlow is free and open source under the {site.license} license. For AI classification, add your own API key for
              DeepSeek, OpenAI, Groq, Gemini, OpenRouter or any OpenAI-compatible endpoint. Without one, it sorts by rules alone.
            </p>

            <div className="mt-8">
              <DownloadButton className="w-full sm:w-auto" unknownHref="#other-downloads" />
            </div>

            <h3 id="other-downloads" className="mt-12 text-sm font-medium">
              All downloads
            </h3>
            <ul className="mt-3 divide-y divide-white/[0.07] border-y border-white/[0.07]">
              {downloads.options.map((option) => (
                <li key={option.id}>
                  <a href={downloadHref(option)} className="flex items-baseline justify-between gap-4 py-3.5 transition-colors hover:text-brand-bright">
                    <span className="min-w-0">
                      <span className="font-medium">{option.label}</span>
                      {DETECTED[option.platform] === os && <span className="ml-2 text-sm text-mist-dim">detected</span>}
                      {option.detail && <span className="mt-0.5 block text-sm text-mist">{option.detail}</span>}
                    </span>
                    <span aria-hidden="true" className="shrink-0 text-mist-dim">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* The wizard silhouetted against the moon */}
          <div aria-hidden="true" className="relative mx-auto w-full max-w-[20rem] sm:max-w-[24rem]">
            <div className="moon relative aspect-square w-full rounded-full" />
            <div className="absolute inset-0 grid place-items-center overflow-hidden rounded-full">
              <div ref={wizardRef} className="w-[62%] will-change-transform">
                <WizardLogo tone="black" className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
