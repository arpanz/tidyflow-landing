import { site } from './site'

export type Platform = 'windows' | 'macos' | 'source'

export type DownloadOption = {
  id: string
  platform: Platform
  label: string
  /** Shown under the label. Only put facts about the actual build here (format, architecture, size). */
  detail?: string
  /** Direct link to the file. Leave empty until a real build exists; the link then falls back to `fallbackUrl`. */
  url: string
}

/*
 * ─── Replace the empty `url` values with real release links. ───
 * No desktop build is published yet, so empty URLs fall back to the GitHub releases page.
 */
export const downloads = {
  fallbackUrl: `${site.repoUrl}/releases`,

  /** Which option the big button uses for each detected OS. */
  primary: {
    windows: 'windows',
    macos: 'macos',
  },

  options: [
    { id: 'windows', platform: 'windows', label: 'Windows', url: '' },
    { id: 'macos', platform: 'macos', label: 'macOS', url: '' },
    {
      id: 'source',
      platform: 'source',
      label: 'Source code',
      detail: 'Any OS, including Linux · Python 3.10+, Node.js 18+',
      url: site.repoUrl,
    },
  ] satisfies DownloadOption[],
}

export function downloadHref(option: DownloadOption) {
  return option.url || downloads.fallbackUrl
}

export function findDownload(id: string) {
  return downloads.options.find((o) => o.id === id)
}
