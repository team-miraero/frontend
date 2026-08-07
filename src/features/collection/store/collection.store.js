// collection 도메인 상태 store
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as collectionApi from '@/features/collection/api/collection.api'

export const useCollectionStore = defineStore('feature-collection', () => {
  const collectionStatus = ref(null)

  /** @type {import('vue').Ref<import('@/features/collection/api/collection.api').AchievedGoal[]>} */
  const achievedGoals = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const hasGoals = computed(
    () => Array.isArray(achievedGoals.value) && achievedGoals.value.length > 0
  )

  async function fetchAchievedGoals() {
    isLoading.value = true
    error.value = null
    try {
      const data = await collectionApi.getAchievedGoals()
      achievedGoals.value = Array.isArray(data) ? data : []
    } catch (caughtError) {
      error.value = caughtError
      achievedGoals.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 테스트/시연용: 빈 상태로 토글하는 함수
   */
  function clearAchievedGoals() {
    achievedGoals.value = []
  }

  return {
    collectionStatus,
    achievedGoals,
    isLoading,
    error,
    hasGoals,
    fetchAchievedGoals,
    clearAchievedGoals,
  }
})
