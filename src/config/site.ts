const repo = 'https://github.com/DEVJHAWAR11/Tidyflow'

export const site = {
  name: 'TidyFlow',
  tagline: 'Point it at a messy folder. It proposes clean folders and only touches a file after you say so.',
  repoUrl: repo,
  issuesUrl: `${repo}/issues`,
  /** Where every download button goes: the desktop builds are published here. */
  releasesUrl: `${repo}/releases`,
  license: 'MIT',
}

/** Sections in page order; the navbar highlights whichever one is on screen. */
export const navLinks = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#privacy', label: 'Privacy' },
  { href: '#faq', label: 'FAQ' },
] as const
