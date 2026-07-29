// auth 도메인 UI 상태 store (전역 인증 정보는 @/stores/auth.store 참고)
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi, signup as signupApi } from '@/features/auth/api/auth.api'

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
      return await loginApi(credentials)
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

  return {
    submitLogin,
    resetLoginError,
    loginError,
    signupStep,
    isMydataLoading,
    signupError,
    isSubmittingSignup,
    submitSignup,
  }
})
