import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { router } from '@/app/router'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import * as goalApi from '@/features/goal/api/goal.api'

/**
 * 목표 설정 플로우 및 로드맵 상태를 관리하는 스토어
 */
export const useGoalStore = defineStore('feature-goal', () => {
  // 온보딩 및 기본 선택 상태
  const selectedGoalType = ref(null)
  const selectedGoalId = ref(null)
  const goalParams = ref({
    amount: 0,
    period: 0,
    seedMoney: 0,
  })
  const feasibilityResult = ref(null)
  const linkedAccountIds = ref([])

  // 대시보드 및 로드맵 공통 선택 상태
  const goals = ref([])
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

  /**
   * 사용자가 선택한 목표 ID를 설정합니다.
   * @param {string | number | null} id - 목표 ID 또는 프리셋 ID
   */
  function selectGoal(id) {
    selectedGoalId.value = id
  }

  /**
   * 다음 단계(목표 상세 입력 페이지)로 이동합니다.
   */
  function moveToNextStep() {
    if (!selectedGoalId.value) return
    router.push({ name: ROUTE_NAMES.GOAL_DETAIL })
  }

  /**
   * 플로우를 초기 상태로 리셋합니다.
   */
  function resetGoalStore() {
    selectedGoalType.value = null
    selectedGoalId.value = null
    goalParams.value = { amount: 0, period: 0, seedMoney: 0 }
    feasibilityResult.value = null
    linkedAccountIds.value = []
  }

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
    if (currentGoal.value) {
      currentGoal.value.status = result.status
    }
  }

  return {
    selectedGoalType,
    selectedGoalId,
    goalParams,
    feasibilityResult,
    linkedAccountIds,
    goals,
    selectedGoal,
    goalsError,
    areGoalsLoading,
    currentGoal,
    assets,
    availableMoney,
    isLoading,
    selectGoal,
    moveToNextStep,
    resetGoalStore,
    fetchGoals,
    fetchDashboardData,
    updateCurrentGoalStatus,
  }
})
