// 페이스메이커 상태, 대시보드, 자동 저축 내역 관리
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import * as pacemakerApi from '@/features/pacemaker/api/pacemaker.api'

export const usePacemakerStore = defineStore('feature-pacemaker', () => {
  /** @type {import('vue').Ref<import('@/features/pacemaker/api/pacemaker.api').PacemakerStatus | null>} */
  const pacemakerStatus = ref(null)
  /** @type {import('vue').Ref<import('@/features/pacemaker/api/pacemaker.api').PacemakerDashboard | null>} */
  const pacemakerDashboard = ref(null)
  const depositTargets = ref([])
  const histories = ref([])
  const isDepositTargetsLoading = ref(false)
  const depositTargetsError = ref(null)
  const isHistoriesLoading = ref(false)
  const historiesError = ref(null)
  const isToggling = ref(false)
  const toggleError = ref(null)
  const dashboardError = ref(null)
  /** @type {import('vue').Ref<Record<number, import('@/features/pacemaker/api/pacemaker.api').AccountDetail>>} */
  const accountDetails = ref({})
  const accountDetailRequests = new Map()
  let depositTargetsRequestId = 0
  let historiesRequestId = 0

  // 기존 대시보드 컴포넌트가 최신 API 필드를 사용할 수 있도록 만든 화면용 모델
  const pacemakerView = computed(() => {
    const status = pacemakerStatus.value
    const dashboard = pacemakerDashboard.value
    const currentStatus = dashboard?.status ?? status?.status ?? null
    const referenceDate = getLatestReferenceDate(
      dashboard?.todaySaving?.savingDate,
      histories.value
    )
    const referenceMonth = referenceDate?.slice(0, 7)
    const monthlySecuredAmount = referenceMonth
      ? histories.value.reduce((total, item) => {
          const isSavedThisMonth = item.status === 'SAVED' && item.date?.startsWith(referenceMonth)
          return isSavedThisMonth ? total + (item.amount ?? 0) : total
        }, 0)
      : 0

    return {
      registered: status?.registered ?? false,
      status: currentStatus,
      enabled: currentStatus === 'ACTIVE',
      moneyBoxBalance: dashboard?.moneyBox?.balance ?? 0,
      moneyBoxId: dashboard?.moneyBox?.moneyBoxId ?? null,
      maskedAccountNumber: dashboard?.moneyBox?.maskedAccountNumber ?? '',
      todaySavingAmount:
        dashboard?.todaySaving?.status === 'SUCCESS' ? (dashboard.todaySaving.amount ?? 0) : 0,
      currentStreak: dashboard?.currentStreak ?? 0,
      maxAmount: dashboard?.maxAmount ?? 0,
      monthlySecuredAmount,
      monthlySuccessCount: dashboard?.monthlySuccessCount ?? 0,
    }
  })

  async function fetchPacemakerStatus() {
    pacemakerStatus.value = await pacemakerApi.getPacemakerStatus()
    return pacemakerStatus.value
  }

  function getLatestReferenceDate(todaySavingDate, historyItems) {
    const candidates = [todaySavingDate, ...historyItems.map((item) => item.date)]
      .filter(Boolean)
      .map((date) => String(date).slice(0, 10))
      .sort()
    return candidates.at(-1) ?? null
  }

  /**
   * SAVING 저금통 개설과 상한액 설정을 순서대로 처리합니다.
   * 재시도 시 현재 상태를 먼저 조회해 이미 생성된 저금통을 중복 생성하지 않습니다.
   * @param {number} maxAmount
   */
  async function setupPacemaker(maxAmount) {
    let status = await fetchPacemakerStatus()

    if (!status.registered) {
      await pacemakerApi.createPacemakerMoneyBox()
    }

    const maxAmountResult = await pacemakerApi.updatePacemakerMaxAmount(maxAmount)
    status = await fetchPacemakerStatus()

    if (!status.registered || !status.autoSavingId) {
      throw new Error('페이스메이커 개설 상태를 확인할 수 없습니다.')
    }

    if (status.status !== 'ACTIVE') {
      status = await pacemakerApi.updatePacemakerStatus(status.autoSavingId, 'ACTIVE')
      pacemakerStatus.value = status
    }

    return { status, maxAmount: maxAmountResult }
  }

  async function fetchPacemakerDashboard() {
    try {
      pacemakerDashboard.value = await pacemakerApi.getPacemakerDashboard()
      dashboardError.value = null
      return pacemakerDashboard.value
    } catch (error) {
      dashboardError.value = error
      throw error
    }
  }

  async function fetchDepositTargets() {
    const requestId = ++depositTargetsRequestId
    isDepositTargetsLoading.value = true

    try {
      const result = await pacemakerApi.getPacemakerGoals()
      if (requestId === depositTargetsRequestId) {
        depositTargets.value = result?.goals ?? []
        depositTargetsError.value = null
      }
      return depositTargets.value
    } catch (error) {
      if (requestId === depositTargetsRequestId) depositTargetsError.value = error
      throw error
    } finally {
      if (requestId === depositTargetsRequestId) isDepositTargetsLoading.value = false
    }
  }

  /**
   * 계좌/저금통 상세(accountName 등)를 조회해 캐시합니다. 이미 캐시됐거나 요청 중이면 그대로 재사용합니다.
   * @param {number} accountId
   * @returns {Promise<import('@/features/pacemaker/api/pacemaker.api').AccountDetail | null>}
   */
  async function fetchAccountDetail(accountId) {
    if (!accountId) return null
    if (accountDetails.value[accountId]) return accountDetails.value[accountId]
    if (accountDetailRequests.has(accountId)) return accountDetailRequests.get(accountId)

    const request = pacemakerApi
      .getAccountDetail(accountId)
      .then((detail) => {
        accountDetails.value = { ...accountDetails.value, [accountId]: detail }
        return detail
      })
      .catch(() => null)
      .finally(() => accountDetailRequests.delete(accountId))

    accountDetailRequests.set(accountId, request)
    return request
  }

  async function togglePacemaker() {
    if (!pacemakerStatus.value?.autoSavingId || isToggling.value) return null

    const nextStatus = pacemakerStatus.value.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
    isToggling.value = true
    toggleError.value = null

    try {
      const result = await pacemakerApi.updatePacemakerStatus(
        pacemakerStatus.value.autoSavingId,
        nextStatus
      )

      pacemakerStatus.value = { ...pacemakerStatus.value, ...result }
      if (pacemakerDashboard.value) pacemakerDashboard.value.status = result.status
      return result
    } catch (error) {
      toggleError.value = error
      return null
    } finally {
      isToggling.value = false
    }
  }

  async function updateMaxAmount(maxAmount) {
    const result = await pacemakerApi.updatePacemakerMaxAmount(maxAmount)
    if (pacemakerDashboard.value) pacemakerDashboard.value.maxAmount = result.maxAmount
    return result
  }

  async function depositToGoal(accountId, amount, moneyBoxId) {
    const result = await pacemakerApi.depositToGoalAccount(accountId, amount, moneyBoxId)
    if (pacemakerDashboard.value?.moneyBox) {
      pacemakerDashboard.value.moneyBox.balance = result.remainingBalance
    }
    return result
  }

  async function fetchHistories(params) {
    const requestId = ++historiesRequestId
    isHistoriesLoading.value = true

    try {
      const result = await pacemakerApi.getPacemakerHistories(params)
      if (requestId === historiesRequestId) {
        histories.value = result?.content ?? []
        historiesError.value = null
      }
      return histories.value
    } catch (error) {
      if (requestId === historiesRequestId) historiesError.value = error
      throw error
    } finally {
      if (requestId === historiesRequestId) isHistoriesLoading.value = false
    }
  }

  return {
    pacemakerStatus,
    pacemakerDashboard,
    pacemakerView,
    depositTargets,
    histories,
    isDepositTargetsLoading,
    depositTargetsError,
    isHistoriesLoading,
    historiesError,
    isToggling,
    toggleError,
    dashboardError,
    accountDetails,
    fetchPacemakerStatus,
    setupPacemaker,
    fetchPacemakerDashboard,
    fetchDepositTargets,
    fetchAccountDetail,
    togglePacemaker,
    updateMaxAmount,
    depositToGoal,
    fetchHistories,
  }
})
