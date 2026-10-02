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
| Download links. Empty ones fall back to the GitHub releases page. | `src/config/downloads.ts` |
| Repo URL, issues link, tagline | `src/config/site.ts` |

The download button detects Windows / macOS and picks `downloads.primary.windows` / `.macos`; anything else gets
"Download TidyFlow" and is sent to the list of all downloads.

## Content rules

Everything the page says about TidyFlow should be checkable against the app's repo:

- The Review & Apply recreation (`Product.tsx`) and Quick Triage demo copy labels and behaviour from the app's
  `ReviewView.tsx` and `QuickTriageModal.tsx`. If those change, update the page.
- Thresholds come from the app's `config.yaml` (85% confidence, Hamming distance 8).
- CLI commands come from the README. Demo data (file names, counts, confidence values) is sample data and is shown as such.
- No testimonials, user counts, logos or team details unless they are real.

## Page structure

`src/App.tsx` assembles the sections in `src/components/`:

- `Navbar`: sticky, highlights the current section, mobile menu
- `Hero`: headline, OS-aware download button, the wizard with a sparkle trail from the broom
- `Product`: the Review & Apply screen with six callouts that highlight its parts
- `Features`: five working demos in `components/features/` (Organization Architect, duplicates, OCR + redaction, Quick Triage, copy + verify)
- `WizardFlight`: scroll-driven scene where the wizard flies past and scattered files settle into folders
- `HowItWorks`: Scan → Understand → Review → Organize, plus the CLI commands
- `WizardFlyby`: a divider the wizard crosses once
- `Download`, `Footer`

With `prefers-reduced-motion`, animations stop and scroll scenes render their finished state.

## Brand assets

Copied (not linked) from the TidyFlow repo's `frontend/`:

| File | Source |
| --- | --- |
| `src/assets/brand/logo-original.png` | `frontend/src/assets/logo.png` (kept for reference, not bundled) |
| `src/assets/brand/wizard-white.webp`, `wizard-black.webp` | Derived from the logo: the original sits on an opaque white plate, so these are transparent, trimmed cutouts |
| `public/favicon*`, `apple-touch-icon.png`, `web-app-manifest-*.png`, `site.webmanifest` | `frontend/public/` |

Use `<WizardLogo />` (`tone="white"` by default, `"black"` for light backgrounds). `src/lib/brand.ts` holds the
image's intrinsic size and the point where the broom's bristles end, which the sparkle trails start from.

Type and colour live in `src/index.css`: Instrument Serif for headings, Inter (the app's font) for text, JetBrains
Mono for file names and commands. The app's blue (`#0075de`) is the only accent on the page; the `app-*` colours are
TidyFlow's own dark theme, used only inside the recreated app screens.
