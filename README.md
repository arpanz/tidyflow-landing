# TidyFlow Landing Page

Marketing site for [TidyFlow](https://github.com/paavanf/Tidyflow), kept fully separate from the app itself.

Stack: Vite · React · TypeScript · Tailwind CSS 4. No other runtime dependencies: animations are CSS, canvas and
`requestAnimationFrame`, and icons are inline SVG.

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build to dist/
npm run lint     # oxlint
npm run preview  # serve the build locally
```

## Things to fill in

| What | Where |
| --- | --- |
| Download links. Empty ones send people to the GitHub releases page. | `src/config/downloads.ts` |
| Repo, issues and releases links, tagline | `src/config/site.ts` |

The download button detects Windows / macOS and picks `downloads.primary.windows` / `.macos`; anything else gets
"Download TidyFlow" and is sent to the download section.

## Content rules

Everything the page says about TidyFlow should be checkable against the app's repo:

- Copy follows the app's README (How it works, What makes it different, Privacy, Install, Command line) and its
  release notes. If those change, update the page.
- App screens in `src/assets/app/` are the README's `assets/screenshots/`, cropped to the window. The app ships no
  dark Done screen, so `done-dark.webp` is made from the light one.
- File names and counts in the hero card, the features sketches and the card deck are sample data.
- No testimonials, user counts, logos or team details unless they are real.

## Page structure

`src/App.tsx` assembles the sections in `src/components/`:

- `Navbar`: fixed, highlights the current section, light/dark toggle, mobile menu
- `Hero`: the wizard artwork (light and dark), headline, OS-aware download button, review card
- `HowItWorks`: the app's flow (folder, reading, plan, review, done) with its real screens, light or dark to match the page
- `Features`: what makes it different, six cards with small sketches
- `ReviewWays`: card review, search, renaming and plain-English edits, with a small card deck you can click through
- `Privacy`: what stays on the computer and what is sent when an AI key is set
- `Download`: macOS, Windows and run-from-source
- `Faq`, `Footer`

The theme follows the OS until the visitor picks one (`src/lib/theme.ts`). With `prefers-reduced-motion`,
animations stop.

## Brand assets

Copied (not linked) from the TidyFlow repo's `frontend/`:

| File | Source |
| --- | --- |
| `src/assets/brand/logo-original.png` | `frontend/src/assets/logo.png` (kept for reference, not bundled) |
| `src/assets/brand/wizard-white.webp`, `wizard-black.webp` | Derived from the logo: the original sits on an opaque white plate, so these are transparent, trimmed cutouts |
| `public/favicon*`, `apple-touch-icon.png`, `web-app-manifest-*.png`, `site.webmanifest` | `frontend/public/` |

`<WizardLogo />` picks the white or black cutout from the theme. Type and colour live in `src/index.css`:
Instrument Serif for headings, Inter (the app's font) for text, JetBrains Mono for labels, file names and commands.
Light mode flips the shared colour tokens, so components use `text-white`, `bg-night` and friends in both themes.
