import { getAppConfig } from '~/utils/config'

function extractErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object') {
    const data = 'data' in error ? error.data : undefined
    if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
      return data.message
    }

    if ('message' in error && typeof error.message === 'string') {
      return error.message
    }

    if ('statusMessage' in error && typeof error.statusMessage === 'string') {
      return error.statusMessage
    }
  }

  return fallback
}

function isAbortError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return true
  }

  return Boolean(
    error
    && typeof error === 'object'
    && 'name' in error
    && error.name === 'AbortError',
  )
}

export function useApiGenerator() {
  const config = getAppConfig()
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const posterUrl = ref<string | null>(null)
  const teamName = ref<string | null>(null)

  let abortController: AbortController | null = null
  let requestId = 0

  const revokePosterUrl = () => {
    if (posterUrl.value) {
      URL.revokeObjectURL(posterUrl.value)
      posterUrl.value = null
    }
    teamName.value = null
  }

  const generatePoster = async (name: string): Promise<void> => {
    const trimmedName = name.trim()

    if (!trimmedName) {
      error.value = config.errorNameRequired
      return
    }

    abortController?.abort()
    abortController = new AbortController()
    const currentRequestId = ++requestId

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<Blob>('/api/generate-poster', {
        method: 'POST',
        body: { name: trimmedName },
        responseType: 'blob',
        signal: abortController.signal,
      })

      if (currentRequestId !== requestId) {
        return
      }

      revokePosterUrl()
      teamName.value = trimmedName
      posterUrl.value = URL.createObjectURL(response)
    } catch (err: unknown) {
      if (isAbortError(err) || currentRequestId !== requestId) {
        return
      }

      error.value = extractErrorMessage(err, config.errorGenerateFailed)
      console.error('Error generating poster:', err)
    } finally {
      if (currentRequestId === requestId) {
        isLoading.value = false
      }
    }
  }

  const cleanup = (): void => {
    abortController?.abort()
    abortController = null
    requestId++
    revokePosterUrl()
    error.value = null
    isLoading.value = false
  }

  return {
    isLoading: readonly(isLoading),
    error: readonly(error),
    posterUrl: readonly(posterUrl),
    teamName: readonly(teamName),
    generatePoster,
    cleanup,
  }
}
