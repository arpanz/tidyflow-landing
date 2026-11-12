import doneDark from '../assets/app/done-dark.webp'
import doneLight from '../assets/app/done-light.webp'
import homeDark from '../assets/app/home-dark.webp'
import homeLight from '../assets/app/home-light.webp'
import planDark from '../assets/app/plan-dark.webp'
import planLight from '../assets/app/plan-light.webp'
import reviewDark from '../assets/app/review-dark.webp'
import reviewLight from '../assets/app/review-light.webp'
import sortingDark from '../assets/app/sorting-dark.webp'
import sortingLight from '../assets/app/sorting-light.webp'
import { useTheme } from '../lib/theme'

// Screenshots from TidyFlow's README (assets/screenshots), cropped to the app window.
// done-dark is made from done-light, since the app repo only ships a light Done screen.
const SHOTS = {
  home: { light: homeLight, dark: homeDark, alt: 'TidyFlow home screen: choose a folder, or pick Downloads, Desktop, Documents, Pictures or Home' },
  sorting: { light: sortingLight, dark: sortingDark, alt: 'TidyFlow reading a Downloads folder: find files, read contents, choose folders, finish' },
  plan: { light: planLight, dark: planDark, alt: 'TidyFlow proposing 12 folders such as Finance, Career, Academic and Photos, with a Fewer, Balanced, Detailed switch' },
  review: { light: reviewLight, dark: reviewDark, alt: 'TidyFlow review screen: 37 files sorted, 8 to review, each with a suggested folder' },
  done: { light: doneLight, dark: doneDark, alt: 'TidyFlow done screen: 39 files organized into 12 folders, with Open folder and Undo buttons' },
} as const

export type ShotName = keyof typeof SHOTS

/** One of the app's own screens, in the page's light or dark theme, in a thin window frame. */
export function AppShot({ name, className = '', eager = false }: { name: ShotName; className?: string; eager?: boolean }) {
  const theme = useTheme()
  const shot = SHOTS[name]
  return (
    <div
      className={`overflow-hidden rounded-[10px] border border-white/[0.14] bg-night-raised shadow-[0_40px_90px_-50px_rgb(0_0_0/0.55)] ${className}`}
    >
      <img
        src={shot[theme]}
        alt={shot.alt}
        width={1600}
        height={1025}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        className="block h-auto w-full select-none"
      />
    </div>
  )
}
