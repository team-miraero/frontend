// roadmap 도메인 상태 store: 마일스톤 목록
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as roadmapApi from '@/features/roadmap/api/roadmap.api'

export const useRoadmapStore = defineStore('feature-roadmap', () => {
  const milestones = ref([])

  const nextMilestone = computed(
    () => milestones.value.find((milestone) => milestone.status === 'IN_PROGRESS') ?? null
  )

  const previousMilestone = computed(() => {
    if (!nextMilestone.value) return null
    const index = milestones.value.findIndex(
      (m) => m.milestoneId === nextMilestone.value.milestoneId
    )
    return index > 0 ? milestones.value[index - 1] : null
  })

  /**
   * @param {number} goalId
   */
  async function fetchMilestones(goalId) {
    milestones.value = await roadmapApi.getMilestones(goalId)
  }

  return { milestones, nextMilestone, previousMilestone, fetchMilestones }
})
