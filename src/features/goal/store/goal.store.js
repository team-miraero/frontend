// goal 도메인 상태 store
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as goalApi from '@/features/goal/api/goal.api'
import { resolveFeasibilityStatus } from '@/features/goal/composables/useFeasibility'

export const useGoalStore = defineStore('feature-goal', () => {
  // 기존 온보딩 관련 상태
  const selectedGoalType = ref(null)
  const goalParams = ref(null)

  // 실현가능성(GOAL-03) 상태
  const feasibility = ref(null)
  const isFeasibilityLoading = ref(false)
  const feasibilityError = ref(null)
  const recalculatedFeasibility = ref(null)

  // 계좌·저금통 연결(GOAL-04) 상태
  const accounts = ref([])
  const areAccountsLoading = ref(false)

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

  /**
   * @param {import('@/features/goal/api/goal.api').FeasibilityParams} params
   */
  async function fetchFeasibility(params) {
    isFeasibilityLoading.value = true
    feasibilityError.value = null
    try {
      const response = await goalApi.getFeasibility(params)
      feasibility.value = { ...response, ...resolveFeasibilityStatus(response) }
      return feasibility.value
    } catch (caughtError) {
      feasibilityError.value = caughtError
      throw caughtError
    } finally {
      isFeasibilityLoading.value = false
    }
  }

  /**
   * @param {import('@/features/goal/api/goal.api').FeasibilityParams} params
   */
  async function fetchRecalculatedFeasibility(params) {
    const response = await goalApi.getFeasibility(params)
    recalculatedFeasibility.value = { ...response, ...resolveFeasibilityStatus(response) }
    return recalculatedFeasibility.value
  }

  /**
   * @param {'CHECKING' | 'SAVING' | 'DEPOSIT'} [accountType]
   */
  async function fetchAccounts(accountType) {
    areAccountsLoading.value = true
    try {
      const response = await goalApi.getAccounts(accountType ? { accountType } : undefined)
      accounts.value = response.accounts
      return response
    } finally {
      areAccountsLoading.value = false
    }
  }

  /**
   * @typedef {Object} SubmitGoalCreationPayload
   * @property {string} [goalName]
   * @property {'INDEPENDENCE' | 'EMERGENCY' | 'WEDDING' | 'LOAN'} goalType
   * @property {number} goalAmount
   * @property {number} goalMonths
   * @property {number} startAmount
   * @property {import('@/features/goal/api/goal.api').MoneyBoxPayload | null} moneyBox 새 저금통을 만드는 경우에만 전달
   * @property {number[]} existingAccountIds 기존 계좌를 연결하는 경우에만 전달
   */

  /**
   * 저금통 신규 개설 시 개설 API를 먼저 호출해 자산을 만든 뒤, 그 자산을 포함해 목표생성 API를 호출한다.
   * 기존 계좌 연결 시에는 목표생성 API 한 번만 호출한다.
   * @param {SubmitGoalCreationPayload} payload
   * @returns {Promise<{ goalId: number }>}
   */
  async function submitGoalCreation({
    goalName,
    goalType,
    goalAmount,
    goalMonths,
    startAmount,
    moneyBox,
    existingAccountIds,
  }) {
    let assets

    if (moneyBox) {
      const moneyBoxResult = await goalApi.createMoneyBox(moneyBox)
      assets = [{ assetId: moneyBoxResult.moneyBoxId, assetType: 'MONEYBOX' }]
    } else {
      assets = (existingAccountIds ?? []).map((assetId) => ({ assetId, assetType: 'ACCOUNT' }))
    }

    return goalApi.createGoal({ goalName, goalType, goalAmount, goalMonths, startAmount, assets })
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
    feasibility,
    isFeasibilityLoading,
    feasibilityError,
    recalculatedFeasibility,
    accounts,
    areAccountsLoading,
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
    fetchFeasibility,
    fetchRecalculatedFeasibility,
    fetchAccounts,
    submitGoalCreation,
  }
})
