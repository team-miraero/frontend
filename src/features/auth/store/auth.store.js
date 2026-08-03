// auth 도메인 UI 상태 store (전역 인증 정보는 @/stores/auth.store 참고)
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  login as loginApi,
  signup as signupApi,
  logout as logoutApi,
} from '@/features/auth/api/auth.api'
import { useAuthStore } from '@/stores/auth.store'

export const useAuthFeatureStore = defineStore('feature-auth', () => {
  // 담을 상태: loginError, signupStep, isMydataLoading, signupError, isSubmittingSignup
  const loginError = ref(null)
  const signupStep = ref(1)
  const isMydataLoading = ref(false)
  const signupError = ref(null)
  const isSubmittingSignup = ref(false)

  function resetLoginError() {
    loginError.value = null
  }

  async function submitLogin(credentials) {
    loginError.value = null

    try {
      const response = await loginApi(credentials)
      useAuthStore().login({
        accessToken: response.token.accessToken,
        user: {
          id: String(response.user.userId),
          name: response.user.name,
          email: response.user.email,
        },
      })
      return response
    } catch (error) {
      loginError.value = '이메일 또는 비밀번호가 올바르지 않습니다.'
      throw error
    }
  }

  /**
   * @param {import('@/features/auth/api/auth.api').SignupPayload} payload
   */
  async function submitSignup(payload) {
    isSubmittingSignup.value = true
    signupError.value = null
    try {
      return await signupApi(payload)
    } catch (error) {
      signupError.value = '회원가입에 실패했어요. 잠시 후 다시 시도해 주세요.'
      throw error
    } finally {
      isSubmittingSignup.value = false
    }
  }

  /**
   * 서버에 refresh token 폐기를 요청한 뒤, 서버 요청 성공 여부와 무관하게
   * 이 기기의 로그인 상태(accessToken/user)는 항상 정리한다.
   */
  async function submitLogout() {
    try {
      await logoutApi()
    } catch (error) {
      // 서버 로그아웃이 실패해도 이 기기에서는 로그아웃된 것으로 처리한다.
      console.error('로그아웃 요청 실패:', error)
    } finally {
      useAuthStore().logout()
    }
  }

  return {
    submitLogin,
    resetLoginError,
    loginError,
    signupStep,
    isMydataLoading,
    signupError,
    isSubmittingSignup,
    submitSignup,
    submitLogout,
  }
})
