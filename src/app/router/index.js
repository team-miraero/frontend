// 라우터 생성 + 인증 네비게이션 가드
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/app/router/routes'
import { useAuthStore } from '@/stores/auth.store'
import { ROUTE_NAMES } from '@/shared/constants/routes'

const PUBLIC_ROUTE_NAMES = new Set([
  ROUTE_NAMES.ONBOARDING,
  ROUTE_NAMES.LOGIN,
  ROUTE_NAMES.SIGNUP,
])

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (!PUBLIC_ROUTE_NAMES.has(to.name) && !authStore.accessToken) {
    return { name: ROUTE_NAMES.LOGIN }
  }

  return true
})
