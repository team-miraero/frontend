// roadmap 도메인 상태 store
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRoadmapStore = defineStore('feature-roadmap', () => {
  // 담을 상태: roadmap(Roadmap), milestones, currentStage(시작/탄력/가속/결승)
  const roadmap = ref(null)
  const milestones = ref([])
  const currentStage = ref(null)

  return { roadmap, milestones, currentStage }
})
