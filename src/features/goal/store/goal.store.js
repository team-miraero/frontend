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
  // 온보딩 중 고른 목표 프리셋('INDEPENDENCE' 등 문자열). 실제 생성된 로드맵의 goalId와는 별개.
  const selectedGoalPresetId = ref(null)
  // 대시보드/지출관리/KB상품 등에서 쓰는 "적용 대상" 로드맵의 실제 숫자 goalId.
  const selectedGoalId = ref(null)
  const goalParams = ref(null)
  const feasibilityResult = ref(null)
  const linkedAccountIds = ref([])

  // 실현가능성(GOAL-03) 상태
  const feasibility = ref(null)
  const isFeasibilityLoading = ref(false)
  const feasibilityError = ref(null)
  const recalculatedFeasibility = ref(null)
  // 계좌 연결 페이지에서 돌아왔을 때 사용자가 조정하던 계획을 그대로 복원하기 위한 초안
  const feasibilityAdjustment = ref(null)

  // 계좌·저금통 연결(GOAL-04) 상태
  const accounts = ref([])
  const areAccountsLoading = ref(false)
  const accountsError = ref(null)

  // 대시보드 및 로드맵 공통 선택 상태
  const goals = ref([])
  const goalsError = ref(null)
  const areGoalsLoading = ref(false)

  const selectedGoal = computed(
    () => goals.value.find((goal) => String(goal.goalId) === String(selectedGoalId.value)) ?? null
  )

  // 메인 대시보드 관련 목표 상태
  const currentGoal = ref(null)
  const assets = ref([])
  const monthlyAvailableMoney = ref(null)
  const dailyAvailableMoney = ref(null)
  const isLoading = ref(false)
  const dashboardError = ref(null)
  const dashboardSupplementaryErrors = ref({})
  const isSupplementaryLoading = ref(false)
  let dashboardRequestId = 0

  /**
   * 사용자가 선택한 목표 ID를 설정합니다.
   * @param {string | number | null} id - 목표 ID 또는 프리셋 ID
   */
  function selectGoal(id) {
    selectedGoalId.value = id
  }

  /**
   * 온보딩 중 선택한 목표 프리셋 ID를 설정합니다.
   * @param {string | null} id - GOAL_PRESET_IDS 값 또는 null
   */
  function selectGoalPreset(id) {
    if (selectedGoalPresetId.value !== id) {
      goalParams.value = null
      feasibility.value = null
      recalculatedFeasibility.value = null
      feasibilityAdjustment.value = null
    }
    selectedGoalPresetId.value = id
  }

  /**
   * 다음 단계(목표 상세 입력 페이지)로 이동합니다.
   */
  function moveToNextStep() {
    if (!selectedGoalPresetId.value) return
    router.push({ name: ROUTE_NAMES.GOAL_DETAIL })
  }

  /**
   * 플로우를 초기 상태로 리셋합니다.
   */
  function resetGoalStore() {
    selectedGoalType.value = null
    selectedGoalPresetId.value = null
    goalParams.value = { amount: 0, period: 0, seedMoney: 0 }
    feasibilityResult.value = null
    feasibilityAdjustment.value = null
    linkedAccountIds.value = []
  }

  // 사이드바(로드맵 목록)와 대시보드 페이지가 마운트 시점에 동시에 fetchGoals를 호출하는데
  // 진행 중인 요청의 Promise를 공유해서 동시 호출자가 모두 같은 완료 시점을 기다리게 한다.
  let fetchGoalsPromise = null

  /**
   * @param {boolean} [force=false]
   */
  async function fetchGoals(force = false) {
    if (goals.value.length > 0 && !force) return
    if (fetchGoalsPromise && !force) return fetchGoalsPromise

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
    feasibility.value = null
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
    accountsError.value = null
    try {
      const response = await goalApi.getAccounts(accountType ? { accountType } : undefined)
      accounts.value = response.accounts
      return response
    } catch (caughtError) {
      accountsError.value = caughtError
      throw caughtError
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
    let assets = []

    if (moneyBox) {
      const moneyBoxResult = await goalApi.createMoneyBox(moneyBox)
      assets.push({ assetId: moneyBoxResult.moneyBoxId, assetType: 'MONEY_BOX' })
    }

    if (existingAccountIds && existingAccountIds.length > 0) {
      existingAccountIds.forEach((assetId) => {
        assets.push({ assetId, assetType: 'ACCOUNT' })
      })
    }

    if (goalType === 'LOAN') {
      assets.push({ assetId: 1, assetType: 'LOAN' })
    }

    const newGoalResult = await goalApi.createGoal({
      goalName,
      goalType,
      goalAmount,
      goalMonths,
      startAmount,
      assets,
    })
    const createdGoalId = newGoalResult?.goalId ?? 1
    selectedGoalId.value = createdGoalId

    // 신규 목표를 local goals 목록에도 추가해 로드맵 셀렉터/사이드바에 즉시 노출되도록 함
    const newGoalItem = {
      goalId: createdGoalId,
      goalName: goalName || (goalType === 'LOAN' ? '학자금 대출 상환' : '새로운 목표'),
      goalType: goalType || 'INDEPENDENCE',
      progressRate: 0.0,
      status: 'ACTIVE',
    }

    if (!goals.value.some((g) => String(g.goalId) === String(createdGoalId))) {
      goals.value = [newGoalItem, ...goals.value]
    }

    return { goalId: createdGoalId }
  }

  /**
   * 대시보드 부가 정보(자산·여유자금)만 조회한다.
   * 목표 상세와 달리 셋 중 하나가 실패해도 나머지는 채우고, 실패한 항목만 에러로 남긴다.
   * 목표 상세(currentGoal)는 건드리지 않으므로 화면을 비우지 않고 제자리에서 다시 채울 수 있다.
   * @param {number} goalId
   * @param {number} [requestId] fetchDashboardData가 넘긴 요청 식별자 (단독 호출 시 현재 값 사용)
   */
  async function fetchSupplementaryDashboardData(goalId, requestId = dashboardRequestId) {
    isSupplementaryLoading.value = true

    try {
      const [assetsResult, monthlyResult, dailyResult] = await Promise.allSettled([
        goalApi.getGoalAssets(goalId),
        goalApi.getMonthlyAvailableMoney(goalId),
        goalApi.getDailyAvailableMoney(goalId),
      ])
      if (requestId !== dashboardRequestId) return

      const supplementaryErrors = {}

      if (assetsResult.status === 'fulfilled') assets.value = assetsResult.value
      else supplementaryErrors.assets = assetsResult.reason

      if (monthlyResult.status === 'fulfilled') monthlyAvailableMoney.value = monthlyResult.value
      else supplementaryErrors.monthlyAvailableMoney = monthlyResult.reason

      if (dailyResult.status === 'fulfilled') dailyAvailableMoney.value = dailyResult.value
      else supplementaryErrors.dailyAvailableMoney = dailyResult.reason

      dashboardSupplementaryErrors.value = supplementaryErrors
    } finally {
      if (requestId === dashboardRequestId) isSupplementaryLoading.value = false
    }
  }

  /**
   * @param {number} goalId
   */
  async function fetchDashboardData(goalId) {
    const requestId = ++dashboardRequestId
    isLoading.value = true
    dashboardError.value = null
    dashboardSupplementaryErrors.value = {}
    currentGoal.value = null
    assets.value = []
    monthlyAvailableMoney.value = null
    dailyAvailableMoney.value = null

    try {
      const goal = await goalApi.getGoalDetail(goalId)
      if (requestId !== dashboardRequestId) return null

      currentGoal.value = goal
      isLoading.value = false

      // 목표 상세가 도착하면 대시보드를 먼저 노출하고 부가 정보는 뒤에서 채운다.
      // 부가 API 하나가 느리거나 실패해도 대시보드 본문 렌더링을 막지 않는다.
      fetchSupplementaryDashboardData(goalId, requestId)

      return goal
    } catch (caughtError) {
      if (requestId !== dashboardRequestId) return null

      dashboardError.value = caughtError
      throw caughtError
    } finally {
      if (requestId === dashboardRequestId) isLoading.value = false
    }
  }

  /**
   * @param {number} goalId
   * @param {import('@/features/goal/api/goal.api').UpdateGoalPayload} payload
   */
  async function updateGoal(goalId, payload) {
    const result = await goalApi.updateGoal(goalId, payload)
    const targetGoal = goals.value.find((g) => String(g.goalId) === String(goalId))
    if (targetGoal) {
      if (payload.status) targetGoal.status = payload.status
    }
    if (currentGoal.value && String(currentGoal.value.goalId) === String(goalId)) {
      currentGoal.value = { ...currentGoal.value, ...payload }
    }
    return result
  }

  /**
   * @param {'ACTIVE' | 'PAUSED'} status
   */
  async function updateCurrentGoalStatus(status) {
    if (!currentGoal.value) return
    const goalId = currentGoal.value.goalId
    await goalApi.updateGoalStatus(goalId, status)
    currentGoal.value.status = status
    const targetGoal = goals.value.find((g) => String(g.goalId) === String(goalId))
    if (targetGoal) {
      targetGoal.status = status
    }
  }

  /**
   * 재계산된 실현가능성(recalculatedFeasibility) 결과가 존재할 경우 기존 feasibility 객체에 덮어씌워 병합합니다.
   */
  function applyRecalculatedFeasibility() {
    if (recalculatedFeasibility.value) {
      feasibility.value = {
        ...feasibility.value,
        ...recalculatedFeasibility.value,
      }
    }
  }

  return {
    selectedGoalType,
    selectedGoalPresetId,
    selectedGoalId,
    goalParams,
    feasibility,
    isFeasibilityLoading,
    feasibilityError,
    recalculatedFeasibility,
    feasibilityAdjustment,
    accounts,
    areAccountsLoading,
    accountsError,
    goals,
    selectedGoal,
    goalsError,
    areGoalsLoading,
    currentGoal,
    assets,
    monthlyAvailableMoney,
    dailyAvailableMoney,
    isLoading,
    dashboardError,
    dashboardSupplementaryErrors,
    isSupplementaryLoading,
    selectGoal,
    selectGoalPreset,
    moveToNextStep,
    resetGoalStore,
    fetchGoals,
    fetchDashboardData,
    fetchSupplementaryDashboardData,
    updateGoal,
    updateCurrentGoalStatus,
    fetchFeasibility,
    fetchRecalculatedFeasibility,
    fetchAccounts,
    submitGoalCreation,
    applyRecalculatedFeasibility,
  }
})
