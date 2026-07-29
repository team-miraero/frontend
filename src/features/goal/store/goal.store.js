// goal 도메인 상태 store
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as goalApi from '@/features/goal/api/goal.api'

export const useGoalStore = defineStore('feature-goal', () => {
  // 기존 온보딩 관련 상태
  const selectedGoalType = ref(null)
  const goalParams = ref(null)
  const feasibilityResult = ref(null)
  const linkedAccountIds = ref([])

  // 여러 대시보드 페이지에서 공통으로 사용하는 로드맵 선택 상태
  const goals = ref([])
  const selectedGoalId = ref(null)
  const goalsError = ref(null)
  const areGoalsLoading = ref(false)
  const selectedGoal = computed(
    () => goals.value.find((goal) => goal.goalId === selectedGoalId.value) ?? null
  )

  // 메인 대시보드 관련 목표 상태
  const currentGoal = ref(null)
  const assets = ref([])
  const availableMoney = ref(null)
  const isLoading = ref(false)

  async function fetchGoals() {
    if (goals.value.length > 0 || areGoalsLoading.value) return

    areGoalsLoading.value = true
    goalsError.value = null

    try {
      goals.value = await goalApi.getGoals()
      if (selectedGoalId.value === null) {
        selectedGoalId.value = goals.value[0]?.goalId ?? null
      }
    } catch (caughtError) {
      goalsError.value = caughtError
    } finally {
      areGoalsLoading.value = false
    }
  }

  function selectGoal(goalId) {
    if (goals.value.some((goal) => goal.goalId === goalId)) {
      selectedGoalId.value = goalId
    }
  }

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
    goals,
    selectedGoalId,
    selectedGoal,
    goalsError,
    areGoalsLoading,
    currentGoal,
    assets,
    availableMoney,
    isLoading,
    fetchGoals,
    selectGoal,
    fetchDashboardData,
    updateCurrentGoalStatus,
  }
})
