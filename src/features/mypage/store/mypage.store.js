// mypage 도메인 상태 store
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMypageStore = defineStore('feature-mypage', () => {
  // 담을 상태: profile
  const profile = ref(null)

  return { profile }
})
