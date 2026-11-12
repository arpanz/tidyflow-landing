import { site } from './site'

export type Platform = 'windows' | 'macos'

export type DownloadOption = {
  id: Platform
  label: string
  /** Name of the file attached to each GitHub release. */
  file: string
  install: string
  /** What to do the first time, while the builds aren't notarized/signed. */
  firstRun: string
  /** Direct link to the file. Leave empty to send people to the releases page. */
  url: string
}

// Install notes follow the Install section of TidyFlow's README.
export const downloads = {
  fallbackUrl: site.releasesUrl,

  /** Which option the big button uses for each detected OS. */
  primary: {
    windows: 'windows',
    macos: 'macos',
  },

  options: [
    {
      id: 'macos',
      label: 'macOS',
      file: 'TidyFlow.dmg',
      install: 'Open it and drag TidyFlow into Applications.',
      firstRun: 'The first time, right-click the app and choose Open.',
      url: '',
    },
    {
      id: 'windows',
      label: 'Windows 10/11',
      file: 'TidyFlow-windows.zip',
      install: 'Unzip it and run TidyFlow.exe.',
      firstRun: 'The first time, choose More info → Run anyway.',
      url: '',
    },
  ] satisfies DownloadOption[],
}

export function downloadHref(option: DownloadOption) {
  return option.url || downloads.fallbackUrl
}

export function findDownload(id: string) {
  return downloads.options.find((o) => o.id === id)
}
