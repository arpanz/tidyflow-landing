import type { ImgHTMLAttributes, Ref } from 'react'
import wizardBlack from '../assets/brand/wizard-black.webp'
import wizardWhite from '../assets/brand/wizard-white.webp'
import { WIZARD_HEIGHT, WIZARD_WIDTH } from '../lib/brand'

type WizardLogoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  tone?: 'white' | 'black'
  ref?: Ref<HTMLImageElement>
}

/** The TidyFlow flying-wizard mascot: a transparent cutout of the app's logo.png. Decorative unless `alt` is given. */
export function WizardLogo({ tone = 'white', alt = '', className = '', ...props }: WizardLogoProps) {
  return (
    <img
      src={tone === 'white' ? wizardWhite : wizardBlack}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      width={WIZARD_WIDTH}
      height={WIZARD_HEIGHT}
      draggable={false}
      decoding="async"
      className={`h-auto select-none ${className}`}
      {...props}
    />
  )
}
