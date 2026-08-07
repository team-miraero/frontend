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
  const historyPage = ref(null)
  const hasMoreHistories = ref(false)
  const isDashboardLoading = ref(false)
  const dashboardError = ref(null)

  // 기존 대시보드 컴포넌트가 최신 API 필드를 사용할 수 있도록 만든 화면용 모델
  const pacemakerView = computed(() => {
    const status = pacemakerStatus.value
    const dashboard = pacemakerDashboard.value
    const currentStatus = dashboard?.status ?? status?.status ?? null
    const referenceDate = dashboard?.todaySaving?.savingDate ?? histories.value[0]?.date
    const referenceMonth = referenceDate?.slice(0, 7)
    const monthlySecuredAmount = referenceMonth
      ? histories.value.reduce((total, item) => {
          const isSavedThisMonth = item.status === 'SAVED' && item.date?.startsWith(referenceMonth)
          return isSavedThisMonth ? total + (item.amount ?? 0) : total
        }, 0)
      : 0

    const historyDates = new Set(
      histories.value.filter((item) => item.status === 'SAVED').map((item) => item.date)
    )
    let calculatedStreak = 0
    let streakDate = referenceDate ? new Date(`${referenceDate}T00:00:00`) : null
    while (streakDate && historyDates.has(formatDateKey(streakDate))) {
      calculatedStreak += 1
      streakDate.setDate(streakDate.getDate() - 1)
    }

    return {
      autoSavingId: status?.autoSavingId ?? dashboard?.autoSavingId ?? null,
      registered: status?.registered ?? false,
      status: currentStatus,
      enabled: currentStatus === 'ACTIVE',
      moneyBoxBalance: dashboard?.moneyBox?.balance ?? 0,
      moneyBoxId: dashboard?.moneyBox?.moneyBoxId ?? null,
      maskedAccountNumber: dashboard?.moneyBox?.maskedAccountNumber ?? '',
      todaySavingAmount:
        dashboard?.todaySaving?.status === 'SUCCESS' ? (dashboard.todaySaving.amount ?? 0) : 0,
      currentStreak: histories.value.length ? calculatedStreak : (dashboard?.currentStreak ?? 0),
      maxAmount: dashboard?.maxAmount ?? 0,
      monthlySecuredAmount,
      monthlySuccessCount: dashboard?.monthlySuccessCount ?? 0,
      weeklyStreak: dashboard?.weeklyStreak ?? [],
    }
  })

  async function fetchPacemakerStatus() {
    pacemakerStatus.value = await pacemakerApi.getPacemakerStatus()
    return pacemakerStatus.value
  }

  function formatDateKey(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
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
    isDashboardLoading.value = true
    dashboardError.value = null

    try {
      pacemakerDashboard.value = await pacemakerApi.getPacemakerDashboard()
    } catch (error) {
      dashboardError.value = error
      throw error
    } finally {
      isDashboardLoading.value = false
    }
  }

  async function fetchDepositTargets() {
    const result = await pacemakerApi.getPacemakerGoals()
    depositTargets.value = result?.goals ?? []
    return depositTargets.value
  }

  async function togglePacemaker() {
    if (!pacemakerStatus.value?.autoSavingId) return

    const nextStatus = pacemakerStatus.value.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
    const result = await pacemakerApi.updatePacemakerStatus(
      pacemakerStatus.value.autoSavingId,
      nextStatus
    )

    pacemakerStatus.value = { ...pacemakerStatus.value, ...result }
    if (pacemakerDashboard.value) pacemakerDashboard.value.status = result.status
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
    const result = await pacemakerApi.getPacemakerHistories(params)
    histories.value = result.content
    historyPage.value = result
    hasMoreHistories.value = !result.last
  }

  return {
    pacemakerStatus,
    pacemakerDashboard,
    pacemakerView,
    depositTargets,
    histories,
    historyPage,
    hasMoreHistories,
    isDashboardLoading,
    dashboardError,
    fetchPacemakerStatus,
    setupPacemaker,
    fetchPacemakerDashboard,
    fetchDepositTargets,
    togglePacemaker,
    updateMaxAmount,
    depositToGoal,
    fetchHistories,
  }
})
