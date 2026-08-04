// 인증 상태 store: accessToken, user, login/logout
import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * @typedef {Object} AuthUser
 * @property {string} id
 * @property {string} name
 * @property {string} email
 */

const STORAGE_KEY = 'miraero_auth'

// 새로고침·직접 URL 진입에도 로그인 상태가 유지되도록 localStorage에서 복원
function loadPersistedAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const persisted = loadPersistedAuth()

  /** @type {import('vue').Ref<string | null>} */
  const accessToken = ref(persisted?.accessToken ?? null)
  /** @type {import('vue').Ref<AuthUser | null>} */
  const user = ref(persisted?.user ?? null)

  /**
   * @param {{ accessToken: string, user: AuthUser }} payload
   */
  function login(payload) {
    accessToken.value = payload.accessToken
    user.value = payload.user
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }

  function logout() {
    accessToken.value = null
    user.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  /**
   * @param {Partial<AuthUser>} payload
   */
  function updateUser(payload) {
    if (!user.value) return
    user.value = { ...user.value, ...payload }
  }

  return { accessToken, user, login, logout, updateUser }
})
