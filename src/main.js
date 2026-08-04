// 앱 엔트리포인트: Pinia, Router, MSW 등록
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import { router } from '@/app/router'
import { enableMockServiceWorker } from '@/app/plugins/msw'
import { useAuthStore } from '@/stores/auth.store'
import '@/assets/styles/tailwind.css'
import '@/assets/styles/tokens.css'

async function bootstrap() {
  // 프로덕션 빌드(Vercel 등)에서도 이 값이 true면 MSW를 켠다.
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await enableMockServiceWorker()
  }

  const app = createApp(App)
  app.use(createPinia())

  // TODO: 로그인 플로우 완성되면 해당 블록 삭제
  if (import.meta.env.DEV) {
    useAuthStore().login({
      accessToken: 'dev-token',
      user: { id: 'u1', name: '송승윤', email: 'test@example.com' },
    })
  }

  app.use(router)
  app.mount('#app')
}

bootstrap()
