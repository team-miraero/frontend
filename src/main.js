// 앱 엔트리포인트: Pinia, Router, (dev)MSW 등록
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import { router } from '@/app/router'
import { enableMockServiceWorker } from '@/app/plugins/msw'
import '@/assets/styles/tailwind.css'
import '@/assets/styles/tokens.css'

async function bootstrap() {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === 'true') {
    await enableMockServiceWorker()
  }

  const app = createApp(App)
  app.use(createPinia())
  app.use(router)
  app.mount('#app')
}

bootstrap()
