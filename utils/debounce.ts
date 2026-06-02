import type { DebounceFunction } from '~/types'

export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number,
  immediate = false,
): DebounceFunction<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined

  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = undefined
      if (!immediate) {
        func(...args)
      }
    }

    const callNow = immediate && !timeout

    if (timeout !== undefined) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(later, wait)

    if (callNow) {
      func(...args)
    }
  }
}
