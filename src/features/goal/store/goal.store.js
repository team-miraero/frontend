import { defineStore } from 'pinia'
import { ref } from 'vue'
import { router } from '@/app/router'
import { ROUTE_NAMES } from '@/shared/constants/routes'

/**
 * 목표 설정 플로우의 상태를 관리하는 스토어
 */
export const useGoalStore = defineStore('feature-goal', () => {
  // --- State ---
  /** @type {import('vue').Ref<string | null>} */
  const selectedGoalId = ref(null)

  /** @type {import('vue').Ref<{amount: number, period: number, seedMoney: number} | null>} */
  const goalParams = ref({
    amount: 0,
    period: 0,
    seedMoney: 0,
  })

  /** @type {import('vue').Ref<any>} */
  const feasibilityResult = ref(null)

  /** @type {import('vue').Ref<string[]>} */
  const linkedAccountIds = ref([])

  // --- Actions ---
  /**
   * 사용자가 선택한 목표 ID를 설정합니다.
   * @param {string} id - 목표 프리셋 ID
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
    selectedGoalId.value = null
    goalParams.value = { amount: 0, period: 0, seedMoney: 0 }
    feasibilityResult.value = null
    linkedAccountIds.value = []
  }

  return {
    selectedGoalId,
    goalParams,
    feasibilityResult,
    linkedAccountIds,
    selectGoal,
    moveToNextStep,
    resetGoalStore,
  }
})
