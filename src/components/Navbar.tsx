import { useEffect, useState, type CSSProperties } from 'react'
import { navLinks, site } from '../config/site'
import { setTheme, useTheme } from '../lib/theme'
import { Close, Github, Menu, Moon, Star, Sun } from './Icons'
import { WizardLogo } from './WizardLogo'

function ThemeToggle({ className = '' }: { className?: string }) {
  const theme = useTheme()
  const next = theme === 'light' ? 'dark' : 'light'
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className={`btn-outline size-10 lg:size-11 ${className}`}
    >
      {theme === 'light' ? <Moon className="size-[1.1rem]" /> : <Sun className="size-[1.1rem]" />}
    </button>
  )
}

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

  // Hairline under the bar at the top (part of the hero's frame); glass once you scroll; opaque while the mobile menu is open.
  const bar = open
    ? 'bg-[var(--h-bg)]'
    : scrolled
      ? 'bg-[var(--h-nav-glass)] backdrop-blur-lg'
      : 'bg-transparent'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-[var(--h-line)] text-[var(--h-ink)] transition-[background-color,border-color,backdrop-filter] duration-300 ${bar}`}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-12 xl:px-[4.5rem]">
        <a href="#top" className="-m-1 flex items-center gap-2.5 rounded-lg p-1" onClick={() => setOpen(false)}>
          <WizardLogo className="w-9 lg:w-11" />
          <span className="text-[1.1rem] font-semibold tracking-tight xl:text-[1.6rem]">TidyFlow</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex xl:gap-5">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={active === link.href ? 'location' : undefined}
                className={`relative rounded-md px-3 py-2 text-[0.95rem] whitespace-nowrap transition-colors ${
                  active === link.href ? 'text-[var(--h-ink)]' : 'text-[var(--h-ink-2)] hover:text-[var(--h-ink)]'
                }`}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-3 bottom-0.5 h-px bg-[var(--h-ink)] transition-opacity duration-300 ${
                    active === link.href ? 'opacity-70' : 'opacity-0'
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 lg:gap-3">
          <a href={site.repoUrl} className="btn-outline hidden h-11 px-5 text-[0.95rem] xl:inline-flex">
            <Github className="size-5" />
            GitHub
            <Star className="size-4" />
          </a>
          <ThemeToggle />
          <a href="#download" className="btn-solid hidden h-10 px-5 text-[0.95rem] sm:inline-flex lg:h-11 lg:px-7">
            Download
          </a>
          <button
            type="button"
            className="btn-outline size-10 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <Close className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <div id="mobile-menu" hidden={!open} className="border-t border-[var(--h-line)] md:hidden">
        <ul className="mx-auto flex max-w-6xl flex-col px-4 py-3">
          {navLinks.map((link, i) => (
            <li key={link.href} className="fade-up" style={{ '--delay': `${i * 40}ms` } as CSSProperties}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-3.5 text-lg font-medium text-[var(--h-ink)] transition-colors hover:bg-[var(--h-line)]"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="fade-up" style={{ '--delay': `${navLinks.length * 40}ms` } as CSSProperties}>
            <a
              href={site.repoUrl}
              className="flex items-center gap-2 rounded-md px-3 py-3.5 text-lg font-medium text-[var(--h-ink)] transition-colors hover:bg-[var(--h-line)]"
            >
              <Github className="size-5" />
              GitHub
            </a>
          </li>
          <li className="mt-2 pb-2">
            <a href="#download" onClick={() => setOpen(false)} className="btn-solid h-12 w-full">
              Download TidyFlow
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
