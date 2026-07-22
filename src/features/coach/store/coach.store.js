// coach 도메인 상태 store
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCoachStore = defineStore('feature-coach', () => {
  // 담을 상태: coachingMessages
  const coachingMessages = ref([])

  return { coachingMessages }
})
