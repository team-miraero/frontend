import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { router } from '@/app/router'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import * as goalApi from '@/features/goal/api/goal.api'
import { resolveFeasibilityStatus } from '@/features/goal/composables/useFeasibility'

/**
 * 목표 설정 플로우 및 로드맵 상태를 관리하는 스토어
 */
export const useGoalStore = defineStore('feature-goal', () => {
  // 온보딩 및 기본 선택 상태
  const selectedGoalType = ref(null)
  const selectedGoalId = ref(null)
  const goalParams = ref(null)
  const feasibilityResult = ref(null)
  const linkedAccountIds = ref([])

  // 실현가능성(GOAL-03) 상태
  const feasibility = ref(null)
  const isFeasibilityLoading = ref(false)
  const feasibilityError = ref(null)
  const recalculatedFeasibility = ref(null)

  // 계좌·저금통 연결(GOAL-04) 상태
  const accounts = ref([])
  const areAccountsLoading = ref(false)
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
  const monthlyAvailableMoney = ref(null)
  const dailyAvailableMoney = ref(null)
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

  // 사이드바(로드맵 목록)와 대시보드 페이지가 마운트 시점에 동시에 fetchGoals를 호출하는데,
  // areGoalsLoading 플래그만으로 막으면 나중 호출자가 goals가 채워지기도 전에 즉시 반환돼버린다.
  // 진행 중인 요청의 Promise를 공유해서 동시 호출자가 모두 같은 완료 시점을 기다리게 한다.
  let fetchGoalsPromise = null

  async function fetchGoals() {
    if (goals.value.length > 0) return
    if (fetchGoalsPromise) return fetchGoalsPromise

    areGoalsLoading.value = true
    goalsError.value = null

    fetchGoalsPromise = (async () => {
      try {
        goals.value = await goalApi.getGoals()
        if (selectedGoalId.value === null) {
          selectedGoalId.value = goals.value[0]?.goalId ?? null
        }
      } catch (caughtError) {
        goalsError.value = caughtError
      } finally {
        areGoalsLoading.value = false
        fetchGoalsPromise = null
      }
    })()

    return fetchGoalsPromise
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

  // function selectGoal(goalId) {
  //   if (goals.value.some((goal) => goal.goalId === goalId)) {
  //     selectedGoalId.value = goalId
  //   }
  // }

  /**
   * @param {number} goalId
   */
  async function fetchDashboardData(goalId) {
    isLoading.value = true
    try {
      const [goal, goalAssets, monthlyMoney, dailyMoney] = await Promise.all([
        goalApi.getGoalDetail(goalId),
        goalApi.getGoalAssets(goalId),
        goalApi.getMonthlyAvailableMoney(goalId),
        goalApi.getDailyAvailableMoney(goalId),
      ])
      currentGoal.value = goal
      assets.value = goalAssets
      monthlyAvailableMoney.value = monthlyMoney
      dailyAvailableMoney.value = dailyMoney
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
    feasibility,
    isFeasibilityLoading,
    feasibilityError,
    recalculatedFeasibility,
    accounts,
    areAccountsLoading,
    goals,
    selectedGoal,
    goalsError,
    areGoalsLoading,
    currentGoal,
    assets,
    monthlyAvailableMoney,
    dailyAvailableMoney,
    isLoading,
    selectGoal,
    moveToNextStep,
    resetGoalStore,
    fetchGoals,
    fetchDashboardData,
    updateCurrentGoalStatus,
    fetchFeasibility,
    fetchRecalculatedFeasibility,
    fetchAccounts,
    submitGoalCreation,
  }
})
