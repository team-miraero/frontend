// auth 도메인 UI 상태 store (전역 인증 정보는 @/stores/auth.store 참고)
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthFeatureStore = defineStore('feature-auth', () => {
  // 담을 상태: loginError, signupStep, isMydataLoading
  const loginError = ref(null)
  const signupStep = ref(1)
  const isMydataLoading = ref(false)

  return { loginError, signupStep, isMydataLoading }
})
