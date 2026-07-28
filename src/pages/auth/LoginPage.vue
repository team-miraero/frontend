<template>
  <div class="p-6">
    <h1 class="text-xl font-bold mb-4">로그인 · AUTH-01</h1>
    <button 
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      @click="handleMockLogin"
    >
      임시 로그인 (테스트용)
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const handleMockLogin = () => {
  authStore.login({
    accessToken: 'mock-token-123',
    user: { id: '1', name: '테스트 유저', email: 'test@example.com' }
  })
  router.push('/goal/select')
}
</script>
