// goal 도메인 상태 store
import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as goalApi from '@/features/goal/api/goal.api'

export const useGoalStore = defineStore('feature-goal', () => {
  // 기존 온보딩 관련 상태
  const selectedGoalType = ref(null)
  const goalParams = ref(null)
  const feasibilityResult = ref(null)
  const linkedAccountIds = ref([])

  // 메인 대시보드 관련 목표 상태
  const currentGoal = ref(null)
  const assets = ref([])
  const availableMoney = ref(null)
  const isLoading = ref(false)

  /**
   * @param {number} goalId
   */
  async function fetchDashboardData(goalId) {
    isLoading.value = true
    try {
      const [goal, goalAssets, money] = await Promise.all([
        goalApi.getGoalDetail(goalId),
        goalApi.getGoalAssets(goalId),
        goalApi.getAvailableMoney(goalId),
      ])
      currentGoal.value = goal
      assets.value = goalAssets
      availableMoney.value = money
    } finally {
      isLoading.value = false
    }
  }

  /**
   * @param {'ACTIVE' | 'PAUSE'} status
   */
  async function updateCurrentGoalStatus(status) {
    if (!currentGoal.value) return
    const result = await goalApi.updateGoalStatus(currentGoal.value.goalId, status)
    currentGoal.value.vaslue.status = result.status
  }

  return {
    selectedGoalType,
    goalParams,
    feasibilityResult,
    linkedAccountIds,
    currentGoal,
    assets,
    availableMoney,
    isLoading,
    fetchDashboardData,
    updateCurrentGoalStatus,
  }
})
