export const DEBOUNCE_MS = 500
export const MIN_AUTO_GENERATE_NAME_LENGTH = 3
export const POSTER_FILE_EXTENSION = '.png'
export const DEFAULT_POSTER_DOWNLOAD_NAME = `invitation${POSTER_FILE_EXTENSION}`

export function toPosterFileName(teamName: string): string {
  const sanitized = teamName
    .trim()
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, ' ')

  return sanitized ? `${sanitized}${POSTER_FILE_EXTENSION}` : DEFAULT_POSTER_DOWNLOAD_NAME
}
