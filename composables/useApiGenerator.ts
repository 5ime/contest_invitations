import { getAppConfig } from '~/utils/config';

interface ApiResponse {
  blob: Blob;
  ok: boolean;
  status: number;
}

interface ApiError {
  message: string;
  status?: number;
}

export default function useApiGenerator() {
  const config = getAppConfig();
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const posterUrl = ref<string | null>(null);

  const generatePoster = async (teamName: string): Promise<void> => {
    if (!teamName?.trim()) {
      error.value = config.errorNameRequired;
      return;
    }

    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await $fetch('/api/generate-poster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: teamName.trim() }),
      }) as Blob;

      // 清理之前的URL以防止内存泄漏
      if (posterUrl.value) {
        URL.revokeObjectURL(posterUrl.value);
      }
      
      posterUrl.value = URL.createObjectURL(response);
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || config.errorGenerateFailed;
      error.value = errorMessage;
      console.error('Error generating poster:', err);
    } finally {
      isLoading.value = false;
    }
  };

  // 清理函数
  const cleanup = (): void => {
    if (posterUrl.value) {
      URL.revokeObjectURL(posterUrl.value);
      posterUrl.value = null;
    }
    error.value = null;
  };

  return {
    isLoading: readonly(isLoading),
    error: readonly(error),
    posterUrl: readonly(posterUrl),
    generatePoster,
    cleanup
  };
} 