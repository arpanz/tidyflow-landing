import { useRef } from 'react'
import { useInView } from '../lib/hooks'
import { WizardLogo } from './WizardLogo'

/** A divider the wizard crosses once, the first time it scrolls into view. */
export function WizardFlyby() {
  const ref = useRef<HTMLDivElement>(null)
  const flying = useInView(ref, { once: true, threshold: 1 })

  return (
    <div ref={ref} aria-hidden="true" className={`relative mx-auto h-24 max-w-6xl overflow-hidden px-4 ${flying ? 'is-flying' : ''}`}>
      <div className="absolute inset-x-4 top-1/2 h-px bg-white/[0.08]" />
      <div className="absolute inset-x-4 top-1/2">
        <div className="flyby-trail" />
        <div className="flyby-wizard w-14 sm:w-16">
          <WizardLogo className="w-full" />
        </div>
      </div>
    </div>
  )
}
