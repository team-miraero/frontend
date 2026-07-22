// 인증 상태 store: accessToken, user, login/logout
import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * @typedef {Object} AuthUser
 * @property {string} id
 * @property {string} name
 * @property {string} email
 */

export const useAuthStore = defineStore('auth', () => {
  /** @type {import('vue').Ref<string | null>} */
  const accessToken = ref(null)
  /** @type {import('vue').Ref<AuthUser | null>} */
  const user = ref(null)

  /**
   * @param {{ accessToken: string, user: AuthUser }} payload
   */
  function login(payload) {
    accessToken.value = payload.accessToken
    user.value = payload.user
  }

  function logout() {
    accessToken.value = null
    user.value = null
  }

  return { accessToken, user, login, logout }
})
