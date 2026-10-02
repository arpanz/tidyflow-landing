import { useEffect, useState, type CSSProperties } from 'react'
import { navLinks } from '../config/site'
import { Close, Menu } from './Icons'
import { WizardLogo } from './WizardLogo'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight the link whose section is under the middle of the viewport (none between linked sections).
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const mid = window.innerHeight * 0.45
      const hit = navLinks.find((l) => {
        const r = document.querySelector(l.href)?.getBoundingClientRect()
        return r && r.top <= mid && r.bottom > mid
      })
      setActive(hit?.href ?? '')
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
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onResize = () => window.innerWidth >= 768 && setOpen(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  // Blurred bar once you scroll; fully opaque while the mobile menu covers the page.
  const bar = open
    ? 'border-white/[0.07] bg-night'
    : scrolled
      ? 'border-white/[0.07] bg-night/80 backdrop-blur-lg'
      : 'border-transparent'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        bar
      }`}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="-m-1 flex items-center gap-2.5 rounded-lg p-1" onClick={() => setOpen(false)}>
          <WizardLogo className="w-9" />
          <span className="text-[1.05rem] font-semibold tracking-tight">TidyFlow</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={active === link.href ? 'location' : undefined}
                className={`relative rounded-full px-3.5 py-2 text-sm transition-colors ${
                  active === link.href ? 'text-white' : 'text-mist hover:text-white'
                }`}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-3.5 bottom-0.5 h-px bg-white/70 transition-opacity duration-300 ${
                    active === link.href ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a href="#download" className="btn btn-primary hidden !h-9 !px-4 text-sm sm:inline-flex">
            Download
          </a>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white transition-colors hover:bg-white/[0.08] md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <Close className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <div id="mobile-menu" hidden={!open} className="border-t border-white/[0.07] md:hidden">
        <ul className="mx-auto flex max-w-6xl flex-col px-4 py-3">
          {navLinks.map((link, i) => (
            <li key={link.href} className="fade-up" style={{ '--delay': `${i * 40}ms` } as CSSProperties}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3.5 text-lg font-medium text-white/90 transition-colors hover:bg-white/[0.05]"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="mt-2 pb-2">
            <a href="#download" onClick={() => setOpen(false)} className="btn btn-primary w-full">
              Download TidyFlow
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
