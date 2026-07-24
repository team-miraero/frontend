// 요청: JWT 헤더 주입 / 응답: 401 처리 및 에러 정규화
import { useAuthStore } from '@/stores/auth.store'

/**
 * @typedef {Object} NormalizedError
 * @property {number} status
 * @property {string} message
 * @property {unknown} [cause]
 */

/**
 * @param {import('axios').AxiosInstance} instance
 */
export function attachRequestInterceptor(instance) {
  instance.interceptors.request.use((config) => {
    const authStore = useAuthStore()
    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`
    }
    return config
  })
}

/**
 * @param {import('axios').AxiosInstance} instance
 */
export function attachResponseInterceptor(instance) {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        const authStore = useAuthStore()
        authStore.logout()
      }

      /** @type {NormalizedError} */
      const normalized = {
        status: error.response?.status ?? 0,
        message:
          error.response?.data?.message ?? error.message ?? '알 수 없는 오류가 발생했습니다.',
        cause: error,
      }

      return Promise.reject(normalized)
    }
  )
}
